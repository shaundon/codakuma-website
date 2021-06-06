---
layout: page
title: "Adding privacy-first analytics to Personal Best"
permalink: /anna-lytical/
description: "How I added analytics to Personal Best while preserving privacy."
tags: ios swift howto
---

## Intro

My workout-tracking app [Personal Best](/personal-best) has always put privacy first. It's the right thing to do from both an ethical and business perspective, giving people an alternative to some of the larger workout-tracking apps that have [questionable](https://www.cosmopolitan.com/uk/reports/a33560067/strava-privacy-settings/) [privacy](https://arstechnica.com/tech-policy/2016/05/runkeeper-fitnesskeeper-breaches-data-protection-law-norway/) [practices](https://protonvpn.com/blog/fitness-apps-are-good-for-your-health-but-often-bad-for-your-privacy/).

However, as the app has grown and matured I found myself wanting to know more about how the app was being used, to help me know where to focus my efforts. I didn't want anything too fancy – no creepy stuff like tracking user journeys or measuring engagement time, I simply wanted to anonymously log some events when certain parts of the app were used.

## Finding the right analytics service

There are many third-party SDKs that can add analytics to iOS apps, like [Google Analytics](https://developers.google.com/analytics/devguides/collection/ios/v3) and [Mixpanel](https://mixpanel.com). The problem with these, for me, was that they're at best massive dependencies I'd need to integrate into my app (which prior to now contained no third-party dependencies), and at worst creepy closed-source SDKs doing who-knows-what behind the scenes.

It's worth noting that iOS itself includes basic analytics, but it really is basic. You can't currently (early June 2021) use it to log arbitrary events, just overall usage. It's also far from real time. 

Eventually I learned about [AppTelemetry](https://apptelemetry.io) from an issue of [iOS Dev Weekly](https://iosdevweekly.com/issues/506). Their tagline – _"Lightweight Analytics That's Not Evil"_ – sounded exactly like what I was looking for. I checked it out and it had everything going for it:

* From [an indie developer](https://twitter.com/breakthesystem) who believed in privacy
* Built-in anonymisation of users
* Open source, so I could see exactly how it worked
* A really lightweight codebase, [just one class](https://github.com/AppTelemetry/SwiftClient/blob/main/Sources/TelemetryClient/TelemetryClient.swift) of about 300 lines of code, so it wouldn't add much overhead to my build times

With all that, I decided to give AppTelemetry a go and signed up for the beta.

## Integrating it

Initially I just followed [AppTelemetry's great documentation](https://apptelemetry.io/pages/sending-signals.html) exactly, adding calls to `TelemetryManager` to my screens. However, this meant I then had to add `import TelemetryClient` to every file I wanted to log an event in. To fix this, I made a new file within my project that could abstract away all of the Telemetry stuff. Plus, it's better to use a layer of abstraction like this so that I can more easily switch out the analytics provider in the future, if that's something I want to do.

```swift
// AnalyticsManager.swift

import TelemetryClient

struct AnalyticsManager {

  // Call this when the app starts.
  static func initialize() {
    let configuration = TelemetryManagerConfiguration(appID: "YOUR_ID_HERE")
    TelemetryManager.initialize(with: configuration)
    print("➡️ Initialized TelemetryManager.")
  }

  // Log an event.
  static func log(_ name: String) {
    print("➡️ Logging analytic event '\(name)'.")
    TelemetryManager.send(name)
  }

  // Log an event with arbitary metadata attached.
  static func log(_ name: String, with metadata: [String: String]) {
    print("➡️ Logging analytic event '\(name)' with metadata \(metadata).")
    TelemetryManager.send(name, with: metadata)
  }

  // Log when a screen is opened.
  static func logScreenOpened(_ screenName: String) {
    let name = "ScreenOpened"
    let metadata = ["ScreenName": screenName]
    print("➡️ Logging analytic event '\(name)' with metadata \(metadata).")
    TelemetryManager.send(name, with: metadata)
  }
}
```

Following this, I can simply call `AnalyticsManager` anywhere in my code that I want:

```swift
// Logging a basic event
Button(action: {
  AnalyticsManager.log("WorkoutShared")
  openShareSheet()
}) {
  Text("Share workout")
}

// Logging an event with metadata
Button(action: {
  AnalyticsManager.log("AppIconChanged", with: ["IconName": selectedAppIcon])
  setAppIcon(selectedAppIcon)
}) {
  Text("Change app icon")
}

// Logging when a screen is opened
var body: some View {
  Text("Hello World")
    .onAppear {
      AnalyticsManager.logScreenOpened("HelloWorldScreen")
    }
}
```

There's not much else to it, really. As it's such a simple library this is all the code I needed to start seeing events in real time.

## Preserving privacy

One thing to be aware of is that even though you're using a privacy-first analytics library you still need discipline to ensure you preserve privacy. There's nothing stopping you from logging personally-identifiable information to AppTelemetry except your own judgement. 

To prevent this, always collect the bare minimum of data that you need. For example, in the above code sample for logging a `WorkoutShared` event, I deliberately don't collect any information about the workout. Even though the workout doesn't contain any personally-identifiable information, there's just no need for me to know the details of it, so I don't include it.

Also, the more data you collect, the more data types you'll have to mention in your [App Store privacy nutrition label](https://www.apple.com/privacy/labels/), so it's in your best interests to limit what you collect.