---
layout: page
title: 'Personal Best for iPhone'
permalink: /personal-best/
description: "Level up your workouts"
image: "/assets/personal-best-screenshots.png"
tags: personal-best apps
app_banner: id1510256676
app_clip: uk.sdonnelly.personal-best-0.Clip
---

<div class="app">
    <img src="/assets/personal-best-icon.png" class="app-icon" />
    <div>
        <span>Level up your workouts</span>
    </div>
</div>

![Various screenshots of Personal Best](/assets/personal-best-banner.png){:class="post-image"}

Personal Best is the ultimate fitness companion for iPhone. It works in unison with Apple Health to bring your workouts to life, with leaderboards, interesting statistics and more.

<div class="flex-wrapper">
  <a class="button" href="https://apps.apple.com/gb/app/personal-best-workouts/id1510256676">Download on the App Store</a>
  <a class="button" href="/personal-best/press-kit">Press kit</a>
</div>

## Features

### Leaderboards and insights

Your workouts are a treasure trove of useful, meaningful data, but this valuable data often goes unused. Personal Best creates leaderboards from your workouts, plus all kinds of interesting insights like how long you’ve spent exercising this year, as well as facts like your coldest workout or what time of day you work out most. You can even create your own leaderboards to rank your workouts in ridiculously specific ways.

### Notifications and widgets

Learn about your workouts without even opening Personal Best. Turn on notifications to see your key insights and leaderboards the moment you finish a workout. Then, freshen up your home screen with Personal Best’s widgets. See key insights, your latest workouts, or a combination.

### Privacy first

Personal Best takes your privacy very seriously. The only data is transmits are basic anonymised analytics such as "app launched" or "workout shared". The sole purpose of this is to help me know where to focus my development efforts.

### Inexpensive one-time purchase

Personal Best is free to use, with an in-app purchase to unlock Personal Best Pro. No recurring subscription or annoying upsells like other fitness apps.

## Related posts

<ul>
  {% for tag in site.tags %}
    {% if tag[0] == "personal-best" %}
      {% for post in tag[1] %}
        <li>
          <a href="{{ post.url }}">
            {{ post.title }}
          </a>
          - <strong>{{ post.date | date_to_string }}</strong>
          <p>{{ post.description }}</p>
        </li>
      {% endfor %}
    {% endif %}
  {% endfor %}
</ul>

<details>
  <summary>App Clip (Experimental, may not work yet)</summary>
  <img src="/assets/personal-best-app-clip-code.svg" class="post-image-small" alt="Personal Best App Clip Code" />
</details>