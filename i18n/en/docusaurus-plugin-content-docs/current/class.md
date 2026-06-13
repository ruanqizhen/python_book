# Classes

## Encapsulation

### Creating a Class

In Python, you can use the `class` keyword to create a class. A class contains the attributes (instance variables) and methods (functions) of objects. For example, we can create an "Animal" class as an introductory example of object-oriented programming. We will start with a basic definition and gradually add details.

```python
class Animal:
    pass
```

The `class` keyword is immediately followed by the class name. We named the animal class `Animal`, and class names are typically words that start with an uppercase letter. Sometimes, a class name is followed by parentheses containing the parent class of the newly defined class; we will demonstrate how to specify a parent class later. If no parent class is specified, it defaults to inheriting from Python's predefined `object` class. In a Python program, all classes are descendants of the `object` class.

### Objects of a Class

Using a class directly in a program is relatively rare. In most cases, we create one or several objects for a class and then access the object's attributes or methods. Writing the name of the class followed by parentheses generates a new object of that class. If a new object is generated on the right side of a variable assignment expression, the variable can point to this newly generated object:

```
dog = Animal()
```

### Attributes

In Python, there is a distinction between "class attributes" and "instance attributes". In most other languages, these two are not distinguished.

Adding some variables to a class makes them class attributes. For example, we can add an attribute `total_animals` to the class to keep track of the total number of animals created:

```python
class Animal:
    total_animals = 0  # Class variable, tracking the number of animals created

dog = Animal()
print(Animal.total_animals)   # Output: 0, accessing directly via the class name
print(dog.total_animals)      # Output: 0, can also be accessed via the instance
```

When accessing a class attribute, add a dot `.` after the class name followed by the attribute name. If the object of the class does not have an attribute with the same name, reading this attribute through the object will automatically return the value of the corresponding class attribute. For example, in the example above, `dog.total_animals` — the `dog` object does not have a `total_animals` attribute, but it returns the value of the corresponding attribute of the `Animal` class.

Instance attributes can be added via variable assignment statements. For example, add an attribute named `age` to the newly generated `dog` object:

```python
class Animal:
    name = '旺财'

dog = Animal()
dog.age = 3
print(dog.age)   # Output: 3
```

`dog.age` represents the attribute named `age` of the `dog` object.

In Python, methods are callable objects bound to an object or class, and can be called via attribute access. This will be explained further in [Dynamic Attribute Access on Objects](objects#dynamic-attribute-access).

### Initialization Method

The "initialization method (`__init__`)" is used to initialize the state of an object. Although in many other languages (such as Java/C++) similar functions are called "constructors," in Python, strictly speaking, `__new__` is the constructor responsible for creating instances, while `__init__` is only responsible for configuring the instance after creation. However, in everyday conversation, people often refer to `__init__` as the constructor. [The `__new__` method will be introduced in detail later](objects#__new__-method). Here, we mainly discuss the `__init__` method.

Setting attribute values for an object after its creation is not good programming practice. It is better to set all initial attribute values at the time of object creation. We can use the class's initialization method to achieve this. The class's initialization function `__init__` is a special method that is automatically called when a new instance of the class is created. Later, we will also introduce other [special methods of classes](magic_methods) defined by Python, whose function names all start and end with double underscores. The first parameter of the `__init__` method must be `self`. `self` is a parameter that refers to the instance itself and must also be the first parameter of every object method in the class. When calling an object's method, Python automatically passes the reference to the current object as `self`.

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

In the program above, the `__init__` initialization function of the `Animal` class has two parameters besides `self`: `name` and `species`, representing the animal's name and breed respectively. With the initialization function, we can pass the necessary parameters to the class when creating objects. For example, `Animal("旺财", "狗")` creates an animal instance named Wangcai and of breed dog. In the initialization method, it creates two object attribute values by assigning to `self.name` and `self.species`.

In many programming languages, you can create multiple initialization methods for a class with different parameters. However, in Python, each class typically defines one `__init__` method to initialize instances, but multiple initialization approaches can be achieved through parameter design. You can also use [factory methods](class#factory-methods) to create class instances with different parameters.

### Same-name Variables (Attributes)

It is possible to have class attributes and instance attributes with the same name in a class. However, if there are duplicate names, you can no longer access the class attribute through the object:

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

When calling class attributes, it is recommended to use the class name to avoid accidentally modifying class attributes or confusing them with instance attributes. Especially in some cases, it is not easy to distinguish which attribute is being accessed through the object. For example:

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

In the initialization method of the program above, several attributes are set using `self`. But are they creating new instance attributes, or modifying class attributes through the object?

The example above demonstrates a classic pitfall:
- `internal_a`: The `+` operator is used. This creates a new list and assigns it to `self.internal_a`. At this point, the instance gains a new instance attribute and no longer references the class attribute.
- `internal_b`: The `+=` operator is used. For mutable objects like lists, the `+=` operator actually calls the `extend` method (i.e., in-place modification). It does not create a new list object, so all instances still share the same class attribute list. In contrast, when `+` is used for `internal_a`, a completely new list object is created and assigned to the instance attribute, thus breaking the connection with the class attribute.
- `internal_c`: `append` is a list method, which obviously modifies the original list (the class attribute).

To avoid such confusing operations, in [class methods](#class-methods), you can use `cls` to call class attributes; in other cases, you should use the class name to call class attributes. For example, the following syntax is much clearer:

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

The following example also demonstrates that without prefixing attributes with the class name, it is very easy to confuse which variable is being used:

```python
a = 1
class MyCounter:
    a = 8
    b = [a]                      # Here, the class attribute a is used
    c = [a for i in range(2)]    # Here, the global variable a is used
    
print(MyCounter.b)   # Output: [8]
print(MyCounter.c)   # Output: [1, 1]      
```

Note: In Python 3, list comprehensions inside a class body have their own independent scope and cannot directly access other attributes defined in the class body (such as `a=8` above). Therefore, the `a` in the list comprehension skips the class scope and directly looks up the global variable. This is a common advanced pitfall.

### Instance Methods

Instance methods (referred to simply as "methods") are functions that belong to an object. They are defined in a class and can be called on objects of that class. Methods are used to implement behaviors or operations of an object. For example, an animal can eat and make sounds, so we can add an `eat()` method and a `speak()` method to the `Animal` object:

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

Methods are bound to objects, meaning that a method can access the attributes and other methods of the object it is bound to, and can also modify the bound object's data. However, it cannot directly access data of other objects. When defining an instance method, the first parameter must be `self`, which represents the object itself. Through `self`, the method can access and modify the object's attributes and call other methods.

### Class Methods

Similar to attributes, in addition to instance methods, there are also class methods.

Class methods are methods bound to the class rather than to its objects. The first parameter of a class method typically refers to the class itself and is conventionally named `cls`. This differs from instance methods, whose first parameter is `self`. Class methods are useful when we want a method to be related to the state of the class rather than the state of any specific object, or when the method does not need to access any instance-specific attributes or methods but still needs to know about some class attributes.

For example, suppose we need to count how many animals have been created in total. This data has nothing to do with any specific animal instance; it is only relevant to the `Animal` class itself. So we can define a class method `get_total_animals()` to return the data we need.

Class methods are declared using the `@classmethod` [decorator](decorator), which means adding the line `@classmethod` above the function definition of `get_total_animals()`. Inside the class method, use `cls` to access the class's data. Outside the class method, use the class name directly to access the class's data:

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

In the program above, each time `__init__()` is called—i.e., each time a new instance is created—the value of the variable `total_animals` is incremented by 1. Thus, we can count how many animals there are in total.

It is important to note that, unlike attributes, a class cannot have class methods and instance methods with the same name. If two functions are defined with the same name, the later definition will override the earlier one.

In most other mainstream languages, concepts like class methods and class attributes do not exist; all their methods are for objects. However, in the Python language, [everything is an object](objects): data is an object; functions are objects; the class itself is also an object, even though it can generate other objects. Therefore, as a kind of object, the class itself can have its own attributes and methods.

#### Factory Methods

A typical application of class methods is factory methods. A factory method is a function used to create objects. It can be more complex than an initialization method and is typically used for creating objects with a certain degree of complexity, especially when object creation depends on dynamic conditions or involves complex initialization processes. A complex factory function can create objects of multiple different classes. Here, we use a simple example for demonstration, which can generate an `Animal` object but with parameters different from the `Animal` initialization method:

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

If the implementation of a function does not need to access any instance or class attributes, a static method should be used. Functionally, there is no difference if a static method is placed outside the class as a regular function. Placing it inside the class is primarily for encapsulation purposes—related methods and data should be organized together.

Static methods are declared using the `@staticmethod` decorator. Their usage is the same as class methods. For example, we can add a static method to the `Animal` class to determine whether an animal is healthy based on its sound. It does not need to use any class or instance attributes and only makes a judgment based on the input sound:

```python
class Animal:
    @staticmethod
    def is_healthy(sound):
        return sound != "silent"


# Using the static method
sound = "barking"
print(Animal.is_healthy(sound))  # Output: True
```

Static methods are very suitable for storing common utility functions, frequently used helper functions, and auxiliary functions. This allows these functions to be called by other code without needing to create an object. For example, the following example sets a function for calculating the distance between two points as a static utility function:

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

A class (subclass) can inherit the attributes and methods of another class (parent class or base class). This mechanism allows the subclass to directly utilize the functionality of the parent class and extend it. Below is an example with an `Animal` class and a `Dog` class that inherits from the `Animal` class:

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
        
In the program above, `Animal` is a base class with a `species` attribute and a `speak` method. The `Dog` class specifies `Animal` in parentheses during its definition to indicate that it inherits from the `Animal` class. The subclass `Dog` immediately possesses all the attributes and methods of the parent class `Animal`. If the subclass does not override these attributes and methods, the program will automatically use the parent class's attributes and methods for instances of the subclass. If the subclass overrides these attributes and methods—i.e., defines attributes and methods with the same name—the program will use the redefined attributes and methods for instances of the subclass.

In this example, the `Dog` class overrides the parent class's constructor method and `speak` method. In overridden methods of a subclass, the `super()` function can be used to call methods from the parent class. It is often used in the subclass's initialization method to call the parent class's initialization method. For example, in the `Dog`'s constructor, we use `super().__init__(species="狗")` to call the initialization method of the `Animal` class.

When we need to use a method defined in the parent class from a subclass, we should use `super()` rather than directly calling the parent class method by its name. Directly using the parent class name to call a method hard-codes the subclass's dependency on the parent class into the code; if the inheritance relationship changes in the future, modifications may need to be made in multiple places. Using `super()` avoids this situation and makes the code easier to maintain. Additionally, in cases of [multiple inheritance](multiple_inheritance), `super()` correctly calls the corresponding parent class methods in order, whereas calling them ourselves might result in using the wrong parent class. Furthermore, `super()` makes method calls more consistent and easier to read.

Subclasses can also define entirely new methods. For example, the `Dog` class defines a new method `wag_tail`.

The following code demonstrates the two classes above:

```python
dog = Dog(name="旺财", breed="金毛猎犬")
dog.speak()     # Output: I am a Golden Retriever named Wangcai. I can bark.
dog.wag_tail()  # Output: Wangcai is wagging its tail.

cat = Animal(species="猫")
cat.speak()     # Output: I am a cat
```

Class inheritance provides us with an effective way to organize and reuse code, while also leveraging polymorphism to improve code flexibility.

### Checking Inheritance Relationships

The `issubclass` function is used to check whether a class is a descendant of another class. `issubclass` accepts two parameters. If the class of the first parameter is a descendant of the class (or any class in a tuple of classes) of the second parameter, `issubclass` returns `True`. Otherwise, it returns `False`. For example:

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

The `isinstance` function is used to check whether an object is an instance of a class, or an instance of a class within an inheritance hierarchy. `isinstance` accepts two parameters. If the object of the first parameter is an instance of the class (or any class in a tuple of classes) of the second parameter, `isinstance` returns `True`. Otherwise, it returns `False`.

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

Readers with Java or C++ experience should already be familiar with the concept of polymorphism. However, Python's implementation of polymorphism differs from classic object-oriented programming languages like Java. Polymorphism in Java is implemented based on class or interface inheritance, where methods of a parent class can have different implementations in different subclasses. But Python's polymorphism is implemented based on "duck typing."

"Duck typing" is a programming term that comes from the saying: "If a bird walks like a duck, swims like a duck, and quacks like a duck, then it is a duck." In Python, duck typing means that the type or category of an object is determined by its behavior (i.e., the methods it possesses), rather than by the parent class it inherits from or its own type. Compared to polymorphism based on inheritance, duck typing focuses on the methods implemented in an object, not the object's type. It improves code flexibility and reusability, allowing developers to focus more on functionality and behavior rather than form.

The following code demonstrates duck typing:

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

In the code above, we don't care about the specific type of `animal`; we only care whether it has a `speak` method. This is the embodiment of duck typing. When the `speak` method of different animals is called, their behaviors differ—objects of different classes produce different sounds. This is the embodiment of polymorphism.
Python can employ duck typing because it is a dynamically typed language; it does not enforce type checking on variables or parameters at runtime, so we can pass objects of any type to a function. In statically typed languages like Java, it is impossible to pass any object to a function; the input must be restricted to objects of a specific class and its descendants.

Generally, when we refer to polymorphism, we mean instance methods. Most mainstream programming languages only have instance methods, but Python also has class methods, and class methods also support polymorphism. For example:

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

This example is very similar to the previous one, except that the `speak` method has been changed to a class method.

## Access Restrictions

Most object-oriented programming languages (C++, Java, etc.) allow class variables to be set as private for data security, meaning they cannot be accessed outside the class. For example, Java uses the `private` keyword to restrict member variables and functions. However, Python does not have such a mechanism; all data and methods within a class are public.

### Naming Conventions

Although we cannot prevent data and methods from being accessed, we can still use some naming conventions to remind others that certain variables and functions should be private and should not be forcibly accessed. The most common method is to prefix a variable or function name with a single underscore. This indicates that they should not be accessed outside the class. Although this is only a naming convention rather than enforced access control, in most cases, the reminder is sufficient. For example:

```python
class MyClass:
    def __init__(self):
        self._protected_variable = "Protected"
    
    def _protected_method(self):
        return "这是一个受保护方法"
```

**Double Underscore (Name Mangling)** — If a variable name starts with a double underscore (e.g., `__private_variable`), Python performs "name mangling," renaming it to `_ClassName__VariableName`. The original intention here is not true "privatization" (because you can still access it through the mangled name), but to prevent subclasses from accidentally overriding the parent class's internal variables with the same name during inheritance. However, this does make it more difficult to access from outside. For example:

```python
class MyClass:
    def __init__(self):
        self.__private_variable = "Private"
    
    def __private_method(self):
        return "这是一个私有方法"
```

In the code above, `__private_variable` and `__private_method` are internally mangled to `_MyClass__private_variable` and `_MyClass__private_method` respectively. This mangling is automatic, so directly accessing `__private_variable` from outside the class will result in an attribute error.

In summary, Python relies on naming conventions and developer self-discipline to control access permissions.

### Hiding Data

Attributes in Python classes are not particularly secure; they cannot control access permissions or restrict value ranges. One solution is to treat all attributes as private—do not read or write attributes directly, but instead access class data indirectly through methods. Methods can implement more complex functionality, such as adding value range checks. This allows for implementing more complex logic to ensure data security and correctness. For example, to get an animal's name, we can define a function in the class responsible for retrieving the `name` data. When you need to get the `name` attribute of an instance, you should call this function rather than accessing the attribute directly:

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

Python already has some built-in tools to help write data access methods, namely property decorators.

### Property Decorators

Using class methods is slightly more cumbersome than directly accessing class attributes: some methods are for reading data, some are for writing data, and if naming is inconsistent, it becomes even less convenient. To solve this problem, Python has a built-in decorator called `@property`, specifically used to convert class methods into attributes of the same name. `@property` is often used together with setter and deleter decorators to control the read, set, and delete behavior of attributes. This allows developers to insert custom logic when accessing, setting, and deleting attributes, providing better encapsulation and data validation.

Below is a simple example of a `Circle` class that uses `@property` and other decorators to manage the circle's radius and area:

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

In the example above, `radius` is a method decorated with `@property`, so it can be accessed like a regular attribute. `@radius.setter` is a setter; the method it decorates is responsible for setting the value of the `radius` attribute. In the example, before setting the circle's radius, the input data is validated to ensure the radius is not negative. The method decorated with `@radius.deleter` is called when the attribute is deleted. In the example, we used it to prevent the deletion of the radius, because a circle must have a radius attribute.

The `@property` decorator itself can only decorate the read behavior of an attribute. Therefore, `area`, which is only decorated with `@property`, is a read-only attribute—it has a getter defined but no setter defined.

By using `@property`, we can ensure that the state of the `Circle` class remains consistent, while simplifying the calling code. On the planet Pythora, property decorators are generally used to implement attributes within classes.

## Data Classes (@dataclass)

In object-oriented programming, we often create simple classes that are only used to "hold data." For example, we want to store information about a knight on the planet Pythora, including their name, inner power, and unique skill:

```python
class Knight:
    def __init__(self, name: str, power: int, skill: str):
        self.name = name
        self.power = power
        self.skill = skill
```

This looks simple, but if you want instances of this class to be conveniently printable, or to be directly comparable (e.g., when all data fields of two knights are exactly the same, `==` should return `True`), you must manually implement the `__repr__` and `__eq__` methods:

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

For a class with only three fields, we have to write a large amount of repetitive "boilerplate code." When the class has many fields, this becomes extremely tedious and error-prone.

To solve this problem, Python 3.7 introduced **Data Classes**. By using the `@dataclass` decorator from the `dataclasses` module, Python can automatically generate a series of commonly used methods such as `__init__`, `__repr__`, and `__eq__` for us.

### Elegant Modern Syntax

Let's rewrite the knight class above using `@dataclass`:

```python
from dataclasses import dataclass

@dataclass
class Knight:
    name: str
    power: int
    skill: str
    state: str = "生龙活虎"  # Supports setting default values
```

It's that simple! We only need to use **type hints** to declare the attributes within the class body, and `@dataclass` silently handles all the heavy lifting behind the scenes.

Let's test its functionality:

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

1. **Zero Boilerplate Code**: Significantly reduces meaningless attribute assignments and special method writing, making the code extremely clear.
2. **Supports Default Values**: You can directly specify default values when declaring attributes, such as `state: str = "生龙活虎"` above. Note that attributes with default values must be defined after attributes without default values.
3. **Supports Immutable Data Classes**: Simply pass the parameter `@dataclass(frozen=True)` in the decorator to declare the data class as read-only (immutable). In this case, any attempt to modify its attributes will raise a `FrozenInstanceError` exception, and such immutable data classes are **hashable**, meaning they can be directly used as dictionary keys or set elements.
4. **Robust Type Hint Integration**: Data classes mandate declaring type hints, fully aligning with modern Python (Python 3.9+) standards, and integrate seamlessly with IDE autocompletion and static type checkers (such as mypy).

When writing classes primarily used to carry and manage data, `@dataclass` is the absolute first choice for modern Python programmers.
