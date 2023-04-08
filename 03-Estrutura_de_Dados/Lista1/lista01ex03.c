#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define TAM 100

int main(){
// Declarações
	char nome[TAM]= {"Joaquim Pedro Alves"}, nomeRef[TAM]={"\0"}, iniciais[TAM]={"\0"}, result[TAM*2]={"\0"};
	int i, pos, j=0;
	
// Principal

    //printf("Digite o Nome completo: ");
    //setbuf(stdin, 0);iniciais
    //gets(nome);
    printf("\n\n*** Nome completo(%s)",nome);

    //PROCURA ULTIMO NOME ************************************************
    pos = strlen(nome);
    //printf("\npos = %d\n",pos);

    while (nome[pos] != ' '){
        pos--;
    }

    //ULTIMO NOME FICA MAIUSCULO & O ADICIONA SEPARADO EM nomeRef ********
    pos += 1;
    //printf("\npos = %d\n",pos);

    for(i=pos; i < strlen(nome); i++){
        nome[i] = toupper(nome[i]);
        nomeRef[j] = nome[i];
        j++;
        /*if(i+1 == strlen(nome)){
            nomeRef[j] = '\0';
        }*/
    }
    printf("\n\n*** Ultimo nome(%s)",nomeRef);

    //COLETAR LETRA INICIAL & FORMATAR EM iniciais ************************
    j=0;
    for(i=0; i<=strlen(nome); i++){
		if(i == 0){
            iniciais[j] = ' ';
            j++;
            iniciais[j] = nome[i];
            j++;
            iniciais[j] = '.';            
        }
		else if((nome[i] == ' ') && (i+1 != pos)){
                j++;
                iniciais[j] = ' ';
                j++;
                iniciais[j] = nome[i+1];
                j++;
                iniciais[j] = '.';
            }
            /*else if((nome[i] == ' ') && (i+1 == pos)){
                j++;
                iniciais[j] = '\0';
            }*/
	}

    //CONCATENAÇÃO DE nomRef e iniciais em result ************************
    strcat(result, nomeRef);
    strcat(result, iniciais);
    printf("\n\n*** Resultado(%s)\n\n",result);

    return 0;
}