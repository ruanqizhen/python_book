# Array

## Basic Concepts

### One-dimensional Arrays

An array is a fundamental data structure in computer science, defined by the following characteristics:

* **Fixed size**: An array has a fixed length determined when it is created.
* **Contiguous memory layout**: All elements are stored in a continuous, uninterrupted block of memory.
* **Homogeneous elements**: An array stores elements of the same data type (e.g., only integers or only floats). Consequently, each element occupies an identical amount of memory.
* **Constant-time indexing**: Because of contiguous storage and uniform element sizes, we can directly access any element using a simple mathematical formula: `Memory address of element = Base address of the array + Index * Element size`. Accessing an element by its index is an $O(1)$ operation.
* **Linear-time insertion and deletion**: Inserting or deleting elements in the middle of an array requires shifting the subsequent elements, which runs in $O(n)$ time, where $n$ is the size of the array.
* **Cache friendliness**: Contiguous memory layout exhibits excellent CPU cache locality, making sequential iteration significantly faster than in non-contiguous data structures.

### Multi-dimensional Arrays

A multidimensional array (often called a matrix or tensor) is an array whose elements are themselves arrays. While two-dimensional arrays are the most common, arrays can theoretically have any number of dimensions. Each dimension is referred to as an "axis."

A two-dimensional (2D) array represents tabular data or matrices. In memory, 2D arrays are typically stored in row-major order, where the data for the first row is placed first, followed immediately by the second, and so on. Since every row contains the same number of elements, we can compute any element's memory address in constant time. For a 2D array with $n$ rows and $m$ columns, the memory address of the element at row $i$ and column $j$ is calculated as:
`Memory address of element = Base address of the array + (m * i + j) * Element size`.

In a three-dimensional array, each element is a two-dimensional array. By analogy, higher-dimensional arrays can be constructed.

Images stored in a computer are the most common real-world examples of multidimensional arrays. A black-and-white image is typically a two-dimensional array where each element represents the brightness of a pixel. Color images are usually three-dimensional arrays, where two axes represent the height and width of the image, and the third axis represents the color channels: red, green, and blue (RGB).

### Arrays in Python

In Python, the built-in `list` is a dynamic array rather than a fixed-size array. It uses a contiguous block of memory to store elements, enabling fast $O(1)$ random access. Unlike standard arrays, a list dynamically resizes: when its capacity is exceeded, Python automatically allocates a larger memory block, copies the existing elements to the new block, and releases the old memory. Because it uses contiguous memory, inserting or deleting elements in the middle of a list requires shifting subsequent elements, which runs in $O(n)$ time. However, appending or popping elements at the end of a list is an amortized $O(1)$ operation because no elements need to be shifted.

Compared to true arrays, Python lists carry additional memory overhead because they pre-allocate extra slots to speed up future append operations.

Nested lists (or "lists of lists") like `[[1, 2, 3], [4, 5]]` behave even less like true multidimensional arrays because the inner lists can have different lengths and are not stored contiguously in memory.

When numerical computation with arrays is needed in Python, the NumPy (Numerical Python) library is generally used. Unlike lists, all elements in a NumPy array (`np.ndarray`) must be of the same data type. NumPy arrays can represent vectors (1D), matrices (2D), or higher-dimensional tensors. We will cover NumPy in more detail in the [NumPy](numpy) chapter. Here, to keep things simple, we will use Python lists to demonstrate standard array algorithms.

## Common Array Operations

### Finding the Maximum Value in an Array

This algorithm is straightforward: initialize the maximum value to the first element of the array, then iterate through the remaining elements. If an element is larger than the current maximum, update our tracker. After a single pass, return the result. The time complexity of this linear scan is $O(n)$, where $n$ is the length of the array.

```python
def find_max_value(arr):
    """查找数组中的最大值"""
    # 检查输入数组是否为空
    if not len(arr):
        return None
    
    # 设置当前结果为元素第一个值
    max_value = arr[0]
    
    # 遍历数组
    for num in arr:
        if num > max_value:
            # 如果有更大值，就更新当前结果
            max_value = num
            
    return max_value
```

Similar interview problems, such as finding the second largest or third smallest element, follow the same basic structure. Finding the second largest number simply requires tracking two variables—the largest and the second largest—simultaneously during the scan.

### Searching for a Target in a Sorted Array

Searching for a value in an unsorted array requires scanning the elements one by one. If the array is sorted, however, we can perform a binary search.

Binary search works by checking the middle element of a sorted search range. If the middle element matches the target, the search is complete. If the target is smaller, the search continues in the left half; if larger, it continues in the right half. Each step halves the remaining search space, repeating until the target is found or the search range is exhausted. This logarithmic approach runs in $O(\log n)$ time, where $n$ is the length of the array, making it significantly faster than linear search for large datasets.

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

Binary search can also be implemented recursively:

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


### Rotation

Rotating an array to the right by one position shifts every element one index to the right, moving the original last element to the first position. Suppose we want to write a function to rotate an array to the right by $k$ positions. There are several ways to implement this:

#### Naive Method

The most direct approach is to shift the array right by one position $k$ times.

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

* **Time Complexity**: $O(n \cdot k)$ because we shift $n$ elements $k$ times. In the worst case, this approaches $O(n^2)$.
* **Space Complexity**: $O(1)$ since we only use a single temporary variable `previous`.

#### Using an Extra Array

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

This approach uses a temporary array to store the rotated elements. Since the post-rotation index of any element at index `i` is `(i + k) % n`, we can copy each element directly to its target position in the temporary array, then copy the results back.

* **Time Complexity**: $O(n)$, since we iterate through the array of size $n$ twice.
* **Space Complexity**: $O(n)$ to allocate the temporary array. This algorithm trades memory space for faster execution time.

#### Three Reversals

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

This algorithm first defines a helper function `reverse()` that reverses a segment of the array in-place. We then perform three targeted reversals to complete the rotation:
1. Reverse the entire array: `[1, 2, 3, 4, 5, 6, 7]` becomes `[7, 6, 5, 4, 3, 2, 1]`.
2. Reverse the first $k$ elements: with $k=3$, this yields `[5, 6, 7, 4, 3, 2, 1]`.
3. Reverse the remaining $n - k$ elements: this yields `[5, 6, 7, 1, 2, 3, 4]`.

Through these three reversal operations, the array is rotated in-place without the need for manual element shifting or auxiliary array allocation.

* **Time Complexity**: $O(n)$, since each reversal is linear and we perform three of them.
* **Space Complexity**: $O(1)$ because the swaps are performed in-place using a constant amount of auxiliary memory.

### Finding Duplicate Elements

Checking for duplicate elements in an array can be approached in several ways depending on performance constraints. The most intuitive method uses a set to track elements we have already encountered. Since sets only store unique values, if we attempt to add an element that is already present in the set, we have found a duplicate.

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

* **Time Complexity**: $O(n)$ because set lookups and insertions run in average $O(1)$ time, and we perform one pass over the array of size $n$.
* **Space Complexity**: $O(n)$ in the worst case where all elements are unique, requiring us to store all $n$ elements in the set.

### Merging Two Sorted Arrays

To merge two sorted arrays, we can use the two-pointer technique.

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

In the code above, we define two pointers, `p1` and `p2`, pointing to the start of `nums1` and `nums2` respectively. In a loop, we compare the elements at these pointers, appending the smaller value to the `merged` list and advancing that pointer. Once one array is exhausted, we append the remaining elements of the other array directly to the end of the results.

* **Time Complexity**: $O(m+n)$ because we process each element from both arrays exactly once, where $m$ and $n$ are the respective lengths of the two arrays.
* **Space Complexity**: $O(m+n)$ to store the merged result in a new array.

## Sorting

In programming interviews, sorting algorithms are one of the most frequently discussed topics related to arrays.

### Basic Algorithms

The three simplest sorting algorithms can be visualized by sorting a pile of apples by size from smallest to largest:
* **Selection Sort**: Find the smallest apple in the pile and place it at the front. Then, find the smallest among the remaining apples and place it next. Repeat this process until all apples are sorted.
* **Insertion Sort**: Take one apple and place it on the table. Take another apple and insert it in the correct position relative to the first (either in front or behind). For each subsequent apple, compare it with the already sorted apples and insert it into its correct position.
* **Bubble Sort**: Line up the apples on the table. Compare the first two apples and swap them if the left one is larger than the right one. Move to the next pair and compare/swap again. After one full pass down the line, the largest apple "bubbles" up to the rightmost position. Repeat this process for the remaining unsorted apples until the entire line is sorted.

The implementation code for these three algorithms is also very simple and intuitive:

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

When writing sorting algorithms, it is best to sort the array in-place (modifying the original array directly) to conserve memory, rather than allocating new arrays to store the results.

On planet Pythora, Bubble Sort is highly popular because the local programmers prefer simplicity, and Bubble Sort requires the shortest code.

For all three basic sorting algorithms above, sorting $n$ elements requires $n$ passes, with each pass taking an average of $n/2$ operations. This results in a quadratic time complexity of $O(n^2)$. If you test these algorithms with a large array, you will find that they are significantly slower than Python's built-in `sorted()` function. They are slow because they perform redundant comparisons. For example, if we have already determined that $a > b$ and $b > c$, transitivity tells us that $a > c$, so comparing $a$ and $c$ is unnecessary. Eliminating these redundant comparisons is the key to faster sorting.

### Quick Sort

Some algorithms optimize performance by eliminating these redundant comparisons. The most widely used is the **Quick Sort** algorithm.

Continuing with the apple example, we first pick one apple from the pile as a "pivot" and compare all other apples against it. Apples smaller than the pivot are placed to its left, and apples larger are placed to its right. The pivot is now in its final sorted position, dividing the remaining apples into a left pile and a right pile. Because every apple in the left pile is smaller than any apple in the right pile, we never need to compare apples between the two piles. We then recursively apply the same pivot-and-partition process to the left and right piles until the entire array is sorted.

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

Note: The Python implementation above uses extra list space for code simplicity and is not an in-place sort. In space-sensitive scenarios, standard quick sort should operate on the original array through index swapping.

Quick Sort is the most commonly used sorting algorithm in real-world software, and many standard libraries base their sorting functions on it. By eliminating unnecessary comparisons, it achieves an average time complexity of $O(n \log n)$.

However, Quick Sort has a vulnerability: in the worst-case scenario—such as when the array is already sorted or nearly sorted, and the pivot is chosen poorly (e.g., always selecting the first or last element)—the partitions become highly asymmetric. One partition may receive almost all elements while the other remains empty. If this asymmetry persists, the recursion depth reaches $O(n)$, and the time complexity degrades to $O(n^2)$.

### Merge Sort

Recall our earlier algorithm for merging two sorted arrays. **Merge Sort** uses this concept as its core operation.

It divides an unsorted array into $n$ single-element subarrays (which are sorted by definition). It then pairs up and merges these subarrays into larger sorted subarrays until only one sorted array remains.

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

While Merge Sort is more complex to implement than Quick Sort, it has a distinct advantage: its time complexity is guaranteed to be $O(n \log n)$ in the best, worst, and average cases, where $n$ is the length of the array.

Can we sort even faster? If a sorting algorithm relies on pairwise comparisons, it is mathematically proven to require at least $O(n \log n)$ comparisons in the worst case. Therefore, comparison-based sorting cannot run faster than $O(n \log n)$.

### Counting Sort

However, certain sorting problems do not require element comparison. Instead, they leverage array indexing. Because array indexing takes $O(1)$ time, these non-comparison-based sorting algorithms can break the $O(n \log n)$ lower bound. A prime example is **Counting Sort**.

Suppose we want to sort the integers `[5, 4, 2, 8, 7]`. We first allocate a "counting array" to store frequencies. The size of this counting array must be at least `max(array) + 1` to accommodate all possible values. In our case, the maximum value is `8`, so we allocate an array of size `9` initialized to zeros. Next, we scan the input array: since the first number is `5`, we increment the value at index `5` of the counting array; the second number is `4`, so we increment the value at index `4`, and so on. Once counting is complete, we iterate through the counting array and reconstruct the sorted elements based on their recorded counts.

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

Counting Sort runs in $O(n + k)$ time, where $n$ is the number of elements and $k$ is the range of the input values. Because it has no nested loops, its execution time scales linearly.

While Counting Sort is exceptionally fast, its application is highly constrained: it only works on non-negative integers (or data that can map to them), and it becomes impractical if the range of values $k$ is significantly larger than the number of elements $n$ (since it would require excessive memory). Thus, general-purpose comparison-based sorts like Quick Sort remain much more widely used.

## The sorted() Higher-Order Function

Python's built-in `sorted()` function (and the `.sort()` method on lists) uses a hybrid sorting algorithm called **Timsort**.

Timsort is a stable, real-world optimized algorithm that combines Merge Sort and Insertion Sort. For small arrays or segments that are already nearly sorted, it uses Insertion Sort to minimize overhead. For larger datasets, it divides the array into segments (runs), sorts them using Insertion Sort, and then merges them using Merge Sort. This allows Timsort to achieve $O(n)$ time complexity in the best case (for fully sorted input) while maintaining a worst-case complexity of $O(n \log n)$.
