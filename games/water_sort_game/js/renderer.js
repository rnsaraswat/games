import { gameState } from "./levels.js";

export function render(onClick) {
  const area = document.getElementById("tubesArea");
  area.innerHTML = "";

  gameState.forEach((tube,i)=>{
    const d = document.createElement("div");
    d.className = "tube";
    d.dataset.index = i;
    d.onclick = () => onClick(i);

    tube.forEach(c=>{
      const l = document.createElement("div");
      l.className = `layer ${c}`;
      d.appendChild(l);
    });

    area.appendChild(d);
  });
}

/* 🖌 Render Layout */
// function render() {
//   tubesArea.innerHTML = "";

//   const rows = [
//     gameState.slice(0,5),
//     gameState.slice(5,10),
//     gameState.slice(10,14)
//   ];

//   rows.forEach((rowData,rowIndex)=>{
//     const row = document.createElement("div");
//     row.className = "row";
//     rowData.forEach((tubeData,i)=>{
//       const index = rowIndex===0?i:rowIndex===1?i+5:i+10;
//       row.appendChild(createTube(tubeData,index));
//     });
//     tubesArea.appendChild(row);
//   });
// }
