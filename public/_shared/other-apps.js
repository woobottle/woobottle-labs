(function () {
  var STYLE = `
  #other-apps{max-width:960px;margin:0 auto;padding:56px 20px}
  #other-apps .oa-head{font-size:13px;letter-spacing:.14em;text-transform:uppercase;opacity:.6;margin-bottom:18px;text-align:center}
  #other-apps .oa-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
  #other-apps .oa-card{position:relative;display:flex;flex-direction:column;gap:6px;padding:16px;border-radius:14px;
    border:1px solid rgba(128,128,128,.25);text-decoration:none;color:inherit;background:rgba(128,128,128,.06);
    transition:border-color .15s,transform .15s}
  #other-apps .oa-card:hover{border-color:var(--oa-accent,#888);transform:translateY(-2px)}
  #other-apps .oa-emoji{font-size:26px}
  #other-apps .oa-name{font-weight:700;font-size:15px}
  #other-apps .oa-tag{font-size:12px;opacity:.6;line-height:1.4}
  #other-apps .oa-badge{position:absolute;top:12px;right:12px;font-size:9px;letter-spacing:.06em;text-transform:uppercase;
    padding:3px 6px;border-radius:6px;background:var(--oa-accent,#888);color:#111;font-weight:700}
  `;
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  async function run() {
    var el = document.getElementById("other-apps");
    if (!el) return;
    var current = el.getAttribute("data-current") || "";
    try {
      var res = await fetch("/houseads.json", { cache: "no-cache" });
      var data = await res.json();
      var apps = (data.apps || []).filter(function (a) {
        return a.id !== current;
      });
      if (!apps.length) {
        el.remove();
        return;
      }
      var st = document.createElement("style");
      st.textContent = STYLE;
      document.head.appendChild(st);
      el.innerHTML =
        '<div class="oa-head">WooBottle의 다른 앱</div><div class="oa-grid">' +
        apps
          .map(function (a) {
            var accent = (a.brand && a.brand.accent) || "#888";
            return (
              '<a class="oa-card" href="' +
              esc(a.landingUrl || "/apps/") +
              '" style="--oa-accent:' +
              esc(accent) +
              '">' +
              '<span class="oa-emoji">' +
              esc(a.emoji || "📱") +
              "</span>" +
              '<span class="oa-name">' +
              esc(a.name) +
              "</span>" +
              '<span class="oa-tag">' +
              esc(a.tagline) +
              "</span>" +
              (a.status === "coming-soon"
                ? '<span class="oa-badge">Soon</span>'
                : "") +
              "</a>"
            );
          })
          .join("") +
        "</div>";
    } catch (e) {
      el.remove();
    }
  }
  if (document.readyState !== "loading") run();
  else document.addEventListener("DOMContentLoaded", run);
})();
