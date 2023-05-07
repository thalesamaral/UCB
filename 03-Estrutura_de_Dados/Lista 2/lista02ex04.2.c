//  Sintese
//  Nome....: "Thales Amaral Lima"
//  Data....: "07/05/2023"
/*	Objetivo: Elabore um programa onde o usuário armazenará por meio de Structs os dados de "Produto" e "Fabricante", deverão serem cadastrados no mínimo 2 fabricantes (máximo 5) e no mínimo 5 produtos (máximo 50). */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define MAXP 50
#define MAXF 5

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

//=== BLOCO PRINCIPAL ===============================================
int main(){
// Declarações
	int i=0;
	struct tProduto produto[MAXP];
	struct tFabricante fabricante[MAXF];

// Principal
	fabricante[0].telefone = 123;
	printf("%d",fabricante[0].telefone);

	return 0;
}
//=== FIM DO BLOCO ==================================================
