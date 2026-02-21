const KEY = "waterSortProgress";

export function loadProgress() {
  return JSON.parse(localStorage.getItem(KEY)) || {
    unlocked: 1,
    undoPlus: 0
  };
}

export function saveProgress(p) {
  localStorage.setItem(KEY, JSON.stringify(p));
}
