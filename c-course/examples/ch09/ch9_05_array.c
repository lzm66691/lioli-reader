/* ch9_05_array.c — 数组求和函数（Ch10 会用到同款写法）*/
#include <stdio.h>

int sum_array(const int arr[], int n)   /* const：承诺不修改数组内容 */
{
    int s = 0;
    for (int i = 0; i < n; i++)
        s += arr[i];
    return s;
}

int main(void)
{
    int a[] = {2, 4, 6, 8};
    printf("%d\n", sum_array(a, 4));    /* 输出 20 */
    return 0;
}
