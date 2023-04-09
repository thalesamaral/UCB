#include <stdio.h>
#include <string.h>
#define TAM 4

int main(){
// Declarações
	int numero[TAM];
	int par[TAM], impar[TAM];
	int i, j=0, k=0;
	
// Principal

	//LEITURA
	printf("** Digite %d Numeros **\n\n",TAM);
	for(i=0; i<TAM; i++){
		printf("%do numero: ",i+1);
		scanf("%d",&numero[i]);
	}

	//DISTRIBUIÇÃO DE PAR E IMPAR
	for(i=0; i<TAM; i++){
		if(numero[i]%2==0){
			par[j++] = numero[i];
		}else{
			impar[k++] = numero[i];
		}
	}

	printf("\n***********************\n\n");

	//APRESENTAÇÃO DE PAR E IMPAR
	for(i=0; i<j; i++){
		printf("Vetor Par: %d\n",par[i]);
	}
	for(i=0; i<k; i++){
		printf("Vetor Impar: %d\n",impar[i]);
	}

	return 0;
}
