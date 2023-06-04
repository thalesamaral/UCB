//  Sintese
//  Nome....: "Thales Amaral Lima"
//  Data....: "05/05/2023"
/*	Objetivo: Digite de 10 a 20 numeros; Opção de sair após o minimo ser informado; Valores de 1 a 99, somente números ímpares e que não sejam múltiplos de 3 por meio de uma função "le_valida_num". Ao final apresente o vetor de forma decrescente utilizando insertion sort */
#include <stdio.h>
#include <stdlib.h>
#define MIN 2
#define MAX 5

int valida_opcaoSair(int);
int le_valida_num(int);
void imprimirVetor(int[], int);
void insertionSort(int[], int);

//=== BLOCO PRINCIPAL ===============================================
int main(){
// Declarações
	int numero[MAX];//= {12, 11, 13, 5, 6};
	int i=0;
		
// Principal
	//printf("");
	printf("****** REGRAS\n");
	printf("*** Digite de 10 a 20 numeros!\n");
	printf("*** Valores de 1 a 99!!!\n");
	printf("*** Valor deve ser Impar\n");
	printf("*** Valor nao pode ser multiplo de 3\n");
	do{
		do{
			printf("\nDigite o %d numero: ",i+1);
			scanf("%d",&numero[i]);
		}while(le_valida_num(numero[i])); //valores 1 a 99
		
		i++;
		
	}while((i < MAX) && (valida_opcaoSair(i) == 0)); //MIN e MAX

	//vetor de forma decrescente com Insertion Sort -----------------
	printf("\nImpressao de vetor de forma decrescente! Insertion Sort\n");
	insertionSort(numero, i);
	imprimirVetor(numero, i);

	return 0;
}
//=== FIM DO BLOCO ==================================================

//*** Valida opção para sair ****************************************
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

//*** Valida regras para os valores *********************************
int le_valida_num(int num){
	int erro=0;

	if((num < 1) || (num > 99)){
		erro = 1;
	}else if(num % 2 == 0){
		erro = 2;
	}else if(num % 3 == 0){
		erro = 3;
	}

	switch (erro){
	case 1:
		printf("ERRO 1: Fora do limite de 1 a 99!!!\n");
		return 1;
		break;
	case 2:
		printf("ERRO 2: Numero Par. Invalido!!!\n");
		return 1;
		break;
	case 3:
		printf("ERRO 3: Numero Impar e multiplo de 3. Invalido!!!\n");
		return 1;
		break;
	default:
		return 0;
		break;
	}
}

//*** Imprime os valores do vetor ***********************************
void imprimirVetor(int vet[], int tam){
	int i;

	for(i=0; i<tam; i++){
		printf("vetor[%d] = %d\n", i, vet[i]);
    }
}

//*** Insertion Sort ************************************************
void insertionSort(int vet[], int tam){
	int parte, elemento, i;
	
	/*"parte" marca o primeiro elemento da parte nao ordenada = vet[1]
	o vet[0] é o primeiro da parte ordenada */

	for(parte=1; parte<tam; parte++){
		elemento = vet[parte];
		i = parte-1;
		while((i >= 0) && (vet[i] < elemento)){ // linha alterada "<". para Decrescente
			vet[i+1] = vet[i];
			i--;
		}
		vet[i+1] = elemento;
	}
}
