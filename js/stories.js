(() => {
  const items = [
    { name: "@熔光现场", cap: "那长相就是证据", src: "assets/work-hover-1.mp4", poster: "assets/work-brand.jpg" },
    { name: "@墨界控制台", cap: "你就慢慢跟我处", src: "assets/work-hover-2.mp4", poster: "assets/work-product.jpg" },
    { name: "@脉冲导演", cap: "小树不倒我就不倒", src: "assets/work-hover-3.mp4", poster: "assets/work-motion.jpg" },
    { name: "@片源台", cap: "欧了", src: "assets/clip-a.mp4", poster: "assets/showreel-poster.jpg" },
    { name: "@夜场", cap: "大不了从头再来", src: "assets/clip-b.mp4", poster: "assets/hero-still.jpg" },
  ];

  const rail = document.getElementById("storiesRail");
  const player = document.getElementById("storyPlayer");
  const vid = document.getElementById("storyVid");
  const progress = document.getElementById("storyProgress");
  const nameEl = document.getElementById("storyName");
  const capEl = document.getElementById("storyCap");
  let idx = 0;
  let timer = 0;
  let started = 0;
  const DUR = 4500;

  if (rail) {
    rail.innerHTML = items
      .map(
        (it, i) => `<button type="button" class="story-avatar" data-i="${i}">
          <img src="${it.poster}" alt="" />
          <span>${it.name.replace("@", "")}</span>
        </button>`
      )
      .join("");
  }

  const stop = () => {
    clearInterval(timer);
    if (vid) {
      vid.pause();
      vid.removeAttribute("src");
    }
    if (player) player.hidden = true;
    document.body.style.overflow = "";
  };

  const tick = () => {
    const p = Math.min(1, (performance.now() - started) / DUR);
    if (progress) progress.style.transform = `scaleX(${p})`;
    if (p >= 1) next();
  };

  const play = (i) => {
    idx = (i + items.length) % items.length;
    const it = items[idx];
    if (!player || !vid) return;
    player.hidden = false;
    document.body.style.overflow = "hidden";
    if (nameEl) nameEl.textContent = it.name;
    if (capEl) capEl.textContent = it.cap;
    vid.src = it.src;
    vid.muted = true;
    vid.play().catch(() => {});
    started = performance.now();
    if (progress) progress.style.transform = "scaleX(0)";
    clearInterval(timer);
    timer = setInterval(tick, 32);
  };

  const next = () => play(idx + 1);
  const prev = () => play(idx - 1);

  rail?.addEventListener("click", (e) => {
    const b = e.target.closest("[data-i]");
    if (b) play(Number(b.dataset.i));
  });
  document.getElementById("storyNext")?.addEventListener("click", next);
  document.getElementById("storyPrev")?.addEventListener("click", prev);
  document.getElementById("storyClose")?.addEventListener("click", stop);
  window.addEventListener("keydown", (e) => {
    if (player?.hidden) return;
    if (e.key === "Escape") stop();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });
})();
