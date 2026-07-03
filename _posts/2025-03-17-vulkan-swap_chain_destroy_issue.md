---
layout: post
title:  Why Exception Occurs at vkDestroySwapchainKHR?
date:   2025-03-17 00:00:00 +0000
categories: graphics
lang: "en"
description: "When destroying the swapchain, an exception occurs. The exception was a read access violation issue."
status: "report"
difficulty: "advanced"
series: "vulkan-notes"
series_order: 3
topic: api
---

## Issue

When destroying the swapchain, an exception occurs. The exception was a read access violation issue.

## Reason

The back buffer image given by the swapchain should not be deliberately destroyed with vkDestroyImage.

## Fix

Don't call vkDestroyImage on back buffer images.