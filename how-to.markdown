---
layout: page
title: 'Tips and guides'
permalink: /how-to/
description: "Coding tips and guides from Codakuma."
---

<ul>
  {% for tag in site.tags %}
    {% if tag[0] == "howto" %}
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