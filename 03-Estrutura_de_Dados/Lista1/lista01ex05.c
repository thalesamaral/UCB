#include <stdio.h>
#include <string.h>
#define TAM 10

void imprimirVetor(int[], int);
void bubbleSort(int[], int);
void bubbleSortInvertido(int[], int);


int main(){
// Declarações
	int numero[TAM] = {5,7,8,1,3,9,2,10,4,6};
	int par[TAM], impar[TAM], a[TAM];
	int i, j=0, k=0;
	
// Principal

	//LEITURA
	printf("*** Digite %d Numeros ***\n\n",TAM);
	/*for(i=0; i<TAM; i++){
		printf("%do numero: ",i+1);
		scanf("%d",&numero[i]);
	}*/

	//DISTRIBUIÇÃO DE PAR E IMPAR
	for(i=0; i<TAM; i++){
		if(numero[i]%2==0){
			par[j++] = numero[i];
		}else{
			impar[k++] = numero[i];
		}
	}

	printf("\n*************************\n\n");

	//APRESENTAÇÃO DE PAR E IMPAR
	for(i=0; i<j; i++){
		printf("Vetor Par: %d\n",par[i]);
	}
	for(i=0; i<k; i++){
		printf("Vetor Impar: %d\n",impar[i]);
	}

    bubbleSort(numero, TAM);
    printf("\n*** numeros_ordenados ***\n");
    imprimirVetor(numero, TAM);

    bubbleSort(par, j);
    printf("\n*** pares_ordenados ***\n");
    imprimirVetor(par, j);

    bubbleSortInvertido(impar, k);
    printf("\n*** pares_ordenados ***\n");
    imprimirVetor(impar, k);
	return 0;
}

//*** Imprime os valores do vetor *************************
void imprimirVetor(int vet[], int n){
	int i;

	for(i=0; i<n; i++){
		printf("vetor[%d] = %d\n", i, vet[i]);
    }
}

//*** Bubble Sort *****************************************
void bubbleSort(int vet[], int n){
    int bolha, borda, aux, compara=0, troca=0;
	
	for(borda=n-1; borda>0; borda--){
		for(bolha=0; bolha<borda; bolha++){
			compara++;
			if(vet[bolha] > vet[bolha+1]){ 
				aux = vet[bolha];
				vet[bolha] = vet[bolha+1];
				vet[bolha+1] = aux;
				troca++;
			}
		}
	}
	//printf("\nBubble Sort Comparacoes: %i\n",compara);
	//printf("Bubble Sort Troca: %i\n\n",troca);
}

//*** Bubble Sort Invertido *******************************
void bubbleSortInvertido(int vet[], int n){
    int bolha, borda, aux, compara=0, troca=0;
	
	for(borda=n-1; borda>0; borda--){
		for(bolha=0; bolha<borda; bolha++){
			compara++;
			if(vet[bolha] < vet[bolha+1]){ 
				aux = vet[bolha];
				vet[bolha] = vet[bolha+1];
				vet[bolha+1] = aux;
				troca++;
			}
		}
	}
	//printf("\nBubble Sort Comparacoes: %i\n",compara);
	//printf("Bubble Sort Troca: %i\n\n",troca);
}
