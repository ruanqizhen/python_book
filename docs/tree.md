# 树

## 基本概念

链表中每个节点只有一个后续节点，如果每个节点可以指向多个后续节点的话，就构成了树数据结构。链表可以认为是一种特殊的树。树在面试中可能是被问的最多的数据结构，它比数组和链表复杂，又不至于太复杂，正适合各种面试。

树的节点（Node）与链表的节点类似。树顶部的节点被称为根节点（Root），一棵树中只有一个根节点。连接两个节点的线被称为边（Edge）。根节点在第 0 层，它的子节点在第 1 层，以此类推。连接两个节点的线叫做边，根节点到最远叶节点的最长路径的边数被称为树的高度。

## 二叉树

如果树中每个节点至多有两个子节点，那么这就是一棵二叉树。二叉树是被讨论的最多的树，很多时候，讨论树状结构，默认的就是二叉树。

下面的代码构造了一棵二叉树：

```python
class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinaryTree:
    def __init__(self, root_value):
        self.root = TreeNode(root_value)

    def insert_left(self, current_node, value):
        if current_node.left is None:
            current_node.left = TreeNode(value)
        else:
            new_node = TreeNode(value)
            new_node.left = current_node.left
            current_node.left = new_node

    def insert_right(self, current_node, value):
        if current_node.right is None:
            current_node.right = TreeNode(value)
        else:
            new_node = TreeNode(value)
            new_node.right = current_node.right
            current_node.right = new_node

    def preorder_traversal(self, start, traversal):
        """Root -> Left -> Right"""
        if start:
            traversal += (str(start.value) + ' -> ')
            traversal = self.preorder_traversal(start.left, traversal)
            traversal = self.preorder_traversal(start.right, traversal)
        return traversal

    def inorder_traversal(self, start, traversal):
        """Left -> Root -> Right"""
        if start:
            traversal = self.inorder_traversal(start.left, traversal)
            traversal += (str(start.value) + ' -> ')
            traversal = self.inorder_traversal(start.right, traversal)
        return traversal

    def postorder_traversal(self, start, traversal):
        """Left -> Right -> Root"""
        if start:
            traversal = self.postorder_traversal(start.left, traversal)
            traversal = self.postorder_traversal(start.right, traversal)
            traversal += (str(start.value) + ' -> ')
        return traversal

# 使用示例
# 创建一个二叉树并添加元素
bt = BinaryTree(1)
bt.insert_left(bt.root, 2)
bt.insert_right(bt.root, 3)
bt.insert_left(bt.root.left, 4)
bt.insert_right(bt.root.left, 5)

# 遍历二叉树
print("Preorder Traversal: ", bt.preorder_traversal(bt.root, ""))
print("Inorder Traversal: ", bt.inorder_traversal(bt.root, ""))
print("Postorder Traversal: ", bt.postorder_traversal(bt.root, ""))
```

在上面的代码中 TreeNode 类定义了树的节点。每个节点有一个值 value，以及两个指向其子节点的指针： left 和 right。

BinaryTree 类用于创建和操作二叉树。类中维护了一个属性 root 表示树的根节点。insert_left 和 insert_right 方法用于向指定节点的左侧或右侧插入新数据。preorder_traversal、inorder_traversal 和 postorder_traversal 方法用于前序、中序和后序遍历树。每个方法都采用递归方式访问每个节点，并收集节点值生成遍历路径。这三种遍历方式根据节点被访问的顺序命名：

* 前序遍历 (preorder_traversal): 先访问根节点，然后是左子树，最后是右子树。
* 中序遍历 (inorder_traversal): 先访问左子树，然后是根节点，最后是右子树。
* 后序遍历 (postorder_traversal): 先访问左子树，然后是右子树，最后是根节点。



## 广度优先搜索

广度优先搜索（Breadth-First Search, BFS）从树的根开始，探索邻近的节点，然后再移向下一个层次的节点。为了实现广度优先搜索，通常使用队列，把当前层次的每个节点放入队列，然后再遍历队列中每个元素，处理下一层的节点。

```python
from collections import deque

def bfs_queue(node):
    queue = deque([node])
    while queue:
        current = queue.popleft()
        print(current.value)  # 访问当前节点
        for child in current.children:
            queue.append(child)
            
# 使用示例
root = Node('A')
root.add_child(Node('B'))
root.add_child(Node('C'))
root.children[0].add_child(Node('D'))
root.children[0].add_child(Node('E'))
root.children[1].add_child(Node('F'))

dfs_recursive(root)
```



适合处理层级信息，例如，在社交网络中查找与个人在特定距离内的所有联系人。


## 深度优先搜索
深度优先搜索（Depth-First Search, DFS）与广度优先搜索不同，它会尽可能深地搜索树的分支。当节点 v 的所在边都己被探寻过，搜索将回溯到发现节点 v 的那条边的起始节点。这一过程一直进行到已发现从源节点可达的所有节点为止。

如果说 BFS 像水面上的波纹一层层扩散，那么 DFS 就像是一个走迷宫的人，一条路走到黑，撞了南墙再回头换一条路走。

我们在前文介绍的前序、中序和后序遍历，其实本质上都属于深度优先搜索。它们通常使用递归来实现。除了递归，我们也可以使用栈（Stack）来模拟递归过程，从而实现迭代版的 DFS。相比于 BFS 使用**队列**（先进先出），DFS 使用**栈**（后进先出）来管理待访问的节点。

```python
def dfs_stack(root):
    if root is None:
        return

    stack = [root]
    
    while stack:
        current = stack.pop() # 弹出栈顶元素
        print(current.value)
        
        # 将子节点压入栈中
        # 注意：先压右节点，再压左节点，这样出栈时才是先左后右
        if current.right:
            stack.append(current.right)
        if current.left:
            stack.append(current.left)

# 使用之前定义的二叉树进行测试
#       1
#     /   \
#    2     3
#   / \
#  4   5

dfs_stack(bt.root)
# 输出: 1 2 4 5 3 (这实际上就是前序遍历的顺序)

```

DFS 非常适合用于路径搜索，或者在需要访问到叶子节点才能做出判断的问题中。比如，判断一棵树的最大深度，或者寻找是否存在一条路径的和等于某个特定值。

## 二叉搜索树

二叉搜索树（Binary Search Tree，BST）是一棵特殊的二叉树，它具有以下性质：

1. 若任意节点的左子树不空，则左子树上所有节点的值均小于它的根节点的值；
2. 若任意节点的右子树不空，则右子树上所有节点的值均大于它的根节点的值；
3. 任意节点的左、右子树也分别为二叉搜索树。

简单来说，BST 的特点就是：**左子 < 根 < 右子**。这个特性使得二叉搜索树在查找数据时非常高效。类似于二分查找法，每次比较都能排除掉一半的数据。

下面是一个简单的 BST 实现，包含了插入和搜索功能：

```python
class BSTNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None

    def insert(self, value):
        if not self.root:
            self.root = BSTNode(value)
        else:
            self._insert_recursive(self.root, value)

    def _insert_recursive(self, current_node, value):
        if value < current_node.value:
            if current_node.left is None:
                current_node.left = BSTNode(value)
            else:
                self._insert_recursive(current_node.left, value)
        elif value > current_node.value:
            if current_node.right is None:
                current_node.right = BSTNode(value)
            else:
                self._insert_recursive(current_node.right, value)
        else:
            # 值已经存在，视具体需求决定是否覆盖或忽略
            print("Value already exists")

    def search(self, value):
        return self._search_recursive(self.root, value)

    def _search_recursive(self, current_node, value):
        if current_node is None:
            return False
        if value == current_node.value:
            return True
        elif value < current_node.value:
            return self._search_recursive(current_node.left, value)
        else:
            return self._search_recursive(current_node.right, value)

# 使用示例
bst = BinarySearchTree()
for val in [5, 3, 7, 2, 4, 6, 8]:
    bst.insert(val)

print(bst.search(4))  # 输出: True
print(bst.search(9))  # 输出: False

```

在理想情况下（树是平衡的），二叉搜索树的插入和查找的时间复杂度都是 。但是，如果插入的数据是有序的（例如 `[1, 2, 3, 4, 5]`），树会退化成一个链表，此时时间复杂度会变成 。为了解决这个问题，在高级应用中通常会使用**平衡二叉树**（如 AVL 树或红黑树），它们能自动调整结构以保持树的平衡。

## 堆

堆（Heap）是另一种非常重要的树形数据结构。堆通常是一棵完全二叉树，它满足以下性质：

* **最大堆（Max Heap）**：父节点的值总是大于或等于其子节点的值。根节点是最大的元素。
* **最小堆（Min Heap）**：父节点的值总是小于或等于其子节点的值。根节点是最小的元素。

虽然堆在逻辑上是树，但在 Python 中，我们通常使用**数组（列表）**来实现堆。对于数组中索引为 `i` 的节点：

* 其左子节点的索引为 `2*i + 1`
* 其右子节点的索引为 `2*i + 2`
* 其父节点的索引为 `(i - 1) // 2`

Python 的标准库 `heapq` 提供了对堆的支持。需要注意的是，`heapq` 默认实现的是**最小堆**。

```python
import heapq

# 创建一个空堆
min_heap = []

# 添加元素 (heappush)
heapq.heappush(min_heap, 5)
heapq.heappush(min_heap, 1)
heapq.heappush(min_heap, 3)
heapq.heappush(min_heap, 10)

print(min_heap) 
# 输出可能为: [1, 5, 3, 10]。注意：堆不保证列表完全有序，只保证 heap[0] 是最小的

# 弹出最小元素 (heappop)
smallest = heapq.heappop(min_heap)
print(f"弹出的最小值: {smallest}") # 输出: 1
print(f"剩余的堆: {min_heap}")      # 输出: [3, 5, 10]

# 将一个已有的列表转化为堆
data = [5, 7, 9, 1, 3]
heapq.heapify(data)
print(f"转换后的堆: {data}")        # 输出: [1, 3, 9, 7, 5]

```

堆最常见的应用场景是**优先队列**（Priority Queue）。在任务调度系统中，我们可能希望优先处理高优先级的任务，而不是简单地按照先进先出的顺序处理，这时堆就是最佳选择。此外，堆也常用于“寻找最大的 K 个元素”这类问题。
