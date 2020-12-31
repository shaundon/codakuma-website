---
layout: page
title: "Using DispatchGroup in Swift for asynchronous loops"
permalink: /dispatch-group/
description: "How to wait for an asynchronous loop to complete before calling a completion handler"
tags: ios swift howto
---

Occasionally in an iOS app you'll do something asynchronous, calling a completion handler when it's done, like this:

```swift
itemProvider.loadObject(ofClass: UIImage.self) { image in 
  onComplete(image)
}
```

This works great, but what if we have an array we need to loop through, performing an asynchronous action for each one? You could try this:

```swift
var images = [UIImage]()
for itemProvider in itemProviders {
  itemProvider.loadObject(ofClass: UIImage.self) { image in 
    images.append(image)
  }
}
onComplete(images)
```

..but that won't work, because the `onComplete` handler will fire before the asynchronous blocks execute.

For situations like this, we can use Swift's [`DispatchGroup`](https://developer.apple.com/documentation/dispatch/dispatchgroup).

We create a `DispatchGroup` before starting the loop, enter it each time the loop iterates, and leave it when each iteration ends. Finally, we notify the dispatch group that everything is complete. Let's see how that looks in practice:

```swift
let dispatchGroup = DispatchGroup()
var images = [UIImage]()
for itemProvider in itemProviders {
  dispatchGroup.enter()
  itemProvider.loadObject(ofClass: UIImage.self) { image in 
    images.append(image)
    dispatchGroup.leave()
  }
}

dispatchGroup.notify(queue: .main) {
  onComplete(images)
}
```

Now, everything works as it should and the completion handler isn't executed until after the loop has finished iterating.

