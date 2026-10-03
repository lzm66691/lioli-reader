/* ch11_p3_ref.c — 练习册答案参考片段（随讲义内联，非独立可编译程序） */
char s[100];
fgets(s, sizeof(s), stdin);
size_t len = strlen(s);
if (len > 0 && s[len-1] == '\n') s[len-1] = '\0';
printf("长度：%zu\n", strlen(s));
