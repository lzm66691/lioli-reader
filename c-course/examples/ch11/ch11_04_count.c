/* ch11_04_count.c — 统计字母个数（\0 是循环的终点）*/
#include <stdio.h>
#include <string.h>

int main(void)
{
    char line[] = "Hello, LZU 2026!";
    int letters = 0;

    for (int i = 0; line[i] != '\0'; i++)
        if ((line[i] >= 'a' && line[i] <= 'z') || (line[i] >= 'A' && line[i] <= 'Z'))
            letters++;

    printf("字母数：%d\n", letters);   /* H e l l o L Z U = 8 */
    return 0;
}
