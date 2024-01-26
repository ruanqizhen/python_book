# 代码风格和规范

## PEP 8 规范

Python 的编码风格广泛遵循一种名为 PEP 8 的风格指南。PEP 8，即 [Python Enhancement Proposal 8](https://peps.python.org/pep-0008/)，是一个官方文档，描述了 Python 代码的编写约定，目的是提高 Python 代码的可读性和一致性。

这个规范非常详尽，条目繁多，这里提取一些最主要的指导原则：

- 缩进： 使用 4 个空格进行缩进，不建议使用制表符（Tab）。每级缩进应为 4 个空格。
- 行宽： 每行代码建议不超过 79 个字符，这样有利于在小屏幕上查看，也便于并排放置多个文件。对于长的表达式，应适当换行，并保持逻辑上的连贯。
- 空行： 顶层定义之间空两行，如类定义。方法定义之间空一行。在函数中使用空行来区分逻辑段落。
- 导入： 导入语句应该分行书写。导入顺序：标准库导入、相关第三方导入、本地应用/库特定导入，每一组之间用空行分隔。
- 空格： 赋值（=）、比较（`==, !=, <, >, <=, >=`）、算术运算符（`+, -, *, /, //, %` 等）的两侧应各添加一个空格。 函数参数列表、索引或切片的括号内侧不应有空格。
- 注释： 注释应当与其描述的代码同等缩进。注释应该是完整的句子。如果注释是短语或句子，其首字母应大写，除非是以代码内的标识符（即代码内变量等）开始。
- 命名： 类名通常使用 CamelCase 风格。函数名和变量名通常使用 snake_case 风格。常量通常使用 UPPER_CASE 风格。

## 自动格式化代码

现在有很多工具可以帮我们自动化格式化程序代码，让代码风格保持一致，提高代码可读性。这些工具可以自动地调整代码的格式，如缩进、空格、换行等，使代码更加整洁和标准化。

### PyCharm 自带的代码格式化工具

PyCharm 是一款流行的 Python 集成开发环境（IDE），提供了许多强大的功能，其中包括代码自动化格式化。PyCharm 自带了代码格式化的功能，可以轻松地对代码进行格式化，使其符合PEP 8等编码规范。

如果需要手动格式化一个 Python 文件，可以在打开的 Python 文件中，选择 Code -> Reformat Code 或使用快捷键（在大多数情况下是 Ctrl+Alt+L 在Windows/Linux上，Option+Command+L 在MacOS上）。然后文件就会被按照规范格式化。

我们也可以设置自动在保存时格式化文件，这样就不需要手动调整了。进入 File -> Settings（或 PyCharm -> Preferences 在 MacOS 上）。在 Tools -> Actions on Save 中，勾选 Reformat code 选项，就可以让 PyCharm 自动格式化代码文件。

### 使用第三方的代码格式化工具

如果觉得 IDE 自带的工具不够好，我们还可以使用其它一些工具对代码进行格式化。此外，像 VSCode 这种通用 IDE，并不是针对 Python 代码的，它们通常不会默认带有 Python 代码的格式化工具也需要额外安装后再使用。

常用的代码格式化工具有很多，比如 Black、Flake8、autopep8 和 YAPF 等等。以 Black 为例，我们在使用它之前需要先安装：

```sh
pip install black
```

在 PyCharm 中，进入 File -> Settings -> Tools -> External Tools。点击 "+" 添加新工具。在 “Name” 字段中输入工具名（Black）。在 “Program” 字段中输入工具的路径（可能需要在终端中运行 which black（MacOS/Linux）或 where black（Windows）来找到路径）。在 “Arguments” 字段中输入 $FilePath$。在 “Working directory” 字段中输入 $ProjectFileDir$。完成后，就可以通过 Tools -> External Tools -> Black 来运行 Black 格式化。

在 VSCode 中的设置也比较类似，点击 VSCode 左侧边栏的扩展图标。搜索 “Python” 并选择由 Microsoft 发布的 Python 扩展，点击安装。然后选择格式化工具如 Black。之后就可以使用了。


## The Zen of Python

运行如下代码：

```python
import this
```

就会看到它的输出是一首诗：

```
The Zen of Python, by Tim Peters

Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than *right* now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of those!
```

这段文字是《Python 禅意》，由 Tim Peters 所著。《Python 禅意》包含了许多对 Python 编程风格和哲学的深刻见解，强调了简洁、可读性和明确性的重要性。其中文翻译大致如下：

```
优美胜于丑陋，明确胜于隐晦，
简单胜于复杂，复杂胜于混乱，
扁平胜于嵌套，疏散胜于密集，
可读性最重要。

特殊情况不足以打破规则，
不过实用性胜过纯洁性。
错误不应被默默忽略，
除非它的确需要如此。

面对不确定性，拒绝妄加猜测。
应该只有一种，最好是唯一一种，
显而易见的方法去做事，
虽然一开始可能并不明显，除非你是荷兰人。

做比不做好。
但不假思索就行动还不如不做。
如果实现难以解释，那它可能是个坏主意。
如果实现易于解释，那它可能是个好主意。
命名空间是个绝妙的主意——让我们多加利用！
```

下面是 Pythora 星球居民对这首诗的理解：

### 美观

Python 代码的美观性不仅提高了代码的可读性，也反映了一种编程艺术性。清晰、整洁且一致的代码更易于理解和维护。

代码可读性是编程中的一个重要方面，尤其在团队合作和长期维护的项目中尤为重要。可读性好的代码类似于良好的故事叙述，它清晰地表达了程序的意图和逻辑。下面这段代码的可读性就不是太好：

```python
def calc(x,y):return x/2*y
result=calc(5,7)
print(result)
```

上面这段代码主要的问题在于采用了过于简略的函数名变量名等，如果改用有意义的更清晰的名称，不但可以让程序更容易理解，而且直观视觉也会更顺眼：

```python
def calculate_area(length, width):
    return length * width / 2

result = calculate_area(5, 7)
print(result)
```

改进的程序，不仅仅是使用了有意义的函数变量名，在命名风格也有改进。使用一致的编码风格有助于团队成员更好地理解和维护代码。遵守统一的编码标准可以提高代码质量。另一个改进是添加了一些额外的空格和空行。因为过于密集的代码会降低可读性。合理使用空格和空行可以让代码更加清晰。Python 允许在一行写多个语句，但是这样代码就会显得太过密集，比如：

```python
if condition:do_action1();do_action2()
```

如上的代码应该始终拆为多行：

```python
if condition:
    do_action1()
    do_action2()
```

代码也可以是一种艺术表达。编写优雅的代码不仅体现了技术能力，也反映了个人风格和创造力。Python 中有一些冗余复杂的编程方法，但它们可能会比最初级的编程方法要美观的多。比如，很多时候列表推导式会比循环结构更优雅：

```python
# 使用列表推导式
squares = [x * x for x in range(10)]

# 传统循环方式
squares = []
for x in range(10):
    squares.append(x * x)
```

美观的代码不仅仅是为了视觉上的整洁，更是为了提高代码的可读性和维护性。一个优秀的 Python 程序员应该追求编写清晰、一致且具有表达力的代码。通过不断练习和学习，提高自己的编码技巧，使代码成为编程艺术的典范。


### 简洁

简洁是一项重要的原则，我们倡导使用简单直观的方法来实现功能，尽量避免不必要的复杂度和过深的嵌套。

一个过于复杂的函数、过深的嵌套循环、条件判断或函数调用等都会使代码难以理解和维护。我们可以通过拆分函数、使用生成器等方式来减少嵌套。

比如下面是一段嵌套过深的代码：
        
```python
def process_data(data):
    if data:
        if data.is_valid():
            for item in data.items:
                if item.is_active():
                    # 处理每个激活的项目
                    pass
                else:
                    # 处理非激活的项目
                    pass
        else:
            print("数据无效")
    else:
        print("无数据提供")
```

我们可以通过提早返回来减少了嵌套层数，使逻辑更清晰，提高代码可读性：

```python
def process_data(data):
    if not data:
        print("无数据提供")
        return
    if not data.is_valid():
        print("数据无效")
        return

    for item in data.items:
        if item.is_active():
            # 处理每个激活的项目
            pass
        else:
            # 处理非激活的项目
            pass
```

### 明确

代码应该清晰地表达其意图，同时避免依赖隐含的行为或内部机制。明确的代码不仅使得开发者之间的沟通更有效，也使得代码对于新手更加友好，降低了学习和使用Python的门槛。遵循这些原则能够提高编程效率，减少错误和误解。

- **明确的代码**使得程序的行为和目的易于理解，减少了歧义和误解的可能性。
   - 变量和状态的明确性：应使用清晰、描述性的变量名，明确变量的作用和状态。例如，使用 total_price 而非简单的 tp。
   - 函数和方法的明确性：函数和方法应明确传递所需参数，其名称和行为应清晰表达其功能。
- **透明的行为**，代码不应隐藏其复杂性或副作用。任何对全局状态的修改或潜在影响都应明确和透明。
   - 避免隐式副作用：函数或方法应避免在不明显的地方产生副作用，如不经意间修改全局变量。
   - 清晰的错误处理：错误处理应明确，不应依赖隐式的错误处理或忽视潜在的错误条件。
- **明确的代码设计**，在设计和实现功能时，应优先考虑明确和直接的路径。
   - 明确地处理错误和边界情况：面对异常或边界情况时，应有明确的处理逻辑，而非依赖于隐晦或不确定的行为。
   - 明确地表达意图：代码应使用清晰的命名和逻辑，避免可能引起混淆的复杂表达式或构造。
   
在下面的示例程序中，用户输入了一个数据，那么在程序中就应该有明确的错误处理机制，以确保在输入不是有效数字时给出清晰的反馈，而不是让程序在不确定的状态下继续运行：

```python
user_input = input("请输入一个数据：")

# 明确的错误处理
try:
    number = int(user_input)
except ValueError:
    print("输入错误！输入不是一个有效的数值。")
    # 可以添加更多的错误处理逻辑，如请求重新输入
else:
    print(f"你输入的数是：{number}")
```
