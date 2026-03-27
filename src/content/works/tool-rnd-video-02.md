---
title: Layered Rain System Study
subtitle: R&D Study
category: rnd
layoutVariant: editorial
featured: false
order: 6
year: '2026'
role: FX Artist / R&D
software:
  - Houdini
techniques:
  - Particle layering
  - Atmospheric FX
  - Smoke layering
  - Rough lookdev
summary: A Houdini R&D study built around a layered rain system for a moving car, combining three rain particle layers, two smoke layers, and rough Solaris lookdev.
projectContext: This project is an R&D study focused on building a controllable layered rain setup and testing how particles and VDB-based atmosphere behave inside Solaris. The goal was to explore readable heavy rainfall, tire interaction, and atmospheric depth around the car while developing a workable lookdev process.
contribution:
  - Built the rain setup with three distinct particle layers for depth and scale variation
  - Added two smoke layers to support road spray and atmospheric separation
  - Developed rough lookdev in Solaris
technicalFocus: The main challenge was separating the rain into controllable layers so foreground streaks, mid-range rainfall, and broader environmental rain could be tuned independently. Additional smoke layers were then used to support motion and depth without overwhelming the vehicle silhouette.
gallery:
  - ../../assets/Rain_RD/car-rnd.jpg
additionalNotes: This is still an R&D study rather than a finished production shot. The value of the project is in the layered setup, Solaris testing, and iteration process used to evaluate particles, volumes, and lookdev together.
thumbnail: ../../assets/Rain_RD/car-rnd_thumb.jpg
localVideo: /media/RD/Rain_RD/car_rain.mp4
poster: /posters/car_rain.jpg
---

## USD VDB Setup

For this study, I built an HDA that prepares the VDB caches into a USD setup with both render and proxy branches. The render branch keeps the full volume data for lookdev and final renders, while the proxy branch provides a lighter bounding-box representation for faster work inside Solaris. That made iteration much easier, because the setup could stay responsive in layout and lighting without giving up the heavier render version when needed.

<img src="/media/RD/Rain_RD/vdb-usd.jpg" alt="HDA setup with render and proxy branches for VDB USD data" width="420" />

## Iteration 01

This iteration focuses on how the rain behaves once additional smoke layers are introduced around the tires and rear of the car. It was useful for testing how much of the shot should read as direct rainfall versus secondary atmospheric spray.

<video autoplay muted loop playsinline preload="metadata" poster="/posters/car_rain_rnd.jpg">
  <source src="/media/RD/Rain_RD/car_rain_rnd.mp4" type="video/mp4" />
</video>

## Iteration 02

This pass shows another variation of the setup, comparing how the smoke and rain layers affect silhouette clarity, depth, and the overall balance of the image.

<video autoplay muted loop playsinline preload="metadata" poster="/posters/car_rain_rnd2.jpg">
  <source src="/media/RD/Rain_RD/car_rain_rnd2.mp4" type="video/mp4" />
</video>
