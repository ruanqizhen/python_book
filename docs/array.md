# 数组

## 基本概念

### 一维数组

数组（Array）是计算机科学中的基础数据结构，具有以下特性和定义：

* 固定大小： 数组在创建时具有固定的大小。
* 连续的内存存储： 数组中的所有元素都存储在连续的内存地址中。
* 同一类型的元素： 数组只能存储一种类型的元素，例如：整数数组只能存储整数。这表示数组中每个元素占用内存的大小都一样。
* 索引的时间复杂度是常数： 基于上两条特性，我们可以通过简单的数学计算来直接访问数组中的任何元素： `元素在内存中的地址 = 数组的起始内存地址 + 索引 * 单个元素占用的内存` 访问数组中元素，也就是索引的时间复杂度是 $O(1)$。
* 插入与删除的时间复杂度为线性： 在数组的中间插入或删除元素通常需要移动其他元素，因此这类操作的时间复杂度是 $O(n)$，其中 n 是数组的大小。
* 缓存友好性： 由于数组的连续内存布局，它们通常比其他非连续的数据结构更能利用 CPU 缓存，这可以加速访问速度。

### 多维数组

多维数组，通常称为矩阵或张量，是一个数组，其中每个元素本身都是一个数组。最常见的多维数组是二维数组，但理论上可以有任意数量的维度。每个维度通常被称为一个“轴”。

二维数组是最常见的多维数组形式，通常用于表示矩阵。在二维数组中，每个元素都是一个数组。例如，一个数字表格可以被表示为一个二维数组。二维数组在内存中存储顺序是先放置一行的数据，然后紧接着保存下一行。因为每一行的元素的个数都相同，所以通过元素的索引还是可以立刻计算到元素所在的内存地址。比如一个二维数组，共有 n 行 m 列，需要访问的元素的索引是第 i 行 j 列，那么就可以知道这个 `元素的内存地址 = 数组的起始内存地址 + (m * i + j) * 单个元素占用的内存`。

在三维数组中，每个元素都是一个二维数组。以此类推，可以构建更高维数组。

计算机里存储的图片时最常见的数组格式的数据。黑白图片通常是一个二维数组，其中每个元素代表一个图片像素。彩色图像则通常是一个三维数组，两个维度代表像素的位置，第三个维度代表红、绿和蓝三种颜色。

### Python 中的数组

在 Python 中，列表（list）是一个动态数组，而不是最基本的数组结构。它在内存中使用一个连续的内存块来存储元素，因此可以快速地随机访问任何元素。区别是列表可以动态调整大小：当我们向 list 添加元素并超出其当前容量时，Python 会分配一个新的、更大的内存块来存储元素，并将旧块中的元素复制到新块中。这是为什么 list 被称为动态数组的原因。由于使用连续内存，向 list 的中间位置插入或从中间位置删除元素需要移动后面的元素，这是一个 $O(n)$ 的操作。但在 list 的末尾添加或删除元素通常是更快的，因为不需要挪动其它元素。

与真正的数组相比，Python 的 list 有一些额外的内存开销，因为它可能预先分配一些额外的空间来加速后续的元素添加。

至于列表的列表，比如 `[[1, 2, 3], [4, 5]]` 就更不是真正的多维数组了。

在 Python 中需要使用数组进行数学计算的时候，一般会使用 NumPy（Numerical Python的简写） 中的 array。与 list 相比 np.array 中的所有元素都是相同的数据类型，例如整数、浮点数或字符串。np.array 可以是多维的。例如，它可以代表向量（1D）、矩阵（2D）或更高维的张量。我们会在[专门一节详细介绍 NumPy](numpy)。在这里，为了简化程序，仍然使用列表演示数组的各种算法。

## 常用的数组操作

### 查找数组中的最大值

这个算法非常直接，首先将数组的第一个元素设置为当前的最大值，然后遍历数组，每次找到一个比当前最大值更大的值时，就更新最大值。最后，函数返回找到的最大值。这种方法的时间复杂度是 O(n)，其中 n 是数组的长度。

```python
def find_max_value(arr):
    """查找数组中的最大值"""
    # 检查输入数组是否为空
    if not len(arr):
        return none
    
    # 设置当前结果为元素第一个值
    max_value = arr[0]
    
    # 遍历数组
    for num in arr:
        if num > max_value:
            # 如果有更大值，就更新当前结果
            max_value = num
            
    return max_value
```

在面试中遇到的类似题目会稍微增加一点难度，比如找第二大的，第三小的数等。但算法还是一样的，找第二大的数，无非就是再增加一个变量，使用两个临时变量分别记录当前最大的和第二大的数。

### 在排序数组中查找目标

如果是在未排序数组中查找，就只能遍历数组，与查找最大值的算法类似。但是对于排序树组，就可以采用二分法来查找了。

二分搜索的基本思路是，每次都检查排序数组的中间元素。如果中间元素正好是目标值，则搜索结束。如果目标值小于中间元素，则在左半部分继续搜索；如果目标值大于中间元素，则在右半部分继续搜索。通过这种方式，每次迭代都会将搜索范围缩小一半，直到找到目标值或确定目标值不在数组中为止。二分搜索不需要查看数组中的每个元素，比线性查找更快。它的时间复杂度是 O(log n)，其中 n 是数组的长度。

```python
def binary_search(sorted_arr, target):
    """返回目标数据在 sorted_arr 中的索引，如果没有找到，则返回 -1"""
    
    left, right = 0, len(sorted_arr) - 1
    
    while left <= right:
        mid = (left + right) // 2  # 中间位置的索引
        
        if sorted_arr[mid] == target:
            return mid             # 找到目标
        elif sorted_arr[mid] < target:
            left = mid + 1         # 搜索右半部分
        else:
            right = mid - 1        # 搜索左半部分
            
    return -1                      # 目标没有找到

# 示例
sorted_arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
target = 7

index = binary_search(sorted_arr, target)
if index != -1:
    print(f"目标数据 {target} 的索引是 {index}")
else:
    print(f"目标数据 {target} 没有找到")
```

我们也经常会看到用递归方法实现的二分查找：

```python
def binary_search(sorted_arr, target, left, right):
   if left > right:
	   return -1
   mid = (left + right) // 2
   if sorted_arr[mid] == target:
	   return mid
   elif sorted_arr[mid] > target:
	   return binary_search(sorted_arr, target, left, mid - 1)
   else:
	   return binary_search(sorted_arr, target, mid + 1, right)
```


### 旋转平移

向右旋转平移一个位置，表示把数组所有的元素向右移动一个位置，同时把原来最右边的数据挪到数组最左侧。假设我们要编写一个程序，把数组中所有的元素向右旋转移动 k 个位置。这个问题有几种不同实现方式：

#### 朴素方法

最直接的方法就是每一轮都把所有元素向右移动一个位置，重复 k 轮即可。

```python
def rotate_naive(nums, k):
    n = len(nums)
    k = k % n  # 防止 k 比数组长度还大
    for _ in range(k):
        previous = nums[-1]
        for i in range(n):
            nums[i], previous = previous, nums[i]

nums = [1,2,3,4,5,6,7]
rotate_naive(nums, 3)
print(nums)  # Output: [5,6,7,1,2,3,4]
```

时间复杂度：每次旋转操作需要 $O(n)$ 时间，我们旋转 k 次，因此总的时间复杂度为 $O(nk)$。但在最坏的情况下，k=n，时间复杂度为 $O(n^2)$。 空间复杂度：我们只用了一个额外的变量 previous，因此空间复杂度为 $O(1)$。

#### 使用额外的数组

```python
def rotate_with_extra_array(nums, k):
    n = len(nums)
    k = k % n
    rotated = [0] * n
    for i in range(n):
        rotated[(i + k) % n] = nums[i]
    for i in range(n):
        nums[i] = rotated[i]

nums = [1,2,3,4,5,6,7]
rotate_with_extra_array(nums, 3)
print(nums)  # Output: [5,6,7,1,2,3,4]
```

这个方法利用一个临时数组存放数据，因为我们可以直接计算出移动后，每个元素的新位置，所以可以直接把原来的数据拷贝到新数组中它移动后应该在的位置上。时间复杂度：首复制原数组到一个新的数组，这需要 $O(n)$ 时间。然后再将数据从新数组复制回原数组也需要 $O(n)$ 时间。因此，总的时间复杂度为 $O(n)$。空间复杂度：因为创建了一个额外的数组 rotated 来存储旋转后的数据，因此空间复杂度为 $O(n)$。与上一个算法相比，这个算法是以空间换时间。

#### 三次翻转

```python
def reverse(nums, start, end):
    while start < end:
        nums[start], nums[end] = nums[end], nums[start]
        start, end = start + 1, end - 1

def rotate_with_reversal(nums, k):
    n = len(nums)
    k = k % n
    reverse(nums, 0, n - 1)
    reverse(nums, 0, k - 1)
    reverse(nums, k, n - 1)

nums = [1,2,3,4,5,6,7]
rotate_with_reversal(nums, 3)
print(nums)  # Output: [5,6,7,1,2,3,4]
```

这个算法首先定义了一个 reverse 函数，这是一个辅助函数，他通过对调数组中前后对应位置的元素，把数组内所有的元素反向排列。在主函数内通多三次翻转，完成旋转平移。第一次是把整个数组翻转，比如 `[1,2,3,4,5,6,7]` 翻转后得到 `[7,6,5,4,3,2,1]`。第二次翻转前 k 个元素，比如 k=3，翻转之后得到 `[5,6,7,4,3,2,1]`。最后反转剩下的元素。得到 `[5,6,7,1,2,3,4]`。这种方法的核心思想是：通过合适的翻转可以将数组旋转到指定的位置，而无需逐个移动元素。

时间复杂度：每次翻转的时间复杂度为 $O(n)$。我们进行了三次翻转操作，总的时间复杂度还是 $O(n)$。空间复杂度：因为只使用了一些常数空间来存储索引和进行交换操作，因此空间复杂度为 $O(1)$。

### 查找重复元素

检查一个数组中是否有重复元素，解决这个问题，也有多种方法，要根据具体的需求选择算法。最直观的算法是使用集合。由于集合不允许重复，因此如果将数组的元素逐一添加到集合的过程中，某个元素已经在集合中，那么它就是一个重复元素。

```python
def find_duplicates(nums):
    seen = set()
    duplicates = set()
    
    for num in nums:
        if num in seen:
            duplicates.add(num)
        seen.add(num)
    
    return list(duplicates)

nums = [1,2,3,2,1,5,6,5,5,5]
print(find_duplicates(nums))  # Output: [1, 2, 5]
```

时间复杂度: 遍历整个数组的时间复杂度是 $O(n)$，集合的查找和插入都是 $O(1)$，所以总时间复杂度是 $O(n)$。空间复杂度:最坏情况下，数值中没有重复，需要把每个元素都插入到集合中，相当把所有元素复制一份，所以空间复杂度是 $O(n)$。


### 合并两个有序数组


要合并两个有序数组，我们可以使用双指针技术。

```python
def merge_sorted_arrays(nums1, nums2):
    # 用于存放结果
    merged = []
    
    # 当前位置指向两个数组的起始位置
    p1, p2 = 0, 0

    # Compare and merge until one of the lists is exhausted
    while p1 < len(nums1) and p2 < len(nums2):
        if nums1[p1] < nums2[p2]:
            merged.append(nums1[p1])
            p1 += 1
        else:
            merged.append(nums2[p2])
            p2 += 1

    # If there are remaining elements in nums1
    while p1 < len(nums1):
        merged.append(nums1[p1])
        p1 += 1

    # If there are remaining elements in nums2
    while p2 < len(nums2):
        merged.append(nums2[p2])
        p2 += 1

    return merged

# Test
nums1 = [1,2,3]
nums2 = [2,5,6]

merged_array = merge_sorted_arrays(nums1, nums2)
print(merged_array)  # Output: [1,2,2,3,5,6]
```

在上面的程序中，开始时，定义了两个指针，p1 和 p2，分别指向 nums1 和 nums2 的开始位置。我们在一个循环中执行以下步骤，直到 p1 或 p2 中的一个到达其数组的末尾为止：比较 nums1[p1] 和 nums2[p2]。将较小的元素追加到 merged 列表中，并递增对应的指针（p1 或 p2）。

当某个指针达到数组结尾，把另一个数组剩下的数据追加到结果数组尾部即可。

时间复杂度：上面程序要把两个数组中每个元素都处理一遍，因此时间复杂度是 $O(m+n)$，m 和 n 分别上两个数组的长度。空间复杂度同样是 $O(m+n)$，因为要把每个元素都复制到新数组中。

## 排序

在面试中，关于数组讨论的最多的可能各种排序算法了。

### 基本算法

最简单的排序算法是下面这三种，比如有一堆苹果，需要我们按照个头从大到小排序。我们可以：
* 我们通常会先把里面最大的一个挑出来，摆在眼前；然后再从剩下苹果里面挑一个最大的，排在第二；再挑第三个……这种排序算法叫做**选择排序**（Selection Sort）。
* 也有的人喜欢用另一种方式排序：从那堆苹果里随便拿一个出来，摆在眼前；再随便拿一个苹果，跟眼前的比较一下，如果新拿的苹果更大，就排前面，否则排后面；再拿来一个苹果跟眼前所有苹果一一比较，把新苹果插在一个比前面小比后面大的位置上……这种排序算法叫做**插入排序**(Insertion Sort)。
* 还有一种类似的算法叫做**冒泡排序**（Bubble Sort）：假设我们面前有一排没有排序的苹果，我们先比较最右面两个苹果，如果左边一个大，就不动，如果右面的大，就调换两个苹果的位置；再比较右边数的第二第三个苹果，也是如果两个苹果中如果左边一个大，就不动，如果右面的大，就调换两个苹果的位置；在比较右边数第三第四个苹果……这样一轮下来，我们就可以保证最大的苹果被挪到了最左边了；如果同样的操作再来一轮，就能保证第二大的苹果被挪到了左边第二的位置；同样操作 n 轮后，n 个苹果就都被排序好了。

这三种算法的实现代码也都非常简单直观：

```python
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_index = i
        for j in range(i+1, n):
            if arr[j] < arr[min_index]:
                min_index = j
        arr[i], arr[min_index] = arr[min_index], arr[i]


def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >=0 and key < arr[j]:
            arr[j+1] = arr[j]
            j -= 1
        arr[j+1] = key


def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
```

在编写排序算法的时候，为了节省资源，应该尽量直接在原数组上进行修改，而不是另外开辟一块内存保存排序结果。

Pythora 星球最受欢迎的是冒泡排序，因为这里都是懒人，而冒泡程序最简短。以上这三种排序算法，每摆放好一个元素，都要去比较或者挪动其它所有剩下的元素。为了把 n 个数据排序，需要运行 n 轮，每轮又要进行平均 n/2 个操作。总体来看，算法时间复杂度达到了平方级别，也就是 $O(n^2)$。如果读者用一个大的数组去测量一下的话，就会发现，上面几种算法比 LabVIEW 自带的排序算法慢很多。慢在哪里呢？上面三个算法慢在：其实排序并不需要把每一个元素都跟其它所有的元素进行比较。比如有 a, b, c 三个数，如果已经发现 a > b，b > c，那么就不需要再去比较 a 和 c 的大小了。就是这些这多出来的比较运算，拉低了上面几个算法的效率。

### 快速排序

有一些算法针对上面问题做了优化，去除了多余的比较。其中使用最广泛的是**快速排序**（Quick Sort）算法：还是以苹果排序为例，我们先从一堆苹果里随便拿出一个做基准，把所有其它的苹果都跟它比较。比它大的所有苹果都放在它左边；比它小的所有苹果都放在它右边。这样，桌上苹果分成了中间一个，左边一堆，右边一堆。我们能够确定，左边这堆任何一个苹果都必定大于右边一堆苹果中的任意一个。所以任何一个左边的苹果都不必再和右边的任何一个苹果去比较了。我们接下来再从左边这一小堆苹果中随机拿出一个做基准，按照上述方法，把左边这一堆分成更小的三堆；之后再对右边那一小堆苹果也做同样的操作。依次递推，直到每一小堆都只有一个苹果的时候排序就完成了。


```python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

# 测试代码
arr = [3, 6, 8, 10, 1, 2, 1]
print("Original array:", arr)
sorted_arr = quick_sort(arr)
print("Sorted array:", sorted_arr)
```

快速排序是实际项目中最常用的排序算法，很多编程语言内置的排序算法都是快速排序。这种排序算法，去除了所有没必要的比较，时间复杂度降低到了 $O(n\log_2 n)$。
快速排序有一个严重问题，当出现最差的情况，也就是输入数组已经基本排序好了，只有部分元素位置错误，这是，每次把数据分成两组，产生的都是及不对称的分组，一半只有一两个元素，剩下的都在另一半中。这样一来，就需要分组接近 n 次才能排序好，时间复杂度退化到了 $O(n^2)$。

### 归并排序

还记得上面有个示例，介绍了合并两个有序数组吧。归并算法的核心就是合并两个有序数组。我们可以把一个数组的每个元素都看成是一个数组，因为数组中只有一个元素，可以认为是已经排序的。然后把这些小数组们两两配对，进行有序合并。这时候数组的数量减半，但每个数组长度增加一倍。继续对产生的数组两两配对，有序合并。重复这一过程，直到最后所有元素合并成一个数组。

```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = arr[:mid]
    right = arr[mid:]

    # 递归地排序左右两个子序列
    left = merge_sort(left)
    right = merge_sort(right)

    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0

    # 当左右两个序列都有值时，进行合并操作
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    # 如果左序列还有剩余，则加入结果
    while i < len(left):
        result.append(left[i])
        i += 1

    # 如果右序列还有剩余，则加入结果
    while j < len(right):
        result.append(right[j])
        j += 1

    return result

# 测试归并排序
arr = [38, 27, 43, 3, 9, 82, 10]
sorted_arr = merge_sort(arr)
print(sorted_arr)  # 输出: [3, 9, 10, 27, 38, 43, 82]
```

与快速排序相比，归并排序的算法实现起来更复杂一些。但是它也有明显优点，它在最坏、最好和平均情况下的时间复杂度都是 $O(n\log_2 n)$，其中 n 是序列的长度。

排序还能再快一些吗？如果是通过比较数组中元素的大小来排序，n 个数据，至少也要比较 $n*\log_2 n$ 次才行，所以无法再快了。

### 计数排序

有些特殊的排序问题，不需要对数据进行比较，而是可以通过索引来排序，数组索引的时间复杂度是 $O(1)$,非常快，所以这些排序算法可以突破 $n*\log_2 n$ 的限制。其中比较有代表性的是计数排序（Counting Sort）。

比如我们需要给下面这样一组整数排序： 5, 4, 2, 8, 7，那么我们就可以先创建一个用于计数的数组（这也是计数排序名称的由来），这个计数用的数组长度一定要大于原来数组中最大的那个元素的数值。比如上面的例子中，需要排序的几个数中最大的是 8，那么我们就可以开辟一个长度为 10 的数组用来计数。接下来，挨个查看需要排序的数据，第一个数是 5，那么就把计数数组第 5 个元素加一；第二个数是 4，就把计数数组第 4 个元素加一…… 当计数完毕之后，按照计数数组记录的情况从前到后构造一个新的数据数组出来，就是排好序的数据数组了。

```python
def counting_sort(arr):
    # 找到待排序数组中的最大值
    max_val = max(arr)
    
    # 初始化计数数组
    count = [0] * (max_val + 1)

    # 遍历待排序数组，更新计数数组
    for num in arr:
        count[num] += 1

    # 从计数数组生成排序后的数组
    sorted_arr = []
    for i, cnt in enumerate(count):
        sorted_arr.extend([i] * cnt)
    
    return sorted_arr

# 测试代码
arr = [4, 2, 2, 8, 3, 3, 1]
print("Original array:", arr)
sorted_arr = counting_sort(arr)
print("Sorted array:", sorted_arr)
```

计数排序的时间复杂度是 $O(n)$，比快速排序的复杂度又降低了一级。从上图的程序中也可以看出来，它没有嵌套的循环。说明计算次数与输入数据长度是呈线性关系的。计数排序虽然快，但适用范围非常有限。对于快速排序来说，他能狗给任何可以比较的对象排序，但是计数排序只适用于非负整数，并且对于范围较大的数可能不太高效。只是对于小范围的整数，它可以非常快速。因此应用并没有快速排序那么普及。


## sorted（） 高阶函数

为了达到最优效率，Python 内置的排序函数 sorted（） 没有采用单一的排序算法，而是采用了一种复合算法：对于较小的数据块或近似排序的数据块，sorted（） 采用插入排序；对于较大的输入，sorted（） 先把它们分成小块，每个小块还是采用插入排序，然后使用归并排序合并小块的排序结果。
