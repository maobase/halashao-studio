/* HALASHAO v2 core — shell only, no spam */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;

  // year
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  // nav active
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase() || "index.html";
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const href = (a.getAttribute("href") || "").split("/").pop().toLowerCase();
    if (href === path || (path === "" && href === "index.html")) a.classList.add("is-active");
  });

  // scroll nav
  const nav = document.querySelector(".shell-nav");
  const onScroll = () => nav?.classList.toggle("is-on", scrollY > 12);
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  // drawer
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

  // horizontal rail drag + hover video
  document.querySelectorAll("[data-rail]").forEach((rail) => {
    let down = false, sx = 0, sl = 0, moved = false;
    const updateHot = (card, on) => {
      const vid = card.querySelector("video");
      card.classList.toggle("is-hot", on);
      if (!vid || reduce) return;
      if (on) vid.play().catch(() => {});
      else {
        vid.pause();
        try { vid.currentTime = 0; } catch { /* */ }
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

  // work page cards
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
      try { vid.currentTime = 0; } catch { /* */ }
    };
    if (fine) {
      card.addEventListener("pointerenter", start);
      card.addEventListener("pointerleave", stop);
    }
  });

  // player
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

  document.querySelectorAll("[data-clip]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!vid) return;
      document.querySelectorAll("[data-clip]").forEach((b) => b.classList.remove("is-on"));
      btn.classList.add("is-on");
      const playing = !vid.paused;
      vid.src = btn.dataset.clip;
      vid.load();
      if (playing) await play();
      else sync();
    });
  });

  // form
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

  // creed pin optional GSAP-free sticky feel via CSS only

  // home voice once, user-triggered only
  const voice = document.getElementById("brandVoice");
  document.getElementById("playVoice")?.addEventListener("click", async () => {
    if (!voice) return;
    try {
      if (voice.paused) {
        await voice.play();
      } else voice.pause();
    } catch { /* */ }
  });
})();
