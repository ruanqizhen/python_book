# Data Visualization and Matplotlib

## Introduction

Matplotlib is a comprehensive library for creating static, animated, and interactive visualizations in Python. It is highly flexible and capable of generating everything from simple plots to complex, customized graphics.

It supports a wide range of chart types—including line plots, scatter plots, bar charts, histograms, and heatmaps. It allows for full customization of chart elements like titles, axis labels, legends, grids, colors, line styles, and markers, as well as layout properties like figure size and spacing.

Seaborn is another popular data visualization library built on top of Matplotlib and integrated with Pandas. It provides a high-level interface for drawing attractive and informative statistical graphics, enabling you to quickly generate professional-grade charts with less code.

You can install both libraries using `pip`:

```sh
pip install matplotlib seaborn
```

Import them in your script:

```python
import seaborn as sns
import matplotlib.pyplot as plt

```

## Dataset

Before creating plots, we need some data to work with. In the fields of data science and machine learning, several classic toy datasets are widely used for demonstration, including the Iris flower dataset, the Boston Housing dataset, and the Titanic passenger dataset. We will use the Iris dataset to demonstrate Matplotlib and Seaborn.

These datasets are typically stored in CSV format, where each row represents an individual sample (e.g., an iris flower or a passenger) and each column represents a feature (e.g., petal length, age, or survival status).

Here are some common sources for these datasets:

* [UCI Machine Learning Repository](https://archive.ics.uci.edu/)
* [Kaggle Datasets](https://www.kaggle.com/datasets)

We can use Pandas to read these CSV files directly from their URLs. Below is the code to load them:

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

Many Python libraries, such as Scikit-learn, bundle these toy datasets. If you have Scikit-learn installed, you can load the dataset directly without downloading files manually:

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

**All subsequent examples in this chapter assume you are using the Iris DataFrame (`df`) created above.**

## Common Charts

### Scatter plot

A scatter plot displays the relationship between two numerical variables. Here, we plot petal length against petal width to see how the different iris species are distributed.

Plotting with pure Matplotlib:

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

Plotting with Seaborn (which is typically more concise and aesthetically polished by default):

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

Line plots are typically used to show continuous trends (often over time). Although the Iris dataset does not have a time dimension, we can sort the samples by petal length to visualize the distribution trend across the different species:

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

Bar charts compare numerical values across categorical groups. For example, we can compute the average petal length for each iris species and display the results in a bar plot:

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

Pie charts show the relative proportions of categories within a whole. While Seaborn does not have a built-in pie chart function, Matplotlib provides `plt.pie()`. The code below shows the distribution of species in our dataset (which is perfectly balanced with 50 samples per species):

```python
# Count the number of each species
species_counts = df['species_name'].value_counts()

plt.figure(figsize=(6, 6))
plt.pie(species_counts, labels=species_counts.index, autopct='%1.1f%%', colors=['#ff9999','#66b3ff','#99ff99'])
plt.title("Distribution of Species")
plt.show()

```

### Histogram

A histogram displays the frequency distribution of a single continuous variable, showing where the data points are concentrated. Let's look at the distribution of sepal lengths:

```python
plt.figure(figsize=(8, 6))
# kde=True also draws a kernel density estimate curve (a smooth curve)
sns.histplot(data=df, x='sepal length (cm)', kde=True, hue='species_name', element="step")

plt.title("Distribution of Sepal Length")
plt.show()

```

### Box plot

Box plots are essential statistical charts that visually summarize the distribution of data, highlighting the median, quartiles, and outliers:

```python
plt.figure(figsize=(8, 6))
sns.boxplot(data=df, x='species_name', y='sepal width (cm)', palette="Set2")

plt.title("Boxplot of Sepal Width by Species")
plt.show()

```

In a box plot, the horizontal line inside the box represents the median, the top and bottom edges of the box denote the 75th and 25th percentiles (quartiles), and individual points plotted outside the whiskers represent outliers.

### Polar plot

Polar plots (often used to create radar or spider charts) are ideal for comparing multi-dimensional profiles. For example, we can compare the average measurements of the three iris species across all four features:

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

Heatmaps represent tabular numbers using a color gradient, making them excellent for visualizing correlation matrices between features:

```python
# Calculate correlation coefficients between features
corr = df.iloc[:, 0:4].corr()

plt.figure(figsize=(8, 6))
# annot=True displays values in cells, cmap='coolwarm' sets the color scheme
sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f")

plt.title("Correlation Heatmap of Iris Features")
plt.show()

```

From this heatmap, you can quickly see that petal length and petal width are highly positively correlated (red squares near 1.0), whereas sepal width and petal length are weakly negatively correlated.

## Layout

In data analysis reports, it is often useful to place multiple charts on a single canvas for side-by-side comparison. Matplotlib's `plt.subplots()` function provides a clean way to manage layouts.

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

By indexing the `axes` array (e.g., `axes[row, col]`), you can direct specific plots to custom locations on the grid, making it highly effective for building comprehensive visualization dashboards.
