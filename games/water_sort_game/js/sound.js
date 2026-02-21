const sounds = {
    pour: new Audio("sounds/water-flow1.mp3"),
    win: new Audio("sounds/winner-trumpets.mp3")
  };
  
  export function playSound(name) {
    sounds[name].currentTime = 0;
    sounds[name].play();
  }
  