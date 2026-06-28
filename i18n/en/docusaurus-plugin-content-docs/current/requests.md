# Network Requests and Web Scraping

On the planet Pythora, swordsmen cannot merely practice behind closed doors; they must exchange intelligence with the vast martial world (the Internet). In modern software development, the most valuable data and services are distributed across the web. Whether it's fetching today's weather forecast, pulling stock market quotes, or automatically sending an alert to a Slack channel, everything relies on one core technology: **HTTP Requests**.

While Python has a built-in module called `urllib` for making network requests, its interface is clunky and archaic—like wielding a rusted, blunt sword. Fortunately, the Python community birthed what is widely considered one of the greatest and most user-friendly third-party libraries ever created: **`requests`**.

Its official motto says it all: *"Requests is an elegant and simple HTTP library for Python, built for human beings."*

## Installing requests

First, install it via your terminal using `pip`:

```bash
pip install requests
```

## The Fundamental Stance: GET Requests

The most common operation in the HTTP protocol is the `GET` request, used to "fetch" data from a server. When you type a URL into your browser's address bar and hit enter, you are initiating a GET request.

We can easily simulate this process using `requests.get()`. Let's fetch data from GitHub's public API:

```python
import requests

# Initiate a GET request
response = requests.get("https://api.github.com")

# Print the HTTP status code (200 means OK, 404 means Not Found, etc.)
print(f"Status Code: {response.status_code}")

# If the server returns plain text or HTML, you can view the content directly
# print(response.text)

# If the server returns JSON data, requests provides an incredibly convenient .json() method
data = response.json()
print("Current rate limit API endpoint:", data["rate_limit_url"])
```

### Passing Query Parameters

When you search for "Python" on a search engine, the URL typically transforms into something like `https://www.google.com/search?q=Python&hl=en`. The part after the question mark `?` consists of query parameters.

With `requests`, you don't need to manually concatenate these error-prone strings. You simply pass a dictionary:

```python
import requests

url = "https://httpbin.org/get"
# Store query parameters in a dictionary
params = {
    "q": "Python",
    "hl": "en"
}

# requests automatically appends the params to the URL
response = requests.get(url, params=params)
print(response.url)  # Output: https://httpbin.org/get?q=Python&hl=en
```

## Advanced Stance: POST Requests

Besides fetching data, we sometimes need to "submit" data to the server—like logging into an account or posting a comment. This requires a `POST` request.

### Submitting JSON Data

In modern Web development (such as interacting with the FastAPI services mentioned later), clients and servers communicate primarily via JSON. `requests.post()` provides a `json` parameter that automatically serializes your dictionary into a JSON string and sets the appropriate request headers:

```python
import requests

url = "https://httpbin.org/post"
intelligence_data = {
    "reporter": "Lancelot",
    "target": "Arthur",
    "secret_level": 5
}

# Directly pass the dictionary to the json parameter
response = requests.post(url, json=intelligence_data)

print("Server received the data. Response below:")
print(response.json())
```

## Customizing Headers (The Art of Disguise)

To prevent bots and web scrapers from maliciously downloading data, many websites check the origin of a request. They typically inspect the `User-Agent` in the HTTP Headers. If they detect the default signature of a scripting language, they will outright reject the request (often returning a 403 Forbidden status code).

To bypass this basic defense, we can disguise our script as a normal web browser by passing a custom `headers` dictionary:

```python
import requests

url = "https://httpbin.org/headers"
# Disguise the request as coming from a Chrome browser
fake_headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

response = requests.get(url, headers=fake_headers)
print("Headers seen by the server:", response.json())
```

## Network Robustness and Exception Handling

In the real world, network fluctuations and server outages are commonplace. If you don't add defensive mechanisms to your code, a sudden network drop will crash your entire program.

To write robust network scripts, you must follow two rules:
1. **Always set a `timeout`**: If a server hangs and doesn't respond, `requests` will wait indefinitely by default.
2. **Catch Exceptions (`try-except`)**: Use `requests.exceptions.RequestException` to catch all network-related errors gracefully.

```python
import requests
from requests.exceptions import RequestException

url = "https://api.github.com"

try:
    # timeout=3 means if the server doesn't respond within 3 seconds, abort and raise an exception
    response = requests.get(url, timeout=3)
    
    # raise_for_status() actively throws an exception if the status code is an error (e.g., 404, 500)
    response.raise_for_status()
    
    print("Request successful!")
    
except requests.exceptions.Timeout:
    print("The server took too long to respond. Request timed out!")
except requests.exceptions.HTTPError as e:
    print(f"The server returned an error status code: {e}")
except RequestException as e:
    print(f"A general network error occurred: {e}")
```

## Summary

By mastering `requests`, you have unlocked the gateway connecting Python to the outside world. Whether you are writing web scrapers to mine the internet for treasure or calling third-party APIs to integrate systems, `requests` is the most reliable weapon in your arsenal. Equipped with this skill, we are now perfectly positioned to understand how to use FastAPI to **provide** these network interfaces for others to consume.
