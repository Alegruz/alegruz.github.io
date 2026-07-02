document.addEventListener("DOMContentLoaded", function () {
  const content = document.getElementById("post-content");
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

      if (!isPlainImageParagraph || image.closest("figure")) {
        return;
      }

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
        let base = slugify(heading.textContent);
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
      link.textContent = heading.textContent;
      item.appendChild(link);
      list.appendChild(item);
    });

    toc.hidden = false;
    toc.closest(".post-layout")?.classList.add("has-toc");
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

  enhanceImages();
  buildTableOfContents();
  loadMathJaxIfNeeded();
});
