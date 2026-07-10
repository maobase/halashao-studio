(() => {
  const canvas = document.getElementById("comboCanvas");
  const seqEl = document.getElementById("comboSeq");
  const nameEl = document.getElementById("comboName");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let seq = "";
  let parts = [];
  const recipes = {
    QWE: ["土酷硬三连", "assets/biao-18.mp3", "#c8f542"],
    QQW: ["双土一酷", "assets/biao-2.mp3", "#ffd65a"],
    EEW: ["硬硬酷", "assets/biao-5.mp3", "#e23d2a"],
    WQE: ["酷土硬", "assets/biao-1.mp3", "#7dd3fc"],
    QQQ: ["纯土连击", "assets/biao-14.mp3", "#ffd65a"],
    WWW: ["纯酷连击", "assets/biao-12.mp3", "#c8f542"],
    EEE: ["三硬到底", "assets/biao-6.mp3", "#e23d2a"],
  };

  const boom = (color) => {
    for (let i = 0; i < 40; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 2 + Math.random() * 6;
      parts.push({
        x: canvas.width / 2, y: canvas.height / 2,
        vx: Math.cos(a) * s, vy: Math.sin(a) * s,
        life: 1, c: color,
      });
    }
  };

  const loop = () => {
    ctx.fillStyle = "rgba(5,5,6,0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    parts = parts.filter((p) => p.life > 0.02);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.life *= 0.96;
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x, p.y, 4, 4);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  };
  loop();

  const push = (k) => {
    if (k === "R") {
      seq = "";
      if (seqEl) seqEl.textContent = "—";
      if (nameEl) nameEl.textContent = "已清空";
      return;
    }
    seq = (seq + k).slice(-3);
    if (seqEl) seqEl.textContent = seq.split("").join(" · ");
    const hit = recipes[seq];
    if (hit) {
      if (nameEl) nameEl.textContent = `招式：${hit[0]}`;
      boom(hit[2]);
      try { new Audio(hit[1]).play(); } catch { /* */ }
      seq = "";
    } else if (nameEl) nameEl.textContent = "连招中…";
  };

  document.querySelectorAll(".combo-keys [data-k]").forEach((b) => {
    b.addEventListener("click", () => push(b.dataset.k));
  });
  window.addEventListener("keydown", (e) => {
    const k = e.key.toUpperCase();
    if ("QWER".includes(k)) {
      e.preventDefault();
      push(k);
    }
  });
})();
