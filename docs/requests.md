# 网络请求与 Web 抓取

在 Pythora 星球，侠客们不仅要在自己的一方天地里闭门造车，更需要与广阔的江湖（互联网）交换情报。在现代软件开发中，绝大多数有价值的数据和服务都分布在网络上：从获取今天的天气预报、拉取股票行情，到自动向钉钉或微信发送报警消息，都离不开一个核心技术——**网络请求（HTTP Requests）**。

虽然 Python 内置了 `urllib` 模块用于发送网络请求，但它的接口设计相对繁琐，如同手握一把生锈的钝剑，让人用得极其痛苦。幸运的是，Python 社区孕育出了一个被公认为最伟大、最人性化的第三方库：**`requests`**。

它的官方口号是："Requests is an elegant and simple HTTP library for Python, built for human beings."（Requests 是一个为人类构建的、优雅而简单的 Python HTTP 库）。

## 安装 requests

首先，在终端中使用 `pip` 安装：

```bash
pip install requests
```

## 基础功法：GET 请求

HTTP 协议中最常见的操作是 `GET` 请求，即向服务器“获取”数据。你平时在浏览器地址栏输入网址并敲击回车，就是发起了一个 GET 请求。

我们可以用 `requests.get()` 轻松模拟这个过程。假设我们要请求 GitHub 的公共 API：

```python
import requests

# 发起 GET 请求
response = requests.get("https://api.github.com")

# 打印响应状态码（200 表示成功，404 表示未找到等）
print(f"状态码: {response.status_code}")

# 如果返回的是纯文本或 HTML，可以直接查看文本内容
# print(response.text)

# 如果服务器返回的是 JSON 数据，requests 提供了极为方便的 .json() 方法
data = response.json()
print("当前速率限制的 API 接口地址:", data["rate_limit_url"])
```

### 携带查询参数 (Query Parameters)

当我们用搜索引擎搜索“Python”时，URL 通常会变成类似 `https://www.google.com/search?q=Python&hl=zh` 的格式。问号 `?` 后面的就是查询参数。

使用 `requests`，你不需要手动拼接这种容易出错的字符串，只需传入一个字典即可：

```python
import requests

url = "https://httpbin.org/get"
# 将查询参数存入字典
params = {
    "q": "Python",
    "hl": "zh"
}

# requests 会自动将 params 拼接到 URL 后面
response = requests.get(url, params=params)
print(response.url)  # 输出: https://httpbin.org/get?q=Python&hl=zh
```

## 进阶功法：POST 请求

除了获取数据，我们有时需要向服务器“提交”数据，比如登录账户、发布一条评论等，这时需要使用 `POST` 请求。

### 提交 JSON 数据

在现代 Web 开发（如对接上文提到的 FastAPI 服务）中，客户端与服务器主要通过 JSON 进行通信。`requests.post()` 提供了一个 `json` 参数，能够自动将你的字典转化为 JSON 字符串并设置相应的请求头：

```python
import requests

url = "https://httpbin.org/post"
intelligence_data = {
    "reporter": "西门吹雪",
    "target": "叶孤城",
    "secret_level": 5
}

# 直接传递字典给 json 参数
response = requests.post(url, json=intelligence_data)

print("服务器已收到，返回信息如下：")
print(response.json())
```

## 定制 Headers（防爬虫的伪装术）

许多网站为了防止机器人（爬虫）恶意抓取数据，会检查请求来源。它们通常会查看 HTTP 头部（Headers）中的 `User-Agent`，如果发现是脚本语言默认的标识，就会直接拒绝服务（返回 403 Forbidden 等状态码）。

要绕过这种基础的防御，我们可以在发送请求时，通过传入 `headers` 字典将自己伪装成一个普通的浏览器：

```python
import requests

url = "https://httpbin.org/headers"
# 伪装成 Chrome 浏览器
fake_headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

response = requests.get(url, headers=fake_headers)
print("服务器看到的 Headers：", response.json())
```

## 网络异常处理与健壮性

在现实的互联网中，网络波动、服务器宕机是家常便饭。如果你在代码里不加防御，一旦网络断开，整个程序就会崩溃抛出异常。

为了写出健壮的网络脚本，我们需要注意两点：
1. **永远设置超时时间 (`timeout`)**：如果服务器卡死了不返回数据，默认情况下 `requests` 会无限等待下去。
2. **捕获异常 (`try-except`)**：使用 `requests.exceptions.RequestException` 捕获所有与网络相关的报错。

```python
import requests
from requests.exceptions import RequestException

url = "https://api.github.com"

try:
    # 设置 timeout=3 表示如果服务器在 3 秒内未响应，则主动放弃并抛出异常
    response = requests.get(url, timeout=3)
    
    # raise_for_status() 会在状态码不是 200 级别（如 404, 500）时主动抛出异常
    response.raise_for_status()
    
    print("请求成功！")
    
except requests.exceptions.Timeout:
    print("服务器响应太慢，请求超时了！")
except requests.exceptions.HTTPError as e:
    print(f"服务器返回了错误的状态码: {e}")
except RequestException as e:
    print(f"发生了其他网络错误: {e}")
```

## 结语

掌握了 `requests`，你便打通了 Python 与外部世界的任督二脉。无论是编写爬虫去互联网上挖掘宝藏数据，还是调用第三方 API 实现系统集成，`requests` 都是你手中最趁手的神兵利器。有了这项技能，我们接下来便可以更好地理解如何使用 FastAPI 去**提供**这些网络接口供他人调用了。
