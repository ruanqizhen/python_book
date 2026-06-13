# First-Class Citizens

In Python, functions are first-class citizens, meaning they hold a very high status. This status is reflected in the fact that functions can be passed as arguments, returned as values, assigned to variables, or stored in data structures. This feature provides great flexibility and dynamism, especially in higher-order functional programming. After we introduce the concept of [object-oriented programming](oop), we will further discuss this ["first-class citizen" nature](objects#函数对象).

## Functions as Arguments

We previously introduced a function called [help()](function#函数文档), which can return the documentation for a function. The `help()` function accepts a function as its argument, for example, `help(print)` prints the help documentation for the `print()` function.

We can also define our own function that takes other functions as arguments:

```python
def add(x, y):
    return x + y

def subtract(x, y):
    return x - y

def multiply(x, y):
    return x * y

def operate(func, x, y):
    return func(x, y)

# Use the operate function and the add function to calculate 3 + 5
result1 = operate(add, 3, 5)
print(result1)  # Output: 8

# Use the operate function and the subtract function to calculate 9 - 4
result2 = operate(subtract, 9, 4)
print(result2)  # Output: 5

# Use the operate function and the multiply function to calculate 3 * 7
result3 = operate(multiply, 3, 7)
print(result3)  # Output: 21
```

The program above defines three simple functions: `add`, `subtract`, and `multiply`, which perform addition, subtraction, and multiplication operations respectively. Additionally, it defines a higher-order function named `operate` that accepts a function as its first argument and two numbers as the remaining arguments. This function calls the passed-in function argument and passes the remaining two numbers as arguments to that function. Finally, we use the `operate` function, passing the previously defined functions and some numbers as arguments.

Code implemented this way allows users to use different operations or strategies without changing the internal logic of the `operate` function. This avoids repetitive code because all operations use the same `operate` function. It also makes the code clearer and more readable, especially when the operations become more complex.

In object-oriented programming, the polymorphic nature of classes is typically used to achieve this functionality of calling the same function yet exhibiting different behaviors; in procedural programming, one can only rely on conditional statements to implement similar functionality; in functional programming, the approach of passing functions as arguments is used to achieve this.

## Functions as Return Values

Functions can not only serve as arguments to other functions, but also as return values of other functions. Below, let's look at a simple example where one function returns another function:

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

In the example above, `get_function` accepts a parameter `power` (exponent) and returns an [inner function](function#嵌套函数) `raise_to_power`. The returned function retains the value of `power` internally, allowing us to create and use functions with different exponents, such as `square` and `cube`.

Sometimes, we may want to dynamically create and return different functions based on certain conditions. For example:

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

operation = math_operation('+')  # Returns the addition function
print(operation(5, 3))           # Output: 8

operation = math_operation('-')  # Returns the subtraction function
print(operation(5, 3))           # Output: 2
```

## Closures

The core idea of a closure is that a function can access and manipulate the local variables of the scope in which it was defined, even when the function is called outside of that defining scope. For example:

```python
def outer_function(x):
    def inner_function(y):
        return x + y
    return inner_function

closure_instance = outer_function(10)
print(closure_instance(5))  # Output: 15
```

In the code above, `outer_function` returns a reference to `inner_function`. When we call `closure_instance(5)`, the call occurs outside of `outer_function`. That is, `inner_function` is called outside the scope in which it was defined, yet `inner_function` can still access the local variable `x` from within the scope where it was defined, whose value is 10.

A closure involves at least two functions: an outer function and one or more inner functions. The inner functions reference local variables of the outer function. The inner functions retain references to the local variables of the outer function, so that when the inner function is called, even if the outer function has already finished executing, these variables remain available.

Closures can also lead to unexpected behavior, especially when creating closures within a loop. Because closures capture variables in their defining environment, we must ensure that the captured variables have the expected values. For example:

```python
def outer_function():
    functions = []
    for i in range(3):
        def func(x): 
            return x + i     # Captures i
        functions.append(func)
    return functions

functions = outer_function()
print(functions[0](10))  
print(functions[1](10)) 
print(functions[2](10)) 
```

In the code above, three inner functions are created using a loop. At the time these three inner functions were created, the values of `i` were 0, 1, and 2 respectively. Therefore, when x = 10, we would expect these three inner functions to return 10, 11, and 12 respectively, i.e., the value of `x + i`. However, when this program is executed, the output of all three `print` statements is 12.

The reason all outputs are 12 is that Python's closures use late binding. This means that the inner function `func` does not copy the current value of `i` (0, 1, 2) at the time of definition, but instead remembers the reference to the variable `i`. When the loop ends, the variable `i` ends up with the value 2. Later, when we call `functions[0](10)`, the program looks up the value of `i`, and by then it reads `i` as 2. Therefore, all functions use the same final value of `i`.

To fix this problem, we need to fix the value of `i` at the time the function is defined. The most common approach is to use default parameters, because the values of default parameters are evaluated at function definition time:

```python
def outer_function():
    functions = []
    for i in range(3):
        def func(x, i=i):  # Note: we use a default parameter to capture the current value of i
            return x + i
        functions.append(func)
    return functions

functions = outer_function()
print(functions[0](10))  # Output: 10
print(functions[1](10))  # Output: 11
print(functions[2](10))  # Output: 12
```

Now the program runs as expected.

Closures can be used for data and function [encapsulation](class#封装), because closures can hide data by concealing the local variables of the outer function. External programs can only access the data through the defined functions.

Closures are often used together with [decorators](decorator), which are powerful tools for modifying the functionality of other functions or classes.

## Currying

Currying is a technique of converting a multi-argument function into a series of single-argument functions. This might sound like an interesting but impractical trick, but in certain contexts, currying can be very useful. In some more advanced features, such as creating higher-order functions, decorators, etc., currying techniques are needed.

A classic example of currying is for a binary function f(x, y). After currying, we get a function g(x) whose return value is another function that handles y. For example, the following example is a simple addition function that requires two input arguments, but we can turn it into a series of single-argument functions:

```python
# This is a single-argument function that implements addition
def curried_add(x):
    def add_y(y):
        return x + y
    return add_y

# Calculating 3 + 4 can be written as:
print(curried_add(3)(4))  # Output: 7

# You can also fix one of the parameters
add_five = curried_add(5)
print(add_five(10))       # Output: 15
```

## Partial Functions

Partial functions are a special case of currying. Using partial functions, you can fix the value of one or more arguments and return a new function. This new function can call the original function with the remaining arguments. The main purpose of partial functions is to simplify the number of arguments for particularly commonly used functions.

Another application scenario is: when you need to call a library function `foo` that requires a single-argument function as its argument `bar`, but the functions we already have typically take multiple arguments. In this case, we can use a partial function to fix the other arguments of the multi-argument function, wrapping it into a single-argument function, thus satisfying the requirement of argument `bar`.

Python's `functools.partial` can be used to create partial functions. For example:

```python
from functools import partial

def multiply(x, y):
    return x * y

# Create a new function with y preset to 2
double = partial(multiply, y=2)

print(double(4))  # Output: 8
print(double(7))  # Output: 14
```

## Anonymous Functions

Anonymous functions are functions without a name. These functions are defined using the `lambda` keyword, hence they are also called lambda functions. The term lambda is borrowed from the founding language of functional programming, [Lambda Calculus](https://lv.qizhen.xyz/appendix_languages#lambda-calculus-编程语言).

### Basic Usage

The basic syntax of a lambda function is:

```python
lambda arguments: expression
```

A lambda function can have any number of arguments, but can only contain a single expression, which must be on one line. The value of the expression is returned when executed.

For example:

```python
lambda x, y: x + y
```

In the example above, we defined a lambda function that accepts two arguments `x` and `y` and returns their sum. Using a lambda function is similar to using a regular function — you can call and run it by appending parentheses and arguments after the function:

```python
(lambda x, y: x + y)(2, 3)  # The function returns 5
```

In practice, lambdas are more often assigned to a variable or parameter, and then the variable or parameter is used to call the lambda function.

```python
f = lambda x, y: x + y
print(f(2, 3))  # Output: 5
```

In the example above, we assigned the defined lambda function to the variable `f`, and subsequent programs can use the variable `f` to call this lambda function. As a variable pointing to a function, `f` functions essentially the same as directly defining a function named `f`, for example:

```python
def f(x, y):
    return x + y
```

In Python, the syntax `def f(x, y):` essentially also assigns a function object to the variable name `f`. The main differences between using `lambda` and using `def` are:

- Code style: lambdas are suitable for writing "disposable" functions with simple logic that don't need a dedicated name.
- Metadata: functions defined with `def` have a [`__name__` attribute](module#导入时运行) that is the function name itself, which makes debugging and error messages clearer; whereas the `__name__` attribute of a lambda function is `<lambda>`, which is less intuitive when debugging than regular functions.

In some programming languages (such as JavaScript), programmers tend to use anonymous functions to implement all functionality, referencing them through variables rather than function names.

### Nested Lambda Functions

Although in Python, a lambda function can only have a single-line expression, we can extend the functionality of lambda functions through nested calls. Let's look at such an example:

```python
h = lambda a, b: (lambda x: a(x) + b(x))
combined = h(lambda x: x * 2, lambda x: x * 3)

print(combined(4))  # Output: (4*2) + (4*3) = 20
```

In the program above, `h` is a lambda function that accepts two function arguments `a` and `b`. The arguments `a` and `b` are themselves functions. The return value of `h` is also a function — a lambda function that accepts one argument `x` and then computes and returns the value of `a(x) + b(x)`.

`combined` is a function; it is the lambda function returned after calling `h`. When calling `h` here, we passed two lambda functions as arguments: the first lambda function multiplies its input by 2, and the second multiplies its input by 3.
Therefore, the new lambda function `combined`, when given an input, multiplies that input by 2, also multiplies that input by 3, and then returns the sum of these two results.

Nested lambda functions support closures just like nested regular functions, meaning the inner lambda function can access and manipulate the variables and parameters of the outer function.

### Streamlining Code

Lambda functions eliminate verbose function definitions and can often help make code very concise. Let's revisit an example we used earlier:

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

operation = math_operation('+')
print(operation(5, 3))  # Output: 8

operation = math_operation('-')
print(operation(5, 3))  # Output: 2
```

If we use anonymous functions to implement the exact same logic, the code can be much more concise — in fact, just one line:

```python
math_operation = lambda op: (lambda x, y: x - y, lambda x, y: x + y)[op == '+']

print(math_operation('+')(5, 3))  # Output: 8
print(math_operation('-')(5, 3))  # Output: 2
```

## Exercises

Write **anonymous functions** to implement the following:

1. Square calculation: Calculate the square of a given number. For example, input 4, output 16.
1. Even number check: Determine whether a number is even. Input a number, return True or False.
1. Multi-parameter operation: Accept two arguments x and y, return the result of (x + y)^2.
1. Chained function: Use an anonymous function to implement a chained function (x -> x^2 -> x+1 -> x/2), input x=4, output should be 8.5.
1. Write a function `apply_func(func, x, y)` that accepts a function `func` and two numbers `x`, `y`, and returns the result of `func(x, y)`. For example, `apply_func(lambda a, b: a + b, 3, 5)` should return 8.
1. Write a function `make_multiplier(n)` that returns a new function that multiplies its input by n.
1. Write a higher-order function `apply_n_times(func, x, n)` that accepts a function `func`, a value `x`, and a positive integer `n`, and returns the result of applying `func` to `x` n times. For example: `apply_n_times(lambda x: x * 2, 2, 3)  # Output: 8`
1. Write a function `choose_func(op)` that returns different functions based on the string argument `op`. For example: `adder = choose_func("add")`
