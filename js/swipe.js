(() => {
  const cards = [
    { t: "假直播预热片", d: "15s 竖版 + 弹幕感字幕", tag: "网感" },
    { t: "红章品牌系统", d: "标识能盖章也能上屏", tag: "土" },
    { t: "暗金控制台", d: "密度信息架构重构", tag: "酷" },
    { t: "粒子发布片", d: "主片 45s + 竖版切条", tag: "酷" },
    { t: "县城灯牌 KV", d: "LED 字 + 夜市色", tag: "土" },
    { t: "硬仗骰子 H5", d: "互动获客小游戏", tag: "玩" },
    { t: "双轨官网", d: "土/酷一键切换", tag: "系统" },
    { t: "彪哥语录音板", d: "活动现场气氛组", tag: "玩" },
  ];
  let i = 0;
  const saved = [];
  const stack = document.getElementById("swipeStack");
  const savedEl = document.getElementById("swipeSaved");

  const render = () => {
    if (!stack) return;
    if (i >= cards.length) {
      stack.innerHTML = `<div class="swipe-card done"><h2>划完了</h2><p>收藏 ${saved.length} 个方向。欧了。</p></div>`;
      if (savedEl) {
        savedEl.innerHTML = `<h3>你的硬菜菜单</h3><ul>${saved.map((s) => `<li>${s}</li>`).join("") || "<li>全弃了 · 大不了从头再来</li>"}</ul>
          <a class="btn solid" href="contact.html">拿去开干</a>`;
      }
      try { new Audio("assets/biao-2.mp3").play(); } catch { /* */ }
      return;
    }
    const c = cards[i];
    stack.innerHTML = `<article class="swipe-card" id="swipeCard">
      <span>${c.tag}</span><h2>${c.t}</h2><p>${c.d}</p>
      <small>${i + 1}/${cards.length}</small>
    </article>`;
  };

  const decide = (yes) => {
    const card = document.getElementById("swipeCard");
    if (!card || i >= cards.length) return;
    card.classList.add(yes ? "yes" : "no");
    if (yes) saved.push(cards[i].t);
    setTimeout(() => {
      i++;
      render();
    }, 280);
    try { new Audio(yes ? "assets/biao-18.mp3" : "assets/biao-16.mp3").play(); } catch { /* */ }
  };

  document.getElementById("swipeYes")?.addEventListener("click", () => decide(true));
  document.getElementById("swipeNo")?.addEventListener("click", () => decide(false));

  // pointer swipe
  let sx = 0;
  stack?.addEventListener("pointerdown", (e) => { sx = e.clientX; });
  stack?.addEventListener("pointerup", (e) => {
    const dx = e.clientX - sx;
    if (dx > 60) decide(true);
    if (dx < -60) decide(false);
  });

  render();
})();
