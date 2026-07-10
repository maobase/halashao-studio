(() => {
  const root = document.getElementById("mirror");
  if (!root) return;
  const move = (e) => {
    const r = root.getBoundingClientRect();
    const p = Math.min(0.9, Math.max(0.1, (e.clientX - r.left) / r.width));
    root.style.setProperty("--split", `${p * 100}%`);
  };
  root.addEventListener("pointermove", move);
  root.querySelectorAll(".mirror-word").forEach((el) => {
    const t = el.dataset.text || el.textContent;
    el.innerHTML = `<span class="l">${t}</span><span class="r">${t}</span>`;
  });
})();
