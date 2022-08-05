import matplotlib.pyplot as plt
import numpy as np

x = ["32", "64", "128", "192"]

deferred_tiled_y = [0.168, 0.168, 5.392459, 7.655061]
deferred_tiled_2_5_d_culling_y = [0.167, 2.938219, 5.046336, 7.199499]
deferred_tiled_culling_y = [0.167, 2.973941, 5.006805, 7.076864]
deferred_tiled_dice_y = [0.167, 3.220832, 5.410421, 7.671029]
deferred_tiled_2_5_d_dice_culling_y = [0.167, 3.060736, 5.142507, 7.535445]
deferred_tiled_dice_culling_y = [0.167, 3.060736, 5.142507, 7.535445]
deferred_tiled_intel_y = [0.167, 3.220832, 5.410421, 7.671029]
deferred_clustered = [0.167, 0.168, 6.649227, 9.311381]

plt.plot(x, deferred_tiled_y, label="Deferred Tiled")
plt.plot(x, deferred_tiled_2_5_d_culling_y, label="Deferred Tiled 2.5D Culling")
plt.plot(x, deferred_tiled_culling_y, label="Deferred Tiled 2.5D, AABB Culling")
plt.plot(x, deferred_tiled_dice_y, label="Deferred Tiled DICE")
plt.plot(x, deferred_tiled_2_5_d_dice_culling_y, label="Deferred Tiled DICE 2.5D Culling")
plt.plot(x, deferred_tiled_dice_culling_y, label="Deferred Tiled DICE 2.5D, AABB Culling")
plt.plot(x, deferred_tiled_intel_y, label="Deferred Tiled Intel")
plt.plot(x, deferred_clustered, label="Deferred Clustered")
plt.xlabel("Number of Shadowed Cone Lights")
plt.ylabel("Scene Render Duration (ms)")
plt.legend()
plt.title(label="Rendering Pipeline Comparison")
plt.show()