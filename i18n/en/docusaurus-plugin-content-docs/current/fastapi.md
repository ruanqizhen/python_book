# Web Development and FastAPI

On the planet of Pythora, besides discussing the zen of code atop the cloud platforms, the most frequent places where residents rest and interact are the "Inns" scattered across the planet. The Inns not only provide supplies for restoring inner power (computing power) but also serve as the central hubs for collecting and distributing江湖 (martial world) intelligence.

In the world of computer networks, such an "Inn" is a Web server. When a client (like a wandering knight) sends a request to the server (to obtain intelligence, book a room), the server's backend program processes these requests and returns a response.

In the realm of Python web development, there have long been two major frameworks: Django (a full-featured heavy framework) and Flask (a lightweight and flexible micro-framework). In recent years, however, FastAPI has rapidly risen to prominence thanks to its excellent performance, elegant syntax, and deep native support for Type Hints and asynchronous programming (async/await).

In this chapter, we will use FastAPI to build a "Knight's Inn" intelligence management system, experiencing the mechanisms and charm of modern web development firsthand.

## Why Choose FastAPI?

The main reasons FastAPI is so well-liked boil down to the following core features:

* **Extremely Fast**: Built on Starlette and Pydantic, its underlying runtime performance is comparable to NodeJS and Go, making it one of the fastest Python web frameworks available.
* **Native Type Hint Support**: The type hints we introduced in the [Data and Variables](https://www.google.com/search?q=variable%23%E7%B1%BB%E5%9E%8B%E6%8F%90%E7%A4%BA) section are fully leveraged by FastAPI. Not only do they provide code autocompletion for developers, but they also enable strict automatic data validation at runtime.
* **Automatic Documentation**: Simply by writing basic route code, FastAPI automatically generates interactive API documentation (Swagger UI) that conforms to the OpenAPI standard in the background.
* **Native Async Support**: Full support for defining routes with `async def`, perfectly complementing [asynchronous programming](https://www.google.com/search?q=asyncio) mechanisms to easily handle high-concurrency scenarios.

## Installation and "Opening the Inn"

Before we start writing code, we need to install FastAPI in our local environment along with an ASGI web server that supports async (typically `uvicorn`):

```bash
pip install fastapi uvicorn

```

Once installed, create a file named `main.py` in your working directory and write the inn's basic program:

```python
from fastapi import FastAPI

# Create a FastAPI inn instance
app = FastAPI(title="Pythora Knight Inn Intelligence System")

# Define a route: when the client visits the root path '/', this function executes
@app.get("/")
def read_root():
    return {"message": "Welcome to the Pythora Knight Inn! The wine is warm, please come in."}

```

### Starting the Server

Run the following command in your terminal to start the server:

```bash
uvicorn main:app --reload

```

* `main:app` means running the `app` instance from the `main.py` file.
* The `--reload` flag enables hot-reloading. During development, whenever you modify and save the code, the server automatically reloads without needing a manual restart.

After running, the terminal will output status information similar to this:

```text
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)

```

Now open your browser and visit `http://127.0.0.1:8000` to see the JSON-formatted greeting returned by the server:

```json
{"message": "Welcome to the Pythora Knight Inn! The wine is warm, please come in."}

```

## Automatic API Documentation

In traditional web development workflows, writing and maintaining API interface documentation is a tedious task. With FastAPI, this process is entirely automated.

Keep the server running, and visit `http://127.0.0.1:8000/docs` in your browser.

You will see an interactive web page powered by Swagger UI. Here, you can not only clearly view all the interfaces provided by the system and their parameter descriptions, but also click "Try it out" and then "Execute" to test these interfaces in real time.

## Route Parameters and Type Validation

To handle specific business logic, we need to define routes that can accept parameters. For example, defining an interface to query intelligence about a specific knight.

FastAPI allows you to apply Python type hints directly to the parameters of route functions, and the framework automatically handles data extraction and type conversion:

```python
from fastapi import FastAPI, HTTPException

app = FastAPI(title="Pythora Knight Inn Intelligence System")

# Simulated martial world intelligence database
KNIGHTS_DB = {
    "西门吹雪": {"power": 100, "skill": "一剑西来", "state": "生龙活虎"},
    "叶孤城": {"power": 95, "skill": "天外飞仙", "state": "重伤倒地"},
}

# The path parameter {name} is automatically mapped to the name parameter in the function signature
@app.get("/knights/{name}")
def get_knight_info(name: str):
    if name not in KNIGHTS_DB:
        # If the record is not found in the database, throw an HTTP 404 exception
        raise HTTPException(status_code=404, detail="This name is unknown in the martial world")
    
    # Dictionary data is automatically converted to JSON format by FastAPI and returned
    return {"name": name, "info": KNIGHTS_DB[name]}

```

If a parameter is defined with a specific data type, FastAPI automatically performs strict validation when receiving the request. For example, a query interface for retrieving a specific ranking:

```python
@app.get("/knights/rank/{rank}")
def get_knight_by_rank(rank: int):
    return {"message": f"Querying the knight ranked #{rank} on the martial world leaderboard..."}

```

* When accessing `http://127.0.0.1:8000/knights/rank/3`, the program executes normally, with the `rank` parameter automatically converted to the integer `3`.
* If you access `http://127.0.0.1:8000/knights/rank/abc` (attempting to pass a non-integer value), FastAPI intercepts the request before entering the function logic and returns an HTTP 422 (Unprocessable Entity) error, clearly informing the client why the type parsing failed:

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

## Request Body and Pydantic Data Models

When a client needs to submit complex structured data to the server (typically using an HTTP POST request), such as reporting the latest piece of martial world intelligence, we need to define the data structure of the request body.

FastAPI deeply integrates the **Pydantic** library for defining data models. Pydantic models are similar to [Data Classes (@dataclass)](https://www.google.com/search?q=class%23%E6%95%B0%E6%8D%AE%E7%B1%BB-dataclass) introduced earlier, both relying on type hints to declare fields, but Pydantic provides a much more powerful runtime data validation mechanism.

```python
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="Pythora Knight Inn Intelligence System")

# Define the intelligence data model
class IntelligenceReport(BaseModel):
    reporter: str = Field(..., title="Reporter", description="The name of the knight submitting the intelligence")
    target: str = Field(..., title="Target", description="The name of the person under investigation")
    secret_level: int = Field(default=1, ge=1, le=5, description="Classification level (1-5)")
    content: str = Field(..., description="Specific martial world secret content")

@app.post("/reports/")
def create_report(report: IntelligenceReport):
    # FastAPI automatically converts the incoming JSON data into an IntelligenceReport instance
    # and validates all constraint conditions during the conversion process
    
    print(f"Received intelligence from [{report.reporter}]!")
    print(f"Target: {report.target}, Classification Level: {report.secret_level}")
    
    # The logic for saving to a database is omitted here
    return {"status": "Intelligence has been secretly archived", "received_data": report}

```

In the code above, `Field(..., ge=1, le=5)` mandates that the valid range for the `secret_level` field must be between 1 and 5. If you refresh the `/docs` documentation now, you can see that FastAPI has already generated the corresponding input form for this POST endpoint, fully displaying the data model's field attributes, constraints, and more.

## Async Routes and High-Concurrency Handling

As we discussed in the [Multithreading](https://www.google.com/search?q=multithread) and [Asynchronous Programming](https://www.google.com/search?q=asyncio) chapters, due to the existence of the GIL, asynchronous programming is often the better choice when handling I/O-intensive high-concurrency tasks in Python.

FastAPI natively supports async routes. If your business logic involves time-consuming external network communication or database queries, you can define routes directly with `async def`, releasing the underlying event loop and thereby greatly improving the system's concurrent processing capability:

```python
import asyncio
from fastapi import FastAPI

app = FastAPI()

# Simulate a time-consuming external query task
async def fetch_remote_intelligence(target: str):
    # Use asyncio.sleep to simulate non-blocking I/O waiting
    await asyncio.sleep(2)  
    return f"【{target}】is currently drinking wine in Dali City..."

@app.get("/intelligence/async/{target}")
async def get_async_intelligence(target: str):
    # Asynchronously wait for the query result
    result = await fetch_remote_intelligence(target)
    return {"target": target, "intelligence": result}

```

In this asynchronous architecture, even when faced with a large number of concurrent requests, the server will not block the processing of other requests because of a single time-consuming task (such as the simulated `sleep(2)`).

## Summary

With FastAPI, we can use extremely concise code to build a modern web backend service featuring automatic parameter validation, auto-generated documentation, complex data model validation, and ultra-high-performance asynchronous concurrency. It not only lowers the barrier to API development but also possesses the full capability to support complex system architectures.
