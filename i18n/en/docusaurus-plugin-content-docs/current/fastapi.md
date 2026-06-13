# Web Development and FastAPI

On the planet Pythora, besides discussing the zen of code atop cloud platforms, the most popular places for residents to gather are the "Inns" scattered across the land. These Inns do not just provide nourishment to restore computing power; they serve as central hubs for gathering and sharing martial world intelligence.

In computer networking, such an 'Inn' functions as a web server. When a client (like a wandering knight) sends a request to the server (to fetch intelligence or book a room), the server's backend application processes the request and returns a response.

For years, Python web development was dominated by two frameworks: Django (a full-featured, batteries-included framework) and Flask (a lightweight, flexible micro-framework). Recently, however, FastAPI has risen to prominence due to its blazing-fast performance, elegant syntax, and native integration with type hints and asynchronous programming (`async`/`await`).

In this chapter, we will use FastAPI to build an intelligence management system for a "Knight's Inn", experiencing the power and simplicity of modern web development.

## Why Choose FastAPI?

FastAPI's popularity is driven by several key features:

* **High Performance**: Built on top of Starlette and Pydantic, its speed is comparable to Node.js and Go, making it one of the fastest Python web frameworks available.
* **Native Type Hint Support**: The type hints we introduced in the [Data and Variables](variable.md#type-hints) section are fully leveraged by FastAPI. Not only do they provide code autocompletion for developers, but they also enable strict automatic data validation at runtime.
* **Auto-Generated Documentation**: Simply by declaring your routes, FastAPI automatically generates interactive, OpenAPI-compliant API documentation (via Swagger UI and ReDoc) out of the box.
* **Native Async Support**: Full support for defining routes with `async def`, perfectly complementing [asynchronous programming](asyncio.md) mechanisms to easily handle high-concurrency scenarios.

## Installation and "Opening the Inn"

To get started, install FastAPI along with Uvicorn, an asynchronous ASGI web server:

```bash
pip install fastapi uvicorn

```

Next, create a `main.py` file to set up a basic application:

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

* `main:app` tells Uvicorn to find the `app` application instance inside the `main.py` file.
* The `--reload` flag enables hot-reloading. Whenever you modify and save your code, the server will restart automatically so you can immediately see your changes.

Once launched, the terminal will output status information similar to this:

```text
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)

```

Open your web browser and navigate to `http://127.0.0.1:8000` to view the JSON response returned by the server:

```json
{"message": "Welcome to the Pythora Knight Inn! The wine is warm, please come in."}

```

## Automatic API Documentation

Maintaining API documentation is traditionally a chore. With FastAPI, it is completely hands-free.

With the server running, go to `http://127.0.0.1:8000/docs` in your browser.

You will see an interactive documentation page powered by Swagger UI. You can inspect all available API endpoints, review their parameter schemas, and test them live using the "Try it out" and "Execute" buttons.

## Route Parameters and Type Validation

Web applications need to handle dynamic inputs using route parameters. For example, let's create an endpoint to query data about specific martial arts masters:

By declaring standard Python type hints in your route function signature, FastAPI automatically handles request extraction and data conversion:

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

FastAPI enforces type constraints at runtime. For example, let's query a knight by their rank on the leaderboard:

```python
@app.get("/knights/rank/{rank}")
def get_knight_by_rank(rank: int):
    return {"message": f"Querying the knight ranked #{rank} on the martial world leaderboard..."}

```

* Accessing `http://127.0.0.1:8000/knights/rank/3` works perfectly, automatically converting the path variable to the integer `3`.
* Accessing `http://127.0.0.1:8000/knights/rank/abc` (an invalid integer) causes FastAPI to intercept the request and return an HTTP `422 Unprocessable Entity` error, explaining exactly what went wrong:

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

## Request Bodies and Pydantic Data Models

To handle structured inputs (like a client reporting new intelligence via an HTTP `POST` request), we define a request body schema.

FastAPI integrates with the **Pydantic** library to define data schemas. Pydantic models are similar to the [Data Classes (@dataclass)](class.md#data-classes-dataclass) we explored earlier; both use type hints to declare properties, but Pydantic adds robust data validation and parsing at runtime.

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

Here, `Field(..., ge=1, le=5)` constrains the `secret_level` integer to a value between 1 and 5 (greater than or equal to 1, less than or equal to 5). If you reload the `/docs` page, you will see that Swagger UI automatically generated a form reflecting this model schema and its validation rules.

## Asynchronous Routes and High Concurrency

As discussed in the [Asynchronous Programming](asyncio.md) chapter, asynchronous execution is highly efficient for I/O-bound tasks in Python because it avoids GIL bottlenecks.

FastAPI supports asynchronous route handlers out of the box. If an endpoint performs slow network requests or database queries, define it with `async def`. This allows the event loop to process other incoming requests while waiting, significantly increasing throughput:

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

Under this setup, the event loop remains unblocked, permitting the server to handle other traffic concurrently while the time-consuming tasks await completion.

## Summary

FastAPI makes web API development in Python clean, intuitive, and extremely performant. By combining type hints with Pydantic and Starlette, it automates validation, generates interactive documentation, and provides robust async execution, making it the premier choice for modern Python web services.
