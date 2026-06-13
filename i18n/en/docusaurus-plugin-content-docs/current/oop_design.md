# Design Methods and Principles

In the previous sections, when discussing object-oriented programming, we primarily considered it from an implementation perspective: assuming we already know what classes we need, how should we write code for these classes. However, now we need to shift perspective and consider how to design object-oriented programs: for a given problem, what classes should be designed, and what are the relationships between them?

Object-oriented programming is fundamentally designed for large-scale programs. Many of its concepts may not be suitable for small programs. Object-oriented program design must consider how the software will be smoothly upgraded and how features can be easily extended in the future. These considerations are over-engineering for small programs. Many small programs may be discarded after use, with no maintenance or upgrade concerns. Even if new requirements arise in the future, modifying them is very easy, and even starting from scratch to rewrite a program is not much trouble. Spending too much time on object-oriented design for a small program is indeed not worthwhile.

But for large-scale programs, the situation is completely different. Large-scale software incurs enormous costs during construction, making it not easily discardable. When faced with new requirements, generally no one would spend the high cost of building another large-scale software. The rational choice is inevitably to patch and extend the existing system. Therefore, when designing large programs, we should already anticipate that they will inevitably need to be extended in the future. For example, when designing a pet store system, we should consider that new animal species may need to be added to the system in the future, and new animal species may have different attributes and methods. When we design a student report system, we need to consider that the report content may need to be expanded in the future, such as adding new subjects; the file types of reports may also change, such as possibly requiring PDF format, web format; the methods of submitting reports will also expand, such as some needing to be sent via email, some needing to be printed, etc. When we design a testing system, we also need to consider possible future expansions, such as new test items, new tested products, new types of testing instruments, and so on.

If we don't prepare for future extensions during the design phase, when the time comes to actually need to extend it, the work will become extremely difficult. The purpose of adopting object-oriented programming is precisely to build a system that is easiest to maintain and extend. Let us quote the purpose of object-oriented programming we mentioned earlier: to create a system that is both flexible and stable, with flexibility reflected in the ability to add new functionality at any time, and stability reflected in not needing to modify existing classes. So, how can we add new functionality without modifying existing code?

In the previous text, we have detailed the three major features of object-oriented programming: [encapsulation](class#封装), [inheritance](class#继承), and [polymorphism](class#多态). When designing programs, these three features remain the most important considerations. That is, when designing classes, we need to consider what attributes and methods the class has, whether it can inherit attributes and methods from other classes, etc. These three features have been detailed in previous chapters. In the following sections, we will focus on other commonly used design methods and techniques, such as whether one class needs to depend on another class, whether a class is composed of other objects, etc.

Additionally, computer scientist Robert C. Martin proposed several principles of object-oriented programming in 2000. After further modification and refinement by more experts, these principles were summarized into five guidelines and best practices to follow in object-oriented program design, known as the SOLID principles. These principles are:

- S - Single Responsibility Principle (SRP)
- O - Open/Closed Principle (OCP)
- L - Liskov Substitution Principle (LSP)
- I - Interface Segregation Principle (ISP)
- D - Dependency Inversion Principle (DIP)

These five principles are very important, and we will introduce them below. It is worth noting that the order of these five principles is intended to form the English word "solid". When introducing these principles, we will break this order and start with the foundational principles first.


## Abstraction

Abstraction refers to extracting common characteristics from multiple different classes to form a more general, conceptual concept or model. This concept or model can be represented as an abstract class. In this class, we define common attributes and behaviors without concerning ourselves with specific implementation details. Through abstraction, the designed system can reduce complexity. By hiding unnecessary details and only presenting the most critical features, abstraction makes it easier for us to understand and design the system. And by defining common attributes and behaviors, it avoids repeating the same code in multiple places. Based on the abstract class, it will be easier to extend or override, forming various concrete subclasses.

For example: When we consider designing a pet store system, there are multiple animals, such as cats and dogs. Although these animals have many different characteristics, they also have some commonalities. For instance, each animal has a name, needs to eat food, and can make sounds. These commonalities can be abstracted into an [abstract class](multiple_inheritance#抽象类) called "Animal":

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

In this Animal class, we have defined the common attribute name, as well as two methods eat and speak. However, we have not provided concrete implementations for these methods, only leaving placeholders.

After this abstraction step is completed, we can define concrete animal classes based on this abstract Animal class:

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

Each concrete animal class inherits from the Animal class and provides a concrete implementation of the methods. Through this design, we can easily add more animal types to the system without having to define common attributes and behaviors from scratch every time. This is the power of abstraction.

## Liskov Substitution Principle

The Liskov Substitution Principle states that subtypes must be able to replace their parent types without causing any errors. In other words, if we have an instance of a parent class, we should be able to replace it with an instance of any of its subclasses, and the application should still work correctly.

We will use a Rectangle class and a Square class to illustrate how to follow the Liskov Substitution Principle. I have seen the Rectangle and Square example in many articles, but it is so classic that I cannot think of a better way to demonstrate the Liskov Substitution Principle, so I will continue using this classic example.

Mathematically, a square is a special type of rectangle, so it is natural to consider: we should derive a Square subclass from the Rectangle base class:

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

In the above design, the Rectangle class has two attributes, length and width (using property [decorators](class#属性装饰器)), and area can be calculated from length and width. Square is a special Rectangle with equal length and width, both called side length in a square. This design matches the natural situation, but it violates the Liskov Substitution Principle. Suppose a program uses the Rectangle class, for example: `shape = Rectangle(3, 5)`. If we directly replace Rectangle in this statement with Square, the program will error because the Square constructor requires side length data, not length and width. That is, in this design, we cannot directly replace the parent class with a subclass in the program. More importantly, this design changes the behavioral contract of the parent class. For a `Rectangle` object, we generally assume that modifying "width" does not affect "height". But for `Square`, modifying the width simultaneously changes the height. If the program has code that relies on the assumption of "independent length and width" (such as code for calculating area), replacing it with `Square` will produce incorrect results.

To follow the Liskov Substitution Principle, we can redesign these two classes so that `Square` is not a subclass of `Rectangle`, but both are subclasses of a more general abstract class `Shape`.

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

In this way, both square and rectangle are shapes, but they do not have a subclass-parent class relationship; they are two equal and independent classes. In the program, we will not expect to use Square to replace Rectangle, thus no longer violating the Liskov Substitution Principle. From this example, we can see that classes in object-oriented programming are essentially for software development. When designing classes and the relationships between classes, the primary consideration is the logical relationship of the program, not the relationship between these objects in the real world.

If we violate the Liskov Substitution Principle, we cannot safely use subclasses wherever parent classes are called, which reduces code reusability. If such subclasses that violate this principle are accidentally used in a program, it can easily cause runtime errors. To ensure that such subclasses violating the Liskov Substitution Principle can also run correctly in the program, the cost of testing and maintenance would need to be increased.

## Dependency Relationship

A dependency relationship is a relatively loose connection, indicating that one class uses an object of another class within its methods. If class A's methods manipulate objects of class B, then class A depends on class B. Unlike composition and aggregation, dependency does not have a strong lifecycle implication. For example, consider a simple scenario where we have a Printer class (printer) that can print various documents. We also have a Document class (document) representing the document to be printed. In this case, the Printer class depends on the Document class because it needs a Document instance to perform the print operation.

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

In this example, the Printer class has a method print_document that accepts a Document class object as a parameter and prints its content. This means that Printer depends on Document because it needs a Document object to perform its operation. However, note that this dependency does not mean Printer owns Document, or that Document's lifecycle depends on Printer. It simply means that the Printer class uses the Document class in some of its operations.

This relationship is temporary, existing only during the method call, so its binding is looser compared to composition or aggregation relationships.

## Dependency Inversion Principle

The Dependency Inversion Principle states that a class should not depend on other concrete classes; it should depend on abstract classes.

In traditional procedural programming, upper-level modules always depend on lower-level modules. Our natural inclination is also: since abstract concepts are extracted from concrete things, they should depend on concrete things. This principle is called "inversion" because its assertion is the opposite of previous thinking: "Abstraction should not depend on the concrete, but the concrete should depend on abstraction." Upper-level classes should also not depend on lower-level classes; they should all depend on abstraction.

Although this principle is placed last in SOLID, it is the foundation of the other principles and design methods. The core of the Dependency Inversion Principle is to avoid direct interaction between concrete classes by relying on abstraction, thereby reducing coupling between them. Low coupling means that changes in one class do not affect other classes, thus reducing the difficulty of maintenance and extension.

To better explain this principle, consider the following report generation example. Suppose we have a ReportService class that directly depends on a concrete PDFStudentReport class to generate PDF reports:

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

The problem with the above design is that ReportService directly depends on PDFStudentReport. When requirements change, such as needing to generate a report in web format, we would have to modify the ReportService class. To follow the Dependency Inversion Principle, we can define an abstract Report class, then have PDFStudentReport and other report types (such as WebStudentReport) implement this abstract class. ReportService should depend on this abstract class, not on concrete implementations.

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

Now, the ReportService class receives an instance of the Report interface through its constructor. We can easily change the type of report by simply providing a different Report implementation, without needing to modify the ReportService class.

## Single Responsibility Principle

The Single Responsibility Principle, simply put, means a class should do only one thing.

What scope of work counts as "one thing"? More specifically, a class is responsible for one thing, meaning that when user or boss requirements change, we only need to change the class design when one specific requirement changes. For example, writing a program to manage student information. This program needs to read student information from a database and also print the information in a certain format. We have different ways to design the classes in the program, such as designing a Student class with two methods: one responsible for reading information from the database and saving the data into corresponding attributes; the other responsible for reading the saved attributes and printing a report:

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

The design approach above violates the Single Responsibility Principle because the Student class does two things simultaneously: managing student data and generating reports. In the future, whether the way student data is managed changes or the report format has new requirements, this class will need to be modified. A design that follows the Single Responsibility Principle would place these two functions into separate classes:

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

In the design that follows the Single Responsibility Principle, we have moved the responsibility of report generation to a separate StudentReport class. This way, if the data management approach changes, the Student class can be modified independently of report generation, and vice versa.

Why should we follow the Single Responsibility Principle?

First, large projects involve multiple people, or even multiple teams. Different functions may be developed and maintained by different people. If changes to different functions affect the same class, conflicts may arise during modification. Second, the Single Responsibility Principle can make version management of the program code clearer -- one function corresponds to one class and one file. This way, when a file is updated, we know which function has changed. Conversely, when we need to change a function, we can directly find the corresponding file.

## Interface Segregation Principle

The Interface Segregation Principle, simply put, means that we should ensure that a class is not forced to implement interfaces it does not need. The interface mentioned here can be understood as an abstract class in Python. If an abstract class is defined too broadly, containing various different functions, then the concrete class that inherits from this abstract class must implement every function defined in the abstract class. Even if the concrete class only needs to do one thing, it has to implement other unrelated functions defined in the abstract class. Therefore, when designing abstract classes, each specific function should be designed as a separate abstract class, which is better than a single large and comprehensive abstract class. This way, each concrete class can focus only on the functions directly relevant to it.

Let us use the student report program as an example again. Suppose we define a StudentReport abstract class in the program that defines the functions required for a report: generating reports, sending reports, and printing reports. We write a concrete class PDFStudentReport responsible for handling PDF format report functionality, which inherits the StudentReport abstract class. PDFStudentReport implements the functions for generating, emailing, and printing PDF reports:

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

Now a new requirement arises: the new report format needs to generate reports in web format and can email the report, but does not require printing. We can implement another concrete class, WebStudentReport, that can generate and email web format reports:

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

In the above example, WebStudentReport is responsible for handling web format report functionality. Although WebStudentReport does not need the capability to print reports, because it inherits from the StudentReport abstract class, it must implement all functions defined in the StudentReport abstract class. Therefore, WebStudentReport is forced to implement a print_out method as well.

To follow the Interface Segregation Principle, we can split the StudentReport abstract class into multiple abstract classes, each targeting a specific function:

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

This way, WebStudentReport only needs to implement the interfaces that are truly relevant to it, instead of being forced to implement an unnecessary method. Thus, we follow the Interface Segregation Principle, ensuring that each class only implements the interfaces it truly needs.

## Association

An association defines a connection between objects of one class and objects of another class. This connection can be unidirectional or bidirectional, and can have different "strengths" or durations, from temporary to long-term. When designing associations, two characteristics need attention: first, directionality, which specifies whether the relationship between two classes is bidirectional or unidirectional. For example, if class A knows about class B but class B does not know about class A, that is a unidirectional association. Second, multiplicity, whether one object is associated with multiple objects of another class.

For example, a school system has two classes, Teacher and Student. The relationship between objects of these two classes is an "association": one teacher can teach multiple students, and one student can be taught by multiple teachers.

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

In the above example, the relationship between Teacher and Student is bidirectional and has clear multiplicity, because one teacher can have multiple students, and one student can have multiple teachers. In the Teacher class, the associated Student objects are stored in a list. The add_student() method is used to establish this bidirectional relationship. Through this design, we can easily query and manipulate the associations between objects, such as querying all students of a teacher or querying all teachers of a student.

## Composition

Composition is a concept that refers to a "whole-part" relationship. When an object contains one or more instances of another object, we call this relationship composition. Composition allows us to build more complex, feature-rich objects based on existing objects without needing to inherit from them. Compared to inheritance, composition offers greater flexibility. By simply changing components, we can change the behavior of the whole. Composition helps decouple parts of the system. Each component can be developed and tested independently. Composition can break down complex systems into parts that are easy to understand and manage.

Suppose we want to simulate a dog and design a Dog class, where the dog consists of a head, body, four legs, and a tail. The legs are composed of multiple joints, such as hip joints, knee joints, etc. In this design, the relationship between "dog" and "head" should not be inheritance, but composition: "dog" is composed of "head", "body", "tail", etc.

First, define the classes for body parts such as joints, legs, and tail:

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

Through composition, we provide various functionality to the Dog class while keeping the code organized and maintainable. If we need to modify the structure of the dog's legs or the behavior of joints in the future, we only need to make changes in the corresponding classes.

## Aggregation

Aggregation is a special kind of association, indicating that one class is a part or component of another class. This relationship represents "has-a" semantics, meaning one object can own or contain other objects. Aggregation is typically used to represent whole-part relationships, where the whole does not need to be responsible for the lifecycle of the parts. Only the aggregating class knows about the part classes, while the part classes do not know about the aggregating class. Part objects can move from one aggregating object to another.

Aggregation and composition are somewhat similar in approach; both can represent "parts" and "whole", where the "whole" owns one or more "parts". The difference lies in whether the "whole" is responsible for the lifecycle of the "parts", i.e., whether it is responsible for the creation and destruction of the "parts". For example, a "tail" is part of a "dog". When a dog object no longer exists, there is no need for the tail object to exist either. The "dog" is responsible for creating and destroying the "tail" -- this is composition. Another example: a "student" can also be seen as part of a "classroom", but outside of the "classroom", the application may also need the "student" to complete other tasks, such as sports activities, etc. That is, the lifecycle of the "student" object cannot be managed by the "classroom". In this case, the relationship between student and classroom is aggregation, not composition.

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

In the above example, the Classroom class aggregates the Student class. The classroom holds its internal students, but the students can also exist without the classroom. By using aggregation, we can establish a clear hierarchical structure and whole-part relationship, which helps organize and manage objects in the system at a higher logical level.

## Open/Closed Principle

The Open/Closed Principle states that classes should be open for extension but closed for modification.

More specifically, we should be able to extend new functionality without modifying existing code. Any modification to the code may introduce new bugs. Therefore, code that is already running without issues should be left as unchanged as possible.

We will continue using StudentReport to explain. This is the already written code:

```python
class Student:
    def __init__(self, name: str):
        self.name = name

class StudentReport:
    def __init__(self, student: Student):
        self.student = student

    def generate_report(self):
        return f"This is the report for "{self.student.name}". "
```

Next, we receive a new requirement: the printed report needs to use structured data, returned in dictionary format. We might modify the program like this:

```python
class StudentReport:
    def __init__(self, student: Student):
        self.student = student

    def generate_report(self, format_type="text"):
        if format_type == "text":
            return f"This is the report for "{self.student.name}". "
        elif format_type == "json":
            return {"student": self.student.name}
```

This modification approach violates the Open/Closed Principle because we are constantly modifying the StudentReport class to support new report formats. So how can we add new functionality without changing existing classes?

This requires the use of [abstract classes](oop_design#抽象): we can introduce an abstract "report generator" class, then design each format as a concrete class:

```python
from abc import ABC, abstractmethod

class ReportGenerator(ABC):
    @abstractmethod
    def generate(self, student: Student):
        pass

class TextReportGenerator(ReportGenerator):
    def generate(self, student: Student):
        return f"This is the report for "{student.name}". "

class DictReportGenerator(ReportGenerator):
    def generate(self, student: Student):
        return {"student": student.name}
```

Now, when a new report format needs to be added, we simply need to add a new concrete report generator class without modifying any existing classes. Example code using ReportGenerator after the modification:

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

In this way, when we need to generate reports in different formats, we simply change the generator of the StudentReport instance. For example:

```python
student = Student("ruanqizhen")
text_report = StudentReport(TextReportGenerator())
dict_report = StudentReport(DictReportGenerator())

print(text_report.generate(student))  # Output: This is the report for "ruanqizhen"
print(dict_report.generate(student))  # Output: {"student": "ruanqizhen"}
```

This design fully follows the Open/Closed Principle, because existing code does not need to be modified to add new functionality.

The Open/Closed Principle is the most central of all principles. In fact, it is not limited to "class" design -- any software entity, including classes, modules, functions, etc., should be open for extension but closed for modification. And this principle is precisely the goal of introducing object-oriented programming in software development: we want to create a system that is both flexible and stable, with flexibility reflected in the ability to add new functionality at any time; at the same time, not modifying existing code is a strong guarantee of system stability.


