/* ch9_04_return.c — 返回值与提前返回 */
#include <stdio.h>

int abs_val(int n)         /* 绝对值 */
{
    if (n < 0) return -n;  /* 提前返回 */
    return n;
}

void report(int n)         /* void：只做事，不交回 */
{
    printf("abs(%d) = %d\n", n, abs_val(n));
}

int main(void)
{
    report(-7);            /* 输出 abs(-7) = 7 */
    report(4);             /* 输出 abs(4) = 4 */
    return 0;
}
