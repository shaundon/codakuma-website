---
layout: page
title: 'Personal Best — Help and FAQs'
permalink: /personal-best/help
description: "Having trouble with Personal Best? You might find an answer here."
image: "/assets/personal-best-screenshots.png"
tags: personal-best apps
app_banner: id1510256676
---

Some common questions and troubleshooting guides for Personal Best.

## Seeing 'No Workouts' when opening Personal Best

Personal Best gets all its data from the [Apple Health (also known as HealthKit) database](https://support.apple.com/en-us/HT203037), which is stored locally on your iPhone.

If no workouts are displaying, it may indicate one of two things:

### No workouts

Personal Best is designed to display **all** workouts from Apple Health. This means that no matter what app you use to record your workouts — for example Apple Watch, Strava, Runkeeper, and so on, as long as it writes to Apple Health, Personal Best can display it.

If you aren't seeing the workouts you'd expect to see, check that the workouts exist in your Apple Health database. You can do this in the Health app by pressing 'Browse', searching for 'Workouts', then scrolling down and pressing 'Show All Data'.

If you're still having problems with workouts you expect to see in Apple Health not appearing, please send a screenshot of how the workout appears in Apple Health to [personalbest@codakuma.com](mailto:personalbest@codakuma.com) and I'll investigate.

### Permission not granted

The first time you open Personal Best, it asks for permission to access your workouts. If you don't approve this, it won't be able to access your data. 

For privacy reasons, Personal Best will never know if you didn't grant permission, Apple Health will just return zero workouts whenever it tries to load your workouts.

If you **didn't** give Personal Best permission to access your workouts, you can [update your settings](https://support.apple.com/en-us/HT204351) from within the Health app.

## A workout looks wrong or is missing in Personal Best

Personal Best displays whatever is stored in [Apple Health](https://support.apple.com/en-us/HT203037), so any data that's missing is **probably** not a problem with Personal Best. For example, if your runs from Strava don't write any route data to Apple Health, Personal Best can't display a map of the route.

If you're having problems and you think the problem is with Personal Best and not Apple Health, please send a screenshot of how the workout appears in Apple Health to [personalbest@codakuma.com](mailto:personalbest@codakuma.com) and I'll investigate. 

## Duplicate workouts

Personal Best displays whatever is stored in [Apple Health](https://support.apple.com/en-us/HT203037), so if you're seeing multiple copies of the same workout it means that something (not Personal Best) is adding multiple copies of your workouts to Apple Health.

For example, if you give Strava write permissions in the Health app, and record workouts using Apple Fitness, Strava will create duplicates of your workouts.

## No splits

Personal Best is only able to display splits when detailed distance data is available in Apple Health for a workout. Workouts recorded using Apple Watch and some other apps include this data, but some apps – like Strava – do not.

There is no technical limitation to stop Strava from including the correct data. [I've asked them to fix it](https://twitter.com/PersonalBestiOS/status/1364229599048122375) – Feel free to do the same and maybe they'll change stance if enough people ask.