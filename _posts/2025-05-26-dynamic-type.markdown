---
layout: blog
title: "Making your iOS app more accessible with dynamic type"
permalink: /dynamic-type/
description: "How I made my app more accessible, and how you can too."
tags: ios swiftui accessibility
---

I recently attended an event at Apple London for [Global Accessibility Awareness Day](https://accessibility.day), which spurred me to make my app [Personal Best](https://apps.apple.com/gb/app/personal-best-workouts/id1510256676) more accessible.

I'm still working on adding better VoiceOver support, but I'm happy to say that Personal Best now works great at all dynamic type sizes. This means that no matter what text size people use the app will be fully usable.

## Dynamic type primer

[Dynamic type](https://developer.apple.com/design/human-interface-guidelines/typography#Supporting-Dynamic-Type) is an Apple feature for customising your text size. As of May 2025 there are twelve possible values: **xSmall**, **small**, **medium**, **large** _(default value)_, **xLarge**, **xxLarge**, **xxxLarge**, **AX1**, **AX2**, **AX3**, **AX4**, and **AX5**. The _AX_ in the latter five sizes stands for _accessibility_.

In terms of dynamic type support, apps fall into one of three categories:

### 1. Unsupported

Some apps don't support dynamic type at all. The font is always the same size regardless of your dynamic type setting.

Below is the [Skyscanner](https://www.skyscanner.net/) app with my font size at the _AX5_ (highest) setting. You can see it's stuck showing text at the default size because they've opted out of dynamic type entirely.

![Screenshot of Skyscanner](/assets/post-images/2025/05/skyscanner.png){:class="post-image post-image-small"}

### 2. Supported but broken

Some apps support dynamic type but haven't been fully optimised, so some elements look broken or cut off. An example of this is the weightlifting app [Hevy](https://www.hevyapp.com/) where a lot of text gets cut off.

![Screenshot of Hevy](/assets/post-images/2025/05/hevy.png){:class="post-image post-image-small"}

### 3. Fully supported

Finally, we have apps that work perfectly at all dynamic type sizes. The text grows and shrinks according to the user's text size, and everything still looks and works great. An example of this is [Foodnoms](https://foodnoms.com/), my food tracking app of choice.

![Screenshot of Foodnoms](/assets/post-images/2025/05/foodnoms.png){:class="post-image post-image-small"}

## The state of Personal Best

Before starting this work Personal Best was in category #2. There were parts that looked ok, but a bunch of issues in almost every screen with text getting cut off or otherwise looking bad.

I want Personal Best to be a best-in-class iOS app, which means making it work great for **everyone**. Not only is this the right thing to do, it's also a business opportunity. My [TelemetryDeck](https://dashboard.telemetrydeck.com/registration/organization?referralCode=50QE8PTHDMB1JL8B) analytics indicates that very few of my users are using the _AX_ text sizes, which could be an indication that I was leaving the needs of a significant section of the market unaddressed.

![Screenshot of dynamic type settings from TelemetryDeck](/assets/post-images/2025/05/td-dynamic-type.png){:class="post-image post-image-small"}

To fix the issues, I went through every screen and checked it at the `AX5` size, and every time something looked broken, I'd adapt the layout to fix it. Then I'd put the text back to the default size, and check I hadn't inadvertently broken anything in the process.

## Fixing it

I found that every issue fell into one of three categories:

- Non-scrollable content
- Insufficient horizontal space
- Custom approach required

Here's how I approached each of these issues.

### Non-scrollable content

Often we'll have some content that fits fine at smaller sizes, but at very large ones it goes off the screen. Unlike on the web, SwiftUI views don't scroll by default when they overflow.

![Screenshot showing the scrollable content issue](/assets/post-images/2025/05/scrollable-0.png){:class="post-image"}

In the screenshot above, the text gets cut off and there's no way for users to see the end of the text.

A simple fix is to wrap it all in a `ScrollView`. This solves the problem but replaces it [with a different problem](https://youtu.be/EKWW6oFQDZY?si=owKFOMbh4FjlHSYv&t=30). We've broken the layout at non-AX type sizes – our content was bottom aligned but that's no longer the case.

![Screenshot showing wrapping it in a ScrollView](/assets/post-images/2025/05/scrollable-1.png){:class="post-image post-image-small"}

To fix this, we can make the ScrollView only display when needed. For this I turned to [Daniel Klöck's ScrollViewIfNeeded package](https://github.com/dkk/ScrollViewIfNeeded). This is a great utility which only adds a ScrollView if the content is large enough to need it. Here's how the code looks:

```swift
ScrollViewIfNeeded {
  VStack {
    Spacer()
    Image(systemName: "heart.fill")
    Text("Here is some long text content. At small text sizes it's not an issue, but at larger dynamic type sizes we may begin to run into some issues. Especially on smaller phones like iPhone SE. I'm running out of things to say.")
  }
}
```

And here's how it looks in practice:

![Screenshot showing wrapping it in ScrollViewIfNeeded](/assets/post-images/2025/05/scrollable-2.png){:class="post-image"}

### Insufficient horizontal space

I use `HStack` extensively to lay content out side by side. At large sizes the available space is reduced because more of it is taken up by text, and the content can become difficult to parse. Here's a typical example of this issue:

![Screenshot showing the layout issue](/assets/post-images/2025/05/hstack-0.png){:class="post-image"}

While it's still pretty readable, it could be better. The icon on the trailing edge has a lot of empty space above and below it. If we give that space to the text, it won't need to wrap as much. To do this, we change the layout at larger sizes to use a `VStack` instead of a `HStack`.

SwiftUI has a couple of ways to achieve this: [`ViewThatFits`](https://www.hackingwithswift.com/quick-start/swiftui/how-to-create-an-adaptive-layout-with-viewthatfits) and [`dynamicType.isAccessibilitySize`](https://developer.apple.com/documentation/swiftui/dynamictypesize/isaccessibilitysize). These allow us to detect if we're running out of space or if the user is using an `AX` type size and show a different layout. Here's how that looks:

#### Using ViewThatFits

```swift
ViewThatFits {

  // Original HStack-based layout
  HStack {
    VStack(alignment: .leading) {
      Text("Welcome to the app!").font(.title)
      Text("Some extra text about onboarding.")
        .font(.headline)
        .foregroundStyle(.secondary)
    }
    Spacer()
    Image(systemName: "globe")
      .imageScale(.large)
      .foregroundStyle(.tint)
  }

  // Alternative VStack-based layout
  VStack {
    VStack(alignment: .leading) {
      Text("Welcome to the app!").font(.title)
      Text("Some extra text about onboarding.")
        .font(.headline)
        .foregroundStyle(.secondary)
    }
    Image(systemName: "globe")
      .imageScale(.large)
      .foregroundStyle(.tint)
  }
}
.padding()
.background(.regularMaterial)
```

This works quite well. Our original HStack layout is used initially, but at larger sizes we get a VStack-based layout.

![Screenshot of the same view using ViewThatFits](/assets/post-images/2025/05/hstack-1.png){:class="post-image"}

This is a big improvement. Instead of eight lines the text now only occupies five lines, and _'onboarding'_ doesn't need to be hyphenated; it fits on one line.

There is a potential issue however. The VStack-based layout kicks in at the _xLarge_ size, when it probably didn't need to. I'm not knowledgeable enough about SwiftUI's layout system to know why this happens. In your case this might not be a problem, but for me I wanted to maintain the HStack-based layout until it didn't make sense anymore. For this, I turned to `dynamicType.isAccessibilitySize`.

#### Using dynamicType.isAccessibilitySize

We can use SwiftUI's environment to detect the current type size, which comes with a convenient property to check whether it's one of the `AX` sizes. We can use this to only change to the VStack-based layout when the user is using an _AX_ size:

```swift
@Environment(\.dynamicTypeSize) private var dynamicTypeSize

...

Group {
  if dynamicTypeSize.isAccessibilitySize {

    // VStack-based layout
    VStack {
      VStack(alignment: .leading) {
        Text("Welcome to the app!").font(.title)
        Text("Some extra text about onboarding.")
          .font(.headline)
          .foregroundStyle(.secondary)
      }
      Image(systemName: "globe")
        .imageScale(.large)
        .foregroundStyle(.tint)
    }
  }

  else {

    // HStack-based layout
    HStack {
      VStack(alignment: .leading) {
        Text("Welcome to the app!").font(.title)
        Text("Some extra text about onboarding.")
          .font(.headline)
          .foregroundStyle(.secondary)
      }
      Spacer()
      Image(systemName: "globe")
        .imageScale(.large)
        .foregroundStyle(.tint)
    }
  }
}
.padding()
.background(.regularMaterial)
```

This approach isn't necessarily better than using `ViewThatFits`, it's just different. You should choose whichever approach makes the most sense for the screen you're adapting.

#### Going the extra mile

This works well, but we can enhance it a bit more by making the VStack-based layout look a bit more at home. It's nice when the screen works **fine** at large type sizes, but we can go the extra mile by making it look **great**. Let's now tweak the layout to look a bit nicer:

```swift
if dynamicTypeSize.isAccessibilitySize {
  VStack(alignment: .center) {
    Image(systemName: "globe")
      .imageScale(.large)
      .foregroundStyle(.tint)
      Text("Welcome to the app!")
      .font(.title)
      .multilineTextAlignment(.center)
      Text("Some extra text about onboarding.")
        .font(.headline)
        .foregroundStyle(.secondary)
        .multilineTextAlignment(.center)
  }
}
```

Here I've removed a redundant second VStack, centre-aligned everything, and moved the image to the top of the view.

![Before and after screenshots of the view improvements](/assets/post-images/2025/05/hstack-2.png){:class="post-image"}

#### Cleaning it up

There's a lot of duplication in this code because we're defining two completely different layouts. We can clean this up by making a new reusable view that abstracts away much of the logic for, named `HOrVStack`:

```swift
struct HOrVStack<Content: View>: View {
  @Environment(\.dynamicTypeSize) private var dynamicTypeSize
  let content: Content
  let flipAt: DynamicTypeSize
  let horizontalAlignment: HorizontalAlignment
  let verticalAlignment: VerticalAlignment

  init(
    flipAt: DynamicTypeSize = .accessibility1,
    horizontalAlignment: HorizontalAlignment = .center,
    verticalAlignment: VerticalAlignment = .center,
    @ViewBuilder content: () -> Content
  ) {
    self.content = content()
    self.flipAt = flipAt
    self.horizontalAlignment = horizontalAlignment
    self.verticalAlignment = verticalAlignment
  }

  var layout: AnyLayout {
    if dynamicTypeSize < flipAt {
      AnyLayout(HStackLayout(alignment: verticalAlignment))
    } else {
      AnyLayout(VStackLayout(alignment: horizontalAlignment))
    }
  }

  var body: some View {
    layout { content }
  }
}
```

##### Usage

```swift

...

var imageView: some View {
  Image(systemName: "globe")
    .imageScale(.large)
    .foregroundStyle(.tint)
}

var textAlignment: TextAlignment {
  return dynamicTypeSize.isAccessibilitySize ? .center : .leading
}

@ViewBuilder
var hStackView: some View {
  HOrVStack(horizontalAlignment: .center) {
    if dynamicTypeSize.isAccessibilitySize { imageView }
    VStack(alignment: .leading) {
      Text("Welcome to the app!")
        .font(.title)
        .multilineTextAlignment(textAlignment)
      Text("Some extra text about onboarding.")
        .font(.headline)
        .foregroundStyle(.secondary)
        .multilineTextAlignment(textAlignment)
    }
    if !dynamicTypeSize.isAccessibilitySize {
      Spacer()
      imageView
    }
  }
  .padding()
  .background(.regularMaterial)
}
```

Now we have both HStack and VStack-based layouts looking great with a minimal amount of duplication.

I used this pattern extensively to adapt Personal Best, and having a reusable view was a huge time saver.

## Custom approaches

Adapting Personal Best for dynamic type fell solidly into the [80/20 rule](https://en.wikipedia.org/wiki/Pareto_principle): 80% of issues were fixable in 20% of the time by applying the quick fixes detailed above. The remaining 80% of the time was spent fixing the 20% of screens that needed a more custom approach.

For these there's often no 'one size fits all' solution; you need to carefully assess what doesn't look right at large type sizes, then apply fixes on a case-by-case basis. Here are some examples from Personal Best.

### Charts

I had a chart that struggled at larger sizes because of a lack of horizontal space for the text labels. I improved it by changing the chart to use a vertical layout at larger type sizes.

![Before and after screenshots of the chart improvements](/assets/post-images/2025/05/weekday-chart.png){:class="post-image"}

### Tables

My paywall features a comparison of which features are available in the free and paid versions. At larger sizes there simply wasn't enough horizontal space for this to look good, so I switched it to a simpler list of paid features at larger type sizes.

![Before and after screenshots of the paywall improvements](/assets/post-images/2025/05/paywall.png){:class="post-image"}

### Background contrast

The onboarding screen has a graphic at the top of the screen, where various workout types move in concentric circles. At smaller type sizes this looks fine, but when the text is very large the text clashes with the background, making it difficult to read.

To fix this I added a background to the lower part of the screen which is only visible at _AX_ text sizes. It's a simple fix, but it goes a long way to make the screen more readable.

![Before and after screenshots of the onboarding improvements](/assets/post-images/2025/05/onboarding.png){:class="post-image"}

## Takeaways

Here's some tips from my own journey into making Personal Best more accessible.

### 1. Do it from the start

I could have avoided all this work by just making these screens properly support dynamic type from the beginning. It takes about 10% more work to do this from the start, compared to the large effort it took for me to fix the whole app at a later date.

### 2. Keep it simple

If you fill your codebase with `if...else` statements for dynamic type support, you're creating a lot of technical debt and making the codebase less maintainable in the future. Not only will this make work for future you, it'll also increase the likelihood of you making a mistake and inadvertently breaking your app's dynamic type support in the future.

Keep things simple by using reusable views as much as you can (like my `HOrVStack` view), and avoid duplicating your code.

### 3. 'Done' is better than perfect

We all want our apps to be the best they can be, but if you're struggling to make something look absolutely perfect at large type sizes, just settle for making it usable. It'll deliver value immediately for your users who use large type sizes, and you can improve it further at a later date.

## Further reading

If you'd like to learn more about dynamic type, here are some great resources that I found helpful.

- [Apple: Get Started With Dynamic Type (WWDC 2024)](https://developer.apple.com/videos/play/wwdc2024/10074/)
- [Bang Tran: Designing for scalable Dynamic Type in iOS for accessibility](https://uxdesign.cc/designing-for-scalable-dynamic-type-in-ios-5d3e2ae554eb)
- [Deque: Guide to Supporting Dynamic Type](https://docs.deque.com/devtools-mobile/2023.8.16/en/supports-dynamic-type)
