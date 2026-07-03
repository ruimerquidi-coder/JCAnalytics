function calcularProdutosCriticos(produtos) {

    const criticos = [];

    produtos.forEach(produto => {

        const estoque = Number(produto["Estoque"] || 0);
        const minimo = Number(produto["Estoque Mínimo"] || 0);

        if (estoque <= minimo) {

            criticos.push({
                nome: produto["Nome do Produto"],
                estoque: estoque,
                minimo: minimo
            });

        }

    });

    return criticos;

}

function mostrarProdutosCriticos(lista) {

    const div = document.getElementById("listaCriticos");

    document.getElementById("criticos").innerText = lista.length;

    if (lista.length === 0) {

        div.innerHTML = "<p>Nenhum produto crítico encontrado.</p>";

        return;

    }

    let html = "";

    lista.forEach(item => {

        html += `
            <div style="padding:10px;border-bottom:1px solid #ddd;">
                <strong>${item.nome}</strong><br>
                Estoque: ${item.estoque} |
                Mínimo: ${item.minimo}
            </div>
        `;

    });

    div.innerHTML = html;

}
