---
layout: page
title: "Earliest sample dates in HealthKit"
permalink: /healthkit-earliest-sample-dates/
description: "On watchOS, you can only access seven days of HealthKit data"
tags: ios watchos healthkit howto
---

When building a watchOS extension for my iPhone app [Personal Best]({% link personal-best.markdown %}), I couldn't figure out why querying the HealthKit store for workouts was only returning 25 results, as opposed to over 700 on iPhone.

It turns out that iOS and watchOS have separate HealthKit stores. watchOS only stores seven days worth of workouts.

You can confirm this by using `HKHealthStore`'s `earliestPermittedSampleDate` method:

```swift
let healthStore = HKHealthStore()

// When called on iOS:
healthStore.earliestPermittedSampleDate() // 0001-01-01 00:00:00 +0000

// When called on watchOS:
healthStore.earliestPermittedSampleDate() // 2020-05-25 23:00:00 +0000
```
