---
layout: blog
title: "A floating card using safeAreaBar"
permalink: /floating-safe-area-bar/
description: "Building a floating card component using iOS 26's safeAreaBar with an iOS 18 fallback"
tags: ios swiftui
---

A pattern I use a lot in [Personal Best](https://apps.apple.com/gb/app/personal-best-workouts/id1510256676) is to pin a card to the bottom of the screen containing a summary plus a call to action. Here's a simple example:

![Example of a full-width card pinned to the bottom of the screen](/assets/post-images/2026/05/original.png){:class="post-image post-image-small post-image--no-shadow"}

This is easily achieved using SwiftUI's [`safeAreaInset`](https://www.hackingwithswift.com/quick-start/swiftui/how-to-inset-the-safe-area-with-custom-content):

```swift
List(0..<100) { i in
  Text("Row \(i)")
}
.safeAreaInset(edge: .bottom) {
  VStack {
    Text("Some summary content")
    Button(action: {}) {
        Spacer()
        Text("Save")
        Spacer()
    }
    .buttonStyle(.borderedProminent)
  }
  .frame(maxWidth: .infinity)
  .padding()
  .background(.background)
}
```

Recently I've been evolving PB's design and one way I'm doing that is by adding a slight inset to these cards, so they float above the content. I feel like it fits in more with iOS 26's look and feel.

## Insetting the card

Insetting the card is easily done by adding some extra styles like padding and corner radius:

```swift
// same code as the prior example, plus the below modifiers
.cornerRadius(20)
.overlay(RoundedRectangle(cornerRadius: 20).stroke(.gray.opacity(0.25), lineWidth: 1))
.shadow(color: .black.opacity(0.1), radius: 5)
.padding()
```

It doesn't look quite right though. Even with the border and shadow, it's hard to tell it apart from the content below.

![A card inset into the screen](/assets/post-images/2026/05/initial-inset.png){:class="post-image post-image-small post-image--no-shadow"}

Fortunately there's a simple fix: [safeAreaBar](https://developer.apple.com/documentation/swiftui/view/safeareabar(edge:alignment:spacing:content:)). A safe area bar is functionally the same as a safe area inset except it applies iOS 26's scroll edge effect where the content blurs, fixing the readability issue.

![Comparison of safeAreaInset and safeAreaBar](/assets/post-images/2026/05/comparison.png){:class="post-image post-image--no-shadow"}


## iOS 18 fallback

Unfortunately there's an issue with this: `safeAreaBar` requires iOS 26. At the time of writing PB supports iOS 18, so I needed a workaround.

So, I built a fallback that works on iOS 18 combining an `ultraThinMaterial` and a gradient to give the content behind the card a soft fade effect.

```swift
.safeAreaInset(edge: .bottom) {
  myContent
    .background {
      Rectangle()
        .fill(.ultraThinMaterial)
        .mask(
          VStack(spacing: 0) {
            LinearGradient(
              colors: [.clear, .black],
              startPoint: .top,
              endPoint: .bottom
            )
            .frame(height: 30)
            Color.black
          }
        )
        .ignoresSafeArea()
    }
}
```

The `VStack` inside the mask is the key bit. The top 30 points are a gradient from clear to black, which means the material gradually becomes visible as you scroll down. Below that, the mask is solid black, so the material is fully opaque behind the bar itself.

`.ignoresSafeArea()` on the background lets the material extend all the way to the bottom edge of the screen, under the home indicator.

![The fallback effect for iOS 18](/assets/post-images/2026/05/fallback.png){:class="post-image post-image-small post-image--no-shadow"}

## Making it reusable

The final step was to abstract this out into a something reusable that would use a `safeAreaBar` on iOS 26 and fall back to my custom version on iOS 18. The code for that is below:

```swift
import SwiftUI

extension View {
  func floatingSafeAreaBar<InsetContent: View>(
    @ViewBuilder insetContent: @escaping () -> InsetContent
  ) -> some View {
    modifier(FloatingSafeAreaBar(insetContent: insetContent))
  }
}

struct FloatingSafeAreaBar<InsetContent: View>: ViewModifier {
  @ViewBuilder let insetContent: () -> InsetContent

  @ViewBuilder
  func body(content: Content) -> some View {
    if #available(iOS 26, *) {
      content.safeAreaBar(edge: .bottom) {
        insetContent()
          .modifier(CardStyle())
      }
    } else {
      content.safeAreaInset(edge: .bottom) {
        insetContent()
          .modifier(CardStyle())
          .background {
            Rectangle()
              .fill(.ultraThinMaterial)
              .mask(
                VStack(spacing: 0) {
                  LinearGradient(
                    colors: [.clear, .black],
                    startPoint: .top,
                    endPoint: .bottom
                  )
                  .frame(height: 30)
                  Color.black
                }
              )
              .ignoresSafeArea()
          }
      }
    }
  }
}

private struct CardStyle: ViewModifier {
  func body(content: Content) -> some View {
    content
      .padding()
      .frame(maxWidth: .infinity)
      .background(.background)
      .cornerRadius(20)
      .overlay(RoundedRectangle(cornerRadius: 20).stroke(.gray.opacity(0.25), lineWidth: 1))
      .shadow(color: .black.opacity(0.1), radius: 5)
      .padding()
  }
}
```

The `CardStyle` modifier wraps the inset content in a card with all my styles applied: full width, padding, rounded corners, a background colour, shadow and border.

### Using it

Now I have a convenient view extension I can use anywhere to get a pre-styled card.

```swift
ScrollView {
  // ... your scrolling content
}
.floatingSafeAreaBar {
  VStack {
    Text("Some summary content")
    Button(action: {}) {
        Spacer()
        Text("Save")
        Spacer()
    }
    .buttonStyle(.borderedProminent)
  }
}
```

Here's a few screenshots of how it looks in practice in my app:

![The card in situ](/assets/post-images/2026/05/in-situ.png){:class="post-image post-image--no-shadow"}

## The future

Even when iOS 26 becomes my app's minimum supported version this view extension will remain useful for applying consistent styles to these cards throughout the app. I'll simply remove the fallback code and make it use a `safeAreaBar` all the time.
