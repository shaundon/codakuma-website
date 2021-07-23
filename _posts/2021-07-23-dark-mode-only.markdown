---
layout: page
title: "Selectively show and hide parts of your webpage based on dark mode"
permalink: /dark-mode-web/
description: "How to have parts of your webpage display or hide based on dark mode"
tags: web howto
---

Recently I set up [getpersonalbest.com](https://getpersonalbest.com) as a dedicated website for my workout-tracking app [Personal Best](https://apps.apple.com/gb/app/personal-best-workouts/id1510256676). Like this website, it supports dark mode.

As well as the website's appearance changing in dark mode, the screenshots on the home page also change depending on whether or not dark mode is enabled.

To do this, I created a couple of utility classes in my CSS:

```css
@media (prefers-color-scheme: dark) {
    .light-mode-only {
        display: none;
    }
}
@media (prefers-color-scheme: light) {
    .dark-mode-only {
        display: none;
    }
}
```

Using them in your HTML is straightforward:

```html
<img class="light-mode-only" src="light-mode-screenshots.png" />
<img class="dark-mode-only" src="dark-mode-screenshots.png" />
```

And that's it! Now I can easily hide and show parts of my website based on the user's dark mode setting. 

It works on this website too – the paragraph below will change based on your device setting. Try turning dark mode on and off and you'll see the text change automatically.

<p class="light-mode-only">
  <strong>Light mode is enabled.</strong>
</p>

<p class="dark-mode-only">
  <strong>Dark mode is enabled.</strong>
</p>