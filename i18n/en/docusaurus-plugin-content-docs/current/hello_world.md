# First Python Program

## Welcome to the World of Programming!

It is a tradition in programming books that the first sentence is always the greeting above. And the first program you write almost always prints "Hello, World!" We follow this tradition here, starting with our own version of Hello World.

To do this, you only need to run the following [statement](#statement):

```python
print("Hello, World!")
```

### Using an Online Editor

Using an online editor is simple and requires no setup. Open an online editor, enter the code above, and run it. For example, you can use: [https://qizhen.xyz/pyodide](https://qizhen.xyz/pyodide) or [https://qizhen.xyz/brython](https://qizhen.xyz/brython).

### Running Directly in the Python Interpreter

If you are not using an IDE, open your terminal or command prompt, type `python` (or `python3` on macOS/Linux), and press Enter. This launches the Python interpreter. You will see a `>>>` prompt, indicating that the interpreter is ready to accept commands.

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

If you are using one of the IDEs introduced in the previous section, you will first need to create a file to save your code. Copy the following statement into the new file:

```python
print("Hello, World!")
```

Then save it as a file with a `.py` extension (e.g., `hello.py`). Finally, click the run button in the IDE to execute the program.

### Running a .py File

Once you have saved your `.py` file, you can run it either inside your IDE or directly from the terminal. For example, suppose you have a file named `welcome.py` with the following content:

```python
name = input("What's your name?")
print(f"Hello, {name}! Welcome to the world of Python programming!")
```

Open your terminal, navigate to the directory containing `welcome.py`, type the following command, and press Enter:

```sh
python welcome.py
```

When prompted, type your name and press Enter.

You should see a message like: `Hello, ruanqizhen! Welcome to the world of Python programming!`.

## Python Syntax

A programming language's syntax is a set of rules and conventions that define how code must be written and structured so a computer can execute it. Just as natural grammar dictates how to build sentences, programming syntax governs how to construct code elements.

Python is famous for its clean, readable syntax. Below, we briefly introduce its core features to help readers with experience in other languages get up to speed. If you are new to programming and this overview feels a bit abstract, don't worry—we will dive into each detail in subsequent chapters.

Like most programming languages, a Python program is made of sequential [statements](#statement). For example:

```python
print("Hello, World!")
```

In this statement, `print` is the name of a function. If you are new to programming, you can think of a function like its mathematical counterpart: you pass input data inside the parentheses, and the function processes it to produce a result. Here, the input is the string `"Hello, World!"`. In Python, text enclosed in double or single quotes represents a string. The result of calling `print` is displaying that string on your screen.

If you run:

```python
print(1+2)
```

Now, the argument inside the parentheses is a numerical expression rather than a string. Python evaluates this expression first (yielding `3`), and then prints the result.

If the program has multiple lines of code, such as:

```python
name = input("What's your name? ")
print(f"Hello, {name}! Welcome to the world of Python programming!")
```

When a program contains multiple lines, they execute sequentially from top to bottom. In the example above, `input` is another built-in function that pauses the program to wait for the user to type something. The text inside the parentheses is a prompt displayed to guide the user. `name` is a variable used to store the text returned by the `input` function (the user's keyboard input). The subsequent `print` function prints a formatted string that incorporates the value stored in the `name` variable.

Program statements are typically built from data, variables, operators, and expressions. Let's look at these core components and other common programming terms:

### Data

Data is the raw information processed by a program. In the examples above, the numbers `1` and `2`, and the text `"Hello, World!"` are all data. Python supports several built-in data types to represent different kinds of information. The most common include:
- Numeric types: such as integers (`int`) and floating-point numbers (`float`). E.g., `42`, `3.14`.
- String type: a sequence of characters enclosed in quotes, e.g., `"Hello, World!"`.
- Boolean type: represents the logical values `True` and `False`, used for decision-making.
- Collection types: structures like lists and dictionaries used to group multiple items together. For example, a list (`list`) like `[1, 2, 3]` holds ordered elements, while a dictionary (`dict`) like `{"name": "Alice", "age": 30}` stores key-value pairs.

We will cover data in detail in the [Data and Variables](variable) section.

### Variable

A variable is a named storage location in memory used to hold data. You can assign data to a variable and use the variable's name to refer to that data. Unlike languages like Java or C++, Python variables do not require type declarations—you assign a value directly using the `=` operator:

```python
age = 25             # Integer type
name = "Alice"       # String type
is_student = True    # Boolean type
```

In each assignment, the text to the left of the `=` is the variable name (which can contain letters, numbers, and underscores, but cannot start with a number). The right side is the value assigned to the variable. We cover variables in depth in the [Data and Variables](variable) chapter.

### Operator

Operators are symbols that perform operations on variables and values. Common examples include the arithmetic operators for addition, subtraction, multiplication, and division (`+`, `-`, `*`, `/`). Python also provides operators for logic, comparison, and sequence manipulation. We introduce them in detail in the [Basic Mathematical Operations](calculation) chapter.

### Keyword

A keyword is a word reserved by Python because it has a predefined meaning in the language's syntax. Because keywords define the structural rules of the program, they cannot be used as variable names, function names, or other identifiers. Attempting to use a keyword as a variable name will result in a syntax error.

Examples of Python keywords include `if`, `else`, and `for`. You can print all reserved keywords in your current version by running:

```python
import keyword
print(keyword.kwlist)
```

We will introduce these keywords in detail in subsequent chapters.

### Identifier

An identifier is a name you define to label variables, [functions](function), [classes](class), or other user-defined objects. It acts as a unique reference to that object in your program.

Identifiers must follow these naming rules:

- They can contain letters (including Unicode characters from other languages), digits (0-9), and underscores (`_`).
- The first character must be a letter or an underscore, not a number.
- They cannot be identical to Python keywords.
- Special characters (like spaces, `@`, `$`, `%`, etc.) are not allowed.

For example, some valid identifiers: `my_variable`, `_privateVar`, `var1`, `Σ_value`;
The following are invalid identifiers: `1variable`, `var-name`, `me@qq.com`, `def`, `my var`.

Python support for [Unicode](string#converting-between-strings-and-bytes) means you can write identifiers (such as Chinese or Greek characters). For instance, see this [example program](miscellaneous#coding-with-chinese-identifiers) written in Chinese.

Python identifiers are case-sensitive (e.g., `var` and `Var` are distinct). However, for certain Unicode equivalents (like fullwidth and halfwidth characters, or ligatures), Python treats them as the same identifier. While Unicode support allows writing code in other languages, it can introduce subtle bugs due to visually identical but differently encoded characters. To keep your code readable and easy to debug, you should stick to standard English letters, numbers, and underscores. The following code demonstrates some valid (but highly discouraged) Unicode identifiers:

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

An expression is a combination of values, variables, and operators that can be evaluated to produce a value. Expressions can be simple (like a single number or variable) or complex (like mathematical formulas or function calls).

Here are some examples of expressions:

- `3 + 4`  returns 7
- `"Hello" + " " + "World"`  returns "Hello World"
- `my_function(2, 3)` returns the result of calling the function `my_function`
- `print("Hello World")` returns `None`

Some functions appear to have no return value (for instance, we rarely assign the result of `print()` to a variable). In Python, however, every function call returns a value; if no return value is specified, the function returns `None` by default.

You can place an expression anywhere a value is expected—such as inside a function call, as a condition in an `if` statement, or nested within a larger expression.

An expression can stand alone as a single line of code. Many interactive environments (like Jupyter Notebook) automatically display the value of the last evaluated expression in an execution block.

### Statement

A statement is a complete instruction that performs an action. Unlike an expression, a statement does not evaluate to a value; it commands the computer to execute a task, such as assigning a variable, checking a condition, or starting a loop. E.g.:

- `x = 3 + 2`  Assignment statement
- `if x > 0`   Conditional control statement

In Python, statements are complete units of execution and cannot be nested inside other expressions.

While you can write multiple statements on a single line by separating them with semicolons (`;`), this is heavily discouraged in Python. Write one statement per line to keep code readable and maintainable.

### Comment

Comments are notes added to code for explanation and documentation; they are completely ignored by the Python interpreter. Their purpose is to help developers read and understand the code.

Python supports two types of comments:
- Single-line comments: start with a `#`. Everything after the `#` on that line is ignored.
- Multi-line comments: Python does not have a dedicated multiline comment syntax. However, you can use unassigned multiline strings (enclosed in triple quotes `'''` or `"""`) as comments. Since they are not assigned to variables, Python ignores them during execution.

The example program about variables shown earlier contains comments:

```python
age = 25             # Integer type
"""
This is also a comment
"""
```

### Code Block

A code block is a group of statements that execute together as a single logical unit. Code blocks are used in [conditional statements](condition), [loops](loop), [functions](function), and [classes](class) to organize program flow.

In most languages, code blocks are enclosed in symbols like curly braces (`{}`) or keywords like `begin` and `end`. Python is unique: it uses indentation (whitespace at the beginning of a line) to define the boundaries and hierarchy of code blocks.

In other languages, indentation is purely cosmetic, designed to help developers read the code. In Python, however, indentation is a core part of the syntax. Indenting a line differently changes the structure and logic of the program.

This design encourages clean, uniform, and readable code. Within a single code block, every line must share the exact same amount of indentation. The official Python style guide (PEP 8) recommends using exactly 4 spaces per indentation level.

So far, our examples have used simple, sequential logic with a single block, making indentation a non-issue. As we build more complex structures, proper block structure will become vital.

While beginners sometimes worry that meaningful indentation is error-prone (since a single misplaced space can break the program), in practice, developers adapt quickly. The payoff is massive: it guarantees that all Python code is formatted consistently, improving readability.

Let's explore how code blocks are used in control structures and functions.

## Code Execution Flow

By default, Python executes statements sequentially, line by line, from top to bottom. For example:

```python
print("First line")
print("Second line")
print("Third line")
```

Here, each statement has no indentation and belongs to the same main block, running in sequence.

Often, we need to alter this linear flow—either skipping statements or repeating them based on certain conditions. We manage this using control flow structures. Python offers [conditional statements](condition) and [loops](loop) to branch and repeat code execution dynamically.

We discuss these in detail later, but because they are so common, a quick overview will help you understand subsequent examples.

### Conditional Statements

An `if` statement evaluates a condition. If the condition is `True`, Python executes the indented block immediately below it. If it is `False`, that block is skipped, and Python runs the optional `else` block instead:

```python
age = 18
if age >= 18:
    print("Adult")
    print("This is the sub-block of if")
else:
    print("Minor")
    print("This is the sub-block of else")
```

Here, Python checks if `age >= 18` is `True`. If it is, the two print statements indented under `if` execute. Otherwise, execution jumps to the block indented under `else`.

### for Loop

Python provides two main loop structures: `for` and `while`. A `for` loop iterates over a sequence (such as a list, string, or range of numbers):

```python
# Iterating over a list
fruits = ["apple", "banana", "pear"]
for fruit in fruits:
    print(fruit)
    print("This is the code block of the for loop")
```

The `for fruit in fruits:` statement processes each element in the `fruits` list. During each iteration, the variable `fruit` is assigned the value of the current item (e.g., `"apple"` in the first run, `"banana"` in the second).

The code block indented under the `for` statement is executed once for every item in the sequence.

Let's look another example using a range of numbers:

```python
# Iterating over a range
for i in range(3):  # range(3) generates 0, 1, 2
    print(i)
    print("This is the code block of the for loop")
```

The `range(n)` function generates integers from `0` up to `n-1`. As the loop runs, the variable `i` takes on each of these values in sequence.

### while Loop

Unlike `for` loops, a `while` loop runs for an indefinite number of iterations. It repeats its indented code block as long as its condition remains `True`, exiting only when the condition becomes `False`:

```python
count = 0
while count < 3:
    print("Loop count:", count)
    count += 1  # Update count value, otherwise it becomes an infinite loop
```

Here, the loop prints the count and increments it. When `count` reaches `3`, the condition `count < 3` becomes `False`, and execution continues after the loop.

### Function

A function is a reusable block of code designed to perform a specific task. It can accept inputs (parameters), run execution logic, and return a result. Functions are vital for modularity, helping make code cleaner, readable, and easier to maintain. We have already used built-in functions like `print()` and `range()`. Here is a quick look at how to write your own:

A function is defined using the `def` keyword, followed by the function name (following variable naming rules) and a parenthesized parameter list. The function header ends with a colon (`:`). The function body—containing the logic to execute—starts on the next line and must be indented. The `return` statement sends a computed value back to the caller; if omitted, the function returns `None`.

Let's define a simple function to calculate the sum of two numbers:

```python
def add(a, b):
    result = a + b
    return result
```

Here, `add` is the function name, while `a` and `b` are parameters that accept inputs. The function calculates their sum and returns it using `return result`.

We can call this function multiple times with different values:

```python
print(add(3, 5))     # Prints 8
print(add(10, 20))   # Prints 30
```

Functions provide several key benefits:
- Reusability: Avoid repeating code by wrapping logic in a single, reusable block.
- Modularity: Breaking down complex problems into smaller, isolated steps.
- Readability: Hiding implementation details makes the main program cleaner.
- Easier Maintenance: Fixing a bug inside a function automatically updates all parts of the program that call it.
