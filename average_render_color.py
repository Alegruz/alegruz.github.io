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
# values = [
#     # 8.209077,   # D
#     1.682100,   # D T
#     1.681776,   # D T 2.5D
#     1.515849,   # D T 2.5D AABB
#     2.090744,   # D T (D)
#     2.089511,   # D T (D) 2.5D
#     1.393780,   # D T (D) 2.5D AABB
#     2.084804,   # D T (I)
#     # 1.769133,   # D C
#     ]
tg_values = [
    8.211464,   # TG
    1.664077,   # TG T
    1.664029,   # TG T 2.5D
    1.119404,   # TG T 2.5D AABB
    2.085664,   # TG T (D)
    2.113276,   # TG T (D) 2.5D
    1.507164,   # TG T (D) 2.5D AABB
    2.080627,   # TG T (I)
    1.750668    # TG C
    ]
tg_no_encoding_values = [
    8.234797,   # TG
    1.667105,   # TG T
    1.666793,   # TG T 2.5D
    1.118585,   # TG T 2.5D AABB
    2.151803,   # TG T (D)
    2.154772,   # TG T (D) 2.5D
    1.233719,   # TG T (D) 2.5D AABB
    2.146020,   # TG T (I)
    1.491016    # TG C
    ]
tg_baseline_values = [
    8.209352,   # TG
    1.665960,   # TG T
    1.665793,   # TG T 2.5D
    1.118040,   # TG T 2.5D AABB
    2.158047,   # TG T (D)
    2.176823,   # TG T (D) 2.5D
    1.240896,   # TG T (D) 2.5D AABB
    2.162056,   # TG T (I)
    1.500584    # TG C
    ]
tg_z_reconstruction_values = [
    8.209931,   # TG
    1.666533,   # TG T
    1.666285,   # TG T 2.5D
    1.118264,   # TG T 2.5D AABB
    2.186131,   # TG T (D)
    2.198671,   # TG T (D) 2.5D
    1.598976,   # TG T (D) 2.5D AABB
    2.177671,   # TG T (I)
    1.852808    # TG C
    ]
tg_spherical_coordinates_values = [
    8.197291,   # TG
    1.665541,   # TG T
    1.665113,   # TG T 2.5D
    1.117660,   # TG T 2.5D AABB
    2.181943,   # TG T (D)
    2.192119,   # TG T (D) 2.5D
    1.584948,   # TG T (D) 2.5D AABB
    2.173884,   # TG T (I)
    1.839617    # TG C
    ]
tg_spheremap_transform_lambert_values = [
    8.193958,   # TG
    1.666260,   # TG T
    1.666126,   # TG T 2.5D
    1.118070,   # TG T 2.5D AABB
    2.173446,   # TG T (D)
    2.181421,   # TG T (D) 2.5D
    1.585084,   # TG T (D) 2.5D AABB
    2.164590,   # TG T (I)
    1.847332    # TG C
    ]
tg_spheremap_transform_cryengine3_values = [
    8.202695,   # TG
    1.665433,   # TG T
    1.665055,   # TG T 2.5D
    1.117617,   # TG T 2.5D AABB
    2.179815,   # TG T (D)
    2.190826,   # TG T (D) 2.5D
    1.561808,   # TG T (D) 2.5D AABB
    2.167354,   # TG T (I)
    1.798816    # TG C
    ]
tg_octahedron_values = [
    8.200518,   # TG
    1.665899,   # TG T
    1.665570,   # TG T 2.5D
    1.118115,   # TG T 2.5D AABB
    2.172507,   # TG T (D)
    2.182505,   # TG T (D) 2.5D
    1.568208,   # TG T (D) 2.5D AABB
    2.171357,   # TG T (I)
    1.815390    # TG C
    ]
# values = [
#     8.209077,   # D
#     8.211464,   # TG
#     1.682100,   # D T
#     1.664077,   # TG T
#     1.681776,   # D T 2.5D
#     1.664029,   # TG T 2.5D
#     1.515849,   # D T 2.5D AABB
#     1.119404,   # TG T 2.5D AABB
#     2.090744,   # D T (D)
#     2.085664,   # TG T (D)
#     2.089511,   # D T (D) 2.5D
#     2.113276,   # TG T (D) 2.5D
#     1.393780,   # D T (D) 2.5D AABB
#     1.507164,   # TG T (D) 2.5D AABB
#     2.084804,   # D T (I)
#     2.080627,   # TG T (I)
#     1.769133,   # D C
#     1.750668    # TG C
#     ]
# values = [
#     12.198572,  # F 
#     1.854335,   # F+
#     1.854223,   # F+ 2.5D
#     1.274360,   # F+ 2.5D AABB
#     1.664561,   # F C
#     8.226697,   # D
#     1.499764,   # D T
#     1.497912,   # D T 2.5D
#     1.065416,   # D T 2.5D AABB
#     1.62623,    # D T (D)
#     1.644286,   # D T (D) 2.5D
#     1.191772,   # D T (D) 2.5D AABB
#     1.658505,   # D T (I)
#     1.385281    # D C
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
plt.ylabel("Average Render Color Duration")
plt.title(label="Rendering Pipeline Comparison")
plt.show()