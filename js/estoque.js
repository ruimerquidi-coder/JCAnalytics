function calcularProdutosCriticos(produtos) {

    const criticos = [];

    produtos.forEach(produto => {

        const estoque = Number(produto["Estoque"] || 0);
        const minimo = Number(produto["Estoque Mín"] || 0);

        if (estoque <= minimo) {

            criticos.push({
                nome: produto["Nome"],
                categoria: produto["Categoria"],
                estoque: estoque,
                minimo: minimo,
                custo: Number(produto["Preço Custo"] || 0),
                venda: Number(produto["Preço Venda"] || 0),
                situacao: produto["Sit. Estoque"]
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
            <div class="border-bottom py-3">
                <strong>${item.nome}</strong><br>
                Categoria: ${item.categoria}<br>
                Estoque: <b>${item.estoque}</b> |
                Mínimo: <b>${item.minimo}</b> |
                Situação: <b>${item.situacao}</b>
            </div>
        `;

    });

    div.innerHTML = html;

}
