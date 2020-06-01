---
layout: page
title: "Running HealthKit queries in the background"
permalink: /healthkit-in-the-background/
description: "TL;DR Turn on background app refresh"
tags: ios healthkit howto
---

Recently I've been trying to use `HKObserver` to monitor queries from HealthKit in the background. I wrote a simple integration where my app would print to the console every time a new workout was recorded. However, it was never triggered, except when I opened my app in the foreground.

I spent more time than I'd like to admit on StackOverflow and Apple's developer forums trying to figure this out. What on Earth was I doing wrong? I played around with my app's background entitlements, I set breakpoints all over the place, I thought I'd tried everything.

Eventually I found the answer, and it's a very simple one. I didn't have background app refresh enabled on my phone 🤦‍♂️. Enable that and it'll work fine.

**PS:** There is some confusion as to whether your app needs to explicitly use the background fetch entitlement to use HealthKit in the background. I tried both and you *don't* need the entitlement.