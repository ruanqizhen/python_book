# Computer Fundamentals

This section aims to provide beginners with background knowledge about computer composition and the history of programming languages, so as to better understand various concepts and conventions in computer languages. If you are already familiar with computer architecture, feel free to skip this section.

## Turing Machine

Since ancient times, people have been exploring how to use machines to assist with mathematical calculations. The abacus, for instance, is a typical auxiliary computing tool that can improve the user's calculation speed. However, the abacus has relatively simple functionality, effective only for basic addition, subtraction, multiplication, and division. Over the past two centuries, more powerful computing machines have been designed. Among them, the most influential for future generations is undoubtedly the Turing Machine, proposed by mathematician Alan Turing in 1936. Although the Turing Machine is not a physical machine but a model, it theoretically proved the feasibility of machine computation, laying the theoretical foundation for the birth and development of modern computers.

The basic components of a Turing Machine are as follows:
- An infinitely long tape: The tape has countless squares, each of which can hold a single symbol.
- A read/write head: The read/write head can move to any square on the tape to read or modify symbols.
- A set of operation rules: The Turing Machine can save its current state and, based on the current state and the symbol on the tape, decide the next operation, such as moving to a new position, reading, or writing.

Although the structure of the Turing Machine is simple, given a problem (a string of symbols written on the tape according to rules), it can compute the result of the problem (the updated tape). Turing proved that any "computable problem" can be solved using a Turing Machine.

The Turing Machine is a theoretical model, and modern computers can be seen as a practical implementation of this model. Modern computers read and write data through memory or hard drives, and the Central Processing Unit (CPU) controls the read/write process. Although modern computers appear much more complex than the Turing Machine, they are essentially the same.

## Von Neumann Architecture

Following the Turing Machine model, there are still many ways to build an actual machine. For example, magnetic cores or semiconductor circuits can replace the tape as storage media; the organization of data in memory can also differ; electronic signals can replace mechanical devices for reading and writing data, etc.

The basic framework of modern computers adopts the Von Neumann Architecture, proposed by mathematician John von Neumann in 1945. The core idea of the Von Neumann Architecture is: use binary logic, store both data and program instructions (operations on data) in the same memory unit, and have the CPU read and execute them sequentially. This relatively concise design laid the foundation for modern general-purpose computers.

The main components of the Von Neumann Architecture include:
- Central Processing Unit (CPU): Responsible for interpreting and executing instructions, coordinating the work of various parts of the computer.
- Memory: Used to store program instructions and data.
- Input/Output Devices: Such as keyboards and monitors, used for interacting with the computer.
- Data Bus: Used for transmitting data.

In addition to the hardware components mentioned above, a computer also requires supporting software. Every computer has an operating system installed to manage the computer's hardware and software resources. Additionally, various system software and application software must be installed to perform specific tasks, such as browsing the web, playing videos, etc.

A major issue with the Von Neumann Architecture is that the data transfer speed between the CPU and memory limits system performance. Reading and writing data in memory is much slower than the CPU's processing speed. To address this problem, many programming techniques and hardware optimization solutions have been developed, and this will also be a challenge we frequently encounter in the process of learning programming.

## Programming Languages

In daily life, we primarily use the decimal system to represent data. But computers are different — they use binary. This is because binary is the simplest way to represent data using circuits: a high voltage level represents 1, and a low voltage level represents 0. That is, inside a computer, all information exists in the form of binary digits 0 and 1. Since it is very difficult for humans to directly understand this binary data, we need a communication tool between humans and computers — this is the programming language.

In the early days of computers, people had no choice but to accommodate the computer by directly using binary data to control it. This approach was extremely unfriendly to humans. Thus, assembly language emerged, using meaningful character strings to replace the binary numbers in machine language. This greatly improved program readability, but the structure of assembly language programs was still closely tied to specific machines.

With the spread of computers, developers began to demand various different features from programming languages. To further improve programming efficiency and address various application scenarios, many high-level programming languages emerged. High-level programming languages abstract away the implementation details of underlying hardware, making syntax closer to human language, thus allowing programmers to write code with more concise and readable syntax structures. High-level languages typically focus more on "what to do," while low-level languages focus more on "how to do it." The most popular programming languages today, such as Python and JavaScript, are typical examples of high-level languages.

Looking at the development trajectory of programming languages, the clear trend is toward increasing abstraction and becoming closer to human natural language. In the future, humans are likely to communicate directly with machines using natural language, without the need for programming languages for human-computer interaction.

### Why Are There So Many Programming Languages?

It is difficult to count exactly how many programming languages exist in the world. Sometimes, even in computer science courses, students are asked to design a new programming language. Even considering only those with formal specifications that are widely used, there are at least a thousand. Why do we need so many programming languages? Could we maintain just one or a few programming languages and accomplish everything?

This is almost impossible. Ideally, we would want a programming language to have the following characteristics:
- Easy to learn and use: Beginners can get started directly and complete tasks efficiently.
- Powerful: Capable of doing any work, even very large-scale projects.
- High execution efficiency: Minimal resource consumption, fastest program execution speed.
- High development efficiency: Can quickly set up any project.
- Safe and reliable: Can prevent program errors and guard against malicious exploitation.
- Flexible and extensible: Can add new functionality to a program with minor modifications.
- Cross-platform and portable: The same program can run on different hardware platforms, such as phones, watches, servers, etc.

However, these requirements often conflict with each other. For example, the more features there are, the higher the learning cost. Therefore, no single programming language can perfectly satisfy all needs. This is precisely why people have developed various different programming languages, optimizing for specific aspects.

Moreover, whenever a new class of problems emerges, we need some new language features to address them. Yet, in most cases, improving an existing programming language is very costly, and creating a new programming language is often more economical than improving an existing one. If we modify an existing programming language to adapt to new requirements, it could very well break programs already written in that language. Such consequences are unacceptable, so the safe approach is to not alter existing languages but instead create a new language to meet new needs. Hence, new programming languages keep appearing. For example, although C was already popular, to support object-oriented programming, people developed C++, Java, and others.

This is not to say that once a programming language is designed, it must remain unchanged forever. In fact, living programming languages must continuously evolve. However, these improvements must not affect any existing functionality. For instance, after its release, C++ underwent several major improvements: support for templates, refinement of the STL, addition of lambda functions, and so on. The programming philosophy of C++ today is vastly different from its early days. When developing projects with early C++, most effort might have been spent on issues inherent to the language itself, such as finding memory leaks and wild pointers. Today, C++ can also manage memory automatically, allowing programmers to focus primarily on business logic rather than low-level resource management. Despite such significant changes, C++ has maintained extremely high backward compatibility: the vast majority of programs written in early years can still compile successfully on today's C++ compilers.

Sometimes, programming language designers may discover unacceptable design flaws and may even have to break compatibility to make changes. For example, to thoroughly resolve some historical baggage from the language's early design (such as Unicode support, integer division, etc.), Python 3.0 made the decision to be backward incompatible. This meant that code that worked perfectly on Python 2 would likely fail on Python 3 without modification. This breaking change brought enormous migration costs, causing the Python community to spend more than a decade completing the transition from 2.0 to 3.0.

In its original design, Python prioritized ease of learning and use, thus sacrificing some complex features such as memory control; it prioritized flexibility, thus sacrificing some security, such as static type checking; it prioritized development efficiency, thus sacrificing execution efficiency. However, today's Python is also striving to overcome these shortcomings, such as compensating for missing features through third-party libraries and leveraging C-language precompiled modules to improve execution efficiency. It is for these reasons that Python has been able to be applied in an increasingly wide range of fields.

### Compiled Languages and Interpreted Languages

Computer programming languages, though clearly different from the natural languages we use (Chinese, English, etc.), also share similarities. They are all composed of text (or graphical symbols) arranged according to specific syntax rules. However, computer processors cannot directly understand these texts or symbols — they only recognize binary instructions and data. Before running the programs we write, we first need to convert these text-based or graphical programs into binary instructions and data that the processor can recognize. Every programming language must go through this conversion process. Based on the translation process, programming languages are broadly divided into two categories: compiled and interpreted.

In compiled languages, the entire project's source code must be fully written, then translated entirely into binary machine language, before it can be executed. This translation process is called "compilation." Compiled languages like C and C++ have compilers that translate the programs we write into binary executable files.

Interpreted languages, on the other hand, do not require pre-compilation. They read the code while simultaneously translating it into binary machine language and executing the translated code on the fly. This process is called "interpretation": each line of code is read, interpreted, and executed. Python and JavaScript are typical interpreted languages. Code written in interpreted languages is sometimes also called scripts.

These two types of programming languages each have their advantages and disadvantages. The advantage of compiled languages is their fast execution speed, because the program is pre-compiled and runs directly from the compiled binary machine language. Additionally, compiling the entire program as a whole allows for many optimizations that further improve efficiency. The downside is that any change to the code requires recompiling the entire program.

Interpreted languages are relatively slower because the program must be interpreted before it can execute — the interpretation process is itself part of execution. However, they offer greater flexibility: modifications to part of the code do not affect the execution of other parts, which is very useful in certain situations. For example, while writing a program, you can execute it as you go to ensure correctness. If a particular statement is incorrect, you can modify and run just that statement without needing to re-execute the entire program, greatly improving development efficiency.

Before 2020, compiled languages dominated program development. Interpreted languages were less popular because, at the time, they were indeed too slow. However, times have changed, and after many improvements, the speed disadvantage of interpreted languages is no longer as pronounced. Currently, the task that most consumes computing power and tests execution efficiency is arguably training artificial neural network models. Yet it is Python, an interpreted language, that excels most in this domain. The reason is that not all code in a Python program is executed interpretively. In fact, only the code in the main file is interpreted. The most time-consuming logic is usually implemented in [modules](module), for example, AI model training logic often runs in modules such as PyTorch. These modules themselves are pre-compiled and execute binary machine instructions directly at runtime. The code in the main program is typically responsible only for data passing and result display, operations that are inherently fast. Therefore, whether training an AI model in C or Python, there is almost no difference in speed.

This is not only true for Python's built-in or third-party modules — our own modules are also pre-compiled by Python into bytecode and saved in \*.pyc files (usually located in the `__pycache__` directory). When the program runs again, the Python interpreter directly loads these bytecodes, skipping the step of parsing the source code. It is important to note that this mainly improves the program's startup speed but does not directly affect execution efficiency once the program is running.

## The Python Programming Language

### The Development of Python

The Python programming language was conceived by Dutch computer scientist Guido van Rossum during the Christmas season of 1989. Its original intention was to design a language with clean syntax that is easy to learn and use. When naming the new language, Guido adopted "Python" from his favorite British comedy show, *Monty Python's Flying Circus*. The word "Python" means "snake," and thus the language became associated with snakes — its official logo features two serpents.

A preview version of Python was released in 1991, and the first official version was released in 1994. In 2000, Python 2.0 was released, which refined Python's features. From this point on, Python gained widespread popularity and began to expand rapidly into various application domains. The 3.0 version released in 2008 was another major upgrade, addressing some historical issues in the language design, such as Unicode support.

Today, thanks to its ease of use and powerful ecosystem, Python has become one of the most popular programming languages in the world. It consistently ranks at the top of programming language indexes such as the Stack Overflow survey and the TIOBE index. It is especially popular in fields such as data science, artificial intelligence, web development, and education.

Python's most appreciated advantages include:
- Easy to learn and use: Clean syntax, suitable for rapid prototyping.
- Efficient development: Extensive library support saves development time.
- Versatility: Covers a wide range of needs from scientific computing to web development.
- Strong community support: Rich resources available from beginners to experts.

Its only notable disadvantage is insufficient support and a weak ecosystem for mobile development.

### Python Interpreters

There is more than one Python interpreter. The interpreter we talk about most often is called CPython, which is the official distribution of Python developed in C, hence the name CPython. Besides this interpreter, there are also environments that can run Python directly in a browser, such as PyScript (which uses WebAssembly technology to run a Python interpreter in the browser); tools that transpile Python code to JavaScript, such as Brython; the Jython interpreter that compiles to Java bytecode; IronPython that compiles to .NET bytecode; and PyPy, which uses Just-In-Time (JIT) compilation technology, among others. Since different interpreters may produce results slightly different from the official CPython, when describing program behavior, this book will use CPython as the reference.

### Python Versions

Python is constantly improving, with a major version update every few months. For learning purposes, it is recommended to use the latest version of Python whenever possible. To check your Python version, use the following command in your computer's command-line terminal:

```bash
python --version
```

You will then see output similar to `Python 3.11.2`, indicating that the Python version is 3.11.2.

If you are in a Python editing environment, you can run the following Python code to view the version:

```python
import sys
print(sys.version_info)
print(sys.version)
```

This will display some more detailed version information, such as:

```
sys.version_info(major=3, minor=11, micro=2, releaselevel='final', serial=0)
3.11.2 (main, May  3 2023, 04:00:05) [Clang 17.0.0]
```

In addition to the version number, it also shows the release date, compilation platform, and other information.
