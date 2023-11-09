# 文件读写

文件读写，一般总是要先打开一个文件，进行读写操作，然后关闭文件。

## 打开文件

你可以使用 open 函数来打开一个文件。该函数接受两个主要参数：文件路径和打开模式。

```python
file = open("filename.txt", "r")
```

这里的模式 "r" 意味着文件是以只读模式打开的。常见的模式有：

* "r": 只读模式（默认）
* "w": 写入模式（如果文件已经存在，则清空内容后写入）
* "a": 追加模式（如果文件存在，数据将被追加到文件末尾）
* "b": 二进制模式（与其他模式结合使用，如 "rb" 或 "wb"）
* "x": 排他模式（只有当文件不存在时，才会创建新文件并打开）

## 关闭文件

打开的文件可以使用 close 方法关闭：

```python
file.close()
```

## with 语句

with 语句是 Python 用来简化资源管理的，例如文件读写、网络连接、数据库连接等。

使用 with 语句的基本结构如下：

```python
with expression as variable:
    # do something with the variable
```

with 语句最常见的用途是打开文件，确保在操作完成后文件被正确关闭，而不必显式调用 close() 方法。with 代码块中的代码无论是否发生了异常，使用 with 语句打开的资源都会被正确清理和关闭。

使用 with 语句进行文件操作如下：

```python
with open("sample.txt", "r") as file:
    content = file.read()
# File is automatically closed outside of the block
```

在上面的示例中，无论 file.read() 方法是否引发异常，文件都会在 with 块结束时自动关闭。

## 读取文件

### 基本文件读取

最基本的文件读取，只需要打开文件，然后使用文件对象的 read() 方法来读取文件内容：

```python
with open('sample.txt', 'r') as file:
    content = file.read()
print(content)
```

这里，'sample.txt' 是要读取的文件的名称，而 'r' 是只读模式。read() 方法读取并返回文件的全部内容。

### 逐行读取文件

对于多数的文本文件，我们都希望一行一行的读取文件中的内容。最常用的方式是使用 for 循环，当迭代一个文件对象时，Python 会默认地逐行读取文件：

```python
with open('filename.txt', 'r') as file:
    for line in file:
        print(line)
```

文本文件的每行的末尾通常都会有一个换行符 `\n`，如果不希望输出时有额外的空行，可以使用strip()方法移除它：

```python
print(line.strip())
```


### 读取固定数量的字节：

对于非文本格式的文件，通常不存在行的概念。我们通常会一块一块的读取文件，比如，每次读取文件的 1024 个字节，处理完之后，在读入接下来的 1024 个字节，直到文件结束。

```python
chunk_size = 1024  # 例如，每次读取1024字节

with open('filename.bin', 'rb') as file:
    chunk = file.read(chunk_size)
    while chunk:
        # 处理chunk...
        print(chunk)
        
        chunk = file.read(chunk_size)
```

读取二进制文件与读取文本文件类似，但在打开文件时需要使用 'rb'（读取二进制）模式。file.read(1024) 中的 1024 表示我们只读取文件的 1024 个字节。

当需要处理大型文件或者希望控制内存使用量时，这种方法特别有用，因为这种方法只需要每次加载文件的一小部分到内存中。

### 移动文件指针

读者可能已经发现了，在上面的示例中，每次调用 file.read(chunk_size)，它都会自动返回文件后续的数据。这是因为在，在打开一个文件并开始读取或写入时，文件对象维护了一个“指针”或叫做“文件位置”的数据表示当前在读写文件的哪个位置。通常，刚打开文件时这个指针在文件的开头，但我们可以通过特定的方法移动它来访问文件的不同部分。这在大文件操作、随机访问文件或者特定格式的文件处理（例如二进制文件）中是非常有用的。

我们可以使用 tell() 方法返回文件的当前位置，然后使用 seek() 方法用于移动文件指针。seek() 方法接受两个参数：
* offset： 表示要移动的字节数。可以是正数（向文件尾方向移动）或负数（向文件头方向移动）
* whence（可选）： 设定基准点，表示从哪里开始移动。它可以是以下三种值之一： os.SEEK_SET 或 0 表示从文件开头开始（默认值）； os.SEEK_CUR 或 1 表示从当前位置开始；os.SEEK_END 或 2 表示从文件末尾开始。

示例：

```python
with open('sample.txt', 'r') as file:
    position = file.tell()
    print(f"Current file position: {position}")
    
with open('sample.txt', 'rb') as file:
    # 从当前位置向后移动5个字节
    file.seek(5, 1)
    
    # 从文件末尾向前移动5个字节
    file.seek(-5, 2)
    
    # 移动到文件的第10个字节位置
    file.seek(10)
    
    # 因为文件指针被指向了文件的第10个字节位置，
    # 下面的 read 方法会读取文件第10个字节的数据
    file.read(1)
```

## 写入文件

写入文件与读取文件的方式非常类似，通常使用文件对象的 write() 方法写入数据：

```python
with open('sample.txt', 'w') as file:
    chars_written = file.write("Hello, World!")
    print(f"Wrote {chars_written} characters to the file.")
```

同样可以使用循环写入多行，文件，但是需要确保，每一行一定是以 `\n` 结尾：

```python
lines = ["Line 1", "Line 2", "Line 3"]

with open('sample.txt', 'w') as file:
    for line in lines:
        file.write(line)
        file.write('\n')
```

## 处理文件异常

文件读写过程中是非常容易出现各种错误的，比如文件可能不存在、文件没有访问权限，磁盘空间不足，文件格式错误，等等。所以文件读写通常都需要配合有异常处理机制，比如下面的示例：

```python
try:
    with open('sample.txt', 'r') as file:
        content = file.read()
        print(content)
except FileNotFoundError:
    print("文件不存在！")
except PermissionError:
    print("没有文件访问权限！")
except IOError:
    print("输入输出错误！")
finally:
    print("无论是否发生错误都会运行这里。")
```

## 文本或二进制

在 Python 中，读写文件时可以选择文本模式或二进制模式。这两种模式的差异主要体现在数据处理和文件打开的方式上。选择文本模式还是二进制模式取决于程序的具体需求。如果正在处理的是纯文本数据，文本模式可能更适合。但如果正在处理的是二进制数据（例如图像、音频或其他非文本文件），则应使用二进制模式。

打开文本文件的时候使用 't' 作为文件模式的一部分（例如，'rt' 或 'wt'）。但实际上，我们经常会省略模式中的 't'，只使用 'r' 或 'w'；二进制文件使用 'b' 作为文件模式的一部分（例如，'rb' 或 'wb'）。读取或写入文本文件件时，数据被处理为字符串 (str)；读取或写入二进制文件时，数据被处理为字节 (bytes)。例如：

```python
# 写入文本文件
with open('text_file.txt', 'wt') as file:
    file.write("Hello, Text World!")

# 读取文本文件
with open('text_file.txt', 'rt') as file:
    content = file.read()
    print(content)  # 输出: Hello, Text World!
    
# 写入二进制文件
with open('binary_file.bin', 'wb') as file:
    file.write(b"Hello, Binary World!")

# 读取二进制文件
with open('binary_file.bin', 'rb') as file:
    byte_content = file.read()
    print(byte_content.decode('utf-8'))  # 输出: Hello, Binary World!
```


## 内存文件

相对内存来说，硬盘读写速度慢很多。我们会需要在内存中创建一个文件对象，这个文件对象的访问方式与硬盘上的文件完全一样，唯一不同是它处于内存而不是硬盘，这样读写速度就会非常快。Python 通过 io 模块中的 BytesIO 和 StringIO 类来创建和操作内存中的文件对象。StringIO 用于在内存中存储字符串数据的文件对象；BytesIO 用于在内存中存储字节数据的文件对象。

下面是一些详细的示例：

使用 StringIO
```python
import io

# 创建一个内存中的字符串文件对象
output = io.StringIO()

# 写入数据
output.write("Hello, ")
output.write("Memory File World!\n")
output.write("Another line.")

# 将文件指针移动到文件开始位置
output.seek(0)

# 读取数据
content = output.read()
print(content)

# 关闭内存文件
output.close()
```

使用 BytesIO

```python
import io

# 创建一个内存中的字节文件对象
output = io.BytesIO()

# 写入数据 (需要提供字节数据)
output.write(b"Hello, ")
output.write(b"Memory File World!\n")
output.write(b"Another line.")

# 将文件指针移动到文件开始位置
output.seek(0)

# 读取数据
byte_content = output.read()
print(byte_content.decode('utf-8'))

# 关闭内存文件
output.close()
```

这些内存文件对象与常规文件对象在使用上几乎是相同的，但它们只存在于内存中，不会写入到磁盘。这使得它们在需要快速、短暂的文件操作时非常有用，例如解析数据、暂存数据等场景。


## 路径处理

读写文件，必然需要先找到文件，那就离不开处理文件的路径。在 Python 中，处理文件和目录路径的最常用的库是 os.path 和 pathlib。其中，pathlib 是一个比较新的库，提供了面向对象的方式来处理路径。

以下是常用的路径处理函数和相应的示例：

### 使用 os.path:

```python
import os

# 获取两个或多个路径名组件的连接
joined_path = os.path.join('folder', 'subfolder', 'file.txt')

# 获取路径的绝对路径
abs_path = os.path.abspath('./folder/file.txt')

# 获取路径的基名（文件名或最后的目录名）
base_name = os.path.basename('/folder/subfolder/file.txt')  # 返回 'file.txt'

# 获取路径的目录名
dir_name = os.path.dirname('/folder/subfolder/file.txt')  # 返回 '/folder/subfolder'

# 检查路径是否存在
exists = os.path.exists('/folder/subfolder/file.txt')

# 检查路径是否是目录
is_dir = os.path.isdir('/folder/subfolder')

# 检查路径是否是文件
is_file = os.path.isfile('/folder/subfolder/file.txt')

# 分割路径的目录名和文件名
dir_part, file_part = os.path.split('/folder/subfolder/file.txt')  # 返回 ('/folder/subfolder', 'file.txt')
```


### 使用 pathlib:

```python
from pathlib import Path

# 创建一个 Path 对象
p = Path('folder/subfolder/file.txt')

# 连接路径
new_path = p.parent / 'another_file.txt'

# 获取路径的绝对路径
abs_path = p.resolve()

# 获取路径的基名（文件名或最后的目录名）
base_name = p.name  # 返回 'file.txt'

# 获取路径的目录名
dir_name = p.parent  # 返回 a Path object: 'folder/subfolder'

# 检查路径是否存在
exists = p.exists()

# 检查路径是否是目录
is_dir = p.is_dir()

# 检查路径是否是文件
is_file = p.is_file()

# 分割路径的目录名和文件名
dir_part, file_part = p.parent, p.name  # 返回 (Path('folder/subfolder'), 'file.txt')
```

在新的 Python 代码中，建议使用 pathlib，因为它提供了更直观和面向对象的接口，同时具有丰富的功能。但在处理旧的代码或与其他人合作时，可能仍然会遇到 os.path。

### 临时文件

在学习或者做实验的时候，常常会需要把数据保存到文件中，但是因为不需要长期保存文件，我们可能会懒得给文件起名，这时候可以让系统把数据保存到系统临时文件夹的临时文件中。这样过后，系统自动清理这些不再需要的文件。Python 使用 tempfile 模块来创建临时文件。以下是一个示例，我们入一些数据到一个临时文件，并返回其路径：

```python
import tempfile

def write_to_temp_file(data: str) -> str:
    # 创建一个临时文件，该文件在关闭后不会自动删除
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(data.encode('utf-8'))
        return temp_file.name

data = "Hello, Temp World!"
temp_file_path = write_to_temp_file(data)
print(f"Data has been written to: {temp_file_path}")
```

在这个例子中：

使用 tempfile.NamedTemporaryFile 创建了一个临时文件。默认情况下，当临时文件关闭时，它就会被自动删除。如果想保留这个文件，可以设置参数 delete=False。函数返回了临时文件的路径，以后可以使用这个路径来访问或处理该文件。


