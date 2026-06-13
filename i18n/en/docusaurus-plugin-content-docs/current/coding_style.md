# Code Style and Standards

## PEP 8 Guidelines

Python coding style broadly follows a style guide known as PEP 8. PEP 8, which stands for [Python Enhancement Proposal 8](https://peps.python.org/pep-0008/), is an official document describing conventions for writing Python code, aimed at improving the readability and consistency of Python code.

This specification is very detailed with many rules. Here are some of the most important guidelines:

- Indentation: Use 4 spaces for indentation. Tabs are not recommended. Each indentation level should be 4 spaces.
- Line Length: Each line of code should not exceed 79 characters, which makes it easier to view on small screens and to place multiple files side by side. For long expressions, appropriate line breaks should be used while maintaining logical coherence.
- Blank Lines: Two blank lines between top-level definitions, such as class definitions. One blank line between method definitions. Necessary blank lines should also be added within functions to separate logical sections.
- Imports: Import statements should be written on separate lines. Import order: standard library imports, related third-party imports, local application/library specific imports, each group separated by a blank line. It is recommended to import only one module per line. However, when importing specific objects from a module (e.g., `from subprocess import Popen, PIPE`), multiple names can be imported on one line.
- Spaces: Spaces should generally be added on both sides of assignment (`=`), comparison (`==`, `!=`, etc.), and arithmetic operators (`+`, `-`, etc.). Exceptions: In function parameter lists, there should be no spaces around the `=` sign used for default values or keyword arguments (e.g., `def func(key=value):`). There should also be no spaces inside the parentheses of function parameter lists, indexing, or slicing.
- Comments: Comments should be indented at the same level as the code they describe. Comments should be complete sentences. If a comment is a phrase or sentence, its first letter should be capitalized, unless it starts with an identifier within the code (i.e., variables within the code). The first line of a function, class, or module typically uses a triple-quoted (`"""..."""`) string as a docstring to explain its purpose. Explanatory comments for code logic use the `#` format.
- Naming: Class names typically use CamelCase style with the first letter capitalized and no underscores. Function and variable names typically use snake_case style with lowercase letters and words separated by underscores. Constants typically use UPPER_CASE style with all capital letters.
- Statements: Write only one statement per line; do not use semicolons.

## Auto-formatting Code

There are now many tools that can help us automatically format program code, keeping the code style consistent and improving code readability. These tools can automatically adjust code formatting, such as indentation, spaces, line breaks, etc., making the code cleaner and more standardized.

### PyCharm's Built-in Code Formatting Tool

PyCharm is a popular Python Integrated Development Environment (IDE) that provides many powerful features, including automatic code formatting. PyCharm comes with built-in code formatting functionality that can easily format code to comply with coding standards such as PEP 8.

If you need to manually format a Python file, you can select Code -> Reformat Code in the open Python file, or use the shortcut key (Ctrl+Alt+L on Windows/Linux, Option+Command+L on macOS in most cases). The file will then be formatted according to the standards.

We can also set the file to be automatically formatted upon saving, so manual adjustment is not needed. Go to File -> Settings (or PyCharm -> Preferences on macOS). In Tools -> Actions on Save, check the Reformat code option to let PyCharm automatically format code files.

### Using Third-party Code Formatting Tools

If you feel that the IDE's built-in tools are not good enough, we can also use other tools to format code. Additionally, in VSCode, Microsoft recommends using separate formatting extensions. Click the Extensions icon on the left sidebar, search for and install the "Black Formatter" extension (published by Microsoft). After installation, select Black Formatter as the Default Formatter in settings.

There are many commonly used code formatting tools, such as Black, Flake8, autopep8, and YAPF, among others. Taking Black as an example, we need to install it before using it:

```sh
pip install black
```

In PyCharm, go to File -> Settings -> Tools -> External Tools. Click "+" to add a new tool. Enter the tool name (Black) in the "Name" field. Enter the tool's path in the "Program" field (you may need to run `which black` (macOS/Linux) or `where black` (Windows) in the terminal to find the path). Enter `$FilePath$` in the "Arguments" field. Enter `$ProjectFileDir$` in the "Working directory" field. Once done, you can run Black formatting through Tools -> External Tools -> Black.

The setup in VSCode is also similar. Click the Extensions icon on the left sidebar of VSCode. Search for "Python" and select the Python extension published by Microsoft, then click Install. Then choose a formatting tool such as Black. After that, it is ready to use.

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

This text is "The Zen of Python", authored by Tim Peters. "The Zen of Python" contains many profound insights into Python programming style and philosophy, emphasizing the importance of simplicity, readability, and explicitness. A rough Chinese translation is as follows:

```
美胜丑陋明胜晦，简胜繁复逸胜乱。扁平优于层层叠，疏散胜于密密缠。
可读性高当第一，特殊不足破常规。错误岂可默然过，除非真需如此为。
面对疑惑不妄猜，做事有法一二三。虽道隐显难察觉，须知心中自有涯。
为人行事贵在做，但勿鲁莽任意行。若成难解或不妥，易解之理或为佳。
命名空间大智慧，善用自然效率高。大道至简行其本，清风朗月任逍遥。
```

Here is how the residents of the planet Pythora understand this poem:

### Beauty

The beauty of Python code not only improves code readability but also reflects a programming artistry. Clear, clean, and consistent code is easier to understand and maintain.

Code readability is an important aspect of programming, especially in team collaboration and long-term maintenance projects. Readable code is like good storytelling — it clearly expresses the program's intent and logic. The readability of the following code is not very good:

```python
def calc(x,y):return x/2*y
result=calc(5,7)
print(result)
```

The main problem with the above code is that it uses overly abbreviated function and variable names. If more meaningful and clearer names are used, it not only makes the program easier to understand but also looks more visually appealing:

```python
# 方案一：计算矩形面积（与 length/width 对应）
def calculate_rectangle_area(length, width):
    return length * width

# 方案二：计算三角形面积（与公式对应）
def calculate_triangle_area(base, height):
    return base * height / 2
```

The improved program not only uses meaningful function and variable names but also improves the naming style. Using a consistent coding style helps team members better understand and maintain the code. Adhering to unified coding standards can improve code quality. Another improvement is the addition of some extra spaces and blank lines. Because overly dense code can reduce readability. Proper use of spaces and blank lines can make code clearer. Python allows writing multiple statements on one line, but this makes the code look too dense, for example:

```python
if condition:do_action1();do_action2()
```

The above code should always be split into multiple lines:

```python
if condition:
    do_action1()
    do_action2()
```

Code can also be a form of artistic expression. Writing elegant code not only demonstrates technical ability but also reflects personal style and creativity. There are some verbose and complex programming approaches in Python, but they might be much more aesthetically pleasing than the most basic programming methods. For example, list comprehensions are often more elegant than loop structures:

```python
# 使用列表推导式
squares = [x * x for x in range(10)]

# 传统循环方式
squares = []
for x in range(10):
    squares.append(x * x)
```

Beautiful code is not just about visual tidiness; it is about improving code readability and maintainability. An excellent Python programmer should strive to write clear, consistent, and expressive code. Through continuous practice and learning, improve your coding skills and make your code a model of programming art.

### Simplicity

Simplicity is an important principle. We advocate using simple and intuitive methods to implement functionality, avoiding unnecessary complexity and excessive nesting as much as possible.

An overly complex function, excessively deep nested loops, condition judgments, or function calls can all make code difficult to understand and maintain. We can reduce nesting by splitting functions, using generators, and other approaches.

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

We can reduce the nesting level by using early returns, making the logic clearer and improving code readability:

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

Code should clearly express its intent while avoiding reliance on implicit behavior or internal mechanisms. Explicit code not only makes communication between developers more effective but also makes the code more friendly to newcomers, lowering the barrier to learning and using Python. Following these principles can improve programming efficiency and reduce errors and misunderstandings.

- **Explicit code** makes the behavior and purpose of a program easy to understand, reducing the possibility of ambiguity and misunderstanding.
   - Clarity of variables and state: Use clear, descriptive variable names to clarify the role and state of variables. For example, use `total_price` instead of a simple `tp`.
   - Clarity of functions and methods: Functions and methods should explicitly pass required parameters, and their names and behavior should clearly express their functionality.
- **Transparent behavior**: Code should not hide its complexity or side effects. Any modification to global state or potential impact should be clear and transparent.
   - Avoid implicit side effects: Functions or methods should avoid producing side effects in inconspicuous places, such as inadvertently modifying global variables.
   - Clear error handling: Error handling should be explicit and should not rely on implicit error handling or ignore potential error conditions.
- **Explicit code design**: When designing and implementing features, priority should be given to clear and direct paths.
   - Explicitly handle errors and edge cases: When facing exceptions or edge cases, there should be clear handling logic, rather than relying on obscure or uncertain behavior.
   - Explicitly express intent: Code should use clear naming and logic, avoiding complex expressions or constructs that might cause confusion.

In the following example program, the user enters a piece of data. The program should have a clear error handling mechanism to ensure that when the input is not a valid number, clear feedback is given, rather than letting the program continue running in an uncertain state:

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
