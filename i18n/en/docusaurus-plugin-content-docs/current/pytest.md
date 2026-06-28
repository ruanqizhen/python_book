# Unit Testing and pytest

On the planet Pythora, even the most skilled swordsmen practice their strikes on wooden dummies before heading into battle to ensure their blades are sharp and their techniques flawless. In software engineering, these "practice dummies" are known as **Unit Tests**.

No matter how perfectly your code runs in your mind, until it is thoroughly tested, it is just "Schrödinger's code"—you never know if it will succeed or crash in reality. Unit testing involves verifying the smallest testable parts of an application (typically a function or a class) to ensure they behave exactly as expected.

In this chapter, we will learn how to write unit tests and introduce `pytest`, the most popular and powerful testing framework in the Python ecosystem.

## Why Write Unit Tests?

Many beginners feel that writing tests is a waste of time: "Why don't I just run my code and see if it works?" However, in large-scale projects, unit testing is absolutely indispensable:

1. **Confidence Guarantee**: After every code modification or refactoring, if you run the tests and they all pass, you can be confident that your changes haven't broken any existing functionality.
2. **Rapid Bug Isolation**: Because unit tests focus on individual functions, when a test fails, you instantly know which function and which specific logic went wrong.
3. **Tests as Documentation**: Well-written test cases clearly demonstrate how a function should be called and what output is expected, which is often more practical than lengthy documentation.

## The Touchstone: The `assert` Statement

In the previous [Debugging](debug.md) chapter, we briefly mentioned `assert`. In the realm of testing, assertions are our core tools. Its mechanism is incredibly simple: it checks if an expression evaluates to `True`. If so, the program continues; if it evaluates to `False`, it raises an `AssertionError`, and the test fails.

```python
def add(a, b):
    return a + b

# Simple tests
assert add(2, 3) == 5
assert add(-1, 1) == 0
```

While the built-in `assert` is handy, scattering hundreds of test assertions directly inside your business logic will quickly turn your project into a chaotic mess. Therefore, we need a dedicated testing framework to organize and execute these tests systematically.

## Enter pytest

`pytest` is currently the most popular testing framework in the Python community. Compared to Python's built-in `unittest` module, `pytest` doesn't require you to write boilerplate test classes; you simply write plain functions and use native `assert` statements.

First, install it via your terminal:

```bash
pip install pytest
```

### Writing Your First Test

Suppose we have a business module `math_utils.py` that calculates discounted prices:

```python
# math_utils.py
def calculate_discount(price, discount):
    if price < 0 or discount < 0 or discount > 1:
        raise ValueError("Invalid input")
    return price * (1 - discount)
```

By convention, test files typically start with the prefix `test_`. Let's create a file named `test_math_utils.py` specifically for testing:

```python
# test_math_utils.py
import pytest
from math_utils import calculate_discount

# Test functions must also start with 'test_'
def test_calculate_discount_normal():
    # Test a normal scenario
    assert calculate_discount(100, 0.2) == 80.0

def test_calculate_discount_zero():
    # Test a free item scenario
    assert calculate_discount(100, 1.0) == 0.0

def test_calculate_discount_invalid():
    # Test exception throwing: use pytest.raises to catch the expected error
    with pytest.raises(ValueError):
        calculate_discount(-10, 0.2)
```

### Running the Tests

In your terminal, navigate to the directory containing your code and simply type the `pytest` command. `pytest` will automatically discover all files starting with `test_` in the current and subdirectories, and execute all test functions within them.

```text
$ pytest
=========================== test session starts ============================
collected 3 items                                                          

test_math_utils.py ...                                               [100%]

============================ 3 passed in 0.02s =============================
```

Each green dot `.` represents a passed test. If a test fails, it shows a red `F` and prints out a detailed traceback below, indicating the exact line of failure and the variable states, making debugging incredibly easy.

## The Advanced Tool: Fixtures

In the martial arts world, a duel requires setting up an arena beforehand and cleaning up the battlefield afterward. In testing, these are known as **Setup** and **Teardown** operations. For example, before testing database functions, we must connect to the database and insert mock data; after the test, we must clear the data and close the connection.

`pytest` provides an elegant `@pytest.fixture` decorator to handle this:

```python
import pytest

# Define a fixture
@pytest.fixture
def empty_cart():
    print("\n[Setup] Initializing an empty shopping cart...")
    cart = []
    yield cart  # Pass the resource to the test function. Execution pauses here until the test finishes.
    print("\n[Teardown] Test finished, clearing the cart...")
    cart.clear()

# The test function simply takes the fixture's name as an argument
def test_add_item(empty_cart):
    empty_cart.append("Excalibur")
    assert len(empty_cart) == 1
    assert empty_cart[0] == "Excalibur"
```

When `pytest` runs `test_add_item`, it notices the requirement for `empty_cart`, automatically executes the fixture, and injects the generated `cart` into the function. After the test completes, it resumes executing the cleanup code after the `yield` statement.

## Data-Driven: Parameterized Testing

If we want to test the same function with 10 different sets of data, there is no need to write 10 separate test functions. `pytest` offers a powerful parametrization decorator: `@pytest.mark.parametrize`.

```python
import pytest
from math_utils import calculate_discount

# Pass multiple sets of data at once: (price, discount, expected)
@pytest.mark.parametrize("price, discount, expected", [
    (100, 0.1, 90.0),
    (200, 0.5, 100.0),
    (50, 0, 50.0),
    (0, 0.2, 0.0)
])
def test_calculate_discount_multi(price, discount, expected):
    assert calculate_discount(price, discount) == expected
```

When you run this test, `pytest` will treat it as 4 independent test cases. If one set fails, it won't interrupt the execution of the others. This approach significantly enhances the reusability and cleanliness of your test code.

## Summary

On the planet Pythora, writing beautiful code earns you respect, but writing comprehensive test code with high coverage proves you are a true grandmaster. Good testing habits act as an indestructible armor for your project, allowing you to face future refactoring and feature iterations without fear.
