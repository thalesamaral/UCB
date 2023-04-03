#include <stdio.h>
#define LIN 2
#define COL 2

void main(){
// Declarações	
	
	int mat[LIN][COL];
	int l, c;
	
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
	
	
	
}
