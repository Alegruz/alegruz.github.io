document.addEventListener("DOMContentLoaded", function () {
  const cards = Array.from(document.querySelectorAll(".post-card"));
  if (!cards.length) {
    return;
  }

  const searchInput = document.getElementById("post-search");
  const topicButtons = Array.from(document.querySelectorAll(".chip[data-topic]"));
  const emptyNotice = document.getElementById("feed-empty");

  let activeTopic = "all";

  function activeLanguage() {
    const lang = document.documentElement.getAttribute("lang");
    return lang === "ko" ? "ko" : "en";
  }

  function applyFilters() {
    const query = ((searchInput && searchInput.value) || "").trim().toLowerCase();
    const lang = activeLanguage();
    const isKorean = lang === "ko";

    if (searchInput) {
      searchInput.placeholder = isKorean
        ? searchInput.dataset.placeholderKo || "글 검색"
        : searchInput.dataset.placeholderEn || "Search posts";
      searchInput.setAttribute("aria-label", searchInput.placeholder);
    }

    let visibleCount = 0;
    cards.forEach((card) => {
      const matchesLang = card.dataset.lang === lang;
      const matchesTopic = activeTopic === "all" || card.dataset.topic === activeTopic;
      const title = card.dataset.title || "";
      const excerpt = (card.querySelector(".post-excerpt")?.textContent || "").toLowerCase();
      const matchesQuery = !query || title.includes(query) || excerpt.includes(query);

      const visible = matchesLang && matchesTopic && matchesQuery;
      card.hidden = !visible;
      if (visible) {
        visibleCount += 1;
      }
    });

    if (emptyNotice) {
      emptyNotice.hidden = visibleCount !== 0;
      emptyNotice.textContent = isKorean
        ? emptyNotice.dataset.msgKo || "현재 필터 조건에 맞는 글이 없습니다."
        : emptyNotice.dataset.msgEn || "No posts match the current filters.";
    }
  }

  topicButtons.forEach((button) => {
    button.addEventListener("click", function () {
      activeTopic = button.dataset.topic || "all";
      topicButtons.forEach((chip) => chip.classList.remove("active"));
      button.classList.add("active");
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

  const observer = new MutationObserver(function () {
    applyFilters();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  applyFilters();
});
