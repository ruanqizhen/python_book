# Data and Variables

Data lies at the heart of all programming. At its essence, a program is a tool that transforms input data into output data. In Python, data is especially critical, as the language's primary domains—such as data engineering, analysis, and machine learning—are fundamentally data-driven.

In the statement `print("Hello, World!")`, `"Hello, World!"` is a piece of data.

## Common Python Data Types

Data is divided into distinct types because different kinds of information require different operations. For example, numbers undergo mathematical operations like addition and subtraction, whereas text strings are sliced or concatenated. Below is an overview of Python's built-in data types. At this stage, you only need a general familiarity; subsequent chapters will cover each type in detail.

* Numeric Types:
   * [Integer (int)](calculation#integers): Represents whole numbers, e.g., 1, 100, -33.
   * [Float (float)](calculation#floats): Represents real numbers, e.g., 3.14, -0.001.
   * [Complex (complex)](calculation#complex-numbers): Represents complex numbers, e.g., 3 + 4j.

* [Boolean (bool)](calculation#booleans):
   Only two values: True and False. Typically used for conditional tests.

* Sequence Types:
   * [String (str)](string): Text composed of characters enclosed in quotes, e.g., `"Hello"`, `'Python'`.
   * [List (list)](list): An ordered, mutable sequence of items, e.g., `[1, 2, 3, 'a', 'b']`.
   * [Tuple (tuple)](list#tuples): An ordered, immutable sequence of items, e.g., `(1, 2, 3, 'a', 'b')`.

* [Set Types](dict#sets):
   * Set (set): An unordered collection of unique elements, often used for membership testing and eliminating duplicates. E.g., `{1, 2, 3}`.
   * Frozenset (frozenset): An immutable version of a set.

* [Mapping Type](dict):
   * Dictionary (dict): A collection of key-value pairs where keys must be unique. E.g., `{'name': 'John', 'age': 30}`.

* [None Type](calculation#comparing-variable-references):
   * NoneType: Represents the absence of a value (equivalent to `null` in other languages).

* Binary Types:
   * [Bytes](string#byte-sequences): An immutable sequence of byte values, e.g., `b'hello'`.
   * Bytearray: A mutable version of bytes.
   * Memoryview: Allows direct memory access to other binary structures.

* [File Objects](file_io):
   Objects used to read and write files.

* Other Data Types:
   Third-party libraries extend this type system. For instance, when working with data analysis libraries, you will encounter custom types like `ndarray` (from NumPy) or `DataFrame` (from Pandas).

We will explore these data types in later chapters. First, let's learn how to store them using variables.

## Variables

We rarely work with raw, unnamed values directly. Instead, we associate a value with a descriptive name so we can refer to it throughout our program. These names are called variables. Variables make it easy to store, update, and manage data.

While variables in programming act as placeholders (similar to variables in algebra like $x + y = 10$), they function differently. In algebra, an equation represents an equality. In programming, a statement like `x = x + 1` is not an equation, but a command that means: "add 1 to the current value of `x`, and store the result back in `x`."

For example, consider this statement:

```python
print(5 + 5 + 5 + 5 + 5)
```

If we wanted to change this calculation to sum five `3`s instead, we would have to replace every single `5` in our code—a tedious and error-prone chore. By using a variable, we can write:

```python
x = 5
print(x + x + x + x + x)
```

Now, the calculation references `x`. The program yields the same result, but changing the input is as simple as updating `x = 3` in a single line.

Let's explore the core rules and concepts of Python variables:

### Declaration and Assignment

#### Assignment Statements

In Python, you do not need to declare a variable before using it or specify its data type. Python creates a variable automatically the first time you assign a value to it.

The value of a variable can be a number, a string, or any other type of data.

A variable's name is an [identifier](hello_world#identifier) and must follow Python's identifier rules: it can contain letters, numbers, and underscores (`_`), but cannot start with a number. E.g., `name_1` is valid, but `1_name` is not.

Variable names are case-sensitive (`age` and `Age` are completely different variables). By convention (PEP 8), variable names should be written in lowercase, separating words with underscores (e.g., `user_age`).

Spaces are not allowed inside a variable name (use `is_student` instead of `is student`).

Avoid naming variables after Python's built-in functions or keywords (such as `print`, `type`, or `sum`), as doing so will overwrite them and cause issues.

Always choose descriptive names that explain what the variable stores (e.g., use `price` instead of `p`, and `is_logged_in` instead of `flag`).

Unlike static languages like C/C++ (which require type declarations) or JavaScript (which uses `let` or `const`), Python provides a clean, keyword-free assignment syntax.

The following program creates a variable with a numeric value of 5:

```python
x = 5  # Creates an integer variable named x and assigns it the value 5
```

Here, `x` is the variable name, `5` is the value, and the `=` symbol is the assignment operator. The hash symbol `#` starts a comment, which is ignored by the computer and serves to explain the code.

#### Type Hints

Python supports optional type hints to document the expected data types of variables:

```python
name: str = "Gu Huozai"
age: int = 30
height: float = 5.9
is_student: bool = False
```

A type hint is added by placing a colon and a type name after the variable name. Unlike statically typed languages where compiler type mismatches trigger compile errors, Python does not enforce these types at runtime. The following code executes without any issues:

```python
age: int = "Qizhen Ruan"
```

While optional, type hints significantly improve code readability and allow tools like IDEs and static analyzers (such as `mypy`) to catch potential bugs before your code runs.

#### Multiple Variable Assignment

You can assign values to multiple variables in a single line. Separate both the variable names and the corresponding values with commas. This is useful for grouping related variables, such as coordinates:

```python
x, y = 3, 5
lat, lon = 33.4, 77.98
```

This feature makes swapping the values of two variables incredibly clean, eliminating the need for a temporary third variable:

```python
x, y = 3, 5
x, y = y, x  # The data in x and y are swapped; now x == 5, y == 3
```

If you assign multiple values separated by commas to a single variable, Python automatically packs them into a [tuple](list#tuples):

```python
z = 3, 5
print(z)   # Output: (3, 5)
```

You can also assign the same value to multiple variables simultaneously using chained assignment:

```python
x = y = z = 4
```

This is equivalent to:

```python
x = 4
y = x
z = y
```

What does the following statement produce?

```python
x, y = y, x = z = 3, 5
print(x, y, z)
```

While Python allows this, mixing multiple assignments on a single line can be confusing and should generally be avoided.

Only use chained assignment for [immutable types](#data-mutability). Because chained variables point to the exact same object in memory, using it with mutable structures like lists can lead to side effects, where updating one variable unexpectedly modifies another.

#### Dynamic Typing

Python is dynamically typed. This means a variable is not bound to a specific type; you can assign a value of one type to a variable, and later assign a value of a completely different type to that same variable:

```python
x = 5     # x is an integer
x = "hi"  # Now x is a string
```

Dynamic typing makes writing scripts fast and flexible. However, as applications grow, dynamic typing can introduce bugs that are hard to spot without executing the code, degrade code readability, and prevent compiler optimizations. This is why language communities often adopt static typing layers for large-scale development (such as TypeScript for JavaScript).

### The "Change" in Variables

Saying "we changed variable `x` to `5`" is slightly ambiguous. It does not clarify whether `x` now points to a new value, or if the value itself was modified in memory.

In Python, an assignment statement (`=`) always changes the reference: it makes the variable point to a different object. For example:

```python
x = 5     # x points to 5
x = 3     # Now x points to a different piece of data
```

Multiple variables can point to the exact same object in memory. Assigning one variable to another copies the reference (address), not the value itself:

```python
x = [1,2]     # x points to [1,2]
y = [1,2]     # x and y point to different data, but their values are both [1,2]

x = [1,2]     # x points to [1,2]
y = x         # y also points to the data that x points to
```

#### Data Mutability

Can we modify a data object itself, without changing where the variable points?

In Python, data objects are divided into mutable and immutable types. Primitive types (such as integers, floats, booleans, and strings) are **immutable**: once created, their value in memory cannot be altered. In contrast, collections like lists and dictionaries are **mutable**.

Let's look at the difference:

```python
a = [1, 2, 3]
a[0] = 5
print(a)  # Output: [5, 2, 3]

b = "Tom"
b = "Jerry"
print(b)  # Output: "Jerry"
```

A list holds a sequence of items. The statement `a[0] = 5` modifies the first item in the list directly, changing the object's contents in place.

Note: In computer science and Python, indexing starts at `0`. The first element is at index `0`, the second is at index `1`, and so on.

Because lists are mutable, modifying an index changes the list directly.

Strings are immutable. You cannot change a character of `"Tom"` in place (e.g., `b[1] = 'e'` will throw an error). Instead, reassigning `b = "Jerry"` simply points `b` to a brand-new string object.

Remember: mutability refers to the data object itself, not the variable. Any variable can always be reassigned to point to a different object.

#### Reference Variables

Because Python variables store references (pointers) to objects, assigning one variable to another makes both variables point to the same object in memory. They do not copy the data. We can prove this with a mutable list:

```python
a = [1, 2, 3]
b = a
b[0] = 5
print(a)  # Output: [5, 2, 3]
```

Since `a` and `b` reference the same list, modifying the list via `b` also changes the list seen by `a`.

What does this code output instead?

```python
a = [1, 2, 3]
b = [1, 2, 3]
b[0] = 5
print(a)
```

This sharing of references explains why chained assignment can lead to side effects:

```python
x = y = []
x.append(10)
print(x, y)  # Output: [10] [10]    because x and y point to the same list
```

### Scope

Another critical property of variables is scope—the regions of a program where a variable is defined and accessible. We discuss this in detail in the [Functions and Variable Scope](function#function-and-variable-scope) section.

### Deleting Variables

You can delete a variable name from memory using the `del` statement. Accessing it afterward raises a `NameError`:

```python
x = 10
del x
print(x)    # x no longer exists; running this line will cause an error
```

Manual deletion is rarely needed in everyday programming. It is occasionally used to release memory early when handling massive datasets, or to clean up sensitive data for security.

Unlike low-level languages like C (which require manual memory management, leading to memory leaks or dangling pointers if done incorrectly), modern languages use a garbage collector to reclaim unused memory automatically. This frees you to focus on program logic.

Python's memory management relies primarily on **reference counting**. The interpreter keeps track of how many active references (variables) point to an object. When an object's reference count falls to zero, its memory is instantly reclaimed.

While Python also runs secondary garbage collection (mark-sweep) to clean up circular references, reference counting handles the bulk of memory management instantly. As a result, you rarely need to worry about memory leaks or manual cleanup unless dealing with gigabyte-scale datasets. Explicitly using `del` to delete variables is generally only done when dealing with extremely memory-intensive large data (such as loading datasets of several gigabytes) and urgently needing to free up space.

## Constants

A constant is a value that cannot be altered by the program during execution. Many languages support native constants (e.g., `const PI = 3.14159`).

Python does not support read-only constants natively. Instead, developers use naming conventions: variables written in ALL_CAPS are treated as constants by convention. While Python will still let you modify them, it signals to others that the value should remain unchanged:

```python
PI = 3.14159
MAX_SIZE = 100
```

Related constants can be grouped using [enumerations (Enums)](iterator#enumerations), which we introduce later.

To enforce read-only constants, you can wrap data in a [class](class) and use properties. We cover this technique in the [Property Decorator](class#property-decorators) section.
