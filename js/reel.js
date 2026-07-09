(() => {
  const reelVid = document.getElementById("reelVid");
  const player = document.getElementById("player");
  const playerBig = document.getElementById("playerBig");
  const playerToggle = document.getElementById("playerToggle");
  const playerMute = document.getElementById("playerMute");
  const playerScrub = document.getElementById("playerScrub");
  const playerFill = document.getElementById("playerFill");
  const playerTime = document.getElementById("playerTime");
  const clipName = document.getElementById("clipName");

  const fmt = (s) => {
    if (!Number.isFinite(s)) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };

  const sync = () => {
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

  const play = async () => {
    if (!reelVid) return;
    try {
      reelVid.muted = false;
      await reelVid.play();
    } catch {
      reelVid.muted = true;
      await reelVid.play().catch(() => {});
    }
    sync();
  };
  const pause = () => { reelVid?.pause(); sync(); };
  const toggle = () => (reelVid?.paused || reelVid?.ended ? play() : pause());

  playerBig?.addEventListener("click", toggle);
  playerToggle?.addEventListener("click", toggle);
  playerMute?.addEventListener("click", () => {
    if (!reelVid) return;
    reelVid.muted = !reelVid.muted;
    sync();
  });

  const seek = (e) => {
    if (!reelVid?.duration || !playerScrub) return;
    const r = playerScrub.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    reelVid.currentTime = ratio * reelVid.duration;
    sync();
  };
  playerScrub?.addEventListener("pointerdown", (e) => {
    seek(e);
    const move = (ev) => seek(ev);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  });

  reelVid?.addEventListener("timeupdate", sync);
  reelVid?.addEventListener("loadedmetadata", sync);
  reelVid?.addEventListener("play", sync);
  reelVid?.addEventListener("pause", sync);
  reelVid?.addEventListener("ended", sync);

  document.querySelectorAll(".clip-card").forEach((card) => {
    card.addEventListener("click", async () => {
      const src = card.dataset.src;
      const name = card.dataset.name || "片段";
      if (!src || !reelVid) return;
      document.querySelectorAll(".clip-card").forEach((c) => c.classList.remove("is-on"));
      card.classList.add("is-on");
      const wasPlaying = !reelVid.paused;
      reelVid.src = src;
      reelVid.load();
      if (clipName) clipName.textContent = name;
      if (wasPlaying) await play();
      else sync();
    });
  });
})();
