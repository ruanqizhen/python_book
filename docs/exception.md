# 异常处理

错误处理机制是编程中一种处理程序运行过程中出现的异常或错误的方式。这种机制允许程序在遇到问题时优雅地处理错误，而不是直接崩溃或产生不可预期的行为。错误处理对于构建健壮和可靠的软件非常重要。在 Python 中，错误处理是通过异常（Exception）机制实现的。“异常”，可以理解为是意想不到的错误，它是程序运行期间发生的特殊事件，会中断程序的正常流程。Python 提供了一种异常处理机制，可以为异常定义特定的响应行为。

## 默认行为

如果在程序中不进行异常捕捉，并且在程序中发生了异常，那么 Python 会用以下方式处理异常：

1. 程序终止： 当 Python 遇到未处理的异常时，程序会立即终止，并且不会执行异常后面的代码。
2. 错误信息输出： Python 会显示一个错误消息和“追踪回溯”（traceback，也叫堆栈跟踪）。错误消息会告诉我们出了什么问题，比如，ValueError、IndexError。堆栈跟踪会显示导致错误的代码行的顺序。最底部一行显示的是错误的直接原因，而上面的行则显示了函数的调用关系。根据这两样信息，通常就能明确得知出错的原因和位置。

例如，下面这个代码中有一个除零操作，我们知道，任何数字都是不能被 0 除的，因此它无法正常运行：

```python
def divide(x, y):
    return x / y

result = divide(1, 0)
print("程序继续运行...")
```

运行上面的代码，会得到类似下面的输出：

```
Traceback (most recent call last):
  File "<filename>", line <linenumber>, in <module>
    result = divide(1, 0)
  File "<filename>", line <linenumber>, in divide
    return x / y
ZeroDivisionError: division by zero
```

程序在执行除法时会因错误而终止，因此不会执行后续的 `print("程序继续运行...")` 语句。

对于一些简单的程序，比如我们学习时候写的练习程序，未处理的异常只是导致程序终止，并没有太大问题。但对于正式的产品，或者是复杂的应用程序，如 Web 服务器或 GUI 应用程序，未处理的异常可能导致更严重的后果，比如：断开用户的连接，丢失用户数据，没能正确关闭或释放打开的资源等。因此，适当的异常处理是非常重要的，它不仅可以帮助开发者诊断和修复错误，还可以确保程序在出现错误时，仍然能够优雅地中止或继续运行。


## 捕获异常

### 基本用法

Python 使用 try except 语句来捕捉和处理异常：

```python
try:
    # 可能会抛出异常的代码
    x = 1 / 0
    print("程序继续运行...")
except ZeroDivisionError:
    # 当 ZeroDivisionError 异常发生时的处理代码
    print("除数不能为 0 !")
```

`try:` 下方的代码块是我们认为可能引发异常的部分。

`except ZeroDivisionError:` 下面的代码块是用来处理异常的。except 后面接的是异常的种类。在这个示例中，只针对 ZeroDivisionError 异常进行了处理。当 try 块中的代码引发了 ZeroDivisionError 异常时，Python 会跳过 try 块中剩余的代码，并立即执行这个 except 块中的代码。所以运行这段代码，我们只会看到输出： "除数不能为 0 !"

如果需要获得系统的异常信息，可以把异常通过 as 操作符赋值给一个变量：

```python
try:
    x = 1 / 0
except ZeroDivisionError as e:  # 变量 e 中保存了出错信息
    print(e)                    # 输出： division by zero
```

### 捕捉多种异常

在一个 try 块后面可以跟多个 except 块，捕捉多种异常，比如：

```python
try:
    num = int(input("输入一个数字： "))
    result = 10 / num
    some_list = [1, 2, 3]
    print(some_list[num])

except ZeroDivisionError:
    print("除数不能为 0 !")

except ValueError:
    print("请输入有效数字!")

except IndexError:
    print("索引越界!")
```    

这个示例中，用户首先被要求输入一个数字。如果用户输入 0，则会触发除法操作的除零异常 ZeroDivisionError；如果用户输入的不是有效整数（例如输入字符串），在尝试转换为整数时会引发 ValueError 异常；如果用户输入的数字过小或过大，超出了 some_list 的索引范围，则会触发索引越界异常 IndexError。

如果多个异常的处理方式相同，也可以把它们写在同一个 except 语句中，比如：

```python
try:
    x = int("a")
except (ZeroDivisionError, ValueError) as e:
    print("出现了异常!")
    print(e)
```    
    
### else 子句

在 try except 语句中，可以使用一个可选的 else 子句来定义一段只在没有异常发生时才会执行的代码，比如：

```python
try:
    x = 1 / 1
except ZeroDivisionError:
    print("除数不能为 0 !")
else:
    print("一切正常!")
```

很多时候，else 语句并不是必要的，比如上面的程序，也可以把代码直接写在 try 下面的代码块中：

```python
try:
    x = 1 / 1
    print("一切正常!")
except ZeroDivisionError:
    print("除数不能为 0 !")
```

使用 `else` 主要是为了提高了代码的可读性。因为它可以清晰地区分可能引发异常的代码（位于 `try` 块中）和仅在无异常时执行的代码（位于 `else` 块中）。
    
### finally 子句

在 `try except` 语句中，还可以使用一个 `finally` 子句。无论 `try` 块中的操作是否触发了异常，`finally` 子句中的代码都会被执行。`finally` 子句中不宜添加任何业务逻辑，其唯一用途是清理和结束任务，例如关闭打开的文件、释放资源、重置某些状态等。比如下面示例

```python
try:
    file = open("sample.txt", "r")
    x = 1 / 0
    # 由于异常出现，下面的关闭文件操作不会被执行
    file.close()
except ZeroDivisionError:
    print("除数不能为 0 !")
except FileNotFoundError:
    print("没找到文件!")
finally:
    file.close()
    print("文件被关闭!")
```

上面的示例程序中，在 try 代码块中，使用 open 函数以只读模式打开了 "sample.txt" 文件，并将返回的文件对象赋值给变量 file。任何打开的文件都必须被关闭，调用 file.close() 可以关闭文件。但是，把 file.close() 写在 try 块中是不安全的，因为一旦 file.close() 语句之前的任何代码出现了异常，程序就会跳过这一句，导致文件没有被关闭。

正确的方法是把 file.close() 写在 finally 字句中，这样不论是否有异常，程序都会调用它并关闭文件。

需要注意的是，把 `file.close()` 写在整个 `try except` 语句之后，同样是不安全的。因为在 `try except` 语句中，可能还存在有没被捕获的异常，或者它主动抛出了其他异常，这些都会导致 `try except` 语句之后的代码被跳过。只有写在 `finally` 子句中才安全。

```python
# 这是一个不安全的示例
try:
    file = open("sample.txt", "r")
    x = 1 / 0
except ZeroDivisionError:
    print("除数不能为 0 !")
    # 下面这句只是用来演示，它主动抛出一个演示用的异常
    raise ValueError("这是一个被主动触发的异常")
except FileNotFoundError:
    print("没找到文件!")

# 由于上面的语句中又出现了没有被处理的异常（ValueError），下面的关闭文件操作不会被执行
file.close()    
```

### 不要在 try 语句中使用 return

在 try 语句中使用 return 可能会导致一些意料之外的行为，例如运行下面的程序：

```python
def final_func():
    try:
        x = 1 + 2
        return x
    finally:
        return 0
        
print(final_func())
```

初看之下，`1+2` 肯定不会引起异常，所以程序应该打印 3，而实际上的结果却是 0。这是因为 try 代码段内的 return, break, continue 语句会触发调用 finally 代码段，而 finally 代码段中的 return 又会清除之前的信息，所以才有了意料之外的结果。为了防止类似谜之结果，return 最好放在 try 语句之外。


## 主动触发异常

在 Python 代码自己没有产生任何异常的情况下，我们也可以使用 raise 语句来主动引发（或者叫抛出）一个异常：

```python
if x < 0:
    raise ValueError("不能使用负数!")
```

上面的代码在发现变量小于零时，会主动抛出一个 ValueError 异常。

通过在代码中检查错误条件并主动抛出异常，我们可以确保程序不会在不合适的状态下继续执行。我们还可以为异常提供明确的错误消息，阐明错误原因，从而在异常发生时更快定位问题。在某些情况下，抛出异常也可以作为一种强制退出函数的方法，让函数不再继续执行。
    
## 自定义异常

在 Python 中，用户自定义的异常通常是标准异常的子类。下面这一段内容，需要在学习了[面向对象编程和类](oop)的概念之后，才会更容易理解。

大多数用户自定义的异常都应继承自 Exception 或 Exception 的一个子类。在自定义的异常类中，可以重写 `__init__` 方法来接受特定的参数。还可以重写 `__str__` 方法，以提供有关异常原因的更多详细信息。

比如，假设我们正在编写一个应用程序，其中需要处理与员工相关的操作。我们可以定义下面两个用户自定义的异常：

* EmployeeNotFound： 表示没有找到某个员工。
* InvalidSalary： 表示工资包含无效数据，例如负数等。

以下是定义这些异常的代码：

```python
class EmployeeError(Exception):
    """这是所有与员工相关的异常类的基类。"""
    pass

class EmployeeNotFound(EmployeeError):
    """表示没有找到某个员工。"""
    def __init__(self, employee_id):
        self.employee_id = employee_id

    def __str__(self):
        return f"没有找到员工号为： {self.employee_id} 的员工。"

class InvalidSalary(EmployeeError):
    """表示工资适合无效数据，比如是负数等。"""
    def __init__(self, salary_value):
        self.salary_value = salary_value

    def __str__(self):
        return f"无效的工资数： {self.salary_value}。 工资必须在 500 到 50000 之间。"
```

一旦定义了自定义异常，我们可以像使用内置异常一样使用它们：

```python
def set_salary(employee_id, salary):
    if salary < 0:
        raise InvalidSalary(salary)
    # ... rest of the function ...
```

使用具有描述性名称的自定义异常可以使代码更具可读性，并且可以为特定情况提供更多的上下文信息，帮助调用者更精确地处理不同的异常。
    
## 何时使用异常

在设计函数的时候，我们经常会面临是否需要抛出异常的选择。例如，函数的输入数据应为非空列表，但用户可能输入空列表，甚至其他类型的数据。此时，我们应让函数抛出异常，还是不抛出异常，而是返回特殊值（如 None 或空列表）呢？

这其实并没有一个固定答案，要根据具体的情况来判断，而且有很多因素可能会影响我们的决定：

### 行为保持一致

我们设计一个函数的行为，还要参考同一项目中其它函数，甚至考虑公司的其它项目都是怎么做的。同一个项目的不同部分，最好可以保持一致的行为。如果项目中大多数的函数都是使用异常来处理错误的，那么新设计的函数也应该利用异常处理机制。反之，如果项目中大多数函数是利用返回值作为错误处理机制的（有错误就返回 None，否则返回一个有意义的数据），那么新设计的函数也应该采取类似机制。

有些公司、部门等会有自己的编码规范，如果里面规定了采用何种错误处理机制，那么就应当遵循已有的规范。

### 错误的严重性

对于可以预期的，不严重的错误，一般不需要抛出异常。比如，如果函数的输入参数是一个列表，那么就应该考虑到输入列表为空的情况下。这时候可以考虑在函数内部增加检查输入参数的逻辑，如果输入的列表是空的，就直接返回一个空值，或 None，而不必抛出异常。

如果函数要求输入参数为列表，但用户提供了整数，这种错误较为严重，表明用户可能未正确使用函数。此时可抛出异常，更醒目地提醒用户发生了错误。

### 运行效率

异常处理机制有很明显的优点，它有清晰的处理逻辑，可以携带详细的错误信息，可以支持复杂的处理流程。但它也有缺点，最主要的缺点是有额外的性能开销，毕竟它要携带更多的数据，和控制更复杂的跳转逻辑。从代码的可读性考虑，异常处理机制更清晰明了；但是追求极致性能的程序可能更适合使用返回值作为错误处理机制。

### 错误信息

无论采用哪种错误处理机制，都一定要配有针对错误的详细说明。只有这样，函数的使用者才容易理解应当如何处理出现的错误。
