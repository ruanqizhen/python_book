# 递归

递归是一种常见的算法，指函数直接或间接地调用自身。递归可以解决的问题通常可以被分解为相似的子问题。这些子问题的结构与原始问题相似，但规模较小。
在数学学习中，归纳法是一种常见的方法，递归可以看作是归纳法的程序化实现。递归的策略是把一个大的复杂的问题转换为一个小的和原问题相似的问题，再进一步把问题拆成更小的问题，最终解决整个问题。理论上，所有递归调用都可以用循环结构替代。但在某些情况下，递归调用确实能显著降低代码的复杂性，有助于缩短编程时间、提高程序可读性。所以，学会如何实现递归还是很有用的。

## 计算阶乘

下面看一个最简单的例子：计算阶乘。计算某个正整数的阶乘就是用那个数去乘所有比它小的正整数。比如 3 的阶乘写作 `3! = 3*2*1`；类似的 `6! = 6*5*4*3*2*1`。如果用循环来计算 n 的阶乘，就是把所有小于 n 的正整数乘起来就行了：

```python
def factorial(n):
    result = 1
    for i in range(1, n+1):
        result *= i
    return result

print(factorial(5))  # 输出：120
```

但是我们还可以换一种方法来考虑如何计算阶乘：我们不是直接从原始的数据开始计算，而是用归纳的方法，一步一步地来简化问题，比如 6 的阶乘，它可以通过先计算 5 的阶乘，再把结果乘以 6。用公式来描述就是 $0! = 1, \quad n! = n \times (n-1)! \quad \text{for } n \geq 1$，或者写成函数的形式为：$F(0) = 1, \quad F(n) = n \times F(n-1) \quad \text{for } n \geq 1$。数学归纳法中一定要有一个基本情况，对于阶乘的问题，基本情况是 0，0 的阶乘等于 1，这是人为定义出来的。有的读者可能已经注意到了，用归纳法表示的阶乘与直接计算阶乘不是完全一模一样，归纳法把阶乘计算推广到了所有非负整数，而直接计算，只能计算正整数的阶乘。这算是归纳法的一个小优势吧。

以下是使用递归实现的阶乘函数：

```python
def factorial(n):
    # 基线条件
    if n == 0:
        return 1
    # 递归条件
    else:
        return n * factorial(n-1)

print(factorial(5))  # 输出：120
```

设计递归算法的时候，一定要明确两个条件：
* 基线条件（Base Case）：每个递归函数都需要有一个或多个基线条件。当满足基线条件时，函数将直接返回一个值而不再递归调用自身。
* 递归条件（Recursive Case）：这是函数将继续调用自己的部分，通常在处理规模减小或更接近基线条件的问题时。

在上面例子中，当 n 为 0 时，函数直接返回 1 （基线条件）。否则，函数会递归地调用自己来计算n-1的阶乘，并将结果与n相乘。

## 计算斐波纳契数列

阶乘这个问题过于简单，还不能完全体现递归的优势。我们可以再考虑一个稍微更复杂一点的问题：斐波纳契数列。
这个问题是意大利人斐波纳契在描述兔子繁殖的数量时用到的:
* 第一个月初有一对刚诞生的兔子
* 第二个月之后（第三个月初）它们可以生育
* 每月每对可生育的兔子会诞生下一对新兔子
* 兔子永不死去

每个月兔子的总数量用数学归纳法来描述就是：

$$
\begin{aligned}
F(0) &= 0 \\
F(1) &= 1 \\
F(n) &= F(n-1) + F(n-2), \quad \text{for } n \geq 2
\end{aligned}
$$

这个问题的数学归纳法公式简洁明了，非常适合用递归算法来解决。首先，还先编写归纳法的基本情况，也就是递归的结束条件，当输入为 0 和 1 时，分别输出 0 和 1：

```python
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)

# 测试
n = 10
for i in range(n):
    print(fibonacci(i), end=" ")
```

运行上面的代码将打印斐波纳契数列的前10个数字：0, 1, 1, 2, 3, 5, 8, 13, 21, 34。 读者可以用一个不大于 20 的输入数据试验一下，看结果是否正确。但是千万不要尝试太大的输入数据（大于 30），因为上面这个算法，它的功能上虽然正确，效率上却存在巨大缺陷，当输入数据大于 30 的时候，它的运算会非常非常耗时。我们分析一下上图程序的运行过程，假如输入数值为 20，程序会递归调用两次，分别计算两个子问题：
* 首先计算 19 的斐波纳契数，在其内部，程序又会进行两次递归调用，一次去计算 18 的斐波纳契数……；
* 然后计算 18 的斐波纳契数，可是 18 的斐波纳契数已经在上面那个递归调用的分支里计算过了啊，现在又要重复计算一遍！

我们可以把上述的调用关系用一棵二叉树来表示：

![images/006.png](images/006.png "递归调用树")

这样的算法，输入值每增加 1，程序的计算量就要翻倍。也就是程序的运算量与输入数据的大小呈指数关系，时间复杂度： $O(2^n)$。这是编写递归程序时比较容易出现的一个效率问题：同样的计算，在不同的地方被运行了很多次。

下面我们讨论几条解决这个效率问题的思路。

### 带缓存的递归

既然低效率是由于同样的计算被运行多次引起的，那么一个最直接简单的解决方案是：把每次运算的结果记录下来，如果之后再遇到同样的计算，就直接把记录的结果拿来用，不再重新计算了。具体的实现方法可以是：在程序里设置一段缓存，每次进入递归函数时先查看一下，需要计算的数据是不是已经有结果记录在缓存里了，如果有，那么直接从缓存中拿出之前记录的结果；如果缓存中没有想要的结果，再进行计算，然后把计算的结果记录在缓存里。因为程序在计算每一个值之前，都先到缓存里查一下，这就避免了重复计算。

缓存可以使用任何数据结构来构建，比如我们可以把计算结果暂时保存在一个字典里。下图是添加了缓存的计算斐波纳契数的程序：

```python
cache = {}

def fibonacci(n):
    if n in cache:
        return cache[n]
    if n <= 1:
        return n
    else:
        result =  fibonacci(n - 1) + fibonacci(n - 2)
        cache[n] = result
        return result

# 测试
n = 38
for i in range(n):
    print(fibonacci(i), end=" ")
```

它与不带缓存的基本递归算法是完全一致的。唯一的改变在于，在真正开始计算前，先查看要计算的数据是否已经在缓存中了。如果是，则直接返回从缓存中取回结果。如果缓存中没有，那么进行递归计算，但是在输出结果之前，先把运算的结果插入到缓存里。

经过效率改进后，程序能够计算较大数值的斐波纳契数。为某些运算量巨大的函数添加缓存是个非常常见的策略，我们甚至不需要自己来编写缓存逻辑，有一些现成的方法可以采用，比如使用[可以缓存函数的结果的装饰器](decorator#缓存函数的结果)。

### 避免树形递归

另一个提高效率的思路是：保证每计算一个步，只递归调用本身一次，这样也可以避免重复计算。具体方法如下：在计算第 n 步的时候，我们需要把第 n-1 步和第 n-2 的结果加起来。但是第 n-2 的结果在计算第 n-1 结果时也用到了。就是说，每一个结果会被后面的两次计算用到，所以只要把这个结果作为函数的输出，传递给后面两次运算就好了。

使用这个思路来编写程序，程序有两个输入 a 和 b 分别记录前两次的运算结果。当输入 n 为 0 时，也就是递归的结束条件，把 b 的值返回：

```python
def fibonacci(n, a, b):
    if n <= 0:
        return b
    else:
        return fibonacci(n - 1, a + b, a)

# 测试
n = 10
for i in range(n):
    print(fibonacci(i, 1, 0), end=" ")
```

使用这种递归算法，优点是提高了运算效率，缺点是它的算法并不是直接对应与斐波纳契数的数学归纳法的描述，理解起来不那么直观。程序员有时需要在运行效率与可读性之间进行权衡。

### 斐波纳契数的计算公式

本节内容使用了斐波纳契数作为讲解递归算法的一个示例。但是，如果我们只考虑斐波纳契数本身的话，它并非必须使用递归来计算。比如，也可以使用循环进行计算：求 n 的斐波纳契数，可以从小到大计算，先算出 0 的斐波纳契数，再计算 1 的斐波纳契数，再计算 2 的斐波纳契数…… 循环迭代 n 次，得到 n 的斐波纳契数。但是，最高效的算法是使用斐波纳契数的公式直接计算，公式是：

$F(n) = \frac{{\varphi^n - (1 - \varphi)^n}}{{\sqrt{5}}}$ ，   其中，$\varphi$ 是黄金分割比，其值为 $\frac{{1 + \sqrt{5}}}{{2}}$。

```python
import math

def fibonacci(n):
    phi = (1 + math.sqrt(5)) / 2
    fib_n = round((phi**n - (1 - phi)**n) / math.sqrt(5))
    return fib_n

n = 10
for i in range(n):
    print(fibonacci(i), end=" ")
```

### 1/89

既然讲到了斐波纳契数，就在说一个有趣的题外话。89 是第十二个斐波纳契数，它的倒数 1/89 也与斐波纳契数关系密切，因为把它写成小数形式后，它的小数位恰好就是斐波纳契数列：

1/89 = 0.011235....

这只是巧合吗，还是二者确实存在着某种联系，感兴趣的读者可自行推导验证。

## 间接递归调用

间接递归调用涉及两个或多个函数相互调用。以下是一个简单的例子，其中有两个函数 functionA 和 functionB，它们相互调用以实现间接递归：

```python
def functionA(n):
    if n <= 0:
        return
    print(f"From functionA: {n}")
    functionB(n-1)

def functionB(n):
    if n <= 0:
        return
    print(f"From functionB: {n}")
    functionA(n-2) # 减少2来确保我们最终能够退出递归

# 调用函数
functionA(10)
```

在上述示例中，functionA 调用 functionB，而 functionB 再次调用 functionA，直到 n 达到或小于 0 时停止。

接下来介绍一个稍复杂的示例，编写程序解析四则运算表达式。作为示例，我们简化了问题难度：

* 四则表达式中的数据只能是正整数
* 运算符只有加减乘除
* 可以使用括号
* 表达式必须正确，且没有空格等其它符号

比如，程序需要运算 `30+8*(13-5)/6` 这样的表达式。我们可以考虑使用递归的算法：

```python
# 处理加法和减法
def process_add_sub(s):
    # 先要考虑是否要计算优先级更高的乘除法
    value, pos = process_mul_div(s)
    # 如果位置未到字符串末尾，且当前字符是加号或减号
    while pos < len(s) and (s[pos] == '+' or s[pos] == '-'):
        # 解析下一个由乘除法组成的子表达式
        next_value, next_pos = process_mul_div(s[pos+1:])
        # 根据加号或减号进行操作
        value = value + next_value if s[pos] == '+' else value - next_value
        pos += next_pos + 1
    return value, pos

# 处理乘法和除法
def process_mul_div(s):
    # 先解析数字，以及处理优先级更高的括号
    value, pos = process_number(s)
    # 如果位置未到字符串末尾，且当前字符是乘号或除号
    while pos < len(s) and (s[pos] == '*' or s[pos] == '/'):
        # 解析下一个数字，或括号
        next_value, next_pos = process_number(s[pos+1:])
        # 根据乘号或除号进行操作
        value = value * next_value if s[pos] == '*' else value / next_value
        pos += next_pos + 1
    return value, pos

# 处理数字和括号
def process_number(s):
    # 如果当前字符是数字
    if s[0].isdigit():
        i = 1
        while i < len(s) and s[i].isdigit():
            i += 1
        return int(s[0:i]), i
    # 如果当前字符是左括号
    if s[0] == '(':
        # 解析一个表达式直到遇到右括号
        value, pos = process_add_sub(s[1:])
        return value, pos + 2  # 跳过右括号
    # 如果不是数字或括号，继续解析为一个子表达式
    return process_add_sub(s)

# 解析并计算四则运算表达式
def parse_and_eval(s):
    value, _ = process_add_sub(s)
    return value

# 测试
expr = "3+5*2"
print(parse_and_eval(expr))  # 输出 13，因为 5*2 是先计算的

expr = "(3+5)*2"
print(parse_and_eval(expr))  # 输出 16，因为 (3+5) 是先计算的
```

上面的程序采用了一种自顶向下的解析方法，通过使用一组递归的函数来实现，其中每个函数负责处理一种运算符或数据。
* 函数 parse_and_eval() 用于解析并计算整个表达式。它调用 process_add_sub() 函数来处理整个表达式，并返回最终的计算结果。
* 函数 process_add_sub() 调用函数 process_mul_div() 去处理高优先级的运算，并将其结果相加或相减；
* 函数 process_mul_div() 调用函数 process_number() 去处理数字和括号，并将其结果相乘或相除；
* 函数 process_number() 在处理完当前数据后，又调用函数 process_add_sub()去处理后续的字符，由此构成了递归调用。


## 递归与循环的比较

任何使用递归实现的逻辑都可以转换成循环，反之亦然，任何使用循环实现的逻辑都可以转换成递归。正因如此，某些编程语言（尤其是纯函数式编程语言）中没有循环结构；而另一些编程语言是没有递归的，比如一些早期版本的 Basic 语言。那么，我们在编程的时候，是应该选择循环，还是递归呢？

两者相比，循环的最大优点是效率高。对于大多数现代编程语言（包括 Python），循环通常比递归更高效，因为它们不需要为每次迭代创建新的堆栈帧。对于性能要求高的程序，首先考虑使用循环实现。
其次，循环不受迭代次数限制，但递归的深度是有限制的。比如上文实现的计算阶乘的递归算法，是无法计算一个大数（大于 1000）的阶乘的值的。有些版本的 Python 编译器不支持尾递归优化，即便把递归方式换成尾递归，也可能会遇到堆栈溢出的错误。所以，对于迭代或递归次数较大的算法，必须用循环实现。

递归最大的优点是直观、简洁。有些问题天然地适合递归解决，比如数据的排列组合、树和图的遍历、分治算法等等，这类问题最好是使用递归解决。


## 练习

**使用递归算法**编写下面的程序：

1. 数组求和：计算一个实数列表中所有数据的和。
1. 列表中最大值：找出列表中的最大元素。例如，输入 `[1, 4, 2, 9, 7]`，输出 9。
1. 检查回文：检查一个字符串是否为回文。例如，输入 "radar"，输出 True；输入 "hello"，输出 False。
1. 列表反转：把一个列表中的数据反向排列。
1. 幂计算：仅使用加减乘除四种基本数学运算，计算 x 的 n 次幂（n 为整数）。
1. 最大公约数（GCD）：使用辗转相除法（也叫欧几里得算法）计算两个正整数的最大公约数。算法为：两个整数 a 和 b 的 GCD 等于 b 和 a%b 的 GCD。
1. 排列组合：给定一组无重复的数据，输出这些数据所有的排列组合。例如，输入 `[1, 2, 3]`，输出：`[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]`。
1. 数组扁平化：给定一个嵌套列表，使用递归将其扁平化。例如，输入 `[1, [2, [3, 4]], 5]`，输出 `[1, 2, 3, 4, 5]`。
1. 棋盘路径计数：计算从棋盘左上角移动到右下角的不同路径数量，每次只能向右或向下移动。例如，给定 3x3 的棋盘，路径总数为 6。
1. 括号生成：生成所有可能的括号组合。例如，输入 n=3，输出：`["((()))", "(()())", "(())()", "()(())", "()()()"]`。
1. 汉诺塔：编写程序解决经典的汉诺塔游戏。汉诺塔游戏的玩法如下：有三根柱子和若干个大小不一的圆盘，圆盘按大小顺序依次套在第一根柱子上。游戏的目标是将所有圆盘从第一根柱子移动到第三根柱子上。游戏有一些限制：
   a. 在任何时刻，任何一个柱子上，都必须保证较小的圆盘在较大的圆盘上面。也就是每个柱子上的圆盘都是排序的。
   b. 每次只能移动一个圆盘，把一个圆盘从一个柱子移动到另一个柱子上。
1. 八皇后问题：找到所有可能的放置八个皇后在 8x8 棋盘上的方法，使得任何两个皇后不在同一行、同一列或同一对角线上。
1. 迷宫路径搜索：给定一个二维迷宫，使用递归找到从起点到终点的路径。
