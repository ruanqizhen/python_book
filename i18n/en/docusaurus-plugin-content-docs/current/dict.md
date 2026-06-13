# Dictionaries and Sets

## Creating a Dictionary

The dictionary (`dict`) is one of Python's most powerful built-in data types. In other languages, similar associative structures are known as maps, hash tables, or associative arrays.

### Using Curly Braces

A dictionary stores collections of key-value pairs. In a dictionary literal, the entire structure is enclosed in curly braces `{ }`, elements are separated by commas, and keys are separated from their corresponding values by a colon (`:`). To define a dictionary, write:

```python
# Create an empty dictionary
empty_dict = {}

# Create a dictionary with content
person = {
    "Name": "Du Ziteng",
    "Age": 30,
    "City": "Pythora"
}
```

Points to note:
* Dictionary keys must be of an **immutable** (and hashable) type, such as integers, floats, strings, or tuples. Lists and dictionaries cannot be keys. This constraint ensures keys cannot be modified in place, which would break the dictionary's lookup integrity.
* Keys are unique: adding a duplicate key overwrites its existing value.
* Values can be of any data type, including lists, tuples, or other dictionaries.

### The dict() Function

The `dict()` function can be used to create a dictionary from other data structures.

You can create a dictionary by passing key-value pairs as keyword arguments to the `dict()` constructor:

```python
# Using keyword arguments
my_dict = dict(Name="Cai Taixian", Age=25, City="Shanghai")
```

Alternatively, you can pass a sequence of two-item collections (like a list of tuples) to `dict()`:

```python
# Using a list of (key, value) tuples
pairs = [("Name", "Ma Tonggai"), ("Age", 25), ("City", "Shanghai")]
my_dict = dict(pairs)
```

If you have two separate lists—one containing keys and the other containing values—you can pair them together using the `zip()` function before passing them to `dict()`:

```python
keys = ["Name", "Age", "City"]
values = ["Mei Liangxin", 25, "Shanghai"]
my_dict = dict(zip(keys, values))
```

### Dictionary Comprehension

[Dictionary comprehension](comprehension#dictionary-comprehensions) is also a commonly used method for creating dictionaries, but it is slightly more complex. We will introduce it after covering some other foundational knowledge.

## Common Dictionary Operations

### Checking if a Key Exists

To check if a key exists in a dictionary, use the `in` operator (similar to list membership tests), which returns a boolean:

```python
person = {
    "Name": "Tang Hulu",
    "Age": 43,
    "City": "Shanghai"
}

if "Name" in person:
    print('The key "Name" exists in the dictionary.')
```

Under the hood, checking for key membership in a dictionary is extremely fast and far more efficient than searching a list.

### Accessing Values

Retrieve a value by placing its key inside square brackets, similar to list indexing:

```python
person = {
    "Name": "Ruan Qizhen",
    "Age": 30,
    "City": "Shanghai"
}

print(person["Name"])  # Output: Ruan Qizhen
```

If you request a key that does not exist, Python raises a `KeyError`. (We cover exceptions and how to catch them in the [Exception Handling](exception) chapter.)

To avoid crashes, you can check key membership first, but a cleaner way is to use the `get()` method. If the key is not found, `get()` returns `None` instead of throwing an error. You can also specify a custom fallback value:

```python
person = {
    "Name": "Shi Zhenxiang",
    "Age": 20,
    "City": "Beijing"
}

# Using the get method; returns None if the key does not exist
gender = person.get('gender')
print(gender)  # Output: None

# Using the get method with a specified default value
gender = person.get('gender', 'Not Specified')
print(gender)  # Output: Not Specified
```

Accessing values by key is extremely fast because Python dictionaries are implemented using hash tables. We explore these optimizations in the [Data Structures and Algorithms](algorithm) chapter. For now, remember that finding a value via its key is a constant-time operation. Conversely, searching for a key by its value is very slow, as it requires scanning the entire dictionary.

If you need rapid bidirectional lookups between two unique datasets, create two separate dictionaries: one for forward lookup (e.g., mapping ID to Name) and one for reverse lookup (mapping Name to ID).

Because Python is dynamically typed, a single dictionary can mix keys of different types. Note that if two keys evaluate to equal values (like `1` and `1.0`), Python treats them as the same key.

Warning: Never use floats as dictionary keys. Because floating-point math suffers from precision limits (e.g., `0.1 + 0.2` does not equal `0.3`), looking up keys mathematically can fail unexpectedly:

```python
dic = {}
dic[0.3] = 'a'
dic[0.1+0.2] = 'b'
print(dic[0.3])      # Output: a
print(dic[0.1+0.2])  # Output: b    Due to floating-point precision, 0.1+0.2 is not equal to 0.3

dic[1.0] = 'c'
print(dic[1])        # Output: c    1.0 and 1 are the same key
```

### Adding or Modifying Key-Value Pairs

To add a new key-value pair or modify an existing one, assign a value to a key using square brackets:

```python
person = {
    "Name": "Zhu Dachang",
    "Age": 30,
    "City": "Shanghai"
}

# Update age
person["Age"] = 35
# Add occupation
person["Occupation"] = "Engineer"

print(person)
# Output: {'Name': 'Zhu Dachang', 'Age': 35, 'City': 'Shanghai', 'Occupation': 'Engineer'}
```

If the key is not in the dictionary, Python inserts it. If it is already present, Python overwrites the old value.

To assign a value only if a key is missing (preserving the value if the key is already present), use the `setdefault()` method. `setdefault()` searches for the key: if found, it returns its value; if not, it inserts the key with the specified default and returns that default:

```python
person = {
    "Name": "Xiong Chumo",
    "Age": 30,
    "City": "Shanghai"
}

# Using setdefault to set a default value for a non-existent key; here "Salary" does not exist
salary = person.setdefault('Salary', 50000)
print(salary)  # Output: 50000

# Using setdefault to get an existing value; here "City" already exists
city = person.setdefault('City', 'Magic City')
print(city)  # Output: Shanghai

print(person)
# Output: {'Name': 'Xiong Chumo', 'Age': 30, 'City': 'Shanghai', 'Salary': 50000}
```

A classic use case for `setdefault()` is counting item occurrences:

```python
counts = {}
words = ['Apple', 'Banana', 'Apple', 'Orange', 'Banana', 'Apple']

for word in words:
    counts.setdefault(word, 0)
    counts[word] += 1

print(counts)  # Output: {'Apple': 3, 'Banana': 2, 'Orange': 1}
```

Here, `setdefault(word, 0)` initializes the count of a new word to `0` so we can safely increment it in the next line.

If you are storing simple counts or accumulators, you can also use `get()` to set a default value on the fly, which is often cleaner:

```python
counts = {}
words = ['Apple', 'Banana', 'Apple', 'Orange', 'Banana', 'Apple']

for word in words:
    counts[word] = counts.get(word, 0) + 1

print(counts)  # Output: {'Apple': 3, 'Banana': 2, 'Orange': 1}
```

We will cover default values extensively in the [Counting](counter) section.

What does the following statement produce?

```python
x, y = x[y] = {}, "a"
print(x)
```

### Deleting Key-Value Pairs

Delete a key-value pair from a dictionary using the `del` statement:

```python
person = {
    "Name": "Hao Xiaren",
    "Age": 50,
    "City": "Pythora"
}

del person["Age"]

print(person)  # Output: {'Name': 'Hao Xiaren', 'City': 'Pythora'}
```

### Getting All Keys and Values

To retrieve dictionary contents, use:
- `keys()`: returns a view of all keys.
- `values()`: returns a view of all values.
- `items()`: returns a view of all key-value pairs as tuples.

These return **view objects**, meaning they are dynamic and automatically reflect any updates or deletions made to the dictionary in real time:

```python
person = {
    "Name": "Yang Yiqun",
    "Age": 30,
    "City": "Shanghai"
}

keys = person.keys()
print(keys)             # Output: dict_keys(['Name', 'Age', 'City'])
print(person.values())  # Output: dict_values(['Yang Yiqun', 30, 'Shanghai'])
print(person.items())   # Output: dict_items([('Name', 'Yang Yiqun'), ('Age', 30), ('City', 'Shanghai')])

del person["Age"]       # Delete a key-value pair from the dictionary; all dictionary views will reflect the change
print(keys)             # Output: dict_keys(['Name', 'City'])
```

Views are extremely useful for loops. To iterate only over values:

```python
person = {
    "Name": "Bao Shengong",
    "Age": 30,
    "City": "Shanghai"
}

for value in person.values():
    print(value)
    
# Output: Bao Shengong  30  Shanghai
```

To traverse keys and values together, iterate over `items()`:

```python
person = {
    "Name": "Zheng Zhifan",
    "Age": 30,
    "City": "Shanghai"
}

for key, value in person.items():
    print(key, value)

# Output:
# Name Zheng Zhifan
# Age 30
# City Shanghai
```

Warning: Never add or remove keys while iterating over a dictionary. Doing so raises a `RuntimeError`. If you need to modify keys during a loop, iterate over a static list copy of the keys instead: `for key in list(my_dict.keys()):`.

### Unpacking

Like lists, dictionaries can be unpacked. The double asterisk (`**`) unpacks dictionary items as keyword arguments. Assuming `my_dict = {'a': 1, 'b': 2}`, the unpacking operation `**my_dict` yields `a=1, b=2`.

Unpacking can conveniently merge two dictionaries:

```python
dict1 = {'a': 1, 'b': 2}
dict2 = {'c': 3, 'd': 4}

merged_dict = {**dict1, **dict2}
print(merged_dict)  # Output: {'a': 1, 'b': 2, 'c': 3, 'd': 4}
```

We discuss dictionary unpacking extensively in the [Functions](function#variable-length-arguments) chapter.

## Common Dictionary Methods

Other common dictionary methods include:

- `update(another_dict)`: Merges key-value pairs from another dictionary, overwriting existing keys.
- `pop(key)`: Removes and returns the value of the specified key.
- `clear()`: Clears all items.
- `fromkeys(seq, value)`: Creates a dictionary using keys from a sequence, initialized to a shared default value.

For example:

```python
# Create an initial dictionary
my_dict = {'a': 1, 'b': 2, 'c': 3}

# Using the update method
another_dict = {'e': 5, 'f': 6}
my_dict.update(another_dict)
print(my_dict)                # Output: {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6}

# Using the pop method
value = my_dict.pop('f')
print(value)                  # Output: 6
print(my_dict)                # Output: {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5}

# Using the clear method
my_dict.clear()
print(my_dict)                # Output: {}

# Using the fromkeys method
keys = ['a', 'b', 'c']
new_dict = dict.fromkeys(keys, 0)
print(new_dict) # {'a': 0, 'b': 0, 'c': 0}
```

## Comparison of the Four Core Containers

Python provides four core data containers: Lists, Tuples, Dictionaries, and Sets. Understanding their characteristics will help you select the right tool for the job.

### Characteristics Comparison Table

| Container Type | Declaration Syntax | Ordered | Mutable | Duplicate Elements | Lookup/Retrieval Time Complexity | Typical Use Cases |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **List** | `[a, b, c]` | **Yes** | **Yes** | Allowed | $O(n)$ | Sequential data storage, frequent additions/deletions, dynamic queues |
| **Tuple** | `(a, b, c)` | **Yes** | **No** | Allowed | $O(n)$ | Structured records, multiple return values from functions, dictionary keys |
| **Dict** | `{k: v}` | **Yes** *(3.7+)* | **Yes** | Keys unique, values can repeat | **$O(1)$** | Fast key-value retrieval, JSON data parsing |
| **Set** | `{a, b, c}` | **No** | **Yes** | Elements unique | **$O(1)$** | Fast deduplication, mathematical set operations (intersection, union, difference) |

### Key Points Explained

*   **Ordering**:
    *   **Lists** and **Tuples** are inherently ordered and can be accessed precisely by index (e.g., `arr[0]`).
    *   **Sets** are completely unordered and cannot be accessed by index.
    *   **Dictionaries** (from Python 3.7 onwards) have an underlying implementation that guarantees the iteration order matches the insertion order. However, they are still accessed by key rather than by integer index.
*   **Mutability**:
    *   **Lists**, **Dictionaries**, and **Sets** are mutable; elements can be added, modified, or deleted at any time.
    *   **Tuples** are absolutely immutable once created. Immutability makes tuples safer, faster to access, and allows them to be used as dictionary keys or set elements (because they are "hashable").
*   **Search Performance**:
    *   Finding an element in a **List** or **Tuple** (e.g., `x in arr`) requires traversing from start to end, resulting in linear time complexity **$O(n)$**. If the data volume reaches millions, the speed will significantly degrade.
    *   **Dictionaries** and **Sets** are implemented based on a **Hash Table**. Looking up a key or element (e.g., `key in dict` or `x in set`) only requires one hash calculation for positioning, giving constant time complexity **$O(1)$**. Their lookup speed is almost unaffected by the data size. Therefore, for scenarios requiring frequent lookups, dictionaries or sets should be the preferred choice.

## Sets

A set (`set`) is an unordered collection of unique elements, matching the mathematical concept of a set. It supports operations like union, intersection, and difference. Under the hood, sets are implemented similarly to dictionaries but only contain keys.
Each element in a set must be unique and **hashable** (immutable). Unlike mathematical sets, programming sets are mutable—you can add or remove elements after creation.

Note: If a tuple contains mutable objects (such as `(1, [2, 3])`), the tuple becomes unhashable and cannot be placed inside a set.

### Creating a Set

You can create a set using curly braces or the `set()` constructor:

```python
my_set = {1, 2, 3, 4}
print(my_set)  # Output: {1, 2, 3, 4}

my_list = [1, 2, 2, 3, 4, 4, 5]
my_set = set(my_list)
print(my_set)  # Output: {1, 2, 3, 4, 5}

# Create an empty set
empty_set = set()
```

Because elements must be unique, any duplicates are silently discarded. Remember: you cannot create an empty set using `{}` (which defines an empty dictionary). Use `set()` instead.

### Common Operations

Sets share dictionary lookup speeds. Common set operations include:

* Adding elements: Use the `add()` method.

```python
# Create an empty set
s = set()

# Using the add() method to add elements
s.add("Apple")
s.add("Banana")
s.add("Orange")

# Sets are unordered; print will show all elements, but the order is not guaranteed
print(s)  # Output: {'Apple', 'Banana', 'Orange'}
```

* Membership testing: Use the `in` keyword to check if an element exists in a set.

```python
s = set(['Apple', 'Banana', 'Orange'])

# Using the in keyword to check if an element exists in the set
if "Orange" in s:
    print("The set contains Orange") 
    
if "Orange" not in s:
    print("The set does not contain Orange") 
```

* Removing elements: `remove(x)` deletes `x` and raises a `KeyError` if it is not found. `discard(x)` deletes `x` but does not throw an error if the element is missing:

```python
s = set(['Apple', 'Banana', 'Orange'])

# Using the remove() method to delete an existing element
s.remove("Banana")
print(s)  # Output: {'Apple', 'Orange'}

# Attempting to use remove() on a non-existent element raises a KeyError
# To avoid this error, first check if the element exists
if "Banana" in s:
    s.remove("Banana")

# Using discard() to remove an element; no error is raised even if the element does not exist
s.discard("Banana")    # Since "Banana" has already been removed, this line has no effect
s.discard("Apple")
print(s)  # Output: {'Orange'}
```

* Length: Use the `len()` function to get the size of a set, i.e., the number of elements.

```python
s = set(['Apple', 'Banana', 'Orange'])

# Using len() to get the size of the set
print(len(s))  # Output: 3
```

### Mathematical Set Operations

Sets are often used for their mathematical operations, including:

* **Union**: The set containing all elements from both sets, using the `union()` method or the `|` operator.
* **Intersection**: The set of elements that belong to both sets, using the `intersection()` method or the `&` operator.
* **Difference**: The set of elements that belong to the first set but not the second, using the `difference()` method or the `-` operator.
* **Symmetric Difference**: The set of elements that are in either the first or second set, but not in both, using the `symmetric_difference()` method or the `^` operator.
* **Subset**: Checks whether all elements of the first set are also in the second set, using the `issubset()` method.
* **Superset**: Checks whether the first set contains all elements of the second set, using the `issuperset()` method.

Operation examples:

```python
# Define two sets
A = {1, 2, 3, 4}
B = {3, 4, 5, 6}

# Union
print(A.union(B))           # Output: {1, 2, 3, 4, 5, 6}
print(A | B)                # Output: {1, 2, 3, 4, 5, 6}

# Intersection
print(A.intersection(B))    # Output: {3, 4}
print(A & B)                # Output: {3, 4}

# Difference
print(A.difference(B))      # Output: {1, 2}
print(A - B)                # Output: {1, 2}

# Symmetric Difference
print(A.symmetric_difference(B))  # Output: {1, 2, 5, 6}
print(A ^ B)                # Output: {1, 2, 5, 6}

# Subset
print(A.issubset(B))        # Output: False

# Superset
print(A.issuperset(B))      # Output: False
```

Here is a more practical example. Suppose we have two lists, one of friends and one of colleagues. We need to find people who are both friends and colleagues:

```python
# Friend list
friends = ["Zhang San", "Li Si", "Wang Wu", "Zhao Liu"]

# Colleague list
colleagues = ["Sun Qi", "Zhou Ba", "Zhang San", "Li Si"]

# Using sets to find people who are both friends and colleagues
friends_set = set(friends)
colleagues_set = set(colleagues)
common = friends_set.intersection(colleagues_set)

print("People who are both friends and colleagues:", common)
```

## Exercises

1. **Remove duplicates from a list**: Write a program that removes duplicate elements from a list and returns a list containing only unique elements.
2. **Find the maximum value in a dictionary**: Use a loop structure to find the maximum numerical value in a dictionary and return its corresponding key.
3. **Calculate the sum of all values in a dictionary**
4. **Print all subsets of a set**: For example, all subsets of the set `{1, 2}` are: the empty set `set()`, `{1}`, `{2}`, `{1, 2}`.
5. **Count word frequency**: Write a program that takes an English text as input and counts the number of occurrences of each word.
