/* ch9_06_fact.c — 递归求阶乘 */
#include <stdio.h>

long fact(int n)
{
    if (n <= 1) return 1;   /* 终止条件：不再往下调 */
    return n * fact(n - 1); /* 自己调用自己，规模缩小 */
}

int main(void)
{
    printf("%ld\n", fact(5));   /* 输出 120 */
    return 0;
}
