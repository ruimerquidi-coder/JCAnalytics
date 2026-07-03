function calcularProdutosCriticos(produtos) {

    const criticos = [];

    produtos.forEach(produto => {

        const nome = produto["Nome"];

        // Ignora linhas inválidas
        if (!nome || nome.toString().startsWith("Total")) {
            return;
        }

        // Considera somente produtos ativos
        const status = (produto["Status Venda"] || "").trim();

        if (status !== "Ativo") {
            return;
        }

        const estoque = Number(produto["Estoque"] || 0);
        const minimo = Number(produto["Estoque Mín"] || 0);

        if (estoque < minimo) {

            criticos.push({

                nome: nome,
                categoria: produto["Categoria"] || "-",
                estoque: estoque,
                minimo: minimo,
                custo: Number(produto["Preço Custo"] || 0),
                venda: Number(produto["Preço Venda"] || 0),
                situacao: produto["Sit. Estoque"] || "Sem informação"

            });

        }

    });

    return criticos;

}

function mostrarProdutosCriticos(lista) {

    const div = document.getElementById("listaCriticos");

    document.getElementById("criticos").innerText = lista.length;

    document.getElementById("resumoCriticos").innerText = lista.length;

    if (lista.length === 0) {

        div.innerHTML = "<p>Nenhum produto crítico encontrado.</p>";
        return;

    }

    let html = "";

    lista
        .slice(0,15)
        .forEach(item => {

            html += `

            <div class="border rounded p-3 mb-2">

                <strong>${item.nome}</strong><br>

                <small class="text-muted">
                    ${item.categoria}
                </small>

                <br><br>

                Estoque:
                <b>${item.estoque}</b>

                |

                Mínimo:
                <b>${item.minimo}</b>

                <br>

                Situação:

                <span class="text-danger fw-bold">

                    ${item.situacao}

                </span>

            </div>

            `;

        });

    div.innerHTML = html;

}
