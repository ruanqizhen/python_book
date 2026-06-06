# 调用 AI 大模型

在 Pythora 星球上，虽然居民们可以通过编写 Python 代码来驱使万物，但有时候，他们也会遇到一些需要极其庞大知识储备或复杂逻辑推理才能解决的难题。每当这时，他们便会向居住在云端的“超级心智”——大语言模型（Large Language Model, LLM）寻求帮助。

在现实世界中，Python 是与这些 AI 大模型沟通最天然、最便捷的语言。目前市面上最强大的 AI 大模型（如国外的 OpenAI ChatGPT，国内的 DeepSeek、通义千问等）都提供了 API（应用程序编程接口）。通过 API，我们可以让 Python 程序自动把问题发送给 AI，并接收 AI 的回答，从而将 AI 的大脑无缝接入到我们自己的应用程序中。

本章我们将以行业的标杆 **OpenAI** 和近期备受瞩目的国产开源之光 **DeepSeek** 为例，简要讲解如何使用 Python 调用 AI API。如果想要更深入学习 AI 编程，可以参考这本书[《重构程序员》](https://cocode.qizhen.xyz/)。

## 准备工作：通行令牌（API Key）

要与云端的 AI 通信，首先需要证明你的身份。各个 AI 提供商都会为你生成一串由字母和数字组成的乱码，这就是 **API Key**（密钥）。它就像是进入云端宝库的通行令牌。

获取通行令牌的方法很简单：

1. 前往 OpenAI 或 DeepSeek 的官方开发者平台注册账号。
2. 找到“API Keys”菜单，点击“创建新的 API Key”。
3. 复制这串字符并妥善保存。**注意：API Key 相当于你的银行卡密码，绝不能把它直接写在代码里并上传到公开的网络上（如 GitHub）！** 否则别人就可以盗用你的额度。

### 环境变量与 python-dotenv

为了安全地存放 API Key，Pythora 星球的法师们通常会把它写在一个隐藏的 `.env` 文件中，并通过 Python 的环境变量来读取。

首先，在你的终端中安装 `python-dotenv` 库：

```bash
pip install python-dotenv

```

然后，在你的 Python 脚本同级目录下，新建一个名为 `.env` 的文本文件，在里面写上你的密钥：

```text
# .env 文件内容
OPENAI_API_KEY="sk-你的OpenAI密钥..."
DEEPSEEK_API_KEY="sk-你的DeepSeek密钥..."

```

在 Python 程序中，你可以这样安全地读取它们：

```python
import os
from dotenv import load_dotenv

# 加载 .env 文件中的配置
load_dotenv()

# 获取密钥（如果找不到，会返回 None）
openai_key = os.getenv("OPENAI_API_KEY")
print("成功读取密钥！") 

```

## 召唤 OpenAI：行业标准的对话

OpenAI 官方提供了一个非常完善的 Python 库，大大简化了发送请求的繁琐过程。首先安装官方库：

```bash
pip install openai

```

### 第一个 AI 对话程序

下面的代码展示了如何向 OpenAI 发送一段话，并打印出它的回复：

```python
import os
from dotenv import load_dotenv
from openai import OpenAI

# 1. 加载环境变量
load_dotenv()

# 2. 初始化客户端
# 它会自动去环境变量中寻找名为 OPENAI_API_KEY 的密钥
client = OpenAI()

# 3. 发送请求
response = client.chat.completions.create(
    model="gpt-4o",  # 指定使用的模型名称
    messages=[
        {"role": "system", "content": "你是一位精通 Python 的编程宗师，说话总是带着武侠风格。"},
        {"role": "user", "content": "请用一句话解释什么是 Python 中的列表？"}
    ],
    temperature=0.7  # 控制回答的随机性，0 最严谨，1 最发散
)

# 4. 提取并打印 AI 的回复内容
print(response.choices[0].message.content)

```

**代码解析：**

* **`model`**：指定你要召唤的具体模型（如 `gpt-4o`, `gpt-3.5-turbo`）。
* **`messages`**：这是一个列表，记录了对话的上下文。其中包含不同的角色（`role`）：
* `"system"`（系统）：这是给 AI 设置“人设”或全局背景指令的地方。
* `"user"`（用户）：你发出的问题或指令。
* `"assistant"`（助手）：AI 之前的回复（如果在多轮对话中，你需要把 AI 之前说过的话也加进来，帮助它记住上下文）。


* **`temperature`**：温度参数。如果你希望它写诗写小说，可以调高（如 0.8）；如果你希望它写严格的代码或做数学题，可以调低（如 0.0）。

## 召唤 DeepSeek：无缝平替的魅力

DeepSeek（深度求索）是近来极受瞩目的国产 AI 模型，其代码能力和逻辑推理能力都达到了世界顶尖水平，而其 API 的调用价格却非常亲民。

对于 Python 开发者来说，DeepSeek 有一个极其令人愉悦的设定：**它的 API 格式完全兼容 OpenAI 的标准！** 这意味着你**不需要**学习任何新的库。你只需要修改刚才程序中的两个参数：**Base URL（服务器地址）** 和 **API Key**，就可以用召唤 OpenAI 的法术，直接召唤 DeepSeek！

```python
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

# 初始化客户端，这次我们指定 DeepSeek 的基地地址和密钥
client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com/v1"  # 将请求指向 DeepSeek 的服务器
)

# 发送请求的方式与 OpenAI 完全一模一样
response = client.chat.completions.create(
    model="deepseek-chat",  # 指定 DeepSeek 的模型名称
    messages=[
        {"role": "system", "content": "你是一个有用的助手。"},
        {"role": "user", "content": "Pythora 星球是什么样子的？请发挥你的科幻想象力。"}
    ],
    stream=False
)

print(response.choices[0].message.content)

```

*注：目前国内外许多优秀的开源模型或 API 服务（如硅基流动、Groq 等）都支持了 OpenAI 的接口格式。只要掌握了 OpenAI SDK 的用法，你就可以在各种大模型之间自由切换，这就是统一标准的魅力。*

## 进阶技巧：流式输出（Streaming）

在实际使用 ChatGPT 时，你会发现文字是一个字一个字蹦出来的。这被称为**流式输出（Streaming）**。由于大模型生成长篇大论需要几十秒的时间，如果等它全部写完再显示，用户会觉得程序卡死了。

在 Python 中实现这种“打字机”效果非常简单，只需在调用时加上 `stream=True`：

```python
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com/v1"
)

# 注意这里添加了 stream=True
stream = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "请写一首关于 Python 程序员的打油诗。"}],
    stream=True  
)

print("AI 正在作诗：\n")
# 此时返回的是一个可迭代对象，我们需要用 for 循环一点点提取它的字
for chunk in stream:
    # 每次提取生成的一个片段（可能是一个字或一个词）
    if chunk.choices[0].delta.content is not None:
        # 使用 print 的 end="" 确保它不会每次都换行
        print(chunk.choices[0].delta.content, end="", flush=True)

```

## 异常处理：应对网络与云端风暴

向云端发送请求时，网络波动、API 余额不足、甚至云端服务器崩溃都是可能发生的事情。一个健壮的 Python 程序必须能够优雅地处理这些异常，而不是直接崩溃。

在使用大模型 API 时，强烈建议结合我们在[异常处理](https://www.google.com/search?q=exception)一章中学到的知识：

```python
from openai import OpenAI, APIError, AuthenticationError, RateLimitError

client = OpenAI()

try:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": "你好！"}]
    )
    print(response.choices[0].message.content)
    
except AuthenticationError:
    print("错误：身份验证失败，请检查你的 API Key 是否正确！")
except RateLimitError:
    print("错误：请求过于频繁，或余额已耗尽，请稍后再试！")
except APIError as e:
    print(f"云端服务器打了个盹，发生错误：{e}")
except Exception as e:
    print(f"发生了一个未知的本地错误：{e}")

```


## 多轮对话与历史拼接

在刚才的例子中，我们每次向云端发送请求，都是一次“一锤子买卖”。云端的大模型本身是无状态（Stateless）的，它没有任何记忆。如果你先问“我的名字叫奇桢”，它回答“记住了”；你紧接着发第二次请求问“我叫什么名字？”，它会一头雾水。

为了让 AI 拥有连贯的记忆，实现真正的“多轮对话”，我们必须在本地代码中维护一条“记忆长河”。**秘诀就在于：每次向 AI 发送请求时，不仅要发送最新的问题，还要把之前所有的对话历史一并打包发送过去。**

让我们用一个 `while` 循环来实现一个真正的本地 AI 聊天机器人：

```python
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com/v1"
)

print("🧙‍♂️ 云端智库已连接！(输入 '退出' 结束对话)\n")

# 1. 初始化“记忆长河”：创建一个列表来保存整个对话上下文
dialogue_history = [
    {"role": "system", "content": "你是一位耐心且幽默的编程导师。"}
]

while True:
    # 2. 获取用户输入
    user_input = input("你: ")
    if user_input.strip() == '退出':
        print("云端连接已断开，再见！")
        break
    
    # 3. 将用户的新问题打包成字典，加入记忆列表
    dialogue_history.append({"role": "user", "content": user_input})
    
    # 4. 带着完整的记忆列表去召唤 AI
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=dialogue_history  # 这里的消息包含了之前所有的对话！
        )
        
        # 5. 提取 AI 的回答
        ai_reply = response.choices[0].message.content
        print(f"AI: {ai_reply}\n")
        
        # 6. 【最关键的一步】将 AI 的回答也加入记忆列表！
        # 这样下一次循环时，AI 就能“看到”自己刚才说过的话了
        dialogue_history.append({"role": "assistant", "content": ai_reply})
        
    except Exception as e:
        print(f"通信受阻：{e}")
        # 如果通信失败，最好把刚刚加进去的用户问题弹出来，以免破坏上下文逻辑
        dialogue_history.pop()

```

### 内存修剪与“上下文腐化”

在这个程序中，随着你不断地聊天，`dialogue_history` 列表会变得越来越长。这会带来两个现实问题：

1. **费用与限制**：AI API 是按处理的字数（Token）计费的。每次都发送海量的历史记录，不仅会让 API 调用变慢，还会迅速消耗你的额度。更何况，每个模型都有最大上下文长度的硬性限制（比如 8K、32K 或 128K 个 Token），一旦超出，云端就会报错拒收。
2. **上下文腐化（Context Rot）**：即使没有超出长度限制，输入文本过长也会导致一种被称为“上下文腐化”的现象。AI 的注意力机制会被大量早期、无用的闲聊信息稀释，导致它开始遗忘最初设定的系统指令（System Prompt），或者产生逻辑混乱、答非所问的情况。

因此，在 Pythora 星球开发真正的大型 AI 应用时，居民们通常会编写一些“记忆修剪”的逻辑。比如：只保留最近的 10 轮对话，将更早的对话扔掉；或者当列表长度超过一定阈值时，自动调用另一个 AI 程序，把早期的长篇大论总结成短短的一两百字，再将这篇摘要作为新的“记忆起点”。

