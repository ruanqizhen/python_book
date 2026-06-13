# Debugging

There is a classic adage in software development: "Software always has bugs." No program is perfect. In computer programming, a **bug** refers to a coding error, flaw, or defect that causes a program to behave unexpectedly, crash, or produce incorrect output. Bugs can compromise software functionality, performance, and security. Especially for beginners, programs often run into syntax errors, logical flaws, or data type mismatches. Fortunately, fixing errors is rarely the hard part; the real challenge lies in locating the exact line where the failure occurs. **Debugging** is the systematic process of finding and fixing these issues within your code.

Typically, you know there is a problem when your program's behavior diverges from expectations: it might produce incorrect output for a given input, display a wall of error messages, run excessively slow, freeze, or crash entirely.

## Viewing Program Error Messages

When a critical error occurs at runtime, Python raises an [exception](exception), stops execution, and prints a **traceback** (stack trace) to the console. The traceback contains two main parts:
1. **The Exception Type**: The very last line of the traceback tells you the direct cause of the error (such as `ValueError`, `IndexError`, or `ZeroDivisionError`).
2. **The Stack Trace**: The lines above the error message display the sequence of function calls that led to the failure, including file paths and line numbers.

By analyzing the traceback from bottom to top, you can pinpoint exactly where and why the program failed. If the cause is not immediately clear, you can try running the program with different inputs or isolating suspicious parts of the code to verify your assumptions.

## print() Debugging

If a program fails silently without raising an error, you can use a simple yet highly effective debugging technique: printing key variables and state information at strategic points during execution.

To do this, insert `print()` functions around suspicious blocks of code—especially before and after conditional checks, loops, or function invocations. This allows you to track variables and monitor the program's execution flow. If the output of a variable deviates from what you expect after a particular step, the bug is likely located in that section of code.

When using multiple print statements, it helps to label them so you can easily identify where each output originated:

```python
print("[Debug] Starting calculation. key_value =", key_value)
# Code being monitored
print("[Debug] Calculation finished. key_value =", key_value)
```

Once you resolve the issue, remember to delete or comment out these temporary print statements to keep your codebase clean.

While modern Integrated Development Environments (IDEs) offer sophisticated debugging tools, `print()` debugging remains a quick, practical, and widely used method for simple scripts and small projects.

## Logging

While printing is handy, it has limitations. For example, a program might run as a background service or on an embedded device without a physical display. Alternatively, a script might print so much data that it scrolls past too quickly to read. In these scenarios, **logging** is the preferred solution.

Logging means writing execution details and data points to a persistent log file, allowing you to review and analyze the program's history at your convenience. This is particularly valuable for large-scale, production, multi-threaded, or asynchronous applications.

### 1. Import the Logging Module

Python has a built-in `logging` module. To use it, import it at the top of your file:

```python
import logging
```

### 2. Configure Logging

You should configure the logging system when your program starts. This setup lets you define the log format, the file destination, and the default severity level:

```python
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    filename='app.log', filemode='w')
```

In this configuration:
* `logging.basicConfig()`: Configures the logging system.
* `level=logging.DEBUG`: Sets the minimum severity level to record (detailed below).
* `format`: Defines how each log entry is structured. 
  * `%(asctime)s` inserts the timestamp of the log entry.
  * `%(levelname)s` inserts the severity level (e.g., `DEBUG`, `INFO`).
  * `%(message)s` inserts the log message.
* `filename='app.log'`: Directs log output to a file named `app.log` instead of the console.
* `filemode='w'`: Opens the log file in write mode, clearing any old logs when the program starts. (Use `'a'` to append new logs to the end of the file instead).

After running a program with this configuration, the `app.log` file will contain entries like this:

```
2026-06-13 15:37:14,528 - DEBUG - Starting calculation
2026-06-13 15:37:15,530 - INFO - Calculation complete successfully
```

> [!NOTE]
> `logging.basicConfig()` must be called before any other logging actions. It is designed to run only once; subsequent calls to it in other modules will have no effect.

### 3. Choosing Log Levels

To manage log volume and find important messages quickly, categorize your logs by severity. Python provides five standard log levels:

* **DEBUG**: Detailed diagnostic information, primarily used during development.
* **INFO**: General confirmation that the program is running as expected.
* **WARNING**: An indication that something unexpected occurred, or a potential issue might arise (e.g., "disk space low"), but the program is still running.
* **ERROR**: A serious problem that prevented the program from executing a specific function.
* **CRITICAL**: A catastrophic failure that may cause the program to crash or stop running.

When you set a log level in `basicConfig()`, Python only records messages at that level or higher. For example, if you set the level to `WARNING`, Python will record `WARNING`, `ERROR`, and `CRITICAL` logs, but ignore `DEBUG` and `INFO` logs.

### 4. Adding Log Entries to Code

Replace your temporary print statements with permanent log calls:

```python
logging.debug(f"Starting calculation. key_value = {key_value}")
# Code being monitored
logging.debug(f"Calculation finished. key_value = {key_value}")
```

To record exceptions along with their traceback information, set the `exc_info` parameter to `True`:

```python
try:
    x = 1 / 0
except ZeroDivisionError:
    logging.error("An exception occurred", exc_info=True)
```

Alternatively, you can use `logging.exception()`, which automatically records the exception traceback at the `ERROR` level:

```python
try:
    x = 1 / 0
except ZeroDivisionError:
    # Automatically records the traceback
    logging.exception("An exception occurred during calculation")
```

### 5. Analyzing Log Files

When your program runs into an issue, check the log file for exceptions, warnings, or unexpected values. For small log files, you can browse through them in any text editor. For larger logs, use search functions (`Ctrl+F`), command-line utilities (like `grep`), or professional log aggregators (like ELK Stack or Splunk) to parse and filter the output.

### 6. Log Rotation and Management

In a production environment, you should avoid logging at the `DEBUG` level because it can generate massive files that consume disk space rapidly. The `WARNING` or `ERROR` level is usually preferred.

To keep log files from growing indefinitely, implement log rotation. Python's `logging.handlers` module provides built-in handlers for this:
* `RotatingFileHandler`: Automatically rolls over log files when they reach a certain size (e.g., keeping the last five 10MB log files).
* `TimedRotatingFileHandler`: Rolls over log files based on time intervals (e.g., creating a new log file every midnight).

## Assertions

Assertions are development aids that check if a given condition is met. The developer asserts that a specific expression must be `True` at a certain point in the code. If the expression evaluates to `False`, Python immediately raises an `AssertionError`:

```python
def apply_discount(product_price, discount):
    final_price = product_price * (1.0 - discount)
    assert 0 <= final_price <= product_price, "Invalid price calculation"
    return final_price
```

Here, we assert that the `final_price` must always fall between `0` and `product_price`. If it does not, the assertion fails and raises an `AssertionError` with the message `"Invalid price calculation"`.

Assertions serve as internal sanity checks to ensure that a function's arguments are valid or that assumptions about data are correct. They help you catch logic errors early before they propagate through the rest of the application.

> [!CAUTION]
> Assertions are only for internal developer checks and can be disabled globally at runtime by running Python with the `-O` (optimize) flag. 
> Never use `assert` to validate user input or enforce security checks (such as checking if a user is logged in). If the program is run with optimization, these assertions are stripped out completely, which can introduce severe security vulnerabilities.

## Debugging with an IDE

Modern Integrated Development Environments (IDEs) like PyCharm and VS Code offer interactive graphical debuggers. These tools let you pause execution, inspect variable states, and step through code line by line. While interface layouts differ, the workflow is consistent across IDEs:

### 1. Setting Breakpoints
Click the margin next to the line numbers in your code editor. A red dot (breakpoint) will appear, indicating that the debugger should pause execution when it reaches this line.

### 2. Starting the Debugger
Instead of running your script normally, click the bug icon or select "Debug" from the run menu. The program will start and then pause at your first breakpoint.

### 3. Inspecting Variables
Once paused, the IDE will display a debug panel showing all local and global variables and their current values. You can also add specific variables or expressions to a "Watch" list to monitor them as code executes.

### 4. Stepping Controls
Use the debugging toolbar to control execution:
* **Continue (F9)**: Resume execution until the next breakpoint.
* **Step Over (F8)**: Execute the next line of code in the current scope.
* **Step Into (F7)**: Enter the function call on the current line to debug its internal logic.
* **Step Out (Shift+F8)**: Finish the current function and return to the caller scope.

### 5. Modifying Variable Values
You can right-click any variable in the debug panel and change its value on the fly. This is useful for testing edge cases or bypassing specific conditions without editing your code.

### 6. Conditional Breakpoints
You can configure a breakpoint to only pause execution if a specific condition is met (e.g., pausing only when `loop_counter > 500`). Right-click the breakpoint and add a conditional expression.

## Using the Built-in pdb Module

If you are working in a terminal without a graphical IDE, you can debug your code using Python's built-in debugger module, **pdb**.

### 1. Starting the Debugger in Code

To pause your program and enter the interactive debugger, call the built-in `breakpoint()` function directly in your code (available in Python 3.7+):

```python
x = 10
breakpoint()  # The debugger will start here
y = 20
```

When Python reaches `breakpoint()`, it pauses execution and drops you into an interactive command-line interface.

If you want the debugger to start only when a specific error occurs, you can use pdb's post-mortem debugging:

```python
try:
    # Code that might crash
    result = 1 / 0
except:
    import pdb
    pdb.post_mortem()
```

If the script crashes, pdb will start at the exact stack frame that caused the exception, allowing you to inspect variables.

### 2. Common Debugger Commands

In the pdb prompt, use the following commands to inspect and step through your code:

* `h` (help): List available commands.
* `n` (next): Run the next line of code (does not step into functions).
* `s` (step): Run the next line of code, stepping into functions if possible.
* `c` (continue): Resume execution until the next breakpoint.
* `q` (quit): Exit the debugger.
* `p <expression>`: Print the value of the expression.
* `l` (list): Show the lines of source code surrounding the current line.
* `ll` (long list): Show all source code of the current function.
* `u` (up): Move up one level in the call stack.
* `d` (down): Move down one level in the call stack.
* `b <line_number>`: Set a breakpoint at the specified line number.
* `cl <breakpoint_number>`: Clear a specific breakpoint.

### 3. Running pdb from the Command Line

If you do not want to modify your source code to add breakpoints, you can launch your script directly through pdb from the terminal:

```bash
python -m pdb your_script.py
```

This starts the script at the very first line of code inside the debugger, allowing you to set up your breakpoints before execution starts.
