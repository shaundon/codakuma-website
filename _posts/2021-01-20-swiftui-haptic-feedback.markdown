---
layout: page
title: "Adding haptic feedback to buttons in SwiftUI"
permalink: /swiftui-haptics/
description: "How to add haptic feedback to buttons (and other views) very simply."
tags: ios swift howto
---

Haptic feedback is a huge part of iOS and many apps use it well to add subtle feedback to certain actions. 

Many SwiftUI elements have haptic feedback built in already. For example, when you drag your finger over the options in a [`Menu`](https://developer.apple.com/documentation/swiftui/menu), you'll feel a subtle tap. When you switch a [`Toggle`](https://developer.apple.com/documentation/swiftui/toggle) on and off you'll feel a firmer tap.

Other elements like buttons don't have any built-in haptics, so we need to add them ourselves. [Hacking With Swift has a great tutorial](https://www.hackingwithswift.com/books/ios-swiftui/making-vibrations-with-uinotificationfeedbackgenerator-and-core-haptics) about how to do this, which I've based this post on. We'll create an extension for `View` so that we can trigger haptic feedback with one line of code. It's very short because iOS has an excellent, succinct API for triggering basic haptics.


```swift
import SwiftUI

extension View {

  func hapticFeedbackOnTap(style: UIImpactFeedbackGenerator.FeedbackStyle = .light) -> some View {
    self.onTapGesture {
      let impact = UIImpactFeedbackGenerator(style: style)
      impact.impactOccurred()
    }
  }

}
```

To use it, just add it to any view:

```swift
// Light feedback when a button is tapped.
Button(action: { print("Tap tap tap") }) {
  Text("Tap me and I'll tap you back")
}
.hapticFeedbackOnTap()

// Rigid feedback when a menu is opened.
Menu {
  Button(action: { }) {
    Text("Press me")
  }
  Button(action: {  }) {
    Text("Press me too")
  }
} label: {
    Text("Open menu")
}
.hapticFeedbackOnTap(style: .rigid)
```

## Feedback styles

The function takes an optional argument of type [`UIImpactFeedbackGenerator.FeedbackStyle`](https://developer.apple.com/documentation/uikit/uiimpactfeedbackgenerator/feedbackstyle). There are several possible values, each giving a different haptic sensation.

[Here's a handy code snippet from Harry Harrison you can run on your phone to try out the different sensations](https://gist.github.com/Harry-Harrison/e4217a6d8c4cfbee1aa5128c4491a149).

## More advanced haptics

For more complex haptic feedback, iOS offers the fantastic [`CoreHaptics`](https://developer.apple.com/documentation/corehaptics) module. It's outside the scope of this post, but as always [Hacking With Swift has a really thorough tutorial](https://www.hackingwithswift.com/example-code/core-haptics/how-to-play-custom-vibrations-using-core-haptics) about how to use it.


