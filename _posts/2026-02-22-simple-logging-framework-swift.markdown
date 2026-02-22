---
layout: blog
title: "A simple logging framework in Swift"
permalink: /swift-logging/
description: "How I built a lightweight logging system using OSLog"
tags: ios swift
---

Up to now I've done debugging by connecting my phone to Xcode and scrolling through the console. This works fine at your desk, but not so much when a user reports a bug with "it crashed when I opened the app" and nothing else to go on. Or when you hit a bug while you're out, make a mental note, and forget the details by the time you're home.

I wanted structured logs I could retrieve later, without adding a third-party dependency or paying for a service. Here's what I did.

## Choosing a solution

Apple's [OSLog system](https://developer.apple.com/documentation/os/logging) is built into their platforms but I didn't even know it existed until now.

It has lots of benefits like automatic log rotation so logs never grow too large, and it doesn't persist debug and info logs by default, so you can log liberally during development without worrying about bloat in production. It also supports categorising your logs, which makes filtering through hundreds of entries much easier.

I built a lightweight wrapper over it called `LogManager`

## LogManager

```swift
import Foundation
import OSLog

struct LogManager {

  enum LogCategory {
    case networking
    case sync
    // Add more categories here as needed
    case custom(String)

    var stringValue: String {
      switch self {
      case .networking: return "networking"
      case .sync: return "sync"
      case .custom(let value): return value
      }
    }
  }

  private static let subsystem = Bundle.main.bundleIdentifier ?? "com.example.myapp"

  private static func logger(for category: LogCategory) -> Logger {
    Logger(subsystem: subsystem, category: category.stringValue)
  }

  static func debug(_ message: String, in category: LogCategory) {
    logger(for: category).debug("\(message, privacy: .public)")
  }

  static func info(_ message: String, in category: LogCategory) {
    logger(for: category).info("\(message, privacy: .public)")
  }

  static func notice(_ message: String, in category: LogCategory) {
    logger(for: category).notice("\(message, privacy: .public)")
  }

  static func error(_ message: String, in category: LogCategory) {
    logger(for: category).error("\(message, privacy: .public)")
  }

  static func error(_ error: Error, in category: LogCategory, context: String? = nil) {
    let message = if let context = context {
      "\(context): \(error.localizedDescription)"
    } else {
      error.localizedDescription
    }
    logger(for: category).error("\(message, privacy: .public)")
  }

  static func fault(_ message: String, in category: LogCategory) {
    logger(for: category).fault("\(message, privacy: .public)")
  }
}
```

Usage is straightforward:

```swift
LogManager.notice("Starting sync", in: .sync)

do {
  try await performSync()
  LogManager.notice("Sync completed successfully", in: .sync)
} catch {
  LogManager.error(error, in: .sync, context: "Sync failed")
}
```

And because we're using a thing wrapper around `OSLog`, if I ever want to integrate with a third-party service in future, it'll require very minimal code changes:

```swift
static func error(_ message: String, in category: LogCategory) {
  logger(for: category).error("\(message, privacy: .public)")
  SomeRemoteLoggingService.send(message, level: .error, category: category.stringValue)
}
```

Be aware that by default `OSLog` redacts dynamic strings in production, so you'd just see `<private>`. I'm only logging operational stuff (no user data), so `.public` is fine for me, but it might not be for you.

## Exporting logs

I also needed a way to get logs **off** the device — both for me when I'm not connected to the debugger, and for users reporting issues.

`OSLog` entries live in an `OSLogStore` that you can query directly:

```swift
import Foundation
import OSLog

func exportLogs(lastHours: Int = 24) throws -> URL {
  let store = try OSLogStore(scope: .currentProcessIdentifier)
  let date = Date.now.addingTimeInterval(-Double(lastHours) * 3600)
  let position = store.position(date: date)
  let bundleIdentifier = Bundle.main.bundleIdentifier ?? "com.example.myapp"

  let entries = try store
    .getEntries(at: position)
    .compactMap { $0 as? OSLogEntryLog }
    .filter { $0.subsystem == bundleIdentifier }

  var logLines: [String] = []
  logLines.append("App Logs")
  logLines.append("Generated: \(Date.now.formatted(date: .complete, time: .complete))")
  logLines.append("Period: Last \(lastHours) hours")
  logLines.append(String(repeating: "=", count: 80))
  logLines.append("")

  for entry in entries {
    let timestamp = entry.date.formatted(date: .omitted, time: .standard)
    let level = levelString(for: entry.level)
    let category = entry.category.padding(toLength: 20, withPad: " ", startingAt: 0)
    logLines.append("[\(timestamp)] [\(level)] [\(category)] \(entry.composedMessage)")
  }

  let logsString = logLines.joined(separator: "\n")

  let tempDirectory = FileManager.default.temporaryDirectory
  let fileURL = tempDirectory.appendingPathComponent("app-logs-\(Int(Date().timeIntervalSince1970)).txt")
  try logsString.write(to: fileURL, atomically: true, encoding: .utf8)

  return fileURL
}
```

This grabs the last 24 hours of your app's logs, formats them into a text file, and gives you a URL you can hand to a share sheet. The output looks like:

```
App Logs
Generated: Saturday, 22 February 2026 at 14:30:00 GMT
Period: Last 24 hours
================================================================================

[09:15:23] [NOTIC] [sync               ] Starting sync
[09:15:24] [NOTIC] [sync               ] Sync completed successfully
[09:22:01] [ERROR] [networking          ] Request failed: The operation timed out
[10:45:12] [NOTIC] [notifications       ] Scheduled notification: Reminder
```

The categories from `LogManager` carry through here, so you can quickly scan for the area you care about. I have an 'Export logs' button in my app which brings up the share sheet with the file, which I can either send to myself or have a user send to me.

## That's it

I can now debug issues that happen away from Xcode, and get better user reports.
