# 函数式编程

函数式编程是一种编程风格和范式，它的核心思想是把程序尽量写成一系列嵌套的函数调用。纯粹的函数式编程是没有变量的，程序中就只有数据和函数调用。Scheme 是比较有代表性的函数式编程语言，有兴趣的读者可以看一下[这段最简洁的介绍](https://lv.qizhen.xyz/appendix_languages#scheme-%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80)。

Python 显然不是纯粹的函数式编程语言，但它也支持了函数式编程语言的绝大多数功能和特性。比如我们之前介绍的列表推导式就是一种函数式编程语言的功能。这一节，我们再介绍 Python 中其它一些函数式编程的特性。

## 函数是一等公民

在 Python 中，函数是一等公民（first-class citizen）。这句话的意思是：函数可以作为参数传递、作为返回值返回、赋值给变量或存储在数据结构中。这样的特性提供了大量的灵活性和动态性，特别是在更高阶的函数编程中。

### 函数作为参数

我们之前介绍过一个函数 help()，它可以返回一个函数的帮助文档。这个 help() 函数接收的参数就是一个函数，比如 `help(print)` 就会打印出 print() 函数的帮助文档。

我们自己也可以定义这样的，把其它函数作为参数的函数：


```python
def add(x, y):
    return x + y

def subtract(x, y):
    return x - y

def multiply(x, y):
    return x * y

def operate(func, x, y):
    return func(x, y)

# 使用operate函数和add函数计算3 + 5
result1 = operate(add, 3, 5)
print(result1)  # 输出：8

# 使用operate函数和subtract函数计算9 - 4
result2 = operate(subtract, 9, 4)
print(result2)  # 输出：5

# 使用operate函数和multiply函数计算3 * 7
result3 = operate(multiply, 3, 7)
print(result3)  # 输出：21
```

上面的程序定义了三个简单函数： add, subtract 和 multiply，它们分别实现加法、减法和乘法操作。此外，还定义了一个名为 operate 的高阶函数，它接受一个函数作为其第一个参数和两个数字作为其余参数。这个函数调用传入的函数参数，并将其余的两个数字作为参数传递给该函数。最后，我们使用 operate 函数，传递先前定义的函数和一些数字作为参数。

这样实现的代码允许用户在不改变 operate 函数的内部逻辑的情况下，就能够使用不同的操作、策略。这样可以避免重复的代码，因为所有的操作都使用了同一个 operate 函数。同时使代码更加清晰和可读，特别是当操作变得更加复杂时。

在面向对象的编程中，通常利用类的多态特性，实现这种调用同一个函数，就可以使用不同的操作、策略的功能。而在函数式编程中，采用把函数作为参数的方式来实现这种功能。


### 函数作为返回值

我们可以定义一个函数，该函数返回另一个函数。这通常在需要动态创建和返回函数的情况下非常有用，例如在闭包、工厂模式或装饰器模式中。

下面我们深入了解如何在Python中创建并返回函数：

这是一个简单的示例，其中一个函数返回另一个函数：

```python
def get_function(power):
    def raise_to_power(x):
        return x ** power
    return raise_to_power

square = get_function(2)
cube = get_function(3)

print(square(4))  # 输出：16
print(cube(4))   # 输出：64
```

在上述示例中，get_function 接受一个参数 power 并返回一个函数 raise_to_power。返回的函数在其内部作用域中保留了 power 的值，使我们能够创建并使用不同的函数，如 square 和 cube。

有时，我们可能希望根据某些条件动态地创建并返回不同的函数。例如：

```python
def math_operation(operator):
    def add(x, y):
        return x + y
    
    def subtract(x, y):
        return x - y

    if operator == '+':
        return add
    else:
        return subtract

operation = math_operation('+')
print(operation(5, 3))  # 输出：8

operation = math_operation('-')
print(operation(5, 3))  # 输出：2
```

## 匿名函数（lambda 函数）

匿名函数就是没有函数名的函数。这些函数通过 lambda 关键字定义，因此也被称为 lambda 函数。至于为什么要用 lambda 可以参考这一段关于 [Lambda Calculus 编程语言](https://lv.qizhen.xyz/appendix_languages#lambda-calculus-%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80)的介绍。

lambda 函数的基本语法是：

```python
lambda arguments: expression
```

lambda 函数可以有任意数量的参数，但只能有一个表达式，表达式必须是单行的。表达式的值在执行时返回。

比如：

```python
f = lambda x, y: x + y
print(f(2, 3))  # 输出: 5
```

在上面的示例中，我们定义了一个 lambda 函数，该函数接受两个参数 x 和 y 并返回它们的和。然后，我们将该函数分配给变量 f ，后续的程序可以使用变量 f 来调用这个 lambda 函数。


高阶函数：Python支持可以接受其他函数作为参数或返回函数的函数。例如，内置的map(), filter(), 和reduce()都是高阶函数。

Lambda函数：Python支持匿名函数，也称为lambda函数，这是一个简单的、可以在单行中定义的函数。

列表推导式和生成器表达式：这些是Python中的函数式工具，可以用更声明式的方式构建列表和生成器。

不变性：虽然Python的数据结构（如列表和字典）是可变的，但你可以通过编程风格和某些不可变的数据结构（如元组）来保持不变性。

内置的functools模块：此模块提供了一系列高阶函数和其他函数式编程的工具。

```

## 生成器

生成器（Generator）是Python中的一种特殊迭代器。生成器提供了一种高效的方式来创建迭代器，而无需定义一个完整的迭代器类。它们允许您按需生成数据，而不是一次性生成并存储所有数据。这样，你可以处理巨大的数据流或实现懒加载，从而节省内存。

生成器有两种主要的创建方式：

通过生成器函数：这是最常见的方法。使用 def 关键字定义的函数，如果函数体中包含 yield 关键字，则这个函数不会返回一个常规的值，而是返回一个生成器对象。

通过生成器表达式：这与列表推导式相似，但是使用圆括号 () 而不是方括号 []。

1. 生成器函数
如前面所述，任何包含 yield 的函数都被称为生成器函数。这个函数在被调用时，返回一个生成器对象，但不立即执行函数体内的代码。

python
Copy code
def count_up_to(n):
    count = 1
    while count <= n:
        yield count
        count += 1

counter = count_up_to(5)
print(type(counter))  # 输出: <class 'generator'>
每次请求数据时，可以使用 next() 函数或循环迭代生成器对象。当 yield 被调用时，函数的当前状态（包括所有局部变量的值）被保存，而生成器暂停执行，等待下一次请求。

2. 生成器表达式
生成器表达式是创建生成器的简洁方式，类似于列表推导式，但更为内存高效。

python
Copy code
squared_numbers = (x*x for x in range(5))
print(type(squared_numbers))  # 输出: <class 'generator'>
生成器的操作
使用 next() 函数从生成器中获取下一个值。
当生成器的所有值都被产生后，再次调用 next() 会触发 StopIteration 异常。
可以使用 for 循环直接迭代生成器。
生成器的优点：
内存效率：生成器允许我们按需生成值，这意味着可以处理比可用内存还大的数据流，因为不需要一次性加载所有数据。
自然的流程控制：使用生成器可以将数据流的处理逻辑表示为自然的循环结构，而不是分割为回调和状态机。
简洁：创建生成器比创建一个常规的迭代器类更简单。

在Python中，yield关键字用于定义一个特殊类型的函数，叫做生成器（generator）。生成器允许我们按需生成数据，而不是一次性生成并存储所有数据，这样可以节省内存并实现更高效的数据处理。

当一个函数包含yield语句时，它不再是一个普通的函数。当你调用该函数时，它不会立即执行，而是返回一个生成器对象。你可以使用next()函数或者在循环中迭代这个对象来按需从生成器获取数据。

每次从生成器中请求数据时，函数将从上次yield的地方继续执行，直到再次遇到yield，然后返回新的数据。这个过程会一直继续，直到函数执行完毕。

下面通过几个例子来说明yield的使用：

示例1: 生成一个范围内的数值
python
Copy code
def generate_numbers(n):
    for i in range(n):
        yield i

gen = generate_numbers(5)

for number in gen:
    print(number)
# 输出：
# 0
# 1
# 2
# 3
# 4
示例2: 生成斐波那契序列
python
Copy code
def fibonacci(limit):
    a, b = 0, 1
    while a < limit:
        yield a
        a, b = b, a + b

for value in fibonacci(10):
    print(value)
# 输出：
# 0
# 1
# 1
# 2
# 3
# 5
# 8
示例3: 使用next()函数
python
Copy code
def simple_generator():
    yield 1
    yield 2
    yield 3

gen = simple_generator()
print(next(gen))  # 输出：1
print(next(gen))  # 输出：2
print(next(gen))  # 输出：3
如果再次尝试调用next(gen)，将会得到一个StopIteration异常，因为所有的数据都已经被产生。

总之，yield为我们提供了一种更高效的方法来生成和处理数据，特别是对于大数据集或无限序列。




闭包是编程语言中的一个重要概念，它涉及函数和与其相关的引用环境。在Python中，闭包允许一个函数访问并操作其定义所在作用域的局部变量，即使该函数是在其定义作用域之外被调用的。

闭包的定义有以下几个要点：

内嵌函数：闭包涉及至少两个函数，外部函数和一个或多个内部函数。内部函数引用了外部函数的局部变量。
引用环境：内部函数保留了对外部函数局部变量的引用，这样当内部函数被调用时，即使外部函数已经完成执行，这些变量仍然是可用的。
简单地说，闭包允许函数“记住”其定义环境，并允许在函数之外的地方使用该环境。

示例：
python
Copy code
def outer_function(x):
    def inner_function(y):
        return x + y
    return inner_function

closure_instance = outer_function(10)
print(closure_instance(5))  # 输出：15
在上述代码中，outer_function 返回了 inner_function 的引用。当我们调用 closure_instance(5) 时，它实际上调用的是 inner_function，并且它仍然可以访问变量 x（值为10）。

为什么使用闭包？
数据隐藏和封装：闭包可以用来隐藏数据，提供一种将数据与函数一同封装的方法。
动态函数生成：可以动态地生成并返回函数，如上面的例子所示。
轻量级匿名函数：闭包提供了一种定义能访问外部作用域变量的小函数的方法。
装饰器：在Python中，闭包经常与装饰器一起使用，装饰器是修改其他函数或类的功能的强大工具。
注意：
闭包可能会导致一些意外的行为，尤其是在循环中创建闭包时。因为闭包在其定义环境中捕获变量，所以你必须确保捕获的变量的值是你预期的那样。

例如：

python
Copy code
functions = []
for i in range(3):
    def func(x, i=i):  # 注意这里我们使用了默认参数来捕获当前的i值
        return x + i
    functions.append(func)

print(functions[0](10))  # 输出：10
print(functions[1](10))  # 输出：11
print(functions[2](10))  # 输出：12
上面的代码中，我们使用了默认参数 i=i 来捕获循环中的当前 i 值。如果没有这样做，所有的闭包函数都会使用相同的 i 值，即最后的值 2。
```