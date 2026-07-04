function gerarListaCompras(produtos) {

    const lista = [];

    produtos.forEach(produto => {

        const nome = produto["Nome"];

        // Ignora linhas inválidas
        if (!nome || nome.toString().startsWith("Total")) {
            return;
        }
        const status = (produto["Status Venda"] || "").trim();

        if (status !== "Ativo") {
            return;
}

        const estoque = Number(produto["Estoque"] || 0);
        const minimo = Number(produto["Estoque Mín"] || 0);
        const medida = (produto["Medida"] || "un").toLowerCase();

        if (estoque < minimo) {

            let comprar = minimo - estoque;

            // Arredondamento conforme a unidade
            if (medida === "un") {
                comprar = Math.ceil(comprar);
            } else {
                comprar = Number(comprar.toFixed(2));
            }

            lista.push({

                nome: nome,
                categoria: produto["Categoria"] || "-",
                estoque: estoque,
                minimo: minimo,
                comprar: comprar,
                medida: medida

            });

        }

    });

    lista.sort((a, b) => b.comprar - a.comprar);

    return lista;

}

function mostrarListaCompras(lista) {

    const div = document.getElementById("listaCompras");

    if (lista.length === 0) {

        div.innerHTML = "<p>Nenhum produto precisa ser comprado.</p>";
        return;

    }

    let html = "";

    // Mostra somente os 15 primeiros
    lista.slice(0, 15).forEach(item => {

        let estoqueTexto =
            item.medida === "un"
                ? item.estoque
                : item.estoque.toFixed(2).replace(".", ",");

        let minimoTexto =
            item.medida === "un"
                ? item.minimo
                : item.minimo.toFixed(2).replace(".", ",");

        let comprarTexto =
            item.medida === "un"
                ? item.comprar
                : item.comprar.toFixed(2).replace(".", ",");

let estoqueHtml = "";

if (item.estoque < 0) {

    estoqueHtml = `
        <span class="text-danger fw-bold">
            ⚠ Estoque Negativo: ${estoqueTexto} ${item.medida}
        </span>
    `;

} else {

    estoqueHtml = `
        Estoque:
        <strong>${estoqueTexto} ${item.medida}</strong>
    `;

}

        html += `
        <div class="border rounded p-3 mb-2">

            <strong>${item.nome}</strong><br>

            <small class="text-muted">
                ${item.categoria}
            </small>

            <br><br>

            Estoque:
            ${estoqueHtml}

            |

            Mínimo:
            <strong>${minimoTexto} ${item.medida}</strong>

            <br>

            <span class="text-danger fw-bold">

                🛒 Comprar ${comprarTexto} ${item.medida}

            </span>

        </div>
        `;

    });

    div.innerHTML = html;

}
