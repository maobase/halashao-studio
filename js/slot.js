(() => {
  const A = ["土酷", "冷锋", "夜市", "暗金", "假直播", "红章"];
  const B = ["官网", "片源", "竖屏", "控制台", "灯牌", "音板"];
  const C = ["小树不倒", "欧了", "少是刃", "硬仗主打", "从头再来", "该出手"];
  let spinning = false;

  const pull = () => {
    if (spinning) return;
    spinning = true;
    let n = 0;
    const id = setInterval(() => {
      document.getElementById("r0").textContent = A[Math.floor(Math.random() * A.length)];
      document.getElementById("r1").textContent = B[Math.floor(Math.random() * B.length)];
      document.getElementById("r2").textContent = C[Math.floor(Math.random() * C.length)];
      n++;
      if (n > 18) {
        clearInterval(id);
        const a = A[Math.floor(Math.random() * A.length)];
        const b = B[Math.floor(Math.random() * B.length)];
        const c = C[Math.floor(Math.random() * C.length)];
        document.getElementById("r0").textContent = a;
        document.getElementById("r1").textContent = b;
        document.getElementById("r2").textContent = c;
        const out = document.getElementById("slotOut");
        if (out) out.textContent = `配方：${a} × ${b} ×「${c}」`;
        try { new Audio("assets/biao-19.mp3").play(); } catch { /* */ }
        spinning = false;
      }
    }, 50);
  };

  document.getElementById("slotPull")?.addEventListener("click", pull);
})();
