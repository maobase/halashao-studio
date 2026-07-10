(() => {
  const canvas = document.getElementById("beatCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let running = false, t0 = 0, period = 900, combo = 0, score = 0, lastHit = 0;
  const comboEl = document.getElementById("beatCombo");
  const scoreEl = document.getElementById("beatScore");

  const loop = (now) => {
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = "#050506";
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.arc(cx, cy, 40, 0, Math.PI * 2);
    ctx.stroke();
    if (running) {
      const p = ((now - t0) % period) / period;
      const r = 40 + (1 - p) * 160;
      ctx.strokeStyle = p > 0.85 ? "#c8f542" : "#ffd65a";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = "#c8f542";
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fill();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  const hit = () => {
    if (!running) return;
    const now = performance.now();
    const p = ((now - t0) % period) / period;
    const err = Math.min(p, 1 - p);
    if (err < 0.12) {
      combo++;
      score += 10 + combo;
      if (combo % 4 === 0) {
        try { new Audio("assets/biao-2.mp3").play(); } catch { /* */ }
      } else if (combo % 7 === 0) {
        try { new Audio("assets/biao-18.mp3").play(); } catch { /* */ }
      }
    } else {
      combo = 0;
    }
    lastHit = now;
    if (comboEl) comboEl.textContent = String(combo);
    if (scoreEl) scoreEl.textContent = String(score);
  };

  document.getElementById("beatHit")?.addEventListener("click", hit);
  document.getElementById("beatStart")?.addEventListener("click", () => {
    running = true;
    t0 = performance.now();
    combo = 0;
    score = 0;
    if (comboEl) comboEl.textContent = "0";
    if (scoreEl) scoreEl.textContent = "0";
    try { new Audio("assets/biao-20.mp3").play(); } catch { /* */ }
  });
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      hit();
    }
  });
})();
