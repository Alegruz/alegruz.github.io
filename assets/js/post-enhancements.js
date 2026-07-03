document.addEventListener("DOMContentLoaded", function () {
  const content = document.getElementById("post-content");
  const article = document.querySelector(".post");
  const isKorean = document.documentElement.getAttribute("lang") === "ko";
  const labels = isKorean
    ? {
        copied: "복사됨",
        collapse: "접기",
        copy: "복사",
        expand: "펼치기",
        failed: "실패",
        linkTo: "섹션 링크",
        sectionCopied: "복사됨",
        scroll: "스크롤",
        wrap: "줄바꿈",
        closeImage: "이미지 닫기"
      }
    : {
        copied: "Copied",
        collapse: "Collapse",
        copy: "Copy",
        expand: "Expand",
        failed: "Failed",
        linkTo: "Link to",
        sectionCopied: "Copied",
        scroll: "Scroll",
        wrap: "Wrap",
        closeImage: "Close image"
      };
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

  function headingLabel(heading) {
    const clone = heading.cloneNode(true);
    clone.querySelectorAll(".heading-anchor").forEach((anchor) => anchor.remove());
    return clone.textContent.trim();
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

  function prepareHeadings() {
    const headings = Array.from(content.querySelectorAll("h2, h3"));
    const usedIds = new Set();

    headings.forEach((heading) => {
      if (!heading.id) {
        const base = slugify(headingLabel(heading));
        let id = base;
        let index = 2;
        while (usedIds.has(id) || document.getElementById(id)) {
          id = `${base}-${index}`;
          index += 1;
        }
        heading.id = id;
      }
      usedIds.add(heading.id);

      if (!heading.querySelector(".heading-anchor")) {
        const anchor = document.createElement("a");
        anchor.className = "heading-anchor";
        anchor.href = `#${heading.id}`;
        anchor.setAttribute("aria-label", `${labels.linkTo} ${headingLabel(heading)}`);
        anchor.textContent = "#";
        anchor.addEventListener("click", async (event) => {
          event.preventDefault();
          const nextUrl = `${window.location.origin}${window.location.pathname}#${heading.id}`;
          window.history.replaceState(null, "", `#${heading.id}`);
          try {
            await navigator.clipboard.writeText(nextUrl);
            anchor.classList.add("copied");
            anchor.textContent = labels.sectionCopied;
            window.setTimeout(() => {
              anchor.classList.remove("copied");
              anchor.textContent = "#";
            }, 1200);
          } catch {
            window.location.hash = heading.id;
          }
        });
        heading.appendChild(anchor);
      }
    });

    return headings;
  }

  function buildTableOfContents() {
    const toc = document.getElementById("post-toc");
    const list = document.getElementById("post-toc-list");
    const headings = prepareHeadings();

    if (!toc || !list || headings.length < 3) {
      return;
    }

    headings.forEach((heading) => {
      const item = document.createElement("li");
      item.className = heading.tagName === "H3" ? "toc-h3" : "toc-h2";

      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.dataset.headingId = heading.id;
      link.textContent = headingLabel(heading);
      item.appendChild(link);
      list.appendChild(item);
    });

    toc.hidden = false;
    toc.closest(".post-layout")?.classList.add("has-toc");

    const links = Array.from(list.querySelectorAll("a"));
    let ticking = false;

    function updateActiveHeading() {
      ticking = false;
      const anchorOffset = 112;
      const activeHeading = headings.reduce((active, heading) => {
        return heading.getBoundingClientRect().top <= anchorOffset ? heading : active;
      }, headings[0]);

      links.forEach((link) => {
        const active = link.dataset.headingId === activeHeading.id;
        link.classList.toggle("active", active);
        link.parentElement?.classList.toggle("active", active);
      });
    }

    function scheduleActiveHeadingUpdate() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateActiveHeading);
      }
    }

    window.addEventListener("scroll", scheduleActiveHeadingUpdate, { passive: true });
    window.addEventListener("resize", scheduleActiveHeadingUpdate);
    updateActiveHeading();
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

      const actions = document.createElement("div");
      actions.className = "code-actions";

      const wrapButton = document.createElement("button");
      wrapButton.type = "button";
      wrapButton.textContent = labels.wrap;
      wrapButton.setAttribute("aria-pressed", "false");
      wrapButton.addEventListener("click", () => {
        const wrapped = !wrapper.classList.contains("code-wrapped");
        wrapper.classList.toggle("code-wrapped", wrapped);
        wrapButton.textContent = wrapped ? labels.scroll : labels.wrap;
        wrapButton.setAttribute("aria-pressed", wrapped ? "true" : "false");
      });
      actions.appendChild(wrapButton);

      const copyButton = document.createElement("button");
      copyButton.type = "button";
      copyButton.textContent = labels.copy;
      copyButton.addEventListener("click", async () => {
        const text = code?.textContent || pre.textContent || "";
        try {
          await navigator.clipboard.writeText(text);
          copyButton.textContent = labels.copied;
          window.setTimeout(() => { copyButton.textContent = labels.copy; }, 1200);
        } catch {
          copyButton.textContent = labels.failed;
          window.setTimeout(() => { copyButton.textContent = labels.copy; }, 1200);
        }
      });
      actions.appendChild(copyButton);

      const lineCount = (code?.textContent || pre.textContent || "").split("\n").length;
      if (lineCount > 44) {
        const expandButton = document.createElement("button");
        wrapper.classList.add("code-collapsed");
        expandButton.type = "button";
        expandButton.textContent = labels.expand;
        expandButton.setAttribute("aria-expanded", "false");
        expandButton.addEventListener("click", () => {
          const expanded = wrapper.classList.toggle("code-expanded");
          wrapper.classList.toggle("code-collapsed", !expanded);
          expandButton.textContent = expanded ? labels.collapse : labels.expand;
          expandButton.setAttribute("aria-expanded", expanded ? "true" : "false");
        });
        actions.appendChild(expandButton);
      }

      toolbar.appendChild(actions);

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
      <button type="button" class="image-lightbox-close" aria-label="${labels.closeImage}">${labels.closeImage}</button>
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

  function setupReadingProgress() {
    const progress = document.querySelector("#reading-progress span");
    if (!article || !progress) {
      return;
    }

    let ticking = false;

    function updateProgress() {
      ticking = false;
      const start = article.offsetTop;
      const end = content.offsetTop + content.scrollHeight - window.innerHeight;
      const distance = Math.max(1, end - start);
      const progressValue = Math.min(1, Math.max(0, (window.scrollY - start) / distance));
      progress.style.transform = `scaleX(${progressValue})`;
    }

    function scheduleProgressUpdate() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateProgress);
      }
    }

    window.addEventListener("scroll", scheduleProgressUpdate, { passive: true });
    window.addEventListener("resize", scheduleProgressUpdate);
    updateProgress();
  }

  function enhanceExternalLinks() {
    const links = Array.from(content.querySelectorAll("a[href]"));
    links.forEach((link) => {
      let url;
      try {
        url = new URL(link.href, window.location.href);
      } catch {
        return;
      }

      if (!["http:", "https:"].includes(url.protocol) || url.origin === window.location.origin) {
        return;
      }

      const rel = new Set((link.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
      rel.add("noopener");
      rel.add("noreferrer");
      link.setAttribute("rel", Array.from(rel).join(" "));
      link.target = "_blank";
      link.classList.add("external-link");
    });
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
  setupReadingProgress();
  enhanceExternalLinks();
  enhanceImages();
  enhanceCodeBlocks();
  buildTableOfContents();
  setupImageLightbox();
  loadMathJaxIfNeeded();
});
