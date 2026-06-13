# Hash Table

In previous chapters, we discussed arrays and linked lists. Arrays allow index-based access in $O(1)$ time, but searching for a specific value without its index requires a linear scan taking $O(n)$ time. Linked lists offer flexible insertion and deletion, but searching them also takes $O(n)$ time.

Is there a data structure that combines the fast access of an array with the flexible insertion and key-value storage of a linked list? This brings us to the star of this chapter: the **Hash Table**.

A **hash table** (or **hash map**) is an efficient data structure that stores key-value pairs. It uses a mathematical function to map a key to a specific index in an array, enabling near-instantaneous data access. Hash tables are widely used in applications requiring fast lookups, insertions, and deletions, including dictionaries in programming languages, database indexing, caching systems (like Redis), and sets.

## Hash Function

The core of a hash table is how it converts a complex key (such as the string `'apple'`) into an array index (such as the integer `3`). This mapping is performed by a **hash function**.

A good hash function must satisfy the following criteria:

1. **Determinism**: It must always produce the same output index for a given input key.
2. **Efficiency**: It must be extremely fast to compute.
3. **Uniform distribution**: It should distribute keys as evenly as possible across the slots of the array to minimize "collisions."

If we imagine the array as a row of drawers, the hash function acts as the receptionist who tells you exactly which drawer number an item belongs in.

## Hash Table Operations

In an ideal scenario (where the hash function is well-designed and no collisions occur), the three primary operations of a hash table are highly efficient:

1. **Insert**:
   * Compute the hash of the key to find the corresponding index, then store the key-value pair at that index.
   * Time complexity: $O(1)$.

2. **Search**:
   * Retrieve the index for the key via the hash function, go directly to that memory location, and fetch the value.
   * Time complexity: $O(1)$.

3. **Delete**:
   * Retrieve the index, go directly to that location, and remove the key-value pair.
   * Time complexity: $O(1)$.

## Collisions and Resolutions

While we want every key to map to a unique index, the number of possible keys is infinite whereas the array size is finite. By the **pigeonhole principle**, multiple keys will inevitably map to the identical index. This event is called a **hash collision**.

When a collision occurs, we must resolve it to prevent new data from overwriting existing values. The two most common resolution techniques are:

### 1. Separate Chaining

This is the most intuitive solution. We treat each slot in the array as a "bucket" that points to a linked list rather than storing a single value.

* **Principle**: When multiple keys map to the same index, they are simply appended to the linked list at that index.
* **Advantages**: Simple to implement, insensitive to the table's load factor, and supports unlimited expansion (as long as memory allows).
* **Disadvantages**: Requires extra memory for pointers. If many collisions occur, the linked list can grow long, degrading search efficiency from $O(1)$ to $O(n)$. In optimized language runtimes (like Java 8), when a list grows too long, it is converted into a red-black tree to guarantee $O(\log n)$ search times.

### 2. Open Addressing

Unlike separate chaining, open addressing stores all key-value pairs directly in the main array itself.

* **Principle**: If the target index `i` is already occupied, the algorithm probes the array for the next empty slot according to a predefined search sequence.
* **Probing Methods**:
  * **Linear Probing**: If index `i` is taken, check `i+1`, then `i+2`, and so on.
  * **Quadratic Probing**: Increase the probing interval quadratically (e.g., check `i + 1^2`, `i + 2^2`, etc.).
  * **Double Hashing**: Use a secondary hash function to calculate a variable step size.
* **Advantages**: Storing all data in a contiguous array is highly CPU cache-friendly and avoids the memory overhead of linked list pointers.
* **Disadvantages**: Deletions are complex (slots cannot simply be cleared; they must be marked as "deleted" to avoid breaking probing paths). It is also prone to **clustering** (where data aggregates in contiguous blocks), which increases probing times.

### Load Factor and Rehashing

Regardless of the collision resolution strategy, as the number of elements in a hash table increases, the probability of collisions rises. To measure how full the table is, we use the **load factor**:

$$\text{Load Factor} = \frac{\text{Number of Elements}}{\text{Hash Table Capacity}}$$

When the load factor exceeds a threshold (typically 0.75), lookup performance degrades. To maintain efficiency, the table undergoes **rehashing**: a larger array (usually twice the size) is allocated, and all existing keys are re-hashed and moved into the new array. Although rehashing is an $O(n)$ operation, it occurs infrequently enough that the amortized cost of insertions remains $O(1)$.

## Manually Implementing a Simple Hash Table

To better understand these concepts, let's manually implement a simple hash table using separate chaining:

```python
class HashTable:
    def __init__(self, size=10):
        self.size = size
        # Initialize the hash table, each position is an empty list (acting as a linked list)
        self.table = [[] for _ in range(size)]

    def _hash(self, key):
        """Hash function: convert a key to an index"""
        # hash() is a Python built-in function, % self.size ensures the index is within the array range
        return hash(key) % self.size

    def insert(self, key, value):
        """Insert a key-value pair"""
        index = self._hash(key)
        # Check if the key already exists; if so, update the value
        for pair in self.table[index]:
            if pair[0] == key:
                pair[1] = value
                return
        # If the key does not exist, append it to the end of the linked list
        self.table[index].append([key, value])

    def search(self, key):
        """Search for a value"""
        index = self._hash(key)
        for pair in self.table[index]:
            if pair[0] == key:
                return pair[1]
        return None  # Not found

    def delete(self, key):
        """Delete a key-value pair"""
        index = self._hash(key)
        for i, pair in enumerate(self.table[index]):
            if pair[0] == key:
                self.table[index].pop(i)
                return

# Test the hash table
hash_table = HashTable()
hash_table.insert('name', 'Alice')
hash_table.insert('age', 25)
hash_table.insert('city', 'New York')

print(hash_table.search('name'))  # Output: Alice
print(hash_table.search('age'))   # Output: 25

hash_table.delete('age')
print(hash_table.search('age'))   # Output: None

```

## Hash Table Implementation in Python

Python's built-in dictionaries (`dict`) and sets (`set`) are implemented using hash tables under the hood. However, Python's internal implementation is highly optimized: it uses open addressing (specifically, pseudo-random probing) and underwent a major structural redesign in Python 3.6.

### Traditional Hash Table (Before Python 3.6)

Historically, Python dictionaries were large, sparse arrays where each slot (entry) stored the hash value, key pointer, and value pointer.

For example, a dictionary with a capacity of 8 storing `d = {'Alice': 'A', 'Bob': 'B', 'Charlie': 'C'}` would look like this in memory:

```text
# This is a sparse array; many positions are empty (None)
entries = [
    None,
    DictEntry(hash1, 'Bob', 'B'),    # Suppose Bob hashes to index 1
    None,
    None,
    None,
    DictEntry(hash2, 'Alice', 'A'),  # Suppose Alice hashes to index 5
    None,
    DictEntry(hash3, 'Charlie', 'C') # Suppose Charlie hashes to index 7
]

```

This structure suffers from **high memory overhead**. To minimize collisions, the load factor must be kept low, meaning a large portion of the array remains empty (`None`).

### Compact Hash Table (Python 3.6+)

To optimize memory usage and preserve insertion order, Python 3.6 introduced a compact dictionary layout that splits the data structure into two separate arrays:

1. **indices**: Stores only the index mappings (if the dictionary capacity is small, each slot takes only 1 byte).
2. **entries**: Stores the actual key-value data compactly in insertion order, with no gaps.

For the same dictionary `d = {'Alice': 'A', 'Bob': 'B', 'Charlie': 'C'}`, the compact layout is structured as follows:

```python
# The entries array is stored in insertion order, compact, with no wasted space
entries = [
    DictEntry(hash2, 'Alice', 'A'),   # Index 0
    DictEntry(hash1, 'Bob', 'B'),     # Index 1
    DictEntry(hash3, 'Charlie', 'C')  # Index 2
]

# The indices array serves as the hash index table
# Suppose Alice's hash modulo is 5, Bob's is 1, Charlie's is 7
indices = [None, 1, None, None, None, 0, None, 2]

```

**Lookup Process**:

1. Compute the hash of 'Alice', take modulo to get `5`.
2. Look up `indices[5]` and find the stored value is `0`.
3. Retrieve data from `entries[0]`, which is 'Alice'.

**Significance of This Change**:

* **Memory Efficiency**: The sparse `indices` array is extremely small, and the larger `entries` array has no empty slots.
* **Insertion Ordering**: Because elements are appended sequentially to the `entries` array, the iteration order matches insertion order. Starting in Python 3.7, dictionaries are officially guaranteed to maintain insertion order.

## Hash Table Application Examples

The primary advantage of hash tables is their near-instantaneous lookup speed, making them ideal for deduplication, frequency counting, and fast key-value lookups.

### Example: Longest Consecutive Sequence

**Problem**: Given an unsorted array of integers, find the length of the longest consecutive sequence.
For example: `[100, 4, 200, 1, 3, 2]`, the longest consecutive sequence is `[1, 2, 3, 4]`, with a length of 4.

**Approach**: If we use sorting, the time complexity is $O(n \log n)$. By using a hash set (Set), we can reduce the lookup time to $O(1)$, achieving an $O(n)$ solution.

```python
def longest_consecutive(nums):
    if not nums:
        return 0

    # Convert the array into a set for O(1) lookups
    num_set = set(nums)
    longest_streak = 0

    for num in num_set:
        # Only start counting when num is the beginning of a sequence
        # (i.e., num-1 is not in the set, indicating num is the start of a new sequence)
        if num - 1 not in num_set:
            current_num = num
            current_streak = 1

            # Continuously look forward for num+1, num+2...
            while current_num + 1 in num_set:
                current_num += 1
                current_streak += 1

            longest_streak = max(longest_streak, current_streak)

    return longest_streak

# Test
nums = [100, 4, 200, 1, 3, 2]
print(longest_consecutive(nums))  # Output: 4

```

## Summary

The hash table is a classic embodiment of the "space-for-time" trade-off in computer science.

* **Advantages**:
  1. **Speed**: Average time complexity for insertion, deletion, and search operations is $O(1)$.
  2. **Flexibility**: Any hashable object can be used as a key.

* **Disadvantages**:
  1. **Unordered by Nature**: Standard hash tables do not maintain ordering (while Python dictionaries preserve insertion order, this is a specialized implementation feature).
  2. **Rehashing Overhead**: Resizing large tables can introduce occasional latency spikes when rehashing occurs.
  3. **Collision Sensitivity**: Poor hash functions or highly clustered data can degrade lookup times toward $O(n)$.

Understanding hash tables — especially collision resolution and the underlying optimization of Python dictionaries — is crucial for writing high-performance code.
