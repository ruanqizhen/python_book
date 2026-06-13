# Strings

:::tip
String and [list](list) operations often involve structures like [loops](loop) and [conditionals](condition). Although this book introduces various methods for manipulating strings and lists upfront for focused coverage, for beginners, a better approach might be to first get a general idea of what strings and lists look like as data types. Once you have learned about loop structures, you can come back to study the more complex operations on these two data types, which will be easier to understand.
:::

A string in Python is an ordered collection of a sequence of characters, which can include letters, numbers, punctuation marks, and other special characters. A string is an immutable sequence data type.

## Creating Strings

In Python, shorter strings can be represented using single quotes `' '` or double quotes `" "`. Long strings that span multiple lines can be represented using triple quotes `''' '''` or `""" """`. For example:

```python
string1 = 'Hello, World!'
string2 = "Hello, World!"
string3 = '''Hello
World!'''                  # This is a multi-line string
string4 = """Another
multi-line
string."""
```

Large blocks of text enclosed in triple quotes are also often used as program comments, so you don't need to add a hash symbol before each line of the comment, similar to the `/*  */` comment syntax in languages like C and Java.

A useful tip is that if the string you need to create contains double quotes, then wrap it with single quotes; conversely, if the string you need to create contains single quotes, then wrap it with double quotes. For example:

```python
"""
This is a comment, the program logic will not use the text here.
The following statement can print text with double quotes:
"""
print('Xiao Ming said: "It wasn\'t me!"')
print("I'm a student.")
```

If the string you need to create requires both single and double quotes, you can use triple quotes. If all of these are needed, you'll have to use escape characters.

## String Operations

The most common string operations include concatenation, slicing, etc.

### Concatenation

You can use the `+` operator to concatenate two strings:

```python
greeting = "Hello, " + "World!"  # Result: "Hello, World!"
```

If you want to repeat a piece of text, you can use the `*` operator:

```python
repeated = "abc" * 3  # Result: "abcabcabc"
```

### Indexing

Indexing is used to extract a single character from a string. It is expressed by placing square brackets after the string or variable being indexed, containing an integer that indicates the position of the character in the string (counting from 0). Non-negative integers count from left to right, with the index of the leftmost character being 0; negative numbers count from right to left, with the index of the rightmost character being -1. If the index exceeds the range of the string, the program will raise an error. For example:

```python
greeting = "Hello, World!"
print(greeting[0])        # Output: "H"
print(greeting[-1])       # Output: "!"
print(greeting[20])       # Program error

chinese = "I am learning Python"
print(chinese[1])        # Output: " "
```

One thing Python 3 does better than many other languages is that its strings use Unicode encoding by default. This means that each Chinese character in a string is also a single character, occupying one index unit. This way, you don't have to worry about using different indexing mechanisms when dealing with different languages, avoiding the situation of accidentally indexing half of a Chinese character's data like in C.

Because a string is an immutable sequence data type, trying to change a character in a string will cause the program to error. For example, running the following program:

```python
greeting = "Hello, " + "World!"
greeting[0] = "W"         # Program error
```

### Slicing

Indexing only retrieves a single character. We can also extract a substring from a string, an operation called slicing. Slicing uses square brackets and a colon to obtain a substring of a string. You can specify two numbers on either side of the colon within the brackets: the first number is the starting position of the substring, and the second number is the ending position. However, it is important to note that these two positions follow a "left-inclusive, right-exclusive" rule (i.e., it includes the starting position but excludes the ending position), only capturing characters up to the one before the ending position.

The two numbers used in slicing can be omitted: if you omit the left number, it means starting from the very left end; if you omit the right number, it means slicing through to the very right end.

```python
greeting = "Hello, World!"
print(greeting[1:5])        # Output: "ello"
print(greeting[7:-1])       # Output: "World"
print(greeting[7:])         # Output: "World!"
print(greeting[:])          # Output: "Hello, World!"
```

Slicing can also accept a third parameter, called step, which specifies taking every Nth character.

```Python
greeting = "Hello, World!"
print(greeting[0:5:2])      # Output: "Hlo" (within index range 0-5, take every 2nd character)
print(greeting[::-1])       # Output: "!dlroW ,olleH" (step of -1 means reverse order, this is the most common method to reverse a string)
```

### String Length

You can use the `len()` function to get the length of a string. For example:

```python
greeting = "Hello, World!"
length = len(greeting)    # Result: 13
```

## String Methods

Various data types in Python are objects themselves and therefore have a set of methods for operations. For example, using the `bit_length()` method of an integer returns the number of bits required to represent the integer in binary. In Python, you can use the built-in `dir()` function to list all attributes and methods of an object:

```python
print(dir(""))
```

Comparison of functions and methods:
- **Function:** An independent block of code that can receive input parameters, perform specific operations, and return a value.
- **Method:** A function attached to a class or an object. In object-oriented programming, methods are typically used to operate on or interact with an object's internal data. A method is just another term for a function in a specific context.

While methods for integers may not be used as frequently, some string methods are very commonly used, such as:

* str.upper(): Converts all characters to uppercase.
* str.lower(): Converts all characters to lowercase.
* str.startswith(prefix): Checks if the string starts with a specific prefix.
* str.endswith(suffix): Checks if the string ends with a specific suffix.
* str.find(sub): Returns the index of the first occurrence of a substring, or -1 if not found.
* str.replace(old, new): Replaces all occurrences of an old substring with a new substring.
* str.split(delimiter): Splits the string based on a specified delimiter.
* str.join(iterable): Joins strings in an iterable using the string as a separator.

In terms of usage, the main difference between an object's method and a regular function is: when a function operates on data, the data is passed as an argument to the function, e.g., `len(greeting)`. While a method is also a function, when calling it, you first write the data object (or variable), followed by a dot `.`, and then the method name, e.g., `greeting.upper()`.

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

Some special characters cannot be directly typed on a keyboard or displayed on a screen. For these special characters, Python represents them through "escaping". An escape is a character sequence starting with a backslash `\`, representing a specific character or sequence of characters.

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

If you don't want the backslash to act as an escape, you can use a raw string. Add `r` or `R` before the string to make it a raw string, so that `\` within the string will not be escaped.

For example:

```python
print(r"Hello\nWorld")  # Output: Hello\nWorld
```

This is particularly useful when representing file paths, for example `r"C:\path\to\directory"`, so you don't need to escape every backslash.

## String Formatting

String formatting is the process of inserting specific values into certain positions of a string. Python provides several ways to format strings. Early Python used the `%` operator for formatting, and later the more powerful `str.format()` method appeared. Although both are still valid in modern Python code and `str.format()` is still necessary in certain scenarios (such as when template strings are stored in external files), for everyday coding, the most recommended and efficient method in Python is using f-strings.

f-strings use the prefix `f` to define a string, and then directly include Python expressions inside curly braces `{}` within the string. When displaying the string, Python evaluates the expression inside the curly braces `{}` and displays its value as part of the string. For example, embedding variable values into a string:

```python
name = "Lao Wang"
age = 60
print(f"I am {name}, and I am {age} years old this year.")
# Output: I am Lao Wang, and I am 60 years old this year.
```

f-strings allow simple expressions, and even function calls:

```python
name = "Lao Wang"
age = 60
print(f"I am {name}, and in five years I will be {age + 5} years old.")
# Output: I am Lao Wang, and in five years I will be 65 years old.
```

If you only need to convert a single value of another data type into a string, you can also use the `str()` function instead of an f-string, for example:

```python
print(str(123))         # Output: '123'
print(str(123.456))     # Output: '123.456'
print(str([1, 2, 3]))   # Output: '[1, 2, 3]'
print(str((1, 2, 3)))   # Output: '(1, 2, 3)'
print(str(True))        # Output: 'True'
```

#### Decimal Formatting Codes

To format decimals, you can add format specifiers inside the curly braces to control how the decimal is displayed. Format specifiers typically follow the pattern `{variable_name:format_code}`.

For example, if you want to format a floating-point number and have it display with two decimal places, you can do this:

```python
number = 123.456
formatted_number = f"{number:.2f}"
print(formatted_number)  # Output: 123.46
```

In this example, `.2f` is a format specifier that indicates formatting the number as a float with two decimal places. `.2` specifies the number of digits after the decimal point, and `f` indicates the float format.

Besides controlling the number of decimal places, f-strings also allow various other types of formatting, such as padding, alignment, percentage format, etc. For example:

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

The byte sequence type (bytes, sometimes simply referred to as "bytes") looks very similar to a string. In code, it is represented by adding the letter `b` prefix before a string literal.

```python
s = "Hello, World!"               # This is a string
print(s)

byte_sequence = b'Hello, World!'  # This is a byte sequence, not a string
print(byte_sequence)              # Output: b'Hello, World!'

# Sometimes byte sequences are represented in hexadecimal format
b = b'\x48\x65\x6c\x6c\x6f\x2c\x20\x57\x6f\x72\x6c\x64\x21'
print(b)        # Output: b'Hello, World!'
```

Note: Although we defined variable `b` using hexadecimal `\x48` etc., when Python prints a byte sequence, if the byte corresponds to an ASCII printable character (such as letters, numbers), it will automatically display as the corresponding character (e.g., H). Only bytes that cannot be displayed will remain in hexadecimal form.

The main differences between byte sequences and strings lie in the content they store and their application scenarios.

A string is a sequence of characters, typically used to store text information. In Python 3, strings consist of Unicode characters and can represent characters from almost all languages. Strings are mainly used for reading or writing text files, processing text input from forms, displaying text on screen, etc.

The data stored in a byte sequence can be any binary data, not just text. As the name suggests, a byte sequence is a sequence of bytes. A byte is an 8-bit binary number that can represent values from 0 to 255. Byte sequences are typically used for reading or writing binary files (such as image or video files), network socket communication, data encryption and decryption, etc.

### Converting Between Strings and Bytes

Sometimes we need to convert text data read from a network or other devices, stored in byte form, into a string, or we need to send a string in binary form. In such cases, you can use the string's `encode()` method and the byte sequence's `decode()` method to convert between strings and bytes. The text encoding must be specified during conversion. Using different encodings, the same text will be converted into different binary data. Python uses UTF-8 by default to encode strings. Before that, let's briefly understand the history of character encoding development:

Computers were invented in the United States, so it was natural at the time to only consider processing English. The earliest and most famous character encoding standard is the ASCII standard (American Standard Code for Information Interchange). It defines 128 characters, including uppercase and lowercase English letters, numbers, common punctuation, and some special symbols. At that time, most computers worldwide used the ASCII scheme to store English text. The biggest problem with this scheme is that it only supports English characters. Therefore, other countries, organizations, and companies began to extend this standard to support other characters, such as Chinese, Japanese characters, tabulation symbols, and mathematical symbols. In China, the most commonly used standards, including GB2312, GBK, GB18030, etc., are all Chinese extensions of ASCII. These extended standards have a very troublesome problem: the same numerical value has different meanings under different encoding standards. For example, a certain numerical value might be a Chinese character under the Chinese standard, but it might be a completely unrelated tabulation symbol under the Korean standard. This leads to garbled text when software developed in a Chinese environment runs on a Korean system. If someone needs to run both a Chinese software and a Korean software on the same system, only one software can display text correctly.

To solve this problem, starting in the 1990s, the computer industry began to develop a new encoding standard that could cover all the world's characters. That is, every character has its own unique encoding, and it will maintain this encoding under any system, so that the problem of garbled text when switching systems would not occur. This is the Unicode encoding, also known as the Universal Code, Single Code. Unicode specifies a character set, but this character set also has several different encoding formats. Windows uses the UTF-16LE format of Unicode encoding (UTF stands for Unicode Transformation Format), using 16-bit (double-byte) data to represent a character. However, the currently most popular Unicode encoding format is UTF-8, which is a variable-length encoding method. Depending on the frequency of use of a character, different encoding lengths are used to represent that character, with encoding lengths possibly ranging from 1 to 6 bytes. Currently, most Unicode documents use UTF-8 encoding, which is also the default encoding format for characters in Python.

In most cases, converting between strings and bytes using the default encoding is sufficient. However, it may sometimes be necessary to convert a string to other encoding formats to ensure it displays correctly on devices that do not use UTF-8 encoding. The following code demonstrates the differences between several encoding formats.

Different encodings for Chinese:

```python
chinese_str = "Chinese"

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
chinese_str = "Chinese"
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
