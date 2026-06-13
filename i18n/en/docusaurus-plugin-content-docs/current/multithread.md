# Multithreading

## Processes and Threads

Processes and threads are core concepts in operating systems regarding task scheduling and concurrent execution. They are the fundamental building blocks that operating systems use to manage, execute, and schedule applications.

A process is an independently running program instance with its own separate memory space and system resources. From the operating system's perspective, a process is a combination of an executing program and its state, including the program counter, registers, virtual memory, and so on. A thread is a single execution flow within a process. Threads within a process share the same address space and resources, but each has its own call stack, program counter, and register state. A process can have multiple threads. Both processes and threads are scheduled by the operating system. Each process has its own independent address space, but threads do not. In multi-core or multi-processor systems, multiple threads can execute in parallel on different CPU cores.

Simply put: an application has at least one process, and a process has at least one thread.

The simple programs we wrote previously all had only one process and one thread. Next, we will discuss how to start multiple threads and processes.

Multithreading in Python is somewhat awkward. Earlier it was mentioned: "In multi-core or multi-processor systems, multiple threads can execute in parallel on different CPU cores." This is true in general. But Python programs cannot do this: Python programs cannot achieve multi-CPU parallel execution even with multithreading. We will discuss the specific reasons below. Although we cannot make multiple CPUs work in parallel, fortunately multithreading can still allow different peripheral read/write operations to run in parallel, such as accessing multiple files, databases, web pages, etc. at the same time. So in the past, Python's multithreading was mainly used to support concurrent I/O. But now, Python has [asynchronous I/O](asyncio), and multithreading no longer has even this advantage.

Nevertheless, multithreading, as a very important concept in programming languages, is still worth studying in depth.

## threading Module

Python provides multiple ways to create and manage multithreading, among which the most common and direct method is to use the threading module from the standard library.

### Creating Threads

Using the threading.Thread class allows you to create a new thread. The most common method is to provide a function as the target parameter of the Thread class constructor. When the thread starts, this function or method will be called. Using the start() method of the Thread object starts the thread, and the thread begins executing the function pointed to by target. If you need to wait for a thread to complete its task before continuing with subsequent program execution, you can use the join() method of the Thread object to wait for the thread to finish:

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

We can name a thread using the name parameter when creating it, and then use the threading.name attribute to get a thread's name. Each thread also has a unique identifier, which can be obtained using threading.get_ident().

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

Naming and identifying threads not only improves code readability and maintainability, but also makes it easier to manage and control threads. If problems arise, recording the thread names and identifiers can also help us debug and find issues.

### Thread-Local Data

Each thread can have its own data instance, independent of other threads. This is achieved through threading.local(). Thread-local data is useful in certain applications, such as database connections, request contexts, etc.

The following is a simple example of using thread-local data:

```python
import threading

# 创建线程局部数据
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

# 在主线程中显示线程局部数据
display_data()

# 输出：
# 数据是 1
# 数据是 2
# 没有数据
```

In the above code, we first defined a function called display_data, which is used to display the local data of the current thread. Then, we have a worker function, which is the function run by multiple threads. The worker function has input parameters. When creating a thread, parameters can be passed to the worker function via the args parameter of the threading.Thread function. Each thread in the program sets the thread-local data local_data.value in the worker function. Although all threads use the same name "value" to access their thread-local data, each thread has its own independent data instance, and each thread maintains its own different value.

The main thread did not set local_data.value. If we try to access it in the main thread, the program will throw an AttributeError exception.

### Daemon Threads

A daemon thread is a thread that runs in the background and does not interact directly with the user. When the main program ends, all daemon threads are automatically terminated, regardless of whether they are still working. This is in contrast to "regular" threads or "user" threads, which continue to execute after the main program ends until the thread itself finishes.

Daemon threads are typically used to perform background tasks such as garbage collection, log management, monitoring, automatic archiving, etc. Other threads cannot use the join() function to wait for a daemon thread to finish, because daemon threads are generally not supposed to end on their own, but should be automatically shut down when the main program ends. If a new thread is created within a daemon thread, the new thread is called a "child thread" and it will inherit the daemon status of its parent thread by default.

We can make a thread a daemon thread by setting the daemon attribute of the thread object.

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

In the above example, the daemon_thread function is set to run in a daemon thread. It itself is an infinite loop that keeps printing some information. When the main program ends, the daemon thread will also be automatically terminated.

### Creating Threads with Classes

Besides using functions as thread targets, you can also create threads by inheriting the threading.Thread class and overriding its run method.

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

The above program defines a MyThread class that inherits from threading.Thread. The __init__ method is used to initialize the thread, and can accept thread name and delay parameters. The run method is used to define the specific behavior of the thread: printing information about the current thread. The program creates two instances of the MyThread class, thread1 and thread2, and passes different parameters to them. The methods for starting threads and waiting for threads to finish are the same as before.

Using classes to create threads makes the code more modular and reusable, and also makes it easier to manage the state and behavior of threads.

## Synchronization Mechanisms

Synchronization primitives are a set of tools used to coordinate access by multiple threads to shared resources. Python's threading module provides various synchronization mechanisms to achieve thread safety and avoid potential race conditions.

### Mutex Lock

A mutex is one of the most basic synchronization mechanisms, also known as a lock or resource lock. It is mainly used to ensure that only one thread can access a resource or code segment at any given time, preventing multiple threads from simultaneously accessing shared resources, thereby avoiding race conditions or data inconsistency issues. We can use the Lock class from the threading module to implement thread mutex locks.

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

The above program defines a shared resource called shared_resource with an initial value of 0. It creates two threads, each doing the same thing: looping 100,000 times, incrementing the value of shared_resource by 1 in each iteration. With two threads, the total should be 200,000 iterations, so the final result should be 200,000. But in reality, when running the above program, the result is non-deterministic, and is likely to be around 170,000.

This error occurs because two threads are running simultaneously and shared_resource is not protected, so the following scenario is likely to happen: thread a reads the value of shared_resource, say it's 3; then thread b reads the value, also 3; then thread a writes back the new value 4; finally, thread b also writes back the new value 4. The program added to shared_resource twice, but the final result only increased by 1.

To avoid such errors, we need to lock shared_resource before reading it, preventing other threads from using it until we have modified its data and then release the lock, allowing other threads to access it. This way, there will be no data conflicts:

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

A reentrant lock (RLock) is a special type of mutex that allows the same thread to request the same lock multiple times. This means that if the same thread has already acquired this lock, it can acquire it again without causing a deadlock. It is typically used in recursive functions.

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

The above program defines a reentrant lock called reentrant_lock. recursive_function is a recursive function that attempts to acquire the same lock on each recursive call. Since the recursive_function function will try to acquire the same lock multiple times when called by the same thread, it must use a reentrant lock. If a regular mutex lock were used, the program would deadlock because a lock cannot be acquired multiple times by the same thread. The reentrant lock solves this problem, allowing the same thread to safely acquire the same lock multiple times.

### Semaphore

A semaphore is a more advanced synchronization mechanism used to control access to shared resources. It maintains an internal counter that can limit the number of accesses to a resource, for example, limiting the number of concurrent database connections. Threads can obtain or release resources by incrementing or decrementing the counter.

The following is an example using a semaphore, simulating concurrent access to a limited resource (such as database connections):

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

In this example, we created a semaphore that allows at most two threads to access the shared resource simultaneously. The access_resource function simulates the process of a thread requesting access to a shared resource. The thread first requests the semaphore; if it acquires the semaphore, it accesses the resource; after accessing, it releases the semaphore. The program creates five threads to simulate concurrent access to a shared resource. Each thread, upon starting, tries to acquire the semaphore. Since the semaphore size is 2, at most two threads can access the resource at the same time.

Using semaphores is an effective way to control concurrent access to a limited number of resources, preventing resource overload and ensuring system stability.

### Condition Variable

A condition variable is a synchronization mechanism used for coordination between threads. Condition variables allow one or more threads to suspend execution until certain conditions are met, and allow another thread to wake up one or all waiting threads when the conditions are satisfied.

The following is an example using a condition variable, simulating the producer-consumer problem:

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

In this example, we defined a shared items list called items and a condition variable called condition. The Producer class represents the producer, which produces items and adds them to the items list, then notifies the consumer via condition.notify(). The Consumer class represents the consumer, which waits for items to be available (via condition.wait()) and then consumes items from the items list. The program creates one producer thread and one consumer thread, executing the producer and consumer logic respectively. The producer notifies the consumer after producing items, while the consumer waits when there are no items to consume. This approach effectively coordinates the behavior between the producer and consumer, preventing resource conflicts and unnecessary busy waiting.

### Event

An Event is a simple synchronization mechanism used to send signals between threads. An event object manages an internal flag, which can be set to true via the set() method, set to false via the clear() method, and waited on to become true via the wait() method.

The following is a multithreading example using an Event, where one thread waits for an event to be triggered by another thread:

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

In this example, we created an event object called event. We use event.wait() to suspend a thread until the event is triggered. The trigger function represents the thread that triggers the event. It simulates some processing, then uses event.set() to trigger the event. The program creates and starts threads representing the waiter and the trigger respectively. The waiter thread pauses execution until the event is triggered, while the trigger thread triggers the event after completing some work, thereby allowing the waiter thread to continue execution. This approach is very useful when coordinated operations between threads are needed.

## Deadlock

A common problem encountered in multithreaded programs is deadlock: two or more threads are unable to proceed because each thread is waiting for other threads to release the resources it needs. This causes all threads to be stuck in a state of mutual waiting, unable to continue execution.

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

In the above code, two worker threads attempt to acquire two locks in different orders. If worker1 acquires lock1 while worker2 acquires lock2, then each worker thread will wait for the other to release the lock it needs, resulting in a deadlock.

There are some common methods to avoid deadlocks. For example, you can fix the lock acquisition order: ensure that all threads always request locks in the same order. This eliminates circular waiting, thereby avoiding deadlocks. Modify the above code to ensure that both worker threads first try to acquire lock1, then lock2:

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

In addition to using a fixed locking order, you can also set a timeout for trying to acquire a lock. This way, if a thread does not obtain the lock within the timeout period, it can give up, back off, try again later, or take other remedial measures. Additionally, specific algorithms or tools can be used to detect deadlocks, and then actions can be taken to break them. This approach may be more effective in more complex systems.

## Global Interpreter Lock

Let's first write a function for computing prime factorization:

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
print(prime_factors(num))  输出： [2, 2, 5, 17, 143407179101]
```

When the input is a very large integer, this program takes a relatively long time to run. For example, the following program performs prime factorization on 10,000 numbers:

```python
import time

start_time = time.time()  # 记录开始时间
for i in range(1000000000, 1000010000):
    prime_factors(i)
end_time = time.time()  # 记录结束时间
print(f"程序运行时间: {end_time - start_time:.6f} 秒")
```

On the author's computer, it took a total of 20.3 seconds. This is very slow, but the author's computer has 72 CPU cores, so if the task is evenly distributed among 72 cores and run simultaneously, it should be much faster, right? Let's rewrite the above program as a multithreaded program:

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

Running it again, it took 19.9 seconds. Ignoring the margin of error, this multithreaded program's runtime seems no different from the single-threaded one.

The reason for the lack of performance improvement is the existence of Python's Global Interpreter Lock (GIL). Python is an interpreted language: the interpreter translates the code we write into "bytecode" while also executing the translated bytecode. In multithreading, when a thread wants to execute Python bytecode, it must first acquire the GIL. This is for data safety considerations, but the result is that even if the program is multithreaded, only one thread can run at any given moment.

Due to the existence of Python's Global Interpreter Lock (GIL), multithreaded programs do not necessarily run faster, especially for CPU-intensive tasks. However, it is still helpful for speeding up I/O-intensive tasks. But then again, with asynchronous I/O, multithreading is not really needed anymore.

To take advantage of multiple CPUs, you need to change the above multithreaded program to a [multiprocess](multiprocess) program.
