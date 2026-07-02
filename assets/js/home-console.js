document.addEventListener("DOMContentLoaded", function () {
  const cards = Array.from(document.querySelectorAll(".post-card"));
  if (!cards.length) {
    return;
  }

  const searchInput = document.getElementById("post-search");
  const topicButtons = Array.from(document.querySelectorAll(".chip[data-topic]"));
  const emptyNotice = document.getElementById("feed-empty");
  const visibleCount = document.getElementById("visible-count");

  let activeTopic = "all";

  function activeLanguage() {
    const lang = document.documentElement.getAttribute("lang");
    return lang === "ko" ? "ko" : "en";
  }

  function setSearchLanguage(lang) {
    if (!searchInput) {
      return;
    }

    const isKorean = lang === "ko";
    searchInput.placeholder = isKorean
      ? searchInput.dataset.placeholderKo || "글 검색"
      : searchInput.dataset.placeholderEn || "Search posts";
    searchInput.setAttribute("aria-label", searchInput.placeholder);
  }

  function applyFilters() {
    const query = ((searchInput && searchInput.value) || "").trim().toLowerCase();
    const lang = activeLanguage();

    setSearchLanguage(lang);

    let count = 0;
    cards.forEach((card) => {
      const matchesLang = card.dataset.lang === lang;
      const matchesTopic = activeTopic === "all" || card.dataset.topic === activeTopic;
      const title = card.dataset.title || "";
      const excerpt = (card.querySelector(".post-excerpt")?.textContent || "").toLowerCase();
      const matchesQuery = !query || title.includes(query) || excerpt.includes(query);
      const visible = matchesLang && matchesTopic && matchesQuery;

      card.hidden = !visible;
      if (visible) {
        count += 1;
      }
    });

    if (visibleCount) {
      visibleCount.textContent = String(count);
    }

    if (emptyNotice) {
      emptyNotice.hidden = count !== 0;
      emptyNotice.textContent = lang === "ko"
        ? emptyNotice.dataset.msgKo || "현재 필터 조건에 맞는 글이 없습니다."
        : emptyNotice.dataset.msgEn || "No posts match the current filters.";
    }
  }

  topicButtons.forEach((button) => {
    button.addEventListener("click", function () {
      activeTopic = button.dataset.topic || "all";
      topicButtons.forEach((chip) => {
        const active = chip === button;
        chip.classList.toggle("active", active);
        chip.setAttribute("aria-pressed", active ? "true" : "false");
      });
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  window.addEventListener("storage", function (event) {
    if (event.key === "lang") {
      applyFilters();
    }
  });

  const observer = new MutationObserver(applyFilters);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  applyFilters();
});
