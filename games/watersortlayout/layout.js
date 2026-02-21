// const tubeSelect = document.getElementById("tubeSelect");
// const container = document.getElementById("tubeContainer");

// tubeSelect.addEventListener("change", buildLayout);
// window.addEventListener("resize", buildLayout);

// buildLayout();

// function buildLayout() {
//   container.innerHTML = "";

//   const totalTubes = parseInt(tubeSelect.value);
//   const isLandscape = window.innerWidth > window.innerHeight;

//   // -------- Decide rows count --------
//   let rowCount;
//   if (isLandscape) {
//     rowCount = totalTubes <= 8 ? 1 : 2;
//   } else {
//     rowCount = totalTubes <= 6 ? 2 : totalTubes <= 10 ? 3 : 4;
//   }

//   let rows = distributeTubes(totalTubes, rowCount);

//   const maxRow = Math.max(...rows);

//   // -------- Tube size & gap --------
//   const areaWidth = container.clientWidth || window.innerWidth;
//   const areaHeight = container.clientHeight || window.innerHeight * 0.7;

//   const tubeWidth = Math.min(
//     areaWidth / (maxRow + 1),
//     areaHeight / (rowCount * 3)
//   );

//   const tubeHeight = tubeWidth * 2.6;
//   const gap = tubeWidth * 0.25;

//   rows.forEach((count, index) => {
//     const row = document.createElement("div");
//     row.className = "tubeRow";
//     row.style.gap = gap + "px";
//     row.style.marginBottom = gap + "px";

//     if (count < maxRow) row.classList.add("offset");

//     for (let i = 0; i < count; i++) {
//       const tube = document.createElement("div");
//       tube.className = "tube";
//       tube.style.width = tubeWidth + "px";
//       tube.style.height = tubeHeight + "px";
//       row.appendChild(tube);
//     }

//     container.appendChild(row);
//   });
// }

// /* -------- Distribution Logic -------- */
// function distributeTubes(total, rows) {
//   let base = Math.floor(total / rows);
//   let extra = total % rows;

//   let result = Array(rows).fill(base).map((v, i) => v + (i < extra ? 1 : 0));

//   // Odd rule
//   if (total % 2 !== 0 && rows > 1) {
//     result[rows - 1]--;
//     result[0]++;
//   }

//   return result;
// }


const tubeSelect = document.getElementById("tubeSelect");
const container = document.getElementById("tubeContainer");

tubeSelect.addEventListener("change", buildLayout);
window.addEventListener("resize", buildLayout);

buildLayout();

function buildLayout() {
  container.innerHTML = "";

  const totalTubes = parseInt(tubeSelect.value);
  const isLandscape = window.innerWidth > window.innerHeight;

  // -------- Decide rows count --------
  let rowCount;
  if (isLandscape) {
    rowCount = totalTubes <= 8 ? 1 : 2;
  } else {
    rowCount = totalTubes <= 6 ? 2 : totalTubes <= 10 ? 3 : 4;
  }

  let rows = distributeTubes(totalTubes, rowCount);

  const maxRow = Math.max(...rows);

  // -------- Tube size & gap --------
  const areaWidth = container.clientWidth || window.innerWidth;
  const areaHeight = container.clientHeight || window.innerHeight * 0.7;

  const tubeWidth = Math.min(
    areaWidth / (maxRow + 1),
    areaHeight / (rowCount * 3)
  );

  const tubeHeight = tubeWidth * 2.6;
  const gap = tubeWidth * 0.25;

  rows.forEach((count, index) => {
    const row = document.createElement("div");
    row.className = "tubeRow";
    row.style.gap = gap + "px";
    row.style.marginBottom = gap + "px";

    if (count < maxRow) row.classList.add("offset");

    for (let i = 0; i < count; i++) {
      const tube = document.createElement("div");
      tube.className = "tube";
      tube.dataset.index = i;
      tube.style.width = tubeWidth + "px";
      tube.style.height = tubeHeight + "px";
      row.appendChild(tube);
    }

    container.appendChild(row);
  });
}

/* -------- Distribution Logic -------- */
function distributeTubes(total, rows) {
  let base = Math.floor(total / rows);
  let extra = total % rows;

  let result = Array(rows).fill(base).map((v, i) => v + (i < extra ? 1 : 0));

  // Odd rule
  if (total % 2 !== 0 && rows > 1) {
    result[rows - 1]--;
    result[0]++;
  }

  return result;
}
