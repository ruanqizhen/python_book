# 时间

## 常用模块

Python 中有几个常用的与时间相关的库：
- time：处理时间戳、简单时间转换。
- datetime：提供更高级的时间操作。
- calendar：处理日历相关操作。
- pytz：处理时区。
- dateutil：这个库不是 Python 自带的，需要单独安装。它可以灵活解析时间字符串，支持更多时间功能。

## 获取当前时间

这是最常用的操作，在前文中，我们使用这个方法来[测量函数运行消耗的时间](decorator#为函数运行计时)。

使用 time 模块：
```python
import time

current_time = time.time()        # 获取当前时间的时间戳（从1970年1月1日到现在的秒数）
local_time = time.localtime()     # 获取本地时间（结构化时间）
formatted_time = time.strftime('%Y-%m-%d %H:%M:%S', local_time)  # 格式化时间
print(formatted_time)
```
  
使用 datetime 模块：
```python
from datetime import datetime

now = datetime.now()  # 当前时间（带时区的）
print
```

## 时间格式化和解析

将时间格式化为字符串：
```python
from datetime import datetime

now = datetime.now()
formatted_time = now.strftime('%Y-%m-%d %H:%M:%S')
print(formatted_time)
```

将字符串解析为时间对象：
```python
from datetime import datetime

time_str = '2024-12-08 12:00:00'
dt_obj = datetime.strptime(time_str, '%Y-%m-%d %H:%M:%S')
print(dt_obj)
```

## 时间运算

测量代码运行时间：
```python
import time

start_time = time.time()
# 执行一些代码
time.sleep(2)  # 模拟耗时操作
end_time = time.time()

print("Execution Time:", end_time - start_time, "seconds")
```
  
加减时间：
```python
from datetime import datetime, timedelta

now = datetime.now()
one_day = timedelta(days=1)

tomorrow = now + one_day
yesterday = now - one_day

print("Tomorrow:", tomorrow)
print("Yesterday:", yesterday)
```

计算时间差：
```python
from datetime import datetime

start = datetime(2024, 12, 1)
end = datetime(2024, 12, 8)

delta = end - start
print("Days difference:", delta.days)
```

获取当前时间戳：
```python
import time

timestamp = time.time()
print("Current Timestamp:", timestamp)
```

将时间戳转换为时间对象：
```python
from datetime import datetime

timestamp = 1702048400
dt_obj = datetime.fromtimestamp(timestamp)
print(dt_obj)
```

将时间对象转换为时间戳：
```python
from datetime import datetime

dt_obj = datetime(2024, 12, 8, 12, 0, 0)
timestamp = dt_obj.timestamp()
print(timestamp)
```

## 设置时区
使用 `pytz` 模块

```python
from datetime import datetime
import pytz

utc_time = datetime.now(pytz.utc)
local_tz = pytz.timezone('Asia/Shanghai')
local_time = utc_time.astimezone(local_tz)

print("UTC Time:", utc_time)
print("Local Time:", local_time)
  ```


## 日历

### 打印月历

在 calendar 模块中，calendar.month 函数用于生成表示指定年份和月份的日历的字符串。 当需要获取某个月份的日历视图时，它可以快速生成一个格式化好的月历。

这个函数有 4 个参数：
- theyear（必需）：指定年份，为整数。
- themonth（必需）：指定月份，为整数，范围从1到12。
- w（可选）：设置日期列之间的间隔宽度，默认为0。
- l（可选）：设置行之间的间隔高度，默认为0。

比如：

```python
import calendar
print(calendar.month(2023, 11))
```

输出结果为：

```
   November 2023
Mo Tu We Th Fr Sa Su
       1  2  3  4  5
 6  7  8  9 10 11 12
13 14 15 16 17 18 19
20 21 22 23 24 25 26
27 28 29 30
```

calendar.month 生成的是一个字符串，适合直接打印或显示。如果需要以其他格式（如列表或对象）处理日历数据，可以使用 calendar 模块中的其他函数，如 monthcalendar()。

### 判断闰年：
```python
import calendar

is_leap = calendar.isleap(2024)
print("Is 2024 a leap year?", is_leap)
```

  
