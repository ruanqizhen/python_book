# 高阶函数

高阶函数（Higher-Order Function，HOF）是函数式编程中的一个重要概念。一个函数可以被称为高阶函数，表示它或者接受一个或多个函数作为参数；或者返回一个函数。如果高阶函数接收其它函数作为参数，则它的行为在运行时，可以基于传递给它的函数进行动态调整。

Python 中有一些内置的高阶函数，包括函数式编程中经常使用到的 map(), filter(), 和 reduce() 等。其中 map(), filter() 虽然在函数式编程中使用非常频繁，但是在 Python 中，列表（或字典）推导式以及生成器表达式，在功能上基本可以取代 map() 和 filter()。在 Python 程序中，Pythora 星球居民更倾向于使用列表推导式和生成器表达式。但为了保证代码的可读性，列表推导式和生成器表达式一般适用于简单逻辑，复杂功能的实现还是更适合使用这些高阶函数。

## map

### 基本用法

在介绍[生成器表达式](generator#生成器表达式)的时候，我们使用了一个简单的示例：假设我们有一个输入迭代器，其中包含了一组数据，我们希望生成一个新的迭代器，可以产生一组新数据，这组新数据中的每个数，对应原数列中每个数的平方值。使用生成器表达式可以写成如下程序。

```python
numbers = range(10)
squared = (x*x for x in numbers)

for num in squared:
    print(num)
```

使用函数式编程，对于这个问题，还有另一种解决方案：使用 map() 函数。map() 函数接受一个输入函数和一个可迭代对象作为输入，然后返回一个新的迭代对象。返回的迭代对象中的每个元素，是将输入迭代对象中每个元素传递给输入函数运行后的结果。使用 map() 函数改写上面的代码如下：

```python
numbers = range(10)
squares = map(lambda x: x*x, numbers)

for num in squared:
    print(num)
```

在上面的示例中，传递给 map 的参数，numbers 是需要被处理的可迭代对象，匿名函数 `lambda x: x*x` 则表示需要对可迭代对象中的每个元素做平方。

### 使用多个可迭代对象

当给 map() 函数提供多个可迭代对象时，它会并行处理这些对象。这意味着它会取每个可迭代对象的第一个元素，然后应用函数；接着取每个可迭代对象的第二个元素，再次应用函数，依此类推。比如：

```python
a = [1, 2, 3]
b = [10, 20, 30]
summed = map(lambda x, y: x + y, a, b)
print(list(summed))  # [11, 22, 33]
```

在上面这个示例中，lambda 函数接收两个参数，并将它们加在一起。如果传递给 map() 的可迭代对象长度不同，map() 将在最短的可迭代对象结束时停止。

使用列表推导式处理多个可迭代对象时，要借助 [zip()](loop#zip-函数) 函数，把多个可迭代对象转换成单个可迭代对象再处理。而 map() 函数可以直接处理它们。

### 实现 map() 函数

我们可以进一步探究一下，我们自己如何能实现一个类似 map() 的函数。我们有如下考虑

* map() 可以接收多个可迭代对象，说明这个函数具有可变数量的参数
* map() 返回一个迭代器，我们可以使用生成器函数来实现
* map() 本身的功能还是比较简单的，把输入参数按顺序传递给输出参数就行了

实现代码如下：

```python
# 自定义的 my_map 函数，旨在模拟内置的 map 函数的功能。
# 它接受一个函数和一个或多个可迭代对象作为参数。
def my_map(func, *iterables):
    # 将所有传入的可迭代对象转换为迭代器。
    # 这使得我们可以使用 next 函数从它们中提取值。
    iterators = [iter(it) for it in iterables]
    
    # 无限循环，直到其中一个迭代器耗尽为止。
    while True:
        # 使用一个临时列表来存储从各个迭代器中获取的元素。
        result = []
        # 遍历所有的迭代器。
        for it in iterators:
            try:
                # 从当前迭代器获取下一个元素，将获取到的元素添加到结果列表中。
                item = next(it)
                result.append(item)
            except StopIteration:
                # 如果某个迭代器中没有更多的元素可供提取，则退出循环并结束生成。
                return
        
        # 使用传入的函数对从迭代器中获取的元素进行操作，
        # 然后使用yield返回结果。
        yield func(*tuple(result))
        
# 测试自定义的 my_map 函数。
lst1 = [1, 2, 3]
lst2 = [4, 5, 6]
result = my_map(lambda x, y: x + y, lst1, lst2)
print(list(result))  # 输出: [5, 7, 9]

result = my_map(lambda x: x*x, lst1)
print(list(result))  # 输出: [1, 4, 9]
```

上面的程序复杂在要处理可变多个可迭代对象，但如果配合使用 zip() 函数，上面的代码可以被一句简单的生成器表达式替代：

```python
def my_map(func, *iterables):
    return (func(*items) for items in zip(*iterables))

# 测试
lst1 = [1, 2, 3]
lst2 = [4, 5, 6]
result = my_map(lambda x, y: x + y, lst1, lst2)
print(list(result))  # 输出: [5, 7, 9]
```

## filter

### 基本用法

filter() 用于从一个可迭代对象中过滤出满足某个条件的元素。它接受一个函数和一个可迭代对象。它返回一个新的迭代对象，其中只包含使输入函数返回 True 的原始元素。

我们在介绍生成器表达式时使用的另一个示例正好可以演示 filter() 函数的用法：假设我们需要从一个列表中选出长度大于 5 的单词，如果使用生成器表达式，代码如下：

```python
result = (word for word in words if len(word) > 5)
```

这个示例也可以使用 filter() 函数来实现：

```python
words = ["apple", "banana", "cherry", "date", "fig", "kiwi"]
long_words = filter(lambda x: len(x) > 5, words)
print(list(long_words))  # 输出: [banana', 'cherry']
```

filter() 函数只能接收一个可迭代对象，因此，它的实现比 map() 简单的多，只需要使用上面的生成器表达式就可以了：

```python
def my_filter(func, iterable):
    return (item for item in iterable if func(item))

# 测试
lst = [1, 2, 3, 4, 5, 6, 7, 8, 9]
evens = my_filter(lambda x: x % 2 == 0, lst)
print(list(evens))  # 输出: [2, 4, 6, 8]
```

### 生成素数序列

生成素数序列是应用 filter() 函数的一个经典示例。我们使用“埃拉托斯特尼筛选法”(Sieve of Eratosthenes)生成素数序列。其基本思路如下：

1. 列出从 2 开始往后的的所有整数
2. 找到列表中的第一个数字，这就是一个素数，在初始情况下，这是 2
3. 把所有该素数的倍数从列表中滤除
4. 跳回到 2 步，寻找下一个素数

程序的代码如下：

```python
from itertools import count

def prime_generator():
    # 生成素数序列的生成器
    numbers = count(2)         # 生成一个从 2 开始的整数序列
    while True:
        prime = next(numbers)  # 序列中，下一个没有被过滤掉的数字，是一个新的素数
        yield prime            # 返回当前素数
        # 过滤掉序列中所有能被当前素数整除的数
        numbers = filter(lambda x, prime=prime: x % prime, numbers)

# 测试
gen = prime_generator()
for _ in range(10):  # 获取前 10 个素数
    print(next(gen))
```

在上面程序里，itertools 库中的 count() 函数用于生成一个整数序列。我们在介绍生成器的时候，曾经实现过[一个类似的无限生成器](generator#惰性生成)：

```python
def count(n):
    # 生成从n开始的整数序列
    while True:
        yield n
        n += 1
```

像上面这种比较复杂的逻辑，就无法借助生成器表达式来实现了，使用高阶函数是一个更好的选择。不过，素数的生成器也并非必须使用 filter，只不过，如果不使用 filter，我们就需要自己维护一张表，列出所有的已知的非素数，这样程序会稍微繁琐一些，下面是不使用 filter 的素数生成器程序：

```python
def prime_generator():
    # 生成素数序列的生成器
    factors = {}  # 记录所有非素数的因子的字典
    q = 2         # 从 2 开始

    while True:
        if q not in factors:
            # q 不在非素数字典中，是一个新的素数
            yield q
            # q 的平方是仅以 q 为因子的最小合数
            factors[q*q] = [q]
        else:
            # q 不是素数，要找有同样因子的更大一点的其它合数
            for p in factors[q]:
                # p 是 q 的因子，比 q 大的下一个包含 p 因子的合数一定是 p+q  
                factors.setdefault(p + q, []).append(p)
            # q 已经处理过，删除以节省内存
            del factors[q]
        q += 1

# 测试：
gen = prime_generator()
for _ in range(10):
    print(next(gen))
```

如果，我们不需要太高的计算效率：不记录被滤除的数值，而是针对每个数都重新检查一下它是否可以被其它数整除。那么，我们可以使用更为简化的代码：一个生成器表达式即可，

```python
from itertools import count

gen = (i for i in count(2) if all(i % j != 0 for j in range(2, int(i**.5) + 1)))

for _ in range(10):  # 获取前 10 个素数
    print(next(gen))
```

## reduce

### 基本用法

reduce() 函数用于对序列的数据按照指定规则进行归并，最后产生一个累积的结果。函数的用法如下：

```python
functools.reduce(function, iterable[, initializer])
```

它接收三个参数：

* function: 是一个接受两个参数的函数。第一个参数是累积值，第二个参数是从 iterable 中取出的下一个元素
* iterable: 是输入序列或可迭代对象
* initializer: 是可选的，它是一个初始值，它会被放在累积结果的前面。如果提供了它，则迭代会从iterable中的第一个元素开始。

reduce() 函数首先把输入的 function 作用于列表中的前两个元素；然后再把 funciton 作用于刚才的结果和第三个元素；再把 funciton 作用于刚才的结果和第四个元素，以此类推，直到列表中的所有元素都被处理。也就是最终展开的结果是类似如下的表达式：

result = ... function( function( function(initializer, iterable[0]), iterable[1] ), iterable[2]), ...

比如，使用 reduce() 函数计算一个列表中所有整数的和：

```python
from functools import reduce

numbers = [1, 2, 3, 4, 5]
sum_result = reduce(lambda x, y: x + y, numbers)
print(sum_result)  # 输出: 15
```

函数 `lambda x, y: x + y` 用于求和，把它传递给 reduce() 函数，就可以用来计算输入列表中所有元素的和。

找到最大值的方法与求和极其类似：

```python
from functools import reduce

numbers = [5, 8, 2, 1, 9, 3]
max_value = reduce(lambda x, y: x if x > y else y, numbers)
print(max_value)  # 输出：9
```

字符串反转：

```python
from functools import reduce

s = "Hello"
reversed_string = reduce(lambda x, y: y + x, s)
print(reversed_string)  # 输出："olleH"
```

字典合并：

```python
from functools import reduce

list_of_dicts = [{"a": 1, "b": 2}, {"c": 3}, {"d": 4}]
combined_dict = reduce(lambda x, y: {**x, **y}, list_of_dicts)
print(combined_dict)  # 输出: {'a': 1, 'b': 2, 'c': 3, 'd': 4}
```

### 实现

reduce() 函数的结果通常是一个值，而不是迭代器。所以，也不需要利用生成器来实现它的功能。我们当然可以用循环来实现它的功能，不过下面给出一个使用递归实现的示例，帮助大家熟悉递归：

```python
def my_reduce(func, sequence, initial=None):
    # 如果初始值被设置，先考虑它
    if initial is not None:
        if not sequence:
            return initial
        else:
            return my_reduce(func, sequence[1:], func(initial, sequence[0]))
    
    # 如果序列只有一个元素，返回这个元素
    if len(sequence) == 1:
        return sequence[0]
    
    # 对序列的剩余部分调用 my_reduce
    # 将当前的元素和剩余部分的归约结果应用于 func
    return func(sequence[0], my_reduce(func, sequence[1:]))

# 测试
numbers = [1, 2, 3, 4, 5]
total = my_reduce(lambda x, y: x + y, numbers)
print(total)  # 输出：15

product = my_reduce(lambda x, y: x * y, numbers)
print(product)  # 输出：120
```

reducer 函数采用的左归并。如果需要右归并，把上面程序稍微改一下即可。

## sorted

Python 的 sorted() 函数可以对所有可迭代的对象进行排序。它与前文介绍的[列表的 sort 方法](list#排序)非常类似，它们有相似的算法和参数。最主要区别在于，列表的 sort 方法专用于列表排序，它会对列表就地排序，即直接修改原始列表。而 sorted() 函数可以对任何可迭代的对象进行排序，它返回一个新的排好序的列表，而不修改原始数据。

关于排序的算法，我们将在[数组排序](array#排序)一节进行介绍。这里主要介绍一下 sorted() 函数作为高阶函数的用法。它可以接受三个参数：

```python
sorted(iterable, *, key=None, reverse=False)
```

其中：
* iterable： 是要排序的可迭代对象。
* key： 一个只接受一个参数的函数，用于从每个元素中提取一个用于比较的关键字。默认值是 None（直接比较元素）。
* reverse： 布尔值。如果设置为 True，则列表元素将按降序而不是默认的升序排列。

key 这个函数，需要返回一个数据，sorted() 函数将使用它的返回值进行排序。比如，一组有正有负的数值排序，默认只是按照大小排序，但如果 key 的函数是 abs()，它返回的数据的绝对值，那么，sorted() 函数将会按照数据的绝对值进行排序：

```python
numbers = [3, -1, 4, -1, 5, -9, 2, -6]

# 直接排序
print(sorted(numbers))           # 输出： [-9, -6, -1, -1, 2, 3, 4, 5]
# 按绝对值排序
print(sorted(numbers, key=abs))  # 输出： [-1, -1, 2, 3, 4, 5, -6, -9]

words = ["banana", "pie", "Washington", "book"]

# 默认按字母表顺序排序 A~Z,a~z
print(sorted(words))           # 输出: ['Washington', 'banana', 'book', 'pie']
# 按单词长度排序
print(sorted(words, key=len))  # 输出: ['pie', 'book', 'banana', 'Washington']
```

sorted() 函数可以进行更加复杂的排序工作，尤其是对于复杂的输入数据，比如对于字典的列表这样的数据进行排序。key 函数的返回数值可以是一个元组，这样就可以实现多层排序，先按照一个关键字，也就是元组的第一个数据进行排序，在按照第二个关键字，次要的关键字进行排序，以此类推。

假设我们有一个员工列表，每个员工包括姓名年龄工资等数据。我们可以通过设置不同的可以，对他们进行各种排序

```python
employees = [
    {'姓名': '张三', '年龄': 45, '工资': 75000},
    {'姓名': '李四', '年龄': 30, '工资': 50000},
    {'姓名': '王五', '年龄': 22, '工资': 75000},
    {'姓名': '马六', '年龄': 22, '工资': 50000},
    {'姓名': '小明', '年龄': 30, '工资': 40000},
]

# 按年龄排序

print(sorted(employees, key=lambda e: e['年龄']))

# 按薪水排序，降序
print(sorted(employees, key=lambda e: e['工资'], reverse=True))

# 按薪水降序排序，薪水相同则按年龄升序排序
print(sorted(employees, key=lambda x: (-x['工资'], x['年龄'])))
```


## 练习

- 查找最长的单词：编写一个程序，找出输入字符串中最长的单词。比如输入 "Pythora is an amazing planet to live on"，输出 "Pythora"。
- 按字典键值排序：给定一个字典列表，比如 `data = [{"name": "Alice", "age": 25}, {"name": "Bob", "age": 22}, {"name": "Charlie", "age": 30}]`，按 age 的大小对字典中的数据排序。
- 找最大值：使用匿名函数和 reduce()，找出输入列表（比如 `[10, 3, 45, 2, 19]`）中的最大值。

