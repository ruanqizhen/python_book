# Functions

Before learning programming, we may have already been familiar with mathematical "functions". In the field of programming, functions are also a very core concept, originally borrowed from the mathematical concept of functions. In Python, a function is an organized, reusable block of code used to implement a single or related set of functionalities. They improve code modularity and increase code reusability. Python provides many built-in functions, such as the `print()` function frequently used in earlier examples. We can also create our own functions, which are called user-defined functions.

## Function Definition

### Components

A function definition in Python consists of the following key components:

* `def` keyword: The function definition begins with the `def` keyword.
* Function name: After the `def` keyword comes the function name. This should be a descriptive name. Functions follow the same naming rules as variables: they can contain only uppercase and lowercase letters, underscores, and digits, but cannot start with a digit.
* Parameter list: Inside the parentheses following the function name, list the function's parameters. These are values passed to the function when it is called. A function can also have no parameters.
* Colon: The function header (i.e., the first line of the function definition) must end with a colon.
* Function body: The function body is a set of indented statements that define the operations the function is to perform.
* Return value: A value can be returned from a function using the `return` statement. If a function does not contain a `return` statement, it returns `None` by default.

Below, we will use some examples to explain how to use these components.

The simplest function is one without parameters:

```python
def greet():
    print("Hello, World!")
```

The above code is the simplest function definition. The `def` keyword marks the beginning of the function definition. After `def` comes the function name `greet`, and inside the parentheses after the function name are the function's parameters, but this function has no parameters. The colon indicates the end of the function header, and the block of code starting on the next line is the function body. The function body calls the `print` function to print a message. This function does not set a return value.

In Python, calling a function is very simple. Write the function name followed by parentheses, and provide the required parameters (if any) inside the parentheses to call it. Many function calls have been demonstrated in previous examples, especially calls to the `print()` function. The following code calls the `greet` function, which runs the function and indirectly executes the code in the function body, printing the message "Hello, World!":

```python
greet()   # Output: "Hello, World!"
```

### Parameters

A typical function has one and only one return value. If there is no `return` statement inside the function body, the function returns `None`; if `return` is followed by a single value, it returns that value; if there are multiple values, they are packed into a tuple and returned.

A function with parameters and a return value is defined as follows:

```python
def sub(a, b):
    return a - b
    
print(sub(8, 3))  # Here, the sub function is called, Output: 5
```

In the function definition above, the `sub` function defines two parameters `a` and `b`. When the `sub` function is called, the data passed to it is stored in these two parameters. Inside the function body, the program can directly use `a` and `b` as data names to operate on the data passed to the function. `sub` returns a single value, which is the result of the `a - b` operation.

When calling a function, if the parameters are just data, the order of the input parameters must be consistent with the order defined in the function. This way of passing parameters is called **positional arguments**, because the order of the arguments is crucial. For example, in the above example, if the argument order is reversed, such as calling `sub(3, 8)`, an incorrect result would be obtained.

To prevent argument order errors, especially when the called function has many parameters, you can call the function using **keyword arguments**. That is, when calling the function, write out the parameter names, for example:

```python
# Define the function
def describe_person(first_name, last_name, age):
    print(f"{first_name} {last_name} is {age} years old.")

# Call the function using keyword arguments
describe_person(age=28, last_name="Doe", first_name="John")  # Output: John Doe is 28 years old.
```

At this point, since the parameter names have been provided, the program assigns data by name, and the order no longer matters. This is very useful when function parameters have default values; when calling a function, we may only need to set a few parameters while others use their default values. In such cases, keyword arguments can be used. Keyword arguments are more readable than positional arguments and, since they are not constrained by position, are also less error-prone. Therefore, when calling functions, it is a good practice to use keyword arguments whenever possible.

### Return Values

If a function has multiple return values, it actually returns a tuple. In Python, commas determine tuple creation, and parentheses are only for clarity. Therefore, `return a, b, c` essentially returns `(a, b, c)`. For example, the following function takes a set of data and calculates its length, sum, and average:

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

Returning multiple values from a function provides great convenience in programming, but one should be careful not to let a function return too many values. Once the number of return values exceeds three, the probability of errors increases significantly. For example, in the example above, the order of the three values returned by the `compute_stats` function is: length, total, average. If, when using it, the order is accidentally written as `length, average, total = compute_stats(numbers)`, the error can still be relatively easily spotted. But imagine if a function returned eight or nine values and two of them were swapped in order — it would not be so easy to notice.

### Parameter Default Values

Function parameters can have default values. If the corresponding input value is not provided when calling the function, the function uses the parameter's default value. Parameters without default values must be provided with an input value when calling.

```python
def greet(name="World"):
    print(f"Hello, {name}!")

# Providing argument data when calling
greet("ruanqizhen")  # Output: "Hello, ruanqizhen!"

# Not providing argument data when calling, using default value
greet()              # Output: "Hello, World!"
```

In Python, the data type of a default parameter must be an [immutable type](variable#data-mutability). Using mutable data types (such as lists, dictionaries, or sets) as default parameter values is a common pitfall because it can lead to unexpected behavior.

Default parameter values are evaluated when the function is defined, only once, not each time the function is called. Therefore, when a mutable data type is used as a default parameter and modified, the modification persists across subsequent function calls, affecting the behavior of later calls. For example:

```python
def new_dict(item, items=[]):
    items.append(item)
    return items

print(new_dict(1))  # Output: [1]
print(new_dict(2))  # Expected output: [2], but actual output: [1, 2]
print(new_dict(3))  # Expected output: [3], but actual output: [1, 2, 3]
```

As shown above, the `items` list maintains state across multiple function calls.

To avoid this problem, set the default parameter to `None` and check it inside the function body. If no new data is provided when calling, assign it its proper initial value:

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

Similarly, using functions that may produce different results as default parameter values can cause similar problems. For example:

```python
from time import sleep
from datetime import datetime

def print_time(t=datetime.now()):
    print(t)

print_time()
sleep(1)
print_time()
```

In the code above, the `datetime.now()` function returns the current system time each time it is called; the `sleep(1)` function pauses the program for one second. The intended program logic is that the first call to `print_time()` prints the current time, then after a one-second wait, the second call should print a time one second later. However, running the program above reveals that the two printed times are exactly the same. This is also because: the value of the default parameter is evaluated when the function is defined, not when the function is called. Therefore, the parameter `t` only ever has one time value.

The fix is also to set the default parameter to `None` and check it inside the function body:

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

A function can have a variable number of parameters. This is achieved through tuple packing and unpacking, for example:

```python
def print_all(*args):
    for arg in args:
        print(arg)
        
print_all(1, 2)         # Output: 1 2
print_all(1, 2, 3, 4)   # Output: 1 2 3 4
```

In the function above, the asterisk before the parameter `*args` (short for arguments) indicates that it can accept multiple parameters. The function's ability to receive a variable number of parameters utilizes tuple packing and unpacking. Inside the function body, `args` is a tuple consisting of all the input arguments. The code above is just for demonstrating variable-length arguments; in fact, the `print()` function itself is a function that can accept a variable number of arguments — you can call `print()` with multiple data items, such as `print(1, 2)`.

Similarly, using dictionary packing and unpacking, you can pass a variable number of keyword arguments to a function. In Python, `**kwargs` (short for "keyword arguments") is commonly used to handle a variable number of keyword arguments. This collects all passed keyword arguments into the `kwargs` dictionary, where parameter names serve as keys and their corresponding values as dictionary values. For example:

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

`*args` captures all positional arguments, while `**kwargs` captures all keyword arguments. Therefore, they must be placed at the end of the function definition's parameter list, and `*args` must come before `**kwargs`. This way, the function can first process ordinary parameters and then use these two variable-length parameters to capture all remaining arguments. For example:

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

Using both `*args` and `**kwargs` in a single function can be quite confusing; careful analysis is needed to determine where an output parameter will appear. In real-world projects, except for special applications like [decorator functions](decorator), the simultaneous use of `*args` and `**kwargs` should generally be avoided.

#### Should You Use Variable-Length Arguments

Variable-length arguments provide flexibility, allowing a function to accept any number of parameters, which is very useful when dealing with an uncertain number of inputs. However, this can also make the code harder to understand and maintain, especially when the function performs complex operations. When designing our own functions, we need to carefully consider whether to use variable-length arguments.

In various projects on the planet Pythora, the situation that most requires variable-length arguments is when a new function internally calls other functions that themselves accept variable-length arguments. To pass arguments through to the called functions, the new function also needs variable-length arguments. For example, Python has built-in functions for calculating the sum of data and the count of data items, both of which can accept a variable number of arguments. If we write a new function to calculate the average of several data items, then this new function also needs to support variable-length arguments:

```python
def average(*numbers):
    return sum(numbers) / len(numbers) if numbers else 0

# Can be called with different numbers of arguments
print(average(2, 3, 4))  # Output average 3.0
print(average(10, 20))   # Output average 15.0
```

If not calling existing functions that have variable-length arguments, it is better for the new function to use a fixed number of parameters. This makes the function's purpose clearer and improves readability.

### Modifying Input Parameter Values

Python uses pass-by-object-reference to pass parameter values. That is, when data is passed to a function, the function does not copy the data and work with a copy. Instead, it directly points the parameter to the input data. Inside the function, the parameter name is a reference pointing to the input data, just like a variable name. This means that if an input data item is modified inside the function, the data itself is modified. When accessing this data outside the function, the read result will also reflect the change. However, it is important to note that in Python, [some types of data are immutable](variable#data-mutability). These types of data cannot be modified either inside or outside the function; conversely, mutable data can be modified both inside and outside the function. For example:

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

Note: Starting from Python 3.9, you can directly use built-in types such as `list`, `dict`, etc. as generic hints, for example `list[int]`. In older versions, you need to use `from typing import List` to import the capitalized `List` type.

Here we used the `List` from the typing module, which allows us to provide more specific type hints, indicating that `numbers` is a list of integers.

### Function Documentation

In Python, documentation for functions is typically added using a multi-line string enclosed in triple quotes, placed immediately below the function header. This type of string is also called a "docstring".

Typically, the first line of a docstring concisely summarizes the function's purpose. Subsequent lines can provide a more detailed description, parameter information, return values, examples, and other relevant details. For example:

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

Function documentation is not only helpful when reading code; it can also be accessed programmatically when needed. You can access the function documentation using the function's `__doc__` attribute, or by using Python's `help()` function, for example:

```python
print(add.__doc__)
help(add)
```

We can also obtain documentation for Python's built-in functions using the above methods.

Writing documentation for functions is a good programming practice, especially when the code may be read or maintained by others. With clear documentation, other developers can quickly understand and use a function without needing to delve into the implementation details.

## Nested Functions

In Python, other functions can be defined inside a function body. Such inner functions are often called nested functions or local functions. Here is an example to illustrate this concept:

```python
def outer_function(x):
    def inner_function(y):
        return y * 2
    return inner_function(x) + 5

result = outer_function(10)  
print(result)   # Output: 25
```

In the code above, `inner_function` is defined inside `outer_function`.

The main advantage of nested functions is that they can hide complex logic inside the inner function, making the outer function more concise. Additionally, inner functions can access the local variables of their enclosing function, providing a mechanism for the program to maintain data through functions without needing to pass that data to every function that uses it. Inner functions can also be returned as the return value of the outer function to implement complex logical functionality. Demonstrating these advantages of nested functions requires some additional programming concepts, which this book will explore in more depth when introducing [functional programming](first_class_func#closures) later.

The disadvantage of nested functions is that they can make the code more complex. However, when used appropriately, nested functions can improve code clarity and maintainability.

## Function and Variable Scope

In Python, the accessibility and lifetime of a variable are determined by its location. This location is called "scope". Understanding variable scope in Python is crucial for avoiding potential variable name conflicts and writing more maintainable code. Below are the main types of variable scopes in Python.

### Local Scope

In Python, local scope is generally limited to the scope of the current function body. If a variable is defined inside a function, it is only available within that function. Such variables are called local variables. When the function finishes executing, local variables are destroyed.

```python
def my_function():
    local_var = "I am a local variable"
    print(local_var)  # Can be accessed inside the function

my_function()         # Calling the function will print the local variable's value

# Attempting to access a local variable outside the function will raise an error
# print(local_var)    # This will raise a NameError because local_var is not visible in this scope
```

In many languages, variables defined inside structures like loops can only be used within that structure. Python is different — Python's selection, loop, and similar structures do not have their own scope; the function is the smallest local scope. This can sometimes be convenient, for example, we can still access variables used in a loop after it has finished:

```python
for i in range(5):
    print(i)
print(f"In the last iteration, i = {i}")
```

However, it is important to note that this can also lead to unexpected results. For example, users with experience in other languages might inadvertently overwrite a variable they thought would not be changed. A concrete example is when [handling exceptions](exception). We often use the variable `e` to store exception data, but if `e` is already used as a variable elsewhere in the program, it will be overwritten:

```python
e = 2.71828

try:
    raise Exception()
except Exception as e:
    pass

print(e)
```

Running the program above, you will find that the value of `e` cannot be printed because it was overwritten and deleted by the exception handling block. The solution is to avoid using the same variable name in both places.

### Enclosing Scope

In nested functions, the scope of the outer function (also called the enclosing function) is called the enclosing scope. Inner functions can access variables defined in the outer function, i.e., variables in the enclosing scope, but they cannot modify them. Unless the inner function redeclares the variable using the `nonlocal` keyword, in which case it can be modified. For example:

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

The program above demonstrates that a function's local variables cannot be read outside that function. They can be read inside a nested function, but a variable in the enclosing scope cannot be modified. In the following example, we use the `nonlocal` keyword inside the inner function to declare a variable from the enclosing scope, and then modify it:

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

Variables defined in the main program body have global scope and are called global variables. These variables exist throughout the entire program execution and can be read inside any function within the current file. However, to modify a global variable inside a function body, the global variable must be declared using the `global` keyword before modification.

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

Special attention is needed here: local variables and global variables may have the same name. If one does not realize they are actually two different variables, reading the code can be very confusing: the variable's value was changed, so why does it still read the old value? Another example is the following situation, where the user might think they are reading a global variable, but the program actually raises an error:

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

Running the program above will raise an error (an `UnboundLocalError`). This is because when Python parses the function, if it finds an assignment operation to the variable `a` (`a = 2`) inside the function, it treats `a` as a local variable. When the program reaches `print(a)`, it tries to read the local `a`, but since the assignment statement has not yet been executed, the local `a` has not been bound to any value, hence the error.

The enclosing scope has similar issues. In real-world projects, try to avoid defining variables or functions with the same name as those in other scopes to prevent such confusing behavior.

### Built-in Scope

The built-in scope is the outermost scope created when the Python interpreter starts. It contains Python's predefined built-in names, such as: `print()`, `len()`, `int()`, `list()`, `dict()`, `open()`, `Exception`, etc. These are the built-in functions, classes, exception handling methods, etc., provided by Python. Functions and variables in the built-in scope can be accessed from any file and any function.

For example, the `print()` function can be called from anywhere without any special declaration.

### Variable Lookup Order

In the examples above, we have seen that variables and functions with the same name can be defined in different scopes. So, when we read a variable with a duplicate name (or call a function), which scope's variable is actually read?

In such cases, Python follows the **LEGB rule** for lookup:
* **L**, Local: First, the local scope is searched.
* **E**, Enclosing: Second, the enclosing function scope is searched. If the function is nested multiple levels, it starts from the nearest enclosing scope and works outward.
* **G**, Global: Next, the global scope is searched.
* **B**, Built-in: Finally, the built-in scope is searched.

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

The program above redefines a `print` function with the same name as Python's built-in `print()` function, but with different functionality. The program logic itself is fine; when calling the `print()` function, it follows the LEGB rule and uses our custom `print` function first.

However, if someone unfamiliar with our code reads this program, seeing that the `print()` function behaves differently from what they've seen before, they would be very confused. This is not a good way to name functions or variables. In real-world projects, try to avoid redefining or overwriting variable or function names from outer scopes, as this can lead to unexpected results and confusion.

## Exercises

- **Count Vowels**: Write a function that takes a string as input and returns the number of vowel letters (a, e, i, o, u) in the string.
- **String Length List**: Write a function that converts a given list of strings into a list of the lengths of each string.
- **Custom Pizza**: Write a function to simulate a pizza-making process. It should accept any number of toppings as parameters (using `*args`), and the function should print all the toppings.
