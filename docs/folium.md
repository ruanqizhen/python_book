# 地理数据和 Folium
Folium 库，用于创建交互式地图，它为用户提供了简单的接口来生成各种类型的地图以及在地图上绘制数据，从而将将地理空间数据（例如坐标、形状、路径、热力图等）可视化。
Folium 是基于开源 JavaScript 库 `Leaflet.js` 创建的，经常会被在 Jupyter Notebook 中使用，非常适合进行可视化和展示地理数据。

以下是 Folium 的主要功能和使用方法：

## 安装
Folium 是个第三方包，如果还没有安装，可以通过以下命令安装：
```bash
pip install folium
```

## 创建基本地图
创建一个基本地图非常简单。可以使用 `folium.Map` 类来生成一个基于某个中心点和缩放级别的地图。

```python
import folium

# 创建一个地图对象，中心点为 (纬度, 经度)，默认缩放级别为 10
mymap = folium.Map(location=[37.7749, -122.4194], zoom_start=10)

# 显示地图
mymap
```

## 添加标记（Marker）
我们可以在地图的特定位置添加标记或注释。`folium.Marker` 是最常用的添加标记的方法。

```python
# 添加一个标记到地图
folium.Marker(
    location=[37.7749, -122.4194],  # 标记的位置
    popup="San Francisco",           # 弹出信息
    icon=folium.Icon(icon="cloud"),  # 标记图标
).add_to(mymap)

# 显示地图
mymap
```

## 不同的图层和 tiles
Folium 支持不同的瓦片图层，可以通过改变 `tiles` 参数来使用不同风格的地图。

```python
# 使用不同的地图图层
mymap = folium.Map(location=[37.7749, -122.4194], zoom_start=10, tiles='Stamen Terrain')
mymap
```

常见的 `tiles` 选项包括：
- `"OpenStreetMap"`（默认）
- `"Stamen Terrain"`
- `"Stamen Toner"`
- `"Stamen Watercolor"`
- `"CartoDB positron"`
- `"CartoDB dark_matter"`

## 圆形标记（Circle 和 CircleMarker）
除了普通的标记，Folium 还允许绘制圆形标记或圆。

```python
# 绘制一个圆形区域
folium.Circle(
    location=[37.7749, -122.4194],
    radius=500,          # 半径（米）
    popup="圆形标记",
    color="blue",
    fill=True,
    fill_color="blue"
).add_to(mymap)

# 显示地图
mymap
```

## 折线图层（Polyline）
可以绘制折线来展示路径或路线。

```python
# 绘制一条折线
points = [[37.7749, -122.4194], [37.8044, -122.2711]]
folium.PolyLine(points, color="green").add_to(mymap)

# 显示地图
mymap
```

## 图层控制（LayerControl）
Folium 提供图层控制，可以在地图上叠加多个图层并让用户选择显示哪些图层。

```python
# 添加不同的图层
folium.TileLayer('Stamen Terrain').add_to(mymap)
folium.TileLayer('CartoDB positron').add_to(mymap)

# 添加图层控制器
folium.LayerControl().add_to(mymap)

# 显示地图
mymap
```

## GeoJSON 数据
`Folium` 可以很好地处理 `GeoJSON` 格式的数据，这对可视化地理信息非常有用。

```python
import requests

# 加载 GeoJSON 数据（以旧金山社区边界为例）
url = 'https://raw.githubusercontent.com/python-visualization/folium/master/examples/data'
sf_geo = f'{url}/san-francisco.json'

# 将 GeoJSON 数据添加到地图
folium.GeoJson(sf_geo, name='geojson').add_to(mymap)

# 显示地图
mymap
```

## 热力图（Heatmap）
通过 `folium.plugins` 可以使用热力图等高级功能。需要先安装 `folium[plugins]`。

```python
from folium.plugins import HeatMap

# 热力图数据（假设是纬度、经度、强度的列表）
heat_data = [[37.7749, -122.4194, 0.5], [37.8044, -122.2711, 0.8]]

# 创建热力图
HeatMap(heat_data).add_to(mymap)

# 显示地图
mymap
```

## 保存地图
最终生成的地图可以保存为 HTML 文件，便于分享或嵌入网页。

```python
mymap.save("my_map.html")
```

## 其他插件
Folium 支持许多插件来增强其功能，比如迷你地图、测距工具、时间滑块等。可以通过 `folium.plugins` 模块导入并使用这些插件。

- **MeasureControl**: 测量距离和面积的工具。
- **MiniMap**: 在大地图上显示一个小地图。
- **TimeSliderChoropleth**: 使用时间滑块展示随时间变化的数据。

例如：

```python
from folium.plugins import MiniMap

# 添加 MiniMap 到主地图
minimap = MiniMap()
mymap.add_child(minimap)

# 显示地图
mymap
```

