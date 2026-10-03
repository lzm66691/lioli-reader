/* debug_exercise_111.c — 找 3 处错误 */
#include <stdio.h>
#include <string.h>

int main(void)
{
    char name[8];
    char greeting[8] = "";

    printf("你的名字：");
    scanf("%s", name);              /* ？ */
    strcpy(greeting, "你好，");
    strcat(greeting, name);

    printf("%s\n", greeting);
    return 0;
}
