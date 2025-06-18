document.addEventListener("DOMContentLoaded", () => {
    // --- 1. VERIFICAÇÃO DE ACESSO E SELETORES DE ELEMENTOS ---
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || usuario.perfil !== "bibliotecario") {
        window.location.href = "index.html";
        return;
    }

    const tabelaLivrosBody = document
        .getElementById("tabela-livros")
        .querySelector("tbody");
    const tabelaEmprestimosBody = document
        .getElementById("tabela-emprestimos")
        .querySelector("tbody");
    const formAdicionarLivro = document.getElementById("form-adicionar-livro");
    const toggleFiltro = document.getElementById("toggle-filtro-emprestimos");
    const modalEditar = document.getElementById("modal-editar");
    const closeButton = document.querySelector(".close-button");
    const formEditarLivro = document.getElementById("form-editar-livro");

    // --- 2. ESTADO DA APLICAÇÃO ---
    let todosOsEmprestimos = [];
    let todosOsLivros = [];

    // --- 3. FUNÇÕES DE RENDERIZAÇÃO (Manipulação do DOM) ---

    function renderizarTabelaLivros() {
        tabelaLivrosBody.innerHTML = "";
        todosOsLivros.forEach((livro) => {
            const tr = document.createElement("tr");
            const botaoExcluirHtml = `<button class="btn-excluir" data-id="${
                livro.id
            }" ${
                !livro.podeSerExcluido
                    ? 'disabled title="Não é possível excluir o livro, pois ele está associado a empréstimos em andamento."'
                    : ""
            }>Excluir</button>`;

            tr.innerHTML = `
                <td>${livro.id}</td>
                <td>${livro.titulo}</td>
                <td>${livro.autor}</td>
                <td>${livro.ano_publicacao || "N/A"}</td>
                <td>${livro.quantidade_disponivel}</td>
                <td>
                    <button class="btn-editar" data-id="${
                        livro.id
                    }">Editar</button>
                    ${botaoExcluirHtml}
                </td>
            `;
            tabelaLivrosBody.appendChild(tr);
        });
    }

    function renderizarTabelaEmprestimos() {
        const mostrarPendentes = toggleFiltro.checked;
        const emprestimosParaRenderizar = mostrarPendentes
            ? todosOsEmprestimos.filter((e) =>
                  ["ativo", "pendente", "atrasado"].includes(e.status)
              )
            : todosOsEmprestimos;

        tabelaEmprestimosBody.innerHTML = "";
        emprestimosParaRenderizar.forEach((emprestimo) => {
            const tr = document.createElement("tr");
            let acaoHtml = "Finalizado";
            if (emprestimo.status === "pendente") {
                acaoHtml = `<button class="btn-aprovar" data-id="${emprestimo.id}">Aprovar</button> <button class="btn-reprovar" data-id="${emprestimo.id}">Reprovar</button>`;
            } else if (["ativo", "atrasado"].includes(emprestimo.status)) {
                acaoHtml = `<button class="btn-devolver" data-id="${emprestimo.id}">Devolver</button> <button class="btn-perda" data-id="${emprestimo.id}">Registrar Perda</button>`;
            }
            tr.innerHTML = `
                <td>${emprestimo.id}</td>
                <td>${emprestimo.Usuario?.nome || "N/A"}</td>
                <td>${emprestimo.Livro?.titulo || "N/A"}</td>
                <td>${new Date(
                    emprestimo.data_emprestimo
                ).toLocaleDateString()}</td>
                <td>${new Date(
                    emprestimo.data_devolucao_prevista
                ).toLocaleDateString()}</td>
                <td>${emprestimo.status}</td>
                <td>${acaoHtml}</td>
            `;
            tabelaEmprestimosBody.appendChild(tr);
        });
    }

    // --- 4. FUNÇÃO PARA CARREGAR DADOS INICIAIS ---

    async function carregarDadosIniciais() {
        try {
            const [livrosResponse, emprestimosResponse] = await Promise.all([
                fetch("http://localhost:3000/livros"),
                fetch("http://localhost:3000/emprestimos"),
            ]);
            todosOsLivros = await livrosResponse.json();
            todosOsEmprestimos = await emprestimosResponse.json();
            renderizarTabelaLivros();
            renderizarTabelaEmprestimos();
        } catch (error) {
            console.error("Erro ao carregar dados iniciais:", error);
            alert("Não foi possível carregar os dados do servidor.");
        }
    }

    // --- 5. MANIPULADORES DE EVENTOS (Handlers) ---

    async function handleAdicionarLivro(event) {
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
        carregarDadosIniciais();
    }

    async function handleTabelaLivrosClick(event) {
        const target = event.target;
        const id = target.dataset.id;
        if (target.classList.contains("btn-excluir")) {
            if (
                confirm(`Tem certeza que deseja excluir o livro com ID ${id}?`)
            ) {
                const response = await fetch(
                    `http://localhost:3000/livros/${id}`,
                    { method: "DELETE" }
                );
                if (response.ok) {
                    alert("Livro excluído com sucesso!");
                    carregarDadosIniciais();
                } else {
                    const erro = await response.json();
                    alert("Erro ao excluir: " + erro.error);
                }
            }
        } else if (target.classList.contains("btn-editar")) {
            abrirModalEditar(id);
        }
    }

    async function handleTabelaEmprestimosClick(event) {
        const target = event.target;
        if (!target.dataset.id) return;

        const id = target.dataset.id;
        let url = "";
        if (target.classList.contains("btn-aprovar")) url = `/aprovar`;
        else if (target.classList.contains("btn-reprovar")) url = `/reprovar`;
        else if (target.classList.contains("btn-devolver")) url = `/devolver`;
        else if (target.classList.contains("btn-perda")) url = `/perda`;
        else return;

        try {
            const response = await fetch(
                `http://localhost:3000/emprestimos/${id}${url}`,
                { method: "PUT" }
            );
            if (!response.ok) {
                const erro = await response.json();
                throw new Error(erro.error);
            }
            alert("Operação realizada com sucesso!");
            carregarDadosIniciais();
        } catch (error) {
            alert("Erro na operação: " + error.message);
        }
    }

    function abrirModalEditar(id) {
        const livro = todosOsLivros.find((l) => l.id == id);
        if (livro) {
            document.getElementById("edit-livro-id").value = livro.id;
            document.getElementById("edit-livro-titulo").value = livro.titulo;
            document.getElementById("edit-livro-autor").value = livro.autor;
            document.getElementById("edit-livro-ano").value =
                livro.ano_publicacao;
            document.getElementById("edit-livro-qtd").value =
                livro.quantidade_disponivel;
            modalEditar.style.display = "block";
        }
    }

    function fecharModal() {
        modalEditar.style.display = "none";
    }

    async function handleEditarLivro(event) {
        event.preventDefault();
        const id = document.getElementById("edit-livro-id").value;
        const dadosAtualizados = {
            titulo: document.getElementById("edit-livro-titulo").value,
            autor: document.getElementById("edit-livro-autor").value,
            ano_publicacao: document.getElementById("edit-livro-ano").value,
            quantidade_disponivel:
                document.getElementById("edit-livro-qtd").value,
        };
        await fetch(`http://localhost:3000/livros/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosAtualizados),
        });
        alert("Livro atualizado com sucesso!");
        fecharModal();
        carregarDadosIniciais();
    }

    // --- 6. INICIALIZAÇÃO ---

    function init() {
        formAdicionarLivro.addEventListener("submit", handleAdicionarLivro);
        formEditarLivro.addEventListener("submit", handleEditarLivro);

        // --- CORREÇÃO APLICADA AQUI ---
        // Usando os nomes corretos das variáveis: 'tabelaLivrosBody' e 'tabelaEmprestimosBody'
        tabelaLivrosBody.addEventListener("click", handleTabelaLivrosClick);
        tabelaEmprestimosBody.addEventListener(
            "click",
            handleTabelaEmprestimosClick
        );

        toggleFiltro.addEventListener("change", renderizarTabelaEmprestimos);
        closeButton.addEventListener("click", fecharModal);
        window.addEventListener("click", (event) => {
            if (event.target == modalEditar) fecharModal();
        });

        carregarDadosIniciais();
    }

    init();
});
