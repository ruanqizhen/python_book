# 时间

在编程世界中，时间是一个看似简单却极易出错的领域。从简单的“现在几点了”到复杂的跨时区调度，Python 提供了强大的工具来帮助我们驾驭时间。

## 常用模块

Python 中有几个常用的与时间相关的库，它们各有侧重：

* **time**：最基础的模块，主要处理时间戳（Timestamp）和与底层系统时间相关的操作。
* **datetime**：最常用的模块，提供了日期（date）、时间（time）、日期时间（datetime）和时间间隔（timedelta）等对象，接口更加面向对象，易于使用。
* **calendar**：专门处理日历相关操作，比如打印月历、判断闰年等。
* **zoneinfo**（Python 3.9+）/ **pytz**：用于处理复杂的时区问题。`zoneinfo` 是 Python 3.9 加入标准库的现代方案，而 `pytz` 是老牌的第三方库。
* **dateutil**：这是一个强大的第三方库（需要 `pip install python-dateutil`），它可以解析各种稀奇古怪的时间字符串，并支持相对时间的计算（如“下个月的今天”）。

## 获取当前时间

这是最常用的操作。在前文中，我们使用 `time` 模块的方法来[测量函数运行消耗的时间](decorator#为函数运行计时)。但如果我们需要处理具体的年月日，`datetime` 会更方便。

### 使用 time 模块

`time` 模块主要关注“时间戳”。时间戳是指格林威治时间 1970 年 01 月 01 日 00 时 00 分 00 秒（北京时间 08:00:00）起至现在的总秒数。

```python
import time

current_timestamp = time.time()       # 获取当前时间的时间戳（浮点数）
local_time_struct = time.localtime()  # 获取本地时间（返回一个 struct_time 对象）
formatted_time = time.strftime('%Y-%m-%d %H:%M:%S', local_time_struct)  # 格式化

print(f"时间戳: {current_timestamp}")
print(f"本地时间: {formatted_time}")

```

### 使用 datetime 模块

`datetime` 模块更加直观，它返回的是对象，我们可以直接访问对象的 `.year`、`.month` 等属性。

```python
from datetime import datetime

now = datetime.now()  # 获取当前的 datetime 对象
print(f"当前时间: {now}")
print(f"今天是: {now.year}年{now.month}月{now.day}日")

```

## 时间格式化和解析

在处理时间时，我们经常需要在“人类可读的字符串”和“计算机可操作的时间对象”之间转换。这主要用到两个方法：`strftime`（String Format Time，转字符串）和 `strptime`（String Parse Time，解析字符串）。

### 将时间格式化为字符串 (strftime)

```python
from datetime import datetime

now = datetime.now()
# 格式化成我们习惯的 "年-月-日 时:分:秒"
formatted_time = now.strftime('%Y-%m-%d %H:%M:%S')
print(f"格式化后的时间: {formatted_time}")

```

### 将字符串解析为时间对象 (strptime)

```python
from datetime import datetime

time_str = '2024-12-08 12:00:00'
# 注意：解析时的格式必须与字符串完全匹配
dt_obj = datetime.strptime(time_str, '%Y-%m-%d %H:%M:%S')
print(f"解析后的对象类型: {type(dt_obj)}")
print(f"解析后的时间: {dt_obj}")

```

**常用格式化符号参考：**

* `%Y`: 4位数的年份 (2024)
* `%m`: 月份 (01-12)
* `%d`: 日 (01-31)
* `%H`: 24小时制的小时 (00-23)
* `%M`: 分钟 (00-59)
* `%S`: 秒 (00-59)

## 时间运算

### 测量代码运行时间

这是性能分析中最基础的操作，通常使用 `time.time()`，因为它通过读取系统时钟，开销极小。

```python
import time

start_time = time.time()

# 模拟一个耗时操作
time.sleep(1) 

end_time = time.time()

print(f"代码执行耗时: {end_time - start_time:.4f} 秒")

```

### 时间的加减 (timedelta)

想要计算“明天这个时候”或者“三天前”，我们需要用到 `datetime` 模块中的 `timedelta` 类。它可以表示一个时间段。

```python
from datetime import datetime, timedelta

now = datetime.now()
one_day = timedelta(days=1)
three_hours = timedelta(hours=3)

tomorrow = now + one_day
yesterday = now - one_day
future_time = now + three_hours

print(f"现在: {now}")
print(f"明天: {tomorrow}")
print(f"昨天: {yesterday}")
print(f"三小时后: {future_time}")

```

### 计算时间差

两个 `datetime` 对象相减，会得到一个 `timedelta` 对象。

```python
from datetime import datetime

start = datetime(2024, 12, 1)
end = datetime(2024, 12, 8)

delta = end - start
print(f"相差天数: {delta.days}")
print(f"总共相差秒数: {delta.total_seconds()}")

```

## 时间戳转换

在存储数据（如存入数据库）时，时间戳通常是最兼容的格式；而在展示给用户时，我们需要对象或字符串。

### 将时间戳转换为时间对象

```python
from datetime import datetime

timestamp = 1702048400
# fromtimestamp 可以将秒数转换为 datetime 对象
dt_obj = datetime.fromtimestamp(timestamp)
print(f"时间对象: {dt_obj}")

```

### 将时间对象转换为时间戳

```python
from datetime import datetime

dt_obj = datetime(2024, 12, 8, 12, 0, 0)
timestamp = dt_obj.timestamp()
print(f"时间戳: {timestamp}")

```

## 设置时区

处理时区是时间操作中最令人头疼的部分。`datetime` 对象默认是“单纯的”（Naive），不包含时区信息。

### 使用 zoneinfo (推荐, Python 3.9+)

在 Python 3.9 及以后版本，标准库引入了 `zoneinfo` 模块，这是目前推荐的处理时区的方式。

```python
from datetime import datetime
from zoneinfo import ZoneInfo

# 获取当前的 UTC 时间
utc_time = datetime.now(ZoneInfo("UTC"))
print(f"UTC 时间: {utc_time}")

# 转换为上海时间
shanghai_time = utc_time.astimezone(ZoneInfo("Asia/Shanghai"))
print(f"上海时间: {shanghai_time}")

# 转换为纽约时间
ny_time = utc_time.astimezone(ZoneInfo("America/New_York"))
print(f"纽约时间: {ny_time}")

```

### 使用 pytz (旧版/兼容)

在旧版本 Python 中，或者现有项目已经依赖它的情况下，我们使用第三方库 `pytz`。

```python
from datetime import datetime
import pytz

# 获取带时区的当前时间
utc_time = datetime.now(pytz.utc)

# 定义目标时区
local_tz = pytz.timezone('Asia/Shanghai')

# 转换时区
local_time = utc_time.astimezone(local_tz)

print("UTC Time:", utc_time)
print("Local Time:", local_time)

```

## 日历

### 打印月历

`calendar` 模块提供了一些纯文本的日历功能，非常适合在命令行工具中使用。`calendar.month(year, month)` 函数用于生成指定月份的日历字符串。

这个函数有 4 个参数：

* `theyear`（必需）：指定年份。
* `themonth`（必需）：指定月份 (1-12)。
* `w`（可选）：日期列之间的间隔宽度，默认为 0。
* `l`（可选）：行之间的间隔高度，默认为 0。

```python
import calendar
print(calendar.month(2025, 1))

```

输出结果为：

```
    January 2025
Mo Tu We Th Fr Sa Su
       1  2  3  4  5
 6  7  8  9 10 11 12
13 14 15 16 17 18 19
20 21 22 23 24 25 26
27 28 29 30 31

```

### 判断闰年

不需要自己写逻辑判断能否被4整除、被100整除等，直接使用库函数：

```python
import calendar

year = 2024
is_leap = calendar.isleap(year)
print(f"{year} 是闰年吗? {is_leap}")

# 计算某个范围内有多少个闰年
leap_days = calendar.leapdays(2000, 2024)
print(f"2000年到2024年之间有 {leap_days} 个闰年")

```
