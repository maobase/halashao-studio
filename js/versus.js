(() => {
  const pairs = [
    ["assets/work-brand.jpg", "assets/hero-still.jpg"],
    ["assets/work-product.jpg", "assets/work-hover-2.mp4"],
    ["assets/work-motion.jpg", "assets/clip-a.mp4"],
  ];
  // for video after - use image posters only for simplicity of slider
  const pairImgs = [
    ["assets/work-brand.jpg", "assets/hero-still.jpg"],
    ["assets/work-product.jpg", "assets/showreel-poster.jpg"],
    ["assets/work-motion.jpg", "assets/work-brand.jpg"],
  ];

  const frame = document.getElementById("vsFrame");
  const after = document.getElementById("vsAfter");
  const handle = document.getElementById("vsHandle");
  let pos = 50;
  let drag = false;

  const setPos = (p) => {
    pos = Math.min(95, Math.max(5, p));
    if (after) after.style.clipPath = `inset(0 0 0 ${pos}%)`;
    if (handle) handle.style.left = `${pos}%`;
  };

  const fromEvent = (e) => {
    if (!frame) return;
    const r = frame.getBoundingClientRect();
    const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - r.left;
    setPos((x / r.width) * 100);
  };

  handle?.addEventListener("pointerdown", (e) => {
    drag = true;
    handle.setPointerCapture?.(e.pointerId);
  });
  frame?.addEventListener("pointerdown", (e) => {
    drag = true;
    fromEvent(e);
  });
  window.addEventListener("pointermove", (e) => {
    if (drag) fromEvent(e);
  });
  window.addEventListener("pointerup", () => { drag = false; });

  document.querySelectorAll(".vs-switch [data-pair]").forEach((b) => {
    b.addEventListener("click", () => {
      document.querySelectorAll(".vs-switch [data-pair]").forEach((x) => x.classList.remove("is-on"));
      b.classList.add("is-on");
      const i = Number(b.dataset.pair) || 0;
      const [a, c] = pairImgs[i];
      const before = frame?.querySelector(".before");
      if (before) before.style.backgroundImage = `url(${a})`;
      if (after) after.style.backgroundImage = `url(${c})`;
      setPos(50);
    });
  });

  setPos(50);
})();
