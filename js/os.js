(() => {
  const map = document.getElementById("osMap");
  if (!map) return;
  const modules = (window.HALASHAO && window.HALASHAO.modules) || [];
  // fallback if system not exposing yet - duplicate light list
  const list = modules.length ? modules : [["首页","index.html"],["开干","contact.html"]];
  map.innerHTML = list.map(([name, href], i) =>
    `<a class="os-node" href="${href}" data-hot>
      <span class="tag">${String(i+1).padStart(2,"0")}</span>
      <h3>${name}</h3>
      <p>${href}</p>
      <i>${String(i+1).padStart(2,"0")}</i>
    </a>`
  ).join("");
})();
