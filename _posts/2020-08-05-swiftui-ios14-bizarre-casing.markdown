---
layout: blog
title: "iOS 14's bizarre text casing behaviour in List headings"
permalink: /swiftui-ios14-list-heading-case/
description: "iOS 14 changes your section titles to uppercase, which...yeah?"
tags: ios swiftui howto ios14
---

Here's a SwiftUI list with a section header:

```swift
List {
  Section(header: Text("Hello world")) {
    ...
  }
}
```

In iOS 13, this appeared like you'd expect:

![iOS 13 list section header example](/assets/post-images/ios13-section-header.png)

Rebuild this with the iOS 14 SDK, and everything is forced to uppercase:

![iOS 14 list section header example](/assets/post-images/ios14-section-header.png)

This is... kind of annoying. I _think_ it's intentional, as it's still present up to beta 4. If only it were documented somewhere so we'd know for sure if it's intentional or a bug to be fixed later.

Anyway, the workaround is easy:

```swift
List {
  Section(header: Text("Hello world").textCase(nil)) {
    ...
  }
}
```

BRB, I'm off to add `.textCase(nil)` to about 100 different places in my codebase.
