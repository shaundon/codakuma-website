---
layout: blog
title: "Building a more generic page control in SwiftUI"
permalink: /swiftui-page-control/
description: "How to make a page control component in SwiftUI that works with any view"
tags: ios swiftui howto
---

**Note: This article was written for iOS 13. iOS 14 has support for page controls built in. There is also now [iPages](https://github.com/benjaminsage/iPages), a great third-party library you can use for this.**

One of the components missing from SwiftUI (as of iOS 13.5) is [Page Control](https://developer.apple.com/design/human-interface-guidelines/ios/controls/page-controls/).

Apple has [a tutorial](https://developer.apple.com/tutorials/swiftui/interfacing-with-uikit) on their website which explains how to bridge this component from UIKit to SwiftUI - great! However the tutorial doesn't mention that the end result only works with arrays of basic matching content, like so:

```swift
// Works!
PageView([
    Text("Page one"),
    Text("Page two")
])

// Syntax error
PageView([
    Text("Page one"),
    Image(systemName: "star")
])

// Syntax error
PageView([
    Text("Page one"),
    HStack {
        Text("Left")
        Text("Right")
    }
])
```

The tutorial works perfectly for the use case it needs to — displaying an image carousel — but it doesn't work for more complex pages of data, like if you wanted to switch between an image and map view.

I found [a third-party library](https://github.com/fredyshox/PageView) that could do this which worked well, but it didn't _quite_ have that native feel I wanted, as it was reimplementing `UIPageControl` from scratch using SwiftUI instead of bridging it.

I figured out how to extend Apple's tutorial to work for my use case, but the API is rather hacky and there is undoubtedly a better way to do it. Still, it works for me and hopefully a future version of iOS will let me delete it. Here's how to do it:

Apple's original tutorial includes three files: `PageView`, `PageControl` and `PageViewController`. For this, we only need to edit `PageView`.

Here's how `PageView.swift` looks before making any edits:

```swift
struct PageView<Page: View>: View {
    var viewControllers: [UIHostingController<Page>]
    @State var currentPage = 0

    init(_ views: [Page]) {
        self.viewControllers = views.map { UIHostingController(rootView: $0) }
    }

    var body: some View {
        ZStack(alignment: .bottomTrailing) {
            PageViewController(controllers: viewControllers, currentPage: $currentPage)
            PageControl(numberOfPages: viewControllers.count, currentPage: $currentPage)
                .padding(.trailing)
        }
    }
}
```

The `init` method takes an array of `Page`. To enable passing in SwiftUI views that can be nested, we need to convert this to take a `ViewBuilder`. For starters, let's just make it take one view instead of multiple:

```swift
// Before
init(_ views: [Page]) {
    self.viewControllers = views.map { UIHostingController(rootView: $0) }
}

// After
init(@ViewBuilder views: () -> Page) {
    let content = views()
    self.viewControllers = [UIHostingController(rootView: content)] }
}
```

At this point, we can use the component with any content using SwiftUI's `ViewBuilder`:

```swift
PageView {
    HStack {
        Text("Left")
        Image(systemName: "star")
    }
}
```

However, we've removed the ability to show multiple pages. Let's bring that back. This is where the API gets bit hacky. Ideally, we would make the method signature of `init` something like this, so it could take an array of `ViewBuilder`s:

```swift
init(@ViewBuilder views: [() -> Page])
```

Sadly this doesn't work. I don't know if there's a way around this, but if there is please let me know on [Twitter](https://twitter.com/shauneba) or via [email](mailto:hi@codakuma.com).

I worked around this by constraining the API. Instead of taking an array, it takes multiple named views. The downside of this approach is that the component can now only accept as many views as you put in the API. Here's an example of it allowing exactly two views:

```swift
// Note 'PageOne' and 'PageTwo'. This is needed to allow different
// types of view to be passed in for each page.
struct PageView<PageOne: View, PageTwo: View>: View {
  var viewControllers: [UIViewController]
  @State var currentPage = 0

  init(
    @ViewBuilder firstPage: () -> PageOne,
    @ViewBuilder secondPage: () -> PageTwo
  ) {
    var viewControllers: [UIViewController] = [
        UIHostingController(rootView: firstPage()),
        UIHostingController(rootView: secondPage())
    ]
    viewControllers.append(UIHostingController(rootView: secondPage()))
    self.viewControllers = viewControllers
  }

  var body: some View {
    ZStack(alignment: .bottomTrailing) {
      PageViewController(controllers: viewControllers, currentPage: $currentPage)
      PageControl(numberOfPages: viewControllers.count, currentPage: $currentPage)
        .padding(.trailing)
    }
  }
}
```

This is quite hacky, but it does work fine. You could extend it to allow `nil` for the second page onwards, to make it more flexible too.

I ended up not using this in production, as I wanted to use it on entire pages (like in the iPhone's Weather app) but it exhibited strange issues with jumpiness. It does work great for smaller, less complex views though.
