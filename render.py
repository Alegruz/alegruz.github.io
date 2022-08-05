import matplotlib.pyplot as plt
import numpy as np

x = ["32", "64", "128", "192"]

forward_y = [1.860333, 3.927333, 7.455333, 10.671667]
forward_plus_y = [0.345, 0.619, 1.444, 2.197333]
forward_plus_2_5_d_culling_y = [0.345, 0.704, 1.471, 2.153333]
forward_plus_culling_y = [0.219, 0.383, 1.003, 1.490667]
forward_clustered_y = [0.258, 0.696667, 1.304333, 2.637333]
deferred_y = [1.516, 2.858, 5.547667, 8.216]
deferred_tiled_y = [0.386, 0.596, 1.123, 1.679333]
deferred_tiled_2_5_d_culling_y = [0.386, 0.596, 1.122, 1.679333]
deferred_tiled_culling_y = [0.264, 0.408, 0.774, 1.132333]
deferred_tiled_dice_y = [0.511, 0.697333, 1.364, 2.125333]
deferred_tiled_2_5_d_dice_culling_y = [0.42, 0.633, 1.359667, 1.938667]
deferred_tiled_dice_culling_y = [0.298, 0.439, 0.999667, 1.333]
deferred_tiled_intel_y = [0.414, 0.628, 1.358667, 1.880667]
deferred_clustered = [0.302, 0.502667, 0.981667, 1.734667]

plt.plot(x, forward_y, label="Forward")
plt.plot(x, forward_plus_y, label="Forward+")
plt.plot(x, forward_plus_2_5_d_culling_y, label="Forward+ 2.5D Culling")
plt.plot(x, forward_plus_culling_y, label="Forward+ 2.5D, AABB Culling")
plt.plot(x, forward_clustered_y, label="Forward Clustered")
plt.plot(x, deferred_y, label="Deferred")
plt.plot(x, deferred_tiled_y, label="Deferred Tiled")
plt.plot(x, deferred_tiled_2_5_d_culling_y, label="Deferred Tiled 2.5D Culling")
plt.plot(x, deferred_tiled_culling_y, label="Deferred Tiled 2.5D, AABB Culling")
plt.plot(x, deferred_tiled_dice_y, label="Deferred Tiled DICE")
plt.plot(x, deferred_tiled_2_5_d_dice_culling_y, label="Deferred Tiled DICE 2.5D Culling")
plt.plot(x, deferred_tiled_dice_culling_y, label="Deferred Tiled DICE 2.5D, AABB Culling")
plt.plot(x, deferred_tiled_intel_y, label="Deferred Tiled Intel")
plt.plot(x, deferred_clustered, label="Deferred Clustered")
plt.xlabel("Number of Shadowed Cone Lights")
plt.ylabel("Render Color Duration (ms)")
plt.legend()
plt.title(label="Rendering Pipeline Comparison")
plt.show()