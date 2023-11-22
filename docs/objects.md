# 全都是对象

几乎所有在 Python 代码中使用的东西都是对象，无论是数据，如数字、字符串、列表等，还是函数、类、模块等。这意味着它们都具有对象的特性和行为，比如都具有属性和方法，并且可以被赋值给变量、作为参数传递给函数，或者作为函数的返回值。

## 对象的类型

type() 函数是 Python 中的一个内置函数，它主要有两种用途，一是用于获取对象的类型；另一个更复杂的功能，我们将在下文的“元类”中介绍。

把一个对象作为参数传递给 type() 函数，它就可以返回这个对象的类型，比如：

```python
# Python 内置的对象
x = 7
print(type(x))        # 输出: <class 'int'>

y = "Hello"
print(type(y))        # 输出: <class 'str'>

z = [1, 2, 3]
print(type(z))        # 输出: <class 'list'>

print(type(print))    # 输出: <class 'builtin_function_or_method'>

my_func = lambda x: x*x
print(type(my_func))  # 输出: <class 'function'>

import sys
print(type(sys))      # 输出: <class 'module'>

class MyClass:
    pass

obj = MyClass()
print(type(obj))      # 输出: <class '__main__.MyClass'>

print(type(object))   # 输出: <class 'type'>

print(type(MyClass))  # 输出: <class 'type'>

print(type(type))     # 输出: <class 'type'>
```

从上面的示例中可以看出，数据、函数、对象或类本身都是对象，它们分别是一些不同类型的对象。比如： 7 是 int 类的对象；print 函数是 builtin_function_or_method 类的对象；自定义函数式 function 类的对象；而自定义的类则是 type 类的对象。

## 函数对象

从上文已经知道了，函数也是一种对象，那么它和其它对象有什么区别呢？

简单来说，如果一个对象实现了 `__call__` 方法，那么它就可以被当做是函数。`__call__` 方法是 Python 预定义的一个特殊方法，就好比 `__init__` 也是一个预定义的特殊方法一样。

当程序试图去调用一个对象的时候，它实际上会去自动调用该实例的 `__call__` 方法，所以，如果这个对象实现了 `__call__` 方法，调用就会成功，这个对象也就是一个函数了。这是一个比较有趣的方法，它可以把任何一个对象都转换成函数，或者说可以让对象行为看起来像函数，这使得对象更加灵活和多变。

例如：假设我们想创建一个类，它的对象可以被调用来计算多项式的值。例如，为输入的 x，计算 $3x^2 + 4x + 10$ 的值。


```python
class Polynomial:
    def __init__(self, coefficients):
        """coefficients 是一个列表，其中第 i 个元素是 x^i 的系数"""
        self.coefficients = coefficients

    def __call__(self, x):
        """计算多项式的值给定 x"""
        return sum([coef * (x ** (len(self.coefficients) - i - 1)) for i, coef in enumerate(self.coefficients)])

    def __repr__(self):
        return " + ".join([f"{coef}x^{(len(self.coefficients) - i - 1)}" for i, coef in enumerate(self.coefficients) if coef])

# 创建一个多项式对象：3x^2 + 4x + 10
p = Polynomial([3, 4, 10])

# 调用这个对象来计算 x=2 的值
print(p(2))  # 输出: 30

# 输出多项式本身
print(p)  # 输出: 3x^2 + 4x^1 + 10x^0
```

在上面的示例中，`__call__` 方法使得 Polynomial 类的实例可以被调用。我们只需使用一个数字作为参数（在上述例子中是2），就可以计算多项式在该输入时的值。

Python 自带的 callable() 函数可以检查一个对象是否“可调用”。如果一个对象实现了 `__call__` 方法，对它调用 callable() 函数会返回真。这也就意味着这个对象是一个函数，我们可以使用函数的方式来调用这个对象。

当我们现在再来审视“[函数是一等公民](first_class_func)”这句话的时候，我们会意识到，原来在 Python 中，函数并没有什么特殊：在 Python 中，人人平等，大家都是对象。

## 反射

反射（Reflection）是指程序在运行时能够访问、检测和修改自身状态或行为的能力。

### 静态访问属性和方法

我们之前所有的示例中，访问对象的属性或方法，使用的都是静态方法。比如：

```python
class Animal:
    def __init__(self, species):
        self.species = species

    def speak(self):
        print(f"{self.species}发出了声音")

# 创建对象
dog = Animal("狗")
dog.speak() 
```

在上面的示例程序中，我们生成了一个 Animal 的对象 dog，并且静态调用了它的方法 speak()。注意，这里并不是说 speak 是“静态方法”，它是一个对象方法，我们是“静态调用”了这个方法。所谓静态调用，就是在程序代码中已经写好了这个方法的名字。程序在运行时不能改变了。除了这种静态访问属性和调用方法的方式，Python 中，我们还可以在程序中动态的去查看一个对象有哪些属性和方法，然后访问和调用这些属性和方法。

### 列出所有属性和方法

dir() 函数可以列出一个对象的所有属性和方法。dir() 函数返回一个字符串列表，其中包含了对象的所有属性和方法名称，包括从其类的基类继承的属性和方法。比如：

```python
class Animal:
    def __init__(self, species):
        self.species = species

    def speak(self):
        print(f"{self.species}发出了声音")

# 创建对象
dog = Animal("狗")

# 列出 dog 的所有属性和方法
print(dir(dog))
```

运行上面的程序，它会打印出 dog 对象所有的属性和方法，包括继承来的那些： `['__class__', '__delattr__', '__dict__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__le__', '__lt__', '__module__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', 'speak', 'species']`


为什么没有区分属性和方法呢？哪些是属性，哪些是方法？我们下面来仔细分析：

### 动态访问属性

使用 getattr, setattr, 和 hasattr 等函数动态地访问和设置对象的属性和方法，也就是实现了反射功能。

* hasattr(object, name) 函数用于检查对象是否具有给定的属性或方法。它返回一个布尔值，指示对象是否具有指定的属性。
* getattr(object, name[, default])  函数用于获取对象的属性或方法。如果属性或方法不存在，它会返回指定的默认值，若没有指定默认值则会抛出 AttributeError。
* setattr(object, name, value) 函数用于设置对象的属性或方法。如果属性或方法已存在，它的值会被更新；如果属性或方法不存在，将创建一个新的属性或方法。

上面这三个函数中都有类似的参数，其中 object 参数表示被访问或设置的对象； name 表示属性或方法的名字，这是一个字符串表示的名字。换句话说，我们可以把一个字符串变量表示的属性名传递给上面几个函数，然后用这些名字去访问属性。这些字符串表示的属性名并不是写死在代码中的，它们在程序运行时可变，甚至可以是程序启动后才临时生成的，这样，就真正实现了对于属性和方法的动态访问。比如：

```python
class Animal:
    def __init__(self, species):
        self.species = species

    def speak(self):
        print(f"{self.species}发出了声音")

# 创建对象
animal = Animal("狗")

# 使用反射获取属性值
print(getattr(animal, 'species'))  # 输出 狗

# 检查对象是否有某个方法
print(hasattr(animal, 'speak'))  # 输出 True

# 设置属性值
setattr(animal, 'species', '猫')
print(animal.species)  # 输出 猫

# 动态调用方法
method = getattr(animal, 'speak')
method()  # 输出 猫发出了声音
```

在上面的程序中，我们使用字符串表示的属性名 "species" 和 "speak" 访问了这两个属性。

### 属性和方法

可能在看过上面的介绍与示例后，很多读者已经意识到了，属性与方法并没有本质区别：它们都是指向一个对象的变量，如果某个属性指向的对象恰好实现了 `__call__` 方法，那么，也可以把这个属性称为方法。

比如在下面的程序中，我们使用设置属性的代码，为 dog 对象添加了一个名为 eat 的方法：

```python
class Animal:
    def __init__(self, species):
        self.species = species

dog = Animal("狗")
# 添加一个方法
dog.eat = lambda: print("吃饱了")

dog.eat()   # 输出： "吃饱了"
```

既然属性和方法本质上是一回事，都是对象，它们的唯一区别就在于这个对象是不是函数了：如果是函数，就被可以被叫做方法；否则就是属性。我们可以使用 callable() 函数来检查一个属性是不是方法：

```python
class Animal:
    def __init__(self, species):
        self.species = species

    def speak(self):
        print(f"{self.species}发出了声音")

# 创建对象
dog = Animal("狗")
dog.eat = lambda: print("吃饱了")

print(callable(dog.species))  # 输出: False
print(callable(dog.eat))      # 输出: True
print(callable(dog.speak))    # 输出: True
```


## 类装饰器

类装饰器与函数装饰器类似，都是利用 Python 的高阶函数特性来修改或增强类的功能。类装饰器接收一个类，并返回一个新的类或修改原始类。因为类本身也是对象（尽管我们还可以再生成这个类的对象），所以它们也可以被作为参数传递给函数。

### 基本用法

我们可以先看一个简单的类装饰器示例，这个装饰器为类添加了一个新的属性：

```python
def add_attribute(cls):
    cls.new_attribute = "我是一个新属性"
    return cls

@add_attribute
class MyClass:
    pass

obj = MyClass()
print(obj.new_attribute)  # 输出: 我是一个新属性
```

在这个示例中，我们定义了一个名为 add_attribute 的装饰器，它能够为传入的类添加了一个新的属性。然后，我们使用 @add_attribute 装饰 MyClass。当 MyClass 被定义后，它会立即被传递给 add_attribute 函数，然后转换成被装饰过的类。

### 使用类作为装饰器

我们还可以定义一个类作为装饰器。这个类需要实现 `__call__` 方法，这样，它就能够像函数一样被使用了。下面的示例展示了如何使用类装饰器来记录对象的创建次数：

```python
class CountInstances:
    # 定义一个计数器属性
    counter = 0
    
    def __call__(self, cls):
        # 创建并返回一个被装饰类的子类
        class NewClass(cls):
            def __init__(self, *args, **kwargs):
                # 子类的构造函数先更新计数器，再调用父类的构造函数
                CountInstances.counter += 1
                super().__init__(*args, **kwargs)
        return NewClass

@CountInstances()
class MyClass:
    pass

obj1 = MyClass()
obj2 = MyClass()

print(CountInstances.counter)  # 输出: 2
```

在上面的示例中，`__call__` 方法定义了用 CountInstances 去修饰一个类时的行为，它创建了一个被装饰类的子类来替代被装饰的类。子类中的行为与被装饰类完全一致，只是增加了一个计数器。这样，被装饰之后的类，每生成一个新的对象，计数器就会加一。

### 修改类的行为

类装饰器不仅可以增加属性或方法，还可以修改现有的行为。它通过上文介绍的反射机制来修改类的属性和方法。

例如，下面的装饰器可以让类的所有方法都不可用：

```python
def disable_methods(cls):
    for name, method in cls.__dict__.items():
        if callable(method):
            # 在这里，把类中所有方法都设置为一个函数，它什么都不做值返回字符串："方法不可使用"
            setattr(cls, name, lambda *args, **kwargs: "方法不可使用")
    return cls

@disable_methods
class MyClass:
    def greet(self):
        return "你好！"

obj = MyClass()
print(obj.greet())  # 输出: 方法不可使用
```

类装饰器可以访问和修改类的属性和方法，但它们不能修改类的继承关系。如果多个装饰器应用于一个类，它们会按照从内到外的顺序应用。装饰器的功能过于强大，使用类装饰器时需要谨慎，确保不会无意中破坏现有的类的行为。还应该适当地使用文档来描述装饰器的行为和目的。


## 元类

《动物庄园》中有一句著名的话：“All animals are equal, but some animals are more equal than others.”。换成 Python 庄园，这句话就应该是：在 Python 中，所有对象一律平等，但有些对象比其它对象更平等。

元类（Metaclass）是用来创建类的类，正如我们用类来创建对象。也可以说：类是对象的模板，而元类就是类的模板。

### type

在 Python 中，标准的、内置的元类是 type。上文使用了 type() 函数查看一个对象的类型。type() 函数还有另一种用法，它可以接收三个参数，然后返回呢一个动态创建的类：

```python
Animal = type('Animal', (object), {'species': '狗'})
```

上面的程序动态的创建了一个新的 Animal 类。之所以说是动态，因为这个新类的类型，继承关系，属性设置等，都是不是固定写在代码里的，是可以程序运行时临时产生的。它与下面的静态创建类的代码产生的结果是相同的：

```python
class Animal(object):
    species = '狗'
```

### `__new__` 方法

应为后面内容要用到，所以我们在这里介绍一下 Python 的一个预定义的特殊的类方法： `__new__`。`__new__` 是一个类方法，而不是对象方法。在使用类创建对象的时候，Python 会首先调用类中的 `__new__` 方法，然后才去调用对象的构造函数 `__init__` 。大部分程序中，我们都是需要对新的对象进行初始化，所以会使用 `__init__` 方法。但在某些情况下，我们可能需要更多地控制对象的创建过程，这时 `__new__` 就派上了用场。`__new__` 方法负责创建（并返回）类的新实例。它是一个类方法，所以不需要实例化，但它必须返回一个实例。如果没有正确地返回一个实例，那么 `__init__` 就不会被调用。

以下是 `__new__` 的一些典型用法：

#### 实现单例模式

单例模式（Singleton Pattern）意味着一个类只能创建一个实例。这时候，我们可以利用 `__new__` 检查是否已经存在一个实例。如果不存在，创建一个；如果存在，就直接返回已存在的实例：

```python
class Singleton:
    _instance = None   # 用于记录已创建的对象

    def __new__(cls):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance

s1 = Singleton()
s2 = Singleton()       # s2 不是一个新对象，它指向了已有的对象

print(s1 == s2)        # 输出: True
```

在上面的程序中，它通过调用 `super().__new__(cls)` 来创建新对象，也就是调用了父类的 `__new__` 方法。Singleton 的父类是 objects，所以其实在这个程序中不用调用父类的方法，直接返回一个新的 objects 效果是同样的。但是，在有继承关系的复杂情况下，调用父类中相应的方法就是必须的了，我么需要与父类的行为保持一致。所以最好是养成习惯，无论一个类是否有父类，在程序中，都一致使用 super() 函数去调用父类相应方法完成所需功能。 

#### 创建不可变对象

例如，我们想创建一个扩展的元组（tuple）类型，可以通过 `__new__` 来定制对象的创建过程。

```python
class ExtendedTuple(tuple):  # 继承
    def __new__(cls, *args):
        new_args = (x*2 for x in args)
        return super().__new__(cls, new_args)

t = ExtendedTuple(1, 2, 3)
print(t)  # 输出: (2, 4, 6)
```

由于 tuple 是不可变类型，其内容必须在创建实例时就确定，不能再改，因此 `__new__` 方法是创建自定义不可变类型实例的地方。在上面的例子中，我们使用 `__new__` 为元组中的每个元素乘以 2，并传递新的参数给 tuple 的构造函数。

### 自定义元类

元类定义了类的行为，就像类定义了实例的行为一样。自定义元类主要用于类的自定义创建和修改。自定义元类通常用于高级用途，比如拦截类的创建、修改类的定义、自动化某些处理流程或实现特定的模式。例如，我们可以使用元类实现在一个项目中，创建类的时候，都自动添加某些方法或属性，或确保所有的类都遵循某种特定模式。

自定义元类通常继承 type 类，并通常需要重写它的 `__new__` 或 `__init__` 方法。

```python
# 定义元类
class MyMeta(type):
    def __new__(cls, name, bases, dct):
        # 在类创建时自动添加新方法
        dct["new_class_method"] = cls.class_method
        return super().__new__(cls, name, bases, dct)

    # 这是被自动添加的新方法
    @staticmethod
    def class_method():
        print("这是一个新的静态方法")

# 使用自定义元类
class MyClass(metaclass=MyMeta):
    pass

# 测试： 新的类中已经有了自动添加的方法
MyClass.new_class_method()  # 输出: 这是一个新的静态方法
```

上面是一个简单的自定义元类示例，该元类会在创建新类时自动添加一个新的类方法。在用户自定义类时，可以通过 metaclass 关键字指定使用的元类。

### 何时使用元类

元类是一个非常强大的工具，但也是一个复杂的工具。它们常用于以下场景：

* 控制类的创建：可以在类创建过程中拦截类的定义，对其进行修改或验证。或者确保子类遵循某些约定或模式。
* 注册类：在类创建时自动注册类，例如在某个注册表中添加类引用。
* 代码自动生成，自动添加属性或方法：就像上面示例中那样，可以自动向类添加属性或方法。
* 实现特定的编程模式：例如单例模式、工厂模式等。

元类的缺点也很明显：它增加了代码的复杂性，在大多数情况下可能并不必要。只有在需要深入控制类的行为时才需要考虑使用元类。元类的使用可能会使代码更难理解，所以要确保提供充分的文档说明。




