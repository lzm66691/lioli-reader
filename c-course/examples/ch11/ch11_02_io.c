/* ch11_02_io.c — scanf 遇空格停 vs fgets 读整行 */
#include <stdio.h>

int main(void)
{
    char a[32], b[32];
    int c;

    printf("输入一行（含空格）：");
    scanf("%s", a);               /* 危险：读到空格就停，且不检查长度 */
    while ((c = getchar()) != '\n' && c != EOF) {}  /* 清掉 scanf 留在缓冲区的回车；EOF 时退出，防重定向死循环 */

    printf("再输入一行：");
    fgets(b, sizeof(b), stdin);   /* 安全：读一整行，最多 31 字符+ \0 */

    printf("scanf 读到: %s\n", a);
    printf("fgets 读到: %s", b);  /* fgets 会保留结尾换行 */
    return 0;
}
