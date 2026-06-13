# Time

In the programming world, time is an area that seems simple yet is extremely error-prone. From a simple "what time is it" to complex cross-timezone scheduling, Python provides powerful tools to help us navigate time.

## Common Modules

Python has several commonly used time-related libraries, each with its own focus:

* **time**: The most basic module, mainly dealing with timestamps and operations related to the underlying system time.
* **datetime**: The most commonly used module, providing objects such as `date`, `time`, `datetime`, and `timedelta`, with a more object-oriented interface that is easy to use.
* **calendar**: Specializes in calendar-related operations, such as printing monthly calendars and determining leap years.
* **zoneinfo** (Python 3.9+) / **pytz**: Used for handling complex timezone issues. `zoneinfo` is the modern solution added to the standard library in Python 3.9, while `pytz` is the established third-party library.
* **dateutil**: This is a powerful third-party library (requires `pip install python-dateutil`) that can parse all kinds of bizarre time strings and supports relative time calculations (e.g., "this day next month").

## Getting the Current Time

This is the most common operation. In a previous section, we used the `time` module's method to [measure the time consumed by a function](decorator#为函数运行计时). But if we need to handle specific year, month, and day values, `datetime` is more convenient.

### Using the time Module

The `time` module primarily deals with "timestamps." A timestamp is the total number of seconds elapsed since January 1, 1970, 00:00:00 UTC (January 1, 1970, 08:00:00 Beijing time).

```python
import time

current_timestamp = time.time()       # Get the current timestamp (float)
local_time_struct = time.localtime()  # Get local time (returns a struct_time object)
formatted_time = time.strftime('%Y-%m-%d %H:%M:%S', local_time_struct)  # Format

print(f"Timestamp: {current_timestamp}")
print(f"Local time: {formatted_time}")

```

### Using the datetime Module

The `datetime` module is more intuitive. It returns objects whose attributes like `.year`, `.month`, etc., we can access directly.

```python
from datetime import datetime

now = datetime.now()  # Get the current datetime object
print(f"Current time: {now}")
print(f"Today is: {now.year} year, {now.month} month, {now.day} day")

```

## Time Formatting and Parsing

When dealing with time, we often need to convert between "human-readable strings" and "computer-operable time objects." This mainly uses two methods: `strftime` (String Format Time, to string) and `strptime` (String Parse Time, parse string).

### Formatting Time to String (strftime)

```python
from datetime import datetime

now = datetime.now()
# Format as the familiar "year-month-day hour:minute:second"
formatted_time = now.strftime('%Y-%m-%d %H:%M:%S')
print(f"Formatted time: {formatted_time}")

```

### Parsing String to Time Object (strptime)

```python
from datetime import datetime

time_str = '2024-12-08 12:00:00'
# Note: The format used for parsing must exactly match the string
dt_obj = datetime.strptime(time_str, '%Y-%m-%d %H:%M:%S')
print(f"Parsed object type: {type(dt_obj)}")
print(f"Parsed time: {dt_obj}")

```

**Common Formatting Symbols Reference:**

* `%Y`: 4-digit year (2024)
* `%m`: Month (01-12)
* `%d`: Day (01-31)
* `%H`: Hour in 24-hour format (00-23)
* `%M`: Minute (00-59)
* `%S`: Second (00-59)

## Time Arithmetic

### Measuring Code Execution Time

This is the most basic operation in performance analysis, typically using `time.time()` because it has minimal overhead by reading the system clock.

```python
import time

start_time = time.time()

# Simulate a time-consuming operation
time.sleep(1) 

end_time = time.time()

print(f"Code execution time: {end_time - start_time:.4f} seconds")

```

### Adding and Subtracting Time (timedelta)

To calculate "this time tomorrow" or "three days ago," we need the `timedelta` class from the `datetime` module. It represents a duration of time.

```python
from datetime import datetime, timedelta

now = datetime.now()
one_day = timedelta(days=1)
three_hours = timedelta(hours=3)

tomorrow = now + one_day
yesterday = now - one_day
future_time = now + three_hours

print(f"Now: {now}")
print(f"Tomorrow: {tomorrow}")
print(f"Yesterday: {yesterday}")
print(f"Three hours later: {future_time}")

```

### Calculating Time Difference

Subtracting two `datetime` objects yields a `timedelta` object.

```python
from datetime import datetime

start = datetime(2024, 12, 1)
end = datetime(2024, 12, 8)

delta = end - start
print(f"Difference in days: {delta.days}")
print(f"Total difference in seconds: {delta.total_seconds()}")

```

## Timestamp Conversion

When storing data (e.g., in a database), timestamps are usually the most compatible format; when displaying to users, we need objects or strings.

### Converting Timestamp to Time Object

```python
from datetime import datetime

timestamp = 1702048400
# fromtimestamp converts seconds to a datetime object
dt_obj = datetime.fromtimestamp(timestamp)
print(f"Time object: {dt_obj}")

```

### Converting Time Object to Timestamp

```python
from datetime import datetime

dt_obj = datetime(2024, 12, 8, 12, 0, 0)
timestamp = dt_obj.timestamp()
print(f"Timestamp: {timestamp}")

```

## Setting Timezone

Handling timezones is the most headache-inducing part of time operations. `datetime` objects are "naive" by default, meaning they contain no timezone information.

### Using zoneinfo (Recommended, Python 3.9+)

In Python 3.9 and later, the standard library introduced the `zoneinfo` module, which is the currently recommended way to handle timezones.

```python
from datetime import datetime
from zoneinfo import ZoneInfo

# Get the current UTC time
utc_time = datetime.now(ZoneInfo("UTC"))
print(f"UTC time: {utc_time}")

# Convert to Shanghai time
shanghai_time = utc_time.astimezone(ZoneInfo("Asia/Shanghai"))
print(f"Shanghai time: {shanghai_time}")

# Convert to New York time
ny_time = utc_time.astimezone(ZoneInfo("America/New_York"))
print(f"New York time: {ny_time}")

```

### Using pytz (Legacy/Compatibility)

In older versions of Python, or when existing projects already depend on it, we use the third-party library `pytz`.

```python
from datetime import datetime
import pytz

# Get the current time with timezone
utc_time = datetime.now(pytz.utc)

# Define the target timezone
local_tz = pytz.timezone('Asia/Shanghai')

# Convert timezone
local_time = utc_time.astimezone(local_tz)

print("UTC Time:", utc_time)
print("Local Time:", local_time)

```

## Calendar

### Printing a Monthly Calendar

The `calendar` module provides plain-text calendar functionality, ideal for use in command-line tools. The `calendar.month(year, month)` function generates a calendar string for a specified month.

This function has 4 parameters:

* `theyear` (required): Specifies the year.
* `themonth` (required): Specifies the month (1-12).
* `w` (optional): Width of spacing between date columns, defaults to 0.
* `l` (optional): Height of spacing between rows, defaults to 0.

```python
import calendar
print(calendar.month(2025, 1))

```

The output is:

```
    January 2025
Mo Tu We Th Fr Sa Su
       1  2  3  4  5
 6  7  8  9 10 11 12
13 14 15 16 17 18 19
20 21 22 23 24 25 26
27 28 29 30 31

```

### Determining Leap Years

No need to write your own logic for checking divisibility by 4, 100, etc. Just use the library function:

```python
import calendar

year = 2024
is_leap = calendar.isleap(year)
print(f"Is {year} a leap year? {is_leap}")

# Count how many leap years are in a range
leap_days = calendar.leapdays(2000, 2024)
print(f"Leap years between 2000 and 2024: {leap_days}")

```
