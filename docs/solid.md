# SOLID 原则

计算机科学家 Robert C·Martin 在 2000 年提出了面向对象程序设计的几条原则。后来经过更多专家的修改提炼，这些原则被总结成了五条在面向对象程序设计时应该遵守的准则和最佳实践，被称为 SOLID 原则。这些原则是：

* S - 单一功能原则 (Single Responsibility Principle, SRP)
* O - 开放封闭原则 (Open/Closed Principle, OCP)
* L - 里氏替换原则 (Liskov Substitution Principle, LSP)
* I - 接口隔离原则 (Interface Segregation Principle, ISP)
* D - 依赖倒置原则 (Dependency Inversion Principle, DIP)

遵循 SOLID 原则可以帮助我们创建可多人协作的、易于理解的、易读的以及可测试的代码。


## 单一功能原则

单一功能原则，简单的说就是一个类只做一件事。

多大的事才算是“一件事”呢？更具体点说，一个类只负责一件事，表示当用户或老板对软件的需求有所改变时，只有其中一条需求改变了，我们才需要改变类的设计。比如，编写一个程序，管理学生的信息，这个程序需要从数据库读取学生的信息，也需要把信息按一定格式打印出来。我们有一些不同的方法来设计程序中的类，比如 设计一个 Student 类，它有两个方法：一个负责动数据库读取信息，并把数据保存成相应的属性；另一个方法负责读取保存的属性，然后打印成报告：

```python
class Student:
    def __init__(self, name: str):
        self.name = name

    def get_student_data(self):
        # 从数据库中读取数据，转换成相应的属性
        pass

    def generate_report(self):
        # 打印报告
        pass
```

上面这个设计方法就违反了单一功能原则，因为 Student 类同时做了两件事：管理学生数据和报告生成。将来，无论是对于学生数据的管理方式发生变化，还是报告格式有了新要求，都需要改动这个类。遵循单一功能原则的设计应该把这两个功能分别放置到不同的类中去：

```python
class Student:
    def __init__(self, name: str):
        self.name = name

    def get_data(self):
        # 从数据库中读取数据，转换成相应的属性
        pass


class StudentReport:
    def __init__(self, student: Student):
        self.student = student

    def generate_report(self):
        # 打印报告
        pass
```

在遵循单一功能原则的设计中，我们将报告生成的责任移到了一个单独的 StudentReport 类中。这样，如果数据管理方式发生变化，Student 类可以独立于报告生成进行更改，反之亦然。

为什么要遵循单一功能原则呢？

首先，大型项目会有多人，甚至多个团队参与。不同的功能可能会由不同的人来负责开发维护。如果不同功能的变动影响到了同一个类，那么就有可能在做修改时出现冲突。其次，单一功能原则可能让程序代码的版本管理更清晰，一个功能对应一个类、一个文件，这样，某个文件一发生更新，我们就知道是哪个功能出现了变化。反之亦然，当需要改变一个功能时，我们可以直接找到对应的文件。


## 开放封闭原则

开放封闭原则是指：类应该对扩展开放，对修改封闭。

说的具体一点就是，我们应该在不修改现有代码的前提下添加新的功能。任何对代码的改动，都可能会引进新的 bug。因此，已经在运行的没问题的代码，应该能不动就不动。

我们继续使用 StudentReport 来讲解，这是已经写好的代码：

```python
class Student:
    def __init__(self, name: str):
        self.name = name
        
class StudentReport:
    def __init__(self, student: Student):
        self.student = student

    def generate_report(self):
        return f"这是“{self.student.name}”的报告。"
```

接下来，我们收到了新的需求：打印报告需要使用结构化的数据，以字典格式返回。我们可能会这样修改程序：

```python
class StudentReport:
    def __init__(self, student: Student):
        self.student = student

    def generate_report(self, format_type="text"):
        if format_type == "text":
            return f"这是“{self.student.name}”的报告。"
        elif format_type == "json":
            return {"学生": self.student.name}
```

这种修改方法就违反了开放封闭原则，因为我们不断地修改 StudentReport 类来支持新的报告格式。那么怎么才能不改变已有的类，又添加新功能呢？

这需要使用到[抽象类](oop_design#抽象)：我们可以引入一个抽象的“报告生成器”类，然后把每一种格式的报告设计成一个具体类：

```python
from abc import ABC, abstractmethod

class ReportGenerator(ABC):
    @abstractmethod
    def generate(self, student: Student):
        pass

class TextReportGenerator(ReportGenerator):
    def generate(self, student: Student):
        return f"这是“{student.name}”的报告。"

class DictReportGenerator(ReportGenerator):
    def generate(self, student: Student):
        return {"学生": student.name}
```

现在，当需要添加新的报告格式时，只需添加以中新的具体的报告生成器类就可以了，而无需修改现有的任何类。修改后，使用 ReportGenerator 的的示例代码：

```python
class Student:
    def __init__(self, name: str):
        self.name = name
        
class StudentReport:
    def __init__(self, generator: ReportGenerator):
        self.generator = generator

    def generate(self, student):
        return self.generator.generate(student)
```

如此，当我们需要生成不同格式的报告时，只需改变 StudentReport 实例的生成器即可。例如：

```python
student = Student("ruanqizhen")
text_report = StudentReport(TextReportGenerator())
dict_report = StudentReport(DictReportGenerator())

print(text_report.generate(student))  # 输出： 这是“ruanqizhen”的报告
print(dict_report.generate(student))  # 输出： {'学生': 'ruanqizhen'}
```

这种设计完全遵循了开放封闭原则，因为现有的代码不需要为了添加新功能而进行修改。

笔者认为开放封闭原则是所有原则中最重要的一个，它实际上并不仅仅是针对“类”的设计，任何软件实体，包括类、模块、函数等都应该对扩展开放，但对修改封闭。而这个原则又正是我们在软件开发中引入面向对象编程的目标：我们希望创建一个既灵活又稳定的系统：灵活体现在可以随时添加新的功能；同时，不改动已有代码是对系统稳定性的有力保障。


## 里氏替换原则

里氏替换原则是指，子类型必须能够替换它们的父类型而不会导致任何错误。换句话说，如果有一个父类的实例，我们应该能够将它替换为它的任何一个子类的实例，并且应用程序仍然应该正常工作。

我们用一个长方形类和一个矩形类来说明如何遵循里氏替换原则。长方形（Rectangle）和矩形（Square）这个例子我在很多文章中都看到过，但是它实在是太经典了，我实在想不出比它更好的演示里氏替换原则，只能继续用这个经典示例。

在数学上，正方形是一种特殊的矩形，所以很自然的考虑：应该从矩形类作为基类，派生出正方形子类：

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

上述设计中，Rectangle 类中有长、宽两个属性（使用了属性[装饰器](class#属性装饰器)），通过长宽可以计算面积。Square 是一种特殊的，长宽相等的 Rectangle，长宽在正方形中都叫做边长。这种设计符合自然情况，但他却违反了里氏替换原则。假设一个程序使用了 Rectangle 类，比如： `shape = Rectangle(3, 5)`。把这个语句中的 Rectangle 直接替换成 Square，程序会出错，因为 Square 构造函数需要的是边长数据，而不是长和宽。也就是说，在这个设计中，我们不能在程序里直接用子类替换它的父类。

为了遵循里氏替换原则，我们可以重新设计这两个类，使得 Square 不是 Rectangle 的子类，而是两者都是更通用的抽象类 Shape 的子类。

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

如此一来，正方形和矩形都是形状，但是它们没有子类和父类的关系，它们两个平等独立的类。我们在程序里也就不会期望使用 Square 去替代 Rectangle，因此不再违反里氏替换原则。从这个示例中，我们可以看到：面向对象编程中的类，本质上是为软件开发服务的，在设计类，设计类与类之间的关系时，最主要考虑程序的是程序的逻辑关系，而不是这些物体在现实世界中的关系。 

如果违反了里氏替换原则，我们就不能放心的把子类放在任何调用父类的地方，这样降低了代码的可重用性。如果不小心在程序中使用了这样的子类，会很容易引起运行错误。如果要确保这种违反了里氏替换原则的子类在程序中也可以运行无误，那就要付出增加测试和维护成本的代价。


## 接口隔离原则

接口隔离原则，简单的说就是，我们应该确保一个类不会被迫实现它不需要的接口。这里所说的接口，可以理解为 Python 中的抽象类。如果一个抽象类被定义的过于复杂，包含了各种不同的功能，那么继承了这个抽象类的具体类，就必须实现每一个在抽象类中定义了的功能。即便这个具体类只需要做一件事，它也不得不实现抽象类中定义的其它的不相关的功能。因此，设计抽象类的时候，应当尽量把每个特定的功能都设计成一个抽象类，这样好过一个大的通用的抽象类。如此，每个具体类才可以只关注与它直接相关的功能。

我们还是以 StudentReport 类为例，但是，在这个示例中 StudentReport 是一个抽象类，因为我们要实现一些更复杂的报告功能，包括：生成报告、发送报告和打印报告等功能。我们编写了一个具体类 PDFStudenReport 负责处理 PDF 格式报告的相关功能，它继承了抽象类 StudentReport。PDFStudenReport 实现了生成、电子邮寄、打印 PDF 报告的功能：

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

class PDFStudenReport(StudentReport):
    def generate(self):
        print("生成 PDF 报告")

    def send_email(self):
        print("通过 Email 发送 PDF 报告")

    def print_out(self):
        print("打印 PDF 报告")
```

现在又有了新的需求：一个新的报告格式，以网页格式生成和 Email 报告，但是不需要打印报告的功能。我们可以再实现一个新的具体类，WebStudentReport， 它能够生成和电子邮寄网页格式的报告：

```python
class WebStudentReport(StudentReport):
    def generate(self):
        print("生成 Web 报告")

    def send_email(self):
        print("通过 Email 发送 Web 报告")

    def print_out(self):
        # 打印是一个不应该被实现的功能
        pass
```

在上面示例中，WebStudentReport 负责处理 Web 格式报告的相关功能，它继承了抽象类 StudentReport。WebStudentReport 本不需要打印功能，可是由于 StudentReport 抽象类中有这个方法，WebStudentReport 也不得不实现它。这就违反了接口隔离原则。

为了遵循接口隔离原则，我们可以将 StudentReport 抽象类拆分为多个针对每个具体功能的抽象类：

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

class PDFStudenReport(ReportGeneratable, ReportEmailable, ReportPrintable):
    def generate(self):
        print("生成 PDF 报告")

    def send_email(self):
        print("通过 Email 发送 PDF 报告")

    def print_out(self):
        print("打印 PDF 报告")

class WebStudentReport(ReportGeneratable, ReportEmailable):
    def generate(self):
        print("生成 Web 报告")

    def send_email(self):
        print("通过 Email 发送 Web 报告")
```

这样，WebStudentReport 只需要实现与其真正相关的接口，而不是被迫实现一个不需要的方法。这样我们遵循了接口隔离原则，确保每个类只实现它们真正需要的接口。


## 依赖倒置原则

依赖倒置原则是指，一个类不应该依赖其它的具体类，它应该依赖于抽象类。

传统的面向过程的程序设计中，总是上层模块依赖于下层模块。我们自然的想法也是：既然抽象概念都是从具体事物中提取出来的，那么它们应该依赖于具体事物。这个原则之所以被称为“倒置”，是因为它的主张正与之前的想法正相反：“抽象不应该依赖具体，而是具体依赖抽象”，上层的类也不应该依赖于底层的类，它们都应该依赖于抽象。

虽然这个原则被 SOLID 排在了最后，但它却是其它原则和设计方法的基础。依赖倒置原则的核心是通过依赖抽象，让各个具体类之间不直接相互作用，这样可以降低它们之间的耦合度。低耦合度意味着一个类的改动不影响到其它类，从而降低了维护和扩展的难度。

为了更好地解释这个原则，我们考虑下面的报告生成的示例。假设我们有一个 ReportService 类，它直接依赖于具体的 PDFStudenReport 类来生成 PDF 报告：

```python
class PDFStudenReport:
    def generate(self):
        print("生成 PDF 报告")

class ReportService:
    def __init__(self):
        self.report = PDFStudenReport()

    def create_report(self):
        return self.report.generate()
```

上面这个设计的问题在于： ReportService 直接依赖于 PDFStudenReport。当需求发生变动的时候，比如要求生成一个 Web 格式的报告，我们就必须要修改 ReportService 类。为了遵循依赖倒置原则，我们可以定义一个抽象的 Report 抽象类，然后让 PDFStudenReport 和其他报告类型（如 WebStudentReport）实现这个抽象类。ReportService 应该依赖于这个抽象类，而不是具体的实现。

```python
from abc import ABC, abstractmethod

class Report(ABC):
    @abstractmethod
    def generate(self):
        pass

class PDFStudenReport(Report):
    def generate(self):
        print("生成 PDF 报告")

class WebStudentReport(Report):
    def generate(self):
        print("生成 Web 报告")

class ReportService:
    def __init__(self, report: Report):
        self.report = report

    def create_report(self):
        return self.report.generate()
```

现在，ReportService 类通过其构造函数接收一个 Report 接口的实例。我们可以轻松地更改报告的类型，只需要提供一个不同的 Report 实现即可，而不需要修改 ReportService 类。

现在回顾一下，我们在上一节介绍的几种面向对象的[基本设计方法](oop_design)。在考虑类和类之间关系时，我们仅仅是单纯的考虑的它们的关系，为了简化示例代码，当时使用的很多示例并不符合 SOLID 原则。当我们意识到了 SOLID 原则的重要性，再重新设计这些关系时，就需要考虑到：对于[依赖](oop_design#依赖)关系的设计，应该永远是依赖于抽象类；对于聚合、组合、关联这些关系的设计也同样，被聚合的、被组合的、被关联的，都应该是抽象类，而不是具体类。

