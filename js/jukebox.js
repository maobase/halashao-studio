(() => {
  const tracks = [
    { t: "小树不倒我就不倒", src: "assets/biao-1.mp3", tip: "TRACK 01" },
    { t: "欧了", src: "assets/biao-2.mp3", tip: "TRACK 02" },
    { t: "肉眼凡胎，量你也看不出来", src: "assets/biao-3.mp3", tip: "TRACK 03" },
    { t: "你就慢慢跟我处…", src: "assets/biao-4.mp3", tip: "TRACK 04" },
    { t: "本市几场著名硬仗…", src: "assets/biao-5.mp3", tip: "TRACK 05" },
    { t: "论成败，人生豪迈…", src: "assets/biao-6.mp3", tip: "TRACK 06" },
    { t: "时光能不能倒流？豆角…", src: "assets/biao-7.mp3", tip: "TRACK 07" },
    { t: "这个用户正在生气…", src: "assets/biao-8.mp3", tip: "TRACK 08" },
    { t: "工作范围内…", src: "assets/biao-9.mp3", tip: "TRACK 09" },
    { t: "遵纪守法积极进取…", src: "assets/biao-10.mp3", tip: "TRACK 10" },
  ];

  const pad = document.getElementById("jukePad");
  const screen = document.getElementById("jukeScreen");
  const now = screen?.querySelector(".juke-now");
  let audio = null;
  let activeBtn = null;

  if (pad) {
    pad.innerHTML = tracks
      .map(
        (tr, i) =>
          `<button type="button" class="juke-btn" data-i="${i}" data-hot>
            ${tr.t}
            <small>${tr.tip} · 点播</small>
          </button>`
      )
      .join("");
  }

  const stop = () => {
    if (audio) {
      audio.pause();
      audio = null;
    }
    screen?.classList.remove("is-play");
    activeBtn?.classList.remove("is-on");
    activeBtn = null;
  };

  pad?.addEventListener("click", (e) => {
    const btn = e.target.closest(".juke-btn");
    if (!btn) return;
    const i = Number(btn.dataset.i);
    const tr = tracks[i];
    if (!tr) return;

    if (activeBtn === btn) {
      stop();
      if (now) now.textContent = "待机中 · 点歌吧";
      return;
    }

    stop();
    audio = new Audio(tr.src);
    audio.play().catch(() => {});
    if (now) now.textContent = tr.t;
    screen?.classList.add("is-play");
    btn.classList.add("is-on");
    activeBtn = btn;
    audio.addEventListener("ended", () => {
      stop();
      if (now) now.textContent = "播完了 · 再来一句？";
    });
  });
})();
