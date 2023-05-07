//  Sintese
//  Nome....: "Thales Amaral Lima"
//  Data....: "06/05/2023"
/*	Objetivo: Elabore um programa utilizando Structs onde serão informados "nome", "notas"(entre 1 e 10) e turma (A1, B2, C3 ou D4) de até 10 alunos, ao final apresente os nomes dos alunos que obtiveram a maior nota, apresente a turma (ou turmas) dos estudantes que obtiveram a maior nota, apresente também a quantidade de alunos por turma com a maior nota identificada. */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <locale.h> //Idioma
#define TAM 3

int valida_nota(int);
int valida_turma(char);

struct tAluno{
	char nome[50];
	int nota;
	char turma[2];
};

//=== BLOCO PRINCIPAL ===============================================
int main(){
	setlocale(LC_ALL,"Portuguese");
// Declarações
	int i=0;
	struct tAluno aluno[TAM];

// Principal
	//printf("");

	do{
		printf("\n****** Nomes ******\n");
		printf("Nome do aluno %d: ",i+1);
		fflush(stdin);
		setbuf(stdin, 0);
		gets(aluno[i].nome);
		do{
			printf("\n****** Notas ******\n");
			printf("Nota do aluno %d: ",i+1);
			scanf("%d",&aluno[i].nota);
		}while(valida_nota(aluno[i].nota));

		do{
			printf("\n****** Turmas ******\n");
			printf("[A1][B2][C3][D4]\n");
			printf("Turma do aluno %d: ",i+1);
			fflush(stdin);
			gets(aluno[i].turma);
			if((strcmp(aluno[i].turma,"A1")!=0) && (strcmp(aluno[i].turma,"B2")!=0) && (strcmp(aluno[i].turma,"C3")!=0) && (strcmp(aluno[i].turma,"D4")!=0)){
				printf("ERRO: Opcao Invalida!!!\n");
			}
		}while((strcmp(aluno[i].turma,"A1")!=0) && (strcmp(aluno[i].turma,"B2")!=0) && (strcmp(aluno[i].turma,"C3")!=0) && (strcmp(aluno[i].turma,"D4")!=0));
		
		i++;
	}while (i < TAM);
	
	return 0;
}
//=== FIM DO BLOCO ==================================================

//*** Valida tamanho da nota de 1 a 10 ******************************
int valida_nota(int aNota){
	
	if((aNota < 1) || (aNota > 10)){
		printf("ERRO: Fora do limite 1 a 10!!!\n");
		return 1;
	}
	return 0;
}
