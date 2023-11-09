# 装饰器

装饰器可以在不修改现有代码的情况下增加或修改函数的功能。本质上，装饰器是一个接受函数作为参数的函数，并返回一个新的函数。返回新的函数，对输入的函数的功能进行了修改或拓展。


## 基本用法

### 为函数运行计时

假设我们发现自己的程序运行很慢，想查看一下问题出在了哪里。最简单的办法是给有可能运行慢的函数都添加一个计时，看看每个函数到底运行了多少时间。比如，有一个函数，名为 my_slow_function()，它实现了某些功能，现在想给它加个计时，就这样写：

```python
import tempfile
import time

def my_slow_function():
    start_time = time.time()    # 记录开始时间
    
    # 这下面一段是原本函数中的代码，在一个临时文件中写入一些数据
    # 创建一个临时文件
    with tempfile.NamedTemporaryFile(delete=False, mode='wb') as temp_file:
        # 随便写入一些数据
        for i in range(1000):
            # 将字符串转换为字节对象并写入一个新行
            temp_file.write((str(i) + '\n').encode('utf-8')) 
            
        # 获取临时文件的路径以便稍后使用    
        temp_file_path = temp_file.name  
    # 原函数中的代码到此结束
    
    end_time = time.time()       # 记录结束时间
    print(end_time - start_time) # 打印函数运行的总时间
    
    # 下面是原函数的返回语句
    return temp_file_path
```

上面程序中，my_slow_function() 函数创建了一个临时文件，然后再里面写了一些数据。在函数开始和结束的地方，我们使用了 time.time() 函数来得到当时的系统时间。两个时间之差，就是这个函数的运行时间。

### 通用的计时函数

程序调试结束，还要记得把插入的计时语句再改回去。这样的改动，对于单个函数还好，如果需要测量很多不同函数而耗时，那就比较麻烦了。我们可以做一些改进：编写一个通用的计时函数，它接收一个函数作为参数，在运行函数开始和结束时分别记录系统时间，然后打印出函数的运行时间。这样，无论需要测量哪个函数的运行时间，都可以直接调用这个计时函数去测量，不必再本别去修改每一个函数了：

```python
import tempfile
import time

# 这是通用的计时函数
def timer(func):
    start_time = time.time()      # 记录开始时间
    result = func()               # 运行目标函数
    end_time = time.time()        # 记录结束时间
    print(end_time - start_time)  # 打印函数运行的总时间
    return result
    
def my_slow_function():
    # 创建一个临时文件
    with tempfile.NamedTemporaryFile(delete=False, mode='wb') as temp_file:
        # 随便写入一些数据
        for i in range(1000):
            # 将字符串转换为字节对象并写入一个新行
            temp_file.write((str(i) + '\n').encode('utf-8')) 
            
        # 获取临时文件的路径以便稍后使用    
        temp_file_path = temp_file.name  
    
    return temp_file_path # 返回临时文件的路径
    
# 试验一下： 下面的调用会打印出程序运行时间
print(timer(my_slow_function))
```

上面程序创建了一个通用的 timer() 函数，它接收另一个函数作为参数，它会运行输入的函数，并记录这个函数的运行时间。这个方法已经很好了，但它还是要对调用函数的方法做改变，要在每一个调用原来函数的地方，使用 timer() 把原来函数包装一下，才能使用。如果能自动做这件事就好，装饰器干的就是这件事，它可以自动对原来的函数做包装。

### 计时装饰器

首先我们要把 timer() 函数改造一下，才能把它作为装饰器。装饰器需要返回一个函数，来替代原函数，所以我们需要让 timer() 返回函数，而不是原函数的运行结果。使用装饰器的方法是，把装饰器函数放在被装饰的函数的上一行，并在装饰器函数前面加一个 @ 符号。改进的代码如下：

```python
import time
import tempfile

# 通用的计时装饰器
def timer(func):
    """装饰器：测量并打印函数执行时间"""
    def wrapper(*args, **kwargs):
        start_time = time.time()        # 记录开始时间
        result = func(*args, **kwargs)  # 运行目标函数
        end_time = time.time()          # 记录结束时间
        print(f"{func.__name__} ran in: {end_time - start_time:.6f} seconds")
        return result
    return wrapper

@timer  # 使用 timer 装饰器
def my_slow_function():
    """在一个临时文件中写入数字 0 到 999 并返回其路径"""
    # 创建一个临时文件
    with tempfile.NamedTemporaryFile(delete=False, mode='wb') as temp_file:
        # 写入数据
        for i in range(1000):
            temp_file.write((str(i) + '\n').encode('utf-8'))  # 将字符串转换为字节对象并写入
        temp_file_path = temp_file.name  # 获取临时文件的路径
    return temp_file_path

# 试验一下：
print(my_slow_function())
```

在上面的程序中，timer() 是一个装饰器，他本身接收一个参数，也就是被装饰的函数。timer() 返回了其内部定义的 wrapper() 函数，在程序运行时，这个 wrapper() 函数将取代被装饰的函数。wrapper() 函数必须与被装饰的函数有相同的输入输出，为了更通用，我们让 wrapper() 接收不定数量的普通参数和关键字参数，也就是覆盖了所有可能的参数组合，然后一股脑全部传递给被装饰的函数。

计时的功能还是一样的，但是在打印函数运行时间的时候，它调用了一个函数的属性 `__name__`，它可以返回函数的名称。这样打印出来的信息带有被装饰函数的名字，方便用户分析每个运行时间都是属于哪个函数的。

使用装饰器的时候，把 `@timer` 放在 `def my_slow_function():` 的上面，系统就会自动的在所有调用 my_slow_function() 的地方，把它们用装饰器的 wrapper 函数替代。 

运行上面的程序，虽然看是去还是运行被装饰的函数 `print(my_slow_function())`，但实际上，计时的程序也被运行了。程序运行结果大致如下，第一行表示程序运行时间，第二行是原函数自身的运行结果：

```
my_slow_function ran in: 0.001227 seconds
/tmp/tmp4kla830b
```

### 保持函数属性

这个装饰器已经功能已经基本完善了。还有一点小瑕疵，就是运行程序的时候，被装饰的函数被 wrapper() 替代了，会造成函数属性与预期不符。比如，运行下面的代码：

```python
print(my_slow_function.__name__)
print(my_slow_function.__doc__)

# 输出：
# wrapper
# None
```

我们看到这些属性其实是属于 wrapper() 函数的。为了修改这个问题，我们需要借用一个 Python 内置的装饰器“functools.wraps”把 wrapper() 函数也修饰一下：


```python
import time
import tempfile
from functools import wraps

# 通用的计时装饰器
def timer(func):
    """装饰器：测量并打印函数执行时间"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()        # 记录开始时间
        result = func(*args, **kwargs)  # 运行目标函数
        end_time = time.time()          # 记录结束时间
        print(f"{func.__name__} ran in: {end_time - start_time:.6f} seconds")
        return result
    return wrapper

@timer  # 使用 timer 装饰器
def my_slow_function():
    """在一个临时文件中写入数字 0 到 999 并返回其路径"""
    # 创建一个临时文件
    with tempfile.NamedTemporaryFile(delete=False, mode='wb') as temp_file:
        # 写入数据
        for i in range(1000):
            temp_file.write((str(i) + '\n').encode('utf-8'))  # 将字符串转换为字节对象并写入
        temp_file_path = temp_file.name  # 获取临时文件的路径
    return temp_file_path

# 试验一下：
print(my_slow_function.__name__)
print(my_slow_function.__doc__)


# 输出：
# my_slow_function
# 在一个临时文件中写入数字 0 到 999 并返回其路径
```

`@wraps(func)` 会更新 wrapper 函数的相关属性，使其更接近 func。

## 带参数的装饰器

看上面示例中提到的 `@wraps(func)` 装饰器，这个装饰其本身也是带有参数的，因为它需要从被装饰的函数中获取信息，所以肯定需要知道被装饰的是哪个函数才行。我们也可以实现这样带参数的装饰器，方法是先写一个带参数的函数，然后让这个函数返回真正的装饰器。假设我们需要写一个装饰器，把被装饰的函数重复运行多次，次数是作为装饰器的参数传入的。下面是实现这样一个装饰器的代码：

```python
from functools import wraps

def repeat(num_times):
    """
    装饰器接收一个参数 num_times，它决定了被装饰的函数要被调用的次数。
    """
    def decorator_repeat(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(num_times):
                value = func(*args, **kwargs)
            return value
        return wrapper
    return decorator_repeat

# 使用带参数的装饰器
@repeat(num_times=4)
def greet(name):
    print(f"Hello {name}")

# 调用
greet("Qizhen")  # 输出 "Hello Qizhen" 四次
```

在上面的代码中，我们首先定义了装饰器工厂函数 repeat(num_times)，它返回真正的装饰器函数 decorator_repeat。而 decorator_repeat 接收一个函数作为参数并返回一个新的函数 wrapper，这个 wrapper 函数会调用被装饰的函数 func 多次。


## 应用场合

上文用来记录函数运行时间的应用就是一个装饰器一个非常有用的地方。除了记录运行时间，装饰器还可以帮我们做很多其它工作。比如：

### 记录函数的调用信息
为调试目的，记录函数调用的顺序和次数

```python
from functools import wraps
import logging

def log(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        logging.info(f"Running {func.__name__} with arguments {args} and keyword arguments {kwargs}")
        return func(*args, **kwargs)
    return wrapper
```

### 缓存函数的结果

避免重复计算

```python
from functools import wraps

def memoize(func):
    cache = {}
    @wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper
```

### 参数验证
检查传递给函数的参数是否有效

```python
from functools import wraps

def validate_positive(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if any([arg <= 0 for arg in args]):
            raise ValueError("All arguments must be positive")
        return func(*args, **kwargs)
    return wrapper
```

### 验证用户权限

```python
from functools import wraps

def requires_permission(permission):
    def decorator(func):
        @wraps(func)
        def wrapper(user, *args, **kwargs):
            if user.permissions.get(permission):
                return func(user, *args, **kwargs)
            raise PermissionError(f"User lacks the necessary {permission} permission")
        return wrapper
    return decorator
```

### 重试

如果函数失败，尝试多次执行

```python
from functools import wraps

def retry(attempts=3, delay=1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt < attempts - 1:
                        time.sleep(delay)
                        continue
                    else:
                        raise e
        return wrapper
    return decorator
```