# Data and Variables

Data is the core of all programming languages. The essence of a program is transforming some data (input) into other data (output). In Python, data is crucial — tasks heavily dependent on data, such as data processing and machine learning, are Python's main areas of application.

In the statement `print("Hello, World!")`, `"Hello, World!"` is a piece of data.

## Common Python Data Types

Data is usually divided into different types, because different types of data require different processing methods. For example, numeric data can undergo arithmetic operations like addition, subtraction, multiplication, and division; strings are more often used for operations like slicing and concatenation. The following lists the most commonly used data types in Python. For now, you only need a general impression of them — subsequent chapters will explain how to use these data types in detail.

* Numeric Types:
   * [Integer (int)](calculation#整数-integers): Represents whole numbers, e.g., 1, 100, -33.
   * [Float (float)](calculation#浮点数-floats): Represents real numbers, e.g., 3.14, -0.001.
   * [Complex (complex)](calculation#复数-complex-numbers): Represents complex numbers, e.g., 3 + 4j.

* [Boolean (bool)](calculation#布尔值-booleans):
   Only two values: True and False. Typically used for conditional tests.

* Sequence Types:
   * [String (str)](string): Text composed of zero or more characters, enclosed in single or double quotes, e.g., `"Hello"`, `'Python'`.
   * [List (list)](list): An ordered collection of objects, e.g., `[1, 2, 3, 'a', 'b']`.
   * [Tuple (tuple)](list#元组): An ordered, immutable collection of objects, e.g., `(1, 2, 3, 'a', 'b')`.

* [Set Types](dict#集合):
   * Set (set): An unordered collection of unique elements. Basic functionality includes relationship testing and duplicate elimination. For example: `{1, 2, 3}`.
   * Frozenset (frozenset): Similar to a set, but immutable.

* [Mapping Type](dict):
   * Dictionary (dict): An unordered collection of key-value pairs, where keys must be unique. For example: `{'name': 'John', 'age': 30}`.

* [None Type](calculation#变量指针的比较):
   * NoneType: Has only one value, None. Used to represent the absence or emptiness of a value.

* Binary Types:
   * [Bytes](string#字节序列): An immutable sequence of bytes, e.g., `b'hello'`.
   * Bytearray: A mutable sequence of bytes.
   * Memoryview: Accesses the memory of other data structures through a memoryview object.

* [File Objects](file_io):
   Used for file operations, such as reading from or writing to files.

* Other Data Types:
   Many Python modules and libraries extend the data type system. In programs that use these modules, you may encounter other data types, such as `ndarray` defined in the `numpy` library or `DataFrame` defined in the `pandas` library, among others.

The usage of these data types will be explained in detail later. Before continuing with data, we first need to introduce "variables" (Variable).

## Variables

In programming languages, we typically do not use raw data directly. Instead, we give data a name and use that name to refer to the data throughout the program. These names, or labels for data, are called "variables." Variables allow us to conveniently label, store, and manipulate data.

Beginners often compare variables to those in algebraic equations (such as $x + y = 10$). Both indeed serve as "placeholders." However, it is important to note that variables in programming are more like containers or pointers. `x = x + 1` does not hold true in mathematics, but in programming it means "calculate the result of `x + 1` and reassign it to `x`."

For example, in the following print function, the parameter directly uses the data itself:

```python
print(5 + 5 + 5 + 5 + 5)
```

What if we want the program to print the result of `3 + 3 + 3 + 3 + 3` instead? Then we would need to replace every occurrence of `5` with `3` in the program — very tedious. But if we give the data a name, say `x`:

```python
x = 5
print(x + x + x + x + x)
```

At the same time, when the function uses the data, it can use the variable name `x`. The program runs with the same result, but when we need to print `3 + 3 + 3 + 3 + 3` again, we only need to change the value of `x` to `3`, without modifying every occurrence of the data.

Here are some basic concepts and characteristics of variables in Python:

### Declaration and Assignment

#### Assignment Statements

In Python, there is no need to explicitly declare a variable or its type. When a variable is assigned a value, Python automatically creates the variable.

The value of a variable can be a number, a string, or any other type of data.

The name of a variable is an [identifier](hello_world#标识符) and must follow the identifier naming rules. It must be a combination of uppercase and lowercase English letters, digits, and underscores `_`, and the variable name cannot start with a digit. For example, `name_1` is a valid variable name, whereas `1_name` is not.
Python variable names are case-sensitive, meaning `Variable` and `variable` are two different variables. By convention, variable names should not contain any uppercase letters; `Variable` is not a Pythonic variable name.
Variable names cannot contain spaces, but underscores can be used to separate words within a name. For example, `is_student` is a valid variable name, but `is student` is not.
Avoid using names that already have specific purposes in Python as variable names. For example, `print` is the name of Python's built-in print function, making it unsuitable for use as a variable name.
Although syntactically we can use any word as a variable name, giving each variable a descriptive and appropriate name is crucial for making the program readable and understandable.

In contrast, some languages, such as C, require variables to be declared before they can be used. Some languages, such as JavaScript, have a dedicated keyword `var` to define variables. Other languages, such as PHP, require every variable name to start with a special character `$`. Compared to these languages, Python has the most relaxed constraints on variables.

The following program creates a variable with a numeric value of 5:

```python
x = 5  # Creates an integer variable named x and assigns it the value 5
```

In the above program, `x` is the variable name, and `5` is the data. The equals sign `=` denotes an assignment operation. After running this program, you get a variable with the value `5`. This operation of assigning a value to a variable is called an assignment statement. The hash symbol `#` indicates a comment; in a program, text following `#` is purely explanatory and does not participate in program execution.

#### Type Hints

When creating a variable, you can also add type hints, for example:

```python
name: str = "Gu Huozai"
age: int = 30
height: float = 5.9
is_student: bool = False
```

In the above program, the variable name is followed by a colon, and the text after the colon indicates the data type of the variable. In most programming languages, once a variable's data type is specified, the compiler or interpreter automatically checks whether the variable's data type is correct and reports errors if it is not. However, Python does not impose any actual data type restrictions — these type hints are merely suggestions about the intended variable type. Running the following program will not produce any error messages from Python:

```python
age: int = "Qizhen Ruan"
```

Although Python itself does not check variable data types at runtime, type hints are very helpful for code readability. Many code checking tools (such as mypy) also rely on type definitions to perform type checking on code. On the planet Pythora, variables in programs typically come with type hints.

#### Multiple Variable Assignment

Python can assign values to multiple variables using a single equals sign, with variable names separated by commas, and data values separated by commas. This can simplify programs in many cases. For example, when defining a position on a two-dimensional plane, you always need an X-axis value and a Y-axis value — these two values can be defined simultaneously:

```python
x, y = 3, 5
lat, lon = 33.4, 77.98
```

A common operation is swapping the data in two variables. Most languages require introducing a temporary variable to solve this problem, but in Python, this operation can be more concise:

```python
x, y = 3, 5
x, y = y, x  # The data in x and y are swapped; now x == 5, y == 3
```

If you assign multiple data values to a single variable, Python automatically packs all values into a [tuple](list#元组):

```python
z = 3, 5
print(z)   # Output: (3, 5)
```

If multiple variables share the same value, you can also use chained assignment, for example:

```python
x = y = z = 4
```

The above code is equivalent to the following three lines:

```python
x = 4
y = x
z = y
```

Consider what the output of the following program would be:

```python
x, y = y, x = z = 3, 5
print(x, y, z)
```

This code involves multiple assignments, and the output may be unexpected. Use with caution.

Chained assignment is generally used for [immutable data types (explained in detail below)](#数据的可变性). Chained assignment causes all variables to point to the same data. If that data is mutable, modifying the data through one variable will also change the values of all other variables pointing to that data, which can lead to unexpected issues.

#### Dynamic Typing

Python is a dynamically typed language. This means you can change the type of a variable at runtime. In contrast, in most languages, a variable's data type is fixed once declared and cannot be changed.

```python
x = 5     # x is an integer
x = "hi"  # Now x is a string
```

The advantage of dynamic typing is conciseness and flexibility, making it well-suited for writing small, temporary programs. Many programming languages were originally designed for developing small programs and therefore tended to adopt dynamic typing. Some of these languages have since been applied to scenarios far beyond their original design, with programs growing increasingly large in scale. However, in large programs, the drawbacks of dynamic typing far outweigh its advantages. For example, it makes it impossible to check for type errors before program execution, reduces code readability, impacts runtime efficiency, and makes optimization difficult. As a result, many languages, such as JavaScript and PHP, have later evolved supersets or versions that support static typing or disable dynamic typing (such as TypeScript) to better support large-scale program development.

### The "Change" in Variables

When explaining programs, we often say things like "change the data in variable x to 5." However, such wording is imprecise — it does not clarify whether we mean making the variable point to a different piece of data, or keeping the variable pointing to the same data but changing the data's value.

In Python, an assignment statement always changes what a variable points to. For example, if we first set `x = 5` and then set `x = 3`, then x must be pointing to a different piece of data, rather than the original data changing from 5 to 3.

```python
x = 5     # x points to 5
x = 3     # Now x points to a different piece of data
```

Different variables can point to the same data. If both sides of an assignment statement are variables, it means the variable on the left will also point to the data that the variable on the right points to.

```python
x = [1,2]     # x points to [1,2]
y = [1,2]     # x and y point to different data, but their values are both [1,2]

x = [1,2]     # x points to [1,2]
y = x         # y also points to the data that x points to
```

#### Data Mutability

Since assignment statements always change what a variable points to, can data itself be changed?

In some programming languages, such as C, all data is mutable (unless specifically declared with `const`). For example, a user can change the value of an integer from 1 to 2. However, in Python, many types of data (such as integers, floats, and strings) are immutable, meaning that once created, their values cannot be modified. Of course, Python also has many other types of data that are mutable.

In the following example program, [list data](list) is a typical mutable data type, while strings are immutable data.

```python
a = [1, 2, 3]
a[0] = 5
print(a)  # Output: [5, 2, 3]

b = "Tom"
b = "Jerry"
print(b)  # Output: "Jerry"
```

A list may consist of multiple other data items. For example, in the above program, variable `a` is a list composed of three integers. The statement `a[0] = 5` means replacing the 0th element of this list with 5.

In everyday life, when we count and sort items, we always start from 1 — first, second, and so on. However, the vast majority of programming languages, including Python, start counting from 0. In a collection of data, the first element is always the 0th, followed by the 1st, 2nd, and so on.

Therefore, after the program replaces the 0th element of the list with 5, the data that variable `a` points to becomes `[5, 2, 3]`.

String data in Python is immutable. For example, we cannot change the second letter of the string `"Tom"` to another letter. However, we can still make variable `b` point to a different string.

It is especially important to note that the discussion above concerns whether the data itself is mutable, not whether the variable is mutable. Variables can always point to new data.

#### Reference Variables

In Python, variables store references to data, not the data itself. This means that when you assign one variable to another, both variables actually point to the same data, rather than having two separate pieces of data with the same value. How can we prove this? Consider the following program:

```python
a = [1, 2, 3]
b = a
b[0] = 5
print(a)  # Output: [5, 2, 3]
```

In this program, running the statement `b = a` means that variable `b` will also point to the data that variable `a` points to — they both point to the same piece of data. If subsequent code changes the data through variable `b`, variable `a` will also reflect the same changes.

Consider what the output of the following program would be:

```python
a = [1, 2, 3]
b = [1, 2, 3]
b[0] = 5
print(a)
```

This issue is especially important to be aware of when using chained assignment, for example:

```python
x = y = []
x.append(10)
print(x, y)  # Output: [10] [10]    because x and y point to the same list
```

### Scope

In addition to the points mentioned above, scope is also an important property of variables — that is, where a variable is valid and within which scope it can be modified. We will discuss this after introducing functions; see the section [Functions and Variable Scope](function#函数和变量的作用域).

### Deleting Variables

We can delete a variable using the `del` statement. After a variable is deleted, attempting to access it will result in an error:

```python
x = 10
del x
print(x)    # x no longer exists; running this line will cause an error
```

Deleting variables is not commonly used — it can be said that in typical small programs, it is hardly ever needed. Its main uses are twofold: first, when processing massive amounts of data, it can help release memory in a timely manner; second, for security reasons, ensuring that certain variables cannot be accessed in subsequent program code.

Some programming languages, such as C, do not have built-in memory reclamation capabilities; memory management in these programs relies entirely on the programmer to implement. In these languages, all memory allocated for data must be released after use, otherwise memory leaks occur. Furthermore, memory cannot be released too early, otherwise issues such as dangling pointers (pointers pointing to invalid memory), data corruption, etc., may arise. Most mainstream programming languages today have some form of garbage collection mechanism, which can automatically release memory that is no longer used by the program. Programmers no longer need to worry about memory allocation and can focus solely on program logic. The system automatically releases and reclaims the memory occupied by the program at appropriate times. For example, Java's garbage collection mechanism is a representative example.

Python also has an automatic garbage collection mechanism. Unlike Java, which primarily uses "reachability analysis," Python mainly uses a reference counting mechanism. The principle is simple: Python keeps a real-time count of how many variables reference each piece of data. When a data object's reference count drops to 0 (meaning no variable points to that data anymore), Python immediately reclaims that memory.

Although Python's mechanism requires additional auxiliary algorithms (mark-sweep) to handle circular references, in most cases, its memory management is efficient and timely. As a programmer, you typically do not need to manually manage memory in Python like you would in C, nor do you need to be overly concerned about memory leaks. Explicitly using `del` to delete variables is generally only done when dealing with extremely memory-intensive large data (such as loading datasets of several gigabytes) and urgently needing to free up space.

## Constants

Many languages, in addition to variables, also allow users to define constants. A constant can be understood as a name or label for a specific data value. Once defined, these names cannot be made to point to other data, and in most cases, the constant data itself is also not allowed to be changed. For example, many languages define a constant Pi = 3.1415926.

In Python, there is no built-in way to define true constants. However, we can use some conventional rules and techniques to simulate constant behavior. The most common approach is to use uppercase letters as identifiers: according to Python naming conventions, fully uppercase variable names are generally treated as constants. Although this does not prevent modifying the variable's value in the program, it signals to other developers that the value of this variable should not be modified. For example, the following variables should not have their values changed during program execution:

```python
PI = 3.14159
MAX_SIZE = 100
```

Sometimes, multiple constants are bundled into a group of constants. For example, constants representing specific colors — red, yellow, blue — can be grouped into a set of constants called `color`. This is an [enumeration type](iterator#枚举), which we will introduce in detail later.

Additionally, to prevent data within a constant from being modified, you can consider using a [class](class) to wrap the data and control access to it. Related methods will be introduced in detail in the [Property Decorator](class#属性装饰器) section.
