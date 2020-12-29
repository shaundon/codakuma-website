---
layout: page
title: "Static maps in SwiftUI with MKMapSnapshotter"
permalink: /swiftui-static-maps/
description: "How to use MKMapSnapshotter in SwiftUI views to create static maps"
tags: ios swiftui howto mapkit
---

Since iOS 14, SwiftUI has included [components for adding maps to your apps](https://swiftwithmajid.com/2020/07/29/using-mapkit-with-swiftui/).

However, one thing that isn't yet bridged to SwiftUI from UIKit is `MKMapSnaphotter`, a class for creating static, pre-rendered maps. It's useful for rendering non-interactive maps, like as a background image.

This article will show you how to create your own simple view for rendering `MKMapSnapshotter` instances in a SwiftUI app. It's based on Arvindh Sukumar's [excellent tutorial on dispatchswift.com](https://dispatchswift.com/render-a-map-as-an-image-using-mapkit-3102a5a3fa5), which I've adapted to work as a SwiftUI view.

## Basic view

To begin, let's just make a basic view. It'll take two parameters: `location` and `span`. `span` can be optional, with a default value. It'll also have an optional state variable to represent the image that `MKMapSnapshotter` produces, and we'll eventually render. 

```swift
import SwiftUI
import MapKit

struct MapSnapshotView: View {
  let location: CLLocationCoordinate2D
  var span: CLLocationDegrees = 0.01

  @State private var snapshotImage: UIImage? = nil

  var body: some View {
    Group {
      if let image = snapshotImage {
        Image(uiImage: image)
      } else {
        ProgressView()
        .progressViewStyle(CircularProgressViewStyle())
        .background(Color(UIColor.secondarySystemBackground))
      }
    }
  }
}

// Usage
let coordinates = CLLocationCoordinate2D(latitude: 37.332077, longitude: -122.02962) // Apple Park, California
MapSnapshotView(location: coordinates)
```

At this point, we just see a loading indicator because we haven't done anything to set the image. Let's integrate the `MKMapSnapshotter`:

## Add the snapshot

Add a function to generate the snapshot:

```swift
func generateSnapshot(width: CGFloat, height: CGFloat) {

  // The region the map should display.
  let region = MKCoordinateRegion(
    center: self.location, 
    span: MKCoordinateSpan(
      latitudeDelta: self.span, 
      longitudeDelta: self.span
    )
  )

  // Map options.
  let mapOptions = MKMapSnapshotter.Options()
  mapOptions.region = region
  mapOptions.size = CGSize(width: width, height: height)
  mapSnapshotOptions.showsBuildings = true

  // Create the snapshotter and run it.
  let snapshotter = MKMapSnapshotter(options: mapOptions)
  snapshotter.start { (snapshotOrNil, errorOrNil) in
    if let error = errorOrNil {
      print(error)
      return
    }
    if let snapshot = snapshotOrNil {
      self.snapshotImage = snapshot.image
    }
  }
}
```

Then, call the function by adding on `onAppear` block to the view's body. Because `MKMapSnapshotter.start` is asynchronous, we have to first render the loading indicator, then the map. As far as I'm aware, it's not possible to create the view with the snapshot already loaded.

```swift
var body: some View {
  Group {
    if let image = snapshotImage {
      Image(uiImage: image)
    } else {
      ProgressView()
      .progressViewStyle(CircularProgressViewStyle())
      .background(Color(UIColor.secondarySystemBackground))
    }
  }
  .onAppear {
    generateSnapshot(width: 300, height: 300)
  }
}
```

Render the view now, and your map will appear.

You've probably noticed that the snapshot **always** renders at 300x300 no matter how large the view is. To fix this, we'll need a way to tell the snapshotter how large the view it's contained within is.

## Set the width and height dynamically

Change the view's body to use a `GeometryReader`:

```swift
var body: some View {
  GeometryReader { geometry in
    Group {
      if let image = snapshotImage {
        Image(uiImage: image)
      } else {
        ProgressView()
        .progressViewStyle(CircularProgressViewStyle())
        .background(Color(UIColor.secondarySystemBackground))
      }
    }
    .onAppear {
      generateSnapshot(width: geometry.size.width, height: geometry.size.height)
    }
  }
}
```

Now, the map takes its size from its container, just as a regular MapKit view would. There's one final problem, which is that our loading indicator which was previously centered is now stuck in the top left of the view. This is due to `GeometryView`'s [unfortunate behaviour of breaking some views](https://swiftwithmajid.com/2020/11/04/how-to-use-geometryreader-without-breaking-swiftui-layout/).

In this case, it's easily fixed by wrapping the loading indicator in a `VStack` and `HStack`, to make it fill all available space, with the loading indicator in the centre.

## Fixing the loading indicator

```swift
...
if let image = snapshotImage {
  Image(uiImage: image)
} else {
  VStack {
    Spacer()
    HStack {
      Spacer()
      ProgressView().progressViewStyle(CircularProgressViewStyle())
      Spacer()
    }
    Spacer()
  }
  .background(Color(UIColor.secondarySystemBackground))
}
...
```

## Next steps

This view is very simple and doesn't include many customisation options. To extend it, you could make use of `MKMapSnapshotter`'s other options, like choosing the type of map (satellite, flyover, and so on), which points of interest to display, annotations, and more.
