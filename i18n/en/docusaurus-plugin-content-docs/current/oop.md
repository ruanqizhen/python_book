# Object-Oriented Programming

![](images/015.png)

The handsome guy in the picture is programming "object"-ively...

If we were to explain in one sentence why we need Object-Oriented Programming (OOP), it would be: OOP can effectively break a large program into smaller modules, helping us create a system that is both flexible and stable. Flexibility is reflected in the ability to add new features at any time; stability is reflected in the fact that when adding new features, existing program modules do not need to be changed.

As software scales up, we need more efficient ways to manage complex systems. Although procedural programming and functional programming each have their own excellent modularization mechanisms, Object-Oriented Programming (OOP) provides a very intuitive and powerful perspective when dealing with complex state management and simulating real-world business logic.

The core idea of OOP is to bind data (state) together with the behaviors (methods) that operate on that data, forming "objects." This approach effectively reduces coupling between modules, helping us create a system that is both flexible and stable. In terms of flexibility: extend functionality through inheritance and polymorphism. In terms of stability: encapsulation mechanisms protect internal logic, reducing the side effects of code changes.

## Program Module Division

When adopting a procedural programming mindset, a program is viewed as a collection of procedures or functions. The program controls the execution of these functions through writing order, conditions, loops, and other structures. When designing a program using procedural programming, the most natural approach is top-down design.

For example, a program needs to complete a testing task. When designing this program, the overall framework is first designed. This testing program can be divided into several procedures: data collection, data analysis, data display, data storage, etc. Therefore, the program's main function should contain the sub-functions that complete these tasks. Next, these sub-functions are designed separately, meaning these tasks are further subdivided. For instance, data collection can consist of the following procedures: opening hardware devices, setting up hardware devices, reading data back from hardware devices, closing hardware devices, etc.

In this way, a program is naturally divided into multiple modules at different levels. The larger the program scale, the greater the number of program modules. Since different programs and different parts of the same program often have some similarities, to improve development efficiency, some program modules are reused in multiple parts of a program, or even across different programs.

It is inevitable that programs continue to grow in scale. Large programs have high complexity and large codebases, requiring collaboration among multiple people, and it is very likely that each developer only knows a small part of the program in detail. However, during development, if a programmer finds they can use existing code to accomplish the required functionality, they will generally use it directly. Furthermore, requirements can change at any time, and each time requirements change, it is impossible to completely redesign the entire program structure from the top level — existing program modules must be accommodated.

Therefore, once a large program is completed, one often finds that the calling relationships between its modules are no longer the well-structured tree-like hierarchy originally designed. The hierarchical relationships between modules may become chaotic, making it difficult for developers and users to fully understand the specific usage scenarios and methods of each module.

Once a module needs to be changed, problems arise. After a program module has been written, the developer may discover some minor issues or have new requirements that necessitate changing its functionality. The module's developer or maintainer then directly modifies it according to the new requirements. However, they do not know that this module has already been used by other programmers in other parts of the program, and in ways the module's developer or maintainer did not anticipate. Once the module is modified, other parts of the program that use it may no longer function correctly. The module's users may not know that the module has been changed, and identifying the cause of program errors can require considerable effort.

The reuse of code and modules is inevitable in large programs. A significant portion of the difficulty in developing and maintaining large programs stems from this chaotic use of modules. To solve this problem, we must find a better way to design and implement modules. The interfaces of program modules should be very clear, and module users should be able to easily understand what data and methods a module has. The use of modules should be restricted. For example, certain methods in a module can be used by other programs, while methods that may change in the future or could cause problems should not be made public and should be forbidden from use by other programs. Modules should also be easily upgradeable, optimizable, and extendable with new features. Problems such as these can all be solved using the object-oriented programming approach.

## Classes and Objects

The real world is composed of various entities. For example, a room contains entities such as a table, a chair, a computer, etc. Some entities share many commonalities and can be classified into the same **class**. For instance, "Human" is a class, and the person "Ruan Qizhen" is an entity within the Human class. Entities within the Human class share common characteristics, such as walking on two legs, being able to speak, being able to think, etc.

Computer software is designed to solve real-world problems or simulate aspects of the real world. In programming, similar situations exist. For example, when writing management software for a company, there are multiple employees: Zhang San, Li Si, Wang Er Mazi, etc. These employees share common characteristics that need to be handled by the program, such as name, gender, age, etc., although the values of these characteristics may differ.

An **object** is an entity belonging to a particular class and is sometimes directly referred to as an **instance**. For example, in the above case, each specific employee (such as Zhang San) is an object of the Employee class.

**Attributes** are often called **data** or **variables**, and they describe the static state of an object. For example, instances of the Employee class, i.e., each employee, need attributes such as name, gender, and age.

**Methods** are often called **functions** and describe the actions of an object. For example, instances of the Employee class might have methods such as working overtime, receiving salary, etc.

## Object-Oriented Programming Design

The object-oriented programming approach means developing programs using objects as the basic modules, rather than dividing modules by program functions or procedures as in procedural programming. Using objects as the basic modules of a program improves reusability, flexibility, and extensibility.

Object-oriented programming has three main characteristics: encapsulation, inheritance, and polymorphism.

### Encapsulation (Data Abstraction)

**Encapsulation** refers to grouping highly related data and methods together to form a relatively independent module (class).

External programs can only access the data of this module through strictly defined public interfaces (Public Methods). Internal details that do not need external access (Private Data) are hidden and protected, like a black box. In this way, internal modifications to the object do not affect external users, greatly improving the maintainability of the system.

For example, suppose we need to design a program that simulates the daily lives of several small animals. When designing the program, the behaviors and characteristics of all small animals can be abstracted into an "Animal" class. This class includes some public attributes, such as age, origin, name, etc. It can also include some public methods, i.e., animal behaviors, such as eating, moving, making sounds, etc. This Animal class also has some internal attributes and methods that can only be used within the class and cannot be called by other programs outside the class. For instance, to make an animal walk a few steps, the movement method of the Animal class can be called. Internally, this method actually calls a private attribute of the class: "number of legs," and this attribute cannot be directly modified or read by programs outside the class.

### Inheritance

**Inheritance** allows us to define new classes (subclasses) based on existing classes (parent classes). A subclass automatically acquires the attributes and methods of the parent class, while also being able to define its own unique characteristics. This not only avoids code duplication but also establishes a clear hierarchical relationship, enabling us to model real-world classifications.

For example, consider a program that contains several puppies and several chicks, all of which are instances of the Animal class. However, the puppies also share some characteristics unique to them. To improve code reusability, these commonalities should also be abstracted to form a subclass, the "Dog" class.

The Dog class possesses all the attributes and methods of the Animal class. Therefore, when defining the Dog class, we first declare it as a subclass of the Animal class. This way, the Dog class immediately has all the public attributes and methods of the Animal class. Then, we just add some special attributes and methods for dogs, such as dogs "guarding the house," chickens "laying eggs," etc.

Subclasses are often also called **derived classes**; parent classes can also be called **base classes** or **superclasses**. A parent class, its parent class, and so on up the hierarchy are collectively called **ancestor classes**. Correspondingly, a subclass, its subclasses, and so on down the hierarchy are collectively called **descendant classes**.

### Polymorphism (Dynamic Binding)

**Polymorphism** was originally a genetics concept, referring to the fact that different organisms originating from the same ancestor can exhibit multiple different forms.

In object-oriented programming, polymorphism means that the same behavior (method) can have different forms of expression on different objects. In programming, polymorphism allows us to use a unified interface to operate on objects of different types.

Although subclasses share many of the same methods inherited from the parent class, their implementations can be different. When calling these methods, the parent class name can be used to invoke them. Thus, even though the program calls the same method, because the objects belong to different subclasses, their behavior will differ. Using polymorphism allows us to, to some extent, ignore the differences between similar modules in an application and call them in a unified way.

For example, suppose several subclasses all inherit a method "makeSound" from the parent class "Animal." However, the implementation code for "makeSound" is different for different subclasses: dogs bark, roosters crow. In this way, when the application needs to make a group of animals sound off one by one, all animals can be treated as instances of the Animal class, using the same code to call the "makeSound" method of each instance. When the program runs to this point, it automatically determines whether the instance being processed belongs to the "Dog" subclass or the "Chicken" subclass, and then calls the "makeSound" method of the Dog or Chicken class respectively, producing either a barking sound or a crowing sound.

The key point is: the programmer writing the "makeSound" function does not need to care whether the input is a dog or a chicken — they only need to call the unified "makeSound" method. The program determines the actual type of the object at runtime and executes the corresponding code (this is called dynamic binding). This greatly improves the program's extensibility — if you later add a "Duck" class, you don't need to modify the "makeSound" function; the duck will make its sound correctly as well.
