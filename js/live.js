(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const chat = document.getElementById("liveChat");
  const subs = document.getElementById("liveSubs");
  const gifts = document.getElementById("liveGifts");
  const viewers = document.getElementById("liveViewers");
  const canvas = document.getElementById("liveFx");
  const vid = document.getElementById("liveVid");

  const lines = [
    "家人们这质感绝了",
    "小树不倒我就不倒",
    "欧了欧了欧了",
    "主打的就是一个硬仗",
    "土味是武器不是缺陷",
    "那长相就是证据",
    "处不好你自己找原因",
    "豆角能不能煮熟？",
    "从头再来不丢人",
    "酸柠粒子我可以",
  ];
  const names = ["辽北浪子", "夜市音响", "金曲卡拉", "硬仗粉", "家人们A", "家人们B", "彪吹", "设计狗"];

  const pushChat = (text, user) => {
    if (!chat) return;
    const row = document.createElement("div");
    row.className = "live-chat-row";
    row.innerHTML = `<b>${user || names[Math.floor(Math.random() * names.length)]}</b> ${text}`;
    chat.appendChild(row);
    chat.scrollTop = chat.scrollHeight;
    while (chat.children.length > 40) chat.removeChild(chat.firstChild);
  };

  // seed chat
  for (let i = 0; i < 8; i++) pushChat(lines[i % lines.length]);
  if (!reduce) {
    setInterval(() => pushChat(lines[Math.floor(Math.random() * lines.length)]), 1600);
    setInterval(() => {
      if (!viewers) return;
      const n = 11000 + Math.floor(Math.random() * 4000);
      viewers.textContent = `${n.toLocaleString("en-US")} 在看`;
    }, 2200);
  }

  const setSub = (t) => {
    if (!subs) return;
    subs.textContent = t;
    subs.classList.remove("pop");
    void subs.offsetWidth;
    subs.classList.add("pop");
  };

  // particles on canvas
  let parts = [];
  let ctx, w, h, raf;
  const resize = () => {
    if (!canvas) return;
    const r = canvas.parentElement.getBoundingClientRect();
    w = r.width;
    h = r.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const burst = (color = "#c8f542", n = 40) => {
    for (let i = 0; i < n; i++) {
      parts.push({
        x: w * (0.3 + Math.random() * 0.4),
        y: h * 0.55,
        vx: (Math.random() - 0.5) * 10,
        vy: -Math.random() * 10 - 2,
        life: 1,
        c: color,
      });
    }
  };

  const loop = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    parts = parts.filter((p) => p.life > 0.02);
    for (const p of parts) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15;
      p.life *= 0.96;
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(loop);
  };
  if (!reduce) loop();

  const floatGift = (text) => {
    if (!gifts) return;
    const el = document.createElement("div");
    el.className = "live-gift";
    el.textContent = text;
    gifts.appendChild(el);
    requestAnimationFrame(() => el.classList.add("go"));
    setTimeout(() => el.remove(), 2200);
  };

  let audio;
  const playClip = (src) => {
    try {
      if (audio) audio.pause();
      audio = new Audio(src);
      audio.play().catch(() => {});
    } catch { /* */ }
  };

  document.getElementById("btnLike")?.addEventListener("click", () => {
    burst("#e23d2a", 50);
    setSub("家人们疯狂点赞中");
    pushChat("点赞爆炸了家人们", "系统");
  });
  document.getElementById("btnGift")?.addEventListener("click", () => {
    burst("#ffd65a", 60);
    floatGift("🎁 欧了 x99");
    setSub("欧了");
    playClip("assets/biao-2.mp3");
    pushChat("刷了 99 个欧了", "金主爸爸");
  });
  document.getElementById("btnBiao")?.addEventListener("click", () => {
    const clips = [
      ["assets/biao-1.mp3", "小树不倒我就不倒"],
      ["assets/biao-5.mp3", "本市几场著名硬仗都是我主打的"],
      ["assets/biao-6.mp3", "论成败，人生豪迈；大不了从头再来"],
      ["assets/biao-7.mp3", "时光能不能倒流？豆角能不能煮熟？"],
    ];
    const c = clips[Math.floor(Math.random() * clips.length)];
    playClip(c[0]);
    setSub(c[1]);
    burst("#c8f542", 36);
    pushChat("彪哥上麦了！！", "解说");
  });

  const sources = [
    "assets/hero-cinematic.mp4",
    "assets/showreel-motion.mp4",
    "assets/work-hover-1.mp4",
    "assets/work-hover-3.mp4",
  ];
  let si = 0;
  document.getElementById("btnFlip")?.addEventListener("click", () => {
    if (!vid) return;
    si = (si + 1) % sources.length;
    vid.src = sources[si];
    vid.play().catch(() => {});
    setSub("镜头已切换 · 继续硬");
    pushChat("导播切机位了", "导播");
  });
})();
