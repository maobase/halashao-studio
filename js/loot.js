(() => {
  const pool = (window.HALASHAO && window.HALASHAO.modules) || [
    ["夜场", "night.html"], ["音板", "soundboard.html"], ["硬仗", "hard.html"],
    ["片源", "reel.html"], ["风暴", "storm.html"], ["开干", "contact.html"],
  ];
  let current = pool[0];
  const box = document.getElementById("lootBox");
  const name = document.getElementById("lootName");
  const go = document.getElementById("lootGo");

  document.getElementById("lootOpen")?.addEventListener("click", () => {
    box?.classList.add("shake");
    let n = 0;
    const id = setInterval(() => {
      current = pool[Math.floor(Math.random() * pool.length)];
      if (box) box.textContent = current[0].slice(0, 1);
      if (name) name.textContent = current[0];
      n++;
      if (n > 16) {
        clearInterval(id);
        box?.classList.remove("shake");
        if (go) {
          go.href = current[1];
          go.textContent = `进入 · ${current[0]}`;
        }
        const rare = Math.random() > 0.7;
        if (name) name.textContent = (rare ? "稀有 · " : "") + current[0];
        try { new Audio(rare ? "assets/biao-18.mp3" : "assets/biao-2.mp3").play(); } catch { /* */ }
      }
    }, 60);
  });
})();
