---
layout: default
title: Topics
permalink: /topics/
---

<section class="topic-index">
  <header class="topic-header">
    <h1>Topics</h1>
    <p>Browse posts by subject and difficulty.</p>
  </header>

  <div class="topic-grid">
    {%- for item in site.data.topics -%}
      {%- assign topic_key = item[0] -%}
      {%- assign topic_data = item[1] -%}
      {%- assign topic_posts = site.posts | where: "topic", topic_key -%}
      <a class="topic-card" href="{{ "/topics/" | append: topic_key | append: "/" | relative_url }}">
        <h2>{{ topic_data.label | escape }}</h2>
        <p>{{ topic_data.description | escape }}</p>
        <span>{{ topic_posts.size }} posts</span>
      </a>
    {%- endfor -%}
  </div>
</section>
