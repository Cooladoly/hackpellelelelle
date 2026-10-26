// Entry for tools/og.html only (the link-preview card). Not imported by the site.
// It draws the same two parts the home page opens with, still: the 34-pin header and an LED reading of "34".
import "./index.css";

const MAJOR = new Set([0, 12, 24, 34]);
const LABELS: Record<number, string> = { 0: "0", 12: "12", 24: "24", 34: "34 h" };

// the 34-hour header, built with the site's own classes (the same markup as PinHeader.tsx)
const header = document.getElementById("rule");
if (header) {
  header.classList.add("header34");
  const pins = document.createElement("div");
  pins.className = "header34-pins";
  for (let i = 0; i <= 34; i++) {
    const pin = document.createElement("span");
    pin.className = `hp${MAJOR.has(i) ? " major" : ""}`;
    pin.style.setProperty("--i", String(i));
    pins.appendChild(pin);
  }
  header.appendChild(pins);
  for (const [hour, label] of Object.entries(LABELS)) {
    const h = Number(hour);
    const el = document.createElement("span");
    el.className = "hp-label";
    el.textContent = label;
    el.style.left = `${(h / 34) * 100}%`;
    el.style.transform = h === 0 ? "none" : h === 34 ? "translateX(-100%)" : "translateX(-50%)";
    header.appendChild(el);
  }
}

// a 5x7 dot-matrix "34", the glyphs from LedRow.tsx, drawn once as SVG
const GLYPHS: Record<string, string[]> = {
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
};
const led = document.getElementById("led");
if (led) {
  const pitch = 17;
  const text = "34";
  const ns = "http://www.w3.org/2000/svg";
  const cols = text.length * 5 + (text.length - 1);
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("width", String(cols * pitch));
  svg.setAttribute("height", String(7 * pitch));
  const glow = document.createElementNS(ns, "g");
  glow.setAttribute("style", "filter: drop-shadow(0 0 7px rgb(0 191 255 / 0.85))");
  svg.appendChild(glow);
  let x0 = 0;
  [...text].forEach((ch) => {
    GLYPHS[ch].forEach((row, y) =>
      [...row].forEach((bit, x) => {
        const dot = document.createElementNS(ns, "circle");
        dot.setAttribute("cx", String((x0 + x + 0.5) * pitch));
        dot.setAttribute("cy", String((y + 0.5) * pitch));
        dot.setAttribute("r", String(pitch * 0.36));
        if (bit === "1") {
          dot.setAttribute("fill", "#00bfff");
          glow.appendChild(dot);
        } else {
          dot.setAttribute("fill", "rgb(233 239 243 / 0.085)");
          svg.insertBefore(dot, glow);
        }
      }),
    );
    x0 += 6;
  });
  led.appendChild(svg);
}
