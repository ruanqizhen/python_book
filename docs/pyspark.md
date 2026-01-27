# 分布式数据处理和 PySpark

在阅读这一章节之前，建议读者首先学习 SQL 查询语句，这样会更容易理解文中的示例程序。

PySpark 是 Apache Spark 的 Python API。Apache Spark 是一个强大的分布式数据处理框架，专用于大规模数据处理和数据分析。通过 PySpark，Python 开发者，即便不去深入了解分布式计算的复杂性，也可以方便地进行大规模数据分析和数据挖掘工作。

PySpark 主要包含以下这些组件：

* **Spark SQL**：用于执行 SQL 查询以及读取数据的库，支持多种数据格式和存储系统。
* **DataFrame API**：提供了一个分布式数据集合，使得数据处理和分析更加直观和高效。
* **MLlib**：用于进行机器学习的库。
* **GraphX**：用于图形处理的库（在 PySpark 中通过第三方库如 GraphFrames 访问）。
* **Spark Streaming**：用于实时数据流处理的库。

其中数据库查询是最为常用的功能，所以我们这一章主要介绍数据库查询。

## 配置 PySpark 的运行环境

### 安装 PySpark

要使用 PySpark，首先需要安装 Spark。可以通过 pip 安装 PySpark：

```sh
pip install pyspark

```

PySpark 与数据库连接通常是通过 JDBC（Java Database Connectivity）完成的，JDBC 是一种用于执行 SQL 操作的 Java API，可以让你从 Spark 程序中访问几乎所有的关系型数据库。Spark 本身是使用 Java 语言编写的，PySpark 只是为 Spark 包装了一层 Python 接口函数。所以在使用 PySpark 的时候，还是会调用到底层的 Java 库。所以，除了安装 PySpark 本身之外，还需要有目标数据库的 JDBC 驱动程序。例如，如果想连接到 MySQL 数据库，那么需要下载 MySQL 的 JDBC 驱动并将其放在类路径中。

### SparkSession 创建和关闭

SparkSession 是 Spark 2.0 以后引入的概念，它是程序执行的入口，用于配置 Spark 的各种设置（如 master URL）和初始化 Spark 应用。

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .appName("DatabaseTableExample") \
    .config("spark.some.config.option", "some-value") \
    .getOrCreate()

```

拿到 `spark` 这个对象之后，我们就可以通过它来调用 Spark 的各种功能了。具体有哪些功能后文会详细介绍。

在程序的最后，不要忘记关闭 SparkSession。

```python
spark.stop()

```

### 在 AWS 中使用 PySpark

AWS 在很多服务中都已经集成了 PySpark，可以直接使用，非常方便。最为常用的两个服务一个是 AWS Glue；另一个是 AWS Athena。Glue 功能比较繁杂，可完成各类数据集成服务；Athena 则专注于数据查询和处理。这两个服务都提供了类似 [Jupyter Notebook](https://www.google.com/search?q=ide%23%E5%9F%BA%E4%BA%8E%E7%BD%91%E9%A1%B5%E7%9A%84%E7%BC%96%E7%A8%8B%E7%8E%AF%E5%A2%83) 的编程环境，并且它们内置了对 SparkSession 的管理，用户不再需要自己配置。在它们提供的编程环境中， `spark` 已经是一个直接可用的全局对象，直接调用即可。下文中的示例程序都是在 AWS Athena Notebook 中调试的。

### 连接和打开数据库

在 AWS 的服务中，如果已经创建好了“数据库”(Database)和“表格”(Table)，那么就可以直接使用了。比如我们已经有了一个名为“my_db”的数据库，和一张名为“my_table”的表格，那么运行下面的代码就可以打印出表格中的内容了：

```python
spark.sql("use my_db")  # 打开名为 my_db 的数据库
spark.sql(              # 调用 SQL 语句，查询 my_table 表格中的内容
    """
    SELECT *
    FROM my_table 
    """
).show()                # 调用 show 方法打印表格中的数据

```

关于 sql 方法的使用，下文还会详细阐述。show 方法用于显示查询得到的数据，默认情况下，它显示数据的前 20 行。如果需要多显示一些行，只要把需要行数传入即可比如 `show(30)`。

在 AWS 服务中，数据库中的数据都是以文件形式，保存在 S3 服务中的，所以很多时候，我们不需要配置数据库和表格，直接从文件读取数据即可。比如，某一表格，以 parquet 的格式（AWS 上最常用的一种数据库存储格式）保存在路径为“s3://my_bucket/my_db/my_table/”的 S3 文件夹中，那么就可以使用下面的语句，读取数据：

```python
df = spark.read.parquet("s3://my_bucket/my_db/my_table/")

```

如果不是在 AWS 服务上，而是自己的电脑中运行 PySpark，连接数据库要稍微复杂一下。可以通过 `DataFrameReader` 类的 `jdbc` 方法连接数据库，我们需要指定 JDBC 连接的 URL，用户名和密码，以及要访问的表名：

```python
# 数据库连接参数
jdbc_url = "jdbc:mysql://my_database_host:port/database_name"
connection_properties = {
    "user": "my_database_username",
    "password": "my_database_password",
    "driver": "com.mysql.jdbc.Driver"
}

# 读取数据库表
df = spark.read.jdbc(url=jdbc_url, table="my_table_name", properties=connection_properties)

```

## PySpark 程序的两种编写方法

我们可以采用两种风格迥然不同的方式来编写 PySpark 代码，一种是直接使用 SQL 语句，另一种方式是直接调用 PySpark 提供的 API。我们以一个最简的程序为例，来看看这两种写法有什么不同。假设我们已经有了两张表格，一张是 `student_info` 表，里面记录了学生的学号、姓名、家庭地址等信息；另一张表是 `quize_score`，里面记录了学生的学号，以及某次考试成绩。合并两张表的数据就可以得到一个新的表，包括学生姓名和成绩。

通过 Spark SQL 语句编写的程序如下：

```python
spark.sql("""
    SELECT student_info.name, quize_score.score
    FROM student_info
    JOIN quize_score
    ON student_info.student_id = quize_score.student_id
""").show()

```

使用 PySpark API 实现同样功能的代码如下：

```python
student_info.join(
    quize_score, student_info.student_id == quize_score.student_id
).select(
    student_info.name, quize_score.score
).show()

```

直接调用 SQL 语句最大的好处是，可以直接把 SQL 语句拿到不同的环境中去执行。比如说在使用 AWS Athena 服务的时候，同样的 SQL 即可以在 Athena Notebook 程序中使用，也可以直接在 Athena Query 的交互环境中运行，可移植性非常好。不过 Spark 在执行程序的时候，是要先把 SQL 语句翻译成自身的 API 调用再执行的。用户无法控制这一翻译的过程，也许 Spark 的翻译对于某些问题并不是最优化的方式。如果直接使用 Spark API 编写程序，可以更加灵活，可以根据需求设计出最优化的程序。

## 基本操作

如果已经熟悉了 SQL 查询语言，切换成 Spark API 是非常容易的，基本上每个 SQL 语句都有与之相对应的 Spark API。下面介绍一些最为常用的方法。

### 选取列

选取表格中的某些列是数据处理的基础步骤之一。PySpark 使用 `select()` 方法进行列选取，相当于 SQL 语言中的 SELECT 语句。比如从一个名为 df 的表选择名为 "name" 和 "age" 的列，可以使用如下程序：

```python
selected_data = df.select("name", "age")
selected_data.show()

```

### 过滤数据

PySpark 中的 `filter()` 和 `where()` 方法功能完全相同，都是用来基于条件过滤数据，相当于 SQL 语言中的 WHERE 语句。比如，选取所有 "age" 列数据大于 30 的条目可以使用下面的代码：

```python
filtered_data = df.filter(df["age"] > 30)
# 或者 filtered_data = df.where(df["age"] > 30)
filtered_data.show()

```

### 数据运算

我们还可以在选择数据的时候，对其进行运算处理。例如，我们可以把数据增加一列，列中的数据是  "age" 列数据加 10 的结果：

```python
from pyspark.sql import functions as F

transformed_data = df.select("name", "age", (F.col("age") + 10).alias("age_plus_ten"))
transformed_data.show()

```

### 连接表

连接（join）是指把不同表格中的数据根据指定的条件合并起来。PySpark 支持多种类型的连接操作，包括:

* 内连接（JOIN）：只返回两个表格中连接键匹配的行
* 左外连接（LEFT OUTER JOIN）：返回左表的所有行，即使在右表中没有匹配的行。如果右表中没有匹配，右表的列将返回 null
* 右外连接（RIGHT OUTER JOIN）：返回右表的所有行，即使在左表中没有匹配的行
* 外连接（FULL OUTER JOIN）：返回两个表格中所有行。如果某一侧没有匹配，则该侧的列将返回 null
* 交叉连接（CROSS JOIN）：返回两个表格的笛卡尔积，每个左表行与右表的每行组合

比如下面的程序，将会返回所有两个表中都包含的 id 所在的行：

```python
inner_join_df = df1.join(df2, df1.id == df2.id, how='inner')
inner_join_df.show()

```

### 基本聚合操作

`groupBy()` 方法与聚合函数配合使用，可以实现类似 SQL 中 `GROUP BY` 的功能。常见的聚合函数包括 `count()`、`sum()`、`avg()`、`max()`、`min()` 等：

```python
from pyspark.sql import functions as F

# 按部门分组计算平均薪资
department_avg = df.groupBy("department").agg(F.avg("salary").alias("avg_salary"))
department_avg.show()

# 多列聚合：计算每个部门的总人数和最高薪资
department_stats = df.groupBy("department") \
                     .agg(F.count("*").alias("total_employees"),
                          F.max("salary").alias("max_salary"))
department_stats.show()

```

对应的 SQL 实现方式更加简洁：

```python
spark.sql("""
    SELECT department, 
           AVG(salary) AS avg_salary,
           COUNT(*) AS total_employees,
           MAX(salary) AS max_salary
    FROM employees
    GROUP BY department
""").show()

```

### 窗口函数

窗口函数（Window Functions）允许在数据集的特定子集（窗口）上进行计算，同时保留原始数据的行数。常见的应用场景包括排名、累计求和、移动平均等：

```python
from pyspark.sql.window import Window

# 定义窗口：按部门分区并按薪资降序排列
window_spec = Window.partitionBy("department").orderBy(F.desc("salary"))

# 计算部门内薪资排名
ranked_df = df.withColumn("rank", F.rank().over(window_spec))
ranked_df.show()

# 计算累计薪资（需调整窗口范围为从第一行到当前行）
cumulative_window = window_spec.rowsBetween(Window.unboundedPreceding, Window.currentRow)
cumulative_df = df.withColumn("cumulative_salary", F.sum("salary").over(cumulative_window))
cumulative_df.show()

```

对应的 SQL 语法更贴近传统数据库使用习惯：

```python
spark.sql("""
    SELECT department, 
           salary,
           RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rank,
           SUM(salary) OVER (PARTITION BY department ORDER BY salary DESC 
                             ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_salary
    FROM employees
""").show()

```

### 展开

`explode()` 函数用于将数组类型的列展开成多行，这在处理嵌套数组或需要将单个复杂数据类型的列分解为多行数据时非常有用。比如我们有一张表，其中的 items 列中的数据是数组类型：

```python
from pyspark.sql import Row
from pyspark.sql.functions import explode

# 创建一个包含数组类型列的 DataFrame
data = [Row(name="Alice", items=["apple", "banana", "orange"]),
        Row(name="Bob", items=["watermelon", "peach"])]
df = spark.createDataFrame(data)
df.show()

```

运行上面程序，会看到 df 中的数据：

```
+-----+-----------------------+
| name|                  items|
+-----+-----------------------+
|Alice|[apple, banana, orange]|
| Bob |    [watermelon, peach]|
+-----+-----------------------+

```

调用 `explode()` 函数将每个数组元素转换为独立的行，复制数组外的其他列值：

```python
exploded_df = df.select(df.name, explode(df.items).alias("item"))
exploded_df.show()

```

展开的结果如下：

```
+-----+----------+
| name|      item|
+-----+----------+
|Alice|     apple|
|Alice|    banana|
|Alice|    orange|
| Bob |watermelon|
| Bob |     peach|
+-----+----------+

```

### 数据排序与去重

排序和去重是数据清洗的关键步骤：

```python
# 按多列排序：先按部门升序，再按薪资降序
sorted_df = df.orderBy(F.asc("department"), F.desc("salary"))

# 去除重复记录（所有列完全相同）
distinct_df = df.distinct()

# 按特定列去重
deduplicated_df = df.dropDuplicates(["employee_id"])

```

## 用户自定义函数

PySpark 以及 SQL 语言内置的功能都是非常有限的，在大多数实际应用中，我们都需要编写一些用户自定义函数（User Defined Functions 缩写 UDF）来扩展功能。

比如我们在查询一个数据库的时候，希望将“name”字符串中的姓和名顺序颠倒，并按照“姓·名”的格式显示。虽然 PySpark 内置函数中没有这个功能，但是，我们可以创建一个 UDF 实现这一功能。之后就可以在每一次查询中都调用这个功能了。创建 PySpark UDF 的方法非常简单，给一个普通的 Python 函数添加上 `@udf` [装饰器](https://www.google.com/search?q=decorator) 就可以把它定义为一个 UDF。

下面是实现这一功能的演示代码

```python
from pyspark.sql.functions import udf
from pyspark.sql.types import StringType
from pyspark.sql.functions import initcap

columns = ["id", "name"]
data = [("1", "john jones"), ("2", "tracey smith"), ("3", "AMY sanders")]
df = spark.createDataFrame(data=data, schema=columns)

@udf(returnType=StringType())               # 使用 @udf 装饰器需要指定函数返回值的数据类型
def format_name(name):                      # 首先定义 udf 的函数名，然后实现具体功能
    first_name, last_name = name.split()
    return f"{last_name}·{first_name}"

# 程序对 name 数据调用了两个函数，initcap 实现的单词首字母大写，udf format_name 调整了显示格式
df = df.withColumn("name", format_name(initcap(df["name"])))

df.show(truncate=False)

```

运行上面示例，得到的结果为：

```
+---+------------+
|id |name        |
+---+------------+
|1  |Jones·John  |
|2  |Smith·Tracey|
|3  |Sanders·Amy |
+---+------------+

```

还可以通过注册，在 Spark SQL 中使用 udf，比如：

```python
spark.udf.register("format_name", format_name, StringType())

```

## 数据写入与持久化

数据处理完成后，通常需要将结果持久化存储。PySpark 支持多种输出格式和存储系统。

### 写入到数据库

通过 `DataFrameWriter` 的 `jdbc` 方法可将数据写入关系型数据库：

```python
# 覆盖模式写入数据库
df.write.mode("overwrite") \
        .jdbc(url=jdbc_url, table="processed_data", properties=connection_properties)

# 追加模式写入分区表
df.write.mode("append") \
        .option("truncate", "true") \
        .jdbc(url=jdbc_url, table="partitioned_data", properties=connection_properties)

```

### 保存到文件系统

PySpark 支持 Parquet、CSV、JSON 等格式的文件输出。在 AWS 环境中，数据通常直接写入 S3：

```python
# Parquet 格式写入（自动分区）
df.write.partitionBy("year", "month") \
        .parquet("s3://my_bucket/analytics/output/")

# CSV 格式写入（指定压缩方式）
df.write.option("compression", "gzip") \
        .csv("s3://my_bucket/csv_output/")

```

### 注册临时视图

在跨多个数据处理步骤时，可以将 DataFrame 注册为临时视图以便 SQL 查询复用：

```python
df.createOrReplaceTempView("processed_view")

spark.sql("""
    SELECT department, MAX(salary) 
    FROM processed_view 
    GROUP BY department
""").show()

```

## 性能优化技巧

### 缓存机制

对于需要多次访问的 DataFrame，可通过缓存减少重复计算：

```python
# 缓存到内存（默认存储级别）
df.cache()

# 带序列化的内存缓存（减少内存占用）
from pyspark import StorageLevel
df.persist(StorageLevel.MEMORY_AND_DISK)

# 释放缓存
df.unpersist()

```

### 分区优化

合理设置分区数可显著提升并行处理效率：

```python
# 调整 shuffle 分区数（默认200）
spark.conf.set("spark.sql.shuffle.partitions", "100")

# 对已有 DataFrame 重新分区
repartitioned_df = df.repartition(100, "department")

# 按列分区写入（提升后续查询性能）
df.write.partitionBy("country") \
        .parquet("s3://my_bucket/partitioned_by_country/")

```

### 广播变量

当需要在小数据集与大表进行连接操作时，使用广播变量可避免数据倾斜：

```python
small_df = spark.read.parquet("s3://my_bucket/small_dataset/")
broadcast_df = F.broadcast(small_df)

# 广播连接（自动处理小于10MB的表，可通过参数调整阈值）
joined_df = large_df.join(broadcast_df, "key_column")

```

## 调试与错误处理

### 执行计划分析

通过 `explain()` 方法查看查询执行计划，优化复杂操作：

```python
df.groupBy("department").count().explain(extended=True)

```

输出结果将展示逻辑计划、物理计划等详细信息，帮助识别性能瓶颈。

### 异常处理

在分布式环境中，建议使用 `try-except` 块捕获异常并记录日志：

```python
import logging
logging.basicConfig(level=logging.INFO)

try:
    df.write.parquet("s3://my_bucket/output/")
except Exception as e:
    logging.error(f"写入失败: {str(e)}")
    # 执行回滚或重试逻辑

```
