(() => {
  const canvas = document.getElementById("gravCanvas");
  const stage = document.getElementById("gravStage");
  if (!canvas || !stage) return;
  const ctx = canvas.getContext("2d");
  const words = ["欧了", "硬仗", "刃", "土", "酷", "少", "锻", "火", "不倒", "开干"];
  let w = 0, h = 0, gx = 0, gy = 0.35, parts = [];

  const resize = () => {
    const r = stage.getBoundingClientRect();
    w = r.width;
    h = Math.max(480, r.height);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const drop = (x, y, n = 8) => {
    for (let i = 0; i < n; i++) {
      parts.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * -2,
        text: words[Math.floor(Math.random() * words.length)],
        s: 16 + Math.random() * 28,
        c: Math.random() > 0.5 ? "#c8f542" : Math.random() > 0.5 ? "#ffd65a" : "#e23d2a",
      });
    }
  };

  const loop = () => {
    ctx.fillStyle = "rgba(5,5,6,0.2)";
    ctx.fillRect(0, 0, w, h);
    for (const p of parts) {
      p.vx += gx;
      p.vy += gy;
      p.x += p.vx;
      p.y += p.vy;
      if (p.y > h - 10) {
        p.y = h - 10;
        p.vy *= -0.45;
        p.vx *= 0.9;
      }
      if (p.x < 0 || p.x > w) p.vx *= -0.8;
      ctx.fillStyle = p.c;
      ctx.font = `900 ${p.s}px Noto Sans SC`;
      ctx.fillText(p.text, p.x, p.y);
    }
    if (parts.length > 120) parts = parts.slice(-120);
    requestAnimationFrame(loop);
  };
  loop();

  stage.addEventListener("pointerdown", (e) => {
    const r = stage.getBoundingClientRect();
    drop(e.clientX - r.left, e.clientY - r.top, 10);
  });
  stage.addEventListener("pointermove", (e) => {
    if (e.buttons !== 1) return;
    const r = stage.getBoundingClientRect();
    const px = (e.clientX - r.left) / w - 0.5;
    const py = (e.clientY - r.top) / h - 0.5;
    gx = px * 0.4;
    gy = 0.2 + py * 0.5;
  });

  document.getElementById("gravDrop")?.addEventListener("click", () => {
    drop(w / 2, 40, 20);
    try { new Audio("assets/biao-18.mp3").play(); } catch { /* */ }
  });
  document.getElementById("gravClear")?.addEventListener("click", () => { parts = []; });
})();
