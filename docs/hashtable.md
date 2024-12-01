# 哈希表

哈希表（Hash Table）是一种基于“键值对”（key-value pair）的高效数据结构，它通过将键映射到数组中的某个位置（索引），实现快速的数据存取。哈希表被广泛用于解决问题需要快速查找、插入或删除操作的场景，例如实现字典、集合等。


## 哈希函数

这个映射过程使用了一个叫哈希函数（Hash Function）的特殊函数。
   - 接受一个键（key）作为输入，输出一个整数（通常是索引）。
   - 哈希函数应该尽可能地均匀地分布输入，从而减少冲突。






### 哈希表的操作

1. **插入（Insert）**：
   - 将一个键值对插入到哈希表中。
   - 时间复杂度：`O(1)`，在理想情况下。

2. **查找（Search）**：
   - 根据键找到对应的值。
   - 时间复杂度：`O(1)`，在理想情况下。

3. **删除（Delete）**：
   - 删除与指定键对应的键值对。
   - 时间复杂度：`O(1)`，在理想情况下。



### 冲突
冲突（Collision）
   - 当两个键被哈希函数映射到同一个索引时，就会发生冲突。
   - 哈希表必须通过某些方法解决冲突，常见的解决方案包括链地址法和开放寻址法。
   哈希冲突的解决方法

1. **链地址法（Separate Chaining）**：
   - 每个哈希表位置存储一个链表（或其他数据结构）。
   - 如果发生冲突，将新元素追加到对应链表中。
   - 优点：简单易实现，支持动态大小。
   - 缺点：如果冲突多，链表可能很长，查找效率会下降到 `O(n)`。

2. **开放寻址法（Open Addressing）**：
   - 冲突时，通过某种探测方式寻找下一个可用位置。
   - 常见方法：
     - 线性探测（Linear Probing）：每次检查下一个位置。
     - 二次探测（Quadratic Probing）：探测间隔是平方递增。
     - 双重哈希（Double Hashing）：使用第二个哈希函数计算探测步长。
   - 优点：无需额外的存储结构。
   - 缺点：可能导致**簇（Cluster）**问题，影响性能。

*伪随机数探测法*


加载因子（Load Factor
- 哈希表的加载因子定义为：`加载因子 = 元素数量 / 哈希表容量`。
   - 如果加载因子过高，哈希表的性能可能会下降，因此需要动态调整大小（即扩容）。

### 手动实现一个简单的哈希表
以下是一个用链地址法实现的简单哈希表：

```python
class HashTable:
    def __init__(self, size):
        self.size = size
        self.table = [[] for _ in range(size)]

    def _hash(self, key):
        """哈希函数"""
        return hash(key) % self.size

    def insert(self, key, value):
        """插入键值对"""
        index = self._hash(key)
        for pair in self.table[index]:
            if pair[0] == key:
                pair[1] = value  # 更新值
                return
        self.table[index].append([key, value])

    def search(self, key):
        """查找值"""
        index = self._hash(key)
        for pair in self.table[index]:
            if pair[0] == key:
                return pair[1]
        return None  # 未找到

    def delete(self, key):
        """删除键值对"""
        index = self._hash(key)
        for pair in self.table[index]:
            if pair[0] == key:
                self.table[index].remove(pair)
                return

# 测试哈希表
hash_table = HashTable(10)
hash_table.insert('name', 'Alice')
hash_table.insert('age', 25)

print(hash_table.search('name'))  # 输出: Alice
hash_table.delete('age')
print(hash_table.search('age'))  # 输出: None
```



## 哈希表的优缺点

优点：
1. 操作效率高（插入、删除、查找的平均时间复杂度为 `O(1)`）。
2. 易于扩展。
3. 可以用于实现其他数据结构（如字典、集合）。

缺点：
1. 需要设计良好的哈希函数以减少冲突。
2. 空间利用率可能较低（尤其是在冲突少时）。
3. 难以排序（需要额外的数据结构辅助）。


## Python 中的哈希表实现
Python 的字典（`dict`）和集合（`set`）内部就是用哈希表实现的。

好的，我们只使用 Python 或伪代码来演示这些概念。


在 Python 3.6 之前，字典使用的是普通的扁平哈希表，处理冲突时使用伪随机数探测法。字典结构大致包含三个数据：字典的大小，字典的容量，和所有的键值。

例如，假设有一个长度为 3 的字典，其容量为 8， 字典 `students_grades = {'Alice': 'A', 'Bob': 'B', 'Charlie': 'C'}` 在内存中的表示：

```python
entries = [
    None,
    DictEntry('Bob', 'B'),
    None,
    None,
    None,
    DictEntry('Alice', 'A'),
    None,
    DictEntry('Charlie', 'C')
]
```


Python 3.6 引入了新的数据结构，除了原有的三个数据，还用额外的 `indices` 数组来处理哈希映射
相应的内存布局如下：
```python
indices = [None, 1, None, None, None, 0, None, 2]
entries = [
    DictEntry('Bob', 'B'),
    DictEntry('Alice', 'A'),
    DictEntry('Charlie', 'C')
    None
]
```
