# Calling AI Large Language Models

On the planet Pythora, while residents can command machines by writing Python code, they occasionally encounter challenges requiring vast knowledge or complex reasoning. When this happens, they call upon the "Super Mind" in the cloud: the Large Language Model (LLM).

In practice, Python is the primary language for interacting with these AI engines. Today, the most capable LLMs (such as OpenAI's GPT models and DeepSeek) provide Application Programming Interfaces (APIs). Through these APIs, our Python scripts can send prompts and receive responses programmatically, seamlessly integrating AI capabilities into our own software.

In this chapter, we will walk through using Python to interact with AI APIs, using the industry-standard **OpenAI** and the open-source star **DeepSeek** as examples. For a deeper dive into AI-driven software development, check out the book [《重构程序员》](https://cocode.qizhen.xyz/).

## Authentication: Obtaining an API Key

To interact with cloud-based AI services, you must authenticate your requests. AI providers issue a unique credentials string known as an **API Key**, which acts as a secure passcode to access their servers.

To obtain your key:

1. Go to the official developer platform of OpenAI or DeepSeek and register an account.
2. Find the "API Keys" menu and click "Create new API Key".
3. Copy the key and store it securely. **WARNING: Your API Key is a sensitive credential, similar to a password. Never hardcode it directly into your source files or upload it to public repositories like GitHub!** If leaked, others can use your account, incurring unexpected charges.

## Managing Secrets with Environment Variables

To keep API keys secure, developers on the planet Pythora avoid hardcoding them directly into scripts. Instead, they store them in a hidden `.env` file and load them as environment variables.

First, install the `python-dotenv` library in your terminal:

```bash
pip install python-dotenv

```

Create a `.env` text file in your project root directory and add your credentials:

```text
# .env file contents
OPENAI_API_KEY="sk-your-OpenAI-key..."
DEEPSEEK_API_KEY="sk-your-DeepSeek-key..."

```

In your Python script, you can load and retrieve these variables securely:

```python
import os
from dotenv import load_dotenv

# Load configuration from .env file
load_dotenv()

# Get the key (returns None if not found)
openai_key = os.getenv("OPENAI_API_KEY")
print("Successfully read the key!") 

```

## Interacting with the OpenAI API

OpenAI provides an official Python SDK that abstracts away low-level HTTP requests. Install it using `pip`:

```bash
pip install openai

```

### Creating Your First Chat Completion

Here is a complete script to send a message to the model and retrieve its response:

```python
import os
from dotenv import load_dotenv
from openai import OpenAI

# 1. Load environment variables
load_dotenv()

# 2. Initialize the client
# It will automatically look for an environment variable named OPENAI_API_KEY
client = OpenAI()

# 3. Send the request
response = client.chat.completions.create(
    model="gpt-4o",  # Specify the model name to use
    messages=[
        {"role": "system", "content": "You are a Python programming master who always speaks in a martial arts style."},
        {"role": "user", "content": "Explain in one sentence what a list is in Python?"}
    ],
    temperature=0.7  # Controls the randomness of the response: 0 is most precise, 1 is most creative
)

# 4. Extract and print the AI's reply
print(response.choices[0].message.content)

```

**How It Works:**

* **`model`**: Selects the target LLM version (e.g., `gpt-4o`).
* **`messages`**: A list of messages representing the conversation history. Each message has a specific `role`:
  * `"system"`: Sets the assistant's behavior, persona, or guidelines.
  * `"user"`: Represents prompts submitted by the user.
  * `"assistant"`: Represents the model's responses. In a multi-turn chat, feeding previous assistant messages back to the API helps the model retain context.

* **`temperature`**: Controls response creativity. Higher values (e.g., 0.8) lead to more diverse, creative answers, while lower values (e.g., 0.0) make the output deterministic and precise.

## Interacting with the DeepSeek API

DeepSeek is a popular model known for its strong reasoning capabilities, code generation, and cost-effective API pricing.

For Python developers, DeepSeek's API is designed to be **fully compatible with OpenAI's request and response schemas**. This means you do not need a separate SDK; you can use the official `openai` library and simply change the `base_url` and `api_key` parameters:

```python
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

# Initialize the client, this time specifying DeepSeek's base address and key
client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com/v1"  # Point the request to DeepSeek's server
)

# The way to send the request is exactly the same as with OpenAI
response = client.chat.completions.create(
    model="deepseek-chat",  # Specify DeepSeek's model name
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What does the planet Pythora look like? Use your sci-fi imagination."}
    ],
    stream=False
)

print(response.choices[0].message.content)

```

*Note: Many API providers (such as Groq, Together AI, or local runners like Ollama) adopt this same OpenAI-compatible API standard. Learning the OpenAI SDK layout effectively gives you the tools to interact with dozens of different LLM providers by simply updating configurations.*

## Streaming Responses

When using web chatbots, you typically see text generated word by word. This typewriter effect is called **streaming**. Because generating a full response can take several seconds, streaming chunks as they are generated provides a much better user experience than waiting for the entire payload to compile.

To stream responses in Python, pass `stream=True` in the request parameters:

```python
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com/v1"
)

# Note the addition of stream=True here
stream = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "Write a limerick about Python programmers."}],
    stream=True  
)

print("AI is composing a poem:\n")
# The return value is an iterable object; we need to use a for loop to extract the text piece by piece
for chunk in stream:
    # Extract one generated fragment at a time (could be one character or one word)
    if chunk.choices[0].delta.content is not None:
        # Use end="" in print to ensure it doesn't add a newline each time
        print(chunk.choices[0].delta.content, end="", flush=True)

```

## Error Handling and API Exceptions

When calling cloud services, your code must handle network dropouts, rate limiting, and API authentication errors gracefully to prevent application crashes.

Wrap your API calls in `try-except` blocks, catching specific exception classes provided by the SDK (as discussed in the [Exception Handling](exception.md) chapter):

```python
from openai import OpenAI, APIError, AuthenticationError, RateLimitError

client = OpenAI()

try:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": "Hello!"}]
    )
    print(response.choices[0].message.content)
    
except AuthenticationError:
    print("Error: Authentication failed. Please check if your API Key is correct!")
except RateLimitError:
    print("Error: Too many requests, or your quota has been exhausted. Please try again later!")
except APIError as e:
    print(f"The cloud server dozed off and encountered an error: {e}")
except Exception as e:
    print(f"An unknown local error occurred: {e}")

```

## Managing Conversational State (Multi-Turn Chat)

Large language models are stateless; they do not remember previous API calls. If you prompt a model with "My name is Qizhen" and follow up in a separate request with "What is my name?", the model will have no record of the previous message.

To build a continuous conversation, you must maintain the conversational state locally in a list and pass the entire history to the API with each new prompt:

The following example implements a terminal-based chatbot using a loop and a message list:

```python
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com/v1"
)

print("Cloud think tank connected! (Type 'exit' to end the conversation)\n")

# 1. Initialize the "memory river": create a list to hold the entire conversation context
dialogue_history = [
    {"role": "system", "content": "You are a patient and humorous programming mentor."}
]

while True:
    # 2. Get user input
    user_input = input("You: ")
    if user_input.strip() == 'exit':
        print("Cloud connection disconnected. Goodbye!")
        break
    
    # 3. Package the user's new question as a dictionary and add it to the memory list
    dialogue_history.append({"role": "user", "content": user_input})
    
    # 4. Summon the AI with the complete memory list
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=dialogue_history  # This message includes all previous conversations!
        )
        
        # 5. Extract the AI's reply
        ai_reply = response.choices[0].message.content
        print(f"AI: {ai_reply}\n")
        
        # 6. [THE MOST CRITICAL STEP] Add the AI's reply to the memory list too!
        # This way, on the next loop, the AI can "see" what it just said
        dialogue_history.append({"role": "assistant", "content": ai_reply})
        
    except Exception as e:
        print(f"Communication error: {e}")
        # If communication fails, it's best to pop out the user question that was just added
        # to avoid breaking the context logic
        dialogue_history.pop()

```

## Context Management and Token Limits

As a conversation progresses, the message list grows indefinitely, leading to two major challenges:

1. **Token Cost and Context Limits**: APIs charge based on the volume of data (measured in tokens) processed. Sending the entire history with every request is costly and slow. Furthermore, all models have a maximum context window limit (e.g., 128,000 tokens), beyond which the API will reject requests.
2. **Attention Dilution**: Extremely long conversation histories dilute the model's attention, causing it to overlook early system instructions or generate less coherent responses.

To manage this, production applications implement **context window sliding** or **summarization** strategies: either keeping only the most recent N messages, or using an LLM to periodically summarize early segments of the conversation and prepend the summary as context.
