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
    struct tNo *prox; //ponteiro que aponta para o mesma tipo de estrutura
};

struct tFila {
	struct tNo *ini;
	struct tNo *fim;
};

//*** Prototipos de funcoes *****************************************
int menu(void);
void inicializar(struct tFila*);
void enqueue(struct tFila*, struct tNo *);
struct tNo * dequeue(struct tFila*);
void listar(struct tFila);
void destruir(struct tFila*);


//=== BLOCO PRINCIPAL ===============================================
int main(void){
//Declarações
	struct tFila *lista;
	struct tNo *p;
	int opcao;
//Instruções
	
	inicializar(&lista);
	do{
        opcao = menu();
        switch (opcao) {
            case 1:
                printf("\n*** Enfileirar ***\n");
                p = malloc(sizeof(struct tNo)); //area alocada para um no
                printf("Digite um numero: ");
                scanf("%d",&(p->info.numero));
				enqueue(&lista, p);
            break;

            case 2:
                printf("\n*** Desenfilerar ***\n");
                p = dequeue(&lista);
				if(p != NULL){
					printf("Desenfilerou: %d\n", p->info.numero);
					free(p);
				}else{
					printf("Fila vazia!\n");
				}
            break;
			case 3:
                printf("\n*** Listagem ***\n");
                
            break;
        }
    }while (opcao != 0);
	
	destruir(&lista);
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

//*** Inicializar ***************************************************
void inicializar(struct tFila *desc){
	(*desc).ini = NULL;
	(*desc).fim = NULL;
}

//*** Enqueue *******************************************************
void enqueue(struct tFila *desc, struct tNo *novo){
	if((*desc).ini == NULL){ //vazia
		(*desc).ini = novo;
	}else{
		(*desc).fim->prox = novo;
	}
	(*desc).fim = novo;
	novo->prox = NULL;
}
//*** Dequeue *******************************************************
struct tNo * dequeue(struct tFila *desc){
	struct tNo *p = (*desc).ini;

	if(p != NULL){
		(*desc).ini = p->prox;
		if((*desc).ini == NULL){
			(*desc).fim = NULL;
		}
	}
	return p;
}

//*** Listar ********************************************************
void listar(struct tFila desc){
	struct tNo *p = (desc).ini;
	while(p != NULL){
		printf("numero: %d\n", p->info.numero);
        p = p->prox;
	}
}

//*** Destruir ******************************************************
void destruir(struct tFila *desc) {
    struct tNo *p = (*desc).ini, *q;
    while (p != NULL) {
    	q = p;
    	p = p->prox;
    	free(q);
	}
	inicializar(desc);
}