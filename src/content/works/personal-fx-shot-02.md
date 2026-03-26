---
title: Ocean Landing - Giant Robot
subtitle: Demoreel Shot 02
category: personal
layoutVariant: editorial
featured: true
order: 2
year: '2026'
role: FX Artist
software:
  - Houdini
  - Maya
  - Nuke
techniques:
  - Water simulation
  - Secondary spray
  - Whitewater shaping
  - Impact timing
summary: A large-scale water-impact shot focused on silhouette, timing, and layered secondary motion.
projectContext: Personal simulation study built around a large-scale ocean impact, with close attention to silhouette, timing, and water readability.
technicalFocus: The main technical challenge in this shot was separating the large readable splash forms from the finer layers of spray, mist, and whitewater while keeping the setup scalable and easy to iterate in response to art direction and mentor feedback.
contribution:
  - Simulated the primary water impact and surrounding surface response in Houdini
  - Shaped spray, mist, and whitewater layers to reinforce scale and directional energy
  - Composited the final presentation pass for reel delivery
thumbnail: ../../assets/Demoreel2024_stills/fx-shot-02_thumb.jpg
gallery:
  - ../../assets/Demoreel2024_stills/fx-shot-02_thumb.jpg
additionalNotes: Responsible for all aspects of the shot, with the robot model provided.
video: https://youtu.be/lL-_kF8OwP0
localVideo: /media/reel/FP2.mp4
poster: /posters/fx-shot-02.jpg
---
This shot was developed as a personal scale study focused on the impact of a large mechanical form entering the ocean. The main goal was to create a water silhouette that felt heavy and readable at the moment of contact, then support it with layered secondary motion across spray, mist, and whitewater.

The simulation work was built in Houdini with attention on splash direction, impact timing, and the relationship between the larger primary shapes and the surrounding detail layers. I approached the shot as a timing and readability exercise, keeping the main forms clear while using the secondary elements to reinforce scale and energy.

<video autoplay muted loop playsinline preload="metadata">
  <source src="/media/reel/fp2_pass.mp4" type="video/mp4" />
</video>


## Post FX

All assets were assembled in Solaris for layout, lighting, and scene organization, then rendered with Karma. Multi-pass renders were composited in Nuke, where I handled integration, color balance, and final image polish to keep the simulation layers consistent in the final frame.

<video autoplay muted loop playsinline preload="metadata">
  <source src="/media/reel/fp2_comp_bd.mp4" type="video/mp4" />
</video>

## Look Dev

Textures were created in Substance Painter, then translated into a Solaris material setup using MaterialX. I adjusted shader parameters to develop a cleaner, more polished final look for the shot.

<video autoplay muted loop playsinline preload="metadata">
  <source src="/media/reel/fp2_lkdb.mp4" type="video/mp4" />
</video>

## Iteration

TOP nodes were used to wedge simulation parameters and generate overnight iterations with controlled variable changes, making it easier to compare results and refine the shot efficiently.

<video autoplay muted loop playsinline preload="metadata">
  <source src="/media/reel/fp2_bd.mp4" type="video/mp4" />
</video>


