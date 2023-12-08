# NumPy

NumPy（Numerical Python的缩写）是一个开源的 Python 库，广泛应用于科学计算中，特别是在数组计算、线性代数、傅里叶变换和随机数生成等领域。它提供了一个强大的 N 维数组对象和大量用于操作这些数组的函数和工具。很多高级科学计算工具包，比如 Pandas、Matplotlib 等都是基于 NumPy 的。

## 安装

NumPy 是个第三方包，如果还没有安装NumPy，可以通过以下命令安装：

```sh
pip install numpy
```

使用 NumPy 功能先要导入：

```python
import numpy as np
```

下面示例代码，有些省略了导入过程了，测试时需要自行添加。

## 数组

NumPy 的核心特性之一是其 N 维数组（ndarray）对象。这是一个快速、灵活的大数据集容器。与 Python 原生的列表相比，NumPy 的数组更加高效，支持更高级的数学运算。下面是一些常用的数组操作。

### 创建数组

使用 np.array 函数，可以把其它类型的数据转换成 NumPy 数组：

```python
# 把列表转换成数组
np_array = np.array([1, 2, 3, 4, 5])

# 把图片转换成二维数组
from PIL import Image
image = Image.open("example.jpg")
image_array = np.array(image)
```

使用 np.zeros，np.ones 函数可以创建特定大小的全零或全一数组：

```python
zeros_array = np.zeros((2, 3))  # 创建一个 2x3 的零矩阵
ones_array = np.ones((3, 4))    # 创建一个 3x4 的单位矩阵
```

### 数组形状和大小

shape 属性表示了数组形状：

```python
import numpy as np
ones_array = np.ones((3, 4)) 
print(ones_array.shape)         # 输出： (3, 4)
```

reshape 可以改变数组形状：

```python
import numpy as np

# 创建一个一维数组
arr = np.arange(10)  # 这将创建一个包含数字0到9的数组
print("原始数组:")
print(arr)

# 使用reshape将其重新排列成一个2x5的二维数组
reshaped_arr = arr.reshape((2, 5))
print("\n重塑后的二维数组:")
print(reshaped_arr)

# 也可以让NumPy自动计算其中一个维度的大小
# 下面的-1表示自动计算该维度的大小
reshaped_arr_2 = arr.reshape((5, -1))
print("\n自动计算维度的重塑数组:")
print(reshaped_arr_2)
```

输出：

```
原始数组:
[0 1 2 3 4 5 6 7 8 9]

重塑后的二维数组:
[[0 1 2 3 4]
 [5 6 7 8 9]]

自动计算维度的重塑数组:
[[0 1]
 [2 3]
 [4 5]
 [6 7]
 [8 9]]
```

### 索引和切片

NumPy 一维数组索引方式与列表索引相同：

```python
element = np_array[0]  # 获取第一个元素
```

但是二维或更高维就不同了，对于二维数组（矩阵），索引方式通常是 `array[row, column]`：

```python
# 创建一个 3x3 的二维数组
arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

# 访问第二行第三列的元素
print(arr[1, 2])  # 输出 6
```

NumPy 数组同样支持切片操作，规则与列表的切片相同：

```python
# 访问第二行
print(arr[1, :])  # 输出 [4 5 6]

# 访问第三列
print(arr[:, 2])  # 输出 [3 6 9]

# 访问子矩阵（前两行，前两列）
print(arr[:2, :2])  # 输出 [[1 2] [4 5]]
```

NumPy 支持整数数组索引，可以用索引另一个数组：

```python
print(arr[[0, 2], [1, 2]])  
# 输出 [2 9]  也就是索引了两个数 arr[0, 1] 和 arr[2, 2]
```

NumPy 还支持布尔索引，根据数组中元素的条件来索引：

```python
# 创建一个布尔数组，表示元素是否大于5
bool_idx = arr > 5

# 使用布尔数组进行索引
print(arr[bool_idx])  # 输出 [6 7 8 9]
```

## 矩阵运算

NumPy 实现了所有常用的数学运算，我们无法一一介绍，这里着重演示一下最常用的矩阵的基本运算。

### 四则运算

最基础的自然是加减乘除：

```python
import numpy as np

# 创建两个矩阵
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

# 矩阵加法
addition = A + B
print("矩阵加法 A + B:\n", addition)

# 矩阵减法
subtraction = A - B
print("\n矩阵减法 A - B:\n", subtraction)

# 矩阵乘法（叉乘）
elementwise_multiplication = A * B
print("\n矩阵叉乘 A * B:\n", elementwise_multiplication)

# 矩阵乘法（点乘）
dot_product = np.dot(A, B)
print("\n矩阵点乘 A dot B:\n", dot_product)

# 矩阵除法（元素对元素）
elementwise_division = A / B
print("\n矩阵元素对元素除法 A / B:\n", elementwise_division)
```

输出：

```
矩阵加法 A + B:
 [[ 6  8]
 [10 12]]

矩阵减法 A - B:
 [[-4 -4]
 [-4 -4]]

矩阵叉乘 A * B:
 [[ 5 12]
 [21 32]]

矩阵点乘 A dot B:
 [[19 22]
 [43 50]]

矩阵元素对元素除法 A / B:
 [[0.2        0.33333333]
 [0.42857143 0.5       ]]
```

### 轴操作

在多维数据处理中，我们经常要沿着特定的轴（或维度）执行一些计算，例如计算总和、平均值、最大值和最小值等。以下是一些矩阵轴操作的示例程序。

```python
import numpy as np

# 创建一个 3x3 的矩阵
matrix = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

# 计算所有元素的总和
total_sum = np.sum(matrix)
print("矩阵所有元素的总和:", total_sum)

# 计算每列的总和
col_sum = np.sum(matrix, axis=0)
print("每列的总和:", col_sum)

# 计算每行的总和
row_sum = np.sum(matrix, axis=1)
print("每行的总和:", row_sum)

# 计算每列的平均值
col_mean = np.mean(matrix, axis=0)
print("每列的平均值:", col_mean)

# 计算每行的平均值
row_mean = np.mean(matrix, axis=1)
print("每行的平均值:", row_mean)

# 计算每列的最大值
col_max = np.max(matrix, axis=0)
print("每列的最大值:", col_max)

# 计算每行的最大值
row_max = np.max(matrix, axis=1)
print("每行的最大值:", row_max)
```

### 线性代数操作

矩阵乘法、求逆等

```python
import numpy as np

# 创建两个矩阵
A = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
B = np.array([[9, 8, 7], [6, 5, 4], [3, 2, 1]])

# 矩阵转置
transpose_A = A.T
transpose_B = B.T

# 尝试求矩阵A的逆（如果可能）
try:
    inverse_A = np.linalg.inv(A)
except np.linalg.LinAlgError:
    inverse_A = "不可逆"

# 打印结果
print("矩阵 A:\n", A)
print("矩阵 B:\n", B)
print("A 的转置:\n", transpose_A)
print("B 的转置:\n", transpose_B)
print("A 的逆:\n", inverse_A)
```

### 快速傅立叶变换

快速傅立叶变换（Fast Fourier Transform，FFT）

```python
import numpy as np
import matplotlib.pyplot as plt

# 创建一个方波信号
Fs = 8000  # 采样频率
f = 50      # 信号频率
t = np.linspace(0, 1, Fs, endpoint=False)  # 时间轴
# signal = 0.5 * np.sin(2 * np.pi * f * t)  # 生成正弦波
signal = 0.5 * np.sign(np.sin(2 * np.pi * f * t))  # 生成方波

# 快速傅立叶变换
fft_result = np.fft.fft(signal)
fft_freq = np.fft.fftfreq(t.shape[-1], d=1/Fs)

# 绘图
plt.figure(figsize=(12, 6))

# 绘制原始信号
plt.subplot(2, 1, 1)
plt.plot(t, signal)
plt.title('Square Wave Signal')
plt.xlabel('Time [s]')
plt.ylabel('Amplitude')

# 绘制FFT结果
plt.subplot(2, 1, 2)
plt.plot(fft_freq, np.abs(fft_result))
plt.title('Fast Fourier Transform')
plt.xlabel('Frequency [Hz]')
plt.ylabel('Amplitude')

plt.tight_layout()
plt.show()
```

结果：

![](images/016.png)


## 数组广播

NumPy 的数组广播（Broadcasting）
：NumPy非常强大的一个特性是它的广播功能。当进行数组运算时，NumPy能够自动处理不同形状的数组，使其兼容进行运算，而不需要显式地使用循环。

NumPy的数组广播（Broadcasting）是一种强大的机制，它允许NumPy在执行数组运算时自动处理不同形状（Shape）的数组。这使得你可以在不同大小的数组之间进行算术运算，而无需显式地调整它们的形状。

广播的规则
数组广播遵循一组特定的规则来应用操作：

规则 1：扩展维度 - 如果两个数组的维度数不同，那么小维度数组的形状（Shape）将会在前面补1，直到与大维度数组的维数相同。

规则 2：扩展大小 - 在任何一个维度上，如果一个数组的大小为1，而另一个数组的大小大于1，那么首先会将小数组沿该维度“扩展”来匹配大数组的形状。扩展仅仅是一个概念上的复制，不会进行实际的数据复制。

规则 3：维度不匹配时报错 - 如果在任何维度上大小不一致，且大小都不为1，则会引发错误。

示例
这里有一些具体的例子来说明NumPy的广播机制：

加法示例：

假设我们有一个2x3的数组 A 和一个1x3的数组 B，我们想将这两个数组相加：

```python
Copy code
A = np.array([[1, 2, 3], [4, 5, 6]])
B = np.array([1, 2, 3])

# B会在第一个维度上被“扩展”，以匹配A的形状
C = A + B
```
在这个例子中，B 的形状被扩展为 2x3（概念上），然后与 A 相加。

乘法示例：

假设我们有一个3x1的数组 A 和一个标量（即形状为()的数组）B：

```python
Copy code
A = np.array([[1], [2], [3]])
B = 2

# B会被广播到3x1，然后与A相乘
C = A * B
```
这里，B 被广播成一个3x1的数组 [2, 2, 2]，然后逐元素地乘以 A。

为什么使用广播
广播机制的主要优势是它可以提高代码的性能和可读性。你不需要编写额外的代码来处理不同形状的数组，NumPy会自动、高效地处理它们。这使得你可以避免显式地使用循环来进行数组操作，从而在保持代码简洁的同时提高执行效率。

注意事项
尽管广播非常有用，但在使用时也需要小心。错误地理解或应用广播规则可能会导致意外的行为和错误。特别是在处理多维数据时，始终要清楚每个操作的广播机制是如何应用的。



数据类型：NumPy支持更多种类的数值类型，比Python内置的类型更丰富，这对于科学计算尤其重要。


NumPy提供了一系列的数值类型来支持不同的数据表示，这些类型比Python内置的类型更丰富，非常适合科学计算。以下是NumPy支持的一些主要数值类型：

整数类型：

np.int8：8位有符号整数（-128 到 127）
np.int16：16位有符号整数
np.int32：32位有符号整数
np.int64：64位有符号整数
np.uint8：8位无符号整数（0 到 255）
np.uint16：16位无符号整数
np.uint32：32位无符号整数
np.uint64：64位无符号整数
浮点类型：

np.float16：半精度浮点数
np.float32：单精度浮点数
np.float64：双精度浮点数（在大多数系统中相当于Python的float）
np.float128：四精度浮点数（不是在所有系统上都可用）
复数类型：

np.complex64：由两个32位浮点数（实数部分和虚数部分）组成的复数
np.complex128：由两个64位浮点数组成的复数（在大多数系统中相当于Python的complex）
np.complex256：由两个128位浮点数组成的复数（不是在所有系统上都可用）
布尔类型：

np.bool_：布尔类型（True 或 False）
其他类型：

np.object_：Python对象类型
np.string_：固定长度字符串类型
np.unicode_：固定长度unicode类型
使用NumPy时，通常可以让NumPy自动选择最合适的数据类型，但在需要优化内存使用或确保数值精度的情况下，你也可以显式指定使用这些类型中的哪一种。例如：

python
Copy code
arr = np.array([1, 2, 3], dtype=np.float32)  # 创建一个float32类型的数组
选择正确的数据类型对于优化性能和内存使用非常重要，特别是在处理大型数组或进行复杂数值计算时。


数学函数：NumPy提供了大量的数学函数用于执行各种数学运算，包括统计、代数、变换等。

基本数学运算：

加法、减法、乘法、除法：np.add, np.subtract, np.multiply, np.divide
幂运算：np.power
平方根：np.sqrt
对数函数：np.log, np.log10, np.log2
指数函数：np.exp
三角函数：

正弦、余弦、正切：np.sin, np.cos, np.tan
反三角函数：np.arcsin, np.arccos, np.arctan
双曲三角函数：np.sinh, np.cosh, np.tanh
统计函数：

最大值、最小值：np.max, np.min
求和、累积求和：np.sum, np.cumsum
平均值、中位数：np.mean, np.median
标准差、方差：np.std, np.var
线性代数函数：

矩阵乘法：np.dot
矩阵求逆：np.linalg.inv
行列式：np.linalg.det
特征值和特征向量：np.linalg.eig
随机数生成：

生成随机数：np.random.rand, np.random.randn
生成整数随机数：np.random.randint
随机抽样：np.random.choice
复数处理：

复数的实部和虚部：np.real, np.imag
共轭复数：np.conj
离散傅立叶变换：

快速傅立叶变换：np.fft.fft
逆傅立叶变换：np.fft.ifft
排序、搜索和计数：

排序：np.sort
搜索：np.where
计数：np.bincount









Ellipsis 是一个内置的特殊值，通常在切片操作中使用，表示未完全指定的切片。

在自定义对象的切片方法中，Ellipsis 可用于处理多维切片。

它也可以作为一种占位符，特别是在定义复杂的类和函数时，但这不是它的主要用途。

在Python 3中，Ellipsis 可以用三个连续的点（...）来表示，这在一些特殊场景（如NumPy库中）中很有用。

示例：

```python
class MyContainer:
    def __getitem__(self, key):
        if key is Ellipsis:
            # 处理Ellipsis的情况
            return "Doing something with Ellipsis"
        else:
            # 处理正常的索引
            return "Normal indexing"

container = MyContainer()
print(container[...])  # 输出: Doing something with Ellipsis
```

总结来说，pass 主要用作代码中的空操作占位符，而 Ellipsis 在Python中有特定的用途，尤其是在高级切片操作中。虽然 Ellipsis 也可以用作占位符，但这并非其主要功能。



```python
import numpy as np

# 创建一个4x3x2的多维数组
array = np.array([[[1, 2], [3, 4], [5, 6]], 
                  [[7, 8], [9, 10], [11, 12]],
                  [[13, 14], [15, 16], [17, 18]],
                  [[19, 20], [21, 22], [23, 24]]])

# 使用Ellipsis来访问多维数组的一部分
# 在这个例子中，我们获取所有维度的第一个元素
print(array[..., 0])
```



这个程序首先创建了一个4x3x2的三维数组。然后使用 Ellipsis（...）来选择每个小数组的第一个元素。在这个上下文中，Ellipsis 表示所有剩余的维度，因此 array[..., 0] 表示 "在所有维度上选择第一个元素"。这在处理具有多个维度的数组时非常有用，因为它允许你轻松地引用除了最后一个或前几个维度之外的所有维度