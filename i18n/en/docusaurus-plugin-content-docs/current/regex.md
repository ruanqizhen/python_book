# Regular Expressions

:::tip
Regular Expressions (commonly abbreviated as Regex or Regexp) are patterns used to match character combinations in strings. They are like the "Swiss Army knife" of text processing. In many high-level programming languages, regular expressions are used as an extremely important and powerful text processing tool. Although they may seem obscure and difficult at first, once you grasp their core principles, you can easily handle various complex text search, extraction, and replacement tasks.
:::

Python provides excellent support for regular expressions through its built-in `re` module. In this chapter, we will start from the basics, first learning the matching syntax of regular expressions, and then mastering the practical usage of Python's `re` module.

## Why Do We Need Regular Expressions?

Before learning regular expressions, let's first see what problems they can solve.

Suppose we have a piece of text and need to find all phone numbers from it. The phone numbers might be in formats like `010-12345678` or `021-87654321`, i.e., "3-digit area code - 8-digit number."

If we only used the string methods we've learned before, the code would be very verbose and fragile:
```python
text = "Please call: 010-12345678 or 021-87654321."

# Using only plain string methods, we would need to tediously slice, check lengths,
# check the position of "-", check whether each part is all digits, etc., and it would be very error-prone.
```
But with regular expressions, we only need to write a concise pattern: `r"\d{3}-\d{8}"`, and then call `re.findall()`!

## Basic Syntax of Regular Expressions

A regular expression consists of ordinary characters (such as letters `a` to `z`) and special characters (called "metacharacters"). Metacharacters give regular expressions their powerful pattern description capabilities.

Below are some of the most commonly used syntax rules in regular expressions:

### 1. Character Matching (Character Classes)

| Metacharacter | Description | Example and Explanation |
| :--- | :--- | :--- |
| `.` | Matches **any single character** except newline. | `p.t` can match `pat`, `pet`, `p-t`, `p9t`, etc. |
| `[abc]` | **Character set**: Matches any single character within the brackets. | `p[ae]t` matches only `pat` and `pet`. |
| `[^abc]` | **Negated character set**: Matches any single character NOT within the brackets. | `p[^ae]t` matches `pot`, but not `pat` or `pet`. |
| `[a-z]` | **Character range**: Matches any single character within the specified range. | `[0-9]` matches any digit, `[a-zA-Z]` matches any English letter. |

### 2. Predefined Character Sets (Shorthands)

For convenience, regular expressions provide shortcuts (escape sequences) for commonly used character sets:

| Shortcut | Equivalent Character Set | Description |
| :--- | :--- | :--- |
| `\d` | `[0-9]` | Matches any **digit** (d stands for decimal). |
| `\D` | `[^0-9]` | Matches any **non-digit**. |
| `\w` | `[a-zA-Z0-9_]` | Matches any **letter, digit, or underscore** (w stands for word). In Python 3, this also includes Chinese characters by default. |
| `\W` | `[^a-zA-Z0-9_]` | Matches any character that is **not a letter, digit, or underscore**. |
| `\s` | `[ \t\n\r\f\v]` | Matches any **whitespace character** (including spaces, tabs, newlines, etc.; s stands for space). |
| `\S` | `[^ \t\n\r\f\v]` | Matches any **non-whitespace character**. |

### 3. Position Anchors

Anchors do not match specific characters but rather **positions between characters** or **string boundaries**:

| Metacharacter | Description | Example |
| :--- | :--- | :--- |
| `^` | Matches the **start** of a string. If multiline mode is enabled, also matches the start of each line. | `^Hello` matches strings starting with "Hello". |
| `$` | Matches the **end** of a string. If multiline mode is enabled, also matches the end of each line. | `world$` matches strings ending with "world". |
| `\b` | Matches a **word boundary** (the position between a word character and a non-word character). | `\bcat\b` matches only the standalone word "cat", not "category" or "copycat". |

### 4. Quantifiers

Quantifiers specify the **number of times** the preceding character or character set should **repeat**:

| Metacharacter | Description | Example and Explanation |
| :--- | :--- | :--- |
| `*` | Repeat **0 or more times** (equivalent to `{0,}`). | `ab*` matches `a`, `ab`, `abb`, `abbb`, etc. |
| `+` | Repeat **1 or more times** (equivalent to `{1,}`). | `ab+` matches `ab`, `abb`, but not `a`. |
| `?` | Repeat **0 or 1 time** (i.e., the character is optional, equivalent to `{0,1}`). | `colors?` matches `color` or `colors`. |
| `{n}` | Repeat exactly **n times**. | `\d{6}` matches 6 consecutive digits (like a zip code). |
| `{n,}` | Repeat **at least n times**. | `\d{3,}` matches 3 or more consecutive digits. |
| `{n,m}` | Repeat **n to m times**. | `\d{3,5}` matches 3, 4, or 5 consecutive digits. |

> [!WARNING]
> **Greedy vs. Non-greedy**
>
> By default, all quantifiers are **greedy**, meaning they match as many characters as possible.
> For example, using the pattern `a.*b` to match the string `"a1b2b3b"` will match the entire `"a1b2b3b"` (up to the last `b`).
> To make it **non-greedy (lazy)** — matching as few characters as possible — simply add a question mark `?` after the quantifier.
> For example, using the pattern `a.*?b` to match the same string will only match up to the first `b`, i.e., `"a1b"`.

### 5. Grouping and Alternation

- **Grouping `(...)`**: Parentheses are used to combine multiple characters into a single unit, allowing quantifiers to apply to the whole group. Additionally, parentheses "capture" the matched substring for later extraction. For example, `(ab)+` can match `ab`, `abab`, `ababab`, etc.
- **Alternation `|`**: Acts as a logical OR, matching one of several alternative patterns. For example, `cat|dog` matches either `cat` or `dog`. It is often used with parentheses, such as `I like (apples|bananas).`

---

## Python's `re` Module in Practice

Now that we've mastered the basic syntax of regular expressions, let's see how to use them in Python code.

### The Salvation of Raw Strings

When writing regular expressions in Python, **it is strongly recommended to use raw strings (strings prefixed with `r`)**, for example `r"\d{3}-\d{8}"`.

Why is this? Because in ordinary strings, the backslash `\` has escape meaning (e.g., `\n` represents a newline, `\t` represents a tab). Without raw strings, to represent `\d` in a regex, you would have to write `"\\d"`; to match a literal backslash `\`, you would even need to write `"\\\\"` (the four-backslash nightmare!).

By using `r"..."`, Python passes the backslash unchanged to the regex engine, keeping the code much cleaner:
```python
# Recommended approach
pattern = r"\d+"
```

### 1. Finding the First Match: `re.search()` and `re.match()`

Both functions are used to find matches in a string, but they have a key difference:
- **`re.match()`**: **Must match from the beginning of the string (index 0)**. If the beginning doesn't match, it returns `None`.
- **`re.search()`**: Scans through the **entire string** to find the first match.

Both return a **Match object** when a match is found, and `None` when none is found.

```python
import re

text = "Python is 100% awesome, 99% useful!"

# match must match from the beginning
match_result = re.match(r"\d+", text)
print(f"re.match result: {match_result}")  # Output: None, because the string starts with "Python", not digits

# search looks for the first match in the entire string
search_result = re.search(r"\d+", text)
print(f"re.search result: {search_result}")  # Returns a Match object

if search_result:
    # Use the Match object's group() to get the matched text
    print(f"Matched content: {search_result.group()}")  # Output: 100
    # Get the start and end indices of the match in the original string
    print(f"Match position: {search_result.span()}")       # Output: (10, 13)
```

### 2. Finding All Matches: `re.findall()` and `re.finditer()`

- **`re.findall()`**: Finds **all** matches of the pattern in the string and returns them as a **list** of matched text.
- **`re.finditer()`**: Returns an **iterator** that produces a Match object on each iteration. When processing very long text, using `re.finditer` can save a lot of memory.

```python
import re

text = "Python is 100% awesome, 99% useful, and 0% boring!"

# findall returns a list of plain text
numbers = re.findall(r"\d+", text)
print(f"findall result: {numbers}")  # Output: ['100', '99', '0']

# finditer returns an iterator of Match objects, allowing access to each match's specific position
for m in re.finditer(r"\d+", text):
    print(f"Found number: {m.group()}, position: {m.span()}")
```

### 3. Powerful Text Replacement: `re.sub()`

`re.sub(pattern, repl, string)` replaces parts of the string that match the pattern with the specified text `repl`.

```python
import re

text = "My phone number is 138-1234-5678, his phone number is 139-8765-4321."

# Example 1: Replace hyphens in phone numbers with spaces
new_text = re.sub(r"-", " ", text)
print(new_text)  # Output: My phone number is 138 1234 5678, his phone number is 139 8765 4321.

# Example 2: Phone number masking (hide the middle four digits)
# We use parentheses to split the phone number into three groups: first 3 digits, middle 4 digits, last 4 digits
# \1, \2, \3 correspond to the captured content of the first, second, and third groups respectively. We replace the second group with ****
secure_text = re.sub(r"(\d{3})-(\d{4})-(\d{4})", r"\1-****-\3", text)
print(secure_text)  # Output: My phone number is 138-****-5678, his phone number is 139-****-4321.
```

> [!TIP]
> The replacement `repl` in `re.sub` can not only be a string, but also a **function**!
> This function receives a Match object as a parameter and must return a replacement string. This is extremely powerful for scenarios where the replacement text needs to be computed dynamically:
> ```python
> # Dynamic replacement: double all numbers in the text
> text = "Xiao Ming has 5 apples and 12 bananas."
> doubled_text = re.sub(r"\d+", lambda m: str(int(m.group()) * 2), text)
> print(doubled_text)  # Output: Xiao Ming has 10 apples and 24 bananas.
> ```

### 4. String Splitting: `re.split()`

Python's built-in `str.split()` can only split by a fixed single character or string, whereas `re.split()` can split strings based on complex regular expression patterns.

```python
import re

text = "apple,banana;orange   watermelon\tcantaloupe"

# Split by commas, semicolons, or any whitespace (including tabs)
fruits = re.split(r"[,;]|\s+", text)
print(fruits)  # Output: ['apple', 'banana', 'orange', 'watermelon', 'cantaloupe']
```

---

## Compiling Regular Expressions: `re.compile()`

In real-world development, if the same regular expression needs to be used thousands of times in a loop or program, frequently parsing the regex pattern can waste valuable CPU time.

In such cases, we can use `re.compile()` to **pre-compile** the regex pattern into a special `Pattern` object. The compiled object can directly call methods like `search`, `findall`, `sub`, etc., thereby optimizing runtime efficiency.

```python
import re

# Compile the regular expression
phone_pattern = re.compile(r"\b1[3-9]\d{9}\b")

# Call methods directly on the Pattern object, no need to pass the pattern argument again
text1 = "Contact: 13800138000"
text2 = "Customer service: 18911112222"

print(phone_pattern.search(text1).group())  # Output: 13800138000
print(phone_pattern.search(text2).group())  # Output: 18911112222
```

---

## In-Depth Look at Group Capture and Match Objects

When a regular expression contains parentheses `(...)`, they capture the corresponding subtext while performing the match. We can easily extract them using the Match object's specific methods:

- `group(0)` or `group()`: Returns the **entire** matched text.
- `group(n)`: Returns the text captured by the **n-th** parenthesized group (1-indexed).
- `groups()`: Returns the content captured by all parenthesized groups as a **tuple**.

```python
import re

email = "user.name@example.com"
# Group 1: Username (\w+\.?\w+)
# Group 2: Domain (\w+\.\w+)
pattern = r"^([\w\.]+)@([\w\.]+)$"

match = re.match(pattern, email)
if match:
    print(f"Full email: {match.group(0)}")   # Output: user.name@example.com
    print(f"Username:   {match.group(1)}")   # Output: user.name
    print(f"Domain:     {match.group(2)}")   # Output: example.com
    print(f"All groups: {match.groups()}")    # Output: ('user.name', 'example.com')
```

> [!NOTE]
> **Non-capturing Groups `(?:...)`**
>
> Sometimes, we use parentheses only to group certain characters together for applying a quantifier (e.g., `(?:abc)+` means abc repeated), without needing to capture, extract, or have it returned in `groups()`.
> In such cases, simply add `?:` right after the opening parenthesis to define a **non-capturing group**. This is useful for optimizing performance and managing group indices cleanly.

---

## Regular Expression Flags

Python's `re` module allows passing optional "flag arguments" to adjust matching behavior. Multiple flags can be combined using the bitwise OR operator `|`:

| Flag Name | Short Form | Description |
| :--- | :--- | :--- |
| `re.IGNORECASE` | `re.I` | Perform **case-insensitive** matching. |
| `re.MULTILINE` | `re.M` | **Multiline mode**. Causes `^` to match the start of the string and the start of each line, and `$` to match the end of the string and the end of each line. |
| `re.DOTALL` | `re.S` | **Dot-all mode**. Causes the `.` metacharacter to match any character, including the newline character `\n`. |

```python
import re

# 1. Ignore case
text = "Python python PYTHON"
print(re.findall(r"python", text, re.IGNORECASE))  # Output: ['Python', 'python', 'PYTHON']

# 2. Dot-all mode (DOTALL)
html = "<div>first line\nsecond line</div>"
# By default, . cannot span newlines, so matching fails
print(re.search(r"<div>.*</div>", html))  # Output: None
# With re.S, . can match newlines
print(re.search(r"<div>.*</div>", html, re.S).group())  
# Output: <div>first line\nsecond line</div>
```

---

## Practice Exercises

By writing and testing regular expressions yourself, your understanding will deepen. Try completing the following exercises:

1. **Basic Validation**: Write a regular expression to determine whether an input string is a valid Chinese postal code (6 digits, with the first digit not being 0).
2. **Extract Information**: Given a piece of text containing HTML tags, write a program to extract all the link URLs (i.e., the URL inside `href="..."`).
   For example, extract `https://google.com` from `<a href="https://google.com">Google</a>`.
3. **Text Masking**: Write a program using `re.sub` to replace the middle 8 digits (representing the date of birth) of all ID card numbers (18 digits, or 17 digits followed by X/x) that appear in the text with `********`.
4. **Log Parsing**: Suppose there is a line of web server log:
   `192.168.1.100 - - [28/May/2026:12:34:56 +0800] "GET /index.html HTTP/1.1" 200 4523`
   Write a regular expression and code to extract from it: the IP address, request time, request method (e.g., GET/POST), request path (e.g., /index.html), and HTTP status code (e.g., 200).
5. **Word Frequency Statistics**: Write a program that uses `re.split` to split all the words in an English article (excluding commas, periods, exclamation marks, double quotes, and spaces) and then find the top 3 most frequently occurring words.
