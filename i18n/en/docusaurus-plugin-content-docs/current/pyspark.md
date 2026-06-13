# Distributed Data Processing and PySpark

Before reading this chapter, readers are advised to first learn SQL query statements, as this will make it easier to understand the example programs in the text.

PySpark is the Python API for Apache Spark, a powerful distributed data processing engine designed for large-scale data analytics and machine learning. With PySpark, Python developers can perform large-scale data analysis and data mining efficiently, utilizing distributed computing without needing to manage its low-level complexities.

PySpark consists of several key components:

* **Spark SQL**: A library for executing SQL queries and reading data, supporting multiple data formats and storage systems.
* **DataFrame API**: Provides a distributed data collection, making data processing and analysis more intuitive and efficient.
* **MLlib**: A library for machine learning.
* **GraphX**: A library for graph processing (accessed in PySpark through third-party libraries such as GraphFrames).
* **Spark Streaming**: A library for real-time data stream processing.

Because querying datasets is the most common use case, this chapter focuses primarily on data queries and manipulations.

## Setting Up the PySpark Environment

### Installing PySpark

To use PySpark, you can install the package using `pip`:

```sh
pip install pyspark

```

Connecting PySpark to relational databases is typically done via JDBC (Java Database Connectivity). Because Apache Spark is built on the Java Virtual Machine (JVM), PySpark acts as a Python wrapper that communicates with the underlying Java libraries. To connect to a database (such as MySQL or PostgreSQL), you must download the database's JDBC driver and include it in Spark's classpath.

### Managing a SparkSession

Introduced in Spark 2.0, `SparkSession` is the main entry point for Spark applications. It is used to configure Spark settings, manage resources, and interact with Spark APIs:

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .appName("DatabaseTableExample") \
    .config("spark.some.config.option", "some-value") \
    .getOrCreate()

```

With the `SparkSession` instantiated, you can load data, execute queries, and perform analytical tasks.

Be sure to stop the SparkSession when your program finishes to release resources:

```python
spark.stop()

```

### Running PySpark on AWS

AWS integrates PySpark across many of its serverless analytics tools. The two most common options are AWS Glue (for data integration and ETL pipelines) and AWS Athena (for interactive data analysis). Both services provide notebook environments based on [Jupyter Notebook](ide.md#web-based-programming-environments) where the `SparkSession` is pre-configured. In these notebooks, a global `spark` object is automatically initialized and ready to use.

### Connecting to Databases and Tables

If you are running within AWS Athena, you can query registered tables directly. For example, if you have a database `my_db` and a table `my_table` in your data catalog, you can run:

```python
spark.sql("use my_db")  # Open the database named my_db
spark.sql(              # Call SQL statement to query the contents of my_table
    """
    SELECT *
    FROM my_table 
    """
).show()                # Call the show method to print the data in the table

```

The `sql()` method executes SQL queries, while `.show()` prints the resulting DataFrame. By default, `.show()` displays the first 20 rows. You can display more rows by passing an integer, such as `.show(30)`.

Under the hood, AWS databases store data in Amazon S3. Instead of defining formal table catalogs, you can read files directly from S3 paths. For example, to read a dataset stored in the optimized Parquet format:

```python
df = spark.read.parquet("s3://my_bucket/my_db/my_table/")

```

If you are running Spark locally or on-premise, you can load tables from a relational database using Spark's JDBC reader. You must specify the database URL, driver class, and access credentials:

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

## Spark SQL vs. DataFrame API

PySpark code can be written in two distinct styles: using raw SQL queries with Spark SQL, or using Pythonic method calls with the DataFrame API. Let's compare these approaches using a simple example. Suppose we have two datasets: `student_info` (student metadata) and `quiz_score` (exam results). We want to join them on student ID to retrieve student names and their respective scores.

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

The primary advantage of Spark SQL is portability. The same SQL query can be run in Athena Notebooks, interactive SQL consoles, or other database clients. Under the hood, Spark parses and translates SQL statements into DataFrame execution plans. Using the DataFrame API directly, however, gives you finer programmatic control and can make complex dynamic queries easier to modularize in Python code.

## Common DataFrame Operations

If you are familiar with SQL, transitioning to the DataFrame API is straightforward. Almost every SQL clause has a corresponding DataFrame method. Here are the most common operations:

### Selecting Columns

The `.select()` method projects specific columns from a DataFrame, equivalent to the `SELECT` clause in SQL:

```python
selected_data = df.select("name", "age")
selected_data.show()

```

### Filtering Data

The `.filter()` and `.where()` methods are aliases and perform identical conditional filtering, equivalent to the SQL `WHERE` clause:

```python
filtered_data = df.filter(df["age"] > 30)
# Or filtered_data = df.where(df["age"] > 30)
filtered_data.show()

```

### Data Transformations

You can apply transformations and rename columns during selection using functions and column aliases:

```python
from pyspark.sql import functions as F

transformed_data = df.select("name", "age", (F.col("age") + 10).alias("age_plus_ten"))
transformed_data.show()

```

### Joining Tables

Joins combine columns from two DataFrames based on a matching key. PySpark supports all standard join types:

* Inner Join (JOIN): Returns only the rows where the join keys match in both tables
* Left Outer Join (LEFT OUTER JOIN): Returns all rows from the left table, even if there are no matching rows in the right table. If there is no match in the right table, the right table's columns will return null
* Right Outer Join (RIGHT OUTER JOIN): Returns all rows from the right table, even if there are no matching rows in the left table
* Full Outer Join (FULL OUTER JOIN): Returns all rows from both tables. If there is no match on one side, the columns on that side will return null
* Cross Join (CROSS JOIN): Returns the Cartesian product of both tables, with each row from the left table combined with every row from the right table

For example, to perform an inner join on the `id` column:

```python
inner_join_df = df1.join(df2, df1.id == df2.id, how='inner')
inner_join_df.show()

```

### Basic Aggregation Operations

The `.groupBy()` method groups rows by one or more columns so you can calculate group-level metrics using aggregation functions (e.g., `count`, `sum`, `avg`, `max`):

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

The equivalent SQL query is often more concise for complex aggregations:

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

Window functions calculate values across a partition of rows associated with the current row, without collapsing the dataset. They are ideal for ranking, cumulative sums, and moving averages:

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

The equivalent SQL syntax uses the standard `OVER` clause:

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

The `explode()` function transforms a column containing arrays into individual rows, flattening the dataset while repeating the values of non-array columns:

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

Applying `explode()` on the `items` column yields:

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

Sorting and removing duplicates are fundamental to data preparation:

```python
# Sort by multiple columns: first by department ascending, then by salary descending
sorted_df = df.orderBy(F.asc("department"), F.desc("salary"))

# Remove duplicate records (all columns identical)
distinct_df = df.distinct()

# Deduplicate by specific column
deduplicated_df = df.dropDuplicates(["employee_id"])

```

## User-Defined Functions

When built-in SQL and DataFrame functions are not enough, you can write User-Defined Functions (UDFs) to apply custom Python code to your data.

For example, to split a full name string, reverse the order of first and last names, and format it as `LastName·FirstName`, you can write a standard Python function and wrap it as a UDF using the `@udf` decorator. (See the [decorator](decorator.md) chapter for details on decorators).

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

You can also register UDFs to make them accessible inside SQL query strings:

```python
spark.udf.register("format_name", format_name, StringType())

```

## Data Writing and Persistence

After processing, you can write the results back to database systems, file systems, or register them for further queries.

### Writing to a Database

Write DataFrames back to relational databases via JDBC:

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

Save DataFrames directly to cloud storage (like Amazon S3) or local filesystems in optimized formats:

```python
# Parquet format write (auto-partitioned)
df.write.partitionBy("year", "month") \
        .parquet("s3://my_bucket/analytics/output/")

# CSV format write (with compression specified)
df.write.option("compression", "gzip") \
        .csv("s3://my_bucket/csv_output/")

```

### Registering Temporary Views

For multi-step analysis, register a DataFrame as a temporary view so you can query it in subsequent SQL statements:

```python
df.createOrReplaceTempView("processed_view")

spark.sql("""
    SELECT department, MAX(salary) 
    FROM processed_view 
    GROUP BY department
""").show()

```

## Performance Optimization Tips

### Caching Data

If you query or reuse the same DataFrame multiple times, caching keeps it in memory, bypassing expensive recomputations:

```python
# Cache to memory (default storage level)
df.cache()

# Serialized memory cache (reduces memory usage)
from pyspark import StorageLevel
df.persist(StorageLevel.MEMORY_AND_DISK)

# Release cache
df.unpersist()

```

### Partitioning and Reshuffling

Managing partitions is crucial for optimizing parallel processing speed and network overhead:

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

When joining a small lookup table with a massive dataset, broadcasting the small table to all worker nodes avoids expensive data shuffles (network transfers):

```python
small_df = spark.read.parquet("s3://my_bucket/small_dataset/")
broadcast_df = F.broadcast(small_df)

# Broadcast join (automatically handles tables smaller than 10MB; threshold can be adjusted via parameters)
joined_df = large_df.join(broadcast_df, "key_column")

```

## Debugging and Error Handling

### Execution Plan Analysis

Inspect the execution plan using `.explain()` to diagnose bottlenecks and ensure Spark is optimizing your queries correctly:

```python
df.groupBy("department").count().explain(extended=True)

```

The output will show detailed information such as the logical plan and physical plan, helping to identify performance bottlenecks.

### Exception Handling

Because Spark jobs run on a distributed cluster, catch exceptions and log failures explicitly using standard Python logging libraries:

```python
import logging
logging.basicConfig(level=logging.INFO)

try:
    df.write.parquet("s3://my_bucket/output/")
except Exception as e:
    logging.error(f"写入失败: {str(e)}")
    # Perform rollback or retry logic

```
