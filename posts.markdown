---
layout: page
title: 'Posts'
permalink: /blog/
description: "Codakuma Blog."
---

{% for post in site.posts %}
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
{% endfor %}