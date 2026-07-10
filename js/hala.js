/* HALASHAO shell — particles · quotes · kinetic · film */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase() || "index.html";
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const href = (a.getAttribute("href") || "").split("/").pop().toLowerCase();
    if (href === path || (path === "" && href === "index.html")) a.classList.add("is-active");
  });

  const nav = document.querySelector(".shell-nav");
  const onScroll = () => nav?.classList.toggle("is-on", scrollY > 12);
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  const burger = document.getElementById("burger");
  const drawer = document.getElementById("drawer");
  const setDrawer = (open) => {
    if (!burger || !drawer) return;
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    drawer.classList.toggle("open", open);
    if (open) drawer.removeAttribute("hidden");
    else drawer.setAttribute("hidden", "");
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger?.addEventListener("click", () => setDrawer(burger.getAttribute("aria-expanded") !== "true"));
  drawer?.querySelectorAll("[data-close]").forEach((a) => a.addEventListener("click", () => setDrawer(false)));
  drawer?.addEventListener("click", (e) => {
    if (e.target === drawer) setDrawer(false);
  });

  /* particles */
  const mountParticles = () => {
    if (reduce) return;
    let canvas = document.getElementById("fx-field");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "fx-field";
      canvas.setAttribute("aria-hidden", "true");
      document.body.prepend(canvas);
    }
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    let w = 0;
    let h = 0;
    let raf = 0;
    const dots = [];
    const N = fine ? 48 : 28;
    const resize = () => {
      w = canvas.width = innerWidth * devicePixelRatio;
      h = canvas.height = innerHeight * devicePixelRatio;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    const seed = () => {
      dots.length = 0;
      for (let i = 0; i < N; i++) {
        dots.push({
          x: Math.random() * innerWidth,
          y: Math.random() * innerHeight,
          r: 0.6 + Math.random() * 1.8,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          c: Math.random() > 0.72 ? "rgba(232,52,26,0.55)" : "rgba(255,225,74,0.45)",
        });
      }
    };
    const tick = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > innerWidth) d.vx *= -1;
        if (d.y < 0 || d.y > innerHeight) d.vy *= -1;
        ctx.beginPath();
        ctx.fillStyle = d.c;
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i];
          const b = dots[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(255,225,74,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    resize();
    seed();
    tick();
    addEventListener("resize", () => {
      resize();
      seed();
    }, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(tick);
    });
  };
  mountParticles();

  /* custom cursor */
  if (fine && !reduce) {
    const cur = document.createElement("div");
    cur.className = "fx-cursor";
    cur.setAttribute("aria-hidden", "true");
    document.body.appendChild(cur);
    document.body.classList.add("has-fx-cursor");
    let mx = innerWidth / 2;
    let my = innerHeight / 2;
    addEventListener(
      "pointermove",
      (e) => {
        mx = e.clientX;
        my = e.clientY;
        cur.style.left = `${mx}px`;
        cur.style.top = `${my}px`;
      },
      { passive: true }
    );
    document.querySelectorAll("a,button,.q-card,.cast-card,.lab-card").forEach((el) => {
      el.addEventListener("pointerenter", () => cur.classList.add("is-hot"));
      el.addEventListener("pointerleave", () => cur.classList.remove("is-hot"));
    });
  }

  /* scroll reveal */
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("is-in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("is-in");
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      reveals.forEach((el) => io.observe(el));
    }
  }

  /* horizontal rail */
  document.querySelectorAll("[data-rail]").forEach((rail) => {
    let down = false;
    let sx = 0;
    let sl = 0;
    let moved = false;
    const updateHot = (card, on) => {
      const vid = card.querySelector("video");
      card.classList.toggle("is-hot", on);
      if (!vid || reduce) return;
      if (on) vid.play().catch(() => {});
      else {
        vid.pause();
        try {
          vid.currentTime = 0;
        } catch {
          /* */
        }
      }
    };
    rail.querySelectorAll("[data-work]").forEach((card) => {
      if (fine) {
        card.addEventListener("pointerenter", () => updateHot(card, true));
        card.addEventListener("pointerleave", () => updateHot(card, false));
      } else {
        card.addEventListener("click", () => {
          if (moved) return;
          const on = !card.classList.contains("is-hot");
          rail.querySelectorAll("[data-work]").forEach((c) => updateHot(c, false));
          if (on) updateHot(card, true);
        });
      }
    });
    rail.addEventListener("pointerdown", (e) => {
      if (e.target.closest("a,button")) return;
      down = true;
      moved = false;
      sx = e.clientX;
      sl = rail.scrollLeft;
      rail.classList.add("is-drag");
      rail.setPointerCapture?.(e.pointerId);
    });
    rail.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 4) moved = true;
      rail.scrollLeft = sl - dx;
    });
    const end = () => {
      down = false;
      rail.classList.remove("is-drag");
    };
    rail.addEventListener("pointerup", end);
    rail.addEventListener("pointercancel", end);
    rail.addEventListener(
      "wheel",
      (e) => {
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
        if (rail.scrollWidth <= rail.clientWidth) return;
        e.preventDefault();
        rail.scrollLeft += e.deltaY;
      },
      { passive: false }
    );
  });

  document.querySelectorAll(".work-item[data-work]").forEach((card) => {
    const vid = card.querySelector("video");
    const start = () => {
      if (reduce || !vid) return;
      card.classList.add("is-hot");
      vid.play().catch(() => {});
    };
    const stop = () => {
      card.classList.remove("is-hot");
      if (!vid) return;
      vid.pause();
      try {
        vid.currentTime = 0;
      } catch {
        /* */
      }
    };
    if (fine) {
      card.addEventListener("pointerenter", start);
      card.addEventListener("pointerleave", stop);
    }
  });

  /* film player */
  const player = document.getElementById("player");
  const vid = document.getElementById("filmVid");
  const fill = document.getElementById("scrubFill");
  const timeEl = document.getElementById("filmTime");
  const toggle = document.getElementById("filmToggle");
  const big = document.getElementById("filmBig");
  const mute = document.getElementById("filmMute");
  const scrub = document.getElementById("scrub");

  const fmt = (s) => {
    if (!Number.isFinite(s)) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };
  const sync = () => {
    if (!vid) return;
    const d = vid.duration || 0;
    const c = vid.currentTime || 0;
    if (fill) fill.style.width = `${d ? (c / d) * 100 : 0}%`;
    if (timeEl) timeEl.textContent = `${fmt(c)} / ${fmt(d)}`;
    if (toggle) toggle.textContent = vid.paused ? "▶" : "❚❚";
    if (mute) mute.textContent = vid.muted ? "静音" : "声";
    player?.classList.toggle("is-on", !vid.paused && !vid.ended);
  };
  const play = async () => {
    if (!vid) return;
    try {
      vid.muted = false;
      await vid.play();
    } catch {
      vid.muted = true;
      await vid.play().catch(() => {});
    }
    sync();
  };
  const pause = () => {
    vid?.pause();
    sync();
  };
  const flip = () => (vid?.paused || vid?.ended ? play() : pause());

  big?.addEventListener("click", flip);
  toggle?.addEventListener("click", flip);
  mute?.addEventListener("click", () => {
    if (!vid) return;
    vid.muted = !vid.muted;
    sync();
  });
  scrub?.addEventListener("pointerdown", (e) => {
    if (!vid?.duration) return;
    const seek = (ev) => {
      const r = scrub.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
      vid.currentTime = ratio * vid.duration;
      sync();
    };
    seek(e);
    const move = (ev) => seek(ev);
    const up = () => {
      removeEventListener("pointermove", move);
      removeEventListener("pointerup", up);
    };
    addEventListener("pointermove", move);
    addEventListener("pointerup", up);
  });
  vid?.addEventListener("timeupdate", sync);
  vid?.addEventListener("loadedmetadata", sync);
  vid?.addEventListener("play", sync);
  vid?.addEventListener("pause", sync);
  vid?.addEventListener("ended", sync);

  const loadClip = async (src, btn) => {
    if (!vid || !src) return;
    document.querySelectorAll("[data-clip]").forEach((b) => b.classList.remove("is-on"));
    document.querySelectorAll("[data-chapter]").forEach((b) => b.classList.remove("is-on"));
    btn?.classList.add("is-on");
    const playing = !vid.paused;
    vid.src = src;
    vid.load();
    if (playing) await play();
    else sync();
  };
  document.querySelectorAll("[data-clip]").forEach((btn) => {
    btn.addEventListener("click", () => loadClip(btn.dataset.clip, btn));
  });
  document.querySelectorAll("[data-chapter]").forEach((btn) => {
    btn.addEventListener("click", () => loadClip(btn.dataset.chapter, btn));
  });

  /* quote wall audio */
  let activeAudio = null;
  document.querySelectorAll("[data-quote-src]").forEach((card) => {
    card.addEventListener("click", async () => {
      const src = card.dataset.quoteSrc;
      if (!src) return;
      document.querySelectorAll("[data-quote-src]").forEach((c) => c.classList.remove("is-on"));
      if (activeAudio) {
        activeAudio.pause();
        activeAudio = null;
      }
      const audio = new Audio(src);
      activeAudio = audio;
      card.classList.add("is-on");
      try {
        await audio.play();
      } catch {
        /* */
      }
      audio.addEventListener("ended", () => {
        card.classList.remove("is-on");
        if (activeAudio === audio) activeAudio = null;
      });
    });
  });

  /* feed like buttons */
  document.querySelectorAll("[data-like]").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("is-on");
      const n = Number(btn.dataset.count || "0") + (btn.classList.contains("is-on") ? 1 : -1);
      btn.dataset.count = String(Math.max(0, n));
      btn.textContent = `赞 ${btn.dataset.count}`;
    });
  });

  /* contact form */
  document.getElementById("contactForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const st = document.getElementById("formStatus");
    if (![...data.values()].every((v) => String(v).trim())) {
      if (st) st.textContent = "填全再发。";
      return;
    }
    if (st) st.textContent = "收到。我们尽快回——欧了。";
    form.reset();
  });

  /* home voice */
  const voice = document.getElementById("brandVoice");
  document.getElementById("playVoice")?.addEventListener("click", async () => {
    if (!voice) return;
    try {
      if (voice.paused) await voice.play();
      else voice.pause();
    } catch {
      /* */
    }
  });

  /* command palette */
  const MODULES = [
    { t: "首页", h: "index.html", k: "HOME" },
    { t: "作品硬仗", h: "work.html", k: "WORK" },
    { t: "作品档案", h: "archive.html", k: "ARCHIVE" },
    { t: "片源放映厅", h: "film.html", k: "FILM" },
    { t: "竖屏片场", h: "cinema.html", k: "CINEMA" },
    { t: "彪哥语录墙", h: "quotes.html", k: "QUOTES" },
    { t: "彪哥电台", h: "radio.html", k: "RADIO" },
    { t: "特效舞台", h: "stage.html", k: "STAGE" },
    { t: "动能字墙", h: "typefx.html", k: "TYPEFX" },
    { t: "土酷混剪", h: "mix.html", k: "MIX" },
    { t: "夜市灯牌", h: "night-market.html", k: "MARKET" },
    { t: "导览台", h: "dashboard.html", k: "DASH" },
    { t: "硬仗导览", h: "tour.html", k: "TOUR" },
    { t: "土酷对决", h: "duel.html", k: "DUEL" },
    { t: "四格蒙太奇", h: "montage.html", k: "MONTAGE" },
    { t: "硬仗荣誉墙", h: "fame.html", k: "FAME" },
    { t: "硬话胶囊", h: "capsule.html", k: "CAPSULE" },
    { t: "节拍盖章", h: "beatdrop.html", k: "BEAT" },
    { t: "硬话红包雨", h: "redpack.html", k: "REDPACK" },
    { t: "盖章机", h: "chop.html", k: "CHOP" },
    { t: "胶片横滑", h: "filmstrip.html", k: "STRIP" },
    { t: "酒桌转盘", h: "banquet.html", k: "BANQUET" },
    { t: "土酷分屏", h: "splitscroll.html", k: "SPLIT" },
    { t: "班底海报卡", h: "cast.html", k: "CAST" },
    { t: "团队介绍", h: "team.html", k: "TEAM" },
    { t: "滚动叙事", h: "stories.html", k: "STORIES" },
    { t: "新二流信息流", h: "xin2.html", k: "XIN2" },
    { t: "实验室", h: "lab.html", k: "LAB" },
    { t: "系统地图", h: "system.html", k: "SYSTEM" },
    { t: "服务", h: "services.html", k: "SERVICES" },
    { t: "流程", h: "process.html", k: "PROCESS" },
    { t: "关于", h: "about.html", k: "ABOUT" },
    { t: "信条", h: "creed.html", k: "CREED" },
    { t: "媒体资料", h: "press.html", k: "PRESS" },
    { t: "伪直播间", h: "live.html", k: "LIVE" },
    { t: "彪哥音板", h: "soundboard.html", k: "SOUND" },
    { t: "夜场", h: "night.html", k: "NIGHT" },
    { t: "文字风暴", h: "storm.html", k: "STORM" },
    { t: "土酷海报机", h: "poster.html", k: "POSTER" },
    { t: "土酷连招", h: "combo.html", k: "COMBO" },
    { t: "语录烟花", h: "fireworks.html", k: "FIRE" },
    { t: "录像带", h: "vhs.html", k: "VHS" },
    { t: "硬仗终端", h: "terminal.html", k: "CLI" },
    { t: "库房", h: "vault.html", k: "VAULT" },
    { t: "开干", h: "contact.html", k: "CONTACT" },
  ];

  const mountCmd = () => {
    if (document.getElementById("cmdOverlay")) return;
    const overlay = document.createElement("div");
    overlay.className = "cmd-overlay";
    overlay.id = "cmdOverlay";
    overlay.innerHTML = `
      <div class="cmd-panel" role="dialog" aria-label="命令面板">
        <input id="cmdInput" type="search" placeholder="搜模块：语录 / 片源 / 舞台 / 新二…" autocomplete="off" />
        <ul class="cmd-list" id="cmdList"></ul>
        <div class="cmd-hint"><span>↑↓ 选择 · Enter 进入</span><span>Esc 关闭 · ⌘K</span></div>
      </div>`;
    document.body.appendChild(overlay);
    const fab = document.createElement("button");
    fab.type = "button";
    fab.className = "cmd-fab";
    fab.id = "cmdFab";
    fab.setAttribute("aria-label", "打开命令面板");
    fab.textContent = "⌘K";
    document.body.appendChild(fab);

    const input = document.getElementById("cmdInput");
    const list = document.getElementById("cmdList");
    let active = 0;
    let filtered = MODULES.slice();

    const render = () => {
      list.innerHTML = filtered
        .map(
          (m, i) =>
            `<li><button type="button" data-i="${i}" class="${i === active ? "is-active" : ""}"><b>${m.t}</b><span>${m.k}</span></button></li>`
        )
        .join("");
      list.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", () => {
          location.href = filtered[Number(btn.dataset.i)].h;
        });
      });
    };

    const open = () => {
      overlay.classList.add("is-open");
      filtered = MODULES.slice();
      active = 0;
      render();
      input.value = "";
      setTimeout(() => input.focus(), 10);
    };
    const close = () => {
      overlay.classList.remove("is-open");
      input.blur();
    };

    fab.addEventListener("click", open);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      filtered = MODULES.filter(
        (m) => m.t.toLowerCase().includes(q) || m.k.toLowerCase().includes(q) || m.h.includes(q)
      );
      active = 0;
      render();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        active = Math.min(filtered.length - 1, active + 1);
        render();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        active = Math.max(0, active - 1);
        render();
      } else if (e.key === "Enter" && filtered[active]) {
        e.preventDefault();
        location.href = filtered[active].h;
      } else if (e.key === "Escape") {
        close();
      }
    });
    addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (overlay.classList.contains("is-open")) close();
        else open();
      }
      if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
    });
  };
  mountCmd();

  /* archive filters */
  const archBar = document.getElementById("archiveBar");
  if (archBar) {
    const cards = [...document.querySelectorAll("[data-arch]")];
    archBar.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        archBar.querySelectorAll("button").forEach((b) => b.classList.remove("is-on"));
        btn.classList.add("is-on");
        const f = btn.dataset.filter || "all";
        cards.forEach((c) => {
          const ok = f === "all" || (c.dataset.arch || "").includes(f);
          c.classList.toggle("is-hidden", !ok);
        });
      });
    });
    cards.forEach((card) => {
      const vid = card.querySelector("video");
      if (!vid || !fine || reduce) return;
      card.addEventListener("pointerenter", () => {
        card.classList.add("is-hot");
        vid.play().catch(() => {});
      });
      card.addEventListener("pointerleave", () => {
        card.classList.remove("is-hot");
        vid.pause();
        try {
          vid.currentTime = 0;
        } catch {
          /* */
        }
      });
    });
  }

  /* stage playground */
  const stageCanvas = document.getElementById("stageCanvas");
  if (stageCanvas && !reduce) {
    const ctx = stageCanvas.getContext("2d");
    const wrap = stageCanvas.parentElement;
    const titleEl = document.getElementById("stageQuote");
    const lines = [
      "小树不倒我就不倒",
      "那长相就是证据",
      "你就慢慢跟我处",
      "本市著名硬仗",
      "欧了",
      "少，是刃",
      "酷是壳 · 土是芯",
      "该出手时就出手",
    ];
    let stamps = [];
    let sparks = [];
    let mode = "stamp";
    let glitch = false;
    const resize = () => {
      const r = wrap.getBoundingClientRect();
      stageCanvas.width = r.width * devicePixelRatio;
      stageCanvas.height = r.height * devicePixelRatio;
      stageCanvas.style.width = `${r.width}px`;
      stageCanvas.style.height = `${r.height}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    addEventListener("resize", resize, { passive: true });

    const burst = (x, y) => {
      const text = lines[(Math.random() * lines.length) | 0];
      if (titleEl) titleEl.textContent = text;
      stamps.push({
        x,
        y,
        text,
        rot: (Math.random() - 0.5) * 0.8,
        life: 1,
        size: 14 + Math.random() * 18,
        color: Math.random() > 0.5 ? "#e8341a" : "#ffe14a",
      });
      for (let i = 0; i < 18; i++) {
        sparks.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 1,
          c: Math.random() > 0.5 ? "#ffe14a" : "#e8341a",
        });
      }
    };

    stageCanvas.addEventListener("pointerdown", (e) => {
      const r = stageCanvas.getBoundingClientRect();
      burst(e.clientX - r.left, e.clientY - r.top);
    });

    document.getElementById("stageBurst")?.addEventListener("click", () => {
      const r = stageCanvas.getBoundingClientRect();
      for (let i = 0; i < 6; i++) burst(Math.random() * r.width, Math.random() * r.height);
    });
    document.getElementById("stageGlitch")?.addEventListener("click", (e) => {
      glitch = !glitch;
      document.body.classList.toggle("stage-glitch", glitch);
      e.currentTarget.classList.toggle("is-on", glitch);
    });
    document.getElementById("stageClear")?.addEventListener("click", () => {
      stamps = [];
      sparks = [];
    });

    const tick = () => {
      const r = stageCanvas.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      // grid
      ctx.strokeStyle = "rgba(255,225,74,0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < r.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, r.height);
        ctx.stroke();
      }
      for (let y = 0; y < r.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(r.width, y);
        ctx.stroke();
      }
      stamps = stamps.filter((s) => s.life > 0.02);
      for (const s of stamps) {
        s.life *= 0.992;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.globalAlpha = s.life;
        ctx.strokeStyle = s.color;
        ctx.fillStyle = s.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, s.size + 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.font = `900 ${s.size}px "Noto Sans SC", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(s.text.slice(0, 6), 0, 0);
        ctx.restore();
      }
      sparks = sparks.filter((p) => p.life > 0.02);
      for (const p of sparks) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.life *= 0.96;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x, p.y, 2.5, 2.5);
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    };
    tick();
  }

  /* cinema autoplay on snap */
  const reel = document.getElementById("cinemaReel");
  if (reel) {
    const shots = [...reel.querySelectorAll(".cinema-shot")];
    const playVisible = () => {
      const top = reel.scrollTop;
      const h = reel.clientHeight;
      shots.forEach((shot) => {
        const vid = shot.querySelector("video");
        if (!vid) return;
        const mid = shot.offsetTop + shot.offsetHeight / 2;
        const on = mid > top && mid < top + h;
        if (on) vid.play().catch(() => {});
        else {
          vid.pause();
        }
      });
    };
    reel.addEventListener("scroll", playVisible, { passive: true });
    playVisible();
  }

  /* radio deck */
  const radioDeck = document.getElementById("radioDeck");
  if (radioDeck) {
    const tracks = [...radioDeck.querySelectorAll("[data-radio-src]")];
    const now = document.getElementById("radioNow");
    const playBtn = document.getElementById("radioPlay");
    let audio = null;
    let idx = 0;

    const setTrack = async (i, autoplay = true) => {
      idx = (i + tracks.length) % tracks.length;
      tracks.forEach((t, n) => t.classList.toggle("is-on", n === idx));
      const src = tracks[idx].dataset.radioSrc;
      const label = tracks[idx].dataset.radioLabel || tracks[idx].textContent;
      if (now) now.innerHTML = `正在放送：<em>${label}</em>`;
      if (audio) {
        audio.pause();
        audio = null;
      }
      audio = new Audio(src);
      audio.addEventListener("ended", () => setTrack(idx + 1, true));
      radioDeck.classList.toggle("is-on", autoplay);
      if (playBtn) playBtn.textContent = autoplay ? "❚❚ 暂停" : "▶ 播放";
      if (autoplay) {
        try {
          await audio.play();
        } catch {
          radioDeck.classList.remove("is-on");
          if (playBtn) playBtn.textContent = "▶ 播放";
        }
      }
    };

    tracks.forEach((btn, i) => btn.addEventListener("click", () => setTrack(i, true)));
    playBtn?.addEventListener("click", async () => {
      if (!audio) {
        await setTrack(idx, true);
        return;
      }
      if (audio.paused) {
        try {
          await audio.play();
          radioDeck.classList.add("is-on");
          playBtn.textContent = "❚❚ 暂停";
        } catch {
          /* */
        }
      } else {
        audio.pause();
        radioDeck.classList.remove("is-on");
        playBtn.textContent = "▶ 播放";
      }
    });
    document.getElementById("radioNext")?.addEventListener("click", () => setTrack(idx + 1, true));
    document.getElementById("radioPrev")?.addEventListener("click", () => setTrack(idx - 1, true));
    if (tracks[0]) {
      const label = tracks[0].dataset.radioLabel || tracks[0].textContent;
      if (now) now.innerHTML = `待命：<em>${label}</em>`;
      tracks[0].classList.add("is-on");
    }
  }

  /* dashboard clock + quote feed */
  const dashClock = document.getElementById("dashClock");
  const dashFeed = document.getElementById("dashFeed");
  if (dashClock) {
    const tickClock = () => {
      const d = new Date();
      dashClock.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()]
        .map((n) => String(n).padStart(2, "0"))
        .join(":");
    };
    tickClock();
    setInterval(tickClock, 1000);
  }
  if (dashFeed) {
    const lines = [
      "小树不倒我就不倒",
      "那长相就是证据",
      "你就慢慢跟我处",
      "本市著名硬仗",
      "欧了",
      "少，是刃",
      "酷是壳 · 土是芯",
      "该出手时就出手",
    ];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % lines.length;
      const p = document.createElement("p");
      p.innerHTML = `<em>${lines[i]}</em>`;
      dashFeed.prepend(p);
      while (dashFeed.children.length > 6) dashFeed.lastElementChild?.remove();
    }, 2800);
  }

  /* typefx kinetic wall */
  const typeWord = document.getElementById("typefxWord");
  if (typeWord) {
    const lines = [
      "小树不倒<br /><em>我就不倒</em>",
      "那长相<br /><em>就是证据</em>",
      "你就慢慢<br /><em>跟我处</em>",
      "本市著名<br /><em>硬仗</em>",
      "少，<br /><em>是刃</em>",
      "酷是壳<br /><em>土是芯</em>",
      "不生产<br /><em>模板</em>",
      "欧了<br /><em>开干</em>",
    ];
    let idx = 0;
    const bar = document.getElementById("typefxBar");
    const meta = document.getElementById("typefxMeta");
    const apply = (i) => {
      idx = (i + lines.length) % lines.length;
      typeWord.innerHTML = lines[idx];
      if (meta) meta.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(lines.length).padStart(2, "0")} · 范德彪`;
      const t = idx / (lines.length - 1 || 1);
      typeWord.style.transform = `skewX(${(t - 0.5) * -8}deg) scale(${1 + t * 0.08})`;
      typeWord.style.filter = t > 0.7 ? "contrast(1.15)" : "none";
    };
    apply(0);
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const p = Math.min(1, scrollY / max);
      if (bar) bar.style.width = `${p * 100}%`;
      const next = Math.min(lines.length - 1, Math.floor(p * lines.length));
      if (next !== idx) apply(next);
    };
    addEventListener("scroll", onScroll, { passive: true });
    document.getElementById("typefxPrev")?.addEventListener("click", () => apply(idx - 1));
    document.getElementById("typefxNext")?.addEventListener("click", () => apply(idx + 1));
    document.getElementById("typefxGlitch")?.addEventListener("click", () => {
      typeWord.style.transform = "translate(4px,-2px) skewX(-12deg)";
      typeWord.style.color = "var(--seal)";
      setTimeout(() => {
        typeWord.style.color = "";
        apply(idx);
      }, 180);
    });
  }

  /* mix dual video */
  const mixTu = document.getElementById("mixTu");
  const mixKu = document.getElementById("mixKu");
  if (mixTu && mixKu) {
    const caps = [
      ["那长相就是证据", "少 · 是刃"],
      ["人间烟火", "电影画幅"],
      ["你就慢慢跟我处", "小树不倒"],
      ["夜市灯牌", "系统交付"],
      ["欧了", "开干"],
    ];
    let capI = 0;
    const playBoth = async () => {
      try {
        await Promise.all([mixTu.play(), mixKu.play()]);
      } catch {
        /* */
      }
    };
    document.getElementById("mixPlay")?.addEventListener("click", playBoth);
    document.getElementById("mixSwap")?.addEventListener("click", () => {
      const a = document.getElementById("mixCapTu");
      const b = document.getElementById("mixCapKu");
      if (!a || !b) return;
      const t = a.textContent;
      a.textContent = b.textContent;
      b.textContent = t;
    });
    document.getElementById("mixShuffle")?.addEventListener("click", () => {
      capI = (capI + 1) % caps.length;
      const a = document.getElementById("mixCapTu");
      const b = document.getElementById("mixCapKu");
      if (a) a.textContent = caps[capI][0];
      if (b) b.textContent = caps[capI][1];
    });
    document.getElementById("mixRateTu")?.addEventListener("input", (e) => {
      mixTu.playbackRate = Number(e.target.value) || 1;
    });
    document.getElementById("mixRateKu")?.addEventListener("input", (e) => {
      mixKu.playbackRate = Number(e.target.value) || 1;
    });
  }

  /* night market */
  const marketWall = document.getElementById("marketWall");
  if (marketWall) {
    let paused = false;
    document.getElementById("marketPause")?.addEventListener("click", () => {
      paused = !paused;
      marketWall.querySelectorAll(".market-row").forEach((r) => {
        r.style.animationPlayState = paused ? "paused" : "running";
      });
    });
    document.getElementById("marketBoost")?.addEventListener("click", () => {
      marketWall.style.filter = "brightness(1.35) saturate(1.4)";
      setTimeout(() => {
        marketWall.style.filter = "";
      }, 400);
    });
    const stamps = ["哈拉少<br />硬仗<br />主打", "范德彪<br />主理", "土是芯<br />酷是壳", "欧了<br />开干"];
    let si = 0;
    document.getElementById("marketStamp")?.addEventListener("click", () => {
      si = (si + 1) % stamps.length;
      const el = document.getElementById("marketSeal");
      if (el) el.innerHTML = stamps[si];
    });
  }

  /* duel TU vs KU */
  const duelArena = document.getElementById("duelArena");
  if (duelArena) {
    let tu = 0;
    let ku = 0;
    const meterTu = document.getElementById("meterTu");
    const meterKu = document.getElementById("meterKu");
    const scoreTu = document.getElementById("scoreTu");
    const scoreKu = document.getElementById("scoreKu");
    const flash = document.getElementById("duelFlash");
    const lines = [
      "酷是壳，土是芯——叠在一起才是哈拉少。",
      "小树不倒我就不倒。",
      "那长相就是证据。",
      "少，是刃。",
      "欧了。两边都要。",
    ];
    const paint = () => {
      if (meterTu) meterTu.style.width = `${tu}%`;
      if (meterKu) meterKu.style.width = `${ku}%`;
      if (scoreTu) scoreTu.textContent = `${tu}%`;
      if (scoreKu) scoreKu.textContent = `${ku}%`;
    };
    const hit = (side) => {
      if (side === "tu") tu = Math.min(100, tu + 8);
      else ku = Math.min(100, ku + 8);
      paint();
      if (tu >= 100 && ku >= 100 && flash) {
        flash.textContent = lines[(Math.random() * lines.length) | 0];
        flash.classList.add("is-on");
        setTimeout(() => flash.classList.remove("is-on"), 1400);
        tu = 0;
        ku = 0;
        paint();
      }
    };
    document.getElementById("duelTu")?.addEventListener("click", () => hit("tu"));
    document.getElementById("duelKu")?.addEventListener("click", () => hit("ku"));
    document.getElementById("duelReset")?.addEventListener("click", () => {
      tu = 0;
      ku = 0;
      paint();
    });
  }

  /* montage grid */
  const montGrid = document.getElementById("montageGrid");
  if (montGrid) {
    const cells = [...montGrid.querySelectorAll("[data-mont]")];
    const vids = cells.map((c) => c.querySelector("video")).filter(Boolean);
    document.getElementById("montPlayAll")?.addEventListener("click", () => {
      vids.forEach((v) => v.play().catch(() => {}));
    });
    document.getElementById("montPauseAll")?.addEventListener("click", () => {
      vids.forEach((v) => v.pause());
    });
    const caps = [
      "小树不倒",
      "那长相就是证据",
      "你就慢慢跟我处",
      "少 · 是刃",
      "酷是壳 · 土是芯",
      "本市著名硬仗",
      "欧了",
      "该出手时就出手",
    ];
    document.getElementById("montShuffleCap")?.addEventListener("click", () => {
      cells.forEach((c, i) => {
        const cap = c.querySelector(".mont-cap");
        if (cap) cap.textContent = caps[(i + ((Math.random() * caps.length) | 0)) % caps.length];
      });
    });
    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        const was = cell.classList.contains("is-solo");
        cells.forEach((c) => c.classList.remove("is-solo"));
        montGrid.classList.remove("is-solo-mode");
        if (!was) {
          cell.classList.add("is-solo");
          montGrid.classList.add("is-solo-mode");
          cell.querySelector("video")?.play().catch(() => {});
        }
      });
    });
  }

  /* fame wall hover video */
  document.querySelectorAll("[data-fame]").forEach((card) => {
    const vid = card.querySelector("video");
    if (!vid || !fine || reduce) return;
    card.addEventListener("pointerenter", () => {
      card.classList.add("is-hot");
      vid.play().catch(() => {});
    });
    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-hot");
      vid.pause();
      try {
        vid.currentTime = 0;
      } catch {
        /* */
      }
    });
  });

  /* capsule flip */
  document.querySelectorAll("[data-capsule]").forEach((cap) => {
    cap.addEventListener("click", () => cap.classList.toggle("is-flip"));
  });

  /* beat drop */
  const beatCanvas = document.getElementById("beatCanvas");
  if (beatCanvas && !reduce) {
    const stage = document.getElementById("beatStage");
    const ctx = beatCanvas.getContext("2d");
    const quoteEl = document.getElementById("beatQuote");
    const pulse = document.getElementById("beatPulse");
    const countEl = document.getElementById("beatCount");
    const lines = [
      "小树不倒<br /><em>我就不倒</em>",
      "那长相<br /><em>就是证据</em>",
      "你就慢慢<br /><em>跟我处</em>",
      "少，<br /><em>是刃</em>",
      "酷是壳<br /><em>土是芯</em>",
      "欧了",
      "本市著名<br /><em>硬仗</em>",
      "该出手时<br /><em>就出手</em>",
    ];
    let particles = [];
    let hits = 0;
    let auto = null;
    let qi = 0;
    const resize = () => {
      const r = stage.getBoundingClientRect();
      beatCanvas.width = r.width * devicePixelRatio;
      beatCanvas.height = r.height * devicePixelRatio;
      beatCanvas.style.width = `${r.width}px`;
      beatCanvas.style.height = `${r.height}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    addEventListener("resize", resize, { passive: true });
    const drop = () => {
      hits += 1;
      if (countEl) countEl.textContent = `HITS ${hits}`;
      qi = (qi + 1) % lines.length;
      if (quoteEl) quoteEl.innerHTML = lines[qi];
      pulse?.classList.remove("is-on");
      void pulse?.offsetWidth;
      pulse?.classList.add("is-on");
      const r = stage.getBoundingClientRect();
      const cx = r.width / 2;
      const cy = r.height / 2;
      for (let i = 0; i < 28; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 2 + Math.random() * 6;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 1,
          c: Math.random() > 0.45 ? "#e8341a" : "#ffe14a",
          s: 2 + Math.random() * 4,
        });
      }
    };
    document.getElementById("beatHit")?.addEventListener("click", drop);
    addEventListener("keydown", (e) => {
      if (e.code === "Space" && document.getElementById("beatStage")) {
        e.preventDefault();
        drop();
      }
    });
    document.getElementById("beatAuto")?.addEventListener("click", (e) => {
      if (auto) {
        clearInterval(auto);
        auto = null;
        e.currentTarget.classList.remove("is-on");
        e.currentTarget.textContent = "自动节拍";
      } else {
        auto = setInterval(drop, 520);
        e.currentTarget.classList.add("is-on");
        e.currentTarget.textContent = "停止自动";
      }
    });
    document.getElementById("beatClear")?.addEventListener("click", () => {
      particles = [];
      hits = 0;
      if (countEl) countEl.textContent = "HITS 0";
    });
    const tick = () => {
      const r = stage.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      particles = particles.filter((p) => p.life > 0.02);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life *= 0.94;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    };
    tick();
  }

  /* redpack rain */
  const rpFall = document.getElementById("rpFall");
  if (rpFall) {
    const lines = [
      "小树不倒我就不倒。",
      "那长相就是证据。",
      "你就慢慢跟我处。",
      "本市著名硬仗，都是我主打的。",
      "少，是刃。",
      "酷是壳，土是芯。",
      "欧了。",
      "该出手时就出手。",
    ];
    const modal = document.getElementById("rpModal");
    const textEl = document.getElementById("rpText");
    const spawn = (n = 14) => {
      for (let i = 0; i < n; i++) {
        const el = document.createElement("button");
        el.type = "button";
        el.className = "rp-item";
        el.style.left = `${8 + Math.random() * 84}%`;
        el.style.animationDuration = `${3.2 + Math.random() * 3.5}s`;
        el.style.animationDelay = `${Math.random() * 1.2}s`;
        el.addEventListener("click", () => {
          if (textEl) textEl.textContent = lines[(Math.random() * lines.length) | 0];
          modal?.classList.add("is-on");
        });
        el.addEventListener("animationend", () => el.remove());
        rpFall.appendChild(el);
      }
    };
    spawn(16);
    document.getElementById("rpBurst")?.addEventListener("click", () => spawn(18));
    document.getElementById("rpClose")?.addEventListener("click", () => modal?.classList.remove("is-on"));
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("is-on");
    });
  }

  /* chop stamp canvas */
  const chopStage = document.getElementById("chopStage");
  if (chopStage) {
    const canvas = document.getElementById("chopCanvas");
    const ctx = canvas.getContext("2d");
    const hint = document.getElementById("chopHint");
    const countEl = document.getElementById("chopCount");
    const phrases = ["哈拉少", "硬仗", "欧了", "少是刃", "土是芯", "范德彪", "开干", "不模板"];
    let count = 0;
    const resize = () => {
      const r = chopStage.getBoundingClientRect();
      canvas.width = r.width * devicePixelRatio;
      canvas.height = r.height * devicePixelRatio;
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    addEventListener("resize", resize, { passive: true });
    const stamp = (x, y) => {
      hint && (hint.style.display = "none");
      count += 1;
      if (countEl) countEl.textContent = `SEALS ${count}`;
      const text = phrases[(Math.random() * phrases.length) | 0];
      const rot = (Math.random() - 0.5) * 0.9;
      const r = 28 + Math.random() * 18;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.strokeStyle = "rgba(232,52,26,0.9)";
      ctx.fillStyle = "rgba(232,52,26,0.85)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, r - 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = `900 ${Math.max(12, r * 0.45)}px "Noto Sans SC", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 0, 0);
      ctx.restore();
    };
    chopStage.addEventListener("pointerdown", (e) => {
      const r = chopStage.getBoundingClientRect();
      stamp(e.clientX - r.left, e.clientY - r.top);
    });
    document.getElementById("chopClear")?.addEventListener("click", () => {
      const r = chopStage.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      count = 0;
      if (countEl) countEl.textContent = "SEALS 0";
      if (hint) hint.style.display = "";
    });
    document.getElementById("chopRain")?.addEventListener("click", () => {
      const r = chopStage.getBoundingClientRect();
      for (let i = 0; i < 10; i++) {
        stamp(40 + Math.random() * (r.width - 80), 40 + Math.random() * (r.height - 100));
      }
    });
  }

  /* filmstrip autoplay center */
  const filmstrip = document.getElementById("filmstrip");
  if (filmstrip) {
    const cards = [...filmstrip.querySelectorAll(".filmstrip-card")];
    const sync = () => {
      const mid = filmstrip.scrollLeft + filmstrip.clientWidth / 2;
      cards.forEach((card) => {
        const c = card.offsetLeft + card.offsetWidth / 2;
        const vid = card.querySelector("video");
        if (!vid) return;
        if (Math.abs(c - mid) < card.offsetWidth * 0.55) vid.play().catch(() => {});
        else vid.pause();
      });
    };
    filmstrip.addEventListener("scroll", sync, { passive: true });
    sync();
    cards[0]?.querySelector("video")?.play().catch(() => {});
  }

  /* banquet wheel */
  const banquetWheel = document.getElementById("banquetWheel");
  if (banquetWheel) {
    const results = [
      "「小树不倒我就不倒。」",
      "「那长相就是证据。」",
      "「你就慢慢跟我处。」",
      "「本市著名硬仗。」",
      "「少，是刃。」",
      "「酷是壳，土是芯。」",
      "「欧了。」",
      "「该出手时就出手。」",
    ];
    let angle = 0;
    let spinning = false;
    document.getElementById("banquetSpin")?.addEventListener("click", () => {
      if (spinning) return;
      spinning = true;
      const idx = (Math.random() * results.length) | 0;
      angle += 1440 + idx * (360 / results.length) + Math.random() * 20;
      banquetWheel.style.transform = `rotate(${angle}deg)`;
      setTimeout(() => {
        const el = document.getElementById("banquetResult");
        if (el) el.textContent = results[idx] + " —— 范德彪";
        spinning = false;
      }, 3200);
    });
  }
})();
