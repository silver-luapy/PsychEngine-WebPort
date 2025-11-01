// renderer.js
import * as Loader from "./loader.js";
import { keys } from "./input.js";

export let app; // PixiJS Application global

// Contenedor de sprites de la strumline
export const strumlineSprites = {};

// Inicializar PixiJS
export async function initRenderer() {
    app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true
    });

    document.body.appendChild(app.view);
}

// Crear la strumline desde un TextureAtlas
export async function createStrumline(atlasXML, atlasPNG) {
    const { atlas, baseTexture } = await Loader.loadTextureAtlas(atlasXML, atlasPNG);

    // Posiciones base de cada flecha
    const centerX = window.innerWidth / 2;
    const baseY = window.innerHeight * 0.75;
    const offset = 75;

    const directions = ["left", "down", "up", "right"];
    const posX = [
        centerX - offset*3, // left
        centerX - offset*1, // down
        centerX + offset*1, // up
        centerX + offset*3  // right
    ];

    directions.forEach((dir, i) => {
        // Frame estático inicial
        const frameName = `static${dir.charAt(0).toUpperCase()+dir.slice(1)}0001`;
        const frameData = atlas[frameName];

        const texture = new PIXI.Texture(
            baseTexture,
            new PIXI.Rectangle(frameData.x, frameData.y, frameData.width, frameData.height)
        );

        const sprite = new PIXI.Sprite(texture);
        sprite.x = posX[i];
        sprite.y = baseY;
        sprite.anchor.set(0.5);
        sprite.baseY = baseY;
        sprite.dir = dir;
        sprite.state = "static"; // static, press, confirm, confirmHold

        app.stage.addChild(sprite);
        strumlineSprites[dir] = sprite;
    });

    // Ticker para animar bump según DFJK
    app.ticker.add(() => {
        directions.forEach(dir => {
            const sprite = strumlineSprites[dir];
            if (!sprite) return;

            if (keys[dir]) {
                // Animación bump al presionar
                sprite.y = sprite.baseY - 15;
                sprite.scale.set(1.1);
                sprite.alpha = 1.0;
            } else {
                // Volver a posición base
                sprite.y += (sprite.baseY - sprite.y) * 0.2; // suavizado
                sprite.scale.set(0.9);
                sprite.alpha = 0.6;
            }
        });
    });
}
