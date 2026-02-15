---
layout: page
title: Portfolio
permalink: /portfolio/
---

<section class="portfolio-hero-panel">
  <p class="portfolio-kicker">Rendering Systems, Graphics APIs, and Theory</p>
  <h1 class="portfolio-title">Minha Armada Ju (Alegruz)</h1>
  <p class="portfolio-summary" data-lang="en">
    I build rendering and engine systems for real-time games, with emphasis on API correctness,
    data-oriented performance, and theory-backed implementation.
  </p>
  <p class="portfolio-summary" data-lang="ko">
    실시간 게임용 렌더링/엔진 시스템을 개발합니다.
    API 정확성, 데이터 중심 성능 최적화, 이론 기반 구현을 핵심으로 다룹니다.
  </p>
  <div class="portfolio-cta">
    <a class="portfolio-btn" href="/cv/">CV</a>
    <a class="portfolio-btn" href="/">Posts</a>
    <a class="portfolio-btn" href="https://github.com/Alegruz" target="_blank" rel="noopener">GitHub</a>
    <a class="portfolio-btn" href="https://www.linkedin.com/in/alegruz" target="_blank" rel="noopener">LinkedIn</a>
  </div>
</section>

<section class="focus-switch" aria-label="Focus switch">
  <button class="focus-btn active" type="button" data-focus="production">Production</button>
  <button class="focus-btn" type="button" data-focus="rendering">Rendering</button>
  <button class="focus-btn" type="button" data-focus="theory">Theory</button>
  <button class="focus-btn" type="button" data-focus="interests">Interests</button>
</section>

<section class="focus-panel" data-focus-panel="production">
  <h2 data-lang="en">Production and Engine Work</h2>
  <h2 data-lang="ko">실무 및 엔진 개발</h2>
  <div class="portfolio-grid">
    <article class="portfolio-card">
      <h3>Pearl Abyss (2023 to present)</h3>
      <ul data-lang="en">
        <li>Game engine systems engineering for large-scale game production.</li>
        <li>Shader compilation and material workflows.</li>
        <li>Platform-specific optimization across PC, console, and Android Vulkan targets.</li>
      </ul>
      <ul data-lang="ko">
        <li>대규모 게임 개발을 위한 엔진 시스템 개발.</li>
        <li>셰이더 컴파일 및 머티리얼 워크플로우 개선.</li>
        <li>PC/콘솔/Android Vulkan 대상 플랫폼 최적화.</li>
      </ul>
    </article>
    <article class="portfolio-card">
      <h3>Core Themes</h3>
      <ul data-lang="en">
        <li>Stable rendering behavior under real production constraints.</li>
        <li>Debugging-first workflow with GPU tooling.</li>
        <li>Performance profiling across CPU and GPU bottlenecks.</li>
      </ul>
      <ul data-lang="ko">
        <li>실무 제약 하에서도 안정적인 렌더링 동작 확보.</li>
        <li>GPU 도구 중심의 디버깅 우선 워크플로우.</li>
        <li>CPU/GPU 병목 구간 성능 분석 및 개선.</li>
      </ul>
    </article>
  </div>
</section>

<section class="focus-panel" data-focus-panel="rendering" hidden>
  <h2 data-lang="en">Rendering Studies and Implementations</h2>
  <h2 data-lang="ko">렌더링 연구 및 구현</h2>
  <div class="portfolio-grid">
    <article class="portfolio-card">
      <h3>ReSTIR / ReSTIR GI</h3>
      <p data-lang="en">Hands-on implementation studies, from foundational RIS understanding to practical D3D12 integration.</p>
      <p data-lang="ko">기초 RIS 이해부터 D3D12 적용까지, ReSTIR 계열 구현을 단계적으로 정리했습니다.</p>
      <p><a href="/2025/11/06/implementing-restir-and-restir-gi-on-d3d12.html">Implementing ReSTIR and ReSTIR-GI on D3D12</a></p>
      <p><a href="/2025/12/05/implementing-restir-variants-in-a-direct3d-12-path-tracer-a-practical-study-in-spatio-temporal-resampling.html">Implementing ReSTIR Variants in a D3D12 Path Tracer</a></p>
    </article>
    <article class="portfolio-card">
      <h3>Graphics API and Pipeline Design</h3>
      <p data-lang="en">Exploration of command submission, pipeline state management, and modern RHI patterns.</p>
      <p data-lang="ko">커맨드 제출, 파이프라인 상태 관리, 현대 RHI 패턴을 중심으로 탐구했습니다.</p>
      <p><a href="/2024/07/24/understanding-command-submission-in-modern-graphics-api.html">Understanding Command Submission in Modern Graphics</a></p>
      <p><a href="/2024/11/22/pipeline-state-cache-studies.html">Pipeline State Cache Studies</a></p>
      <p><a href="/2024/11/25/game-engine-rhi-system-analysis-series-0-introduction.html">RHI System Analysis Series</a></p>
    </article>
  </div>
</section>

<section class="focus-panel" data-focus-panel="theory" hidden>
  <h2 data-lang="en">Theoretical Foundations</h2>
  <h2 data-lang="ko">이론적 기반</h2>
  <div class="portfolio-grid">
    <article class="portfolio-card">
      <h3>Radiometry, BRDF, Monte Carlo</h3>
      <p data-lang="en">Structured notes linking physical rendering theory to implementation decisions.</p>
      <p data-lang="ko">물리 기반 렌더링 이론과 실제 구현 선택을 연결해 정리한 노트입니다.</p>
      <p><a href="/2025/04/24/understanding-radiometry.html">Understanding Radiometry</a></p>
      <p><a href="/2025/04/23/understanding-brdf.html">Understanding BRDF</a></p>
      <p><a href="/2025/06/28/study-notes-on-monte-carlo-integration.html">Study Notes on Monte Carlo Integration</a></p>
    </article>
    <article class="portfolio-card">
      <h3>Long-form Learning</h3>
      <ul data-lang="en">
        <li>Math proof writing and formal reasoning notes.</li>
        <li>Foundational graphics textbook study series.</li>
      </ul>
      <ul data-lang="ko">
        <li>수학 증명 작성 및 형식 논리 학습 노트.</li>
        <li>그래픽스 기초 교재 기반 장기 학습 시리즈.</li>
      </ul>
    </article>
  </div>
</section>

<section class="focus-panel" data-focus-panel="interests" hidden>
  <h2 data-lang="en">Broader Technical Interests</h2>
  <h2 data-lang="ko">확장 관심 분야</h2>
  <div class="portfolio-grid">
    <article class="portfolio-card">
      <h3 data-lang="en">Game and Engine Interests</h3>
      <h3 data-lang="ko">게임/엔진 관심사</h3>
      <ul>
        <li>Classic console architecture and emulator implementation.</li>
        <li>Rendering performance literacy for practical game shipping.</li>
        <li>Bridging study notes and production-quality systems.</li>
      </ul>
    </article>
    <article class="portfolio-card">
      <h3 data-lang="en">Personal Learning Arc</h3>
      <h3 data-lang="ko">개인 학습 방향</h3>
      <ul>
        <li>Language learning and technical communication.</li>
        <li>Applied mathematics for graphics and simulation.</li>
        <li>Long-term, iterative learning through public notes.</li>
      </ul>
    </article>
  </div>
</section>

<script>
document.addEventListener("DOMContentLoaded", function () {
  const buttons = Array.from(document.querySelectorAll(".focus-btn"));
  const panels = Array.from(document.querySelectorAll("[data-focus-panel]"));
  if (!buttons.length || !panels.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const key = button.dataset.focus;
      buttons.forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.focusPanel !== key;
      });
    });
  });
});
</script>
