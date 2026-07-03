document.addEventListener("DOMContentLoaded", function () {
  const rows = Array.from(document.querySelectorAll(".post-row"));
  if (!rows.length) {
    return;
  }

  const searchInput = document.getElementById("post-search");
  const topicButtons = Array.from(document.querySelectorAll(".chip[data-topic]"));
  const languageButtons = Array.from(document.querySelectorAll(".chip[data-lang-filter]"));
  const yearGroups = Array.from(document.querySelectorAll("[data-year-group]"));
  const yearSelect = document.getElementById("year-filter");
  const seriesSelect = document.getElementById("series-filter");
  const emptyNotice = document.getElementById("feed-empty");
  const visibleCount = document.getElementById("visible-count");
  const script = document.querySelector("script[data-search-index]");
  const searchIndexUrl = script?.dataset.searchIndex;
  const urlParams = new URLSearchParams(window.location.search);

  let activeTopic = urlParams.get("topic") || "all";
  let activeLanguageFilter = urlParams.get("lang") || uiLanguage();
  let activeYear = urlParams.get("year") || "all";
  let activeSeries = urlParams.get("series") || "all";
  let searchHydrated = false;

  function uiLanguage() {
    return document.documentElement.getAttribute("lang") === "ko" ? "ko" : "en";
  }

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function updateLocalizedControls() {
    const isKorean = uiLanguage() === "ko";

    if (searchInput) {
      searchInput.placeholder = isKorean
        ? searchInput.dataset.placeholderKo || "글 검색"
        : searchInput.dataset.placeholderEn || "Search posts";
      searchInput.setAttribute("aria-label", searchInput.placeholder);
    }

    if (yearSelect?.options.length) {
      yearSelect.options[0].textContent = isKorean ? "모든 연도" : "All years";
    }

    if (seriesSelect?.options.length) {
      seriesSelect.options[0].textContent = isKorean ? "모든 시리즈" : "All series";
    }
  }

  function setActiveButton(buttons, activeButton) {
    buttons.forEach((button) => {
      const active = button === activeButton;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function setLanguageFilter(lang) {
    const supported = new Set(["all", "en", "ko"]);
    activeLanguageFilter = supported.has(lang) ? lang : uiLanguage();
    const activeButton = languageButtons.find((button) => button.dataset.langFilter === activeLanguageFilter);
    if (activeButton) {
      setActiveButton(languageButtons, activeButton);
    }
  }

  function syncControlsFromState() {
    const activeTopicButton = topicButtons.find((button) => button.dataset.topic === activeTopic) || topicButtons[0];
    if (activeTopicButton) {
      activeTopic = activeTopicButton.dataset.topic || "all";
      setActiveButton(topicButtons, activeTopicButton);
    }

    setLanguageFilter(activeLanguageFilter);

    if (yearSelect) {
      const hasYear = Array.from(yearSelect.options).some((option) => option.value === activeYear);
      yearSelect.value = hasYear ? activeYear : "all";
      activeYear = yearSelect.value;
    }

    if (seriesSelect) {
      const hasSeries = Array.from(seriesSelect.options).some((option) => option.value === activeSeries);
      seriesSelect.value = hasSeries ? activeSeries : "all";
      activeSeries = seriesSelect.value;
    }

    if (searchInput) {
      searchInput.value = urlParams.get("q") || "";
    }
  }

  function getSearchText(row) {
    return [
      row.dataset.title || "",
      row.dataset.summary || "",
      row.dataset.searchText || ""
    ].join(" ");
  }

  function highlightText(element, query) {
    if (!element) {
      return;
    }

    const original = element.dataset.originalText || element.textContent;
    element.dataset.originalText = original;

    if (!query) {
      element.textContent = original;
      return;
    }

    const pattern = new RegExp(`(${escapeRegExp(query)})`, "ig");
    element.innerHTML = escapeHtml(original).replace(pattern, "<mark class=\"search-mark\">$1</mark>");
  }

  function updateUrl(query) {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (activeTopic !== "all") next.set("topic", activeTopic);
    if (activeLanguageFilter !== uiLanguage()) next.set("lang", activeLanguageFilter);
    if (activeYear !== "all") next.set("year", activeYear);
    if (activeSeries !== "all") next.set("series", activeSeries);

    const queryString = next.toString();
    const nextUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", nextUrl);
  }

  function applyFilters(options = {}) {
    const query = ((searchInput && searchInput.value) || "").trim().toLowerCase();
    let count = 0;

    updateLocalizedControls();

    rows.forEach((row) => {
      const rowLanguage = row.dataset.postLang || "en";
      const rowTopic = row.dataset.topic || "engine";
      const rowYear = row.dataset.year || "";
      const rowSeries = row.dataset.series || "";
      const matchesTopic = activeTopic === "all" || rowTopic === activeTopic;
      const matchesLanguage = activeLanguageFilter === "all" || rowLanguage === activeLanguageFilter;
      const matchesYear = activeYear === "all" || rowYear === activeYear;
      const matchesSeries = activeSeries === "all" || rowSeries === activeSeries;
      const matchesQuery = !query || getSearchText(row).includes(query);
      const visible = matchesTopic && matchesLanguage && matchesYear && matchesSeries && matchesQuery;

      row.hidden = !visible;
      row.classList.toggle("search-hit", Boolean(query && visible));
      highlightText(row.querySelector(".post-link"), visible ? query : "");
      highlightText(row.querySelector(".post-summary"), visible ? query : "");

      if (visible) {
        count += 1;
      }
    });

    yearGroups.forEach((group) => {
      const hasVisibleRows = Array.from(group.querySelectorAll(".post-row")).some((row) => !row.hidden);
      group.hidden = !hasVisibleRows;
    });

    if (visibleCount) {
      visibleCount.textContent = String(count);
    }

    if (emptyNotice) {
      emptyNotice.hidden = count !== 0;
      emptyNotice.textContent = uiLanguage() === "ko"
        ? emptyNotice.dataset.msgKo || "현재 필터 조건에 맞는 글이 없습니다."
        : emptyNotice.dataset.msgEn || "No posts match the current filters.";
    }

    if (!options.skipUrlUpdate) {
      updateUrl(query);
    }
  }

  function hydrateSearchIndex() {
    if (!searchIndexUrl) {
      return;
    }

    const rowsByUrl = new Map(rows.map((row) => [row.dataset.url, row]));
    fetch(searchIndexUrl, { headers: { Accept: "application/json" } })
      .then((response) => response.ok ? response.json() : [])
      .then((posts) => {
        posts.forEach((post) => {
          const row = rowsByUrl.get(post.url);
          if (!row) {
            return;
          }

          row.dataset.searchText = [
            post.title,
            post.description,
            post.excerpt,
            post.content,
            post.topic_label,
            post.series_label,
            post.status,
            post.difficulty
          ].filter(Boolean).join(" ").toLowerCase();
        });
        searchHydrated = true;
        applyFilters();
      })
      .catch(() => {
        searchHydrated = true;
      });
  }

  topicButtons.forEach((button) => {
    button.addEventListener("click", function () {
      activeTopic = button.dataset.topic || "all";
      setActiveButton(topicButtons, button);
      applyFilters();
    });
  });

  languageButtons.forEach((button) => {
    button.addEventListener("click", function () {
      activeLanguageFilter = button.dataset.langFilter || "all";
      setActiveButton(languageButtons, button);
      applyFilters();
    });
  });

  if (yearSelect) {
    yearSelect.addEventListener("change", function () {
      activeYear = yearSelect.value || "all";
      applyFilters();
    });
  }

  if (seriesSelect) {
    seriesSelect.addEventListener("change", function () {
      activeSeries = seriesSelect.value || "all";
      applyFilters();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      applyFilters({ skipUrlUpdate: !searchHydrated });
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey || !searchInput) {
      return;
    }

    const target = event.target;
    if (target instanceof Element && target.closest("input, textarea, select, [contenteditable='true']")) {
      return;
    }

    event.preventDefault();
    searchInput.focus();
  });

  window.addEventListener("storage", function (event) {
    if (event.key === "lang") {
      setLanguageFilter(uiLanguage());
      applyFilters();
    }
  });

  const observer = new MutationObserver(function () {
    if (!urlParams.has("lang")) {
      setLanguageFilter(uiLanguage());
    }
    applyFilters();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  syncControlsFromState();
  hydrateSearchIndex();
  applyFilters({ skipUrlUpdate: true });
});
