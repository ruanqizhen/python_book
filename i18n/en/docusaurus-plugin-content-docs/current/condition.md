# Conditional Statements

Conditional statements are used to control the program execution flow based on conditions, and are one of the fundamental ways to implement decision logic.

## if else Statements

The if-else structure is the most common conditional structure in programming. It allows selecting and executing corresponding code blocks based on one or more conditions.

### if-only Structure

The simplest conditional structure is the `if`-only statement. If the condition is True, the indented code block under `if` is executed. Usage:

```python
if condition:
    # If condition is True, execute the code here
```

Unlike other programming languages such as C, Python's if-else structure does not require parentheses around the condition and code block. Instead, it uses a colon and indentation. The condition is followed by a colon, and the code block below is uniformly indented. For example:

```python
x = 5
if x > 0:
    print("Condition met")  # Executed when x > 0
    print("x is positive")   # These two lines have the same indentation, belonging to the same code block
```

### Structure with else

Sometimes, you need the program to execute another piece of code when the condition is not met. This requires using both `if` and `else`. Usage:

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

Note that the code blocks under `if` and `else` must not be empty. Sometimes while debugging, you might want to temporarily comment out the code block under the `if` branch, which would cause an error. If nothing needs to be executed, you can use the `pass` keyword, which is a placeholder statement that does nothing. For example:

```python
x = -5
if x > 0:
    pass
    # print("x is positive")  Temporarily not executed
else:
    print("x is non-positive")
```

### Structure with elif

Sometimes you need to check multiple conditions and execute the corresponding code block when one of them is met. We can achieve the desired functionality with nested `if` `else` statements, for example:

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

Such nested `if` `else` statements can lead to too many indentation levels, reducing readability. To address this, the `elif` keyword can be used to simplify the nested structure. Usage:

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

Sometimes, you need to do something only when multiple conditions are all satisfied. To avoid nested if else statements, we can first combine multiple conditions using logical operators (and, or, not), and then use the if else structure. For example:

```python
age = 25
if age >= 18 and age <= 35:
    print("People in this age group are young adults")

# Recommended Pythonic way: chained comparison
if 18 <= age <= 35:
    print("People in this age group are young adults")
```

## Conditional Expressions

Conditional expressions, also often called ternary operators or ternary expressions, require three input values: the selection condition, the value returned when the condition is true, and the value returned when the condition is false. Conditional expressions are a simplified form of if else statements, used for simple conditional evaluation in a single line. The basic format is:

```python
value_if_true if condition else value_if_false
```

When the condition is true, the result of the expression is value_if_true; when the condition is false, the result is value_if_false.

Let's dive deeper into the use of conditional expressions through several examples:

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

From the examples above, we can see that conditional expressions can evaluate a condition in a single line of code, which can make the code more concise.

A statement in Python is a complete sentence; it cannot become part of another statement or expression. An if statement cannot be placed inside another statement, but a conditional expression is an expression, not a statement, so it can be placed in locations where if else statements cannot. For example, conditional expressions can be placed inside [list comprehensions](comprehension#list-comprehension).

Although conditional expressions have their advantages, if the condition to be evaluated is too complex, it may make the code difficult to read. In such cases, using ordinary if else statements may be more readable.

## Pattern Matching

The "Structural Pattern Matching" statement, also known as the match statement, is a new feature introduced in Python 3.10. It matches input conditions against predefined patterns and executes the corresponding code block based on the match result. It can be seen as an enhanced version of the if elif else statement. Its basic syntax is as follows:

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

The simplest use of pattern matching is to match the value of a variable and then jump to the corresponding branch, similar to switch case statements in some other programming languages:

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

Similarly, logical operations can reduce the number of branches in a pattern matching structure:

```python
color = "green"
match color:
    case "red" | "green" | "blue":
        print("RGB color")
    case _:
        print("Unknown color")
```

Here, the vertical bar `|` represents "Or", meaning any one of the values will match.

When matching a list, you can use list unpacking to match the specific length and content of the list:

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

Pattern matching can match not only single data items but also a series of data, for example:

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

You can also match based on data types, which is very useful for type checking or type conversion.

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

Some programming languages do not have if else statements, yet they can still implement selection functionality. For example, tuple indexing can be used to achieve similar functionality. Here is a tuple with an index:

```python
(a, b)[x]
```

The tuple in the above code has two elements: a and b. When the index value x is False (which is 0), the entire expression returns the 0th element of the tuple, i.e., a; when the index value x is True (which is 1), the entire expression returns the 1st element of the tuple, i.e., b.

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

If the index is an integer or an [enumeration data type](iterator#enumeration), this approach can also replace simple pattern matching statements, for example:

```python
red, green, blue = 0, 1, 2

color = green
print(("red", "green", "blue")[color])
```

However, this writing style has a significant pitfall: eager evaluation. Unlike if-else or conditional expressions, when a tuple is created, all of its elements are evaluated immediately. This means that regardless of whether the condition is true or false, both pieces of data (or function calls) in the tuple will be executed.

Consider the following example:

```Python
def action_a():
    print("A was executed")
    return "A"
def action_b():
    print("B was executed")
    return "B"

condition = True
```

Using a conditional expression (recommended): only action_b is executed

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

Therefore, unless the elements in the tuple are simple constants (such as strings or numbers), it is strongly discouraged to use this technique in actual programming.

## Exercises

1. Calculate Income Tax

A certain country levies personal income tax based on citizens' income. The tax is calculated as follows: if the income is less than or equal to 100,000 yuan, the tax is 10% of the income; if the income is greater than 100,000 yuan but less than 500,000 yuan, the portion below 100,000 yuan is taxed at 10%, and the portion above 100,000 yuan is taxed at 15%; if the income is greater than 500,000 yuan, the portion above 500,000 yuan is taxed at 20%. Write a program that takes a person's income as input and calculates and prints the tax payable.

2. Sort Three Numbers

Write a function using basic conditional statements that takes three real numbers as input and prints them in ascending order.

3. Determine Triangle Sides

Input three positive numbers and determine whether they can form the three sides of a triangle (the sum of any two sides must be greater than the third side).
