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
    10.867782,  # F 
    1.854335,   # F+
    1.854223,   # F+ 2.5D
    1.274360,   # F+ 2.5D AABB
    1.664561,   # F C
    8.226697,   # D
    1.499764,   # D T
    1.497912,   # D T 2.5D
    1.065416,   # D T 2.5D AABB
    1.62623,    # D T (D)
    1.644286,   # D T (D) 2.5D
    1.191772,   # D T (D) 2.5D AABB
    1.658505,   # D T (I)
    1.385281    # D C
    ]

plt.bar(names, values)
plt.xlabel("Pipelines")
plt.ylabel("Average Render Color Duration")
plt.title(label="Rendering Pipeline Comparison")
plt.show()