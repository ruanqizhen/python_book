# 多继承

## 基本方法

Python 允许类的多继承，只要在定义子类的时候，按顺序指定多个父类即可，比如：

```python
class A(B, C):
    pass
```

上面的代码表示类 A 继承了 B 和 C 两个类，所有的属性和方法。看一个复杂一些示例：

假设有一家家具店，店里只卖两种家具，桌子和椅子。我们编写一个程序来模拟一下家具店里这些家具的属性和方法。那么，我们可以大致如此设计程序：

先编写一个“家具类”，他里面包含了所有家具都共同拥有的属性和方法，比如家具的编号、成本价、税率、主要材料、组装家具方法等等。接下来，可以分别设计“桌子类”，和“椅子类”。这两个类可以继承自“家具类”，这样它们就自动拥有了“家具类”的所有的属性和方法。之后，我们可能还要为它们编写一些专属与它们的属性和方法，比如“桌子类”可以有个“铺桌布”方法；而“椅子类”可以有一个“放置靠枕”方法。这个程序中的类的关系基本就设置好了，根据需要，也许还可以创建一些更加具体的类，比如从“桌子类”还可以派生出“餐桌类”、“办公桌类”等。家具店里的每一个家具实体，都可以是这些类的对象。

这时候，我们突然发现，家具店中还有一类家具，它们既是桌子也是椅子，比如长成这样的：

![images/007.png](images/007.png "合体桌椅")

我们可以叫它合体桌椅，这种合体桌椅即有桌子的属性和方法，也有椅子的属性和方法，最符合直觉的就是它应该同时拥有两个父类：“桌子” 类和 “椅子” 类。它应该把两个父类的属性和方法都继承过来：

```python
# 基类
class Furniture:
    def __init__(self, material, furniture_id, cost):
        self.material = material
        self.id = furniture_id
        self.cost = cost

    def description(self):
        return f"家具编号：{self.id}，主要材料：{self.material}，成本价： ${self.cost}。"

    def assemble(self):
        print(f"家具 {self.id} 已被组装好。")

# 子类
class Chair(Furniture):
    def __init__(self, material, furniture_id, cost, number_of_legs):
        super().__init__(material, furniture_id, cost)
        self.number_of_legs = number_of_legs

    def description(self):
        return super().description() + f"共有 {self.number_of_legs} 条腿。"

    def add_pillow(self):
        print(f"靠枕已被安装在椅子 {self.id} 上。")

# 另一个子类
class Table(Furniture):
    def __init__(self, material, furniture_id, cost, shape):
        super().__init__(material, furniture_id, cost)
        self.shape = shape

    def description(self):
        return super().description() + f"桌子形状： {self.shape}。"

    def lay_tablecloth(self):
        print(f"已经为桌子 {self.id} 铺设了桌布。")

# 多重继承
class ChairWithTableAttached(Chair, Table):
    def __init__(self, material, furniture_id, cost, number_of_legs, shape):
        Furniture.__init__(self, material, furniture_id, cost) # Directly initialize Furniture
        self.number_of_legs = number_of_legs
        self.shape = shape

    def description(self):
        chair_desc = Chair.description(self)
        table_desc = Table.description(self)
        return f"椅子部分：{chair_desc} 桌子部分：{table_desc}"

# 示例
item = ChairWithTableAttached("实木", 101, 150.00, 4, "圆形")
print(item.description())
item.assemble()
item.add_pillow()
item.lay_tablecloth()
```

## 多继承的问题

如果已经熟悉了类的继承，上面的程序还是比较直观的。多继承看起来并不复杂，但是如果深入考虑一下，会发现这里面还有很多问题。 这个“合体桌椅” 类，同时继承桌子和椅子。桌子和椅子类中可能会有一些同名的属性与方法，那么合体桌椅类应该继承谁的呢？

* 有时候可能需要同时保留两个父类里同名的方法，比如桌子和椅子都有 “material” （原材料）方法。“合体桌椅” 类的桌子部分和椅子部分很可能是使用不同材料制造的，所以需要同时保留来自两个父类的 “material” 方法；
* 有时候可能应该在两个父类的同名方法中只保留一份，比如桌子和椅子都有 “cost” （成本价格）方法，合体桌椅毕竟是一个东西，只需要一个价格。
* 更麻烦的情况是，有一个程序用于处理所有的家具，它的输入数据类型是 “家具类”，当有一把合体桌椅被当做 “家具” 类的实例传递给程序后，程序读取了实例的 “material” 方法，这时候读者觉得程序会拿到合体桌椅从桌子类那里继承来的属性，还是从椅子类那里继承来的属性呢？或者还是最早他们共同从 “家具类” 里继承来的属性？

不同编程语言可能有不同的规则来处理以上问题，而且，它还与属性是否在子类中被重写了有关。C++ 是较早的允许多继承的编程语言，但是由于上面这些很容易令人迷惑的问题，多继承带来的问题比它可以解决的问题更麻烦。  其实，编程语言肯定会把上面这些情况该怎么处理都定义的明明白白，问题是规则太复杂，程序员就搞不清楚了。程序员会写出能产生各种莫名其妙结果的代码。学习 C++ 编程经常看到的一个建议就是尽量不要使用多继承。在 C++ 之后才出现的主流编程语言，很多吸取了 C++ 的教训，直接就禁用了类的多继承功能。

在那些禁止多继承的编程语言中，一般采用“接口”来实现一个就用多种不同功能的类。类与接口最核心的区别在于类的继承是为了借用父类已经具有的功能；接口的实现是为了保证类可以提供某些功能。比如，如果我们编写一个“合体桌椅类”，它继承了“桌子类”，这就表示合体桌椅是一种特殊的桌子，合体桌椅会直接借用桌子类已经实现好了的各种功能；另一种情况，如果我们编写了一个“合体桌椅类”它实现了“桌子接口”，那么并不表明餐桌是一种特殊的桌子，它只表示合体桌椅将会提供所有桌子所具有的功能。

接口允许一个特殊的类具有多种不同的功能，而又不必既隶属于这个父类，又隶属于那个父类。避免了那种网状继承关系带来的混乱不堪的数据关系。当然，接口也有缺点，比如，不便于重复利用代码。接口只规定了一个类需要实现的功能，至于实现代码，还是要每个类分别来实现。

## 抽象类

Python 中没有接口的概念，但是有一个非常类似的概念：抽象类。

首先介绍一个概念，抽象方法：抽象方法是指，在父类中声明了一个方法，但是没有具体的实现。子类继承了抽象方法所在的父类之后，必须在子类中，实现该方法。抽象方法所在的父类是不能被实例化的，因为它里面包含了没有被实现的方法，不能被具体对象使用。这种不能实例化，只能被其他类继承的类，就是抽象类。

以上文的家具店为例，它是不应该允许出现一个既不是椅子，也不是桌子，也不是合体桌椅的家具对象的。因为程序中，家具店只有这三类家具，如果出现了一个对象，不属程序中定义的任何一个类，那么很可能是程序员无意间犯的错误。因此，“家具类”就应该是一个抽象类，它不应该生成任何实例。

桌子和椅子既代表了某种功能，也代表了某种家具类型。所以在设计的时候，可以将抽象方法与具体实现方法分离：用 AbstractTable 抽象类来定义桌子必须具备的方法，而是用 Table 普通类来定义一种家具类型。

Python 不像其它一些语言，可以只定义一个函数，却没有实现。所以，把函数设定为抽象函数，是利用装饰器（@abstractmethod）来实现的。而抽象类，则是通过继承一个内置的类 ABC（代表“Abstract Base Class”） 来实现。

比如，上文的家具店，使用抽象类改写后的程序如下：

```python
from abc import ABC, abstractmethod

# 抽象类 Furniture
class Furniture(ABC):
    
    @abstractmethod
    def set_material(self, material):
        pass
    
    @abstractmethod
    def assemble(self):
        pass

# 抽象类 AbstractTable，定义桌子必须具备的方法
class AbstractTable(Furniture):
    
    @abstractmethod
    def place_tablecloth(self):
        pass

# 抽象类 AbstractChair，定义椅子必须具备的方法
class AbstractChair(Furniture):
    
    @abstractmethod
    def place_pillow(self):
        pass
    
# 具体类 Table，实现 AbstractTable 的方法
class Table(AbstractTable):
    
    def set_material(self, material):
        self.material = material
        print(f"Table material set to: {self.material}")

    def assemble(self):
        print("Table has been assembled!")

    def place_tablecloth(self):
        print("Tablecloth has been placed on the table!")

# 具体类 Chair，实现 AbstractChair 的方法
class Chair(AbstractChair):

    def set_material(self, material):
        self.material = material
        print(f"Chair material set to: {self.material}")

    def assemble(self):
        print("Chair has been assembled!")

    def place_pillow(self):
        print("Pillow has been placed on the chair!")
    
# ChairWithTableAttached 类，实现所有桌子和椅子的抽象方法
class ChairWithTableAttached(AbstractTable, AbstractChair):

    def set_material(self, material):
        self.material = material
        print(f"Combined chair and table material set to: {self.material}")

    def assemble(self):
        print("Chair with table attached has been assembled!")

    def place_tablecloth(self):
        print("Tablecloth has been placed on the attached table!")

    def place_pillow(self):
        print("Pillow has been placed on the attached chair!")

# 使用例子
table = Table()
table.set_material("Glass")
table.assemble()
table.place_tablecloth()

chair = Chair()
chair.set_material("Leather")
chair.assemble()
chair.place_pillow()

combo = ChairWithTableAttached()
combo.set_material("Wood")
combo.assemble()
combo.place_tablecloth()
combo.place_pillow()
```



## MixIn

抽象类与接口类似，它们的优缺点很像，抽象类同样没有解决代码重用的问题，就比如上面例子中， set_material 这个方法，在每个类中都要被实现一次，尽管每次的实现方法都一样。

实际上，Python 虽然允许类的多继承，但却可以有效避免这种混乱继承关系带来的数据定义不清楚的问题。其根本原因还是在于前文提到过的 Python 所采用的“鸭子类型”策略。在 Python 程序中，重点关注对象的行为，而不是对象的类型。针对上面的例子来说，就是“合体桌椅类”类是不是继承自“桌子类”，并不重要，根本不影响它在程序中的使用；“合体桌椅类”中有没有实现桌子所需的功能才至关重要。这本身已经有点接近其它语言中“接口”的含义了。

因此，在 Python 中，设计类的继承关系的时候，应该重点考虑的不是类的隶属关系，比如桌子是不是一种特殊的家具，合体桌椅是不是一种特殊的桌子等，这都不重要。重要的是如何利用继承来获取一个类所需的功能。基于这一点，Python 中更广为使用的是 Mixin 设计方法。

简单来说，MixIn 是一种小型的、可重复使用的类，它为其他类提供了一套附加的方法，但不应被认为是一个完整的类。每个 MixIn 执行一个特定的任务。MixIn 通常不能独立工作，它们是被设计出来与其他类一起使用的。理论上，MixIn 应该是没有实例属性或状态的。他们提供方法而不维护状态。比如，我们重新设计一下家具店程序：

首先，我们可以识别出一些特性或功能，将它们抽象为 MixIns。例如：

MaterialMixin: 定义家具的材料。
AssemblyMixin: 为家具定义组装方法。
PillowPlacementMixin: 为椅子定义放置靠枕的方法。
TableclothMixin: 为桌子定义铺桌布的方法。


```python
# 定义 MixIns
class MaterialMixin:
    material = "未知材料"
    
    def set_material(self, material):
        self.material = material
        print(f"材料设置为: {self.material}")


class AssemblyMixin:
    def assemble(self):
        print("家具已被组装好。")


class PillowPlacementMixin:
    def place_pillow(self):
        print("靠枕已被安装在椅子上。")


class TableclothMixin:
    def place_tablecloth(self):
        print("已经为桌子铺设了桌布。")


# 使用 MixIns 重构原来的类
class Furniture(MaterialMixin, AssemblyMixin):
    def __init__(self, id, cost):
        self.id = id
        self.cost = cost


class Chair(Furniture, PillowPlacementMixin):
    def __init__(self, id, cost, number_of_legs=4):
        super().__init__(id, cost)
        self.number_of_legs = number_of_legs


class Table(Furniture, TableclothMixin):
    def __init__(self, id, cost, shape="圆形"):
        super().__init__(id, cost)
        self.shape = shape


class ChairWithTableAttached(Furniture, PillowPlacementMixin, TableclothMixin):
    def __init__(self, id, cost, number_of_legs=4, shape="圆形"):
        super().__init__(id, cost)
        self.number_of_legs = number_of_legs
        self.shape = shape


# 使用例子
combo = ChairWithTableAttached("101", 150.00, 4, "圆形")
combo.set_material("实木")
combo.assemble()
combo.place_pillow()
combo.place_tablecloth()

```




Python 如果某个同名的属性或方法在父类和子类中都有实现，那么在调用的时候，总是会先找子类，再找父类。如果有多个父类，就按照继承时的书写顺序来找，具体到上面的示例就是按照 ChairWithTableAttached -> Furniture -> PillowPlacementMixin -> MaterialMixin -> AssemblyMixin -> PillowPlacementMixin 的顺序来查找。实在不放心，可以使用对象的一个特殊属性 `__mro__` 来查看：

```python
print(ChairWithTableAttached.__mro__)
```


