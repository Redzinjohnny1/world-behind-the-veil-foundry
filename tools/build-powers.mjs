import fs from "node:fs";
import crypto from "node:crypto";

const sourcePath = process.argv[2];
const outputPath = process.argv[3] ?? "packs/poderes.json";
if (!sourcePath) throw new Error("Uso: node tools/build-powers.mjs <texto> [saida]");

const lines = fs.readFileSync(sourcePath, "utf8").replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").split("\n");
const starts = [];
for (let i = 0; i < lines.length - 3; i += 1) {
  if (!/^Nome:\s*\S/.test(lines[i])) continue;
  const next = lines.slice(i + 1, i + 4);
  const name = lines[i].replace(/^Nome:\s*/, "").trim();
  if (name !== "nome do Poder." && next.some((line) => /^Fonte:\s*\S/.test(line))) starts.push(i);
}

const stableId = (name) => crypto.createHash("sha256").update(`twbv-poder:${name.normalize("NFC")}`).digest("hex").slice(0, 16);
const fieldNames = ["Tier", "Fonte", "Perícia", "Custo", "Tempo de Ativação", "Limite", "Alvo", "Alcance", "Molde Padrão", "Duração", "Manutenção", "Teste"];
const fieldPattern = new RegExp(`^(${fieldNames.join("|")}):\\s*(.*)$`);
const categoryHeadings = new Set(["Divino", "Psiquismo", "Jutsu", "Bruxaria (Pacto)", "Druidismo", "Bugigangas / Tecnomagia", "Arcano", "Artes Místicas", "Poderes Fundamentais"]);
const moldId = (value) => ({ alvo: "alvo", explosao: "explosao", cone: "cone", linha: "linha", aura: "aura", toque: "toque", glifo: "glifo", especial: "alvo" })[value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().split(/[ ,]/)[0]] ?? "alvo";
const activation = (value) => {
  const key = value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
  if (key.includes("menor")) return "acao_menor";
  if (key.startsWith("2 ")) return "duas_acoes";
  if (key.includes("ritual")) return "ritual";
  if (key === "1 acao") return "uma_acao";
  return "custom";
};
const durationConfig = (value) => {
  const key = value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
  if (key.includes("instantanea")) return { tipo: "instantanea", valorBase: 0, unidade: "rodadas", maximo: 0, custom: "" };
  const rounds = key.match(/sustentada\s*\((\d+)\s*rodadas?\)/);
  if (rounds) return { tipo: "sustentada", valorBase: Number(rounds[1]), unidade: "rodadas", maximo: 0, custom: "" };
  return { tipo: "custom", valorBase: 0, unidade: "rodadas", maximo: 0, custom: value };
};

const powers = starts.map((start, index) => {
  const end = starts[index + 1] ? starts[index + 1] - 1 : lines.length;
  const name = lines[start].replace(/^Nome:\s*/, "").trim();
  const fields = {};
  let cursor = start + 1;
  while (cursor < end) {
    const match = lines[cursor].match(fieldPattern);
    if (!match) break;
    fields[match[1]] = match[2].trim();
    cursor += 1;
  }
  const bodyLines = lines.slice(cursor, end);
  const nextCategory = bodyLines.findIndex((line) => categoryHeadings.has(line.trim()));
  const rawBody = (nextCategory < 0 ? bodyLines : bodyLines.slice(0, nextCategory)).join("\n").trim();
  const sectionMatch = rawBody.match(/\n(?:Aprimoramentos|Moldes) Permitidos\n/);
  const description = (sectionMatch ? rawBody.slice(0, sectionMatch.index) : rawBody).trim();
  const enhancementText = sectionMatch ? rawBody.slice(sectionMatch.index + sectionMatch[0].length).trim() : "";
  const enhancements = [];
  for (const line of enhancementText.split("\n").filter(Boolean)) {
    const colon = line.indexOf(":");
    const beginsEntry = colon > 0 && colon < 60 && !/^Exemplo:/i.test(line);
    if (!beginsEntry && enhancements.length) {
      enhancements.at(-1).descricao = `${enhancements.at(-1).descricao}\n${line}`.trim();
      continue;
    }
    const enhancementName = beginsEntry ? line.slice(0, colon) : line;
    const enhancementDescription = beginsEntry ? line.slice(colon + 1).trim() : "";
    const cost = enhancementDescription.match(/\+(\d+)\s+(?:Pontos? de )?Mana/i);
    enhancements.push({ nome: enhancementName.trim(), custoMana: Number(cost?.[1] ?? 0), limiteMaximo: "", tipoCalculo: "flat", descricao: enhancementDescription });
  }
  const source = fields.Fonte ?? "Qualquer Fonte compatível";
  const category = fields.Tier ?? "Novato";
  const mana = Number((fields.Custo ?? "0").match(/\d+/)?.[0] ?? 0);
  const mold = moldId(fields["Molde Padrão"] ?? "Alvo");
  const activationId = activation(fields["Tempo de Ativação"] ?? "1 ação");
  const damage = description.match(/\b\d+d\d+\b/i)?.[0] ?? "";
  return {
    _id: stableId(name), name, type: "poder", img: "icons/svg/explosion.svg",
    system: {
      active: true, description, effectsSummary: description, initiative: { modifier: 0, source: "" },
      tier: fields.Tier ?? "Novato", severity: "", itemKind: "poder", category,
      source, fonte: source, requisitoTier: fields.Tier ?? "Novato", requirements: "",
      skill: fields.Perícia ?? "Perícia da Fonte", pericia: fields.Perícia ?? "Perícia da Fonte",
      ativacao: activationId, ativacaoCustom: activationId === "custom" ? fields["Tempo de Ativação"] ?? "" : "",
      limite: (fields.Limite === "—" ? "none" : "custom"), limiteCustom: fields.Limite === "—" ? "" : fields.Limite ?? "",
      alvo: [fields.Alvo, fields.Alcance ? `Alcance: ${fields.Alcance}` : ""].filter(Boolean).join(". "),
      moldePadrao: mold, moldeAtual: mold, duracaoConfig: durationConfig(fields.Duração ?? "Instantânea"), duracao: fields.Duração ?? "",
      manutencaoMana: fields.Manutenção ?? "", teste: fields.Teste ?? "", defesa: fields.Teste?.split(/\bcontra\b/i)[1]?.trim() ?? "",
      manaCost: mana, manaBase: mana, manaGasta: 0, custoBaseMana: mana, custoFinalMana: mana,
      damage, danoBase: damage, danoEscolhido: damage, damageType: "", tipoDano: "", status: "",
      descricoes: [{ defesa: fields.Teste ?? "", texto: description }], aprimoramentos: enhancements,
      moldavel: false, moldesPermitidos: [mold], nivelMoldeAtual: 0, custoMoldeAtual: 0,
      risco: "", observacoesMestre: "", areaEffect: mold, spellEffects: [], favorite: false
    },
    effects: [], folder: null, ownership: { default: 2 },
    flags: { "world-behind-the-veil": { officialPower: true, category } }
  };
});

if (powers.length !== 17) throw new Error(`Esperados 17 poderes; encontrados ${powers.length}.`);
fs.writeFileSync(outputPath, `${JSON.stringify(powers, null, 2)}\n`, "utf8");
console.log(`Gravados ${powers.length} poderes em ${outputPath}.`);
