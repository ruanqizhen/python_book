# Functional Programming

## Programming Paradigms

A programming paradigm is a style or methodology of programming that provides models for solving problems and structuring code. Different paradigms offer unique perspectives on how computation should be structured and how data and logic should interact.

Python is a multi-paradigm language that primarily supports the following three styles:

* **Procedural Programming**: Based on the concepts of sequential "instructions" and "procedures" (functions). It structures a program as a series of steps executed in order, processing state like entries in a ledger. This is the most intuitive approach and is the paradigm we have used in most preceding examples.
* **Functional Programming (FP)**: Emphasizes the use of pure functions to process data, avoiding mutable state and side effects. It is structured more like mathematical formula derivation. Before diving in, readers are encouraged to read the appendix introduction to [Lambda Calculus](https://lv.qizhen.xyz/appendix_languages#lambda-calculus-编程语言). Lambda Calculus is the mathematical foundation of functional programming; though its syntax is minimal, it perfectly encapsulates the essence of the paradigm.
* **[Object-Oriented Programming (OOP)](oop)**: Binds data (state) together with the methods that operate on it, encapsulating them within objects. Its primary purpose is to improve the maintainability and scalability of large, complex applications. We will cover this in detail in a later section.

Beyond these three, other languages adopt different paradigms, such as the dataflow-oriented paradigm used by the [LabVIEW programming language](https://lv.qizhen.xyz).

## Characteristics of Functional Programming

In functional programming, functions are not merely blocks of code; they are **first-class citizens**. This means they can be treated like any other data type (such as integers or strings): assigned to variables, passed as arguments to other functions, or returned as values from functions.

This first-class status shifts how we write code:

1. **Declarative over Imperative**: Procedural programming is *imperative*—it details "how" to achieve a result by manually managing loops, indices, and state changes. Functional programming is *declarative*—it defines "what" the result is by mapping data through composed functions.
2. **Immutability and No Side Effects**: In pure functional programming, variables are immutable; once created, data cannot be modified. If data needs to change, a function returns a new copy of the data with the modifications. This mirrors mathematical functions ($y = f(x)$): calling a function with the same input will always return the same output without modifying the external state of the program.
3. **Higher-Order Functions**: Because functions are values, we can write functions that accept other functions as inputs or return them as outputs. This higher-order pattern enables powerful abstractions, often replacing complex multi-line loops with a single line of function compositions.

From a code structure perspective, procedural programming relies heavily on variables, loops, and conditional jumps to manage state transitions. Pure functional programming, by contrast, eliminates variable reassignment and explicit loop constructs. Instead, a program is a nested chain of function calls where the output of one function is passed directly as the input to the next.

While functional programming produces concise and elegant code, it is more abstract and can be harder to read for those accustomed to imperative logic. A procedural program reads sequentially, aligning with natural reading habits, whereas a functional program can embed logic within layers of nested calls, making it less intuitive at a glance. When deciding whether to use functional programming patterns, consider the readability and familiarity of the style for your collaborators.

However, writing mind-bending code is precisely what the inhabitants of the planet Pythora love to do. The residents of Pythora have a quirky, playful taste: they occasionally write functional programs that run flawlessly but read like puzzles, enjoying the challenge of deciphering them.

Ultimately, while a single programming paradigm is enough to solve any problem, different styles are not mutually exclusive. Modern programming languages are rarely single-paradigm. Most blend paradigms to capture the strengths of each. In Python, it is common and highly effective to integrate functional techniques like recursion and anonymous functions into procedural or object-oriented codebases.
