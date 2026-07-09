(() => {
  const a = document.getElementById("clashA");
  const b = document.getElementById("clashB");
  const mix = document.getElementById("clashMix");
  const cap = document.getElementById("clashCap");

  const apply = () => {
    const v = Number(mix?.value || 50) / 100;
    if (a) a.style.opacity = String(1 - v * 0.15);
    if (b) {
      b.style.opacity = String(v);
      b.style.mixBlendMode = v > 0.55 ? "screen" : "lightness";
    }
    if (cap) {
      if (v < 0.35) cap.textContent = "偏电影 · 酷壳";
      else if (v > 0.65) cap.textContent = "偏粒子 · 更燥";
      else cap.textContent = "五五开 · 正是硬仗";
    }
  };

  mix?.addEventListener("input", apply);
  [a, b].forEach((v) => v?.play?.().catch(() => {}));
  apply();
})();
