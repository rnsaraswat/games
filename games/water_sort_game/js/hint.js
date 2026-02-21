import { smartHint } from "./aiSolver.js";

export function showHint() {
  const h = smartHint();
  if (!h) return;

  document.querySelector(`[data-index='${h.from}']`).classList.add("hint");
  document.querySelector(`[data-index='${h.to}']`).classList.add("hint");

  setTimeout(()=>{
    document.querySelectorAll(".hint").forEach(t=>t.classList.remove("hint"));
  },1500);
}
