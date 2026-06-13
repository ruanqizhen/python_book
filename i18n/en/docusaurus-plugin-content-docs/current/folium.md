# Geographic Data and Folium

In data analysis, if the data contains latitude/longitude or other geographic information, charts alone often cannot intuitively display the distribution patterns of the data. In such cases, we need maps.

Folium is a powerful Python library for creating interactive maps. It is built on top of the powerful JavaScript library `Leaflet.js`, serving as a bridge between Python's data processing capabilities (such as Pandas) and Leaflet's powerful map visualization capabilities. With Folium, you can easily visualize processed data (such as coordinates, shapes, routes, heatmaps, etc.) on a map and generate HTML files for convenient display on web pages.

The following are Folium's core features and usage methods:

## Installation

Folium is a third-party package. If you haven't installed it yet, you can install it with the following command:

```bash
pip install folium

```

## Creating a Basic Map

Creating a basic map is very simple. You can use the `folium.Map` class to generate a map based on a center point and zoom level.

```python
import folium

# Create a map object
# location: [latitude, longitude], here using San Francisco as an example
# zoom_start: Initial zoom level (0-18), higher values mean more detail
mymap = folium.Map(location=[37.7749, -122.4194], zoom_start=12)

# In Jupyter Notebook, simply enter the object name to display the map
mymap

```

## Adding Markers

The most common element on a map is a marker. We can add markers at specific locations, supporting click popup information (Popup) and mouse hover tooltips (Tooltip).

```python
# Add a marker with popup information and icon
folium.Marker(
    location=[37.7749, -122.4194],
    popup="<b>This is San Francisco</b><br>Click for details",  # Supports HTML format
    tooltip="Click me",
    icon=folium.Icon(color="blue", icon="info-sign")
).add_to(mymap)

# Add a marker with custom color
folium.Marker(
    location=[37.779, -122.42],
    popup="Another location",
    icon=folium.Icon(color="red", icon="cloud")
).add_to(mymap)

mymap

```

## Different Layers and Tiles

Folium supports multiple base map styles (Tiles). You can change the map style through the `tiles` parameter.

*Note: The earlier Stamen series of base map services have changed, and it is now recommended to use CartoDB or OpenStreetMap.*

```python
# Use CartoDB Positron style (light gray and white, ideal for overlaying data)
mymap = folium.Map(location=[37.7749, -122.4194], zoom_start=12, tiles='CartoDB positron')
mymap

```

Common `tiles` options include:

* `"OpenStreetMap"` (default): Standard color street map.
* `"CartoDB positron"`: Light minimalist style, ideal as a base map for data visualization.
* `"CartoDB dark_matter"`: Dark style, suitable for displaying nighttime data or glow effects.

## Drawing Shapes (Circles and Polylines)

In addition to point markers, Folium also supports drawing geometric shapes on the map to represent areas or routes.

### Circle Markers

```python
# Draw a circular area (by physical radius)
folium.Circle(
    location=[37.7749, -122.4194],
    radius=1000,      # Radius in meters
    popup="Area with 1km radius",
    color="crimson",
    fill=True,
    fill_color="crimson"
).add_to(mymap)

# Draw a fixed pixel-size circle (does not change size when zooming)
folium.CircleMarker(
    location=[37.78, -122.41],
    radius=10,        # Radius in pixels
    popup="Fixed size point",
    color="#3186cc",
    fill=True
).add_to(mymap)

```

### Polylines

```python
# Draw a polyline to show a route
route_points = [
    [37.7749, -122.4194], 
    [37.8044, -122.2711],
    [37.85, -122.25]
]
folium.PolyLine(route_points, color="blue", weight=5, opacity=0.8).add_to(mymap)
mymap

```

## Marker Clustering

When there are a large number of data points (e.g., thousands), drawing all markers directly on the map can make it cluttered and sluggish. The `MarkerCluster` plugin can aggregate nearby markers together, which expand as the map zooms in.

```python
from folium.plugins import MarkerCluster
import numpy as np

# Generate 50 random coordinates
latitudes = np.random.uniform(37.70, 37.80, 50)
longitudes = np.random.uniform(-122.50, -122.35, 50)

# Create a map
m = folium.Map(location=[37.75, -122.42], zoom_start=11)

# Create cluster object and add to map
marker_cluster = MarkerCluster().add_to(m)

# Add markers to the cluster object, rather than directly to the map
for lat, lon in zip(latitudes, longitudes):
    folium.Marker(location=[lat, lon]).add_to(marker_cluster)

m

```

## Choropleth Maps

This is one of Folium's most powerful features. It allows you to color a map based on GeoJSON regions (such as country, state, or county boundaries) and corresponding data (such as population, GDP).

Suppose we have a GeoJSON file containing the boundaries of US states and CSV data containing the unemployment rates for each state.

```python
import pandas as pd

# Load data (example URLs)
state_geo = 'https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json'
state_unemployment = 'https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/US_Unemployment_Oct2012.csv'
state_data = pd.read_csv(state_unemployment)

m = folium.Map(location=[48, -102], zoom_start=3)

folium.Choropleth(
    geo_data=state_geo,              # Geographic boundary data (GeoJSON)
    name='choropleth',
    data=state_data,                 # Numeric data (DataFrame)
    columns=['State', 'Unemployment'], # [Join key column, Value column]
    key_on='feature.id',             # Key in GeoJSON for matching (e.g., feature.id corresponds to State abbreviation)
    fill_color='YlGn',               # Color scheme (Yellow to Green)
    fill_opacity=0.7,
    line_opacity=0.2,
    legend_name='Unemployment Rate (%)'
).add_to(m)

folium.LayerControl().add_to(m)
m

```

## Heatmaps

Heatmaps are used to display the density of data.

```python
from folium.plugins import HeatMap

# Generate some random heatmap data [latitude, longitude, weight]
heat_data = [[37.7749 + np.random.uniform(-0.05, 0.05), 
              -122.4194 + np.random.uniform(-0.05, 0.05), 
              np.random.uniform(0, 1)] for _ in range(100)]

m = folium.Map(location=[37.7749, -122.4194], zoom_start=11)

# Add heatmap layer
HeatMap(heat_data, radius=15).add_to(m)

m

```

## Common Plugins

Folium has a rich plugin ecosystem that can be imported via `folium.plugins`.

* **MiniMap**: Display a small overview map in the bottom-right corner.
* **MousePosition**: Display the latitude and longitude of the current mouse position.
* **MeasureControl**: A tool for measuring distances and areas.

```python
from folium.plugins import MiniMap, MousePosition

m = folium.Map(location=[37.7749, -122.4194], zoom_start=10)

# Add minimap
minimap = MiniMap(toggle_display=True)
m.add_child(minimap)

# Add mouse position display
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

## Saving Maps

A map generated by Folium is essentially an HTML file. You can save it and open it in any browser, or embed it in your website.

```python
m.save("my_interactive_map.html")

```
