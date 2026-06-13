# Comprehensions

## List Comprehensions

List comprehensions provide a concise and readable way to create lists in Python. They generate a new list based on an existing iterable (such as a list, tuple, set, etc.) by applying an expression to each element. In many other programming languages, constructing a transformed list requires verbose loops or recursion, but Python's list comprehensions streamline this process into a single, clean expression.

The basic syntax of a list comprehension is: 

```python
[expression for item in iterable if condition]
```

where:
* `expression`: The operation or transformation applied to the current element.
* `item`: The variable representing the current element in the iteration.
* `iterable`: The collection or sequence being iterated over.
* `condition`: An optional filtering condition (only items for which the condition evaluates to `True` are included).

Below are some practical examples demonstrating the power of list comprehensions:

### Basic Usage

To generate a new list containing the squares of numbers from 0 to 9, an imperative approach would use a `for` loop. A list comprehension accomplishes this in one line:

```python
squares = [x**2 for x in range(10)]
print(squares)  # Output: [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

In this code:
* `range(10)` generates a sequence of integers from 0 to 9.
* `x**2 for x in range(10)` calculates the square of each number `x`.
* The enclosing square brackets `[]` pack the resulting values into a new list.

### Filtering with a Condition

You can add an `if` clause to filter which elements from the iterable are processed. For example, to only include the squares of even numbers:

```python
even_squares = [x**2 for x in range(10) if x % 2 == 0]
print(even_squares)  # Output: [0, 4, 16, 36, 64]
```

### Multidimensional Lists

You can nest list comprehensions. For example, to generate a 2D multiplication table (a list of lists):

```python
multiplication_table = [[i * j for j in range(1, 10)] for i in range(1, 10)]
for row in multiplication_table:
    print(row)
```

By combining nested comprehensions with [string formatting](string#string-formatting) methods, you can print a formatted multiplication grid:

```python
print('\n'.join([' '.join([f'{j}*{i}={i*j:<2}' for j in range(1, i + 1)]) for i in range(1, 10)]))
```

The output of the program is:

```
1*1=1 
1*2=2  2*2=4 
1*3=3  2*3=6  3*3=9 
1*4=4  2*4=8  3*4=12 4*4=16
1*5=5  2*5=10 3*5=15 4*5=20 5*5=25
1*6=6  2*6=12 3*6=18 4*6=24 5*6=30 6*6=36
1*7=7  2*7=14 3*7=21 4*7=28 5*7=35 6*7=42 7*7=49
1*8=8  2*8=16 3*8=24 4*8=32 5*8=40 6*8=48 7*8=56 8*8=64
1*9=9  2*9=18 3*9=27 4*9=36 5*9=45 6*9=54 7*9=63 8*9=72 9*9=81
```

You can also use nested comprehensions to transpose a 2D matrix:

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

transpose = [[row[i] for row in matrix] for i in range(len(matrix[0]))]
print(transpose)
# Output: [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
```

### Multiple Loops

You can write a list comprehension with multiple `for` clauses. While this executes nested loops, it flattens the output into a single-dimensional list rather than a nested structure.

For example, to compute the Cartesian product of two lists:

```python
a = ['a', 'b', 'c']
b = [1, 2, 3]
combinations = [(x, y) for x in a for y in b]
print(combinations)
# Output: [('a', 1), ('a', 2), ('a', 3), ('b', 1), ('b', 2), ('b', 3), ('c', 1), ('c', 2), ('c', 3)]
```

You can also use multiple loops to flatten a nested list:

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

flattened = [item for sublist in matrix for item in sublist]
print(flattened)  # Output: [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Equivalent logic using nested loops:
flattened = []
for sublist in matrix:
    for item in sublist:
        flattened.append(item)
```

Conversely, you can combine a list comprehension with slicing to group a flat list into a 2D list:

```python
lst = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
rows = 2
cols = 5

two_dim_list = [lst[i * cols:(i + 1) * cols] for i in range(rows)]
print(two_dim_list)  # Output: [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]]
```

As demonstrated above, list comprehensions are highly concise. However, keep in mind that list comprehensions construct and return a complete list in memory immediately. If you are generating a massive dataset, a list comprehension can consume significant RAM. In those scenarios, using a [generator expression](generator#generator-expressions) (which wraps the logic in parentheses instead of square brackets) is more memory-efficient.

### Complex List Comprehensions

While conciseness is the primary benefit of list comprehensions, overly complex expressions hurt readability. Code that is too dense is difficult to decipher. If a list comprehension requires multiple nested loops or complex logic, you should rewrite it using standard `for` loops. 

The following examples demonstrate complex list comprehensions. While writing expressions this dense is discouraged in production code on Pythora, studying them is a great way to master Python's syntax:

#### 1. Generating Primes Under 100

```python
print([i for i in range(2, 100) if all(i % j != 0 for j in range(2, int(i ** 0.5) + 1))])
```

This code relies on the built-in `all()` function, which checks if all elements in an iterable evaluate to `True` (returning `True` if they do or if the iterable is empty):

```python
conditions = [True, True, False]
print(all(conditions))  # Output: False

numbers = [1, 2, 3, 4]
print(all(n > 0 for n in numbers))  # Output: True
```

Python also provides a similar built-in `any()` function, which returns `True` if at least one element in an iterable evaluates to `True`.

#### 2. Generating the First 30 Fibonacci Numbers

```python
print([x[0] for x in [(y[i][0], y.append((y[i][1], y[i][0] + y[i][1]))) for y in [[[1,1]]] for i in range(30)]])
```

#### 3. Generating the Power Set of a Set

The power set $P(S)$ of a set $S$ is the set containing all possible subsets of $S$, including the empty set and $S$ itself. For example, the power set of $\{1, 2\}$ is $\{\{\}, \{1\}, \{2\}, \{1, 2\}\}$. A set of size $n$ has a power set of size $2^n$.

In Python, set elements must be hashable (immutable), so you cannot nest mutable `set` objects inside another set. Instead, we represent the power set as a list of sets: `[set(), {1}, {2}, {1, 2}]`.

One approach is to start with a list containing only the empty set, iterate through the elements of the original set, and for each element, join it to all existing subsets to create new ones:

```python
s = {1, 2, 3}
print(([c.extend([b | {a} for b in c]) or c for c in [[set()]] for a in s] or [[set()]])[0])
# Output: [set(), {1}, {2}, {1, 2}, {3}, {1, 3}, {2, 3}, {1, 2, 3}]
```

While the one-liner is difficult to read, we can clean up the formatting slightly:

```python
s = {1, 2, 3}
result = [set()]
[result.extend([j | {i} for j in result]) for i in s]
print(result)
```

Alternatively, we can generate a power set using a binary mask. A set of size $n$ has $2^n$ subsets. We can map each subset to an integer from $0$ to $2^n - 1$ represented as an $n$-bit binary string. If the $j$-th bit of the binary string is `1`, the $j$-th element is included in the subset:

For $s = \{a, b, c\}$ ($n=3$), we use masks from 0 to 7:

| Decimal (i) | 3-bit Binary | Subset |
| :--- | :--- | :--- |
| 0 | `000` | `{}` |
| 1 | `001` | `{c}` |
| 2 | `010` | `{b}` |
| 3 | `011` | `{b, c}` |
| 4 | `100` | `{a}` |
| 5 | `101` | `{a, c}` |
| 6 | `110` | `{a, b}` |
| 7 | `111` | `{a, b, c}` |

The implementation is:

```python
s = {1, 2, 3}
print([set(list(s)[j] for j in range(len(s)) if (i >> j) & 1) for i in range(2 ** len(s))])
```

## Dictionary Comprehensions

### Basic Usage

Similar to list comprehensions, you can construct dictionaries using **dictionary comprehensions**:

```python
{key_expr: value_expr for item in iterable}
```

Because dictionaries store key-value pairs, a dictionary comprehension must define expressions for both the key and the value separated by a colon.

For example, to map numbers to their squares:

```python
numbers = [1, 2, 3, 4, 5]
squared = {x: x**2 for x in numbers}
print(squared)  # Output: {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
```

You can also use a dictionary comprehension to transform an existing dictionary:

```python
fruits = {'apple': 0.5, 'banana': 0.25, 'orange': 0.75}
discounted_price = {fruit: price * 0.9 for fruit, price in fruits.items()}
print(discounted_price)  # Output: {'apple': 0.45, 'banana': 0.225, 'orange': 0.675}
```

### Filtering with a Condition

Just like list comprehensions, you can add an `if` statement to filter entries:

```python
numbers = [1, 2, 3, 4, 5]
even_squares = {x: x**2 for x in numbers if x % 2 == 0}
print(even_squares)  # Output: {2: 4, 4: 16}
```

### Combining Iterables

By combining a dictionary comprehension with the `zip()` function, you can merge two separate lists (keys and values) into a single dictionary:

```python
keys = ['a', 'b', 'c']
values = [1, 2, 3]
dictionary = {k: v for k, v in zip(keys, values)}
print(dictionary)  # Output: {'a': 1, 'b': 2, 'c': 3}
```

### Multiple Loops

You can use nested loops inside a dictionary comprehension. For example, to generate coordinate-based keys representing a multiplication grid:

```python
product_dict = {(i, j): i*j for i in range(1, 5) for j in range(1, 5)}
print(product_dict)
```

## Assignment Expressions (The Walrus Operator)

### Basic Usage

An **assignment expression** uses the `:=` operator to assign a value to a variable as part of a larger expression. It is colloquially known as the **walrus operator** because the symbol resembles a walrus's eyes and tusks. 

In Python, a standard assignment statement (using `=`) is a [statement](hello_world#statement) rather than an [expression](hello_world#expression). This means you cannot use it inside conditional checks (like `if` or `while` statements) or nested within other expressions. The walrus operator (`:=`) is an expression, allowing you to assign a variable anywhere an expression is expected.

The walrus operator is highly useful for avoiding redundant computations and keeping code concise. For example, when reading inputs in a loop:

```python
# Without the walrus operator (input() is called in two separate places):
line = input("Please enter text: ")
while line != "end":
    print(f'You entered: {line}')
    line = input("Please enter text: ")
    
# With the walrus operator (assignment happens directly inside the loop check):
while (line := input("Please enter text: ")) != "end":
    print(f'You entered: {line}')
```

The walrus operator is also valuable inside list comprehensions when you need to evaluate an expensive function and use its result both for filtering and for the output list:

```python
# Without the walrus operator, complicated_function is evaluated twice per item:
results = [complicated_function(x) for x in data if complicated_function(x) > 0]

# With the walrus operator, complicated_function is evaluated only once:
results = [y for x in data if (y := complicated_function(x)) > 0]
```

Here is a concrete example that squares each number but only keeps results greater than 5:

```python
numbers = [1, 2, 3, 4, 5]
squares = [square for x in numbers if (square := x*x) > 5]
print(squares)  # Output: [9, 16, 25]
```

### Operator Precedence Notes

The walrus operator can harm code readability if used carelessly because it is often combined with other operators. To avoid issues, always be mindful of operator precedence. The comparison operator `==` has higher precedence than `:=`.

Consider this code:

```python
# What is the value of x?
if x := 5 == 5:
    print(x)
```

This prints `True` rather than `5` because `5 == 5` is evaluated first, and its result (`True`) is assigned to `x`. To assign `5` to `x` first and then check if it equals `5`, use parentheses: `if (x := 5) == 5:`.

Additionally, the walrus operator does not support automatic unpacking:

```python
x, y = 1, 2
(x, y := 3, 4)
print(y)  # Output: 3
```

This prints `3` because `,` has lower precedence than `:=`. The expression evaluates to `(1, 3, 4)`. Write this as `(x, y := (3, 4))` if you intend to assign the tuple to `y`. Note that writing `((x, y) := (3, 4))` raises a syntax error because the walrus operator does not support unpacking targets.

## Exercises

Use comprehensions to write the following programs:

1. **Extract words**: Given a list of strings (e.g., `["apple", "banana", "cherry", "avocado"]`), write a list comprehension to select only the words that start with the letter `'a'`.
2. **Batch function invocation**: Given a list of anonymous functions (e.g., `[lambda x: x+1, lambda x: x**2, lambda x: x*2]`), write a comprehension to evaluate each function with an input value of `5`, returning `[6, 25, 10]`.
3. **Custom filter**: Write a function `filter_func(func, lst)` using a list comprehension that mimics the built-in `filter` function. It should accept a testing function `func` and a list `lst`, returning only the elements that satisfy `func`. E.g., `filter_func(lambda x: x > 2, [1, 2, 3, 4])` returns `[3, 4]`.
