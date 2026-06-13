# Classes

## Encapsulation

### Creating a Class

In Python, classes are created using the `class` keyword. A class acts as a blueprint, defining the attributes (variables) and methods (functions) that represent the state and behavior of its objects. Let's start with a basic `Animal` class definition and build upon it:

```python
class Animal:
    pass
```

The `class` keyword is immediately followed by the class name (by convention, using CamelCase, e.g., `Animal`). If a class inherits from a parent class, the parent class name is placed in parentheses after the class name; we will demonstrate this inheritance syntax later. If no parent class is specified, the class automatically inherits from Python's built-in `object` class. In Python, all classes are descendants of the root `object` class.

### Objects of a Class

A class is just a template; to use it, we must instantiate one or more objects (instances) from it. Calling a class name like a function generates a new object of that class, which we can assign to a variable:

```
dog = Animal()
```

### Attributes

Python distinguishes between **class attributes** and **instance attributes**, a distinction that is handled more implicitly in many other languages.

A **class attribute** is a variable defined directly in the class body. It is shared by the class itself and all of its instances. For example, we can track the total number of animal instances created:

```python
class Animal:
    total_animals = 0  # Class variable, tracking the number of animals created

dog = Animal()
print(Animal.total_animals)   # Output: 0, accessing directly via the class name
print(dog.total_animals)      # Output: 0, can also be accessed via the instance
```

Class attributes are accessed using dot notation on the class name (e.g., `Animal.total_animals`). If an instance does not have an attribute with that name, looking up the attribute on the instance (e.g., `dog.total_animals`) falls back to the class attribute value.

An **instance attribute** is unique to a specific object. It is created by assigning a value to an attribute on the instance:

```python
class Animal:
    name = '旺财'

dog = Animal()
dog.age = 3
print(dog.age)   # Output: 3
```

Here, `dog.age` accesses the `age` attribute unique to the `dog` object.

Methods are also attributes of an object, but they are callable. We will explore how Python handles this binding in the [Dynamic Access to Attributes](objects#dynamic-access-to-attributes) section.

### Initialization Method

The initialization method (`__init__`) configures an object's initial state when it is created. Although programmers with Java or C++ backgrounds often refer to `__init__` as a "constructor," in Python, the constructor is technically `__new__` (which creates the raw object instance), while `__init__` is an initializer that populates the instance after creation. (We explore [the `__new__` method](objects#the-__new__-method) in detail in the next chapter.)

Setting attributes on an object one by one after creation is tedious and error-prone. A cleaner approach is to pass initial values during instantiation using the `__init__` method, which Python automatically calls when an object is created. 

`__init__` belongs to a group of special methods (often called "dunder" methods because they start and end with a double underscore). The first parameter of `__init__` must always be `self`, which represents the active object instance. When calling an instance method, Python automatically passes the instance reference to `self` behind the scenes.

```python
class Animal:
    def __init__(self, name, species):
        self.name = name
        self.species = species

# Usage:
dog = Animal("旺财", "狗")
chick = Animal("花冠", "鸡")

print(dog.name)       # Output: Wangcai
print(chick.name)     # Output: Huaguan
```

In this code, the `__init__` method accepts the custom arguments `name` and `species`, binding them as instance attributes via `self.name` and `self.species`.

Unlike some statically typed languages, Python does not support function overloading, meaning you cannot define multiple `__init__` methods with different parameters. However, you can achieve the same flexibility by using default argument values or defining custom [factory methods](#factory-methods).

### Same-name Variables (Attributes)

If a class attribute and an instance attribute share the same name, the instance attribute masks the class attribute when accessed through an object:

```python
class Animal:
    name = "动物"
    def __init__(self, name, species):
        self.name = name
        self.species = species

# Usage:
dog = Animal("旺财", "狗")

print(Animal.name)     # Output: animal - accessing class attribute via class name
print(dog.name)        # Output: Wangcai - accessing instance attribute via object
```

To prevent confusion and avoid bugs, always access class attributes using the class name rather than an instance. This is especially important when dealing with mutable attributes, where in-place modifications can lead to unexpected behaviors:

```python
class MyCounter:
    internal_a = []
    internal_b = []
    internal_c = []
    def __init__(self):
        self.internal_a = self.internal_a + [1]  # Relatively clear: instance attribute
        self.internal_b += [1]                   # Confusing
        self.internal_c.append(1)                # Relatively clear: class attribute
        
counter_1 = MyCounter()
counter_2 = MyCounter()

print(counter_1.internal_a)    # Output: [1]     Instance attribute
print(counter_1.internal_b)    # Output: [1, 1]  Class attribute
print(counter_1.internal_c)    # Output: [1, 1]  Class attribute

print(counter_2.internal_a)    # Output: [1]     Instance attribute
print(counter_2.internal_b)    # Output: [1, 1]  Class attribute
print(counter_2.internal_c)    # Output: [1, 1]  Class attribute

print(MyCounter.internal_a)    # Output: []
print(MyCounter.internal_b)    # Output: [1, 1]
print(MyCounter.internal_c)    # Output: [1, 1]
```

Let's unpack what happened in the initializer of `MyCounter`:
* `internal_a`: The `+` operator evaluates to a new list object, which is then bound as an instance attribute on `self`. The class attribute remains an empty list `[]`.
* `internal_b`: The `+=` operator performs an in-place modification on mutable objects (equivalent to calling `.extend()`). Since `self.internal_b` resolves to the shared class attribute, the list is modified in place, updating the class attribute for all instances.
* `internal_c`: Calling the `.append()` method modifies the shared class list in place, affecting all instances.

To write clean, predictable code, always target the class name explicitly when accessing or modifying class attributes:

```python
class MyCounter:
    internal_a = []
    internal_b = []
    internal_c = []
    def __init__(self):
        MyCounter.internal_a = MyCounter.internal_a + [1]  
        MyCounter.internal_b += [1]                   
        MyCounter.internal_c.append(1)             
```

Also, be aware that class bodies do not share scopes with nested list comprehensions or generator expressions:

```python
a = 1
class MyCounter:
    a = 8
    b = [a]                      # Here, the class attribute a is used
    c = [a for i in range(2)]    # Here, the global variable a is used
    
print(MyCounter.b)   # Output: [8]
print(MyCounter.c)   # Output: [1, 1]      
```

> [!IMPORTANT]
> In Python 3, list comprehensions have their own local scope. Because a class body's scope is not visible to nested scopes, the variable `a` inside the comprehension falls back to searching the global namespace, resolving to `1` rather than the class attribute `8`. This is a classic advanced scope gotcha.

### Instance Methods

An instance method represents a behavior or action that an object can perform. It is defined inside a class and accepts `self` as its first parameter, allowing it to inspect and modify the object's attributes:

```python
class Animal:
    def __init__(self, name, species):
        self.name = name
        self.species = species

    def speak(self):
        print("这是默认声音。")

    def eat(self):
        print(f"{self.name} 正在吃饭。")

# Usage:
dog = Animal("旺财", "狗")
dog.speak()       # Output: This is the default sound.
dog.eat()         # Output: Wangcai is eating.
```

Because instance methods are bound to specific object instances, they can read and write attributes unique to the instance they belong to.

### Class Methods

Unlike instance methods, **class methods** are bound to the class itself, rather than individual instances. The first parameter of a class method represents the class object and is conventionally named `cls` (instead of `self`).

Class methods are used to inspect or modify class-wide state (such as class attributes) or perform actions that do not depend on any specific instance's attributes.

To define a class method, decorate the function using `@classmethod`. You can call class methods directly on the class or on any of its instances:

```python
class Animal:
    total_animals = 0  # Class variable, tracking the number of animals created

    def __init__(self, species):
        self.species = species
        Animal.total_animals += 1

    # Class method
    @classmethod
    def get_total_animals(cls):
        return cls.total_animals
        
cat = Animal("猫")
dog = Animal("狗")

# Using the class method
print(Animal.get_total_animals())  # Output: 2
print(cat.get_total_animals())     # Output: 2, equivalent to calling via the class
```

In Python, classes cannot define an instance method and a class method with the same name; the last definition processed will overwrite previous ones.

In many statically typed languages, class methods and variables are declared using a `static` keyword. However, because [everything is an object](objects) in Python, a class is itself a first-class object (an instance of the `type` metaclass) and can therefore naturally have its own attributes and methods.

#### Factory Methods

A common use case for class methods is defining **factory methods**. A factory method handles complex initialization logic, parses alternative inputs, or applies dynamic configurations before instantiating and returning a configured object:

```python
class Animal:
    total_animals = 0  # Class variable, tracking the number of animals created

    def __init__(self, species, age=None, gender=None):  # Define all possible attributes in init
        self.species = species
        self.age = age
        self.gender = gender

    # Class method for getting the total animal count
    @classmethod
    def get_total_animals(cls):
        return cls.total_animals

    # Factory method for creating complex animal objects
    @classmethod
    def create_complex_animal(cls, species, age, gender):
        # The factory method handles parameter logic, then calls init
        return cls(species, age, gender)

# Using the factory method to create an animal
complex_animal = Animal.create_complex_animal("熊猫", 5, "雄性")

# Checking the attributes of the newly created complex animal
print(f"种类：{complex_animal.species}；年龄：{complex_animal.age}；性别：{complex_animal.gender}")

# Output:
# 种类：熊猫；年龄：5；性别：雄性
```

### Static Methods

If a helper function defined inside a class does not need to read or write instance-level or class-level attributes, define it as a **static method**. While a static method behaves identically to a standalone global function, placing it inside the class keeps the namespace clean and organizes utility functions with the classes they support.

To define a static method, apply the `@staticmethod` decorator. Unlike instance or class methods, static methods do not receive implicit first arguments (`self` or `cls`):

```python
class Animal:
    @staticmethod
    def is_healthy(sound):
        return sound != "silent"


# Using the static method
sound = "barking"
print(Animal.is_healthy(sound))  # Output: True
```

Static methods are ideal for utility functions. For example, a `Point` class can expose a static method to calculate the distance between any two point instances:

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    @staticmethod
    def distance(p1, p2):
        """Calculate the distance between two points"""
        return ((p1.x - p2.x)**2 + (p1.y - p2.y)**2)**0.5


p1 = Point(1, 2)
p2 = Point(3, 4)

print(Point.distance(p1, p2))
```

## Inheritance

Inheritance allows a new class (a **subclass** or **derived class**) to inherit attributes and methods from an existing class (a **parent class**, **base class**, or **superclass**). This supports code reuse and allows subclasses to specialize behaviors:

```python
# Define the parent class
class Animal:
    def __init__(self, species):
        self.species = species

    def speak(self):
        print(f"我是一只{self.species}")

# Define the subclass
class Dog(Animal):  # Specify the parent class name in parentheses to indicate inheritance
    def __init__(self, name, breed):
        # Call the parent class's constructor
        super().__init__(species="狗")
        self.name = name
        self.breed = breed

    # Override the parent class's method
    def speak(self):
        print(f"我是一条{self.breed}，名叫：{self.name}。我会汪汪叫。")

    # Subclass-specific method
    def wag_tail(self):
        print(f"{self.name}正在摇尾巴。")
```

The subclass `Dog` inherits `Animal`'s properties. It overrides `__init__` and `speak()`, and defines a new subclass-specific method `wag_tail()`.

Inside overridden methods, use the `super()` function to call the parent class's implementation. For example, `super().__init__(species="狗")` delegates the initialization of common attributes to the parent class.

> [!TIP]
> Always use `super()` instead of explicitly calling the parent class by name (e.g., `Animal.__init__(self)`). `super()` decouples the subclass from its specific parent, making inheritance paths easier to refactor, and is essential for resolving method resolution order (MRO) correctly in [multiple inheritance](multiple_inheritance) structures.

We can instantiate and test our classes like this:

```python
dog = Dog(name="旺财", breed="金毛猎犬")
dog.speak()     # Output: I am a Golden Retriever named Wangcai. I can bark.
dog.wag_tail()  # Output: Wangcai is wagging its tail.

cat = Animal(species="猫")
cat.speak()     # Output: I am a cat
```

### Checking Inheritance Relationships

The built-in `issubclass()` function checks if one class inherits from another. It returns `True` if the first argument is a descendant of the second:

```python
# Define the parent class
class Animal:
    def __init__(self):
        pass

# Define the subclass
class Dog(Animal): 
    def __init__(self):
        pass
        
# An unrelated class
class Plant:
    def __init__(self):
        pass
      
print(issubclass(Dog, Animal))     # Output: True
print(issubclass(Animal, object))  # Output: True
print(issubclass(Plant, object))   # Output: True
print(issubclass(Plant, Animal))   # Output: False
```

### Checking Whether an Object is an Instance of a Class

The built-in `isinstance()` function checks if an object is an instance of a specific class or inherits from it:

```python
# Define the parent class
class Animal:
    def __init__(self):
        pass

# Define the subclass
class Dog(Animal): 
    def __init__(self):
        pass
        
# An unrelated class
class Plant:
    def __init__(self):
        pass
      
dog = Dog()
plant = Plant()

print(isinstance(dog, Animal))    # Output: True
print(isinstance(dog, object))    # Output: True
print(isinstance(plant, object))  # Output: True
print(isinstance(plant, Animal))  # Output: False
```

## Polymorphism

While statically typed languages (like Java and C++) implement polymorphism strictly via class inheritance or interfaces, Python utilizes **duck typing**.

Duck typing is derived from the phrase: *"If it walks like a duck, swims like a duck, and quacks like a duck, then it is a duck."* In Python, an object's suitability is determined by the methods and behaviors it exposes, rather than its explicit class hierarchy. This dynamic model focuses on interface contracts rather than strict type checks:

```python
class Cat:
    def speak(self):
        return "喵喵！"

class Dog:
    def speak(self):
        return "汪汪！"

def animal_voice(animal):
    return animal.speak()

cat = Cat()
dog = Dog()

# Since both Cat and Dog have a speak method, they can be handled by the animal_voice function
print(animal_voice(cat))  # Output: Meow!
print(animal_voice(dog))  # Output: Woof!
```

The `animal_voice()` function does not perform type checking; it simply calls the `.speak()` method on the passed object. As a result, `Cat` and `Dog` objects exhibit polymorphic behavior.

Class methods also support polymorphism. For example, we can invoke class methods dynamically across a collection of classes:

```python
class Dog:
    @classmethod
    def speak(cls):
        return f"{cls.__name__} 汪汪！"

class Cat:
    @classmethod
    def speak(cls):
        return f"{cls.__name__} 喵喵！"

def animal_voice(classes):
    for c in classes:
        print(c.speak()) 
    
# Test polymorphism
animal_voice([Dog, Cat])

# Output:
# Dog 汪汪！
# Cat 喵喵！
```

## Access Restrictions

Languages like C++ and Java use keywords like `private` or `protected` to enforce data hiding. In Python, all class attributes and methods are public by default.

### Naming Conventions

To implement access control, Python developers rely on naming conventions to signal intent:

* **Single Underscore (`_variable`)**: Tells developers that the attribute or method is intended for internal use within the class and should not be accessed directly by consumer code. While Python does not prevent access, modifying protected attributes violates library APIs.

```python
class MyClass:
    def __init__(self):
        self._protected_variable = "Protected"
    
    def _protected_method(self):
        return "这是一个受保护方法"
```

* **Double Underscore Name Mangling (`__variable`)**: If a name begins with a double underscore (and does not end with one), the interpreter performs **name mangling**, rewriting the attribute name to `_ClassName__variable`. This is not a security feature (you can still access it using the mangled name), but rather a mechanism to prevent naming collisions with subclass attributes:

```python
class MyClass:
    def __init__(self):
        self.__private_variable = "Private"
    
    def __private_method(self):
        return "这是一个私有方法"
```

Because `__private_variable` is mangled to `_MyClass__private_variable`, attempting to access `obj.__private_variable` directly raises an `AttributeError`.

### Hiding Data

A defensive design pattern is to treat attributes as private, accessing them only through public getter and setter methods. This allows classes to run custom logic, perform range checks, and audit writes:

```python
class Animal:
    def __init__(self, name):
        self._name = name

    def get_name(self):
        return self._name


def main():
    animal = Animal("旺财")

    # Not recommended to access class data directly
    # print(animal._name)

    # Recommended to access class data via method calls
    print(animal.get_name())

if __name__ == "__main__":
    main()
```

### Property Decorators

Using explicit getter and setter methods can make code verbose. Python provides the `@property` decorator to expose getter and setter methods as standard attributes, combining encapsulation with clean syntax:

```python
class Circle:
    def __init__(self, radius):
        self._radius = radius
    
    @property
    def radius(self):
        """Get the radius of the circle"""
        return self._radius
    
    @radius.setter
    def radius(self, value):
        """Set the radius of the circle, ensuring it is a positive number"""
        if value <= 0:
            raise ValueError("半径必须是正数")
        self._radius = value
        
    @radius.deleter
    def radius(self):
        """Prevent deleting the radius attribute and print a message"""
        print("半径属性不能被删除!")
        # If deletion is needed, call del self._radius
    
    @property
    def area(self):
        """Calculate the area of the circle"""
        return 3.14 * self._radius * self._radius

# Test:
c = Circle(5)    # Create a circle object with radius 5
print(c.radius)  # Output: 5
print(c.area)    # Output: 78.5

c.radius = 3     # Set the radius via the setter method
print(c.radius)  # Output: 3
print(c.area)    # Output: 28.26

# Running the following code will cause an error
# c.radius = -2  # Invalid radius, will raise ValueError
# c.area = 5     # Read-only attribute, not writable, will raise AttributeError
```

In this code:
* `@property` decorates `radius()`, exposing it as a read attribute.
* `@radius.setter` defines the setter method, validating input values before assignment.
* `@radius.deleter` runs clean-up code or blocks deletions when `del c.radius` is called.
* `area()` has a `@property` decorator but no setter, making it a read-only computed attribute.

Property decorators are the standard way to expose attributes in Python classes.

## Data Classes (@dataclass)

We often write simple classes whose sole purpose is to serve as structured data containers:

```python
class Knight:
    def __init__(self, name: str, power: int, skill: str):
        self.name = name
        self.power = power
        self.skill = skill
```

To make these containers useful, we typically have to write boilerplate methods like `__repr__` (for clean string output) and `__eq__` (to support equality checks like `k1 == k2`):

```python
class Knight:
    def __init__(self, name: str, power: int, skill: str):
        self.name = name
        self.power = power
        self.skill = skill

    def __repr__(self):
        return f"Knight(name={self.name!r}, power={self.power!r}, skill={self.skill!r})"

    def __eq__(self, other):
        if not isinstance(other, Knight):
            return NotImplemented
        return (self.name, self.power, self.skill) == (other.name, other.power, other.skill)
```

Writing this boilerplate across dozens of data models is tedious and error-prone. Python 3.7 resolved this by introducing **Data Classes**.

### Elegant Modern Syntax

Decorating a class with `@dataclass` tells Python to automatically generate common special methods like `__init__`, `__repr__`, and `__eq__` based on type annotations defined in the class body:

```python
from dataclasses import dataclass

@dataclass
class Knight:
    name: str
    power: int
    skill: str
    state: str = "生龙活虎"  # Supports setting default values
```

We can instantiate and compare objects out of the box:

```python
# Automatically generated __init__ method, supports positional or keyword arguments
k1 = Knight("西门吹雪", 100, "一剑西来")
k2 = Knight("西门吹雪", 100, "一剑西来")
k3 = Knight("叶孤城", 95, "天外飞仙")

# 1. Automatically generated __repr__ method, clear and beautiful output
print(k1)
# Output: Knight(name='西门吹雪', power=100, skill='一剑西来', state='生龙活虎')

# 2. Automatically generated __eq__ comparison method, compares by field values
print(k1 == k2)  # Output: True
print(k1 == k3)  # Output: False
```

### Why Should You Use Data Classes?

1. **Eliminates Boilerplate**: Automates initialization, serialization, and equality check definitions.
2. **Field Defaults**: Allows setting default values directly in annotations (e.g., `state: str = "生龙活虎"`).
3. **Immutable Models**: Specify `@dataclass(frozen=True)` to make instance attributes read-only. Frozen data classes are hashable, meaning instances can be used as dictionary keys or set elements.
4. **Tooling Integration**: Leveraging type hints makes data classes compatible with static type checkers (like mypy) and IDE autocomplete systems.

For classes that act primarily as data containers, `@dataclass` is the modern Python standard.
