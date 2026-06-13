# Multithreading

## Processes and Threads

Processes and threads are fundamental operating system concepts for task scheduling and concurrent execution. They serve as the building blocks for managing, executing, and scheduling applications.

A **process** is an independently running instance of a program, allocated its own private memory space and system resources. From the operating system's perspective, a process encompasses the executing code and its current runtime state, including the program counter, registers, and virtual memory.

A **thread** is the smallest unit of execution within a process. Multiple threads within a single process share the same address space and system resources (such as open files), but each maintains its own call stack, program counter, and register state. A process can spawn multiple threads, both of which are scheduled by the operating system. In a multi-core or multi-processor environment, threads can run in parallel across different CPU cores.

Simply put, an application consists of at least one process, and a process contains at least one thread.

The simple programs we have written so far have all run within a single process and a single thread. In this section, we will explore how to work with multiple threads.

Multithreading in Python has historically been a point of confusion. While threads can execute in parallel across different CPU cores in many languages, standard Python (CPython) restricts this: Python threads cannot achieve true multi-CPU parallel execution. 

We will explore the technical reasons for this (specifically, the Global Interpreter Lock) below. Fortunately, while multithreading cannot speed up CPU-bound calculations in Python, it can still run I/O operations in parallel (such as querying databases, fetching web pages, or reading files concurrently). Historically, Python developers relied on multithreading to handle concurrent I/O; today, however, [asynchronous I/O](asyncio) offers a much more efficient alternative for these tasks.

Nevertheless, multithreading, as a very important concept in programming languages, is still worth studying in depth.

## threading Module

Python's `threading` standard library module is the primary tool for creating and managing threads.

### Creating Threads

You can instantiate a new thread using the `threading.Thread` class, passing the function you want to execute to the `target` parameter of the constructor. Calling `start()` on the `Thread` object begins execution in a separate thread. If the main program needs to block and wait for a thread to complete its execution before continuing, call `join()` on the thread instance:

```python
import threading

def print_numbers():
    for i in range(5):
        print(i)

# 创建线程
thread = threading.Thread(target=print_numbers)

# 启动线程
thread.start()

# 等待线程结束
thread.join()
```

### Thread Naming and Identification

You can assign a custom name to a thread using the `name` parameter during instantiation, and retrieve it using the thread's `name` property. Each thread is also assigned a unique integer identifier by the operating system, which can be accessed using `threading.get_ident()` within the thread, or via the `ident` attribute of the thread object.

```python
import threading
import time

def worker():
    # 获取当前线程的名称
    current_thread_name = threading.current_thread().name
    # 获取当前线程的标识
    thread_ident = threading.get_ident()
    
    print(f"{current_thread_name} (ID: {thread_ident}) 开始")
    time.sleep(2)
    print(f"{current_thread_name} (ID: {thread_ident}) 结束")

# 创建两个线程，并给它们命名
thread1 = threading.Thread(target=worker, name="线程1")
thread2 = threading.Thread(target=worker, name="线程2")

thread1.start()
thread2.start()

thread1.join()
thread2.join()

# 输出类似：
# 线程1 (ID: 140173712739104) 开始
# 线程2 (ID: 140173711678240) 开始
# 线程1 (ID: 140173712739104) 结束
# 线程2 (ID: 140173711678240) 结束
```

Naming and identifying threads improves readability, simplifies thread management, and makes debugging concurrency issues much easier.

### Thread-Local Data

Thread-local data allows each thread to maintain its own isolated state that is inaccessible to other threads. This is implemented using `threading.local()`, which is useful for managing thread-specific contexts like database connections or HTTP request sessions.

The following is a simple example of using thread-local data:

```python
import threading

# 创建线程局部 data
local_data = threading.local()

def display_data():
    try:
        value = local_data.value
    except AttributeError:
        print("没有数据")
    else:
        print(f"数据是 {value}")

def worker(number):
    # 每个线程根据输入参数设置一个线程局部变量
    local_data.value = number
    display_data()

# 创建两个线程
thread1 = threading.Thread(target=worker, args=(1,))
thread2 = threading.Thread(target=worker, args=(2,))

thread1.start()
thread2.start()

thread1.join()
thread2.join()

# 在主线程中显示线程局部 data
display_data()

# 输出：
# 数据是 1
# 数据是 2
# 没有数据
```

Here, `display_data` reads `local_data.value`. In the `worker` function, each thread assigns its own thread-specific value to `local_data.value`. Although both threads reference the same `local_data` object, their values remain isolated.

Because the main thread never assigned a value to `local_data.value`, attempting to access it from the main thread raises an `AttributeError`.

### Daemon Threads

A **daemon thread** runs in the background. Unlike regular (non-daemon) threads, which keep the Python process alive until they finish, daemon threads do not prevent the main program from exiting. When all non-daemon threads have finished executing, the Python program terminates, automatically killing any active daemon threads.

Daemon threads are ideal for background utility tasks like log collection, system monitoring, or cache cleanup. By default, any thread created inside a daemon thread inherits the daemon status of its parent.

You can configure a thread as a daemon by passing `daemon=True` to the constructor or by modifying its `daemon` property before calling `start()`.

```python
import threading
import time

# 定义守护线程执行的函数
def daemon_thread():
    while True:
        print("守护线程正在运行...")
        time.sleep(1)

# 创建守护线程
# 推荐方式 1：在创建时指定
d_thread = threading.Thread(target=daemon_thread, daemon=True)

# 推荐方式 2：设置属性
# d_thread = threading.Thread(target=daemon_thread)
# d_thread.daemon = True

d_thread.start()

# 主程序执行一些任务
for i in range(5):
    print("主程序正在运行...")
    time.sleep(2)

# 主程序结束后，守护线程也将随之结束
print("主程序结束，守护线程也随之结束。")
```

In this code, the daemon thread runs an infinite loop. Once the main thread finishes printing and exits, the daemon thread is immediately terminated by Python.

### Creating Threads with Classes

Alternatively, you can define threads by subclassing `threading.Thread` and overriding the `run()` method to encapsulate the thread's execution logic:

```python
import threading
import time

# 定义一个继承自 threading.Thread 的类
class MyThread(threading.Thread):
    def __init__(self, name, delay):
        super().__init__()
        self.name = name
        self.delay = delay

    def run(self):
        print(f"线程 {self.name} 开始运行")
        for i in range(5):
            time.sleep(self.delay)
            print(f"线程 {self.name} 正在运行，执行 {i + 1} 次")
        print(f"线程 {self.name} 结束运行")

# 创建线程实例
thread1 = MyThread("Thread-1", 1)
thread2 = MyThread("Thread-2", 1.5)

# 启动线程
thread1.start()
thread2.start()

# 等待所有线程完成
thread1.join()
thread2.join()

print("主程序结束")
```

This object-oriented approach encapsulates the thread's arguments and state inside a custom class. The `run()` method acts as the entry point, executing when `start()` is invoked. Subclassing `Thread` makes thread management more modular and reusable in complex projects.

## Synchronization Mechanisms

Synchronization primitives are tools used to coordinate thread execution and control access to shared state. The `threading` module provides several primitives to guarantee thread safety and prevent race conditions.

### Mutex Lock

A **mutex lock** (mutual exclusion lock) is the most basic synchronization primitive. It ensures that only one thread can execute a critical section of code or access a shared resource at a time, preventing data corruption caused by concurrent writes.

Let's look at the following program:

```python
import threading

# 共享资源
shared_resource = 0

# 一个简单的线程函数，增加共享资源的值
def increase_resource():
    global shared_resource

    for _ in range(100000):  # 大量操作以突出效果
        shared_resource += 1

# 创建线程
thread1 = threading.Thread(target=increase_resource)
thread2 = threading.Thread(target=increase_resource)

# 启动线程
thread1.start()
thread2.start()

# 等待线程完成
thread1.join()
thread2.join()

print(f"最终共享资源的值: {shared_resource}")
```

In this code, two threads concurrently increment a global counter 100,000 times. You would expect the final count to be exactly 200,000, but running this script yields a non-deterministic total (typically around 170,000).

This error is caused by a race condition. The increment operation (`shared_resource += 1`) is not atomic; under the hood, Python reads the value, adds one, and writes it back. If both threads read the value simultaneously (e.g., both read `3`), both compute `4`, and both write `4` back, one increment is lost.

To resolve this, we use a lock to ensure that the read-modify-write cycle is executed atomically by only one thread at a time:

```python
import threading

# 共享资源
shared_resource = 0
# 创建一个锁对象
lock = threading.Lock()

# 一个简单的线程函数，增加共享资源的值
def increase_resource():
    global shared_resource

    for _ in range(100000):  # 大量操作以突出效果
        lock.acquire()  # 请求锁
        try:
            shared_resource += 1
        finally:
            lock.release()  # 释放锁

# 创建线程
thread1 = threading.Thread(target=increase_resource)
thread2 = threading.Thread(target=increase_resource)

# 启动线程
thread1.start()
thread2.start()

# 等待线程完成
thread1.join()
thread2.join()

print(f"最终共享资源的值: {shared_resource}")
```

Placing the operations that need protection inside a `with lock:` block ensures that this code will not be executed simultaneously by different threads. If the program logic is complex and cannot use the with statement, you can also use the lock.acquire() function to request a lock and the lock.release() function to release it. Running the above program gives a deterministic result of 200,000.

Using a mutex lock ensures that only one thread can access and modify a shared resource at a time, thus preventing data inconsistency issues. In practical applications, care should be taken to avoid deadlocks and ensure that locks are released under all circumstances.

### Reentrant Lock

A **reentrant lock** (`RLock`) is a mutex that can be acquired multiple times by the same thread without causing a deadlock. This is useful for recursive algorithms or nested methods where the same thread needs to repeatedly enter locked sections:

```python
import threading
import time

# 创建一个可重入锁
reentrant_lock = threading.RLock()

# 一个递归函数，它会重复获取同一个锁
def recursive_function(count):
    if count > 0:
        with reentrant_lock:
            print(f"线程 {threading.current_thread().name} 获取了锁，计数为 {count}")
            time.sleep(0.1)
            recursive_function(count - 1)

# 线程函数
def thread_function():
    with reentrant_lock:
        recursive_function(3)

# 创建并启动线程
thread1 = threading.Thread(target=thread_function, name="Thread-1")
thread2 = threading.Thread(target=thread_function, name="Thread-2")

thread1.start()
thread2.start()

thread1.join()
thread2.join()

print("主程序结束")
```

If we used a standard `Lock` here, the program would immediately deadlock on the second recursive call because the thread would block waiting for itself to release the lock. An `RLock` resolves this by keeping track of the recursion depth and owner thread.

### Semaphore

A **semaphore** maintains an internal counter to limit concurrent access to a shared resource. Semaphores are commonly used to rate-limit access to high-load systems, such as database connection pools or API rate-limiters:

```python
import threading
import time
import random

# 创建一个信号量，最多允许两个线程同时访问共享资源
semaphore = threading.Semaphore(2)

def access_resource(thread_number):
    print(f"线程 {thread_number} 正在请求访问资源")
    # 请求信号量
    semaphore.acquire()
    print(f"线程 {thread_number} 获得了访问权限")
    # 模拟资源访问
    time.sleep(random.uniform(0.1, 1.0))
    print(f"线程 {thread_number} 完成了访问")
    # 释放信号量
    semaphore.release()

# 创建并启动线程
threads = []
for i in range(5):
    thread = threading.Thread(target=access_resource, args=(i,))
    threads.append(thread)
    thread.start()

# 等待所有线程完成
for thread in threads:
    thread.join()

print("所有线程访问完毕")
```

By initializing `Semaphore(2)`, we restrict access to a maximum of two concurrent threads. Any additional threads that attempt to call `acquire()` will block until one of the active threads releases the semaphore.

### Condition Variable

A **condition variable** (`Condition`) allows threads to synchronize based on state changes. One or more threads can wait (`wait()`) until a specific condition is met, while another thread updates the state and notifies (`notify()`) the waiting threads:

```python
import threading
import time
import random

# 商品列表
items = []
# 创建条件变量
condition = threading.Condition()

# 生产者类
class Producer(threading.Thread):
    def run(self):
        global items
        for i in range(5):
            time.sleep(random.uniform(0.1, 1.0))  # 模拟生产时间
            item = f'商品{i}'
            with condition:
                items.append(item)
                print(f'{self.name} 生产了 {item}')
                condition.notify()  # 通知消费者

# 消费者类
class Consumer(threading.Thread):
    def run(self):
        global items
        while True:
            with condition:
                # 使用 while 循环检查条件，防止虚假唤醒或资源被抢占
                while not items:  
                    print(f'{self.name} 等待商品...')
                    condition.wait()  # 等待商品
                
                item = items.pop(0)
                print(f'{self.name} 消费了 {item}')
            time.sleep(random.uniform(0.1, 1.0))  # 模拟消费时间

# 创建并启动生产者和消费者线程
producer = Producer(name='生产者')
consumer = Consumer(name='消费者')

producer.start()
consumer.start()

producer.join()
consumer.join()
```

The consumer thread calls `condition.wait()`, which atomically releases the lock and blocks the thread. When the producer appends an item and calls `condition.notify()`, the event loop wakes up the consumer. The consumer then re-acquires the lock and safely processes the data.

### Event

An **event** (`Event`) is a simple communication mechanism where one thread signals a state change and other threads wait for that signal. An event object manages an internal boolean flag:
* `set()`: Sets the flag to `True`, waking up all waiting threads.
* `clear()`: Resets the flag to `False`.
* `wait()`: Blocks the calling thread until the flag becomes `True`.

```python
import threading
import time

# 创建一个事件对象
event = threading.Event()

# 等待事件的线程
def waiter(event):
    print("等待者线程: 正在等待事件")
    event.wait()
    print("等待者线程: 事件已发生，继续执行")

# 触发事件的线程
def trigger(event):
    print("触发者线程: 正在处理一些事情")
    time.sleep(2)  # 模拟一些工作
    print("触发者线程: 工作完成，触发事件")
    event.set()

# 创建并启动线程
waiter_thread = threading.Thread(target=waiter, args=(event,))
trigger_thread = threading.Thread(target=trigger, args=(event,))

waiter_thread.start()
trigger_thread.start()

waiter_thread.join()
trigger_thread.join()

print("主程序结束")
```

Here, `waiter_thread` blocks at `event.wait()`. Once `trigger_thread` completes its work and calls `event.set()`, the flag becomes true, allowing the waiter thread to resume instantly.

## Deadlock

A **deadlock** occurs when two or more threads are permanently blocked, each waiting for a lock held by another thread in the group.

Below is a simple example of a deadlock:

```python
import threading

# 创建两把锁
lock1 = threading.Lock()
lock2 = threading.Lock()

def worker1():
    with lock1:
        print("线程 1 获得锁 1")
        with lock2:
            print("线程 1 获得锁 2")

def worker2():
    with lock2:
        print("线程 2 获得锁 2")
        with lock1:
            print("线程 2 获得锁 1")

# 创建并启动线程
t1 = threading.Thread(target=worker1)
t2 = threading.Thread(target=worker2)

t1.start()
t2.start()

t1.join()
t2.join()

print("Finished")
```

If `t1` locks `lock1` and `t2` locks `lock2` concurrently, both will block indefinitely when attempting to acquire their second locks, freezing the application.

To prevent deadlocks, always acquire locks in a consistent, global order. If both threads are forced to acquire `lock1` before `lock2`, circular wait conditions cannot occur:

```python
def worker1():
    with lock1:
        print("线程 1 获得锁 1")
        with lock2:
            print("线程 1 获得锁 2")

def worker2():
    with lock1:  # 修改这里
        print("线程 2 获得锁 1")
        with lock2:
            print("线程 2 获得锁 2")
```

You can also prevent deadlocks by setting timeouts on lock acquisitions (e.g., `lock.acquire(timeout=2.0)`). If a thread fails to acquire a lock within the timeout, it can back off, release any locks it currently holds, and retry later.

## Global Interpreter Lock

When the input is a very large integer, this function takes a relatively long time to run. For example, the following loop performs prime factorization on 10,000 numbers:

```python
def prime_factors(n):
    """Return a list of the prime factors for a natural number."""
    factors = []

    for i in range(2, int(n**0.5) + 1):
        while n % i == 0:
            factors.append(i)
            n //= i
            
    if n > 2:
        factors.append(n)
    
    return factors

# 测试
num = 48758440894340
print(prime_factors(num))  # 输出： [2, 2, 5, 17, 143407179101]
```

On my machine, this single-threaded execution took 20.3 seconds. Since my system has multiple CPU cores, distributing this computational work across multiple threads should speed things up dramatically, right? Let's write a multithreaded version:

```python
import time
import threading

def prime_factors(n):
    """Return a list of the prime factors for a natural number."""
    factors = []

    for i in range(2, int(n**0.5) + 1):
        while n % i == 0:
            factors.append(i)
            n //= i

    if n > 2:
        factors.append(n)

    return factors

def threaded_prime_factors(start, end):
    for i in range(start, end):
        prime_factors(i)

def main():
    start_time = time.time()

    num_threads = 72
    numbers = range(1000000000, 1000010000)
    step = len(numbers) // num_threads
    threads = []

    for i in range(num_threads):
        # 根据线程数分割数字范围
        start = numbers[i * step]
        if i == num_threads - 1:
            end = numbers.stop
        else:
            end = numbers[(i + 1) * step]
        # 创建并启动线程
        t = threading.Thread(target=threaded_prime_factors, args=(start, end))
        threads.append(t)
        t.start()

    # 等待所有线程完成
    for t in threads:
        t.join()

    end_time = time.time()
    print(f"程序运行时间: {end_time - start_time:.6f} 秒")

if __name__ == "__main__":
    main()
```

Running the multithreaded version took 19.9 seconds. Despite spawning 72 threads, there is virtually no performance improvement.

This limitation is due to Python's **Global Interpreter Lock (GIL)**. In CPython (the standard Python implementation), the interpreter is not thread-safe. To protect the integrity of internal objects, the GIL ensures that **only one thread can execute Python bytecode at a time**.

Because of the GIL, multithreading cannot speed up CPU-bound calculations in Python. It remains useful for concurrent I/O operations (where threads release the GIL while waiting for network packets or disk data). However, for I/O concurrency, `asyncio` is generally preferred over raw threads today.

To utilize multiple CPU cores for parallel calculations in Python, you must bypass the GIL by using [multiprocessing](multiprocess).
