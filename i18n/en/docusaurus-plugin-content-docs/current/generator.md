# Generators

When introducing loops, we previously mentioned [iterators](loop#可迭代对象和迭代器). Iterators allow programmers to traverse all elements in data containers such as lists, dictionaries, and so on. There are two main approaches to implementing iterators: one relies on object-oriented programming, which will be covered in detail in the [Implementing Iterators with Object-Oriented Programming](iterator) section; the other is the generator, which will be the focus of this section. Generators are an efficient way to create iterators, and they allow us to generate data on demand rather than generating and storing all data at once. There are two main ways to create generators: generator functions and generator expressions.

## Generator Functions

### Yielding Data

If you define a function that uses the `yield` keyword to return generated data, then that function will not return a regular value but instead will return a generator object. In other words, any function that contains `yield` is called a generator function. When this function is called, it returns a generator object, but does not immediately execute the code inside the function body. Only when `next()` is called on the generator object does the generator function execute up to the next `yield` statement, return the corresponding value, and then pause execution until `next()` is called again. For example:

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
# print(next(counter))     # Exhausted, calling next again raises StopIteration
```

As long as a function contains a `yield` statement, it becomes a generator function. So the `count_up_to` function in the above program is a generator. When this generator function is called, it does not execute immediately but instead returns a generator object. Generators are lazily evaluated, meaning data is generated on demand. Each time data is needed, you can call `next()` on the generator object. At that point, the code inside the generator function is executed. When it reaches a `yield` statement, the generator function returns the value after `yield`. The generator function then saves its current state, including all local variable values, and pauses execution until the next data request occurs. If the generator function has finished executing and will no longer reach a `yield` statement, calling `next()` will raise a `StopIteration` exception.

It is important to note that if a function contains both `yield` and `return`, the behavior of `return` differs from that in a regular function. When the generator function encounters `return`, the generator raises a `StopIteration` exception, and the value of the `return` statement serves as the value of the `StopIteration` exception.

For example:

```python
def example_function():
    yield "First yield"
    yield "Second yield"
    return "Return value"

# Using the generator
gen = example_function()

# First call to next()
print(next(gen))  # Output: First yield

# Second call to next()
print(next(gen))  # Output: Second yield

# Third call to next() triggers StopIteration with the return value
try:
    print(next(gen))
except StopIteration as e:
    print(f"Caught StopIteration: {e.value}")  # Output: Caught StopIteration: Return value
```

When first designing a generator function, you might feel uncertain about where to start. A handy tip to clarify your thinking is: first write a function that prints all the data you want to generate. For example, to print a sequence of positive integers:

```python
def count_up_to(n):
    count = 0
    while count < n:
        print(count)
        count += 1
```
Then, replace every `print()` call with a `yield` statement, and you have a generator function.

In practice, directly calling `next()` is relatively uncommon; instead, generators are typically iterated over using loops or comprehensions. For example, the following is a [Fibonacci sequence](recursive#计算斐波纳契数列) generator, iterated in a loop to obtain one Fibonacci number at a time:

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

If we did not use a generator but instead used a loop to directly generate a list of Fibonacci numbers, the functionality would be identical to the program above:

```python
# Directly return a list of Fibonacci numbers
def fibonacci(n):
    a, b = 0, 1
    result = []           # Initialize an empty list
    for _ in range(n):
        result.append(a)  # Add the value to the list
        a, b = b, a + b
    return result         # Return the list

for num in fibonacci(5):
    print(num)
    
# Output: 0  1  1  2  3
```

The difference between the two programs above lies in efficiency. Suppose we need a very large amount of data, such as generating ten million Fibonacci numbers. With the direct list approach, we must wait until all data has been generated before returning, which increases the return time. Moreover, all this data must be loaded into memory at once, causing excessive memory usage. If even larger amounts of data are required, memory may not be able to accommodate it. With a generator, on the other hand, each time a piece of data is produced, it is immediately returned, and the code that processes this data can run without waiting. Additionally, only the currently processed data needs to be loaded into memory at any given time, without needing to load the rest of the sequence, thus significantly reducing memory usage.

A generator can only be iterated over once. Once the generator function has finished executing and raised `StopIteration`, if you need the data again, you must recreate the generator object and iterate over it anew.

### Nested Generators

We can use the `yield from` statement to directly output values produced by another generator from within a generator function. In other words, `yield from` can take values generated by other generators or iterable objects and treat them as the output of the current generator. For instance, suppose we already have two simple generators: `generator1` and `generator2`. Now we need to create a new generator that first iterates through all the values produced by `generator1` and outputs them, then iterates through all the values produced by `generator2` and outputs them. In the new generator, instead of manually iterating over the existing generators, we can use `yield from` to directly consume their results:

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
   
# Prints numbers from 0 to 9.
```

`yield from` is very useful when dealing with nested generators. For example, suppose we have a list of lists (a 2D list) and need to write a generator to flatten it, i.e., yield each element from the nested lists one by one. Without `yield from`, you could write:

```python
def flatten_2d(nested_list):
    for sublist in nested_list:
        for item in sublist:
            yield item

nested_list = [[1, 2, 3], [4, 5], [6]]
for num in flatten_2d(nested_list):
    print(num)
```    

Using `yield from` accomplishes the same functionality with more concise code:

```python
def flatten_2d(nested_list):
    for sublist in nested_list:
        yield from sublist

nested_list = [[1, 2, 3], [4, 5], [6]]
for num in flatten_2d(nested_list):
    print(num)
```    

### Receiving Data

Generators can not only produce data but also receive and process data from outside. Inside a generator function, a `yield` expression can produce a return value representing data received from the outside. Outside the generator function, data is sent to the generator by calling the generator object's `send()` method. The data sent becomes the return value of the `yield` expression.

Here is an example:

```python
def my_generator():
    print("Generator started")
    received = yield "*** Yielding first data"
    yield f"*** Yielding second data, received value: {received}"

# Create the generator object
gen = my_generator()

# Start the generator and get the first `yield` value
value = next(gen) 
print(value)

# Send data to the generator and get the next `yield` value
value = gen.send("Hello")
print(value)
```

In the program above, the generator is first created. When `next()` is called, the generator prints "Generator started" and yields the first piece of data. The generator then idles until the program calls the generator object's `send()` method, sending the string "Hello" to the generator. This string is assigned to the variable `received`, after which the generator continues execution and yields the second piece of data.

Note that while the data obtained by each `yield` statement can be used by subsequent code, the first `yield` in a generator cannot receive data. Therefore, to obtain the first piece of data, you can only call `next(gen)` or `gen.send(None)`. Subsequent `yield` statements can then receive the actual data passed through the `send()` method.

If the generator has finished execution or raised an exception, calling `send()` on it will raise a `StopIteration` exception, which is consistent with the behavior of calling `next()`.

Here is a more complex example that can receive a line of text each time. It performs different operations based on the command sent (such as counting words, searching for a specific word, etc.):

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

# Create the generator coroutine
processor = text_processor()

# Start the coroutine
next(processor)

# Send data for word counting
processor.send(('count', "Hello world, this is a test."))

# Send data for keyword search
processor.send(('search', ('Hello', "Hello world, this is a test.")))

# Perform another keyword search
processor.send(('search', ('test', "Just another test.")))

# Program output:
# Word Count: 6
# 'Hello' found in text.
# 'test' found in text.
```

This code uses a generator to process incoming data. Similar functionality could be achieved with regular functions instead of generators. However, compared to regular functions, generators offer some distinct advantages. For example, they can maintain state. After a generator function starts running, it does not have to exit; it remains idle normally and runs when needed. This allows it to persistently hold internal state, such as the `search_counter` variable in the example above, which keeps track of how many searches have been performed. In more complex scenarios, we can leverage this property of generators to keep track of open network connections, record interaction contexts, and so on. Generators consume no system resources when idle, making them well suited for long-running tasks.

Below is a more complex example involving two generators that exchange data with each other using `yield` and `send()`:

```python
def generator_1(target):
    while True:
        # Receive data sent from outside
        received = yield
        print(f"[Debug] Generator 1 received external data: {received}")

        # Send data to generator_2 and receive a response
        sent = f"{received} from Generator 1"
        response = target.send(sent)
        print(f"[Debug] Generator 1 received response from Generator 2: {response}")

def generator_2():
    while True:
        # Receive data from generator_1
        received = yield
        print(f"[Debug] Generator 2 received data: {received}")

        # Send a response back to generator_1
        sent = f"{received} from Generator 2"
        yield sent

# Create generators
gen2 = generator_2()
gen1 = generator_1(gen2)

# Initialize generators
next(gen2)
next(gen1)

# Start exchanging data
gen1.send("DouDou")
```

The program output is as follows:

```
[Debug] Generator 1 received external data: DouDou
[Debug] Generator 2 received data: DouDou from Generator 1
[Debug] Generator 1 received response from Generator 2: DouDou from Generator 1 from Generator 2
```

You can see that data is passed back and forth between the two generators, with new information appended each time. Readers may also notice that the two generator functions in the example can run alternately: one function runs for a while, pauses, lets the other function run for a while, and then switches back. Before Python supported [asynchronous functions](asyncio), this property of generators was used to support concurrent tasks, allowing multiple tasks to run alternately and maximize system resource utilization. However, this use case has been entirely superseded by asynchronous functions, which are more intuitive and easier to understand.

## Generator Expressions

Generator expressions provide a compact way to create generators. In terms of syntax, generator expressions look very similar to list comprehensions, differing only in that generator expressions use parentheses `()` instead of square brackets `[]`. However, a generator expression returns a generator object rather than a list. For this reason, generator expressions are more memory-efficient than list comprehensions.

Suppose we want a generator that produces square numbers. We can use the following generator expression:

```python
squared = (x*x for x in range(10))

for num in squared:
    print(num)
```

Earlier, we used a list comprehension to create a list containing the squares of numbers from 0 to 9. Its expression is almost identical to the code above, differing only in the type of brackets used.

Here is another example. Suppose we need to select strings longer than 2 characters from a list, convert them to uppercase, and then iterate over the results:

```python
words = ["a", "be", "dog", "python", "ai", "hello", "world"]
result = (word.upper() for word in words if len(word) > 2)

for word in result:
    print(word)
```

## Differences Between Generators and Lists

A list is like ordering food at a restaurant: you have to wait until all the dishes (data) are prepared and served at once (taking up a huge amount of table space) before you can start eating. A generator, on the other hand, is like a conveyor-belt sushi: the chef (generator) makes one piece, the conveyor belt brings it to you, and you eat it. The table (memory) is never fully occupied, and you can start eating as soon as the first piece of sushi is ready (no need to wait for everything).

### Lazy Evaluation

Generators and generator expressions evaluate results lazily, meaning data is generated only when actually needed, rather than generating all possible data upfront. This approach can significantly reduce memory usage, especially when working with large datasets. Consider the following example:

```python
def count_up():
    count = 0
    while True:
        yield count
        count += 1

it = count_up()
for i in range(10):
    print(next(it))
```

`count_up` is a generator function with an infinite loop. However, the program does not run infinitely because it only executes once each time `next()` is called within the program. The `for` loop runs 10 times, each time calling `next(it)`. This `for` loop effectively limits how many values the generator produces, yielding only 10 values.

The advantage of lazy evaluation is improved memory efficiency, but it also has some potential risks that need special attention:

#### Limiting the Number of Iterations

When calling a generator, you must be mindful of limiting iterations; otherwise, running it indefinitely could still cause problems like memory exhaustion. Some operations may inadvertently forget to limit the number of calls. For example, passing a generator as an argument to a function that accepts a variable number of arguments:

```python
def count_up():
    count = 0
    while True:
        yield count
        count += 1

print(*count_up())
```

In the program above, `print(*count_up())` attempts to unpack an infinite generator into an argument list. Python will try to run the generator until it is exhausted (but it never will be) and attempt to construct an infinitely large argument tuple in memory. This causes the program to hang immediately and eventually crash due to memory overflow. Never use `list()` conversion or `*` unpacking on an infinite generator.

If the generator itself has a limit on how many times it runs, the above problem can be avoided:

```python
def count_up_to(n):
    count = 0
    while count < n:
        yield count
        count += 1
        
print(*count_up_to(10))
```

#### Changes to the Data Source

Because data generation is a process, if the data source changes during this process, the generated data may also change, potentially producing unexpected results. Can the reader predict what the following combinatorial generator expression will output?

```python
x = [1, 2]
comb = ((i, j) for i in x for j in x)
x = [3, 4]

print(*comb)
```

Four options:
A: (1, 1) (1, 2) (2, 1) (2, 2)
B: (3, 3) (3, 4) (4, 3) (4, 4)
C: (1, 3) (1, 4) (2, 3) (2, 4)
D: (3, 1) (3, 2) (4, 1) (4, 2)

On the planet Pythora, there is a universal formula for multiple-choice questions: among three long answers and one short, pick the short one; among three short answers and one long, pick the long one; if the difference is minimal, always choose C.

This is a classic trap that demonstrates Python generators' "binding timing" characteristic:
- The outer loop binds immediately: when a generator expression is defined, the outermost `for` loop (`for i in x`) immediately looks up and binds `x`. Therefore, the iteration scope for `i` is locked to the value of `x` at definition time, i.e., `[1, 2]`.
- The inner loop is lazily evaluated: the inner loop (`for j in x`) and the actual expression evaluation are lazy. They are only executed when the generator actually runs (when it is iterated over). When the program reaches `print(*comb)`, the generator starts working. At that point, the inner loop looks up the variable `x` and reads its latest value, `[3, 4]`.

Thus, `i` iterates over `[1, 2]`, while `j` iterates over `[3, 4]`, resulting in the combinations: (1, 3), (1, 4), (2, 3), (2, 4).

### When to Use Each

When the function we write needs to return a collection of data, we face a choice: either have the function directly return a list, or write it as a generator (including generator functions and generator expressions). We need to judge which option is better based on the specific circumstances:

* If the returned data will be accessed randomly by index, a list should be used; generators can only produce data sequentially.
* If the amount of data generated is very large, a generator should be used because it is lazily evaluated, only generating data when needed, which minimizes memory usage and improves performance; lists are only suitable for small amounts of data.
* If you are unsure how much of the generated data the program will ultimately use, a generator is also suitable, because if you use a list to return all data at once, much of it may never be used.

A common scenario is reading data from an external device for processing. If the data volume is too large, it can lead to excessive memory usage or even memory overflow. If you use a generator, you process one line or one chunk of data at a time, then read the next chunk for processing. This can significantly reduce memory usage.

Also note: generators and generator expressions are single-use; a generator can only be iterated over once. If you need to iterate over the same data multiple times, you must recreate the generator each time.
