---
layout: blog
title: "Optional view arguments in SwiftUI"
permalink: /swiftui-optional-view-arguments/
description: "How to make SwiftUI views with optional view arguments"
tags: ios swiftui howto
---

I came to SwiftUI from the [React](https://reactjs.org) world, where it's common to pass views (_components_ in React terminology) to other views:

```jsx
<Heading trailingAccessoryView={<Icon name="star">}>
  Hello World
</Heading>
```

I knew that this was possible in SwiftUI because some built-in views use it, like `Section`'s `header` and `footer` arguments:

```swift
Section(header: { Text("Header") }) {
  ...
}
```

I couldn't figure out how to do it for ages. It's pretty trivial to do it where the argument is always required, but I wanted to do it like `Section`, where I could omit the `header` argument entirely and it would still work.

Eventually I figured it out, using extensions. Here's an example, using a `Heading` component from [Personal Best]({% link personal-best.markdown %})'s codebase.

```swift
struct Heading<AccessoryView: View>: View {
  let title: String
  let accessoryView: AccessoryView

  init(_ title: String, @ViewBuilder accessoryView: () -> AccessoryView) {
    self.title = title
    self.accessoryView = accessoryView()
  }

  var body: some View {
    HStack {
      Text(title)
      Spacer()
      accessoryView
    }
  }
}
```

Let's stop here. At this point, `Heading` takes two arguments — `title`, which is a string, and `accessoryView` which is a function builder, meaning it can take any SwiftUI code. Using it is pretty straightforward:

```swift
Heading("Hello World", accessoryView: { Color.blue })
```

But what about if we don't want an accessory view?

```swift
TestView("Title") // Produces a compile error — "Generic parameter 'AccessoryView' could not be inferred
```

So now we need to make `accessoryView` optional somehow. Let's try making the argument optional, with a default argument.

```swift
struct Heading<AccessoryView: View>: View {
  let title: String
  let accessoryView: AccessoryView?

  init(_ title: String, @ViewBuilder accessoryView: () -> AccessoryView? = { nil }) {
    self.title = title
    self.accessoryView = accessoryView()
  }

  ...
}
```

Unfortunately the compile error doesn't go away. Let's try a different approach. Instead of making `accessoryView` optional, let's extend `Heading` to have a second initialiser that only takes a title, and passes an empty view as the accessory view. Looking at the source for `Section`, Apple uses a similar pattern there.

```swift
extension Heading where AccessoryView == EmptyView {
  init(_ title: String) {
    self.init(title, accessoryView: { EmptyView() })
  }
}
```

```swift
TestView("Title") // No compiler errors!
```

It works! Figuring out this pattern really helped me to make much more powerful views that can be composed from other views.
