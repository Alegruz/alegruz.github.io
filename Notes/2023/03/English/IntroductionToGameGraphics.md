# Introduction to Game Graphics Programming (2023.03.09)
[Home](/)

[Course Home](/Notes/2023/03/Korean/GameGraphicsProgramming.md)

#  What is Computer Graphics?

The term **computer graphics** describes any use of computers to create and manipulate images.<sup><a href="#footnote_1">[1]</a></sup> This includes 3D modeling, rendering, animation, and many more. In this course, we are focusing on **game graphics**.

Game graphics is a subset of computer graphics where the main focus is to create and manipulate images to be used for an interactive game. The term game graphics is a rather obscure in terms of a discipline. In both academia and industry, people would rather refer game graphics as "real-time rendering" as the main characteristic of a game is to be interactive. Real-time rendering is concerned with rapidly making images on the computer.

A narrow definition of computer graphics would state that it refers to taking a model of the objects in a scene (a geometric description of the things in the scene and a description of how they reflect light) and a model of the light emitted into the scene (a mathematical description of the sources of light energy, the directions of radiation, the distribution of light wavelengths, etc.), and then producing a representation of a particular view of the scene (the light arriving at some imaginary eye or camera in the scene).<sup><a href="#footnote_2">[2]</a></sup>

In this course, we **emphasize**:
* 3D
* Real-Time Rendering
* Photorealistic Rendering
* Physically-Based Rendering

We will **not** emphasize:
* 2D
* Artistic Rendering
* Effects
* GPGPU
* Modeling

## Resources

* Research
  * SIGGRAPH
  * SIGGRAPH Asia
  * Eurographics
  * I3D
  * HPG
  * CGF
  * JCGT
  * JGT
* Industry
  * GDC
  * SEED
  * Activision
  * Frostbite
  * Guerilla Games
  * Ready at Dawn
  * Unity
  * Unreal
  * NVIDIA
  * AMD
  * Disney

# History of Game Graphics

<iframe width="560" height="315" src="https://www.youtube.com/embed/1EWQYAfuMYw?start=846" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/XDB6gpjqins?start=44" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Start of game graphics was rather simple. Due to the lack of graphical computing powers, most games were either static, or were rendered in characters.

<iframe width="560" height="315" src="https://www.youtube.com/embed/e4VRgY3tkh0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Starting from 1970s, arcade console hardwares began to emerge, and games started its interest for better graphics.

<iframe width="560" height="315" src="https://www.youtube.com/embed/MU4psw3ccUI?start=7" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

2D graphics game rendering at interactive rates were the state-of-the-art real-time rendering systems at that time. Game graphics were rendered as a rasterized image. This continued to 1980s represented with early PC games and Japanese console games on NES.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Q4GiCg_m8wA?start=11" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

By the decade of 1990s, 3D games started its outbreak led by the infamous "Doom".

<iframe width="560" height="315" src="https://www.youtube.com/embed/vT3AaQ77ges?start=27" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Nintendo 64 console's strong hardware capabilities helped developers develop in full 3D, which made 3D game graphics the standard of the industry. By the year of 1994, Sony coined the term "GPU" with its Sony GPU in their first ever PlayStation console.



---

<div id="footnote_1">[1] Steve Marschner and Peter Shirley. 2021. Fundamentals of Computer Graphics (5th. ed.). A K Peters/CRC Press, New York, NY, USA.</div>
<div id="footnote_2">[2] John F. Hughes and Andries van Dam and Morgan McGuire and David F. Sklar and James D. Foley and Steven K. Feiner and Kurt Akeley. 2013. Computer Graphics: Principles and Practice (3rd. ed.). Addison-Wesley Professional, Boston, MA, USA.</div>
