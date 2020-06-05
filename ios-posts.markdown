---
layout: page
title: 'iOS Posts'
permalink: /ios-blog/
description: "Codakuma iOS Blog."
---

{% for post in site.posts %}
{% if post.tags contains "ios" %}
  <div class="post">
    <a href="{{ post.url }}" class="post__title">
      {{ post.title }}
    </a>
    <div class="post__date">
      {{ post.date | date_to_string }}
    </div>
    <p>{{ post.excerpt }}</p>
    <a href="{{ post.url }}">
      Read more &raquo;
    </a>
  </div>
{% endif %}
{% endfor %}