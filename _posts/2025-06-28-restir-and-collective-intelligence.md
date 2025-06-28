---
layout: post
title:  ReSTIR and Collective Intelligence
date:   2025-06-28 20:55:00 +0900
categories: graphics
lang: "en"
---

Lately, I’ve been studying real-time global illumination techniques—particularly ReSTIR and its extensions. As I dug deeper into how the algorithm works, I began to see a curious and compelling analogy: ReSTIR resembles how humans learn from each other.

In this metaphor, each individual is like a reservoir. We learn independently, but we also draw knowledge from our neighbors—those around us who have accumulated experience, insights, and partial solutions to complex problems. Some of their solutions may be original, but more often, they’re adaptations: a form of resampled wisdom. Much like ReSTIR, we evaluate these incoming ideas, compare them to our own past experiences, and update our internal "reservoir" based on what seems best.

Of course, the ideal way to solve a problem is to understand every underlying detail: the equations, the logic, the constraints. But realistically, it’s more efficient for a small subset of experts to do this hard work while others reuse or resample the resulting knowledge. In this way, ReSTIR doesn’t just represent a rendering algorithm—it mirrors the dynamics of distributed learning in society.

This lens also explains some of ReSTIR’s limitations. If your "expert" neighbors have poor or biased samples, your final estimate will suffer—just like a network of people depending on bad information. Even when everyone is trying to solve the same question (e.g., evaluating incident radiance), their individual constraints—hardware, time, visibility—make it impossible to always compute the “ground truth.” This is especially true in dynamic scenes, where no two pixels (or people) face exactly the same world.

Viewed this way, sample reuse becomes a form of collective cognition. But collective intelligence has downsides, too: if everyone depends too much on their neighbors without doing any sampling of their own, error compounds. In some cases, it may even open the door to lazy sampling or malicious shortcuts—propagating worse solutions instead of better ones.

Put simply, ReSTIR is a clever approximation that recognizes a universal truth: no one has the time or resources to solve the full light transport equation at every pixel, just like no one person can discover all truth alone. So we collaborate—intelligently, statistically, and sometimes imperfectly.