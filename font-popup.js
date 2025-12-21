/* ==========================================================
   🔤 font-popup.js — Minimal Font Popup
   Ha-Bin Studio · Popup Selector
========================================================== */

window.FontPopup = (function () {

  const popup = document.createElement("div");
  popup.id = "hb-popup-font";

  const FONTS = [
    { value: "'Gowun Dodum', sans-serif", label: "Gowun" },
    { value: "'Nanum Myeongjo', serif",   label: "Nanum" },
    { value: "'HCR Batang', serif",       label: "함초롱" },
    { value: "'Noto Serif KR', serif",    label: "Serif" }
  ];

  let onSelect = null;

  /* -------------------------------
     render
  -------------------------------- */
  function render() {
    popup.innerHTML = "";

    popup.style.position = "absolute";
    popup.style.padding = "8px";
    popup.style.background = "#FFFFFF";
    popup.style.border = "1px solid #D0D0D0";
    popup.style.borderRadius = "8px";
    popup.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
    popup.style.display = "grid";
    popup.style.gridTemplateColumns = "1fr";
    popup.style.gap = "6px";
    popup.style.zIndex = "999999";

    FONTS.forEach(f => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = f.label;
      btn.style.fontFamily = f.value;
      btn.style.padding = "6px 10px";
      btn.style.border = "1px solid #B8C2D6";
      btn.style.borderRadius = "6px";
      btn.style.background = "#FFF";
      btn.style.cursor = "pointer";

      btn.addEventListener("click", () => {
        onSelect && onSelect(f.value);
        close();
      });

      popup.appendChild(btn);
    });
  }

  /* -------------------------------
     open / close
  -------------------------------- */
  function openAt(x, y, callback) {
    onSelect = callback;
    render();

    document.body.appendChild(popup);
    popup.style.left = x + "px";
    popup.style.top  = y + "px";

    setTimeout(() => {
      document.addEventListener("mousedown", handleOutside, { once: true });
    }, 0);
  }

  function close() {
    popup.remove();
  }

  function handleOutside(e) {
    if (!popup.contains(e.target)) close();
  }

  return {
    openAt
  };

})();

