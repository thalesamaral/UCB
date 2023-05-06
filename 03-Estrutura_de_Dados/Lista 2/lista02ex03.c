//  Sintese
//  Nome....: "Thales Amaral Lima"
//  Data....: "06/05/2023"
/*	Objetivo: Digite de 2 a 10 numeros; Opção de sair após o minimo ser informado; Valores de 1 a 99, somente números pares e que não sejam múltiplos de 5 por meio de uma função "le_valida_num". Ao final apresente o vetor de forma crescente e decrescente utilizando selection sort */
#include <stdio.h>
#include <stdlib.h>
#define MIN 2
#define MAX 5

int valida_opcaoSair(int);
int le_valida_num(int);
void imprimirVetor(int[], int);
void selectionSort(int[], int);
void selectionSortInvertido(int[], int);

//=== BLOCO PRINCIPAL ===============================================
int main(){
	setlocale(LC_ALL,"Portuguese");
// Declarações
	int numero[MAX];//= {12, 11, 13, 5, 6};
	int i=0;
		
// Principal
	//printf("");
	printf("****** REGRAS\n");
	printf("*** Digite de 2 a 10 numeros!\n");
	printf("*** Valores de 1 a 99!!!\n");
	printf("*** Valor deve ser Par\n");
	printf("*** Valor nao pode ser multiplo de 5\n");
	do{
		do{
			printf("\nDigite o %d numero: ",i+1);
			scanf("%d",&numero[i]);
		}while(le_valida_num(numero[i])); //valores 1 a 99
		
		i++;
		
	}while((i < MAX) && (valida_opcaoSair(i) == 0)); //MIN e MAX

	//vetor de forma crescente com Selection Sort -----------------
	printf("\nImpressao de vetor de forma Crescente! Selection Sort\n");
	selectionSort(numero, i);
	imprimirVetor(numero, i);
	//vetor de forma decrescente com Selection Sort -----------------
	printf("\nImpressao de vetor de forma Decrescente! Selection Sort\n");
	selectionSortInvertido(numero, i);
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
	}else if(num % 2 != 0){
		erro = 2;
	}else if(num % 5 == 0){
		erro = 3;
	}

	switch (erro){
	case 1:
		printf("ERRO 1: Fora do limite de 1 a 99!!!\n");
		return 1;
		break;
	case 2:
		printf("ERRO 2: Numero Impar. Invalido!!!\n");
		return 1;
		break;
	case 3:
		printf("ERRO 3: Numero Par e multiplo de 5. Invalido!!!\n");
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

//*** Selection Sort ************************************************
void selectionSort(int vet[], int tam) {
	int bolha, borda, aux, maior;
	for (borda=tam-1; borda>=0; borda--) {
		maior = 0;
		for (bolha=1; bolha<=borda; bolha++) {
			if (vet[bolha] > vet[maior]) {
				maior = bolha;
			}
		}
		aux = vet[borda];
		vet[borda] = vet[maior];
		vet[maior] = aux;
	}
}

//*** Selection Sort Invertido **************************************
void selectionSortInvertido(int vet[], int tam) {
	int bolha, borda, aux, maior;
	for (borda=tam-1; borda>=0; borda--) {
		maior = 0;
		for (bolha=1; bolha<=borda; bolha++) {
			if (vet[bolha] < vet[maior]) {// linha alterada "<". para Decrescente
				maior = bolha;
			}
		}
		aux = vet[borda];
		vet[borda] = vet[maior];
		vet[maior] = aux;
	}
}
