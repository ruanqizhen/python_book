# Recursion

Recursion is a common algorithm in which a function calls itself, either directly or indirectly. Problems that can be solved with recursion can usually be broken down into similar subproblems. These subproblems have the same structure as the original problem but are smaller in scale.

In mathematics, induction is a common method, and recursion can be seen as the programmatic implementation of induction. The strategy of recursion is to transform a large, complex problem into a smaller problem similar to the original, and then further break the problem down into even smaller problems, ultimately solving the entire problem. In theory, all recursive calls can be replaced by loop structures. However, in some cases, recursion can significantly reduce code complexity, help shorten programming time, and improve code readability. For example, implementing tree traversal, quicksort, the Tower of Hanoi, etc., with loops requires manually maintaining a [Stack data structure](deque), which is much more cumbersome than implementing a recursive algorithm. Therefore, learning how to implement recursion is still very useful.

## Calculating Factorial

Let's look at the simplest example: calculating factorial. Calculating the factorial of a positive integer means multiplying that number by every smaller positive integer. For example, the factorial of 3 is written as `3! = 3*2*1`; similarly `6! = 6*5*4*3*2*1`. If we use a loop to calculate the factorial of n, we simply multiply all positive integers less than or equal to n:

```python
def factorial(n):
    result = 1
    for i in range(1, n+1):
        result *= i
    return result

print(factorial(5))  # Output: 120
```

But we can also think about calculating factorial in another way: instead of computing directly from the original data, we can use induction to simplify the problem step by step. For example, the factorial of 6 can be calculated by first computing the factorial of 5 and then multiplying the result by 6. Described by a formula: $0! = 1, \quad n! = n \times (n-1)! \quad \text{for } n \geq 1$, or written in function form as: $F(0) = 1, \quad F(n) = n \times F(n-1) \quad \text{for } n \geq 1$. Mathematical induction must always have a base case. For the factorial problem, the base case is 0, where the factorial of 0 equals 1 — this is defined by convention. Some readers may have noticed that the factorial expressed by induction is not exactly the same as the direct computation. Induction extends the factorial calculation to all non-negative integers, while the direct computation can only calculate the factorial of positive integers. This is a small advantage of induction.

Here is the factorial function implemented using recursion:

```python
def factorial(n):
    # Base case
    if n == 0:
        return 1
    # Recursive case
    else:
        return n * factorial(n-1)

print(factorial(5))  # Output: 120
```

When designing a recursive algorithm, you must be clear about two conditions:
* **Base Case**: Every recursive function needs one or more base cases. When a base case is met, the function directly returns a value without making any further recursive calls to itself.
* **Recursive Case**: This is the part where the function continues to call itself, typically when dealing with a problem that has been reduced in size or moved closer to the base case.

In the example above, when n is 0, the function directly returns 1 (the base case). Otherwise, the function recursively calls itself to calculate the factorial of n-1 and multiplies the result by n.

## Calculating the Fibonacci Sequence

The factorial problem is too simple to fully demonstrate the advantages of recursion. Let's consider a slightly more complex problem: the Fibonacci sequence.

This problem was used by the Italian mathematician Fibonacci to describe the number of rabbit breeding pairs:
* At the beginning of the first month, there is a pair of newborn rabbits.
* After the second month (at the beginning of the third month), they become fertile.
* Each month, every fertile pair gives birth to a new pair of rabbits.
* Rabbits never die.

The total number of rabbits each month can be described using mathematical induction:

$$
\begin{aligned}
F(0) &= 0 \\
F(1) &= 1 \\
F(n) &= F(n-1) + F(n-2), \quad \text{for } n \geq 2
\end{aligned}
$$

The mathematical induction formula for this problem is concise and clear, making it very suitable for a recursive algorithm. First, we write the base cases of the induction, which are also the termination conditions of the recursion: when the input is 0 and 1, output 0 and 1 respectively:

```python
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)

# Test
n = 10
for i in range(n):
    print(fibonacci(i), end=" ")
```

Running the above code will print the first 10 numbers of the Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34. Readers can test it with an input no larger than 20 to see if the result is correct. But do not try a large input (greater than 30), because although the algorithm above is functionally correct, it has a huge efficiency defect — when the input is greater than 30, its computation will be very, very slow. Let's analyze the execution process of the program above. Suppose the input value is 20, the program will make two recursive calls to calculate two subproblems:
* First, it calculates the Fibonacci number of 19. Internally, the program will again make two recursive calls, one to calculate the Fibonacci number of 18...;
* Then it calculates the Fibonacci number of 18. But the Fibonacci number of 18 was already calculated in the previous recursive branch — now it has to be recalculated!

We can represent the calling relationships above using a binary tree:

![images/006.png](images/006.png "Recursive call tree")

With such an algorithm, every time the input value increases by 1, the program's computation doubles. That is, the program's computation is exponentially related to the size of the input data, with a time complexity of $O(2^n)$. This is a common efficiency problem that occurs when writing recursive programs: the same computation is performed many times in different places.

Note: More strictly speaking, the complexity of this method for calculating Fibonacci numbers is $O(\varphi^n)$ or $O(1.618^n)$, with $O(2^n)$ being a simplified upper bound.

Below we discuss several approaches to solving this efficiency problem.

### Recursion with Caching

Since the inefficiency is caused by the same computation being performed multiple times, the most direct and simple solution is to record the result of each computation. If the same computation is encountered again later, directly use the recorded result instead of recomputing it. The specific implementation method is: set up a cache in the program. Each time you enter the recursive function, first check whether the result for the data to be computed is already recorded in the cache. If it is, directly retrieve the previously recorded result from the cache. If the desired result is not in the cache, then perform the computation and record the result in the cache. Because the program checks the cache before computing each value, it avoids redundant computation.

The cache can be built using any data structure. For example, we can temporarily store the computation results in a dictionary. Below is a program for calculating Fibonacci numbers with caching added:

```python
cache = {}

def fibonacci(n):
    if n in cache:
        return cache[n]
    if n <= 1:
        return n
    else:
        result =  fibonacci(n - 1) + fibonacci(n - 2)
        cache[n] = result
        return result

# Test
n = 38
for i in range(n):
    print(fibonacci(i), end=" ")
```

It is entirely consistent with the basic recursive algorithm without caching. The only change is that before actually starting the computation, it first checks whether the data to be computed is already in the cache. If so, it directly returns the result retrieved from the cache. If the result is not in the cache, it performs the recursive computation, but before returning the result, it inserts the computed result into the cache.

After this efficiency improvement, the program can compute Fibonacci numbers for larger values. Adding a cache to certain computation-intensive functions is a very common strategy. We don't even need to write the caching logic ourselves — there are ready-made methods available, such as using a [decorator that caches function results](decorator#缓存函数的结果).

### Avoiding Tree Recursion

Another idea to improve efficiency is to ensure that each computation step only makes one recursive call to itself, which also avoids redundant computation. The specific method is as follows: when computing the nth step, we need to add the results of the (n-1)th and (n-2)th steps. But the result of the (n-2)th step is also used when computing the (n-1)th result. That is, each result will be used by the two subsequent computations, so we just need to pass this result as the function's output to the two subsequent computations.

Using this approach to write the program, the function has two inputs, a and b, which record the results of the previous two computations.
- a: the value of $F(k+1)$
- b: the value of $F(k)$. Each recursion effectively increases $k$ by 1. At this point, the new $a'$ becomes $a+b$ ($F(k+2)$), and the new $b'$ becomes $a$ ($F(k+1)$).

When the input n is 0, which is the termination condition of the recursion, return the value of b:

```python
def fibonacci(n, a, b):
    if n <= 0:
        return b
    else:
        return fibonacci(n - 1, a + b, a)

# Test
n = 10
for i in range(n):
    print(fibonacci(i, 1, 0), end=" ")
```

The advantage of using this recursive algorithm is improved efficiency. The disadvantage is that the algorithm simulates a loop approach and does not directly correspond to the mathematical induction description of the Fibonacci numbers, making it less intuitive to understand. Programmers sometimes need to make trade-offs between runtime efficiency and readability.

### Formula for Calculating Fibonacci Numbers

This section uses the Fibonacci numbers as an example for explaining recursive algorithms. However, if we only consider the Fibonacci numbers themselves, they do not necessarily have to be computed using recursion. For example, they can also be computed using a loop: to find the Fibonacci number of n, calculate from small to large — first calculate the Fibonacci number of 0, then 1, then 2... iterate n times to get the Fibonacci number of n. However, the most efficient algorithm is to use the closed-form formula for Fibonacci numbers, which is:

$F(n) = \frac{{\varphi^n - (1 - \varphi)^n}}{{\sqrt{5}}}$, where $\varphi$ is the golden ratio, with a value of $\frac{{1 + \sqrt{5}}}{{2}}$.

```python
import math

def fibonacci(n):
    phi = (1 + math.sqrt(5)) / 2
    fib_n = round((phi**n - (1 - phi)**n) / math.sqrt(5))
    return fib_n

n = 10
for i in range(n):
    print(fibonacci(i), end=" ")
```

### 1/89

Now that we've discussed the Fibonacci numbers, let's mention an interesting aside. 89 is the twelfth Fibonacci number, and its reciprocal 1/89 is also closely related to the Fibonacci numbers. When written in decimal form, its decimal places happen to form the Fibonacci sequence:

1/89 = 0.011235....

Is this just a coincidence, or is there indeed some connection between the two? Interested readers can derive and verify this on their own.

## Indirect Recursion

Indirect recursion involves two or more functions calling each other. Below is a simple example with two functions, functionA and functionB, which call each other to implement indirect recursion:

```python
def functionA(n):
    if n <= 0:
        return
    print(f"From functionA: {n}")
    functionB(n-1)

def functionB(n):
    if n <= 0:
        return
    print(f"From functionB: {n}")
    functionA(n-2) # Decrease by 2 to ensure we can eventually exit the recursion

# Call the function
functionA(10)
```

In the example above, functionA calls functionB, and functionB calls functionA again, until n reaches or falls below 0 and stops.

Next, let's introduce a slightly more complex example: writing a program to parse arithmetic expressions. As an example, we simplify the difficulty of the problem:

* The data in arithmetic expressions can only be positive integers.
* The operators are only addition, subtraction, multiplication, and division.
* Parentheses can be used.
* The expression must be correct, with no spaces or other symbols.

For example, the program needs to evaluate an expression like `30+8*(13-5)/6`. We can consider using a recursive algorithm:

```python
# Handle addition and subtraction
def process_add_sub(s):
    # First, consider whether higher-precision multiplication and division needs to be computed
    value, pos = process_mul_div(s)
    # If the position hasn't reached the end of the string, and the current character is a plus or minus sign
    while pos < len(s) and (s[pos] == '+' or s[pos] == '-'):
        # Parse the next sub-expression consisting of multiplication and division
        next_value, next_pos = process_mul_div(s[pos+1:])
        # Perform the operation based on the plus or minus sign
        value = value + next_value if s[pos] == '+' else value - next_value
        pos += next_pos + 1
    return value, pos

# Handle multiplication and division
def process_mul_div(s):
    # First parse the number, and handle the higher-precision parentheses
    value, pos = process_number(s)
    # If the position hasn't reached the end of the string, and the current character is a multiplication or division sign
    while pos < len(s) and (s[pos] == '*' or s[pos] == '/'):
        # Parse the next number or parentheses
        next_value, next_pos = process_number(s[pos+1:])
        # Perform the operation based on the multiplication or division sign
        value = value * next_value if s[pos] == '*' else value / next_value
        pos += next_pos + 1
    return value, pos

# Handle numbers and parentheses
def process_number(s):
    # If the current character is a digit
    if s[0].isdigit():
        i = 1
        while i < len(s) and s[i].isdigit():
            i += 1
        return int(s[0:i]), i
    # If the current character is a left parenthesis
    if s[0] == '(':
        # Parse an expression until a right parenthesis is encountered
        value, pos = process_add_sub(s[1:])
        return value, pos + 2  # Skip the right parenthesis
    # If it's neither a digit nor a parenthesis, continue parsing as a sub-expression
    return process_add_sub(s)

# Parse and evaluate an arithmetic expression
def parse_and_eval(s):
    value, _ = process_add_sub(s)
    return value

# Test
expr = "3+5*2"
print(parse_and_eval(expr))  # Output 13, because 5*2 is computed first

expr = "(3+5)*2"
print(parse_and_eval(expr))  # Output 16, because (3+5) is computed first
```

The program above uses a top-down parsing approach, implemented through a set of recursive functions, where each function is responsible for handling one type of operator or data.
* The function `parse_and_eval()` is used to parse and evaluate the entire expression. It calls `process_add_sub()` to process the whole expression and returns the final computed result.
* The function `process_add_sub()` calls `process_mul_div()` to handle higher-precision operations and adds or subtracts their results.
* The function `process_mul_div()` calls `process_number()` to handle numbers and parentheses and multiplies or divides their results.
* After processing the current data, the function `process_number()` calls `process_add_sub()` again to handle the subsequent characters, thus forming a recursive call.

It should be noted that in the implementation above, string slicing is used for simplification, which is less efficient. To improve efficiency, a global pointer pointing to the character being processed should typically be maintained. This avoids string slicing and complex index calculations.

## Comparison Between Recursion and Loops

Any logic implemented using recursion can be converted to a loop, and vice versa, any logic implemented using a loop can be converted to recursion. For this reason, some programming languages (especially purely functional programming languages) do not have loop structures; while other programming languages do not have recursion, such as some early versions of Basic. So, when we program, should we choose loops or recursion?

Comparing the two, the biggest advantage of loops is high efficiency. For most modern programming languages (including Python), loops are generally more efficient than recursion because they do not need to create new stack frames for each iteration. For programs with high performance requirements, consider using loops first.

Secondly, loops are not limited by the number of iterations, but the depth of recursion is limited. For example, the recursive algorithm for calculating factorial implemented above cannot compute the factorial of a large number (greater than 1000). Some versions of the Python compiler do not support tail recursion optimization. Even if the recursion is changed to tail recursion, a stack overflow error may still occur. Therefore, for algorithms with large numbers of iterations or recursion depth, loops must be used.

The biggest advantage of recursion is that it is intuitive and concise. Some problems are naturally suited to being solved recursively, such as permutations and combinations of data, tree and graph traversal, divide-and-conquer algorithms, etc. For such problems, it is best to use recursion.

## Exercises

**Using recursive algorithms**, write programs for the following:

1. Array Sum: Calculate the sum of all numbers in a list of real numbers.
1. Maximum in a List: Find the largest element in a list. For example, input `[1, 4, 2, 9, 7]`, output 9.
1. Check Palindrome: Check whether a string is a palindrome. For example, input "radar", output True; input "hello", output False.
1. Reverse a List: Reverse the order of data in a list.
1. Power Calculation: Compute x raised to the power of n (n is an integer) using only the four basic arithmetic operations (addition, subtraction, multiplication, division).
1. Greatest Common Divisor (GCD): Use the Euclidean algorithm to compute the GCD of two positive integers. The algorithm is: the GCD of two integers a and b equals the GCD of b and a % b.
1. Permutations: Given a set of unique data, output all permutations of that data. For example, input `[1, 2, 3]`, output: `[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]`.
1. Array Flattening: Given a nested list, use recursion to flatten it. For example, input `[1, [2, [3, 4]], 5]`, output `[1, 2, 3, 4, 5]`.
1. Chessboard Path Counting: Count the number of different paths from the top-left corner to the bottom-right corner of a chessboard, moving only right or down each step. For example, given a 3x3 chessboard, the total number of paths is 6.
1. Generate Parentheses: Generate all possible combinations of well-formed parentheses. For example, input n=3, output: `["((()))", "(()())", "(())()", "()(())", "()()()"]`.
1. Tower of Hanoi: Write a program to solve the classic Tower of Hanoi puzzle. The rules of the Tower of Hanoi are as follows: There are three pegs and several disks of different sizes. The disks are initially stacked on the first peg in order of size. The goal of the game is to move the entire stack of disks from the first peg to the third peg. The game has some restrictions:
   a. At any time, on any peg, a smaller disk must always be on top of a larger disk. That is, the disks on each peg are sorted.
   b. Only one disk can be moved at a time, moving a disk from one peg to another.
1. Eight Queens Problem: Find all possible ways to place eight queens on an 8x8 chessboard such that no two queens are in the same row, column, or diagonal.
1. Maze Pathfinding: Given a 2D maze, use recursion to find a path from the start to the end.
