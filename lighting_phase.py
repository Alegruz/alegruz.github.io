import matplotlib.pyplot as plt
import numpy as np

x = ["32", "64", "128", "192"]

deferred_y = [1.349, 2.690, 5.380667, 8.049]
deferred_tiled_y = [0.218, 0.429, 0.955, 1.513]
deferred_tiled_2_5_d_culling_y = [0.218, 0.429, 0.955, 1.513]
deferred_tiled_culling_y = [0.097, 0.240, 0.606, 0.966]
deferred_tiled_dice_y = [0.344, 0.529667, 1.196667, 1.957333]
deferred_tiled_2_5_d_dice_culling_y = [0.253, 0.466, 1.193, 1.771667]
deferred_tiled_dice_culling_y = [0.131, 0.272, 0.832667, 1.166]
deferred_tiled_intel_y = [0.247, 0.460, 1.191667, 1.714]
deferred_clustered = [0.135, 0.335, 0.814, 1.272]

plt.plot(x, deferred_y, label="Deferred")
plt.plot(x, deferred_tiled_y, label="Deferred Tiled")
plt.plot(x, deferred_tiled_2_5_d_culling_y, label="Deferred Tiled 2.5D Culling")
plt.plot(x, deferred_tiled_culling_y, label="Deferred Tiled 2.5D, AABB Culling")
plt.plot(x, deferred_tiled_dice_y, label="Deferred Tiled DICE (tile assignment included)")
plt.plot(x, deferred_tiled_2_5_d_dice_culling_y, label="Deferred Tiled DICE 2.5D Culling (tile assignment included)")
plt.plot(x, deferred_tiled_dice_culling_y, label="Deferred Tiled DICE 2.5D, AABB Culling (tile assignment included)")
plt.plot(x, deferred_tiled_intel_y, label="Deferred Tiled Intel (tile assignment included)")
plt.plot(x, deferred_clustered, label="Deferred Clustered")
plt.xlabel("Number of Shadowed Cone Lights")
plt.ylabel("Lighting Phase Duration (ms)")
plt.legend()
plt.title(label="Rendering Pipeline Comparison")
plt.show()