---
layout: page
title: "All posts"
permalink: /blog/
description: "Codakuma Blog."
---

<div class="home-posts">

  <ul class="no-bullets">
    {% for post in site.posts %}
      <li class="home-post">
        <a href="{{ post.url }}">
          {{ post.title }}
        </a>
        <p>{{ post.description }}</p>
        <div class="home-post-date">
          {{ post.date | date_to_string }}
        </div>
      </li>
    {% endfor %}

  </ul>

</div>
