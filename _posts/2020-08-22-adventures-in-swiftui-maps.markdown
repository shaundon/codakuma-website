---
layout: page
title: "Adventures in SwiftUI 2's MapKit support"
permalink: /swiftui-mapkit-fun/
description: "Finding and working around the limitations of MapKit in SwiftUI 2."
tags: ios swiftui howto ios14
---

SwiftUI 2 comes with a [Map component](https://developer.apple.com/documentation/mapkit/map), for displaying views from Apple Maps in your apps.

I wanted to use it to add maps to the workout details page of my app [Personal Best]({% link personal-best.markdown %}). Getting a basic map display up and running was really easy. The Map component has a simple API that's easy to use:

```swift
Map(
  coordinateRegion: .constant(
    MKCoordinateRegion(
      center: CLLocationCoordinate2D(latitude: 35.685, longitude: 139.685),
      span: MKCoordinateSpan(latitudeDelta: 0.1, longitudeDelta: 0.1)
    )
  )
)
```

![Map of Budapest](/assets/post-images/map-1.jpeg){:class="post-image-small"}

## Annotating it

The tricky part came next. I wanted to add a line to the map to display the workout route. This is how iOS's Fitness (formerly known as Activity) app displays routes:

![Map of Budapest from Apple's Fitness app displaying a workout route](/assets/post-images/fitness-app-route.jpeg){:class="post-image-small"}

From what I understand, this isn't yet possible with SwiftUI's Map component. Maps can be annotated, but only in three ways:

- [MapPin](https://developer.apple.com/documentation/mapkit/mappin)
- [MapMarker](https://developer.apple.com/documentation/mapkit/mapmarker)
- [MapAnnotation](https://developer.apple.com/documentation/mapkit/mapannotation)

The only customisation supported by `MapPin` and `MapMarker` is the tint colour, but `MapAnnotation` is a generic view that can contain anything.

I think idea is that you'll use these annotations to denote points of interest on a map — for example, dropping pins to display search results. In my case, I wanted to draw a continuous line, which doesn't really fit into any of the available annotation types.

One way to do this within the constaints of the API might be to draw a single `MapAnnotation` which is a complex polygon to represent the route. This might be possible, but it sounded very complex and a bit hacky, as I'd need to translate GPS coordinates into points accurately.

I figured an easier solution would be just to drop a `MapAnnotation` for each GPS coordinate in the workout. If the GPS pings are close together enough, the annotations will overlap to produce a continuous line. Here's how that looked:

```swift
Map(
  coordinateRegion: .constant(
    MKCoordinateRegion(
      center: routeLocations.midpoint.coordinate, // Use the midpoint of the workout as the centre of the map.
      span: MKCoordinateSpan(latitudeDelta: 0.1, longitudeDelta: 0.1)
    )
  ),
  annotationItems: routeLocations
) { routeLocation in
  MapAnnotation(coordinate: routeLocation) {
    Circle().fill(Color.blue)
  }
}
```

![Map of Budapest with a route map of a workout overlaid](/assets/post-images/map-2.jpeg){:class="post-image-small"}

Great, it worked! I had a route map appearing as a single, continuous line.

Unfortunately, I'd created another problem. The screen was suddenly really sluggish, and the map took around five seconds to load. Checking Xcode's debugger made the problem clear — all those annotations take a lot of memory:

![Memory usage with and without annotations, showing 408MB usage with annotations and 112MB without](/assets/post-images/map-mem-usage.png){:class="post-image"}

## Optimising it

My next idea was to reduce the number of annotations. Workouts have a lot of GPS pings. What if I just dropped a certain percentage of the GPS pings? Could I balance the fidelity of the workout route with memory usage?

To test this, I wrote an extension to `Array` that took a percentage of elements to keep, and returned a new array with some of the elements removed:

```swift
extension Array {

  /// Returns a new array with a percentage of the original array kept.
  /// Retained entries are spaced evenly throughout the original array.
  func drop(percentageToKeep: Int) -> [Element] {
    guard percentageToKeep > 0 && percentageToKeep <= 100 else {
      fatalError("percentageToKeep must be between 1 and 100")
    }

    var filtered = [Element]()
    for index in self.indices {
      if index % (100 / percentageToKeep) == 0 {
        filtered.append(self[index])
      }
    }
    return filtered
  }
}
```

Next, I tested it by loading workouts while keeping different percentages of the annotations, and recorded the results:

### 44 min bike ride, with ~2,600 GPS pings

| GPS pings retained | Memory usage (MB) | Map looks ok?                          |
| ------------------ | ----------------- | -------------------------------------- |
| 0%                 | 110               | -                                      |
| 5%                 | 116               | Noticeable loss in detail when zooming |
| 10%                | 128               | Some loss in detail when zooming       |
| 20%                | 149               | Yes                                    |
| 33%                | 186               | Yes                                    |
| 50%                | 238               | Yes                                    |
| 100%               | 334               | -                                      |

5% seemed like the sweet spot. I don't mind some loss of detail, because the route map annotations don't need to be perfect, they just need to show a reasonable enough amount of detail for people to see their route.

I also tested the memory usage for a longer workout, to see how much memory is consumed when there are much more GPS pings:

### 4 hour bike ride, with ~14,200 GPS pings

| GPS pings retained | Memory usage (MB) |
| ------------------ | ----------------- |
| 0%                 | 113               |
| 5%                 | 170               |
| 100%               | 1380              |

170MB felt reasonable for such a long bike ride. The UI loaded quickly and there was no noticeable slow down, so I decided to proceed with only keeping 5% of GPS pings. Here's how it looks for the workout from earlier:

![Map of Budapest with a route map of a workout overlaid](/assets/post-images/map-2.jpeg){:class="post-image-small"}

Looking good! 😎 At higher zoom levels, there's definitely detail lost, but I think it still shows the route map at an acceptable detail level:

![Map of Budapest with a route map of a workout overlaid at a high zoom level showing loss of detail](/assets/post-images/map-3.PNG){:class="post-image-small"}

## Next steps

I'm tempted to make the algorithm a bit smarter. One thing I could do is adjust the percentage of GPS pings retained depending on the total. So, shorter workouts will have more detail than longer workouts. For now I've decided against this, because it feels like premature optimisation, plus I'm hopeful that SwiftUI's Map component will gain the ability to draw lines in the future, making my workaround obsolete.
