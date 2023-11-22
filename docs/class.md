# 类

## 创建类

在 Python 中，可以使用 class 关键字来创建类。类中包含了对象的属性（实例变量）和方法（函数）。比如我们可以创建一个“动物”类可以作为面向对象编程的入门示例。我们会从基本定义开始，逐步增加细节。

```python
class Animal:
    pass
```

class 后面紧接着是类名，我们给动物类起名 Animal，类名通常是大写开头的单词。有时候类名后面会在跟一个括号，括号中的是新定义的类的父类，后文会演示如何指定父类。如果没有指明父类，表示默认从 Python 预定义的 object 类继承。Python 程序中，所有的类都是 object 类的子孙类。

### 类的对象

在程序中直接使用一个类的情况是比较少的，多数情况下，我们会为一个类创建一个或数个对象，然后访问对象的属性或方法。在程序中写出类的名字，然后加上一个括号，就可以生成一个新的类的对象。如果在变量赋值表达式的右侧生成新的对象，就可以让变量指向这个新生成的对象：

```
dog = Animal()
```

## 属性

Python 中要区分“类的属性”，和“对象的属性”。在多数其它语言中，这两项是不区分的。

在类中添加一些变量，这些变量就会成为类的属性。比如，我们可以为类添加一个属性 total_animals，用于统计总共创建了多少个动物：

```python
class Animal:
    total_animals = 0  # 类变量，跟踪创建的动物数量

dog = Animal()
print(Animal.total_animals)   # 输出： 0， 直接使用类名进行访问
print(dog.total_animals)      # 输出： 0， 也可以通过实例进行访问
```

访问类的属性的时候，在类名的后面加一个点号 `.` 然后加上属性的名字即可。如果类的对象中没有同名的属性，那么通过对象读取这个属性，它会自动返回类的属性的值。比如上面示例中 `dog.total_animals`，dog 对象并没有 total_animals 属性，但是它会返回 Animal 类相应的属性的值。

对象的属性，可以通过变量赋值语句进行添加，比如，为新生成的对象 dog 添加一个名为 age 的属性：

```python
class Animal:
    name = '旺财'

dog = Animal()
dog.age = 3
print(dog.age)   # 输出： 3
```

`dog.age` 就表示 dog 对象的名为 age 的属性。

## 方法

在 Python 中，方法是一种特殊的属性。关于这一点，我们将在[动态访问属性和方法](objects#动态访问属性和方法)中进行解释。在这里，我们还是把它们区分开来，分别介绍一下。

### 初始化函数

初始函数也被称为构造函数、构造方法。

创建对象之后，再为其设置属性值，并不是好的编程方式。最好是在创建对象的同时，就把属性的初始值都设置好。我们可以使用类的初始化方法来达到这一目的。类的初始化函数 `__init__` 是一个特殊的方法，当创建类的新实例时，它会自动被调用。后文，我们将还会介绍其它一些 Python 定义的[类的特殊方法](magic_methods)，它们的函数名都是用双下划线开始和结尾的。`__init__` 方法的第一个参数必须是 self。self 是一个指向实例本身的参数，它也必须作为类中每一个对象方法的第一个参数。当调用对象的方法时，Python 会自动传递当前对象的引用给 self。

```python
class Animal:
    def __init__(self, name, species):
        self.name = name
        self.species = species

# 使用：
dog = Animal("旺财", "狗")
chick = Animal("花冠", "鸡")

print(dog.name)       # 输出： 旺财 
print(chick.name)     # 输出： 花冠
```

上面程序中，Animal 类的 `__init__` 初始化函数，除了 self 之外，还有两个参数 name 和 species，分别表示动物的名字和品种。有了初始化函数，我们就可以在创建对象时，为类传递必要的参数了，比如 `Animal("旺财", "狗")` 会创建一个名为旺财，品种为狗的动物类实例。在构造函数中，它通过为 `self.name` 和 `self.species` 赋值，创建了两个对象属性的值。

在一个类中，是可以存在同名的类属性和对象属性的。但是，如果有重名存在，就不能再通过对象来访问类属性了：

```python
class Animal:
    name = "动物"
    def __init__(self, name, species):
        self.name = name
        self.species = species

# 使用：
dog = Animal("旺财", "狗")

print(Animal.name)     # 输出： 动物 - 使用类名访问类属性
print(dog.name)        # 输出： 旺财 - 通过对象访问对象属性
```

Python 中，每个类只能有一个构造函数，不像其它很多编程语言，可以为一个类创建具有不同参数的多个构造函数。如果需要使用多种不同的参数创建一个类的实例，可以使用使用[工厂方法](class#工厂方法)。


### 对象方法

对象的方法（简称为“方法”）是属于对象的函数。它们在类中被定义，可以在该类的对象上被调用。方法用于实现对象的一些行为或操作。比如，一个动物可以吃饭，可以发出叫声，那么我们就可以为 Animal 的对象添加一个 eat() 方法和一个 speak() 方法：

```python
class Animal:
    def __init__(self, name, species):
        self.name = name
        self.species = species

    def speak(self):
        print("这是默认声音。")

    def eat(self):
        print(f"{self.name} 正在吃饭。")

# 使用：
dog = Animal("旺财", "狗")
dog.speak()       # 输出： 这是默认声音。
dog.eat()         # 输出： 旺财 正在吃饭。
```

方法与对象是绑定的，这意味着方法可以访问与它绑定的对象的属性和其他方法，也可以修改绑定对象的数据。但是它不能够直接访问其它对象的数据。在定义对象方法时，第一个参数必须是 self，它代表对象本身。通过 self，方法可以访问和修改对象的属性和调用其他方法。

### 类方法

与属性类似，除了有对象方法，还有类方法。

类方法是与类而非其对象绑定的方法。类方法的第一个参数通常是指代类本身的参数，习惯上命名为 cls。这与对象方法的第一个参数为 self 不同。如果我们希望某个方法不与任何特定对象的状态相关，而是与类的状态相关时，类方法就派上了用场。或者当方法不需要访问任何实例特定的属性或方法，但仍需要了解类的一些属性时，也可以使用它。

比如我们需要统计，总共创建了多少个动物，这一数据与任何一个具体的动物实例都无关，它只与 Animal 本身相关。那么我们就可以定义一个类方法 get_total_animals() 来返回我们需要的数据。

类方法使用 @classmethod [装饰器](decorator)来声明，也就是在定义 get_total_animals() 函数的上方要加上 `@classmethod` 这一行文字。在类方法内，使用 cls 获取类本身的数据。在类方法之外，直接使用类名获取类的数据：

```python
class Animal:
    total_animals = 0  # 类变量，跟踪创建的动物数量

    def __init__(self, species):
        self.species = species
        Animal.total_animals += 1

    # 类方法
    @classmethod
    def get_total_animals(cls):
        return cls.total_animals
        
cat = Animal("猫")
dog = Animal("狗")

# 使用类方法
print(Animal.get_total_animals())  # 输出： 2
print(cat.get_total_animals())     # 输出： 2， 这等价于直接使用类型调用
```

在上面的程序中，每次 `__init__()` 方法被调用，也就是每创建一个新实例，变量 total_animals 的数值就会增加 1。由此，我们就可以统计目前总共有多少动物了。

要注意的是，与属性不同，类中不能有同名的类方法和对象方法。如果两个函数定义重名，后定义的函数会覆盖前面的函数。

在其它多数主流语言中，是不存在类方法、类属性这种概念的，它们所有的方法都是针对对象的。但是在 Python 语言中，[一切都是对象](objects)：数据是对象；函数是对象；类本身也是一种对象，尽管它还能去生成别的对象。因此，类本身作为一种对象，可以有它自己的属性和方法。


#### 工厂方法

类方法一个比较典型的应用是用于工厂方法。工厂方法是一种用于创建对象的函数，它可以比构造函数更复杂，通常用于创建具有一定复杂度的对象，特别是当对象的创建需要依赖于某些动态条件或者涉及到复杂的初始化过程时。复杂的工厂函数可以创建多种不同类的对象，我们这里用一个简单示例做演示，它可以生成一个 Animal 对象，但是它具备一些和 Animal 构造函数不同的参数：

```python
class Animal:
    total_animals = 0  # 类变量，跟踪创建的动物数量

    def __init__(self, species):
        self.species = species
        Animal.total_animals += 1

    # 类方法，用于获取总动物数
    @classmethod
    def get_total_animals(cls):
        return cls.total_animals

    # 工厂方法，用于创建复杂的动物对象
    @classmethod
    def create_complex_animal(cls, species, age, gender):
        animal = cls(species, age, gender)
        animal.age = age
        animal.gender = gender
        return animal

# 使用工厂方法创建一个动物
complex_animal = Animal.create_complex_animal("熊猫", 5, "雄性")

# 检查新创建的复杂动物的属性
print(f"类型：{complex_animal.species}；年龄：{complex_animal.age}；性别：{complex_animal.gender}")

# 输出：
# 类型：熊猫；年龄：5；性别：雄性
```

### 静态方法：

如果在实现某个功能时，不需要访问实例或类的任何属性，那么应该使用静态方法。静态方法如果放在类的外面，作为一个普通函数，功能上也不会有任何区别。放在类里面更多的是为了实现类的封装，相关的方法和数据应该尽量组织在一起。

静态方法使用 @staticmethod 装饰器来声明。它的使用方法与类方法相同。比如，我们可以为 Animal 类添加一个静态方法，根据动物的叫声来判断动物是否健康。它不需要用到任何类或实例的属性，仅根据输入的声音做判断：

```python
class Animal:
    @staticmethod
    def is_healthy(sound):
        return sound != "silent"


# 使用静态方法
sound = "barking"
print(Animal.is_healthy(sound))   输出： True
```

静态方法非常适合存放一些公共函数、常用的工具函数、辅助函数等。这样不需要创建对象，这些函数即可被其它代码调用。比如下面的示例中，一个作为工具函数的计算两点间距离的函数设置为了静态方法：

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    @staticmethod
    def distance(p1, p2):
        """计算两点之间的距离"""
        return ((p1.x - p2.x)**2 + (p1.y - p2.y)**2)**0.5


p1 = Point(1, 2)
p2 = Point(3, 4)

print(Point.distance(p1, p2))
```

## 继承

一个类（子类）可以继承另一个类（父类或基类）的属性和方法。这种机制允许使得子类能够直接利用父类的功能，并加以扩展。以下是一个示例，其中有一个 Animal 类和一个从 Animal 类继承的 Dog 类：

```python
# 定义父类
class Animal:
    def __init__(self, species):
        self.species = species

    def speak(self):
        print(f"我是一只{self.species}")

# 定义子类
class Dog(Animal):  # 在括号内指定父类名字，表示继承
    def __init__(self, name, breed):
        # 调用父类的构造方法
        super().__init__(species="狗")
        self.name = name
        self.breed = breed

    # 重写父类的方法
    def speak(self):
        print(f"我是一条{self.breed}，名叫：{self.name}。我会汪汪叫。")

    # 子类特有的方法
    def wag_tail(self):
        print(f"{self.name}正在摇尾巴。")
```
        
在上面的程序中，Animal 是一个基类，有一个 species 属性和一个 speak 方法。Dog 类在其定义时通过在括号内指定 Animal 来表示它从 Animal 类继承。子类 Dog 直接就具备了父类 Animal 的所有属性和方法。如果在子类中不重写这些属性和方法的话，对于子类的对象，程序会自动使用它们父类中的属性和方法。如果子类重写了这些属性和方法，也就定义了重名的属性和方法，那么针对子类的对象，程序会采用子类中重新定义的属性与方法。

在这个示例中，Dog 类重写了父类的 构造方法和 speak 方法。在子类重写的方法中，可以使用 super() 函数来调用父类中相对应的方法。比如在 Dog 的构造方法中，我们使用 `super().__init__(species="狗")` 来调用 Animal 类的初始化方法。

子类也可以定义全新的方法。例如，Dog 类定义了一个新方法 wag_tail。

下面的代码是对以上两个类的演示：

```python
dog = Dog(name="旺财", breed="金毛猎犬")
dog.speak()     # 输出: 我是一条金毛猎犬，名叫：旺财。我会汪汪叫。
dog.wag_tail()  # 输出: 旺财正在摇尾巴。

cat = Animal(species="猫")
cat.speak()     # 输出: 我是一只猫
```

类继承为我们提供了一个有效的方法来组织和重用代码，同时还能够利用多态性提高代码的灵活性。

## 多态

有 Java、C++ 经验的读者应该已经比较了解多态的概念了。但是 Python 中对于多态的实现与 Java 等经典的面向对象的编程语言有所不同。Java 中的多态是基于类或接口的继承来实现的，父类中的方法，可以在不同子类中有不同的实现。但 Python 的多态是基于“鸭子类型”实现的。

“鸭子类型”是一个编程术语，它来自于这样一个说法：“如果有一只鸟走路像鸭子、游泳像鸭子、叫声像鸭子，那么它就是鸭子。” 在 Python 中，鸭子类型意味着：对象的类型或类别是由它的行为（即它所拥有的方法）决定的，而不是由它所继承父类或它自身的类型决定的。相比基于继承实现的多态，鸭子类型重点关注对象中实现的方法，而不是对象的类型。它提高了代码的灵活性和可重用性。允许开发者更加关注功能和行为，而不是形式。

下面的代码演示了鸭子类型：

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

# 由于 Cat 和 Dog 都有 speak 方法，所以它们可以被 animal_voice 函数所处理
print(animal_voice(cat))  # 输出: 喵喵！
print(animal_voice(dog))  # 输出: 汪汪！
```

在上面的代码中，我们并不关心 animal 的具体类型，只关心它是否有一个 speak 方法。这就是鸭子类型的体现。当动物们的 speak 方法被调用时，它们的行为是不同的，属于不同类的对象给出了不同的声音。这就是多态的体现。
Python 之所以可以采用鸭子类型，是因为 Python 语言并不检查变量与参数的数据类型，我们可以把任何类型的对象传递给一个函数。而在 Java 这类轻质类型检查的语言中，是不可能把任何对象都传递给一个函数的，它必须限定输入的对象只能是某各个类极其子孙类的对象。



## 访问限制

大多数支持面向对象的编程语言（C++、Java 等），为了数据的安全性，都允许把类的变量设为私有，也就是不允许在类之外访问。比如 Java 中可以使用 private 关键字限制成员变量和函数。但是 Python 中没有这样的设置，类中的任何数据与方法都是对外公开的。

### 命名规范

尽管我们无法阻止数据和方法被访问，但还是还可以使用一些命名规范，来提醒其他人，某些变量与函数应当是私有的，不要强行访问。最常见的方法在变量或函数的名字前面加一个下划线。这意味着它们不应该在类的外部被访问，虽然这只是一种命名约定，而不是强制性的访问控制，但多数情况下，提醒作用就已经足够了。比如：

```python
class MyClass:
    def __init__(self):
        self._protected_variable = "Protected"
    
    def _protected_method(self):
        return "这是一个受保护方法"
```

变量或函数的名字前面加双下划线会更安全一些，因为这样的变量或函数会在内部被名称改写，使其变得不容易从外部访问。比如：

```python
class MyClass:
    def __init__(self):
        self.__private_variable = "Private"
    
    def __private_method(self):
        return "这是一个私有方法"
```

在上面的代码中，`__private_variable` 和 `__private_method` 在内部实际上被改写为 `_MyClass__private_variable` 和 `_MyClass__private_method`。这种改写是自动的，所以从类的外部直接访问 `__private_variable` 会导致一个属性错误。

总的来说，Python 依赖于命名约定和开发者的自律来控制访问权限。

### 隐藏数据

Python 中类的属性不是特别安全，它不能控制访问权限，也无法限制取值范围。一个解决思路是：把所有属性都当做是私有的，不直接读写属性，而是通过调用方法来间接访问类中的数据。方法中可以实现更复杂的功能，比如，加入数值范围检查等。这样，就可以实现一些更复杂的逻辑来确保数据安全、正确。比如，为了得到动物的名字，我们可以在类中定义一个函数来负责得到 name 数据。需要得到某个实例的 name 属性时，应该调用这个函数，而不是直接访问属性：

```python
class Animal:
    def __init__(self, name):
        self._name = name

    def get_name(self):
        return self._name


def main():
    animal = Animal("旺财")

    # 不推荐直接访问类的数据
    # print(animal._name)

    # 推荐通过调用方法访问类的数据
    print(animal.get_name())

if __name__ == "__main__":
    main()
```

Python 中已经有一些现成的工具来帮助编写用于数据访问的方法，就是属性装饰器。

### 属性装饰器

类的方法使用起来，比访问类的属性稍微麻烦一点：有的方法用来读数据，有的用来写数据，如果命名又不规则，就更不方便了。为了解决这个问题，Python 内建了一个名为 @property 的装饰器，专门用于装饰器将类的方法转换为相同名称的属性。@property 经常与 setter 和 deleter 装饰器一起使用，用以控制属性的读取、设置和删除行为。这使得开发者可以在访问、设置和删除属性时插入自定义的逻辑，从而提供更好的封装和数据验证。

以下是一个 Circle 类的简单示例，它使用了 @property 等装饰器来管理圆的半径和面积：

```python
class Circle:
    def __init__(self, radius):
        self._radius = radius
    
    @property
    def radius(self):
        """获取圆的半径"""
        return self._radius
    
    @radius.setter
    def radius(self, value):
        """设置圆的半径，并确保它是一个正数"""
        if value <= 0:
            raise ValueError("半径必须是正数")
        self._radius = value
        
    @radius.deleter
    def radius(self):
        """禁止删除半径属性，并打印一条消息"""
        print("半径属性不能被删除!")
        # 如果需要删除，可以调用 del self._radius
    
    @property
    def area(self):
        """计算圆的面积"""
        return 3.14 * self._radius * self._radius

# 测试：
c = Circle(5)    # 创建一个半径为 5 的圆的对象
print(c.radius)  # 输出: 5
print(c.area)    # 输出: 78.5

c.radius = 3     # 通过 setter 方法设置半径
print(c.radius)  # 输出: 3
print(c.area)    # 输出: 28.26

# 运行下列代码，程序会出错
# c.radius = -2  # 无效半径，这将抛出 ValueError
# c.area = 5     # 只读属性不可写，这将抛出 AttributeError
```

在上面的示例中，radius 是一个使用 @property 装饰的方法，因此可以像访问普通属性一样访问它。@radius.setter 是一个设置器，用它装饰的方法负责设置 radius 属性的值，在示例中，设置圆的半径之前，还对输入数据进行了验证，确保输入的半径不是负数。@radius.deleter 装饰的方法会在删除属性时调用，在示例中，我们用它禁止了删除半径这一行为，因为圆必须有一个半径属性。

@property 装饰器本身只能装饰属性的读取行为，因此，只有 @property 装饰的 area 是一个只读属性，定义了读取方法，没有定义设置方法。

通过使用 @property，我们可以确保 Circle 类的状态始终保持一致，并简化了调用代码。笔者建议类中的属性都应该尽量使用属性装饰器来实现。


