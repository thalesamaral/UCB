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
	int *p; //Arsterisco indica que é um ponteiro, pra int.
//Instruções
	
	//#1: x recebe 0 em seu endereço de memória.
	x = 0;
	printf("antes do ponteiro. X = %d\n",x);
	
	//#2: p aponta para o endereço de memória de x.
	p = &x; //E Comercial indica o endereço de memória.
	
	//#3: onde o p aponta, que é o endereço de x, recebe 1.
	*p = 1;
	printf("depois do ponteiro. X = %d\n",x);

	return 0;
}
//=== FIM DO BLOCO ==================================================