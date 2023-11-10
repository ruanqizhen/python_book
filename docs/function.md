# 函数

即便没有学过编程，我们肯定也早就了解数学函数了。在编程领域，函数也是一个非常核心的内容，它最初就是借用了数学函数的概念。在 Python 中，函数是一个组织好的、可重复使用的、用来实现单一或相关联功能的代码段。它们可以提高代码的模块性，并增加代码的重复使用率。Python 提供了很多内建函数，如在前文示例中频繁出现的 print() 函数。我们也可以创建自己的函数，这些被称为用户定义的函数。



## 函数的定义和调用

### 函数定义的关键组成部分

* def 关键字： 函数的定义以 def 关键字开始。
* 函数名称： def 关键字之后是函数的名称。这应该是一个描述性名称。函数与变量遵循相同的命名规则：只包含大小写字母下划线和数字，但不能以数字开头。
* 参数列表： 在函数名称后面的括号内，列出函数的参数。这些是在函数调用时传递给函数的值。函数也可以没有参数。
* 冒号： 函数头（即函数定义的第一行）必须以冒号结尾。
* 函数体： 函数体是一组缩进的语句，它们定义了函数要执行的操作。
* 返回值： 使用 return 语句，可以从函数返回一个值。如果函数不包含 return 语句，它默认返回 None。

最简单的函数是无参数的：

```python
def greet():
    print("Hello, World!")
```

在 Python 中，调用函数非常简单。写上函数名，后跟括号，并在括号中提供所需的参数（如果有的话）来调用它。在之前的示例中已经演示过很多函数调用了，尤其是 print() 函数。


### 函数的返回值

一般的函数都有且只有一个返回值。如果函数体内，没有 return 语句，函数会返回 None；如果 return 后面只有一个数据，就返回这个数据；如果有多个数据，就把他们打包成一个元组返回。

一个带有参数和返回值的函数定义如下：

```python
def sub(a, b):
    return a - b
    
print(sub(8, 3))  # 输出： 5
```

调用函数时，输入参数的顺序一定要与函数定义的参数顺序保持一致。这种参数传递方式叫做位置参数，因为参数的顺序至关重要。比如上面的示例，如果调用时，写反了参数顺序，得到的结果就是错误得了。为了防止参数顺序错误，尤其是当被调用函数有非常多的参数的时候，可以使用关键字参数调用函数，也就是，在调用函数时，把参数的名字写出来，比如：

```python
def describe_person(first_name, last_name, age):
    print(f"{first_name} {last_name} is {age} years old.")

# 调用函数
describe_person(age=28, last_name="Doe", first_name="John")  # 输出：John Doe is 28 years old.
```

这时候因为已经提供了参数的名字，顺序就不那么重要了。这在函数参数有默认值的时候非常有用，我们在调用某个函数式，可能只需要设置其中某几个参数，其它参数都采用默认值，这时候，就可以采用关键字参数调用函数。


二是，如果函数有多个返回值，实际上返回的是一个元组，可以在调用函数的时候直接以元组拆包的方式直接得到多个返回数据，比如：

```python
def compute_stats(numbers):
    """Compute the length, sum, and average of a list of numbers."""
    length = len(numbers)
    total = sum(numbers)
    average = total / length
    return length, total, average

# 使用函数
numbers = [10, 20, 30, 40, 50]
length, total, average = compute_stats(numbers)

print(f"Length: {length}")      # 输出： 5
print(f"Total: {total}")        # 输出： 150
print(f"Average: {average}")    # 输出： 30.0
```

函数返回多个数据为编程提供了极大便利，但是也要注意，尽量不要让一个函数返回太多的值。一旦返回值数量超过三个，出错的概率就会极大增加。比如上面的示例，compute_stats 函数返回的三个数据的顺序是：length, total, average。如果使用时，不小心写错了顺序，写成了： `length, average, total = compute_stats(numbers)`，也还是可以比较容易发现错误的。但想象一下，如果函数同时返回了八九个数据，其中两个颠倒了次序，那可就不那么容易看出来了。

### 默认参数

函数的参数可以带有默认值，这样，如果调用这个函数时，没有提供相应的输入值，函数就是用默认值。没有默认值的参数，必须要调用时提供一个输入数据。

```python
def greet(name="World"):
    print(f"Hello, {name}!")
    
greet("ruanqizhen")  # 输出： "Hello, ruanqizhen!"
greet()              # 输出： "Hello, World!"
```


在 Python 中，默认参数的数据类型必须是不可变类型的。使用可变数据类型（如列表、字典或集合）作为函数的默认参数是一种常见的陷阱，因为这可能导致预料之外的行为。

当使用可变数据类型作为默认参数并修改它时，该修改会在多次函数调用之间持续存在。原因是函数默认参数在函数定义时只计算一次，而不是每次调用时都重新计算。比如：

```python
def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item(1))  # 输出：[1]
print(add_item(2))  # 期望输出：[2]，但实际输出：[1, 2]
print(add_item(3))  # 期望输出：[3]，但实际输出：[1, 2, 3]
```

如上所示，items 列表在多次函数调用之间持了状态。

为了避免这种问题，可以将默认参数设置为 None，并在函数体内检查它，如果调用是没有提供新的数据，就赋予它应有的初始值：

```python
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

print(add_item(1))    # 输出：[1]
print(add_item(2))    # 输出：[2]
print(add_item('a'))  # 输出：['a']
```

### 函数的不定数量参数

函数可以有不定数量的参数，这是利用了元组的打包拆包来实现的，比如：

```python
def print_all(*args):
    for arg in args:
        print(arg)
        
print_all(1, 2)         # 输出： 1 2
print_all(1, 2, 3, 4)   # 输出： 1 2 3 4
```

在上面这个函数中，参数 args 前面有一个星号，表示它可以接受多个参数。在函数体内，args 是一个由所有输入参数组成的元组。上面的代码只是用来演示一下不定数量参数，实际上， print() 函数本身就是一个可以接收不定数量参数的函数，可以调用一个 print() 函数打印多个数据，比如 `print(1, 2)`。

同样利用字典的打包拆包，可以为函数传递不定数量的关键字参数。在 Python 中，通常使用 `**kwargs`（“keyword arguments”的缩写）来处理不定数量的关键字参数。这会将传入的所有关键字参数收集到一个字典中，其中参数的名字作为键，对应的值作为字典的值。

例如：

```python
def display_data(**kwargs):
    for key, value in kwargs.items():
        print(f"{key} = {value}")

# 调用函数
display_data(name="John", age=25, country="USA")

# 输出：
# name = John
# age = 25
# country = USA
```

无论是 `*args` 还是 `**kwargs`， 它们都会捕获所有的参数，所以它们一定要放在函数定义参数的最后，并且 `*args` 要在 `**kwargs`前面。这样，函数就可以先处理普通参数，然后再用这两个可变参数捕获其余的所有参数。比如：

```python
def example_function(arg1, arg2, *args, **kwargs):
    # 打印普通参数
    print(arg1, arg2)

    # 打印不定数量的位置参数
    for arg in args:
        print(arg)
    
    # 打印关键字参数
    for key, value in kwargs.items():
        print(f"{key} = {value}")

# 调用函数
example_function('a', 'b', 1, 2, 3, name="John", country="USA")

# 输出：
# a b
# 1
# 2
# 3
# name = John
# country = USA
```

#### 是否应该使用不定数量参数

可变数量的参数提供了灵活性，允许函数接受任意数量的参数，这在处理不确定数量的输入时非常有用。然而，这也可能导致代码难以理解和维护，特别是当函数执行复杂的操作时。我们在设计自己的函数式，需要谨慎考虑是否使用可变数量的参数。

笔者的经验是，最需要可变数量的参数的情况是，新函数的内部调用了一些具有不定数量参数的函数，为了把参数传递给调用的函数，新函数也需要不定数量的参数。比如，已有的计算数据和的函数，和计算数据个数的函数都是可以接受不定数量的参数，我们新写了一个函数，用于计算几个数据的平均数，那么这个新函数也需要支持不定数量参数：

```python
def average(*numbers):
    return sum(numbers) / len(numbers) if numbers else 0

# 可以用不同数量的参数调用
print(average(2, 3, 4))  # 输出平均值 3.0
print(average(10, 20))   # 输出平均值 15.0
```

如果不是去调用那些已有的具有不定数量参数的函数，那么新函数最好使用固定数量的参数，这样使得函数的功能更明确，可读性更好。


### 改变输入参数的值

Python 采用传引用的方式传递参数值，也就是说，把一个数据传递给函数的时候，函数并不会把数据复制一份，然后使用数据的副本。它会直接把参数指向输入数据，在函数内部，参数名就是指向输入数据的引用，这与变量名是一样的。这也就是说，如果在函数内部，修改了某个输入数据，那么这份数据就是被修改了，再在函数外面访问这份数据时，读取到的，也是改变后的结果。但是，需要注意的是，Python 中，[有些类型的数据是不可变的](variable#数据的可变性)，这些类型的数据，无论在函数内部或外部都不可以被修改；反之，那些可变数据，在函数内部或外部都可以被修改。比如：

```python
def modify_list(lst):
    lst.append(4)  # lst 的指向没有变，但数据变了

def modify_number(x):
    x = x + 1      # 原数据不会变，但 x 指向了另一个数据

# 不可变数据示例
num = 3
modify_number(num)
print(num)      # 输出是 3，因为 num 的值没有被改变

# 可变数据示例
my_list = [1, 2, 3]
modify_list(my_list)
print(my_list)  # 输出是 [1, 2, 3, 4]，因为 my_list 被函数修改了
```

### 参数与返回值的类型提示

编写大型程序是，最好为函数参数和返回值提供类型提示。与变量的类型提示类似，它不会在运行时执行任何类型检查，而是为开发者和工具提供一个明确的指示，说明预期的参数类型和返回类型。

以下是使用类型提示定义函数的示例：

```python
def greet(name: str) -> str:
    return f"Hello, {name}!"
```

在这个例子中，`name: str` 表示 `name` 参数应该是一个字符串。 `-> str` 表示这个函数应该返回一个字符串。

下面是一个更复杂的示例：

```python
from typing import List

def filter_even_numbers(numbers: List[int]) -> List[int]:
    return [num for num in numbers if num % 2 == 0]
```

这里我们使用了typing模块中的List，它允许我们提供更具体的类型提示，表示 numbers 是一个整数列表。


### 函数文档

在 Python 中，为函数添加文档通常使用三引号的多行字符串，这个字符串被紧挨着放在函数头的下面。这种字符串也被称为“文档字符串”（docstring）。

通常，文档字符串首行简洁地总结函数的功能。随后的行可以提供更详细的描述、参数的信息、返回值、例子以及其他相关信息。比如

```python
def add(a, b):
    '''
    Returns the sum of two numbers.

    Parameters:
    - a: The first number.
    - b: The second number.

    Returns:
    The sum of a and b.

    Example:
    >>> add(2, 3)
    5
    '''
    return a + b
```

函数文档不仅仅是为阅读辑程序时提供帮助，有必要时，也可以在程序中访问它。可以使用函数的 `__doc__` 属性，或使用 Python 的 help() 函数来访问函数文档，比如：

```python
print(add.__doc__)
help(add)
```

我们也可以通过以上的函数和方法获得 Python 自带函数的文档。

为函数编写文档是一个好的编程习惯，尤其是代码可能会被其他人阅读、维护的时候。有了清晰的文档，其他开发者能够快速理解和使用一个函数，而不必深入研究实现细节。


## 嵌套函数

在 Python 中，函数内部可以定义另一个函数。这样的内部函数通常被称为嵌套函数或局部函数。下面是一个示例来展示这个概念：

```python
def outer_function(x):
    def inner_function(y):
        return y * 2
    return inner_function(x) + 5

result = outer_function(10)  
print(result)   # 输出：25
```

在上面的代码中，inner_function 是在 outer_function 内部定义的。

嵌套函数具有如下的优点：
* 封装：嵌套函数可以隐藏其内部实现，使外部函数更简洁。
* 局部变量：嵌套函数可以访问其外部函数的局部变量，这提供了一种有用的机制来维护某些数据而不需要将它们传递给多个函数。
* 高阶函数和闭包：嵌套函数是实现高阶函数和闭包的基础，这允许函数生成并返回其他函数。

缺点是会让代码变得复杂，但如果恰当使用，可以提升代码的清晰性和可维护性。

## 函数和变量的作用域

在 Python 中，变量的可访问性和生命周期是由它所在的位置决定的。这种位置被称为“作用域”。理解 Python 中的变量作用域对于避免可能的变量名冲突和编写更可维护的代码是至关重要的。

以下是 Python 中几种主要的变量作用域：

### 局部作用域（Local Scope）

变量在一个函数内部定义，只在该函数内部可用。这样的变量被称为局部变量。当函数执行结束后，局部变量会被销毁。

在很多语言中，循环等结构内定义的变量只能在结构内使用。但 Python 不同，Python 的选择、循环等结构没有自己的域。函数就是区分变量作用域的最小单位了。


### 封闭作用域（Enclosing Scope）

当一个函数嵌套另一个函数时，外部函数（或封闭函数）的作用域被称为封闭作用域。内部函数可以访问外部函数（封闭函数）中定义的变量，但不能修改它们（除非使用 nonlocal 关键字）。

比如：

```python
def outer_function(message):
    # 这是外部函数，它有一个局部变量 message
    outer_variable = "这是外部函数的局部变量"

    def inner_function():
        # 这是一个嵌套的内部函数
        print("内部函数输出：", message)
        print("内部函数访问外部函数的变量：", outer_variable)
        
        # 如果运行下面这句，会报错，因为 inner_function 中不能修改 outer_function 的变量
        # outer_variable = "修改外部函数的局部变量"

    inner_function()  # 调用内部函数
    
    # 如果运行下面这句，会报错，因为 outer_function 不能访问 inner_function 的局部变量
    # print("外部函数访问：", inner_variable)

# 调用外部函数
outer_function("传递给外部函数的消息")

# 如果运行下面这句，会报错，因为 inner_function 不在这个域
# inner_function()  

# 结果:
# 内部函数输出： 传递给外部函数的消息
# 内部函数访问外部函数的变量： 这是外部函数的局部变量
```


```python
def outer_function():
    # 外部函数的局部变量
    count = 0

    def inner_function():
        # 使用 nonlocal 告诉 Python 我们想修改外部函数的 count 变量
        nonlocal count
        count += 1
        print("当前计数:", count)

    inner_function()  # 调用内部函数
    inner_function()  # 再次调用内部函数
    print("外部函数的计数:", count)

# 调用外部函数
outer_function()

# 输出:
# 当前计数: 1
# 当前计数: 2
# 外部函数的计数: 2
```

下面的程序会出错：

```python
def outer_function():
    x = 0
    def inner_function():
        x += 1
        print(x)
    inner_function()

outer_function()
```


### 全局作用域（Global Scope）

在主程序体中定义的变量拥有全局作用域。它们被称为全局变量。这些变量在整个程序执行期间都存在，可以在当前文件内的任何函数内部被读取。但如果修改的话，必须通过 global 关键字进行修改。

```python
# 定义全局变量
global_variable = "I am a global variable"

def show_global():  
    # 访问全局变量
    print(global_variable)
    
    # 定义一个局部变量
    local_variable = "I am a local variable"
    
def show_local():
    # 没有使用 global 关键字，所以这实际上是一个局部变量
    global_variable = "I am a local variable"
    
    # 局部变量与全局变量同名，优先使用局部变量
    print(global_variable)

def modify_global():
    # 使用 global 关键字来指明我们要修改的是全局变量
    global global_variable
    global_variable = "I am a modified global variable"


show_global()    # 输出： I am a global variable

modify_global()  # 修改全局变量
show_global()    # 输出： I am a modified global variable

# 如果运行下面的语句，会导致错误，因为 local_variable 不在这个作用域内
# print(local_variable)  

show_local()     # 输出： I am a local variable

```

需要特别注意的是，局部变量与全局变量重名的情况。这时候，阅读代码很可能会产生一些疑惑，命名变量的值被改变了，怎么读出来的还是原来的值呢？很可能就是因为改变的是局部变量，而读取的是全局变量。所以，在实际项目中，尽量不用让变量或函数重名，以避免这种迷惑。



### 内置作用域（Built-in Scope）

内置作用域是 Python 解释器启动时创建的最外层的作用域。它包含了 Python 的预定义的内置名称，例如：print(), len(), int(), list(), dict(), open(), Exception 等。这些都是 Python 提供的内置函数、类和异常处理方法等。内置作用域定义的函数，变量等，在任何文件任何函数内都可以访问。

比如，不需要任何特别的声明，print() 函数就可以在任何地方被调用。

### 变量查找顺序（LEGB规则）

在上面的示例中，我们看到了，不同的域中，可能会有重名的函数和变量。那么，当我们读取这样一个变量（或调用函数），到底是哪个域里的变量被读取了呢？

这时候，Python 遵循 LEGB 规则进行查找：
* L, Local: 首先，查找局部作用域。
* E, Enclosing: 其次，查找任何封闭函数的作用域，从最近的封闭作用域开始，然后向外查找。
* G, Global: 然后，查找全局作用域。
* B, Built-in: 最后，查找内置作用域。

比如：

```python
def custom_function():
    # 在函数内部重新定义 print 函数
    def print(message):
        """
        This is an redefined print function 
        """
        help(print)

    # 使用自定义版本的 print
    print("Hello, World!")

# 调用 custom_function
custom_function()  # 输出： print(message) This is an redefined print function
```

在实际项目中，要尽量避免重新定义或覆盖外层域中的变量或函数名称，否则可能会导致意想不到的结果和混淆。
