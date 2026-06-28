# 单元测试与 pytest

在 Pythora 星球上，哪怕是剑法最高超的剑客，在拔剑迎敌之前，也会先用几根木桩试试手感，确保剑刃锋利、招式无误。在软件工程中，这些“试剑的木桩”就是**单元测试**（Unit Testing）。

无论你的代码在脑海中运行得多完美，只要它没经过测试，就只能算作“薛定谔的代码”——你永远不知道它在实际运行中是成功还是崩溃。单元测试是指对软件中的最小可测试单元（通常是一个函数或一个类）进行验证，确保它的行为符合预期。

本章我们将学习如何编写单元测试，并引入目前 Python 界最流行、最强大的测试框架：`pytest`。

## 为什么要写单元测试？

许多新手觉得写测试是在浪费时间：“我的代码写完直接跑一下看看不就行了吗？”。但在大型项目中，单元测试是不可或缺的：

1. **信心保证**：每次修改代码或重构后，只要运行一遍测试并全部通过，你就能确信自己的改动没有破坏原有功能。
2. **定位 Bug 极快**：由于单元测试是针对单个函数进行的，当某个测试失败时，你可以立刻知道是哪个函数的哪部分逻辑出了问题。
3. **测试即文档**：良好的测试用例能清晰地展示一个函数应该如何被调用，以及预期的输出是什么，这比长篇大论的文档更实用。

## 试金石：`assert` 断言

在上一章[调试](debug.md)中，我们简要提到了 `assert`。在测试领域，断言（Assertion）是我们的核心工具。它的工作原理极其简单：判断一个表达式是否为真，如果为真，程序继续执行；如果为假，抛出 `AssertionError` 异常，测试宣告失败。

```python
def add(a, b):
    return a + b

# 简单的测试
assert add(2, 3) == 5
assert add(-1, 1) == 0
```

虽然自带的 `assert` 很好用，但如果我们把成百上千个测试直接写在业务代码里，项目将变得一团糟。因此，我们需要一个专门的测试框架来组织和运行这些测试。

## 初识 pytest

`pytest` 是 Python 社区目前最受欢迎的测试框架。相比于内置的 `unittest` 框架，`pytest` 不需要编写繁琐的测试类，只需要写普通的函数和原生的 `assert` 语句即可。

首先，在终端中安装它：

```bash
pip install pytest
```

### 编写第一个测试

假设我们有一个计算折扣价的业务模块 `math_utils.py`：

```python
# math_utils.py
def calculate_discount(price, discount):
    if price < 0 or discount < 0 or discount > 1:
        raise ValueError("Invalid input")
    return price * (1 - discount)
```

按照约定，测试文件通常以 `test_` 开头。我们创建一个 `test_math_utils.py` 文件，专门用来存放测试：

```python
# test_math_utils.py
import pytest
from math_utils import calculate_discount

# 测试函数也必须以 test_ 开头
def test_calculate_discount_normal():
    # 测试常规情况
    assert calculate_discount(100, 0.2) == 80.0

def test_calculate_discount_zero():
    # 测试免费情况
    assert calculate_discount(100, 1.0) == 0.0

def test_calculate_discount_invalid():
    # 测试异常抛出情况：使用 pytest.raises 捕获期望的异常
    with pytest.raises(ValueError):
        calculate_discount(-10, 0.2)
```

### 运行测试

在命令行中，切换到代码所在目录，直接输入 `pytest` 命令即可。`pytest` 会自动发现当前目录及其子目录下所有以 `test_` 开头的文件，并执行里面所有的测试函数。

```text
$ pytest
=========================== test session starts ============================
collected 3 items                                                          

test_math_utils.py ...                                               [100%]

============================ 3 passed in 0.02s =============================
```

每个绿色的点 `.` 代表一个测试通过。如果有测试失败，它会显示红色的 `F`，并在下方详细打印出是在哪一行失败的，以及当时的变量值是什么，极其方便调试。

## 进阶利器：Fixture

在武侠世界里，每次比武前都需要布置擂台，比武后又要打扫战场。在测试中，这被称为**前置（Setup）**和**后置（Teardown）**操作。例如：测试数据库功能前，我们需要连接数据库并插入一些假数据；测试结束后，我们需要清空数据并断开连接。

`pytest` 提供了非常优雅的 `@pytest.fixture` 装饰器来解决这个问题：

```python
import pytest

# 定义一个 fixture
@pytest.fixture
def empty_cart():
    print("\n[Setup] 初始化一个空购物车...")
    cart = []
    yield cart  # 将资源传递给测试函数。执行完 yield 后，程序会在此暂停，直到测试结束
    print("\n[Teardown] 测试结束，清空购物车...")
    cart.clear()

# 测试函数只需将 fixture 的函数名作为参数传入即可
def test_add_item(empty_cart):
    empty_cart.append("倚天剑")
    assert len(empty_cart) == 1
    assert empty_cart[0] == "倚天剑"
```

当 `pytest` 运行 `test_add_item` 时，它会发现我们需要 `empty_cart`，于是自动去执行该 fixture，把生成的 `cart` 注入进来。测试完成后，还会继续执行 `yield` 后面的清理代码。

## 数据驱动：参数化测试

如果我们想用 10 组不同的数据来测试同一个函数，没必要傻乎乎地写 10 个测试函数。`pytest` 提供了强大的参数化装饰器 `@pytest.mark.parametrize`：

```python
import pytest
from math_utils import calculate_discount

# 一次性传入多组数据：(原价, 折扣, 期望结果)
@pytest.mark.parametrize("price, discount, expected", [
    (100, 0.1, 90.0),
    (200, 0.5, 100.0),
    (50, 0, 50.0),
    (0, 0.2, 0.0)
])
def test_calculate_discount_multi(price, discount, expected):
    assert calculate_discount(price, discount) == expected
```

运行这个测试时，`pytest` 会把它当作 4 个独立的测试用例来执行。如果其中一组失败，不影响其他组的运行。这种方式大大提高了测试代码的复用率和整洁度。

## 结语

在 Pythora 星球，代码写得漂亮固然令人钦佩，但能写出覆盖率极高的测试代码，才是宗师风范。良好的测试习惯就像是为你的项目穿上了一层坚不可摧的软猬甲，让你在未来的重构与功能迭代中无惧风雨。
