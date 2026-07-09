(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Top nav scroll state
  const top = document.querySelector(".top");
  const onScrollNav = () => {
    if (!top) return;
    top.classList.toggle("is-scrolled", window.scrollY > 20);
  };
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  // Drawer
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
  burger?.addEventListener("click", () => {
    setDrawer(burger.getAttribute("aria-expanded") !== "true");
  });
  drawer?.querySelectorAll("[data-close]").forEach((a) => {
    a.addEventListener("click", () => setDrawer(false));
  });

  // Hero video
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

  // Voice
  const voice = document.getElementById("voice");
  const voiceFab = document.getElementById("voiceFab");
  const voiceLabel = document.getElementById("voiceLabel");
  const heroVoice = document.getElementById("heroVoice");
  const reelVid = document.getElementById("reelVid");
  const reelPlay = document.getElementById("reelPlay");

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

  reelPlay?.addEventListener("click", async () => {
    if (!reelVid) return;
    pauseVoice();
    try {
      reelVid.muted = false;
      reelVid.currentTime = 0;
      await reelVid.play();
      reelVid.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    } catch { /* native controls fallback */ }
  });
  reelVid?.addEventListener("play", pauseVoice);

  // Form
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

  // Horizontal work drag + progress
  const workWrap = document.getElementById("workWrap");
  const workBar = document.getElementById("workBar");
  if (workWrap) {
    let down = false;
    let startX = 0;
    let scrollLeft = 0;

    const updateBar = () => {
      if (!workBar) return;
      const max = workWrap.scrollWidth - workWrap.clientWidth;
      const p = max > 0 ? (workWrap.scrollLeft / max) * 100 : 0;
      workBar.style.width = `${p}%`;
    };
    workWrap.addEventListener("scroll", updateBar, { passive: true });
    updateBar();

    workWrap.addEventListener("pointerdown", (e) => {
      if (e.target.closest("a,button")) return;
      down = true;
      workWrap.classList.add("is-dragging");
      startX = e.clientX;
      scrollLeft = workWrap.scrollLeft;
      workWrap.setPointerCapture?.(e.pointerId);
    });
    workWrap.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      workWrap.scrollLeft = scrollLeft - dx;
    });
    const endDrag = () => {
      down = false;
      workWrap.classList.remove("is-dragging");
    };
    workWrap.addEventListener("pointerup", endDrag);
    workWrap.addEventListener("pointercancel", endDrag);
    workWrap.addEventListener("pointerleave", endDrag);

    // Shift vertical wheel to horizontal when over track
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
  }

  // Text scramble
  const glyphs = "ハラ少ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const scramble = (el) => {
    const original = el.dataset.original || el.textContent || "";
    el.dataset.original = original;
    let frame = 0;
    const total = Math.min(12, original.length + 4);
    const id = setInterval(() => {
      el.textContent = original
        .split("")
        .map((ch, i) => {
          if (ch === " " || ch === "·") return ch;
          if (i < (frame / total) * original.length) return original[i];
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join("");
      frame++;
      if (frame > total) {
        clearInterval(id);
        el.textContent = original;
      }
    }, 28);
  };

  document.querySelectorAll("[data-scramble]").forEach((el) => {
    el.dataset.original = el.textContent || "";
    el.addEventListener("mouseenter", () => {
      if (!reduce) scramble(el);
    });
  });

  // GSAP scroll: statement light-up + forge items
  if (!reduce && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    const lines = gsap.utils.toArray("#statementText span");
    if (lines.length) {
      lines.forEach((line, i) => {
        ScrollTrigger.create({
          trigger: line,
          start: "top 78%",
          end: "top 40%",
          onEnter: () => line.classList.add("is-lit"),
          onEnterBack: () => line.classList.add("is-lit"),
          onLeaveBack: () => {
            if (i > 0) line.classList.remove("is-lit");
          },
        });
      });
    }

    gsap.utils.toArray(".forge-item").forEach((item, i) => {
      gsap.from(item, {
        opacity: 0.25,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        delay: i * 0.05,
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });

    gsap.from(".hero-cn", {
      y: 60,
      opacity: 0,
      duration: 1.1,
      ease: "power4.out",
    });
    gsap.from(".hero-en", {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.12,
      ease: "power4.out",
    });
    gsap.from(".hero-line, .hero-row, .hero-kicker", {
      y: 24,
      opacity: 0,
      duration: 0.9,
      delay: 0.22,
      stagger: 0.08,
      ease: "power3.out",
    });
  } else {
    document.querySelectorAll("#statementText span").forEach((s) => s.classList.add("is-lit"));
  }

  // Particle field — acid lime constellation
  const canvas = document.getElementById("field");
  if (!canvas || reduce) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;
  let pts = [];
  let mx = -9999;
  let my = -9999;
  let raf = 0;
  let last = 0;

  const LIME = { r: 200, g: 245, b: 66 };
  const BONE = { r: 244, g: 244, b: 238 };

  const rand = (a, b) => a + Math.random() * (b - a);

  const count = () => Math.max(40, Math.min(110, Math.floor((w * h) / 16000)));

  const spawn = () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: rand(-0.2, 0.2),
    vy: rand(-0.2, 0.2),
    r: rand(0.7, 2.1),
    hot: Math.random() < 0.2,
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

    const maxD = Math.min(130, w * 0.11);
    const maxD2 = maxD * maxD;

    for (const p of pts) {
      const dx = p.x - mx;
      const dy = p.y - my;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < 150) {
        const f = (1 - dist / 150) * 0.09;
        p.vx += (dx / dist) * f;
        p.vy += (dy / dist) * f;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.99;
      p.vy *= 0.99;
      p.vx += rand(-0.008, 0.008);
      p.vy += rand(-0.008, 0.008);
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
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > maxD2) continue;
        const alpha = (1 - Math.sqrt(d2) / maxD) * 0.18;
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
      const alpha = p.hot ? 0.5 + pulse * 0.4 : 0.12 + pulse * 0.18;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (0.9 + pulse * 0.2), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
      ctx.fill();
      if (p.hot) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${LIME.r},${LIME.g},${LIME.b},${0.05 * pulse})`;
        ctx.fill();
      }
    }

    raf = requestAnimationFrame(step);
  };

  window.addEventListener(
    "pointermove",
    (e) => {
      mx = e.clientX;
      my = e.clientY;
    },
    { passive: true }
  );
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
