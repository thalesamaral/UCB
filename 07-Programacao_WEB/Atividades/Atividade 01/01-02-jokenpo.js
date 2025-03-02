/*
2 – Crie um jogo de Pedra, Papel ou Tesoura onde: 
  • O usuário escolhe uma das três opções digitando no prompt().
  • O computador escolhe uma opção aleatória.
  • O programa deve determinar o vencedor e exibir o resultado no console.log().
*/

const pedra = 1;
const papel = 2;
const tesoura = 3;
let jokenpo = ["Pedra", "Papel", "Tesoura"];
let flag = false;
let myInput = 0;

do {
  flag = false;
  myInput = parseInt(
    prompt(`
      Digite [1] para Pedra;
      Digite [2] para Papel;
      Digite [3] para Tesoura;
      
      Resposta:
    `)
  );

  if (myInput !== pedra && myInput !== papel && myInput !== tesoura) {
    console.log("Opção inválida.");
    flag = true;
  }
} while (flag);

const random = Math.floor(Math.random() * 3) + 1;
console.log(`Eu: ${jokenpo[myInput - 1]} - PC: ${jokenpo[random - 1]}`);

if (myInput === random) {
  console.log("Empate!");
} else if (
  (myInput === pedra && random === tesoura) ||
  (myInput === papel && random === pedra) ||
  (myInput === tesoura && random === papel)
) {
  console.log("Você venceu!");
} else {
  console.log("Computador venceu!");
}
