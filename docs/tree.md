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
（Breadth-First Search, BFS）

适合处理层级信息，例如，在社交网络中查找与个人在特定距离内的所有联系人。


## 深度优先搜索
Depth-First Search, DFS）
适合路径搜索，在需要找到所有可能路径的问题中，如迷宫解决方案、括号生成问题。
