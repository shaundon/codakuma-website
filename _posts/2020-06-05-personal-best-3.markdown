---
layout: page
title: "Personal Best 3"
permalink: /personal-best-3/
description: "What time is it? Time to check your workouts on your Apple Watch!"
image: "/assets/post-images/personal-best-3-screenshots.png"
tags: apps personal-best 
---

I know, I know. Two major version bumps in seven days. It wasn't intentional.

Personal Best 3 is now live [on the App Store](https://apps.apple.com/us/app/personal-best-workouts/id1510256676?ls=1)!

## watchOS support

I added an Apple Watch app! Thanks to SwiftUI, it was super easy. It's more limited in functionality to only focus on the core things you might want to see on the go. This is the first version of it though and I'd like to add more features in time.

![Screenshots of Personal Best on watchOS](/assets/post-images/personal-best-3-screenshots.png){:class="post-image"}

One limitation of watchOS is that Apple Health only stores up to seven days of data. Because of this, you can only see workouts on the watchOS version from the last seven days. I wrote about this from a technical perspective [earlier this week]({% link _posts/2020-06-03-healthkit-earliest-damples.markdown %}).

One nice thing about watchOS is that people don't expect sexy, custom UI elements, so you can for the most part just use what the OS provides and it's totally fine. You can do this too on iOS of course, but not to the same degree, otherwise everything you make will look like the Settings app. I guess what I'm really saying is that I'm lazy.

## Localisation/Localization

I'm extremely British. I like queuing, scones, and drinking tea that hasn't been thrown into a harbour. 

As such, up to now Personal Best used the _English (UK)_ localisation. Personal Best 3 adds an _English (US)_ locale setting, which aggressively uses _z_ instead of _s_, and defaults to miles and yards for units. You don't need to do anything to select it, it'll just use iOS's locale setting. Look out for more localisations in future updates.

## More reliable refreshing

Previously, your workouts were only refreshed when Personal Best was first opened. Now, they're refreshed every time the app is woken from sleep.

[Download Personal Best 3 for free](https://apps.apple.com/us/app/personal-best-workouts/id1510256676?ls=1)