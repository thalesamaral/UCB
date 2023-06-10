//  Sintese
//  Nome....: "Thales Amaral Lima"
//  Data....: "10/06/2023"
/*	Objetivo: Fila com lista encadeada*/
#include <stdio.h>
#include <stdlib.h>

//*** Declaracoes de tipos ******************************************
struct tLista{
    int numero;
};

struct tNo{
    struct tLista info;
    struct tNo *prox;
};

struct tFila{
	struct tNo *ini;
	struct tNo *fim;
	int qtd;
};

//*** Prototipos de funcoes *****************************************
void cria_fila(struct tFila*);
int tamanho_fila(struct tFila*);
void fila_vazia(struct tFila*);
int insere_elemento(struct tFila*, struct tLista);
int remove_elemento(struct tFila*);

int main(void){
//Declarações
	struct tFila *fila = malloc(sizeof(struct tFila));
//Instruções
	//INICIO --------------------------------------------------------
	cria_fila(fila);
	printf("Tamanho da lista: %d\n", tamanho_fila(fila));
	fila_vazia(fila);

	//ELEMENTO 1 ----------------------------------------------------
	struct tLista elemento1;
	printf("\nInsira o numero: ");
	scanf("%d", &elemento1.numero);
	if(insere_elemento(fila, elemento1)){
		printf("Elemento inserido com sucesso!\n\n");
	}
	printf("Tamanho da lista: %d\n", tamanho_fila(fila));
	
	fila_vazia(fila);
	//ELEMENTO 2 ----------------------------------------------------
	struct tLista elemento2;
	printf("\nInsira o numero: ");
	scanf("%d", &elemento2.numero);
	if(insere_elemento(fila, elemento2)){
		printf("Elemento inserido com sucesso!\n\n");
	}
	printf("Tamanho da lista: %d\n", tamanho_fila(fila));
	
	fila_vazia(fila);
	//REMOVER ELEMENTO 2 --------------------------------------------
	printf("\nRemovendo um elemento!!\n\n");
	if(remove_elemento(fila)){
		printf("Elemento removido com sucesso!\n");
	}

	fila_vazia(fila);
	//REMOVER ELEMENTO 1 --------------------------------------------
	printf("\n*** Removendo um elemento!! ***\n\n");
	if(remove_elemento(fila)){
		printf("Elemento removido com sucesso!\n\n");
	}
	
	//FINAL --------------------------------------------------------
	printf("Tamanho da lista: %d\n", tamanho_fila(fila));
	fila_vazia(fila);
	return 0;
}
//=== FIM DO BLOCO ==================================================

//*** Inicializar Fila **********************************************
void cria_fila(struct tFila *fi){
	
	if(fi != NULL){
		fi->ini = NULL;
		fi->fim = NULL;
		fi->qtd = 0;
	}
}

//*** Tamanho da Fila ***********************************************
int tamanho_fila(struct tFila *fi){
	if(fi == NULL){
		return 0;
	}
	
	return fi->qtd;
}

//*** Fila Vazia ****************************************************
void fila_vazia(struct tFila *fi){
	if(fi == NULL){
		printf("Lista nao esta vazia!\n");
	}
	if(fi->ini == NULL){
		printf("Lista vazia!\n");
	}else{
		printf("Lista nao esta vazia!\n");
	}
}

//*** Entrada na fila ***********************************************
int insere_elemento(struct tFila *fi, struct tLista aluno){
	struct tNo* item;
	if(fi == NULL){
		return 0;
	}
	if(fi->ini == NULL){
		item = malloc(sizeof(struct tNo));
		if(item == NULL){
			return 0;
		}
		item->info = aluno;
		item->prox = NULL;
		
		fi->ini = item;
		fi->fim = item;
		fi->qtd++;
		
		return 1;
	}else{
		item = malloc(sizeof(struct tNo));
		if(item == NULL){
			return 0;
		}
		item->info = aluno;
		item->prox = NULL;
		
		fi->fim->prox = item;
		fi->fim = item;
		fi->qtd++;
		
		return 1;
	}
}

//*** Saida da fila *************************************************
int remove_elemento(struct tFila *fi) {
	struct tNo* item;

	if(fi == NULL){
		return 0;
	}
	if(fi->ini == NULL){
		return 0;
	}
	item = fi->ini;
	fi->ini = fi->ini->prox;
	
	free(item);
	
	if(fi->ini == NULL){
		fi->fim = NULL;
	}
	fi->qtd--;
	
	return 1;
}