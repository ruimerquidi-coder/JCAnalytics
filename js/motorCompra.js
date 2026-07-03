/*
===========================================
JC Analytics
Motor de Compra Inteligente
Versão 0.1
===========================================
*/

function normalizarTexto(texto) {

    if (!texto) return "";

    return texto
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

}

function criarMotorCompra(produtos, vendas) {

    const motor = {};

    // Cria estrutura dos produtos

    produtos.forEach(produto => {

        const chave = normalizarTexto(produto["Nome"]);

        motor[chave] = {

            nome: produto["Nome"],

            categoria: produto["Categoria"],

            estoque: Number(produto["Estoque"] || 0),

            estoqueMinimo: Number(produto["Estoque Mín"] || 0),

            precoCusto: Number(produto["Preço Custo"] || 0),

            precoVenda: Number(produto["Preço Venda"] || 0),

            quantidadeVendida: 0,

            mediaDiaria: 0

        };

    });

    // Soma vendas

    vendas.forEach(venda => {

        const chave = normalizarTexto(venda["Nome Prod."]);

        if (motor[chave]) {

            motor[chave].quantidadeVendida +=
                Number(venda["Qtd."] || 0);

        }

    });

    // Calcula média diária

    Object.values(motor).forEach(produto => {

        produto.mediaDiaria =
            produto.quantidadeVendida / 30;

    });

    return motor;

}
