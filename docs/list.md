# 列表

Python 的列表（list）是一种有序的集合，它是非常灵活的，是 Python 中最基本的数据结构之一。

## 创建列表

可以使用方括号 [] 创建一个列表，这是最基础的方法，通过简单地在方括号中放置元素，元素之间用逗号分隔，比如

```python
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "apple", 3.5]
```

我们还会经常使用 list() 函数，将其他可迭代对象转换为列表，比如：

```python
# 从元组创建列表
tup = (1, 2, 3)
list_from_tuple = list(tup)     # 结果： [1, 2, 3]

# 从字符串创建字符列表
string = "hello"
list_from_string = list(string) # 结果： ['h', 'e', 'l', 'l', 'o']
```

## 访问列表元素

列表是有序的，每个元素都有一个唯一的索引，从 0 开始计数。我们可以使用索引访问列表中的特定元素。

```python
fruits = ["apple", "banana", "cherry", "date"]
print(fruits[0])  # 输出: apple
print(fruits[2])  # 输出: cherry
```

索引数值可以是负数，负索引意味着从列表的末尾开始计数。例如，-1 是最后一个元素的索引，-2 是倒数第二个元素的索引，依此类推。

```python
fruits = ["apple", "banana", "cherry", "date"]
print(fruits[-1])  # 输出: date
print(fruits[-2])  # 输出: cherry
```

与字符串类似，列表也可以做切片操作，得到列表的子集。切片操作使用 : 分隔开始和结束索引。开始索引是包含的，结束索引是不包含的。如果开始索引缺失，表示从源列表最左端开始取数据；如果结束索引缺失，表示选取致源列表的最右端。

```python
fruits = ["apple", "banana", "cherry", "date"]
# 获取第2到第4个元素 (索引 1, 2, 3)
print(fruits[1:4])  # 输出: ['banana', 'cherry', 'date']

# 获取开始到第3个元素
print(fruits[:3])  # 输出: ['apple', 'banana', 'cherry']

# 获取第2个元素到最后
print(fruits[1:])  # 输出: ['banana', 'cherry', 'date']
```

在切片操作中，可以再增加一个步进值参数（第三个参数），用于指定获取元素的间隔。比如：

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print(numbers[::2])  # 取偶数，输出: [0, 2, 4, 6, 8]，
```

## 修改列表

由于列表是可变的，我们可以修改、添加或删除其中的元素。如果是修改单个的一个值，可以直接通过索引来指定要修改的元素并赋予它一个新的值：

```python
fruits = ["apple", "banana", "cherry"]
fruits[0] = "grape"
print(fruits)  # 输出: ['grape', 'banana', 'cherry']
```

类似的，我们可以通过切片来替换列表的一部分元素：

```python
fruits[1:3] = ["orange", "blueberry"]
print(fruits)  # 输出: ['grape', 'orange', 'blueberry']
```

需要注意的是，通过切片替换时，新的子列表元素的数量可以与原切片不同。这意味着我们可以用切片来插入或删除列表中的元素。

```python
fruits = ["apple", "banana", "cherry"]

# 插入元素
fruits[1:1] = ["kiwi", "mango"]
print(fruits)  # 输出: ['grape', 'kiwi', 'mango', 'orange', 'blueberry']

# 删除元素
fruits[1:3] = []
print(fruits)  # 输出: ['grape', 'orange', 'blueberry']
```

此外，我们还可以使用一些列表的方法来修改列表中的元素：
* append() - 向列表末尾添加一个元素
* extend() - 将另一个列表（或任何可迭代对象）的元素添加到当前列表的末尾
* insert() - 在指定索引处插入一个元素
* remove() - 删除指定的元素
* pop() - 删除指定索引处的元素并返回它

```python
fruits = ["apple", "banana", "cherry"]

fruits.append("peach")
print(fruits)  # 输出: ['grape', 'orange', 'blueberry', 'peach']

fruits.extend(["kiwi", "mango"])
print(fruits)  # 输出: ['grape', 'orange', 'blueberry', 'peach', 'kiwi', 'mango']

fruits.insert(1, "pear")
print(fruits)  # 输出: ['grape', 'pear', 'orange', 'blueberry', 'peach', 'kiwi', 'mango']

fruits.remove("kiwi")
print(fruits)  # 输出: ['grape', 'pear', 'orange', 'blueberry', 'peach', 'mango']

removed_fruit = fruits.pop(2)
print(removed_fruit)  # 输出: orange
print(fruits)  # 输出: ['grape', 'pear', 'blueberry', 'peach', 'mango']

print(fruits.pop())  # 输出: 'grape'
```

## 列表的运算

下面介绍列表最常用的一些计算。

### 连接 (Concatenation)
使用 `+` 运算符可以将两个列表连接起来：

```python
list1 = [1, 2, 3]
list2 = [4, 5, 6]
combined_list = list1 + list2
print(combined_list)  # 输出: [1, 2, 3, 4, 5, 6]
```

### 重复 (Repetition)
使用二元 `*` 运算符可以重复列表中的元素。

```python
list1 = ["a", "b"]
repeated_list = list1 * 3
print(repeated_list)  # 输出: ['a', 'b', 'a', 'b', 'a', 'b']
```

### 成员运算

可以使用 in 和 not in 来检查元素是否存在于列表中。

```python
list1 = [1, 2, 3, 4, 5]
print(3 in list1)      # 输出: True
print(7 not in list1)  # 输出: True
```

### 列表解包 (Unpacking)
可以使用一元 `*` 运算符对列表进行解包，将其元素分布到新的列表或函数参数中。

```python
list1 = [1, 2, 3]
list2 = [4, *list1, 5]
print(list2)  # 输出: [4, 1, 2, 3, 5]
```
	
## 常用函数

列表有一些非常常用的函数，需要记住的：
* len(list) - 返回列表的元素个数。
* max(list) - 返回列表中的最大值。
* min(list) - 返回列表中的最小值。
* sorted(list) - 返回一个新的排序列表，不会修改原始列表。
* sum(list) - 返回列表中所有元素的总和。

比如：

```python
numbers = [34, 12, 89, 5, 73, 23]

# 使用 len(list) 返回列表的元素个数
length_of_numbers = len(numbers)
print(f"Length of the list: {length_of_numbers}")  # 输出: 6

# 使用 max(list) 返回列表中的最大值
max_value = max(numbers)
print(f"Maximum value in the list: {max_value}")  # 输出: 89

# 使用 min(list) 返回列表中的最小值
min_value = min(numbers)
print(f"Minimum value in the list: {min_value}")  # 输出: 5

# 使用 sorted(list) 返回一个新的排序列表，原始列表不变
sorted_numbers = sorted(numbers)
print(f"Sorted list: {sorted_numbers}")  # 输出: [5, 12, 23, 34, 73, 89]
print(f"Original list after sorting: {numbers}")  # 输出: [34, 12, 89, 5, 73, 23]

# 使用 sum(list) 返回列表中所有元素的总和
total_sum = sum(numbers)
print(f"Sum of all elements in the list: {total_sum}")  # 输出: 236
```



6. 常用的列表方法
与字符串类似，列表也是一种对象，也有它的方法。除了上文介绍过的 append() 等几个方法，列表还有如下几个最常用的方法：
* list.index(elem) - 返回列表中第一个值为 elem 的元素的索引。
* list.count(elem) - 返回列表中值为 elem 的元素的数量。
* list.sort(key=None, reverse=False) - 将列表中的元素进行排序。
* list.reverse() - 反转列表中的元素。
* list.clear() - 移除列表中的所有元素。
* list.copy() - 返回列表的一个浅拷贝。

示例：

```python
numbers = [34, 12, 89, 5, 12, 73, 23, 12]

# 使用 list.index(elem) 返回列表中第一个值为 elem 的元素的索引
index_of_12 = numbers.index(12)
print(f"Index of first occurrence of 12: {index_of_12}")  # 输出: 1

# 使用 list.count(elem) 返回列表中值为 elem 的元素的数量
count_of_12 = numbers.count(12)
print(f"Count of 12 in the list: {count_of_12}")  # 输出: 3

# 使用 list.sort(key=None, reverse=False) 将列表中的元素进行排序
numbers.sort()
print(f"Sorted list: {numbers}")  # 输出: [5, 12, 12, 12, 23, 34, 73, 89]

# 使用 list.reverse() 反转列表中的元素
numbers.reverse()
print(f"Reversed list: {numbers}")  # 输出: [89, 73, 34, 23, 12, 12, 12, 5]

# 使用 list.copy() 返回列表的一个浅拷贝
copied_numbers = numbers.copy()
print(f"Copied list: {copied_numbers}")  # 输出: [89, 73, 34, 23, 12, 12, 12, 5]

# 使用 list.clear() 移除列表中的所有元素
numbers.clear()
print(f"List after clear: {numbers}")  # 输出: []
```

## 嵌套列表

列表里面的元素的数据类型也可以不同，比如： `[1, "apple", 3.5]`

元素也可以是另一个list，比如 `[1, "apple", [5, 6, 7]]`

我们经常用嵌套列表来表示矩阵、多维数组等数据结构。嵌套列表的使用索引，一层一层打开即可访问其中的数据。比如：

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

print(matrix[1][2])  # 输出：6

matrix[1][2] = 10
print(matrix[1][2])  # 输出：10
```


## range() 函数

range() 是 Python 内置的一个函数，它返回一个可迭代的对象（在 Python 2 中返回列表，但在 Python 3 中返回一个迭代器），用于生成一系列连续的整数。这个函数在循环中特别有用，尤其是在后文将要介绍的 for 循环和列表推导式中。

range() 函数的基本语法如下： `range([start,] stop [, step])`。其中
* start (可选)：起始值，默认为0。
* stop：结束值（不包括）。
* step (可选)：步进值，默认为1。


使用示例：
```python
# 生成从0开始的连续整数
for i in range(5):
    print(i)
# 输出： 0 1 2 3 4 5

# 指定开始和结束值
for i in range(2, 5):
    print(i)
# 输出： 2 3 4

# 指定开始、结束和步进值
for i in range(0, 10, 2):
    print(i)
# 输出： 0 2 4 6 8

# 使用负数作为步进值
for i in range(5, 1, -1):
    print(i)
# 输出： 5 4 3 2
```

需要注意的是： range() 生成的序列不包括 stop 指定的值。在 Python 3 中，range() 返回的是一个迭代器，它不实际存储整个数字序列，这样可以节省内存。如果需要一个实际的列表，可以使用 list(range(...)) 来转换。


## 列表推导式 (List Comprehension)
列表推导式是 Python 中创建列表的简洁、可读的方式。它基于已有的可迭代对象（例如列表、元组、集合等）生成一个新列表。列表推导式通常更加简洁、明确。在多数其它语言中，创建一个复杂列表的唯一方法是使用循环或递归，但是在 Python 语言中，列表推导式是更好的方法。

列表推导式的基本格式如下： `[expression for item in iterable if condition]`，其中：
* expression： 对当前元素的操作；
* item： 当前迭代到的元素；
* iterable： 要迭代的对象；
* condition： 过滤条件（可选）。

下面看一些示例：

创建一个新列表，其中包含0到9的平方：

```python
squares = [x**2 for x in range(10)]
print(squares)  # 输出: [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

使用条件表达式过滤结果。比如，只保留偶数的平方：

```python
even_squares = [x**2 for x in range(10) if x % 2 == 0]
print(even_squares)  # 输出: [0, 4, 16, 36, 64]
```

排列组合：需要在列表推导式中使用嵌套循环。

```python
a = ['a', 'b', 'c']
b = [1, 2, 3]
combinations = [(x, y) for x in a for y in b]
print(combinations)  # 输出: [('a', 1), ('a', 2), ('a', 3), ('b', 1), ('b', 2), ('b', 3), ('c', 1), ('c', 2), ('c', 3)]
```

二维数组进行转置操作：

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

transpose = [[row[i] for row in matrix] for i in range(len(matrix[0]))]

print(transpose)

''' 输出：
[
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9]
]
'''
```

二维列表平展为一维的操作：

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

flattened = [item for sublist in matrix for item in sublist]

print(flattened)  # 输出： [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

有其它编程语言经验的读者可能已经发现了，使用列表推导式对列表进行操作，比使用循环要简洁的多。但也需要注意，在生成大量数据时可能消耗大量内存，因为它会返回一个新列表。在这种情况下，使用生成器表达式（使用圆括号而不是方括号）可能更为合适。
过于复杂的列表推导式可能会损害代码的可读性。当推导式变得复杂时，可以考虑使用传统的循环结构。

## 元组 (Tuple)

元组和列表非常相似，它们都是有序的集合，即元素的顺序是固定的，不会随机变动。它们的元素类型，它们的很多基本操作也都是相同的。

从外观上看，元组与列表的唯一区别在于，元组使用小括号表示，列表使用大括号表示。这只是表面的，本质上最主要的区别在于，列表是可变的，我们可以修改、添加或删除列表中的元素；而元组是不可变的，一旦创建，就不能再修改、添加或删除元组中的任何元素了。由于元组不可变，它的运算和功能会少一些，比如元组不支持 append() 这类用来改变元素的方法，只支持读取数据的方法。由于，元组不可变，它更加安全，更加节省内存，访问速度也更快。当需要创建一个不便的列表时，我们应该使用元组。