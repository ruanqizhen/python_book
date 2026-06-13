# Lists and Tuples

:::tip
Operations on lists and tuples often require the use of [loop structures](loop) and [list comprehensions](comprehension#list-comprehensions). These two topics are not covered in this chapter; subsequent chapters will introduce their specific usage in detail. For beginners, after gaining a basic understanding of lists and tuples, you can start learning about loop structures and list comprehensions. This not only helps in mastering these programming techniques but also deepens your understanding of lists and tuples.

When using lists, you will often need functionalities like searching and sorting. The implementation methods for these features will be discussed later in algorithm-related chapters, such as "[Array](array)", where we will focus on them collectively.
:::

## Creating Lists

A list is an ordered collection of multiple elements and is one of the most fundamental data structures in Python. The simplest way to create a list is to use square brackets `[ ]`, placing the elements inside the brackets, separated by commas, for example:

```python
fruits = ["apple", "banana", "orange"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "apple", 3.5]
```

We also often use the `list()` function to create lists. It can convert other [iterable objects](loop#iterables-and-iterators) into lists, for example:

```python
# Create a list from a tuple
tup = (1, 2, 3)
list_from_tuple = list(tup)     # Result: [1, 2, 3]

# Create a list of characters from a string
string = "hello"
list_from_string = list(string) # Result: ['h', 'e', 'l', 'l', 'o']
```

Just remember the `list()` function for now. We will introduce the concepts of [iterable objects](loop#iterables-and-iterators) and [tuples](list#tuples) in more detail later.

[List comprehensions](comprehension#list-comprehensions) are also one of the most commonly used methods for creating lists, but they are slightly more complex, and we will cover them later as well.

## Accessing List Elements

### Indexing

Indexing is very similar to string indexing. Lists are ordered, and each element has a unique index, starting from 0. We can use indexes to access specific elements in a list.

```python
fruits = ["apple", "banana", "orange", "pineapple"]
print(fruits[0])  # Output: apple
print(fruits[2])  # Output: orange
```

Index values can be negative, meaning counting starts from the end of the list. For example, -1 is the index of the last element, -2 is the index of the second-to-last element, and so on.

```python
fruits = ["apple", "banana", "orange", "pineapple"]
print(fruits[-1])  # Output: pineapple
print(fruits[-2])  # Output: orange
```

### Slicing

Similar to strings, lists can also be sliced to obtain a subset of the list. Slicing uses a colon `:` to separate the start and end positions. The start position is inclusive, while the end position is exclusive. If the start position is omitted, it means starting from the leftmost end of the source list; if the end position is omitted, it means selecting up to the rightmost end of the source list.

```python
fruits = ["apple", "banana", "orange", "pineapple"]
# Get elements from index 1 to 3 (indexes 1, 2, 3)
print(fruits[1:4])  # Output: ['banana', 'orange', 'pineapple']

# Get elements from the start up to index 3
print(fruits[:3])  # Output: ['apple', 'banana', 'orange']

# Get elements from index 2 to the end
print(fruits[1:])  # Output: ['banana', 'orange', 'pineapple']
```

In slicing, you can add a step value (the third parameter) to specify the interval for selecting elements. For example:

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print(numbers[::2])  # Step of 2, selects even numbers, Output: [0, 2, 4, 6, 8]
```

This provides a very concise way to reverse the data in a list: just set the step value to -1:

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print(numbers[::-1])  # Reverse order, Output: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
```

The step value can simplify certain operations, but combining it with slicing a portion of the list can make the operation complex and difficult to understand. It is recommended to avoid such usage when possible. Here is a complex example; can the reader deduce the result without running the code?

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print(numbers[-2:2:-3])  # Output: ??
```

Explanation: Starting from index -2 (the number 8), take every 3rd number moving left, stopping at index 2 (the number 2, exclusive). So we get 8, then skip 7 and 6 to get 5, then skip 4 and 3 to reach 2 (stop).

Compared to indexing and slicing, the inhabitants of the planet Pythora typically use unpacking to read data from lists.

### Unpacking

Unpacking is a convenient way in Python to "unpack" (i.e., decompose) elements from a list into variables. This means we can assign multiple elements from a list to multiple variables in a single operation. For example:

```python
numbers = [1, 2, 3]
a, b, c = numbers
print(a) # 1
print(b) # 2
print(c) # 3
```

In the example above, the list `numbers` contains three elements. Through list unpacking, we assign these three elements to variables `a`, `b`, and `c` respectively. If you are only interested in a few elements of the list, you can also do partial unpacking: use the unary `*` operator to represent "all remaining elements":

```python
numbers = [1, 2, 3, 4, 5]
a, b, *rest = numbers
print(a)    # 1
print(b)    # 2
print(rest) # [3, 4, 5]
```

In the example above, variables `a` and `b` take the first two elements of the list, while the variable `rest` becomes a new list containing the remaining elements. When unpacking, you can also ignore certain values by using an underscore `_` as a "throwaway" variable. The underscore `_` is commonly used as a placeholder for unwanted variables or parameters:

```python
numbers = [1, 2, 3, 4, 5]
a, _, _, _, e = numbers
print(a) # 1
print(e) # 5
```

In this example, we only care about the first and last elements of the list; the middle elements are assigned to placeholders. Unpacking can also be applied to nested lists, meaning you can directly extract values from nested list structures. For example:

```python
nested_list = [[1, 2], [3, 4]]
(a, b), (c, d) = nested_list
print(a, b, c, d) # 1 2 3 4
```

Unpacking serves a similar purpose to indexing and slicing, but whenever possible, you should prefer unpacking over indexing and slicing. Compared to indexing and slicing, unpacking more clearly indicates which elements need to be extracted and directly assigns them meaningful variable names. Therefore, unpacking makes code cleaner and more readable.

## Modifying Lists

### Indexing

Lists are mutable, so we can modify, add, or remove elements. To modify a single value, simply specify it by index and assign a new value:

```python
fruits = ["apple", "banana", "orange"]
fruits[0] = "grape"
print(fruits)  # Output: ['grape', 'banana', 'orange']
```

### Slicing

Similarly, we can replace a portion of a list using slicing:

```python
fruits = ["apple", "banana", "orange"]
fruits[1:3] = ["peach", "blueberry"]
print(fruits)  # Output: ['apple', 'peach', 'blueberry']
```

It is important to note that slice assignment is essentially a "replacement": it first removes the elements selected by the slice and then inserts the new sequence of elements at that position. The number of inserted elements does not need to match the number of removed elements.

For example, `fruits[1:1]` indicates starting at index 1 and ending at index 1 (excluding index 1), which actually selects no elements — it is an empty slice (imagine a gap between index 0 and index 1). "Replacing" this gap with a new list effectively performs an insertion.

```python
fruits = ["apple", "banana", "orange"]

# Insert elements
fruits[1:1] = ["watermelon", "mango"]
print(fruits)  # Output: ['apple', 'watermelon', 'mango', 'banana', 'orange']

# Delete elements
fruits[1:3] = []
print(fruits)  # Output: ['apple', 'banana', 'orange']
```

When modifying list data, try to avoid using a step value, as it can make the program difficult to understand.

## Nested Lists

The elements of a list can be of different data types, for example: `[1, "apple", 3.5]`

Elements can also be another list, for example `[1, "apple", [5, 6, 7]]`

We often use nested lists to represent data structures like matrices and multi-dimensional arrays. To access data in nested lists, you use indexes layer by layer. For example:

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

The `+` operator can concatenate two lists:

```python
list1 = [1, 2, 3]
list2 = [4, 5, 6]
combined_list = list1 + list2
print(combined_list)  # Output: [1, 2, 3, 4, 5, 6]
```

### Repetition

The binary `*` operator can repeat the elements of a list.

```python
list1 = ["a", "b"]
repeated_list = list1 * 3
print(repeated_list)  # Output: ['a', 'b', 'a', 'b', 'a', 'b']
```

It is important to note that the multiple copies produced by the `*` operator are shallow copies. Shallow copy means that it creates a new list but does not copy the elements within the list. For nested lists or lists containing other mutable data, the elements in the newly copied list still point to the elements in the original list. For example:

```python
elem = ["a"]
row_list = elem * 3
print(row_list)     # Output: ['a', 'a', 'a']

board_list = [row_list] * 3
print(board_list)   # Output: [['a', 'a', 'a'], ['a', 'a', 'a'], ['a', 'a', 'a']]
board_list[0][0] = 0
print(board_list)   # Output: [[0, 'a', 'a'], [0, 'a', 'a'], [0, 'a', 'a']]
```

When we change the value of `board_list[0][0]`, the values in the other row lists also change. This is because these copied lists are actually the same list (pointing to the same memory address).

If you need to generate deeply copied data (where each row of data is independent), you can use a [list comprehension](comprehension) to initialize multi-dimensional lists. For example, if we need to generate an 8x8 chessboard where each cell is initialized to 0, we would write:

```python
board = [[0] * 8 for _ in range(8)]
```

The elements within each row are integers, which are immutable types, so the `*` operator can be used directly to make multiple copies; however, different rows cannot be copied this way.

### Checking for Data Presence

To check if an element is in a list, you can use the `in` keyword. This returns a boolean value indicating whether the element exists in the list. This operation is also called a membership test.

Here is a simple example:

```python
my_list = [1, 2, 3, 4, 5]

print(3 in my_list)  # Output: True
print(6 in my_list)  # Output: False
print(7 not in my_list)  # Output: True
```

The `in` keyword can also be used in [chained comparisons](calculation#chained-comparisons), for example:

```python
x = 3
my_list = [1, 2, 3, 4, 5]

print(2 < x in my_list)  # Output: True
```

However, sometimes such code can be confusing, so try to avoid it when possible, for example:

```python
print(False == False in [False])  # Output: True
```

The above program is a chained comparison operation. The logic expands as: `A op1 B op2 C` is equivalent to `(A op1 B) and (B op2 C)`, so the result is True. However, unfamiliar readers might think that regardless of whether `==` has higher precedence or `in` has higher precedence, the result should be False.

### Length

The `len()` function returns the length of a list, i.e., the number of elements it contains, for example:

```python
numbers = [1, 2, 3, 4, 5, 6]

print(len(numbers))  # Output: 6
```

`len()` can not only return the length of strings and lists but can also be used to get the length of other data types such as tuples, dictionaries, and sets.

### Maximum and Minimum

The `max()` and `min()` functions return the maximum and minimum values of the elements in a list. For example:

```python
numbers = [34, 12, 89, 5, 73, 23]

# Use max(list) to return the maximum value in the list
max_value = max(numbers)
print(f"The maximum value in the list is: {max_value}")  # Output: 89

# Use min(list) to return the minimum value in the list
min_value = min(numbers)
print(f"The minimum value in the list is: {min_value}")  # Output: 5
```

Similar to `len()`, the `max()` and `min()` functions can also be applied to data types such as strings and tuples.

### Summation

The `sum()` function calculates the sum of all elements in a list. For example:

```python
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
print(total)  # Output: 15
```

`sum()` also accepts an optional `start` parameter, whose value is added to the total. By default, the value of `start` is 0.

```python
numbers = [1, 2, 3, 4, 5]
total = sum(numbers, 10)
print(total)  # Output: 25
```

## Common List Methods

Similar to strings, lists are also objects and have their own methods. The following code lists all the attributes and methods of a list data object:

```python
print(dir([]))
```

### Modifying List Elements

In Python programs, the most common way to modify list elements is still through indexing and slicing. However, list methods also have their advantages — they have method names that clearly indicate what operation is being performed, improving program readability. Commonly used list methods for changing list elements include:
* `append()` - Adds an element to the end of the list.
* `extend()` - Adds elements from another list (or any iterable object) to the end of the current list.
* `insert()` - Inserts an element at a specified index.
* `remove()` - Removes a specified element.
* `pop()` - Removes and returns the element at a specified index. If no index is specified, it removes and returns the last element of the list.

The main difference between `remove()` and `pop()` is that `remove()` deletes by value (you don't need to know the index), while `pop()` deletes by index (typically used when you know the index position or are working with the last element).

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

Among these, `append()` is the most commonly used method. We often create an empty list in a program and then repeatedly use `append()` within a loop structure to add data to the list. After introducing [loop statements](loop), we will provide corresponding examples.

### Sorting

The `sort()` method is used to sort the elements in a list. By default, `sort()` sorts the list in ascending order, but it can also accept parameters to customize the sorting method. The `sort()` method modifies the original list, meaning it does not create a new sorted list but directly sorts the original list in place.

The `sort()` method accepts two parameters. The `reverse` parameter, if set to `True`, will sort the list in descending order. The `key` parameter specifies a function that will be called on each element, and its return value will be used as the basis for sorting. Python has a built-in general-purpose sorting function called `sorted()`, which is very similar to the list's `sort()` method. It can also be used to sort lists and also has a `key` parameter. In fact, the `max()` and `min()` functions introduced earlier also have a similar `key` parameter. We will discuss the usage of the `key` parameter together in the section on [Higher-order Function sorted](high_order#sorted), after introducing the relevant foundational knowledge later.

Here, let's just look at a few basic examples:

```python
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
numbers.sort()
print(numbers)  # Output: [1, 1, 2, 3, 4, 5, 6, 9]

numbers.sort(reverse=True)
print(numbers)  # Output: Descending order [9, 6, 5, 4, 3, 2, 1, 1]

```

### Finding Elements

The name of the `index()` method can be misleading; it does not index the list, but rather searches for an element in the list and returns its index if found.

```python
numbers = [34, 12, 89, 5, 12, 73, 23, 12]

print(numbers.index(12))   # Output: 1
```

The specified element may appear multiple times in the list, but the `index()` method only returns the index of the first occurrence.

### Element Count

The `count()` method returns the number of times a specified element appears in the list, for example:

```python
numbers = [34, 12, 89, 5, 12, 73, 23, 12]

print(numbers.count(12))  # Output: 3
```

`count()` only counts the occurrences of a single specific element. If you need to count the occurrences of each element in a list, refer to the section on [Counting](counter).

### Reversing a List

The `reverse()` method reverses the elements in a list. For example:

```python
numbers = [1, 2, 3, 4, 5]

numbers.reverse()
print(numbers)  # Output: [5, 4, 3, 2, 1]
```

The functionality of the `reverse()` method is similar to the slicing with a step value of -1 introduced earlier. The difference is that slicing creates a new list, while the `reverse()` method directly modifies the original list in place.

### Clearing a List

The `clear()` method removes all elements from a list. For example:

```python
numbers = [1, 2, 3, 4, 5]

numbers.clear()
print(numbers)  # Output: []
```

### Copying a List

In [Reference-type Variables](variable#reference-type-variables), we demonstrated the following program:

```python
a = [1, 2, 3]
b = a
b[0] = 5
print(a)  # Output: [5, 2, 3]
```

Using the assignment statement `b = a` causes `b` and `a` to point to the same list. Changing the data pointed to by one variable will also reflect the same change in the other variable, because they refer to the same data. However, sometimes we want the two variables to be able to change independently. In that case, we cannot use a direct assignment statement; instead, we can use the `copy()` method to copy the list and then assign it to a new variable:

```python
original_list = [1, 2, 3, 4, 5]
copied_list = original_list.copy()

# Modifying the original list does not affect the copied list
original_list[4] = '**'
print(original_list)          # Output: [1, 2, 3, 4, '**']
print(copied_list)            # Output: [1, 2, 3, 4, 5]
```

It is important to note that the `copy()` method only performs a shallow copy. Shallow copy means that while `copy()` creates a new list, it does not copy the elements within the list. For nested lists or lists containing other mutable data, the elements in the newly copied list still point to the elements in the original list. For example:

```python
original_list = [[1, 2], [3, 4, 5]]
copied_list = original_list.copy()

# For nested lists, modifying data in the original list still affects the copied list
original_list[1][2] = '**'
print(original_list)          # Output: [[1, 2], [3, 4, '**']]
print(copied_list)            # Output: [[1, 2], [3, 4, '**']]
```

For nested lists, if you want the two lists to be completely independent, you must perform a deep copy. This requires using the `deepcopy()` function from the `copy` module to create a deep copy, which recursively copies all the inner elements of the list:

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

When using list methods, you need to pay special attention to their usage patterns. Compared to string methods, many list methods directly modify the list object itself and do not return the modified data. This is because strings are [immutable types](variable#mutability-of-data), so their methods cannot directly modify the original string object. Instead, these methods typically return a new string representing the modified result. Therefore, when using string methods, you must use the return value to obtain the modified result; otherwise, the modification will be ineffective. Lists, on the other hand, are mutable types, and their methods can directly modify the list object without needing to return the modified result. Thus, when calling list methods, no new object is created, and subsequent code should use the already modified list variable rather than relying on the method's return value.

The following example compares the usage of string methods and list methods:

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

The observant reader will have noticed that many of the features introduced above overlap in functionality. For example, there are many ways to delete an element from a list:

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

In addition to the methods mentioned above, we will explore other techniques for deleting list elements later, such as [list comprehensions](comprehension#list-comprehensions), the [filter() function](high_order#filter), and so on. It is not just about deleting list elements; in fact, for most tasks, Python offers multiple solutions to choose from. In the subsequent chapters of this book, you will often find that we use different methods to achieve many similar functionalities. This reflects Python's flexibility. When choosing the best solution, we need to consider subtle differences between each approach, including functionality, performance, code conciseness, consistency, readability, and whether it conforms to company or organizational standards and is understandable to collaborators. This allows us to make an appropriate choice for the specific problem at hand.

## Tuples

Tuples are very similar to lists. They are both ordered collections, meaning the order of elements is fixed and does not change randomly. Their element types can differ, and many of their basic operations are the same.

In terms of appearance, the only difference between a tuple and a list is that tuples use parentheses, while lists use square brackets. This is just superficial. The essential difference is that lists are mutable — we can modify, add, or delete elements in a list; tuples, on the other hand, are immutable — once created, you cannot modify, add, or delete any elements in a tuple. Because tuples are immutable, they have fewer operations and capabilities. For example, tuples do not support methods like `append()` that are used to change elements; they only support methods for reading data. Since tuples are immutable, they are safer, more memory-efficient, and faster to access. When you need to create a list that should not change, you should use a tuple.

Python automatically groups multiple data separated by commas into a tuple:

```python
my_tuple = 3, 5, 7
print(my_tuple)    # Output: (3, 5, 7)
```

A common mistake is to add an extra comma after a value, which causes Python to automatically group it into a tuple instead of a single value:

```python
a = 3,
print(a)       # Output: (3,)
```

Reading data from tuples is exactly the same as reading elements from a list. We can use indexing, slicing, unpacking, etc., to read data from tuples, for example:

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

Because Python automatically packs several data items separated by commas into a tuple, some assignment operations that might look problematic are actually valid. For example, the following program has exactly the same functionality as the example above, just omitting the parentheses that indicate a tuple:

```python
first, *middle, last = 1, 2, 3, 4, 5
print(first)   # Output: 1
print(middle)  # Output: [2, 3, 4] ** Note that this part becomes a list, not a tuple
print(last)    # Output: 5
```

In fact, strings can also be unpacked in the same way, for example:

```python
s = "abc"
m, n, o = s
print(f"The unpacked characters are: {m}, {n}, {o}") # After string unpacking, they become individual characters
```

It is important to note that the elements of a tuple cannot be changed. However, if an element of a tuple is itself a mutable data type, that data itself may be changed, for example:

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
