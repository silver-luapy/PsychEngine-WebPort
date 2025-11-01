// notes.js
import { app, strumlineSprites } from "../renderer.js";
import { keys } from "../input.js";
import * as Audio from "../audio.js";

// Rutas de imágenes de notas
const noteImages = {
    left: "./mods/base-test/images/NoteSkins/Funkin/noteLeft.png",
    down: "./mods/base-test/images/NoteSkins/Funkin/noteDown.png",
    up: "./mods/base-test/images/NoteSkins/Funkin/noteUp.png",
    right: "./mods/base-test/images/NoteSkins/Funkin/noteRight.png"
};

// Contenedor de notas activas
export const activeNotes = [];

// Crear una nota
export function spawnNote(direction, speed = 4) {
    const texture = PIXI.Texture.from(noteImages[direction]);
    const sprite = new PIXI.Sprite(texture);

    const strum = strumlineSprites[direction];
    if (!strum) return;

    sprite.x = strum.x;
    sprite.y = -50; // Empieza desde arriba
    sprite.anchor.set(0.5);
    sprite.speed = speed;
    sprite.direction = direction;

    app.stage.addChild(sprite);
    activeNotes.push(sprite);
}

// Actualizar notas en el ticker
export function updateNotes() {
    activeNotes.forEach((note, index) => {
        note.y += note.speed;

        const strum = strumlineSprites[note.direction];
        if (!strum) return;

        // Hit detection simple (cuando la nota llega a la strumline)
        const hitWindow = 20; // tolerancia
        if (Math.abs(note.y - strum.y) < hitWindow && keys[note.direction]) {
            // Hit
            Audio.playSound("hit"); // suponer que cargaste SFX "hit"
            note.y = strum.y;       // alinear visualmente
            strum.y = strum.baseY - 15; // bump en strumline
            strum.scale.set(1.1);
            strum.alpha = 1.0;

            // Eliminar nota
            app.stage.removeChild(note);
            activeNotes.splice(index, 1);
        }

        // Si pasa la strumline sin ser golpeada → miss
        if (note.y > strum.y + 50) {
            Audio.playSound("miss"); // suponer que cargaste SFX "miss"
            app.stage.removeChild(note);
            activeNotes.splice(index, 1);
        }
    });
}

// Iniciar ticker para actualizar notas
export function startNotesTicker() {
    app.ticker.add(() => {
        updateNotes();
    });
}