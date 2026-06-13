# Magic

Only magic can defeat magic. Python is so powerful, it must have some magic to control it.

When writing methods for your own classes, some attribute or method names cannot be used arbitrarily, because Python has predefined some names with special meanings, known as magic methods and magic attributes. In Python, magic methods and attributes are also called special methods/attributes or dunder (double underscore) methods/attributes. They are prefixed and suffixed with double underscores, for example, the previously introduced `__init__`, `__new__`, `__call__` methods, `__name__`, `__doc__` attributes, etc.

Magic methods and attributes allow us to customize the internal behavior of objects, enabling advanced features such as operator overloading (e.g., redefining the behavior of addition, subtraction, multiplication, division) and attribute access.

## Construction, Destruction, Printing

Let's use a simple example to understand these basic magic methods. Suppose we want to create a simple Point class representing a point on a two-dimensional plane:

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
        
In the program above:
* When a new object is created, the `__init__` method is immediately executed to initialize the object's state. Here, we initialized two attributes, x and y.
* When the object is destroyed (e.g., when it is no longer referenced), the `__del__` method is called. In our example, it simply prints a simple message, but in real applications, it could be used to release resources such as closing files or disconnecting network connections.
* The repr() function calls the `__repr__` method. It returns a string representing a Python expression that could be used to recreate the object. In our example, repr(point) will return a string like Point(1, 2). In the section [Program That Prints Itself](miscellaneous#repr-函数), there is an interesting application of this function.
* When we print an object or convert it to a string, the `__str__` method is called. In our example, str(point) will return (1, 2).


If multiple variables point to the same object, then `__del__` will only be called to destroy the object after all variables pointing to it have been deleted, for example:

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

Note: In Python, try to avoid relying on `__del__` to automatically release resources (such as closing files or network connections). This is because Python's garbage collection mechanism does not guarantee that `__del__` will be executed immediately. The correct approach is to use context managers (the with statement).

## Operators

### Arithmetic Operators

Arithmetic magic methods are used to redefine the arithmetic operator behavior of objects. The most commonly used methods include:

* `__add__(self, other)`: Defines addition behavior. When the `+` symbol is used for addition in a program, this method of the object is called.
* `__sub__(self, other)`: Defines subtraction behavior.
* `__mul__(self, other)`: Defines multiplication behavior.
* `__truediv__(self, other)`: Defines true division behavior (`/` in Python 3).
* `__floordiv__(self, other)`: Defines integer division behavior (`//` in Python 3).
* `__mod__(self, other)`: Defines modulo (remainder) behavior.
* `__pow__(self, power[, modulo])`: Defines exponentiation behavior.

Python has a built-in Fraction class for representing mathematical fractions. Below we write a simplified version of a Fraction class to demonstrate the implementation and usage of arithmetic magic methods. The Fraction class has two attributes representing the numerator and denominator. Its implementation is as follows:

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
        new_denominator = self.denominator * other.denominator
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

It is important to note that these commonly used operators are all binary operators, operating between two objects. During computation, the program calls the corresponding method of the first object. Taking addition as an example, when computing `f1 + f2`, it calls the `__add__(self, other)` method of object f1. In the parameters passed to this method, self is f1 and other is f2.

The two operands of an operator do not need to be of the same data type, as long as the first object's `__add__` method supports it. For instance, we can modify the `__add__` method in this Fraction class to allow addition with an integer:

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

In the program above, the `__add__` method checks the data type of the `other` parameter. If it is another fraction, it uses fraction arithmetic; if it is an integer, it uses integer arithmetic. Therefore, we can compute `frac1 + 3`, adding a fraction and an integer. However, if we try to compute `3 + frac1`, it will cause an error, because the `__add__` method of the int object does not support Fraction objects. If we need to compute `3 + frac1`, we can use the reflected arithmetic operator `__radd__`:

```python
    # Handle the case of 3 + frac1
    def __radd__(self, other):
        # Addition is commutative, so just call __add__ directly
        return self.__add__(other)
```

### Comparison Operators

As the name suggests, comparison magic methods are used to redefine comparison behavior between objects. Common comparison magic methods include:

* `__eq__(self, other)`: Defines equality behavior, using `==`.
* `__ne__(self, other)`: Defines inequality behavior, using `!=`.
* `__lt__(self, other)`: Defines less-than behavior, using `<`.
* `__le__(self, other)`: Defines less-than-or-equal behavior, using `<=`.
* `__gt__(self, other)`: Defines greater-than behavior, using `>`.
* `__ge__(self, other)`: Defines greater-than-or-equal behavior, using `>=`.

We can continue using our simplified Fraction class with comparison magic methods to compare the magnitude of two fractions.

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

Type conversion magic methods are used for data type conversion of objects. Python's built-in type conversion functions call these methods. Common methods include:

* `__int__(self)`: Called when using int(obj).
* `__float__(self)`: Called when using float(obj).
* `__bool__(self)`: Called when using bool(obj).

We will continue using the simplified Fraction class to demonstrate type conversion methods, such as converting to integers, floating-point numbers, and booleans.

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

Container magic methods are used to define custom objects that behave like Python containers (e.g., lists, dictionaries). Here are some common container magic methods:

* `__len__(self)`: Returns the number of elements in the container. Corresponds to the built-in function len().
* `__getitem__(self, key)`: Used to access elements in the container. Corresponds to obj[key] behavior.
* `__setitem__(self, key, value)`: Assigns a value to an element in the container. Corresponds to obj[key] = value behavior.
* `__delitem__(self, key)`: Deletes an element from the container. Corresponds to del obj[key] behavior.
* `__contains__(self, item)`: Used to check whether the container contains an element. Corresponds to item in obj behavior.
* `__iter__(self)`: Returns an iterator for the container. Corresponds to iter(obj) behavior.

Suppose we want to create a simple sorted sequence class that behaves similarly to the basic functionality of Python's built-in list, with the unique feature that its internal data is always sorted. For simplicity, we use a regular list internally to store the data, even though this is not efficient.

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

Attribute access magic methods are used to customize the behavior of accessing, setting, and deleting attributes. Here are some commonly used attribute access magic methods:

* `__getattr__(self, name)`: Called when trying to access a non-existent attribute.
* `__setattr__(self, name, value)`: Called when setting an attribute's value.
* `__delattr__(self, name)`: Called when trying to delete an attribute.
* `__getattribute__(self, name)`: Called when trying to access any attribute.

Suppose we want to create a class that stores a history record every time an attribute is set, and we want to ensure that certain attribute names cannot be set.

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

When using the with statement, a context manager ensures that resources such as files, network connections, or database connections are properly acquired and released, regardless of whether an exception occurs within the context. The two related methods are:

* `__enter__(self)`: Called when the with statement is executed. The return value of this method is used by the with statement's target (or the variable in the as clause). It is commonly used to initialize and return the resource that needs to be managed.
* `__exit__(self, exc_type, exc_value, traceback)`: Called when the code in the with block finishes execution (or when an exception is raised during execution). If no exception occurred in the with block, exc_type, exc_value, and traceback will be None. If this method returns True, it suppresses the exception raised in the with block; otherwise, the exception continues to propagate.

Suppose we need to write a timer class that starts timing when the code in the with block executes, stops timing after the code finishes, and then prints the execution time.


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

* `__dict__`

This is a dictionary containing all attributes of the object. When an object is created, Python typically creates a dictionary to store all attributes, allowing new attributes to be dynamically added to the object at runtime.

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

* `__slots__`

Using a dictionary to store object attributes is flexible, but dictionaries have additional memory overhead. If we already know that an object only needs a fixed set of attributes, using `__slots__` can avoid this dictionary overhead and use memory more efficiently. The way to define `__slots__` is to create an attribute named `__slots__` in the class and store the desired attribute names as strings in a tuple or list.

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
        

* `__doc__`

This attribute returns the documentation of the class.

```python
class MyClass:
    """This is a docstring for MyClass."""
    pass

print(MyClass.__doc__)  # Output: This is a docstring for MyClass.
```

* `__name__`

For a class, this returns the class name. For a module, it returns the module name.

```python
print(MyClass.__name__)  # Output: MyClass
```

* `__module__`

This attribute stores the module name where the class or function was defined.

```python
print(MyClass.__module__)  # Typically outputs: __main__
```

* `__bases__`

This attribute is a tuple containing all base classes.

```python
class Parent:
    pass

class Child(Parent):
    pass

print(Child.__bases__)  # Output: (<class '__main__.Parent'>,)
```

* `__class__`

It returns the class to which the object belongs.

```python
obj = MyClass()
print(obj.__class__)  # Output: <class '__main__.MyClass'>
```
