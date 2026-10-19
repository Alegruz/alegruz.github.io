---
layout: default
title: 수학 위키
description: 정의, 유도 과정, 계산 예제와 연습문제로 수학 개념을 익히는 한국어 참고 자료입니다.
permalink: /wiki/ko/
lang: ko
translation_key: math-wiki-index
---
<div class="home-shell">
  <header class="landing-hero">
    <p class="landing-kicker">수학 참고 자료</p>
    <h1>{{ page.title }}</h1>
    <p>개념이 필요한 이유부터 정의, 계산 예제, 다른 개념과의 연결까지 차근차근 살펴봅니다. 공부하고 다시 검토하면서 각 문서를 보완합니다.</p>
    {% assign translation_drafts = site.wiki | where: 'lang', 'ko' | where: 'translation_status', 'in_progress' %}
    {% if translation_drafts.size > 0 %}<p>번역 중인 문서는 각 문서 상단에서 남은 작업과 영문판 링크를 확인할 수 있습니다.</p>{% endif %}
    <p><a href="{{ '/wiki/' | relative_url }}" lang="en" hreflang="en">English Math Wiki</a></p>
  </header>
  {% assign language_entries = site.wiki | where: 'lang', 'ko' %}
  {% assign subjects = language_entries | group_by: 'subject' | sort: 'name' %}
  {% for subject in subjects %}
    <section aria-labelledby="subject-{{ forloop.index }}">
      <h2 id="subject-{{ forloop.index }}">{% if subject.name == 'Linear Algebra' %}선형대수학{% elsif subject.name == 'Optimization' %}최적화{% else %}{{ subject.name | escape }}{% endif %}</h2>
      <ul>
        {% assign entries = subject.items | sort: 'title' %}
        {% for entry in entries %}
          <li>
            <a href="{{ entry.url | relative_url }}">{{ entry.title | escape }}</a>{% if entry.translation_status == 'in_progress' %} <span>— 번역 진행 중</span>{% endif %}
            {% if entry.description %}<p>{{ entry.description | escape }}</p>{% endif %}
          </li>
        {% endfor %}
      </ul>
    </section>
  {% endfor %}
</div>
