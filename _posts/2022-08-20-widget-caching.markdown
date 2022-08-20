---
layout: page
title: "Keeping a widget up to date efficiently on iOS"
permalink: /widgetkit-improvements/
description: "Three improvements to make your widgets more reliable"
tags: ios howto
---

My workout tracking app [Personal Best](https://getpersonalbest.com) includes widgets for tracking your workouts from your home and lock screens using [WidgetKit](https://developer.apple.com/widgets/) (lock screen widgets coming with iOS 16).

![Screenshot of Personal Best's widgets](/assets/post-images/pb-widgets.jpg){:class="post-image post-image--no-shadow"}

![Screenshot of Personal Best's lock screen widgets](/assets/post-images/pb-lock-screen-widgets.jpg){:class="post-image post-image--no-shadow"}

Recently I've been putting some work into making them more reliable. Here are some tips and tricks that came out of it.

## Make use of timelines

Widgets work by providing **timelines**, which is where you provide iOS with an array of entries for your widget ahead of time.

A classic example is a weather app. If it's going to be sunny from 10am to 2pm, then rainy from 3pm to 5pm, you can reflect this in the entries you pass to WidgetKit:

![Visualisation of a weather app providing hourly timeline entries to reflect the expected weather](/assets/post-images/weather-timeline.png){:class="post-image post-image--no-shadow"}

Personal Best wasn't making use of this because I naively thought that this pattern didn't apply for my use case, because it depends on knowing things ahead of time, and I don't know when you're going to be working out. So, instead of providing an array of entries to pass to WidgetKit, I was only passing in a single entry reflecting the current state of your workouts.

This caused a problem where Personal Best's widgets would occasionally show stale information. For example, you go for a run on Monday afternoon, and the widget updates to show your last workout was "today at 15:14pm". The next morning, you unlock your phone and it hasn't updated to say "Yesterday", it still says that your workout was today.

I realised that this was a problem that timeline entries could solve. So, I changed the widgets to provide lots of entries to reflect how things should look into the future, based on the current time.

Thanks to this, the widgets are now much more up to date. When I look at my phone first thing in the morning the day after a workout, the widget has updated during the night to say "Yesterday".

**Key takeaway:** Most apps can make use of timeline entries, even if it doesn't seem like it at first.

## Find ways to refresh when appropriate

One downside of providing several hours' worth of timeline entries up front is the potential for stale data. Let's say your widget refreshes and provides twelve hours of entries. Four hours later, you go swimming. Because there are eight hours of prebuilt timeline entries remaining, the widget won't update to reflect your swim until eight hours from now.

In this situation, Personal Best needs to know when a workout occurred so it can manually refresh the widget. Fortunately, HealthKit includes an API that apps can use to monitor for background updates. I linked that up to Personal Best so that when a new workout is added to HealthKit, the widget is refreshed manually using `WidgetCenter.shared.reloadAllTimelines()`.

**Key takeaway:** Make use of APIs to know when to manually refresh your widgets.

## Make use of caching

Personal Best's widgets rely on data from [HealthKit](https://developer.apple.com/documentation/healthkit). HealthKit isn't available when your phone is locked, which means if WidgetKit reloads Personal Best's widgets when the phone is locked, they fail to load and the widget reverts to a placeholder state with no data, which makes for a poor user experience.

To get around this, I added a cache based on [this answer by pawello2222 on StackOverflow](https://stackoverflow.com/a/65764918/1011161). It's very simple. When the widget refreshes successfully, it stores the last timeline entry in an object. Next time the widget refreshes, if it fails due to HealthKit not being available, it will check the cache for a previous entry. If there is one, it gives WidgetKit a copy of the cached entry, with the date updated to reflect the current date and time.

[Here's a gist on GitHub that demonstrates how it works](https://gist.github.com/shaundon/b4b823fbcac863d24c1ebe751cc97cfc).

Thanks to this, Personal Best's widgets now fall back to older data if your phone is locked.

**Key takeaway:** Widgets should be fault tolerant when data fails to load. Falling back to old data is often better than displaying an error.

## Final thoughts

WidgetKit is a very powerful framework with some unique constraints. It's worth the effort to adapt your mental model and your app's functionality to fit the WidgetKit way of doing things.

These improvements to Personal Best's widgets will be included in the forthcoming iOS 16 release.

[Download Personal Best on the App Store](https://getpersonalbest.com)

