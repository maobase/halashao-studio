/* HALASHAO system shell — shared across pages */
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;

  // year + clock
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
  const clock = document.getElementById("clock");
  if (clock) {
    const tick = () => {
      const d = new Date();
      clock.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()]
        .map((n) => String(n).padStart(2, "0"))
        .join(":");
    };
    tick();
    setInterval(tick, 1000);
  }

  // active nav
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const href = (a.getAttribute("href") || "").split("/").pop().toLowerCase();
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("is-active");
    }
  });

  // top scroll + progress
  const top = document.querySelector(".top");
  const scrollBar = document.getElementById("scrollBar");
  const onScrollNav = () => {
    top?.classList.toggle("is-scrolled", window.scrollY > 12);
    if (scrollBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? (window.scrollY / max) * 100 : 0;
      scrollBar.style.transform = `scaleX(${p / 100})`;
    }
  };
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  // 土 / 酷 mode toggle
  const modeBtn = document.getElementById("modeBtn");
  const applyMode = (mode) => {
    document.documentElement.dataset.mode = mode;
    if (modeBtn) modeBtn.textContent = mode === "tu" ? "土" : "酷";
    try { localStorage.setItem("halashao-mode", mode); } catch { /* */ }
  };
  let mode = "ku";
  try { mode = localStorage.getItem("halashao-mode") || "ku"; } catch { /* */ }
  applyMode(mode);
  modeBtn?.addEventListener("click", () => {
    applyMode(document.documentElement.dataset.mode === "tu" ? "ku" : "tu");
  });

  // drawer
  const burger = document.getElementById("burger");
  const drawer = document.getElementById("drawer");
  const setDrawer = (open) => {
    if (!burger || !drawer) return;
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    drawer.classList.toggle("is-open", open);
    if (open) drawer.removeAttribute("hidden");
    else drawer.setAttribute("hidden", "");
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger?.addEventListener("click", () => setDrawer(burger.getAttribute("aria-expanded") !== "true"));
  drawer?.querySelectorAll("[data-close]").forEach((a) => a.addEventListener("click", () => setDrawer(false)));

  // scramble
  const glyphs = "哈拉少刃锻火花欧了彪哥ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const scramble = (el) => {
    const original = el.dataset.original || el.textContent || "";
    el.dataset.original = original;
    let frame = 0;
    const total = Math.min(14, original.length + 5);
    const id = setInterval(() => {
      el.textContent = original
        .split("")
        .map((ch, i) => {
          if (/\s|·|\/|，|。|！|？/.test(ch)) return ch;
          if (i < (frame / total) * original.length) return original[i];
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join("");
      frame++;
      if (frame > total) {
        clearInterval(id);
        el.textContent = original;
      }
    }, 24);
  };
  document.querySelectorAll("[data-scramble]").forEach((el) => {
    el.dataset.original = el.textContent || "";
    el.addEventListener("mouseenter", () => {
      if (!reduce) scramble(el);
    });
  });

  // magnetic
  if (fine && !reduce) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * 0.16}px, ${(e.clientY - (r.top + r.height / 2)) * 0.2}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "";
      });
    });
  }

  // custom cursor
  const cursor = document.getElementById("cursor");
  if (cursor && fine && !reduce) {
    document.body.classList.add("has-cursor");
    const dot = cursor.querySelector("i");
    const ring = cursor.querySelector("b");
    let x = -999, y = -999, rx = x, ry = y;
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot) dot.style.transform = `translate3d(${x}px,${y}px,0)`;
      if (ring) ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", (e) => {
      x = e.clientX;
      y = e.clientY;
    }, { passive: true });
    document.addEventListener("pointerover", (e) => {
      cursor.classList.toggle("is-hot", !!e.target.closest("a,button,[data-hot],.player-scrub,.quote-card"));
    });
    requestAnimationFrame(loop);
  }

  // particles
  const canvas = document.getElementById("field");
  if (canvas && !reduce) {
    const ctx = canvas.getContext("2d", { alpha: true });
    if (ctx) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let w = 0, h = 0, pts = [], mx = -9999, my = -9999, raf = 0, last = 0;
      const LIME = { r: 200, g: 245, b: 66 };
      const GOLD = { r: 255, g: 214, b: 90 };
      const rand = (a, b) => a + Math.random() * (b - a);
      const count = () => Math.max(40, Math.min(120, Math.floor((w * h) / 15000)));
      const spawn = () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: rand(-0.2, 0.2),
        vy: rand(-0.2, 0.2),
        r: rand(0.7, 2.1),
        hot: Math.random() < 0.25,
        gold: Math.random() < 0.12,
        ph: Math.random() * Math.PI * 2,
      });
      const resize = () => {
        w = innerWidth;
        h = innerHeight;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const n = count();
        if (!pts.length) pts = Array.from({ length: n }, spawn);
        else if (pts.length < n) while (pts.length < n) pts.push(spawn());
        else pts.length = n;
      };
      const step = (t) => {
        const dt = Math.min(32, t - last || 16) / 16.67;
        last = t;
        ctx.clearRect(0, 0, w, h);
        const maxD = Math.min(130, w * 0.11);
        const maxD2 = maxD * maxD;
        for (const p of pts) {
          const dx = p.x - mx, dy = p.y - my;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 160) {
            const f = (1 - dist / 160) * 0.09;
            p.vx += (dx / dist) * f;
            p.vy += (dy / dist) * f;
          }
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vx *= 0.99;
          p.vy *= 0.99;
          p.vx += rand(-0.01, 0.01);
          p.vy += rand(-0.01, 0.01);
          p.ph += 0.025 * dt;
          if (p.x < -30) p.x = w + 30;
          if (p.x > w + 30) p.x = -30;
          if (p.y < -30) p.y = h + 30;
          if (p.y > h + 30) p.y = -30;
        }
        for (let i = 0; i < pts.length; i++) {
          const a = pts[i];
          for (let j = i + 1; j < pts.length; j++) {
            const b = pts[j];
            const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
            if (d2 > maxD2) continue;
            const alpha = (1 - Math.sqrt(d2) / maxD) * 0.18;
            if (alpha < 0.02) continue;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${LIME.r},${LIME.g},${LIME.b},${alpha})`;
            ctx.stroke();
          }
        }
        for (const p of pts) {
          const pulse = 0.55 + Math.sin(p.ph) * 0.45;
          const c = p.gold ? GOLD : p.hot ? LIME : { r: 244, g: 244, b: 238 };
          const alpha = p.hot || p.gold ? 0.5 + pulse * 0.4 : 0.12 + pulse * 0.18;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * (0.9 + pulse * 0.2), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
          ctx.fill();
        }
        raf = requestAnimationFrame(step);
      };
      window.addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
      window.addEventListener("resize", resize, { passive: true });
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
        else if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); }
      });
      resize();
      last = performance.now();
      raf = requestAnimationFrame(step);
    }
  }

  // floating biao toast (土酷)
  const lines = window.HALASHAO_QUOTES || [
    "小树不倒我就不倒",
    "欧了",
    "肉眼凡胎，量你也看不出来",
    "你就慢慢跟我处，处不好你自己找原因",
    "本市几场著名硬仗都是我主打的",
    "时光能不能倒流？豆角能不能煮熟？",
    "论成败，人生豪迈；大不了从头再来",
    "那长相就是证据",
  ];
  if (!reduce && !document.body.dataset.noToast) {
    let i = 0;
    const toast = document.createElement("div");
    toast.className = "biao-toast";
    toast.setAttribute("aria-hidden", "true");
    document.body.appendChild(toast);
    const show = () => {
      toast.textContent = `彪哥说：${lines[i % lines.length]}`;
      toast.classList.add("is-on");
      i++;
      setTimeout(() => toast.classList.remove("is-on"), 3200);
    };
    setTimeout(show, 2800);
    setInterval(show, 14000);
  }

  // command palette ⌘K / Ctrl+K
  const MODULES = [
    ["首页", "index.html"], ["系统地图", "os.html"], ["使用手册", "docs.html"],
    ["作品库", "work.html"], ["影库", "gallery.html"], ["故事条", "stories.html"],
    ["硬仗档案", "hard.html"], ["前后对比", "versus.html"], ["片源台", "reel.html"],
    ["新二流", "xin2.html"], ["直播感", "live.html"], ["夜场", "night.html"],
    ["文字风暴", "storm.html"], ["硬仗骰子", "dice.html"], ["土味盖章", "stamp.html"],
    ["老板看板", "boss.html"], ["土酷电台", "radio.html"], ["卡拉OK", "karaoke.html"],
    ["城市灯牌", "billboard.html"], ["锻造工坊", "workshop.html"], ["审美罗盘", "mood.html"],
    ["土酷对决", "arena.html"], ["弹幕墙", "wall.html"], ["特效场", "fx.html"],
    ["点唱机", "jukebox.html"], ["彪哥语录", "biao.html"], ["人设卡", "cast.html"],
    ["招人", "recruit.html"], ["媒体包", "press.html"], ["工作室", "studio.html"],
    ["时间线", "timeline.html"], ["服务菜单", "menu.html"], ["开干", "contact.html"],
  ];

  const ensureCmd = () => {
    let overlay = document.getElementById("cmdOverlay");
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.id = "cmdOverlay";
    overlay.className = "cmd-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="cmd-panel" role="dialog" aria-label="模块搜索">
        <input class="cmd-input" id="cmdInput" placeholder="搜模块… 欧了 / 硬仗 / 夜场" autocomplete="off" />
        <ul class="cmd-list" id="cmdList"></ul>
        <p class="cmd-hint">↑↓ 选择 · Enter 前往 · Esc 关闭</p>
      </div>`;
    document.body.appendChild(overlay);
    return overlay;
  };

  let cmdIndex = 0;
  let cmdItems = MODULES.slice();

  const renderCmd = (q = "") => {
    const list = document.getElementById("cmdList");
    if (!list) return;
    const qq = q.trim().toLowerCase();
    cmdItems = MODULES.filter(([name, href]) => !qq || name.toLowerCase().includes(qq) || href.includes(qq));
    cmdIndex = 0;
    list.innerHTML = cmdItems
      .map(([name, href], i) => `<li><button type="button" data-href="${href}" class="${i === 0 ? "is-on" : ""}"><b>${name}</b><span>${href}</span></button></li>`)
      .join("") || `<li class="cmd-empty">没有找到 · 大不了从头再来</li>`;
  };

  const openCmd = () => {
    const overlay = ensureCmd();
    overlay.hidden = false;
    renderCmd("");
    const input = document.getElementById("cmdInput");
    input?.focus();
    document.body.style.overflow = "hidden";
  };

  const closeCmd = () => {
    const overlay = document.getElementById("cmdOverlay");
    if (overlay) overlay.hidden = true;
    document.body.style.overflow = "";
  };

  document.getElementById("cmdBtn")?.addEventListener("click", openCmd);
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      const overlay = document.getElementById("cmdOverlay");
      if (overlay && !overlay.hidden) closeCmd();
      else openCmd();
      return;
    }
    const overlay = document.getElementById("cmdOverlay");
    if (!overlay || overlay.hidden) return;
    if (e.key === "Escape") closeCmd();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      cmdIndex = Math.min(cmdItems.length - 1, cmdIndex + 1);
      overlay.querySelectorAll(".cmd-list button").forEach((b, i) => b.classList.toggle("is-on", i === cmdIndex));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      cmdIndex = Math.max(0, cmdIndex - 1);
      overlay.querySelectorAll(".cmd-list button").forEach((b, i) => b.classList.toggle("is-on", i === cmdIndex));
    }
    if (e.key === "Enter" && cmdItems[cmdIndex]) {
      location.href = cmdItems[cmdIndex][1];
    }
  });
  document.addEventListener("input", (e) => {
    if (e.target?.id === "cmdInput") renderCmd(e.target.value);
  });
  document.addEventListener("click", (e) => {
    const overlay = document.getElementById("cmdOverlay");
    if (!overlay || overlay.hidden) return;
    if (e.target === overlay) closeCmd();
    const btn = e.target.closest?.(".cmd-list button[data-href]");
    if (btn) location.href = btn.dataset.href;
  });

  // expose helpers
  window.HALASHAO = {
    reduce,
    fine,
    quotes: lines,
    scramble,
    modules: MODULES,
    openCmd,
  };
})();
