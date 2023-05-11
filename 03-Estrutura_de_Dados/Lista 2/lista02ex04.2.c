//  Sintese
//  Nome....: "Thales Amaral Lima"
//  Data....: "11/05/2023"
/*	Objetivo: Elabore um programa onde o usuário armazenará por meio de Structs os dados de "Produto" e "Fabricante", deverão serem cadastrados no mínimo 2 fabricantes (máximo 5) e no mínimo 5 produtos (máximo 50). */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define MAXP 15
#define MAXF 10

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
	//float valorVenda;
	float valorLucro;
	//float porcentoLucro;
	tFabricante fabricanteFK;
};

//*** Prototipos de funcoes *****************************************
int menu(void);
int validaUF(tFabricante);
int compararValor(const void* a, const void* b){
	const struct tProduto* produtoA = (const struct tProduto*)a;
    const struct tProduto* produtoB = (const struct tProduto*)b;
    
    return produtoA->valorCompra - produtoB->valorCompra;
}

//=== BLOCO PRINCIPAL ===============================================
int main(void){
// Declarações
	int i=0, j;
	int opcao, qtdP=10, qtdF=8, maisCaro, maisBarato;//, flag=0;
	char marcaPesquisa[50];
	tFabricante fabricante[MAXF] = {
		{"AAA", "Aemail", 123, "DF"},
		{"BBB", "Bemail", 321, "GO"},
		{"CCC", "Cemail", 456, "RJ"},
		{"DDD", "Demail", 654, "SP"},
		{"EEE", "Eemail", 789, "AM"},
		{"FFF", "Femail", 987, "RS"},
		{"GGG", "Gemail", 159, "ES"},
		{"HHH", "Hemail", 951, "TO"}
	};
	struct tProduto produto[MAXP] = {
		{"aaa", 80, 10, 6, fabricante[0]},
		{"bbb", 80, 50, 45, fabricante[2]},
		{"ccc", 80, 11, 10, fabricante[3]},
		{"ddd", 80, 18, 9, fabricante[4]},
		{"eee", 80, 48, 8, fabricante[5]},
		{"fff", 80, 99, 80, fabricante[5]},
		{"ggg", 80, 99, 8, fabricante[1]},
		{"hhh", 80, 65, 50, fabricante[6]},
		{"iii", 80, 33, 22, fabricante[7]},
		{"jjj", 80, 27, 9, fabricante[0]}
	};
	

// Principal

	do {
        opcao = menu();
        switch (opcao) {
               	case 1: 
                    printf("\n\n*** Inclusao Fabricante ***\n\n");
					if (qtdF < MAXF){
						printf("Fabricante %d:\n", qtdF + 1);
						printf("  Marca: ");
						setbuf(stdin, 0);
						fflush(stdin);
						gets(fabricante[qtdF].marca);
						//printf("  Site: ");
						//gets(fabricante[qtdF].site);
						//printf("  Telefone: ");
						//scanf("%d", &fabricante[qtdF].telefone);
						do{
							printf("  UF: ");
							fflush(stdin);
							gets(fabricante[qtdF].uf);
						}while(validaUF(fabricante[qtdF]));
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
						printf("  Peso: ");
                    	scanf("%f",&produto[qtdP].peso);
                    	printf("  Valor Compra: ");
                    	scanf("%f",&produto[qtdP].valorCompra);
						/*printf("  Valor Venda: ");
                    	scanf("%f",&produto[qtdP].valorVenda);
						produto[qtdP].valorLucro = produto[qtdP].valorCompra - produto[qtdP].valorVenda;
						produto[qtdP].porcentoLucro = (produto[qtdP].valorLucro*100)/produto[qtdP].valorCompra;*/
						// Seleção do fabricante
						do{
							printf("  Fabricante (1-%d): ",qtdF);
							scanf("%d", &j);
							if (j < 1 || j > qtdF) {
								printf("Fabricante inválido!\n");
							}else{
								produto[qtdP].fabricanteFK = fabricante[j-1];
								qtdP++;
							}
						}while(j < 1 || j > qtdF);
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
						printf("Peso: %.2f\n", produto[i].peso);
						printf("Valor Compra: %.2f\n", produto[i].valorCompra);
						//printf("Valor Venda: %.2f\n", produto[i].valorVenda);
						printf("Valor Lucro: %.2f\n", produto[i].valorLucro);
						//printf("Porcento Lucro: %.2f%%\n", produto[i].porcentoLucro);
						printf("Fabricante Marca: %s\n", produto[i].fabricanteFK.marca);
						printf("Fabricante Site: %s\n", produto[i].fabricanteFK.site);
						printf("Fabricante Telefone: %d\n", produto[i].fabricanteFK.telefone);
						printf("Fabricante UF: %s\n", produto[i].fabricanteFK.uf);
					}
	                break;
				case 4:
					printf("\n\n*** Listagem Marcas ***\n\n");
					for (i=0; i<qtdF; i++){
						printf("Fabricante Marcas: %s\n", fabricante[i].marca);
					}
					break;
				case 5:
					printf("\n\n*** Listagem Produtos de uma Marca ***\n\n"); 
					printf("  Produtos de uma Marca: ");
						setbuf(stdin, 0);
						fflush(stdin);
						gets(marcaPesquisa);
					for(i=0; i<qtdP; i++){
						do{
							if(strcmp(marcaPesquisa,produto[i].fabricanteFK.marca)==0){
								printf(" Produto %d:\n",i+1);
								printf("Descricao: %s\n", produto[i].descricao);
							}else{
								printf("ERRO: digite uma MARCA existente!!!");
							}
						}while(strcmp(marcaPesquisa,produto[i].fabricanteFK.marca)!=0);
					}
					break;
				case 6:
				printf("\n\n*** Estado dos produtos mais caros ***\n\n");
				printf("  Estado dos produtos mais caros: ");
				for(i=0;i<qtdP;i++){
					if(i == 0){
						maisCaro = produto[i].valorCompra;
					}else if(produto[i].valorCompra > maisCaro){
								maisCaro = produto[i].valorCompra;
							}
				}
				for(i=0;i<qtdP;i++){
					if(produto[i].valorCompra == maisCaro){
						printf("\nEstado: %s",produto[i].fabricanteFK.uf);
						printf("\nProduto: %s",produto[i].descricao);
						printf("\nValor Compra: %.2f",produto[i].valorCompra);
					}
				}
				break;
				case 7:
				printf("\n\n*** Fabricante dos produtos mais baratos ***\n\n");
				for(i=0;i<qtdP;i++){
					if(i == 0){
						maisBarato = produto[i].valorCompra;
					}else if(produto[i].valorCompra < maisBarato){
								maisBarato = produto[i].valorCompra;
							}
				}
				for(i=0;i<qtdP;i++){
					if(produto[i].valorCompra == maisBarato){
						printf("\nFabricante: %s",produto[i].fabricanteFK.marca);
						printf("\nProduto: %s",produto[i].descricao);
						printf("\nValor Compra: %.2f",produto[i].valorCompra);
					}
				}
				break;
				case 8:
				printf("\n\n*** Listar produtos em ordem crescente de Valor de Compra***\n\n");
					qsort(produto, qtdP, sizeof(struct tProduto), compararValor);
					for (i=0; i<qtdP; i++) {
						printf("descricao: %s, valorCompra: %.2f\n", produto[i].descricao, produto[i].valorCompra);
					}
				break;
				case 9:
				printf("\n\n*** Listar produtos em ordem crescente de Valor de Lucro ***\n\n");
					qsort(produto, qtdP, sizeof(struct tProduto), compararValor);
					for (i=0; i<qtdP; i++) {
						printf("Descricao: %s, Valor Lucro: %.2f\n", produto[i].descricao, produto[i].valorLucro);
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
		printf("2. Inclusao Produto\n");
		printf("3. Listagem Produtos\n");
		printf("4. Listagem Marcas\n");
		printf("5. Listagem Produtos de uma Marca\n");
		printf("6. Estados dos Produtos mais caro\n");
		printf("7. Fabricantes com Produtos mais barato\n");
		printf("8. Listar Produtos em Ordem crescente Valor Compra\n");
		printf("9. Listar Produtos em Ordem crescente Valor Lucro\n");
		printf("0. Sair\n\n");
		printf("Escolha sua opcao: ");
		scanf("%d", &op);
		return op;
}

//
int validaUF(tFabricante f){
	if((strcmp(f.uf,"RO")!=0) && (strcmp(f.uf,"AC")!=0) && (strcmp(f.uf,"AM")!=0) && (strcmp(f.uf,"RR")!=0)
	&& (strcmp(f.uf,"PA")!=0) && (strcmp(f.uf,"AP")!=0) && (strcmp(f.uf,"TO")!=0) && (strcmp(f.uf,"MA")!=0)
	&& (strcmp(f.uf,"PI")!=0) && (strcmp(f.uf,"CE")!=0) && (strcmp(f.uf,"RN")!=0) && (strcmp(f.uf,"PB")!=0)
	&& (strcmp(f.uf,"PE")!=0) && (strcmp(f.uf,"AL")!=0) && (strcmp(f.uf,"SE")!=0) && (strcmp(f.uf,"BA")!=0)
	&& (strcmp(f.uf,"MG")!=0) && (strcmp(f.uf,"ES")!=0) && (strcmp(f.uf,"RJ")!=0) && (strcmp(f.uf,"SP")!=0)
	&& (strcmp(f.uf,"PR")!=0) && (strcmp(f.uf,"SC")!=0) && (strcmp(f.uf,"RS")!=0) && (strcmp(f.uf,"MS")!=0)
	&& (strcmp(f.uf,"MT")!=0) && (strcmp(f.uf,"GO")!=0) && (strcmp(f.uf,"DF")!=0))
	{
		printf("ERRO: digite um UF existente!!!");
		return 1;
	}else
		return 0;
}

/*
struct fabricante[] = {
	{"AAA", "Aemail", 123, "DF"},
	{"BBB", "Bemail", 321, "GO"},
	{"CCC", "Cemail", 456, "RJ"},
	{"DDD", "Demail", 654, "SP"},
	{"EEE", "Eemail", 789, "AM"},
	{"FFF", "Femail", 987, "RS"},
	{"GGG", "Gemail", 159, "ES"},
	{"HHH", "Hemail", 951, "TO"},
}

struct tProduto produto[] = {
	{"aaa", 80, 10, 6, 1},
	{"bbb", 80, 50, 45, 2},
	{"ccc", 80, 11, 10, 3},
	{"ddd", 80, 18, 9, 4},
	{"eee", 80, 48, 8, 5},
	{"fff", 80, 99, 80, 5},
	{"ggg", 80, 99, 8, 1},
	{"hhh", 80, 65, 50, 6},
	{"iii", 80, 33, 22, 7},
	{"jjj", 80, 27, 9, 8}
}
*/