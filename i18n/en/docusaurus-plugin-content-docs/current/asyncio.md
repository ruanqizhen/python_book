# Asyncio and Concurrency

## Related Concepts

### Parallelism and Concurrency

These two concepts are often discussed together; they are similar, but not the same.

- **Parallelism**: Multiple tasks execute at the exact same physical instant. True parallelism requires a multi-core or multi-processor hardware architecture.
- **Concurrency**: Multiple tasks are managed in an interleaved manner. From a high-level perspective, the tasks appear to execute simultaneously; at the micro level, however, they take turns sharing CPU resources. Concurrency is about structuring a program to handle multiple tasks at once, regardless of whether they execute at the same physical millisecond.

### Coroutines

In traditional programming, when a function (the caller) invokes another function (a subroutine), execution transfers to the beginning of the subroutine and runs continuously to completion. Once finished, control returns to the caller, resuming from the line immediately following the call.

Coroutines offer an alternative execution model. Instead of running to completion in one go, a coroutine can pause its execution and yield control back to the caller or event loop, saving its current local state. It can then be resumed later from the exact point it paused.

This ability to suspend and resume makes coroutines ideal for multitasking and asynchronous operations. While waiting for an I/O operation (like a network request) to complete, a coroutine yields control, allowing other tasks to run in the meantime. Historically, Python implemented coroutines using [generators](generator#sending-data-to-generators); today, this is natively supported via the `async`/`await` syntax.

### Implementing Concurrency

Concurrency in Python can be implemented using [multithreading](multithread), [multiprocessing](multiprocess), or coroutines. 

Compared to threads and processes, coroutines are lightweight and highly efficient, particularly for I/O-bound tasks. While thread context-switching incurs operating system overhead—limiting the practical number of active threads—coroutine switching is managed entirely in user space with minimal cost, allowing a single thread to support thousands of concurrent connections. Furthermore, because asynchronous code runs sequentially in a single thread, it avoids the complexities of resource synchronization and data safety that plague multithreaded development.

## Asynchronous I/O

### Basic Usage

Asynchronous I/O is Python's primary concurrency mechanism. To define an asynchronous function (also called a coroutine function), prefix the definition with `async def`. Standard functions without this prefix are called synchronous functions.

Invoking a coroutine function does not immediately run its code; instead, it returns a coroutine object. To execute the coroutine, you must use the `await` keyword or run it within an event loop. The event loop is the core manager of asynchronous applications, continuously monitoring and dispatching tasks in the execution queue.

Python's `asyncio` standard library provides the infrastructure for asynchronous programming, including the event loop, tasks, network streams, synchronization locks, and concurrency utilities.

Below, we start with a very simple example:

```python
import asyncio

async def main():
    print('Hello')
    await asyncio.sleep(1)
    print('World')

asyncio.run(main())
```

In this code, `async def` defines the asynchronous function `main()`. Since calling `main()` returns a coroutine object rather than running it, we pass it to `asyncio.run()`, which boots up the event loop and manages the coroutine's execution lifecycle.

The code also invokes `asyncio.sleep(1)`. Because `sleep()` is itself a coroutine function, we must prefix it with `await` to yield execution during the delay. The program prints 'Hello', pauses for one second while freeing the event loop, and then prints 'World'.

Running a single coroutine is no different from running a synchronous script. The power of `asyncio` is revealed when we run multiple coroutines concurrently using `asyncio.create_task()` or `asyncio.gather()`:

```python
import asyncio

async def foo():
    print('Function A starts')
    await asyncio.sleep(2)
    print('Function A ends')

async def bar():
    print('Function B starts')
    await asyncio.sleep(1)
    print('Function B ends')

async def main():
    task1 = asyncio.create_task(foo())
    task2 = asyncio.create_task(bar())
    
    await task1
    await task2

asyncio.run(main())

# Output:
# Function A starts
# Function B starts
# Function B ends
# Function A ends
```

Here, `foo()` and `bar()` run concurrently. We can write this more concisely using `asyncio.gather()`:

```python
import asyncio

async def foo():
    print('Function A starts')
    await asyncio.sleep(2)
    print('Function A ends')

async def bar():
    print('Function B starts')
    await asyncio.sleep(1)
    print('Function B ends')

async def main():
    await asyncio.gather(
        foo(),
        bar(),
    )

asyncio.run(main())
```

`asyncio.gather()` registers multiple coroutines with the event loop to run concurrently, waiting for all of them to complete before returning.

### How It Works

Synchronous execution relies on a call stack (or runtime stack) to trace execution frames. When a function is invoked, its parameters, local variables, and return address are pushed onto the stack as a stack frame. If that function calls another, a new frame is pushed onto the top of the stack. When a function returns, its frame is popped, and execution resumes from the calling frame. The top of the stack always represents the active execution frame.

When an exception occurs, Python prints this call stack as a traceback. If functions call each other too many times without returning (such as an infinite recursion), the stack overflows, raising a `RecursionError`.

`asyncio` manages concurrency differently. By default, it runs an event loop inside a single thread.

The event loop manages a queue of pending tasks (coroutine objects). It acts as a scheduler: when a running coroutine encounters an `await` statement on an I/O operation (like waiting for a database query), the event loop suspends that task, monitors the underlying file descriptor for activity, and runs other ready tasks in the queue. Once the I/O operation completes, the loop resumes the suspended coroutine. By cooperatively yielding control, a single thread achieves massive concurrency without the overhead of operating system threads.


## Other Asynchronous Operations

### Asynchronous File I/O 

Asynchronous I/O is primarily designed for high-latency network operations. Because local file systems are relatively fast, Python's standard `asyncio` does not provide native asynchronous file I/O tools. 

However, in a high-concurrency web application, even minor blocking file operations can freeze the single-threaded event loop, delaying all other traffic. For these scenarios, you should use third-party libraries like `aiofiles` to handle file I/O asynchronously:

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
    await write_file('sample.txt', 'Welcome to the async world!')
    content = await read_file('sample.txt')
    print(content)

asyncio.run(main())
```

As shown above, the syntax is identical to standard file operations, save for the `async` definitions and `await` markers.


### Asynchronous Context Managers

Asynchronous context managers are similar to [regular context managers](magic_methods#context-management), but they define their entry and exit logic using `async def` methods: `__aenter__` and `__aexit__`. This allows them to be used with the `async with` statement, enabling asynchronous operations during setup and cleanup (such as connecting to or disconnecting from a database):

```python
import asyncio

class AsyncDatabase:
    async def connect(self):
        await asyncio.sleep(1)  # Simulate asynchronous connection
        print("Connected to database")

    async def close(self):
        await asyncio.sleep(1)  # Simulate asynchronous disconnection
        print("Disconnected from database")

    async def __aenter__(self):
        await self.connect()
        return self

    async def __aexit__(self, exc_type, exc, tb):
        await self.close()

async def main():
    async with AsyncDatabase() as db:
        print("Querying database")

asyncio.run(main())

# Output:
# Connected to database
# Querying database
# Disconnected from database
```

### Asynchronous Iterators

Asynchronous [iterators](iterator) yield elements in an asynchronous context. They must implement the `__aiter__` and `__anext__` methods, and are consumed using the `async for` loop. Here is an example of an asynchronous data stream iterator:

```python
class AsyncDataStream:
    def __init__(self, data):
        self.data = data
        self.index = 0

    def __aiter__(self):
        return self

    async def __anext__(self):
        await asyncio.sleep(0.5)  # Simulate asynchronous data retrieval

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

### Asynchronous Generators

[Generators](generator) can also be asynchronous. Below is an asynchronous generator that yields values over time using `await` inside its body:

```python
import asyncio

# Define an asynchronous generator
async def async_generator():
    for i in range(5):
        # Simulate asynchronous operation
        await asyncio.sleep(1)
        yield i

# Use the generator asynchronously
async def main():
    async for item in async_generator():
        print(item)

asyncio.run(main())
```

To consume an asynchronous generator, you must use the `async for` loop.


## Blocking Calls in Asynchronous Code

For cooperative multitasking to work, the event loop must not be blocked. If a task runs a slow, synchronous function, the entire thread halts; no other coroutines can run until that synchronous function returns. In contrast, an asynchronous function yields control during I/O wait periods, allowing other tasks to progress.

Common blocking calls include CPU-heavy computations, synchronous file and network I/O (such as the `requests` library), database drivers, or `time.sleep()`. Wherever possible, replace these with asynchronous alternatives, such as `aiohttp` for HTTP requests and `aiofiles` for file operations.

If you must use a blocking third-party library or perform heavy CPU calculations, you can delegate the execution to a separate thread using `asyncio.to_thread()` to prevent blocking the event loop:

```python
import asyncio

def blocking_task(seconds):
    import time
    time.sleep(seconds)
    return f"Blocked for {seconds} seconds"

async def async_task_1():
    await asyncio.sleep(1)
    print("Async task 1 finished")

async def async_task_2():
    await asyncio.sleep(4)
    print("Async task 2 finished")

async def main():
    # Use asyncio.gather to run all tasks concurrently
    results = await asyncio.gather(
        asyncio.to_thread(blocking_task, 2),
        async_task_1(),
        async_task_2()
    )
    
    # Print the result from blocking_task
    print(results[0])

asyncio.run(main())
```

In this example, `blocking_task` runs standard, synchronous `time.sleep()`. By wrapping it in `asyncio.to_thread()`, we run it in a thread pool, allowing `async_task_1` and `async_task_2` to execute concurrently on the event loop thread.

## Pros and Cons

In my experience working with large-scale web services, asynchronous code is incredibly powerful. For example, in Hack (PHP) projects, almost all network-bound logic is asynchronous by default. Since Python has a broader range of use cases beyond web development, asynchronous operations are typically reserved for project components that deal heavily with I/O.

Years ago, I worked on a Python project that distributed datasets to multiple network endpoints. Because native `asyncio` did not exist at the time, we had to use multithreading. Implementing asynchronous behaviors using older `yield` techniques was complex and error-prone. Today, `async`/`await` provides a much simpler and cleaner solution.

Compared to multithreading, asynchronous I/O is highly lightweight, avoiding OS-level thread context-switching overhead and enabling a single process to scale to thousands of concurrent network connections. Writing asynchronous code in a single thread also eliminates race conditions and deadlocks. 

However, `asyncio` is not a magic bullet:
* **Scope**: It is only beneficial for I/O-bound programs. For CPU-bound tasks, the event loop will still be blocked. Due to Python's Global Interpreter Lock (GIL), neither multithreading nor asyncio can achieve true CPU parallelism; in those cases, you must use [multiprocessing](multiprocess) to distribute work across CPU cores.
* **Complexity**: Integrating asynchronous code into legacy synchronous codebases can be complex, as asynchronous functions require an async caller context (a phenomenon often called 'async color').
