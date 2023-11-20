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
chick = Animal("花冠", "Chick")

print(dog.name)       # 输出： 旺财
print(chick.name)     # 输出： 花冠
```

上面程序中，Animal 类的 `__init__` 初始化函数，除了 self 之外，还有两个参数 name 和 species，分别表示动物的名字和品种。有了初始化函数，我们就可以在创建对象时，为类传递必要的参数了，比如 `Animal("旺财", "狗")` 会创建一个名为旺财，品种为狗的动物类实例。

Python 中，每个类只能有一个构造函数，不像其它很多编程语言，可以为一个类创建具有不同参数的多个构造函数。

### 对象方法

大多数支持面向对象的编程语言（C++、Java 等），为了数据的安全性，都允许把类的变量设为私有，也就是不允许在类之外访问。但是 Python 中没有这样的设置，为了保证数据安全，我们应该尽量避免在类的外部直接访问类的数据，而是应该通过调用类定义的方法，来间接的方位类中的数据。比如，为了得到动物的名字，我们可以在类中定义一个函数来负责得到 name 数据。需要得到某个实例的 name 属性时，应该调用这个函数，而不是直接方位属性：

```python
class Animal:
    def __init__(self, name, species):
        self.name = name
        self.species = species

    def speak(self):
        print("Some generic sound")

    def eat(self):
        print(f"{self.name} is eating.")

# 使用：
dog = Animal("旺财", "Dog")
dog.speak()       # 输出： Some generic sound
dog.eat()         # 输出： 旺财 is eating.
```

### 类方法

与属性类似，方法也分对象方法和类方法。

类方法是与类而非其实例关联的方法。类方法的第一个参数通常是指代类本身的参数，习惯上命名为 cls。这与实例方法的第一个参数为 self 不同。如果我们希望某个方法不与任何实例特定的状态相关，而是与类的状态相关时，类方法就派上了用场。或者当方法不需要访问任何实例特定的属性或方法，但仍需要了解类的一些属性时，也可以使用它。

比如我们需要统计，总共创建了多少个动物，这一数据与任何一个具体的动物实例都无关，它只与 Animal 本身相关。那么我们就可以定义一个类方法 total_animals() 来返回我们需要的数据。

类方法使用 @classmethod 装饰器来声明，也就是在定义 total_animals() 函数的上方要加上 `@classmethod` 这一行文字。关于装饰器，后文会有详解。在类方法内，使用 cls 获取类本身的数据。在类方法之外，直接使用类名获取类的数据：

```python
class Animal:
    total_animals = 0  # 类变量，跟踪创建的动物数量

    def __init__(self, species):
        self.species = species
        Animal.total_animals += 1

    # 类方法
    @classmethod
    def total_animals(cls):
        return cls.total_animals
        
cat = Animal("Cat")
dog = Animal("Dog")

# 使用类方法
print(Animal.total_animals())  # 输出： 2
print(cat.total_animals())     # 输出： 2， 等价于直接使用类型调用
```

在上面的程序中，每次 `__init__()` 方法被调用，也就是每创建新实例，变量 total_animals 的数值就会增加 1。由此，我们就可以统计目前总共有多少动物了。

### 静态方法：

如果在实现某个功能时，不需要访问实例或类的任何属性，那么应该使用静态方法。静态方法如果放在类的外面，作为一个普通函数，功能上也不会有任何区别。放在类里面更多的是为了实现类的封装，相关的方法和数据应该尽量组织在一起。

静态方法使用 @staticmethod 装饰器来声明。它的使用方法与类方法相同。

比如，我们可以为 Animal 类添加一个静态方法，根据动物的叫声来判断动物是否健康。它不需要用到任何类或实例的属性，仅根据输入的声音做判断：

```python
class Animal:
    @staticmethod
    def is_healthy(sound):
        return sound != "silent"


# 使用静态方法
sound = "barking"
print(Animal.is_healthy(sound))   输出： True
```

## 访问限制

多数面向对象的编程语言都可以限制类成员变量与方法的访问权限，以保护安全，比如 Java 中可以使用 private 关键字限制成员变量和函数。但 Python 对此的限制过于宽松了，类中的任何数据与方法都是对外公开的。我们只能使用一些命名规范，来提醒其它人，某些变量与函数应当是私有的，不要强行访问。

最常见的方法在变量或函数的名字前面加一个下划线。这意味着它们不应该在类的外部被访问，虽然实际上仍然可以被访问。这只是一种命名约定，而不是强制性的访问控制。比如：

```python
class MyClass:
    def __init__(self):
        self._protected_variable = "Protected"
    
    def _protected_method(self):
        return "This is a protected method"
```

变量或函数的名字前面加双下划线会更安全一些，因为这样的变量或函数会在内部被名称改写，使其变得不容易从外部访问。比如：

```python
class MyClass:
    def __init__(self):
        self.__private_variable = "Private"
    
    def __private_method(self):
        return "This is a private method"
```

在上面的代码中，`__private_variable` 和 `__private_method` 在内部实际上被改写为 `_MyClass__private_variable` 和 `_MyClass__private_method`。这种改写是自动的，所以从类的外部直接访问 `__private_variable` 会导致一个属性错误。

总的来说，Python 依赖于命名约定和开发者的自律来控制访问权限。

## 继承

在 Python 中，一个类（子类）可以继承另一个类（父类或基类）的属性和方法。这种机制允许我们在创建了一个通用的父类之后，派生出特定的子类，子类能够复用利用父类的功能，并加以扩展。

以下是一个示例，其中有一个 Animal 类和一个从 Animal 类继承的 Dog 类：

```python
# 定义父类
class Animal:
    def __init__(self, species):
        self.species = species

    def speak(self):
        print(f"I am an {self.species}")

# 定义子类
class Dog(Animal):  # 在括号内指定父类名字，表示继承
    def __init__(self, name, breed):
        # 调用父类的构造方法
        super().__init__(species="Dog")
        self.name = name
        self.breed = breed

    # 重写父类的方法
    def speak(self):
        print(f"I am a {self.breed} named {self.name} and I bark!")

    # 子类特有的方法
    def wag_tail(self):
        print(f"{self.name} is wagging its tail!")
```
        
在上面的程序中，Animal 是一个基类，有一个 species 属性和一个 speak 方法。Dog 类在其定义时通过在括号内指定 Animal 来表示它从 Animal 类继承。

在子类的方法中，使用 super() 函数允许我们调用父类的方法。在 Dog 的构造方法中，我们使用 super().__init__(species="Dog") 来调用 Animal 类的初始化方法。

如果子类有与父类同名的方法，那么子类的方法会覆盖父类的方法。在这里，Dog 类重写了 speak 方法。子类可以定义新的方法。例如，Dog 类定义了一个新方法 wag_tail。

下面的代码是对以上两个类的演示：

```python
dog = Dog(name="旺财", breed="Golden Retriever")
dog.speak()     # 输出: I am a Golden Retriever named 旺财 and I bark!
dog.wag_tail()  # 输出: 旺财 is wagging its tail!

cat = Animal(species="Cat")
cat.speak()     # 输出: I am an Cat
```

类继承为我们提供了一个有效的方法来组织和重用代码，同时还能够利用多态性提高代码的灵活性。

## 多态

有 Java、C++ 经验的读者应该已经比较了解多态的概念了。但是 Python 中对于多态的实现与 Java 等经典的面向对象的编程语言有所不同。Java 中的多态是基于类或接口的继承来实现的，父类中的方法，可以在不同子类中有不同的实现。但 Python 的多态是基于“鸭子类型”实现的。

“鸭子类型”是一个编程术语，它来自于这样一个说法：“如果有一只鸟走路像鸭子、游泳像鸭子、叫声像鸭子，那么它就是鸭子。” 在 Python 中，鸭子类型意味着对象的类型或类别是由它的行为（即它所拥有的方法）决定的，而不是它所继承父类或它自身的类型决定的。相比基于继承实现的多态，鸭子类型重点关注对象的行为，而不是对象的类型。它提高了代码的灵活性和可重用性。允许开发者更加关注功能和行为，而不是细节和形式。

下面的代码演示了鸭子类型：

```python
class Cat:
    def speak(self):
        return "Meow!"

class Dog:
    def speak(self):
        return "Woof!"

def animal_voice(animal):
    return animal.speak()

cat = Cat()
dog = Dog()

# 由于 Cat 和 Dog 都有 speak 方法，所以它们可以被 animal_voice 函数所处理
print(animal_voice(cat))  # 输出: Meow!
print(animal_voice(dog))  # 输出: Woof!
```

在上面的代码中，我们并不关心 animal 的具体类型，只关心它是否有一个 speak 方法。这就是鸭子类型的体现。当动物们的 speak 方法被调用时，它们的行为是不同的，属于不同类的对象给出了不同的声音。这就是多态的体现。
Python 之所以可以采用鸭子类型，是因为 Python 语言并不检查变量与参数的数据类型，我们可以把任何类型的对象传递给一个函数。而在 Java 这类轻质类型检查的语言中，是不可能把任何对象都传递给一个函数的，它必须限定输入的对象只能是某各个类极其子孙类的对象。