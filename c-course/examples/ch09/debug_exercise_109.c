/* debug_exercise_109.c — 找 3 处错误 */
#include <stdio.h>

double average(int a, int b, int c);

int main(void)
{
    int x = 7, y = 9, z = 4;
    printf("avg = %f\n", average(x, y, z));
    return 0;
}

double average(int a, int b, int c)
{
    int sum = a + b + c;
    return sum / 3;
}
