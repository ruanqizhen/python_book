In programming, handling time seems simple at first glance but is notoriously error-prone. From querying the current time to managing complex cross-timezone scheduling, Python provides robust tools to navigate temporal logic.

## Common Modules

Python offers several built-in and third-party libraries for handling time, each serving a different purpose:

* **time**: The most basic module, mainly dealing with timestamps and operations related to the underlying system time.
* **datetime**: The most commonly used module, providing objects such as `date`, `time`, `datetime`, and `timedelta`, with a more object-oriented interface that is easy to use.
* **calendar**: Specializes in calendar-related operations, such as printing monthly calendars and determining leap years.
* **zoneinfo** (Python 3.9+) / **pytz**: Used for handling complex timezone issues. `zoneinfo` is the modern solution added to the standard library in Python 3.9, while `pytz` is the established third-party library.
* **dateutil**: This is a powerful third-party library (requires `pip install python-dateutil`) that can parse all kinds of bizarre time strings and supports relative time calculations (e.g., "this day next month").

Querying the current time is a fundamental operation. In a previous section, we used the `time` module to [measure function execution time](decorator#timing-function-execution). However, if you need to work with specific calendar fields like year, month, or day, the `datetime` module is far more convenient.

### Using the time Module

The `time` module primarily operates on Unix timestamps. A timestamp is the total number of seconds elapsed since the Unix epoch (January 1, 1970, 00:00:00 UTC).

```python
import time

current_timestamp = time.time()       # Get the current timestamp (float)
local_time_struct = time.localtime()  # Get local time (returns a struct_time object)
formatted_time = time.strftime('%Y-%m-%d %H:%M:%S', local_time_struct)  # Format

print(f"Timestamp: {current_timestamp}")
print(f"Local time: {formatted_time}")

```

### Using the datetime Module

The `datetime` module offers a more object-oriented and intuitive API, returning datetime instances with accessible attributes like `.year`, `.month`, and `.day`:

```python
from datetime import datetime

now = datetime.now()  # Get the current datetime object
print(f"Current time: {now}")
print(f"Today is: {now.year} year, {now.month} month, {now.day} day")

```

## Time Formatting and Parsing

We frequently need to convert between human-readable strings and computer-operable time objects. This is primarily done using two functions: `strftime` (String Format Time, for formatting objects to strings) and `strptime` (String Parse Time, for parsing strings into objects).

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

Measuring how long a block of code takes to run is a basic profiling task. We typically use `time.time()` because it has minimal overhead, reading directly from the system clock.

```python
import time

start_time = time.time()

# Simulate a time-consuming operation
time.sleep(1) 

end_time = time.time()

print(f"Code execution time: {end_time - start_time:.4f} seconds")

```

To calculate future or past dates (e.g., "tomorrow at this time" or "three days ago"), we use the `timedelta` class from the `datetime` module, which represents a duration.

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

Subtracting one `datetime` object from another yields a `timedelta` object representing the duration between them.

```python
from datetime import datetime

start = datetime(2024, 12, 1)
end = datetime(2024, 12, 8)

delta = end - start
print(f"Difference in days: {delta.days}")
print(f"Total difference in seconds: {delta.total_seconds()}")

```

## Timestamp Conversion

When storing time data (such as in databases), timestamps are generally the most compatible and efficient format. However, for user-facing displays, we convert them into datetime objects or formatted strings.

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

Managing time zones is often the most complex aspect of working with time. In Python, `datetime` objects are "naive" by default, meaning they do not contain any timezone information.

Introduced in Python 3.9, the standard library's `zoneinfo` module is the recommended modern solution for handling time zones.

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

For older Python versions or legacy codebases, the third-party `pytz` library remains widely used.

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

The `calendar` module provides plain-text calendar utilities, making it ideal for command-line tools. The `calendar.month(year, month)` function returns a formatted multi-line string representing the calendar for a given month.

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

Instead of writing custom logic to check divisibility by 4, 100, and 400, you can directly use built-in module functions:

```python
import calendar

year = 2024
is_leap = calendar.isleap(year)
print(f"Is {year} a leap year? {is_leap}")

# Count how many leap years are in a range
leap_days = calendar.leapdays(2000, 2024)
print(f"Leap years between 2000 and 2024: {leap_days}")

```
