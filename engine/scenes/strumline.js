// strumline.js
import { createStrumline } from "../renderer.js";

// Ruta de tu atlas XML + PNG (mod de ejemplo)
const atlasXML = "./mods/base-test/images/NoteSkins/Funkin/noteStrumline.xml";
const atlasPNG = "./mods/base-test/images/NoteSkins/Funkin/noteStrumline.png";

// Función para cargar la escena de strumline
export async function loadStrumlineScene(app) {
    console.log("Cargando Strumline...");

    // Crear sprites de la strumline
    await createStrumline(atlasXML, atlasPNG);

    console.log("Strumline cargada y lista para DFJK");
}
