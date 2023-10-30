# 还未整理好的内容

## 属性装饰器

前文提到过，Python 中类的属性不是特别安全，他不能控制访问权限，也无法限制取值范围。解决方法是，把需要属性都当做是私有的，不直接读写属性，而是通过方法来访问属性。类的方法中可以实现更复杂的功能，比如，加入数值范围检查等。类的方法使用起来，比访问类的属性稍微麻烦一点：有的方法用来读数据，有的用来写数据，如果命名又不规则，就更不方便了。为了解决这个问题，Python 内建了一个名为 @property 的装饰器，专门用于装饰器将类的方法转换为相同名称的属性。@property 经常与 setter 和 deleter 装饰器一起使用，用以控制属性的读取、设置和删除行为。这使得开发者可以在访问、设置和删除属性时插入自定义的逻辑，从而提供更好的封装和数据验证。

以下是一个 Circle 类的简单示例，该类使用 @property 等装饰器来管理圆的半径和面积：

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

c = Circle(5)
print(c.radius)  # 输出: 5
print(c.area)    # 输出: 78.5

c.radius = 3     # 通过 setter 方法设置半径
print(c.radius)  # 输出: 3
print(c.area)    # 输出: 28.26

# 尝试设置无效的半径
# c.radius = -2   # 这将抛出 ValueError
```

在上面的示例中，radius 是一个使用 @property 装饰的方法，因此可以像访问普通属性一样访问它。@radius.setter 是一个设置器，用它装饰的方法负责设置 radius 属性的值，在示例中，设置圆的半径之前，还对输入数据进行了验证，确保输入的半径不是负数。@radius.deleter 装饰的方法会在删除属性时调用，在示例中，我们用它禁止了删除半径这一行为，因为圆必须有一个半径属性。

@property 装饰器本身只能装饰属性的读取行为，因此 area 是一个只读属性，定义了读取方法，没有定义设置方法。

通过使用 @property，我们可以确保 Circle 类的状态始终保持一致，并简化了调用代码。




## 类装饰器:

类装饰器与函数装饰器类似，都是利用Python的高阶函数特性来修改或增强类的功能。类装饰器接收一个类，并返回一个新的类或修改原始类。在 Python 中，类本身也是对象（尽管我们还可以再生成这个类的对象），所以它们也可以被作为参数传递给其他函数。

### 基本用法

我们可以先看一个简单的类装饰器示例，这个装饰器为类添加了一个新的属性：

```python
def add_attribute(cls):
    cls.new_attribute = "I'm a new attribute!"
    return cls

@add_attribute
class MyClass:
    pass

obj = MyClass()
print(obj.new_attribute)  # 输出: I'm a new attribute!
```

在这个示例中，我们定义了一个名为 add_attribute 的装饰器，它为传入的类添加了一个新的属性。然后，我们使用 @add_attribute 装饰 MyClass。当 MyClass 被定义后，它会立即被传递给 add_attribute 函数，然后转换成被装饰过的类。

### 使用类作为装饰器

我们还可以定义一个类作为装饰器。这个类需要实现 `__call__` 魔法方法。下面的示例展示了如何使用类装饰器来记录对象的创建次数：

```python
class CountInstances:
    counter = 0
    
    def __call__(self, cls):
        class NewClass(cls):
            def __init__(self, *args, **kwargs):
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

### 修改类的行为

类装饰器不仅可以增加属性或方法，还可以修改现有的行为。例如，下面的装饰器确保类的所有方法都不可调用：

```python

def disable_methods(cls):
    for name, method in cls.__dict__.items():
        if callable(method):
            setattr(cls, name, lambda *args, **kwargs: "Method disabled!")
    return cls

@disable_methods
class MyClass:
    def greet(self):
        return "Hello!"

obj = MyClass()
print(obj.greet())  # 输出: Method disabled!
```



类装饰器可以访问和修改类的属性和方法，但它们不能修改类的继承关系。如果多个装饰器应用于一个类，它们会按照从内到外的顺序应用。使用类装饰器时应谨慎，确保不会无意中修改或破坏现有的类行为。适当地使用文档来描述装饰器的行为和目的。


## 元类



在 Python 中，一切皆对象。这包括整数、字符串、函数和类。正如我们用类来创建对象实例，元类（Metaclass）就是用来创建类的。换句话说，类是对象的模板，而元类是类的模板。这是一个相当抽象的概念，但它为 Python 提供了极大的灵活性和动态性。

### 使用 type 读取对象信息

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

### 枚举与比较

枚举成员不能进行大小比较，但可以进行身份和等值比较：

```python
print(Color.RED is Color.RED)   # 输出: True
print(Color.RED == Color.GREEN) # 输出: False
```

### 定义更复杂的枚举

枚举也可以具有方法：

``python
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
