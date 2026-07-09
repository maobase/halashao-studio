(() => {
  const map = document.getElementById("osMap");
  if (!map) return;
  const modules = [
    { href: "index.html", tag: "Home", name: "首页", desc: "系统大门" },
    { href: "work.html", tag: "Work", name: "作品库", desc: "hover 视频" },
    { href: "gallery.html", tag: "Gallery", name: "影库", desc: "灯箱弹药" },
    { href: "hard.html", tag: "Hard", name: "硬仗档案", desc: "pin 战报" },
    { href: "reel.html", tag: "Reel", name: "片源台", desc: "播放器" },
    { href: "xin2.html", tag: "Xin2", name: "新二流", desc: "信息流" },
    { href: "live.html", tag: "Live", name: "直播感", desc: "伪直播" },
    { href: "night.html", tag: "Night", name: "夜场", desc: "沉浸氛围" },
    { href: "radio.html", tag: "Radio", name: "土酷电台", desc: "频谱语录" },
    { href: "karaoke.html", tag: "K", name: "卡拉OK", desc: "跟打得分" },
    { href: "billboard.html", tag: "LED", name: "城市灯牌", desc: "夜市灯箱" },
    { href: "workshop.html", tag: "Forge", name: "锻造工坊", desc: "四步出刃" },
    { href: "mood.html", tag: "Mood", name: "审美罗盘", desc: "土酷滑杆" },
    { href: "arena.html", tag: "Arena", name: "土酷对决", desc: "三局两胜" },
    { href: "wall.html", tag: "Wall", name: "弹幕墙", desc: "满屏发射" },
    { href: "fx.html", tag: "FX", name: "特效场", desc: "零件库" },
    { href: "jukebox.html", tag: "Juke", name: "点唱机", desc: "真语音" },
    { href: "biao.html", tag: "Biao", name: "彪哥语录", desc: "金句墙" },
    { href: "cast.html", tag: "Cast", name: "人设卡", desc: "翻转卡" },
    { href: "studio.html", tag: "Studio", name: "工作室", desc: "叙事" },
    { href: "timeline.html", tag: "Time", name: "时间线", desc: "年表" },
    { href: "menu.html", tag: "Menu", name: "服务菜单", desc: "硬菜" },
    { href: "docs.html", tag: "Docs", name: "使用手册", desc: "说明书" },
    { href: "contact.html", tag: "Go", name: "开干", desc: "预约" },
  ];
  map.innerHTML = modules.map((m, i) =>
    `<a class="os-node" href="${m.href}" data-hot style="--i:${i}">
      <span class="tag">${m.tag}</span>
      <h3>${m.name}</h3>
      <p>${m.desc}</p>
      <i>${String(i + 1).padStart(2, "0")}</i>
    </a>`
  ).join("");
})();
