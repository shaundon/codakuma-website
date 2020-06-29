---
layout: page
title: 'Personal Best for iPhone'
permalink: /personal-best/
description: "Your workouts, supercharged."
image: "/assets/personal-best-screenshots.png"
tags: personal-best apps
app_banner: id1510256676
---

<div class="app">
    <img src="/assets/personal-best-icon.png" class="app-icon" />
    <div>
        <span>Your workouts, supercharged.</span>
    </div>
</div>


Personal Best works in unison with Apple Health to turn your workouts into useful insights.

See your workouts ranked by distance, duration, calories, or use powerful custom filters to make your own leaderboards. Dive into interesting stats, like your earliest workout, hottest workout, total calories burned, and so much more.

[Get Personal Best for free on the App Store](https://apps.apple.com/gb/app/personal-best-workouts/id1510256676)

![Screenshots of Personal Best 2](/assets/personal-best-screenshots.png){:class="post-image"}

## Privacy policy

Personal Best does not collect any information from your device.

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