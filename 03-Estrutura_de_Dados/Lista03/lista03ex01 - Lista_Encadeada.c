//  Sintese
//  Nome....: "Thales Amaral Lima"
//  Data....: "10/06/2023"
/*	Objetivo: Lista Encadeada*/
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

//*** Declaracoes de tipos ******************************************
struct tLista{
    int numero;
};

struct tNo{
    struct tLista info;
    struct tNo *prox; //ponteiro que aponta para o mesma tipo de estrutura
};

//*** Prototipos de funcoes *****************************************
int menu(void);

//=== BLOCO PRINCIPAL ===============================================
int main(void){
//Declarações
	struct tNo *lista=NULL; //inicialmente vazio
    struct tNo *novo, *p; //ponteiro auxiliar
    int opcao;
//Instruções
    
    do{
        opcao = menu();
        switch (opcao) {
            case 1:
                printf("\n*** Inclusao ***\n");
                novo = malloc(sizeof(struct tNo)); //area alocada para um no
                printf("Digite um numero: ");
                scanf("%d",&(novo->info.numero));
                novo->prox = lista;
                lista = novo;
            break;

            case 2:
                printf("\n*** Listagem ***\n");
                p = lista;
                while (p != NULL) {
                    printf("numero: %d\n", p->info.numero);
                    p = p->prox; // x = x + 1
                }
            break;
        }
    }while (opcao != 0);
	return 0;
}
//=== FIM DO BLOCO ==================================================

//*** Menu **********************************************************
int menu(void) {
    int op;
    printf("\n\n*** MENU ***\n\n");
    printf("1. Inclusao\n");
    printf("2. Listagem\n");
    printf("0. Sair\n\n");
    printf("Escolha sua opcao: ");
    scanf("%d", &op);
    return op;
}