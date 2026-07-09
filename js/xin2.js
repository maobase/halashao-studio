(() => {
  // autoplay feed videos when visible
  const vids = document.querySelectorAll(".feed-media video");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.play().catch(() => {});
          else e.target.pause();
        });
      },
      { threshold: 0.45 }
    );
    vids.forEach((v) => io.observe(v));
  }

  document.querySelectorAll("[data-like]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const b = btn.querySelector("b");
      let n = Number(b?.textContent || 0);
      if (btn.classList.contains("is-on")) {
        btn.classList.remove("is-on");
        if (b) b.textContent = String(Math.max(0, n - 1));
      } else {
        btn.classList.add("is-on");
        if (b) b.textContent = String(n + 1 + Math.floor(Math.random() * 3));
      }
    });
  });

  document.querySelectorAll("[data-collect]").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("is-on");
      btn.textContent = btn.classList.contains("is-on") ? "已藏" : "藏";
    });
  });
})();
