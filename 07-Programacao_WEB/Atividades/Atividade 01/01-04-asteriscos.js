/*
4 - Crie um programa que desenha um triângulo de asteriscos (*) no console, onde o 
número de linhas é especificado pelo usuário. 
Exemplo de saída: 
Se o usuário digitar 5 para o número de linhas, o resultado será: 
* 
** 
*** 
**** 
*****
*/

const myInput = parseInt(prompt("Digite o número de linha: "));
let txt = "*";

for (let i = 0; i < myInput; i++) {
  console.log(txt);
  txt += "*";
}
