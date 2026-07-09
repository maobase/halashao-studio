(() => {
  const items = [
    ["夜场", "night.html"],
    ["直播感", "live.html"],
    ["文字风暴", "storm.html"],
    ["音板", "soundboard.html"],
    ["彪聊", "chat.html"],
    ["闯关", "route.html"],
    ["矩阵", "matrix.html"],
    ["故障", "glitch.html"],
    ["脉冲", "pulse.html"],
    ["硬仗", "hard.html"],
    ["片源", "reel.html"],
    ["开干", "contact.html"],
  ];
  let i = 0;
  const stage = document.getElementById("orbitStage");
  const go = document.getElementById("orbitGo");

  const render = () => {
    if (!stage) return;
    stage.innerHTML = items
      .map(([name, href], idx) => {
        const off = idx - i;
        const abs = ((off % items.length) + items.length) % items.length;
        const rel = abs > items.length / 2 ? abs - items.length : abs;
        // simpler: centered index
        const d = idx - i;
        const wrapped = ((d % items.length) + items.length) % items.length;
        const pos = wrapped > items.length / 2 ? wrapped - items.length : wrapped;
        const z = 100 - Math.abs(pos);
        const scale = pos === 0 ? 1.1 : Math.max(0.55, 1 - Math.abs(pos) * 0.12);
        const x = pos * 120;
        const o = pos === 0 ? 1 : Math.max(0.25, 1 - Math.abs(pos) * 0.2);
        return `<button type="button" class="orbit-card ${pos === 0 ? "is-on" : ""}" data-href="${href}" data-i="${idx}"
          style="transform:translateX(${x}px) scale(${scale});z-index:${z};opacity:${o}">${name}</button>`;
      })
      .join("");
    if (go) {
      go.href = items[i][1];
      go.textContent = `进入 · ${items[i][0]}`;
    }
  };

  const move = (d) => {
    i = (i + d + items.length) % items.length;
    render();
  };

  document.getElementById("orbitPrev")?.addEventListener("click", () => move(-1));
  document.getElementById("orbitNext")?.addEventListener("click", () => move(1));
  stage?.addEventListener("click", (e) => {
    const b = e.target.closest(".orbit-card");
    if (!b) return;
    const idx = Number(b.dataset.i);
    if (idx === i) location.href = b.dataset.href;
    else {
      i = idx;
      render();
    }
  });

  // swipe
  let sx = 0;
  stage?.addEventListener("pointerdown", (e) => { sx = e.clientX; });
  stage?.addEventListener("pointerup", (e) => {
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 40) move(dx < 0 ? 1 : -1);
  });

  render();
})();
