---
title: Houdini Path Replace Tool
subtitle: Utility Script
category: tool
featured: false
order: 6
year: '2024'
role: Tool Development
software:
  - Houdini
  - Python
techniques:
  - Path replacement
  - Batch utility workflow
  - UI scripting
summary: Simple Houdini shelf tool script for previewing and replacing file path prefixes on selected nodes.
thumbnail: ../../assets/path_replace_stills/path_tool_thumb.jpg
video: https://vimeo.com/1175866774
poster: /posters/tool-rnd-video-01.jpg
---

This tool was built to speed up a small but repetitive production task inside Houdini: updating file path prefixes across selected nodes without manually editing each parameter.

## What It Does

The tool opens a lightweight dialog where you define an old path prefix and a new one. It scans the selected nodes, previews the matched changes, and applies the replacements only after confirmation.

## Why It Is Useful

In production, path structures often change because of versioning, folder reorganization, or handoff requirements. This script reduces manual cleanup and makes it easier to update multiple nodes in a controlled way.

## Workflow

- Select the Houdini nodes you want to process
- Run the shelf tool
- Enter the old and new path prefixes
- Review the preview list of detected changes
- Confirm to apply the replacements

## Implementation Notes

- The script targets string parameters that use file path types
- Matching is based on `startswith`, so the old prefix must begin at the start of the path
- Example:
  - Correct: `$HIP/2D` to `$HIP/3D`
  - Incorrect: `2D` to `3D`

## Installation

- Open Houdini
- Open the Shelves toolbar
- Create a new shelf tool
- Set the language to Python
- Paste the script contents into the tool
- Save it to your preferred shelf

## Repository

The source code for this tool is available on GitHub:

[houdini-path-replace-tool](https://github.com/Rui182-dev/houdini-path-replace-tool)
