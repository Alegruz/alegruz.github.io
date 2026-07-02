---
layout: default
title: Series
permalink: /series/
---

<section class="series-index">
  <header class="series-header">
    <h1>Series</h1>
    <p>Grouped reading paths.</p>
  </header>

  <div class="series-grid">
    {%- for item in site.data.series -%}
      {%- assign series_key = item[0] -%}
      {%- assign series_data = item[1] -%}
      {%- assign series_posts = site.posts | where: "series", series_key | sort: "series_order" -%}
      {%- if series_posts.size > 0 -%}
        <a class="series-card" href="{{ "/series/" | append: series_key | append: "/" | relative_url }}">
          <h2>{{ series_data.label | escape }}</h2>
          <p>{{ series_data.description | escape }}</p>
          <span>{{ series_posts.size }} posts</span>
        </a>
      {%- endif -%}
    {%- endfor -%}
  </div>
</section>
