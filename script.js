import { shareScore } from './share.js';

export let gameName = 'Ravindra Games Hub';
export let score = 0;

(async () => {
    const GAME_NAME = "Ravindra Games Hub";
    const GAME_SHORT = "RGH Games";

    const res = await fetch("./manifest.json");
    const manifest = await res.json();

    manifest.short_name = GAME_SHORT;
    manifest.name = GAME_NAME;

    manifest.start_url = 'https://rnsaraswat.github.io/games/index.html';
    manifest.scope = 'https://rnsaraswat.github.io/games/index.html';

    // 🔥 icons ko absolute banane ka safety fix
    manifest.icons = manifest.icons.map(icon => ({
        ...icon,
        src: new URL(icon.src, location.origin).href
    }));

    const blob = new Blob(
        [JSON.stringify(manifest)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = url;
    document.head.appendChild(link);
})();