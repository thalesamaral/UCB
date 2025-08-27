// Importa o framework Express
const express = require("express");

// Cria uma instância do aplicativo Express
const app = express();

// Define a porta onde o servidor irá escutar
const port = 3000;

// Middleware que permite capturar dados de formulários enviados via POST
app.use(express.urlencoded({ extended: true }));

// Rota GET para a página inicial ("/")
// Envia o arquivo index.html localizado dentro da pasta /public
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
    //res.send('Hello World! - Nome')
});

// Rota GET para "/sobre"
// Envia uma simples resposta de texto
app.get("/sobre", (req, res) => {
    res.send("Página Sobre");
});

// Rota GET para "/blog"
// Envia o arquivo blog.html localizado dentro da pasta /public
app.get("/blog", (req, res) => {
    res.sendFile(__dirname + "/public/blog.html");
});

// Rota POST para "/contato"
// Recebe os dados do formulário (nome e email) e retorna uma mensagem
app.post("/contato", (req, res) => {
    const { nome, email } = req.body;
    res.send(`Dados recebidos: Nome: ${nome}, Email: ${email}`);
});

//app.post("/adicionar", (req, res) => {
//    const nome = req.body.nome;
//    res.send(`Nome recebido: ${nome}`)
//  })

// Inicia o servidor e escuta na porta definida
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
