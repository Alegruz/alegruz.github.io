document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("toggle-language");
    const posts = document.querySelectorAll(".post-item");
    
    let currentLang = localStorage.getItem("lang") || "en";
    
    function updatePosts() {
      posts.forEach(post => {
        post.style.display = post.dataset.lang === currentLang ? "block" : "none";
      });
      button.textContent = currentLang === "en" ? "Switch to Korean" : "Switch to English";
    }
  
    button.addEventListener("click", function () {
      currentLang = currentLang === "en" ? "ko" : "en";
      localStorage.setItem("lang", currentLang);
      updatePosts();
    });
  
    updatePosts();
  });
  