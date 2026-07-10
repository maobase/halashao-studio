/* HALASHAO shell — particles · quotes · kinetic · film */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase() || "index.html";
  document.querySelectorAll("[data-nav], .drawer a[href]").forEach((a) => {
    const href = (a.getAttribute("href") || "").split("/").pop().toLowerCase();
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("is-active");
      a.setAttribute("aria-current", "page");
    }
  });

  /* prefetch client-critical pages on intent */
  const prefetchOnce = new Set();
  const prefetch = (href) => {
    if (!href || prefetchOnce.has(href) || !href.endsWith(".html")) return;
    prefetchOnce.add(href);
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = href;
    document.head.appendChild(link);
  };
  document.querySelectorAll("a[href$='.html']").forEach((a) => {
    const href = a.getAttribute("href");
    a.addEventListener("pointerenter", () => prefetch(href), { passive: true, once: true });
    a.addEventListener("focus", () => prefetch(href), { once: true });
  });
  ["about.html", "services.html", "team.html", "work.html", "contact.html", "tour.html"].forEach(prefetch);

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
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && burger?.getAttribute("aria-expanded") === "true") setDrawer(false);
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
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !email || !message) {
      if (st) st.textContent = "请填全名字、邮箱与项目简述。";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (st) st.textContent = "请填写有效邮箱。";
      return;
    }
    if (st) st.textContent = "意向已记录。正式沟通请同步邮件 hello@halashao.studio。";
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

  /* command palette — client path first, then demo branches */
  const MODULES = [
    { t: "首页", h: "index.html", k: "HOME", a: "哈拉少 东北" },
    { t: "关于工作室", h: "about.html", k: "ABOUT", a: "东北 土酷 身份" },
    { t: "服务", h: "services.html", k: "SERVICES", a: "品牌 产品 全案 跨尺度" },
    { t: "合作流程", h: "process.html", k: "PROCESS", a: "对齐 锻造 淬火 上线" },
    { t: "作品硬仗", h: "work.html", k: "WORK", a: "熔光 墨界 脉冲 野市 案例" },
    { t: "作品档案", h: "archive.html", k: "ARCHIVE", a: "筛选 硬仗" },
    { t: "团队介绍", h: "team.html", k: "TEAM", a: "范德彪 新二 雨姐 老蒯 小阿giao 吴总 马大帅 班底" },
    { t: "班底海报卡", h: "cast.html", k: "CAST", a: "范德彪 海报 人物卡" },
    { t: "片源放映厅", h: "film.html", k: "FILM", a: "视频 播放 片源" },
    { t: "竖屏片场", h: "cinema.html", k: "CINEMA", a: "新二 竖屏 短视频" },
    { t: "片源时间轴", h: "scrub.html", k: "SCRUB", a: "scrub 字幕" },
    { t: "彪哥语录墙", h: "quotes.html", k: "QUOTES", a: "范德彪 硬话 语录" },
    { t: "彪哥电台", h: "radio.html", k: "RADIO", a: "范德彪 音频 连播" },
    { t: "工作室叙事", h: "stories.html", k: "STORIES", a: "滚动 五章 故事" },
    { t: "工作室信条", h: "creed.html", k: "CREED", a: "立场 纪律" },
    { t: "媒体资料", h: "press.html", k: "PRESS", a: "口径 品牌 色彩" },
    { t: "客户走查导览", h: "tour.html", k: "TOUR", a: "评审 演示 客户 走查" },
    { t: "导览台", h: "dashboard.html", k: "DASH", a: "总控 捷径" },
    { t: "系统地图", h: "system.html", k: "SYSTEM", a: "全站 地图 模块" },
    { t: "开干", h: "contact.html", k: "CONTACT", a: "联系 合作 邮箱 项目" },
    { t: "招人", h: "recruit.html", k: "RECRUIT", a: "招聘 岗位" },
    { t: "实验室", h: "lab.html", k: "LAB", a: "特效 演示 模块" },
    { t: "三秒钩子机", h: "hook.html", k: "HOOK" },
    { t: "贴图轰炸", h: "stickers.html", k: "STICKER" },
    { t: "硬切变焦", h: "zoomcut.html", k: "ZOOM" },
    { t: "落麦硬话", h: "micdrop.html", k: "MIC" },
    { t: "九宫格土酷", h: "gridmix.html", k: "GRID9" },
    { t: "硬仗台账", h: "ledger.html", k: "LEDGER" },
    { t: "评论区硬话", h: "comment.html", k: "COMMENT" },
    { t: "快闪硬话", h: "flash.html", k: "FLASH" },
    { t: "土酷对口", h: "duet.html", k: "DUET" },
    { t: "硬仗血条", h: "bossbar.html", k: "BOSS" },
    { t: "公章墙", h: "sealwall.html", k: "SEALWALL" },
    { t: "打字机硬话", h: "typecast.html", k: "TYPECAST" },
    { t: "刷礼硬话", h: "gifts.html", k: "GIFTS", a: "直播 刷礼 礼物" },
    { t: "歌词硬话", h: "lyric.html", k: "LYRIC", a: "卡拉OK 跟拍 歌词" },
    { t: "波形硬话", h: "wave.html", k: "WAVE", a: "音频 波形 节拍" },
    { t: "钉住叙事", h: "pin.html", k: "PIN", a: "滚动 钉住 章节" },
    { t: "分镜板", h: "board.html", k: "BOARD", a: "分镜 片源 提案" },
    { t: "气氛组特效", h: "riot.html", k: "RIOT", a: "粒子 风暴 特效 暴走" },
    { t: "花字姓名条", h: "overlay.html", k: "OVERLAY", a: "下三分 花字 班底 出场" },
    { t: "开播倒计时", h: "countdown.html", k: "COUNTDOWN", a: "直播 倒数 开播" },
    { t: "马赛克片源", h: "mosaic.html", k: "MOSAIC", a: "多格 片源 墙" },
    { t: "提词器硬话", h: "tele.html", k: "TELE", a: "提词 滚读 提案" },
    { t: "硬话热榜", h: "rank.html", k: "RANK", a: "热榜 点赞 排序" },
    { t: "吸附短片流", h: "snap.html", k: "SNAP", a: "竖滑 吸附 短视频" },
    { t: "土酷对照", h: "contrast.html", k: "CONTRAST" },
    { t: "硬话弹幕", h: "danmu.html", k: "DANMU" },
    { t: "霓虹硬话", h: "neon.html", k: "NEON" },
    { t: "硬仗盲盒", h: "hardbox.html", k: "HARDBOX" },
    { t: "硬话红包雨", h: "redpack.html", k: "REDPACK" },
    { t: "酒桌转盘", h: "banquet.html", k: "BANQUET" },
    { t: "盖章机", h: "chop.html", k: "CHOP" },
    { t: "胶片横滑", h: "filmstrip.html", k: "STRIP" },
    { t: "土酷分屏", h: "splitscroll.html", k: "SPLIT" },
    { t: "土酷对决", h: "duel.html", k: "DUEL" },
    { t: "四格蒙太奇", h: "montage.html", k: "MONTAGE" },
    { t: "硬仗荣誉墙", h: "fame.html", k: "FAME" },
    { t: "硬话胶囊", h: "capsule.html", k: "CAPSULE" },
    { t: "节拍盖章", h: "beatdrop.html", k: "BEAT" },
    { t: "特效舞台", h: "stage.html", k: "STAGE" },
    { t: "动能字墙", h: "typefx.html", k: "TYPEFX" },
    { t: "土酷混剪", h: "mix.html", k: "MIX" },
    { t: "夜市灯牌", h: "night-market.html", k: "MARKET" },
    { t: "新二流信息流", h: "xin2.html", k: "XIN2" },
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
  ];

  const mountCmd = () => {
    if (document.getElementById("cmdOverlay")) return;
    const overlay = document.createElement("div");
    overlay.className = "cmd-overlay";
    overlay.id = "cmdOverlay";
    overlay.innerHTML = `
      <div class="cmd-panel" role="dialog" aria-modal="true" aria-label="命令面板">
        <input id="cmdInput" type="search" placeholder="搜：服务 / 范德彪 / 团队 / 导览 / 片源…" autocomplete="off" />
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
      if (!filtered.length) {
        list.innerHTML = `<li class="cmd-empty">没有匹配模块。试试「服务」「团队」「导览」。</li>`;
        return;
      }
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
      list.querySelector("button.is-active")?.scrollIntoView({ block: "nearest" });
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
      filtered = MODULES.filter((m) => {
        const bag = `${m.t} ${m.k} ${m.h} ${m.a || ""}`.toLowerCase();
        return bag.includes(q) || m.h.includes(q);
      });
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


  /* ========== SYSTEM v8 handlers ========== */
  const HARD_LINES = [
    "小树不倒我就不倒",
    "那长相就是证据",
    "你就慢慢跟我处",
    "本市著名硬仗",
    "少，是刃",
    "酷是壳，土是芯",
    "欧了",
    "该出手时就出手",
    "跨尺度出刀",
    "不生产模板",
  ];

  /* danmu wall */
  const danmuLayer = document.getElementById("danmuLayer");
  if (danmuLayer) {
    const fireOne = (text) => {
      const el = document.createElement("span");
      el.className = "danmu-item" + (Math.random() > 0.66 ? " alt" : "") + (Math.random() > 0.82 ? " hot" : "");
      el.textContent = text || HARD_LINES[(Math.random() * HARD_LINES.length) | 0];
      const top = 8 + Math.random() * 78;
      el.style.top = `${top}%`;
      el.style.left = "100%";
      const dur = 6.5 + Math.random() * 5.5;
      el.style.animationDuration = `${dur}s`;
      el.addEventListener("animationend", () => el.remove());
      danmuLayer.appendChild(el);
    };
    const seed = () => {
      for (let i = 0; i < 5; i++) setTimeout(() => fireOne(), i * 280);
    };
    seed();
    document.getElementById("danmuFire")?.addEventListener("click", () => fireOne());
    document.getElementById("danmuStorm")?.addEventListener("click", () => {
      for (let i = 0; i < 16; i++) setTimeout(() => fireOne(), i * 90);
    });
    document.getElementById("danmuClear")?.addEventListener("click", () => {
      danmuLayer.innerHTML = "";
    });
  }

  /* hardbox loot */
  const hardboxCard = document.getElementById("hardboxCard");
  if (hardboxCard) {
    const loot = [
      { t: "品牌识别硬仗", d: "LOGO 系统、色彩语法、触点延展。地方气质进体系，不是贴贴纸。", q: "「那长相就是证据。」" },
      { t: "产品界面锻造", d: "信息架构、组件节奏、发布节奏。删到只剩必要。", q: "「少，是刃。」" },
      { t: "影像发布片", d: "片源系统、字幕气质、竖屏与横屏双轨。", q: "「酷是壳，土是芯。」" },
      { t: "餐饮零售全案", d: "包装、店招、菜单、短视频语法一条线。", q: "「本市著名硬仗。」" },
      { t: "空间叙事装置", d: "展陈动线、灯箱文案、可传播记忆点。", q: "「跨尺度出刀。」" },
      { t: "活动视觉气氛组", d: "主视觉、物料、动效、现场气氛组一锅端。", q: "「该出手时就出手。」" },
      { t: "内容语法重塑", d: "话术、字幕、封面、信息流节奏统一。", q: "「你就慢慢跟我处。」" },
      { t: "设计系统落地", d: "token、组件库、协作规范——上线后沟通成本下降。", q: "「不生产模板。」" },
    ];
    const title = document.getElementById("hardboxTitle");
    const desc = document.getElementById("hardboxDesc");
    const quote = document.getElementById("hardboxQuote");
    const open = () => {
      const item = loot[(Math.random() * loot.length) | 0];
      hardboxCard.classList.remove("is-spin");
      void hardboxCard.offsetWidth;
      hardboxCard.classList.add("is-spin");
      if (title) title.innerHTML = item.t.replace(/硬仗|锻造|全案|落地|重塑|片|装置|组/, (m) => `<em>${m}</em>`);
      if (desc) desc.textContent = item.d;
      if (quote) quote.textContent = item.q;
    };
    document.getElementById("hardboxOpen")?.addEventListener("click", open);
    document.getElementById("hardboxAgain")?.addEventListener("click", open);
  }

  /* neon hard words */
  const neonStage = document.getElementById("neonStage");
  if (neonStage) {
    const neonText = document.getElementById("neonText");
    const modes = ["", "mode-seal", "mode-ice"];
    let mi = 0;
    let qi = 0;
    const setLine = () => {
      if (!neonText) return;
      const line = HARD_LINES[qi % HARD_LINES.length];
      neonText.innerHTML = line.length > 6 ? line.replace(/(.{4})/, "$1<br />") : line;
      qi += 1;
    };
    document.getElementById("neonNext")?.addEventListener("click", setLine);
    document.getElementById("neonFlick")?.addEventListener("click", () => {
      neonStage.classList.remove("is-flick");
      void neonStage.offsetWidth;
      neonStage.classList.add("is-flick");
    });
    document.getElementById("neonColor")?.addEventListener("click", () => {
      modes.forEach((m) => m && neonStage.classList.remove(m));
      mi = (mi + 1) % modes.length;
      if (modes[mi]) neonStage.classList.add(modes[mi]);
    });
  }

  /* scrub timeline */
  const scrubVid = document.getElementById("scrubVid");
  if (scrubVid) {
    const range = document.getElementById("scrubRange");
    const cap = document.getElementById("scrubCap");
    const timeEl = document.getElementById("scrubTime");
    const note = document.getElementById("scrubNote");
    const marks = document.getElementById("scrubMarks");
    const playBtn = document.getElementById("scrubPlay");
    const nodes = [
      { p: 0.05, t: "小树不倒我就不倒" },
      { p: 0.22, t: "那长相就是证据" },
      { p: 0.4, t: "酷是壳，土是芯" },
      { p: 0.58, t: "少，是刃" },
      { p: 0.75, t: "本市著名硬仗" },
      { p: 0.9, t: "该出手时就出手" },
    ];
    let lastNode = -1;
    const fmt = (s) => {
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return `${m}:${String(sec).padStart(2, "0")}`;
    };
    const paintMarks = () => {
      if (!marks) return;
      marks.innerHTML = nodes.map((n) => `<i style="left:${n.p * 100}%"></i>`).join("");
    };
    paintMarks();
    const syncCap = (ratio) => {
      let idx = 0;
      for (let i = 0; i < nodes.length; i++) {
        if (ratio >= nodes[i].p) idx = i;
      }
      if (cap && idx !== lastNode) {
        lastNode = idx;
        cap.textContent = nodes[idx].t;
        cap.classList.remove("is-hit");
        void cap.offsetWidth;
        cap.classList.add("is-hit");
        if (note) note.textContent = `节点 ${idx + 1}/${nodes.length} · ${nodes[idx].t}`;
      }
    };
    const applyRange = () => {
      if (!range || !scrubVid.duration) return;
      const ratio = Number(range.value) / 1000;
      scrubVid.currentTime = ratio * scrubVid.duration;
      if (timeEl) timeEl.textContent = fmt(scrubVid.currentTime);
      syncCap(ratio);
    };
    scrubVid.addEventListener("loadedmetadata", () => {
      if (timeEl) timeEl.textContent = `0:00 / ${fmt(scrubVid.duration || 0)}`;
    });
    scrubVid.addEventListener("timeupdate", () => {
      if (!scrubVid.duration || !range) return;
      if (document.activeElement === range) return;
      const ratio = scrubVid.currentTime / scrubVid.duration;
      range.value = String(Math.round(ratio * 1000));
      if (timeEl) timeEl.textContent = `${fmt(scrubVid.currentTime)} / ${fmt(scrubVid.duration)}`;
      syncCap(ratio);
    });
    range?.addEventListener("input", () => {
      scrubVid.pause();
      if (playBtn) playBtn.textContent = "▶";
      applyRange();
    });
    playBtn?.addEventListener("click", () => {
      if (scrubVid.paused) {
        scrubVid.play().catch(() => {});
        playBtn.textContent = "❚❚";
      } else {
        scrubVid.pause();
        playBtn.textContent = "▶";
      }
    });
  }

  /* contrast slider */
  const contrastTu = document.getElementById("contrastTu");
  if (contrastTu) {
    const range = document.getElementById("contrastRange");
    const handle = document.getElementById("contrastHandle");
    const apply = (v) => {
      const n = Math.max(5, Math.min(95, Number(v) || 50));
      contrastTu.style.clipPath = `inset(0 ${100 - n}% 0 0)`;
      if (handle) handle.style.left = `${n}%`;
    };
    apply(range?.value || 50);
    range?.addEventListener("input", () => apply(range.value));
  }



  /* ========== SYSTEM v9 handlers ========== */
  /* 3s hook machine */
  const hookStage = document.getElementById("hookStage");
  if (hookStage) {
    const lines = [
      "小树不倒<br />我就不倒",
      "那长相<br />就是证据",
      "你就慢慢<br />跟我处",
      "少，是刃",
      "酷是壳<br />土是芯",
      "本市著名<br />硬仗",
      "欧了",
      "该出手时<br />就出手",
    ];
    const lineEl = document.getElementById("hookLine");
    const timerEl = document.getElementById("hookTimer");
    const bar = document.getElementById("hookBar");
    let i = 0;
    let t0 = performance.now();
    let auto = true;
    const punch = () => {
      hookStage.classList.remove("is-punch");
      void hookStage.offsetWidth;
      hookStage.classList.add("is-punch");
      if (lineEl) lineEl.innerHTML = lines[i % lines.length];
      i += 1;
      t0 = performance.now();
      setTimeout(() => hookStage.classList.remove("is-punch"), 380);
    };
    const tick = (now) => {
      if (!auto) {
        requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(1, (now - t0) / 3000);
      if (bar) bar.style.width = `${p * 100}%`;
      if (timerEl) timerEl.textContent = (3 - p * 3).toFixed(1);
      if (p >= 1) punch();
      requestAnimationFrame(tick);
    };
    punch();
    requestAnimationFrame(tick);
    document.getElementById("hookFire")?.addEventListener("click", punch);
    document.getElementById("hookBeat")?.addEventListener("click", () => {
      for (let n = 0; n < 3; n++) setTimeout(punch, n * 220);
    });
  }

  /* sticker bomb */
  const stickerLayer = document.getElementById("stickerLayer");
  if (stickerLayer) {
    const pool = [
      { c: "seal", t: "硬仗\n盖章" },
      { c: "seal", t: "欧了" },
      { c: "led", t: "小树不倒我就不倒" },
      { c: "led", t: "那长相就是证据" },
      { c: "led", t: "酷是壳 · 土是芯" },
      { c: "tag", t: "新二网感" },
      { c: "tag", t: "范德彪" },
      { c: "led", t: "少，是刃" },
      { c: "tag", t: "LIVE" },
      { c: "led", t: "该出手时就出手" },
    ];
    const drop = (n = 1) => {
      for (let k = 0; k < n; k++) {
        const item = pool[(Math.random() * pool.length) | 0];
        const el = document.createElement("span");
        el.className = `stk ${item.c}`;
        el.textContent = item.t.replace("\\n", "\n");
        if (item.c === "seal") el.innerHTML = item.t.replace("\n", "<br />");
        el.style.left = `${6 + Math.random() * 78}%`;
        el.style.top = `${8 + Math.random() * 70}%`;
        el.style.setProperty("--r", `${(Math.random() - 0.5) * 24}deg`);
        if (item.c === "led") el.style.transform = `rotate(var(--r))`;
        stickerLayer.appendChild(el);
      }
    };
    drop(5);
    document.getElementById("stickerBomb")?.addEventListener("click", () => drop(10));
    document.getElementById("stickerOne")?.addEventListener("click", () => drop(1));
    document.getElementById("stickerClear")?.addEventListener("click", () => {
      stickerLayer.innerHTML = "";
    });
  }

  /* zoom cut */
  const zoomStage = document.getElementById("zoomStage");
  if (zoomStage) {
    const caps = ["少，是刃", "小树不倒我就不倒", "那长相就是证据", "酷是壳，土是芯", "本市著名硬仗", "该出手时就出手", "欧了", "不生产模板"];
    const cap = document.getElementById("zoomCap");
    let zi = 0;
    let autoTimer = 0;
    const punch = () => {
      zoomStage.classList.remove("is-punch");
      void zoomStage.offsetWidth;
      zoomStage.classList.add("is-punch");
      if (cap) cap.textContent = caps[zi % caps.length];
      zi += 1;
      setTimeout(() => zoomStage.classList.remove("is-punch"), 320);
    };
    document.getElementById("zoomPunch")?.addEventListener("click", punch);
    document.getElementById("zoomAuto")?.addEventListener("click", (e) => {
      const btn = e.currentTarget;
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = 0;
        btn.textContent = "自动连切";
        return;
      }
      punch();
      autoTimer = setInterval(punch, 900);
      btn.textContent = "停止连切";
    });
  }

  /* mic drop */
  const micStage = document.getElementById("micStage");
  if (micStage) {
    const lines = ["欧了", "小树不倒我就不倒", "那长相就是证据", "少，是刃", "酷是壳，土是芯", "本市著名硬仗", "该出手时就出手", "不生产模板"];
    const line = document.getElementById("micLine");
    let mi = 0;
    const drop = () => {
      if (line) line.textContent = lines[mi % lines.length];
      mi += 1;
      micStage.classList.remove("is-drop");
      void micStage.offsetWidth;
      micStage.classList.add("is-drop");
    };
    document.getElementById("micDrop")?.addEventListener("click", drop);
    document.getElementById("micChain")?.addEventListener("click", () => {
      for (let n = 0; n < 3; n++) setTimeout(drop, n * 480);
    });
  }

  /* grid 9 */
  const grid9 = document.getElementById("grid9");
  if (grid9) {
    const cells = [...grid9.querySelectorAll(".g9-cell")];
    const cap = document.getElementById("grid9Cap");
    const activate = (cell) => {
      cells.forEach((c) => {
        c.classList.toggle("is-on", c === cell);
        const v = c.querySelector("video");
        if (!v) return;
        if (c === cell) v.play().catch(() => {});
        else v.pause();
      });
      if (cap) cap.textContent = `「${cell.dataset.cap || ""}。」—— 范德彪`;
    };
    cells.forEach((cell) => {
      cell.addEventListener("click", () => activate(cell));
      cell.addEventListener("mouseenter", () => {
        if (matchMedia("(pointer:fine)").matches) cell.querySelector("video")?.play().catch(() => {});
      });
      cell.addEventListener("mouseleave", () => {
        if (!cell.classList.contains("is-on")) cell.querySelector("video")?.pause();
      });
    });
    if (cells[0]) activate(cells[0]);
  }

  /* hard ledger */
  const ledger = document.getElementById("ledger");
  if (ledger) {
    const detail = document.getElementById("ledgerDetail");
    const vid = document.getElementById("ledgerVid");
    const title = document.getElementById("ledgerTitle");
    const desc = document.getElementById("ledgerDesc");
    const quote = document.getElementById("ledgerQuote");
    const rows = [...ledger.querySelectorAll(".ledger-row")];
    rows.forEach((row) => {
      row.addEventListener("click", () => {
        rows.forEach((r) => r.classList.remove("is-on"));
        row.classList.add("is-on");
        detail?.removeAttribute("hidden");
        if (title) title.textContent = row.querySelector("b")?.textContent || "";
        if (desc) desc.textContent = row.dataset.d || "";
        if (quote) quote.textContent = `「${row.dataset.q || ""}。」—— 主理人范德彪`;
        if (vid) {
          vid.poster = row.dataset.poster || "";
          vid.src = row.dataset.src || "";
          vid.play().catch(() => {});
        }
      });
    });
  }



  /* ========== SYSTEM v10 handlers ========== */
  const V10_LINES = [
    "小树不倒我就不倒",
    "那长相就是证据",
    "你就慢慢跟我处",
    "本市著名硬仗",
    "少，是刃",
    "酷是壳，土是芯",
    "欧了",
    "该出手时就出手",
    "不生产模板",
    "跨尺度出刀",
  ];

  /* comment feed */
  const cmtList = document.getElementById("cmtList");
  if (cmtList) {
    const users = ["东北刀手", "气氛组", "雨姐备注", "新二转发", "吴总归档", "路人甲", "硬仗粉丝", "马大帅食堂"];
    const seed = [
      "「小树不倒我就不倒。」——气氛组先到位",
      "「那长相就是证据。」识别站得住",
      "「少，是刃。」模板单免开尊口",
      "「酷是壳，土是芯。」这工作室懂",
      "「欧了。」可以进下一节点了",
      "「该出手时就出手。」档期对齐再开干",
    ];
    const push = (text) => {
      const el = document.createElement("div");
      el.className = "cmt-item";
      const u = users[(Math.random() * users.length) | 0];
      const likes = 3 + ((Math.random() * 96) | 0);
      el.innerHTML = `<span class="cmt-av">${u.slice(0, 1)}</span><div class="cmt-body"><b>${u}</b><p>${text}</p></div><button type="button" class="cmt-like" data-n="${likes}">♥ ${likes}</button>`;
      const btn = el.querySelector(".cmt-like");
      btn?.addEventListener("click", () => {
        const on = btn.classList.toggle("is-on");
        let n = Number(btn.dataset.n || "0");
        n += on ? 1 : -1;
        btn.dataset.n = String(n);
        btn.textContent = `♥ ${n}`;
      });
      cmtList.prepend(el);
      while (cmtList.children.length > 24) cmtList.lastElementChild?.remove();
    };
    seed.forEach((s, i) => setTimeout(() => push(s), i * 80));
    document.getElementById("cmtPush")?.addEventListener("click", () => {
      push(V10_LINES[(Math.random() * V10_LINES.length) | 0] + " —— 范德彪");
    });
    document.getElementById("cmtStorm")?.addEventListener("click", () => {
      for (let i = 0; i < 8; i++) setTimeout(() => push(V10_LINES[(Math.random() * V10_LINES.length) | 0]), i * 70);
    });
  }

  /* flash cuts */
  const flashStage = document.getElementById("flashStage");
  if (flashStage) {
    const vid = document.getElementById("flashVid");
    const line = document.getElementById("flashLine");
    const countEl = document.getElementById("flashCount");
    const srcs = [
      "assets/hero-cinematic.mp4",
      "assets/work-hover-1.mp4",
      "assets/work-hover-2.mp4",
      "assets/work-hover-3.mp4",
      "assets/showreel-motion.mp4",
      "assets/clip-a.mp4",
      "assets/clip-b.mp4",
    ];
    let cuts = 0;
    let timer = 0;
    let si = 0;
    const cut = () => {
      cuts += 1;
      if (countEl) countEl.textContent = `CUT ${cuts}`;
      if (line) line.textContent = V10_LINES[cuts % V10_LINES.length];
      if (vid) {
        si = (si + 1) % srcs.length;
        if (!vid.src.includes(srcs[si].split("/").pop())) {
          const t = vid.currentTime;
          vid.src = srcs[si];
          vid.play().catch(() => {});
        }
      }
      flashStage.classList.remove("is-flash");
      void flashStage.offsetWidth;
      flashStage.classList.add("is-flash");
      setTimeout(() => flashStage.classList.remove("is-flash"), 120);
    };
    document.getElementById("flashOnce")?.addEventListener("click", cut);
    document.getElementById("flashGo")?.addEventListener("click", () => {
      if (timer) return;
      vid?.play().catch(() => {});
      cut();
      timer = setInterval(cut, 280);
    });
    document.getElementById("flashStop")?.addEventListener("click", () => {
      clearInterval(timer);
      timer = 0;
    });
  }

  /* duet dialogue */
  const duetStage = document.getElementById("duetStage");
  if (duetStage) {
    const pairs = [
      ["那长相就是证据", "少，是刃"],
      ["人间烟火要记得住", "系统交付要站得住"],
      ["你就慢慢跟我处", "先对齐刀口再谈档期"],
      ["土是芯", "酷是壳"],
      ["本市著名硬仗", "跨尺度出刀"],
      ["欧了", "不生产模板"],
    ];
    const tu = document.getElementById("duetTu");
    const ku = document.getElementById("duetKu");
    const tuLine = document.getElementById("duetTuLine");
    const kuLine = document.getElementById("duetKuLine");
    const said = document.getElementById("duetSaid");
    let di = 0;
    let side = 0;
    let auto = 0;
    const step = () => {
      const pair = pairs[di % pairs.length];
      if (side === 0) {
        tu?.classList.add("is-on");
        ku?.classList.remove("is-on");
        if (tuLine) tuLine.textContent = pair[0];
        if (said) said.textContent = `「${pair[0]}。」—— 土轨`;
        side = 1;
      } else {
        ku?.classList.add("is-on");
        tu?.classList.remove("is-on");
        if (kuLine) kuLine.textContent = pair[1];
        if (said) said.textContent = `「${pair[1]}。」—— 酷轨 · 范德彪工作室`;
        side = 0;
        di += 1;
      }
    };
    document.getElementById("duetNext")?.addEventListener("click", step);
    document.getElementById("duetAuto")?.addEventListener("click", (e) => {
      const btn = e.currentTarget;
      if (auto) {
        clearInterval(auto);
        auto = 0;
        btn.textContent = "自动对口";
        return;
      }
      step();
      auto = setInterval(step, 1400);
      btn.textContent = "停止对口";
    });
  }

  /* boss bar */
  const bossStage = document.getElementById("bossStage");
  if (bossStage) {
    let hp = 100;
    let combo = 0;
    const bar = document.getElementById("bossBar");
    const hpEl = document.getElementById("bossHp");
    const quote = document.getElementById("bossQuote");
    const comboEl = document.getElementById("bossCombo");
    const nameEl = document.getElementById("bossName");
    const bosses = ["无边界「再高级一点」", "模板换皮需求", "无限轮无决策", "只有感觉没有问题"];
    let bi = 0;
    const render = () => {
      if (bar) bar.style.width = `${Math.max(0, hp)}%`;
      if (hpEl) hpEl.textContent = `HP ${Math.max(0, Math.round(hp))}%`;
      if (comboEl) comboEl.textContent = `COMBO ${combo}`;
    };
    const hit = (dmg) => {
      hp = Math.max(0, hp - dmg);
      combo += 1;
      if (quote) quote.textContent = `「${V10_LINES[combo % V10_LINES.length]}。」`;
      bossStage.classList.remove("is-hit");
      void bossStage.offsetWidth;
      bossStage.classList.add("is-hit");
      render();
      if (hp <= 0) {
        if (quote) quote.textContent = "「欧了。」—— Boss 已斩杀";
        combo = 0;
      }
    };
    document.getElementById("bossHit")?.addEventListener("click", () => hit(8 + Math.random() * 10));
    document.getElementById("bossCrit")?.addEventListener("click", () => hit(22 + Math.random() * 18));
    document.getElementById("bossReset")?.addEventListener("click", () => {
      hp = 100;
      combo = 0;
      bi = (bi + 1) % bosses.length;
      if (nameEl) nameEl.textContent = bosses[bi];
      if (quote) quote.textContent = "「少，是刃。」";
      render();
    });
    render();
  }

  /* seal wall */
  const sealWall = document.getElementById("sealWall");
  if (sealWall) {
    const phrases = ["哈拉少", "硬仗", "欧了", "少是刃", "土是芯", "范德彪", "开干", "不模板", "东北", "交付"];
    let count = 0;
    const countEl = document.getElementById("sealCount");
    const said = document.getElementById("sealSaid");
    const cells = [];
    for (let i = 0; i < 24; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "seal-cell";
      btn.textContent = "盖";
      btn.style.setProperty("--r", `${(Math.random() - 0.5) * 20}deg`);
      btn.addEventListener("click", () => {
        if (btn.classList.contains("is-on")) return;
        const text = phrases[i % phrases.length];
        btn.classList.add("is-on");
        btn.textContent = text;
        count += 1;
        if (countEl) countEl.textContent = `SEALS ${count}`;
        if (said) said.textContent = `「${V10_LINES[count % V10_LINES.length]}。」—— 主理人范德彪`;
      });
      sealWall.appendChild(btn);
      cells.push(btn);
    }
    document.getElementById("sealRain")?.addEventListener("click", () => {
      cells.filter((c) => !c.classList.contains("is-on")).slice(0, 12).forEach((c, i) => setTimeout(() => c.click(), i * 60));
    });
    document.getElementById("sealClear")?.addEventListener("click", () => {
      cells.forEach((c) => {
        c.classList.remove("is-on");
        c.textContent = "盖";
      });
      count = 0;
      if (countEl) countEl.textContent = "SEALS 0";
      if (said) said.textContent = "「本市著名硬仗。」—— 点格盖章。";
    });
  }

  /* typecast typewriter */
  const typecastLine = document.getElementById("typecastLine");
  if (typecastLine) {
    const lines = [
      "小树不倒我就不倒。",
      "那长相就是证据。",
      "酷是壳，土是芯。",
      "少，是刃。",
      "本市著名硬仗，都是我主打的。",
      "先对齐刀口，再谈档期。",
      "不生产模板。",
      "该出手时就出手。",
    ];
    let ti = 0;
    let typing = false;
    const type = async (fast = false) => {
      if (typing) return;
      typing = true;
      const full = lines[ti % lines.length];
      ti += 1;
      typecastLine.textContent = "";
      const delay = fast ? 18 : 55;
      for (let i = 0; i < full.length; i++) {
        typecastLine.textContent = full.slice(0, i + 1);
        await new Promise((r) => setTimeout(r, delay));
      }
      typing = false;
    };
    type();
    document.getElementById("typecastGo")?.addEventListener("click", () => type(false));
    document.getElementById("typecastFast")?.addEventListener("click", () => type(true));
  }



  /* ========== SYSTEM v11 handlers ========== */
  const V11_LINES = [
    "小树不倒我就不倒",
    "那长相就是证据",
    "你就慢慢跟我处",
    "本市著名硬仗",
    "少，是刃",
    "酷是壳，土是芯",
    "欧了",
    "该出手时就出手",
    "不生产模板",
    "跨尺度出刀",
  ];

  /* gift rain */
  const giftLayer = document.getElementById("giftLayer");
  if (giftLayer) {
    const modal = document.getElementById("giftModal");
    const quote = document.getElementById("giftQuote");
    const spawn = (n = 1) => {
      for (let i = 0; i < n; i++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "gift-item";
        btn.textContent = ["礼", "硬", "章", "欧"][i % 4];
        btn.style.left = `${8 + Math.random() * 80}%`;
        btn.style.animationDuration = `${3.2 + Math.random() * 3.2}s`;
        btn.style.animationDelay = `${Math.random() * 0.6}s`;
        btn.addEventListener("click", () => {
          if (quote) quote.textContent = `「${V11_LINES[(Math.random() * V11_LINES.length) | 0]}。」`;
          modal?.removeAttribute("hidden");
        });
        btn.addEventListener("animationend", () => btn.remove());
        giftLayer.appendChild(btn);
      }
    };
    document.getElementById("giftRain")?.addEventListener("click", () => spawn(16));
    document.getElementById("giftOne")?.addEventListener("click", () => spawn(1));
    document.getElementById("giftClose")?.addEventListener("click", () => modal?.setAttribute("hidden", ""));
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) modal.setAttribute("hidden", "");
    });
    spawn(6);
  }

  /* lyric karaoke */
  const lyricStage = document.getElementById("lyricStage");
  if (lyricStage) {
    const lines = V11_LINES.slice();
    let i = 0;
    let timer = 0;
    const prev = document.getElementById("lyricPrev");
    const now = document.getElementById("lyricNow");
    const next = document.getElementById("lyricNext");
    const bar = document.getElementById("lyricBar");
    let t0 = performance.now();
    const render = () => {
      if (prev) prev.textContent = i > 0 ? lines[(i - 1) % lines.length] : "";
      if (now) now.textContent = lines[i % lines.length];
      if (next) next.textContent = lines[(i + 1) % lines.length];
      lyricStage.classList.remove("is-hit");
      void lyricStage.offsetWidth;
      lyricStage.classList.add("is-hit");
      t0 = performance.now();
    };
    const tick = (t) => {
      if (!timer) return;
      const p = Math.min(1, (t - t0) / 2200);
      if (bar) bar.style.width = `${p * 100}%`;
      if (p >= 1) {
        i += 1;
        render();
      }
      requestAnimationFrame(tick);
    };
    render();
    document.getElementById("lyricNextBtn")?.addEventListener("click", () => {
      i += 1;
      render();
    });
    document.getElementById("lyricPlay")?.addEventListener("click", (e) => {
      const btn = e.currentTarget;
      if (timer) {
        timer = 0;
        btn.textContent = "▶ 跟拍";
        return;
      }
      timer = 1;
      btn.textContent = "❚❚ 暂停";
      t0 = performance.now();
      requestAnimationFrame(tick);
    });
  }

  /* wave visualizer */
  const waveCanvas = document.getElementById("waveCanvas");
  if (waveCanvas) {
    const ctx = waveCanvas.getContext("2d");
    const audio = document.getElementById("waveAudio");
    const quote = document.getElementById("waveQuote");
    const label = document.getElementById("waveLabel");
    const tracks = Array.from({ length: 12 }, (_, i) => ({
      src: `assets/biao-${i + 1}.mp3`,
      q: V11_LINES[i % V11_LINES.length],
      n: i + 1,
    }));
    let ti = 0;
    let raf = 0;
    let phase = 0;
    let playing = false;
    const draw = () => {
      const w = waveCanvas.width;
      const h = waveCanvas.height;
      ctx.clearRect(0, 0, w, h);
      const amp = playing ? 0.42 : 0.12;
      phase += playing ? 0.18 : 0.04;
      ctx.strokeStyle = "rgba(255,225,74,0.85)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < w; x += 4) {
        const y =
          h / 2 +
          Math.sin(x * 0.02 + phase) * h * amp * (0.55 + 0.45 * Math.sin(x * 0.01 + phase * 0.7)) +
          Math.sin(x * 0.05 - phase * 1.4) * h * amp * 0.25;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.strokeStyle = "rgba(232,52,26,0.45)";
      ctx.beginPath();
      for (let x = 0; x < w; x += 6) {
        const y = h / 2 + Math.cos(x * 0.03 - phase) * h * amp * 0.55;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      raf = requestAnimationFrame(draw);
    };
    draw();
    const load = (idx) => {
      ti = ((idx % tracks.length) + tracks.length) % tracks.length;
      const tr = tracks[ti];
      if (audio) {
        audio.src = tr.src;
        audio.load();
      }
      if (quote) quote.textContent = `「${tr.q}。」`;
      if (label) label.textContent = `BIAO · ${String(tr.n).padStart(2, "0")}`;
    };
    load(0);
    document.getElementById("wavePlay")?.addEventListener("click", async () => {
      if (!audio) return;
      if (audio.paused) {
        try {
          await audio.play();
          playing = true;
          document.getElementById("wavePlay").textContent = "❚❚ 暂停";
        } catch {
          playing = true;
        }
      } else {
        audio.pause();
        playing = false;
        document.getElementById("wavePlay").textContent = "▶ 播放";
      }
    });
    document.getElementById("waveSkip")?.addEventListener("click", () => {
      load(ti + 1);
      if (playing) audio?.play().catch(() => {});
    });
    audio?.addEventListener("ended", () => {
      load(ti + 1);
      audio.play().catch(() => {});
    });
  }

  /* pin scroll narrative */
  const pinStack = document.getElementById("pinStack");
  if (pinStack) {
    const chs = [...pinStack.querySelectorAll(".pin-ch")];
    const fixed = document.getElementById("pinFixed");
    const sync = () => {
      const mid = innerHeight * 0.45;
      let active = chs[0];
      let best = Infinity;
      chs.forEach((ch) => {
        const r = ch.getBoundingClientRect();
        const d = Math.abs(r.top + r.height * 0.35 - mid);
        if (d < best) {
          best = d;
          active = ch;
        }
        const vid = ch.querySelector("video");
        const on = d < r.height * 0.55;
        if (vid) {
          if (on) vid.play().catch(() => {});
          else vid.pause();
        }
      });
      if (fixed && active) fixed.textContent = `「${active.dataset.q || ""}。」—— 主理人范德彪`;
    };
    addEventListener("scroll", sync, { passive: true });
    sync();
  }

  /* storyboard */
  const boardGrid = document.getElementById("boardGrid");
  if (boardGrid) {
    const shots = [...boardGrid.querySelectorAll(".board-shot")];
    const vid = document.getElementById("boardVid");
    const tag = document.getElementById("boardTag");
    const quote = document.getElementById("boardQuote");
    const activate = (shot) => {
      shots.forEach((s) => s.classList.toggle("is-on", s === shot));
      if (vid) {
        vid.poster = shot.dataset.poster || "";
        vid.src = shot.dataset.src || "";
        vid.play().catch(() => {});
      }
      if (tag) tag.textContent = `${shot.querySelector("span")?.textContent || ""} · ${shot.dataset.t || ""}`;
      if (quote) quote.textContent = `「${shot.dataset.q || ""}。」`;
    };
    shots.forEach((s) => s.addEventListener("click", () => activate(s)));
    if (shots[0]) activate(shots[0]);
  }

  /* riot fx */
  const riotStage = document.getElementById("riotStage");
  if (riotStage) {
    const canvas = document.getElementById("riotCanvas");
    const ctx = canvas.getContext("2d");
    const line = document.getElementById("riotLine");
    const state = document.getElementById("riotState");
    let on = false;
    let parts = [];
    let raf = 0;
    let li = 0;
    const resize = () => {
      const r = riotStage.getBoundingClientRect();
      canvas.width = r.width * devicePixelRatio;
      canvas.height = r.height * devicePixelRatio;
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    addEventListener("resize", resize, { passive: true });
    const burst = (n = 40) => {
      const r = riotStage.getBoundingClientRect();
      for (let i = 0; i < n; i++) {
        parts.push({
          x: Math.random() * r.width,
          y: Math.random() * r.height,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          s: 2 + Math.random() * 4,
          life: 1,
          c: Math.random() > 0.5 ? "255,225,74" : "232,52,26",
        });
      }
    };
    const tick = () => {
      const r = riotStage.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      if (on && parts.length < 180) burst(8);
      parts = parts.filter((p) => p.life > 0.02);
      parts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life *= 0.985;
        ctx.fillStyle = `rgba(${p.c},${p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    const setOn = (v) => {
      on = v;
      riotStage.classList.toggle("is-on", on);
      if (state) state.textContent = on ? "RIOT" : "IDLE";
      if (on) {
        burst(50);
        if (line) line.textContent = V11_LINES[li++ % V11_LINES.length];
      }
    };
    document.getElementById("riotOn")?.addEventListener("click", () => setOn(true));
    document.getElementById("riotOff")?.addEventListener("click", () => setOn(false));
    document.getElementById("riotPulse")?.addEventListener("click", () => {
      burst(60);
      if (line) line.textContent = V11_LINES[li++ % V11_LINES.length];
    });
  }



  /* ========== SYSTEM v12 handlers ========== */
  const V12_LINES = [
    "小树不倒我就不倒",
    "那长相就是证据",
    "你就慢慢跟我处",
    "本市著名硬仗",
    "少，是刃",
    "酷是壳，土是芯",
    "欧了",
    "该出手时就出手",
    "不生产模板",
    "跨尺度出刀",
  ];

  /* flower lower-third overlay */
  const ovStage = document.getElementById("ovStage");
  if (ovStage) {
    const cast = [
      { role: "PRINCIPAL", name: "范德彪", title: "主理人 · 创意总监" },
      { role: "BRAND", name: "新二", title: "伙计 · 品牌与文化视觉" },
      { role: "PRODUCT", name: "雨姐", title: "伙计 · 产品体验" },
      { role: "CRAFT", name: "老蒯", title: "伙计 · 制作与工艺" },
      { role: "MOTION", name: "小阿giao", title: "伙计 · 影像与现场" },
      { role: "OFFICE", name: "吴总", title: "办公室主任" },
      { role: "LOGISTICS", name: "马大帅", title: "食堂主管" },
    ];
    let ci = 0;
    let qi = 0;
    const setCast = () => {
      const c = cast[ci % cast.length];
      const role = document.getElementById("ovRole");
      const name = document.getElementById("ovName");
      const title = document.getElementById("ovTitle");
      if (role) role.textContent = c.role;
      if (name) name.textContent = c.name;
      if (title) title.textContent = c.title;
    };
    document.getElementById("ovNext")?.addEventListener("click", () => {
      ci += 1;
      setCast();
    });
    document.getElementById("ovQuote")?.addEventListener("click", () => {
      const el = document.getElementById("ovFlower");
      if (el) el.textContent = V12_LINES[qi++ % V12_LINES.length];
    });
    document.getElementById("ovPulse")?.addEventListener("click", () => {
      ovStage.classList.remove("is-flash");
      void ovStage.offsetWidth;
      ovStage.classList.add("is-flash");
    });
  }

  /* live countdown */
  const cdStage = document.getElementById("cdStage");
  if (cdStage) {
    const num = document.getElementById("cdNum");
    const quote = document.getElementById("cdQuote");
    let timer = 0;
    let left = 3;
    const boom = (text) => {
      if (num) num.textContent = text;
      cdStage.classList.remove("is-boom");
      void cdStage.offsetWidth;
      cdStage.classList.add("is-boom");
    };
    const run = (sec) => {
      clearInterval(timer);
      left = sec;
      boom(String(left));
      if (quote) quote.textContent = "准备开干";
      timer = setInterval(() => {
        left -= 1;
        if (left > 0) {
          boom(String(left));
        } else {
          clearInterval(timer);
          boom("欧");
          if (quote) quote.textContent = `「${V12_LINES[(Math.random() * V12_LINES.length) | 0]}。」—— 开播`;
        }
      }, 1000);
    };
    document.getElementById("cdGo")?.addEventListener("click", () => run(3));
    document.getElementById("cd3")?.addEventListener("click", () => run(3));
    document.getElementById("cd5")?.addEventListener("click", () => run(5));
  }

  /* mosaic wall */
  const mosaic = document.getElementById("mosaic");
  if (mosaic) {
    const cells = [...mosaic.querySelectorAll(".mos-cell")];
    const cap = document.getElementById("mosaicCap");
    const activate = (cell) => {
      cells.forEach((c) => {
        c.classList.toggle("is-on", c === cell);
        const v = c.querySelector("video");
        if (!v) return;
        if (c === cell) v.play().catch(() => {});
        else v.pause();
      });
      if (cap) cap.textContent = `「${cell.dataset.q || ""}。」—— 点格放大独奏`;
    };
    cells.forEach((c) => c.addEventListener("click", () => activate(c)));
    if (cells[0]) activate(cells[0]);
  }

  /* teleprompter */
  const teleTrack = document.getElementById("teleTrack");
  if (teleTrack) {
    let y = 0;
    let speed = 0.45;
    let on = false;
    let raf = 0;
    const tick = () => {
      if (on) {
        y -= speed;
        const h = teleTrack.scrollHeight;
        if (-y > h * 0.75) y = 120;
        teleTrack.style.transform = `translateY(${y}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    document.getElementById("telePlay")?.addEventListener("click", (e) => {
      on = !on;
      e.currentTarget.textContent = on ? "❚❚ 暂停" : "▶ 滚读";
    });
    document.getElementById("teleSlow")?.addEventListener("click", () => {
      speed = 0.28;
    });
    document.getElementById("teleFast")?.addEventListener("click", () => {
      speed = 0.75;
    });
    document.getElementById("teleReset")?.addEventListener("click", () => {
      y = 0;
      teleTrack.style.transform = "translateY(0px)";
    });
  }

  /* hard-word rank */
  const rankList = document.getElementById("rankList");
  if (rankList) {
    const items = V12_LINES.map((q, i) => ({
      q,
      n: 40 + ((i * 17) % 55),
    }));
    const topQ = document.getElementById("rankTopQ");
    const topMeta = document.getElementById("rankTopMeta");
    const render = () => {
      items.sort((a, b) => b.n - a.n);
      rankList.innerHTML = items
        .map(
          (it, i) =>
            `<li><span class="n">${String(i + 1).padStart(2, "0")}</span><strong>「${it.q}。」</strong><button type="button" class="rank-like" data-i="${i}">♥ ${it.n}</button></li>`
        )
        .join("");
      if (topQ) topQ.textContent = `「${items[0].q}。」`;
      if (topMeta) topMeta.textContent = `TOP 1 · 热度演示 ${items[0].n}`;
      rankList.querySelectorAll(".rank-like").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.dataset.i);
          // after sort, map by text
          const text = btn.parentElement?.querySelector("strong")?.textContent || "";
          const hit = items.find((x) => text.includes(x.q));
          if (hit) {
            hit.n += 1;
            btn.classList.add("is-on");
            render();
          }
        });
      });
    };
    render();
  }

  /* snap vertical feed */
  const snapFeed = document.getElementById("snapFeed");
  if (snapFeed) {
    const cards = [...snapFeed.querySelectorAll(".snap-card")];
    const sync = () => {
      const mid = snapFeed.scrollTop + snapFeed.clientHeight * 0.5;
      cards.forEach((card) => {
        const top = card.offsetTop;
        const bottom = top + card.offsetHeight;
        const vid = card.querySelector("video");
        if (!vid) return;
        if (mid >= top && mid < bottom) vid.play().catch(() => {});
        else vid.pause();
      });
    };
    snapFeed.addEventListener("scroll", sync, { passive: true });
    sync();
    cards[0]?.querySelector("video")?.play().catch(() => {});
  }

})();
