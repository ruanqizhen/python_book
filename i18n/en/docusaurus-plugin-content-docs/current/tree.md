# Tree

## Basic Concepts

In a linked list, each node has only one subsequent node. If each node can point to multiple subsequent nodes, a tree data structure is formed. A linked list can be considered a special kind of tree. Trees are arguably the most frequently asked data structure in interviews — they are more complex than arrays and linked lists, yet not overly so, making them ideal for various interview questions.

A tree's node is similar to a linked list's node. The node at the top of the tree is called the root node, and there is only one root node in a tree. The line connecting two nodes is called an edge. The root node is at level 0, its children are at level 1, and so on. The number of edges on the longest path from the root node to the farthest leaf node is called the height of the tree.

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

In the code above, the `TreeNode` class defines the nodes of the tree. Each node has a value `value` and two pointers to its child nodes: `left` and `right`.

The `BinaryTree` class is used to create and manipulate a binary tree. The class maintains a property `root` representing the root node of the tree. The `insert_left` and `insert_right` methods are used to insert new data to the left or right of a specified node. The `preorder_traversal`, `inorder_traversal`, and `postorder_traversal` methods are used for preorder, inorder, and postorder traversal of the tree. Each method recursively visits every node and collects node values to form a traversal path. These three traversal methods are named according to the order in which nodes are visited:

* **Preorder traversal (preorder_traversal)**: Visit the root node first, then the left subtree, and finally the right subtree.
* **Inorder traversal (inorder_traversal)**: Visit the left subtree first, then the root node, and finally the right subtree.
* **Postorder traversal (postorder_traversal)**: Visit the left subtree first, then the right subtree, and finally the root node.

## Breadth-First Search

Breadth-First Search (BFS) starts from the root of the tree, explores neighboring nodes, and then moves to the next level of nodes. To implement BFS, a queue is typically used: put each node of the current level into the queue, then traverse each element in the queue to process the nodes of the next level.

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

BFS is suitable for processing hierarchical information, such as finding all contacts within a certain distance from a person in a social network.

## Depth-First Search

Depth-First Search (DFS) differs from BFS in that it explores as far as possible along each branch of the tree. When all edges of node `v` have been explored, the search backtracks to the starting node of the edge that led to the discovery of node `v`. This process continues until all nodes reachable from the source node have been discovered.

If BFS is like ripples on water spreading layer by layer, then DFS is like someone walking through a maze — going down one path until hitting a dead end, then turning back to try another path.

The preorder, inorder, and postorder traversals introduced earlier are essentially all depth-first searches. They are typically implemented using recursion. Besides recursion, we can also use a stack to simulate the recursive process and implement an iterative version of DFS. Compared to BFS, which uses a **queue** (first-in-first-out), DFS uses a **stack** (last-in-first-out) to manage the nodes to be visited.

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

DFS is well-suited for path searching, or for problems where a decision can only be made after reaching a leaf node. For example, finding the maximum depth of a tree, or determining whether there exists a path whose sum equals a specific value.

## Binary Search Tree

A Binary Search Tree (BST) is a special type of binary tree with the following properties:

1. If the left subtree of any node is not empty, then all node values in the left subtree are less than the root node's value.
2. If the right subtree of any node is not empty, then all node values in the right subtree are greater than the root node's value.
3. The left and right subtrees of any node are also binary search trees themselves.

In simple terms, the characteristic of a BST is: **left child < root < right child**. This property makes binary search trees very efficient for searching data. Similar to the binary search algorithm, each comparison can eliminate half of the data.

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

In an ideal case (where the tree is balanced), the time complexity for both insertion and search in a binary search tree is . However, if the inserted data is sorted (e.g., `[1, 2, 3, 4, 5]`), the tree degenerates into a linked list, and the time complexity becomes . To solve this problem, advanced applications typically use **balanced binary search trees** (such as AVL trees or red-black trees), which can automatically adjust their structure to maintain tree balance.

## Heap

A Heap is another very important tree-like data structure. A heap is usually a complete binary tree that satisfies the following properties:

* **Max Heap**: The value of a parent node is always greater than or equal to the values of its child nodes. The root node is the largest element.
* **Min Heap**: The value of a parent node is always less than or equal to the values of its child nodes. The root node is the smallest element.

Although a heap is logically a tree, in Python we typically use an **array (list)** to implement it. For a node at index `i` in the array:

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

The most common application of heaps is **Priority Queues**. In a task scheduling system, we may want to process high-priority tasks first, rather than simply following a first-in-first-out order; in this case, a heap is the optimal choice. Additionally, heaps are often used for problems such as "finding the K largest elements."
