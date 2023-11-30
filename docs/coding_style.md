# 代码风格和规范

## PEP 8 规范

Python 的编码风格广泛遵循一种名为 PEP 8 的风格指南。PEP 8，即 [Python Enhancement Proposal 8](https://peps.python.org/pep-0008/)，是一个官方文档，描述了 Python 代码的编写约定，目的是提高 Python 代码的可读性和一致性。

这个规范非常详尽，条目繁多，这里提取一些最主要的指导原则：

### 缩进
使用 4 个空格进行缩进，不建议使用制表符（Tab）。
每级缩进应为 4 个空格。
### 行宽
每行代码建议不超过 79 个字符，这样有利于在小屏幕上查看，也便于并排放置多个文件。
对于长的表达式，应适当换行，并保持逻辑上的连贯。
### 空行
顶层定义之间空两行，如类定义。
方法定义之间空一行。
在函数中使用空行来区分逻辑段落。
### 导入
导入语句应该分行书写。
导入顺序：标准库导入、相关第三方导入、本地应用/库特定导入，每一组之间用空行分隔。
### 表达式和语句中的空格
赋值（=）、比较（==, !=, <, >, <=, >=）、算术运算符（+, -, *, /, //, % 等）的两侧应各添加一个空格。
函数参数列表、索引或切片的括号内侧不应有空格。
### 注释
注释应当与其描述的代码同等缩进。
注释应该是完整的句子。
如果注释是短语或句子，其首字母应大写，除非是以代码内的标识符（即代码内变量等）开始。
### 命名约定
类名通常使用 CamelCase 风格。
函数名和变量名通常使用 snake_case 风格。
常量通常使用 UPPER_CASE 风格。

## The Zen of Python

运行如下代码：

```python
import this
```

就会看到它的输出是一首诗：

```
The Zen of Python, by Tim Peters

Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than *right* now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of those!
```

这段文字是《Python 之禅》，由 Tim Peters 所著。《Python 之禅》包含了许多对 Python 编程风格和哲学的深刻见解，强调了简洁、可读性和明确性的重要性。其中文翻译大致如下：

优美胜于丑陋。
显式胜于隐式。
简单胜于复杂。
复杂胜于凌乱。
扁平胜于嵌套。
稀疏胜于密集。
可读性很重要。
即便特例，也不可违背这些规则。
不过实用性胜过纯洁性。
错误不应被默默忽略。
除非它明确需要如此。
面对不确定性，拒绝妄加猜测。
应该有一种——最好只有一种——显而易见的解决方法。
尽管这种方法一开始可能并不明显，除非你是荷兰人。
做比不做好。
但不假思索就行动还不如不做。
如果实现难以解释，那它是个坏主意。
如果实现易于解释，那它可能是个好主意。
命名空间是个绝妙的主意——让我们多加利用！



