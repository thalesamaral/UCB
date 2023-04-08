#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define TAM 100

void token(char []);

int main(){
// Declarações
	char nome[TAM]= {"Joaquim Pedro Alves"}, nomeRef[TAM]={"\0"}, iniciais[TAM]={"\0"}, result[TAM]={"\0"};
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

    //EXERCÍCIO 4
    //token(result);
    token("ALVES J. P.");

    return 0;
}

void token(char resultTK[]){
    int i, j=0;
    int tamTK;
    char token[TAM] = {"\0"}, aux[1];

    //TIRANDO ' ' e '.'
    tamTK = strlen(resultTK);
    for(i=0; i<tamTK; i++){
       if((resultTK[i] != ' ') && (resultTK[i] != '.')){
            token[j] = resultTK[i];
            j++;
       }
    }
    printf("\nToken: %s\n",token);

    //INVERTER O TOKEN
    tamTK = strlen(token);
    for(i=0, j=tamTK-1; i<tamTK/2; i++, j--){
		aux[0] = token[i];
		token[i] = token[j];
		token[j] = aux[0];
	}
    printf("\nToken: %s\n",token);

    //MODIFICAR VOGAIS PELO CODIGO ASCII
    
}
