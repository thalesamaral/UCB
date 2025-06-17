document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || usuario.perfil !== "bibliotecario") {
        window.location.href = "index.html";
        return;
    }

    // Seletores dos elementos da página
    const tabelaLivros = document
        .getElementById("tabela-livros")
        .querySelector("tbody");
    const tabelaEmprestimos = document
        .getElementById("tabela-emprestimos")
        .querySelector("tbody");
    const formAdicionarLivro = document.getElementById("form-adicionar-livro");
    const toggleFiltro = document.getElementById("toggle-filtro-emprestimos");

    // Seletores do Modal
    const modalEditar = document.getElementById("modal-editar");
    const closeButton = document.querySelector(".close-button");
    const formEditarLivro = document.getElementById("form-editar-livro");

    let todosOsEmprestimos = []; // <<< Variável para guardar a lista completa
    
    // --- LÓGICA DE RENDERIZAÇÃO E FILTRO ---
    function renderizarTabelaEmprestimos() {
        // Verifica o estado do toggle
        const mostrarApenasAtivos = toggleFiltro.checked;

        const emprestimosParaRenderizar = mostrarApenasAtivos
            ? todosOsEmprestimos.filter(
                  (e) =>
                      e.status === "ativo" ||
                      e.status === "pendente" ||
                      e.status === "atrasado"
              )
            : todosOsEmprestimos;

        tabelaEmprestimos.innerHTML = "";
        emprestimosParaRenderizar.forEach((emprestimo) => {
            const tr = document.createElement("tr");
            let acaoHtml = "";
            if (emprestimo.status === "pendente") {
                acaoHtml = `<button class="btn-aprovar" data-id="${emprestimo.id}">Aprovar</button> <button class="btn-reprovar" data-id="${emprestimo.id}">Reprovar</button>`;
            } else if (
                emprestimo.status === "ativo" ||
                emprestimo.status === "atrasado"
            ) {
                acaoHtml = `<button class="btn-devolver" data-id="${emprestimo.id}">Registrar Devolução</button>`;
            } else {
                acaoHtml = "Finalizado";
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
            tabelaEmprestimos.appendChild(tr);
        });
    }

    async function carregarEmprestimos() {
        const response = await fetch("http://localhost:3000/emprestimos");
        todosOsEmprestimos = await response.json();
        renderizarTabelaEmprestimos(); // Renderiza a tabela com o filtro padrão

        const emprestimos = await response.json();
        tabelaEmprestimos.innerHTML = "";

        emprestimos.forEach((emprestimo) => {
            const tr = document.createElement("tr");

            let acaoHtml = "";
            // Se o status for pendente, mostra os botões de Aprovar/Reprovar
            if (emprestimo.status === "pendente") {
                acaoHtml = `
                <button class="btn-aprovar" data-id="${emprestimo.id}">Aprovar</button>
                <button class="btn-reprovar" data-id="${emprestimo.id}">Reprovar</button>
            `;
            }
            // Se for ativo, mostra o botão de Devolver
            else if (
                emprestimo.status === "ativo" ||
                emprestimo.status === "atrasado"
            ) {
                acaoHtml = `<button class="btn-devolver" data-id="${emprestimo.id}">Registrar Devolução</button>`;
            }
            // Se for devolvido ou reprovado, não mostra ação
            else {
                acaoHtml = "Finalizado";
            }

            tr.innerHTML = `
            <td>${emprestimo.id}</td>
            <td>${emprestimo.Usuario?.nome || "N/A"}</td>
            <td>${emprestimo.Livro?.titulo || "N/A"}</td>
            <td>${new Date(emprestimo.data_emprestimo).toLocaleDateString()}
            </td>
            <td>${new Date(
                emprestimo.data_devolucao_prevista
            ).toLocaleDateString()}
            </td>
            <td>${emprestimo.status}</td>
            <td>${acaoHtml}</td>
        `;
            tabelaEmprestimos.appendChild(tr);
        });
    }

    toggleFiltro.addEventListener("change", renderizarTabelaEmprestimos);

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
                    <button class="btn-editar" data-id="${
                        livro.id
                    }">Editar</button>
                    <button class="btn-excluir" data-id="${
                        livro.id
                    }">Excluir</button>
                </td>
            `;
            tabelaLivros.appendChild(tr);
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

    // --- NOVA LÓGICA PARA ABRIR E PREENCHER O MODAL DE EDIÇÃO ---
    async function abrirModalEditar(id) {
        // Busca os dados atuais do livro na API
        const response = await fetch(`http://localhost:3000/livros/${id}`);
        const livro = await response.json();

        // Preenche o formulário do modal com os dados do livro
        document.getElementById("edit-livro-id").value = livro.id;
        document.getElementById("edit-livro-titulo").value = livro.titulo;
        document.getElementById("edit-livro-autor").value = livro.autor;
        document.getElementById("edit-livro-ano").value = livro.ano_publicacao;
        document.getElementById("edit-livro-qtd").value =
            livro.quantidade_disponivel;

        // Exibe o modal
        modalEditar.style.display = "block";
    }

    // --- NOVA LÓGICA PARA FECHAR O MODAL ---
    function fecharModal() {
        modalEditar.style.display = "none";
    }
    closeButton.addEventListener("click", fecharModal);
    window.addEventListener("click", (event) => {
        if (event.target == modalEditar) {
            fecharModal();
        }
    });

    // --- NOVA LÓGICA PARA ENVIAR O FORMULÁRIO DE EDIÇÃO ---
    formEditarLivro.addEventListener("submit", async (event) => {
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
        carregarLivros(); // Recarrega a lista para mostrar os dados atualizados
    });

    // --- ATUALIZAÇÃO NO EVENT LISTENER DA TABELA ---
    tabelaLivros.addEventListener("click", async (event) => {
        // Lógica para Excluir (já existente)
        if (event.target.classList.contains("btn-excluir")) {
            const id = event.target.dataset.id;
            if (
                confirm(`Tem certeza que deseja excluir o livro com ID ${id}?`)
            ) {
                await fetch(`http://localhost:3000/livros/${id}`, {
                    method: "DELETE",
                });
                alert("Livro excluído com sucesso!");
                carregarLivros();
            }
        }
        // NOVA Lógica para Editar
        if (event.target.classList.contains("btn-editar")) {
            const id = event.target.dataset.id;
            abrirModalEditar(id);
        }
    });

    // --- LÓGICA PARA DEVOLVER LIVRO ---
    tabelaEmprestimos.addEventListener("click", async (event) => {
        const id = event.target.dataset.id;
        let url = "";
        let method = "PUT";

        if (event.target.classList.contains("btn-devolver")) {
            url = `http://localhost:3000/emprestimos/${id}/devolver`;
        } else if (event.target.classList.contains("btn-aprovar")) {
            url = `http://localhost:3000/emprestimos/${id}/aprovar`;
        } else if (event.target.classList.contains("btn-reprovar")) {
            url = `http://localhost:3000/emprestimos/${id}/reprovar`;
        } else {
            return; // Sai se não for um botão de ação
        }

        await fetch(url, { method: method });
        alert("Operação realizada com sucesso!");
        carregarLivros();
        carregarEmprestimos();
    });

    // Carrega os dados iniciais ao abrir a página
    carregarLivros();
    carregarEmprestimos();
});
