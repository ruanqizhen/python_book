# 推导式和生成器

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

与列表推导式的区别在于，字典推导式中要提供两个数据键和值。

下面的简单例子，将一个列表的值映射为其平方：

```python
numbers = [1, 2, 3, 4, 5]
squared = {x: x**2 for x in numbers}
print(squared)  # 输出：{1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
```

下面示例是对已有字典中的数据做修改，然后生成新字典：

```python
price = {'apple': 0.5, 'banana': 0.25, 'orange': 0.75}
discounted_price = {fruit: price * 0.9 for fruit, price in price.items()}
print(discounted_price)  # 输出：{'apple': 0.45, 'banana': 0.225, 'orange': 0.675}
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


## 生成器

在介绍循环的时候，曾经提到迭代器。迭代器允许程序员遍历容器（如列表或字典）中的所有项，但是它并不需要容器将所有项预先存储在内存中。这意味着迭代器可以用来表示无限的数据流，并且在任何给定时间点都只使用有限的内存。迭代器有两种主要实现方法，一种依赖面向对象的编程方式，我们之后再做介绍。

在这一节，我们介绍一种函数式编程中创建创建迭代器的方法：生成器 （Generator）。生成器是一种高效的创建迭代器的方式，它允许我们按需生成数据，而不是一次性生成并存储所有数据。创建生成器有两种主要的方法：生成器函数和生成器表达式。

### 生成器函数

这是最常见的方法。定义一个函数，如果函数体中使用了 yield 关键字返回生成的数据，那么这个函数不会返回一个常规的值，而是会返回一个生成器对象。换句话说，任何包含 yield 的函数都被称为生成器函数。这个函数在被调用时，返回一个生成器对象，但不立即执行函数体内的代码。每次针对生成器对象调用 next() 函数时，函数会执行到下一个 yield 语句，返回相应的值，然后暂停执行，直到再次被调用。比如：

```python
def count_up_to(n):
    count = 0
    while count < n:
        yield count
        count += 1

counter = count_up_to(5)
print(counter)           # 输出: <generator object count_up_to at 0xXXXXXXXX>
print(next(counter))     # 输出: 0
print(next(counter))     # 输出: 1
print(next(counter))     # 输出: 2
print(next(counter))     # 输出: 3
print(next(counter))     # 输出: 4
# print(next(counter))     # 已经到头，再调用 next 会产生 StopIteration 异常
```

一个函数只要包含了 yield 语句，它就成了生成器函数。所以上面程序中的 count_up_to 函数是一个生成器。调用这个生成器函数时，它不会立即执行，而是返回了一个生成器对象。生成器是惰性求值的，也就是说，生成器函数按需生成值，每次请求数据时，可以使用 next() 函数调用生成器对象。这是，生成器函数内的代码，才会被执行。当运行到 yield 语句时，函数返回 yield 后面的值。然后函数保存的当前状态，包括所有局部变量的值），而生成器暂停执行，直到下一次数据请求发生。

初次设计生成器函数的时候可能会有些无从下手。笔者的思路是，先写一个函数，把要生成的数据都打印出来，比如要打印一个正整数数列，程序是：

```python
def count_up_to(n):
    count = 0
    while count < n:
        print(count)
        count += 1
```
然后，把所有 print 语句，换成 yield 语句，就是一个生成器函数了。

实际应用中，调用 next() 函数的情况比较少，更多的是使用循环，或者推导式迭代生成器对象。比如下面的示例，它是一个斐波那契数列的生成器，在循环中迭代这个生成器对象，每次会得到一个斐波那契数：

```python
# 斐波那契数列生成器
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

for num in fibonacci(5):
    print(num)
    
# 输出： 0  1  1  2  3
```

如果我们不用生成器，而是采用循环直接生成一个斐波那契数的列表，功能上与上面的程序是完全相同的：

```python
# 直接返回斐波那契数列表
def fibonacci(n):
    a, b = 0, 1
    result = []           # 初始化一个空列表
    for _ in range(n):
        result.append(a)  # 将值添加到列表中
        a, b = b, a + b
    return result         # 返回列表

for num in fibonacci(5):
    print(num)
    
# 输出： 0  1  1  2  3
```

上面两段程序的区别在于效率。假设我们需要很大量的数据，比如生成一千万个斐波那契数。直接返回列表的方式，要等全部数据都生成好之后，才能返回，而且这些数据要一次性装入内存。对于更大量的数据，可能内存都无法容纳。
而对于生成器来说，它每产生一个数据就会返回一个数据，后续程序无需等待，就可以处理当前的数据了。而且每次内存中只需要装入正在处理的数据，不需要装入数列中其它的数据。

生成器只能迭代一次。一旦生成器函数已经执行到结尾并引发了 StopIteration，就需要重新创建生成器对象来重新迭代。

#### 惰性生成

生成器是惰性生成结果的，这表示值是在实际需要时才生成的，而不是一开始就生成所有可能的值。这种方法可以显著减少内存使用，特别是在处理大型数据集时。比如在下面这个示例中：

```python
def count_up():
    count = 0
    while True:
        yield count
        count += 1

it = count_up()
for i in range(10):
    print(next(it))
```

count_up 是一个生成器函数，它有一个无限循环。但是程序并不会运行无限次，因为，只有在程序中调用 next() 时，它才会执行一次。程序中的
for 循环运行10次，每次调用 next(it)，这个 for 循环实际上限制了生成器生成值的次数，只生成10个值。

要特别注意的是，调用这样的生成器一定要限制次数，否则它们真的会运行无数次。有些操作可能会在无意间，忘记了限制调用次数。比如把生成器作为参数传递给支持不定数量参数的函数：

```python
def count_up():
    count = 0
    while True:
        yield count
        count += 1

print(*count_up())
```

在上面的程序中， `print(*count_up())` 会打印生成器生成的所有值。使用星号 `*` 操作符会尝试解包生成器中的所有值，这在一个无限生成器的情况下会导致问题，因为它会无限制地尝试生成值。程序会因此出现内存不足的错误。

如果生成器本身有运行次数限制，则可以避免上述的问题：

```python
def count_up_to(n):
    count = 0
    while count < n:
        yield count
        count += 1
        
print(*count_up_to(10))
```

### 生成器表达式

生成器表达式以紧凑的方式创建生成器。从形式上看，生成器表达式与列表解析非常相似，区别仅在于生成器表达式使用圆括号 `()` 而不是方括号 `[]`。但生成器表达式返回一个生成器对象，而不是一个列表。正因如此，生成器表达式比列表推导式更为内存高效。

假设我们想要得到一个包含平方数的生成器，我们可以使用以下的生成器表达式：

```python
squared = (x*x for x in range(10))

for num in squared:
    print(num)
```

上文，我们曾经使用列表推导式创建一个列表，其中包含0到9的平方，它的表达式与上面的代码几乎相同，只有括号不一样。

再添加一个示例，比如我们需要从一个列表中选出长度大于 2 的字符串，然后将将这些字符串转换为大写，可以编写程序如下：

```python
words = ["a", "be", "dog", "python", "ai", "hello", "world"]
result = (word.upper() for word in words if len(word) > 2)

for word in result:
    print(word)
```

### 生成器还是直接返回列表

当我们编写的函数需要返回一组数据的时候，我们就面临两个选择，一是让函数直接返回一个列表，二是把函数写成一个生成器。我们需要根据具体的情况来判断哪个选择更优：

* 如果返回的数据会通过索引被随机读取，那么应该使用列表；生成器只能顺序产生数据
* 如果产生的数据量很大，那么应该使用生成器，因为它是惰性求值的，只有在需要时才生成数据，能够尽可能减小内存占用，提高程序性能；列表只使用少量数据的情况
* 如果不确定后续程序会用到多少产生的数据，也适合使用生成器，因为如果使用列表一次返回所有数据很可能也会不会被用到

一个比较常见的情景是从外部设备读取数据进行处理，如果数据量太大，可能会导致大量的内存占用甚至内存溢出。如果使用生成器，每次只处理一行数据，或一个数据块，进程处理。之后再读取下一块进行处理，这样可以显著降低内存使用。

## 赋值表达式

赋值表达式（Assignment Expression）使用运算符 `:=` 来为变量赋值。它也被你称为“海象运算符”，因为它看起来就像是海象的眼睛和大牙。与 Python 中的赋值语句（使用等号，比如 `a = 5`）相比，赋值语句是一个“语句”，它不能出现在需要表达式的地方，比如在 if 或 while 语句的条件中，或者作为其他表达式的一部分。但赋值表达式，是一个表达式，它可以出现在任何使用表达式的地方。

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

更具体一些的例子，比如要计算列表中每个元素的平方，值保留那些大于 5 的平方值，使用海象运算符可以只计算一次平方：

```python
numbers = [1, 2, 3, 4, 5]
squares = [square for x in numbers if (square := x*x) > 5]
```