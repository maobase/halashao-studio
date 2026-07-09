(() => {
  const fine = window.matchMedia("(pointer: fine)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("[data-work]").forEach((card) => {
    const vid = card.querySelector("video");
    if (!vid) return;
    const start = () => {
      if (reduce) return;
      card.classList.add("is-hot");
      vid.play().catch(() => {});
    };
    const stop = () => {
      card.classList.remove("is-hot");
      vid.pause();
      try { vid.currentTime = 0; } catch { /* */ }
    };
    if (fine) {
      card.addEventListener("pointerenter", start);
      card.addEventListener("pointerleave", stop);
    } else {
      card.addEventListener("click", () => {
        if (card.classList.contains("is-hot")) stop();
        else {
          document.querySelectorAll("[data-work].is-hot").forEach((c) => {
            c.classList.remove("is-hot");
            c.querySelector("video")?.pause();
          });
          start();
        }
      });
    }
  });
})();
