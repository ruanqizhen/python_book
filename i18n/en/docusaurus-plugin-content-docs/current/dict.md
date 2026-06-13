# Dictionaries and Sets

## Creating a Dictionary

The dictionary (`dict`) is a versatile data type. In other programming languages, similar data structures or containers are also called Maps, mapping tables, hash tables, etc.

### Using Curly Braces

A dictionary is a collection where each element is a key-value pair. When representing a dictionary, the dictionary itself is enclosed in curly braces, elements are separated by commas, and the key and value within each element are separated by a colon `:`. The simplest way to create a dictionary is to use curly braces to wrap the required key-value data:

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
* Dictionary keys must be of an immutable type, such as integers, floats, strings, or tuples. Lists or other dictionaries cannot be used as keys. This is to prevent keys from being modified, which would cause confusion when looking up items in the dictionary.
* Dictionary keys are unique; if the same key is added repeatedly, the later value will overwrite the previous one.
* Dictionary values can be of any type, including other dictionaries or lists.

### The dict() Function

The `dict()` function can be used to create a dictionary from other data structures.

The simplest way is to pass the keys and values of the dictionary to be created as keyword arguments to the `dict()` function, for example:

```python
# Using keyword arguments
my_dict = dict(Name="Cai Taixian", Age=25, City="Shanghai")
```

Another way to use `dict()` is to pass an iterable object to it, where each element of the input iterable is a tuple or list containing two items. For example:

```python
# Using a list of (key, value) tuples
pairs = [("Name", "Ma Tonggai"), ("Age", 25), ("City", "Shanghai")]
my_dict = dict(pairs)
```

If the existing data does not conform to this format, it needs to be converted before being passed to the `dict()` function. A common scenario is when the existing data consists of two lists, one containing all the keys and the other containing all the values. In this case, we can use the [zip()](loop#zip-function) function to combine the two lists into a list of pairs before creating the dictionary:

```python
keys = ["Name", "Age", "City"]
values = ["Mei Liangxin", 25, "Shanghai"]
my_dict = dict(zip(keys, values))
```

### Dictionary Comprehension

[Dictionary comprehension](comprehension#dictionary-comprehension) is also a commonly used method for creating dictionaries, but it is slightly more complex. We will introduce it after covering some other foundational knowledge.

## Common Dictionary Operations

### Checking if a Key Exists

Just like checking if an element exists in a list, checking if a key exists in a dictionary uses the `in` keyword. This returns a boolean indicating whether the key is present in the dictionary.

```python
person = {
    "Name": "Tang Hulu",
    "Age": 43,
    "City": "Shanghai"
}

if "Name" in person:
    print('The key "Name" exists in the dictionary.')
```

Due to the way dictionaries store data, checking whether a key exists in a dictionary is far more efficient than checking whether an element exists in a list.

### Accessing Values

Using square brackets and a key, similar to indexing a list, you can retrieve the corresponding value from a dictionary:

```python
person = {
    "Name": "Ruan Qizhen",
    "Age": 30,
    "City": "Shanghai"
}

print(person["Name"])  # Output: Ruan Qizhen
```

It is possible that the key you want to access does not exist. If you access a non-existent key, the program will raise a `KeyError` exception. For more on exceptions and their handling, refer to the [Exception Handling](exception) section.
To avoid exceptions, we can first check if the key exists and then access it. This is cumbersome; a simpler approach is to use the dictionary's `get()` method to access values. If the key does not exist, `get()` will not raise an exception; instead, it returns `None`. We can also specify a default value for `get()` to return when the key does not exist:

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

Accessing values by key in a dictionary is extremely efficient because the underlying data structure of dictionaries is optimized for key lookup speed. We will delve into the efficiency of dictionaries, lists, and other data structures in the [Data Structures and Algorithms](algorithm) section. For now, the important thing to understand is that retrieving data using a key is a very fast operation. Therefore, the primary use of dictionaries is to quickly obtain a value corresponding to a key. In contrast, directly searching for a specific value in a dictionary or finding a key based on a value is very inefficient.

If we have two data collections with a one-to-one mapping between them (each element uniquely corresponds to an element in the other collection), and we need to efficiently find the corresponding element from either collection, we can consider creating two dictionaries. One dictionary uses elements from the first data collection as keys, and the other uses elements from the second data collection as keys. This approach enables efficient bidirectional lookup between the two data collections.

Because Python uses dynamic typing, keys in the same dictionary can have different data types, which differs from many other mainstream programming languages. When using data of different types as keys, note that if their values are equal, Python considers them the same key even if the data types differ. For example, the integer `1` and the float `1.0` are considered the same key.

It is strongly recommended not to use floats as dictionary keys. Due to the [precision issues of floating-point storage](calculation#error) in computers, `0.1 + 0.2` is not exactly equal to `0.3`. This will cause your attempt to look up the key `0.1 + 0.2` using `0.3` to fail. For example:

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

In an assignment statement, using square brackets with a key also allows you to modify data in the dictionary.

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

Such an assignment statement does not check whether a key already exists. If the key does not exist, it is added; if the key already exists, the corresponding value is updated.

Sometimes, we may want to avoid overwriting an existing key and instead preserve the original value. This is similar to the problem encountered when accessing values. We can first check if the key exists and then decide whether to assign a value. Again, there is a more concise programming method for this: using the dictionary's `setdefault()` method. The `setdefault()` method is used to get the value for a given key. If the key does not exist in the dictionary, it inserts the key with the specified default value into the dictionary. If the key already exists, it returns the value for that key without changing the dictionary. For example:

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

A common use case for `setdefault()` is counting. For example, to count how many times each word appears in a sentence, we could use a program like this:

```python
counts = {}
words = ['Apple', 'Banana', 'Apple', 'Orange', 'Banana', 'Apple']

for word in words:
    counts.setdefault(word, 0)
    counts[word] += 1

print(counts)  # Output: {'Apple': 3, 'Banana': 2, 'Orange': 1}
```

In this example, the `setdefault()` method ensures that each word has a corresponding count value in the `counts` dictionary. If a word is not yet in the dictionary, it inserts the word with a count of 0. Then the count for that word can be safely incremented.

The above program can also achieve the same effect using the `get()` method. If the dictionary's values are simple data types, `get()` can make the code more concise. If the values themselves are complex types like lists or dictionaries, `setdefault()` is preferable. Here is the equivalent implementation using `get()`:

```python
counts = {}
words = ['Apple', 'Banana', 'Apple', 'Orange', 'Banana', 'Apple']

for word in words:
    counts[word] = counts.get(word, 0) + 1

print(counts)  # Output: {'Apple': 3, 'Banana': 2, 'Orange': 1}
```

In fact, there are even more flexible ways to handle default values for missing keys in a dictionary, which we will cover in detail in the [Counting](counter) section.

We introduced [multiple-variable assignment](variable#multiple-variable-assignment) and chained assignment statements earlier. Can the reader analyze what the following program outputs?

```python
x, y = x[y] = {}, "a"
print(x)
```

### Deleting Key-Value Pairs

Use the `del` statement to delete key-value pairs from a dictionary:

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

Use the `keys()`, `values()`, and `items()` methods to access the dictionary's keys, values, and key-value pairs respectively. These methods all return dictionary view objects, meaning they do not return fixed data. These views reflect changes to the dictionary; when the dictionary data changes, they change accordingly.

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

These methods are often used in conjunction with dictionary iteration. For example, if we only need to iterate over each value in the dictionary, we can iterate over the `values` view:

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

A more common scenario is iterating over all keys and values in a dictionary simultaneously, using the `items` view:

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

Note: When using a `for` loop to iterate over a dictionary (or set), never add or remove elements. This will cause a `RuntimeError: dictionary changed size during iteration` error. If modification is needed, it is recommended to first convert the keys to a list: `for key in list(person.keys()): ...`.

### Unpacking

Similar to list unpacking, dictionaries can be unpacked using the double asterisk `**` operator. Assuming `my_dict = {'a': 1, 'b': 2}`, the unpacking operation `**my_dict` yields `a=1, b=2`.

Unpacking can conveniently merge two dictionaries:

```python
dict1 = {'a': 1, 'b': 2}
dict2 = {'c': 3, 'd': 4}

merged_dict = {**dict1, **dict2}
print(merged_dict)  # Output: {'a': 1, 'b': 2, 'c': 3, 'd': 4}
```

The main use of dictionary unpacking is [passing arguments to functions](function#variable-number-of-arguments), which we will explain in detail when introducing functions.

## Common Dictionary Methods

Besides the `get`, `setdefault`, and other methods already introduced, dictionaries have other commonly used methods:

- `dict.update(another_dict)`: Merges the key-value pairs from another dictionary into the current dictionary.
- `dict.pop(key)`: Removes and returns the value for the specified key. Raises a `KeyError` if the key does not exist.
- `dict.clear()`: Removes all items from the dictionary.
- `dict.fromkeys(seq, value)`: Creates a new dictionary with keys from the sequence `seq` and all values set to `value`.

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

In Python programming, Lists, Tuples, Dictionaries, and Sets are the four most core and commonly used built-in data containers. Beginners often confuse their use cases, so here we provide a multi-dimensional comparison to help you make the most appropriate choice in actual programming.

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

A set is a commonly used mathematical concept. It is an unordered collection of distinct elements. Sets can contain objects of immutable types, such as numbers, strings, and tuples, but each element in a set must be unique. Duplicate elements are not allowed in a set. Sets in the Python language are very similar to the mathematical definition of sets. They are also unordered, require element uniqueness, and support basic mathematical operations such as intersection and union. However, there are some differences. In mathematics, a set is generally unchangeable once created, but sets in a program can have elements added or deleted after creation.

Python sets require all elements to be hashable. Simply put, elements must be immutable. For example, integers, strings, and tuples can all be set elements. Note: If a tuple contains mutable objects (such as `(1, [2, 3])`), that tuple is also unhashable and cannot be used as a set element.

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

Elements in a set are unique, meaning duplicate elements are automatically removed. Note that you cannot use empty curly braces `{}` to create an empty set, as empty curly braces represent an empty dictionary by default, not a set. To create an empty set, you must use `set()`.

### Common Operations

The usage of sets is very similar to dictionaries. In terms of data querying, a set can be thought of as a dictionary with only keys. Below are the most common set operations:

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

* Removing elements: Use the `remove()` or `discard()` method. The `remove()` method raises an error if the element does not exist, while the `discard()` method does not.

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
