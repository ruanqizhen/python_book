# 多进程


## 创建进程

与创建线程类似，在 Python 中，可以使用 multiprocessing 模块来编写多进程程序。这个模块提供了一个丰富的 API，使得创建多进程应用变得相对简单。

创建一个新进程示例如下：

```python
from multiprocessing import Process

def worker_function(number):
    print(f"Worker {number} is working!")

if __name__ == "__main__":
    p = Process(target=worker_function, args=(1,))
    p.start()
    p.join()
	
```

在上面的示例中，我们定义了一个名为worker_function的函数，该函数接受一个参数number并打印一个关于工作的消息。这个函数将在子进程中运行。 `p = Process(target=worker_function, args=(1,))` 这一行创建了一个新的进程对象。通过 target 参数，我们告诉它要运行的函数是 worker_function，并为这个函数提供了参数(1,)。 `p.start()` 告诉进程开始执行。此时，一个新的子进程将被创建并开始运行。join()方法会阻塞主进程，直到子进程执行完毕。这确保主进程不会在子进程完成之前结束。


## 进程池

进程池（Process Pool）是一个并行执行多个任务的计算机处理资源的集合。它用于控制并行执行的进程总数量，而不是为每一个任务都开启一个单独的进程。开启终止进程也是有额外开销的，通过控制进程的数量，提供任务到进程的快速映射，使多核或多处理器的系统更加高效地利用计算资源。

### 创建

创建进程池时，可以指定要使用的进程数量。如果不指定，那么进程池默认使用系统上可用的所有核心。

```python
from multiprocessing import Pool
pool = Pool(processes=4)  # 创建一个包含4个进程的进程池
```

### 分发任务

分发任务使用的是进程池的 map 和 map_async 方法。这两个方法类似于 Python 的内置 map 函数，但它们支持并行执行函数调用。这是分发批量任务到进程池的常见方式。

```python

def square(x):
    return x * x

results = pool.map(square, [1, 2, 3, 4])  # 输出 [1, 4, 9, 16]
```

对于单个任务，可以使用 apply 和 apply_async 方法。apply 方法是阻塞的，而 apply_async 是非阻塞的并返回一个 AsyncResult 对象。

```python
result = pool.apply(func, args=(arg1, arg2))  # 阻塞调用
async_result = pool.apply_async(func, args=(arg1, arg2))  # 非阻塞调用
result = async_result.get()  # 从AsyncResult对象中获取结果
```

### 关闭

在完成所有任务后，需要关闭进程池，以防止提交更多的任务。可以使用 close 方法进行关闭。

```python
pool.close()
pool.join()  # 等待所有进程完成
```

如果需要立即停止进程池，可以使用 terminate 方法。这将立即终止所有进程，可能会导致未完成的任务丢失。

使用进程池中的进程时，每个进程都运行在其自己的内存空间中。这意味着它们之间不会共享状态或变量，这可以避免许多多线程编程中的并发问题。如果进程池中的任何任务引发异常，该异常将被传播到主进程，因此建议在使用进程池时进行适当的异常处理。


## 数据通信

每个进程都有自己独立的内存空间，所以一个进程不能直接去另一个进程里的变量中读取数据。在不同的进程间传递数据和通信，需要利用 multiprocessing 提供的一些工具。

### 管道

管道（Pipe）提供了一种双向或单向通信通道，两个进程可以通过它发送或接收数据。

```python
from multiprocessing import Process, Pipe

def worker(conn):
    conn.send("Hello from worker process!")
    conn.close()

parent_conn, child_conn = Pipe()
p = Process(target=worker, args=(child_conn,))
p.start()
print(parent_conn.recv())  # 输出: Hello from worker process!
p.join()
```

Pipe()函数返回一个包含两个连接对象的元组：parent_conn 和 child_conn。这两个连接对象代表管道的两端。在这个例子中，主进程将使用 parent_conn 来接收消息，而工作进程将使用 child_conn 来发送消息。

### 队列

管道虽然使用简单，但它只能用于最简单的一对一通信方式，如果有更多的进程参与通信，或者数据产生量较大，需要一个结构来保存数据的，那么需要使用队列。

队列（Queue）是多进程安全的，可以用于进程之间的通信和数据交换。它允许多个进程放入数据，并从中取出数据。

```python
from multiprocessing import Process, Queue

def worker(q):
    q.put("Data from worker process")

q = Queue()
p = Process(target=worker, args=(q,))
p.start()
print(q.get())  # 输出: Data from worker process
p.join()
```

队列非常适合应用与多生产者和多消费者的场景。比如，一些进程负责生产数据：读取一个被测试设备的电压，信号波形等数据；另外几个进程负责消费数据：把数据显示到用户界面，存盘等。

### Value 和 Array

当需要在进程之间共享一个单一的值或数组时，可以使用Value或Array。这些对象使用共享内存来存储数据，因此可以由多个进程访问。

```python
from multiprocessing import Process, Value, Array

def worker(val, arr):
    val.value = 100
    for i in range(len(arr)):
        arr[i] = -arr[i]

val = Value('i', 0)  # 'i' indicates integer data type
arr = Array('d', [1.0, 2.0, 3.0])  # 'd' indicates double data type
p = Process(target=worker, args=(val, arr))
p.start()
p.join()
print(val.value)  # 输出: 100
print(arr[:])  # 输出: [-1.0, -2.0, -3.0]
```

### 管理器

管理器（Manager）提供了一种在进程之间共享更复杂的Python对象的方法，如列表、字典等。管理器启动了一个新的进程，其他进程通过代理与它通信。

```python
from multiprocessing import Process, Manager

def worker(l, d):
    l[1] = 100
    d["b"] = "Updated"

with Manager() as manager:
    l = manager.list([1, 2, 3])
    d = manager.dict({"a": "Initial", "b": "Original"})

    p = Process(target=worker, args=(l, d))
    p.start()
    p.join()

    print(l)  # 输出: [1, 100, 3]
    print(d)  # 输出: {'a': 'Initial', 'b': 'Updated'}
```

尽管使用共享对象（如Value或Array）进行进程间通信可能更直接，但它也可能带来竞态条件和数据不一致性的问题。为确保数据的一致性，可能需要使用同步原语，如锁。


## 同步

我们可以使用与线程间同步非常类似的工具进行进程间的同步

### 锁

锁是最基本的同步原语，类似于线程中的互斥锁。它可以确保同一时刻只有一个进程可以访问共享的资源或代码段。

```python
from multiprocessing import Process, Lock

def printer(item, lock):
    with lock:
        print(item)

lock = Lock()
for item in range(10):
    Process(target=printer, args=(item, lock)).start()
```

### 信号量

与线程同步中的信号量概念相同。它允许维护一个计数，从而允许有限数量的进程访问资源。它通常用于限制对资源的并发访问数量。

```python
from multiprocessing import Process, Semaphore

def worker(sem):
    with sem:
        # critical section of code
        pass

sem = Semaphore(2)  # Only 2 processes allowed at a time
```

### 事件

进程可以等待事件变为true，或者设置或清除事件标志。

```python
from multiprocessing import Process, Event

def wait_for_event(e):
    e.wait()
    # code to execute after event is set

event = Event()
```


### 条件变量

条件变量结合了锁和事件的功能。它允许一个或多个进程等待直到被另一个进程明确地通知继续执行。

```python
from multiprocessing import Process, Condition

def worker(cond):
    with cond:
        # wait for notification
        cond.wait()
        # continue processing

cond = Condition()
```


## 演示

与多线程编程相比，多进程编程的一个主要优点是每个进程都运行在自己的内存空间中，这避免了许多与并发相关的常见问题。但同时，数据的交换和共享也变得更为复杂。

为了利用上多 CPU，我们把在多线程中使用的示例改为多进程。

```python
import time
from multiprocessing import Pool


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


def process_range(start, end):
    for i in range(start, end):
        prime_factors(i)


def main():
    num_processes = 72
    start_num = 1000000000
    end_num = 1000010000
    step = (end_num - start_num) // num_processes

    chunks = [
        (start_num + i * step, start_num + (i + 1) * step) for i in range(num_processes)
    ]

    start_time = time.time()

    with Pool(processes=num_processes) as pool:
        pool.starmap(process_range, chunks)

    end_time = time.time()
    print(f"程序运行时间: {end_time - start_time:.6f} 秒")


if __name__ == "__main__":
    main()
```

运行上面的程序，耗时 0.8 秒，速度提高了 25 倍。考虑到任务分配不均匀，额外的开销，测量的误差等因素，提高 25 倍已经非常好了。