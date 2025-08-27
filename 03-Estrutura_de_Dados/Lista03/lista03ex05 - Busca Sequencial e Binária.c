//  Sintese
//  Nome....: "Thales Amaral Lima"
//  Data....: "10/06/2023"
/*	Objetivo: Busca Sequencial e Binária*/
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
//*** Declaracoes de constantes *************************************
#define TAM 9

int v1,v2;

//*** Prototipos de funcoes *****************************************
void gerarVetor(int[], int);
void imprimirVetor(int[], int);
int buscaSequencial(int[], int, int);
int buscaBinaria(int[], int, int);

//*** Bloco Principal ===============================================
int main(void){
	int vetor[TAM], valor;
	
	gerarVetor(vetor, TAM);
	imprimirVetor(vetor, TAM);
	
	printf("Digite um valor para busca: ");
	scanf("%d", &valor);
		
	printf("\nBusca Sequencial: vetor[%d]\n",buscaSequencial(vetor,TAM,valor));
	printf("Acessos Sequencial: %d\n\n",v1);
	printf("Busca Binaria: vetor[%d]\n",buscaBinaria(vetor,TAM,valor));
	printf("Acessos Binaria: %d\n\n",v2);
	return 0;
}
//=== FIM DO BLOCO ==================================================

//*** Gera valores do vetor em ordem cresente ***********************
void gerarVetor(int vet[], int n) {
	int i, aux=0;
	srand(time(NULL));
	for (i=0; i<n; i++) {
		aux += (rand()%10) + 1;
		vet[i] = aux;
	}
}

//*** Imprime os valores do vetor ***********************************
void imprimirVetor(int vet[], int n) {
	int i;
	for (i=0; i<n; i++)
		printf("%d = %d\n", i+1, vet[i]);
}

//*** Busca Sequencial **********************************************
int buscaSequencial (int vet[], int n, int chave){
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

//*** Busca Binaria *************************************************
int buscaBinaria (int vet[], int n, int chave){
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