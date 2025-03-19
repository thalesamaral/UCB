/*
5 - Escreva um programa para encontrar a soma da série 1 + 11 + 1111 + ... n termos. 
Conforme a entrada a seguir: 
Exemplo da saída: 
Se o usuário digitar a quantidade de termos igual a 5, o resultado será: 
1 + 11 + 111 + 1111 + 11111 
A soma é: 12345
*/

const myInput = parseInt(prompt("Digite a quantidade de termos:"));
let termo = 0;
let serie = [];
let soma = 0;

for (let i = 0; i < myInput; i++) {
  termo = termo * 10 + 1; // Gera os termos da série (1, 11, 111...)
  serie.push(termo);
  soma += termo;
}

console.log(serie.join(" + "));
console.log("Soma:", soma);
