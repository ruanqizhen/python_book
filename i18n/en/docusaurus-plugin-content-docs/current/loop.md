# Loop Statements

Loops are fundamental programming structures that repeatedly execute a block of code until a specific condition is met. They are ideal for:
* **Processing large datasets**: When you have thousands or millions of data items to process, writing separate statements for each is impossible. A loop lets you write the processing logic once and apply it to every item.
* **Repeated trials**: For example, in a game that lets players try again until they win or quit, you can use a loop to manage successive attempts.
* **Searching**: To locate a specific item in a collection, a loop can inspect each element until it finds a match or reaches the end.
* **Simulations and algorithms**: For example, running a probability simulation 1,000 times by wrapping the experiment logic inside a loop.

Python primarily offers two loop structures: the `for` loop and the `while` loop.

## for Loop

### Iterables and Iterators

In Python, an **iterator** is an object representing a stream of data. It implements the `__next__()` method, which is called via the built-in `next()` function to retrieve the next item in the sequence. Each call to `next()` moves the iterator forward, allowing you to traverse the entire dataset element by element. We explain the [working principle of iterators](iterator) in detail later; for now, a conceptual overview is sufficient.

An **iterable** is any object that can return its elements one at a time (allowing it to be traversed). Iterables can produce iterators to manage this traversal. Lists, tuples, and strings are all iterables, as are dictionaries, sets, and file objects.

### Iterating Over Data in an Iterable

The `for` loop is Python's primary tool for traversing sequences (such as lists, tuples, strings, dictionaries, and sets) or any other iterable object. It runs a block of code once for each element in the collection. The basic syntax is:

```python
for variable in iterable:
    # Loop body code
```

During each loop iteration, the current item from `iterable` is assigned to `variable`.

For example, using a `for` loop to iterate over a list:
```python
fruits = ['apple', 'banana', 'orange']

for fruit in fruits:
    print(fruit)

# Output:
# apple
# banana
# orange
```

Using a `for` loop to iterate over a string:
```python
word = "python"

for letter in word:
    print(letter)

# Output:
# p
# y
# t
# h
# o
# n
```

Inside a loop, you can print, process, or save data. However, **never modify, insert, or delete items in the collection while iterating over it**. Modifying an object's length during iteration shifts element indices, which can cause the loop to skip items, repeat them, or run indefinitely. Can you guess what the following code does?

```python
fruits = ['apple', 'banana', 'orange']

for fruit in fruits:
    fruits[2:2] = 'watermelon'
    print(fruit)
```

This code results in an infinite loop. Because a `for` loop internally tracks indices, inserting items dynamically shifts elements forward. The loop keeps encountering the newly inserted characters and never reaches the end. To modify lists safely, iterate over a copy of the list (e.g., using [slicing](list#modifying-lists)) or use [list comprehensions](comprehension).

### The range() Function

The built-in `range()` function returns an object that generates a sequence of integers on the fly. It is commonly used to run a loop a set number of times.

Its syntax is: `range([start,] stop [, step])`, where:
* `start` (optional): The initial value (defaults to `0`).
* `stop`: The ceiling value (the sequence stops *before* reaching this number).
* `step` (optional): The increment stride (defaults to `1`).

Usage examples:

```python
# Generate consecutive integers starting from 0
for i in range(5):
    print(i)
# Output: 0 1 2 3 4

# Specify start and end values
for i in range(2, 5):
    print(i)
# Output: 2 3 4

# Specify start, end, and step values
for i in range(0, 10, 2):
    print(i)
# Output: 0 2 4 6 8

# Use a negative step value
for i in range(5, 1, -1):
    print(i)
# Output: 5 4 3 2
```

Notice that the output sequence excludes the `stop` value.

In Python 3, `range()` returns an immutable sequence (a `range` object) rather than a list. It generates values lazily (only when requested) to save memory. Printing a `range` object directly will just display the range definition; to view the full sequence, you must convert it to a list or iterate over it:

Convert a `range` to a list using `list()`:

```python
print(range(3))           # Output: range(0, 3)
print(list(range(3)))     # Output: [0, 1, 2]
```

### The enumerate() Function

Many languages (like C) require an index variable to track loop iterations and retrieve items:

```c
for (int i=0; i<10; i++) {
    printf(array[i]);
}
```

Programmers transitioning to Python sometimes write loops in a similar, non-Pythonic way:

```python
fruits = ['apple', 'banana', 'strawberry', 'orange']

for i in range(len(fruits)):
    print(f"The {i}th fruit is: {fruits[i]}")

# Output:
# The 0th fruit is: apple
# The 1th fruit is: banana
# The 2th fruit is: strawberry
# The 3th fruit is: orange
```

In Python, loops traverse iterables directly, making manual indexing variables redundant and inefficient.
If you only need the items, use `for fruit in fruits:`. If you need both the index and the item, use the built-in `enumerate()` function. It yields a tuple containing the index and the corresponding item on each iteration:

```python
fruits = ['apple', 'banana', 'strawberry', 'orange']

for i, fruit in enumerate(fruits):
    print(f"The {i}th fruit is: {fruit}")

# Output:
# The 0th fruit is: apple
# ......
```

To match human counting habits (starting at `1` instead of `0`), you can pass an optional `start` parameter to `enumerate()`:

```python
fruits = ['apple', 'banana', 'strawberry', 'orange']

for i, fruit in enumerate(fruits, 1):
    print(f"Element {i} is {fruit}")

# Output:
# Element 1 is apple
# Element 2 is banana
# Element 3 is strawberry
# Element 4 is orange
```

### The zip() Function

To iterate over multiple lists in parallel, use the `zip()` function. `zip()` aggregates elements from multiple iterables into tuples based on their position, returning a zipped iterator:

```python
a = [1, 2, 3]
b = ['a', 'b', 'c']
result = list(zip(a, b))
print(result)  # Output: [(1, 'a'), (2, 'b'), (3, 'c')]
```

This lets you traverse parallel datasets simultaneously. For example, you can zip a list of names with a list of scores:

```python
students = ['Zhang San', 'Li Si', 'Wang Wu', 'Zhao Liu', 'Xiao Ming']
scores = [90, 85, 88, 92, 95]

for student, score in zip(students, scores):
    print(f'{student}\'s score is: {score}')
    
# The output of this code will be:
# Zhang San's score is: 90
# Li Si's score is: 85
# Wang Wu's score is: 88
# Zhao Liu's score is: 92
# Xiao Ming's score is: 95
```

Note: `zip()` stops as soon as the shortest input list is exhausted (truncating the output). To iterate until the longest list is exhausted, use `zip_longest` from the `itertools` module, which fills missing entries with `None` or a custom `fillvalue`:

```python
from itertools import zip_longest

list1 = [1, 2, 3, 4]
list2 = ['a', 'b', 'c']

# Use zip_longest to combine, filling missing parts of the shorter list with None
combined = list(zip_longest(list1, list2))
print(combined)  # Output: [(1, 'a'), (2, 'b'), (3, 'c'), (4, None)]

# Use a default value to fill missing elements:
combined = list(zip_longest(list1, list2, fillvalue="missing"))
print(combined)  # Output: [(1, 'a'), (2, 'b'), (3, 'c'), (4, 'missing')]
```

### The break Statement

The `break` statement immediately terminates the loop. The program continues executing the statements following the loop block. This is useful for stopping a search once you locate the target element, saving execution time:

```python
numbers = [1, 3, 7, 9, 2, 5, 6]

for num in numbers:
    if num % 2 == 0:
        print(f"Found an even number: {num}")
        break

# Output:
# Found an even number: 2
```
    
### The continue Statement

The `continue` statement skips the rest of the current loop iteration and jumps straight to the next cycle:

```python
numbers = [1, 2, 3, 4, 5]

for num in numbers:
    if num % 2 == 0:
        continue
    print(num)
    
# Output:
# 1
# 3
# 5
```

### The for Loop with an else Clause

A `for` loop can end with an optional `else` block. This block executes *only* if the loop runs to completion without hitting a `break` statement.

```python
for i in range(3):
    print(i)
else:
    print("Loop completed normally")

# Output:
# 0
# 1
# 2
# Loop completed normally
```

This syntax is unique to Python and can be confusing. It is best to think of this `else` as "then": if the loop completes *then* run the else block. If the loop was empty (zero iterations), the `else` block still runs because it was not interrupted by a `break`. Because this behavior is counter-intuitive for beginners, some developers suggest avoiding it, but it is useful for specific search patterns.

For example, when searching for an element, you can handle the "not found" case cleanly inside the `else` block:

```python
def search_in_list(lst, target):
    for index, value in enumerate(lst):
        if value == target:
            print(f'Found target value {target} at index {index}')
            break
    else:  # Execute this branch if the loop was not terminated by break
        print('Not found')

# Test:
my_list = [1, 2, 3, 4, 5]
search_in_list(my_list, 3)  # Should find target value 3
search_in_list(my_list, 6)  # Output: "Not found"
```

## while Loop

### Basic Usage

A `while` loop repeatedly executes a block of code as long as its condition remains `True`:

```python
while condition_expression:
    # Loop body code block
```

Python evaluates the condition before each loop. If the condition is `True`, the body executes. If it becomes `False`, the loop exits.

Example:
```python
count = 0
while count < 5:
    print(count)
    count += 1

# Output:
# 0
# 1
# 2
# 3
# 4
```

### break and continue

Just like with `for` loops, `break` and `continue` can also be used in `while` loops.

For example, using `break` to exit the loop early:

```python
count = 0
while count < 5:
    if count == 3:
        break
    print(count)
    count += 1
    
# Output:
# 0
# 1
# 2
```

Using `continue` to skip the current iteration:

```python
count = 0
while count < 5:
    count += 1
    if count == 3:
        continue
    print(count)

# Output:
# 1
# 2
# 4
# 5
```

### Infinite Loop

An infinite loop runs forever because its termination condition is never met, or the loop body lacks logic to update the condition variable:

```python
x = 10
while x > 5:
    print(x)
    # The value of x never changes, causing this loop to run forever
```

Always verify that your `while` loop has a clear exit condition. You can also include a safety `break` statement inside the loop to prevent infinite runs.

`for` loops can also run infinitely if they iterate over a stream of infinite length, such as those generated by the `itertools` library.

To terminate a running infinite loop manually, press `Ctrl + C` in your terminal or click the stop button in your IDE.

## Exercises

1. **Multiplication Table**

Use loop statements to print the 9x9 multiplication table.

2. **Narcissistic Numbers**

A narcissistic number (also known as an Armstrong number) is an n-digit positive integer whose sum of the n-th powers of its digits equals the number itself. For example, a three-digit narcissistic number is a three-digit number where the sum of the cubes of its digits equals the number itself.

Examples:
- 153 is a three-digit number, and its digits are 1, 5, 3, satisfying $1^3 + 5^3 + 3^3 = 153$, so 153 is a narcissistic number.
- 370 is also a three-digit narcissistic number, because $3^3 + 7^3 + 0^3 = 370$.

Write a program to find all narcissistic numbers between 100 and 999.

3. **Monkey Stealing Peaches**

A monkey finds a peach tree. On the first day, it eats half of the peaches on the tree but is still not satisfied, so it eats one more. The next morning, it eats half of the remaining peaches and then one more. Every subsequent morning, it eats half of the remaining peaches plus one more. On the morning of the n-th day, it finds only 1 peach left on the tree. How many peaches were originally on the tree?

4. **Printing Factors**

If two positive integers are multiplied together, then both numbers are called factors (or divisors) of the product. Write a program to find all factors of the number 1200.

5. **Prime Factorization**

Write a program to decompose an integer into the product of several prime numbers. For example, the prime factors of the number 12 include: 2, 2, 3.

6. **Weighted Average**: Given a list of values `values = [4, 5, 6]` and a list of weights `weights = [0.2, 0.3, 0.5]`, calculate the weighted average.
