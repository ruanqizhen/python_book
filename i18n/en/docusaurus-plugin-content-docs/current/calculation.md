# Basic Mathematical Operations

The inhabitants of Pythora frequently use Python as a calculator. When handling large datasets or performing quick calculations, Python is often more convenient than a standard calculator. It supports basic arithmetic (addition, subtraction, multiplication, and division) as well as advanced operations like exponentiation, modulo, and floor division.

## Integers

### Basic Arithmetic

Python's integer operations mirror standard mathematical notation. For example, basic addition and subtraction are written as:

```python
print(3 + 2) # Output: 5
print(5 - 2) # Output: 3
```

Like most programming languages, Python uses an asterisk (`*`) for multiplication and a forward slash (`/`) for division. In older versions (Python 2), dividing two integers with `/` performed integer truncation. In modern Python 3, however, `/` always performs float division (e.g., `8 / 2` yields `4.0`). To perform integer division (ignoring the remainder), use the double slash (`//`). Modulo (getting the remainder) is done with `%`, and exponentiation ($x^y$) is written with a double asterisk (`**`):

```python
print(4 * 3) # Output: 12
print(8 / 3) # Output: 2.666...

print(8 // 3) # Output: 2
print(8 % 3)  # Output: 2
print(2 ** 4) # Output: 16
```

The `+` and `-` symbols also act as unary operators to specify positive or negative signs (e.g., `+2`, `-5`). Unary sign operators have higher precedence than standard binary arithmetic operators. What do you think the following lines will output?

```python
print(2*-5)
print(1+++2)
print(1+-+-+-+-+2)
```

### Number Bases

Python supports representing integers in several number bases. Decimal (base-10) is the default and has no prefix, e.g., `42`.

Binary (base-2) integers are prefixed with `0b` or `0B`. For example, `0b101010` equals decimal `42`.

Octal (base-8) integers are prefixed with `0o` or `0O`. For example, `0o52` equals decimal `42`.

Hexadecimal (base-16) integers are prefixed with `0x` or `0X`. For example, `0x2A` equals decimal `42`.

You can convert an integer into a string representation in a specific base using these built-in functions:

* `bin(x)`: Converts an integer `x` to a binary string.
* `oct(x)`: Converts an integer `x` to an octal string.
* `hex(x)`: Converts an integer `x` to a hexadecimal string.
* `int(string, base)`: Parses a string representation of a number into an integer. If the string contains a base prefix (like `0x` or `0b`), you can pass `base=0` to let Python detect the base automatically.

For example:

```python
x = 42
print(bin(x))  # Output: '0b101010'
print(oct(x))  # Output: '0o52'
print(hex(x))  # Output: '0x2a'

y = '0b101010'
print(int(y, 2))  # Output: 42, automatically recognizes binary
```

You can also use `int()` to convert floating-point numbers or numeric strings into integers.

## Floats

### Basic Arithmetic

Floating-point numbers (floats) represent real numbers with fractional parts. Their arithmetic is identical to integers, but the output will be a float. For example:

```python
print(3.0 + 2.5)  # Output: 5.5
print(5.5 - 2.5)  # Output: 3.0
print(4.0 * 3.0)  # Output: 12.0
print(8.0 / 3.0)  # Output: 2.666...
```

### Notation

Floats can be written in two ways. The most common is standard decimal notation (e.g., `3.14`, `0.001`, `4.0`).
For extremely large or small numbers, you can use scientific notation, employing `e` or `E` to represent powers of 10. E.g., `2.5e2` is $2.5 \times 10^2 = 250.0$, and `1.23E-3` is $1.23 \times 10^{-3} = 0.00123$.

### Special Values

Python floats include three special values defined by the IEEE 754 standard: `inf` (positive infinity), `-inf` (negative infinity), and `nan` (Not a Number, representing undefined or unrepresentable numerical results).

They follow specific arithmetic rules:
- `inf + positive number = inf`
- `inf - positive number = inf`
- `-inf + negative number = -inf`
- `inf + (-inf) = nan` (adding positive and negative infinity is mathematically undefined)
- `inf * 0 = nan`

Consider the following program:

```python
positive_infinity = float("inf")
negative_infinity = float("-inf")
print(positive_infinity + negative_infinity)  # Output: nan
```

Here, `float()` is a built-in function that converts numeric strings or other number types into floats:

```python
print(float(7))       # Output: 7.0
print(float("3.14"))  # Output: 3.14
```

### Rounding Errors

Floating-point math can lead to unexpected rounding errors. Because computers store numbers in binary, certain decimal values (like `0.1` and `0.2`) cannot be represented with perfect precision. E.g.:

```python
print(0.1 + 0.2)  # Output: 0.30000000000000004 instead of 0.3
```

Because of this, you should never compare floating-point numbers directly for exact equality (`==`). Instead, check if their difference falls within a tiny tolerance threshold.

## Advanced Mathematical Operations

Beyond basic arithmetic, Python provides many built-in functions for numerical computation, such as `abs()`, `round()`, `max()`, `min()`, `sum()`, and others. These functions are highly intuitive:

```python
print(abs(-5))      # Output: 5, absolute value
print(round(2.6))   # Output: 3
print(round(2.5))   # Output: 2 (Note: Python 3 uses banker's rounding, where .5 rounds to the nearest even number)
print(round(3.5))   # Output: 4
```

For advanced math operations, Python provides the built-in `math` and `statistics` libraries. For example, you can calculate the square root of a number using `math.sqrt()`:

```python
import math
print(math.sqrt(2.3))  # Output: 1.51657508881031
```

## Complex Numbers

Python supports complex numbers out of the box. They are written by appending a `j` or `J` to specify the imaginary part:

```python
print((3 + 4j) + (2 - 3j))  # Output: 5 + j
print((3 + 4j) - (2 - 3j))  # Output: 1 + 7j
print((3 + 4j) * (2 - 3j))  # Output: 18 - 1j
print((3 + 4j) / (2 - 3j))  # Output: -0.46153846153846156 + 1.3076923076923077j
```

Note that standard functions in the `math` library only accept real numbers. To perform operations on complex numbers, use the `cmath` (complex math) library:

```python
import cmath
print(cmath.sqrt(2+3j))  # Output: (1.6741492280355401+0.8959774761298381j)
```

## Booleans

Booleans represent truth values: `True` and `False`. Under the hood, Python treats booleans as a subclass of integers, where `True` is equivalent to `1` and `False` is equivalent to `0`.

### Data Comparison

Comparing values returns a boolean result. The standard comparison operators are:

These include: greater than (`>`), less than (`<`), greater than or equal to (`>=`), less than or equal to (`<=`), equal to (`==`), and not equal to (`!=`).

```python
print(5 > 3)    # Output: True
print(2 < 8)    # Output: True
print(7 >= 7)   # Output: True
print(4 <= 10)  # Output: True
print(6 == 6)   # Output: True
print(5 != 5)   # Output: False
```

A common beginner mistake is using a single equals sign (`=`) for comparison instead of a double equals sign (`==`). Fortunately, Python's parser will flag this as a syntax error.

These operators also work on non-numeric types like strings, lists, and tuples, where comparison follows lexicographical (dictionary) order.

For example, `"apple" < "banana"` is `True`. String comparisons are case-sensitive and based on ASCII/Unicode character values, where uppercase letters have lower values than lowercase letters. Thus, `"apple" < "Banana"` is `False` (because ASCII `'a'` is `97` while `'B'` is `66`).

While Python automatically handles comparisons between mixed numeric types (like comparing an integer to a float), you cannot compare incompatible types (such as an integer and a string) without casting.

### Chained Comparisons

Python allows you to chain comparison operators to write intuitive range checks. For example, instead of writing `x > 1 and x < 2`, you can write `1 < x < 2`. Python evaluates chained comparisons from left to right: if the first comparison fails, the expression immediately returns `False` without evaluating the rest (short-circuiting).

You can chain any comparison operators together (e.g., `a < b <= c == d`):

```python
x = 21
y = 25

print(20 < x < y < 30)   # Output: True
```

Although some other operators can also be used in chained comparisons, doing so often reduces code readability and is therefore not recommended.

### Floating-Point Equality

As mentioned earlier, due to binary representation, floats can suffer from rounding errors. Comparing them directly using `==` is risky. To safely compare two floats for equality, verify whether their absolute difference is less than a tiny tolerance value (typically called epsilon):

```python
epsilon=1e-9

x = 0.1 + 0.2
y = 0.3

print(x == y)                # Output: False
print(abs(x - y) < epsilon)  # Output: True
```

In the example above, `abs()` is a built-in function that returns the absolute value of the input data. The logic of the comparison is: if the difference between `x` and `y` is less than `epsilon`, they are considered "equal." Choosing an appropriate epsilon value is important. For most applications, `1e-9` or `1e-12` is usually sufficient.

For convenience, Python's `math` module provides a built-in function, `math.isclose()`, designed specifically for this purpose:

```python
import math
print(math.isclose(0.1 + 0.2, 0.3)) # Output: True
```

### Comparing Special Values

In IEEE 754 arithmetic, `nan` represents an undefined numerical result. Comparing `nan` with any value (even itself) using `==` always yields `False`. Any math operation involving `nan` returns `nan`. To check if a variable is `nan`, use `math.isnan()`:

```python
positive_infinity = float("inf")
negative_infinity = float("-inf")
not_a_number = float("nan")

print(positive_infinity == positive_infinity)         # Output: True
print(positive_infinity == positive_infinity + 100)   # Output: True
print(not_a_number == not_a_number)                   # Output: False
```

### Comparing Variable References

While `==` compares the *values* of two objects (e.g., `a == b`), you sometimes need to check if two variables point to the *exact same object in memory*.

The built-in `id()` function returns the unique memory address of an object. If two variables share the same ID, they reference the same object:

```python
a = None
b = [1,2]
c = [1,2]

print(id(None))  # Output: the address of the None data object
print(id(a))     # Output: same address as the previous line
print(id(b))     # Output: a different address
print(id(c))     # Output: yet another different address
```

The output of the program above may differ each time it runs, because the program may place data at different memory addresses on each run.

Instead of comparing IDs manually, you should use the `is` operator. The expression `x is y` is a faster and cleaner equivalent to `id(x) == id(y)`. Its negation is `is not`:

```python
x = [1,2]    
y = [1,2]    
z = x

print(x == y)       # Output: True   indicates x and y have equal values
print(x is y)       # Output: False  indicates x and y point to different objects
print(x is z)       # Output: True   indicates x and z point to the same object
print(x is not y)   # Output: True   indicates x and y point to different objects
```

If `x is y` is `True`, then `x == y` is typically `True` as well (with the exception of `nan` objects, where `nan is nan` is `True` but `nan == nan` is `False`):

```python
not_a_number = float("nan")

print(not_a_number == not_a_number)       # Output: False, as specified by the IEEE 754 standard
print(not_a_number is not_a_number)       # Output: True

# The following line outputs True, but only because lists perform an optimization during comparison:
# if two elements point to the same object in memory (same id), they are considered equal directly
# without performing a value comparison.
print([not_a_number] == [not_a_number])   # Output: True
```

Certain objects in Python are singletons (only one instance exists in memory globally). The most famous is `None` (representing the absence of a value). Because there is only one `None` object, you should always check for it using `is None` or `is not None` instead of `== None`.

For performance reasons, Python reuses small immutable values (like short strings or small integers) behind the scenes. This optimization (called caching or interning) means independent variables with identical values might share the same memory address:

```python
x = "Pythora 星球"
y = "Pythora" + " " + "星球"

print(x is y)   # Returns True in most cases
```

However, this caching behavior is an internal implementation detail and is not guaranteed for all values. Therefore, never rely on `is` to check for value equality; always use `==`.

For mutable data types, Python generally allocates separate memory spaces for separate data objects to prevent changes to one from affecting the other. Occasionally, when a previous data object can be removed from memory, Python may reuse that memory space, potentially causing two mutable data objects to share the same memory space.

### Logical Operations

Logical operations evaluate conditions using boolean logic. They are commonly used to control program flow inside `if` statements and loops.

Here are the three basic boolean operators in Python:
* `and` operator: The result is `True` only when both operands are `True`.
* `or` operator: The result is `True` if at least one of the operands is `True`.
* `not` operator: Used to negate a boolean value.

For example:
```python
print(True and True)   # Result: True
print(True and False)  # Result: False
print(True or False)   # Result: True
print(False or False)  # Result: False
print(not True)        # Result: False
print(not False)       # Result: True
```

#### Booleans as Numbers

Because booleans are a subclass of integers, performing math on them coerces `True` to `1` and `False` to `0`:

```python
print(True + 1)       # Result: 2
print(False + 1)      # Result: 1
print(True - False)   # Result: 1
```

#### Other Data Types as Booleans

In Python, values of other data types can be evaluated as booleans. Values representing emptiness or zero are considered **falsy** (evaluate to `False`). These include `False`, `None`, `0`, `0.0`, empty strings `""`, empty lists `[]`, and empty dictionaries `{}`. All other values are **truthy** (evaluate to `True`):

```python
print(not "")     # Output: True
print(not "abc")  # Output: False
print(not 0)      # Output: True
print(not 3)      # Output: False
```

Python's `and` and `or` operators use short-circuit evaluation and return the actual operand value rather than a strict boolean:
* `and`: returns the first falsy value, or the last value if all are truthy.
* `or`: returns the first truthy value, or the last value if all are falsy.

For example:

```python
print(1 or 0)      # Output: 1
print(2 and 0)     # Output: 0
print(0 or [])     # Output: []
print(2 and [])    # Output: []
```

Note operator precedence: comparison operators like `is not` have higher precedence than the logical `not` operator. Use parentheses to prevent issues:

```python
print(False is not None)     # Output: True
print(False is (not None))   # Output: False
```

## Compound Assignment Operators

Compound assignment operators combine an arithmetic operation with assignment. For example, `a += 2` is shorthand for `a = a + 2`:

```python
a = 5
a += 2    # Equivalent to a = a + 2
print(a)  # Output: 7
```

Commonly used compound assignment operators in Python include:
- `+=` : Addition assignment
- `-=` : Subtraction assignment
- `*=` : Multiplication assignment
- `/=` : Division assignment
- `%=` : Modulo assignment (remainder of division)
- `//=` : Floor division assignment (quotient of division, ignoring remainder)
- `**=` : Exponentiation assignment
- `&=` : Bitwise AND assignment
- `|=` : Bitwise OR assignment
- `^=` : Bitwise XOR assignment
- `<<=` : Left shift assignment
- `>>=` : Right shift assignment

Unlike languages like C/C++ or Java, Python does not support unary increment or decrement operators like `i++` or `--i`. You must use `i += 1` or `i -= 1`. (Note that writing `++i` is syntactically valid in Python, but it acts as two unary positive signs and has no effect on the value of `i`).

## Exercises
- Calculate the area and circumference of a circle with radius r.
- Write a program to convert an input temperature in Fahrenheit to Celsius.
