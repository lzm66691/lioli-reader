/* ch11_03_funcs.c — 字符串函数全家桶 */
#include <stdio.h>
#include <string.h>

int main(void)
{
    char a[] = "Li", b[32] = "";

    strcpy(b, a);                       /* 复制：b = "Li" */
    strcat(b, " Ming");                 /* 拼接：b = "Li Ming" */

    printf("%s（长度 %zu）\n", b, strlen(b));
    printf("比较 a 和 \"Li\"：%d\n", strcmp(a, "Li"));   /* 0=相等 */
    return 0;
}
