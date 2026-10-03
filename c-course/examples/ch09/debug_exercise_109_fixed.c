/* debug_exercise_109_fixed.c — 修好的版本 */
#include <stdio.h>

double average(int a, int b, int c);

int main(void)
{
    int x = 7, y = 9, z = 4;
    printf("avg = %.2f\n", average(x, y, z));
    return 0;
}

double average(int a, int b, int c)
{
    double sum = a + b + c;      /* 错误1：sum 要是 double，否则整数除法丢小数 */
    return sum / 3.0;            /* 错误2：除 3.0 而不是 3，触发浮点除法 */
}                                /* 错误3：main 里 %f 与 double 匹配，但补了 %.2f 更规范 */
