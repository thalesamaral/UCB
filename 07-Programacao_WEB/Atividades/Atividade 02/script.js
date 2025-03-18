// Buscar elementos na DOM
const incrementBtn = document.getElementById("incrementBtn");
const decrementBtn = document.getElementById("decrementBtn");
const contadorValor = document.getElementById("contadorValor");
const inputTexto = document.getElementById("inputTexto");
const contadorCaracteres = document.getElementById("contadorCaracteres");
const addItemBtn = document.getElementById("addItemBtn");
const resetBtn = document.getElementById("resetBtn");
const outputArea = document.getElementById("outputArea");

let contador = 0;

// Incrementar contador
incrementBtn.addEventListener("click", () => {
  contador++;
  contadorValor.textContent = contador;
});

// Decrementar contador (sem negativos)
decrementBtn.addEventListener("click", () => {
  if (contador > 0) {
    contador--;
    contadorValor.textContent = contador;
  } else {
    alert("O contador já está em zero!");
  }
});

// Adicionar parágrafo ao pressionar Enter
inputTexto.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && inputTexto.value.trim() !== "") {
    const p = document.createElement("p");
    p.textContent = inputTexto.value;
    outputArea.appendChild(p);
    inputTexto.value = ""; // reseta o Input
    contadorCaracteres.textContent = 0; // reseta contador de caracteres
  }
});

// Contador de caracteres sem espaços
inputTexto.addEventListener("input", () => {
  const textoSemEspacos = inputTexto.value.replace(/\s/g, "");
  contadorCaracteres.textContent = textoSemEspacos.length;
});

// Adicionar nova lista (ordenada ou não)
addItemBtn.addEventListener("click", () => {
  const tipo = prompt(
    'Digite "ol" para lista ordenada ou "ul" para lista não ordenada:'
  );

  if (tipo === "ol" || tipo === "ul") {
    const lista = document.createElement(tipo);
    for (let i = 1; i <= 3; i++) {
      const item = document.createElement("li");
      item.textContent = `Item ${i}`;
      lista.appendChild(item);
    }
    outputArea.appendChild(lista);
  } else {
    alert('Tipo inválido! Digite apenas "ol" ou "ul".');
  }
});

// Resetar página (limpa tudo)
resetBtn.addEventListener("click", () => {
  contador = 0;
  contadorValor.textContent = contador;
  inputTexto.value = "";
  contadorCaracteres.textContent = 0;
  outputArea.innerHTML = "";
});
