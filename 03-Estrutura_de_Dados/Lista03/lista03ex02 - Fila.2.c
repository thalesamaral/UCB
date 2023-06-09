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

struct tFila{
	struct tNo *ini;
	struct tNo *fim;
};

//typedef struct fila Fila;

Fila* cria_fila() {
	Fila* fi = (Fila*) malloc(sizeof(Fila));
	
	if(fi != NULL){
		fi->inicio = NULL;
		fi->final = NULL;
		fi->qtd = 0;
	}
	
	return fi;
}

int tamanho_fila(Fila *fi){
	if(fi == NULL){
		return 0;
	}
	
	return fi->qtd;
}

int fila_vazia(Fila *fi){
	if(fi == NULL){
		return 0;
	}
	if(fi->inicio == NULL){
		return 1;
	} else {
		return 0;
	}
}

int insere_elemento(Fila *fi, struct aluno aluno){
	if(fi == NULL){
		return 0;
	}
	
	if(fi->inicio == NULL){
		
		struct elemento* item = (struct elemento*) malloc (sizeof(struct elemento));
		
		if(item == NULL){
			return 0;
		}
		
		item->dados = aluno;
		item->prox = NULL;
		
		fi->inicio = item;
		fi->final = item;
		fi->qtd++;
		
		return 1;
	} else {
		
		struct elemento* item = (struct elemento*) malloc (sizeof(struct elemento));
		
		if(item == NULL){
			return 0;
		}
		
		item->dados = aluno;
		item->prox = NULL;
		
		
		fi->final->prox = item;
		fi->final = item;
		fi->qtd++;
		
		return 1;
	}
}

int remove_elemento(Fila *fi) {
	if(fi == NULL){
		return 0;
	}
	
	if(fi->inicio == NULL){
		return 0;
	}
	
	struct elemento* item = fi->inicio;
	
	fi->inicio = fi->inicio->prox;
	
	free(item);
	
	if(fi->inicio == NULL){
		fi->final = NULL;
	}
	
	fi->qtd--;
	
	return 1;
}

void main() {
	Fila* fi;
	fi = cria_fila();
	
	int tamanhoLista = tamanho_fila(fi);
	printf("Tamanho a lista: %d\n", tamanhoLista);
	
	int filaVazia = fila_vazia(fi);
	if(filaVazia == 1){
		printf("Lista vazia!\n");
	} else {
		printf("Lista nao esta vazia!\n");
	}
	
	struct aluno a;
	
	printf("\nInsira a matricula do aluno: ");
	scanf("%d", &a.matricula);
	printf("Insira o nome do aluno: ");
	fflush(stdin);
	gets(a.nome);
	
	int inserirElemento = insere_elemento(fi, a);
	if(inserirElemento == 1){
		printf("Elemento inserido com sucesso!\n");
	}
	
	tamanhoLista = tamanho_fila(fi);
	printf("Tamanho a lista: %d\n", tamanhoLista);
	
	struct aluno b;
	
	printf("\nInsira a matricula do aluno: ");
	scanf("%d", &b.matricula);
	printf("Insira o nome do aluno: ");
	fflush(stdin);
	gets(b.nome);
	
	inserirElemento = insere_elemento(fi, b);
	if(inserirElemento == 1){
		printf("Elemento inserido com sucesso!\n");
	}
	
	tamanhoLista = tamanho_fila(fi);
	printf("Tamanho a lista: %d\n", tamanhoLista);
	
	printf("\n\n------------------\n");
	printf("Removendo um elemento!!\n");
	printf("------------------\n\n");
	
	
	int removeElemento = remove_elemento(fi);
	if(removeElemento == 1){
		printf("Elemento removido com sucesso!");
	}
	
	tamanhoLista = tamanho_fila(fi);
	printf("\nTamanho a lista: %d\n", tamanhoLista);
	
}

