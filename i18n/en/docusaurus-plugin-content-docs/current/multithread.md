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

# Create thread
thread = threading.Thread(target=print_numbers)

# Start thread
thread.start()

# Wait for thread to finish
thread.join()
```

### Thread Naming and Identification

You can assign a custom name to a thread using the `name` parameter during instantiation, and retrieve it using the thread's `name` property. Each thread is also assigned a unique integer identifier by the operating system, which can be accessed using `threading.get_ident()` within the thread, or via the `ident` attribute of the thread object.

```python
import threading
import time

def worker():
    # Get the name of the current thread
    current_thread_name = threading.current_thread().name
    # Get the identifier of the current thread
    thread_ident = threading.get_ident()
    
    print(f"{current_thread_name} (ID: {thread_ident}) started")
    time.sleep(2)
    print(f"{current_thread_name} (ID: {thread_ident}) finished")

# Create two threads and name them
thread1 = threading.Thread(target=worker, name="Thread-1")
thread2 = threading.Thread(target=worker, name="Thread-2")

thread1.start()
thread2.start()

thread1.join()
thread2.join()

# Output similar to:
# Thread-1 (ID: 140173712739104) started
# Thread-2 (ID: 140173711678240) started
# Thread-1 (ID: 140173712739104) finished
# Thread-2 (ID: 140173711678240) finished
```

Naming and identifying threads improves readability, simplifies thread management, and makes debugging concurrency issues much easier.

### Thread-Local Data

Thread-local data allows each thread to maintain its own isolated state that is inaccessible to other threads. This is implemented using `threading.local()`, which is useful for managing thread-specific contexts like database connections or HTTP request sessions.

The following is a simple example of using thread-local data:

```python
import threading

# Create thread-local data
local_data = threading.local()

def display_data():
    try:
        value = local_data.value
    except AttributeError:
        print("No data")
    else:
        print(f"Data is {value}")

def worker(number):
    # Each thread sets a thread-local variable based on the input argument
    local_data.value = number
    display_data()

# Create two threads
thread1 = threading.Thread(target=worker, args=(1,))
thread2 = threading.Thread(target=worker, args=(2,))

thread1.start()
thread2.start()

thread1.join()
thread2.join()

# Display thread-local data in the main thread
display_data()

# Output:
# Data is 1
# Data is 2
# No data
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

# Define function to be executed by the daemon thread
def daemon_thread():
    while True:
        print("Daemon thread is running...")
        time.sleep(1)

# Create daemon thread
# Recommended approach 1: Specify at creation time
d_thread = threading.Thread(target=daemon_thread, daemon=True)

# Recommended approach 2: Set the property
# d_thread = threading.Thread(target=daemon_thread)
# d_thread.daemon = True

d_thread.start()

# Main program performs some tasks
for i in range(5):
    print("Main program is running...")
    time.sleep(2)

# Once the main program ends, the daemon thread will also end
print("Main program ended, daemon thread also ended.")
```

In this code, the daemon thread runs an infinite loop. Once the main thread finishes printing and exits, the daemon thread is immediately terminated by Python.

### Creating Threads with Classes

Alternatively, you can define threads by subclassing `threading.Thread` and overriding the `run()` method to encapsulate the thread's execution logic:

```python
import threading
import time

# Define a class inheriting from threading.Thread
class MyThread(threading.Thread):
    def __init__(self, name, delay):
        super().__init__()
        self.name = name
        self.delay = delay

    def run(self):
        print(f"Thread {self.name} started running")
        for i in range(5):
            time.sleep(self.delay)
            print(f"Thread {self.name} is running, execution count: {i + 1}")
        print(f"Thread {self.name} finished running")

# Create thread instances
thread1 = MyThread("Thread-1", 1)
thread2 = MyThread("Thread-2", 1.5)

# Start threads
thread1.start()
thread2.start()

# Wait for all threads to complete
thread1.join()
thread2.join()

print("Main program ended")
```

This object-oriented approach encapsulates the thread's arguments and state inside a custom class. The `run()` method acts as the entry point, executing when `start()` is invoked. Subclassing `Thread` makes thread management more modular and reusable in complex projects.

## Synchronization Mechanisms

Synchronization primitives are tools used to coordinate thread execution and control access to shared state. The `threading` module provides several primitives to guarantee thread safety and prevent race conditions.

### Mutex Lock

A **mutex lock** (mutual exclusion lock) is the most basic synchronization primitive. It ensures that only one thread can execute a critical section of code or access a shared resource at a time, preventing data corruption caused by concurrent writes.

Let's look at the following program:

```python
import threading

# Shared resource
shared_resource = 0

# A simple thread function to increment the shared resource value
def increase_resource():
    global shared_resource

    for _ in range(100000):  # Perform large number of operations to highlight the race condition
        shared_resource += 1

# Create threads
thread1 = threading.Thread(target=increase_resource)
thread2 = threading.Thread(target=increase_resource)

# Start threads
thread1.start()
thread2.start()

# Wait for threads to complete
thread1.join()
thread2.join()

print(f"Final shared resource value: {shared_resource}")
```

In this code, two threads concurrently increment a global counter 100,000 times. You would expect the final count to be exactly 200,000, but running this script yields a non-deterministic total (typically around 170,000).

This error is caused by a race condition. The increment operation (`shared_resource += 1`) is not atomic; under the hood, Python reads the value, adds one, and writes it back. If both threads read the value simultaneously (e.g., both read `3`), both compute `4`, and both write `4` back, one increment is lost.

To resolve this, we use a lock to ensure that the read-modify-write cycle is executed atomically by only one thread at a time:

```python
import threading

# Shared resource
shared_resource = 0
# Create a lock object
lock = threading.Lock()

# A simple thread function to increment the shared resource value
def increase_resource():
    global shared_resource

    for _ in range(100000):  # Perform large number of operations to highlight the race condition
        lock.acquire()  # Acquire the lock
        try:
            shared_resource += 1
        finally:
            lock.release()  # Release the lock

# Create threads
thread1 = threading.Thread(target=increase_resource)
thread2 = threading.Thread(target=increase_resource)

# Start threads
thread1.start()
thread2.start()

# Wait for threads to complete
thread1.join()
thread2.join()

print(f"Final shared resource value: {shared_resource}")
```

Placing the operations that need protection inside a `with lock:` block ensures that this code will not be executed simultaneously by different threads. If the program logic is complex and cannot use the with statement, you can also use the lock.acquire() function to request a lock and the lock.release() function to release it. Running the above program gives a deterministic result of 200,000.

Using a mutex lock ensures that only one thread can access and modify a shared resource at a time, thus preventing data inconsistency issues. In practical applications, care should be taken to avoid deadlocks and ensure that locks are released under all circumstances.

### Reentrant Lock

A **reentrant lock** (`RLock`) is a mutex that can be acquired multiple times by the same thread without causing a deadlock. This is useful for recursive algorithms or nested methods where the same thread needs to repeatedly enter locked sections:

```python
import threading
import time

# Create a reentrant lock
reentrant_lock = threading.RLock()

# A recursive function that repeatedly acquires the same lock
def recursive_function(count):
    if count > 0:
        with reentrant_lock:
            print(f"Thread {threading.current_thread().name} acquired lock, count is {count}")
            time.sleep(0.1)
            recursive_function(count - 1)

# Thread function
def thread_function():
    with reentrant_lock:
        recursive_function(3)

# Create and start threads
thread1 = threading.Thread(target=thread_function, name="Thread-1")
thread2 = threading.Thread(target=thread_function, name="Thread-2")

thread1.start()
thread2.start()

thread1.join()
thread2.join()

print("Main program ended")
```

If we used a standard `Lock` here, the program would immediately deadlock on the second recursive call because the thread would block waiting for itself to release the lock. An `RLock` resolves this by keeping track of the recursion depth and owner thread.

### Semaphore

A **semaphore** maintains an internal counter to limit concurrent access to a shared resource. Semaphores are commonly used to rate-limit access to high-load systems, such as database connection pools or API rate-limiters:

```python
import threading
import time
import random

# Create a semaphore, allowing at most two threads to access the shared resource concurrently
semaphore = threading.Semaphore(2)

def access_resource(thread_number):
    print(f"Thread {thread_number} is requesting resource access")
    # Request semaphore
    semaphore.acquire()
    print(f"Thread {thread_number} obtained access permission")
    # Simulate resource access
    time.sleep(random.uniform(0.1, 1.0))
    print(f"Thread {thread_number} completed access")
    # Release semaphore
    semaphore.release()

# Create and start threads
threads = []
for i in range(5):
    thread = threading.Thread(target=access_resource, args=(i,))
    threads.append(thread)
    thread.start()

# Wait for all threads to complete
for thread in threads:
    thread.join()

print("All threads completed access")
```

By initializing `Semaphore(2)`, we restrict access to a maximum of two concurrent threads. Any additional threads that attempt to call `acquire()` will block until one of the active threads releases the semaphore.

### Condition Variable

A **condition variable** (`Condition`) allows threads to synchronize based on state changes. One or more threads can wait (`wait()`) until a specific condition is met, while another thread updates the state and notifies (`notify()`) the waiting threads:

```python
import threading
import time
import random

# Product list
items = []
# Create condition variable
condition = threading.Condition()

# Producer class
class Producer(threading.Thread):
    def run(self):
        global items
        for i in range(5):
            time.sleep(random.uniform(0.1, 1.0))  # Simulate production time
            item = f'Product-{i}'
            with condition:
                items.append(item)
                print(f'{self.name} produced {item}')
                condition.notify()  # Notify consumers

# Consumer class
class Consumer(threading.Thread):
    def run(self):
        global items
        while True:
            with condition:
                # Use while loop to check the condition, preventing spurious wakeups or resource preemption
                while not items:  
                    print(f'{self.name} waiting for products...')
                    condition.wait()  # Wait for products
                
                item = items.pop(0)
                print(f'{self.name} consumed {item}')
            time.sleep(random.uniform(0.1, 1.0))  # Simulate consumption time

# Create and start producer and consumer threads
producer = Producer(name='Producer')
consumer = Consumer(name='Consumer')

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

# Create an event object
event = threading.Event()

# Thread waiting for the event
def waiter(event):
    print("Waiter thread: waiting for event")
    event.wait()
    print("Waiter thread: event occurred, continuing execution")

# Thread triggering the event
def trigger(event):
    print("Trigger thread: processing some tasks")
    time.sleep(2)  # Simulate some work
    print("Trigger thread: work complete, triggering event")
    event.set()

# Create and start threads
waiter_thread = threading.Thread(target=waiter, args=(event,))
trigger_thread = threading.Thread(target=trigger, args=(event,))

waiter_thread.start()
trigger_thread.start()

waiter_thread.join()
trigger_thread.join()

print("Main program ended")
```

Here, `waiter_thread` blocks at `event.wait()`. Once `trigger_thread` completes its work and calls `event.set()`, the flag becomes true, allowing the waiter thread to resume instantly.

## Deadlock

A **deadlock** occurs when two or more threads are permanently blocked, each waiting for a lock held by another thread in the group.

Below is a simple example of a deadlock:

```python
import threading

# Create two locks
lock1 = threading.Lock()
lock2 = threading.Lock()

def worker1():
    with lock1:
        print("Thread 1 acquired lock 1")
        with lock2:
            print("Thread 1 acquired lock 2")

def worker2():
    with lock2:
        print("Thread 2 acquired lock 2")
        with lock1:
            print("Thread 2 acquired lock 1")

# Create and start threads
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
        print("Thread 1 acquired lock 1")
        with lock2:
            print("Thread 1 acquired lock 2")

def worker2():
    with lock1:  # Modified here
        print("Thread 2 acquired lock 1")
        with lock2:
            print("Thread 2 acquired lock 2")
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

# Test
num = 48758440894340
print(prime_factors(num))  # Output: [2, 2, 5, 17, 143407179101]
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
        # Split the number range based on the number of threads
        start = numbers[i * step]
        if i == num_threads - 1:
            end = numbers.stop
        else:
            end = numbers[(i + 1) * step]
        # Create and start thread
        t = threading.Thread(target=threaded_prime_factors, args=(start, end))
        threads.append(t)
        t.start()

    # Wait for all threads to complete
    for t in threads:
        t.join()

    end_time = time.time()
    print(f"Execution time: {end_time - start_time:.6f} seconds")

if __name__ == "__main__":
    main()
```

Running the multithreaded version took 19.9 seconds. Despite spawning 72 threads, there is virtually no performance improvement.

This limitation is due to Python's **Global Interpreter Lock (GIL)**. In CPython (the standard Python implementation), the interpreter is not thread-safe. To protect the integrity of internal objects, the GIL ensures that **only one thread can execute Python bytecode at a time**.

Because of the GIL, multithreading cannot speed up CPU-bound calculations in Python. It remains useful for concurrent I/O operations (where threads release the GIL while waiting for network packets or disk data). However, for I/O concurrency, `asyncio` is generally preferred over raw threads today.

To utilize multiple CPU cores for parallel calculations in Python, you must bypass the GIL by using [multiprocessing](multiprocess).
