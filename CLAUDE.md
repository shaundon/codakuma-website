# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development

```bash
bundle install              # Install dependencies
bundle exec jekyll serve    # Start dev server (localhost:4000)
```

Ruby 3.1.2 (see `.ruby-version`). Gems install to `vendor/bundle/`. Changes to `_config.yml` require a server restart.

## Architecture

This is a **Jekyll** static site for [codakuma.com](https://codakuma.com) — a personal blog and app portfolio for an indie iOS developer.

- `_posts/` — Blog posts in Markdown with YAML front matter (layout: blog)
- `_drafts/` — Unpublished draft posts
- `_layouts/` — Page templates (default, home, blog, page, blank, matt, blank-with-header)
- `_includes/` — Reusable partials (head, header, footer, end-of-blog-cta)
- `assets/` — SCSS (`main.scss`), JavaScript, and images
  - `post-images/` — Blog images organized by date (e.g., `2025/12/`)
- Root `.markdown` files — Standalone pages (index, posts, apps, cv, app landing pages)

## Content Conventions

Blog post front matter:
```yaml
---
layout: blog
title: "Post Title"
permalink: /url-slug/
description: "Brief description"
tags: tag1 tag2 tag3
---
```

- Cross-link posts with Liquid: `{% link _posts/YYYY-MM-DD-slug.markdown %}`
- Images use classes: `{:class="post-image"}` or `{:class="post-image post-image-small"}`
- Figure captions use `.caption` class

## Styling

Single SCSS file at `assets/main.scss` with:
- CSS custom properties for theming (light/dark via `prefers-color-scheme`)
- Base 8px spacing system
- 800px max-width centered layout
- Media query breakpoint at 600px (mobile-first)
- Light mode: cream background (#f5efe0), dark mode: dark background (#121212)

## Plugins

jekyll-sitemap, jekyll-feed, kramdown-parser-gfm

## Writing Style

When writing or editing blog posts, match these conventions:

**Voice:** Conversational, first-person, like talking to a knowledgeable friend. Never formal or documentation-like. Self-aware and occasionally self-deprecating humour — e.g. "like all good programmers I decided to instead invest a significant amount of time into building a bespoke solution."

**Structure:**
- Short paragraphs (2-4 sentences). Keep things scannable.
- Mix short punchy sentences with longer explanatory ones for rhythm.
- Open with a direct hook — either a personal anecdote, a problem statement, or narrative context. Never open with a generic introduction.
- Use `##` headings to break posts into clear sections. Don't over-nest.
- Close with a call-to-action (App Store link), a forward-looking thought, or a reflective summary. Often a "What's next" section for app announcements.

**Technical content:**
- Lead with the "why" — explain motivation and context before the solution.
- Show code early, then explain what it does after. Keep explanations pragmatic and problem-focused.
- Acknowledge limitations and trade-offs honestly rather than presenting solutions as perfect.
- Assume the reader has basic programming knowledge but explain domain-specific concepts.

**Tone details:**
- Transparent about numbers — shares download counts, revenue, subscriber figures openly.
- Personal stakes matter — weaves in the human story behind technical or business decisions.
- Measured self-assessment: "I'm fairly pleased with..." rather than hype.
- British English spelling (e.g. "colour", "recognised", "monetisation").
- Minimal emoji usage — occasionally in captions or playful asides, never heavily.
- Links are contextual and purposeful, not scattered. Cross-links to other posts when relevant using `{% link %}` syntax.
