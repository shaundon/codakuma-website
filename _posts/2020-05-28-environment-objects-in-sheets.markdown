---
layout: page
title: "SwiftUI sheets and environment objects"
permalink: /swiftui-sheet-environment-objects/
description: "Sheets in SwiftUI don't have access to @EnvironmentObject without a workaround."
tags: ios swiftui howto
---

`@EnvironmentObject` is handy for passing data between views in SwiftUI. [Hacking With Swift has an excellent guide](https://www.hackingwithswift.com/quick-start/swiftui/how-to-use-environmentobject-to-share-data-between-views) on how to use it, but when I followed it, one some of my views it just wasn't working correctly.

The good news is the answer is really simple. The bad news is it took me about five hours of thinking I'd set up my Core Data models wrong to figure this out.

Sheets in SwiftUI don't automatically inherit `@EnvironmentObject`. To work around this, just set the environment object manually when creating your sheet:

```swift
// SceneDelegate.swift
let someObject = SomeObject()
let contentView = ContentView().environmentObject(someObject)


// MyView.swift
struct MyView: View {
  @EnvironmentObject var someObject: SomeObject
  @State private var sheetIsPresented = false

  var body: some View {
    Button("Open sheet") { 
      self.sheetIsPresented = true 
    }.sheet(isPresented: $sheetIsPresented) {
      AnotherView().environmentObject(self.someObject)
    }
  }
}
```

Views inside your sheet will inherit the environment object fine, it's just sheets that won't. Think of sheets as parallel to your main scene with an entirely new view hierarchy.

