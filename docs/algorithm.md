# 简单算法和数据结构

著名的图灵奖获得者、Pascal 编程语言发明人 Nicklaus Wirth 提出了一个公式：`程序 = 算法 + 数据结构`。数据结构研究的是如何针对特定问题找到最适合的数据的组织方式，而算法研究的是找到解决该问题的最优化方法和步骤。二者加在一起就是程序，这句话虽然不全面，但基本上揭示了程序的核心本质。在程序员求职面试时，最常被问到的问题也是关于算法和数据结构的。


算法和数据结构作为编程的两大基石，分别都可以开一门整学期的课程来学习。在这里，由于篇幅有限，我们只能讨论一些初级的算法和数据结构。最主要目的还是提供一些 Python 编程的示例。

## 时间复杂度

首先要介绍一下衡量一个算法效率的指标：算法复杂度。算法复杂度分为时间复杂度和空间复杂度。时间复杂度表示执行一个算法所需工作量的多少，这直接决定了算法运行时间的快慢。空间复杂度表示指执行这个算法需要多少内存空间。从目前的情况来看，提升 CPU 性能的成本远高于增加内存容量的成本，所以多数情况下，大家更关心时间复杂度。

时间复杂度是一个函数，时间复杂度高，表示输入数据增加一小点，算法工作量就要增加很多倍；反之，低时间复杂度的算法，在输入增加很多的情况下，所需工作量却不会增加太多。时间复杂度跟要解决的问题有关：有的问题可以被非常高效的解决，而有的问题根本没有低时间复杂度的解决方法。所以，只有对比同一个问题的不同算法的时间复杂度才有意义。

时间复杂度函数用大写字母 O 表示；同时用一个小写字母，比如 n，表示算法要处理的数据量。

* 如果一个算法，不论输入数据量 n 有多大，都一定会在某个固定的时间内运行完，就表明这个算法的运行时间是常数级别的，记作 $O(1)$
* 如果一个算法的运行时间与输入的数据量呈线性关系，比如，输入数据个数是 n 运行时间是 c*n，c 是一个常数，那么就表明这个算法的时间复杂度是线性的，记作 $O(n)$
* 如果一个算法的运行时间与输入数据量的平方成正比，那么算法的时间复杂度就是 $O(n^2)$;同理，如果运行时间与输入数据量的三次方成正比，那么时间复杂度就是 $O(n^3)$ ……


### 一些示例

#### 线性时间 

```python
def linear_time(arr):
    for item in arr:
        print(item)

arr = [1, 2, 3, 4, 5]
linear_time(arr)
```

在上述代码中，linear_time 函数遍历数组中的每一个元素，所以它的时间复杂度是线性的，即 $O(n)$，n 表示元素个数。

#### 二次时间 
 
```python
def quadratic_time(arr):
    for i in arr:
        for j in arr:
            print(i, j)

arr = [1, 2, 3, 4, 5]
quadratic_time(arr)
```

此函数包含两个嵌套的循环，因此时间复杂度是 $O(n^2)$。

上面这些被统称为多项式级别的时间复杂度。如果一个算法的时间复杂度是多项式级别的，基本上还可以用来解决实际问题。如果一个算法的时间复杂度超过这个级别，比如是阶乘级别的 $O(n!)$。计算阶乘时候，输入的是一个数，而不是数组，所以这里的 n 表示的不是输入数据的个数，而是输入数据的大小。

还有指数级别的 $O(2^n)$，甚至更高的时间复杂度的算法。这些算法就已经很难用于解决实际问题了。我们曾经介绍过一个时间复杂度为 $O(2^n)$ 的[斐波那契数算法](recursive#计算斐波纳契数列)，这种复杂度下，普通计算机最多也只能解决输入值小于 30 的问题。当然，即便都是多项式级别的，我们也希望为需要解决的问题找到一个复杂度最低的算法。

## 判断素数
下面我们研究一下质因数分解算法的时间复杂度。如果有一个数 n，我们知道它一定是两个素数（质数）的乘积，但不知道是哪两个素数，那么对 n 进行质因数分解的时间复杂度是多少？

用一些具体的数字来演示可能会更清楚： 假如有两个素数是 17 和 19，相乘可以得到 $17 * 19 = 323$。对于计算机来说，把两个值较大的数相乘和把两个值较小的数相乘所需时间几乎没有差别，可以被看作是一个常数，所以乘法运算的复杂度是常数级别的 $O(1)$。但是反过来，把 323 质因数分解，可就没那么容易了。我们只能从最小的素数开始一个一个试。比如先试试 323 能不能被 2 整除，如果不行再试 3，一直试到 17，才终于找到答案。最差的情况是，n 是两个相同的素数的乘积，那么就要查找 $\sqrt{n}$ 次，假设乘法除法的运算量是一个级别的（实际上除法慢的多），那么因数分解 n 的时间复杂度就是 $O(\sqrt{n})$。

这个程序还可以进一步优化一下，比如，可以忽略掉那些明显的不是素数（比如偶数等）的因数等。优化后的程序运行速度可以快一些，但它的复杂度依然还是 $O(\sqrt{n})$  级别的，比两个素数相乘的复杂度高得多。其实，$O(\sqrt{n})$ 在常见算法里算是非常低的时间复杂度了，但即便如此，它也无法处理特别大的输入。假如，两个素数都大于 $10^{10}$，那么，用普通计算机对它们的乘积做质因数分解，就会因为所需时间太长而失去实际意义了。一个运算和它的反运算的时间复杂度相差巨大，在计算机领域是有实际用途的。比如，可以用于信息的加密解密。被广泛使用的 RSA 加密算法就利用了把素数相乘远远快于把合数分解成质因数这一特性。简化说来，加解密过程是这样的：用户 A 和 B 通过互联网通信，它们之间传递的所有数据（包括加密算法，密钥）都会被监听者 C 截获。A 需要 B 发送给自己一些隐私消息，不能让 C 看懂。于是，A 先找到两个大的素数，然后把两个素数相乘的乘积作为 RSA 算法的密钥交给 B，B 使用这个密钥把消息加密后再传递给 A。RSA 算法加密只需要这个合数作为密钥，但解密过程必须使用原来的两个素数。A 当然保留了原来的两个素数，但 C 并没有。如果 C 想要解密，必须对密钥合数进行质因数分解，而质因数分解是个相对较慢的过程，只要 A 找到的两个素数够大，C 就不可能在有效时间内算出两个素数。这样，传递的信息就达到了加密的效果。

这个加密方法非常巧妙。但还有一个问题：A 去哪找两个这么大的素数？A 不能从已知的素数表里选取，因为 C 可能会获得同样的一张表。如果 A 随机产生出一个很大的数，又怎么确定它是素数？试试把它因数分解？那样一来，A 所需要的时间不就和 C 差不多了吗？尽管 A 可以提前做准备，时间相对充裕，但如果算法太耗时，也是不方便的。幸运的是，有一些时间复杂度极低的判断一个数是否是素数的算法的。比如，我们可以利用一些素数的性质来判断一个数是不是素数：假设 a 是一个比较小的素数（比如 2、3、5 等），p 是需要判断的一个比较大的数，如果 p 是一个素数，那么就会有 $a^{p-1}-1$ 可以被 p 整除。我们可以根据这个判断公式编写如下的程序检查一个数是否是素数。

这个算法还有一些需要注意的地方：首先，有一些非素数，也能偶尔满足上面的判断公式，所以需要多试几个不同的 a 的值，如果都满足条件，才能确保被测试的数是素数。对于不是特别大的的整数，分别把 a 等于 2、3、5、7、11、13 这几个最小素数的情况都试一遍就足够了。其次，在程序里不能直接使用乘方函数计算 $a^{p-1}$ 的值，这是因为被测数据 p 一般都比很大，$a^{p-1}$ 会是一个非常非常大的数，可能已经超出 CPU 单个寄存器可表示的范围了。因为我们只关心 $a^{p-1}$ 除以 p 后的余数，所以，在程序里可以把乘方计算拆成多个乘法计算，一边算乘法，一边只保留结果中的会影响最终余数的低位部分，这样就可以把数据一直控制在一个不太大的范围内。

这个算法的代码如下：

```python
def montgomery(n, p, m):
    k = 1
    n %= m 
    while p != 1:  
        if 0 != (p & 1):
            k = (k * n) % m
        n= (n * n) % m
        p >>= 1
    return (n * k) % m

def is_prime(n):
    if n < 2:
        return False
    for a in [2, 3, 5, 7, 11]: 
        if 1 != montgomery(a, n-1, n):
            return False
    return True
```


利用上面的程序在一段连续的整数中挨个测试，很快就可以找到一些素数。比如，我们利用上面的程序，从 1,000,000,000 开始查找，很快就找到了一个素数： 1,000,000,007。

## 空间复杂度

空间复杂度描述了算法使用的内存或存储空间与输入数据大小之间的关系。它告诉我们，随着输入数据的增长，算法需要多少额外的内存。它的描述方法与时间复杂度一样，也是使用 O 表示的函数，只不过这里表示的不是算法的计算量，而是所需的内存空间。

### 一些示例

#### 常数空间 

```python
def constant_space(arr):
    total = 0
    for item in arr:
        total += item
    return total

arr = [1, 2, 3, 4, 5]
sum = constant_space(arr)
print(sum)
```

在上述代码中，不管输入数组的大小如何，constant_space 函数只使用一个额外的整数变量 total 来存储和。因此，它的空间复杂度是 $O(1)$。

#### 线性空间 
 
```python
def linear_space(n):
    return [i for i in range(n)]

n = 5
result = linear_space(n)
print(result)
```

此函数根据输入 n 创建一个长度为 n 的列表。所使用的空间与输入大小直接相关，因此空间复杂度为 $O(n)$。