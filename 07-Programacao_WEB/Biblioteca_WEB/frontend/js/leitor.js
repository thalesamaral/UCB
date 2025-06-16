document.addEventListener("DOMContentLoaded", () => {
    // 1. VERIFICAÇÃO DE LOGIN
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
        window.location.href = "index.html"; // Se não está logado, volta para o login
        return;
    }

    // Personaliza a saudação
    document.getElementById("nome-leitor").textContent = usuario.nome;

    const tabelaLivros = document
        .getElementById("tabela-livros-disponiveis")
        .querySelector("tbody");
    const tabelaMeusEmprestimos = document
        .getElementById("tabela-meus-emprestimos")
        .querySelector("tbody");

    // --- FUNÇÕES DE CARREGAMENTO ---

    async function carregarLivrosDisponiveis() {
        const response = await fetch("http://localhost:3000/livros");
        const livros = await response.json();
        tabelaLivros.innerHTML = "";
        livros.forEach((livro) => {
            // Mostra apenas livros com quantidade > 0
            if (livro.quantidade_disponivel > 0) {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${livro.id}</td>
                    <td>${livro.titulo}</td>
                    <td>${livro.autor}</td>
                    <td>${livro.ano_publicacao || "N/A"}</td>
                    <td><button class="btn-solicitar" data-id="${
                        livro.id
                    }">Solicitar Empréstimo</button></td>
                `;
                tabelaLivros.appendChild(tr);
            }
        });
    }

    async function carregarMeusEmprestimos() {
        // Usa a nova rota para pegar empréstimos apenas do usuário logado
        const response = await fetch(
            `http://localhost:3000/usuarios/${usuario.id}/emprestimos`
        );
        const emprestimos = await response.json();
        tabelaMeusEmprestimos.innerHTML = "";
        emprestimos.forEach((emprestimo) => {
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
    }

    // --- LÓGICA PARA SOLICITAR EMPRÉSTIMO ---
    tabelaLivros.addEventListener("click", async (event) => {
        if (event.target.classList.contains("btn-solicitar")) {
            const livroId = event.target.dataset.id;

            // Define a data de devolução para 14 dias a partir de hoje
            const dataDevolucao = new Date();
            dataDevolucao.setDate(dataDevolucao.getDate() + 14);

            const dadosEmprestimo = {
                livro_id: livroId,
                leitor_id: usuario.id,
                data_devolucao_prevista: dataDevolucao
                    .toISOString()
                    .split("T")[0], // Formato YYYY-MM-DD
            };

            const response = await fetch("http://localhost:3000/emprestimos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosEmprestimo),
            });

            if (response.ok) {
                alert("Empréstimo solicitado com sucesso!");
                // Recarrega ambas as listas para refletir a mudança no estoque e nos "meus empréstimos"
                carregarLivrosDisponiveis();
                carregarMeusEmprestimos();
            } else {
                const erro = await response.json();
                alert("Erro ao solicitar empréstimo: " + erro.error);
            }
        }
    });

    // Carrega os dados iniciais
    carregarLivrosDisponiveis();
    carregarMeusEmprestimos();
});
