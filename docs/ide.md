# Python 编程基础

这一部分我们将会介绍 Python 语言的核心语法和基础用法。编程是一项实践性非常强的技能，无论从哪里开始学习都可以，但一定要亲自动手编写代码才能真正掌握学到的知识。所以首先我们可能就要考虑一下在哪编写代码呢？

有几个不同的选择，Pythora 星球上的初学者一般都会先使用第三方的免费在线开发环境入门，在对 Python 有了一定了解后，需要继续深入学习时，再在自己电脑上安装更专业的开发环境。

## 第三方的在线开发环境

在过去，想要编写、运行和测试代码，通常需要在本地机器上安装特定的编程环境和工具。但随着技术的发展，我们现在可以直接在浏览器中使用在线的集成开发环境（IDE）来编写、运行和测试代码。这样，我们不再需要在自己的电脑上安装任何软件或工具，打开一个网页，直接就可以编写运行程序了。Python 作为一种流行的编程语言，有许多针对其设计的在线 IDE。下面就来介绍如何使用在线 IDE 来编写 Python 程序。

如果读者还没有自己常用的在线 IDE，可以打开 Google 上搜索“online IDE”，能够找到非常多的免费的在线编程网站，可以任意选择一个使用。在写作此书的时候，出现在搜索结果上的前两个 IDE 分别是：

* [https://www.online-ide.com/online_python_ide](https://www.online-ide.com/online_python_ide)
* [https://ideone.com/](https://ideone.com/)

* 常用的在线 IDE 还有 Replit、Programiz 等。

一个典型的在线编程环境的页面如下：

![](images/001.png "一个典型的在线编程环境")

页面主要需要的区域是一个文本框，把程序写在这里就可以。编写代码后，可以运行它来查看结果。在线 IDE 通常都有一个“运行”或“执行”按钮，点击它，IDE 会在其服务器上执行你的代码，并将输出显示在屏幕上。上图编辑环境的下半部分就是信息输出的文本框，用于观察程序运行的状态、结果等信息。

更高级的在线开发环境会有登录选项，如果用户创建一个账户，则可以把自己的程序长期存放在网站上，甚至也可以直接把程序连接分享给别人。未登录用户需要注意，关闭网页后，自己写的程序可能会丢失，如果需要留档，需要自己把程序下载到本地计算机上。当前，最著名的 Python 在线 IDE 是 [Google Colab](https://colab.research.google.com/ )，有很多开源项目就是在它上面进行开发和分享的。

上面介绍的几个网站，写好 Python 程序都是在它们的服务器上运行的，它们会把运行结果显示在网页上。还有一类更轻量化的开发环境，它们会直接在用户的浏览器里运行 Python 程序。比如这是一个调用 brython 搭建的页面 [https://qizhen.xyz/brython](https://qizhen.xyz/brython)。这两个页面都是用来在浏览器运行 Python 程序的，可以用于学习时随手测试。这类网页工作的原理是先把 Python 程序翻译成 JavaScript 代码，而浏览器可以直接运行 JavaScript 程序，这样就间接的运行了用户输入的 Python 程序。

基于 JavaScript 的 Python 解释器可以更容易的嵌入任何网页，使用方便。但是，它们一般只能支持最基础的 Python 功能，很多高级功能是用不了的。而且其程序运行行为也可能与最常用的用 C 语言编写的 Python 解释器有差别，所以还是建议读者还是首选那些在把程序运行在服务器上的在线开发环境用于学习。


## 安装 Python 解释器

如果在线开发环境不能满足需求了，你就需要把 Python 安装到自己的电脑上。

这里有一个重要的选择：是安装官方原版还是Conda 发行版？

- 官方原版：到 [Python 官网](https://www.python.org/downloads/)下载。它非常轻量，适合学习基础语法。
- Conda 发行版（推荐）：如果你打算将来进行数据分析、机器学习开发，或者需要在电脑上同时跑多个不同版本的 Python，Conda 是更好的选择。它自带了 Python 解释器，所以安装了 Conda 后，通常就不需要再单独安装官方原版 Python 了。

Pythora 星球的居民通常面临复杂的项目需求。比如，某个老项目必须运行在 Python 3.9，而新项目必须使用 Python 3.12；或者一个项目依赖 PyTorch 1.x，另一个需要 PyTorch 2.x。如果只安装一个 Python，解决这些冲突会非常令人头秃。因此，Pythora 居民一般使用 Conda 来为每个项目创建独立的“平行宇宙”（虚拟环境）。

### 使用 Conda 管理环境

在开源社区中，最流行的 Conda 发行版是 [Miniconda](https://docs.conda.io/en/latest/miniconda.html )（精简版，只包含核心）和 [Anaconda](https://www.anaconda.com/ )（全家桶版，包含几乎所有科学计算库，体积较大）。初学者推荐安装 Anaconda，省去后续安装各种库的麻烦。

在安装 Conda 后，打开终端（Windows 上是 Anaconda Prompt），你会发现提示符前多了一个 `(base)`，这表示你当前处在默认的基础环境中。

假设我们要编写一个游戏，为了避免它与其它程序冲突，我们为其创建一个独立的新环境，起名为 `game`，并指定 Python 版本为 3.9：

```sh
(base) qizhen@deep:~$ conda create --name game python=3.9

```

使用 `conda env list` 命令可以列出所有已创建的环境，以及它们所在的文件夹路径。我们需要记住这个路径，在 VS Code 或 PyCharm 中配置解释器时，经常会用到它。

```sh
(base) qizhen@deep:~$ conda env list
# conda environments:
#
base                  * /home/qizhen/anaconda3
game                     /home/qizhen/anaconda3/envs/game

```

要进入这个新环境，运行 `activate` 命令：

```sh
(base) qizhen@deep:~$ conda activate game
(game) qizhen@deep:~$ 

```

可以看到，命令提示符从 `(base)` 变成了 `(game)`。现在，你在这个环境里安装的任何库，都不会影响到外面的 `base` 环境，反之亦然。


## 专业的本地 IDE

Python 的解释器只提供了最简单的命令行界面。在命令行环境下运行“python”命令，就可以启动 Python 环境，然后输入代码运行：

![](images/002.png "命令行环境")

这显然不是一个特别舒适的书写程序的环境。一个更好的方法是在读者最喜欢的文本编辑器中（比如，在 Pythora 星球上，最流行的文本编辑工具是 Notepad++）书写代码，写完全部代码后，调用 python 命令运行整个程序。市面上还存在着各式各样的专用于程序编辑的工具，它们比文本编辑器更适合编写程序。目前最流行的免费 Python IDE 是 Visual Studio Code（VS Code） 和 PyCharm。如果读者同时使用多种编程语言，VS Code 是一个非常好的选择，如果 Python 是读者唯一使用的编程语言，那么 PyCharm 会更加适合。

### Visual Studio Code （VS Code） 

VS Code 是一个轻量级、高度可配置的代码编辑器，支持各种语言和工具。在 [Visual Studio Code 官方网站](https://code.visualstudio.com/ )可以下载并安装 VS Code。 VS Code 可用于编写和运行多种编程语言的程序，针对 Python，在 VS Code 中，点击左侧工具栏的扩展图标（或按 Ctrl+Shift+X），然后搜索“Python”。选择由 Microsoft 提供的 Python 扩展并安装，就可以获得专为 Python 提供的语法高亮、智能感知、代码格式化、调试、Linting 等功能。
 
下图是在 VS Code 中打开的一个 Python 程序：

![](images/003.png "VS Code")

打开一个 Python 文件或新建一个。在文件右上角或底部状态栏，你可以选择 Python 解释器版本。点击它，然后选择与你的项目匹配的 Python 解释器。

现在，读者可以开始在 VS Code 中编写 Python 代码了。由于已经安装了 Python 扩展，你会在编写代码时得到自动完成、参数提示等功能的支持。

在 Python 文件编辑器的顶部，读者应该会看到一个绿色的运行按钮。点击它，就可以执行当前 Python 文件。读者也可以右键点击编辑器，然后选择“在 Python 终端中运行”来执行代码。

VS Code 也提供了调试，版本控制，虚拟环境管理等等几乎所有软件开发中常用的功能。另外 VS Code 社区提供了许多有用的扩展，帮助程序员处理 Python 项目，比如 Python Test Explorer 插件可以帮助运行和调试 Python 单元测试等。

### PyCharm

PyCharm 是 JetBrains 提供的一款专业的 Python IDE（集成开发环境），被广大开发者誉为 Python 开发的神器。它集成了许多强大的功能，包括代码补全、智能提示、调试、测试支持、版本控制等，使得 Python 开发变得高效和便捷。

从 [PyCharm 官方网站](https://www.jetbrains.com/pycharm/) 下载 PyCharm。PyCharm 提供了专业版（付费）和社区版（免费）两个版本。对于个人使用，免费社区版足够了。

PyCharm 的用法与 VS Code 非常类似，只是界面略有不同。在 PyCharm 中，可以创建多个 Python 项目，然后为每个项目选择合适的解释器和虚拟环境。除了运行、调试、代码管理等基本功能，PyCharm 也有大量的扩展插件可供选择。无论是新手还是资深开发者，PyCharm 都可以极大地提高 Python 开发的效率和质量。

下图是同样一段程序在 PyCharm 中打开：

![](images/004.png "PyCharm")

## 基于网页的编程环境

传统的 IDE 往往是一个独立的应用程序，但近些年，这类没有独立用户界面，依赖网页浏览器提供界面的编程环境开始流行。Jupyter Notebook 及其升级版 JupyterLab 是这其中的典型代表。上文介绍的 Google Colab 也是 Jupyter Notebook 一个衍生版。

Jupyter Notebook 是一个开源的交互式编程环境。它本身不是一个应用程序，而是一个网页服务，启动这个服务，就可以在网页浏览器中，打开相关的网页，编辑运行程序了。与传统的 IDE 相比，它有几个非常显著的优点： 

* 交互式编程： 它把程序代码分隔成很多单元格，每个单元格的代码可以独立运行，并立刻看到输出结果，这对于数据分析和可视化非常有用。
* 富文本支持： 可以使用 Markdown 和 LaTeX 来格式化文本和方程式，产生具有不同字体，格式的文本，也可以嵌入图片、视频等。真正做到了程序与文档融合为一体。
* 便于分享： 它的富文本格式内容可以导出为多种文档格式，如 PDF、HTML 等，方便分享报告和分析结果。并且它本身就是一个网页服务，可以轻松的让其他人访问本地的程序内容。
* 支持多种编程语言： 虽然传统 IDE 也可以支持多种编程语言，但是 Jupyter Notebook 及其衍生产品又更进一步，可以在同一个文件中就集成多种不同编程语言的代码。它可以用一种编程语言运行程序的前一段，再用另一种语言运行程序的后一段。

其它的传统 IDE 具备的优点，比如，插件扩展、跨平台等，Jupyter Notebook 也同样都具备。

Jupyter Notebook 尤其受到数据科学家、研究人员和学者的欢迎。下图是使用 Jupyter Notebook 打开的一段程序：

![](images/005.png "Jupyter Notebook")

### 安装与使用：

如果你安装了 Anaconda，Jupyter 已经内置其中，无需安装。如果你使用的是官方 Python，需要通过命令行安装：

```sh
pip install jupyterlab
```

在命令行或终端中，输入以下命令，将会启动一个编程所需的网页服务：

```sh
jupyter lab
```

它会自动在浏览器中打开编程界面。如果网页没有自动打开，或不小心被关闭了，读者也可以自己打开浏览器，输入网址： `http://localhost:8888/` 重新打开编程页面。

在打开的主页面上，点击“New”按钮，选择你的目标编程语言，如 Python 3，就可以创建一个新的 Notebook 文件。我们称每个程序为一个“Notebook”。在新的 Notebook 中，你可以输入 Python 代码并点击“Run”按钮（或按 Shift + Enter）执行。点击页面上方的“+”按钮可以添加新的单元格。你可以在单元格中选择“Markdown”模式，然后输入 Markdown 文本或 LaTeX 方程。点击页面上方的保存按钮（或按 Ctrl + S）可以保存当前的程序。如果需要退出编程环境，可以关闭浏览器标签后，回到命令行并按 Ctrl + C 终止 Jupyter Notebook 服务。

Jupyter Notebook 保存下来的文件后缀名不是 .py 而是 .ipynb。 这是因为，这个文件中不但要保存程序代码，还会保存程序的运行结果，富文本文档等内容。不过在 Jupyter Notebook 的菜单选项中，可以导出并保存一个只包含代码的 .py 文件。


以上这些开发环境，Pythora 星球的居民都会使用到。Pythora 星球的居民一般会在学习或者测试一些小程序比如面试题目的时候，使用第三方的在线编辑环境；在开发个人使用的应用程序或者网页时，采用 PyCharm；在工作中，进行数据统计、机器学习等类型的项目时，采用公司搭建的类似 Jupyter Notebook 的环境进行开发；在开发工作相关的应用程序、网络应用等程序时，使用 VS Code。

