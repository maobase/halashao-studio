(() => {
  const spot = document.getElementById("spot");
  if (!spot) return;
  const move = (e) => {
    const r = spot.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    spot.style.setProperty("--sx", `${x}%`);
    spot.style.setProperty("--sy", `${y}%`);
  };
  spot.addEventListener("pointermove", move);
  spot.style.setProperty("--sx", "50%");
  spot.style.setProperty("--sy", "40%");
})();
