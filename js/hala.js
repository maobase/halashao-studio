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
})();
