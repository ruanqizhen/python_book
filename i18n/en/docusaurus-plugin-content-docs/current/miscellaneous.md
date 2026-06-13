# Some Fun Programs

Python is not just for crunching numbers, building web apps, or running machine learning algorithms; it is also a fantastic tool for writing creative, mind-bending, and purely entertaining programs.

## Coding with Chinese Identifiers

Because Python 3 source code is UTF-8 encoded by default, you can use any Unicode character classified as a "letter" (including Chinese characters) as variable names, function names, and class names. While English is the standard for professional development, using native language identifiers can be very helpful for educational purposes or in domain-specific systems (like finance or law) where local terminology is highly specialized.

The following demonstration is a text-based RPG duel. Except for Python's reserved keywords (like `def`, `class`, `if`, `while`, `import`, and `return`), all class names, method names, variable names, and outputs are written entirely in Chinese to showcase this capability.

```python
import random as 天意
import time as 时光

# 将 Python 内置函数取个中文别名，显得更"原生"
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
            输出(f"aaa {本座.名号} 吐出一口鲜血，支撑不住了！")
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

If you run this program, the console will output something like the following:

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





## Self-Reproducing Programs (Quines)

### What is a Quine?

If a program is saved as a file on disk, the simplest way to print its own source code is to read the file itself using `__file__`:

```python
print(open(__file__).read())
```

However, what if the program is running entirely in memory without file system access? A program that prints its own source code *without* reading its own file is called a **Quine**, named after the American philosopher Willard Van Orman Quine. The mathematical logic behind a Quine involves partitioning the program into two parts:

- **Part A**: A text string containing the instructions of Part B.
- **Part B**: A set of instructions that reads the string from Part A, computes its representation, and prints both Part A and Part B.

### The `repr()` Function

Before writing a Quine in Python, we must understand the built-in `repr()` function. `repr()` returns a formal string representation of an object that, when evaluated as a Python expression, can recreate the object itself. It is primarily used for debugging and logging.

While `str()` formats an object for human readability, `repr()` ensures clarity and unambiguity by showing its exact type and characteristics. For example, passing a string to `str()` prints the raw text, but `repr()` prints it with literal quotation marks.

For example, running the following program shows the characteristics of repr():

```python
x = "abc"
print(str(x))   # 输出是没有引号的，这就是字符串的打印结果： abc
print(repr(x))  # 输出是带有引号的，表示如果的对象是一个字符串： 'abc'
```

To define the `repr()` behavior for your own classes, implement the magic method `__repr__()`. When `repr(obj)` is called, Python executes this method under the hood:

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

Returning a format that mirrors the constructor syntax is a Python best practice, as it allows developers to easily inspect and recreate the object during debugging.


### Writing a Python Quine

Using the `repr()` mechanism, we can write a short, self-reproducing Quine in just three lines of Python:

```python
x = 'y = "x =" + repr(x) + "\\n"\nprint(y+x)'
y = "x =" + repr(x) + "\n"
print(y+x)
```

In the code above, the first line is part A of the Quine algorithm, which defines the code of part B represented as a string. The last two lines of the program are part B.

We can make this even shorter by using string formatting. The `%r` format placeholder implicitly calls `repr()` on its argument. By combining this with string modulo evaluation, we can write a one-line Quine:

```python
x='x=%r;print(x%%x)';print(x%x)
```

## Solving Sudoku Puzzles

Sudoku is a popular grid-based logic puzzle. The goal is to fill a 9x9 grid with digits from 1 to 9 such that:
- Each row must contain the numbers 1 to 9 without repetition.
- Each column must contain the numbers 1 to 9 without repetition.
- Each 3x3 small square (region) must contain the numbers 1 to 9 without repetition.

The puzzle starts with a partially filled grid, and the player must deduce the missing numbers using logic.

### Approach 1: The Elimination Method

Many beginner-level Sudoku puzzles can be solved entirely through logic and elimination, without any guessing. For these puzzles, we can write an algorithm that runs as follows:

Iterate through the cells row by row. For each empty cell, compute the set of candidate numbers that do not violate any row, column, or 3x3 block constraints. If a cell has exactly one valid candidate, fill it in. Repeat this sweep until the board is fully solved.

This approach is extremely fast but will fail to complete harder puzzles where cells can have multiple valid candidates. If the grid still contains empty spaces (represented by `0`), we must transition to a search-based algorithm.

The program is as follows:

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

### Approach 2: Backtracking (Depth-First Search)

To solve any valid Sudoku puzzle, we can use a **backtracking** algorithm. Starting from the first empty cell, the program tries a candidate number and recursively attempts to solve the remaining board. If it encounters a dead-end (no valid numbers are left for a cell down the line), it rolls back the choice, returns to the previous cell, and tries the next candidate. This search continues until a valid configuration is found.

While computationally more expensive than the elimination method, backtracking guarantees a solution for any solvable grid. If the puzzle has multiple solutions, the solver will print all valid solutions.

The program is as follows:

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

## Solving the "24 Game"

The 24 Game is a popular math puzzle usually played with cards. The objective is to take four integers and combine them using addition, subtraction, multiplication, and division to get exactly 24. For example, given `1, 2, 3, 4`, a simple solution is `1 * 2 * 3 * 4 = 24`, or `(1 + 2 + 3) * 4 = 24`. While most sets of four numbers have solutions, some are tricky, and some have no solution at all.

We can use two methods to solve the 24 Game problem.

### Approach 1: A Recursive Solution

A simple recursive search can find solutions by combining numbers one by one. It takes two numbers, applies the operators to get candidate values, then recursively combines those with the next number, and so on. However, this simple recursive structure misses parenthetical pairings where numbers are computed in pairs first (e.g., `(a + b) * (c + d)`). Here is the code for the simplified search:

```python
from typing import List, Callable, Dict

# 定义运算符和所对应的运算的 Lambda 函数
Operators: Dict[str, Callable[[float, float], float]] = {
    "+": lambda a, t: t - a,
    "-": lambda a, t: a - t,
    "*": lambda a, t: t / a if a != 0 else None,
    "/": lambda a, t: a / t if t != 0 else None,
}

def calculate(numbers: List[int], target: float, message: str = ''):
    if len(numbers) == 1:
        if numbers[0] == target:
            print(f"{message[:-1]}{numbers[0]}))")
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

### Approach 2: A Comprehensive Solution

To find all mathematically valid solutions—including those with paired parentheses—we partition the four numbers into two subsets, evaluate the combinations within each subset first, and then apply the operators between the two resulting values. Here is the comprehensive solver:

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
    return {numbers[i]: numbers[:i] + numbers[i+1:] for i in range(len(numbers))}

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
    for num, others in all_1_3_groups(numbers).items():
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
