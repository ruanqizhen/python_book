# Multiple Inheritance

## Basic Usage

Python support for multiple inheritance allows a class to inherit from more than one parent class. To define a subclass that inherits from multiple base classes, list the parent classes in order inside the parentheses:

```python
class A(B, C):
    pass
```

In this code, class `A` inherits all attributes and methods from both `B` and `C`. Let's look at a more concrete example:

Suppose you run a furniture store that sells tables and chairs. We want to write a program to model these items. We could design the system like this:

First, we define a base `Furniture` class containing properties common to all inventory—such as ID, cost, tax rate, and material, alongside an `assemble()` method. Next, we create `Table` and `Chair` subclasses that inherit from `Furniture`. These subclasses automatically gain all properties of the base class. We then add specialized behaviors: the `Table` class gets a `lay_tablecloth()` method, and the `Chair` class gets an `add_pillow()` method. Later, we can derive more specific subclasses like `DiningTable` or `OfficeDesk` from `Table`. Every physical item in the store is instantiated from one of these subclasses.

Now, suppose the store introduces a hybrid piece of furniture that functions as both a table and a chair, as shown in the illustration:

![images/007.png](images/007.png "Table-Chair Combo")

We can represent this table-chair combo using multiple inheritance. The combo class should inherit from both the `Table` and `Chair` classes, acquiring the traits of both parent classes:

```python
# Base class
class Furniture:
    def __init__(self, material, furniture_id, cost):
        self.material = material
        self.id = furniture_id
        self.cost = cost

    def description(self):
        return f"Furniture ID: {self.id}, Main material: {self.material}, Cost: ${self.cost}."

    def assemble(self):
        print(f"Furniture {self.id} has been assembled.")

# Subclass
class Chair(Furniture):
    def __init__(self, material, furniture_id, cost):
        super().__init__(material, furniture_id, cost)

    def set_number_of_legs(self, number_of_legs):
        self.number_of_legs = number_of_legs
        
    def description(self):
        return super().description() + f"It has {self.number_of_legs} legs."

    def add_pillow(self):
        print(f"A pillow has been installed on chair {self.id}.")

# Another subclass
class Table(Furniture):
    def __init__(self, material, furniture_id, cost):
        super().__init__(material, furniture_id, cost)

    def set_shape(self, shape):
        self.shape = shape
        
    def description(self):
        return super().description() + f"Table shape: {self.shape}."

    def lay_tablecloth(self):
        print(f"A tablecloth has been laid on table {self.id}.")

# Multiple inheritance, inheriting from both Chair and Table
class ChairWithTableAttached(Chair, Table):
    def __init__(self, material, furniture_id, cost):
        super().__init__(material, furniture_id, cost) 

    # Override the description method
    def description(self):
        # Below, we directly call the parent class methods using the class name.
        # We cannot use the super() function here because we need to use multiple
        # parent classes, and super() can only return one of them.
        chair_desc = Chair.description(self)  
        table_desc = Table.description(self)  
        return f"Chair part: {chair_desc}  Table part: {table_desc}"

# Example
item = ChairWithTableAttached("solid wood", 101, 150.00)
item.set_number_of_legs(4)
item.set_shape("round")

print(item.description())
item.assemble()
item.add_pillow()
item.lay_tablecloth()
```

Consider these questions:
1. In the `__init__` constructor of `ChairWithTableAttached`, which class does `super()` resolve to? `Chair` or `Table`?
2. In the constructor of `Chair`, what does `super()` resolve to? The intuitive answer might be: "Since `Chair` inherits only from `Furniture`, its `super()` must resolve to `Furniture`." Interestingly, as we will see, this is not always true. We will return to these questions at the end of this section.

## Problems with Multiple Inheritance

While multiple inheritance appears straightforward, it introduces several classical architectural dilemmas when classes share identical attribute or method names (known as name clashes). For our table-chair combo, resolving these clashes depends on the semantics of the shared traits:

* **Preserving separate versions**: For example, if both `Table` and `Chair` have a `material` attribute, our combo might be composed of a plastic chair attached to a steel table. We would want to preserve both distinct values.
* **Merging into a single version**: For example, if both `Table` and `Chair` declare a `cost` attribute, the combo itself is sold as a single unit and should have a single, unified price.
* **The Diamond Problem**: Since both `Table` and `Chair` inherit from `Furniture`, they form a diamond-shaped inheritance tree. If an inventory program treats the combo as a generic `Furniture` object and queries its `material`, which execution path should the program take? Should it fall back to the base `Furniture` defaults, or resolve to one of the subclasses?

Different languages adopt different strategies to resolve these ambiguities. C++, which supported multiple inheritance early on, suffered from highly complex resolution rules that often led to hard-to-debug behaviors. Because of these challenges, C++ developers are generally advised to avoid multiple inheritance unless absolutely necessary. Many modern object-oriented languages (such as Java and C#) learned from this and explicitly banned multiple inheritance for classes.

In languages that prohibit multiple inheritance, **interfaces** are used instead to allow a class to take on multiple roles. While class inheritance is about borrowing *implementation* (code reuse), interfaces represent *behavioral contracts* (guaranteeing that a class provides specific methods). For example, if a `TableChairCombo` class inherits from `Table`, it is physically subclassing `Table` and reusing its code. If it implements a `ChairInterface`, it simply promises to provide the methods expected of a chair, writing the actual implementation itself.

Interfaces allow a class to support multiple functional behaviors without the risk of tightly coupled, diamond-shaped inheritance graphs. However, interfaces do not support automatic code reuse out of the box: they only specify which methods must exist, leaving the actual code to be written repeatedly inside each implementing class.

## Abstract Classes

Python does not provide a native `interface` keyword, but it implements equivalent functionality using **abstract classes**.

An **abstract method** is a method declared in a base class that has no implementation; it serves as a contract that subclasses must implement. A class containing one or more abstract methods cannot be instantiated directly, as it is incomplete. Such a class is called an **abstract class** (or **abstract base class**).

In our furniture system, we should not be able to instantiate a generic `Furniture` object; any piece of inventory must be a specific type of furniture (like a chair or a table). If a developer tries to instantiate `Furniture` directly, it is likely a design error. Therefore, `Furniture` is a perfect candidate for an abstract class.

We can separate abstract contracts from concrete implementations. We use `AbstractTable` to define what behaviors a table must support, while concrete classes like `Table` provide the actual code.

In Python, we declare abstract methods using the `@abstractmethod` decorator, and define abstract base classes by inheriting from the built-in `abc.ABC` class. Here is our furniture store program refactored using abstract classes:

```python
from abc import ABC, abstractmethod

# Abstract class Furniture, defines the attributes and methods that all furniture must have
class Furniture(ABC):
    
    @abstractmethod
    def set_material(self, material):
        pass
    
    @abstractmethod
    def assemble(self):
        pass

# Abstract class AbstractTable, defines the attributes and methods a table must have
class AbstractTable(Furniture):
    
    @abstractmethod
    def place_tablecloth(self):
        pass

# Abstract class AbstractChair, defines the attributes and methods a chair must have
class AbstractChair(Furniture):
    
    @abstractmethod
    def place_pillow(self):
        pass
    
# Concrete class Table, implements the attributes and methods defined by AbstractTable
class Table(AbstractTable):
    
    def set_material(self, material):
        self.material = material
        print(f"Setting table material: {self.material}.")

    def assemble(self):
        print("The table has been assembled!")

    def place_tablecloth(self):
        print("A tablecloth has been laid on the table.")

# Concrete class Chair, implements the attributes and methods defined by AbstractChair
class Chair(AbstractChair):

    def set_material(self, material):
        self.material = material
        print(f"Setting chair material: {self.material}.")

    def assemble(self):
        print("The chair has been assembled!")

    def place_pillow(self):
        print("A pillow has been placed on the chair.")
    
# Concrete class ChairWithTableAttached, implements all the attributes and methods of a table or chair
class ChairWithTableAttached(AbstractTable, AbstractChair):

    def set_material(self, material):
        self.material = material
        print(f"Setting combo furniture material: {self.material}.")

    def assemble(self):
        print("The table-chair combo has been assembled!")

    def place_tablecloth(self):
        print("A tablecloth has been laid on the table-chair combo.")

    def place_pillow(self):
        print("A pillow has been placed on the table-chair combo.")

# Usage examples
table = Table()
table.set_material("glass")
table.assemble()
table.place_tablecloth()

chair = Chair()
chair.set_material("wood")
chair.assemble()
chair.place_pillow()

combo = ChairWithTableAttached()
combo.set_material("plastic")
combo.assemble()
combo.place_tablecloth()
combo.place_pillow()
```

## MixIn

While abstract base classes establish contracts, they do not resolve duplicate implementation details. In the refactored code above, the `set_material()` method has identical implementations across all three concrete classes, yet we had to write the code repeatedly.

Fortunately, Python's dynamic nature and reliance on **duck typing** make multiple inheritance far cleaner than in static languages. Because Python prioritizes an object's runtime behavior over its explicit type declaration, whether a table-chair combo inherits directly from a `Table` class or a `TableInterface` is architecturally irrelevant. What matters is that the combo object implements the expected methods.

Instead of designing rigid hierarchical trees (e.g., trying to decide if a combo is a subclass of `Table` or `Chair`), Python developers use multiple inheritance for composing capabilities. This approach is implemented via **Mixins**.

A **Mixin** is a lightweight, specialized class designed to bundle reusable methods and inject them into other classes. A Mixin is not intended for standalone instantiation and typically does not declare its own constructor. By subclassing one or more Mixins, a concrete class can inherit specific, pre-written behaviors.

We can use Mixins to refactor our furniture program, breaking capabilities into independent components:

```python
# Define MixIns
class MaterialMixin:
    material = "unknown material"
    
    def set_material(self, material):
        self.material = material
        print(f"Material set to: {self.material}")


class AssemblyMixin:
    def assemble(self):
        print("Furniture has been assembled!")


class PillowPlacementMixin:
    def place_pillow(self):
        print("A pillow has been placed on the chair.")


class TableclothMixin:
    def place_tablecloth(self):
        print("A tablecloth has been laid on the table.")


# Use MixIns to refactor the original classes
class Furniture(MaterialMixin, AssemblyMixin):
    def __init__(self, id, cost, **kwargs):
        # Pass **kwargs to the next class, ensuring other classes in the MRO chain (including object) work correctly
        super().__init__(**kwargs) 
        self.id = id
        self.cost = cost


class Chair(PillowPlacementMixin, Furniture):
    def __init__(self, id, cost, number_of_legs=4):
        # Note: This requires cooperative inheritance (mentioned below) to work perfectly
        super().__init__(id, cost)
        self.number_of_legs = number_of_legs


class Table(TableclothMixin, Furniture):
    def __init__(self, id, cost, shape="round"):
        super().__init__(id, cost)
        self.shape = shape


class ChairWithTableAttached(Furniture, PillowPlacementMixin, TableclothMixin):
    def __init__(self, id, cost, number_of_legs=4, shape="round"):
        super().__init__(id, cost)
        self.number_of_legs = number_of_legs
        self.shape = shape


# Usage examples
combo = ChairWithTableAttached("101", 150.00, 4, "round")
combo.set_material("solid wood")
combo.assemble()
combo.place_pillow()
combo.place_tablecloth()
```

In Python best practices, Mixin classes are listed first in the class inheritance declaration. Because Mixins are designed to extend or override default behaviors, they must precede base classes. If a Mixin were listed after a base class like `Furniture` that already implements a method with the same name (e.g., `save()`), the base class method would shadow the Mixin's method, rendering the Mixin useless.

### Method Resolution Order (MRO)

When an attribute or method is queried on an object, Python searches the object's class first, then traverses its parent classes in a deterministic sequence. This lookup path is called the **Method Resolution Order (MRO)**.

For our `ChairWithTableAttached` class, the MRO chain resolves as follows: `ChairWithTableAttached` -> `Furniture` -> `MaterialMixin` -> `AssemblyMixin` -> `PillowPlacementMixin` -> `TableclothMixin` -> `object`.

Python 3 computes this chain using the **C3 Linearization** algorithm. The algorithm guarantees three core properties:
1. **Subclasses before superclasses**: A class is always searched before its parents.
2. **Left-to-right order**: Parent classes are searched in the order they are declared in the class definition.
3. **Monotonicity**: If class $X$ precedes class $Y$ in one MRO chain, it must precede $Y$ in all MRO chains across the codebase.

Conceptually, C3 linearization performs a left-to-right, depth-first search, but delays common ancestors (diamond inheritance bases) until all of their subclasses have been searched first.

We can view the exact order by using `print(ClassName.mro())`:

```python
print(ChairWithTableAttached.mro())
```

Earlier, we asked a question: which class does the super() function in the constructors of ChairWithTableAttached, Chair, and other classes return? Let's simplify a few classes and run the program below to see which class each constructor's super() returns:

```python
class Base:
    def method(self, child):
        print(f"{child}'s super is Base")

class ChildA(Base):
    def method(self, child):
        super().method("ChildA")
        print(f"{child}'s super is ChildA")

class ChildB(Base):
    def method(self, child):
        super().method("ChildB")
        print(f"{child}'s super is ChildB")

class GrandChild(ChildA, ChildB):
    def method(self, child):
        super().method("GrandChild")
        print(f"GrandChild is called")

gc = GrandChild()
gc.method(None)  # Calls methods according to MRO
```

Running the program above produces the following result:

```
ChildB's super is Base
ChildA's super is ChildB
GrandChild's super is ChildA
GrandChild is called
```

We can see that "ChildA's super is ChildB". The super() function does not directly return the parent class; it returns a proxy object that delegates method calls to the next class in the MRO order after the current class.
