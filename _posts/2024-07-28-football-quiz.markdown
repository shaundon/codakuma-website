---
layout: blog
title: "Expanding my new app experiment"
permalink: /new-app-experiment-evolved/
description: "Expanding my trivia app"
tags: ios
---

Four months ago [I wrote about](/new-app-experiment) a [Taylor Swift trivia app](https://apps.apple.com/app/id6479753779) I'd made as an experiment. The idea was to spend a small amount of time building a quiz app and seeing how it performs. At the time, I wrote _"If it does well, it'll be very easy for me adapt it to make more trivia apps about other topics (e.g. a football quiz, movies quiz, and so on)."_

It's doing well, so I've adapted it into [a football quiz app](https://apps.apple.com/app/id6563151175).

## How well is 'doing well'

The Taylor Swift quiz has been on the App Store just shy of four months, getting just under 2,000 downloads and $220 in revenue. Compared to my main app [Personal Best](https://getpersonalbest.com) this is a drop in the bucket, but I think it's enough proof that it's a viable avenue to keep exploring.

So, this felt like the right time to expand the experiment with a second quiz. I'm a big football\* fan, so a football quiz was a natural choice.

\*soccer for Americans

## Building it

Regular readers will know that each time I make a new app I try to learn something new (for example, with [SalaryPig](https://apps.apple.com/us/app/salarypig/id6475237479) I learned how to make interactive 2D graphics from shapes, as well as syncing user preferences over iCloud).

For this app, I learned how to make and maintain my own [Swift package](https://developer.apple.com/documentation/xcode/creating-a-standalone-swift-package-with-xcode). I abstracted most of the logic from my existing app into a package I named **QuizKit**, which then meant the new app could just be a light layer on top of that, with about 95% of functionality coming from QuizKit and only the actual questions and styling bespoke to the app.

Thanks to this, I was able to make the new app in less than a day. The most time-consuming parts were the things I couldn't abstract away, like actually writing the quiz questions and setting up the in-app purchases.

## The finished product

Football Quizzes is now [live on the App Store](https://apps.apple.com/app/id6563151175). It supports iPhone and iPad, as well as macOS and visionOS via the iPad app compatibility mode.

![Screenshots of Football Quizzes](/assets/post-images/fbq-screenshots.png){:class="post-image"}

## What's next

Actually getting the app released was really difficult, as the App Review team at Apple rejected it repeatedly. Firstly because it fell afoul of [guideline 4.3](https://developer.apple.com/app-store/review/guidelines/#spam), as they argued it was too similar to my previous app and could be construed as a spam app built from a template. I managed to convince them by explaining that I'd put a lot of care into writing the questions and pointed out the high-quality UX, and contrasted it with some other low-quality quiz apps on the App Store.

Then, I had several more rejections for using intellectual property from FIFA. This is understandable – Apple don't want to make themselves legally liable for anything on their store – so I had to remove all references to anything trademarked. For example, the "World Cup" quiz became the "World Championships" quiz. It's a bit like Pro Evolution Soccer on PS2 where they didn't have the rights to use real team names, so they had "West Midlands Village" instead of "Aston Villa", "Man Blue" instead of "Manchester City", and so on.

However, after this experience I'm going to put the quiz apps aside for now and dedicate 100% of my app development time to [Personal Best](https://getpersonalbest.com). It's my biggest app by far, and I love building it and hearing from users who are enjoying it.

Watch this space for more updates on Personal Best and how this new quiz app performs.
