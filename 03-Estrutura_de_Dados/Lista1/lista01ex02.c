//  Sintese
//  Nome....: "Thales Amaral Lima"
//  Data....: "07/04/2023"
/*	Objetivo: Desenvolva um programa com uma matriz 5x5 onde os usuários informarão os valores para cada posição. Ao final apresente qual diagonal (principal ou secundária) tem a maior soma dos valores ímpares.*/
#include <stdio.h>
#define LIN 5
#define COL 5

void viewTable(int, int, int [][COL]);

int main(){
// Declarações
	int mat[LIN][COL] = {0};
	int l, c;
	int somaPri=0, somaSec=0;
	
// Principal

	//LEITURA -------------------------------------------------------
	for(l=0; l<LIN; l++){
		viewTable(l,c,mat);
		for(c=0; c<COL; c++){
			printf("Linha %d - Coluna %d: ",l+1, c+1);
			scanf("%d",&mat[l][c]);
		}
		printf("\n");
	}

	//VISUALIZAÇÃO MATRIZ -------------------------------------------
	for(l=0; l<LIN; l++){
		for(c=0; c<COL; c++){
			printf("[%d]", mat[l][c]);
		}
		printf("\n");
	}
	
	//DIAGONAL PRINCIPAL --------------------------------------------
	for(l=0; l<LIN; l++){
		if(mat[l][l]%2!=0){
			somaPri += mat[l][l];
		}
	}
	
	//DIAGONAL SECUNDÁRIA -------------------------------------------
	c = COL-1;
	for(l=0; l<LIN; l++){
		if(mat[l][c]%2!=0){
			somaSec += mat[l][c];
		}
		c--;
	}
	
	//RESULTADO -----------------------------------------------------
	printf("\n** SOMA DE IMPARES **");
	printf("\nDiagonal Principal: %d",somaPri);
	printf("\nDiagonal Secundaria: %d\n",somaSec);
	
	if(somaPri > somaSec){
		printf("\nA diagonal principal apresenta soma maior de impares.\n");
	}else if(somaSec > somaPri){
		printf("\nA diagonal secundaria apresenta soma maior de impares.\n");
	}else{
		printf("\nAs duas diagonais apresentam soma equivalentes de impares.\n");
	}

	return 0;
}

//*** VISUALIZAR TABELA *********************************************
void viewTable(int l, int c, int mat[][COL]){
	for(l=0; l<LIN; l++){
		for(c=0; c<COL; c++){
			if(mat[l][c] == 0){
				printf("[ ]");
			}else{
				printf("[%d]",mat[l][c]);
			}
		}
		printf("\n");
	}
	printf("\n");
}
