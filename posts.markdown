---
layout: page
title: 'All posts'
permalink: /blog/
description: "Codakuma Blog."
---

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">
        {{ post.title }}
      </a>
      - <strong>{{ post.date | date_to_string }}</strong>
      <p>{{ post.description }}</p>
    </li>
  {% endfor %}
</ul>