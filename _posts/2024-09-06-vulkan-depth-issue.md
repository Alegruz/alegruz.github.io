---
layout: post
title:  Why My Depth Buffer Only Writes 0 or 1?
date:   2024-09-06 00:00:00 +0000
categories: graphics
lang: "en"
---

## Issue

Depth write only writes 0 or 1

## Reason

Check your viewport settings in `VkPipelineViewportStateCreateInfo`. I bet your min/max depth are both 0.

## Fix

Set your `VkViewport`'s min/max depth value in `VkPipelineViewportStateCreateInfo` and in `vkCmdSetViewport`.