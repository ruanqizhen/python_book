# Data Visualization and Matplotlib

## Introduction

Matplotlib is a plotting library for creating various data visualization charts. It is powerful and highly flexible, capable of generating static, interactive, and animated graphics ranging from simple to complex.

Matplotlib supports many chart types, such as: line plots, bar plots, heatmaps, and more. It allows customization of chart titles, axis labels, legends, grids, colors, line styles, marker styles, and more. You can also flexibly adjust figure size, layout, and style.

In addition, Seaborn is also a commonly used data visualization library. It is based on Matplotlib and Pandas, providing simpler, more elegant, and aesthetically pleasing plotting capabilities, enabling you to quickly generate professional-level statistical charts.

You can install these libraries with the following command:

```sh
pip install matplotlib, seaborn

```

Import them in your program:

```python
import seaborn as sns
import matplotlib.pyplot as plt

```

## Dataset

Before visualizing data, we need to prepare some data. In the field of artificial intelligence, several classic small datasets are widely used in teaching examples, including the Iris dataset, the Boston Housing dataset, and the Titanic passenger dataset. We will also use these datasets to demonstrate how to use the Matplotlib library.

First, we need to download these datasets and their descriptions online. These data are typically stored in CSV format, with each row representing one data item, such as an iris flower, a house, or a passenger. Each dataset contains different columns representing various features, such as petal length, house area, passenger age, etc.

Here are some commonly used data download URLs. If they are inaccessible, search for available web pages:

* [UCI Machine Learning Repository](https://archive.ics.uci.edu/)
* [Kaggle Datasets](https://www.kaggle.com/datasets)

Once we have the download URLs, we can use the [Pandas](https://www.google.com/search?q=pandas) library to load the data into the program. Below is example code for loading datasets:

```python
import pandas as pd

# Iris dataset URL
url = "https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data"

# Iris column names
columns = ['sepal_length', 'sepal_width', 'petal_length', 'petal_width', 'species']

# Load iris dataset
iris = pd.read_csv(url, header=None, names=columns)
print(iris.head())

# Titanic passenger dataset
titanic_url = "https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv"
titanic = pd.read_csv(titanic_url)
print(titanic.head())

```

Some Python machine learning libraries already bundle these small datasets. If you install these libraries, using the datasets becomes even simpler. For example, loading the Iris dataset using Scikit-learn:

```sh
pip install scikit-learn

```

```python
from sklearn.datasets import load_iris
import pandas as pd

# Load data
iris = load_iris()

# Convert to DataFrame
df = pd.DataFrame(data=iris.data, columns=iris.feature_names)
df['species'] = iris.target
df['species_name'] = df['species'].apply(lambda x: iris.target_names[x])

# View data
print(df.head())

```

**All example programs below use the iris df obtained here.**

## Common Charts

### Scatter plot

A scatter plot is used to display the relationship between two variables. We choose petal length and petal width, using a scatter plot to show the distribution of different species.

Using Matplotlib native plotting:

```python
import matplotlib.pyplot as plt

# Set colors
colors = ['red', 'green', 'blue']
species = df['species_name'].unique()

# Draw scatter plot
plt.figure(figsize=(8, 6))
for i, specie in enumerate(species):
    subset = df[df['species_name'] == specie]
    plt.scatter(subset['petal length (cm)'], subset['petal width (cm)'], 
                label=specie, color=colors[i])

# Add title and labels
plt.title("Iris Dataset - Petal Length vs Width")
plt.xlabel("Petal Length (cm)")
plt.ylabel("Petal Width (cm)")
plt.legend()
plt.show()

```

Using Seaborn (code is usually more concise):

```python
import matplotlib.pyplot as plt
import seaborn as sns

# Draw scatter plot using seaborn
plt.figure(figsize=(8, 6))
sns.scatterplot(data=df, x='petal length (cm)', y='petal width (cm)', hue='species_name', palette='deep')
plt.title("Iris Dataset - Petal Length vs Width")
plt.show()

```

### Line plot

Line plots are typically used to show trends in data over time. Although the Iris dataset does not have a time dimension, we can sort the data to observe variation trends in a certain attribute. The code below shows the petal length variation curves for different species.

```python
import matplotlib.pyplot as plt
import seaborn as sns

# For demonstration, sort the data by petal length
df_sorted = df.sort_values(by='petal length (cm)').reset_index()

plt.figure(figsize=(10, 6))
# Draw line plot
sns.lineplot(data=df_sorted, x=df_sorted.index, y='petal length (cm)', hue='species_name')

plt.title("Petal Length Trend by Species")
plt.xlabel("Sample Index (Sorted)")
plt.ylabel("Petal Length (cm)")
plt.show()

```

### Bar plot

Bar plots are used to compare values across different categories. For example, we can calculate the average petal length for each iris species and compare them with a bar plot.

```python
# Calculate average petal length per species
avg_data = df.groupby('species_name')['petal length (cm)'].mean().reset_index()

plt.figure(figsize=(8, 6))
# Draw bar plot using Seaborn
sns.barplot(data=avg_data, x='species_name', y='petal length (cm)', palette='viridis')

plt.title("Average Petal Length per Species")
plt.ylabel("Average Length (cm)")
plt.show()

```

### Pie chart

Pie charts are used to show the proportion of each part relative to the whole. While Seaborn does not directly support pie charts, Matplotlib provides the `pie` function. We can view the proportion of sample counts for each species in the dataset (in the Iris dataset, the three species are evenly distributed, each with 50 samples).

```python
# Count the number of each species
species_counts = df['species_name'].value_counts()

plt.figure(figsize=(6, 6))
plt.pie(species_counts, labels=species_counts.index, autopct='%1.1f%%', colors=['#ff9999','#66b3ff','#99ff99'])
plt.title("Distribution of Species")
plt.show()

```

### Histogram

A histogram is used to display the distribution of a single variable (e.g., which range the data is concentrated in). Let's look at the distribution of sepal length.

```python
plt.figure(figsize=(8, 6))
# kde=True also draws a kernel density estimate curve (a smooth curve)
sns.histplot(data=df, x='sepal length (cm)', kde=True, hue='species_name', element="step")

plt.title("Distribution of Sepal Length")
plt.show()

```

### Box plot

Box plots are very important in statistics. They intuitively show data dispersion, median, quartiles, and outliers.

```python
plt.figure(figsize=(8, 6))
sns.boxplot(data=df, x='species_name', y='sepal width (cm)', palette="Set2")

plt.title("Boxplot of Sepal Width by Species")
plt.show()

```

In the figure above, the line inside the box represents the median, the top and bottom boundaries of the box represent the quartiles, and the individual points outside the box represent outliers.

### Polar plot

Polar plots (or radar charts) are commonly used for comparing multi-dimensional data. For example, we can compare the average performance of the three iris species across four feature dimensions.

```python
import numpy as np

# Calculate mean of four features per species
features = ['sepal length (cm)', 'sepal width (cm)', 'petal length (cm)', 'petal width (cm)']
mean_values = df.groupby('species_name')[features].mean()

# Set radar chart angles
angles = np.linspace(0, 2 * np.pi, len(features), endpoint=False).tolist()
angles += angles[:1]  # Close the shape

fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))

for species in mean_values.index:
    values = mean_values.loc[species].tolist()
    values += values[:1]  # Close the shape
    ax.plot(angles, values, label=species)
    ax.fill(angles, values, alpha=0.25)

ax.set_xticks(angles[:-1])
ax.set_xticklabels(features)
plt.title("Average Features by Species (Radar Chart)")
plt.legend(loc='upper right', bbox_to_anchor=(1.3, 1.0))
plt.show()

```

### Heatmap

Heatmaps use color intensity to represent numerical values, commonly used to display correlation matrices between features.

```python
# Calculate correlation coefficients between features
corr = df.iloc[:, 0:4].corr()

plt.figure(figsize=(8, 6))
# annot=True displays values in cells, cmap='coolwarm' sets the color scheme
sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f")

plt.title("Correlation Heatmap of Iris Features")
plt.show()

```

From the heatmap, we can intuitively see that petal length and petal width have a very strong positive correlation (red, close to 1.0), while sepal width and petal length show a negative correlation.

## Layout

In practical applications, we often need to place multiple charts on the same canvas for comparison. Matplotlib's `subplots` function makes this easy.

The following code creates a 2x2 grid and plots different charts in each cell:

```python
# Create a 2x2 subplot layout, set overall figure size
fig, axes = plt.subplots(2, 2, figsize=(15, 12))

# Chart 1: Scatter plot (top-left)
sns.scatterplot(data=df, x='sepal length (cm)', y='sepal width (cm)', hue='species_name', ax=axes[0, 0])
axes[0, 0].set_title('Sepal Length vs Width')

# Chart 2: Box plot (top-right)
sns.boxplot(data=df, x='species_name', y='petal length (cm)', ax=axes[0, 1])
axes[0, 1].set_title('Petal Length Boxplot')

# Chart 3: Histogram (bottom-left)
sns.histplot(data=df, x='petal width (cm)', kde=True, hue='species_name', ax=axes[1, 0])
axes[1, 0].set_title('Petal Width Distribution')

# Chart 4: Violin plot (bottom-right - similar to box plot, but shows density distribution)
sns.violinplot(data=df, x='species_name', y='sepal length (cm)', ax=axes[1, 1])
axes[1, 1].set_title('Sepal Length Violin Plot')

# Automatically adjust layout to prevent label overlap
plt.tight_layout()
plt.show()

```

Using `axes[row, col]` we can precisely control the content of each subplot, which is very useful for generating comprehensive data analysis reports.
