(() => {
  const vid = document.getElementById("vhsVid");
  const canvas = document.getElementById("vhsCanvas");
  const dirt = document.getElementById("vhsDirt");
  if (!vid || !canvas) return;
  const ctx = canvas.getContext("2d");

  const resize = () => {
    const r = vid.parentElement.getBoundingClientRect();
    canvas.width = r.width;
    canvas.height = r.height;
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const draw = () => {
    const w = canvas.width, h = canvas.height;
    if (vid.readyState >= 2) ctx.drawImage(vid, 0, 0, w, h);
    const d = Number(dirt?.value || 50) / 100;
    // scanlines
    ctx.fillStyle = `rgba(0,0,0,${0.12 + d * 0.15})`;
    for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1);
    // noise
    if (d > 0.1) {
      const n = (20 + d * 40) | 0;
      for (let i = 0; i < n; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.08})`;
        ctx.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 20, 1);
      }
    }
    // rgb shift
    if (d > 0.2) {
      ctx.globalCompositeOperation = "screen";
      ctx.drawImage(canvas, 1 + d * 2, 0);
      ctx.globalCompositeOperation = "source-over";
    }
    // vignette
    const g = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.7);
    g.addColorStop(0, "transparent");
    g.addColorStop(1, `rgba(0,0,0,${0.35 + d * 0.35})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    requestAnimationFrame(draw);
  };
  vid.play().catch(() => {});
  draw();

  document.querySelectorAll(".vhs-controls [data-src]").forEach((b) => {
    b.addEventListener("click", () => {
      document.querySelectorAll(".vhs-controls [data-src]").forEach((x) => x.classList.remove("is-on"));
      b.classList.add("is-on");
      vid.src = b.dataset.src;
      vid.play().catch(() => {});
    });
  });
})();
