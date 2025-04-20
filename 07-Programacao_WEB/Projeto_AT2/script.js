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
  grifinoria: new Casa("Grifinória", "Corajosos e determinados.", "assets/houses/grifinoria.png"),
  sonserina: new Casa("Sonserina", "Ambiciosos e astutos.", "assets/houses/sonserina.png"),
  corvinal: new Casa("Corvinal", "Inteligentes e criativos.", "assets/houses/corvinal.png"),
  lufalufa: new Casa("Lufa-Lufa", "Leais e trabalhadores.", "assets/houses/lufalufa.png")
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
  {
    texto: "Qual dessas criaturas mágicas você gostaria de ter como companheiro?",
    opcoes: [
      { texto: "Fênix", pontos: { grifinoria: 3, sonserina: 1, corvinal: 2, lufalufa: 1 } },
      { texto: "Basilisco", pontos: { grifinoria: 1, sonserina: 3, corvinal: 2, lufalufa: 1 } },
      { texto: "Coruja", pontos: { grifinoria: 1, sonserina: 1, corvinal: 3, lufalufa: 2 } }
    ]
  },
  {
    texto: "Qual dessas matérias em Hogwarts mais te atrai?",
    opcoes: [
      { texto: "Defesa Contra as Artes das Trevas", pontos: { grifinoria: 3, sonserina: 2, corvinal: 1, lufalufa: 1 } },
      { texto: "Poções", pontos: { grifinoria: 1, sonserina: 3, corvinal: 2, lufalufa: 1 } },
      { texto: "Aritmancia", pontos: { grifinoria: 1, sonserina: 1, corvinal: 3, lufalufa: 2 } }
    ]
  },
  {
    texto: "Você se considera mais...",
    opcoes: [
      { texto: "Corajoso(a)", pontos: { grifinoria: 3, sonserina: 1, corvinal: 1, lufalufa: 2 } },
      { texto: "Ambicioso(a)", pontos: { grifinoria: 1, sonserina: 3, corvinal: 2, lufalufa: 1 } },
      { texto: "Leal", pontos: { grifinoria: 2, sonserina: 1, corvinal: 1, lufalufa: 3 } }
    ]
  },
  {
    texto: "Em um grupo, você costuma ser...",
    opcoes: [
      { texto: "O líder", pontos: { grifinoria: 3, sonserina: 2, corvinal: 1, lufalufa: 1 } },
      { texto: "O estrategista", pontos: { grifinoria: 1, sonserina: 3, corvinal: 3, lufalufa: 1 } },
      { texto: "O apoio confiável", pontos: { grifinoria: 2, sonserina: 1, corvinal: 1, lufalufa: 3 } }
    ]
  },
  {
    texto: "Diante de um desafio, você prefere...",
    opcoes: [
      { texto: "Encarar de frente", pontos: { grifinoria: 3, sonserina: 2, corvinal: 1, lufalufa: 1 } },
      { texto: "Planejar cuidadosamente", pontos: { grifinoria: 1, sonserina: 2, corvinal: 3, lufalufa: 2 } },
      { texto: "Ajudar os outros a superá-lo", pontos: { grifinoria: 2, sonserina: 1, corvinal: 1, lufalufa: 3 } }
    ]
  },
  {
    texto: "Qual dessas qualidades você mais admira?",
    opcoes: [
      { texto: "Bravura", pontos: { grifinoria: 3, sonserina: 1, corvinal: 1, lufalufa: 2 } },
      { texto: "Inteligência", pontos: { grifinoria: 2, sonserina: 2, corvinal: 3, lufalufa: 1 } },
      { texto: "Trabalho em equipe", pontos: { grifinoria: 1, sonserina: 1, corvinal: 2, lufalufa: 3 } }
    ]
  },
  {
    texto: "Em uma competição, você está mais interessado em...",
    opcoes: [
      { texto: "Ganhar com honra", pontos: { grifinoria: 3, sonserina: 1, corvinal: 2, lufalufa: 1 } },
      { texto: "Ganhar a qualquer custo", pontos: { grifinoria: 1, sonserina: 3, corvinal: 1, lufalufa: 1 } },
      { texto: "Aproveitar a experiência", pontos: { grifinoria: 1, sonserina: 1, corvinal: 2, lufalufa: 3 } }
    ]
  },
  {
    texto: "Você se sente mais confortável...",
    opcoes: [
      { texto: "Liderando uma missão", pontos: { grifinoria: 3, sonserina: 2, corvinal: 1, lufalufa: 1 } },
      { texto: "Trabalhando nos bastidores", pontos: { grifinoria: 1, sonserina: 2, corvinal: 2, lufalufa: 3 } },
      { texto: "Explorando novas ideias", pontos: { grifinoria: 2, sonserina: 1, corvinal: 3, lufalufa: 1 } }
    ]
  },
  {
    texto: "O que você faria se encontrasse um objeto mágico poderoso?",
    opcoes: [
      { texto: "Usaria para o bem", pontos: { grifinoria: 3, sonserina: 1, corvinal: 2, lufalufa: 2 } },
      { texto: "Estudaria seus poderes", pontos: { grifinoria: 1, sonserina: 2, corvinal: 3, lufalufa: 1 } },
      { texto: "Guardaria com segurança", pontos: { grifinoria: 2, sonserina: 3, corvinal: 1, lufalufa: 2 } }
    ]
  }
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
  divQuestionario.innerHTML = `
    <img src="assets/hat.png" alt="Chapéu Seletor">
    <h2>${pergunta.texto}</h2>
  `;
  
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
    <img src="${vencedor.imagem}" alt="${vencedor.nome}"/>
    <h2>Sua casa é: ${vencedor.nome}</h2>
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
