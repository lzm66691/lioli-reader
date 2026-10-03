/* ch9_p5_blink_ref.c — 练习册答案参考片段（随讲义内联，非独立可编译程序） */
void blink_led(int pin, int times)
{
    printf("pin %d\n", pin);
    for (int i = 0; i < times; i++)
    {
        printf("LED 亮\n");
        printf("LED 灭\n");
    }
}
