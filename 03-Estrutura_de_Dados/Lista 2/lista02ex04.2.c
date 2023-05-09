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
typedef struct {
	char marca[50];
	char site[50];
	int telefone;
	char uf[2];
}tFabricante;

struct tProduto{
	char descricao[50];
	float peso;
	float valorCompra;
	float valorVenda;
	float valorLucro;
	float porcentoLucro;
	tFabricante fabricanteFK;
};

//*** Prototipos de funcoes *****************************************
int menu(void);

//=== BLOCO PRINCIPAL ===============================================
int main(void){
// Declarações
	int i=0, j;
	int opcao, qtdP=0, qtdF=0;//, flag=0;
	char marca[50];
	struct tProduto produto[MAXP];
	tFabricante fabricante[MAXF];

// Principal
	/*produto[0].fabricante[0].telefone = 123;
	printf("%d",produto[0].fabricante[0].telefone);*/

	do {
        opcao = menu();
        switch (opcao) {
               	case 1: 
                    printf("\n\n*** Inclusao Fabricante ***\n\n");
					if (qtdF < MAXF){
						//flag = 1;
						printf("Fabricante %d:\n", qtdF + 1);
						printf("  Marca: ");
						setbuf(stdin, 0);
						fflush(stdin);
						gets(fabricante[qtdF].marca);
						//printf("  Site: ");
						//gets(fabricante[qtdF].site);
						//printf("  Telefone: ");
						//scanf("%d", &fabricante[qtdF].telefone);
						//printf("  UF: ");
						//fflush(stdin);
						//gets(fabricante[qtdF].uf);
						qtdF++;
					}else{
							printf("Vetor cheio!\n");
						}
	                break;
				case 2: 
                    printf("\n\n*** Inclusao Produto ***\n\n");
                    if (qtdP < MAXP) {
						printf("Produto %d:\n", qtdP + 1);
                    	printf("  Descricao: ");
						setbuf(stdin, 0);
                    	fflush(stdin);
                    	gets(produto[qtdP].descricao);
						/*printf("  Peso: ");
                    	scanf("%f",&produto[qtdP].peso);
                    	printf("  Valor Compra: ");
                    	scanf("%f",&produto[qtdP].valorCompra);
						printf("  Valor Venda: ");
                    	scanf("%f",&produto[qtdP].valorVenda);
						produto[qtdP].valorLucro = produto[qtdP].valorCompra - produto[qtdP].valorVenda;
						produto[qtdP].porcentoLucro = (produto[qtdP].valorLucro*100)/produto[qtdP].valorCompra;*/
						// Seleção do fabricante
						printf("  Fabricante (1-%d): ",qtdF);
						scanf("%d", &j);
						if (j < 1 || j > qtdF) {
							printf("Fabricante inválido!\n");
						}
						produto[qtdP].fabricanteFK = fabricante[j-1];
						qtdP++;
					}
					else{
							printf("Vetor cheio!\n");
						}
	                break;
               	case 3: 
                    printf("\n\n*** Listagem Produtos ***\n\n");
                    for (i=0; i<qtdP; i++){
						printf("\n*** Produto ***\n");
						printf(" Produto %d:\n",i+1);
                    	printf("Descricao: %s\n", produto[i].descricao);
						/*printf("Peso: %.2f\n", produto[i].peso);
						printf("Valor Compra: %.2f\n", produto[i].valorCompra);
						printf("Valor Venda: %.2f\n", produto[i].valorVenda);
						printf("Valor Lucro: %.2f\n", produto[i].valorLucro);
						printf("Porcento Lucro: %.2f%%\n", produto[i].porcentoLucro);*/
						printf("Fabricante Marca: %s\n", produto[i].fabricanteFK.marca);
						//printf("Fabricante Site: %s\n", produto[i].fabricanteFK.site);
						//printf("Fabricante Telefone: %d\n", produto[i].fabricanteFK.telefone);
						//printf("Fabricante UF: %s\n", produto[i].fabricanteFK.uf);
					}
	                break;
				case 4:
					printf("\n\n*** Listagem Marcas ***\n\n");
					for (i=0; i<qtdF; i++){
						printf("Fabricante Telefone: %s\n", fabricante[i].marca);
					}
					break;
				case 5:
					printf("\n\n*** Listagem Produtos de uma Marca ***\n\n"); //*criar função para listagem
					printf("  Marca: ");
						setbuf(stdin, 0);
						fflush(stdin);
						gets(marca);
					for(i=0; i<qtdP; i++){
						if(strcmp(marca,produto[i].fabricanteFK.marca)==0){
							printf(" Produto %d:\n",i+1);
                    		printf("Descricao: %s\n", produto[i].descricao);
						}
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
    printf("1. Inclusao Fabricante\n");
	printf("2. Inclusao Produtos\n");
	printf("3. Listagem Produtos\n");
    printf("4. Listagem Marcas\n");
	printf("5. Listagem Produtos de uma Marca\n");
	//printf("6. Estado dos produtos mais caro\n");
	//printf("7. Fabricantes com Produto mais barato\n");
	//printf("8. Produtos Ordem crescente Valor\n");
	//printf("9. Produtos Ordem crescente Valor Lucro\n");
    printf("0. Sair\n\n");
    printf("Escolha sua opcao: ");
    scanf("%d", &op);
    return op;
}