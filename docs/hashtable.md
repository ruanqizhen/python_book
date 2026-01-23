# 哈希表

在之前的章节中，我们讨论了数组和链表。数组可以通过索引在 $O(1)$ 时间内访问元素，但如果不知道索引，查找特定元素则需要 $O(n)$ 的时间。链表的插入和删除虽然灵活，但查找效率同样是 $O(n)$。

有没有一种数据结构，既能像数组一样快速访问，又能像链表一样灵活存储键值对呢？这就是本章的主角——哈希表（Hash Table）。

哈希表（也叫散列表）是一种基于“键值对”（key-value pair）的高效数据结构。它通过将键映射到数组中的某个位置（索引），实现了近乎实时的快速数据存取。哈希表被广泛用于需要快速查找、插入或删除操作的场景，例如编程语言中的字典、数据库索引、缓存系统（如 Redis）以及集合等。

## 哈希函数

哈希表的核心在于如何将一个复杂的“键”（如字符串 "apple"）转换成一个简单的数组“索引”（如整数 3）。完成这个转换工作的，就是**哈希函数**（Hash Function）。

哈希函数的主要职责是：

1. **确定性**：对于相同的输入，必须永远产生相同的输出。
2. **高效性**：计算过程要足够快。
3. **均匀分布**：接受一个键作为输入，输出一个整数（通常是索引）。好的哈希函数应该尽可能地将不同的键均匀地分布在数组的各个位置上，从而减少“冲突”。

如果我们将数组想象成一排抽屉，哈希函数就是那个告诉你“这个东西该放进第几个抽屉”的管理员。

## 哈希表的操作

在理想情况下（即哈希函数设计得当，且没有冲突），哈希表的三大基本操作都非常高效：

1. **插入（Insert）**：
* 计算键的哈希值，找到对应索引，将键值对放入该位置。
* 时间复杂度：`O(1)`。


2. **查找（Search）**：
* 给定一个键，通过哈希函数直接定位到存储位置，取出对应的值。
* 时间复杂度：`O(1)`。


3. **删除（Delete）**：
* 直接定位到键的位置并将其移除。
* 时间复杂度：`O(1)`。



## 冲突与解决

虽然我们希望哈希函数能将每个键映射到唯一的索引，但实际上，数组的长度是有限的，而可能的键是无限的。根据“鸽巢原理”，必然会有两个不同的键被哈希函数映射到了同一个索引上。这种情况被称为**哈希冲突**（Collision）。

当冲突发生时，我们必须想办法解决，否则新数据就会覆盖旧数据。常见的解决方案主要有两种：

### 1. 链地址法（Separate Chaining）

这是最直观的解决方法。我们将哈希表的每个位置（Slot）看作一个“桶”（Bucket）。每个桶不再只存一个数据，而是存储一个链表。

* **原理**：当多个键映射到同一个索引时，直接将新元素追加到该索引对应的链表中。
* **优点**：实现简单，对哈希表的装载因子（Load Factor）不敏感，支持无限扩展（只要内存够）。
* **缺点**：需要额外的指针存储空间。如果冲突严重，链表会变得很长，查找效率会从 `O(1)` 退化为 `O(n)`。在 Java 8 等高级实现中，当链表过长时会将其转化为红黑树，以保证查找效率为 `O(log n)`。

### 2. 开放寻址法（Open Addressing）

这种方法不使用链表，所有的数据都直接存储在哈希表的主数组中。

* **原理**：当计算出的索引 `i` 已经被占用时，按照某种规则去探测（Probe）下一个空闲的位置。
* **探测方式**：
* **线性探测（Linear Probing）**：如果位置 `i` 被占了，就查 `i+1`，如果还被占，就查 `i+2`，依次类推。
* **二次探测（Quadratic Probing）**：探测间隔按平方递增（）。
* **双重哈希（Double Hashing）**：使用第二个哈希函数来计算探测的步长。


* **优点**：数据都在数组里，对 CPU 缓存友好，无需额外的指针空间。
* **缺点**：删除操作比较麻烦（不能直接清空，通常需要标记为“已删除”），容易产生**堆积（Cluster）**现象，即数据扎堆存储，导致探测时间变长。

### 加载因子与扩容

无论使用哪种冲突解决方法，随着哈希表中元素越来越多，冲突的概率都会急剧增加。为了衡量哈希表的拥挤程度，我们引入了**加载因子**（Load Factor）：

$$\text{加载因子} = \frac{\text{元素数量}}{\text{哈希表容量}}$$

当加载因子超过某个阈值（例如 0.75）时，哈希表的性能会显著下降。此时需要进行**扩容**（Rehash）：创建一个更大的数组（通常是原容量的 2 倍），将所有现有的元素重新计算哈希值并放入新数组中。这是一个耗时操作，但为了后续的高效运行是必须的。

## 手动实现一个简单的哈希表

为了更好地理解内部原理，我们使用**链地址法**来手动实现一个简单的哈希表：

```python
class HashTable:
    def __init__(self, size=10):
        self.size = size
        # 初始化哈希表，每个位置是一个空列表（充当链表）
        self.table = [[] for _ in range(size)]

    def _hash(self, key):
        """哈希函数：将键转换为索引"""
        # hash() 是 Python 内置函数，% self.size 确保索引在数组范围内
        return hash(key) % self.size

    def insert(self, key, value):
        """插入键值对"""
        index = self._hash(key)
        # 检查键是否已存在，如果存在则更新值
        for pair in self.table[index]:
            if pair[0] == key:
                pair[1] = value  
                return
        # 如果键不存在，则追加到链表末尾
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
        for i, pair in enumerate(self.table[index]):
            if pair[0] == key:
                self.table[index].pop(i)
                return

# 测试哈希表
hash_table = HashTable()
hash_table.insert('name', 'Alice')
hash_table.insert('age', 25)
hash_table.insert('city', 'New York')

print(hash_table.search('name'))  # 输出: Alice
print(hash_table.search('age'))   # 输出: 25

hash_table.delete('age')
print(hash_table.search('age'))   # 输出: None

```

## Python 中的哈希表实现

我们平时使用的 Python 字典（`dict`）和集合（`set`），其底层实现就是哈希表。但是，Python 的实现非常精妙，它使用的是**开放寻址法**（具体为伪随机探测），并且在 Python 3.6 之后进行了一次重大的结构优化。

### 传统哈希表（Python 3.6 之前）

早期的 Python 字典是一个巨大的“稀疏数组”。每个数组槽位（Entry）存储了哈希值、键的指针和值的指针。

假设有一个容量为 8 的字典：`d = {'Alice': 'A', 'Bob': 'B', 'Charlie': 'C'}`。在内存中，它看起来可能是这样：

```text
# 这是一个稀疏数组，很多位置是空的 (None)
entries = [
    None,
    DictEntry(hash1, 'Bob', 'B'),    # 假设 Bob 哈希到了索引 1
    None,
    None,
    None,
    DictEntry(hash2, 'Alice', 'A'),  # 假设 Alice 哈希到了索引 5
    None,
    DictEntry(hash3, 'Charlie', 'C') # 假设 Charlie 哈希到了索引 7
]

```

这种结构的缺点是**空间浪费严重**。因为必须保持一定的空闲比例（加载因子低）才能减少冲突，所以内存中会有大量的 `None`。

### 紧凑哈希表（Python 3.6+）

为了节省内存并保留插入顺序，Python 3.6 引入了“紧凑哈希表”。它将结构拆分为两个数组：

1. **indices（索引数组）**：只存储哈希表索引映射，非常小（如果是字节数组，每个槽位只占 1 byte）。
2. **entries（实体数组）**：按插入顺序紧凑地存储实际数据，没有空洞。

同样的字典 `d = {'Alice': 'A', 'Bob': 'B', 'Charlie': 'C'}`，现在的内存布局如下：

```python
# entries 数组按插入顺序存储，紧凑排列，无空间浪费
entries = [
    DictEntry(hash2, 'Alice', 'A'),   # 索引 0
    DictEntry(hash1, 'Bob', 'B'),     # 索引 1
    DictEntry(hash3, 'Charlie', 'C')  # 索引 2
]

# indices 数组作为哈希索引表
# 假设 Alice 哈希取模后是 5，Bob 是 1，Charlie 是 7
indices = [None, 1, None, None, None, 0, None, 2]

```

**查找过程**：

1. 计算 'Alice' 的哈希值，取模得到 `5`。
2. 去 `indices[5]` 查找，发现里面存的值是 `0`。
3. 去 `entries[0]` 取出数据，就是 'Alice'。

**这一改动的意义**：

* **节省内存**：`indices` 数组很小，`entries` 数组没有空洞。
* **有序性**：由于 `entries` 是按插入顺序追加的，所以 Python 3.7+ 官方宣布**字典是有序的**（按插入顺序）。

## 哈希表的应用示例

哈希表最强大的地方在于其  的查找速度，这使得它非常适合用于去重、计数和快速查找。

### 示例：最长连续序列

**题目**：给定一个未排序的整数数组，找出其中最长连续序列的长度。
例如：`[100, 4, 200, 1, 3, 2]`，最长连续序列是 `[1, 2, 3, 4]`，长度为 4。

**思路**：如果使用排序，时间复杂度是 $O(n \log n)$。利用哈希集合（Set），我们可以将查找时间降到 $O(1)$，从而实现 $O(n)$ 的解法。

```python
def longest_consecutive(nums):
    if not nums:
        return 0

    # 将数组转换为集合，实现 O(1) 的查找
    num_set = set(nums)
    longest_streak = 0

    for num in num_set:
        # 只有当 num 是序列的开头时才开始计算
        # (即 num-1 不在集合中，说明 num 是一个新序列的起点)
        if num - 1 not in num_set:
            current_num = num
            current_streak = 1

            # 不断向后查找 num+1, num+2...
            while current_num + 1 in num_set:
                current_num += 1
                current_streak += 1

            longest_streak = max(longest_streak, current_streak)

    return longest_streak

# 测试
nums = [100, 4, 200, 1, 3, 2]
print(longest_consecutive(nums))  # 输出: 4

```

## 总结

哈希表是计算机科学中“空间换时间”哲学的极致体现。

* **优点**：
1. **极速**：插入、删除、查找的平均时间复杂度均为 `O(1)`。
2. **灵活**：键可以是任何可哈希的对象。


* **缺点**：
1. **无序**：传统的哈希表是无序的（虽然 Python 字典现在有序，但这是特定实现的特性）。
2. **扩容代价**：当数据量大时，扩容（Rehash）会造成瞬时的性能抖动。
3. **冲突**：设计糟糕的哈希函数会导致性能退化。



理解哈希表，尤其是理解冲突解决和 Python 字典的底层优化，对于编写高性能代码至关重要。
