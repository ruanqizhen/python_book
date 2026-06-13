# File I/O

Data stored in variables vanishes when a program exits. To preserve data across multiple program runs (such as configurations, logs, or user profiles) or to save the results of computation, you must write that data to files. File I/O (Input/Output) typically involves three steps: opening the file, reading from or writing to it, and then closing the file.

## Open and Close

### Opening a File

In Python, you open a file using the built-in `open()` function. It requires the file path and the opening mode:

```python
file = open("filename.txt", "r")
```

In this example, `"r"` specifies that the file should be opened in read-only mode (you can read its contents but cannot modify them). The most common file modes are:

* `"r"`: Read-only mode (default). The file must already exist.
* `"w"`: Write-only mode. If the file exists, Python clears its contents before writing; if it doesn't, a new file is created.
* `"a"`: Append mode. Writes data to the end of the file without altering existing content. If the file doesn't exist, Python creates it.
* `"b"`: Binary mode. Indicates the file contains binary data (bytes) rather than plain text. Must be combined with other modes, such as `"rb"` or `"wb"`.
* `"x"`: Exclusive creation mode. Opens a file for writing only if it does not already exist. If it does, a `FileExistsError` is raised.

### Closing a File

You should always close a file once you are finished with it using the `close()` method:

```python
file.close()
```

Closing files is a crucial step. When writing to a file, Python often buffers data in memory; closing the file flushes the buffer and ensures all data is written to the disk. Failing to close a file can lead to data loss or file corruption. 

Additionally, open files consume operating system resources. On Windows, an open file might be locked, preventing other [threads or processes](multithread#processes-and-threads) from reading or modifying it. Since operating systems limit the number of files a single program can open simultaneously, leaving files open can cause your program to crash when it runs out of file descriptors.

### The with Statement

To simplify resource management and guarantee files are closed, Python provides the `with` statement. 

The basic structure of a `with` statement is:

```python
with expression as variable:
    # do something with the variable
```

The most common use case is opening a file. When the execution block exits—even if an exception is raised inside it—Python automatically closes the file:

```python
with open('myfile.txt', 'w') as file:
    file.write('Hello, world!')
# The file is automatically closed here
```

Using the `with` statement is the standard, modern way to handle file operations in Python.

## Reading Files

### Text Files

The simplest way to read a text file is to open it and call its `read()` method, which returns the entire contents of the file as a single string:

```python
with open('sample.txt', 'r') as file:
    content = file.read()
print(content)
```

If you only provide a filename (like `'sample.txt'`), Python looks for it in the directory where the script is executed. If it is located elsewhere, you must provide the absolute or relative directory path.

### Reading a File Line by Line

If you want to read only a single line from a file, use the `readline()` method:

```python
with open('example.txt', 'r') as file:
    first_line = file.readline()
print(first_line)
```

To read an entire file line by line, iterate over the file object directly using a `for` loop. This is memory-efficient because Python only loads one line into memory at a time:

```python
with open('filename.txt', 'r') as file:
    for line in file:
        print(line)
```

Each line in a text file ends with a newline character (`\n` on macOS/Linux, `\r\n` on Windows). Because `print()` also adds a newline, you might see extra blank lines in the console. You can remove trailing whitespace and newlines using the string `strip()` method:

```python
print(line.strip())
```

### Binary Files

Reading binary files (like images, ZIP archives, or compiled data) is similar to reading text files, but you must open the file in binary mode (`'rb'`). When reading in binary mode, the `read()` method returns a [byte sequence](string#byte-sequences) (`bytes`) instead of a string:

```python
with open('filename.bin', 'rb') as file:
    data = file.read()
```

Binary files do not have "lines." For large binary files, loading the entire file into memory at once can exhaust system resources. Instead, read the file in small chunks by passing a byte limit to the `read()` method:

```python
chunk_size = 1024  # Read 1024 bytes at a time

with open('filename.bin', 'rb') as file:
    chunk = file.read(chunk_size)
    while chunk:
        # Process the current chunk
        print(chunk)
        chunk = file.read(chunk_size)   # Read the next chunk
```

### Moving the File Pointer

Whenever you read from or write to a file, Python tracks your current position inside the file using a "file pointer." When a file is opened, the pointer is set to the beginning (index 0). As you read or write, the pointer advances.

You can inspect the pointer's position using `tell()` and change it using `seek()`. The `seek(offset, whence)` method accepts two arguments:
* `offset`: The number of bytes to move the pointer.
* `whence` (optional): The starting reference point:
  * `0` (or `os.SEEK_SET`): Beginning of the file (default).
  * `1` (or `os.SEEK_CUR`): Current position.
  * `2` (or `os.SEEK_END`): End of the file.

```python
with open('sample.txt', 'rb') as file:
    # Get current position (0)
    print(file.tell())
    
    # Move 5 bytes forward from the current position
    file.seek(5, 1)
    
    # Move 5 bytes backward from the end of the file
    file.seek(-5, 2)
    
    # Move to the 10th byte from the start
    file.seek(10)
    
    # Read 1 byte at the current pointer position
    print(file.read(1))
```

> [!WARNING]
> The `seek()` method is designed for binary files. In text mode (`'r'`), due to variable-width multi-byte character encodings (like UTF-8), seeking to arbitrary byte offsets can corrupt characters or raise errors. In text mode, you should only seek to the beginning (`seek(0)`) or to positions returned by a prior call to `tell()`.

## Writing Files

Writing to a file uses the file object's `write()` method. In write mode (`'w'`), Python will overwrite the file if it already exists:

```python
with open('sample.txt', 'w') as file:
    chars_written = file.write("Hello, World!")
    print(f"Wrote {chars_written} characters to the file.")
```

To write multiple lines, loop through a sequence and write each string, ensuring you append a newline character `\n` to separate lines:

```python
lines = ["Line 1", "Line 2", "Line 3"]

with open('sample.txt', 'w') as file:
    for line in lines:
        file.write(line)
        file.write('\n')
```

To write binary data, open the file in binary write mode (`'wb'`):

```python
data = b'\x00\x01\x02\x03\x04\x05'  
  
with open('binary_file.bin', 'wb') as f:  
    f.write(data)
```

Different encodings write text data differently; refer to [Converting Between Strings and Bytes](string#converting-between-strings-and-bytes). When reading or writing text files, you should always specify the encoding explicitly (usually `'utf-8'`) to prevent errors on different systems:

```python
text = "Hello, World"

# Write using GBK encoding
with open('example_gbk.txt', 'w', encoding='gbk') as file:
    file.write(text)
    
# Read using GBK encoding
with open('example_gbk.txt', 'r', encoding='gbk') as file:
    content = file.read()
    print(content)    
```

## Converting Data to Byte Sequences

When working with binary files, we often need to save and load non-string data types, such as integers, floats, or complex lists. Because binary files only read and write raw bytes, we must convert our data to and from byte sequences.

### Integers and Byte Sequences

To convert an integer to a byte sequence, use `int.to_bytes(length, byteorder)`. To convert it back, use `int.from_bytes(bytes, byteorder)`:

```python
# Integer to byte sequence
num = 0x01020304
byte_seq = num.to_bytes(4, 'big')  # Big-endian byte order
print(byte_seq)                    # Output: b'\x01\x02\x03\x04'

# Byte sequence back to integer
num_from_bytes = int.from_bytes(byte_seq, 'big')
print(num_from_bytes)              # Output: 16909060
```

Byte order, or *endianness* (Big Endian and Little Endian), is critical when converting numeric types. You must use the same byte order for both encoding and decoding. 

The terms "Big Endian" and "Little Endian" originate from Jonathan Swift's satirical novel *Gulliver's Travels*, in which two political factions debate whether boiled eggs should be cracked at the larger end ("Big-Endians") or the smaller end ("Little-Endians"). In computer architecture:
* **Big Endian**: Stores the Most Significant Byte (MSB) at the lowest memory address. The integer `0x12345678` is stored as `12 34 56 78`.
* **Little Endian**: Stores the Least Significant Byte (LSB) at the lowest memory address. The same integer is stored as `78 56 34 12`.

Mainstream modern CPUs (like x86 and ARM) utilize little-endian byte order for processing, whereas network protocols typically use big-endian order. Neither has a technical advantage over the other, as long as reading and writing systems agree on the byte order.

### Floating-Point Numbers and Byte Sequences

To convert floating-point numbers or structured values to bytes, use the `pack()` and `unpack()` functions from the built-in `struct` module:

```python
import struct

# Float to byte sequence
num = 3.14159
byte_seq = struct.pack('f', num)
print(byte_seq)        # Output: b'\xdb\x0fI@'

# Byte sequence back to float
num_from_bytes = struct.unpack('f', byte_seq)[0]
print(num_from_bytes)  # Output: 3.14159
```

The format string (e.g., `'f'`) specifies how to interpret the byte layout. Common format codes include:
* `i`: 32-bit integer
* `I`: 32-bit unsigned integer
* `h`: 16-bit integer
* `H`: 16-bit unsigned integer
* `f`: 32-bit float
* `d`: 64-bit double-precision float
* `c`: Char (character)
* `s`: Byte string (prefixed with a length, e.g., `5s`)

You can pack multiple values into a single byte sequence at once:

```python
import struct

packed_data = struct.pack('I d', 12345, 3.141592654)
unpacked_data = struct.unpack('I d', packed_data)

print(unpacked_data)  # Output: (12345, 3.141592654)
```

### Complex Data Types and Byte Sequences

Converting complex objects (like lists, dictionaries, or custom class instances) into a flat byte stream is called **serialization** (or data flattening). Rebuilding objects from a byte stream is **deserialization**. Serialization is used for saving program state to disk, caching, or transmitting data over a network.

Python provides the built-in `pickle` module to serialize arbitrary Python objects to binary:

```python
import pickle

my_list = [1, 2, 3, 'Hello', True]

# Serialize object to bytes
byte_seq = pickle.dumps(my_list)

# Deserialize bytes back to object
list_from_bytes = pickle.loads(byte_seq)
print(list_from_bytes)  # Output: [1, 2, 3, 'Hello', True]
```

> [!CAUTION]
> The `pickle` module is not secure. Never deserialize data from untrusted sources (such as user uploads or files downloaded from the internet). A maliciously crafted pickle byte stream can execute arbitrary shell commands when `pickle.loads()` is called. 
> For general data sharing, particularly across different programming languages or web services, use standard text-based formats like JSON or XML.

To serialize data safely to JSON:

```python
import json

data = {"name": "Xiao Ming", "age": 25, "is_student": True}

# Serialize: dict to JSON file
with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False)

# Deserialize: JSON file to dict
with open('data.json', 'r', encoding='utf-8') as f:
    read_data = json.load(f)
```

## Handling File Exceptions

File I/O operations are highly prone to runtime errors: files might not exist, directories might be read-only, or the disk might run out of space. You should always wrap file operations in a `try` ... `except` block to prevent crashes:

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
    print("Input/Output error occurred!")
finally:
    print("Completed clean-up checks.")
```

## In-Memory Files

Reading and writing files on physical disks is much slower than accessing RAM. Python's `io` module provides `StringIO` and `BytesIO` to create file-like objects in memory. These objects behave exactly like standard file objects but read/write directly to memory, making operations extremely fast:

* `StringIO`: For storing text in memory.
* `BytesIO`: For storing raw bytes in memory.

Using `StringIO`:

```python
import io

# Create in-memory file
output = io.StringIO()

# Write data
output.write("Hello, ")
output.write("This is a file in memory!\n")
output.write("Another line written.")

# Move pointer to the start to read
output.seek(0)

# Read content
content = output.read()
print(content)

# Release resource
output.close()
```

Using `BytesIO`:

```python
import io

output = io.BytesIO()

# Write binary data
output.write(b"Hello, ")
output.write(b"Here is data in memory.\n")

output.seek(0)
byte_content = output.read()
print(byte_content.decode('utf-8'))

output.close()
```

In-memory file objects are highly useful for caching, parsing, or testing code that expects a file object without creating actual files on disk.

## Path Handling

Managing file paths manually using string operations is error-prone. Modern Python code (Python 3.4+) uses the object-oriented `pathlib` module to handle file and folder paths cleanly across different operating systems. (The older `os.path` module is still present in Python but is primarily used for maintaining legacy code).

Here is a summary of path operations using `pathlib`:

```python
from pathlib import Path

# Create a Path object
p = Path('folder/subfolder/file.txt')

# Join paths using the / operator
new_path = p.parent / 'another_file.txt'

# Get the absolute path
abs_path = p.resolve()

# Extract filename
base_name = p.name  # Returns 'file.txt'

# Extract parent directory
dir_name = p.parent  # Returns Path('folder/subfolder')

# Check if path exists
exists = p.exists()

# Check path type
is_dir = p.is_dir()
is_file = p.is_file()
```

Comparing paths:
```python
from pathlib import Path
import os

# Legacy os.path style:
path = os.path.join(folder, subfolder, 'file.txt')

# Modern pathlib style:
path = Path(folder) / subfolder / 'file.txt'
```

### Temporary Files

If your script needs to save temporary files that do not require long-term storage, you can use the `tempfile` module. It writes temporary files directly to the system's designated temp folder:

```python
import tempfile

def write_to_temp_file(data: str) -> str:
    # Create temporary file (kept open after writing)
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(data.encode('utf-8'))
        return temp_file.name

data = "Hello, Temp World!"
temp_file_path = write_to_temp_file(data)
print(f"Data written to temporary file: {temp_file_path}")
```

Setting `delete=False` ensures that the temporary file is not deleted automatically when closed, allowing other parts of your code to access it.

### Finding Specific File Types

To find files matching a specific pattern inside a directory (like searching for all `.txt` files), you can use the built-in `glob` module. It acts as a pattern-matching utility:

```python
import glob

# Find all .txt files in a directory
for filepath in glob.glob('/path/to/folder/*.txt'):
    print(filepath)
```

The `glob()` function returns a list of paths. If you are handling large numbers of files, use `iglob()`, which returns an iterator to process matches lazily:

```python
import glob

for filepath in glob.iglob('/path/to/folder/*.txt'):
    print(filepath)
```

To search recursively through all subdirectories, use the `**` path wildcard and set `recursive=True`:

```python
import glob

# Find all files starting with "f" in all subfolders
for filepath in glob.glob('/path/to/folder/**/f*', recursive=True):
    print(filepath)
```

### Deleting Files

To delete files, use the `os.remove()` function:

```python
import os

file_path = '/path/to/your/file.txt'

if os.path.exists(file_path):
    os.remove(file_path)
```
