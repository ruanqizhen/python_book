# Decorators

Decorators allow you to enhance or modify the behavior of functions without directly altering their source code. In essence, a decorator is a higher-order function that takes a function as an argument and returns a new function. This returned function extends or alters the execution of the original function.

## Basic Usage

### Timing Function Execution

Suppose your program is running slowly, and you want to locate the bottleneck. The simplest approach is to measure the execution time of functions suspected of being slow. For example, if we have a function named `my_slow_function()` that performs a task, we can measure its duration like this:

```python
import tempfile
import time

def my_slow_function():
    start_time = time.time()    # Record start time
    
    # The block below is the code from the original function, writing some data to a temporary file
    # Create a temporary file
    with tempfile.NamedTemporaryFile(delete=False, mode='wb') as temp_file:
        # Write some random data
        for i in range(1000):
            # Convert the string to a bytes object and write a new line
            temp_file.write((str(i) + '\n').encode('utf-8')) 
            
        # Get the temporary file path for later use
        temp_file_path = temp_file.name  
    # Original function code ends here
    
    end_time = time.time()       # Record end time
    print(end_time - start_time) # Print the total execution time of the function
    
    # Return statement of the original function below
    return temp_file_path
```

In the code above, `my_slow_function()` creates a temporary file and writes data to it. We use `time.time()` at the beginning and the end of the function to record the system time. The difference between these two timestamps represents the total execution time.

### A Generic Timer Function

Once debugging is complete, you must remove or revert these timing statements. While modifying a single function is straightforward, doing so for dozens of functions is tedious and error-prone. A better approach is to write a generic timer function that wraps the target function's execution, records the start and end times, and outputs the elapsed time. This allows us to measure any function without altering its internal code:

```python
import tempfile
import time

# This is the generic timing function
def timer(func):
    start_time = time.time()      # Record start time
    result = func()               # Run target function
    end_time = time.time()        # Record end time
    print(end_time - start_time)  # Print the total execution time of the function
    return result
    
def my_slow_function():
    # Create a temporary file
    with tempfile.NamedTemporaryFile(delete=False, mode='wb') as temp_file:
        # Write some random data
        for i in range(1000):
            # Convert the string to a bytes object and write a new line
            temp_file.write((str(i) + '\n').encode('utf-8')) 
            
        # Get the temporary file path for later use
        temp_file_path = temp_file.name  
    
    return temp_file_path # Return the path of the temporary file
    
# Try it out: the call below will print the program execution time
print(timer(my_slow_function))
```

The generic `timer()` function accepts another function as an argument, executes it, and measures its duration. While this is a step forward, it requires you to change how the function is called. Every call site of `my_slow_function` would need to be wrapped in `timer(my_slow_function)`. We can automate this wrapping process using decorators.

### A Timing Decorator

To convert our `timer()` function into a decorator, we must adjust it to return a new function (a wrapper) that will replace the original function, rather than returning the immediate result of the target function. To apply a decorator, place its name prefixed with the `@` symbol on the line directly above the function definition. Here is the updated code:

```python
import time
import tempfile

# Generic timing decorator
def timer(func):
    """Decorator: Measure and print function execution time"""
    def wrapper(*args, **kwargs):
        start_time = time.time()        # Record start time
        result = func(*args, **kwargs)  # Run target function
        end_time = time.time()          # Record end time
        print(f"{func.__name__} ran in: {end_time - start_time:.6f} seconds")
        return result
    return wrapper

@timer  # Apply the timer decorator
def my_slow_function():
    """Write numbers 0 to 999 to a temporary file and return its path"""
    # Create a temporary file
    with tempfile.NamedTemporaryFile(delete=False, mode='wb') as temp_file:
        # Write data
        for i in range(1000):
            temp_file.write((str(i) + '\n').encode('utf-8'))  # Convert string to bytes and write
        temp_file_path = temp_file.name  # Get the path of the temporary file
    return temp_file_path

# Try it out:
print(my_slow_function())
```

In this implementation, `timer()` is a decorator. It accepts a single parameter, `func`, which is the function being decorated, and returns the nested `wrapper()` function. When the decorated function is called, the program actually executes `wrapper()`. To ensure the decorator can wrap any function, `wrapper()` is defined with `*args` and `**kwargs`. This allows it to capture and forward arbitrary positional and keyword arguments to the original function.

The timing logic remains unchanged, but we now use `func.__name__` to print the name of the function being timed. This makes the console output clear and easy to follow when timing multiple functions.

Placing `@timer` above `def my_slow_function():` tells Python to automatically bind the function name to the wrapper returned by `timer`.

```python
@timer
def my_slow_function():
    ...
```

is equivalent to:

```python
def my_slow_function():
    ...

my_slow_function = timer(my_slow_function)
```

When you call `my_slow_function()`, you are executing the timing wrapper. The console output displays both the execution time and the returned path of the temporary file:

```
my_slow_function ran in: 0.001227 seconds
/tmp/tmp4kla830b
```

### Preserving Function Attributes

Although our decorator works, it introduces a subtle side effect: because the original function is replaced by `wrapper()`, metadata such as the function's name (`__name__`) and docstring (`__doc__`) are replaced by those of the wrapper. For example:

```python
print(my_slow_function.__name__)
print(my_slow_function.__doc__)

# 输出：
# wrapper
# None
```

To fix this and preserve the original function's metadata, we use `functools.wraps`, a built-in utility decorator, on our nested `wrapper` function:

```python
import time
import tempfile
from functools import wraps

# Generic timing decorator
def timer(func):
    """Decorator: Measure and print function execution time"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()        # Record start time
        result = func(*args, **kwargs)  # Run target function
        end_time = time.time()          # Record end time
        print(f"{func.__name__} ran in: {end_time - start_time:.6f} seconds")
        return result
    return wrapper

@timer  # Apply the timer decorator
def my_slow_function():
    """Write numbers 0 to 999 to a temporary file and return its path"""
    # Create a temporary file
    with tempfile.NamedTemporaryFile(delete=False, mode='wb') as temp_file:
        # Write data
        for i in range(1000):
            temp_file.write((str(i) + '\n').encode('utf-8'))  # Convert string to bytes and write
        temp_file_path = temp_file.name  # Get the path of the temporary file
    return temp_file_path

# Try it out:
print(my_slow_function.__name__)
print(my_slow_function.__doc__)


# Output:
# my_slow_function
# Write numbers 0 to 999 to a temporary file and return its path
```

`@wraps(func)` copies the metadata of `func` onto the `wrapper` function, ensuring that reflection and debugging tools see the original function's information.

## Parameterized Decorators

Notice that `@wraps(func)` accepts an argument (`func`). To write a custom decorator that accepts arguments, we must construct a decorator factory. This factory is a function that accepts our configuration parameters and returns the actual decorator. For example, suppose we want to write a decorator `@repeat(num_times=N)` that executes the decorated function $N$ times. Here is how we implement it:

```python
from functools import wraps

def repeat(num_times):
    """
    The decorator accepts an argument num_times, which determines how many times the decorated function is called.
    """
    def decorator_repeat(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(num_times):
                value = func(*args, **kwargs)
            return value
        return wrapper
    return decorator_repeat

# Use the decorator with arguments
@repeat(num_times=4)
def greet(name):
    print(f"Hello {name}")

# Call
greet("Qizhen")  # Output "Hello Qizhen" four times
```

In this code, `repeat(num_times)` serves as a decorator factory that returns the actual decorator, `decorator_repeat`. This decorator then takes `func` as an argument and returns the `wrapper` function, which handles the repetition logic.

## Applications

Timing functions is just one of many practical use cases for decorators. Let's explore several other common applications in Python development.

### Logging Function Calls

We can write a decorator to log function calls, capturing the function's name and arguments. This is incredibly helpful for tracing execution flow and debugging runtime behavior.

```python
from functools import wraps
import logging

def log(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        logging.info(f"[Debug] Called function {func.__name__}; positional arguments: {args}; keyword arguments: {kwargs}")
        return func(*args, **kwargs)
    return wrapper
```

In this example, `wrapper` uses `logging.info` to output a diagnostic message before invoking the decorated function, detailing its name and argument values. We can apply and test the decorator like this:

```python
# Configure logging system to print messages to the console
logging.basicConfig(level=logging.INFO)

@log   # Decorator
def add(x, y):
    """Addition function, just used for testing the decorator"""
    return x + y

# Call the test function and observe the log output
print(f"Test function result: {add(5, y=7)}")
```

Running this test outputs both the logged details and the final function result:

```markdown {1}
INFO:root:[Debug] Called function add; positional arguments: (5,); keyword arguments: {'y': 7}
Test function result: 12
```

### Caching Function Results

Caching (or memoization) stores function outputs based on their inputs, preventing redundant calculations. Consider the following implementation:

```python
from functools import wraps

def memoize(func):
    cache = {}
    @wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper
```

In this decorator, `cache` is a dictionary defined in the enclosure. The `wrapper` checks if `args` already exists as a key in `cache`. If it does, it returns the cached value directly; otherwise, it computes the value, caches it, and then returns it. This technique is highly effective for optimizing expensive functions that are repeatedly called with the same inputs.

When we introduced recursive functions, we covered a [memoized recursion](recursive#recursion-with-caching-memoization) algorithm. With this decorator, there is no need to modify the function code to add caching; you simply add the decorator to a function that previously lacked caching:

```python
@memoize
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)

# Test
print(fibonacci(30))  # With caching, we can easily compute large Fibonacci numbers
```

Note: The simple caching implementation above requires that the function's arguments be hashable, meaning the arguments cannot contain mutable objects like lists or dictionaries. If you need to handle complex arguments, it is recommended to use `functools.lru_cache` from Python's standard library.

### Parameter Validation

When writing functions, a defensive programming best practice is to validate input arguments. If an argument is invalid, the function should raise an exception. Writing repetitive validation code across multiple functions can clutter your codebase. Instead, you can encapsulate validation logic inside a decorator to keep functions clean. For example, let's write a decorator `@validate_positive` that checks if any input argument is less than or equal to zero:

```python
from functools import wraps

def validate_positive(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        # Check positional arguments
        if any(arg <= 0 for arg in args):
            raise ValueError("Positional arguments must be positive numbers!")
        # Check keyword arguments
        if any(val <= 0 for val in kwargs.values()):
            raise ValueError("Keyword arguments must be positive numbers!")
        return func(*args, **kwargs)
    return wrapper
```

In this decorator, the `wrapper` function uses the built-in `any()` function to check if any positional argument or keyword argument value is less than or equal to zero. If it finds one, it raises a `ValueError`; otherwise, it executes the target function.

The `any()` function returns `True` if at least one element in an iterable is truthy; otherwise, it returns `False`. Conversely, the `all()` function returns `True` only if all elements in the iterable are truthy. Both are handy when performing batch checks on collections.

The following function calculates the total weight of several items. If any input item weight is non-positive, the decorator blocks execution and raises an error:

```python
@validate_positive
def get_total_weight(*args):
    result = 0
    for weight in args:
        result += weight
    return result

# Test
print(get_total_weight(1, 2, 3, 4, 5))

# Running the code below will raise a ValueError because of the negative argument
# print(get_total_weight(1, 2, 3, 4, -5))
```

### Permission Checking

Decorators are widely used in web frameworks and enterprise systems to handle authorization and access control, restricting functions to authorized users only:

```python
from functools import wraps

def requires_permission(permission):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Try to get the user object
            user = None
            if args:
                user = args[0] # Assume the first positional argument is user
            elif 'user' in kwargs:
                user = kwargs['user'] # Or get it via keyword
            
            # Perform check (make sure user exists and has a permissions attribute)
            if user and hasattr(user, 'permissions') and user.permissions.get(permission):
                return func(*args, **kwargs)
            
            raise PermissionError(f"Insufficient permissions or unidentified user")
        return wrapper
    return decorator
```

In this example, the `wrapper` function attempts to locate a `user` object from the function's arguments. It then inspects the user's permissions. If the user lacks the required permission, it raises a `PermissionError`. To demonstrate this setup, we can define a simple `User` class and test the permission checks:

```python
# User class for demonstration purposes; it simply defines whether each user has permission for a specific operation
class User:
    def __init__(self, name, permissions):
        self.name = name
        self.permissions = permissions

# Suppose we have two users: one with document edit permissions and one without:
editor = User("Manager Brown", {'edit': True})
viewer = User("Alex", {'edit': False})

# The function below requires permission checking
@requires_permission('edit')
def edit_document(user, document):
    return f"{user.name} edited the document: {document}"


# Test:
print(edit_document(editor, "Project Plan 2033"))     # Should allow editing

try:
    print(edit_document(viewer, "Salary Adjustment Plan"))  # Should raise an exception
except PermissionError as e:
    print(e)  # Print error message
```

Running this demonstration produces the following output:

```
Manager Brown edited the document: Project Plan 2033
Insufficient permissions or unidentified user
```

### Retry

Certain operations, such as network requests or database connections, are prone to transient runtime failures. We can write a decorator to automatically retry a function a specified number of times with a delay between attempts before finally raising an exception:

```python
import time
from functools import wraps

def retry(attempts=3, delay=1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt < attempts - 1:
                        time.sleep(delay)
                        continue
                    else:
                        raise  # Directly raise to preserve the complete original exception traceback
        return wrapper
    return decorator
```

The `@retry` decorator catches exceptions raised by the target function. If the execution fails, it waits for the specified `delay` and retries, up to the maximum number of `attempts`. If the function continues to fail after all attempts are exhausted, the exception is re-raised. Let's test this decorator with a function that fails randomly:

```python
import random

@retry(attempts=5, delay=2)
def may_fail_func():
    """A function that may fail"""
    if random.randint(0, 1) == 0:
        print("Function execution failed!")
        raise ValueError("Multiple random numbers are 0.")
    return "Function execution succeeded!"

try:
    result = may_fail_func()
    print(result)
except ValueError as e:
    print(f"Still failed after multiple attempts: {e}")
```
