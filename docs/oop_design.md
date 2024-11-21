# 设计方法和原则

前面几节在讨论面向对象编程的时候，主要是从实现的角度来考虑的：假设我们已经知道了需要一些类，应该如何为这些类编写代码。但是接下来，我们要换一个角度，来考虑一下如何设计面向对象的程序：对于一个问题，应该设计哪些类，它们之间的关系如何？

面向对象编程从根本上说，是为了大规模程序设计的，它的很多理念对于小程序来说，可能并不适用。面向对象的程序设计要考虑软件将来如何顺利地升级、如何方便地扩展功能。这些考量对于小程序来说都属于过度设计。很多小程序可能用完就扔了，不存在维护和升级的问题。就算将来有了新需求，改起来也非常容易，甚至另起炉灶再写个程序都不算费劲。为了个小程序花费太多时间在面向对象设计上，的确有些不值。

但是对于大规模程序来说，情况就完全不同了。大规模软件在搭建时，就已经花费了巨大成本，导致它们不会被轻易抛弃。在面临新需求时，一般情况下，没有人会再花费高昂的代价去建立另一个大规模软件。理智的选择必然是在旧系统上修修补补，进行扩展。因此，在设计大程序的时候，我们就应该已经考虑到了，它将来必然会被扩展。比如，当我们在设计一个宠物店的系统时，就应该考虑到，将来系统中可能会需要添加新的动物种类，新动物种类可能会有一些不同的属性和方法。当我们设计一个学生报告系统的时候，我们需要考虑到将来报告的内容可能需要扩展，比如添加新的学习科目；报告的文件类型也可能会有新变化，比如可能会需要有 PDF 格式的、网页格式的；递交报告的方式也会扩展，比如有需要邮寄的，有需要打印的等等。当我们设计一个测试系统时，同样也需要考虑将来有可能的扩展，比如可能会需要新的测试项目、新的被测产品、新类型的测试仪器等等。

如果在设计阶段不为将来的扩展做好准备，真的等到需要扩展它的时候，工作将会变得非常非常困难。而采用面向对象编程的目的正是为了建立一个最容易维护和扩展的系统。再引用一下我们之前提到的面向对象编程的目的：创建一个既灵活又稳定的系统，灵活性体现在可以随时添加新的功能；稳定性体现在它不需要改动已有的类。那么，如何做到在不修改已有代码的基础上再增加新功能呢？

在前文中，我们已经详细介绍了面向对象编程的三大特性：[封装](class#封装)、[继承](class#继承)、[多态](class#多态)。在设计程序时，这三大特性依然是最重要的考量因素，也就是说，在设计类时，我们需要考虑类中有哪些属性和方法，是否可以继承其他一些类中的属性和方法等。这三大特性在前面的章节中已经详细介绍过了，我们在下文将着重讲解其他一些比较常用的设计方法和技巧，比如一个类是否需要依赖另一个类，一个类是否由其他一些对象组成的等等。

此外，计算机科学家 Robert C. Martin 在 2000 年提出了面向对象程序设计的几条原则。后来经过更多专家的修改和提炼，这些原则被总结成了五条在面向对象程序设计时应该遵守的准则和最佳实践，被称为 SOLID 原则。这些原则是：

- S - 单一功能原则 (Single Responsibility Principle, SRP)
- O - 开放封闭原则 (Open/Closed Principle, OCP)
- L - 里氏替换原则 (Liskov Substitution Principle, LSP)
- I - 接口隔离原则 (Interface Segregation Principle, ISP)
- D - 依赖倒置原则 (Dependency Inversion Principle, DIP)

这五条原则非常重要，我们也将在下文一并介绍。需要注意的是，这五条原则的排列顺序是为了凑成英文单词 solid （坚实的），我们在介绍这些原则的时候，会打破这个顺序，先从基础的原则开始讲解。


## 抽象

抽象（Abstraction）指的是从多个不同的类中抽取出共同的特性，形成一个更为通用、概括的概念或模型。这个概念或模型，可以表现为一个抽象类。在这个类中，我们定义共同的属性和行为，但不必关注具体的实现细节。通过抽象，可以让设计出来的系统降低复杂性。通过隐藏不必要的细节，只展现最关键的特性，抽象可以让我们更容易理解和设计系统。并且通过定义通用的属性和行为，可以避免在多个地方重复相同的代码。在基于抽象的类上，将会更容易进行扩展或重写，形成各种具体的子类。

比如：当我们考虑设计一个宠物店的系统时，在这个系统中，有多种动物，如猫、狗。尽管这些动物有很多不同的特性，但它们也有一些共同点。例如，每种动物都有一个名字，都需要吃食物，都可以发出声音。这些共同点，就可以抽象成为一个“动物”[抽象类](multiple_inheritance#抽象类)：

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

在这个 Animal 类中，我们定义了共同的属性 name，以及两个方法 eat 和 speak。但是，我们并没有为这些方法提供具体的实现，只是留下了一个占位符。

在这一步抽象完成之后，我们可以基于这个抽象的 Animal 类，再去定义具体的动物类：

```python
class Dog(Animal):
    def speak(self):
        return "汪汪！"

class Cat(Animal):
    def speak(self):
        return "喵喵！"
```

每个具体的动物类都继承了 Animal 类，并为 speak 方法提供了具体的实现。通过这样的设计，我们可以轻松地向系统中添加更多的动物种类，而不必每次都从头开始定义共同的属性和行为。这就是抽象的威力所在。

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

## 依赖关系

依赖（Dependency）关系是一种比较散的联系，它表示一个类在其方法中使用了另一个类的对象。如果甲类的方法操纵了乙类的对象，那么甲类就依赖于乙个类。与组合和聚合不同，依赖关系没有强烈的生命周期的含义。比如，
考虑一个简单的情境，我们有一个 Printer 类（打印机），可以打印各种文档。我们还有一个 Document 类（文档），它代表要打印的文档。在这种情况下，Printer 类依赖于 Document 类，因为它需要一个 Document 实例来执行打印操作。

```python
class Document:
    def __init__(self, content):
        self.content = content

class Printer:
    def print_document(self, document):
        # Printer 类依赖于 Document 类, 印在这个方法用到了 Document 的对象
        print(document.content)

# Usage:
doc = Document("测试文档")
printer = Printer()
printer.print_document(doc)     # 输出： "测试文档"
```

在这个例子中，Printer 类有一个方法 print_document，该方法接受一个 Document 类的对象作为参数并打印其内容。这意味着 Printer 依赖于 Document，因为它需要 Document 对象来执行其操作。但请注意，这种依赖关系并不意味着 Printer 拥有 Document，或者 Document 的生命周期取决于 Printer。它只是表示 Printer 类在其某些操作中使用了 Document 类。

这种关系是临时的，只存在于方法调用期间，因此与组合或聚合关系相比，其绑定不那么紧密。

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

## 单一功能原则

单一功能原则，简单的说就是一个类只做一件事。

多大的事才算是“一件事”呢？更具体点说，一个类只负责一件事，表示当用户或老板对软件的需求有所改变时，只有其中一条需求改变了，我们才需要改变类的设计。比如，编写一个程序，管理学生的信息，这个程序需要从数据库读取学生的信息，也需要把信息按一定格式打印出来。我们有一些不同的方法来设计程序中的类，比如 设计一个 Student 类，它有两个方法：一个负责从数据库读取信息，并把数据保存成相应的属性；另一个方法负责读取保存的属性，然后打印成报告：

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

## 接口隔离原则

接口隔离原则，简单的说就是，我们应该确保一个类不会被迫实现它不需要的接口。这里所说的接口，可以理解为 Python 中的抽象类。如果一个抽象类被定义的过于复杂，包含了各种不同的功能，那么继承了这个抽象类的具体类，就必须实现每一个在抽象类中定义了的功能。即便这个具体类只需要做一件事，它也不得不实现抽象类中定义的其它的不相关的功能。因此，设计抽象类的时候，应当尽量把每个特定的功能都设计成一个抽象类，这样好过一个大的通用的抽象类。如此，每个具体类才可以只关注与它直接相关的功能。

我们还是以学生报告程序为例，假设，我们在程序中定义了一个 StudentReport 抽象类，它定义了报告所需的功能：生成报告、发送报告和打印报告三个功能。我们编写了一个具体类 PDFStudenReport 负责处理 PDF 格式报告的相关功能，它继承了抽象类 StudentReport。PDFStudenReport 实现了生成、电子邮寄、打印 PDF 报告的功能：

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

现在又有了新的需求：新的报告格式要求以网页格式生成报告，并且能够电子邮机报告，但是不需要打印报告。我们可以再实现一个新的具体类，WebStudentReport，它能够生成和电子邮寄网页格式的报告：

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

在上面示例中，WebStudentReport 负责处理 Web 格式报告的相关功能。这个 WebStudentReport 虽然不需要具备打印报告的功能，可以由于它继承了 StudentReport 抽象类，就必须实现 StudentReport 抽象类定义的所有功能。于是，WebStudentReport 也不得不实现一个 print_out 方法。

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

## 关联

关联（Association）定义了一个类中的对象与另一个类中的对象之间的连接。这种连接可以是单向的或双向的，并且可以有不同的“强度”或持续时间，从暂时性的到长期性的。设计关联的时候，需要关注两个特性：首先考虑单双向，它指定了两个类之间的双向或单向关系。例如，如果 A 类知道 B 类，而 B 类不知道 A 类，那么这是单向关联。其次是多重性，一对象是否与另一个类的多个对象相关联。

比如，一个学校系统，其中有 Teacher 和 Student 两个类。这两个类的对象的关系是一种“关联”关系：一个老师可以教多个学生，而一个学生可以被多个老师教。

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

# 创建对象
teacher1 = Teacher("张老师")
teacher2 = Teacher("李老师")

student1 = Student("小明")
student2 = Student("小红")

# 建立关联
teacher1.add_student(student1)
teacher1.add_student(student2)
teacher2.add_student(student2)

# 显示关联
print(f"{teacher1.name}的学生是：")
teacher1.display_students()

print(f"{teacher2.name}的学生是：")
teacher2.display_students()

print(f"{student2.name}的老师是：")
student2.display_teachers()
```

上面的例子中，Teacher 和 Student 之间的关系是双向的，并且有明确的多重性，因为一个老师可以有多个学生，而一个学生可以有多个老师。在 Teacher 类中，相关联的 Student 对象被保存在一个列表中。使用 add_student() 方法可以建立这种双向关系。通过这样的设计，我们可以很容易地查询和操作对象之间的关联，例如，查询一个老师的所有学生或查询一个学生的所有老师。

## 组合

组合（Composition）是一个指代“整体-部分”关系的概念。当一个对象包含另一个对象的一个或多个实例，我们称这种关系为组合。组合允许我们构建更复杂、功能丰富的对象，它基于现有对象而不需要继承它们。相较于继承，组合提供了更高的灵活性。通过简单地更改组件，我们可以改变整体的行为。组合有助于解耦系统的各部分。每个组成部分可以独立地进行开发和测试。组合可以将复杂的系统分解成容易理解和管理的部分。

假设，我们要模拟小狗，设计一个 Dog 类，其中狗由头部、身体、四条腿和一条尾巴组成。腿由多个关节组成，如髋关节、膝关节等。在这个设计中，“狗”与“头”之间的关系，就不应该是继承，而是组合：“狗”由“头”、“身体”、“尾巴”等组合而成。

首先，定义关节、腿、尾巴等身体部件的类：

```python
class Joint:
    def __init__(self, type):
        self.type = type

    def move(self, direction):
        print(f"{self.type}关节向{direction}方向移动。")


class Leg:
    def __init__(self):
        self.joints = [Joint("臀"), Joint("膝")]

    def walk(self):
        for joint in self.joints:
            joint.move("前进")
            
class Tail:
    def wag(self):
        print("摇动尾巴。")    
```

随后，创建 Dog 类，每一个 Dog 对象将使用四个 Leg 类的实例和一个 Tail 类的实例：

```python
class Dog:
    def __init__(self):
        self.head = "毛绒头"
        self.body = "瘦长身体"
        self.legs = [Leg() for _ in range(4)]
        self.tail = Tail()

    def walk(self):
        for leg in self.legs:
            leg.walk()

    def express_happiness(self):
        self.tail.wag()
```

现在，当我们需要狗行走时，我们只需调用 walk 方法。当狗表达开心时，我们可以调用 express_happiness 方法。

```python
dog = Dog()
dog.walk()                # 输出： 一组关节移动的信息
dog.express_happiness()   # 输出： "摇动尾巴。"
```

通过组合，我们为 Dog 类提供了各种功能，同时保持代码的组织性和可维护性。如果未来需要修改狗的腿的结构或关节的行为，我们只需在相应的类中进行更改。

## 聚合

聚合（Aggregation）是一种特殊的关联关系，表示一个类是另一个类的部分或组成部分。这种关系代表了"拥有"的语义，即一个对象可以拥有或包含其他对象。聚合通常用于表示整体和部分之间的关系，其中整体不必负责部分的生命周期。只有聚合类知道部分类，而部分类不知道聚合类。部分对象可以在一个聚合对象移动到另一个聚合对象。

聚合与组合的方法有些类似，它们都可以表示“部分”和“整体”，“整体”拥有一个或数个“部分”。差别之处在于“整体”是否负责“部分”的生命周期，也就是是否负责管理“部分”的创建与销毁。比如说，“尾巴”是“狗”的一部分，当一个狗的对象不存在了，尾巴对象也没有存在的必要，“狗”负责创建和销毁“尾巴”，这就是组合；另一个例子，“学生”也可以看做是“教室”的一部分，但是，在“教室”之外，应用程序可能还会需要“学生”完成其它一些任务，比如体育活动等等，也就是说，“学生”对象的生命周期不能由“教室”负责，这样学生和教室之间的关系就是聚合，而不是组合。

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

# 创建对象
student1 = Student("小明", "001")
student2 = Student("小红", "002")

classroom_302 = Classroom("302 教室")

# 建立聚合关系
classroom_302.add_student(student1)
classroom_302.add_student(student2)

# 显示学生
print(f"{classroom_302.room_number}中的学生：")
classroom_302.display_students()
```

上述例子中，Classroom 类聚合了 Student 类。教室保存了其内部的学生，但学生也可以在没有教室的情况下存在。通过使用聚合，我们可以建立清晰的层次结构和整体-部分关系，这有助于在更高的逻辑级别上组织和管理系统中的对象。

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

开放封闭原则是所有原则中最核心的一个，它实际上并不仅仅是针对“类”的设计，任何软件实体，包括类、模块、函数等都应该对扩展开放，但对修改封闭。而这个原则又正是我们在软件开发中引入面向对象编程的目标：我们希望创建一个既灵活又稳定的系统：灵活体现在可以随时添加新的功能；同时，不改动已有代码是对系统稳定性的有力保障。


