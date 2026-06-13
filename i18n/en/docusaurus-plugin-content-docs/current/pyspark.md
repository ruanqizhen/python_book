# Distributed Data Processing and PySpark

Before reading this chapter, readers are advised to first learn SQL query statements, as this will make it easier to understand the example programs in the text.

PySpark is the Python API for Apache Spark. Apache Spark is a powerful distributed data processing framework designed for large-scale data processing and data analysis. Through PySpark, Python developers can conveniently perform large-scale data analysis and data mining without needing to delve into the complexities of distributed computing.

PySpark mainly includes the following components:

* **Spark SQL**: A library for executing SQL queries and reading data, supporting multiple data formats and storage systems.
* **DataFrame API**: Provides a distributed data collection, making data processing and analysis more intuitive and efficient.
* **MLlib**: A library for machine learning.
* **GraphX**: A library for graph processing (accessed in PySpark through third-party libraries such as GraphFrames).
* **Spark Streaming**: A library for real-time data stream processing.

Database querying is the most commonly used feature, so this chapter mainly introduces database queries.

## Configuring the PySpark Runtime Environment

### Installing PySpark

To use PySpark, you first need to install Spark. You can install PySpark via pip:

```sh
pip install pyspark

```

Connecting PySpark to databases is typically done through JDBC (Java Database Connectivity), which is a Java API for executing SQL operations that allows you to access almost any relational database from Spark programs. Spark itself is written in Java, and PySpark is simply a layer of Python interface functions wrapped around Spark. So when using PySpark, it still calls the underlying Java libraries. Therefore, in addition to installing PySpark itself, you also need the JDBC driver for your target database. For example, if you want to connect to a MySQL database, you need to download the MySQL JDBC driver and place it in the classpath.

### Creating and Closing a SparkSession

SparkSession is a concept introduced after Spark 2.0. It serves as the entry point for program execution, used to configure various Spark settings (such as master URL) and initialize Spark applications.

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .appName("DatabaseTableExample") \
    .config("spark.some.config.option", "some-value") \
    .getOrCreate()

```

Once we have the `spark` object, we can use it to call various Spark features. The specific features available will be introduced in detail later.

At the end of the program, don't forget to close the SparkSession.

```python
spark.stop()

```

### Using PySpark in AWS

AWS has integrated PySpark into many of its services, making it very convenient to use directly. The two most commonly used services are AWS Glue and AWS Athena. Glue has more complex functionality and can handle various data integration tasks, while Athena focuses on data querying and processing. Both services provide a programming environment similar to [Jupyter Notebook](https://www.google.com/search?q=ide%23%E5%9F%BA%E4%BA%8E%E7%BD%91%E9%A1%B5%E7%9A%84%E7%BC%96%E7%A8%8B%E7%8E%AF%E5%A2%83), and they have built-in management of SparkSession, so users no longer need to configure it themselves. In the programming environment they provide, `spark` is already a directly usable global object—just call it directly. The example programs below were all debugged in the AWS Athena Notebook.

### Connecting to and Opening a Database

In AWS services, if you have already created a "Database" and "Table", you can use them directly. For example, if we have a database called "my_db" and a table called "my_table", running the following code will print the contents of the table:

```python
spark.sql("use my_db")  # Open the database named my_db
spark.sql(              # Call SQL statement to query the contents of my_table
    """
    SELECT *
    FROM my_table 
    """
).show()                # Call the show method to print the data in the table

```

The usage of the sql method will be elaborated on later. The show method is used to display the queried data. By default, it displays the first 20 rows of data. If you need to show more rows, simply pass the desired number of rows, for example `show(30)`.

In AWS services, data in databases is stored as files in the S3 service. So in many cases, we don't need to configure databases and tables; we can directly read data from files. For example, if a table is stored in parquet format (one of the most commonly used data storage formats on AWS) at the path "s3://my_bucket/my_db/my_table/" in an S3 folder, you can use the following statement to read the data:

```python
df = spark.read.parquet("s3://my_bucket/my_db/my_table/")

```

If you are not using AWS services but running PySpark on your own computer, connecting to a database is a bit more complex. You can connect to a database through the `jdbc` method of the `DataFrameReader` class. We need to specify the JDBC connection URL, username and password, and the table name to access:

```python
# Database connection parameters
jdbc_url = "jdbc:mysql://my_database_host:port/database_name"
connection_properties = {
    "user": "my_database_username",
    "password": "my_database_password",
    "driver": "com.mysql.jdbc.Driver"
}

# Read database table
df = spark.read.jdbc(url=jdbc_url, table="my_table_name", properties=connection_properties)

```

## Two Ways to Write PySpark Programs

We can write PySpark code in two distinctly different styles: one is to directly use SQL statements, and the other is to directly call the APIs provided by PySpark. Let's take a minimal program as an example to see how these two approaches differ. Suppose we have two tables: one is the `student_info` table, which records student IDs, names, home addresses, and other information; the other is the `quize_score` table, which records student IDs and their scores on a particular exam. Merging the data from both tables gives us a new table that includes student names and scores.

The program written with Spark SQL statements is as follows:

```python
spark.sql("""
    SELECT student_info.name, quize_score.score
    FROM student_info
    JOIN quize_score
    ON student_info.student_id = quize_score.student_id
""").show()

```

The code implementing the same functionality using the PySpark API is as follows:

```python
student_info.join(
    quize_score, student_info.student_id == quize_score.student_id
).select(
    student_info.name, quize_score.score
).show()

```

The biggest advantage of using SQL statements directly is that the same SQL statements can be executed in different environments. For example, when using AWS Athena, the same SQL can be used both in Athena Notebook programs and directly run in the Athena Query interactive environment, offering excellent portability. However, when Spark executes a program, it first translates the SQL statements into its own API calls before execution. Users have no control over this translation process, and Spark's translation may not be optimal for certain problems. If you write programs directly using the Spark API, you have more flexibility and can design the most optimized program according to your needs.

## Basic Operations

If you are already familiar with the SQL query language, switching to the Spark API is very easy—basically every SQL statement has a corresponding Spark API. Below are some of the most commonly used methods.

### Selecting Columns

Selecting certain columns from a table is one of the fundamental steps in data processing. PySpark uses the `select()` method for column selection, which is equivalent to the SELECT statement in SQL. For example, to select columns named "name" and "age" from a table called df, you can use the following code:

```python
selected_data = df.select("name", "age")
selected_data.show()

```

### Filtering Data

The `filter()` and `where()` methods in PySpark have exactly the same functionality; both are used to filter data based on conditions, equivalent to the WHERE statement in SQL. For example, to select all entries where the "age" column data is greater than 30, you can use the following code:

```python
filtered_data = df.filter(df["age"] > 30)
# Or filtered_data = df.where(df["age"] > 30)
filtered_data.show()

```

### Data Transformations

We can also perform computations on data when selecting it. For example, we can add a new column to the data where the values are the result of adding 10 to the "age" column data:

```python
from pyspark.sql import functions as F

transformed_data = df.select("name", "age", (F.col("age") + 10).alias("age_plus_ten"))
transformed_data.show()

```

### Joining Tables

Join refers to merging data from different tables based on specified conditions. PySpark supports multiple types of join operations, including:

* Inner Join (JOIN): Returns only the rows where the join keys match in both tables
* Left Outer Join (LEFT OUTER JOIN): Returns all rows from the left table, even if there are no matching rows in the right table. If there is no match in the right table, the right table's columns will return null
* Right Outer Join (RIGHT OUTER JOIN): Returns all rows from the right table, even if there are no matching rows in the left table
* Full Outer Join (FULL OUTER JOIN): Returns all rows from both tables. If there is no match on one side, the columns on that side will return null
* Cross Join (CROSS JOIN): Returns the Cartesian product of both tables, with each row from the left table combined with every row from the right table

For example, the following program will return all rows where the id exists in both tables:

```python
inner_join_df = df1.join(df2, df1.id == df2.id, how='inner')
inner_join_df.show()

```

### Basic Aggregation Operations

The `groupBy()` method, used in conjunction with aggregate functions, can achieve functionality similar to `GROUP BY` in SQL. Common aggregate functions include `count()`, `sum()`, `avg()`, `max()`, `min()`, etc.:

```python
from pyspark.sql import functions as F

# Group by department and calculate average salary
department_avg = df.groupBy("department").agg(F.avg("salary").alias("avg_salary"))
department_avg.show()

# Multi-column aggregation: calculate total employees and max salary per department
department_stats = df.groupBy("department") \
                     .agg(F.count("*").alias("total_employees"),
                          F.max("salary").alias("max_salary"))
department_stats.show()

```

The equivalent SQL implementation is more concise:

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

### Window Functions

Window Functions allow calculations to be performed on specific subsets (windows) of a dataset while preserving the number of rows in the original data. Common use cases include ranking, cumulative sums, moving averages, etc.:

```python
from pyspark.sql.window import Window

# Define window: partition by department and order by salary descending
window_spec = Window.partitionBy("department").orderBy(F.desc("salary"))

# Calculate salary rank within department
ranked_df = df.withColumn("rank", F.rank().over(window_spec))
ranked_df.show()

# Calculate cumulative salary (adjust window range from first row to current row)
cumulative_window = window_spec.rowsBetween(Window.unboundedPreceding, Window.currentRow)
cumulative_df = df.withColumn("cumulative_salary", F.sum("salary").over(cumulative_window))
cumulative_df.show()

```

The corresponding SQL syntax is closer to traditional database usage:

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

### Exploding Arrays

The `explode()` function is used to expand array-type columns into multiple rows. This is very useful when dealing with nested arrays or when you need to decompose a column of a single complex data type into multiple rows of data. For example, suppose we have a table where the data in the items column is of array type:

```python
from pyspark.sql import Row
from pyspark.sql.functions import explode

# Create a DataFrame with an array-type column
data = [Row(name="Alice", items=["apple", "banana", "orange"]),
        Row(name="Bob", items=["watermelon", "peach"])]
df = spark.createDataFrame(data)
df.show()

```

Running the above program will show the data in df:

```
+-----+-----------------------+
| name|                  items|
+-----+-----------------------+
|Alice|[apple, banana, orange]|
| Bob |    [watermelon, peach]|
+-----+-----------------------+

```

Calling the `explode()` function transforms each array element into an independent row, copying the values of other columns outside the array:

```python
exploded_df = df.select(df.name, explode(df.items).alias("item"))
exploded_df.show()

```

The exploded result is as follows:

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

### Data Sorting and Deduplication

Sorting and deduplication are key steps in data cleaning:

```python
# Sort by multiple columns: first by department ascending, then by salary descending
sorted_df = df.orderBy(F.asc("department"), F.desc("salary"))

# Remove duplicate records (all columns identical)
distinct_df = df.distinct()

# Deduplicate by specific column
deduplicated_df = df.dropDuplicates(["employee_id"])

```

## User-Defined Functions

The built-in functionality of PySpark and the SQL language is quite limited. In most practical applications, we need to write some User Defined Functions (UDFs) to extend functionality.

For example, when querying a database, we might want to reverse the order of the first and last names in the "name" string and display them in a "last-first" format. Although PySpark's built-in functions do not include this capability, we can create a UDF to achieve this. After that, we can call this function in every query. Creating a PySpark UDF is very simple—just add the `@udf` [decorator](https://www.google.com/search?q=decorator) to a regular Python function to define it as a UDF.

Below is the demonstration code for implementing this functionality:

```python
from pyspark.sql.functions import udf
from pyspark.sql.types import StringType
from pyspark.sql.functions import initcap

columns = ["id", "name"]
data = [("1", "john jones"), ("2", "tracey smith"), ("3", "AMY sanders")]
df = spark.createDataFrame(data=data, schema=columns)

@udf(returnType=StringType())               # Using the @udf decorator requires specifying the return data type
def format_name(name):                      # First define the udf function name, then implement the specific functionality
    first_name, last_name = name.split()
    return f"{last_name}·{first_name}"

# The program calls two functions on the name data: initcap capitalizes the first letter of each word, and the udf format_name adjusts the display format
df = df.withColumn("name", format_name(initcap(df["name"])))

df.show(truncate=False)

```

Running the above example yields the following result:

```
+---+------------+
|id |name        |
+---+------------+
|1  |Jones·John  |
|2  |Smith·Tracey|
|3  |Sanders·Amy |
+---+------------+

```

You can also register the UDF for use in Spark SQL, for example:

```python
spark.udf.register("format_name", format_name, StringType())

```

## Data Writing and Persistence

After data processing is complete, the results typically need to be persisted. PySpark supports multiple output formats and storage systems.

### Writing to a Database

Data can be written to a relational database through the `jdbc` method of `DataFrameWriter`:

```python
# Overwrite mode to write to database
df.write.mode("overwrite") \
        .jdbc(url=jdbc_url, table="processed_data", properties=connection_properties)

# Append mode to write to partitioned table
df.write.mode("append") \
        .option("truncate", "true") \
        .jdbc(url=jdbc_url, table="partitioned_data", properties=connection_properties)

```

### Saving to a File System

PySpark supports file output in formats such as Parquet, CSV, and JSON. In AWS environments, data is typically written directly to S3:

```python
# Parquet format write (auto-partitioned)
df.write.partitionBy("year", "month") \
        .parquet("s3://my_bucket/analytics/output/")

# CSV format write (with compression specified)
df.write.option("compression", "gzip") \
        .csv("s3://my_bucket/csv_output/")

```

### Registering Temporary Views

When working across multiple data processing steps, you can register a DataFrame as a temporary view for SQL query reuse:

```python
df.createOrReplaceTempView("processed_view")

spark.sql("""
    SELECT department, MAX(salary) 
    FROM processed_view 
    GROUP BY department
""").show()

```

## Performance Optimization Tips

### Caching Mechanism

For DataFrames that need to be accessed multiple times, caching can reduce redundant computation:

```python
# Cache to memory (default storage level)
df.cache()

# Serialized memory cache (reduces memory usage)
from pyspark import StorageLevel
df.persist(StorageLevel.MEMORY_AND_DISK)

# Release cache
df.unpersist()

```

### Partition Optimization

Setting the number of partitions appropriately can significantly improve parallel processing efficiency:

```python
# Adjust shuffle partition count (default is 200)
spark.conf.set("spark.sql.shuffle.partitions", "100")

# Repartition an existing DataFrame
repartitioned_df = df.repartition(100, "department")

# Write with column-based partitioning (improves subsequent query performance)
df.write.partitionBy("country") \
        .parquet("s3://my_bucket/partitioned_by_country/")

```

### Broadcast Variables

When performing join operations between a small dataset and a large table, using broadcast variables can avoid data skew:

```python
small_df = spark.read.parquet("s3://my_bucket/small_dataset/")
broadcast_df = F.broadcast(small_df)

# Broadcast join (automatically handles tables smaller than 10MB; threshold can be adjusted via parameters)
joined_df = large_df.join(broadcast_df, "key_column")

```

## Debugging and Error Handling

### Execution Plan Analysis

Use the `explain()` method to view the query execution plan and optimize complex operations:

```python
df.groupBy("department").count().explain(extended=True)

```

The output will show detailed information such as the logical plan and physical plan, helping to identify performance bottlenecks.

### Exception Handling

In a distributed environment, it is recommended to use `try-except` blocks to catch exceptions and log errors:

```python
import logging
logging.basicConfig(level=logging.INFO)

try:
    df.write.parquet("s3://my_bucket/output/")
except Exception as e:
    logging.error(f"写入失败: {str(e)}")
    # Perform rollback or retry logic

```
