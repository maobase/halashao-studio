(() => {
  const tracks = [
    { t: "小树不倒我就不倒", src: "assets/biao-1.mp3" },
    { t: "欧了", src: "assets/biao-2.mp3" },
    { t: "肉眼凡胎，量你也看不出来", src: "assets/biao-3.mp3" },
    { t: "你就慢慢跟我处…", src: "assets/biao-4.mp3" },
    { t: "本市几场著名硬仗…", src: "assets/biao-5.mp3" },
    { t: "论成败，人生豪迈…", src: "assets/biao-6.mp3" },
    { t: "时光能不能倒流？豆角…", src: "assets/biao-7.mp3" },
    { t: "这个用户正在生气…", src: "assets/biao-8.mp3" },
    { t: "工作范围内…", src: "assets/biao-9.mp3" },
    { t: "遵纪守法积极进取…", src: "assets/biao-10.mp3" },
  ];

  let i = 0;
  let audio = null;
  let ctx, analyser, data, raf;
  const viz = document.getElementById("radioViz");
  const now = document.getElementById("radioNow");
  const list = document.getElementById("radioList");
  let audioCtx, srcNode;

  if (list) {
    list.innerHTML = tracks
      .map((t, idx) => `<li><button type="button" data-i="${idx}">${String(idx + 1).padStart(2, "0")} · ${t.t}</button></li>`)
      .join("");
  }

  const draw = () => {
    if (!viz || !analyser) return;
    const c = viz.getContext("2d");
    const w = viz.width;
    const h = viz.height;
    analyser.getByteFrequencyData(data);
    c.fillStyle = "rgba(8,8,10,0.35)";
    c.fillRect(0, 0, w, h);
    const n = 64;
    const step = Math.floor(data.length / n);
    const barW = w / n;
    for (let k = 0; k < n; k++) {
      const v = data[k * step] / 255;
      const bh = v * h * 0.9;
      c.fillStyle = k % 3 === 0 ? "#c8f542" : k % 3 === 1 ? "#ffd65a" : "#e23d2a";
      c.fillRect(k * barW + 1, h - bh, barW - 2, bh);
    }
    raf = requestAnimationFrame(draw);
  };

  const ensureGraph = () => {
    if (!audio || audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    srcNode = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    data = new Uint8Array(analyser.frequencyBinCount);
    srcNode.connect(analyser);
    analyser.connect(audioCtx.destination);
    draw();
  };

  const load = (idx) => {
    i = idx;
    if (audio) {
      audio.pause();
      audio = null;
    }
    cancelAnimationFrame(raf);
    audioCtx = null;
    srcNode = null;
    analyser = null;
    audio = new Audio(tracks[i].src);
    audio.crossOrigin = "anonymous";
    if (now) now.textContent = `正在播放 · ${tracks[i].t}`;
    list?.querySelectorAll("button").forEach((b, bi) => b.classList.toggle("is-on", bi === i));
  };

  const play = async () => {
    if (!audio) load(i);
    try {
      ensureGraph();
      await audioCtx?.resume();
      await audio.play();
    } catch {
      await audio.play().catch(() => {});
    }
    audio.onended = () => {
      load((i + 1) % tracks.length);
      play();
    };
  };

  const pause = () => audio?.pause();

  document.getElementById("radioPlay")?.addEventListener("click", () => {
    if (audio && !audio.paused) pause();
    else play();
  });
  document.getElementById("radioNext")?.addEventListener("click", () => {
    load((i + 1) % tracks.length);
    play();
  });
  document.getElementById("radioRand")?.addEventListener("click", () => {
    load(Math.floor(Math.random() * tracks.length));
    play();
  });
  list?.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-i]");
    if (!b) return;
    load(Number(b.dataset.i));
    play();
  });

  load(0);
  if (now) now.textContent = "FM 彪哥 · 就绪 · 按播放";
})();
