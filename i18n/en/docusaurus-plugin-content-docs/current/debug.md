# Debugging

An old saying in software development goes: "Software has bugs." Software can never be perfect. In computer programming and software development, a "bug" refers to an error or defect in program code that may cause the program to behave abnormally, crash, or produce incorrect results. The existence of bugs can affect the functionality, performance, or other expected behaviors of the software. Especially for beginners, the programs they write may have various problems, such as syntax errors, logic errors, data type errors, and so on. Usually, fixing the errors in a program is not difficult in itself; the key lies in how to locate the problem and identify the exact place where the error occurred. Debugging is the process of finding the problem within the program.

First, how do you know there is a problem in the program? Generally, it is when the program's behavior does not match expectations. For example, given an input value, the program's output is not the result we expected, or the program displays a bunch of error messages, or the program produces no output at all, the program is too slow, it crashes on its own, etc.

## Viewing the Program's Error Messages

If a serious error occurs in the program, Python usually raises an [exception](exception) and provides an error message along with a stack trace (traceback). First, the error message tells us what went wrong, such as ValueError, IndexError. The stack trace shows the order of function calls that led to the error. The bottom line indicates the direct cause of the error, while the lines above show the call relationships between functions. Based on these two pieces of information, you can usually determine the cause and location of the error.

If you still can't be sure what the problem is, you can try giving the program different inputs, or modifying a few suspicious parts of the code, while running the program several more times to verify the cause of the problem and whether the fix is effective. In addition, the following methods described in detail below are also very effective means of debugging programs and fixing bugs.

## print()

If the program itself does not provide useful error information, you can consider a rather crude but very effective method: printing out some key data and state during the program's execution.

When using this debugging method, first, insert some print functions around the potentially problematic code areas, especially before conditional statements, loops, or function calls, to print the relevant variables. You can place print functions at multiple locations in the code to check the order and flow of code execution. If the printed data does not match expectations after a certain step, the problem is likely there.

When using multiple print statements, consider adding labels or comments to them, so you can easily identify which print function each output comes from. For example:

```python
print("[Debug] Starting calculation", key_value)
# The calculation code being monitored
print("[Debug] Calculation finished", key_value)
```

Once the problem has been resolved, remember to delete or comment out the print functions to keep the code clean.

Although modern development environments provide advanced debugging tools, the print function debugging method remains the first choice for many Python developers in many situations, especially for simple programs and small projects.

## Logging

Although the print function is useful, there are some situations where it cannot be used. For example, the program might be running on a device without a display (network devices, embedded devices, etc.); or there is too much data being printed, and the data on the screen flashes by before you can read it clearly. In such cases, we can consider logging for debugging.

Logging means recording all the data we need to view into a file, which allows us to record more data for detailed post-mortem analysis.

Using logging for debugging is a very effective method, especially for large-scale, production, or multi-threaded, asynchronous applications. Logging provides a way to continuously record the program's execution, which is very valuable for subsequent analysis and troubleshooting. Here are the steps to use logging for debugging programs:

### Import the Logging Module

In Python, logging-related operations are in the built-in `logging` module. Before using logging, you need to import this module in your program:

```python
import logging
```

### Configure Logging

By configuring logging at the start of the program, you can choose the format of the logs, the save location, etc., for easy reading later.

```python
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    filename='app.log', filemode='w')
```

In the above program:
* `logging.basicConfig()` is a method provided by the logging module for configuring logging.
* The `level` parameter sets the log level, detailed below.
* `format='%(asctime)s - %(levelname)s - %(message)s'` defines the format of the log output. Where:
   * `%(asctime)s` is replaced by the log record's timestamp.
   * `%(levelname)s` is replaced by the log level (such as "DEBUG", "INFO", etc.).
   * `%(message)s` is replaced by the actual log message.
* `filename='app.log'` indicates that log messages are written to a file named `app.log` instead of the default console or terminal output.
* `filemode='w'` specifies the file mode. `'w'` means that if the `app.log` file already exists, it will be overwritten (i.e., cleared first and then new logs written). If you want to append to an existing log file, you should use `'a'` as the `filemode` value.

With the above settings, after the program runs, we will see content similar to the following in the log file `app.log`:

```
2023-09-22 15:37:14,528 - DEBUG - This is a debug message
2023-09-22 15:37:15,530 - INFO - This is an info message
```

Note: `logging.basicConfig()` must be called before all other logging operations. If other modules (including third-party libraries) have already called it before, your configuration will not take effect. It is designed to be configured only once.

### Choose the Appropriate Log Level

When viewing and analyzing logs, we may need to handle recorded content differently depending on its importance. Therefore, when recording logs, it is best to assign an appropriate level to each message. The levels of information in log files are as follows:

- DEBUG: Detailed information, typically useful only for diagnosing problems.
- INFO: Confirmation that the program is running as expected.
- WARNING: Indicates that something unexpected happened, or may happen in the future.
- ERROR: Indicates that a more serious problem has occurred, and the program has failed to perform a function.
- CRITICAL: A serious error, the program may not be able to continue running.

If you specify a certain level when configuring logging, only messages at that level or higher severity will be recorded in the log. For example, if the level is set to WARNING, the log will record WARNING, ERROR, and CRITICAL level messages, while DEBUG and INFO level messages will not be recorded.

### Add Log Records in the Code

Next, add log records at key points in the program or where errors might occur. For example, where you previously used the print function for debugging, you can replace it with log records:

```python
logging.debug(f"Starting calculation {key_value}")
# The calculation code being monitored
logging.debug(f"Calculation finished {key_value}")
```

The logging function has an `exc_info` parameter, which, if set to true, will record the exception stack trace information in the log, for example:

```python
try:
    x = 1 / 0
except ZeroDivisionError:
    logging.error("An exception occurred", exc_info=True)
```

To simplify the code, the logging module provides a dedicated method `logging.exception()`, which by default records the exception stack trace information, equivalent to `logging.error(..., exc_info=True)`:

```python
try:
    x = 1 / 0
except ZeroDivisionError:
    # Automatically includes stack trace information, level is ERROR
    logging.exception("An exception occurred during calculation")
```

### Analyze the Log File

When the program exhibits errors or abnormal behavior, view the log file to find clues about exceptions, errors, or other important information. For small or short log files, simply opening the file and browsing may be sufficient. Search for specific keywords, error codes, or other identifiers to quickly locate problems. For large programs with extensive log content, you can consider using auxiliary text editing and filtering tools to search through the content. For particularly complex records, there are many professional log analysis tools and software available on the market, such as Logstash, Graylog, Splunk, etc.

### Log Rotation and Management

In production environments, DEBUG level logging should generally not be used, as it may generate excessive log data and consume storage resources. Consider using the WARNING level.

Log files in long-running systems will gradually grow, and if not managed, they can also consume a large amount of disk space. Therefore, we can consider periodically archiving, compressing, or deleting logs.

In addition to using operating system tools, Python's logging module also comes with built-in log rotation functionality. Using `logging.handlers.RotatingFileHandler` can automatically split logs based on file size, and using `TimedRotatingFileHandler` can split logs based on time (e.g., daily). This approach is cross-platform and simple to configure.

## Assertions

Assertions are a debugging aid in Python. The core idea is: developers believe that certain expressions must be `True` at specific points in the program. If the value of these expressions is `False`, Python raises an `AssertionError` exception.

Assertions are accomplished using the `assert` statement, followed by an expression to be tested. If the result of that expression is `False`, an exception is triggered. For example:

```python
def apply_discount(product_price, discount):
    final_price = product_price * (1.0 - discount)
    assert 0 <= final_price <= product_price, "Invalid price"
    return final_price
```    
    
In the above example, we expect `final_price` to always be between 0 and `product_price`. If it is not, the assertion will fail and raise an `AssertionError`.

Assertions allow us to clearly define the expected behavior of the code within the program. If there is a problem in the program and its behavior differs from what we pre-defined, assertions can catch it immediately, preventing the error from affecting subsequent code. Assertions can also be used for function parameter checking, ensuring that the function's caller provides correct parameters; they can also be used for program configuration checks, ensuring that various preconditions of the program are met.

Be careful not to overuse assertions, as this can make the code difficult to read and maintain. Assertions can be globally disabled. In optimized mode (using the `-O` command-line switch), all assert statements are globally removed. Therefore, we cannot rely on assertions for critical data validation or to implement any critical logic in the final product.

Security warning: Never use `assert` to validate user input or execute critical business logic (such as permission checks). If someone runs your program with `python -O`, these checks will be directly ignored, leading to serious security vulnerabilities. Assertions are only for internal logic self-checks during development.

## Using an IDE

Many Integrated Development Environments (IDEs) provide powerful debugging capabilities for Python. For example, the most commonly used are PyCharm, VSCode, Eclipse with the PyDev plugin, etc. They usually provide a user-friendly interface for setting breakpoints, inspecting variables and stack information, stepping through code, etc. Debugging code in various IDEs is quite similar. Below, using PyCharm as an example, we provide a brief explanation:

### Set Breakpoints

In the code, click on the blank area next to the line number where you want to pause execution. This will set a red breakpoint marker at that location.

### Start the Debugger

In the top menu bar, select Run -> Debug. The program will stop at the breakpoint and enter debugging mode.

### View Variables and Expressions

When the code execution reaches a breakpoint, PyCharm will pause and display the debugger window. In this window, you can view the current variables, their values, and any expressions you want to evaluate.

### Control Code Execution

In the debugger window, you will see several buttons for controlling code execution:
* Continue (or press F9): Continue code execution until the next breakpoint or the end of the program.
* Step Over (or press F8): Execute the next line of code.
* Step Into (or press F7): Enter the function or method on the current line.
* Step Out (or press Shift + F8): Complete the execution of the current function or method, then pause.

### Change Variable Values

In the debugger window, you can right-click a variable and select "Set Value" to change its value.

### Conditional Breakpoints

You can set breakpoints to trigger only when specific conditions are met. Right-click a breakpoint and select "Edit". Here, you can set conditions, log expressions, etc.

### Exception Breakpoints

At the bottom of the debugger window, select "View Breakpoints" (or press Ctrl+Shift+F8). Here, you can configure settings to automatically pause when a certain exception occurs.

### View Call Stack

On the left side of the debug window, you can view the current call stack, which can help you understand how the code reached its current position.

### Quick Expression Evaluation

Select an expression in the code, then right-click and choose "Evaluate Expression" (or press Alt+F8) to evaluate the expression's result.

### End Debugging
In the debugger window, click the red square button to stop debugging.

## Using Python's Built-in pdb Module

If you are not using an IDE, you can use Python's built-in debugger, pdb, which allows you to set breakpoints, step through code, view variable states, etc., to help debug code. Here are the detailed steps for using pdb:

### Import pdb

First, you need to import the pdb module in your code:

```python
import pdb
```

### Set Breakpoints

Insert the following statement at the code location where you want to pause execution:

```python
breakpoint()
```

When the Python interpreter reaches this line, it will automatically pause and enter debugging mode.

You can also set conditions for breakpoints so they only trigger when specific conditions are met. For example, to pause execution when x is greater than 10, you can set it like this:

```python
if x > 10:
    breakpoint()
```

A commonly used setup is to have pdb pause at the location where an exception occurs when the program encounters one, using pdb's Post Mortem feature:

```python
try:
    # your code here
except:
    import pdb
    pdb.post_mortem()
```

This way, when an exception occurs, pdb will automatically start and arrive at the location where the exception happened.

### Common Debugging Commands

While the program is paused, you can enter the following commands to control the program flow:

* `h` or `help`: Display the help menu.
* `n` or `next`: Execute the next line of code, without entering functions.
* `s` or `step`: Execute the next line of code, stepping into a function if it is one.
* `c` or `continue`: Continue execution until the next breakpoint.
* `q` or `quit`: Exit the debugger.
* `p <expression>` or `print <expression>`: Print the value of an expression.
* `l` or `list`: Display the source code around the current location.
* `ll` or `longlist`: Display all source code of the current function.
* `u` or `up`: Move up in the call stack.
* `d` or `down`: Move down in the call stack.
* `b <line_number>`: Set a breakpoint at the specified line.
* `b`: Display all breakpoints.
* `cl <breakpoint_number>`: Clear a specific breakpoint.

## Using the pdb Command-line Tool

If you don't want to modify the program to insert breakpoints, you can also directly use the pdb command-line tool to start the Python program file.

```bash
$ python -m pdb your_script.py
```

Compared to debugging tools in IDEs, pdb might feel less intuitive, but with more use, you will find it to be a powerful tool that can help you better understand the execution flow and state of your code.
