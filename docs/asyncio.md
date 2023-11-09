# 异步 I/O

使用异步 I/O （Async I/O） 可以编写单线程并发代码。与多线程或多进程相比，异步 I/O 可以更轻松地实现高并发，尤其是对于 I/O 密集型任务。

## 基本用法

实现异步 I/O 需要使用协程（Coroutines），协程是一种特殊类型的函数，它使用 async def 定义的函数。使用 async 定义的函数，也被称为异步函数；与之对应，没有 async 的函数常被称为同步函数。协程函数不返回常规值，而是返回一个协程对象。要运行协程对象，需要使用 await 关键字或将其提交到事件循环。事件循环（Event Loop）是异步编程中的核心概念。事件循环会不断地检查并执行队列中的任务。

Python 中异步 I/O 相关的方法和操作都在 asyncio 标准库中，它提供了创建和管理协程的工具。除了基本的 async/await 语法外，asyncio 还提供了事件循环、任务、异步流、异步锁等功能，这些功能都是构建异步应用程序所必需的。

比如下面的程序：

```python
import asyncio

async def main():
    print('Hello')
    await asyncio.sleep(1)
    print('World')

asyncio.run(main())
```

上面的代码中，asyncio.sleep(1) 函数表示等待 1 秒钟。所以上面程序的功能是首先打印 "Hello"，然后等待 1 秒，最后打印 "World"。asyncio.run()会启动时间循环，然后运行所有异步函数。但是上面的程序中只有一个异步函数，它和普通同步函数的运行没有什么区别。

使用 asyncio.create_task() 或 asyncio.gather() 可以并发运行多个异步函数，这时候就可以看出区别了：

```python
import asyncio

async def foo():
    print('Foo start')
    await asyncio.sleep(2)
    print('Foo end')

async def bar():
    print('Bar start')
    await asyncio.sleep(1)
    print('Bar end')

async def main():
    task1 = asyncio.create_task(foo())
    task2 = asyncio.create_task(bar())
    
    await task1
    await task2

asyncio.run(main())

# 输出：
# Foo start
# Bar start
# Bar end
# Foo end
```

这里，foo() 和 bar() 会并发运行。上面的程序也可以写成：

```python
import asyncio

async def foo():
    print('Foo start')
    await asyncio.sleep(2)
    print('Foo end')

async def bar():
    print('Bar start')
    await asyncio.sleep(1)
    print('Bar end')

async def main():
    await asyncio.gather(
        foo(),
        bar(),
    )

asyncio.run(main())
```

## 异步文件 I/O 

asyncio 最主要的用途是处理网络相关操作，比如网页访问，数据库查询等。相对于本地数据的读写，网络通讯一般都非常慢。asyncio 库没有包含异步文件 I/O 的原生支持，这是因为文件操作，尤其是在普及了固态硬盘的情况下，一般不算太慢，不用异步处理也可以。但在某些情况下，特别是需要处理大量的文件或与其他异步操作同时进行时，异步文件 I/O 仍然会是有帮助的。我们可以使用第三方库，例如 aiofiles，实现异步读写文件。

异步读取文件:

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
    await write_file('sample.txt', 'Hello, Async World!')
    content = await read_file('sample.txt')
    print(content)

asyncio.run(main())
```


## 异步上下文管理器

异步上下文管理器是类似于常规上下文管理器的对象，但它们使用 async def 定义其入口和退出方法：__aenter__和__aexit__。这样，我们可以在 async with 语句中使用它们，并且在其上下文中执行异步操作。例如，假设我们有一个模拟的异步数据库连接：

```python
import asyncio

class AsyncDatabase:
    async def connect(self):
        await asyncio.sleep(1)  # 模拟异步连接
        print("Connected to database.")

    async def close(self):
        await asyncio.sleep(1)  # 模拟异步断开连接
        print("Connection closed.")

    async def __aenter__(self):
        await self.connect()
        return self

    async def __aexit__(self, exc_type, exc, tb):
        await self.close()

async def main():
    async with AsyncDatabase() as db:
        print("Doing database operations.")

asyncio.run(main())

# 输出：
# Connected to database.
# Doing database operations.
# Connection closed.
```

## 异步迭代器

异步迭代器可以在异步环境中迭代元素。它们需要定义 `__aiter__` 和 `__anext__` 方法，并可以在 async for 循环中使用。例如，考虑一个模拟的异步数据流迭代器：

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



## 异步中的阻塞调用

使用在异步 I/O 编程，所有函数都是异步的，才能够并发。但如果有一些函数不是并发（可以被称为同步的）的，有特别耗时，那么程序就会被阻塞在这里。程序在执行这个非异步函数时，不能执行其他操作，要一直等到这个函数被执行完，才可以继续。与此相反，如果函数是异步的，则程序可以等待一个操作完成时继续执行其他操作。

长时间运行的计算，同步 I/O 操作，如同步的文件读写、网络请求、数据库查询等，或者使用 time.sleep() 而不是 asyncio.sleep() 的函数等，都有可能导致阻塞调用。如果可能的话，替换阻塞库或函数为其异步版本。例如，使用 aiohttp 替代 requests 进行HTTP请求；aiofiles 代替同步文件读写等。

对于那些不能变为异步的阻塞调用，可以考虑在一个单独的线程或进程中运行它们。比如可以使用 asyncio.to_thread() 将阻塞代码运行在一个单独的线程中：

```python
import asyncio

def blocking_task(seconds):
    import time
    time.sleep(seconds)
    return f"Blocked for {seconds} seconds"

async def async_task_1():
    await asyncio.sleep(1)
    print("Async task 1 completed.")

async def async_task_2():
    await asyncio.sleep(4)
    print("Async task 2 completed.")

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

在上面的演示程序里，async_task_1，async_task_2 是两个异步函数，但 blocking_task 不是，直接运行，程序可能会被阻塞在这里。因此，我们使用 asyncio.to_thread() 把它放到单独的线程中去运行，这样它就不会阻塞其它操作了。由于异步的并发性质，输出的顺序可能会有不同，但通常 async_task_1 应该首先完成，因为其内部耗时最短，接着是 blocking_task，最后是 async_task_2。

## 优缺点

在笔者参与的 PHP 项目中，几乎所有的函数都是异步的。这主要是因为 PHP 语言多用于开发网络服务，几乎所有的函数都与网络请求相关。Python 应用更广泛，在 I/O 操作较少的项目里异步函数就不那么常见了。

笔者多年前参与过一个 Python 项目，主要功能是把主机上的数据通过网络分发到几台外部设备上进行处理，再返回结果。当时 Python 还不支持异步 I/O，为了并行发布数据，只能采用多线程。（虽然可以使用 yeild 实现异步的功能，但是比较麻烦。）如果现在再看，还是异步 I/O 操作更简单高效。

与多线程相比，异步 I/O 通常更加轻量，因为它避免了线程上下文切换的开销，这使得异步 I/O 可以同时处理更多数量的并发任务。异步 I/O 通常更易于扩展，特别是在面对大量并发连接时。由于代码在单个线程中执行，避免了许多多线程编程的复杂性，如竞争条件、死锁等。缺点是异步 I/O 出现的比多线程晚，很多应用程序已经建立在多线程基础上了，再应用异步 I/O 可能会比较复杂。此外，异步 I/O 只适用于 I/O 操作频繁的程序，如果程序瓶颈在于计算，要利用多 CPU，还是只能依赖多线程或多进程。