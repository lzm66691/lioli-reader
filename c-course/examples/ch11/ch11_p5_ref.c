/* ch11_p5_ref.c — 练习册答案参考片段（随讲义内联，非独立可编译程序） */
char line[32];
fgets(line, sizeof(line), stdin);
size_t len = strlen(line);
if (len > 0 && line[len-1] == '\n') line[len-1] = '\0';
if (strcmp(line, "AT+OK") == 0) printf("设备就绪\n");
else printf("指令异常\n");
