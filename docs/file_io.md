# 文件读写

程序中的数据在程序运行结束就会消失。那些需要在多次运行程序之间保持记录的数据（比如配置状态，用户信息等），或者是在程序结束后，依然可以使用的数据（比如计算结果等），都需要保存成文件。文件读写通常要先打开一个文件，进行读写操作，然后关闭文件。

## 打开关闭

### 打开文件

Python 使用 open() 函数来打开文件。该函数接收两个主要参数：文件路径和打开模式：

```python
file = open("filename.txt", "r")
```

上面示例程序中的打开模式 "r" 表示文件是以只读（只可以读取，不能改变）模式打开的。常见的文件打开模式有：

* "r": 只读模式。这是默认模式。
* "w": 写入模式，如果文件已经存在，则清空内容后写入数据；否则创建一个新文件。
* "a": 追加模式，如果文件存在，数据将被追加到文件末尾；否则创建新文件。
* "b": 二进制模式，表示文件中的数据是二进制字节数据。它需要与其他模式结合使用，如 "rb" 或 "wb"。
* "x": 排他模式，表示文件不能预先存在。只有当文件不存在时，才会创建新文件并打开。

### 关闭文件

打开的文件可以使用 close() 方法关闭：

```python
file.close()
```

打开的文件必须被关闭，这是非常重要的一个步骤。特别是在写入文件时，关闭文件可以确保所有缓冲的数据被正确写入磁盘。不关闭文件可能导致数据写入不完全或损坏。即便是在只读的情况下，访问文件后也必须关闭，否则：一是可能会影响程序其它部分，或其它程序使用该文件，因为文件被打开时可能会被锁住，不允许其它[线程或进程](multithread#进程和线程)访问，以防止数据错误；二是，每个进程能打开的文件数量是有限的，如果打开的文件都不关闭，程序可能就无法再打开新的文件了。

### with 语句

with 语句是 Python 用来简化资源管理的，例如文件读写、网络连接、数据库连接等。

使用 with 语句的基本结构如下：

```python
with expression as variable:
    # do something with the variable
```

with 语句最常见的用途是打开文件，确保在操作完成后文件被正确关闭，而不必显式调用 close() 方法。with 代码块中的代码无论是否发生了异常，使用 with 语句打开的资源都会被正确清理和关闭。

使用 with 语句进行文件操作如下：

```python
with open('myfile.txt', 'w') as file:
    file.write('Hello, world!')
# 文件自动关闭，无需显式调用 file.close()
```

在上面的示例中，无论 file.write() 方法是否引发异常，文件都会在 with 块结束时自动关闭。

## 读取文件

### 文本文件

最基本的文件读取，只需要打开文件，然后使用文件对象的 read() 方法来读取文件内容：

```python
with open('sample.txt', 'r') as file:
    content = file.read()
print(content)
```

这里，'sample.txt' 是要读取的文件的名称。如果只有文件名，要确保该文件与 Python 程序在同一文件夹下，否则可以使用全路径。'r' 表示只读模式的文本文件，在这种模式下，read() 方法读取并返回文件的全部内容，返回的数据是一个字符串。

### 逐行读取文件

如果只想从文本文件中读取一行，可以使用 readline 方法，比如：

```python
# 打开文件
with open('example.txt', 'r') as file:
    # 读取第一行
    first_line = file.readline()

# 输出读取的内容
print(first_line)
```

对于多数的文本文件，我们一般会希望一行一行的读取文件中所有的内容。最常用的方式是使用 for 循环，当迭代一个文件对象时，Python 会默认地逐行读取文件：

```python
with open('filename.txt', 'r') as file:
    for line in file:
        print(line)
```

文本文件的每行的末尾通常都会有一个换行符。Linux 格式的文本文件用 `\n` 作为换行符，Windows 格式的文本文件用 `\r\n` 换行。如果不希望输出时有额外的空行，可以使用字符串的 strip() 方法移除它：

```python
print(line.strip())
```


### 二进制文件

读取二进制文件与读取文本文件非常类似，只是在打开文件时需要使用 'rb' （读取二进制）模式。读取二进制文件时， read() 函数返回的数据类型是[字节序列](string#字节序列)，而不是字符串。

二进制文件不存在行的概念，对于大文件，我们通常会一块一块的读取。比如，可每次读取文件的 1024 个字节，处理完之后，在读入接下来的 1024 个字节，直到文件结束。这只需给 read() 函数传递一个表示字节数量的参数即可，程序如下：

```python
chunk_size = 1024  # 每次读取 1024 字节

with open('filename.bin', 'rb') as file:
    chunk = file.read(chunk_size)
    while chunk:
        # 处理每一次读取的 chunk ......
        print(chunk)
        
        chunk = file.read(chunk_size)   # 读取下一块
```

当需要处理大型文件或者希望控制内存使用量时，这种方法特别有用，因为这种方法只需要每次加载文件的一小部分到内存中。

### 移动文件指针

读者可能已经发现了，在上面的示例中，每次调用 file.read(chunk_size)，它都会自动返回文件后续的数据。这是因为在，在打开一个文件并开始读取或写入时，文件对象维护了一个“指针”或叫做“文件位置”的数据表示当前在读写文件的哪个位置。通常，刚打开文件时这个指针在文件的开头，但我们可以通过移动它来访问文件的不同部分。这对于大文件操作、随机访问文件或者访问特定格式的文件时，是非常有用的。

我们可以使用 tell() 方法返回文件的当前位置，然后使用 seek() 方法用于移动文件指针。seek() 方法接受两个参数：

- offset： 表示要移动的字节数。可以是正数（向文件尾方向移动）或负数（向文件头方向移动）
- whence（可选）： 设定基准点，表示从哪里开始移动。它可以是以下三种值之一： os.SEEK_SET 或 0 表示从文件开头开始（默认值）； os.SEEK_CUR 或 1 表示从当前位置开始；os.SEEK_END 或 2 表示从文件末尾开始。

示例：

```python
with open('sample.txt', 'r') as file:
    position = file.tell()
    print(f"当前文件位置： {position}")
    
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

注意： seek() 方法主要用于二进制模式（'rb', 'wb' 等）。 在文本模式（'r', 'w'）下，由于字符编码长度不固定的原因，seek() 操作受到严格限制。通常只允许：
- seek(0)：回到文件开头。
- seek(offset)：跳转到由 tell() 方法返回的某个特定位置。

试图在文本模式下使用相对偏移（如 `file.seek(5, 1)`）通常会引发异常。因此，如果需要自由移动文件指针，请务必使用二进制模式打开文件。

## 写入文件

写入文件与读取文件的方式非常类似，通常使用文件对象的 write() 方法写入数据：

```python
with open('sample.txt', 'w') as file:
    chars_written = file.write("Hello, World!")
    print(f"Wrote {chars_written} characters to the file.")
```

同样可以使用循环写入多行文件，但是需要确保每一行一定是以 `\n` 结尾：

```python
lines = ["Line 1", "Line 2", "Line 3"]

with open('sample.txt', 'w') as file:
    for line in lines:
        file.write(line)
        file.write('\n')
```

写入二进制数据的方法也类似，使用 'wb' 模式：

```python
# 二进制数据  
data = b'\x00\x01\x02\x03\x04\x05'  
  
# 打开一个文件用于写入二进制数据  
with open('binary_file.bin', 'wb') as f:  
    f.write(data)
```

文本文字有不同的编码方式，参考[字符串和字节之间的转换](string#字符串和字节之间的转换)。有时候，读写文本文件需要考虑编码格式：

```python
# 要写入的内容
text = "你好，世界"

# 以 GBK 编码写入文件
with open('example_gbk.txt', 'w', encoding='gbk') as file:
    file.write(text)
    
# 打开一个以 GBK 编码的文本文件
with open('example_gbk.txt', 'r', encoding='gbk') as file:
    content = file.read()
    print(content)    
```

## 数据转换成字节序列

之前，我们介绍了字符串和字节之间的转换。但是在使用二进制文件时，最主要的目的不是保存字符串，而是其它类型的数据，比如整数，列表等等。二进制文件读入时，一般都是以字节序列类型返回的，这就需要我们能够清楚知道，如何在字节序列与其它类型的数据之间进行转换。

### 整数与字节序列

整数可以通过使用 int.to_bytes(length, byteorder) 方法转换为字节序列，而字节序列可以通过使用 int.from_bytes(bytes, byteorder) 方法转换回整数。

```python
# 整数转换为字节序列
num = 0x01020304
byte_seq = num.to_bytes(4, 'big')  # 使用大端字节序
print(byte_seq)                    # 输出: b'\x01\x02\x03\x04'

# 字节序列转换回整数
num_from_bytes = int.from_bytes(byte_seq, 'big')
print(num_from_bytes)              # 输出: 16909060
```

转换过程中的字节序，大端（Big Endian）和小端（Little Endian），对于数字类型非常重要，转换和逆转换时要使用相同的字节序。大端和小端这两个名字来自小说《格列佛游记》。小说中的一个国家分成两派，一派认为扒鸡蛋壳，应该先敲碎鸡蛋的大头，被称为“大端派”；另一派认为，应该敲小头，被称为“小端派”。在计算机科学中，大端和小端用于描述字节序，也就是数据在内存中如何存储：

* 在大端模式中，字节的存储是从最高有效字节（MSB）到最低有效字节（LSB）的顺序。也就是低地址位存高位数据。例如，数字 `0x12345678` 在内存中的存储顺序为 `12 34 56 78`。
* 在小端模式中，字节的存储是从最低有效字节（LSB）到最高有效字节（MSB）的顺序，也就是高地址位存高位数据。同样的数字 `0x12345678` 在内存中的存储顺序为 `78 56 34 12`。

目前，主流 CPU 在处理数据的时候，都是按照“小端”顺序处理数据的，也就是高位数据保存在内存的高地址中；但是网络传输协议却大多是采用的“大端”，也就是高位数据保存在内存的低地址中。这两种设置没有明显的优劣之分，只要保证读写时采用一致的设置即可。


### 浮点数与字节序列

更复杂的数字，比如浮点数和字节序列之间，可以通过使用 struct 模块中的 pack() 和 unpack() 函数进行转换。

```python
import struct

# 浮点数转换为字节序列
num = 3.14159
byte_seq = struct.pack('f', num)
print(byte_seq)        # 输出类似于 b'\xdb\x0fI@'

# 字节序列转换回浮点数
num_from_bytes = struct.unpack('f', byte_seq)[0]
print(num_from_bytes)  # 输出: 3.14159
```
pack() 和 unpack() 函数在使用时需要一个格式字符串，这个格式字符串指定了如何解读和构造字节序列。常用格式包括：

* i: 32 位整数
* I: 32 位无符号整数
* h: 16 位整数
* H: 16 位无符号整数
* f: 单精度浮点数
* d: 双精度浮点数
* c: 字符
* s: 字符串（后跟长度）

pack() 和 unpack() 函数可以一次转换多个数据，比如：

```python
import struct

packed_data = struct.pack('I d', 12345, 3.141592654)

unpacked_data = struct.unpack('I d', packed_data)

print(unpacked_data)  # 输出： (12345, 3.141592654)
```

### 复杂数据类型与字节序列

更复杂的类型，比如列表、元组、字典等通常包含多个数据项。要将它们转换为字节序列，需要序列化这些数据。数据序列化也被称为数据平化，是指把原本结构化的，有多个层次的数据，转换为单一层次的一段连续的数据。这主要是为了便于在内存或硬盘设备中 存储数据，以及通过网络传输数据。序列化可以以多种方式实现，常见的被把数据转换成 JSON、XML等格式。 在 Web 开发中，JSON 是一种非常流行的轻量级数据交换格式，用于序列化和传输数据。

数据也可序列化为二进制格式，在 Python 中，可以使用内置的 pickle 模块来序列化和反序列化数据：

```python
import pickle

# 列表转换为字节序列
my_list = [1, 2, 3, 'Hello', True]
byte_seq = pickle.dumps(my_list)
print(byte_seq)         # 输出: 一串代表序列化列表的字节

# 字节序列转换回列表
list_from_bytes = pickle.loads(byte_seq)
print(list_from_bytes)  # 输出: [1, 2, 3, 'Hello', True]
```

安全警告： pickle 模块并不安全。千万不要对来自不可信来源（如网络下载、用户上传）的数据进行 pickle.loads() 操作。攻击者可以构造恶意的 pickle 数据，在反序列化时执行任意系统命令。对于需要跨语言或跨网络传输的数据，推荐使用 JSON 格式，它是安全且通用的。

例如：

```python
import json

data = {"name": "小明", "age": 25, "is_student": True}

# 序列化：将字典转换为 JSON 字符串并写入文件
with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False)

# 反序列化：从文件中读取 JSON
with open('data.json', 'r', encoding='utf-8') as f:
    read_data = json.load(f)
```

## 处理文件异常

文件读写过程中是非常容易出现各种错误的，比如文件可能不存在、文件没有访问权限、磁盘空间不足、文件格式错误等等。这些错误可能会直接影响到程序的运行效果，甚至会导致程序的崩溃。因此，在文件读写的过程中，异常处理机制是非常重要的。

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

在上面的示例中，我们尝试打开一个名为 "sample.txt" 的文件，并读取其中的内容。如果在这个过程中出现了任何错误，我们就会执行相应的异常处理代码。


## 内存文件

相比内存，硬盘读写速度慢很多。我们会需要在内存中创建一个文件对象，这个文件对象的访问方式与硬盘上的文件完全一样，唯一不同是它处于内存而不是硬盘，这样读写速度就会非常快。Python 通过 io 模块中的 BytesIO 和 StringIO 类来创建和操作内存中的文件对象。StringIO 用于在内存中存储字符串数据的文件对象；BytesIO 用于在内存中存储字节数据的文件对象。

比如，下面使用 StringIO 创建了一个内存文本文件：

```python
import io

# 创建一个内存中的字符串文件对象
output = io.StringIO()

# 写入数据
output.write("你好，")
output.write("这是一个内存中的文件！\n")
output.write("又写了一行。")

# 将文件指针移动到文件开始位置
output.seek(0)

# 读取数据
content = output.read()
print(content)

# 关闭内存文件
output.close()

# 输出：
# 你好，这是一个内存中的文件！
# 又写了一行。
```

下面使用 BytesIO 创建一个内存二进制文件：

```python
import io

# 创建一个内存中的字节文件对象
output = io.BytesIO()

# 写入数据 (需要提供字节数据)
output.write(b"Hello, ")
output.write(b"Here is data in memory.\n")
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

读写文件，必然需要先找到文件，那就离不开处理文件的路径。在 Python 中，处理文件和目录路径的最常用的库是 os.path 和 pathlib。在现代 Python 代码中（Python 3.4+），强烈推荐使用 pathlib，因为它提供了更直观、面向对象的方式来处理路径，且代码可读性更高。os.path 属于较老式的写法，目前主要用于维护旧项目。

以下是常用的路径处理函数和相应的示例：

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

使用 pathlib 的优势对比：
```python
from pathlib import Path
# os.path 写法 (旧)
path = os.path.join(folder, subfolder, 'file.txt')
# pathlib 写法 (新) - 支持使用 / 运算符拼接
path = Path(folder) / subfolder / 'file.txt'
```

### 临时文件

在学习或者做实验的时候，常常会需要把数据保存到文件中，但是因为不需要长期保存文件，我们可能会懒得给文件起名，这时候可以让系统把数据保存到系统临时文件夹的临时文件中。这样过后，系统自动清理这些不再需要的文件。Python 使用 tempfile 模块来创建临时文件。以下是一个示例，我们写入一些数据到一个临时文件，并返回其路径：

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

### 查找特定类型的文件

我们有时候会希望得到一个文件夹下，所有符合某个特征的所有文件，比如找出所有的 `*.txt` 文件。我们可以使用 os 模块提供的函数遍历一个文件夹，比如：

```python
import os

# 遍历文件夹
for root, dirs, files in os.walk('/path/to/folder'):
    for file in files:
        # 检查文件扩展名
        if file.endswith('.txt'):
            print(os.path.join(root, file))
```


上面的程序使用 os.walk() 函数遍历指定的文件夹。对于每个遍历到的文件，然后，使用字符串方法 endswith() 检查文件名是否以 .txt 结尾，如果是，就打印出该文件的完整路径。

此外，我们也可以使用 glob 模块中的 glob() 函数来查找文件。glob 最早是 UNIX 系统的一个程序，用来匹配文件路径，Python 在其 glob 模块中实现了类似功能。glob() 函数可以使用正则表达式来查找文件，这样我们就不必再手动检查每个文件了。比如，使用 glob 实现上面示例完全相同的功能：

```python
import glob

# 假设我们要查找扩展名为 .txt 的文件
for filepath in glob.glob('/path/to/folder/*.txt'):
    print(filepath)
```

glob() 函数返回的是一个列表，使用同一模块中的 iglob() 函数，可以为搜索结果生成一个迭代器，其它功能完全相同：

```python
import glob

# 假设我们要查找扩展名为 .txt 的文件
for filepath in glob.iglob('/path/to/folder/*.txt'):
    print(filepath)
```

glob() 函数一个极其强大的功能是它不仅可以搜索单层文件夹，还可以递归搜索所有的子文件夹。在搜索子文件夹的时候，必须使用 `**` 作为路径通配符，并且把参数 recursive 设为 True。比如下面的程序可以找到 "folder" 文件夹及其所有子文件夹中任何以 "f" 字母开头的文件。

```python
import glob

# 使用 '**' 进行递归搜索
# 参数 'recursive=True' 是必须的，以启用 '**' 的递归功能
for filepath in glob.glob('/path/to/folder/**/f*', recursive=True):
    print(filepath)
```


### 删除文件

除了创建，读写文件，我们也会需要在适当时候删除一个文件，可以使用 `os.remove()` 函数删除文件：

```python
import os

# Specify the file path
file_path = '/path/to/your/file.txt'

# Check if file exists
if os.path.exists(file_path):
    # Delete the file
    os.remove(file_path)
```


