const colors = ["red", "green", "blue", "aqua", "gray", "coral", "gold", "magneta", "maroon","navy", "orange", "blue", "salmon", "voilet", "white"];

// Single Tube Complete Cracker (Ground → Tube)
function tubeCracker(tubeEl) {
    const fw = document.getElementById("fireworks");
    const rect = tubeEl.getBoundingClientRect();

    const rocket = document.createElement("div");
    rocket.className = "rocket";

    rocket.style.left = rect.left + rect.width / 2 + "px";
    rocket.style.bottom = "0px";

    fw.appendChild(rocket);

    rocket.addEventListener("animationend", () => {
        rocket.remove();
        blast(rect.left + rect.width / 2, rect.top, 24);
    });
}

// Wide Neon Blast (Orange + Blue mix)
function blast(x, y, count = 40) {
    const fw = document.getElementById("fireworks");

    for (let i = 0; i < count; i++) {
        const spark = document.createElement("div");

        const colorClass = Math.floor(Math.random() * colors.length);
        spark.className = "spark " + colors[colorClass];

        spark.style.left = x + "px";
        spark.style.top = y + "px";

        /* 🔥 WIDE SPREAD */
        const angle = Math.random() * Math.PI * 2;
        const distance = 120 + Math.random() * 120; 
        spark.style.setProperty("--dx", Math.cos(angle) * distance + "px");
        spark.style.setProperty("--dy", Math.sin(angle) * distance + "px");

        fw.appendChild(spark);

        setTimeout(() => spark.remove(), 1200);
    }
}

function launchStarFireworks() {
    const width = window.innerWidth;

    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            blast(
                Math.random() * width,
                window.innerHeight * (0.2 + Math.random() * 0.3),
                60 
            );
        }, i * 300);
    }
}