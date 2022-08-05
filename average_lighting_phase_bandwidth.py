import matplotlib.pyplot as plt
import numpy as np

names = [
    # "D",       
    "D T",      
    # "D T\n2.5D", 
    # "D T\n2.5D AABB",    
    # "D T (D)",  
    # "D T (D)\n2.5D", 
    # "D T (D)\n2.5D AABB",    
    # "D T (I)",  
    "D C"
    ]
values = [
    # 8.058472,   # D
    1.331750,   # D T
    # 1.330552,   # D T 2.5D
    # 0.897603,   # D T 2.5D AABB
    # 1.458896,   # D T (D)
    # 1.476191,   # D T (D) 2.5D
    # 1.023933,   # D T (D) 2.5D AABB
    # 1.490627,   # D T (I)
    1.147837    # D C
    ]

plt.bar(names, values)
plt.xlabel("Pipelines")
plt.ylabel("Average Lighting Phase Duration")
plt.title(label="Rendering Pipeline Comparison")
plt.show()