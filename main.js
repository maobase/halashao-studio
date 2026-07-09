/* Home-only: hero kinetic + pin stack + voice */
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const heroTitle = document.getElementById("heroTitle");
  if (heroTitle) {
    heroTitle.innerHTML = "哈拉少"
      .split("")
      .map((c, i) => `<span class="ch" style="--i:${i}">${c}</span>`)
      .join("");
  }

  const heroVid = document.getElementById("heroVid");
  if (heroVid) {
    heroVid.muted = true;
    const play = () => heroVid.play().catch(() => {});
    if (!reduce) play();
    else {
      heroVid.pause();
      heroVid.removeAttribute("autoplay");
    }
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && !reduce) play();
    });
  }

  // voice
  const voice = document.getElementById("voice");
  const voiceFab = document.getElementById("voiceFab");
  const voiceLabel = document.getElementById("voiceLabel");
  const heroVoice = document.getElementById("heroVoice");

  const setVoiceUI = (on) => {
    voiceFab?.classList.toggle("is-on", on);
    voiceFab?.setAttribute("aria-pressed", on ? "true" : "false");
    if (voiceLabel) voiceLabel.textContent = on ? "播放中" : "听介绍";
    if (heroVoice) heroVoice.textContent = on ? "暂停语音" : "播放语音";
  };
  const pauseVoice = () => {
    if (!voice) return;
    voice.pause();
    setVoiceUI(false);
  };
  const playVoice = async () => {
    if (!voice) return;
    try {
      if (voice.ended) voice.currentTime = 0;
      await voice.play();
      setVoiceUI(true);
    } catch {
      setVoiceUI(false);
    }
  };
  const toggleVoice = async () => {
    if (!voice) return;
    if (voice.paused || voice.ended) await playVoice();
    else pauseVoice();
  };
  voiceFab?.addEventListener("click", toggleVoice);
  heroVoice?.addEventListener("click", toggleVoice);
  voice?.addEventListener("ended", () => setVoiceUI(false));
  voice?.addEventListener("pause", () => {
    if (!voice.ended && voice.paused) setVoiceUI(false);
  });

  // GSAP pin + hero
  if (!reduce && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".hero-title .ch", {
      y: 120,
      opacity: 0,
      rotateX: -60,
      stagger: 0.08,
      duration: 1.15,
      ease: "power4.out",
    });
    gsap.from(".hero-en, .hero-line .line-mask > span, .hero-row, .hero-kicker, .stamp", {
      y: 36,
      opacity: 0,
      duration: 0.95,
      delay: 0.35,
      stagger: 0.07,
      ease: "power3.out",
    });

    const cards = gsap.utils.toArray("[data-pin]");
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        endTrigger: cards[cards.length - 1],
        end: "top top",
        pin: true,
        pinSpacing: false,
      });
      gsap.to(card, {
        scale: 0.92,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: cards[i + 1],
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      });
    });

    gsap.from(".sys-card", {
      y: 40,
      opacity: 0,
      stagger: 0.08,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".sys-grid",
        start: "top 80%",
      },
    });
  }
})();
