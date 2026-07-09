(() => {
  const canvas = document.getElementById("warpCanvas");
  const srcSel = document.getElementById("warpSrc");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const img = new Image();
  let base = null;
  let drawing = false;

  const paintBase = () => {
    if (!img.complete) return;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    base = ctx.getImageData(0, 0, canvas.width, canvas.height);
  };

  const smear = (x, y) => {
    if (!base) return;
    const r = 36;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgData.data;
    const src = base.data;
    for (let j = -r; j <= r; j++) {
      for (let i = -r; i <= r; i++) {
        if (i * i + j * j > r * r) continue;
        const sx = Math.min(canvas.width - 1, Math.max(0, (x + i * 0.6) | 0));
        const sy = Math.min(canvas.height - 1, Math.max(0, (y + j * 0.6) | 0));
        const di = ((y + j) * canvas.width + (x + i)) * 4;
        const si = (sy * canvas.width + sx) * 4;
        if (x + i < 0 || y + j < 0 || x + i >= canvas.width || y + j >= canvas.height) continue;
        d[di] = src[si];
        d[di + 1] = src[si + 1];
        d[di + 2] = src[si + 2];
        d[di + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  };

  const load = () => {
    img.onload = paintBase;
    img.src = srcSel?.value || "assets/hero-still.jpg";
  };

  canvas.addEventListener("pointerdown", (e) => {
    drawing = true;
    const r = canvas.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * canvas.width;
    const y = ((e.clientY - r.top) / r.height) * canvas.height;
    smear(x | 0, y | 0);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drawing) return;
    const r = canvas.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * canvas.width;
    const y = ((e.clientY - r.top) / r.height) * canvas.height;
    smear(x | 0, y | 0);
  });
  window.addEventListener("pointerup", () => { drawing = false; });

  srcSel?.addEventListener("change", load);
  document.getElementById("warpReset")?.addEventListener("click", paintBase);
  load();
})();
