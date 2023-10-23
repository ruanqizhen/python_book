# 调试


## 断言

断言是 Python 中的一个调试辅助工具。它的核心思想是：开发人员认为某些表达式在程序的特定点一定是 True。如果这些表达式的值为 False，则 Python 会引发一个 AssertionError 异常。

断言是通过 assert 语句来完成的，其后跟一个要被测试的表达式。如果该表达式的结果为 False，则会触发一个异常。

```python
def apply_discount(product_price, discount):
    final_price = product_price * (1.0 - discount)
    assert 0 <= final_price <= product_price, "Invalid final price"
    return final_price
```	
	
在上面的例子中，我们期望 final_price 始终介于 0 和 product_price 之间。如果不是这样，断言将失败，并引发一个 AssertionError。

断言提供了一种明确地声明你对代码行为的期望的方法。如果程序中存在问题，断言可以早期捕获它们，而不是让错误影响到程序的其它部分。断言可以确保函数的调用者提供了正确的参数或确保某些预条件得到满足。

需要注意的是不要过度使用断言，否则可能会使代码难以阅读和维护。断言可以被全局地禁用，在全局优化模式下（使用 -O 命令行开关），所有断言语句都会被全局地删除。因此，我们不能依赖断言来进行数据验证或在生产代码中实现任何关键逻辑。
