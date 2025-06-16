document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("nome-leitor").textContent = usuario.nome;

    const tabelaLivros = document
        .getElementById("tabela-livros-disponiveis")
        .querySelector("tbody");
    const tabelaMeusEmprestimos = document
        .getElementById("tabela-meus-emprestimos")
        .querySelector("tbody");

    // --- FUNÇÕES DE CARREGAMENTO (ATUALIZADAS) ---

    // Agora esta função recebe os IDs dos livros já emprestados pelo usuário
    async function carregarLivrosDisponiveis(idsLivrosEmprestados = new Set()) {
        const response = await fetch("http://localhost:3000/livros");
        const livros = await response.json();
        tabelaLivros.innerHTML = "";
        livros.forEach((livro) => {
            if (livro.quantidade_disponivel > 0) {
                const tr = document.createElement("tr");
                const jaEmprestado = idsLivrosEmprestados.has(livro.id);

                tr.innerHTML = `
                    <td>${livro.id}</td>
                    <td>${livro.titulo}</td>
                    <td>${livro.autor}</td>
                    <td>${livro.ano_publicacao || "N/A"}</td>
                    <td>${livro.quantidade_disponivel}</td>
                    <td>
                        <button class="btn-solicitar" data-id="${livro.id}" ${
                    jaEmprestado ? "disabled" : ""
                }>
                            ${
                                jaEmprestado
                                    ? "Emprestado"
                                    : "Solicitar Empréstimo"
                            }
                        </button>
                    </td>
                `;
                tabelaLivros.appendChild(tr);
            }
        });
    }

    // Esta função agora retorna os IDs dos livros com empréstimo ativo
    async function carregarMeusEmprestimos() {
        const response = await fetch(
            `http://localhost:3000/usuarios/${usuario.id}/emprestimos`
        );
        const emprestimos = await response.json();
        tabelaMeusEmprestimos.innerHTML = "";
        const idsLivrosAtivos = new Set();

        emprestimos.forEach((emprestimo) => {
            if (emprestimo.status === "ativo") {
                idsLivrosAtivos.add(emprestimo.livro_id);
            }
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${emprestimo.Livro.titulo}</td>
                <td>${new Date(
                    emprestimo.data_emprestimo
                ).toLocaleDateString()}</td>
                <td>${new Date(
                    emprestimo.data_devolucao_prevista
                ).toLocaleDateString()}</td>
                <td>${emprestimo.status}</td>
            `;
            tabelaMeusEmprestimos.appendChild(tr);
        });
        return idsLivrosAtivos; // Retorna o set de IDs
    }

    // --- NOVA FUNÇÃO PARA INICIAR A PÁGINA ---
    async function iniciarPagina() {
        const idsAtivos = await carregarMeusEmprestimos();
        await carregarLivrosDisponiveis(idsAtivos);
    }

    // Lógica de Solicitação (sem alterações)
    tabelaLivros.addEventListener("click", async (event) => {
        /* ...código existente... */
    });

    // Inicia a página
    iniciarPagina();
});
