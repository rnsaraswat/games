import { showAd } from "./ads.js";

export function rewardUndo(progress) {
  showAd(()=>{
    progress.undoPlus++;
    alert("Undo+ earned");
  });
}
