// Sintese
//   objetivo "Pesquisa - sequencial e binaria"
//   autor "Thales Amaral"
//   data "10/06/2023"
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
//*** Declaracoes de constantes ************************************************
#define TAM 9

int v1,v2;

//*** Prototipos de funcoes ****************************************************
void gerarVetor(int[], int);
void imprimirVetor(int[], int);
int pesquisaSequencial(int[], int, int);
int pesquisaBinaria(int[], int, int);

//*** Bloco Principal **********************************************************
int main(void) {
	int vetor[TAM], valor;
	
	gerarVetor(vetor, TAM);
	imprimirVetor(vetor, TAM);
	
	printf("Digite o valor procurado: \n");
	scanf("%d", &valor);
		
	printf("\nPesquisa Sequencial ==> vetor[%d]\n",pesquisaSequencial(vetor,TAM,valor));
	printf("Acessos Sequencial ==> %d\n\n",v1);
	printf("Pesquisa Binaria ==> vetor[%d]\n",pesquisaBinaria(vetor,TAM,valor));
	printf("Acessos Binaria ==> %d\n\n",v2);
	return 0;
}

//*** Gera valores do vetor em ordem cresente **********************************
void gerarVetor(int vet[], int n) {
	int i, aux=0;
	srand(time(NULL));
	for (i=0; i<n; i++) {
		aux += (rand()%10) + 1;
		vet[i] = aux;
	}
}

//*** Imprime os valores do vetor **********************************************
void imprimirVetor(int vet[], int n) {
	int i;
	for (i=0; i<n; i++)
		printf("%d = %d\n", i+1, vet[i]);
}

//*** Pesquisa Sequencial ******************************************************
int pesquisaSequencial (int vet[], int n, int chave){
	int i=0;
	
	v1++;
	while((vet[i] < chave)&&(i < n)){
		i++;
		v1++;
	}
	if((i<n) && (vet[i] == chave))
		return i;
	return -1;
}

//*** Pesquisa Binaria *********************************************************
int pesquisaBinaria (int vet[], int n, int chave){
	int ini=0, meio, fim=n-1;
		
	while(ini<=fim){
		meio = (ini + fim)/2;
		v2++;
		if(vet[meio]==chave)
			return meio;
		if (chave > vet[meio])
			ini = meio + 1;
		else
			fim = meio - 1;
	}
	return -1;
}

//*** FIM **********************************************************************