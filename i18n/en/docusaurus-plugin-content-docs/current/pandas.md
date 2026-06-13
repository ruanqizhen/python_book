# Data Analysis and Pandas

Pandas is one of the core libraries for data analysis in Python. It offers powerful and efficient capabilities for data manipulation, cleaning, and analysis, particularly when working with tabular data.

## Installation

Pandas is a third-party package. If you haven't installed it yet, you can install it with the following command:

```sh
pip install pandas
```

To use Pandas, you first need to import it:

```python
import pandas as pd
```

In the example code below, some import statements are omitted. You will need to add them yourself when testing.

## DataFrame Data Structure

In Pandas, the most central and widely used data structure is the `DataFrame`. A `DataFrame` is a two-dimensional, tabular data structure that is conceptually similar to an Excel spreadsheet or a relational database table. It represents data in rows and columns, where different columns can hold different data types (such as integers, floats, strings, and booleans). We frequently use DataFrames to load, inspect, and manipulate data from databases or flat files like CSV and TSV.

### Creating a Simple DataFrame

For example, the program below:

```python
import pandas as pd
# Create a DataFrame
data = {'Name': ['范统', '夏建仁', '李拜天'],
        'Age': [20, 21, 19]}
df = pd.DataFrame(data)

# Display the DataFrame
print(df)
```

Output:

```
  Name  Age
0   范统   20
1  夏移各   21
2  李拜天   19
```

The example program above creates a DataFrame named `df` with two columns and three rows.

The columns of a `DataFrame` represent the features or variables of the dataset. Each column has a name (such as `Name` and `Age` in the example above) that serves as its label, collectively forming the column index. While different columns can store different data types, all values within a single column must share the same type. You can access, add, modify, or delete columns dynamically using their names.

The rows of a `DataFrame` represent individual data records. Each row contains a set of related values corresponding to each column, identified by a row index label. Rows can be accessed either by their position (integer offset starting from 0, like a standard list or array) or by their index label. Like columns, rows can be added, updated, or removed dynamically. The index is an immutable sequence that identifies each row, playing a crucial role in operations like merging, joining, aligning, and grouping data.

### Index

By default, a `DataFrame` uses auto-incrementing integers starting from 0 as its row index, but you can also use dates, strings, or other custom identifiers. For instance, you can pass an `index` argument (like `index=['a', 'b', 'c']`) when instantiating a `DataFrame` to define custom row labels:

```
   Name  Age
a   范统   20
b  夏移各   21
c  李拜天   19
```

We can also use the `set_index` method to set one or more columns as the index. For example, `df.set_index('Name', inplace=True)` will set the `Name` column as the index, and the data becomes:

```
       Age
Name     
范统     20
夏移各    21
李拜天    19
```

### Creating an Empty DataFrame

You can create an empty `DataFrame` using `pd.DataFrame()` and populate it later. The following example demonstrates how to create an empty `DataFrame` with a predefined schema (column names and data types):

```python
import pandas as pd

# Define column names and data types
data_types = {
    'Name': 'object'  # object is typically used for strings
    'age': 'int64',
}

# Create an empty DataFrame
empty_df = pd.DataFrame(columns=data_types.keys()).astype(data_types)
```

### Viewing DataFrame Information

Here are some of the most useful attributes and methods for inspecting a `DataFrame` depending on the type of information you need:

1. **Viewing the shape of the DataFrame**: Use the `.shape` attribute to quickly view the number of rows and columns in the DataFrame.
   ```python
   df.shape
   ```

2. **Viewing column data types**: Use the `.dtypes` attribute to view the data type of each column in the DataFrame.
   ```python
   df.dtypes
   ```

3. **Viewing the first few rows**: Use the `.head(n)` method to view the first n rows of the DataFrame, with the default being the first 5 rows.
   ```python
   df.head()
   ```

4. **Viewing summary information**: Use the `.info()` method to view a summary of the DataFrame, including the data type of each column and the number of non-null values.
   ```python
   df.info()
   ```

5. **Descriptive statistics**: Use the `.describe()` method to generate a descriptive statistical summary for each column, including mean, standard deviation, minimum, maximum, etc.
   ```python
   df.describe()
   ```

### Other Data Structures

Pandas also provides other data structures, though they are used less frequently than `DataFrame`. We will only briefly highlight the `Series` object:

A `Series` is a one-dimensional labeled array capable of holding any data type. It represents a single column of data. Like a `DataFrame`, it has an index that allows for label-based lookup. While a `Series` is size-immutable (its length cannot be changed once created), its values are mutable and can be modified in place.

```python
import pandas as pd

# Create a Series
s = pd.Series([1, 3, 5, 7, 9], index=['a', 'b', 'c', 'd', 'e'])

# Access data
print(s['c'])  # Output: 5
```


## Reading and Writing Files and Databases

Pandas provides a rich set of I/O functions that make importing and exporting data simple and efficient. It supports a wide variety of common file formats and databases, including CSV, Excel, JSON, HTML, and SQL.

### Reading and Writing CSV and TSV Files

CSV (Comma-Separated Values) and TSV (Tab-Separated Values) are the most common plain-text formats for storing tabular data. In a CSV file, columns are separated by commas, whereas in a TSV file, they are separated by tabs. The `pd.read_csv()` function can read both formats simply by configuring the delimiter.

Key parameters of `pd.read_csv()` include:
- `filepath_or_buffer`: The path to the file or a file-like object.
- `sep`: The field delimiter, default is `,`.
- `header`: The row number used as the column names, default is `0` (first row).
- `index_col`: The column number or name to use as the row index.
- `usecols`: A subset of columns to return.
- `dtype`: The data type for the columns.

Suppose we have a file named `data.tsv` with the following content:

```txt title="data.tsv"
Name	Age	City
杜其演	24	上海
宋外麦	19	北京
```

The code to read this file would be:

```python
df = pd.read_csv('data.tsv', sep='\t')
print(df)
```

Because the input file includes a header line, we rely on the default `header=0`. If the file does not contain header names, you should specify `header=None` and pass a list of column names using the `names` parameter (e.g., `names=['Name', 'Age', 'City']`).

The output of the program above is:

```
    Name  Age    City
0   杜其演   24    上海
1   宋外麦   19    北京
```

Exporting data to a text file is just as straightforward using the `to_csv()` method. Its parameters mirror those of `read_csv()`:

- `path_or_buf`: The file path or a file-like object. If no path is specified, the result is returned as a string.
- `sep`: The delimiter between fields, default is comma `,`.
- `index`: Whether to write row indices to the file, default is `True`. Usually set to `False` unless you need the row index as part of the data.
- `header`: Whether to write column names (header), default is `True`.
- `columns`: A list of column names to write to the file.
- `encoding`: Specifies the encoding format of the file, default is `'utf-8'`.

To save a `DataFrame` as a CSV file, call:

```python
df.to_csv('my_data.csv', index=False)
```

### Reading and Writing Excel Files

Pandas also supports reading and writing Microsoft Excel files. Since Pandas relies on external engines to parse Excel formats, you will need to install helper libraries first:

```sh
# For handling .xlsx files
pip install pandas openpyxl
# For handling .xls files
pip install pandas xlrd
```

Once installed, you can use `read_excel()` and `to_excel()` to handle `.xls` and `.xlsx` files. Their arguments are very similar to those of the CSV methods, with the addition of the `sheet_name` parameter (which specifies the target worksheet and defaults to `'Sheet1'`):

```python
import pandas as pd

# Create an example DataFrame
data = {'Name': ['姜米调', '高丽黛', '钱泰少'],
        'Age': [25, 30, 35],
        'City': ['上海', '北京', '西安']}
df = pd.DataFrame(data)

# Write the DataFrame to an Excel file
df.to_excel('my_data.xlsx', index=False)

# Read the worksheet named 'Sheet1'
df_2 = pd.read_excel('file.xlsx', sheet_name='Sheet1')

# Display the DataFrame
print(df_2)
```

The program above writes the DataFrame data to an Excel file, and then reads the data back from the file into a new DataFrame.

### Reading and Writing SQL Databases

To connect Pandas to databases, install the database connector libraries first:

```sh
pip install sqlalchemy pymysql pyhive
```

Pandas provides `read_sql()`, `read_sql_query()`, and `read_sql_table()` to query databases. These functions require a SQLAlchemy connection engine:

```python
from sqlalchemy import create_engine

# Create a database engine
# Example is for SQLite database; connection string formats for other databases may differ
engine = create_engine('sqlite:///mydatabase.db')

# For Hive database, similar code: engine = create_engine('hive://hostname:port/database')
```

Once the engine is created, you can query tables or run custom SQL commands:

```python
import pandas as pd

# Use an SQL query
df = pd.read_sql("SELECT * FROM my_table", con=engine)

# Or read directly from a table
df = pd.read_sql_table("my_table", con=engine)
```

Use the `to_sql()` method to write `DataFrame` contents to a database table:

```python
df.to_sql("my_table", con=engine, if_exists='replace', index=False)
```

The `if_exists` parameter controls the behavior if the target table already exists: `'fail'` raises an error, `'replace'` overwrites the table, and `'append'` appends the new rows.

Ensure the connection string matches your database backend (incorporating username, password, host, port, and database name), and verify that the `DataFrame` schema matches the table structure.

### Other File Formats

Pandas also supports JSON, HTML tables, XML, parquet, and more. Their usage pattern is similar (e.g., `read_json()` and `to_json()`), and you can explore them in the official Pandas documentation.



## Selecting and Querying Data

### Selecting Columns

You can select columns using single strings or lists of column names:

```python
# Select a single column by column name:
series = df['Name']

# Select multiple columns:
new_df = df[['Name', 'Age']]
```

### Selecting Rows

You can retrieve rows using label-based indexing with `.loc[]` or integer position-based indexing with `.iloc[]`:

```python
import pandas as pd

# Create an example DataFrame
data = {'Name': ['刘备', '关羽', '张飞'],
        'Age': [40, 35, 30],
        'City': ['涿郡', '解县', '涿郡']}
df = pd.DataFrame(data)

# Set the City column as the index
df.set_index('City', inplace=True)

# Select rows by row number
print(df.iloc[0])      # Output the first row
print(df.iloc[0, 2])   # Output the first and third rows

# Select rows by index
print(df.loc['涿郡'])   # Output the two rows with '涿郡' as the index
```

Note: If your DataFrame index contains duplicate labels, `.loc[]` will return multiple rows matching that label.

### Slicing

DataFrame slicing is very similar to list slicing. Because tabular data typically contains far more rows than columns, standard bracket slicing defaults to selecting rows:

```python
import pandas as pd

# Create an example DataFrame
data = {'Name': ['刘备', '关羽', '张飞'],
        'Age': [40, 35, 30],
        'City': ['涿郡', '解县', '涿郡']}
df = pd.DataFrame(data)

# Slice rows by row number
print(df[:2])           # Slice the first two rows

# Slice by row and column numbers
print(df.iloc[:2, 1:])  # Slice the first two rows and the last two columns
```

### Boolean Indexing (Filtering)

You can filter rows by passing boolean conditions inside the brackets:

```python
import pandas as pd

# Create an example DataFrame
data = {'Name': ['赵云', '黄忠', '马超'],
        'Age': [25, 60, 30],
        'City': ['常山', '南阳', '茂陵']}
df = pd.DataFrame(data)

print(df[df['Age'] > 25])          # Select rows where age is greater than 25
print(df[df['City'] == '南阳'])     # Select rows where the city is '南阳'

print(df[df['Age'] > 25] & df['City'] == '南阳'])  # Select rows where age is greater than 25 and city is '南阳'

print(df[df['Age'] > 25]['Name'])  # Combine row condition with column selection
```

### Accessing a Single Value

We can use `at` with the index and column name, or `iat` with the row and column numbers, to access a single element:

```python
import pandas as pd

data = {'Name': ['孙权', '刘表', '曹操'],
        'Born': ['182', '142', '155'],
        'Died': ['252', '208', '220']}
df = pd.DataFrame(data)

# Set the Name column as the index
df.set_index('Name', inplace=True)

# Access an element using at
sunquan_born = df.at['孙权', 'Born']
print("Sun Quan's birth year:", sunquan_born)

# Access an element using iat
liubiao_died = df.iat[1, 1]
print("Liu Biao's death year:", liubiao_died)
```

### Iteration

In real-world applications, you often need to iterate over the rows of a `DataFrame` to perform row-by-row computations or logic.

#### Iterating Over Columns

Iterating directly over a `DataFrame` yields its column names. To access the underlying series, look them up by column name:

```python
import pandas as pd

df = pd.DataFrame({'A': [1, 2, 3], 'B': [4, 5, 6]})

for col in df:
    print(f"Column: {col}, Data: {df[col].tolist()}")
    
# Output:
# Column: A, Data: [1, 2, 3]
# Column: B, Data: [4, 5, 6]
```

For row-by-row iteration, Pandas provides several specialized methods.

#### Iterating Rows with iterrows

`iterrows()` is a generator that yields an `(index, Series)` tuple for each row. It is simple but can be slow for large DataFrames because it constructs a new `Series` for each row.

```python
import pandas as pd

df = pd.DataFrame({'A': [1, 2, 3], 'B': [4, 5, 6]})

for index, row in df.iterrows():
    print(f"Index: {index}, A: {row['A']}, B: {row['B']}")
    
# Output:
# Index: 0, A: 1, B: 4
# Index: 1, A: 2, B: 5
# Index: 2, A: 3, B: 6    
```

This method may not be very efficient for large DataFrames, as each row returns a Series object.

#### Iterating Rows with itertuples

`itertuples()` yields a named tuple for each row, which is significantly faster and more memory-efficient than `iterrows()`:

```python
import pandas as pd

df = pd.DataFrame({'A': [1, 2, 3], 'B': [4, 5, 6]})

for row in df.itertuples():
    print(f"Index: {row.Index}, A: {row.A}, B: {row.B}")
    
# Output is identical to the example above
```

Note that the row's index is accessed via the `.Index` attribute of the named tuple.


#### Using the apply() Function

Alternatively, you can use `.apply()` to apply a function across an axis (rows or columns). This is often cleaner and more idiomatic than explicit loops:

```python
import pandas as pd

df = pd.DataFrame({'A': [1, 2, 3], 'B': [4, 5, 6]})
def process(row):
    print(f"A: {row['A']}, B: {row['B']}")

df.apply(process, axis=1)

# Output:
# A: 1, B: 4
# A: 2, B: 5
# A: 3, B: 6    
```

## Adding and Deleting Data

### Adding Columns

You can add a new column by assigning values to a new column name:

```python
import pandas as pd

# Create an example DataFrame
df = pd.DataFrame({'A': [1, 2, 3], 'B': [4, 5, 6]})

# Add a new column
df['C'] = [7, 8, 9]

print(df)
```

Output:
```
   A  B  C
0  1  4  7
1  2  5  8
2  3  6  9
```

### Adding Rows

Note: The `append()` method has been deprecated in recent versions of Pandas. The modern, recommended way to add rows is to create a new `DataFrame` and concatenate it with the original using `pd.concat()`:

```python
# Create a DataFrame containing multiple new rows
new_rows = pd.DataFrame({'A': [5, 6], 'B': [8, 9], 'C': [11, 12]})

# Call concat to merge the original DataFrame with the new DataFrame
df = pd.concat([df, new_rows], ignore_index=True)
```

### Deleting Rows and Columns

To delete rows or columns, use `df.drop()`. The `labels` parameter specifies the targets to remove, and the `axis` parameter defines whether they are rows (`axis=0` or `'index'`) or columns (`axis=1` or `'columns'`):

Let's illustrate with an example DataFrame:

```python
import pandas as pd

# Create an example DataFrame
data = {
    'A': [1, 2, 3, 4, 4],
    'B': [5, 6, None, 8, 8],
    'C': [10, 11, 12, 13, 13]
}
df = pd.DataFrame(data)

print(df)
```

Output:

```
   A    B   C
0  1  5.0  10
1  2  6.0  11
2  3  NaN  12
3  4  8.0  13
4  4  8.0  13
```

Running the program below prints the data with column 'B' deleted:

```python
print(df.drop(['B'], axis=1))
```

Output:

```
   A   C
0  1  10
1  2  11
2  3  12
3  4  13
4  4  13
```

Running the program below deletes rows 0 and 2:

```python
print(df.drop([0, 2]))
```

Output:

```
   A    B   C
1  2  6.0  11
3  4  8.0  13
4  4  8.0  13
```

#### Conditional Deletion

You can drop rows conditionally by filtering them out. For example, to remove all rows where column `A` equals 4, select all rows where `A != 4`:

```python
print(df[df['A'] != 4])
```

Output:

```
   A    B   C
0  1  5.0  10
1  2  6.0  11
2  3  NaN  12
```

To quickly remove all rows containing missing values (`NaN`), use `df.dropna()`:

```python
print(df.dropna())
```

Output:

```
   A    B   C
0  1  5.0  10
1  2  6.0  11
3  4  8.0  13
4  4  8.0  13
```

To remove duplicate rows, use `df.drop_duplicates()`:

```python
print(df.drop_duplicates())
```

Output:

```
   A    B   C
   A    B   C
0  1  5.0  10
1  2  6.0  11
2  3  NaN  12
3  4  8.0  13
```


## Data Merging

Pandas provides powerful tools to combine multiple DataFrames. While `pd.concat()` simply stacks or glues DataFrames together, `pd.merge()` and `.join()` perform relational database-style joins. Specifically, `pd.merge()` joins on key columns, whereas `.join()` joins on row indices.

Key parameters of `pd.merge()` include:
- `left` and `right`: The two DataFrames to merge.
- `on`: The column name to join on. If not specified, Pandas uses the common column names in both DataFrames.
- `left_on` and `right_on`: The join keys for the left and right DataFrames respectively, used when column names differ.
- `how`: Specifies how to merge. Values can be `'inner'` (inner join, the default, keeping only rows that exist in both tables), `'outer'` (outer join, keeping all rows), `'left'` (left join, keeping rows from the left table), or `'right'` (right join, keeping rows from the right table).

```python
import pandas as pd

df1 = pd.DataFrame({'key': ['K0', 'K1', 'K2', 'K3'],
                    'A': ['A0', 'A1', 'A2', 'A3']})

df2 = pd.DataFrame({'key': ['K0', 'K1', 'K4', 'K5'],
                    'B': ['B0', 'B1', 'B4', 'B5']})

result = pd.merge(df1, df2, on='key')

print(result)
```

This example performs an inner join on the `key` column. Rows with matching keys in both DataFrames are kept, and columns from both tables are combined:

```
  key   A   B
0  K0  A0  B0
1  K1  A1  B1
```

Key parameters of `.join()` include:
- `other`: One or more DataFrames to join.
- `on`: The column name or index level name to join on. If joining on columns, that column must be the index column.
- `how`: Specifies how to merge. Values can be `'left'` (default), `'right'`, `'outer'`, or `'inner'`, with the same usage as the `how` parameter in the `merge()` function.

```python
import pandas as pd

df3 = pd.DataFrame({'A': ['A0', 'A1', 'A2'],
                    'B': ['B0', 'B1', 'B2']},
                   index=['K0', 'K1', 'K2'])

df4 = pd.DataFrame({'C': ['C0', 'C2', 'C3'],
                    'D': ['D0', 'D2', 'D3']},
                   index=['K0', 'K2', 'K3'])

result = df3.join(df4, how='outer')

print(result)
```

This example joins on the indices of the DataFrames. Since `how='outer'`, all indices from both tables are kept. Missing values are filled with `NaN`:

```
      A    B    C    D
K0   A0   B0   C0   D0
K1   A1   B1  NaN  NaN
K2   A2   B2   C2   D2
K3  NaN  NaN   C3   D3
```

## Data Grouping

We briefly introduced the grouping functionality of DataFrames in the [Statistics and Counting](counter#pandas-library) section. Here, we will explain the related functionality in more detail.

Grouping data is done via the `groupby()` method, which partitions a `DataFrame` into groups based on key columns. You can then apply aggregation, transformation, or filtering functions to each group. The two primary arguments are `by` (the column or list of columns to group by) and `axis` (which defaults to `0` for grouping rows).

Suppose we have the following DataFrame:

```python
import pandas as pd

data = {'Name': ['典韦', '许褚', '典韦', '许褚', '甘宁'],
        'Kingdom': ['魏', '魏', '魏', '魏', '吴'],
        'Score': [9, 8, 5.5, 8.5, 7]}
df = pd.DataFrame(data)
```

Next, we can group the data by the `Name` column:
Next, we group the data by the `Name` column:

```python
grouped = df.groupby('Name')
```

Once grouped, you can compute group-level statistics like sum, mean, max, or standard deviation:

```python
# Calculate the average score for each name
mean_scores = grouped.mean()
print(mean_scores)

# Output:
#       Score
# Name       
# 典韦     7.25
# 甘宁     7.00
# 许褚     8.25
```

We can group by a combination of multiple columns, for example by `Name` and `Kingdom`:

```python

grouped = df.groupby(['Name', 'Kingdom'])

# Calculate the average score for each name
mean_scores = grouped.mean()
print(mean_scores)

# Output:
#               Score
# Name Kingdom       
# 典韦   魏         7.25
# 甘宁   吴         7.00
# 许褚   魏         8.25
```

Use `.agg()` to apply multiple aggregation functions to different columns at the same time:

```python
grouped = df.groupby('Name')
grouped_agg = grouped.agg({'Score': ['mean', 'min', 'max']})
print(grouped_agg)

# Output:
#      Score          
#       mean  min  max
# Name                
# 典韦    7.25  5.5  9.0
# 甘宁    7.00  7.0  7.0
# 许褚    8.25  8.0  8.5
```

You can also transform or filter groups based on custom logic:

```python
# Standardize scores within each group
score_standardized = grouped['Score'].transform(lambda x: (x - x.mean()) / x.std())

# Keep only groups whose average score exceeds a certain threshold
grouped_filter = grouped.filter(lambda x: x['Score'].mean() > 6)
```


## Data Reshaping

Data reshaping rearranges the layout of a `DataFrame` to make it more suitable for analysis or visualization. Common techniques include pivoting, stacking/unstacking, and melting.

### Pivot

The `pivot()` method reshapes data to create a pivot table (similar to Excel). It uses three key arguments: `index` (the column to use as row labels), `columns` (the column to use as new column headers), and `values` (the column to populate the table cells).

Suppose we have the following DataFrame:

```python
import pandas as pd

df = pd.DataFrame({
    'date': ['2020-01-01', '2020-01-01', '2020-01-02', '2020-01-02'],
    'variable': ['A', 'B', 'A', 'B'],
    'value': [1, 2, 3, 4]
})
print(df)

# Use pivot to generate a pivot table:
df_pivot = df.pivot(index='date', columns='variable', values='value')
print(df_pivot)
```

Running the example above, the data in `df` is:

```
         date variable  value
0  2020-01-01        A      1
1  2020-01-01        B      2
2  2020-01-02        A      3
3  2020-01-02        B      4
```

The data in `df_pivot` is:

```
variable    A  B
date            
2020-01-01  1  2
2020-01-02  3  4
```

### Stacking and Unstacking

The `stack()` and `unstack()` methods convert between wide and tall formats: `stack()` pivots column labels into row index levels (resulting in a multi-indexed Series), while `unstack()` does the opposite.

```python
# Convert columns to rows
stacked = df.stack()
print(stacked)

# Convert rows to columns
unstacked = stacked.unstack()
```

Running the program above, the data in `stacked` is:

```
0  date        2020-01-01
   variable             A
   value                1
1  date        2020-01-01
   variable             B
   value                2
2  date        2020-01-02
   variable             A
   value                3
3  date        2020-01-02
   variable             B
   value                4
dtype: object
```

### Melting

Melting is the inverse of pivoting. It reshapes a `DataFrame` from a wide format to a long format, which is highly useful for plotting and database storage.

- **Wide Format**: In this format, observations for each subject (e.g., time points, entities, etc.) are distributed across multiple columns.
- **Long Format**: In this format, each row is a single observation, containing one or more identifier (ID) columns and a value column. Multiple observations for each subject are distributed across multiple rows.

Key parameters of `pd.melt()` include:
- `frame`: The DataFrame to melt.
- `id_vars`: The column(s) to keep unchanged during the melt (identifier columns).
- `value_vars`: The column(s) to melt into rows.
- `var_name`: The name of the new column that will contain the original column names after melting.
- `value_name`: The name of the new column that will contain the values after melting.

```python

import pandas as pd

df = pd.DataFrame({
    'Date': ['2021-01-01', '2021-01-02'],
    'Temperature': [32, 35],
    'Humidity': [80, 85]
})

# Use melt to convert to long format
df_melted = pd.melt(df, id_vars=['Date'], var_name='Variable', value_name='Value')
print(df_melted)
```

Running the program above, the data in `df_melted` is:

```
         Date      Variable  Value
0  2021-01-01  Temperature     32
1  2021-01-02  Temperature     35
2  2021-01-01     Humidity     80
3  2021-01-02     Humidity     85
```


## Data Cleaning

Data cleaning prepares raw, messy data for analysis. It includes handling missing values, removing duplicates, converting data types, and normalizing formats.

### Handling Missing Values

Missing data commonly appears as `NaN` (Not a Number) or `None`. Identifying and resolving missing values is a crucial first step in any data pipeline.

To check for missing values, use `.isna()` or `.isnull()`:

```python
import pandas as pd

data = {
    'A': [1, 2, 3, 4, 4],
    'B': [5, 6, None, 8, 8],
    'C': [10, 11, 12, 13, 13]
}
df = pd.DataFrame(data)
print(df.isna().sum())
```

Running the program above, the output is:

```
A    0
B    1
C    0
dtype: int64

```

The simplest way to handle missing values is to drop them:

```python
# Delete rows containing missing values
df.dropna(axis=0, inplace=True)

# Delete columns containing missing values
df.dropna(axis=1, inplace=True)
```

If dropping data is not an option, you can fill in missing values using `.fillna()`. You can fill them with a static default value, or dynamically using the column's mean or median:

```python
df.fillna(df.mean(), inplace=True)    # Fill with the mean
df.fillna(df.median(), inplace=True)  # Fill with the median
```

### Removing Duplicate Data

Duplicate records can skew statistics. Use `drop_duplicates()` to keep only unique rows.

### Data Type Conversion

To cast columns to different data types, use `astype()`:

```python
import pandas as pd

df = pd.DataFrame({'A': ['1', '2', '3'], 'B': [4, 5, 6]})

# Convert column 'A' from string to integer
df['A'] = df['A'].astype(int)

# Convert multiple columns to different data types
df = df.astype({'A': int, 'B': float})
```

### Data Normalization

Data normalization standardizes values to make comparisons and computations consistent. Common tasks include:

#### String Normalization
String data often has inconsistent casing or trailing spaces. You can use `.str` accessor methods to clean them up:

```python
df['column'] = df['column'].str.lower()  # Convert to lowercase
df['column'] = df['column'].str.upper()  # Convert to uppercase

df['column'] = df['column'].str.strip()  # Remove leading and trailing whitespace

# Replace text
df['column'] = df['column'].str.replace('old_text', 'new_text')
```

#### Numeric Normalization

Numerical features are often scaled to a standard range (like 0 to 1) or standardized to have a mean of 0 and a standard deviation of 1:

```python

# Scale data to between 0 and 1
df['normalized'] = (df['column'] - df['column'].min()) / (df['column'].max() - df['column'].min())

# Scale data to have mean 0 and standard deviation 1
df['standardized'] = (df['column'] - df['column'].mean()) / df['column'].std()
```

#### Date-Time Normalization

Dates and times should be parsed into `datetime` objects to allow component extraction and time-series calculations:

```python

# Convert date format
df['date'] = pd.to_datetime(df['date'], format='%Y-%m-%d')

# Extract date components such as year, month, day, hour, etc.
df['year'] = df['date'].dt.year
df['month'] = df['date'].dt.month
```

#### Categorical Data Normalization

Categorical columns should be cleaned of redundant labels and cast to Pandas' optimized `category` data type for memory savings:

```python
# Unify category names using mapping or replacement methods
category_map = {'cat1': 'Category 1', 'cat2': 'Category 2'}
df['category'] = df['category'].map(category_map)

# Convert to categorical type
df['category'] = df['category'].astype('category')
```

### Creating Derived Variables

Creating derived columns (feature engineering) means generating new variables from existing columns. This is essential for unlocking deeper insights and training machine learning models.

#### Based on Mathematical Operations

You can perform element-wise arithmetic directly on columns:

```python
import pandas as pd

df = pd.DataFrame({
    'A': [1, 2, 3, 4],
    'B': [5, 6, 7, 8]
})

# Create a new column that is the sum of A and B
df['C'] = df['A'] + df['B']

# Create a new column that is the square of A
df['A_squared'] = df['A'] ** 2
```

#### Condition-Based Derived Variables

```python
# Create a new column based on the values in column A
df['A_greater_than_2'] = df['A'] > 2
```

### Renaming Columns
To rename columns, use the `.rename()` method with a dictionary mapping old names to new names:

```python
import pandas as pd

df = pd.DataFrame({
    'A': [1, 2, 3],
    'B': [4, 5, 6]
})

# Rename a single column
df.rename(columns={'A': 'a'}, inplace=True)

# Rename multiple columns
df.rename(columns={'B': 'b', 'a': 'alpha'}, inplace=True)
```

You can also assign a complete list of names directly to the `.columns` attribute:

```python
df.columns = ['new_name1', 'new_name2']
```

This method is convenient when you know all the column names and want to replace them all at once.

Alternatively, you can use `.set_axis()` to rename columns or index labels:

```python
df = df.set_axis(['new_name1', 'new_name2'], axis=1, inplace=False)
```

### Data Sorting

Use `.sort_values()` to sort rows by the values of one or more columns:

`sort_values` is the most commonly used sorting method in Pandas. It can sort a DataFrame based on the values of one or more columns.

```python
import pandas as pd

df = pd.DataFrame({
    'A': [3, 1, 2],
    'B': [6, 5, 4]
})

# Sort by a single column, ascending by column 'A'
df_sorted = df.sort_values(by='A')


# Sort by multiple columns, ascending by column 'A' and descending by column 'B'
df_sorted = df.sort_values(by=['A', 'B'], ascending=[True, False])
```
