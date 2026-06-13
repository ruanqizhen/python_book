# Multiprocessing

## Creating Processes

Similar to creating threads, in Python you can use the multiprocessing module to write multiprocess programs. This module provides a rich API, making it relatively straightforward to create multiprocess applications.

Here is an example of creating a new process:

```python
from multiprocessing import Process

def worker_function(number):
    print(f"进程 {number} 正在工作。")

if __name__ == "__main__":
    p = Process(target=worker_function, args=(1,))
    p.start()
    p.join()
    
```

In the example above, we defined a function named worker_function that accepts a parameter number and prints a message about working. This function will run in the child process. The line `p = Process(target=worker_function, args=(1,))` creates a new process object. Through the target parameter, we tell it the function to run is worker_function, and provide the argument (1,) for this function. `p.start()` tells the process to start executing. At this point, a new child process will be created and begin running. The join() method blocks the main process until the child process completes execution. This ensures the main process does not end before the child process finishes.


## Process Pool

Creating processes and switching between them also has additional overhead, and this overhead is greater than that of threads. Generally, a computer has a limited number of CPU cores. If the number of created processes exceeds the number of CPU cores, it is impossible for each process to have its own dedicated CPU core. Consequently, having more processes will no longer help fully utilize the CPU, and will only add to the burden of process switching. Therefore, we should control the total number of processes to improve parallel computing efficiency. We can use a Process Pool to control the total number of concurrently executing processes, instead of starting a separate process for each task.

### Creating a Pool

When creating a process pool, you can specify the number of processes to use. If not specified, the process pool defaults to using all available cores on the system.

```python
from multiprocessing import Pool
pool = Pool(processes=4)  # 创建一个包含4个进程的进程池
```

### Distributing Tasks

The most common way to distribute tasks to a process pool is to use the pool's map and map_async methods. These two methods are similar to Python's built-in [map function](high_order#map), but they support parallel execution of function calls.

```python
def square(x):
    return x * x

results = pool.map(square, [1, 2, 3, 4])  # 输出 [1, 4, 9, 16]
```

The pool.map() method in the program above executes the square() function in parallel across multiple processes.

For individual tasks, you can use the apply and apply_async methods. The apply method is blocking, while apply_async is non-blocking and returns an AsyncResult object.

```python
# 提交任务后，主进程可以继续做其他事情，不会被阻塞
async_result = pool.apply_async(func, args=(arg1, arg2))

print("任务已提交，正在后台运行...")

# 当需要结果时，再调用 get()，此时如果任务未完成则会阻塞
result = async_result.get()
```

### Closing

After completing all tasks, the process pool needs to be closed to prevent submitting more tasks. You can use the close method to close it.

```python
pool.close()
pool.join()  # 等待所有进程完成
```

If you need to stop the process pool immediately, you can use the terminate method. This will immediately terminate all processes, which may cause incomplete tasks to be lost.

When using processes from a process pool, each process runs in its own memory space. This means they do not share state or variables with each other, which avoids many concurrency issues found in multithreaded programming. If any task in the process pool raises an exception, that exception will be propagated to the main process, so it is recommended to implement proper exception handling when using a process pool.


## Data Communication

Each process has its own independent memory space, so one process cannot directly read data from another process's variables. To transfer data and communicate between different processes, you need to use some of the tools provided by multiprocessing.

### Pipe

A Pipe provides a two-way or one-way communication channel through which two processes can send or receive data.

```python
from multiprocessing import Process, Pipe

def worker(conn):
    conn.send("工作进程发送的数据")
    conn.close()

parent_conn, child_conn = Pipe()
p = Process(target=worker, args=(child_conn,))
p.start()
print(parent_conn.recv())  # 输出: "工作进程发送的数据"
p.join()
```

The Pipe() function returns a tuple containing two connection objects: parent_conn and child_conn. These two connection objects represent the two ends of the pipe. In this example, the main process will use parent_conn to receive messages, while the worker process will use child_conn to send messages.

### Queue

Although a pipe is simple to use, it can only be used for the simplest one-to-one communication. If more processes are involved in communication, or if a large amount of data is being produced and a structure is needed to store the data, then a queue should be used.

A Queue is multiprocess-safe and can be used for communication and data exchange between processes. It allows multiple processes to put data in and take data out.

```python
from multiprocessing import Process, Queue

def worker(q):
    q.put("工作进程发送的数据")

q = Queue()
p = Process(target=worker, args=(q,))
p.start()
print(q.get())  # 输出: "工作进程发送的数据"
p.join()
```

Queues are very suitable for scenarios with multiple producers and multiple consumers. For example, some processes are responsible for producing data: reading data such as voltage and signal waveforms from a device under test; other processes are responsible for consuming data: displaying data on a user interface, saving to disk, etc.

### Value and Array

When you need to share a single value or array between processes, you can use Value or Array. These objects use shared memory to store data, so they can be accessed by multiple processes.

```python
from multiprocessing import Process, Value, Array

def worker(val, arr):
    val.value = 100
    for i in range(len(arr)):
        arr[i] = -arr[i]

val = Value('i', 0)                # 'i' 表示整数
arr = Array('d', [1.0, 2.0, 3.0])  # 'd' 表示双精度浮点数
p = Process(target=worker, args=(val, arr))
p.start()
p.join()
print(val.value)   # 输出: 100
print(arr[:])      # 输出: [-1.0, -2.0, -3.0]
```

### Manager

A Manager provides a way to share more complex Python objects between processes, such as lists, dictionaries, etc. The Manager starts a new process, and other processes communicate with it through proxies.

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

Although using shared objects (such as Value or Array) for inter-process communication may be more straightforward, it can also introduce problems with race conditions and data inconsistency. To ensure data consistency, synchronization mechanisms such as mutex locks may be needed.


## Synchronization Mechanisms

We can use tools very similar to the [inter-thread synchronization mechanisms](multithread#同步机制) for inter-process synchronization. Because they are extremely similar, we will only give a brief demonstration here. For detailed explanations, please refer to the introduction in the thread section.

### Mutex Lock

A mutex lock is the most basic synchronization mechanism, ensuring that only one process can access a shared resource or code section at a time.

```python
from multiprocessing import Process, Lock

def printer(item, lock):
    with lock:
        print(item)

if __name__ == "__main__":
    lock = Lock()
    for item in range(10):
        p = Process(target=printer, args=(item, lock))
        p.start()
        # 注意：这里最好加上 join，否则主进程可能先于子进程结束
        p.join()
```

### Semaphore

The concept is the same as semaphores in thread synchronization. It maintains a counter, allowing a limited number of processes to access a resource. It is typically used to limit the number of concurrent accesses to a resource.

```python
from multiprocessing import Process, Semaphore

def worker(sem):
    with sem:
        # critical section of code
        pass

sem = Semaphore(2)  # Only 2 processes allowed at a time
```

### Condition Variable

A condition variable combines the functionality of locks and events. It allows one or more processes to wait until they are explicitly notified by another process to continue execution.

```python
from multiprocessing import Process, Condition

def worker(cond):
    with cond:
        # wait for notification
        cond.wait()
        # continue processing

cond = Condition()
```

### Event

Processes can wait for an event to become true, or set or clear an event flag.

```python
from multiprocessing import Process, Event

def wait_for_event(e):
    e.wait()
    # code to execute after event is set

event = Event()
```

## Demonstration

Compared to multithreaded programming, one of the main advantages of multiprocess programming is that each process runs in its own memory space, which avoids many common concurrency-related problems. However, data exchange and sharing also become more complex.

To take advantage of multiple CPUs, we convert the example used in the multithreading section to multiprocessing.

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

Running the program above takes 0.8 seconds, a speedup of 25 times. Considering factors such as uneven task distribution, additional overhead, measurement errors, etc., a 25x improvement is already very good.
