# Decorators

Decorators allow you to enhance or modify the behavior of functions without directly altering their source code. In essence, a decorator is a higher-order function that takes a function as an argument and returns a new function. This returned function extends or alters the execution of the original function.

## Basic Usage

### Timing Function Execution

Suppose your program is running slowly, and you want to locate the bottleneck. The simplest approach is to measure the execution time of functions suspected of being slow. For example, if we have a function named `my_slow_function()` that performs a task, we can measure its duration like this:

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

In the code above, `my_slow_function()` creates a temporary file and writes data to it. We use `time.time()` at the beginning and the end of the function to record the system time. The difference between these two timestamps represents the total execution time.

### A Generic Timer Function

Once debugging is complete, you must remove or revert these timing statements. While modifying a single function is straightforward, doing so for dozens of functions is tedious and error-prone. A better approach is to write a generic timer function that wraps the target function's execution, records the start and end times, and outputs the elapsed time. This allows us to measure any function without altering its internal code:

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

The generic `timer()` function accepts another function as an argument, executes it, and measures its duration. While this is a step forward, it requires you to change how the function is called. Every call site of `my_slow_function` would need to be wrapped in `timer(my_slow_function)`. We can automate this wrapping process using decorators.

### A Timing Decorator

To convert our `timer()` function into a decorator, we must adjust it to return a new function (a wrapper) that will replace the original function, rather than returning the immediate result of the target function. To apply a decorator, place its name prefixed with the `@` symbol on the line directly above the function definition. Here is the updated code:

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

In this implementation, `timer()` is a decorator. It accepts a single parameter, `func`, which is the function being decorated, and returns the nested `wrapper()` function. When the decorated function is called, the program actually executes `wrapper()`. To ensure the decorator can wrap any function, `wrapper()` is defined with `*args` and `**kwargs`. This allows it to capture and forward arbitrary positional and keyword arguments to the original function.

The timing logic remains unchanged, but we now use `func.__name__` to print the name of the function being timed. This makes the console output clear and easy to follow when timing multiple functions.

Placing `@timer` above `def my_slow_function():` tells Python to automatically bind the function name to the wrapper returned by `timer`.

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

When you call `my_slow_function()`, you are executing the timing wrapper. The console output displays both the execution time and the returned path of the temporary file:

```
my_slow_function ran in: 0.001227 seconds
/tmp/tmp4kla830b
```

### Preserving Function Attributes

Although our decorator works, it introduces a subtle side effect: because the original function is replaced by `wrapper()`, metadata such as the function's name (`__name__`) and docstring (`__doc__`) are replaced by those of the wrapper. For example:

```python
print(my_slow_function.__name__)
print(my_slow_function.__doc__)

# 输出：
# wrapper
# None
```

To fix this and preserve the original function's metadata, we use `functools.wraps`, a built-in utility decorator, on our nested `wrapper` function:

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

`@wraps(func)` copies the metadata of `func` onto the `wrapper` function, ensuring that reflection and debugging tools see the original function's information.

## Parameterized Decorators

Notice that `@wraps(func)` accepts an argument (`func`). To write a custom decorator that accepts arguments, we must construct a decorator factory. This factory is a function that accepts our configuration parameters and returns the actual decorator. For example, suppose we want to write a decorator `@repeat(num_times=N)` that executes the decorated function $N$ times. Here is how we implement it:

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

In this code, `repeat(num_times)` serves as a decorator factory that returns the actual decorator, `decorator_repeat`. This decorator then takes `func` as an argument and returns the `wrapper` function, which handles the repetition logic.

## Applications

Timing functions is just one of many practical use cases for decorators. Let's explore several other common applications in Python development.

### Logging Function Calls

We can write a decorator to log function calls, capturing the function's name and arguments. This is incredibly helpful for tracing execution flow and debugging runtime behavior.

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

In this example, `wrapper` uses `logging.info` to output a diagnostic message before invoking the decorated function, detailing its name and argument values. We can apply and test the decorator like this:

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

Running this test outputs both the logged details and the final function result:

```markdown {1}
INFO:root:【调试】 调用函数 add；位置参数：(5,)；关键字参数：{'y': 7}
测试函数结果： 12
```

### Caching Function Results

Caching (or memoization) stores function outputs based on their inputs, preventing redundant calculations. Consider the following implementation:

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

In this decorator, `cache` is a dictionary defined in the enclosure. The `wrapper` checks if `args` already exists as a key in `cache`. If it does, it returns the cached value directly; otherwise, it computes the value, caches it, and then returns it. This technique is highly effective for optimizing expensive functions that are repeatedly called with the same inputs.

When we introduced recursive functions, we covered a [memoized recursion](recursive#recursion-with-caching-memoization) algorithm. With this decorator, there is no need to modify the function code to add caching; you simply add the decorator to a function that previously lacked caching:

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

When writing functions, a defensive programming best practice is to validate input arguments. If an argument is invalid, the function should raise an exception. Writing repetitive validation code across multiple functions can clutter your codebase. Instead, you can encapsulate validation logic inside a decorator to keep functions clean. For example, let's write a decorator `@validate_positive` that checks if any input argument is less than or equal to zero:

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

In this decorator, the `wrapper` function uses the built-in `any()` function to check if any positional argument or keyword argument value is less than or equal to zero. If it finds one, it raises a `ValueError`; otherwise, it executes the target function.

The `any()` function returns `True` if at least one element in an iterable is truthy; otherwise, it returns `False`. Conversely, the `all()` function returns `True` only if all elements in the iterable are truthy. Both are handy when performing batch checks on collections.

The following function calculates the total weight of several items. If any input item weight is non-positive, the decorator blocks execution and raises an error:

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

Decorators are widely used in web frameworks and enterprise systems to handle authorization and access control, restricting functions to authorized users only:

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

In this example, the `wrapper` function attempts to locate a `user` object from the function's arguments. It then inspects the user's permissions. If the user lacks the required permission, it raises a `PermissionError`. To demonstrate this setup, we can define a simple `User` class and test the permission checks:

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

Running this demonstration produces the following output:

```
贾经理 编辑了文档： 项目计划2033
用户 小明 没有 编辑 的权限
```

### Retry

Certain operations, such as network requests or database connections, are prone to transient runtime failures. We can write a decorator to automatically retry a function a specified number of times with a delay between attempts before finally raising an exception:

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

The `@retry` decorator catches exceptions raised by the target function. If the execution fails, it waits for the specified `delay` and retries, up to the maximum number of `attempts`. If the function continues to fail after all attempts are exhausted, the exception is re-raised. Let's test this decorator with a function that fails randomly:

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
