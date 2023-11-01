# 多线程

## 进程和线程

进程和线程都是操作系统中关于任务调度和并发执行的核心概念。它们是操作系统为管理、执行和调度应用程序所使用的基本构建块。

进程是一个独立运行的程序实例，拥有自己的独立内存空间和系统资源。从操作系统的视角看，进程是一个执行中的程序和其状态的组合，包括程序计数器、寄存器、虚拟内存等。线程，是进程内部的一个单独的执行流程。线程在进程内共享同一地址空间和资源，但拥有自己的调用栈、程序计数器和寄存器状态。一个进程可以有多个线程。无论进程还是线程都是由操作系统来调度的。每个进程有自己的独立地址空间，但线程没有。在多核或多处理器系统中，多个线程可以不同的 CPU 内核并行执行。

简单来说：一个应用程序至少有一个进程，一个进程至少有一个线程。

我们之前编写的简单程序，都是只有一个进程一个线程的。接下来我们会讨论一下如何开启多个线程和进程。

## threading 模块

Python提供了多种方法来创建和管理多线程，其中最常见和直接的方法是使用标准库中的 threading 模块。

### 创建线程

使用 threading.Thread 类可以创建一个新的线程。最常见的方法是提供一个函数或方法作为 target 参数，当线程启动时，这个函数或方法会被调用。

```python
import threading

def print_numbers():
    for i in range(5):
        print(i)

# 创建线程
thread = threading.Thread(target=print_numbers)
```

### 启动线程

使用Thread对象的 start() 方法启动线程，线程启动的同时，开始运行 target 指向的函数。

```python
thread.start()
```

### 等待线程完成

如果需要等待一个线程完成任务，再继续后续程序，可以用 join()方法等待线程完成其执行。

```python
thread.join()
```

### 线程的命名和标识

我们可以在创建线程时使用 name 参数为其命名，然后使用 threading.name 属性获取一个线程的名称。每个线程还有一个唯一的标识，可以使用 threading.get_ident() 获取。

```python
import threading
import time

def worker():
    # 获取当前线程的名称
    current_thread_name = threading.current_thread().name
    # 获取当前线程的标识
    thread_ident = threading.get_ident()
    
    print(f"{current_thread_name} (ID: {thread_ident}) has started.")
    time.sleep(2)
    print(f"{current_thread_name} (ID: {thread_ident}) has ended.")

# 创建两个线程，并给它们命名
thread1 = threading.Thread(target=worker, name="Thread-1")
thread2 = threading.Thread(target=worker, name="Thread-2")

thread1.start()
thread2.start()

thread1.join()
thread2.join()

print("Main thread is done.")
```


### 线程局部数据

每个线程可以拥有其自己的数据实例，独立于其他线程。这是通过 threading.local() 来实现的。线程局部数据在某些应用中很有用，例如数据库连接、请求上下文等。

以下是一个使用线程局部数据的简单示例：

```python
import threading

# 创建线程局部数据
local_data = threading.local()

def display_data():
    try:
        value = local_data.value
    except AttributeError:
        print("No value yet!")
    else:
        print(f"Value is {value}")

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

# 输出可能是：
# Value is 1
# Value is 2
# No value yet!
```

在上述代码中，我们首先定义了一个名为 display_data 的函数，用于显示当前线程的局部数据。然后，我们有一个 worker 函数，每个线程在其中设置其线程局部数据。即使所有线程都使用相同的名字 value 来访问它们的线程局部数据，但每个线程都有其自己的独立数据实例，会维护各自不同的 value 的数值。主线程并没有设置 local_data.value，所以当我们尝试访问它时，会抛出一个 AttributeError。


### 守护线程

守护线程（Daemon Thread）是一个在后台运行的线程，不与用户直接交互。在主程序结束时，所有守护线程都会被自动终止，不论它们是否正在工作。这与“常规”线程或“用户”线程相反，常规线程在主程序结束后会继续执行直至线程自己结束。

守护线程通常用于执行后台任务，例如垃圾回收、日志管理、监控、自动存档等。守护线程不能被其他线程加入（使用join()方法），因为主程序可能在守护线程完成之前已经结束。子线程默认“继承”其父线程的守护线程状态。

在 Python 的 threading 模块中，可以通过设置线程对象的 daemon 属性来使线程变为守护线程。

```python
import threading
import time

def daemon_worker():
    print("Daemon thread starting...")
    time.sleep(2)
    print("Daemon thread ending...")  # 这可能不会执行

thread = threading.Thread(target=daemon_worker)
thread.daemon = True  # 将线程设置为守护线程
thread.start()

time.sleep(1)
print("Main program ending.")
```

在上述例子中，daemon_worker 函数让线程休眠 2 秒钟。但主程序只等待 1 秒钟就结束了。因为我们设置了线程为守护线程，所以当主程序结束时，守护线程也会被强制结束。这意味着"Daemon thread ending..."可能永远不会被打印。

### 使用类实现线程

除了使用函数作为线程的目标，也可以通过继承 threading.Thread 类并重写其 run 方法来创建线程。

```python
class MyThread(threading.Thread):
    def run(self):
        print_numbers()

thread = MyThread()
thread.start()
```

## 同步原语

同步原语（Synchronization Primitives）是一组用于协调多个线程对共享资源访问的工具。Python 的 threading 模块提供了多种同步原语，以支持线程安全和避免潜在的竞争条件。

### 互斥锁

锁（Lock）是最基本的同步原语之一，也被称为互斥锁、资源锁。主要用于保证在给定时刻只有一个线程可以访问某个资源或代码段。

比如：

```python
import threading

lock = threading.Lock()
counter = 0

def worker():
    global counter
    with lock:
        temp = counter
        counter = temp + 1
        print(f'Counter value: {counter}')

threads = [threading.Thread(target=worker) for _ in range(10)]

for t in threads:
    t.start()

for t in threads:
    t.join()
```

### 可重入锁

可重入锁（RLock - Reentrant Lock）允许一个线程多次获取同一个锁，这在递归函数中很有用。

```python
import threading

rlock = threading.RLock()

def recursive_worker(level=5):
    with rlock:
        if level > 0:
            print(f'Level: {level}')
            recursive_worker(level-1)

thread = threading.Thread(target=recursive_worker)
thread.start()
thread.join()
```

### 信号量

信号量（Semaphore）是一个更高级的同步原语，它维护了一个内部计数器。线程可以通过增加或减少计数器来获得或释放资源。

```python
import threading

semaphore = threading.Semaphore(2)  # 最多允许两个线程同时运行

def semaphore_worker(number):
    with semaphore:
        print(f'Thread {number} is working')
        import time
        time.sleep(2)

threads = [threading.Thread(target=semaphore_worker, args=(i,)) for i in range(5)]

for t in threads:
    t.start()

for t in threads:
    t.join()
```

### 条件变量

条件变量（Condition）是基于其他锁（Lock 或 RLock）的高级同步原语。它允许线程等待特定条件成为真，或者通知其他线程某个条件已经成为真。

```python
import threading

condition = threading.Condition()
items = []

def consumer():
    with condition:
        while not items:
            condition.wait()
        items.pop()
        print('Consumed one item')

def producer():
    with condition:
        items.append('item')
        print('Produced one item')
        condition.notify()

threads = [threading.Thread(target=producer), threading.Thread(target=consumer)]

for t in threads:
    t.start()

for t in threads:
    t.join()
```

### 事件

事件（Event）是一个简单的同步原语，允许线程等待某个事件的发生，或者通知其他线程事件已经发生。

```python
import threading
import time

event = threading.Event()

def event_worker():
    print('Waiting for event...')
    event.wait()
    print('Event has been set!')

thread = threading.Thread(target=event_worker)
thread.start()

time.sleep(2)
event.set()
thread.join()
```

## 死锁

多线程程序经常遇到的一个问题是死锁：两个或多个线程无法继续执行，因为每个线程都在等待其他线程释放它所需要的资源。这导致所有线程都陷入了一种相互等待的状态，无法继续执行。

下面是一个死锁的简单例子：

```python
import threading

# 创建两把锁
lock1 = threading.Lock()
lock2 = threading.Lock()

def worker1():
    with lock1:
        print("Worker 1 acquired lock1")
        with lock2:
            print("Worker 1 acquired lock2")

def worker2():
    with lock2:
        print("Worker 2 acquired lock2")
        with lock1:
            print("Worker 2 acquired lock1")

# 创建并启动线程
t1 = threading.Thread(target=worker1)
t2 = threading.Thread(target=worker2)

t1.start()
t2.start()

t1.join()
t2.join()

print("Finished")
```

在上述代码中，两个工作线程试图以不同的顺序获取两把锁。如果 worker1 获得了 lock1，同时 worker2 获得了 lock2，那么每个工作线程都会等待另一个工作线程释放其所需的锁，从而导致死锁。

有一些常用的方法避免死锁，比如可以固定锁的获取顺序：确保所有线程总是按相同的顺序请求锁。这可以消除循环等待，从而避免死锁。修改上述代码，确保两个工作线程都首先尝试获取 lock1，然后再获取 lock2：

```python
def worker1():
    with lock1:
        print("Worker 1 acquired lock1")
        with lock2:
            print("Worker 1 acquired lock2")

def worker2():
    with lock1:  # 修改这里
        print("Worker 2 acquired lock1")
        with lock2:
            print("Worker 2 acquired lock2")
```

除了采用固定加锁顺序，还可以设置尝试获取锁的超时时间。这样，如果线程在超时时间内没有获得锁，它可以放弃，回退，并在稍后再次尝试，或者采取其他补救措施。此外，也可以使用特定的算法或工具来检测死锁，然后采取措施打破死锁。这种方法在更复杂的系统中可能会更有效。


## 全局解释锁

我们先编写一个计算质因数分解的函数：

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

当输入是个很大的整数时，这个程序需要运算比较长的时间。比如下面这个程序，对 10000 个数进行质因数分解：

```python
import time

start_time = time.time()  # 记录开始时间
for i in range(1000000000, 1000010000):
    prime_factors(i)
end_time = time.time()  # 记录结束时间
print(f"程序运行时间: {end_time - start_time:.6f} 秒")
```

在笔者电脑上它总共耗时 20.3 秒。速度非常慢，不过笔者的电脑有 72 个 CPU 内核，所以如果把任务平均分派给 72 个内核，同时运行，应该速度会快很多吧。把上面的程序改写成多线程程序：

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
            end = numbers[-1]
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

再次运行，耗时19.9 秒，刨去误差，这个多线程程序运行时间与单线程似乎毫无差别。

造成性能无法提高的原因是由于 Python 的全局解释器锁（GIL - the Global Interpreter Lock）的存在。Python 是一种解释型语言，解释器一边把我们编写的代码翻译成“字节码”，一边运行翻译好的字节码。在多线程时，当一个线程想要执行 Python 字节码时，它必须首先获取 GIL。这是出于数据安全的考虑，但造成的结果是，即便程序是多线程的，每一个时刻也只能有一个线程在运行。

由于 Python 的全局解释器锁（GIL）的存在，多线程的程序不一定会加快执行速度，尤其是 CPU 密集型的任务。但是对于加速 I/O 密集行的任务还是有帮助的。只不过，有了异步 I/O，其实也不需要多线程了。

为了利用上多 CPU，需要把上面的多线程程序改为多进程。
