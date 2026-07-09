(() => {
  const canvas = document.getElementById("posterCanvas");
  const title = document.getElementById("posterTitle");
  const sub = document.getElementById("posterSub");
  const bg = document.getElementById("posterBg");
  const dl = document.getElementById("posterDL");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const img = new Image();

  const draw = () => {
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = "#0a0a0c";
    ctx.fillRect(0, 0, w, h);
    if (img.complete && img.naturalWidth) {
      // cover
      const s = Math.max(w / img.width, h / img.height);
      const iw = img.width * s;
      const ih = img.height * s;
      ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
    }
    // scrim
    const g = ctx.createLinearGradient(0, h * 0.35, 0, h);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.92)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // title
    ctx.fillStyle = "#c8f542";
    ctx.font = "900 120px Noto Sans SC, sans-serif";
    ctx.fillText(title?.value || "哈拉少", 64, h - 280);
    ctx.fillStyle = "#ffd65a";
    ctx.font = "800 48px Noto Sans SC, sans-serif";
    const stext = sub?.value || "欧了";
    ctx.fillText(stext, 64, h - 190);
    // stamp
    ctx.save();
    ctx.translate(w - 220, h - 220);
    ctx.rotate(-0.25);
    ctx.strokeStyle = "#e23d2a";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 90, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#e23d2a";
    ctx.font = "900 36px Noto Sans SC, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("硬仗", 0, 8);
    ctx.restore();
    // footer
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "600 28px Space Grotesk, sans-serif";
    ctx.fillText("HALASHAO · DESIGN OS", 64, h - 80);

    if (dl) dl.href = canvas.toDataURL("image/png");
  };

  const load = () => {
    img.onload = draw;
    img.src = bg?.value || "assets/hero-still.jpg";
  };

  document.getElementById("posterDraw")?.addEventListener("click", () => {
    draw();
    try { new Audio("assets/biao-2.mp3").play(); } catch { /* */ }
  });
  title?.addEventListener("change", draw);
  sub?.addEventListener("change", draw);
  bg?.addEventListener("change", load);
  load();
})();
