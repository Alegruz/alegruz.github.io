import matplotlib.pyplot as plt
import numpy as np

x = ["32", "64", "128", "192"]

forward_plus_y = [0.065, 0.066, 0.083, 0.103]
forward_plus_2_5_d_culling_y = [0.070, 0.072, 0.092, 0.112]
forward_plus_culling_y = [0.039, 0.042, 0.052, 0.063]
forward_clustered_y = [0.288, 0.353, 0.474, 0.601]
deferred_tiled_y = [0.065, 0.066, 0.083, 0.103]
deferred_tiled_2_5_d_culling_y = [0.070, 0.072, 0.092, 0.112]
deferred_tiled_culling_y = [0.039, 0.042, 0.052, 0.063]
deferred_tiled_dice_y = [0.344, 0.529667, 1.196667, 1.957333]
deferred_tiled_2_5_d_dice_culling_y = [0.253, 0.466, 1.193, 1.771667]
deferred_tiled_dice_culling_y = [0.131, 0.439, 0.832667, 1.166]
deferred_tiled_intel_y = [0.247, 0.460, 1.191667, 1.714]
deferred_clustered = [0.288, 0.353, 0.476333, 0.603]

plt.plot(x, forward_plus_y, label="Forward+")
# plt.plot(x, forward_plus_2_5_d_culling_y, label="Forward+ 2.5D Culling")
# plt.plot(x, forward_plus_culling_y, label="Forward+ 2.5D, AABB Culling")
plt.plot(x, forward_clustered_y, label="Forward Clustered")
plt.plot(x, deferred_tiled_y, label="Deferred Tiled")
# plt.plot(x, deferred_tiled_2_5_d_culling_y, label="Deferred Tiled 2.5D Culling")
# plt.plot(x, deferred_tiled_culling_y, label="Deferred Tiled 2.5D, AABB Culling")
# plt.plot(x, deferred_tiled_dice_y, label="Deferred Tiled DICE (shading included)")
# plt.plot(x, deferred_tiled_2_5_d_dice_culling_y, label="Deferred Tiled DICE 2.5D Culling (shading included)")
# plt.plot(x, deferred_tiled_dice_culling_y, label="Deferred Tiled DICE 2.5D, AABB Culling (shading included)")
# plt.plot(x, deferred_tiled_intel_y, label="Deferred Tiled Intel (shading included)")
plt.plot(x, deferred_clustered, label="Deferred Clustered")
plt.xlabel("Number of Shadowed Cone Lights")
plt.ylabel("Tile Cluster Assignment Duration (ms)")
plt.legend()
plt.title(label="Rendering Pipeline Comparison")
plt.show()