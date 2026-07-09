(() => {
  const faces = [
    { t: "先砍模板话术", b: "我们不生产模板", a: "assets/biao-5.mp3" },
    { t: "上一条竖屏钩子", b: "欧了", a: "assets/biao-2.mp3" },
    { t: "把色板改成酸柠+红章", b: "那长相就是证据", a: "assets/biao-3.mp3" },
    { t: "做个假直播预热", b: "家人们开干", a: "assets/biao-1.mp3" },
    { t: "写一句土到发光的字幕", b: "豆角能不能煮熟？", a: "assets/biao-7.mp3" },
    { t: "重做信息层级", b: "你就慢慢跟我处", a: "assets/biao-4.mp3" },
    { t: "片头只留 3 秒记忆点", b: "少即是刃", a: "assets/biao-6.mp3" },
    { t: "今晚必须出一版", b: "该出手时就出手", a: "assets/biao-12.mp3" },
  ];

  const btn = document.getElementById("diceBtn");
  const face = document.getElementById("diceFace");
  const result = document.getElementById("diceResult");
  const biao = document.getElementById("diceBiao");
  const history = document.getElementById("diceHistory");
  let rolling = false;

  const roll = () => {
    if (rolling) return;
    rolling = true;
    btn?.classList.add("spin");
    let n = 0;
    const id = setInterval(() => {
      if (face) face.textContent = String(1 + Math.floor(Math.random() * 8));
      n++;
      if (n > 12) {
        clearInterval(id);
        const hit = faces[Math.floor(Math.random() * faces.length)];
        if (face) face.textContent = String(1 + faces.indexOf(hit));
        if (result) result.textContent = hit.t;
        if (biao) biao.textContent = `「${hit.b}」`;
        try { new Audio(hit.a).play(); } catch { /* */ }
        if (history) {
          const row = document.createElement("div");
          row.textContent = `${hit.t} · ${hit.b}`;
          history.prepend(row);
        }
        btn?.classList.remove("spin");
        rolling = false;
      }
    }, 60);
  };

  btn?.addEventListener("click", roll);
})();
