/* debug_exercise_111_fixed.c — 修好的版本 */
#include <stdio.h>
#include <string.h>

int main(void)
{
    char name[32];                  /* 错误1：数组太小，且 scanf %s 遇空格停 */
    char greeting[64] = "";         /* 错误2：greeting 装不下"你好，"+ 名字，改 64 */

    printf("你的名字：");
    fgets(name, sizeof(name), stdin);           /* 错误3：改用 fgets 读整行 */
    size_t len = strlen(name);
    if (len > 0 && name[len - 1] == '\n') name[len - 1] = '\0';

    strcpy(greeting, "你好，");
    strcat(greeting, name);

    printf("%s\n", greeting);
    return 0;
}
