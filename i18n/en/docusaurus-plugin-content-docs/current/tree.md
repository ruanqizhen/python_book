# Tree

## Basic Concepts

In a linked list, each node has at most one successor. If each node can point to multiple successors, we get a **tree** data structure. A linked list can therefore be viewed as a specialized, linear tree. Trees are among the most frequently tested data structures in interviews; they are more complex than arrays or linked lists, yet highly structured, making them ideal for testing algorithmic thinking.

A tree's nodes are structured hierarchically. The node at the very top of the tree is called the **root**, and a tree contains exactly one root node. The connections between nodes are referred to as **edges**. Nodes without any children are called **leaves**. The root node resides at level 0, its children at level 1, and so on. The **height** of a tree is defined as the number of edges on the longest path from the root to any leaf node.

## Binary Tree

If each node in a tree has at most two child nodes, it is a binary tree. Binary trees are the most discussed type of tree, and in many cases, when talking about tree structures, binary trees are assumed by default.

The following code constructs a binary tree:

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

# Usage example
# Create a binary tree and add elements
bt = BinaryTree(1)
bt.insert_left(bt.root, 2)
bt.insert_right(bt.root, 3)
bt.insert_left(bt.root.left, 4)
bt.insert_right(bt.root.left, 5)

# Traverse the binary tree
print("Preorder Traversal: ", bt.preorder_traversal(bt.root, ""))
print("Inorder Traversal: ", bt.inorder_traversal(bt.root, ""))
print("Postorder Traversal: ", bt.postorder_traversal(bt.root, ""))
```

In the code above, the `TreeNode` class defines the nodes of the tree. Each node stores a value `value` and references to its left and right child nodes.

The `BinaryTree` class handles tree construction and traversals. It maintains a reference to the `root` node. The `insert_left()` and `insert_right()` methods append nodes to the specified parent. The `preorder_traversal()`, `inorder_traversal()`, and `postorder_traversal()` methods recursively visit each node to yield a traversal path. These three depth-first traversal strategies are named after the relative order in which the root node is visited:

* **Preorder traversal**: Visit the root node first, then the left subtree, and finally the right subtree (Root $\rightarrow$ Left $\rightarrow$ Right).
* **Inorder traversal**: Visit the left subtree first, then the root node, and finally the right subtree (Left $\rightarrow$ Root $\rightarrow$ Right).
* **Postorder traversal**: Visit the left subtree first, then the right subtree, and finally the root node (Left $\rightarrow$ Right $\rightarrow$ Root).

## Breadth-First Search

Breadth-First Search (BFS) begins at the root node and explores all nodes at the current depth level before moving to the next level. To implement BFS, we use a queue: we enqueue the root, then repeatedly dequeue a node, process it, and enqueue all of its children.

```python
from collections import deque

def bfs_queue(node):
    queue = deque([node])
    while queue:
        current = queue.popleft()
        print(current.value)  # Visit the current node
        for child in current.children:
            queue.append(child)

# Usage example
root = Node('A')
root.add_child(Node('B'))
root.add_child(Node('C'))
root.children[0].add_child(Node('D'))
root.children[0].add_child(Node('E'))
root.children[1].add_child(Node('F'))

dfs_recursive(root)
```

BFS is ideal for hierarchical or distance-based queries, such as finding all connections within a specific degree of separation in a social network.

## Depth-First Search

Depth-First Search (DFS) differs from BFS by exploring as deep as possible along each branch before backtracking. When the search reaches a node with no unvisited descendants, it backtracks to the most recent ancestor that still has unexplored branches. This process continues until all reachable nodes have been visited.

If BFS is like ripples on water spreading outward layer by layer, DFS is like exploring a maze—plunging down a single path until hitting a dead end, then backtracking to try the next branch.

The preorder, inorder, and postorder traversals introduced earlier are all forms of depth-first search. While they are most naturally implemented using recursion, we can also write them iteratively by using an explicit stack to simulate the call stack. While BFS manages nodes with a first-in-first-out (FIFO) **queue**, DFS manages nodes using a last-in-first-out (LIFO) **stack**.

```python
def dfs_stack(root):
    if root is None:
        return

    stack = [root]

    while stack:
        current = stack.pop()  # Pop the top element of the stack
        print(current.value)

        # Push child nodes onto the stack
        # Note: push the right node first, then the left node, so that when popping, left comes before right
        if current.right:
            stack.append(current.right)
        if current.left:
            stack.append(current.left)

# Test using the previously defined binary tree
#       1
#     /   \
#    2     3
#   / \
#  4   5

dfs_stack(bt.root)
# Output: 1 2 4 5 3 (this is essentially the order of preorder traversal)

```

DFS is well-suited for pathfinding, or for problems where a decision depends on reaching a leaf node (e.g., finding the maximum depth of a tree or determining if a path sum equals a target value).

## Binary Search Tree

A Binary Search Tree (BST) is a binary tree that satisfies the following structural properties:

1. The left subtree of a node contains only nodes with values less than the node's value.
2. The right subtree of a node contains only nodes with values greater than the node's value.
3. The left and right subtrees must also be binary search trees.

In short, a BST satisfies the property: **left child < root < right child**. This ordering makes binary search trees highly efficient for search operations; similar to binary search on an array, each comparison eliminates half of the remaining search space.

Below is a simple BST implementation, including insert and search functionality:

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
            # Value already exists, decide whether to overwrite or ignore based on specific requirements
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

# Usage example
bst = BinarySearchTree()
for val in [5, 3, 7, 2, 4, 6, 8]:
    bst.insert(val)

print(bst.search(4))  # Output: True
print(bst.search(9))  # Output: False

```

In a balanced BST, both insertion and search run in $O(\log n)$ time. However, if sorted data (e.g., `[1, 2, 3, 4, 5]`) is inserted sequentially, the tree degenerates into a linear structure similar to a linked list, causing operations to degrade to $O(n)$ time. To prevent this, real-world systems use self-balancing binary search trees (such as AVL trees or red-black trees) that automatically restructure themselves during insertions and deletions.

## Heap

A **heap** is another fundamental tree-based data structure. A heap is typically represented as a complete binary tree that satisfies one of the following properties:

* **Max Heap**: The value of a parent node is always greater than or equal to the values of its child nodes. The root node is the largest element.
* **Min Heap**: The value of a parent node is always less than or equal to the values of its child nodes. The root node is the smallest element.

Although a heap is logically a tree, it is typically implemented using a flat array (or Python list) for efficiency. For a node at index `i` in this array:

* The index of its left child is `2*i + 1`
* The index of its right child is `2*i + 2`
* The index of its parent is `(i - 1) // 2`

Python's standard library `heapq` provides support for heaps. Note that `heapq` implements a **min heap** by default.

```python
import heapq

# Create an empty heap
min_heap = []

# Add elements (heappush)
heapq.heappush(min_heap, 5)
heapq.heappush(min_heap, 1)
heapq.heappush(min_heap, 3)
heapq.heappush(min_heap, 10)

print(min_heap)
# Output might be: [1, 5, 3, 10]. Note: the heap does not guarantee the list is fully sorted, only that heap[0] is the smallest

# Pop the smallest element (heappop)
smallest = heapq.heappop(min_heap)
print(f"Popped minimum: {smallest}") # Output: 1
print(f"Remaining heap: {min_heap}")  # Output: [3, 5, 10]

# Convert an existing list into a heap
data = [5, 7, 9, 1, 3]
heapq.heapify(data)
print(f"Heap after conversion: {data}")  # Output: [1, 3, 9, 7, 5]

```

The primary application of heaps is implementing **Priority Queues**. For instance, a task scheduling system might need to execute high-priority tasks first rather than in FIFO order, making a heap the perfect choice. Heaps are also widely used for top-K queries, such as "finding the $K$ largest elements".
