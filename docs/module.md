# 模块

在 Python 中，模块是一种组织和重用代码的方式。一个模块基本上就是一个包含 Python 代码的 .py 文件。这些文件可以包含可执行的代码、函数、类或变量。模块不仅仅是提供代码重用的方式，它们还可以帮助我们更好地组织和管理复杂的代码。

## 模块的导入

Python 自带了很多模块，当我们需要使用到这些模块提供的功能时，首先需要使用 import 语句导入模块。import 语句通常是在一个程序的最开头。比如，我们需要计算一个数据的平方根，这个平方根计算函数 sqrt() 在 Python 内置的 math 模块中。使用方法如下：

```python
import math  # 导入 math 模块

print(math.sqrt(16)) # 输出 4.0
```

在使用 sqrt() 函数时，前面要加上 `math.` 前缀表示这是 math 模块中的 sqrt() 函数。程序中可能在其它地方也定义一个叫做 sqrt 的函数，或者其它模块中也可能会有叫做 sqrt 的函数，所以要前缀区分清楚。

如果我们可以确定，程序中就只会有这一个 sqrt 函数，肯定不会重名，那么我们可以使用 `from import` 语句导入 sqrt 函数，这样，在之后的使用中，就不需要在给它添加前缀了：

```python
from math import sqrt

print(sqrt(16)) # 输出 4.0
```

如果程序中会使用到多个 math 库中的函数，可以在 `from import` 语句导入多个函数，比如：

```python
from math import sqrt, sin

print(sqrt(16))  # 输出 4.0
print(sin(0.5))  # 输出 0.479425538604203
```

如果需要用到 math 库中的很多函数和变量，可以使用星号 `from import *` 导入库中的所有函数、变量等：

```python
from math import *

print(sqrt(16))                 # 输出 4.0

# 计算圆面积
circle_radius = 5
print(pi * circle_radius ** 2)  # 输出 78.53981633974483

# 计算 45 度角正弦值
print(sin(pi / 4))              # 输出 0.7071067811865475
```

上面的示例程序中，sqrt() 函数、sin() 函数、常量 pi 都是在 math 库中被定义的。

对于一些特别常用的库，我们会希望重命名导入的模块或函数，以便在当前上下文中更容易使用。我们可以使用 as 关键字重命名库或函数：

```python
import numpy as np

# 创建一个一维数组
arr1 = np.array([1, 2, 3, 4, 5])
print("数组：", arr1)

# 计算数组点积
dot_product = np.dot(arr1, np.array([1, 0, 1, 0, 1]))
print("点积：", dot_product)

# 输出：
# 数组： [1 2 3 4 5]
# 点积： 9
```
上面程序中用到的 numpy（Numerical Python 的简称） 是一个开源的 Python 库，它提供了大量的函数来进行线性代数、逻辑、统计学等的运算。这个库在导入时，通常都会被命名为 np。Python 中有很多常用的库都有这种约定俗成的短名。比如下面几个都是最常用的缩写短名：

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import tkinter as tk
```


### Python 标准库

Python 有一个丰富的标准库，提供了许多内置模块，帮助用户执行各种常见任务。极大的丰富了 Python 的应用场景，这也是 Python 能够获得成功的重要原因之一。 下面列出了一些最常用的 Python 标准库模块及其简要描述：

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

模块是一个包含 Python 代码的 .py 文件，我们自己也可以通过保存一个这样的 .py 文件来创建一个模块，在模块中定义一些函数、变量，然后在其它 Python 程序中导入并使用模块中定义的功能。创建用户自定义模块的步骤很简单：

首先，创建一个新的 .py 文件，比如我们创建一个叫做 mymodule.py 的新文件。

接下来，在 mymodule.py 中添加一些函数：

```python
# mymodule.py

def hello(name):
    print(f"Hello, {name}!")

def add(a, b):
    return a + b
```

我们创建了两个函数： hello() 和 add() 。保存新创建的文件，然后就可以在另一个 Python 程序中导入并使用这个模块了：

```python
import mymodule

mymodule.hello("小明")
result = mymodule.add(5, 3)
print(result)
```

在导入模块时，模块名是不含 .py 文件扩展名的。另外，在导入自定义的模块时，还要确定这些模块被放在 Python 的搜索路径中，否则，Python 可能找不到它们。

### Python 的搜索路径

默认情况下，搜索路径包括当前目录和 Python 安装目录。如果要导入的模块不在这些位置，那么需要将其所在目录添加到搜索路径中，或者将其放在一个已经在搜索路径中的目录，Python 才能找到这个模块。

#### 临时搜索路径

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

这种方法的修改的搜索路径只在当前的 Python 环境中有效，重启 Python 解释器或编程环境后，新添加的路径就会失效。

#### 环境变量

如果想永久地添加某文件夹到 Python 的搜索路径，可以修改 PYTHONPATH 环境变量，将其指向想添加到搜索路径的目录。Python 每次启动时会自动读取这个环境变量并把它添加到搜索路径中。

在 Windows 上设置 PYTHONPATH 的步骤如下：
1. 打开“控制面板” > “系统” > “高级系统设置” > “环境变量”。
2. 在“系统变量”区域，点击“新建”来创建一个新的环境变量。
3. 在“变量名”字段中输入 PYTHONPATH。
4. 在“变量值”字段中输入想要添加的目录路径。如果有多个路径，用分号 (;) 分隔它们。
5. 点击“确定”保存更改。

在 macOS 或 Linux 上设置 PYTHONPATH 需要在 shell 配置文件中设置环境变量，步骤如下：
1. 打开你的 shell 配置文件，不同 shell 的配置文件会有不同，例如：`~/.bashrc`、 `~/.bash_profile` 或者 `~/.zshrc`
2. 在文件中添加一行： `export PYTHONPATH="$PYTHONPATH:/path/to/directory` （替换 `/path/to/directory` 为真正想要添加的目录路径。）
3. 保存文件并重新加载配置(运行 source ~/.bashrc 命令或者重启终端)

#### site-packages

Python 的 site-packages 目录是一个特殊的目录，用于存储第三方包。我们可以在此目录下创建一个 .pth 文件来永久添加自定义路径到 Python 搜索路径。方法是：
1. 找到 Python 的 site-packages 目录。这个目录通常位于 Python 安装目录下。
2. 在 site-packages 目录下创建一个新的 .pth 文件，例如 mymodules.pth。
3. 在 .pth 文件中，添加的目录路径，每行一个路径。比如： `/path/to/directory`
4. 保存 .pth 文件。Python 将在下一次启动时自动读取这些路径。


### 包

不同人创建的模块有可能也会重名，这样导入的时候就会有冲突。Python 中可以按照目录来组织模块，把多个模块组织成一个包（Package）。再导入模块的时候，需要把目录名也加入到导入的模块名字里面，这样就避免了同名。

假如，我们的项目文件结构如下：

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

开头的 `..` 表示上一级目录，如果需要从更上层的目录导入，可以继续添加点 `.`，每增加一层就增加一个点。例如，要从上两级目录导入，可以使用 `from ... import some_module`。



## 导入时运行

当我们使用 import 导入一个模块的时候，Python 立刻就会运行这个模块内的代码。这与 C、Java 等编译型语言不太一样，在那些语言中，include, import 仅仅是表示程序可以调用模块里定义的内容了，导入的过程本身并不会执行模块里的代码。但 Python 是解释型语言，它需要运行被导入的库中的代码，才能定义库中函数、变量以备之后使用。我们可以利用 Python 的这一行为，在导入模块的同时去做一些事情。比如，我们可以对模块进行一些初始化工作：配置日志文件，检查环境变量的设置是否正确，连接到所需的资源，注册或显示提示信息等等。

比如，我们编写了如下的一个库：

```python title="mylibrary.py"
print("正在初始化 mylibrary...")

# 示例：初始化配置
default_config = {
    "precision": 2,
    "method": "standard"
}

# 示例：初始化日志
def _initialize_logging():
    print("mylibrary 的日志文件已配置好。")

_initialize_logging()

def set_precision(precision):
    global default_config
    default_config["precision"] = precision
    print(f"精度设置为： {precision}")

def calculate_square_root(number):
    precision = default_config["precision"]
    result = round(number ** 0.5, precision)
    print(f"{number} 的开方是： {result} (精度 {precision})")
    return result
```

上面这个库除了定义了一些函数外，还有一些其它可执行代码。当我们在另一个程序中导入它时

```python 
import mylibrary
mylibrary.set_precision(3)
mylibrary.calculate_square_root(9)
```

导入 mylibrary 模块会直接运行模块中的代码，于是它会打印 "正在初始化 mylibrary..."，和 "mylibrary 的日志文件已配置好。"

有些代码，我们是不希望在导入时运行的。最常见的情况是，某个文件中的程序，即可以直接运行，也可以作为模块被其他文件导入，这其中就会有一些代码，只希望在直接运行时才运行。为实现这个目的，我们需要在程序中添加一个条件语句： `if __name__ == "__main__"` 来控制代码的执行方式。在这个语句中，`__name__` 是一个特殊的变量，当 Python 文件被直接运行时，Python 解释器会把这个文件的 `__name__` 变量的值设为字符串 `"__main__"`；当 Python 文件作为模块被其他文件导入时，`__name__` 变量会被设定为该模块的名称。因此，只有当 Python 文件被直接运行时 `if __name__ == "__main__"` 的条件才会成立，它下面的代码块才会被运行。我们可以把那些只在直接运行时才运行代码放它下面。

假设有一个名为 example.py 的文件：

```python title="example.py"
def function_a():
    print("Function A")

def function_b():
    print("Function B")

if __name__ == "__main__":
    function_a()  # 这行只有在直接运行 example.py 时才会执行
```

当直接运行 example.py 时，`__name__` 会被设为 `"__main__"`，因此 function_a() 会被调用。如果从另一个文件中导入 example.py，`__name__` 将不会是 `"__main__"`，所以 function_a() 不会被调用。

## 第三方库

......


