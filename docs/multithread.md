# 多线程

## 进程和线程

进程和线程都是操作系统中关于任务调度和并发执行的核心概念。它们是操作系统为管理、执行和调度应用程序所使用的基本构建块。

进程是一个独立运行的程序实例，拥有自己的独立内存空间和系统资源。从操作系统的视角看，进程是一个执行中的程序和其状态的组合，包括程序计数器、寄存器、虚拟内存等。线程，是进程内部的一个单独的执行流程。线程在进程内共享同一地址空间和资源，但拥有自己的调用栈、程序计数器和寄存器状态。一个进程可以有多个线程。无论进程还是线程都是由操作系统来调度的。每个进程有自己的独立地址空间，但线程没有。在多核或多处理器系统中，多个线程可以不同的 CPU 内核并行执行。

简单来说：一个应用程序至少有一个进程，一个进程至少有一个线程。

我们之前编写的简单程序，都是只有一个进程一个线程的。接下来我们会讨论一下如何开启多个线程和进程。

Python 中的多线程多少有些尴尬，上文提到：“在多核或多处理器系统中，多个线程可以不同的 CPU 内核并行执行。” 是在一般情况下。但是 Python 程序却做不到这一点：Python 程序在多线程下也无法做到多 CPU 并行运行，我们会在下文讨论具体原因。虽然，不能让多 CPU 并行工作，好在多线程还可以让不同的外设读写并行运行，比如同时访问多个文件、数据库、网页等。所以在过去，Python 的多线程主要用于支持并发 I/O。但现在，Python 中有了[异步 I/O](asyncio)，多线程连这点优势也没有了。

尽管如此，多线程作为编程语言一个极为重要的概念，仍然值得我们深入研究一下。

## threading 模块

Python提供了多种方法来创建和管理多线程，其中最常见和直接的方法是使用标准库中的 threading 模块。

### 创建线程

使用 threading.Thread 类可以创建一个新的线程。最常见的方法是提供一个函数作为 Thread 类的构造函数的 target 参数。当线程启动时，这个函数或方法会被调用。使用 Thread 对象的 start() 方法可以启动线程，线程启动的同时，开始运行 target 指向的函数。如果需要等待一个线程完成任务，再继续后续程序，可以使用 Thread 对象的 join() 方法等待线程运行结束：

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

给线程命名和标识不但可以提高代码可读性和可维护性，还可以方便我们管理和控制线程。如果出现问题，把线程名和标识记录下来，也能帮助我们调试查找问题。

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

在上述代码中，我们首先定义了一个名为 display_data 的函数，用于显示当前线程的局部数据。然后，我们有一个 worker 函数，它是被多个线程运行的函数。worker 函数有输入参数，创建线程时，可以通过 threading.Thread 函数的 args 参数，把参数传递给 worker 函数。程序的每个线程，都在 worker 函数中设置了线程局部数据 local_data.value。尽管所有线程都使用相同的名字 "value" 来访问它们的线程局部数据，但每个线程都有其自己的独立数据实例，每个线程会维护各自不同的 value 的值。

主线程并没有设置 local_data.value，如果我们在主线程中尝试访问它，程序会抛出一个 AttributeError 异常。


### 守护线程

守护线程（Daemon Thread）是一个在后台运行的线程，不与用户直接交互。当主程序结束时，所有守护线程都会被自动终止，不论它们是否正在工作。这与“常规”线程或“用户”线程相反，常规线程在主程序结束后会继续执行直至线程自己结束。

守护线程通常用于执行后台任务，例如垃圾回收、日志管理、监控、自动存档等。其它线程无法使用 join() 函数等待守护线程结束，因为守护线程通常不应该自己结束，而是应该等到主程序结束时被自动关闭。如果在守护线程中，再创建一个新线程，新线程被称为“子线程”，它会默认继承其父线程的守护线程状态。

我们可以通过设置线程对象的 daemon 属性来使线程变为守护线程。

```python
import threading
import time

# 定义守护线程执行的函数
def daemon_thread():
    while True:
        print("守护线程正在运行...")
        time.sleep(1)

# 创建守护线程
d_thread = threading.Thread(target=daemon_thread)
d_thread.setDaemon(True)  # 将线程设置为守护线程
d_thread.start()

# 主程序执行一些任务
for i in range(5):
    print("主程序正在运行...")
    time.sleep(2)

# 主程序结束后，守护线程也将随之结束
print("主程序结束，守护线程也随之结束。")
```

在上述例子中，daemon_thread 函数被设置在守护线程中运行，它本身是个无限循环，会一直打印一些信息。当主程序结束时，守护线程也会被自动结束。

### 使用类创建线程

除了使用函数作为线程的目标，也可以通过继承 threading.Thread 类并重写其 run 方法来创建线程。

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

上面的程序定义了一个 MyThread 类，它继承自 threading.Thread。`__init__` 方法用于初始化线程，可以传递线程名称和延时参数。run 方法用于定义线程的具体行为：打印当前线程的信息。程序创建了两个 MyThread 类的实例 thread1 和 thread2，并传入了不同的参数。启动线程和等待线程结束的方法与之前相同。

使用类来创建线程的方法使得代码更加模块化和可复用，同时也便于管理线程的状态和行为。

## 同步机制

同步机制（Synchronization Primitives），也被称为同步原语，是一组用于协调多个线程对共享资源访问的工具。Python 的 threading 模块提供了多种同步机制，用来实现线程安全和避免潜在的竞争条件。

### 互斥锁

互斥锁（Mutex）是最基本的同步机制之一，也被称为锁、资源锁。主要用于保证在给定时刻只有一个线程可以访问某个资源或代码段，防止多个线程同时访问共享资源，从而避免竞争条件或数据不一致的问题。我们可以使用 threading 模块中的 Lock 类来实现线程互斥锁。

我们看下面这个程序：

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

上面的程序定义了一个共享资源 shared_resource，初始值为 0。它开辟了两个线程，每个线程都做同样的事情：循环 100000 次，每次迭代让 shared_resource 的值增加 1。两个线程，总共就应该运行 200000 次，那么程序运行的最终结果应该是 200000。但实际上，运行上面的程序，看到的结果是不确定的，很可能在 170000 左右。

出现这样的错误是因为，两个线程同时运行，而 shared_resource 有没被保护起来，那就很可能出现这样的情况： 线程读 a 取了 shared_resource 的数值，比如是 3;然后，线程读 b 取了它的值也是 3；然后，线程 a 把新数据 4 写回；最后，线程 b 也把新数据 4 写回。程序对 shared_resource 累加了两次，最终结果却它只增加了 1。

为了避免这样的错误，我们需要在读取 shared_resource 之前，就把它锁住，让其它线程不能再使用它，直到把它的数据修改后，再打开锁，允许其它线程访问。这样就不会有数据冲突了：

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

把需要被保护的操作放在 `with lock:` 代码块中，就可以确定这段代码不会被不同的线程同时执行了。如果程序逻辑复杂，无法使用 with 语句，也可以使用 lock.acquire() 函数请求加锁，lock.release() 函数释放锁。运行上面的程序，结果是确定的 200000。

使用互斥锁可以确保每次只有一个线程可以访问和修改共享资源，从而防止数据不一致的问题。在实际应用中，需要注意避免死锁和确保锁能够在任何情况下都被释放。

### 可重入锁

可重入锁（RLock - Reentrant Lock）是一种特殊类型的互斥锁，它允许同一个线程多次请求同一个锁。这意味着如果同一个线程已经获得了这个锁，它可以再次获得而不会发生死锁。它通常被用于递归函数中。

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

上面的程序定义了一个可重入锁 reentrant_lock。 recursive_function 是一个递归函数，它在每次递归调用时尝试获取同一个锁。由于 recursive_function 函数在被同一个线程调用时会多次尝试获取同一个锁，因此，它必须使用可重入锁。如果使用普通的互斥锁，程序将会死锁，因为锁无法被同一个线程多次获取。可重入锁解决了这个问题，使得同一个线程可以安全地多次获取同一个锁。


### 信号量

信号量（Semaphore）是一个更高级同步机制，用于控制对共享资源的访问。它维护了一个内部计数器，可以限制对资源的访问数量，例如，限制对数据库的并发访问数。线程可以通过增加或减少计数器来获得或释放资源。

以下是一个使用信号量的示例，其中模拟了对有限资源（如数据库连接）的并发访问：

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

在这个示例中，我们创建了一个信号量 semaphore，它允许最多两个线程同时访问共享资源。 access_resource 函数模拟了线程请求访问共享资源的过程。线程首先请求信号量，如果获得信号量，则访问资源；访问完成后，释放信号量。程序创建了五个线程来模拟并发访问共享资源的情况。每个线程启动后，都会尝试获取信号量。由于信号量的大小为 2，因此最多只有两个线程可以同时访问资源。

使用信号量是一种有效控制对有限数量资源的并发访问的方法，可以防止资源过载并保证系统稳定。


### 条件变量

条件变量（Condition）是一种同步机制，用于线程间的协调。条件变量允许一个或多个线程在某些条件成立之前挂起执行，并且允许另一个线程在条件满足时唤醒一个或所有等待的线程。

以下是使用条件变量的示例，模拟了生产者-消费者问题：

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
                if not items:
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

在这个示例中，我们定义了一个共享的商品列表 items 和一个条件变量 condition。Producer 类表示生产者，它生产商品并将其添加到 items 列表中，然后通过 condition.notify() 通知消费者。Consumer 类表示消费者，它等待商品可用（通过 condition.wait()），然后从 items 列表中消费商品。程序创建了一个生产者线程和一个消费者线程，分别执行生产者和消费者的逻辑。生产者在生产完商品后通知消费者，而消费者在没有商品可消费时等待。这种方式有效地协调了生产者和消费者之间的行为，防止了资源的冲突和不必要的忙等。


### 事件

事件（Event）是一个简单的同步机制，用于在线程之间发送信号。事件对象管理一个内部标志，该标志可以通过 set() 方法设置为真，通过 clear() 方法设置为假，通过 wait() 方法等待标志为真。

以下是使用事件（Event）的多线程示例，其中一个线程将等待事件被另一个线程触发：

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

在这个示例中，我们创建了一个事件对象 event。我们使用 event.wait() 把一个线程在事件被触发前挂起。trigger 函数表示触发事件的线程。它模拟了一些处理过程，然后使用 event.set() 触发事件。程序分别创建并启动了表示等待者和触发者的线程。等待者线程在事件被触发之前会暂停执行，而触发者线程在完成某些工作后触发该事件，从而允许等待者线程继续执行。这种方式在需要线程间协调操作时非常有用。


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

在上述代码中，两个工作线程试图以不同的顺序获取两把锁。如果 worker1 获得了 lock1，同时 worker2 获得了 lock2，那么每个工作线程都会等待另一个工作线程释放其所需的锁，从而导致死锁。

有一些常用的方法避免死锁，比如可以固定锁的获取顺序：确保所有线程总是按相同的顺序请求锁。这可以消除循环等待，从而避免死锁。修改上述代码，确保两个工作线程都首先尝试获取 lock1，然后再获取 lock2：

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

为了利用上多 CPU，需要把上面的多线程程序改为[多进程](multiprocess)。
