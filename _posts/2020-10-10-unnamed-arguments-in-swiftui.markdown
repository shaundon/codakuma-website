---
layout: page
title: "Declaring unnamed arguments in SwiftUI"
permalink: /swiftui-unnamed-arguments/
description: "How to make SwiftUI views with unnamed arguments"
tags: ios swiftui howto
---

Swift has long had the ability to omit argument labels to aid readability:

```swift
// With labelled arguments.
func greet(name: String) {
  print("Hello \(name)!")
}

greet(name: "Vanessa Vanjie Matteo")

// Without labelled arguments, much nicer.
func greet(_ name: String) {
  print("Hello \(name)!")
}

greet("Vanessa Vanjie Matteo")
```

I wanted to do this in a SwiftUI view, but I couldn't figure out how. Here's my original view:

```swift
struct Heading: View {
  let title: String

  var body: some View {
    HStack {
      Text(title).font(.title3).fontWeight(.semibold)
      Spacer()
    }
  }
}

// I have to set the 'title' argument every time I call it:
Heading(title: "Section Heading")
```

My colleagues [Zsolt](https://twitter.com/ZsoltJrDudas) and [Hugo](https://twitter.com/k0nserv) showed me how to do this. SwiftUI views have an `init` method that is generated behind the scenes. I can just declare my own:

```swift
struct Heading: View {
  let title: String

  init(_ title: String) {
    self.title = title
  }

  var body: some View {
    HStack {
      Text(title).font(.title3).fontWeight(.semibold)
      Spacer()
    }
  }
}

// Now I can call it in a nicer way!
Heading("Section Heading")
```

In hindsight this seems really obvious, but I couldn't figure it out for ages!

