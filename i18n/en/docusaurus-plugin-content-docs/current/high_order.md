# Higher-Order Functions

A Higher-Order Function (HOF) is an important concept in functional programming. A function can be called a higher-order function if it accepts one or more functions as arguments, or returns a function as its result. If a higher-order function receives other functions as arguments, its behavior can be dynamically adjusted at runtime based on the functions passed to it.

Python has some built-in higher-order functions, including map(), filter(), and reduce(), which are frequently used in functional programming. Although map() and filter() are used very often in functional programming, in Python, list (or dictionary) comprehensions and generator expressions can essentially replace map() and filter() in functionality. In Python programs, the inhabitants of the planet Pythora prefer to use list comprehensions and generator expressions. However, to ensure code readability, list comprehensions and generator expressions are generally suitable for simple logic, while higher-order functions are more appropriate for implementing complex functionality.

## map

### Basic Usage

When introducing [generator expressions](generator#generator-expressions), we used a simple example: suppose we have an input iterator containing a set of data, and we want to generate a new iterator that produces a set of new data, where each number in the new data corresponds to the square of each number in the original sequence. Using a generator expression, the program can be written as follows.

```python
numbers = range(10)
squared = (x*x for x in numbers)

for num in squared:
    print(num)
```

In functional programming, there is another solution to this problem: using the map() function. The map() function accepts a function and an iterable as arguments, and returns a new iterator. Each element in the returned iterator is the result of passing each element of the input iterable through the given function. Rewriting the above code using map() gives:

```python
numbers = range(10)
squares = map(lambda x: x*x, numbers)

for num in squares:
    print(num)
```

In the example above, the arguments passed to map are: `numbers`, the iterable to be processed, and the anonymous function `lambda x: x*x`, which indicates that each element in the iterable should be squared.

### Using Multiple Iterables

When multiple iterables are provided to the map() function, it processes them in parallel. This means it takes the first element from each iterable and applies the function; then takes the second element from each iterable and applies the function again, and so on. For example:

```python
a = [1, 2, 3]
b = [10, 20, 30]
summed = map(lambda x, y: x + y, a, b)
print(list(summed))  # [11, 22, 33]
```

In the example above, the lambda function takes two parameters and adds them together. If the iterables passed to map() have different lengths, map() will stop when the shortest iterable is exhausted.

When using list comprehensions to process multiple iterables, you need to use the [zip()](loop#zip-function) function to convert multiple iterables into a single iterable before processing. However, map() can handle them directly.

### Implementing map()

Let's explore further how we might implement a function similar to map() ourselves. We have the following considerations:

* map() can accept multiple iterables, meaning the function has variable-length arguments
* map() returns an iterator, so we can implement it using a generator function
* The functionality of map() itself is relatively simple: it just passes the input arguments to the output function in order

The implementation code is as follows:

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

The complexity of the above program lies in handling multiple variable-length iterables. However, if used in conjunction with the zip() function, the above code can be replaced by a simple generator expression:

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

filter() is used to filter elements from an iterable that satisfy a certain condition. Its basic usage is as follows:

```python
filter(function, iterable)
```

It accepts a function and an iterable. It returns a new iterator containing only the original elements for which the input function returns True.

Another example we used when introducing generator expressions happens to demonstrate the usage of the filter() function: suppose we need to select words longer than 5 characters from a list. Using a generator expression, the code would be:

```python
result = (word for word in words if len(word) > 5)
```

This example can also be implemented using the filter() function:

```python
words = ["apple", "banana", "cherry", "date", "fig", "kiwi"]
long_words = filter(lambda x: len(x) > 5, words)
print(list(long_words))  # 输出: ['banana', 'cherry']
```

The filter() function only accepts one iterable, so its implementation is much simpler than map(). It can be done using just the generator expression above:

```python
def my_filter(func, iterable):
    return (item for item in iterable if func(item))

# 测试
lst = [1, 2, 3, 4, 5, 6, 7, 8, 9]
evens = my_filter(lambda x: x % 2 == 0, lst)
print(list(evens))  # 输出: [2, 4, 6, 8]
```

### Generating Prime Numbers

Generating prime numbers is a classic example of applying the filter() function. We will use the Sieve of Eratosthenes to generate a sequence of prime numbers. The basic idea is as follows:

1. List all integers starting from 2
2. Find the first number in the list — this is a prime. Initially, this is 2
3. Remove all multiples of that prime from the list
4. Return to step 2 to find the next prime

The program code is as follows:

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

In the program above, the count() function from the itertools library is used to generate an integer sequence. When introducing generators, we previously implemented [a similar infinite generator](generator#lazy-generation):

```python
def count(n):
    # 生成从n开始的整数序列
    while True:
        yield n
        n += 1
```

Logic as complex as the above cannot be implemented using generator expressions alone; using higher-order functions is a better choice. However, the prime number generator doesn't necessarily have to use filter. Without filter, we would need to maintain a table listing all known non-prime numbers, which makes the program slightly more cumbersome. Below is a prime number generator that does not use filter:

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

If we don't need very high computational efficiency — instead of recording filtered-out values, we simply re-check each number to see if it is divisible by any other number — we can use a much simpler piece of code: a single generator expression,

```python
from itertools import count

gen = (i for i in count(2) if all(i % j != 0 for j in range(2, int(i**.5) + 1)))

for _ in range(10):  # 获取前 10 个素数
    print(next(gen))
```

### Filtering Falsy Values

The filter() function has a special usage: if its function parameter is set to None, filter will use the "truthiness" of the elements as the filter condition by default. In other words, `filter(None, iterable)` is equivalent to `filter(lambda x: bool(x), iterable)`.

In Python, the following values are considered "falsy" (empty values): None, False, numeric 0 (including 0, 0.0, 0j, etc.), empty sequences ('', [], (), etc.), and empty collections (set(), dict(), etc.).

This usage can be used to quickly clean up "empty" values from a list:

```python
data = [None, 0, "Python", "", [], False, 42]
clean_data = list(filter(None, data))
print(clean_data)
# 输出: ['Python', 42]
```

It can also be used to filter empty lines when processing file data:

```python
lines = ["line1\n", "\n", "line2\n", "", "line3"]
non_empty_lines = list(filter(None, lines))
print(non_empty_lines)
# 输出: ['line1\n', '\n', 'line2\n', 'line3']
```

Although `"\n"` is an empty line, as a string, it is not an empty value. If you need stricter filtering to remove all empty lines, you can adjust the filter condition slightly:

```python
lines = ["line1\n", "\n", "line2\n", "", "line3"]
non_empty_lines = list(filter(lambda x: x.strip(), lines))
print(non_empty_lines)
# 输出: ['line1\n', 'line2\n', 'line3']
```

## Fold

In functional programming, Fold (also called reduce or accumulate) is an operation that reduces a data structure (typically a list) to a single value.

Based on the direction of processing and the way of combining (parenthesization), it is divided into Left Fold (left reduce) and Right Fold (right reduce). Although for associative operations like addition (`+`), both produce the same result, for operations like subtraction (`-`), division (`/`), or string concatenation, the results and the execution process are completely different.

### Core Difference: Parenthesization

Suppose we have a list `[1, 2, 3]` and a binary operation function `f(x, y)` (or operator $\oplus$ ).

#### Left Fold

- Direction: Left to right.
- Logic: First combine the first two elements, then combine the result with the third element, and so on.
- Mathematical expression: $$((1 \oplus 2) \oplus 3)$$
- Or in function form: $$f(f(1, 2), 3)$$
- Intuitive understanding: The accumulator is like a snowball, rolling from left to right, sweeping in elements along the way.

#### Right Fold

- Direction: Right to left (logical combination order).
- Logic: First combine the last two elements, then use the result as an argument to combine with the third-to-last element, and so on.
- Mathematical expression: $$(1 \oplus (2 \oplus 3))$$
- Or in function form: $$f(1, f(2, 3))$$
- Intuitive understanding: Through recursion, first go deep into the rightmost end of the list to get a result, then backtrack layer by layer.

### Demonstration: Subtraction

Subtraction is not associative (i.e., $(a-b)-c \neq a-(b-c)$), so it shows the difference most clearly.

Assume the list is `[1, 2, 3]`, with an initial value of 0 (reduce usually has no initial value, but here for simplicity we use the list elements directly).

#### Left Fold

Computation order: `((1 - 2) - 3)`

- Step 1: `1 - 2 = -1`
- Step 2: `-1 - 3 = -4`
- Result: -4

#### Right Fold

Computation order: `(1 - (2 - 3))`

- Step 1 (innermost): `2 - 3 = -1`
- Step 2 (backtrack): `1 - (-1) = 2`
- Result: 2

### Code Implementation and Python Features

In Python, the standard library `functools.reduce` implements left fold. Python does not have a built-in right fold function, because Python's support for deep recursion is limited.

#### Left Fold

Left fold is well-suited for implementation with a loop, offering high efficiency and no recursion depth limit.

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

#### Right Fold

Right fold is inherently recursive in structure. It must first process the "tail" of the list, obtain a result, and then compute with the "current head" element.

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

The reduce() function is used to reduce a sequence of data according to a specified rule, ultimately producing an accumulated result. The function is used as follows:

```python
functools.reduce(function, iterable[, initializer])
```

It takes three parameters:

* function: A function that takes two arguments. The first argument is the accumulated value, and the second argument is the next element taken from iterable
* iterable: The input sequence or iterable
* initializer: Optional, an initial value that is placed before the accumulated result. If provided, iteration starts from the first element of the iterable.

The reduce() function first applies the input function to the first two elements of the list; then applies the function to that result and the third element; then applies the function to that result and the fourth element, and so on, until all elements in the list have been processed. The final expanded result is an expression similar to the following:

result = ... function( function( function(initializer, iterable[0]), iterable[1] ), iterable[2]), ...

For example, using the reduce() function to calculate the sum of all integers in a list:

```python
from functools import reduce

numbers = [1, 2, 3, 4, 5]
sum_result = reduce(lambda x, y: x + y, numbers)
print(sum_result)  # 输出: 15
```

The function `lambda x, y: x + y` is used for summation; passing it to the reduce() function allows us to calculate the sum of all elements in the input list.

Finding the maximum value is very similar to summation:

```python
from functools import reduce

numbers = [5, 8, 2, 1, 9, 3]
max_value = reduce(lambda x, y: x if x > y else y, numbers)
print(max_value)  # 输出：9
```

Reversing a string:

```python
from functools import reduce

s = "Hello"
reversed_string = reduce(lambda x, y: y + x, s)
print(reversed_string)  # 输出："olleH"
```

Merging dictionaries:

```python
from functools import reduce

list_of_dicts = [{"a": 1, "b": 2}, {"c": 3}, {"d": 4}]
combined_dict = reduce(lambda x, y: {**x, **y}, list_of_dicts)
print(combined_dict)  # 输出: {'a': 1, 'b': 2, 'c': 3, 'd': 4}

# 注意：这种写法每次都会创建新字典，数据量大时性能较低。
```

### Implementation

The result of the reduce() function is typically a single value, not an iterator. Therefore, there is no need to use generators to implement its functionality. We have already implemented the fold functionality using a loop earlier; below is an example using recursion:

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

#### Implementing Right Fold with reduce in Python

The reduce() function uses left fold. If you insist on doing a right fold in Python, you typically don't need to write a recursive function. You can simply reverse the input list and then use the reduce() function. Note that the parameter order may also need adjustment, depending on whether the function is commutative. For example, implementing a right fold for subtraction:

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

Python's sorted() function can sort any iterable. It is very similar to the [list sort method](list#sorting) introduced earlier, sharing similar algorithms and parameters. The main difference is that the list sort method is specifically for sorting lists in-place — it directly modifies the original list. In contrast, the sorted() function can sort any iterable and returns a new sorted list without modifying the original data.

The sorting algorithm will be introduced in the [array sorting](array#sorting) section. Here, we will mainly cover the usage of sorted() as a higher-order function. It accepts three parameters:

```python
sorted(iterable, *, key=None, reverse=False)
```

Where:
* iterable: The iterable to be sorted.
* key: A function that takes a single argument and is used to extract a comparison key from each element. The default is None (elements are compared directly).
* reverse: A boolean value. If set to True, the list elements will be sorted in descending order instead of the default ascending order.

The key function needs to return a value, and sorted() will use its return value for sorting. For example, when sorting a set of numbers containing both positive and negative values, by default they are sorted by magnitude. But if the key function is abs(), which returns the absolute value, then sorted() will sort by absolute value:

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

The sorted() function can handle more complex sorting tasks, especially for complex input data such as sorting a list of dictionaries. The return value of the key function can be a tuple, enabling multi-level sorting: first by one key (the first element of the tuple), then by a second key (a secondary key), and so on.

Suppose we have a list of employees, each with data such as name, age, and salary. We can sort them in various ways by setting different key functions.

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

- Find the longest word: Write a program to find the longest word in an input string. For example, given the input "Pythora is an amazing planet to live on", the output should be "Pythora".
- Sort by dictionary key: Given a list of dictionaries, such as `data = [{"name": "Alice", "age": 25}, {"name": "Bob", "age": 22}, {"name": "Charlie", "age": 30}]`, sort the dictionaries in the data by age.
- Find the maximum value: Use an anonymous function and reduce() to find the maximum value in an input list (e.g., `[10, 3, 45, 2, 19]`). Although Python has a built-in max() function, please try to implement it using reduce.
