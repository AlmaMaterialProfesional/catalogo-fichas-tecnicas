// Genera una imagen JPEG por página de cada ficha y un índice (content/paginas.json)
// para que el visor las muestre en lugar de descargar el PDF completo.
// Uso (desde esta carpeta): npm install   y luego   node generar-paginas.mjs
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { createCanvas } from "@napi-rs/canvas";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const raiz = process.argv[2] || path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const uploads = path.join(raiz, "uploads");
const salida = path.join(uploads, "paginas");
const indice = path.join(raiz, "content", "paginas.json");
const LADO_LARGO = 2200;
const CALIDAD = 82;

const pdfjsDir = path.dirname(fileURLToPath(import.meta.resolve("pdfjs-dist/package.json")));
const opciones = {
  standardFontDataUrl: path.join(pdfjsDir, "standard_fonts") + path.sep,
  cMapUrl: path.join(pdfjsDir, "cmaps") + path.sep,
  cMapPacked: true,
  isEvalSupported: false,
  verbosity: 0,
};

fs.rmSync(salida, { recursive: true, force: true });
fs.mkdirSync(salida, { recursive: true });

const resultado = {};
let totalOriginal = 0, totalImagenes = 0;
for (const archivo of fs.readdirSync(uploads).filter((f) => f.endsWith(".pdf")).sort()) {
  const datos = fs.readFileSync(path.join(uploads, archivo));
  const huella = crypto.createHash("sha1").update(datos).digest("hex").slice(0, 8);
  const slug = archivo.replace(/\.pdf$/i, "");
  const doc = await getDocument({ ...opciones, data: new Uint8Array(datos) }).promise;
  const paginas = [];
  let peso = 0;
  for (let n = 1; n <= doc.numPages; n++) {
    const pagina = await doc.getPage(n);
    const base = pagina.getViewport({ scale: 1 });
    const vp = pagina.getViewport({ scale: LADO_LARGO / Math.max(base.width, base.height) });
    const w = Math.round(vp.width), h = Math.round(vp.height);
    const lienzo = createCanvas(w, h);
    const ctx = lienzo.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    await pagina.render({ canvasContext: ctx, viewport: vp }).promise;
    const nombre = `${slug}-${huella}-${n}.jpg`;
    const jpg = await lienzo.encode("jpeg", CALIDAD);
    fs.writeFileSync(path.join(salida, nombre), jpg);
    peso += jpg.length;
    paginas.push({ src: `/uploads/paginas/${nombre}`, w, h });
    pagina.cleanup();
  }
  await doc.destroy();
  resultado[`/uploads/${archivo}`] = { size: datos.length, pages: paginas };
  totalOriginal += datos.length; totalImagenes += peso;
  console.log(`${archivo}: ${doc.numPages} pág, ${(datos.length / 1048576).toFixed(1)} MB -> ${(peso / 1024).toFixed(0)} KB`);
}

fs.writeFileSync(indice, JSON.stringify(resultado, null, 2) + "\n");
console.log(`TOTAL: ${(totalOriginal / 1048576).toFixed(0)} MB de PDF -> ${(totalImagenes / 1048576).toFixed(1)} MB de imágenes`);
