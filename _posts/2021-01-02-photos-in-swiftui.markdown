---
layout: blog
title: "Accessing the photo library in SwiftUI"
permalink: /the-library-is-open/
description: "How to access the photo library in SwiftUI using PHPicker"
tags: ios swift howto
---

SwiftUI doesn't yet have an easy way to access the camera or photo library. [hackingwithswift.com already has a great tutorial](https://www.hackingwithswift.com/example-code/uikit/how-to-take-a-photo-using-the-camera-and-uiimagepickercontroller) on how to access the camera from SwiftUI.

This article will cover how to access the user's photo library using [`PHPicker`](https://developer.apple.com/videos/play/wwdc2020/10652/), a new privacy-first API introduced in iOS 14 which may eventually replace `UIImagePickerController`. We'll build a simple SwiftUI app that accesses the user's photo library and displays the selected photo on screen.

[View the code for this tutorial on GitHub](https://gist.github.com/shaundon/56c8a5801c5dc63c2e4a0af9b39c8f7b)

## Building the bridge

As with all UIKit views accessed in SwiftUI, we must start by building a bridge. I've added comments inline with the code to explain what's happening at each stage.

```swift
import SwiftUI
import PhotosUI

struct PhotoPicker: UIViewControllerRepresentable {
    typealias UIViewControllerType = PHPickerViewController

    // Can be .images, .livePhotos or .videos
    let filter: PHPickerFilter

    // How many photos can be selected. 0 means no limit.
    var limit: Int = 0

    func makeUIViewController(context: Context) -> PHPickerViewController {

        // Create the picker configuration using the properties passed in above.
        var configuration = PHPickerConfiguration()
        configuration.filter = filter
        configuration.selectionLimit = limit

        // Create the view controller.
        let controller = PHPickerViewController(configuration: configuration)

        // Link it to the Coordinator created below.
        controller.delegate = context.coordinator
        return controller
    }

    // This method is blank because it will never be updated.
    func updateUIViewController(_ uiViewController: PHPickerViewController, context: Context) {}

    func makeCoordinator() -> Coordinator {
        return Coordinator(self)
    }

    class Coordinator: PHPickerViewControllerDelegate {

        // The coordinator needs a reference to the thing it's linked to.
        private let parent: PhotoPicker

        init(_ parent: PhotoPicker) {
            self.parent = parent
        }

        // Called when the user finishes picking a photo.
        func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {

            // Dismiss the picker.
            picker.dismiss(animated: true)
        }
    }
}
```

## Calling the bridge

From our regular SwiftUI view code, we now need to call the code we just wrote.

```swift
import SwiftUI

struct ContentView: View {
    @State private var showPhotoPicker = false
    @State private var selectedImage: UIImage? = nil

    var body: some View {
        VStack {
            Button(action: { showPhotoPicker = true }) {
                Label("Choose photo", systemImage: "photo.fill")
            }
            .fullScreenCover(isPresented: $showPhotoPicker) {
                // Create the picker. We only want to allow the user to select a single image.
                // We ignore the safe area so that the picker takes up the entire screen when open.
                PhotoPicker(filter: .images, limit: 1)
                    .edgesIgnoringSafeArea(.all)
            }

            // Display the image if one has been selected.
            if let image = selectedImage {
                Image(uiImage: image)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(maxWidth: 200, maxHeight: 200)
            }
        }
    }
}
```

Run the code. You should notice two things:

1. You didn't have to get permission to access the photo library. The beauty of `PHPicker` is that it works outside of the usual permission system. It runs separately from our app and only grants access to the photos the user explicitly chooses to grant access to.
1. When you select a photo, the picker closes but nothing else happens. This is because we haven't hooked it up properly yet. Let's do that now.

## Adding event handling

Go back to the bridge we built earlier. We're going to add a new member to `PhotoPicker`, a function that will be called when the user selects a photo.

```swift
struct PhotoPicker: UIViewControllerRepresentable {
    typealias UIViewControllerType = PHPickerViewController

    let filter: PHPickerFilter
    var limit: Int = 0
    let onComplete: ([PHPickerResult]) -> Void

...
```

Then, in the `Coordinator` class, add this line to the `picker(_, didFinishPicking)` function:

```swift
// Call the completion handler.
parent.onComplete(results)
```

## Convert the results to images

You'll notice that the picker returns its results as `[PHPickerResult]`, not `[UIImage]`. Therefore, we must first convert the results to images before we can use them.

There are two approaches to doing this:

1. Convert the results automatically inside `PhotoPicker` before the `onComplete` function is called.
2. Add a function to convert `[PHPickerResult]` to `[UIImage]` that can be called from the view.

In this article I'm following option 2 because I prefer to follow a [composition over configuration](https://johno.com/composition-over-configuration/) approach in my code. This approach also leaves room for adding more functions in the future, for example one to return videos instead of images if the picker is being used to select videos.

Add a new function to `PhotoPicker`:

```swift
static func convertToUIImageArray(fromResults results: [PHPickerResult], onComplete: @escaping ([UIImage]?, Error?) -> Void) {
    // Will be used to store the images that get created from results.
    var images = [UIImage]()

    let dispatchGroup = DispatchGroup()
    for result in results {
        dispatchGroup.enter()
        let itemProvider = result.itemProvider
        if itemProvider.canLoadObject(ofClass: UIImage.self) {
            itemProvider.loadObject(ofClass: UIImage.self) { (imageOrNil, errorOrNil) in
                if let error = errorOrNil {
                    onComplete(nil, error)
                }
                if let image = imageOrNil as? UIImage {
                    images.append(image)
                }
                dispatchGroup.leave()
            }
        }
    }
    dispatchGroup.notify(queue: .main) {
        onComplete(images, nil)
    }
}
```

Then in our SwiftUI view, add the `onComplete` handler to where we call `PhotoPicker`, along with a call to the converter function we just wrote:

```swift
...
.fullScreenCover(isPresented: $showPhotoPicker) {
    PhotoPicker(filter: .images, limit: 1) { results in
        PhotoPicker.convertToUIImageArray(fromResults: results) { imagesOrNil, errorOrNil in
            if let error = errorOrNil {
                print(error)
            }
            if let images = imagesOrNil {
                if let first = images.first {

                    // Update our state with the image.
                    selectedImage = first
                }
            }
        }
    }
    .edgesIgnoringSafeArea(.all)
}
```

Run the code again and it'll now work. When you select an image, it's passed to our view, converted to a `UIImage` and then displayed on screen.

<video class="post-image-small" autoplay loop>
  <source src="/assets/post-images/image-library-picker.mp4">
</video>

_The yellow UI elements are a bug in this version of the iOS simulator._

## Conclusion

Today we learned how to bridge `PHPicker` from UIKit to SwiftUI. If you have any questions or comments, feel free to reach out via Twitter or email. Links to both are in the footer of this page.

[View the code for this tutorial on GitHub](https://gist.github.com/shaundon/56c8a5801c5dc63c2e4a0af9b39c8f7b)
