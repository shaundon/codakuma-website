---
layout: page
title: "Making your own errors in Swift"
permalink: /custom-swift-errors/
description: "How to create your own instances of Error"
tags: ios swift howto
---

Swift's [`Error` protocol](https://developer.apple.com/documentation/swift/error) is commonly used across Apple's APIs to represent failure states.

Typically, it's used like this:
```swift
HKHealthStore().disableAllBackgroundDelivery { (success, errorOrNil) in
  if let error = errorOrNil {
    print(error.localizedDescription)
  }
}
```
_Example of an `Error` that can be returned from a HealthKit method._

Recently I wanted to create my own instance of `Error`, like this:
```swift
func doSomethingAsync(onComplete: @escaping (Bool, Error?) -> Void) {
  let result = SomeClass.methodThatMightCauseError()
  if result {
      onComplete(true, nil)
  } else {
      onComplete(false, Error("Failed to do the thing"))
  }
}
```

Because `Error` is a protocol, it cannot be constructed directly and the above code won't work. To fix it, we need to make a simple struct that implements the protocol, like this:

```swift
struct AppError {
  let message: String

  init(_ message: String) {
    self.message = message
  }
}

extension AppError: LocalizedError {
  var errorDescription: String? { return message }
}
```

Now, the code from earlier can be changed to make an instance of `AppError`:

```swift
onComplete(false, AppError("Failed to do the thing"))
```
_Credit to [Reimond Hill on StackOverflow](https://stackoverflow.com/a/62770968/1011161) for pointing me in the right direction here._

And that's it. This is pretty much the simplest implementation of `Error` you could make. It'll work fine for trivial uses, but you may wish to implement more of the procotol for more robust error handling, for example be adding recovery suggestions, help anchors and error codes. Those are out of scope for this post, but [Apple's own documentation](https://developer.apple.com/documentation/swift/error) is a good place to go from if you'd like to learn more.