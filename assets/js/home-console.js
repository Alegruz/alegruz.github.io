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

  let activeTopic = "all";
  let activeLanguageFilter = uiLanguage();
  let activeYear = "all";
  let activeSeries = "all";

  function uiLanguage() {
    return document.documentElement.getAttribute("lang") === "ko" ? "ko" : "en";
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
    activeLanguageFilter = lang;
    const activeButton = languageButtons.find((button) => button.dataset.langFilter === lang);
    if (activeButton) {
      setActiveButton(languageButtons, activeButton);
    }
  }

  function getSearchText(row) {
    return [
      row.dataset.title || "",
      row.dataset.summary || "",
      row.dataset.searchText || ""
    ].join(" ");
  }

  function applyFilters() {
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
        applyFilters();
      })
      .catch(() => {});
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
    searchInput.addEventListener("input", applyFilters);
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
    setLanguageFilter(uiLanguage());
    applyFilters();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  setLanguageFilter(uiLanguage());
  hydrateSearchIndex();
  applyFilters();
});
