# 异步和并发

## 相关概念

### 并行和并发

这两个概念经常一起讨论，它们有相似处，但并不相同。

- **并行（Parallelism）：** 并行是指多个任务在同一时刻同时执行。在多核或多处理器的系统中，多个任务可以真正同时执行。
- **并发（Concurrency）：** 并发更强调任务管理，即多个任务交替执行，从宏观上看这些任务是同时进行的，但微观上它们可能是轮流使用 CPU 资源的。并发强调的是任务启动、执行和完成的时序关系，而不是实时性。

### 协程

当一个函数（父函数）调用另一个函数（子程序）时，程序的执行流将转移到子函数的开始处，并继续执行直到达到子函数的结束点。完成后，控制权返回到父函数，并从子程序调用点的下一条语句继续执行。

协程（Coroutines）是除了子函数调用之外的另一种调用模型，它是一种更灵活的代码执行模型。在协程模型中，函数可以在执行过程中暂停，并在稍后的时间点恢复执行。这种“让出”（yield）控制权的能力允许协程在保持自身状态的同时与其他代码或协程进行交互。

协程可以在执行过程中的任何时刻暂停其执行，并将控制权交回给调用者。调用者可以在适当的时候恢复协程的执行，此时协程将从上次暂停的地方继续执行。协程非常适合于执行多任务处理和异步操作，因为它们可以在等待其他操作完成时释放控制权，从而使得程序可以处理其他任务。早期的协程是利用[生成器](generator#接收数据)实现的，但现在这套机制已经被 async await 机制取代了。

### 并发的实现

并发可以通过多种方式实现，包括：[多线程](multithread)、[多进程](multiprocess)和协程。与多线程或多进程相比，协程可以更轻量、高效地实现高并发，尤其是对于 I/O 密集型任务。在 Python 可以简便的支持协程之前，很多并发任务是利用多线程来实现的。但是在不同线程之间的切换是有额外开销的，因此，线程数不宜过多。而协程在不同任务之间切换时，几乎没有额外开销，效率更高，也可以支持更多的并发数量。使用协程不需要像在多线程编程中那样必须考虑的同步、数据安全等问题，开发效率也更高。

## 异步 I/O

### 基本用法

异步 I/O 是目前在 Python 中实现协程的主要方式。要实现异步 I/O，在定义函数式需要使用 async def，这样的函数被称为异步函数，或者协程函数；与之对应，没有 async 的函数被称为同步函数。协程函数不返回常规值，而是返回一个协程对象。要运行协程对象，则需要使用 await 关键字或将其提交到事件循环。事件循环（Event Loop）是异步编程中的核心概念。事件循环会不断地检查并执行队列中的任务。

Python 中异步 I/O 相关的方法和操作都在 asyncio 标准库中，它提供了创建和管理协程的工具。除了对 async await 语法的支持外，asyncio 还提供了事件循环、任务、异步流、异步锁等功能，这些功能都是构建异步应用程序所必需的。

下面，我们从一个最简单的示例开始介绍：

```python
import asyncio

async def main():
    print('Hello')
    await asyncio.sleep(1)
    print('World')

asyncio.run(main())
```

上面的代码中，我们使用 async def 定义了一个异步函数 main()。调用异步函数时，它会返回一个协程对象，而不是立即执行其中的代码。所以，我们要使用 asyncio.run() 来执行它。asyncio.run() 会启动事件循环，然后运行所有异步函数。

程序中还调用了一个 asyncio.sleep(1) 函数，它表示等待 1 秒钟。因为它也是异步函数，所以调用它需要使用 await。上面程序的功能是首先打印 "Hello"，然后等待 1 秒，最后打印 "World"。

上面的程序中只有一个异步函数，因此运行起来和普通同步函数的运行没有什么区别。但是，我们可以使用 asyncio.create_task() 或 asyncio.gather() 并发运行多个异步函数，这时候就能看出差别了：

```python
import asyncio

async def foo():
    print('甲函数开始')
    await asyncio.sleep(2)
    print('甲函数结束')

async def bar():
    print('乙函数开始')
    await asyncio.sleep(1)
    print('乙函数结束')

async def main():
    task1 = asyncio.create_task(foo())
    task2 = asyncio.create_task(bar())
    
    await task1
    await task2

asyncio.run(main())

# 输出：
# 甲函数开始
# 乙函数开始
# 乙函数结束
# 甲函数结束
```

在上面这个程序中，分别为两个异步函数 foo() 和 bar() 创建的任务 task1 和 task2 会并发运行。上面的程序也可以写成：

```python
import asyncio

async def foo():
    print('甲函数开始')
    await asyncio.sleep(2)
    print('甲函数结束')

async def bar():
    print('乙函数开始')
    await asyncio.sleep(1)
    print('乙函数结束')

async def main():
    await asyncio.gather(
        foo(),
        bar(),
    )

asyncio.run(main())
```

asyncio.gather() 函数用于并发运行多个异步任务。它会等待所有给定的异步任务完成才返回。

### 工作原理

在执行同步函数的时候，系统会维护一个调用栈（Call Stack）。调用栈也被称为执行栈或运行时栈，用于追踪程序在执行过程中函数的调用情况。当一个函数被调用时，计算机会将相关信息（如函数的返回地址、参数、局部变量等）放入调用栈中。这个信息通常被组织成一个栈帧（Stack Frame）。在函数执行的过程中，可以进行更多函数调用。每次调用都会在调用栈顶部添加一个新的栈帧。当函数完成其工作并准备返回时，它的栈帧会从调用栈中弹出。控制流程返回到进行当前函数调用的地方，继续执行后续的代码。调用栈的顶部始终保存着当前正在执行的函数的信息。当这个函数调用另一个函数时，新函数的信息会被压入栈顶。

在程序抛出异常时，我们通常会查看调用栈来追踪错误发生的位置和原因。如果调用函数层次太多，调用栈过深，可能会导致栈溢出错误，递归函数如果设计不好就很可能产生这种栈溢出错误。

在使用了 asyncio 的程序中，会开启一个事件循环（Event Loop），使用事件循环管理程序中的异步操作。默认情况下，asyncio 的事件循环是在单线程中运行的。

事件循环维护一个待执行任务列表。这些任务通常是协程对象，它们在事件循环中被调度和执行。事件循环负责监听和响应 I/O 事件（如网络请求或文件读写）以及其他类型的事件，并根据事件触发相应的回调函数或任务。当事件循环运行时，它会持续检查是否有任务需要执行，或是否有事件触发了回调函数。如果一个任务（例如，一个协程）需要等待某个异步操作的完成（如等待数据从网络读取），事件循环会挂起该任务，并在操作完成时再次唤醒它。尽管事件循环本身通常是单线程的，它通过协程和异步I/O操作实现了并发。这意味着程序可以同时处理多个操作，即使在后台只有一个事件循环在运行。


## 其它异步操作

### 异步文件 I/O 

asyncio 最主要的用途是处理网络相关操作，比如网页访问，数据库查询等。相对于本地数据的读写，网络通讯一般都非常慢。asyncio 库没有包含异步文件 I/O 的原生支持。这是因为在很多桌面应用或脚本中，文件操作速度尚可。但在高并发的网络服务器中，即使是短暂的文件读写阻塞也会卡住整个事件循环，导致无法响应其他请求。因此，在需要处理大量并发请求且涉及文件读写时，使用第三方库（如 aiofiles）是非常必要的。例如：

```python
import asyncio
import aiofiles

async def read_file(filename):
    async with aiofiles.open(filename, 'r') as f:
        content = await f.read()
    return content

async def write_file(filename, content):
    async with aiofiles.open(filename, 'w') as f:
        await f.write(content)

async def main():
    await write_file('sample.txt', '欢迎来到异步世界！')
    content = await read_file('sample.txt')
    print(content)

asyncio.run(main())
```

从上面代码可以看出，异步文件读写与同步文件读写的逻辑几乎没有差别，无非所有异步函数定义都加上 async，所有异步函数调用都加上 await。


### 异步上下文管理器

异步上下文管理器是类似于[常规上下文管理器](magic_methods#上下文管理)的对象，但它们使用 async def 定义其入口和退出方法： `__aenter__` 和 `__aexit__`。这样，我们可以在 async with 语句中使用它们，并且在其上下文中执行异步操作。例如，假设我们有一个模拟的异步数据库连接：

```python
import asyncio

class AsyncDatabase:
    async def connect(self):
        await asyncio.sleep(1)  # 模拟异步连接
        print("连接到数据库")

    async def close(self):
        await asyncio.sleep(1)  # 模拟异步断开连接
        print("断开数据库连接")

    async def __aenter__(self):
        await self.connect()
        return self

    async def __aexit__(self, exc_type, exc, tb):
        await self.close()

async def main():
    async with AsyncDatabase() as db:
        print("查询数据库")

asyncio.run(main())

# 输出：
# 连接到数据库
# 查询数据库
# 断开数据库连接
```

### 异步迭代器

异步[迭代器](iterator)可以在异步环境中迭代元素。它们需要定义 `__aiter__` 和 `__anext__` 方法，并可以在 async for 循环中使用。例如，一个模拟的异步数据流迭代器：

```python
class AsyncDataStream:
    def __init__(self, data):
        self.data = data
        self.index = 0

    def __aiter__(self):
        return self

    async def __anext__(self):
        await asyncio.sleep(0.5)  # 模拟异步数据获取

        if self.index >= len(self.data):
            raise StopAsyncIteration

        value = self.data[self.index]
        self.index += 1
        return value

async def main():
    stream = AsyncDataStream([1, 2, 3, 4, 5])
    async for value in stream:
        print(value)

asyncio.run(main())
```

### 异步生成器

[生成器](generator)也可以是异步的。下面是一个异步生成器的示例，它每隔一秒钟生成一个数字：

```python
import asyncio

# 定义异步生成器
async def async_generator():
    for i in range(5):
        # 模拟异步操作
        await asyncio.sleep(1)
        yield i

# 异步使用生成器
async def main():
    async for item in async_generator():
        print(item)

asyncio.run(main())
```

因为生成器是异步的，所以使用 for 循环迭代它的时候，要使用异步 for 循环 `async for`。


## 异步中的阻塞调用

使用异步 I/O 编程，必须所有函数都是异步的，才能够并发。但如果有一些函数不是异步的，又特别耗时，那么程序就会被阻塞在这里。程序在执行这个非异步函数时，不能执行其他操作，要一直等到这个函数被执行完，才可以继续。与此相反，如果函数是异步的，在某个任务等待读写结果的时候，程序就会切换到其它异步任务。

长时间运行的计算，同步 I/O 操作，如同步的文件读写、网络请求、数据库查询等，或者使用 time.sleep() 而不是 asyncio.sleep() 的函数等，都有可能导致阻塞调用。如果可能的话，应该用相应的异步函数来替换这些同步函数。例如，使用 aiohttp 替代 requests 进行 HTTP 请求；aiofiles 代替同步文件读写等。

对于那些不能变为异步的阻塞调用，可以考虑在一个单独的线程或进程中运行它们。比如可以使用 asyncio.to_thread() 将阻塞代码运行在一个单独的线程中：

```python
import asyncio

def blocking_task(seconds):
    import time
    time.sleep(seconds)
    return f"阻塞 {seconds} 秒"

async def async_task_1():
    await asyncio.sleep(1)
    print("异步任务 1 结束")

async def async_task_2():
    await asyncio.sleep(4)
    print("异步任务 2 结束")

async def main():
    # 使用 asyncio.gather 同时运行所有任务
    results = await asyncio.gather(
        asyncio.to_thread(blocking_task, 2),
        async_task_1(),
        async_task_2()
    )
    
    # 打印从 blocking_task 得到的结果
    print(results[0])

asyncio.run(main())
```

在上面的演示程序里，async_task_1，async_task_2 是两个异步函数，但 blocking_task 不是异步函数。如果直接运行 blocking_task，程序可能会被阻塞在这里。因此，我们使用 asyncio.to_thread() 把它放到单独的线程中去运行，这样它就不会阻塞其它操作了。由于异步的并发性质，输出的顺序可能会有不同，但通常 async_task_1 应该首先完成，因为其内部耗时最短，接着是 blocking_task，最后是 async_task_2。

## 优缺点

在笔者参与的 PHP（Hack） 项目中，几乎所有的函数都是异步的。这主要是因为 PHP 语言多用于开发网络服务，几乎所有的函数都与网络请求相关。Python 应用更广泛，在 I/O 操作较少的项目里异步函数就不那么常见了。

笔者多年前参与过一个 Python 项目，主要功能是把主机上的数据通过网络分发到几台外部设备上进行处理，再返回结果。当时 Python 还不支持异步 I/O，为了并行发布数据，只能采用多线程。（虽然可以使用 yeild 实现异步的功能，但是比较麻烦。）如果现在再看，还是异步 I/O 操作更简单高效。

与多线程相比，异步 I/O 通常更加轻量，因为它避免了线程上下文切换的开销，这使得异步 I/O 可以同时处理更多数量的并发任务。异步 I/O 通常更易于扩展，特别是在面对大量并发连接时。由于代码在单个线程中执行，避免了许多多线程编程的复杂性，如竞争条件、死锁等。缺点是异步 I/O 出现的比多线程晚，很多应用程序已经建立在多线程基础上了，再应用异步 I/O 可能会比较复杂。此外，异步 I/O 只适用于 I/O 操作频繁的程序。如果程序的瓶颈在于 CPU 计算（计算密集型），由于 Python 全局解释器锁（GIL） 的存在，多线程也无法利用多核 CPU 的优势，此时必须依赖多进程来实现并行计算。
