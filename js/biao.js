(() => {
  const quotes = [
    "小树不倒我就不倒",
    "欧了",
    "肉眼凡胎，量你也看不出来",
    "你就慢慢跟我处，处不好你自己找原因",
    "本市几场著名硬仗都是我主打的",
    "时光能不能倒流？豆角能不能煮熟？",
    "论成败，人生豪迈；大不了从头再来",
    "那长相就是证据",
    "这个用户正在生气，稍后再拨",
  ];

  const wall = document.getElementById("quoteWall");
  if (wall) {
    wall.innerHTML = quotes
      .map(
        (q) => `<article class="quote-card" data-hot>
          <q>${q}</q>
          <footer>—— 范德彪</footer>
        </article>`
      )
      .join("");
  }

  const main = document.getElementById("biaoMain");
  let i = 0;
  const setQ = (text) => {
    if (!main) return;
    main.textContent = text;
    main.classList.add("karaoke");
    setTimeout(() => main.classList.remove("karaoke"), 900);
  };

  document.querySelectorAll("[data-quote]").forEach((btn) => {
    btn.addEventListener("click", () => {
      i = Math.floor(Math.random() * quotes.length);
      setQ(quotes[i]);
    });
  });

  document.querySelectorAll("[data-quote-all]").forEach((btn) => {
    btn.addEventListener("click", () => {
      let n = 0;
      const id = setInterval(() => {
        setQ(quotes[(i + n) % quotes.length]);
        n++;
        if (n >= 3) clearInterval(id);
      }, 420);
    });
  });

  const shock = document.getElementById("shock");
  const shockText = document.getElementById("shockText");
  shock?.addEventListener("click", () => {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    if (shockText) shockText.textContent = q;
    shock.classList.add("is-boom");
    // confetti-ish particles
    for (let k = 0; k < 18; k++) {
      const p = document.createElement("i");
      p.style.cssText = `position:absolute;width:8px;height:8px;border-radius:50%;left:50%;top:50%;background:${
        k % 3 === 0 ? "var(--acid)" : k % 3 === 1 ? "var(--gold)" : "var(--hot)"
      };pointer-events:none;transition:transform .7s cubic-bezier(.16,1,.3,1),opacity .7s;`;
      shock.appendChild(p);
      requestAnimationFrame(() => {
        const a = Math.random() * Math.PI * 2;
        const d = 60 + Math.random() * 120;
        p.style.transform = `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px) scale(0)`;
        p.style.opacity = "0";
      });
      setTimeout(() => p.remove(), 750);
    }
    setTimeout(() => shock.classList.remove("is-boom"), 500);
  });
})();
