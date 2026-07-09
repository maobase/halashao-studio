(() => {
  const track = document.getElementById("billTrack");
  const board = document.getElementById("billBoard");
  const input = document.getElementById("billText");
  const speed = document.getElementById("billSpeed");
  let color = "#c8f542";

  const apply = () => {
    if (!track) return;
    const text = (input?.value || "哈拉少").trim() + " · ";
    track.textContent = text.repeat(6);
    track.style.color = color;
    track.style.animationDuration = `${(140 - Number(speed?.value || 55)) / 10 + 4}s`;
    if (board) board.style.setProperty("--led", color);
  };

  document.getElementById("billApply")?.addEventListener("click", apply);
  speed?.addEventListener("input", apply);
  document.querySelectorAll(".bill-colors .sw").forEach((b) => {
    b.addEventListener("click", () => {
      color = b.dataset.c || color;
      apply();
    });
  });
  apply();
})();
