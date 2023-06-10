//  Sintese
//  Nome....: "Thales Amaral Lima"
//  Data....: "00/00/2023"
/*	Objetivo: */
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

struct tFila {
	struct tNo *ini;
	struct tNo *fim;
	int qtd;
};

//*** Prototipos de funcoes *****************************************
//int menu(void);
struct tFila * cria_fila();
int tamanho_fila(struct tFila*);
int fila_vazia(struct tFila*);
int insere_elemento(struct tFila*, struct tLista);
int remove_elemento(struct tFila*);
//void destruir(struct tFila*);

int main(void){
//Declarações
	struct tFila *fila;
	int tamanhoLista, filaVazia, inserirElemento, removeElemento;
//Instruções

	fila = cria_fila();
	
	tamanhoLista = tamanho_fila(fila);
	printf("Tamanho da lista: %d\n", tamanhoLista);
	
	filaVazia = fila_vazia(fila);
	if(filaVazia == 1){
		printf("Lista vazia!\n");
	}else{
		printf("Lista nao esta vazia!\n");
	}
	
	struct tLista a;
	
	printf("\nInsira o numero: ");
	scanf("%d", &a.numero);
	
	inserirElemento = insere_elemento(fila, a);
	if(inserirElemento == 1){
		printf("Elemento inserido com sucesso!\n");
	}
	
	tamanhoLista = tamanho_fila(fila);
	printf("Tamanho a lista: %d\n", tamanhoLista);
	
	struct tLista b;
	
	printf("\nInsira a matricula do aluno: ");
	scanf("%d", &b.numero);
	
	inserirElemento = insere_elemento(fila, b);
	if(inserirElemento == 1){
		printf("Elemento inserido com sucesso!\n");
	}
	
	tamanhoLista = tamanho_fila(fila);
	printf("Tamanho a lista: %d\n", tamanhoLista);
	
	printf("\n\n------------------\n");
	printf("Removendo um elemento!!\n");
	printf("------------------\n\n");
	
	
	removeElemento = remove_elemento(fila);
	if(removeElemento == 1){
		printf("Elemento removido com sucesso!");
	}
	
	tamanhoLista = tamanho_fila(fila);
	printf("\nTamanho a lista: %d\n", tamanhoLista);
	
	return 0;
}

struct tFila * cria_fila() {
	struct tFila *fi = malloc(sizeof(struct tFila*));
	
	if(fi != NULL){
		fi->ini = NULL;
		fi->fim = NULL;
		fi->qtd = 0;
	}
	
	return fi;
}

int tamanho_fila(struct tFila *fi){
	if(fi == NULL){
		return 0;
	}
	
	return fi->qtd;
}

int fila_vazia(struct tFila *fi){
	if(fi == NULL){
		return 0;
	}
	if(fi->ini == NULL){
		return 1;
	} else {
		return 0;
	}
}

int insere_elemento(struct tFila *fi, struct tLista aluno){
	if(fi == NULL){
		return 0;
	}
	
	if(fi->ini == NULL){
		
		struct tNo* item = (struct tNo*) malloc (sizeof(struct tNo));
		
		if(item == NULL){
			return 0;
		}
		
		item->info = aluno;
		item->prox = NULL;
		
		fi->ini = item;
		fi->fim = item;
		fi->qtd++;
		
		return 1;
	} else {
		
		struct tNo* item = (struct tNo*) malloc(sizeof(struct tNo));
		
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

int remove_elemento(struct tFila *fi) {
	if(fi == NULL){
		return 0;
	}
	
	if(fi->ini == NULL){
		return 0;
	}
	
	struct tNo* item = fi->ini;
	
	fi->ini = fi->ini->prox;
	
	free(item);
	
	if(fi->ini == NULL){
		fi->fim = NULL;
	}
	
	fi->qtd--;
	
	return 1;
}