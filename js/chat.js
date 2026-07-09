(() => {
  const log = document.getElementById("chatLog");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const quick = document.getElementById("chatQuick");

  const replies = [
    { k: /模板|套模板|同质/, a: "不接。我们不生产模板。要记忆点，别要复印件。" },
    { k: /价格|多少钱|预算/, a: "先谈硬仗范围，再谈价。便宜的高级感，通常不高级。" },
    { k: /多久|周期|时间/, a: "品牌 6-10 周，产品 4-12 周。急可以，但别指望一夜欧了。" },
    { k: /玻璃|拟态|渐变紫|赛博/, a: "肉眼凡胎也能看出来那是模板味。换思路：土酷反差更有杀伤力。" },
    { k: /土|网感|新二|直播/, a: "土是芯，酷是壳。可以假直播、真节奏，但不做廉价土。" },
    { k: /失败|翻车|重来/, a: "论成败，人生豪迈；大不了从头再来。但我们更想一次锻对。" },
    { k: /开始|合作|档期/, a: "去开干页丢需求。你就慢慢跟我处，处不好你自己找原因。" },
    { k: /谁|介绍|你们/, a: "哈拉少。本市几场著名硬仗都是我主打的——精神上。" },
  ];

  const fallback = [
    "小树不倒我就不倒。说人话：把目标讲清楚。",
    "欧了。我听见了，但还不够锋利。",
    "该出手时就出手。别只收藏灵感。",
    "豆角能不能煮熟？项目能不能成？看你是否敢删。",
  ];

  const add = (who, text) => {
    if (!log) return;
    const row = document.createElement("div");
    row.className = `chat-row ${who}`;
    row.innerHTML = `<b>${who === "biao" ? "彪哥" : "你"}</b><p>${text}</p>`;
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
  };

  const answer = (q) => {
    const hit = replies.find((r) => r.k.test(q));
    return hit ? hit.a : fallback[Math.floor(Math.random() * fallback.length)];
  };

  const ask = (q) => {
    const text = q.trim();
    if (!text) return;
    add("user", text);
    setTimeout(() => {
      add("biao", answer(text));
      try { new Audio("assets/biao-2.mp3").play(); } catch { /* */ }
    }, 350);
  };

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    ask(input?.value || "");
    if (input) input.value = "";
  });

  const qs = ["能做模板站吗？", "怎么又高级又网感？", "多久出一版？", "档期还有吗？"];
  if (quick) {
    quick.innerHTML = qs.map((q) => `<button type="button" data-q="${q}">${q}</button>`).join("");
    quick.addEventListener("click", (e) => {
      const b = e.target.closest("[data-q]");
      if (b) ask(b.dataset.q);
    });
  }

  add("biao", "在。有硬仗直说。模板单自动挂机。");
})();
