# Data Analysis and Pandas

Pandas is one of the core libraries for data analysis in Python. Its data processing and cleaning capabilities are very powerful, especially when working with tabular data.

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

In the Pandas library, the most commonly used data structure is the DataFrame, which provides powerful and flexible tools for data processing and analysis. A DataFrame is a two-dimensional, tabular data structure, very similar to an SQL database table or an Excel spreadsheet. DataFrames can store columns of different types, such as integers, floating-point numbers, strings, etc. This is the most frequently used data type in the pandas library. We often use it to read data from databases, or to read data from file formats such as CSV, TSV, etc.

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

The columns of a DataFrame represent the features or variables of the data. Each column has a column name in the DataFrame (such as `Name` and `Age` in the example), and these column names make up the column index of the DataFrame. Different columns can have different data types, but the data within each column should have the same data type, such as integers, floating-point numbers, strings, etc. Columns can be accessed and manipulated by their column names. Columns can be dynamically inserted, deleted, or modified in the program.

The rows of a DataFrame represent data records. Each row contains a set of related data. Each row is identified in the DataFrame by an index. Rows can be accessed and manipulated by row number (position) or by index (label). Row numbers are auto-generated, starting from 0, similar to the indexing of Python lists or arrays. Rows can also be dynamically inserted, deleted, or modified. The index is an immutable sequence used to identify the rows of the DataFrame. Many data operations, such as data alignment, merging, joining, and grouping, make use of the index.

### Index

By default, a DataFrame uses row numbers as its index, but the index can also be dates, strings, or other data. For example, in the program above, if you pass an `index` parameter when creating the DataFrame object: `index=['a', 'b', 'c']`, the resulting object will use the index data as the index. The new DataFrame data would then be as follows:

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

We can create an empty DataFrame by calling `empty_df = pd.DataFrame()` and then add data to it. The following code creates an empty DataFrame with a defined schema:

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

Below are some commonly used methods for viewing DataFrame information. Which method to use depends on the type of information you want to obtain.

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

Pandas also supports some other data structures, but they are used much less frequently than DataFrames. So we won't go into detail about other data types. We'll only briefly illustrate using Series as an example:

A Series is a one-dimensional labeled array that can hold any data type (integers, strings, floating-point numbers, Python objects, etc.). Each Series object has an index, through which individual data items in the array can be accessed. All data items in a Series must be of the same data type. Once created, the length of a Series is fixed and cannot be changed. However, the data within it can be modified. A Series can have axis labels, and you can use labels to access data.

```python
import pandas as pd

# Create a Series
s = pd.Series([1, 3, 5, 7, 9], index=['a', 'b', 'c', 'd', 'e'])

# Access data
print(s['c'])  # Output: 5
```


## Reading and Writing Files and Databases

Pandas provides a variety of powerful functions for reading different types of files, making data import simple and efficient. These functions can handle various common data formats, such as CSV, Excel, JSON, HTML, and SQL databases.

### Reading and Writing CSV and TSV Files

CSV (Comma-Separated Values) and TSV (Tab-Separated Values) files are the most common text file formats for storing tabular data. In these files, data is stored in rows and columns. In CSV format, columns are separated by commas; in TSV format, columns are separated by tabs. We can use the `pd.read_csv()` function to read both types of files by simply specifying the appropriate delimiter.

Parameters of the `pd.read_csv()` function include:
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

Since the data file has a header, which is `Name	Age	City`, the `header` parameter uses its default value of `0`. If the data in the file does not have a header, use `header=None` as the parameter. You can also add another parameter `names=['Name', 'Age', 'City']` to specify the column names for the read data.

The output of the program above is:

```
    Name  Age    City
0   杜其演   24    上海
1   宋外麦   19    北京
```

Writing tabular data to a text file is very similar to reading, using the `pd.to_csv()` function. The parameters of this function are also similar to those of the `pd.read_csv()` function:

- `path_or_buf`: The file path or a file-like object. If no path is specified, the result is returned as a string.
- `sep`: The delimiter between fields, default is comma `,`.
- `index`: Whether to write row indices to the file, default is `True`. Usually set to `False` unless you need the row index as part of the data.
- `header`: Whether to write column names (header), default is `True`.
- `columns`: A list of column names to write to the file.
- `encoding`: Specifies the encoding format of the file, default is `'utf-8'`.

Suppose we want to save the data read above into a CSV file. Simply call the following line:

```python
df.to_csv('my_data.csv', index=False)
```

### Reading and Writing Excel Files

Using Pandas, reading and writing Excel files is very simple. However, Pandas itself cannot parse Excel; it relies on other libraries to read and write Excel files. Therefore, we need to install the following libraries:

```sh
# For handling .xlsx files
pip install pandas openpyxl
# For handling .xls files
pip install pandas xlrd
```

After that, you can use the `to_excel()` and `read_excel()` functions to write and read `.xls` and `.xlsx` format files. The parameters of these two functions are very similar to `to_csv()` and `read_csv()`. The main difference is the additional `sheet_name` parameter, which specifies the name of the worksheet, defaulting to `"Sheet1"`. Here is a simple example:

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

To read and write databases with Pandas, you also need to install the required modules first:

```sh
pip install sqlalchemy pymysql pyhive
```

Pandas uses the `read_sql`, `read_sql_query`, or `read_sql_table` functions to read data from a database. First, you need to create a SQLAlchemy engine object, which represents the database connection.

```python
from sqlalchemy import create_engine

# Create a database engine
# Example is for SQLite database; connection string formats for other databases may differ
engine = create_engine('sqlite:///mydatabase.db')

# For Hive database, similar code: engine = create_engine('hive://hostname:port/database')
```

Next, use the `read_sql` function or its variants to read data from the database:

```python
import pandas as pd

# Use an SQL query
df = pd.read_sql("SELECT * FROM my_table", con=engine)

# Or read directly from a table
df = pd.read_sql_table("my_table", con=engine)
```

Use the `to_sql` method to write the contents of a DataFrame to a database table:

```python
df.to_sql("my_table", con=engine, if_exists='replace', index=False)
```

Here, the `if_exists` parameter controls the behavior when the table already exists. If set to `'fail'`, it raises an error if the table exists; `'replace'` means replace the existing table; `'append'` means add the data to the existing table.

The database URL format depends on the type of database being used. It typically includes the username, password, host, port, and database name. When writing a DataFrame to a database, ensure that the structure of the DataFrame is compatible with the target database table.

### Reading and Writing Other File Types

In addition to the data files and databases mentioned above, Pandas also supports some other file types, such as JSON, HTML, etc. However, these are used less frequently, so we will not cover them in detail.



## Reading Data from a DataFrame

### Reading Columns

You can use column names to select data from one or more columns. For example:

```python
# Select a single column by column name:
series = df['Name']

# Select multiple columns:
new_df = df[['Name', 'Age']]
```

### Reading Rows

There are two ways to read row data: by index (loc) or by row number (iloc):

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

It is important to note that the data index may contain duplicate values, so using the index may retrieve multiple rows with that index.

### Slicing

DataFrame slicing is very similar to list slicing. Typically, tabular data has many rows and few columns, so slicing is mainly used for selecting rows. For example:

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

### Conditional Selection

We can also use conditional expressions to select rows that meet specific criteria:

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

### Accessing Individual Data Points

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

In programs, most of the time you won't just read a single data point from a DataFrame. Instead, you will need to iterate through and process each piece of data in the DataFrame using loops or similar methods.

#### Directly Iterating Over Columns

Iterating directly over a DataFrame actually iterates over its column names. For example:

```python
import pandas as pd

df = pd.DataFrame({'A': [1, 2, 3], 'B': [4, 5, 6]})

for col in df:
    print(f"Column: {col}, Data: {df[col].tolist()}")
    
# Output:
# Column: A, Data: [1, 2, 3]
# Column: B, Data: [4, 5, 6]
```

However, in actual programs, you will more often need to process data row by row. Row iteration has several main methods.

#### Iterating Rows with iterrows

`iterrows()` is a generator that yields a tuple (index, Series) for each row in the DataFrame. This is the most commonly used method for row iteration.

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

`itertuples()` is another generator that yields a named tuple for each row in the DataFrame. This method is generally faster than `iterrows()`.

```python
import pandas as pd

df = pd.DataFrame({'A': [1, 2, 3], 'B': [4, 5, 6]})

for row in df.itertuples():
    print(f"Index: {row.Index}, A: {row.A}, B: {row.B}")
    
# Output is identical to the example above
```

`itertuples()` is faster than `iterrows()`, but note that the row index is returned as the `Index` attribute in `itertuples()`.


#### Using the apply() Function

We can also use higher-order functions to process each piece of data in a DataFrame. Although the `apply()` function is not specifically designed for iteration, it can be used to perform operations on each row or column of a DataFrame.

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

You can add new columns to the data by using new column names:

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

Earlier versions of Pandas typically used the `append` method to add data, but this method has been deprecated. The recommended approach now is to use the `concat` function to add new rows to a DataFrame. The data for the new rows should be provided as a dictionary whose keys correspond to the DataFrame's column names:

```python
# Create a DataFrame containing multiple new rows
new_rows = pd.DataFrame({'A': [5, 6], 'B': [8, 9], 'C': [11, 12]})

# Call concat to merge the original DataFrame with the new DataFrame
df = pd.concat([df, new_rows], ignore_index=True)
```

### Deleting Data

#### Deleting Rows and Columns

Pandas uses the `df.drop()` function to delete rows or columns. Its most commonly used parameters are `labels` and `axis`. `labels` represents the label(s) of the row(s) or column(s) to delete. `axis` specifies whether to delete rows or columns: `axis=0` (or `axis='index'`) means delete rows; `axis=1` (or `axis='columns'`) means delete columns.

As a demonstration, let's first create a DataFrame:

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

This is essentially selecting data that does not satisfy a condition. Continuing with the data from the example above, running the following code will delete the rows where column 'A' equals 4:

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

Pandas also has a dedicated function `df.dropna()` for deleting all rows containing NaN:

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

The `df.drop_duplicates()` function is used to delete all duplicate rows:

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

Pandas has several methods for merging two or more DataFrames. The `concat` method mentioned above is the most basic, simply concatenating two DataFrames together. Additionally, you can use the `merge()` and `join()` methods. Both are similar to JOIN operations in SQL, combining rows from two DataFrames based on one or more keys. The difference is that `merge()` merges based on the data in specified columns, while `join()` merges based on the index.

The parameters of `pd.merge(left, right, on=None, left_on=None, right_on=None, how='inner')` are as follows:
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

The program above merges based on the data in the 'key' column. If a row's 'key' value exists in both tables, that row appears in the merge result. The merge result includes all columns from both tables. The merge result is as follows:

```
  key   A   B
0  K0  A0  B0
1  K1  A1  B1
```

The parameters of `DataFrame.join(other, on=None, how='left')` are as follows:
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

The program above merges data based on the index. Since the merge method is set to `'outer'`, all rows from both the left and right tables appear in the result. Missing data is represented as NaN. For example, for row K1, the data only exists in the left table, so there is no corresponding data in the columns originally from the right table, and thus its data in columns C and D is NaN. The merge result is as follows:

```
      A    B    C    D
K0   A0   B0   C0   D0
K1   A1   B1  NaN  NaN
K2   A2   B2   C2   D2
K3  NaN  NaN   C3   D3
```

## Data Grouping

We briefly introduced the grouping functionality of DataFrames in the [Statistics and Counting](counter#pandas-库) section. Here, we will explain the related functionality in more detail.

Data grouping is typically implemented using the `groupby` method. It can group data by the values in one or more columns, and then apply aggregation functions, transformation functions, or filtering operations to each group. The `groupby` method `DataFrame.groupby(by=None, axis=0, ...)` has two main parameters: `by`, the column name or list of column names to group by, which can also be a mapping or function; and `axis`, which specifies the axis to group on, with 0 (default) meaning group by rows and 1 meaning group by columns.

Suppose we have the following DataFrame:

```python
import pandas as pd

data = {'Name': ['典韦', '许褚', '典韦', '许褚', '甘宁'],
        'Kingdom': ['魏', '魏', '魏', '魏', '吴'],
        'Score': [9, 8, 5.5, 8.5, 7]}
df = pd.DataFrame(data)
```

Next, we can group the data by the `Name` column:

```python
grouped = df.groupby('Name')
```

`grouped` is the grouping result. We can then perform various statistics on this grouping result, such as sum (`sum()`), mean (`mean()`), maximum (`max()`), variance (`std()`), etc.:

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

Using the `agg` method, we can apply multiple aggregation functions to the grouped data simultaneously:

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

In addition to aggregation, you can also transform and filter grouped data:

```python
# Standardize scores within each group
score_standardized = grouped['Score'].transform(lambda x: (x - x.mean()) / x.std())

# Keep only groups whose average score exceeds a certain threshold
grouped_filter = grouped.filter(lambda x: x['Score'].mean() > 6)
```


## Data Reshaping

Data reshaping refers to rearranging the structure of existing data to obtain a format more suitable for specific analysis or operations. Common data reshaping methods include pivoting, stacking, and melting.

### Pivot

The `pivot` method can rearrange a DataFrame to generate a "pivot table," similar to pivot tables in Excel. The `DataFrame.pivot(index=None, columns=None, values=None)` method has three main parameters: `index` specifies the index of the new DataFrame; `columns` specifies the column names of the new DataFrame; `values` specifies the values to fill the new DataFrame.

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

The `stack` and `unstack` methods are used to convert columns to rows (stacking) or rows to columns (unstacking). Converting columns to rows produces a Series with a MultiIndex.

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

Melting is a data reshaping technique used to convert data from wide format to long format. This operation is typically used to prepare data for analysis, plotting, or other specific types of processing.

- **Wide Format**: In this format, observations for each subject (e.g., time points, entities, etc.) are distributed across multiple columns.
- **Long Format**: In this format, each row is a single observation, containing one or more identifier (ID) columns and a value column. Multiple observations for each subject are distributed across multiple rows.

The parameters of `pd.melt(frame, id_vars=None, value_vars=None, var_name=None, value_name='value')` are:
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

Data cleaning is the process of converting raw data into a format that is easy to analyze. It includes handling missing values, duplicate data, data type conversion, data normalization, and many other aspects.

### Handling Missing Values

Handling missing values is an important aspect of data cleaning. Missing values may exist in the data as NaN (Not a Number), None, or other forms. Properly handling missing values is crucial for effective data analysis.

Before handling missing values, you first need to identify them in the data. You can use the `isna()` or `isnull()` methods to check for missing values.

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

The simplest way to handle missing values is to delete them, as in the program below:

```python
# Delete rows containing missing values
df.dropna(axis=0, inplace=True)

# Delete columns containing missing values
df.dropna(axis=1, inplace=True)
```

When the amount of data is small, we may not want to delete any data. In such cases, filling in missing values can be considered. The simplest method is to fill with a constant: `df.fillna(value, inplace=True)`. However, in real-world projects, it is more common to fill with the mean or median:

```python
df.fillna(df.mean(), inplace=True)    # Fill with the mean
df.fillna(df.median(), inplace=True)  # Fill with the median
```

### Removing Duplicate Data

Duplicate data can affect analysis results. You can use the `drop_duplicates()` method introduced earlier to remove duplicate rows.

### Data Type Conversion

`astype()` is the main method for data type conversion. It can convert the data type of a DataFrame column or the entire DataFrame to a specified type. For example:

```python
import pandas as pd

df = pd.DataFrame({'A': ['1', '2', '3'], 'B': [4, 5, 6]})

# Convert column 'A' from string to integer
df['A'] = df['A'].astype(int)

# Convert multiple columns to different data types
df = df.astype({'A': int, 'B': float})
```

### Data Normalization

Data normalization refers to converting data into a standard format for easier analysis and processing. Data normalization typically includes the following aspects:

#### String Normalization
String data may come in various formats and needs to be uniformly normalized. Common string normalizations include case conversion, whitespace removal, etc.:

```python
df['column'] = df['column'].str.lower()  # Convert to lowercase
df['column'] = df['column'].str.upper()  # Convert to uppercase

df['column'] = df['column'].str.strip()  # Remove leading and trailing whitespace

# Replace text
df['column'] = df['column'].str.replace('old_text', 'new_text')
```

#### Numeric Normalization

For numeric data, normalization typically includes scaling and transformation operations to make the data conform to a specific range or format. Common numeric normalization methods include:

```python

# Scale data to between 0 and 1
df['normalized'] = (df['column'] - df['column'].min()) / (df['column'].max() - df['column'].min())

# Scale data to have mean 0 and standard deviation 1
df['standardized'] = (df['column'] - df['column'].mean()) / df['column'].std()
```

#### Date-Time Normalization

Date and time data may exist in multiple formats and need to be converted to a unified format.

```python

# Convert date format
df['date'] = pd.to_datetime(df['date'], format='%Y-%m-%d')

# Extract date components such as year, month, day, hour, etc.
df['year'] = df['date'].dt.year
df['month'] = df['date'].dt.month
```

#### Categorical Data Normalization

For categorical data, ensure that all categories are consistent, error-free, and non-redundant.

```python
# Unify category names using mapping or replacement methods
category_map = {'cat1': 'Category 1', 'cat2': 'Category 2'}
df['category'] = df['category'].map(category_map)

# Convert to categorical type
df['category'] = df['category'].astype('category')
```

### Creating Derived Variables

Creating derived variables (also called feature engineering) refers to generating new columns from existing data. These new columns are typically the result of mathematical operations, logical operations, or more complex function transformations on existing columns. Derived variables are very important for data analysis, visualization, and even building machine learning models.

#### Based on Mathematical Operations

You can perform various mathematical operations on columns in a DataFrame to create new derived columns.

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
To improve readability, sometimes you need to rename the columns of a DataFrame. The `rename` method is the primary way to rename columns. You can specify a mapping from old column names to new column names by passing a dictionary.

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

Another way to rename columns is to directly modify the `columns` attribute of the DataFrame.

```python
df.columns = ['new_name1', 'new_name2']
```

This method is convenient when you know all the column names and want to replace them all at once.

The `set_axis` method can also be used to rename columns, allowing you to set both row indices and column names simultaneously.

```python
df = df.set_axis(['new_name1', 'new_name2'], axis=1, inplace=False)
```

### Data Sorting

Data sorting is a basic data operation used to arrange data based on the values of one or more columns. Sorting can be ascending or descending. Below are the main methods and applications for sorting DataFrame data.

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
