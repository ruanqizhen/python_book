# 字典与集合

## 创建字典

Python 的字典（dict）是一种非常强大的内置数据类型。在其它语言中，类似的数据结构或容器也会被叫做 Map、映射表、哈希表、散列表等。

### 使用大括号

字典是键值对的无序集合，其中键和值通过冒号 `:` 分隔。字典本身是使用大括号定义的。创建一个字典最简单的方法是使用大括号，包所需键值数据包裹起来即可：

```python
# 创建一个空字典
empty_dict = {}

# 使用字面量创建字典
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}
```

需要注意的是：
* 字典的键必须是不可变类型，如整数、浮点数、字符串或元组。列表或其他字典不能作为键使用。
* 字典的键是唯一的，如果重复添加相同的键，后一个值会覆盖前一个值。
* 字典的值可以是任何类型，包括其他字典或列表。

### dict() 构造函数

使用 dict() 构造函数可以从其他数据结构（如两个元组的列表）创建字典。

```python
# 使用 (key, value) 的元组列表
pairs = [("name", "Alice"), ("age", 25), ("city", "New York")]
my_dict = dict(pairs)

# 使用关键字参数
my_dict = dict(name="Alice", age=25, city="New York")
```

### zip() 函数

zip() 是 Python 的一个内置函数，它用于将多个可迭代对象的元素配对，返回一个新的迭代器，产生由各个可迭代对象中对应位置的元素组成的元组。比如： 

```python
a = [1, 2, 3]
b = ['a', 'b', 'c']
result = list(zip(a, b))
print(result)  # 输出：[(1, 'a'), (2, 'b'), (3, 'c')]
```

我们可以利用 zip() 函数将两个列表（或任何可迭代对象）组合成一个字典：

```python
keys = ["name", "age", "city"]
values = ["Alice", 25, "New York"]
my_dict = dict(zip(keys, values))
```

## 字典的常用操作

### 访问值

使用键可以从字典中获取相应的值：

```python
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}

print(person["name"])  # 输出: Alice
```

### 添加/修改键值对：

```python
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}

person["job"] = "Engineer"
person["age"] = 31
```


### 删除键值对

```python
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}

del person["age"]
```

### 检查键是否存在

```python
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}

if "name" in person:
    print("Name is present in the dictionary.")
```

### 获取所有的键和值：

```python
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}

keys = person.keys()
values = person.values()
items = person.items()
```


### 遍历字典：

遍历字典有多种方法，根据需要可以遍历字典的键、值或键值对。

使用 dict.keys() 方法获取字典的所有键，然后遍历这些键。实际上，如果直接在循环中使用字典，它会默认遍历字典的键：

```python
dictionary = {"a": 1, "b": 2, "c": 3}
for key in dictionary:
    print(key)
	
# 输出： a  b  c
```	

如果只需要遍历字典中的值，可以使用 dict.values() 方法获取字典的所有值，然后遍历这些值：

```python
for value in dictionary.values():
    print(value)
	
# 输出： 1  2  3
```

使用 dict.items() 方法可以获取字典的所有键值对（以元组形式返回），然后遍历这些键值对：

```python
for key, value in dictionary.items():
    print(key, value)

# 输出：
# a 1
# b 2
# c 3
```

### 拆包

与列表的拆包相似，字典可以使用双星号 `**` 操作符拆包，假设有 `dict1 = {'a': 1, 'b': 2}`，那么就过拆包操作 `**dict1` 的值就是 `'a'=1, 'b'=2`。

利用拆包操作可以方便的合并两个字典：

```
dict1 = {'a': 1, 'b': 2}
dict2 = {'c': 3, 'd': 4}

merged_dict = {**dict1, **dict2}
print(merged_dict)  # 输出: {'a': 1, 'b': 2, 'c': 3, 'd': 4}
```

字典拆包最主要的用途是[为函数传递参数](function#函数的不定数量参数)。


## 常用的字典的方法

* dict.get(key, default): 返回给定键的值。如果键不存在，则返回default值。
* dict.setdefault(key, default): 如果键不存在于字典中，将键和default加入字典。返回键的值。
* dict.update(another_dict): 将另一个字典的键值对合并到当前字典中。
* dict.pop(key): 删除并返回指定键的值。如果键不存在，则引发KeyError。
* dict.clear(): 清除字典中的所有项。

比如：

```python
# 创建一个初始字典
my_dict = {'a': 1, 'b': 2, 'c': 3}

# 使用 get 方法
print(my_dict.get('a'))        # 输出: 1
print(my_dict.get('d'))        # 输出: None
print(my_dict.get('d', 4))     # 输出: 4

# 使用 setdefault 方法
my_dict.setdefault('d', 4)
print(my_dict)                # 输出: {'a': 1, 'b': 2, 'c': 3, 'd': 4}
my_dict.setdefault('d', 5)    # 'd' 的值不会被更改，因为键 'd' 已经存在
print(my_dict)                # 输出: {'a': 1, 'b': 2, 'c': 3, 'd': 4}

# 使用 update 方法
another_dict = {'e': 5, 'f': 6}
my_dict.update(another_dict)
print(my_dict)                # 输出: {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6}

# 使用 pop 方法
value = my_dict.pop('f')
print(value)                  # 输出: 6
print(my_dict)                # 输出: {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5}

# 使用 clear 方法
my_dict.clear()
print(my_dict)                # 输出: {}
```





## 字典的优缺点

一个元素为键值对的列表，与一个字典保存的数据可能是完全相同的。但是它们内部对于数据不同的保存结构决定了它们各有一些不同的特点和擅长的应用场合。我们从以下几点，对这两种数据进行一下比较：

列表 (List)
优点:

* 有序性： 列表和字典中的元素都可以按照添加顺序遍历，这点两者类似。
* 读取和查找： 列表可以使用整数索引来访问、插入和删除元素；而字典是通过键，快速查找其对应的值。列表适合保存那些按固定顺序保存的，根据位置索引来读取的数据；而字典适合保存那些需要通过键来查找的数据。在列表中搜索特定值需要遍历整个列表，比较慢。
* 灵活性： 列表中可以存储任何数据类型，包括其他列表（即嵌套列表）。字典的值同样可以是任何数据类型，但键只能是不可变数据类型。
* 切片操作： 列表可以使用切片来获取列表的子集；字典没有这个功能。
* 重复数据： 列表中可以有重复的元素；字典的键必须是唯一的。

总的来说，
* 如果需要按顺序存储元素，并且经常需要通过索引来访问，那么列表是一个好选择。
* 如果需要存储键值对，并且经常需要通过键来查找值，那么字典是更好的选择。


## 集合

集合可以被认为是不带值，只有键的字典。

### 创建集合

可以使用花括号，或 set() 构造函数来创建集合：

```python
my_set = {1, 2, 3, 4}
print(my_set)  # 输出：{1, 2, 3, 4}

my_list = [1, 2, 2, 3, 4, 4, 5]
my_set = set(my_list)
print(my_set)  # 输出：{1, 2, 3, 4, 5}
```

集合中的元素是唯一的，这意味着重复的元素会被自动移除。此外，集合中的元素必须是不可变类型，这意味着不能在集合中放置例如列表或其他集合这样的可变对象。

注意： 不能使用空花括号 {} 创建空集合，因为空花括号默认表示的是一个空字典，而不是集合。如果需要空集合，只能使用 `set([])` 来创建。

### 常用操作

* 添加元素： 使用 add() 方法。
* 删除元素： 使用 remove() 或 discard() 方法。remove() 方法在元素不存在时会引发一个错误，而 discard() 方法则不会。
* 长度： 使用 len() 函数来获取集合的大小。
* 成员测试： 可以使用 in 关键字来检查一个元素是否存在于集合中。

示例：

```python
# 创建一个空集合
s = set()

# 使用 add() 方法添加元素
s.add("apple")
s.add("banana")
s.add("cherry")
print(s)  # 输出: {'apple', 'banana', 'cherry'}

# 使用 remove() 方法删除一个存在的元素
s.remove("banana")
print(s)  # 输出: {'apple', 'cherry'}

# 如果尝试使用 remove() 删除一个不存在的元素，会引发 KeyError
# 为避免此错误, 可以先检查元素是否存在
if "banana" in s:
    s.remove("banana")

# 使用 discard() 删除元素，即使该元素不存在，也不会引发错误
s.discard("banana")  # 由于 "banana" 已经被删除, 这一行不会有任何效果
s.discard("apple")
print(s)  # 输出: {'cherry'}

# 使用 len() 函数获取集合的大小
length = len(s)
print(f"The set has {length} element(s).")  # 输出: The set has 1 element(s).

# 使用 in 关键字检查一个元素是否存在于集合中
if "cherry" in s:
    print("Cherry is in the set!")  # 输出: Cherry is in the set!
```

### 集合的数学运算

使用集合常常是因为需要用到它做一些相关的数学运算，包括：
* 并集： 使用 union() 方法或 | 运算符。
* 交集： 使用 intersection() 方法或 & 运算符。
* 差集： 使用 difference() 方法或 - 运算符。
* 对称差集（在 A 或 B 中，但不同时在 A 和 B 中的元素）：使 用 symmetric_difference() 方法或 ^ 运算符。
* 子集与超集： 使用 issubset() 和 issuperset() 方法。

示例：

```python
# 定义两个集合
A = {1, 2, 3, 4}
B = {3, 4, 5, 6}

# 并集
union_set = A.union(B)
print(f"Union of A and B: {union_set}")  # 输出: {1, 2, 3, 4, 5, 6}
# 或者使用 | 运算符
union_set_operator = A | B
print(f"Union of A and B using | operator: {union_set_operator}")  # 输出: {1, 2, 3, 4, 5, 6}

# 交集
intersection_set = A.intersection(B)
print(f"Intersection of A and B: {intersection_set}")  # 输出: {3, 4}
# 或者使用 & 运算符
intersection_set_operator = A & B
print(f"Intersection of A and B using & operator: {intersection_set_operator}")  # 输出: {3, 4}

# 差集
difference_set = A.difference(B)
print(f"Difference of A from B: {difference_set}")  # 输出: {1, 2}
# 或者使用 - 运算符
difference_set_operator = A - B
print(f"Difference of A from B using - operator: {difference_set_operator}")  # 输出: {1, 2}

# 对称差集
symmetric_difference_set = A.symmetric_difference(B)
print(f"Symmetric difference between A and B: {symmetric_difference_set}")  # 输出: {1, 2, 5, 6}
# 或者使用 ^ 运算符
symmetric_difference_set_operator = A ^ B
print(f"Symmetric difference between A and B using ^ operator: {symmetric_difference_set_operator}")  # 输出: {1, 2, 5, 6}

# 子集
is_subset = A.issubset(B)
print(f"Is A a subset of B? {is_subset}")  # 输出: False

# 超集
is_superset = A.issuperset(B)
print(f"Is A a superset of B? {is_superset}")  # 输出: False
这些示例展示了如何对两个集合A和B执行各种基本的集合操作。
```




