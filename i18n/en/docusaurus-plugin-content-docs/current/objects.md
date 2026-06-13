# Everything is an Object

In Python, almost everything is a first-class object—whether it is raw data (like numbers, strings, and lists), or functions, classes, modules, and namespaces. This means they all exhibit object-like characteristics: they possess attributes and methods, can be assigned to variables, passed as arguments to functions, or returned from function calls.

## Object Types

The built-in `type()` function serves two primary purposes: querying the type of a given object, and dynamically constructing new classes (which we will cover in the [Metaclasses](#metaclasses) section below).

Passing an object as an argument to `type()` returns its class/type. For example:

```python
# Python built-in objects
x = 7
print(type(x))        # Output: <class 'int'>

y = "Hello"
print(type(y))        # Output: <class 'str'>

z = [1, 2, 3]
print(type(z))        # Output: <class 'list'>

print(type(print))    # Output: <class 'builtin_function_or_method'>

my_func = lambda x: x*x
print(type(my_func))  # Output: <class 'function'>

import sys
print(type(sys))      # Output: <class 'module'>

class MyClass:
    pass

obj = MyClass()
print(type(obj))      # Output: <class '__main__.MyClass'>

print(type(object))   # Output: <class 'type'>

print(type(MyClass))  # Output: <class 'type'>

print(type(type))     # Output: <class 'type'>
```

As demonstrated above, data, functions, instances, and classes are all first-class objects. For instance, `7` is an instance of the `int` class, `print` is an instance of the `builtin_function_or_method` class, and a custom class `MyClass` is itself an instance of the `type` class. Ultimately, all classes are instances of the root metaclass, `type`.

## Function Objects

Since functions are objects, what distinguishes them from other data containers? Why can we invoke them using parentheses `()`?

Simply put, any object that implements the special `__call__()` method can be invoked like a function. The `__call__()` method is a dunder method, similar to `__init__()`.

When you invoke an object (e.g., `obj()`), Python automatically calls its underlying `__call__()` method. Implementing `__call__()` allows instances of a class to behave exactly like functions, opening up elegant patterns for stateful callables.

For example, let's write a `Polynomial` class whose instances can be called to evaluate a mathematical polynomial. For a given input $x$, we want to calculate $3x^2 + 4x + 10$:

```python
class Polynomial:
    def __init__(self, coefficients):
        """coefficients is a list where the i-th element is the coefficient of x^i"""
        self.coefficients = coefficients

    def __call__(self, x):
        """Evaluate the polynomial for a given x"""
        return sum([coef * (x ** (len(self.coefficients) - i - 1)) for i, coef in enumerate(self.coefficients)])

    def __repr__(self):
        return " + ".join([f"{coef}x^{(len(self.coefficients) - i - 1)}" for i, coef in enumerate(self.coefficients) if coef])

# Create a polynomial object: 3x^2 + 4x + 10
p = Polynomial([3, 4, 10])

# Call the object to evaluate at x=2
print(p(2))  # Output: 30

# Print the polynomial itself
print(p)  # Output: 3x^2 + 4x^1 + 10x^0
```

In this example, the `__call__()` method makes `Polynomial` instances callable. We evaluate the expression by passing the input value `2` directly to the object `p`.

You can use Python's built-in `callable()` function to verify if an object is callable. If an object implements `__call__()`, `callable(obj)` returns `True`. This check applies to functions, classes, and callable instances alike.

When we say [functions are first-class citizens](first_class_func), it is because Python makes no artificial distinction between functions and objects. In Python, everything is a unified object.

## Reflection

Reflection (or introspection) is the ability of a program to inspect, access, and modify its own structure and behavior at runtime.

### Static Access vs. Reflection

In all the examples we have seen so far, accessing attributes or methods of an object was done using static access. For example:

```python
class Animal:
    def __init__(self, species):
        self.species = species

    def speak(self):
        print(f"{self.species} made a sound")

# Create an object
dog = Animal("Dog")
dog.speak()
```

In this code, we call `dog.speak()` using a static identifier. The name `speak` is hardcoded into the source code and cannot be changed at runtime. While static access is the most common approach, Python also allows us to inspect, retrieve, and execute attributes and methods dynamically based on string names determined at runtime.

### Listing All Attributes and Methods

The built-in `dir()` function returns a list of strings containing the names of all attributes and methods associated with an object, including those inherited from its base classes. For example:

```python
class Animal:
    def __init__(self, species):
        self.species = species

    def speak(self):
        print(f"{self.species} made a sound")

# Create an object
dog = Animal("Dog")

# List all attributes and methods of dog
print(dir(dog))
```

Running this code prints a comprehensive list of attributes and methods on the `dog` instance: `['__class__', '__delattr__', '__dict__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__le__', '__lt__', '__module__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', 'speak', 'species']`

Notice that `dir()` does not distinguish between variables (attributes) and functions (methods). Let's explore why Python treats them identically.

### Dynamic Access to Attributes

We can dynamically inspect and manipulate objects using `hasattr()`, `getattr()`, and `setattr()`:

* `hasattr(object, name)`: Checks if an object has an attribute or method with the specified string name, returning a boolean.
* `getattr(object, name[, default])`: Retrieves the attribute or method matching the string name. If the attribute does not exist, it returns the default value (if provided) or raises an `AttributeError`.
* `setattr(object, name, value)`: Sets the specified attribute to `value`. If the attribute does not exist, it is created dynamically.

These reflection functions represent the attribute names as standard strings. This allows you to construct, pass, and query attribute names dynamically at runtime (e.g., loading configurations or routing dynamic requests):

```python
class Animal:
    def __init__(self, species):
        self.species = species

    def speak(self):
        print(f"{self.species} made a sound")

# Create an object
animal = Animal("Dog")

# Use reflection to get attribute value
print(getattr(animal, 'species'))  # Output: Dog

# Check if the object has a certain method
print(hasattr(animal, 'speak'))  # Output: True

# Set attribute value
print(animal.species)  # Output: Cat

# Dynamically call a method
method = getattr(animal, 'speak')
method()  # Output: Cat made a sound
```

In the program above, we retrieved and manipulated properties using the string values `'species'` and `'speak'`.

### Attributes and Methods

In Python, attributes and methods are not fundamentally different. Both are variables containing references to objects. If an attribute references an object that implements the `__call__()` method, it behaves as a method.

For example, we can dynamically attach a function to an object's attribute namespace:

```python
class Animal:
    def __init__(self, species):
        self.species = species

dog = Animal("Dog")
# Add a method
dog.eat = lambda: print("I'm full")

dog.eat()   # Output: "I'm full"
```

Because attributes and methods are both objects, we distinguish them simply by checking if their value is callable. We can use the `callable()` function to perform this check:

```python
class Animal:
    def __init__(self, species):
        self.species = species

    def speak(self):
        print(f"{self.species} made a sound")

# Create an object
dog = Animal("Dog")
dog.eat = lambda: print("I'm full")

print(callable(dog.species))  # Output: False
print(callable(dog.eat))      # Output: True
print(callable(dog.speak))    # Output: True
```

Note that binding a function directly (e.g., `dog.eat = lambda...`) attaches it as a callable attribute, but does not convert it into a bound instance method. When invoked, it will not receive the implicit `self` argument automatically.

To dynamically bind a function as a true instance method that automatically receives `self`, use the `types.MethodType` constructor:

```python
import types

class Animal:
    def __init__(self, species):
        self.species = species

dog = Animal("Dog")

# Define a function that requires self
def dynamic_eat(self):
    print(f"{self.species} is full")

# Use MethodType to bind it to the dog instance
dog.eat = types.MethodType(dynamic_eat, dog)

dog.eat()   # Output: Dog is full (successfully accessed self.species)
```

## Class Decorators

Just as function decorators wrap functions, **class decorators** wrap classes. A class decorator is a higher-order function that accepts a class object as an argument, modifies it, and returns the modified class or a wrapper subclass.

### Basic Usage

Here is a simple class decorator that dynamically injects an attribute into a class definition:

```python
def add_attribute(cls):
    cls.new_attribute = "I am a new attribute"
    return cls

@add_attribute
class MyClass:
    pass

obj = MyClass()
print(obj.new_attribute)  # Output: I am a new attribute
```

When `MyClass` is declared, it is automatically passed to the `add_attribute()` decorator, which injects `new_attribute` into its namespace before returning the class.

### Using a Class as a Decorator

We can also implement decorators as classes by defining the `__call__()` method. The following example implements a class-based decorator `@CountInstances()` that tracks how many instances of a class are constructed:

```python
class CountInstances:
    # Define a counter attribute
    counter = 0
    
    def __call__(self, cls):
        # Create and return a subclass of the decorated class
        class NewClass(cls):
            def __init__(self, *args, **kwargs):
                # The subclass constructor first updates the counter, then calls the parent class constructor
                CountInstances.counter += 1
                super().__init__(*args, **kwargs)
        return NewClass

@CountInstances()
class MyClass:
    pass

obj1 = MyClass()
obj2 = MyClass()

print(CountInstances.counter)  # Output: 2
```

The `__call__()` method intercepts the target class creation, returning a wrapper subclass (`NewClass`) that increments the global counter before executing the original initializer.

### Modifying Class Behavior

Class decorators can use reflection to dynamically modify or replace existing class attributes and methods.

For example, the following decorator disables all public methods in a class by replacing them with a dummy function:

```python
def disable_methods(cls):
    for name, method in cls.__dict__.items():
        if callable(method):
            # Here, set every method in the class to a function that does nothing and returns the string: "Method unavailable"
            setattr(cls, name, lambda *args, **kwargs: "Method unavailable")
    return cls

@disable_methods
class MyClass:
    def greet(self):
        return "Hello!"

obj = MyClass()
print(obj.greet())  # Output: Method unavailable
```

While class decorators are highly powerful, they must be used carefully to avoid breaking expected APIs. Ensure your decorators are well-documented so other developers understand how class behavior is altered.

## Metaclasses

A **metaclass** is a class used to construct classes, just as a class is a blueprint used to construct objects. In other words, a class defines the behavior of instances, while a metaclass defines the behavior of classes.

### The type Metaclass

On the planet Pythora, developers often adapt a famous quote: *'All objects are equal, but some objects are more equal than others.'*

If classes are objects, they must be instances of a class. What is the class of a class? If we trace this chain to the end of the universe, we arrive at the root metaclass: `type`.

In Python, `type` is the built-in metaclass. While we frequently call `type(obj)` to query an object's type, passing three arguments to `type()` dynamically constructs and returns a new class object:

```python
# Note: the second argument (object,) is a tuple — the comma is required; otherwise it will be treated as a normal variable
Animal = type('Animal', (object,), {'species': 'Dog'})
```

The parameters are: `type(name, bases, dict)`. This dynamically instantiates an `Animal` class, producing the exact same class object as this static declaration:

```python
class Animal(object):
    species = 'Dog'
```

### The `__new__()` Method

When instantiating a class, Python first executes `__new__()` to allocate and return the raw instance, and then executes `__init__()` to initialize it. While everyday code only requires overriding `__init__()`, overriding `__new__()` gives you absolute control over the object creation process. If `__new__()` does not return an instance of the class, `__init__()` will not run.

Here are two common use cases for `__new__()`:

#### 1. Implementing the Singleton Pattern

The Singleton Pattern ensures a class has only a single instance. We can use `__new__()` to check if an instance has already been created, returning it if it exists or instantiating a new one if it does not:

```python
class Singleton:
    _instance = None   # Used to track the created instance

    def __new__(cls):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance

s1 = Singleton()
s2 = Singleton()       # s2 is not a new object; it points to the existing one

print(s1 == s2)        # Output: True
```

Calling `super().__new__(cls)` delegates the memory allocation to the parent class. While we could technically instantiate a raw `object` directly, using `super()` ensures that subclass hooks and complex inheritance structures continue to work correctly.

#### 2. Subclassing Immutable Types

Because immutable types (like `tuple`, `str`, and `int`) cannot be modified after creation, their values must be configured during memory allocation. To customize these types, you must override `__new__()`:

```python
class ExtendedTuple(tuple):  # Inheritance
    def __new__(cls, *args):
        new_args = (x*2 for x in args)
        return super().__new__(cls, new_args)

t = ExtendedTuple(1, 2, 3)
print(t)  # Output: (2, 4, 6)
```

In this example, `ExtendedTuple` intercepts the elements before instantiation, doubling their values and passing them to the base `tuple` constructor via `super().__new__()`.

### Custom Metaclasses

A metaclass defines how a class is constructed, allowing you to intercept, validate, or modify class definitions at load time. Custom metaclasses must inherit from `type` and typically override `__new__()` or `__init__()`:

```python
# Define a metaclass
class MyMeta(type):
    def __new__(cls, name, bases, dct):
        # Note: without staticmethod, this would become a regular instance method
        # Here, we add the function defined in the metaclass as a static method to the new class
        dct["new_class_method"] = staticmethod(cls.class_method) 
        return super().__new__(cls, name, bases, dct)

    @staticmethod
    def class_method():
        print("This is a new static method")

# Use a custom metaclass
class MyClass(metaclass=MyMeta):
    pass

# Test: the new class already has the automatically added method
MyClass.new_class_method()  # Output: This is a new static method
```

In this example, the custom metaclass `MyMeta` intercepts class definitions and injects a static method `new_class_method` before constructing the class object. To apply a metaclass, specify the `metaclass` keyword argument in the class header: `class MyClass(metaclass=MyMeta)`.

### When to Use Metaclasses

While metaclasses are highly powerful, they add significant complexity and should be used sparingly. Typical production use cases include:

* **APIs and Framework Validation**: Verifying that subclasses implement specific attributes or follow naming rules at compile/import time.
* **Registry Patterns**: Automatically registering subclasses (e.g., registering all database models or API endpoints).
* **Attribute Injection**: Automatically injecting helpers or metadata into class definitions.
* **ORM (Object-Relational Mapping)**: Libraries like Django or SQLAlchemy use metaclasses extensively to translate class definitions into database schemas.

If a design can be accomplished using class decorators, choose decorators—they are simpler and easier to debug than custom metaclasses.
