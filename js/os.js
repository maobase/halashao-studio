(() => {
  const map = document.getElementById("osMap");
  if (!map) return;
  const modules = [
    ["Home","首页","系统大门","index.html"],
    ["OS","系统地图","总览","os.html"],
    ["Docs","使用手册","说明书","docs.html"],
    ["Work","作品库","hover 视频","work.html"],
    ["Gallery","影库","灯箱","gallery.html"],
    ["Stories","故事条","竖屏","stories.html"],
    ["Hard","硬仗档案","pin 战报","hard.html"],
    ["Versus","前后对比","滑杆","versus.html"],
    ["Reel","片源台","播放器","reel.html"],
    ["Xin2","新二流","信息流","xin2.html"],
    ["Live","直播感","伪直播","live.html"],
    ["Night","夜场","沉浸","night.html"],
    ["Storm","文字风暴","轨迹","storm.html"],
    ["Dice","硬仗骰子","随机","dice.html"],
    ["Stamp","土味盖章","红章","stamp.html"],
    ["Boss","老板看板","KPI","boss.html"],
    ["Radio","土酷电台","频谱","radio.html"],
    ["K","卡拉OK","跟打","karaoke.html"],
    ["LED","城市灯牌","灯箱","billboard.html"],
    ["Forge","锻造工坊","四步","workshop.html"],
    ["Mood","审美罗盘","滑杆","mood.html"],
    ["Arena","土酷对决","对战","arena.html"],
    ["Wall","弹幕墙","发射","wall.html"],
    ["FX","特效场","零件","fx.html"],
    ["Juke","点唱机","语音","jukebox.html"],
    ["Biao","彪哥语录","金句","biao.html"],
    ["Cast","人设卡","翻转","cast.html"],
    ["Hire","招人","岗位","recruit.html"],
    ["Press","媒体包","物料","press.html"],
    ["Studio","工作室","叙事","studio.html"],
    ["Time","时间线","年表","timeline.html"],
    ["Menu","服务菜单","硬菜","menu.html"],
    ["Go","开干","预约","contact.html"],
  ];
  map.innerHTML = modules.map((m, i) =>
    `<a class="os-node" href="${m[3]}" data-hot>
      <span class="tag">${m[0]}</span>
      <h3>${m[1]}</h3>
      <p>${m[2]}</p>
      <i>${String(i + 1).padStart(2, "0")}</i>
    </a>`
  ).join("");
})();
