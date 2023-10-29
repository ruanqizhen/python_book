# 高阶函数

高阶函数（Higher-Order Function，HOF）是函数式编程中的一个重要概念。高阶函数满足以下两个条件之一：

接受一个或多个函数作为参数。这允许函数的行为在运行时基于传递给它的函数进行动态更改。

返回一个函数。这允许高阶函数产生新的函数。

Python 中有一些内置的高阶函数，最常见的是 map(), filter(), 和 reduce()。此外，sorted() 也可以视为高阶函数，当使用其 key 参数时。

## map

### 基本用法

在介绍生成器表达式的时候，我们用了一个简单例子：假设我们有一个输入迭代器，其中包含了一组数据，我们希望生成一个新的迭代器，可以产生一组新数据，这组新数据中的每个数，对应原数列中每个数的平方值。使用生成器表达式可以写成如下程序。

```python
numbers = range(10)
squared = (x*x for x in numbers)

for num in squared:
    print(num)
```

使用函数式编程，对于这个问题，还有另一种解决方案：使用 map() 函数。map() 函数接受一个函数和一个可迭代对象作为输入，然后返回一个新的迭代对象，其中每个元素都是将原始元素传递给该函数的结果。使用 map() 函数改写上面的代码如下：

```python
numbers = range(10)
squares = map(lambda x: x*x, numbers)

for num in squared:
    print(num)
```

### 使用多个可迭代对象

当给 map() 提供多个可迭代对象时，它会并行处理这些对象。这意味着它会取每个可迭代对象的第一个元素，然后应用函数；接着取每个可迭代对象的第二个元素，再次应用函数，依此类推。比如：

```python
a = [1, 2, 3]
b = [10, 20, 30]
summed = map(lambda x, y: x + y, a, b)
print(list(summed))  # [11, 22, 33]
```

在上面这个示例中，lambda 函数接收两个参数，并将它们加在一起。如果传递给 map() 的可迭代对象长度不同，map() 将在最短的可迭代对象结束时停止。

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

上面的程序复杂在要处理可变多个可迭代对象，如果使用 Python 内置的 zip 函数，就可以大大简化程序。zip() 函数从每个传入的可迭代对象中取一个元素，然后将这些元素组成一个元组，作为新迭代器的一个元素。然后它再从每个可迭代对象中取下一个元素，再次组成一个元组，依此类推。当其中任意一个可迭代对象被遍历完后，zip() 停止创建元组。

如果使用 zip() 函数，上面的代码可以被一句简单的生成器表达式替代：

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

在介绍生成器表达式的时候，使用的另一个例子正好可以演示 filter：假设我们需要从一个列表中选出长度大于 3 的字符串，如果使用生成器表达式，代码如下：

```python
result = (word for word in words if len(word) > 3)
```

这个示例也可以使用 filter() 函数来实现：

```python
words = ["apple", "banana", "cherry", "date", "fig", "kiwi"]
long_words = filter(lambda x: len(x) > 3, words)
print(list(long_words))  # 输出: ['apple', 'banana', 'cherry']
```

filter() 函数只能接收一个迭代对象，因此，它的实现比 map() 简单的多，甚至不需要使用生成器函数，只要使用上面的生成器表达式就可以了：

```python
def my_filter(func, iterable):
    return (item for item in iterable if func(item))

# 测试
lst = [1, 2, 3, 4, 5, 6, 7, 8, 9]
evens = my_filter(lambda x: x % 2 == 0, lst)
print(list(evens))  # 输出: [2, 4, 6, 8]
```

### 生成素数序列

使用 filter() 函数的一个经典示例是生成素数序列，它使用“埃拉托斯特尼筛选法”(Sieve of Eratosthenes)生成素数序列。其基本思路如下：
1. 列出从 2 开始往后的的所有整数
2. 找到列表中的第一个数字，这就是一个素数，在初始情况下，这是 2
3. 把所有该素数的倍数从列表中滤除
4. 跳回到 2 步，寻找下一个素数

程序的代码如下：

```python
from itertools import count

def prime_generator():
    # 生成素数序列的生成器
    numbers = count(2)         # 从2开始的整数序列
    while True:
        prime = next(numbers)  # 获取序列中的下一个数字
        yield prime            # 返回当前素数
        # 过滤掉序列中所有能被当前素数整除的整数
        numbers = filter(lambda x, prime=prime: x % prime, numbers)

# 测试
gen = prime_generator()
for _ in range(10):  # 获取前 10 个素数
    print(next(gen))
```

在上面程序里，itertools 库中的 count() 函数用于生成一个整数序列。它的实现方法如下：

```python
def count(n):
	# 生成从n开始的整数序列
	while True:
		yield n
		n += 1
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

reduce() 函数首先把输入的 funtion 作用于列表中的前两个元素；然后再把 funciton 作用于刚才的结果和第三个元素；再把 funciton 作用于刚才的结果和第四个元素，以此类推，直到列表中的所有元素都被处理。也就是最终展开的结果是类似如下的表达式：

result = ... function( function( function(initializer, iterable[0]), iterable[1] ), iterable[2]), ...

比如，使用 reduce() 函数计算一个列表中所有整数的和：

```python
from functools import reduce

numbers = [1, 2, 3, 4, 5]
sum_result = reduce(lambda x, y: x + y, numbers)
print(sum_result)  # 输出: 15
```

找到最大值：

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