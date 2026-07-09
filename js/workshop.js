(() => {
  const canvas = document.getElementById("shopFx");
  const status = document.getElementById("shopStatus");
  const biao = document.getElementById("shopBiao");
  const steps = document.querySelectorAll("#shopSteps [data-step]");
  let step = 0;
  let parts = [];
  const msgs = [
    ["投料完成 · 需求进炉", "「那长相就是证据」——先看清楚打谁"],
    ["锻打中 · 策略成型", "「你就慢慢跟我处」——节奏对齐"],
    ["淬火中 · 设计定型", "「小树不倒我就不倒」——别慌"],
    ["开刃上线 · 欧了", "「论成败，人生豪迈；大不了从头再来」"],
  ];

  const ctx = canvas?.getContext("2d");
  let w = 0, h = 0;
  const resize = () => {
    if (!canvas || !ctx) return;
    const r = canvas.getBoundingClientRect();
    w = r.width;
    h = r.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const burst = (n = 30) => {
    for (let i = 0; i < n; i++) {
      parts.push({
        x: w * 0.5,
        y: h * 0.55,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 10 - 2,
        life: 1,
        c: step === 3 ? "#c8f542" : step === 2 ? "#7dd3fc" : "#ffd65a",
      });
    }
  };

  const loop = () => {
    if (!ctx) return;
    ctx.fillStyle = "rgba(10,10,12,0.25)";
    ctx.fillRect(0, 0, w, h);
    // furnace glow
    const g = ctx.createRadialGradient(w * 0.5, h * 0.7, 10, w * 0.5, h * 0.7, w * 0.35);
    g.addColorStop(0, `rgba(226,61,42,${0.25 + step * 0.1})`);
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // anvil
    ctx.fillStyle = "#2a2a30";
    ctx.fillRect(w * 0.35, h * 0.62, w * 0.3, h * 0.12);
    ctx.fillStyle = "#c8f542";
    ctx.fillRect(w * 0.42, h * 0.55, w * 0.16, h * 0.08);
    parts = parts.filter((p) => p.life > 0.02);
    for (const p of parts) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
      p.life *= 0.96;
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  };
  loop();

  const setStep = (s) => {
    step = s;
    steps.forEach((b) => b.classList.toggle("is-on", Number(b.dataset.step) === step));
    const m = msgs[step];
    if (status) status.textContent = m[0];
    if (biao) biao.textContent = m[1];
    burst(40 + step * 12);
    if (step === 3) {
      try { new Audio("assets/biao-2.mp3").play(); } catch { /* */ }
    } else if (step === 0) {
      try { new Audio("assets/biao-5.mp3").play(); } catch { /* */ }
    }
  };

  steps.forEach((b) => b.addEventListener("click", () => setStep(Number(b.dataset.step))));
  setStep(0);
})();
