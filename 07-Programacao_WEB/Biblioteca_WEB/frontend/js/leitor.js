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
                            <button class="btn-solicitar" data-id="${
                                livro.id
                            }" ${jaEmprestado ? "disabled" : ""}>
                                Solicitar Empréstimo
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
            if (
                emprestimo.status === "ativo" ||
                emprestimo.status === "pendente"
            ) {
                idsLivrosAtivos.add(emprestimo.livro_id);
            }
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${emprestimo.id}</td>
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

    // --- LÓGICA DE SOLICITAÇÃO (AGORA PREENCHIDA) ---
    tabelaLivros.addEventListener("click", async (event) => {
        // Verifica se o elemento clicado é um botão de solicitar
        if (event.target.classList.contains("btn-solicitar")) {
            const livroId = event.target.dataset.id;

            const dataInput = prompt(
                "Por favor, digite a data prevista de devolução (formato: AAAA-MM-DD):"
            );

            if (!dataInput) {
                alert("Operação cancelada.");
                return;
            }
            if (!/^\d{4}-\d{2}-\d{2}$/.test(dataInput)) {
                alert("Formato de data inválido. Use AAAA-MM-DD.");
                return;
            }

            // --- CORREÇÃO PARA O PROBLEMA DE FUSO HORÁRIO ---
            // Constrói a data no fuso horário local do navegador para evitar a conversão indesejada para UTC.
            // Adicionamos 'T12:00:00' para que a data seja interpretada como meio-dia,
            // o que garante que ela permaneça no dia correto mesmo após conversões de fuso.
            const dataCorrigida = new Date(dataInput + "T12:00:00");

            const dadosEmprestimo = {
                livro_id: livroId,
                leitor_id: usuario.id,
                data_devolucao_prevista: dataCorrigida, // Envia o objeto Date corrigido
            };

            const response = await fetch("http://localhost:3000/emprestimos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosEmprestimo),
            });

            if (response.ok) {
                alert("Empréstimo solicitado com sucesso!");
                iniciarPagina(); // Recarrega todos os dados da página
            } else {
                const erro = await response.json();
                alert("Erro ao solicitar empréstimo: " + erro.error);
            }
        }
    });

    // Inicia a página
    iniciarPagina();
});
