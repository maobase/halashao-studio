(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const panels = gsap.utils.toArray("[data-hard]");
  panels.forEach((panel, i) => {
    if (i === panels.length - 1) return;
    ScrollTrigger.create({
      trigger: panel,
      start: "top top",
      endTrigger: panels[panels.length - 1],
      end: "top top",
      pin: true,
      pinSpacing: false,
    });
    gsap.to(panel.querySelector(".hard-bg"), {
      scale: 1.12,
      opacity: 0.35,
      ease: "none",
      scrollTrigger: {
        trigger: panels[i + 1],
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
    });
  });
})();
