# Stack and Queue

Stacks and queues are two fundamental data structures that are often discussed together. Typically implemented using linked lists, they serve as excellent practical applications of list-based structures.

## Basic Concepts

### Stack

A **stack** is a Last-In-First-Out (LIFO) data structure, meaning the last element added is the first one to be removed. A stack is analogous to a pistol magazine: the first bullet loaded into the magazine resides at the bottom and is the last to be fired, while the last bullet loaded sits at the top and is fired first.

A stack has three basic operations:
* **Push**: Add an element to the top of the stack.
* **Pop**: Remove the top element of the stack.
* **Top**: View the top element of the stack without removing it.

### Queue

A **queue** is a First-In-First-Out (FIFO) data structure, meaning the first element added is the first to be removed. A queue is analogous to a line of people waiting to buy tickets: the person who joins the line first is served first and leaves first.

A queue also has three similar basic operations:
* **Enqueue**: Add an element to the end of the queue.
* **Dequeue**: Remove the element at the front of the queue.
* **Front**: View the element at the front of the queue without removing it.

### Deque

A **deque** (short for double-ended queue) combines the properties of both a stack and a queue. Elements can be added to or removed from both the front and the back of a deque. By restricting operations to one end, a deque can easily emulate a stack or a queue. In practice, deques or doubly linked lists are frequently used in place of basic stacks and queues.

When implemented using a doubly linked list, a deque restricts insertions and deletions to the head and tail. Consequently, these operations achieve a time complexity of $O(1)$.

Python provides a built-in double-ended queue implementation through the `deque` class in the `collections` module. Written in C, it balances performance and memory efficiency by utilizing a doubly linked list of fixed-length array blocks. This hybrid architecture ensures that adding or removing elements at either end is extremely fast ($O(1)$), though random access to elements in the middle remains slow ($O(n)$). The basic operations of `deque` are:
* Right-side append `append()`: Add an element to the right end.
* Left-side append `appendleft()`: Add an element to the left end.
* Right-side pop `pop()`: Pop an element from the right end.
* Left-side pop `popleft()`: Pop an element from the left end.

### Implementing a Deque Using a Linked List

Code example:

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
        if not self.tail:  # if the deque is empty
            self.head = self.tail = new_node
        else:
            self.tail.next = new_node
            new_node.prev = self.tail
            self.tail = new_node

    def appendleft(self, value):
        new_node = Node(value)
        if not self.head:  # if the deque is empty
            self.head = self.tail = new_node
        else:
            self.head.prev = new_node
            new_node.next = self.head
            self.head = new_node

    def pop(self):
        if not self.tail:
            raise IndexError("pop from an empty deque")
        value = self.tail.value
        if self.head == self.tail:  # only one element
            self.head = self.tail = None
        else:
            self.tail = self.tail.prev
            self.tail.next = None
        return value

    def popleft(self):
        if not self.head:
            raise IndexError("pop from an empty deque")
        value = self.head.value
        if self.head == self.tail:  # only one element
            self.head = self.tail = None
        else:
            self.head = self.head.next
            self.head.prev = None
        return value

# Test
deque = Deque()
deque.append(1)
deque.append(2)
deque.appendleft(0)
print(deque.pop())      # Output: 2
print(deque.popleft())  # Output: 0
```

In the code above, each `append` and `appendleft` operation instantiates a new `Node`. We manage insertions at either end by updating the pointers of the head and tail nodes. Similarly, `pop` and `popleft` operations remove a node from the appropriate boundary and update the corresponding reference.

## Applications

Stacks and queues are well-suited for scenarios requiring fast data insertion and removal. Examples include:
* **Caches**: Storing temporary data for fast retrieval.
* **Inter-thread communication**: Particularly in producer-consumer patterns, where a queue serves as a shared buffer.
* **Graph and tree traversals**: Storing nodes during depth-first or breadth-first searches.

### Valid Parentheses

Given a string containing only the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the string is valid. A string is valid if:
1. Open brackets are closed by the same type of brackets.
2. Open brackets are closed in the correct order.

The algorithm is straightforward: when we encounter an opening bracket, we push it onto the stack. When we see a closing bracket, we pop the top element from the stack and verify that it matches. If the brackets match, we continue; if they mismatch, or if the stack is not empty at the end of the scan, the string is invalid. The implementation is as follows:

```python
def isValid(s: str) -> bool:
    # Directly use a list as a stack
    stack = []
    bracket_map = {')': '(', '}': '{', ']': '['}

    for char in s:
        if char in bracket_map:
            # Get the top element of the stack, use a dummy value if the stack is empty
            top_element = stack.pop() if stack else '#'
            if bracket_map[char] != top_element:
                return False
        else:
            stack.append(char)

    return not stack

# Test code
test_string = "([{}])"
print(isValid(test_string))  # Should return True

test_string = "([)]"
print(isValid(test_string))  # Should return False

test_string = "{[]}"
print(isValid(test_string))  # Should return True
```

In the code above, we use the `bracket_map` dictionary to store pairs, allowing us to quickly check whether a closing bracket matches the opening bracket at the top of the stack.

### Implementing a Min Stack

Design a stack that supports `push`, `pop`, and `top` operations, and can retrieve the minimum element in $O(1)$ time. 

Using a single variable to store the minimum value is insufficient because once that minimum element is popped off the stack, we lose track of the next smallest value among the remaining elements.

To solve this, we can maintain an auxiliary stack alongside the main stack:
1. Main stack (`stack`): Stores all data.
2. Min stack (`min_stack`): Stores the running minimums.

Our operations are structured as follows:
* **Push**: Push the value onto the main stack. If the value is less than or equal to the current minimum (the top of the min stack) or if the min stack is empty, push it onto the min stack as well.
* **Pop**: Pop the value from the main stack. If this value equals the top of the min stack, pop it from the min stack as well.
* **Get Minimum**: Retrieve the top value of the min stack.

The implementation code is as follows:

```python
from collections import deque

class MinStack:
    def __init__(self):
        self.stack = deque()      # Main stack
        self.min_stack = deque()  # Auxiliary stack, the top is always the current minimum in the main stack

    def push(self, x: int) -> None:
        self.stack.append(x)
        # Key logic: only push to the auxiliary stack when the new element <= current minimum
        # This way, the auxiliary stack stores a decreasing sequence
        if not self.min_stack or x <= self.min_stack[-1]:
            self.min_stack.append(x)

    def pop(self) -> None:
        val = self.stack.pop()
        # Key logic: if the popped data equals the current minimum, the auxiliary stack must also pop
        # This way, the top of the auxiliary stack becomes the previous second smallest value
        if val == self.min_stack[-1]:
            self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min_stack[-1]

# Test code
min_stack = MinStack()
min_stack.push(-2)
min_stack.push(0)
min_stack.push(-3)
print(min_stack.getMin())  # Returns -3
min_stack.pop()
print(min_stack.top())    # Returns 0
print(min_stack.getMin())  # Returns -2
```
