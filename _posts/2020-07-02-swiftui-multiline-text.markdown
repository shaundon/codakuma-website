---
layout: blog
title: "Multiline text in SwiftUI"
permalink: /swiftui-multiline-text/
description: "When SwiftUI text truncates when you don't want it to"
tags: ios swiftui howto
---

I keep running into an issue in SwiftUI where some text truncates where I don't expect it to. Here's an example from [Personal Best]({% link personal-best.markdown %})'s onboarding screen:

![Example of text being truncated](/assets/post-images/multiline-text-example-1.jpg){:class="post-image-small"}

I'm **sure** that I'm doing something wrong here, or perhaps misunderstanding how SwiftUI's layout system works. But for now, I made a modifier that I can apply to stop this from happening:

```swift
// View modifier
struct Multiline: ViewModifier {
  func body(content: Content) -> some View {
    content.fixedSize(horizontal: false, vertical: true)
  }
}

// Using it
Text("Hello world").modifier(Multiline())
```

One day I'll figure out the layout system a bit more so I won't need to do this, but for now it's doing the trick for me.
