# Decorators

Decorators allow you to enhance or change the behavior of functions without modifying the existing code. In essence, a decorator is a function that takes a function as an argument and returns a new function. The returned function modifies or extends the functionality of the input function.

## Basic Usage

### Timing Function Execution

Suppose we find that our program is running very slowly and we want to figure out where the problem lies. The simplest approach is to add timing to the functions that might be running slowly, to see how long each one actually takes. For example, if we have a function called `my_slow_function()` that does something, and we want to add timing to it, we can write it like this:

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

In the program above, `my_slow_function()` creates a temporary file and writes some data into it. At the start and end of the function, we use `time.time()` to get the current system time. The difference between the two times is the execution time of the function.

### A Generic Timer Function

After debugging is done, the inserted timing statements need to be removed or restored. This kind of modification is manageable for a single function, but it becomes quite cumbersome if you need to measure the execution time of many different functions. We can make an improvement: write a generic timer function that takes a function as a parameter, records the system time at the start and end of the function's execution, and then prints the execution time. This way, no matter which function's execution time needs to be measured, we can directly call this timer function to measure it, without having to modify each function individually:

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

The program above creates a generic `timer()` function that takes another function as a parameter. It runs the input function and records its execution time. This approach is already quite good, but it still requires changing how the function is called -- every place where the original function is called must be wrapped with `timer()`. It would be even better if this could be done automatically, and that is exactly what decorators do: they can automatically wrap the original function.

### A Timing Decorator

First, we need to modify the `timer()` function to work as a decorator. A decorator needs to return a function to replace the original function, so we need `timer()` to return a function, rather than the result of running the original function. The way to use a decorator is to place the decorator function on the line above the function being decorated, with an `@` symbol in front of the decorator function. The improved code is as follows:

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

In the program above, `timer()` is a decorator. It itself receives one parameter, which is the function being decorated. `timer()` returns the `wrapper()` function defined inside it. When the program runs, this `wrapper()` function will replace the decorated function. The `wrapper()` function must have the same input and output as the decorated function. To be more general, we make `wrapper()` accept a variable number of positional and keyword arguments, thus supporting all possible argument combinations, and pass them completely to the decorated function.

The timing functionality remains the same, but when printing the execution time, it calls the function's `__name__` attribute, which returns the function's name. This way, the printed information includes the name of the decorated function, making it easy for the user to see which function each execution time belongs to.

When using a decorator, placing `@timer` above `def my_slow_function():` tells the system to automatically replace all calls to `my_slow_function()` with the decorator's `wrapper` function.

```python
@timer
def my_slow_function():
    ...
```

is equivalent to:

```python
def my_slow_function():
    ...

my_slow_function = timer(my_slow_function)
```

Although it still looks like we are running the decorated function with `print(my_slow_function())`, in reality, the timing logic is also executed. The program output looks roughly like this, with the first line showing the execution time and the second line showing the result of the original function:

```
my_slow_function ran in: 0.001227 seconds
/tmp/tmp4kla830b
```

### Preserving Function Attributes

The functionality of this decorator is already basically complete. However, there is a minor flaw: when the program runs, the decorated function is replaced by `wrapper()`, which causes the function's attributes to differ from what is expected. For example, running the following code:

```python
print(my_slow_function.__name__)
print(my_slow_function.__doc__)

# 输出：
# wrapper
# None
```

We can see that these attributes actually belong to the `wrapper()` function. To fix this issue, we need to borrow a built-in Python decorator called `functools.wraps` to also decorate the `wrapper()` function:

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

`@wraps(func)` updates the relevant attributes of the wrapper function, making them more closely match those of `func`.

## Parameterized Decorators

Looking at the `@wraps(func)` decorator mentioned in the example above, this decorator itself takes a parameter because it needs to obtain information from the decorated function, so it must know which function is being decorated. We can also implement parameterized decorators like this. The approach is to first write a function that takes parameters, and then have this function return the actual decorator. Suppose we need to write a decorator that runs the decorated function multiple times, with the number of repetitions passed in as a parameter to the decorator. Here is the code to implement such a decorator:

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

In the code above, we first define a decorator factory function `repeat(num_times)`, which returns the actual decorator function `decorator_repeat`. Then `decorator_repeat` takes a function as a parameter and returns a new function `wrapper`, which calls the decorated function `func` multiple times.

## Applications

The timing example above is one very useful application of decorators. Besides recording execution time, decorators can help us with many other tasks. For example:

### Logging Function Calls

We can write a decorator that logs the details of function calls, including the function name and the arguments passed to it. This can help us track function usage or analyze program performance issues.

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

In the decorator above, the `wrapper` function uses `logging.info` to log a message before calling the original function, containing the original function's name, positional arguments, and keyword arguments. This is information used to help us debug the program. We can use this decorator as follows:

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

Running the test program above, we will not only see the results printed by the program itself, but also the highlighted log output:

```markdown {1}
INFO:root:【调试】 调用函数 add；位置参数：(5,)；关键字参数：{'y': 7}
测试函数结果： 12
```

### Caching Function Results

First, take a look at the code below:

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

In the decorator above, the `wrapper` function first checks whether `args` is already in `cache`. If it is, it directly returns the cached result. If not, it calls the original function, stores the result in `cache`, and then returns the result. When this decorator is used on a function, the function's results are cached, so that the next time the same input arguments are used, the cached result can be returned directly without re-executing the function. This technique is particularly useful for optimizing functions that are expensive to call and are frequently called with the same arguments.

When we introduced recursive functions, we covered a [memoized recursion](recursive#带缓存的递归) algorithm. With this decorator, there is no need to modify the function code to add caching; you simply add the decorator to a function that previously lacked caching:

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

Note: The simple caching implementation above requires that the function's arguments be hashable, meaning the arguments cannot contain mutable objects like lists or dictionaries. If you need to handle complex arguments, it is recommended to use `functools.lru_cache` from Python's standard library.

### Parameter Validation

When writing a new function, a safe practice is to first check whether each input parameter is valid. If an input parameter is invalid, the function should stop and trigger error handling. However, writing validation code for every parameter can be quite tedious. Fortunately, we can use decorators to write some common validation logic, which can greatly simplify the code for checking parameter validity in functions. For example, let's write a decorator that checks each input parameter of a function and raises an exception if any parameter is less than or equal to zero.

```python
from functools import wraps

def validate_positive(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        # 检查位置参数
        if any(arg <= 0 for arg in args):
            raise ValueError("位置参数必须为正数！")
        # 检查关键字参数
        if any(val <= 0 for val in kwargs.values()):
            raise ValueError("关键字参数必须为正数！")
        return func(*args, **kwargs)
    return wrapper
```

In the decorator above, the `wrapper` function checks whether all positional arguments are positive before calling the original function. This is implemented using the `any()` function. If any non-positive argument is found, it raises a `ValueError`. If all arguments are positive, it calls the original function and returns the result.

The `any()` function is a built-in Python function that checks whether at least one element in an iterable (such as a list, tuple, set, or dictionary) is `True`. If the boolean value of any element in the iterable is `True`, `any()` returns `True`; otherwise, if all elements are `False` or the iterable is empty, it returns `False`. There is also a similar `all()` function, which returns `True` only when all elements are `True`; otherwise, it returns `False`.

The following function calculates the total weight of several items. When any input item weight is less than or equal to zero, it will raise an error:

```python
@validate_positive
def get_total_weight(*args):
    result = 0
    for weight in args:
        result += weight
    return result

# 测试
print(get_total_weight(1, 2, 3, 4, 5))

# 运行下面的代码会抛出一个 ValueError 异常，因为参数中有负数
# print(get_total_weight(1, 2, 3, 4, -5))
```


### Permission Checking

Sometimes, for reasons such as privacy protection, legal requirements, or company policy, access to certain functions needs to be restricted so that only authorized personnel can use them. We can use decorators to implement this functionality:

```python
from functools import wraps

def requires_permission(permission):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # 尝试获取 user 对象
            user = None
            if args:
                user = args[0] # 假设第一个位置参数是 user
            elif 'user' in kwargs:
                user = kwargs['user'] # 或者通过关键字获取
            
            # 进行检查 (需要确保 user 存在且有 permissions 属性)
            if user and hasattr(user, 'permissions') and user.permissions.get(permission):
                return func(*args, **kwargs)
            
            raise PermissionError(f"权限不足或无法识别用户")
        return wrapper
    return decorator
```

In the decorator above, the `wrapper` function calls `user.permissions.get(permission)` to check whether the current user has the required permission. If they do, the original function `func()` is called; otherwise, a `PermissionError` exception is raised. The function `user.permissions.get(permission)` is a pre-existing check function we assume is available. To demonstrate the decorator above, we implemented a very simple verification mechanism:

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

Running the test program above produces the following output:

```
贾经理 编辑了文档： 项目计划2033
用户 小明 没有 编辑 的权限
```


### Retry

Some functions have a high probability of failing at runtime. For example, a function that connects to a web page might fail to open the expected page due to intermittent network errors. We can write a decorator that makes such functions retry several times on failure, until they succeed:

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
                        time.sleep(delay)
                        continue
                    else:
                        raise  # 直接 raise，保留完整的原始异常调用栈
        return wrapper
    return decorator
```

In the decorator above, the `wrapper` function attempts to execute `func`. If an exception occurs during execution and the number of attempts has not yet reached the specified `attempts` count, it waits for the number of seconds specified by `delay` and then tries again. If the maximum number of attempts is reached, it re-raises the exception. We can write a function that might fail to test the decorator above. The test function randomly picks a number between 0 and 1; if 0 is chosen, the function fails; if 1 is chosen, it succeeds. If we try to run this potentially failing function 5 times, we will almost always encounter at least one successful run:

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
