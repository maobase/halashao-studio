(() => {
  const pairs = [
    { tu: "红章 · 夜市金曲 · 假直播", ku: "酸柠粒子 · pin 叙事 · 磁吸 CTA" },
    { tu: "彪哥语录跑马灯", ku: "GSAP 硬仗叠卡" },
    { tu: "卡拉OK渐变字", ku: "暗金电影镜头" },
    { tu: "「欧了」音效打击", ku: "自定义片源播放器" },
    { tu: "豆角哲学文案", ku: "横向作品 hover 视频" },
    { tu: "土味点唱机", ku: "故障字 + 3D 倾斜卡" },
  ];

  let round = 0;
  let tu = 0;
  let ku = 0;
  const scoreTu = document.getElementById("scoreTu");
  const scoreKu = document.getElementById("scoreKu");
  const call = document.getElementById("arenaCall");
  const tuText = document.getElementById("tuText");
  const kuText = document.getElementById("kuText");
  const log = document.getElementById("arenaLog");
  const pickTu = document.getElementById("pickTu");
  const pickKu = document.getElementById("pickKu");

  const sayings = {
    tu: ["土味是武器！", "家人们选得对！", "这才叫接地气！", "欧了，土赢半步！"],
    ku: ["酷到犯规！", "粒子给你撑腰！", "设计狗狂喜！", "锋利，不解释！"],
  };

  const sync = () => {
    if (scoreTu) scoreTu.textContent = String(tu);
    if (scoreKu) scoreKu.textContent = String(ku);
    const p = pairs[round % pairs.length];
    if (tuText) tuText.textContent = p.tu;
    if (kuText) kuText.textContent = p.ku;
    if (call) {
      if (tu >= 3 || ku >= 3) {
        call.textContent = tu > ku ? "土味冠军 · 小树不倒" : ku > tu ? "酷炫冠军 · 少即是刃" : "平手 · 大不了从头再来";
      } else {
        call.textContent = `第 ${round + 1} 局 · 选边`;
      }
    }
  };

  const pushLog = (msg) => {
    if (!log) return;
    const row = document.createElement("div");
    row.textContent = msg;
    log.prepend(row);
  };

  const play = (side) => {
    if (tu >= 3 || ku >= 3) return;
    if (side === "tu") {
      tu++;
      pushLog(`第 ${round + 1} 局 土胜 — ${sayings.tu[Math.floor(Math.random() * sayings.tu.length)]}`);
      try { new Audio("assets/biao-2.mp3").play(); } catch { /* */ }
    } else {
      ku++;
      pushLog(`第 ${round + 1} 局 酷胜 — ${sayings.ku[Math.floor(Math.random() * sayings.ku.length)]}`);
      try { new Audio("assets/biao-1.mp3").play(); } catch { /* */ }
    }
    round++;
    sync();
    if (tu >= 3 || ku >= 3) {
      pushLog(tu > ku ? "彪哥解说：土味进行到底！" : "彪哥解说：酷是壳，刃是骨！");
    }
  };

  pickTu?.addEventListener("click", () => play("tu"));
  pickKu?.addEventListener("click", () => play("ku"));
  document.getElementById("arenaReset")?.addEventListener("click", () => {
    round = 0;
    tu = 0;
    ku = 0;
    if (log) log.innerHTML = "";
    sync();
    pushLog("重开 · 论成败人生豪迈");
  });

  sync();
})();
