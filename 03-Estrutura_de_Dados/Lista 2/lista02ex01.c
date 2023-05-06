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
void imprimirVetor(int[], int);
void bubbleSort(int [], int);

//=== INICIO =========================================================
int main(){
// Declarações
	int numero[MAX];
	int i=0;
		
// Principal
	printf("");
	
	printf("*** Digite de 10 a 20 numeros! ***\n");
	printf("*** Valores de 1 a 99!!! ***\n");
	do{
		do{
			printf("\nDigite o %d numero: ",i+1);
			scanf("%d",&numero[i]);
		}while(le_valida_num(numero[i]));
		
		i++;
		
	}while((i < MAX) && (valida_opcaoSair(i) == 0));

	imprimirVetor(numero, MAX);
	bubbleSort(numero, MAX);
	imprimirVetor(numero, MAX);

	return 0;
}
//=== FIM ===========================================================

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

//*** Valida tamanho do número de 1 a 99 ****************************
int le_valida_num(int num){
	
	if((num < 1) || (num > 99)){
		printf("ERRO!!!");
		return 1;
	}
	return 0;
}

//*** Imprime os valores do vetor ***********************************
void imprimirVetor(int vet[], int n){
	int i;

	for(i=0; i<n; i++){
		printf("vetor[%d] = %d\n", i, vet[i]);
    }
}

//*** Bubble Sort ***************************************************
void bubbleSort(int vet[], int tam){
	int bolha, borda, aux;
	
	for(borda=tam-1; borda>0; borda--){
		for(bolha=0; bolha<borda; bolha++){
			if(vet[bolha] > vet[bolha+1]){ 
				aux = vet[bolha];
				vet[bolha] = vet[bolha+1];
				vet[bolha+1] = aux;
			}
		}
	}
}
