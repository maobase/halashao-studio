(() => {
  const lines = [
    "小树不倒我就不倒",
    "欧了",
    "少即是刃",
    "该出手时就出手",
    "大不了从头再来",
    "本市著名硬仗主打",
    "你就慢慢跟我处",
    "这才叫痛快",
  ];
  let target = "";
  let score = 0;
  let left = 60;
  let timer = null;
  const targetEl = document.getElementById("twTarget");
  const input = document.getElementById("twInput");
  const timeEl = document.getElementById("twTime");
  const scoreEl = document.getElementById("twScore");

  const next = () => {
    target = lines[Math.floor(Math.random() * lines.length)];
    if (targetEl) targetEl.textContent = target;
    if (input) input.value = "";
  };

  const end = () => {
    clearInterval(timer);
    timer = null;
    if (targetEl) targetEl.textContent = score >= 80 ? "痛快！高分欧了" : "时间到 · 从头再来";
    try { new Audio(score >= 80 ? "assets/biao-18.mp3" : "assets/biao-6.mp3").play(); } catch { /* */ }
  };

  document.getElementById("twStart")?.addEventListener("click", () => {
    score = 0;
    left = 60;
    if (scoreEl) scoreEl.textContent = "0";
    if (timeEl) timeEl.textContent = "60";
    next();
    input?.focus();
    clearInterval(timer);
    timer = setInterval(() => {
      left--;
      if (timeEl) timeEl.textContent = String(left);
      if (left <= 0) end();
    }, 1000);
  });

  input?.addEventListener("input", () => {
    if (!timer) return;
    if (input.value === target) {
      score += 10 + target.length;
      if (scoreEl) scoreEl.textContent = String(score);
      try { new Audio("assets/biao-2.mp3").play(); } catch { /* */ }
      next();
    }
  });
})();
