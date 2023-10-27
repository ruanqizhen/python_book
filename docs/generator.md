# 生成

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

### 带条件的字典推导式

字典推导式也可以添加条件语句来过滤出符合条件的元素：

```python
numbers = [1, 2, 3, 4, 5]
even_squares = {x: x**2 for x in numbers if x % 2 == 0}
print(even_squares)  # 输出：{2: 4, 4: 16}
```


### 使用两个不同的可迭代对象

通过使用 zip，可以将两个不同的可迭代对象换为一个字典：

```python
keys = ['a', 'b', 'c']
values = [1, 2, 3]
dictionary = {k: v for k, v in zip(keys, values)}
print(dictionary)  # 输出：{'a': 1, 'b': 2, 'c': 3}
```

### 字典推导式中的双重循环：

可以在字典推导式中使用多个循环：

```python
names = ['Alice', 'Bob', 'Charlie']
letters = [name[0] for name in names]
name_dict = {letter: name for letter, name in zip(letters, names)}
print(name_dict)  # 输出：{'A': 'Alice', 'B': 'Bob', 'C': 'Charlie'}
```

### 从字典生成字典

假设已经有了一个字典，需要创建一个新的字典，其中的值是原始字典值的一部分或是对元字典的修改：

```python
price = {'apple': 0.5, 'banana': 0.25, 'orange': 0.75}
discounted_price = {fruit: price * 0.9 for fruit, price in price.items()}
print(discounted_price)  # 输出：{'apple': 0.45, 'banana': 0.225, 'orange': 0.675}
```

## 生成器 （Generator）

在介绍循环的时候，曾经提到迭代器。迭代器允许程序员遍历容器（如列表或字典）中的所有项，但是它并不需要容器将所有项预先存储在内存中。这意味着迭代器可以用来表示无限的数据流，并且在任何给定时间点都只使用有限的内存。迭代器有两种主要实现方法，一种依赖面向对象的编程方式，我们之后再做介绍。

在这一节，我们介绍一种函数式编程中创建创建迭代器的方法：生成器。生成器是一种高效的创建迭代器的方式，它允许我们按需生成数据，而不是一次性生成并存储所有数据。创建生成器有两种主要的方法：生成器函数和生成器表达式。

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
