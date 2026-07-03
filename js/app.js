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

        const arquivoProdutos =
            document.getElementById("produtos").files[0];

        const arquivoVendas =
            document.getElementById("vendas").files[0];

        if (!arquivoProdutos || !arquivoVendas) {

            alert("Selecione as duas planilhas.");

            return;

        }

        produtos = await lerArquivo(arquivoProdutos);

        vendas = await lerArquivo(arquivoVendas);

        document
            .getElementById("dashboard")
            .classList.remove("d-none");

        document
            .getElementById("totalProdutos")
            .innerText = produtos.length;

        document
            .getElementById("totalVendas")
            .innerText = vendas.length;

        calcularIndicadores();

    }

    catch (erro) {

        console.error(erro);

        alert("Erro ao ler as planilhas.");

    }

}

function calcularIndicadores() {

    let faturamento = 0;

    vendas.forEach(item => {

        faturamento += Number(item["Valor Total"] || 0);

    });

    document
        .getElementById("faturamento")
        .innerText = faturamento.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}

document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("btnDashboard")
        .addEventListener("click", gerarDashboard);

});
