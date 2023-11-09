# 列表

Python 的列表（list）是一种有序的集合，它是非常灵活的，是 Python 中最基本的数据结构之一。

## 创建列表

可以使用方括号 [] 创建一个列表，这是最基础的方法，通过简单地在方括号中放置元素，元素之间用逗号分隔，比如

```python
fruits = ["苹果", "香蕉", "桔子"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "苹果", 3.5]
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

### 索引

列表是有序的，每个元素都有一个唯一的索引，从 0 开始计数。我们可以使用索引访问列表中的特定元素。

```python
fruits = ["苹果", "香蕉", "桔子", "菠萝"]
print(fruits[0])  # 输出: 苹果
print(fruits[2])  # 输出: 桔子
```

索引数值可以是负数，负索引意味着从列表的末尾开始计数。例如，-1 是最后一个元素的索引，-2 是倒数第二个元素的索引，依此类推。

```python
fruits = ["苹果", "香蕉", "桔子", "菠萝"]
print(fruits[-1])  # 输出: 菠萝
print(fruits[-2])  # 输出: 桔子
```

### 切片

与字符串类似，列表也可以做切片操作，得到列表的子集。切片操作使用 : 分隔开始和结束索引。开始索引是包含的，结束索引是不包含的。如果开始索引缺失，表示从源列表最左端开始取数据；如果结束索引缺失，表示选取致源列表的最右端。

```python
fruits = ["苹果", "香蕉", "桔子", "菠萝"]
# 获取第2到第4个元素 (索引 1, 2, 3)
print(fruits[1:4])  # 输出: ['香蕉', '桔子', '菠萝']

# 获取开始到第3个元素
print(fruits[:3])  # 输出: ['苹果', '香蕉', '桔子']

# 获取第2个元素到最后
print(fruits[1:])  # 输出: ['香蕉', '桔子', '菠萝']
```

在切片操作中，可以再增加一个步进值参数（第三个参数），用于指定获取元素的间隔。比如：

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print(numbers[::2])  # 取偶数，输出: [0, 2, 4, 6, 8]
```

这为我们提供了一个非常简洁的方法，把列表中的数据反向排列，把步进值设为 -1：

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print(numbers[::2])  # 反向排列，输出: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
```

步进值虽然可以方便一些操作，但是如果同时截取列表数据的一部分，又设置步进值，可能会让操作非常复杂，难以理解。应该尽量避免这样的操作。下面是一个反例，读者在不使用程序测试的情况下，能猜出下面代码的运行结果吗？

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print(numbers[-2:2:-3])  # 输出： ？？
```


与索引和切片相比，笔者更推荐使用解包操作来读取列表内的数据。

### 解包

解包（Unpacking），也可以称为拆包。它是 Python 中的一种方便的功能，它允许你将列表中的元素“解包”（即分解）到变量中。这意味着你可以在单个操作中将列表中的每个元素赋给多个变量。这通常用于函数返回多个值时，或者在循环、赋值操作中。

比如：

```python
numbers = [1, 2, 3]
a, b, c = numbers
print(a) # 1
print(b) # 2
print(c) # 3
```

在上面的例子中，列表 numbers 包含三个元素。通过列表解包，我们把这三个元素分别赋值给变量 a、b、c。

如果你只对列表中的某几个元素感兴趣，Python 允许部分解包，可以使用一元 `*` 运算符来表示“剩余的所有元素”：

```python
numbers = [1, 2, 3, 4, 5]
a, b, *rest = numbers
print(a)    # 1
print(b)    # 2
print(rest) # [3, 4, 5]
```

在上面的例子中，变量 a 和 b 分别取了列表的前两个元素，而变量 rest 成为了一个包含剩余元素的新列表。

在解包时，还可以忽略某些值，使用下划线 `_` 作为一个“丢弃”的变量。下划线 `_` 通常被用作占位符，表示不需要的变量或参数：

```python
numbers = [1, 2, 3, 4, 5]
a, _, _, _, e = numbers
print(a) # 1
print(e) # 5
```

在这个例子中，我们只关心列表的第一个和最后一个元素，中间的元素被赋值给占位符。

解包还可以应用于嵌套列表，这意味着可以从嵌套的列表结构中提取值。比如：

```python
nested_list = [[1, 2], [3, 4]]
(a, b), (c, d) = nested_list
print(a, b, c, d) # 1 2 3 4
```

解包与索引和切片有着类似的功能，但是在可能的情况下，应该尽量使用解包，而不是索引和切片。与索引和切片相比，解包更加清晰明确，可以使代码更加简洁易读。

### 检查数据是否存在 

检查一个元素是否在列表中可以使用 in 关键字。这会返回一个布尔值，指示元素是否存在于列表中。

下面是一个简单的例子：

```python
my_list = [1, 2, 3, 4, 5]

print(3 in my_list)  # 输出： True
print(6 in my_list)  # 输出： False
```

## 修改列表

### 索引

由于列表是可变的，我们可以修改、添加或删除其中的元素。如果是修改单个的一个值，可以直接通过索引来指定要修改的元素并赋予它一个新的值：

```python
fruits = ["苹果", "香蕉", "桔子"]
fruits[0] = "葡萄"
print(fruits)  # 输出: ['葡萄', '香蕉', '桔子']
```

### 切片

类似的，我们可以通过切片来替换列表的一部分元素：

```python
fruits[1:3] = ["桃子", "蓝莓"]
print(fruits)  # 输出: ['葡萄', '桃子', '蓝莓']
```

需要注意的是，通过切片替换时，新的子列表元素的数量可以与原切片不同。这意味着我们可以用切片来插入或删除列表中的元素。

```python
fruits = ["苹果", "香蕉", "桔子"]

# 插入元素
fruits[1:1] = ["西瓜", "芒果"]
print(fruits)  # 输出: ['苹果', '西瓜', '芒果', '香蕉', '桔子']

# 删除元素
fruits[1:3] = []
print(fruits)  # 输出: ['苹果', '香蕉', '桔子']
```

在修改列表数据的时候，尽量不要使用步进值，否则会使程序更难以理解。


## 列表的运算

下面介绍列表最常用的一些计算。

### 连接 

使用 `+` 运算符可以将两个列表连接（Concatenation）起来：

```python
list1 = [1, 2, 3]
list2 = [4, 5, 6]
combined_list = list1 + list2
print(combined_list)  # 输出: [1, 2, 3, 4, 5, 6]
```

### 重复
使用二元 `*` 运算符可以重复（Repetition）列表中的元素。

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



## 常用的列表方法

与字符串类似，列表也是一种对象，也有它的方法。下面代码可以列出列表数据对象全部的属性和方法：

```python
print(dir([]))
```

### 修改列表元素

Python 程序中，最常用的修改列表元素的方式还是利用索引和切片。不过，列表的方法也有其优势，它有方法名，可以直接看出来所做的是什么操作，程序可读性更好。经常被用来改变列表元素的列表方法包括：
* append() - 向列表末尾添加一个元素
* extend() - 将另一个列表（或任何可迭代对象）的元素添加到当前列表的末尾
* insert() - 在指定索引处插入一个元素
* remove() - 删除指定的元素
* pop() - 删除指定索引处的元素并返回它

```python
fruits = ["苹果", "香蕉", "桔子"]

fruits.append("草莓")
print(fruits)  # 输出: ['苹果', '香蕉', '桔子', '草莓']

fruits.extend(["西瓜", "芒果"])
print(fruits)  # 输出: ['苹果', '香蕉', '桔子', '草莓', '西瓜', '芒果']

fruits.insert(1, "鸭梨")
print(fruits)  # 输出: ['苹果', '鸭梨', '香蕉', '桔子', '草莓', '西瓜', '芒果']

fruits.remove("西瓜")
print(fruits)  # 输出: ['苹果', '鸭梨', '香蕉', '桔子', '草莓', '芒果']

removed_fruit = fruits.pop(2)
print(removed_fruit)  # 输出: 香蕉
print(fruits)  # 输出: ['苹果', '鸭梨', '桔子', '草莓', '芒果']

print(fruits.pop())  # 输出: '芒果'
```

### 排序

，我们会在后面介绍它。这里介绍的是列表的一个方法 sort()。

sort() 方法用于对列表中的元素进行排序。默认情况下，sort() 方法会按照升序对列表进行排序，但也可以接受参数来自定义排序方式。sort() 方法会修改原来的列表，也就是说，它不会创建一个新的排序后的列表，而是直接在原来的列表上进行排序。

sort() 方法接收两个参数。reverse 参数如果设置为 True，sort() 方法将进行降序排序。key 参数来指定一个函数，这个函数会在每个元素上被调用，其返回值将作为排序的依据。Python 中有一个内置的通用排序函数 sorted()，它与列表的 sort() 方法非常类似。关于 key 参数的使用我们将在后面介绍相关基础知识后，在[高阶函数 sorted](high_order#sorted)一节一并介绍。


这里我们只看几个最基本的示例：

```python
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
numbers.sort()
print(numbers)  # 输出： [1, 1, 2, 3, 4, 5, 6, 9]

numbers.sort(reverse=True)
print(numbers)  # 输出： 降序排列 [9, 6, 5, 4, 3, 2, 1, 1]

```


### 其它方法

除了上文介绍过的几个方法，列表还有如下几个常用的方法：

* list.index(elem) - 返回列表中第一个值为 elem 的元素的索引。
* list.count(elem) - 返回列表中值为 elem 的元素的数量。
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

列表里面的元素的数据类型也可以不同，比如： `[1, "苹果", 3.5]`

元素也可以是另一个list，比如 `[1, "苹果", [5, 6, 7]]`

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




## 元组 (Tuple)

元组和列表非常相似，它们都是有序的集合，即元素的顺序是固定的，不会随机变动。它们的元素类型，它们的很多基本操作也都是相同的。

从外观上看，元组与列表的唯一区别在于，元组使用小括号表示，列表使用大括号表示。这只是表面的，本质上最主要的区别在于，列表是可变的，我们可以修改、添加或删除列表中的元素；而元组是不可变的，一旦创建，就不能再修改、添加或删除元组中的任何元素了。由于元组不可变，它的运算和功能会少一些，比如元组不支持 append() 这类用来改变元素的方法，只支持读取数据的方法。由于，元组不可变，它更加安全，更加节省内存，访问速度也更快。当需要创建一个不便的列表时，我们应该使用元组。

Python 会把用逗号分隔的几个数据自动打包成元组：

```python
my_tuple = 3, 5, 7
print(my_tuple)    # 输出： (3, 5, 7)
```

一个容易出现的错误是使用数据时候，后面带了个逗号，结果 Python 不会保存，而是会把它自动被打包成元组：

```python
a = 3,
print(a)    # 输出： (3,)
```

读取元组中数据的操作与读取列表元素的操作是完全相同的，我们同样可以使用索引、切片、解包等操作读取元组中的数据，比如：

```python
my_tuple = 3, 5, 7
a, b, c = my_tuple
print(a)  # 输出: 3
print(b)  # 输出: 5
print(c)  # 输出: 7

first, *middle, last = (1, 2, 3, 4, 5)
print(first)   # 输出: 1
print(middle)  # 输出: [2, 3, 4] ** 注意，这部分数据变成了列表而不是元组
print(last)    # 输出: 5
```

其实字符串也可以使用同样的拆包操作，比如：

```python
s = "abc"
m, n, o = s
print(f"Unpacked characters: {m}, {n}, {o}") # 字符串拆包后，成为单独的字符
```

