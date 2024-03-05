---
layout: blog
title: "Introducing SalaryPig"
permalink: /introducing-salarypig/
description: "I've made an app for tracking your salary"
tags: ios
---

In my [2023 in review]({% link _posts/2023-12-31-2023-in-review.markdown %}) I set myself a goal to release two new apps this year. Here's the first one.

## SalaryPig

[SalaryPig](https://apps.apple.com/us/app/salarypig/id6475237479) is a simple app that does one thing: tracks your salary each day. You just enter your annual salary and your work schedule, and SalaryPig will update a counter each second to show how much you've earned that day so far.

## Meet Trevor

Tracking your salary is basically a glorified calculator, so I decided to add some personality by adding Trevor, an animated piggy bank who lives on your phone. He's awake when you're working, and outside of working hours he'll probably be napping (don't try to wake him up though, seriously).

I've never done any real work with graphics before, and building Trevor was loads of fun and a great learning experience. He's constructed from a bunch of overlapping SwiftUI views and animations, and a lot of trial and error to get him _just_ right.

![Screenshots of SalaryPig](/assets/post-images/salarypig-screenshots.png){:class="post-image"}

## Pricing

SalaryPig is free to use, and additional features like widgets and Apple Watch support can be unlocked by subscribing to SalaryPig Pro. I find the Apple Watch complication particularly useful, as I can just look at my wrist throughout the day and see my earnings count up.

## What's next

The first version of SalaryPig is very much an [MVP](https://en.wikipedia.org/wiki/Minimum_viable_product). Some ideas I have for future updates are:

- Support more than just annual salaries (e.g. people who earn hourly)
- VisionOS support
- Dress Trevor up with outfits
- Track your total earnings for the year
- More polish and animations for Trevor

## And finally

I wanted to call this app PayPig at first, it's much snappier and alliterative, but [a quick google ruled that out quickly](https://www.urbandictionary.com/define.php?term=paypig)...

[Get SalaryPig on the App Store](https://apps.apple.com/us/app/salarypig/id6475237479)
