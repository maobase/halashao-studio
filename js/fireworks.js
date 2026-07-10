(() => {
  const canvas = document.getElementById("fwCanvas");
  const stage = document.getElementById("fwStage");
  if (!canvas || !stage) return;
  const ctx = canvas.getContext("2d");
  const words = ["欧了", "硬仗", "不倒", "痛快", "开干", "刃"];
  let w = 0, h = 0, sparks = [];

  const resize = () => {
    const r = stage.getBoundingClientRect();
    w = r.width;
    h = Math.max(520, r.height);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const boom = (x, y) => {
    const c = ["#c8f542", "#ffd65a", "#e23d2a", "#7dd3fc", "#fff"][Math.floor(Math.random() * 5)];
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      const sp = 2 + Math.random() * 5;
      sparks.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 1, c, text: Math.random() > 0.85 ? words[Math.floor(Math.random() * words.length)] : null,
      });
    }
  };

  const loop = () => {
    ctx.fillStyle = "rgba(5,5,6,0.2)";
    ctx.fillRect(0, 0, w, h);
    sparks = sparks.filter((p) => p.life > 0.02);
    for (const p of sparks) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;
      p.life *= 0.97;
      ctx.globalAlpha = p.life;
      if (p.text) {
        ctx.fillStyle = p.c;
        ctx.font = "900 16px Noto Sans SC";
        ctx.fillText(p.text, p.x, p.y);
      } else {
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  };
  loop();

  stage.addEventListener("pointerdown", (e) => {
    const r = stage.getBoundingClientRect();
    boom(e.clientX - r.left, e.clientY - r.top);
    if (Math.random() > 0.75) {
      try { new Audio("assets/biao-2.mp3").play(); } catch { /* */ }
    }
  });
  document.getElementById("fwSalvo")?.addEventListener("click", () => {
    for (let i = 0; i < 8; i++) boom(Math.random() * w, Math.random() * h * 0.6);
    try { new Audio("assets/biao-20.mp3").play(); } catch { /* */ }
  });
})();
