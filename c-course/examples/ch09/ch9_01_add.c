/* ch9_01_add.c — 最简单的函数：两数相加 */
#include <stdio.h>

int add(int a, int b)      /* 返回类型 int；参数 a、b 都是 int */
{
    return a + b;          /* return 把结果交回给调用者 */
}

int main(void)
{
    int r = add(3, 5);     /* 调用：实参 3 和 5 传给形参 a 和 b */
    printf("%d\n", r);     /* 输出 8 */
    return 0;
}
