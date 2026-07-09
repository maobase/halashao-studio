(() => {
  const pads = [
    ["小树不倒", "assets/biao-1.mp3"],
    ["欧了", "assets/biao-2.mp3"],
    ["肉眼凡胎", "assets/biao-3.mp3"],
    ["慢慢跟我处", "assets/biao-4.mp3"],
    ["硬仗主打", "assets/biao-5.mp3"],
    ["从头再来", "assets/biao-6.mp3"],
    ["豆角煮熟", "assets/biao-7.mp3"],
    ["稍后再拨", "assets/biao-8.mp3"],
    ["工作范围", "assets/biao-9.mp3"],
    ["积极进取", "assets/biao-10.mp3"],
    ["你是谁", "assets/biao-11.mp3"],
    ["该出手", "assets/biao-12.mp3"],
    ["怎么回事", "assets/biao-13.mp3"],
    ["江湖义气", "assets/biao-14.mp3"],
    ["走自己的路", "assets/biao-15.mp3"],
  ];
  const board = document.getElementById("soundBoard");
  if (board) {
    board.innerHTML = pads
      .map(
        ([name, src], i) =>
          `<button type="button" class="pad" data-src="${src}" data-i="${i}" data-hot>
            <b>${i + 1}</b><span>${name}</span>
          </button>`
      )
      .join("");
  }

  const fire = (src, btn) => {
    const a = new Audio(src);
    a.play().catch(() => {});
    btn?.classList.add("hit");
    setTimeout(() => btn?.classList.remove("hit"), 180);
  };

  board?.addEventListener("click", (e) => {
    const b = e.target.closest(".pad");
    if (b) fire(b.dataset.src, b);
  });

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      fire("assets/biao-2.mp3");
      return;
    }
    const n = Number(e.key);
    if (n >= 1 && n <= 9 && pads[n - 1]) {
      const btn = board?.querySelector(`[data-i="${n - 1}"]`);
      fire(pads[n - 1][1], btn);
    }
  });
})();
