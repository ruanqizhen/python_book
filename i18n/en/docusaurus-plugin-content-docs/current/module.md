# Modules

In Python, a module is a way to organize and reuse code. A module is essentially a `.py` file containing Python code. These files can contain executable code, functions, classes, or variables. Modules not only provide a means for code reuse, but they also help us better organize and manage complex code.

## Importing Modules

Python comes with many built-in modules. When we need to use the functionality provided by these modules, we first need to import the module using the `import` statement. The `import` statement is usually placed at the very beginning of a program. For example, if we need to calculate the square root of a number, the square root function `sqrt()` is in Python's built-in `math` module. It can be used as follows:

```python
import math  # Import the math module

print(math.sqrt(16)) # Output: 4.0
```

When using the `sqrt()` function, it must be prefixed with `math.` to indicate that this is the `sqrt()` function from the `math` module. There may be another function named `sqrt` defined elsewhere in the program, or other modules might also have a function called `sqrt`, so the prefix distinguishes them.

If we are certain that we will only use this one `sqrt()` function in our program and that it will not conflict with other function names, we can use the `from import` statement to import the `sqrt` function. This way, we don't need to add the prefix in subsequent usage:

```python
from math import sqrt

print(sqrt(16)) # Output: 4.0
```

If the program will use multiple functions from the `math` library, we can import several functions using the `from import` statement, for example:

```python
from math import sqrt, sin

print(sqrt(16))  # Output: 4.0
print(sin(0.5))  # Output: 0.479425538604203
```

If we need many functions and variables from the `math` library, we can use the asterisk `from import *` to import all functions, variables, etc., from the library:

```python
from math import *

print(sqrt(16))                 # Output: 4.0

# Calculate the area of a circle
circle_radius = 5
print(pi * circle_radius ** 2)  # Output: 78.53981633974483

# Calculate the sine of a 45-degree angle
print(sin(pi / 4))              # Output: 0.7071067811865475
```

In the example program above, the `sqrt()` function, `sin()` function, and the constant `pi` are all defined in the `math` library.

For some particularly commonly used libraries, we may want to rename the imported module or function to make it easier to use in the current context. We can use the `as` keyword to rename a library or function:

```python
import numpy as np

# Create a one-dimensional array
arr1 = np.array([1, 2, 3, 4, 5])
print("Array:", arr1)

# Calculate the dot product of arrays
dot_product = np.dot(arr1, np.array([1, 0, 1, 0, 1]))
print("Dot product:", dot_product)

# Output:
# Array: [1 2 3 4 5]
# Dot product: 9
```
The numpy (short for Numerical Python) library used in the program above is an open-source Python library that provides a large number of functions for linear algebra, logic, statistics, and other computations. This library is commonly imported with the alias `np`. Many commonly used libraries in Python have conventional shorthand names. For example, the following are some of the most commonly used abbreviated names:

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import tkinter as tk
```


### Python Standard Library

Python has a rich standard library that provides many built-in modules to help users perform various common tasks. This greatly enriches Python's application scenarios and is one of the important reasons for Python's success. Below are some of the most commonly used Python standard library modules along with brief descriptions:

* math: Provides mathematical functions and constants.
* datetime: Provides classes for date and time handling.
* os: Provides functions for interacting with the operating system, such as file and directory operations. Reference: [Path Handling](file_io#路径处理)
* sys: Provides functions for interacting with the Python interpreter and its environment.
* re: Provides regular expression related functionality.
* json: Provides encoding and decoding functionality for JSON format data.
* urllib: Provides URL handling modules for reading web data.
* random: Provides random number generators and random operation functions.
* collections: Provides additional data structures such as named tuples, deques, etc.
* sqlite3: Provides an interface for SQLite databases.
* subprocess: Provides functionality for starting and interacting with subprocesses.
* threading: Provides thread-based parallel processing.
* multiprocessing: Provides process-based parallel processing.
* socket: Provides low-level network communication functionality.
* email: Provides email-related functionality such as sending and parsing emails.
* csv: Provides CSV file reading and writing functionality.
* xml: Provides XML processing functionality.
* argparse: Provides command-line argument parsing functionality.
* gzip, tarfile, zipfile: Provides file compression and decompression functionality.
* logging: Provides logging functionality. Reference: [Logging](debug#日志记录)
* itertools: Provides a series of iterators for complex iteration operations, such as combining data, etc. Reference: [Iterators](iterator#itertools-库)

In the following chapters, we will gradually introduce some of the most commonly used functions in the standard library. The list above is only a portion of the modules in the standard library. Python's standard library is very extensive, covering many domains and functionalities, making Python a truly versatile programming language. To see the complete list of the standard library, you can refer to the official Python documentation: [https://docs.python.org/3/library/](https://docs.python.org/3/library/)


## User-Defined Modules

### Creating Modules

A module is a `.py` file containing Python code. We can also create a module ourselves by saving such a `.py` file, defining some functions and variables in it, and then importing and using the functionality defined in the module from other Python programs. The steps to create a user-defined module are simple:

First, create a new `.py` file, for example, let's create a new file called `mymodule.py`.

Next, add some functions to `mymodule.py`:

```python
# mymodule.py

def hello(name):
    print(f"Hello, {name}!")

def add(a, b):
    return a + b
```

We have created two functions: `hello()` and `add()`. Save the newly created file, and then we can import and use this module in another Python program:

```python
import mymodule

mymodule.hello("Xiao Ming")
result = mymodule.add(5, 3)
print(result)
```

When importing a module, the module name does not include the `.py` file extension. Additionally, when importing custom modules, we need to ensure that these modules are placed in Python's search path; otherwise, Python may not find them.

### Packages

Modules created by different people may also have the same name, which can cause conflicts when importing. In Python, modules can be organized by directory, grouping multiple modules into a package. When importing a module, the directory name also needs to be included in the module name, thus avoiding name conflicts.

Suppose our project file structure is as follows:

```
my_project/
│
├── modules/
│   ├── __init__.py
│   └── mymodule.py
│   
├── demo/
│   ├── __init__.py
│   └── demo.py
│
├── __init__.py
└── main.py
```

In the project's folder, there is an `__init__.py` file, which can be empty. If a folder contains an `__init__.py` file, it indicates that this is a package; otherwise, it is an ordinary folder and cannot be used for importing modules.

Importing `mymodule.py` in `main.py` can be done as follows:

```python
# main.py
import modules.mymodule
```

When importing, each level of folder or file name is separated by a `.` dot.

If `demo.py` also needs to import content from `mymodule.py`, it can be done as follows:

```python
# demo.py
import sys
import os
# Add the project root directory to the search path so that the modules package can be found
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
```
Or use relative paths:

```python
# demo.py
from ..modules import mymodule
```

The leading `..` represents the parent directory. If you need to import from a higher-level directory, you can continue adding dots `.`, adding one dot for each additional level. For example, to import from two levels up, you can use `from ... import some_module`.

Note: Scripts containing relative imports cannot be run directly using `python demo/demo.py`. They must be run from the project root directory using `python -m demo.demo`.

### Python Search Path

By default, the search path includes the current directory and the Python installation directory. If the module to be imported is not in these locations, you need to add its directory to the search path, or place it in a directory that is already in the search path, so that Python can find the module.

#### Temporary Search Path

You can view the current Python search path using the `path` attribute in the `sys` module. For example:

```python
import sys
print(sys.path)
```

Modifying `sys.path` in a program can temporarily add a new path. For example:

```python
import sys
sys.path.append('/path/to/directory')
```

The search path modified using this method is only valid in the current Python environment. After restarting the Python interpreter or programming environment, the newly added path will be lost.

#### Environment Variables

If you want to permanently add a folder to Python's search path, you can modify the `PYTHONPATH` environment variable, pointing it to the directory you want to add to the search path. Python automatically reads this environment variable and adds it to the search path each time it starts up.

The steps to set `PYTHONPATH` on Windows are as follows:
1. Open "Control Panel" > "System" > "Advanced system settings" > "Environment Variables".
2. In the "System variables" area, click "New" to create a new environment variable.
3. Enter `PYTHONPATH` in the "Variable name" field.
4. Enter the directory path you want to add in the "Variable value" field. If there are multiple paths, separate them with semicolons (`;`).
5. Click "OK" to save the changes.

Setting `PYTHONPATH` on macOS or Linux requires setting the environment variable in the shell configuration file. The steps are as follows:
1. Open your shell configuration file. Different shells have different configuration files, for example: `~/.bashrc`, `~/.bash_profile`, or `~/.zshrc`.
2. Add a line to the file: `export PYTHONPATH="$PYTHONPATH:/path/to/directory"` (replace `/path/to/directory` with the actual directory path you want to add).
3. Save the file and reload the configuration (run the `source ~/.bashrc` command or restart the terminal).

#### site-packages

Python's `site-packages` directory is a special directory used to store third-party packages. We can create a `.pth` file in this directory to permanently add custom paths to Python's search path. The method is:
1. Find Python's `site-packages` directory. This directory is usually located under the Python installation directory.
2. Create a new `.pth` file in the `site-packages` directory, for example `mymodules.pth`.
3. In the `.pth` file, add the directory paths, one path per line. For example: `/path/to/directory`
4. Save the `.pth` file. Python will automatically read these paths on the next startup.

## Importing Modules from ZIP Files

To facilitate packaging and deployment of modules, we can package one or more files into a ZIP archive. Using Python's module search path mechanism, we can import modules and packages stored in ZIP files. When doing so, first add the path of the ZIP file containing the modules to be imported to the `sys.path` list. Then, you can import modules from the ZIP file just like importing ordinary modules.

Suppose we have a ZIP file `my_package.zip` that contains a module named `my_module.py`. We can import it as follows:

```python
import sys

# Add the path of the ZIP file to sys.path
sys.path.insert(0, '/path/to/my_package.zip')

# Now we can import the module from the ZIP file
import my_module

# Use the functionality from the module
my_module.some_function()
```

Importing modules from a ZIP file may affect startup time because Python needs extra processing for the ZIP archive. However, for modules that have already been loaded into memory, the performance impact is negligible. ZIP archive files themselves are generally treated as read-only. This means that your program cannot modify the source code inside the ZIP package at runtime, nor can it create new files inside the ZIP package (but the module code can certainly write files to other locations on the computer's disk).

It is important to note that only `.py` files can be imported using the ZIP method. Some modules are developed using other languages and contain dynamically linked library files compiled from those languages. Such modules cannot be packaged and imported using ZIP.

## Execution on Import

When we use `import` to import a module, Python immediately runs the code within that module. This is different from compiled languages like C or Java, where `include` or `import` merely indicates that the program can call the content defined in the module, and the import process itself does not execute the code within the module. However, Python is an interpreted language; it needs to run the code in the imported library in order to define the functions and variables in that library for later use. We can take advantage of this behavior of Python to perform some actions while importing a module. For example, we can perform some initialization work on a module: configure log files, check if environment variables are set correctly, connect to required resources, register or display prompt information, and so on.

For example, let's write the following library:

```python title="mylibrary.py"
print("Initializing mylibrary...")

# Example: initializing configuration
default_config = {
    "precision": 2,
    "method": "standard"
}

# Example: initializing logging
def _initialize_logging():
    print("The log file for mylibrary has been configured.")

_initialize_logging()

def set_precision(precision):
    global default_config
    default_config["precision"] = precision
    print(f"Precision set to: {precision}")

def calculate_square_root(number):
    precision = default_config["precision"]
    result = round(number ** 0.5, precision)
    print(f"The square root of {number} is: {result} (precision {precision})")
    return result
```

In addition to defining some functions, the library above also contains some other executable code. When we import it in another program:

```python 
import mylibrary
mylibrary.set_precision(3)
mylibrary.calculate_square_root(9)
```

Importing the `mylibrary` module will directly execute the code in the module, so it will print "Initializing mylibrary..." and "The log file for mylibrary has been configured."

Some code is not intended to run on import. The most common scenario is when a file can be run directly or imported as a module by other files. In such cases, there will be some code that should only run when the file is executed directly. To achieve this, we need to add a conditional statement in the program: `if __name__ == "__main__"` to control how the code is executed. In this statement, `__name__` is a special variable. When a Python file is run directly, the Python interpreter sets the value of the `__name__` variable in that file to the string `"__main__"`. When a Python file is imported as a module by other files, the `__name__` variable is set to the name of that module. Therefore, the condition `if __name__ == "__main__"` is only true when the Python file is run directly, and the code block below it will only be executed then. We can place code that should only run when the file is executed directly under this condition.

Suppose we have a file named `example.py`:

```python title="example.py"
def function_a():
    print("Function A")

def function_b():
    print("Function B")

if __name__ == "__main__":
    function_a()  # This line will only execute when running example.py directly
```

When running `example.py` directly, `__name__` is set to `"__main__"`, so `function_a()` will be called. If `example.py` is imported from another file, `__name__` will not be `"__main__"`, so `function_a()` will not be called.

## Third-Party Libraries

### Common Functionality

In addition to Python's built-in standard library, Python also has an extremely active open-source community. This community has contributed a vast and rich collection of third-party libraries to Python, covering areas from network programming to data analysis, and from image processing to machine learning. Below are some of the most well-known third-party libraries. We will introduce them along with other third-party libraries in the following chapters:

* Web Development
   * Flask: A lightweight web application framework, easy to learn, suitable for small to medium-sized projects.
   * Django: An advanced web framework that provides complete functionality, suitable for large projects.
* Data Science and Analysis
   * [NumPy](numpy): Provides powerful multi-dimensional array objects and extensive scientific computing functionality.
   * [Pandas](pandas): Provides data structures and data analysis tools, especially suitable for handling tabular data.
   * Matplotlib: A plotting library for data visualization, capable of creating high-quality charts and graphs.
* Machine Learning and Artificial Intelligence
   * Scikit-learn: A simple and effective machine learning library that provides many commonly used machine learning algorithms.
   * TensorFlow: A powerful machine learning framework developed by Google, widely used for deep learning.
   * PyTorch: Developed by Facebook, it is a flexible and powerful deep learning framework.
* Network Programming and Web Scraping
   * Requests: A library for sending HTTP requests, simple and easy to use.
   * Scrapy: A powerful web scraping framework, suitable for large-scale data extraction.
* Image Processing
   * Pillow: A modern fork of the Python Imaging Library (PIL), providing rich image processing functionality.
   * OpenCV: A powerful library for computer vision and image processing, supporting multiple languages and platforms.
* Mathematics and Statistics
   * SciPy: Based on NumPy, provides a series of functions for mathematics, science, and engineering.
   * Statsmodels: A library for statistical analysis and econometrics.
* File and Data Format Processing
   * Beautiful Soup: A library for parsing HTML and XML files, suitable for web data scraping.
   * PyYAML: A library for reading and writing YAML files.
* GUI Development
   * PyQt/PySide: Cross-platform GUI toolkits based on Qt, powerful with beautiful interfaces.
   * Kivy: An open-source Python library suitable for creating multi-touch applications, supporting cross-platform operation.
   * Python comes with a GUI library called [Tkinter](tkinter), which is part of the standard library and can be used without installation, suitable for simple GUI development.

### Installation

Unlike Python's built-in standard library, third-party libraries need to be installed before use. Most libraries can be installed directly using Python's package management tool, pip. For example, suppose we need to use a library called `qrcode`, which depends on the `pillow` library. In the command-line terminal, you can use the following command to install it:

```bash
pip install qrcode[pil]
```

Some particularly complex libraries, such as PyTorch, may have different installation configurations for different systems and hardware. For such complex libraries, it is best to go to their homepage and follow the instructions in their documentation for installation.

### Usage

Once a library is installed, it can be imported and used in Python code, in exactly the same way as using Python's own standard library. Still using the `qrcode` library as an example, running the following code will generate a QR code for this book's website:

```python
import qrcode
from PIL import Image

# Create a QRCode object
qr = qrcode.QRCode(
    version=1,  # Controls the size of the QR code, 1~40, 1 is the smallest
    error_correction=qrcode.constants.ERROR_CORRECT_L,  # Controls the error correction capability of the QR code
    box_size=10,  # Controls the number of pixels each small box in the QR code contains
    border=4,  # Controls the number of boxes for the blank border around the QR code
)

# Add data
qr.add_data('https://www.example.com')
qr.make(fit=True)

# Create the QR code image
img = qr.make_image(fill='black', back_color='white')

# Display the image
img.show()
```

Running result:

![](images/014.png "Book website URL")

## Exercises

1. **Calculate the area of a circle**: Use functions and constants from the `math` library to calculate the area of a circle.

2. **Convert angles to radians**: Use functions and constants from the `math` library to calculate the radian value of an input angle.

3. **Greatest common divisor and least common multiple**: Use functions and constants from the `math` library to calculate the greatest common divisor and least common multiple of two input positive integers.

4. **Solve a system of bivariate quadratic equations**: Use functions and constants from the `scipy` library to solve the following system of equations:

$$
\begin{equation}
\left\{
\begin{array}{c}
    x^2 + 2y^2 + 3xy + 4x + 5y + 6 = 0 \\
   4x^2 + 5y^2 + 6xy + 7x + 8y + 9 = 0 \\
\end{array}
\right.
\end{equation}  
$$
