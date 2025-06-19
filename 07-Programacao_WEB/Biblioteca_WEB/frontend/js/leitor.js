document.addEventListener("DOMContentLoaded", () => {
    // --- 1. VERIFICAÇÃO DE ACESSO E SELETORES DE ELEMENTOS ---
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || usuario.perfil !== "leitor") {
        window.location.href = "index.html";
        return;
    }

    const nomeLeitorSpan = document.getElementById("nome-leitor");
    const tabelaLivrosBody = document
        .getElementById("tabela-livros-disponiveis")
        .querySelector("tbody");
    const tabelaMeusEmprestimosBody = document
        .getElementById("tabela-meus-emprestimos")
        .querySelector("tbody");

    // --- 2. ESTADO DA APLICAÇÃO ---
    let todosOsLivros = [];
    let meusEmprestimos = [];

    // --- 3. FUNÇÕES DE RENDERIZAÇÃO (Manipulação do DOM) ---

    function renderizarTabelaLivros() {
        tabelaLivrosBody.innerHTML = "";
        const idsLivrosEmprestimo = new Set(
            meusEmprestimos
                .filter((e) =>
                    ["ativo", "pendente", "atrasado"].includes(e.status)
                )
                .map((e) => e.livro_id)
        );

        todosOsLivros.forEach((livro) => {
            const tr = document.createElement("tr");

            const emEmprestimo = idsLivrosEmprestimo.has(livro.id);
            const semEstoque = livro.quantidade_disponivel === 0;

            tr.innerHTML = `
                    <td>${livro.id}</td>
                    <td>${livro.titulo}</td>
                    <td>${livro.autor}</td>
                    <td>${livro.ano_publicacao || "N/A"}</td>
                    <td>${livro.quantidade_disponivel}</td>
                    <td>
                        <button
                        class="btn-solicitar"
                        data-id="${livro.id}"
                        ${
                            emEmprestimo || semEstoque
                                ? `disabled title="O livro está em empréstimo OU não tem estoque"`
                                : ""
                        }>
                            Solicitar Empréstimo
                        </button>
                    </td>
                `;
            tabelaLivrosBody.appendChild(tr);
        });
    }

    function renderizarTabelaMeusEmprestimos() {
        tabelaMeusEmprestimosBody.innerHTML = "";
        meusEmprestimos.forEach((emprestimo) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${emprestimo.id}</td>    
                <td>${emprestimo.Livro?.titulo || "Livro Excluído"}</td>
                <td>${new Date(
                    emprestimo.data_emprestimo
                ).toLocaleDateString()}</td>
                <td>${new Date(
                    emprestimo.data_devolucao_prevista
                ).toLocaleDateString()}</td>
                <td>${emprestimo.status}</td>
            `;
            tabelaMeusEmprestimosBody.appendChild(tr);
        });
    }

    // --- 4. FUNÇÕES DE API (Busca de Dados) ---

    async function carregarDadosDaPagina() {
        try {
            const [livrosResponse, emprestimosResponse] = await Promise.all([
                fetch("http://localhost:3000/livros"),
                fetch(
                    `http://localhost:3000/usuarios/${usuario.id}/emprestimos`
                ),
            ]);
            todosOsLivros = await livrosResponse.json();
            meusEmprestimos = await emprestimosResponse.json();

            renderizarTabelaMeusEmprestimos();
            renderizarTabelaLivros();
        } catch (error) {
            console.error("Erro ao carregar os dados da página:", error);
            alert("Não foi possível carregar os dados do servidor.");
        }
    }

    // --- 5. MANIPULADORES DE EVENTOS (Handlers) ---

    async function handleSolicitarEmprestimo(event) {
        if (!event.target.classList.contains("btn-solicitar")) return;

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

        const dataCorrigida = new Date(dataInput + "T12:00:00");
        const dadosEmprestimo = {
            livro_id: livroId,
            leitor_id: usuario.id,
            data_devolucao_prevista: dataCorrigida,
        };

        try {
            const response = await fetch("http://localhost:3000/emprestimos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosEmprestimo),
            });

            if (response.ok) {
                alert(
                    "Solicitação de empréstimo enviada com sucesso! Aguardando aprovação do bibliotecário."
                );
                carregarDadosDaPagina(); // Recarrega todos os dados da página
            } else {
                const erro = await response.json();
                throw new Error(erro.error);
            }
        } catch (error) {
            alert("Erro ao solicitar empréstimo: " + error.message);
        }
    }

    // --- 6. INICIALIZAÇÃO ---

    function init() {
        nomeLeitorSpan.textContent = usuario.nome;
        tabelaLivrosBody.addEventListener("click", handleSolicitarEmprestimo);
        carregarDadosDaPagina();
    }

    init(); // Roda a função de inicialização
});
