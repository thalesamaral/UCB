//  Sintese
//  Nome....: "Thales Amaral Lima"
//  Data....: "15/05/2023"
/*	Objetivo: Elabore programa exemplo (livre) de passagem de parâmetros por valor e por referência, explique o funcionamento do código comentando linha a linha.*/
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
// Protótipo da função **********************************************
void nomeFuncao(int, int*); //Por REFERÊNCIA deve adicionar um asterisco para o tipo da variável

//=== BLOCO PRINCIPAL ===============================================
int main(void){
//Declarações
	int valor = 0, referencia = 0; //valores iniciados com 0
//Instruções
	
	printf("\n*** Valores no MAIN (Antes de passar na Funcao) ****\n");
	printf("Tipo Valor.....: %d\n",valor);
	printf("Tipo Referencia: %d\n",referencia);
	
	nomeFuncao(valor, &referencia); //Por REFERÊNCIA deve adicionar um "E" Comercial para a variável
	
	printf("\n*** Valores no MAIN (depois de passar na Funcao) ***\n");
	printf("Tipo Valor.....: %d\n",valor); //no MAIN o tipo valor não é alterado pela função
	printf("Tipo Referencia: %d\n",referencia); //no MAIN o tipo referência é alterado pela função
	
	return 0;
}
//=== FIM DO BLOCO ==================================================

// Função
void nomeFuncao(int tipoValor, int *tipoReferencia){ //Por REFERÊNCIA deve adicionar um asterisco para a variável
	int dado = 1; // dado = variável; valor; expressão; Função.

	//exemplo de uso do parâmetro POR VALOR:
	tipoValor = dado; //Altera a variável apenas dentro da função
	
	//exemplo de uso do parâmetro POR REFERÊNCIA:
	*tipoReferencia = dado; //Altera a variável dentro da função e altera o dado no MAIN da variável referenciada

	printf("\n*** Valores na Funcao ******************************\n");
	printf("Tipo Valor.....: %d\n",tipoValor); //dentro da função o tipoValor apresenta o novo dado
	printf("Tipo Referencia: %d\n",*tipoReferencia); //dentro da função o tipoReferencia apresenta o novo dado
}