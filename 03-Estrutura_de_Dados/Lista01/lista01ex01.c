//  Sintese
//  Nome....: "Thales Amaral Lima"
//  Data....: "08/04/2023"
/*	Objetivo: Elabore um programa que receba 10 números, armazene os respectivos números em um vetor "numeros", após a leitura distribua os valores entre outros dois vetores "impares" e "pares", ao final apresente os pares armazenados no vetor.*/
#include <stdio.h>
#include <string.h>
#define TAM 10

int main(){
// Declarações
	int numero[TAM] /*= {5,7,8,1,3,9,2,10,4,6}*/;
	int par[TAM], impar[TAM];
	int i, j=0, k=0;
	
// Principal

	//LEITURA -------------------------------------------------------
	printf("** Digite %d Numeros **\n\n",TAM);
	for(i=0; i<TAM; i++){
		printf("%do numero: ",i+1);
		scanf("%d",&numero[i]);
	}

	//DISTRIBUIÇÃO DE PAR E IMPAR -----------------------------------
	for(i=0; i<TAM; i++){
		if(numero[i]%2==0){
			par[j++] = numero[i];
		}else{
			impar[k++] = numero[i];
		}
	}

	printf("\n***********************\n\n");

	//APRESENTAÇÃO DE PAR E IMPAR -----------------------------------
	for(i=0; i<j; i++){
		printf("Vetor Par: %d\n",par[i]);
	}
	for(i=0; i<k; i++){
		printf("Vetor Impar: %d\n",impar[i]);
	}

	return 0;
}
