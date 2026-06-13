# Some Fun Programs

Python can not only handle tedious data and complex algorithms, but it can also be used to write extremely interesting, creative, and even mind-blowing programs.

## Programming in Pure Chinese

Python 3 treats source code as UTF-8 encoded. This means that any character classified as a "letter" in the Unicode character set (including Chinese characters) can be used as an identifier. In certain specific domains (such as teaching non-English native speakers, or in financial/legal systems with extremely complex business logic), using Chinese variable names can sometimes improve code readability for domain experts.

The following demonstration is a text-based martial arts mini-game called "Duel at the Forbidden City." In this program, except for Python's reserved keywords (such as def, class, if, while, import, return, etc.), all custom names are written in Chinese.

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





## Self-Printing Programs

### Quine Algorithm

If the program is saved in a file, the simplest way is to have the program read its own file and then print it out:

```python
print(open(__file__).read())
```

If the program only exists in memory, or if file reading/writing functions cannot be called, then you can use the Quine algorithm, also known as a "self-reproducing program." It is named after the American philosopher Willard Van Orman Quine. Its working principle is roughly as follows:

- Divide the program into two main parts: A and B
   - First define a function Q, where for string A, Q(A) becomes string B after execution.
   - Part A is the code of Part B represented as a string
   - Part B's code can receive a string A, then call function Q to compute Q(A), and then print A and Q(A)

### The `repr()` Function

Before writing the Python code, let's first introduce Python's built-in `repr()` function. The `repr()` function returns the "official" string representation of an input object, which can typically be used to recreate the object. Its main purpose is debugging and development.

The output of `repr()` is mainly intended for developers, with the purpose of unambiguously expressing the object's type and (most crucially) its characteristics. Unlike the `str()` function, which focuses more on readability, `repr()` focuses more on clarity and consistency. If the input object is a Python built-in type, this string can be directly evaluated as a Python expression to obtain the corresponding object.

For example, running the following program shows the characteristics of repr():

```python
x = "abc"
print(str(x))   # 输出是没有引号的，这就是字符串的打印结果： abc
print(repr(x))  # 输出是带有引号的，表示如果的对象是一个字符串： 'abc'
```

For objects we define ourselves, we can achieve the effect of the `repr()` function for custom objects by defining the `__repr__()` method in the class. When `repr(obj)` is called, Python looks for the `__repr__()` method in the class definition of `obj` and executes it. For example:

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

In this example, the `Test` class defines the `__repr__()` method, which returns a formatted string showing how to create a new object with the same value as the current object. This practice improves code readability and maintainability, especially during debugging.


### Python Self-Reproducing Programs

With the help of the repr mechanism, we can easily write a self-reproducing program in Python:

```python
x = 'y = "x =" + repr(x) + "\\n"\nprint(y+x)'
y = "x =" + repr(x) + "\n"
print(y+x)
```

In the code above, the first line is part A of the Quine algorithm, which defines the code of part B represented as a string. The last two lines of the program are part B.

In Python, you can also use the `%r` string formatting symbol, which implicitly calls the repr() function to embed an object directly into a string. Using the `%r` formatting symbol can make self-reproducing programs more concise:

```python
x='x=%r;print(x%%x)';print(x%x)
```

## Solving Sudoku Puzzles

Sudoku is a number puzzle game originating from Japan. Its basic gameplay involves filling numbers into a 9x9 grid, following these rules:
- Each row must contain the numbers 1 to 9 without repetition.
- Each column must contain the numbers 1 to 9 without repetition.
- Each 3x3 small square (region) must contain the numbers 1 to 9 without repetition.
Typically, the initial board of a Sudoku puzzle has some numbers pre-filled, and players need to deduce the correct numbers for the remaining cells based on these known numbers.

### Solution 1 - Elimination Method

Typically, well-designed, relatively simple Sudoku puzzles have a unique solution that can be obtained through direct reasoning without guessing. For such simple puzzles, the following approach can be used to solve them:

Scan each row and column from left to right, top to bottom. For each cell, determine which numbers are available—those that haven't appeared in the same row, column, or 3x3 region. If a cell is found with only one possible number, fill in that unique number as the answer. Repeat this process until every cell is filled with a number.

The advantage of this algorithm is its fast execution speed, but it can only solve simple Sudoku puzzles. If the result returned by the program still contains empty cells (number 0), it means the puzzle is more complex and requires other solving methods.

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

### Solution 2 - Backtracking

If it is not certain whether a given Sudoku puzzle has a unique solution, then a more complex solving method is needed: for each cell from left to right, top to bottom, list all possible numbers that could be filled in, then try them one by one—that is, fill in one possible number and continue to solve the next cell. If a conflict arises during the subsequent solving process, it means the previous assumption was wrong, and you can backtrack to the previous state and try other possible numbers. This continues until a combination of numbers that satisfies all cells is found.

This algorithm is slower and is suitable for more difficult Sudoku puzzles. If the puzzle has multiple solutions, it will print all valid solutions.

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

## Solving the 24 Game

The 24 Game is a simple mathematical calculation game that uses playing cards as props. The rule is to randomly draw 4 cards and combine the numbers on them using addition, subtraction, multiplication, and division to compute 24. For example, if the numbers on the 4 drawn cards are 1, 2, 3, and 4 respectively, you can get 24 through 1 * 2 * 3 * 4. For any 4 numbers, there may be multiple ways to calculate 24; for example, (1 + 2 + 3) * 4 also gives 24. In most cases, it's relatively easy to find a solution; but sometimes certain number combinations may be difficult to solve, or even have no solution at all.

We can use two methods to solve the 24 Game problem.

### Simplified Solution (Recursive)

The first method is a simplified solution with straightforward logic that can handle most problems. This algorithm first considers two numbers, obtains up to 6 results through addition, subtraction, multiplication, and division, then recursively adds a number to get all results for three numbers, and then recursively adds another number to get all possible results for all 4 numbers. If any result is 24, the problem is solved. However, this recursive method misses one case, where the 4 numbers must first be calculated in pairs before getting the final result, such as (1+2)*(1+7). The code is as follows:

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

### Comprehensive Solution

To comprehensively find every possible answer, we also need to consider the priority of calculations. For example, structures like (a + b) * (c + d). We can first divide the numbers into two groups, compute a result within each group first, and then compute between the two groups' results, which covers all possible calculations. The implementation code is as follows:

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
