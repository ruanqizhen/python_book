# 一等公民

在 Python 中，函数是一等公民（first-class citizen），也就是地位非常高的意思。函数地位高体现在：函数可以作为参数传递、作为返回值返回、赋值给变量或存储在数据结构中。这样的特性提供了大量的灵活性和动态性，特别是在更高阶的函数编程中。等我们介绍了[面向对象编程](oop)的概念后，会再进一步讨论这个[“一等公民”的本质](objects#函数对象)。

## 函数作为参数

我们之前介绍过一个函数 [help()](function#函数文档)，它可以返回一个函数的帮助文档。这个 help() 函数接收的参数就是一个函数，比如 `help(print)` 就会打印出 print() 函数的帮助文档。

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

# 使用 operate 函数和 add 函数计算 3 + 5
result1 = operate(add, 3, 5)
print(result1)  # 输出：8

# 使用 operate 函数和 subtract 函数计算 9 - 4
result2 = operate(subtract, 9, 4)
print(result2)  # 输出：5

# 使用 operate 函数和 multiply 函数计算 3 * 7
result3 = operate(multiply, 3, 7)
print(result3)  # 输出：21
```

上面的程序定义了三个简单函数： add, subtract 和 multiply，它们分别实现加法、减法和乘法操作。此外，还定义了一个名为 operate 的高阶函数，它接受一个函数作为其第一个参数和两个数字作为其余参数。这个函数调用传入的函数参数，并将其余的两个数字作为参数传递给该函数。最后，我们使用 operate 函数，传递先前定义的函数和一些数字作为参数。

这样实现的代码允许用户在不改变 operate 函数的内部逻辑的情况下，就能够使用不同的操作、策略。这样可以避免重复的代码，因为所有的操作都使用了同一个 operate 函数。同时使代码更加清晰和可读，特别是当操作变得更加复杂时。

在面向对象的编程中，通常会利用类的多态特性，来实现这种调用同一个函数却表现出不同的行为的功能；在面向过程的编程中，只能依赖条件语句实现类似功能；而在函数式编程中，则采用把函数作为参数的方式来实现这种功能。


## 函数作为返回值

函数不但能够作为另一个函数的参数，也可以作为另一个函数的返回值。下面我们看一个简单的示例，其中一个函数返回了另一个函数：

```python
def get_function(power):
    def raise_to_power(x):
        return x ** power
    return raise_to_power

square = get_function(2)
cube = get_function(3)

print(square(4))  # 输出：16
print(cube(4))    # 输出：64
```

在上述示例中，get_function 接受一个参数 power（指数） 并返回了一个[内部函数](function#嵌套函数) raise_to_power。返回的函数在其内部保留了 power 的值，使我们能够创建并使用不同指数的函数，如平方 square 和立方 cube。

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

operation = math_operation('+')  # 返回加法函数
print(operation(5, 3))           # 输出：8

operation = math_operation('-')  # 返回减法函数
print(operation(5, 3))           # 输出：2
```

## 闭包

闭包（Closure）的核心思想是一个函数可以访问并操作其定义所在作用域的局部变量，即使该函数是在其定义作用域之外被调用的。比如：

```python
def outer_function(x):
    def inner_function(y):
        return x + y
    return inner_function

closure_instance = outer_function(10)
print(closure_instance(5))  # 输出：15
```

在上述代码中，outer_function 返回了 inner_function 的引用。当我们调用 closure_instance(5) 时，调用发生在 outer_function 之外。也就是说，在定义 inner_function 的域之外调用了 inner_function，但 inner_function 仍然可以访问在定义它的域之内的局部变量 x，其值为 10。

闭包涉及至少两个函数，外部函数和一个或多个内部函数。内部函数引用了外部函数的局部变量。内部函数保留了对外部函数局部变量的引用，这样当内部函数被调用时，即使外部函数已经完成执行，这些变量仍然是可用的。

闭包也可能会导致一些意外的行为，尤其是在循环中创建闭包时。因为闭包在其定义环境中捕获变量，所以必须确保捕获的变量的值是预期的那样，例如：

```python
def outer_function():
    functions = []
    for i in range(3):
        def func(x): 
            return x + i     # 捕获 i
        functions.append(func)
    return functions

functions = outer_function()
print(functions[0](10))  
print(functions[1](10)) 
print(functions[2](10)) 
```

上面的代码中，使用循环创建了三个内部函数，创建这三个内部函数的时候，i 的值分别是 0, 1, 2。因此，当 x= 10 的时候，  我们期望这三个内部函数分别返回 10, 11, 12，也就是 x+i 的值。然而，执行这段程序，三个 print 语句的输出都是 12。要知道，这时候环境中就只有一个名为 i 的变量，所以三个内部函数使用的都是这同一个 i。它们计算的结果自然也就相同。

如果需要记录不同的 i 的值，那么需要多个变量才行，比如我们可以使用了默认参数 i=i 来捕获循环中的当前 i 值：

```python
def outer_function():
    functions = []
    for i in range(3):
        def func(x, i=i):  # 注意这里我们使用了默认参数来捕获当前的i值
            return x + i
        functions.append(func)
    return functions

functions = outer_function()
print(functions[0](10))  # 输出：10
print(functions[1](10))  # 输出：11
print(functions[2](10))  # 输出：12
```

这样，程序运行结果就符合预期了。

闭包可以用于读数据和函数的[封装](oop#封装)，因为，闭包可以用来隐藏数据，把外部函数中的局部变量隐藏起来。外部程序需要访问数据，只能通过定义好的函数进行访问。

闭包经常与[装饰器](decorator)一起使用，装饰器是修改其他函数或类的功能的强大工具。

## 函数柯里化

函数柯里化（Currying）是一种将一个多参数函数转换为一系列单参数函数的方法。这听起来可能是一个有趣但不实用的技巧，但在某些上下文中，柯里化可以非常有用。在一些更高级的功能中，比如创建高阶函数、装饰器等都需要使用到函数柯里化技术。

柯里化的一个经典例子是对于一个二元函数 f(x, y)，柯里化后，得到一个函数 g(x)，其返回值是另一个函数，这个返回的函数用于处理 y。比如，下面示例是一个简单的加法函数，它需要两个输入参数，但是我们可以把它做成一些列单参数函数：

```python
# 这是实现加法的单参数函数
def curried_add(x):
    def add_y(y):
        return x + y
    return add_y

# 计算 3 + 4 可以写成：
print(curried_add(3)(4))  # 输出: 7

# 也可以把其中某个参数固定下来
add_five = curried_add(5)
print(add_five(10))       # 输出: 15
```

## 偏函数

偏函数 (Partial Functions) 是柯里化的一个特例。使用偏函数，可以固定一个或多个参数的值，并返回一个新函数。这个新函数可以使用剩余的参数调用原始函数。偏函数的主要用途是简化一些特别常用的函数的参数数量。

还有一种应用场合是，需要调用一个库函数 foo，需要给这个函数传入一个只有一个参数的函数作为其参数 bar，但是我们已有的可用的函数都有多个参数，那么，可以使用偏函数把手头的多参数函数的其它参数都固定下来，包装成只有一个参数的函数，这样就符合参数 bar 的约定了。

Python 的 functools.partial 可以用来创建偏函数。例如：

```python
from functools import partial

def multiply(x, y):
    return x * y

# 创建一个新的函数，预先设置 y 为 2
double = partial(multiply, y=2)

print(double(4))  # 输出: 8
print(double(7))  # 输出: 14
```


## 匿名函数

匿名函数就是没有函数名的函数。这些函数通过 lambda 关键字定义，因此也被称为 lambda 函数。lambda 这个词正是借用了函数式编程的鼻祖 [Lambda Calculus 编程语言](https://lv.qizhen.xyz/appendix_languages#lambda-calculus-编程语言)中的 Lambda。

### 基本用法

lambda 函数的基本语法是：

```python
lambda arguments: expression
```

lambda 函数可以有任意数量的参数，但只能有一个表达式，表达式必须是单行的。表达式的值在执行时返回。

比如：

```python
lambda x, y: x + y
```

在上面的示例中，我们定义了一个 lambda 函数，该函数接受两个参数 x 和 y 并返回它们的和。使用 lambda 函数与使用普通函数类似，在函数后面加上括号和参数，就可以调用运行一个函数：

```python
(lambda x, y: x + y) (2, 3) # 函数运行结果为 5
```

实际使用中，更多的是把 lambda 赋值给某个变量或参数，然后通过变量或参数在调用这个 lambda 函数。

```python
f = lambda x, y: x + y
print(f(2, 3))  # 输出: 5
```

在上面的示例中，我们将定义好的 lambda 函数分配给了变量 f，后续的程序可以使用变量 f 来调用这个 lambda 函数。f 作为指向一个函数的变量，它的功能与直接定义一个名为 f 的函数基本相同，比如函数可以定义可以为：

```python
def f(x, y)
    return x + y
```
区别在于，如果 f 是变量，那么程序运行中还可以让它再指向其它函数。如果 f 是函数名，那么就不能再使用 f 定义其它的函数功能了。在一些编程语言中，比如 JavaScript，有的程序员会倾向于使用匿名函数实现所有的函数，然后用变量，而不是函数名来指代它们。


### 嵌套 lambda 函数

虽然在 Python 中，lambda 函数只能有一个单行表达式，但我们可以通过嵌套调用来扩展 lambda 函数的功能。我们来看这样一个例子：

```python
h = lambda a, b: (lambda x: a(x) + b(x))
combined = h(lambda x: x * 2, lambda x: x * 3)

print(combined(4))  # 输出: (4*2) + (4*3) = 20
```

在上面的程序中， h 是一个 lambda 函数，它接受两个函数参数 a 和 b。作为参数的 a 和 b，本身也是函数。h 的返回值也是函数，是一个 lambda 函数，该函数接受一个参数 x ，然后计算并返回 a(x) + b(x) 的值。

combined 是一个函数，它就是调用 h 之后返回的 lambda 函数。在这里调用 h 函数时，传入了两个 lambda 函数作为参数传递给它：第一个 lambda 函数将其输入乘以 2，而第二个将其输入乘以 3。
所以，combined 这个新的 lambda 函数，当给它一个输入时，它会将该输入乘以 2，再将该输入乘以 3，然后将这两个结果相加返回。

嵌套定义的 lambad 函数与嵌套定义的普通函数一样支持闭包，也就是内部的 lambad 函数可以访问并操作外层函数的变量与参数。


### 精简代码

lambda 函数去掉了啰嗦的函数定义，很多时候可以帮助代码变得非常精简。我们再考虑一下，上文使用过的一个示例：

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

如果使用匿名函数实现完全相同的逻辑，可以让代码简洁的多，实际上一行代码即可：

```python
math_operation = lambda op: (lambda x, y: x - y, lambda x, y: x + y)[op == '+']

print(math_operation('+')(5, 3))  # 输出：8
print(math_operation('-')(5, 3))  # 输出：2
```




