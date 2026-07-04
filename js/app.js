console.log("JC Analytics iniciado");

let produtos = [];
let vendas = [];

async function lerArquivo(file) {
    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = function (e) {

            const data = new Uint8Array(e.target.result);

            const workbook = XLSX.read(data, {
                type: "array"
            });

            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            const json = XLSX.utils.sheet_to_json(sheet);

            resolve(json);

        };

        reader.onerror = reject;

        reader.readAsArrayBuffer(file);

    });
}

async function gerarDashboard() {

    try {

        const arquivoProdutos = document.getElementById("produtos").files[0];
        const arquivoVendas = document.getElementById("vendas").files[0];

        if (!arquivoProdutos || !arquivoVendas) {
            alert("Selecione as duas planilhas.");
            return;
        }

        produtos = await lerArquivo(arquivoProdutos);
        vendas = await lerArquivo(arquivoVendas);

        console.log("Primeiro produto:", produtos[0]);
        console.log("Primeira venda:", vendas[0]);

        document.getElementById("dashboard").classList.remove("d-none");

        document.getElementById("totalProdutos").innerText = produtos.length;
        document.getElementById("totalVendas").innerText = vendas.length;

        calcularIndicadores();
        document.getElementById("resumoProdutos").innerText = produtos.length;
document.getElementById("resumoVendas").innerText = vendas.length;
document.getElementById("resumoFaturamento").innerText =
    document.getElementById("faturamento").innerText;
document.getElementById("resumoCriticos").innerText =
    document.getElementById("criticos").innerText;
        atualizarResumoEstoque();
        validarBaseProdutos();
        const motor = criarMotorCompra(produtos, vendas);

console.log("Motor de Compra:", motor);
        const criticos = calcularProdutosCriticos(produtos);

mostrarProdutosCriticos(criticos);
        const compras = gerarListaCompras(produtos);

mostrarListaCompras(compras);

    } catch (erro) {

        console.error("Erro:", erro);
    alert("Erro ao ler as planilhas.");

    }

}

function calcularIndicadores() {

    let faturamento = 0;

    vendas.forEach(item => {

        let valor = item["Valor. Tot. Item"];

        if (valor === undefined || valor === null) return;

        if (typeof valor === "string") {
            valor = valor.replace(",", ".");
        }

        valor = parseFloat(valor);

        if (!isNaN(valor)) {
            faturamento += valor;
        }

    });

    console.log("Faturamento calculado:", faturamento);

    document.getElementById("faturamento").innerText =
        faturamento.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    // Resumo Executivo

document.getElementById("resumoFaturamento").innerText =
    faturamento.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

document.getElementById("resumoProdutos").innerText =
    produtos.length;

document.getElementById("resumoVendas").innerText =
    vendas.length;

document.getElementById("resumoCriticos").innerText =
    calcularProdutosCriticos(produtos).length;

}

document.addEventListener("DOMContentLoaded", function () {

    document
        .getElementById("btnDashboard")
        .addEventListener("click", gerarDashboard);

});
                         function atualizarResumoEstoque() {

    const resumo = calcularResumoEstoque(produtos);

    document.getElementById("barraRegular").style.width =
        (resumo.regular / resumo.totalAtivos * 100) + "%";

    document.getElementById("barraRegular").innerText =
        resumo.regular;

    document.getElementById("barraCriticos").style.width =
        (resumo.abaixoMinimo / resumo.totalAtivos * 100) + "%";

    document.getElementById("barraCriticos").innerText =
        resumo.abaixoMinimo;

    document.getElementById("barraSemEstoque").style.width =
        (resumo.semEstoque / resumo.totalAtivos * 100) + "%";

    document.getElementById("barraSemEstoque").innerText =
        resumo.semEstoque;

    // Cards superiores
    document.getElementById("criticos").innerText =
        resumo.atencao;

    document.getElementById("resumoCriticos").innerText =
        resumo.atencao;

}
function validarBaseProdutos() {

    let ativos = 0;
    let inativos = 0;
    let estoqueZero = 0;
    let estoqueNegativo = 0;
    let abaixoMinimo = 0;
    let categorias = new Set();

    produtos.forEach(produto => {

        const status = (produto["Status Venda"] || "").trim();

        const estoque = Number(produto["Estoque"] || 0);

        const minimo = Number(produto["Estoque Mín"] || 0);

        const categoria = produto["Categoria"];

        if (categoria)
            categorias.add(categoria);

        if (status === "Ativo")
            ativos++;
        else
            inativos++;

        if (estoque == 0)
            estoqueZero++;

        if (estoque < 0)
            estoqueNegativo++;

        if (estoque < minimo)
            abaixoMinimo++;

    });

    console.log("========== VALIDAÇÃO ==========");

    console.log("Produtos:", produtos.length);

    console.log("Ativos:", ativos);

    console.log("Inativos:", inativos);

    console.log("Estoque Zero:", estoqueZero);

    console.log("Estoque Negativo:", estoqueNegativo);

    console.log("Abaixo do mínimo:", abaixoMinimo);

    console.log("Categorias:", categorias.size);

}
                         
