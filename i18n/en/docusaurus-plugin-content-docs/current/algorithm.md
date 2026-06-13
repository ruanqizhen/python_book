# Simple Algorithms and Data Structures

The famous Turing Award winner and inventor of the Pascal programming language, Niklaus Wirth, proposed a formula: `Program = Algorithm + Data Structure`. Data structures study how to find the most suitable way to organize data for specific problems, while algorithms study how to find the optimal methods and steps to solve those problems. Together they form a program. Although this statement is not comprehensive, it essentially reveals the core nature of programs. When programmers go for job interviews, the most frequently asked questions are also about algorithms and data structures.

Algorithms and data structures, as the two pillars of programming, could each be the subject of a full semester course. Here, due to space limitations, we can only discuss some basic algorithms and data structures. The main purpose is still to provide some examples of Python programming.

## Time Complexity

First, let's introduce a metric for measuring algorithm efficiency: algorithm complexity. Algorithm complexity is divided into time complexity and space complexity. Time complexity indicates the amount of work required to execute an algorithm, which directly determines how fast the algorithm runs. Space complexity indicates how much memory space is needed to execute the algorithm. From the current perspective, the cost of improving CPU performance is far higher than the cost of increasing memory capacity, so in most cases, people are more concerned about time complexity.

Time complexity is a function. High time complexity means that when the input data increases slightly, the amount of algorithm work increases many times over; conversely, an algorithm with low time complexity does not require much more work even when the input increases significantly. Time complexity is related to the problem being solved: some problems can be solved very efficiently, while others simply have no low time complexity solution. Therefore, comparing time complexities only makes sense when comparing different algorithms for the same problem.

The time complexity function is denoted by the uppercase letter O, while a lowercase letter, such as n, represents the amount of data the algorithm needs to process.

* If an algorithm always completes within a fixed amount of time regardless of how large the input data n is, it means the algorithm's running time is constant, denoted as $O(1)$
* If the running time of an algorithm has a linear relationship with the amount of input data, for example, if the number of input data items is n and the running time is c*n where c is a constant, then the algorithm's time complexity is linear, denoted as $O(n)$
* If the running time of an algorithm is proportional to the square of the amount of input data, then the time complexity is $O(n^2)$; similarly, if the running time is proportional to the cube of the input data, the time complexity is $O(n^3)$ ...

### Some Examples

#### Linear Time 

```python
def linear_time(arr):
    for item in arr:
        print(item)

arr = [1, 2, 3, 4, 5]
linear_time(arr)
```

In the code above, the `linear_time` function iterates through every element in the array, so its time complexity is linear, i.e., $O(n)$, where n represents the number of elements.

#### Quadratic Time 
 
```python
def quadratic_time(arr):
    for i in arr:
        for j in arr:
            print(i, j)

arr = [1, 2, 3, 4, 5]
quadratic_time(arr)
```

This function contains two nested loops, so its time complexity is $O(n^2)$.

The above are collectively referred to as polynomial-level time complexity. If an algorithm's time complexity is at the polynomial level, it can generally still be used to solve practical problems. If an algorithm's time complexity exceeds this level, such as the factorial level $O(n!)$. When calculating factorial, the input is a number, not an array, so n here does not represent the number of input data items, but the size of the input data.

There is also the exponential level $O(2^n)$, and even higher time complexity algorithms. These algorithms are already difficult to use for solving practical problems. We previously introduced a [Fibonacci number algorithm](recursive#计算斐波纳契数列) with a time complexity of $O(2^n)$. At this level of complexity, an ordinary computer can at most handle problems with input values less than 30. Of course, even if they are all at the polynomial level, we still hope to find an algorithm with the lowest complexity for the problem we need to solve.

## Determining Prime Numbers

Now let's study the time complexity of a prime factorization algorithm. If we have a number n that we know is the product of two prime numbers, but we don't know which two primes, what is the time complexity of factorizing n?

It may be clearer to demonstrate with some concrete numbers: Suppose the two primes are 17 and 19. Multiplying them gives $17 * 19 = 323$. For a computer, multiplying two larger numbers takes almost the same time as multiplying two smaller numbers; this can be considered a constant, so the complexity of multiplication is constant at $O(1)$. However, factorizing 323 is not so easy. We have to try from the smallest prime one by one. For example, first try whether 323 is divisible by 2; if not, try 3, and keep going until we reach 17 to finally find the answer. In the worst case, if n is the product of two identical primes, we need to try $\sqrt{n}$ times. Assuming multiplication and division have the same computational cost (in reality, division is much slower), then the time complexity of factorizing n is $O(\sqrt{n})$.

This program can be further optimized, for example, by ignoring factors that are obviously not prime (such as even numbers, etc.). The optimized program can run faster, but its complexity is still at the $O(\sqrt{n})$ level, much higher than the complexity of multiplying two primes. Although $\sqrt{n}$ seems much smaller than n, for a large integer like $10^{100}$, its square root is still a huge number, and the computation is exponential. If both primes are greater than $10^{10}$, then factorizing their product with an ordinary computer would lose practical significance because it would take too long. The vast difference in time complexity between an operation and its inverse has practical uses in the computer field. For example, it can be used for information encryption and decryption. The widely used RSA encryption algorithm exploits the property that multiplying primes is far faster than factoring a composite number into prime factors. In simplified terms, the encryption and decryption process works like this: Users A and B communicate over the internet, and all data transmitted between them (including the encryption algorithm and the key) can be intercepted by an eavesdropper C. A needs B to send some private messages that C cannot understand. So A first finds two large prime numbers, then gives the product of the two primes as the RSA algorithm key to B. B uses this key to encrypt the message and then sends it to A. RSA encryption only requires this composite number as the key, but the decryption process must use the original two primes. Of course, A retains the original two primes, but C does not. If C wants to decrypt, they must perform prime factorization on the composite key, which is a relatively slow process. As long as the two primes A finds are large enough, C cannot compute the two primes within any effective timeframe. This achieves the encryption effect for the transmitted information.

This encryption method is very clever. But there's still a problem: where does A find two such large prime numbers? A cannot select them from a known table of primes, because C might have access to the same table. If A randomly generates a very large number, how can A determine whether it is prime? Try to factorize it? If so, wouldn't A need about the same amount of time as C? Although A can prepare in advance and has relatively more time, it would still be inconvenient if the algorithm is too time-consuming. Fortunately, there are algorithms for determining whether a number is prime with extremely low time complexity. For example, we can use some properties of prime numbers to determine whether a number is prime: Suppose a is a relatively small prime (such as 2, 3, 5, etc.), and p is a relatively large number we need to test. If p is a prime, then $a^{p-1} - 1$ is divisible by p. We can write the following program based on this judgment formula to check whether a number is prime.

There are a few things to note about this algorithm: First, some non-prime numbers can occasionally satisfy the above formula, so we need to try several different values of a. Only if all of them satisfy the condition can we be sure the tested number is prime. For integers that are not particularly large, trying the smallest primes a equal to 2, 3, 5, 7, 11, 13 is sufficient. Second, we cannot directly use the exponentiation function to compute $a^{p-1}$ in the program, because the test data p is generally very large, and $a^{p-1}$ would be an extremely large number, possibly exceeding the range that a single CPU register can represent. Since we only care about the remainder of $a^{p-1}$ divided by p, we can break the exponentiation into multiple multiplication operations in the program, keeping only the lower-order bits that affect the final remainder after each multiplication. This keeps the data within a manageable range.

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


Using the above program to test consecutive integers one by one, we can quickly find some prime numbers. For example, using the above program starting from 1,000,000,000, we quickly find a prime: 1,000,000,007.

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

Space complexity describes the relationship between the memory or storage space used by an algorithm and the size of the input data. It tells us how much additional memory the algorithm needs as the input data grows. It is described in the same way as time complexity, also using a function denoted by O, except that here it represents not the computational workload but the memory space required.

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

In the code above, regardless of the size of the input array, the `constant_space` function only uses one additional integer variable `total` to store the sum. Therefore, its space complexity is $O(1)$.

#### Linear Space 
 
```python
def linear_space(n):
    # Create a list containing n elements, occupying O(n) space
    return list(range(n))

n = 5
result = linear_space(n)
print(result)
```

This function creates a list of length n based on the input n. The space used is directly related to the input size, so the space complexity is $O(n)$.
