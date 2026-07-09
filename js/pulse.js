(() => {
  const canvas = document.getElementById("pulseCanvas");
  const now = document.getElementById("pulseNow");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const tracks = [
    ["小树不倒", "assets/biao-1.mp3"],
    ["欧了", "assets/biao-2.mp3"],
    ["硬仗主打", "assets/biao-5.mp3"],
    ["从头再来", "assets/biao-6.mp3"],
    ["该出手", "assets/biao-12.mp3"],
    ["江湖义气", "assets/biao-14.mp3"],
  ];

  let audio, audioCtx, analyser, data, srcNode, raf;
  let w = 0, h = 0;

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    w = r.width;
    h = r.height || 420;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const draw = () => {
    ctx.fillStyle = "rgba(8,8,10,0.25)";
    ctx.fillRect(0, 0, w, h);
    let level = 0.05;
    if (analyser && data) {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      level = Math.sqrt(sum / data.length);
    }
    const rings = 5;
    for (let i = 0; i < rings; i++) {
      const rr = 40 + i * 28 + level * 180;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, rr, 0, Math.PI * 2);
      ctx.strokeStyle = i % 2 ? `rgba(200,245,66,${0.35 - i * 0.05})` : `rgba(255,214,90,${0.4 - i * 0.05})`;
      ctx.lineWidth = 2 + level * 10;
      ctx.stroke();
    }
    // particles
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2 + performance.now() / 800;
      const rr = 60 + level * 160 + (i % 3) * 12;
      ctx.fillStyle = i % 2 ? "#c8f542" : "#e23d2a";
      ctx.beginPath();
      ctx.arc(w / 2 + Math.cos(a) * rr, h / 2 + Math.sin(a) * rr, 2 + level * 6, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  };
  draw();

  const play = async () => {
    const [name, src] = tracks[Math.floor(Math.random() * tracks.length)];
    if (audio) {
      audio.pause();
      audio = null;
    }
    audio = new Audio(src);
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      data = new Uint8Array(analyser.fftSize);
    }
    // recreate source each time
    const node = audioCtx.createMediaElementSource(audio);
    node.connect(analyser);
    analyser.connect(audioCtx.destination);
    srcNode = node;
    if (now) now.textContent = `播放中 · ${name}`;
    try {
      await audioCtx.resume();
      await audio.play();
    } catch { /* */ }
    audio.onended = () => {
      if (now) now.textContent = "播完 · 再来一句？";
    };
  };

  document.getElementById("pulsePlay")?.addEventListener("click", play);
  document.getElementById("pulseStop")?.addEventListener("click", () => {
    audio?.pause();
    if (now) now.textContent = "已停";
  });
})();
