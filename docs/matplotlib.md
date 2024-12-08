# 数据图形化和 Matplotlib

## 简介

Matplotlib 是一个绘图库，用于创建各种数据可视化图表。它功能强大，灵活性高，能够生成从简单到复杂的静态、交互式和动画式的图形。

Matplotlib 支持多种图表类型，比如：折线图（Line plot）、柱状图（Bar plot）、热图（Heatmap）等等。它可以自定义图表真的标题、坐标轴标签、图例、网格、颜色、线型、标记样式等。还可以灵活调整图形的大小、布局和样式。

此外，Seaborn 也是常用的数据图形化库，它基于 Matplotlib 和 Pandas，提供了更加简单、优雅且美观的绘图功能，能够快速生成专业级别的统计图。

可以通过以下命令安装这几个库：

```sh
pip install matplotlib, seaborn
```

在程序中导入功能：

```python
import seaborn as sns
import matplotlib.pyplot as plt
```

## 数据集

在图形化显示数据之前，我们需要准备一些数据。在人工智能领域，几个经典的小数据集广泛用于教学示例，包括鸢尾花数据集、波士顿房价数据集和泰坦尼克号乘客数据集。我们也使用这些数据集演示如何使用 Matplotlib 库。

首先，我们需要在网上下载这些数据集及其说明。这些数据通常以 CSV 格式存在，每一行代表一个数据项，例如一朵鸢尾花、一座房子或一位乘客。每个数据集包含不同的列，代表各种特征，例如花瓣长度、房子面积、乘客年龄等。

以下是几个常用的数据下载地址。如果无法访问，请重新搜索可用的网页：

* [UCI 机器学习数据集](https://archive.ics.uci.edu/)
* [Kaggle 机器学习数据集](https://www.kaggle.com/datasets)

有了下载地址，我们就可以使用 [Pandas](pandas) 库将数据加载到程序中。下面是装载数据集的示例代码：

```python
import pandas as pd

# 鸢尾花数据集 URL
url = "https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data"

# 鸢尾花列名
columns = ['sepal_length', 'sepal_width', 'petal_length', 'petal_width', 'species']

# 加载鸢尾花数据集
iris = pd.read_csv(url, header=None, names=columns)
print(iris.head())

# 泰坦尼克乘客信息数据集
titanic_url = "https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv"
titanic = pd.read_csv(titanic_url)
print(titanic.head())
```

Python 的一些机器学习的库，已经打包了这些小数据集，如果安装这些库，会更简化数据集的使用。比如使用 Scikit-learn 库加载鸢尾花数据集：

```sh
pip install scikit-learn
```

```python
from sklearn.datasets import load_iris
import pandas as pd

# 加载数据
iris = load_iris()

# 转换为 DataFrame
df = pd.DataFrame(data=iris.data, columns=iris.feature_names)
df['species'] = iris.target
df['species_name'] = df['species'].apply(lambda x: iris.target_names[x])

# 查看数据
print(df.head())
```

**下文所有示例程序，都使用这里得到的鸢尾花 df。**

## 散点图

散点图（Scatter plot）

我们选择 花瓣长度 和 花瓣宽度，用点图展示不同类别的分布。

```python
import matplotlib.pyplot as plt

# 设置颜色
colors = ['red', 'green', 'blue']
species = df['species_name'].unique()

# 绘制散点图
for i, specie in enumerate(species):
    subset = df[df['species_name'] == specie]
    plt.scatter(subset['petal length (cm)'], subset['petal width (cm)'], 
                label=specie, color=colors[i])

# 添加标题和标签
plt.title("Iris Dataset - Petal Length vs Width")
plt.xlabel("Petal Length (cm)")
plt.ylabel("Petal Width (cm)")
plt.legend()
plt.show()
```
或者

```python
import matplotlib.pyplot as plt
import seaborn as sns

# 使用 seaborn 绘制散点图
sns.scatterplot(data=df, x='petal length (cm)', y='petal width (cm)', hue='species_name', palette='deep')
plt.title("Iris Dataset - Petal Length vs Width")
plt.show()
```

## 未完成......
折线图（Line plot）
柱状图（Bar plot）
饼图（Pie chart）
散点图（Scatter plot）
直方图（Histogram）
箱线图（Box plot）
极坐标图（Polar plot）
热图（Heatmap）

## 布局
