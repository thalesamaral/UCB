//  Sintese
//  Nome....: "Thales Amaral Lima"
//  Data....: "16/05/2023"
/*	Objetivo: Elabore um programa onde o usuário armazenará produtos, UFs, fabricantes e clientes, serão cadastrados pelo usuário no mínimo 2 fabricantes (máximo 5), mínimo 3 clientes (máximo 30) e no mínimo 5 produtos (máximo 50), todas as 27 Unidades da Federação. */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
//MIN e MAX: Fabricantes
#define MINF 2
#define MAXF 5
//MIN e MAX: Produtos
#define MINP 2
#define MAXP 5
//MIN e MAX: Cliente
#define MINC 2
#define MAXC 5

//*** Declaracoes de tipos ******************************************
typedef struct {
    int codigo;
	/*char marca[50];
	char site[50];
	int telefone;
	char uf[2];*/
}tFabricante;

struct tProduto{
	char descricao[50];
	/*float peso;
	float valorCompra;
	float valorVenda;
	float valorLucro;
	float porcentoLucro;*/
	tFabricante fabricanteFK;
};

struct tCliente{
	char nome[50];
	int idade;
};

//*** Prototipos de funcoes *****************************************
int menu(void);
//int validaUF(tFabricante);
void listarProduto(struct tProduto);
void ordenarProdutos(struct tProduto*, int);
//int compararValor1(const void*, const void*);
//int compararValor2(const void*, const void*);

//=== BLOCO PRINCIPAL ===============================================
int main(void){
// Declarações
	int i=0, j;
	int opcao, qtdF=0, qtdP=0, qtdC=0, flag=0, codigoF;
	//int maisCaro, maisBarato;
	//char marcaPesquisa[50];//RETIRAR
	tFabricante fabricante[MAXF];
	/* = {
		{"AAA", "Aemail", 123, "DF"},
		{"BBB", "Bemail", 321, "GO"},
		{"CCC", "Cemail", 456, "RJ"},
		{"DDD", "Demail", 654, "SP"},
		{"EEE", "Eemail", 789, "AM"},
		{"FFF", "Femail", 987, "RS"},
		{"GGG", "Gemail", 159, "ES"},
		{"HHH", "Hemail", 951, "TO"}
	};*/
	struct tProduto produto[MAXP];//, *listaP = NULL;
	/* = {
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
	};*/
    struct tCliente cliente[MAXC];
// Instruções

	do {
        opcao = menu();
        switch (opcao) {
               	case 1:
                    printf("\n*** Inclusao Fabricante (MINIMO %d - MAXIMO %d) ***\n",MINF, MAXF);
					do{
						if (qtdF < MAXF){
							printf("\nFABRICANTE %d:\n", qtdF + 1);
                            printf("  Codigo: ");
							scanf("%d", &fabricante[qtdF].codigo);
							/*printf("  Marca: ");
							setbuf(stdin, 0);
							fflush(stdin);
							gets(fabricante[qtdF].marca);
							printf("  Site: ");
							gets(fabricante[qtdF].site);
							printf("  Telefone: ");
							scanf("%d", &fabricante[qtdF].telefone);
							do{
								printf("  UF: ");
								fflush(stdin);
								gets(fabricante[qtdF].uf);
							}while(validaUF(fabricante[qtdF]));*/
							qtdF++;
						}else{
								printf("Vetor cheio!\n");
							}
					}while(qtdF < MINF);
	                break;
				case 2:
                    printf("\n*** Inclusao Produto (MINIMO %d - MAXIMO %d) ***\n",MINP, MAXP);
					if(qtdF > 0){
						do{
							if(qtdP < MAXP){
								printf("\nPRODUTO %d:\n", qtdP + 1);
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
								produto[qtdP].valorLucro = produto[qtdP].valorVenda - produto[qtdP].valorCompra;
								produto[qtdP].porcentoLucro = (produto[qtdP].valorLucro*100)/produto[qtdP].valorCompra;*/
								// Seleção do fabricante
								do{
									printf("  FABRICANTE (1-%d): ",qtdF);
									scanf("%d", &j);
									if (j < 1 || j > qtdF) {
										printf("FABRICANTE inválido!\n");
									}else{
										produto[qtdP].fabricanteFK = fabricante[j-1];
										qtdP++;
									}
								}while(j < 1 || j > qtdF);
							}else{
									printf("Vetor cheio!\n");
								}
						}while(qtdP < MINP);
					}else{
						printf("\nERRO: Necessario inclusao de Fabricante!!!\n");
					}
	                break;
                case 3:
                    printf("\n*** Inclusao Cliente (MINIMO %d - MAXIMO %d) ***\n",MINC, MAXC);
					do{
						if (qtdC < MAXC){
							printf("\nCLIENTE %d:\n", qtdC + 1);
							printf("  Nome: ");
							setbuf(stdin, 0);
							fflush(stdin);
							gets(cliente[qtdC].nome);
							printf("  Idade: ");
							scanf("%d", &cliente[qtdC].idade);
							qtdC++;
						}else{
								printf("Vetor cheio!\n");
							}
					}while(qtdC < MINC);
	                break;
               	case 4:
                    printf("\n*** Listagem Produtos ***\n\n");
                    for (i=0; i<qtdP; i++){
						listarProduto(produto[i]);
					}
	                break;
				/*case 4:
					printf("\n*** Listagem Marcas ***\n\n");
					for (i=0; i<qtdF; i++){
						printf("FABRICANTE - Marca: %s\n", fabricante[i].marca);
					}
					break;*/
				case 5:
					printf("\n*** Listagem Produtos de um Fabricante. Ordem alfabetica ***\n\n");
					printf(" Digite o codigo do Fabricante: ");
					scanf("%d",&codigoF);
					// Ordenando a lista em ordem alfabética
					ordenarProdutos(produto,qtdP);
					for(i=0; i<qtdP; i++){
						if(codigoF == produto[i].fabricanteFK.codigo){
							listarProduto(produto[i]);
							flag=1;
						}
					}
					if(flag==0){
						printf("\nERRO: digite uma MARCA existente!!!\n");
					}
					break;
				/*case 6:
				printf("\n*** Estado dos produtos mais caros ***\n\n");
				for(i=0;i<qtdP;i++){
					if(i == 0){
						maisCaro = produto[i].valorCompra;
					}else if(produto[i].valorCompra > maisCaro){
								maisCaro = produto[i].valorCompra;
							}
				}
				for(i=0;i<qtdP;i++){
					if(produto[i].valorCompra == maisCaro){
						printf("****************************************\n");
						printf("Estado (UF): %s\n",produto[i].fabricanteFK.uf);
						printf("PRODUTO - Descricao: %s; Valor Compra: %.2f\n\n",produto[i].descricao,produto[i].valorCompra);
					}
				}
				break;
				case 7:
				printf("\n*** Fabricante dos produtos mais baratos ***\n\n");
				for(i=0;i<qtdP;i++){
					if(i == 0){
						maisBarato = produto[i].valorCompra;
					}else if(produto[i].valorCompra < maisBarato){
								maisBarato = produto[i].valorCompra;
							}
				}
				for(i=0;i<qtdP;i++){
					if(produto[i].valorCompra == maisBarato){
						printf("****************************************\n");
						printf("FABRICANTE - Marca: %s\n",produto[i].fabricanteFK.marca);
						printf("PRODUTO - Descricao: %s; Valor Compra: %.2f\n\n",produto[i].descricao,produto[i].valorCompra);
					}
				}
				break;
				case 8:
				printf("\n*** Listar produtos em ordem crescente de Valor de Compra***\n\n");
					qsort(produto, qtdP, sizeof(struct tProduto), compararValor1);
					for (i=0; i<qtdP; i++) {
						//printf("\n|Produto   | Descricao: %s; Valor Compra: %.2f\n",produto[i].descricao,produto[i].valorCompra);
						listarProduto(produto[i]);
					}
				break;
				case 9:
				printf("\n*** Listar produtos em ordem crescente de Valor de Lucro ***\n\n");
					qsort(produto, qtdP, sizeof(struct tProduto), compararValor2);
					for (i=0; i<qtdP; i++) {
						//printf("\n|Produto   | Descricao: %s; Valor Lucro: %.2f\n",produto[i].descricao,produto[i].valorLucro);
						listarProduto(produto[i]);
					}
				break;
                case 10:
				printf("\n*** Cliente com mais de 60 anos - Busca Sequencial ***\n\n");

				break;
                case 11:
				printf("\n*** Valor de Produto - Busca Binaria ***\n\n");
                
				break;
                case 12:
				printf("\n*** Atendimento dos clientes que estão na lista original - Acesso em Fila ***\n\n");
                
				break;
                case 13:
				printf("\n*** Atendimento dos clientes que estão na lista +60 - Acesso em Pilha ***\n\n");
                
				break;*/
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
        printf("3. Inclusao Cliente\n");
		printf("4. Listagem Produtos\n");//retirar
		///printf("4. Listagem Marcas\n");//retirar
		printf("5. Listagem Produtos de um Fabricante. Ordem alfabetica\n");//a Listagem Produtos de um Fabricante
		/*printf("6. Estados dos Produtos mais caro\n");//b
		printf("7. Fabricantes com Produtos mais barato\n");//c
		printf("8. Listar Produtos em Ordem crescente Valor Compra\n");//d
		printf("9. Listar Produtos em Ordem crescente Valor Lucro\n");//e
        printf("10. Cliente com mais de 60 anos - Busca Sequencial\n");//g
        printf("11. Valor de Produto - Busca Binaria\n");//h
        printf("12. Atendimento dos clientes que estão na lista original - Acesso em Fila\n");//i
        printf("13. Atendimento dos clientes que estão na lista +60 - Acesso em Pilha\n");//j*/
		printf("0. Sair\n\n");
		printf("Escolha sua opcao: ");
		scanf("%d", &op);
		return op;
}

// Validar Estado (UF) **********************************************
/*int validaUF(tFabricante f){
	if((strcmp(f.uf,"RO")!=0) && (strcmp(f.uf,"AC")!=0) && (strcmp(f.uf,"AM")!=0) && (strcmp(f.uf,"RR")!=0)
	&& (strcmp(f.uf,"PA")!=0) && (strcmp(f.uf,"AP")!=0) && (strcmp(f.uf,"TO")!=0) && (strcmp(f.uf,"MA")!=0)
	&& (strcmp(f.uf,"PI")!=0) && (strcmp(f.uf,"CE")!=0) && (strcmp(f.uf,"RN")!=0) && (strcmp(f.uf,"PB")!=0)
	&& (strcmp(f.uf,"PE")!=0) && (strcmp(f.uf,"AL")!=0) && (strcmp(f.uf,"SE")!=0) && (strcmp(f.uf,"BA")!=0)
	&& (strcmp(f.uf,"MG")!=0) && (strcmp(f.uf,"ES")!=0) && (strcmp(f.uf,"RJ")!=0) && (strcmp(f.uf,"SP")!=0)
	&& (strcmp(f.uf,"PR")!=0) && (strcmp(f.uf,"SC")!=0) && (strcmp(f.uf,"RS")!=0) && (strcmp(f.uf,"MS")!=0)
	&& (strcmp(f.uf,"MT")!=0) && (strcmp(f.uf,"GO")!=0) && (strcmp(f.uf,"DF")!=0))
	{
		printf("ERRO: digite um UF existente!!!\n\n");
		return 1;
	}else
		return 0;
}*/

// Listagem geral dos Produtos **************************************
void listarProduto(struct tProduto p){
	printf("\n****************************************\n");
	printf("*** PRODUTO\n");
	printf(" Descricao: %s\n", p.descricao);
	/*printf(" Peso: %.2f\n", p.peso);
	printf(" Valor Compra: %.2f\n", p.valorCompra);
	printf(" Valor Venda: %.2f\n", p.valorVenda);
	printf(" Valor Lucro: %.2f\n", p.valorLucro);
	printf(" Porcento Lucro: %.2f%%\n", p.porcentoLucro);*/
	printf("--------------------\n");
	printf("--- FABRICANTE\n");
    printf(" Codigo: %d\n", p.fabricanteFK.codigo);
	/*printf(" Marca: %s\n", p.fabricanteFK.marca);
	printf(" Site: %s\n", p.fabricanteFK.site);
	printf(" Telefone: %d\n", p.fabricanteFK.telefone);
	printf(" UF: %s\n", p.fabricanteFK.uf);*/
}

//*** Bubble Sort ***************************************************
/*/void bubbleSort(int vet[], int tam){
	int bolha, borda, aux;
	
	for(borda=tam-1; borda>0; borda--){
		for(bolha=0; bolha<borda; bolha++){
			if(vet[bolha] > vet[bolha+1]){ 
				aux = vet[bolha];
				vet[bolha] = vet[bolha+1];
				vet[bolha+1] = aux;
			}
		}
	}
}*/

// Função para ordenar um array de produtos em ordem alfabética pelo nome usando Bubble Sort
void ordenarProdutos(struct tProduto* produtos, int tam) {
    int trocado;
    struct tProduto aux;

    for (int i=0; i<tam-1; i++) {
        trocado = 0;
        for (int j=0; j<tam-i-1; j++) {
            if (strcmp(produtos[j].descricao, produtos[j+1].descricao) > 0) {
                // Trocar os produtos
                aux = produtos[j];
                produtos[j] = produtos[j+1];
                produtos[j+1] = aux;
                trocado = 1;
            }
        }
        if (trocado == 0)
            break;
    }
}
// Comparar Valor para Ordenação ************************************
/*int compararValor1(const void* a, const void* b){
	const struct tProduto* produtoA = (const struct tProduto*)a;
    const struct tProduto* produtoB = (const struct tProduto*)b;
    
    return produtoA->valorCompra - produtoB->valorCompra;
}
int compararValor2(const void* a, const void* b){
	const struct tProduto* produtoA = (const struct tProduto*)a;
    const struct tProduto* produtoB = (const struct tProduto*)b;
    
    return produtoA->valorLucro - produtoB->valorLucro;
}
*/