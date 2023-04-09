#include <stdio.h>
#define TAM 4

int main(){
// Declarações
	int numero[TAM];
	int par[TAM], impar[TAM];
	int i=0, j=0, k=0, l=0;
	
// Principal
	
	//printf("Digite um numero: ");
	/*for(i=0; i<TAM; i++){
		printf("Digite um numero: ");
		scanf("%d",&numero[i]);
	}*/

	for(i=0; i<TAM; i++){
		printf("Digite um numero: ");
		scanf("%d",&numero[i]);

		if(numero[i]%2==0){
			par[j++] = numero[i];
		}else{
			impar[k++] = numero[i];
		}

		if(i == TAM-1){ //quando acaba o FOR principal
			for(l=j; l<TAM; l++){
				par[l] = -1;
			}
			for(l=k; l<TAM; l++){
				impar[l] = -1;
			}
		}
	}
	i=0;
	for(i=0; par[i] != -1; i++){
		printf("\nPAR: %d",par[i]);
	}

	for(i=0; impar[i] != -1; i++){
		printf("\nIMPAR: %d",impar[i]);
	}

	/*for(i=0; i<TAM; i++){
		printf("Vetor Par valor: %d\n",par[i]);
	}

	for(i=0; i<TAM; i++){
		printf("Vetor Impar valor: %d\n",impar[i]);
	}*/

	return 0;
}
