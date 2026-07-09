(() => {
  const canvas = document.getElementById("stormCanvas");
  const stage = document.getElementById("stormStage");
  if (!canvas || !stage) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const words = [
    "欧了", "硬仗", "小树不倒", "少即是刃", "土酷", "哈拉少",
    "从头再来", "豆角", "家人们", "主打", "锋利", "记忆",
  ];
  let w = 0, h = 0, parts = [], mx = 0, my = 0;

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

  const spawn = (x, y, n = 1, boom = false) => {
    for (let i = 0; i < n; i++) {
      parts.push({
        x, y,
        vx: (Math.random() - 0.5) * (boom ? 14 : 3),
        vy: (Math.random() - 0.5) * (boom ? 14 : 3) - (boom ? 2 : 0),
        life: 1,
        text: words[Math.floor(Math.random() * words.length)],
        s: boom ? 18 + Math.random() * 28 : 12 + Math.random() * 16,
        c: Math.random() > 0.5 ? "#c8f542" : Math.random() > 0.5 ? "#ffd65a" : "#e23d2a",
      });
    }
  };

  stage.addEventListener("pointermove", (e) => {
    const r = stage.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
    if (!reduce && Math.random() > 0.4) spawn(mx, my, 1);
  });

  document.getElementById("stormBoom")?.addEventListener("click", () => {
    for (let i = 0; i < 12; i++) spawn(Math.random() * w, Math.random() * h, 8, true);
  });
  document.getElementById("stormClear")?.addEventListener("click", () => { parts = []; });
  document.getElementById("stormVoice")?.addEventListener("click", () => {
    const clips = ["assets/biao-1.mp3", "assets/biao-2.mp3", "assets/biao-11.mp3", "assets/biao-12.mp3"];
    try { new Audio(clips[Math.floor(Math.random() * clips.length)]).play(); } catch { /* */ }
    spawn(w / 2, h / 2, 30, true);
  });

  const loop = () => {
    ctx.fillStyle = "rgba(8,8,10,0.2)";
    ctx.fillRect(0, 0, w, h);
    parts = parts.filter((p) => p.life > 0.03);
    for (const p of parts) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.life *= 0.985;
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.c;
      ctx.font = `900 ${p.s}px "Noto Sans SC", sans-serif`;
      ctx.fillText(p.text, p.x, p.y);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  };
  loop();
})();
