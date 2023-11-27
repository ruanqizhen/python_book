# SOLID 原则

计算机科学家 Robert C·Martin 在 2000 年提出了几条面向对象设计的几条原则，后来经过更多专家的改进提炼，这些原则被总结成了五条面向对象设计时应该遵守的准则和最佳实践，被称为 SOLID 原则。这些原则是：

* S - 单一功能原则 (Single Responsibility Principle, SRP)： 每个类只应该有一个引发变化的原因。这意味着一个类只应该有一个任务或功能。当一个类有多个功能或责任时，它们可能会互相影响，从而增加出错的风险和复杂度。
* O - 开放封闭原则 (Open/Closed Principle, OCP)： 软件实体（如类、模块和函数）应该对扩展开放，但对修改封闭。这意味着应该能够添加新功能而不更改现有代码。
* L - 里氏替换原则 (Liskov Substitution Principle, LSP)： 派生类必须能够替换其基类并且应用依然能够正常工作。这意味着派生类应该遵循其基类的行为规范。
* I - 接口隔离原则 (Interface Segregation Principle, ISP)： 一个类不应该被迫实现它不使用的接口，也就是说一个类不应该被迫依赖它不需要的方法。这强调了为客户端创建专用接口的重要性，而不是定义一个庞大、通用的接口。
* D - 依赖倒置原则 (Dependency Inversion Principle, DIP)： 高级模块不应该依赖于低级模块，它们都应该依赖于抽象。抽象不应该依赖于具体实现，具体实现应该依赖于抽象。这导致的效果是解耦和更高级别的模块化。

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

如此，当我们需要生成不同格式的报告时，只需改变 UserReport 实例的生成器即可。例如：

```python
student = Student("ruanqizhen")
text_report = StudentReport(TextReportGenerator())
dict_report = StudentReport(DictReportGenerator())

print(text_report.generate(student))  # 输出： 这是“ruanqizhen”的报告
print(dict_report.generate(student))  # 输出： {'学生': 'ruanqizhen'}
```

这种设计完全遵循了开放封闭原则，因为现有的代码不需要为了添加新功能而进行修改。



## 里氏替换原则

里氏替换原则是指，子类型必须能够替换它们的基类型而不会导致任何错误。换句话说，如果有一个父类的实例，我们应该能够将它替换为它的任何一个子类的实例，并且应用程序仍然应该正常工作。我们用一个长方形类和一个矩形类来说明如何遵循里氏替换原则。

不遵循里氏替换原则的设计：

在数学上，正方形是一种特殊的矩形，所以很自然的考虑，应该从矩形类派生出正方形类。

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

上述设计中，Square 是 Rectangle 的子类。但是，正方形的宽和高是相等的，所以当我们尝试修改正方形的宽或高时，会导致问题，因为这违反了正方形的基本定义。这违反了里氏替换原则，因为我们不能替换 Rectangle 为 Square 而不改变行为。

遵循里氏替换原则的设计：

为了遵循 LSP，我们可以重新设计这两个类，使得 Square 不是 Rectangle 的子类，而是两者都是更一般的形状 Shape 的子类。

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

如此，正方形和矩形都是形状，但是它们没有子类和超类的关系。现在，我们不再期望一个正方形是一个矩形，因此不再违反里氏替换原则。

面向对象编程中的类，根本上是为软件开发服务的，设计类，类与类之间的关系时，最主要的还是要考虑程序的逻辑关系，而不是它们再现实世界中的关系。 


违反了里氏替换原则，我们就不能放心的把子类放在任何调用父类的地方，降低了代码的可重用性，如果在程序中使用了这样的子类，也很容易引起运行错误。即便保证运行无误，也要为此增加测试和维护成本。



### 接口隔离原则

接口隔离原则主张多个特定的客户端接口总是好于一个通用的接口。简单地说，我们应该确保一个类不被迫实现它不会用到的接口。这样可以确保系统解耦，每个类只关注与它直接相关的功能。


不遵循接口隔离原则的设计：

仍然以 UserReport 类为例，想象我们有一个 UserReport 接口，它包含生成报告、发送报告和打印报告的方法。

```python
from abc import ABC, abstractmethod

class UserReport(ABC):
    @abstractmethod
    def generate(self):
        pass

    @abstractmethod
    def send_email(self):
        pass

    @abstractmethod
    def print_out(self):
        pass

class PDFUserReport(UserReport):
    def generate(self):
        print("Generating PDF report")

    def send_email(self):
        print("Sending PDF report via email")

    def print_out(self):
        print("Printing PDF report")
```

但现在，如果我们有一个只需要生成和发送电子邮件的报告的需求，不需要打印功能，如 WebUserReport，那么我们就被迫实现一个不需要的 print_out 方法。

```python
class WebUserReport(UserReport):
    def generate(self):
        print("Generating Web report")

    def send_email(self):
        print("Sending Web report via email")

    def print_out(self):
        # Not needed but still have to implement because of the UserReport interface
        pass
```

遵循接口隔离原则的设计：

为了遵循接口隔离原则，我们可以将 UserReport 接口拆分为更具体的接口：

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

class PDFUserReport(ReportGeneratable, ReportEmailable, ReportPrintable):
    def generate(self):
        print("Generating PDF report")

    def send_email(self):
        print("Sending PDF report via email")

    def print_out(self):
        print("Printing PDF report")

class WebUserReport(ReportGeneratable, ReportEmailable):
    def generate(self):
        print("Generating Web report")

    def send_email(self):
        print("Sending Web report via email")
```

这样，WebUserReport只需要实现与其真正相关的接口，而不是被迫实现一个不需要的方法。这样我们遵循了接口隔离原则，确保每个类只实现它们真正需要的接口。

## 依赖倒置原则

依赖倒置原则是指高层模块不应该依赖于低层模块，它们都应该依赖于抽象。同样，抽象不应该依赖于具体实现，具体实现应该依赖于抽象。

为了更好地解释这个原则，我们可以考虑一个报告生成的示例。

不遵循依赖倒置原则的设计：

假设我们有一个 ReportService 类，它直接依赖于具体的 PDFUserReport 类来生成 PDF 报告：

```python
class PDFUserReport:
    def generate(self):
        return "Generated PDF report"

class ReportService:
    def __init__(self):
        self.report = PDFUserReport()

    def create_report(self):
        return self.report.generate()
```

上面的设计有一个问题： ReportService 直接依赖于 PDFUserReport。如果我们想改变报告的类型（例如从 PDF 到 Word），我们必须修改 ReportService 类。

遵循依赖倒置原则的设计：

为了遵循依赖倒置原则，我们可以定义一个抽象的 Report 接口，然后让 PDFUserReport 和其他报告类型（如 WordUserReport）实现这个接口。ReportService 应该依赖于这个抽象接口，而不是具体的实现。

```python
from abc import ABC, abstractmethod

class Report(ABC):
    @abstractmethod
    def generate(self):
        pass

class PDFUserReport(Report):
    def generate(self):
        return "Generated PDF report"

class WordUserReport(Report):
    def generate(self):
        return "Generated Word report"

class ReportService:
    def __init__(self, report: Report):
        self.report = report

    def create_report(self):
        return self.report.generate()
```

现在，ReportService 类通过其构造函数接收一个 Report 接口的实例。我们可以轻松地更改报告的类型，只需要提供一个不同的Report实现即可，而不需要修改ReportService类。

这种设计允许我们灵活地更改依赖关系，因此我们遵循了依赖倒置原则。

