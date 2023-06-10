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

//*** Prototipos de funcoes *****************************************
int menu(void);
void inicializar(struct tNo**);
void push(struct tNo**, struct tNo*);
struct tNo * pop(struct tNo**);
void listar(struct tNo*);
void destruir(struct tNo**);

//=== BLOCO PRINCIPAL ===============================================
int main(void){
//Declarações
	struct tNo *pilha, *p;
	int opcao;
//Instruções
	
	inicializar(&pilha);
	do{
        opcao = menu();
        switch (opcao) {
            case 1:
                printf("\n*** Empilhar ***\n");
                p = malloc(sizeof(struct tNo)); //area alocada para um no
                printf("Digite um numero: ");
                scanf("%d",&(p->info.numero));
				push(&pilha, p);
            break;

            case 2:
                printf("\n*** Desempilhar ***\n");
                p = pop(&pilha);
				if(p != NULL){
					printf("Desempilhou: %d\n", p->info.numero);
					free(p);
				}else{
					printf("Pilha vazia!\n");
				}
            break;
			case 3:
                printf("\n*** Listagem ***\n");
                listar(pilha);
            break;
        }
    }while (opcao != 0);
	
	destruir(&pilha);
	return 0;
}
//=== FIM DO BLOCO ==================================================

//*** Menu **********************************************************
int menu(void) {
    int op;
    printf("\n\n*** MENU ***\n\n");
    printf("1. Empilhar\n");
	printf("2. Desempilhar\n");
    printf("3. Listagem\n");
    printf("0. Sair\n\n");
    printf("Escolha sua opcao: ");
    scanf("%d", &op);
    return op;
}

//*** Inicializar ***************************************************
void inicializar(struct tNo **topo){
	(*topo) = NULL;
	(*topo) = NULL;
}

//*** Empilhar *******************************************************
void push(struct tNo **topo, struct tNo *novo){

	novo->prox = (*topo);
	(*topo) = novo;
}
//*** Desempilhar *******************************************************
struct tNo * pop(struct tNo **topo){
	struct tNo *p = (*topo);

	if(p != NULL){
		(*topo) = p->prox;
	}
	return p;
}

//*** Listar ********************************************************
void listar(struct tNo *topo){
	struct tNo *p = topo;
	while(p != NULL){
		printf("numero: %d\n", p->info.numero);
        p = p->prox;
	}
}

//*** Destruir ******************************************************
void destruir(struct tNo **topo){
    struct tNo *p = (*topo), *q;
    while (p != NULL) {
    	q = p;
    	p = p->prox;
    	free(q);
	}
	inicializar(topo);
}