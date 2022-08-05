import matplotlib.pyplot as plt
import numpy as np

names = [
    "F",           
    "F+",       
    "F+\n2.5D",  
    "F+\n2.5D AABB", 
    "F C",  
    "D",        
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
    17.156462,  # F 
    8.265215,   # F+
    8.272402,   # F+ 2.5D
    7.620833,   # F+ 2.5D AABB
    8.571651,   # F C
    14.693195,  # D
    8.010180,   # D T 
    8.044776,   # D T 2.5D
    7.475782,   # D T 2.5D AABB
    7.936122,   # D T (D)
    7.995784,   # D T (D) 2.5D
    7.460425,   # D T (D) 2.5D AABB
    7.984117,   # D T (I)
    8.306425    # D C
    ]

plt.bar(names, values)
plt.xlabel("Pipelines")
plt.ylabel("Average Frame Duration")
plt.title(label="Rendering Pipeline Comparison")
plt.show()