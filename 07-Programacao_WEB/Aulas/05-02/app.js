// Importa o módulo 'http' do Node.js para criar o servidor
const http = require("http");

// Cria o servidor
const server = http.createServer((req, res) => {
    // Define o cabeçalho da resposta como 'text/plain'
    res.writeHead(200, "Content-Type", "text/plain");

    /*  
        Envia a resposta "Hello, World" para o cliente
        Quando o servidor recebe uma requisição,
        responde com texto puro: "Hello, World".
    */
    res.end("Hello World\n");
});

// O servidor é iniciado na porta 3000
const port = 3000;

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
