# Code Style and Standards

## PEP 8 Guidelines

Python coding style broadly follows a style guide known as PEP 8. PEP 8, which stands for [Python Enhancement Proposal 8](https://peps.python.org/pep-0008/), is the official document describing conventions for writing Python code. It aims to improve the readability and consistency of Python codebases.

While the specification is highly detailed, here are some of the most important guidelines:

- **Indentation**: Use 4 spaces per indentation level. Tabs are discouraged.
- **Line Length**: Limit all lines to a maximum of 79 characters. This makes code easier to read on small screens and allows side-by-side file comparison. For long expressions, use appropriate line wraps while maintaining logical coherence.
- **Blank Lines**: Surround top-level function and class definitions with two blank lines. Method definitions inside a class should be separated by a single blank line. You can also use single blank lines sparingly inside functions to separate logical sections.
- **Imports**: Put imports on separate lines. Group them in the following order: standard library modules, related third-party libraries, and local application/library-specific modules. Separate each group with a blank line. While you should import only one module per line, importing multiple specific components from a single module (e.g., `from subprocess import Popen, PIPE`) on a single line is acceptable.
- **Whitespace**: Use spaces around operators, such as assignment (`=`), comparison (`==`, `!=`), and arithmetic operators (`+`, `-`). However, avoid spaces around the `=` sign when used to indicate a keyword argument or default parameter value (e.g., `def func(key=value):`). Do not add spaces inside parentheses, brackets, or braces.
- **Comments**: Indent comments to the same level as the code they explain. Write comments as complete sentences. Capitalize the first letter of a comment unless it begins with a case-sensitive identifier. The first line of a function, class, or module should use a triple-quoted string (`"""..."""`) as a docstring to describe its purpose. Inline or block comments explaining code logic should use the `#` prefix.
- **Naming Conventions**: Class names should use PascalCase (CapitalizedWords). Function and variable names should use snake_case (lowercase words separated by underscores). Constants should be written in UPPER_CASE (all capital letters with underscores).
- **Statements**: Write only one statement per line. Do not use semicolons to combine multiple statements on a single line.

## Auto-formatting Code

Many tools are available to automatically format your code, ensuring consistent style and improving readability. These tools adjust indentation, spaces, line breaks, and other formatting choices automatically, resulting in cleaner and more standardized code.

### PyCharm's Built-in Code Formatting Tool

PyCharm is a popular Python Integrated Development Environment (IDE) that includes built-in code formatting. This feature makes it easy to format your code to comply with PEP 8 standards automatically.

To manually format a file in PyCharm, select **Code -> Reformat Code**, or use the shortcut key (**Ctrl+Alt+L** on Windows/Linux, **Option+Command+L** on macOS). The file will be formatted instantly according to the configured code style guidelines.

You can also configure PyCharm to format files automatically whenever you save. Go to **File -> Settings** (or **PyCharm -> Preferences** on macOS) -> **Tools -> Actions on Save**, and check the **Reformat code** option.

### Using Third-party Code Formatting Tools

If you prefer independent formatting tools, you can integrate third-party formatters. For instance, in Visual Studio Code (VS Code), Microsoft recommends using dedicated formatting extensions. You can install the official **Black Formatter** extension from the marketplace and set it as your default formatter in the settings.

Popular Python formatting tools include Black, Flake8, autopep8, and YAPF. Taking **Black** as an example, you can install it using pip:

```sh
pip install black
```

To set up Black as an external tool in PyCharm:
1. Go to **File -> Settings -> Tools -> External Tools**.
2. Click the **"+"** button to add a new tool.
3. Name the tool `Black`.
4. In the **Program** field, enter the path to the Black executable (you can find this by running `which black` on macOS/Linux or `where black` on Windows in your terminal).
5. Set the **Arguments** field to `$FilePath$`.
6. Set the **Working directory** field to `$ProjectFileDir$`.
Now, you can format any open file by selecting **Tools -> External Tools -> Black**.

In VS Code, search for the official **Python** extension published by Microsoft, click **Install**, and select **Black Formatter** as your default formatting provider.

## The Zen of Python

Running the following code:

```python
import this
```

will display a poem:

```
The Zen of Python, by Tim Peters

Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than *right* now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of those!
```

This text is 'The Zen of Python', authored by Tim Peters. It contains profound insights into Python's design philosophy, emphasizing simplicity, readability, and explicitness. A Chinese translation is shown below for comparison:

```
美胜丑陋明胜晦，简胜繁复逸胜乱。扁平优于层层叠，疏散胜于密密缠。
可读性高当第一，特殊不足破常规。错误岂可默然过，除非真需如此为。
面对疑惑不妄猜，做事有法一二三。虽道隐显难察觉，须知心中自有涯。
为人行事贵在做，但勿鲁莽任意行。若成难解或不妥，易解之理或为佳。
命名空间大智慧，善用自然效率高。大道至简行其本，清风朗月任逍遥。
```

Here is how the residents of planet Pythora interpret these principles:

### Beauty

Writing beautiful Python code is not just about aesthetics; it is a form of programming artistry. Clear, clean, and consistent code is significantly easier to understand and maintain.

Readability is crucial for team collaboration and long-term project maintenance. Highly readable code tells a clear story, explicitly communicating its intent and logic. For example, the following code has poor readability:

```python
def calc(x,y):return x/2*y
result=calc(5,7)
print(result)
```

The main issue with this code is its obscure naming. By using descriptive variable and function names, we make the code self-documenting and more readable:

```python
# 方案一：计算矩形面积（与 length/width 对应）
def calculate_rectangle_area(length, width):
    return length * width

# 方案二：计算三角形面积（与公式对应）
def calculate_triangle_area(base, height):
    return base * height / 2
```

The improved versions use descriptive names and a consistent naming style. They also use whitespace (spaces and blank lines) to separate logical components. Overly dense code reduces readability, whereas structured layout makes it scannable. While Python allows writing multiple statements on a single line separated by semicolons, doing so is highly discouraged:

```python
if condition:do_action1();do_action2()
```

The above code should always be split into multiple lines:

```python
if condition:
    do_action1()
    do_action2()
```

Elegant code demonstrates technical maturity and design sense. In Python, utilizing expressive constructs like list comprehensions is often much more elegant and readable than writing out verbose loops:

```python
# 使用列表推导式
squares = [x * x for x in range(10)]

# 传统循环方式
squares = []
for x in range(10):
    squares.append(x * x)
```

Strive to write clear, consistent, and expressive code. With practice, you can turn your source code into a model of clean programming art.

### Simplicity

Simplicity is a core Pythonic value. You should aim to implement functionality using the simplest, most direct methods available, avoiding unnecessary complexity and excessive nesting.

Deeply nested loops, complex conditional structures, and bloated functions are hard to test and maintain. You can reduce nesting depth by breaking down functions, using early returns, or leveraging generators.

For example, here is a piece of code with excessively deep nesting:
        
```python
def process_data(data):
    if data:
        if data.is_valid():
            for item in data.items:
                if item.is_active():
                    # 处理每个激活的项目
                    pass
                else:
                    # 处理非激活的项目
                    pass
        else:
            print("数据无效")
    else:
        print("无数据提供")
```

Using early returns (guard clauses) flattens the control flow, making the main logic easy to scan:

```python
def process_data(data):
    if not data:
        print("无数据提供")
        return
    if not data.is_valid():
        print("数据无效")
        return

    for item in data.items:
        if item.is_active():
            # 处理每个激活的项目
            pass
        else:
            # 处理非激活的项目
            pass
```

### Explicitness

Your code should explicitly express its intent rather than relying on implicit behaviors or hidden assumptions. Explicit code is easier to debug, review, and maintain, making it much more accessible to other developers and newcomers alike.

- **Explicit State and Context**:
  - **Descriptive Names**: Choose clear, descriptive variable names. Use `total_price` instead of an ambiguous shortcut like `tp`.
  - **Explicit Parameter Passing**: Avoid relying on hidden contexts; pass parameters explicitly to functions.
- **Transparent Behavior**:
  - **No Implicit Side Effects**: Avoid making unexpected modifications to global states or mutating mutable arguments implicitly.
  - **Explicit Error Handling**: Do not ignore exceptions or pass them silently without reason.
- **Intent-Revealing Design**:
  - **Clear Control Flow**: Avoid writing overly clever or obscure code snippets that require mental parsing. Strive for directness.

For example, when converting user input, you should explicitly handle potential errors to prevent the application from failing or entering an undefined state:

```python
user_input = input("请输入一个数据：")

# 明确的错误处理
try:
    number = int(user_input)
except ValueError:
    print("输入错误！输入不是一个有效的数值。")
    # 可以添加更多的错误处理逻辑，如请求重新输入
else:
    print(f"你输入的数是：{number}")
```
