# Exception Handling

An error handling mechanism is a way of dealing with exceptions or errors that occur during program execution. This mechanism allows a program to gracefully handle errors when problems arise, rather than crashing directly or producing unexpected behavior. Error handling is very important for building robust and reliable software. In Python, error handling is implemented through an exception mechanism. An "exception" can be understood as an unexpected error — it is a special event that occurs during program runtime and interrupts the normal flow of the program. Python provides an exception handling mechanism that can define specific response behaviors for exceptions.

## Default Behavior

If no exception catching is performed in a program, and an exception occurs, Python handles it in the following way:

1. Program termination: When Python encounters an unhandled exception, the program terminates immediately and code after the exception is not executed.
2. Error message output: Python displays an error message and a traceback (also called a stack trace). The error message tells us what went wrong, such as `ValueError`, `IndexError`. The traceback is like a record of the scene of the incident. The last line is usually the most critical — it tells you exactly what error occurred (such as `ZeroDivisionError`). The lines above tell you "who called whom," helping you trace back the path of code execution.

For example, the code below has a division by zero operation. We know that no number can be divided by zero, so it cannot run normally:

```python
def divide(x, y):
    return x / y

result = divide(1, 0)
print("Program continues running...")
```

Running the above code will produce output similar to the following:

```
Traceback (most recent call last):
  File "<filename>", line <linenumber>, in <module>
    result = divide(1, 0)
  File "<filename>", line <linenumber>, in divide
    return x / y
ZeroDivisionError: division by zero
```

The program terminates due to the error during division, so the subsequent `print("Program continues running...")` statement is never executed.

For simple programs, such as practice programs written while learning, an unhandled exception just causes the program to terminate, which is not a big problem. But for formal products, or complex applications such as web servers or GUI applications, unhandled exceptions can lead to more serious consequences, such as: disconnecting users, losing user data, failing to properly close or release opened resources, etc. Therefore, proper exception handling is very important — it not only helps developers diagnose and fix errors, but also ensures that the program can still gracefully abort or continue running when errors occur.

## Catching Exceptions

### Basic Usage

Python uses the `try` `except` statement to catch and handle exceptions:

```python
try:
    # Code that might throw an exception
    x = 1 / 0
    print("Program continues running...")
except ZeroDivisionError:
    # Handling code when ZeroDivisionError occurs
    print("Divisor cannot be 0!")
```

The code block under `try:` is the part we think might raise an exception.

The code block under `except ZeroDivisionError:` is used to handle the exception. `except` is followed by the type of exception. In this example, only `ZeroDivisionError` is handled. When the code in the `try` block raises a `ZeroDivisionError`, Python skips the remaining code in the `try` block and immediately executes the code in this `except` block. So running this code, we will only see the output: "Divisor cannot be 0!"

If you need to obtain the system's error information, you can assign the exception to a variable using the `as` operator:

```python
try:
    x = 1 / 0
except ZeroDivisionError as e:  # Variable e holds the error information
    print(e)                    # Output: division by zero
```

### Catching Multiple Exceptions

A `try` block can be followed by multiple `except` blocks to catch different types of exceptions, for example:

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

In this example, the user is first asked to enter a number. If the user enters 0, a `ZeroDivisionError` is triggered by the division operation. If the user enters something that is not a valid integer (such as a string), a `ValueError` is raised when trying to convert it to an integer. If the number entered is too small or too large, exceeding the index range of `some_list`, an `IndexError` is triggered.

Exception catching is ordered (top to bottom). If `Exception` (the base class of all exceptions) is caught first, the subsequent `ValueError` will never be caught. This is a common mistake made by beginners.

If the handling for multiple exceptions is the same, they can also be written in a single `except` statement, for example:

```python
try:
    x = int("a")
except (ZeroDivisionError, ValueError) as e:
    print("An exception occurred!")
    print(e)
```

### The else Clause

In a `try` `except` statement, an optional `else` clause can be used to define code that is executed only when no exception occurs, for example:

```python
try:
    x = 1 / 1
except ZeroDivisionError:
    print("Divisor cannot be 0!")
else:
    print("Everything is normal!")
```

In many cases, the `else` clause is not strictly necessary. For example, the above program could also put the code directly in the `try` block:

```python
try:
    x = 1 / 1
    print("Everything is normal!")
except ZeroDivisionError:
    print("Divisor cannot be 0!")
```

Using `else` primarily improves code readability. It clearly distinguishes code that might raise exceptions (placed in the `try` block) from code that is only executed when no exception occurs (placed in the `else` block).

`else` also has an important function: "narrowing the scope of the try block."

If all code is placed inside `try`, you might accidentally catch exceptions you don't want to catch (for example, an `IndexError` from subsequent logic being caught unintentionally).

Putting code that you are confident will not raise exceptions, or that you do not want to be caught by the current `except` block, into the `else` clause can avoid "accidentally masking errors." This is the deeper technical value of `else`.

### The finally Clause

In a `try` `except` statement, a `finally` clause can also be used. Regardless of whether the operations in the `try` block trigger an exception, the code in the `finally` clause will always be executed. No business logic should be placed in the `finally` clause; its sole purpose is cleanup and task finalization, such as closing opened files, releasing resources, resetting certain states, etc. For example:

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

In the example program above, within the `try` block, the `open` function is used to open the file "sample.txt" in read mode, and the returned file object is assigned to the variable `file`. Any opened file must be closed, and calling `file.close()` closes the file. However, placing `file.close()` inside the `try` block is unsafe because if any exception occurs before the `file.close()` statement, the program will skip it, leaving the file unclosed.

The correct approach is to put `file.close()` in the `finally` clause, so that regardless of whether an exception occurs, the program will call it and close the file.

Note that placing `file.close()` after the entire `try` `except` statement is also unsafe. Because there may still be uncaught exceptions within the `try` `except` statement, or it may actively raise other exceptions, both of which can cause the code after the `try` `except` statement to be skipped. Only placing it in the `finally` clause is safe.

```python
# This is an unsafe example
try:
    file = open("sample.txt", "r")
    x = 1 / 0
except ZeroDivisionError:
    print("Divisor cannot be 0!")
    # The following line is just for demonstration; it actively raises a demonstration exception
    raise ValueError("This is an actively triggered exception")
except FileNotFoundError:
    print("File not found!")

# Because an unhandled exception (ValueError) appeared in the above statement,
# the file close operation below will not be executed
file.close()
```

### Do Not Use return in a finally Statement

Using `return` in a `finally` statement can lead to unexpected behavior. For example, running the following program:

```python
def final_func():
    try:
        x = 1 + 2
        return x
    finally:
        return 0

print(final_func())
```

At first glance, `1+2` certainly won't cause an exception, so the program should print 3, but the actual result is 0. This is because the `return`, `break`, and `continue` statements inside the `try` block trigger the `finally` block, and the `return` in the `finally` block clears the previous information, leading to the unexpected result.

Beware: do not use `return` in a `finally` statement.

Using `return` in a `try` block is perfectly normal. But if `return` is also used in the `finally` block, it will override the return value from the `try` or `except` block, and can even swallow exceptions that should have been raised.

```python
def dangerous_func():
    try:
        return 1  # Intended to return 1
    finally:
        return 0  # finally's return forcibly overrides the result
```

Therefore, the best practice is: you can use `return` in `try`, but never write a `return` statement in a `finally` block.

## Raising Exceptions Actively

Even when the Python code itself hasn't produced any exception, we can use the `raise` statement to actively raise (or throw) an exception:

```python
if x < 0:
    raise ValueError("Cannot use a negative number!")
```

The code above actively raises a `ValueError` when it finds that a variable is less than zero.

By checking for error conditions in code and actively raising exceptions, we can ensure that the program does not continue executing in an inappropriate state. We can also provide clear error messages for exceptions, explaining the cause of the error, so that problems can be located more quickly when exceptions occur. In some cases, raising an exception can also serve as a way to forcefully exit a function, preventing it from continuing execution.

## Custom Exceptions

In Python, user-defined exceptions are typically subclasses of standard exceptions. The following content will be easier to understand after learning about [object-oriented programming and classes](oop).

Most user-defined exceptions should inherit from `Exception` or a subclass of `Exception`. In a custom exception class, the `__init__` method can be overridden to accept specific parameters. The `__str__` method can also be overridden to provide more detailed information about the cause of the exception.

For example, suppose we are writing an application that needs to handle employee-related operations. We could define the following two user-defined exceptions:

* `EmployeeNotFound`: Indicates that an employee was not found.
* `InvalidSalary`: Indicates that the salary contains invalid data, such as a negative number.

Here is the code to define these exceptions:

```python
class EmployeeError(Exception):
    """This is the base class for all employee-related exceptions."""
    pass

class EmployeeNotFound(EmployeeError):
    """Indicates that an employee was not found."""
    def __init__(self, employee_id):
        self.employee_id = employee_id

    def __str__(self):
        return f"Employee with ID {self.employee_id} was not found."

class InvalidSalary(EmployeeError):
    """Indicates that the salary contains invalid data, such as a negative number."""
    def __init__(self, salary_value):
        self.salary_value = salary_value

    def __str__(self):
        return f"Invalid salary value: {self.salary_value}. Salary must be between 500 and 50000."
```

Once the custom exceptions are defined, we can use them just like built-in exceptions:

```python
def set_salary(employee_id, salary):
    if salary < 0:
        raise InvalidSalary(salary)
    # ... rest of the function ...
```

Using custom exceptions with descriptive names can make code more readable and provide more contextual information for specific situations, helping callers handle different exceptions more precisely.

## When to Use Exceptions

When designing functions, we often face the choice of whether to raise an exception. For example, a function's input data should be a non-empty list, but the user might pass an empty list, or even data of another type. Should we make the function throw an exception, or return a special value (such as `None` or an empty list) instead?

There is no fixed answer to this; it depends on the specific situation, and many factors may influence our decision:

### Maintaining Consistent Behavior

When designing a function's behavior, we should also refer to how other functions in the same project — or even other projects in the company — handle things. It is best for different parts of the same project to maintain consistent behavior. If most functions in a project use exceptions to handle errors, then newly designed functions should also utilize the exception handling mechanism. Conversely, if most functions in a project use return values as the error handling mechanism (returning `None` on error, or meaningful data otherwise), then newly designed functions should adopt a similar approach.

Some companies or departments may have their own coding standards. If these standards specify which error handling mechanism to adopt, then those standards should be followed.

### Severity of the Error

For predictable, non-serious errors, it is generally not necessary to throw an exception. For example, if a function's input parameter is a list, then the possibility of an empty input list should be considered. In such a case, you could add logic inside the function to check the input parameter — if the input list is empty, directly return an empty value or `None`, rather than raising an exception.

If a function expects a list as an input parameter, but the user provides an integer, this is a more serious error, indicating that the user may not be using the function correctly. In this case, raising an exception can more prominently alert the user that an error has occurred.

### Runtime Efficiency

The exception handling mechanism has clear advantages: it has clear handling logic, can carry detailed error information, and supports complex processing flows. But it also has disadvantages, the main one being additional performance overhead, since it needs to carry more data and control more complex jump logic. From a code readability perspective, the exception handling mechanism is clearer; however, programs pursuing extreme performance may be better suited to using return values as the error handling mechanism.

It is worth noting that Python's exception handling mechanism is optimized — when no exception occurs, the `try` block runs very efficiently (with almost no additional overhead). Therefore, the Python community highly advocates the EAFP (Easier to Ask for Forgiveness than Permission) coding style: try to perform the operation first, and handle errors only if they occur, rather than writing `if` checks everywhere. This style is often more efficient and cleaner than checking return values everywhere.

### Error Messages

Regardless of which error handling mechanism is adopted, detailed explanations for errors must always be provided. Only in this way can users of the function easily understand how to handle the errors that arise.
