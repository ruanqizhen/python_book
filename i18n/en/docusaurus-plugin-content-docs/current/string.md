# Strings

:::tip
String and [list](list) operations often rely on [loops](loop) and [conditionals](condition). While we introduce string and list manipulation early in this book to keep data types grouped together, beginners may prefer to read this section for a basic overview first. You can return to study the advanced operations after mastering control flow, which will make them much easier to understand.
:::

A string in Python is an ordered sequence of characters, which can include letters, numbers, punctuation, and symbols. In Python, strings are **immutable**.

## Creating Strings

In Python, you can define short strings using single quotes (`' '`) or double quotes (`" "`). Multi-line strings are defined using triple quotes (`''' '''` or `""" """`):

```python
string1 = 'Hello, World!'
string2 = "Hello, World!"
string3 = '''Hello
World!'''                  # This is a multi-line string
string4 = """Another
multi-line
string."""
```

Unassigned triple-quoted strings are often used as multiline comments, saving you from adding a `#` symbol to each line.

Tip: If your string contains double quotes, enclose it in single quotes. If it contains single quotes (like contractions), enclose it in double quotes. This avoids escaping:

```python
"""
This is a comment, the program logic will not use the text here.
The following statement can print text with double quotes:
"""
print('Xiao Ming said: "It wasn\'t me!"')
print("I'm a student.")
```

If a string contains both single and double quotes, you can wrap it in triple quotes. Otherwise, you must use backslash escape characters.

## String Operations

Common string operations include concatenation, indexing, and slicing.

### Concatenation

Concatenate two strings using the `+` operator:

```python
greeting = "Hello, " + "World!"  # Result: "Hello, World!"
```

Repeat a string multiple times using the `*` operator:

```python
repeated = "abc" * 3  # Result: "abcabcabc"
```

### Indexing

Use indexing to extract a single character from a string. Place square brackets containing an integer index immediately after the string or variable. In Python, indices start at `0`. Non-negative indices count from left to right, while negative indices count from right to left (starting at `-1` for the last character). Accessing an index beyond the string's length raises an `IndexError`:

```python
greeting = "Hello, World!"
print(greeting[0])        # Output: "H"
print(greeting[-1])       # Output: "!"
print(greeting[20])       # Program error

chinese = "I am learning Python"
print(chinese[1])        # Output: " "
```

Unlike some older languages, Python 3 strings are Unicode by default. This means non-ASCII characters (like Chinese, Japanese, or emoji symbols) occupy a single index unit. You do not have to worry about multi-byte indexing bugs or splitting characters in half.

Because strings are immutable, attempting to modify a character in place will result in a `TypeError`:

```python
greeting = "Hello, " + "World!"
greeting[0] = "W"         # Program error
```

### Slicing

While indexing retrieves a single character, **slicing** extracts a range of characters (a substring). Slicing uses square brackets with start and end indices separated by a colon (`[start:end]`). Note that Python slicing is **left-inclusive and right-exclusive**: the character at the `start` index is included, but the character at the `end` index is omitted.

Both indices are optional. Omitting the first index defaults to the beginning of the string, and omitting the second defaults to the end.

```python
greeting = "Hello, World!"
print(greeting[1:5])        # Output: "ello"
print(greeting[7:-1])       # Output: "World"
print(greeting[7:])         # Output: "World!"
print(greeting[:])          # Output: "Hello, World!"
```

Slicing also accepts an optional third parameter: the `step` size, which controls the stride of the slice.

```python
greeting = "Hello, World!"
print(greeting[0:5:2])      # Output: "Hlo" (within index range 0-5, take every 2nd character)
print(greeting[::-1])       # Output: "!dlroW ,olleH" (step of -1 means reverse order, this is the most common method to reverse a string)
```

### String Length

Get the length of a string using the built-in `len()` function:

```python
greeting = "Hello, World!"
length = len(greeting)    # Result: 13
```

## String Methods

In Python, everything is an object, meaning data types have built-in methods for performing operations. For example, integers have a `bit_length()` method that returns the number of bits required to represent that number. You can list all attributes and methods of an object using the built-in `dir()` function:

```python
print(dir(""))
```

Understanding Functions vs. Methods:
- **Function**: A standalone block of code that takes arguments, performs logic, and returns a value (e.g., `len(my_str)`).
- **Method**: A function bound to an object, invoked using dot notation (e.g., `my_str.upper()`).

While methods for integers may not be used as frequently, some string methods are very commonly used, such as:

* `str.upper()`: Converts all characters to uppercase.
* `str.lower()`: Converts all characters to lowercase.
* `str.startswith(prefix)`: Checks if the string starts with a specific prefix.
* `str.endswith(suffix)`: Checks if the string ends with a specific suffix.
* `str.find(sub)`: Returns the index of the first occurrence of a substring, or -1 if not found.
* `str.replace(old, new)`: Replaces all occurrences of an old substring with a new substring.
* `str.split(delimiter)`: Splits the string based on a specified delimiter.
* `str.join(iterable)`: Joins strings in an iterable using the string as a separator.

In practice, the key syntactic difference is that a function wraps the data (e.g., `func(data)`), while a method is appended to the data (e.g., `data.method()`).

Here are some examples of using string methods:

```python
greeting = "Hello, World!"

# Using str.upper() to convert all characters to uppercase
upper_string = greeting.upper()
print(upper_string)          # Output: "HELLO, WORLD!"

# Using str.lower() to convert all characters to lowercase
lower_string = greeting.lower()
print(lower_string)          # Output: "hello, world!"

# Using str.startswith() to check if the string starts with a specific prefix
prefix = "Hello"
is_start_with_prefix = greeting.startswith(prefix)
print(is_start_with_prefix)  # Output: True

# Using str.endswith() to check if the string ends with a specific suffix
suffix = "World!"
is_end_with_suffix = greeting.endswith(suffix)
print(is_end_with_suffix)    # Output: True

# Using str.find() to return the index of the first occurrence of a substring
sub_string = "World"
index = greeting.find(sub_string)
print(index)                 # Output: 7

# If the substring does not exist, it returns -1
sub_string = "Java"
index = greeting.find(sub_string)
print(index)                 # Output: -1

# Using str.replace() to replace all occurrences of an old substring with a new substring
replaced_string = greeting.replace("World", "Python")
print(replaced_string)       # Output: "Hello, Python!"

# Using str.split() to split the string based on a specified delimiter
delimiter = ", "  # Split using comma and space
split_strings = greeting.split(delimiter)
print(split_strings)         # Output: ['Hello', 'World!']

# Using str.join() to join strings in an iterable using the string as a separator
words = ["Hello", "Python"]
delimiter = ", "
joined_string = delimiter.join(words)
print(joined_string)         # Output: "Hello, Python"
```

## Escape Characters

Characters that are difficult to type or display (like newlines or tabs) are written using escape sequences. An escape sequence starts with a backslash (`\`) followed by a character that gives it a special meaning.

Here are the commonly used escape sequences in Python:

* `\\`: Represents a single backslash character `\`.
* `\'`: Represents a single quote character `'`.
* `\"`: Represents a double quote character `"`.
* `\n`: Represents a newline character.
* `\t`: Represents a tab character.

For example:

```python
print("Hello\nWorld!")               # Output: Hello
                                     # World!       (a newline occurs during output)
print("Hello\tWorld!")               # Output: Hello   World!
print("\\  is a backslash")                  # Output: \  is a backslash
```

To treat backslashes as literal characters instead of escape characters, prefix the string with `r` or `R` to create a **raw string**:

```python
print(r"Hello\nWorld")  # Output: Hello\nWorld
```

Raw strings are highly useful for Windows file paths (e.g., `r"C:\Users\name"`) and regular expressions.

## String Formatting

String formatting inserts dynamic values into a string template. Python offers several ways to do this. While legacy methods like the `%` operator and `str.format()` are still supported, modern Python relies on **f-strings** (formatted string literals) as the cleanest and most efficient approach.

To define an f-string, prefix a string literal with `f` or `F`. You can then embed variables or expressions directly inside curly braces `{}`. When Python executes the code, it evaluates the expressions and inserts the results in place:

```python
name = "Lao Wang"
age = 60
print(f"I am {name}, and I am {age} years old this year.")
# Output: I am Lao Wang, and I am 60 years old this year.
```

f-strings support arbitrary expressions and function calls inside the braces:

```python
name = "Lao Wang"
age = 60
print(f"I am {name}, and in five years I will be {age + 5} years old.")
# Output: I am Lao Wang, and in five years I will be 65 years old.
```

To convert any data type into a standard string representation, use the built-in `str()` function:

```python
print(str(123))         # Output: '123'
print(str(123.456))     # Output: '123.456'
print(str([1, 2, 3]))   # Output: '[1, 2, 3]'
print(str((1, 2, 3)))   # Output: '(1, 2, 3)'
print(str(True))        # Output: 'True'
```

#### Decimal Formatting Codes

You can control how floats and other values are displayed by adding a format specifier after a colon within the curly braces (`{value:format_specifier}`).

For example, to display a float with exactly two decimal places:

```python
number = 123.456
formatted_number = f"{number:.2f}"
print(formatted_number)  # Output: 123.46
```

Here, `.2f` tells Python to format the number as a float (`f`) with exactly two decimal places (`.2`), automatically rounding if necessary.

Other common formatting specifiers include padding, alignment, and percentages:

- Using percentage format:
  ```python
  percentage = 0.1234
  formatted_percentage = f"{percentage:.2%}"
  print(formatted_percentage)          # Output: 12.34%
  ```

- Specifying width and alignment, decimal representation:
  ```python
  number = 123.456
  formatted_number = f"{number:10.2f}"
  print(formatted_number)              # Output:     123.46
  ```
  Here `10.2f` means a total width of 10 characters, with two digits after the decimal point, right-aligned.

- Specifying width and alignment, scientific notation representation:
  ```python
  number = 123.456
  formatted_number = f"{number:10.2e}"  # Explicitly specify e for scientific notation
  print(formatted_number)               # Output:   1.2e+02
  ```
  Here `10.2` means a total width of 10 characters, `.2` means two digits after the decimal point.

## Byte Sequences

### Representation

A byte sequence (`bytes`) represents raw binary data. In Python code, a byte sequence literal is defined by prefixing a string with `b` or `B`:

```python
s = "Hello, World!"               # This is a string
print(s)

byte_sequence = b'Hello, World!'  # This is a byte sequence, not a string
print(byte_sequence)              # Output: b'Hello, World!'

# Sometimes byte sequences are represented in hexadecimal format
b = b'\x48\x65\x6c\x6c\x6f\x2c\x20\x57\x6f\x72\x6c\x64\x21'
print(b)        # Output: b'Hello, World!'
```

Note: When Python prints a `bytes` object, any byte corresponding to a printable ASCII character is displayed as that character (e.g., `\x48` displays as `H`). Non-printable bytes are displayed in hexadecimal format.

The key difference between strings and byte sequences is abstraction:
- **`str` (String)**: A sequence of Unicode characters representing human-readable text. Used for text processing, displays, and writing files.
- **`bytes` (Byte Sequence)**: A sequence of raw, 8-bit integers (values `0` to `255`). Used for binary files (images, audio, zip files), network sockets, and cryptography.

### Converting Between Strings and Bytes

To bridge the gap between human text (`str`) and binary data (`bytes`), you must perform encoding and decoding:
- `str.encode(encoding)`: Translates text into binary bytes.
- `bytes.decode(encoding)`: Translates binary bytes back into text.

Python uses **UTF-8** as its default encoding. To understand why encoding is necessary, let's look at its history:

Early computers primarily processed English. The first standard was **ASCII** (American Standard Code for Information Interchange), which mapped 128 characters (letters, numbers, and basic punctuation) to numbers `0` through `127`. As computers spread globally, other nations created custom extensions to support their own alphabets. In China, standards like **GBK** and **GB2312** were developed. However, because different countries mapped different characters to the same byte values, opening a file with the wrong encoding led to garbled text (known as *mojibake*).

To resolve this conflict, the industry introduced **Unicode**—a universal character set mapping every character in human writing to a unique number. Unicode can be serialized into bytes using various formats. Windows uses **UTF-16**, which represents characters with 16-bit units. However, the internet standard is **UTF-8**, a variable-width encoding that uses 1 to 4 bytes per character. UTF-8 is highly efficient, backward compatible with ASCII, and is Python's default encoding format.

In most cases, converting between strings and bytes using the default encoding is sufficient. However, it may sometimes be necessary to convert a string to other encoding formats to ensure it displays correctly on devices that do not use UTF-8 encoding. The following code demonstrates the differences between several encoding formats.

Different encodings for Chinese:

```python
chinese_str = "中文"

# UTF-8 is Python's default encoding format
print(chinese_str.encode('UTF-8'))     # Output: b'\xe4\xb8\xad\xe6\x96\x87'
# UTF-16LE is Windows' encoding format
print(chinese_str.encode('UTF-16LE'))  # Output: b'-N\x87e'
# GB2312 is the most common non-Unicode Chinese encoding format
print(chinese_str.encode('GB2312'))    # Output: b'\xd6\xd0\xce\xc4'
```

As you can see, different encodings convert the same Chinese characters into different binary data.

English can also use these encoding formats:

```python
english_str = "Hello"
print(english_str.encode('UTF-8'))     # Output: b'Hello'
print(english_str.encode('GB2312'))    # Output: b'Hello'
print(english_str.encode('ASCII'))     # Output: b'Hello'
print(english_str.encode('UTF-16LE'))  # Output: b'H\x00e\x00l\x00l\x00o\x00'
```

UTF-8 and GB2312 are compatible with the ASCII standard for encoding English characters; they convert English characters into the same binary data as the ASCII standard. However, the UTF-16LE encoding used by Windows is not compatible with the ASCII standard.

When decoding binary data back into a string, you must always use the same encoding format; otherwise, the result is likely not a correct string:

```python
chinese_str = "中文"
print(chinese_str.encode('UTF-8').decode('UTF-8'))        
print(chinese_str.encode('UTF-16LE').decode('UTF-16LE')) 
print(chinese_str.encode('GB2312').decode('GB2312'))

# The decodings above all correctly produce the string, but the following decoding will cause an error due to using the wrong encoding format
# print(chinese_str.encode('UTF-8').decode('GB2312'))

english_str = "Hello"
print(english_str.encode('UTF-8').decode('ASCII'))  # Output: Hello
# Although the line above uses different formats for encoding and decoding, the two formats are compatible for English characters, so the correct string is still obtained
```

## Exercises

Many string operation methods require the combination of statements like conditionals and loops. Only some of the most basic exercises are listed here. We will have more practice after learning the subsequent chapters.

1. Determine the output of the following program: `print(len("Hello\nWorld!"))`
2. Reverse a string: Input a string and output its reverse. For example, input "hello", output "olleh".
3. Palindrome check: Write a program to check if the input string is a palindrome (reads the same forwards and backwards).
4. Capitalize first letter: Write a program to capitalize the first letter of each word in a string.
5. Product of digits in an integer: Input a string representing an integer, write a program to calculate the product of all digits in that string.
6. Anagram check: Write a program that takes two strings as input and determines if they are anagrams (composed of the same characters in a different order).
7. Maximum length of identical consecutive characters: Input a string and count the maximum length of consecutive identical characters. For example, in the string aaabbbbaa, the maximum consecutive length is 4, with 4 consecutive b's.
