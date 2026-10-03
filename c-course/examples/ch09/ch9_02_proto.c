/* ch9_02_proto.c — 函数原型先行 */
#include <stdio.h>

int add(int a, int b);     /* 函数原型：只声明签名，不写函数体 */

int main(void)
{
    printf("%d\n", add(3, 5));
    return 0;
}

int add(int a, int b)      /* 函数定义可以放后面 */
{
    return a + b;
}
