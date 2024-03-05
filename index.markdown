---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
title: ""
---

<div class="home-posts">
  <h2>Latest posts</h2>

  <ul class="no-bullets">
    {% for post in site.posts limit:5 %}
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

<a href="/blog">All posts &raquo;</a>

</div>
