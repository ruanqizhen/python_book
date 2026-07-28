# 一些好玩的程序

Python 不仅仅可以用来处理枯燥的数据和复杂的算法，它同样可以用来编写一些极其有趣、富有创意甚至“脑洞大开”的程序。

## 纯中文编程

Python 3 将源代码视为 UTF-8 编码。这意味着只要是 Unicode 字符集中被归类为“字母”的字符（包括汉字），都可以用作标识符。在某些特定领域（如针对非英语母语者的教学，或者特定业务逻辑极其复杂的金融/法律系统），使用中文变量名有时能提高代码对业务专家的可读性。

下面的演示是一个“决战紫禁之巅”的文字武侠小游戏。在这个程序中，除了 Python 的保留关键字（如 def, class, if, while, import, return 等），所有的自定义名称全部使用了中文。

```python
import random as 天意
import time as 时光

# 将 Python 内置函数取个中文别名，显得更“原生”
输出 = print
等待 = 时光.sleep

class 侠客:
    def __init__(本座, 尊姓大名, 初始内力, 独门绝技):
        本座.名号 = 尊姓大名
        本座.内力 = 初始内力
        本座.绝技 = 独门绝技
        本座.状态 = "生龙活虎"

    def 展示名帖(本座):
        输出(f"【{本座.名号}】 踏入了江湖，内力深厚：{本座.内力}")

    def 出招(本座, 对手):
        # 随机决定是否发动暴击
        运势 = 天意.randint(1, 10)
        
        if 运势 > 8:
            伤害 = 天意.randint(25, 40)
            输出(f"⚡ {本座.名号} 怒吼一声，使出了毕生绝学「{本座.绝技}」！")
            输出(f"   天崩地裂！对 {对手.名号} 造成了 {伤害} 点暴击伤害！")
        else:
            伤害 = 天意.randint(10, 20)
            招式列表 = ["黑虎掏心", "白鹤亮翅", "太祖长拳", "扫堂腿"]
            普通一招 = 天意.choice(招式列表)
            输出(f"⚔️ {本座.名号} 使出一招「{普通一招}」，击中了 {对手.名号}。")
            输出(f"   造成了 {伤害} 点伤害。")

        对手.受伤(伤害)

    def 受伤(本座, 伤害值):
        本座.内力 = 本座.内力 - 伤害值
        if 本座.内力 <= 0:
            本座.内力 = 0
            本座.状态 = "重伤倒地"
            输出(f"{本座.名号} 吐出一口鲜血，支撑不住了！")
        else:
            输出(f"   {本座.名号} 剩余内力：{本座.内力}")
            等待(1) # 暂停一下，增加阅读沉浸感

    def 还能再战(本座):
        return 本座.内力 > 0

def 紫禁之巅决斗():
    输出("="*30)
    输出("       🌙 决战紫禁之巅 🌙")
    输出("="*30)
    等待(1)

    # 实例化对象
    剑神 = 侠客(尊姓大名="西门吹雪", 初始内力=100, 独门绝技="一剑西来")
    剑圣 = 侠客(尊姓大名="叶孤城", 初始内力=100, 独门绝技="天外飞仙")

    剑神.展示名帖()
    剑圣.展示名帖()
    
    输出("-" * 30)
    输出("决斗开始！")
    输出("-" * 30)
    等待(1)

    回合数 = 1
    
    # 只要两人都活着，就继续打
    while 剑神.还能再战() and 剑圣.还能再战():
        输出(f"\n--- 第 {回合数} 回合 ---")
        
        # 双方轮流出招
        if 剑神.还能再战():
            剑神.出招(对手=剑圣)
        
        if 剑圣.还能再战():
            剑圣.出招(对手=剑神)
            
        回合数 += 1
        等待(1.5)

    输出("\n" + "="*30)
    if 剑神.还能再战():
        输出(f"🏆 胜者：{剑神.名号}！江湖留下了他的传说。")
    else:
        输出(f"🏆 胜者：{剑圣.名号}！这才是真正的剑道巅峰。")
    输出("="*30)

# 程序入口
if __name__ == "__main__":
    紫禁之巅决斗()
```

如果运行这段程序，控制台会输出类似下面的内容：
```
==============================
       🌙 决战紫禁之巅 🌙
==============================
【西门吹雪】 踏入了江湖，内力深厚：100
【叶孤城】 踏入了江湖，内力深厚：100
------------------------------
决斗开始！
------------------------------

--- 第 1 回合 ---
⚡ 西门吹雪 怒吼一声，使出了毕生绝学「一剑西来」！
   天崩地裂！对 叶孤城 造成了 33 点暴击伤害！
   叶孤城 剩余内力：67
⚔️ 叶孤城 使出一招「黑虎掏心」，击中了 西门吹雪。
   造成了 19 点伤害。
   西门吹雪 剩余内力：81

--- 第 2 回合 ---
⚡ 西门吹雪 怒吼一声，使出了毕生绝学「一剑西来」！
   天崩地裂！对 叶孤城 造成了 37 点暴击伤害！
   叶孤城 剩余内力：30
⚔️ 叶孤城 使出一招「黑虎掏心」，击中了 西门吹雪。
   造成了 10 点伤害。
   西门吹雪 剩余内力：71

--- 第 3 回合 ---
⚔️ 西门吹雪 使出一招「太祖长拳」，击中了 叶孤城。
   造成了 17 点伤害。
   叶孤城 剩余内力：13
⚔️ 叶孤城 使出一招「扫堂腿」，击中了 西门吹雪。
   造成了 13 点伤害。
   西门吹雪 剩余内力：58

--- 第 4 回合 ---
⚔️ 西门吹雪 使出一招「太祖长拳」，击中了 叶孤城。
   造成了 14 点伤害。
aaa 叶孤城 吐出一口鲜血，支撑不住了！

==============================
🏆 胜者：西门吹雪！江湖留下了他的传说。
==============================
```





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
x = 'y = "x = " + repr(x) + "\\n"\nprint(y+x)'
y = "x = " + repr(x) + "\n"
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

24 点是一种简单的数学计算游戏，使用扑克牌作为道具。玩法是随机抽取 4 张牌，通过加减乘除运算组合牌面的数字，计算出 24。例如，抽到的 4 张牌上的数字分别为 1、2、3、4，可以通过 1 * 2 * 3 * 4 得到 24。对于任意的 4 个数字，可能有多种方法计算出 24，例如 (1 + 2 + 3) * 4 也可以得到 24。多数情况下，比较容易找到一种解法；但有时某些数字组合可能难以找到解，甚至根本不存在解。

我们可以用两种方法来解决 24 点问题。

### 简化解法（递归）

第一种方法是简化的解法，逻辑简单易懂，能够处理大部分题目。这个算法首先考虑两个数字，通过加减乘除得到最多 6 个结果，然后递归地增加一个数字，得到所有三个数字的结果，再递归增加一个数字，得到所有 4 个数字的可能结果。如果其中有结果是 24，那么问题就解决了。然而，这种递归方法遗漏了一种情况，即 4 个数字必须先两两计算，然后再得到最终结果，例如 (1+2)*(1+7)。其程序代码如下：

```python
from typing import List, Callable, Dict, Optional

# 定义运算符和所对应的运算的 Lambda 函数（逆向求解用）
Operators: Dict[str, Callable[[float, float], Optional[float]]] = {
    "+": lambda a, t: t - a,
    "-": lambda a, t: a - t,
    "*": lambda a, t: t / a if a != 0 else None,
    "/": lambda a, t: a / t if t != 0 else None,
}

def calculate(numbers: List[int], target: float, message: str = ''):
    if len(numbers) == 1:
        if numbers[0] == target:
            # 动态计算需要的右括号数量，避免硬编码
            depth = message.count('(')
            print(f"{message[:-1]}{numbers[0]}{')' * depth}")
        return
    
    for num in set(numbers):
        remaining = numbers.copy()
        remaining.remove(num)
        for operator, solve in Operators.items():
            result = solve(num, target)
            if result is not None:
                calculate(remaining, result, f"{message}{num}{operator}(")

# 运行测试：
calculate([3, 3, 8, 8], 24)
```

### 全面解法

如果要全面找到每中可能的答案，就还要考虑计算的优先级。例如 (a + b) * (c + d) 这种结构。我们可以把数字先分成两组，组内优先计算出一个结果，两组之间的结果再进行计算，这样就覆盖了所有可能的计算了。其实现代码如下：

```python
from copy import deepcopy
from typing import List
from math import nan

# Define basic operators
Operators = {
    "+": lambda a, b: a + b,
    "*": lambda a, b: a * b,
}

# Define operators that require order consideration
Order_Operators = {
    "-": lambda a, b: a - b,
    "/": lambda a, b: nan if b == 0 else a / b,
}

Target = 24

# Function to print results if they match the target
def print_result(a_value: float, a_string: str, b_value: float, b_string: str):
    for operator, solve in {**Operators, **Order_Operators}.items():
        if abs(solve(a_value, b_value) - Target) < 0.001:
            print(f"{a_string} {operator} {b_string}")
        if operator in Order_Operators and abs(solve(b_value, a_value) - Target) < 0.001:
            print(f"{b_string} {operator} {a_string}")

# Function to generate all 1-3 groups of numbers
def all_1_3_groups(numbers: List[int]):
    # 使用 list 而非 dict，避免重复数字时键覆盖导致分组丢失（如 [1,2,1,7]）
    return [(numbers[i], numbers[:i] + numbers[i+1:]) for i in range(len(numbers))]

# Function to generate all 2-2 groups of numbers
def all_2_2_groups(numbers: List[int]):
    return [
        [(numbers[0], numbers[1]), (numbers[2], numbers[3])],
        [(numbers[0], numbers[2]), (numbers[1], numbers[3])],
        [(numbers[0], numbers[3]), (numbers[1], numbers[2])]
    ]

# Function to process two operands and return results
def process_2_operands(a_value: float, a_string: str, b_value: float, b_string: str):
    results = []
    for operator, solve in {**Operators, **Order_Operators}.items():
        results.append((solve(a_value, b_value), f"({a_string} {operator} {b_string})"))
        if operator in Order_Operators:
            results.append((solve(b_value, a_value), f"({b_string} {operator} {a_string})"))
    return results

# Function to process three operands and return results
def process_3_operands(numbers_3: List[int]):
    results = []
    for num in set(numbers_3):
        numbers = deepcopy(numbers_3)
        numbers.remove(num)
        results_2_operands = process_2_operands(numbers[0], str(numbers[0]), numbers[1], str(numbers[1]))
        for result_2 in results_2_operands:
            results += process_2_operands(num, str(num), result_2[0], result_2[1])
    return results

# Function to process four operands and print results
def process_4_operands(numbers: List[int]):
    for num, others in all_1_3_groups(numbers):
        results_3_operands = process_3_operands(others)
        for result_3 in results_3_operands:
            print_result(num, str(num), result_3[0], result_3[1])
    for group in all_2_2_groups(numbers):
        results_a = process_2_operands(group[0][0], str(group[0][0]), group[0][1], str(group[0][1]))
        results_b = process_2_operands(group[1][0], str(group[1][0]), group[1][1], str(group[1][1]))
        for a in results_a:
            for b in results_b:
                print_result(a[0], a[1], b[0], b[1])
    print("Done.")

# Example usage
process_4_operands([1, 2, 1, 7])
```
