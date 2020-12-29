---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
title: ''
---

## Latest blog posts

<ul class="no-bullets">
  {% for post in site.posts limit:10 %}
    <li>
      <a href="{{ post.url }}">
        {{ post.title }}
      </a>
      - <strong>{{ post.date | date_to_string }}</strong>
      <p>{{ post.description }}</p>
    </li>
  {% endfor %}
</ul>

[All posts &raquo;]({% link posts.markdown %})