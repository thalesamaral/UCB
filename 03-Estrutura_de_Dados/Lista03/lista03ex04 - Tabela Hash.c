//  Sintese
//  Nome....: "Thales Amaral Lima"
//  Data....: "10/06/2023"
/*	Objetivo: Tabela Hash*/
#include <stdio.h>
#include <stdlib.h>

//*** Declaracoes de constantes *************************************
#define M 13
#define VAZIA -1
#define DELETADA 0
int acessos;

//*** Declaracoes de tipos ******************************************
struct tLista{
    int numero; //CHAVE
};

//*** Prototipos de funcoes *****************************************
int menu(void);
int hash(int, int);
int incluir(struct tLista[], struct tLista);
void listar(struct tLista[]);
int consultar(struct tLista[], int);
void excluir(struct tLista[], int);

//=== BLOCO PRINCIPAL ===============================================
int main(void){
//Declarações
	struct tLista tabelaHash[M], lista;
    int opcao, i, num;
//Instruções
    
	//Marca todas as posições como livres
	for(i=0; i<M; i++){
		tabelaHash[i].numero = VAZIA;
	}

    do{
        opcao = menu();
        switch (opcao) {
            case 1:
                printf("\n*** Inclusao ***\n");
                printf("Digite um numero: ");
                scanf("%d",&(lista.numero));
				if(!incluir(tabelaHash, lista)){
					printf("Tabela cheia!!\n");
				}
            break;

            case 2:
                printf("\n*** Listagem ***\n");
                listar(tabelaHash);
            break;
			
			case 3:
                printf("\n*** Consulta ***\n");
				printf("Digite um numero para consulta: ");
				scanf("%d",&num);
				acessos=0;
                i = consultar(tabelaHash, num);
				if(i != -1){
					printf("Encontrou o numero: %d\n", tabelaHash[i].numero);
				}else{
					printf("Numero nao encontrado!\n");
				}
				printf("QTD Acessos: %d\n", acessos);
            break;

			case 4:
                printf("\n*** Excluir ***\n");
				printf("Digite um numero para excluir: ");
				scanf("%d",&num);
                i = consultar(tabelaHash, num);
				if(i != -1){
					printf("Encontrou o numero: %d\n", tabelaHash[i].numero);
					excluir(tabelaHash, i);
				}else{
					printf("Numero nao encontrado!\n");
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
	printf("3. Consulta\n");
	printf("4. Excluir\n");
    printf("0. Sair\n\n");
    printf("Escolha sua opcao: ");
    scanf("%d", &op);
    return op;
}
//*** Hash ***************************************************
int hash(int k, int i){
	return (k + i) % M;
}

//*** Incluir *******************************************************
int incluir(struct tLista tabelaHash[], struct tLista item){
	int i=0, pos;
	do{
		pos = hash(item.numero, i);
		i++;
	}while((i < M) && ((tabelaHash[pos].numero != VAZIA) && (tabelaHash[pos].numero != DELETADA)));
	
	if(i == M){
		return 0;
	}

	tabelaHash[pos] = item;
	return 1;
}
//*** Listar *******************************************************
void listar(struct tLista tabelaHash[]){
	int i, n=0;

	for(i=0; i<M; i++){
		switch (tabelaHash[i].numero){
		case VAZIA:
			printf("[%3d] = (  )\n",i);
		break;

		case DELETADA:
			printf("[%3d] = ( - )\n",i);
		break;
		
		default:
			printf("[%3d] = ( X ) = %d\n",i,tabelaHash[i].numero);
			n++;
		break;
		}
	}

	printf("\nM ===== %d", M);
	printf("\nN ===== %d", n);
	printf("\nAlpha = %.2f", (n*1.0)/M);
}

//*** Consultar ********************************************************
int consultar(struct tLista tabelaHash[], int num){
	int i=0, pos;

	do{
		pos = hash(num, i);
		i++;
		acessos++;
	}while ((i < M) && (tabelaHash[pos].numero != VAZIA) && (tabelaHash[pos].numero != num));

	if((i == M) || (tabelaHash[pos].numero == VAZIA)){
		return -1;
	}

	return pos;
}

//*** Excluir ******************************************************
void excluir(struct tLista tabelaHash[], int i){
	tabelaHash[i].numero = DELETADA;
}