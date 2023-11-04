# 链表

## 基本概念

链表（Linked List）是用于存储元素的一种基本数据结构。它经常被拿来与数组做比较，链表中的元素不是顺序存储的，而是通过指针连接在一起。

链表中的每个元素被称为节点。每个节点通常由两部分组成：数据部分和指针部分。数据部分存储元素的值，而指针部分存储指向下一个节点的引用。链表的第一个节点称为头节点。我们通常使用头节点来代表整个链表。链表的最后一个节点称为尾节点。尾节点的指针部分通常指向 None，表示链表的结束。

![](images/008.png "链表图示")

## 基本操作

链表最基本的操作包括：

* 创建一个空链表
* 插入新节点。链表没有索引，所以在插入新节点的时候，通常会用一个已有节点做参考，比如在给定节点的前面或后面插入新节点；或者在链表头或尾插入新节点。
* 删除给定节点
* 遍历和查找

下面的程序实现了这几个最基本操作：

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):       # 将一个新节点添加到链表的末尾
        new_node = Node(data)     # 创建一个新节点
        if not self.head:         # 空链表
            self.head = new_node
            return
        last_node = self.head
        while last_node.next:     # 找到链表尾
            last_node = last_node.next
        last_node.next = new_node # 链接到新节点

    def print_list(self):
        cur_node = self.head
        while cur_node:           # 遍历每个节点
            print(cur_node.data, end=" -> ")
            cur_node = cur_node.next
        print("None")

    def insert_after_node(self, prev_node, data):
        if not prev_node:
            print("Previous node is not in the list")
            return
        new_node = Node(data)
        new_node.next = prev_node.next # 新节点的指针指向参考节点的下一个节点
        prev_node.next = new_node      # 参考节点的指针指向新节点

    def find_node_by_key(self, key):
        cur_node = self.head
        while cur_node:                # 遍历所有节点，一一比较
            if cur_node.data == key:   # 直到找到目标节点
                return cur_node
            cur_node = cur_node.next
        return None

    def delete_node(self, node_to_delete):
        if not node_to_delete:
            return

        # 如果被删除的是头结点
        if self.head == node_to_delete:
            self.head = self.head.next
            return

        prev_node = None
        cur_node = self.head    
        while cur_node and cur_node != node_to_delete:
            prev_node = cur_node        # 找到前面的节点
            cur_node = cur_node.next
        
        # 如果节点不在链表里则直接返回
        if not cur_node:
            return
        
        # 把当前节点从链表中移除
        prev_node.next = cur_node.next

# 使用链表
llist = LinkedList()
llist.append(1)
llist.append(2)
llist.append(3)
llist.print_list()  # 输出: 1 -> 2 -> 3 -> None

node_to_delete = llist.find_node_by_key(2)
llist.delete_node(node_to_delete)
llist.print_list()  # 1 -> 3 -> None
```

在上面的程序中，Node 类用于表示链表中的每一个节点。每个节点都有两个属性：data (用于存储值) 和 next (指向下一个节点的引用)。

LinkedList 类用于表示整个链表。它包含一个属性 head，指向链表的第一个节点。append() 方法将一个新节点添加到链表的末尾。insert_after_node() 方法可以在给定的 prev_node 后面插入一个新节点。 find_node_by_key() 方法可以根据数据找到一个节点。delete_node() 方法则可以删除一个节点。

从上面的示例的实现就可以看出来，在队列中插入数据的时间复杂度是 $O(1)$，因为插入操作不需要挪动任何其它元素。但是查找一个节点时间复杂度是 $O(n)$，链表不能做索引，只能一个一个节点查看。

上面的链表中，删除节点的时间复杂度是 $O(n)$，因为只有找到当前节点的上一个节点之后才能删除。如果有一个函数，是删除下一个节点，那就不需要遍历整个链表了，时间复杂度可以降低到 $O(1)$。或者，如果是在双向链表中，删除节点的时间复杂度也可以是 $O(1)$。



## 双向链表 

![images/009.png](images/009.png "双向链表示意图")

在双向链表（Doubly Linked List）中，每个节点都记录了上一个节点和下一个节点的位置。因此，在双向链表中，可以从一个节点直接跳转到它的上一个或下一个节点上去，也就是正向或反向遍历整个链表。如果链表的最后一个节点（尾节点）的下一个节点指向的是头结点；而头结点的前一个节点又指向了尾节点，那么这就构成了一个环状双向链表，如上图所示。

单向链表也可以有环。有环的链表不一定所有节点都在环内，也可以一些节点在环外，另一些节点构成环。在实际应用中，非环状的链表更为常见。

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None
        self.prev = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None

    # 插入一个节点到链表的尾部
    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        last_node = self.head
        while last_node.next:
            last_node = last_node.next
        last_node.next = new_node
        new_node.prev = last_node

    # 插入一个节点到链表的头部
    def prepend(self, data):
        new_node = Node(data)
        new_node.next = self.head
        if self.head:
            self.head.prev = new_node
        self.head = new_node

    # 删除一个节点
    def delete(self, node):
        cur_node = self.head
        while cur_node:
            if cur_node == node:
                # 删除头部节点
                if cur_node.prev:
                    cur_node.prev.next = cur_node.next
                else:
                    self.head = cur_node.next
                # 删除尾部节点
                if cur_node.next:
                    cur_node.next.prev = cur_node.prev
                return  # 节点已删除，退出循环
            cur_node = cur_node.next

    # 打印链表
    def print_list(self):
        cur_node = self.head
        while cur_node:
            print(cur_node.data, end=" <-> ")
            cur_node = cur_node.next
        print("None")

# 使用双向链表
dllist = DoublyLinkedList()
dllist.append(1)
dllist.append(2)
dllist.append(3)
dllist.print_list()  # 1 <-> 2 <-> 3 <-> None

node_to_delete = dllist.head.next  # 此处选择第二个节点（值为2）进行删除
dllist.delete(node_to_delete)
dllist.print_list()  # 1 <-> 3 <-> None
```

上面的示例演示了一个双向链表，它的实现方法与单向链表非常类似。但是它的每个节点有两个指针，分别指向上一个节点和下一个节点。

## 常见问题

### 反转链表

编写一个函数来反转单链表。翻转链表的算法是比较直观的，就是遍历每个节点，把结点指针的指向换个方向。需要注意的是，要考虑如何暂存节点，用于设置指针。可以用循环，也可以用递归。

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        last_node = self.head
        while last_node.next:
            last_node = last_node.next
        last_node.next = new_node

    def print_list(self):
        cur_node = self.head
        while cur_node:
            print(cur_node.data, end=" -> ")
            cur_node = cur_node.next
        print("None")

    def reverse(self):
        prev = None
        current = self.head
        while current:
            next_node = current.next  # store the next node
            current.next = prev  # change the current node's pointer to previous
            prev = current  # move the previous to this current
            current = next_node  # move to the next node
        self.head = prev
        
    def reverse_recursive(self):
        self.head = self._reverse_recursive(self.head)

    def _reverse_recursive(self, node):
        if node is None or node.next is None:
            return node
        
        next_node = node.next
        new_head = self._reverse_recursive(next_node)
        
        next_node.next = node
        node.next = None
        
        return new_head

# 测试
llist = LinkedList()
llist.append(1)
llist.append(2)
llist.append(3)
llist.append(4)
llist.print_list()  # 1 -> 2 -> 3 -> 4 -> None

llist.reverse()
llist.print_list()  # 4 -> 3 -> 2 -> 1 -> None

llist.reverse_recursive()
llist.print_list()  # 1 -> 2 -> 3 -> 4 -> None
```

无论循环还是递归，翻转链表都需要遍历链表每个节点一次，所以时间复杂度为 $O(n)$，n 是节点数量。算法利用了原来的节点，并不用生成新链表，所以空间复杂度是 $O(1)$.


### 检测环


检测链表中是否有环。如果有环，那么说明遍历链表的时候，走着走着就又会遇到一个之前遇到过的节点。所以最直接的办法，就是把所有遍历过的节点都标注一下。如果节点有额外的空间可以存放新数据，那么就在遍历的时候，在每个节点上添加个新数据，表明已经走过了。当遍历链表时，遇到了已经标记过的节点，则表示链表有环。如果不能在节点上直接标注，就只好在额外开辟一块内存用于记录，最方便的是使用集合数据。遍历时，把每个节点都存入集合，如果发现节点已经在集合里了，就说明有环。

上面这两种算法的空间复杂度都是 $O(n)$，因为都需要额外的数据来记录每个节点。还有一种空间复杂的为 $O(n1)$ 的“快慢指针”算法。基本思想是使用两个指针，一个移动得快（两步一次），另一个移动得慢（一步一次）。如果链表中存在环，那么两个指针最终会相遇。程序示例如下：

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        last_node = self.head
        while last_node.next:
            last_node = last_node.next
        last_node.next = new_node

    def create_cycle(self, pos):
        # 这个方法是用来为测试目的创建一个循环的
        tail = self.head
        while tail.next:
            tail = tail.next
        
        cycle_start = self.head
        for i in range(pos):
            cycle_start = cycle_start.next
        tail.next = cycle_start

    def has_cycle(self):
        slow_pointer = self.head
        fast_pointer = self.head

        while fast_pointer and fast_pointer.next:
            slow_pointer = slow_pointer.next
            fast_pointer = fast_pointer.next.next

            if slow_pointer == fast_pointer:
                return True

        return False

# 使用单链表
llist = LinkedList()
llist.append(1)
llist.append(2)
llist.append(3)
llist.append(4)

print(llist.has_cycle())  # False

# 创建一个循环作为测试
llist.create_cycle(1)
print(llist.has_cycle())  # True
```


### 删除倒数第 n 个节点

删除单向链表中的倒数第 n 个节点。因为是单向链表，我们没发从后往前找，只能从前向后遍历。为了不错过倒数第 n 个节点，直观的做法就是开辟一个缓存，在遍历过程中保存遍历过的最后 n 个节点，当走到链表尾的时候，把倒数第 n 个节点删除。但是这个方法有点浪费空间，毕竟我们只需要倒数第 n 个，而不需要把倒数的 n 个都记录下来。比较节约内存的方法是使用两个指针，让它们之间保持 n 个位置，这样当前一个指针遍历到最后一个节点的时候，后面的指针正好指向倒数第 n 个节点：

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        last_node = self.head
        while last_node.next:
            last_node = last_node.next
        last_node.next = new_node

    def print_list(self):
        cur_node = self.head
        while cur_node:
            print(cur_node.data, end=" -> ")
            cur_node = cur_node.next
        print("None")

    def remove_nth_from_end(self, n):
        first = self.head
        second = self.head

        # Advance the second pointer by n nodes.
        for _ in range(n):
            if not second.next:  # If n is equal to the length of the linked list
                if second == self.head:  # Move head to the next node
                    self.head = self.head.next
                return
            second = second.next

        # Move both pointers until the second reaches the end
        while second:
            second = second.next
            prev = first
            first = first.next

        # Now, the first pointer points to the node to be removed
        prev.next = first.next

# Using the LinkedList
llist = LinkedList()
llist.append(1)
llist.append(2)
llist.append(3)
llist.append(4)
llist.append(5)

print("Original List:")
llist.print_list()

llist.remove_nth_from_end(2)
print("\nAfter removing the 2nd node from the end:")
llist.print_list()
```



### 两个链表的交点

要找到两个链表的交叉点，可以先遍历两个链表，得到它们的长度。计算长度差，并在较长的链表上先行遍历这个差值的步数。然后同时遍历两个链表，直到找到一个共同的节点。

```python
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

def get_intersection_node(headA, headB):
    def get_count(node):
        count = 0
        while node:
            count += 1
            node = node.next
        return count
    
    countA = get_count(headA)
    countB = get_count(headB)
    diff = abs(countA - countB)
    
    # Move the pointer for the longer list by the difference in counts
    long_list = headA if countA > countB else headB
    short_list = headB if countA > countB else headA
    for _ in range(diff):
        long_list = long_list.next
    
    # Move both pointers of both lists till they collide
    while long_list and short_list:
        if long_list == short_list:
            return long_list  # Intersection point
        long_list = long_list.next
        short_list = short_list.next
    
    return None  # No intersection

# 测试：
# 创建两个链表，让它们相交与值为 8 的节点
intersect_val = 8
listA = [4,1,8,4,5]
listB = [5,0,1,8,4,5]
intersect_node = ListNode(intersect_val)
headA = curA = ListNode(0)
headB = curB = ListNode(0)

# 链表 A
for val in listA:
    curA.next = ListNode(val)
    curA = curA.next
    if val == intersect_val:
        break

# 链表，加入交叉点
for val in listB:
    curB.next = ListNode(val)
    curB = curB.next
    if val == intersect_val:
        curB.next = intersect_node
        break

# 找到交点
result = get_intersection_node(headA.next, headB.next)
if result:
    print(f"The intersection point's value is: {result.val}")
else:
    print("No intersection found.")
```

如果两个链表完全不相交，那么函数将返回 None。