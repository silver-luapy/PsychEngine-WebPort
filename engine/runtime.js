import { Loader } from "./loader.js";
import { Input } from "./input.js";
import { AudioSystem } from "./audio.js";
import { Renderer } from "./renderer.js";

import { MainMenu } from "./scenes/MainMenu.js";
import { GameplayScene } from "./scenes/GameplayScene.js"; // debes tener este archivo

export class EngineRuntime {
    constructor() {
        this.currentScene = null;
        this.modFolder = "mods/base-test/";

        this.loader = new Loader(this);
        this.input = new Input();
        this.audio = new AudioSystem();
        this.renderer = new Renderer();

        this.gameState = "menu"; // menu, gameplay, pause, etc.
    }

    async init() {
        console.log("[Runtime] Inicializando");

        await this.loader.init();
        await this.audio.init();
        await this.renderer.init();

        this.startMainMenu();
    }

    startMainMenu() {
        console.log("[Runtime] Cargando menú principal");

        this.changeScene(new MainMenu(this));
    }

    changeScene(scene) {
        if (this.currentScene && this.currentScene.destroy) {
            this.currentScene.destroy();
        }

        this.currentScene = scene;

        if (scene.start) {
            scene.start();
        }
    }

    async startSong(songName, chartData = null) {
        console.log(`[Runtime] Cargando canción: ${songName}`);

        if (!chartData) {
            chartData = await this.loader.loadFWPChart(songName);
        }

        this.audio.stopMusic();

        const gameplay = new GameplayScene(this, chartData, songName);
        this.changeScene(gameplay);
    }

    update(dt) {
        if (this.currentScene && this.currentScene.update) {
            this.currentScene.update(dt);
        }
    }
}

// Auto-start
window.addEventListener("DOMContentLoaded", async () => {
    window.Game = new EngineRuntime();
    await window.Game.init();

    // Bucle principal
    let lastTime = performance.now();
    function tick(now) {
        const dt = now - lastTime;
        lastTime = now;

        window.Game.update(dt);
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
});
