class Casa {
  constructor(nome, descricao, imagem) {
    this.nome = nome;
    this.descricao = descricao;
    this.imagem = imagem;
    this.pontos = 0;
  }
  adicionarPontos(valor) {
    this.pontos += valor;
  }
}

const casas = {
  grifinoria: new Casa("Grifinória", "Corajosos e determinados.", "grifinoria.jpg"),
  sonserina: new Casa("Sonserina", "Ambiciosos e astutos.", "sonserina.jpg"),
  corvinal: new Casa("Corvinal", "Inteligentes e criativos.", "corvinal.jpg"),
  lufalufa: new Casa("Lufa-Lufa", "Leais e trabalhadores.", "lufalufa.jpg")
};

const perguntas = [
  {
    texto: "O que você mais valoriza?",
    opcoes: [
      { texto: "Coragem", pontos: { grifinoria: 3, sonserina: 1, corvinal: 1, lufalufa: 2 } },
      { texto: "Ambição", pontos: { grifinoria: 1, sonserina: 3, corvinal: 2, lufalufa: 1 } },
      { texto: "Sabedoria", pontos: { grifinoria: 1, sonserina: 2, corvinal: 3, lufalufa: 1 } }
    ]
  },
];

let perguntaAtual = 0;

const divInicio = document.getElementById("inicio");
const divQuestionario = document.getElementById("questionario");
const divResultado = document.getElementById("resultado");

document.getElementById("comecarBtn").addEventListener("click", () => {
  divInicio.classList.add("escondido");
  mostrarPergunta();
});

function mostrarPergunta() {
  divQuestionario.classList.remove("escondido");
  const pergunta = perguntas[perguntaAtual];
  divQuestionario.innerHTML = `<h2>${pergunta.texto}</h2>`;
  
  pergunta.opcoes.forEach((opcao, i) => {
    const btn = document.createElement("button");
    btn.textContent = opcao.texto;
    btn.onclick = () => {
      for (let casa in opcao.pontos) {
        casas[casa].adicionarPontos(opcao.pontos[casa]);
      }
      perguntaAtual++;
      if (perguntaAtual < perguntas.length) {
        mostrarPergunta();
      } else {
        mostrarResultado();
      }
    };
    divQuestionario.appendChild(btn);
  });
}

function mostrarResultado() {
  divQuestionario.classList.add("escondido");
  divResultado.classList.remove("escondido");

  const vencedor = Object.values(casas).reduce((a, b) => a.pontos > b.pontos ? a : b);

  divResultado.innerHTML = `
    <h2>Sua casa é: ${vencedor.nome}</h2>
    <img src="${vencedor.imagem}" alt="${vencedor.nome}" width="200"/>
    <p>${vencedor.descricao}</p>
    <p>Pontuação: ${vencedor.pontos}</p>
    <button onclick="reiniciar()">Recomeçar</button>
  `;
}

function reiniciar() {
  for (let casa in casas) {
    casas[casa].pontos = 0;
  }
  perguntaAtual = 0;
  divResultado.classList.add("escondido");
  divInicio.classList.remove("escondido");
}
