#include <stdio.h>
#define TAM 4

void main(){
// Declarações
	int numero[TAM];
	int par[TAM/2], impar[TAM/2];
	int i, j=0, k=0;
	
// Principal
	
	//printf("");
	//scanf("%",&);
	
	//printf("Digite um numero: ");
	
	for(i=0; i<TAM; i++){
		printf("Digite um numero: ");
		scanf("%d",&numero[i]);
	}
	
	for(i=0; i<TAM; i++){
		if(numero[i]%2==0){
			par[j] = numero[i];
			j++;
		}else{
			impar[k] = numero[i];
			k++;
		}
	}
	
	for(i=0; i<TAM/2; i++){
		printf("\nPAR: %d",par[i]);
	}
	
	for(i=0; i<TAM/2; i++){
		printf("\nIMPAR: %d",impar[i]);
	}
	
}


