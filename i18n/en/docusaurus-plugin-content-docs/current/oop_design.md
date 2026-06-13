# Design Methods and Principles

In the previous sections, we discussed object-oriented programming primarily from an implementation perspective: assuming we already know what classes we need, how do we write the code for them? Now, we need to shift our perspective and consider how to design object-oriented programs: for a given problem, which classes should be created, and how should they relate to one another?

Object-oriented programming is fundamentally designed for large-scale applications. Many of its concepts are not suited for small programs. Object-oriented design must plan for smooth software upgrades and easy future extensions—considerations that amount to over-engineering for small scripts. Many small programs are discarded after a single use, with no maintenance or upgrade concerns. Even if new requirements arise, modifying them is trivial, and rewriting them from scratch is often painless. Spending too much time on object-oriented design for a simple script is indeed not worthwhile.

For large-scale applications, however, the situation is entirely different. Large software systems represent enormous development costs, meaning they cannot be easily discarded. When new requirements arise, building a replacement system from scratch is rarely viable; the rational choice is almost always to maintain and extend the existing system. Therefore, when designing large programs, we must anticipate that they will inevitably grow and change. For example, when designing a pet store system, we should plan for the future addition of new animal species, each with unique attributes and behaviors. When designing a student report system, we need to consider that report content may expand to include new subjects; report formats might shift to PDF or web pages; and delivery methods may evolve from printing to emailing. Similarly, when designing an automated testing system, we must account for new test items, new products, and new testing instruments.

If we fail to plan for these extensions during the design phase, implementing them later becomes extremely difficult. The purpose of object-oriented programming is to build a system that is easy to maintain and extend. To reiterate our definition: we want to create a system that is both flexible and stable—where flexibility means we can add new features at any time, and stability means we do not need to modify existing, working classes. But how do we add new functionality without modifying existing code?

We have already explored the three core pillars of object-oriented programming: [encapsulation](class#encapsulation), [inheritance](class#inheritance), and [polymorphism](class#polymorphism). When designing systems, these three features remain your primary tools. That is, you must decide what attributes and methods a class should possess, and how classes should inherit behaviors from one another. In this chapter, we will shift our focus to other essential design concepts and relationships, such as dependency, composition, and aggregation.

Additionally, we will examine the SOLID principles—a set of five design guidelines popularized by computer scientist Robert C. Martin. These principles represent industry best practices for designing maintainable and extendable object-oriented software:

- S - Single Responsibility Principle (SRP)
- O - Open/Closed Principle (OCP)
- L - Liskov Substitution Principle (LSP)
- I - Interface Segregation Principle (ISP)
- D - Dependency Inversion Principle (DIP)

These five principles are fundamental to robust software design. Although their names are arranged to spell the acronym 'SOLID', we will present them in a more logical learning order, starting with the most foundational concepts first.


## Abstraction

Abstraction involves identifying common characteristics across different classes and extracting them into a general, high-level model. In Python, this model is represented as an abstract class. An abstract class defines common attributes and method interfaces without specifying their concrete implementations. By hiding unnecessary implementation details and exposing only what is critical, abstraction simplifies system design and reduces complexity. Moreover, sharing attributes and behaviors in a parent class prevents code duplication, making it easy to create specialized concrete subclasses.

For example, in a pet store system, we might have multiple animal types like cats and dogs. While they differ in many ways, they share core behaviors: every animal has a name, eats food, and makes a sound. We can capture these shared traits in an [abstract class](multiple_inheritance#abstract-classes) called `Animal`:

```python
from abc import ABC, abstractmethod

class Animal(ABC):
    def __init__(self, name):
        self.name = name

    @abstractmethod
    def eat(self):
        pass

    @abstractmethod
    def speak(self):
        pass
```

In this `Animal` class, we define a common `name` attribute and two abstract methods, `eat` and `speak`. Because these methods have no concrete implementation, they serve as placeholders that subclasses must define.

We can then define concrete subclasses based on this abstract `Animal` class:

```python
class Dog(Animal):
    def speak(self):
        return "Woof!"

    def eat(self):
        print("The dog is eating a bone")

class Cat(Animal):
    def speak(self):
        return "Meow!"

    def eat(self):
        print("The cat is eating fish")
```

Each concrete class inherits from `Animal` and provides its own implementation of the abstract methods. With this design, we can easily add new animal species to our pet store without re-defining common traits from scratch.

## Liskov Substitution Principle

The Liskov Substitution Principle (LSP) states that subclasses must be substitutable for their parent classes without altering the correctness of the program. In other words, if a program works with a base class, it should function correctly when replaced by any subclass of that base class.

We will use the classic `Rectangle` and `Square` example to illustrate how to apply—and how to accidentally violate—this principle.

Mathematically, a square is a special type of rectangle. Therefore, it is intuitive to implement a `Square` subclass that inherits from a `Rectangle` parent class:

```python
class Rectangle:
    def __init__(self, width, height):
        self._width = width
        self._height = height

    @property
    def width(self):
        return self._width

    @width.setter
    def width(self, value):
        self._width = value

    @property
    def height(self):
        return self._height

    @height.setter
    def height(self, value):
        self._height = value

    def area(self):
        return self._width * self._height

class Square(Rectangle):
    def __init__(self, side):
        super().__init__(side, side)

    @Rectangle.width.setter
    def width(self, value):
        self._width = value
        self._height = value

    @Rectangle.height.setter
    def height(self, value):
        self._width = value
        self._height = value
```

In this design, the `Rectangle` class has two attributes, `width` and `height` (defined using property [decorators](class#property-decorators)), and a method to calculate `area()`. Since a square has equal sides, the `Square` subclass overrides the setters so that modifying one dimension automatically updates the other. While this reflects real-world geometry, it violates the Liskov Substitution Principle. 

If a function is written to work with a `Rectangle` instance (e.g., modifying its width and height independently and asserting that the area matches), substituting a `Square` instance will break the program's logic. This is because the subclass alters the behavioral contract established by the parent class (i.e., that width and height can be changed independently).

To follow LSP, we should redesign these classes so that `Square` does not inherit from `Rectangle`. Instead, both classes should inherit from a more general, abstract `Shape` class:

```python
from abc import ABC

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

class Square(Shape):
    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side * self.side
```

Now, `Square` and `Rectangle` are sibling classes under the common abstraction `Shape`. We no longer expect a `Square` to substitute for a `Rectangle`, resolving the LSP violation. 

This example highlights a key rule in object-oriented design: **programmatic relationships should be based on behavioral contracts, not real-world classifications**. Violating the Liskov Substitution Principle breaks polymorphism, reduces code reusability, and introduces subtle runtime bugs that increase testing and maintenance costs.

## Dependency Relationship

A dependency relationship is a loose coupling where one class temporarily uses an instance of another class inside its methods. If class `A` receives, creates, or manipulates objects of class `B` inside its methods, class `A` depends on class `B`. Unlike composition or aggregation, dependency does not imply ownership or shared lifecycles.

For example, consider a `Printer` class that prints documents, and a `Document` class containing the text. The `Printer` class depends on `Document` because its printing method requires a `Document` instance to run:

```python
class Document:
    def __init__(self, content):
        self.content = content

class Printer:
    def print_document(self, document):
        # Printer class depends on Document class, because this method uses a Document object
        print(document.content)

# Usage:
doc = Document("test document")
printer = Printer()
printer.print_document(doc)     # Output: "test document"
```

In this code, the `Printer` class uses the `Document` object as a parameter. `Printer` does not own the `Document` instance, and the lifecycle of the `Document` is entirely independent of the `Printer`. The relationship exists only during the method execution, making it a loose, temporary coupling.

## Dependency Inversion Principle

The Dependency Inversion Principle (DIP) states that high-level modules should not depend on low-level modules; both should depend on abstractions. Furthermore, abstractions should not depend on details; details should depend on abstractions.

In traditional procedural design, high-level business logic directly calls low-level utility modules, making high-level logic dependent on low-level details. The Dependency Inversion Principle 'inverts' this relationship by introducing an abstraction layer between them. Both high-level logic and low-level details depend on this shared abstraction.

DIP is the cornerstone of writing decoupled software. By preventing concrete classes from interacting directly and forcing them to communicate through abstract interfaces, you isolate components from changes. This keeps coupling low, making the codebase easier to test, maintain, and extend.

Consider a report generation service. In the following tightly coupled design, `ReportService` directly instantiates and depends on a concrete `PDFStudentReport` class:

```python
class PDFStudentReport:
    def generate(self):
        print("Generate PDF report")

class ReportService:
    def __init__(self):
        self.report = PDFStudentReport()

    def create_report(self):
        return self.report.generate()
```

The problem here is that `ReportService` is hardcoded to use `PDFStudentReport`. If we need to support web-format reports tomorrow, we have to modify the `ReportService` class. 

To apply DIP, we introduce an abstract `Report` parent class. Both `PDFStudentReport` and `WebStudentReport` will inherit from this abstraction, and `ReportService` will depend only on the abstract `Report` interface:

```python
from abc import ABC, abstractmethod

class Report(ABC):
    @abstractmethod
    def generate(self):
        pass

class PDFStudentReport(Report):
    def generate(self):
        print("Generate PDF report")

class WebStudentReport(Report):
    def generate(self):
        print("Generate Web report")

class ReportService:
    def __init__(self, report: Report):
        self.report = report

    def create_report(self):
        return self.report.generate()
```

Now, `ReportService` is completely decoupled from concrete report generators. We can inject any subclass of `Report` at runtime without modifying a single line of code in `ReportService`.

## Single Responsibility Principle

The Single Responsibility Principle (SRP) states that a class should have one, and only one, reason to change.

A 'reason to change' refers to a single responsibility. If a class is responsible for multiple tasks, changes to one requirement will force modifications in a class that also handles unrelated logic, potentially introducing bugs.

For example, consider a `Student` class that manages student data and also generates formatting for student reports:

```python
class Student:
    def __init__(self, name: str):
        self.name = name

    def get_student_data(self):
        # Read data from the database and convert to corresponding attributes
        pass

    def generate_report(self):
        # Print report
        pass
```

This violates SRP because `Student` handles both data management and presentation logic. If we change how we fetch student data, or if the report layout changes, we must modify the same class.

An SRP-compliant design separates these concerns into distinct classes:

```python
class Student:
    def __init__(self, name: str):
        self.name = name

    def get_data(self):
        # Read data from the database and convert to corresponding attributes
        pass


class StudentReport:
    def __init__(self, student: Student):
        self.student = student

    def generate_report(self):
        # Print report
        pass
```

By delegating presentation logic to `StudentReport`, we isolate the changes. If the database schema updates, we only edit `Student`. If the report layout changes, we only edit `StudentReport`.

SRP keeps classes small and focused. In team environments, it prevents developers from editing the same file for different reasons, reducing git conflicts. It also makes your directory structure cleaner, as each file has a single, well-defined purpose.

## Interface Segregation Principle

The Interface Segregation Principle (ISP) states that clients should not be forced to depend on interfaces they do not use. In Python, where we use abstract base classes as interfaces, this means we should design small, focused abstract classes rather than large, bloated ones. A class inheriting from an abstract class must implement all of its abstract methods. If the parent class is too broad, subclasses are forced to write dummy implementations for methods they do not need.

Let's illustrate this with our report service. Suppose we define a broad `StudentReport` abstract class that bundles report generation, emailing, and printing:

```python
from abc import ABC, abstractmethod

class StudentReport(ABC):
    @abstractmethod
    def generate(self):
        pass

    @abstractmethod
    def send_email(self):
        pass

    @abstractmethod
    def print_out(self):
        pass

class PDFStudentReport(StudentReport):
    def generate(self):
        print("Generate PDF report")

    def send_email(self):
        print("Send PDF report via email")

    def print_out(self):
        print("Print PDF report")
```

If we need to implement a `WebStudentReport` that only generates and emails reports, it is still forced to inherit and implement the unused printing method:

```python
class WebStudentReport(StudentReport):
    def generate(self):
        print("Generate Web report")

    def send_email(self):
        print("Send Web report via email")

    def print_out(self):
        # Printing is a function that should not be implemented
        pass
```

Even though `WebStudentReport` has no printing capability, it must provide a dummy `print_out` method to avoid instantiation errors.

To follow ISP, we decompose the large interface into three focused interfaces using multiple inheritance:

```python
from abc import ABC, abstractmethod

class ReportGeneratable(ABC):
    @abstractmethod
    def generate(self):
        pass

class ReportEmailable(ABC):
    @abstractmethod
    def send_email(self):
        pass

class ReportPrintable(ABC):
    @abstractmethod
    def print_out(self):
        pass

class PDFStudentReport(ReportGeneratable, ReportEmailable, ReportPrintable):
    def generate(self):
        print("Generate PDF report")

    def send_email(self):
        print("Send PDF report via email")

    def print_out(self):
        print("Print PDF report")

class WebStudentReport(ReportGeneratable, ReportEmailable):
    def generate(self):
        print("Generate Web report")

    def send_email(self):
        print("Send Web report via email")
```

Now, `WebStudentReport` only inherits from the interfaces it actually needs, leaving the printing interface to classes like `PDFStudentReport`.

## Association

An association represents a structural relationship between classes where objects of one class are connected to objects of another. Associations are characterized by:
* **Directionality**: Unidirectional (class `A` knows about class `B`, but not vice versa) or bidirectional (both classes hold references to each other).
* **Multiplicity**: The quantity of associated objects (e.g., one-to-one, one-to-many, or many-to-many).

For example, in a school system, `Teacher` and `Student` classes share a many-to-many bidirectional association:

```python
class Teacher:
    def __init__(self, name):
        self.name = name
        self.students = []

    def add_student(self, student):
        self.students.append(student)
        student.teachers.append(self)

    def display_students(self):
        for student in self.students:
            print(student.name)

class Student:
    def __init__(self, name):
        self.name = name
        self.teachers = []

    def display_teachers(self):
        for teacher in self.teachers:
            print(teacher.name)

# Create objects
teacher1 = Teacher("Teacher Zhang")
teacher2 = Teacher("Teacher Li")

student1 = Student("Xiao Ming")
student2 = Student("Xiao Hong")

# Establish association
teacher1.add_student(student1)
teacher1.add_student(student2)
teacher2.add_student(student2)

# Display association
print(f"{teacher1.name}'s students are:")
teacher1.display_students()

print(f"{teacher2.name}'s students are:")
teacher2.display_students()

print(f"{student2.name}'s teachers are:")
student2.display_teachers()
```

Here, `Teacher` and `Student` maintain list references to each other. The `add_student()` method coordinates this bidirectional relationship, enabling us to easily navigate the association from either side.

## Composition

Composition represents a strong 'whole-part' relationship where the 'part' objects cannot exist independently of the 'whole' object. Composition allows you to build complex behaviors by combining simpler objects rather than relying on deep inheritance hierarchies. This provides greater design flexibility and decouples components so they can be developed and tested in isolation.

For example, a `Dog` is composed of a head, body, legs, and a tail. The legs are in turn composed of joints. A dog *has a* tail; it does not inherit from it. Therefore, composition is the natural relationship here:

```python
class Joint:
    def __init__(self, type):
        self.type = type

    def move(self, direction):
        print(f"{self.type} joint moves in the {direction} direction.")


class Leg:
    def __init__(self):
        self.joints = [Joint("hip"), Joint("knee")]

    def walk(self):
        for joint in self.joints:
            joint.move("forward")

class Tail:
    def wag(self):
        print("Wagging the tail.")
```

Then, create the Dog class. Each Dog object will use four instances of the Leg class and one instance of the Tail class:

```python
class Dog:
    def __init__(self):
        self.head = "fluffy head"
        self.body = "slender body"
        self.legs = [Leg() for _ in range(4)]
        self.tail = Tail()

    def walk(self):
        for leg in self.legs:
            leg.walk()

    def express_happiness(self):
        self.tail.wag()
```

Now, when we need the dog to walk, we simply call the walk method. When the dog expresses happiness, we can call the express_happiness method.

```python
dog = Dog()
dog.walk()                # Output: Joint movement information
dog.express_happiness()   # Output: "Wagging the tail."
```

By composing the `Dog` class from smaller components, we keep each class simple and focused. If we need to modify how a leg joint moves in the future, we only edit the `Joint` class.

## Aggregation

Aggregation is a weaker form of 'whole-part' relationship where the 'part' objects can exist independently of the 'whole'. 

The key difference between composition and aggregation lies in **lifecycle ownership**:
* **Composition**: The whole owns the parts and is responsible for their creation and destruction. If the whole object is destroyed, its parts are destroyed with it (e.g., a `Dog` and its `Tail`).
* **Aggregation**: The whole contains the parts, but does not manage their lifecycles. If the whole object is destroyed, the parts continue to exist independently (e.g., a `Classroom` and its `Student`s). A student can leave a classroom and join another room, or exist independently in the system.

```python
class Student:
    def __init__(self, name, student_id):
        self.name = name
        self.student_id = student_id

class Classroom:
    def __init__(self, room_number):
        self.room_number = room_number
        self.students = []

    def add_student(self, student):
        self.students.append(student)

    def display_students(self):
        for student in self.students:
            print(student.name)

# Create objects
student1 = Student("Xiao Ming", "001")
student2 = Student("Xiao Hong", "002")

classroom_302 = Classroom("302 Classroom")

# Establish aggregation relationship
classroom_302.add_student(student1)
classroom_302.add_student(student2)

# Display students
print(f"Students in {classroom_302.room_number}:")
classroom_302.display_students()
```

Here, `Classroom` holds references to `Student` objects, but it does not instantiate or destroy them. If `classroom_302` is deleted, the `Student` instances continue to exist.

## Open/Closed Principle

The Open/Closed Principle (OCP) states that software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification.

This means you should be able to add new features without changing the existing, working code. Modifying source code directly always carries the risk of introducing regression bugs into a stable system.

Let's demonstrate this by adding formats to our student report generator. Consider this initial class design:

```python
class Student:
    def __init__(self, name: str):
        self.name = name

class StudentReport:
    def __init__(self, student: Student):
        self.student = student

    def generate_report(self):
        return f"This is the report for \"{self.student.name}\". "
```

If we receive a new requirement to support returning reports as dictionaries (JSON), we might be tempted to modify the class like this:

```python
class StudentReport:
    def __init__(self, student: Student):
        self.student = student

    def generate_report(self, format_type="text"):
        if format_type == "text":
            return f"This is the report for \"{self.student.name}\". "
        elif format_type == "json":
            return {"student": self.student.name}
```

This violates OCP because we must edit `StudentReport` every time a new format is requested. 

To follow OCP, we leverage [abstraction](oop_design#abstraction) by creating an abstract base class for report generators and delegating the formatting logic to subclasses:

```python
from abc import ABC, abstractmethod

class ReportGenerator(ABC):
    @abstractmethod
    def generate(self, student: Student):
        pass

class TextReportGenerator(ReportGenerator):
    def generate(self, student: Student):
        return f"This is the report for \"{student.name}\". "

class DictReportGenerator(ReportGenerator):
    def generate(self, student: Student):
        return {"student": student.name}
```

We then refactor `StudentReport` to accept any concrete `ReportGenerator` implementation via dependency injection:

```python
class Student:
    def __init__(self, name: str):
        self.name = name

class StudentReport:
    # Pass both student and generator during initialization
    def __init__(self, student: Student, generator: ReportGenerator):
        self.student = student
        self.generator = generator

    def generate(self):
        # Call the generator, passing its own student data
        return self.generator.generate(self.student)
```

This allows us to select or change the report format dynamically at runtime:

```python
student = Student("ruanqizhen")
text_report = StudentReport(TextReportGenerator())
dict_report = StudentReport(DictReportGenerator())

print(text_report.generate(student))  # Output: This is the report for "ruanqizhen"
print(dict_report.generate(student))  # Output: {"student": "ruanqizhen"}
```

This design fully satisfies the Open/Closed Principle. We can add infinitely many new report formats without changing `StudentReport` or any existing generator subclasses.

The Open/Closed Principle is the core goal of object-oriented design: it achieves a system that is both flexible (features can be added easily) and stable (existing features are protected from regressions).
