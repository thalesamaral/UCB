//  Sintese
//  Nome....: "Thales Amaral Lima"
//  Data....: "05/05/2023"
/*	Objetivo: */
#include <stdio.h>
#include <string.h>
#define MIN 2
#define MAX 4

int valida_opcaoSair(int);
int le_valida_num(int);

int main(){
// Declarações
	int numero[MAX];
	int i;
		
// Principal
	printf("");
	
	printf("*** Digite de 10 a 20 numeros! ***\n");
	printf("*** Digite de 1 a 99!!! ***\n");
	do{
		do{
			printf("\nDigite o %d numero: ",i+1);
			scanf("%d",&numero[i]);
		}while(le_valida_num(numero[i]));
		
		i++;
		
	}while((i < MAX) && (valida_opcaoSair(i) == 0));
	
	return 0;
}

int valida_opcaoSair(int i){
	int opcaoSair=0;
	
	if(i >= MIN){
			printf("\nDeseja sair do programa?\n");
			printf("Digite [0] para NAO\n");
			printf("Digite [1] para SIM\n");
			printf("Opcao: ");
			scanf("%d",&opcaoSair);
	}
	
	return opcaoSair;
}

int le_valida_num(int num){
	
	if((num < 1) || (num > 99)){
		printf("ERRO!!!");
		return 1;
	}
	return 0;
}


