---
layout: blog
title: "Adding polylines to maps in SwiftUI"
permalink: /the-line-is-a-dot-to-you/
description: "Using UIKit to display lines on maps in SwiftUI"
tags: ios swift howto
---

As of March 2021, SwiftUI has a built-in map view but it's quite simple, only supporting basic annotations.

Recently [I wrote about making use of this map view]({% link _posts/2020-08-22-adventures-in-swiftui-maps.markdown %}) for my app [Personal Best]({% link personal-best.markdown %}), where I settled on using dots to represent GPS pings as polylines weren't available.

At the time this felt like a reasonable compromise, but since then I've gotten a lot better at SwiftUI and interfacing with UIKit in particular, so I've been exploring how to bridge a map view featuring a polyline to SwiftUI.

This simple tutorial will teach you how to make a map view component in SwiftUI that includes a polyline.

It's based on [hackingswithswift.com's 'Advanced MKMapView with SwiftUI' tutorial](https://www.hackingwithswift.com/books/ios-swiftui/advanced-mkmapview-with-swiftui), which I combined with [a StackOverflow answer from Daniel E. Salinas](https://stackoverflow.com/a/63744127/1011161).

[View the code for this tutorial on GitHub](https://gist.github.com/shaundon/00be84deb3450e31db90a31d5d5b7adc)

## Building the basic map view

Add the following code, which will make a basic map that doesn't include the polyline yet.

### `MapView.swift`

```swift
import SwiftUI
import MapKit

struct MapView: UIViewRepresentable {

  let region: MKCoordinateRegion
  let lineCoordinates: [CLLocation]

  // Create the MKMapView using UIKit.
  func makeUIView(context: Context) -> MKMapView {
    let mapView = MKMapView()
    mapView.delegate = context.coordinator
    mapView.region = region
    return mapView
  }

  // We don't need to worry about this as the view will never be updated.
  func updateUIView(_ view: MKMapView, context: Context) {}

  // Link it to the coordinator which is defined below.
  func makeCoordinator() -> Coordinator {
    Coordinator(self)
  }

}

class Coordinator: NSObject, MKMapViewDelegate {
  var parent: MapView

  init(_ parent: MapView) {
    self.parent = parent
  }
}
```

### `ContentView.swift`

```swift
import SwiftUI

struct ContentView: View {
  @State private var region = MKCoordinateRegion(
    // Apple Park
    center: CLLocationCoordinate2D(latitude: 37.334803, longitude: -122.008965),
    span: MKCoordinateSpan(latitudeDelta: 0.01, longitudeDelta: 0.01)
  )

  var body: some View {
    MapView(region: region)
      .edgesIgnoringSafeArea(.all)
  }
}
```

At this point, running our code locally just shows a basic map, centered on the region we specified in `ContentView.swift`.

![Basic MapView](/assets/post-images/empty-map.png){:class="post-image-small"}

## Adding a polyline

Add a new `lineCoordinates` property to `MapView`. It'll accept an array of location coordinates, which will be used to draw the line.

```swift
let lineCoordinates: [CLLocationCoordinate2D]
```

Now add some code to `makeUIView` to draw the polyline based on the coordinates:

```swift
let polyline = MKPolyline(coordinates: lineCoordinates, count: lineCoordinates.count)
mapView.addOverlay(polyline)
```

Finally, add a new function to `Coordinator` which will define how the polyline is rendered.

```swift
func mapView(_ mapView: MKMapView, rendererFor overlay: MKOverlay) -> MKOverlayRenderer {
  if let routePolyline = overlay as? MKPolyline {
    let renderer = MKPolylineRenderer(polyline: routePolyline)
    renderer.strokeColor = UIColor.systemBlue
    renderer.lineWidth = 5
    return renderer
  }
  return MKOverlayRenderer()
}
```

Now, update `ContentView` to provide `lineCoordinates`:

```swift
struct ContentView: View {
  @State private var region = MKCoordinateRegion(
    // Apple Park
    center: CLLocationCoordinate2D(latitude: 37.334803, longitude: -122.008965),
    span: MKCoordinateSpan(latitudeDelta: 0.01, longitudeDelta: 0.01)
  )

  @State private var lineCoordinates = [
    // Steve Jobs theatre
    CLLocationCoordinate2D(latitude: 37.330828, longitude: -122.007495),
    // Caffè Macs
    CLLocationCoordinate2D(latitude: 37.336083, longitude: -122.007356),
    // Apple wellness center
    CLLocationCoordinate2D(latitude: 37.336901, longitude:  -122.012345)
  ];

  var body: some View {
    MapView(region: region, lineCoordinates: lineCoordinates)
      .edgesIgnoringSafeArea(.all)
  }
}
```

Run the code and now the line is visible.

![MapView with polyline](/assets/post-images/map-with-polyline.png){:class="post-image-small"}

## Conclusion and next steps

Today we learned how to bridge `MKMapView` from UIKit to SwiftUI and add a polyline to it. This is the most basic implementation possible, but there are lots of ways this could be improved, for example adding customisation of the polyline, making it optional, adding the ability to add other types of annotation, and so on.

If you have any questions or comments, feel free to reach out via Twitter or email. Links to both are in the footer of this page.

[View the code for this tutorial on GitHub](https://gist.github.com/shaundon/00be84deb3450e31db90a31d5d5b7adc)
