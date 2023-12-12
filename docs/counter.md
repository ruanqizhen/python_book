# 统计次数

Pythora 星球的居民经常使用 Python 进行一些数据处理，其中常见的一个典型应用是统计输入数据中，每个条目出现了几次。对于这个简单的算法，也有很多种实现方法。

## 字典

最朴素的方式就是使用 Python 自带的字典数据类型进行统计：

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

在介绍[字典](dict#添加或修改键值对)数据类型是，我们提到可以使用字典的几个方法，来避免直接检查一个元素是否已经在字典中，从而简化代码：

```python
elements = ['苹果', '香蕉', '苹果', '桔子', '香蕉', '苹果']
counts = {}

for element in elements:
    counts.setdefault(element, 0)
    counts[element] += 1

print(counts)
```

更好一点：

```python
elements = ['苹果', '香蕉', '苹果', '桔子', '香蕉', '苹果']
counts = {}

for element in elements:
    counts[element] = counts.get(element, 0) + 1

print(counts)
```

## defaultdict 类

除了通用的字典数据类型，我们还可以使用一些为特殊需求设计的类，来简化特定的问题。比如针对字典中缺失的键的默认值，我们可以collections 模块中的一个名为 defaultdict 的子类，它继承自内置的 dict 类。defaultdict 的特点是它可以为字典中的键提供一个默认的函数，当用户尝试访问一个不存在的键时，defaultdict 会自动调用那个函数，生成生成一个默认值。比如，函数 int() 会返回一个整数 0，如果以此为默认值生成函数，那么缺失的键的默认值就都是 0。用于默认值是函数定的，而不是固定值，这表示每个键可以有不同的默认值。

```python
from collections import defaultdict

# 创建一个默认值为 int 的 defaultdict，这里 int() 返回 0
int_defaultdict = defaultdict(int)

# 创建一个默认值为 list 的 defaultdict，这里 list() 返回空列表 []
list_defaultdict = defaultdict(list)

# 匿名函数的功能是每次调用返回的整数都增加一，也就是在这个 defaultdict 中，
# 第一个缺失的键的默认值是 0，第二个的默认值是 1，以此类推
inc_defaultdict = defaultdict(lambda x=[]: x.append(len(x)) or x[-1])

# 测试：
print(inc_defaultdict["a"])  # 默认值为 0
print(inc_defaultdict["a"])  # 已使用过，读取已经设置的值
print(inc_defaultdict["b"])  # 默认值为 1
print(inc_defaultdict["c"])  # 默认值为 2
```

defaultdict 特别适用于那些需要字典中的每个键都必须有一个默认值的场景，例如在进行分组或计数时，这样就无需事先检查键是否存在。

比如计数：

```python
from collections import defaultdict

elements = ['苹果', '香蕉', '苹果', '桔子', '香蕉', '苹果']
counts = defaultdict(int)

for element in elements:
    counts[element] += 1

print(dict(counts))   # 输出: {'苹果': 3, '香蕉': 2, '桔子': 1}
```

分组也很适用，比如把一些输入的名字按照首字母分组：

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

## Counter 类

Python 中还带有一个专门由于统计计数的字典的子类 Counter。使用它进行计数更简洁：

```python
from collections import Counter

elements = ['苹果', '香蕉', '苹果', '桔子', '香蕉', '苹果']
counts = Counter(elements)

print(counts)   # 输出: Counter({'苹果': 3, '香蕉': 2, '桔子': 1})
```

Counter 作为专用于计数的类，它的功能就不仅仅局限于数出个数，还提供了一些与计数相关的高级功能，比如， most_common 方法，可以快速找出序列中出现次数最多的元素。

```python
from collections import Counter

counts = Counter(['苹果', '香蕉', '苹果', '桔子', '香蕉', '苹果'])

# 最常见的 2 个元素：
print(counts.most_common(2))  # 输出： [('苹果', 3), ('香蕉', 2)]
```

Counter 类还重载了加法 `+`、减法 `-`、交集 `&` 和并集 `|` 运算符，用于对计数器进行相应的数学运算：

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


## pandas 库

Python 中进行数据分析，是离不开 pandas 库的。它是一个开源的数据分析库，提供了高性能、易用的数据结构和数据分析工具。它是基于 numpy 库构建的，并且密切集成了 matplotlib（用于绘图）和 scipy（用于科学计算）等库。对于这个库，后文还会有详细介绍。

如果已经在项目里使用了 pandas 库，那么也可以直接使用它提供的一些类和方法进行计数。

如果你在处理大型数据集，pandas 库也提供了便捷的方法来计数：

### value_counts()

pandas 提供了一个 Series 数据结构，用于存储一维数组。value_counts() 是 Series 对象的一个方法，用于返回不同值的出现频率。此方法默认返回频率降序排序。首先把输入转换成 Series 类型的对象，之后就可以调用 value_counts 进行计数了。

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

使用 pandas 的时候，最主要的数据结构是 DataFrame，它是一个表格型的数据结构，可以将其看作是一个 SQL 表格或是一个 spreadsheet。DataFrame 有行标签和列标签，并且可以存储不同类型的列，比如整数、浮点数、字符串、Python 对象等。如果数据以 DataFrame 格式保存，可以使用它的 groupby() 方法为数据分组，分组的数据调用其 size() 方法可以返回每个组的大小，也就是为每个分类的数据计数了。比如：

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


## 使用数组计数

如果需要统计个数的数据本是是个正整数，或者可以映射为正整数，那么我们也可以不使用基于字典的计数方法，而是利用数组的索引来计数。比如，当需要统计的数据集包含了从 0 到 n-1 的整数时，我们可以开辟一个大小为 n 的整数数组，用于计数。然后遍历输入数据集，没看到一个数 i，就把用于计数的数组的第 i 个数值加 1。这样遍历一次，即可完成统计。数组的结构比字典简单的多，效率也更高。

NumPy 库中已经有实现好的 bincount 方法了，我们可以直接拿来调用，比如：

```
import numpy as np

x = np.array([0, 1, 1, 3, 2, 1, 7])
count = np.bincount(x)

print(count)  输出： [1 3 1 1 0 0 0 1] 它表示 0 出现 1 次；1 出现 3 次...
```
