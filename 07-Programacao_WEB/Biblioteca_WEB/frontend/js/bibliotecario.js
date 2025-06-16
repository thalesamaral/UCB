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

    // Seletores do Modal
    const modalEditar = document.getElementById("modal-editar");
    const closeButton = document.querySelector(".close-button");
    const formEditarLivro = document.getElementById("form-editar-livro");

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
