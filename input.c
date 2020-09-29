#include <stdio.h>

void removeLF(char *buffer) {
	int i = 0;
	while(buffer[i] != 0x0A) {
		++i;
	}
	buffer[i] = 0x0;
}

int main(int argc, char **argv) {
	FILE *fp;
	char buffer[51];
	fp = fopen("instructions.json", "w");
	if(!fp) {
		printf("Error opening file");
		return 1;
	}
	fputc('[', fp);
	printf("Instruction: ");
	fgets(buffer, 50, stdin);
	removeLF(buffer);
getins:
	fputs("[\"", fp);
	fputs(buffer, fp);
	fputs("\",\"", fp);
	printf("Code: ");
	fgets(buffer, 50, stdin);
	removeLF(buffer);
	fputs(buffer, fp);
	fputs("\"]", fp);
	printf("Instruction: ");
	fgets(buffer, 50, stdin);
	removeLF(buffer);
	if(buffer[0] == 'e' && buffer[1] == 'x' && buffer[2] == 'i' && buffer[3] == 't') {
		goto exit;
	}
	fputc(',', fp);
	goto getins;
exit:
	fputc(']', fp);
	fclose(fp);
	return 0;
}
