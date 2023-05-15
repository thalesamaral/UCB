//  Sintese
//  Nome....: "Thales Amaral Lima"
//  Data....: "15/05/2023"
/*	Objetivo: Implemente um programa exemplo (livre) aplicando o uso de ponteiros.*/
#include <stdio.h>
#include <stdlib.h>

//=== BLOCO PRINCIPAL ===============================================
int main(void){
//Declarações
	int x;
	int *y; //Arsterisco indica que é um ponteiro, pra int.
//Instruções
	//printf("");	
	
	//#1: x recebe 5 em seu endereço de memória
	x = 5;
	printf("X = %d\n",x);
	
	//#2: y aponta para o endereço de memória de x
	//E Comercial indica o endereço de memória.
	y = &x;
	
	//#3: onde o y aponta, que é o endereço de x, recebe 3.
	*y = 3;
	printf("X = %d\n",x);

	return 0;
}
//=== FIM DO BLOCO ==================================================