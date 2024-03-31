---
layout: blog
title: "Experimenting with a new app"
permalink: /new-app-experiment/
description: "I've built a trivia app as an experiment"
tags: ios
---

In my quest for more revenue from my app business, I've made a new app: a [Taylor Swift quiz](https://apps.apple.com/app/id6479753779).

## Why

My app [Taylor's Version](https://taylorsversion.app) already features a small quiz that appears while it makes a slow request to an external API. Recently after talking to a friend I had the idea to split this into its own app.

There are a few apps like this already, but they often have really poor UX, huge download sizes, and just generally don't come across great. I saw this as an opportunity for me to build a compelling experience, as well as a way for me to continue developing my design skills by tackling a type of app I haven't really done before.

## How

I'm wary of spreading myself too thin and taking focus from my main app [Personal Best](https://getpersonalbest.com), so I set myself some constraints:

### Ready in one weekend

I would spend exactly one weekend on the app, so that I didn't end up sinking weeks into it.

### No scope creep

I'm terrible for increasing the scope of my apps. My "it'll just take a weekend" projects often grow into month-long sagas. To help me keep things lean, I defined the scope ahead of time and didn't allow it to budge. The app needed to:

- Offer a range of quizzes for people to complete. Some of them would be free, with others unlockable via in-app purchase.
- Have a nice UX that would make it stand out amongst other apps. I wanted each quiz to have its own colour scheme so they'd feel distinct from each other, and I wanted to have slick animations and haptics throughout. If Apple themselves made a trivia app, it might look something like this.
- Allow people to share images of their results, as this could potentially help growth.
- Support iPhone and iPad.

### Learn something new

Each time I make a new app, I try to do something I've never done before as a way of learning something I can then apply to other apps. For example when I built [SalaryPig](/pig) I learned how to make interactive, animated 2D graphics.

For this, I chose [Swift Data](https://developer.apple.com/xcode/swiftdata/) as the new thing I'd learn. I want to use it on Personal Best in the future, so this would be a good introduction to it inside a real production app.

## The finished product

The app is now [live on the App Store](https://apps.apple.com/app/id6479753779). It supports iPhone and iPad, as well as macOS and visionOS via the iPad app compatibility mode.

![Screenshots of Quiz for Taylor Swift](/assets/post-images/tsquiz-screenshots.png){:class="post-image"}

## Next steps

I intend to let the app [breathe](https://www.youtube.com/watch?v=qsUK-BG5OQQ) and see how it performs before doing more with it. My hope is that it'll pick up some downloads over time via word of mouth and having good [ASO](https://www.adjust.com/glossary/aso/)

If it does well, it'll be very easy for me adapt it to make more trivia apps about other topics (e.g. a football quiz, movies quiz, and so on).

There's also some more roads I could go down if I decide to further develop this app, like:

### Support more platforms

I've never made an Android app, and this could be a good way to get started with that. It could also translate well to tvOS, or even Apple Watch so people can play on the go.

### Ads

I've never included ads in an app, but if this does sufficiently good numbers it'll be worth considering.

### Stats and achievements

It'd be fairly simple to add things like this too, and I could even add support for Game Centre while I'm at it.

### More purchase options

Right now, each premium quiz costs 49p. I could offer more diverse pricing, like a bundle where you get 5 quizzes of your choice for a discount, or a 'mega' purchase to unlock everything.

## Finally

I'll be sure to post an update in the future about how it's performing. In the meantime, one of my [goals for 2024]({% link _posts/2023-12-31-2023-in-review.markdown %}) was ship two new apps. With this and [SalaryPig]({% link _posts/2024-02-26-introducing-salarypig.markdown %}), mission accomplished 😎
