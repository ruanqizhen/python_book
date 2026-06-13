# Functional Programming

## Programming Paradigms

A programming paradigm is a style or approach of programming languages that provides models for solving problems and methods for organizing code. Different programming paradigms offer different perspectives on viewing computation, organizing data, and structuring functions.

Python is a multi-paradigm programming language that mainly supports the following three:

- **Procedural Programming**: Based on the concepts of "instructions" and "procedures." It treats a program as a series of steps executed sequentially, processing data like a ledger. This is the most intuitive way of programming, and most of the example programs we have demonstrated earlier adopt this approach.

- **Functional Programming (FP)**: Emphasizes the use of pure functions to process data, avoiding the modification of state and the use of mutable data. It is more like formula derivation in mathematics, and this is the focus we will introduce next. Before learning functional programming, readers are strongly encouraged to first read an introduction to [Lambda Calculus](https://lv.qizhen.xyz/appendix_languages#lambda-calculus-编程语言) as a programming language. Lambda Calculus is the mathematical origin of functional programming. Although its syntax is extremely minimal, it perfectly embodies the essence of functional programming.

- **[Object-Oriented Programming (OOP)](oop)**: The core idea is to encapsulate data together with the methods that operate on that data. Its main purpose is to improve the maintainability and scalability of large-scale programs. We will cover this in detail in a later chapter.

Beyond these three paradigms supported by Python, many other programming languages adopt various and diverse programming paradigms. For instance, one notable example is the dataflow-oriented programming paradigm adopted by the [LabVIEW programming language](https://lv.qizhen.xyz).

## Characteristics of Functional Programming

In functional programming, functions are no longer just units for organizing code; they are first-class citizens. This means functions can be treated like integers or strings: assigned to variables, passed as arguments to other functions, or returned as values from other functions.

This characteristic fundamentally changes the way code is written:

1. **Declarative rather than Imperative**: Procedural programming focuses on "How" — it requires detailed descriptions of variable modifications and loop control at each step. In contrast, functional programming focuses on "What" — it describes the mapping relationships between data through the composition of functions.
2. **No Side Effects and Immutability**: In pure functional programming, modifying the state of variables is discouraged. Once created, data cannot be changed (it is immutable). If data needs to be modified, a function returns a new copy of the data rather than directly altering the original variable. This is like the mathematical formula y = f(x): no matter how many times it is called, as long as x remains unchanged, y will always be the same, and it will not affect the external environment.
3. **Higher-Order Functions**: Since functions can be passed as arguments, we can write "functions that operate on functions," known as higher-order functions. This makes code extremely abstract and concise. For the same logic, procedural programming might require ten lines of loop code, while functional programming might only need a single line of function composition.

From a purely code perspective, a clear difference between procedural programming and functional programming is that procedural programming relies heavily on variables, loops, and other control structures. Changes in variable data reflect changes in the program's state, i.e., switching between different procedures. Structures like loops and conditionals are responsible for jumping the program between these different procedures. In contrast, pure functional programming does not require variables, nor does it need various control structures. The program consists only of calls between functions. Data is passed into one function for processing, and the result (the function's return value) is then passed as an argument to another function for further processing.

Compared to procedural programming, functional programming is more abstract and can make code very concise and clean. The trade-off is that it is harder to understand, especially for programmers who are not yet familiar with functional programming. For the same logic, in a procedural program, it might be a few sequential lines of code that align with a person's natural reading habits. In functional programming, however, it would be expressed as nested, multiple function calls, where the logic becomes implicit and less intuitive under several layers of function wrapping. When deciding whether to use functional programming methods, in addition to considering the logic itself, one must also consider whether collaborators can easily understand and write code in the same style.

However, getting to this part is what the inhabitants of the planet Pythora are truly interested in. The residents of planet Pythora have a somewhat dark and quirky taste: they occasionally deliberately write code that runs correctly but reads strangely, just to enjoy watching others scratch their heads while trying to decipher it.

Although adopting a single programming paradigm is sufficient to solve all programming problems, different paradigms are not mutually exclusive. Currently, mainstream programming languages rarely adopt only one programming paradigm. Most emphasize one or two paradigms while also incorporating the advantages of others. When writing programs, we do not need to restrict ourselves to a single programming paradigm. It is also very common to intersperse some typical functional programming techniques, such as recursion and anonymous functions, into primarily procedural code.
