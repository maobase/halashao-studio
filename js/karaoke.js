(() => {
  const lines = [
    "小树不倒我就不倒",
    "欧了",
    "肉眼凡胎量你也看不出来",
    "你就慢慢跟我处",
    "本市几场著名硬仗都是我主打的",
    "论成败人生豪迈",
    "大不了从头再来",
    "豆角能不能煮熟",
  ];

  let li = 0;
  let ci = 0;
  let score = 0;
  let combo = 0;
  const lineEl = document.getElementById("karaLine");
  const bar = document.getElementById("karaBar");
  const scoreEl = document.getElementById("karaScore");
  const keys = document.getElementById("karaKeys");

  const render = () => {
    const line = lines[li % lines.length];
    if (lineEl) {
      lineEl.innerHTML = [...line]
        .map((ch, idx) => `<span class="${idx < ci ? "done" : idx === ci ? "cur" : ""}">${ch}</span>`)
        .join("");
    }
    if (bar) bar.style.width = `${(ci / Math.max(1, line.length)) * 100}%`;
    if (keys) {
      keys.innerHTML = `<button type="button" class="btn solid" id="karaHit">打字推进 · ${line[ci] || "✓"}</button>
        <button type="button" class="btn line" id="karaSkip">跳句</button>`;
      document.getElementById("karaHit")?.addEventListener("click", hit);
      document.getElementById("karaSkip")?.addEventListener("click", () => {
        li++;
        ci = 0;
        combo = 0;
        render();
      });
    }
    if (scoreEl) scoreEl.textContent = String(score);
  };

  const hit = () => {
    const line = lines[li % lines.length];
    ci++;
    score += 10 + combo;
    combo++;
    if (ci >= line.length) {
      score += 50;
      if (combo >= 4) {
        try { new Audio("assets/biao-1.mp3").play(); } catch { /* */ }
        if (lineEl) lineEl.classList.add("combo");
        setTimeout(() => lineEl?.classList.remove("combo"), 400);
      } else {
        try { new Audio("assets/biao-2.mp3").play(); } catch { /* */ }
      }
      li++;
      ci = 0;
      combo = 0;
    }
    render();
  };

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.key.length === 1) {
      e.preventDefault();
      hit();
    }
  });

  render();
})();
