---
layout: post
title:  Why vkAcquireNextImageKHR Returns VK_NOT_READY?
date:   2025-03-17 00:00:00 +0000
categories: graphics
lang: "en"
description: "I requested three frame buffers, and vkAcquireNextImageKHR returns VKNOTREADY on the last frame buffer at the first cycle, and the returned image index is th..."
status: "report"
difficulty: "advanced"
series: "vulkan-notes"
series_order: 4
topic: api
tags: [api, vulkan-notes, vulkan]
---

## Issue

I requested three frame buffers, and vkAcquireNextImageKHR returns VK_NOT_READY on the last frame buffer at the first cycle, and the returned image index is the number of frame buffers.

## Reason

If vkQueuePresentKHR() is not being called, Vulkan may not release images, causing vkAcquireNextImageKHR() to fail. If vkQueuePresentKHR is missing, no image gets released, and vkAcquireNextImageKHR() eventually returns VK_NOT_READY.

## Fix

Add the present call.