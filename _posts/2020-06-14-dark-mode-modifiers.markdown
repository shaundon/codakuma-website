---
layout: blog
title: "SwiftUI view modifers and dark mode"
permalink: /view-modifiers-dark-mode/
description: "How to adapt your SwiftUI view modifiers to behave differently if dark mode is enabled."
tags: ios swiftui howto
---

In SwiftUI, you can achieve most UI needs without ever explicitly checking for dark mode, thanks to [semantic colours built into the platform](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/color/) and the ability to [define our own semantic colours](https://developer.apple.com/documentation/xcode/supporting_dark_mode_in_your_interface) that automatically adapt to dark mode.

However, sometimes you might need to something explicit that the system can't handle automatically. Maybe you want to remove a shadow from a view in dark mode, or use a different font.

Getting the current colour scheme inside a SwiftUI view is simple:

```swift
struct MyView: View {
    @Environment(\.colorScheme) var colorScheme: ColorScheme

    var body: some View {
        Text(colorScheme == .dark ? "Dark mode" : "Light mode")
    }
}
```

You can also do this inside [view modifiers](https://developer.apple.com/documentation/swiftui/slider/view_modifiers), so that your view logic can stay separate from your presentation logic:

```swift
struct FontModifier: ViewModifier {
    @Environment(\.colorScheme) var colorScheme: ColorScheme

    func body(content: Content) -> some View {
        let font: Font = colorScheme == .dark ? .system(size: 20) : .custom("Marker Felt", size: 20)
      return content.font(font)
    }
}
```

Just to reiterate the point: in most cases, you should use semantic colours and images to adapt your interfact for dark mode. This is how to do it manually for situations where that isn't possible.
