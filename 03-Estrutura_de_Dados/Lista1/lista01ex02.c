#include <stdio.h>
#define LIN 2
#define COL 2

int main(){
// Declara��es	
	
	int mat[LIN][COL] = {0};
	int l, c;
	int somaPri, somaSec=0;
	
// Principal
	
	//printf("");
	//scanf("%",&);

	for(l=0; l<LIN; l++){
		for(c=0; c<COL; c++){
			printf("Linha %d - Coluna %d: ",l+1, c+1);
			scanf("%d",&mat[l][c]);
		}
		printf("\n");
	}
	
	for(l=0; l<LIN; l++){
		for(c=0; c<COL; c++){
			printf("[%d]", mat[l][c]);
		}
		printf("\n");
	}
	
	for(l=0; l<LIN; l++){
		if(mat[l][l]%2!=0){
			somaPri += mat[l][l];
		}
	}
	
	c = COL-1;
	for(l=0; l<LIN; l++){
		if(mat[l][c]%2!=0){
			somaSec += mat[l][c];
		}
		c--;
	}
	
	printf("\nSoma Principal: %d",somaPri);
	printf("\nSoma Secundaria: %d\n",somaSec);
	
	if(somaPri > somaSec){
		printf("\nA diagonal principal apresenta soma maior de impares.\n");
	}else if(somaSec > somaPri){
		printf("\nA diagonal secundaria apresenta soma maior de impares.\n");
	}else{
		printf("\nAs duas diagonais apresentam soma equivalentes de impares.\n");
	}

	return 0;
}
