# Data Containers

## Custom Iterators

We have encountered iterators several times in preceding sections and saw how to construct them using [generators](generator#generator-functions). In this section, we will explore the internal mechanisms of Python's iterator protocol and learn how to implement custom iterators using object-oriented programming.

### Iterator Protocol

The **iterator protocol** requires two special methods: `__iter__()` and `__next__()`. Any class implementing these methods is an iterator.

* `__iter__()`: Returns the iterator object itself. This is called when passing the iterator to the built-in `iter()` function or when initiating a `for` loop.
* `__next__()`: Returns the next element. This is called when passing the iterator to the built-in `next()` function. When the sequence is exhausted, this method must raise a `StopIteration` exception to signal completion. Each invocation of `__next__()` advances the iterator's internal state.

Because iterators evaluate lazily, they do not hold all elements in memory simultaneously. Instead, they calculate and yield each element on demand. This makes them ideal for processing large or infinite datasets. Note that iterators can only move forward—you cannot reset them, go backward, or copy their state.

Here is a custom iterator that yields consecutive integers up to a specified limit:

```python
class CountUpTo:
    def __init__(self, max):
        self.max = max
        self.num = 0  # Initialize self.num

    def __iter__(self):
        return self

    def __next__(self):
        if self.num < self.max:
            result = self.num
            self.num += 1
            return result
        else:
            raise StopIteration

# Create iterator
counter = CountUpTo(5)
# Test
print(next(counter))     # Output: 0
print(next(counter))     # Output: 1
print(next(counter))     # Output: 2
print(next(counter))     # Output: 3
print(next(counter))     # Output: 4
# print(next(counter))     # Already at the end; calling next again will raise a StopIteration exception
```

The `CountUpTo` class has identical functionality to the `count_up_to()` [generator function](generator#generator-functions) we built earlier, but uses class syntax instead.

### Instantiating Iterators from Iterables

In most everyday code, you don't write custom iterators. Instead, you obtain them from built-in **iterables** (objects capable of returning an iterator, such as lists, strings, and dictionaries). For example, you can get an iterator from a list using `iter()`:

```python
my_list = [1, 2, 3]
my_iter = iter(my_list)

print(next(my_iter))  # Output: 1
print(next(my_iter))  # Output: 2
```

Here, `my_list` is the iterable, and `my_iter` is the active iterator generated from it.

## itertools Library

Python's standard library provides the `itertools` module, containing highly optimized functions for combining, filtering, and manipulating sequences of data. Using `itertools` makes your code faster and more memory-efficient. Let's cover the most common and useful functions in the module.

### Infinite Iterators

* count(start=0, step=1): Generates an infinite arithmetic sequence starting from start, incrementing by step.
* cycle(iterable): Repeats the given sequence infinitely.
* repeat(object[, times]): Repeats an object, infinitely or a specified number of times.

We previously used `count()` when [generating prime numbers](high_order#generating-prime-numbers).

```python
from itertools import count, cycle, repeat

# Infinite arithmetic progression starting from 10 with a step of 2
for num in count(10, 2):
    if num > 20:   # To avoid an infinite loop, add an exit condition
        break
    print(num)

# Infinite repetition of list [1, 2, 3]
counter = 0
for item in cycle([1, 2, 3]):
    if counter > 8:  # To avoid an infinite loop, add an exit condition
        break
    print(item)
    counter += 1

# Repeat string "Hello" 5 times
for item in repeat("Hello", 5):
    print(item)
```

When working with infinite streams, you must take care to prevent [infinite loops](loop#infinite-loop). For example, never try to unpack an infinite generator using the star operator (e.g., `print(*count())`) or convert it directly to a list, as this will consume all available RAM and crash the program.

Always use conditional checks, slicers, or limits to process infinite streams safely.

### Finite Iterators

There are many types of finite iterators. Let's introduce them using examples:

#### Accumulation

accumulate(iterable[, func, *, initial=None]): Returns accumulated sums or the accumulated results of other binary functions.

```python
from itertools import accumulate
import operator

# Cumulative sum
data = [1, 2, 3, 4, 5]
result = list(accumulate(data))
print(result)  # Output: [1, 3, 6, 10, 15]

# Cumulative product
result = list(accumulate(data, operator.mul))
print(result)  # Output: [1, 2, 6, 24, 120]
```

The `accumulate()` function is similar to [`reduce()`](high_order#reduce). The main difference is that `reduce()` returns only the final cumulative result, whereas `accumulate()` yields every intermediate step in the reduction.

#### Chaining

chain(*iterables): Chains multiple iterators into a single long sequence.

```python
from itertools import chain

# Concatenate multiple lists
result = list(chain([1, 2, 3], ['a', 'b', 'c']))
print(result)  # Output: [1, 2, 3, 'a', 'b', 'c']
```

While `chain()` behaves similarly to the `+` operator, `+` requires matching sequence types and allocates a new combined collection in memory. In contrast, `chain()` works with arbitrary iterables and yields values lazily, making it highly memory-efficient for large datasets.

#### Filtering

The following functions filter datasets in specialized ways, similar to the [`filter()`](high_order#filter) function.

* compress(data, selectors): Filters elements in data based on the boolean values in selectors.

```python
from itertools import compress

# Filter elements based on boolean values
data = [1, 2, 3, 4, 5]
selectors = [True, False, True, False, True]
result = list(compress(data, selectors))
print(result)  # Output: [1, 3, 5]
```

While `filter()` applies a test function to each element, `compress()` uses a parallel boolean selector sequence to filter elements.

* dropwhile(predicate, iterable): Skips elements while predicate is true, then returns the remaining elements.

```python
from itertools import dropwhile

# Skip elements while they are less than 3
result = list(dropwhile(lambda x: x < 3, [1, 2, 3, 4, 5, 2, 1]))
print(result)  # Output: [3, 4, 5, 2, 1]
```

Unlike `filter()`, which checks every item in a sequence, `dropwhile()` only checks elements at the beginning of the stream. Once the condition evaluates to `False`, it stops checking and yields all remaining elements without further inspection.

* takewhile(predicate, iterable): Yields elements while predicate is true, stops when it becomes false.

```python
from itertools import takewhile

# Yield elements while they are less than 3
result = list(takewhile(lambda x: x < 3, [1, 2, 3, 4, 5]))
print(result)  # Output: [1, 2]
```

* filterfalse(predicate, iterable): Yields elements for which predicate returns false.

```python
from itertools import filterfalse

# Yield elements for which the lambda returns False
result = list(filterfalse(lambda x: x % 2, [1, 2, 3, 4, 5]))
print(result)  # Output: [2, 4]
```

`filterfalse()` returns elements for which the test function evaluates to `False`, reversing the behavior of `filter()`.

#### Slicing

* islice(iterable, start, stop[, step]): Returns selected elements from the sequence by slicing.

While standard slicing (`[start:stop:step]`) only works on concrete sequence types like lists or strings, `islice()` performs lazy slicing on any arbitrary iterable.

```python
from itertools import islice

# Slice from a sequence
result = islice(range(10), 2, 8, 2)
print(list(result))  # Output: [2, 4, 6]
```

* groupby(iterable, key=None): Groups adjacent elements in the sequence according to the return value of the key function.

`groupby()` groups adjacent elements in a sequence based on a key function. It is highly useful for classifying datasets by custom properties.

```python
from itertools import groupby

# Group by length
data = ['abc', 'de', 'fgh', 'i', 'jk']
# Must sort before groupby, otherwise it only groups adjacent items
data.sort(key=len) 

for k, g in groupby(data, key=len):
    print(k, list(g)) 
    
# Output after sorting:
# 1 ['i']
# 2 ['de', 'jk']
# 3 ['abc', 'fgh']
```

Another example, grouping students by class:

```python
from itertools import groupby

students = [
    {"name": "Alice", "class": "A"},
    {"name": "Bob", "class": "B"},
    {"name": "Charlie", "class": "A"},
    {"name": "David", "class": "B"}
]

# Sort by class first
students.sort(key=lambda x: x["class"])

# Then use groupby
for key, group in groupby(students, key=lambda x: x["class"]):
    print(key, list(group))
```

#### Packing and Unpacking

* starmap(function, iterable): Uses arguments unpacked from iterable and applies them to the function.

`starmap()` performs the same operations as [`map()`](high_order#map) but expects the input sequence to yield tuples of arguments, which it automatically unpacks before passing to the function.

```python
from itertools import starmap

# Use parameter unpacking to apply a function
result = list(starmap(pow, [(2, 3), (3, 2)]))
print(result)  # Output: [8, 9]

# Zip using the longest iterable as the reference
result = list(zip_longest('ABCD', 'xy', fillvalue='-'))
print(result)  # Output: [('A', 'x'), ('B', 'y'), ('C', '-'), ('D', '-')]
```

### Permutations and Combinations

These functions compute permutations and combinations dynamically:

* product(*iterables, repeat=1): Computes the Cartesian product—the set of all possible ordered pairs from the input sets.

```python
from itertools import product, permutations, combinations, combinations_with_replacement

# Calculate the Cartesian product of two lists
result = list(product([1, 2], ['a', 'b']))
print(result)  # Output: [(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]

# Generate all possible 3-element permutations
result = list(permutations([1, 2, 3], 3))
from itertools import combinations

# Generate all possible two-element combinations
result = list(combinations([1, 2, 3], 2))
print(result)  # Output: [(1, 2), (1, 3), (2, 3)]
```

* combinations_with_replacement(iterable, r): Generates combinations of length `r`, allowing individual elements to repeat.

```python
from itertools import combinations_with_replacement

# Generate all possible two-element combinations with replacement
result = list(combinations_with_replacement([1, 2, 3], 2))
print(result)  # Output: [(1, 1), (1, 2), (1, 3), (2, 2), (2, 3), (3, 3)]
```

## Enumerations

In Python, an enumeration is represented as a class whose members define a fixed set of symbolic constants. Using enumerations provides descriptive names for groups of related [constants](variable#constants), making code more self-explanatory.

### Creating Enumerations

To define an enumeration, subclass the `Enum` base class from the standard `enum` module:

```python
from enum import Enum

class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3
```

Here, `Color` is an enumeration with three members: `RED`, `GREEN`, and `BLUE`.

Each member has a name and a value. Enumerations are immutable and prevent updates to members once defined.

### Accessing Enumeration Members

You can retrieve members by their name or value:

```python
print(Color.RED)        # Output: Color.RED
print(Color.RED.name)   # Output: RED
print(Color.RED.value)  # Output: 1
```

### Iterating Over Enumerations

You can iterate over all members of an enumeration:

```python
for color in Color:
    print(color.name, color.value)
```

### Using Auto-Assigned Values

If you do not want to specify explicit values, use `auto()` to automatically generate sequential integers starting from 1:

```python
from enum import auto, Enum

class Color(Enum):
    RED = auto()
    GREEN = auto()
    BLUE = auto()
```

At this point, `RED` has a value of 1, `GREEN` has a value of 2, and `BLUE` has a value of 3.

### Checking Enumeration Members

Retrieve a member dynamically using string names or literal values:

```python
print(Color(1))       # Output: Color.RED
print(Color['RED'])   # Output: Color.RED
```

### Comparing Enumerations

Because they represent unique singletons, compare enumeration members using the identity `is` operator or equality `==`:

```python
print(Color.RED is Color.RED)   # Output: True
print(Color.RED == Color.GREEN) # Output: False
```

### Type Checking

We can validate inputs by asserting that arguments are members of our enumeration:

```python
from enum import Enum

# Define an enum class
class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3

def print_color(color):
    if not isinstance(color, Color):
        raise ValueError("Not a valid Color enum member")
    print("Selected color is:", color.name)

# Correct usage of enum
print_color(Color.RED)  # Output: Selected color is: RED

# Incorrect usage of enum
try:
    print_color(1)  # Try passing a non-enum value
except ValueError as e:
    print(e)  # Output: Not a valid Color enum member
```

In this code, the `print_color()` function runs an `isinstance()` check to enforce type safety, raising an error if a raw integer is passed.

### Defining More Complex Enumerations

Since enumerations are standard Python classes, you can define custom methods inside them:

```python
from enum import Enum

class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3
    PURPLE = 4

    def describe(self):
        return f"Color name: {self.name}; Color value: {self.value}"

    # Mix colors
    @classmethod
    def mix(cls, color1, color2, ratio=0.5):
        if color1 == cls.RED and color2 == cls.BLUE or color1 == cls.BLUE and color2 == cls.RED:
            if ratio == 0.5:  # This is a simplified example, assuming only a 0.5 ratio produces PURPLE
                return cls.PURPLE
        return f"Mixing {color1.name} and {color2.name} at a ratio of {ratio} cannot produce a defined color"

print(Color.RED.describe())              # Output: Color name: RED; Color value: 1

# Demonstrate color combination
result = Color.mix(Color.RED, Color.BLUE)
if isinstance(result, Color):
    print(f"Mixed color is {result.name}")   # Output: Mixed color is PURPLE
else:
    print(result)

result = Color.mix(Color.RED, Color.BLUE, 0.3)
print(result)         # Output: Mixing RED and BLUE at a ratio of 0.3 cannot produce a defined color
```

## Named Tuples

A **named tuple** allows you to access elements using dot notation (by field name) rather than numerical indices, combining the efficiency of tuples with class-like readability. We define named tuples using `collections.namedtuple`:

```python
from collections import namedtuple

# Define a named tuple
Person = namedtuple("Person", ["name", "age", "gender"])

# Create a Person object
p1 = Person(name="Qizhen Ruan", age=40, gender="Male")

print(p1.name)         # Output: Qizhen Ruan
print(p1.age)          # Output: 40
print(p1.gender)       # Output: Male

# Use index
print(p1[0])           # Output: Qizhen Ruan

# Convert named tuple to a dictionary
print(p1._asdict())    # Output: {'name': 'Qizhen Ruan', 'age': 40, 'gender': 'Male'}

# Replace a field value of the named tuple
p2 = p1._replace(name="Bob")
print(p2)              # Output: Person(name='Bob', age=40, gender='Male')

# Get all field names
print(Person._fields)  # Output: ('name', 'age', 'gender')
```

Because named tuples are subclassed from standard tuples, they remain immutable. While you cannot modify fields in-place, the `_replace()` method returns a new named tuple instance with the specified updates.

In modern Python, prefer using `typing.NamedTuple`, which supports type hints and provides a clean class-based declaration syntax:

```python
from typing import NamedTuple

class Person(NamedTuple):
    name: str
    age: int
    gender: str

p1 = Person(name="Qizhen Ruan", age=40, gender="Male")
```
