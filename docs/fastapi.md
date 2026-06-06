# Web 开发和 FastAPI

在 Pythora 星球上，除了在云台之上论道代码禅意，居民们歇脚、交流最频繁的去处，莫过于遍布星球的“客栈”（Inns）。客栈不仅提供恢复内力（算力）的补给，更是收集、分发江湖情报的核心枢纽。

在计算机网络的世界中，这样的“客栈”便是 Web 服务器。当客户端（犹如一位游历的侠客）向服务器发出请求（获取情报、预订客房）时，服务器的后端程序便会处理这些请求并给出响应。

在 Python 的 Web 开发领域，早有 Django（大而全的重型框架）与 Flask（轻巧灵活的微框架）两座大山。然而近年来，FastAPI 凭借其卓越的性能、优雅的语法，以及对类型提示（Type Hints）和异步编程（async/await）的深度原生支持，迅速跻身主流。

本章我们将一起使用 FastAPI 搭建一个“侠客客栈”情报管理系统，亲身体验现代 Web 开发的机制与魅力。


## 为什么选择 FastAPI？

FastAPI 之所以备受青睐，主要归功于以下几个核心特性：

* **运行极快**：基于 Starlette 和 Pydantic 构建，其底层运行性能可与 NodeJS 和 Go 媲美，是目前 Python 生态中最快的 Web 框架之一。
* **原生支持类型提示**：我们在[数据与变量](https://www.google.com/search?q=variable%23%E7%B1%BB%E5%9E%8B%E6%8F%90%E7%A4%BA)一节中介绍过的类型提示，在 FastAPI 中被发扬光大。它不仅能为开发者提供代码自动补全，还能在程序运行时实现严格的数据自动校验。
* **自动生成文档**：只需编写基本的路由代码，FastAPI 就会在后台自动生成符合 OpenAPI 标准的交互式接口文档（Swagger UI）。
* **原生支持异步**：全面支持使用 `async def` 定义路由，能够完美配合[异步编程](https://www.google.com/search?q=asyncio)机制，轻松应对高并发场景。



## 安装与“客栈开张”

在开始编写代码前，我们需要在本地环境中安装 FastAPI，以及一个支持异步的 ASGI Web 服务器（通常使用 `uvicorn`）：

```bash
pip install fastapi uvicorn

```

安装完成后，在工作目录下创建一个名为 `main.py` 的文件，编写客栈的基础程序：

```python
from fastapi import FastAPI

# 创建一个 FastAPI 客栈实例
app = FastAPI(title="Pythora 侠客客栈情报系统")

# 定义一个路由：当客户端访问根路径 '/' 时，执行该函数
@app.get("/")
def read_root():
    return {"message": "欢迎来到 Pythora 侠客客栈！酒已温好，客官里面请。"}

```

### 启动服务器

在命令行终端中运行以下命令以启动服务器：

```bash
uvicorn main:app --reload

```

* `main:app` 表示运行 `main.py` 文件中的 `app` 实例。
* `--reload` 参数表示开启热重载功能。在开发阶段，只要修改并保存了代码，服务器就会自动重新加载，无需手动重启。

运行后，终端会输出类似下面的状态信息：

```text
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)

```

此时打开浏览器，访问 `http://127.0.0.1:8000`，即可看到服务器返回的 JSON 格式问候语：

```json
{"message": "欢迎来到 Pythora 侠客客栈！酒已温好，客官里面请。"}

```



## 自动生成 API 文档

在传统的 Web 开发流程中，编写和维护 API 接口文档是一项繁琐的工作。而在 FastAPI 中，这一过程是完全自动化的。

保持服务器处于运行状态，在浏览器中访问 `http://127.0.0.1:8000/docs`。

你会看到一个由 Swagger UI 驱动的交互式网页。在这里，不仅可以清晰地查阅系统提供的所有接口及其参数说明，还可以直接点击 “Try it out” 并执行（Execute）来实时测试这些接口。



## 路由参数与类型校验

为了处理具体的业务逻辑，我们需要定义能够接收参数的路由。例如，定义一个查询特定侠客情报的接口。

FastAPI 允许将 Python 的类型提示直接应用于路由函数的参数中，框架会自动处理数据提取与类型转换：

```python
from fastapi import FastAPI, HTTPException

app = FastAPI(title="Pythora 侠客客栈情报系统")

# 模拟的江湖情报数据库
KNIGHTS_DB = {
    "西门吹雪": {"power": 100, "skill": "一剑西来", "state": "生龙活虎"},
    "叶孤城": {"power": 95, "skill": "天外飞仙", "state": "重伤倒地"},
}

# 路径参数 {name} 会自动映射到函数签名中的 name 参数
@app.get("/knights/{name}")
def get_knight_info(name: str):
    if name not in KNIGHTS_DB:
        # 如果数据库中无此记录，抛出 HTTP 404 异常
        raise HTTPException(status_code=404, detail="江湖上未曾听闻此人名号")
    
    # 字典数据会被 FastAPI 自动转换为 JSON 格式返回
    return {"name": name, "info": KNIGHTS_DB[name]}

```

如果定义的参数具有特定的数据类型，FastAPI 会在接收请求时自动进行严格校验。例如，获取特定排名的查询接口：

```python
@app.get("/knights/rank/{rank}")
def get_knight_by_rank(rank: int):
    return {"message": f"正在查询江湖风云榜第 {rank} 名的侠客..."}

```

* 当访问 `http://127.0.0.1:8000/knights/rank/3` 时，程序正常执行，`rank` 参数被自动转换为整数 `3`。
* 如果访问 `http://127.0.0.1:8000/knights/rank/abc`（试图传入非整数值），FastAPI 会在进入函数逻辑前直接拦截该请求，并返回 HTTP 422（Unprocessable Entity）错误，清楚地告知客户端类型解析失败的原因：

```json
{
  "detail": [
    {
      "type": "int_parsing",
      "loc": ["path", "rank"],
      "msg": "Input should be a valid integer, unable to parse string as an integer",
      "input": "abc"
    }
  ]
}

```


## 请求体与 Pydantic 数据模型

当客户端需要向服务器提交复杂的结构化数据（通常使用 HTTP POST 请求）时，例如上报一条最新的江湖情报，我们需要定义请求体的数据结构。

FastAPI 深度集成了 **Pydantic** 库，用于定义数据模型。Pydantic 模型与之前介绍过的 [数据类（@dataclass）](https://www.google.com/search?q=class%23%E6%95%B0%E6%8D%AE%E7%B1%BB-dataclass) 类似，均依赖类型提示声明字段，但 Pydantic 提供了更为强大的数据运行时校验机制。

```python
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="Pythora 侠客客栈情报系统")

# 定义情报数据模型
class IntelligenceReport(BaseModel):
    reporter: str = Field(..., title="上报者", description="提交情报的侠客名号")
    target: str = Field(..., title="目标人物", description="被调查的人物名号")
    secret_level: int = Field(default=1, ge=1, le=5, description="机密等级 (1-5)")
    content: str = Field(..., description="具体的江湖机密内容")

@app.post("/reports/")
def create_report(report: IntelligenceReport):
    # FastAPI 会自动将传入的 JSON 数据转换为 IntelligenceReport 实例
    # 并在转换过程中完成所有约束条件的验证
    
    print(f"收到来自【{report.reporter}】的情报！")
    print(f"目标人物：{report.target}，机密等级：{report.secret_level}")
    
    # 此处省略保存至数据库的具体逻辑
    return {"status": "情报已秘密存档", "received_data": report}

```

在上述代码中，`Field(..., ge=1, le=5)` 强制规定了 `secret_level` 字段的有效范围必须在 1 到 5 之间。此时若刷新 `/docs` 文档，可以直观地看到 FastAPI 已经为该 POST 接口生成了对应的输入表单，并将数据模型的字段属性、约束条件等完整地呈现出来。


## 异步路由与高并发处理

如同我们在[多线程](https://www.google.com/search?q=multithread)和[异步编程](https://www.google.com/search?q=asyncio)章节中所讨论的，由于 GIL 的存在，Python 在处理 I/O 密集型高并发任务时，异步编程往往是更优的选择。

FastAPI 原生支持异步路由。如果业务逻辑中涉及耗时的外部网络通信或数据库查询，可以直接使用 `async def` 定义路由，释放底层事件循环，从而极大提升系统的并发处理能力：

```python
import asyncio
from fastapi import FastAPI

app = FastAPI()

# 模拟一个耗时的外部查询任务
async def fetch_remote_intelligence(target: str):
    # 使用 asyncio.sleep 模拟非阻塞的 I/O 等待
    await asyncio.sleep(2)  
    return f"【{target}】目前正在大理城内饮酒..."

@app.get("/intelligence/async/{target}")
async def get_async_intelligence(target: str):
    # 异步等待查询结果
    result = await fetch_remote_intelligence(target)
    return {"target": target, "intelligence": result}

```

在这种异步架构下，即便面临大量的并发请求，服务器也不会因为单次耗时任务（如模拟的 `sleep(2)`）而阻塞其他请求的处理。


## 总结

利用 FastAPI，我们可以用极其精简的代码构建出具备自动参数校验、自动生成文档、复杂数据模型验证以及超高性能异步并发的现代 Web 后端服务。它不仅降低了 API 开发的门槛，同时也完全具备支撑复杂系统架构的能力。
