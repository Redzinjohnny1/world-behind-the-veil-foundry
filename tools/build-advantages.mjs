import fs from "node:fs";
import crypto from "node:crypto";

const sourcePath = process.argv[2];
const outputPath = process.argv[3] ?? "packs/vantagens.json";
if (!sourcePath) throw new Error("Uso: node tools/build-advantages.mjs <texto> [saida]");

const text = fs.readFileSync(sourcePath, "utf8").replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
const lines = text.split("\n");
const starts = [];
for (let i = 0; i < lines.length - 3; i += 1) {
  if (/^Categoria:\s*\S/.test(lines[i + 1]) && /^Tier:\s*\S/.test(lines[i + 2]) && /^Pr[eé]-requisitos:\s*/i.test(lines[i + 3])) starts.push(i);
}

const stableId = (name) => crypto.createHash("sha256").update(`twbv-vantagem:${name.normalize("NFC")}`).digest("hex").slice(0, 16);
const value = (line) => line.replace(/^[^:]+:\s*/, "").trim();
const iconByCategory = {
  "Antecedente": "icons/svg/book.svg",
  "Combate": "icons/svg/sword.svg",
  "Combate — Estilo de Luta": "icons/svg/fist.svg",
  "Armas": "icons/svg/combat.svg",
  "Liderança": "icons/svg/upgrade.svg",
  "Social": "icons/svg/daze.svg",
  "Profissional": "icons/svg/compass.svg",
  "Sobrenatural": "icons/svg/aura.svg"
};

function activeEffects(name) {
  const definitions = {
    "Ligeiro": [["Deslocamento +2q", "system.configFicha.movimentoBase", 2]]
  };
  return (definitions[name] ?? []).map(([label, key, amount]) => ({
    _id: stableId(`${name}:${key}`),
    name: label,
    label,
    img: "icons/svg/aura.svg",
    disabled: false,
    transfer: true,
    changes: [{ key, mode: 2, value: String(amount), priority: 20 }],
    duration: {},
    description: `Efeito permanente de ${name}.`
  }));
}

const documents = starts.map((start, index) => {
  const end = starts[index + 1] ?? lines.length;
  const name = lines[start].trim();
  const category = value(lines[start + 1]);
  const tier = value(lines[start + 2]);
  const requirements = value(lines[start + 3]);
  const rawBody = lines.slice(start + 4, end).join("\n").trim();
  // Os textos introdutórios de uma nova categoria ficam entre a última
  // vantagem da categoria anterior e a primeira da próxima.
  const categoryHeading = /\n(?:Vantagens de Combate|Estilos de Luta|Vantagens de Armas|Vantagens de Liderança|Vantagens Sociais|Vantagens Profissionais|Vantagens Sobrenaturais)(?:\n|$)/;
  const headingIndex = rawBody.search(categoryHeading);
  const body = (headingIndex < 0 ? rawBody : rawBody.slice(0, headingIndex)).trim();
  const veilMatch = body.match(/(?:^|\n)Ponto de Véu:\s*([\s\S]*?)(?=\n(?:Especial:|Efeito:)|$)/);
  const firstRule = body.search(/(?:^|\n)(?:Efeito|Ponto de Véu|Especial):/);
  const description = (firstRule < 0 ? body : body.slice(0, firstRule)).trim();
  return {
    _id: stableId(name),
    name,
    type: "vantagem",
    img: iconByCategory[category] ?? "icons/svg/item-bag.svg",
    system: {
      active: true,
      description,
      effectsSummary: body,
      initiative: { modifier: 0, source: "" },
      tier,
      severity: "",
      category,
      source: "Livro de Vantagens",
      requirements,
      effect: body,
      veilUse: veilMatch?.[1]?.trim() ?? ""
    },
    effects: activeEffects(name),
    flags: { "world-behind-the-veil": { officialAdvantage: true } }
  };
});

if (documents.length !== 176) throw new Error(`Esperadas 176 vantagens; encontradas ${documents.length}.`);
const names = new Set(documents.map((entry) => entry.name.toLocaleLowerCase("pt-BR")));
if (names.size !== documents.length) throw new Error("O texto contém nomes de vantagens duplicados.");
fs.writeFileSync(outputPath, `${JSON.stringify(documents, null, 2)}\n`, "utf8");
console.log(`Gravadas ${documents.length} vantagens em ${outputPath}.`);
