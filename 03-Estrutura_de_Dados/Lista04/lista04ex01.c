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
#define MINP 2//5
#define MAXP 5//50
//MIN e MAX: Cliente
#define MINC 3
#define MAXC 30

//*** Declaracoes de tipos ******************************************
typedef struct {
    int codigo;
	char marca[50];
	//char site[50];
	//int telefone;
	char uf[33];
}tFabricante;

struct tProduto{
	char descricao[50];
	//float peso;
	float valorCompra;
	float valorVenda;
	float valorLucro;
	float porcentoLucro;
	tFabricante fabricanteFK;
};

struct tCliente{
	//char nome[50];
	int idade;
};

struct tEstadoUF{
	char sigla[3];
	char nome[30];
};

//*** Prototipos de funcoes *****************************************
int menu(void);
int validaUF(tFabricante*, int, struct tEstadoUF*);
void listarProduto(struct tProduto);
void ordenarProdutos(struct tProduto*, int);
void buscaBinaria(struct tProduto*, int, float);
int compararValor1(const void*, const void*);
int compararValor2(const void*, const void*);

//=== BLOCO PRINCIPAL ===============================================
int main(void){
// Declarações
	int i=0, j, k=0;
	int opcao, qtdF=0, qtdP=0, qtdC=0, qtdC60=0, flag=0, flag1=0, codigoFab;
	int maisCaro, maisBarato;
	float valor;
	tFabricante fabricante[MAXF];
	struct tProduto produto[MAXP];
    struct tCliente cliente[MAXC], lista_60[MAXC];
	struct tEstadoUF estadoUF[] = {{"AC", "Acre"},{"AL", "Alagoas"},{"AP", "Amapa"},{"AM", "Amazonas"},
        {"BA", "Bahia"},{"CE", "Ceara"},{"DF", "Distrito Federal"},{"ES", "Espirito Santo"},
		{"GO", "Goias"},{"MA", "Maranhao"},{"MT", "Mato Grosso"},{"MS", "Mato Grosso do Sul"},
		{"MG", "Minas Gerais"},{"PA", "Para"},{"PB", "Paraiba"},{"PR", "Parana"},
		{"PE", "Pernambuco"},{"PI", "Piaui"},{"RJ", "Rio de Janeiro"},{"RN", "Rio Grande do Norte"},
		{"RS", "Rio Grande do Sul"},{"RO", "Rondonia"},{"RR", "Roraima"},{"SC", "Santa Catarina"},
        {"SP", "Sao Paulo"},{"SE", "Sergipe"},{"TO", "Tocantins"}};
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
							printf("  Marca: ");
							setbuf(stdin, 0);
							fflush(stdin);
							gets(fabricante[qtdF].marca);
							/*printf("  Site: ");
							gets(fabricante[qtdF].site);
							printf("  Telefone: ");
							scanf("%d", &fabricante[qtdF].telefone);*/
							do{
								printf("  UF: ");
								setbuf(stdin, 0);
								fflush(stdin);
								gets(fabricante[qtdF].uf);
							}while(validaUF(fabricante, qtdF, estadoUF));
							//printf("%s\n",fabricante[qtdF].uf);
							qtdF++;
						}else{
								printf("VETOR CHEIO!!!\n");
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
								//printf("  Peso: ");
								//scanf("%f",&produto[qtdP].peso);
								printf("  Valor Compra: ");
								scanf("%f",&produto[qtdP].valorCompra);
								printf("  Valor Venda: ");
								scanf("%f",&produto[qtdP].valorVenda);
								produto[qtdP].valorLucro = produto[qtdP].valorVenda - produto[qtdP].valorCompra;
								produto[qtdP].porcentoLucro = (produto[qtdP].valorLucro*100)/produto[qtdP].valorCompra;
								// Seleção do fabricante
								do{
									printf("\nSelecionar fabricante da lista:\n");
									for(i=0; i<qtdF; i++){
										printf("FABRICANTE(%d): %s\n",i+1,fabricante[i].marca);
									}
									printf("\n  FABRICANTE (1-%d): ",qtdF);
									scanf("%d", &j);
									if (j < 1 || j > qtdF) {
										printf("ERRO: FABRICANTE invalido!\n");
									}else{
										produto[qtdP].fabricanteFK = fabricante[j-1];
										qtdP++;
									}
								}while(j < 1 || j > qtdF);
							}else{
									printf("VETOR CHEIO!!!\n");
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
							/*printf("  Nome: ");
							setbuf(stdin, 0);
							fflush(stdin);
							gets(cliente[qtdC].nome);*/
							printf("  Idade: ");
							scanf("%d", &cliente[qtdC].idade);
							qtdC++;
						}else{
								printf("VETOR CHEIO!!!\n");
							}
					}while(qtdC < MINC);
	            break;
				//LISTAGEM DE PRODUTOS ------------------------------------------------------------
               	case 4:
                    printf("\n*** Listagem Produtos ***\n\n");
                    for (i=0; i<qtdP; i++){
						listarProduto(produto[i]);
					}
	            break;

				case 5:
					printf("\n*** Listagem Produtos de um Fabricante. Ordem alfabetica ***\n\n");
					printf(" Digite o codigo do Fabricante: ");
					scanf("%d",&codigoFab);
					// Ordenando a lista em ordem alfabética
					ordenarProdutos(produto,qtdP);
					for(i=0; i<qtdP; i++){
						if(codigoFab == produto[i].fabricanteFK.codigo){
							listarProduto(produto[i]);
							flag=1;
						}
					}
					if(flag==0){
						printf("\nERRO: codigo ou produto inexistente!!!\n");
						flag=0;
					}
				break;
				//LISTAGEM DE VALORES -------------------------------------------------------------
				case 6:
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
				printf("\n*** Fabricante do produto mais barato ***\n\n");
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
					printf("\n*** Valor de Produto - Busca Binaria ***\n\n");
					printf("Digite um valor de compra para busca: ");
					scanf("%f", &valor);
					buscaBinaria(produto,qtdP,valor);
				break;
				//LISTAGEM DE CLIENTES ------------------------------------------------------------
                case 11:
					printf("\n*** Cliente com mais de 60 anos na lista original - Busca Sequencial ***\n\n");
					for(i=0; i<qtdC; i++){
						if(cliente[i].idade >= 60){
							//printf("Nome: %s\n", cliente[i].nome);
							printf("Idade: %d\n", cliente[i].idade);
							k++;
						}
					}

					for(i=0; i<qtdC; i++){
						if(k >= 3){
							if(cliente[i].idade >= 60){
								// Adiciona o cliente ao vetor de clientes +60
								lista_60[qtdC60] = cliente[i];
								qtdC60++;

								// Remove o cliente da lista original
								for (j=i; j<qtdC-1; j++) {
									cliente[j] = cliente[j+1];
								}

								// Atualiza o número total de clientes
								qtdC--;
								i--; // Ajustar o índice após a remoção
								flag1=1;
							}
						}else if(k==0){
								printf("Nao existem clientes com idade +60\n");
								break;
						}
					}
					if(flag1 == 0){
						k = 0; // Zera quantidade até encontrar os 3 primeiros +60
					}
				break;


                case 12:
					printf("\n*** Clientes que estao na lista original - Acesso em Fila ***\n\n");
					// Lista de clientes para atendimento FILA
					if(qtdC60 >= 3){
						printf("Lista original atualizada\n");
					}
					for (i = 0; i < qtdC; i++){
						//printf("Nome: %s\n", cliente[i].nome);
						printf("Idade: %d\n", cliente[i].idade);
					}
				break;

                case 13:
					printf("\n*** Clientes que estao na lista +60 - Acesso em Pilha ***\n\n");
					//Clientes para atendimento PILHA
					printf("Lista criada quando 3 clientes possuem idade +60\n");
					if(qtdC60 >= 3){
						for(i = qtdC60-1; i >= 0; i--){
							//printf("Nome: %s\n", lista_60[i].nome);
							printf("Idade: %d\n", lista_60[i].idade);
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

		printf("\n\n *** MENU ***\n");
		printf("============================================================\n");
		printf(" 1. INCLUSAO FABRICANTE\n");
		printf(" 2. INCLUSAO PRODUTO\n");
        printf(" 3. INCLUSAO CLIENTE\n");
		printf("============================================================\n");
		printf(" 4. Listagem Produtos\n");
		printf(" 5. Listagem Produtos de um Fabricante. Ordem alfabetica\n");
		printf(" 6. Estados dos Produtos mais caro\n");//b
		printf(" 7. Fabricantes com Produtos mais barato\n");//c
		printf(" 8. Listar Produtos em Ordem crescente Valor Compra\n");//d
		printf(" 9. Listar Produtos em Ordem crescente Valor Lucro\n");//e
        printf(" 10. Valor de Produto - Busca Binaria\n");//h
        printf(" 11. Cliente com mais de 60 anos - Busca Sequencial\n");//g
        printf(" 12. Atendimento clientes da lista original - Acesso em Fila\n");//i
        printf(" 13. Atendimento clientes da lista +60 - Acesso em Pilha\n");//j
		printf("============================================================\n");
		printf(" 0. Sair\n");
		printf("============================================================\n\n");
		printf(" Escolha sua opcao: ");
		scanf("%d", &op);
		return op;
}

// Listagem geral dos Produtos **************************************
void listarProduto(struct tProduto p){
	printf("\n****************************************\n");
	printf("*** PRODUTO\n");
	printf(" Descricao: %s\n", p.descricao);
	//printf(" Peso: %.2f kg\n", p.peso);
	printf(" Valor Compra: %.2f\n", p.valorCompra);
	printf(" Valor Venda: %.2f\n", p.valorVenda);
	printf(" Valor Lucro: %.2f\n", p.valorLucro);
	printf(" Porcento Lucro: %.2f%%\n", p.porcentoLucro);
	printf("--------------------\n");
	printf("--- FABRICANTE\n");
    printf(" Codigo: %d\n", p.fabricanteFK.codigo);
	printf(" Marca: %s\n", p.fabricanteFK.marca);
	//printf(" Site: %s\n", p.fabricanteFK.site);
	//printf(" Telefone: %d\n", p.fabricanteFK.telefone);
	printf(" UF: %s\n", p.fabricanteFK.uf);
}

// Validar Estado (UF) **********************************************
int validaUF(tFabricante *f, int j, struct tEstadoUF *estado){
	int i;

	for(i=0; i<27; i++){
		if(strcmp(f[j].uf,estado[i].sigla)==0){
			strcat(f[j].uf,", ");
			strcat(f[j].uf,estado[i].nome);
			return 0;
		}
	}

	printf("\nERRO! digite uma UF valida ou em maiusculo\n");
	return 1;
}

// Ordenar produtos em ordem alfabética - Bubble Sort ***************
void ordenarProdutos(struct tProduto* produtos, int tam){
    int trocado;
    struct tProduto aux;

    for(int i=0; i<tam-1; i++){
        trocado = 0;
        for(int j=0; j<tam-i-1; j++){
            if(strcmp(produtos[j].descricao, produtos[j+1].descricao) > 0){
                // Trocar os produtos
                aux = produtos[j];
                produtos[j] = produtos[j+1];
                produtos[j+1] = aux;
                trocado = 1;
            }
        }
        if(trocado == 0)
            break;
    }
}

//*** Busca Binaria *************************************************
void buscaBinaria (struct tProduto* vet, int n, float chave){
	int ini=0, meio, fim=n-1, flag=0;
		
	while(ini<=fim){
		meio = (ini + fim)/2;
		if(vet[meio].valorCompra==chave){
			flag=1;
			listarProduto(vet[meio]);
		}
		if (chave > vet[meio].valorCompra)
			ini = meio + 1;
		else
			fim = meio - 1;
	}
	if(flag==0){
		printf("ERRO: Valor nao encontrado!!!\n");
	}
}

// Comparar Valor para Ordenação ************************************
int compararValor1(const void* a, const void* b){
	const struct tProduto* produtoA = (const struct tProduto*)a;
    const struct tProduto* produtoB = (const struct tProduto*)b;
    
    return produtoA->valorCompra - produtoB->valorCompra;
}
int compararValor2(const void* a, const void* b){
	const struct tProduto* produtoA = (const struct tProduto*)a;
    const struct tProduto* produtoB = (const struct tProduto*)b;
    
    return produtoA->valorLucro - produtoB->valorLucro;
}