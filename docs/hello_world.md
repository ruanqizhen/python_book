# 第一个 Python 程序

## 欢迎进入编程世界！

这是编程语言书籍的一个传统，第一句话永远是上面这句问候。而第一个编写的程序就是打印出“Hello World!”这句话。我们也沿用这一传统，从 Hello World 开始。

### 在 Python 解释器中编写

如果不使用任何 IDE，那么可以打开计算机的命令行终端，然后输入 `python` 并回车，启动 Python 解释器。读者现在应该看到 >>> 这样的提示符，表示 Python 解释器已经准备好接受命令了。

在 >>> 提示符后，输入以下代码：

```python
print("Hello, World!")
```

然后回车。

读者应该看到输出为：

```
Hello, World!
```

恭喜！你刚刚编写并运行了你的第一个 Python 程序。

### 使用集成开发环境（IDE）

如果使用的是前文介绍过的任何一种集成开发环境编写程序，总是需要先创建一个文件来保存程序的。把下面这行文字复制到新建的文件里：

```python
print("Hello, World!")
```

然后保存从任何名为 *.py 的文件。在点击 IDE 上的运行按钮，就可以运行程序了。

### 运行一个 .py 文件

对于任何已经保存好的 .py 文件，我们在 IDE 中打开他们运行。也可以在命令行中端里运行它们。比如我们有一个名为“welcome.py”的文件，其内容是如下代码：

```python
name = input("What's your name? ")
print(f"Hello, {name}! Welcome to the world of Python!")
```

打开命令行或终端，导航到 welcome.py 文件所在的目录。输入以下命令并回车：

```sh
python welcome.py
```

当程序提示输入名字时，输入你的名字并回车。

现在应该看到一个类似 `Hello, [你的名字]! Welcome to the world of Python!` 的消息了。

## Python 的语法

Python 以其简洁明了的语法而著称。我们下面简要介绍一下 Python 的语法，主要是方便已有其它编程语言经验的读者快速熟悉 Python 的特点。对于没有经验的读者，如果觉得介绍的太过笼统，也不要紧，后文还会对它们做详细解析。

和大多数主流编程语言一样，Python 由一行一行的“语句”组成。比如下面的程序：

```python
print("Hello, World!")
```

在这一行语句中，“print”是一个函数的名字。如果读者没有接触过其它编程语言，可以把这里的函数想象成类似数学函数的概念，在函数名后面的括号中传入一个变量数据，函数就会产生相应的结果。在这里，输入的数据是一串字符“Hello, World!”。Python 语言中，双引号中间的内容表示字符串。“print”的运行结果是把输入的字符串打印在屏幕上。

如果运行：

```python
print(1+2)
```

这时候 print 函数的输入变成了一个数值运算表达式。Python 会首先计算这个表达式的值，然后再打印出结果“3”。

如果程序有多行代码，比如：

```python
name = input("What's your name? ")
print(f"Hello, {name}! Welcome to the world of Python!")
```

那么程序一般会按照从上到下的顺序逐句运行。
