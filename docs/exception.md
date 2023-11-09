# 异常处理

在 Python 中，错误处理是通过“异常”机制实现的。异常，可以理解为是意想不到的错误，它是程序运行期间发生的特殊事件，它中断了程序的正常流程。Python 提供了处理异常的机制，使得可以为异常定义特定的响应行为。

## 默认行为

如果在程序中不进行异常捕捉，并且在程序中发生了异常，那么 Python 会用以下方式处理异常：

1. 程序终止： 当 Python 遇到未处理的异常时，程序会立即终止，并且不会执行异常后面的代码。
2. 错误信息输出： Python 会显示一个错误消息和“traceback”到控制台。这个 traceback 通常会显示异常发生的代码行数和一个异常消息，帮助开发者定位和理解错误的原因。

例如，以下代码：

```python
def divide(x, y):
    return x / y

result = divide(1, 0)
print("Program continues...")
```

运行上面的代码，会得到以下输出：

```
Traceback (most recent call last):
  File "<filename>", line <linenumber>, in <module>
    result = divide(1, 0)
  File "<filename>", line <linenumber>, in divide
    return x / y
ZeroDivisionError: division by zero
```

程序在做除法时就会出错停止，所以不会运行之后的打印 "Program continues..." 语句。

对于一些简单的程序，比如我们学习时候写的联系程序，未处理的异常只是导致程序终止，并没有太大问题。但对于正式的产品，或者是复杂的应用程序，如 Web 服务器或 GUI 应用程序，未处理的异常可能导致更严重的后果，例如断开用户的连接，丢失用户数据，没能正确关闭或释放打开的资源等。因此，适当的异常处理是非常重要的，它不仅可以帮助开发者诊断和修复错误，还可以确保程序在面对错误时能够优雅地中止或继续运行。


## 捕获异常

### 基本用法

Python 使用 try...except 语句来捕捉和处理异常：

```python
try:
    # 可能会抛出异常的代码
    x = 1 / 0
    print("Program continues...")
except ZeroDivisionError:
    # 当 ZeroDivisionError 异常发生时的处理代码
    print("Cannot divide by zero!")
```

`try:` 下面的这一块代码是我们认为有可能会引发异常的代码。
`except ZeroDivisionError:` 下面的代码块是用来处理异常的。在这个示例中，只针对 ZeroDivisionError 异常进行了处理。当 try 块中的代码引发了 ZeroDivisionError 异常时，Python 会跳过 try 块中剩余的代码，并立即执行这个 except 块中的代码。所以运行这段代码，我们只会看到输出： "Cannot divide by zero!"

### 捕捉多种异常

在一个 try 块后面可以跟多个 except 块，捕捉多种异常，比如：

```python
try:
    num = int(input("Enter a number: "))
    result = 10 / num
    some_list = [1, 2, 3]
    print(some_list[num])

except ZeroDivisionError:
    print("Cannot divide by zero!")

except ValueError:
    print("Please enter a valid number!")

except IndexError:
    print("Index out of range!")
```    

这个示例中，用户首先被要求输入一个数字。如果用户输入 0，则会触发除法操作的除零异常 ZeroDivisionError；如果用户输入的不是一个有效的整数（例如，输入了一个字符串），在尝试将输入转换为整数时会引发数据错误异常 ValueError；如果用户输入的数字大于 2， 超出了 some_list 的索引范围，则会触发索引越界异常 IndexError。

如果多个异常的处理方式相同，也可以把它们写在同一个 except 语句中，比如：

```python
try:
    x = int("a")
except (ZeroDivisionError, ValueError):
    print("An error occurred!")
```    
    
### else 子句

在 try...except 语句中，可以使用一个可选的 else 子句来定义一段只有在没有异常发生时才会执行的代码，比如：

```python
try:
    x = 1 / 1
except ZeroDivisionError:
    print("Cannot divide by zero!")
else:
    print("Everything went fine!")
```

很多时候，else 语句并不是必要的，比如上面的程序，也可以代码直接写在 try 语句中：

```python
try:
    x = 1 / 1
    print("Everything went fine!")
except ZeroDivisionError:
    print("Cannot divide by zero!")
```

使用 else 主要是为了提高了代码的可读性。因为它可以清晰地区分可能会引发异常的代码（放在 try 块中）和一定会正常执行的代码（放在 else 块中）。
    
### finally 子句

在 try...except 语句中，还可以使用一个 finally 子句。无论 try 块中的操作是否触发了异常，finally 子句中的代码都会被执行。finally 子句 中不应该添加主要的业务逻辑，它的唯一用途就是清理和结束任务，比如关闭代开的文件、释放资源、重置某些状态等。

```python
try:
    file = open("sample.txt", "r")
    x = 1 / 0
    # 由于异常出现，下面的关闭文件操作不会被执行
    file.close()
except ZeroDivisionError:
    print("Cannot divide by zero!")
except FileNotFoundError:
    print("File not found!")
finally:
    file.close()
    print("File closed!")
```

上面的示例程序中，在 try 代码块中，使用 open 函数以只读模式 ("r") 打开了 "sample.txt" 文件，并将返回的文件对象赋值给变量 file。任何打开的文件都必须被关闭，调用 file.close() 可以关闭文件。但是，如果把 file.close() 写在 try 块中是不安全的，如果 file.close() 之前的代码出现异常，程序就会跳过这一句。

正确的方法是把 file.close() 写在 finally 字句中，这样不论是否有异常，程序都会调用它关闭文件。

需要注意的是，把 file.close() 写在整个 try...except 语句之后，同样时不安全的，因为在 try...except 可能还有没被捕获的异常出现，或者又主动抛出了其它异常，这些都会导致 try...except 语句之后的代码被跳过。只有写在 finally 子句中才安全。

```python
# 这是一个不安全的示例
try:
    file = open("sample.txt", "r")
    x = 1 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")
    # 下面这句只是用来演示，它主动抛出一个演示用的异常
    raise ValueError("just for demo")
except FileNotFoundError:
    print("File not found!")

# 由于上面的语句中又出现了没有被处理的异常，下面的关闭文件操作不会被执行
file.close()    
```

## 主动触发异常

在 Python 代码自己没有产生任何异常的情况下，我们可以使用 raise 语句来主动引发一个异常：

```python
if x < 0:
    raise ValueError("Negative value is not allowed!")
```

通过在代码中检查错误条件并主动抛出异常，我们可以确保程序不会在不合适的状态下继续执行。我们还可以为异常提供一个明确的错误消息，说明为什么会出现错误，从而在异常出现时，可以更快地定位问题。在某些情况下，抛出异常也可以作为一种强制退出函数或方法的方法，而不是继续执行。
    
## 自定义异常

在 Python 中，用户自定义的异常通常是标准异常的子类。这一段在学习了面向对象编程和类的概念之后会容易理解。

大多数用户自定义的异常都应继承自 Exception 或 Exception 的一个子类。在自定义的异常类中，可以重写 `__init__` 方法来接受特定的参数。还可以重写 `__str__` 方法，以提供有关异常原因的更多详细信息。

比如，假设我们正在编写一个应用程序，其中需要处理与员工相关的操作。我们可以定义以下几个用户自定义的异常：

* EmployeeNotFound： 当查找特定员工失败时引发。
* InvalidSalary： 当试图设置无效的工资（例如负工资）时引发。

以下是定义这些异常的代码：

```python
class EmployeeError(Exception):
    """Base class for all employee-related exceptions."""
    pass

class EmployeeNotFound(EmployeeError):
    """Raised when an employee with a specific ID is not found."""
    def __init__(self, employee_id):
        self.employee_id = employee_id

    def __str__(self):
        return f"Employee with ID {self.employee_id} not found."

class InvalidSalary(EmployeeError):
    """Raised when an invalid salary value is provided."""
    def __init__(self, salary_value):
        self.salary_value = salary_value

    def __str__(self):
        return f"Invalid salary value: {self.salary_value}. Salary must be non-negative."
```

一旦定义了自定义异常，我们可以像使用内置异常一样使用它们：

```python
def set_salary(employee_id, salary):
    if salary < 0:
        raise InvalidSalary(salary)
    # ... rest of the function ...
```

使用描述性名称的自定义异常可以使代码更具可读性，并且可以为特定情况提供更多的上下文信息，帮助调用者更精确地处理不同的异常。
    
