# Array

## Basic Concepts

### One-dimensional Arrays

An array is a fundamental data structure in computer science, with the following characteristics and definitions:

* Fixed size: An array has a fixed size when created.
* Contiguous memory storage: All elements in an array are stored in contiguous memory addresses.
* Same type of elements: An array can only store one type of element, for example, an integer array can only store integers. This means that each element in the array occupies the same amount of memory.
* Constant time indexing: Based on the two characteristics above, we can directly access any element in the array through simple mathematical calculations: `Memory address of element = Starting memory address of the array + Index * Memory occupied by a single element`. Accessing an element in the array, i.e., indexing, has a time complexity of $O(1)$.
* Linear time insertion and deletion: Inserting or deleting elements in the middle of an array usually requires moving other elements, so the time complexity of such operations is $O(n)$, where n is the size of the array.
* Cache friendliness: Due to the contiguous memory layout of arrays, they can typically take better advantage of CPU cache than other non-contiguous data structures, which can speed up access.

### Multi-dimensional Arrays

A multi-dimensional array, often called a matrix or tensor, is an array where each element is itself an array. The most common multi-dimensional array is a two-dimensional array, but there can theoretically be any number of dimensions. Each dimension is often called an "axis."

A two-dimensional array is the most common form of multi-dimensional array, typically used to represent matrices. In a two-dimensional array, each element is an array. For example, a table of numbers can be represented as a two-dimensional array. Two-dimensional arrays are stored in memory by placing one row's data first, followed immediately by the next row. Because each row has the same number of elements, the memory address of an element can still be instantly calculated through its index. For example, in a two-dimensional array with n rows and m columns, if the element to access is at row i and column j, then `Memory address of element = Starting memory address of the array + (m * i + j) * Memory occupied by a single element`.

In a three-dimensional array, each element is a two-dimensional array. By analogy, higher-dimensional arrays can be constructed.

Images stored in a computer are the most common form of array-based data. Black-and-white images are usually two-dimensional arrays, where each element represents a pixel of the image. Color images are typically three-dimensional arrays, where two dimensions represent the pixel's position and the third dimension represents the three colors: red, green, and blue.

### Arrays in Python

In Python, a list is a dynamic array, rather than the most basic array structure. It uses a contiguous block of memory to store elements, thus enabling fast random access to any element. The difference is that a list can dynamically resize: when we add elements to a list and exceed its current capacity, Python allocates a new, larger block of memory to store the elements and copies the elements from the old block to the new one. This is why a list is called a dynamic array. Because it uses contiguous memory, inserting into or deleting from the middle of a list requires moving the subsequent elements, which is an $O(n)$ operation. However, adding or deleting elements at the end of a list is typically faster because no other elements need to be moved.

Compared to true arrays, Python lists have some additional memory overhead because they may pre-allocate extra space to speed up subsequent element additions.

As for lists of lists, such as `[[1, 2, 3], [4, 5]]`, these are even less like true multi-dimensional arrays.

When mathematical computation with arrays is needed in Python, the `array` from NumPy (short for Numerical Python) is generally used. Compared to lists, all elements in a `np.array` are of the same data type, such as integers, floats, or strings. `np.array` can be multi-dimensional. For example, it can represent vectors (1D), matrices (2D), or higher-dimensional tensors. We will cover NumPy in more detail in a [dedicated section](numpy). Here, to keep things simple, we will still use lists to demonstrate various array algorithms.

## Common Array Operations

### Finding the Maximum Value in an Array

This algorithm is very straightforward. First, set the first element of the array as the current maximum value, then iterate through the array. Each time a value larger than the current maximum is found, update the maximum. Finally, the function returns the found maximum value. The time complexity of this approach is O(n), where n is the length of the array.

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

Similar problems encountered in interviews are slightly more challenging, such as finding the second largest, third smallest, etc. But the algorithm remains the same. Finding the second largest number simply means adding one more variable, using two temporary variables to track the current largest and second largest numbers respectively.

### Searching for a Target in a Sorted Array

If searching in an unsorted array, you can only traverse the array, similar to the algorithm for finding the maximum value. However, for a sorted array, binary search can be used.

The basic idea of binary search is to check the middle element of the sorted array each time. If the middle element is exactly the target value, the search ends. If the target value is less than the middle element, continue searching in the left half; if the target value is greater than the middle element, continue searching in the right half. In this way, each iteration reduces the search range by half, until the target value is found or it is determined that the target value is not in the array. Binary search does not need to examine every element in the array and is faster than linear search. Its time complexity is O(log n), where n is the length of the array.

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

We also often see a recursive implementation of binary search:

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

Rotating right by one position means moving all elements of the array one position to the right, while moving the original rightmost element to the leftmost side of the array. Suppose we need to write a program that rotates all elements of an array to the right by k positions. This problem has several different implementation approaches:

#### Naive Method

The most direct method is to move all elements to the right by one position in each round, repeating for k rounds.

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

Time complexity: Each rotation operation takes $O(n)$ time, and we rotate k times, so the total time complexity is $O(nk)$. However, in the worst case, such as when k is close to n/2, the time complexity becomes $O(n^2)$. Space complexity: We only used one extra variable, `previous`, so the space complexity is $O(1)$.

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

This method uses a temporary array to store data. Since we can directly calculate the new position of each element after the rotation, we can directly copy the original data to its target position in the new array. Time complexity: First, copying the original array to a new array takes $O(n)$ time. Then copying the data back from the new array to the original array also takes $O(n)$ time. Therefore, the total time complexity is $O(n)$. Space complexity: Because an extra array `rotated` is created to store the rotated data, the space complexity is $O(n)$. Compared to the previous algorithm, this one trades space for time.

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

This algorithm first defines a `reverse` function, which is a helper function that reverses the order of all elements in the array by swapping corresponding elements from the front and back. In the main function, three reversals are performed to complete the rotation. The first reversal reverses the entire array, for example, `[1,2,3,4,5,6,7]` becomes `[7,6,5,4,3,2,1]` after reversal. The second reversal reverses the first k elements. For example, with k=3, after reversal we get `[5,6,7,4,3,2,1]`. Finally, reverse the remaining elements to get `[5,6,7,1,2,3,4]`. The core idea of this method is that through appropriate reversals, the array can be rotated to the specified position without moving elements one by one.

Time complexity: Each reversal has a time complexity of $O(n)$. We performed three reversal operations, so the total time complexity is still $O(n)$. Space complexity: Since only a constant amount of space is used to store indices and perform swap operations, the space complexity is $O(1)$.

### Finding Duplicate Elements

To check whether an array contains duplicate elements, there are also multiple approaches, and the algorithm should be chosen based on specific requirements. The most intuitive algorithm uses a set. Since sets do not allow duplicates, if during the process of adding array elements one by one to the set, an element is already present in the set, it is a duplicate element.

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

Time complexity: Traversing the entire array takes $O(n)$, and both set lookup and insertion are $O(1)$, so the total time complexity is $O(n)$. Space complexity: In the worst case, if there are no duplicates in the array, every element must be inserted into the set, which is equivalent to copying all elements, so the space complexity is $O(n)$.

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

In the program above, we initially define two pointers, p1 and p2, pointing to the start of nums1 and nums2 respectively. In a loop, we execute the following steps until either p1 or p2 reaches the end of its array: compare nums1[p1] and nums2[p2]. Append the smaller element to the merged list and increment the corresponding pointer (p1 or p2).

When one pointer reaches the end of its array, simply append the remaining data from the other array to the end of the result list.

Time complexity: The program above processes every element in both arrays, so the time complexity is $O(m+n)$, where m and n are the lengths of the two arrays respectively. The space complexity is also $O(m+n)$, because every element is copied into a new array.

## Sorting

In interviews, sorting algorithms are probably the most discussed topic related to arrays.

### Basic Algorithms

The simplest sorting algorithms are the following three. Imagine we have a pile of apples and we need to sort them from largest to smallest by size. We could:
* Usually, we would first pick out the largest one and place it in front of us; then pick the largest one from the remaining apples and place it second; then pick the third one... This sorting algorithm is called **Selection Sort**.
* Some people prefer another way of sorting: randomly pick one apple from the pile and place it in front of us; randomly pick another apple, compare it with the one in front, if the new apple is bigger, place it in front, otherwise place it behind; then pick another apple, compare it one by one with all the apples in front, and insert the new apple in a position where it is smaller than the one before it and larger than the one after it... This sorting algorithm is called **Insertion Sort**.
* There is another similar algorithm called **Bubble Sort**: Suppose we have a row of unsorted apples in front of us. We first compare the two rightmost apples. If the left one is larger, leave them as is; if the right one is larger, swap their positions. Then compare the second and third apples from the right, again if the left one is larger, leave them as is; if the right one is larger, swap them. Then compare the third and fourth from the right... After one round like this, we can guarantee that the largest apple has been moved to the leftmost position. If we do the same operation for another round, we can guarantee that the second largest apple has been moved to the second position from the left. After n rounds of the same operation, n apples will all be sorted.

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

When writing sorting algorithms, to conserve resources, you should try to modify the original array directly, rather than allocating new memory to store the sorting result.

The most popular sorting algorithm on planet Pythora is Bubble Sort, because the people there are lazy and Bubble Sort is the shortest program. For the three sorting algorithms above, each time an element is placed correctly, all other remaining elements must be compared or moved. To sort n pieces of data, n rounds are needed, and each round requires an average of n/2 operations. Overall, the time complexity of these algorithms reaches the quadratic level, i.e., $O(n^2)$. If the reader tests with a large array, they will find that the above algorithms are much slower than the sorting algorithm built into LabVIEW. Why are they slow? The three algorithms above are slow because sorting does not actually require comparing every element with every other element. For example, with three numbers a, b, and c, if we have already determined that a > b and b > c, then there is no need to compare a and c. It is these extra comparison operations that reduce the efficiency of the above algorithms.

### Quick Sort

Some algorithms optimize for the problem above by eliminating redundant comparisons. The most widely used one is the **Quick Sort** algorithm: Continuing with the apple sorting example, we first randomly pick one apple from the pile as the pivot and compare all other apples with it. All apples larger than it are placed to its left; all apples smaller than it are placed to its right. This way, the apples on the table are divided into one in the middle, a pile on the left, and a pile on the right. We can be certain that any apple in the left pile is definitely larger than any apple in the right pile. Therefore, no apple on the left needs to be compared with any apple on the right again. Next, we randomly pick one apple from the left pile as the pivot again, and follow the same method to divide the left pile into three smaller piles; then do the same for the right pile. Repeat this process recursively until each small pile has only one apple, at which point the sorting is complete.

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

Quick Sort is the most commonly used sorting algorithm in real-world projects, and many programming languages' built-in sorting algorithms use Quick Sort. This sorting algorithm eliminates all unnecessary comparisons, reducing the time complexity to $O(n\log_2 n)$.
Quick Sort has a serious problem in the worst case: when the input array is already mostly sorted with only a few elements out of place, each time the data is split into two groups, the resulting groups are highly asymmetric — one half has only one or two elements, while the rest are in the other half. In this case, it takes nearly n splits to sort the data, and the time complexity degrades to $O(n^2)$.

### Merge Sort

Remember the example above about merging two sorted arrays? The core of the merge algorithm is merging two sorted arrays. We can treat each element of an array as an array itself, because an array with only one element can be considered already sorted. Then we pair up these small arrays and merge them in sorted order. This halves the number of arrays while doubling the length of each array. Continue pairing up the resulting arrays and merging them in sorted order. Repeat this process until all elements are merged into a single array.

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

Compared to Quick Sort, the Merge Sort algorithm is more complex to implement. However, it also has clear advantages: its time complexity in the worst, best, and average cases is all $O(n\log_2 n)$, where n is the length of the sequence.

Can sorting be made even faster? If sorting is done by comparing the sizes of elements in an array, n pieces of data require at least $n * \log_2 n$ comparisons, so it cannot be faster.

### Counting Sort

Some special sorting problems do not require comparing data but can be sorted through indexing. The time complexity of array indexing is $O(1)$, which is very fast, so these sorting algorithms can break through the $n * \log_2 n$ limit. A representative example is Counting Sort.

For example, if we need to sort the following set of integers: 5, 4, 2, 8, 7, we can first create an array for counting (this is also where Counting Sort gets its name). The length of this counting array must be greater than the maximum value in the original array. In the example above, the largest number among those to be sorted is 8, so we can allocate an array of length 10 for counting. Next, examine the data to be sorted one by one. The first number is 5, so increment the 5th element of the counting array by one; the second number is 4, so increment the 4th element of the counting array by one... When the counting is complete, construct a new data array from front to back based on the records in the counting array, and this will be the sorted data array.

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

The time complexity of Counting Sort is $O(n)$, which is one level lower than Quick Sort. It can also be seen from the program above that it has no nested loops, indicating that the number of computations is linearly related to the length of the input data. Although Counting Sort is fast, its applicable range is very limited. Quick Sort can sort any comparable objects, but Counting Sort is only applicable to non-negative integers, and only for small-range integers is it very fast. Therefore, Counting Sort is far less widely used than Quick Sort.

## The sorted() Higher-Order Function

Python's built-in `sorted()` function uses an algorithm called Timsort. It is a hybrid stable sorting algorithm that combines Merge Sort and Insertion Sort, specifically optimized for partially ordered data in the real world: for smaller data blocks or approximately sorted data blocks, `sorted()` uses Insertion Sort; for larger input, `sorted()` first divides them into small blocks, each still using Insertion Sort, and then uses Merge Sort to combine the sorted results of the small blocks.
