---
layout: blog
title: "Building a custom date formatter for Swift"
permalink: /swift-custom-date-format/
description: "How to make your own date formatter using Swift's Formatter API"
tags: ios
---

My [workout insights app Personal Best](https://getpersonalbest.com) includes a lot of date formatting for displaying workouts and leaderboards, which was a little unwieldy when initially written. iOS 15 brought a new Formatter API to Swift that makes it simpler to format data, and I've now migrated over to it (two years after launch 😅). Here's how to take advantage of it and make a custom formatter.

## iOS 15's formatter API

The new formatter is very easy to use. Here's an example of formatting a date using both the old approach and the new one:

```swift
let now = Date.now

// Old approach.
let formatter = DateFormatter()
formatter.dateStyle = .short
formatter.timeStyle = .short

// Produces 13/10/2023, 10:09AM
let formattedOldStyle = formatter.string(from: now)

// New approach. Produces 13/10/2023, 10:09AM
let formattedNewStyle = now.formatted(.dateTime)
```

At first this seems like a minor convenience, but when you want to do something more complex the new formatter really shines. Here's an example of getting the full month and a two digit year, for example _'October 23'_:

```swift
let now = Date.now

let formatter = DateFormatter()
formatter.dateFormat = "MMMM yy"
let formattedOldStyle = formatter.string(from: now)

let formattedNewStyle = now.formatted(.dateTime.month(.wide).year(.twoDigits))
```

As you can see, new format makes for much more readable code, whereas the old format needs you to remember (or use [a cheat sheet to get](https://www.advancedswift.com/date-formatter-cheatsheet-formulas-swift/)) the specific string you need to get the format you want. If you make a typo, you'll get an empty string back with no hint about what you did wrong.

## Extending it

For simpler uses the built-in formatter works great. However in Personal Best I like to display dates in a more customised way, like so:

```
if the workout was today, display the time, e.g. "9:42 AM"
if it was in the last 7 days, display just the weekday, e.g. "Wednesday"
if it was earlier this year, display the day and month, e.g. "11th December"
otherwise, display the day, month and year, e.g. "11th April 2022"
```

For something like this we need to make our own formatter. As the built-in formatters include lots of useful things like localisation, we should make our custom formatter piggyback off it.

First, let's make a struct that conforms to the `FormatStyle` protocol. To conform to the protocol we need to add `FormatInput` and `FormatOutput` type aliases, along with a `format` function.

```swift
struct RelativeDateStyle: FormatStyle {

  // The formatter will take dates as inputs, and
  // output strings.
  typealias FormatInput = Date
  typealias FormatOutput = String

  // Format the date.
  func format(_ value: Date) -> String {
    let formatter = Self.customFormatStyle(for: value)
    return formatter.format(value)
  }

  // Return an instance of Date.FormatStyle that's different depending
  // on the date passed in.
  private static func customFormatStyle(for date: Date) -> Date.FormatStyle {
    if date.isSameDateAs(date: .now) {
      return Date.FormatStyle(date: .omitted, time: .shortened)
    }
    if date.isInTheLast(numberOfDays: 7) {
      return Date.FormatStyle().weekday()
    }
    if date.isSameYearAs(date: .now) {
      return Date.FormatStyle().day().month()
    }
    return Date.FormatStyle(date: .abbreviated, time: .omitted)
  }
}

// Some convenience functions for checking when dates occur.
extension Date {
  private func isSameAs(date dateToCompareTo: Date, componentsToCompare: Set<Calendar.Component>) -> Bool {
    let dateComponentsForSelf = Calendar.current.dateComponents(componentsToCompare, from: self)
    let dateComponentsForDateToCompareTo = Calendar.current.dateComponents(componentsToCompare, from: dateToCompareTo)
    return dateComponentsForSelf == dateComponentsForDateToCompareTo
  }

  func isSameDateAs(date dateToCompareTo: Date) -> Bool {
    return isSameAs(date: dateToCompareTo, componentsToCompare: [.day, .month, .year])
  }

  func isSameYearAs(date dateToCompareTo: Date) -> Bool {
    return isSameAs(date: dateToCompareTo, componentsToCompare: [.year])
  }

  func isInTheLast(numberOfDays days: Int) -> Bool {
    let subtractedDate = Date() - (TimeInterval.oneDay * Double(days))
    return self > subtractedDate
  }
}
```

Finally, we can add an extension to `FormatStyle` so that we can simply write `.relative` when formatting dates:

```swift
extension FormatStyle where Self == RelativeDateStyle {
  static var relative: RelativeDateStyle {
    return RelativeDateStyle()
  }
}
```

Using the new formatter is simple and works just like the built-in ones:

```swift
let now = Date.now
let formatted = now.formatted(.relative)
```

The formatter can easily be extended to include further formatting options like verbosity, but this is left as an exercise for the reader.
