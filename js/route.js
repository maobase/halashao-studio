(() => {
  const tree = {
    start: {
      step: "第 1 关",
      q: "客户说：给我做个高级感官网",
      choices: [
        { t: "上玻璃拟态 + 紫渐变", next: "soft", b: "肉眼凡胎也能看出来是模板。" },
        { t: "先问记忆点是什么", next: "ask", b: "你就慢慢跟我处，先对齐刀口。" },
        { t: "直接甩土酷反差方案", next: "tu", b: "该出手时就出手。" },
      ],
    },
    soft: {
      step: "第 2 关 · 模板线",
      q: "甲方说跟竞品好像，但还想更高级",
      choices: [
        { t: "继续加特效", next: "fail", b: "小树要倒了。" },
        { t: "推倒重来，走硬仗", next: "ask", b: "大不了从头再来。" },
      ],
    },
    ask: {
      step: "第 2 关 · 对齐线",
      q: "客户只说「大气、国际、年轻」",
      choices: [
        { t: "逼出一个禁止清单", next: "forge", b: "少，是刃。先删。" },
        { t: "先做三套皮给他挑", next: "soft", b: "这叫拖延，不叫专业。" },
      ],
    },
    tu: {
      step: "第 2 关 · 土酷线",
      q: "客户怕土，又要网感",
      choices: [
        { t: "壳酷芯土，先演示片源", next: "forge", b: "本市著名硬仗主打。" },
        { t: "全面土味化", next: "fail", b: "土过头也是另一种模板。" },
      ],
    },
    forge: {
      step: "第 3 关 · 锻造",
      q: "时间只剩一半，范围还在涨",
      choices: [
        { t: "砍范围，保记忆点", next: "win", b: "欧了。这才像硬仗。" },
        { t: "全接，加班硬扛", next: "fail", b: "兄弟你怎么回事。" },
      ],
    },
    win: {
      step: "结局 · 胜",
      q: "硬仗打完：有记忆点，能传播，能延展。",
      end: true,
      tip: "推荐去：片源台 / 硬仗档案 / 开干",
      links: ["reel.html", "hard.html", "contact.html"],
      b: "小树不倒我就不倒。",
    },
    fail: {
      step: "结局 · 重来",
      q: "做成了“谁都能做”的站。没人记得你。",
      end: true,
      tip: "重开，或去审美罗盘校准气质",
      links: ["mood.html", "dice.html", "docs.html"],
      b: "论成败，人生豪迈；大不了从头再来。",
    },
  };

  let node = "start";
  const stepEl = document.getElementById("routeStep");
  const qEl = document.getElementById("routeQ");
  const choices = document.getElementById("routeChoices");
  const biao = document.getElementById("routeBiao");

  const render = () => {
    const n = tree[node];
    if (!n) return;
    if (stepEl) stepEl.textContent = n.step;
    if (qEl) qEl.textContent = n.q;
    if (biao) biao.textContent = n.b ? `「${n.b}」` : "";
    if (!choices) return;
    if (n.end) {
      choices.innerHTML = `
        <p class="route-end">${n.tip || ""}</p>
        <div class="route-links">${(n.links || []).map((h) => `<a class="btn line" href="${h}">${h.replace(".html","")}</a>`).join("")}</div>`;
      try { new Audio(node === "win" ? "assets/biao-2.mp3" : "assets/biao-6.mp3").play(); } catch { /* */ }
      return;
    }
    choices.innerHTML = n.choices
      .map((c, i) => `<button type="button" class="route-btn" data-i="${i}">${c.t}</button>`)
      .join("");
  };

  choices?.addEventListener("click", (e) => {
    const b = e.target.closest("[data-i]");
    if (!b) return;
    const n = tree[node];
    const c = n.choices[Number(b.dataset.i)];
    if (biao) biao.textContent = `「${c.b}」`;
    node = c.next;
    setTimeout(render, 180);
  });

  document.getElementById("routeReset")?.addEventListener("click", () => {
    node = "start";
    render();
  });

  render();
})();
