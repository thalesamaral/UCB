/*
1 - Crie um jogo onde o computador gera um número aleatório de 1 a 20, e o usuário 
precisa adivinhar qual é. O jogo deve dar dicas se o número digitado for maior ou menor 
que o número secreto. O jogo só termina quando o usuário acertar. 
*/

const random = Math.floor(Math.random() * 20) + 1;
let found = false;

console.log(typeof random);

while (!found) {
  let myInput = parseInt(prompt("Advinhe entre 1 a 20! Digite um número: "));
  if (myInput === random) {
    alert(`Número encontrado! ${myInput}`);
    found = true;
  } else if (myInput < random) {
    alert("O número é maior. Tente novamente!");
  } else {
    alert("O número é menor. Tente novamente!");
  }
}
