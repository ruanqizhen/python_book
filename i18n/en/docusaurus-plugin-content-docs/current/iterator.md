# Data Containers

## Custom Iterators

We have encountered iterators several times in preceding sections and saw how to construct them using [generators](generator#generator-functions). In this section, we will explore the internal mechanisms of Python's iterator protocol and learn how to implement custom iterators using object-oriented programming.

### Iterator Protocol

The **iterator protocol** requires two special methods: `__iter__()` and `__next__()`. Any class implementing these methods is an iterator.

* `__iter__()`: Returns the iterator object itself. This is called when passing the iterator to the built-in `iter()` function or when initiating a `for` loop.
* `__next__()`: Returns the next element. This is called when passing the iterator to the built-in `next()` function. When the sequence is exhausted, this method must raise a `StopIteration` exception to signal completion. Each invocation of `__next__()` advances the iterator's internal state.

Because iterators evaluate lazily, they do not hold all elements in memory simultaneously. Instead, they calculate and yield each element on demand. This makes them ideal for processing large or infinite datasets. Note that iterators can only move forward—you cannot reset them, go backward, or copy their state.

Here is a custom iterator that yields consecutive integers up to a specified limit:

```python
class CountUpTo:
    def __init__(self, max):
        self.max = max
        self.num = 0  # 初始化 self.num

    def __iter__(self):
        return self

    def __next__(self):
        if self.num < self.max:
            result = self.num
            self.num += 1
            return result
        else:
            raise StopIteration

# 创建迭代器
counter = CountUpTo(5)
# 测试
print(next(counter))     # 输出: 0
print(next(counter))     # 输出: 1
print(next(counter))     # 输出: 2
print(next(counter))     # 输出: 3
print(next(counter))     # 输出: 4
# print(next(counter))     # 已经到头，再调用 next 会产生 StopIteration 异常
```

The `CountUpTo` class has identical functionality to the `count_up_to()` [generator function](generator#generator-functions) we built earlier, but uses class syntax instead.

### Instantiating Iterators from Iterables

In most everyday code, you don't write custom iterators. Instead, you obtain them from built-in **iterables** (objects capable of returning an iterator, such as lists, strings, and dictionaries). For example, you can get an iterator from a list using `iter()`:

```python
my_list = [1, 2, 3]
my_iter = iter(my_list)

print(next(my_iter))  # 输出 1
print(next(my_iter))  # 输出 2
```

Here, `my_list` is the iterable, and `my_iter` is the active iterator generated from it.

## itertools Library

Python's standard library provides the `itertools` module, containing highly optimized functions for combining, filtering, and manipulating sequences of data. Using `itertools` makes your code faster and more memory-efficient. Let's cover the most common and useful functions in the module.

### Infinite Iterators

* count(start=0, step=1): Generates an infinite arithmetic sequence starting from start, incrementing by step.
* cycle(iterable): Repeats the given sequence infinitely.
* repeat(object[, times]): Repeats an object, infinitely or a specified number of times.

We previously used `count()` when [generating prime numbers](high_order#generating-prime-numbers).

```python
from itertools import count, cycle, repeat

# 从 10 开始的无限等差数列，步长为 2
for num in count(10, 2):
    if num > 20:   # 为了避免无限循环，添加一个退出条件
        break
    print(num)

# 无限重复列表 [1, 2, 3]
counter = 0
for item in cycle([1, 2, 3]):
    if counter > 8:  # 为了避免无限循环，添加一个退出条件
        break
    print(item)
    counter += 1

# 重复字符串 "Hello" 5 次
for item in repeat("Hello", 5):
    print(item)
```

When working with infinite streams, you must take care to prevent [infinite loops](loop#infinite-loop). For example, never try to unpack an infinite generator using the star operator (e.g., `print(*count())`) or convert it directly to a list, as this will consume all available RAM and crash the program.

Always use conditional checks, slicers, or limits to process infinite streams safely.

### Finite Iterators

There are many types of finite iterators. Let's introduce them using examples:

#### Accumulation

accumulate(iterable[, func, *, initial=None]): Returns accumulated sums or the accumulated results of other binary functions.

```python
from itertools import accumulate
import operator

# 累加
data = [1, 2, 3, 4, 5]
result = list(accumulate(data))
print(result)  # 输出: [1, 3, 6, 10, 15]

# 累积乘积
result = list(accumulate(data, operator.mul))
print(result)  # 输出: [1, 2, 6, 24, 120]
```

The `accumulate()` function is similar to [`reduce()`](high_order#reduce). The main difference is that `reduce()` returns only the final cumulative result, whereas `accumulate()` yields every intermediate step in the reduction.

#### Chaining

chain(*iterables): Chains multiple iterators into a single long sequence.

```python
from itertools import chain

# 连接多个列表
result = list(chain([1, 2, 3], ['a', 'b', 'c']))
print(result)  # 输出: [1, 2, 3, 'a', 'b', 'c']
```

While `chain()` behaves similarly to the `+` operator, `+` requires matching sequence types and allocates a new combined collection in memory. In contrast, `chain()` works with arbitrary iterables and yields values lazily, making it highly memory-efficient for large datasets.

#### Filtering

The following functions filter datasets in specialized ways, similar to the [`filter()`](high_order#filter) function.

* compress(data, selectors): Filters elements in data based on the boolean values in selectors.

```python
from itertools import compress

# 根据布尔值筛选元素
data = [1, 2, 3, 4, 5]
selectors = [True, False, True, False, True]
result = list(compress(data, selectors))
print(result)  # 输出: [1, 3, 5]
```

While `filter()` applies a test function to each element, `compress()` uses a parallel boolean selector sequence to filter elements.

* dropwhile(predicate, iterable): Skips elements while predicate is true, then returns the remaining elements.

```python
from itertools import dropwhile

# 当元素小于 3 时跳过
result = list(dropwhile(lambda x: x < 3, [1, 2, 3, 4, 5, 2, 1]))
print(result)  # 输出: [3, 4, 5, 2, 1]
```

Unlike `filter()`, which checks every item in a sequence, `dropwhile()` only checks elements at the beginning of the stream. Once the condition evaluates to `False`, it stops checking and yields all remaining elements without further inspection.

* takewhile(predicate, iterable): Yields elements while predicate is true, stops when it becomes false.

```python
from itertools import takewhile

# 当元素小于 3 时产生元素
result = list(takewhile(lambda x: x < 3, [1, 2, 3, 4, 5]))
print(result)  # 输出: [1, 2]
```

* filterfalse(predicate, iterable): Yields elements for which predicate returns false.

```python
from itertools import filterfalse

# 产生使得 lambda 返回假的元素
result = list(filterfalse(lambda x: x % 2, [1, 2, 3, 4, 5]))
print(result)  # 输出: [2, 4]
```

`filterfalse()` returns elements for which the test function evaluates to `False`, reversing the behavior of `filter()`.

#### Slicing

* islice(iterable, start, stop[, step]): Returns selected elements from the sequence by slicing.

While standard slicing (`[start:stop:step]`) only works on concrete sequence types like lists or strings, `islice()` performs lazy slicing on any arbitrary iterable.

```python
from itertools import islice

# 从序列中切片
result = islice(range(10), 2, 8, 2)
print(list(result))  # 输出: [2, 4, 6]
```

* groupby(iterable, key=None): Groups adjacent elements in the sequence according to the return value of the key function.

`groupby()` groups adjacent elements in a sequence based on a key function. It is highly useful for classifying datasets by custom properties.

```python
from itertools import groupby

# 根据长度分组
data = ['abc', 'de', 'fgh', 'i', 'jk']
# groupby 之前必须先排序，否则只能合并相邻项
data.sort(key=len) 

for k, g in groupby(data, key=len):
    print(k, list(g)) 
    
# 排序后的输出:
# 1 ['i']
# 2 ['de', 'jk']
# 3 ['abc', 'fgh']
```

Another example, grouping students by class:

```python
from itertools import groupby

students = [
    {"name": "张三", "class": "A"},
    {"name": "李四", "class": "B"},
    {"name": "王五", "class": "A"},
    {"name": "赵六", "class": "B"}
]

# 首先按照班级排序
students.sort(key=lambda x: x["class"])

# 然后使用 groupby
for key, group in groupby(students, key=lambda x: x["class"]):
    print(key, list(group))
```

#### Packing and Unpacking

* starmap(function, iterable): Uses arguments unpacked from iterable and applies them to the function.

`starmap()` performs the same operations as [`map()`](high_order#map) but expects the input sequence to yield tuples of arguments, which it automatically unpacks before passing to the function.

```python
from itertools import starmap

# 使用参数解包应用函数
result = list(starmap(pow, [(2, 3), (3, 2)]))
print(result)  # 输出: [8, 9]
```

* zip_longest(*iterables, fillvalue=None): Similar to the built-in [zip() function](loop#the-zip-function), but uses the longest iterable as the reference.

```python
from itertools import zip_longest

# 以最长的可迭代对象为准的 zip
result = list(zip_longest('ABCD', 'xy', fillvalue='-'))
print(result)  # 输出: [('A', 'x'), ('B', 'y'), ('C', '-'), ('D', '-')]
```

### Permutations and Combinations

These functions compute permutations and combinations dynamically:

* product(*iterables, repeat=1): Computes the Cartesian product—the set of all possible ordered pairs from the input sets.

```python
from itertools import product

# 计算两个列表的笛卡尔积
result = list(product([1, 2], ['a', 'b']))
print(result)  # 输出: [(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]
```

* permutations(iterable, r=None): Generates all possible permutations (where order matters) of length `r`.

```python
from itertools import permutations

# 产生所有可能的三元素排列
result = list(permutations([1, 2, 3], 3))
print(result)  # 输出: [(1, 2, 3), (1, 3, 2), (2, 1, 3), (2, 3, 1), (3, 1, 2), (3, 2, 1)]
```

* combinations(iterable, r): Generates all combinations (where order does not matter) of length `r` without repeating elements.

```python
from itertools import combinations

# 产生所有可能的两元素组合
result = list(combinations([1, 2, 3], 2))
print(result)  # 输出: [(1, 2), (1, 3), (2, 3)]
```

* combinations_with_replacement(iterable, r): Generates combinations of length `r`, allowing individual elements to repeat.

```python
from itertools import combinations_with_replacement

# 产生所有可能的两元素组合，允许重复
result = list(combinations_with_replacement([1, 2, 3], 2))
print(result)  # 输出: [(1, 1), (1, 2), (1, 3), (2, 2), (2, 3), (3, 3)]
```

## Enumerations

In Python, an enumeration is represented as a class whose members define a fixed set of symbolic constants. Using enumerations provides descriptive names for groups of related [constants](variable#constants), making code more self-explanatory.

### Creating Enumerations

To define an enumeration, subclass the `Enum` base class from the standard `enum` module:

```python
from enum import Enum

class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3
```

Here, `Color` is an enumeration with three members: `RED`, `GREEN`, and `BLUE`.

Each member has a name and a value. Enumerations are immutable and prevent updates to members once defined.

### Accessing Enumeration Members

You can retrieve members by their name or value:

```python
print(Color.RED)        # 输出: Color.RED
print(Color.RED.name)   # 输出: RED
print(Color.RED.value)  # 输出: 1
```

### Iterating Over Enumerations

You can iterate over all members of an enumeration:

```python
for color in Color:
    print(color.name, color.value)
```

### Using Auto-Assigned Values

If you do not want to specify explicit values, use `auto()` to automatically generate sequential integers starting from 1:

```python
from enum import auto, Enum

class Color(Enum):
    RED = auto()
    GREEN = auto()
    BLUE = auto()
```

At this point, `RED` has a value of 1, `GREEN` has a value of 2, and `BLUE` has a value of 3.

### Checking Enumeration Members

Retrieve a member dynamically using string names or literal values:

```python
print(Color(1))       # 输出: Color.RED
print(Color['RED'])   # 输出: Color.RED
```

### Comparing Enumerations

Because they represent unique singletons, compare enumeration members using the identity `is` operator or equality `==`:

```python
print(Color.RED is Color.RED)   # 输出: True
print(Color.RED == Color.GREEN) # 输出: False
```

### Type Checking

We can validate inputs by asserting that arguments are members of our enumeration:

```python
from enum import Enum

# 定义一个枚举类
class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3

def print_color(color):
    if not isinstance(color, Color):
        raise ValueError("不是一个有效的 Color 枚举成员")
    print("选中的颜色是:", color.name)

# 正确使用枚举
print_color(Color.RED)  # 输出: 选中的颜色是: RED

# 错误使用枚举
try:
    print_color(1)  # 尝试传入一个非枚举值
except ValueError as e:
    print(e)  # 输出: 不是一个有效的 Color 枚举成员
```

In this code, the `print_color()` function runs an `isinstance()` check to enforce type safety, raising an error if a raw integer is passed.

### Defining More Complex Enumerations

Since enumerations are standard Python classes, you can define custom methods inside them:

```python
from enum import Enum

class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3
    PURPLE = 4

    def describe(self):
        return f"颜色名：{self.name}；颜色值：{self.value}"

    # 混合颜色
    @classmethod
    def mix(cls, color1, color2, ratio=0.5):
        if color1 == cls.RED and color2 == cls.BLUE or color1 == cls.BLUE and color2 == cls.RED:
            if ratio == 0.5:  # 这里是一个简化的示例，假设只有 0.5 的比例是 PURPLE
                return cls.PURPLE
        return f"按照比例 {ratio} 混合 {color1.name} 和 {color2.name} 无法产生已定义的颜色"

print(Color.RED.describe())              # 输出: 颜色名：RED；颜色值：1

# 演示颜色组合
result = Color.mix(Color.RED, Color.BLUE)
if isinstance(result, Color):
    print(f"混合后的颜色是 {result.name}")   # 输出: 混合后的颜色是 PURPLE
else:
    print(result)

result = Color.mix(Color.RED, Color.BLUE, 0.3)
print(result)         # 输出: 按照比例 0.3 混合 RED 和 BLUE 无法产生已定义的颜色
```

## Named Tuples

A **named tuple** allows you to access elements using dot notation (by field name) rather than numerical indices, combining the efficiency of tuples with class-like readability. We define named tuples using `collections.namedtuple`:

```python
from collections import namedtuple

# 定义一个命名元组
Person = namedtuple("Person", ["name", "age", "gender"])

# 创建一个Person对象
p1 = Person(name="阮奇桢", age=40, gender="男")

print(p1.name)         # 输出: 阮奇桢
print(p1.age)          # 输出: 40
print(p1.gender)       # 输出: 男

# 使用索引
print(p1[0])           # 输出: 阮奇桢

# 将命名元组转化为字典
print(p1._asdict())    # 输出: {'name': '阮奇桢', 'age': 40, 'gender': '男'}

# 替换命名元组的字段值
p2 = p1._replace(name="栓柱")
print(p2)              # 输出: Person(name='栓柱', age=40, gender='男')

# 获取所有字段名称
print(Person._fields)  # 输出: ('name', 'age', 'gender')
```

Because named tuples are subclassed from standard tuples, they remain immutable. While you cannot modify fields in-place, the `_replace()` method returns a new named tuple instance with the specified updates.

In modern Python, prefer using `typing.NamedTuple`, which supports type hints and provides a clean class-based declaration syntax:

```python
from typing import NamedTuple

class Person(NamedTuple):
    name: str
    age: int
    gender: str

p1 = Person(name="阮奇桢", age=40, gender="男")
```
