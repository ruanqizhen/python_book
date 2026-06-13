# Higher-Order Functions

A Higher-Order Function (HOF) is a core concept in functional programming. A function is considered a higher-order function if it meets at least one of the following criteria: it accepts one or more functions as arguments, or it returns a function as its result. When a higher-order function takes other functions as inputs, its behavior can be dynamically configured at runtime based on the functions passed to it.

Python provides several built-in higher-order functions, including `map()`, `filter()`, and `reduce()`, which are widely used in functional programming. Although `map()` and `filter()` are standard functional programming tools, in Python, list (or dictionary) comprehensions and generator expressions can essentially replace them. Indeed, the inhabitants of the planet Pythora generally prefer comprehensions and generator expressions. However, to maintain readability, comprehensions and generator expressions are best suited for simple logic, whereas higher-order functions are more appropriate for implementing complex behavior.

## map

### Basic Usage

When we introduced [generator expressions](generator#generator-expressions), we used a simple example: suppose we have an input iterator containing a set of data, and we want to generate a new iterator that yields the squares of those numbers. Using a generator expression, the program can be written as follows:

```python
numbers = range(10)
squared = (x*x for x in numbers)

for num in squared:
    print(num)
```

Functional programming provides another solution to this problem: the `map()` function. `map()` accepts a function and an iterable as arguments, and returns a new iterator. Each element yielded by the returned iterator is the result of applying the given function to the corresponding element of the input iterable. Rewriting the code using `map()` gives:

```python
numbers = range(10)
squares = map(lambda x: x*x, numbers)

for num in squares:
    print(num)
```

In the example above, the arguments passed to `map()` are the iterable to be processed (`numbers`) and the anonymous function `lambda x: x*x`, which specifies that each element in the iterable should be squared.

### Using Multiple Iterables

When multiple iterables are passed to the `map()` function, it processes them in parallel. It takes the first element from each iterable and applies the function, then takes the second element from each iterable and applies the function, and so on. For example:

```python
a = [1, 2, 3]
b = [10, 20, 30]
summed = map(lambda x, y: x + y, a, b)
print(list(summed))  # [11, 22, 33]
```

In this example, the lambda function takes two parameters and adds them together. If the iterables passed to `map()` are of different lengths, `map()` stops as soon as the shortest iterable is exhausted.

When using list comprehensions to process multiple iterables, you must use the [zip()](loop#the-zip-function) function to pair the elements before processing them. In contrast, `map()` can handle multiple iterables directly.

### Implementing map()

Let's explore how we might implement a function similar to `map()` ourselves. Consider the following:

* `map()` can accept multiple iterables, meaning our function must support variable-length arguments.
* `map()` returns an iterator, so we can implement it using a generator function.
* The core functionality of `map()` is simple: it applies the target function to the input elements in order.

Here is the implementation:

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

The main complexity in the program above is handling multiple iterables of variable lengths. However, if we use the `zip()` function, we can simplify this logic significantly into a generator expression:

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

### Basic Usage

`filter()` is used to select elements from an iterable that satisfy a specific condition. Its basic usage is as follows:

```python
filter(function, iterable)
```

It accepts a function and an iterable, returning a new iterator that yields only those elements for which the input function returns `True`.

An example we used when introducing generator expressions also demonstrates the utility of the `filter()` function: suppose we want to select words longer than 5 characters from a list. With a generator expression, we would write:

```python
result = (word for word in words if len(word) > 5)
```

This can also be implemented using the `filter()` function:

```python
words = ["apple", "banana", "cherry", "date", "fig", "kiwi"]
long_words = filter(lambda x: len(x) > 5, words)
print(list(long_words))  # 输出: ['banana', 'cherry']
```

Since `filter()` only accepts a single iterable, its implementation is much simpler than `map()`. We can implement it using a generator expression:

```python
def my_filter(func, iterable):
    return (item for item in iterable if func(item))

# 测试
lst = [1, 2, 3, 4, 5, 6, 7, 8, 9]
evens = my_filter(lambda x: x % 2 == 0, lst)
print(list(evens))  # 输出: [2, 4, 6, 8]
```

### Generating Prime Numbers

Generating prime numbers is a classic application of the `filter()` function. We will use the Sieve of Eratosthenes to generate a sequence of prime numbers, based on the following process:

1. List all integers starting from 2.
2. Find the first number in the list — this is a prime. Initially, this is 2.
3. Remove all multiples of that prime from the list.
4. Return to step 2 to find the next prime.

Here is the implementation:

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

In the program above, the `count()` function from the `itertools` library generates an infinite sequence of integers. When we introduced generators, we implemented a similar generator:

```python
def count(n):
    # 生成从n开始的整数序列
    while True:
        yield n
        n += 1
```

More complex logic like this cannot be easily implemented with generator expressions alone; using higher-order functions is a cleaner choice. That said, a prime number generator does not strictly require `filter()`. Without `filter()`, we would need to maintain a dictionary of composite numbers and their prime factors, which is slightly more complex. Below is an alternative implementation:

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

If computational efficiency is not a priority, we can skip maintaining a factor dictionary and instead check each number for primality directly. This allows us to use a much simpler generator expression:

```python
from itertools import count

gen = (i for i in count(2) if all(i % j != 0 for j in range(2, int(i**.5) + 1)))

for _ in range(10):  # 获取前 10 个素数
    print(next(gen))
```

### Filtering Falsy Values

The `filter()` function has a special behavior: if the function parameter is `None`, `filter()` defaults to checking the truthiness of the elements. In other words, `filter(None, iterable)` is equivalent to `filter(lambda x: bool(x), iterable)`.

In Python, the following values are considered "falsy" (or empty): `None`, `False`, numeric zeros (`0`, `0.0`, `0j`, etc.), empty sequences (`''`, `[]`, `()`, etc.), and empty collections (like `set()` and `dict()`).

You can use this feature to quickly filter out falsy values from a list:

```python
data = [None, 0, "Python", "", [], False, 42]
clean_data = list(filter(None, data))
print(clean_data)
# 输出: ['Python', 42]
```

It can also be useful for filtering blank lines when processing file content:

```python
lines = ["line1\n", "\n", "line2\n", "", "line3"]
non_empty_lines = list(filter(None, lines))
print(non_empty_lines)
# 输出: ['line1\n', '\n', 'line2\n', 'line3']
```

Although `"\n"` represents an empty line visually, as a non-empty string it is considered truthy. If you need a stricter filter to remove all blank lines (including whitespace-only lines), you can adjust the filter condition like this:

```python
lines = ["line1\n", "\n", "line2\n", "", "line3"]
non_empty_lines = list(filter(lambda x: x.strip(), lines))
print(non_empty_lines)
# 输出: ['line1\n', 'line2\n', 'line3']
```

## Fold

In functional programming, a **Fold** (also called `reduce` or `accumulate`) is an operation that processes a data structure (typically a list) to reduce it to a single value.

Depending on the direction of processing and how operations are grouped (parenthesized), folds are split into **Left Fold** (`foldl` / left reduce) and **Right Fold** (`foldr` / right reduce). While associative operations like addition (`+`) yield the same result regardless of grouping, non-associative operations like subtraction (`-`), division (`/`), or string concatenation behave differently.

### Core Difference: Parenthesization

Suppose we have a list `[1, 2, 3]` and a binary function `f(x, y)` (represented by the operator $\oplus$).

#### Left Fold

- **Direction**: Left to right.
- **Logic**: Combine the first two elements, then combine that result with the third element, and so on.
- **Mathematical expression**: $$((1 \oplus 2) \oplus 3)$$
- **Functional form**: $$f(f(1, 2), 3)$$
- **Analogy**: The accumulator is like a snowball rolling from left to right, gathering elements along the way.

#### Right Fold

- **Direction**: Right to left (logical grouping).
- **Logic**: Combine the last two elements, then combine the second-to-last element with that result, and so on.
- **Mathematical expression**: $$(1 \oplus (2 \oplus 3))$$
- **Functional form**: $$f(1, f(2, 3))$$
- **Analogy**: Using recursion, we traverse to the rightmost end of the list to compute the initial result, then backtrack layer by layer to the left.

### Demonstration: Subtraction

Subtraction is non-associative (i.e., $(a - b) - c \neq a - (b - c)$), which clearly highlights the distinction.

Let's fold the list `[1, 2, 3]`. For simplicity, we won't use an external initial value, relying instead on the elements themselves.

#### Left Fold

Evaluation order: `((1 - 2) - 3)`

- **Step 1**: $1 - 2 = -1$
- **Step 2**: $-1 - 3 = -4$
- **Result**: $-4$

#### Right Fold

Evaluation order: `(1 - (2 - 3))`

- **Step 1 (innermost)**: $2 - 3 = -1$
- **Step 2 (backtrack)**: $1 - (-1) = 2$
- **Result**: $2$

### Implementation and Python's Limitations

In Python, the standard library function `functools.reduce()` implements a left fold. Python does not provide a built-in right fold function, largely because Python does not optimize for deep recursion.

#### Left Fold Implementation

A left fold is easily implemented using a loop, which is efficient and avoids recursion depth limits:

```python
def fold_left(func, sequence, initial=None):
    it = iter(sequence)
    if initial is None:
        value = next(it)
    else:
        value = initial
    
    for element in it:
        # 核心：累积值在左，新元素在右
        value = func(value, element) 
    return value

# 测试
print(fold_left(lambda x, y: x - y, [1, 2, 3])) 
# 输出: -4  -> ((1-2)-3)

```

#### Right Fold Implementation

A right fold is naturally recursive. It must resolve the tail of the list first before combining the result with the head element:

```python
def fold_right(func, sequence, initial=None):
    if not sequence:
        if initial is None:
            raise ValueError("Empty sequence with no initial value")
        return initial
        
    if len(sequence) == 1 and initial is None:
        return sequence[0]
        
    # 如果没有初始值，拿出第一个，处理剩余的
    head = sequence[0]
    tail = sequence[1:]
    
    if initial is None:
        # 递归调用：先算出 tail 的归并结果
        return func(head, fold_right(func, tail))
    else:
        return func(head, fold_right(func, tail, initial))

# 测试
print(fold_right(lambda x, y: x - y, [1, 2, 3]))
# 输出: 2   -> (1-(2-3))

```

## reduce

### Basic Usage

The `reduce()` function applies a binary function to the elements of an iterable in a cumulative way, reducing the sequence to a single value. It is defined as:

```python
functools.reduce(function, iterable[, initializer])
```

It takes three parameters:

* `function`: A function that accepts two arguments. The first is the accumulated value (or initializer), and the second is the next element from the iterable.
* `iterable`: The sequence to be reduced.
* `initializer`: (Optional) A starting value placed before the sequence elements. If provided, the reduction starts by combining the initializer with the first element of the iterable; otherwise, it starts with the first two elements of the iterable.

The `reduce()` function applies the target function to the first two elements, then applies it to that result and the third element, and so on, until the sequence is exhausted. Mathematically, with an initializer:

`result = function(function(function(initializer, iterable[0]), iterable[1]), iterable[2])`

For example, we can calculate the sum of all integers in a list using `reduce()`:

```python
from functools import reduce

numbers = [1, 2, 3, 4, 5]
sum_result = reduce(lambda x, y: x + y, numbers)
print(sum_result)  # 输出: 15
```

Finding the maximum value is very similar to summation:

```python
from functools import reduce

numbers = [5, 8, 2, 1, 9, 3]
max_value = reduce(lambda x, y: x if x > y else y, numbers)
print(max_value)  # 输出：9
```

We can also reverse a string using `reduce()`:

```python
from functools import reduce

s = "Hello"
reversed_string = reduce(lambda x, y: y + x, s)
print(reversed_string)  # 输出："olleH"
```

Or merge a list of dictionaries:

```python
from functools import reduce

list_of_dicts = [{"a": 1, "b": 2}, {"c": 3}, {"d": 4}]
combined_dict = reduce(lambda x, y: {**x, **y}, list_of_dicts)
print(combined_dict)  # 输出: {'a': 1, 'b': 2, 'c': 3, 'd': 4}

# 注意：这种写法每次都会创建新字典，数据量大时性能较低。
```

### Implementation

Because `reduce()` returns a single value rather than an iterator, we do not need generator syntax to implement it. Since we already showed a loop-based left fold, here is a recursive implementation of `reduce()`:

```python
def my_reduce(func, sequence, initial=None):
    # 如果初始值被设置，先考虑它
    if not sequence:
        if initial is None:
            raise TypeError("my_reduce() of empty sequence with no initial value")
        return initial
    
    # 如果没有 initial，用第一个元素作为初始值
    if initial is None:
        return my_reduce(func, sequence[1:], sequence[0])
    
    # 左归并：先算 func(acc, x)，再递归
    return my_reduce(func, sequence[1:], func(initial, sequence[0]))

# 测试
numbers = [1, 2, 3, 4, 5]
total = my_reduce(lambda x, y: x + y, numbers)
print(total)  # 输出：15

product = my_reduce(lambda x, y: x * y, numbers)
print(product)  # 输出：120
```

#### Implementing a Right Fold using `reduce()`

Since `reduce()` performs a left fold, if you need to perform a right fold, you don't necessarily have to write a recursive function. Instead, you can reverse the sequence and reverse the argument order inside the combining function (especially if the operation is non-commutative). Here is how you can perform a right fold for subtraction using `reduce()`:

```python
from functools import reduce

data = [1, 2, 3]
res = reduce(lambda acc, x: x - acc, reversed([1, 2, 3]))
# 步骤：
# 1. 初始: [3, 2, 1], 取 3
# 2. 遇到 2: 2 - 3 = -1
# 3. 遇到 1: 1 - (-1) = 2

print(res) # 输出 2
```

## sorted

Python's `sorted()` function can sort any iterable. It behaves similarly to the [list sort method](list#sorting) introduced earlier, sharing the same sorting algorithm and parameters. The main difference is that `list.sort()` sorts the list in-place (modifying the original list), whereas `sorted()` accepts any iterable and returns a new sorted list, leaving the original data unchanged.

We will explore the underlying sorting algorithm in the [array sorting](array#sorting) section. Here, we focus on the usage of `sorted()` as a higher-order function. It is defined as:

```python
sorted(iterable, *, key=None, reverse=False)
```

Where:

* `iterable`: The sequence or collection to be sorted.
* `key`: A function that extracts a comparison key from each element (e.g., `key=str.lower` or `key=len`). The default is `None`, which compares elements directly.
* `reverse`: A boolean. If set to `True`, the list is sorted in descending order.

The `key` function is applied to each element, and its return values are used to determine the sorting order. For example, when sorting a mixture of positive and negative numbers, the default order is ascending numeric value. However, if we specify `key=abs`, the numbers are sorted by their absolute values:

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

`sorted()` can also handle complex sorting tasks, such as sorting a list of dictionaries or objects. The `key` function can return a tuple to perform multi-level sorting: sorting by the first element of the tuple first, and breaking ties using subsequent elements.

Suppose we have a list of employees, represented as dictionaries. We can sort them in multiple ways by customizing the `key` function:

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

## Exercises

* **Find the longest word**: Write a program to find the longest word in an input string. For example, given the input `"Pythora is an amazing planet to live on"`, the output should be `"Pythora"`.
* **Sort by dictionary value**: Given a list of dictionaries, such as `data = [{"name": "Alice", "age": 25}, {"name": "Bob", "age": 22}, {"name": "Charlie", "age": 30}]`, sort the dictionaries by the value of the `"age"` key.
* **Find the maximum value**: Use an anonymous function and `reduce()` to find the maximum value in a list (e.g., `[10, 3, 45, 2, 19]`). Although Python has a built-in `max()` function, implement it using `reduce()` to practice.
