# Everything is an Object

Almost everything used in Python code is an object — whether it's data, such as numbers, strings, lists, etc., or functions, classes, modules, and so on. This means they all have the characteristics and behaviors of objects, such as having attributes and methods, and can be assigned to variables, passed as arguments to functions, or returned as values from functions.

## Object Types

The `type()` function is a built-in function in Python. It has two main purposes: one is to get the type of an object; the other, more complex functionality, will be introduced in the "Metaclasses" section below.

Passing an object as an argument to the `type()` function returns the type of that object, for example:

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

From the example above, we can see that data, functions, objects, and classes themselves are all objects, each belonging to different types. For example: `7` is an object of the `int` class; the `print` function is an object of the `builtin_function_or_method` class; a custom function is an object of the `function` class; and a custom class is an object of the `type` class. Ultimately, everything points back to the ultimate class — `type`.

## Function Objects

As we already know from the previous section, functions are also objects. So what makes them different from other objects?

Simply put, if an object implements the `__call__` method, it can be treated as a function. The `__call__` method is a predefined special method in Python, much like `__init__` is also a predefined special method.

When a program attempts to call an object, it actually automatically invokes the `__call__` method of that instance. Therefore, if the object implements the `__call__` method, the call succeeds, and the object is considered a function. This is a rather interesting method — it can turn any object into a function, or rather, make an object behave like a function, making objects more flexible and versatile.

For example: suppose we want to create a class whose objects can be called to evaluate a polynomial. For instance, for a given input x, calculate $3x^2 + 4x + 10$.


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

In the example above, the `__call__` method makes instances of the Polynomial class callable. We simply pass a number as an argument (in this case, 2) to evaluate the polynomial at that input.

Python's built-in `callable()` function checks whether an object is "callable." If an object implements the `__call__` method, calling `callable()` on it returns `True`. This means the object is a function, and we can invoke it using function-call syntax.

Now, when we revisit the statement "[Functions are first-class citizens](first_class_func)", we realize that in Python, functions are nothing special: in Python, everyone is equal — everything is an object.

## Reflection

Reflection refers to the ability of a program to inspect, access, and modify its own state or behavior at runtime.

### Static Access to Attributes and Methods

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

In the example program above, we created an Animal object `dog` and statically called its `speak()` method. Note that this does not mean `speak` is a "static method" — it is an instance method; what we did was "statically invoke" this method. In static invocation, the method name is hardcoded in the program source code and cannot be changed at runtime. Besides this static way of accessing attributes and calling methods, Python also allows us to dynamically inspect what attributes and methods an object has, and then access and call them.

### Listing All Attributes and Methods

The `dir()` function lists all attributes and methods of an object. `dir()` returns a list of strings containing the names of all attributes and methods of the object, including those inherited from its base classes. For example:

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

Running the above program will print all attributes and methods of the `dog` object, including inherited ones: `['__class__', '__delattr__', '__dict__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__le__', '__lt__', '__module__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', 'speak', 'species']`

Why aren't attributes and methods distinguished? Which ones are attributes and which are methods? Let's analyze this carefully below:

### Dynamic Access to Attributes

Using functions like `getattr`, `setattr`, and `hasattr`, we can dynamically access and set an object's attributes and methods, thereby implementing reflection.

* `hasattr(object, name)` — checks whether an object has a given attribute or method. It returns a boolean indicating whether the object has the specified attribute.
* `getattr(object, name[, default])` — gets the attribute or method of an object. If the attribute or method does not exist, it returns the specified default value; if no default is specified, it raises an `AttributeError`.
* `setattr(object, name, value)` — sets the attribute or method of an object. If the attribute or method already exists, its value is updated; if it does not exist, a new attribute or method is created.

The three functions above share similar parameters: `object` refers to the object being accessed or modified; `name` is the name of the attribute or method, represented as a string. In other words, we can pass an attribute name represented as a string variable to the functions above, and then use those names to access the attributes. These string-represented attribute names are not hardcoded in the source code — they can vary at runtime and can even be temporarily generated after the program starts. This is how dynamic access to attributes and methods is truly achieved. For example:

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
setattr(animal, 'species', 'Cat')
print(animal.species)  # Output: Cat

# Dynamically call a method
method = getattr(animal, 'speak')
method()  # Output: Cat made a sound
```

In the program above, we used the attribute names `"species"` and `"speak"` (represented as strings) to access these two attributes.

### Attributes and Methods

After reading the introduction and examples above, many readers may have already realized that attributes and methods are not fundamentally different: they are both variables pointing to an object. If an attribute happens to point to an object that implements the `__call__` method, then that attribute can also be called a method.

For example, in the following program, we use attribute-setting code to add a method called `eat` to the `dog` object:

```python
class Animal:
    def __init__(self, species):
        self.species = species

dog = Animal("Dog")
# Add a method
dog.eat = lambda: print("I'm full")

dog.eat()   # Output: "I'm full"
```

Since attributes and methods are essentially the same thing — both are objects — their only distinction lies in whether that object is a function: if it is a function, it can be called a method; otherwise, it's an attribute. We can use the `callable()` function to check whether an attribute is a method:

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

It is important to note that adding a method via `dog.eat = lambda...` only adds a callable function attribute; it is not a true method. When a real instance method is called, Python automatically passes the object instance (`self`) as the first argument.

If we want dynamically added methods to automatically receive `self` like normal methods do, we need to use the `types` module:

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

Class decorators are similar to function decorators — they both leverage Python's higher-order function feature to modify or enhance the functionality of a class. A class decorator receives a class and returns a new class or modifies the original class. Since classes themselves are also objects (even though we can still create instances of that class), they can also be passed as arguments to functions.

### Basic Usage

Let's start with a simple example of a class decorator that adds a new attribute to the class:

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

In this example, we defined a decorator called `add_attribute` that adds a new attribute to the class passed in. Then, we decorate `MyClass` with `@add_attribute`. When `MyClass` is defined, it is immediately passed to the `add_attribute` function and transformed into the decorated class.

### Using a Class as a Decorator

We can also define a class to be used as a decorator. This class needs to implement the `__call__` method so that it can be used like a function. The following example demonstrates how to use a class decorator to count the number of object instances created:

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

In the example above, the `__call__` method defines the behavior when `CountInstances` is used to decorate a class. It creates a subclass of the decorated class to replace the original one. The subclass behaves exactly the same as the decorated class, except that it adds a counter. Thus, every time a new object of the decorated class is created, the counter increments by one.

### Modifying Class Behavior

Class decorators can not only add attributes or methods but also modify existing behavior. They do this through the reflection mechanism introduced earlier to modify the attributes and methods of a class.

For example, the following decorator disables all methods of a class:

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

Class decorators can access and modify the attributes and methods of a class, but they cannot change the class's inheritance relationships. If multiple decorators are applied to a class, they are applied from the innermost to the outermost. Decorators are a very powerful feature, so caution is needed when using class decorators to ensure that existing class behavior is not inadvertently broken. Appropriate documentation should also be provided to describe the behavior and purpose of the decorator.


## Metaclasses

A metaclass is a class used to create classes, just as a class is used to create objects. In other words: a class is a template for objects, and a metaclass is a template for classes.

### type

There is a famous quote from *Animal Farm*: "All animals are equal, but some animals are more equal than others." A similar saying circulates on the planet Pythora: In Python, all objects are equal, but some objects are more equal than others.

Objects are created from classes. Since classes are also objects, they must themselves be created from some class. Tracing upward layer by layer, there must be an end. The end of the universe — Tieling — is the `type` class.

In Python, the standard, built-in metaclass is `type`. Earlier, we used the `type()` function to check the type of an object. The `type()` function also has another use: it can accept three arguments and return a dynamically created class:

```python
# Note: the second argument (object,) is a tuple — the comma is required; otherwise it will be treated as a normal variable
Animal = type('Animal', (object), {'species': 'Dog'})
```

The program above dynamically creates a new `Animal` class. It is "dynamic" because the new class's type, inheritance relationship, and attribute settings are not hardcoded in the source code — they can be generated at runtime. This produces the same result as the following static class creation code:

```python
class Animal(object):
    species = 'Dog'
```

### The `__new__` Method

Since we will need it later, let's introduce a predefined special class method in Python: `__new__`. `__new__` is a class method, not an instance method. When creating an object from a class, Python first calls the `__new__` method of the class, and only then calls the object's constructor `__init__`. In most programs, we only need to initialize new objects, so we use the `__init__` method. However, in certain cases where we need more control over the object creation process, `__new__` comes into play. The `__new__` method is responsible for creating (and returning) a new instance of a class. It is a class method, so it does not require an instance to be called, but it must return an instance. If it does not correctly return an instance, `__init__` will not be invoked.

Here are some typical use cases for `__new__`:

#### Implementing the Singleton Pattern

The Singleton Pattern means that a class can only have one instance. In this case, we can use `__new__` to check whether an instance already exists. If not, create one; if it does, return the existing instance directly:

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

In the program above, it calls `super().__new__(cls)` to create a new object, which invokes the parent class's `__new__` method. The parent class of `Singleton` is `object`, so technically, in this program, we could just return a new `object` directly rather than calling the parent class's method — the effect would be the same. However, in complex inheritance scenarios, calling the corresponding method of the parent class is necessary to maintain consistent behavior with the parent class. Therefore, it is good practice to consistently use the `super()` function to call the corresponding parent class method to accomplish the required functionality, regardless of whether the class has a parent class.

#### Creating Immutable Objects

For example, if we want to create an extended tuple type, we can use `__new__` to customize the object creation process.

```python
class ExtendedTuple(tuple):  # Inheritance
    def __new__(cls, *args):
        new_args = (x*2 for x in args)
        return super().__new__(cls, new_args)

t = ExtendedTuple(1, 2, 3)
print(t)  # Output: (2, 4, 6)
```

Since `tuple` is an immutable type, its content must be determined at the time of instance creation and cannot be changed afterward. Therefore, the `__new__` method is the place to create custom immutable type instances. In the example above, we use `__new__` to multiply each element of the tuple by 2 and pass the new arguments to the tuple constructor.

### Custom Metaclasses

A metaclass defines the behavior of a class, just as a class defines the behavior of its instances. Custom metaclasses are mainly used for custom creation and modification of classes. They are typically used for advanced purposes, such as intercepting class creation, modifying class definitions, automating certain processing workflows, or implementing specific patterns. For example, we can use a metaclass to automatically add certain methods or attributes when creating classes in a project, or to ensure that all classes follow a specific pattern.

Custom metaclasses usually inherit from the `type` class and typically need to override its `__new__` or `__init__` methods.

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

The above is a simple example of a custom metaclass that automatically adds a new class method when creating a new class. When defining a class, the user can specify the metaclass using the `metaclass` keyword argument.

### When to Use Metaclasses

Metaclasses are a very powerful tool, but also a complex one. They are commonly used in the following scenarios:

* Controlling class creation: intercept the class definition during the class creation process to modify or validate it, or ensure that subclasses follow certain conventions or patterns.
* Registering classes: automatically register a class at creation time, for example, adding a class reference to some registry.
* Code generation and automatic addition of attributes or methods: as shown in the example above, automatically add attributes or methods to a class.
* Implementing specific programming patterns: such as the Singleton Pattern, Factory Pattern, etc.

The downsides of metaclasses are also clear: they increase code complexity and are often unnecessary in most cases. Metaclasses should only be considered when deep control over class behavior is needed. The use of metaclasses can make code harder to understand, so be sure to provide adequate documentation.
