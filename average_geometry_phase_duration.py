import matplotlib.pyplot as plt
import numpy as np

names = [
    "Default",
    "T",
    "T\n2.5D",
    "T\n2.5D AABB",
    "T (D)",
    "T (D)\n2.5D",
    "T (D)\n2.5D AABB",
    "T (I)",
    "C",
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
    
values = [
    0.166784,  # D
    0.166968,   # D T 
    0.166856,   # D T 2.5D
    0.166756,   # D T 2.5D AABB
    0.166776,   # D T (D)
    0.166780,   # D T (D) 2.5D
    0.166756,   # D T (D) 2.5D AABB
    0.166928,   # D T (I)
    0.497280,   # D C
    ]
tg_values = [
    0.153208,   # TG
    0.153144,   # TG T 
    0.153196,   # TG T 2.5D
    0.153136,   # TG T 2.5D AABB
    0.152644,   # TG T (D)
    0.152716,   # TG T (D) 2.5D
    0.152624,   # TG T (D) 2.5D AABB
    0.152776,   # TG T (I)
    0.479044    # TG C
    ]
tg_no_encoding_values = [
    0.152060,   # TG
    0.152180,   # TG T 
    0.152100,   # TG T 2.5D
    0.152052,   # TG T 2.5D AABB
    0.151580,   # TG T (D)
    0.151760,   # TG T (D) 2.5D
    0.151840,   # TG T (D) 2.5D AABB
    0.151716,   # TG T (I)
    0.218176    # TG C
    ]
tg_baseline_values = [
    0.152028,   # TG
    0.151976,   # TG T 
    0.151908,   # TG T 2.5D
    0.151940,   # TG T 2.5D AABB
    0.151572,   # TG T (D)
    0.151480,   # TG T (D) 2.5D
    0.151608,   # TG T (D) 2.5D AABB
    0.151628,   # TG T (I)
    0.228944    # TG C
    ]
tg_z_reconstruction_values = [
    0.151788,   # TG
    0.151652,   # TG T 
    0.151732,   # TG T 2.5D
    0.151760,   # TG T 2.5D AABB
    0.151384,   # TG T (D)
    0.151296,   # TG T (D) 2.5D
    0.151416,   # TG T (D) 2.5D AABB
    0.151364,   # TG T (I)
    0.578592    # TG C
    ]
tg_spherical_coordinates_values = [
    0.151940,   # TG
    0.151872,   # TG T 
    0.151716,   # TG T 2.5D
    0.151788,   # TG T 2.5D AABB
    0.151476,   # TG T (D)
    0.151300,   # TG T (D) 2.5D
    0.151404,   # TG T (D) 2.5D AABB
    0.151384,   # TG T (I)
    0.567932    # TG C
    ]
tg_spheremap_transform_lambert_values = [
    0.151204,   # TG
    0.151320,   # TG T 
    0.151212,   # TG T 2.5D
    0.151263,   # TG T 2.5D AABB
    0.150809,   # TG T (D)
    0.150946,   # TG T (D) 2.5D
    0.150862,   # TG T (D) 2.5D AABB
    0.150898,   # TG T (I)
    0.575115    # TG C
    ]
tg_spheremap_transform_cryengine3_values = [
    0.151455,   # TG
    0.151451,   # TG T 
    0.151220,   # TG T 2.5D
    0.151229,   # TG T 2.5D AABB
    0.150932,   # TG T (D)
    0.150927,   # TG T (D) 2.5D
    0.150835,   # TG T (D) 2.5D AABB
    0.150942,   # TG T (I)
    0.525210    # TG C
    ]
tg_octahedron_values = [
    0.151823,   # TG
    0.151774,   # TG T 
    0.151553,   # TG T 2.5D
    0.151675,   # TG T 2.5D AABB
    0.151196,   # TG T (D)
    0.151277,   # TG T (D) 2.5D
    0.151304,   # TG T (D) 2.5D AABB
    0.151269,   # TG T (I)
    0.541799    # TG C
    ]
# values = [
#     0.166784,  # D
#     0.153208,   # TG
#     0.166968,   # D T 
#     0.153144,   # TG T 
#     0.166856,   # D T 2.5D
#     0.153196,   # TG T 2.5D
#     0.166756,   # D T 2.5D AABB
#     0.153136,   # TG T 2.5D AABB
#     0.166776,   # D T (D)
#     0.152644,   # TG T (D)
#     0.166780,   # D T (D) 2.5D
#     0.152716,   # TG T (D) 2.5D
#     2.154752,   # D T (D) 2.5D AABB
#     0.152624,   # TG T (D) 2.5D AABB
#     0.166928,   # D T (I)
#     0.152776,   # TG T (I)
#     0.497280,   # D C
#     0.479044    # TG C
#     ]

# plt.bar(names, values)
# plt.plot(names, values, label="Killzone")
# plt.plot(names, tg_values, label="Thin GBuffer")
plt.plot(names[1:], tg_no_encoding_values[1:], label="No Encoding")
plt.plot(names[1:], tg_baseline_values[1:], label="Baseline")
plt.plot(names[1:], tg_z_reconstruction_values[1:], label="Z Reconstruction")
plt.plot(names[1:], tg_spherical_coordinates_values[1:], label="Spherical Coordinates")
plt.plot(names[1:], tg_spheremap_transform_lambert_values[1:], label="Spheremap Transform Lambert Azimuthal Equal Area Projection")
plt.plot(names[1:], tg_spheremap_transform_cryengine3_values[1:], label="Spheremap Transform CryEngine 3")
plt.plot(names[1:], tg_octahedron_values[1:], label="Octahedron Normal")
plt.plot(names[1:], tg_values[1:], label="Octahedral Encoding")
plt.legend()
plt.xlabel("Pipelines")
plt.ylabel("Average Geometry Phase Duration")
plt.title(label="Rendering Pipeline Comparison")
plt.show()