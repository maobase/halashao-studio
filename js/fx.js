(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const quotes = window.HALASHAO?.quotes || [
    "小树不倒我就不倒",
    "欧了",
    "肉眼凡胎，量你也看不出来",
  ];

  // particle well
  const well = document.getElementById("fxWell");
  if (well && !reduce) {
    const ctx = well.getContext("2d");
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let w = 0, h = 0, parts = [];
    const resize = () => {
      const r = well.getBoundingClientRect();
      w = r.width;
      h = r.height;
      well.width = Math.floor(w * dpr);
      well.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    const spawn = (x, y, n = 10) => {
      for (let i = 0; i < n; i++) {
        parts.push({
          x, y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 1,
          c: Math.random() > 0.5 ? "#c8f542" : Math.random() > 0.5 ? "#ffd65a" : "#e23d2a",
        });
      }
    };
    well.addEventListener("pointermove", (e) => {
      const r = well.getBoundingClientRect();
      spawn(e.clientX - r.left, e.clientY - r.top, 4);
    });
    well.addEventListener("pointerdown", (e) => {
      const r = well.getBoundingClientRect();
      spawn(e.clientX - r.left, e.clientY - r.top, 28);
    });
    const loop = () => {
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, 0, w, h);
      parts = parts.filter((p) => p.life > 0.02);
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life *= 0.96;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2 * p.life + 0.5, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.life;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      requestAnimationFrame(loop);
    };
    loop();
  }

  // tilt card
  const tilt = document.getElementById("fxTilt");
  const card = document.getElementById("tiltCard");
  if (tilt && card && !reduce) {
    tilt.addEventListener("pointermove", (e) => {
      const r = tilt.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${px * 22}deg) rotateX(${-py * 18}deg)`;
    });
    tilt.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  }

  // type blast
  const blast = document.getElementById("typeBlast");
  if (blast) {
    const t = blast.textContent || "";
    blast.innerHTML = [...t].map((c) => `<span>${c === " " ? "&nbsp;" : c}</span>`).join("");
  }

  // barrage
  const bar = document.getElementById("fxBarrage");
  if (bar && !reduce) {
    const fire = () => {
      const el = document.createElement("div");
      el.textContent = quotes[Math.floor(Math.random() * quotes.length)];
      el.style.cssText = `position:absolute;left:100%;white-space:nowrap;font-weight:800;font-family:var(--font-cn);color:${
        Math.random() > 0.5 ? "var(--acid)" : "var(--gold)"
      };top:${10 + Math.random() * 70}%;font-size:${14 + Math.random() * 10}px;transition:transform ${6 + Math.random() * 4}s linear;`;
      bar.appendChild(el);
      requestAnimationFrame(() => {
        el.style.transform = `translateX(-${bar.clientWidth + 400}px)`;
      });
      setTimeout(() => el.remove(), 11000);
    };
    fire();
    setInterval(fire, 1600);
  }
})();
