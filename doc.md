# Project 1: Pinhole camera, rasterized display
**Course:** COMPUTER GRAPHICS I (001)
**Author:** Thu Le
**Repository:** https://github.com/banh-canh-cua/Thu-Le---CS5160-Computer-Graphics-diary.git
**Live Demo:** https://banh-canh-cua.github.io/Thu-Le---CS5160-Computer-Graphics-diary/

## Design
My idea is to build an interactive 3D scenery with two modes (day and night), inspired by retro arcade games.

The scene shows a landscape with multiple objects and layers:
- Sky with sun/ moon, clouds, and stars
- Mountain ranges
- Pine tree forest

![Day mode](/src/day_design.jpg)
![Night mode](/src/night_design.jpg)

## Features and Controls
We can explore the virtual world from a first-person perspective by moving the camera to walk through the scenery.
- Move camera:
  - W: go forward
  - S: go backward
  - A: go left
  - D: go right
  - R: reset camera position and switch to day mode
- Switch between day and night: click the sun/ moon object on the screen
- Switch render level:
  - 1: line drawing
  - 2: pixelated line drawing
  - 3: pixelated colored objects
