// Buscar elementos na DOM
const inputItem = document.getElementById("inputItem");
const btnAdicionar = document.getElementById("btnAdicionar");
const tabelaItens = document.getElementById("tabelaItens");
const selectItens = document.getElementById("selectItens");
const btnMarcar = document.getElementById("btnMarcar");
const btnDesmarcar = document.getElementById("btnDesmarcar");
const btnRemover = document.getElementById("btnRemover");

// Adicionar item na tabela e no select
function adicionarItem() {
  const texto = inputItem.value.trim();
  if (texto === "") return;

  // Criar nova linha na tabela
  const tr = document.createElement("tr");
  const td = document.createElement("td");
  td.textContent = texto;
  tr.appendChild(td);
  tabelaItens.appendChild(tr);

  // Criar nova opção no select
  const option = document.createElement("option");
  option.value = texto;
  option.textContent = texto;
  selectItens.appendChild(option);

  // Limpar campo de entrada
  inputItem.value = "";
}

// Evento de adicionar item com botão ou tecla "Enter"
btnAdicionar.addEventListener("click", adicionarItem);
inputItem.addEventListener("keydown", (e) => {
  if (e.key === "Enter") adicionarItem();
});

// Marcar item na tabela
btnMarcar.addEventListener("click", () => {
  const itemSelecionado = selectItens.value;
  if (!itemSelecionado) return;

  const linhas = tabelaItens.getElementsByTagName("tr");
  for (let linha of linhas) {
    if (linha.textContent === itemSelecionado) {
      linha.classList.add("marcado");
      break;
    }
  }
});

// Desmarcar item na tabela
btnDesmarcar.addEventListener("click", () => {
  const itemSelecionado = selectItens.value;
  if (!itemSelecionado) return;

  const linhas = tabelaItens.getElementsByTagName("tr");
  for (let linha of linhas) {
    if (linha.textContent === itemSelecionado) {
      if (linha.classList.contains("marcado")) {
        linha.classList.remove("marcado");
      } else {
        alert("O item já está desmarcado!");
      }
      break;
    }
  }
});

// Remover item da tabela e do select
btnRemover.addEventListener("click", () => {
  const itemSelecionado = selectItens.value;
  if (!itemSelecionado) return;

  // Remover da tabela
  const linhas = tabelaItens.getElementsByTagName("tr");
  for (let linha of linhas) {
    if (linha.textContent === itemSelecionado) {
      tabelaItens.removeChild(linha);
      break;
    }
  }

  // Remover do select
  for (let option of selectItens.options) {
    if (option.value === itemSelecionado) {
      selectItens.removeChild(option);
      break;
    }
  }

  selectItens.value = "";
});
