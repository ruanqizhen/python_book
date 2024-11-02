# 条件语句

条件语句在编程中用于根据一定的条件控制程序的执行流程，它会让程序根据不同的条件执行不同的代码块，是编程中实现决策逻辑的基本方式之一。

## if else 语句

if-else 结构是编程中最常见的条件结构。它允许基于一个或多个条件来选择执行哪一个代码块。

### 只有 if 的结构

最简单的条件结构是只有 `if` 的语句，如果条件为 True，则执行 `if` 下面的缩进代码块。使用方式如下：

```python
if condition:
    # 如果 condition 为 True，则执行这里的代码
```

与许多其他编程语言不同，Python 的 if-else 结构中，不但后面的代码块不需要使用括号来包围，就连判断条件也不需要使用括号包围。代替括号的是冒号和缩进：判断条件后面紧跟一个冒号，然后下面一行开始应该有一个统一缩进的，数行代码组成的代码块。比如：

```python
x = 5
if x > 0:
    print("条件满足了")  # x > 0 时执行
    print("x 是正数")   # 这两行有相同缩进，属于同一代码块
```

### 带有 else 的结构

有时候，要让程序在条件不满足的时候，执行另一段代码，这就需要 `if` `else` 都用上了。使用方式如下：

```python
if condition:
    # 如果 condition 为 True，则执行这里的代码
else:
    # 如果 condition 为 False，则执行这里的代码
```

比如：

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

### 带有 elif 的结构

有时候，要让程序检查多个条件，并在满足其中之一时执行对应的代码块。我们可以嵌套的 `if` `else` 实现所需功能，比如：

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

这样的嵌套 if else 会导致程序缩进层次过多，降低可读性。为了简化代码，我们可以使用 `elif` 关键字代替 `else if`。用法是：

```python
if condition1:
    # 如果 condition1 为 True，则执行这里的代码
elif condition2:
    # 如果 condition1 为 False 且 condition2 为 True，则执行这里的代码
else:
    # 如果上述所有条件都为 False，则执行这里的代码
```

比如：

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

条件表达式，也经常被称为三元运算符或三元表达式，因为它需要三个输入值，分别是选择条件、条件为真时返回的值、条件为假时返回的值。条件表达式是 if else 语句的简化形式，用于在单行中进行简单的条件评估。它的基本格式是：

```python
value_if_true if condition else value_if_false
```

当 condition 为真时，表达式的结果为 value_if_true；当条件为假时，结果为 value_if_false。

让我们通过几个例子来深入了解一下条件表达式的使用：


```python
# 判断数字的正负
num = 10
label = "负数" if num < 0 else "非负数"
print(label)  # 输出: 非负数

# 找出两个数中的较大值
a, b = 5, 8
max_value = a if a > b else b
print(max_value)  # 输出: 8


# 根据年龄判断是否成年
age = 20
status = "成年" if age >= 18 else "未成年"
print(status)  # 输出: 成年
```

有上面的例子可以看出，条件表达式能够在一行代码中就评估条件，这可以使代码更简洁。而且，它可以被使用在一些无法使用 if else 结构的地方，比如放在[列表推导式](generator#列表推导式)中，其中原因可以参考：[表达式与语句](condition#表达式与语句)。虽然条件表达式很有优势，但如果需要判断的条件太过复杂，可能会导致代码难以阅读，这时候使用普通的 if else 语句可能更有可读性。


## 模式匹配

“模式匹配”（Structural Pattern Matching）语句也称为 match 语句，它按照预定的模式来匹配输入条件，并根据匹配结果执行相应的代码块。它可以看作是 if elif else 语句的加强版本。其基本语法如下：

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

### 匹配变量值

模式匹配最简单的用法是匹配某个变量的值，然后跳入相应分支，类似其它一些编程语言中的 switch case 语句：

```python
x = 5
match x:
    case 10:
        print("x 是 10")
    case 20:
        print("x 是 20")
    case _:
        print("x 是其它数")
```

同样，采用逻辑运算可以减少模式匹配结构的分支数量：

```python
color = "绿"
match color:
    case "红" | "绿" | "蓝":
        print("RGB 颜色")
    case _:
        print("未知颜色")
```


在匹配列表时候，可以配合列表拆包操作，匹配列表的具体长度和内容：

```python
match some_list:
    case []:
        print("空列表")
    case [a]:
        print(f"只有一个元素： {a}")
    case [a, b]:
        print(f"两个元素： {a} 和 {b}")
    case [a, b, *rest, c]:
        print(f"前两个元素为： {a} 和 {b}, 最后一个元素为： {c}")
```

### 匹配系列数据

模式匹配不仅可以匹配单个的数据，也可以匹配一系列的数据，比如：

```python
point = (2, 3)
match point:
    case (0, 0):
        print("原点")
    case (0, y):
        print(f"数据位于 Y 轴上： {y}")
    case (x, 0):
        print(f"数据位于 X 轴上： {x}")
    case (x, y):
        print(f"数据位于数轴之外的点： ({x}, {y})")
    case _:
        print("非法数据")
```


### 匹配数据类型

还可以基于数据类型进行匹配，这在类型检查或类型转换中非常有用。

```python
value = "Hello, world!"
match value:
    case int():
        print("输入为整数")
    case str() as s:
        print(f"输入为字符串，长度为： {len(s)}")
    case _:
        print("输入不是整数或字符串")
```

## 没有 if else 的选择

有些编程语言是没有 if else 语句的，它们同样可以实现选择功能，比如可以利用元组的索引来实现类似功能。下面是一个带有索引的元组：

```python
(a, b)[x]
```

上面程序的元组中有两个元素： a, b。当索引值 x 为 False 也就是 0 的时候，整个表达式返回元组的第 0 个元素，也就是 a；当索引值 x 为 True 也就是 1 的时候，整个表达式返回元组的第 1 个元素，也就是 b。

比如

```python
# 判断数字的正负
num = 10
label = ("非负数", "负数")[num < 0]
print(label)      # 输出: 非负数

# 找出两个数中的较大值
a, b = 5, 8
max_value = (b, a)[a > b]
print(max_value)  # 输出: 8


# 根据年龄判断是否成年
age = 20
status = ("未成年", "成年")[age >= 18]
print(status)     # 输出: 成年
```

如果索引是整数，或[枚举类型数据](iterator#枚举)，使用这种方式还可以代替简单的模式匹配语句，比如：

```python
red, green, blue = 0, 1, 2

color = green
print(("红", "绿", "蓝")[color])
```

使用索引替代 if else 和 match 的优点是代码精简。缺点是不够直观，对于不熟悉的人，可能无法一下子领会程序逻辑。




## 练习

1. 计算收入税

某国家按照公民的收入来收取个人收入所得税，税金的计算方法如下：收入低于或等于 10 万元时，税金按照收入的 10% 收取；收入高于 10 万元，低于 50 万元时，低于 10 万元的部分按 10% 收取，高于 10 万元的部分，按照 15% 收取；收入高于 50 万元时，高于 50 万元的部分，按照 20% 收取。编写程序，输入一个人的收入值，计算打印应交税金。

2. 对三个数据排序

使用基础的条件语句编写一个函数，它的输入是三个实数，函数按照从小到大顺序打印出三个输入数据。


3. 判断三角形的三条边

输入三个数，判断这三个数是否能够作为组成三角形的三条边的边长。

