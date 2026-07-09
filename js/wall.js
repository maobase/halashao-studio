(() => {
  const stage = document.getElementById("wallStage");
  const canvas = document.getElementById("wallCanvas");
  const form = document.getElementById("wallForm");
  const input = document.getElementById("wallInput");
  const presets = document.getElementById("wallPresets");

  const quotes = [
    "小树不倒我就不倒",
    "欧了",
    "肉眼凡胎，量你也看不出来",
    "你就慢慢跟我处",
    "本市著名硬仗主打",
    "豆角能不能煮熟？",
    "大不了从头再来",
    "那长相就是证据",
    "稍后再拨",
    "土酷到底",
    "少即是刃",
    "家人们开干",
  ];

  if (presets) {
    presets.innerHTML = quotes
      .map((q) => `<button type="button" class="wall-chip" data-q="${q}">${q}</button>`)
      .join("");
  }

  let w = 0, h = 0, ctx, dpr = 1;
  const items = [];

  const resize = () => {
    if (!canvas || !stage) return;
    const r = stage.getBoundingClientRect();
    w = r.width;
    h = Math.max(420, r.height || 480);
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const colors = ["#c8f542", "#ffd65a", "#e23d2a", "#f4f0ea", "#7dd3fc"];

  const spawn = (text) => {
    items.push({
      text: text.slice(0, 24),
      x: w + 20,
      y: 40 + Math.random() * (h - 80),
      v: 1.2 + Math.random() * 2.4,
      c: colors[Math.floor(Math.random() * colors.length)],
      s: 16 + Math.random() * 18,
    });
  };

  // initial rain
  for (let i = 0; i < 10; i++) {
    const it = {
      text: quotes[i % quotes.length],
      x: Math.random() * w,
      y: 40 + Math.random() * (h - 80),
      v: 1.2 + Math.random() * 2.4,
      c: colors[i % colors.length],
      s: 16 + Math.random() * 18,
    };
    items.push(it);
  }

  const loop = () => {
    if (!ctx) return;
    ctx.fillStyle = "rgba(8,8,10,0.35)";
    ctx.fillRect(0, 0, w, h);
    // grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (const it of items) {
      it.x -= it.v;
      if (it.x < -400) {
        it.x = w + 40;
        it.y = 40 + Math.random() * (h - 80);
        it.text = quotes[Math.floor(Math.random() * quotes.length)];
      }
      ctx.font = `900 ${it.s}px "Noto Sans SC", sans-serif`;
      ctx.fillStyle = it.c;
      ctx.shadowColor = it.c;
      ctx.shadowBlur = 12;
      ctx.fillText(it.text, it.x, it.y);
      ctx.shadowBlur = 0;
    }
    requestAnimationFrame(loop);
  };
  loop();

  const fire = (text) => {
    if (!text.trim()) return;
    spawn(text.trim());
  };

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    fire(input?.value || "");
    if (input) input.value = "";
  });

  presets?.addEventListener("click", (e) => {
    const b = e.target.closest("[data-q]");
    if (b) fire(b.dataset.q);
  });
})();
