# Asyncio and Concurrency

## Related Concepts

### Parallelism and Concurrency

These two concepts are often discussed together; they are similar, but not the same.

- **Parallelism:** Parallelism refers to multiple tasks executing simultaneously at the same instant. In multi-core or multi-processor systems, multiple tasks can truly execute at the same time.
- **Concurrency:** Concurrency emphasizes task management, where multiple tasks execute in an interleaved manner. From a macro perspective, these tasks appear to be happening simultaneously, but at the micro level, they may be taking turns using CPU resources. Concurrency focuses on the temporal relationship of task initiation, execution, and completion, rather than real-time execution.

### Coroutines

When a function (caller) calls another function (subroutine), the program's execution flow transfers to the beginning of the subroutine and continues executing until it reaches the subroutine's end point. Upon completion, control returns to the caller, and execution continues from the statement immediately following the subroutine call.

Coroutines are an alternative calling model to subroutine calls, providing a more flexible code execution model. In the coroutine model, a function can pause during execution and resume at a later point. This ability to "yield" control allows coroutines to interact with other code or coroutines while maintaining their own state.

Coroutines can suspend their execution at any point during execution and return control to the caller. The caller can resume the coroutine at an appropriate time, and the coroutine will continue from where it was last suspended. Coroutines are well-suited for multitasking and asynchronous operations because they can yield control while waiting for other operations to complete, allowing the program to handle other tasks. Early coroutines were implemented using [Generators](generator#接收数据), but now this mechanism has been replaced by the async/await mechanism.

### Implementing Concurrency

Concurrency can be implemented in various ways, including: [multithreading](multithread), [multiprocessing](multiprocess), and coroutines. Compared to multithreading or multiprocessing, coroutines can achieve high concurrency more lightly and efficiently, especially for I/O-intensive tasks. Before Python had convenient support for coroutines, many concurrent tasks were implemented using multithreading. However, switching between different threads incurs additional overhead, so the number of threads should not be too high. Coroutines, on the other hand, have almost no additional overhead when switching between different tasks, making them more efficient and capable of supporting a larger number of concurrent operations. Using coroutines eliminates the need to consider synchronization, data safety, and other issues that must be addressed in multithreaded programming, resulting in higher development efficiency.

## Asynchronous I/O

### Basic Usage

Asynchronous I/O is currently the main way to implement coroutines in Python. To implement asynchronous I/O, you need to use async def when defining a function. Such functions are called asynchronous functions, or coroutine functions; correspondingly, functions without async are called synchronous functions. Coroutine functions do not return regular values but instead return a coroutine object. To run a coroutine object, you need to use the await keyword or submit it to the event loop. The event loop is a core concept in asynchronous programming. The event loop continuously checks and executes tasks in the queue.

Methods and operations related to asynchronous I/O in Python are in the asyncio standard library, which provides tools for creating and managing coroutines. In addition to supporting the async/await syntax, asyncio also provides the event loop, tasks, asynchronous streams, asynchronous locks, and other features necessary for building asynchronous applications.

Below, we start with a very simple example:

```python
import asyncio

async def main():
    print('Hello')
    await asyncio.sleep(1)
    print('World')

asyncio.run(main())
```

In the code above, we defined an asynchronous function main() using async def. When calling an asynchronous function, it returns a coroutine object rather than immediately executing the code inside. Therefore, we use asyncio.run() to execute it. asyncio.run() starts the event loop and then runs all asynchronous functions.

The program also calls an asyncio.sleep(1) function, which waits for 1 second. Since it is also an asynchronous function, calling it requires await. The program above first prints "Hello", then waits for 1 second, and finally prints "World".

The program above has only one asynchronous function, so running it is no different from running a regular synchronous function. However, we can use asyncio.create_task() or asyncio.gather() to run multiple asynchronous functions concurrently, and that's where the difference becomes apparent:

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

In the program above, the tasks task1 and task2 created for the two asynchronous functions foo() and bar() respectively run concurrently. The above program can also be written as:

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

The asyncio.gather() function is used to run multiple asynchronous tasks concurrently. It waits for all given asynchronous tasks to complete before returning.

### How It Works

When executing synchronous functions, the system maintains a call stack. The call stack, also known as the execution stack or runtime stack, is used to track function calls during program execution. When a function is called, the computer places relevant information (such as the function's return address, parameters, local variables, etc.) onto the call stack. This information is typically organized as a stack frame. During the execution of a function, more function calls can be made. Each call adds a new stack frame to the top of the call stack. When a function completes its work and is ready to return, its stack frame is popped from the call stack. Control flow returns to where the current function call was made, continuing with the subsequent code. The top of the call stack always holds information about the currently executing function. When this function calls another function, the new function's information is pushed onto the top of the stack.

When a program throws an exception, we typically inspect the call stack to trace the location and cause of the error. If there are too many levels of function calls, the call stack may become too deep, potentially causing a stack overflow error. Poorly designed recursive functions are particularly prone to this type of stack overflow error.

In programs using asyncio, an event loop is started to manage asynchronous operations within the program. By default, asyncio's event loop runs in a single thread.

The event loop maintains a list of pending tasks. These tasks are typically coroutine objects that are scheduled and executed within the event loop. The event loop is responsible for listening to and responding to I/O events (such as network requests or file reads/writes) and other types of events, triggering corresponding callback functions or tasks based on the events. When the event loop runs, it continuously checks whether there are tasks that need to be executed or whether events have triggered callback functions. If a task (for example, a coroutine) needs to wait for an asynchronous operation to complete (such as waiting for data to be read from the network), the event loop suspends the task and wakes it up again when the operation completes. Although the event loop itself is typically single-threaded, it achieves concurrency through coroutines and asynchronous I/O operations. This means the program can handle multiple operations simultaneously, even though only one event loop is running in the background.


## Other Asynchronous Operations

### Asynchronous File I/O 

The primary use of asyncio is for handling network-related operations, such as web page access, database queries, etc. Compared to local data reads and writes, network communication is generally very slow. The asyncio library does not include native support for asynchronous file I/O. This is because in many desktop applications or scripts, file operations are fast enough. However, in high-concurrency web servers, even a brief file read/write blockage can stall the entire event loop, preventing it from responding to other requests. Therefore, when dealing with a large number of concurrent requests involving file reads and writes, using third-party libraries (such as aiofiles) is very necessary. For example:

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

As can be seen from the code above, the logic of asynchronous file reading and writing is almost identical to synchronous file reading and writing, except that all asynchronous function definitions need to add async, and all asynchronous function calls need to add await.


### Asynchronous Context Manager

Asynchronous context managers are similar to [regular context managers](magic_methods#上下文管理), but they use async def to define their entry and exit methods: `__aenter__` and `__aexit__`. This allows us to use them in async with statements and perform asynchronous operations within their context. For example, suppose we have a simulated asynchronous database connection:

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

### Asynchronous Iterator

Asynchronous [iterators](iterator) can iterate over elements in an asynchronous environment. They need to define the `__aiter__` and `__anext__` methods and can be used in async for loops. For example, a simulated asynchronous data stream iterator:

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

### Asynchronous Generator

[Generators](generator) can also be asynchronous. Below is an example of an asynchronous generator that yields a number every second:

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

Because the generator is asynchronous, when using a for loop to iterate over it, you need to use the asynchronous for loop `async for`.


## Blocking Calls in Asynchronous Code

When programming with asynchronous I/O, all functions must be asynchronous to achieve concurrency. However, if some functions are not asynchronous and are particularly time-consuming, the program will be blocked there. While executing this non-async function, the program cannot perform other operations and must wait until the function completes before continuing. In contrast, if the function is asynchronous, when one task is waiting for a read/write result, the program will switch to other asynchronous tasks.

Long-running computations, synchronous I/O operations such as synchronous file reads/writes, network requests, database queries, etc., or functions using time.sleep() instead of asyncio.sleep(), can all lead to blocking calls. If possible, these synchronous functions should be replaced with their corresponding asynchronous counterparts. For example, use aiohttp instead of requests for HTTP requests; aiofiles instead of synchronous file reads/writes, etc.

For blocking calls that cannot be made asynchronous, consider running them in a separate thread or process. For example, you can use asyncio.to_thread() to run blocking code in a separate thread:

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

In the demonstration program above, async_task_1 and async_task_2 are two asynchronous functions, but blocking_task is not an asynchronous function. If blocking_task were run directly, the program would be blocked here. Therefore, we use asyncio.to_thread() to run it in a separate thread, so it won't block other operations. Due to the concurrent nature of asynchronous execution, the output order may vary, but typically async_task_1 should finish first because it has the shortest internal delay, followed by blocking_task, and finally async_task_2.

## Pros and Cons

In the PHP (Hack) projects the author participated in, almost all functions were asynchronous. This is mainly because the PHP language is mostly used for developing web services, and almost all functions are related to network requests. Python has a wider range of applications, and asynchronous functions are less common in projects with fewer I/O operations.

The author participated in a Python project many years ago, whose main function was to distribute data from a host machine to several external devices over the network for processing, and then return the results. At that time, Python did not support asynchronous I/O, so multithreading had to be used to parallelize data distribution. (Although yield could be used to implement asynchronous functionality, it was quite cumbersome.) Looking back now, asynchronous I/O operations are still simpler and more efficient.

Compared to multithreading, asynchronous I/O is typically more lightweight because it avoids the overhead of thread context switching, allowing asynchronous I/O to handle a larger number of concurrent tasks simultaneously. Asynchronous I/O is generally easier to scale, especially when facing a large number of concurrent connections. Since the code executes in a single thread, it avoids many of the complexities of multithreaded programming, such as race conditions, deadlocks, etc. The downside is that asynchronous I/O appeared later than multithreading, and many applications have already been built on multithreading, so applying asynchronous I/O might be more complex. Additionally, asynchronous I/O is only suitable for programs with frequent I/O operations. If the program's bottleneck is CPU computation (compute-intensive), due to the existence of Python's Global Interpreter Lock (GIL), multithreading cannot leverage the advantages of multi-core CPUs either, and in this case, multiprocessing must be relied upon to achieve parallel computation.
