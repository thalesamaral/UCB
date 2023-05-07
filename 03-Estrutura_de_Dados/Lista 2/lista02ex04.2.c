//  Sintese
//  Nome....: "Thales Amaral Lima"
//  Data....: "07/05/2023"
/*	Objetivo: Elabore um programa onde o usuário armazenará por meio de Structs os dados de "Produto" e "Fabricante", deverão serem cadastrados no mínimo 2 fabricantes (máximo 5) e no mínimo 5 produtos (máximo 50). */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define MAXP 10
#define MAXF 5

//*** Declaracoes de tipos ******************************************
struct tProduto{
	char descricao[50];
	float peso;
	float valorCompra;
	float valorVenda;
	float valorLucro;
	float porcentoLucro;
	//struct tFabricante fabricante[MAXF];
};
struct tFabricante{
	char marca[50];
	char site[50];
	int telefone;
	char uf[2];
};
//*** Prototipos de funcoes *****************************************
int menu(void);

//=== BLOCO PRINCIPAL ===============================================
int main(void){
// Declarações
	int i, opcao, qtdProdutos=0;
	struct tProduto produto[MAXP];
	//struct tFabricante fabricante[MAXF];

// Principal
	/*fabricante[0].telefone = 123;
	printf("%d",fabricante[0].telefone);*/

	do {
        opcao = menu();
        switch (opcao) {
               case 1: 
                    printf("\n\n*** Inclusao ***\n\n");
                    if (qtdProdutos < MAXP) {
                    	printf("Digite a descricao: ");
                    	fflush(stdin);
                    	gets(produto[qtdProdutos].descricao);
						printf("Digite o peso...: ");
                    	scanf("%f",&produto[qtdProdutos].peso);
                    	printf("Digite o valor da compra....: ");
                    	scanf("%f",&produto[qtdProdutos].valorCompra);
						printf("Digite o valor da venda....: ");
                    	scanf("%f",&produto[qtdProdutos].valorVenda);
						produto[qtdProdutos].valorLucro = produto[qtdProdutos].valorCompra - produto[qtdProdutos].valorVenda;
						produto[qtdProdutos].porcentoLucro = (produto[qtdProdutos].valorVenda*100)/produto[qtdProdutos].valorCompra;
                    	qtdProdutos++;
					}
					else
						printf("Vetor cheio!\n");
	                break;
               case 2: 
                    printf("\n\n*** Listagem ***\n\n");
                    for (i=0; i<qtdProdutos; i++){
                    	printf("descricao: %s\n", produto[i].descricao);
						printf("peso: %.2f\n", produto[i].peso);
						printf("valorCompra: %.2f\n", produto[i].valorCompra);
						printf("valorVenda: %.2f\n", produto[i].valorVenda);
						printf("valorLucro: %.2f\n", produto[i].valorLucro);
						printf("porcentoLucro: %.2f%%\n", produto[i].porcentoLucro);
					}
	                break;
        }
    } while (opcao != 0);

	return 0;
}
//=== FIM DO BLOCO ==================================================

//*** Menu *********************************************************************
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