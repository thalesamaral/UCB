//  Sintese
//  Nome....: "Thales Amaral Lima"
//  Data....: "09/04/2023"
/*	Objetivo: Com base no resultado do exercício 1, elabore o programa que apresente outros três vetores "numeros_ordenados", "pares_ordenados", "impares_ordenados", sendo os ímpares apresentados na ordem inversa, pesquise e utilize o bubble sort (método da bolha) para as ordenações.*/
#include <stdio.h>
#include <string.h>
#define TAM 10

void novosVetores(int[], int[], int);
void imprimirVetor(int[], int);
void bubbleSort(int[], int);
void bubbleSortInvertido(int[], int);

int main(){
// Declarações
	int numero[TAM] = {5,7,8,1,3,9,2,10,4,6};
    int numeros_ordenados[TAM], pares_ordenados[TAM], impares_ordenados[TAM];
	int par[TAM], impar[TAM];
	int i, j=0, k=0;
	
// Principal

	//LEITURA -------------------------------------------------------
	printf("*** Digite %d Numeros ***\n\n",TAM);
	/*for(i=0; i<TAM; i++){
		printf("%do numero: ",i+1);
		scanf("%d",&numero[i]);
	}*/

	//DISTRIBUIÇÃO DE PAR E IMPAR -----------------------------------
	for(i=0; i<TAM; i++){
		if(numero[i]%2==0){
			par[j++] = numero[i];
		}else{
			impar[k++] = numero[i];
		}
	}

	printf("\n*************************\n\n");

	//APRESENTAÇÃO DE PAR E IMPAR -----------------------------------
	for(i=0; i<j; i++){
		printf("Vetor Par: %d\n",par[i]);
	}
	for(i=0; i<k; i++){
		printf("Vetor Impar: %d\n",impar[i]);
	}

    //NUMEROS_ORDENADOS ---------------------------------------------
    printf("\n*** numeros_ordenados ***\n");
    novosVetores(numeros_ordenados, numero, TAM);

    //PARES_ORDENADOS -----------------------------------------------
    printf("\n\n*** pares_ordenados ***\n");
    novosVetores(pares_ordenados, par, j);

    //IMPARES_ORDENADOS ---------------------------------------------
    printf("\n*** impares_ordenados ***\n");
	for(int i=0; i<k; i++){
        impares_ordenados[i] = impar[i];
    }
    bubbleSortInvertido(impares_ordenados, k);
    imprimirVetor(impares_ordenados, k);

	return 0;
}

//*** Novos vetores *************************************************
void novosVetores(int vetOrdenado[], int vetOriginal[], int tamanho){
    for(int i=0; i<tamanho; i++){
        vetOrdenado[i] = vetOriginal[i];
    }
    bubbleSort(vetOrdenado, tamanho);
    imprimirVetor(vetOrdenado, tamanho);
}

//*** Imprime os valores do vetor ***********************************
void imprimirVetor(int vet[], int n){
	int i;

	for(i=0; i<n; i++){
		printf("vetor[%d] = %d\n", i, vet[i]);
    }
}

//*** Bubble Sort ***************************************************
void bubbleSort(int vet[], int n){
    int bolha, borda, aux;
	
	for(borda=n-1; borda>0; borda--){
		for(bolha=0; bolha<borda; bolha++){
			if(vet[bolha] > vet[bolha+1]){ 
				aux = vet[bolha];
				vet[bolha] = vet[bolha+1];
				vet[bolha+1] = aux;
			}
		}
	}
}

//*** Bubble Sort Invertido *****************************************
void bubbleSortInvertido(int vet[], int n){
    int bolha, borda, aux;
	
	for(borda=n-1; borda>0; borda--){
		for(bolha=0; bolha<borda; bolha++){
			if(vet[bolha] < vet[bolha+1]){ // linha alterada "<"
				aux = vet[bolha];
				vet[bolha] = vet[bolha+1];
				vet[bolha+1] = aux;
			}
		}
	}
}
