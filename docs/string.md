# 字符串

:::tip
字符串和[列表](list)的处理通常离不开[循环](loop)、[条件](condition)等结构。虽然本书为了集中讲解相关内容，首先介绍了字符串和列表的各种操作方法，但对于初学者来说，更好的学习方式可能是先大致了解一下字符串和列表是什么样的数据。等到学习了循环结构后，再回头来学习这两种数据的复杂操作方法，会更容易理解。
:::

Python 中的字符串（string）是一系列字符的有序集合，可以包括字母、数字、标点符号和其他特殊字符。字符串是一个不可变的序列数据类型。

## 创建字符串

在 Python 中，较短的字符串，可以使用单引号 `' '`、双引号 `" "` 来表示。跨越多行的长字符串，可以使用三引号 `''' '''` 或 `""" """` 来表示。例如：

```python
string1 = 'Hello, World!'
string2 = "Hello, World!"
string3 = '''Hello
World!'''                  # 这是一个多行字符串
string4 = """Another
multi-line
string."""
```

三引号包裹的大段文字也经常被用来作为程序的注释，这样就不需要在每行的注释前面都加上一个井号了，相当于 C、Java 等语言中的 `/*  */` 注释符号。

一个小技巧是，如果需要创建的字符串中包含双引号，那么就用单引号来表示它；反之，如果需要创建的字符串中包含单引号，那么就用单引号来表示它，例如：

```python
"""
这就是一段注释，程序逻辑并不会用到这里的文字。
下面的语句可以打印出带双引号的文字：
"""
print('小明说： "这不是我干的！"')
print("I'm a student.")
```

如果要创建的字符串单双引号都需要使用，那么可以使用三引号。如果要创建的字符串中这些都要用到，那么就只能用[转义符](string#转义字符)了。

## 字符串操作

最常用的字符串操作包括拼接、截断等。

### 拼接

连接两个字符串可以使用 + 运算符：

```python
greeting = "Hello, " + "World!"  # 结果："Hello, World!"
```

如果重复一段文字，可以使用 * 运算符：

```python
repeated = "abc" * 3  # 结果："abcabcabc"
```

### 索引

索引（index）操作用于把字符串中的某个字符提取出来。索引的表示方法是：在需要被索引的字符串或变量后面，加一个方括号，方括号内包含一个整数，这个整数表示从字符串开头算起的字符位置（从 0 开始计数）。如果是非负整数，表示从左向右数，最前面字符的索引是 0。如果索引是负数，表示从右向左数，最右边字符的索引是 -1。 索引若超出字符串的长度，程序会报错。比如：

```python
greeting = "Hello, World!"
print(greeting[0])        # 输出："H"
print(greeting[-1])       # 输出："!"
print(greeting[20])       # 程序报错

chinese = "我在学习 Python"
print(chinese[1])        # 输出："在"
```

Python 3 比很多其它语言做得好的一点是，它的字符串默认采用了 unicode 编码。这意味着字符串中每个中文字，也是一个字符，占用一个索引单位。也就不用担心在处理不同语言时会有不一样的索引机制了。不像有些语言，比如 C 语言，不小心可能会索引到半个中文字符的数据。

因为字符串是一个不可变的序列数据类型。试图改变字符串中的字符，程序会报错，比如运行下面的程序：

```python
greeting = "Hello, " + "World!"
greeting[0] = "W"         # 程序报错
```

### 切片

索引只会取一个字符，我们也可以从字符串中选取一串子字符串，这样的操作被称为切片（slice）。切片使用方括号和冒号获取字符串的子串。方括号中的冒号两边可以指定两个数字，第一个数字是子串开始的位置，第二个数字是子串结束的位置。但需要注意的是，这两个位置，第一个是包含的，第二个是不包含的，也就是选取到结束位置之前的那个字母。

切片使用的这两个数字可以省略：如果左侧数字省略，表示从源字符串的最左端开始截取；如果右侧数字省略，表示截取至源字符串的最右端。

```python
greeting = "Hello, World!"
print(greeting[1:5])        # 输出："ello"
print(greeting[7:-1])       # 输出："World"
print(greeting[7:])         # 输出："World!"
print(greeting[:])          # 输出："Hello, World!"
```

### 字符串长度

使用函数 len() 可以获取字符串的长度，比如：

```python
greeting = "Hello, World!"
length = len(greeting)    # 结果：13
```

## 字符串的方法

Python 的字符串数据是一种对象（object）。后文在讲解[面向对象编程](oop)的时候会详细介绍对象的概念。这里，可以先简单地把它理解为：对象不但包含数据的值，还包含了一些数据的属性和操作方法。这些方法可以对数据进行某种处理，比如可以把数据中的字符全部转换为大写等。Python 中的各种数据本身都是对象，都会有一些操作方法。比如使用整数的 bit_length() 方法可以得到这个整数的二进制位数等。在 Python 中可以使用内置的 dir() 函数列出一个对象所有的属性和方法：

```python
print(dir(""))
```

对比函数和方法：
- **函数（Function）：** 函数是一段独立的代码块，它可以接收输入（称为参数），执行特定的操作，并可能返回一个值。
- **方法（Method）：** 方法是附加在类或对象上的函数。在面向对象编程中，方法通常用于操作或与对象的内部数据进行交互。方法就是函数在某些特定语境下的另一种名称。

整数的方法可能不那么常用，但是字符串的一些方法还是非常常用的，比如：

* str.upper(): 将所有字符转换为大写。
* str.lower(): 将所有字符转换为小写。
* str.startswith(prefix): 检查字符串是否以特定前缀开始。
* str.endswith(suffix): 检查字符串是否以特定后缀结束。
* str.find(sub): 返回子字符串首次出现的索引，如果未找到则返回-1。
* str.replace(old, new): 将所有出现的旧子字符串替换为新子字符串。
* str.split(delimiter): 根据指定的分隔符分割字符串。
* str.join(iterable): 使用字符串作为分隔符连接可迭代对象中的字符串。

对象的方法，在使用上，与操作数据的函数的主要区别在于，函数操作一个数据的时候，是把数据作为参数，放在函数名后面的括号中使用，比如 `len(greeting)`；数据对象的方法也是个函数，但是在调用它的时候，先要把表示数据对象的变量写在前面，然后加一个点，在把方法函数写在点后面，比如 `greeting.upper()`。


下面是一些使用字符串些方法的示例：

```python
greeting = "Hello, World!"

# 使用 str.upper() 将所有字符转换为大写
upper_string = greeting.upper()
print(upper_string)          # 输出: "HELLO, WORLD!"

# 使用 str.lower() 将所有字符转换为小写
lower_string = greeting.lower()
print(lower_string)          # 输出: "hello, world!"

# 使用 str.startswith() 检查字符串是否以特定前缀开始
prefix = "Hello"
is_start_with_prefix = greeting.startswith(prefix)
print(is_start_with_prefix)  # 输出: True

# 使用 str.endswith() 检查字符串是否以特定后缀结束
suffix = "World!"
is_end_with_suffix = greeting.endswith(suffix)
print(is_end_with_suffix)    # 输出: True

# 使用 str.find() 返回子字符串首次出现的索引
sub_string = "World"
index = greeting.find(sub_string)
print(index)                 # 输出: 7

# 如果子字符串不存在，会返回-1
sub_string = "Java"
index = greeting.find(sub_string)
print(index)                 # 输出: -1

# 使用 str.replace() 将所有出现的旧子字符串替换为新子字符串
replaced_string = greeting.replace("World", "Python")
print(replaced_string)       # 输出: "Hello, Python!"

# 使用 str.split() 根据指定的分隔符分割字符串
delimiter = ", "  # 使用逗号加空格分割
split_strings = greeting.split(delimiter)
print(split_strings)         # 输出: ['Hello', 'World!']

# 使用 str.join() 使用字符串作为分隔符连接可迭代对象中的字符串
words = ["Hello", "Python"]
delimiter = ", "
joined_string = delimiter.join(words)
print(joined_string)         # 输出: "Hello, Python"
```

## 转义字符

一些特殊的字符是无法直接在键盘上输入的，可能也无法直接在屏幕上显示出来。对于这些特殊字符，Python 通过“转义”（escape）来表示它们。转义是使用反斜杠 `\`  开始的字符序列，它代表一个特定的字符或字符序列。

以下是 Python 中常用的转义序列：

* `\\`： 代表一个反斜杠字符 `\`。
* `\'`： 代表一个单引号字符 `'`。
* `\"`： 代表一个双引号字符 `"`。
* `\n`： 代表一个换行符。
* `\t`： 代表一个制表符，即 Tab 键。
* `\r`： 代表一个回车符。
* `\b`： 代表一个退格符。
* `\f`： 代表一个换页符。
* `\ooo`： 表示一个八进制数代表的字符，ooo 是三位八进制数。
* `\xhh`： 表示一个十六进制数代表的字符，hh 是两位十六进制数。

例如：

```python
print("He said, \"Hello, World!\"")  # 输出: He said, "Hello, World!"
print('It\'s a nice day!')           # 输出: It's a nice day!
print("Hello\nWorld!")               # 输出: Hello
                                     # World!       （输出过程中换行了）
print("Hello\tWorld!")               # 输出: Hello   World!
print("\\ 是个反斜杠")                  # 输出: \ 是个反斜杠
```

如果不想让反斜杠起到转义作用，可以使用原始字符串。在字符串前加上 r 或 R，使其成为原始字符串，这样就不会对字符串中的 `\` 进行转义。

例如：

```python
print(r"Hello\nWorld")  # 输出: Hello\nWorld
```

这种情况在表示文件路径时特别有用，例如 `r"C:\path\to\directory"`，这样就不需要每个反斜杠都进行转义了。


## 字符串格式化

字符串格式化是将特定的值插入到字符串的某些位置的过程。Python 提供了多种方式来格式化字符串。早期 Python 使用 `%` 运算符进行格式化，后来又出现了 str.format() 方法。不过这两种方法都已经过时了，我们就不做介绍了。目前 Python 推荐的字符串格式化方法是使用 f-string。

f-strings 使用前缀 f 来定义字符串，然后在字符串中的花括号 `{}` 内直接包含 Python 表达式。在显示字符串的时候，Python 会计算花括号 `{}` 内表达式的值，直接把这个值作为字符串的一部分显示出来。比如，把变量值嵌入字符串：

```python
name = "老王"
age = 60
print(f"我是{name}，我今年 {age} 了。")
# 输出： 我是老王，我今年 60 了。
```

f-strings 允许执行简单的表达式，甚至函数调用：

```python
name = "老王"
age = 60
print(f"我是{name}，我五年后是 {age + 5} 岁。")
# 输出： 我是老王，我五年后是 65 岁。
```

如果只是把单个的其它类型数据转换成字符串，也可以不用 f-strings，而是使用 str() 函数，比如：

```python
print(str(123))         # 输出: '123'
print(str(123.456))     # 输出: '123.456'
print(str([1, 2, 3]))   # 输出: '[1, 2, 3]'
print(str((1, 2, 3)))   # 输出: '(1, 2, 3)'
print(str(True))        # 输出: 'True'
```

#### 小数的格式代码
如果要格式化小数，可以在大括号中添加格式说明符来控制小数的显示方式。格式说明符通常遵循 `{变量名:格式代码}` 的形式。

例如，如果想要格式化一个浮点数，并且希望它显示为小数点后两位，你可以这样做：

```python
number = 123.456
formatted_number = f"{number:.2f}"
print(formatted_number)  # 输出: 123.46
```

在这个例子中，`.2f` 是一个格式说明符，它表示将数字格式化为浮点数，并保留两位小数。`.2` 指定了小数点后的位数，而 `f` 表示浮点数格式。

除了控制小数点后的位数，f-string 还允许进行各种其他类型的格式化，例如填充、对齐、百分比格式等。例如：

- 使用百分比格式：
  ```python
  percentage = 0.1234
  formatted_percentage = f"{percentage:.2%}"
  print(formatted_percentage)          # 输出: 12.34%
  ```

- 指定宽度和对齐方式，小数表示：
  ```python
  number = 123.456
  formatted_number = f"{number:10.2f}"
  print(formatted_number)              # 输出:     123.46
  ```
  这里 `10.2f` 表示总宽度为 10 个字符，其中小数点后有两位，右对齐。

- 指定宽度和对齐方式，科学记数法表示：
  ```python
  number = 123.456
  formatted_number = f"{number:10.2}"  # 没有 f
  print(formatted_number)              # 输出:   1.2e+02
  ```
  这里 `10.2` 表示总宽度为 10 个字符，其中小数点后有一位，右对齐。

## 字节序列

### 表示方法

字节序列类型（bytes，有时候就简称为“字节”）与字符串看上去非常类似，它在代码中通过在字符串字前加一个字母 b 前缀来表示。

```python
s = "Hello, World!"               # 这是字符串
print(s)

byte_sequence = b'Hello, World!'  # 这是字节序列，而非字符串
print(byte_sequence)              # 输出: b'Hello, World!'

# 有时会用十六进制格式表示字节序列
b = b'\x48\x65\x6c\x6c\x6f\x2c\x20\x57\x6f\x72\x6c\x64\x21'
print(b)        # 输出: b'Hello, World!'
```


字节序列与字符串的主要区别在于存储的内容和应用场景。

字符串是由字符组成的序列，通常用于存储文本信息。在 Python 3 中，字符串由 Unicode 字符组成，可以表示几乎所有语言中的字符。字符串主要用于读取或写入文本文件、处理表单输入的文本、在屏幕上显示文本等。

字节序列保存的数据除了文本之外，也可以是任何二进制数据。字节序列顾名思义，是字节的序列。字节是 8 位长的二进制数，可以表示 0 到 255 的数值。字节序列通常用于读取或写入二进制文件（如图片或视频文件）、网络套接字通信、数据加解密等。


### 字符串和字节之间的转换

有时候，我们会需要把从网络上或其它设备中读取到以字节方式保存的文字数据转换成字符串，或者需要把一些字符串以二进制形式发送出去，这时候，可以使用字符串的 encode() 方法和字节的 decode() 方法在字符串和字节之间转换。转换时必须指定文字的编码。使用不同编码，同样文字转换成的二进制数据是不同的。Python 默认使用 utf-8 编码字符串。我们可能需要先大致介绍一下文字编码的发展历史：

计算机是在美国被发明的，所以当时很自然的就只考虑了处理英文。最早出现的一个，也是最著名的一个关于在计算机中表达字符的标准，是 ASCII 标准（American Standard Code for Information Interchange，美国信息互换标准代码）。它定义了128个字符，包括英文字母大小写，数字，常用的标点和一些特殊符号。当时世界上大多数计算机都在使用 ASCII 方案来保存英文文本。这个方案最大的问题是它只包含了英文字母，于是其它国家，组织和公司纷纷开始扩展这个标准，用以支持其它字符，比如制表符、数学运算符号、中文字符、日文字符等等。在中国，最常用的标准，包括 GB2312，GBK，GB18030 等都是对 ASCII 的中文扩展。这些扩展出的标准有一个很麻烦的问题：同一个数值在不同的标准中被定义了不同的含义。比如，某一数值在中文的标准下可能是一个中文字符，在韩文的标准下，可能就是一个完全不相关的制表符。这就造成了，在中文环境下开发的软件，在韩文系统上运行时，显示的就完全是乱码。如果有人需要在一个系统中同时运行一个中文软件和一个韩文软件，就只能有一个软件可以正确显示文字。

为了解决这个问题，1990年开始，计算机业界开始研发一种新的编码标准，它可以覆盖全世界所有的字符，也就是说，任何一个字符都有自己独占的编码，在任何系统下都会保持这个编码，这样就不会出现换个系统就乱码的问题了。这就是 unicode 编码，也叫万国码、单一码。unicode 规定了字符集，但是这套字符集也还存在多种不同的编码格式。Windows 采用了 UTF-16LE 格式的 unicode 编码（UTF全称为 Unicode Transformation Format），使用 16 位的(双字节)数据表示一个字符。但是当前最流行的 unicode 编码格式却是 UTF-8，这是一种变长的编码方式，根据字符的常用程度，使用不同长度的编码来表示这个字符，编码长度有可能是 1 到 6 个字节。目前大多数的 unicode 文档采用的都是 UTF-8 编码，它也是 Python 中字符的默认编码格式。

多数情况下，字符串和字节之间的转换采用默认编码格式即可，但也有可能，我们需要把字符串转换成其它编码格式，以确保它们在一些非 UTF-8 编码的设备上正确显示。下面用代码演示一下几种不同编码格式的区别。

中文的几种不同编码：

```python
chinese_str = "中文"

# UTF-8 是 Python 默认的编码格式
print(chinese_str.encode('UTF-8'))     # 输出： b'\xe4\xb8\xad\xe6\x96\x87'
# UTF-16LE 是 Windows 的编码格式
print(chinese_str.encode('UTF-16LE'))  # 输出： b'-N\x87e'
# GB2312 是最常用的非 unicode 中文编码格式
print(chinese_str.encode('GB2312'))    # 输出： b'\xd6\xd0\xce\xc4'
```

可以看到，几种不同编码把同一个中文字符转换成了不同的二进制数据。

英文也可以使用这些编码格式：
```python
english_str = "Hello"
print(english_str.encode('UTF-8'))     # 输出： b'Hello'
print(english_str.encode('GB2312'))    # 输出： b'Hello'
print(english_str.encode('ASCII'))     # 输出： b'Hello'
print(english_str.encode('UTF-16LE'))  # 输出： b'H\x00e\x00l\x00l\x00o\x00'
```

UTF-8 和 GB2312 对于英文字符的编码是兼容 ASCII 标准的，它们把英文字符转换成的二进制数据与 ASCII 的标准完全相同。但 Windows 采用的 UTF-16LE 编码并不兼容 ASCII 标准。

把二进制数据解码会字符串的时候，一定要采用同样格式的编码，否则转换出来很可能就不是正确的字符串了：

```python
chinese_str = "中文"
print(chinese_str.encode('UTF-8').decode('UTF-8'))        
print(chinese_str.encode('UTF-16LE').decode('UTF-16LE')) 
print(chinese_str.encode('GB2312').decode('GB2312'))

# 上面的解码都可以正确得到字符串，但下面的解码过程会出错，因为使用了错误的编码格式
# print(chinese_str.encode('UTF-8').decode('GB2312'))

english_str = "Hello"
print(english_str.encode('UTF-8').decode('ASCII'))  #输出： Hello
# 上一行代码虽然使用了不同的格式编解码，但两种格式对于英文字符是兼容的，因此依然可以得到正确的字符串
```

## 练习

字符串的很多操作方法需要结合条件、循环等语句才能完成。这里仅列出一些最基础的练习题目。等到我们学习了后续章节，会再进行更多的练习。

1. 判断下面程序的运行结果：`print(len("Hello\nWorld!"))`
2. 反转字符串：输入一个字符串并输出它的反转形式，比如输入 "hello"，则输出 "olleh"。
3. 是否是回文：编写一个程序检查输入的字符串是否为回文（正反读一样的字符串）。
4. 首字母大写：编写一个程序，将字符串中的每个单词的首字母大写。
5. 整数所有位上数字的乘积：输入一个表示整数的字符串，编写程序计算该数字符串中所有位上数字的乘积。
6. 变位词：编写程序，输入两个字符串，判断它们是否为变位词（即由相同字符组成，字符顺序不同）。
7. 最大相同字符长度：输入一个字符串，统计其中连续相同字符的最大长度。例如，字符串 aaabbbbaa 中，最大连续长度是 4，有连续的 4 个 b。
