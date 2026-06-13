# Generators

When introducing loops, we discussed [iterators](loop#iterables-and-iterators). Iterators allow you to traverse all the elements in data structures like lists or dictionaries. 

There are two primary ways to implement custom iterators in Python:
1. An object-oriented approach by defining a class that implements the iterator protocol, which is covered in detail in the [Implementing Iterators](iterator) section.
2. Using a **generator**, which is the focus of this section.

Generators are a highly concise and efficient way to create iterators. They generate data lazily (on-demand) rather than calculating and storing all elements in memory at once. You can create generators in two ways: **generator functions** and **generator expressions**.

## Generator Functions

### Yielding Data

If you define a function that uses the `yield` keyword to return data, it is a **generator function**. When called, a generator function does not run the code in its body immediately; instead, it returns a special generator object.

Only when you call `next()` on the generator object does the function execute—running until it encounters a `yield` statement. At that point, the function pauses, saves its execution state (including all local variables), and returns the yielded value. When `next()` is called again, the function resumes execution from exactly where it paused.

For example:

```python
def count_up_to(n):
    count = 0
    while count < n:
        yield count
        count += 1

counter = count_up_to(5)
print(counter)           # Output: <generator object count_up_to at 0xXXXXXXXX>
print(next(counter))     # Output: 0
print(next(counter))     # Output: 1
print(next(counter))     # Output: 2
print(next(counter))     # Output: 3
print(next(counter))     # Output: 4
# print(next(counter))     # Raises StopIteration once the generator is exhausted
```

Generators are **lazy evaluators**: they only calculate values when asked. Each call to `next()` runs the generator function until it hits the next `yield` statement. When the function reaches its end or encounters a `return` statement, calling `next()` raises a `StopIteration` exception, indicating that the generator is exhausted.

If a generator function contains a `return` statement, its behavior differs from a regular function: it raises a `StopIteration` exception, and the return value is attached to the exception object's `value` attribute.

For example:

```python
def example_function():
    yield "First yield"
    yield "Second yield"
    return "Final return value"

gen = example_function()

print(next(gen))  # Output: First yield
print(next(gen))  # Output: Second yield

try:
    print(next(gen))
except StopIteration as e:
    print(f"Caught StopIteration: {e.value}")  # Output: Caught StopIteration: Final return value
```

> [!TIP]
> If you are struggling to write a generator function, first write a standard function that prints the values you want to produce. Once the printing logic is correct, simply replace all `print()` statements with `yield` statements, and your generator is ready.

In practice, calling `next()` manually is rare. Instead, generators are typically iterated over using loops or comprehensions. For example, here is a recursive-like [Fibonacci sequence](recursive#calculating-the-fibonacci-sequence) generator:

```python
# Fibonacci sequence generator
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

for num in fibonacci(5):
    print(num)
    
# Output: 0  1  1  2  3
```

Compare this to a function that builds and returns a list of Fibonacci numbers directly:

```python
# Directly return a list of Fibonacci numbers
def fibonacci(n):
    a, b = 0, 1
    result = []
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result

for num in fibonacci(5):
    print(num)
    
# Output: 0  1  1  2  3
```

The difference between these two approaches is **resource efficiency**. If you need to generate a massive sequence (e.g., ten million numbers), the list approach forces the program to construct the entire collection in memory first, leading to high memory usage and a long startup delay. The generator returns each number immediately as it is produced, allowing the consumer code to run without waiting, while consuming virtually no extra memory.

Note that generators are single-use objects. Once a generator has been exhausted (raised `StopIteration`), you cannot restart it. To traverse the sequence again, you must instantiate a new generator object.

### Nested Generators

You can delegate generator operations to another generator or iterable using the `yield from` statement. This allows you to yield all values from another source directly without writing nested loops:

```python
def generator1():
    for i in range(5):
        yield i

def generator2():
    for i in range(5, 10):
        yield i

def combined_generator():
    yield from generator1()
    yield from generator2()

for value in combined_generator():
    print(value)
# Output: Prints numbers from 0 to 9
```

`yield from` is especially useful for flattening nested, multidimensional data structures:

```python
def flatten_2d(nested_list):
    for sublist in nested_list:
        yield from sublist

nested_list = [[1, 2, 3], [4, 5], [6]]
for num in flatten_2d(nested_list):
    print(num)
# Output: Prints 1, 2, 3, 4, 5, 6 sequentially
```

### Sending Data to Generators

Generators are bi-directional: they can yield data to the caller, and they can receive data back. 

Inside a generator function, the `yield` statement can be written as an expression that evaluates to a value: `received = yield output_value`. Outside the function, the caller sends data into the generator using the `send()` method. The value passed to `send()` becomes the result of the active `yield` expression inside the generator:

```python
def my_generator():
    print("Generator started")
    received = yield "*** Yielding first data"
    yield f"*** Yielding second data, received value: {received}"

gen = my_generator()

# 1. Start the generator to reach the first yield
value = next(gen) 
print(value)  # Output: *** Yielding first data

# 2. Send data to resume execution
value = gen.send("Hello")
print(value)  # Output: *** Yielding second data, received value: Hello
```

> [!IMPORTANT]
> A generator cannot receive data when it is first initialized because it has not yet reached its first `yield` expression. To start a generator (a process called *priming*), you must first call `next(gen)` or `gen.send(None)`. Only subsequent calls can pass non-`None` values.

Here is a more advanced example. This generator remains running in the background, receiving commands and text inputs to perform operations (like word counting or keyword searching) while maintaining its internal state:

```python
def text_processor():
    search_counter = 0
    while True:
        received = yield
        command, data = received if received else ('', '')

        if command == 'count':
            words = data.split()
            word_count = len(words)
            print(f"Word Count: {word_count}")

        elif command == 'search':
            search_counter += 1
            keyword, text = data
            if keyword in text:
                print(f"'{keyword}' found in text.")
            else:
                print(f"'{keyword}' not found in text.")

processor = text_processor()
next(processor)  # Prime the generator

# Send inputs
processor.send(('count', "Hello world, this is a test."))
processor.send(('search', ('Hello', "Hello world, this is a test.")))
processor.send(('search', ('test', "Just another test.")))

# Output:
# Word Count: 6
# 'Hello' found in text.
# 'test' found in text.
```

Because generators preserve their execution frame, they maintain local state (like `search_counter`) across invocations without needing global variables or class properties. When a generator is suspended, it consumes no CPU cycles, making it highly efficient.

Before Python introduced formal [asynchronous functions](asyncio), generators and the `yield` mechanic were the standard way to implement co-routines and cooperative multitasking. Today, Python's `async`/`await` syntax has replaced this pattern for concurrent programming, but generators remain the best tool for pipeline data processing.

## Generator Expressions

Generator expressions provide a compact, one-line syntax for creating generators. Syntactically, they look identical to list comprehensions but use parentheses `()` instead of square brackets `[]`:

```python
squared = (x*x for x in range(10))

for num in squared:
    print(num)
```

Like list comprehensions, you can add filtering conditions:

```python
words = ["a", "be", "dog", "python", "ai", "hello", "world"]
result = (word.upper() for word in words if len(word) > 2)

for word in result:
    print(word)
```

## Generators vs. Lists

A list is like ordering food at a restaurant: you must wait until the chef prepares all the dishes (data items) and serves them at once (consuming table space) before you can start eating. 

A generator is like a conveyor-belt sushi bar: the chef produces one piece, the belt delivers it, and you eat it immediately. The table (memory) is never cluttered, and you start eating without waiting for the full menu to be prepared.

### Lazy Evaluation Caveats

Lazy evaluation makes generators incredibly efficient, but it introduces a few behaviors that can catch developers off guard:

#### 1. Unpacking Infinite Generators
If a generator produces an infinite sequence, you must limit your iterations. Certain operations will try to exhaust a generator completely. For example, unpacking an infinite generator using `*` or converting it to a list using `list()` will cause your program to freeze and crash with an Out Of Memory (OOM) error:

```python
def count_up():
    count = 0
    while True:
        yield count
        count += 1

# DANGER: This will attempt to build an infinite tuple in memory and crash
# print(*count_up())
```

#### 2. Late Binding in Generator Expressions
Because generator expressions evaluate lazily, they bind variables at execution time, not definition time. Consider this example:

```python
x = [1, 2]
comb = ((i, j) for i in x for j in x)
x = [3, 4]

print(*comb)
```

What does this print?
* The outermost loop binds immediately: the first `for i in x` is evaluated when the generator is defined, locking `i` to iterate over `[1, 2]`.
* The inner loop binds lazily: the nested `for j in x` is evaluated only when the generator runs (during `print(*comb)`). By that time, `x` has been updated to `[3, 4]`.

Thus, the generator yields the combinations of `[1, 2]` and `[3, 4]`: `(1, 3), (1, 4), (2, 3), (2, 4)`.

### When to Use Each

Use a **list** if:
* You need random access to elements by index (e.g., accessing `data[5]`).
* You need to iterate over the same dataset multiple times.
* You are working with a small collection where memory usage is negligible.

Use a **generator** if:
* The dataset is extremely large or infinite.
* You only need to traverse the elements sequentially once.
* You want to start processing data immediately without waiting for the full dataset to load (e.g., reading lines from a massive log file).
