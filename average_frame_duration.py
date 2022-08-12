import matplotlib.pyplot as plt
import numpy as np

names = [
    # "Default",
    "T",
    "T\n2.5D",  
    "T\n2.5D AABB", 
    "T (D)", 
    "T (D)\n2.5D",
    "T (D)\n2.5D AABB",
    "T (I)",
    "C"
    ]
# names = [
#     "D",       
#     "TG",   
#     "D T",        
#     "TG T",  
#     "D T\n2.5D", 
#     "TG T\n2.5D", 
#     "D T\n2.5D AABB",    
#     "TG T\n2.5D AABB", 
#     "D T (D)", 
#     "TG T (D)", 
#     "D T (D)\n2.5D",  
#     "TG T (D)\n2.5D",  
#     "D T (D)\n2.5D AABB",    
#     "TG T (D)\n2.5D AABB", 
#     "D T (I)",         
#     "TG T (I)",  
#     "D C",       
#     "TG C"
#     ]
# names = [
#     "F",           
#     "F+",       
#     "F+\n2.5D",  
#     "F+\n2.5D AABB", 
#     "F C",  
#     "D",        
#     "D T",      
#     "D T\n2.5D", 
#     "D T\n2.5D AABB",    
#     "D T (D)", 
#     "D T (D)\n2.5D",  
#     "D T (D)\n2.5D AABB",    
#     "D T (I)",  
#     "D C"
#     ]
values = [
    # 9.263303,  # D
    2.893273,   # D T 
    # 2.904136,   # D T 2.5D
    # 2.281252,   # D T 2.5D AABB
    3.192071,   # D T (D)
    # 3.185111,   # D T (D) 2.5D
    # 2.154752,   # D T (D) 2.5D AABB
    3.190207,   # D T (I)
    3.428804,   # D C
    ]

tg_values = [
    # 9.292886,   # TG
    2.876752,   # TG T 
    2.883240,   # TG T 2.5D
    2.276072,   # TG T 2.5D AABB
    3.188132,   # TG T (D)
    3.189948,   # TG T (D) 2.5D
    2.268873,   # TG T (D) 2.5D AABB
    3.183670,   # TG T (I)
    3.420807    # TG C
    ]
tg_no_encoding_values = [
    # 9.292886,   # TG
    2.985492,   # TG T 
    2.984555,   # TG T 2.5D
    2.027208,   # TG T 2.5D AABB
    2.967467,   # TG T (D)
    2.979789,   # TG T (D) 2.5D
    1.993680,   # TG T (D) 2.5D AABB
    2.986173,   # TG T (I)
    3.265196    # TG C
    ]
tg_baseline_values = [
    # 9.363991,   # TG
    2.974672,   # TG T 
    2.983588,   # TG T 2.5D
    1.996060,   # TG T 2.5D AABB
    2.973523,   # TG T (D)
    2.995271,   # TG T (D) 2.5D
    1.999904,   # TG T (D) 2.5D AABB
    2.972780,   # TG T (I)
    3.277768    # TG C
    ]
tg_z_reconstruction_values = [
    # 9.362995,   # TG
    2.975459,   # TG T 
    2.986767,   # TG T 2.5D
    2.370028,   # TG T 2.5D AABB
    3.301176,   # TG T (D)
    3.291484,   # TG T (D) 2.5D
    2.365279,   # TG T (D) 2.5D AABB
    3.292401,   # TG T (I)
    3.536016    # TG C
    ]
tg_spherical_coordinates_values = [
    # 9.339837,   # TG
    2.973836,   # TG T 
    2.978215,   # TG T 2.5D
    2.360536,   # TG T 2.5D AABB
    3.283825,   # TG T (D)
    3.279116,   # TG T (D) 2.5D
    2.347868,   # TG T (D) 2.5D AABB
    3.276293,   # TG T (I)
    3.513613    # TG C
    ]
tg_spheremap_transform_lambert_values = [
    # 9.345337,   # TG
    2.977019,   # TG T 
    2.982011,   # TG T 2.5D
    2.356364,   # TG T 2.5D AABB
    3.258762,   # TG T (D)
    3.288490,   # TG T (D) 2.5D
    2.346894,   # TG T (D) 2.5D AABB
    3.245564,   # TG T (I)
    3.525274    # TG C
    ]
tg_spheremap_transform_cryengine3_values = [
    # 9.341648,   # TG
    2.971684,   # TG T 
    2.973739,   # TG T 2.5D
    2.309112,   # TG T 2.5D AABB
    3.248319,   # TG T (D)
    3.241490,   # TG T (D) 2.5D
    2.322107,   # TG T (D) 2.5D AABB
    3.244258,   # TG T (I)
    3.486052    # TG C
    ]
tg_octahedron_values = [
    # 9.338022,   # TG
    2.969710,   # TG T 
    2.978812,   # TG T 2.5D
    2.338976,   # TG T 2.5D AABB
    3.239910,   # TG T (D)
    3.234394,   # TG T (D) 2.5D
    2.328966,   # TG T (D) 2.5D AABB
    3.236168,   # TG T (I)
    3.488590    # TG C
    ]
# values = [
#     9.263303,  # D
#     9.292886,   # TG
#     2.893273,   # D T 
#     2.876752,   # TG T 
#     2.904136,   # D T 2.5D
#     2.883240,   # TG T 2.5D
#     2.281252,   # D T 2.5D AABB
#     2.276072,   # TG T 2.5D AABB
#     3.192071,   # D T (D)
#     3.188132,   # TG T (D)
#     3.185111,   # D T (D) 2.5D
#     3.189948,   # TG T (D) 2.5D
#     2.154752,   # D T (D) 2.5D AABB
#     2.268873,   # TG T (D) 2.5D AABB
#     3.190207,   # D T (I)
#     3.183670,   # TG T (I)
#     3.428804,   # D C
#     3.420807    # TG C
#     ]
# Killzone G-Buffer
# values = [
#     17.156462,  # F 
#     8.265215,   # F+
#     8.272402,   # F+ 2.5D
#     7.620833,   # F+ 2.5D AABB
#     8.571651,   # F C
#     14.693195,  # D
#     8.010180,   # D T 
#     8.044776,   # D T 2.5D
#     7.475782,   # D T 2.5D AABB
#     7.936122,   # D T (D)
#     7.995784,   # D T (D) 2.5D
#     7.460425,   # D T (D) 2.5D AABB
#     7.984117,   # D T (I)
#     8.306425    # D C
#     ]

#plt.bar(names, values)
# plt.plot(names, values, label="Killzone")
# plt.plot(names, tg_values, label="Thin GBuffer")
plt.plot(names, tg_no_encoding_values, label="No Encoding")
plt.plot(names, tg_baseline_values, label="Baseline")
plt.plot(names, tg_z_reconstruction_values, label="Z Reconstruction")
plt.plot(names, tg_spherical_coordinates_values, label="Spherical Coordinates")
plt.plot(names, tg_spheremap_transform_lambert_values, label="Spheremap Transform Lambert Azimuthal Equal Area Projection")
plt.plot(names, tg_spheremap_transform_cryengine3_values, label="Spheremap Transform CryEngine 3")
plt.plot(names, tg_octahedron_values, label="Octahedron Normal")
plt.plot(names, tg_values, label="Octahedral Encoding")
plt.legend()
plt.xlabel("Pipelines")
plt.ylabel("Average Frame Duration")
plt.title(label="Rendering Pipeline Comparison")
plt.show()