/* ---------- Inline images (SVG data URIs) ---------- */
function svgDataURI(svg) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
function rect(w, h, fill) {
    return `<rect x="0" y="0" width="${w}" height="${h}" rx="14" ry="14" fill="${fill}"/>`;
}
function emojiTile(emoji, bg = '#ffffff') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
    ${rect(256, 256, bg)}
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-size="150">${emoji}</text>
  </svg>`;
    return svgDataURI(svg);
}
function shapeTile(shape = 'circle', color = '#6ee7b7', bg = '#ffffff') {
    let shapeSVG = '';
    if (shape === 'circle') {
        shapeSVG = `<circle cx="128" cy="128" r="80" fill="${color}"/>`;
    } else if (shape === 'triangle') {
        shapeSVG = `<polygon points="128,40 216,216 40,216" fill="${color}"/>`;
    } else if (shape === 'diamond') {
        shapeSVG = `<polygon points="128,28 228,128 128,228 28,128" fill="${color}"/>`;
    } else if (shape === 'star') {
        shapeSVG = `<polygon points="128,36 152,104 224,104 166,148 188,216 128,172 68,216 90,148 32,104 104,104" fill="${color}"/>`;
    } else if (shape === 'ring') {
        shapeSVG = `<circle cx="128" cy="128" r="80" fill="none" stroke="${color}" stroke-width="26"/>`;
    } else {
        shapeSVG = `<rect x="56" y="56" width="144" height="144" rx="24" fill="${color}"/>`;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
    ${rect(256, 256, bg)} ${shapeSVG}
  </svg>`;
    return svgDataURI(svg);
}

// theme Array used with getThemeImages()
const FRUITS = ['fruit_apple.jpg', 'fruit_avocado.jpg', 'fruit_banana.jpg', 'fruit_cherry.jpg', 'fruit_coconut.jpg', 'fruit_grapefruit.jpg', 'fruit_grapes.jpg', 'fruit_kiwi.jpg', 'fruit_lemon.jpg', 'fruit_lime.jpg', 'fruit_mango.jpg', 'fruit_melon.jpg', 'fruit_orange.jpg', 'fruit_papaya.jpg', 'fruit_peach.jpg', 'fruit_pear.jpg', 'fruit_pineapple.jpg', 'fruit_plum.jpg', 'fruit_pomegranate.jpg', 'fruit_raspberry.jpg', 'fruit_strowberry.jpg', 'fruit_watermelon.jpg',];
const ANIMALS = ['farm-animals_camel.jpg', 'farm-animals_cat.jpg', 'farm-animals_chicken.jpg', 'farm-animals_cow.jpg', 'farm-animals_dog.jpg', 'farm-animals_donkey.jpg', 'farm-animals_duck.jpg', 'farm-animals_goat.jpg', 'farm-animals_horse.jpg', 'farm-animals_llama.jpg', 'farm-animals_ox.jpg', 'farm-animals_pig.jpg', 'farm-animals_rabbit.jpg', 'farm-animals_sheep.jpg', 'farm-animals_turkey.jpg', 'farm-animals_yak.jpg',];

// const FRUITS = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍐', '🍍', '🥭', '🥝', '🍑', '🥥', '🍊', '🍋', '🍈', '🍏', '🥑', '🫐', '🍅', '🌽'];
// const ANIMALS = ['🐶', '🐱', '🦊', '🦁', '🐼', '🐵', '🐻', '🐰', '🦉', '🐧', '🐨', '🐸', '🐷', '🦒', '🐯', '🦔', '🦓', '🦜', '🦄', '🐙'];
const SHAPES = ['circle', 'triangle', 'diamond', 'star', 'ring', 'square'];

/* ------ get theme images ------- */
function pastel(i) {
    const h = (i * 47) % 360;
    return `hsl(${h} 90% 95%)`;
}
function vivid(i) {
    const h = (i * 59) % 360;
    return `hsl(${h} 85% 55%)`;
}
function getThemeImages(theme, count) {
    const imgs = [];
    if (theme === 'fruits') {
        for (let i = 0; i < count; i++) { imgs.push(emojiTile(FRUITS[i % FRUITS.length], pastel(i))); }
    } else if (theme === 'animals') {
        for (let i = 0; i < count; i++) { imgs.push(emojiTile(ANIMALS[i % ANIMALS.length], pastel(i))); }
    } else {
        for (let i = 0; i < count; i++) { imgs.push(shapeTile(SHAPES[i % SHAPES.length], vivid(i), pastel(i))); }
    }
    return imgs;
}
/* ------ get theme images ------- */