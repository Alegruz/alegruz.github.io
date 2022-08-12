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
    "C"
    ]
# names = [
#     "D",       
#     "D T",      
#     "D T\n2.5D", 
#     "D T\n2.5D AABB",    
#     "D T (D)",  
#     "D T (D)\n2.5D", 
#     "D T (D)\n2.5D AABB",    
#     "D T (I)",  
#     "D C",
#     "TG",        
#     "TG T",      
#     "TG T\n2.5D", 
#     "TG T\n2.5D AABB",    
#     "TG T (D)", 
#     "TG T (D)\n2.5D",  
#     "TG T (D)\n2.5D AABB",    
#     "TG T (I)",  
#     "TG C"
#     ]
# names = [
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
    8.042278,   # D
    1.515103,   # D T
    1.514912,   # D T 2.5D
    0.967281,   # D T 2.5D AABB
    1.923928,   # D T (D)
    1.922704,   # D T (D) 2.5D
    1.349076,   # D T (D) 2.5D AABB
    1.917844,   # D T (I)
    1.271824,   # D C
    ]
tg_values = [
    8.058228,   # TG
    1.510908,   # TG T
    1.510820,   # TG T 2.5D
    0.966237,   # TG T 2.5D AABB
    1.932996,   # TG T (D)
    1.960537,   # TG T (D) 2.5D
    1.354512,   # TG T (D) 2.5D AABB
    1.927828,   # TG T (I)
    1.271619    # TG C
    ]
tg_no_encoding_values = [
    8.082714,   # TG
    1.514892,   # TG T
    1.514676,   # TG T 2.5D
    0.966504,   # TG T 2.5D AABB
    2.000200,   # TG T (D)
    2.002996,   # TG T (D) 2.5D
    1.081854,   # TG T (D) 2.5D AABB
    1.994291,   # TG T (I)
    1.272831    # TG C
    ]
tg_baseline_values = [
    8.057295,   # TG
    1.513960,   # TG T
    1.513864,   # TG T 2.5D
    0.966069,   # TG T 2.5D AABB
    2.006447,   # TG T (D)
    2.025320,   # TG T (D) 2.5D
    1.089263,   # TG T (D) 2.5D AABB
    2.010388,   # TG T (I)
    1.271631    # TG C
    ]
tg_z_reconstruction_values = [
    8.058130,   # TG
    1.514868,   # TG T
    1.514544,   # TG T 2.5D
    0.966477,   # TG T 2.5D AABB
    2.034728,   # TG T (D)
    2.047366,   # TG T (D) 2.5D
    1.447528,   # TG T (D) 2.5D AABB
    2.026277,   # TG T (I)
    1.274196    # TG C
    ]
tg_spherical_coordinates_values = [
    8.045326,   # TG
    1.513649,   # TG T
    1.513372,   # TG T 2.5D
    0.965853,   # TG T 2.5D AABB
    2.030444,   # TG T (D)
    2.040797,   # TG T (D) 2.5D
    1.433520,   # TG T (D) 2.5D AABB
    2.022476,   # TG T (I)
    1.271652    # TG C
    ]
tg_spheremap_transform_lambert_values = [
    8.042728,   # TG
    1.514917,   # TG T
    1.514892,   # TG T 2.5D
    0.966781,   # TG T 2.5D AABB
    2.022615,   # TG T (D)
    2.030454,   # TG T (D) 2.5D
    1.434200,   # TG T (D) 2.5D AABB
    2.013669,   # TG T (I)
    1.272194    # TG C
    ]
tg_spheremap_transform_cryengine3_values = [
    8.051216,   # TG
    1.513959,   # TG T
    1.513813,   # TG T 2.5D
    0.966366,   # TG T 2.5D AABB
    2.028859,   # TG T (D)
    2.039877,   # TG T (D) 2.5D
    1.410949,   # TG T (D) 2.5D AABB
    2.016392,   # TG T (I)
    1.273585    # TG C
    ]
tg_octahedron_values = [
    8.048669,   # TG
    1.514100,   # TG T
    1.513998,   # TG T 2.5D
    0.966419,   # TG T 2.5D AABB
    2.021291,   # TG T (D)
    2.031206,   # TG T (D) 2.5D
    1.416883,   # TG T (D) 2.5D AABB
    2.020069,   # TG T (I)
    1.273569    # TG C
    ]
# values = [
#     8.042278,   # D
#     8.058228,   # TG
#     1.515103,   # D T
#     1.510908,   # TG T
#     1.514912,   # D T 2.5D
#     1.510820,   # TG T 2.5D
#     1.349076,   # D T 2.5D AABB
#     0.966237,   # TG T 2.5D AABB
#     1.923928,   # D T (D)
#     1.932996,   # TG T (D)
#     1.960537,   # D T (D) 2.5D
#     1.972711,   # TG T (D) 2.5D
#     1.226992,   # D T (D) 2.5D AABB
#     1.354512,   # TG T (D) 2.5D AABB
#     1.917844,   # D T (I)
#     1.927828,   # TG T (I)
#     1.271824,   # D C
#     1.271619    # TG C
#     ]
# Killzone G-Buffer
# values = [
#     8.058472,   # D
#     1.331750,   # D T
#     1.330552,   # D T 2.5D
#     0.897603,   # D T 2.5D AABB
#     1.458896,   # D T (D)
#     1.476191,   # D T (D) 2.5D
#     1.023933,   # D T (D) 2.5D AABB
#     1.490627,   # D T (I)
#     1.147837    # D C
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
plt.ylabel("Average Lighting Phase Duration")
plt.title(label="Rendering Pipeline Comparison")
plt.show()