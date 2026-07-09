(() => {
  const seal = document.getElementById("stampSeal");
  const text = document.getElementById("stampText");
  const input = document.getElementById("stampInput");
  const rot = document.getElementById("stampRot");
  const canvas = document.getElementById("stampCanvas");

  const apply = () => {
    const v = (input?.value || "硬仗").slice(0, 6);
    if (text) text.textContent = v;
    if (seal) seal.style.transform = `rotate(${rot?.value || -12}deg)`;
  };

  document.getElementById("stampGen")?.addEventListener("click", () => {
    apply();
    seal?.classList.remove("pound");
    void seal?.offsetWidth;
    seal?.classList.add("pound");
    try { new Audio("assets/biao-2.mp3").play(); } catch { /* */ }
  });

  document.getElementById("stampDrop")?.addEventListener("click", () => {
    if (!canvas || !seal) return;
    apply();
    const clone = seal.cloneNode(true);
    clone.classList.add("dropped");
    clone.style.left = `${10 + Math.random() * 70}%`;
    clone.style.top = `${10 + Math.random() * 60}%`;
    clone.style.transform = `rotate(${-25 + Math.random() * 50}deg)`;
    canvas.appendChild(clone);
  });

  input?.addEventListener("input", apply);
  rot?.addEventListener("input", apply);
  apply();
})();
