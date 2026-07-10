(() => {
  const stops = [
    { n: "01 首页气质", href: "index.html", d: "看壳：影像、pin、入口墙" },
    { n: "02 作品硬实力", href: "hard.html", d: "硬仗档案 pin 叙事" },
    { n: "03 片源与网感", href: "reel.html", d: "自定义播放器 + 竖屏故事" },
    { n: "04 土酷玩具箱", href: "soundboard.html", d: "音板 / 烟花 / 节拍 / 开箱" },
    { n: "05 开干", href: "contact.html", d: "档期与表单" },
  ];
  const root = document.getElementById("tour");
  if (!root) return;
  let done = [];
  try { done = JSON.parse(localStorage.getItem("hala-tour") || "[]"); } catch { /* */ }

  const save = () => {
    try { localStorage.setItem("hala-tour", JSON.stringify(done)); } catch { /* */ }
  };

  root.innerHTML = stops
    .map((s, i) => {
      const ok = done.includes(s.href);
      return `<article class="tour-stop ${ok ? "is-done" : ""}">
        <div><b>${s.n}</b><p>${s.d}</p></div>
        <div class="tour-actions">
          <a class="btn line" href="${s.href}">前往</a>
          <button type="button" data-i="${i}" class="btn solid">${ok ? "已打卡" : "打卡"}</button>
        </div>
      </article>`;
    })
    .join("") + `<p class="tour-progress">进度 ${done.length}/${stops.length} · ${done.length >= 5 ? "欧了，导览完成" : "接着走"}</p>
    <button type="button" class="btn line" id="tourReset">重置进度</button>`;

  root.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-i]");
    if (!b) return;
    const href = stops[Number(b.dataset.i)].href;
    if (!done.includes(href)) done.push(href);
    save();
    try { new Audio("assets/biao-19.mp3").play(); } catch { /* */ }
    location.reload();
  });
  document.getElementById("tourReset")?.addEventListener("click", () => {
    done = [];
    save();
    location.reload();
  });
})();
