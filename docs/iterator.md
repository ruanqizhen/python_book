# 迭代器

## 面向对象的迭代器

我们在前文已经多次提及迭代器了，并且介绍了使用[生成器](generator#生成器)创建迭代器的方法。这一节，我们深入讨论一下迭代器内部内部构造和工作原理，以及如何使用面向对象的编程方式实现迭代器。


### 迭代器协议

迭代器协议规定了两个特殊的方法：`__iter__()` 和 `__next__()`，这意味着实现了这两个方法的对象，就可以被当做迭代器。

* `__iter__()` 方法： 返回迭代器对象本身。针对迭代器运行 iter() 函数，或是在 for 循环中去迭代一个迭代器的时候，调用的就是这个方法。
* `__next__()` 方法： 返回迭代器中的下一个元素。针对迭代器运行 next() 函数时，调用的就是这个方法。如果没有更多元素可用，`__next__()` 应该抛出 StopIteration 异常。每次调用 `__next__()` 方法时，迭代器都会记住当前的状态，以便在下次调用时从上次离开的地方继续。

从协议中可以看出，迭代器是惰性求值的，它不会在一开始就计算出所有元素，而是在每次调用 next() 时才产生一个元素。这使得迭代器特别适用于处理大量或无限的数据集合。迭代器只能向前移动，不能回退到之前的元素，也不能复制迭代器的状态。

下面是一个自定义迭代器的示例，该迭代器能够返回一个递增的数列，直到达到一个上限：

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

上面程序实现的 CountUpTo 类与我们前文介绍的生成器函数 [count_up_to()](generator#生成器函数) 函数的功能是完全相同的。

### 通过可迭代对象实例化迭代器

程序中经常使用迭代器，很多都不是我们自己写的，而是从从可迭代对象那里获得的。比如最常见的列表，使用 iter() 函数可以从可迭代对象那里获得一个迭代器：

```python
my_list = [1, 2, 3]
my_iter = iter(my_list)

print(next(my_iter))  # 输出 1
print(next(my_iter))  # 输出 2
```

在这个例子中，my_list 是一个可迭代对象，my_iter 是从 my_list 创建的迭代器。

## itertools 库

Python 在 itertools 标准库模块中提供了一系列的迭代器，可以帮助我们进行复杂的迭代操作，比如组合数据、过滤数据等。使用 itertools 可以使代码更加简洁、高效、易于阅读。其实我们在前面的内容中已经介绍过好几个 itertools 库中的迭代器了，这里再集中介绍几个最常用的迭代器。

### 无限迭代器

* count(start=0, step=1): 从 start 开始，无限地产生等差数列。
* cycle(iterable): 无限地重复给定的序列。
* repeat(object[, times]): 重复一个对象，无限次或指定次数。

在[生成素数序列](high_order#生成素数序列)时，我们曾经利用过这个 count 迭代器。

```ptyhon
from itertools import count, cycle, repeat

# 从 10 开始的无限等差数列，步长为 2
for num in count(10, 2):
    if num > 20:   # 为了避免无限循环，添加一个退出条件
        break
    print(num)

# 无限重复列表 [1, 2, 3]
count = 0
for item in cycle([1, 2, 3]):
    if count > 8:  # 为了避免无限循环，添加一个退出条件
        break
    print(item)
    count += 1

# 重复字符串 "Hello" 5 次
for item in repeat("Hello", 5):
    print(item)
```

在使用这类可以无限产生元素的迭代器时，要小心避免造成[死循环](loop#死循环)。也要避免把无限迭代器作为参数传递给函数，比如 `print(*count())` 会尝试解包生成器能生成的所有的值，造成内存耗尽。

使用无限迭代器时，需要使用条件判断或限制迭代次数来避免死循环，内存耗尽等问题。

### 有限迭代器

有限迭代器种类繁多，我们使用示例分别介绍一下：

#### 累积结果

accumulate(iterable[, func, *, initial=None]): 返回累积总和或其他二元函数的累积结果。

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

accumulate 的功能与 [reduce()](high_order#reduce) 函数有些类似。最主要的区别在于 reduce() 函数只返回最终的累积结果，而 accumulate 会把中间累积运算的每一步过程都返回回来。

#### 连接

chain(*iterables): 连接多个迭代器为一个长序列。

```python
from itertools import chain

# 连接多个列表
result = list(chain([1, 2, 3], ['a', 'b', 'c']))
print(result)  # 输出: [1, 2, 3, 'a', 'b', 'c']
```

chain() 函数在效果上与 + 运算符非常类似，它们都可以将多个序列连接在一起。区别在于， chain() 函数可以接收任何迭代对象，返回的是一个迭代器；而 + 运算符要求操作的对象类型相同（例如两个列表或两个元组），其返回结果是与输入类型相同的一个新的完整序列，而不是迭代器。chain() 函数有更高的内存效率，适合处理大数据。

#### 过滤

接下来介绍的几个函数，都与过滤数据相关。与前文介绍的 [filter() 函数](high_order#filter)有相似功能。

* compress(data, selectors): 根据 selectors 中的布尔值筛选 data 中的元素。

```python
from itertools import compress

# 根据布尔值筛选元素
data = [1, 2, 3, 4, 5]
selectors = [True, False, True, False, True]
result = list(compress(data, selectors))
print(result)  # 输出: [1, 3, 5]
```

compress() 根据另一个布尔序列来筛选元素，而 filter() 函数根据一个函数的返回值来筛选元素。

* dropwhile(predicate, iterable): 当 predicate 为真时跳过元素，然后返回剩下的元素。

```python
from itertools import dropwhile

# 当元素小于 3 时跳过
result = list(dropwhile(lambda x: x < 3, [1, 2, 3, 4, 5, 2, 1]))
print(result)  # 输出: [3, 4, 5, 2, 1]
```

dropwhile() 和 filter() 函数的区别： dropwhile 只在序列的起始进行条件判断，一旦条件不满足就停止判断并包含剩余的所有元素。而 filter() 会对序列中的每个元素进行条件判断。

* takewhile(predicate, iterable): 当 predicate 为真时产生元素，一旦为假就停止。
与 dropwhile 相对应。

```python
from itertools import takewhile

# 当元素小于 3 时产生元素
result = list(takewhile(lambda x: x < 3, [1, 2, 3, 4, 5]))
print(result)  # 输出: [1, 2]
```

* filterfalse(predicate, iterable): 产生使得 predicate 返回假的元素。

```python
from itertools import filterfalse

# 产生使得 lambda 返回假的元素
result = list(filterfalse(lambda x: x % 2, [1, 2, 3, 4, 5]))
print(result)  # 输出: [2, 4]
```

filterfalse() 与 filter() 函数的筛选逻辑正相反： filter() 返回那些使测试函数为真的元素，而 filterfalse() 返回那些使测试函数为假的元素。

#### 分割

* islice(iterable, start, stop[, step]): 从序列中切片返回选定元素。

islice 在功能上相当于切片操作，但是切片操作只能应用于序列类型的数据，列表、元组、字符串，而 islice 应用于任何可迭代对象，并且它返回的是一个迭代器，而不是序列类型的数据。

```python
from itertools import islice

# 从序列中切片
result = islice(range(10), 2, 8, 2))
print(list(result))  # 输出: [2, 4, 6]
```

* groupby(iterable, key=None): 按照 key 函数的返回值对序列中相邻元素进行分组。

groupby 主要用于对复杂数据结构进行分组操作，特别是当想要根据某个特定的属性或条件对数据集进行分组时。

```python
from itertools import groupby

# 根据长度分组
data = ['abc', 'de', 'fgh', 'i', 'jk']
for k, g in groupby(data, key=len):
    print(k, list(g))  # 输出: 3 ['abc', 'fgh'] 2 ['de', 'jk'] 1 ['i']
```

另一个示例，按班级对学生进行分组：

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

* starmap(function, iterable): 使用参数从 iterable 中解包得到，并将它们应用到 function。

与 [map()](high_order#map) 函数功能相同，但参数格式不同。如果每次操作的所有参数已经被组织成元组或列表，那么使用 starmap 更为合适；如果参数是分开的几个列表，或者每次操作只有一个参数，那么使用 map 更为方便。

```python
from itertools import starmap

# 使用参数解包应用函数
result = list(starmap(pow, [(2, 3), (3, 2)]))
print(result)  # 输出: [8, 9]
```

* zip_longest(*iterables, fillvalue=None): 与内置的 zip() 类似，但以最长的可迭代对象为准。
```python
from itertools import zip_longest

# 以最长的可迭代对象为准的 zip
result = list(zip_longest('ABCD', 'xy', fillvalue='-'))
print(result)  # 输出: [('A', 'x'), ('B', 'y'), ('C', '-'), ('D', '-')]
```

### 排列组合

* product(*iterables, repeat=1): 计算笛卡尔积。

```python
from itertools import product

# 计算两个列表的笛卡尔积
result = list(product([1, 2], ['a', 'b']))
print(result)  # 输出: [(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]
```


* permutations(iterable, r=None): 产生序列的所有可能排列。r 指定排列的长度。
```python
from itertools import permutations

# 产生所有可能的三元素排列
result = list(permutations([1, 2, 3], 3))
print(result)  # 输出: [(1, 2, 3), (1, 3, 2), (2, 1, 3), (2, 3, 1), (3, 1, 2), (3, 2, 1)]
```

* combinations(iterable, r): 产生序列的所有组合，不考虑元素的顺序。r 指定组合的长度。
```python
from itertools import combinations

# 产生所有可能的两元素组合
result = list(combinations([1, 2, 3], 2))
print(result)  # 输出: [(1, 2), (1, 3), (2, 3)]
```


* combinations_with_replacement(iterable, r): 产生序列的所有组合，考虑元素的顺序。r 指定组合的长度。
```python
from itertools import combinations_with_replacement

# 产生所有可能的两元素组合，允许重复
result = list(combinations_with_replacement([1, 2, 3], 2))
print(result)  # 输出: [(1, 1), (1, 2), (1, 3), (2, 2), (2, 3), (3, 3)]
```

## 枚举

枚举在很多编程语言里都是基本的数据类型。在 Python 中，枚举不是基础数据类型，而是一个表示固定集合中元素的类。这些元素都是常量，不应该被更改。使用枚举可以为一组相关的常量提供有意义的名称，使代码更具可读性。

### 创建枚举
要在 Python 中创建枚举，需要使用 enum 模块中的 Enum 类：

```python
from enum import Enum

class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3
```

在这里，Color 是一个枚举，它有三个成员：RED、GREEN 和 BLUE。

### 访问枚举成员

可以通过成员的名称或值来访问枚举成员：

```python
print(Color.RED)        # 输出: Color.RED
print(Color.RED.name)   # 输出: RED
print(Color.RED.value)  # 输出: 1
```

### 遍历枚举

可以遍历枚举的所有成员：

```python
for color in Color:
    print(color.name, color.value)
```

### 使用自动分配值

如果不为枚举成员指定值，它们会自动分配整数值，从 1 开始递增：

```python
from enum import auto, Enum

class Color(Enum):
    RED = auto()
    GREEN = auto()
    BLUE = auto()
```

此时，RED 的值为 1，GREEN 的值为 2，BLUE 的值为 3。

### 检查枚举成员

可以检查某个值或名称是否是枚举中的成员：

```python
print(Color(1))       # 输出: Color.RED
print(Color['RED'])   # 输出: Color.RED
```

### 枚举的比较

枚举成员不能进行大小比较，但可以进行身份和等值比较：

```python
print(Color.RED is Color.RED)   # 输出: True
print(Color.RED == Color.GREEN) # 输出: False
```

### 定义更复杂的枚举

枚举也可以具有方法：

比如有时候需要加上 string_value()

```python
from enum import Enum

class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3
    PURPLE = 4

    def describe(self):
        return f"This is a {self.name} color with value {self.value}"

    @classmethod
    def mix(cls, color1, color2, ratio=0.5):
        if color1 == cls.RED and color2 == cls.BLUE or color1 == cls.BLUE and color2 == cls.RED:
            if ratio == 0.5:  # 这里是一个简化的示例，假设只有 0.5 的比例是 PURPLE
                return cls.PURPLE
            else:
                return f"Mixing {color1.name} and {color2.name} with a ratio of {ratio} doesn't give a predefined color in this model."
        return f"Mixing {color1.name} and {color2.name} doesn't give a predefined color in this model."

print(Color.RED.describe())  # 输出: This is a RED color with value 1

# 演示颜色组合
result = Color.mix(Color.RED, Color.BLUE)
if isinstance(result, Color):
    print(f"The resulting color is {result.name}.")  # 输出: The resulting color is PURPLE.
else:
    print(result)

result = Color.mix(Color.RED, Color.BLUE, 0.3)
print(result)  # 输出: Mixing RED and BLUE with a ratio of 0.3 doesn't give a predefined color in this model.
```


## 命名元组 

Python 中可以给元组的元素命名，这样的元组就是命名元组（Namedtuples）。相比于普通的元组，命名元组可读性更好，它可以通过名称（而不是索引）获取元组的元素。Python 中使用 namedtuple 函数来创建命名元组。比如：

```python
from collections import namedtuple

# 定义一个命名元组
Person = namedtuple("Person", ["name", "age", "gender"])

# 创建一个Person对象
p1 = Person(name="John", age=30, gender="Male")

print(p1.name)    # 输出: John
print(p1.age)     # 输出: 30
print(p1.gender)  # 输出: Male

# 使用索引
print(p1[0])      # 输出: John

# 将命名元组转化为字典
print(p1._asdict())  # 输出: OrderedDict([('name', 'John'), ('age', 30), ('gender', 'Male')])

# 替换命名元组的字段值
p2 = p1._replace(name="Jane")
print(p2)  # 输出: Person(name='Jane', age=30, gender='Male')

# 获取所有字段名称
print(Person._fields)  # 输出: ('name', 'age', 'gender')
```

虽然命名元组提供了类似于类的功能，但它们仍然是元组，因此它们的值是不可变的。这意味着你不能更改已创建的命名元组的字段值，但可以使用 ._replace() 方法返回一个新的命名元组，其某些字段值已更改。
