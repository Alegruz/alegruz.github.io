document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggle-language");
  const storageKey = "lang";
  const defaultLang = "en";
  const supported = new Set(["en", "ko"]);

  let currentLang = localStorage.getItem(storageKey) || defaultLang;
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
      currentLang = currentLang === "en" ? "ko" : "en";
      localStorage.setItem(storageKey, currentLang);
      applyLanguage(currentLang);
    });
  }

  applyLanguage(currentLang);
});
