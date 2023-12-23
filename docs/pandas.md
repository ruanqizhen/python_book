# 数据分析和 Pandas

Pandas 是 Python 数据分析的核心库之一。它的数据处理和清洁功能非常强大，特别是在处理表格数据时。

## 安装

Pandas 是个第三方包，如果还没有安装，可以通过以下命令安装：

```sh
pip install pandas
```

使用 Pandas 功能先要导入：

```python
import pandas as pd
```

下面示例代码，有些省略了导入过程了，测试时需要自行添加。


## 数据结构

在 Pandas 库中，主要有两种数据结构：Series 和 DataFrame。这两种结构为数据处理和分析提供了强大且灵活的工具。

### DataFrame

DataFrame 是一个二维的、表格型的数据结构，非常类似于 SQL 数据库表或 Excel 电子表格。DataFrame 可以存储不同类型的列，如整数、浮点数、字符串等。这是使用 pandas 库，最为常用的数据类型，我们经常使用它来读取数据库中的数据，或者是读取 csv, tsv 等文件格式中的数据。

比如：

```python
import pandas as pd
# 创建一个 DataFrame
data = {'Name': ['范统', '夏建仁', '李拜天'],
        'Age': [20, 21, 19]}
df = pd.DataFrame(data)

# 显示 DataFrame
print(df)
```

输出为：

```
  Name  Age
0   范统   20
1  夏建仁   21
2  李拜天   19
```

上面的示例程序，创建了一个名为 df 的 DataFrame，它有两列三行。

DataFrame 的列代表数据的特征或变量。每列在 DataFrame 中有一个列名（比如示例中的 Name 和 Age），这些列名组成了 DataFrame 的列索引（Column Index）。不同列的数据可以有不同的数据类型，但每一列中的数据应该具有相同的数据类型，比如：整数、浮点数、字符串等。列可以通过列名来访问和操作。程序中可以动态地插入、删除修改列。

DataFrame 的行表示数据记录，每一行包含了一组相关的数据。每行在 DataFrame 中通过索引（Index）标识。行可以通过行号（位置）或索引（标签）来访问和操作。行号是自动生成的，从 0 开始，类似于 Python 列表或数组的索引。行也同样可动态地插入、删除修改列。索引是一个不可变序列，用于标识 DataFrame 的行。很多数据操作，比如数据对齐、合并、连接和分组等都会使用到索引。默认情况下，DataFrame 采用行号作为索引，但索引也可以是日期、字符串或其他数据。比如，上面的程序，在创建 DataFrame 对象时，如果传入一个 index 参数： `index=['a', 'b', 'c']`，产生的对象就会使用 index 的数据作为索引。新的 DataFrame 数据就会是如下：

```
   Name  Age
a   范统   20
b  夏建仁   21
c  李拜天   19
```

我们也可以使用 set_index 方法把某一列或某几列数据设置为索引。比如 `df.set_index('Name', inplace=True)` 将会把 Name 列设置为索引，数据会变成：

```
       Age
Name     
范统     20
夏建仁    21
李拜天    19
```


### 其它数据结构

Pandas 也支持其它一些数据结构，但是使用 Pandas 基本都是使用 DataFrame。所以其它数据类型就不多介绍了。只用 Series 作为示例，提一下：

Series 是一维的标签化数组，可以容纳任何数据类型（整数、字符串、浮点数、Python 对象等）。每个 Series 对象都有一个索引，可以通过索引来访问数组中的单个数据项。Series 中的所有数据项必须属于同一数据类型。一旦创建，Series 的长度是固定的，不能改变。但是，可以改变里面的数据。Series 可以有一个轴标签，可以使用标签来访问数据。

```python
import pandas as pd

# 创建一个 Series
s = pd.Series([1, 3, 5, 7, 9], index=['a', 'b', 'c', 'd', 'e'])

# 访问数据
print(s['c'])  # 输出: 5
```


## 读写文件和数据库

Pandas 提供了多种功能强大的函数来读取不同类型的文件，使得数据导入变得简单高效。这些函数可以处理各种常见的数据格式，如 CSV、Excel、JSON、HTML 和 SQL 数据库等。

### 读写 CSV, TSV 文件

CSV（逗号分隔值） 和 TSV（制表符分隔值）文件是最常见的文本文件格式，用于存储表格数据。这些文件中，数据按照行列保存，CSV 格式的文件，每列数据间用逗号分隔，TSV 格式文件中，每列数据用制表符分隔。我们可以使用 pd.read_csv() 函数读取这两种文件，只需指定适当的分隔符即可。

pd.read_csv() 函数的参数包括：
- filepath_or_buffer： 文件的路径或类似文件的对象。
- sep： 字段分隔符，默认为,。
- header： 用作列名的行号，默认为 0 （第一行）。
- index_col： 用作行索引的列编号或列名。
- usecols： 返回的列的子集。
- dtype： 列的数据类型。

假设我们有一个名为 data.tsv 的文件，内容如下：

```txt title="data.tsv"
Name	Age	City
杜其演	24	上海
宋外麦	19	北京
```

读取这个文件的代码将是：

```python
df = pd.read_csv('data.tsv', sep='\t')
print(df)
```

因为这个数据文件有表头，也就是 `Name	Age	City`，所以 header 参数采用默认值 0。如果文件中的数据没有表头，使用 `header=None` 作为参数即可。也可以再另外加一个参数 `names=['Name', 'Age', 'City']`，这样就指定了读取的数据的列名。

上面程序的输出是：

```
    Name  Age    City
0   杜其演   24    上海
1   宋外麦   19    北京
```

把表格数据写入文本文件，与读取非常类似，使用 pd.to_csv() 函数。这个函数的参数也与 pd.read_csv() 函数的参数类似：

- path_or_buf：文件路径或一个类似文件的对象。如果未指定路径，结果将返回为字符串。
- sep：字段间的分隔符，默认为逗号 ','。
- index：是否将行索引写入文件，默认为 True。通常设置为 False，除非你需要行索引作为数据的一部分。
- header：是否写入列名（表头），默认为 True。
- columns：指定要写入文件的列名列表。
- encoding：指定文件的编码格式，默认是 'utf-8'。

假设把上面读取的数据在存入一个 CSV 文件中，调用下面这行程序即可：

```python
df.to_csv('my_data.csv', index=False)
```

### 读写 Excel 文件

使用 Pandas ，读写 Excel 文件非常简单。但是 Pandas 本身并不能解析 Excel，它也是调用其它库来读写 Excel 的。所以，我们需要安装以下这些库：

```sh
# 用于处理 .xlsx 文件
pip install pandas openpyxl
# 用于处理 .xls 文件
pip install pandas xlrd
```

之后，就可以使用 to_excel() 和 read_excel() 函数来写入和读取 .xls和 .xlsx 格式的文件。这两个函数的参数与 to_csv(), read_csv() 函数非常类似。主要区别在于多了一个参数 sheet_name，用于指定工作表的名称，默认为 "Sheet1"。下面是一个简单示例：

```python
import pandas as pd

# 创建一个示例 DataFrame
data = {'Name': ['姜米调', '高丽黛', '钱泰少'],
        'Age': [25, 30, 35],
        'City': ['上海', '北京', '西安']}
df = pd.DataFrame(data)

# 将 DataFrame 写入 Excel 文件
df.to_excel('my_data.xlsx', index=False)

# 读取名为 'Sheet1' 的工作表
df_2 = pd.read_excel('file.xlsx', sheet_name='Sheet1')

# 显示 DataFrame
print(df_2)
```

上面的程序把 DataFrame 数据写入了一个 Excel 文件，之后又把数据从文件里读入到了一个新的 DataFrame。

### 读写 SQL 数据库

使用 Pandas ，读写数据库也需要先安装所需的模块：

```sh
pip install sqlalchemy pymysql pyhive
```

Pandas 使用 read_sql、read_sql_query 或 read_sql_table 函数来从数据库读取数据。首先，需要创建一个 SQLAlchemy 引擎对象，这个对象代表了数据库连接。

```python
from sqlalchemy import create_engine

# 创建数据库引擎
# 示例为 SQLite 数据库，其他数据库的连接字符串格式可能不同
engine = create_engine('sqlite:///mydatabase.db')

# Hive 数据库代码类似： engine = create_engine('hive://hostname:port/database')
```

接下来使用 read_sql 函数或其变体从数据库中读取数据：

```python
import pandas as pd

# 使用SQL查询
df = pd.read_sql("SELECT * FROM my_table", con=engine)

# 或者直接从表格读取
# df = pd.read_sql_table("my_table", con=engine)
```

使用 to_sql 方法，可以将 DataFrame 的内容写入数据库表中：

```python
df.to_sql("my_table", con=engine, if_exists='replace', index=False)
```

这里 if_exists 参数控制如果表已经存在时的行为，如果值为 'fail'，表示如果表存在，抛出错误；'replace' 表示如果表存在，替换原有表；'append' 表示如果表存在，将数据添加到表中。

数据库的 URL 格式依赖于所使用的数据库类型。通常它包含用户名、密码、主机、端口和数据库名。将 DataFrame 写入数据库时，要确保 DataFrame 的结构与目标数据库表兼容。

### 读写其它类型文件

除了上面提到的几种数据文件和数据库，Pandas 还支持其它一些类型的文件，比如 JSON, HTML 等。但应用较少，就不详细介绍了。



## 读取 DataFrame 中的数据

### 读取列

使用列名可以选取一个或多个列的数据，比如：

```python
# 通过列名选择单列：
series = df['Name']

# 选择多列：
new_df = df[['Name', 'Age']]
```

### 读取行

读取行数据有两种方式：通过索引（loc）或通过行号（iloc）：

```python
import pandas as pd

# 创建一个示例 DataFrame
data = {'Name': ['刘备', '关羽', '张飞'],
        'Age': [40, 35, 30],
        'City': ['涿郡', '解县', '涿郡']}
df = pd.DataFrame(data)

# 把 City 列设置为索引
df.set_index('City', inplace=True)

# 通过行号选择行
print(df.iloc[0])      # 输出第一行数据
print(df.iloc[0, 2])   # 输出第一和第三行数据

# 通过索引选择行
print(df.loc['涿郡'])   # 输出以涿郡为索引的两行数据
```

需要注意的是，数据的索引可能是包含重复数值的，所以通过索引可能会读取到具有这个索引的多行数据。

### 切片

DataFrame 切片功能与列表的切片是非常类似的。通常表格中的数据行多列少，切片主要用于选择行。比如：

```python
import pandas as pd

# 创建一个示例 DataFrame
data = {'Name': ['刘备', '关羽', '张飞'],
        'Age': [40, 35, 30],
        'City': ['涿郡', '解县', '涿郡']}
df = pd.DataFrame(data)

# 使用行号进行行切片
print(df[:2])           # 切片前两行

# 使用行列号进行切片
print(df.iloc[:2, 1:])  # 切片前两行、后两列
```

### 条件选择

我们还可以使用条件表达式选择满足特定条件的行：

```python
import pandas as pd

# 创建一个示例 DataFrame
data = {'Name': ['赵云', '黄忠', '马超'],
        'Age': [25, 60, 30],
        'City': ['常山', '南阳', '茂陵']}
df = pd.DataFrame(data)

print(df[df['Age'] > 25])          # 选择年龄大于25岁的行
print(df[df['City'] == '南阳'])     # 选择城市为南阳的行

print(df[df['Age'] > 25] & df['City'] == '南阳'])  # 选择年龄大于25岁并且城市为南阳的行

print(df[df['Age'] > 25]['Name'])  # 结合行条件和列选择
```

### 访问单个数据

我们可以使用 at 通过索引和列名或者使用 iat 通过行列号来访问单个元素数据：

```python
import pandas as pd

data = {'Name': ['孙权', '刘表', '曹操'],
        'Born': ['182', '142', '155'],
        'Died': ['252', '208', '220']}
df = pd.DataFrame(data)

# 把 Name 列设置为索引
df.set_index('Name', inplace=True)

# 使用at访问元素
sunquan_born = df.at['孙权', 'Born']
print("孙权出生年份:", sunquan_born)

# 使用iat访问元素
liubiao_died = df.iat[1, 1]
print("刘表死亡年份:", liubiao_died)
```

### 迭代

在程序中，多数时候不会只读取 DataFrame 中的某个数据，而是需要使用循环等方式，迭代处理 DataFrame 中的每一个数据。

#### 直接迭代列

直接迭代 DataFrame 实际上是迭代其列名，比如：

```python
import pandas as pd

df = pd.DataFrame({'A': [1, 2, 3], 'B': [4, 5, 6]})

for col in df:
    print(f"Column: {col}, Data: {df[col].tolist()}")
    
# 输出：
# Column: A, Data: [1, 2, 3]
# Column: B, Data: [4, 5, 6]
```

不过，实际程序中，更多的时候会需要逐行处理数据。行迭代有以下几种主要方法。

#### 使用 iterrows 迭代行

iterrows() 是一个生成器，它为 DataFrame 中的每一行产生一个元组（索引，系列）。这是最常用的按行迭代方法。

```python
import pandas as pd

df = pd.DataFrame({'A': [1, 2, 3], 'B': [4, 5, 6]})

for index, row in df.iterrows():
    print(f"Index: {index}, A: {row['A']}, B: {row['B']}")
    
# 输出：
# Index: 0, A: 1, B: 4
# Index: 1, A: 2, B: 5
# Index: 2, A: 3, B: 6    
```

这种方法在处理大型 DataFrame 时可能不太高效，因为每一行都返回一个 Series 对象。

#### 使用 itertuples 迭代行

itertuples()是另一个生成器，它为DataFrame中的每一行产生一个命名元组。这个方法通常比iterrows()更快。

```python
import pandas as pd

df = pd.DataFrame({'A': [1, 2, 3], 'B': [4, 5, 6]})

for row in df.itertuples():
    print(f"Index: {row.Index}, A: {row.A}, B: {row.B}")
    
# 输出结果与上面的示例完全相同
```

itertuples() 比 iterrows() 快，但要注意，行索引在 itertuples() 中是作为属性 Index 返回的。


#### 使用 apply() 函数

我们也可以使用高阶函数对 DataFrame 中的每个数据进行处理。apply()函数虽然不是专门用于迭代的，但可以用来对 DataFrame 中的每一行或列执行操作。

```python
import pandas as pd

df = pd.DataFrame({'A': [1, 2, 3], 'B': [4, 5, 6]})
def process(row):
    print(f"A: {row['A']}, B: {row['B']}")

df.apply(process, axis=1)

# 输出：
# A: 1, B: 4
# A: 2, B: 5
# A: 3, B: 6    
```

## 增删数据

### 添加列

使用新的列名就可以为数据添加新的列：

```python
import pandas as pd

# 创建一个示例 DataFrame
df = pd.DataFrame({'A': [1, 2, 3], 'B': [4, 5, 6]})

# 添加新列
df['C'] = [7, 8, 9]

print(df)
```

输出为：
```
   A  B  C
0  1  4  7
1  2  5  8
2  3  6  9
```

### 添加行

通常需要使用 append 方法或 concat 函数向 DataFrame 添加新行。新行的数据应该以字典形式提供，其键与 DataFrame 的列名对应：


```python
# 创建一个新行的字典
new_row = {'A': 4, 'B': 7, 'C': 10}

# 使用 append 添加单个行
df = df.append(new_row, ignore_index=True)

print(df)

# 创建一个包含多个新行的 DataFrame
new_rows = pd.DataFrame({'A': [5, 6], 'B': [8, 9], 'C': [11, 12]})

# 调用 concat 合并原 DataFrame 和新 DataFrame
df = pd.concat([df, new_rows], ignore_index=True)
```

### 删除数据

#### 删除行列

pandas 使用 df.drop() 函数删除行或列。 这个函数最常用的参数是 labels 和 axis。labels 表示一个或多个删除的行或列的标签。axis 指定要删除的是行还是列： axis=0 (或 axis='index') 表示删除行；axis=1 (或 axis='columns') 表示删除列。

作为演示，我们首先创建一个 DataFrame：

```python
import pandas as pd

# 创建一个示例 DataFrame
data = {
    'A': [1, 2, 3, 4, 4],
    'B': [5, 6, None, 8, 8],
    'C': [10, 11, 12, 13, 13]
}
df = pd.DataFrame(data)

print(df)
```

输出为：

```
   A    B   C
0  1  5.0  10
1  2  6.0  11
2  3  NaN  12
3  4  8.0  13
4  4  8.0  13
```

运行下面的程序，打印的是删除了 'B' 列的数据：

```python
print(df.drop(['B'], axis=1))
```

输出为：

```
   A   C
0  1  10
1  2  11
2  3  12
3  4  13
4  4  13
```

运行下面的程序，删除第 0 行和第 2 行：

```python
print(df.drop([0, 2]))
```

输出为：

```
   A    B   C
1  2  6.0  11
3  4  8.0  13
4  4  8.0  13
```

#### 条件删除

其实就是选择那些不满足条件的数据，比如继续使用上面示例中的数据，运行下面代码将会删除列 'A' 中值等于 4 的行：

```python
print(df[df['A'] != 4])
```

输出为：

```
   A    B   C
0  1  5.0  10
1  2  6.0  11
2  3  NaN  12
```

Pandas 还有一个专门的函数 df.dropna() 用于删除所有带 NaN 的行：

```python
print(df.dropna())
```

输出为：

```
   A    B   C
0  1  5.0  10
1  2  6.0  11
3  4  8.0  13
4  4  8.0  13
```

df.drop_duplicates() 函数用于删除所有重复的行

```python
print(df.drop_duplicates())
```

输出为：

```
   A    B   C
   A    B   C
0  1  5.0  10
1  2  6.0  11
2  3  NaN  12
3  4  8.0  13
```


## 数据合并

Pandas 有多种方法用于合并两个或多个 DataFrame，上文提到的 concat 是最基础的方法，它简单的把两个 DataFrame 拼接到一起。此外，还可以使用 merge() 和 join() 方法。这两种方法都类似于 SQL 中的 JOIN 操作，根据一个或多个键将行合并两个 DataFrame。区别在于，merge() 是按照指定的列的数据进行合并，join() 是按照索引进行合并。

pd.merge(left, right, on=None, left_on=None, right_on=None, how='inner') 函数的参数如下：
- left 和 right：要合并的两个DataFrame。
- on：用于连接的列名。如果未指定，则 Pandas 会使用两个 DataFrame 中的共同列名。
- left_on 和 right_on：分别用于左右 DataFrame 的连接键，在列名不同时使用。
- how：指定如何合并。取值可以是 'inner'（内连接，这是默认值，表示只保留左右表格都存在的行）、'outer'（外连接，表示保留所有的行）、'left'（左连接，表示保留左表的行）或 'right'（右连接，保留右表的行）。

```python
import pandas as pd

df1 = pd.DataFrame({'key': ['K0', 'K1', 'K2', 'K3'],
                    'A': ['A0', 'A1', 'A2', 'A3']})

df2 = pd.DataFrame({'key': ['K0', 'K1', 'K4', 'K5'],
                    'B': ['B0', 'B1', 'B4', 'B5']})

result = pd.merge(df1, df2, on='key')

print(result)
```

上面的程序，按照 'key' 列的数据进行合并。如果某一行的 'key' 列的值在两个表中都存在，则这一行会出现在合并结果中。合并结果包含了两个表所有的列。合并结果如下：

```
  key   A   B
0  K0  A0  B0
1  K1  A1  B1
```

DataFrame.join(other, on=None, how='left') 方法的参数如下：
- other：一个或多个要加入的DataFrame。
- on：用于连接的列名或索引级别名称。如果要根据列进行连接，则该列必须是索引列。
- how：指定如何合并。取值可以是'left'（默认）、'right'、'outer'或'inner'，用法与 merge() 函数中的 how 参数相同。

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

上面的程序，按照索引进行数据合并。因为合并方式选择了 'outer'，左右两个表的所有行都会出现在结果表中。缺失的数据用 NaN 表示，比如 K1 这一行数据，只在左表中有，原本右表的列中就不会有它的数据，所有 C，D 列中，它的数据是 NaN。合并结果如下：

```
      A    B    C    D
K0   A0   B0   C0   D0
K1   A1   B1  NaN  NaN
K2   A2   B2   C2   D2
K3  NaN  NaN   C3   D3
```

## 数据分组

我们曾经在[统计测数](counter#pandas-库)一节，简要介绍了 DataFrame 的分组功能。 

## 数据的重塑

Pivot, Melt



## 数据清洁：

处理缺失数据（例如：NaN）。
支持数据过滤、清洗、转换。



