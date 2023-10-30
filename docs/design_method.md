# 基本设计方法

面向对象设计依赖于对现实世界事物和概念的建模，并将它们转化为类和对象。面向对象设计的主要目标是提高软件的重用性、扩展性和可维护性。与面向过程编程的从上至下，从整体到部分的设计原则不同，面向对象设计的时候，会更关注组成程序的模块与模块之间的关系。这里说的模块就是也就是类。

在设计类，以及类和类之间的关系时，除了要考虑之前已经介绍过的面向对象的三大特性：
* 封装 (Encapsulation): 将数据（属性）和与之相关的方法（函数）组织到单一的结构中（通常为类）。通过限制外部对对象内部数据的直接访问来保护数据的完整性。
* 继承 (Inheritance): 允许定义一个新类，继承一个已存在类的属性和方法，这样可以实现代码的重用和扩展。提供一个统一的方法来修改或扩展从基类继承来的行为。
* 多态 (Polymorphism): 使对象能够根据其具体类型以不同的方式响应相同的消息或方法调用。提供一个统一的接口来处理不同的对象和类，从而提高系统的灵活性。

此外，还有一些比较常用的设计方式和技巧可以考虑。


## 抽象

抽象（Abstraction）指的是从多个具体实例中抽取出共同的特性，形成一个更为通用、概括的概念或模型。这个概念或模型，通常表现为一个类。在这个类中，我们定义共同的属性和行为，但不关注具体的实现细节。

通过抽象，我们可以使得设计出来的系统降低复杂性。通过隐藏不必要的细节，只展现最关键的特性，抽象可以让我们更容易理解和设计系统。并且通过定义通用的属性和行为，可以避免在多个地方重复相同的代码。在基于抽象的类上，将会更容易进行扩展或重写，形成各种具体的子类。

比如：当我们考虑设计一个宠物店的系统时，在这个系统中，有多种动物，如猫、狗。尽管这些动物有很多不同的特性，但它们也有一些共同点。例如，每种动物都有一个名字，都需要吃食物，都可以发出声音。

我们可以通过抽象来定义一个通用的“动物”类：

```python
from abc import ABC, abstractmethod

class Animal(ABC):
    def __init__(self, name):
        self.name = name

    @abstractmethod
    def eat(self):
        pass

    @abstractmethod
    def make_sound(self):
        pass
```

在这个 Animal 类中，我们定义了共同的属性 name，以及两个方法 eat 和 make_sound。但是，我们并没有为这些方法提供具体的实现，只是留下了一个占位符。

现在，我们可以基于这个抽象的 Animal 类来定义具体的动物类：

```python
class Dog(Animal):
    def make_sound(self):
        return "Woof!"

class Cat(Animal):
    def make_sound(self):
        return "Meow!"
```

每个具体的动物类都继承了 Animal 类，并为 make_sound 方法提供了具体的实现。通过这样的设计，我们可以轻松地向系统中添加更多的动物种类，而不必每次都从头开始定义共同的属性和行为。这就是抽象的威力所在。

## 组合


组合（Composition）是一个指代“整体-部分”关系的概念。当一个对象包含另一个对象的一个或多个实例，我们称这种关系为组合。组合允许我们构建更复杂、功能丰富的对象，它基于现有对象而不需要继承它们。相较于继承，组合提供了更高的灵活性。通过简单地更改组件，我们可以改变整体的行为。组合有助于解耦系统的各部分。每个组成部分可以独立地进行开发和测试。组合可以将复杂的系统分解成容易理解和管理的部分。

假设，我们要模拟小狗，设计一个Dog类，其中狗由头部、身体、四条腿和一条尾巴组成。腿由多个关节组成，如髋关节、膝关节等。

首先，定义关节、腿、尾巴等身体部件的类：

```python
class Joint:
    def __init__(self, type):
        self.type = type

    def move(self, direction):
        print(f"The {self.type} joint is moving {direction}.")


class Leg:
    def __init__(self):
        self.joints = [Joint("hip"), Joint("knee")]

    def walk(self):
        for joint in self.joints:
            joint.move("for walking")
			
class Tail:
    def wag(self):
        print("The tail is wagging.")	
```

随后，创建 Dog 类，每一个 Dog 对象将使用四个 Leg 类的实例和一个 Tail 类的实例：

```python
class Dog:
    def __init__(self):
        self.head = "A furry head"
        self.body = "A strong body"
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
dog.walk()            # This will simulate the dog walking by moving its legs.
dog.express_happiness() # The dog wags its tail to express happiness.
```

通过组合，我们为Dog类提供了各种功能，同时保持代码的组织性和可维护性。如果未来需要修改狗的腿的结构或关节的行为，我们只需在相应的类中进行更改。


## 关联

关联（Association）描述了不同类的对象之间的关系，它定义了一个类中的对象与另一个类中的对象之间的连接。这种连接可以是单向的或双向的，并且可以有不同的“强度”或持续时间，从暂时性的到长期性的。设计关联的时候，需要关注两个特性：
* 首先考虑单双向： 它指定了两个类之间的双向或单向关系。例如，如果 A 类知道 B 类，而 B 类不知道 A 类，那么这是单向关联。
* 其次是多重性： 它定义了任意单一对象可以与其他对象的数量关联。

考虑一个学校系统，其中有 Teacher 和 Student 两个类。在这种关系中，一个老师可以教多个学生，而一个学生可以被多个老师教。

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
teacher1 = Teacher("Mr. Smith")
teacher2 = Teacher("Ms. Davis")

student1 = Student("Alice")
student2 = Student("Bob")

# 建立关联
teacher1.add_student(student1)
teacher1.add_student(student2)
teacher2.add_student(student2)

# 显示关联
print(f"{teacher1.name}'s students:")
teacher1.display_students()

print(f"\n{teacher2.name}'s students:")
teacher2.display_students()

print(f"\n{student2.name}'s teachers:")
student2.display_teachers()
```

上面的例子中，Teacher 和 Student 之间的关系是双向的，并且有明确的多重性，因为一个老师可以有多个学生，而一个学生可以有多个老师。使用 add_student 方法可以建立这种双向关系。通过这样的设计，我们可以很容易地查询和操作对象之间的关联，例如，查询一个老师的所有学生或查询一个学生的所有老师。

## 聚合

聚合（Aggregation）是一种特殊的关联关系，表示一个类是另一个类的部分或组成部分。这种关系代表了"拥有"的语义，即一个对象可以拥有或包含其他对象。聚合通常用于表示整体和部分之间的关系，其中整体不必负责部分的生命周期。这是一种父子关系，其中父对象称为聚合类，子对象称为部分。只有聚合类知道部分类，而部分类不知道聚合类。部分对象可以在一个聚合对象移动到另一个聚合对象。

聚合与组合的方法有些类似，它们都可以表示“部分”和“整体”，“整体”拥有一个或数个“部分”。差别之处在于“整体”是否负责“部分”的生命周期，也就是是否负责管理“部分”的创建与销毁。比如说，“尾巴”是“狗”的一部分，当一个狗的对象不存在了，尾巴对象也没有存在的必要，“狗”负责创建和销毁“尾巴”，这就是组合；另一个例子，“学生”也可以看做是“教室”的一部分，但是，在“教室”之外，应用程序可能还会需要“学生”完成其它一些任务，比如体育活动等等，也就是说，“学生”对象的生命周期不能由“教室”负责，这样学生和教室之间的关系就是聚合，而不是组合。

考虑一个大学，其中有Department（系）和Professor（教授）两个类。一个系可以有多个教授，但一个教授只能隶属于一个系。这是典型的聚合关系，因为系拥有教授，但系的存在并不控制教授的生命周期。

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
student1 = Student("Alice", "001")
student2 = Student("Bob", "002")

classroom_101 = Classroom("Room 101")

# 建立聚合关系
classroom_101.add_student(student1)
classroom_101.add_student(student2)

# 显示学生
print(f"Students in {classroom_101.room_number}:")
classroom_101.display_students()
```

上述例子中，Classroom 类聚合了 Student 类。学生可以在没有教室的情况下存在，但在这个上下文中，教室知道其内部的学生。通过使用聚合，我们可以建立清晰的层次结构和整体-部分关系，这有助于在更高的逻辑级别上组织和管理系统中的对象。



## 依赖

依赖（Dependency）是一种对象之间的关系，其中一个类的方法操纵另一个类的对象。简而言之，如果一个类的方法操纵另一个类的对象，那么第一个类就依赖于第二个类。与组合和聚合不同，依赖关系没有强烈的生命周期的含义，依赖是比松散的联系，它只表示一个类在其操作中使用了另一个类。

考虑一个简单的情境，我们有一个 Printer 类，可以打印各种文档。我们还有一个 Document 类，它代表要打印的文档。在这种情况下，Printer 类依赖于 Document 类，因为它需要一个 Document 实例来执行打印操作。

```python
class Document:
    def __init__(self, content):
        self.content = content

class Printer:
    def print_document(self, document):
        # Printer class is dependent on Document class, as it uses Document object in its method.
        print(document.content)

# Usage:
doc = Document("This is a test document.")
printer = Printer()
printer.print_document(doc)  # Outputs: This is a test document.
```

在这个例子中，Printer 类有一个方法 print_document，该方法接受一个 Document 类的对象作为参数并打印其内容。这意味着 Printer 依赖于 Document，因为它需要 Document 对象来执行其操作。但请注意，这种依赖关系并不意味着 Printer 拥有 Document，或者 Document 的生命周期取决于 Printer。它只是表示 Printer 类在其某些操作中使用了 Document 类。

这种关系是临时的，只存在于方法调用期间，因此与组合或聚合关系相比，其绑定不那么紧密。