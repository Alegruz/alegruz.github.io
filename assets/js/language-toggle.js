document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggle-language");
  const storageKey = "lang";
  const defaultLang = "en";
  const supported = new Set(["en", "ko"]);
  const pageLang = toggleButton?.dataset.pageLang;

  function readStoredLang() {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  }

  function storeLang(lang) {
    try {
      localStorage.setItem(storageKey, lang);
    } catch {
      // Keep language switching usable when storage is unavailable.
    }
  }

  let currentLang = supported.has(pageLang) ? pageLang : readStoredLang() || defaultLang;
  if (!supported.has(currentLang)) {
    currentLang = defaultLang;
  }

  function applyLanguage(lang) {
    document.documentElement.setAttribute("lang", lang);

    const localizedNodes = document.querySelectorAll("[data-lang]");
    localizedNodes.forEach((node) => {
      const nodeLang = node.getAttribute("data-lang");
      if (!nodeLang || !supported.has(nodeLang)) {
        return;
      }
      node.hidden = nodeLang !== lang;
    });

    if (toggleButton) {
      toggleButton.textContent =
        lang === "en" ? "Switch to Korean" : "Switch to English";
      toggleButton.setAttribute("aria-label", toggleButton.textContent);
    }
  }

  if (toggleButton) {
    toggleButton.addEventListener("click", function () {
      const nextLang = currentLang === "en" ? "ko" : "en";
      const translationUrl = nextLang === "en"
        ? toggleButton.dataset.translationEn
        : toggleButton.dataset.translationKo;

      storeLang(nextLang);
      if (translationUrl) {
        window.location.href = translationUrl;
        return;
      }

      currentLang = nextLang;
      applyLanguage(currentLang);
    });
  }

  applyLanguage(currentLang);
});
