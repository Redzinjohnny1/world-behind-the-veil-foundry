import fs from "node:fs";
import crypto from "node:crypto";

const sourcePath = process.argv[2];
const currentPath = process.argv[3] ?? "packs/desvantagens.json";
if (!sourcePath) throw new Error("Uso: node tools/build-disadvantages.mjs <texto> [seed-atual]");

const text = fs.readFileSync(sourcePath, "utf8").replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
const lines = text.split("\n");
const current = fs.existsSync(currentPath) ? JSON.parse(fs.readFileSync(currentPath, "utf8")) : [];
const currentByName = new Map(current.map((entry) => [entry.name.normalize("NFC").toLocaleLowerCase("pt-BR"), entry]));
const starts = [];
for (let i = 0; i < lines.length - 2; i += 1) {
  if (/^Categoria:\s*\S/.test(lines[i + 1]) && /^Valor:\s*\S/.test(lines[i + 2])) starts.push(i);
}

const headings = {
  "Física": "Desvantagens Físicas",
  "Mental/Comportamental": "Desvantagens Mentais e Comportamentais",
  "Social": "Desvantagens Sociais",
  "Véu": "Desvantagens do Véu",
  "Conduta": "Desvantagens de Conduta"
};
const headingPattern = /\n(?:Desvantagens Físicas|Desvantagens Mentais e Comportamentais|Desvantagens Sociais|Desvantagens do Véu|Desvantagens de Conduta)(?:\n|$)/;
const value = (line) => line.replace(/^[^:]+:\s*/, "").trim();
const stableId = (name) => crypto.createHash("sha256").update(`twbv-desvantagem:${name.normalize("NFC")}`).digest("hex").slice(0, 16);
const categoryIntro = (category) => {
  const headingIndex = lines.findIndex((line) => line.trim() === headings[category]);
  if (headingIndex < 0) return "";
  const firstEntry = starts.find((index) => index > headingIndex) ?? lines.length;
  return lines.slice(headingIndex + 1, firstEntry).join("\n").trim();
};

const generated = starts.map((start, index) => {
  const name = lines[start].trim();
  const category = value(lines[start + 1]);
  const severity = value(lines[start + 2]);
  const rawBody = lines.slice(start + 3, starts[index + 1] ?? lines.length).join("\n").trim();
  const nextHeading = rawBody.search(headingPattern);
  const description = (nextHeading < 0 ? rawBody : rawBody.slice(0, nextHeading)).trim();
  const old = currentByName.get(name.normalize("NFC").toLocaleLowerCase("pt-BR"));
  const id = old?._id ?? stableId(name);
  return {
    _id: id,
    name,
    type: "desvantagem",
    img: old?.img || "icons/svg/downgrade.svg",
    system: {
      active: true,
      description,
      effectsSummary: description,
      initiative: { modifier: 0, source: "" },
      tier: "",
      severity,
      category,
      categoria: category,
      source: headings[category] ?? `Desvantagens ${category}`,
      requirements: "",
      requisitos: "",
      favorite: false,
      activeEffects: []
    },
    effects: [],
    folder: null,
    ownership: { default: 2 },
    flags: { "world-behind-the-veil": { category, intro: categoryIntro(category) } }
  };
});

if (generated.length !== 109) throw new Error(`Esperadas 109 desvantagens; encontradas ${generated.length}.`);
if (new Set(generated.map((entry) => entry.name.toLocaleLowerCase("pt-BR"))).size !== generated.length) throw new Error("Há nomes duplicados no texto.");
fs.writeFileSync(currentPath, `${JSON.stringify(generated, null, 2)}\n`, "utf8");
console.log(`Gravadas ${generated.length} desvantagens em ${currentPath}.`);
