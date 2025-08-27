// Importa o módulo 'http' do Node.js para criar o servidor
const http = require('http');

// Importa o módulo 'fs' (File System) para ler arquivos do sistema
const fs = require('fs');

// Importa o módulo 'path' para trabalhar com caminhos de arquivos
const path = require('path');

// Cria o servidor HTTP
const server = http.createServer((req, res) => {
    // Define o caminho absoluto até o arquivo 'index.html'
    const filePath = path.join(__dirname, 'index.html');

    // Lê o conteúdo do arquivo HTML
    fs.readFile(filePath, (err, data) => {
        if (err) {
            // Se ocorrer um erro ao ler o arquivo, responde com status 500 (Erro interno)
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Erro no servidor');
        } else {
            // Se o arquivo for lido com sucesso, responde com status 200 e tipo 'text/html'
            res.writeHead(200, { 'Content-Type': 'text/html' });

            /*  
                Envia o conteúdo do arquivo HTML como resposta.
                O navegador exibirá o conteúdo da página normalmente.
            */
            res.end(data);
        }
    });
});

// Define a porta do servidor como 3000
const port = 3000;

// Inicia o servidor e exibe uma mensagem no terminal
server.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
