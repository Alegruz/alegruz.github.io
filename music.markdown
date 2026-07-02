---
layout: default
title: Music
permalink: /music/
tracks:
  - title: Gourmet of Fire
    src: /assets/musics/Gourmet%20of%20Fire.mp3
    mood: High energy
    role: Game theme sketch
    note: A fast, playful cue for a compact action or arcade moment.
  - title: Castle Theme Test 00
    src: /assets/musics/Castle%20Theme%20Test%2000.mp3
    mood: Fantasy
    role: Location loop
    note: An early castle-area idea with a simple game soundtrack shape.
  - title: Castle Theme Test 02
    src: /assets/musics/Castle%20Theme%20Test%2002.mp3
    mood: Fantasy
    role: Theme variation
    note: A second pass on the castle mood, kept short and direct.
  - title: Test04
    src: /assets/musics/Test04.mp3
    mood: Prototype
    role: Mood sketch
    note: A broader experiment for testing texture, pacing, and atmosphere.
  - title: Theme
    src: /assets/musics/Theme.mp3
    mood: Compact
    role: Main motif
    note: A concise theme idea that can be expanded for a small project.
  - title: Steel Guitar
    src: /assets/musics/Steel%20Guitar.mp3
    mood: Guitar-led
    role: Instrumental sketch
    note: A guitar-focused piece for a more personal or relaxed tone.
---

<section class="music-shell">
  <section class="music-hero" aria-labelledby="music-title">
    <div class="music-hero-copy">
      <p class="music-kicker">Music sketches</p>
      <h1 id="music-title">Small soundtrack ideas for games, prototypes, and personal projects.</h1>
      <p>
        I am mostly a game graphics engineer, but I also love making music on the side.
        This is not a full-time composer pitch; it is a place to share the themes, loops,
        and mood sketches I can bring into the right small project.
      </p>
      <div class="music-actions">
        <a class="music-btn" href="#music-tracks">Listen</a>
      </div>
    </div>

    <div class="music-visual" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </section>

  <section id="music-tracks" class="music-track-list" aria-label="Music tracks">
    {%- for track in page.tracks -%}
      <article class="music-track">
        <div class="track-art" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="track-copy">
          <p class="track-index">Track {{ forloop.index }}</p>
          <h2>{{ track.title }}</h2>
          <p>{{ track.note }}</p>
          <div class="track-tags">
            <span>{{ track.mood }}</span>
            <span>{{ track.role }}</span>
          </div>
        </div>
        <audio controls preload="none" controlslist="nodownload noremoteplayback">
          <source src="{{ track.src | relative_url }}" type="audio/mpeg">
          Your browser does not support the audio tag.
        </audio>
      </article>
    {%- endfor -%}
  </section>
</section>
