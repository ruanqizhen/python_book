# Magic Methods

Only magic can defeat magic. For a language as powerful as Python, it must have some magic to control it.

When writing methods for your own classes, some attribute or method names cannot be used arbitrarily. This is because Python predefines certain names with special meanings, known as magic methods and magic attributes. In Python, these are also referred to as special methods/attributes or dunder (double underscore) methods/attributes. They are prefixed and suffixed with double underscores—for example, the previously introduced `__init__`, `__new__`, and `__call__` methods, and the `__name__` and `__doc__` attributes.

Magic methods and attributes allow us to customize the internal behavior of objects, enabling advanced features such as operator overloading (redefining the behavior of addition, subtraction, multiplication, division, etc.) and attribute access.

## Construction, Destruction, and Printing

Let's use a simple example to understand these basic magic methods. Suppose we want to create a simple `Point` class that represents a point on a two-dimensional plane:

```python
class Point:
    # Initialize a newly created object
    def __init__(self, x=0, y=0):
        self.x = x
        self.y = y
        print(f"Created point ({self.x}, {self.y})")

    # Destructor method, called when the object is destroyed
    def __del__(self):
        print(f"Point ({self.x}, {self.y}) destroyed")

    # Returns a "formal" representation, typically can be used to recreate the object
    def __repr__(self):
        # Returns the class name and parameters, e.g. "Point(1, 2)"
        return f"{self.__class__.__name__}({self.x}, {self.y})"

    # Returns an "informal" representation, used for printing or logging
    def __str__(self):
        return f"({self.x}, {self.y})"
        
# Test:
p = Point(1, 2)      # Output: Created point (1, 2)
print(p)             # Output: (1, 2)
print(repr(p))       # Output: Point(1, 2)
del p                # Output: Point (1, 2) destroyed
```
        
In the code above:
* When a new object is created, the `__init__` method is executed immediately to initialize the object's state. Here, we initialize two attributes: `x` and `y`.
* When the object is destroyed (e.g., when it is no longer referenced), the `__del__` method is called. In our example, it simply prints a message, but in real applications, it can be used to release resources, such as closing files or terminating network connections.
* The `repr()` function calls the `__repr__` method. It returns a string representing a Python expression that can typically be used to recreate the object. In our example, `repr(point)` will return a string like `Point(1, 2)`. You can find an interesting application of this in [The repr() Function](miscellaneous#the-repr-function) section of the [Some Fun Programs](miscellaneous) chapter.
* When we print an object or convert it to a string, the `__str__` method is called. In our example, `str(point)` will return `(1, 2)`.


If multiple variables point to the same object, `__del__` is called only after all variables pointing to it have been deleted. For example:

```python
class Point:
    def __init__(self, x=0, y=0):
        self.x = x
        self.y = y
        print(f"Created point ({self.x}, {self.y})")

    def __del__(self):
        print(f"Point ({self.x}, {self.y}) destroyed")

p = Point(1, 2)      # Constructor is called
print("=====Separator======")
q = p                # New variable points to the existing object, constructor is not called
del p                # There are still other variables pointing to this object, destructor is not called
print("=====Separator======")
del q                # All variables have been deleted, destructor is called to destroy the object

# Output:
# Created point (1, 2)
# =====Separator======
# =====Separator======
# Point (1, 2) destroyed
```

**Note:** In Python, avoid relying on `__del__` to automatically release resources (such as closing files or network connections). This is because Python's garbage collection mechanism does not guarantee when `__del__` will be executed. The correct approach is to use context managers (the `with` statement).

## Operators

### Arithmetic Operators

Arithmetic magic methods allow you to redefine how arithmetic operators behave on custom objects. The most commonly used methods include:

* `__add__(self, other)`: Defines addition behavior. When the `+` operator is used, this method of the left-hand operand is called.
* `__sub__(self, other)`: Defines subtraction behavior for the `-` operator.
* `__mul__(self, other)`: Defines multiplication behavior for the `*` operator.
* `__truediv__(self, other)`: Defines true division behavior (`/`).
* `__floordiv__(self, other)`: Defines floor (integer) division behavior (`//`).
* `__mod__(self, other)`: Defines modulo (remainder) behavior for the `%` operator.
* `__pow__(self, power[, modulo])`: Defines exponentiation behavior for the `**` operator or the built-in `pow()` function.

Python has a built-in `Fraction` class for representing mathematical fractions. Below, we write a simplified version of a `Fraction` class to demonstrate the implementation and usage of arithmetic magic methods. Our `Fraction` class has two attributes representing the numerator and denominator:

```python
from math import gcd

class Fraction:
    def __init__(self, numerator, denominator=1):
        if denominator == 0:
            raise ValueError("Denominator cannot be 0!")
        
        common = gcd(numerator, denominator)
        self.numerator = numerator // common
        self.denominator = denominator // common

    def __add__(self, other):
        new_numerator = self.numerator * other.denominator + other.numerator * self.denominator
        new_denominator = self.denominator * other.denominator
        return Fraction(new_numerator, new_denominator)

    def __sub__(self, other):
        new_numerator = self.numerator * other.denominator - other.numerator * self.denominator
        new_denominator = self.denominator * other.denominator
        return Fraction(new_numerator, new_denominator)

    def __mul__(self, other):
        new_numerator = self.numerator * other.numerator
        new_denominator = self.denominator * other.numerator
        return Fraction(new_numerator, new_denominator)

    def __truediv__(self, other):
        new_numerator = self.numerator * other.denominator
        new_denominator = self.denominator * other.numerator
        return Fraction(new_numerator, new_denominator)

    def __repr__(self):
        return f"{self.numerator}/{self.denominator}"

# Test code
f1 = Fraction(3, 4)
f2 = Fraction(5, 6)

print(f"{f1} + {f2} = {f1 + f2}")       # Output: 3/4 + 5/6 = 19/12
print(f"{f1} - {f2} = {f1 - f2}")       # Output: 3/4 - 5/6 = -1/12
print(f"{f1} * {f2} = {f1 * f2}")       # Output: 3/4 * 5/6 = 5/8
print(f"{f1} / {f2} = {f1 / f2}")       # Output: 3/4 / 5/6 = 9/10
```

Note that these common operators are all binary operators, operating on two operands. During evaluation, Python calls the corresponding method on the left-hand operand. Taking addition as an example, when evaluating `f1 + f2`, Python calls the `__add__(self, other)` method of `f1`. In this call, `self` points to `f1`, and `other` points to `f2`.

The two operands do not need to be of the same type, as long as the left operand's `__add__` method handles the other type. For instance, we can modify the `__add__` method in the `Fraction` class to allow addition with an integer:

```python
from math import gcd

class Fraction:
    def __init__(self, numerator, denominator=1):
        if denominator == 0:
            raise ValueError("Denominator cannot be 0!")
        
        common = gcd(numerator, denominator)
        self.numerator = numerator // common
        self.denominator = denominator // common

    def __add__(self, other):
        if isinstance(other, Fraction):
            new_numerator = self.numerator * other.denominator + other.numerator * self.denominator
            new_denominator = self.denominator * other.denominator
        elif isinstance(other, int):
            new_numerator = self.numerator + other * self.denominator
            new_denominator = self.denominator
        else:
            raise TypeError("Addition only supports Fraction or integer types")
        
        return Fraction(new_numerator, new_denominator)

    def __repr__(self):
        return f"{self.numerator}/{self.denominator}"
        
# Test code
frac1 = Fraction(1, 2)
frac2 = Fraction(3, 4)

result1 = frac1 + frac2  # Adding two Fraction instances
result2 = frac1 + 3      # Adding a Fraction instance and an integer

print(result1)           # Output:  5/4
print(result2)           # Output:  7/2
```

In the code above, the `__add__` method checks the type of the `other` parameter. If it is another fraction, it performs fraction addition; if it is an integer, it converts it to a common denominator and adds. This allows us to compute `frac1 + 3` directly. However, if we try to compute `3 + frac1`, it will raise a `TypeError`. This is because the `__add__` method of the built-in `int` object does not know how to handle a `Fraction` object. To support operations where our custom object is on the right-hand side (e.g., `3 + frac1`), we can implement the reflected arithmetic method `__radd__`:

```python
    # Handle the case of 3 + frac1
    def __radd__(self, other):
        # Addition is commutative, so just call __add__ directly
        return self.__add__(other)
```

### Comparison Operators

Comparison magic methods allow you to redefine comparison behaviors between objects. Common comparison magic methods include:

* `__eq__(self, other)`: Defines equality behavior for the `==` operator.
* `__ne__(self, other)`: Defines inequality behavior for the `!=` operator.
* `__lt__(self, other)`: Defines less-than behavior for the `<` operator.
* `__le__(self, other)`: Defines less-than-or-equal behavior for the `<=` operator.
* `__gt__(self, other)`: Defines greater-than behavior for the `>` operator.
* `__ge__(self, other)`: Defines greater-than-or-equal behavior for the `>=` operator.

We can extend our simplified `Fraction` class with these comparison magic methods to compare the relative values of two fractions:

```python
from math import gcd

class Fraction:
    def __init__(self, numerator, denominator=1):
        if denominator == 0:
            raise ValueError("Denominator cannot be 0!")
        
        common = gcd(numerator, denominator)
        self.numerator = numerator // common
        self.denominator = denominator // common

    def __eq__(self, other):
        return self.numerator == other.numerator and self.denominator == other.denominator

    def __lt__(self, other):
        # Compare two fractions a/b and c/d, converted to a*d < c*b
        return self.numerator * other.denominator < other.numerator * self.denominator

    def __le__(self, other):
        return self.numerator * other.denominator <= other.numerator * self.denominator

    def __gt__(self, other):
        return self.numerator * other.denominator > other.numerator * self.denominator

    def __ge__(self, other):
        return self.numerator * other.denominator >= other.numerator * self.denominator

    def __repr__(self):
        return f"{self.numerator}/{self.denominator}"

# Test
f1 = Fraction(1, 2)  # 1/2
f2 = Fraction(3, 4)  # 3/4

print(f1 == f2)  # False
print(f1 < f2)   # True
print(f1 <= f2)  # True
print(f1 > f2)   # False
print(f1 >= f2)  # False
```

### Type Conversion

Type conversion magic methods customize how objects are cast into built-in types. Python's built-in type conversion functions delegate to these methods. Common ones include:

* `__int__(self)`: Called when invoking `int(obj)`.
* `__float__(self)`: Called when invoking `float(obj)`.
* `__bool__(self)`: Called when invoking `bool(obj)` (e.g., in conditional checks).

Let's add type conversion methods to our `Fraction` class to support converting a fraction to an integer, a floating-point number, or a boolean:

```python
class Fraction:
    def __init__(self, numerator, denominator):
        if denominator == 0:
            raise ValueError("Denominator cannot be 0!")
        self.numerator = numerator
        self.denominator = denominator

    def __int__(self):
        # Convert to integer, effectively the integer result of numerator divided by denominator
        return self.numerator // self.denominator

    def __float__(self):
        # Convert to float
        return self.numerator / self.denominator

    def __bool__(self):
        # If the fraction is not 0, it is True, otherwise False
        return self.numerator != 0

    def __str__(self):
        return f"{self.numerator}/{self.denominator}"

# Test
f = Fraction(3, 4)

print(int(f))     # 0, because 3//4 = 0
print(float(f))   # 0.75, because 3/4 = 0.75
print(bool(f))    # True, because 3/4 is not 0

f_zero = Fraction(0, 1)
print(bool(f_zero))  # False, because the numerator is 0
```

## Data Structures

Container magic methods allow custom objects to behave like Python's built-in collection types (such as lists, tuples, or dictionaries). Here are some common container magic methods:

* `__len__(self)`: Returns the number of elements in the container, corresponding to the built-in `len()` function.
* `__getitem__(self, key)`: Retrieves an element using key or index access, corresponding to `obj[key]`.
* `__setitem__(self, key, value)`: Assigns a value using key or index access, corresponding to `obj[key] = value`.
* `__delitem__(self, key)`: Deletes an element from the container, corresponding to `del obj[key]`.
* `__contains__(self, item)`: Checks if an item exists in the container, corresponding to the `item in obj` expression.
* `__iter__(self)`: Returns an iterator over the container's elements, corresponding to the `iter(obj)` function.

Suppose we want to create a custom `SortedList` class that behaves like a standard Python list, with the restriction that its internal data remains sorted at all times. For simplicity, we will wrap a standard list internally, even though sorting on every modification is inefficient:

```python
class SortedList:
    def __init__(self, initial_data=None):
        self.data = sorted(initial_data)

    def __len__(self):
        return len(self.data)

    def __getitem__(self, index):
        return self.data[index]

    def __setitem__(self, index, value):
        self.data[index] = value
        self.data.sort()

    def __delitem__(self, index):
        del self.data[index]

    def __contains__(self, value):
        return value in self.data

    def append(self, value):
        self.data.append(value)
        self.data.sort()

    def __iter__(self):
        return iter(self.data)

    def __repr__(self):
        return repr(self.data)

# Test
lst = SortedList([3, 1, 2])
print(lst)           # [1, 2, 3]
lst.append(0)
print(lst)           # [0, 1, 2, 3]
lst[1] = 5           # Change the value of the first element to 5, then the data is re-sorted
print(lst)           # [0, 2, 3, 5]
del lst[2]
print(lst)           # [0, 2, 5]
```


## Attribute Access

Attribute access magic methods allow you to customize how attributes are retrieved, modified, or deleted on an object. The key methods are:

* `__getattr__(self, name)`: Invoked only when attempting to access an attribute that does not exist on the object.
* `__setattr__(self, name, value)`: Invoked whenever an attribute is set on the object (e.g., `obj.name = value`).
* `__delattr__(self, name)`: Invoked when attempting to delete an attribute (e.g., `del obj.name`).
* `__getattribute__(self, name)`: Invoked for *any* attribute access on the object, regardless of whether the attribute exists.

Suppose we want to create a class that keeps a history of all modifications to its attributes, while also preventing certain forbidden attribute names from being set:

```python
class HistoricalAttributes:
    def __init__(self):
        # Use super().__setattr__ to bypass custom logic and prevent initialization crashes
        super().__setattr__('_history', {})
        super().__setattr__('_forbidden_attributes', ["forbidden", "history"])

    def __setattr__(self, name, value):
        # At this point self._history already safely exists
        if hasattr(self, '_forbidden_attributes'):
             if name in self._forbidden_attributes:
                raise AttributeError(f"'{name}' is a read-only attribute.")
            
        # Record history
        if name not in self._history:
            self._history[name] = []
        self._history[name].append(value)
        
        super().__setattr__(name, value)

    def history_of(self, name):
        # Return the history of an attribute
        return self._history.get(name, [])

# Test
obj = HistoricalAttributes()
obj.x = 10
obj.x = 20
obj.y = 5
print(obj.history_of('x'))  # Output: [10, 20]
print(obj.history_of('y'))  # Output: [5]
# obj.forbidden = 99        # Raises AttributeError: 'forbidden' is a read-only attribute.
```



## Context Management

Context managers, used with the `with` statement, guarantee that setup and cleanup operations (like opening/closing files, acquiring/releasing locks, or establishing/terminating database connections) are executed reliably, even if errors occur inside the block. The context manager protocol consists of two methods:

* `__enter__(self)`: Executed when entering the `with` block. The value returned by this method is bound to the target variable in the `as` clause.
* `__exit__(self, exc_type, exc_value, traceback)`: Executed when exiting the `with` block. If the block exited cleanly, all three exception arguments are `None`. If an exception occurred, these arguments carry the exception's type, value, and traceback. Returning `True` from this method suppresses the exception; returning `False` (or `None`) allows the exception to propagate normally.

Suppose we want to create a custom timer class that tracks the execution time of a code block:


```python
import time

class Timer:
    def __enter__(self):
        self.start = time.time()
        return self  # This self will be used by the with statement's as clause

    def __exit__(self, exc_type, exc_value, traceback):
        self.end = time.time()
        print(f"Elapsed time: {self.end - self.start:.2f} seconds")
        return False  # If an exception occurs, do not suppress it

# Usage example
with Timer() as t:
    print(t.start)
    for _ in range(1000000):
        pass

# Output similar to: Elapsed time: 0.13 seconds
```

## Common Attributes

* `__dict__`: A dictionary containing all of the object's writable attributes. By default, Python uses this dictionary to store instance variables, allowing attributes to be added or modified dynamically at runtime.

```python
class MyClass:
    def __init__(self, x, y):
        self.x = x
        self.y = y

obj = MyClass(1, 2)
print(obj.__dict__)  # Output: {'x': 1, 'y': 2}

obj.value = 3        # Add a new attribute to the object
print(obj.__dict__)  # Output: {'x': 1, 'y': 2, 'value': 3}
```

* `__slots__`: A class-level variable (usually a tuple or list of strings) that specifies the only attributes instances of the class are allowed to have. By defining `__slots__`, Python avoids creating the `__dict__` dictionary for each instance, which significantly reduces memory usage.

```python
class Fraction:
    __slots__ = ('numerator', 'denominator')
    
    def __init__(self, numerator, denominator=1):
        if denominator == 0:
            raise ValueError("Denominator cannot be 0!")
        
        common = gcd(numerator, denominator)
        self.numerator = numerator // common
        self.denominator = denominator // common

# Test
f = Fraction(1, 2)  # 1/2

# The following code will raise an error, because __slots__ restricts to only 'numerator' and 'denominator'
# f.value = 3
```    
    
In the above example, we can only set the numerator and denominator attributes for Fraction instances. Attempting to set other attributes will raise an AttributeError.
        

* `__doc__`: Stores the docstring (documentation string) defined at the top of the class, function, or module.

```python
class MyClass:
    """This is a docstring for MyClass."""
    pass

print(MyClass.__doc__)  # Output: This is a docstring for MyClass.
```

* `__name__`: The name of the class, function, method, generator, or module.

```python
print(MyClass.__name__)  # Output: MyClass
```

* `__module__`: The name of the module in which the class or function was defined (e.g., `__main__` or a library name).

```python
print(MyClass.__module__)  # Typically outputs: __main__
```

* `__bases__`: A tuple containing the direct base classes of a class (used for inheritance inspection).

```python
class Parent:
    pass

class Child(Parent):
    pass

print(Child.__bases__)  # Output: (<class '__main__.Parent'>,)
```

* `__class__`: A reference to the class object that the instance belongs to.

```python
obj = MyClass()
print(obj.__class__)  # Output: <class '__main__.MyClass'>
```
