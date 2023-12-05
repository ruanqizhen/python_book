# 推导式

## 列表推导式

列表推导式（List Comprehension）是 Python 中创建列表的简洁、可读的方式。它基于已有的可迭代对象（例如列表、元组、集合等）生成一个新列表。列表推导式通常更加简洁、明确。在多数其它语言中，创建一个复杂列表的唯一方法是使用循环或递归，但是在 Python 语言中，列表推导式是更好的方法。

列表推导式的基本格式如下： `[expression for item in iterable if condition]`，其中：
* expression： 对当前元素的操作；
* item： 当前迭代到的元素；
* iterable： 要迭代的对象；
* condition： 过滤条件（可选）。

以下是一些既精巧又实用的列表推导式示例：

### 基本用法

创建一个新列表，其中包含 0 到 9 的平方。这需要使用 for 循环，遍历 0 到 9：

```python
squares = [x**2 for x in range(10)]
print(squares)  # 输出: [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

### 过滤条件

在上面程序的基础上，只保留偶数的平方。这需要添加过滤条件：

```python
even_squares = [x**2 for x in range(10) if x % 2 == 0]
print(even_squares)  # 输出: [0, 4, 16, 36, 64]
```

### 多维列表

生成一个乘法表，需要使用到嵌套的推导式生成二维列表：

```python
multiplication_table = [[i * j for j in range(1, 10)] for i in range(1, 10)]
for row in multiplication_table:
    print(row)
```

二维数组进行转置操作：

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

transpose = [[row[i] for row in matrix] for i in range(len(matrix[0]))]

print(transpose)

''' 输出：
[
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9]
]
'''
```

### 多重循环

上面的示例都是比较直观的，容易理解。相比之下，在列表推导式中使用嵌套循环需要稍微费一些脑筋，它虽然运行了多重循环，但并没有生成多维列表，而是把所有结果顺序放在了一维列表中。

排列组合：

```python
a = ['a', 'b', 'c']
b = [1, 2, 3]
combinations = [(x, y) for x in a for y in b]
print(combinations)  # 输出: [('a', 1), ('a', 2), ('a', 3), ('b', 1), ('b', 2), ('b', 3), ('c', 1), ('c', 2), ('c', 3)]
```

二维列表平展为一维的操作：

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

flattened = [item for sublist in matrix for item in sublist]

print(flattened)  # 输出： [1, 2, 3, 4, 5, 6, 7, 8, 9]

# 使用循环实现同样的功能，需要下面四行代码：
flattened = []
for sublist in matrix:
    for item in sublist:
        flattened.append(item)
```

配合切片操作，同样可以把一维列表转换成二维：

```
lst = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

rows = 2  # 目标行数
cols = 5  # 目标列数

# 使用列表推导式转换为二维列表
two_dim_list = [lst[i * cols:(i + 1) * cols] for i in range(rows)]

print(two_dim_list)
```

从上面的示例可以看出，使用列表推导式对列表进行操作，比使用循环要简洁的多。但也需要注意，在生成大量数据时可能消耗大量内存，因为它会返回一个新列表。在这种情况下，使用[生成器表达式](generator#生成器表达式)（使用圆括号而不是方括号）可能更为合适。
过于复杂的列表推导式可能会损害代码的可读性。当推导式变得复杂时，可以考虑使用传统的循环结构。


## 字典推导式

### 基本用法

与列表推导式类似，字典推导式可以创建字典。字典推导式的基本格式：

```python
{key_expr: value_expr for item in iterable}
```

与列表推导式的区别在于，字典推导式中要提供两个数据：键和值。

下面的简单例子，将一个列表的值映射为其平方：

```python
numbers = [1, 2, 3, 4, 5]
squared = {x: x**2 for x in numbers}
print(squared)  # 输出：{1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
```

下面示例是对已有字典中的数据做修改，然后生成新字典：

```python
fruits = {'苹果': 0.5, '香蕉': 0.25, '桔子': 0.75}
discounted_price = {fruit: price * 0.9 for fruit, price in fruits.items()}
print(discounted_price)  # 输出：{'苹果': 0.45, '香蕉': 0.225, '桔子': 0.675}
```

### 过滤条件

字典推导式也可以添加条件语句来过滤出符合条件的元素：

```python
numbers = [1, 2, 3, 4, 5]
even_squares = {x: x**2 for x in numbers if x % 2 == 0}
print(even_squares)  # 输出：{2: 4, 4: 16}
```


### 多个可迭代对象

通过使用 zip，可以将多个不同的可迭代对象换为一个字典：

```python
keys = ['a', 'b', 'c']
values = [1, 2, 3]
dictionary = {k: v for k, v in zip(keys, values)}
print(dictionary)  # 输出：{'a': 1, 'b': 2, 'c': 3}
```

### 多重循环：

可以在字典推导式中使用多个循环,比如生成一个以字典格式存储的乘法表：

```python
product_dict = {(i, j): i*j for i in range(1, 5) for j in range(1, 5)}

print(product_dict)
```


## 赋值表达式

### 基本用法

赋值表达式（Assignment Expression）使用运算符 `:=` 来为变量赋值。它也被你称为“海象运算符”，因为它看起来就像是海象的眼睛和大牙。与 Python 中的[赋值语句](variable#声明和赋值)（使用等号，比如 `a = 5`）相比，赋值语句是一个“[语句](condition#语句)”，它不能出现在需要[表达式](condition#表达式)的地方，比如在 if 或 while 语句的条件中，或者作为其他表达式的一部分。但赋值表达式，是一个表达式，它可以出现在任何使用表达式的地方。

海象运算符可以避免重复运算，提高代码的简洁性。比如，在不使用海象运算符的情况下，如果一个值在逻辑判断和后续代码中都要使用，那么通常需要分两步写：先计算一次赋值给变量，然后在逻辑判断和后续代码中使用这个变量。海象运算符允许在逻辑判断中进行赋值，并在后续代码中直接使用这个赋值结果。

比如在 while 循环中：

```python
# 不使用海象运算符：
line = input("请输入文字：")
while line != "结束":
    print(f'您输入的内容是：{line}')
    line = input("请输入文字：")
    

# 使用海象运算符：
while (line := input("请输入文字：")) != "结束":
    print(f'您输入的内容是：{line}')
```

因为列表推导式一般希望写的简洁，不希望创建额外变量，所以海象运算符在列表推导式中更有用：

```python
# 不使用海象运算符， complicated_function 被调用两遍
results = [complicated_function(x) for x in data if complicated_function(x) > 0]


# 使用海象运算符， complicated_function 只会被调用一次
results = [y for x in data if (y := complicated_function(x)) > 0]
```

更具体一些的例子，比如要计算列表中每个元素的平方，但只保留那些结果大于 5 的平方值，使用海象运算符可以只计算一次平方：

```python
numbers = [1, 2, 3, 4, 5]
squares = [square for x in numbers if (square := x*x) > 5]
```

### 注意事项

海象运算符很容易破坏程序的可读性，因为它经常要和其它的运算符一起使用，很容易搞不清楚不同运算符的优先级。尤其是它与赋值表达式长得太像了，很容易让人不自觉的把赋值表达式的规则套用上来。笔者的建议是，但凡使用海象运算符的地方都用括号套起来，这样就容易区分计算的优先级了。下面看几个例子，大家可以先猜测一下程序输出是什么：

```python
if x := 5 == 5:
    print(x)
```

输出是 True，因为 `==` 比 `:=` 的优先级更高。这里如果把程序写成 `if (x := 5) == 5:` 或者 `if x := (5 == 5):` 就容易理解了。

在看一个例子：

```python
x, y = 1, 2
(x, y := 3, 4)
print(y)
```

输出是 3，因为 `:=` 比 `,` 的优先级更高。清晰的代码应该这样写： `(x, (y := 3), 4)` 或者 `(x, y := (3, 4))`。但是不能写成 `((x, y) := (3, 4))`，因为海象运算符不支持自动解包。