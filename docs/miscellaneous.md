# 一些好玩的程序


## 打印自身的程序

### Quine 算法

如果程序保存在文件中，最简单的方式是让程序读取自己所在的文件，然后把它打印出来：

```python
print(open(__file__).read())
```

如果程序只在内存中，或者不可以调用文件读写函数，那么可以采用 Quine 算法，也叫“自产生程序”。它是以美国哲学家奎恩（Willard Van Orman Quine）命名的算法。它的工作原理大致如下：

- 把程序划分成两个主要部分： A 和 B
   - 我们先定义一个函数 Q，对于字符串 A，Q(A) 在执行后会变成字符串 B。
   - A 部分是用字符串表示的 B 部分的代码
   - B 部分的代码可以接收一段字符串 A，然后调用函数 Q 计算出 Q(A)，然后打印出 A 和 Q(A)

### `repr()` 函数

在编写 Python 代码之前，先要介绍一下 Python 自带的 `repr()` 函数。`repr()` 函数运行后返回一个输入对象的“官方”字符串表示，这个字符串通常可以用来重新创建该对象。其主要目的是调试和开发。

`repr()` 的输出主要是给开发者看的，其目的是明确无误地表达对象的类型和（最关键的）特征。不同于 `str()` 函数，`str()` 更注重于可读性，而 `repr()` 更注重于明确性和一致性。如果输入的对象是 Python 内置类型，这个字符串可以直接用 Python 表达式来计算得到相应的对象。

比如运行下面的程序，可以看出 repr() 的特点：

```python
x = "abc"
print(str(x))   # 输出是没有引号的，这就是字符串的打印结果： abc
print(repr(x))  # 输出是带有引号的，表示如果的对象是一个字符串： 'abc'
```

对于我们自己定义的对象，可以通过在类中定义 `__repr__()` 方法来为自定义对象实现 `repr()` 函数的效果。当 `repr(obj)` 被调用时，Python 会寻找 `obj` 的类定义中的 `__repr__()` 方法，并执行它。比如：

```python
class Test:
    def __init__(self, value):
        self.value = value

    def __repr__(self):
        return f'Test({self.value!r})'

# 创建 Test 对象
obj = Test('hello world')

# 使用 repr() 函数
print(repr(obj))  # 输出：Test('hello world')

# 内置类型的例子
print(repr(123))        # 输出：'123'
print(repr([1, 2, 3]))  # 输出：'[1, 2, 3]'
```

在这个例子中，`Test` 类定义了 `__repr__()` 方法，该方法返回一个格式化字符串，展示了如何创建一个与当前对象具有相同值的新对象。这种做法提高了代码的可读性和可维护性，尤其是在调试时。


### Python 的自产生程序

借助 repr 机制，我们可以在 Python 中轻松的编写一段自产生程序：

```python
x = 'y = "x =" + repr(x) + "\\n"\nprint(y+x)'
y = "x =" + repr(x) + "\n"
print(y+x)
```

上面这段代码中第一行是 Quine 算法的 A 部分，它定义了一个用字符串表示的 B 部分的代码。程序的后两行是 B 部分。

Python 中，还可以使用 `%r` 这个字符串格式化符号，隐式调用 repr() 函数，把一个对象直接嵌入到一段字符串中去。使用 `%r` 格式化符号，可以让自产生程序更简洁：

```python
x='x=%r;print(x%%x)';print(x%x)
```

## 解决数独问题

数独（Sudoku）是一种数字谜题游戏，源自日本，名字意为"数字独立"。它的基本玩法是在一个 9×9 的格子中填入数字，并遵循以下规则：
- 每行必须包含 1 到 9 的数字，且不能重复。
- 每列必须包含 1 到 9 的数字，且不能重复。
- 每个 3×3 的小方格（区域）必须包含 1 到 9 的数字，且不能重复。
通常，数独谜题的初始盘面会预填一些数字，玩家需要根据这些已知数字，推理出剩余格子中的正确数字。

### 解法 1 - 排除法

通常，设计的比较好的，相对简单的数独游戏，会有一个不需要猜测，直接推理就可以得到的唯一解。对于这类简单游戏，可以采用以下思路解决问题：

从左到右、从上到下地扫描每一行、每一列。针对每个单元格，判断有哪些可供选择的，在每行、每列和每个区域内都没出现过的数字。如果找到了只有一个可能数字的空格，则可以填入那个唯一个能的数字作为答案。重复这一过程，直到每个单元格都被填满数字即可。

这个算法的优点是运行速度快，但它只能解决简单的数独问题。如果程序返回的结果仍然还有空格（数字 0），那么说明问题比较复杂，需要采取其它解决方法。

程序如下：

```python
# 用一个二维列表表示数独问题。0 表示空格，其它数字是问题给定的初始数字
sudoku_puzzle = [
    [2, 0, 0, 0, 0, 0, 6, 9, 0],
    [0, 5, 0, 0, 0, 3, 0, 0, 0],
    [1, 7, 0, 0, 0, 9, 4, 0, 5],
    [0, 0, 3, 0, 2, 5, 0, 1, 8],
    [0, 0, 0, 0, 4, 0, 0, 0, 0],
    [7, 2, 0, 3, 8, 0, 5, 0, 0],
    [5, 0, 2, 6, 0, 0, 0, 4, 1],
    [0, 0, 0, 5, 0, 0, 0, 7, 0],
    [0, 6, 7, 0, 0, 0, 0, 0, 3],
]

def get_block_numbers(position, grid):
    """返回一个 3x3 区域内所有已经存在的所有数字。"""
    block_row, block_col = position[0] // 3, position[1] // 3
    return [grid[r + 3 * block_row][c + 3 * block_col] for r in range(3) for c in range(3)]

def get_possible_numbers(position, grid):
    """返回当前位置，可以填写的所有数字"""
    if sudoku_puzzle[position[0]][position[1]] > 0:
        return {sudoku_puzzle[position[0]][position[1]]}

    row_numbers = set(grid[position[0]])
    col_numbers = set(row[position[1]] for row in grid)
    block_numbers = set(get_block_numbers(position, grid))

    all_numbers = set(range(1, 10))
    used_numbers = row_numbers | col_numbers | block_numbers
    return all_numbers - used_numbers

def solve_sudoku(grid):
    """使用排除法解决数独问题"""
    solved = False
    while not solved:
        solved = True
        for i in range(9):
            for j in range(9):
                if grid[i][j] == 0:
                    possible_numbers = get_possible_numbers((i, j), grid)
                    if len(possible_numbers) == 1:
                        grid[i][j] = possible_numbers.pop()
                        solved = False

    print("答案：")
    for row in grid:
        print(row)

# 主程序入口
solve_sudoku(sudoku_puzzle)
```

### 解法 2 - 回溯法

如果不能确定给定的数独问题是否具有唯一解，那么就需要采用一种更复杂的解法：从左到右、从上到下地针对每个单元格，列出其目前有可能可以填入的数字，然后逐一尝试，也就是先填入一个可能的数字，继续解决下一个单元格。如果后续解题过程中出现冲突，说明之前假设错误，可以回溯到之前的状态，再选择尝试其它可能的数字。直到找到可以满足所有单元格的数字组合方式。

这种算法速度较慢，适用于难度较大的数独问题。如果问题有多个解，它会打印出所有有效的解法。

程序如下：

```python
# 用一个二维列表表示数独问题。0 表示空格，其它数字是问题给定的初始数字
sudoku_puzzle = [
    [0, 0, 0, 0, 0, 0, 2, 0, 8],
    [9, 2, 0, 0, 0, 4, 0, 0, 0],
    [0, 0, 0, 2, 0, 8, 0, 7, 1],
    [0, 3, 6, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 7, 0, 9, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 6, 4, 0],
    [8, 6, 0, 4, 0, 1, 0, 0, 0],
    [0, 0, 0, 9, 0, 0, 0, 2, 7],
    [2, 0, 9, 0, 0, 0, 0, 0, 0],
]

# 列出 9*9 宫格内的所有位置，方便程序中使用
all_positions = [(row, col) for row in range(9) for col in range(9)]

# 为数独 9*9 宫格生成一个副本，用于保存答案
solution = [row[:] for row in sudoku_puzzle]


def get_block_numbers(position, grid):
    """返回一个 3x3 区域内所有已经存在的所有数字。"""
    block_row, block_col = position[0] // 3, position[1] // 3
    return [grid[r + 3 * block_row][c + 3 * block_col] for r in range(3) for c in range(3)]


def get_possible_numbers(position, grid):
    """返回当前位置，可以填写的所有数字"""
    if sudoku_puzzle[position[0]][position[1]] > 0:
        return [sudoku_puzzle[position[0]][position[1]]]

    row_numbers = set(grid[position[0]])
    col_numbers = set(row[position[1]] for row in grid)
    block_numbers = set(get_block_numbers(position, grid))

    all_numbers = set(range(1, 10))
    used_numbers = row_numbers | col_numbers | block_numbers
    return all_numbers - used_numbers


def solve_sudoku(position_index, grid):
    """使用递归方法解决数独问题"""
    if position_index == 81:
        print("\nSolution:\n")
        for row in grid:
            print(row)
        return True

    position = all_positions[position_index]
    possible_numbers = get_possible_numbers(position, grid)

    for number in possible_numbers:
        grid[position[0]][position[1]] = number
        if solve_sudoku(position_index + 1, grid):
            return True

    grid[position[0]][position[1]] = sudoku_puzzle[position[0]][position[1]]
    return False


# 主程序入口
solve_sudoku(0, solution)
```

## 解决 24 点问题

24 点是一种简单的使用扑克牌作为道具的数学计算游戏，玩法是：随机抽取 4 张牌，用牌面的数字和加减乘除运算组合起来，计算出 24 这个数字。比如抽到的 4 张牌上的数字分别为 1, 2, 3, 4 那么 就可以通过 1 * 2 * 3 * 4 来的到目标 24。对于任意的 4 个数字，可能会有很多种方法计算得到 24，比如 (1 + 2 + 3) * 4 也可以得到 24。多数情况下，还是比较容易找到一种解法的；也有的数字组合不容易找到解，甚至根本不存在解。

