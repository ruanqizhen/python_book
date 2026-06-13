# First Python Program

## Welcome to the World of Programming!

This is a tradition in programming language books — the first sentence is always the greeting above. And the first program you write always prints "Hello, World!" We also follow this tradition, starting with Hello World.

To achieve this, you only need to run the following [statement](#statement):

```python
print("Hello, World!")
```

### Using an Online Editor

Using an online editor is very simple and requires no extra work. Open the online editor page, enter the line of code above, and run it. For example: [https://qizhen.xyz/pyodide](https://qizhen.xyz/pyodide) or [https://qizhen.xyz/brython](https://qizhen.xyz/brython).

### Running Directly in the Python Interpreter

If you don't use any IDE, you can open your computer's command line terminal, type `python` (on macOS or Linux you typically need to type `python3`) and press Enter. The system will start the Python interpreter. You should now see a `>>>` prompt, indicating that the Python interpreter is ready to accept commands.

After the `>>>` prompt, enter the following code:

```python
print("Hello, World!")
```

Then press Enter.

You should see the output:

```
Hello, World!
```

Congratulations! You have just written and run your first Python program.

### Using an Integrated Development Environment (IDE)

If you are using any of the IDEs introduced earlier, you typically need to create a file to save the program first. Copy the following line of code into the new file:

```python
print("Hello, World!")
```

Then save it as a file with a `.py` extension (e.g., `hello.py`). Finally, click the run button in the IDE to execute the program.

### Running a .py File

For a saved `.py` file, you can either open and run it in an IDE, or run it in a command line terminal. For example, suppose we have a file named `welcome.py` with the following content:

```python
name = input("What's your name?")
print(f"Hello, {name}! Welcome to the world of Python programming!")
```

Open the command line or terminal, navigate to the directory containing `welcome.py`. Enter the following command and press Enter:

```sh
python welcome.py
```

When the program prompts you to enter your name, type your name and press Enter.

You should now see a message like `Hello, ruanqizhen! Welcome to the world of Python programming!`.

## Python Syntax

The syntax of a programming language is a set of rules and conventions that define how to write and organize code so that a computer can understand and execute it. Just as the grammar of natural languages dictates how to construct sentences, the syntax of a programming language dictates how to construct the various elements of a program.

Python is known for its clean and readable syntax. Below we briefly introduce Python's syntax, mainly to help readers with experience in other programming languages quickly become familiar with Python's features. For inexperienced readers, if this introduction seems too general, don't worry — we will dive into the details later.

Like most mainstream programming languages, Python consists of lines of [statements](#statement). For example, the following program:

```python
print("Hello, World!")
```

In this statement, `print` is a function name. If you haven't encountered other programming languages before, you can think of functions as similar to mathematical functions: you pass data inside the parentheses following the function name, and the function outputs or produces a corresponding result. Here, the input data is the string "Hello, World!". In Python, content between double quotes represents a string. The result of `print` is to display the input string on the screen.

If you run:

```python
print(1+2)
```

Now the content inside the `print` function parentheses is no longer a string, but a numerical expression. Python will first evaluate the expression (which is 3), and then print the result `3`.

If the program has multiple lines of code, such as:

```python
name = input("What's your name? ")
print(f"Hello, {name}! Welcome to the world of Python programming!")
```

Then the program generally executes line by line from top to bottom. In the example above, `input` is also a function; its main purpose is to pause program execution and wait for user input. The text inside the parentheses is a prompt that is displayed on the screen first to tell the user what to enter. `name` is a variable used to store the data returned by the `input` function (i.e., the content entered by the user via the keyboard). The subsequent `print` function prints the string data along with the content of the `name` variable on the screen.

Program statements typically consist of data, variables, operators, expressions, and other components. Below we briefly explain these parts and some other common programming terminology:

### Data

Data is the basic information stored and processed in a program. In the example programs above, the numbers `1`, `2`, the text `"Hello, World!"`, etc., are all data within the program. Python supports multiple data types for storing different kinds of information. The most common data types include:
- Numeric types: such as integers (int) and floating-point numbers (float). For example: `42`, `3.14`
- String type: a sequence of characters enclosed in quotation marks, for example: `"Hello, World!"`
- Boolean type: represents logical values `True` and `False`, used for conditional evaluation.
- Collection types like lists and dictionaries: used to store collections of multiple data items. For example, a list (`list`) can contain multiple elements like `[1, 2, 3]`, and a dictionary (`dict`) stores data using key-value pairs like `{"name": "Alice", "age": 30}`.

We will cover data in detail in the [Data and Variables](variable) section.

### Variable

A variable is a named space used to store data. You can assign data to a variable and use the variable to manipulate the data. In Python, variables do not require type declarations; you can directly assign values using the equals sign. For example:

```python
age = 25             # Integer type
name = "Alice"       # String type
is_student = True    # Boolean type
```

In each line above, the text to the left of the equals sign is the variable name, which can contain letters, digits, and underscores, but cannot start with a digit. The right side of the equals sign is the variable's data. We will discuss variables in detail in the [Data and Variables](variable) section.

### Operator

An operator is a symbol used to manipulate data and variables, such as the arithmetic operators for addition, subtraction, multiplication, and division (`+` `-` `*` `/`). Python also has operators for handling other types of data. We will introduce these operators in detail in the [Basic Mathematical Operations](calculation) section.

### Keyword

In programming languages, a keyword is a word that has been given special meaning by the language, used to define syntax and structural rules. Keywords are part of the programming language and are predefined in the language specification; we can use them directly when programming. Because keywords have special meanings, they are reserved words that can only be used for specific purposes and cannot be used as variable names, function names, or other identifiers. Using a keyword as an ordinary identifier, such as a variable name, will cause a syntax error.

Commonly used keywords in Python include if, else, for, etc. Running the following code will print all keywords in Python:

```python
import keyword
print(keyword.kwlist)
```

We will introduce these keywords in detail in subsequent chapters.

### Identifier

An identifier is a name used to name variables, [functions](function), [classes](class), or other user-defined objects. An identifier is a unique name in a program that can be used to label and reference an object.

The definition of identifiers must follow these rules:

- Composed of letters (a-z, A-Z, or characters from other languages), digits (0-9), and underscores (_).
- The first character must be a letter or underscore, not a digit.
- Must not conflict with Python keywords.
- Special symbols such as spaces, @, $, %, etc., are not allowed.

For example, some valid identifiers: `my_variable`, `_privateVar`, `var1`, `Σ_value`;
The following are invalid identifiers: `1variable`, `var-name`, `me@qq.com`, `def`, `my var`.

Identifiers can contain [Unicode characters](string#字符串和字节之间的转换). Unicode is a character set that covers all characters from the world's writing systems. This allows identifiers to use any language (such as Chinese, Greek, etc.). We can take advantage of this to write Python programs using Chinese, as in this [example program](miscellaneous#纯中文编程).

Python identifiers are case-sensitive (e.g., uppercase A and lowercase a represent different identifiers). However, for equivalent Unicode characters (such as fullwidth and halfwidth letters), Python treats them as the same identifier. The definition of equivalent characters in Unicode is quite complex, and most people cannot remember all equivalent characters. Using Chinese characters for identifiers can be an advantage for developers who are not familiar with English. However, because equivalent characters exist in Unicode and the character set contains many visually similar but differently encoded characters, this can make programs difficult to understand and debug. Therefore, you should try to use only English letters as identifiers. The following example only serves to demonstrate some valid identifiers, but this practice is not recommended:

```python
变量 = 42
print(变量)             # Using Chinese characters as variable names

ｐｒｉｎｔ("Fullwidth letters")   # Fullwidth English letters as function name, equivalent to print(); fullwidth and halfwidth letters are equivalent

ﬁ = 1
print(fi)              # ﬁ, fi, and ｆｉ are the same identifier

xⁿ = 1
print(xn)              # xⁿ and xn are the same identifier

var = 1
print(Var)             # Error, because var and Var are two different identifiers
```

### Expression

An expression is a term in computer science that refers to a unit of code that can be evaluated to produce a value. It is a sequence of data, variables, and operators that always produces or returns a result. Expressions can be very simple, such as a single number or variable, or more complex, such as an entire mathematical formula or a function call.

Here are some examples of expressions:

- `3 + 4`  returns 7
- `"Hello" + " " + "World"`  returns "Hello World"
- `my_function(2, 3)` returns the result of calling the function `my_function`
- `print("Hello World")` returns `None`

Some functions may appear to have no return value. For example, we typically don't assign the return value of `print()` to any variable (such as `x = print(1)`). But in reality, all functions in Python have a return value; if not explicitly specified, they return `None` by default.

In Python, you can place an expression anywhere a value is needed, such as a function argument, a condition in an if statement, or as part of another expression.

An expression can be placed directly as a single line of code in a program. Some editing environments, when running a program, will print the result of the last expression in the program to help the developer inspect it.

### Statement

A statement is a complete command that performs an action. Unlike an expression, a statement does not return a value; it instructs the program to do something, such as declaring a variable, performing a conditional check, executing a loop, etc. For example:

- `x = 3 + 2`  Assignment statement
- `if x > 0`   Conditional control statement

A statement in Python is a complete sentence that cannot be part of another statement or expression.

If you separate statements with semicolons, you can write multiple statements on a single line. Some other programming languages do this as well, but it does not conform to Python's coding standards. When writing programs, you should place only one statement per line to improve clarity and readability.

### Comment

A comment is used to explain and annotate code; it does not affect program logic. Comments are typically intended to help people read and understand the program more easily.

Python has two ways to add comments:
- Single-line comments: start with `#`. All content after the `#` character on a line is a comment.
- Multi-line comments: Python does not have a dedicated multi-line comment syntax, but you can use text enclosed in three single quotes `'''` or three double quotes `"""` as a multi-line comment block. If this text is not assigned to a variable, Python will ignore it at runtime.

The example program about variables shown earlier contains comments:

```python
age = 25             # Integer type
"""
This is also a comment
"""
```

### Code Block

A code block is a structure composed of multiple lines of code that are grouped together to perform a specific function or logical unit. Code blocks are commonly used in structures such as [conditional statements](condition), [loops](loop), [functions](function), and [classes](class) to clearly delineate and organize code logic.

In most programming languages, the boundaries of a code block are defined by specific symbols (such as curly braces `{}`, parentheses `()`) or specific keywords (such as begin and end). In Python, the way code blocks are defined is quite special — it relies on indentation to indicate the hierarchy and logical relationships of code.

Indentation is a common concept in programming, referring to a certain amount of whitespace at the beginning of a line of code, followed by the actual code. In languages that use specific symbols to define code blocks, indentation is only for aesthetics and readability, and does not affect program logic. But in Python, due to the special design of using indentation to define code blocks, different indentation directly changes program logic.

This design decision in Python aims to make code more readable and encourage programmers to write well-structured, clean code. Within the same code block, the indentation of each line must be consistent. This means that if you use four spaces for indentation, you must use four spaces throughout the entire code block. The official Python style guide (PEP 8) recommends using 4 spaces as the standard indentation size.

In the example programs we've seen earlier, each line of code only had simple sequential logic, so each example program had only one code block, and indentation was not a concern. However, subsequent program examples will become more complex and will contain multiple code blocks.

At first, people thought indentation was error-prone — one extra or missing space would cause problems. After all, in other languages, indentation only affects appearance, not logic, so it tends to be overlooked. However, over time, people quickly found that this concern was unnecessary. Once accustomed to Python's code grouping style, indentation did not cause more errors; instead, it significantly improved code cleanliness and maintainability.

Below, we use Python's two main control structures, as well as functions, as examples to demonstrate the meaning of code blocks.

## Code Execution Flow

As introduced earlier, if there are multiple lines of code, the program generally executes line by line from top to bottom. For example:

```python
print("First line")
print("Second line")
print("Third line")
```

In the example above, each line has 0 indentation, and they are all in the same code block. Code within the same code block always executes sequentially, line by line.

However, many times we need to change the flow of code execution. For example, when certain conditions are met, we may need to skip some code or repeat some code. In such cases, we need to use control structures to manage the flow of code execution. Python's main control structures include [conditional statements](condition) and [loop structures](loop), allowing the program to branch or repeat execution based on conditions.

This book will discuss these two control structures in detail in later chapters. However, because they are so commonly used, it's necessary to briefly introduce their basic usage first, which will also help readers quickly understand Python's usage.

### Conditional Statements

Python uses the `if` and `else` keywords to perform conditional checks. When encountering an if statement, it decides whether to execute the corresponding code block based on whether the condition expression is true or false. The code block is executed if the condition is met, and skipped if it is not:

```python
age = 18
if age >= 18:
    print("Adult")
    print("This is the sub-block of if")
else:
    print("Minor")
    print("This is the sub-block of else")
```

In the code above, the program first checks whether `age >= 18` is `True`. If the condition is true, it executes the sub-block under the `if` statement, i.e., all lines starting from the next line after `if` that are indented by 4 spaces. If the condition is false, it executes the sub-block under the `else` statement, i.e., all lines starting from the next line after `else` that are indented by 4 spaces.

### for Loop

Python has two commonly used loop structures: the `for` loop and the `while` loop. The `for` loop is used to iterate over sequences (such as lists, tuples, strings, etc.) or a range of numbers.

The following program demonstrates how to use a `for` loop to iterate over data in a list:

```python
# Iterating over a list
fruits = ["apple", "banana", "pear"]
for fruit in fruits:
    print(fruit)
    print("This is the code block of the for loop")
```

This program first defines a list `fruits` containing three fruit names. `for fruit in fruits:` means using a for loop to iterate over each element in the list. The `fruit` variable sequentially represents each fruit in the list within the loop body. For example, on the first iteration, the `fruit` variable has the value "apple"; on the next iteration, the value becomes "banana".

Each iteration of the loop executes the code block within the loop body, i.e., all lines starting from the next line after the `for` statement that are indented by 4 spaces.

Let's look at another example of iterating over a range of numbers:

```python
# Iterating over a range
for i in range(3):  # range(3) generates 0, 1, 2
    print(i)
    print("This is the code block of the for loop")
```

`range()` is a function often used together with the `for` loop. We will [introduce it in detail later](loop#range-函数). For now, we only need to know that `range(n)` can generate a set of integer values from 0 to n-1. Using a `for` loop to iterate over this range, the variable `i` sequentially represents each number in the range on each iteration.

### while Loop

The main difference between the `while` loop and the `for` loop is that the number of iterations in a `while` loop is typically not predetermined. The `while` loop repeatedly executes its code block as long as the condition is `True`, and exits the loop when the condition becomes `False`. For example:

```python
count = 0
while count < 3:
    print("Loop count:", count)
    count += 1  # Update count value, otherwise it becomes an infinite loop
```

In this example, the `while` loop continues executing as long as `count < 3` is `True`. Once `count` reaches 3, it exits the loop.

### Function

A function is a fundamental concept in programming, referring to a block of code with a specific purpose. It receives input (parameters), executes code logic to complete a task, and can return one or more results. Functions help us modularize code, making it more structured, readable, maintainable, and reusable. In the examples above, we have already seen some built-in Python functions such as `print()` and `range()`. We will [explain functions in detail in a later chapter](function). For now, let's look at a few simple examples to understand the basic usage of functions:

A basic Python function definition is as follows:

```python
def function_name(parameters):
    statement_1
    statement_2
    ...
    return expression
```

A function definition starts with the `def` keyword, indicating the definition of a new function. Immediately after `def` is the function name, which follows the same naming rules as variables. After the function name comes the parameter list, enclosed in parentheses `()`. The parameter list can be empty or contain one or more parameters separated by commas. A colon `:` must follow the parameter list, marking the end of the function header, after which the function body begins. The function body contains the actual code logic and must be indented one level. `return` is used to return the result of the function's computation; if the function does not need to return any result, `return` can be omitted.

Below we write a simple function that calculates the sum of two numbers:

```python
def add(a, b):
    result = a + b
    return result
```

In this example: `add` is the name of the function. `a` and `b` are the function's parameters. `result = a + b` is the function's processing logic. The `return` statement returns the result to the caller.

We can call this function multiple times to calculate different sums:

```python
print(add(3, 5))     # Prints 8
print(add(10, 20))   # Prints 30
```

Using functions has many advantages, such as:
- Code reuse: Once a function is defined, it can be called multiple times in the code without rewriting the logic.
- Modularity: Breaking down large tasks into small, manageable code blocks makes code easier to understand and debug.
- Simplified code: Function calls make the main program more concise and clear.
- Easy maintenance: Modifying the function code automatically affects all call sites, reducing the chance of errors.
