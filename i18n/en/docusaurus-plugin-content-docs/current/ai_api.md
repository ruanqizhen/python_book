# Calling AI Large Language Models

On the planet of Pythora, although residents can command all things by writing Python code, sometimes they encounter problems that require extremely vast knowledge reserves or complex logical reasoning to solve. Whenever this happens, they seek help from the "Super Mind" residing in the cloud—the Large Language Model (LLM).

In the real world, Python is the most natural and convenient language for communicating with these AI large models. Currently, the most powerful AI large models on the market (such as OpenAI ChatGPT overseas, and DeepSeek, Tongyi Qianwen in China) all provide APIs (Application Programming Interfaces). Through APIs, we can have our Python programs automatically send questions to the AI and receive the AI's answers, thereby seamlessly integrating the AI's brain into our own applications.

In this chapter, we will take the industry benchmark **OpenAI** and the recently notable domestic open-source star **DeepSeek** as examples to briefly explain how to call AI APIs using Python. If you want to learn AI programming in more depth, you can refer to this book: [《重构程序员》](https://cocode.qizhen.xyz/).

## Preparation: Access Token (API Key)

To communicate with the AI in the cloud, you first need to prove your identity. Each AI provider generates a string of random letters and numbers for you—this is the **API Key**. It is like a pass token to enter the cloud treasury.

Obtaining the access token is simple:

1. Go to the official developer platform of OpenAI or DeepSeek and register an account.
2. Find the "API Keys" menu and click "Create new API Key".
3. Copy the string and keep it safe. **Note: Your API Key is equivalent to your bank card password. Never write it directly in your code and upload it to a public network (such as GitHub)!** Otherwise, others could steal your usage quota.

### Environment Variables and python-dotenv

To store the API Key securely, the mages of Pythora usually write it in a hidden `.env` file and read it through Python's environment variables.

First, install the `python-dotenv` library in your terminal:

```bash
pip install python-dotenv

```

Then, in the same directory as your Python script, create a new text file named `.env` and write your keys in it:

```text
# .env file contents
OPENAI_API_KEY="sk-your-OpenAI-key..."
DEEPSEEK_API_KEY="sk-your-DeepSeek-key..."

```

In your Python program, you can safely read them like this:

```python
import os
from dotenv import load_dotenv

# Load configuration from .env file
load_dotenv()

# Get the key (returns None if not found)
openai_key = os.getenv("OPENAI_API_KEY")
print("Successfully read the key!") 

```

## Summoning OpenAI: Industry Standard Dialogue

OpenAI provides a very complete official Python library that greatly simplifies the tedious process of sending requests. First, install the official library:

```bash
pip install openai

```

### Your First AI Dialogue Program

The following code shows how to send a message to OpenAI and print its reply:

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

**Code Breakdown:**

* **`model`**: Specifies which model to summon (e.g., `gpt-4o`, `gpt-3.5-turbo`).
* **`messages`**: This is a list that records the context of the conversation. It contains different roles (`role`):
  * `"system"`: This is where you set the AI's "persona" or global background instructions.
  * `"user"`: Your questions or commands.
  * `"assistant"`: The AI's previous replies (in multi-turn conversations, you need to include what the AI said before to help it remember the context).

* **`temperature`**: The temperature parameter. If you want it to write poetry or fiction, set it higher (e.g., 0.8); if you want it to write strict code or do math problems, set it lower (e.g., 0.0).

## Summoning DeepSeek: The Charm of Seamless Substitution

DeepSeek is a domestic AI model that has recently attracted a lot of attention. Its code ability and logical reasoning have reached world-class levels, while its API call prices are very affordable.

For Python developers, DeepSeek has an extremely delightful feature: **Its API format is fully compatible with OpenAI's standard!** This means you **do not need** to learn any new library. You only need to modify two parameters in the previous program: **Base URL** and **API Key**, and you can use the same spell for summoning OpenAI to summon DeepSeek directly!

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

*Note: Currently, many excellent open-source models or API services (such as SiliconFlow, Groq, etc.) both domestically and internationally support the OpenAI interface format. As long as you master the usage of the OpenAI SDK, you can freely switch between various large models—this is the charm of unified standards.*

## Advanced Technique: Streaming Output

When using ChatGPT in practice, you will notice that text appears one word at a time. This is called **streaming output**. Because generating lengthy responses takes tens of seconds for large models, if you wait for the entire response to finish before displaying it, users would feel the program has frozen.

Implementing this "typewriter" effect in Python is very simple, just add `stream=True` when making the call:

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

## Exception Handling: Dealing with Network and Cloud Storms

When sending requests to the cloud, network fluctuations, insufficient API balance, or even cloud server crashes are all possible. A robust Python program must be able to handle these exceptions gracefully, rather than crashing outright.

When using large model APIs, it is strongly recommended to combine the knowledge we learned in the [Exception Handling](https://www.google.com/search?q=exception) chapter:

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

## Multi-turn Dialogue and History Concatenation

In the previous examples, each time we sent a request to the cloud, it was a one-off transaction. The large model in the cloud is inherently stateless; it has no memory. If you first ask "My name is Qizhen" and it replies "Got it", then you immediately send a second request asking "What is my name?", it will be completely confused.

To give the AI continuous memory for true "multi-turn dialogue", we must maintain a "memory river" in our local code. **The secret is: each time we send a request to the AI, we must not only send the latest question but also package and send all previous conversation history together.**

Let's use a `while` loop to implement a real local AI chatbot:

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

### Memory Trimming and "Context Rot"

In this program, as you keep chatting, the `dialogue_history` list will grow longer and longer. This brings two real-world problems:

1. **Cost and Limits**: AI APIs charge based on the number of words (Tokens) processed. Sending a massive amount of history every time not only slows down API calls but also quickly consumes your quota. Moreover, every model has a hard limit on the maximum context length (e.g., 8K, 32K, or 128K Tokens). Once exceeded, the cloud will reject the request with an error.
2. **Context Rot**: Even if the length limit is not exceeded, excessively long input text can lead to a phenomenon known as "context rot." The AI's attention mechanism gets diluted by a large amount of early, useless chit-chat, causing it to start forgetting the initially set system prompt, or producing logical confusion and irrelevant answers.

Therefore, when developing truly large-scale AI applications on the planet Pythora, residents usually write some "memory trimming" logic. For example: keep only the last 10 turns of dialogue and discard earlier ones; or when the list exceeds a certain threshold, automatically call another AI program to summarize the earlier lengthy conversations into a short paragraph of one to two hundred words, then use that summary as a new "memory starting point."
