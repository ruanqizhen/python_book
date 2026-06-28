# Type Hinting in Modern Python

In the early days of the planet Pythora, Python was renowned for its unrestrained "dynamic typing." Swordsmen back then executed their moves blazingly fast; they didn't care about the exact shape or length of a weapon (the variable type). As long as it could slash (had the required method), it was good enough for battle. This was the famous philosophy of "Duck Typing."

However, as the projects across various factions grew massively in scale, this unbridled freedom began to show its flaws. Writing code was fast, but maintaining it became a nightmare: is this `data` parameter supposed to be a list, a dictionary, or a custom object? Without reading through lines of source code or running into runtime crashes, it was impossible to be certain.

To solve this, Python introduced **Type Hinting** starting in version 3.5. It retains the flexibility of a dynamic language while bringing the rigor and self-documenting capabilities characteristic of statically typed languages.

## Dynamic Typing vs. Static Typing

Traditional Python code is dynamically typed, meaning variable types are only determined at runtime:

```python
def process_user(user_id):
    # Should user_id be an integer or a string here?
    return user_id * 2
```

If you pass the integer `3`, it returns `6`; if you pass the string `"3"`, it returns `"33"`. This ambiguity can easily plant hidden bugs.

With type hinting, the intent of the function becomes instantly clear:

```python
def process_user(user_id: int) -> int:
    return user_id * 2
```

Using the colon `:`, we annotate that `user_id` should be an integer, and with the arrow `->`, we specify that the function's return value is also an integer.

> **Note**: Python's type hints are strictly "hints." The Python interpreter completely ignores these annotations at runtime. Even if you pass a string, the program will execute just as it did before (or crash). The primary purpose of type hints is to aid developers in reading code and to empower modern IDEs (like PyCharm or VS Code) to provide highly accurate auto-completion and error warnings.

## Basic Types and the `typing` Module

Besides the most basic types like `int`, `float`, `str`, and `bool`, we frequently encounter more complex container types in practice. For these, we rely on the built-in `typing` module.

*(Note: In Python 3.9 and later, built-in types like `list` and `dict` natively support type hinting. However, for compatibility with older code, you'll often see the capitalized `List` and `Dict` imported from the `typing` module.)*

### Lists and Dictionaries

We can precisely specify what a list contains, or the types for a dictionary's keys and values:

```python
from typing import List, Dict

# Specify a list containing strings
def get_user_names(user_ids: List[int]) -> List[str]:
    return [f"User_{uid}" for uid in user_ids]

# Specify a dictionary mapping string keys to float values
def calculate_scores() -> Dict[str, float]:
    return {"Alice": 95.5, "Bob": 88.0}
```

### Multiple Possibilities: `Union` and `Optional`

Sometimes a variable can be one of several types. For example, if a function parameter accepts both integers and floats, we can use `Union`:

```python
from typing import Union

def square_area(side_length: Union[int, float]) -> Union[int, float]:
    return side_length * side_length
```

Even more commonly, a function might fail to find a result and return `None`. In this case, we use `Optional` (which is essentially shorthand for `Union[X, None]`):

```python
from typing import Optional

def find_user(username: str) -> Optional[dict]:
    if username == "admin":
        return {"id": 1, "role": "admin"}
    return None  # Return None if not found
```

### Any Type and Callables: `Any` and `Callable`

When you genuinely don't care about a variable's type, or when you are interfacing with legacy code lacking type hints, you can use `Any`. It acts as an escape hatch, telling the type checker: "Don't worry about this one, let it pass."

If you need to pass a function as an argument (as we saw in the higher-order functions of the functional programming chapter), you can use `Callable`:

```python
from typing import Callable

# The 'action' parameter must be a function that takes a string and returns an int
def execute_task(task_name: str, action: Callable[[str], int]) -> int:
    print(f"Executing task: {task_name}")
    return action(task_name)
```

## Static Type Checking: mypy

Since the Python interpreter ignores type hints at runtime, how do we ensure the annotations we wrote are actually correct?

This is where `mypy`, the Python community's most famous static type checker, comes in. It acts as a strict code inspector, analyzing your source code before it runs to catch potential bugs caused by type mismatches.

First, install it via the terminal:

```bash
pip install mypy
```

Suppose we have the following code with a type error:

```python
# test_types.py
def greet(name: str) -> str:
    return "Hello " + name

# ERROR: Passing an int instead of a str
greeting = greet(123)
```

Running `mypy test_types.py` in the terminal will immediately throw an error pointing out the exact issue, completely bypassing the need to run the code:

```text
$ mypy test_types.py
test_types.py:6: error: Argument 1 to "greet" has incompatible type "int"; expected "str"
Found 1 error in 1 file (checked 1 source file)
```

## Summary

In modern collaborative Python development, type hinting has become an essential baseline skill. Whether it's FastAPI (which leverages type hints to automate validation and generate documentation) or Pydantic (a famous data validation library), modern frameworks rely heavily on this mechanism.

Cultivating the habit of writing type hints not only supercharges your IDE's auto-completion capabilities but also leaves the clearest possible signposts for your teammates—and for your future self months down the line.
