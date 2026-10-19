---
layout: default
title: Math Wiki
description: Definitions, examples, and proofs collected as an evolving mathematics reference.
permalink: /wiki/
lang: en
translation_key: math-wiki-index
---
<div class="home-shell">
  <header class="landing-hero">
    <p class="landing-kicker">Mathematics reference</p>
    <h1>{{ page.title }}</h1>
    <p>Notes on mathematical concepts, with definitions, worked examples, and connections. Each entry grows as I study and revisit the subject.</p>
  </header>
  <p><a href="{{ '/wiki/ko/' | relative_url }}" lang="ko" hreflang="ko">한국어 수학 위키</a></p>
  {% assign language_entries = site.wiki | where: 'lang', 'en' %}
  {% assign subjects = language_entries | group_by: 'subject' | sort: 'name' %}
  {% for subject in subjects %}
    <section aria-labelledby="subject-{{ forloop.index }}">
      <h2 id="subject-{{ forloop.index }}">{{ subject.name | escape }}</h2>
      <ul>
        {% assign entries = subject.items | sort: 'title' %}
        {% for entry in entries %}
          <li>
            <a href="{{ entry.url | relative_url }}">{{ entry.title | escape }}</a>
            {% if entry.description %}<p>{{ entry.description | escape }}</p>{% endif %}
          </li>
        {% endfor %}
      </ul>
    </section>
  {% endfor %}
</div>
