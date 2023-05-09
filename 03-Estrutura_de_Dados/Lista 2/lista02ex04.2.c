//  Sintese
//  Nome....: "Thales Amaral Lima"
//  Data....: "09/05/2023"
/*	Objetivo: Elabore um programa onde o usuário armazenará por meio de Structs os dados de "Produto" e "Fabricante", deverão serem cadastrados no mínimo 2 fabricantes (máximo 5) e no mínimo 5 produtos (máximo 50). */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define MAXP 10
#define MAXF 5

//*** Declaracoes de tipos ******************************************
struct tFabricante{
	char marca[50];
	char site[50];
	int telefone[11];
	char uf[2];
};

struct tProduto{
	char descricao[50];
	float peso;
	float valorCompra;
	float valorVenda;
	float valorLucro;
	float porcentoLucro;
	struct tFabricante fabricante[MAXF];
};

//*** Prototipos de funcoes *****************************************
int menu(void);

//=== BLOCO PRINCIPAL ===============================================
int main(void){
// Declarações
	int i, opcao, qtdP=0, qtdF=0;
	struct tProduto produto[MAXP];

// Principal
	/*produto[0].fabricante[0].telefone = 123;
	printf("%d",produto[0].fabricante[0].telefone);*/

	do {
        opcao = menu();
        switch (opcao) {
               case 1: 
                    printf("\n\n*** Inclusao ***\n\n");
                    if (qtdP < MAXP) {
						printf("Produto %d:\n", qtdP + 1);
                    	printf("  Descricao: ");
						setbuf(stdin, 0);
                    	fflush(stdin);
                    	gets(produto[qtdP].descricao);
						printf("  Peso: ");
                    	scanf("%f",&produto[qtdP].peso);
                    	printf("  Valor Compra: ");
                    	scanf("%f",&produto[qtdP].valorCompra);
						printf("  Valor Venda: ");
                    	scanf("%f",&produto[qtdP].valorVenda);
						produto[qtdP].valorLucro = produto[qtdP].valorCompra - produto[qtdP].valorVenda;
						produto[qtdP].porcentoLucro = (produto[qtdP].valorLucro*100)/produto[qtdP].valorCompra;
                    	if (qtdF < MAXF){
							printf("Fabricante %d:\n", qtdF + 1);
							printf("  Marca: ");
							setbuf(stdin, 0);
							fflush(stdin);
							gets(produto[qtdP].fabricante[qtdF].marca);
							printf("  Site: ");
							gets(produto[qtdP].fabricante[qtdF].site);
							printf("  Telefone: ");
							scanf("%d", produto[qtdP].fabricante[qtdF].telefone);
							printf("  UF: ");
							fflush(stdin);
							gets(produto[qtdP].fabricante[qtdF].uf);
							qtdF++;
						}else{
								printf("Vetor cheio!\n");
							}
						qtdP++;
					}
					else{
							printf("Vetor cheio!\n");
						}
	                break;
               case 2: 
                    printf("\n\n*** Listagem ***\n\n");
                    for (i=0; i<qtdP; i++){
						printf("\n*** Produto ***\n");
                    	printf("Descricao: %s\n", produto[i].descricao);
						printf("Peso: %.2f\n", produto[i].peso);
						printf("Valor Compra: %.2f\n", produto[i].valorCompra);
						printf("Valor Venda: %.2f\n", produto[i].valorVenda);
						printf("Valor Lucro: %.2f\n", produto[i].valorLucro);
						printf("Porcento Lucro: %.2f%%\n", produto[i].porcentoLucro);
						printf("Fabricante Marca: %s\n", produto[i].fabricante[i].marca);
					}
	                break;
        }
    } while (opcao != 0);

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