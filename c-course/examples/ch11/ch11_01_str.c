/* ch11_01_str.c — 字符串就是 char 数组 */
#include <stdio.h>

int main(void)
{
    char name[] = "hi";          /* 自动变成 {'h','i','\0'}，3 个元素 */
    char word[8] = {'h', 'e', 'y', '\0'};   /* 手动：必须有 \0 结尾 */

    printf("%s | %s\n", name, word);
    printf("name 占 %zu 字节\n", sizeof(name));   /* 输出 3（含 \0）*/
    return 0;
}
