# Hash Table

In previous chapters, we discussed arrays and linked lists. Arrays allow accessing elements by index in $O(1)$ time, but if the index is unknown, searching for a specific element takes $O(n)$ time. Linked lists offer flexible insertion and deletion, but their search efficiency is also $O(n)$.

Is there a data structure that can provide both fast access like an array and flexible key-value storage like a linked list? This brings us to the star of this chapter — the Hash Table.

A hash table (also called a hash map) is an efficient data structure based on "key-value pairs." It maps a key to a certain position (index) in an array, enabling near real-time fast data access. Hash tables are widely used in scenarios that require fast lookup, insertion, or deletion operations, such as dictionaries in programming languages, database indexes, caching systems (e.g., Redis), and sets.

## Hash Function

The core of a hash table lies in how it converts a complex "key" (such as the string "apple") into a simple array "index" (such as the integer 3). This conversion is performed by the **Hash Function**.

The main responsibilities of a hash function are:

1. **Determinism**: For the same input, it must always produce the same output.
2. **Efficiency**: The computation must be fast enough.
3. **Uniform Distribution**: It takes a key as input and outputs an integer (typically an index). A good hash function should distribute different keys as evenly as possible across the array positions, thereby reducing "collisions."

If we imagine the array as a row of drawers, the hash function is the administrator who tells you, "This item belongs in drawer number X."

## Hash Table Operations

In an ideal scenario (where the hash function is well-designed and there are no collisions), the three basic operations of a hash table are all highly efficient:

1. **Insert**:
   * Compute the hash of the key, find the corresponding index, and store the key-value pair at that position.
   * Time complexity: `O(1)`.

2. **Search**:
   * Given a key, use the hash function to directly locate the storage position and retrieve the corresponding value.
   * Time complexity: `O(1)`.

3. **Delete**:
   * Directly locate the position of the key and remove it.
   * Time complexity: `O(1)`.

## Collisions and Resolutions

Although we hope that a hash function can map every key to a unique index, in reality, the length of the array is finite while the possible keys are infinite. Based on the "pigeonhole principle," there will inevitably be two different keys that are mapped to the same index by the hash function. This situation is called a **hash collision**.

When a collision occurs, we must find a way to resolve it, otherwise new data will overwrite old data. There are two common solutions:

### 1. Separate Chaining

This is the most intuitive solution. We treat each position (slot) in the hash table as a "bucket." Instead of storing just one piece of data, each bucket stores a linked list.

* **Principle**: When multiple keys map to the same index, the new element is simply appended to the linked list at that index.
* **Advantages**: Simple to implement; not sensitive to the load factor of the hash table; supports unlimited expansion (as long as memory allows).
* **Disadvantages**: Requires additional pointer storage space. If collisions are severe, the linked list can become very long, and lookup efficiency degrades from `O(1)` to `O(n)`. In advanced implementations such as Java 8, when a linked list becomes too long, it is transformed into a red-black tree to ensure lookup efficiency of `O(log n)`.

### 2. Open Addressing

This method does not use linked lists; all data is stored directly in the hash table's main array.

* **Principle**: When the computed index `i` is already occupied, a rule is followed to probe for the next available position.
* **Probing Methods**:
  * **Linear Probing**: If position `i` is occupied, check `i+1`; if that is also occupied, check `i+2`, and so on.
  * **Quadratic Probing**: The probing interval increases by a quadratic factor ().
  * **Double Hashing**: A second hash function is used to compute the probing step size.

* **Advantages**: All data is stored in the array, which is CPU cache-friendly and requires no additional pointer storage.
* **Disadvantages**: Deletion is cumbersome (slots cannot simply be cleared; they usually need to be marked as "deleted"); it is prone to **clustering**, where data bunches together, leading to longer probing times.

### Load Factor and Rehashing

Regardless of which collision resolution method is used, as the number of elements in a hash table increases, the probability of collisions rises sharply. To measure the crowdedness of a hash table, we introduce the **Load Factor**:

$$\text{Load Factor} = \frac{\text{Number of Elements}}{\text{Hash Table Capacity}}$$

When the load factor exceeds a certain threshold (e.g., 0.75), the performance of the hash table degrades significantly. At this point, **Rehashing** is necessary: create a larger array (typically twice the original capacity), recompute the hash values of all existing elements, and place them into the new array. This is a costly operation, but it is necessary to maintain efficient performance going forward.

## Manually Implementing a Simple Hash Table

To better understand the internal principles, let's manually implement a simple hash table using **separate chaining**:

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

The Python dictionaries (`dict`) and sets (`set`) we use daily are implemented using hash tables under the hood. However, Python's implementation is very sophisticated — it uses **open addressing** (specifically pseudo-random probing), and underwent a major structural optimization after Python 3.6.

### Traditional Hash Table (Before Python 3.6)

Early Python dictionaries were large "sparse arrays." Each array slot (Entry) stored the hash value, a pointer to the key, and a pointer to the value.

Consider a dictionary with a capacity of 8: `d = {'Alice': 'A', 'Bob': 'B', 'Charlie': 'C'}`. In memory, it might look like this:

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

The drawback of this structure is **significant space waste**. Because a certain proportion of free space (low load factor) must be maintained to reduce collisions, a large amount of memory contains `None`.

### Compact Hash Table (Python 3.6+)

To save memory and preserve insertion order, Python 3.6 introduced the "compact hash table." It splits the structure into two arrays:

1. **indices**: Stores only the hash table index mappings; it is very small (if it is a byte array, each slot takes only 1 byte).
2. **entries**: Stores the actual data compactly in insertion order, with no gaps.

For the same dictionary `d = {'Alice': 'A', 'Bob': 'B', 'Charlie': 'C'}`, the new memory layout is as follows:

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

* **Memory savings**: The `indices` array is very small, and the `entries` array has no gaps.
* **Ordering**: Since `entries` are appended in insertion order, Python 3.7+ officially declares that **dictionaries are ordered** (by insertion order).

## Hash Table Application Examples

The greatest strength of hash tables is their  lookup speed, making them ideal for deduplication, counting, and fast searching.

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

The hash table is the ultimate embodiment of the "space-for-time" philosophy in computer science.

* **Advantages**:
  1. **Speed**: The average time complexity for insertion, deletion, and search is all `O(1)`.
  2. **Flexibility**: Keys can be any hashable object.

* **Disadvantages**:
  1. **Unordered**: Traditional hash tables are unordered (although Python dictionaries are now ordered, this is a feature of a specific implementation).
  2. **Rehashing cost**: When the amount of data is large, rehashing can cause a momentary performance jitter.
  3. **Collisions**: A poorly designed hash function can lead to performance degradation.

Understanding hash tables — especially collision resolution and the underlying optimization of Python dictionaries — is crucial for writing high-performance code.
