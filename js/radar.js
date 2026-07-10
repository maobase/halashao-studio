(() => {
  const canvas = document.getElementById("radarCanvas");
  const tip = document.getElementById("radarTip");
  const go = document.getElementById("radarGo");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const mods = (window.HALASHAO?.modules || []).slice(0, 16);
  const blips = mods.map((m, i) => {
    const a = (i / Math.max(1, mods.length)) * Math.PI * 2;
    const r = 0.35 + (i % 5) * 0.08;
    return { a, r, name: m[0], href: m[1] };
  });
  let ang = 0, locked = blips[0] || { name: "地图", href: "os.html" };

  const loop = () => {
    const w = canvas.width, h = canvas.height, cx = w / 2, cy = h / 2;
    ctx.fillStyle = "#050806";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(200,245,66,0.2)";
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, (w / 2) * (i / 4) * 0.9, 0, Math.PI * 2);
      ctx.stroke();
    }
    // sweep
    ang += 0.02;
    const grad = ctx.createConicalGradient?.(cx, cy, ang);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(ang);
    const g = ctx.createLinearGradient(0, 0, w / 2, 0);
    g.addColorStop(0, "rgba(200,245,66,0.35)");
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, w * 0.45, -0.4, 0.05);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    for (const b of blips) {
      const x = cx + Math.cos(b.a) * b.r * w * 0.42;
      const y = cy + Math.sin(b.a) * b.r * h * 0.42;
      const d = Math.abs(((b.a - ang + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      const hot = d < 0.25;
      ctx.fillStyle = hot ? "#c8f542" : "rgba(200,245,66,0.35)";
      ctx.beginPath();
      ctx.arc(x, y, hot ? 5 : 3, 0, Math.PI * 2);
      ctx.fill();
      if (hot) locked = b;
    }
    if (tip) tip.textContent = `锁定：${locked.name}`;
    if (go) {
      go.href = locked.href;
      go.textContent = `进入 · ${locked.name}`;
    }
    requestAnimationFrame(loop);
  };
  loop();

  canvas.addEventListener("click", () => {
    if (locked?.href) location.href = locked.href;
  });
})();
