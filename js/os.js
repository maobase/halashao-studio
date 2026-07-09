(() => {
  const map = document.getElementById("osMap");
  if (!map) return;

  const modules = [
    { href: "index.html", tag: "Home", name: "首页", desc: "系统大门 · pin 宣言" },
    { href: "work.html", tag: "Work", name: "作品库", desc: "hover 视频案例" },
    { href: "hard.html", tag: "Hard", name: "硬仗档案", desc: "全屏 pin 战报" },
    { href: "reel.html", tag: "Reel", name: "片源台", desc: "自定义播放器" },
    { href: "xin2.html", tag: "Xin2", name: "新二流", desc: "伪记录信息流" },
    { href: "live.html", tag: "Live", name: "直播感", desc: "假直播真节奏" },
    { href: "wall.html", tag: "Wall", name: "弹幕墙", desc: "满屏土味弹幕" },
    { href: "arena.html", tag: "Arena", name: "土酷对决", desc: "三局两胜" },
    { href: "biao.html", tag: "Biao", name: "彪哥语录", desc: "金句 + 砸一下" },
    { href: "jukebox.html", tag: "Juke", name: "点唱机", desc: "语录真语音" },
    { href: "fx.html", tag: "FX", name: "特效场", desc: "零件实验室" },
    { href: "cast.html", tag: "Cast", name: "人设卡", desc: "反差天团" },
    { href: "studio.html", tag: "Studio", name: "工作室", desc: "叙事四章" },
    { href: "timeline.html", tag: "Time", name: "时间线", desc: "从头再来" },
    { href: "menu.html", tag: "Menu", name: "服务菜单", desc: "硬菜上桌" },
    { href: "contact.html", tag: "Go", name: "开干", desc: "预约档期" },
  ];

  map.innerHTML = modules
    .map(
      (m, i) => `<a class="os-node" href="${m.href}" data-hot style="--i:${i}">
        <span class="tag">${m.tag}</span>
        <h3>${m.name}</h3>
        <p>${m.desc}</p>
        <i>${String(i + 1).padStart(2, "0")}</i>
      </a>`
    )
    .join("");
})();
