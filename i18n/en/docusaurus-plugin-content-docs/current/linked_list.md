# Linked List

## Basic Concepts

A linked list is a fundamental data structure used for storing elements. It is often compared to arrays; in a linked list, elements are not stored sequentially but are linked together through pointers.

Each element in a linked list is called a node. Each node typically consists of two parts: the data part and the pointer part. The data part stores the value of the element, while the pointer part stores a reference to the next node. The first node of a linked list is called the head node. We usually use the head node to represent the entire linked list. The last node of a linked list is called the tail node. The pointer part of the tail node usually points to None, indicating the end of the linked list.

![](images/008.png "Linked List Diagram")

## Basic Operations

The most basic operations of a linked list include:

* Creating an empty linked list
* Inserting a new node. Linked lists do not have indices, so when inserting a new node, you typically use an existing node as a reference, such as inserting before or after a given node, or inserting at the head or tail of the list.
* Deleting a given node
* Traversing and searching

The following program implements these basic operations:

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):       # Add a new node to the end of the linked list
        new_node = Node(data)     # Create a new node
        if not self.head:         # Empty linked list
            self.head = new_node
            return
        last_node = self.head
        while last_node.next:     # Find the tail of the linked list
            last_node = last_node.next
        last_node.next = new_node # Link to the new node

    def print_list(self):
        cur_node = self.head
        while cur_node:           # Traverse each node
            print(cur_node.data, end=" -> ")
            cur_node = cur_node.next
        print("None")

    def insert_after_node(self, prev_node, data):
        if not prev_node:
            print("Previous node is not in the list")
            return
        new_node = Node(data)
        new_node.next = prev_node.next # The new node's pointer points to the reference node's next node
        prev_node.next = new_node      # The reference node's pointer points to the new node

    def find_node_by_key(self, key):
        cur_node = self.head
        while cur_node:                # Traverse all nodes, comparing one by one
            if cur_node.data == key:   # Until the target node is found
                return cur_node
            cur_node = cur_node.next
        return None

    def delete_node(self, node_to_delete):
        if not node_to_delete:
            return

        # If the node to be deleted is the head node
        if self.head == node_to_delete:
            self.head = self.head.next
            return

        prev_node = None
        cur_node = self.head    
        while cur_node and cur_node != node_to_delete:
            prev_node = cur_node        # Find the previous node
            cur_node = cur_node.next
        
        # If the node is not in the list, return directly
        if not cur_node:
            return
        
        # Remove the current node from the linked list
        prev_node.next = cur_node.next

# Using the linked list
llist = LinkedList()
llist.append(1)
llist.append(2)
llist.append(3)
llist.print_list()  # Output: 1 -> 2 -> 3 -> None

node_to_delete = llist.find_node_by_key(2)
llist.delete_node(node_to_delete)
llist.print_list()  # 1 -> 3 -> None
```

In the program above, the Node class is used to represent each node in the linked list. Each node has two attributes: data (used to store the value) and next (a reference to the next node).

The LinkedList class is used to represent the entire linked list. It contains an attribute head that points to the first node of the list. The append() method adds a new node to the end of the list. The insert_after_node() method can insert a new node after a given prev_node. The find_node_by_key() method can find a node by its data. The delete_node() method can delete a node.

From the example implementation above, it can be seen that if you only insert a node at the head of the linked list (or insert when the predecessor node is known), the time complexity is $O(1)$. However, for the append method in the above code, since it needs to traverse the entire list to find the tail, its time complexity is actually $O(n)$.

In the linked list above, the time complexity for deleting a node is $O(n)$, because you can only delete after finding the previous node of the current node. If there were a function to delete the next node, you wouldn't need to traverse the entire list, and the time complexity could be reduced to $O(1)$. Alternatively, in a doubly linked list, the time complexity for deleting a node can also be $O(1)$.



## Doubly Linked List 

![images/009.png](images/009.png "Doubly Linked List Diagram")

In a doubly linked list, each node records the positions of both the previous node and the next node. Therefore, in a doubly linked list, you can jump directly from one node to its previous or next node, allowing traversal in either direction. If the next pointer of the last node (tail node) points to the head node, and the previous pointer of the head node points to the tail node, then this forms a circular doubly linked list, as shown in the diagram above.

Singly linked lists can also have cycles. In a linked list with a cycle, not all nodes are necessarily within the cycle; some nodes may be outside the cycle while others form it. In practice, non-circular linked lists are more common.

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None
        self.prev = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None

    # Insert a node at the end of the linked list
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

    # Insert a node at the head of the linked list
    def prepend(self, data):
        new_node = Node(data)
        new_node.next = self.head
        if self.head:
            self.head.prev = new_node
        self.head = new_node

    # Delete a node
    def delete(self, node):
        cur_node = self.head
        while cur_node:
            if cur_node == node:
                # Delete the head node
                if cur_node.prev:
                    cur_node.prev.next = cur_node.next
                else:
                    self.head = cur_node.next
                # Delete the tail node
                if cur_node.next:
                    cur_node.next.prev = cur_node.prev
                return  # Node deleted, exit loop
            cur_node = cur_node.next

    # Print the linked list
    def print_list(self):
        cur_node = self.head
        while cur_node:
            print(cur_node.data, end=" <-> ")
            cur_node = cur_node.next
        print("None")

# Using the doubly linked list
dllist = DoublyLinkedList()
dllist.append(1)
dllist.append(2)
dllist.append(3)
dllist.print_list()  # 1 <-> 2 <-> 3 <-> None

node_to_delete = dllist.head.next  # Select the second node (value 2) for deletion
dllist.delete(node_to_delete)
dllist.print_list()  # 1 <-> 3 <-> None
```

The example above demonstrates a doubly linked list, whose implementation is very similar to a singly linked list. However, each node has two pointers, pointing to the previous node and the next node respectively.

## Common Problems

### Reverse Linked List

Write a function to reverse a singly linked list. The algorithm for reversing a linked list is quite intuitive: traverse each node and change the direction of the node's pointer. It is important to consider how to temporarily store nodes for setting pointers. This can be done using iteration or recursion.

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

# Test
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

Whether using iteration or recursion, reversing a linked list requires traversing each node once, so the time complexity is $O(n)$, where n is the number of nodes. The algorithm reuses the original nodes without creating a new linked list, so the space complexity is $O(1)$.


### Detecting a Cycle


Detect whether there is a cycle in a linked list. If there is a cycle, it means that during traversal, you will eventually encounter a node that has been visited before. The most straightforward approach is to mark all visited nodes. If the nodes have extra space to store new data, you can add a marker to each node during traversal to indicate it has been visited. When traversing the list, if you encounter a node that is already marked, it means the list has a cycle. If you cannot mark nodes directly, you have to allocate additional memory for recording, with the most convenient approach being to use a set. During traversal, store each node in the set; if a node is already found in the set, it indicates a cycle.

The space complexity of both algorithms above is $O(n)$, because they both require additional data to record each node. There is also a "fast and slow pointer" algorithm with space complexity of $O(n1)$. The basic idea is to use two pointers, one moving fast (two steps at a time) and the other moving slowly (one step at a time). If there is a cycle in the linked list, the two pointers will eventually meet. The program example is as follows:

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
        # This method is used to create a cycle for testing purposes
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

# Using the singly linked list
llist = LinkedList()
llist.append(1)
llist.append(2)
llist.append(3)
llist.append(4)

print(llist.has_cycle())  # False

# Create a cycle for testing
llist.create_cycle(1)
print(llist.has_cycle())  # True
```


### Remove the Nth Node from the End

To delete the nth node from the end in a singly linked list. Since it is a singly linked list, we cannot traverse from back to front; we can only traverse from front to back. To avoid missing the nth node from the end, an intuitive approach is to create a buffer to save the last n nodes traversed during the traversal. When reaching the end of the list, delete the nth node from the end. However, this method wastes some space, since we only need the nth node from the end, not all n nodes. A more memory-efficient approach is to use two pointers, maintaining a gap of n positions between them. This way, when the front pointer reaches the last node, the rear pointer will be pointing exactly at the nth node from the end:

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

This problem also has a more standard and robust "fast and slow pointer" approach. Typically, first let second move n steps; if second becomes None, it means the node to be deleted is the head node.

```python
    def remove_nth_from_end(self, n):
        fast = self.head
        slow = self.head

        # Let the fast pointer move n steps first
        for _ in range(n):
            if fast is None:
                print("n is greater than the length of the linked list")
                return
            fast = fast.next
        
        # If the fast pointer reaches None, it means the nth node from the end is the head node
        if fast is None:
            self.head = self.head.next
            return

        # Move the fast and slow pointers synchronously until the fast pointer reaches the last node
        while fast.next:
            fast = fast.next
            slow = slow.next
        
        # At this point, slow points to the (n+1)th node from the end, delete its next node
        slow.next = slow.next.next
```

### Intersection of Two Linked Lists

To find the intersection point of two linked lists, you can first traverse both lists to get their lengths. Calculate the difference in lengths, and traverse the longer list by that many steps first. Then traverse both lists simultaneously until a common node is found.

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

# Test:
intersect_val = 8
# Define the common part
common_node = ListNode(8)
common_node.next = ListNode(4)
common_node.next.next = ListNode(5)

# Build linked list A: 4 -> 1 -> (8 -> 4 -> 5)
headA = ListNode(4)
headA.next = ListNode(1)
headA.next.next = common_node

# Build linked list B: 5 -> 0 -> 1 -> (8 -> 4 -> 5)
headB = ListNode(5)
headB.next = ListNode(0)
headB.next.next = ListNode(1)
headB.next.next.next = common_node

# Find the intersection point
result = get_intersection_node(headA, headB)
if result:
    print(f"The intersection point's value is: {result.val}")
else:
    print("No intersection found.")
```

If the two linked lists are completely disjoint, the function will return None.
