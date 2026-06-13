# Data Containers

## Object-Oriented Iterators

We have mentioned iterators many times in the previous sections and introduced how to create iterators using [Generators](generator#生成器函数). In this section, we will delve into the internal structure and working principles of iterators, as well as how to implement iterators using object-oriented programming.


### Iterator Protocol

The iterator protocol specifies two special methods: `__iter__()` and `__next__()`. This means that objects implementing these two methods can be treated as iterators.

* `__iter__()` method: Returns the iterator object itself. This method is called when running the iter() function on an iterator, or when iterating over an iterator in a for loop.
* `__next__()` method: Returns the next element in the iterator. This method is called when running the next() function on an iterator. If there are no more elements available, `__next__()` should raise a StopIteration exception. Each time the `__next__()` method is called, the iterator remembers its current state so that it can continue from where it left off on the next call.

From the protocol, it can be seen that iterators are lazily evaluated. They do not compute all elements at the beginning, but instead produce one element each time next() is called. This makes iterators particularly suitable for handling large or infinite data collections. Iterators can only move forward, cannot go back to previous elements, and cannot copy the iterator's state.

Below is an example of a custom iterator that returns an incrementing sequence of numbers until reaching an upper limit:

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

The CountUpTo class implemented in the program above has exactly the same functionality as the generator function [count_up_to()](generator#生成器函数) introduced earlier.

### Instantiating Iterators from Iterables

Iterators are frequently used in programs, and many are not written by us but are obtained from iterable objects. For example, with the most common list, using the iter() function can obtain an iterator from an iterable object:

```python
my_list = [1, 2, 3]
my_iter = iter(my_list)

print(next(my_iter))  # 输出 1
print(next(my_iter))  # 输出 2
```

In this example, my_list is an iterable object, and my_iter is an iterator created from my_list.

## itertools Library

Python provides a series of iterators in the itertools standard library module that can help us perform complex iteration operations, such as combining data, filtering data, etc. Using itertools can make code more concise, efficient, and readable. In fact, we have already introduced several iterators from the itertools library in previous sections. Here we will focus on introducing some of the most commonly used iterators.

### Infinite Iterators

* count(start=0, step=1): Generates an infinite arithmetic sequence starting from start, incrementing by step.
* cycle(iterable): Repeats the given sequence infinitely.
* repeat(object[, times]): Repeats an object, infinitely or a specified number of times.

When [generating prime number sequences](high_order#生成素数序列), we once used this count iterator.

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

When using iterators that can produce elements infinitely, be careful to avoid causing [infinite loops](loop#死循环). Also avoid passing infinite iterators as arguments to functions, for example, `print(*count())` will attempt to unpack all values the generator can produce, causing memory exhaustion.

When using infinite iterators, you need to use conditional checks or limit the number of iterations to avoid issues like infinite loops and memory exhaustion.

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

The accumulate function is somewhat similar to the [reduce()](high_order#reduce) function. The main difference is that the reduce() function only returns the final accumulated result, while accumulate returns every intermediate step of the accumulation process.

#### Chaining

chain(*iterables): Chains multiple iterators into a single long sequence.

```python
from itertools import chain

# 连接多个列表
result = list(chain([1, 2, 3], ['a', 'b', 'c']))
print(result)  # 输出: [1, 2, 3, 'a', 'b', 'c']
```

The chain() function is very similar in effect to the + operator -- both can concatenate multiple sequences together. The difference is that the chain() function can accept any iterable objects and returns an iterator, while the + operator requires the operands to be of the same type (e.g., two lists or two tuples) and returns a new complete sequence of the same type as the input, not an iterator. The chain() function is more memory-efficient and is suitable for processing large amounts of data.

#### Filtering

The next few functions introduced are all related to filtering data. They have similar functionality to the [filter() function](high_order#filter) introduced earlier.

* compress(data, selectors): Filters elements in data based on the boolean values in selectors.

```python
from itertools import compress

# 根据布尔值筛选元素
data = [1, 2, 3, 4, 5]
selectors = [True, False, True, False, True]
result = list(compress(data, selectors))
print(result)  # 输出: [1, 3, 5]
```

compress() filters elements based on another boolean sequence, while filter() filters elements based on the return value of a function.

* dropwhile(predicate, iterable): Skips elements while predicate is true, then returns the remaining elements.

```python
from itertools import dropwhile

# 当元素小于 3 时跳过
result = list(dropwhile(lambda x: x < 3, [1, 2, 3, 4, 5, 2, 1]))
print(result)  # 输出: [3, 4, 5, 2, 1]
```

The difference between dropwhile() and filter(): dropwhile only evaluates the condition at the start of the sequence. Once the condition is no longer met, it stops evaluating and includes all remaining elements. In contrast, filter() evaluates the condition for every element in the sequence.

* takewhile(predicate, iterable): Yields elements while predicate is true, stops when it becomes false.
This is the counterpart of dropwhile.

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

The filtering logic of filterfalse() is the opposite of filter(): filter() returns elements for which the test function returns true, while filterfalse() returns elements for which the test function returns false.

#### Slicing

* islice(iterable, start, stop[, step]): Returns selected elements from the sequence by slicing.

islice is functionally equivalent to the slicing operation, but slicing can only be applied to sequence types like lists, tuples, and strings, while islice can be applied to any iterable object and returns an iterator rather than a sequence type.

```python
from itertools import islice

# 从序列中切片
result = islice(range(10), 2, 8, 2)
print(list(result))  # 输出: [2, 4, 6]
```

* groupby(iterable, key=None): Groups adjacent elements in the sequence according to the return value of the key function.

groupby is mainly used for grouping operations on complex data structures, especially when you want to group a dataset based on a specific attribute or condition.

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

It has the same functionality as the [map() function](high_order#map), but the parameter format is different. If all parameters for each operation have already been organized into tuples or lists, then using starmap is more suitable; if the parameters are in separate lists, or there is only one parameter per operation, then using map is more convenient.

```python
from itertools import starmap

# 使用参数解包应用函数
result = list(starmap(pow, [(2, 3), (3, 2)]))
print(result)  # 输出: [8, 9]
```

* zip_longest(*iterables, fillvalue=None): Similar to the built-in [zip() function](loop#zip-函数), but uses the longest iterable as the reference.

```python
from itertools import zip_longest

# 以最长的可迭代对象为准的 zip
result = list(zip_longest('ABCD', 'xy', fillvalue='-'))
print(result)  # 输出: [('A', 'x'), ('B', 'y'), ('C', '-'), ('D', '-')]
```

### Permutations and Combinations

This group of functions is used to generate permutation and combination results.

* product(*iterables, repeat=1): Computes the Cartesian product. The Cartesian product is the set of all possible ordered pairs from two or more sets. It takes one element from each set and combines them into all possible tuples.

```python
from itertools import product

# 计算两个列表的笛卡尔积
result = list(product([1, 2], ['a', 'b']))
print(result)  # 输出: [(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]
```


* permutations(iterable, r=None): Generates all possible permutations of the sequence. r specifies the length of permutations, defaults to all elements.
```python
from itertools import permutations

# 产生所有可能的三元素排列
result = list(permutations([1, 2, 3], 3))
print(result)  # 输出: [(1, 2, 3), (1, 3, 2), (2, 1, 3), (2, 3, 1), (3, 1, 2), (3, 2, 1)]
```

* combinations(iterable, r): Generates all combinations of the sequence, regardless of element order. r specifies the length of combinations.

```python
from itertools import combinations

# 产生所有可能的两元素组合
result = list(combinations([1, 2, 3], 2))
print(result)  # 输出: [(1, 2), (1, 3), (2, 3)]
```


* combinations_with_replacement(iterable, r): Generates all combinations of the sequence, allowing elements to repeat. r specifies the length of combinations.
```python
from itertools import combinations_with_replacement

# 产生所有可能的两元素组合，允许重复
result = list(combinations_with_replacement([1, 2, 3], 2))
print(result)  # 输出: [(1, 1), (1, 2), (1, 3), (2, 2), (2, 3), (3, 3)]
```

## Enumerations

Enumerations are basic data types in many programming languages. In Python, enumerations are not a fundamental data type, but a class that represents elements of a fixed set. These elements are constants and should not be changed. Using enumerations can provide meaningful names for a group of related [constants](variable#常量), making the code more readable.

### Creating Enumerations

To create an enumeration in Python, you need to use the Enum class from the enum module:

```python
from enum import Enum

class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3
```

Here, Color is an enumeration with three members: RED, GREEN, and BLUE.

Enumeration members have names and values, and each member is unique. Enumeration members are immutable and cannot be changed once defined.

### Accessing Enumeration Members

Enumeration members can be accessed by their name or value:

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

If values are not specified for enumeration members, they will be automatically assigned integer values starting from 1:

```python
from enum import auto, Enum

class Color(Enum):
    RED = auto()
    GREEN = auto()
    BLUE = auto()
```

At this point, RED has a value of 1, GREEN has a value of 2, and BLUE has a value of 3.

### Checking Enumeration Members

You can check whether a value or name is a member of the enumeration:

```python
print(Color(1))       # 输出: Color.RED
print(Color['RED'])   # 输出: Color.RED
```

### Comparing Enumerations

Enumeration members cannot be compared by value (greater/less), but can be compared by identity and equality:

```python
print(Color.RED is Color.RED)   # 输出: True
print(Color.RED == Color.GREEN) # 输出: False
```

### Type Checking

When using enumeration data, type checking can be performed to prevent the use of invalid values. For example:

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

The print_color() function in the program above performs type checking on the input data to verify whether the input parameter is of type Color. If not, it raises an exception.


### Defining More Complex Enumerations

As a class, enumerations can also have methods. The program below adds a method to print a description and a method to mix different colors for the Color enumeration class:

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

In Python, tuple elements can be named, and such tuples are called named tuples. Compared to regular tuples, named tuples have better readability as they can access elements by name (rather than by index). Python uses the namedtuple function to create named tuples. For example:

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

Although named tuples provide class-like functionality, they are still tuples, so their values are immutable. This means you cannot change the field values of a created named tuple, but you can use the ._replace() method to return a new named tuple with some field values changed.

After Python 3.6, it is recommended to use typing.NamedTuple, which supports type hints and has a cleaner syntax:

```python
from typing import NamedTuple

class Person(NamedTuple):
    name: str
    age: int
    gender: str

p1 = Person(name="阮奇桢", age=40, gender="男")
```
