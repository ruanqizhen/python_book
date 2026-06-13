# Simple Algorithms and Data Structures

Niklaus Wirth, the Turing Award winner and creator of the Pascal programming language, famously proposed the formula: `Program = Algorithm + Data Structure`. Data structures focus on the most effective ways to organize data for specific tasks, while algorithms define the step-by-step methods to solve those tasks. Together, they form the core of any software application. While modern software engineering is broader than this formula suggests, it captures the essential nature of programming. Consequently, algorithms and data structures remain the most common topics in technical job interviews.

As the pillars of computer science, algorithms and data structures are vast fields that typically require dedicated, multi-semester study. In this chapter, we will introduce a few foundational concepts and structures, primarily to demonstrate how they are implemented using clean Python syntax.

## Time Complexity

To measure the efficiency of an algorithm, we look at its complexity, which is split into two categories:
* **Time Complexity**: The number of operations required to execute an algorithm, which directly determines its execution speed.
* **Space Complexity**: The amount of memory required during execution.

In modern computing, memory is cheap and abundant, whereas CPU performance improvements are harder to achieve. Consequently, developers usually prioritize optimizing time complexity over space complexity.

Time complexity is expressed as a mathematical function of the input size. An algorithm with high complexity experiences a dramatic increase in operations when the input grows even slightly. Conversely, a low-complexity algorithm scales efficiently as data increases. Time complexity is highly dependent on the problem itself: some tasks are inherently simple to solve, while others have no known low-complexity solutions. Therefore, comparing time complexity is only meaningful when evaluating different algorithms designed to solve the same problem.

We express time complexity using **Big O notation** (denoted by the capital letter $O$), where $n$ represents the input size (such as the number of elements in a list).

* **$O(1)$ (Constant Time)**: The algorithm takes the same number of operations to complete regardless of the input size $n$.
* **$O(n)$ (Linear Time)**: The number of operations grows proportionally to the input size $n$.
* **$O(n^2)$ (Quadratic Time)**: The number of operations is proportional to the square of the input size (common in nested loops). Similarly, $O(n^3)$ represents cubic time complexity.

### Some Examples

#### Linear Time 

```python
def linear_time(arr):
    for item in arr:
        print(item)

arr = [1, 2, 3, 4, 5]
linear_time(arr)
```

In this code, the `linear_time` function iterates through every element in the list exactly once, yielding a time complexity of $O(n)$.

#### Quadratic Time 
 
```python
def quadratic_time(arr):
    for i in arr:
        for j in arr:
            print(i, j)

arr = [1, 2, 3, 4, 5]
quadratic_time(arr)
```

Because this function contains nested loops that both iterate over the same list, its time complexity is $O(n^2)$.

These are examples of **polynomial time complexities**. Algorithms in this category are generally considered practical and scalable. However, if an algorithm's complexity exceeds polynomial growth—such as factorial time $O(n!)$—it quickly becomes unusable for practical input sizes. (Note: when discussing math algorithms, $n$ often represents the numerical value of the input rather than the count of items in a collection).

Another highly inefficient class is **exponential time** $O(2^n)$. We previously saw a recursive [Fibonacci sequence algorithm](recursive#calculating-the-fibonacci-sequence) that exhibits $O(2^n)$ complexity. For such algorithms, a standard computer will struggle to compute results for input values greater than 30. Naturally, even when staying within polynomial bounds, we always strive to find the algorithm with the lowest possible complexity.

## Determining Prime Numbers

Let's examine the complexity of prime factorization. If we have a number $n$ that is the product of two prime numbers, how long does it take to find those factors?

To illustrate, suppose the two primes are $17$ and $19$. Multiplying them is simple: $17 \times 19 = 323$. For a computer, multiplying two numbers is extremely fast and takes constant time, or $O(1)$. 

However, factoring $323$ back into its prime components is much harder. We must check divisibility starting from the smallest prime ($2$), then $3$, $5$, and so on, until we reach $17$. In the worst case—where $n$ is the square of a prime—we must test up to $\sqrt{n}$ numbers. Thus, the time complexity of factoring $n$ using trial division is $O(\sqrt{n})$.

While we can optimize this search by skipping even numbers, the complexity remains $O(\sqrt{n})$, which is significantly slower than $O(1)$ multiplication. For a huge number like $10^{100}$, the square root ($10^{50}$) is still astronomical. If $n$ is the product of two primes larger than $10^{10}$, factoring it on a standard computer becomes practically impossible.

This asymmetric relationship between multiplication and factoring forms the foundation of modern cryptography. The **RSA encryption algorithm** relies directly on the fact that multiplying two primes is trivial ($O(1)$), while factoring their product is computationally infeasible. 

In simple terms:
1. User A generates two massive primes and sends their product to User B as a public encryption key.
2. User B encrypts a message using this public key and sends it to User A.
3. Decrypting the message requires knowing the original two prime numbers. 
An eavesdropper intercepting the encrypted message only knows the product key. To decrypt it, they must factor the composite number back into its prime components. By choosing sufficiently large primes, User A ensures that this factorization would take the eavesdropper thousands of years to compute, keeping the communication secure.

This approach raises a new problem: how does User A find two massive prime numbers? A cannot select them from a precompiled table, as an attacker could use the same table. If A generates a random large number, how can they verify it is prime? Using trial division would take just as long as the attacker's search, which is impractical.

Fortunately, there are highly efficient **primality tests** that can determine if a number is prime in polynomial time. For instance, **Fermat's Little Theorem** states that if $p$ is a prime number and $a$ is any integer not divisible by $p$, then:
$$a^{p-1} \equiv 1 \pmod p$$
(In other words, $a^{p-1} - 1$ is divisible by $p$). We can use this theorem to test if a number is prime.

Two important caveats apply to this test:
1. **Fermat Pseudoprimes**: Some composite numbers (like Carmichael numbers) can satisfy this formula. To minimize false positives, we run the test using several different prime bases (e.g., $a \in \{2, 3, 5, 7, 11\}$).
2. **Modular Exponentiation**: Because $a^{p-1}$ would yield an astronomically large number that exceeds system memory, we must perform the exponentiation using modular arithmetic. By taking the remainder (modulo $p$) at each step of the calculation, we keep the numbers small and prevent arithmetic overflow.

The code for this algorithm is as follows:

```python
def modular_exponentiation(base, exponent, modulus):
    """
    Calculate (base ** exponent) % modulus
    Uses the Square-and-Multiply algorithm
    """
    result = 1
    base %= modulus
    while exponent > 0:
        # If the exponent is odd, multiply the current base into the result
        if exponent % 2 == 1:
            result = (result * base) % modulus
        # Halve the exponent (bit shift), square the base
        exponent //= 2  # or exponent >>= 1
        base = (base * base) % modulus
    return result

def is_prime(n):
    if n < 2:
        return False
    for a in [2, 3, 5, 7, 11]:
        if n == a:
            return True
        if modular_exponentiation(a, n - 1, n) != 1:
            return False
    return True
```

Using this program, we can quickly scan for prime numbers. For example, starting our search from one billion, we instantly identify `1,000,000,007` as a prime.

Using Python's built-in functions, we can further simplify the above algorithm:

```python
def is_prime(n):
    """
    Use Fermat primality test to determine whether n is prime.
    """
    if n < 2:
        return False
    
    # Select the first few small primes as bases for testing
    # The more bases tested, the more reliable the result (but cannot rule out Carmichael numbers)
    for a in [2, 3, 5, 7, 11]:
        if n == a:
            return True
        # pow(a, b, m) computes (a ** b) % m
        if pow(a, n - 1, n) != 1:
            return False
            
    return True
```

## Space Complexity

Space complexity describes the amount of memory an algorithm consumes relative to the size of the input data. Like time complexity, it is expressed using Big O notation to show how memory usage scales.

### Some Examples

#### Constant Space 

```python
def constant_space(arr):
    total = 0
    for item in arr:
        total += item
    return total

arr = [1, 2, 3, 4, 5]
sum = constant_space(arr)
print(sum)
```

In this code, regardless of the size of the input list `arr`, the `constant_space` function only allocates a single integer variable `total` to accumulate the sum, resulting in $O(1)$ space complexity.

#### Linear Space 
 
```python
def linear_space(n):
    # Create a list containing n elements, occupying O(n) space
    return list(range(n))

n = 5
result = linear_space(n)
print(result)
```

This function generates a list of size $n$, meaning its memory consumption grows linearly with the input, resulting in a space complexity of $O(n)$.
