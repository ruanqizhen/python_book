# Geographic Data and Folium

In data analysis, standard charts and plots often fail to capture spatial distribution patterns when working with coordinates or geographic information. In these scenarios, maps are essential.

Folium is a powerful Python library designed for creating interactive maps. Built on top of the popular JavaScript library `Leaflet.js`, it acts as a bridge between Python's data-wrangling libraries (like Pandas) and Leaflet's mapping capabilities. With Folium, you can easily visualize coordinates, routes, regions, and heatmaps on an interactive map, and export the output as standard HTML files to render in any browser or web application.

Here are Folium's core features and typical use cases:

## Installation

To install Folium on your system, use `pip`:

```bash
pip install folium

```

## Creating a Basic Map

Instantiating a map is straightforward: use `folium.Map()` and specify the center coordinates and initial zoom level.

```python
import folium

# Create a map object
# location: [latitude, longitude], here using San Francisco as an example
# zoom_start: Initial zoom level (0-18), higher values mean more detail
mymap = folium.Map(location=[37.7749, -122.4194], zoom_start=12)

# In Jupyter Notebook, entering the map variable name will render the interactive map inline
mymap

```

## Adding Markers

Markers are the most fundamental mapping elements. You can place markers at specific latitude and longitude coordinates, adding text popups (rendered when clicked) or hover tooltips:

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

## Map Tiles and Styles

Folium supports a variety of map tile styles, which you can specify using the `tiles` parameter.

*Note: The Stamen tile services are no longer freely available; we recommend using OpenStreetMap or CartoDB styles.*

```python
# Use CartoDB Positron style (light gray and white, ideal for overlaying data)
mymap = folium.Map(location=[37.7749, -122.4194], zoom_start=12, tiles='CartoDB positron')
mymap

```

Common tile options include:

* `"OpenStreetMap"` (default): Standard color street map.
* `"CartoDB positron"`: Light minimalist style, ideal as a base map for data visualization.
* `"CartoDB dark_matter"`: Dark style, suitable for displaying nighttime data or glow effects.

## Drawing Shapes (Circles and Polylines)

You can also draw vector shapes like circles and polylines on a map to highlight regions or represent routes:

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

When plotting thousands of points, rendering individual markers can clutter the map and degrade browser performance. The `MarkerCluster` plugin groups neighboring points into aggregate markers that expand automatically as the user zooms in:

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

## Choropleth Maps (Regional Shading)

Choropleth maps shade regions (defined by a GeoJSON boundary file, such as country or state borders) based on a numeric variable (like population density or GDP).

For example, to map US state-level unemployment statistics, we pair a GeoJSON boundary file with a Pandas DataFrame:

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

Heatmaps visualize point density by representing concentrations of coordinates with hot and cold color gradients:

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

Folium's functionality can be extended using the `folium.plugins` module. Some common plugins include:

* **`MiniMap`**: Adds a small overview map in the corner to aid navigation.
* **`MousePosition`**: Displays the coordinates of the mouse cursor in real-time.
* **`MeasureControl`**: Adds ruler and area calculation tools directly to the map interface.

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
    prefix='Coordinates:',
    lat_formatter=formatter,
    lng_formatter=formatter,
).add_to(m)

m

```

## Saving Maps

To export your map as a standalone HTML page that can be opened in a browser or embedded in a web application, use the `.save()` method:

```python
m.save("my_interactive_map.html")

```
