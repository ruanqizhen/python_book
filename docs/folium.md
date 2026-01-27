# 地理数据和 Folium

在数据分析中，如果数据包含经纬度或其他地理信息，单纯的图表往往无法直观展示数据的分布规律。这时，我们需要地图。

Folium 是一个强大的 Python 库，用于创建交互式地图。它建立在强大的 JavaScript 库 `Leaflet.js` 之上，充当了 Python 数据处理能力（如 Pandas）与 Leaflet 强大的地图可视化能力之间的桥梁。通过 Folium，你可以轻松地将处理后的数据（例如坐标、形状、路径、热力图等）在地图上进行可视化，并生成 HTML 文件，方便在网页上展示。

以下是 Folium 的核心功能和使用方法：

## 安装

Folium 是个第三方包，如果还没有安装，可以通过以下命令安装：

```bash
pip install folium

```

## 创建基本地图

创建一个基本地图非常简单。可以使用 `folium.Map` 类来生成一个基于某个中心点和缩放级别的地图。

```python
import folium

# 创建一个地图对象
# location: [纬度, 经度]，这里以旧金山为例
# zoom_start: 初始缩放级别 (0-18)，数值越大越详细
mymap = folium.Map(location=[37.7749, -122.4194], zoom_start=12)

# 在 Jupyter Notebook 中直接输入对象名即可显示地图
mymap

```

## 添加标记（Marker）

地图上最常见的元素就是标记。我们可以在特定位置添加标记，并支持点击弹出信息（Popup）和鼠标悬停提示（Tooltip）。

```python
# 添加一个带有弹出信息和图标的标记
folium.Marker(
    location=[37.7749, -122.4194],
    popup="<b>这里是旧金山</b><br>点击查看详情",  # 支持 HTML 格式
    tooltip="点击我",
    icon=folium.Icon(color="blue", icon="info-sign")
).add_to(mymap)

# 添加一个自定义颜色的标记
folium.Marker(
    location=[37.779, -122.42],
    popup="另一个位置",
    icon=folium.Icon(color="red", icon="cloud")
).add_to(mymap)

mymap

```

## 不同的图层和 Tiles

Folium 支持多种底图样式（Tiles）。可以通过 `tiles` 参数改变地图风格。

*注意：早期的 `Stamen` 系列底图服务已发生变更，现在推荐使用 `CartoDB` 或 `OpenStreetMap`。*

```python
# 使用 CartoDB Positron 风格（简洁灰白色，适合叠加数据）
mymap = folium.Map(location=[37.7749, -122.4194], zoom_start=12, tiles='CartoDB positron')
mymap

```

常见的 `tiles` 选项包括：

* `"OpenStreetMap"`（默认）：标准的彩色街道地图。
* `"CartoDB positron"`：浅色极简风格，非常适合作为数据可视化的底图。
* `"CartoDB dark_matter"`：深色风格，适合展示夜间数据或发光效果。

## 绘制形状（圆形和折线）

除了点标记，Folium 还支持在地图上绘制几何形状，用于表示区域或路径。

### 圆形标记

```python
# 绘制一个圆形区域（按物理半径）
folium.Circle(
    location=[37.7749, -122.4194],
    radius=1000,      # 半径，单位是米
    popup="半径1公里的区域",
    color="crimson",
    fill=True,
    fill_color="crimson"
).add_to(mymap)

# 绘制一个固定像素大小的圆点（不随地图缩放改变大小）
folium.CircleMarker(
    location=[37.78, -122.41],
    radius=10,        # 半径，单位是像素
    popup="固定大小的点",
    color="#3186cc",
    fill=True
).add_to(mymap)

```

### 折线（PolyLine）

```python
# 绘制一条折线，展示路径
route_points = [
    [37.7749, -122.4194], 
    [37.8044, -122.2711],
    [37.85, -122.25]
]
folium.PolyLine(route_points, color="blue", weight=5, opacity=0.8).add_to(mymap)
mymap

```

## 标记聚类（MarkerCluster）

当数据点非常多（例如成千上万个）时，直接把所有标记画在地图上会导致地图变得混乱且卡顿。`MarkerCluster` 插件可以将临近的标记聚合在一起，随着地图放大再展开。

```python
from folium.plugins import MarkerCluster
import numpy as np

# 生成 50 个随机坐标
latitudes = np.random.uniform(37.70, 37.80, 50)
longitudes = np.random.uniform(-122.50, -122.35, 50)

# 创建地图
m = folium.Map(location=[37.75, -122.42], zoom_start=11)

# 创建聚类对象并添加到地图
marker_cluster = MarkerCluster().add_to(m)

# 将标记添加到聚类对象中，而不是直接添加到地图
for lat, lon in zip(latitudes, longitudes):
    folium.Marker(location=[lat, lon]).add_to(marker_cluster)

m

```

## 等值区域图（Choropleth Maps）

这是 Folium 最强大的功能之一。它允许你根据 GeoJSON 区域（如国家、州、县的边界）和对应的数据（如人口、GDP）来为地图着色。

假设我们有一个包含美国各州边界的 GeoJSON 文件和一个包含各州失业率的 CSV 数据。

```python
import pandas as pd

# 加载数据（示例 URL）
state_geo = 'https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json'
state_unemployment = 'https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/US_Unemployment_Oct2012.csv'
state_data = pd.read_csv(state_unemployment)

m = folium.Map(location=[48, -102], zoom_start=3)

folium.Choropleth(
    geo_data=state_geo,              # 地理边界数据 (GeoJSON)
    name='choropleth',
    data=state_data,                 # 数值数据 (DataFrame)
    columns=['State', 'Unemployment'], # [关联键列, 数值列]
    key_on='feature.id',             # GeoJSON 中用于匹配的键 (例如 feature.id 对应 State 缩写)
    fill_color='YlGn',               # 颜色配色方案 (Yellow to Green)
    fill_opacity=0.7,
    line_opacity=0.2,
    legend_name='Unemployment Rate (%)'
).add_to(m)

folium.LayerControl().add_to(m)
m

```

## 热力图（Heatmap）

热力图用于展示数据的密度。

```python
from folium.plugins import HeatMap

# 生成一些随机热力图数据 [纬度, 经度, 权重]
heat_data = [[37.7749 + np.random.uniform(-0.05, 0.05), 
              -122.4194 + np.random.uniform(-0.05, 0.05), 
              np.random.uniform(0, 1)] for _ in range(100)]

m = folium.Map(location=[37.7749, -122.4194], zoom_start=11)

# 添加热力图层
HeatMap(heat_data, radius=15).add_to(m)

m

```

## 常用插件

Folium 拥有丰富的插件生态系统，可以通过 `folium.plugins` 导入。

* **MiniMap**: 在右下角显示一个总览小地图。
* **MousePosition**: 显示鼠标当前所在位置的经纬度。
* **MeasureControl**: 测量距离和面积的工具。

```python
from folium.plugins import MiniMap, MousePosition

m = folium.Map(location=[37.7749, -122.4194], zoom_start=10)

# 添加小地图
minimap = MiniMap(toggle_display=True)
m.add_child(minimap)

# 添加鼠标位置显示
formatter = "function(num) {return L.Util.formatNum(num, 5);};"
MousePosition(
    position='topright',
    separator=' | ',
    empty_string='NaN',
    lng_first=True,
    num_digits=20,
    prefix='坐标:',
    lat_formatter=formatter,
    lng_formatter=formatter,
).add_to(m)

m

```

## 保存地图

Folium 生成的地图本质上是一个 HTML 文件。你可以将其保存并在任何浏览器中打开，或者嵌入到你的网站中。

```python
m.save("my_interactive_map.html")

```
