// Falla (exit 1) si algún archivo de la app contiene un número de teléfono fijo,
// un emoji o un texto de relleno que no describe al negocio.
// Uso: node scripts/verificar-sin-telefonos.js
const fs = require("fs");
const path = require("path");

const prohibidos = [
  "527715563522", "527711234567", "7715563522", "7711234567", "7711875194", "wa.me/5",
  "maestras artesanas", "Comercio Justo", "comunidades artesanales", "✅", "❌", "🎉",
];
const carpetas = ["app", "components", "services", "utils", "context"];
const raiz = path.join(__dirname, "..");

const leer = (dir) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const p = path.join(dir, e.name);
        return e.isDirectory() ? leer(p) : /\.(ts|tsx)$/.test(e.name) ? [p] : [];
      })
    : [];

const culpables = carpetas
  .flatMap((c) => leer(path.join(raiz, c)))
  .filter((p) => prohibidos.some((f) => fs.readFileSync(p, "utf8").includes(f)))
  .map((p) => path.relative(raiz, p));

if (culpables.length) {
  console.error("Números fijos, emojis o textos de relleno en:\n  " + culpables.join("\n  "));
  process.exit(1);
}
console.log("OK: sin números fijos.");
