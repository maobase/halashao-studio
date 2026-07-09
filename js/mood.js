(() => {
  const tu = document.getElementById("mTu");
  const ku = document.getElementById("mKu");
  const tuV = document.getElementById("mTuV");
  const kuV = document.getElementById("mKuV");
  const tag = document.getElementById("moodTag");
  const copy = document.getElementById("moodCopy");
  const biao = document.getElementById("moodBiao");

  const quotes = [
    "小树不倒我就不倒",
    "欧了",
    "肉眼凡胎，量你也看不出来",
    "你就慢慢跟我处，处不好你自己找原因",
    "本市几场著名硬仗都是我主打的",
    "论成败，人生豪迈；大不了从头再来",
    "时光能不能倒流？豆角能不能煮熟？",
  ];

  const render = () => {
    const t = Number(tu?.value || 50);
    const k = Number(ku?.value || 50);
    if (tuV) tuV.textContent = String(t);
    if (kuV) kuV.textContent = String(k);

    let label = "土酷均衡型";
    let text = "外壳够锋利，内核够人间。适合要记忆点、又不要油腻的品牌。";
    if (t > 70 && k > 70) {
      label = "极端土酷核弹";
      text = "灯牌+粒子+假直播全开。评委会皱眉，用户会截图。适合造势与发布。";
    } else if (t > 65 && k < 45) {
      label = "纯土夜市型";
      text = "红章、金曲、彪哥语录压场。少炫技，多态度。适合本地生活与人格品牌。";
    } else if (k > 65 && t < 45) {
      label = "冷锋设计型";
      text = "暗金影像、pin 叙事、磁吸交互。土味只做点缀。适合科技与产品。";
    } else if (t > 55) {
      label = "土壳带刃型";
      text = "先土后酷：字幕与语录抓人，后面用作品硬实力收口。";
    } else if (k > 55) {
      label = "酷壳藏土型";
      text = "第一眼 Awwwards，第二眼人间烟火。反差是钩子。";
    }

    if (tag) tag.textContent = label;
    if (copy) copy.textContent = text;
    if (biao) biao.textContent = `彪哥批注：「${quotes[Math.floor((t + k) / 30) % quotes.length]}」`;
  };

  tu?.addEventListener("input", render);
  ku?.addEventListener("input", render);
  document.getElementById("moodReroll")?.addEventListener("click", () => {
    if (biao) biao.textContent = `彪哥批注：「${quotes[Math.floor(Math.random() * quotes.length)]}」`;
  });
  render();
})();
