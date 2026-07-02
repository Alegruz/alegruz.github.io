document.addEventListener("DOMContentLoaded", function () {
  const content = document.getElementById("post-content");
  const article = document.querySelector(".post");
  if (!content) {
    return;
  }

  function slugify(text) {
    return text
      .trim()
      .toLowerCase()
      .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      || "section";
  }

  function enhanceImages() {
    const images = Array.from(content.querySelectorAll("img"));
    images.forEach((image) => {
      image.loading = image.loading || "lazy";
      image.decoding = image.decoding || "async";

      const parent = image.parentElement;
      const isPlainImageParagraph = parent
        && parent.tagName === "P"
        && parent.children.length === 1
        && parent.textContent.trim() === "";

      if (isPlainImageParagraph && !image.closest("figure")) {
        const figure = document.createElement("figure");
        figure.className = "post-figure";
        parent.replaceWith(figure);
        figure.appendChild(image);

        const captionText = image.getAttribute("alt");
        if (captionText) {
          const caption = document.createElement("figcaption");
          caption.textContent = captionText;
          figure.appendChild(caption);
        }
      }

      const markWide = () => {
        const figure = image.closest(".post-figure");
        if (figure && image.naturalWidth >= 1000) {
          figure.classList.add("figure-wide");
        }
      };

      if (image.complete) {
        markWide();
      } else {
        image.addEventListener("load", markWide, { once: true });
      }
    });
  }

  function buildTableOfContents() {
    const toc = document.getElementById("post-toc");
    const list = document.getElementById("post-toc-list");
    const headings = Array.from(content.querySelectorAll("h2, h3"));

    if (!toc || !list || headings.length < 3) {
      return;
    }

    const usedIds = new Set();
    headings.forEach((heading) => {
      if (!heading.id) {
        const base = slugify(heading.textContent);
        let id = base;
        let index = 2;
        while (usedIds.has(id) || document.getElementById(id)) {
          id = `${base}-${index}`;
          index += 1;
        }
        heading.id = id;
      }
      usedIds.add(heading.id);

      const item = document.createElement("li");
      item.className = heading.tagName === "H3" ? "toc-h3" : "toc-h2";

      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.dataset.headingId = heading.id;
      link.textContent = heading.textContent;
      item.appendChild(link);
      list.appendChild(item);
    });

    toc.hidden = false;
    toc.closest(".post-layout")?.classList.add("has-toc");

    const links = Array.from(list.querySelectorAll("a"));
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (!visible) {
          return;
        }

        links.forEach((link) => {
          link.classList.toggle("active", link.dataset.headingId === visible.target.id);
        });
      }, { rootMargin: "-15% 0px -70% 0px", threshold: 0.01 });

      headings.forEach((heading) => observer.observe(heading));
    }
  }

  function enhanceCodeBlocks() {
    const blocks = Array.from(content.querySelectorAll("pre"));
    blocks.forEach((pre) => {
      if (pre.closest(".code-block")) {
        return;
      }

      const code = pre.querySelector("code");
      const className = code?.className || pre.className || "";
      const languageMatch = className.match(/language-([a-z0-9_+-]+)/i);
      const language = languageMatch ? languageMatch[1] : "code";
      const wrapper = document.createElement("div");
      wrapper.className = "code-block";

      const toolbar = document.createElement("div");
      toolbar.className = "code-toolbar";

      const label = document.createElement("span");
      label.textContent = language;
      toolbar.appendChild(label);

      const copyButton = document.createElement("button");
      copyButton.type = "button";
      copyButton.textContent = "Copy";
      copyButton.addEventListener("click", async () => {
        const text = code?.textContent || pre.textContent || "";
        try {
          await navigator.clipboard.writeText(text);
          copyButton.textContent = "Copied";
          window.setTimeout(() => { copyButton.textContent = "Copy"; }, 1200);
        } catch {
          copyButton.textContent = "Failed";
          window.setTimeout(() => { copyButton.textContent = "Copy"; }, 1200);
        }
      });
      toolbar.appendChild(copyButton);

      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(toolbar);
      wrapper.appendChild(pre);
    });
  }

  function setupImageLightbox() {
    const images = Array.from(content.querySelectorAll("img"));
    if (!images.length) {
      return;
    }

    const lightbox = document.createElement("div");
    lightbox.className = "image-lightbox";
    lightbox.hidden = true;
    lightbox.innerHTML = `
      <button type="button" class="image-lightbox-close" aria-label="Close image">Close</button>
      <img alt="">
      <p></p>
    `;
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector("img");
    const lightboxCaption = lightbox.querySelector("p");
    const closeButton = lightbox.querySelector("button");

    function close() {
      lightbox.hidden = true;
      document.body.classList.remove("lightbox-open");
    }

    function open(image) {
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt || "";
      lightboxCaption.textContent = image.alt || "";
      lightboxCaption.hidden = !image.alt;
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      closeButton.focus();
    }

    images.forEach((image) => {
      image.classList.add("zoomable-image");
      image.tabIndex = 0;
      image.addEventListener("click", (event) => {
        if (image.closest("a")) {
          event.preventDefault();
        }
        open(image);
      });
      image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open(image);
        }
      });
    });

    closeButton.addEventListener("click", close);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        close();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !lightbox.hidden) {
        close();
      }
    });
  }

  function setupReaderControls() {
    const buttons = Array.from(document.querySelectorAll("[data-reader-width]"));
    if (!article || !buttons.length) {
      return;
    }

    function readStoredMode() {
      try {
        return localStorage.getItem("reader-width");
      } catch {
        return null;
      }
    }

    function storeMode(mode) {
      try {
        localStorage.setItem("reader-width", mode);
      } catch {
        // Keep the control functional even when storage is disabled.
      }
    }

    function setMode(mode) {
      const normalized = ["normal", "wide", "full"].includes(mode) ? mode : "normal";
      article.classList.toggle("reader-wide", normalized === "wide");
      article.classList.toggle("reader-full", normalized === "full");
      buttons.forEach((button) => {
        const active = button.dataset.readerWidth === normalized;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });
      storeMode(normalized);
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => setMode(button.dataset.readerWidth));
    });

    setMode(readStoredMode() || "normal");
  }

  function loadMathJaxIfNeeded() {
    const text = content.textContent || "";
    const hasMath = /\$\$|\\\(|\\\[|\\begin\{/.test(text);
    if (!hasMath) {
      return;
    }

    window.MathJax = {
      tex: {
        inlineMath: [["$", "$"], ["\\(", "\\)"]]
      },
      svg: {
        fontCache: "global"
      }
    };

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
    script.defer = true;
    document.head.appendChild(script);
  }

  setupReaderControls();
  enhanceImages();
  enhanceCodeBlocks();
  buildTableOfContents();
  setupImageLightbox();
  loadMathJaxIfNeeded();
});
