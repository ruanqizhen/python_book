# First-Class Citizens

In Python, functions are **first-class citizens**, meaning they hold the same status as any other object (like integers, floats, or strings). This status is reflected in the fact that functions can be assigned to variables, stored in data structures, passed as arguments to other functions, or returned as values from other functions. This feature provides great flexibility and dynamism, especially in higher-order functional programming. After we introduce the concept of [object-oriented programming](oop), we will further discuss this ["first-class citizen" nature of functions](objects#function-objects).

## Functions as Arguments

We previously introduced the built-in [help()](function#function-documentation) function, which returns the docstring documentation of a function. The `help()` function accepts a function object as its argument; for example, `help(print)` prints the documentation for the `print()` function.

We can also define our own functions that take other functions as arguments:

```python
def add(x, y):
    return x + y

def subtract(x, y):
    return x - y

def multiply(x, y):
    return x * y

def operate(func, x, y):
    return func(x, y)

# Use operate with add to calculate 3 + 5
result1 = operate(add, 3, 5)
print(result1)  # Output: 8

# Use operate with subtract to calculate 9 - 4
result2 = operate(subtract, 9, 4)
print(result2)  # Output: 5

# Use operate with multiply to calculate 3 * 7
result3 = operate(multiply, 3, 7)
print(result3)  # Output: 21
```

In this code, `add`, `subtract`, and `multiply` are simple functions. The `operate` function is a higher-order function because it accepts a function `func` as its first parameter. When we call `operate(add, 3, 5)`, the function executes `add(3, 5)` and returns the result.

This pattern allows you to write modular and reusable code. You can switch operations or execution strategies dynamically at runtime without changing the internal code of the wrapper function.

In object-oriented programming, this kind of dynamic behavior is typically achieved through classes and polymorphism. In procedural programming, it requires conditional statements (`if` / `else`). In functional programming, it is achieved by passing functions as arguments.

## Functions as Return Values

Just as functions can be passed into other functions, they can also be returned as results from functions:

```python
def get_function(power):
    def raise_to_power(x):
        return x ** power
    return raise_to_power

square = get_function(2)
cube = get_function(3)

print(square(4))  # Output: 16
print(cube(4))    # Output: 64
```

In this example, `get_function` accepts a parameter `power` and returns the [nested function](function#nested-functions) `raise_to_power`. The returned function retains access to the `power` variable from its parent scope, allowing us to dynamically generate custom mathematical functions like `square` (raising to the power of 2) or `cube` (raising to the power of 3).

We can also dynamically return different functions based on runtime conditions:

```python
def math_operation(operator):
    def add(x, y):
        return x + y
    
    def subtract(x, y):
        return x - y

    if operator == '+':
        return add
    else:
        return subtract

operation = math_operation('+')  # Returns the add function
print(operation(5, 3))           # Output: 8

operation = math_operation('-')  # Returns the subtract function
print(operation(5, 3))           # Output: 2
```

## Closures

A **closure** is a nested function that retains access to variables from its enclosing lexical scope, even after the outer function has finished executing. For example:

```python
def outer_function(x):
    def inner_function(y):
        return x + y
    return inner_function

closure_instance = outer_function(10)
print(closure_instance(5))  # Output: 15
```

In this code, `outer_function` returns `inner_function`. When we run `closure_instance(5)`, `outer_function` has already finished running and its local scope should theoretically be gone. However, because `inner_function` references the variable `x` from the outer scope, Python keeps `x` alive in memory. The combination of the function and its captured environment is a closure.

### Late Binding in Closures

Closures can lead to subtle bugs, particularly when defined inside loops. Because Python closures capture variables by reference rather than by value (late binding), the inner functions look up the variable's value when they are called, not when they are defined.

Consider this example:

```python
def outer_function():
    functions = []
    for i in range(3):
        def func(x): 
            return x + i     # Captures i by reference
        functions.append(func)
    return functions

functions = outer_function()
print(functions[0](10))  
print(functions[1](10)) 
print(functions[2](10)) 
```

You might expect this to print `10`, `11`, and `12` (corresponding to $10+0$, $10+1$, and $10+2$). Instead, it prints `12`, `12`, and `12`. 

This happens because all three functions capture the same variable `i`. When the loop finishes, the value of `i` is `2`. When the functions are called later, they all resolve `i` to its final value of `2`.

To fix this, you must force the closure to capture the value of `i` immediately at definition time. The standard way to do this is by using a default parameter:

```python
def outer_function():
    functions = []
    for i in range(3):
        def func(x, i=i):  # Force immediate binding using a default value
            return x + i
        functions.append(func)
    return functions

functions = outer_function()
print(functions[0](10))  # Output: 10
print(functions[1](10))  # Output: 11
print(functions[2](10))  # Output: 12
```

Since default parameter values are evaluated only once when the function is defined, each nested function binds the current value of `i` as its default, yielding the correct outputs.

Closures are extremely useful for data [encapsulation](class#encapsulation) (hiding state from the global scope) and are the core mechanic behind [decorators](decorator).

## Currying

Currying is a functional programming technique where a function with multiple arguments is transformed into a chain of nested, single-argument functions. 

For a two-argument function $f(x, y)$, currying turns it into $g(x)(y)$, where $g(x)$ returns a function that takes $y$ and completes the operation:

```python
# A curried addition function
def curried_add(x):
    def add_y(y):
        return x + y
    return add_y

# Evaluating 3 + 4
print(curried_add(3)(4))  # Output: 7

# Generating a specialized function
add_five = curried_add(5)
print(add_five(10))       # Output: 15
```

Currying is useful in advanced functional programming for composing functions and creating reusable utility wrappers.

## Partial Functions

A partial function is a practical application of currying. It allows you to freeze one or more arguments of a function, returning a new, simplified function that accepts only the remaining arguments.

This is helpful when you need to adapt a multi-argument function to an API that expects a function with fewer arguments.

Python provides `functools.partial` in the standard library to create partial functions:

```python
from functools import partial

def multiply(x, y):
    return x * y

# Create a new function with y locked to 2
double = partial(multiply, y=2)

print(double(4))  # Output: 8
print(double(7))  # Output: 14
```

## Anonymous Functions (Lambda Expressions)

Anonymous functions are functions defined without a name. In Python, these are created using the `lambda` keyword and are often called **lambda functions** or **lambda expressions**. The name originates from [Lambda Calculus](https://lv.qizhen.xyz/appendix_languages#lambda-calculus-编程语言), the mathematical foundation of functional programming.

### Basic Syntax

The syntax for a lambda expression is:

```python
lambda arguments: expression
```

A lambda function can take any number of arguments but can only contain a single expression (no multi-line statements or assignments). The expression is automatically returned when the function runs.

For example, a function that adds two numbers:

```python
lambda x, y: x + y
```

You can execute a lambda immediately by wrapping it in parentheses and calling it:

```python
print((lambda x, y: x + y)(2, 3))  # Output: 5
```

Typically, lambda functions are passed directly as arguments to higher-order functions or assigned to variables:

```python
f = lambda x, y: x + y
print(f(2, 3))  # Output: 5
```

Writing `f = lambda x, y: x + y` is functionally identical to defining the function using the standard `def` syntax:

```python
def f(x, y):
    return x + y
```

The key differences between `lambda` and `def` are:
* **Purpose**: Lambdas are meant for simple, "throwaway" functions that are used only once (e.g., as key functions for sorting).
* **Metadata**: Functions created with `def` carry their own name in their [`__name__` attribute](module#execution-on-import), which appears in trackbacks and debugging outputs. Lambda functions always return `<lambda>` as their name, which can make debugging stack traces slightly harder.

### Nested Lambdas

Because lambdas are first-class functions, they can be nested to create closures or return new functions:

```python
h = lambda a, b: (lambda x: a(x) + b(x))
combined = h(lambda x: x * 2, lambda x: x * 3)

print(combined(4))  # Output: (4*2) + (4*3) = 20
```

Here, `h` takes two functions, `a` and `b`. It returns an anonymous function that takes `x` and evaluates `a(x) + b(x)`. Like standard nested functions, nested lambdas fully support lexical closures.

### Simplifying Code

Using anonymous functions can compress verbose conditional return structures into highly concise code:

```python
# Procedural style:
def math_operation(operator):
    def add(x, y):
        return x + y
    def subtract(x, y):
        return x - y

    if operator == '+':
        return add
    else:
        return subtract

# Functional style using lambdas and tuple lookup:
math_operation = lambda op: (lambda x, y: x - y, lambda x, y: x + y)[op == '+']

print(math_operation('+')(5, 3))  # Output: 8
print(math_operation('-')(5, 3))  # Output: 2
```

## Exercises

Write **anonymous functions (lambdas)** to implement the following:

1. **Square calculation**: Calculate the square of a given number. For example, input 4, output 16.
2. **Even number check**: Determine whether a number is even. Input a number, return `True` or `False`.
3. **Multi-parameter operation**: Accept two arguments `x` and `y`, return the result of $(x + y)^2$.
4. **Chained function**: Implement a chained function ($x \rightarrow x^2 \rightarrow x+1 \rightarrow x/2$). Input `x=4`, output should be `8.5`.
5. **Callback wrapper**: Write a function `apply_func(func, x, y)` that accepts a function `func` and two numbers `x` and `y`, and returns the result of `func(x, y)`. E.g., `apply_func(lambda a, b: a + b, 3, 5)` returns `8`.
6. **Multiplier factory**: Write a function `make_multiplier(n)` that returns a function that multiplies its input by `n`.
7. **N-times execution**: Write a higher-order function `apply_n_times(func, x, n)` that accepts a function `func`, a starting value `x`, and a count `n`, and returns the result of applying `func` to `x` iteratively `n` times. E.g., `apply_n_times(lambda x: x * 2, 2, 3)` should return `8`.
8. **Operator dispatcher**: Write a function `choose_func(op)` that returns different math functions based on the string argument `op` (e.g., `"add"` returns an addition function).
