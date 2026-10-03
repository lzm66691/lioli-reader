/* ch9_03_swap.c — 为什么 swap 没生效？ */
#include <stdio.h>

void swap(int a, int b)    /* 形参 a、b 是实参的副本 */
{
    int t = a;
    a = b;
    b = t;                 /* 只交换了副本 */
}

int main(void)
{
    int x = 1, y = 2;
    swap(x, y);
    printf("x=%d y=%d\n", x, y);   /* 输出 x=1 y=2，没换！ */
    return 0;
}
