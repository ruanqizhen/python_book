# Multiprocessing

## Creating Processes

Similar to threads, Python provides the `multiprocessing` standard library module to create and manage processes, offering a rich API to implement multi-process applications.

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

In this code, `worker_function` accepts a `number` argument and runs in a separate child process. The line `p = Process(target=worker_function, args=(1,))` instantiates a process object, setting its target function to `worker_function` and passing `(1,)` as arguments. Calling `p.start()` spawns the child process and begins execution, while `p.join()` blocks the parent main process until the child process finishes execution.


## Process Pool

Spawning and context-switching processes incurs higher operating system overhead than working with threads. Because systems have a limited number of physical CPU cores, creating more processes than there are cores does not improve performance; instead, it slows down execution due to CPU context-switching overhead. To maximize parallel efficiency, you should rate-limit active processes. Rather than launching a new process for every task, use a **Process Pool** to maintain a fixed number of worker processes.

### Creating a Pool

When initializing a process pool, you can specify the number of worker processes to maintain. If omitted, the pool defaults to using the number of available CPU cores on your system.

```python
from multiprocessing import Pool
pool = Pool(processes=4)  # 创建一个包含4个进程的进程池
```

### Distributing Tasks

The most common way to distribute work is using the pool's `map` or `map_async` methods. These are asynchronous equivalents of the built-in [map()](high_order#map) function, executing tasks in parallel across the workers:

```python
def square(x):
    return x * x

results = pool.map(square, [1, 2, 3, 4])  # 输出 [1, 4, 9, 16]
```

The pool.map() method in the program above executes the square() function in parallel across multiple processes.

For individual tasks, use `apply` (blocking) or `apply_async` (non-blocking, returning an `AsyncResult` object):

```python
# 提交任务后，主进程可以继续做其他事情，不会被阻塞
async_result = pool.apply_async(func, args=(arg1, arg2))

print("任务已提交，正在后台运行...")

# 当需要结果时，再调用 get()，此时如果任务未完成则会阻塞
result = async_result.get()
```

### Closing

After submitting all tasks, close the pool to prevent new submissions and clean up resources:

```python
pool.close()
pool.join()  # 等待所有进程完成
```

Alternatively, calling `terminate()` immediately stops all worker processes, aborting any active tasks.

In a process pool, each process runs in its own isolated memory space. They do not share variables or memory state, avoiding the synchronization bugs common in multithreaded code. If a worker process raises an exception, that error is propagated back to the main process when retrieving the results; therefore, you should always handle exceptions when working with a process pool.


## Data Communication

Because each process has an isolated memory space, processes cannot share variables directly. To pass data between processes, use the communication utilities provided by the `multiprocessing` module.

### Pipe

A **pipe** (`Pipe`) establishes a communication channel between two processes, which can be unidirectional or bidirectional:

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

`Pipe()` returns a tuple containing two connection objects representing the two endpoints of the pipe. In this code, the parent process uses `parent_conn` to read data, while the child process writes to `child_conn`.

### Queue

While pipes are easy to use, they are limited to one-to-one communication. For more complex architectures with multiple reader or writer processes, you should use a queue.

A multi-process safe **queue** (`Queue`) coordinates data exchange, allowing multiple processes to push and pop items concurrently:

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

Queues are ideal for producer-consumer architectures. For example, some processes can read telemetry from hardware interfaces and push it to a queue, while consumer processes pull from the queue to plot charts or write logs.

### Value and Array

To share individual primitives or arrays directly in shared memory, use `Value` or `Array`:

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

A **manager** (`Manager`) runs a server process that manages Python objects (like lists or dictionaries) and allows other processes to manipulate them via proxy objects:

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

Note that using shared objects like `Value` or `Array` can still lead to race conditions. To guarantee consistency when mutating shared memory, protect the operations using lock primitives.


## Synchronization Mechanisms

You can coordinate processes using synchronization primitives similar to those used in [multithreading](multithread#synchronization-mechanisms). Because their usage is identical, we list them here briefly; see the thread synchronization section for detailed explanations.

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

While isolated memory spaces prevent the data race bugs common to threads, they make inter-process data exchange more complex.

To demonstrate the power of parallel execution across multiple CPU cores, we can rewrite the computational prime factorization script from the multithreading section using `multiprocessing`:

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

Running the multi-process version takes only 0.8 seconds—a 25x speedup. Given task scheduling overhead and execution differences across cores, this is a substantial performance improvement.
