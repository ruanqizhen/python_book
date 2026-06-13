# Stack and Queue

Stack and queue are two fundamental data structures that are often discussed together. They are typically implemented based on linked lists and can serve as a concrete application example of linked lists.

## Basic Concepts

### Stack

A Stack is a Last-In-First-Out (LIFO) data structure, meaning the last element added is the first one to be removed. A stack is somewhat like a pistol magazine: data pushed into the stack is like bullets loaded into the magazine, and the bullet loaded first will always come out last.

A stack has three basic operations:
* Push: Add an element to the top of the stack
* Pop: Remove the top element of the stack
* Top: View the top element of the stack without removing it

### Queue

A Queue is a First-In-First-Out (FIFO) data structure, meaning the first element added is the first one to be removed. A queue behaves like people queuing to buy tickets: data entering the queue is like customers joining the line, and the customer who queues up first will always be served first and leave the line first.

A queue also has three similar basic operations:
* Enqueue: Add an element to the end of the queue
* Dequeue: Remove the element at the front of the queue
* Front: View the element at the front of the queue without removing it

### Deque

A deque (short for double-ended queue) is a data structure that combines the properties of both a stack and a queue. Elements in a deque can be added and removed from both ends. Therefore, by restricting enqueue or dequeue operations to one end, it can be used as either a stack or a queue. In practice, a doubly linked list is commonly used to replace a stack or a queue.

A deque is implemented using a doubly linked list, but it restricts insertions and deletions to only the head and tail ends of the list. Therefore, its enqueue and dequeue time complexity is the same as linked list insertion and deletion, both being $O(1)$.

In Python, there is a built-in deque implementation, the `deque` class in the `collections` module. It is implemented in C. To balance performance and memory efficiency, it does not use a simple doubly linked list internally; instead, it uses a doubly linked list composed of fixed-length array blocks. This makes adding/removing elements at both ends very fast ($O(1)$), but accessing elements in the middle is still slower. The basic operations of deque are as follows:
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

In the program above, each `append` and `appendleft` creates a new `Node` instance. We implement `appendleft` and `append` by adjusting the references of the head and tail nodes. Similarly, `popleft` and `pop` operations remove a node from the corresponding end of the linked list and update the head or tail reference.

## Applications

Stacks and queues are well-suited for scenarios that require fast addition and removal of data, such as: being used as a cache; for inter-thread communication, especially in producer-consumer problems, where a queue can serve as a work queue between producers and consumers. When traversing a tree or a graph, stacks or queues are also often needed to store data.

### Valid Parentheses

Given a string containing only the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. A valid string requires that every opening bracket must be matched with a closing bracket of the same type, and the opening brackets must be closed in the correct order.

The algorithm is straightforward: each time an opening bracket is read, push it onto the stack; each time a closing bracket is read, pop an opening bracket from the stack. If the two brackets match, proceed; if they do not match, or if there are unmatched brackets remaining at the end, the input string is invalid. The code is as follows:

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

In the code above, we use a dictionary `bracket_map` to store the bracket pairing relationships, allowing us to quickly check whether a closing bracket matches the opening bracket on top of the stack.

### Implementing a Min Stack

Design a stack that supports push, pop, and top operations, and can retrieve the minimum element in the stack in constant time. Some readers might think of using a regular stack with an extra variable to record the minimum data pushed. However, a single variable is not enough, because when the minimum data is popped, we have no way of knowing the new minimum among the remaining elements in the stack.

We can use the auxiliary stack approach. We maintain two stacks:
1. Main stack (stack): Used to store all data normally.
2. Min stack (min_stack): Used to synchronously store the current sequence of minimum values.

The logic is as follows:
- Push: Push the data onto the main stack. If the data is less than or equal to the top element of the min stack (or the min stack is empty), also push the data onto the min stack.
- Pop: Pop data from the main stack. If the popped data equals the top element of the min stack, it means the removed data is the current minimum, so the min stack must also be popped synchronously.
- Get minimum: Directly read the top element of the min stack.

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
