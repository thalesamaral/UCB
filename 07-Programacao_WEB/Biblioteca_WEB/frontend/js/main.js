document.addEventListener("DOMContentLoaded", () => {
    // --- 1. SELETORES DO DOM ---
    const formRegistro = document.getElementById("form-registro");
    const formLogin = document.getElementById("form-login");
    const mensagemLogin = document.getElementById("mensagem-login");

    // --- 2. FUNÇÕES DE API ---

    // Função para registrar um novo usuário
    async function registrarUsuario(dadosUsuario) {
        const response = await fetch("http://localhost:3000/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosUsuario),
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.error);
        }
        return await response.json();
    }

    // Função para fazer o login
    async function loginUsuario(email, senha) {
        const response = await fetch("http://localhost:3000/usuarios/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha }),
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.error || "Email ou senha inválidos.");
        }
        return await response.json();
    }

    // --- 3. MANIPULADORES DE EVENTOS (Handlers) ---

    async function handleRegistroSubmit(event) {
        event.preventDefault(); // Impede o recarregamento da página

        const dadosUsuario = {
            nome: document.getElementById("registro-nome").value,
            email: document.getElementById("registro-email").value,
            senha: document.getElementById("registro-senha").value,
            perfil: document.getElementById("registro-perfil").value,
        };

        try {
            await registrarUsuario(dadosUsuario);
            alert("Usuário registrado com sucesso!");
            formRegistro.reset(); // Limpa o formulário
        } catch (error) {
            alert("Erro ao registrar: " + error.message);
        }
    }

    async function handleLoginSubmit(event) {
        event.preventDefault();
        mensagemLogin.textContent = ""; // Limpa mensagens de erro anteriores

        const email = document.getElementById("login-email").value;
        const senha = document.getElementById("login-senha").value;

        try {
            const usuario = await loginUsuario(email, senha);

            // Guarda os dados do usuário no navegador para usar em outras páginas
            localStorage.setItem("usuario", JSON.stringify(usuario));

            // Redireciona com base no perfil do usuário
            if (usuario.perfil === "bibliotecario") {
                window.location.href = "bibliotecario.html";
            } else {
                window.location.href = "leitor.html";
            }
        } catch (error) {
            console.error("Falha no login:", error);
            mensagemLogin.textContent = error.message;
        }
    }

    // --- 4. INICIALIZAÇÃO ---

    function init() {
        if (formRegistro) {
            formRegistro.addEventListener("submit", handleRegistroSubmit);
        }
        if (formLogin) {
            formLogin.addEventListener("submit", handleLoginSubmit);
        }
    }

    init(); // Roda a função de inicialização
});
