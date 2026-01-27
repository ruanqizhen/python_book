# 数据图形化和 Matplotlib

## 简介

Matplotlib 是一个绘图库，用于创建各种数据可视化图表。它功能强大，灵活性高，能够生成从简单到复杂的静态、交互式和动画式的图形。

Matplotlib 支持多种图表类型，比如：折线图（Line plot）、柱状图（Bar plot）、热图（Heatmap）等等。它可以自定义图表的标题、坐标轴标签、图例、网格、颜色、线型、标记样式等。还可以灵活调整图形的大小、布局和样式。

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

有了下载地址，我们就可以使用 [Pandas](https://www.google.com/search?q=pandas) 库将数据加载到程序中。下面是装载数据集的示例代码：

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

## 常用图表

### 散点图（Scatter plot）

散点图用于显示两个变量之间的关系。我们选择 花瓣长度（petal length） 和 花瓣宽度（petal width），用点图展示不同类别的分布。

使用 Matplotlib 原生绘图：

```python
import matplotlib.pyplot as plt

# 设置颜色
colors = ['red', 'green', 'blue']
species = df['species_name'].unique()

# 绘制散点图
plt.figure(figsize=(8, 6))
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

使用 Seaborn 绘图（代码通常更简洁）：

```python
import matplotlib.pyplot as plt
import seaborn as sns

# 使用 seaborn 绘制散点图
plt.figure(figsize=(8, 6))
sns.scatterplot(data=df, x='petal length (cm)', y='petal width (cm)', hue='species_name', palette='deep')
plt.title("Iris Dataset - Petal Length vs Width")
plt.show()

```

### 折线图（Line plot）

折线图通常用于显示数据随时间变化的趋势。虽然鸢尾花数据集没有时间维度，但我们可以通过对数据进行排序，来观察某种属性的变化趋势。下面的代码展示了不同种类的花瓣长度变化曲线。

```python
import matplotlib.pyplot as plt
import seaborn as sns

# 为了展示效果，我们先对数据按花瓣长度进行排序
df_sorted = df.sort_values(by='petal length (cm)').reset_index()

plt.figure(figsize=(10, 6))
# 绘制折线图
sns.lineplot(data=df_sorted, x=df_sorted.index, y='petal length (cm)', hue='species_name')

plt.title("Petal Length Trend by Species")
plt.xlabel("Sample Index (Sorted)")
plt.ylabel("Petal Length (cm)")
plt.show()

```

### 柱状图（Bar plot）

柱状图用于比较不同类别的数值。例如，我们可以计算每种鸢尾花的平均花瓣长度，并用柱状图进行对比。

```python
# 计算每种花的平均花瓣长度
avg_data = df.groupby('species_name')['petal length (cm)'].mean().reset_index()

plt.figure(figsize=(8, 6))
# 使用 Seaborn 绘制柱状图
sns.barplot(data=avg_data, x='species_name', y='petal length (cm)', palette='viridis')

plt.title("Average Petal Length per Species")
plt.ylabel("Average Length (cm)")
plt.show()

```

### 饼图（Pie chart）

饼图用于显示各部分占整体的比例。虽然 Seaborn 不直接支持饼图，但 Matplotlib 提供了 `pie` 函数。我们可以查看数据集中不同种类样本的数量比例（在鸢尾花数据集中，三类样本是均匀分布的，各占 50 个）。

```python
# 统计每种花的数量
species_counts = df['species_name'].value_counts()

plt.figure(figsize=(6, 6))
plt.pie(species_counts, labels=species_counts.index, autopct='%1.1f%%', colors=['#ff9999','#66b3ff','#99ff99'])
plt.title("Distribution of Species")
plt.show()

```

### 直方图（Histogram）

直方图用于展示单个变量的数据分布情况（例如数据集中在哪一个区间）。我们可以看看花萼长度（sepal length）的分布情况。

```python
plt.figure(figsize=(8, 6))
# kde=True 表示同时绘制核密度估计曲线（一条平滑的曲线）
sns.histplot(data=df, x='sepal length (cm)', kde=True, hue='species_name', element="step")

plt.title("Distribution of Sepal Length")
plt.show()

```

### 箱线图（Box plot）

箱线图是统计学中非常重要的图表，它能直观地显示数据的分散情况、中位数、四分位数以及异常值（Outliers）。

```python
plt.figure(figsize=(8, 6))
sns.boxplot(data=df, x='species_name', y='sepal width (cm)', palette="Set2")

plt.title("Boxplot of Sepal Width by Species")
plt.show()

```

在上图中，箱子中间的线代表中位数，箱子的上下边界代表四分位数，而箱子外部的独立点则代表异常值。

### 极坐标图（Polar plot）

极坐标图（或雷达图）常用于多维数据的对比。比如我们可以对比三种鸢尾花在四个特征维度上的平均表现。

```python
import numpy as np

# 计算每种花的四个特征的均值
features = ['sepal length (cm)', 'sepal width (cm)', 'petal length (cm)', 'petal width (cm)']
mean_values = df.groupby('species_name')[features].mean()

# 设置雷达图的角度
angles = np.linspace(0, 2 * np.pi, len(features), endpoint=False).tolist()
angles += angles[:1]  # 闭合图形

fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))

for species in mean_values.index:
    values = mean_values.loc[species].tolist()
    values += values[:1]  # 闭合图形
    ax.plot(angles, values, label=species)
    ax.fill(angles, values, alpha=0.25)

ax.set_xticks(angles[:-1])
ax.set_xticklabels(features)
plt.title("Average Features by Species (Radar Chart)")
plt.legend(loc='upper right', bbox_to_anchor=(1.3, 1.0))
plt.show()

```

### 热图（Heatmap）

热图通过颜色的深浅来表示数值的大小，常用于展示特征之间的相关性矩阵。

```python
# 计算特征之间的相关系数
corr = df.iloc[:, 0:4].corr()

plt.figure(figsize=(8, 6))
# annot=True 表示在格子里显示具体数值，cmap='coolwarm' 设置冷暖色调
sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f")

plt.title("Correlation Heatmap of Iris Features")
plt.show()

```

从热图中我们可以直观地看到，花瓣长度和花瓣宽度有极强的正相关性（红色，接近 1.0），而花萼宽度和花瓣长度则呈负相关。

## 布局

在实际应用中，我们经常需要将多个图表放在同一个画布上进行对比。Matplotlib 的 `subplots` 函数可以轻松实现这一点。

下面的代码创建了一个  的网格，并在每个格子里绘制不同的图表：

```python
# 创建 2x2 的子图布局，设置总画布大小
fig, axes = plt.subplots(2, 2, figsize=(15, 12))

# 图1：散点图 (左上)
sns.scatterplot(data=df, x='sepal length (cm)', y='sepal width (cm)', hue='species_name', ax=axes[0, 0])
axes[0, 0].set_title('Sepal Length vs Width')

# 图2：箱线图 (右上)
sns.boxplot(data=df, x='species_name', y='petal length (cm)', ax=axes[0, 1])
axes[0, 1].set_title('Petal Length Boxplot')

# 图3：直方图 (左下)
sns.histplot(data=df, x='petal width (cm)', kde=True, hue='species_name', ax=axes[1, 0])
axes[1, 0].set_title('Petal Width Distribution')

# 图4：小提琴图 (右下 - 类似箱线图，但能显示密度分布)
sns.violinplot(data=df, x='species_name', y='sepal length (cm)', ax=axes[1, 1])
axes[1, 1].set_title('Sepal Length Violin Plot')

# 自动调整布局，防止标签重叠
plt.tight_layout()
plt.show()

```

通过 `axes[row, col]` 我们可以精确控制每一个子图的内容，这对于生成综合的数据分析报告非常有用。
