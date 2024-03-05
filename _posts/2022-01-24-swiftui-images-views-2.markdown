---
layout: blog
title: "A better way to create images from SwiftUI views"
permalink: /swiftui-view-to-image-2/
description: "A much easier way to turn SwiftUI views into images"
tags: ios
---

In late 2020 I [wrote a guide about turning SwiftUI views into images]({% link _posts/2020-12-23-capture-screenshot-in-swiftui.markdown %}). This solution worked but it came with some limitations:

- It worked by capturing a screenshot of the entire screen and then cropping it to one area. This meant it didn't easily support things like rounded corners and shadows without further work to manipulate the generated image.
- Because it relied on a screenshot, the generated image was linked to the pixel density of the device it ran on. 2x devices would get a 2x-scale image, 3x devices would get a 3x-scale image, and so on.
- The image you were creating had to be on screen.
- You needed to pair it with a `GeometryReader` in order to get the coordinates of where the view was on screen.

In my workout-tracking app [Personal Best](https://getpersonalbest.com) this is used for sharing workouts, where you can turn any workout into an image to share on social media or save to your photo library.

Recently I was adding a similar feature to a new app I'm working on and I decided to revisit it to see if there's a better way to do it.

Thankfully, since my stumbling about in the dark, [Paul Hudson](https://twitter.com/twostraws) of [Hacking With Swift](https://hackingwithswift.com) has published a much-simpler solution:

[How to convert a SwiftUI view to an image on Hacking With Swift &raquo;](https://www.hackingwithswift.com/quick-start/swiftui/how-to-convert-a-swiftui-view-to-an-image)

Here's the code from Paul's article (I've amended it slightly to not save the image):

```swift
extension View {
    func snapshot() -> UIImage {
        let controller = UIHostingController(rootView: self)
        let view = controller.view

        let targetSize = controller.view.intrinsicContentSize
        view?.bounds = CGRect(origin: .zero, size: targetSize)
        view?.backgroundColor = .clear

        let renderer = UIGraphicsImageRenderer(size: targetSize)

        return renderer.image { _ in
            view?.drawHierarchy(in: controller.view.bounds, afterScreenUpdates: true)
        }
    }
}

// Usage
struct ContentView: View {
    var textView: some View {
        Text("Hello, SwiftUI")
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .clipShape(Capsule())
    }

    var body: some View {
        VStack {
            textView

            Button("Save to image") {
                let image = textView.snapshot()

                // Do what you want with the image now.
                print(image)
            }
        }
    }
}
```

I tried this, but unfortunately it didn't quite work for me. All the images it produced were slightly offset, with a transparent area at the top of the image and the bottom of the image cut off. It was like the viewport was roughly 20 points higher than it should be.

I banged my head against this for hours, trying all sorts of tweaks. Eventually I found [the answer on StackOverflow](https://stackoverflow.com/a/69819567/1011161). Long story short, this seems to be a bug in iOS 15, and the fix is to make the view you're capturing ignore the safe area.

Here's my final, tweaked View extension that works correctly on iOS 15:

```swift
// Extension
extension View {
    var asImage: UIImage {
        // Must ignore safe area due to a bug in iOS 15+ https://stackoverflow.com/a/69819567/1011161
        let controller = UIHostingController(rootView: self.edgesIgnoringSafeArea(.top))
        let view = controller.view
        let targetSize = controller.view.intrinsicContentSize
        view?.bounds = CGRect(origin: CGPoint(x: 0, y: 0), size: targetSize)
        view?.backgroundColor = .clear

        let format = UIGraphicsImageRendererFormat()
        format.scale = 3 // Ensures 3x-scale images. You can customise this however you like.
        let renderer = UIGraphicsImageRenderer(size: targetSize, format: format)
        return renderer.image { _ in
            view?.drawHierarchy(in: controller.view.bounds, afterScreenUpdates: true)
        }
    }
}

// Usage
struct ContentView: View {
    var textView: some View {
        Text("Hello, SwiftUI")
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .clipShape(Capsule())
    }

    var body: some View {
        VStack {
            textView

            Button("Save to image") {
                let image = textView.asImage

                // Do what you want with the image now.
                print(image)
            }
        }
    }
}
```
