(() => {
  const canvas = document.getElementById("tunnelCanvas");
  const hud = document.getElementById("tunnelHud");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, z = 0, speed = 1.2, rings = [];

  const resize = () => {
    const parent = canvas.parentElement;
    w = parent.clientWidth;
    h = Math.max(480, window.innerHeight * 0.7);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  for (let i = 0; i < 28; i++) rings.push(i / 28);

  const loop = () => {
    z += 0.004 * speed;
    ctx.fillStyle = "#050506";
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    for (let i = 0; i < rings.length; i++) {
      let p = (rings[i] + z) % 1;
      const scale = 0.05 + p * p * 1.6;
      const r = Math.min(w, h) * 0.08 * scale * 8;
      const alpha = Math.min(1, p * 1.4);
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.55, 0, 0, Math.PI * 2);
      ctx.strokeStyle = i % 3 === 0
        ? `rgba(200,245,66,${alpha})`
        : i % 3 === 1
          ? `rgba(255,214,90,${alpha * 0.9})`
          : `rgba(226,61,42,${alpha * 0.8})`;
      ctx.lineWidth = 2 + p * 4;
      ctx.stroke();
    }
    // center text pulse
    ctx.fillStyle = `rgba(200,245,66,${0.35 + Math.sin(z * 20) * 0.2})`;
    ctx.font = `900 ${18 + speed * 4}px Noto Sans SC`;
    ctx.textAlign = "center";
    ctx.fillText("硬仗", cx, cy + 8);
    if (hud) hud.textContent = `速度 ${speed.toFixed(1)} · ${speed > 2 ? "痛快" : "欧了"}`;
    requestAnimationFrame(loop);
  };
  loop();

  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    speed = Math.min(4, Math.max(0.4, speed + (e.deltaY > 0 ? -0.15 : 0.15)));
  }, { passive: false });

  let dragging = false, lastY = 0;
  canvas.addEventListener("pointerdown", (e) => { dragging = true; lastY = e.clientY; });
  window.addEventListener("pointerup", () => { dragging = false; });
  window.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    speed = Math.min(4, Math.max(0.4, speed + (lastY - e.clientY) * 0.01));
    lastY = e.clientY;
  });
})();
