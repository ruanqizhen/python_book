# ......


## 正在添加中 ......

### 最长连续序列：

给定一个未排序的整数数组，找到最长连续序列的长度。

```
def longest_consecutive(nums):
    if not nums:
        return 0

    num_set = set(nums)
    longest_streak = 0

    for num in num_set:
        if num - 1 not in num_set:
            current_num = num
            current_streak = 1

            while current_num + 1 in num_set:
                current_num += 1
                current_streak += 1

            longest_streak = max(longest_streak, current_streak)

    return longest_streak

# 示例
nums = [100, 4, 200, 1, 3, 2]
print(longest_consecutive(nums))  # 输出: 4，因为最长连续序列是 [1, 2, 3, 4]
```