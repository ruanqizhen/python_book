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

上面程序中，my_slow_function() 函数创建了一个临时文件，然后在里面写了一些数据。在函数开始和结束的地方，我们使用了 time.time() 函数来得到当时的系统时间。两个时间之差，就是这个函数的运行时间。

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

```python
@timer
def my_slow_function():
    ...
```

就等效于：

```python
def my_slow_function():
    ...

my_slow_function = timer(my_slow_function)
```

运行上面的示例程序，虽然看是去还是运行被装饰的函数 `print(my_slow_function())`，但实际上，计时的程序也被运行了。程序运行结果大致如下，第一行表示程序运行时间，第二行是原函数自身的运行结果：

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

我们可以编写一个装饰器，记录函数的调用细节，包括函数名和传递给函数的参数。它可以帮助我们跟踪函数的使用情况或分析程序的性能问题。

```python
from functools import wraps
import logging

def log(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        logging.info(f"【调试】 调用函数 {func.__name__}；位置参数：{args}；关键字参数：{kwargs}")
        return func(*args, **kwargs)
    return wrapper
```

上面这个装饰器的 wrapper 函数在调用原始函数之前，使用 logging.info 记录了一个消息，包含原始函数的名称、位置参数和关键字参数。这就是用来帮助我们调试程序用的信息。我们可以按照如下方法使用这个装饰器：

```python
# 配置日志记录系统以在控制台打印消息
logging.basicConfig(level=logging.INFO)

@log   # 装饰器
def add(x, y):
    """加法函数，只是用来测试装饰器"""
    return x + y

# 调用测试函数并观察日志输出
print(f"测试函数结果： {add(5, y=7)}")
```

运行上面的测试程序，我们不但会看到程序本身打印的结果，还会看到高亮的日志打印结果：

```markdown {1}
INFO:root:【调试】 调用函数 add；位置参数：(5,)；关键字参数：{'y': 7}
测试函数结果： 12
```

### 缓存函数的结果

先看下面的代码：

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

上面的装饰器中， wrapper 函数首先检查 args 是否已经在 cache 中。如果在，直接返回缓存的结果。如果不在，调用原始函数，并将结果存储在 cache 中，然后返回该结果。当使用这个装饰器装饰一个函数时，该函数的结果会被缓存起来，使得相同的输入参数在下次调用时能够直接返回已缓存的结果，而无需再次执行函数。这种技术特别适用于优化那些调用开销大且经常以相同参数重复调用的函数。

我们在介绍递归函数时介绍了一种[带缓存的递归](recursive#带缓存的递归)算法。有了这个装饰器，就不比额外再改变函数代码以增加缓存了，只需要在之前没有缓存的函数上加上装饰器：

```python
@memoize
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)

# 测试
print(fibonacci(30))  # 有了缓存可以轻松计算很大的斐波那契数
```

### 参数验证

在编写一个新的函数的时候，一种稳妥的做法是，首先检查每个输入参数的数据都是否有效。如果输入参数无效，则应该停止函数运行，启动错误处理机制。不过，给每个参数都编写一段检查代码，还是比较繁琐的。好在，我们可以使用装饰器，编写一些常用的检查逻辑，这样就可以大大简化函数中检查参数有效性的代码。比如，我们下面编写一个装饰器，它回家查函数的每个输入参数，如果有参数小于等于零，则抛出异常。

```python
from functools import wraps

def validate_positive(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if any([arg <= 0 for arg in args]):
            raise ValueError("所有参数都必须为正数！")
        return func(*args, **kwargs)
    return wrapper
```

上面的装饰器中，wrapper 函数在调用原始函数之前，先检查所有位置参数是否都是正数。any() 函数来实现的。如果发现有非正数的参数，会引发 ValueError。如果所有参数都是正数，调用原始函数并返回结果。

any() 函数是 Python 中的一个内置函数，它用来检查可迭代对象（如列表、元组、集合、字典等）中的元素是否至少有一个为 True。如果可迭代对象中的任何一个元素的布尔值为 True，则 any 函数返回 True；否则，如果所有元素都为 False 或者可迭代对象为空，则返回 False。与之类似的还有一个 all() 函数，它在所有元素都是 True 时返回 True；否则返回 False。

下面的函数用于计算几个物品的总重量，当有输入物品的重量小于等于零，它将会报错：

```python
@validate_positive
def get_toal_weight(*args):
    result = 0
    for weight in args:
        result += weight
    return result

# 测试
print(get_toal_weight(1, 2, 3, 4, 5))

# 运行下面的代码会抛出一个 ValueError 异常，因为参数中有负数
# print(get_toal_weight(1, 2, 3, 4, -5))
```


### 验证用户权限

有时候，出于保护隐私、法律、公司政策等原因，需要对某些函数的访问加以限制，只有取得许可的人员，才可以访问特定的函数。我们可以使用装饰器来实现这样的功能：

```python
from functools import wraps

def requires_permission(permission):
    def decorator(func):
        @wraps(func)
        def wrapper(user, *args, **kwargs):
            if user.permissions.get(permission):
                return func(user, *args, **kwargs)
            raise PermissionError(f"用户 {user.name} 没有 {permission} 的权限")
        return wrapper
    return decorator
```

上面的装饰器中，wrapper 函数调用 user.permissions.get(permission) 来检查当前用户是否有相应权限，如果有权限，才会调用原函数 func()，否则会抛出 PermissionError 异常。函数  user.permissions.get(permission) 是我们假定的已经存在的一个用于检查用户权限的函数，为了演示上面的装饰器，我们实现了一个非常简易的查验机制：

```python
# 用于演示的 User 类，它简单的定义了每个用户是否有某项操作的权限
class User:
    def __init__(self, name, permissions):
        self.name = name
        self.permissions = permissions

# 假设两个用户，一个有文档编辑权限，一个没有：
editor = User("贾经理", {'编辑': True})
viewer = User("小明", {'编辑': False})

# 下面是一个需要检查访问权限的函数
@requires_permission('编辑')
def edit_document(user, document):
    return f"{user.name} 编辑了文档： {document}"


# 测试：
print(edit_document(editor, "项目计划2033"))     # 应该允许编辑

try:
    print(edit_document(viewer, "工资调整计划"))  # 应该引发异常
except PermissionError as e:
    print(e)  # 输出错误信息
```

运行上面的测试程序，可以看到如下输出：

```
贾经理 编辑了文档： 项目计划2033
用户 小明 没有 编辑 的权限
```


### 重试

有些函数在运行时出错概率是比较高的，比如链接某网页的函数，很可能因为偶发性的网络错误无法打开预设的网页。我们可以编写一个装饰器，让类似的函数在出错时，重复运行几次，直到运行成功为止：

```python
import time
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
                        time.sleep(delay)  # 延时
                        continue
                    else:
                        raise e
        return wrapper
    return decorator
```

上面的装饰器中，wrapper 函数会尝试执行 func。如果执行过程中发生异常，并且当前尝试次数未达到 attempts 指定的次数，则在等待 delay 指定的秒数后，再一次尝试前。如果尝试次数达到上限，则重新抛出异常。我们可以编写一个有可能失败的函数来测试上面的装饰器。测试函数内会在 0 和 1 之间随机选取一个数，如果选 0 则表示函数运行失败； 1 表示成功。如果我们尝试运行这个有可能失败的函数 5 次，基本上总会碰上一次运行成功的：

```python
import random

@retry(attempts=5, delay=2)
def may_fail_func():
    """一个可能失败的函数"""
    if random.randint(0, 1) == 0:
        print("函数运行失败！")
        raise ValueError("多个随机数都是 0。")
    return "函数运行成功！"

try:
    result = may_fail_func()
    print(result)
except ValueError as e:
    print(f"多次尝试后，依然失败： {e}")
```
