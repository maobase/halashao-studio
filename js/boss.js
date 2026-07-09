(() => {
  const grid = document.getElementById("bossGrid");
  const biao = document.getElementById("bossBiao");
  const quotes = [
    "本市几场著名硬仗都是我主打的",
    "小树不倒我就不倒",
    "论成败，人生豪迈；大不了从头再来",
    "该出手时就出手",
    "欧了",
  ];

  const metrics = () => [
    { k: "硬仗完成率", v: `${86 + Math.floor(Math.random() * 12)}%`, t: "本周" },
    { k: "土味浓度", v: `${60 + Math.floor(Math.random() * 35)}`, t: "指数" },
    { k: "酷炫锐度", v: `${70 + Math.floor(Math.random() * 28)}`, t: "指数" },
    { k: "欧了次数", v: `${120 + Math.floor(Math.random() * 80)}`, t: "累计" },
    { k: "模板击杀", v: `${9 + Math.floor(Math.random() * 20)}`, t: "本月" },
    { k: "档期余位", v: "2", t: "稀缺" },
  ];

  const render = () => {
    if (!grid) return;
    grid.innerHTML = metrics()
      .map(
        (m) => `<article class="boss-card">
          <span>${m.t}</span>
          <b data-count="${m.v}">${m.v}</b>
          <p>${m.k}</p>
        </article>`
      )
      .join("");
    if (biao) biao.textContent = `「${quotes[Math.floor(Math.random() * quotes.length)]}」`;
  };

  document.getElementById("bossRefresh")?.addEventListener("click", () => {
    render();
    try { new Audio("assets/biao-5.mp3").play(); } catch { /* */ }
  });
  render();
})();
