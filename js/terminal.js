(() => {
  const out = document.getElementById("termOut");
  const form = document.getElementById("termForm");
  const input = document.getElementById("termIn");

  const print = (text, cls = "") => {
    if (!out) return;
    const line = document.createElement("div");
    line.className = cls;
    line.textContent = text;
    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
  };

  const cmds = {
    help: () => {
      print("commands: help | fight | ou | reboot | who | open <module> | clear");
      print("tip: open soundboard / open chat / open route");
    },
    fight: () => {
      print("硬仗已排期。范围先砍，记忆点先立。");
      try { new Audio("assets/biao-5.mp3").play(); } catch { /* */ }
    },
    ou: () => {
      print("欧了。");
      try { new Audio("assets/biao-2.mp3").play(); } catch { /* */ }
    },
    reboot: () => {
      print("大不了从头再来。session reset.");
      try { new Audio("assets/biao-6.mp3").play(); } catch { /* */ }
    },
    who: () => print("哈拉少 Design OS · 精神股东：范德彪"),
    clear: () => { if (out) out.innerHTML = ""; },
  };

  const run = (raw) => {
    const line = raw.trim();
    if (!line) return;
    print(`HALA> ${line}`, "in");
    const [cmd, ...rest] = line.split(/\s+/);
    const arg = rest.join(" ");
    if (cmd === "open" && arg) {
      const map = {
        soundboard: "soundboard.html", chat: "chat.html", route: "route.html",
        night: "night.html", work: "work.html", reel: "reel.html", os: "os.html",
        contact: "contact.html", poster: "poster.html", tunnel: "tunnel.html",
      };
      const href = map[arg.toLowerCase()] || (arg.endsWith(".html") ? arg : `${arg}.html`);
      print(`opening ${href} ...`);
      setTimeout(() => { location.href = href; }, 280);
      return;
    }
    if (cmds[cmd]) cmds[cmd]();
    else {
      print(`unknown: ${cmd}. 小树不倒，命令可倒。type help`);
      try { new Audio("assets/biao-13.mp3").play(); } catch { /* */ }
    }
  };

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    run(input?.value || "");
    if (input) input.value = "";
  });

  print("HALASHAO TERM v48");
  print("土酷 shell ready. type help");
  print("「该出手时就出手」");
  input?.focus();
})();
