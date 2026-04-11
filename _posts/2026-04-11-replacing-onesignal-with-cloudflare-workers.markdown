---
layout: blog
title: "A ridiculously-lightweight push notification service"
permalink: /pushy/
description: "How I made my own tiny push notification service"
tags: ios swift
---

My app [Personal Best](https://apps.apple.com/gb/app/personal-best-workouts/id1510256676) uses local (on device) notifications for most things. In addition to that it supports push notifications, like for sales or when new features become available. I typically only use this once or twice per year but it's nice to have in my back pocket for when I need it.

For this I was using [OneSignal](https://onesignal.com) which is _fine_ but felt like overkill for my use case. Also I really didn't like having to add their SDK to my project. It's over 23,000 lines of code, requires its own notification service extension target, and phones home on every app launch. I try to keep my dependencies very minimal, so I was never happy about having to include this.

So, I replaced it with a [Cloudflare Worker](https://workers.cloudflare.com) that's about 200 lines of TypeScript plus a few of lines of Swift in the app. The whole thing costs nothing on the free tier.

## What I actually need

My requirements are simple:

- Store device tokens so I can send notifications later
- Know whether each user has Personal Best Pro or not, so I can target messages
- A basic admin UI to send messages

I've deliberately kept it very lightweight for now. I might want to add things like media attachments later, but I'm not worrying about that right now.

## The service: Pushy

I built a Cloudflare Worker called Pushy. It has three endpoints:

- **`POST /tokens`** -- register a device token. Accepts a JSON body with the token and whether the user has Pro.
- **`DELETE /tokens`** -- deregister a device token. Used when someone opts out of notifications.
- **`GET /admin`** -- a simple HTML page where I can compose and send a notification.

Tokens are stored in [Cloudflare KV](https://developers.cloudflare.com/kv/), which is a key-value store. Each token is a key, and the value is some metadata (pro status, registration date). When I send a notification, the worker reads all tokens from KV and sends each one to APNs directly.

### Sending to APNs

This was the part I expected to be hard, but [actually it was super easy, barely an inconvenience](https://ryan-george-verse.fandom.com/wiki/Super_easy,_barely_an_inconvenience). Apple's Push Notification service has an [HTTP/2 API](https://developer.apple.com/documentation/usernotifications/sending-notification-requests-to-apns). You POST a JSON payload to `https://api.push.apple.com/3/device/{token}` with a signed JWT in the header. Cloudflare Workers support the crypto APIs needed to sign the JWT, so no external dependencies are required.

If APNs returns a 410, the token is stale (the user uninstalled, or their token rotated). Pushy deletes these automatically, so the token list stays clean over time.

## The app side

On the iOS side, all I needed was to:

1. Get the APNs device token when the system provides it
2. `POST` it to Pushy on registration
3. `DELETE` it from Pushy on opt-out
4. Skip redundant calls if nothing has changed

The networking code is minimal:

```swift
private static func sendPushyRequest(method: String, body: [String: Any]) async -> Bool {
  guard let url = URL(string: "\(baseURL)/tokens") else { return false }
  var request = URLRequest(url: url)
  request.httpMethod = method
  request.setValue(appKey, forHTTPHeaderField: "X-App-Key")
  request.setValue("application/json", forHTTPHeaderField: "Content-Type")
  request.httpBody = try? JSONSerialization.data(withJSONObject: body)
  guard let (_, response) = try? await URLSession.shared.data(for: request) else { return false }
  return (response as? HTTPURLResponse)?.statusCode == 200
}
```

Both register and deregister use this same method, just with different HTTP methods and bodies. On success, a local flag in `UserDefaults` is updated so we don't make the same call again next launch. This matters because Cloudflare KV has a write limit on the free tier, and there's no point burning a write when nothing has changed.

### Capturing the device token

To get the APNs token, you implement `didRegisterForRemoteNotificationsWithDeviceToken` in your app delegate:

```swift
func application(
  _ application: UIApplication,
  didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
) {
  let token = deviceToken.map { String(format: "%02x", $0) }.joined()
  UserDefaults.standard.set(token, forKey: "deviceToken")
  Task { await PushNotificationsManager.register(token: token, pro: hasProAccess) }
}
```

The token is stored locally so it's available for deregistration later, without needing another system call.

## Gotchas

### Sandbox vs production APNs

APNs has two environments: sandbox (for debug builds from Xcode) and production (for TestFlight and App Store builds). They use different endpoints and a token from one won't work on the other. If you're testing with a debug build and sending to `api.push.apple.com`, you'll get a 410 and your token will be deleted.

I added an environment picker to the admin UI so I can switch between sandbox and production without redeploying.

### KV write limits

Cloudflare KV's free tier allows 1,000 writes per day. With the deduplication logic in the app (only register if the token or pro status actually changed), steady-state writes are minimal. The spike to watch for is the initial rollout when every user registers for the first time. The [$5/month paid plan](https://www.cloudflare.com/plans/developer-platform/) gives you 1 million writes per month, which is more than enough headroom.

## What I removed

Thanks to this I was able to remove:

- The OneSignal SPM package (154 files, 23K+ lines)
- The `OneSignalNotificationServiceExtension` target and its files

## Was it worth it?

For my use case, absolutely. The Cloudflare Worker is simple enough that I can understand every line of it, it costs nothing, and I have complete control over the data.

If you're sending millions of notifications, doing rich media, running notification A/B tests, or need delivery analytics, you probably want something more full featured like OneSignal or Firebase. But if your needs are minimal (like me), something like this is very doable.

Every decision is a trade off. TWhen I used OneSignal they were responsible for ensuring the service remained online, and now I'm in a position where I'm responsible if Cloudflare goes down or there's a bug in my code, For me the trade off of getting rid of a massive dependency and having more control over things is worth the downsides.

## Apple should offer this natively (pls Apple 🫶)

Apple already has a [push notifications console](https://developer.apple.com/notifications/push-notifications-console/), but it only allows sending either [broadcast notifications](https://developer.apple.com/documentation/usernotifications/sending-broadcast-push-notification-requests-to-apns) for updating Live Activities, or sending to a single individual user.

It'd be amazing if there was a nice first-party SDK that could take care of storing device tokens for users, and then if the push notifications console allowed us to target those stored users. I'll keep my fingers crossed for next WWDC.
