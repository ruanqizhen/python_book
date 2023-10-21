# 循环语句

循环语句是编程中的一个基本结构，它允许我们多次执行同一组指令，直到满足某个条件才结束。比如下面的这些应用场合，都非常适合使用循环：
* 处理大量数据： 有一个包含数千或数百万条数据的列表，并且需要对每条数据进行处理，不可能手动为每条数据写一个处理代码。使用循环，可以为所有数据编写一次处理逻辑。
* 重复执行： 例如，编写一个游戏，允许玩家可以尝试多次直到他们赢得比赛或放弃。可以使用一个循环来允许玩家多次尝试。
* 搜索和查找： 例如，有一个名单，需要查找名单里是否有特定的名字。可以使用循环遍历整个名单直到找到该名字或到达名单的末尾。
* 算法和模拟： 例如，模拟一个实验 1000 次来计算某种结果的概率。可以使用循环来执行每一次的模拟。

Python 提供了几种循环机制，主要包括 for 循环和 while 循环。


## for 循环

### 可迭代对象和迭代器 iterable 

Python 中的迭代器（iterator）是一种数据对象，它们都有一个共同的方法，叫做“得到下一个”，调用这个方法，就可以得到下一个数据。可以想象，如果有一组数据，如果使用迭代器，每次找到当前数据的下一个数据，这样持续下去，就可以遍历这组数据中的每一个数据。

可迭代对象（iterable）指的是任何可以被迭代（即遍历其成员元素）的对象。可迭代对象可以返回一个迭代器，使用迭代器访问可迭代对象中的每个数据。我们之前介绍过的列表、元组、字符串都是可迭代对象；将来会介绍的一些数据，比如字典、集合、文件对象等，也都是可迭代对象。


### 遍历可迭代对象的数据

for 循环是 Python 中最常用的循环结构之一。它用于迭代一个序列（列表、元组、字典、集合、字符串）或其他可迭代对象，并在每次迭代中执行代码块。以下是 for 循环的基本结构：

```python
for variable in iterable:
    # 循环体代码
```

其中 variable 是每次迭代中从 iterable 获取的当前元素。

比如，使用 for 循环遍历列表：
```python
fruits = ['apple', 'banana', 'cherry']

for fruit in fruits:
    print(fruit)

# 输出:
# apple
# banana
# cherry
```

使用 for 循环遍历字符串：
```python
word = "python"

for letter in word:
    print(letter)

# 输出:
# p
# y
# t
# h
# o
# n
```

## range() 函数

range() 是 Python 内置的一个函数，它返回一个迭代器，用于生成一系列连续的整数。这个函数在循环中特别有用。


range() 函数的基本语法如下： `range([start,] stop [, step])`。其中
* start (可选)：起始值，默认为0。
* stop：结束值（不包括）。
* step (可选)：步进值，默认为1。


使用示例：

```python
# 生成从0开始的连续整数
for i in range(5):
    print(i)
# 输出： 0 1 2 3 4 5

# 指定开始和结束值
for i in range(2, 5):
    print(i)
# 输出： 2 3 4

# 指定开始、结束和步进值
for i in range(0, 10, 2):
    print(i)
# 输出： 0 2 4 6 8

# 使用负数作为步进值
for i in range(5, 1, -1):
    print(i)
# 输出： 5 4 3 2
```

需要注意的是： range() 生成的序列不包括 stop 指定的值。虽然在 Python 2 中，，range() 返回的是一个列表，也就是一个可迭代对象，但是在 Python 3 中，range() 返回的是一个迭代器，它不实际存储整个数字序列，这样可以节省内存。如果需要一个实际的列表，可以使用 list(range(...)) 来转换。

使用 for 循环就可以迭代 range() 函数生成的所有数据：

```python
for i in range(5):
    print(i)

# 输出:
# 0
# 1
# 2
# 3
# 4
```

大多数编程语言的 for 循环语句都是依赖一个计数器来控制循环次数的，比如要迭代 20 次，那就每迭代一次，计数器加一。计数器从 0 增长到 19，正好循环 20 次。Python 并没有这种带计数器的循环，Python 的 for 语句更类似其它语言的 foreach 语句。那么，在 Python 里当循环体中需要一个计数器的时候，可以使用 `for i in range()` 语句来代替。

```python
fruits = ['apple', 'banana', 'cherry', 'date']

for i in range(len(fruits)):
    print(f"Element {i} is {fruits[i]}")

# 输出:
# Element 0 is apple
# Element 1 is banana
# Element 2 is cherry
# Element 3 is date
```


### 带有 else 子句的 for 循环

for 循环可以有一个可选的 else 块，当循环正常完成（没有被 break 语句中断）时执行。

```python
for i in range(5):
    print(i)
else:
    print("Loop finished")

# 输出:
# 0
# 1
# 2
# 3
# 4
# Loop finished
```


### break 语句

当 break 语句在循环中被执行，它会立刻终止所在的循环，跳出循环。程序会继续执行紧随循环之后的代码。一般的应用是，如果已经满足了某些条件，比如已经找到了某个要找的数据，就不需要在执行后面的循环迭代了，可以节省程序运行时间。

下面的程序在找到第一个偶数后中断循环。

```python
numbers = [1, 3, 7, 9, 2, 5, 6]

for num in numbers:
    if num % 2 == 0:
        print(f"Found an even number: {num}")
        break

# 输出：
# Found an even number: 2
```
	
### continue 语句

当 continue 语句在循环中被执行，当前迭代会被中断，并且程序控制会回到循环的开始，进入下一次迭代。

下面的程序打印出所有的奇数，并跳过偶数。

```python
numbers = [1, 2, 3, 4, 5]

for num in numbers:
    if num % 2 == 0:
        continue
    print(num)
	
# 输出：
# 1
# 3
# 5
```


## while 循环

### 基本用法
while 循环会持续执行，直到其后面的条件为 False。

基本语法：

```python
while 条件表达式:
    # 循环体代码块
```

当条件表达式为 True 时，循环体的代码块会被执行。每次执行完循环体后，条件表达式会再次被评估。只有当条件变为 False 时，循环才会结束。


示例:
```python
count = 0
while count < 5:
    print(count)
    count += 1

# 输出：
# 0
# 1
# 2
# 3
# 4
```

### break 和 continue

与 for 循环一样，while 循环中也可以使用 break 和 continue。

比如使用 break 提前退出循环：

```python
count = 0
while count < 5:
    if count == 3:
        break
    print(count)
    count += 1
	
# 输出：
# 0
# 1
# 2
```

使用 continue 跳过当前迭代：

```python
count = 0
while count < 5:
    count += 1
    if count == 3:
        continue
    print(count)

# 输出：
# 1
# 2
# 4
# 5
```

### 死循环

在编程中，死循环（也称为无限循环）是指一个永远不会自动终止的循环。在 Python 中，死循环通常是因为循环的终止条件从未被满足或者循环体中缺少了改变循环条件的代码。

下面是一个简单的死循环程序：

```python
x = 10
while x > 5:
    print(x)
    # x 的值没有变化，导致这个循环永远不会结束
```

编写 While 循环的时候，要特别注意避免出现死循环。要始终检查循环条件和循环体，确保循环有明确的退出条件。 可以使用 break 语句在满足某些特定条件时跳出循环，避免死循环。

如果程序陷入了死循环，可以手动停止它。在大多数开发环境和命令行中，可以使用 Ctrl + C 来中断正在运行的程序。


## 列表推导式 (List Comprehension)

列表推导式是 Python 中创建列表的简洁、可读的方式。它基于已有的可迭代对象（例如列表、元组、集合等）生成一个新列表。列表推导式通常更加简洁、明确。在多数其它语言中，创建一个复杂列表的唯一方法是使用循环或递归，但是在 Python 语言中，列表推导式是更好的方法。

列表推导式的基本格式如下： `[expression for item in iterable if condition]`，其中：
* expression： 对当前元素的操作；
* item： 当前迭代到的元素；
* iterable： 要迭代的对象；
* condition： 过滤条件（可选）。

下面看一些示例：

创建一个新列表，其中包含0到9的平方：

```python
squares = [x**2 for x in range(10)]
print(squares)  # 输出: [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

使用条件表达式过滤结果。比如，只保留偶数的平方：

```python
even_squares = [x**2 for x in range(10) if x % 2 == 0]
print(even_squares)  # 输出: [0, 4, 16, 36, 64]
```

排列组合：需要在列表推导式中使用嵌套循环。

```python
a = ['a', 'b', 'c']
b = [1, 2, 3]
combinations = [(x, y) for x in a for y in b]
print(combinations)  # 输出: [('a', 1), ('a', 2), ('a', 3), ('b', 1), ('b', 2), ('b', 3), ('c', 1), ('c', 2), ('c', 3)]
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

从上面的示例可以看出，使用列表推导式对列表进行操作，比使用循环要简洁的多。但也需要注意，在生成大量数据时可能消耗大量内存，因为它会返回一个新列表。在这种情况下，使用生成器表达式（使用圆括号而不是方括号）可能更为合适。
过于复杂的列表推导式可能会损害代码的可读性。当推导式变得复杂时，可以考虑使用传统的循环结构。