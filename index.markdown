---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
title: ''
---

## On the web

* [App Store](https://apps.apple.com/us/developer/shaun-donnelly/id592250637)
* [Twitter](https://twitter.com/codakuma)
* [GitHub](https://github.com/shaundon)

## Need help?

[Send an email](mailto:help@codakuma.com)

## Latest posts

<ul>
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

{% if site.posts.length > 10 %}
[All posts &raquo;]({% link posts.markdown %})
{% endif %}