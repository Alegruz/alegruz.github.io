---
layout: default
title: Sitemap
permalink: /sitemap/
---

<section class="sitemap-page">
  <header class="page-header">
    <h1>Sitemap</h1>
    <p>All public pages and posts on this site.</p>
  </header>

  <h2>Pages</h2>
  <ul>
    <li><a href="{{ "/" | relative_url }}">Home</a></li>
    <li><a href="{{ "/about/" | relative_url }}">About</a></li>
    <li><a href="{{ "/cv/" | relative_url }}">CV</a></li>
    <li><a href="{{ "/music/" | relative_url }}">Music</a></li>
    <li><a href="{{ "/series/" | relative_url }}">Series</a></li>
    <li><a href="{{ "/topics/" | relative_url }}">Topics</a></li>
  </ul>

  <h2>Series</h2>
  <ul>
    {%- assign series_pages = site.pages | where_exp: "page", "page.url contains '/series/'" | sort: "url" -%}
    {%- for series_page in series_pages -%}
      {%- unless series_page.url == "/series/" or series_page.sitemap == false -%}
        <li><a href="{{ series_page.url | relative_url }}">{{ series_page.title | default: series_page.url | escape }}</a></li>
      {%- endunless -%}
    {%- endfor -%}
  </ul>

  <h2>Topics</h2>
  <ul>
    {%- assign topic_pages = site.pages | where_exp: "page", "page.url contains '/topics/'" | sort: "url" -%}
    {%- for topic_page in topic_pages -%}
      {%- unless topic_page.url == "/topics/" or topic_page.sitemap == false -%}
        <li><a href="{{ topic_page.url | relative_url }}">{{ topic_page.title | default: topic_page.url | escape }}</a></li>
      {%- endunless -%}
    {%- endfor -%}
  </ul>

  <h2>Posts</h2>
  <ul>
    {%- assign posts = site.posts | sort: "date" | reverse -%}
    {%- for post in posts -%}
      {%- unless post.sitemap == false -%}
        <li>
          <a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
          <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y-%m-%d" }}</time>
        </li>
      {%- endunless -%}
    {%- endfor -%}
  </ul>
</section>
