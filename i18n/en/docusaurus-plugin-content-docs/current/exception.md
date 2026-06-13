# Exception Handling

An error handling mechanism is a way of dealing with exceptions or errors that occur during program execution. This mechanism allows a program to gracefully handle errors when problems arise, rather than crashing or producing unexpected behavior. Robust error handling is essential for building reliable software. 

In Python, error handling is implemented through exceptions. An **exception** is a special event that occurs during program execution that disrupts the normal flow of instructions. Python's exception handling mechanism allows you to define specific response behaviors when these unexpected events occur.

## Default Behavior

If a program does not catch exceptions, Python handles them in the following way:

1. **Program Termination**: When Python encounters an unhandled exception, it terminates the program immediately. Code following the exception is not executed.
2. **Error Message Output**: Python prints an error message and a traceback (stack trace) to the console. The traceback acts as a post-mortem record of where the exception occurred. The last line is the most critical: it tells you the exact exception type (such as `ZeroDivisionError`) and details. The lines above show the sequence of function calls that led to the error ("who called whom"), helping you trace the path of execution.

For example, the following code performs a division-by-zero operation, which is mathematically undefined and cannot run normally:

```python
def divide(x, y):
    return x / y

result = divide(1, 0)
print("Program continues running...")
```

Running this code produces output similar to the following:

```
Traceback (most recent call last):
  File "<filename>", line <linenumber>, in <module>
    result = divide(1, 0)
  File "<filename>", line <linenumber>, in divide
    return x / y
ZeroDivisionError: division by zero
```

Because the program terminates due to the error during division, the subsequent `print("Program continues running...")` statement is never executed.

For simple learning programs, an unhandled exception that causes the program to crash is not a major issue. However, for production-grade software (such as web servers or GUI applications), unhandled exceptions can have serious consequences: disconnecting users, losing unsaved data, or failing to release external resources (like database connections or files). Proper exception handling ensures that a program can either recover from errors or shut down gracefully.

## Catching Exceptions

### Basic Usage

Python uses the `try` ... `except` block to catch and handle exceptions:

```python
try:
    # Code that might throw an exception
    x = 1 / 0
    print("Program continues running...")
except ZeroDivisionError:
    # Handling code when ZeroDivisionError occurs
    print("Divisor cannot be 0!")
```

The code block under `try:` contains the statements that might raise an exception.

The code block under `except ZeroDivisionError:` handles the error. The `except` keyword is followed by the specific exception type. In this example, only `ZeroDivisionError` is caught. When the code in the `try` block raises a `ZeroDivisionError`, Python immediately skips the remaining lines in the `try` block and jumps to the `except` block. Running this code yields only: `"Divisor cannot be 0!"`

To inspect the system's error message, you can bind the exception object to a variable using the `as` keyword:

```python
try:
    x = 1 / 0
except ZeroDivisionError as e:  # Variable e holds the error information
    print(e)                    # Output: division by zero
```

### Catching Multiple Exceptions

A `try` block can be followed by multiple `except` blocks to handle different types of exceptions:

```python
try:
    num = int(input("Enter a number: "))
    result = 10 / num
    some_list = [1, 2, 3]
    print(some_list[num])

except ZeroDivisionError:
    print("Divisor cannot be 0!")

except ValueError:
    print("Please enter a valid number!")

except IndexError:
    print("Index out of range!")
```

In this example, the user is prompted to enter a number:
- If the user enters `0`, the division triggers a `ZeroDivisionError`.
- If the user enters a non-integer string (e.g., `"abc"`), the `int()` conversion raises a `ValueError`.
- If the user enters a number that is out of bounds for `some_list`, an `IndexError` is triggered.

Exception handling is evaluated sequentially from top to bottom. If you catch a generic `Exception` (the base class for most standard exceptions) in the first `except` block, it will swallow all exceptions, and the more specific blocks below it (like `ValueError`) will never run. This is a common pitfall to avoid.

If the handling logic for multiple exceptions is identical, they can be grouped into a parenthesized tuple:

```python
try:
    x = int("a")
except (ZeroDivisionError, ValueError) as e:
    print("An exception occurred!")
    print(e)
```

### The else Clause

An optional `else` clause can be added after the `except` blocks. Code in the `else` block executes only if the code in the `try` block runs without raising any exceptions:

```python
try:
    x = 1 / 1
except ZeroDivisionError:
    print("Divisor cannot be 0!")
else:
    print("Everything is normal!")
```

While you could theoretically append this success logic to the end of the `try` block itself, using `else` is a best practice. It clearly separates code that might raise exceptions (placed in the `try` block) from code that is guaranteed to run only if the `try` block succeeds.

Technically, the `else` clause helps "minimize the scope of the `try` block." If you place all subsequent code inside `try`, you might accidentally catch an exception you didn't intend to catch (for example, catching an `IndexError` thrown by later processing logic rather than the initial statement). Keeping the `try` block as small as possible prevents "accidental error masking."

### The finally Clause

The `finally` clause defines clean-up actions that must be executed under all circumstances, whether or not an exception was raised. You should not place core business logic here; it is reserved for finalizing tasks and releasing resources, such as closing open files, disconnecting database connections, or resetting states:

```python
file = None  # Define file first
try:
    file = open("sample.txt", "r")
    x = 1 / 0
except FileNotFoundError:
    print("File not found!")
except ZeroDivisionError:
    print("Divisor cannot be 0!")
finally:
    if file:  # Only close if the file was successfully opened
        file.close()
```

In this example, the `try` block opens a file and assigns it to the `file` variable. The file must be closed when we are done. Putting `file.close()` at the end of the `try` block is unsafe: if an exception occurs before that line, the function exits early and the file remains open. Placing it in the `finally` block ensures that `file.close()` executes even if the division-by-zero error occurs.

Relying on putting clean-up code after the entire `try` ... `except` structure is also unsafe. If an uncaught exception occurs, or if you re-raise an exception in the `except` block, the trailing code will be skipped:

```python
# This is an unsafe example
try:
    file = open("sample.txt", "r")
    x = 1 / 0
except ZeroDivisionError:
    print("Divisor cannot be 0!")
    # Actively raise a ValueError to demonstrate
    raise ValueError("This is an actively triggered exception")
except FileNotFoundError:
    print("File not found!")

# Because ValueError propagates up, this line is never reached
file.close()
```

### Do Not Use return in a finally Statement

Using a `return` statement inside a `finally` block leads to unexpected and undesirable behavior. Consider this function:

```python
def final_func():
    try:
        x = 1 + 2
        return x
    finally:
        return 0

print(final_func())
```

Even though `1 + 2` evaluates successfully, the function prints `0`. When Python encounters `return`, `break`, or `continue` inside a `try` block, it still executes the `finally` block before exiting. If the `finally` block contains its own `return` statement, that return value overrides the one from the `try` block.

Even worse, a `return` in a `finally` block will silently swallow any exceptions raised in the `try` or `except` blocks:

```python
def dangerous_func():
    try:
        raise ValueError("An error occurred")
    finally:
        return "Everything is fine"  # Swallows the ValueError!
```

**Rule of thumb**: Never use `return`, `break`, or `continue` inside a `finally` block.

## Raising Exceptions Actively

You can actively raise (or throw) exceptions in your code using the `raise` statement, even if Python has not encountered an error:

```python
if x < 0:
    raise ValueError("Cannot use a negative number!")
```

By validation checking and actively raising exceptions, you prevent your program from running in an invalid state. Providing clear error messages with your raised exceptions helps other developers diagnose and locate issues quickly.

## Custom Exceptions

In Python, custom exceptions are created by subclassing standard exceptions. This concept is easier to understand after learning about [object-oriented programming and classes](oop).

Most custom exceptions should inherit from the built-in `Exception` class (or one of its subclasses). You can override the `__init__` method to accept specific arguments, and the `__str__` method to define how the error message should be formatted.

For example, in an HR application, you might define exceptions for when an employee is not found, or when a salary is invalid:

```python
class EmployeeError(Exception):
    """Base class for all employee-related exceptions."""
    pass

class EmployeeNotFound(EmployeeError):
    """Indicates that an employee was not found."""
    def __init__(self, employee_id):
        self.employee_id = employee_id

    def __str__(self):
        return f"Employee with ID {self.employee_id} was not found."

class InvalidSalary(EmployeeError):
    """Indicates that the salary contains invalid data."""
    def __init__(self, salary_value):
        self.salary_value = salary_value

    def __str__(self):
        return f"Invalid salary value: {self.salary_value}. Salary must be between 500 and 50000."
```

Once defined, custom exceptions are raised and caught exactly like built-in exceptions:

```python
def set_salary(employee_id, salary):
    if salary < 0:
        raise InvalidSalary(salary)
    # ... rest of the function ...
```

Custom exceptions with descriptive names make your API more readable and help callers handle different error conditions more precisely.

## When to Use Exceptions

When designing functions, you must decide whether to raise an exception or return a special value (like `None`, `False`, or an empty list) when an error occurs. There is no single correct answer, but several factors should guide your decision:

### Maintaining Consistent Behavior

Follow the design patterns established in the rest of your codebase or organization. If most of the functions in your project use exception handling for errors, new functions should do the same. If the codebase relies primarily on returning status codes or sentinel values (like `None` on failure), adhere to that pattern.

### Severity of the Error

For predictable, non-fatal edge cases, returning a special value is often sufficient. For instance, if a function takes a list of items and finds that the input list is empty, returning `None` or an empty list is a natural way to represent "no results."

However, if a function expects a list but receives an integer, this represents a programming bug (incorrect usage). Raising a `TypeError` is the best way to alert the developer of the mistake.

### Runtime Efficiency

Exception handling is highly structured and carries rich diagnostic data, but it incurs a performance overhead when exceptions are raised and caught. For applications where performance is critical and errors occur frequently, returning error codes or sentinel values can be faster.

However, Python's exception mechanism is highly optimized: a `try` block that does not raise an exception runs with virtually zero overhead. Consequently, the Python community strongly encourages the **EAFP** (Easier to Ask for Forgiveness than Permission) style—trying an operation first and catching potential errors, rather than cluttering code with preemptive `if` checks. This style is often cleaner, more readable, and more Pythonic.

### Error Messages

Regardless of whether you choose to raise exceptions or return special values, always document the expected error behaviors clearly in your function's docstring so that users know how to handle them.
