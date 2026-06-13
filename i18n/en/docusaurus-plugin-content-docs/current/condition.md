# Conditional Statements

Conditional statements control program flow based on specific conditions, implementing decision logic.

## if else Statements

The `if-else` structure is the fundamental conditional block in programming. It executes different code branches based on one or more boolean conditions.

### if-only Structure

The simplest conditional check is an `if`-only statement. If the condition evaluates to `True`, the indented block immediately following it executes:

```python
if condition:
    # If condition is True, execute the code here
```

Unlike languages like C/C++ or Java, Python does not require parentheses around the condition or curly braces around the block. Instead, it uses a colon (`:`) to end the condition and whitespace indentation to define the code block. All statements inside the block must share the same indentation level:

```python
x = 5
if x > 0:
    print("Condition met")  # Executed when x > 0
    print("x is positive")   # These two lines have the same indentation, belonging to the same code block
```

### Structure with else

To run alternative logic when the condition is `False`, pair `if` with an `else` block:

```python
if condition:
    # If condition is True, execute the code here
else:
    # If condition is False, execute the code here
```

For example:

```python
x = -5
if x > 0:
    print("x is positive")
else:
    print("x is non-positive")
```

Note that Python blocks cannot be empty. If you comment out all statements inside a block during debugging, Python raises an `IndentationError`. To define an empty block that does nothing, use the `pass` keyword as a placeholder:

```python
x = -5
if x > 0:
    pass
    # print("x is positive")  Temporarily not executed
else:
    print("x is non-positive")
```

### Structure with elif

To check multiple sequential conditions, you can nest `if-else` statements:

```python
x = 0
if x > 0:
    print("x is positive")
else: 
    if x < 0:
        print("x is negative")
    else:
        print("x is zero")
```

Nesting `if-else` blocks repeatedly creates deep indentation levels that hurt readability. You can flatten this structure using the `elif` (else-if) keyword:

```python
if condition1:
    # If condition1 is True, execute the code here
elif condition2:
    # If condition1 is False and condition2 is True, execute the code here
else:
    # If all the above conditions are False, execute the code here
```

For example:

```python
x = 0
if x > 0:
    print("x is positive")
elif x < 0:
    print("x is negative")
else:
    print("x is zero")
```

### Multiple Conditions

You can evaluate complex logic by combining multiple conditions with logical operators (`and`, `or`, `not`) instead of nesting `if` blocks. For example:

```python
age = 25
if age >= 18 and age <= 35:
    print("People in this age group are young adults")

# Recommended Pythonic way: chained comparison
if 18 <= age <= 35:
    print("People in this age group are young adults")
```

## Conditional Expressions

A conditional expression (often called a ternary operator) evaluates a condition and returns one of two values in a single line. The syntax is:

```python
value_if_true if condition else value_if_false
```

If `condition` is truthy, it returns `value_if_true`; otherwise, it returns `value_if_false`.

Let's look at a few examples:

```python
# Determine if a number is positive or negative
num = 10
label = "negative" if num < 0 else "non-negative"
print(label)  # Output: non-negative

# Find the larger of two numbers
a, b = 5, 8
max_value = a if a > b else b
print(max_value)  # Output: 8

# Determine if someone is an adult based on age
age = 20
status = "adult" if age >= 18 else "minor"
print(status)  # Output: adult
```

This provides a concise way to assign variables or return values conditionally.

Because standard `if` statements are *statements* rather than *expressions*, they cannot be nested inside other expressions (like function arguments or list assignments). Conditional expressions, however, evaluate to a value and can be used anywhere a value is expected, such as inside a [list comprehension](comprehension#list-comprehensions).

While useful for simple logic, avoid chaining or nesting ternary expressions, as they can quickly become unreadable. Stick to standard `if-else` blocks for complex conditions.

## Pattern Matching

Structural Pattern Matching (introduced in Python 3.10) provides a `match-case` statement. It evaluates an expression against multiple patterns, serving as a powerful and highly readable alternative to long `if-elif-else` chains. The basic syntax is:

```python
match expression:
    case pattern1:
        # do something
    case pattern2:
        # do something else
    ...
    case patternN:
        # do something else
    case _:
        # default case, similar to 'else'
```

### Matching Variable Values

The simplest case matches literal values, behaving like `switch-case` statements in other languages:

```python
x = 5
match x:
    case 10:
        print("x is 10")
    case 20:
        print("x is 20")
    case _:
        print("x is something else")
```

You can combine multiple literals in a single case using the `|` (OR) operator:

```python
color = "green"
match color:
    case "red" | "green" | "blue":
        print("RGB color")
    case _:
        print("Unknown color")
```

Here, the vertical bar `|` represents "Or", meaning any one of the values will match.

You can match lists based on their structure and unpack their elements simultaneously:

```python
match some_list:
    case []:
        print("Empty list")
    case [a]:
        print(f"Only one element: {a}")
    case [a, b]:
        print(f"Two elements: {a} and {b}")
    case [a, b, *rest, c]:
        print(f"First two elements: {a} and {b}, last element: {c}")
```

### Matching Series Data

You can match and unpack sequences (like tuples) based on structural rules:

```python
point = (2, 3)
match point:
    case (0, 0):
        print("Origin")
    case (0, y):
        print(f"Data is on the Y axis: {y}")
    case (x, 0):
        print(f"Data is on the X axis: {x}")
    case (x, y):
        print(f"Data is at a point off the axes: ({x}, {y})")
    case _:
        print("Invalid data")
```

### Matching Data Types

You can match objects based on their data types and bind the matched value to a variable:

```python
value = "Hello, world!"
match value:
    case int():
        print("Input is an integer")
    case str() as s:
        print(f"Input is a string, length: {len(s)}")
    case _:
        print("Input is not an integer or string")
```

## Selection Without if else

It is possible to implement conditional selection without using `if` or `match`. For example, you can index into a tuple using a boolean condition:

```python
(a, b)[x]
```

Since Python treats `False` as `0` and `True` as `1`, passing a comparison as an index selects the first element when the condition is `False`, and the second element when it is `True`.

For example:

```python
# Determine if a number is positive or negative
num = 10
label = ("non-negative", "negative")[num < 0]
print(label)      # Output: non-negative

# Find the larger of two numbers
a, b = 5, 8
max_value = (b, a)[a > b]
print(max_value)  # Output: 8

# Determine if someone is an adult based on age
age = 20
status = ("minor", "adult")[age >= 18]
print(status)     # Output: adult
```

If the index is an integer or an [enumeration data type](iterator#enumerations), this approach can also replace simple pattern matching statements, for example:

```python
red, green, blue = 0, 1, 2

color = green
print(("red", "green", "blue")[color])
```

Warning: This trick has a severe drawback: **eager evaluation**. Unlike `if-else` or ternary expressions (which only evaluate the matching branch), a tuple evaluates all its elements *immediately* upon creation. This means both options (including any function calls) run regardless of the condition.

Consider the following example:

```python
def action_a():
    print("A was executed")
    return "A"
def action_b():
    print("B was executed")
    return "B"

condition = True
```

Using a conditional expression (recommended): only `action_b` is executed

```python
result = action_b() if condition else action_a()

# Output: B was executed
```

Using tuple indexing (not recommended): both A and B are executed!

```python
result = (action_a(), action_b())[condition]

# Output:
# A was executed
# B was executed
```

Because of this overhead and potential side effects, avoid using tuple indexing for control flow unless dealing with simple, static constants.

## Exercises

1. Calculate Income Tax

A certain country levies personal income tax based on citizens' income. The tax is calculated as follows: if the income is less than or equal to 100,000 yuan, the tax is 10% of the income; if the income is greater than 100,000 yuan but less than 500,000 yuan, the portion below 100,000 yuan is taxed at 10%, and the portion above 100,000 yuan is taxed at 15%; if the income is greater than 500,000 yuan, the portion above 500,000 yuan is taxed at 20%. Write a program that takes a person's income as input and calculates and prints the tax payable.

2. Sort Three Numbers

Write a function using basic conditional statements that takes three real numbers as input and prints them in ascending order.

3. Determine Triangle Sides

Input three positive numbers and determine whether they can form the three sides of a triangle (the sum of any two sides must be greater than the third side).
