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
        {%- assign recent_posts = series_posts | sort: "date" | reverse -%}
        {%- assign latest_post = recent_posts | first -%}
        {%- assign max_order = 0 -%}
        {%- assign order_tokens = "|" -%}
        {%- for post in series_posts -%}
          {%- assign post_order = post.series_order | default: 0 | plus: 0 -%}
          {%- if post_order > max_order -%}
            {%- assign max_order = post_order -%}
          {%- endif -%}
          {%- assign order_tokens = order_tokens | append: post_order | append: "|" -%}
        {%- endfor -%}
        {%- assign missing_count = 0 -%}
        {%- for order in (1..max_order) -%}
          {%- assign order_token = "|" | append: order | append: "|" -%}
          {%- unless order_tokens contains order_token -%}
            {%- assign missing_count = missing_count | plus: 1 -%}
          {%- endunless -%}
        {%- endfor -%}
        <a class="series-card" href="{{ "/series/" | append: series_key | append: "/" | relative_url }}">
          <h2>{{ series_data.label | escape }}</h2>
          <p>{{ series_data.description | escape }}</p>
          <span>{{ series_posts.size }} posts</span>
          <small>Updated {{ latest_post.date | date: "%Y-%m-%d" }} / {% if missing_count == 0 %}Complete{% else %}{{ missing_count }} missing{% endif %}</small>
        </a>
      {%- endif -%}
    {%- endfor -%}
  </div>
</section>
