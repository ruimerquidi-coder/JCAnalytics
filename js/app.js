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
                          function atualizarResumoEstoque(){

    let regular = 0;
    let critico = 0;
    let semEstoque = 0;

    produtos.forEach(produto=>{

        const estoque = Number(produto["Estoque"] || 0);
        const minimo = Number(produto["Estoque Mín"] || 0);

        if(estoque == 0){

            semEstoque++;

        }

        else if(estoque <= minimo){

            critico++;

        }

        else{

            regular++;

        }

    });

    const total = produtos.length;

    document.getElementById("barraRegular").style.width =
        (regular/total*100)+"%";

    document.getElementById("barraRegular").innerText =
        regular;

    document.getElementById("barraCriticos").style.width =
        (critico/total*100)+"%";

    document.getElementById("barraCriticos").innerText =
        critico;

    document.getElementById("barraSemEstoque").style.width =
        (semEstoque/total*100)+"%";

    document.getElementById("barraSemEstoque").innerText =
        semEstoque;

}
                         
