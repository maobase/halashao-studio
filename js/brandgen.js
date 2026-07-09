(() => {
  const a = ["铁", "野", "锋", "夜", "硬", "烈", "浪", "刃", "燥", "狂", "冷", "热"];
  const b = ["少", "局", "社", "厂", "堂", "栈", "坞", "社畜", "浪子", "俱乐部", "研究所", "事务所"];
  const c = ["不倒", "开干", "主打", "直球", "硬核", "人间", "痛快", "反骨"];
  const quotes = [
    "那长相就是证据",
    "欧了",
    "小树不倒我就不倒",
    "这才叫痛快",
    "走自己的路让别人说去吧",
  ];

  const nameEl = document.getElementById("bgenName");
  const tagEl = document.getElementById("bgenTag");
  const biaoEl = document.getElementById("bgenBiao");

  const gen = () => {
    const n = a[Math.floor(Math.random() * a.length)] + a[Math.floor(Math.random() * a.length)] + b[Math.floor(Math.random() * b.length)];
    const tag = c[Math.floor(Math.random() * c.length)] + " · " + c[Math.floor(Math.random() * c.length)];
    if (nameEl) nameEl.textContent = n;
    if (tagEl) tagEl.textContent = tag;
    if (biaoEl) biaoEl.textContent = `「${quotes[Math.floor(Math.random() * quotes.length)]}」`;
    try { new Audio("assets/biao-16.mp3").play(); } catch { /* */ }
  };

  document.getElementById("bgenGo")?.addEventListener("click", gen);
  gen();
})();
