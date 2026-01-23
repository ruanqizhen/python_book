# 栈和队列

栈和队列是两种基本的数据结构，这两种数据结构经常被放在一起讨论。它们一般基于链表来实现，可以作为链表的一个具体应用实例。

## 基本概念

### 栈

栈（Stack）是一种后进先出（LIFO，Last-In-First-Out）的数据结构，即最后进入的元素会被最先取出。栈有点像手枪的弹夹，数据放入栈，就好像子弹压入弹夹，先压入的子弹一定是后出来。

栈有三个基本操作：
* 压栈 push： 添加元素到栈顶
* 弹出 pop： 移除栈顶元素
* 查看 top： 查看栈顶元素而不移除它

### 队列

队列（Queue）是一种先进先出（FIFO，First-In-First-Out）的数据结构，即最先进入的元素会被最先取出。队列的行为就像是排队买票，数据进入队列，就好像顾客进入排队，先排进去的顾客一定会被先处理，然后先出队伍。

队列也有三个类似的基本操作：
* 入队 enqueue： 在队列末尾添加一个元素
* 出队 dequeue： 移除队列开头的元素
* 查看 front： 查看队列开头的元素而不移除它

### 双向队列

双向队列（deque，全称double-ended queue）是一种具有队列和栈的性质的数据结构。双向队列中的元素可以从两端进队和出队，因此，只要把入队或出队限制在某一段，就可以把它当做栈或队列来用。在实际应用中，都会使用双向链表来代替栈或队列。

双向队列是由一个双向链表实现的，但是其限制了插入和删除操作只能在链表头尾两端进行。因此，它的入队出队时间复杂度是与链表插入删除相同的，都是 $O(1)$。

在 Python 中，自带有一个实现好的双向队列，它是在 collections 模块中的 deque 类。它是由 C 语言实现的。为了兼顾性能和内存效率，它内部并非使用简单的双向链表，而是使用了一个由固定长度数组块组成的双向链表。这使得它在两端添加/删除元素时非常快（$O(1)$），但在中间访问元素时依然较慢。deque 的基本操作如下：
* 右侧添加 append()： 添加元素到右端。
* 左侧添加 appendleft()： 添加元素到左端。
* 右端弹出 pop()： 弹出右端元素。
* 左侧弹出 popleft()： 弹出左端元素。

### 使用链表实现双向队列

代码示例：

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.prev = None
        self.next = None

class Deque:
    def __init__(self):
        self.head = None
        self.tail = None

    def append(self, value):
        new_node = Node(value)
        if not self.tail:  # 如果队列为空
            self.head = self.tail = new_node
        else:
            self.tail.next = new_node
            new_node.prev = self.tail
            self.tail = new_node

    def appendleft(self, value):
        new_node = Node(value)
        if not self.head:  # 如果队列为空
            self.head = self.tail = new_node
        else:
            self.head.prev = new_node
            new_node.next = self.head
            self.head = new_node

    def pop(self):
        if not self.tail:
            raise IndexError("pop from an empty deque")
        value = self.tail.value
        if self.head == self.tail:  # 只有一个元素
            self.head = self.tail = None
        else:
            self.tail = self.tail.prev
            self.tail.next = None
        return value

    def popleft(self):
        if not self.head:
            raise IndexError("pop from an empty deque")
        value = self.head.value
        if self.head == self.tail:  # 只有一个元素
            self.head = self.tail = None
        else:
            self.head = self.head.next
            self.head.prev = None
        return value

# 测试
deque = Deque()
deque.append(1)
deque.append(2)
deque.appendleft(0)
print(deque.pop())      # 输出: 2
print(deque.popleft())  # 输出: 0
```

在上面的程序中，每次 append 和 appendleft 都会创建一个新的 Node 实例。我们通过调整头部和尾部节点的引用来实现 appendleft 和 append。类似地，popleft 和 pop 操作会从链表的相应端点移除一个节点，并更新头部或尾部引用。


## 应用

栈和队列非常适合于那些需要对数据进行快速增减操作的场景，如：用作缓存；在线程间通信，尤其是在生产者消费者问题中，可以使用队列来作为生产者和消费者之间的工作队列。在对树或图进行遍历时，也经常需要使用栈或队列来保存数据。

### 检查有效的括号

给定一个只包含 '(', ')', '{', '}', '[' 和 ']' 的字符串，判断字符串是否有效。有效字符串需满足左括号必须与同类型的右括号匹配，并且左括号必须以正确的顺序闭合。

这个算法比较直接：每读取一个左括号，就把它压入栈；每读取一个右括号，就从栈中弹出一个左括号，如果两个括号匹配，则通过；如果不匹配，或最后为没匹配上的剩余括号，则输入字符串是无效的。程序代码如下：

```python
def isValid(s: str) -> bool:
    # 直接使用列表作为栈
    stack = []
    bracket_map = {')': '(', '}': '{', ']': '['}

    for char in s:
        if char in bracket_map:
            # 获取栈顶元素，如果栈为空则给一个 dummy 值
            top_element = stack.pop() if stack else '#'
            if bracket_map[char] != top_element:
                return False
        else:
            stack.append(char)

    return not stack

# 测试代码
test_string = "([{}])"
print(isValid(test_string))  # 应该返回 True

test_string = "([)]"
print(isValid(test_string))  # 应该返回 False

test_string = "{[]}"
print(isValid(test_string))  # 应该返回 True
```

在上面的代码中，我们使用了一个字典 bracket_map 来存储括号的配对关系，以便我们可以快速检查一个右括号是否与栈顶的左括号匹配。

### 实现一个最小栈

设计一个支持 push，pop，top 操作的栈，并能它能在常数时间内检索到栈内最小元素。有读者可能想到使用一个普通栈，加一个变量来实现，变量用于记录入栈的最小数据。但是一个变量是不够的，因为当最小数据出栈后，我们无法知道栈内剩下的数据中新的最小值是谁。

我们可以采用辅助栈的方法。我们维护两个栈：
1. 主栈（stack）： 用于正常存储所有数据。
2. 最小栈（min_stack）： 用于同步存储当前的最小值序列。

逻辑如下：
- 入栈： 数据压入主栈。如果该数据 小于等于 最小栈的栈顶元素（或者最小栈为空），则同时将该数据压入最小栈。
- 出栈： 主栈弹出数据。如果弹出的数据 等于 最小栈的栈顶元素，说明这个被移除的数据是当前的最小值，因此最小栈也要同步弹出。
- 获取最小值： 直接读取最小栈的栈顶元素。

实现代码如下：

```python
class MinStack:
    def __init__(self):
        self.stack = deque()      # 主栈
        self.min_stack = deque()  # 辅助栈，栈顶永远是当前主栈中的最小值

    def push(self, x: int) -> None:
        self.stack.append(x)
        # 关键逻辑：只有当新元素 <= 当前最小值时，才压入辅助栈
        # 这样辅助栈中存储的就是一个递减序列
        if not self.min_stack or x <= self.min_stack[-1]:
            self.min_stack.append(x)

    def pop(self) -> None:
        val = self.stack.pop()
        # 关键逻辑：如果弹出的数据就是当前最小值，辅助栈也要同步弹出
        # 这样辅助栈的栈顶就会变成之前的次小值
        if val == self.min_stack[-1]:
            self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min_stack[-1]

# 测试代码
min_stack = MinStack()
min_stack.push(-2)
min_stack.push(0)
min_stack.push(-3)
print(min_stack.getMin())  # 返回 -3
min_stack.pop()
print(min_stack.top())    # 返回 0
print(min_stack.getMin())  # 返回 -2
```

