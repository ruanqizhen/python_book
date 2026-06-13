# Counting Frequencies

The residents of Pythora often use Python for data processing, and a common typical application is counting how many times each entry appears in the input data. There are many ways to implement this simple algorithm.

## Dictionary

The most straightforward way is to use Python's built-in dictionary data type for counting:

```python
elements = ['苹果', '香蕉', '苹果', '桔子', '香蕉', '苹果']
counts = {}

for element in elements:
    if element in counts:
        counts[element] += 1
    else:
        counts[element] = 1

print(counts)
```

When introducing the [dictionary](dict#添加或修改键值对) data type, we mentioned that we can use two methods of the dictionary to avoid manually checking whether an element is already in the dictionary. Using the dictionary's built-in methods can simplify the code:

```python
elements = ['苹果', '香蕉', '苹果', '桔子', '香蕉', '苹果']
counts = {}

for element in elements:
    counts.setdefault(element, 0)
    counts[element] += 1

print(counts)
```

Even better:

```python
elements = ['苹果', '香蕉', '苹果', '桔子', '香蕉', '苹果']
counts = {}

for element in elements:
    counts[element] = counts.get(element, 0) + 1

print(counts)
```

## defaultdict Class

In addition to the general-purpose dictionary data type, we can also use some classes designed for specific needs to simplify particular problems. For example, regarding default values for missing keys in a dictionary, we can use a subclass called defaultdict from the collections module, which inherits from the built-in dict class. The characteristic of defaultdict is that it can provide a default function for keys in the dictionary. When a user tries to access a non-existent key, defaultdict automatically calls that function to generate a default value. For instance, the function int() returns an integer 0; if this is used as the default value generation function, then the default value for missing keys will all be 0. Since the default value is determined by the return value of a function rather than a fixed value, this means we can design a function so that each key can have a different default value.

```python
from collections import defaultdict
from itertools import count

# 使用 itertools.count 创建一个计数器迭代器
counter = count()
# 每次遇到新键时，调用 next(counter) 获取下一个整数
inc_defaultdict = defaultdict(counter.__next__)

# 测试：
print(inc_defaultdict["a"])  # 输出 0
print(inc_defaultdict["a"])  # 输出 0 (已存在)
print(inc_defaultdict["b"])  # 输出 1
print(inc_defaultdict["c"])  # 输出 2
```

defaultdict is particularly suitable for scenarios where every key in a dictionary needs to have a default value, such as when grouping or counting, eliminating the need to check whether a key exists in advance.

For example, counting:

```python
from collections import defaultdict

elements = ['苹果', '香蕉', '苹果', '桔子', '香蕉', '苹果']
counts = defaultdict(int)

for element in elements:
    counts[element] += 1

print(dict(counts))   # 输出: {'苹果': 3, '香蕉': 2, '桔子': 1}
```

Grouping is also applicable, such as grouping input names by their first letter:

```python
from collections import defaultdict

surnames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis']
names_by_first_letter = defaultdict(list)

for surname in surnames:
    first_letter = surname[0]
    names_by_first_letter[first_letter].append(surname)

print(dict(names_by_first_letter))
# 输出: {'S': ['Smith'], 'J': ['Johnson', 'Jones'], 'W': ['Williams'], 'B': ['Brown'], 'D': ['Davis']}
```

## Counter Class

Python also includes a specialized subclass of dictionary called Counter, specifically designed for counting. Using it for counting is more concise:

```python
from collections import Counter

elements = ['苹果', '香蕉', '苹果', '桔子', '香蕉', '苹果']
counts = Counter(elements)

print(counts)   # 输出: Counter({'苹果': 3, '香蕉': 2, '桔子': 1})
```

As a class dedicated to counting, Counter's functionality goes beyond simply tallying quantities; it also provides some advanced features related to counting. For example, the most_common method can quickly find the elements that appear most frequently in a sequence.

```python
from collections import Counter

counts = Counter(['苹果', '香蕉', '苹果', '桔子', '香蕉', '苹果'])

# 最常见的 2 个元素：
print(counts.most_common(2))  # 输出： [('苹果', 3), ('香蕉', 2)]
```

The Counter class also overloads the addition `+`, subtraction `-`, intersection `&`, and union `|` operators for performing corresponding mathematical operations on counters:

```python
c1 = Counter(a=3, b=1)
c2 = Counter(a=1, b=2)

# 加法
c1 + c2  # 输出: Counter({'a': 4, 'b': 3})

# 减法
c1 - c2  # 输出: Counter({'a': 2})

# 交集
c1 & c2  # 输出: Counter({'a': 1, 'b': 1})

# 并集
c1 | c2  # 输出: Counter({'a': 3, 'b': 2})
```

## pandas Library

Data analysis in Python is inseparable from the pandas library. It is an open-source data analysis library that provides high-performance, easy-to-use data structures and data analysis tools. It is built on top of the numpy library and is closely integrated with libraries such as matplotlib (for plotting) and scipy (for scientific computing). For a detailed introduction to this library, refer to the [Data Analysis and Pandas](pandas) section.

If you are already using the pandas library in your project, you can directly use some of its classes and methods for counting.

If you are working with large datasets, the pandas library also provides convenient methods for counting:

### value_counts()

pandas provides a Series data structure for storing one-dimensional arrays. value_counts() is a method of the Series object that returns the frequency of occurrence of different values. By default, this method returns the frequencies sorted in descending order. First, convert the input into a Series object, then call value_counts to perform the counting.

```python
import pandas as pd

# 创建一个 Series 对象
s = pd.Series(['苹果', '香蕉', '苹果', '桔子', '香蕉', '苹果'])

# 使用 value_counts() 计数
counts = s.value_counts()
print(counts)

# 输出：
# 苹果   3
# 香蕉   2
# 桔子   1
# dtype: int64
```

### groupby()

When using pandas, the main data structure is DataFrame, which is a table-like data structure that can be thought of as an SQL table or a spreadsheet. DataFrame has row labels and column labels and can store columns of different types, such as integers, floats, strings, Python objects, etc. If the data is stored in a DataFrame format, you can use its groupby() method to group the data. Calling the size() method on the grouped data returns the size of each group, which effectively counts each category of data. For example:

```python
import pandas as pd

df = pd.DataFrame({
    'Fruit': ['苹果', '香蕉', '苹果', '桔子', '香蕉', '苹果'],
    'Quantity': [5, 3, 6, 2, 7, 8]
})

# 使用 groupby() 按 'Fruit' 列计数
counts = df.groupby('Fruit').size()
print(counts)

# 输出：
# Fruit
# 苹果   3
# 香蕉   2
# 桔子   1
# dtype: int64
```

## Counting with Arrays

If the data to be counted consists of positive integers, or can be mapped to positive integers, we can also use array indexing for counting instead of dictionary-based methods. For example, when the dataset to be counted contains integers from 0 to n-1, we can allocate an integer array of size n for counting. Then iterate through the input dataset, and for each number i seen, increment the i-th element of the counting array by 1. A single pass completes the tallying. The array structure is much simpler than a dictionary and is more efficient.

The NumPy library already has a bincount method implemented that we can use directly. For example:

```
import numpy as np

x = np.array([0, 1, 1, 3, 2, 1, 7])
count = np.bincount(x)

print(count)  输出： [1 3 1 1 0 0 0 1] 它表示 0 出现 1 次；1 出现 3 次...
```

## Exercises

### Character Count

Write a program to count the number of occurrences of each character in a string.

```python
from collections import Counter
input_string = "pneumonoultramicroscopicsilicovolcanoconiosis"
character_count = Counter(input_string)
for char, count in character_count.items():
    print(f"字符 '{char}' 出现了 {count} 次")
```
