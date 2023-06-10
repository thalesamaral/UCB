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
	int qtd;
};

//*** Prototipos de funcoes *****************************************
int menu(void);
void cria_fila(struct tFila*);
int tamanho_fila(struct tFila*);
void fila_vazia(struct tFila*);
int insere_elemento(struct tFila*, struct tLista);
int remove_elemento(struct tFila*);

int main(void){
//Declarações
	struct tFila *fila = malloc(sizeof(struct tFila));
	struct tNo *lista=NULL, *novo, *p;
	int opcao;
//Instruções
	cria_fila(fila);

	do{
        opcao = menu();
        switch (opcao) {
            case 1:
                printf("\n*** Enfileirar ***\n");
                novo = malloc(sizeof(struct tNo));
                printf("Digite um numero: ");
                scanf("%d",&(novo->info.numero));
                novo->prox = lista;
                lista = novo;
            break;

            case 2:
                printf("\n*** Desenfilerar ***\n");
                p = dequeue(&fila);
				if(p != NULL){
					printf("Desenfilerou: %d\n", p->info.numero);
					free(p);
				}else{
					printf("Fila vazia!\n");
				} 
            break;
        }
    }while (opcao != 0);
	
	printf("Tamanho da lista: %d\n", tamanho_fila(fila));
	
	fila_vazia(fila);
	
	struct tLista item1;
	
	printf("\nInsira o numero: ");
	scanf("%d", &item1.numero);
	
	if(insere_elemento(fila, item1)){
		printf("Elemento inserido com sucesso!\n");
	}
	
	printf("\nTamanho da lista: %d\n", tamanho_fila(fila));
	
	fila_vazia(fila);
	/*struct tLista item2;
	
	printf("\nInsira o numero: ");
	scanf("%d", &item2.numero);
	
	if(insere_elemento(fila, item2)){
		printf("Elemento inserido com sucesso!\n");
	}
	printf("Tamanho da lista: %d\n", tamanho_fila(fila));*/
	
	printf("\n------------------\n");
	printf("Removendo um elemento!!\n");
	printf("------------------\n\n");

	if(remove_elemento(fila)){
		printf("Elemento removido com sucesso!\n");
	}
	
	printf("Tamanho da lista: %d\n", tamanho_fila(fila));
	fila_vazia(fila);
	return 0;
}
//=== FIM DO BLOCO ==================================================

//*** Menu **********************************************************
int menu(void) {
    int op;
    printf("\n\n*** MENU ***\n\n");
    printf("1. Enfileirar\n");
	printf("2. Desenfilerar\n");
    printf("3. Listagem\n");
    printf("0. Sair\n\n");
    printf("Escolha sua opcao: ");
    scanf("%d", &op);
    return op;
}

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