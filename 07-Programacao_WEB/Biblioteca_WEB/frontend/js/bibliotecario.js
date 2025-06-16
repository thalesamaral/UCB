document.addEventListener("DOMContentLoaded", () => {
    // 1. VERIFICAÇÃO DE LOGIN E PERFIL
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || usuario.perfil !== "bibliotecario") {
        window.location.href = "index.html";
        return; // Impede a execução do resto do script
    }

    const tabelaLivros = document
        .getElementById("tabela-livros")
        .querySelector("tbody");
    const tabelaEmprestimos = document
        .getElementById("tabela-emprestimos")
        .querySelector("tbody");
    const formAdicionarLivro = document.getElementById("form-adicionar-livro");

    // --- FUNÇÕES PARA CARREGAR DADOS ---

    async function carregarLivros() {
        const response = await fetch("http://localhost:3000/livros");
        const livros = await response.json();
        tabelaLivros.innerHTML = ""; // Limpa a tabela antes de preencher
        livros.forEach((livro) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${livro.id}</td>
                <td>${livro.titulo}</td>
                <td>${livro.autor}</td>
                <td>${livro.ano_publicacao || "N/A"}</td>
                <td>${livro.quantidade_disponivel}</td>
                <td>
                    <button class="btn-excluir" data-id="${
                        livro.id
                    }">Excluir</button>
                </td>
            `;
            tabelaLivros.appendChild(tr);
        });
    }

    async function carregarEmprestimos() {
        const response = await fetch("http://localhost:3000/emprestimos");
        const emprestimos = await response.json();
        tabelaEmprestimos.innerHTML = "";
        // Filtra para mostrar apenas empréstimos com status 'ativo'
        const emprestimosAtivos = emprestimos.filter(
            (e) => e.status === "ativo"
        );

        emprestimos.forEach((emprestimo) => {
            const tr = document.createElement("tr");
            const nomeLeitor = emprestimo.Usuario?.nome || "Usuário Deletado";
            const tituloLivro = emprestimo.Livro?.titulo || "Livro Deletado";

            tr.innerHTML = `
                <td>${emprestimo.id}</td>
                <td>${nomeLeitor}</td>
                <td>${tituloLivro}</td>
                <td>${new Date(
                    emprestimo.data_emprestimo
                ).toLocaleDateString()}</td>
                <td>${new Date(
                    emprestimo.data_devolucao_prevista
                ).toLocaleDateString()}</td>
                <td>
                ${
                    emprestimo.status === "ativo"
                        ? `<button class="btn-devolver" data-id="${emprestimo.id}">Aprovar Devolução</button>`
                        : "Devolvido"
                }
                </td>
            `;
            tabelaEmprestimos.appendChild(tr);
        });
    }

    // --- LÓGICA PARA ADICIONAR LIVRO ---
    formAdicionarLivro.addEventListener("submit", async (event) => {
        event.preventDefault();
        const dadosLivro = {
            titulo: document.getElementById("livro-titulo").value,
            autor: document.getElementById("livro-autor").value,
            ano_publicacao: document.getElementById("livro-ano").value,
            quantidade_disponivel: document.getElementById("livro-qtd").value,
        };

        await fetch("http://localhost:3000/livros", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosLivro),
        });

        alert("Livro adicionado com sucesso!");
        formAdicionarLivro.reset();
        carregarLivros(); // Recarrega a lista de livros
    });

    // --- LÓGICA PARA EXCLUIR LIVRO (usando delegação de eventos) ---
    tabelaLivros.addEventListener("click", async (event) => {
        if (event.target.classList.contains("btn-excluir")) {
            const id = event.target.dataset.id;
            if (
                confirm(`Tem certeza que deseja excluir o livro com ID ${id}?`)
            ) {
                await fetch(`http://localhost:3000/livros/${id}`, {
                    method: "DELETE",
                });
                alert("Livro excluído com sucesso!");
                carregarLivros(); // Recarrega a lista
            }
        }
    });

    // --- LÓGICA PARA DEVOLVER LIVRO ---
    tabelaEmprestimos.addEventListener("click", async (event) => {
        if (event.target.classList.contains("btn-devolver")) {
            const id = event.target.dataset.id;
            await fetch(`http://localhost:3000/emprestimos/${id}/devolver`, {
                method: "PUT",
            });
            alert("Devolução registrada com sucesso!");
            // Recarrega ambas as listas, pois o estoque do livro mudou
            carregarLivros();
            carregarEmprestimos();
        }
    });

    // Carrega os dados iniciais ao abrir a página
    carregarLivros();
    carregarEmprestimos();
});
