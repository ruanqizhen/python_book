# 生成器

在介绍循环的时候，曾经提到[迭代器](loop#可迭代对象和迭代器)。迭代器允许程序员遍历列表、字典等数据容器中的所有元素。迭代器有两种主要实现方法，一种依赖面向对象的编程方式，我们将在[使用面向对象的编程方式实现迭代器](iterator)一节详细介绍；另一种实现方式是，我们将在这一节着重介绍的生成器 （Generator）。生成器是一种高效的创建迭代器的方式，而且它允许我们按需生成数据，而不是一次性生成并存储所有数据。创建生成器有两种主要的方法：生成器函数和生成器表达式。

## 生成器函数

定义一个函数，如果函数体中使用了 yield 关键字返回生成的数据，那么这个函数不会返回一个常规的值，而是会返回一个生成器对象。换句话说，任何包含 yield 的函数都被称为生成器函数。这个函数在被调用时，返回一个生成器对象，但不会立即执行函数体内的代码。只有每次针对生成器对象调用 next() 函数时，生成器函数才会执行到下一个 yield 语句，返回相应的值，然后暂停执行，直到再次调用 next() 函数。比如：

```python
def count_up_to(n):
    count = 0
    while count < n:
        yield count
        count += 1

counter = count_up_to(5)
print(counter)           # 输出: <generator object count_up_to at 0xXXXXXXXX>
print(next(counter))     # 输出: 0
print(next(counter))     # 输出: 1
print(next(counter))     # 输出: 2
print(next(counter))     # 输出: 3
print(next(counter))     # 输出: 4
# print(next(counter))     # 已经到头，再调用 next 会产生 StopIteration 异常
```

一个函数只要包含了 yield 语句，它就成了生成器函数。所以上面程序中的 count_up_to 函数是一个生成器。调用这个生成器函数时，它不会立即执行，而是返回了一个生成器对象。生成器是惰性求值的，也就是说，数据是按需生成的。每次需要数据时，可以使用 next() 函数调用生成器对象。这时，生成器函数内的代码才会被执行。当运行到 yield 语句时，生成器函数返回 yield 后面的值。然后生成器函数保存的当前状态，包括所有局部变量的值，并且暂停执行，直到下一次数据请求发生。如果生成器函数已经运行结束，不会再运行到 yield 语句了，那么调用 next() 函数时，它就会抛出一个 StopIteration 异常。

初次设计生成器函数的时候可能会有些无从下手。一个帮助理清思路的小技巧是：先写一个函数，把要生成的数据都打印出来，比如要打印一个正整数数列，程序是：

```python
def count_up_to(n):
    count = 0
    while count < n:
        print(count)
        count += 1
```
然后，把所有 print() 函数都换成 yield 语句，就是一个生成器函数了。

实际应用中，直接调用 next() 函数的情况比较少，更多的会是使用循环，或者推导式迭代生成器对象。比如下面的示例，它是一个[斐波那契数列](recursive#计算斐波纳契数列)的生成器，在循环中迭代这个生成器对象，每次会得到一个斐波那契数：

```python
# 斐波那契数列生成器
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

for num in fibonacci(5):
    print(num)
    
# 输出： 0  1  1  2  3
```

如果我们不用生成器，而是采用循环直接生成一个斐波那契数的列表，功能上可以与上面的程序是完全相同：

```python
# 直接返回斐波那契数列表
def fibonacci(n):
    a, b = 0, 1
    result = []           # 初始化一个空列表
    for _ in range(n):
        result.append(a)  # 将值添加到列表中
        a, b = b, a + b
    return result         # 返回列表

for num in fibonacci(5):
    print(num)
    
# 输出： 0  1  1  2  3
```

上面两段程序的区别在于效率。假设我们需要很大量的数据，比如生成一千万个斐波那契数。直接返回列表的方式，要等全部数据都生成好之后，才能返回，返回时间会延长。而且这些数据要一次性装入内存，内存占用过大。如果要求更大量的数据，可能内存都无法容纳。而对于生成器来说，它每产生一个数据就会返回一个数据，处理这个数据的代码段无需等待，就可以立刻运行处理当前的数据了。而且每次内存中只需要装入正在处理的数据，不需要装入数列中其它的数据，极大降低了内存占用。

生成器只能迭代一次。一旦生成器函数已经执行到结尾并引发了 StopIteration。如果再次需要这些数据，就必须重新创建生成器对象，然后重新迭代。

## 惰性生成

生成器是惰性生成结果的，这表示数据是在实际需要时才生成的，而不是一开始就生成所有可能的数据。这种方法可以显著减少内存使用，特别是在处理大型数据集时。比如在下面这个示例中：

```python
def count_up():
    count = 0
    while True:
        yield count
        count += 1

it = count_up()
for i in range(10):
    print(next(it))
```

count_up 是一个生成器函数，它有一个无限循环。但是程序并不会运行无限次，因为，只有在程序中调用 next() 时，它才会执行一次。程序中的
for 循环运行 10 次，每次调用 next(it)，这个 for 循环实际上限制了生成器生成值的次数，只生成 10 个值。

要特别注意的是，调用这样的生成器一定要限制次数，否则它们真的会运行无数次。有些操作可能会在无意间，忘记了限制调用次数。比如把生成器作为参数传递给支持不定数量参数的函数：

```python
def count_up():
    count = 0
    while True:
        yield count
        count += 1

print(*count_up())
```

在上面的程序中， `print(*count_up())` 会打印生成器生成的所有值。星号 `*` 操作符会尝试解包生成器能生成的所有的值，对于一个无限生成器来说，会无限制地尝试生成值，程序会因此出现内存不足的错误。

如果生成器本身有运行次数限制，则可以避免上述的问题：

```python
def count_up_to(n):
    count = 0
    while count < n:
        yield count
        count += 1
        
print(*count_up_to(10))
```


## 嵌套生成器

我们可以使用 yield from 语句，在生成器函数中，直接输出另一个生成器产生的值。或者说，yield from 语句可以把其它生成器或可迭代对象产生的值，当做它自己的生成器的输出。比如，我们已经有了两个简单的生成器： generator1 和 generator2。现在又需要创建一个新的生成器，它首先迭代 generator1 生成的所有的值，输出，然后再迭代 generator2 生成的所有的值，输出。那么，在新的迭代器中，可以不必迭代已有的生成器，而是使用 yield from 直接使用它们的结果：

```python
def generator1():
    for i in range(5):
        yield i

def generator2():
    for i in range(5, 10):
        yield i

def combined_generator():
    yield from generator1()
    yield from generator2()

for value in combined_generator():
    print(value)
   
# 输出打印从 0 到 9 的数字。  
```

yield from 在处理嵌套生成器时非常有用。例如，假设我们有一个列表的列表，需要编写一个生成器来平铺它，即逐个生成嵌套列表中的元素。不使用 yield from 可以这样写：

```python
def flatten(nested_list):
    for sublist in nested_list:
        for item in sublist:
            yield item

nested_list = [[1, 2, 3], [4, 5], [6]]
for num in flatten(nested_list):
    print(num)
```    
    
使用 yield from 可以使用更简洁的代码，完成同样的功能：

```python
def flatten(nested_list):
    for sublist in nested_list:
        yield from sublist

nested_list = [[1, 2, 3], [4, 5], [6]]
for num in flatten(nested_list):
    print(num)
```    
    
    
## 接收数据

生成器不但可以生产数据，还可以接收并处理外部的数据。在生成器函数内， yield 表达式可以产生一个返回值，用于表示从外面接收到的数据。在生成器函数外，通过调用生成器对象的 send() 方法，向生成器发送数据。发送的这个数据就会成为 yield 表达式的返回值。

下面是一个示例：

```python
def my_generator():
    print("开始执行生成器")
    received = yield "*** 产生第一个数据"
    yield f"*** 产生第二个数据，接收到的值：{received}"

# 创建生成器对象
gen = my_generator()

# 启动生成器并获取第一个 `yield` 的值
value = next(gen) 
print(value)

# 向生成器发送数据，并获取下一个 `yield` 的值
value = gen.send("Hello")
print(value)
```

上面的程序中，首先创建生成器，当程序调用 next() 函数时，生成器打印 "开始执行生成器"，然后生成第一个数据。然后生成器闲置，直到程序调用生成器对象的 send() 方法发送字符串 "Hello" 到生成器，该字符串被赋给变量 received，然后生成器继续执行，产生第二个数据。

需要注意的是，生成器每个 yield 语句获取的数据，可以为之后的代码使用，但是生成器的第一个 yield 是无法接收数据的。所以，产生第一个数据，只能调用 next(gen) 或者 gen.send(None) 。之后的 yield 语句，则可以得到 send() 方法中传递的真正的数据。

如果生成器执行结束或者抛出异常，再对其使用 send() 将会抛出 StopIteration 异常，与使用 next() 函数的行为是一致的。


下面是一个更复杂一些的示例，它每次可以接收一行文本。根据发送的命令（如计数单词、搜索特定单词等）执行不同的操作：

```python
def text_processor():
    search_counter = 0
    while True:
        received = yield
        command, data = received if received else ('', '')

        if command == 'count':
            words = data.split()
            word_count = len(words)
            print(f"Word Count: {word_count}")

        elif command == 'search':
            search_counter += 1
            keyword, text = data
            if keyword in text:
                print(f"'{keyword}' found in text.")
            else:
                print(f"'{keyword}' not found in text.")

# 创建生成器协程
processor = text_processor()

# 启动协程
next(processor)

# 发送数据进行单词计数
processor.send(('count', "Hello world, this is a test."))

# 发送数据进行关键词搜索
processor.send(('search', ('Hello', "Hello world, this is a test.")))

# 再次进行关键词搜索
processor.send(('search', ('test', "Just another test.")))

# 程序运行输出：
# Word Count: 6
# 'Hello' found in text.
# 'test' found in text.
```

这段代码使用生成器对传入数据做处理，如果不使用生成器，而是使用普通函数，也可以实现相似的功能。但是相比于使用普通函数实现，生成器有一些明显优势。比如，它可以保持状态，生成器函数运行后，可以不用推出，平时处于闲置，需要时运行，这样它就可以一直保持内部的一些状态，比如上面例子中，生成器函数内部有一个 search_counter ，始终记录着搜索的次数。一些更复杂的应用场合下，我们可以利用生成器的这一特性记录打开的网络连接，记录交互的上下文等等。生成器在闲置时不耗用系统资源，非常适合长时间运行的任务。


下面是一个更为复杂的示例，它包含了两个生成器，两个生成器之间通过 yield 和 send() 相互传递数据：

```python
def generator_1(target):
    while True:
        # 接收外部发送的数据
        received = yield
        print(f"【调试】 生成器 1 接收到外部数据： {received}")

        # 发送数据到 generator_2 并接收回应
        sent = f"{received} from Generator 1"
        response = target.send(sent)
        print(f"【调试】 生成器 1 接收到生成器 2 的返回数据：  {response}")

def generator_2():
    while True:
        # 接收来自 generator_1 的数据
        received = yield
        print(f"【调试】 生成器 2 接收到数据：  {received}")

        # 发送回应到 generator_1
        sent = f"{received} from Generator 2"
        yield sent

# 创建生成器
gen2 = generator_2()
gen1 = generator_1(gen2)

# 初始化生成器
next(gen2)
next(gen1)

# 开始相互发送数据
gen1.send("豆豆")
```

程序运行结果如下：

```
【调试】 生成器 1 接收到外部数据： 豆豆
【调试】 生成器 2 接收到数据：  豆豆 from Generator 1
【调试】 生成器 1 接收到生成器 2 的返回数据：  豆豆 from Generator 1 from Generator 2
```

可以看到数据在两个生成器之间来回传递，并且每次追加了一些新信息。读者可能也注意到了，在上面示例中的两个生成器函数可以交替运行：一个函数运行一段时间，暂停，让另一个函数运行一段时间，再切换回来。在 Python 支持[异步函数](asyncio)之前，它就是利用了生成器的这一特性，来支持并发任务的，让多个任务交替运行，最大限度利用系统资源。但它在这方面的用途已经完全被更加直观和易于理解的异步函数取代了。


## 生成器表达式

生成器表达式以紧凑的方式创建生成器。从形式上看，生成器表达式与列表推导式非常相似，区别仅在于生成器表达式使用圆括号 `()` 而不是方括号 `[]`。但生成器表达式返回的是一个生成器对象，而不是一个列表。正因如此，生成器表达式相比列表推导式，有更高的内存效率。

假设我们想要得到一个包含平方数的生成器，我们可以使用以下的生成器表达式：

```python
squared = (x*x for x in range(10))

for num in squared:
    print(num)
```

上文，我们曾经使用列表推导式创建一个列表，其中包含 0 到 9 的平方，它的表达式与上面的代码几乎相同，只有括号不一样。

再添加一个示例，比如我们需要从一个列表中选出长度大于 2 的字符串，然后将将这些字符串转换为大写，可以编写程序如下：

```python
words = ["a", "be", "dog", "python", "ai", "hello", "world"]
result = (word.upper() for word in words if len(word) > 2)

for word in result:
    print(word)
```


## 生成器或列表

当我们编写的函数需要返回一组数据的时候，我们就面临两个选择，一是让函数直接返回一个列表，二是把函数写成一个生成器（包括生成器函数和生成器表达式）。我们需要根据具体的情况来判断哪个选择更优：

* 如果返回的数据会通过索引被随机读取，那么应该使用列表；生成器只能顺序产生数据
* 如果产生的数据量很大，那么应该使用生成器，因为它是惰性求值的，只有在需要时才生成数据，能够尽可能减小内存占用，提高程序性能；列表只适用于少量数据的情况
* 如果不确定程序最终会用到多少产生的数据，也适合使用生成器，因为如果使用列表一次返回所有数据，其中很多数据可能不会被用到

一个比较常见的情景是从外部设备读取数据进行处理，如果数据量太大，可能会导致大量的内存占用甚至内存溢出。如果使用生成器，每次只处理一行数据，或一个数据块，进程处理。之后再读取下一块进行处理，这样可以显著降低内存使用。

还要注意的是：生成器、生成器表达式都是单次使用的，生成器只能迭代一次。如果需要多次迭代相同的数据，那么每次都需要重新创建生成器。

