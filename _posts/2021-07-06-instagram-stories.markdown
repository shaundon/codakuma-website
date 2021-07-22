---
layout: page
title: "Sharing to Instagram Stories in SwiftUI"
permalink: /instagram-stories-sharing-swiftui/
description: "How to share images directly to Instagram Stories in SwiftUI"
tags: ios swift howto
---

Recently I added the ability to share directly with Instagram Stories to my workout-tracking app [Personal Best](/personal-best). Here's how to do it. This tutorial is tailored to SwiftUI, but the code is generic enough that it could easily be applied to a UIKit app.

Instagram offers an API based on [URL schemes](https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app), which is brilliant as it means we don't need to add an SDK to do this.

A full API reference can be found over on [Facebook's developer site](https://developers.facebook.com/docs/instagram/sharing-to-stories/).

[View the code for this tutorial on GitHub](https://gist.github.com/shaundon/28d121931eab29d4feb1f61b21b60e28)

## Set things up

First of all, you need to give your app the ability to query for Instagram Stories' custom URL scheme, which is `instagram-stories://`. Add this to your app's `Info.plist`:

```xml
<key>LSApplicationQueriesSchemes</key>
<array>
	<string>instagram-stories</string>
</array>
```

`LSApplicationQueriesSchemes` is part of iOS's _Launch Services_ framework. [The documentation](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html) is quite unambiguous on what this key is used for:

> _"LSApplicationQueriesSchemes (Array - iOS) Specifies the URL schemes you want the app to be able to use with the canOpenURL: method of the UIApplication class"_

## Create a utility

Now, we need some actual code to be able to share to Instagram. To ensure a good user experience, we should provide a way to check that Instagram is installed on the user's device too, ensuring that the share button is only displayed to people who can use it.

Create a struct as below. The comments inside explain what's happening at each stage:

```swift
import Foundation
import SwiftUI // You can import UIKit instead if you like, both will work.

struct InstagramSharingUtils {

  // Returns a URL if Instagram Stories can be opened, otherwise returns nil.
  private static var instagramStoriesUrl: URL? {
    if let url = URL(string: "instagram-stories://share?source_application=your-app-bundle-identifier") {
      if UIApplication.shared.canOpenURL(url) {
        return url
      }
    }
    return nil
  }

  // Convenience wrapper to return a boolean for `instagramStoriesUrl`
  static var canOpenInstagramStories: Bool {
    return instagramStoriesUrl != nil
  }

  // If Instagram Stories is available, writes the image to the pasteboard and
  // then opens Instagram.
  static func shareToInstagramStories(_ image: UIImage) {

    // Check that Instagram Stories is available.
    guard let instagramStoriesUrl = instagramStoriesUrl else {
      return
    }

    // Convert the image to data that can be written to the pasteboard.
    let imageDataOrNil = UIImage.pngData(image)
    guard let imageData = imageDataOrNil() else {
      print("🙈 Image data not available.")
      return
    }
    let pasteboardItem = ["com.instagram.sharedSticker.backgroundImage": imageData]
    let pasteboardOptions = [UIPasteboard.OptionsKey.expirationDate: Date().addingTimeInterval(60 * 5)]

    // Add the image to the pasteboard. Instagram will read the image from the pasteboard when it's opened.
    UIPasteboard.general.setItems([pasteboardItem], options: pasteboardOptions)

    // Open Instagram.
    UIApplication.shared.open(instagramStoriesUrl, options: [:], completionHandler: nil)
  }
}
```

## The UI part

Now that we have the code to send a story to Instagram, we simply need to hook it up to our user interface. This is quite straightforward:

```swift
import SwiftUI

struct InstagramShareView: View {

  var imageToShare: Image {
    // An image defined in your app's asset catalogue.
    return Image("SomeImage")
  }

  var body: some View {
    VStack {

      // Display the image that will be shared to Instagram.
      imageToShare

      if InstagramSharingUtils.canOpenInstagramStories {
        Button(action: { 
          InstagramSharingUtils.shareToInstagramStories(imageToShare.uiImage) 
        }) {
          Text("Share to Instagram Stories")
        }
      } else {
        Text("Instagram is not available.")
      }
    }
  }
}
```

## Next steps

Instagram's URL scheme allows for sharing much more, including stickers, colours, videos, and more. Check out [Facebook's developer site](https://developers.facebook.com/docs/instagram/sharing-to-stories/) for more.

[View the code for this tutorial on GitHub](https://gist.github.com/shaundon/28d121931eab29d4feb1f61b21b60e28)

## A more fully-featured off-the-shelf version

[Swapnanil Dhol](https://github.com/SwapnanilDhol) has an excellent Swift package named [IGStoryKit](https://github.com/SwapnanilDhol/IGStoryKit) that can do all of this and more, if you're looking for something simple where you don't need to write all the code to integrate with Instagram yourself.
