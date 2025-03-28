# 函数式编程

## 编程范式

编程范式（Programming Paradigm）是一种编程语言的风格或方法，它提供了解决问题的模型和组织代码的方法。不同的编程范式提供了不同的方法来看待计算和组织数据与函数。选择适当的编程范式可以使特定的问题或任务更容易解决。Python 编程主要会用到三种编程范式，分别是：面向过程编程、函数式编程、面向对象编程。

面向过程编程（Procedural Programming）基于过程的概念来组织代码。面向过程编程把程序视为一系列的过程或函数，这些过程或函数处理数据、执行计算或完成特定的任务。这是一种直观的编程方式，让程序依次完成一个任务后再执行下一个任务。我们之前所演示的各种示例程序，基本上都采用了面向过程的编程方式。

函数式编程（Functional Programming，FP）强调使用函数来处理数据并产生结果，而不是改变或管理状态。函数式编程是我们接下来要介绍的重点。在学习函数式编程前，强烈建议读者先阅读一段关于 [Lambda Calculus 编程语言的介绍](https://lv.qizhen.xyz/appendix_languages#lambda-calculus-编程语言)。Lambda Calculus 是函数式编程的源头，它的语法本身极度简单，但却完美体现了函数式编程语言的精髓。


[面向对象编程](oop)的主要目的是提升大规模程序的可维护性和可扩展性。我们将在之后的一部分专门介绍它。

除了 Python 支持的这三种编程范式，在其它编程语言中还存在着五花八门，各式各样的编程范式。比如，一个比较有特色的： [LabVIEW 编程语言](https://lv.qizhen.xyz)所采用的面向数据流的编程范式。

## 函数式编程的特点

函数（function）在每一种编程范式中都是不可或缺的重要角色，但是在函数式编程中，它的地位更为至关重要，一切逻辑都是围绕函数来编写的。

仅从代码角度来看，面向过程编程与函数式编程的明显区别在于，面向过程编程十分依赖变量与循环等结构。变量数据的变化反映了程序状态的改变，即不同过程的切换。而循环、条件等结构则负责程序在不同过程之间的跳转。而纯粹的函数式编程是不需要变量的，也不必使用各种结构，程序中就只有函数之间的调用。数据被传入一个函数进行处理，处理结果也就是函数的返回值，会再被作为参数传递给其它函数去做进一步处理。

相比于面向过程编程，函数式编程更加抽象，可以让代码变得非常简洁、干净。其代价是更不容易理解，尤其是对于还不熟悉函数式编程的程序员。同样的逻辑，在面向过程的程序中可能是顺序的几行代码，符合人的自然阅读习惯；而在函数式编程中，它会被表达成嵌套的多次函数调用，逻辑在多层函数包装下变得非常隐晦，不那么直观。编程时，是否使用函数式编程的方法，除了考虑逻辑本身，还需要考虑合作者是否能够容易地理解并写出同样风格的代码。

然而，进入到这一部分，才是 Pythora 星球居民们真正感兴趣的部分。Pythora 星球居民都有一些阴暗的恶趣味：偶尔会故意写一些运行正确，但读起来莫名其妙的代码，就是为了看别人在读程序时抓耳挠腮的样子。

尽管采用一种编程范式就足以解决所有编程问题，但是不同的范式之间不是相互排斥的，当前主流的编程语言都不会只采用一种编程范式。大多是偏重某一两种编程范式，同时也尽量吸取采纳其它编程范式的优点。我们在编写程序的时候也不必拘泥于某一种单一编程范式，在以面向过程为主的代码中插入一些典型的函数式编程方法，比如递归、匿名函数等也是非常普遍的用法。

