# Lists and Tuples

:::tip
Operations on lists and tuples often rely on [loops](loop) and [list comprehensions](comprehension#list-comprehensions). While we introduce lists and tuples early to establish core concepts, beginners may want to review control flow first. Re-visiting lists and tuples after learning loops will make advanced operations much easier to grasp.

Common tasks like searching and sorting are discussed in detail in the algorithm chapters, such as the [Array](array) section.
:::

## Creating Lists

A list is an ordered collection of items and is one of the most versatile built-in data structures in Python. To create a list, place comma-separated values inside square brackets `[ ]`:

```python
fruits = ["apple", "banana", "orange"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "apple", 3.5]
```

You can also convert other [iterable objects](loop#iterables-and-iterators) into lists using the `list()` constructor function:

```python
# Create a list from a tuple
tup = (1, 2, 3)
list_from_tuple = list(tup)     # Result: [1, 2, 3]

# Create a list of characters from a string
string = "hello"
list_from_string = list(string) # Result: ['h', 'e', 'l', 'l', 'o']
```

Keep the `list()` function in mind; we will cover iterables and tuples in depth later in this chapter.

[List comprehensions](comprehension#list-comprehensions) are another popular way to generate lists, which we cover in the Functional Programming section.

## Accessing List Elements

### Indexing

Like strings, lists are ordered, and each item has a unique index starting at `0`. You can retrieve an item by placing its index in square brackets:

```python
fruits = ["apple", "banana", "orange", "pineapple"]
print(fruits[0])  # Output: apple
print(fruits[2])  # Output: orange
```

Negative indices count backward from the end of the list: `-1` refers to the last element, `-2` to the second-to-last, and so on.

```python
fruits = ["apple", "banana", "orange", "pineapple"]
print(fruits[-1])  # Output: pineapple
print(fruits[-2])  # Output: orange
```

### Slicing

You can extract a sublist using slicing (`list[start:end]`). Like string slicing, the start index is inclusive, while the end index is exclusive. Omitting the start index defaults to the beginning of the list, and omitting the end index defaults to the end of the list:

```python
fruits = ["apple", "banana", "orange", "pineapple"]
# Get elements from index 1 to 3 (indexes 1, 2, 3)
print(fruits[1:4])  # Output: ['banana', 'orange', 'pineapple']

# Get elements from the start up to index 3
print(fruits[:3])  # Output: ['apple', 'banana', 'orange']

# Get elements from index 2 to the end
print(fruits[1:])  # Output: ['banana', 'orange', 'pineapple']
```

You can also specify a `step` size as a third parameter inside the slice:

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print(numbers[::2])  # Step of 2, selects even numbers, Output: [0, 2, 4, 6, 8]
```

Setting the step to `-1` offers a concise way to reverse a list (creating a new reversed list):

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print(numbers[::-1])  # Reverse order, Output: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
```

While a step size can be useful, combining it with start and end indices can make code difficult to read. Try to avoid overly complex slices like the following. (Can you guess what this outputs?)

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print(numbers[-2:2:-3])  # Output: ??
```

Explanation: Starting at index `-2` (value `8`), step backward by `3` (moving left) and stop before index `2` (value `2`). This selects `8` and `5`.

Python also supports a powerful feature for extracting elements: unpacking.

### Unpacking

Unpacking decomposes a list's elements directly into individual variables in a single statement:

```python
numbers = [1, 2, 3]
a, b, c = numbers
print(a) # 1
print(b) # 2
print(c) # 3
```

If you only care about specific elements, you can use the `*` operator to capture the remaining items as a sublist:

```python
numbers = [1, 2, 3, 4, 5]
a, b, *rest = numbers
print(a)    # 1
print(b)    # 2
print(rest) # [3, 4, 5]
```

You can ignore unwanted elements by unpacking them into an underscore (`_`), which acts as a discard placeholder by convention:

```python
numbers = [1, 2, 3, 4, 5]
a, _, _, _, e = numbers
print(a) # 1
print(e) # 5
```

Unpacking also works recursively on nested structures:

```python
nested_list = [[1, 2], [3, 4]]
(a, b), (c, d) = nested_list
print(a, b, c, d) # 1 2 3 4
```

Whenever possible, prefer unpacking over manual index access. It explicitly documents which elements are being extracted and assigns them descriptive names, making your code cleaner and more self-explanatory.

## Modifying Lists

### Indexing

Because lists are mutable, you can modify their elements in place. To change a value, target its index in an assignment statement:

```python
fruits = ["apple", "banana", "orange"]
fruits[0] = "grape"
print(fruits)  # Output: ['grape', 'banana', 'orange']
```

### Slicing

You can also modify a range of elements using slice assignment:

```python
fruits = ["apple", "banana", "orange"]
fruits[1:3] = ["peach", "blueberry"]
print(fruits)  # Output: ['apple', 'peach', 'blueberry']
```

Slice assignment replaces the targeted range with a new sequence of items. The length of the new sequence does not need to match the range being replaced.

For example, targeting an empty slice like `fruits[1:1]` inserts new items at that position without deleting anything:

```python
fruits = ["apple", "banana", "orange"]

# Insert elements
fruits[1:1] = ["watermelon", "mango"]
print(fruits)  # Output: ['apple', 'watermelon', 'mango', 'banana', 'orange']

# Delete elements
fruits[1:3] = []
print(fruits)  # Output: ['apple', 'banana', 'orange']
```

Avoid using step strides in slice assignments, as they can quickly become confusing.

## Nested Lists

A list can store elements of different data types: `[1, "apple", 3.5]`

Lists can also contain other lists, creating nested structures: `[1, "apple", [5, 6, 7]]`

Nested lists are commonly used to represent multi-dimensional grids, tables, or matrices. To access their values, chain indices together:

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

print(matrix[1][2])  # Output: 6

matrix[1][2] = 10
print(matrix[1][2])  # Output: 10
```

## List Operations

### Concatenation

Concatenate two lists using the `+` operator:

```python
list1 = [1, 2, 3]
list2 = [4, 5, 6]
combined_list = list1 + list2
print(combined_list)  # Output: [1, 2, 3, 4, 5, 6]
```

### Repetition

Replicate a list multiple times using the `*` operator:

```python
list1 = ["a", "b"]
repeated_list = list1 * 3
print(repeated_list)  # Output: ['a', 'b', 'a', 'b', 'a', 'b']
```

Warning: Multiplying a list containing mutable objects creates a **shallow copy**. The duplicated list references the exact same objects in memory. Modifying a nested item in one copy changes it across all copies:

```python
elem = ["a"]
row_list = elem * 3
print(row_list)     # Output: ['a', 'a', 'a']

board_list = [row_list] * 3
print(board_list)   # Output: [['a', 'a', 'a'], ['a', 'a', 'a'], ['a', 'a', 'a']]
board_list[0][0] = 0
print(board_list)   # Output: [[0, 'a', 'a'], [0, 'a', 'a'], [0, 'a', 'a']]
```

To initialize a multi-dimensional list safely with independent rows, use a [list comprehension](comprehension):

```python
board = [[0] * 8 for _ in range(8)]
```

Here, `[0] * 8` is safe because integers are immutable. However, the outer loop generates independent list objects for each row.

### Checking for Data Presence

To check if a value exists inside a list, use the `in` operator (known as a membership test), which returns a boolean:

```python
my_list = [1, 2, 3, 4, 5]

print(3 in my_list)  # Output: True
print(6 in my_list)  # Output: False
print(7 not in my_list)  # Output: True
```

You can also combine `in` with chained comparisons:

```python
x = 3
my_list = [1, 2, 3, 4, 5]

print(2 < x in my_list)  # Output: True
```

However, chaining membership checks with equality checks can be highly confusing and is discouraged:

```python
print(False == False in [False])  # Output: True
```

This chained comparison expands to `(False == False) and (False in [False])`, which evaluates to `True`. Because of operator precedence confusion, always use explicit parentheses instead.

### Length

Get the number of items in a list using `len()`:

```python
numbers = [1, 2, 3, 4, 5, 6]

print(len(numbers))  # Output: 6
```

`len()` also works on tuples, dictionaries, and sets.

### Maximum and Minimum

Get the largest and smallest items using `max()` and `min()`:

```python
numbers = [34, 12, 89, 5, 73, 23]

# Use max(list) to return the maximum value in the list
max_value = max(numbers)
print(f"The maximum value in the list is: {max_value}")  # Output: 89

# Use min(list) to return the minimum value in the list
min_value = min(numbers)
print(f"The minimum value in the list is: {min_value}")  # Output: 5
```

These functions also work on strings, tuples, and other collections.

### Summation

Calculate the sum of all numeric items using `sum()`:

```python
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
print(total)  # Output: 15
```

You can pass an optional second argument (`start`) to add a base value to the total:

```python
numbers = [1, 2, 3, 4, 5]
total = sum(numbers, 10)
print(total)  # Output: 25
```

## Common List Methods

Like strings, lists are objects with built-in methods. You can view all available list methods by running:

```python
print(dir([]))
```

### Modifying List Elements

While slice assignment is powerful, list methods offer descriptive names that improve readability. Common list modification methods include:
* `append(x)`: Appends an item `x` to the end of the list.
* `extend(iterable)`: Appends all items from an iterable to the end of the list.
* `insert(index, x)`: Inserts an item `x` at a specific index.
* `remove(x)`: Removes the first occurrence of item `x`. Raises a `ValueError` if not found.
* `pop([index])`: Removes and returns the item at the specified index. If no index is provided, it removes and returns the last item.

`remove()` deletes by *value*, while `pop()` deletes by *index* (and returns the deleted item).

```python
fruits = ["apple", "banana", "orange"]

fruits.append("strawberry")
print(fruits)  # Output: ['apple', 'banana', 'orange', 'strawberry']

fruits.extend(["watermelon", "mango"])
print(fruits)  # Output: ['apple', 'banana', 'orange', 'strawberry', 'watermelon', 'mango']

fruits.insert(1, "pear")
print(fruits)  # Output: ['apple', 'pear', 'banana', 'orange', 'strawberry', 'watermelon', 'mango']

fruits.remove("watermelon")
print(fruits)  # Output: ['apple', 'pear', 'banana', 'orange', 'strawberry', 'mango']

removed_fruit = fruits.pop(2)
print(removed_fruit)  # Output: banana
print(fruits)  # Output: ['apple', 'pear', 'orange', 'strawberry', 'mango']

print(fruits.pop())  # Output: 'mango'
```

`append()` is the most commonly used method. We often initialize an empty list `my_list = []` and use `append()` inside a loop to populate it.

### Sorting

The `sort()` method sorts the items of a list in place. By default, it sorts in ascending order. It modifies the list directly and does not return a new list.

It accepts two optional arguments:
- `reverse=True`: Sorts the list in descending order.
- `key=function`: Specifies a function to customize the sorting criteria.

(Note that Python also provides a built-in `sorted(iterable)` function that returns a *new* sorted list rather than modifying the original in place. We discuss custom sorting in the [Higher-Order Functions](high_order#sorted) chapter.)

```python
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
numbers.sort()
print(numbers)  # Output: [1, 1, 2, 3, 4, 5, 6, 9]

numbers.sort(reverse=True)
print(numbers)  # Output: Descending order [9, 6, 5, 4, 3, 2, 1, 1]
```

### Finding Elements

The `index(x)` method searches the list for value `x` and returns its index. If the value is not found, it raises a `ValueError`:

```python
numbers = [34, 12, 89, 5, 12, 73, 23, 12]

print(numbers.index(12))   # Output: 1
```

If the item appears multiple times, `index()` only returns the first occurrence.

### Element Count

`count(x)` returns the number of times value `x` appears in the list:

```python
numbers = [34, 12, 89, 5, 12, 73, 23, 12]

print(numbers.count(12))  # Output: 3
```

If you need to count the occurrences of each element in a list, refer to the section on [Counting](counter).

### Reversing a List

The `reverse()` method reverses the elements of the list in place:

```python
numbers = [1, 2, 3, 4, 5]

numbers.reverse()
print(numbers)  # Output: [5, 4, 3, 2, 1]
```

Unlike slicing with a step of `-1` (which creates a new list), `reverse()` modifies the list in place.

### Clearing a List

The `clear()` method removes all elements from a list:

```python
numbers = [1, 2, 3, 4, 5]

numbers.clear()
print(numbers)  # Output: []
```

### Copying a List

As discussed in [Reference Variables](variable#reference-variables), reassigning `b = a` does not duplicate the list. To create an independent copy, use the `copy()` method:

```python
original_list = [1, 2, 3, 4, 5]
copied_list = original_list.copy()

# Modifying the original list does not affect the copied list
original_list[4] = '**'
print(original_list)          # Output: [1, 2, 3, 4, '**']
print(copied_list)            # Output: [1, 2, 3, 4, 5]
```

Warning: Like list multiplication, `copy()` performs a **shallow copy**. If the list contains nested lists or other mutable objects, those objects are not duplicated:

```python
original_list = [[1, 2], [3, 4, 5]]
copied_list = original_list.copy()

# For nested lists, modifying data in the original list still affects the copied list
original_list[1][2] = '**'
print(original_list)          # Output: [[1, 2], [3, 4, '**']]
print(copied_list)            # Output: [[1, 2], [3, 4, '**']]
```

To duplicate nested structures completely, perform a **deep copy** using the `copy` module's `deepcopy()` function:

```python
import copy

original_list = [[1, 2], [3, 4, 5]]
copied_list = copy.deepcopy(original_list)

# Deep copy ensures that modifying the original list does not affect the copied list
original_list[1][2] = '**'
print(original_list)          # Output: [[1, 2], [3, 4, '**']]
print(copied_list)            # Output: [[1, 2], [3, 4, 5]]
```

### Method Return Values

Crucial concept: list methods modify the object in place and do not return the modified list (they return `None`). In contrast, string methods (since strings are immutable) return a *new* string. Make sure you use the right pattern:

```python
# 1: String methods (return new data)
text = "hello"
# Use the upper() method to convert the string to uppercase
upper_text = text.upper()  # Need to capture the return value
print("Original string:", text)  # Output: Original string: hello
print("Uppercase string:", upper_text)  # Output: Uppercase string: HELLO

# If you don't use the return value, the original string remains unchanged
text.upper()
print("String after not capturing the return value:", text)  # Output: String after not capturing the return value: hello

# 2: List methods (directly modify the object)
numbers = [1, 2, 3]
# Use the append() method to add an element
result = numbers.append(4)  # append modifies the original list directly, returning None
print("List after modification:", numbers)  # Output: List after modification: [1, 2, 3, 4]
print("Return value of append:", result)  # Output: Return value of append: None

# Incorrect usage: trying to rely on the return value
new_list = numbers.append(5)  # append returns None
print("Attempt to create a new list using the return value:", new_list)  # Output: Attempt to create a new list using the return value: None
```

## Incredibly Flexible Python

Python offers great flexibility, meaning there are often multiple ways to perform the same task. For example, to delete an element from a list, you can use:

* Using the `del` statement
```python
my_list = ['a', 'b', 'c', 'd']
del my_list[1]       # Delete the element at index 1, which is 'b'
print(my_list)       # Output: ['a', 'c', 'd']
```

* Using the `pop()` method
```python
my_list = ['a', 'b', 'c', 'd']
my_list.pop(1)       # Delete the element at index 1, which is 'b'
print(my_list)       # Output: ['a', 'c', 'd']
```

* Using the `remove()` method
```python
my_list = ['a', 'b', 'c', 'd']
my_list.remove('b')  # Delete the element 'b'
print(my_list)       # Output: ['a', 'c', 'd']
```

* Using slicing
```python
my_list = ['a', 'b', 'c', 'd']
my_list[1:2] = []    # Delete the element at index 1, which is 'b'
print(my_list)       # Output: ['a', 'c', 'd']
```

We will cover other deletion techniques later (like [list comprehensions](comprehension) and [filters](high_order#filter)). When writing professional code, choosing the best method requires balancing performance, readability, and team coding standards.

## Tuples

Tuples are very similar to lists: both are ordered sequences that can store mixed data types. Syntactically, tuples are written using parentheses `( )` instead of square brackets `[ ]`.

The core difference is that **tuples are immutable**. Once a tuple is created, you cannot modify, add, or remove its elements. As a result, tuples lack methods like `append()` or `sort()`. Because they are read-only, tuples are faster to compile, consume less memory, and provide safety for values that should never change.

Python automatically groups multiple data separated by commas into a tuple:

```python
my_tuple = 3, 5, 7
print(my_tuple)    # Output: (3, 5, 7)
```

Tip: Appending a trailing comma to a value tells Python to pack it as a single-element tuple:

```python
a = 3,
print(a)       # Output: (3,)
```

Reading data from tuples works identically to lists, supporting indexing, slicing, and unpacking:

```python
my_tuple = (3, 5, 7)
a, b, c = my_tuple
print(a)       # Output: 3
print(b)       # Output: 5
print(c)       # Output: 7

first, *middle, last = (1, 2, 3, 4, 5)
print(first)   # Output: 1
print(middle)  # Output: [2, 3, 4] ** Note that this part becomes a list, not a tuple
print(last)    # Output: 5
```

Because Python automatically packs comma-separated values into a tuple, you can even omit parentheses during assignments:

```python
first, *middle, last = 1, 2, 3, 4, 5
print(first)   # Output: 1
print(middle)  # Output: [2, 3, 4] ** Note that this part becomes a list, not a tuple
print(last)    # Output: 5
```

You can unpack strings in the same manner:

```python
s = "abc"
m, n, o = s
print(f"The unpacked characters are: {m}, {n}, {o}") # After string unpacking, they become individual characters
```

Warning: While a tuple itself is immutable, if it contains mutable elements (like lists), those elements can still be modified in place:

```python
a = ([1,2],[3,4])
a[1].append(5)
print(a)       # Output: ([1, 2], [3, 4, 5])
```

Python also has a data type similar to tuples called [named tuples](iterator#named-tuples), which allows each element in a tuple to be given a name. We will introduce this in detail later.

## Exercises

1. Reverse a list: Write a program to reverse the order of data in a list.
2. Split a list by parity: Split a list of integers into two lists based on the parity of its elements, storing the odd and even numbers separately.
3. Second largest value: Find the second largest number in a list of real numbers.
4. List chunking: Input a list and an integer n, and split the list into sublists, each containing n elements. For example, given the list `[1, 2, 3, 4, 5]` and `n=2`, the output should be `[[1, 2], [3, 4], [5]]`.
5. Circular shift: Input a list and a positive integer n, and cyclically shift the elements of the list to the right by n positions.
