/* ============================================================
 * c-practice.js · 莉萝阅读器「C 语言练习」扩展面板  [v55]
 * ------------------------------------------------------------
 * 功能：在阅读器内嵌一个 C 练习面板 —— 从题库选题 →
 *       代码编辑器（语法高亮）→ 浏览器内 WASM 编译运行（Clang）→
 *       看输出/报错，支持 scanf 输入、按题保存、显示参考答案。
 * 编译引擎：@live-codes/clang-wasm（Clang 22 → WASM，离线可 vendored）
 * 题库来源：c-course 各章「练习册」中的自写原创可运行题（改错/编程/专业）
 * 调用方式：阅读器工具箱加一项 data-act="cpractice"，点击调 initCPractice()
 * 数据存储：localStorage 键 reader-app-cpractice:{questionId}（按题存代码）
 * 版本约定：随阅读器版本号一起 bump（见 sw.js 缓存键）
 * ============================================================ */
(function () {
  "use strict";

  /* ---------------- 题库（自写原创变式题，取自各章练习册） ---------------- */
  const QUESTIONS = [
    /* ===== Ch1 初识C语言与程序框架 ===== */
    {
      id: "ch1-q4", ch: "1", type: "debug", level: "★",
      title: "改错：找 3 处错误（漏分号/漏逗号/未初始化）",
      desc: "下面程序有 3 处错误，先自己找，再对照答案：<br><b>① 漏分号；② 字符串与参数之间漏逗号；③ 变量声明后未初始化就用。</b>",
      starter:
`#include <stdio.h>

int main(void)
{
    int age
    printf("我 %d 岁\n" age);
    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    int age = 19;
    printf("我 %d 岁\n", age);
    return 0;
}`,
      refOut: "我 19 岁",
      hint: "漏分号/漏逗号是语法错误（error，编译失败）；未初始化是警告（warning，编译能过但结果不确定）。先修硬错误，再查警告。"
    },
    {
      id: "ch1-q5", ch: "1", type: "program", level: "★",
      title: "编程：打印自我介绍",
      desc: "用三个变量（年龄、身高、姓名）打印一行自我介绍。示例输出：",
      sampleOut: "我 19 岁，身高 175，姓名 F-VIS",
      starter:
`#include <stdio.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    int    age    = 19;
    double height = 175.0;
    char   name[] = "F-VIS";

    printf("我 %d 岁，身高 %g，姓名 %s\n", age, height, name);
    return 0;
}`,
      refOut: "我 19 岁，身高 175，姓名 F-VIS",
      hint: "小数用 double + %g（自动去尾零）；给 double 用 %d 会输出乱码。"
    },
    {
      id: "ch1-q6", ch: "1", type: "program", level: "★",
      title: "编程：两数求和",
      desc: "定义两个整数 a=17、b=25，计算并打印 a+b 的和。示例输出：",
      sampleOut: "17 + 25 = 42",
      starter:
`#include <stdio.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    int a = 17;
    int b = 25;
    printf("%d + %d = %d\n", a, b, a + b);
    return 0;
}`,
      refOut: "17 + 25 = 42",
      hint: "计算可直接写在 printf 参数里；三个 %d 要对应三个参数。"
    },
    {
      id: "ch1-q7", ch: "1", type: "pro", level: "★",
      title: "专业：模拟点亮一组 LED",
      desc: "用循环从 1 数到 8，每行打印 LED_1=ON 到 LED_8=ON。提示：只需要一个循环和一个 printf。",
      starter:
`#include <stdio.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    int i;
    for (i = 1; i <= 8; i++) {
        printf("LED_%d=ON\n", i);
    }
    return 0;
}`,
      refOut: "LED_1=ON\nLED_2=ON\nLED_3=ON\nLED_4=ON\nLED_5=ON\nLED_6=ON\nLED_7=ON\nLED_8=ON",
      hint: "for 循环 + %d 把编号变起来。这是模拟硬件行为的第一课。"
    },

    /* ===== Ch3 数据和C ===== */
    {
      id: "ch3-q4", ch: "3", type: "debug", level: "★",
      title: "改错：int 存小数被静默截断",
      desc: "下面程序想打印“我的身高 1.75 米”，但输出不对。找 2 处问题 + 1 条格式建议：<br><b>① 用 int 存小数（1.75 被截断成 1）；② %f 配 int；③ 想打 1.75 用 %.2f。</b>",
      starter:
`#include <stdio.h>

int main(void)
{
    int height = 1.75;
    printf("我的身高 %f 米\n", height);
    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    double height = 1.75;
    printf("我的身高 %.2f 米\n", height);
    return 0;
}`,
      refOut: "我的身高 1.75 米",
      hint: "int 存小数的“静默截断”编译器默认发现不了（error/仅警告/静默三类里最难防的一类）；%f 默认打 6 位小数，用 %.2f 精确到 2 位。"
    },
    {
      id: "ch3-q5", ch: "3", type: "program", level: "★",
      title: "编程：计算圆面积",
      desc: "定义 double 变量 r=5.5，用 const double PI=3.14159，打印圆面积（公式 PI*r*r）。示例输出：",
      sampleOut: "r = 5.5, 圆面积 = 95.033097",
      starter:
`#include <stdio.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    const double PI = 3.14159;
    double r = 5.5;
    printf("r = %g, 圆面积 = %f\n", r, PI * r * r);
    return 0;
}`,
      refOut: "r = 5.5, 圆面积 = 95.033097",
      hint: "const 防止手滑改 PI；给 PI 用 %d 会乱码。"
    },
    {
      id: "ch3-q6", ch: "3", type: "program", level: "★★",
      title: "编程：读入身高体重算 BMI（scanf）",
      desc: "定义两个 double，从键盘读入身高和体重，打印 BMI（体重 / (身高米)^2）。示例交互：",
      sampleIn: "1.75 70",
      sampleOut: "输入身高(米)和体重(kg)：BMI = 22.86",
      starter:
`#include <stdio.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    double h, w;
    printf("输入身高(米)和体重(kg)：");
    scanf("%lf %lf", &h, &w);
    printf("BMI = %.2f\n", w / (h * h));
    return 0;
}`,
      refOut: "输入身高(米)和体重(kg)：BMI = 22.86",
      hint: "一次 scanf 读两个值，中间空格分隔；用 %f 读 double 会乱码（double 要用 %lf）。"
    },
    {
      id: "ch3-q7", ch: "3", type: "pro", level: "★★",
      title: "专业：ADC 电压换算（整数除法坑）",
      desc: "定义 adc=2048（0~4095），换算电压 = adc / 4095.0 * 3.3，打印电压（保留 2 位）。注意整数除法陷阱。",
      starter:
`#include <stdio.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    unsigned int adc = 2048;
    double volt = adc / 4095.0 * 3.3;
    printf("ADC=%u, 电压 = %.2f V\n", adc, volt);
    return 0;
}`,
      refOut: "ADC=2048, 电压 = 1.65 V",
      hint: "除以 4095.0（带 .0）强制浮点运算，否则 adc/4095 是整数除法得 0 —— 嵌入式最经典的整数除法坑。"
    },

    /* ===== Ch5 运算符、表达式与语句 ===== */
    {
      id: "ch5-q4", ch: "5", type: "debug", level: "★",
      title: "改错：2 处编译错误 + 1 处输出不对",
      desc: "下面程序有 3 处问题：2 处编译错误 + 1 处“输出不对”。先自己找，再对照答案。",
      starter:
`#include <stdio.h>

int main(void)
{
    int num = 7;
    double half = num / 2;       /* 想得到 3.5 */
    printf("7 / 2 = %f\n", half)
    num = num + 1
    printf("num = %d\n", num);
    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    int num = 7;
    double half = num / 2.0;     /* 整数除法 → 浮点除法 */
    printf("7 / 2 = %f\n", half);
    num = num + 1;
    printf("num = %d\n", num);
    return 0;
}`,
      refOut: "7 / 2 = 3.500000\nnum = 8",
      hint: "先修编译错误（两处漏分号），再找逻辑错误（num/2 整数除法，要写成 num/2.0）。修完能编译 ≠ 程序算对了。"
    },
    {
      id: "ch5-q5", ch: "5", type: "program", level: "★",
      title: "编程：三门课平均分",
      desc: "三门课成绩 C=82.5、Math=91、Eng=78，打印平均分（保留 1 位）。示例输出：",
      sampleOut: "平均分 = 83.8",
      starter:
`#include <stdio.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    double c = 82.5, math = 91, eng = 78;
    double avg = (c + math + eng) / 3.0;
    printf("平均分 = %.1f\n", avg);
    return 0;
}`,
      refOut: "平均分 = 83.8",
      hint: "除以 3.0（带 .0）保小数；写 / 3 会整数除法把 251.5/3 截断成 83。"
    },
    {
      id: "ch5-q6", ch: "5", type: "program", level: "★",
      title: "编程：秒数换算成时分秒",
      desc: "把 3661 秒换算成“x 小时 y 分 z 秒”打印（用 / 和 %）。示例输出：",
      sampleOut: "3661 秒 = 1 小时 1 分 1 秒",
      starter:
`#include <stdio.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    int total = 3661;
    int h = total / 3600;
    int m = (total % 3600) / 60;
    int s = total % 60;
    printf("%d 秒 = %d 小时 %d 分 %d 秒\n", total, h, m, s);
    return 0;
}`,
      refOut: "3661 秒 = 1 小时 1 分 1 秒",
      hint: "三步拆：÷3600 得小时；余数再 ÷60 得分钟；最后余数即秒。别把分钟写成 total % 60。"
    },
    {
      id: "ch5-q7", ch: "5", type: "pro", level: "★★",
      title: "专业：电阻分压公式",
      desc: "电路分压公式 Vout = Vin × R2 / (R1 + R2)。写程序：Vin=5.0、R1=1000、R2=2000（Ω），打印 Vout（保留 2 位）。提示：先算 R2/(R1+R2) 会得 0。示例输出：",
      sampleOut: "Vout = 3.33 V",
      starter:
`#include <stdio.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    double vin = 5.0;
    int r1 = 1000, r2 = 2000;
    double vout = vin * r2 / (r1 + r2);
    printf("Vout = %.2f V\n", vout);
    return 0;
}`,
      refOut: "Vout = 3.33 V",
      hint: "让 vin * r2 先算（int 变 double）再除，避免 r2/(r1+r2) 先做整数除法得 0。"
    },

    /* ===== Ch6 循环 ===== */
    {
      id: "ch6-q4", ch: "6", type: "debug", level: "★★",
      title: "改错：while 多分号死循环",
      desc: "下面程序想打印 1 2 3 4 5 然后 “done”，但有 2 处问题。先自己找，再对照答案。",
      starter:
`#include <stdio.h>

int main(void)
{
    int n = 0;
    while (n < 5); {
        printf("%d ", n);
        n++;
    }
    printf("done\n");
    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    int n = 1;
    while (n <= 5) {
        printf("%d ", n);
        n++;
    }
    printf("done\n");
    return 0;
}`,
      refOut: "1 2 3 4 5 done",
      hint: "while 后多一个分号，循环体变成空语句，运行时会死循环卡死（编译期往往只有 warning）；n 从 0 开始会打 0..4。"
    },
    {
      id: "ch6-q5", ch: "6", type: "program", level: "★",
      title: "编程：1+2+…+100",
      desc: "用 for 计算 1+2+...+100 并打印。示例输出：",
      sampleOut: "1+2+...+100 = 5050",
      starter:
`#include <stdio.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    int sum = 0;
    for (int i = 1; i <= 100; i++) {
        sum += i;
    }
    printf("1+2+...+100 = %d\n", sum);
    return 0;
}`,
      refOut: "1+2+...+100 = 5050",
      hint: "i <= 100（不是 < 100，否则少加 100）；sum 先初始化成 0。"
    },
    {
      id: "ch6-q6", ch: "6", type: "program", level: "★★",
      title: "编程：打印 2 的 1..5 次幂",
      desc: "用循环打印 2 的 1..5 次幂。提示：每次乘 2。示例输出：",
      sampleOut: "2^1 = 2\n2^2 = 4\n2^3 = 8\n2^4 = 16\n2^5 = 32",
      starter:
`#include <stdio.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    int p = 1;
    for (int i = 1; i <= 5; i++) {
        p *= 2;
        printf("2^%d = %d\n", i, p);
    }
    return 0;
}`,
      refOut: "2^1 = 2\n2^2 = 4\n2^3 = 8\n2^4 = 16\n2^5 = 32",
      hint: "p 每轮乘 2 就是 2 的幂；别写成 p = 2 * i（那是 2i）。"
    },
    {
      id: "ch6-q7", ch: "6", type: "pro", level: "★★",
      title: "专业：循环读成绩求平均",
      desc: "用 while 循环反复读入考试成绩（整数），输入 0 结束，打印一共几门、平均分（保留 1 位）。scanf 写法：scanf(\"%d\", &score)。示例交互：",
      sampleIn: "85 90 0",
      sampleOut: "输入成绩（0 结束）：共 2 门，平均 = 87.5",
      starter:
`#include <stdio.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    int score, count = 0;
    double sum = 0.0;
    printf("输入成绩（0 结束）：");
    while (scanf("%d", &score) == 1 && score != 0) {
        sum += score;
        count++;
    }
    if (count > 0)
        printf("共 %d 门，平均 = %.1f\n", count, sum / count);
    else
        printf("没有输入成绩\n");
    return 0;
}`,
      refOut: "输入成绩（0 结束）：共 2 门，平均 = 87.5",
      hint: "条件里 scanf==1 检查“读到了数字”（防乱输入），score!=0 是终止信号；别把 0 算进成绩。"
    },

    /* ===== Ch7 分支和跳转 ===== */
    {
      id: "ch7-q4", ch: "7", type: "debug", level: "★★",
      title: "改错：赋值当判断（同行的两层错）",
      desc: "下面程序想对 85 分输出“良好”，但有 2 处问题（同一行上的两层错）。先自己找，再对照答案。",
      starter:
`#include <stdio.h>

int main(void)
{
    int score = 85;
    if (score >= 90)
        printf("优秀\n");
    else if (score = 80)          /* 想表示 80 分及以上得“良好” */
        printf("良好\n");
    else
        printf("加油\n");
    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    int score = 85;
    if (score >= 90)
        printf("优秀\n");
    else if (score >= 80)
        printf("良好\n");
    else
        printf("加油\n");
    return 0;
}`,
      refOut: "良好",
      hint: "score = 80 是赋值不是判断（恒为真，怎么都走“良好”）；即使改成 == 也只能匹配精确 80，范围判断要用 >=。一步写成 score >= 80 同时解决两层错。"
    },
    {
      id: "ch7-q5", ch: "7", type: "program", level: "★★",
      title: "编程：分数等级",
      desc: "输入一个 0-100 的分数，按 90优秀 / 80良好 / 70中等 / 60及格 / 其余不及格 输出等级。示例交互：",
      sampleIn: "72",
      sampleOut: "输入分数：中等",
      starter:
`#include <stdio.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    int score = 72;
    if (score >= 90)      printf("优秀\n");
    else if (score >= 80) printf("良好\n");
    else if (score >= 70) printf("中等\n");
    else if (score >= 60) printf("及格\n");
    else                  printf("不及格\n");
    return 0;
}`,
      refOut: "中等",
      hint: "从高到低排（90→80→70→60），第一个满足的生效；从低到高排会把 72 先判成及格。"
    },
    {
      id: "ch7-q6", ch: "7", type: "program", level: "★★★",
      title: "编程：switch 简单计算器",
      desc: "用 switch 做简单计算器——读入“数字 运算符 数字”（如 3 + 5），按 + - * / 输出结果，其他运算符提示“不支持的运算符”。示例交互：",
      sampleIn: "3 + 5",
      sampleOut: "输入 数字 运算符 数字（如 3 + 5）：3.0 + 5.0 = 8.0",
      starter:
`#include <stdio.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    double a, b;
    char op;
    printf("输入 数字 运算符 数字（如 3 + 5）：");
    scanf("%lf %c %lf", &a, &op, &b);
    switch (op) {
        case '+': printf("%.1f %c %.1f = %.1f\n", a, op, b, a + b); break;
        case '-': printf("%.1f %c %.1f = %.1f\n", a, op, b, a - b); break;
        case '*': printf("%.1f %c %.1f = %.1f\n", a, op, b, a * b); break;
        case '/': printf("%.1f %c %.1f = %.1f\n", a, op, b, a / b); break;
        default:  printf("不支持的运算符\n");
    }
    return 0;
}`,
      refOut: "输入 数字 运算符 数字（如 3 + 5）：3.0 + 5.0 = 8.0",
      hint: "switch 按字符分流；case 后忘 break 会掉穿（落到下一个 case）。"
    },
    {
      id: "ch7-q7", ch: "7", type: "pro", level: "★★",
      title: "专业：统计元音字母（getchar）",
      desc: "用 getchar + 循环读入一行英文（读到换行结束），统计并打印元音字母（a/e/i/o/u 大小写都算）的个数。示例交互：",
      sampleIn: "hello world",
      sampleOut: "输入一行英文：元音共 3 个",
      starter:
`#include <stdio.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    char ch;
    int count = 0;
    printf("输入一行英文：");
    while ((ch = getchar()) != '\n' && ch != EOF) {
        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u' ||
            ch == 'A' || ch == 'E' || ch == 'I' || ch == 'O' || ch == 'U')
            count++;
    }
    printf("元音共 %d 个\n", count);
    return 0;
}`,
      refOut: "输入一行英文：元音共 3 个",
      hint: "循环读字符直到换行；别忘大小写（只查小写会漏 'E'）。"
    },

    /* ===== Ch10 数组和指针 ===== */
    {
      id: "ch10-q2", ch: "10", type: "debug", level: "★★",
      title: "改错：数组/指针 4 处问题",
      desc: "下面程序有 4 处问题，找出并改正，分类为「编译期报错 / 仅警告 / 静默逻辑错」：<br><b>① 野指针解引用；② %d 打地址；③ 下标越界；④ 整数赋给指针。</b>",
      starter:
`#include <stdio.h>

int main(void)
{
    int a[3] = {1, 2, 3};
    int *p;              /* ① */
    *p = 10;
    printf("地址 %d\n", &a[0]);   /* ② */
    printf("a[3] = %d\n", a[3]);  /* ③ */
    int *q = 100;        /* ④ */
    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    int a[3] = {1, 2, 3};
    int *p = &a[0];              /* ① 先指向数组再解引用 */
    *p = 10;
    printf("地址 %p\n", (void*)&a[0]);  /* ② 地址要用 %p */
    int i;
    for (i = 0; i < 3; i++)      /* ③ 边界 i<3，不读 a[3] */
        printf("a[%d]=%d\n", i, a[i]);
    int *q = &a[0];              /* ④ 指向数组，不是赋 100 */
    return 0;
}`,
      refOut: "",
      hint: "野指针/格式串类型不匹配/下标越界/整数赋给指针。越界任何时候都不报，只能靠自己边界意识；不能靠“有没有警告”判断野指针。"
    },
    {
      id: "ch10-q3", ch: "10", type: "program", level: "★★",
      title: "编程：数组最大值与平均值",
      desc: "读入 5 个整数存进数组，输出最大值和平均值（保留 1 位小数）。示例交互：",
      sampleIn: "3 8 1 9 4",
      sampleOut: "请输入 5 个整数：最大值 = 9  平均值 = 5.0",
      starter:
`#include <stdio.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void){
    int a[5], i, max, sum = 0;
    printf("请输入 5 个整数：");
    for (i = 0; i < 5; i++) scanf("%d", &a[i]);
    max = a[0];
    for (i = 1; i < 5; i++) if (a[i] > max) max = a[i];
    for (i = 0; i < 5; i++) sum += a[i];
    printf("最大值 = %d  平均值 = %.1f\n", max, sum / 5.0);
    return 0;
}`,
      refOut: "请输入 5 个整数：最大值 = 9  平均值 = 5.0",
      hint: "max 初始为 a[0]（不是 0，数组可能全负）；sum/5 整数除法丢小数，要 5.0；下标 < 5 别越界。"
    },
    {
      id: "ch10-q4", ch: "10", type: "program", level: "★★★",
      title: "编程：指针逆序遍历数组",
      desc: "用指针遍历数组（不许用下标），把数组 {4, 2, 9, 7, 1} 逆序打印。要求至少用到 p++ 和 *p（本题用 p--）。示例输出：",
      sampleOut: "1 7 9 2 4",
      starter:
`#include <stdio.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void){
    int a[5] = {4, 2, 9, 7, 1};
    int *p;
    for (p = a + 4; p >= a; p--)
        printf("%d ", *p);
    printf("\n");
    return 0;
}`,
      refOut: "1 7 9 2 4",
      hint: "指针从末尾 a+4 往前挪（p--）到数组开头；指针比较 p>=a 同一数组内允许。"
    },
    {
      id: "ch10-q5", ch: "10", type: "program", level: "★★★",
      title: "编程：函数修改数组（传地址）",
      desc: "定义函数 void fill(int arr[], int n, int v)，把数组全部元素设成 v，然后在 main 里声明 int a[6] 调用它填成 7 并打印。验证函数里改动确实影响外面。",
      starter:
`#include <stdio.h>

/* 在这里写 fill 函数 */

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>

void fill(int arr[], int n, int v){
    int i;
    for (i = 0; i < n; i++) arr[i] = v;
}

int main(void){
    int a[6], i;
    fill(a, 6, 7);
    for (i = 0; i < 6; i++) printf("%d ", a[i]);
    printf("\n");
    return 0;
}`,
      refOut: "7 7 7 7 7 7",
      hint: "形参数组 arr[] 传的是地址，arr[i]=v 直接改外面；破除“形参是副本改不动外面”的误解。"
    },
    {
      id: "ch10-q6", ch: "10", type: "pro", level: "★★★",
      title: "专业：找 ADC 采样最大值下标",
      desc: "用数组存 10 个采样值（自定数据），找最大值对应的下标并输出「第 N 次采样最大」。示例输出：",
      sampleOut: "采样：512 780 333 910 456 820 999 120 650 780\n第 7 次采样最大 = 999",
      starter:
`#include <stdio.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void){
    int s[10] = {512, 780, 333, 910, 456, 820, 999, 120, 650, 780};
    int i, idx = 0;
    for (i = 1; i < 10; i++)
        if (s[i] > s[idx]) idx = i;
    printf("第 %d 次采样最大 = %d\n", idx + 1, s[idx]);
    return 0;
}`,
      refOut: "第 7 次采样最大 = 999",
      hint: "记录“当前最大值的下标”，遇到更大的更新；输出 idx+1（人类数第 1 次是下标 0）。"
    },

    /* ===== Ch12 存储类与动态内存 ===== */
    {
      id: "ch12-q2", ch: "12", type: "debug", level: "★★",
      title: "改错：static/malloc 4 处问题",
      desc: "下面程序有 4 处问题，找出并改正，分类为「编译期报错 / 仅警告 / 静默逻辑错」：<br><b>① static 初始化非编译期常量；② malloc 忘 sizeof；③ 申请了不用；④ 申请了不 free。</b>",
      starter:
`#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int n = 5, i;
    static int x = n;             /* ① */
    int *arr = malloc(n);         /* ② */
    int *p = malloc(10 * sizeof(int));  /* ③ */
    for (i = 0; i < n; i++) arr[i] = i * 2;
    for (i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("x=%d\n", x);
    return 0;                     /* ④ */
}`,
      ref:
`#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int n = 5, i;
    static int x = 0;             /* ① 用编译期常量 */
    int *arr = malloc(n * sizeof(int));  /* ② 乘 sizeof 并检查 NULL */
    if (arr == NULL) return 1;
    for (i = 0; i < n; i++) arr[i] = i * 2;
    for (i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("x=%d\n", x);
    free(arr);                    /* ④ malloc/free 配对 */
    return 0;
}`,
      refOut: "0 2 4 6 8 x=0",
      hint: "static 初始化必须是编译期常量；malloc(n) 只分到 n 字节却当 n 个 int 用会堆写越界；malloc/free 要成对（漏了会泄漏到 OOM）。"
    },
    {
      id: "ch12-q3", ch: "12", type: "program", level: "★★",
      title: "编程：static 计数器",
      desc: "定义函数 int next_frame(void)，用 static 计数器从 1 开始递增，返回帧号。main 里连续调用 5 次并打印。示例输出：",
      sampleOut: "帧号:1 帧号:2 帧号:3 帧号:4 帧号:5",
      starter:
`#include <stdio.h>

/* 在这里写 next_frame 函数 */

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>

int next_frame(void){
    static int n = 0;
    n++;
    return n;
}

int main(void){
    int i;
    for (i = 0; i < 5; i++) printf("帧号:%d ", next_frame());
    printf("\n");
    return 0;
}`,
      refOut: "帧号:1 帧号:2 帧号:3 帧号:4 帧号:5",
      hint: "static 局部变量活得久，每次调用 +1；忘了 static 会每次重置（输出全 1）。"
    },
    {
      id: "ch12-q4", ch: "12", type: "program", level: "★★★",
      title: "编程：malloc 动态数组求均值最大",
      desc: "先读入 n，用 malloc 申请 n 个 int，读入 n 个数，打印平均值（1 位小数）和最大值，最后 free。示例交互：",
      sampleIn: "5\n1 2 3 4 5",
      sampleOut: "n=? 5 个数：平均 = 3.0  最大 = 5",
      starter:
`#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>
#include <stdlib.h>

int main(void){
    int n, i, *a, max, sum = 0;
    printf("n=? ");
    scanf("%d", &n);
    a = malloc(n * sizeof(int));
    if (a == NULL) return 1;
    printf("%d 个数：", n);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    max = a[0];
    for (i = 0; i < n; i++){ sum += a[i]; if (a[i] > max) max = a[i]; }
    printf("平均 = %.1f  最大 = %d\n", sum / (double)n, max);
    free(a);
    return 0;
}`,
      refOut: "n=? 5 个数：平均 = 3.0  最大 = 5",
      hint: "malloc(n * sizeof(int)) 并检查 NULL；sum/n 整数除法要 (double)n；最后 free。"
    },
    {
      id: "ch12-q5", ch: "12", type: "pro", level: "★★★",
      title: "专业：malloc 分配串口缓冲区",
      desc: "读入要缓存多少字节 n，用 malloc 申请 n 字节，把字符 'A' 填满并打印前 3 个，最后 free。示例交互：",
      sampleIn: "10",
      sampleOut: "缓存大小 n=? 缓冲前 3 字节：A A A",
      starter:
`#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>
#include <stdlib.h>

int main(void){
    int n, i;
    char *buf;
    printf("缓存大小 n=? ");
    scanf("%d", &n);
    buf = malloc(n);
    if (buf == NULL) return 1;
    for (i = 0; i < n; i++) buf[i] = 'A';
    printf("缓冲前 %d 字节：", n < 3 ? n : 3);   /* 护栏：n<3 只打印 n 个 */
    for (i = 0; i < 3 && i < n; i++) printf("%c ", buf[i]);
    printf("\n");
    free(buf);
    return 0;
}`,
      refOut: "缓存大小 n=? 缓冲前 3 字节：A A A",
      hint: "malloc(n) 字节后循环填 'A'，打印前 3 个加护栏（n<3 时不越界），最后 free；malloc 后检查 NULL。"
    },
    /* ===== Ch4 输入输出（v67c 补全） ===== */
    {
      id: "ch4-q4", ch: "4", type: "debug", level: "★",
      title: "改错：scanf 的 3 个雷",
      desc: "下面程序读入年龄和身高有 2 处错：<br><b>① scanf 漏 &；② 输出缺 %.2f 位数控制（%f 会打出 6 位小数）。</b>",
      starter:
`#include <stdio.h>

int main(void)
{
    int age;
    float h;
    printf("年龄身高：");
    scanf("%d %f", age, h);
    printf("我 %d 岁 %f 米\n", age, h);
    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    int age;
    float h;
    printf("年龄身高：");
    scanf("%d %f", &age, &h);
    printf("我 %d 岁 %.2f 米\n", age, h);
    return 0;
}`,
      refOut: "年龄身高：19 1.87\n我 19 岁 1.87 米",
      hint: "scanf 必须传地址（&变量）；float 用 %f 读；%.2f 控制两位小数。"
    },
    {
      id: "ch4-q5", ch: "4", type: "program", level: "★",
      title: "编程：两数平均值",
      desc: "读入两个整数，输出它们的平均值（保留 1 位小数）。示例交互：",
      sampleIn: "3 4",
      sampleOut: "平均 = 3.5",
      starter:
`#include <stdio.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    int a, b;
    scanf("%d %d", &a, &b);
    printf("平均 = %.1f\n", (a + b) / 2.0);
    return 0;
}`,
      refOut: "平均 = 3.5",
      hint: "整数除法坑：(a+b)/2 是整数除法；除以 2.0 才得到小数。"
    },
    {
      id: "ch4-q6", ch: "4", type: "program", level: "★★",
      title: "编程：华氏温度转摄氏",
      desc: "读入华氏温度 F，按公式 C = (F-32)×5/9 输出摄氏温度（保留 2 位小数）。",
      sampleIn: "100",
      sampleOut: "100.00 华氏 = 37.78 摄氏",
      starter:
`#include <stdio.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    float f;
    scanf("%f", &f);
    printf("%.2f 华氏 = %.2f 摄氏\n", f, (f - 32) * 5.0 / 9);
    return 0;
}`,
      refOut: "100.00 华氏 = 37.78 摄氏",
      hint: "公式里 5/9 是整数除法得 0！写成 5.0/9 或先乘后除。"
    },
    {
      id: "ch4-q7", ch: "4", type: "pro", level: "★★",
      title: "专业：格式化成绩表",
      desc: "读入学号和三门成绩，按固定宽度打印成绩表（学号 10 宽右对齐、成绩 6 宽保留 1 位小数）。",
      sampleIn: "2026001 85 90 78",
      sampleOut: "学号      成绩1  成绩2  成绩3\n   2026001   85.0   90.0   78.0",
      starter:
`#include <stdio.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>

int main(void)
{
    long id;
    float a, b, c;
    scanf("%ld %f %f %f", &id, &a, &b, &c);
    printf("学号      成绩1  成绩2  成绩3\n");
    printf("%10ld %6.1f %6.1f %6.1f\n", id, a, b, c);
    return 0;
}`,
      refOut: "学号      成绩1  成绩2  成绩3\n   2026001   85.0   90.0   78.0",
      hint: "%10ld 右对齐占 10 宽，%6.1f 占 6 宽保留 1 位小数。"
    },
    /* ===== Ch9 函数（v67c 补全） ===== */
    {
      id: "ch9-q4", ch: "9", type: "debug", level: "★",
      title: "改错：函数使用三处错",
      desc: "下面程序调用 max 函数有 3 处错：<br><b>① 函数未声明先使用；② 调用传参类型不匹配；③ 函数没有 return。</b>",
      starter:
`#include <stdio.h>

int main(void)
{
    int a = 3, b = 7;
    printf("较大 = %d\n", max(a, 2.5));
    return 0;
}

int max(int x, int y)
{
    int m = x;
    if (y > m) m = y;
}`,
      ref:
`#include <stdio.h>

int max(int x, int y);

int main(void)
{
    int a = 3, b = 7;
    printf("较大 = %d\n", max(a, b));
    return 0;
}

int max(int x, int y)
{
    int m = x;
    if (y > m) m = y;
    return m;
}`,
      refOut: "较大 = 7",
      hint: "先用原型声明再调用；类型要对（2.5 是 double 不是 int）；函数要 return 结果。"
    },
    {
      id: "ch9-q5", ch: "9", type: "program", level: "★",
      title: "编程：函数求两数较大值",
      desc: "写一个 max2(a, b) 函数返回较大值，main 读入两个整数调用它并输出。",
      sampleIn: "5 9",
      sampleOut: "较大 = 9",
      starter:
`#include <stdio.h>

int max2(int x, int y);

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}

int max2(int x, int y)
{
    /* 在这里写你的代码 */
}`,
      ref:
`#include <stdio.h>

int max2(int x, int y);

int main(void)
{
    int a, b;
    scanf("%d %d", &a, &b);
    printf("较大 = %d\n", max2(a, b));
    return 0;
}

int max2(int x, int y)
{
    return x > y ? x : y;
}`,
      refOut: "较大 = 9",
      hint: "函数职责单一：只算不打印；main 里负责输入输出。"
    },
    {
      id: "ch9-q6", ch: "9", type: "program", level: "★★",
      title: "编程：递归求阶乘",
      desc: "写递归函数 fact(n) 求 n!（n≤12），main 读入 n 调用输出。基线条件 n≤1 时返回 1。",
      sampleIn: "5",
      sampleOut: "5! = 120",
      starter:
`#include <stdio.h>

long fact(int n);

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}

long fact(int n)
{
    /* 在这里写你的代码 */
}`,
      ref:
`#include <stdio.h>

long fact(int n);

int main(void)
{
    int n;
    scanf("%d", &n);
    printf("%d! = %ld\n", n, fact(n));
    return 0;
}

long fact(int n)
{
    if (n <= 1) return 1;
    return n * fact(n - 1);
}`,
      refOut: "5! = 120",
      hint: "递归两要素：基线条件（n≤1）+ 递归步（n × fact(n-1)）；n≤12 防溢出。"
    },
    {
      id: "ch9-q7", ch: "9", type: "pro", level: "★★★",
      title: "专业：函数求数组最大值",
      desc: "写函数 arrMax(int a[], int n) 返回数组最大值。注意：数组参数退化指针，必须同时传长度 n。main 读 n 和 n 个数调用。",
      sampleIn: "5\n3 9 2 7 5",
      sampleOut: "最大值 = 9",
      starter:
`#include <stdio.h>

int arrMax(int a[], int n);

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}

int arrMax(int a[], int n)
{
    /* 在这里写你的代码 */
}`,
      ref:
`#include <stdio.h>

int arrMax(int a[], int n);

int main(void)
{
    int n, i, a[100];
    scanf("%d", &n);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    printf("最大值 = %d\n", arrMax(a, n));
    return 0;
}

int arrMax(int a[], int n)
{
    int m = a[0], i;
    for (i = 1; i < n; i++)
        if (a[i] > m) m = a[i];
    return m;
}`,
      refOut: "最大值 = 9",
      hint: "函数内 sizeof(a) 是 8（指针），所以必须传 n；初始化 m=a[0] 再逐个比。"
    },
    /* ===== Ch11 字符串（v67c 补全） ===== */
    {
      id: "ch11-q4", ch: "11", type: "debug", level: "★★",
      title: "改错：strcmp 用错 + 越界",
      desc: "下面程序想判断密码是否匹配，有 3 处错：<br><b>① strcmp 返回值判断反了；② 用 == 比较字符串；③ 数组没留 \\0 空间。</b>",
      starter:
`#include <stdio.h>
#include <string.h>

int main(void)
{
    char pwd[3] = "abc";
    char in[20];
    printf("密码：");
    scanf("%s", in);
    if (strcmp(in, pwd) == 1) printf("正确\n");
    else if (in == pwd) printf("正确2\n");
    else printf("错误\n");
    return 0;
}`,
      ref:
`#include <stdio.h>
#include <string.h>

int main(void)
{
    char pwd[] = "abc";
    char in[20];
    printf("密码：");
    scanf("%s", in);
    if (strcmp(in, pwd) == 0) printf("正确\n");
    else printf("错误\n");
    return 0;
}`,
      refOut: "密码：abc\n正确",
      hint: "strcmp 返回 0 表示相等；字符串必须用 strcmp 比较（== 比的是地址）；数组要留 \\0 空间（pwd[3] 装不下 \"abc\\0\"）。"
    },
    {
      id: "ch11-q5", ch: "11", type: "program", level: "★★",
      title: "编程：字符串反转",
      desc: "读入一个字符串（不含空格），原地反转后输出。用 strlen 求长度、首尾交换。",
      sampleIn: "hello",
      sampleOut: "olleh",
      starter:
`#include <stdio.h>
#include <string.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>
#include <string.h>

int main(void)
{
    char s[100];
    int i, n;
    scanf("%s", s);
    n = strlen(s);
    for (i = 0; i < n / 2; i++) {
        char t = s[i];
        s[i] = s[n - 1 - i];
        s[n - 1 - i] = t;
    }
    printf("%s\n", s);
    return 0;
}`,
      refOut: "olleh",
      hint: "首尾对称交换：s[i] 与 s[n-1-i]，交换 n/2 次即可。"
    },
    {
      id: "ch11-q6", ch: "11", type: "program", level: "★★",
      title: "编程：fgets 统计字符数",
      desc: "用 fgets 读入一行（含空格），去掉结尾换行后输出字符数。",
      sampleIn: "hello world",
      sampleOut: "字符数 = 11",
      starter:
`#include <stdio.h>
#include <string.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>
#include <string.h>

int main(void)
{
    char s[100];
    int len;
    fgets(s, sizeof s, stdin);
    len = strlen(s);
    if (len > 0 && s[len - 1] == '\n') s[len - 1] = '\0';
    printf("字符数 = %d\n", strlen(s));
    return 0;
}`,
      refOut: "字符数 = 11",
      hint: "fgets 会保留结尾 \\n，要去掉：检查 s[len-1]=='\\n' 则置 '\\0'——这是处理 fgets 的标配三行。"
    },
    {
      id: "ch11-q7", ch: "11", type: "pro", level: "★★★",
      title: "专业：统计单词数",
      desc: "读入一行英文（fgets），统计单词个数（空格分隔，无标点）。示例：",
      sampleIn: "I love C language",
      sampleOut: "单词数 = 4",
      starter:
`#include <stdio.h>
#include <string.h>

int main(void)
{
    /* 在这里写你的代码 */

    return 0;
}`,
      ref:
`#include <stdio.h>
#include <string.h>

int main(void)
{
    char s[200];
    int i, n, cnt = 0, in = 0;
    fgets(s, sizeof s, stdin);
    n = strlen(s);
    for (i = 0; i < n; i++) {
        if (s[i] == ' ' || s[i] == '\n') in = 0;
        else if (!in) { in = 1; cnt++; }
    }
    printf("单词数 = %d\n", cnt);
    return 0;
}`,
      refOut: "单词数 = 4",
      hint: "状态机：in 标记是否在单词内；遇空格复位，遇非空格且不在词内则计数。"
    }
  ];

  const CHAPTER_ORDER = ["1", "3", "4", "5", "6", "7", "9", "10", "11", "12"];
  const TYPE_NAME = { debug: "改错", program: "编程", pro: "专业" };
  const TYPE_CLASS = { debug: "cpt-debug", program: "cpt-program", pro: "cpt-pro" };

  /* ---------------- 运行时状态 ---------------- */
  let cpComp = null;        // clang-wasm compiler
  let cpLoading = null;     // 加载 promise
  let cpCur = null;         // 当前题 id
  let cpTimer = null;       // 运行节流

  /* ============================================================
   * 语法高亮（轻量 C 高亮器，textarea + overlay 技术）
   * ============================================================ */
  function escHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  const C_KEYWORDS = new Set([
    "int","char","double","float","void","long","short","unsigned","signed",
    "const","static","struct","union","enum","typedef","sizeof","if","else",
    "for","while","do","switch","case","default","break","continue","return",
    "goto","extern","register","volatile"
  ]);
  function highlightC(src) {
    // 先做占位，避免 HTML 标签干扰
    const tokens = [];
    let i = 0;
    let out = "";
    const push = (type, text) => {
      if (type === "kw") out += '<span class="cpt-kw">' + escHtml(text) + '</span>';
      else if (type === "cm") out += '<span class="cpt-cm">' + escHtml(text) + '</span>';
      else if (type === "str") out += '<span class="cpt-str">' + escHtml(text) + '</span>';
      else if (type === "num") out += '<span class="cpt-num">' + escHtml(text) + '</span>';
      else if (type === "pre") out += '<span class="cpt-pre">' + escHtml(text) + '</span>';
      else out += escHtml(text);
    };
    while (i < src.length) {
      const rest = src.slice(i);
      let m;
      // 行注释
      if ((m = rest.match(/^\/\/[^\n]*/))) { push("cm", m[0]); i += m[0].length; continue; }
      // 块注释
      if ((m = rest.match(/^\/\*[\s\S]*?\*\//))) { push("cm", m[0]); i += m[0].length; continue; }
      // 字符串
      if ((m = rest.match(/^"(?:\\.|[^"\\])*"/))) { push("str", m[0]); i += m[0].length; continue; }
      // 字符
      if ((m = rest.match(/^'(?:\\.|[^'\\])'/))) { push("str", m[0]); i += m[0].length; continue; }
      // 预处理指令
      if ((m = rest.match(/^#\s*[a-zA-Z_][a-zA-Z0-9_]*/))) { push("pre", m[0]); i += m[0].length; continue; }
      // 数字
      if ((m = rest.match(/^\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?[fFlLuU]*\b/))) { push("num", m[0]); i += m[0].length; continue; }
      // 关键字
      if ((m = rest.match(/^[a-zA-Z_][a-zA-Z0-9_]*/))) {
        if (C_KEYWORDS.has(m[0])) push("kw", m[0]);
        else push("plain", m[0]);
        i += m[0].length; continue;
      }
      // 其他
      out += escHtml(rest[0]);
      i++;
    }
    return out;
  }

  /* ============================================================
   * 面板 DOM 构建
   * ============================================================ */
  const CP_STYLE_ID = "cpractice-style";
  function ensureStyle() {
    if (document.getElementById(CP_STYLE_ID)) return;
    const st = document.createElement("style");
    st.id = CP_STYLE_ID;
    st.textContent = `
      .cp-modal{position:fixed;inset:0;z-index:6000;background:#f7f8fa;display:flex;flex-direction:column}
      body.dark .cp-modal{background:#101018}
      .cp-head{display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid var(--line,#e2e8f0);flex-wrap:wrap}
      .cp-head h2{margin:0;font-size:16px;color:var(--ink,#0f172a)}
      .cp-close{margin-left:auto;border:none;background:none;color:var(--muted,#64748b);font-size:20px;cursor:pointer;line-height:1}
      .cp-body{flex:1;display:grid;grid-template-columns:minmax(280px,360px) 1fr;gap:0;min-height:0}
      .cp-left{border-right:1px solid var(--line,#e2e8f0);display:flex;flex-direction:column;min-height:0;overflow:hidden}
      .cp-qlist{flex:1;overflow:auto;padding:8px}
      .cp-qitem{display:block;width:100%;text-align:left;padding:8px 10px;border-radius:8px;border:1px solid transparent;background:transparent;color:var(--body,#334155);font-size:13px;cursor:pointer;margin-bottom:4px;line-height:1.5}
      .cp-qitem:hover{background:var(--glass-hover, rgba(255,255,255,.4))}
      .cp-qitem.active{background:var(--teal-light,#e2e8ff);color:var(--teal-dark,#3b56f0);font-weight:700}
      .cp-qitem .tag{display:inline-block;font-size:10px;padding:1px 6px;border-radius:9px;color:#fff;margin-right:6px;vertical-align:1px}
      .cp-tag-debug{background:#ef4444}.cp-tag-program{background:#4D6BFE}.cp-tag-pro{background:#a855f7}
      .cp-chapter{font-size:12px;font-weight:700;color:var(--muted,#64748b);margin:8px 2px 4px;letter-spacing:.04em}
      .cp-right{display:flex;flex-direction:column;min-height:0;overflow:hidden}
      .cp-desc{padding:12px 16px;border-bottom:1px solid var(--line,#e2e8f0);overflow:auto;max-height:40%;font-size:13.5px;line-height:1.7;color:var(--body,#334155)}
      .cp-desc b{color:var(--ink,#0f172a)}
      .cp-sample{background:var(--glass-input, rgba(255,255,255,.38));border:1px dashed var(--line,#e2e8f0);border-radius:6px;padding:6px 10px;margin-top:6px;font-family:Consolas,monospace;font-size:12px;white-space:pre-wrap}
      .cp-editor{position:relative;flex:1;min-height:0;margin:10px 14px;border:1px solid var(--line,#e2e8f0);border-radius:8px;overflow:hidden;background:var(--code-bg,#f8fafc);display:flex}
      .cp-editor .cp-gutter{flex:0 0 44px;padding:10px 8px 10px 8px;text-align:right;color:var(--muted,#64748b);background:var(--gutter-bg,rgba(0,0,0,.035));border-right:1px solid var(--line,#e2e8f0);font-family:Consolas,"Courier New",monospace;font-size:13px;line-height:1.55;white-space:pre;overflow:hidden;user-select:none;box-sizing:border-box}
      .cp-editor .cp-code{position:relative;flex:1;min-width:0;min-height:0}
      .cp-editor pre,.cp-editor textarea{margin:0;padding:10px 12px;font-family:Consolas,"Courier New",monospace;font-size:13px;line-height:1.55;white-space:pre;tab-size:4;box-sizing:border-box}
      .cp-editor pre{position:absolute;inset:0;overflow:hidden;color:transparent;pointer-events:none;border:none;background:transparent;z-index:2}
      .cp-editor pre span{color:inherit}
      .cp-editor .cp-curline{position:absolute;left:0;right:0;height:20.15px;background:rgba(77,107,254,.09);pointer-events:none;z-index:0;transition:top .08s}
      .cp-editor textarea{position:absolute;inset:0;width:100%;height:100%;background:transparent;color:var(--ink,#0f172a);border:none;outline:none;resize:none;overflow:auto;caret-color:var(--teal,#4D6BFE);z-index:3}
      body.dark .cp-editor{background:#0f1220}
      body.dark .cp-editor .cp-gutter{background:rgba(255,255,255,.03)}
      body.dark .cp-editor textarea{color:#e2e8f0}
      body.dark .cp-editor .cp-curline{background:rgba(77,107,254,.16)}
      .cp-out .errline{cursor:pointer;text-decoration:underline dotted}
      .cp-out .errline:hover{background:rgba(239,68,68,.1)}
      .cp-kw{color:#4D6BFE;font-weight:700}.cp-cm{color:#6b7280;font-style:italic}
      .cp-str{color:#059669}.cp-num{color:#d97706}.cp-pre{color:#a855f7;font-weight:700}
      .cp-bar{display:flex;align-items:center;gap:8px;padding:8px 14px;border-top:1px solid var(--line,#e2e8f0);flex-wrap:wrap}
      .cp-bar label{font-size:12px;color:var(--muted,#64748b)}
      .cp-in{flex:1;min-width:120px;padding:5px 8px;border:1px solid var(--line,#e2e8f0);border-radius:6px;font-family:Consolas,monospace;font-size:12px;background:var(--glass-input, rgba(255,255,255,.38));color:var(--ink,#0f172a)}
      body.dark .cp-in{background:rgba(60,60,60,.6);color:#eee}
      .cp-btn{border:none;border-radius:7px;padding:6px 14px;font-size:13px;cursor:pointer;font-weight:700}
      .cp-run{background:var(--teal,#4D6BFE);color:#fff}
      .cp-save{background:linear-gradient(135deg,#0E9F6E,#0d9488);color:#fff}
      .cp-run:disabled{opacity:.5;cursor:wait}
      .cp-ghost{background:var(--glass-hover, rgba(255,255,255,.4));color:var(--ink,#0f172a);border:1px solid var(--line,#e2e8f0)}
      .cp-out{margin:0 14px 10px;border:1px solid var(--line,#e2e8f0);border-radius:8px;padding:8px 10px;font-family:Consolas,monospace;font-size:12.5px;line-height:1.6;white-space:pre-wrap;max-height:38%;overflow:auto;background:var(--code-bg,#f8fafc);color:var(--ink,#0f172a);min-height:40px}
      body.dark .cp-out{background:#0f1220;color:#e2e8f0}
      .cp-out .err{color:#ef4444}
      .cp-out .ok{color:#059669}
      .cp-out .meta{color:var(--muted,#64748b);font-size:11px}
      .cp-ref{display:none;margin:6px 0 0;border-top:1px dashed var(--line,#e2e8f0);padding-top:6px}
      .cp-ref pre{background:var(--ans-bg,#f0fdf4);border:1px solid #86efac;border-radius:6px;padding:8px;overflow:auto;font-size:12px;line-height:1.55;white-space:pre;font-family:Consolas,monospace}
      body.dark .cp-ref pre{background:#0e1f16;border-color:#166534}
      .cp-hint{display:none;margin:6px 0 0;font-size:12.5px;color:var(--muted,#64748b);background:var(--tip-bg,#eff6ff);border-left:3px solid #93c5fd;padding:6px 10px;border-radius:4px}
      .cp-load{position:fixed;inset:0;z-index:7000;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;background:rgba(10,14,30,.55);color:#fff;font-size:14px;backdrop-filter:blur(3px)}
      .cp-load[hidden]{display:none}
      .cp-load .bar{width:280px;height:6px;background:rgba(255,255,255,.2);border-radius:3px;overflow:hidden}
      .cp-load .fill{height:100%;width:0%;background:#4D6BFE;transition:width .2s}
      .cp-review{position:fixed;inset:0;z-index:6000;background:#f7f8fa;display:flex;flex-direction:column}
      .cp-review[hidden]{display:none}
      body.dark .cp-review{background:#101018}
      .cp-rv-head{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--line,#e2e8f0)}
      .cp-rv-head b{font-size:15px;color:var(--ink,#0f172a)}
      .cp-rv-head .cnt{color:var(--muted,#64748b);font-size:12px}
      .cp-rv-head .exit{margin-left:auto;border:none;background:none;color:var(--muted,#64748b);font-size:18px;cursor:pointer}
      .cp-rv-body{flex:1;display:flex;align-items:center;justify-content:center;padding:20px;overflow:auto}
      .cp-rv-card{width:min(640px,94%);background:#fff;border:1px solid var(--line,#e2e8f0);border-radius:12px;padding:22px;box-shadow:0 8px 30px rgba(0,0,0,.08)}
      body.dark .cp-rv-card{background:#0f1220}
      .cp-rv-tag{font-size:11px;padding:2px 8px;border-radius:10px;color:#fff;display:inline-block;margin-bottom:8px}
      .cp-rv-front{font-size:14.5px;line-height:1.7;color:var(--ink,#0f172a)}
      .cp-rv-back{margin-top:12px;padding-top:12px;border-top:1px dashed var(--line,#e2e8f0)}
      .cp-rv-back pre{background:var(--ans-bg,#f0fdf4);border:1px solid #86efac;border-radius:6px;padding:10px;overflow:auto;font-size:12.5px;line-height:1.55;white-space:pre;font-family:Consolas,monospace}
      body.dark .cp-rv-back pre{background:#0e1f16;border-color:#166534}
      .cp-rv-hint{margin-top:10px;font-size:12.5px;color:var(--muted,#64748b);background:var(--tip-bg,#eff6ff);border-left:3px solid #93c5fd;padding:6px 10px;border-radius:4px}
      .cp-rv-actions{display:flex;gap:8px;margin-top:16px;flex-wrap:wrap}
      .cp-rv-btn{border:none;border-radius:8px;padding:8px 16px;font-size:13px;cursor:pointer;font-weight:700;flex:1;min-width:70px}
      .cp-rv-again{background:#ef4444;color:#fff}
      .cp-rv-hard{background:#f59e0b;color:#fff}
      .cp-rv-good{background:#10b981;color:#fff}
      .cp-rv-easy{background:#4D6BFE;color:#fff}
      .cp-rv-flip{margin-top:12px;border:none;background:var(--teal-light,#e2e8ff);color:var(--teal-dark,#3b56f0);border-radius:8px;padding:8px 16px;font-size:13px;cursor:pointer;font-weight:700}
      .cp-rv-empty{color:var(--muted,#64748b);font-size:14px;text-align:center;padding:40px}
      .cp-rv-done{color:#059669;font-weight:700;font-size:15px;text-align:center;padding:30px}
      @media (max-width:720px){ .cp-body{grid-template-columns:1fr;grid-template-rows:auto 1fr}.cp-qlist{max-height:150px} }
    `;
    document.head.appendChild(st);
  }

  let cpRoot = null;
  function buildPanel() {
    ensureStyle();
    cpRoot = document.createElement("div");
    cpRoot.className = "cp-modal";
    cpRoot.hidden = true;
    cpRoot.innerHTML = `
      <div class="cp-head">
        <h2>C 语言练习</h2>
        <span style="font-size:11px;color:var(--muted,#64748b)">浏览器内编译运行 · 数据仅存本机</span>
        <button class="cp-close" title="关闭">✕</button>
      </div>
      <div class="cp-body">
        <div class="cp-left">
          <div class="cp-qlist"></div>
        </div>
        <div class="cp-right">
          <div class="cp-desc"></div>
          <div class="cp-editor">
            <div class="cp-gutter" aria-hidden="true"></div>
            <div class="cp-code">
              <div class="cp-curline"></div>
              <pre aria-hidden="true"></pre>
              <textarea spellcheck="false" autocapitalize="off" autocomplete="off" wrap="off"></textarea>
            </div>
          </div>
          <div class="cp-bar">
            <label>输入(stdin)</label>
            <input class="cp-in" placeholder="程序里用到 scanf 时填在这里，如 3 + 5">
            <button class="cp-btn cp-run">▶ 运行</button>
            <button class="cp-btn cp-save" data-act="save" title="把当前代码命名保存，可保留多份">💾 保存</button>
            <button class="cp-btn cp-ghost" data-act="lib" title="查看/载入/删除已保存的代码">📚 我的代码</button>
            <button class="cp-btn cp-ghost" data-act="ref">参考答案</button>
            <button class="cp-btn cp-ghost" data-act="hint">提示</button>
            <button class="cp-btn cp-ghost" data-act="reset">重置</button>
            <button class="cp-btn cp-ghost" data-act="deck" style="border-color:#f59e0b">错题本</button>
            <button class="cp-btn cp-ghost" data-act="cards" style="border-color:#8b5cf6">知识点卡</button>
            <button class="cp-btn cp-ghost" data-act="mindmap" style="border-color:#10b981">思维导图</button>
            <button class="cp-btn cp-ghost" data-act="review">复习</button>
          </div>
          <div class="cp-out"><span class="meta">运行结果将显示在这里。点「▶ 运行」编译并执行你的代码（首次会加载编译内核，约 28MB，请稍候）。</span></div>
        </div>
      </div>
      <div class="cp-load" hidden><div>正在加载 C 编译内核…</div><div class="bar"><div class="fill"></div></div><div class="meta" style="font-size:12px;color:rgba(255,255,255,.75)"></div></div>
      <div class="cp-review" hidden>
        <div class="cp-rv-head"><b>错题复习</b><span class="cnt"></span><button class="exit" title="退出">✕</button></div>
        <div class="cp-rv-body"></div>
      </div>
      <div class="cp-review cp-lib" hidden>
        <div class="cp-rv-head"><b>我的代码</b><span class="cnt"></span><button class="exit" title="关闭">✕</button></div>
        <div class="cp-rv-body"></div>
      </div>
    `;
    document.body.appendChild(cpRoot);

    // 事件绑定
    cpRoot.querySelector(".cp-close").addEventListener("click", hide);
    const ta = cpRoot.querySelector("textarea");
    const pre = cpRoot.querySelector(".cp-editor pre");
    function syncScroll() {
      pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft;
      const g = cpRoot.querySelector(".cp-gutter"); if (g) g.scrollTop = ta.scrollTop;
    }
    function onEdit() {
      const q = curQ();
      if (cpCur === "__free") { try { localStorage.setItem("cp-free-code", ta.value); } catch(e){} return; }
      if (!q) return;
      save(q.id, ta.value);
      renderHighlight(q, ta.value);
      updateGutter(); updateCurline();
    }
    ta.addEventListener("input", onEdit);
    ta.addEventListener("scroll", syncScroll);
    ta.addEventListener("keyup", updateCurline);
    ta.addEventListener("click", updateCurline);
    ta.addEventListener("focus", updateCurline);
    ta.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const st = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, st) + "    " + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = st + 4;
        onEdit();
      }
    });
    cpRoot.querySelector("[data-act=ref]").addEventListener("click", () => {
      const r = cpRoot.querySelector(".cp-ref"); if (r) r.style.display = r.style.display === "none" ? "" : "none";
    });
    cpRoot.querySelector("[data-act=hint]").addEventListener("click", () => {
      const h = cpRoot.querySelector(".cp-hint"); if (h) h.style.display = h.style.display === "none" ? "" : "none";
    });
    cpRoot.querySelector("[data-act=reset]").addEventListener("click", () => {
      const q = curQ(); if (!q) return;
      if (!confirm("把本题代码重置为初始代码？")) return;
      ta.value = q.starter; save(q.id, ta.value); renderHighlight(q, ta.value); updateGutter(); updateCurline();
    });
    cpRoot.querySelector(".cp-run").addEventListener("click", run);
    cpRoot.querySelector('[data-act="save"]').addEventListener("click", saveFree);
    cpRoot.querySelector('[data-act="lib"]').addEventListener("click", showFreeLib);
    const libBox = cpRoot.querySelector(".cp-lib");
    if (libBox) libBox.querySelector(".exit").addEventListener("click", function(){ libBox.hidden = true; });
    cpRoot.querySelector("[data-act=deck]").addEventListener("click", () => {
      const q = curQ(); if (!q) return;
      toggleCard(q.id);
      refreshDeckBtn(q.id);
    });
    cpRoot.querySelector("[data-act=review]").addEventListener("click", openReview);
    cpRoot.querySelector("[data-act=cards]").addEventListener("click", openCards);
    cpRoot.querySelector("[data-act=mindmap]").addEventListener("click", function(){
      var base = document.currentScript && document.currentScript.getAttribute("data-base") || ".";
      window.open(base + "/c-course/c-mindmap.html", "_blank");
    });
    cpRoot.querySelector(".cp-review .exit").addEventListener("click", () => { cpRoot.querySelector(".cp-review").hidden = true; });
    buildList();
  }

  function buildList() {
    const list = cpRoot.querySelector(".cp-qlist");
    list.innerHTML = "";
    /* v59：自由写代码入口（独立于题目，任意 C 代码本地保存，可真实编译运行） */
    const free = document.createElement("button");
    free.className = "cp-qitem cp-free";
    free.dataset.id = "__free";
    free.innerHTML = '<span class="tag" style="background:linear-gradient(135deg,#4D6BFE,#8B5CF6);color:#fff">自由</span>📝 自由写代码';
    free.addEventListener("click", () => selectFree());
    list.appendChild(free);
    for (const ch of CHAPTER_ORDER) {
      const items = QUESTIONS.filter(q => q.ch === ch);
      if (!items.length) continue;
      const sec = document.createElement("div");
      sec.innerHTML = '<div class="cp-chapter">第 ' + ch + ' 章</div>';
      for (const q of items) {
        const b = document.createElement("button");
        b.className = "cp-qitem";
        b.dataset.id = q.id;
        b.innerHTML = '<span class="tag cp-tag-' + q.type + '">' + TYPE_NAME[q.type] + '</span>' + q.title;
        b.addEventListener("click", () => select(q.id));
        sec.appendChild(b);
      }
      list.appendChild(sec);
    }
  }

  /* v59：自由写代码模式——不绑定题目，代码存 localStorage("cp-free-code") */
  function selectFree() {
    cpCur = "__free";
    cpRoot.querySelectorAll(".cp-qitem").forEach(el => el.classList.toggle("active", el.dataset.id === "__free"));
    const desc = cpRoot.querySelector(".cp-desc");
    desc.innerHTML = '<div><span class="tag" style="background:linear-gradient(135deg,#4D6BFE,#8B5CF6);color:#fff">自由</span> '
      + '<b>自由写代码</b> <span class="meta" style="color:var(--muted,#64748b)">任意 C 代码 · 本地自动保存 · 不计入进度 · 不参与复习</span></div>';
    const ta = cpRoot.querySelector("textarea");
    let saved = "";
    try { saved = localStorage.getItem("cp-free-code") || ""; } catch(e){}
    ta.value = saved || '#include <stdio.h>\n\nint main(void)\n{\n    printf("Hello, Lioli!\\n");\n    return 0;\n}\n';
    renderHighlight(null, ta.value);
    updateGutter(); updateCurline();
  }

  /* v60：自由写代码——命名保存多份（cp-free-lib）+ 我的代码列表 */
  function freeLib() {
    try { var l = JSON.parse(localStorage.getItem("cp-free-lib") || "[]"); return Array.isArray(l) ? l : []; } catch(e){ return []; }
  }
  function outMsg(html){ const out = cpRoot.querySelector(".cp-out"); if (out) out.innerHTML = html; }
  function saveFree() {
    if (cpCur !== "__free") { outMsg('<div class="meta">仅自由写代码模式可保存（题目自动保存，无需手动）。</div>'); return; }
    const ta = cpRoot.querySelector("textarea");
    const code = ta.value;
    if (!code.trim()) { outMsg('<div class="err">编辑器是空的，先写点代码再保存。</div>'); return; }
    /* v62：内联命名（萝 096：平板 prompt 体验差）——mini 浮层，重名二次点击覆盖 */
    const lib = freeLib();
    const dlg = document.createElement("div");
    dlg.style.cssText = "position:fixed;inset:0;z-index:9999;background:rgba(15,23,42,.45);display:flex;align-items:center;justify-content:center";
    const card = document.createElement("div");
    card.style.cssText = "width:min(360px,86vw);background:var(--card,#fff);border-radius:14px;padding:18px;box-shadow:0 20px 50px rgba(0,0,0,.3);font-family:inherit;color:var(--text,#0f172a)";
    card.innerHTML = '<div style="font-weight:700;font-size:14px;margin-bottom:10px">💾 保存代码</div>'
      + '<input style="width:100%;box-sizing:border-box;height:36px;padding:0 10px;font-size:13px;border:1px solid var(--line,#cbd5e1);border-radius:8px;background:var(--bg,#fff);color:var(--text,#0f172a);outline:none" maxlength="30">'
      + '<div class="saveNameTip" style="font-size:11px;color:var(--muted,#64748b);margin:6px 2px;min-height:14px"></div>'
      + '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:6px">'
      + '<button data-act="cancel" style="height:32px;padding:0 14px;font-size:12px;border-radius:8px;border:1px solid rgba(0,0,0,.15);background:#fff;cursor:pointer">取消</button>'
      + '<button data-act="ok" style="height:32px;padding:0 14px;font-size:12px;border-radius:8px;border:none;background:var(--teal,#4D6BFE);color:#fff;cursor:pointer">保存</button></div>';
    dlg.appendChild(card);
    document.body.appendChild(dlg);
    const inp = card.querySelector("input");
    const tip = card.querySelector(".saveNameTip");
    inp.value = "代码 " + (lib.length + 1);
    let over = false;
    function doSave(){
      const n = (inp.value || "").trim() || "未命名";
      const l = freeLib();
      const d = l.findIndex(x => x.name === n);
      if (d >= 0 && !over) { over = true; tip.innerHTML = '⚠ 已存在「<b>' + escHtml(n) + '</b>」，再次点击将覆盖它'; card.querySelector('[data-act=ok]').textContent = "覆盖保存"; return; }
      if (d >= 0) l.splice(d, 1);
      l.push({ name: n, code: code, t: Date.now() });
      try { localStorage.setItem("cp-free-lib", JSON.stringify(l)); } catch(e){ dlg.remove(); outMsg('<div class="err">保存失败（本地存储已满？）：' + escHtml(String(e)) + '</div>'); return; }
      dlg.remove();
      outMsg('<div class="ok">✓ 已保存：「' + escHtml(n) + '」 · 共 ' + l.length + ' 份（点「📚 我的代码」可载入/重命名/导出）</div>');
    }
    card.querySelector('[data-act=ok]').onclick = doSave;
    card.querySelector('[data-act=cancel]').onclick = function(){ dlg.remove(); };
    inp.addEventListener("keydown", function(e){ if (e.key === "Enter") { e.preventDefault(); doSave(); } });
    inp.focus(); inp.select();
  }
  function showFreeLib() {
    const lib = freeLib();
    const box = cpRoot.querySelector(".cp-lib");
    if (!box) return;
    if (!lib.length) { alert("还没有保存的代码。写完点「💾 保存」即可保留。"); return; }
    const body = box.querySelector(".cp-rv-body");
    body.innerHTML = "";
    box.querySelector(".cnt").textContent = lib.length + " 份";
    /* v62：备份/迁移行（导出全部 JSON + 导入 JSON）——萝 096：localStorage 只算暂存，导出才是真留档 */
    const impRow = document.createElement("div");
    impRow.style.cssText = "display:flex;gap:8px;padding:8px 14px;border-bottom:1px solid var(--line,#e2e8f0);align-items:center";
    impRow.innerHTML = '<span style="font-size:12px;color:var(--muted,#64748b)">留档：</span>'
      + '<button data-i="exp" style="height:26px;padding:0 10px;font-size:12px;border-radius:6px;border:1px solid rgba(0,0,0,.15);background:#fff;cursor:pointer">📤 导出全部</button>'
      + '<button data-i="imp" style="height:26px;padding:0 10px;font-size:12px;border-radius:6px;border:1px solid rgba(0,0,0,.15);background:#fff;cursor:pointer">📥 导入 JSON</button>';
    body.appendChild(impRow);
    impRow.querySelector('[data-i=exp]').onclick = function(){
      const l = freeLib(); if (!l.length) { alert("还没有保存的代码。"); return; }
      const blob = new Blob([JSON.stringify(l, null, 1)], { type: "application/json" });
      const u = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = u; a.download = "lioli-我的代码.json";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function(){ URL.revokeObjectURL(u); }, 10000);
    };
    const fInp = document.createElement("input");
    fInp.type = "file"; fInp.accept = ".json,application/json"; fInp.style.display = "none";
    document.body.appendChild(fInp);
    impRow.querySelector('[data-i=imp]').onclick = function(){ fInp.click(); };
    fInp.onchange = function(){
      const f = fInp.files && fInp.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = function(){
        try {
          const arr = JSON.parse(rd.result);
          if (!Array.isArray(arr)) { alert("格式不对：应为代码数组 JSON（可直接用「导出全部」得到的文件）。"); return; }
          const cur = freeLib();
          let add = 0;
          arr.forEach(function(it){
            if (!it || typeof it.code !== "string" || !it.code.trim()) return;
            const n = (it.name || "").trim() || "未命名";
            if (!cur.some(x => x.name === n)) { cur.push({ name: n, code: it.code, t: it.t || Date.now() }); add++; }
          });
          try { localStorage.setItem("cp-free-lib", JSON.stringify(cur)); } catch(e){ alert("导入失败（本地存储已满？）：" + e); return; }
          alert("导入完成：新增 " + add + " 份（重名自动跳过）");
          showFreeLib();
        } catch(e){ alert("解析失败：" + e); }
        fInp.value = "";
      };
      rd.readAsText(f);
    };
    lib.forEach((item, i) => {
      const row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid var(--line,#e2e8f0);background:var(--card,#fff)";
      const meta = document.createElement("div");
      meta.style.cssText = "flex:1;min-width:0";
      meta.innerHTML = '<div style="font-weight:600;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(item.name) + '</div>'
        + '<div style="font-size:11px;color:var(--muted,#64748b)">' + new Date(item.t).toLocaleString() + ' · ' + item.code.split("\n").length + ' 行</div>';
      const loadB = document.createElement("button");
      loadB.textContent = "载入";
      loadB.style.cssText = "height:26px;padding:0 12px;font-size:12px;border-radius:6px;border:none;background:var(--teal,#4D6BFE);color:#fff;cursor:pointer";
      loadB.onclick = function(){
        const ta = cpRoot.querySelector("textarea");
        if (ta.value && ta.value !== item.code) {
          if (!confirm("当前编辑器内容与这份代码不同，载入将覆盖。继续？")) return;
        }
        ta.value = item.code;
        renderHighlight(null, item.code);
        updateGutter(); updateCurline();
        try { localStorage.setItem("cp-free-code", item.code); } catch(e){}
        box.hidden = true;
        outMsg('<div class="ok">✓ 已载入：「' + escHtml(item.name) + '」（自动保存已同步）</div>');
      };
      const renB = document.createElement("button");
      renB.textContent = "✏️";
      renB.title = "重命名";
      renB.style.cssText = "height:26px;width:30px;font-size:12px;border-radius:6px;border:1px solid rgba(0,0,0,.15);background:#fff;cursor:pointer";
      renB.onclick = function(){
        const n = prompt("重命名「" + item.name + "」为：", item.name);
        if (n === null) return;
        const nn = (n || "").trim(); if (!nn) { alert("名字不能为空。"); return; }
        const l = freeLib(); const idx = l.findIndex(x => x.name === nn);
        if (idx >= 0 && idx !== i) { alert("已存在「" + nn + "」。"); return; }
        l[i].name = nn; l[i].t = Date.now();
        try { localStorage.setItem("cp-free-lib", JSON.stringify(l)); } catch(e){}
        showFreeLib();
      };
      const dlB = document.createElement("button");
      dlB.textContent = "⬇";
      dlB.title = "下载 .c 源码";
      dlB.style.cssText = "height:26px;width:30px;font-size:12px;border-radius:6px;border:1px solid rgba(0,0,0,.15);background:#fff;cursor:pointer";
      dlB.onclick = function(){
        const blob = new Blob([item.code], { type: "text/plain;charset=utf-8" });
        const u = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = u; a.download = (item.name.replace(/[\\/:*?"<>|]/g, "_") || "code") + ".c";
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function(){ URL.revokeObjectURL(u); }, 10000);
      };
      const delB = document.createElement("button");
      delB.textContent = "删除";
      delB.style.cssText = "height:26px;padding:0 12px;font-size:12px;border-radius:6px;border:1px solid rgba(0,0,0,.15);background:#fff;cursor:pointer;color:#d64545";
      delB.onclick = function(){
        if (!confirm("删除「" + item.name + "」？")) return;
        const l = freeLib(); l.splice(i, 1);
        try { localStorage.setItem("cp-free-lib", JSON.stringify(l)); } catch(e){}
        showFreeLib();
      };
      row.appendChild(meta); row.appendChild(loadB); row.appendChild(renB); row.appendChild(dlB); row.appendChild(delB);
      body.appendChild(row);
    });
    box.hidden = false;
  }

  function curQ() { return cpCur ? QUESTIONS.find(q => q.id === cpCur) : null; }

  function select(id) {
    const q = QUESTIONS.find(q => q.id === id);
    if (!q) return;
    cpCur = id;
    // 高亮列表
    cpRoot.querySelectorAll(".cp-qitem").forEach(el => el.classList.toggle("active", el.dataset.id === id));
    // 题干
    const desc = cpRoot.querySelector(".cp-desc");
    let html = '<div><span class="tag cp-tag-' + q.type + '">' + TYPE_NAME[q.type] + '</span> '
      + '<b>' + escHtml(q.title) + '</b> <span class="meta" style="color:var(--muted,#64748b)">第 ' + q.ch + ' 章 · ' + q.level + '</span></div>'
      + '<div style="margin-top:6px">' + q.desc + '</div>';
    if (q.sampleIn) html += '<div class="cp-sample">输入示例：' + escHtml(q.sampleIn) + '</div>';
    if (q.sampleOut) html += '<div class="cp-sample">预期输出：<br>' + escHtml(q.sampleOut) + '</div>';
    desc.innerHTML = html;
    // 参考与提示
    let refEl = cpRoot.querySelector(".cp-ref");
    if (!refEl) { refEl = document.createElement("div"); refEl.className = "cp-ref"; desc.appendChild(refEl); }
    refEl.innerHTML = '<b style="color:var(--ink,#0f172a)">参考答案：</b><pre>' + escHtml(q.ref) + '</pre>';
    refEl.style.display = "none";
    let hintEl = cpRoot.querySelector(".cp-hint");
    if (!hintEl) { hintEl = document.createElement("div"); hintEl.className = "cp-hint"; desc.appendChild(hintEl); }
    hintEl.textContent = "提示：" + q.hint;
    hintEl.style.display = "none";
    // 代码
    const ta = cpRoot.querySelector("textarea");
    ta.value = load(id) != null ? load(id) : q.starter;
    renderHighlight(q, ta.value); updateGutter(); updateCurline();
    // 清空输出（保留 meta 提示）
    const out = cpRoot.querySelector(".cp-out");
    out.innerHTML = '<span class="meta">点「▶ 运行」编译并执行你的代码。</span>';
    // 关闭参考/提示面板
    // 预填输入框（若有样例输入）
    const inp = cpRoot.querySelector(".cp-in");
    if (q.sampleIn) inp.value = q.sampleIn; else inp.value = "";
    refreshDeckBtn(id);
  }

  function renderHighlight(q, src) {
    const pre = cpRoot.querySelector(".cp-editor pre");
    pre.innerHTML = highlightC(src) + (src.endsWith("\n") ? "" : "\n");
    pre.scrollTop = cpRoot.querySelector("textarea").scrollTop;
    pre.scrollLeft = cpRoot.querySelector("textarea").scrollLeft;
  }

  /* ---------------- 编辑器增强：行号 / 当前行 / 错误定位 ---------------- */
  const CP_LINE_H = 13 * 1.55;      // 行高 20.15px，须与 CSS 保持一致
  function updateGutter() {
    const g = cpRoot.querySelector(".cp-gutter");
    const ta = cpRoot.querySelector("textarea");
    const n = ta.value.split("\n").length;
    let html = "";
    for (let i = 1; i <= n; i++) html += i + "\n";
    g.textContent = html;
  }
  function updateCurline() {
    const ta = cpRoot.querySelector("textarea");
    const cur = cpRoot.querySelector(".cp-curline");
    const line = ta.value.slice(0, ta.selectionStart).split("\n").length;
    cur.style.top = ((line - 1) * CP_LINE_H + 10) + "px";
  }
  function parseErrLine(s) {
    const m = String(s).match(/:(\d+):/);
    return m ? parseInt(m[1], 10) : null;
  }
  function gotoLine(n) {
    const ta = cpRoot.querySelector("textarea");
    const lines = ta.value.split("\n");
    const idx = Math.max(0, Math.min(n - 1, lines.length - 1));
    let off = 0;
    for (let i = 0; i < idx; i++) off += lines[i].length + 1;
    ta.focus(); ta.selectionStart = ta.selectionEnd = off;
    updateCurline();
    const cur = cpRoot.querySelector(".cp-curline");
    cur.style.background = "rgba(239,68,68,.20)";
    setTimeout(() => { cur.style.background = ""; }, 1600);
  }
  function cpErrDelegate(ev) {
    const t = ev.target;
    if (t && t.classList && t.classList.contains("errline")) {
      const ln = parseInt(t.getAttribute("data-line"), 10);
      if (ln > 0) gotoLine(ln);
    }
  }

  /* ---------------- 闪卡复习（错题本 + 间隔重复，借鉴 Anki 交互） ---------------- */
  const CP_CARDS_KEY = "reader-app-cp-cards";
  const DAY_MS = 24 * 3600 * 1000;
  function cardsStore() { try { return JSON.parse(localStorage.getItem(CP_CARDS_KEY) || "{}"); } catch (e) { return {}; } }
  function saveCards(o) { try { localStorage.setItem(CP_CARDS_KEY, JSON.stringify(o)); } catch (e) {} }
  function inDeck(qid) { return !!cardsStore()[qid]; }
  function toggleCard(qid) {
    const o = cardsStore();
    if (o[qid]) delete o[qid];
    else o[qid] = { S: 0.01, D: 5.5, R: 0.9, due: Date.now(), reps: 0, lapses: 0 };
    saveCards(o);
    return !!o[qid];
  }
  function dueCards() {
    const o = cardsStore(); const now = Date.now();
    return Object.keys(o).filter(q => o[q].due <= now);
  }
  function scheduleCard(qid, rating) {
    const o = cardsStore(); const c = o[qid]; if (!c) return;
    /* 旧卡迁移：无 S/D 字段（v66 前的 ef/interval 旧结构）→ 初始化 FSRS 字段 */
    if (!("S" in c)) { c.S = Math.max(c.interval || 0, 0.01); c.D = 5.5; }
    fsrsSchedule(c, rating);
    saveCards(o);
  }
  /* ---------------- FSRS-4.5（简化无优化器，默认权重）：稳定性 S（天）+ 难度 D（1-10）+ 保留率 R ---------------- */
  const FSRS_W = [0.40255,1.18385,3.173,15.69105,7.1949,0.5345,1.4604,0.0046,1.54575,0.1192,1.01925,1.9395,0.11,0.29605,2.2698,0.2315,2.9898,0.51655,0.6621];
  const FSRS_DECAY = -0.5, FSRS_FACTOR = 19 / 81;
  function fsrsR(S, t) { return Math.pow(1 + FSRS_FACTOR * t / Math.max(S, 0.1), FSRS_DECAY); }
  function fsrsInit() { return { S: 0.01, D: 5.5, R: 0.9, due: Date.now(), reps: 0, lapses: 0 }; }
  function fsrsSchedule(c, rating) {
    const w = FSRS_W, D0 = 5.5;
    const ivl = Math.max(c.S || 0, 0.01);
    const meanR = fsrsR(c.S || 0.01, ivl);
    let D = Math.min(10, Math.max(1, w[7] * D0 + (1 - w[7]) * ((c.D || D0) + w[8] * (0.5 - meanR))));
    let S = c.S || 0.01;
    if (rating === 0) { S = w[10] * Math.pow(D, -w[9]) * (Math.pow(S + 1, w[11]) - 1) * Math.pow(meanR, w[13]); c.lapses++; }
    else if (rating === 1) { S = S * Math.exp(w[12] * (D - D0) * Math.exp(-w[13] * meanR) * Math.pow(S + 1, w[14]) * Math.pow(meanR, w[15])); }
    else if (rating === 2) { S = S * (1 + Math.exp(w[16]) * (11 - D) * Math.pow(S, -w[17]) * (Math.exp((1 - meanR) * w[18]) - 1)); }
    else { S = S * Math.exp(w[16] * (11 - D) * Math.pow(S, -w[17]) * (Math.exp((1 - meanR) * w[18]) - 1) * 1.5); }
    c.S = Math.max(0.1, Math.min(3650, S)); c.D = D; c.reps++;
    const days = Math.max(1, Math.round(c.S));
    c.due = Date.now() + days * DAY_MS; c.R = fsrsR(c.S, days);
  }
  function refreshDeckBtn(qid) {
    const deckBtn = cpRoot.querySelector("[data-act=deck]");
    if (!deckBtn) return;
    const on = inDeck(qid);
    deckBtn.style.background = on ? "#f59e0b" : "";
    deckBtn.style.color = on ? "#fff" : "";
    deckBtn.textContent = on ? "已加入错题本" : "错题本";
    deckBtn.title = on ? "点击移出错题本" : "加入错题本，供间隔重复复习";
  }
  /* ---------------- 知识点卡（预置 C 各章核心知识点，FSRS 调度；进度独立存储） ---------------- */
  const CP_FLASH = [
    { id: "f9-1", ch: "ch9 函数", q: "C 程序从哪里开始执行？函数原型（声明）与定义有什么区别？", a: "从 main() 开始执行。原型只是声明（返回类型+名+参数），告诉编译器函数存在；定义才是函数体。不写原型会触发警告，正规写法：先声明后定义。" },
    { id: "f9-2", ch: "ch9 函数", q: "为什么用 int 而非 void 定义 main()？return 0 是什么？", a: "int main() 表示程序返回一个整数给操作系统；return 0 表示正常结束（0 = 成功）。void main() 不规范，作业/竞赛里可能被判格式错误。" },
    { id: "f9-3", ch: "ch9 函数", q: "形参和实参是什么？函数内改形参会改实参吗？", a: "形参是函数定义里的参数（实参的副本），实参是调用时传入的值。C 是值传递：函数内改形参不影响实参，想改原变量要传指针。" },
    { id: "f9-4", ch: "ch9 函数", q: "数组名当函数参数传的是什么？为什么函数内 sizeof(arr) 不对？", a: "数组名作参数会退化为指针（传首地址），函数内 sizeof(arr) 得到指针大小而不是数组大小。要传长度：void f(int a[], int n);" },
    { id: "f9-5", ch: "ch9 函数", q: "全局变量与局部变量同名时优先用哪个？", a: "局部优先（遮蔽全局）。尽量少用全局变量：可读性差、多文件易冲突；需要共享用传参/返回值更清晰。" },
    { id: "f10-1", ch: "ch10 数组", q: "int a[5]; 的下标范围是？越界会怎样？", a: "0 到 4（共 5 个）。越界读写是未定义行为：可能不报错但悄悄破坏其他变量，或崩溃/安全漏洞。C 不检查下标。" },
    { id: "f10-2", ch: "ch10 数组", q: "int a[5] = {1,2}; 剩下的元素是什么？", a: "自动补 0：1,2,0,0,0。只初始化部分元素时，其余为 0。" },
    { id: "f10-3", ch: "ch10 数组", q: "sizeof(a)/sizeof(a[0]) 为什么能算出元素个数？", a: "sizeof(a) 是整个数组字节数，sizeof(a[0]) 是单个元素字节数，相除得个数。只在数组定义处有效，传参退化为指针后就失效。" },
    { id: "f10-4", ch: "ch10 数组", q: "二维数组 int a[3][4] 在内存里怎么排？a[0] 是什么？", a: "按行优先连续排（12 个 int 连成一段）。a[0] 是第 0 行首地址，类型为 int*（一行数组名退化为指针）。" },
    { id: "f11-1", ch: "ch11 字符串", q: "C 字符串怎么存储？\"hi\" 实际占几个字节？", a: "char 数组 + 结尾 '\\0'。\"hi\" 占 3 字节（h i \\0）。忘记给 \\0 留空间是新手最常见的溢出原因。" },
    { id: "f11-2", ch: "ch11 字符串", q: "scanf(\"%s\") 和 fgets() 读字符串有什么差别？", a: "scanf %s 遇空格就停、不检查长度（超长溢出）；fgets 读整行、可限长度（fgets(b, sizeof b, stdin) 最多读 sizeof-1 个）。读一行用 fgets。" },
    { id: "f11-3", ch: "ch11 字符串", q: "strcpy / strcmp / strcat / strlen 各自干嘛？", a: "strcpy(dst,src) 复制；strcmp(a,b) 比较（0 相等，<0 a 小）；strcat(dst,src) 拼接；strlen(s) 求长度（不含 \\0）。都在 <string.h>。" },
    { id: "f11-4", ch: "ch11 字符串", q: "清 scanf 缓冲区为什么必须判断 EOF？", a: "scanf 后残留回车要用 getchar() 清掉；但输入被重定向/结束时 getchar() 一直返回 EOF → 死循环。标准写法：int c; while ((c=getchar()) != '\\n' && c != EOF);" }
  ];
  const CP_FLASH_KEY = "cp-flash-progress";
  function flashStore() { try { return JSON.parse(localStorage.getItem(CP_FLASH_KEY) || "{}"); } catch(e){ return {}; } }
  function flashDue() { const o = flashStore(); const now = Date.now(); return CP_FLASH.filter(f => !o[f.id] || o[f.id].due <= now); }
  function openCards() {
    const rv = cpRoot.querySelector(".cp-review");
    rv.hidden = false;
    renderFlashQueue(flashDue(), 0);
  }
  function renderFlashQueue(q, i) {
    const body = cpRoot.querySelector(".cp-rv-body");
    const cnt = cpRoot.querySelector(".cp-review .cnt");
    cnt.textContent = q.length ? (i + 1) + " / " + q.length : "";
    if (i >= q.length) {
      body.innerHTML = q.length
        ? '<div class="cp-rv-done">今日知识点卡复习完成 ✓</div>'
        : '<div class="cp-rv-empty">今天没有到期的知识点卡。学完一章点开「知识点卡」，按 忘记/困难/良好/容易 自评，算法会自动安排下次复习。</div>';
      return;
    }
    const f = q[i];
    body.innerHTML =
      '<div class="cp-rv-card">'
      + '<span class="cp-rv-tag" style="background:#8b5cf6;color:#fff">' + escHtml(f.ch) + '</span>'
      + '<div class="cp-rv-front"><b>' + escHtml(f.q) + '</b></div>'
      + '<button class="cp-rv-flip">显示答案</button>'
      + '<div class="cp-rv-back" hidden><pre style="white-space:pre-wrap">' + escHtml(f.a) + '</pre></div>'
      + '<div class="cp-rv-actions" hidden>'
      + '<button class="cp-rv-btn cp-rv-again" data-rating="0">忘记</button>'
      + '<button class="cp-rv-btn cp-rv-hard" data-rating="1">困难</button>'
      + '<button class="cp-rv-btn cp-rv-good" data-rating="2">良好</button>'
      + '<button class="cp-rv-btn cp-rv-easy" data-rating="3">容易</button>'
      + '</div></div>';
    body.querySelector(".cp-rv-flip").addEventListener("click", () => {
      body.querySelector(".cp-rv-back").hidden = false;
      body.querySelector(".cp-rv-actions").hidden = false;
    });
    body.querySelectorAll(".cp-rv-btn").forEach(b => b.addEventListener("click", () => {
      const o = flashStore();
      const c = o[f.id] || fsrsInit();
      fsrsSchedule(c, parseInt(b.dataset.rating, 10));
      o[f.id] = c;
      try { localStorage.setItem(CP_FLASH_KEY, JSON.stringify(o)); } catch(e){}
      renderFlashQueue(q, i + 1);
    }));
  }

  function openReview() {
    const rv = cpRoot.querySelector(".cp-review");
    rv.hidden = false;
    const deck = dueCards();
    renderReviewQueue(deck, 0);
  }
  function renderReviewQueue(deck, i) {
    const body = cpRoot.querySelector(".cp-rv-body");
    const cnt = cpRoot.querySelector(".cp-review .cnt");
    cnt.textContent = deck.length ? (i + 1) + " / " + deck.length : "";
    if (i >= deck.length) {
      body.innerHTML = deck.length
        ? '<div class="cp-rv-done">今日错题复习完成 ✓</div>'
        : '<div class="cp-rv-empty">错题本是空的。做题时点「错题本」把想复习的题加进来，到期会自动出现在这里。</div>';
      return;
    }
    const qid = deck[i];
    const q = QUESTIONS.find(x => x.id === qid);
    if (!q) { renderReviewQueue(deck, i + 1); return; }
    body.innerHTML =
      '<div class="cp-rv-card">'
      + '<span class="cp-rv-tag cp-tag-' + q.type + '">' + TYPE_NAME[q.type] + '</span>'
      + '<div class="cp-rv-front"><b>' + escHtml(q.title) + '</b>'
      + (q.desc ? '<div style="margin-top:8px;font-weight:400">' + q.desc + '</div>' : '')
      + (q.sampleIn ? '<div style="margin-top:8px;font-family:Consolas,monospace;font-size:12px">输入示例：' + escHtml(q.sampleIn) + '</div>' : '')
      + (q.sampleOut ? '<div style="margin-top:6px;font-family:Consolas,monospace;font-size:12px">预期输出：' + escHtml(q.sampleOut) + '</div>' : '')
      + '</div>'
      + '<button class="cp-rv-flip">显示答案</button>'
      + '<div class="cp-rv-back" hidden><b style="color:var(--ink,#0f172a)">参考答案：</b><pre>' + escHtml(q.ref) + '</pre>'
      + (q.hint ? '<div class="cp-rv-hint">' + q.hint + '</div>' : '') + '</div>'
      + '<div class="cp-rv-actions" hidden>'
      + '<button class="cp-rv-btn cp-rv-again" data-rating="0">重来</button>'
      + '<button class="cp-rv-btn cp-rv-hard" data-rating="1">困难</button>'
      + '<button class="cp-rv-btn cp-rv-good" data-rating="2">良好</button>'
      + '<button class="cp-rv-btn cp-rv-easy" data-rating="3">容易</button>'
      + '</div>'
      + '</div>';
    body.querySelector(".cp-rv-flip").addEventListener("click", () => {
      body.querySelector(".cp-rv-back").hidden = false;
      body.querySelector(".cp-rv-actions").hidden = false;
    });
    body.querySelectorAll(".cp-rv-btn").forEach(b => b.addEventListener("click", () => {
      scheduleCard(qid, parseInt(b.dataset.rating, 10));
      renderReviewQueue(deck, i + 1);
    }));
  }

  /* ---------------- 存储 ---------------- */
  const CP_KEY = "reader-app-cpractice:";
  function load(id) { try { return localStorage.getItem(CP_KEY + id); } catch (e) { return null; } }
  function save(id, code) { try { localStorage.setItem(CP_KEY + id, code); } catch (e) {} }

  /* ---------------- 编译内核加载 ---------------- */
  /* v57: 双源测速选优——Range 探测内核首块选最快源，失败自动切换，不干等单源超时 */
  function loadCompiler(forceDirect) {
    if (cpComp) return Promise.resolve(cpComp);
    if (cpLoading) return cpLoading;
    const loadEl = cpRoot.querySelector(".cp-load");
    const fill = cpRoot.querySelector(".cp-load .fill");
    loadEl.hidden = false;
    cpLoading = new Promise((resolve, reject) => {
      const base = document.currentScript && document.currentScript.getAttribute("data-base");
      const fallbackUrl = (base || ".") + "/vendor/c-runner/assets/";
      const CDN_URL = "https://cdn.jsdelivr.net/gh/lzm66691/lioli-reader@main/vendor/c-runner/assets/";
      const PAGES_URL = "https://lzm66691.github.io/lioli-reader/vendor/c-runner/assets/";
      const sources = forceDirect
        ? [{ label: "直连", url: fallbackUrl }]
        : [
            { label: "本地", url: "http://localhost:8926/assets/" },
            { label: "CDN", url: CDN_URL },
            { label: "Pages", url: PAGES_URL },
            { label: "直连", url: fallbackUrl }
          ];
      const script = document.createElement("script");
      script.src = (base || ".") + "/vendor/c-runner/clang-wasm.global.js";
      script.onload = async () => {
        try {
          if (!window.clangWasm) throw new Error("clangWasm 未加载");
          /* 双源测速：Range 取 clang.wasm.gz 首 1KB，4s 超时，选响应最快的源 */
          var best = null;
          if (!forceDirect) {
            var probeMs = 4000;
            var probes = sources.map(function (s) {
              return new Promise(function (res) {
                var t0 = Date.now();
                var ac = new AbortController();
                try {
                  fetch(s.url + "bin/clang.wasm.gz", { headers: { Range: "bytes=0-1023" }, signal: ac.signal })
                    .then(function (r) { res({ label: s.label, url: s.url, ms: Date.now() - t0, ok: r.ok || r.status === 206 }); })
                    .catch(function () { res({ label: s.label, url: s.url, ms: probeMs + 1, ok: false }); })
                    .finally(function () { try { ac.abort(); } catch (e) {} });
                } catch (e) { res({ label: s.label, url: s.url, ms: probeMs + 1, ok: false }); }
              });
            });
            var results = await Promise.race([
              Promise.all(probes),
              new Promise(function (res) { setTimeout(function () { res("timeout"); }, probeMs + 800); })
            ]);
            if (results !== "timeout") {
              var okOnes = results.filter(function (p) { return p.ok; }).sort(function (a, b) { return a.ms - b.ms; });
              if (okOnes.length) { best = okOnes[0]; }
              if (loadEl) loadEl.querySelector(".meta") && (loadEl.querySelector(".meta").textContent = "源测速: " + results.map(function(p){ return p.label + (p.ok ? " " + p.ms + "ms" : " ✗"); }).join(" | ") + (best ? " → 选 " + best.label : " → 全部不通，逐源直试"));
            }
          }
          var ordered = best ? [best].concat(sources.filter(function (s) { return s.label !== best.label; })) : sources;
          var lastErr = null, done = false;
          var withTimeout = function (promise, ms, label) {
            return Promise.race([promise, new Promise(function (_, rej) { setTimeout(function () { rej(new Error(label + "超时")); }, ms); })]);
          };
          for (var si = 0; si < ordered.length && !done; si++) {
            var src = ordered[si];
            var timeoutMs = (src.label === "直连" ? 600000 : 60000);
            for (var attempt = 1; attempt <= (src.label === "CDN" ? 2 : 1); attempt++) {
              try {
                cpComp = await withTimeout(window.clangWasm.createCompiler("c", {
                  baseUrl: new URL(src.url, location.href),
                  std: "gnu17",
                  onProgress: (p) => { if (fill) fill.style.width = Math.round(p * 100) + "%"; }
                }), timeoutMs, src.label + "下载");
                loadEl.hidden = true;
                done = true;
                resolve(cpComp);
                return;
              } catch (e) {
                lastErr = e;
                if (fill) fill.style.width = "0%";
                if (attempt < 2) { await new Promise((r) => setTimeout(r, 1200)); continue; }
                break;
              }
            }
          }
          loadEl.hidden = true;
          reject(lastErr || new Error("编译内核加载失败"));
        } catch (e) { loadEl.hidden = true; reject(e); }
      };
      script.onerror = () => { loadEl.hidden = true; reject(new Error("加载编译内核失败（网络/路径）")); };
      document.head.appendChild(script);
    });
    return cpLoading;
  }

  /* ---------------- 运行结果渲染 ---------------- */
  function renderRun(r) {
    const out = cpRoot.querySelector(".cp-out");
    const q = curQ();
    out.innerHTML = "";
    if (r.errors && r.errors.length) {
      out.innerHTML += '<div class="err">编译/运行错误（点行号跳到源码对应行）：</div>';
      for (const e of r.errors) {
        const ln = parseErrLine(e);
        const cell = document.createElement("div");
        cell.className = "err";
        cell.innerHTML = ln
          ? '<span class="errline" data-line="' + ln + '" title="点击跳到第 ' + ln + ' 行">L' + ln + '</span> ' + escHtml(String(e))
          : escHtml(String(e));
        out.appendChild(cell);
      }
      out.removeEventListener("click", cpErrDelegate);
      out.addEventListener("click", cpErrDelegate);
    } else {
      out.innerHTML += '<div class="ok">运行成功（exit ' + r.exitCode + '）</div>';
    }
    if (r.output) out.innerHTML += "<br>" + escHtml(r.output).replace(/\n/g, "<br>");
    out.innerHTML += '<div class="meta">' + (r.compileMs ? "编译 " + r.compileMs + "ms" : "") + (r.runMs ? " · 运行 " + r.runMs + "ms" : "") + '</div>';
    if (q.refOut && !(r.errors && r.errors.length)) {
      const got = (r.output || "").trim();
      const exp = q.refOut.trim();
      const ok = got === exp;
      out.innerHTML += '<div class="' + (ok ? "ok" : "err") + '">' + (ok ? "✓ 与参考答案输出一致" : "✗ 输出与参考答案不同（参考答案：" + escHtml(q.refOut) + "）") + '</div>';
    }
    out.scrollTop = 0;
  }

  /* ---------------- 运行 ---------------- */
  async function run() {
    const q = curQ();
    const isFree = (cpCur === "__free");
    if (!q && !isFree) return;
    const btn = cpRoot.querySelector(".cp-run");
    const out = cpRoot.querySelector(".cp-out");
    const ta = cpRoot.querySelector("textarea");
    const inp = cpRoot.querySelector(".cp-in");
    btn.disabled = true;
    btn.textContent = "编译中…";
    try {
      if (!cpComp) {
        if (isFree) {
          /* v59：自由模式无参考答案——引导下载内核真实编译 */
          out.innerHTML = '<div class="err">自由写代码需要真实编译内核（约 28MB）。点击下方按钮下载后即可运行：</div>'
            + '<button class="cp-dir-retry">⚡ 下载编译内核 · 真实编译</button>';
          var bF = out.querySelector(".cp-dir-retry");
          if (bF) bF.onclick = async function () {
            bF.disabled = true;
            bF.textContent = "下载内核中（约 20-30 秒，请稍候）…";
            try {
              btn.textContent = "运行中…";
              var c0 = await loadCompiler();
              var r0 = await c0.run(ta.value, inp.value || "");
              renderRun(r0);
            } catch (e0) {
              var w0 = e0 && e0.message ? e0.message : String(e0);
              out.innerHTML = '<div class="err">内核下载/编译失败：' + escHtml(w0) + '</div>'
                + '<div class="meta">可再次点击下方按钮重试，或刷新页面后重试。</div>'
                + '<button class="cp-dir-retry">🔄 重试下载内核</button>';
              var b1 = out.querySelector(".cp-dir-retry");
              if (b1) b1.onclick = arguments.callee;
            }
          };
          return;
        }
        /* v54: 内核未就绪 -> 直接模拟输出（0 等待），真实编译改按钮（不再等下载） */
        var q0 = curQ();
        if (q0 && q0.refOut) {
          out.innerHTML = '<div class="meta">⚠ 编译内核尚未就绪，已直接进入「模拟输出 · 参考答案对照」模式（0 等待）：</div>'
            + '<div class="ok">' + escHtml(q0.refOut).replace(/\n/g, "<br>") + '</div>'
            + '<div class="meta">以上为参考答案输出，并非本次真实运行结果。点下方按钮下载内核后用真实编译（约 20-30 秒，下完缓存，以后秒开）。</div>'
            + '<button class="cp-dir-retry">⚡ 下载编译内核 · 真实编译</button>';
          var b0 = out.querySelector(".cp-dir-retry");
          if (b0) b0.onclick = async function () {
            b0.disabled = true;
            b0.textContent = "下载内核中（约 20-30 秒，请稍候）…";
            try {
              btn.textContent = "编译中…";
              var c0 = await loadCompiler();
              btn.textContent = "运行中…";
              var r0 = await c0.run(ta.value, inp.value || "");
              renderRun(r0);
            } catch (e0) {
              var w0 = e0 && e0.message ? e0.message : String(e0);
              out.innerHTML = '<div class="err">内核下载/编译失败：' + escHtml(w0) + '</div>'
                + '<div class="meta">可再次点击下方按钮重试，或刷新页面后重试。</div>'
                + '<button class="cp-dir-retry">🔄 重试下载内核</button>';
              var b1 = out.querySelector(".cp-dir-retry");
              if (b1) b1.onclick = arguments.callee;
            }
          };
        } else {
          out.innerHTML = '<div class="err">编译内核未就绪且本题无参考答案，无法运行。</div>';
        }
        return;
      }
      const comp = cpComp;
      btn.textContent = "运行中…";
      const r = await comp.run(ta.value, inp.value || "");
      renderRun(r);
    } catch (e) {
      /* v53: 编译内核不可用 -> 模拟输出（参考答案对照）+ 直连重试按钮 */
      var qq = curQ();
      if (qq && qq.refOut) {
        var why = e && e.message ? e.message : String(e);
        out.innerHTML = '<div class="meta">⚠ 编译内核暂不可用（' + escHtml(why) + '，' + new Date().toLocaleTimeString() + '）——已进入「模拟输出 · 参考答案对照」模式：</div>'
          + '<div class="ok">' + escHtml(qq.refOut).replace(/\n/g, "<br>") + '</div>'
          + '<div class="meta">以上为参考答案输出，并非本次真实运行结果。网络恢复后刷新页面自动用真实编译；也可点下方按钮立即直连下载内核（首次约 10 分钟，下完缓存秒开）。</div>'
          + '<button class="cp-dir-retry">⚡ 使用直连下载重试真实编译</button>';
        var retryBtn = out.querySelector(".cp-dir-retry");
        if (retryBtn) retryBtn.onclick = async function () {
          retryBtn.disabled = true;
          retryBtn.textContent = "直连下载中（首次约 10 分钟，请勿关闭页面）…";
          try {
            btn.textContent = "编译中…";
            var c2 = await loadCompiler();
            btn.textContent = "运行中…";
            var r2 = await c2.run(ta.value, inp.value || "");
            renderRun(r2);
          } catch (e2) {
            out.innerHTML = '<div class="err">直连编译失败：' + escHtml(e2 && e2.message ? e2.message : String(e2)) + '</div>'
              + '<div class="meta">可刷新页面后重试，或继续使用上方参考答案对照。</div>';
          }
        };
      } else {
        var msg = e && e.message ? e.message : String(e);
        out.innerHTML = '<div class="err">运行失败：</div>' + escHtml(msg);
      }
    } finally {
      btn.disabled = false;
      btn.textContent = "▶ 运行";
    }
  }

  /* ---------------- 显示 / 隐藏 ---------------- */
  function show() {
    if (!cpRoot) buildPanel();
    if (!cpCur) { const first = QUESTIONS[0]; if (first) select(first.id); }
    cpRoot.hidden = false;
    // 保存展开状态
    try { localStorage.setItem("reader-app-cpractice-open", "1"); } catch (e) {}
  }
  function hide() {
    if (cpRoot) cpRoot.hidden = true;
    try { localStorage.setItem("reader-app-cpractice-open", "0"); } catch (e) {}
  }
  function toggle() {
    if (cpRoot && !cpRoot.hidden) hide(); else show();
  }

  // 暴露给阅读器
  window.initCPractice = function () { show(); };
  window.toggleCPractice = toggle;
})();

/* v84：习题区（高数/线代）——自评模式题库（题目 + 答案对照），题源：CAL-1 / LA-1 练习册 */
(function(){
  var SUBJECT_QUIZZES = {
    calc: [
      { q: "1. 映射 f:X→Y 的三要素是 ____、____、____。", a: "集合 X（定义域集）、集合 Y（陪域/到达域）、对应法则 f。" },
      { q: "2. 函数 y=f(x) 的定义域是指 ____ 的取值集合；值域是指 ____ 的集合。", a: "自变量 x（使表达式有意义的全体 x）；所有函数值 f(x) 组成。" },
      { q: "3. 反函数存在的条件是原函数为 ____；反函数的定义域等于原函数的 ____。", a: "双射（一一对应）；值域。" },
      { q: "4. 函数 f(x) 为奇函数的前提是定义域关于 ____ 对称，且对定义域内任意 x 满足 ____。", a: "原点；f(−x)=−f(x)。" },
      { q: "5. 反三角函数 arcsin x 的定义域是 ____，值域是 ____。", a: "[−1, 1]；[−π/2, π/2]。" }
    ],
    la: [
      { q: "1. 二阶行列式 |a b; c d| 的值等于 ____，其中 ad 所在的线叫 ____ 对角线，bc 所在的线叫 ____ 对角线。", a: "ad−bc；主；副。" },
      { q: "2. 行列式外面用的是 ____（符号），矩阵外面用的是小括号或 ____。行列式最终是一个 ____，矩阵是一张 ____。", a: "两条竖线；中括号；数；数表。" },
      { q: "3. 三阶行列式展开共有 ____ 项，其中 ____ 个正项、____ 个负项；每一项是 ____ 个数相乘。", a: "6；3；3；3。" },
      { q: "4. 元素 a₂₃ 表示位于第 ____ 行、第 ____ 列。", a: "2；3。" },
      { q: "5. 判断：|1 2; 3 4| 和 (1 2; 3 4) 是同一个东西，值都是 −2。", a: "错——竖线是行列式（值 −2），括号是矩阵（数表，没有值）。" }
    ]
  };
  var TITLES = { calc: "高数题库 · 映射与函数（CAL-1）", la: "线代题库 · 二阶三阶行列式（LA-1）" };
  window.openSubjectQuiz = function(subj){
    var data = SUBJECT_QUIZZES[subj]; if (!data) return;
    var m = document.createElement("div");
    m.style.cssText = "position:fixed;inset:0;z-index:99998;background:rgba(10,15,30,.96);backdrop-filter:blur(8px);overflow:auto;padding:24px 16px 60px;";
    var html = '<div style="max-width:760px;margin:0 auto"><div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><button id="sqBack" style="background:rgba(255,255,255,.1);border:none;color:#fff;padding:7px 14px;border-radius:8px;cursor:pointer;font-size:13px">← 返回</button><span style="font-size:16px;font-weight:700;color:#fff">' + (TITLES[subj] || "习题") + '</span><span style="font-size:12px;color:#94a3b8;margin-left:auto">自评模式：先做再看答案</span></div>';
    html += data.map(function(it){
      return '<div style="background:rgba(255,255,255,.05);border:1px solid rgba(148,163,184,.18);border-radius:12px;padding:14px 16px;margin-bottom:12px"><div style="color:#e8eaf2;font-size:13.5px;line-height:1.7;white-space:pre-wrap">' + it.q + '</div><button class="sqAns" style="margin-top:10px;background:rgba(77,107,254,.25);border:1px solid rgba(77,107,254,.5);color:#cfe0ff;padding:5px 12px;border-radius:8px;cursor:pointer;font-size:12px">显示答案</button><div class="sqA" style="display:none;margin-top:8px;color:#8ddc97;font-size:13px;line-height:1.7;white-space:pre-wrap;background:rgba(16,185,129,.08);border-radius:8px;padding:10px 12px">' + it.a + '</div></div>';
    }).join("");
    m.innerHTML = html + '</div>';
    m.querySelector("#sqBack").onclick = function(){ m.remove(); };
    m.addEventListener("click", function(e){
      if (e.target.classList && e.target.classList.contains("sqAns")) {
        var b = e.target.nextElementSibling;
        var show = b.style.display === "block";
        b.style.display = show ? "none" : "block";
        e.target.textContent = show ? "显示答案" : "收起答案";
      }
    });
    document.body.appendChild(m);
  };
})();

/* v86：知识图谱 v2 —— MOOC 式放射状网络图（圆形节点 + 连线 + 关系标签 + 点击展开动画 + 课件跳转） */
(function(){
  var GRAPH_STATS = { kp: 41, res: 48, rel: 41 };
  /* 节点：id/t(标题)/bk(课件书id，可跳转)/pg(页码)/tag(关系)/parent(父id)/c(子id数组)
     布局为放射状：根顶部居中 → 一级子横排 → 二级子纵向展开 */
  var NODES = {
    0:  { t: "高等数学（一）", x: 50, y: 6,  r: 1 },
    1:  { t: "函数极限与数列极限", bk: "cal2-讲义", pg: 1, parent: 0, x: 5,  y: 30, r: 1 },
    2:  { t: "极限计算方法", bk: "cal3-讲义", pg: 1, parent: 0, x: 17.5, y: 30, r: 1 },
    3:  { t: "连续性与间断点", bk: "cal4-讲义", pg: 1, parent: 0, x: 30, y: 30, r: 1 },
    4:  { t: "无穷小与无穷大", bk: "cal3-讲义", pg: 1, parent: 0, x: 42.5, y: 30, r: 1 },
    5:  { t: "映射与函数", bk: "cal1-讲义", pg: 1, parent: 0, x: 55, y: 30, r: 1 },
    6:  { t: "积分学基础", parent: 0, x: 67.5, y: 30, r: 1 },
    7:  { t: "数列与级数", parent: 0, x: 80, y: 30, r: 1 },
    8:  { t: "数学素质与历史", parent: 0, x: 92.5, y: 30, r: 1 },
    11: { t: "数列极限的定义", tag: "包含", parent: 1, x: 5,  y: 48 },
    12: { t: "函数极限的定义", tag: "包含", parent: 1, x: 5,  y: 58 },
    13: { t: "极限的性质", tag: "前置", parent: 1, x: 5,  y: 68 },
    14: { t: "极限存在准则", tag: "前置", parent: 1, x: 5,  y: 76 },
    21: { t: "两个重要极限", tag: "包含", parent: 2, x: 17.5, y: 48 },
    22: { t: "等价无穷小代换", tag: "前置", parent: 2, x: 17.5, y: 58 },
    23: { t: "洛必达法则", tag: "前置", parent: 2, x: 17.5, y: 68 },
    24: { t: "极限运算法则", tag: "前置", parent: 2, x: 17.5, y: 76 },
    31: { t: "连续性定义", tag: "包含", parent: 3, x: 30, y: 48 },
    32: { t: "间断点分类", tag: "包含", parent: 3, x: 30, y: 58 },
    33: { t: "闭区间连续函数性质", tag: "前置", parent: 3, x: 30, y: 68 },
    34: { t: "连续函数的运算", tag: "前置", parent: 3, x: 30, y: 76 },
    41: { t: "无穷小的比较", tag: "包含", parent: 4, x: 42.5, y: 48 },
    42: { t: "无穷大与渐近线", tag: "前置", parent: 4, x: 42.5, y: 58 },
    43: { t: "无穷小阶的应用", tag: "前置", parent: 4, x: 42.5, y: 68 },
    51: { t: "函数概念与性质", tag: "包含", parent: 5, x: 55, y: 48 },
    52: { t: "基本初等函数", tag: "包含", parent: 5, x: 55, y: 58 },
    53: { t: "复合函数与反函数", tag: "前置", parent: 5, x: 55, y: 68 },
    54: { t: "初等函数", tag: "前置", parent: 5, x: 55, y: 76 },
    61: { t: "不定积分概念与性质", tag: "包含", parent: 6, x: 67.5, y: 48 },
    62: { t: "换元积分法", tag: "包含", parent: 6, x: 67.5, y: 56 },
    63: { t: "分部积分法", tag: "包含", parent: 6, x: 67.5, y: 64 },
    64: { t: "定积分概念与性质", tag: "前置", parent: 6, x: 67.5, y: 72 },
    65: { t: "微积分基本定理", tag: "前置", parent: 6, x: 67.5, y: 80 },
    66: { t: "定积分的应用", tag: "前置", parent: 6, x: 67.5, y: 88 },
    71: { t: "常数项级数概念与性质", tag: "包含", parent: 7, x: 80, y: 48 },
    72: { t: "正项级数审敛", tag: "包含", parent: 7, x: 80, y: 58 },
    73: { t: "交错级数与绝对收敛", tag: "前置", parent: 7, x: 80, y: 68 },
    74: { t: "幂级数", tag: "前置", parent: 7, x: 80, y: 76 },
    75: { t: "傅里叶级数", tag: "前置", parent: 7, x: 80, y: 84 },
    81: { t: "数学思想方法", tag: "包含", parent: 8, x: 92.5, y: 48 },
    82: { t: "数学史与名家", tag: "包含", parent: 8, x: 92.5, y: 58 },
    83: { t: "数学建模初步", tag: "前置", parent: 8, x: 92.5, y: 68 }
  };
  var CHILDREN = { 1: [11,12,13,14], 2: [21,22,23,24], 3: [31,32,33,34], 4: [41,42,43], 5: [51,52,53,54], 6: [61,62,63,64,65,66], 7: [71,72,73,74,75], 8: [81,82,83] };
  var LV1 = [1,2,3,4,5,6,7,8];
  var TAG_COLOR = { "前置": "#f5b34c", "包含": "#57d9a0" };
  var COLORS = ["rgba(139,92,246,.5)", "rgba(77,107,254,.5)", "rgba(16,185,129,.5)", "rgba(245,158,11,.5)", "rgba(236,72,153,.5)", "rgba(59,130,246,.5)", "rgba(20,184,166,.5)", "rgba(168,85,247,.5)"];

  /* 大学物理（上）图谱：模块跳转已接入 lzu-大物上-1（第1-4章）/ lzu-大物上-2（第5-7章）课件 PDF */
  var PH_STATS = { kp: 32, res: 16, rel: 32 };
  var PH_NODES = {
    0:   { t: "大学物理（上）", x: 50, y: 6, r: 1 },
    101: { t: "质点运动学", bk: "lzu-大物上-1", pg: 1, parent: 0, x: 6.5, y: 30, r: 1 },
    102: { t: "牛顿运动定律", bk: "lzu-大物上-1", pg: 55, parent: 0, x: 19, y: 30, r: 1 },
    103: { t: "功与能量", bk: "lzu-大物上-1", pg: 117, parent: 0, x: 31.5, y: 30, r: 1 },
    104: { t: "动量守恒", bk: "lzu-大物上-1", pg: 181, parent: 0, x: 44, y: 30, r: 1 },
    105: { t: "角动量守恒", bk: "lzu-大物上-1", pg: 238, parent: 0, x: 56.5, y: 30, r: 1 },
    106: { t: "刚体力学", bk: "lzu-大物上-2", pg: 138, parent: 0, x: 69, y: 30, r: 1 },
    107: { t: "流体力学", bk: "lzu-大物上-2", pg: 210, parent: 0, x: 81.5, y: 30, r: 1 },
    108: { t: "振动与波动", bk: "lzu-大物上-2", pg: 240, parent: 0, x: 94, y: 30, r: 1 },
    1011: { t: "质点与参考系", tag: "包含", parent: 101, x: 6.5, y: 48 },
    1012: { t: "位移·速度·加速度", tag: "包含", parent: 101, x: 6.5, y: 58 },
    1013: { t: "曲线运动与圆周运动", tag: "前置", parent: 101, x: 6.5, y: 68 },
    1014: { t: "相对运动", tag: "前置", parent: 101, x: 6.5, y: 78 },
    1021: { t: "牛顿三定律", tag: "包含", parent: 102, x: 19, y: 48 },
    1022: { t: "惯性系与非惯性系", tag: "包含", parent: 102, x: 19, y: 58 },
    1023: { t: "惯性力", tag: "前置", parent: 102, x: 19, y: 68 },
    1024: { t: "牛顿定律的应用", tag: "前置", parent: 102, x: 19, y: 78 },
    1031: { t: "功与功率", tag: "包含", parent: 103, x: 31.5, y: 48 },
    1032: { t: "动能定理", tag: "包含", parent: 103, x: 31.5, y: 58 },
    1033: { t: "保守力与势能", tag: "前置", parent: 103, x: 31.5, y: 68 },
    1034: { t: "机械能守恒定律", tag: "前置", parent: 103, x: 31.5, y: 78 },
    1041: { t: "动量与冲量", tag: "包含", parent: 104, x: 44, y: 48 },
    1042: { t: "动量定理", tag: "包含", parent: 104, x: 44, y: 58 },
    1043: { t: "动量守恒定律", tag: "前置", parent: 104, x: 44, y: 68 },
    1044: { t: "碰撞", tag: "前置", parent: 104, x: 44, y: 78 },
    1051: { t: "角动量与力矩", tag: "包含", parent: 105, x: 56.5, y: 48 },
    1052: { t: "角动量定理", tag: "包含", parent: 105, x: 56.5, y: 58 },
    1053: { t: "角动量守恒定律", tag: "前置", parent: 105, x: 56.5, y: 68 },
    1054: { t: "质点在中心力场", tag: "前置", parent: 105, x: 56.5, y: 78 },
    1061: { t: "刚体运动学", tag: "包含", parent: 106, x: 69, y: 48 },
    1062: { t: "转动惯量", tag: "包含", parent: 106, x: 69, y: 58 },
    1063: { t: "转动定律", tag: "前置", parent: 106, x: 69, y: 68 },
    1064: { t: "刚体角动量守恒", tag: "前置", parent: 106, x: 69, y: 78 },
    1071: { t: "流体静力学", tag: "包含", parent: 107, x: 81.5, y: 48 },
    1072: { t: "伯努利方程", tag: "包含", parent: 107, x: 81.5, y: 58 },
    1073: { t: "黏性流体", tag: "前置", parent: 107, x: 81.5, y: 68 },
    1074: { t: "层流与湍流", tag: "前置", parent: 107, x: 81.5, y: 78 },
    1081: { t: "简谐运动", tag: "包含", parent: 108, x: 94, y: 48 },
    1082: { t: "振动合成", tag: "包含", parent: 108, x: 94, y: 58 },
    1083: { t: "机械波", tag: "前置", parent: 108, x: 94, y: 68 },
    1084: { t: "波的干涉与衍射", tag: "前置", parent: 108, x: 94, y: 78 }
  };
  var PH_CHILDREN = { 101: [1011,1012,1013,1014], 102: [1021,1022,1023,1024], 103: [1031,1032,1033,1034], 104: [1041,1042,1043,1044], 105: [1051,1052,1053,1054], 106: [1061,1062,1063,1064], 107: [1071,1072,1073,1074], 108: [1081,1082,1083,1084] };
  var PH_LV1 = [101,102,103,104,105,106,107,108];

  /* 线性代数图谱：跳转已接入 la1-la3 / lam1-lam12 讲义 */
  var LA_STATS = { kp: 21, res: 17, rel: 21 };
  var LA_NODES = {
    0:   { t: "线性代数", x: 50, y: 6, r: 1 },
    201: { t: "行列式", bk: "la1-讲义", pg: 1, parent: 0, x: 15, y: 30, r: 1 },
    202: { t: "矩阵及其运算", bk: "lam1-讲义", pg: 1, parent: 0, x: 38.5, y: 30, r: 1 },
    203: { t: "向量组的线性相关性", bk: "lam9", pg: 1, parent: 0, x: 62, y: 30, r: 1 },
    204: { t: "线性方程组", bk: "lam12", pg: 1, parent: 0, x: 85, y: 30, r: 1 },
    2011: { t: "二阶与三阶行列式", tag: "包含", bk: "la1-讲义", parent: 201, x: 15, y: 48 },
    2012: { t: "全排列与逆序数", tag: "包含", bk: "la2-讲义", parent: 201, x: 15, y: 58 },
    2013: { t: "n阶行列式的定义", tag: "前置", bk: "la2b-讲义", parent: 201, x: 15, y: 68 },
    2014: { t: "行列式的性质", tag: "前置", bk: "la3-讲义", parent: 201, x: 15, y: 78 },
    2021: { t: "矩阵定义与加减数乘", tag: "包含", bk: "lam1-讲义", parent: 202, x: 38.5, y: 48 },
    2022: { t: "矩阵乘法", tag: "包含", bk: "lam2-讲义", parent: 202, x: 38.5, y: 56 },
    2023: { t: "方阵的幂", tag: "包含", bk: "lam3-讲义", parent: 202, x: 38.5, y: 64 },
    2024: { t: "转置与方阵行列式", tag: "前置", bk: "lam4-讲义", parent: 202, x: 38.5, y: 72 },
    2025: { t: "伴随矩阵", tag: "前置", bk: "lam5-讲义", parent: 202, x: 38.5, y: 80 },
    2026: { t: "逆矩阵", tag: "前置", bk: "lam6-讲义", parent: 202, x: 38.5, y: 88 },
    2027: { t: "初等变换与求逆", tag: "前置", bk: "lam7", parent: 202, x: 38.5, y: 96 },
    2028: { t: "分块矩阵与矩阵的秩", tag: "前置", bk: "lam8", parent: 202, x: 38.5, y: 104 },
    2031: { t: "向量概念与线性表示", tag: "包含", bk: "lam9", parent: 203, x: 62, y: 48 },
    2032: { t: "线性相关与极大无关组", tag: "包含", bk: "lam10", parent: 203, x: 62, y: 58 },
    2033: { t: "向量组的秩", tag: "前置", bk: "lam11", parent: 203, x: 62, y: 68 },
    2041: { t: "线性方程组", tag: "包含", bk: "lam12", parent: 204, x: 85, y: 48 },
    2042: { t: "齐次与非齐次方程组", tag: "前置", bk: "lam12", parent: 204, x: 85, y: 58 }
  };
  var LA_CHILDREN = { 201: [2011,2012,2013,2014], 202: [2021,2022,2023,2024,2025,2026,2027,2028], 203: [2031,2032,2033], 204: [2041,2042] };
  var LA_LV1 = [201,202,203,204];

  /* C 语言图谱：跳转已接入 c-ch1/3/4/5/6/7/9/10/11/12 讲义（C Primer Plus 第6版 蓝本） */
  var C_STATS = { kp: 41, res: 10, rel: 41 };
  var C_NODES = {
    0:   { t: "C 语言", x: 50, y: 6, r: 1 },
    301: { t: "初识C与程序框架", bk: "c-ch1", pg: 1, parent: 0, x: 5, y: 30, r: 1 },
    302: { t: "数据和C", bk: "c-ch3", pg: 1, parent: 0, x: 15, y: 30, r: 1 },
    303: { t: "格式化输入输出", bk: "c-ch4", pg: 1, parent: 0, x: 25, y: 30, r: 1 },
    304: { t: "运算符与表达式", bk: "c-ch5", pg: 1, parent: 0, x: 35, y: 30, r: 1 },
    305: { t: "循环", bk: "c-ch6", pg: 1, parent: 0, x: 45, y: 30, r: 1 },
    306: { t: "分支与跳转", bk: "c-ch7", pg: 1, parent: 0, x: 55, y: 30, r: 1 },
    307: { t: "函数", bk: "c-ch9", pg: 1, parent: 0, x: 65, y: 30, r: 1 },
    308: { t: "数组和指针", bk: "c-ch10", pg: 1, parent: 0, x: 75, y: 30, r: 1 },
    309: { t: "字符串", bk: "c-ch11", pg: 1, parent: 0, x: 85, y: 30, r: 1 },
    310: { t: "存储与内存", bk: "c-ch12", pg: 1, parent: 0, x: 95, y: 30, r: 1 },
    3011: { t: "程序结构", tag: "包含", bk: "c-ch1", parent: 301, x: 5, y: 48 },
    3012: { t: "main 与头文件", tag: "包含", bk: "c-ch1", parent: 301, x: 5, y: 58 },
    3013: { t: "编译运行流程", tag: "前置", bk: "c-ch1", parent: 301, x: 5, y: 68 },
    3021: { t: "数据类型", tag: "包含", bk: "c-ch3", parent: 302, x: 15, y: 48 },
    3022: { t: "变量与常量", tag: "包含", bk: "c-ch3", parent: 302, x: 15, y: 58 },
    3023: { t: "整数与浮点", tag: "前置", bk: "c-ch3", parent: 302, x: 15, y: 68 },
    3031: { t: "printf 格式化输出", tag: "包含", bk: "c-ch4", parent: 303, x: 25, y: 48 },
    3032: { t: "scanf 输入", tag: "包含", bk: "c-ch4", parent: 303, x: 25, y: 58 },
    3033: { t: "字符与字符串", tag: "前置", bk: "c-ch4", parent: 303, x: 25, y: 68 },
    3041: { t: "算术运算符", tag: "包含", bk: "c-ch5", parent: 304, x: 35, y: 48 },
    3042: { t: "赋值与类型转换", tag: "包含", bk: "c-ch5", parent: 304, x: 35, y: 58 },
    3043: { t: "表达式求值", tag: "前置", bk: "c-ch5", parent: 304, x: 35, y: 68 },
    3051: { t: "while 循环", tag: "包含", bk: "c-ch6", parent: 305, x: 45, y: 48 },
    3052: { t: "for 循环", tag: "包含", bk: "c-ch6", parent: 305, x: 45, y: 58 },
    3053: { t: "do-while 与嵌套", tag: "前置", bk: "c-ch6", parent: 305, x: 45, y: 68 },
    3061: { t: "if-else", tag: "包含", bk: "c-ch7", parent: 306, x: 55, y: 48 },
    3062: { t: "switch", tag: "包含", bk: "c-ch7", parent: 306, x: 55, y: 58 },
    3063: { t: "break 与 continue", tag: "前置", bk: "c-ch7", parent: 306, x: 55, y: 68 },
    3071: { t: "函数定义与调用", tag: "包含", bk: "c-ch9", parent: 307, x: 65, y: 48 },
    3072: { t: "参数与返回值", tag: "包含", bk: "c-ch9", parent: 307, x: 65, y: 58 },
    3073: { t: "递归", tag: "前置", bk: "c-ch9", parent: 307, x: 65, y: 68 },
    3081: { t: "一维数组", tag: "包含", bk: "c-ch10", parent: 308, x: 75, y: 48 },
    3082: { t: "二维数组", tag: "包含", bk: "c-ch10", parent: 308, x: 75, y: 56 },
    3083: { t: "指针基础", tag: "前置", bk: "c-ch10", parent: 308, x: 75, y: 64 },
    3084: { t: "指针与数组", tag: "前置", bk: "c-ch10", parent: 308, x: 75, y: 72 },
    3091: { t: "字符串定义", tag: "包含", bk: "c-ch11", parent: 309, x: 85, y: 48 },
    3092: { t: "字符串函数", tag: "包含", bk: "c-ch11", parent: 309, x: 85, y: 58 },
    3093: { t: "字符串输入输出", tag: "前置", bk: "c-ch11", parent: 309, x: 85, y: 68 },
    3101: { t: "存储类别", tag: "包含", bk: "c-ch12", parent: 310, x: 95, y: 48 },
    3102: { t: "链接", tag: "包含", bk: "c-ch12", parent: 310, x: 95, y: 58 },
    3103: { t: "动态内存分配", tag: "前置", bk: "c-ch12", parent: 310, x: 95, y: 68 }
  };
  var C_CHILDREN = { 301: [3011,3012,3013], 302: [3021,3022,3023], 303: [3031,3032,3033], 304: [3041,3042,3043], 305: [3051,3052,3053], 306: [3061,3062,3063], 307: [3071,3072,3073], 308: [3081,3082,3083,3084], 309: [3091,3092,3093], 310: [3101,3102,3103] };
  var C_LV1 = [301,302,303,304,305,306,307,308,309,310];
  var CUR = { nodes: NODES, children: CHILDREN, lv1: LV1, stats: GRAPH_STATS, title: "知识图谱 · 高等数学（一）" };

  function esc3(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

  /* 发散型布局：根居中，一级均匀圆周分布，二级沿父节点方向扇形向外延伸（两层错开，避免重叠） */
  function layoutGraph(){
    var n1 = CUR.lv1.length;
    var R1 = n1 >= 9 ? 44 : n1 >= 6 ? 42 : 37;
    CUR.nodes[0].x = 50; CUR.nodes[0].y = 50;
    CUR.lv1.forEach(function(id, i){
      var a = -90 + i * (360 / n1);
      var rad = a * Math.PI / 180;
      var n = CUR.nodes[id];
      n.x = Math.round((50 + R1 * Math.cos(rad)) * 10) / 10;
      n.y = Math.round((50 + R1 * Math.sin(rad) * 0.92) * 10) / 10;
      var kids = CUR.children[id] || [];
      var span = Math.min(60, Math.max(10, (kids.length - 1) * 16));
      kids.forEach(function(k, j){
        var kn = CUR.nodes[k];
        var step = kids.length > 1 ? (2 * span) / (kids.length - 1) : 0;
        var ka = (a - span + j * step) * Math.PI / 180;
        var R2 = R1 + 12 + (j % 2) * 8;
        /* clamp 5-95：外散同时防斜下方二级冲过画布边缘 */
        kn.x = Math.round(Math.min(95, Math.max(5, (50 + R2 * Math.cos(ka)))) * 10) / 10;
        kn.y = Math.round(Math.min(95, Math.max(5, (50 + R2 * Math.sin(ka) * 0.92))) * 10) / 10;
      });
    });
  }

  function linkLine(n, isLv2, nid){
    var p = CUR.nodes[n.parent];
    var x1 = p.x, y1 = p.y + (p.r === 1 ? 8 : 7), x2 = n.x, y2 = n.y - 7;
    var midx = (x1 + x2) / 2, midy = (y1 + y2) / 2;
    var tag = n.tag ? '<span class="kgLTag" style="position:absolute;left:' + midx + '%;top:' + midy + '%;transform:translate(-50%,-50%);background:rgba(12,8,28,.9);color:' + TAG_COLOR[n.tag] + ';font-size:10px;padding:1px 7px;border-radius:20px;border:1px solid ' + TAG_COLOR[n.tag] + '44">' + esc3(n.tag) + '</span>' : "";
    return '<svg class="kgLine" style="position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;overflow:visible" data-from="' + n.parent + '" data-to="' + nid + '" data-lv2="' + (isLv2 ? 1 : 0) + '"><line x1="' + x1 + '%" y1="' + y1 + '%" x2="' + x2 + '%" y2="' + y2 + '%" stroke="rgba(139,92,246,.45)" stroke-width="1.6" stroke-dasharray="4 3"/></svg>' + tag;
  }

  function nodeCard(id){
    var n = CUR.nodes[id];
    var isRoot = id === 0;
    var isLv1 = !isRoot && !n.parent;
    var kids = CUR.children[id];
    var col = isRoot ? "rgba(168,85,247,.35)" : isLv1 ? COLORS[(id - 1) % 8] : "rgba(255,255,255,.08)";
    var w = isRoot ? 30 : isLv1 ? 16 : 9;
    var go = n.bk ? '<div class="kgGo" style="margin-top:6px;background:rgba(139,92,246,.3);border:1px solid rgba(168,85,247,.5);color:#d8b4fe;font-size:10.5px;padding:3px 9px;border-radius:14px;cursor:pointer;display:inline-block">跳转 ›</div>' : "";
    var dot = isRoot ? "" : '<div style="position:absolute;top:5px;right:5px;width:15px;height:15px;border-radius:50%;background:rgba(12,8,28,.85);color:#d8b4fe;font-size:8.5px;display:flex;align-items:center;justify-content:center;font-weight:700">' + id + '</div>';
    return '<div class="kgNode" data-id="' + id + '" data-open="0" style="position:absolute;left:' + n.x + '%;top:' + n.y + '%;transform:translate(-50%,-50%);width:' + w + '%;min-width:' + (isRoot ? 90 : isLv1 ? 78 : 66) + 'px;border-radius:20px;padding:' + (isRoot ? 13 : isLv1 ? 11 : 9) + 'px ' + (isRoot ? 8 : 5) + 'px;text-align:center;background:' + col + ';border:1.5px solid ' + (isRoot ? "rgba(216,180,254,.7)" : "rgba(148,163,184,.28)") + ';backdrop-filter:blur(6px);cursor:' + (kids ? "pointer" : "default") + ';box-shadow:0 6px 22px rgba(0,0,0,.35);transition:opacity .3s,transform .45s ease-out;z-index:2">' + dot + '<div style="font-size:' + (isRoot ? 14 : isLv1 ? 12 : 10.5) + 'px;font-weight:' + (isRoot || isLv1 ? 700 : 400) + ';color:' + (isRoot ? "#f0d9ff" : "#e8eaf2") + ';line-height:1.3">' + esc3(n.t) + '</div>' + go + (kids ? '<div class="kgAr" style="margin-top:5px;color:#94a3b8;font-size:10px;transition:transform .3s">▾ 展开</div>' : '') + '</div>';
  }

  window.openKnowledgeGraph = function(subject){
    subject = subject || "calc";
    if (subject === "phys") { CUR.nodes = PH_NODES; CUR.children = PH_CHILDREN; CUR.lv1 = PH_LV1; CUR.stats = PH_STATS; CUR.title = "知识图谱 · 大学物理（上）"; }
    else if (subject === "la") { CUR.nodes = LA_NODES; CUR.children = LA_CHILDREN; CUR.lv1 = LA_LV1; CUR.stats = LA_STATS; CUR.title = "知识图谱 · 线性代数"; }
    else if (subject === "c") { CUR.nodes = C_NODES; CUR.children = C_CHILDREN; CUR.lv1 = C_LV1; CUR.stats = C_STATS; CUR.title = "知识图谱 · C 语言"; }
    else { subject = "calc"; CUR.nodes = NODES; CUR.children = CHILDREN; CUR.lv1 = LV1; CUR.stats = GRAPH_STATS; CUR.title = "知识图谱 · 高等数学（一）"; }
    var old = document.getElementById("kgOverlay"); if (old) old.remove();
    var m = document.createElement("div");
    m.id = "kgOverlay";
    m.style.cssText = "position:fixed;inset:0;z-index:99997;background:rgba(12,8,28,.97);overflow:auto;padding:20px 14px 60px;";
    var html = '<div style="max-width:900px;margin:0 auto"><div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;flex-wrap:wrap"><button id="kgBack" style="background:rgba(255,255,255,.1);border:none;color:#fff;padding:7px 14px;border-radius:8px;cursor:pointer;font-size:13px">← 返回</button><span style="font-size:17px;font-weight:700;color:#e9d5ff">' + CUR.title + '</span></div>';
    html += '<div style="display:flex;gap:8px;margin:4px 0 8px;flex-wrap:wrap">' +
      '<button id="kgSubCalc" style="flex:1;min-width:130px;padding:8px 6px;border-radius:10px;cursor:pointer;font-size:12.5px;border:1px solid ' + (subject === "calc" ? "rgba(168,85,247,.8)" : "rgba(148,163,184,.25)") + ';background:' + (subject === "calc" ? "rgba(139,92,246,.25)" : "rgba(255,255,255,.04)") + ';color:' + (subject === "calc" ? "#e9d5ff" : "#94a3b8") + '">📐 高数</button>' +
      '<button id="kgSubPhys" style="flex:1;min-width:130px;padding:8px 6px;border-radius:10px;cursor:pointer;font-size:12.5px;border:1px solid ' + (subject === "phys" ? "rgba(16,185,129,.8)" : "rgba(148,163,184,.25)") + ';background:' + (subject === "phys" ? "rgba(16,185,129,.22)" : "rgba(255,255,255,.04)") + ';color:' + (subject === "phys" ? "#a7f3d0" : "#94a3b8") + '">⚛️ 大物</button>' +
      '<button id="kgSubLa" style="flex:1;min-width:130px;padding:8px 6px;border-radius:10px;cursor:pointer;font-size:12.5px;border:1px solid ' + (subject === "la" ? "rgba(245,158,11,.8)" : "rgba(148,163,184,.25)") + ';background:' + (subject === "la" ? "rgba(245,158,11,.2)" : "rgba(255,255,255,.04)") + ';color:' + (subject === "la" ? "#fde68a" : "#94a3b8") + '">🔢 线代</button>' +
      '<button id="kgSubC" style="flex:1;min-width:130px;padding:8px 6px;border-radius:10px;cursor:pointer;font-size:12.5px;border:1px solid ' + (subject === "c" ? "rgba(236,72,153,.8)" : "rgba(148,163,184,.25)") + ';background:' + (subject === "c" ? "rgba(236,72,153,.2)" : "rgba(255,255,255,.04)") + ';color:' + (subject === "c" ? "#fbcfe8" : "#94a3b8") + '">⌨️ C语言</button></div>';
    html += '<div style="display:flex;gap:10px;margin:6px 0 14px">' +
      '<div style="flex:1;text-align:center;background:rgba(139,92,246,.14);border:1px solid rgba(139,92,246,.3);border-radius:12px;padding:8px 4px"><div style="font-size:18px;font-weight:800;color:#d8b4fe">' + CUR.stats.kp + '</div><div style="font-size:11px;color:#94a3b8">知识点</div></div>' +
      '<div style="flex:1;text-align:center;background:rgba(77,107,254,.14);border:1px solid rgba(77,107,254,.3);border-radius:12px;padding:8px 4px"><div style="font-size:18px;font-weight:800;color:#a5b8ff">' + CUR.stats.res + '</div><div style="font-size:11px;color:#94a3b8">教学资源</div></div>' +
      '<div style="flex:1;text-align:center;background:rgba(16,185,129,.14);border:1px solid rgba(16,185,129,.3);border-radius:12px;padding:8px 4px"><div style="font-size:18px;font-weight:800;color:#86efac">' + CUR.stats.rel + '</div><div style="font-size:11px;color:#94a3b8">知识关系</div></div></div>';
    html += '<div style="font-size:11.5px;color:#94a3b8;margin-bottom:8px">点击模块节点展开子知识点（虚线=关联 · 橙色=前置 · 绿色=包含）· 点击「跳转课件」直达对应讲义</div>';
    html += '<div id="kgZoomBar" style="display:flex;gap:8px;align-items:center;justify-content:center;margin:6px 0 4px">' +
      '<button id="kgZmOut" style="width:34px;height:30px;border-radius:8px;border:1px solid rgba(148,163,184,.3);background:rgba(255,255,255,.06);color:#e8eaf2;font-size:16px;cursor:pointer">−</button>' +
      '<span id="kgZmVal" style="min-width:52px;text-align:center;font-size:12px;color:#cbd5e1">100%</span>' +
      '<button id="kgZmIn" style="width:34px;height:30px;border-radius:8px;border:1px solid rgba(148,163,184,.3);background:rgba(255,255,255,.06);color:#e8eaf2;font-size:16px;cursor:pointer">＋</button>' +
      '<button id="kgZmFit" style="height:30px;padding:0 12px;border-radius:8px;border:1px solid rgba(139,92,246,.5);background:rgba(139,92,246,.18);color:#d8b4fe;font-size:12px;cursor:pointer">适应</button></div>';
    html += '<div id="kgZoomWrap" style="transform-origin:50% 0;transition:transform .2s ease-out">';
    html += '<div id="kgCanvas" style="position:relative;width:100%;height:auto">';
    layoutGraph();
    html += nodeCard(0);
    CUR.lv1.forEach(function(i){
      html += linkLine(CUR.nodes[i], false, i);
      html += nodeCard(i);
      (CUR.children[i] || []).forEach(function(k){ html += linkLine(CUR.nodes[k], true, k); html += nodeCard(k); });
    });
    html += '</div></div></div>';
    m.innerHTML = html;
    /* 图谱缩放：按钮 + 双指捏合（可收放自如） */
    var zw = m.querySelector("#kgZoomWrap");
    var _zs = 1;
    function _zoom(){
      zw.style.transform = "scale(" + _zs + ")";
      var zv = m.querySelector("#kgZmVal"); if (zv) zv.textContent = Math.round(_zs * 100) + "%";
    }
    var zIn = m.querySelector("#kgZmIn"), zOut = m.querySelector("#kgZmOut"), zFit = m.querySelector("#kgZmFit");
    if (zIn) zIn.onclick = function(){ _zs = Math.min(2, Math.round((_zs + 0.25) * 100) / 100); _zoom(); };
    if (zOut) zOut.onclick = function(){ _zs = Math.max(0.4, Math.round((_zs - 0.25) * 100) / 100); _zoom(); };
    if (zFit) zFit.onclick = function(){ _zs = 1; _zoom(); };
    var _pd = 0;
    m.addEventListener("touchstart", function(e){ if (e.touches.length === 2) { _pd = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); } }, {passive:true});
    m.addEventListener("touchmove", function(e){ if (e.touches.length === 2 && _pd) { var d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); _zs = Math.max(0.4, Math.min(2, Math.round(_zs * (d / _pd) * 100) / 100)); _pd = d; _zoom(); } }, {passive:true});
    m.addEventListener("touchend", function(){ _pd = 0; });
    /* 初始隐藏全部二级节点与连线 */
    var cvs = m.querySelector("#kgCanvas");
    /* 屏幕自适应：画布高度随视口动态计算（窄屏/平板自动变矮，宽屏保持舒展） */
    cvs.style.height = Math.max(720, Math.round(window.innerHeight * 0.85)) + 'px';
    Array.prototype.slice.call(cvs.querySelectorAll('.kgNode')).forEach(function(x){
      var idn = parseInt(x.getAttribute("data-id"), 10);
      if (idn !== 0 && CUR.lv1.indexOf(idn) < 0) { x.style.display = "none"; }
    });
    Array.prototype.slice.call(cvs.querySelectorAll('.kgLine[data-lv2="1"]')).forEach(function(x){ x.style.display = "none"; });
    m.querySelector("#kgBack").onclick = function(){ m.remove(); };
    var sc = m.querySelector("#kgSubCalc"); if (sc) sc.onclick = function(){ window.openKnowledgeGraph("calc"); };
    var sp = m.querySelector("#kgSubPhys"); if (sp) sp.onclick = function(){ window.openKnowledgeGraph("phys"); };
    var sla = m.querySelector("#kgSubLa"); if (sla) sla.onclick = function(){ window.openKnowledgeGraph("la"); };
    var sc2 = m.querySelector("#kgSubC"); if (sc2) sc2.onclick = function(){ window.openKnowledgeGraph("c"); };
    m.addEventListener("click", function(e){
      var tar = e.target && e.target.nodeType === 3 ? e.target.parentNode : e.target;
      var go = tar && tar.closest ? tar.closest(".kgGo") : null;
      if (go) {
        var nd = go.closest(".kgNode");
        var n = CUR.nodes[nd.getAttribute("data-id")];
        if (n && n.bk) {
          if (window.switchBook) { try { window.switchBook(n.bk, n.pg || 1); } catch(err){ alert("跳转失败：" + n.t); } }
          else alert("课件跳转暂不可用（需先打开一本书）");
        }
        return;
      }
      var nd2 = tar && tar.closest ? tar.closest(".kgNode") : null;
      if (!nd2) return;
      var id = nd2.getAttribute("data-id");
      var kids = CUR.children[id];
      if (!kids) return;
      var open = nd2.getAttribute("data-open") === "1";
      nd2.setAttribute("data-open", open ? "0" : "1");
      var ar = nd2.querySelector(".kgAr"); if (ar) ar.textContent = open ? "▾ 展开" : "▴ 收起";
      var canvas = document.getElementById("kgCanvas");
      var pw = canvas.clientWidth || 900, ph = canvas.clientHeight || 920;
      var pn = CUR.nodes[id];
      for (var ki = 0; ki < kids.length; ki++) {
        (function(k, dly){
          var card = canvas.querySelector('.kgNode[data-id="' + k + '"]');
          var line = canvas.querySelector('.kgLine[data-to="' + k + '"]');
          if (!card) return;
          var kn = CUR.nodes[k];
          var fx = (kn.x - pn.x) * pw / 100, fy = (kn.y - pn.y) * ph / 100;
          if (open) {
            setTimeout(function(){
              card.style.transform = "translate(calc(-50% + " + fx + "px), calc(-50% + " + fy + "px)) scale(0.3)";
              card.style.opacity = "0";
              if (line) { line.style.opacity = "0"; }
              setTimeout(function(){ card.style.display = "none"; if (line) line.style.display = "none"; }, 300);
            }, dly);
          } else {
            card.style.display = "";
            card.style.transform = "translate(calc(-50% + " + fx + "px), calc(-50% + " + fy + "px)) scale(0.3)";
            card.style.opacity = "0";
            if (line) { line.style.display = ""; line.style.opacity = "0"; }
            setTimeout(function(){
              card.style.transform = "translate(-50%,-50%) scale(1)";
              card.style.opacity = "1";
              if (line) line.style.opacity = "1";
            }, 20 + dly);
          }
        })(kids[ki], ki * 60);
      }
    });
    document.body.appendChild(m);
  };
  var _tg = document.getElementById("tabGraph");
  if (_tg) _tg.addEventListener("click", function(){ if (window.openKnowledgeGraph) window.openKnowledgeGraph(); });
})();
