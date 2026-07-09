(() => {
  const canvas = document.getElementById("glitchCanvas");
  const srcSel = document.getElementById("glitchSrc");
  const amt = document.getElementById("glitchAmt");
  const rgb = document.getElementById("glitchRGB");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.crossOrigin = "anonymous";

  const draw = () => {
    if (!img.complete) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    const a = Number(amt?.value || 0);
    const r = Number(rgb?.value || 0);
    if (a <= 0 && r <= 0) return;

    // slice glitches
    for (let i = 0; i < a; i++) {
      const y = Math.random() * h;
      const hh = 2 + Math.random() * 18;
      const ox = (Math.random() - 0.5) * a * 2;
      ctx.drawImage(canvas, 0, y, w, hh, ox, y, w, hh);
    }

    // rgb split
    if (r > 0) {
      const data = ctx.getImageData(0, 0, w, h);
      const out = ctx.createImageData(w, h);
      const d = data.data;
      const o = out.data;
      const shift = r | 0;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const ir = (y * w + Math.min(w - 1, x + shift)) * 4;
          const ib = (y * w + Math.max(0, x - shift)) * 4;
          o[i] = d[ir];
          o[i + 1] = d[i + 1];
          o[i + 2] = d[ib + 2];
          o[i + 3] = 255;
        }
      }
      ctx.putImageData(out, 0, 0);
    }
  };

  const load = () => {
    img.onload = draw;
    img.src = srcSel?.value || "assets/hero-still.jpg";
  };

  srcSel?.addEventListener("change", load);
  amt?.addEventListener("input", draw);
  rgb?.addEventListener("input", draw);
  document.getElementById("glitchApply")?.addEventListener("click", draw);
  document.getElementById("glitchVoice")?.addEventListener("click", () => {
    try { new Audio("assets/biao-13.mp3").play(); } catch { /* */ }
    if (amt) amt.value = String(20 + Math.floor(Math.random() * 15));
    draw();
  });
  load();
})();
