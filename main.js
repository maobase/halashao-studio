(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  const toggle = document.getElementById("navToggle");
  const overlay = document.getElementById("menuOverlay");
  const menuLinks = document.querySelectorAll("[data-menu-link]");

  const setMenu = (open) => {
    if (!toggle || !overlay) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    overlay.classList.toggle("is-open", open);
    if (open) overlay.removeAttribute("hidden");
    else overlay.setAttribute("hidden", "");
    document.body.style.overflow = open ? "hidden" : "";
  };

  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    setMenu(open);
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) setMenu(false);
  });

  // Scroll reveal
  const reveals = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  // Cursor glow
  const glow = document.getElementById("cursorGlow");
  if (glow && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    let x = -9999;
    let y = -9999;
    let tx = x;
    let ty = y;
    let raf = 0;

    const tick = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener(
      "pointermove",
      (e) => {
        tx = e.clientX;
        ty = e.clientY;
        glow.classList.add("is-on");
      },
      { passive: true }
    );

    window.addEventListener(
      "pointerleave",
      () => {
        glow.classList.remove("is-on");
      },
      { passive: true }
    );

    raf = requestAnimationFrame(tick);
  }

  // Contact form (demo)
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !message) {
      if (status) status.textContent = "请填写完整信息后再发送。";
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (status) status.textContent = "邮箱格式看起来不太对。";
      return;
    }

    if (status) status.textContent = "已收到。我们会尽快回复你。";
    form.reset();
  });

  // Hero video + brand voice + showreel
  const heroVideo = document.getElementById("heroVideo");
  const brandVoice = document.getElementById("brandVoice");
  const audioDock = document.getElementById("audioDock");
  const audioDockLabel = document.getElementById("audioDockLabel");
  const playVoiceBtn = document.getElementById("playVoiceBtn");
  const showreelVideo = document.getElementById("showreelVideo");
  const showreelPlay = document.getElementById("showreelPlay");

  if (heroVideo) {
    heroVideo.muted = true;
    const tryPlay = () => heroVideo.play().catch(() => {});
    tryPlay();
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) tryPlay();
    });
    if (reduceMotion) {
      heroVideo.pause();
      heroVideo.removeAttribute("autoplay");
    }
  }

  const setVoiceUI = (playing) => {
    audioDock?.classList.toggle("is-playing", playing);
    audioDock?.setAttribute("aria-pressed", playing ? "true" : "false");
    audioDock?.setAttribute("aria-label", playing ? "暂停品牌语音" : "播放品牌语音");
    if (audioDockLabel) audioDockLabel.textContent = playing ? "播放中" : "品牌语音";
    if (playVoiceBtn) playVoiceBtn.textContent = playing ? "暂停语音" : "聆听介绍";
  };

  const pauseVoice = () => {
    if (!brandVoice) return;
    brandVoice.pause();
    setVoiceUI(false);
  };

  const playVoice = async () => {
    if (!brandVoice) return;
    // Avoid two audio sources fighting
    if (showreelVideo && !showreelVideo.paused) {
      showreelVideo.pause();
    }
    try {
      brandVoice.currentTime = brandVoice.ended ? 0 : brandVoice.currentTime;
      await brandVoice.play();
      setVoiceUI(true);
    } catch {
      setVoiceUI(false);
    }
  };

  const toggleVoice = async () => {
    if (!brandVoice) return;
    if (brandVoice.paused || brandVoice.ended) await playVoice();
    else pauseVoice();
  };

  audioDock?.addEventListener("click", toggleVoice);
  playVoiceBtn?.addEventListener("click", toggleVoice);

  brandVoice?.addEventListener("ended", () => setVoiceUI(false));
  brandVoice?.addEventListener("pause", () => {
    if (brandVoice.ended) return;
    // only update if truly paused by user / conflict
    if (brandVoice.paused) setVoiceUI(false);
  });

  showreelPlay?.addEventListener("click", async () => {
    if (!showreelVideo) return;
    pauseVoice();
    try {
      showreelVideo.muted = false;
      showreelVideo.currentTime = 0;
      await showreelVideo.play();
      showreelVideo.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    } catch {
      // user can use native controls
    }
  });

  showreelVideo?.addEventListener("play", () => {
    pauseVoice();
  });

  // Particles
  const canvas = document.getElementById("particles");
  if (!canvas || reduceMotion) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0;
  let height = 0;
  let particles = [];
  let mouse = { x: null, y: null, active: false };
  let animId = 0;
  let last = 0;

  const COPPER = { r: 224, g: 122, b: 69 };
  const INK = { r: 244, g: 240, b: 234 };

  const rand = (a, b) => a + Math.random() * (b - a);

  function countForSize() {
    const area = width * height;
    return Math.max(48, Math.min(140, Math.floor(area / 14000)));
  }

  function spawnParticle() {
    const isAccent = Math.random() < 0.18;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: rand(-0.25, 0.25),
      vy: rand(-0.25, 0.25),
      r: rand(0.8, isAccent ? 2.4 : 1.8),
      accent: isAccent,
      pulse: Math.random() * Math.PI * 2,
    };
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const n = countForSize();
    if (particles.length === 0) {
      particles = Array.from({ length: n }, spawnParticle);
    } else if (particles.length < n) {
      while (particles.length < n) particles.push(spawnParticle());
    } else if (particles.length > n) {
      particles.length = n;
    }
  }

  function connect() {
    const maxDist = Math.min(140, width * 0.12);
    const maxDist2 = maxDist * maxDist;

    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > maxDist2) continue;
        const t = 1 - Math.sqrt(d2) / maxDist;
        const alpha = t * 0.22;
        if (alpha < 0.02) continue;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${COPPER.r}, ${COPPER.g}, ${COPPER.b}, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  function step(ts) {
    const dt = Math.min(32, ts - last || 16);
    last = ts;
    const factor = dt / 16.67;

    ctx.clearRect(0, 0, width, height);

    // soft vignette field
    const g = ctx.createRadialGradient(
      width * 0.5,
      height * 0.35,
      0,
      width * 0.5,
      height * 0.4,
      Math.max(width, height) * 0.7
    );
    g.addColorStop(0, "rgba(224, 122, 69, 0.04)");
    g.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    for (const p of particles) {
      if (mouse.active && mouse.x != null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy) || 1;
        const radius = 160;
        if (dist < radius) {
          const force = (1 - dist / radius) * 0.085;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      p.x += p.vx * factor;
      p.y += p.vy * factor;
      p.vx *= 0.992;
      p.vy *= 0.992;
      p.vx += rand(-0.01, 0.01);
      p.vy += rand(-0.01, 0.01);

      // soft bounds
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      p.pulse += 0.02 * factor;
      const pulse = 0.55 + Math.sin(p.pulse) * 0.45;
      const c = p.accent ? COPPER : INK;
      const alpha = p.accent ? 0.55 + pulse * 0.35 : 0.18 + pulse * 0.22;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (0.85 + pulse * 0.25), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
      ctx.fill();

      if (p.accent) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COPPER.r}, ${COPPER.g}, ${COPPER.b}, ${0.06 * pulse})`;
        ctx.fill();
      }
    }

    connect();

    // mouse magnetic ring
    if (mouse.active && mouse.x != null) {
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 48, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(224, 122, 69, 0.12)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    animId = requestAnimationFrame(step);
  }

  window.addEventListener(
    "pointermove",
    (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerleave",
    () => {
      mouse.active = false;
    },
    { passive: true }
  );

  window.addEventListener(
    "resize",
    () => {
      resize();
    },
    { passive: true }
  );

  // pause when tab hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
      animId = 0;
    } else if (!animId) {
      last = performance.now();
      animId = requestAnimationFrame(step);
    }
  });

  resize();
  last = performance.now();
  animId = requestAnimationFrame(step);
})();
