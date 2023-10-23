# 模块

在 Python 中，模块是一种组织和重用代码的方式。一个模块基本上就是一个包含 Python 代码的 .py 文件。这些文件可以包含可执行的代码、函数、类或变量。模块不仅仅是提供代码重用的方式，它们还允许我们更好地组织和管理复杂的代码基础。

## 模块的导入

要在一段程序中使用某个模块，需要使用 import 语句导入该模块。import 语句通常是在一个文件的最开头。

比如，我们需要计算一个数据的平方根，这个计算平方根的函数 sqrt() 在 Python 内置的 math 模块中，编程如下：

```python
import math  # 导入 math 模块

print(math.sqrt(16)) # 输出 4.0
```

在使用 sqrt() 函数时，前面要加上 `math.` 前缀表示这是 math 模块中的 sqrt() 函数。程序中可能在其它地方也定义一个叫做 sqrt 的函数，所以要区分清楚。


如果只需要从一个模块导入某些功能，而不是导入所有功能，可以使用 from ... import 语句：

```python
from math import sqrt

print(sqrt(16)) # 输出 4.0
```

此时可以直接调用 sqrt() 而不需要 math. 前缀。

在某些情况下，我们想要重命名导入的模块或函数，以便在当前上下文中更容易使用。这可以通过 as 关键字完成：

```python
import numpy as np

# 创建一个一维数组
arr1 = np.array([1, 2, 3, 4, 5])
print("Array:", arr1)

# 计算数组点积
dot_product = np.dot(arr1, np.array([1, 0, 1, 0, 1]))
print("\nDot product:", dot_product)
```

numpy（Numerical Python 的简称） 是一个开源的 Python 库，它提供了大量的函数来进行线性代数、逻辑、统计学等的运算。这个库在导入时，通常都会被命名为 np。


### Python 标准库

Python有一个丰富的标准库，这是其成功的主要原因之一。这个库提供了许多内置模块，允许用户执行许多常见任务，而无需安装额外的库。以下是一些常用的Python标准库模块及其简要描述：

* math: 提供数学运算函数和常量。
* datetime: 提供日期和时间处理的类。
* os: 提供与操作系统交互的功能，如文件和目录操作。
* sys: 提供Python解释器和它的环境交互的功能。
* re: 提供正则表达式相关功能。
* json: 提供JSON格式数据的编码和解码功能。
* urllib: 提供URL处理模块，用于读取Web数据。
* random: 提供随机数生成器和随机操作函数。
* collections: 提供额外的数据结构，如命名元组、双端队列等。
* sqlite3: 提供SQLite数据库的接口。
* subprocess: 提供启动和与子进程交互的功能。
* threading: 提供基于线程的并行处理。
* multiprocessing: 提供基于进程的并行处理。
* socket: 提供底层网络通信功能。
* email: 提供电子邮件相关的功能，如发送和解析邮件。
* csv: 提供CSV文件的读写功能。
* xml: 提供XML处理功能。
* argparse: 提供命令行参数解析功能。
* gzip, tarfile, zipfile: 提供文件压缩和解压缩功能。
* logging: 提供日志记录功能。

在后续的章节中，我们会陆续介绍到标准库中一些最常用的函数。以上列出的也只是标准库中模块的一部分。Python的标准库非常庞大，涵盖了许多领域和功能，使Python成为一种真正的通用编程语言。要查看完整的标准库列表，可以查看 Python 官方文档： <https://docs.python.org/3/library/>


## 用户自定义模块

### 创建模块

在Python中，模块其实就是一个包含Python代码的.py文件。你可以在这个文件中定义函数、类和变量，然后在其他Python脚本中导入并使用这些定义。创建用户自定义模块的步骤很简单：

首先，创建一个新的 .py 文件，比如我们创建一个叫做 mymodule.py 的新文件。

接下来，在 mymodule.py 中添加一些函数或类：

```python
# mymodule.py

def hello(name):
    print(f"Hello, {name}!")

def add(a, b):
    return a + b
```

保存新创建的文件，然后就可以在另一个文件中导入并使用这个模块了：

```python
import mymodule

mymodule.hello("Alice")
result = mymodule.add(5, 3)
print(result)
```

在导入模块时，模块名是不含 .py 文件扩展名的。另外，在导入自定义的模块时，还要确定这些模块被放在 Python 的搜索路径中，否则，Python 可能找不到它们。


### 创建包（Package）

不同人创建的模块有可能会重名，这样导入的时候就会有冲突。Python 中可以按照目录来组织模块，把多个模块组织成一个包。再导入模块的时候，需要把目录名也加入到导入的模块名字里面，这样就避免了同名。

假如，我们的项目文件结构如下：

```markdown
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

在这个项目的文件夹下，都有一个 `__init.py__` 文件，这个文件可以是空的。如果文件夹下有 `__init.py__` 文件，就表示这是一个包；否则就是一个普通文件夹，不能用来导入模块。 

在 main.py 中导入 mymodule.py 可以如下方法实现：

```python
# main.py
import modules.mymodule
```

在导入的时候，每一层机文件夹或文件名之间用 `.` 号分隔。

如果在 demo.py 中也需要导入 mymodule.py 中的内容，可以如下实现：

```python
# demo.py
import ..modules.mymodule
```

开头的 `..` 表示上一级目录，如果需要从更上层的目录导入，可以继续添加点 `.`。例如，要从两级上导入，可以使用 `from ... import some_module`。


### Python 的搜索路径

默认情况下，搜索路径包括当前目录和 Python 安装目录。如果要导入的模块不在这些位置，那么需要将其所在目录添加到搜索路径中，或者将其放在一个已经在搜索路径中的目录，Python 才能找到这个模块。

使用 sys 模块中的 path 属性可以查看当前的 Python 搜索路径。例如：

```python
import sys
print(sys.path)
```

在程序中修改 sys.path 可以临时添加新的路径。例如：

```python
import sys
sys.path.append('/path/to/directory')
```

这种方法的修改只在当前的 Python 会话中有效，重启 Python 解释器或脚本后会失效。

如果想永久地添加路径到 Python 的搜索路径，可以修改 PYTHONPATH 环境变量，将其指向想添加到搜索路径的目录。这种方法在 Python 启动时会自动读取这个环境变量并把它添加到搜索路径中。或者，也可以在 Python 的 site-packages 目录下，创建一个 .pth 文件（例如 mymodules.pth），并在其中列出你想添加的目录。每行一个路径。



