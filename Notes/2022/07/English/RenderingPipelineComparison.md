# Rendering Pipeline Comparison (2022.07.27)
[Home](/README.md)

# Environment

|Type|Name|
|---|---|
|OS|Windows 10 Pro 64|
|Processor|Intel(R) Core(TM) i7-10700 CPU @ 2.90GHz (16 CPUs), ~2.9GHz|
|Memory|32768MB RAM|
|Device|NVIDIA GeFore RTX 3080|
|VRAM|10077MB|
|Display|1920 &times; 1200 (32 bit) (59 Hz)|
|Build Configuration|Debug / Windows|

# Comparison Methods

## Bandwidth Comparison<sup>[Thibieroz04](#Thibieroz04)</sup>

```
\textrm{Bandwidth}_{60\textrm{fps}} = \left(\textrm{W} \times \textrm{H} \times \left[ \textrm{MRT}_{\textrm{BPP}} \times   
 n_{\textrm{MRT}} \times n + \textrm{Z}_\textrm{BPP} \times \textrm{Overdraw} + \textrm{T}_\textrm{BPP} \times \textrm{T}_\textrm{B} + n \times \left(2 \times \textrm{BB}_\textrm{BPP} + \textrm{T}_\textrm{S} \times \textrm{T}_\textrm{BPP} \right ) \right ] + \textrm{C}_\textrm{Geometry} \right ) \times 60 \textrm{Bytes} / \textrm{s}
```

## Storage Comparison

* Normal<sup>[Koonce07](#Koonce07)</sup>
  * R8G8B8A8 vs R10G10B10R2 vs R16G16F vs R16G16B16A16F
    * Deferring Cost
    * Decoding Cost
    * Sampling and Storage
    * Quality
    * Free Components

## Duration

### Frame Duration

![FrameDurationBarAll](/Images/DeferredShading/FrameDurationBarAll.png)

![FrameDurationBarDeferred](/Images/DeferredShading/FrameDurationBarDeferred.png)

![FrameDurationBarDeferredNoDefault](/Images/DeferredShading/FrameDurationBarDeferredNoDefault.png)

![FrameDurationBarForward](/Images/DeferredShading/FrameDurationBarForward.png)

![FrameDurationBarForwardNoDefault](/Images/DeferredShading/FrameDurationBarForwardNoDefault.png)

### Light Phase Duration

![LightPhaseDurationBarAll](/Images/DeferredShading/LightPhaseDurationBarAll.png)

![LightPhaseDurationBarAllNoDefault](/Images/DeferredShading/LightPhaseDurationBarAllNoDefault.png)

![LightPhaseDurationBarTiled](/Images/DeferredShading/LightPhaseDurationBarTiled.png)

![LightPhaseDurationBarClustered](/Images/DeferredShading/LightPhaseDurationBarClustered.png)

### Render Color Duration

![RenderColorDurationBarAll](/Images/DeferredShading/RenderColorDurationBarAll.png)

![RenderColorDurationBarDeferred](/Images/DeferredShading/RenderColorDurationBarDeferred.png)

![RenderColorDurationBarDeferredNoDefault](/Images/DeferredShading/RenderColorDurationBarDeferredNoDefault.png)

![RenderColorDurationBarForward](/Images/DeferredShading/RenderColorDurationBarForward.png)

![RenderColorDurationBarForwardNoDefault](/Images/DeferredShading/RenderColorDurationBarForwardNoDefault.png)

![RenderColorDurationBarTiled](/Images/DeferredShading/RenderColorDurationBarTiled.png)

![RenderColorDurationBarTiledNoShading](/Images/DeferredShading/RenderColorDurationBarTiledNoShading.png)

![RenderColorDurationBarClustered](/Images/DeferredShading/RenderColorDurationBarClustered.png)

### Tile / Cluster Assignment Duration

![TileClusterAssignmentDurationBarAll](/Images/DeferredShading/TileClusterAssignmentDurationBarAll.png)

![TileClusterAssignmentDurationBarDeferred](/Images/DeferredShading/TileClusterAssignmentDurationBarDeferred.png)

![TileClusterAssignmentDurationBarDeferredNoShading](/Images/DeferredShading/TileClusterAssignmentDurationBarDeferredNoShading.png)

![TileClusterAssignmentDurationBarForward](/Images/DeferredShading/TileClusterAssignmentDurationBarForward.png)

![TileClusterAssignmentDurationBarTiled](/Images/DeferredShading/TileClusterAssignmentDurationBarTiled.png)

![TileClusterAssignmentDurationBarClustered](/Images/DeferredShading/TileClusterAssignmentDurationBarClustered.png)

## Bandwidth

### Frame

<table>
    <thead>
        <tr>
            <th rowspan="3">Pipeline</th>
            <th colspan="6">Frame</th>
        </tr>
        <tr>
            <th colspan="3">DRAM Read/Write Utilization</th>
            <th>DRAM Activity</th>
            <th>L1 Cache</th>
            <th>L2 Cache</th>
        </tr>
        <tr>
            <th>Percentage utilization of DRAM reads</th>
            <th>Percentage utilization of DRAM writes</th>
            <th>Total DRAM Read/Write Utilization</th>
            <th>Percentage of memory cycles that a read or write request to DRAM was active</th>
            <th>Read/write utilization</th>
            <th>Read/write utilization</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Forward</td>
            <td>16.333333</td>
            <td>1</td>
            <td>17.333333</td>
            <td>17.666667</td>
            <td>53.666667</td>
            <td>13.666667</td>
        </tr>
        <tr>
            <td>Forward+</td>
            <td>35.333333</td>
            <td>2</td>
            <td>37.333333</td>
            <td>37.333333</td>
            <td>24.333333</td>
            <td>26.666667</td>
        </tr>
        <tr>
            <td>Forward+ 2.5D Culling</td>
            <td>35.666667</td>
            <td>2</td>
            <td>37.666667</td>
            <td>37.666667</td>
            <td>24.666667</td>
            <td>26.666667</td>
        </tr>
        <tr>
            <td>Forward+ 2.5D, AABB-based Culling</td>
            <td>38.666667</td>
            <td>2</td>
            <td>40.666667</td>
            <td>41</td>
            <td>18.666667</td>
            <td>29</td>
        </tr>
        <tr>
            <td>Forward Clustered</td>
            <td>34</td>
            <td>2</td>
            <td>36</td>
            <td>36.333333</td>
            <td>23.333333</td>
            <td>26</td>
        </tr>
        <tr>
            <td>Deferred</td>
            <td>20</td>
            <td>1</td>
            <td>21</td>
            <td>21</td>
            <td>53</td>
            <td>17</td>
        </tr>
        <tr>
            <td>Deferred Tiled</td>
            <td>37</td>
            <td>2</td>
            <td>39</td>
            <td>39</td>
            <td>21</td>
            <td>28</td>
        </tr>
        <tr>
            <td>Deferred Tiled 2.5D Culling</td>
            <td>36.333333</td>
            <td>2</td>
            <td>38.333333</td>
            <td>39.333333</td>
            <td>20.333333</td>
            <td>27.333333</td>
        </tr>
        <tr>
            <td>Deferred Tiled 2.5D, AABB-based Culling</td>
            <td>39</td>
            <td>2</td>
            <td>41</td>
            <td>41.666667</td>
            <td>15.666667</td>
            <td>29.666667</td>
        </tr>
        <tr>
            <td>Deferred Tiled (DICE)</td>
            <td>36.666667</td>
            <td>2</td>
            <td>38.666667</td>
            <td>39</td>
            <td>21</td>
            <td>27.666667</td>
        </tr>
        <tr>
            <td>Deferred Tiled (DICE) 2.5D Culling</td>
            <td>36.333333</td>
            <td>2</td>
            <td>38.333333</td>
            <td>39.333333</td>
            <td>21.333333</td>
            <td>27.333333</td>
        </tr>
        <tr>
            <td>Deferred Tiled (DICE) 2.5D, AABB-based Culling</td>
            <td>39.666667</td>
            <td>2</td>
            <td>41.666667</td>
            <td>42</td>
            <td>16</td>
            <td>29.666667</td>
        </tr>
        <tr>
            <td>Deferred Tiled (Intel)</td>
            <td>36.666667</td>
            <td>2</td>
            <td>38.666667</td>
            <td>39.333333</td>
            <td>21.333333</td>
            <td>27.666667</td>
        </tr>
        <tr>
            <td>Deferred Clustered</td>
            <td>36</td>
            <td>2</td>
            <td>38</td>
            <td>38.666667</td>
            <td>20.666667</td>
            <td>28</td>
        </tr>
    </tbody>
</table>

### Geometry Phase

<table>
    <thead>
        <tr>
            <th rowspan="3">Pipeline</th>
            <th colspan="6">Geometry Phase</th>
        </tr>
        <tr>
            <th colspan="3">DRAM Read/Write Utilization</th>
            <th>DRAM Activity</th>
            <th>L1 Cache</th>
            <th>L2 Cache</th>
        </tr>
        <tr>
            <th>Percentage utilization of DRAM reads</th>
            <th>Percentage utilization of DRAM writes</th>
            <th>Total DRAM Read/Write Utilization</th>
            <th>Percentage of memory cycles that a read or write request to DRAM was active</th>
            <th>Read/write utilization</th>
            <th>Read/write utilization</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Deferred</td>
            <td>19.666667</td>
            <td>21.333333</td>
            <td>41</td>
            <td>41.333333</td>
            <td>59.666667</td>
            <td>42.666667</td>
        </tr>
        <tr>
            <td>Deferred Tiled</td>
            <td>19.666667</td>
            <td>21.666667</td>
            <td>41.333333</td>
            <td>42</td>
            <td>60.333333</td>
            <td>43</td>
        </tr>
        <tr>
            <td>Deferred Tiled 2.5D Culling</td>
            <td>19</td>
            <td>21.666667</td>
            <td>40.666667</td>
            <td>41</td>
            <td>60.333333</td>
            <td>42.666667</td>
        </tr>
        <tr>
            <td>Deferred Tiled 2.5D, AABB-based Culling</td>
            <td>18.333333</td>
            <td>21</td>
            <td>39.333333</td>
            <td>39.333333</td>
            <td>58.666667</td>
            <td>41.333333</td>
        </tr>
        <tr>
            <td>Deferred Tiled (DICE)</td>
            <td>18.666667</td>
            <td>21.666667</td>
            <td>40.333333</td>
            <td>41</td>
            <td>60.333333</td>
            <td>42.666667</td>
        </tr>
        <tr>
            <td>Deferred Tiled (DICE) 2.5D Culling</td>
            <td>19</td>
            <td>21.666667</td>
            <td>40.666667</td>
            <td>41.333333</td>
            <td>60.333333</td>
            <td>42.666667</td>
        </tr>
        <tr>
            <td>Deferred Tiled (DICE) 2.5D, AABB-based Culling</td>
            <td>18.666667</td>
            <td>21.666667</td>
            <td>40.333333</td>
            <td>41</td>
            <td>60.666667</td>
            <td>43</td>
        </tr>
        <tr>
            <td>Deferred Tiled (Intel)</td>
            <td>18</td>
            <td>21</td>
            <td>39</td>
            <td>39.666667</td>
            <td>58.666667</td>
            <td>41.666667</td>
        </tr>
        <tr>
            <td>Deferred Clustered</td>
            <td>18</td>
            <td>21</td>
            <td>39</td>
            <td>39.666667</td>
            <td>58.666667</td>
            <td>41.666667</td>
        </tr>
    </tbody>
</table>

### Light Phase

<table>
    <thead>
        <tr>
            <th rowspan="3">Pipeline</th>
            <th colspan="6">Lighting Phase</th>
        </tr>
        <tr>
            <th colspan="3">DRAM Read/Write Utilization</th>
            <th>DRAM Activity</th>
            <th>L1 Cache</th>
            <th>L2 Cache</th>
        </tr>
        <tr>
            <th>Percentage utilization of DRAM reads</th>
            <th>Percentage utilization of DRAM writes</th>
            <th>Total DRAM Read/Write Utilization</th>
            <th>Percentage of memory cycles that a read or write request to DRAM was active</th>
            <th>Read/write utilization</th>
            <th>Read/write utilization</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Deferred</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>85</td>
            <td>3.333333</td>
        </tr>
        <tr>
            <td>Deferred Tiled</td>
            <td>3</td>
            <td>0</td>
            <td>3</td>
            <td>4</td>
            <td>94.666667</td>
            <td>4.666667</td>
        </tr>
        <tr>
            <td>Deferred Tiled 2.5D Culling</td>
            <td>3.333333</td>
            <td>0</td>
            <td>3.333333</td>
            <td>4</td>
            <td>94.333333</td>
            <td>4.666667</td>
        </tr>
        <tr>
            <td>Deferred Tiled 2.5D, AABB-based Culling</td>
            <td>4</td>
            <td>1</td>
            <td>5</td>
            <td>5</td>
            <td>94.666667</td>
            <td>5.333333</td>
        </tr>
        <tr>
            <td>Deferred Tiled (DICE)</td>
            <td>2</td>
            <td>0</td>
            <td>2</td>
            <td>3</td>
            <td>95.666667</td>
            <td>4</td>
        </tr>
        <tr>
            <td>Deferred Tiled (DICE) 2.5D Culling</td>
            <td>2.333333</td>
            <td>0</td>
            <td>2.333333</td>
            <td>3.333333</td>
            <td>94.333333</td>
            <td>4</td>
        </tr>
        <tr>
            <td>Deferred Tiled (DICE) 2.5D, AABB-based Culling</td>
            <td>4</td>
            <td>1</td>
            <td>5</td>
            <td>5</td>
            <td>93.333333</td>
            <td>5</td>
        </tr>
        <tr>
            <td>Deferred Tiled (Intel)</td>
            <td>2</td>
            <td>0</td>
            <td>2</td>
            <td>3</td>
            <td>97</td>
            <td>4</td>
        </tr>
        <tr>
            <td>Deferred Clustered</td>
            <td>3</td>
            <td>0</td>
            <td>3</td>
            <td>4</td>
            <td>97</td>
            <td>5</td>
        </tr>
    </tbody>
</table>

### Render Color

<table>
    <thead>
        <tr>
            <th rowspan="3">Pipeline</th>
            <th colspan="6">Render Color</th>
        </tr>
        <tr>
            <th colspan="3">DRAM Read/Write Utilization</th>
            <th>DRAM Activity</th>
            <th>L1 Cache</th>
            <th>L2 Cache</th>
        </tr>
        <tr>
            <th>Percentage utilization of DRAM reads</th>
            <th>Percentage utilization of DRAM writes</th>
            <th>Total DRAM Read/Write Utilization</th>
            <th>Percentage of memory cycles that a read or write request to DRAM was active</th>
            <th>Read/write utilization</th>
            <th>Read/write utilization</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Forward</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0.666667</td>
            <td>82.666667</td>
            <td>3.333333</td>
        </tr>
        <tr>
            <td>Forward+</td>
            <td>2</td>
            <td>1</td>
            <td>3</td>
            <td>3.666667</td>
            <td>89.333333</td>
            <td>5</td>
        </tr>
        <tr>
            <td>Forward+ 2.5D Culling</td>
            <td>2.333333</td>
            <td>1</td>
            <td>3.333333</td>
            <td>4</td>
            <td>92.666667</td>
            <td>5.333333</td>
        </tr>
        <tr>
            <td>Forward+ 2.5D, AABB-based Culling</td>
            <td>3</td>
            <td>2</td>
            <td>5</td>
            <td>5</td>
            <td>91</td>
            <td>7</td>
        </tr>
        <tr>
            <td>Forward Clustered</td>
            <td>2.666667</td>
            <td>1</td>
            <td>3.666667</td>
            <td>4.666667</td>
            <td>92.666667</td>
            <td>6.333333</td>
        </tr>
    </tbody>
</table>

### Tile / Cluster Assignment

<table>
    <thead>
        <tr>
            <th rowspan="3">Pipeline</th>
            <th colspan="6">Tile / Cluster Assignment</th>
        </tr>
        <tr>
            <th colspan="3">DRAM Read/Write Utilization</th>
            <th>DRAM Activity</th>
            <th>L1 Cache</th>
            <th>L2 Cache</th>
        </tr>
        <tr>
            <th>Percentage utilization of DRAM reads</th>
            <th>Percentage utilization of DRAM writes</th>
            <th>Total DRAM Read/Write Utilization</th>
            <th>Percentage of memory cycles that a read or write request to DRAM was active</th>
            <th>Read/write utilization</th>
            <th>Read/write utilization</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Forward+</td>
            <td>1.333333</td>
            <td>1</td>
            <td>2.333333</td>
            <td>3.333333</td>
            <td>23.333333</td>
            <td>12</td>
        </tr>
        <tr>
            <td>Forward+ 2.5D Culling</td>
            <td>1.333333</td>
            <td>1</td>
            <td>2.333333</td>
            <td>2.666667</td>
            <td>26</td>
            <td>11</td>
        </tr>
        <tr>
            <td>Forward+ 2.5D, AABB-based Culling</td>
            <td>3.666667</td>
            <td>2</td>
            <td>5.666667</td>
            <td>5.666667</td>
            <td>41.666667</td>
            <td>14</td>
        </tr>
        <tr>
            <td>Forward Clustered</td>
            <td>0</td>
            <td>4</td>
            <td>4</td>
            <td>5</td>
            <td>43</td>
            <td>18</td>
        </tr>
        <tr>
            <td>Deferred Tiled</td>
            <td>0</td>
            <td>1</td>
            <td>1</td>
            <td>2</td>
            <td>24</td>
            <td>12</td>
        </tr>
        <tr>
            <td>Deferred Tiled 2.5D Culling</td>
            <td>0</td>
            <td>1</td>
            <td>1</td>
            <td>2</td>
            <td>26</td>
            <td>11</td>
        </tr>
        <tr>
            <td>Deferred Tiled 2.5D, AABB-based Culling</td>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>3</td>
            <td>43</td>
            <td>14</td>
        </tr>
        <tr>
            <td>Deferred Tiled (DICE)</td>
            <td>2</td>
            <td>0</td>
            <td>2</td>
            <td>3</td>
            <td>95.666667</td>
            <td>4</td>
        </tr>
        <tr>
            <td>Deferred Tiled (DICE) 2.5D Culling</td>
            <td>2.333333</td>
            <td>0</td>
            <td>2.333333</td>
            <td>3.333333</td>
            <td>94.333333</td>
            <td>4</td>
        </tr>
        <tr>
            <td>Deferred Tiled (DICE) 2.5D, AABB-based Culling</td>
            <td>4</td>
            <td>1</td>
            <td>5</td>
            <td>5</td>
            <td>93.333333</td>
            <td>5</td>
        </tr>
        <tr>
            <td>Deferred Tiled (Intel)</td>
            <td>2</td>
            <td>0</td>
            <td>2</td>
            <td>3</td>
            <td>97</td>
            <td>4</td>
        </tr>
        <tr>
            <td>Deferred Clustered</td>
            <td>0.333333</td>
            <td>4</td>
            <td>4.333333</td>
            <td>5</td>
            <td>42.333333</td>
            <td>18</td>
        </tr>
    </tbody>
</table>

## Shadow Maps

## Lights Scalability

<sup>[Lauritzen10](#Lauritzen10)</sup>

### Frame Duration

![FrameDurationAll](/Images/DeferredShading/FrameDurationAll.png)

![FrameDurationDeferred](/Images/DeferredShading/FrameDurationDeferred.png)

![FrameDurationDeferredNoDefault](/Images/DeferredShading/FrameDurationDeferredNoDefault.png)

![FrameDurationForward](/Images/DeferredShading/FrameDurationForward.png)

![FrameDurationForwardNoDefault](/Images/DeferredShading/FrameDurationForwardNoDefault.png)

![FrameDurationTiled](/Images/DeferredShading/FrameDurationTiled.png)

![FrameDurationTiled2_5D](/Images/DeferredShading/FrameDurationTiled2_5D.png)

![FrameDurationTiled2_5DAABB](/Images/DeferredShading/FrameDurationTiled2_5DAABB.png)

![FrameDurationClustered](/Images/DeferredShading/FrameDurationClustered.png)

### Light Phase Duration

![LightPhaseDurationDeferred](/Images/DeferredShading/LightPhaseDurationDeferred.png)

![LightPhaseDurationDeferredNoDefault](/Images/DeferredShading/LightPhaseDurationDeferredNoDefault.png)

![LightPhaseDurationTiled](/Images/DeferredShading/LightPhaseDurationTiled.png)

![LightPhaseDurationTiled2_5D](/Images/DeferredShading/LightPhaseDurationTiled2_5D.png)

![LightPhaseDurationTiled2_5DAABB](/Images/DeferredShading/LightPhaseDurationTiled2_5DAABB.png)

![LightPhaseDurationClustered](/Images/DeferredShading/LightPhaseDurationClustered.png)

### Render Color Duration

![RenderColorDurationAll](/Images/DeferredShading/RenderColorDurationAll.png)

![RenderColorDurationDeferred](/Images/DeferredShading/RenderColorDurationDeferred.png)

![RenderColorDurationDeferredNoDefault](/Images/DeferredShading/RenderColorDurationDeferredNoDefault.png)

![RenderColorDurationForward](/Images/DeferredShading/RenderColorDurationForward.png)

![RenderColorDurationForwardNoDefault](/Images/DeferredShading/RenderColorDurationForwardNoDefault.png)

![RenderColorDurationTiled](/Images/DeferredShading/RenderColorDurationTiled.png)

![RenderColorDurationTiled2_5D](/Images/DeferredShading/RenderColorDurationTiled2_5D.png)

![RenderColorDurationTiled2_5DAABB](/Images/DeferredShading/RenderColorDurationTiled2_5DAABB.png)

![RenderColorDurationClustered](/Images/DeferredShading/RenderColorDurationClustered.png)

### Tile / Cluster Assignment Duration

![TileClusterAssignmentDurationAll](/Images/DeferredShading/TileClusterAssignmentDurationAll.png)

![TileClusterAssignmentDurationDeferred](/Images/DeferredShading/TileClusterAssignmentDurationDeferred.png)

![TileClusterAssignmentDurationForward](/Images/DeferredShading/TileClusterAssignmentDurationForward.png)

![TileClusterAssignmentDurationTiled](/Images/DeferredShading/TileClusterAssignmentDurationTiled.png)

![TileClusterAssignmentDurationTiled2_5D](/Images/DeferredShading/TileClusterAssignmentDurationTiled2_5D.png)

![TileClusterAssignmentDurationTiled2_5DAABB](/Images/DeferredShading/TileClusterAssignmentDurationTiled2_5DAABB.png)

![TileClusterAssignmentDurationClustered](/Images/DeferredShading/TileClusterAssignmentDurationClustered.png)

## GBuffer: Fat Buffer vs Thin Buffer<sup>[Kaplanyan10](#Kaplanyan10)</sup>

### Color Space Encoding<sup>[Kaplanyan10](#Kaplanyan10)</sup>

### Normal Encoding<sup>[Kaplanyan10](#Kaplanyan10)</sup>

## False Positive Rate

# Forward+

<table>
    <thead>
        <tr>
            <th colspan="2" rowspan="3">Name</th>
            <th rowspan="3">Duration (ms)</th>
            <th colspan="6">Bandwidth</th>
        </tr>
        <tr>
            <th colspan="3">DRAM RW Utilization</th>
            <th rowspan="2">DRAM Activity</th>
            <th rowspan="2">L1 Cache RW Utilization</th>
            <th rowspan="2">L2 Cache RW Utilization</th>
        </tr>
        <tr>
            <th>% Utilization of DRAM Reads</th>
            <th>% Utilization of DRAM Writes</th>
            <th>Total DRAM RW Utilization</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="12">Scene Render</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">Particle Update</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0.091776<br>0.095168<br>0.097408<br>=0.094784</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0<br>0<br>1<br>=0.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0<br>0<br>1<br>=0.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0<br>0<br>2<br>=0.666667</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0<br>0<br>1<br>=0.333333</td>
        </tr>
        <tr>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">Z PrePass</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0.083200<br>0.081600<br>0.082240<br>=0.082347</td>
            <td style="background-color:rgba(0, 157, 255, 1); color:white">25<br>24<br>24<br>=24.333333</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">9<br>6<br>6<br>=7</td>
            <td style="background-color:rgba(9, 130, 175, 1); color:white">34<br>30<br>30<br>=31.333333</td>
            <td style="background-color:rgba(9, 130, 175, 1); color:white">34<br>31<br>31<br>=32</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">3</td>
            <td style="background-color:rgba(9, 130, 175, 1); color:white">34<br>33<br>32<br>=33</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Generate SSAO</td>
            <td>0.156384<br>0.155328<br>0.156512<br>=0.156075</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">8<br>9<br>10<br>=9</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">7<br>7<br>8<br>=7.333333</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">15<br>16<br>18<br>=16.333333</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">15<br>17<br>19<br>=17</td>
            <td style="background-color:rgba(8, 175, 20, 1); color:white">47<br>47<br>48<br>=47.333333</td>
            <td style="background-color:rgba(9, 130, 175, 1); color:white">32<br>34<br>33<br>=33</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Fill Light Grid</td>
            <td>0.060064<br>0.059296<br>0.061600<br>=0.060320</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">1<br>1<br>5<br>=2.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3<br>3<br>2<br>=2.666667</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">4<br>4<br>7<br>=5</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">4<br>4<br>8<br>=5.333333</td>
            <td style="background-color:rgba(0, 255, 0, 1); color:black">43<br>43<br>41<br>=42.333333</td>
            <td style="background-color:rgba(0, 157, 255, 1); color:white">22<br>22<br>21<br>=21.666667</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Main Render</td>
            <td>0.031232<br>0.030720<br>0.030816<br>=0.030923</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">13</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Render Shadow Map</td>
            <td>0.107104<br>0.090272<br>0.089888<br>=0.095755</td>
            <td style="background-color:rgba(0, 157, 255, 1); color:white">19<br>21<br>21<br>=20.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">8<br>9<br>9<br>=8.666667</td>
            <td style="background-color:rgba(0, 0, 255, 1); color:white">27<br>30<br>30<br>=29</td>
            <td style="background-color:rgba(0, 0, 255, 1); color:white">28<br>30<br>30<br>=29.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3</td>
            <td style="background-color:rgba(0, 0, 255, 1); color:white">26<br>28<br>28<br>=27.333333</td>
        </tr>
        <tr style="background-color:rgba(255, 152, 0, 1); color:white">
            <td>Render Color</td>
            <td>1.317600<br>1.318592<br>1.318752<br>=1.318315</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">2</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">5</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">5</td>
            <td style="background-color:rgba(121, 51, 160, 1); color:white">91<br>92<br>83<br>=88.666667</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">7<br>7<br>6<br>=6.666667</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Generate Camera Velocity</td>
            <td>0.059232<br>0.058464<br>0.059392<br>=0.059029</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">8<br>7<br>10<br>=8.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">5</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">13<br>12<br>15<br>=13.333333</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">13<br>13<br>15<br>=13.666667</td>
            <td style="background-color:rgba(9, 130, 175, 1); color:white">32<br>33<br>32<br>=32.333333</td>
            <td style="background-color:rgba(0, 157, 255, 1); color:white">21<br>20<br>20<br>=20.333333</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Temporal Resolve</td>
            <td>0.135456<br>0.134752<br>0.137024<br>=0.135744</td>
            <td style="background-color:rgba(0, 255, 0, 1); color:black">42<br>39<br>45<br>=42</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">17<br>19<br>17<br>=17.666667</td>
            <td style="background-color:rgba(255, 152, 0, 1); color:white">59<br>58<br>62<br>=59.666667</td>
            <td style="background-color:rgba(255, 152, 0, 1); color:white">60<br>58<br>62<br>=60</td>
            <td style="background-color:rgba(255, 0, 0, 1); color:white">68<br>68<br>67<br>=67.666667</td>
            <td style="background-color:rgba(221, 0, 27, 1); color:white">69<br>67<br>74<br>=70</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Particle Render</td>
            <td>0.085088<br>0.083296<br>0.085344<br>=0.084576</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3<br>3<br>5<br>=3.666667</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">1</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">4<br>4<br>6<br>=4.666667</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">4<br>5<br>7<br>=5.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">2</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3<br>3<br>4<br>=3.333333</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Motion Blur</td>
            <td>0.052416<br>0.055840<br>0.055616<br>=0.054624</td>
            <td style="background-color:rgba(8, 175, 20, 1); color:white">44<br>50<br>49<br>=47.666667</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">15<br>14<br>14<br>=14.333333</td>
            <td style="background-color:rgba(255, 152, 0, 1); color:white">59<br>64<br>63<br>=62</td>
            <td style="background-color:rgba(255, 0, 0, 1); color:white">59<br>64<br>64<br>=62.333333</td>
            <td style="background-color:rgba(0, 0, 255, 1); color:white">29<br>28<br>28<br>=28.333333</td>
            <td style="background-color:rgba(8, 175, 20, 1); color:white">46<br>47<br>47<br>=46.666667</td>
        </tr>
        <tr>
            <td>Total</td>
            <td>2.186400<br>2.170144<br>2.181408</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">9<br>8<br>9<br>=8.666667</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">4</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">13<br>12<br>13<br>=12.666667</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">13<br>13<br>14<br>=13.333333</td>
            <td style="background-color:rgba(255, 0, 0, 1); color:white">66<br>65<br>65<br>=65.333333</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">16<br>15<br>16<br>=15.666667</td>
        </tr>
    </tbody>
</table>

# Forward+ 2.5D Culling with AABB-based Culling

<table>
    <thead>
        <tr>
            <th colspan="2" rowspan="3">Name</th>
            <th rowspan="3">Duration (ms)</th>
            <th colspan="6">Bandwidth</th>
        </tr>
        <tr>
            <th colspan="3">DRAM RW Utilization</th>
            <th rowspan="2">DRAM Activity</th>
            <th rowspan="2">L1 Cache RW Utilization</th>
            <th rowspan="2">L2 Cache RW Utilization</th>
        </tr>
        <tr>
            <th>% Utilization of DRAM Reads</th>
            <th>% Utilization of DRAM Writes</th>
            <th>Total DRAM RW Utilization</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="12">Scene Render</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">Particle Update</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0.091584<br>0.092256<br>0.091296<br>=0.091712</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0<br>3<br>0<br>=1</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0<br>3<br>0<br>=1</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0<br>4<br>0<br>=1.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0<br>2<br>1<br>=1</td>
        </tr>
        <tr>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">Z PrePass</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0.083328<br>0.081248<br>0.081120<br>=0.081898</td>
            <td style="background-color:rgba(0, 157, 255, 1); color:white">25<br>24<br>24<br>=24.333333</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">9<br>10<br>10<br>=9.666667</td>
            <td style="background-color:rgba(9, 130, 175, 1); color:white">34</td>
            <td style="background-color:rgba(9, 130, 175, 1); color:white">34<br>35<br>34<br>=34.333333</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">3</td>
            <td style="background-color:rgba(9, 130, 175, 1); color:white">34<br>33<br>32<br>=33</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Generate SSAO</td>
            <td>0.161536<br>0.159520<br>0.154848<br>=0.158634</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">8</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">7</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">15</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">15<br>15<br>16<br>=15.333333</td>
            <td style="background-color:rgba(8, 175, 20, 1); color:white">48</td>
            <td style="background-color:rgba(9, 130, 175, 1); color:white">33</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Fill Light Grid</td>
            <td>0.059744<br>0.059776<br>0.059584<br>=0.059701</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">1</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">4</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">4</td>
            <td style="background-color:rgba(0, 255, 0, 1); color:black">43</td>
            <td style="background-color:rgba(0, 157, 255, 1); color:white">22</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Main Render</td>
            <td>0.030752<br>0.030720<br>0.030720<br>0.030731</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">13</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Render Shadow Map</td>
            <td>0.106656<br>0.089920<br>0.089760<br>=0.095445</td>
            <td style="background-color:rgba(0, 157, 255, 1); color:white">19<br>21<br>21<br>=20.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">7<br>9<br>9<br>=8.333333</td>
            <td style="background-color:rgba(0, 0, 255, 1); color:white">26<br>30<br>30<br>=28.666667</td>
            <td style="background-color:rgba(0, 0, 255, 1); color:white">27<br>30<br>30<br>=29</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3</td>
            <td style="background-color:rgba(0, 0, 255, 1); color:white">26<br>28<br>28<br>=28.666667</td>
        </tr>
        <tr style="background-color:rgba(255, 152, 0, 1); color:white">
            <td>Render Color</td>
            <td>1.308896<br>1.311968<br>1.316896<br>=1.312587</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3<br>3<br>4<br>=3.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">2</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">5<br>5<br>6<br>=5.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">5<br>5<br>6<br>=5.333333</td>
            <td style="background-color:rgba(121, 51, 160, 1); color:white">92<br>92<br>84<br>89.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">7</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Generate Camera Velocity</td>
            <td>0.058944<br>0.058464<br>0.058624<br>=0.058677</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">6<br>8<br>8<br>=7.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">5<br>5<br>4<br>=4.666667</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">11<br>13<br>12<br>=12</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">12<br>13<br>13<br>=12.666667</td>
            <td style="background-color:rgba(9, 130, 175, 1); color:white">32<br>32<br>33<br>=32.666667</td>
            <td style="background-color:rgba(0, 157, 255, 1); color:white">19<br>21<br>22<br>=20.666667</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Temporal Resolve</td>
            <td>0.135200<br>0.134208<br>0.135776<br>=0.135061</td>
            <td style="background-color:rgba(8, 175, 20, 1); color:white">44<br>38<br>43<br>=41.666667</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">17</td>
            <td style="background-color:rgba(255, 152, 0, 1); color:white">61<br>55<br>60<br>=58.666667</td>
            <td style="background-color:rgba(255, 152, 0, 1); color:white">61<br>56<br>60<br>=59</td>
            <td style="background-color:rgba(255, 0, 0, 1); color:white">67<br>68<br>67<br>=67.333333</td>
            <td style="background-color:rgba(221, 0, 27, 1); color:white">69<br>66<br>72<br>=69</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Particle Render</td>
            <td>0.083584<br>0.083776<br>0.083936<br>=0.083765</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3<br>5<br>3<br>=3.666667</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">1</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">4<br>6<br>4<br>=4.666667</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">5<br>7<br>4<br>=5.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">2</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Motion Blur</td>
            <td>0.052544<br>0.052224<br>0.052768<br>=0.052512</td>
            <td style="background-color:rgba(8, 175, 20, 1); color:white">45<br>46<br>45<br>=45.333333</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">15<br>14<br>15<br>=14.666667</td>
            <td style="background-color:rgba(255, 152, 0, 1); color:white">60</td>
            <td style="background-color:rgba(255, 152, 0, 1); color:white">61<br>60<br>60<br>=60.333333</td>
            <td style="background-color:rgba(0, 0, 255, 1); color:white">29<br>30<br>29<br>=29.333333</td>
            <td style="background-color:rgba(8, 175, 20, 1); color:white">46<br>47<br>46<br>=46.333333</td>
        </tr>
        <tr>
            <td>Total</td>
            <td>2.186400<br>2.161280<br>2.162144<br>=2.169941</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">8</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">4</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">12</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">12</td>
            <td style="background-color:rgba(255, 101, 0, 1); color:white">62<br>65<br>62<br>=63</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">15</td>
        </tr>
    </tbody>
</table>

# Forward Clustered

<table>
    <thead>
        <tr>
            <th colspan="2" rowspan="3">Name</th>
            <th rowspan="3">Duration (ms)</th>
            <th colspan="6">Bandwidth</th>
        </tr>
        <tr>
            <th colspan="3">DRAM RW Utilization</th>
            <th rowspan="2">DRAM Activity</th>
            <th rowspan="2">L1 Cache RW Utilization</th>
            <th rowspan="2">L2 Cache RW Utilization</th>
        </tr>
        <tr>
            <th>% Utilization of DRAM Reads</th>
            <th>% Utilization of DRAM Writes</th>
            <th>Total DRAM RW Utilization</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="12">Scene Render</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">Particle Update</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0.094080<br>0.098720<br>0.090016<br>=0.094272</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
        </tr>
        <tr>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">Z PrePass</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0.083136<br>0.080256<br>0.081248<br>=0.081546</td>
            <td style="background-color:rgba(0, 157, 255, 1); color:white">25<br>24<br>24<br>=24.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">6<br>6<br>10<br>=7.333333</td>
            <td style="background-color:rgba(9, 130, 175, 1); color:white">31<br>30<br>34<br>=31.666667</td>
            <td style="background-color:rgba(9, 130, 175, 1); color:white">32<br>31<br>35<br>=32.666667</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3</td>
            <td style="background-color:rgba(9, 130, 175, 1); color:white">34<br>33<br>33<br>=33.333333</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Generate SSAO</td>
            <td>0.158592<br>0.155296<br>0.167648<br>=0.160512</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">7<br>8<br>8<br>=7.666667</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">7<br>8<br>7<br>=7.333333</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">14<br>16<br>15<br>=15</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">14<br>17<br>15<br>=15.333333</td>
            <td style="background-color:rgba(8, 175, 20, 1); color:white">47</td>
            <td style="background-color:rgba(9, 130, 175, 1); color:white">31<br>31<br>32<br>=31.333333</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Fill Light Grid</td>
            <td>0.454208<br>0.450720<br>0.454272<br>=0.453067</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">1</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">1</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">1</td>
            <td style="background-color:rgba(0, 255, 0, 1); color:black">38<br>39<br>38<br>=38.333333</td>
            <td style="background-color:rgba(0, 157, 255, 1); color:white">21</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Main Render</td>
            <td>0.031392<br>0.030752<br>0.031168<br>=0.031104</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3<br>0<br>0<br>=1</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3<br>0<br>0<br>=1</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">6<br>0<br>0<br>=2</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">7<br>0<br>0<br>=2.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">17<br>15<br>15<br>=15.666667</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Render Shadow Map</td>
            <td>0.106048<br>0.089184<br>0.089056<br>=0.094763</td>
            <td style="background-color:rgba(0, 157, 255, 1); color:white">19<br>21<br>21<br>=20.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">8<br>9<br>9<br>=8.666667</td>
            <td style="background-color:rgba(0, 0, 255, 1); color:white">27<br>30<br>30<br>=29</td>
            <td style="background-color:rgba(0, 0, 255, 1); color:white">28<br>30<br>31<br>=29.666667</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3</td>
            <td style="background-color:rgba(0, 0, 255, 1); color:white">26<br>28<br>28<br>=27.333333</td>
        </tr>
        <tr style="background-color:rgba(255, 152, 0, 1); color:white">
            <td>Render Color</td>
            <td>2.018272<br>2.024256<br>2.027040<br>=2.023189</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">2</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">1</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3</td>
            <td style="background-color:rgba(121, 51, 160, 1); color:white">89<br>88<br>91<br>=89.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">5</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Generate Camera Velocity</td>
            <td>0.059264<br>0.058496<br>0.059264<br>=0.059008</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">6<br>10<br>12<br>=9.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">5<br>4<br>4<br>=4.333333</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">11<br>14<br>16<br>=13.666667</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">12<br>15<br>16<br>=14.333333</td>
            <td style="background-color:rgba(9, 130, 175, 1); color:white">32</td>
            <td style="background-color:rgba(0, 157, 255, 1); color:white">18<br>21<br>23<br>=20.666667</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Temporal Resolve</td>
            <td>0.136320<br>0.134176<br>0.136032<br>=0.135509</td>
            <td style="background-color:rgba(0, 255, 0, 1); color:white">43<br>37<br>43<br>=41</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">16<br>17<br>16<br>=16.333333</td>
            <td style="background-color:rgba(255, 152, 0, 1); color:white">59<br>54<br>59<br>=57.333333</td>
            <td style="background-color:rgba(255, 152, 0, 1); color:white">60<br>55<br>60<br>=58.333333</td>
            <td style="background-color:rgba(255, 0, 0, 1); color:white">67<br>68<br>67<br>=67.333333</td>
            <td style="background-color:rgba(221, 0, 27, 1); color:white">69<br>65<br>74<br>=69.333333</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Particle Render</td>
            <td>0.083680<br>0.084256<br>0.082656<br>=0.083531</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3<br>5<br>3<br>=3.666667</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">1<br>2<br>1<br>=1.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">4<br>7<br>4<br>=5</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">5<br>7<br>5<br>=6.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">2</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Motion Blur</td>
            <td>0.063776<br>0.054368<br>0.054528<br>=0.057557</td>
            <td style="background-color:rgba(8, 175, 20, 1); color:white">45<br>55<br>45<br>=48.333333</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">20<br>17<br>20<br>=19</td>
            <td style="background-color:rgba(255, 152, 0, 1); color:white">65<br>72<br>65<br>=67.333333</td>
            <td style="background-color:rgba(255, 152, 0, 1); color:white">66<br>72<br>66<br>=68</td>
            <td style="background-color:rgba(0, 0, 255, 1); color:white">29<br>26<br>29<br>=28</td>
            <td style="background-color:rgba(8, 175, 20, 1); color:white">40<br>42<br>41<br>=41</td>
        </tr>
        <tr>
            <td>Total</td>
            <td>3.295520<br>3.267296<br>3.279776<br>=3.280864</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">5<br>5<br>6<br>=5.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">2<br>3<br>3<br>=2.666667</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">7<br>8<br>9<br>=8</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">8<br>9<br>9<br>=8.666667</td>
            <td style="background-color:rgba(255, 0, 0, 1); color:white">70<br>67<br>68<br>=68.333333</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">13</td>
        </tr>
    </tbody>
</table>

# Deferred Tiled

<table>
    <thead>
        <tr>
            <th colspan="2" rowspan="3">Name</th>
            <th rowspan="3">Duration (ms)</th>
            <th colspan="6">Bandwidth</th>
        </tr>
        <tr>
            <th colspan="3">DRAM RW Utilization</th>
            <th rowspan="2">DRAM Activity</th>
            <th rowspan="2">L1 Cache RW Utilization</th>
            <th rowspan="2">L2 Cache RW Utilization</th>
        </tr>
        <tr>
            <th>% Utilization of DRAM Reads</th>
            <th>% Utilization of DRAM Writes</th>
            <th>Total DRAM RW Utilization</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="12">Scene Render</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">Particle Update</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0.094080<br>0.098720<br>0.090016<br>=0.094272</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
        </tr>
        <tr>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">Z PrePass</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0.083136<br>0.080256<br>0.081248<br>=0.081546</td>
            <td style="background-color:rgba(0, 157, 255, 1); color:white">25<br>24<br>24<br>=24.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">6<br>6<br>10<br>=7.333333</td>
            <td style="background-color:rgba(9, 130, 175, 1); color:white">31<br>30<br>34<br>=31.666667</td>
            <td style="background-color:rgba(9, 130, 175, 1); color:white">32<br>31<br>35<br>=32.666667</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3</td>
            <td style="background-color:rgba(9, 130, 175, 1); color:white">34<br>33<br>33<br>=33.333333</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Generate SSAO</td>
            <td>0.158592<br>0.155296<br>0.167648<br>=0.160512</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">7<br>8<br>8<br>=7.666667</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">7<br>8<br>7<br>=7.333333</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">14<br>16<br>15<br>=15</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">14<br>17<br>15<br>=15.333333</td>
            <td style="background-color:rgba(8, 175, 20, 1); color:white">47</td>
            <td style="background-color:rgba(9, 130, 175, 1); color:white">31<br>31<br>32<br>=31.333333</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Fill Light Grid</td>
            <td>0.454208<br>0.450720<br>0.454272<br>=0.453067</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">1</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">1</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">1</td>
            <td style="background-color:rgba(0, 255, 0, 1); color:black">38<br>39<br>38<br>=38.333333</td>
            <td style="background-color:rgba(0, 157, 255, 1); color:white">21</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Main Render</td>
            <td>0.031392<br>0.030752<br>0.031168<br>=0.031104</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3<br>0<br>0<br>=1</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3<br>0<br>0<br>=1</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">6<br>0<br>0<br>=2</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">7<br>0<br>0<br>=2.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">0</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">17<br>15<br>15<br>=15.666667</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Render Shadow Map</td>
            <td>0.106048<br>0.089184<br>0.089056<br>=0.094763</td>
            <td style="background-color:rgba(0, 157, 255, 1); color:white">19<br>21<br>21<br>=20.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">8<br>9<br>9<br>=8.666667</td>
            <td style="background-color:rgba(0, 0, 255, 1); color:white">27<br>30<br>30<br>=29</td>
            <td style="background-color:rgba(0, 0, 255, 1); color:white">28<br>30<br>31<br>=29.666667</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3</td>
            <td style="background-color:rgba(0, 0, 255, 1); color:white">26<br>28<br>28<br>=27.333333</td>
        </tr>
        <tr style="background-color:rgba(255, 152, 0, 1); color:white">
            <td>Render Color</td>
            <td>2.018272<br>2.024256<br>2.027040<br>=2.023189</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">2</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">1</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3</td>
            <td style="background-color:rgba(121, 51, 160, 1); color:white">89<br>88<br>91<br>=89.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">5</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Generate Camera Velocity</td>
            <td>0.059264<br>0.058496<br>0.059264<br>=0.059008</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">6<br>10<br>12<br>=9.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">5<br>4<br>4<br>=4.333333</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">11<br>14<br>16<br>=13.666667</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">12<br>15<br>16<br>=14.333333</td>
            <td style="background-color:rgba(9, 130, 175, 1); color:white">32</td>
            <td style="background-color:rgba(0, 157, 255, 1); color:white">18<br>21<br>23<br>=20.666667</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Temporal Resolve</td>
            <td>0.136320<br>0.134176<br>0.136032<br>=0.135509</td>
            <td style="background-color:rgba(0, 255, 0, 1); color:white">43<br>37<br>43<br>=41</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">16<br>17<br>16<br>=16.333333</td>
            <td style="background-color:rgba(255, 152, 0, 1); color:white">59<br>54<br>59<br>=57.333333</td>
            <td style="background-color:rgba(255, 152, 0, 1); color:white">60<br>55<br>60<br>=58.333333</td>
            <td style="background-color:rgba(255, 0, 0, 1); color:white">67<br>68<br>67<br>=67.333333</td>
            <td style="background-color:rgba(221, 0, 27, 1); color:white">69<br>65<br>74<br>=69.333333</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Particle Render</td>
            <td>0.083680<br>0.084256<br>0.082656<br>=0.083531</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3<br>5<br>3<br>=3.666667</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">1<br>2<br>1<br>=1.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">4<br>7<br>4<br>=5</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">5<br>7<br>5<br>=6.333333</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">2</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">3</td>
        </tr>
        <tr style="background-color:rgba(0, 0, 0, 1); color:white">
            <td>Motion Blur</td>
            <td>0.063776<br>0.054368<br>0.054528<br>=0.057557</td>
            <td style="background-color:rgba(8, 175, 20, 1); color:white">45<br>55<br>45<br>=48.333333</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">20<br>17<br>20<br>=19</td>
            <td style="background-color:rgba(255, 152, 0, 1); color:white">65<br>72<br>65<br>=67.333333</td>
            <td style="background-color:rgba(255, 152, 0, 1); color:white">66<br>72<br>66<br>=68</td>
            <td style="background-color:rgba(0, 0, 255, 1); color:white">29<br>26<br>29<br>=28</td>
            <td style="background-color:rgba(8, 175, 20, 1); color:white">40<br>42<br>41<br>=41</td>
        </tr>
        <tr>
            <td>Total</td>
            <td>2.051136</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">11</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">5</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">16</td>
            <td style="background-color:rgba(0, 0, 0, 1); color:white">16</td>
            <td style="background-color:rgba(255, 0, 0, 1); color:white">56</td>
            <td style="background-color:rgba(0, 255, 255, 1); color:black">18</td>
        </tr>
    </tbody>
</table>

---

# References

<a id="Thibieroz04" href="https://gitea.yiem.net/QianMo/Real-Time-Rendering-4th-Bibliography-Collection/raw/branch/main/Chapter%201-24/[1762]%20[ShaderX2%202004]%20Deferred%20Shading%20with%20Multiple%20Render%20Targets.pdf">Deferred Shading with Multiple Render Targets</a>. [Nicolas Thibieroz](https://www.linkedin.com/in/nicolas-thibieroz-a4353739/), [PowerVR Technologies](https://www.imaginationtech.com/products/gpu/) / [AMD](https://www.amd.com/en). [ShaderX2](http://www.shaderx2.com/).<br>
<a id="Koonce07" href="https://developer.nvidia.com/gpugems/gpugems3/part-iii-rendering/chapter-19-deferred-shading-tabula-rasa">Deferred Shading in Tabula Rasa</a>. [Rusty Koonce](https://www.linkedin.com/in/rusty-koonce-9654819/), [NCSoft Corporation](https://kr.ncsoft.com/en/index.do) / [Facebook](https://about.facebook.com/). [GPU Gems 3](https://developer.nvidia.com/gpugems/gpugems3/foreword).<br>
<a id="Kaplanyan10" href="http://advances.realtimerendering.com/s2010/Kaplanyan-CryEngine3%28SIGGRAPH%202010%20Advanced%20RealTime%20Rendering%20Course%29.pdf">CryENGINE 3: Reaching the Speed of Light</a>. [Anton Kaplanyan](https://kaplanyan.com/), [Crytek](https://www.crytek.com/) / [Intel Corporation](https://www.intel.com/content/www/us/en/homepage.html). [SIGGRAPH 2010: Advances in Real-Time Rendering in Games Course](https://advances.realtimerendering.com/s2010/index.html).<br>
<a id="Lauritzen10" href="https://www.intel.com/content/www/us/en/developer/articles/technical/deferred-rendering-for-current-and-future-rendering-pipelines.html">Deferred Rendering for Current and Future Rendering Pipelines</a>. [Andrew Lauritzen](https://dl.acm.org/profile/81310499387), [Intel Corporation](https://www.intel.com/content/www/us/en/homepage.html). SIGGRAPH 2010: Beyond Programmable Shader Course.<br>
<a id="KimBarrero11" href="https://blog.popekim.com/en/2011/11/15/slides-rendering-tech-of-space-marine.html">Rendering Tech of Space Marine</a>. [Pope Kim](https://blog.popekim.com/en/), [Relic Entertainment](https://www.relic.com/) / [POCU](https://pocu.academy/ko). [Daniel Barrero](https://www.linkedin.com/in/danielbarrero/), [Relic Entertainment](https://www.relic.com/). [KGC 2011](https://www.khronos.org/events/korea-games-conference-2011).<br>
<a id="OlssonAssarsson11" href="https://efficientshading.com/2011/01/01/tiled-shading/">Tiled Shading</a>. [Ola Olsson](https://efficientshading.com/), [Chalmers University of Technology](https://www.chalmers.se/en/Pages/default.aspx)  / [Epic Games](https://www.epicgames.com/site/en-US/home). [Ulf Assarsson](http://www.cse.chalmers.se/~uffe/), [Chalmers University of Technology](https://www.chalmers.se/en/Pages/default.aspx). [Journal of Graphics, GPU, and Game Tools](https://www.tandfonline.com/doi/abs/10.1080/2151237X.2011.632611?tab=permissions&scroll=top).<br>

---

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.arange(0, 3 * np.pi, 0.1)
y = np.sin(x)

x = ["16/8/8", "32/24/8", "64/56/8", "128/56/8"]
forward_plus_y = [1.293643, 1.402208, 1.691659, 1.991093]
forward_plus_culling_y = [1.253589, 1.318080, 1.516608, 1.718923]
forward_clustered_y = [2.174741, 2.318197, 2.950581, 3.268107]
deferred_tiled_y = [1.370539, 1.453547, 1.709749, 1.972149]
deferred_tiled_culling_y = [1.321376, 1.372097, 1.554155, 1.718635]
deferred_tiled_dice_y = [1.579851, 1.630304, 1.849120, 2.059509]
deferred_tiled_dice_culling_y = [1.367307, 1.450763, 1.607851, 1.739381]
deferred_clustered = [1.369045, 2.354485, 2.935424, 3.519659]

plt.plot(x, forward_plus_y, label="Forward+")
plt.plot(x, forward_plus_culling_y, label="Forward+ 2.5D, AABB Culling")
plt.plot(x, forward_clustered_y, label="Forward Clustered")
plt.plot(x, deferred_tiled_y, label="Deferred Tiled")
plt.plot(x, deferred_tiled_culling_y, label="Deferred Tiled 2.5D, AABB Culling")
plt.plot(x, deferred_tiled_dice_y, label="Deferred Tiled DICE")
plt.plot(x, deferred_tiled_dice_culling_y, label="Deferred Tiled DICE 2.5D, AABB Culling")
plt.plot(x, deferred_clustered, label="Deferred Clustered")
plt.xlabel("Number of Lights (Point/Cone/Cone Shadowed)")
plt.ylabel("Scene Render Duration (ms)")
plt.legend()
plt.show()
```