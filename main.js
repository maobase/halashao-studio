(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;

  // year + clock
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
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

  // hero chars
  const heroTitle = document.getElementById("heroTitle");
  if (heroTitle) {
    const word = "哈拉少";
    heroTitle.innerHTML = word
      .split("")
      .map((c, i) => `<span class="ch" style="--i:${i}">${c}</span>`)
      .join("");
  }

  // nav scroll
  const top = document.querySelector(".top");
  const onScrollNav = () => top?.classList.toggle("is-scrolled", window.scrollY > 16);
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

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

  // hero video
  const heroVid = document.getElementById("heroVid");
  if (heroVid) {
    heroVid.muted = true;
    const play = () => heroVid.play().catch(() => {});
    if (!reduce) play();
    else {
      heroVid.pause();
      heroVid.removeAttribute("autoplay");
    }
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && !reduce) play();
    });
  }

  // custom cursor
  const cursor = document.getElementById("cursor");
  if (cursor && fine && !reduce) {
    document.body.classList.add("has-cursor");
    const dot = cursor.querySelector("i");
    const ring = cursor.querySelector("b");
    let x = -999, y = -999, rx = x, ry = y;
    let raf = 0;
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot) dot.style.transform = `translate3d(${x}px,${y}px,0)`;
      if (ring) ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", (e) => {
      x = e.clientX;
      y = e.clientY;
    }, { passive: true });
    document.addEventListener("pointerover", (e) => {
      const hot = e.target.closest("a,button,[data-work],.player-scrub,.player-big");
      cursor.classList.toggle("is-hot", !!hot);
    });
    raf = requestAnimationFrame(loop);
  }

  // magnetic buttons
  if (fine && !reduce) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.22}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "";
      });
    });
  }

  // voice
  const voice = document.getElementById("voice");
  const voiceFab = document.getElementById("voiceFab");
  const voiceLabel = document.getElementById("voiceLabel");
  const heroVoice = document.getElementById("heroVoice");
  const reelVid = document.getElementById("reelVid");

  const setVoiceUI = (on) => {
    voiceFab?.classList.toggle("is-on", on);
    voiceFab?.setAttribute("aria-pressed", on ? "true" : "false");
    if (voiceLabel) voiceLabel.textContent = on ? "播放中" : "听介绍";
    if (heroVoice) heroVoice.textContent = on ? "暂停语音" : "播放语音";
  };
  const pauseVoice = () => {
    if (!voice) return;
    voice.pause();
    setVoiceUI(false);
  };
  const playVoice = async () => {
    if (!voice) return;
    if (reelVid && !reelVid.paused) reelVid.pause();
    try {
      if (voice.ended) voice.currentTime = 0;
      await voice.play();
      setVoiceUI(true);
    } catch {
      setVoiceUI(false);
    }
  };
  const toggleVoice = async () => {
    if (!voice) return;
    if (voice.paused || voice.ended) await playVoice();
    else pauseVoice();
  };
  voiceFab?.addEventListener("click", toggleVoice);
  heroVoice?.addEventListener("click", toggleVoice);
  voice?.addEventListener("ended", () => setVoiceUI(false));
  voice?.addEventListener("pause", () => {
    if (!voice.ended && voice.paused) setVoiceUI(false);
  });

  // form
  const form = document.getElementById("form");
  const formStatus = document.getElementById("formStatus");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !email || !message) {
      if (formStatus) formStatus.textContent = "请填写完整信息。";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (formStatus) formStatus.textContent = "邮箱格式不对。";
      return;
    }
    if (formStatus) formStatus.textContent = "已收到。我们尽快回复。";
    form.reset();
  });

  // work horizontal drag + hover video
  const workWrap = document.getElementById("workWrap");
  const workBar = document.getElementById("workBar");
  if (workWrap) {
    let down = false;
    let startX = 0;
    let scrollLeft = 0;
    let moved = false;

    const updateBar = () => {
      if (!workBar) return;
      const max = workWrap.scrollWidth - workWrap.clientWidth;
      workBar.style.width = `${max > 0 ? (workWrap.scrollLeft / max) * 100 : 0}%`;
    };
    workWrap.addEventListener("scroll", updateBar, { passive: true });
    updateBar();

    workWrap.addEventListener("pointerdown", (e) => {
      if (e.target.closest("a,button")) return;
      down = true;
      moved = false;
      workWrap.classList.add("is-dragging");
      startX = e.clientX;
      scrollLeft = workWrap.scrollLeft;
      workWrap.setPointerCapture?.(e.pointerId);
    });
    workWrap.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      workWrap.scrollLeft = scrollLeft - dx;
    });
    const endDrag = () => {
      down = false;
      workWrap.classList.remove("is-dragging");
    };
    workWrap.addEventListener("pointerup", endDrag);
    workWrap.addEventListener("pointercancel", endDrag);
    workWrap.addEventListener("pointerleave", endDrag);

    workWrap.addEventListener(
      "wheel",
      (e) => {
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
        if (workWrap.scrollWidth <= workWrap.clientWidth) return;
        e.preventDefault();
        workWrap.scrollLeft += e.deltaY;
      },
      { passive: false }
    );

    // hover / touch play video
    document.querySelectorAll("[data-work]").forEach((card) => {
      const vid = card.querySelector(".work-vid");
      if (!vid) return;

      const start = () => {
        if (reduce) return;
        card.classList.add("is-hot");
        vid.play().catch(() => {});
      };
      const stop = () => {
        card.classList.remove("is-hot");
        vid.pause();
        try { vid.currentTime = 0; } catch { /* */ }
      };

      if (fine) {
        card.addEventListener("pointerenter", start);
        card.addEventListener("pointerleave", stop);
      } else {
        // mobile: toggle on tap if not dragging
        card.addEventListener("click", () => {
          if (moved) return;
          if (card.classList.contains("is-hot")) stop();
          else {
            document.querySelectorAll("[data-work].is-hot").forEach((c) => {
              c.classList.remove("is-hot");
              const v = c.querySelector(".work-vid");
              v?.pause();
            });
            start();
          }
        });
      }
    });
  }

  // custom player
  const player = document.getElementById("player");
  const playerBig = document.getElementById("playerBig");
  const playerToggle = document.getElementById("playerToggle");
  const playerMute = document.getElementById("playerMute");
  const playerScrub = document.getElementById("playerScrub");
  const playerFill = document.getElementById("playerFill");
  const playerTime = document.getElementById("playerTime");

  const fmt = (s) => {
    if (!Number.isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const syncPlayerUI = () => {
    if (!reelVid) return;
    const d = reelVid.duration || 0;
    const c = reelVid.currentTime || 0;
    const p = d ? (c / d) * 100 : 0;
    if (playerFill) playerFill.style.width = `${p}%`;
    playerScrub?.setAttribute("aria-valuenow", String(Math.round(p)));
    if (playerTime) playerTime.textContent = `${fmt(c)} / ${fmt(d)}`;
    if (playerToggle) playerToggle.textContent = reelVid.paused ? "▶" : "❚❚";
    if (playerMute) playerMute.textContent = reelVid.muted ? "🔇" : "🔊";
    player?.classList.toggle("is-playing", !reelVid.paused && !reelVid.ended);
  };

  const playReel = async () => {
    if (!reelVid) return;
    pauseVoice();
    try {
      reelVid.muted = false;
      await reelVid.play();
      syncPlayerUI();
    } catch {
      try {
        reelVid.muted = true;
        await reelVid.play();
        syncPlayerUI();
      } catch { /* */ }
    }
  };

  const pauseReel = () => {
    reelVid?.pause();
    syncPlayerUI();
  };

  const toggleReel = () => {
    if (!reelVid) return;
    if (reelVid.paused || reelVid.ended) playReel();
    else pauseReel();
  };

  playerBig?.addEventListener("click", toggleReel);
  playerToggle?.addEventListener("click", toggleReel);
  playerMute?.addEventListener("click", () => {
    if (!reelVid) return;
    reelVid.muted = !reelVid.muted;
    syncPlayerUI();
  });

  const seekFromEvent = (e) => {
    if (!reelVid || !playerScrub || !reelVid.duration) return;
    const r = playerScrub.getBoundingClientRect();
    const x = ("clientX" in e ? e.clientX : 0) - r.left;
    const ratio = Math.min(1, Math.max(0, x / r.width));
    reelVid.currentTime = ratio * reelVid.duration;
    syncPlayerUI();
  };

  playerScrub?.addEventListener("pointerdown", (e) => {
    seekFromEvent(e);
    const move = (ev) => seekFromEvent(ev);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  });

  playerScrub?.addEventListener("keydown", (e) => {
    if (!reelVid || !reelVid.duration) return;
    if (e.key === "ArrowRight") {
      reelVid.currentTime = Math.min(reelVid.duration, reelVid.currentTime + 2);
      syncPlayerUI();
    }
    if (e.key === "ArrowLeft") {
      reelVid.currentTime = Math.max(0, reelVid.currentTime - 2);
      syncPlayerUI();
    }
  });

  reelVid?.addEventListener("timeupdate", syncPlayerUI);
  reelVid?.addEventListener("loadedmetadata", syncPlayerUI);
  reelVid?.addEventListener("play", () => {
    pauseVoice();
    syncPlayerUI();
  });
  reelVid?.addEventListener("pause", syncPlayerUI);
  reelVid?.addEventListener("ended", syncPlayerUI);

  // scramble
  const glyphs = "ハラ少刃锻火花ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const scramble = (el) => {
    const original = el.dataset.original || el.textContent || "";
    el.dataset.original = original;
    let frame = 0;
    const total = Math.min(14, original.length + 5);
    const id = setInterval(() => {
      el.textContent = original
        .split("")
        .map((ch, i) => {
          if (ch === " " || ch === "·" || ch === "/") return ch;
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

  // GSAP: pin stack + hero + forge
  if (!reduce && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // hero chars
    gsap.from(".hero-title .ch", {
      y: 120,
      opacity: 0,
      rotateX: -60,
      stagger: 0.08,
      duration: 1.15,
      ease: "power4.out",
    });
    gsap.from(".hero-en, .hero-line .line-mask > span, .hero-row, .hero-kicker", {
      y: 36,
      opacity: 0,
      duration: 0.95,
      delay: 0.35,
      stagger: 0.07,
      ease: "power3.out",
    });

    // pin stack cards
    const cards = gsap.utils.toArray("[data-pin]");
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        endTrigger: cards[cards.length - 1],
        end: "top top",
        pin: true,
        pinSpacing: false,
      });
      gsap.to(card, {
        scale: 0.92,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: cards[i + 1],
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      });
    });

    // forge items
    gsap.utils.toArray("[data-forge]").forEach((item, i) => {
      gsap.from(item, {
        x: -24,
        opacity: 0.2,
        duration: 0.8,
        delay: i * 0.05,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 88%",
          toggleActions: "play none none reverse",
          onEnter: () => item.classList.add("is-in"),
          onLeaveBack: () => item.classList.remove("is-in"),
        },
      });
    });

    // contact title
    gsap.from(".contact-title .ct-line", {
      y: 80,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".contact-title",
        start: "top 85%",
      },
    });

    // work slides scale in
    gsap.utils.toArray(".work-slide").forEach((slide) => {
      gsap.from(slide, {
        scale: 0.94,
        opacity: 0.4,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: slide,
          start: "left 90%",
          horizontal: false,
          toggleActions: "play none none reverse",
        },
      });
    });
  }

  // particles
  const canvas = document.getElementById("field");
  if (!canvas || reduce) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0, pts = [], mx = -9999, my = -9999, raf = 0, last = 0;
  const LIME = { r: 200, g: 245, b: 66 };
  const BONE = { r: 244, g: 244, b: 238 };
  const rand = (a, b) => a + Math.random() * (b - a);
  const count = () => Math.max(48, Math.min(130, Math.floor((w * h) / 14000)));
  const spawn = () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: rand(-0.22, 0.22),
    vy: rand(-0.22, 0.22),
    r: rand(0.7, 2.2),
    hot: Math.random() < 0.22,
    ph: Math.random() * Math.PI * 2,
  });

  const resize = () => {
    w = window.innerWidth;
    h = window.innerHeight;
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
    const maxD = Math.min(140, w * 0.12);
    const maxD2 = maxD * maxD;

    for (const p of pts) {
      const dx = p.x - mx;
      const dy = p.y - my;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < 170) {
        const f = (1 - dist / 170) * 0.1;
        p.vx += (dx / dist) * f;
        p.vy += (dy / dist) * f;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.99;
      p.vy *= 0.99;
      p.vx += rand(-0.01, 0.01);
      p.vy += rand(-0.01, 0.01);
      p.ph += 0.028 * dt;
      if (p.x < -30) p.x = w + 30;
      if (p.x > w + 30) p.x = -30;
      if (p.y < -30) p.y = h + 30;
      if (p.y > h + 30) p.y = -30;
    }

    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > maxD2) continue;
        const alpha = (1 - Math.sqrt(d2) / maxD) * 0.2;
        if (alpha < 0.02) continue;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${LIME.r},${LIME.g},${LIME.b},${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    for (const p of pts) {
      const pulse = 0.55 + Math.sin(p.ph) * 0.45;
      const c = p.hot ? LIME : BONE;
      const alpha = p.hot ? 0.55 + pulse * 0.4 : 0.12 + pulse * 0.18;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (0.9 + pulse * 0.2), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
      ctx.fill();
      if (p.hot) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${LIME.r},${LIME.g},${LIME.b},${0.055 * pulse})`;
        ctx.fill();
      }
    }
    raf = requestAnimationFrame(step);
  };

  window.addEventListener("pointermove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(step);
    }
  });
  resize();
  last = performance.now();
  raf = requestAnimationFrame(step);
})();
