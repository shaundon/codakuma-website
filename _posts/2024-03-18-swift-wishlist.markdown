---
layout: blog
title: "My wishlist for Apple's developer tools"
permalink: /swiftui-wishlist-2024/
description: "Some quality-of-life improvements that I'd love"
tags: ios
---

I started building for Apple platforms in 2020 when SwiftUI was on the bleeding edge and lacked a lot of features. Since then it's been great seeing it improve every year to be able to do more and more.

That said, things can always improve. Here are the things I'd love to see come to Apple's developer tooling in the future.

## Built-in localisation

[SF Symbols](https://developer.apple.com/sf-symbols/) has been a relevation. A suite of thousands of free-to-use, customisable icons is an enormous time saver for almost every developer. I really like Apple's approach here of "taking a thing that every developer needs to do and removing some of that burden".

[TipKit](https://developer.apple.com/documentation/TipKit) is in a similar vein. Presumably, Apple noticed a lot of developers building things like this themselves and decided to offer a first-party solution.

Following that approach, I'd love to see an API for getting localised strings for common words and phrases, so that developers don't need to translate them. They wouldn't be able to cover all (or even most) strings, but if they covered common words and phrases that appear in most apps like _"Done"_, _"Cancel"_, _"Edit"_, and so on, it could go quite a long way.

Here's a crude code sample of how it could look:

```swift
HStack {
  Button(action: {}) {
    Text("Cancel", language: .deviceCurrent)
  }
  Spacer()
  Button(action: {}) {
    Text("Done", language: .deviceCurrent)
  }
}
```

Depending on the user's locale, this could have different results:

![Examples of how it would look in different languages](/assets/post-images/locale-string-examples.png){:class="post-image"}

It could fail gracefully too. Just like when you try to use an SF Symbol that doesn't exist, if you try to use localised text for a string that isn't supported, nothing happens.

Apple's already done the hard work of localising all these strings in iOS itself, so this would 'just' be a matter of exposing them to developers with a new API.

## An iCloud-backed UserDefaults

`UserDefaults` is a great way to store simple data for your app, like user preferences. However, the data is only stored locally and doesn't sync across devices.

Apple has a solution for this: [iCloud key-value storage](https://developer.apple.com/library/archive/documentation/General/Conceptual/iCloudDesignGuide/Chapters/DesigningForKey-ValueDataIniCloud.html). It allows us to sync simple data across devices in a way that's transparent to the user. No logins or sync buttons, as long as they're signed into iCloud it _Just Works&#8482;_.

The downside is that we need to manage the syncing ourselves. Recently when developing [SalaryPig](/pig) I wanted to implement this and found it decidedly non-trivial. I eventually figured it out using [Zephyr](https://github.com/ArtSabintsev/Zephyr), but this feels like another thing that most app developers will need to tackle if they support multiple devices.

To improve this, Apple could offer convenience APIs to automatically handle this. SwiftUI already has a property wrapper to make any state variable be backed by `UserDefaults`:

```swift
@AppStorage("Foo") private var foo = 1
```

It'd be great to have a version of this backed by iCloud key-value storage. It might look like this:

```swift
@AppStorage("Foo", synchronized: true) private var foo = 1
```

On the Swift side without the property wrapper, it could look like this:

```swift
UserDefaults.standard.set(1, forKey: "Foo", synchronized: true)
```

## Shared UserDefaults between iOS and watchOS

Another improvement to `UserDefaults` would be to allow them to sync to watchOS easily. I ran into this issue when developing SalaryPig for watchOS, where I expected that values stored there would be available via an [App Group](https://developer.apple.com/documentation/xcode/configuring-app-groups), just as they are for widgets and other iOS extensions.

I did some digging and it seems that in watchOS v1 it did work this way as watch apps were extensions of iPhone apps, but when watchOS apps became fully-fledged apps `UserDefaults` was no longer shared between them.

There are plenty of ways around this but all of them require [some manual work](https://forums.developer.apple.com/forums/thread/710966?answerId=722189022#722189022). Some sort of opt-in automatic syncing between iPhone and watchOS would be really handy.

## Backwards compatibility

Or is it forwards compatibility? I'm not sure. Either way, it'd be great if SwiftUI was less linked to the current OS version. SwiftUI improves hugely every year, but many developers can't use the latest improvements for 1-2 years, depending on the minimum OS version they support.

On the other hand, [Jetpack Compose](https://developer.android.com/jetpack/compose) (which is essentially the Android equivalent of SwiftUI) supports versions of Android going back a lot further.

I know very little about how SwiftUI works 'under the hood', but if it's possible to decouple the OS to the runtime it'd be useful for thousands of developers.

## Easier 3D support

Recently I ported SalaryPig to visionOS. I really wanted to make Trevor (the animated piggy bank) 3D, but I found the learning curve of making 3D graphics too steep for a complete novice like me. I might come back to it later, but for now the best solution for me was just to keep Trevor in 2D like on other platforms.

I think there's an opportunity here for Apple to offer something that can help people build 3D assets easily. I'm thinking of something like SwiftUI's robust [shapes and paths](https://developer.apple.com/tutorials/swiftui/drawing-paths-and-shapes), extended to also support 3D shapes.

## Better date picker

SwiftUI's [date picker](https://developer.apple.com/documentation/swiftui/datepicker) is really good, and I'd like to see it extended to support a wider range of uses, like selecting a range, and showing multiple months at once. It's another thing that many apps need to build custom, and first-party support would be really convenient.

## Web views

Lastly, I'd like the ability to open a `WKWebView` from a SwiftUI view. Currently it's trivial to open something in Safari using a `Link`, but for some links it'd be a nicer experience to have it open within the same app. It could look like this:

```swift
let appleUrl = URL(string: "https://apple.com")!

// Current behaviour; opens in Safari:
Link("Visit Apple", destination: appleUrl)

// Proposed modifier for opening in a WKWebView:
Link("Visit Apple", destination: appleUrl)
  .linkHandler(.inAppBrowser)

// Using it on a link inside Markdown text:
Text("Visit [apple.com](https://apple.com) to learn more")
  .linkHandler(.inAppBrowser)
```

## Finally

That's all I have on my mind for now. I love seeing how Apple's developer platforms evolve each year, and I'm excited to see what's in store for WWDC 2024.
