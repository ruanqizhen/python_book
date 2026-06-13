# Computer Fundamentals

This section provides beginners with foundational knowledge about computer architecture and the history of programming languages. Understanding these concepts will help you grasp the design choices and conventions in modern coding. If you are already familiar with computer architecture, feel free to skip to the next chapter.

## Turing Machine

Since ancient times, humans have sought ways to automate mathematical calculations. The abacus, for example, is a classic tool that speeds up arithmetic. However, its functionality is limited to basic addition, subtraction, multiplication, and division. Over the past two centuries, far more sophisticated computing machines have been designed. Among them, the most influential is the Turing Machine, conceptualized by mathematician Alan Turing in 1936. Although the Turing Machine is a theoretical model rather than a physical machine, it mathematically proved the feasibility of general-purpose computation, laying the foundation for modern computers.

The basic components of a Turing Machine are:
- An infinitely long tape: Divided into discrete squares, each capable of holding a single symbol.
- A read/write head: A mechanism that moves along the tape to read, write, or modify symbols.
- A transition table (rules): A set of instructions dictating what the machine should do next (e.g., write a symbol, move left or right, or transition to a different state) based on its current state and the symbol it reads.

Despite its simplicity, this model can solve any algorithmic problem (represented as a sequence of input symbols on the tape) by executing a step-by-step procedure to produce an output. Turing proved that any mathematically "computable" problem can be solved by a Turing Machine.

Modern computers are practical implementations of this theoretical model. Memory and storage function like the tape, while the Central Processing Unit (CPU) acts as the read/write head and control logic. Although modern computers look infinitely more complex, they are conceptually equivalent to Turing's machine.

## Von Neumann Architecture

Implementing Turing's model in the real world allows for various engineering choices. For example, we can use magnetic cores or semiconductor circuits instead of paper tape, organize memory in different layouts, and use electrical signals instead of mechanical parts to read and write data.

The basic architecture of modern computers was proposed by mathematician John von Neumann in 1945. The core of the Von Neumann Architecture is stored-program execution: it uses binary logic, stores both data and program instructions in the same shared memory space, and relies on the CPU to fetch and execute instructions sequentially. This elegant design remains the foundation of general-purpose computers today.

The primary components of this architecture are:
- **Central Processing Unit (CPU)**: Interprets and executes instructions, coordinating the other hardware components.
- **Memory (RAM)**: Volatile storage that holds active program instructions and data.
- **Input/Output (I/O) Devices**: Keyboards, mice, and displays that let users interact with the machine.
- **System Bus**: The communication pathways that transfer data between the CPU, memory, and I/O devices.

Alongside hardware, a computer requires software. An operating system (OS) manages the physical hardware resources and provides a platform for other programs. On top of the OS, users install system utilities and applications to perform specific tasks, such as web browsers, office suites, and media players.

A key bottleneck in this architecture is the speed difference between the CPU and memory—often referred to as the "Von Neumann bottleneck." Because memory access is orders of magnitude slower than CPU calculations, the processor spends a lot of time waiting for data. Bridging this gap involves sophisticated hardware cache designs and efficient programming techniques, representing a challenge we will encounter often in software engineering.

## Programming Languages

In daily life, we use the decimal (base-10) system. Computers, however, operate in binary (base-2) because electrical circuits are naturally suited for two states: on (high voltage, representing `1`) and off (low voltage, representing `0`). Thus, at the lowest level, all computer data consists of binary digits (bits) `0` and `1`. Because humans cannot easily read or write machine-level binary, we use programming languages as a bridge.

Early programmers had to write machine code directly in binary—an incredibly tedious and error-prone process. To make programming human-friendly, assembly language was introduced, replacing binary codes with short, mnemonic commands (like `ADD` or `MOV`). While a massive improvement, assembly language is still low-level and tied directly to the architecture of a specific processor.

As computers proliferated, developers needed languages that were faster to write and easier to maintain. This led to the creation of high-high-level programming languages. These languages abstract away hardware-specific details like memory addresses and CPU registers, using syntax that resembles English. This allows developers to express complex logic cleanly and concisely. In short, high-level languages let you focus on *what to solve*, whereas low-level languages require you to manage *how the machine does it*. Modern languages like Python and JavaScript are prime examples of high-level languages.

The historical trajectory of computer languages is one of increasing abstraction, bringing programming closer to human natural language. In the future, voice interfaces and AI models may allow humans to command systems in plain English, potentially bypassing traditional coding languages entirely.

### Why Are There So Many Programming Languages?

There are thousands of programming languages in existence. Even if we only count those actively used in the industry, there are hundreds. Why do we need so many? Why can't we just use a single universal language for everything?

A universal language is impractical because we expect a programming language to possess several conflicting qualities:
- **Ease of Use**: Simple syntax so beginners can learn it quickly.
- **Expressiveness**: Powerful features suitable for complex, large-scale systems.
- **Execution Speed**: Minimal resource footprint and maximum performance.
- **Development Speed**: Ability to build and iterate projects rapidly.
- **Safety**: Robust guards against memory leaks, runtime crashes, and security vulnerabilities.
- **Flexibility**: Easy to modify and extend over time.
- **Portability**: The ability to run on any device, from servers and desktops to smartphones and IoT gadgets.

Unfortunately, these goals are in constant tension. For instance, execution efficiency often requires low-level manual memory management, which increases development time and safety risks. Conversely, ease of use and safety features like automated garbage collection introduce runtime overhead. Because no single language can do it all, developers choose different tools based on their specific priorities.

Additionally, when new computing paradigms emerge (such as cloud computing or web applications), they require new language features. Retrofitting an existing language can be incredibly expensive and risky, as changes might break millions of lines of legacy code. To maintain backward compatibility, it is often easier and safer to design a new language from scratch. For example, C's dominance was challenged by the rise of object-oriented programming, leading to the creation of C++, Java, and eventually languages like Rust and Go.

This doesn't mean languages never change. Active programming languages must evolve. However, they must do so without breaking backward compatibility. C++, for example, has added templates, the Standard Template Library (STL), and lambda functions over the years. Modern C++ development is vastly different from early C++: modern features help prevent memory leaks and dangling pointers, allowing developers to write safer code. Yet, despite these major changes, C++ maintains excellent backward compatibility, allowing decades-old code to compile on modern compilers.

Occasionally, language designers must make the difficult decision to break backward compatibility to fix fundamental flaws. A famous example is Python 3.0. To fix core issues with string encoding (Unicode) and clean up early design inconsistencies, Python 3 was released as a non-backward-compatible upgrade. This meant Python 2 code would not run on Python 3 without modifications. This breaking change split the ecosystem and took over a decade of migration effort for the community to transition fully.

Python's design choices prioritized developer experience. It favored readability over manual memory control, flexibility over strict static typing, and development speed over raw execution performance. Today, Python is addressing these historic trade-offs by adding optional type hinting, supporting optimized C extensions, and compiling to fast machine code via third-party libraries. This balance of simplicity and extensibility has fueled Python's explosive growth across diverse industries.

### Compiled Languages and Interpreted Languages

Programming languages, like human languages, rely on text structured by syntax rules. However, CPUs cannot read this text directly—they only understand binary machine code. Every programming language must translate its human-readable source code into machine instructions. Based on how this translation happens, languages are generally classified as either compiled or interpreted.

In a **compiled language**, the entire source code of the program is translated by a special program (the compiler) into machine code *before* execution, generating a standalone binary file (like an `.exe` file on Windows). C and C++ are classic compiled languages.

An **interpreted language** does not generate a standalone machine-code binary. Instead, an interpreter reads and runs the source code line by line, translating and executing it on the fly. Python and JavaScript are typical interpreted languages, and their programs are often called scripts.

Both approaches have pros and cons. Compiled languages run extremely fast because the translation is already complete, allowing the compiler to perform global performance optimizations. However, the development cycle is slower: any change to the source code requires recompiling the entire program before you can run it.

Interpreted languages have a runtime performance penalty because translating the code on the fly takes time. However, they offer unmatched development flexibility. You can test code interactively line by line, modify parts of a running program, and see changes immediately without waiting for a compile step, which drastically speeds up development.

Historically, compiled languages dominated system development because interpreted environments were too slow. Today, however, that gap has shrunk. A great example is artificial intelligence: machine learning models require massive computational power, yet Python is the undisputed language of AI. Why? Because Python acts as a wrapper. The computationally intensive logic is stored in pre-compiled C/C++ libraries (such as PyTorch or TensorFlow). The Python script merely coordinates the data flow and settings, which requires very little CPU time. Thus, you get the execution speed of a compiled language with the development ease of Python.

This optimization applies to your own modules too. When you import a custom file, Python compiles it into intermediate "bytecode" and saves it as a `.pyc` file in the `__pycache__` directory. On subsequent runs, Python loads the bytecode directly, skipping the parsing step. (Note that this speeds up program startup, but does not change execution speed once the code is running.)

## The Python Programming Language

### The Development of Python

Python was created by Dutch computer scientist Guido van Rossum during the Christmas holidays of 1989. His goal was to design an intuitive, highly readable language. He named it after the British comedy show *Monty Python's Flying Circus*. Because the word "python" refers to a snake, the language has a strong serpentine association, and its official logo features two interlocking snakes.

Guido released Python's first public prototype in 1991, followed by version 1.0 in 1994. Python 2.0, released in 2000, added list comprehensions and a garbage collector, launching Python into mainstream popularity. Python 3.0, released in 2008, was a major cleanup that modernized string handling and refined syntax, resolving early design inconsistencies.

Today, Python consistently ranks at the top of programming language popularity indexes, including Stack Overflow developer surveys and the TIOBE index. It is the language of choice for data science, artificial intelligence, web backend development, automation, and education.

Its key strengths include:
- Easy to learn and use: Clean syntax, suitable for rapid prototyping.
- Efficient development: Extensive library support saves development time.
- Versatility: Covers a wide range of needs from scientific computing to web development.
- Strong community support: Rich resources available from beginners to experts.

Its main limitation is in mobile app development, where its ecosystem remains weak compared to Swift, Kotlin, or JavaScript.

### Python Interpreters

There are multiple implementations of the Python interpreter. The standard reference version is **CPython**, which is written in C and maintained by the Python Software Foundation. Other implementations include **PyScript** (running Python in browsers using WebAssembly), **Brython** (translating Python to JavaScript on the fly), **Jython** (compiling to Java bytecode), **IronPython** (integrating with the .NET framework), and **PyPy** (a high-performance interpreter using Just-In-Time compilation). Because their behaviors can differ slightly, this book uses standard CPython as its reference.

### Python Versions

Python undergoes continuous development. We recommend using a modern version (such as Python 3.10 or later) for learning. You can check your installed version by running:

```bash
python --version
```

This will print your active version, e.g., `Python 3.11.2`.

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
