(() => {
  const gal = document.getElementById("gal");
  const lb = document.getElementById("lightbox");
  const stage = document.getElementById("lbStage");
  const cap = document.getElementById("lbCap");
  const close = document.getElementById("lbClose");

  // hover play videos in grid
  gal?.querySelectorAll("video").forEach((v) => {
    const card = v.closest(".gal-item");
    card?.addEventListener("pointerenter", () => v.play().catch(() => {}));
    card?.addEventListener("pointerleave", () => {
      v.pause();
      try { v.currentTime = 0; } catch { /* */ }
    });
  });

  const open = (src, type, title) => {
    if (!lb || !stage) return;
    stage.innerHTML = "";
    if (type === "video") {
      const v = document.createElement("video");
      v.src = src;
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      stage.appendChild(v);
    } else {
      const img = document.createElement("img");
      img.src = src;
      img.alt = title || "";
      stage.appendChild(img);
    }
    if (cap) cap.textContent = title || "";
    lb.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const hide = () => {
    if (!lb || !stage) return;
    stage.innerHTML = "";
    lb.hidden = true;
    document.body.style.overflow = "";
  };

  gal?.addEventListener("click", (e) => {
    const btn = e.target.closest(".gal-item");
    if (!btn) return;
    open(btn.dataset.src, btn.dataset.type, btn.querySelector("span")?.textContent);
  });
  close?.addEventListener("click", hide);
  lb?.addEventListener("click", (e) => {
    if (e.target === lb) hide();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hide();
  });
})();
