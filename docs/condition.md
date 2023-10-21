# 条件语句


## 代码块划分

代码缩进是编程中的一个常见概念，指的是某一行代码行的起始部分有一定数量的空白空间，空白后面才是真正的代码。

在多数编程语言中，代码块的界限通常是由特定的符号（比如花括号 `{}`、小括号 `()`）或特定的关键字（比如 begin 和 end）定义的。在这些语言里，代码缩进只是为了美观和提高可读性，代码缩进不会影响程序的逻辑。

然而，Python 使用了一种不同的策略：代码块的界限是由缩进定义的。这种设计决策旨在使代码更加可读，并鼓励程序员写出结构清晰、整洁的代码。在同一个代码块中，每一行代码的缩进必须是一致的。这意味着，如果使用了四个空格作为缩进，那么整个代码块中必须都使用四个空格。官方 Python 样式指南（PEP 8）推荐使用 4 个空格作为标准的缩进大小。

我们之前介绍的程序的每一行代码之间，都仅有最简单的顺序逻辑关系，之前的每个示例程序都只有一个代码块，所以还没有考虑缩进的问题。但之后的程序示例将会变得更加复杂，将会包含多个代码块了。

笔者在最初在最初学习 Python 的时候，是特别喜欢 Python 的这种设计。主要担心是，缩进是比较容易搞错的，毕竟在其它语言中，只影响美观不影响逻辑的功能是没那么重要，容易被忽视。不过，随着时间的推移，笔者发现自己的担心是有些多余的，在习惯了这种方式之后，它并不会导致更多的错误，也确实可以提高代码的整洁度和可维护性。

## if else 结构

if-else 结构是编程中最常见的决策结构。它允许基于一个或多个条件来选择执行哪一个代码块。接下来，我们将详细介绍 Python 中 if-else 的用法。

### 最基本的 if 语句

最基本的用法是只有 `if` 的语句，这是最简单的条件判断。如果条件为 True，则执行 `if` 下面的缩进代码块。使用方式如下：

```python
if condition:
    # 如果 condition 为 True，则执行这里的代码
```
与许多其他编程语言不同，Python 的 if-else 结构不使用括号来包围条件。代替括号的是冒号和缩进。缩进非常重要。条件后的代码块应该有一个统一的缩进，以表示它们属于同一个逻辑块。

示例：

```python
x = 5
if x > 0:
	print("条件满足了")
    print("x 是正数")
```

### if-else 结构

有时候，要让程序在条件不满足的时候，执行另一段代码，这就需要 `if` `else` 都用上：

```python
if condition:
    # 如果 condition 为 True，则执行这里的代码
else:
    # 如果 condition 为 False，则执行这里的代码
```

示例：

```python
x = -5
if x > 0:
    print("x 是正数")
else:
    print("x 是非正数")
```

需要注意的是，`if` 和 `else` 下面的缩进代码块都不能缺失。有时候调试代码，可能希望暂时把 `if` 分支的代码块都注释掉，这样会导致程序出错。如果什么都不需要执行，可以使用 `pass` 关键字，它是一个占位语句，实际上什么都不做，比如：

```python
x = -5
if x > 0:
	pass
    # print("x 是正数")  暂时不要执行
else:
    print("x 是非正数")
```

### if-elif-else 结构

有时候，要让程序检查多个条件，并在满足其中之一时执行对应的代码块。我们当然也可以只用 `if` `else` 实现所需功能，比如：

```python
x = 0
if x > 0:
    print("x 是正数")
else: 
	if x < 0:
		print("x 是负数")
	else:
		print("x 是零")
```

这样的嵌套 if else 会导致程序缩进层次过多，降低可读性。在这种情况下，可以使用 `elif` 关键字代替 `else if`。用法是：

```python
if condition1:
    # 如果 condition1 为 True，则执行这里的代码
elif condition2:
    # 如果 condition1 为 False 且 condition2 为 True，则执行这里的代码
else:
    # 如果上述所有条件都为 False，则执行这里的代码
```

示例：

```python
x = 0
if x > 0:
    print("x 是正数")
elif x < 0:
    print("x 是负数")
else:
    print("x 是零")
```

### 多重条件

有时候，需要在多个条件都满足的情况下才做一件事，为了避免嵌套的 if else 语句，我们可以先使用逻辑运算符 (and, or, not) 组合多个条件，然后再使用 if else 结构，比如：

```python
age = 25
if age >= 18 and age <= 35:
    print("该年龄段的人是青年")
```

## 条件表达式
	
条件表达式，也经常被称为三元运算符或三元表达式，是 if-else 语句的简化形式，用于在单行中进行简单的条件评估。它的基本格式是：

```python
value_if_true if condition else value_if_false
```

当 condition 为真时，表达式的结果为 value_if_true；当条件为假时，结果为 value_if_false。

让我们通过几个例子来深入了解条件表达式的使用：


```python
# 判断数字的正负
num = -10
label = "positive" if num > 0 else "non-positive"
print(label)  # 输出: non-positive

# 找出两个数中的较大值
a, b = 5, 8
max_value = a if a > b else b
print(max_value)  # 输出: 8


# 根据年龄判断是否成年
age = 20
status = "成年" if age >= 18 else "未成年"
print(status)  # 输出: 成年
```

有上面的例子可以看出，条件表达式能够在一行代码中就评估条件，这可以使代码更简洁。而且，它可以被使用在一些无法使用 if-else 结构的地方，比如在之前介绍过的列表推导式中。

虽然条件表达式很有优势，但如果需要判断的条件太过复杂，可能会导致代码难以阅读，这时候使用普通的 if-else 语句可能更有可读性。


## 模式匹配

“模式匹配”（Structural Pattern Matching），是通过 match 语句按照特定的模式来匹配和分解数据结构，并基于匹配的结果执行相应的代码块。它可以看作是 if-elif-else 链的加强版本，但它提供了更高级的匹配和分解数据结构的能力。

其基本语法如下：

```python
match expression:
    case pattern1:
        # do something
    case pattern2:
        # do something else
    ...
    case patternN:
        # do something else
    case _:
        # default case, similar to 'else'
```

模式匹配最简单的用法是匹配某个变量的值，然后跳入相应分支，类似其它一些编程语言中 switch-case 语句的用法：

```python
x = 5
match x:
    case 10:
        print("x is 10")
    case 20:
        print("x is 20")
    case _:
        print("x is something else")
```

同样，采用逻辑运算可以减少模式匹配结构的分支数量：

```python
color = "green"
match color:
    case "red" | "green" | "blue":
        print("RGB color")
    case _:
        print("Unknown color")
```		
		
		
在匹配列表时候，可以配合列表车拆包操作，匹配列表的具体长度和内容：

```python
match some_list:
    case []:
        print("Empty list")
    case [a]:
        print(f"One item: {a}")
    case [a, b]:
        print(f"Two items: {a} and {b}")
	case [a, b, *rest, c]:
        print(f"First two items: {a} and {b}, last items {c}")
```

模式匹配不仅可以匹配单个的数据，也可以匹配一系列的数据，比如：

```python
point = (2, 3)
match point:
    case (0, 0):
        print("Origin")
    case (0, y):
        print(f"Point lies on Y axis at {y}")
    case (x, 0):
        print(f"Point lies on X axis at {x}")
    case (x, y):
        print(f"Point is at ({x}, {y})")
    case _:
        print("Not a point")
```


还可以基于数据类型进行匹配，这在类型检查或类型转换中非常有用。

```python
value = "Hello, world!"
match value:
    case int():
        print("It's an integer!")
    case str() as s:
        print(f"It's a string with length {len(s)}")
    case _:
        print("It's something else")
```

