function gerarListaCompras(produtos) {

    const lista = [];

    produtos.forEach(produto => {

        const estoque = Number(produto["Estoque"] || 0);
        const minimo = Number(produto["Estoque Mín"] || 0);

        if (estoque < minimo) {

            lista.push({

                nome: produto["Nome"],

                categoria: produto["Categoria"],

                estoque: estoque,

                minimo: minimo,

                comprar: minimo - estoque

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

    lista.forEach(item => {

        html += `
            <div class="border-bottom py-2">

                <strong>${item.nome}</strong><br>

                Categoria: ${item.categoria}<br>

                Estoque: ${item.estoque} |
                Mínimo: ${item.minimo} |

                <span style="color:red;font-weight:bold;">

                    Comprar ${item.comprar} unidades

                </span>

            </div>
        `;

    });

    div.innerHTML = html;

}
