# Loop Statements

Loop statements are a fundamental structure in programming that allow us to repeatedly execute the same set of instructions until a certain condition is met. For example, the following scenarios are well-suited for using loops:
* **Processing large amounts of data**: You have a list containing thousands or millions of data items and need to process each one. It's impossible to write processing code manually for each item. Using a loop, you can write the processing logic once for all data.
* **Repeated execution**: For example, writing a game that lets the player try multiple times until they win or give up. You can use a loop to allow the player to make multiple attempts.
* **Searching and finding**: For example, you have a list of names and need to check if a specific name is in it. You can use a loop to iterate through the entire list until you find the name or reach the end of the list.
* **Algorithms and simulations**: For example, simulating an experiment 1000 times to calculate the probability of a certain outcome. You can use a loop to execute each simulation.

Python provides several looping mechanisms, primarily the for loop and the while loop.


## for Loop

### Iterables and Iterators

In Python, an iterator is a data object that has a common method called `__next__` (or can be called via the built-in `next()` function). Calling this method retrieves the next piece of data. Imagine that if you have a set of data and use an iterator, each time you find the next piece of data from the current one, and by continuing this process, you can traverse every piece of data in the set. For now, we only need a general understanding of the concept; we will dedicate a section later to explain the [working principle of iterators](iterator) in detail.

An iterable refers to any object that can be iterated (i.e., traversed through its member elements). An iterable can return an iterator, which is used to access each piece of data in the iterable. The lists, tuples, and strings we introduced earlier are all iterables; some data types we will introduce later, such as dictionaries, sets, file objects, etc., are also iterables.


### Iterating Over Data in an Iterable

The for loop is one of the most commonly used loop structures in Python. It is used to iterate over a sequence (list, tuple, dictionary, set, string) or other iterable objects, and execute a block of code in each iteration. Below is the basic structure of a for loop:

```python
for variable in iterable:
    # Loop body code
```

Here, `variable` is the current element obtained from `iterable` in each iteration.

For example, using a for loop to iterate over a list:
```python
fruits = ['apple', 'banana', 'orange']

for fruit in fruits:
    print(fruit)

# Output:
# apple
# banana
# orange
```

Using a for loop to iterate over a string:
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

We can typically display the data of the iterated object within the loop, process and save the data, send it to other devices, or generate a new list, etc. However, it is generally not recommended to modify, delete, or add to the object being iterated within the loop, as such operations may lead to unexpected results. Does the loop iterate over the data before or after modification? If the length of the iterated object changes, which data should come next? For example, readers can guess the output of the following program:

```python
fruits = ['apple', 'banana', 'orange']

for fruit in fruits:
    fruits[2:2] = 'watermelon'
    print(fruit)
```

Operations like the one above are very dangerous. This is because the for loop internally maintains an index pointing to the current element. When you insert data inside the loop, the list becomes longer, and the original elements are pushed forward, causing the loop to potentially revisit the same element repeatedly or never reach the end of the list, leading to an [infinite loop](#infinite-loop). Therefore, it is best not to add or delete elements of the iterated object within the loop. If modifications are needed, you can use methods like [list slicing](list#modifying-lists), or approaches like [comprehensions](comprehension) or [higher-order functions](high_order).

### The range() Function

`range()` is a built-in function in Python that returns an iterator used to generate a series of integers arranged in a specified step. This function is particularly useful in loops.

The basic syntax of the `range()` function is as follows: `range([start,] stop [, step])`. Where:
* `start` (optional): The starting value, defaults to 0.
* `stop`: The ending value (exclusive).
* `step` (optional): The step value, defaults to 1.


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

Note that the sequence generated by `range()` does not include the value specified by `stop`.

In Python 2, `range()` returns a list; whereas in Python 3, it returns an immutable sequence object (range object). Although it behaves like an iterator by generating values only when needed (thus saving memory), it is actually more feature-rich than an iterator (supporting index access and multiple traversals). Therefore, if you print the `range()` function directly, you won't see the expected sequence; you need to convert it to a list or iterate over it in a loop.

Use the `list()` function to convert the immutable sequence object returned by `range()` into a list:

```python
print(range(3))           # Output: range(0, 3)
print(list(range(3)))     # Output: [0, 1, 2]
```

### The enumerate() Function

Many programming languages, such as C, primarily use an index variable to retrieve the required data within a loop. For example:

```c
for (int i=0; i<10; i++) {
    printf(array[i]);
}
```

In the C code above, the value of the integer variable `i` increments from 0 to 9 with each iteration, and then `i` is used within the loop to index the input data `array`, thus obtaining the data needed for each iteration.

Some users might carry over this habit into Python and write code like the following:

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

However, in Python, loops are controlled using iterable data, and an index variable is not needed. Forcing the use of an index variable is inefficient, does not conform to Python coding conventions, and reduces code readability. If you only need the data from the list within the loop body, you can use `for fruit in fruits:` to directly obtain each data item; if you need to know the index of each data item within the loop body, you can use the `enumerate` function to get an iterable that includes indices:

```python
fruits = ['apple', 'banana', 'strawberry', 'orange']

for i, fruit in enumerate(fruits):
    print(f"The {i}th fruit is: {fruit}")

# Output:
# The 0th fruit is: apple
# ......
```

Although computers always start indexing from 0, our natural habit is to count from 1. If you need the output to be more in line with human reading habits, you can add an argument to `enumerate` to specify the starting index, like this:

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

Processing multiple iterables within a single loop also does not require using an index variable. The Pythonic way is to use the `zip()` function. The `zip()` function is used to pair up elements from multiple iterables, returning a new iterator that produces tuples consisting of elements at corresponding positions from each iterable. For example:

```python
a = [1, 2, 3]
b = ['a', 'b', 'c']
result = list(zip(a, b))
print(result)  # Output: [(1, 'a'), (2, 'b'), (3, 'c')]
```

Thus, we only need to iterate over the iterator returned by the `zip()` function in a loop to sequentially access all the data. Below is an example using the `zip` function, which iterates over two lists: one containing student names and the other containing their scores. `zip` pairs the elements of these two lists together, allowing us to simultaneously access each student's name and score in a single for loop.

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

If the two lists have different lengths, `zip` stops when the shortest list is exhausted (i.e., it truncates). If you want to keep all data (based on the longest list), you can use the [zip_longest() function](iterator#packing-and-unpacking) from the `itertools` module. It automatically fills in missing corresponding elements in the shorter list(s) with `None` (or a specified `fillvalue`). For example:

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

When a `break` statement is executed within a loop, it immediately terminates the current loop and jumps out of it. The program continues executing the code after the loop. The most common application scenario for `break` is: if a preset condition has been met during the loop, such as having found the target data, then there is no need to continue with the remaining loop iterations; jumping out of the loop directly can save program execution time.

The following program breaks the loop after finding the first even number:

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

When a `continue` statement is executed within a loop, the current iteration is interrupted, and the program proceeds to the next iteration.

The following program prints all odd numbers, skipping even numbers.

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

A for loop can have an `else` block, which executes when the loop completes normally (i.e., it was not interrupted by a `break` statement).

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

A loop with an `else` clause is quite unique and is relatively rare in other programming languages. Moreover, this `else` can easily cause ambiguity. Intuitively, one might think: if the condition is not met, the `else` block is entered, meaning it should be entered when the loop encounters an exception. But in reality, it is the opposite — its actual behavior is to enter the `else` clause when the loop completes normally. Additionally, when the number of iterations is 0 (i.e., the input iterable is empty), the program also enters the `else` clause. This is indeed somewhat confusing, which is why some people recommend always avoiding adding an `else` block after a loop statement; after all, it is not essential, and other languages don't have this feature.

However, once you become familiar with its usage, it does have some benefits, making certain program logic cleaner and more concise. The most common use case is searching for a target item in a list: if found, do something and then break out of the loop; if not found, the program enters the `else` block, where we can add code to handle the case where it wasn't found, such as printing some information:

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

A while loop continues to execute as long as the condition following it remains `True`.

Basic syntax:

```python
while condition_expression:
    # Loop body code block
```

When the condition expression evaluates to `True`, the code block of the loop body is executed. After each execution of the loop body, the condition expression is evaluated again. The loop only ends when the condition becomes `False`.


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

Just like with for loops, `break` and `continue` can also be used in while loops.

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

In programming, an infinite loop refers to a loop that never terminates automatically. In Python, infinite loops usually occur because the loop's termination condition is never met, or the loop body lacks code that changes the loop condition.

Here is a simple example of an infinite loop:

```python
x = 10
while x > 5:
    print(x)
    # The value of x never changes, causing this loop to run forever
```

When writing while loops, pay special attention to avoid infinite loops. Always check the loop condition and the loop body to ensure there is a clear exit condition for the loop. You can use the `break` statement to exit the loop when certain conditions are met, preventing infinite loops.

The `for` statement can also fall into an infinite loop. Python has some [infinite iterators](iterator#infinite-iterators) that can produce iterable objects of infinite length. If a for loop iterates over an infinitely long iterable object, it will fall into an infinite loop.

If a program gets stuck in an infinite loop, you can stop it manually. In most development environments and command lines, you can use `Ctrl + C` to interrupt the running program.


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
