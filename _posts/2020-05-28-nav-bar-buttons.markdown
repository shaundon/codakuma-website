---
layout: blog
title: "Making SwiftUI navigation bar buttons bigger"
permalink: /swiftui-navigation-bar-button-size/
description: "SwiftUI navigation bar buttons are too small. Here's a workaround."
tags: ios swiftui howto
---

Apple's human interface guidelines [specify that tap targets should be at least 44x44pt](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/adaptivity-and-layout/) to ensure they're easily tappable.

In UIKit, buttons in navigation bars automatically get this. You can test this easily on any iOS device. Open the Settings app, press an option, and then try to hit the back button slightly off the text. You'll notice that the button still works even though you're not pressing directly on the text. This is thanks to UIKit automatically ensuring that buttons inside navigation bars have a pressable area of at least 44x44pt.

In SwiftUI, this isn't the case. I don't know exactly why, but I imagine it's because SwiftUI is very new and it hasn't been added yet. You'll notice that when adding navigation bar buttons to SwiftUI apps, the tap targets are smaller. I first noticed this when users of my app [Personal Best](/personal-best) reported it as a bug.

## How to fix it

Fortunately, there's an easy workaround. Hopefully a future version of SwiftUI won't have this limitation and the workaround won't be necessary, but for now simply set a frame on the button:

```swift
Button("Hello World") {
    print("Hello world button pressed")
}.frame(minHeight: 44.0, minWidth: 44.0)
```

You can create a view modifier to keep the logic in one place:

```swift
struct BarButtonFrame: ViewModifier {
  func body(content: Content) -> some View {
    content.frame(minHeight: 44.0)
  }
}

Button("Hello World") {
    print("Hello world button pressed")
}.modifier(BarButtonFrame())
```

## Update - 16th June 2020

Icon buttons in navigation bars are also way too small. Here's some typical code for that:

```swift
Button(action: { print("Codakuma") }) {
  Image(systemName: "star")
}
```

To make it bigger, add an `imageScale`:

```swift
Button(action: { print("Codakuma") }) {
  Image(systemName: "star").imageScale(.large)
}
```

Again, hopefully SwiftUI will do this automatically in future.
