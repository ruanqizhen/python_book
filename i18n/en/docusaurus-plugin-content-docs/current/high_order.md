# Higher-Order Functions

A Higher-Order Function (HOF) is a core concept in functional programming. A function is considered a higher-order function if it meets at least one of the following criteria: it accepts one or more functions as arguments, or it returns a function as its result. When a higher-order function takes other functions as inputs, its behavior can be dynamically configured at runtime based on the functions passed to it.

Python provides several built-in higher-order functions, including `map()`, `filter()`, and `reduce()`, which are widely used in functional programming. Although `map()` and `filter()` are standard functional programming tools, in Python, list (or dictionary) comprehensions and generator expressions can essentially replace them. Indeed, the inhabitants of the planet Pythora generally prefer comprehensions and generator expressions. However, to maintain readability, comprehensions and generator expressions are best suited for simple logic, whereas higher-order functions are more appropriate for implementing complex behavior.

## map

### Basic Usage

When we introduced [generator expressions](generator#generator-expressions), we used a simple example: suppose we have an input iterator containing a set of data, and we want to generate a new iterator that yields the squares of those numbers. Using a generator expression, the program can be written as follows:

```python
numbers = range(10)
squared = (x*x for x in numbers)

for num in squared:
    print(num)
```

Functional programming provides another solution to this problem: the `map()` function. `map()` accepts a function and an iterable as arguments, and returns a new iterator. Each element yielded by the returned iterator is the result of applying the given function to the corresponding element of the input iterable. Rewriting the code using `map()` gives:

```python
numbers = range(10)
squares = map(lambda x: x*x, numbers)

for num in squares:
    print(num)
```

In the example above, the arguments passed to `map()` are the iterable to be processed (`numbers`) and the anonymous function `lambda x: x*x`, which specifies that each element in the iterable should be squared.

### Using Multiple Iterables

When multiple iterables are passed to the `map()` function, it processes them in parallel. It takes the first element from each iterable and applies the function, then takes the second element from each iterable and applies the function, and so on. For example:

```python
a = [1, 2, 3]
b = [10, 20, 30]
summed = map(lambda x, y: x + y, a, b)
print(list(summed))  # [11, 22, 33]
```

In this example, the lambda function takes two parameters and adds them together. If the iterables passed to `map()` are of different lengths, `map()` stops as soon as the shortest iterable is exhausted.

When using list comprehensions to process multiple iterables, you must use the [zip()](loop#the-zip-function) function to pair the elements before processing them. In contrast, `map()` can handle multiple iterables directly.

### Implementing map()

Let's explore how we might implement a function similar to `map()` ourselves. Consider the following:

* `map()` can accept multiple iterables, meaning our function must support variable-length arguments.
* `map()` returns an iterator, so we can implement it using a generator function.
* The core functionality of `map()` is simple: it applies the target function to the input elements in order.

Here is the implementation:

```python
# Custom my_map function, designed to simulate the functionality of the built-in map function.
# It accepts a function and one or more iterables as arguments.
def my_map(func, *iterables):
    # Convert all passed iterables to iterators.
    # This allows us to extract values from them using the next function.
    iterators = [iter(it) for it in iterables]
    
    # Infinite loop until one of the iterators is exhausted.
    while True:
        # Use a temporary list to store elements retrieved from each iterator.
        result = []
        # Traverse all iterators.
        for it in iterators:
            try:
                # Retrieve the next element from the current iterator, and add it to the result list.
                item = next(it)
                result.append(item)
            except StopIteration:
                # If an iterator has no more elements, exit the loop and finish generation.
                return
        
        # Apply the passed function to the elements retrieved from the iterators,
        # and return the result using yield.
        yield func(*tuple(result))
        
# Test the custom my_map function.
lst1 = [1, 2, 3]
lst2 = [4, 5, 6]
result = my_map(lambda x, y: x + y, lst1, lst2)
print(list(result))  # Output: [5, 7, 9]

result = my_map(lambda x: x*x, lst1)
print(list(result))  # Output: [1, 4, 9]
```

The main complexity in the program above is handling multiple iterables of variable lengths. However, if we use the `zip()` function, we can simplify this logic significantly into a generator expression:

```python
def my_map(func, *iterables):
    return (func(*items) for items in zip(*iterables))

# Test
lst1 = [1, 2, 3]
lst2 = [4, 5, 6]
result = my_map(lambda x, y: x + y, lst1, lst2)
print(list(result))  # Output: [5, 7, 9]
```

## filter

### Basic Usage

`filter()` is used to select elements from an iterable that satisfy a specific condition. Its basic usage is as follows:

```python
filter(function, iterable)
```

It accepts a function and an iterable, returning a new iterator that yields only those elements for which the input function returns `True`.

An example we used when introducing generator expressions also demonstrates the utility of the `filter()` function: suppose we want to select words longer than 5 characters from a list. With a generator expression, we would write:

```python
result = (word for word in words if len(word) > 5)
```

This can also be implemented using the `filter()` function:

```python
words = ["apple", "banana", "cherry", "date", "fig", "kiwi"]
long_words = filter(lambda x: len(x) > 5, words)
print(list(long_words))  # Output: ['banana', 'cherry']
```

Since `filter()` only accepts a single iterable, its implementation is much simpler than `map()`. We can implement it using a generator expression:

```python
def my_filter(func, iterable):
    return (item for item in iterable if func(item))

# Test
lst = [1, 2, 3, 4, 5, 6, 7, 8, 9]
evens = my_filter(lambda x: x % 2 == 0, lst)
print(list(evens))  # Output: [2, 4, 6, 8]
```

### Generating Prime Numbers

Generating prime numbers is a classic application of the `filter()` function. We will use the Sieve of Eratosthenes to generate a sequence of prime numbers, based on the following process:

1. List all integers starting from 2.
2. Find the first number in the list — this is a prime. Initially, this is 2.
3. Remove all multiples of that prime from the list.
4. Return to step 2 to find the next prime.

Here is the implementation:

```python
from itertools import count

def prime_generator():
    # Generator that produces a sequence of prime numbers
    numbers = count(2)         # Generate an integer sequence starting from 2
    while True:
        prime = next(numbers)  # The next unfiltered number in the sequence is a new prime
        yield prime            # Return the current prime
        # Filter out all numbers in the sequence that are divisible by the current prime
        numbers = filter(lambda x, prime=prime: x % prime, numbers)

# Test
gen = prime_generator()
for _ in range(10):  # 获取前 10 个素数
    print(next(gen))
```

In the program above, the `count()` function from the `itertools` library generates an infinite sequence of integers. When we introduced generators, we implemented a similar generator:

```python
def count(n):
    # Generate an integer sequence starting from n
    while True:
        yield n
        n += 1
```

More complex logic like this cannot be easily implemented with generator expressions alone; using higher-order functions is a cleaner choice. That said, a prime number generator does not strictly require `filter()`. Without `filter()`, we would need to maintain a dictionary of composite numbers and their prime factors, which is slightly more complex. Below is an alternative implementation:

```python
def prime_generator():
    # Generator that produces a sequence of prime numbers
    factors = {}  # Dictionary to record factors of composite numbers
    q = 2         # Start from 2

    while True:
        if q not in factors:
            # q is not in the composite dictionary, so it is a new prime
            yield q
            # The square of q is the smallest composite number with q as its only prime factor
            factors[q*q] = [q]
        else:
            # q is not a prime; find the next composite numbers sharing the same factors
            for p in factors[q]:
                # p is a factor of q; the next composite containing factor p must be p+q  
                factors.setdefault(p + q, []).append(p)
            # q has been processed; delete it to save memory
            del factors[q]
        q += 1

# 测试：
gen = prime_generator()
for _ in range(10):
    print(next(gen))
```

If computational efficiency is not a priority, we can skip maintaining a factor dictionary and instead check each number for primality directly. This allows us to use a much simpler generator expression:

```python
from itertools import count

gen = (i for i in count(2) if all(i % j != 0 for j in range(2, int(i**.5) + 1)))

for _ in range(10):  # Get the first 10 primes
    print(next(gen))
```

### Filtering Falsy Values

The `filter()` function has a special behavior: if the function parameter is `None`, `filter()` defaults to checking the truthiness of the elements. In other words, `filter(None, iterable)` is equivalent to `filter(lambda x: bool(x), iterable)`.

In Python, the following values are considered "falsy" (or empty): `None`, `False`, numeric zeros (`0`, `0.0`, `0j`, etc.), empty sequences (`''`, `[]`, `()`, etc.), and empty collections (like `set()` and `dict()`).

You can use this feature to quickly filter out falsy values from a list:

```python
data = [None, 0, "Python", "", [], False, 42]
clean_data = list(filter(None, data))
print(clean_data)
# Output: ['Python', 42]
```

It can also be useful for filtering blank lines when processing file content:

```python
lines = ["line1\n", "\n", "line2\n", "", "line3"]
non_empty_lines = list(filter(None, lines))
print(non_empty_lines)
# Output: ['line1\n', '\n', 'line2\n', 'line3']
```

Although `"\n"` represents an empty line visually, as a non-empty string it is considered truthy. If you need a stricter filter to remove all blank lines (including whitespace-only lines), you can adjust the filter condition like this:

```python
lines = ["line1\n", "\n", "line2\n", "", "line3"]
non_empty_lines = list(filter(lambda x: x.strip(), lines))
print(non_empty_lines)
# Output: ['line1\n', 'line2\n', 'line3']
```

## Fold

In functional programming, a **Fold** (also called `reduce` or `accumulate`) is an operation that processes a data structure (typically a list) to reduce it to a single value.

Depending on the direction of processing and how operations are grouped (parenthesized), folds are split into **Left Fold** (`foldl` / left reduce) and **Right Fold** (`foldr` / right reduce). While associative operations like addition (`+`) yield the same result regardless of grouping, non-associative operations like subtraction (`-`), division (`/`), or string concatenation behave differently.

### Core Difference: Parenthesization

Suppose we have a list `[1, 2, 3]` and a binary function `f(x, y)` (represented by the operator $\oplus$).

#### Left Fold

- **Direction**: Left to right.
- **Logic**: Combine the first two elements, then combine that result with the third element, and so on.
- **Mathematical expression**: $$((1 \oplus 2) \oplus 3)$$
- **Functional form**: $$f(f(1, 2), 3)$$
- **Analogy**: The accumulator is like a snowball rolling from left to right, gathering elements along the way.

#### Right Fold

- **Direction**: Right to left (logical grouping).
- **Logic**: Combine the last two elements, then combine the second-to-last element with that result, and so on.
- **Mathematical expression**: $$(1 \oplus (2 \oplus 3))$$
- **Functional form**: $$f(1, f(2, 3))$$
- **Analogy**: Using recursion, we traverse to the rightmost end of the list to compute the initial result, then backtrack layer by layer to the left.

### Demonstration: Subtraction

Subtraction is non-associative (i.e., $(a - b) - c \neq a - (b - c)$), which clearly highlights the distinction.

Let's fold the list `[1, 2, 3]`. For simplicity, we won't use an external initial value, relying instead on the elements themselves.

#### Left Fold

Evaluation order: `((1 - 2) - 3)`

- **Step 1**: $1 - 2 = -1$
- **Step 2**: $-1 - 3 = -4$
- **Result**: $-4$

#### Right Fold

Evaluation order: `(1 - (2 - 3))`

- **Step 1 (innermost)**: $2 - 3 = -1$
- **Step 2 (backtrack)**: $1 - (-1) = 2$
- **Result**: $2$

### Implementation and Python's Limitations

In Python, the standard library function `functools.reduce()` implements a left fold. Python does not provide a built-in right fold function, largely because Python does not optimize for deep recursion.

#### Left Fold Implementation

A left fold is easily implemented using a loop, which is efficient and avoids recursion depth limits:

```python
def fold_left(func, sequence, initial=None):
    it = iter(sequence)
    if initial is None:
        value = next(it)
    else:
        value = initial
    
    for element in it:
        # Core: accumulator on the left, new element on the right
        value = func(value, element) 
    return value

# Test
print(fold_left(lambda x, y: x - y, [1, 2, 3])) 
# Output: -4  -> ((1-2)-3)

```

#### Right Fold Implementation

A right fold is naturally recursive. It must resolve the tail of the list first before combining the result with the head element:

```python
def fold_right(func, sequence, initial=None):
    if not sequence:
        if initial is None:
            raise ValueError("Empty sequence with no initial value")
        return initial
        
    if len(sequence) == 1 and initial is None:
        return sequence[0]
        
    # If no initial value is set, take the first element and process the rest
    head = sequence[0]
    tail = sequence[1:]
    
    if initial is None:
        # Recursive call: calculate the reduction result of the tail first
        return func(head, fold_right(func, tail))
    else:
        return func(head, fold_right(func, tail, initial))

# Test
print(fold_right(lambda x, y: x - y, [1, 2, 3]))
# Output: 2   -> (1-(2-3))

```

## reduce

### Basic Usage

The `reduce()` function applies a binary function to the elements of an iterable in a cumulative way, reducing the sequence to a single value. It is defined as:

```python
functools.reduce(function, iterable[, initializer])
```

It takes three parameters:

* `function`: A function that accepts two arguments. The first is the accumulated value (or initializer), and the second is the next element from the iterable.
* `iterable`: The sequence to be reduced.
* `initializer`: (Optional) A starting value placed before the sequence elements. If provided, the reduction starts by combining the initializer with the first element of the iterable; otherwise, it starts with the first two elements of the iterable.

The `reduce()` function applies the target function to the first two elements, then applies it to that result and the third element, and so on, until the sequence is exhausted. Mathematically, with an initializer:

`result = function(function(function(initializer, iterable[0]), iterable[1]), iterable[2])`

For example, we can calculate the sum of all integers in a list using `reduce()`:

```python
from functools import reduce

numbers = [1, 2, 3, 4, 5]
sum_result = reduce(lambda x, y: x + y, numbers)
print(sum_result)  # Output: 15
```

Finding the maximum value is very similar to summation:

```python
from functools import reduce

numbers = [5, 8, 2, 1, 9, 3]
max_value = reduce(lambda x, y: x if x > y else y, numbers)
print(max_value)  # Output: 9
```

We can also reverse a string using `reduce()`:

```python
from functools import reduce

s = "Hello"
reversed_string = reduce(lambda x, y: y + x, s)
print(reversed_string)  # Output: "olleH"
```

Or merge a list of dictionaries:

```python
from functools import reduce

list_of_dicts = [{"a": 1, "b": 2}, {"c": 3}, {"d": 4}]
combined_dict = reduce(lambda x, y: {**x, **y}, list_of_dicts)
print(combined_dict)  # Output: {'a': 1, 'b': 2, 'c': 3, 'd': 4}

# Note: This approach creates a new dictionary every time, resulting in lower performance with large datasets.
```

### Implementation

Because `reduce()` returns a single value rather than an iterator, we do not need generator syntax to implement it. Since we already showed a loop-based left fold, here is a recursive implementation of `reduce()`:

```python
def my_reduce(func, sequence, initial=None):
    # If the initial value is set, consider it first
    if not sequence:
        if initial is None:
            raise TypeError("my_reduce() of empty sequence with no initial value")
        return initial
    
    # If there is no initial, use the first element as the starting value
    if initial is None:
        return my_reduce(func, sequence[1:], sequence[0])
    
    # Left fold: compute func(acc, x) first, then recurse
    return my_reduce(func, sequence[1:], func(initial, sequence[0]))

# Test
numbers = [1, 2, 3, 4, 5]
total = my_reduce(lambda x, y: x + y, numbers)
print(total)  # Output: 15

product = my_reduce(lambda x, y: x * y, numbers)
print(product)  # Output: 120
```

#### Implementing a Right Fold using `reduce()`

Since `reduce()` performs a left fold, if you need to perform a right fold, you don't necessarily have to write a recursive function. Instead, you can reverse the sequence and reverse the argument order inside the combining function (especially if the operation is non-commutative). Here is how you can perform a right fold for subtraction using `reduce()`:

```python
from functools import reduce

data = [1, 2, 3]
res = reduce(lambda acc, x: x - acc, reversed([1, 2, 3]))
# Steps:
# 1. Start: [3, 2, 1], take 3
# 2. Encounter 2: 2 - 3 = -1
# 3. Encounter 1: 1 - (-1) = 2

print(res) # Output 2
```

## sorted

Python's `sorted()` function can sort any iterable. It behaves similarly to the [list sort method](list#sorting) introduced earlier, sharing the same sorting algorithm and parameters. The main difference is that `list.sort()` sorts the list in-place (modifying the original list), whereas `sorted()` accepts any iterable and returns a new sorted list, leaving the original data unchanged.

We will explore the underlying sorting algorithm in the [array sorting](array#sorting) section. Here, we focus on the usage of `sorted()` as a higher-order function. It is defined as:

```python
sorted(iterable, *, key=None, reverse=False)
```

Where:

* `iterable`: The sequence or collection to be sorted.
* `key`: A function that extracts a comparison key from each element (e.g., `key=str.lower` or `key=len`). The default is `None`, which compares elements directly.
* `reverse`: A boolean. If set to `True`, the list is sorted in descending order.

The `key` function is applied to each element, and its return values are used to determine the sorting order. For example, when sorting a mixture of positive and negative numbers, the default order is ascending numeric value. However, if we specify `key=abs`, the numbers are sorted by their absolute values:

```python
numbers = [3, -1, 4, -1, 5, -9, 2, -6]

# Sort directly
print(sorted(numbers))           # Output: [-9, -6, -1, -1, 2, 3, 4, 5]
# Sort by absolute values
print(sorted(numbers, key=abs))  # Output: [-1, -1, 2, 3, 4, 5, -6, -9]

words = ["banana", "pie", "Washington", "book"]

# Default sorting by alphabetical order A~Z, a~z
print(sorted(words))           # Output: ['Washington', 'banana', 'book', 'pie']
# Sort by word length
print(sorted(words, key=len))  # Output: ['pie', 'book', 'banana', 'Washington']
```

`sorted()` can also handle complex sorting tasks, such as sorting a list of dictionaries or objects. The `key` function can return a tuple to perform multi-level sorting: sorting by the first element of the tuple first, and breaking ties using subsequent elements.

Suppose we have a list of employees, represented as dictionaries. We can sort them in multiple ways by customizing the `key` function:

```python
employees = [
    {'name': 'Alice', 'age': 45, 'salary': 75000},
    {'name': 'Bob', 'age': 30, 'salary': 50000},
    {'name': 'Charlie', 'age': 22, 'salary': 75000},
    {'name': 'David', 'age': 22, 'salary': 50000},
    {'name': 'Emily', 'age': 30, 'salary': 40000},
]

# Sort by age
print(sorted(employees, key=lambda e: e['age']))

# Sort by salary, descending
print(sorted(employees, key=lambda e: e['salary'], reverse=True))

# Sort by salary descending, then by age ascending
print(sorted(employees, key=lambda x: (-x['salary'], x['age'])))
```

## Exercises

* **Find the longest word**: Write a program to find the longest word in an input string. For example, given the input `"Pythora is an amazing planet to live on"`, the output should be `"Pythora"`.
* **Sort by dictionary value**: Given a list of dictionaries, such as `data = [{"name": "Alice", "age": 25}, {"name": "Bob", "age": 22}, {"name": "Charlie", "age": 30}]`, sort the dictionaries by the value of the `"age"` key.
* **Find the maximum value**: Use an anonymous function and `reduce()` to find the maximum value in a list (e.g., `[10, 3, 45, 2, 19]`). Although Python has a built-in `max()` function, implement it using `reduce()` to practice.
