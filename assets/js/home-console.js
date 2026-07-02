document.addEventListener("DOMContentLoaded", function () {
  const rows = Array.from(document.querySelectorAll(".post-row"));
  if (!rows.length) {
    return;
  }

  const searchInput = document.getElementById("post-search");
  const topicButtons = Array.from(document.querySelectorAll(".chip[data-topic]"));
  const languageButtons = Array.from(document.querySelectorAll(".chip[data-lang-filter]"));
  const yearGroups = Array.from(document.querySelectorAll("[data-year-group]"));
  const emptyNotice = document.getElementById("feed-empty");
  const visibleCount = document.getElementById("visible-count");

  let activeTopic = "all";
  let activeLanguageFilter = uiLanguage();

  function uiLanguage() {
    return document.documentElement.getAttribute("lang") === "ko" ? "ko" : "en";
  }

  function updateSearchLabel() {
    if (!searchInput) {
      return;
    }

    const isKorean = uiLanguage() === "ko";
    searchInput.placeholder = isKorean
      ? searchInput.dataset.placeholderKo || "글 검색"
      : searchInput.dataset.placeholderEn || "Search posts";
    searchInput.setAttribute("aria-label", searchInput.placeholder);
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

  function applyFilters() {
    const query = ((searchInput && searchInput.value) || "").trim().toLowerCase();
    let count = 0;

    updateSearchLabel();

    rows.forEach((row) => {
      const rowLanguage = row.dataset.postLang || "en";
      const rowTopic = row.dataset.topic || "engine";
      const title = row.dataset.title || "";
      const matchesTopic = activeTopic === "all" || rowTopic === activeTopic;
      const matchesLanguage = activeLanguageFilter === "all" || rowLanguage === activeLanguageFilter;
      const matchesQuery = !query || title.includes(query);
      const visible = matchesTopic && matchesLanguage && matchesQuery;

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

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

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
  applyFilters();
});
