// Aguarda o DOM ser completamente carregado para executar o script
document.addEventListener("DOMContentLoaded", () => {
    const formRegistro = document.getElementById("form-registro");
    const formLogin = document.getElementById("form-login"); // Pega o formulário de login

    formRegistro.addEventListener("submit", async (event) => {
        // Impede o comportamento padrão do formulário (que é recarregar a página)
        event.preventDefault();

        // 1. Coletar os dados do formulário
        const nome = document.getElementById("registro-nome").value;
        const email = document.getElementById("registro-email").value;
        const senha = document.getElementById("registro-senha").value;
        const perfil = document.getElementById("registro-perfil").value;

        // 2. Criar o objeto de dados para enviar
        const dadosUsuario = { nome, email, senha, perfil };

        // 3. Enviar a requisição para o backend usando fetch
        try {
            const response = await fetch("http://localhost:3000/usuarios", {
                method: "POST", // Método da requisição
                headers: {
                    "Content-Type": "application/json", // Informa que o corpo é JSON
                },
                body: JSON.stringify(dadosUsuario), // Converte o objeto JS para uma string JSON
            });

            if (response.ok) {
                // Se a resposta for bem-sucedida (status 201)
                alert("Usuário registrado com sucesso!");
                formRegistro.reset(); // Limpa o formulário
            } else {
                // Se houver erro (ex: email duplicado)
                const erro = await response.json();
                alert("Erro ao registrar: " + erro.error);
            }
        } catch (error) {
            console.error("Falha na comunicação com o servidor:", error);
            alert(
                "Não foi possível conectar ao servidor. Verifique o console."
            );
        }
    });

    // --- NOVA LÓGICA DE LOGIN ---
    formLogin.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("login-email").value;
        const senha = document.getElementById("login-senha").value;

        try {
            const response = await fetch(
                "http://localhost:3000/usuarios/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, senha }),
                }
            );

            if (response.ok) {
                const usuario = await response.json();

                // Guarda os dados do usuário no navegador para usar em outras páginas
                localStorage.setItem("usuario", JSON.stringify(usuario));

                // Redireciona com base no perfil do usuário
                if (usuario.perfil === "bibliotecario") {
                    window.location.href = "bibliotecario.html"; // Redireciona para a página do bibliotecário
                } else {
                    window.location.href = "leitor.html"; // Redireciona para a página do leitor
                }
            } else {
                // Se a resposta não for OK (ex: 401), mostra uma mensagem de erro
                document.getElementById("mensagem-login").textContent =
                    "Email ou senha inválidos.";
            }
        } catch (error) {
            console.error("Falha na comunicação com o servidor:", error);
            document.getElementById("mensagem-login").textContent =
                "Falha ao conectar. Tente novamente.";
        }
    });
});
