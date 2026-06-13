# File I/O

Data in a program disappears when the program ends. Data that needs to be preserved across multiple program runs (such as configuration states, user information, etc.), or data that needs to be available after the program ends (such as computation results, etc.), must be saved to files. File I/O typically involves opening a file, performing read or write operations, and then closing the file.

## Open and Close

### Opening a File

Python uses the `open()` function to open a file. It takes two main parameters: the file path and the opening mode:

```python
file = open("filename.txt", "r")
```

In the example above, the opening mode `"r"` indicates the file is opened in read-only mode (can only read, cannot modify). Common file opening modes include:

* `"r"`: Read-only mode. This is the default mode.
* `"w"`: Write mode. If the file already exists, its contents are cleared before writing; otherwise, a new file is created.
* `"a"`: Append mode. If the file exists, data is appended to the end of the file; otherwise, a new file is created.
* `"b"`: Binary mode, indicating the file contains binary byte data. It must be used in combination with other modes, such as `"rb"` or `"wb"`.
* `"x"`: Exclusive mode, indicating the file must not already exist. A new file is created and opened only if it does not exist.

### Closing a File

An opened file can be closed using the `close()` method:

```python
file.close()
```

Closing an opened file is a very important step. Especially when writing to a file, closing the file ensures that all buffered data is properly written to disk. Failing to close a file may result in incomplete or corrupted data writes. Even in read-only scenarios, the file must be closed after access; otherwise: first, it may affect other parts of the program or other programs trying to use that file, because the file may be locked while open, preventing access by other [threads or processes](multithread#进程和线程) to prevent data errors; second, each process has a limit on the number of files it can open. If opened files are not closed, the program may not be able to open new files.

### The with Statement

The `with` statement is used by Python to simplify resource management, such as file I/O, network connections, database connections, etc.

The basic structure of the `with` statement is as follows:

```python
with expression as variable:
    # do something with the variable
```

The most common use of the `with` statement is to open files, ensuring the file is properly closed after operations are complete, without needing to explicitly call the `close()` method. Regardless of whether an exception occurs within the `with` code block, the resource opened using the `with` statement will be properly cleaned up and closed.

Using the `with` statement for file operations looks like this:

```python
with open('myfile.txt', 'w') as file:
    file.write('Hello, world!')
# File is automatically closed, no need to explicitly call file.close()
```

In the example above, whether or not the `file.write()` method raises an exception, the file is automatically closed when the `with` block ends.

## Reading Files

### Text Files

The most basic file reading simply opens a file and uses the file object's `read()` method to read its contents:

```python
with open('sample.txt', 'r') as file:
    content = file.read()
print(content)
```

Here, `'sample.txt'` is the name of the file to read. If only the filename is provided, ensure the file is in the same folder as the Python program; otherwise, use the full path. `'r'` indicates read-only mode for a text file. In this mode, the `read()` method reads and returns the entire contents of the file as a string.

### Reading a File Line by Line

If you only want to read one line from a text file, you can use the `readline` method, for example:

```python
# Open the file
with open('example.txt', 'r') as file:
    # Read the first line
    first_line = file.readline()

# Output the read content
print(first_line)
```

For most text files, we typically want to read all the content line by line. The most common approach is to use a `for` loop. When iterating over a file object, Python reads the file line by line by default:

```python
with open('filename.txt', 'r') as file:
    for line in file:
        print(line)
```

Each line of a text file usually ends with a newline character. Linux-formatted text files use `\n` as the newline character, while Windows-formatted text files use `\r\n`. If you don't want extra blank lines in the output, you can use the string's `strip()` method to remove it:

```python
print(line.strip())
```

### Binary Files

Reading binary files is very similar to reading text files, except you need to use `'rb'` (read binary) mode when opening the file. When reading binary files, the data type returned by the `read()` function is a [byte sequence](string#字节序列) rather than a string.

Binary files don't have the concept of lines. For large files, we typically read them in chunks. For example, we can read 1024 bytes at a time, process them, then read the next 1024 bytes, and so on until the end of the file. This is done by passing an argument representing the number of bytes to the `read()` function, as shown below:

```python
chunk_size = 1024  # Read 1024 bytes at a time

with open('filename.bin', 'rb') as file:
    chunk = file.read(chunk_size)
    while chunk:
        # Process each chunk read...
        print(chunk)
        
        chunk = file.read(chunk_size)   # Read the next chunk
```

This approach is especially useful when dealing with large files or when you want to control memory usage, because it only loads a small portion of the file into memory at a time.

### Moving the File Pointer

Readers may have noticed that in the examples above, each call to `file.read(chunk_size)` automatically returns subsequent data from the file. This is because, when a file is opened and reading or writing begins, the file object maintains a "pointer" or "file position" that indicates the current location in the file being read or written. Typically, this pointer is at the beginning of the file when it is first opened, but we can move it to access different parts of the file. This is very useful for large file operations, random file access, or accessing files with specific formats.

We can use the `tell()` method to return the current position of the file, and the `seek()` method to move the file pointer. The `seek()` method takes two parameters:

- `offset`: The number of bytes to move. Can be a positive number (moving toward the end of the file) or a negative number (moving toward the beginning of the file).
- `whence` (optional): Sets the reference point, indicating where to start moving. It can be one of three values: `os.SEEK_SET` or `0` means start from the beginning of the file (default); `os.SEEK_CUR` or `1` means start from the current position; `os.SEEK_END` or `2` means start from the end of the file.

Example:

```python
with open('sample.txt', 'r') as file:
    position = file.tell()
    print(f"Current file position: {position}")
    
with open('sample.txt', 'rb') as file:
    # Move 5 bytes forward from the current position
    file.seek(5, 1)
    
    # Move 5 bytes backward from the end of the file
    file.seek(-5, 2)
    
    # Move to the 10th byte position in the file
    file.seek(10)
    
    # Because the file pointer is at the 10th byte position,
    # the following read method will read the data at the 10th byte
    file.read(1)
```

Note: The `seek()` method is primarily used in binary mode (`'rb'`, `'wb'`, etc.). In text mode (`'r'`, `'w'`), due to variable character encoding lengths, `seek()` operations are severely restricted. Typically, only the following are allowed:
- `seek(0)`: Go back to the beginning of the file.
- `seek(offset)`: Jump to a specific position previously returned by the `tell()` method.

Attempting to use relative offsets in text mode (such as `file.seek(5, 1)`) will usually raise an exception. Therefore, if you need to freely move the file pointer, be sure to open the file in binary mode.

## Writing Files

Writing to a file is very similar to reading from a file. You typically use the file object's `write()` method to write data:

```python
with open('sample.txt', 'w') as file:
    chars_written = file.write("Hello, World!")
    print(f"Wrote {chars_written} characters to the file.")
```

You can also use a loop to write multiple lines to a file, but you need to ensure each line ends with `\n`:

```python
lines = ["Line 1", "Line 2", "Line 3"]

with open('sample.txt', 'w') as file:
    for line in lines:
        file.write(line)
        file.write('\n')
```

The method for writing binary data is similar, using `'wb'` mode:

```python
# Binary data  
data = b'\x00\x01\x02\x03\x04\x05'  
  
# Open a file for writing binary data  
with open('binary_file.bin', 'wb') as f:  
    f.write(data)
```

Text has different encoding schemes; refer to [Conversion between strings and bytes](string#字符串和字节之间的转换). Sometimes, reading and writing text files requires considering the encoding format:

```python
# Content to write
text = "Hello, World"

# Write to a file with GBK encoding
with open('example_gbk.txt', 'w', encoding='gbk') as file:
    file.write(text)
    
# Open a text file encoded in GBK
with open('example_gbk.txt', 'r', encoding='gbk') as file:
    content = file.read()
    print(content)    
```

## Converting Data to Byte Sequences

Earlier, we introduced the conversion between strings and bytes. However, when working with binary files, the main purpose is not to save strings, but other types of data, such as integers, lists, etc. When reading binary files, the data is typically returned as a byte sequence type, which means we need to know how to convert between byte sequences and other data types.

### Integers and Byte Sequences

An integer can be converted to a byte sequence using the `int.to_bytes(length, byteorder)` method, and a byte sequence can be converted back to an integer using the `int.from_bytes(bytes, byteorder)` method.

```python
# Integer to byte sequence
num = 0x01020304
byte_seq = num.to_bytes(4, 'big')  # Using big-endian byte order
print(byte_seq)                    # Output: b'\x01\x02\x03\x04'

# Byte sequence back to integer
num_from_bytes = int.from_bytes(byte_seq, 'big')
print(num_from_bytes)              # Output: 16909060
```

The byte order during conversion, Big Endian and Little Endian, is very important for numeric types. The same byte order must be used for conversion and reverse conversion. The names Big Endian and Little Endian come from the novel "Gulliver's Travels." In the novel, a country is divided into two factions: one believes that when breaking an eggshell, you should crack the big end first, called the "Big-Endians"; the other believes you should crack the small end, called the "Little-Endians." In computer science, big endian and little endian describe byte order, i.e., how data is stored in memory:

* In big-endian mode, bytes are stored from the Most Significant Byte (MSB) to the Least Significant Byte (LSB). That is, the lower address stores the higher-order data. For example, the number `0x12345678` is stored in memory as `12 34 56 78`.
* In little-endian mode, bytes are stored from the Least Significant Byte (LSB) to the Most Significant Byte (MSB). That is, the higher address stores the higher-order data. The same number `0x12345678` is stored in memory as `78 56 34 12`.

Currently, mainstream CPUs process data using little-endian order, meaning higher-order data is stored in higher memory addresses. However, most network transmission protocols use big-endian, meaning higher-order data is stored in lower memory addresses. There is no clear advantage to either setting, as long as consistent settings are used for reading and writing.

### Floating-Point Numbers and Byte Sequences

More complex numbers, such as floating-point numbers, can be converted to and from byte sequences using the `pack()` and `unpack()` functions from the `struct` module.

```python
import struct

# Floating-point number to byte sequence
num = 3.14159
byte_seq = struct.pack('f', num)
print(byte_seq)        # Output is similar to b'\xdb\x0fI@'

# Byte sequence back to floating-point number
num_from_bytes = struct.unpack('f', byte_seq)[0]
print(num_from_bytes)  # Output: 3.14159
```

The `pack()` and `unpack()` functions require a format string that specifies how to interpret and construct the byte sequence. Common format codes include:

* `i`: 32-bit integer
* `I`: 32-bit unsigned integer
* `h`: 16-bit integer
* `H`: 16-bit unsigned integer
* `f`: Single-precision floating-point number
* `d`: Double-precision floating-point number
* `c`: Character
* `s`: String (followed by length)

The `pack()` and `unpack()` functions can convert multiple data items at once, for example:

```python
import struct

packed_data = struct.pack('I d', 12345, 3.141592654)

unpacked_data = struct.unpack('I d', packed_data)

print(unpacked_data)  # Output: (12345, 3.141592654)
```

### Complex Data Types and Byte Sequences

More complex types, such as lists, tuples, dictionaries, etc., typically contain multiple data items. To convert them into byte sequences, the data needs to be serialized. Data serialization, also called data flattening, refers to converting structured, multi-layered data into a single-layer continuous stream of data. This is primarily for storing data in memory or on disk devices, as well as for transmitting data over a network. Serialization can be implemented in various ways, with common formats being JSON, XML, etc. In web development, JSON is a very popular lightweight data interchange format used for serializing and transmitting data.

Data can also be serialized into binary format. In Python, the built-in `pickle` module can be used for serialization and deserialization:

```python
import pickle

# List to byte sequence
my_list = [1, 2, 3, 'Hello', True]
byte_seq = pickle.dumps(my_list)
print(byte_seq)         # Output: a sequence of bytes representing the serialized list

# Byte sequence back to list
list_from_bytes = pickle.loads(byte_seq)
print(list_from_bytes)  # Output: [1, 2, 3, 'Hello', True]
```

Security Warning: The `pickle` module is not safe. Never perform `pickle.loads()` on data from untrusted sources (such as downloaded from the internet or user uploads). Attackers can construct malicious pickle data that executes arbitrary system commands during deserialization. For data that needs to be transmitted across languages or networks, it is recommended to use the JSON format, which is safe and universal.

For example:

```python
import json

data = {"name": "Xiao Ming", "age": 25, "is_student": True}

# Serialization: Convert dictionary to JSON string and write to file
with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False)

# Deserialization: Read JSON from file
with open('data.json', 'r', encoding='utf-8') as f:
    read_data = json.load(f)
```

## Handling File Exceptions

Various errors can easily occur during file I/O operations, such as the file not existing, lack of file access permissions, insufficient disk space, incorrect file format, etc. These errors can directly affect the program's execution, and may even cause the program to crash. Therefore, exception handling mechanisms are very important during file I/O.

```python
try:
    with open('sample.txt', 'r') as file:
        content = file.read()
        print(content)
except FileNotFoundError:
    print("File not found!")
except PermissionError:
    print("No permission to access the file!")
except IOError:
    print("Input/Output error!")
finally:
    print("This will run regardless of whether an error occurred.")
```

In the example above, we attempt to open a file named "sample.txt" and read its contents. If any error occurs during this process, the corresponding exception handling code will be executed.

## In-Memory Files

Compared to memory, disk reading and writing is much slower. We may need to create a file object in memory that behaves exactly like a file on disk, the only difference being that it resides in memory rather than on disk, making read and write operations very fast. Python provides `BytesIO` and `StringIO` classes in the `io` module to create and manipulate file objects in memory. `StringIO` is used for file objects that store string data in memory; `BytesIO` is used for file objects that store byte data in memory.

For example, the following creates an in-memory text file using `StringIO`:

```python
import io

# Create an in-memory string file object
output = io.StringIO()

# Write data
output.write("Hello, ")
output.write("This is a file in memory!\n")
output.write("Another line written.")

# Move the file pointer to the beginning
output.seek(0)

# Read data
content = output.read()
print(content)

# Close the in-memory file
output.close()

# Output:
# Hello, This is a file in memory!
# Another line written.
```

The following creates an in-memory binary file using `BytesIO`:

```python
import io

# Create an in-memory byte file object
output = io.BytesIO()

# Write data (must provide byte data)
output.write(b"Hello, ")
output.write(b"Here is data in memory.\n")
output.write(b"Another line.")

# Move the file pointer to the beginning
output.seek(0)

# Read data
byte_content = output.read()
print(byte_content.decode('utf-8'))

# Close the in-memory file
output.close()
```

These in-memory file objects are almost identical to regular file objects in usage, but they exist only in memory and are not written to disk. This makes them very useful for scenarios requiring fast, temporary file operations, such as parsing data or caching data.

## Path Handling

Reading and writing files necessarily requires finding the file first, which involves handling file paths. In Python, the most commonly used libraries for handling file and directory paths are `os.path` and `pathlib`. In modern Python code (Python 3.4+), it is strongly recommended to use `pathlib` because it provides a more intuitive, object-oriented way to handle paths, with better code readability. `os.path` is an older style, now mainly used for maintaining legacy projects.

Below are commonly used path handling functions with corresponding examples:

### Using pathlib:

```python
from pathlib import Path

# Create a Path object
p = Path('folder/subfolder/file.txt')

# Join paths
new_path = p.parent / 'another_file.txt'

# Get the absolute path
abs_path = p.resolve()

# Get the base name (filename or last directory name)
base_name = p.name  # Returns 'file.txt'

# Get the directory name
dir_name = p.parent  # Returns a Path object: 'folder/subfolder'

# Check if the path exists
exists = p.exists()

# Check if the path is a directory
is_dir = p.is_dir()

# Check if the path is a file
is_file = p.is_file()

# Split the path into directory and file parts
dir_part, file_part = p.parent, p.name  # Returns (Path('folder/subfolder'), 'file.txt')
```

Advantages of using pathlib:
```python
from pathlib import Path
# os.path style (old)
path = os.path.join(folder, subfolder, 'file.txt')
# pathlib style (new) - supports path concatenation using the / operator
path = Path(folder) / subfolder / 'file.txt'
```

### Temporary Files

When studying or experimenting, we often need to save data to a file, but since long-term storage is not required, we may be reluctant to name the file. In such cases, we can let the system save the data to a temporary file in the system's temporary folder. The system will then automatically clean up these no-longer-needed files later. Python uses the `tempfile` module to create temporary files. Here is an example where we write some data to a temporary file and return its path:

```python
import tempfile

def write_to_temp_file(data: str) -> str:
    # Create a temporary file that won't be automatically deleted when closed
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(data.encode('utf-8'))
        return temp_file.name

data = "Hello, Temp World!"
temp_file_path = write_to_temp_file(data)
print(f"Data has been written to: {temp_file_path}")
```

In this example:

`tempfile.NamedTemporaryFile` is used to create a temporary file. By default, when the temporary file is closed, it is automatically deleted. If you want to keep the file, you can set the parameter `delete=False`. The function returns the path of the temporary file, which can then be used to access or process the file.

### Finding Specific File Types

Sometimes we want to get all files in a folder that match a certain pattern, for example, finding all `*.txt` files. We can use functions from the `os` module to traverse a folder, such as:

```python
import os

# Traverse the folder
for root, dirs, files in os.walk('/path/to/folder'):
    for file in files:
        # Check the file extension
        if file.endswith('.txt'):
            print(os.path.join(root, file))
```

The program above uses the `os.walk()` function to traverse the specified folder. For each file encountered, it uses the string method `endswith()` to check if the filename ends with `.txt`. If it does, it prints the full path of that file.

Alternatively, we can use the `glob()` function from the `glob` module to find files. `glob` was originally a UNIX program for matching file paths, and Python implements similar functionality in its `glob` module. The `glob()` function can use regular expressions to find files, so we no longer need to manually check each file. For example, using `glob` to achieve the exact same functionality as the example above:

```python
import glob

# Suppose we want to find files with the .txt extension
for filepath in glob.glob('/path/to/folder/*.txt'):
    print(filepath)
```

The `glob()` function returns a list. Using the `iglob()` function from the same module generates an iterator for the search results, with all other functionality being identical:

```python
import glob

# Suppose we want to find files with the .txt extension
for filepath in glob.iglob('/path/to/folder/*.txt'):
    print(filepath)
```

An extremely powerful feature of the `glob()` function is that it can not only search a single folder but also recursively search all subfolders. When searching subfolders, you must use `**` as the path wildcard and set the `recursive` parameter to `True`. For example, the following program finds all files starting with the letter "f" in the "folder" directory and all its subdirectories.

```python
import glob

# Use '**' for recursive search
# The parameter 'recursive=True' is required to enable the recursive functionality of '**'
for filepath in glob.glob('/path/to/folder/**/f*', recursive=True):
    print(filepath)
```

### Deleting Files

Besides creating, reading, and writing files, we also need to delete a file at the appropriate time. You can use the `os.remove()` function to delete a file:

```python
import os

# Specify the file path
file_path = '/path/to/your/file.txt'

# Check if file exists
if os.path.exists(file_path):
    # Delete the file
    os.remove(file_path)
```
