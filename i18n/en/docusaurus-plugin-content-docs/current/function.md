# Functions

Before learning programming, you might already have been familiar with the mathematical concept of a "function". In programming, functions are also a core concept, originally inspired by their mathematical counterparts. In Python, a function is an organized, reusable block of code designed to perform a specific, related action. Functions improve code modularity and promote code reusability. Python provides many built-in functions, such as the `print()` function we have used in earlier examples. We can also define our own functions, known as user-defined functions.

## Function Definition

### Components

A Python function definition consists of several key components:

* `def` keyword: The function definition begins with the `def` keyword.
* Function name: Follows the `def` keyword. It should be descriptive and follow the same naming rules as variables: only letters, digits, and underscores, and it cannot start with a digit.
* Parameters: Enclosed in parentheses following the function name, these represent the input values passed to the function. A function can also have zero parameters.
* Colon: The function header (the first line) must end with a colon.
* Function body: An indented block of statements containing the logic of the function.
* Return value: An optional `return` statement exits a function, optionally passing back a value. If omitted, the function returns `None` by default.

Below, we will use some examples to explain how to use these components.

The simplest function is one that takes no parameters:

```python
def greet():
    print("Hello, World!")
```

This is a basic function definition. The `def` keyword initiates the definition, followed by the function name `greet`. The empty parentheses indicate that the function takes no parameters. A colon marks the end of the header, and the subsequent indented block forms the function body. Here, the body simply calls `print()` to display a message. Because there is no `return` statement, it does not explicitly return a value.

To call a function, write the function name followed by parentheses, including any required arguments inside them. We have already called functions like `print()` many times. The following code invokes the `greet()` function, executing the code inside its body:

```python
greet()   # Output: "Hello, World!"
```

### Parameters

A Python function returns exactly one value. If there is no `return` statement, it returns `None`. If `return` is followed by a single value, it returns that value; if followed by multiple values separated by commas, they are packed into a tuple and returned.

Here is a function that takes arguments and returns a value:

```python
def sub(a, b):
    return a - b
    
print(sub(8, 3))  # Here, the sub function is called, Output: 5
```

In this definition, the `sub` function takes two parameters, `a` and `b`. When `sub` is called, the provided arguments are assigned to these parameters, which act as local variables within the function body. The function returns a single value: the result of `a - b`.

When invoking a function with multiple arguments, passing them by position requires them to be in the exact order defined by the function. These are called **positional arguments**. For example, in `sub(8, 3)`, reversing the order to `sub(3, 8)` yields a different, incorrect result.

To avoid ordering mistakes—especially in functions with many parameters—you can pass arguments by name using **keyword arguments**. For example:

```python
# Define the function
def describe_person(first_name, last_name, age):
    print(f"{first_name} {last_name} is {age} years old.")

# Call the function using keyword arguments
describe_person(age=28, last_name="Doe", first_name="John")  # Output: John Doe is 28 years old.
```

Because arguments are explicitly associated with parameter names, their order does not matter. Keyword arguments are particularly useful when functions have default parameter values, as you only need to specify the arguments you want to override. They are more readable, less error-prone, and highly recommended for complex function calls.

### Return Values

When a function returns multiple values, it is actually returning a single tuple. In Python, commas are what construct tuples, while parentheses are optional and used mainly for clarity. Thus, `return a, b, c` is equivalent to `return (a, b, c)`. The following function takes a list of numbers and calculates its length, sum, and average:

```python
# Define the function
def compute_stats(numbers):
    length = len(numbers)
    total = sum(numbers)
    average = total / length
    return length, total, average

# Use the function
numbers = [10, 20, 30, 40, 50]
length, total, average = compute_stats(numbers)

print(f"Length: {length}")      # Output: 5
print(f"Total: {total}")        # Output: 150
print(f"Average: {average}")     # Output: 30.0
```

Returning multiple values is convenient, but you should avoid returning too many. If a function returns more than three values, the risk of misassigning them increases. For instance, if you accidentally unpack `compute_stats(numbers)` as `length, average, total`, the bug might be hard to catch. If a function returns eight or nine values, ordering errors become almost inevitable.

### Parameter Default Values

Function parameters can have default values. If you do not provide an argument for a parameter with a default value when calling the function, Python uses the default value. Parameters without default values are required.

```python
def greet(name="World"):
    print(f"Hello, {name}!")

# Providing argument data when calling
greet("ruanqizhen")  # Output: "Hello, ruanqizhen!"

# Not providing argument data when calling, using default value
greet()              # Output: "Hello, World!"
```

In Python, default parameter values should be of an [immutable type](variable#data-mutability). Using mutable data types (like lists, dictionaries, or sets) as defaults is a classic trap that leads to unexpected side effects.

This happens because default parameter values are evaluated only once—when the function is defined, not when it is executed. Therefore, if a mutable default argument is modified in a call, that modification persists across all future calls. For example:

```python
def new_dict(item, items=[]):
    items.append(item)
    return items

print(new_dict(1))  # Output: [1]
print(new_dict(2))  # Expected output: [2], but actual output: [1, 2]
print(new_dict(3))  # Expected output: [3], but actual output: [1, 2, 3]
```

As seen above, the `items` list retains its state across separate function calls.

To avoid this issue, set the default to `None` and initialize the mutable object inside the function body if no argument is passed:

```python
def new_dict(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

print(new_dict(1))    # Output: [1]
print(new_dict(2))    # Output: [2]
print(new_dict('a'))  # Output: ['a']
```

Similarly, using a dynamic expression or function call as a default parameter value can also lead to issues. For example:

```python
from time import sleep
from datetime import datetime

def print_time(t=datetime.now()):
    print(t)

print_time()
sleep(1)
print_time()
```

In this code, `datetime.now()` gets the current system time and `sleep(1)` pauses execution for one second. The expectation is that the second call to `print_time()` prints a timestamp one second later than the first. However, both calls print the exact same time. This is because the default value for `t` is evaluated only once when the function is defined, locking in that initial time.

The solution is to set the default parameter to `None` and evaluate the dynamic expression inside the function:

```python
from time import sleep
from datetime import datetime

def print_time(t=None):
    if t is None:
        t = datetime.now()
    print(t)

print_time()
sleep(1)
print_time()  # This time, the printed time will be one second later
```

### Variable-Length Arguments

A function can accept a variable number of arguments. This is achieved through tuple packing and unpacking, as shown here:

```python
def print_all(*args):
    for arg in args:
        print(arg)
        
print_all(1, 2)         # Output: 1 2
print_all(1, 2, 3, 4)   # Output: 1 2 3 4
```

In this function, the asterisk before `args` (short for arguments) indicates that it accepts any number of positional arguments. Under the hood, Python uses tuple packing to collect these arguments into a tuple named `args`. Note that this is for demonstration; Python's built-in `print()` function itself inherently accepts variable-length positional arguments, allowing calls like `print(1, 2)`.

Similarly, you can use dictionary packing to accept an arbitrary number of keyword arguments. By convention, `**kwargs` (short for keyword arguments) is used for this purpose. Python collects all extra keyword arguments into a dictionary named `kwargs`, where keys are parameter names and values are their corresponding argument values. For example:

```python
def display_data(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

# Call the function
display_data(name="Ruan Qizhen", age=35, city="Shanghai")

# Output:
# name: Ruan Qizhen
# age: 35
# city: Shanghai
```

`*args` collects positional arguments, whereas `**kwargs` collects keyword arguments. Consequently, they must be placed at the very end of the parameter list, with `*args` preceding `**kwargs`. This ordering allows a function to bind regular parameters first, and then capture any remaining arguments using these two parameters. For example:

```python
def example_function(arg1, arg2, *args, **kwargs):
    # Print ordinary parameters
    print(arg1, arg2)

    # Print variable-length positional arguments
    for arg in args:
        print(arg)
    
    # Print keyword arguments
    for key, value in kwargs.items():
        print(f"{key} = {value}")

# Call the function
example_function('a', 'b', 1, 2, 3, name="John", country="USA")

# Output:
# a b
# 1
# 2
# 3
# name = John
# country = USA
```

Using both `*args` and `**kwargs` in a single function can quickly become confusing because it makes tracing which arguments map to which parameters harder. Except for special patterns like [decorator functions](decorator), you should generally avoid using both in the same signature.

#### Should You Use Variable-Length Arguments

Variable-length arguments provide flexibility, allowing a function to accept any number of parameters, which is very useful when dealing with an uncertain number of inputs. However, this can also make the code harder to understand and maintain, especially when the function performs complex operations. When designing our own functions, we need to carefully consider whether to use variable-length arguments.

On the planet Pythora, the scenario that most requires variable-length arguments is when a wrapper function forwards arguments to an internal function that also accepts variable-length arguments. For example, Python has built-in functions for calculating the sum of data and the count of data items, both of which can accept a variable number of arguments. If we write a new function to calculate the average of several data items, then this new function also needs to support variable-length arguments:

```python
def average(*numbers):
    return sum(numbers) / len(numbers) if numbers else 0

# Can be called with different numbers of arguments
print(average(2, 3, 4))  # Output average 3.0
print(average(10, 20))   # Output average 15.0
```

If not calling existing functions that have variable-length arguments, it is better for the new function to use a fixed number of parameters. This makes the function's purpose clearer and improves readability.

### Modifying Input Parameter Values

Python uses a mechanism called *pass-by-object-reference* to pass arguments to functions. When you pass data to a function, Python does not create a copy of the data; instead, it binds the parameter name inside the function to the original object. Therefore, the parameter name inside the function acts as a reference to the same object in memory, much like assigning a new variable name. Consequently, if you modify a mutable object inside the function, the changes will be visible outside the function. However, [immutable objects](variable#data-mutability) cannot be altered. If you attempt to modify an immutable object inside a function, Python will simply create a new object and re-bind the local parameter name to it, leaving the original object outside the function unchanged. For example:

```python
def modify_list(lst):
    lst.append(4)  # lst's reference hasn't changed, but the data has

def modify_number(x):
    x = x + 1      # The original data does not change, but x now points to another data item

# Immutable data example
num = 3
modify_number(num)
print(num)      # Output is 3, because the value of num has not been changed

# Mutable data example
my_list = [1, 2, 3]
modify_list(my_list)
print(my_list)  # Output is [1, 2, 3, 4], because my_list was modified by the function
```

### Type Hints for Parameters and Return Values

When writing large programs, it is best to provide type hints for function parameters and return values. Similar to variable type hints, they do not perform any type checking at runtime, but provide developers and tools with a clear indication of the expected parameter types and return types.

The following is an example of defining a function with type hints:

```python
def greet(name: str) -> str:
    return f"Hello, {name}!"
```

In this example, `name: str` indicates that the `name` parameter should be a string. `-> str` indicates that this function should return a string.

Here is a more complex example:

```python
def filter_even_numbers(numbers: list[int]) -> list[int]:
    return [num for num in numbers if num % 2 == 0]
```

Note: Starting from Python 3.9, you can directly use built-in types such as `list`, `dict`, etc. as generic hints, for example `list[int]`. In older versions (Python 3.8 and earlier), you would need to import the capitalized `List` type from the `typing` module (`from typing import List`) and write `List[int]` instead.

### Function Documentation

In Python, you document a function using a multi-line string enclosed in triple quotes, placed directly beneath the function header. This is known as a **docstring** (documentation string).

By convention, the first line of a docstring summarizes the function's purpose. Subsequent lines can describe parameters, return values, raised exceptions, and even include usage examples. For example:

```python
def add(a, b):
    '''
    Returns the sum of two numbers.

    Parameters:
    - a: The first number.
    - b: The second number.

    Returns:
    The sum of a and b.

    Example:
    >>> add(2, 3)
    5
    '''
    return a + b
```

Docstrings are not just for developers reading the source code; they can also be accessed programmatically. You can inspect a function's docstring via its `__doc__` attribute or by using Python's built-in `help()` function:

```python
print(add.__doc__)
help(add)
```

You can use the same methods to view the documentation for built-in Python functions.

Writing clear docstrings is a best practice in Python. It allows other developers to quickly understand how to use your function without having to read through its implementation details.

## Nested Functions

In Python, you can define functions inside other functions. These are called **nested functions** or **local functions**. For example:

```python
def outer_function(x):
    def inner_function(y):
        return y * 2
    return inner_function(x) + 5

result = outer_function(10)  
print(result)   # Output: 25
```

In this example, `inner_function` is nested within `outer_function`.

A major advantage of nested functions is encapsulation: they hide helper logic from the outer scope, keeping the enclosing function clean. Additionally, nested functions can access variables from their outer function's scope. This capability allows them to maintain state without relying on global variables or passing arguments around. An outer function can also return its inner function as a value, which is a powerful functional programming technique that we will explore in detail in the section on [closures](first_class_func#closures).

While nesting too deeply can hurt readability, when used appropriately, nested functions can make your code more modular and easier to maintain.

## Function and Variable Scope

In Python, a variable's accessibility and lifetime are determined by where it is defined. This region is called its **scope**. Understanding scope is crucial to avoid naming collisions and write robust code. Python defines four primary scopes.

### Local Scope

A variable defined inside a function belongs to that function's **local scope**. It is only accessible within the function and is destroyed once the function finishes executing.

```python
def my_function():
    local_var = "I am a local variable"
    print(local_var)  # Can be accessed inside the function

my_function()         # Calling the function will print the local variable's value

# Attempting to access a local variable outside the function will raise an error
# print(local_var)    # This will raise a NameError because local_var is not visible in this scope
```

Unlike many other programming languages, block structures in Python (like `if` statements, `for` loops, or `while` loops) do not create their own local scope. The function is the smallest unit of local scope. This means variables defined inside a loop or conditional block remain accessible after the block ends:

```python
for i in range(5):
    print(i)
print(f"In the last iteration, i = {i}")
```

However, this behavior can catch developers off guard, leading to naming conflicts where variables are unintentionally overwritten. A notable exception to this rule is [exception handling](exception): when you capture an exception using the `as` keyword, the variable is deleted at the end of the `except` block to clean up reference cycles:

```python
e = 2.71828

try:
    raise Exception()
except Exception as e:
    pass

print(e)
```

Running the program above will raise a `NameError` because Python automatically deletes the target variable `e` at the end of the `except` block. This is done to prevent reference cycles involving the stack frame. As a result, the outer variable `e` is lost. To avoid this, use a different variable name for your exception, or save the exception object to a different variable if you need to use it outside the block.

### Enclosing Scope

In nested functions, the scope of the outer (enclosing) function is called the **enclosing scope** (or non-local scope). Inner functions can read variables from their enclosing scope, but they cannot re-bind (modify) them directly. If they try, Python will treat them as new local variables. To modify an enclosing scope variable, you must declare it with the `nonlocal` keyword inside the inner function:

```python
def outer_function(message):
    # This is the outer function, which has a local variable message
    outer_variable = "I am a local variable of the outer function"

    def inner_function():
        # This is a nested inner function
        print("Inner function output:", message)
        print("Inner function accessing outer function variable:", outer_variable)
        
        # If the following line is run, it will cause an error because inner_function cannot modify outer_function's variable
        # outer_variable = "Modify the local variable of the outer function"

    inner_function()  # Call the inner function
    
    # If the following line is run, it will cause an error because outer_function cannot access inner_function's local variable
    # print("Outer function accessing:", inner_variable)

# Call the outer function
outer_function("Message passed to the outer function")

# If the following line is run, it will cause an error because inner_function is not in this scope
# inner_function()  

# Output:
# Inner function output: Message passed to the outer function
# Inner function accessing outer function variable: I am a local variable of the outer function
```

As shown above, an outer function's variables are accessible for reading inside the inner function, but cannot be reassigned without `nonlocal`. The following example demonstrates how the `nonlocal` keyword allows the inner function to modify a variable in the enclosing scope:

```python
def outer_function():
    # Local variable of the outer function
    count = 0

    def inner_function():
        # Use nonlocal to tell Python that we want to modify the outer function's count variable
        nonlocal count
        count += 1
        print("Current count:", count)

    inner_function()  # Call the inner function
    inner_function()  # Call the inner function again
    print("Outer function count:", count)

# Call the outer function
outer_function()

# Output:
# Current count: 1
# Current count: 2
# Outer function count: 2
```

### Global Scope

Variables defined in the main program body (outside any function) belong to the **global scope**. These global variables persist throughout the execution of the program and can be read inside any function in that file. To modify a global variable inside a function, however, you must declare it using the `global` keyword inside that function first:

```python
# Define a global variable
global_variable = "I am a global variable"

def show_global():  
    # A global variable can be directly read inside a function
    print(global_variable)
    
    # Define a local variable
    local_variable = "I am a local variable"
    
def show_local():
    # Without using the global keyword, this is actually a local variable that happens to have the same name as the global variable
    global_variable = "I am actually a local variable with the same name as the global variable"
    
    # When a local variable has the same name as a global variable, the local variable takes precedence
    print(global_variable)

def modify_global():
    # Use the global keyword to specify that we want to modify the global variable
    global global_variable
    global_variable = "I am a modified global variable"


show_global()    # Output: I am a global variable

modify_global()  # Modify the global variable

show_global()    # Output: I am a modified global variable

# Running the following statement would cause an error because local_variable is not in this scope
# print(local_variable)  

show_local()     # Output: I am actually a local variable with the same name as the global variable
```

When a local variable shares its name with a global variable, the local variable shadows the global variable inside the function. This can lead to subtle bugs if you expect a reassignment to modify the global variable. A classic pitfall occurs when you try to both read and modify a variable in the same function without declaring it global:

```python
a = 1

def show_global():
    print(a)   # This works, because it only reads the global variable a

def show_local():
    print(a)   # This will cause an error, because there is a write operation to a in this function, so Python treats a as a local variable, but at this point the local variable a has not yet been defined
    a = 2
    
show_global()
show_local()
```

Running this code raises an `UnboundLocalError`. When Python compiles a function, it identifies all variables assigned inside it as local. Since `a = 2` exists in `show_local()`, `a` is marked as a local variable. When the function runs and tries to execute `print(a)`, it attempts to look up the local variable `a` before it has been assigned, resulting in the error.

The enclosing scope is subject to the same shadowing issues. To prevent confusion, avoid naming variables or functions the same as those in outer scopes.

### Built-in Scope

The **built-in scope** is the outermost scope, automatically loaded when the Python interpreter starts. It contains Python's predefined keywords, built-in functions (like `print()`, `len()`, `open()`), standard types (like `int`, `list`, `dict`), and built-in exception classes (like `Exception`, `NameError`). These names are globally accessible without any import statements.

For example, the `print()` function can be called from anywhere without any special declaration.

### Variable Lookup Order

When the same name is defined in multiple scopes, Python uses a strict search order to resolve which object to read or call.

This lookup order is governed by the **LEGB rule**:
* **L**ocal: Inside the current function.
* **E**nclosing: Inside any enclosing (outer) nested functions, searched from the innermost outward.
* **G**lobal: At the top level of the current module/file.
* **B**uilt-in: Inside Python's built-in namespace.

For example:

```python
def custom_function():
    # Redefine the print function inside the function
    def print(message):
        # Note: Do not call the system's built-in print function here. Doing so would be very dangerous.
        # Because using print inside this function would result in recursive calls causing a stack overflow.
        # So for demonstration purposes, we use sys.stdout.write or assume this is pseudocode.
        import sys
        sys.stdout.write(f"[Custom Print]: {message}\n")

    # Use the custom version of print
    print("Hello, World!")

# Call custom_function
custom_function()  # Output: [Custom Print]: 
```

This program defines a custom `print` nested function that shadows the built-in `print()`. When `print("Hello, World!")` is executed, the LEGB rule resolves to the local `print` definition first.

However, shadowing built-in functions like `print()` is highly discouraged. It makes code confusing to read and can lead to unexpected behavior. In real-world development, always avoid re-binding or shadowing standard built-in names.

## Exercises

- **Count Vowels**: Write a function that takes a string as input and returns the number of vowel letters (a, e, i, o, u) in the string.
- **String Length List**: Write a function that converts a given list of strings into a list of the lengths of each string.
- **Custom Pizza**: Write a function to simulate a pizza-making process. It should accept any number of toppings as parameters (using `*args`), and the function should print all the toppings.
