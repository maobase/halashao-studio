(() => {
  const canvas = document.getElementById("matrixCanvas");
  const stage = canvas?.parentElement;
  if (!canvas || !stage) return;
  const ctx = canvas.getContext("2d");
  const glyphs = "哈拉少刃锻欧了硬仗土酷小树不倒ABCDEFG0123456789";
  let w = 0, h = 0, cols = [], font = 16, color = "#c8f542";

  const resize = () => {
    const r = stage.getBoundingClientRect();
    w = r.width;
    h = Math.max(480, window.innerHeight * 0.7);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.floor(w / font);
    cols = Array.from({ length: n }, () => Math.random() * h / font);
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const loop = () => {
    ctx.fillStyle = "rgba(5,5,6,0.12)";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = color;
    ctx.font = `700 ${font}px "Noto Sans SC", monospace`;
    for (let i = 0; i < cols.length; i++) {
      const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
      const x = i * font;
      const y = cols[i] * font;
      ctx.fillText(ch, x, y);
      if (y > h && Math.random() > 0.975) cols[i] = 0;
      cols[i] += 0.65 + Math.random() * 0.4;
    }
    requestAnimationFrame(loop);
  };
  loop();

  const boom = (x, y) => {
    ctx.fillStyle = "#ffd65a";
    ctx.font = `900 28px "Noto Sans SC"`;
    const words = ["欧了", "硬仗", "不倒", "开干"];
    ctx.fillText(words[Math.floor(Math.random() * words.length)], x - 20, y);
  };

  canvas.addEventListener("pointerdown", (e) => {
    const r = canvas.getBoundingClientRect();
    boom(e.clientX - r.left, e.clientY - r.top);
    try { new Audio("assets/biao-1.mp3").play(); } catch { /* */ }
  });

  document.getElementById("matrixBoom")?.addEventListener("click", () => {
    for (let i = 0; i < cols.length; i++) cols[i] = Math.random() * 5;
    try { new Audio("assets/biao-5.mp3").play(); } catch { /* */ }
  });
  const colors = ["#c8f542", "#ffd65a", "#e23d2a", "#7dd3fc"];
  let ci = 0;
  document.getElementById("matrixColor")?.addEventListener("click", () => {
    ci = (ci + 1) % colors.length;
    color = colors[ci];
  });
})();
