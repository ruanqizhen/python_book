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

在 Python 中，自带有一个实现好的双向队列，它是在 collections 模块中的 deque 类。deque 的基本操作如下：
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
from collections import deque

def isValid(s: str) -> bool:
    # 初始化一个 deque 作为栈
    stack = deque()
    # 定义括号匹配规则
    bracket_map = {')': '(', '}': '{', ']': '['}

    # 遍历输入字符串
    for char in s:
        # 如果是闭合括号
        if char in bracket_map:
            # 弹出栈顶元素，如果栈为空则用一个占位符代替
            top_element = stack.pop() if stack else '#'
            # 如果此闭合括号与栈顶元素不匹配，则不是有效的括号
            if bracket_map[char] != top_element:
                return False
        else:
            # 如果是开放括号，压入栈中
            stack.append(char)

    # 如果栈为空，则说明所有括号都有效地匹配了
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

设计一个支持 push，pop，top 操作的栈，并能它能在常数时间内检索到栈内最小元素。有读者可能想到使用一个普通栈，加一个变量来实现，变量用于记录入站的最小数据。但是一个变量是不够的，因为当最小数据出栈后，这是就不知道栈内剩下的数据中，最小的是哪个了。所以，想要始终在常数时间内得到最小值，就需要多费一些空间，每当有数据入栈，都要记录一下栈中的最小数据。也就是每个元素入栈时，存储该元素和当前最小值的配对。这样，每个元素都会带着当时的最小值入栈。每次元素出栈时，我们也将更新最小值（如果出栈的元素是最小值的话）。这样可以确保在常数时间内检索到最小元素。

实现代码如下：

```python
from collections import deque

class MinStack:
    def __init__(self):
        # 初始化两个双端队列，一个用于存储所有值，一个用于存储最小值
        self.stack = deque()
        self.min_stack = deque()

    def push(self, x: int) -> None:
        # 始终在 stack 上进行正常的 push 操作
        self.stack.append(x)
        # 如果 min_stack 为空或新元素更小，则推入新的最小值到 min_stack
        if not self.min_stack or x <= self.min_stack[-1]:
            self.min_stack.append(x)

    def pop(self) -> None:
        # 弹出 stack 的顶部元素
        val = self.stack.pop()
        # 如果弹出的值是当前的最小值，也从 min_stack 中弹出
        if val == self.min_stack[-1]:
            self.min_stack.pop()

    def top(self) -> int:
        # 返回 stack 的顶部元素
        return self.stack[-1]

    def getMin(self) -> int:
        # 返回 min_stack 的顶部元素，即当前的最小值
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

