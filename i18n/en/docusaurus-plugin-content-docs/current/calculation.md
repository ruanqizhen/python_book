# Basic Mathematical Operations

The people of Pythora often use Python as a calculator, especially when dealing with large amounts of data — it is even more convenient than an ordinary calculator. Python supports not only basic arithmetic operations such as addition, subtraction, multiplication, and division, but also more complex mathematical operations like exponentiation, modulo, and integer division.

## Integers

### Basic Arithmetic

Python's integer operations are largely consistent with mathematical expressions. For instance, the simplest addition and subtraction:

```python
print(3 + 2) # Output: 5
print(5 - 2) # Output: 3
```

Like most languages, Python uses the asterisk `*` to represent multiplication and the slash `/` to represent division. In Python 2, integer division with `/` still returned an integer result; however, in the current mainstream version, Python 3, the `/` operation on integers returns a floating-point number (for example, `8 / 2` returns `4.0`). Python 3 uses a double slash `//` for floor division, the percent sign `%` for the modulo (remainder) operation, and a double asterisk `**` for exponentiation:

```python
print(4 * 3) # Output: 12
print(8 / 3) # Output: 2.666...

print(8 // 3) # Output: 2
print(8 % 3)  # Output: 2
print(2 ** 4) # Output: 16
```

In addition to representing addition and subtraction, `+` and `-` are also used to indicate positive and negative numbers, such as `+2`, `-5`, etc. The unary sign operators have higher precedence than other arithmetic operators. So, what do you think will happen when the following program runs?

```python
print(2*-5)
print(1+++2)
print(1+-+-+-+-+2)
```

### Number Bases

Python allows you to represent integers in different number bases. The most common representation, decimal, has no special prefix — for example, `42`.

Binary integers use the `0b` or `0B` prefix. For example, `0b101010` represents the decimal value 42.

Octal integers use the `0o` or `0O` prefix. For example, `0o52` represents the decimal value 42.

Hexadecimal integers use the `0x` prefix. For example, `0x2A` or `0x2a` represents the decimal value 42.

Using Python's built-in functions, you can convert an integer into a string representation in a different base:

* `bin(x)`: Converts integer x to a binary string.
* `oct(x)`: Converts integer x to an octal string.
* `hex(x)`: Converts integer x to a hexadecimal string.
* `int(string, base)`: Converts a string to an integer. If the string has a prefix like `0b` or `0x`, you can set `base` to `0`, and Python will automatically detect the base.

For example:

```python
x = 42
print(bin(x))  # Output: '0b101010'
print(oct(x))  # Output: '0o52'
print(hex(x))  # Output: '0x2a'

y = '0b101010'
print(int(y, 2))  # Output: 42, automatically recognizes binary
```

The `int()` function can also be used to convert other data types into integers.

## Floats

### Basic Arithmetic

Floating-point numbers are what we commonly refer to as decimals or real numbers. Their arithmetic is similar to that of integers, but the results may include fractional parts. For example:

```python
print(3.0 + 2.5)  # Output: 5.5
print(5.5 - 2.5)  # Output: 3.0
print(4.0 * 3.0)  # Output: 12.0
print(8.0 / 3.0)  # Output: 2.666...
```

### Notation
Floating-point numbers can be very large or contain many decimal places. For readability, programs may use different representations. The most conventional notation is to use a decimal point directly — for example: 3.14, 0.001, 4.0, etc.
Another commonly used notation is scientific notation, using `e` or `E` to indicate a power of 10. For example: `2.5e2` represents $2.5 \times 10^2 = 250.0$, and `1.23E-3` represents $1.23 \times 10^{-3} = 0.00123$.

### Special Values

Python's floating-point numbers have several special values: `inf`, `-inf`, and `nan`, representing positive infinity, negative infinity, and "Not a Number", respectively. These special values exist to comply with the IEEE 754 floating-point standard.

The arithmetic rules for these special values are as follows:

inf + any positive number = inf
inf - any positive number = inf
-inf + any negative number = -inf
-inf - any negative number = -inf
inf + -inf = nan (positive infinity plus negative infinity is undefined, so the result is nan)
inf * 0 = nan (infinity multiplied by 0 is undefined)

Consider the following program:

```python
positive_infinity = float("inf")
negative_infinity = float("-inf")
print(positive_infinity + negative_infinity)  # Output: nan
```

In the program above, `float()` is a function used to convert a string or other numeric value into a floating-point number. For example:

```python
print(float(7))       # Output: 7.0
print(float("3.14"))  # Output: 3.14
```

### Rounding Errors

Floating-point calculations can lead to rounding errors. This is because computers use a binary floating-point representation internally, and some decimal fractions cannot be represented exactly as binary fractions. For example:

```python
print(0.1 + 0.2)  # Output: 0.30000000000000004 instead of 0.3
```

Because of these rounding errors, care must be taken when testing floating-point numbers for equality. It is generally recommended to use a very small tolerance value instead of directly comparing two floats for exact equality.

## Advanced Mathematical Operations

Beyond basic arithmetic, Python provides many built-in functions for numerical computation, such as `abs()`, `round()`, `max()`, `min()`, `sum()`, and others. These functions are intuitive and their names are consistent with conventional mathematical operations, making their purpose easy to understand. For example:

```python
print(abs(-5))      # Output: 5, absolute value
print(round(2.6))   # Output: 3
print(round(2.5))   # Output: 2, note: Python 3 uses "banker's rounding," where .5 rounds to the nearest even number
print(round(3.5))   # Output: 4
```

Python also supports complex numbers and more advanced mathematical functions, making it a powerful tool for solving mathematical problems. Python is especially popular in fields like scientific computing and data analysis, in part because of its flexibility and robust mathematical capabilities. Most of Python's advanced mathematical functions are included in the built-in `math` and `statistics` standard libraries, which will be introduced in detail later. For now, here is a simple example — calculating the square root of `2.3` using the `math.sqrt()` function:

```python
import math
print(math.sqrt(2.3))  # Output: 1.51657508881031
```

## Complex Numbers

Complex numbers consist of a real part and an imaginary part, with the imaginary part typically followed by a `j` or `J`. For example:

```python
print((3 + 4j) + (2 - 3j))  # Output: 5 + j
print((3 + 4j) - (2 - 3j))  # Output: 1 + 7j
print((3 + 4j) * (2 - 3j))  # Output: 18 - 1j
print((3 + 4j) / (2 - 3j))  # Output: -0.46153846153846156 + 1.3076923076923077j
```

The functions in the built-in `math` standard library are designed for real numbers and cannot be used with complex numbers. For complex number operations, you can call the corresponding functions in the built-in `cmath` library. For example, computing the square root of `2 + 3j`:

```python
import cmath
print(cmath.sqrt(2+3j))  # Output: (1.6741492280355401+0.8959774761298381j)
```

## Booleans

Boolean values have only two possibilities: `True` and `False`. They are actually a subtype of integers, where `True` is equivalent to `1` and `False` is equivalent to `0`.

### Data Comparison

In Python, operations that compare the magnitude or equality of values return a boolean result. Here are the commonly used comparison operators:

The greater-than operator `>` checks if the value on the left is greater than the value on the right; the less-than operator `<` checks if the value on the left is less than the value on the right; the greater-than-or-equal-to operator `>=` checks if the value on the left is greater than or equal to the value on the right; the less-than-or-equal-to operator `<=` checks if the value on the left is less than or equal to the value on the right; the equality operator `==` checks whether two values are equal; the inequality operator `!=` checks whether two values are not equal. Here are some examples:

```python
print(5 > 3)    # Output: True
print(2 < 8)    # Output: True
print(7 >= 7)   # Output: True
print(4 <= 10)  # Output: True
print(6 == 6)   # Output: True
print(5 != 5)   # Output: False
```

One of the most common mistakes when programming is to use a single equals sign `=` (assignment) instead of a double equals sign `==` (equality check) when comparing two numbers. Fortunately, Python typically reports such errors, unlike some languages that would silently continue executing incorrect code.

These comparison operators can be used not only with numeric types (integers, floats, etc.) but also with other comparable data types, such as strings, lists, and other sequences. When comparing non-numeric types, Python generally uses lexicographic order (also known as dictionary order) to determine the ordering.

For example, when comparing strings, the result of `"apple" < "banana"` is `True`. It is important to note that string comparison is based on character encoding (Unicode/ASCII), and uppercase letters always have a smaller encoding value than lowercase letters. Therefore, the result of `"apple" < "Banana"` is `False` (because the encoding of `'a'` is greater than that of `'B'`).

It is also worth noting that when performing numeric comparisons, you should ensure that the values being compared are of the same type or are directly comparable. Although Python can usually automatically convert between different numeric types (for example, between integers and floats), in some cases direct comparison may lead to unexpected results.

### Chained Comparisons

Sometimes we can use a very intuitive way to compare multiple conditions — chained comparisons. For example, if we need to check that `x > 1` and `x < 2`, we can write it directly as `1 < x < 2`. The way chained comparisons work is that Python evaluates each comparison operation from left to right in sequence. For `1 < x < 2`, it first checks whether `1 < x` is true. If it is, it then checks whether `x < 2` is true. The entire expression returns true only when both conditions are true. If any condition fails, the whole expression immediately returns false.

We can use any comparison operator — greater than (`>`), less than or equal to (`<=`), greater than or equal to (`>=`), etc. — to build similar chained comparisons. This approach is not limited to just two conditions; for example, `a < b < c < d` is perfectly valid. It checks whether `b` is greater than `a` and less than `c`, and whether `c` is less than `d`. For instance:

```python
x = 21
y = 25

print(20 < x < y < 30)   # Output: True
```

Although some other operators can also be used in chained comparisons, doing so often reduces code readability and is therefore not recommended.

### Floating-Point Equality

Due to the representation and computation of floating-point numbers, tiny rounding errors can occur. Using the equality operator `==` directly to check whether two floats are equal may yield unexpected results. For example, the result of `0.1 + 0.2` is not exactly equal to `0.3` because of a small floating-point rounding error.

To accurately determine whether two floating-point numbers are "equal," a common approach is to check whether the difference between them is smaller than a very small value (often called a "tolerance" or "epsilon").

Here is a simple example demonstrating how to use this approach to check whether two floats are equal:

```python
epsilon=1e-9

x = 0.1 + 0.2
y = 0.3

print(x == y)                # Output: False
print(abs(x - y) < epsilon)  # Output: True
```

In the example above, `abs()` is a built-in function that returns the absolute value of the input data. The logic of the comparison is: if the difference between `x` and `y` is less than `epsilon`, they are considered "equal." Choosing an appropriate epsilon value is important. For most applications, `1e-9` or `1e-12` is usually sufficient.

In fact, Python's `math` library already provides an optimal tool for handling floating-point equality comparisons:

```python
import math
print(math.isclose(0.1 + 0.2, 0.3)) # Output: True
```

### Comparing Special Values

Comparing `nan` with any value (including itself) returns `False`.
Any arithmetic operation between `nan` and any number returns `nan`.
Comparing two `nan` values using `==` returns `False`, but you can use the `math.isnan()` function to check whether a value is `nan`.

```python
positive_infinity = float("inf")
negative_infinity = float("-inf")
not_a_number = float("nan")

print(positive_infinity == positive_infinity)         # Output: True
print(positive_infinity == positive_infinity + 100)   # Output: True
print(not_a_number == not_a_number)                   # Output: False
```

### Comparing Variable References

The comparisons discussed above are all about comparing data values. For example, with `a = 5; b = 5`, we will certainly have `a == b` being `True`. However, as introduced earlier, [different variables can point to the same data](variable#the-variability-of-variables). So how do we determine whether two variables point to the same data object or to different objects with equal values?

First, we can use the `id()` function to obtain the memory address of a data object. If the memory addresses are the same, they point to the same object:

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

We can also use the `is` operator to directly check whether two variables reference the same object in memory — that is, whether the two data addresses are the same. This is different from the `==` operator, which compares whether the values of two data objects are equal. `x is y` is equivalent to `id(x) == id(y)`. Similarly, `is not` can be used to confirm that two variables do not reside at the same memory address. For example:

```python
x = [1,2]    
y = [1,2]    
z = x

print(x == y)       # Output: True   indicates x and y have equal values
print(x is y)       # Output: False  indicates x and y point to different objects
print(x is z)       # Output: True   indicates x and z point to the same object
print(x is not y)   # Output: True   indicates x and y point to different objects
```

Generally speaking, if `x is y` is true, then `x == y` must also be true, but the converse is not necessarily true. There is one special case: `nan`. Because it is hard-coded that `nan == nan` returns `False`, even though the data may actually be the same object:

```python
not_a_number = float("nan")

print(not_a_number == not_a_number)       # Output: False, as specified by the IEEE 754 standard
print(not_a_number is not_a_number)       # Output: True

# The following line outputs True, but only because lists perform an optimization during comparison:
# if two elements point to the same object in memory (same id), they are considered equal directly
# without performing a value comparison.
print([not_a_number] == [not_a_number])   # Output: True
```

In Python, some data objects are guaranteed to have only one instance globally. For example, `None`, which is the sole instance of the `NoneType` type, is commonly used for initializing variables, representing a default state, or performing null checks. There is only one instance of `None` globally, so any variable whose value is `None` must point to this same instance. Therefore, when checking whether a variable is `None`, it is standard practice to use the `is` operator rather than `==`.

For immutable data types, Python typically optimizes code by reusing data objects where possible. Thus, even if two variables appear to define the same value independently, they will most likely point to the same object. For example:

```python
x = "Pythora 星球"
y = "Pythora" + " " + "星球"

print(x is y)   # Returns True in most cases
```

The code above returns `True` in most cases, but Python does not always manage to optimize to the fullest extent. In some situations, it may assign different memory addresses to two data objects with equal values. Therefore, when you need to compare whether two variables are equal, always use the `==` operator instead of `is`.

For mutable data types, Python generally allocates separate memory spaces for separate data objects to prevent changes to one from affecting the other. Occasionally, when a previous data object can be removed from memory, Python may reuse that memory space, potentially causing two mutable data objects to share the same memory space.

### Logical Operations

Boolean operations are logical operations based on the two values `True` and `False`. They are commonly used in comparisons and control flow statements such as `if`, `while`, and `for`.

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

In Python, when boolean values are used together with arithmetic operators like `+`, `-`, `*`, and `/`, `True` is automatically converted to `1` and `False` is automatically converted to `0`. For example:

```python
print(True + 1)       # Result: 2
print(False + 1)      # Result: 1
print(True - False)   # Result: 1
```

#### Other Data Types as Booleans

In logical operations, `False`, `None`, `0`, empty collections, empty sequences, etc., are considered falsy (`False`); all other values are considered truthy (`True`). For example:

```python
print(not "")     # Output: True
print(not "abc")  # Output: False
print(not 0)      # Output: True
print(not 3)      # Output: False
```

The `and` and `or` operators are slightly more nuanced:
* When evaluating `and`: if the first operand is falsy, return the first operand; otherwise, return the second operand.
* When evaluating `or`: if the first operand is truthy, return the first operand; otherwise, return the second operand.

For example:

```python
print(1 or 0)      # Output: 1
print(2 and 0)     # Output: 0
print(0 or [])     # Output: []
print(2 and [])    # Output: []
```

Pay attention to the precedence of the `not` operator. In many languages, `not` has the highest precedence, but in Python, `is not` has higher precedence than `not`. For example:

```python
print(False is not None)     # Output: True
print(False is (not None))   # Output: False
```

## Compound Assignment Operators

Compound assignment operators are a way to simplify assignment operations in Python, combining an assignment with another operation (such as addition, subtraction, multiplication, etc.). They are commonly used to make code more concise and readable. For example, the addition assignment operator is `+=`, which adds the value or variable on the right to the variable on the left and then assigns the result back to the variable on the left.

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

Some languages have unary operators for incrementing or decrementing variables, such as `i++`. However, Python does not support such operators; you must use `i += 1` to achieve the same effect. Note that writing `++i` in Python does not produce an error — it simply means `+(+i)` (positive of a positive), and it does not change the value of `i`.

## Exercises
- Calculate the area and circumference of a circle with radius r.
- Write a program to convert an input temperature in Fahrenheit to Celsius.
