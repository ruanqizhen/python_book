# 全都是对象

几乎所有在 Python 代码中使用的东西都是对象，无论是数据，如数字、字符串、列表等，还是函数、类、模块等。这意味着它们都具有对象的特性和行为，比如都具有属性和方法，并且可以被赋值给变量、作为参数传递给函数，或者作为函数的返回值。

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

### 对象的类型

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

class MyClass:
    pass

obj = MyClass()
print(type(obj))      # 输出: <class '__main__.MyClass'>

print(type(MyClass))  # 输出: <class 'type'>

print(type(type))     # 输出: <class 'type'>
```

从上面的示例中可以看出，数据、函数、对象或类本身都是对象，它们分别是一些不同类型的对象。比如： 7 属于 class int；自定义函数属于 class function；而自定义类则属于 class type。

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

### 动态访问属性和方法

使用 getattr, setattr, 和 hasattr 等函数动态地访问和设置对象的属性和方法，也就是实现了反射功能。

* hasattr(object, name) 函数用于检查对象是否具有给定的属性或方法。它返回一个布尔值，指示对象是否具有指定的属性。
* getattr(object, name[, default])  函数用于获取对象的属性或方法。如果属性或方法不存在，它会返回指定的默认值，若没有指定默认值则会抛出 AttributeError。
* setattr(object, name, value) 函数用于设置对象的属性或方法。如果属性或方法已存在，它的值会被更新；如果属性或方法不存在，将创建一个新的属性或方法。

比如：

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

在上面的程序中，可以看出，对象的属性与方法并没有本质区别：所谓方法，本质也是属性，只不过这个属性的值是一个函数。比如下面的程序，我们就使用设置属性的代码为 dog 对象添加了一个名为 speak 的方法：

```python
class Animal:
    def __init__(self, species):
        self.species = species

dog = Animal("狗")
# 添加一个方法
dog.speak = lambda: print("发出了声音")

dog.speak()   # 输出： "发出了声音"
```

### 区分属性和方法

既然属性和方法本质上是一回事，也都是对象，它们的唯一区别就在于这个对象是不是函数了：如果是函数，就被叫做方法；否则就是属性。我们可以使用 callable() 函数来检查一个对象是否“可调用”。一个对象如果是可调用的，意味着它是一个函数。或者说，我们可以使用函数的方式来调用这个对象。在 Python 中，函数、方法、类，以及实现了 `__call__` 方法的对象都可以是可调用的，都可以被当做函数来使用。

我们可以使用 callable() 函数检查对象的每一个属性，如果某个属性可调用，那么它是一个方法：

```python
class Animal:
    def __init__(self, species):
        self.species = species

    def eat(self):
        print(f"{self.species}吃饱了")

# 创建对象
dog = Animal("狗")
dog.speak = lambda: print("发出了声音")

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

我们还可以定义一个类作为装饰器。这个类需要实现 [`__call__` 魔法方法](magic_methods#函数调用)，它能够使得一个类的对象就像函数一样被使用。下面的示例展示了如何使用类装饰器来记录对象的创建次数：

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

正如我们用类来创建对象实例，元类（Metaclass）就是用来创建类的。换句话说，类是对象的模板，而元类是类的模板。这是一个相当抽象的概念，但它为 Python 提供了极大的灵活性和动态性。


### 默认的元类：type
在 Python 中，标准的、内置的元类是 type。它的三个参数的版本允许我们动态地创建新的类：

```python
MyClass = type('MyClass', (object,), {'x': 5})
```

这与以下传统的类定义是等效的：

```python
class MyClass(object):
    x = 5
```


### 自定义元类

自定义元类主要用于类的自定义创建和修改。例如，你可能想在创建类时自动添加某些方法或属性，或确保类遵循某种特定模式。

创建元类通常涉及继承 type 并重写它的一些方法。例如，`__new__` 或 `__init__` 可能是你想重写的方法。

```python
class Meta(type):
    def __new__(cls, name, bases, attrs):
        # 添加新的属性
        attrs['new_attribute'] = "value"
        return super().__new__(cls, name, bases, attrs)

class MyClass(metaclass=Meta):
    pass

obj = MyClass()
print(obj.new_attribute)  # 输出: value
```

### 何时使用元类

元类是一个非常强大的工具，但也是一个复杂的工具。它们常用于以下场景：

框架构建：例如 Django 的 ORM，其中模型类被转化为数据库表。
代码自动生成：例如，自动创建 getter 和 setter 方法。
单例模式的实施：确保一个类只有一个实例。
验证和约束：确保子类遵循某些约定或模式。


复杂性：元类增加了代码的复杂性。除非真的需要，否则应该避免使用它们。
调试：由于元类在编译时而不是运行时更改代码，所以可能会导致调试困难。
可读性：不熟悉元类的开发者可能会发现使用了元类的代码难以理解。
元类是 Python 提供的一个强大的工具，允许开发者在编译时更改或扩展类的行为。不过，由于其高级和复杂性，它们应该在确实需要时谨慎使用。





## 枚举

枚举在很多编程语言里都是基本的数据类型。在 Python 中，枚举不是基础数据类型，而是一个表示固定集合中元素的类。这些元素都是常量，不应该被更改。使用枚举可以为一组相关的常量提供有意义的名称，使代码更具可读性。

### 创建枚举
要在 Python 中创建枚举，需要使用 enum 模块中的 Enum 类：

```python
from enum import Enum

class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3
```

在这里，Color 是一个枚举，它有三个成员：RED、GREEN 和 BLUE。

### 访问枚举成员

可以通过成员的名称或值来访问枚举成员：

```python
print(Color.RED)        # 输出: Color.RED
print(Color.RED.name)   # 输出: RED
print(Color.RED.value)  # 输出: 1
```

### 遍历枚举

可以遍历枚举的所有成员：

```python
for color in Color:
    print(color.name, color.value)
```

### 使用自动分配值

如果不为枚举成员指定值，它们会自动分配整数值，从 1 开始递增：

```python
from enum import auto, Enum

class Color(Enum):
    RED = auto()
    GREEN = auto()
    BLUE = auto()
```

此时，RED 的值为 1，GREEN 的值为 2，BLUE 的值为 3。

### 检查枚举成员

可以检查某个值或名称是否是枚举中的成员：

```python
print(Color(1))       # 输出: Color.RED
print(Color['RED'])   # 输出: Color.RED
```

### 枚举的比较

枚举成员不能进行大小比较，但可以进行身份和等值比较：

```python
print(Color.RED is Color.RED)   # 输出: True
print(Color.RED == Color.GREEN) # 输出: False
```

### 定义更复杂的枚举

枚举也可以具有方法：

比如有时候需要加上 string_value()

```python
from enum import Enum

class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3
    PURPLE = 4

    def describe(self):
        return f"This is a {self.name} color with value {self.value}"

    @classmethod
    def mix(cls, color1, color2, ratio=0.5):
        if color1 == cls.RED and color2 == cls.BLUE or color1 == cls.BLUE and color2 == cls.RED:
            if ratio == 0.5:  # 这里是一个简化的示例，假设只有 0.5 的比例是 PURPLE
                return cls.PURPLE
            else:
                return f"Mixing {color1.name} and {color2.name} with a ratio of {ratio} doesn't give a predefined color in this model."
        return f"Mixing {color1.name} and {color2.name} doesn't give a predefined color in this model."

print(Color.RED.describe())  # 输出: This is a RED color with value 1

# 演示颜色组合
result = Color.mix(Color.RED, Color.BLUE)
if isinstance(result, Color):
    print(f"The resulting color is {result.name}.")  # 输出: The resulting color is PURPLE.
else:
    print(result)

result = Color.mix(Color.RED, Color.BLUE, 0.3)
print(result)  # 输出: Mixing RED and BLUE with a ratio of 0.3 doesn't give a predefined color in this model.
```


## 命名元组 

Python 中可以给元组的元素命名，这样的元组就是命名元组（Namedtuples）。相比于普通的元组，命名元组可读性更好，它可以通过名称（而不是索引）获取元组的元素。Python 中使用 namedtuple 函数来创建命名元组。比如：

```python
from collections import namedtuple

# 定义一个命名元组
Person = namedtuple("Person", ["name", "age", "gender"])

# 创建一个Person对象
p1 = Person(name="John", age=30, gender="Male")

print(p1.name)    # 输出: John
print(p1.age)     # 输出: 30
print(p1.gender)  # 输出: Male

# 使用索引
print(p1[0])      # 输出: John

# 将命名元组转化为字典
print(p1._asdict())  # 输出: OrderedDict([('name', 'John'), ('age', 30), ('gender', 'Male')])

# 替换命名元组的字段值
p2 = p1._replace(name="Jane")
print(p2)  # 输出: Person(name='Jane', age=30, gender='Male')

# 获取所有字段名称
print(Person._fields)  # 输出: ('name', 'age', 'gender')
```

虽然命名元组提供了类似于类的功能，但它们仍然是元组，因此它们的值是不可变的。这意味着你不能更改已创建的命名元组的字段值，但可以使用 ._replace() 方法返回一个新的命名元组，其某些字段值已更改。
