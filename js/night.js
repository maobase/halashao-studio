(() => {
  const canvas = document.getElementById("nightCanvas");
  const sub = document.getElementById("nightSub");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w = 0, h = 0, t = 0, flash = 0;
  const balls = Array.from({ length: 18 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: 40 + Math.random() * 120,
    vx: (Math.random() - 0.5) * 0.0015,
    vy: (Math.random() - 0.5) * 0.0015,
    c: Math.random() > 0.5 ? "200,245,66" : Math.random() > 0.5 ? "255,214,90" : "226,61,42",
  }));

  const lines = [
    "小树不倒我就不倒",
    "欧了",
    "本市著名硬仗主打",
    "少即是刃",
    "大不了从头再来",
  ];

  const resize = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const loop = () => {
    t += 1;
    ctx.fillStyle = flash > 0 ? `rgba(255,255,255,${flash})` : "#050506";
    if (flash > 0) flash *= 0.85;
    ctx.fillRect(0, 0, w, h);
    for (const b of balls) {
      if (!reduce) {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < 0 || b.x > 1) b.vx *= -1;
        if (b.y < 0 || b.y > 1) b.vy *= -1;
      }
      const g = ctx.createRadialGradient(b.x * w, b.y * h, 0, b.x * w, b.y * h, b.r);
      g.addColorStop(0, `rgba(${b.c},0.45)`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x * w, b.y * h, b.r, 0, Math.PI * 2);
      ctx.fill();
    }
    // scanlines
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 1);
    requestAnimationFrame(loop);
  };
  loop();

  document.getElementById("nightBoom")?.addEventListener("click", () => {
    flash = 0.65;
    if (sub) sub.textContent = lines[Math.floor(Math.random() * lines.length)];
  });
  document.getElementById("nightBiao")?.addEventListener("click", () => {
    const clips = ["assets/biao-1.mp3", "assets/biao-2.mp3", "assets/biao-5.mp3", "assets/biao-6.mp3"];
    const i = Math.floor(Math.random() * clips.length);
    try { new Audio(clips[i]).play(); } catch { /* */ }
    if (sub) sub.textContent = lines[i % lines.length];
    flash = 0.35;
  });
})();
