# 现代 Python 的类型提示

在 Pythora 星球的早期岁月中，Python 以其无拘无束的“动态类型”闻名江湖。那时的剑客们出招如风，不问兵器长短（变量类型），只要能拔出剑来（拥有该方法），便能上阵杀敌。这就是著名的“鸭子类型”。

然而，随着各大门派的项目规模日益庞大，这种无拘无束渐渐显露出了弊端。代码写得快，但别人接手时却看得云里雾里：这个函数的 `data` 参数到底是个列表、字典，还是一个自定义的对象？如果不去一行行阅读源码，甚至运行起来报错，谁也无法确定。

为了解决这个问题，Python 从 3.5 版本开始引入了**类型提示（Type Hinting）**。它在保留了 Python 动态语言特性的同时，赋予了代码静态语言般的严谨与自解释能力。

## 动态类型 vs 静态类型

传统的 Python 代码是动态类型的，变量的类型在运行时才会确定：

```python
def process_user(user_id):
    # 这里 user_id 到底应该是数字还是字符串？
    return user_id * 2
```

如果你传入整数 `3`，它返回 `6`；如果你传入字符串 `"3"`，它返回 `"33"`。这很容易在不知不觉中埋下隐患。

而加上类型提示后，函数的意图瞬间变得清晰：

```python
def process_user(user_id: int) -> int:
    return user_id * 2
```

通过冒号 `:` 我们标注了 `user_id` 应该是一个整数，通过箭头 `->` 标注了函数的返回值也是一个整数。

> **注意**：Python 的类型提示仅仅是“提示”。Python 解释器在运行时会完全忽略这些注解，即使你传入了字符串，程序依然会像以前一样运行（或者报错）。它的主要作用是辅助开发者阅读，以及让现代 IDE（如 PyCharm 或 VS Code）提供精准的代码补全和错误警告。

## 基础类型与 `typing` 模块

除了最基础的 `int`, `float`, `str`, `bool` 之外，我们在实战中经常会遇到更复杂的容器类型。这时，我们需要借助内置的 `typing` 模块。

*(注：在 Python 3.9 及之后的版本中，内置类型 `list`、`dict` 等已经直接支持类型提示，但在老版本中需要从 `typing` 导入大写的 `List`、`Dict`。)*

### 列表与字典

我们可以精确地指出列表里装的是什么，字典的键和值分别是什么类型：

```python
from typing import List, Dict

# 指定这是一个包含字符串的列表
def get_user_names(user_ids: List[int]) -> List[str]:
    return [f"User_{uid}" for uid in user_ids]

# 指定字典的键是字符串，值是浮点数
def calculate_scores() -> Dict[str, float]:
    return {"Alice": 95.5, "Bob": 88.0}
```

### 多种可能：`Union` 与 `Optional`

有时一个变量可能是多种类型之一。比如一个函数的参数既可以是整数也可以是浮点数，我们可以使用 `Union`：

```python
from typing import Union

def square_area(side_length: Union[int, float]) -> Union[int, float]:
    return side_length * side_length
```

更为常见的是，一个函数可能会找不到结果而返回 `None`。这时我们使用 `Optional`（它实际上是 `Union[X, None]` 的简写）：

```python
from typing import Optional

def find_user(username: str) -> Optional[dict]:
    if username == "admin":
        return {"id": 1, "role": "admin"}
    return None  # 如果没有找到，返回 None
```

### 任意类型与可调用对象：`Any` 与 `Callable`

当你确实不在乎一个变量是什么类型，或者你正在对接一段古老的、没有类型的遗留代码时，可以使用 `Any` 充当“逃生舱”，告诉检查工具：“别管这个，随它去吧。”

如果你需要将一个函数作为参数传递（就像我们在函数式编程章节看到的高阶函数），可以使用 `Callable`：

```python
from typing import Callable

# action 参数必须是一个接收字符串并返回整数的函数
def execute_task(task_name: str, action: Callable[[str], int]) -> int:
    print(f"正在执行任务: {task_name}")
    return action(task_name)
```

## 静态类型检查：mypy

既然 Python 解释器在运行时会忽略类型提示，那我们如何确保写上去的类型注解是正确的呢？

这就要祭出 Python 社区最著名的静态类型检查工具——`mypy` 了。它就像是代码的严格教导主任，在代码运行之前，通过分析你的源码来找出所有类型不匹配的潜在 Bug。

首先在终端安装它：

```bash
pip install mypy
```

假设我们有以下写错了类型的代码：

```python
# test_types.py
def greet(name: str) -> str:
    return "Hello " + name

# 错误：传入了整数而不是字符串
greeting = greet(123)
```

在终端中运行 `mypy test_types.py`，它会立即报错并指出问题所在，而不需要你真正去运行代码：

```text
$ mypy test_types.py
test_types.py:6: error: Argument 1 to "greet" has incompatible type "int"; expected "str"
Found 1 error in 1 file (checked 1 source file)
```

## 结语

在现代 Python 协作开发中，类型提示已经成为了不可或缺的基础素养。无论是目前最火爆的 Web 框架 FastAPI（利用类型提示自动校验和生成文档），还是著名的数据验证库 Pydantic，都在极度依赖这一机制。

养成写类型提示的习惯，不仅能让你的 IDE 补全变得如虎添翼，更是为你的队友（以及几个月后的自己）留下的最清晰的路标。
