import matplotlib.pyplot as plt
import numpy as np

names = [
    "F+",      
    "F+\n2.5D",  
    "F+\n2.5D AABB", 
    "F C",      
    "D T",      
    "D T\n2.5D", 
    "D T\n2.5D AABB",    
    "D T (D)",  
    "D T (D)\n2.5D", 
    "D T (D)\n2.5D AABB",    
    "D T (I)",  
    "D C"
    ]
values = [
    0.101632,   # F+
    0.109809,   # F+ 2.5D
    0.060863,   # F+ 2.5D AABB
    0.592483,   # F C
    0.101154,   # D T
    0.109619,   # D T 2.5D
    0.060932,   # D T 2.5D AABB
    1.458885,   # D T (D)
    1.476179,   # D T (D) 2.5D
    1.023920,   # D T (D) 2.5D AABB
    1.490615,   # D T (I)
    0.593286    # D C
    ]

plt.bar(names, values)
plt.xlabel("Pipelines")
plt.ylabel("Average Tile / Cluster Assignment Duration")
plt.title(label="Rendering Pipeline Comparison")
plt.show()