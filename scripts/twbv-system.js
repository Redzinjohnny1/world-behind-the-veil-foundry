const STAGES = [
  { name: "Novato", min: 0, max: 4 },
  { name: "Treinado", min: 5, max: 9 },
  { name: "Experiente", min: 10, max: 15 },
  { name: "Elite", min: 16, max: 22 },
  { name: "M\u00edtico", min: 23, max: 30 },
  { name: "Lend\u00e1rio", min: 31, max: Infinity }
];

const ADVANCEMENT_OPTIONS = [
  "Aumentar um atributo",
  "Aumentar uma per\u00edcia",
  "Comprar uma vantagem",
  "Remover uma desvantagem",
  "Novo poder",
  "Melhorar poder existente",
  "Outro"
];

const TWBV_ATTRIBUTE_ADVANCEMENT = ADVANCEMENT_OPTIONS[0];

const TWBV_INITIATIVE_SUITS = [
  { value: "hearts", label: "Copas", short: "C", order: 0 },
  { value: "diamonds", label: "Ouros", short: "O", order: 1 },
  { value: "clubs", label: "Paus", short: "P", order: 2 },
  { value: "spades", label: "Espadas", short: "E", order: 3 }
];

const TWBV_INITIATIVE_RANKS = [
  { value: 2, key: "2", label: "2" },
  { value: 3, key: "3", label: "3" },
  { value: 4, key: "4", label: "4" },
  { value: 5, key: "5", label: "5" },
  { value: 6, key: "6", label: "6" },
  { value: 7, key: "7", label: "7" },
  { value: 8, key: "8", label: "8" },
  { value: 9, key: "9", label: "9" },
  { value: 10, key: "10", label: "10" },
  { value: 11, key: "jack", label: "Valete" },
  { value: 12, key: "queen", label: "Dama" },
  { value: 13, key: "king", label: "Rei" },
  { value: 14, key: "ace", label: "\u00c1s" },
  { value: 15, key: "joker", label: "Coringa" }
];

const TWBV_INITIATIVE_SUIT_ORDER = TWBV_INITIATIVE_SUITS.map((suit) => suit.value);
const TWBV_INITIATIVE_DECK_NAME = "TWBV - Iniciativa";
const TWBV_INITIATIVE_DISCARD_NAME = "TWBV - Descarte Iniciativa";
const TWBV_INITIATIVE_ANIMATED_DECK_MODULE_ID = "swade-animated-action-deck";
const TWBV_INITIATIVE_ANIMATED_DECK_BASE = "systems/world-behind-the-veil/assets/animated-action-deck";
const TWBV_INITIATIVE_CARD_BACK = `${TWBV_INITIATIVE_ANIMATED_DECK_BASE}/back.webp`;
const TWBV_INITIATIVE_SHUFFLE_SOUND = "systems/world-behind-the-veil/assets/sounds/initiative-shuffle.mp3";
const TWBV_INITIATIVE_DRAW_SOUND = "systems/world-behind-the-veil/assets/sounds/initiative-card-draw.mp3";
const TWBV_INITIATIVE_MEDIA_CACHE = new Map();

const TWBV_POWER_EFFECT_TYPES = [
  { value: "damage", label: "Mais dano", defaultLabel: "Mais dano", manaPerStep: 1, stepLabel: "+1d6", description: "Aumenta o dano da magia em +1d6 por passo." },
  { value: "effect", label: "Efeito adicional", defaultLabel: "Efeito adicional", manaPerStep: 1, stepLabel: "+1 efeito", description: "Adiciona outro efeito da magia ao lançamento." },
  { value: "target", label: "Alvo extra", defaultLabel: "Alvo extra", manaPerStep: 1, stepLabel: "+1 alvo", description: "Atinge um alvo adicional." },
  { value: "sphere", label: "Esfera", defaultLabel: "Esfera", manaPerStep: 1, stepLabel: "+1 quadrado de raio", description: "Aumenta o raio da esfera em 1 quadrado por passo." },
  { value: "cone", label: "Cone", defaultLabel: "Cone", manaPerStep: 1, stepLabel: "+2 quadrados", description: "Aumenta o cone em 2 quadrados por passo." },
  { value: "line", label: "Linha", defaultLabel: "Linha", manaPerStep: 1, stepLabel: "Dobra a linha", description: "Dobra o alcance da linha por passo. Cada passo custa 1 Mana." },
  { value: "glyph", label: "Glifo", defaultLabel: "Glifo", manaPerStep: 1, stepLabel: "área progressiva", description: "Amplia a área do glifo: 1, 2, 4, 6... quadrados." },
  { value: "delivery", label: "Alcance/forma", defaultLabel: "Alcance/forma", manaPerStep: 1, stepLabel: "+1 passo", description: "Ajuste genérico de alcance ou forma da magia." },
  { value: "custom", label: "Custom", defaultLabel: "Custom", manaPerStep: 1, stepLabel: "+1 passo", description: "Molde customizado definido pelo mestre." }
];

const TWBV_POWER_AREA_LEGACY_ALIASES = {
  "": "none",
  "burst-small": "sphere-1",
  "burst-medium": "sphere-2",
  "burst-large": "sphere-3",
  "cone-small": "cone-3",
  "cone-large": "cone-6"
};

const TWBV_POWER_AREA_PRESETS = [
  { value: "none", label: "Nenhuma", summary: "", templateType: "", squares: 0, shape: "none", icon: "fas fa-ban" },
  { value: "sphere-1", label: "Explos\u00e3o pequena", summary: "Centro + adjacentes", templateType: "circle", squares: 1, shape: "sphere", icon: "fas fa-dot-circle" },
  { value: "sphere-2", label: "Explos\u00e3o m\u00e9dia", summary: "Explos\u00e3o m\u00e9dia", templateType: "circle", squares: 2, shape: "sphere", icon: "fas fa-bullseye" },
  { value: "sphere-3", label: "Explos\u00e3o grande", summary: "Explos\u00e3o grande", templateType: "circle", squares: 3, shape: "sphere", icon: "fas fa-certificate" },
  { value: "sphere-4", label: "Explos\u00e3o m\u00e1xima", summary: "Explos\u00e3o m\u00e1xima", templateType: "circle", squares: 4, shape: "sphere", icon: "fas fa-radiation-alt" },
  { value: "cone-3", label: "Cone pequeno", summary: "Cone progressivo pequeno", templateType: "cone", squares: 3.5, angle: 53.13, shape: "cone", icon: "fas fa-caret-up" },
  { value: "cone-6", label: "Cone m\u00e9dio", summary: "Cone progressivo m\u00e9dio", templateType: "cone", squares: 6.5, angle: 53.13, shape: "cone", icon: "fas fa-location-arrow" },
  { value: "cone-9", label: "Cone grande", summary: "Cone progressivo grande", templateType: "cone", squares: 9.5, angle: 53.13, shape: "cone", icon: "fas fa-paper-plane" },
  { value: "line-6", label: "Linha pequena", summary: "Feixe reto pequeno", templateType: "ray", squares: 6, widthSquares: 1, shape: "line", icon: "fas fa-minus" },
  { value: "line-12", label: "Linha m\u00e9dia", summary: "Feixe reto m\u00e9dio", templateType: "ray", squares: 12, widthSquares: 1, shape: "line", icon: "fas fa-grip-lines" },
  { value: "line-24", label: "Linha grande", summary: "Feixe reto grande", templateType: "ray", squares: 24, widthSquares: 1, shape: "line", icon: "fas fa-grip-lines-vertical" },
  { value: "glyph-1", label: "Glifo", summary: "\u00c1rea quadrada inicial", templateType: "rect", squares: 1, shape: "glyph", icon: "fas fa-draw-polygon" },
  { value: "aura-1", label: "Aura", summary: "Aura centrada no token", templateType: "circle", squares: 1, shape: "aura", icon: "fas fa-atom" },
  { value: "touch", label: "Toque", summary: "Magia de toque", templateType: "", squares: 0, shape: "touch", icon: "fas fa-hand-sparkles" },
  { value: "target", label: "Alvo", summary: "Ajusta a quantidade de alvos", templateType: "", squares: 0, shape: "target", icon: "fas fa-crosshairs" }
];

const TWBV_ARCANE_ABILITIES = [
  { name: "Arcanismo", attribute: "inteligencia" },
  { name: "Ocultismo", attribute: "inteligencia" },
  { name: "Fé", attribute: "intuicao" },
  { name: "Botânica", attribute: "inteligencia" },
  { name: "Ciências", attribute: "inteligencia" },
  { name: "Poder Inato", attribute: "intuicao" },
  { name: "Psi\u00f4nico", attribute: "forca" },
  { name: "Jutsu", attribute: "destreza" }
];

const TWBV_ITEM_TYPES = {
  vantagem: "Vantagem",
  desvantagem: "Desvantagem",
  habilidadeEspecial: "Habilidade Especial",
  poder: "Poder",
  equipamento: "Equipamento",
  arma: "Arma",
  armadura: "Armadura",
  weapon: "Arma",
  consumable: "Consum\u00edvel",
  modificacao: "Modifica\u00e7\u00e3o",
  municao: "Muni\u00e7\u00e3o",
  pericia: "Per\u00edcia"
};

const TWBV_ACTOR_TYPES = {
  personagem: "Personagem",
  despertos: "Desperto",
  "semi-despertos": "Semi-Desperto",
  sombras: "Sombra"
};

const TWBV_ACTOR_CREATE_ORDER = ["despertos", "semi-despertos", "sombras"];
const TWBV_ACTOR_DEFAULT_TYPE = "despertos";
const TWBV_MONEY_CURRENCIES = [
  { code: "USD", symbol: "$", name: "D\u00f3lar americano" },
  { code: "BRL", symbol: "R$", name: "Real brasileiro" },
  { code: "EUR", symbol: "\u20ac", name: "Euro" },
  { code: "GBP", symbol: "\u00a3", name: "Libra esterlina" },
  { code: "JPY", symbol: "\u00a5", name: "Iene japon\u00eas" },
  { code: "CNY", symbol: "\u00a5", name: "Yuan chin\u00eas" },
  { code: "CHF", symbol: "Fr", name: "Franco su\u00ed\u00e7o" },
  { code: "CAD", symbol: "C$", name: "D\u00f3lar canadense" },
  { code: "AUD", symbol: "A$", name: "D\u00f3lar australiano" },
  { code: "MXN", symbol: "$", name: "Peso mexicano" },
  { code: "INR", symbol: "\u20b9", name: "Rupia indiana" }
];
const TWBV_MEDIEVAL_CURRENCIES = [
  { code: "cobre", symbol: "cc", name: "Cobre", icon: "fas fa-circle" },
  { code: "prata", symbol: "pp", name: "Prata", icon: "fas fa-moon" },
  { code: "ouro", symbol: "po", name: "Ouro", icon: "fas fa-sun" },
  { code: "platina", symbol: "pl", name: "Platina", icon: "fas fa-gem" }
];

const TWBV_EQUIPMENT_SLOT_DEFS = [
  { key: "head", label: "Cabe\u00e7a", accepts: ["armadura"] },
  { key: "chest", label: "Peito", accepts: ["armadura"] },
  { key: "legs", label: "Perna", accepts: ["armadura"] },
  { key: "boots", label: "Botas", accepts: ["armadura"] },
  { key: "gloves", label: "Luva", accepts: ["armadura"] },
  { key: "belt", label: "Cinto", accepts: ["armadura"] },
  { key: "ringLeft", label: "Anel Esq.", accepts: ["armadura"] },
  { key: "ringRight", label: "Anel Dir.", accepts: ["armadura"] },
  { key: "weaponMain", label: "M\u00e3o Principal", accepts: ["weapon", "arma"] },
  { key: "weaponOff", label: "M\u00e3o In\u00e1bil", accepts: ["weapon", "arma"] }
];

const TWBV_DEFAULT_BODY_SLOT_POSITIONS = {
  weaponMain: { left: 4.2, top: 5.6 },
  head: { left: 40.6, top: 3.0 },
  weaponOff: { left: 76.4, top: 5.8 },
  gloves: { left: 3.2, top: 27.6 },
  chest: { left: 76.0, top: 27.2 },
  ringLeft: { left: 3.6, top: 48.8 },
  ringRight: { left: 75.2, top: 47.4 },
  legs: { left: 3.8, top: 70.3 },
  belt: { left: 75.0, top: 70.3 },
  boots: { left: 39.0, top: 85.0 }
};

const TWBV_DEFAULT_BODY_LINES = [
  { key: "head", left: 50.3, top: 19.2, width: 0.1, angle: 0 },
  { key: "chest", left: 50.0, top: 33.4, width: 28.5, angle: 0 },
  { key: "gloves", left: 34.6, top: 42.2, width: 21.5, angle: -154 },
  { key: "ring-left", left: 34.8, top: 42.8, width: 24.2, angle: 154 },
  { key: "ring-right", left: 66.0, top: 42.6, width: 18.0, angle: 29 },
  { key: "legs", left: 46.6, top: 57.1, width: 31.0, angle: 154 },
  { key: "belt", left: 54.2, top: 57.1, width: 26.0, angle: 30 },
  { key: "boots", left: 45.3, top: 79.0, width: 5.8, angle: 66 },
  { key: "weapon-main", left: 23.0, top: 12.8, width: 0.1, angle: 0 },
  { key: "weapon-off", left: 76.4, top: 13.2, width: 0.1, angle: 0 }
];

const TWBV_HANDLEBARS_PARTIALS = [
  "systems/world-behind-the-veil/templates/actor/parts/equipment-card.hbs"
];

const TWBV_LOCAL_BUILD = "compendiums-2026-06-08-desvantagens-fisicas";
const TWBV_DEFAULT_WORLD_BACKGROUND = "systems/world-behind-the-veil/assets/background/login-background.png";
const TWBV_LEGACY_WORLD_BACKGROUNDS = new Set([
  "",
  "assets/background/ChatGPT%20Image%2020%20de%20mai.%20de%202026%2C%2014_06_27.png",
  "twbv-login-background.png"
]);

function twbvWorldUserImagePath(category = "images") {
  const worldId = String(game?.world?.id ?? "world").trim() || "world";
  const safeCategory = String(category ?? "images").trim().replace(/^\/+|\/+$/g, "") || "images";
  return `worlds/${worldId}/world-behind-the-veil/${safeCategory}/`;
}

function twbvIsBundledImagePath(path) {
  const text = String(path ?? "").trim();
  return !text
    || text.startsWith("icons/")
    || text.startsWith("systems/world-behind-the-veil/")
    || text.startsWith(`systems/${game?.system?.id ?? "world-behind-the-veil"}/`);
}

async function twbvEnsureWorldUserImagePath(category = "images") {
  const target = twbvWorldUserImagePath(category).replace(/\/+$/g, "");
  if (!game?.user?.isGM || !globalThis.FilePicker?.createDirectory) return `${target}/`;

  const parts = target.split("/").filter(Boolean);
  let current = "";
  for (const part of parts) {
    const parent = current;
    current = current ? `${current}/${part}` : part;
    try {
      const browse = await FilePicker.browse("data", parent);
      const dirs = (browse?.dirs ?? []).map((dir) => String(dir ?? "").replace(/\/+$/g, ""));
      if (dirs.includes(current)) continue;
    } catch (_) {
      // If browse fails, still try to create the folder below.
    }

    try {
      await FilePicker.createDirectory("data", current, {});
    } catch (error) {
      const message = String(error?.message ?? error ?? "");
      if (!/exist|already/i.test(message)) {
        console.warn("[TWBV] Nao foi possivel criar a pasta de imagens do mundo.", { path: current, error });
        break;
      }
    }
  }
  return `${target}/`;
}

async function twbvImagePickerCurrentPath(current, category = "images") {
  const text = String(current ?? "").trim();
  if (!twbvIsBundledImagePath(text)) return text;
  return twbvEnsureWorldUserImagePath(category);
}

async function twbvConfigureTokenizerImagePath() {
  if (!game?.user?.isGM || !game.modules?.get("vtta-tokenizer")?.active) return;
  const path = `[data] ${(await twbvEnsureWorldUserImagePath("personagens")).replace(/\/+$/g, "")}`;
  for (const setting of ["image-upload-directory", "npc-image-upload-directory"]) {
    try {
      if (game.settings.get("vtta-tokenizer", setting) !== path) {
        await game.settings.set("vtta-tokenizer", setting, path);
      }
    } catch (error) {
      console.warn("[TWBV] Nao foi possivel configurar o caminho do Tokenizer.", { setting, path, error });
    }
  }
}

const TWBV_ITEM_ICONS = {
  arma: "icons/svg/sword.svg",
  weapon: "icons/svg/sword.svg",
  armadura: "icons/svg/shield.svg",
  consumable: "icons/svg/item-bag.svg",
  municao: "icons/svg/target.svg",
  equipamento: "icons/svg/item-bag.svg",
  modificacao: "icons/svg/item-bag.svg",
  vantagem: "icons/svg/item-bag.svg",
  desvantagem: "icons/svg/item-bag.svg",
  habilidadeEspecial: "icons/svg/book.svg",
  poder: "icons/svg/upgrade.svg"
};

const TWBV_ARMOR_SLOT_LABELS = {
  head: "Cabe\u00e7a",
  chest: "Peito",
  legs: "Pernas",
  boots: "Botas",
  gloves: "Luva",
  belt: "Cinto",
  ringLeft: "Anel Esq.",
  ringRight: "Anel Dir."
};

const TWBV_WEAPON_SLOT_LABELS = {
  shortBlade: "L\u00e2mina curta",
  longBlade: "L\u00e2mina Longa",
  blunt: "Contusivo/Corporal",
  pistol: "Pistolas",
  revolver: "Rev\u00f3lver",
  smg: "Submetralhadoras",
  assault: "Assalto",
  shotgun: "Escopeta",
  sniper: "Sniper",
  heavyArtillery: "Artilharia Pesada"
};

const TWBV_AMMO_RELOAD_LABELS = {
  magazine: "Pente",
  loader: "Carregador",
  clip: "Clip",
  shell: "Cartucho",
  round: "Proj\u00e9til",
  cylinder: "Cilindro",
  cell: "C\u00e9lula",
  box: "Caixa"
};

const TWBV_WEAPON_HAND_LABELS = {
  main: "M\u00e3o Principal",
  off: "M\u00e3o In\u00e1bil",
  two: "2 M\u00e3os"
};

function twbvIsAmmoBox(itemOrData) {
  const system = itemOrData?.system ?? {};
  return String(system.reloadType ?? system.ammoType ?? "").trim() === "box";
}

function twbvIsAmmoCarrier(itemOrData) {
  return String(itemOrData?.type ?? "") === "municao" && !twbvIsAmmoBox(itemOrData);
}

function summarizeItemActiveEffects(item) {
  const explicitSummary = String(item.system?.effectsSummary ?? "").trim();
  if (explicitSummary) return explicitSummary;
  const changes = Array.from(item.effects ?? []).flatMap((effect) =>
    Array.from(effect.changes ?? []).map((change) => String(change.key ?? "").trim()).filter(Boolean)
  );
  if (!changes.length) return "";
  return changes.slice(0, 3).join(", ");
}

function twbvGetActiveEffectModeLabel(mode) {
  const modes = CONST?.ACTIVE_EFFECT_MODES ?? {};
  const numeric = Number(mode);
  if (numeric === Number(modes.ADD ?? 2)) return "Somar";
  if (numeric === Number(modes.MULTIPLY ?? 1)) return "Multiplicar";
  if (numeric === Number(modes.OVERRIDE ?? 5)) return "Sobrescrever";
  if (numeric === Number(modes.UPGRADE ?? 4)) return "Melhorar";
  if (numeric === Number(modes.DOWNGRADE ?? 3)) return "Piorar";
  if (numeric === Number(modes.CUSTOM ?? 0)) return "Custom";
  return String(mode ?? "");
}

function twbvGetActiveEffectTargetLabel(actor, key) {
  const path = String(key ?? "").trim();
  if (!path) return "Campo vazio";
  const parts = path.split(".");
  if (parts[0] === "system" && parts[1] === "atributos" && parts[2]) {
    const attr = SKILL_ATTRIBUTES.find((entry) => entry.key === parts[2])?.label ?? parts[2];
    if (parts[3] === "bonus") return `${attr} - B\u00f4nus`;
    if (parts[3] === "passo") return `${attr} - dado`;
    return `${attr} - ${parts.slice(3).join(".")}`;
  }
  if (parts[0] === "system" && parts[1] === "pericias" && Number.isInteger(Number(parts[2]))) {
    const skill = actor?.system?.pericias?.[Number(parts[2])] ?? {};
    const name = String(skill.nome ?? `Per\u00edcia ${Number(parts[2]) + 1}`).trim();
    if (parts[3] === "bonus") return `${name} - B\u00f4nus`;
    if (parts[3] === "dado") return `${name} - dado`;
    return `${name} - ${parts.slice(3).join(".")}`;
  }
  const labels = {
    "system.eco": "Eco",
    "system.mana.value": "Mana atual",
    "system.mana.max": "Mana m\u00e1xima",
    "system.ferimentos": "Ferimentos",
    "system.fadiga": "Fadiga",
    "system.tamanho": "Tamanho",
    "system.defesa.aparar": "Aparar",
    "system.defesa.resistencia": "Resist\u00eancia",
    "system.defesa.desviar": "Desviar",
    "system.defesa.resistenciaMagica": "Resist\u00eancia M\u00e1gica"
  };
  return labels[path] ?? path;
}

function twbvBuildActorEffectTargetOptions(actor) {
  const attrOptions = [
    { group: "Atributos", key: "system.atributos.forca.bonus", label: "For\u00e7a - B\u00f4nus" },
    { group: "Atributos", key: "system.atributos.destreza.bonus", label: "Destreza - B\u00f4nus" },
    { group: "Atributos", key: "system.atributos.constituicao.bonus", label: "Constitui\u00e7\u00e3o - B\u00f4nus" },
    { group: "Atributos", key: "system.atributos.inteligencia.bonus", label: "Intelig\u00eancia - B\u00f4nus" },
    { group: "Atributos", key: "system.atributos.influencia.bonus", label: "Influ\u00eancia - B\u00f4nus" },
    { group: "Atributos", key: "system.atributos.intuicao.bonus", label: "Intui\u00e7\u00e3o - B\u00f4nus" }
  ];
  const defenseOptions = [
    { group: "Defesas e recursos", key: "system.defesa.aparar", label: "Aparar" },
    { group: "Defesas e recursos", key: "system.defesa.resistencia", label: "Resist\u00eancia" },
    { group: "Defesas e recursos", key: "system.defesa.desviar", label: "Desviar" },
    { group: "Defesas e recursos", key: "system.defesa.resistenciaMagica", label: "Resist\u00eancia M\u00e1gica" },
    { group: "Defesas e recursos", key: "system.mana.max", label: "Mana m\u00e1xima" },
    { group: "Defesas e recursos", key: "system.eco", label: "Eco" },
    { group: "Defesas e recursos", key: "system.tamanho", label: "Tamanho" }
  ];
  const damageOptions = [
    { group: "Dano", key: "system.dano.bonus", label: "Todo dano - B\u00f4nus" },
    { group: "Dano", key: "system.dano.armas", label: "Dano de armas - B\u00f4nus" },
    { group: "Dano", key: "system.dano.poderes", label: "Dano de poderes - B\u00f4nus" }
  ];
  const skillOptions = Array.from(actor?.system?.pericias ?? [])
    .map((skill, index) => ({
      group: "Pericias",
      key: `system.pericias.${index}.bonus`,
      label: `${String(skill?.nome ?? `Per\u00edcia ${index + 1}`).trim()} - B\u00f4nus`
    }))
    .filter((entry) => entry.label.trim());
  return [...attrOptions, ...defenseOptions, ...damageOptions, ...skillOptions];
}

function twbvPrepareActorSheetEffects(actor) {
  const effects = Array.from(actor?.effects ?? []);
  const modeAdd = CONST?.ACTIVE_EFFECT_MODES?.ADD ?? 2;
  const prepared = effects.map((effect) => {
    const changes = Array.from(effect.changes ?? []).map((change) => ({
      key: String(change.key ?? ""),
      label: twbvGetActiveEffectTargetLabel(actor, change.key),
      mode: Number(change.mode ?? modeAdd),
      modeLabel: twbvGetActiveEffectModeLabel(change.mode ?? modeAdd),
      value: String(change.value ?? "")
    }));
    const duration = effect.duration ?? {};
    const durationLabel = duration.rounds
      ? `${duration.rounds} rodada${Number(duration.rounds) === 1 ? "" : "s"}`
      : duration.seconds
        ? `${duration.seconds}s`
        : "";
    return {
      id: effect.id,
      uuid: effect.uuid,
      name: effect.name ?? effect.label ?? "Efeito",
      img: effect.img || "icons/svg/aura.svg",
      disabled: Boolean(effect.disabled),
      temporary: Boolean(duration.rounds || duration.seconds || duration.turns),
      durationLabel,
      changes,
      description: String(effect.description ?? effect.system?.description ?? "").trim()
    };
  });
  return {
    temporary: prepared.filter((effect) => !effect.disabled && effect.temporary),
    permanent: prepared.filter((effect) => !effect.disabled && !effect.temporary),
    inactive: prepared.filter((effect) => effect.disabled)
  };
}

function twbvGetActiveEffectBonusDetails(actor, key, totalValue = 0, fallbackLabel = "B\u00f4nus") {
  const targetKey = String(key ?? "").trim();
  const total = twbvNumberOrZero(totalValue);
  if (!actor || !targetKey || !total) return [];
  const addMode = Number(CONST?.ACTIVE_EFFECT_MODES?.ADD ?? 2);
  const details = [];
  for (const effect of Array.from(actor.effects ?? [])) {
    if (effect.disabled) continue;
    for (const change of Array.from(effect.changes ?? [])) {
      if (String(change.key ?? "").trim() !== targetKey) continue;
      const mode = Number(change.mode ?? addMode);
      if (mode !== addMode) continue;
      const value = twbvNumberOrZero(change.value);
      if (!value) continue;
      details.push({ label: String(effect.name ?? effect.label ?? fallbackLabel).trim() || fallbackLabel, value });
    }
  }
  const detailedTotal = details.reduce((sum, entry) => sum + twbvNumberOrZero(entry.value), 0);
  const remainder = total - detailedTotal;
  if (remainder) details.push({ label: fallbackLabel, value: remainder });
  return details;
}

function twbvGetActorAttributeBonusDetails(actor, attributeKey, totalValue, fallbackLabel = "B\u00f4nus") {
  return twbvGetActiveEffectBonusDetails(actor, `system.atributos.${attributeKey}.bonus`, totalValue, fallbackLabel);
}

function twbvGetActorSkillBonusDetails(actor, skillIndex, totalValue, fallbackLabel = "B\u00f4nus") {
  return twbvGetActiveEffectBonusDetails(actor, `system.pericias.${skillIndex}.bonus`, totalValue, fallbackLabel);
}

function twbvGetActorDamageBonusDetails(actor, kind = "all") {
  const details = [];
  const totalAll = twbvNumberOrZero(actor?.system?.dano?.bonus);
  if (totalAll) details.push(...twbvGetActiveEffectBonusDetails(actor, "system.dano.bonus", totalAll, "Dano global"));
  const kindPath = kind === "weapon" ? "system.dano.armas" : kind === "power" ? "system.dano.poderes" : "";
  const kindLabel = kind === "weapon" ? "Dano de armas" : kind === "power" ? "Dano de poderes" : "Dano";
  const totalKind = kindPath ? twbvNumberOrZero(foundry.utils.getProperty(actor, kindPath)) : 0;
  if (totalKind) details.push(...twbvGetActiveEffectBonusDetails(actor, kindPath, totalKind, kindLabel));
  return details;
}

function twbvDamageBonusRollParts(actor, kind = "all") {
  return twbvGetActorDamageBonusDetails(actor, kind)
    .filter((entry) => twbvNumberOrZero(entry?.value))
    .map((entry) => ({
      label: String(entry.label ?? "Dano").trim() || "Dano",
      formula: twbvNormalizeDamageFormulaPart(twbvFormatSignedNumber(twbvNumberOrZero(entry.value)))
    }));
}



const TWBV_ITEM_CREATE_ORDER = ["arma", "armadura", "consumable", "municao", "pericia", "vantagem", "desvantagem", "habilidadeEspecial", "poder", "modificacao"];

const TWBV_ITEM_MAIN_FOLDER_ORDER = [
  { name: "Armas", types: ["arma", "weapon"], color: "#7c4dff" },
  { name: "Armaduras", types: ["armadura"], color: "#2f8f5b" },
  { name: "Consum\u00edveis", types: ["consumable"], color: "#d6a33d" },
  { name: "Muni\u00e7\u00f5es", types: ["municao"], color: "#50b1be" },
  { name: "Per\u00edcias", types: ["pericia"], color: "#9fe8ff" },
  { name: "Vantagens", types: ["vantagem"], color: "#2f79c8" },
  { name: "Desvantagens", types: ["desvantagem"], color: "#c95470" },
  { name: "Habilidade Especial", types: ["habilidadeEspecial"], color: "#7aa05a" },
  { name: "Poderes", types: ["poder"], color: "#6f62d8" },
  { name: "Modifica\u00e7\u00e3o", types: ["modificacao"], color: "#c06f3a" }
];


function twbvApplyItemTypeOrderConfig() {
  const allowed = [...TWBV_ITEM_CREATE_ORDER];
  if (CONFIG?.Item?.typeLabels) {
    for (const type of allowed) {
      CONFIG.Item.typeLabels[type] = TWBV_ITEM_TYPES[type] ?? type;
    }
    CONFIG.Item.typeLabels.weapon = TWBV_ITEM_TYPES.weapon;
  }
}

function twbvApplyActorTypeConfig() {
  if (CONFIG?.Actor?.typeLabels) {
    for (const type of TWBV_ACTOR_CREATE_ORDER) {
      CONFIG.Actor.typeLabels[type] = TWBV_ACTOR_TYPES[type] ?? type;
    }
  }
}

function twbvWithDefaultActorType(data) {
  const next = foundry.utils.deepClone(data ?? {});
  if (!String(next.type ?? "").trim()) next.type = TWBV_ACTOR_DEFAULT_TYPE;
  return next;
}

function twbvGetActorSheetKind(actorOrType) {
  const configured = typeof actorOrType === "string" ? "" : String(actorOrType?.system?.twbvSheetKind ?? "").trim();
  const type = configured || (typeof actorOrType === "string" ? actorOrType : actorOrType?.type);
  if (type === "semi-despertos") return "semi-despertos";
  if (type === "sombras") return "sombras";
  return "despertos";
}

function twbvActorUsesAwakenedDie(actorOrType) {
  return twbvGetActorSheetKind(actorOrType) === "despertos";
}

function twbvGetActorWoundMax(actorOrType) {
  const kind = twbvGetActorSheetKind(actorOrType);
  if (kind === "sombras") return 1;
  if (kind === "semi-despertos") return 3;
  return 5;
}

function twbvPatchActorCreationDefaults() {
  const actorClass = CONFIG?.Actor?.documentClass;
  if (!actorClass || actorClass._twbvCreationDefaultsPatched) return;

  const originalCreateDialog = actorClass.createDialog;
  if (typeof originalCreateDialog === "function") {
    actorClass.createDialog = function(data = {}, options = {}) {
      const nextData = twbvWithDefaultActorType(data);
      const nextOptions = foundry.utils.mergeObject(options, { types: [...TWBV_ACTOR_CREATE_ORDER] }, { overwrite: true, inplace: false });
      return originalCreateDialog.call(this, nextData, nextOptions);
    };
  }

  const originalCreate = actorClass.create;
  if (typeof originalCreate === "function") {
    actorClass.create = function(data = {}, options = {}) {
      const nextData = Array.isArray(data) ? data.map(twbvWithDefaultActorType) : twbvWithDefaultActorType(data);
      return originalCreate.call(this, nextData, options);
    };
  }

  const originalCreateDocuments = actorClass.createDocuments;
  if (typeof originalCreateDocuments === "function") {
    actorClass.createDocuments = function(data = [], options = {}) {
      const nextData = Array.isArray(data) ? data.map(twbvWithDefaultActorType) : [twbvWithDefaultActorType(data)];
      return originalCreateDocuments.call(this, nextData, options);
    };
  }

  actorClass._twbvCreationDefaultsPatched = true;
}

function twbvRegisterActorSheets() {
  try {
    Actors.unregisterSheet("core", ActorSheet);
  } catch (_) {
    // Core sheet may already be unregistered.
  }
  Actors.registerSheet("world-behind-the-veil", TWBVPersonagemSheet, {
    types: ["despertos", "semi-despertos", "sombras", "personagem"],
    makeDefault: true
  });
  console.log("[TWBV] ActorSheet registrada para Despertos/Semi-Despertos/Sombras.");
}




function twbvPatchItemCreateDialog() {
  const itemClass = CONFIG?.Item?.documentClass;
  if (!itemClass || itemClass._twbvCreateDialogPatched) return;
  const originalCreateDialog = itemClass.createDialog;
  if (typeof originalCreateDialog !== "function") return;

  itemClass.createDialog = function(data = {}, options = {}) {
    const supported = Array.from(game?.system?.documentTypes?.Item ?? []);
    const types = TWBV_ITEM_CREATE_ORDER.filter((type) => type !== "poder" && supported.includes(type));
    const nextOptions = foundry.utils.mergeObject(options, { types }, { overwrite: true, inplace: false });
    return originalCreateDialog.call(this, data, nextOptions);
  };

  itemClass._twbvCreateDialogPatched = true;
}

function twbvNormalizeItemCreateTypeSelect(root) {
  const host = root?.[0] ?? root;
  if (!host || typeof host.querySelector !== "function") return;
  const select = host.querySelector('select[name="type"]');
  if (!select) return;

  const optionByValue = new Map(Array.from(select.options ?? []).map((opt) => [String(opt.value ?? ""), opt]));
  const selected = String(select.value ?? "");
  const supported = Array.from(game?.system?.documentTypes?.Item ?? []);

  while (select.firstChild) select.removeChild(select.firstChild);

  for (const type of TWBV_ITEM_CREATE_ORDER) {
    if (type === "poder" && supported.includes("habilidadeEspecial")) {
      const fake = document.createElement("option");
      fake.value = "__twbvPoder";
      fake.textContent = "Poder";
      select.appendChild(fake);
      continue;
    }
    const option = optionByValue.get(type);
    if (option) select.appendChild(option);
  }

  const fallback = select.options[0]?.value ?? "";
  select.value = selected === "poder" ? "__twbvPoder" : (TWBV_ITEM_CREATE_ORDER.includes(selected) || selected === "__twbvPoder" ? selected : fallback);
  const form = select.closest("form");
  if (form && !form._twbvPowerFallbackSubmit) {
    form.addEventListener("submit", () => {
      if (select.value !== "__twbvPoder") return;
      select.value = "habilidadeEspecial";
      const ensureHidden = (name, value) => {
        let input = form.querySelector(`input[type="hidden"][name="${name}"]`);
        if (!input) {
          input = document.createElement("input");
          input.type = "hidden";
          input.name = name;
          form.appendChild(input);
        }
        input.value = value;
      };
      ensureHidden("system.itemKind", "poder");
      ensureHidden("system.category", "poder");
      ensureHidden("system.categoria", "poder");
      const nameInput = form.querySelector('input[name="name"]');
      const name = String(nameInput?.value ?? "").trim();
      if (nameInput && (!name || /^item(?:\s*\(\d+\))?$/i.test(name))) nameInput.value = "Poder";
    }, true);
    form._twbvPowerFallbackSubmit = true;
  }
}

function twbvGetMainItemFolderConfig(type) {
  const itemType = String(type ?? "").trim();
  return TWBV_ITEM_MAIN_FOLDER_ORDER.find((entry) => entry.types.includes(itemType)) ?? null;
}

async function twbvEnsureMainItemFolders() {
  if (!game.user?.isGM) return;
  for (let index = 0; index < TWBV_ITEM_MAIN_FOLDER_ORDER.length; index += 1) {
    const config = TWBV_ITEM_MAIN_FOLDER_ORDER[index];
    let folder = game.folders?.find((f) => f.type === "Item" && f.name === config.name && !f.folder);
    const update = { color: config.color, sort: (index + 1) * 100000 };
    if (!folder) {
      folder = await Folder.create({ name: config.name, type: "Item", ...update });
    } else if (folder.color !== config.color || folder.sort !== update.sort) {
      await folder.update(update);
    }
  }
}

function twbvResolveSupportedItemType(preferredType) {
  const preferred = String(preferredType ?? "equipamento").trim() || "equipamento";
  if (preferred === "poder") return "habilidadeEspecial";
  const aliases = preferred === "arma" ? ["arma", "weapon"] : preferred === "weapon" ? ["arma", "weapon"] : [preferred];
  const supported = Array.from(game?.system?.documentTypes?.Item ?? []);
  if (!supported.length) return aliases[0];
  const supportedAlias = aliases.find((type) => supported.includes(type));
  if (supportedAlias) return supportedAlias;
  return supported.includes("equipamento") ? "equipamento" : supported[0];
}

function twbvGetItemIcon(type) {
  return TWBV_ITEM_ICONS[type] ?? "icons/svg/item-bag.svg";
}

function twbvGetItemDefaultName(type, system = {}) {
  if (String(type ?? "").trim() === "poder" || String(system?.itemKind ?? system?.kind ?? "").trim() === "poder") return "Poder";
  const resolved = twbvResolveSupportedItemType(type);
  const slot = String(system?.equipSlot ?? "").trim();
  if (resolved === "armadura" && slot) return TWBV_ARMOR_SLOT_LABELS[slot] ?? "Armadura";
  if (["arma", "weapon"].includes(resolved) && slot) return TWBV_WEAPON_SLOT_LABELS[slot] ?? "Arma";
  return TWBV_ITEM_TYPES[resolved] ?? "Item";
}

function twbvIsActorItemType(type) {
  return ["weapon", "arma", "armadura", "consumable", "municao", "equipamento", "modificacao", "pericia", "vantagem", "desvantagem", "habilidadeEspecial", "poder"].includes(String(type ?? ""));
}

function twbvIsPowerItemDocument(itemOrData) {
  const type = String(itemOrData?.type ?? "").trim();
  const system = itemOrData?.system ?? {};
  return type === "poder" || (type === "habilidadeEspecial" && String(system?.itemKind ?? system?.kind ?? "").trim() === "poder");
}

function twbvNormalizePowerAreaValue(value) {
  const key = String(value ?? "").trim();
  return TWBV_POWER_AREA_LEGACY_ALIASES[key] ?? (key || "none");
}

function twbvGetPowerAreaPreset(value) {
  const key = twbvNormalizePowerAreaValue(value);
  return TWBV_POWER_AREA_PRESETS.find((preset) => preset.value === key) ?? TWBV_POWER_AREA_PRESETS[0];
}

function twbvGetPowerAreaLabel(value) {
  const preset = twbvGetPowerAreaPreset(value);
  if (preset.value === "none") return "";
  return preset.label;
}

function twbvIsEquipmentItemType(type) {
  return ["weapon", "arma", "armadura", "consumable", "municao", "equipamento", "modificacao"].includes(String(type ?? ""));
}

function twbvNormalizeSlotText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function twbvNormalizeArcaneAbilityName(value) {
  return twbvNormalizeSlotText(value);
}

function twbvGetArcaneAbility(value) {
  const normalized = twbvNormalizeArcaneAbilityName(value);
  return TWBV_ARCANE_ABILITIES.find((ability) => twbvNormalizeArcaneAbilityName(ability.name) === normalized) ?? null;
}

function twbvGetActorSkillForArcaneAbility(actor, abilityName) {
  const ability = twbvGetArcaneAbility(abilityName);
  if (!actor || !ability) return null;
  const expected = twbvNormalizeArcaneAbilityName(ability.name);
  return Array.from(actor.system?.pericias ?? []).find((skill) => {
    const nameMatches = twbvNormalizeArcaneAbilityName(skill?.nome) === expected;
    const die = normalizeAttributeStep(skill?.dado ?? 0);
    return nameMatches && die >= 4;
  }) ?? null;
}

function twbvInferArmorSlot(item) {
  const direct = String(item?.system?.equipSlot ?? "").trim();
  if (TWBV_EQUIPMENT_SLOT_DEFS.some((slot) => slot.key === direct && slot.accepts.includes("armadura"))) return direct;

  const candidates = [
    item?.system?.category,
    item?.system?.categoria,
    item?.folder?.name,
    item?.name
  ].map(twbvNormalizeSlotText);

  const aliasByText = {
    cabeca: "head",
    head: "head",
    peito: "chest",
    chest: "chest",
    tronco: "chest",
    perna: "legs",
    pernas: "legs",
    legs: "legs",
    bota: "boots",
    botas: "boots",
    boots: "boots",
    luva: "gloves",
    luvas: "gloves",
    gloves: "gloves",
    cinto: "belt",
    belt: "belt",
    "anel esq": "ringLeft",
    "anel esquerdo": "ringLeft",
    ringleft: "ringLeft",
    "anel dir": "ringRight",
    "anel direito": "ringRight",
    ringright: "ringRight"
  };

  for (const raw of candidates) {
    const text = raw.includes(":") ? raw.split(":").pop().trim() : raw;
    if (aliasByText[text]) return aliasByText[text];
  }
  return "chest";
}

function twbvGetBodySlotKey(item) {
  const type = String(item?.type ?? "");
  if (type === "armadura") return twbvInferArmorSlot(item);
  if (["arma", "weapon"].includes(type)) {
    const hand = twbvGetWeaponEquippedHand(item);
    if (hand === "off") return "weaponOff";
    return "weaponMain";
  }
  return String(item?.system?.equipSlot ?? "").trim();
}

function twbvGetWeaponHandMode(item) {
  const mode = String(item?.system?.handMode ?? item?.system?.equippedHand ?? "main").trim();
  return ["main", "off", "two"].includes(mode) ? mode : "main";
}

function twbvGetWeaponEquippedHand(item) {
  const equipped = String(item?.system?.equippedHand ?? "").trim();
  if (["main", "off", "two"].includes(equipped)) return equipped;
  return twbvGetWeaponHandMode(item);
}

function twbvGetWeaponBodySlots(item) {
  if (!["arma", "weapon"].includes(String(item?.type ?? ""))) return [];
  const hand = twbvGetWeaponEquippedHand(item);
  if (hand === "two") return ["weaponMain", "weaponOff"];
  return [hand === "off" ? "weaponOff" : "weaponMain"];
}

function twbvGetWeaponHandLabel(item) {
  return TWBV_WEAPON_HAND_LABELS[twbvGetWeaponEquippedHand(item)] ?? TWBV_WEAPON_HAND_LABELS.main;
}

async function twbvUnequipWeaponOccupants(actor, item, hand) {
  if (!(actor instanceof Actor) || !item) return;
  const targetSlots = hand === "two" ? ["weaponMain", "weaponOff"] : [hand === "off" ? "weaponOff" : "weaponMain"];
  for (const candidate of actor.items) {
    if (candidate.id === item.id || !["arma", "weapon"].includes(candidate.type)) continue;
    const equipped = Boolean(candidate.system?.equipped ?? Number(candidate.system?.equipStatus ?? 0) === 1);
    if (!equipped) continue;
    if (twbvGetWeaponBodySlots(candidate).some((slot) => targetSlots.includes(slot))) {
      await candidate.update({"system.equipped": false, "system.equipStatus": 0});
    }
  }
}

async function twbvChooseWeaponHand(item) {
  const current = twbvGetWeaponHandMode(item);
  const content = `<form class="twbv-hand-dialog">
    <label><input type="radio" name="hand" value="main" ${current === "main" ? "checked" : ""} /><span>Mão Principal</span></label>
    <label><input type="radio" name="hand" value="off" ${current === "off" ? "checked" : ""} /><span>Mão Inábil</span></label>
    <label><input type="radio" name="hand" value="two" ${current === "two" ? "checked" : ""} /><span>2 Mãos</span></label>
  </form>`;
  let settled = false;
  return new Promise((resolve) => {
    new Dialog({
      title: `Equipar ${item.name}`,
      content,
      buttons: {
        equip: {
          label: "Equipar",
          callback: (html) => {
            settled = true;
            const root = resolveDialogRoot(html);
            resolve(String(root?.querySelector('input[name="hand"]:checked')?.value ?? "main"));
          }
        },
        cancel: {
          label: "Cancelar",
          callback: () => {
            settled = true;
            resolve(null);
          }
        }
      },
      close: () => {
        if (!settled) resolve(null);
      },
      default: "equip"
    }).render(true);
  });
}

function twbvGetBodySlotPositionStyle(actor, slotKey) {
  const saved = actor?.getFlag?.("world-behind-the-veil", "bodySlotPositions") ?? {};
  const positions = { ...TWBV_DEFAULT_BODY_SLOT_POSITIONS, ...(saved && typeof saved === "object" ? saved : {}) };
  const pos = positions?.[slotKey];
  const left = Number(pos?.left);
  const top = Number(pos?.top);
  if (!Number.isFinite(left) || !Number.isFinite(top)) return "";
  return `left:${Math.clamp(left, 0, 92)}%; top:${Math.clamp(top, 0, 92)}%; right:auto;`;
}

function twbvNormalizeBodySlotPositions(positions) {
  const source = { ...TWBV_DEFAULT_BODY_SLOT_POSITIONS, ...(positions && typeof positions === "object" ? positions : {}) };
  const normalized = {};
  for (const slot of TWBV_EQUIPMENT_SLOT_DEFS) {
    const pos = source[slot.key];
    const left = Number(pos?.left);
    const top = Number(pos?.top);
    if (!Number.isFinite(left) || !Number.isFinite(top)) continue;
    normalized[slot.key] = {
      left: Math.round(Math.clamp(left, 0, 92) * 10) / 10,
      top: Math.round(Math.clamp(top, 0, 92) * 10) / 10
    };
  }
  return normalized;
}

async function twbvSetBodyLayout(actor, { positions, lines } = {}) {
  const namespace = foundry.utils.deepClone(actor.flags?.["world-behind-the-veil"] ?? {});
  namespace.bodySlotPositions = positions === undefined
    ? twbvNormalizeBodySlotPositions(actor.getFlag("world-behind-the-veil", "bodySlotPositions"))
    : twbvNormalizeBodySlotPositions(positions);
  namespace.bodyMapLines = lines === undefined
    ? twbvNormalizeBodyLines(actor.getFlag("world-behind-the-veil", "bodyMapLines"))
    : twbvNormalizeBodyLines(lines);
  await actor.update({ "flags.world-behind-the-veil": namespace }, { recursive: false });
}

async function twbvSetBodySlotPositions(actor, positions) {
  await twbvSetBodyLayout(actor, { positions });
}

function twbvGetBodyLineStyle(line) {
  const left = Math.clamp(Number(line?.left ?? 45), 0, 98);
  const top = Math.clamp(Number(line?.top ?? 45), 0, 98);
  const width = Math.clamp(Number(line?.width ?? 16), 3, 80);
  const angle = Number(line?.angle ?? 0);
  return `left:${left}%; top:${top}%; width:${width}%; transform:rotate(${Number.isFinite(angle) ? angle : 0}deg);`;
}

function twbvNormalizeBodyLines(lines) {
  const source = Array.isArray(lines) ? lines : TWBV_DEFAULT_BODY_LINES;
  return source.map((line) => ({
    key: String(line?.key ?? line?.lineKey ?? line?.id ?? foundry.utils.randomID()),
    left: Math.clamp(Number(line?.left ?? 45), 0, 98),
    top: Math.clamp(Number(line?.top ?? 45), 0, 98),
    width: Math.clamp(Number(line?.width ?? 16), 3, 80),
    angle: Number.isFinite(Number(line?.angle)) ? Number(line.angle) : 0
  }));
}

async function twbvSetBodyLines(actor, lines) {
  await twbvSetBodyLayout(actor, { lines });
}

function twbvPublicItemOwnership(existingOwnership = {}) {
  const observer = globalThis.CONST?.DOCUMENT_OWNERSHIP_LEVELS?.OBSERVER ?? 2;
  const next = foundry.utils.deepClone(existingOwnership ?? {});
  next.default = Math.max(Number(next.default ?? 0), observer);
  for (const user of game?.users ?? []) {
    if (user?.isGM || !user?.id) continue;
    next[user.id] = Math.max(Number(next[user.id] ?? next.default ?? 0), observer);
  }
  return next;
}

function twbvIsSidebarItem(item) {
  return Boolean(item && item.documentName === "Item" && !item.isEmbedded && !item.parent && !item.pack && !item.compendium);
}

async function twbvMakeSidebarItemsVisibleToPlayers() {
  if (!game.user?.isGM) return;
  const updates = [];
  for (const item of game.items ?? []) {
    if (!twbvIsSidebarItem(item)) continue;
    const ownership = twbvPublicItemOwnership(item.ownership ?? {});
    if (JSON.stringify(ownership) === JSON.stringify(item.ownership ?? {})) continue;
    updates.push({ _id: item.id, ownership });
  }
  if (!updates.length) return;
  await Item.updateDocuments(updates);
  console.log(`[TWBV] ${updates.length} item(ns) da sidebar foram marcados como visíveis para jogadores.`);
}

function twbvSanitizeItemDataForActor(source) {
  const data = foundry.utils.deepClone(source ?? {});
  delete data._id;
  delete data.id;
  delete data.folder;
  delete data.sort;
  delete data.ownership;
  if (data.flags?.core) delete data.flags.core;
  data.type = twbvResolveSupportedItemType(data.type);
  data.name = String(data.name ?? twbvGetItemDefaultName(data.type, data.system)).trim() || twbvGetItemDefaultName(data.type, data.system);
  data.img = data.img || twbvGetItemIcon(data.type);
  data.system = foundry.utils.mergeObject(twbvGetDefaultItemSystem(data.type), data.system ?? {}, { inplace: false, overwrite: true });
  return data;
}

async function twbvResolveDroppedItemData(dropData) {
  if (!dropData || dropData.type !== "Item") return null;
  const dropped = await Item.implementation.fromDropData(dropData);
  if (!dropped) return null;
  const source = typeof dropped.toObject === "function" ? dropped.toObject() : dropped;
  const type = String(source.type ?? "").trim();
  if (!twbvIsActorItemType(type)) return null;
  return twbvSanitizeItemDataForActor(source);
}

function twbvSkillAttributeKey(value) {
  const key = String(value ?? "").trim().toLowerCase();
  return SKILL_ATTRIBUTES.some((attr) => attr.key === key) ? key : "forca";
}

function twbvFixCorruptedPortugueseText(value) {
  let text = String(value ?? "");
  const replacements = [
    ["Intui??o", "Intui\u00e7\u00e3o"], ["intui??o", "intui\u00e7\u00e3o"],
    ["Intui?ao", "Intui\u00e7\u00e3o"], ["intui?ao", "intui\u00e7\u00e3o"],
    ["Intui?o", "Intui\u00e7\u00e3o"], ["intui?o", "intui\u00e7\u00e3o"],
    ["Intelig?ncia", "Intelig\u00eancia"], ["intelig?ncia", "intelig\u00eancia"],
    ["Constitui??o", "Constitui\u00e7\u00e3o"], ["constitui??o", "constitui\u00e7\u00e3o"],
    ["Influ?ncia", "Influ\u00eancia"], ["influ?ncia", "influ\u00eancia"],
    ["For?a", "For\u00e7a"], ["for?a", "for\u00e7a"],
    ["Per?cia", "Per\u00edcia"], ["per?cia", "per\u00edcia"],
    ["Descri??o", "Descri\u00e7\u00e3o"], ["descri??o", "descri\u00e7\u00e3o"],
    ["B?nus", "B\u00f4nus"], ["b?nus", "b\u00f4nus"],
    ["Comp?ndio", "Comp\u00eandio"], ["comp?ndio", "comp\u00eandio"],
    ["V?u", "V\u00e9u"], ["v?u", "v\u00e9u"]
  ];
  for (const [from, to] of replacements) text = text.replaceAll(from, to);
  return text;
}

function twbvBuildSkillFromPericiaItem(itemData = {}) {
  const system = itemData.system ?? {};
  const dado = SKILL_DICE.includes(Number(system.dado)) ? Number(system.dado) : 4;
  const bonus = Number.isFinite(Number(system.bonus)) ? Number(system.bonus) : 0;
  const description = twbvFixCorruptedPortugueseText(system.descricao ?? system.description ?? "").trim();
  const nome = twbvFixCorruptedPortugueseText(itemData.name ?? system.nome ?? "Per\u00edcia").trim() || "Per\u00edcia";
  return {
    nome,
    atributo: twbvSkillAttributeKey(system.atributo ?? system.attribute),
    dado: dado >= 4 ? dado : 4,
    bonus,
    locked: false,
    img: twbvGetSkillIconPath({ ...itemData, ...system, nome }),
    descricao: description,
    source: twbvFixCorruptedPortugueseText(system.source ?? system.fonte ?? "").trim()
  };
}

function twbvEffectModeOptions() {
  return [
    { value: CONST?.ACTIVE_EFFECT_MODES?.ADD ?? 2, label: "Somar" },
    { value: CONST?.ACTIVE_EFFECT_MODES?.OVERRIDE ?? 5, label: "Sobrescrever" },
    { value: CONST?.ACTIVE_EFFECT_MODES?.UPGRADE ?? 4, label: "Melhorar" },
    { value: CONST?.ACTIVE_EFFECT_MODES?.DOWNGRADE ?? 3, label: "Piorar" },
    { value: CONST?.ACTIVE_EFFECT_MODES?.MULTIPLY ?? 1, label: "Multiplicar" }
  ];
}

function twbvPrepareItemSheetEffects(item) {
  const effects = Array.from(item?.effects ?? []);
  const modeAdd = CONST?.ACTIVE_EFFECT_MODES?.ADD ?? 2;
  const prepared = effects.map((effect) => {
    const changes = Array.from(effect.changes ?? []).map((change) => ({
      key: String(change.key ?? ""),
      label: twbvGetActiveEffectTargetLabel(item?.actor ?? null, change.key),
      mode: Number(change.mode ?? modeAdd),
      modeLabel: twbvGetActiveEffectModeLabel(change.mode ?? modeAdd),
      value: String(change.value ?? "")
    }));
    const duration = effect.duration ?? {};
    const durationLabel = duration.rounds
      ? `${duration.rounds} rodada${Number(duration.rounds) === 1 ? "" : "s"}`
      : duration.seconds
        ? `${duration.seconds}s`
        : "";
    return {
      id: effect.id,
      uuid: effect.uuid,
      name: effect.name ?? effect.label ?? "Efeito",
      img: effect.img || "icons/svg/aura.svg",
      disabled: Boolean(effect.disabled),
      temporary: Boolean(duration.rounds || duration.seconds || duration.turns),
      durationLabel,
      changes,
      description: String(effect.description ?? effect.system?.description ?? "").trim()
    };
  });
  return {
    temporary: prepared.filter((effect) => !effect.disabled && effect.temporary),
    permanent: prepared.filter((effect) => !effect.disabled && !effect.temporary),
    inactive: prepared.filter((effect) => effect.disabled)
  };
}

function twbvActorHasSkill(actor, skillName) {
  const normalized = twbvNormalizeSlotText(skillName);
  return Array.from(actor?.system?.pericias ?? []).some((skill) => twbvNormalizeSlotText(skill?.nome) === normalized);
}

function twbvConfirmDuplicateSkill(actor, skill) {
  return new Promise((resolve) => {
    new Dialog({
      title: `Per\u00edcia repetida: ${skill.nome}`,
      content: `
        <section class="twbv-skill-duplicate">
          <h3>${twbvEscapeHtml(skill.nome)} j&aacute; existe na ficha.</h3>
          <p>Deseja puxar para a ficha assim mesmo?</p>
        </section>`,
      buttons: {
        accept: {
          icon: '<i class="fas fa-check"></i>',
          label: "Aceitar",
          callback: () => resolve(true)
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancelar",
          callback: () => resolve(false)
        }
      },
      default: "cancel",
      close: () => resolve(false)
    }, {
      classes: ["wbtv-add-skill-dialog", "twbv-skill-duplicate-dialog"],
      width: 430,
      height: "auto",
      resizable: false
    }).render(true);
  });
}

async function twbvAddPericiaItemToActor(actor, itemData = {}) {
  if (!actor) return false;
  const skill = twbvBuildSkillFromPericiaItem(itemData);
  if (twbvActorHasSkill(actor, skill.nome)) {
    const accepted = await twbvConfirmDuplicateSkill(actor, skill);
    if (!accepted) return false;
  }
  const pericias = foundry.utils.deepClone(actor.system?.pericias ?? []);
  pericias.push(skill);
  await actor.update({ "system.pericias": pericias });
  ui.notifications?.info(`${skill.nome} adicionada como d${skill.dado} na ficha de ${actor.name}.`);
  return true;
}

async function twbvSendSkillDescriptionToChat(actor, skill = {}) {
  const description = String(skill?.descricao ?? skill?.description ?? "").trim();
  if (!description) return ui.notifications?.warn("Esta per\u00edcia n\u00e3o tem descri\u00e7\u00e3o cadastrada.");
  const attr = getSkillAttributeMeta(String(skill?.atributo ?? "forca").toLowerCase());
  const html = description.split(/\n{2,}/)
    .map((paragraph) => `<p>${twbvEscapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `
      <section class="twbv-skill-description-chat-card">
        <header>
          <i class="fas fa-book-open"></i>
          <div>
            <h3>${twbvEscapeHtml(skill?.nome ?? "Per\u00edcia")}</h3>
            <span>${twbvEscapeHtml(attr?.label ?? "")}</span>
          </div>
        </header>
        <div>${html}</div>
      </section>`
  });
}

function twbvGetSkillLevelState(dado = 4, bonus = 0) {
  const skillDie = SKILL_DICE.includes(Number(dado)) ? Number(dado) : 4;
  const totalBonus = Number.isFinite(Number(bonus)) ? Number(bonus) : 0;
  const sameDieLevels = SKILL_LEVELS.filter((level) => level.dado === skillDie);
  const baseLevel = (sameDieLevels.length ? sameDieLevels : SKILL_LEVELS).reduce((best, level) => {
    const bestDistance = Math.abs(best.bonus - totalBonus);
    const currentDistance = Math.abs(level.bonus - totalBonus);
    return currentDistance < bestDistance ? level : best;
  }, (sameDieLevels[0] ?? SKILL_LEVELS[0]));
  const baseLevelIndex = Math.max(0, SKILL_LEVELS.findIndex((level) => level.dado === baseLevel.dado && level.bonus === baseLevel.bonus));
  return {
    skillDie,
    totalBonus,
    baseLevel,
    baseLevelIndex,
    extraBonus: totalBonus - baseLevel.bonus
  };
}

function twbvBuildSkillDialogContent(skill = {}, options = {}) {
  const editable = options.editable !== false;
  const showImport = Boolean(options.showImport);
  const state = twbvGetSkillLevelState(skill.dado, skill.bonus);
  const attrKey = twbvSkillAttributeKey(skill.atributo);
  const description = String(skill.descricao ?? skill.description ?? "").trim();
  const source = String(skill.source ?? skill.fonte ?? "").trim();
  const iconPath = twbvGetSkillIconPath(skill);
  const dieOptions = SKILL_LEVELS.map((level, index) => `<option value="${index}" data-die="${level.dado}" data-bonus="${level.bonus}" ${index === state.baseLevelIndex ? "selected" : ""}>${buildDieLabel(level.dado, level.bonus)}</option>`).join("");
  const attrOptions = SKILL_ATTRIBUTES.map((attr) => `<option value="${attr.key}" ${attr.key === attrKey ? "selected" : ""}>${attr.label}</option>`).join("");
  const readonly = editable ? "" : " disabled";
  const descriptionHtml = description
    ? description.split(/\n{2,}/).map((paragraph) => `<p>${twbvEscapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`).join("")
    : `<p class="twbv-skill-description-empty">Sem descri&ccedil;&atilde;o cadastrada.</p>`;
  return `<form class="twbv-skill-dialog-form twbv-skill-popup" data-editable="${editable ? "1" : "0"}">
    <section class="twbv-skill-icon-editor">
      <div class="twbv-skill-icon-preview">
        <img src="${escapeHtmlAttr(iconPath)}" alt="Ícone da perícia" />
      </div>
      <label>Ícone da perícia<input type="text" name="img" value="${escapeHtmlAttr(iconPath)}" placeholder="systems/world-behind-the-veil/assets/skills/..."${readonly} /></label>
    </section>
    <nav class="twbv-skill-popup-tabs" aria-label="Abas da per&iacute;cia">
      <button type="button" class="twbv-skill-popup-tab is-active" data-tab="dados"><i class="fas fa-dice-d20"></i> Dados</button>
      <button type="button" class="twbv-skill-popup-tab" data-tab="descricao"><i class="fas fa-book-open"></i> Descri&ccedil;&atilde;o</button>
    </nav>
    <section class="twbv-skill-popup-pane is-active" data-tab="dados">
      <label>Nome da per&iacute;cia<input type="text" name="nome" value="${twbvEscapeHtml(String(skill.nome ?? ""))}" placeholder="Ex.: Atletismo"${readonly} autofocus /></label>
      <label>Atributo associado<select name="atributo"${readonly}>${attrOptions}</select></label>
      <div class="twbv-add-skill-row">
        <label>Dado base<select name="skillDie"${readonly}>${dieOptions}</select></label>
        <label>B&ocirc;nus extra<input type="number" name="bonus" value="${state.extraBonus}" min="-99" max="99" step="1"${readonly} /></label>
      </div>
      <div class="twbv-add-skill-bottom-row">
        <label>N&iacute;vel de per&iacute;cia<input type="text" name="skillLevelLabel" class="twbv-skill-level-chip ${state.baseLevel.cssClass}" value="${state.baseLevel.rank}" readonly /></label>
        <div class="twbv-skill-preview"><span>Pr&eacute;-visualiza&ccedil;&atilde;o</span><strong>${buildDieLabel(state.skillDie, state.totalBonus)}</strong></div>
      </div>
      ${source ? `<p class="twbv-skill-popup-source"><i class="fas fa-scroll"></i> ${twbvEscapeHtml(source)}</p>` : ""}
    </section>
    <section class="twbv-skill-popup-pane" data-tab="descricao">
      <div class="twbv-skill-description-toolbar">
        <strong><i class="fas fa-book-open"></i> Descri&ccedil;&atilde;o</strong>
        <button type="button" class="twbv-skill-description-chat" title="Enviar descri&ccedil;&atilde;o para o chat"><i class="fas fa-comment"></i></button>
      </div>
      ${editable ? `<textarea name="descricao" rows="9" placeholder="Descreva esta per&iacute;cia...">${twbvEscapeHtml(description)}</textarea>` : `<div class="twbv-skill-description-text">${descriptionHtml}</div>`}
    </section>
    ${showImport ? `<input type="hidden" name="twbvImportFromCompendium" value="1" />` : ""}
  </form>`;
}

function twbvActivateSkillDialog(root, actor, skill = {}) {
  const form = root?.querySelector?.(".twbv-skill-dialog-form") ?? root?.closest?.(".twbv-skill-dialog-form");
  if (!form) return;
  const switchTab = (tab) => {
    form.querySelectorAll(".twbv-skill-popup-tab").forEach((button) => button.classList.toggle("is-active", button.dataset.tab === tab));
    form.querySelectorAll(".twbv-skill-popup-pane").forEach((pane) => pane.classList.toggle("is-active", pane.dataset.tab === tab));
  };
  form.querySelectorAll(".twbv-skill-popup-tab").forEach((button) => button.addEventListener("click", () => switchTab(button.dataset.tab ?? "dados")));

  const skillLevelLabelEl = form.querySelector('input[name="skillLevelLabel"]');
  const dieEl = form.querySelector('select[name="skillDie"]');
  const bonusEl = form.querySelector('input[name="bonus"]');
  const previewEl = form.querySelector(".twbv-skill-preview strong");
  const attributeEl = form.querySelector('select[name="atributo"]');
  const iconInput = form.querySelector('input[name="img"]');
  const iconPreview = form.querySelector(".twbv-skill-icon-preview img");

  const syncAttributeTint = () => {
    if (!attributeEl) return;
    const attrKey = String(attributeEl.value ?? "forca").toLowerCase();
    attributeEl.classList.remove("twbv-attr-forca", "twbv-attr-destreza", "twbv-attr-constituicao", "twbv-attr-inteligencia", "twbv-attr-influencia", "twbv-attr-intuicao", "twbv-attr-vontade");
    attributeEl.classList.add(`twbv-attr-${attrKey}`);
  };
  const syncAll = () => {
    const selectedLevel = SKILL_LEVELS[Number(dieEl?.value)] ?? SKILL_LEVELS[0];
    const extraBonus = Number.isFinite(Number(bonusEl?.value)) ? Number(bonusEl.value) : 0;
    const finalBonus = selectedLevel.bonus + extraBonus;
    if (previewEl) previewEl.textContent = buildDieLabel(selectedLevel.dado, finalBonus);
    if (skillLevelLabelEl) {
      skillLevelLabelEl.value = selectedLevel.rank;
      skillLevelLabelEl.classList.remove("rank-novato", "rank-treinado", "rank-experiente", "rank-especialista", "rank-mestre");
      skillLevelLabelEl.classList.add(selectedLevel.cssClass);
    }
  };
  dieEl?.addEventListener("change", syncAll);
  bonusEl?.addEventListener("input", syncAll);
  bonusEl?.addEventListener("change", syncAll);
  attributeEl?.addEventListener("change", syncAttributeTint);
  iconInput?.addEventListener("input", () => {
    if (iconPreview) iconPreview.src = String(iconInput.value ?? "").trim() || TWBV_DEFAULT_SKILL_ICON;
  });
  form.querySelector(".twbv-skill-description-chat")?.addEventListener("click", async (event) => {
    event.preventDefault();
    const current = twbvReadSkillDialogForm(root, skill);
    await twbvSendSkillDescriptionToChat(actor, current);
  });
  syncAttributeTint();
  syncAll();
}

function twbvReadSkillDialogForm(root, fallback = {}) {
  const selectedLevel = SKILL_LEVELS[Number(root?.querySelector('select[name="skillDie"]')?.value ?? 0)] ?? SKILL_LEVELS[0];
  const rawBonusInput = Number(root?.querySelector('input[name="bonus"]')?.value ?? 0);
  const bonusInput = Number.isFinite(rawBonusInput) ? rawBonusInput : 0;
  return {
    nome: String(root?.querySelector('input[name="nome"]')?.value ?? fallback.nome ?? "Per\u00edcia").trim() || String(fallback.nome ?? "Per\u00edcia").trim() || "Per\u00edcia",
    atributo: twbvSkillAttributeKey(root?.querySelector('select[name="atributo"]')?.value ?? fallback.atributo),
    dado: selectedLevel.dado,
    bonus: selectedLevel.bonus + bonusInput,
    locked: Boolean(fallback.locked),
    img: String(root?.querySelector('input[name="img"]')?.value ?? fallback.img ?? fallback.icone ?? fallback.icon ?? TWBV_DEFAULT_SKILL_ICON).trim() || TWBV_DEFAULT_SKILL_ICON,
    descricao: String(root?.querySelector('textarea[name="descricao"]')?.value ?? fallback.descricao ?? fallback.description ?? "").trim(),
    source: String(fallback.source ?? fallback.fonte ?? "").trim()
  };
}

async function twbvFetchLocalCompendiumSeed(path, fallbackLabel = "comp\u00eandio") {
  try {
    const response = await fetch(`${path}?v=${encodeURIComponent(TWBV_LOCAL_BUILD)}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const seed = await response.json();
    return Array.isArray(seed) ? seed : [];
  } catch (error) {
    console.warn(`[TWBV] N\u00e3o foi poss\u00edvel carregar o seed local de ${fallbackLabel}.`, error);
    return [];
  }
}

async function twbvGetOfficialSkillDocuments() {
  const pack = game.packs?.get("world-behind-the-veil.pericias");
  if (pack) {
    const index = await pack.getIndex();
    const docs = await Promise.all(Array.from(index ?? []).map((entry) => pack.getDocument(entry._id)));
    if (docs.filter(Boolean).length) return docs;
  }
  return twbvFetchLocalCompendiumSeed("systems/world-behind-the-veil/packs/pericias.json", "per\u00edcias");
}

async function twbvOpenSkillCompendiumBrowser(actor) {
  const docs = (await twbvGetOfficialSkillDocuments()).filter(Boolean).sort((a, b) => {
    const nameA = String(a?.name ?? "").trim();
    const nameB = String(b?.name ?? "").trim();
    return nameA.localeCompare(nameB, "pt-BR", { sensitivity: "base" });
  });
  const rows = docs.map((doc, index) => {
    const skill = twbvBuildSkillFromPericiaItem(typeof doc.toObject === "function" ? doc.toObject() : doc);
    const attr = getSkillAttributeMeta(skill.atributo);
    return `<article class="twbv-skill-compendium-card" data-index="${index}">
      <button type="button" class="twbv-skill-compendium-main" data-action="details" data-index="${index}">
        <img src="${twbvEscapeHtml(skill.img || TWBV_DEFAULT_SKILL_ICON)}" alt="" />
        <span><strong>${twbvEscapeHtml(skill.nome)}</strong><small>${twbvEscapeHtml(attr.label)} &middot; ${buildDieLabel(skill.dado, skill.bonus)}</small></span>
      </button>
      <button type="button" class="twbv-skill-compendium-add" data-action="add" data-index="${index}" title="Adicionar &agrave; ficha"><i class="fas fa-plus"></i></button>
    </article>`;
  }).join("");
  new Dialog({
    title: "Comp\u00eandio de Per\u00edcias",
    content: `<section class="twbv-skill-compendium-browser">
      <header><i class="fas fa-book-open"></i><span>${twbvEscapeHtml(actor?.name ?? "Ficha")}</span></header>
      <div class="twbv-skill-compendium-search"><i class="fas fa-search"></i><input type="search" placeholder="Procurar per&iacute;cias" /></div>
      <div class="twbv-skill-compendium-list">${rows || `<p class="twbv-skills-empty">Nenhuma per&iacute;cia encontrada.</p>`}</div>
    </section>`,
    classes: ["wbtv-add-skill-dialog", "twbv-skill-compendium-dialog"],
    buttons: { close: { label: "Fechar" } },
    render: (dialog, html) => {
      const root = resolveDialogRoot(html ?? dialog);
      applyDialogWindowClass(root ?? dialog, "wbtv-add-skill-dialog");
      applyDialogWindowClass(root ?? dialog, "twbv-skill-compendium-dialog");
      const input = root?.querySelector?.('input[type="search"]');
      input?.addEventListener("input", () => {
        const term = twbvNormalizeSlotText(input.value);
        root.querySelectorAll(".twbv-skill-compendium-card").forEach((card) => {
          card.hidden = term && !twbvNormalizeSlotText(card.textContent).includes(term);
        });
      });
      root?.querySelectorAll?.("[data-action]").forEach((button) => {
        button.addEventListener("click", async (event) => {
          event.preventDefault();
          const doc = docs[Number(button.dataset.index ?? -1)];
          if (!doc) return;
          const source = typeof doc.toObject === "function" ? doc.toObject() : doc;
          if (button.dataset.action === "add") {
            await twbvAddPericiaItemToActor(actor, source);
            return;
          }
          const skill = twbvBuildSkillFromPericiaItem(source);
          new Dialog({
            title: skill.nome,
            content: twbvBuildSkillDialogContent(skill, { editable: false, showImport: true }),
            classes: ["wbtv-add-skill-dialog", "wbtv-skill-config-dialog"],
            buttons: {
              add: { icon: '<i class="fas fa-plus"></i>', label: "Adicionar \u00e0 ficha", callback: async () => twbvAddPericiaItemToActor(actor, source) },
              close: { label: "Fechar" }
            },
            render: (innerDialog, innerHtml) => {
              const innerRoot = resolveDialogRoot(innerHtml ?? innerDialog);
              applyDialogWindowClass(innerRoot ?? innerDialog, "wbtv-add-skill-dialog");
              applyDialogWindowClass(innerRoot ?? innerDialog, "wbtv-skill-config-dialog");
              twbvActivateSkillDialog(innerRoot, actor, skill);
            },
            default: "add"
          }, { width: 640, height: "auto", resizable: false }).render(true);
        });
      });
    }
  }, { width: 640, height: 680, resizable: true }).render(true);
}

async function twbvGetOfficialDisadvantageDocuments() {
  const pack = game.packs?.get("world-behind-the-veil.desvantagens");
  if (pack) {
    const index = await pack.getIndex();
    const docs = await Promise.all(Array.from(index ?? []).map((entry) => pack.getDocument(entry._id)));
    if (docs.filter(Boolean).length) return docs;
  }
  return twbvFetchLocalCompendiumSeed("systems/world-behind-the-veil/packs/desvantagens.json", "desvantagens");
}

function twbvGetDisadvantageCategory(itemData = {}) {
  return String(itemData?.system?.category ?? itemData?.system?.categoria ?? itemData?.flags?.["world-behind-the-veil"]?.category ?? "F\u00edsicas").trim() || "F\u00edsicas";
}

async function twbvAddDisadvantageItemToActor(actor, itemData = {}) {
  if (!actor) return false;
  const data = twbvSanitizeItemDataForActor(itemData);
  data.type = "desvantagem";
  data.system = foundry.utils.mergeObject(twbvGetDefaultItemSystem("desvantagem"), data.system ?? {}, { inplace: false, overwrite: true });
  const created = await actor.createEmbeddedDocuments("Item", [data]);
  if (created?.[0]) ui.notifications?.info(`${created[0].name} adicionada \u00e0 ficha.`);
  return Boolean(created?.[0]);
}

async function twbvOpenDisadvantageCompendiumBrowser(actor) {
  const docs = (await twbvGetOfficialDisadvantageDocuments()).filter(Boolean).sort((a, b) => {
    const catA = twbvGetDisadvantageCategory(a);
    const catB = twbvGetDisadvantageCategory(b);
    const catCompare = catA.localeCompare(catB, "pt-BR", { sensitivity: "base" });
    if (catCompare) return catCompare;
    return String(a?.name ?? "").localeCompare(String(b?.name ?? ""), "pt-BR", { sensitivity: "base" });
  });
  const categories = Array.from(new Set(docs.map((doc) => twbvGetDisadvantageCategory(doc)))).sort((a, b) => {
    if (a === "F\u00edsicas") return -1;
    if (b === "F\u00edsicas") return 1;
    return a.localeCompare(b, "pt-BR", { sensitivity: "base" });
  });
  const activeCategory = categories[0] ?? "F\u00edsicas";
  const rows = docs.map((doc, index) => {
    const source = typeof doc.toObject === "function" ? doc.toObject() : doc;
    const category = twbvGetDisadvantageCategory(source);
    const severity = String(source?.system?.severity ?? "").trim();
    const description = String(source?.system?.description ?? "").trim();
    return `<article class="twbv-skill-compendium-card twbv-disadvantage-compendium-card" data-index="${index}" data-category="${escapeHtmlAttr(category)}">
      <button type="button" class="twbv-skill-compendium-main" data-action="details" data-index="${index}">
        <img src="${twbvEscapeHtml(source.img || "icons/svg/downgrade.svg")}" alt="" />
        <span><strong>${twbvEscapeHtml(source.name)}</strong><small>${twbvEscapeHtml(category)}${severity ? ` &middot; ${twbvEscapeHtml(severity)}` : ""}</small>${description ? `<em>${twbvEscapeHtml(description.split("\n")[0]).slice(0, 150)}</em>` : ""}</span>
      </button>
      <button type="button" class="twbv-skill-compendium-add" data-action="add" data-index="${index}" title="Adicionar &agrave; ficha"><i class="fas fa-plus"></i></button>
    </article>`;
  }).join("");
  const tabs = categories.map((category) => `<button type="button" class="twbv-disadvantage-compendium-tab ${category === activeCategory ? "is-active" : ""}" data-category="${escapeHtmlAttr(category)}">${twbvEscapeHtml(category)}</button>`).join("");
  new Dialog({
    title: "Comp\u00eandio de Desvantagens",
    content: `<section class="twbv-skill-compendium-browser twbv-disadvantage-compendium-browser">
      <header><i class="fas fa-book-open"></i><span>${twbvEscapeHtml(actor?.name ?? "Ficha")}</span></header>
      <nav class="twbv-disadvantage-compendium-tabs">${tabs}</nav>
      <div class="twbv-skill-compendium-search"><i class="fas fa-search"></i><input type="search" placeholder="Procurar desvantagens" /></div>
      <div class="twbv-skill-compendium-list">${rows || `<p class="twbv-skills-empty">Nenhuma desvantagem encontrada.</p>`}</div>
    </section>`,
    classes: ["wbtv-add-skill-dialog", "twbv-skill-compendium-dialog", "twbv-disadvantage-compendium-dialog"],
    buttons: { close: { label: "Fechar" } },
    render: (dialog, html) => {
      const root = resolveDialogRoot(html ?? dialog);
      applyDialogWindowClass(root ?? dialog, "wbtv-add-skill-dialog");
      applyDialogWindowClass(root ?? dialog, "twbv-skill-compendium-dialog");
      applyDialogWindowClass(root ?? dialog, "twbv-disadvantage-compendium-dialog");
      const input = root?.querySelector?.('input[type="search"]');
      let selectedCategory = activeCategory;
      const applyFilters = () => {
        const term = twbvNormalizeSlotText(input?.value ?? "");
        root.querySelectorAll(".twbv-disadvantage-compendium-card").forEach((card) => {
          const categoryMatch = String(card.dataset.category ?? "") === selectedCategory;
          const termMatch = !term || twbvNormalizeSlotText(card.textContent).includes(term);
          card.hidden = !categoryMatch || !termMatch;
        });
      };
      root?.querySelectorAll?.(".twbv-disadvantage-compendium-tab").forEach((tab) => {
        tab.addEventListener("click", (event) => {
          event.preventDefault();
          selectedCategory = String(tab.dataset.category ?? activeCategory);
          root.querySelectorAll(".twbv-disadvantage-compendium-tab").forEach((entry) => entry.classList.toggle("is-active", entry === tab));
          applyFilters();
        });
      });
      input?.addEventListener("input", applyFilters);
      applyFilters();
      root?.querySelectorAll?.("[data-action]").forEach((button) => {
        button.addEventListener("click", async (event) => {
          event.preventDefault();
          const doc = docs[Number(button.dataset.index ?? -1)];
          if (!doc) return;
          const source = typeof doc.toObject === "function" ? doc.toObject() : doc;
          if (button.dataset.action === "add") {
            await twbvAddDisadvantageItemToActor(actor, source);
            return;
          }
          const description = String(source?.system?.description ?? "").trim();
          new Dialog({
            title: source.name,
            content: `<section class="twbv-disadvantage-detail"><header><img src="${escapeHtmlAttr(source.img || "icons/svg/downgrade.svg")}" alt="" /><div><h3>${twbvEscapeHtml(source.name)}</h3><span>${twbvEscapeHtml(twbvGetDisadvantageCategory(source))}${source.system?.severity ? ` &middot; ${twbvEscapeHtml(source.system.severity)}` : ""}</span></div></header><div class="twbv-skill-description-text">${description ? description.split(/\n{1,}/).map((paragraph) => `<p>${twbvEscapeHtml(paragraph)}</p>`).join("") : "<p>Sem descri&ccedil;&atilde;o.</p>"}</div></section>`,
            classes: ["wbtv-add-skill-dialog", "twbv-disadvantage-detail-dialog"],
            buttons: {
              add: { icon: '<i class="fas fa-plus"></i>', label: "Adicionar \u00e0 ficha", callback: async () => twbvAddDisadvantageItemToActor(actor, source) },
              close: { label: "Fechar" }
            },
            default: "add"
          }, { width: 640, height: "auto", resizable: true }).render(true);
        });
      });
    }
  }, { width: 680, height: 720, resizable: true }).render(true);
}

function twbvReadDropData(event) {
  const transfer = event?.originalEvent?.dataTransfer ?? event?.dataTransfer;
  const raw = transfer?.getData("text/plain") || transfer?.getData("application/json");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

async function twbvSendDroppedItemToActorChat(actor, item, dropData = {}) {
  if (!actor || !item) return;
  const typeLabel = TWBV_ITEM_TYPES[String(item.type ?? "")] ?? String(item.type ?? "Item");
  const packLabel = dropData?.pack ? `Compêndio: ${escapeHtml(dropData.pack)}` : "Itens";
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `
      <section class="twbv-item-drop-chat-card">
        <header>
          <img src="${escapeHtmlAttr(item.img || twbvGetItemIcon(item.type))}" alt="${escapeHtmlAttr(item.name)}" />
          <div>
            <strong>${escapeHtml(actor.name)}</strong>
            <span>recebeu ${escapeHtml(typeLabel)}</span>
          </div>
        </header>
        <p>${escapeHtml(item.name)}</p>
        <footer>${packLabel}</footer>
      </section>`
  });
}

function twbvNumberOrZero(value) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
}

function twbvNormalizeInitiativeSuit(value) {
  const text = twbvNormalizeSlotText(value);
  const aliases = {
    c: "hearts",
    copa: "hearts",
    copas: "hearts",
    hearts: "hearts",
    heart: "hearts",
    h: "hearts",
    o: "diamonds",
    ouro: "diamonds",
    ouros: "diamonds",
    diamonds: "diamonds",
    diamond: "diamonds",
    d: "diamonds",
    p: "clubs",
    paus: "clubs",
    pau: "clubs",
    clubs: "clubs",
    club: "clubs",
    cl: "clubs",
    e: "spades",
    espada: "spades",
    espadas: "spades",
    spades: "spades",
    spade: "spades",
    s: "spades"
  };
  return aliases[text] ?? "";
}

function twbvNormalizeInitiativeRank(value) {
  const raw = String(value ?? "").trim();
  const text = twbvNormalizeSlotText(raw);
  const aliases = {
    a: 14,
    as: 14,
    ace: 14,
    j: 11,
    valete: 11,
    jack: 11,
    q: 12,
    dama: 12,
    queen: 12,
    k: 13,
    rei: 13,
    king: 13,
    joker: 15,
    coringa: 15
  };
  if (aliases[text]) return aliases[text];
  const number = Number(raw);
  return Number.isFinite(number) ? Math.clamp(Math.trunc(number), 2, 15) : 0;
}

function twbvInitiativeRankMeta(rankValue) {
  const value = twbvNormalizeInitiativeRank(rankValue);
  return TWBV_INITIATIVE_RANKS.find((rank) => rank.value === value) ?? null;
}

function twbvInitiativeSuitMeta(suitValue) {
  const value = twbvNormalizeInitiativeSuit(suitValue);
  return TWBV_INITIATIVE_SUITS.find((suit) => suit.value === value) ?? null;
}

function twbvBuildInitiativeCard({ rank, suit = "", jokerIndex = 1, media = null } = {}) {
  const rankValue = twbvNormalizeInitiativeRank(rank);
  const rankMeta = twbvInitiativeRankMeta(rankValue);
  if (!rankMeta) return null;
  const normalizedSuit = rankValue === 15 ? "" : twbvNormalizeInitiativeSuit(suit);
  const suitMeta = normalizedSuit ? twbvInitiativeSuitMeta(normalizedSuit) : null;
  if (rankValue !== 15 && !suitMeta) return null;
  const normalizedJokerIndex = Math.clamp(Math.trunc(twbvNumberOrZero(jokerIndex) || 1), 1, 2);
  const key = rankValue === 15 ? `joker-${normalizedJokerIndex}` : `${rankMeta.key}-${suitMeta.value}`;
  return {
    key,
    rank: rankMeta.key,
    rankValue,
    rankLabel: rankMeta.label,
    suit: suitMeta?.value ?? "",
    suitLabel: suitMeta?.label ?? "",
    jokerIndex: rankValue === 15 ? normalizedJokerIndex : 0,
    label: rankValue === 15 ? `${rankMeta.label} ${normalizedJokerIndex === 1 ? "Vermelho" : "Preto"}` : `${rankMeta.label} de ${suitMeta.label}`,
    media,
    sort: rankValue === 15
      ? 150 + (3 - normalizedJokerIndex)
      : (rankValue * 10) + (4 - Number(suitMeta?.order ?? 4))
  };
}

function twbvBuildInitiativeDeckCards({ includeJokers = true } = {}) {
  const cards = [];
  for (const rank of TWBV_INITIATIVE_RANKS) {
    if (rank.value === 15) continue;
    for (const suit of TWBV_INITIATIVE_SUITS) cards.push(twbvBuildInitiativeCard({ rank: rank.value, suit: suit.value }));
  }
  if (includeJokers) {
    cards.push(twbvBuildInitiativeCard({ rank: 15, jokerIndex: 1 }));
    cards.push(twbvBuildInitiativeCard({ rank: 15, jokerIndex: 2 }));
  }
  return cards.filter(Boolean);
}

function twbvNormalizeInitiativeCard(card) {
  if (!card) return null;
  if (typeof card === "string") {
    const text = String(card).replace(/[_-]/g, " ").trim();
    const rankMatch = text.match(/\b(joker|coringa|ace|as|king|rei|queen|dama|jack|valete|10|[1-9]|a|k|q|j)\b/i);
    const rank = twbvNormalizeInitiativeRank(rankMatch?.[1] ?? text);
    const jokerIndex = rank === 15 ? (Number(text.match(/\b([12])\b/)?.[1] ?? 1) || 1) : 0;
    const suitMatch = text.match(/\b(copas?|hearts?|ouros?|diamonds?|paus?|clubs?|espadas?|spades?)\b/i);
    const suit = twbvNormalizeInitiativeSuit(suitMatch?.[1] ?? "");
    return twbvBuildInitiativeCard({ rank, suit, jokerIndex });
  }
  const system = card.system ?? {};
  const explicitRank = card.rank ?? card.value ?? card.rankValue ?? system.rank ?? system.value ?? system.rankValue;
  if (explicitRank === undefined || explicitRank === null || explicitRank === "") return twbvNormalizeInitiativeCard(card.name);
  const rank = explicitRank;
  const flagData = card.getFlag?.("world-behind-the-veil", "initiativeCard") ?? card.flags?.["world-behind-the-veil"]?.initiativeCard ?? {};
  const jokerIndex = flagData.jokerIndex ?? card.jokerIndex ?? system.jokerIndex ?? card.name;
  const suit = card.suit ?? system.suit ?? card.type ?? system.type ?? card.name;
  return twbvBuildInitiativeCard({ rank, suit, jokerIndex });
}

function twbvInitiativeSuitSearchOrder(preferredSuit) {
  const suit = twbvNormalizeInitiativeSuit(preferredSuit);
  if (!suit) return [...TWBV_INITIATIVE_SUIT_ORDER];
  const start = Math.max(0, TWBV_INITIATIVE_SUIT_ORDER.indexOf(suit));
  return TWBV_INITIATIVE_SUIT_ORDER.map((_, offset) => TWBV_INITIATIVE_SUIT_ORDER[(start + offset) % TWBV_INITIATIVE_SUIT_ORDER.length]);
}

function twbvResolveInitiativeCardWithModifier(card, modifier = 0, { unavailable = [], includeJokers = true } = {}) {
  const drawn = twbvNormalizeInitiativeCard(card);
  if (!drawn) return null;
  const penalty = Math.trunc(twbvNumberOrZero(modifier));
  const unavailableKeys = new Set((unavailable ?? []).map((entry) => twbvNormalizeInitiativeCard(entry)?.key ?? String(entry ?? "")).filter(Boolean));
  const deck = twbvBuildInitiativeDeckCards({ includeJokers }).filter((entry) => !unavailableKeys.has(entry.key));
  if (penalty === 0 && !unavailableKeys.has(drawn.key)) {
    return { drawn, final: drawn, modifier: penalty, fallback: false, searched: [drawn.key] };
  }
  const targetRank = Math.clamp(drawn.rankValue + penalty, 2, includeJokers ? 15 : 14);
  const searched = [];
  if (targetRank === 15) {
    const joker = deck.find((entry) => entry.rankValue === 15);
    searched.push("joker");
    if (joker) return { drawn, final: joker, modifier: penalty, fallback: joker.key !== drawn.key, searched };
  }
  const suitOrder = twbvInitiativeSuitSearchOrder(drawn.suit);
  for (let rank = Math.min(targetRank, 14); rank >= 2; rank -= 1) {
    for (const suit of suitOrder) {
      const candidate = twbvBuildInitiativeCard({ rank, suit });
      if (!candidate) continue;
      searched.push(candidate.key);
      const available = deck.find((entry) => entry.key === candidate.key);
      if (available) return { drawn, final: available, modifier: penalty, fallback: available.key !== drawn.key, searched };
    }
  }
  return { drawn, final: null, modifier: penalty, fallback: true, searched };
}

function twbvGetActorInitiativeModifier(actor) {
  const systemMod = twbvNumberOrZero(actor?.system?.initiative?.modifier ?? actor?.system?.iniciativa?.modificador);
  const itemMod = Array.from(actor?.items ?? []).reduce((sum, item) => {
    const active = item.system?.active !== false;
    if (!active) return sum;
    return sum + twbvNumberOrZero(item.system?.initiative?.modifier ?? item.system?.iniciativa?.modificador);
  }, 0);
  const conditionMod = Array.from(actor?.system?.condicoes ?? []).reduce((sum, condition) => (
    sum + twbvNumberOrZero(condition?.initiative?.modifier ?? condition?.iniciativa?.modificador)
  ), 0);
  return systemMod + itemMod + conditionMod;
}

function twbvFindInitiativeDeck() {
  const cards = Array.from(game?.cards ?? []);
  return cards.find((deck) => {
    const name = twbvNormalizeSlotText(deck?.name);
    if (twbvNormalizeSlotText(TWBV_INITIATIVE_DISCARD_NAME) === name) return false;
    return name.includes("iniciativa") || name.includes("initiative") || name.includes("twbv");
  }) ?? cards.find((deck) => String(deck?.type ?? "").toLowerCase() === "deck") ?? null;
}

function twbvFindInitiativeDiscardPile() {
  const normalizedPileName = twbvNormalizeSlotText(TWBV_INITIATIVE_DISCARD_NAME);
  return Array.from(game?.cards ?? []).find((entry) => twbvNormalizeSlotText(entry?.name) === normalizedPileName) ?? null;
}

function twbvRegisterInitiativeSettings() {
  game.settings.register("world-behind-the-veil", "useSwadeAnimatedInitiativeDeck", {
    name: "Usar cartas animadas na iniciativa",
    hint: "Usa os assets do Animated Action Deck incorporados ao sistema como aparencia oficial das cartas de iniciativa.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => {
      if (game.user?.isGM) void twbvEnsureInitiativeDeck({ refreshMedia: true });
    }
  });
  game.settings.register("world-behind-the-veil", "initiativeShuffleSoundEnabled", {
    name: "Som ao embaralhar iniciativa",
    hint: "Toca um som sempre que o baralho de iniciativa for embaralhado.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });
  game.settings.register("world-behind-the-veil", "initiativeShuffleSoundPath", {
    name: "Arquivo de som do embaralhamento",
    hint: "Caminho do arquivo tocado ao embaralhar as cartas de iniciativa.",
    scope: "world",
    config: true,
    type: String,
    default: TWBV_INITIATIVE_SHUFFLE_SOUND
  });
  game.settings.register("world-behind-the-veil", "initiativeShuffleSoundVolume", {
    name: "Volume do som de embaralhar",
    hint: "Volume do som de embaralhamento, de 0 a 1.",
    scope: "world",
    config: true,
    type: Number,
    default: 0.55
  });
  game.settings.register("world-behind-the-veil", "initiativeDrawSoundEnabled", {
    name: "Som ao sacar carta",
    hint: "Toca um som sempre que uma carta for sacada.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });
  game.settings.register("world-behind-the-veil", "initiativeDrawSoundPath", {
    name: "Arquivo de som ao sacar carta",
    hint: "Caminho do arquivo tocado ao sacar cartas.",
    scope: "world",
    config: true,
    type: String,
    default: TWBV_INITIATIVE_DRAW_SOUND
  });
  game.settings.register("world-behind-the-veil", "initiativeDrawSoundVolume", {
    name: "Volume do som de sacar carta",
    hint: "Volume do som de sacar carta, de 0 a 1.",
    scope: "world",
    config: true,
    type: Number,
    default: 0.55
  });
}

function twbvGetInitiativeSoundPath(setting, fallback) {
  try {
    return String(game.settings.get("world-behind-the-veil", setting) || fallback).trim();
  }
  catch (_error) {
    return fallback;
  }
}

function twbvGetInitiativeSoundVolume(setting, fallback = 0.55) {
  try {
    const volume = Number(game.settings.get("world-behind-the-veil", setting));
    return Math.clamp(Number.isFinite(volume) ? volume : fallback, 0, 1);
  }
  catch (_error) {
    return fallback;
  }
}

function twbvGetInitiativeSoundEnabled(setting, fallback = true) {
  try {
    return Boolean(game.settings.get("world-behind-the-veil", setting));
  }
  catch (_error) {
    return fallback;
  }
}

async function twbvPlayAudioAsset(src, volume = 0.55) {
  if (!src) return;
  try {
    const AudioHelperClass = globalThis.foundry?.audio?.AudioHelper ?? globalThis.AudioHelper;
    if (typeof AudioHelperClass?.play === "function") {
      await AudioHelperClass.play({ src, volume, autoplay: true, loop: false }, true);
      return;
    }
    const audio = new Audio(src);
    audio.volume = volume;
    await audio.play();
  }
  catch (error) {
    console.warn("[TWBV] Nao foi possivel tocar audio.", error);
  }
}

async function twbvPlayInitiativeShuffleSound() {
  if (!twbvGetInitiativeSoundEnabled("initiativeShuffleSoundEnabled")) return;
  await twbvPlayAudioAsset(
    twbvGetInitiativeSoundPath("initiativeShuffleSoundPath", TWBV_INITIATIVE_SHUFFLE_SOUND),
    twbvGetInitiativeSoundVolume("initiativeShuffleSoundVolume")
  );
}

async function twbvPlayInitiativeDrawSound() {
  if (!twbvGetInitiativeSoundEnabled("initiativeDrawSoundEnabled")) return;
  await twbvPlayAudioAsset(
    twbvGetInitiativeSoundPath("initiativeDrawSoundPath", TWBV_INITIATIVE_DRAW_SOUND),
    twbvGetInitiativeSoundVolume("initiativeDrawSoundVolume")
  );
}

let twbvLastShuffleSoundAt = 0;
let twbvLastDrawSoundAt = 0;

function twbvPlayInitiativeShuffleSoundDebounced() {
  const now = Date.now();
  if (now - twbvLastShuffleSoundAt < 180) return;
  twbvLastShuffleSoundAt = now;
  void twbvPlayInitiativeShuffleSound();
}

function twbvPlayInitiativeDrawSoundDebounced() {
  const now = Date.now();
  if (now - twbvLastDrawSoundAt < 120) return;
  twbvLastDrawSoundAt = now;
  void twbvPlayInitiativeDrawSound();
}

function twbvPatchCardsAudioHooks() {
  const patchMethod = (klass, method, soundFn, marker) => {
    const proto = klass?.prototype;
    if (!proto || typeof proto[method] !== "function" || proto[marker]) return;
    const original = proto[method];
    proto[marker] = true;
    proto[method] = async function (...args) {
      const result = await original.apply(this, args);
      soundFn();
      return result;
    };
  };

  const cardsClasses = [globalThis.Cards, CONFIG?.Cards?.documentClass].filter(Boolean);
  const cardClasses = [globalThis.Card, CONFIG?.Card?.documentClass].filter(Boolean);
  for (const CardsClass of cardsClasses) {
    patchMethod(CardsClass, "shuffle", twbvPlayInitiativeShuffleSoundDebounced, "_twbvShuffleSoundPatched");
  }
  for (const method of ["deal", "draw", "pass"]) {
    for (const CardsClass of cardsClasses) patchMethod(CardsClass, method, twbvPlayInitiativeDrawSoundDebounced, `_twbvDrawSoundPatched_${method}`);
    for (const CardClass of cardClasses) patchMethod(CardClass, method, twbvPlayInitiativeDrawSoundDebounced, `_twbvDrawSoundPatched_${method}`);
  }
}

function twbvRegisterMoneySettings() {
  game.settings.register("world-behind-the-veil", "medievalConversionRates", {
    name: "Padr\u00e3o monet\u00e1rio medieval",
    hint: "Define a convers\u00e3o mundial de cobre, prata, ouro e platina usada pelas fichas.",
    scope: "world",
    config: false,
    type: Object,
    default: { cobrePorPrata: 100, prataPorOuro: 100, ouroPorPlatina: 10 }
  });
  game.settings.register("world-behind-the-veil", "sheetTransactionChatEnabled", {
    name: "Mostrar transa\u00e7\u00f5es da ficha no chat",
    hint: "Publica no chat PIX, c\u00e2mbio, compras, vendas, doa\u00e7\u00f5es e registros de dinheiro feitos pela ficha.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });
}

function twbvUseAnimatedInitiativeDeck() {
  try {
    return Boolean(game.settings.get("world-behind-the-veil", "useSwadeAnimatedInitiativeDeck"));
  }
  catch (_error) {
    return true;
  }
}

async function twbvInitiativeAnimatedDeckStatus() {
  const sample = twbvBuildInitiativeCard({ rank: 13, suit: "hearts" });
  const media = await twbvResolveInitiativeCardMedia(sample);
  return {
    moduleId: TWBV_INITIATIVE_ANIMATED_DECK_MODULE_ID,
    moduleActive: Boolean(game.modules?.get(TWBV_INITIATIVE_ANIMATED_DECK_MODULE_ID)?.active),
    enabled: twbvUseAnimatedInitiativeDeck(),
    sample: sample?.label ?? "",
    sampleMedia: media?.src ?? "",
    available: Boolean(media?.src)
  };
}

function twbvInitiativeCardMediaType(path) {
  const text = String(path ?? "").toLowerCase();
  if (/\.(mp4|webm|ogg|mov)$/.test(text)) return "video";
  if (/\.(png|jpg|jpeg|webp|gif|svg)$/.test(text)) return "image";
  return "";
}

function twbvInitiativeEnglishRankNames(card) {
  const rank = Number(card?.rankValue ?? 0);
  const names = {
    1: ["1", "ONE"],
    2: ["2", "TWO"],
    3: ["3", "THREE"],
    4: ["4", "FOUR"],
    5: ["5", "FIVE"],
    6: ["6", "SIX"],
    7: ["7", "SEVEN"],
    8: ["8", "EIGHT"],
    9: ["9", "NINE"],
    10: ["10", "TEN"],
    11: ["JACK", "J"],
    12: ["QUEEN", "Q"],
    13: ["KING", "K"],
    14: ["ACE", "A"]
  };
  return names[rank] ?? [];
}

function twbvInitiativeSwadeRankFileName(card) {
  const rank = Number(card?.rankValue ?? 0);
  if (rank >= 2 && rank <= 10) return String(rank);
  if (rank === 11) return "Jack";
  if (rank === 12) return "Queen";
  if (rank === 13) return "King";
  if (rank === 14) return "Ace";
  return "";
}

function twbvInitiativeSwadeSuitFileName(card) {
  const suit = String(card?.suit ?? "").trim();
  const names = {
    hearts: "HEARTS",
    diamonds: "DIAMONDS",
    clubs: "CLUBS",
    spades: "SPADES"
  };
  return names[suit] ?? "";
}

function twbvDefaultInitiativeCardImage(card) {
  return Number(card?.rankValue ?? 0) === 15 ? "icons/svg/card-joker.svg" : "icons/svg/card-hand.svg";
}

function twbvInitiativeAnimatedCardCandidates(card) {
  if (!card) return [];
  const rank = Number(card.rankValue ?? 0);
  const candidates = [];
  if (rank === 15) {
    const index = Math.clamp(Math.trunc(twbvNumberOrZero(card.jokerIndex) || 1), 1, 2);
    const color = index === 1 ? "red" : "black";
    for (const ext of ["mp4", "webm", "webp", "png"]) {
      candidates.push(`${TWBV_INITIATIVE_ANIMATED_DECK_BASE}/joker/${color}_Joker.${ext}`);
      candidates.push(`${TWBV_INITIATIVE_ANIMATED_DECK_BASE}/joker/${color}_joker.${ext}`);
      candidates.push(`${TWBV_INITIATIVE_ANIMATED_DECK_BASE}/jokers/JOKER_${index}.${ext}`);
      candidates.push(`${TWBV_INITIATIVE_ANIMATED_DECK_BASE}/jokers/JOKER.${ext}`);
      candidates.push(`${TWBV_INITIATIVE_ANIMATED_DECK_BASE}/joker/JOKER_${index}.${ext}`);
      candidates.push(`${TWBV_INITIATIVE_ANIMATED_DECK_BASE}/joker/JOKER.${ext}`);
    }
    return candidates;
  }
  const suit = String(card.suit ?? "").trim();
  if (!suit) return candidates;
  const exactBundledNames = {
    clubs: {
      11: "jack_clubs",
      12: "queen_clubs",
      13: "king_clubs",
      14: "Ace_of_Clubs"
    },
    diamonds: {
      11: "JAck_of_diamonds",
      12: "queen_of_diamonds",
      13: "King_of_diamonds",
      14: "ACE_of_diamonds"
    },
    hearts: {
      11: "JACK_of_hearts",
      12: "QUEEN_of_hearts",
      13: "KING_of_hearts",
      14: "ace_of_hearts"
    },
    spades: {
      11: "Jack_of_spades",
      12: "Queen_of_spades",
      13: "king_of_spades",
      14: "ace_of_spades"
    }
  };
  const exactName = exactBundledNames[suit]?.[rank];
  if (exactName) {
    candidates.push(`${TWBV_INITIATIVE_ANIMATED_DECK_BASE}/${suit}/${exactName}.mp4`);
    candidates.push(`${TWBV_INITIATIVE_ANIMATED_DECK_BASE}/${suit}/${exactName}.webp`);
  }
  if (rank >= 2 && rank <= 10) {
    const singularSuit = suit === "clubs" ? "club" : suit === "diamonds" ? "Diamond" : suit;
    for (const ext of ["webp", "png"]) {
      candidates.push(`${TWBV_INITIATIVE_ANIMATED_DECK_BASE}/${suit}/numbers/${rank}_${singularSuit}.${ext}`);
      candidates.push(`${TWBV_INITIATIVE_ANIMATED_DECK_BASE}/${suit}/numbers/${rank}_${suit}.${ext}`);
      candidates.push(`${TWBV_INITIATIVE_ANIMATED_DECK_BASE}/${suit}/numbers/${rank}_${suit.slice(0, -1)}.${ext}`);
    }
  }
  const rankNames = twbvInitiativeEnglishRankNames(card);
  for (const rankName of rankNames) {
    const lowerRank = rankName.toLowerCase();
    const titleRank = lowerRank.charAt(0).toUpperCase() + lowerRank.slice(1);
    const upperRank = rankName.toUpperCase();
    const weirdDiamondJack = rank === 11 && suit === "diamonds" ? "JAck" : "";
    for (const ext of ["mp4", "webm", "webp", "png"]) {
      candidates.push(`${TWBV_INITIATIVE_ANIMATED_DECK_BASE}/${suit}/${rankName}_of_${suit}.${ext}`);
      candidates.push(`${TWBV_INITIATIVE_ANIMATED_DECK_BASE}/${suit}/${rankName}_${suit}.${ext}`);
      candidates.push(`${TWBV_INITIATIVE_ANIMATED_DECK_BASE}/${suit}/${rankName}-${suit}.${ext}`);
      candidates.push(`${TWBV_INITIATIVE_ANIMATED_DECK_BASE}/${rankName}_of_${suit}.${ext}`);
      candidates.push(`${TWBV_INITIATIVE_ANIMATED_DECK_BASE}/${suit}/${lowerRank}_of_${suit}.${ext}`);
      candidates.push(`${TWBV_INITIATIVE_ANIMATED_DECK_BASE}/${suit}/${lowerRank}_${suit}.${ext}`);
      candidates.push(`${TWBV_INITIATIVE_ANIMATED_DECK_BASE}/${suit}/${titleRank}_of_${suit}.${ext}`);
      candidates.push(`${TWBV_INITIATIVE_ANIMATED_DECK_BASE}/${suit}/${titleRank}_${suit}.${ext}`);
      candidates.push(`${TWBV_INITIATIVE_ANIMATED_DECK_BASE}/${suit}/${upperRank}_of_${suit}.${ext}`);
      candidates.push(`${TWBV_INITIATIVE_ANIMATED_DECK_BASE}/${suit}/${upperRank}_${suit}.${ext}`);
      if (weirdDiamondJack) candidates.push(`${TWBV_INITIATIVE_ANIMATED_DECK_BASE}/${suit}/${weirdDiamondJack}_of_${suit}.${ext}`);
    }
  }
  return candidates;
}

async function twbvMediaExists(path) {
  const key = String(path ?? "");
  if (!key) return false;
  if (TWBV_INITIATIVE_MEDIA_CACHE.has(key)) return TWBV_INITIATIVE_MEDIA_CACHE.get(key);
  let exists = false;
  try {
    const response = await fetch(key, { method: "HEAD" });
    exists = response.ok;
  }
  catch (_error) {
    try {
      const response = await fetch(key, { method: "GET" });
      exists = response.ok;
    }
    catch (_fallbackError) {
      exists = false;
    }
  }
  TWBV_INITIATIVE_MEDIA_CACHE.set(key, exists);
  return exists;
}

async function twbvResolveInitiativeCardMedia(card) {
  if (!twbvUseAnimatedInitiativeDeck()) return null;
  for (const candidate of twbvInitiativeAnimatedCardCandidates(card)) {
    if (await twbvMediaExists(candidate)) return { src: candidate, type: twbvInitiativeCardMediaType(candidate), source: TWBV_INITIATIVE_ANIMATED_DECK_MODULE_ID };
  }
  return null;
}

async function twbvResolveInitiativeCardImageMedia(card) {
  if (!twbvUseAnimatedInitiativeDeck()) return null;
  for (const candidate of twbvInitiativeAnimatedCardCandidates(card).filter((path) => twbvInitiativeCardMediaType(path) === "image")) {
    if (await twbvMediaExists(candidate)) return { src: candidate, type: "image", source: TWBV_INITIATIVE_ANIMATED_DECK_MODULE_ID };
  }
  return null;
}

async function twbvInitiativeCardDocumentData(card) {
  const media = await twbvResolveInitiativeCardMedia(card);
  const imageMedia = media?.type === "image" ? media : await twbvResolveInitiativeCardImageMedia(card);
  const img = imageMedia?.src || twbvDefaultInitiativeCardImage(card);
  return {
    name: card.label,
    type: "base",
    img,
    face: 0,
    drawn: false,
    faces: [
      {
        name: card.label,
        img,
        text: card.label
      }
    ],
    system: {
      twbvInitiative: true,
      key: card.key,
      rank: card.rank,
      rankValue: card.rankValue,
      suit: card.suit,
      suitLabel: card.suitLabel,
      sort: card.sort
    },
    flags: {
      "world-behind-the-veil": {
        initiativeCard: {
          key: card.key,
          rank: card.rank,
          rankValue: card.rankValue,
          rankLabel: card.rankLabel,
          suit: card.suit,
          suitLabel: card.suitLabel,
          jokerIndex: card.jokerIndex,
          label: card.label,
          sort: card.sort,
          media
        }
      }
    }
  };
}

async function twbvRefreshInitiativeDeckCardMedia(deck) {
  if (!deck || typeof deck.updateEmbeddedDocuments !== "function") return;
  const updates = [];
  for (const cardDoc of deck.cards ?? []) {
    const meta = twbvInitiativeCardMetaFromDocument(cardDoc);
    if (!meta) continue;
    const media = await twbvResolveInitiativeCardMedia(meta);
    const imageMedia = media?.type === "image" ? media : await twbvResolveInitiativeCardImageMedia(meta);
    const flagData = foundry.utils.deepClone(cardDoc.getFlag?.("world-behind-the-veil", "initiativeCard") ?? {});
    const currentFace = Array.from(cardDoc.faces ?? [])[0] ?? {};
    const expectedImg = imageMedia?.src || twbvDefaultInitiativeCardImage(meta);
    const needsNameUpdate = cardDoc.name !== meta.label
      || cardDoc.face !== 0
      || currentFace.name !== meta.label
      || currentFace.img !== expectedImg
      || currentFace.text !== meta.label;
    flagData.key = meta.key;
    flagData.rank = meta.rank;
    flagData.rankValue = meta.rankValue;
    flagData.rankLabel = meta.rankLabel;
    flagData.suit = meta.suit;
    flagData.suitLabel = meta.suitLabel;
    flagData.jokerIndex = meta.jokerIndex;
    flagData.label = meta.label;
    flagData.sort = meta.sort;

    if (media?.src) {
      const currentMedia = flagData?.media?.src ?? "";
      if (currentMedia === media.src && cardDoc.img === expectedImg && !needsNameUpdate) continue;
      flagData.media = media;
      updates.push({
        _id: cardDoc.id,
        name: meta.label,
        img: expectedImg,
        face: 0,
        faces: [{ name: meta.label, img: expectedImg, text: meta.label }],
        flags: {
          "world-behind-the-veil": {
            initiativeCard: flagData
          }
        }
      });
      continue;
    }

    const hasOldMedia = Boolean(flagData?.media);
    if (!hasOldMedia && cardDoc.img === expectedImg && !needsNameUpdate) continue;
    flagData.media = null;
    updates.push({
      _id: cardDoc.id,
      name: meta.label,
      img: expectedImg,
      face: 0,
      faces: [{ name: meta.label, img: expectedImg, text: meta.label }],
      flags: {
        "world-behind-the-veil": {
          initiativeCard: flagData
        }
      }
    });
  }
  if (updates.length) await deck.updateEmbeddedDocuments("Card", updates);
}

async function twbvEnsureInitiativeDeck({ refreshMedia = true } = {}) {
  if (!game.user?.isGM) return null;
  const cardsCollection = game.cards;
  const CardsClass = globalThis.Cards;
  if (!cardsCollection || typeof CardsClass?.create !== "function") return null;
  const normalizedDeckName = twbvNormalizeSlotText(TWBV_INITIATIVE_DECK_NAME);
  let deck = Array.from(cardsCollection ?? []).find((entry) => twbvNormalizeSlotText(entry?.name) === normalizedDeckName);
  if (!deck) {
    try {
      deck = await CardsClass.create({
        name: TWBV_INITIATIVE_DECK_NAME,
        type: "deck",
        img: TWBV_INITIATIVE_CARD_BACK,
        description: "Baralho de iniciativa do The World Behind the Veil. Ordem de naipes: Copas, Ouros, Paus, Espadas.",
        flags: {
          "world-behind-the-veil": {
            initiativeDeck: true,
            suitOrder: [...TWBV_INITIATIVE_SUIT_ORDER]
          }
        }
      });
    }
    catch (error) {
      console.warn("[TWBV] Nao foi possivel criar o baralho de iniciativa.", error);
      ui.notifications?.warn("Nao foi possivel criar o baralho de iniciativa automaticamente.");
      return null;
    }
  }
  if (!deck) return null;
  if (deck.img !== TWBV_INITIATIVE_CARD_BACK && typeof deck.update === "function") {
    await deck.update({ img: TWBV_INITIATIVE_CARD_BACK });
  }
  await twbvRemoveObsoleteInitiativeCards(deck);
  const wantedCards = twbvBuildInitiativeDeckCards({ includeJokers: true });
  const existingKeys = new Set(Array.from(deck.cards ?? []).map((card) => {
    const flagged = card.getFlag?.("world-behind-the-veil", "initiativeCard")?.key;
    if (flagged === "joker") return "joker-1";
    return flagged || twbvNormalizeInitiativeCard(card)?.key || "";
  }).filter(Boolean));
  const missing = wantedCards
    .filter((card) => !existingKeys.has(card.key));
  const missingData = await Promise.all(missing.map((card) => twbvInitiativeCardDocumentData(card)));
  if (missingData.length && typeof deck.createEmbeddedDocuments === "function") {
    try {
      await deck.createEmbeddedDocuments("Card", missingData);
    }
    catch (error) {
      console.warn("[TWBV] Nao foi possivel completar o baralho de iniciativa.", error);
      ui.notifications?.warn("Nao foi possivel adicionar todas as cartas ao baralho de iniciativa.");
    }
  }
  if (refreshMedia) await twbvRefreshInitiativeDeckCardMedia(deck);
  return deck;
}

async function twbvEnsureInitiativeDiscardPile() {
  if (!game.user?.isGM) return null;
  const cardsCollection = game.cards;
  const CardsClass = globalThis.Cards;
  if (!cardsCollection || typeof CardsClass?.create !== "function") return null;
  let pile = twbvFindInitiativeDiscardPile();
  if (pile) {
    await twbvRemoveObsoleteInitiativeCards(pile);
    return pile;
  }
  try {
    pile = await CardsClass.create({
      name: TWBV_INITIATIVE_DISCARD_NAME,
      type: "pile",
      img: "icons/svg/card-discard.svg",
      description: "Pilha de descarte da iniciativa do The World Behind the Veil.",
      flags: {
        "world-behind-the-veil": {
          initiativeDiscard: true
        }
      }
    });
  }
  catch (error) {
    console.warn("[TWBV] Nao foi possivel criar a pilha de descarte da iniciativa.", error);
    ui.notifications?.warn("Nao foi possivel criar a pilha de descarte da iniciativa automaticamente.");
  }
  await twbvRemoveObsoleteInitiativeCards(pile);
  return pile ?? null;
}

function twbvInitiativeCardKeyFromDocument(card) {
  const flagged = card?.getFlag?.("world-behind-the-veil", "initiativeCard")?.key;
  if (flagged === "joker") return "joker-1";
  return flagged || twbvNormalizeInitiativeCard(card)?.key || "";
}

function twbvInitiativeCardMetaFromDocument(card) {
  const flagData = card?.getFlag?.("world-behind-the-veil", "initiativeCard") ?? {};
  if (flagData?.key) return twbvBuildInitiativeCard({ rank: flagData.rankValue ?? flagData.rank, suit: flagData.suit, jokerIndex: flagData.jokerIndex ?? flagData.key, media: flagData.media ?? null });
  return twbvNormalizeInitiativeCard(card);
}

function twbvInitiativeCardMetaFromSort(sortValue) {
  const value = Number(sortValue ?? 0);
  if (!Number.isFinite(value) || value <= 0) return null;
  const deck = twbvFindInitiativeDeck();
  const fromDeck = Array.from(deck?.cards ?? [])
    .map((card) => twbvInitiativeCardMetaFromDocument(card))
    .find((meta) => Number(meta?.sort ?? 0) === value);
  if (fromDeck) return fromDeck;
  return twbvBuildInitiativeDeckCards({ includeJokers: true }).find((meta) => Number(meta.sort ?? 0) === value) ?? null;
}

function twbvFindCombatantRow(root, combatant, index = 0) {
  if (!root || !combatant) return null;
  const selectors = [
    `[data-combatant-id="${combatant.id}"]`,
    `[data-combatant-id="${combatant._id}"]`,
    `[data-document-id="${combatant.id}"]`,
    `[data-document-id="${combatant._id}"]`,
    `[data-token-id="${combatant.tokenId ?? ""}"]`,
    `[data-token-id="${combatant.token?.id ?? ""}"]`,
    `[data-actor-id="${combatant.actor?.id ?? ""}"]`
  ].filter((selector) => !selector.includes('""'));
  for (const selector of selectors) {
    const found = root.querySelector?.(selector);
    if (found) return found.closest?.(".combatant") ?? found;
  }
  const rows = Array.from(root.querySelectorAll?.(".combatant, li[data-combatant-id], li[data-document-id], .directory-item") ?? []);
  const byName = rows.find((row) => twbvNormalizeSlotText(row.textContent).includes(twbvNormalizeSlotText(combatant.name)));
  return byName ?? rows[index] ?? null;
}

function twbvHideNativeInitiativeElements(row, combatant) {
  if (!row) return;
  const initiativeValue = String(combatant?.initiative ?? "").trim();
  const candidates = Array.from(row.querySelectorAll?.(".token-initiative, .combatant-initiative, [data-tooltip='COMBAT.Initiative'], [data-action='rollInitiative'], [data-control='rollInitiative'], button, a, span, div") ?? []);
  for (const el of candidates) {
    if (el.closest?.(".twbv-combat-card-slot")) continue;
    const text = String(el.value ?? el.textContent ?? "").trim();
    const title = String(el.title ?? el.getAttribute?.("aria-label") ?? el.dataset?.tooltip ?? el.dataset?.tooltipText ?? "").trim();
    const classes = String(el.className ?? "");
    const hasDiceIcon = Boolean(el.querySelector?.(".fa-dice-d20, .fa-dice, .fa-dice-six, .fa-dice-five"));
    const isNativeInitiative = classes.includes("initiative")
      || /initiative|iniciativa/i.test(title)
      || (initiativeValue && text === initiativeValue)
      || /^dados?$/i.test(text)
      || hasDiceIcon;
    if (isNativeInitiative) el.classList.add("twbv-native-initiative-hidden");
  }
}

function twbvEnhanceCombatTrackerRollControls(root) {
  if (!root) return;
  const controls = Array.from(root.querySelectorAll?.("button, a") ?? []);
  for (const control of controls) {
    const text = twbvNormalizeSlotText(control.textContent);
    const title = twbvNormalizeSlotText(control.title || control.getAttribute?.("aria-label") || control.dataset?.tooltip || control.dataset?.tooltipText || "");
    const looksLikeInitiativeRoll = text === "dados"
      || title.includes("iniciativa")
      || title.includes("initiative")
      || control.dataset?.action === "rollInitiative"
      || control.dataset?.control === "rollInitiative"
      || control.classList?.contains("roll-initiative")
      || control.querySelector?.(".fa-dice-d20, .fa-dice");
    if (!looksLikeInitiativeRoll || control.closest?.(".twbv-combat-card-slot")) continue;
    control.classList.add("twbv-combat-native-roll-card");
    control.title = "Puxar carta de iniciativa";
    control.innerHTML = '<i class="fas fa-id-card"></i>';
  }
}

function twbvEnhanceCombatTrackerHeaderControls(app, root) {
  if (!game.user?.isGM || !root) return;
  if (root.querySelector?.(".twbv-combat-header-tools")) return;
  const combat = app?.viewed ?? game.combat;
  const title = Array.from(root.querySelectorAll?.("h3, h4, header, .encounter-title, .combat-tracker-header, .directory-header, .combat-tracker-controls") ?? [])
    .find((el) => twbvNormalizeSlotText(el.textContent).includes("nao iniciado") || twbvNormalizeSlotText(el.textContent).includes("round") || twbvNormalizeSlotText(el.textContent).includes("turno"));
  const host = title?.closest?.("header, .combat-tracker-header, .directory-header") ?? title ?? root.querySelector?.("header, .combat-tracker-header, .directory-header") ?? root.firstElementChild;
  if (!host) return;
  const tools = document.createElement("div");
  tools.className = "twbv-combat-header-tools";
  tools.innerHTML = `
    <button type="button" class="twbv-combat-header-tool" data-twbv-combat-action="clear-initiative" title="Limpar iniciativa"><i class="fas fa-eraser"></i></button>
    <button type="button" class="twbv-combat-header-tool" data-twbv-combat-action="reset-discard" title="Zerar descarte e embaralhar"><i class="fas fa-random"></i></button>
  `;
  host.appendChild(tools);
  tools.querySelector('[data-twbv-combat-action="clear-initiative"]')?.addEventListener("click", async (event) => {
    event.preventDefault();
    await twbvClearCombatInitiativeCards(combat, { notify: true });
  });
  tools.querySelector('[data-twbv-combat-action="reset-discard"]')?.addEventListener("click", async (event) => {
    event.preventDefault();
    await twbvClearInitiativeDiscardAndShuffle({ notify: true });
    if (combat?.setFlag) {
      await combat.setFlag("world-behind-the-veil", "initiativeJokersRound", []);
      await combat.setFlag("world-behind-the-veil", "initiativeResetPending", false);
    }
  });
}

function twbvIsObsoleteInitiativeCardDocument(card) {
  const flagData = card?.getFlag?.("world-behind-the-veil", "initiativeCard") ?? {};
  const system = card?.system ?? {};
  const key = String(flagData.key ?? system.key ?? "").trim().toLowerCase();
  const rank = Number(flagData.rankValue ?? system.rankValue ?? card?.rankValue ?? flagData.rank ?? system.rank ?? 0);
  const name = twbvNormalizeSlotText(card?.name ?? flagData.label ?? "");
  return rank === 1 || key.startsWith("1-") || name.startsWith("1 de ");
}

async function twbvRemoveObsoleteInitiativeCards(cardsDocument) {
  if (!cardsDocument || typeof cardsDocument.deleteEmbeddedDocuments !== "function") return;
  const obsoleteIds = Array.from(cardsDocument.cards ?? [])
    .filter((card) => card?.id && twbvIsObsoleteInitiativeCardDocument(card))
    .map((card) => card.id);
  if (obsoleteIds.length) await cardsDocument.deleteEmbeddedDocuments("Card", obsoleteIds);
}

function twbvInitiativeSuitShort(suitValue) {
  const suit = twbvInitiativeSuitMeta(suitValue);
  return suit?.short ?? "";
}

function twbvInitiativeRankShort(cardMeta) {
  const rank = Number(cardMeta?.rankValue ?? 0);
  if (rank === 11) return "V";
  if (rank === 12) return "D";
  if (rank === 13) return "R";
  if (rank === 14) return "A";
  if (rank === 15) return "J";
  return String(cardMeta?.rankLabel ?? cardMeta?.rank ?? "");
}

function twbvInitiativeCardMiniHtml(cardMeta, { compact = false } = {}) {
  if (!cardMeta) return "";
  const isJoker = Number(cardMeta.rankValue ?? 0) === 15;
  const media = cardMeta.media ?? null;
  if (media?.src) {
    const mediaHtml = media.type === "video"
      ? `<video src="${escapeHtmlAttr(media.src)}" autoplay muted loop playsinline></video>`
      : `<img src="${escapeHtmlAttr(media.src)}" alt="${escapeHtmlAttr(cardMeta.label)}" />`;
    return `<span class="twbv-initiative-card-mini is-media ${isJoker ? "is-joker" : ""} ${compact ? "is-compact" : ""}" title="${escapeHtmlAttr(cardMeta.label)}">
      ${mediaHtml}
    </span>`;
  }
  return `<span class="twbv-initiative-card-mini twbv-initiative-card-back ${isJoker ? "is-joker" : ""} ${compact ? "is-compact" : ""}" title="${escapeHtmlAttr(cardMeta.label)}">
    <img src="${escapeHtmlAttr(TWBV_INITIATIVE_CARD_BACK)}" alt="${escapeHtmlAttr(cardMeta.label)}" />
  </span>`;
}

function twbvInitiativeCardBackMiniHtml({ compact = true } = {}) {
  return `<span class="twbv-initiative-card-mini twbv-initiative-card-back ${compact ? "is-compact" : ""}" title="Puxar carta">
    <img src="${escapeHtmlAttr(TWBV_INITIATIVE_CARD_BACK)}" alt="Carta" />
  </span>`;
}

function twbvInitiativeCardChoiceButtonHtml(cardMeta, { disabled = false, current = false } = {}) {
  const disabledAttr = disabled ? " disabled" : "";
  const classes = ["twbv-initiative-card-choice"];
  if (current) classes.push("is-current");
  if (disabled) classes.push("is-disabled");
  return `<button type="button" class="${classes.join(" ")}" data-card-key="${escapeHtmlAttr(cardMeta.key)}"${disabledAttr}>
    ${twbvInitiativeCardMiniHtml(cardMeta)}
    <span>${escapeHtml(cardMeta.label)}</span>
    ${disabled ? "<em>J\u00e1 puxada</em>" : ""}
  </button>`;
}

async function twbvAssignInitiativeCardToCombatant(combat, combatant, cardMeta) {
  if (!game.user?.isGM || !combat || !combatant || !cardMeta) return false;
  const deck = await twbvEnsureInitiativeDeck({ refreshMedia: false });
  if (!deck) return false;
  const normalized = cardMeta?.key ? foundry.utils.deepClone(cardMeta) : twbvNormalizeInitiativeCard(cardMeta);
  if (!normalized) return false;
  const current = combatant.getFlag?.("world-behind-the-veil", "initiative") ?? {};
  const previousKeys = [current.drawn?.key, current.final?.key].filter(Boolean);
  const updates = Array.from(deck.cards ?? [])
    .map((card) => {
      const key = twbvInitiativeCardKeyFromDocument(card);
      if (!key) return null;
      if (key === normalized.key) return card.drawn ? null : { _id: card.id, drawn: true };
      if (previousKeys.includes(key) && card.drawn) return { _id: card.id, drawn: false };
      return null;
    })
    .filter(Boolean);
  if (updates.length && typeof deck.updateEmbeddedDocuments === "function") {
    await deck.updateEmbeddedDocuments("Card", updates);
  }
  await twbvDiscardInitiativeCard(normalized, { combat, combatant });
  twbvPlayInitiativeDrawSoundDebounced();
  await twbvTrackInitiativeJokerDraw(combat, normalized);
  await combat.updateEmbeddedDocuments("Combatant", [{
    _id: combatant.id,
    initiative: Number(normalized.sort ?? 0),
    flags: {
      "world-behind-the-veil": {
        initiative: {
          drawn: normalized,
          final: normalized,
          modifier: 0,
          fallback: false,
          searched: [normalized.key],
          manual: true,
          assignedBy: game.user?.id ?? ""
        }
      }
    }
  }]);
  await twbvPostInitiativeLog("Carta entregue pelo Mestre", `<article class="twbv-initiative-entry">
    ${twbvInitiativeCardMiniHtml(normalized)}
    <div class="twbv-initiative-entry-main">
      <strong>${escapeHtml(combatant.name)}</strong>
      <span>${escapeHtml(normalized.label)}</span>
      <em>Carta definida manualmente pelo Mestre.</em>
    </div>
  </article>`, { actor: combatant.actor });
  return true;
}

async function twbvOpenInitiativeCardPicker(combat, combatant) {
  if (!game.user?.isGM || !combat || !combatant) return;
  const deck = await twbvEnsureInitiativeDeck({ refreshMedia: false });
  if (!deck) return ui.notifications?.warn("Baralho de iniciativa n\u00e3o encontrado.");
  const current = combatant.getFlag?.("world-behind-the-veil", "initiative") ?? {};
  const currentKey = current.final?.key ?? current.drawn?.key ?? "";
  const cards = Array.from(deck.cards ?? [])
    .map((card) => ({
      doc: card,
      meta: twbvInitiativeCardMetaFromDocument(card),
      drawn: Boolean(card.drawn)
    }))
    .filter((entry) => entry.meta)
    .sort((a, b) => Number(b.meta.sort ?? 0) - Number(a.meta.sort ?? 0));
  const rows = cards.map((entry) => twbvInitiativeCardChoiceButtonHtml(entry.meta, {
    disabled: entry.drawn && entry.meta.key !== currentKey,
    current: entry.meta.key === currentKey
  })).join("");
  new Dialog({
    title: `Dar carta: ${combatant.name}`,
    content: `<section class="twbv-initiative-card-picker">
      <header><i class="fas fa-id-card"></i><span>${escapeHtml(combatant.name)}</span></header>
      <div class="twbv-initiative-card-picker-grid">${rows}</div>
    </section>`,
    classes: ["twbv-initiative-card-picker-dialog"],
    buttons: { close: { label: "Fechar" } },
    render: (dialog, html) => {
      const root = resolveDialogRoot(html ?? dialog);
      root?.querySelectorAll?.(".twbv-initiative-card-choice:not(:disabled)").forEach((button) => {
        button.addEventListener("click", async (event) => {
          event.preventDefault();
          const selected = cards.find((entry) => entry.meta?.key === button.dataset.cardKey);
          if (!selected?.meta) return;
          await twbvAssignInitiativeCardToCombatant(combat, combatant, selected.meta);
          dialog.close();
        });
      });
    }
  }, { width: 760, height: 720, resizable: true }).render(true);
}

function twbvOpenInitiativeCardActionMenu(combat, combatant) {
  if (!combat || !combatant) return;
  new Dialog({
    title: `Carta: ${combatant.name}`,
    content: `<section class="twbv-initiative-action-menu">
      <button type="button" data-action="give"><i class="fas fa-id-card"></i><span>Dar carta</span></button>
      <button type="button" data-action="free"><i class="fas fa-redo"></i><span>Rerrolar gratuitamente</span></button>
      <button type="button" data-action="eco"><i class="fas fa-bolt"></i><span>Rerrolar com Eco</span></button>
    </section>`,
    buttons: { close: { label: "Fechar" } },
    render: (dialog, html) => {
      const root = resolveDialogRoot(html ?? dialog);
      root?.querySelector?.('[data-action="give"]')?.addEventListener("click", async () => {
        dialog.close();
        await twbvOpenInitiativeCardPicker(combat, combatant);
      });
      root?.querySelector?.('[data-action="free"]')?.addEventListener("click", async () => {
        dialog.close();
        await twbvRerollInitiativeCard(combat, combatant, { free: true });
      });
      root?.querySelector?.('[data-action="eco"]')?.addEventListener("click", async () => {
        dialog.close();
        await twbvRerollInitiativeCard(combat, combatant, { spendEco: true });
      });
    }
  }, { width: 360, height: "auto" }).render(true);
}

function twbvCloseInlineInitiativeMenus() {
  document.querySelectorAll?.(".twbv-initiative-inline-menu").forEach((menu) => menu.remove());
}

function twbvCreateInlineInitiativeMenuAction(icon, label, action) {
  return `<button type="button" data-action="${escapeHtmlAttr(action)}"><i class="${escapeHtmlAttr(icon)}"></i><span>${escapeHtml(label)}</span></button>`;
}

function twbvOpenInlineInitiativeCardMenu(combat, combatant, anchor) {
  if (!game.user?.isGM || !combat || !combatant || !anchor) return;
  twbvCloseInlineInitiativeMenus();
  const data = combatant.getFlag?.("world-behind-the-veil", "initiative") ?? {};
  const hasCard = Boolean(data.final ?? data.drawn ?? combatant.initiative);
  const menu = document.createElement("div");
  menu.className = "twbv-initiative-inline-menu";
  menu.innerHTML = hasCard
    ? [
        twbvCreateInlineInitiativeMenuAction("fas fa-id-card", "Dar carta", "give"),
        twbvCreateInlineInitiativeMenuAction("fas fa-redo", "Rerrolar gratuitamente", "free"),
        twbvCreateInlineInitiativeMenuAction("fas fa-bolt", "Rerrolar com Eco", "eco")
      ].join("")
    : [
        twbvCreateInlineInitiativeMenuAction("fas fa-id-card", "Sacar iniciativa", "draw"),
        twbvCreateInlineInitiativeMenuAction("fas fa-trash", "Remover participante", "remove")
      ].join("");
  document.body.appendChild(menu);
  const rect = anchor.getBoundingClientRect();
  const menuRect = menu.getBoundingClientRect();
  menu.style.left = `${Math.min(window.innerWidth - menuRect.width - 8, Math.max(8, rect.left - menuRect.width - 8))}px`;
  menu.style.top = `${Math.min(window.innerHeight - menuRect.height - 8, Math.max(8, rect.top))}px`;

  setTimeout(() => document.addEventListener("pointerdown", twbvCloseInlineInitiativeMenus, { once: true }), 0);
  menu.addEventListener("pointerdown", (event) => event.stopPropagation());
  menu.addEventListener("click", async (event) => {
    const button = event.target?.closest?.("button[data-action]");
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    const action = button.dataset.action;
    twbvCloseInlineInitiativeMenus();
    if (action === "give") return twbvOpenInitiativeCardPicker(combat, combatant);
    if (action === "free") return twbvRerollInitiativeCard(combat, combatant, { free: true });
    if (action === "eco") return twbvRerollInitiativeCard(combat, combatant, { spendEco: true });
    if (action === "draw" && typeof combat.rollInitiative === "function") return combat.rollInitiative([combatant.id]);
    if (action === "remove" && typeof combat.deleteEmbeddedDocuments === "function") {
      await combat.deleteEmbeddedDocuments("Combatant", [combatant.id]);
      return twbvPostInitiativeLog("Participante removido", `<p>${escapeHtml(combatant.name)} foi removido da iniciativa.</p>`, { actor: combatant.actor });
    }
    return null;
  });
}

function twbvInitiativeChatEntryHtml(combatant, result) {
  const modifierLabel = result.modifier ? `<span class="twbv-initiative-modifier">${result.modifier > 0 ? "+" : ""}${escapeHtml(result.modifier)}</span>` : "";
  const finalChanged = result.final.key !== result.drawn.key;
  return `<article class="twbv-initiative-entry">
    ${twbvInitiativeCardMiniHtml(result.drawn)}
    <div class="twbv-initiative-entry-main">
      <strong>${escapeHtml(combatant.name)}</strong>
      <span>${escapeHtml(result.drawn.label)}</span>
      ${finalChanged ? `<em>Final: ${twbvInitiativeCardMiniHtml(result.final, { compact: true })} ${escapeHtml(result.final.label)}</em>` : ""}
    </div>
    ${modifierLabel}
  </article>`;
}

function twbvEnhanceCombatTrackerInitiative(app, html) {
  const root = html?.[0] ?? html;
  const combat = app?.viewed ?? game.combat;
  if (!root || !combat) return;
  twbvEnhanceCombatTrackerHeaderControls(app, root);
  twbvEnhanceCombatTrackerRollControls(root);
  const combatants = Array.from(combat.combatants ?? []);
  for (const [index, combatant] of combatants.entries()) {
    const data = combatant.getFlag?.("world-behind-the-veil", "initiative") ?? {};
    const finalMeta = data.final ?? data.drawn ?? twbvInitiativeCardMetaFromSort(combatant.initiative);
    const row = twbvFindCombatantRow(root, combatant, index);
    if (!row) continue;
    row.querySelectorAll?.(".twbv-combat-card-slot").forEach((slot) => slot.remove());
    const slot = document.createElement("button");
    slot.type = "button";
    slot.className = `twbv-combat-card-slot${finalMeta ? "" : " is-empty"}`;
    slot.title = finalMeta
      ? `${finalMeta.label}${game.user?.isGM ? " - clique direito para escolher carta" : ""}`
      : `${game.user?.isGM ? "Clique direito para escolher carta" : "Carta n\u00e3o puxada"}`;
    slot.innerHTML = finalMeta
      ? `${twbvInitiativeCardMiniHtml(finalMeta, { compact: true })}<span class="twbv-combat-card-label">${escapeHtml(finalMeta.label)}</span>`
      : `${twbvInitiativeCardBackMiniHtml({ compact: true })}<span class="twbv-combat-card-label">Carta</span>`;
    slot.addEventListener("click", async (event) => {
      event.preventDefault();
      if (!game.user?.isGM || finalMeta || typeof combat.rollInitiative !== "function") return;
      await combat.rollInitiative([combatant.id]);
    });
    if (game.user?.isGM) {
      slot.addEventListener("contextmenu", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        twbvOpenInlineInitiativeCardMenu(combat, combatant, slot);
      });
    }
    const initiativeHost = row.querySelector(".token-initiative, .combatant-initiative, [data-tooltip='COMBAT.Initiative']")?.parentElement;
    const target = initiativeHost ?? row.querySelector(".combatant-controls, .combatant-control")?.parentElement ?? row;
    target.appendChild(slot);
    twbvHideNativeInitiativeElements(row, combatant);
  }
}

async function twbvShuffleInitiativeDeck(deck) {
  if (!deck) return;
  try {
    if (typeof deck.shuffle === "function") {
      await deck.shuffle({ chatNotification: false });
      return;
    }
  }
  catch (error) {
    console.warn("[TWBV] Shuffle nativo do baralho falhou; mantendo embaralhamento manual no saque.", error);
  }
  twbvPlayInitiativeShuffleSoundDebounced();
}

async function twbvResetInitiativeDeckAndDiscard({ combat = null, notify = false } = {}) {
  if (!game.user?.isGM) return null;
  const deck = await twbvEnsureInitiativeDeck();
  const discard = await twbvEnsureInitiativeDiscardPile();
  if (!deck) return null;
  const deckUpdates = Array.from(deck.cards ?? [])
    .filter((card) => card.drawn)
    .map((card) => ({ _id: card.id, drawn: false }));
  if (deckUpdates.length && typeof deck.updateEmbeddedDocuments === "function") {
    await deck.updateEmbeddedDocuments("Card", deckUpdates);
  }
  const discardIds = Array.from(discard?.cards ?? []).map((card) => card.id).filter(Boolean);
  if (discardIds.length && typeof discard?.deleteEmbeddedDocuments === "function") {
    await discard.deleteEmbeddedDocuments("Card", discardIds);
  }
  await twbvShuffleInitiativeDeck(deck);
  if (combat?.setFlag) {
    await combat.setFlag("world-behind-the-veil", "initiativeJokersRound", []);
    await combat.setFlag("world-behind-the-veil", "initiativeResetPending", false);
  }
  if (notify) ui.notifications?.info("Os dois Jokers sairam. Descarte resetado e baralho embaralhado.");
  return deck;
}

async function twbvClearInitiativeDiscardAndShuffle({ notify = true } = {}) {
  if (!game.user?.isGM) return null;
  const deck = await twbvEnsureInitiativeDeck({ refreshMedia: false });
  const discard = await twbvEnsureInitiativeDiscardPile();
  if (!deck) return null;
  const deckUpdates = Array.from(deck.cards ?? [])
    .filter((card) => card.drawn)
    .map((card) => ({ _id: card.id, drawn: false }));
  if (deckUpdates.length && typeof deck.updateEmbeddedDocuments === "function") {
    await deck.updateEmbeddedDocuments("Card", deckUpdates);
  }
  const discardIds = Array.from(discard?.cards ?? []).map((card) => card.id).filter(Boolean);
  if (discardIds.length && typeof discard?.deleteEmbeddedDocuments === "function") {
    await discard.deleteEmbeddedDocuments("Card", discardIds);
  }
  await twbvShuffleInitiativeDeck(deck);
  if (notify) {
    ui.notifications?.info("Pilha de descarte zerada e baralho embaralhado.");
    await twbvPostInitiativeLog("Descarte reiniciado", "<p>Todas as cartas do descarte foram removidas. O deck foi recomposto e embaralhado.</p>");
  }
  return deck;
}

async function twbvClearCombatInitiativeCards(combat = game.combat, { notify = true } = {}) {
  if (!game.user?.isGM || !combat) return null;
  await twbvClearInitiativeDiscardAndShuffle({ notify: false });
  const updates = Array.from(combat.combatants ?? []).map((combatant) => ({
    _id: combatant.id,
    initiative: null,
    flags: {
      "world-behind-the-veil": {
        "-=initiative": null
      }
    }
  }));
  if (updates.length) await combat.updateEmbeddedDocuments("Combatant", updates);
  if (combat?.setFlag) {
    await combat.setFlag("world-behind-the-veil", "initiativeJokersRound", []);
    await combat.setFlag("world-behind-the-veil", "initiativeResetPending", false);
  }
  if (notify) {
    ui.notifications?.info("Iniciativa limpa. Cartas devolvidas ao deck e embaralhadas.");
    await twbvPostInitiativeLog("Iniciativa limpa", "<p>Todas as iniciativas foram removidas. As cartas foram devolvidas ao deck e embaralhadas.</p>");
  }
  return combat;
}

async function twbvPostInitiativeLog(title, body = "", { actor = null } = {}) {
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `<section class="twbv-initiative-log"><h3>${escapeHtml(title)}</h3>${body}</section>`
  });
}

function twbvIsAwakenedCombatant(combatant) {
  const actor = combatant?.actor;
  const type = twbvNormalizeSlotText(actor?.type ?? actor?.system?.twbvSheetKind ?? actor?.system?.tipo ?? "");
  return type === "despertos" || type === "desperto";
}

async function twbvDrawInitiativeForEligibleCombatants(combat, { onlyMissing = false, reason = "rodada" } = {}) {
  if (!game.user?.isGM || !combat) return [];
  const results = [];
  const updates = [];
  const eligible = Array.from(combat.combatants ?? []).filter((combatant) => !twbvIsAwakenedCombatant(combatant));
  for (const combatant of eligible) {
    const hasCard = Boolean(combatant.getFlag?.("world-behind-the-veil", "initiative")?.final ?? combatant.initiative);
    if (onlyMissing && hasCard) continue;
    const result = await twbvDrawInitiativeForCombatant(combat, combatant);
    if (!result?.final) continue;
    updates.push({
      _id: combatant.id,
      initiative: result.initiative,
      flags: {
        "world-behind-the-veil": {
          initiative: {
            drawn: result.drawn,
            final: result.final,
            modifier: result.modifier,
            fallback: result.fallback,
            searched: result.searched,
            reason
          }
        }
      }
    });
    results.push({ combatant, result });
  }
  if (updates.length) await combat.updateEmbeddedDocuments("Combatant", updates);
  if (results.length) {
    await twbvPostInitiativeLog("Iniciativa", results.map(({ combatant, result }) => (
      twbvInitiativeChatEntryHtml(combatant, result)
    )).join(""), { actor: results[0]?.combatant?.actor ?? null });
  }
  return results;
}

function twbvConfirmNextRoundDialog() {
  return new Promise((resolve) => {
    new Dialog({
      title: "Pr\u00f3xima rodada",
      content: `<section class="twbv-next-round-confirm"><p>Deseja passar para a pr\u00f3xima rodada?</p></section>`,
      buttons: {
        accept: {
          label: "Aceitar",
          icon: '<i class="fas fa-check"></i>',
          callback: () => resolve(true)
        },
        cancel: {
          label: "Cancelar",
          icon: '<i class="fas fa-times"></i>',
          callback: () => resolve(false)
        }
      },
      default: "cancel",
      close: () => resolve(false)
    }, { width: 360 }).render(true);
  });
}

async function twbvPrepareInitiativeForConfirmedNextRound(combat) {
  if (!game.user?.isGM || !combat) return;
  await twbvResetInitiativeDeckAndDiscard({ combat, notify: false });
  if (combat?.setFlag) {
    await combat.setFlag("world-behind-the-veil", "initiativeJokersRound", []);
    await combat.setFlag("world-behind-the-veil", "initiativeResetPending", false);
  }
}

function twbvCombatIsOnLastTurn(combat) {
  const combatants = Array.from(combat?.turns ?? combat?.combatants ?? []);
  if (!combatants.length) return false;
  return Number(combat?.turn ?? 0) >= combatants.length - 1;
}

async function twbvRerollInitiativeCard(combat, combatant, { spendEco = false, free = false } = {}) {
  if (!combat || !combatant) return null;
  if (spendEco && !(await twbvSpendEcoForActor(combatant.actor))) return null;
  const result = await twbvDrawInitiativeForCombatant(combat, combatant);
  if (!result?.final) return null;
  await combat.updateEmbeddedDocuments("Combatant", [{
    _id: combatant.id,
    initiative: result.initiative,
    flags: {
      "world-behind-the-veil": {
        initiative: {
          drawn: result.drawn,
          final: result.final,
          modifier: result.modifier,
          fallback: result.fallback,
          searched: result.searched,
          reroll: spendEco ? "eco" : free ? "free" : "manual"
        }
      }
    }
  }]);
  const label = spendEco ? "Rerrolagem com Eco" : free ? "Rerrolagem gratuita" : "Nova carta";
  await twbvPostInitiativeLog(label, `${twbvInitiativeChatEntryHtml(combatant, result)}<p>${escapeHtml(combatant.name)} ${spendEco ? "gastou 1 Eco e puxou uma nova carta." : "puxou uma nova carta gratuitamente."}</p>`, { actor: combatant.actor });
  return result;
}

async function twbvDiscardInitiativeCard(cardMeta, { combat = null, combatant = null, sourceCardId = "" } = {}) {
  if (!game.user?.isGM || !cardMeta) return null;
  const discard = await twbvEnsureInitiativeDiscardPile();
  if (!discard || typeof discard.createEmbeddedDocuments !== "function") return null;
  const data = await twbvInitiativeCardDocumentData(cardMeta);
  data.flags["world-behind-the-veil"].initiativeDiscardEntry = {
    combatId: combat?.id ?? "",
    combatantId: combatant?.id ?? "",
    sourceCardId,
    round: combat?.round ?? 0,
    card: cardMeta
  };
  try {
    const created = await discard.createEmbeddedDocuments("Card", [data]);
    return created?.[0] ?? null;
  }
  catch (error) {
    console.warn("[TWBV] Nao foi possivel adicionar carta ao descarte.", error);
    return null;
  }
}

function twbvInitiativeUnavailableCards(deck) {
  return Array.from(deck?.cards ?? [])
    .filter((card) => card.drawn)
    .map((card) => twbvInitiativeCardKeyFromDocument(card))
    .filter(Boolean);
}

async function twbvMarkInitiativeDeckCardsDrawn(deck, keys) {
  if (!deck || !keys?.length || typeof deck.updateEmbeddedDocuments !== "function") return;
  const wanted = new Set(keys.filter(Boolean));
  const updates = Array.from(deck.cards ?? [])
    .filter((card) => wanted.has(twbvInitiativeCardKeyFromDocument(card)) && !card.drawn)
    .map((card) => ({ _id: card.id, drawn: true }));
  if (updates.length) await deck.updateEmbeddedDocuments("Card", updates);
}

function twbvRandomAvailableInitiativeCard(deck) {
  const available = Array.from(deck?.cards ?? []).filter((card) => !card.drawn && twbvInitiativeCardMetaFromDocument(card));
  if (!available.length) return null;
  return available[Math.floor(Math.random() * available.length)] ?? null;
}

async function twbvTrackInitiativeJokerDraw(combat, cardMeta) {
  if (!combat?.setFlag || Number(cardMeta?.rankValue ?? 0) !== 15) return;
  const round = combat.round ?? 0;
  const existing = Array.from(combat.getFlag("world-behind-the-veil", "initiativeJokersRound") ?? [])
    .filter((entry) => Number(entry?.round ?? round) === round);
  let added = false;
  if (!existing.some((entry) => entry.key === cardMeta.key)) {
    existing.push({ key: cardMeta.key, label: cardMeta.label, round });
    added = true;
  }
  await combat.setFlag("world-behind-the-veil", "initiativeJokersRound", existing);
  if (added && new Set(existing.map((entry) => entry.key)).size >= 2) {
    await combat.setFlag("world-behind-the-veil", "initiativeResetPending", true);
    ui.notifications?.info("Os dois Jokers sairam nesta rodada. O baralho sera resetado na proxima rodada.");
  }
}

async function twbvDrawInitiativeForCombatant(combat, combatant) {
  if (!game.user?.isGM || !combat || !combatant) return null;
  let deck = await twbvEnsureInitiativeDeck();
  await twbvEnsureInitiativeDiscardPile();
  if (!deck) return null;
  let drawnCard = twbvRandomAvailableInitiativeCard(deck);
  if (!drawnCard) {
    await twbvResetInitiativeDeckAndDiscard({ combat });
    deck = await twbvEnsureInitiativeDeck();
    drawnCard = twbvRandomAvailableInitiativeCard(deck);
  }
  if (!drawnCard) return null;

  const drawnMeta = twbvInitiativeCardMetaFromDocument(drawnCard);
  if (!drawnMeta) return null;
  await twbvMarkInitiativeDeckCardsDrawn(deck, [drawnMeta.key]);
  await twbvDiscardInitiativeCard(drawnMeta, { combat, combatant, sourceCardId: drawnCard.id });
  twbvPlayInitiativeDrawSoundDebounced();

  const modifier = twbvGetActorInitiativeModifier(combatant.actor);
  const unavailable = twbvInitiativeUnavailableCards(deck).filter((key) => key !== drawnMeta.key);
  const resolved = twbvResolveInitiativeCardWithModifier(drawnMeta, modifier, { unavailable, includeJokers: true });
  const resolvedFinal = resolved?.final ?? drawnMeta;
  const finalDeckCard = Array.from(deck.cards ?? []).find((card) => twbvInitiativeCardKeyFromDocument(card) === resolvedFinal.key);
  const finalMeta = finalDeckCard ? (twbvInitiativeCardMetaFromDocument(finalDeckCard) ?? resolvedFinal) : resolvedFinal;
  if (finalMeta.key !== drawnMeta.key) {
    await twbvMarkInitiativeDeckCardsDrawn(deck, [finalMeta.key]);
    await twbvDiscardInitiativeCard(finalMeta, { combat, combatant });
    twbvPlayInitiativeDrawSoundDebounced();
  }
  await twbvTrackInitiativeJokerDraw(combat, drawnMeta);
  await twbvTrackInitiativeJokerDraw(combat, finalMeta);
  return {
    drawn: drawnMeta,
    final: finalMeta,
    modifier,
    initiative: Number(finalMeta.sort ?? 0),
    fallback: Boolean(resolved?.fallback),
    searched: resolved?.searched ?? []
  };
}

function twbvPatchCombatCardInitiative() {
  const CombatClass = globalThis.Combat;
  if (!CombatClass?.prototype || CombatClass.prototype._twbvCardInitiativePatched) return;
  const originalRollInitiative = CombatClass.prototype.rollInitiative;
  const originalNextTurn = CombatClass.prototype.nextTurn;
  const originalNextRound = CombatClass.prototype.nextRound;
  CombatClass.prototype._twbvCardInitiativePatched = true;
  CombatClass.prototype.rollInitiative = async function (ids, options = {}) {
    if (!game.user?.isGM) return originalRollInitiative.call(this, ids, options);
    const requestedIds = ids === undefined || ids === null
      ? Array.from(this.combatants ?? []).map((combatant) => combatant.id)
      : Array.isArray(ids) || ids instanceof Set
        ? Array.from(ids)
        : [ids];
    const updates = [];
    const messages = [];
    for (const id of requestedIds) {
      const combatant = this.combatants.get(id);
      if (!combatant) continue;
      const result = await twbvDrawInitiativeForCombatant(this, combatant);
      if (!result?.final) continue;
      updates.push({
        _id: combatant.id,
        initiative: result.initiative,
        flags: {
          "world-behind-the-veil": {
            initiative: {
              drawn: result.drawn,
              final: result.final,
              modifier: result.modifier,
              fallback: result.fallback,
              searched: result.searched
            }
          }
        }
      });
      messages.push(twbvInitiativeChatEntryHtml(combatant, result));
    }
    if (updates.length) await this.updateEmbeddedDocuments("Combatant", updates);
    if (messages.length) {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker(),
        content: `<section class="twbv-initiative-card-chat"><h3>Iniciativa</h3>${messages.join("")}</section>`
      });
    }
    return this;
  };
  if (typeof originalNextTurn === "function") {
    CombatClass.prototype.nextTurn = async function (...args) {
      if (!game.user?.isGM || !twbvCombatIsOnLastTurn(this)) return originalNextTurn.apply(this, args);
      const confirmed = await twbvConfirmNextRoundDialog();
      if (!confirmed) return this;
      await twbvPrepareInitiativeForConfirmedNextRound(this);
      this._twbvNextRoundConfirmed = true;
      try {
        return await originalNextTurn.apply(this, args);
      }
      finally {
        this._twbvNextRoundConfirmed = false;
      }
    };
  }
  if (typeof originalNextRound === "function") {
    CombatClass.prototype.nextRound = async function (...args) {
      if (!game.user?.isGM) return originalNextRound.apply(this, args);
      if (!this._twbvNextRoundConfirmed) {
        const confirmed = await twbvConfirmNextRoundDialog();
        if (!confirmed) return this;
        await twbvPrepareInitiativeForConfirmedNextRound(this);
      }
      return originalNextRound.apply(this, args);
    };
  }
}

async function twbvMaybeResetInitiativeDeckOnRound(combat, changed = {}) {
  if (!game.user?.isGM) return;
  if (changed.round === undefined && changed.active !== true) return;
  const pending = Boolean(combat.getFlag("world-behind-the-veil", "initiativeResetPending"));
  if (pending) await twbvResetInitiativeDeckAndDiscard({ combat, notify: true });
  else await combat.setFlag("world-behind-the-veil", "initiativeJokersRound", []);
  const round = Number(combat.round ?? changed.round ?? 0);
  await twbvDrawInitiativeForEligibleCombatants(combat, {
    onlyMissing: round <= 1,
    reason: round <= 1 ? "inicio" : "nova-rodada"
  });
}

function twbvInstallInitiativeApi() {
  const api = {
    suits: TWBV_INITIATIVE_SUITS,
    ranks: TWBV_INITIATIVE_RANKS,
    buildCard: twbvBuildInitiativeCard,
    buildDeckCards: twbvBuildInitiativeDeckCards,
    normalizeCard: twbvNormalizeInitiativeCard,
    resolveCard: twbvResolveInitiativeCardWithModifier,
    getActorModifier: twbvGetActorInitiativeModifier,
    findDeck: twbvFindInitiativeDeck,
    ensureDeck: twbvEnsureInitiativeDeck,
    findDiscard: twbvFindInitiativeDiscardPile,
    ensureDiscard: twbvEnsureInitiativeDiscardPile,
    resetDeck: twbvResetInitiativeDeckAndDiscard,
    drawForCombatant: twbvDrawInitiativeForCombatant,
    animatedDeckStatus: twbvInitiativeAnimatedDeckStatus,
    suitOrder: [...TWBV_INITIATIVE_SUIT_ORDER]
  };
  globalThis.TWBV = foundry.utils.mergeObject(globalThis.TWBV ?? {}, { initiative: api }, { inplace: false });
  game.twbv = foundry.utils.mergeObject(game.twbv ?? {}, { initiative: api }, { inplace: false });
  return api;
}

function twbvPowerEffectTypeMeta(type) {
  return TWBV_POWER_EFFECT_TYPES.find((entry) => entry.value === String(type ?? "")) ?? TWBV_POWER_EFFECT_TYPES[TWBV_POWER_EFFECT_TYPES.length - 1];
}

function twbvNormalizePowerEffects(rawEffects) {
  const source = Array.isArray(rawEffects)
    ? rawEffects
    : Object.entries(rawEffects ?? {})
      .filter(([key]) => /^\d+$/.test(key))
      .sort(([left], [right]) => Number(left) - Number(right))
      .map(([, value]) => value);
  return source.map((effect) => {
    const type = String(effect?.type ?? "custom").trim() || "custom";
    const meta = twbvPowerEffectTypeMeta(type);
    return {
      id: String(effect?.id ?? foundry.utils.randomID(8)),
      type,
      label: String(effect?.label ?? meta.defaultLabel ?? meta.label).trim() || meta.label,
      manaPerStep: Math.max(0, twbvNumberOrZero(effect?.manaPerStep ?? meta.manaPerStep)),
      stepLabel: String(effect?.stepLabel ?? meta.stepLabel ?? "+1 passo").trim(),
      description: String(effect?.description ?? meta.description ?? "").trim()
    };
  });
}

function twbvDefaultPowerEffect(type = "custom") {
  const meta = twbvPowerEffectTypeMeta(type);
  return {
    id: foundry.utils.randomID(8),
    type: meta.value,
    label: meta.defaultLabel ?? meta.label,
    manaPerStep: meta.manaPerStep,
    stepLabel: meta.stepLabel,
    description: meta.description
  };
}

function twbvPowerEffectQuantityText(effect, quantity) {
  const amount = Math.max(0, Number(quantity ?? 0));
  if (!amount) return "";
  if (effect.type === "damage") return `+${amount}d6 de dano`;
  if (effect.type === "sphere") return `+${amount} quadrado(s) de raio`;
  if (effect.type === "cone") return `+${amount * 2} quadrado(s) no cone`;
  if (effect.type === "line") return `linha x${Math.pow(2, amount)}`;
  if (effect.type === "glyph") {
    const squares = amount <= 1 ? amount : (amount - 1) * 2;
    return `+${squares} quadrado(s) de área do glifo`;
  }
  return `${effect.stepLabel || "passo"} x${amount}`;
}

function twbvBuildPowerCastSummary(effects, quantities) {
  return effects
    .map((effect, index) => {
      const quantity = Math.max(0, Number(quantities[index] ?? 0));
      if (!quantity) return null;
      const cost = quantity * Math.max(0, Number(effect.manaPerStep ?? 0));
      return {
        label: effect.label,
        type: effect.type,
        quantity,
        cost,
        detail: twbvPowerEffectQuantityText(effect, quantity),
        description: effect.description
      };
    })
    .filter(Boolean);
}

function twbvParseDiceFormula(formula) {
  const text = String(formula ?? "").trim();
  const match = text.match(/^(\d*)d(\d+)(.*)$/i);
  if (!match) return null;
  return {
    count: Math.max(1, Number(match[1] || 1)),
    die: Number(match[2]),
    suffix: String(match[3] ?? "")
  };
}

function twbvFormatPowerDamage(baseDamage, extraDice = 0) {
  const parsed = twbvParseDiceFormula(baseDamage);
  if (!parsed) return String(baseDamage ?? "").trim() || "-";
  return `${Math.max(1, parsed.count + Math.max(0, Number(extraDice ?? 0)))}d${parsed.die}${parsed.suffix}`;
}

function twbvGetAreaStepType(areaValue) {
  const preset = twbvGetPowerAreaPreset(areaValue);
  if (preset.shape === "sphere") return "sphere";
  if (preset.shape === "cone") return "cone";
  if (preset.shape === "line") return "line";
  if (preset.shape === "glyph") return "glyph";
  if (preset.shape === "aura") return "aura";
  return "custom";
}

function twbvGetPowerTouchRange(actor, power) {
  const skillName = String(power?.system?.skill ?? power?.system?.pericia ?? "").trim();
  const skill = skillName ? findSkillByName(actor?.system, skillName) : null;
  const attrKey = String(skill?.atributo ?? "").trim().toLowerCase();
  const attribute = attrKey ? actor?.system?.atributos?.[attrKey] : null;
  const die = Number(attribute?.passo ?? attribute?.dado ?? skill?.dado ?? 0);
  return Number.isFinite(die) && die > 0 ? die : 0;
}

function twbvBuildAreaCastSummary(baseAreaValue, selectedAreaValue, areaSize = 1, { actor = null, power = null } = {}) {
  const base = twbvGetPowerAreaPreset(baseAreaValue);
  const selected = twbvGetPowerAreaPreset(selectedAreaValue);
  if (!selected || selected.value === "none") return null;
  if (base.shape === "touch" && selected.shape === "target") {
    const range = twbvGetPowerTouchRange(actor, power);
    const areaLabel = range ? `Alvo alcance ${range}` : "Alvo";
    return {
      label: "Area",
      type: "target-range",
      quantity: 1,
      cost: 2,
      areaPreset: selected.value,
      areaLabel,
      areaSquares: 0,
      converted: true,
      detail: range ? `Toque para alvo com alcance ${range}` : "Toque para alvo",
      description: "Converte magia de toque em alcance pelo atributo da pericia."
    };
  }
  if (selected.shape === "target") return null;
  if (selected.shape === "touch") return {
    label: "Area",
    type: "touch",
    quantity: 0,
    cost: 0,
    areaPreset: selected.value,
    areaLabel: "Toque",
    areaSquares: 0,
    converted: base.shape !== "touch",
    detail: "Toque",
    description: selected.summary
  };
  const converted = base.shape !== selected.shape || base.value === "none";
  const finalSize = twbvClampPowerAreaSize(selected.value, areaSize ?? selected.squares ?? 1);
  const freeSize = !converted && base.shape === selected.shape ? Math.max(1, Number(base.squares ?? 1)) : Math.max(1, Number(selected.squares ?? 1));
  const conversionCost = converted ? 1 : 0;
  const stepCost = selected.shape === "line"
    ? Math.max(0, Math.round(Math.log2(Math.max(1, finalSize / freeSize))))
    : Math.max(0, finalSize - freeSize);
  const areaLabel = twbvFormatPowerAreaLabel(selected, finalSize);
  return {
    label: "Area",
    type: twbvGetAreaStepType(selected.value),
    quantity: Math.max(0, finalSize - Math.max(1, Number(selected.squares ?? 1))),
    cost: conversionCost + stepCost,
    areaPreset: selected.value,
    areaLabel,
    areaSquares: finalSize,
    converted,
    detail: `${converted ? `Alterou de ${base.value === "none" ? "sem area" : base.label} para ${areaLabel}` : areaLabel}${stepCost ? ` (+${stepCost} acima da base)` : ""}`,
    description: selected.summary
  };
}

function twbvShouldIncludeAreaCastSummary(baseAreaValue, areaSummary) {
  if (!areaSummary) return false;
  const base = twbvGetPowerAreaPreset(baseAreaValue);
  return Boolean(areaSummary.converted || areaSummary.areaSquares !== Math.max(1, Number(base.squares || 1)));
}

function twbvFormatPowerAreaLabel(preset, size) {
  if (!preset || preset.value === "none") return "Nenhuma";
  const value = Number(size ?? preset.squares ?? 1);
  if (preset.shape === "cone") {
    if (value >= 9) return "Cone grande";
    if (value >= 6) return "Cone m\u00e9dio";
    return "Cone pequeno";
  }
  if (preset.shape === "sphere") {
    if (value >= 4) return "Explos\u00e3o m\u00e1xima";
    if (value >= 3) return "Explos\u00e3o grande";
    if (value >= 2) return "Explos\u00e3o m\u00e9dia";
    return "Explos\u00e3o pequena";
  }
  if (preset.shape === "line") {
    if (value >= 24) return "Linha grande";
    if (value >= 12) return "Linha m\u00e9dia";
    return "Linha pequena";
  }
  if (preset.shape === "glyph") return "Glifo";
  if (preset.shape === "aura") return "Aura";
  if (preset.shape === "touch") return "Toque";
  if (preset.shape === "target") return "Alvo";
  return preset.label ?? "Area";
}

function twbvClampPowerAreaSize(areaValue, size) {
  const preset = twbvGetPowerAreaPreset(areaValue);
  const value = Number(size ?? preset.squares ?? 1);
  if (preset.shape === "sphere") return Math.min(4, Math.max(1, Number.isFinite(value) ? value : Number(preset.squares ?? 1)));
  if (preset.shape === "line") {
    const base = Math.max(1, Number(preset.squares ?? 6));
    const max = base * 8;
    const clamped = Math.min(max, Math.max(base, Number.isFinite(value) ? value : base));
    const steps = [base, base * 2, base * 4, base * 8];
    return steps.reduce((closest, option) => Math.abs(option - clamped) < Math.abs(closest - clamped) ? option : closest, steps[0]);
  }
  if (preset.shape === "cone") {
    const coneSteps = [3.5, 6.5, 9.5];
    const clamped = Math.min(9.5, Math.max(3.5, Number.isFinite(value) ? value : preset.squares));
    return coneSteps.reduce((closest, option) => Math.abs(option - clamped) < Math.abs(closest - clamped) ? option : closest, coneSteps[0]);
  }
  return Math.max(1, Number.isFinite(value) ? value : 1);
}

function twbvStepPowerAreaSize(areaValue, currentSize, step) {
  const preset = twbvGetPowerAreaPreset(areaValue);
  if (preset.shape === "cone") {
    const coneSteps = [3.5, 6.5, 9.5];
    const current = twbvClampPowerAreaSize(areaValue, currentSize);
    const index = Math.max(0, coneSteps.indexOf(current));
    const nextIndex = Math.clamp(index + Math.sign(Number(step ?? 0)), 0, coneSteps.length - 1);
    return coneSteps[nextIndex];
  }
  if (preset.shape === "line") {
    const presetBase = Math.max(1, Number(preset.squares ?? 6));
    const lineSteps = [presetBase, presetBase * 2, presetBase * 4, presetBase * 8];
    const current = twbvClampPowerAreaSize(areaValue, currentSize);
    const index = Math.max(0, lineSteps.indexOf(current));
    const nextIndex = Math.clamp(index + Math.sign(Number(step ?? 0)), 0, lineSteps.length - 1);
    return lineSteps[nextIndex];
  }
  return twbvClampPowerAreaSize(areaValue, Number(currentSize ?? 1) + Number(step ?? 0));
}

function twbvPowerAreaInputDisplayValue(areaValue, size) {
  const preset = twbvGetPowerAreaPreset(areaValue);
  const value = twbvClampPowerAreaSize(areaValue, size);
  if (preset.shape === "cone") {
    if (value >= 9) return "9";
    if (value >= 6) return "6";
    return "3";
  }
  return String(value);
}

function twbvGetSceneGridDistance() {
  const distance = Number(canvas?.scene?.grid?.distance ?? canvas?.grid?.distance ?? 2);
  return Number.isFinite(distance) && distance > 0 ? distance : 2;
}

function twbvGetSceneGridSize() {
  const size = Number(canvas?.scene?.grid?.size ?? canvas?.grid?.size ?? 100);
  return Number.isFinite(size) && size > 0 ? size : 100;
}

function twbvSnapPointToGridCenter(point) {
  const x = Number(point?.x);
  const y = Number(point?.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return point;
  const gridSize = twbvGetSceneGridSize();
  const dimensions = canvas?.dimensions ?? {};
  const originX = Number.isFinite(Number(dimensions.sceneX)) ? Number(dimensions.sceneX) : 0;
  const originY = Number.isFinite(Number(dimensions.sceneY)) ? Number(dimensions.sceneY) : 0;
  return {
    x: originX + (Math.floor((x - originX) / gridSize) * gridSize) + (gridSize / 2),
    y: originY + (Math.floor((y - originY) / gridSize) * gridSize) + (gridSize / 2)
  };
}

function twbvGetPowerAreaSquares(areaValue, summary = []) {
  const preset = twbvGetPowerAreaPreset(areaValue);
  let squares = Math.max(0, Number(preset.squares ?? 0));
  for (const entry of summary ?? []) {
    if (entry?.label === "Area" && entry.areaSquares) {
      squares = Math.max(1, Number(entry.areaSquares));
      continue;
    }
    const quantity = Math.max(0, Number(entry?.quantity ?? 0));
    if (!quantity) continue;
    if (preset.shape === "sphere" && entry.type === "sphere") squares += quantity;
    if (preset.shape === "cone" && entry.type === "cone") squares += quantity * 2;
    if (preset.shape === "line" && entry.type === "line") squares *= Math.pow(2, quantity);
    if (preset.shape === "glyph" && entry.type === "glyph") squares += quantity <= 1 ? quantity : (quantity - 1) * 2;
    if (preset.shape === "aura" && entry.type === "aura") squares += quantity;
  }
  return Math.max(0, squares);
}

function twbvGetActorTemplateToken(actor) {
  const controlled = canvas?.tokens?.controlled?.[0];
  if (controlled) return controlled;
  const active = actor?.getActiveTokens?.()?.[0];
  if (active) return active;
  const actorId = String(actor?.id ?? "");
  const actorUuid = String(actor?.uuid ?? "");
  return canvas?.tokens?.placeables?.find?.((token) => (
    (actorId && String(token?.actor?.id ?? token?.document?.actorId ?? "") === actorId) ||
    (actorUuid && String(token?.actor?.uuid ?? "") === actorUuid)
  )) ?? null;
}

function twbvGetTemplateOrigin(actor) {
  const token = twbvGetActorTemplateToken(actor);
  if (token?.center) return { x: token.center.x, y: token.center.y };
  const dimensions = canvas?.dimensions ?? {};
  const sceneX = Number.isFinite(Number(dimensions.sceneX)) ? Number(dimensions.sceneX) : 0;
  const sceneY = Number.isFinite(Number(dimensions.sceneY)) ? Number(dimensions.sceneY) : 0;
  const sceneWidth = Number.isFinite(Number(dimensions.sceneWidth)) ? Number(dimensions.sceneWidth) : Number(dimensions.width ?? 0);
  const sceneHeight = Number.isFinite(Number(dimensions.sceneHeight)) ? Number(dimensions.sceneHeight) : Number(dimensions.height ?? 0);
  return { x: sceneX + (sceneWidth / 2), y: sceneY + (sceneHeight / 2) };
}

function twbvGetCanvasPointFromPointerEvent(event) {
  const clientX = Number(event?.clientX);
  const clientY = Number(event?.clientY);
  if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) return null;
  return twbvGetCanvasPointFromClientPoint(clientX, clientY);
}

function twbvGetCanvasPointFromClientPoint(clientX, clientY) {
  const x = Number(clientX);
  const y = Number(clientY);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  if (typeof canvas?.canvasCoordinatesFromClient === "function") {
    const point = canvas.canvasCoordinatesFromClient({ x, y });
    if (Number.isFinite(Number(point?.x)) && Number.isFinite(Number(point?.y))) return point;
  }
  try {
    if (globalThis.PIXI && canvas?.stage?.worldTransform) {
      const point = canvas.stage.worldTransform.applyInverse(new PIXI.Point(x, y));
      if (Number.isFinite(Number(point?.x)) && Number.isFinite(Number(point?.y))) return point;
    }
  } catch (_) {
    return null;
  }
  return null;
}

function twbvClampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function twbvGetVisibleCanvasPreviewAnchor(excludedElement = null) {
  const viewRect = canvas?.app?.view?.getBoundingClientRect?.();
  if (!viewRect) return null;
  const margin = 24;
  const minWidth = 170;
  const minHeight = 140;
  const viewport = {
    left: viewRect.left + margin,
    right: viewRect.right - margin,
    top: viewRect.top + margin,
    bottom: viewRect.bottom - margin
  };
  if (viewport.right <= viewport.left || viewport.bottom <= viewport.top) return null;

  const excludedRect = excludedElement?.closest?.(".window-app")?.getBoundingClientRect?.()
    ?? excludedElement?.getBoundingClientRect?.()
    ?? null;
  const centerY = (viewport.top + viewport.bottom) / 2;
  const centerX = (viewport.left + viewport.right) / 2;
  const candidates = [];
  if (excludedRect) {
    const rightWidth = viewport.right - Math.max(viewport.left, excludedRect.right + margin);
    if (rightWidth >= minWidth) {
      candidates.push({
        x: excludedRect.right + margin + (rightWidth / 2),
        y: twbvClampNumber((excludedRect.top + excludedRect.bottom) / 2, viewport.top, viewport.bottom)
      });
    }
    const leftWidth = Math.min(viewport.right, excludedRect.left - margin) - viewport.left;
    if (leftWidth >= minWidth) {
      candidates.push({
        x: viewport.left + (leftWidth / 2),
        y: twbvClampNumber((excludedRect.top + excludedRect.bottom) / 2, viewport.top, viewport.bottom)
      });
    }
    const bottomHeight = viewport.bottom - Math.max(viewport.top, excludedRect.bottom + margin);
    if (bottomHeight >= minHeight) candidates.push({ x: centerX, y: excludedRect.bottom + margin + (bottomHeight / 2) });
    const topHeight = Math.min(viewport.bottom, excludedRect.top - margin) - viewport.top;
    if (topHeight >= minHeight) candidates.push({ x: centerX, y: viewport.top + (topHeight / 2) });
  }
  candidates.push({ x: centerX, y: centerY });

  for (const candidate of candidates) {
    const point = twbvGetCanvasPointFromClientPoint(candidate.x, candidate.y);
    if (point) return twbvSnapPointToGridCenter(point);
  }
  return null;
}

function twbvGetActivePowerAreaPresetTool() {
  const candidates = [
    ui?.controls?.active,
    ui?.controls?.activeControl,
    ui?.controls?.activeTool,
    ui?.controls?.tool,
    ui?.controls?.control?.active,
    ui?.controls?.control?.activeControl,
    ui?.controls?.control?.activeTool,
    ui?.controls?.control?.tool,
    ui?.controls?.controls?.find?.((control) => control?.active)?.activeTool,
    ui?.controls?.controls?.find?.((control) => control?.active)?.tool
  ];
  for (const candidate of candidates) {
    const value = typeof candidate === "string" ? candidate : candidate?.name ?? candidate?.id;
    const directName = String(value ?? "").match(/twbv-[a-z0-9-]+/i)?.[0];
    if (!directName) continue;
    const preset = twbvGetPowerAreaPreset(directName.replace(/^twbv-/i, ""));
    if (preset?.value && preset.value !== "none") return preset;
  }
  return null;
}

function twbvBuildMeasuredTemplateData(areaValue, { actor = null, power = null, summary = [], x = null, y = null, direction = 0, pendingCast = false } = {}) {
  const preset = twbvGetPowerAreaPreset(areaValue);
  if (!preset || preset.value === "none" || !preset.templateType) return null;
  const gridDistance = twbvGetSceneGridDistance();
  const gridSize = twbvGetSceneGridSize();
  const squares = twbvGetPowerAreaSquares(preset.value, summary);
  const token = twbvGetActorTemplateToken(actor);
  const tokenWidth = Math.max(Number(token?.document?.width ?? token?.w / canvas?.grid?.size ?? 1), Number(token?.document?.height ?? token?.h / canvas?.grid?.size ?? 1), 1);
  const origin = twbvGetTemplateOrigin(actor);
  const hasExplicitAnchor = Number.isFinite(Number(x)) && Number.isFinite(Number(y));
  const forceTokenOrigin = preset.shape === "aura" && !hasExplicitAnchor;
  const squareSide = preset.shape === "sphere" ? (squares * 2) + 1 : squares;
  const distance = preset.shape === "aura" ? (squares + tokenWidth / 2) * gridDistance : squareSide * gridDistance;
  const rawAnchor = {
    x: !forceTokenOrigin && Number.isFinite(Number(x)) ? Number(x) : origin.x,
    y: !forceTokenOrigin && Number.isFinite(Number(y)) ? Number(y) : origin.y
  };
  const anchor = forceTokenOrigin ? rawAnchor : twbvSnapPointToGridCenter(rawAnchor);
  const data = {
    t: preset.templateType,
    user: game.user?.id,
    x: anchor.x,
    y: anchor.y,
    distance,
    direction: Number.isFinite(Number(direction)) ? Number(direction) : 0,
    fillColor: game.user?.color ?? "#7b4fff",
    flags: {
      "world-behind-the-veil": {
        areaPreset: preset.value,
        areaLabel: preset.label,
        squares,
        shape: preset.shape,
        powerUuid: power?.uuid ?? "",
        pendingCast: Boolean(pendingCast)
      }
    }
  };
  if (preset.templateType === "cone") data.angle = Number(preset.angle ?? 53.13);
  if (preset.templateType === "ray") data.width = Math.max(1, Number(preset.widthSquares ?? 1)) * gridDistance;
  if (preset.templateType === "rect") data.width = Math.max(gridDistance, distance);
  return data;
}

function twbvPatchMeasuredTemplateShapes() {
  const TemplateClass = foundry?.canvas?.placeables?.MeasuredTemplate;
  if (!TemplateClass?.prototype || TemplateClass.prototype._twbvCustomShapePatched) return;
  const originalComputeShape = TemplateClass.prototype._computeShape;
  TemplateClass.prototype._computeShape = function (...args) {
    const shape = this.document?.getFlag?.("world-behind-the-veil", "shape");
    if (shape === "sphere" || shape === "glyph") {
      const gridSize = twbvGetSceneGridSize();
      const squares = Math.max(1, Number(this.document?.getFlag?.("world-behind-the-veil", "squares") ?? 1));
      const sideSquares = shape === "sphere" ? (squares * 2) + 1 : squares;
      const sidePixels = sideSquares * gridSize;
      return new PIXI.Rectangle(-(sidePixels / 2), -(sidePixels / 2), sidePixels, sidePixels);
    }
    return originalComputeShape.call(this, ...args);
  };
  TemplateClass.prototype._twbvCustomShapePatched = true;
}

async function twbvCreatePowerMeasuredTemplate(areaValue, options = {}) {
  if (!canvas?.scene) {
    ui.notifications?.warn("Abra uma cena para posicionar a area da magia.");
    return null;
  }
  const data = twbvBuildMeasuredTemplateData(areaValue, options);
  if (!data) {
    ui.notifications?.warn("Este poder n\u00e3o tem \u00e1rea configurada.");
    return null;
  }
  const documents = await canvas.scene.createEmbeddedDocuments("MeasuredTemplate", [data]);
  const document = documents?.[0] ?? null;
  if (!document) return null;
  try {
    await canvas?.templates?.draw?.();
  } catch (_) {}
  try {
    const placeable = canvas?.templates?.get?.(document.id) ?? canvas?.templates?.placeables?.find?.((template) => template?.document?.id === document.id);
    placeable?.refresh?.();
    if (canvas?.animatePan && Number.isFinite(Number(document.x)) && Number.isFinite(Number(document.y))) {
      canvas.animatePan({ x: document.x, y: document.y, scale: canvas.stage?.scale?.x ?? 1 });
    }
  } catch (error) {
    console.warn("[TWBV] Falha ao focar area revelada.", error);
  }
  twbvRestoreDefaultCanvasLayer();
  return document;
}

async function twbvSyncPowerMeasuredTemplate(existingTemplate, areaValue, options = {}) {
  if (!existingTemplate || existingTemplate.destroyed) return twbvCreatePowerMeasuredTemplate(areaValue, options);
  const preset = twbvGetPowerAreaPreset(areaValue);
  const anchorX = existingTemplate.x;
  const anchorY = existingTemplate.y;
  const data = twbvBuildMeasuredTemplateData(areaValue, {
    ...options,
    x: preset.shape === "aura" ? null : anchorX,
    y: preset.shape === "aura" ? null : anchorY,
    direction: existingTemplate.direction
  });
  if (!data) return null;
  await existingTemplate.update(data);
  return existingTemplate;
}

function twbvRestoreDefaultCanvasLayer({ clearPreview = false } = {}) {
  try {
    const preview = globalThis._twbvActiveMeasuredTemplatePreview;
    if (clearPreview && preview && !preview.destroyed && !preview._destroyed) preview.destroy({ children: true });
  } catch (_) {}
  try {
    const tokenLayer = canvas?.tokens ?? canvas?.layers?.find?.((layer) => String(layer?.name ?? "").toLowerCase() === "tokens");
    tokenLayer?.activate?.();
  } catch (error) {
    console.warn("[TWBV] Falha ao devolver o canvas para a camada de tokens.", error);
  }
  try {
    ui?.controls?.initialize?.({ control: "token", tool: "select" });
  } catch (_) {
    try { ui?.controls?.initialize?.({ control: "tokens", tool: "select" }); } catch (_) {}
  }
}

function twbvDestroyActivePowerAreaPreview({ restoreLayer = true } = {}) {
  try {
    const preview = globalThis._twbvActiveMeasuredTemplatePreview;
    if (preview && !preview.destroyed && !preview._destroyed) preview.destroy({ children: true });
    globalThis._twbvActiveMeasuredTemplatePreview = null;
  } catch (error) {
    console.warn("[TWBV] Falha ao limpar previa de area ativa.", error);
  }
  if (restoreLayer) twbvRestoreDefaultCanvasLayer();
}

class TWBVMeasuredTemplatePreview extends foundry.canvas.placeables.MeasuredTemplate {
  handlers = {};

  static fromArea(areaValue, options = {}) {
    if (!canvas?.scene) {
      ui.notifications?.warn("Abra uma cena para posicionar a area da magia.");
      return null;
    }
    const existingPreview = globalThis._twbvActiveMeasuredTemplatePreview;
    if (existingPreview && !existingPreview._destroyed) existingPreview.destroy({ children: true });

    const needsVisibleAnchor = Boolean(options.pendingCast)
      && !Number.isFinite(Number(options.x))
      && !Number.isFinite(Number(options.y));
    const visibleAnchor = needsVisibleAnchor ? twbvGetVisibleCanvasPreviewAnchor(options.previewOriginElement ?? null) : null;
    const data = twbvBuildMeasuredTemplateData(areaValue, visibleAnchor ? { ...options, x: visibleAnchor.x, y: visibleAnchor.y } : options);
    if (!data) {
      ui.notifications?.warn("Este poder n\u00e3o tem \u00e1rea configurada.");
      return null;
    }
    const DocumentClass = CONFIG?.MeasuredTemplate?.documentClass;
    if (!DocumentClass) return null;
    const document = new DocumentClass(data, { parent: canvas.scene });
    const template = new this(document);
    globalThis._twbvActiveMeasuredTemplatePreview = template;
    template.drawPreview();
    return template;
  }

  drawPreview({ activateListeners = true } = {}) {
    this._twbvInitialLayer = canvas.activeLayer;
    const pendingCast = Boolean(this.document.getFlag?.("world-behind-the-veil", "pendingCast"));
    this.draw();
    if (!pendingCast) this.layer.activate();
    this.layer.preview?.addChild(this);
    if (activateListeners) this.activatePreviewListeners();
    if (pendingCast) twbvRestoreDefaultCanvasLayer();
    return this;
  }

  _moveToVisibleTemplateContainer() {
    const container = this.layer?.objects ?? canvas?.templates?.objects;
    if (!container) return;
    try {
      container.addChild(this);
      this.visible = true;
      this.renderable = true;
    } catch (error) {
      console.warn("[TWBV] Falha ao manter previa de area visivel.", error);
    }
  }

  _updatePositionFromEvent(event) {
    const center = event?.data?.getLocalPosition?.(this.layer);
    if (!center) return;
    const snapped = twbvSnapPointToGridCenter(center);
    this.document.updateSource({ x: snapped.x, y: snapped.y });
    this.refresh();
  }

  activatePreviewListeners() {
    let moveTime = 0;
    this.handlers.mm = (event) => {
      event.stopPropagation();
      const now = Date.now();
      if (now - moveTime <= 20) return;
      this._updatePositionFromEvent(event);
      moveTime = now;
    };
    this.handlers.rc = (event) => {
      event.stopPropagation();
      event.preventDefault?.();
      this.destroy({ children: true });
      this._twbvInitialLayer?.activate?.();
    };
    this.handlers.lc = (event) => {
      event.stopPropagation();
      this._updatePositionFromEvent(event);
      const pendingCast = Boolean(this.document.getFlag?.("world-behind-the-veil", "pendingCast"));
      if (pendingCast) {
        this._removePreviewListeners({ keepContext: true, keepWheel: true });
        this._twbvPlacedPreview = true;
        this._moveToVisibleTemplateContainer();
        this.refresh();
        twbvRestoreDefaultCanvasLayer();
        ui.notifications?.info("Pr\u00e9via posicionada apenas para voc\u00ea.");
        return;
      }
      const data = this.document.toObject();
      this.destroy({ children: true });
      this._twbvInitialLayer?.activate?.();
      void canvas.scene?.createEmbeddedDocuments("MeasuredTemplate", [data]);
    };
    this.handlers.mw = (event) => {
      event.stopPropagation();
      if (event.ctrlKey) event.preventDefault();
      const type = String(this.document.t ?? this.document.type ?? "");
      if (!["cone", "ray", "rect"].includes(type)) return;
      const snap = event.shiftKey ? 15 : 5;
      this.document.updateSource({ direction: Number(this.document.direction ?? 0) + (snap * Math.sign(event.deltaY)) });
      this.refresh();
    };
    canvas.stage.on("mousemove", this.handlers.mm);
    canvas.stage.on("mousedown", this.handlers.lc);
    canvas.app.view.oncontextmenu = this.handlers.rc;
    canvas.app.view.onwheel = this.handlers.mw;
  }

  destroy(...args) {
    const pendingCast = Boolean(this.document?.getFlag?.("world-behind-the-veil", "pendingCast"));
    if (globalThis._twbvActiveMeasuredTemplatePreview === this) globalThis._twbvActiveMeasuredTemplatePreview = null;
    this._removePreviewListeners();
    const result = super.destroy(...args);
    if (pendingCast) twbvRestoreDefaultCanvasLayer();
    return result;
  }

  _removePreviewListeners({ keepContext = false, keepWheel = false } = {}) {
    if (this.handlers.mm) canvas?.stage?.off?.("mousemove", this.handlers.mm);
    if (this.handlers.lc) canvas?.stage?.off?.("mousedown", this.handlers.lc);
    if (canvas?.app?.view) {
      if (!keepContext && canvas.app.view.oncontextmenu === this.handlers.rc) canvas.app.view.oncontextmenu = null;
      if (!keepWheel && canvas.app.view.onwheel === this.handlers.mw) canvas.app.view.onwheel = null;
    }
  }
}

async function twbvPreviewPowerMeasuredTemplate(areaValue, options = {}) {
  return TWBVMeasuredTemplatePreview.fromArea(areaValue, options);
}

function twbvRefreshMeasuredTemplatePlaceable(template) {
  if (!template || template.destroyed || template._destroyed) return;
  try {
    if (typeof template._computeShape === "function") template.shape = template._computeShape();
  } catch (_) {}
  try {
    template.renderFlags?.set?.({
      refreshShape: true,
      refreshPosition: true,
      refreshTemplate: true,
      refresh: true
    });
  } catch (_) {}
  try { template.refresh?.(); } catch (_) {}
  try { template.draw?.(); } catch (_) {}
}

function twbvUpdateActivePowerMeasuredPreview(areaValue, options = {}) {
  const preview = globalThis._twbvActiveMeasuredTemplatePreview;
  if (!preview || preview.destroyed || preview._destroyed) return null;
  const isPending = Boolean(preview.document?.getFlag?.("world-behind-the-veil", "pendingCast"));
  if (!isPending) return null;
  const previewPowerUuid = String(preview.document?.getFlag?.("world-behind-the-veil", "powerUuid") ?? "");
  const nextPowerUuid = String(options.power?.uuid ?? "");
  if (previewPowerUuid && nextPowerUuid && previewPowerUuid !== nextPowerUuid) return null;
  const data = twbvBuildMeasuredTemplateData(areaValue, {
    ...options,
    x: preview.document?.x ?? preview.x,
    y: preview.document?.y ?? preview.y,
    direction: preview.document?.direction ?? preview.direction ?? 0,
    pendingCast: true
  });
  if (!data) return null;
  preview.document?.updateSource?.(data);
  if (preview._twbvPlacedPreview) preview._moveToVisibleTemplateContainer?.();
  globalThis._twbvActiveMeasuredTemplatePreview = preview;
  twbvRefreshMeasuredTemplatePlaceable(preview);
  return preview;
}

function twbvInstallMeasuredTemplateWheelRotation() {
  if (globalThis._twbvMeasuredTemplateWheelRotation) return;
  const attach = () => {
    const view = canvas?.app?.view;
    if (!view || view._twbvWheelRotationBound) return;
    view.addEventListener("wheel", async (event) => {
      const controlled = Array.from(canvas?.templates?.controlled ?? []);
      const templateObject = controlled.find((template) => {
        const type = String(template?.document?.t ?? template?.document?.type ?? "");
        const flagged = template?.document?.getFlag?.("world-behind-the-veil", "powerUuid") || template?.document?.getFlag?.("world-behind-the-veil", "areaPreset");
        return flagged && ["cone", "ray", "rect"].includes(type);
      });
      const document = templateObject?.document;
      if (!document) return;
      event.preventDefault();
      event.stopPropagation();
      const direction = Number(document.direction ?? 0);
      await document.update({ direction: direction + (event.deltaY > 0 ? 15 : -15) });
    }, { passive: false });
    view._twbvWheelRotationBound = true;
  };
  Hooks.on("canvasReady", attach);
  setTimeout(attach, 250);
  globalThis._twbvMeasuredTemplateWheelRotation = true;
}

function twbvFindPowerAreaPresetFromControlElement(element) {
  const toolElement = element?.closest?.("[data-tool^='twbv-'], .control-tool[data-tool^='twbv-']");
  const toolName = String(toolElement?.dataset?.tool ?? "").trim();
  if (!toolName.startsWith("twbv-")) return null;
  const preset = twbvGetPowerAreaPreset(toolName.replace(/^twbv-/i, ""));
  return preset?.value && preset.value !== "none" ? preset : null;
}

function twbvTriggerPowerAreaPreset(areaValue, { explicit = false } = {}) {
  if (!explicit) return false;
  const preset = twbvGetPowerAreaPreset(areaValue);
  if (!preset?.value || preset.value === "none") return false;
  const now = Date.now();
  const last = globalThis._twbvLastPowerAreaPresetTrigger ?? {};
  if (last.value === preset.value && now - Number(last.at ?? 0) < 250) return true;
  globalThis._twbvLastPowerAreaPresetTrigger = { value: preset.value, at: now };
  void twbvPreviewPowerMeasuredTemplate(preset.value, { pendingCast: false });
  return true;
}

function twbvInstallPowerAreaPresetCanvasClicks() {
  const detach = () => {
    const view = canvas?.app?.view;
    if (view?._twbvPowerAreaPresetPointerHandler) {
      view.removeEventListener("pointerdown", view._twbvPowerAreaPresetPointerHandler, { capture: true });
      delete view._twbvPowerAreaPresetPointerHandler;
    }
    if (view?._twbvPowerAreaPresetCanvasClickBound) delete view._twbvPowerAreaPresetCanvasClickBound;
  };
  detach();
  Hooks.on("canvasReady", detach);
  globalThis._twbvPowerAreaPresetCanvasClicks = true;
}

function twbvInstallPowerAreaPresetControlClicks() {
  if (globalThis._twbvPowerAreaPresetControlClicks) return;
  document.addEventListener("click", (event) => {
    const controlsRoot = event.target?.closest?.("#controls, .scene-controls, .main-controls, .control-tools");
    if (!controlsRoot) return;
    const control = event.target?.closest?.("[data-tool^='twbv-'], .control-tool[data-tool^='twbv-']");
    const preset = twbvFindPowerAreaPresetFromControlElement(control);
    if (!preset) return;
    event.preventDefault();
    event.stopPropagation();
    twbvTriggerPowerAreaPreset(preset.value, { explicit: true });
  }, true);
  globalThis._twbvPowerAreaPresetControlClicks = true;
}

function twbvInstallPowerAreaPreviewSafetyGuards() {
  if (globalThis._twbvPowerAreaPreviewSafetyGuards) return;
  const shouldClearPreview = (event) => Boolean(event.target?.closest?.(
    "#token-hud, .token-hud, .placeable-hud, #combat, #combat-tracker, #sidebar, #navigation, #players, #hotbar, #pause, #notifications"
  ));
  const isStickyPowerPreview = () => {
    const preview = globalThis._twbvActiveMeasuredTemplatePreview;
    return Boolean(preview?._twbvPlacedPreview && preview.document?.getFlag?.("world-behind-the-veil", "pendingCast"));
  };
  const clear = (event) => {
    if (!globalThis._twbvActiveMeasuredTemplatePreview) return;
    if (isStickyPowerPreview()) return;
    if (!shouldClearPreview(event)) return;
    twbvDestroyActivePowerAreaPreview();
  };
  document.addEventListener("pointerdown", clear, true);
  document.addEventListener("contextmenu", clear, true);
  Hooks.on("renderTokenHUD", () => { if (!isStickyPowerPreview()) twbvDestroyActivePowerAreaPreview(); });
  Hooks.on("renderCombatTracker", () => { if (!isStickyPowerPreview()) twbvDestroyActivePowerAreaPreview(); });
  globalThis._twbvPowerAreaPreviewSafetyGuards = true;
}

function twbvIsAmmoModification(itemOrData) {
  const system = itemOrData?.system ?? {};
  const modType = String(system.modType ?? "").trim().toLowerCase();
  const category = String(system.category ?? "").trim().toLowerCase();
  const tags = String(system.tags ?? "").trim().toLowerCase();
  return modType === "ammo" || ["municao", "munição", "ammo", "ammunition"].some((term) => category.includes(term) || tags.includes(term));
}

function twbvBuildWeaponModFromModification(itemOrData) {
  const system = itemOrData?.system ?? {};
  const modifier = String(system.modifier ?? system.bonus ?? "").trim();
  const damage = String(system.damage ?? "").trim();
  return {
    name: String(itemOrData?.name ?? "Modificação").trim() || "Modificação",
    type: damage ? "damage" : "trait",
    dice: null,
    resourcesUsed: null,
    modifier,
    damage,
    ap: twbvNumberOrZero(system.ap),
    rof: twbvNumberOrZero(system.rof),
    range: String(system.range ?? "").trim(),
    override: "",
    uuid: String(itemOrData?.uuid ?? ""),
    macroActor: "default",
    isHeavyWeapon: false
  };
}

function twbvBuildWeaponAmmoUpdateFromModification(itemOrData, weapon) {
  const system = itemOrData?.system ?? {};
  const capacity = Math.max(0, twbvNumberOrZero(system.shots || system.currentShots || weapon?.system?.shots));
  const current = Math.max(0, twbvNumberOrZero(system.currentShots || capacity));
  const reloadType = String(system.reloadType ?? weapon?.system?.reloadType ?? "magazine").trim() || "magazine";
  return {
    "system.ammo": String(itemOrData?.name ?? "").trim(),
    "system.reloadType": reloadType,
    "system.shots": capacity,
    "system.currentShots": Math.min(current, capacity || current),
    "system.ammoAp": twbvNumberOrZero(system.ap),
    "system.ammoSourceUuid": String(itemOrData?.uuid ?? ""),
    "system.ammoSourceName": String(itemOrData?.name ?? "").trim()
  };
}

function twbvGetWeaponMods(weapon) {
  return Object.values(weapon?.system?.actions?.additional ?? {}).filter((mod) => mod && typeof mod === "object");
}

function twbvGetWeaponTraitBonusDetails(weapon) {
  return twbvGetWeaponMods(weapon)
    .map((mod) => ({ name: String(mod.name ?? "Modificação").trim(), value: twbvNumberOrZero(String(mod.modifier ?? "").replace(",", ".")) }))
    .filter((mod) => mod.value !== 0);
}

async function twbvGetWeaponAmmoArmorPiercing(weapon) {
  const sourceUuid = String(weapon?.system?.ammoSourceUuid ?? "").trim();
  if (sourceUuid) {
    try {
      const ammo = await fromUuid(sourceUuid);
      if (ammo) return twbvNumberOrZero(ammo.system?.ap);
    } catch (error) {
      console.warn("[TWBV] Não foi possível ler a PA da munição.", { weapon: weapon?.name, sourceUuid, error });
    }
  }
  return twbvNumberOrZero(weapon?.system?.ammoAp ?? weapon?.system?.ammoAP);
}

function twbvFormatSignedNumber(value) {
  const number = twbvNumberOrZero(value);
  return number >= 0 ? `+${number}` : `${number}`;
}

function twbvParseMoneyValue(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return 0;
  const cleaned = raw.replace(/[^\d,.-]/g, "");
  const normalized = cleaned.includes(",") ? cleaned.replace(/\./g, "").replace(",", ".") : cleaned;
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : 0;
}

function twbvRoundMoney(value) {
  return Math.round((Number(value ?? 0) + Number.EPSILON) * 100) / 100;
}

function twbvFormatMoneyValue(value) {
  return twbvRoundMoney(value).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function twbvFormatMedievalMoneyValue(value) {
  return Math.round(Number(value ?? 0)).toLocaleString("pt-BR", { maximumFractionDigits: 0 });
}

function twbvMoneyCurrencyMeta(code) {
  return TWBV_MONEY_CURRENCIES.find((currency) => currency.code === code)
    ?? TWBV_MEDIEVAL_CURRENCIES.find((currency) => currency.code === code)
    ?? TWBV_MONEY_CURRENCIES[0];
}

function twbvNormalizeMedievalRates(rawRates) {
  return {
    cobrePorPrata: Math.max(1, Number(rawRates?.cobrePorPrata ?? 100) || 100),
    prataPorOuro: Math.max(1, Number(rawRates?.prataPorOuro ?? 100) || 100),
    ouroPorPlatina: Math.max(1, Number(rawRates?.ouroPorPlatina ?? 10) || 10)
  };
}

function twbvGetWorldMedievalRates() {
  try {
    return twbvNormalizeMedievalRates(game.settings.get("world-behind-the-veil", "medievalConversionRates"));
  }
  catch (_error) {
    return twbvNormalizeMedievalRates();
  }
}

function twbvSheetTransactionChatEnabled() {
  try {
    return Boolean(game.settings.get("world-behind-the-veil", "sheetTransactionChatEnabled"));
  }
  catch (_error) {
    return true;
  }
}

async function twbvPostSheetTransactionChat({ actor = null, title = "Transa\u00e7\u00e3o", subtitle = "", rows = [], detail = "", icon = "fas fa-receipt" } = {}) {
  if (!twbvSheetTransactionChatEnabled()) return null;
  const rowHtml = rows
    .filter((row) => row?.label || row?.value)
    .map((row) => `<div><dt>${twbvEscapeHtml(row.label)}</dt><dd>${twbvEscapeHtml(row.value)}</dd></div>`)
    .join("");
  return ChatMessage.create({
    speaker: actor ? ChatMessage.getSpeaker({ actor }) : ChatMessage.getSpeaker(),
    content: `
      <section class="twbv-trade-chat twbv-sheet-transaction-chat">
        <header><span><i class="${twbvEscapeHtml(icon)}"></i> ${twbvEscapeHtml(subtitle || "Ficha")}</span><h3>${twbvEscapeHtml(title)}</h3></header>
        ${rowHtml ? `<dl>${rowHtml}</dl>` : ""}
        ${detail ? `<p class="twbv-trade-status">${twbvEscapeHtml(detail)}</p>` : ""}
      </section>`
  });
}

function twbvMedievalCurrencyCopperValue(currency, rates) {
  const normalized = twbvNormalizeMedievalRates(rates);
  if (currency === "cobre") return 1;
  if (currency === "prata") return normalized.cobrePorPrata;
  if (currency === "ouro") return normalized.cobrePorPrata * normalized.prataPorOuro;
  if (currency === "platina") return normalized.cobrePorPrata * normalized.prataPorOuro * normalized.ouroPorPlatina;
  return 1;
}

function twbvNormalizeMoneyBalances(rawBalances, legacyUsd = 0) {
  const balances = {};
  for (const currency of TWBV_MONEY_CURRENCIES) balances[currency.code] = twbvRoundMoney(rawBalances?.[currency.code] ?? 0);
  if (!balances.USD && legacyUsd) balances.USD = twbvRoundMoney(legacyUsd);
  return balances;
}

function twbvNormalizeMoneyRecords(rawRecords) {
  const source = Array.isArray(rawRecords) ? rawRecords : [];
  return source.slice(-50).reverse().map((record) => {
    const currency = String(record?.currency ?? "USD").trim() || "USD";
    const meta = twbvMoneyCurrencyMeta(currency);
    const isMedieval = twbvMoneyRecordRealm(record) === "medieval";
    const formattedAmount = isMedieval ? twbvFormatMedievalMoneyValue(record?.amount ?? 0) : twbvFormatMoneyValue(record?.amount ?? 0);
    const detail = String(record?.detail ?? "");
    return {
      id: String(record?.id ?? ""),
      type: String(record?.type ?? "note"),
      typeLabel: record?.type === "gain" ? "Ganho" : record?.type === "expense" ? "Gasto" : record?.type === "conversion" ? "C\u00e2mbio" : "Registro",
      name: String(record?.name ?? "Movimenta\u00e7\u00e3o").trim() || "Movimenta\u00e7\u00e3o",
      amount: twbvRoundMoney(record?.amount ?? 0),
      amountDisplay: `${record?.type === "expense" ? "-" : record?.type === "gain" ? "+" : ""}${formattedAmount}`,
      currency,
      symbol: meta.symbol,
      date: String(record?.date ?? ""),
      from: String(record?.from ?? ""),
      reason: String(record?.reason ?? ""),
      detail: isMedieval ? detail.replace(/(\d[\d.]*)\,00\b/g, "$1") : detail
    };
  });
}

function twbvMoneyRecordRealm(record) {
  const explicit = String(record?.realm ?? "").trim();
  if (explicit) return explicit;
  return TWBV_MEDIEVAL_CURRENCIES.some((currency) => currency.code === String(record?.currency ?? "")) ? "medieval" : "modern";
}

function twbvMoneyRecord(type, data = {}) {
  return {
    id: foundry?.utils?.randomID?.(10) ?? Math.random().toString(36).slice(2, 12),
    type,
    name: String(data.name ?? "").trim() || (type === "gain" ? "Ganho" : type === "expense" ? "Gasto" : "Convers\u00e3o"),
    amount: twbvRoundMoney(data.amount ?? 0),
    currency: String(data.currency ?? "USD").trim() || "USD",
    date: String(data.date ?? new Date().toLocaleDateString("pt-BR")).trim(),
    from: String(data.from ?? "").trim(),
    reason: String(data.reason ?? "").trim(),
    detail: String(data.detail ?? "").trim(),
    realm: String(data.realm ?? "modern").trim() || "modern"
  };
}

function twbvReadMoneyBalancesFromSheet(actor, html) {
  const root = html?.[0] ?? html;
  const balances = twbvNormalizeMoneyBalances(actor?.system?.dinheiro?.saldos, actor?.system?.dinheiro?.valor);
  const usdInput = root?.querySelector?.('[name="system.dinheiro.valor"]');
  if (usdInput) balances.USD = twbvRoundMoney(twbvParseMoneyValue(usdInput.value));
  return balances;
}

function twbvMoneyUpdatePayload(balances, records, extra = {}) {
  const update = {
    "system.dinheiro.valor": twbvRoundMoney(balances.USD ?? 0),
    "system.dinheiro.registros": records.slice(-80),
    ...extra
  };
  for (const currency of TWBV_MONEY_CURRENCIES) update[`system.dinheiro.saldos.${currency.code}`] = twbvRoundMoney(balances[currency.code] ?? 0);
  return update;
}

async function twbvApplyMoneyConversion(actor, html) {
  const root = html?.[0] ?? html;
  if (!actor || !root) return;
  const enabled = Boolean(root.querySelector('[name="system.dinheiro.conversaoAtiva"]')?.checked);
  if (!enabled) return ui.notifications?.warn("Ative a convers\u00e3o autom\u00e1tica antes de converter dinheiro.");
  const direction = String(root.querySelector('[name="twbvMoneyExchangeDirection"]')?.value ?? "usd-to-currency");
  const currency = String(root.querySelector('[name="twbvMoneyExchangeCurrency"]')?.value ?? "BRL");
  const meta = twbvMoneyCurrencyMeta(currency);
  const amount = Math.max(0, twbvParseMoneyValue(root.querySelector('[name="twbvMoneyExchangeAmount"]')?.value));
  const rate = Math.max(0, twbvParseMoneyValue(root.querySelector('[name="twbvMoneyExchangeRate"]')?.value));
  const feePercent = Math.max(0, Number(root.querySelector('[name="system.dinheiro.taxaBancaria"]')?.value ?? actor.system?.dinheiro?.taxaBancaria ?? 0));
  if (!amount || !rate) return ui.notifications?.warn("Informe valor e taxa de c\u00e2mbio maiores que zero.");

  const balances = twbvReadMoneyBalancesFromSheet(actor, html);
  const records = Array.isArray(actor.system?.dinheiro?.registros) ? foundry.utils.deepClone(actor.system.dinheiro.registros) : [];
  let detail = "";

  if (direction === "usd-to-currency") {
    const usdCost = amount;
    const feeUsd = twbvRoundMoney(usdCost * (feePercent / 100));
    const totalUsd = twbvRoundMoney(usdCost + feeUsd);
    if (balances.USD < totalUsd) return ui.notifications?.warn(`D\u00f3lares insuficientes. Necess\u00e1rio: ${twbvFormatMoneyValue(totalUsd)} $.`);
    const received = twbvRoundMoney(usdCost * rate);
    balances.USD = twbvRoundMoney(balances.USD - totalUsd);
    balances[currency] = twbvRoundMoney((balances[currency] ?? 0) + received);
    detail = `${twbvFormatMoneyValue(usdCost)} $ convertidos para ${twbvFormatMoneyValue(received)} ${meta.symbol}. Taxa: ${feePercent}% (${twbvFormatMoneyValue(feeUsd)} $).`;
    records.push(twbvMoneyRecord("conversion", { amount: received, currency, name: `USD para ${currency}`, from: "C\u00e2mbio", reason: "Convers\u00e3o monet\u00e1ria", detail, realm: "modern" }));
  } else {
    const sourceAmount = amount;
    const feeSource = twbvRoundMoney(sourceAmount * (feePercent / 100));
    const totalSource = twbvRoundMoney(sourceAmount + feeSource);
    if ((balances[currency] ?? 0) < totalSource) return ui.notifications?.warn(`${currency} insuficiente. Necess\u00e1rio: ${twbvFormatMoneyValue(totalSource)} ${meta.symbol}.`);
    const receivedUsd = twbvRoundMoney(sourceAmount / rate);
    balances[currency] = twbvRoundMoney((balances[currency] ?? 0) - totalSource);
    balances.USD = twbvRoundMoney(balances.USD + receivedUsd);
    detail = `${twbvFormatMoneyValue(sourceAmount)} ${meta.symbol} convertidos para ${twbvFormatMoneyValue(receivedUsd)} $. Taxa: ${feePercent}% (${twbvFormatMoneyValue(feeSource)} ${meta.symbol}).`;
    records.push(twbvMoneyRecord("conversion", { amount: receivedUsd, currency: "USD", name: `${currency} para USD`, from: "C\u00e2mbio", reason: "Convers\u00e3o monet\u00e1ria", detail, realm: "modern" }));
  }

  await actor.update(twbvMoneyUpdatePayload(balances, records, {
    "system.dinheiro.conversaoAtiva": enabled,
    "system.dinheiro.taxaBancaria": feePercent
  }));
  await twbvPostSheetTransactionChat({
    actor,
    title: "C\u00e2mbio moderno",
    subtitle: actor.name,
    icon: "fas fa-right-left",
    rows: [
      { label: "Ficha", value: actor.name },
      { label: "Detalhe", value: detail }
    ]
  });
  ui.notifications?.info(detail);
}

async function twbvApplyMoneyLedgerEntry(actor, html, type) {
  const root = html?.[0] ?? html;
  if (!actor || !root) return;
  const currency = String(root.querySelector('[name="twbvMoneyRecordCurrency"]')?.value ?? "USD");
  const meta = twbvMoneyCurrencyMeta(currency);
  const amount = Math.max(0, twbvParseMoneyValue(root.querySelector('[name="twbvMoneyRecordAmount"]')?.value));
  if (!amount) return ui.notifications?.warn("Informe um valor maior que zero.");
  const balances = twbvReadMoneyBalancesFromSheet(actor, html);
  const delta = type === "gain" ? amount : -amount;
  if (type === "expense" && (balances[currency] ?? 0) < amount) return ui.notifications?.warn(`Saldo insuficiente em ${currency}.`);
  balances[currency] = twbvRoundMoney((balances[currency] ?? 0) + delta);
  const name = String(root.querySelector('[name="twbvMoneyRecordName"]')?.value ?? "").trim() || (type === "gain" ? "Ganho" : "Gasto");
  const date = String(root.querySelector('[name="twbvMoneyRecordDate"]')?.value ?? "").trim() || new Date().toLocaleDateString("pt-BR");
  const from = String(root.querySelector('[name="twbvMoneyRecordFrom"]')?.value ?? "").trim();
  const reason = String(root.querySelector('[name="twbvMoneyRecordReason"]')?.value ?? "").trim();
  const detail = `${type === "gain" ? "Entrada" : "Sa\u00edda"} de ${twbvFormatMoneyValue(amount)} ${meta.symbol} em ${currency}. Saldo final: ${twbvFormatMoneyValue(balances[currency])} ${meta.symbol}.`;
  const records = Array.isArray(actor.system?.dinheiro?.registros) ? foundry.utils.deepClone(actor.system.dinheiro.registros) : [];
  records.push(twbvMoneyRecord(type, { name, amount, currency, date, from, reason, detail, realm: "modern" }));
  await actor.update(twbvMoneyUpdatePayload(balances, records));
  await twbvPostSheetTransactionChat({
    actor,
    title: type === "gain" ? "Entrada de dinheiro" : "Sa\u00edda de dinheiro",
    subtitle: actor.name,
    icon: type === "gain" ? "fas fa-plus" : "fas fa-minus",
    rows: [
      { label: "Ficha", value: actor.name },
      { label: "Nome", value: name },
      { label: "Moeda", value: currency },
      { label: "Valor", value: `${twbvFormatMoneyValue(amount)} ${meta.symbol}` },
      { label: "De / Para", value: from },
      { label: "Motivo", value: reason }
    ],
    detail
  });
  ui.notifications?.info(detail);
}

function twbvConvertModernMoneyAmount(amount, fromCurrency, toCurrency, rate) {
  const safeAmount = twbvRoundMoney(amount);
  const safeRate = Math.max(0, twbvParseMoneyValue(rate));
  if (fromCurrency === toCurrency) return safeAmount;
  if (!safeRate) return 0;
  const usdValue = fromCurrency === "USD" ? safeAmount : safeAmount / safeRate;
  return twbvRoundMoney(toCurrency === "USD" ? usdValue : usdValue * safeRate);
}

async function twbvApplyMoneyPixTransfer(actor, html) {
  const root = html?.[0] ?? html;
  if (!actor || !root) return;
  const hasActorTarget = Boolean(root.querySelector('[name="twbvMoneyPixHasActor"]')?.checked);
  const targetActorId = String(root.querySelector('[name="twbvMoneyPixActor"]')?.value ?? "");
  const targetActor = hasActorTarget ? game.actors?.get(targetActorId) : null;
  const npcName = String(root.querySelector('[name="twbvMoneyPixNpc"]')?.value ?? "").trim();
  if (hasActorTarget && !targetActor) return ui.notifications?.warn("Escolha uma ficha de destino para o PIX.");
  if (!hasActorTarget && !npcName) return ui.notifications?.warn("Informe o NPC, loja ou contato que vai receber.");

  const fromCurrency = String(root.querySelector('[name="twbvMoneyPixFromCurrency"]')?.value ?? "USD");
  const toCurrency = String(root.querySelector('[name="twbvMoneyPixToCurrency"]')?.value ?? fromCurrency);
  const fromMeta = twbvMoneyCurrencyMeta(fromCurrency);
  const toMeta = twbvMoneyCurrencyMeta(toCurrency);
  const amount = Math.max(0, twbvParseMoneyValue(root.querySelector('[name="twbvMoneyPixAmount"]')?.value));
  const rate = Math.max(0, twbvParseMoneyValue(root.querySelector('[name="twbvMoneyPixRate"]')?.value));
  const feePercent = Math.max(0, Number(root.querySelector('[name="twbvMoneyPixFee"]')?.value ?? 0));
  const reason = String(root.querySelector('[name="twbvMoneyPixReason"]')?.value ?? "").trim();
  if (!amount) return ui.notifications?.warn("Informe um valor maior que zero para o PIX.");
  if (fromCurrency !== toCurrency && !rate) return ui.notifications?.warn("Informe a taxa de convers\u00e3o para moedas diferentes.");

  const senderBalances = twbvReadMoneyBalancesFromSheet(actor, html);
  const fee = twbvRoundMoney(amount * (feePercent / 100));
  const totalDebit = twbvRoundMoney(amount + fee);
  if ((senderBalances[fromCurrency] ?? 0) < totalDebit) {
    return ui.notifications?.warn(`Saldo insuficiente em ${fromCurrency}. Necess\u00e1rio: ${twbvFormatMoneyValue(totalDebit)} ${fromMeta.symbol}.`);
  }

  const received = twbvConvertModernMoneyAmount(amount, fromCurrency, toCurrency, rate || 1);
  if (!received) return ui.notifications?.warn("A convers\u00e3o resultou em zero. Confira valor e taxa.");
  senderBalances[fromCurrency] = twbvRoundMoney((senderBalances[fromCurrency] ?? 0) - totalDebit);
  const targetName = targetActor?.name ?? npcName;
  const detail = `${twbvFormatMoneyValue(amount)} ${fromMeta.symbol} enviados para ${targetName}. Recebedor recebe ${twbvFormatMoneyValue(received)} ${toMeta.symbol}. Taxa: ${feePercent}% (${twbvFormatMoneyValue(fee)} ${fromMeta.symbol}).`;
  const senderRecords = Array.isArray(actor.system?.dinheiro?.registros) ? foundry.utils.deepClone(actor.system.dinheiro.registros) : [];
  senderRecords.push(twbvMoneyRecord("expense", {
    name: `PIX para ${targetName}`,
    amount: totalDebit,
    currency: fromCurrency,
    from: targetName,
    reason: reason || "Transfer\u00eancia PIX",
    detail,
    realm: "modern"
  }));

  const updates = [actor.update(twbvMoneyUpdatePayload(senderBalances, senderRecords))];
  if (targetActor) {
    const targetBalances = twbvNormalizeMoneyBalances(targetActor.system?.dinheiro?.saldos, targetActor.system?.dinheiro?.valor);
    targetBalances[toCurrency] = twbvRoundMoney((targetBalances[toCurrency] ?? 0) + received);
    const targetRecords = Array.isArray(targetActor.system?.dinheiro?.registros) ? foundry.utils.deepClone(targetActor.system.dinheiro.registros) : [];
    targetRecords.push(twbvMoneyRecord("gain", {
      name: `RECEBIDO DE ${actor.name}`,
      amount: received,
      currency: toCurrency,
      from: actor.name,
      reason: reason || "Transfer\u00eancia PIX",
      detail: `${twbvFormatMoneyValue(received)} ${toMeta.symbol} recebidos de ${actor.name}. Origem: ${twbvFormatMoneyValue(amount)} ${fromMeta.symbol}.`,
      realm: "modern"
    }));
    updates.push(targetActor.update(twbvMoneyUpdatePayload(targetBalances, targetRecords)));
  }
  await Promise.all(updates);
  await twbvPostSheetTransactionChat({
    actor,
    title: "PIX enviado",
    subtitle: actor.name,
    icon: "fas fa-paper-plane",
    rows: [
      { label: "Enviado por", value: actor.name },
      { label: "Recebido por", value: targetName },
      { label: "Saiu", value: `${twbvFormatMoneyValue(amount)} ${fromMeta.symbol}` },
      { label: "Recebido", value: `${twbvFormatMoneyValue(received)} ${toMeta.symbol}` },
      { label: "Motivo", value: reason || "Transfer\u00eancia PIX" }
    ],
    detail
  });
  ui.notifications?.info(detail);
}

function twbvEscapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function twbvActorRecipientOptions(sourceActor) {
  return Array.from(game.actors ?? [])
    .filter((actor) => actor.id !== sourceActor?.id && actor.isOwner)
    .sort((left, right) => left.name.localeCompare(right.name, "pt-BR"))
    .map((actor) => `<option value="${twbvEscapeHtml(actor.id)}">${twbvEscapeHtml(actor.name)}</option>`)
    .join("");
}

function twbvMoneyCurrencyOptions(selected = "USD") {
  return TWBV_MONEY_CURRENCIES.map((currency) => {
    const isSelected = currency.code === selected ? " selected" : "";
    return `<option value="${twbvEscapeHtml(currency.code)}"${isSelected}>${twbvEscapeHtml(currency.code)} - ${twbvEscapeHtml(currency.symbol)} ${twbvEscapeHtml(currency.name)}</option>`;
  }).join("");
}

function twbvMedievalMoneyCurrencyOptions(selected = "ouro") {
  return TWBV_MEDIEVAL_CURRENCIES.map((currency) => {
    const isSelected = currency.code === selected ? " selected" : "";
    return `<option value="${twbvEscapeHtml(currency.code)}"${isSelected}>${twbvEscapeHtml(currency.name)} - ${twbvEscapeHtml(currency.symbol)}</option>`;
  }).join("");
}

function twbvDialogForm(html) {
  const root = html?.[0] ?? html;
  return root?.querySelector?.("form") ?? null;
}

function twbvCloneItemForTransfer(item) {
  const data = item?.toObject ? item.toObject() : foundry.utils.deepClone(item ?? {});
  delete data._id;
  delete data.folder;
  data.system = foundry.utils.deepClone(data.system ?? {});
  data.system.equipped = false;
  data.system.equipStatus = 0;
  data.system.favorite = false;
  return data;
}

function twbvTradeWhisperUsers(seller, buyer) {
  const users = Array.from(game.users ?? []).filter((user) => {
    if (user.isGM) return true;
    return seller?.testUserPermission?.(user, "OWNER") || buyer?.testUserPermission?.(user, "OWNER");
  });
  return users.map((user) => user.id);
}

function twbvIsPrimaryActiveGm() {
  const activeGms = Array.from(game.users ?? [])
    .filter((user) => user.active && user.isGM)
    .sort((left, right) => String(left.id).localeCompare(String(right.id)));
  return Boolean(activeGms[0]?.id === game.user?.id);
}

function twbvTradePayloadLabel(payload) {
  const fromMeta = twbvMoneyCurrencyMeta(payload?.fromCurrency);
  const toMeta = twbvMoneyCurrencyMeta(payload?.toCurrency);
  const isMedieval = String(payload?.realm ?? "modern") === "medieval";
  const amount = isMedieval ? twbvFormatMedievalMoneyValue(payload?.amount ?? 0) : twbvFormatMoneyValue(payload?.amount ?? 0);
  const received = isMedieval ? twbvFormatMedievalMoneyValue(payload?.receivedAmount ?? payload?.amount ?? 0) : twbvFormatMoneyValue(payload?.receivedAmount ?? payload?.amount ?? 0);
  return `${amount} ${fromMeta.symbol} -> ${received} ${toMeta.symbol}`;
}

function twbvBuildItemTradeChatContent(payload, state = "pending") {
  const seller = game.actors?.get(payload?.sellerActorId);
  const buyer = game.actors?.get(payload?.buyerActorId);
  const accepted = state === "accepted";
  const declined = state === "declined";
  return `
    <section class="twbv-trade-chat ${accepted ? "is-accepted" : declined ? "is-declined" : ""}">
      <header>
        <span>Pedido de trade</span>
        <h3>${twbvEscapeHtml(payload?.itemName ?? "Item")}</h3>
      </header>
      <dl>
        <div><dt>Vendedor</dt><dd>${twbvEscapeHtml(seller?.name ?? payload?.sellerName ?? "-")}</dd></div>
        <div><dt>Comprador</dt><dd>${twbvEscapeHtml(buyer?.name ?? payload?.buyerName ?? "-")}</dd></div>
        <div><dt>Valor</dt><dd>${twbvEscapeHtml(twbvTradePayloadLabel(payload))}</dd></div>
        <div><dt>Motivo</dt><dd>${twbvEscapeHtml(payload?.reason || "Venda de item")}</dd></div>
      </dl>
      ${accepted ? "<p class=\"twbv-trade-status\">Trade aceito e concluido.</p>" : declined ? "<p class=\"twbv-trade-status\">Trade recusado.</p>" : `
        <div class="twbv-trade-actions">
          <button type="button" class="twbv-trade-accept" data-trade-id="${twbvEscapeHtml(payload?.id)}"><i class="fas fa-check"></i> Aceitar compra</button>
          <button type="button" class="twbv-trade-decline" data-trade-id="${twbvEscapeHtml(payload?.id)}"><i class="fas fa-times"></i> Recusar</button>
        </div>
      `}
    </section>`;
}

function twbvUserCanAcceptTrade(actor) {
  return Boolean(game.user?.isGM || actor?.isOwner);
}

async function twbvDispatchItemTransfer(payload, messageId = "") {
  const seller = game.actors?.get(payload?.sellerActorId);
  const buyer = game.actors?.get(payload?.buyerActorId);
  const canRunHere = game.user?.isGM || (seller?.isOwner && buyer?.isOwner);
  if (canRunHere) return twbvExecuteItemTransfer(payload, messageId);
  const hasGm = Array.from(game.users ?? []).some((user) => user.active && user.isGM);
  if (!hasGm) return ui.notifications?.warn("Um GM precisa estar online para concluir uma troca entre fichas de jogadores diferentes.");
  game.socket?.emit?.("system.world-behind-the-veil", { type: "executeItemTransfer", payload, messageId, requestingUserId: game.user?.id });
  ui.notifications?.info("Pedido enviado ao GM para concluir a transa\u00e7\u00e3o.");
}

async function twbvExecuteItemTransfer(payload, messageId = "") {
  const seller = game.actors?.get(payload?.sellerActorId);
  const buyer = game.actors?.get(payload?.buyerActorId);
  if (!seller || !buyer) return ui.notifications?.warn("Ficha de origem ou destino n\u00e3o encontrada.");
  const item = seller.items?.get(payload?.itemId);
  if (!item) return ui.notifications?.warn("O item desta transa\u00e7\u00e3o n\u00e3o existe mais na ficha de origem.");
  if (buyer.items?.some((entry) => entry.getFlag?.("world-behind-the-veil", "tradeSourceId") === payload?.id)) {
    return ui.notifications?.warn("Este trade j\u00e1 foi conclu\u00eddo.");
  }

  const itemData = twbvCloneItemForTransfer(item);
  itemData.flags = foundry.utils.mergeObject(foundry.utils.deepClone(itemData.flags ?? {}), {
    "world-behind-the-veil": {
      ...(itemData.flags?.["world-behind-the-veil"] ?? {}),
      tradeSourceId: payload.id,
      tradeFromActorId: seller.id
    }
  });

  if (payload.kind === "sale") {
    const realm = String(payload.realm ?? "modern") === "medieval" ? "medieval" : "modern";
    const fromCurrency = String(payload.fromCurrency ?? "USD");
    const toCurrency = String(payload.toCurrency ?? fromCurrency);
    const fromMeta = twbvMoneyCurrencyMeta(fromCurrency);
    const toMeta = twbvMoneyCurrencyMeta(toCurrency);
    if (realm === "medieval") {
      const amount = Math.max(0, Math.round(payload.amount ?? 0));
      const buyerBalances = Object.fromEntries(TWBV_MEDIEVAL_CURRENCIES.map((currency) => [currency.code, Math.max(0, Math.round(buyer.system?.dinheiro?.[currency.code] ?? 0))]));
      const sellerBalances = Object.fromEntries(TWBV_MEDIEVAL_CURRENCIES.map((currency) => [currency.code, Math.max(0, Math.round(seller.system?.dinheiro?.[currency.code] ?? 0))]));
      if ((buyerBalances[fromCurrency] ?? 0) < amount) {
        return ui.notifications?.warn(`${buyer.name} n\u00e3o tem ${fromMeta.name} suficiente.`);
      }
      buyerBalances[fromCurrency] = Math.max(0, Math.round((buyerBalances[fromCurrency] ?? 0) - amount));
      sellerBalances[toCurrency] = Math.max(0, Math.round((sellerBalances[toCurrency] ?? 0) + amount));
      const buyerRecords = Array.isArray(buyer.system?.dinheiro?.registros) ? foundry.utils.deepClone(buyer.system.dinheiro.registros) : [];
      const sellerRecords = Array.isArray(seller.system?.dinheiro?.registros) ? foundry.utils.deepClone(seller.system.dinheiro.registros) : [];
      const detail = `${buyer.name} comprou ${item.name} de ${seller.name}. Pagou ${twbvFormatMedievalMoneyValue(amount)} ${fromMeta.name}; vendedor recebeu ${twbvFormatMedievalMoneyValue(amount)} ${toMeta.name}.`;
      buyerRecords.push(twbvMoneyRecord("expense", {
        name: `Compra: ${item.name}`,
        amount,
        currency: fromCurrency,
        from: seller.name,
        reason: payload.reason || "Compra de item",
        detail,
        realm: "medieval"
      }));
      sellerRecords.push(twbvMoneyRecord("gain", {
        name: `Venda: ${item.name}`,
        amount,
        currency: toCurrency,
        from: buyer.name,
        reason: payload.reason || "Venda de item",
        detail,
        realm: "medieval"
      }));
      await buyer.update(twbvMedievalMoneyUpdatePayload(buyerBalances, twbvGetWorldMedievalRates(), buyerRecords));
      await seller.update(twbvMedievalMoneyUpdatePayload(sellerBalances, twbvGetWorldMedievalRates(), sellerRecords));
      await twbvPostSheetTransactionChat({
        actor: seller,
        title: "Venda de item",
        subtitle: "Trade aceito",
        icon: "fas fa-handshake",
        rows: [
          { label: "Vendedor", value: seller.name },
          { label: "Comprador", value: buyer.name },
          { label: "Item", value: item.name },
          { label: "Valor", value: `${twbvFormatMedievalMoneyValue(amount)} ${toMeta.symbol}` }
        ],
        detail
      });
    } else {
      const amount = Math.max(0, twbvRoundMoney(payload.amount ?? 0));
      const feePercent = Math.max(0, Number(payload.feePercent ?? 0));
      const fee = twbvRoundMoney(amount * (feePercent / 100));
      const totalDebit = twbvRoundMoney(amount + fee);
      const received = twbvRoundMoney(payload.receivedAmount ?? twbvConvertModernMoneyAmount(amount, fromCurrency, toCurrency, payload.rate ?? 1));
      const buyerBalances = twbvNormalizeMoneyBalances(buyer.system?.dinheiro?.saldos, buyer.system?.dinheiro?.valor);
      const sellerBalances = twbvNormalizeMoneyBalances(seller.system?.dinheiro?.saldos, seller.system?.dinheiro?.valor);
      if ((buyerBalances[fromCurrency] ?? 0) < totalDebit) {
        return ui.notifications?.warn(`${buyer.name} n\u00e3o tem saldo suficiente. Necess\u00e1rio: ${twbvFormatMoneyValue(totalDebit)} ${fromMeta.symbol}.`);
      }

      buyerBalances[fromCurrency] = twbvRoundMoney((buyerBalances[fromCurrency] ?? 0) - totalDebit);
      sellerBalances[toCurrency] = twbvRoundMoney((sellerBalances[toCurrency] ?? 0) + received);
      const buyerRecords = Array.isArray(buyer.system?.dinheiro?.registros) ? foundry.utils.deepClone(buyer.system.dinheiro.registros) : [];
      const sellerRecords = Array.isArray(seller.system?.dinheiro?.registros) ? foundry.utils.deepClone(seller.system.dinheiro.registros) : [];
      const detail = `${buyer.name} comprou ${item.name} de ${seller.name}. Pagou ${twbvFormatMoneyValue(amount)} ${fromMeta.symbol}; vendedor recebeu ${twbvFormatMoneyValue(received)} ${toMeta.symbol}. Taxa: ${feePercent}% (${twbvFormatMoneyValue(fee)} ${fromMeta.symbol}).`;
      buyerRecords.push(twbvMoneyRecord("expense", {
        name: `Compra: ${item.name}`,
        amount: totalDebit,
        currency: fromCurrency,
        from: seller.name,
        reason: payload.reason || "Compra de item",
        detail,
        realm: "modern"
      }));
      sellerRecords.push(twbvMoneyRecord("gain", {
        name: `Venda: ${item.name}`,
        amount: received,
        currency: toCurrency,
        from: buyer.name,
        reason: payload.reason || "Venda de item",
        detail,
        realm: "modern"
      }));
      await buyer.update(twbvMoneyUpdatePayload(buyerBalances, buyerRecords));
      await seller.update(twbvMoneyUpdatePayload(sellerBalances, sellerRecords));
      await twbvPostSheetTransactionChat({
        actor: seller,
        title: "Venda de item",
        subtitle: "Trade aceito",
        icon: "fas fa-handshake",
        rows: [
          { label: "Vendedor", value: seller.name },
          { label: "Comprador", value: buyer.name },
          { label: "Item", value: item.name },
          { label: "Valor", value: `${twbvFormatMoneyValue(received)} ${toMeta.symbol}` }
        ],
        detail
      });
    }
  }

  await buyer.createEmbeddedDocuments("Item", [itemData]);
  await seller.deleteEmbeddedDocuments("Item", [item.id]);
  if (payload.kind === "donation") {
    await twbvPostSheetTransactionChat({
      actor: seller,
      title: "Item enviado",
      subtitle: "Doa\u00e7\u00e3o",
      icon: "fas fa-gift",
      rows: [
        { label: "Enviado por", value: seller.name },
        { label: "Recebido por", value: buyer.name },
        { label: "Item", value: item.name }
      ],
      detail: `${seller.name} enviou ${item.name} para ${buyer.name}.`
    });
  }
  if (messageId) {
    const message = game.messages?.get(messageId);
    if (message) {
      try {
        await message.update({ content: twbvBuildItemTradeChatContent(payload, "accepted"), "flags.world-behind-the-veil.tradeState": "accepted" });
      } catch (error) {
        console.warn("[TWBV] Nao foi possivel atualizar a mensagem do trade.", error);
      }
    }
  }
  ui.notifications?.info(`${item.name} transferido de ${seller.name} para ${buyer.name}.`);
}

async function twbvExecuteNpcItemSale(seller, item, payload) {
  const npcName = String(payload.npcName ?? "NPC").trim() || "NPC";
  const realm = String(payload.realm ?? "modern") === "medieval" ? "medieval" : "modern";
  if (realm === "medieval") {
    const currency = String(payload.toCurrency ?? payload.fromCurrency ?? "ouro");
    const meta = twbvMoneyCurrencyMeta(currency);
    const amount = Math.max(0, Math.round(payload.amount ?? 0));
    if (!amount) return ui.notifications?.warn("Informe um valor de venda maior que zero.");
    const balances = Object.fromEntries(TWBV_MEDIEVAL_CURRENCIES.map((entry) => [entry.code, Math.max(0, Math.round(seller.system?.dinheiro?.[entry.code] ?? 0))]));
    balances[currency] = Math.max(0, Math.round((balances[currency] ?? 0) + amount));
    const detail = `${seller.name} vendeu ${item.name} para ${npcName} por ${twbvFormatMedievalMoneyValue(amount)} ${meta.name}.`;
    const records = Array.isArray(seller.system?.dinheiro?.registros) ? foundry.utils.deepClone(seller.system.dinheiro.registros) : [];
    records.push(twbvMoneyRecord("gain", {
      name: `Venda: ${item.name}`,
      amount,
      currency,
      from: npcName,
      reason: payload.reason || "Venda para NPC",
      detail,
      realm: "medieval"
    }));
    await seller.update(twbvMedievalMoneyUpdatePayload(balances, twbvGetWorldMedievalRates(), records));
    await seller.deleteEmbeddedDocuments("Item", [item.id]);
    await twbvPostSheetTransactionChat({
      actor: seller,
      title: "Venda para NPC",
      subtitle: "Medieval",
      icon: "fas fa-handshake",
      rows: [
        { label: "Vendedor", value: seller.name },
        { label: "Comprador", value: npcName },
        { label: "Item", value: item.name },
        { label: "Valor", value: `${twbvFormatMedievalMoneyValue(amount)} ${meta.symbol}` }
      ],
      detail
    });
    ui.notifications?.info(detail);
    return;
  }

  const currency = String(payload.toCurrency ?? payload.fromCurrency ?? "USD");
  const meta = twbvMoneyCurrencyMeta(currency);
  const amount = Math.max(0, twbvRoundMoney(payload.receivedAmount ?? payload.amount ?? 0));
  if (!amount) return ui.notifications?.warn("Informe um valor de venda maior que zero.");
  const balances = twbvNormalizeMoneyBalances(seller.system?.dinheiro?.saldos, seller.system?.dinheiro?.valor);
  balances[currency] = twbvRoundMoney((balances[currency] ?? 0) + amount);
  const detail = `${seller.name} vendeu ${item.name} para ${npcName} por ${twbvFormatMoneyValue(amount)} ${meta.symbol}.`;
  const records = Array.isArray(seller.system?.dinheiro?.registros) ? foundry.utils.deepClone(seller.system.dinheiro.registros) : [];
  records.push(twbvMoneyRecord("gain", {
    name: `Venda: ${item.name}`,
    amount,
    currency,
    from: npcName,
    reason: payload.reason || "Venda para NPC",
    detail,
    realm: "modern"
  }));
  await seller.update(twbvMoneyUpdatePayload(balances, records));
  await seller.deleteEmbeddedDocuments("Item", [item.id]);
  await twbvPostSheetTransactionChat({
    actor: seller,
    title: "Venda para NPC",
    subtitle: "Moderno",
    icon: "fas fa-handshake",
    rows: [
      { label: "Vendedor", value: seller.name },
      { label: "Comprador", value: npcName },
      { label: "Item", value: item.name },
      { label: "Valor", value: `${twbvFormatMoneyValue(amount)} ${meta.symbol}` }
    ],
    detail
  });
  ui.notifications?.info(detail);
}

function twbvIsDroppedPurchaseType(type) {
  return ["arma", "weapon", "armadura"].includes(String(type ?? ""));
}

async function twbvCreateDroppedItemOnActor(actor, payload, sourceDropData = null) {
  const itemData = foundry.utils.deepClone(payload ?? {});
  if (twbvIsEquipmentItemType(itemData.type)) {
    itemData.system = itemData.system ?? {};
    itemData.system.active = itemData.system.active ?? true;
    itemData.system.equipped = itemData.system.equipped ?? false;
  }
  if (itemData.type === "armadura") {
    const equipSlot = String(itemData.system?.equipSlot ?? "").trim();
    itemData.system.category = itemData.system.category || `armadura${equipSlot ? `:${equipSlot}` : ""}`;
  }
  const created = await actor.createEmbeddedDocuments("Item", [itemData]);
  const item = created?.[0] ?? null;
  if (sourceDropData) await twbvSendDroppedItemToActorChat(actor, item, sourceDropData);
  return item;
}

async function twbvApplyDroppedItemPurchase(actor, payload, form) {
  const realm = String(form?.dataset?.moneyMode ?? actor.system?.dinheiro?.modo ?? "moderno") === "medieval" ? "medieval" : "modern";
  const sellerName = String(form?.querySelector('[name="purchaseSeller"]')?.value ?? "").trim() || "Loja / NPC";
  const reason = String(form?.querySelector('[name="purchaseReason"]')?.value ?? "").trim() || `Compra de ${payload.name}`;

  if (realm === "medieval") {
    const currency = String(form?.querySelector('[name="purchaseCurrency"]')?.value ?? "ouro");
    const meta = twbvMoneyCurrencyMeta(currency);
    const amount = Math.max(0, Math.round(twbvParseMoneyValue(form?.querySelector('[name="purchaseAmount"]')?.value)));
    if (!amount) return ui.notifications?.warn("Informe um valor maior que zero para a compra.");
    const balances = Object.fromEntries(TWBV_MEDIEVAL_CURRENCIES.map((entry) => [entry.code, Math.max(0, Math.round(actor.system?.dinheiro?.[entry.code] ?? 0))]));
    if ((balances[currency] ?? 0) < amount) return ui.notifications?.warn(`Saldo insuficiente em ${meta.name}.`);
    balances[currency] = Math.max(0, Math.round((balances[currency] ?? 0) - amount));
    const detail = `${actor.name} comprou ${payload.name} de ${sellerName} por ${twbvFormatMedievalMoneyValue(amount)} ${meta.name}.`;
    const records = Array.isArray(actor.system?.dinheiro?.registros) ? foundry.utils.deepClone(actor.system.dinheiro.registros) : [];
    records.push(twbvMoneyRecord("expense", {
      name: `Compra: ${payload.name}`,
      amount,
      currency,
      from: sellerName,
      reason,
      detail,
      realm: "medieval"
    }));
    await actor.update(twbvMedievalMoneyUpdatePayload(balances, twbvGetWorldMedievalRates(), records));
    const item = await twbvCreateDroppedItemOnActor(actor, payload);
    await twbvPostSheetTransactionChat({
      actor,
      title: "Compra de item",
      subtitle: "Medieval",
      icon: "fas fa-shopping-bag",
      rows: [
        { label: "Comprador", value: actor.name },
        { label: "Vendedor", value: sellerName },
        { label: "Item", value: item?.name ?? payload.name },
        { label: "Valor", value: `${twbvFormatMedievalMoneyValue(amount)} ${meta.symbol}` }
      ],
      detail
    });
    ui.notifications?.info(detail);
    return;
  }

  const currency = String(form?.querySelector('[name="purchaseCurrency"]')?.value ?? "USD");
  const meta = twbvMoneyCurrencyMeta(currency);
  const amount = Math.max(0, twbvRoundMoney(twbvParseMoneyValue(form?.querySelector('[name="purchaseAmount"]')?.value)));
  const feePercent = Math.max(0, Number(form?.querySelector('[name="purchaseFee"]')?.value ?? 0));
  const fee = twbvRoundMoney(amount * (feePercent / 100));
  const total = twbvRoundMoney(amount + fee);
  if (!amount) return ui.notifications?.warn("Informe um valor maior que zero para a compra.");
  const balances = twbvNormalizeMoneyBalances(actor.system?.dinheiro?.saldos, actor.system?.dinheiro?.valor);
  if ((balances[currency] ?? 0) < total) return ui.notifications?.warn(`Saldo insuficiente em ${currency}. Necess\u00e1rio: ${twbvFormatMoneyValue(total)} ${meta.symbol}.`);
  balances[currency] = twbvRoundMoney((balances[currency] ?? 0) - total);
  const detail = `${actor.name} comprou ${payload.name} de ${sellerName} por ${twbvFormatMoneyValue(amount)} ${meta.symbol}. Taxa: ${feePercent}% (${twbvFormatMoneyValue(fee)} ${meta.symbol}).`;
  const records = Array.isArray(actor.system?.dinheiro?.registros) ? foundry.utils.deepClone(actor.system.dinheiro.registros) : [];
  records.push(twbvMoneyRecord("expense", {
    name: `Compra: ${payload.name}`,
    amount: total,
    currency,
    from: sellerName,
    reason,
    detail,
    realm: "modern"
  }));
  await actor.update(twbvMoneyUpdatePayload(balances, records));
  const item = await twbvCreateDroppedItemOnActor(actor, payload);
  await twbvPostSheetTransactionChat({
    actor,
    title: "Compra de item",
    subtitle: "Moderno",
    icon: "fas fa-shopping-bag",
    rows: [
      { label: "Comprador", value: actor.name },
      { label: "Vendedor", value: sellerName },
      { label: "Item", value: item?.name ?? payload.name },
      { label: "Valor", value: `${twbvFormatMoneyValue(total)} ${meta.symbol}` }
    ],
    detail
  });
  ui.notifications?.info(detail);
}

async function twbvOpenDroppedItemAcquireDialog(actor, payload, sourceDropData = null) {
  const isMedieval = String(actor.system?.dinheiro?.modo ?? "moderno") === "medieval";
  const defaultCost = isMedieval ? "0" : twbvFormatMoneyValue(payload.system?.cost || 0);
  const moneyFields = isMedieval
    ? `
      <label>Moeda<select name="purchaseCurrency">${twbvMedievalMoneyCurrencyOptions("ouro")}</select></label>
      <label>Valor<input type="text" name="purchaseAmount" value="${twbvEscapeHtml(defaultCost)}" inputmode="numeric" /></label>
      <p class="wide">Compra medieval n&atilde;o usa conversor: ouro fica ouro, prata fica prata, cobre fica cobre.</p>`
    : `
      <label>Moeda<select name="purchaseCurrency">${twbvMoneyCurrencyOptions("USD")}</select></label>
      <label>Valor<input type="text" name="purchaseAmount" value="${twbvEscapeHtml(defaultCost)}" inputmode="decimal" /></label>
      <label>Taxa banc&aacute;ria %<input type="number" name="purchaseFee" value="" min="0" step="0.1" /></label>`;

  new Dialog({
    title: `Adicionar ${payload.name}`,
    content: `
      <form class="twbv-transfer-dialog" data-money-mode="${isMedieval ? "medieval" : "moderno"}">
        <label class="wide twbv-money-toggle"><input type="radio" name="acquireMode" value="free" checked /><span>Colocar gratuitamente na ficha</span></label>
        <label class="wide twbv-money-toggle"><input type="radio" name="acquireMode" value="purchase" /><span>Registrar como compra</span></label>
        <div class="twbv-purchase-fields wide" hidden>
          <label>Vendedor / origem<input type="text" name="purchaseSeller" placeholder="Loja, ferreiro, mercado, NPC..." /></label>
          ${moneyFields}
          <label class="wide">Motivo<input type="text" name="purchaseReason" value="Compra de ${twbvEscapeHtml(payload.name)}" /></label>
        </div>
      </form>`,
    buttons: {
      confirm: {
        icon: '<i class="fas fa-check"></i>',
        label: "Adicionar",
        callback: async (html) => {
          const form = twbvDialogForm(html);
          const mode = String(form?.querySelector('[name="acquireMode"]:checked')?.value ?? "free");
          if (mode === "purchase") return twbvApplyDroppedItemPurchase(actor, payload, form);
          const item = await twbvCreateDroppedItemOnActor(actor, payload, sourceDropData);
          await twbvPostSheetTransactionChat({
            actor,
            title: "Item adicionado",
            subtitle: "Gratuito",
            icon: "fas fa-box-open",
            rows: [
              { label: "Ficha", value: actor.name },
              { label: "Item", value: item?.name ?? payload.name }
            ],
            detail: `${payload.name} foi colocado gratuitamente na ficha de ${actor.name}.`
          });
        }
      },
      cancel: { label: "Cancelar" }
    },
    default: "confirm",
    render: (html) => {
      const form = twbvDialogForm(html);
      const fields = form?.querySelector?.(".twbv-purchase-fields");
      form?.querySelectorAll?.('[name="acquireMode"]').forEach((input) => {
        input.addEventListener("change", () => {
          if (fields) fields.hidden = String(form.querySelector('[name="acquireMode"]:checked')?.value ?? "free") !== "purchase";
        });
      });
    }
  }, {
    classes: ["twbv", "dialog", "twbv-acquire-dialog"],
    width: 650,
    height: 560,
    resizable: true
  }).render(true);
}

async function twbvCreateItemSaleRequest(seller, item, form) {
  const realm = String(form?.dataset?.moneyMode ?? seller.system?.dinheiro?.modo ?? "moderno") === "medieval" ? "medieval" : "modern";
  const sellToActor = Boolean(form?.querySelector('[name="sellToActor"]')?.checked);
  const buyer = sellToActor ? game.actors?.get(String(form?.querySelector('[name="buyerActor"]')?.value ?? "")) : null;
  const npcName = String(form?.querySelector('[name="buyerNpc"]')?.value ?? "").trim();
  if (sellToActor && !buyer) return ui.notifications?.warn("Escolha a ficha compradora.");
  if (!sellToActor && !npcName) return ui.notifications?.warn("Informe o nome do NPC, loja ou contato.");
  const fromCurrency = String(form?.querySelector('[name="fromCurrency"]')?.value ?? (realm === "medieval" ? "ouro" : "USD"));
  const toCurrency = realm === "medieval" ? fromCurrency : String(form?.querySelector('[name="toCurrency"]')?.value ?? fromCurrency);
  const amount = Math.max(0, realm === "medieval" ? Math.round(twbvParseMoneyValue(form?.querySelector('[name="amount"]')?.value)) : twbvParseMoneyValue(form?.querySelector('[name="amount"]')?.value));
  const rate = realm === "medieval" ? 1 : Math.max(0, twbvParseMoneyValue(form?.querySelector('[name="rate"]')?.value));
  const feePercent = realm === "medieval" ? 0 : Math.max(0, Number(form?.querySelector('[name="feePercent"]')?.value ?? 0));
  const reason = String(form?.querySelector('[name="reason"]')?.value ?? "").trim();
  if (!amount) return ui.notifications?.warn("Informe um valor de venda maior que zero.");
  if (realm === "modern" && fromCurrency !== toCurrency && !rate) return ui.notifications?.warn("Informe a taxa de convers\u00e3o.");
  const payload = {
    id: foundry.utils.randomID(12),
    kind: "sale",
    realm,
    sellerActorId: seller.id,
    sellerName: seller.name,
    buyerActorId: buyer?.id ?? "",
    buyerName: buyer?.name ?? npcName,
    npcName,
    itemId: item.id,
    itemName: item.name,
    itemImg: item.img,
    fromCurrency,
    toCurrency,
    amount: realm === "medieval" ? Math.round(amount) : twbvRoundMoney(amount),
    rate: rate || 1,
    feePercent,
    receivedAmount: realm === "medieval" ? Math.round(amount) : twbvConvertModernMoneyAmount(amount, fromCurrency, toCurrency, rate || 1),
    reason
  };
  if (!buyer) {
    await twbvExecuteNpcItemSale(seller, item, payload);
    return;
  }
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: seller }),
    whisper: twbvTradeWhisperUsers(seller, buyer),
    content: twbvBuildItemTradeChatContent(payload),
    flags: { "world-behind-the-veil": { itemTrade: payload, tradeState: "pending" } }
  });
  ui.notifications?.info(`Proposta de venda enviada para ${buyer.name}.`);
}

async function twbvOpenItemSaleDialog(actor, item) {
  const options = twbvActorRecipientOptions(actor) || '<option value="">Nenhuma ficha dispon\u00edvel</option>';
  const isMedieval = String(actor.system?.dinheiro?.modo ?? "moderno") === "medieval";
  const moneyFields = isMedieval
    ? `
        <label>Moeda da venda<select name="fromCurrency">${twbvMedievalMoneyCurrencyOptions("ouro")}</select></label>
        <label>Valor<input type="text" name="amount" value="0" inputmode="numeric" /></label>
        <p class="wide">Venda medieval n&atilde;o usa conversor: ouro fica ouro, prata fica prata, cobre fica cobre.</p>`
    : `
        <label>Moeda que o comprador paga<select name="fromCurrency">${twbvMoneyCurrencyOptions("USD")}</select></label>
        <label>Valor<input type="text" name="amount" value="${twbvFormatMoneyValue(item.system?.cost || 0)}" inputmode="decimal" /></label>
        <label>Moeda que o vendedor recebe<select name="toCurrency">${twbvMoneyCurrencyOptions("USD")}</select></label>
        <label>1 USD vale<input type="text" name="rate" value="5,00" inputmode="decimal" /></label>
        <label>Taxa banc&aacute;ria %<input type="number" name="feePercent" value="" min="0" step="0.1" /></label>`;
  new Dialog({
    title: `Vender ${item.name}`,
    content: `
      <form class="twbv-transfer-dialog" data-money-mode="${isMedieval ? "medieval" : "moderno"}">
        <label class="wide twbv-money-toggle"><input type="checkbox" name="sellToActor" checked /><span>Vender para ficha existente</span></label>
        <label>Ficha compradora<select name="buyerActor">${options}</select></label>
        <label>NPC / Sem ficha<input type="text" name="buyerNpc" placeholder="Loja, mercador, contato..." /></label>
        ${moneyFields}
        <label class="wide">Motivo<input type="text" name="reason" value="Compra de ${twbvEscapeHtml(item.name)}" /></label>
      </form>`,
    buttons: {
      send: {
        icon: '<i class="fas fa-handshake"></i>',
        label: "Enviar proposta",
        callback: (html) => twbvCreateItemSaleRequest(actor, item, twbvDialogForm(html))
      },
      cancel: { label: "Cancelar" }
    },
    default: "send"
  }).render(true);
}

async function twbvOpenItemDonationDialog(actor, item) {
  const options = twbvActorRecipientOptions(actor);
  if (!options) return ui.notifications?.warn("Nenhuma ficha de destino dispon\u00edvel para doa\u00e7\u00e3o.");
  new Dialog({
    title: `Doar ${item.name}`,
    content: `<form class="twbv-transfer-dialog"><label>Ficha destino<select name="buyerActor">${options}</select></label><p>O item ser&aacute; movido para a ficha escolhida sem cobrar dinheiro.</p></form>`,
    buttons: {
      send: {
        icon: '<i class="fas fa-gift"></i>',
        label: "Doar item",
        callback: async (html) => {
          const form = twbvDialogForm(html);
          const buyer = game.actors?.get(String(form?.querySelector('[name="buyerActor"]')?.value ?? ""));
          if (!buyer) return ui.notifications?.warn("Escolha a ficha destino.");
          await twbvDispatchItemTransfer({
            id: foundry.utils.randomID(12),
            kind: "donation",
            sellerActorId: actor.id,
            sellerName: actor.name,
            buyerActorId: buyer.id,
            buyerName: buyer.name,
            itemId: item.id,
            itemName: item.name
          });
        }
      },
      cancel: { label: "Cancelar" }
    },
    default: "send"
  }).render(true);
}

async function twbvAcceptItemTradeMessage(message) {
  const payload = message.getFlag("world-behind-the-veil", "itemTrade");
  if (!payload || message.getFlag("world-behind-the-veil", "tradeState") !== "pending") return;
  const buyer = game.actors?.get(payload.buyerActorId);
  if (!twbvUserCanAcceptTrade(buyer)) return ui.notifications?.warn("Voc\u00ea precisa ser dono da ficha compradora para aceitar este trade.");
  new Dialog({
    title: `Aceitar compra de ${payload.itemName}`,
    content: `<div class="twbv-transfer-dialog"><p><strong>${twbvEscapeHtml(payload.itemName)}</strong></p><p>${twbvEscapeHtml(twbvTradePayloadLabel(payload))}</p><p>Ao aceitar, o dinheiro sai da ficha compradora e o item entra no invent&aacute;rio dela.</p></div>`,
    buttons: {
      accept: {
        icon: '<i class="fas fa-check"></i>',
        label: "Aceitar e pagar",
        callback: () => twbvDispatchItemTransfer(payload, message.id)
      },
      cancel: { label: "Voltar" }
    },
    default: "accept"
  }).render(true);
}

async function twbvDeclineItemTradeMessage(message) {
  const payload = message.getFlag("world-behind-the-veil", "itemTrade");
  if (!payload || message.getFlag("world-behind-the-veil", "tradeState") !== "pending") return;
  const buyer = game.actors?.get(payload.buyerActorId);
  if (!twbvUserCanAcceptTrade(buyer)) return ui.notifications?.warn("Voc\u00ea precisa ser dono da ficha compradora para recusar este trade.");
  await message.update({ content: twbvBuildItemTradeChatContent(payload, "declined"), "flags.world-behind-the-veil.tradeState": "declined" });
}

function twbvReadMedievalMoneyFromSheet(actor, html) {
  const root = html?.[0] ?? html;
  const balances = {};
  for (const currency of TWBV_MEDIEVAL_CURRENCIES) {
    balances[currency.code] = Math.max(0, Math.round(twbvParseMoneyValue(root?.querySelector?.(`[name="system.dinheiro.${currency.code}"]`)?.value ?? actor?.system?.dinheiro?.[currency.code] ?? 0)));
  }
  const worldRates = twbvGetWorldMedievalRates();
  const rates = twbvNormalizeMedievalRates({
    cobrePorPrata: root?.querySelector?.('[data-twbv-medieval-rate="cobrePorPrata"]')?.value ?? worldRates.cobrePorPrata,
    prataPorOuro: root?.querySelector?.('[data-twbv-medieval-rate="prataPorOuro"]')?.value ?? worldRates.prataPorOuro,
    ouroPorPlatina: root?.querySelector?.('[data-twbv-medieval-rate="ouroPorPlatina"]')?.value ?? worldRates.ouroPorPlatina
  });
  return { balances, rates };
}

function twbvMedievalMoneyUpdatePayload(balances, rates, records) {
  return {
    "system.dinheiro.cobre": Math.max(0, Math.round(balances.cobre ?? 0)),
    "system.dinheiro.prata": Math.max(0, Math.round(balances.prata ?? 0)),
    "system.dinheiro.ouro": Math.max(0, Math.round(balances.ouro ?? 0)),
    "system.dinheiro.platina": Math.max(0, Math.round(balances.platina ?? 0)),
    "system.dinheiro.registros": records.slice(-80)
  };
}

async function twbvSaveWorldMedievalRates(html) {
  if (!game.user?.isGM) return ui.notifications?.warn("Apenas o mestre pode alterar o padr\u00e3o monet\u00e1rio do mundo.");
  const root = html?.[0] ?? html;
  const rates = twbvNormalizeMedievalRates({
    cobrePorPrata: root?.querySelector?.('[data-twbv-medieval-rate="cobrePorPrata"]')?.value,
    prataPorOuro: root?.querySelector?.('[data-twbv-medieval-rate="prataPorOuro"]')?.value,
    ouroPorPlatina: root?.querySelector?.('[data-twbv-medieval-rate="ouroPorPlatina"]')?.value
  });
  await game.settings.set("world-behind-the-veil", "medievalConversionRates", rates);
  ui.notifications?.info(`Padr\u00e3o medieval salvo: ${rates.cobrePorPrata} cobre = 1 prata, ${rates.prataPorOuro} prata = 1 ouro, ${rates.ouroPorPlatina} ouro = 1 platina.`);
}

async function twbvApplyMedievalMoneyConversion(actor, html) {
  const root = html?.[0] ?? html;
  if (!actor || !root) return;
  const from = String(root.querySelector('[name="twbvMedievalExchangeFrom"]')?.value ?? "cobre");
  const to = String(root.querySelector('[name="twbvMedievalExchangeTo"]')?.value ?? "prata");
  const amount = Math.max(0, Math.round(twbvParseMoneyValue(root.querySelector('[name="twbvMedievalExchangeAmount"]')?.value)));
  if (!amount) return ui.notifications?.warn("Informe um valor maior que zero.");
  if (from === to) return ui.notifications?.warn("Escolha moedas diferentes para converter.");

  const { balances, rates } = twbvReadMedievalMoneyFromSheet(actor, html);
  const fromMeta = twbvMoneyCurrencyMeta(from);
  const toMeta = twbvMoneyCurrencyMeta(to);
  if ((balances[from] ?? 0) < amount) return ui.notifications?.warn(`Saldo insuficiente em ${fromMeta.name}.`);
  const copperValue = amount * twbvMedievalCurrencyCopperValue(from, rates);
  const received = Math.floor(copperValue / twbvMedievalCurrencyCopperValue(to, rates));
  if (received <= 0) return ui.notifications?.warn("Essa convers\u00e3o resultaria em 0 moedas de destino.");
  balances[from] = Math.max(0, Math.round((balances[from] ?? 0) - amount));
  balances[to] = Math.max(0, Math.round((balances[to] ?? 0) + received));
  const detail = `${twbvFormatMedievalMoneyValue(amount)} ${fromMeta.name} convertidos para ${twbvFormatMedievalMoneyValue(received)} ${toMeta.name}. Taxas: ${rates.cobrePorPrata} cobre = 1 prata, ${rates.prataPorOuro} prata = 1 ouro, ${rates.ouroPorPlatina} ouro = 1 platina.`;
  const records = Array.isArray(actor.system?.dinheiro?.registros) ? foundry.utils.deepClone(actor.system.dinheiro.registros) : [];
  records.push(twbvMoneyRecord("conversion", { amount: received, currency: to, name: `${fromMeta.name} para ${toMeta.name}`, from: "C\u00e2mbio medieval", reason: "Convers\u00e3o monet\u00e1ria", detail, realm: "medieval" }));
  await actor.update(twbvMedievalMoneyUpdatePayload(balances, rates, records));
  await twbvPostSheetTransactionChat({
    actor,
    title: "C\u00e2mbio medieval",
    subtitle: actor.name,
    icon: "fas fa-coins",
    rows: [
      { label: "Ficha", value: actor.name },
      { label: "Origem", value: `${twbvFormatMedievalMoneyValue(amount)} ${fromMeta.name}` },
      { label: "Destino", value: `${twbvFormatMedievalMoneyValue(received)} ${toMeta.name}` }
    ],
    detail
  });
  ui.notifications?.info(detail);
}

async function twbvApplyMedievalMoneyLedgerEntry(actor, html, type) {
  const root = html?.[0] ?? html;
  if (!actor || !root) return;
  const currency = String(root.querySelector('[name="twbvMedievalRecordCurrency"]')?.value ?? "cobre");
  const meta = twbvMoneyCurrencyMeta(currency);
  const amount = Math.max(0, Math.round(twbvParseMoneyValue(root.querySelector('[name="twbvMedievalRecordAmount"]')?.value)));
  if (!amount) return ui.notifications?.warn("Informe um valor maior que zero.");
  const { balances, rates } = twbvReadMedievalMoneyFromSheet(actor, html);
  if (type === "expense" && (balances[currency] ?? 0) < amount) return ui.notifications?.warn(`Saldo insuficiente em ${meta.name}.`);
  balances[currency] = Math.max(0, Math.round((balances[currency] ?? 0) + (type === "gain" ? amount : -amount)));
  const name = String(root.querySelector('[name="twbvMedievalRecordName"]')?.value ?? "").trim() || (type === "gain" ? "Ganho medieval" : "Gasto medieval");
  const date = String(root.querySelector('[name="twbvMedievalRecordDate"]')?.value ?? "").trim() || new Date().toLocaleDateString("pt-BR");
  const from = String(root.querySelector('[name="twbvMedievalRecordFrom"]')?.value ?? "").trim();
  const reason = String(root.querySelector('[name="twbvMedievalRecordReason"]')?.value ?? "").trim();
  const detail = `${type === "gain" ? "Entrada" : "Sa\u00edda"} de ${twbvFormatMedievalMoneyValue(amount)} ${meta.name}. Saldo final: ${twbvFormatMedievalMoneyValue(balances[currency])} ${meta.symbol}.`;
  const records = Array.isArray(actor.system?.dinheiro?.registros) ? foundry.utils.deepClone(actor.system.dinheiro.registros) : [];
  records.push(twbvMoneyRecord(type, { name, amount, currency, date, from, reason, detail, realm: "medieval" }));
  await actor.update(twbvMedievalMoneyUpdatePayload(balances, rates, records));
  await twbvPostSheetTransactionChat({
    actor,
    title: type === "gain" ? "Entrada medieval" : "Sa\u00edda medieval",
    subtitle: actor.name,
    icon: type === "gain" ? "fas fa-plus" : "fas fa-minus",
    rows: [
      { label: "Ficha", value: actor.name },
      { label: "Nome", value: name },
      { label: "Moeda", value: meta.name },
      { label: "Valor", value: `${twbvFormatMedievalMoneyValue(amount)} ${meta.symbol}` },
      { label: "De / Para", value: from },
      { label: "Motivo", value: reason }
    ],
    detail
  });
  ui.notifications?.info(detail);
}

function twbvGetReloadTypeLabel(type) {
  const labels = {
    magazine: "pente",
    loader: "carregador",
    clip: "clip",
    shell: "cartucho",
    round: "projétil",
    cylinder: "cilindro",
    cell: "célula",
    box: "caixa"
  };
  return labels[String(type ?? "").trim()] ?? "munição";
}

async function twbvOpenWeaponAmmoPicker(actor, weapon) {
  if (!actor || !weapon?.isEmbedded) return ui.notifications?.warn("Abra a arma pela ficha para escolher munição do inventário.");
  const ammoItems = Array.from(actor.items ?? []).filter((item) => item.type === "municao");
  if (!ammoItems.length) return ui.notifications?.warn("Nenhuma munição ou carregador no inventário.");
  const options = ammoItems.map((item) => {
    const typeLabel = TWBV_AMMO_RELOAD_LABELS[item.system?.reloadType] ?? item.system?.reloadType ?? "Munição";
    const shots = `${Number(item.system?.currentShots ?? 0)} / ${Number(item.system?.shots ?? 0)}`;
    const boxTag = twbvIsAmmoBox(item) ? "Caixa" : "Carregador";
    return `<option value="${item.id}">${item.name} &middot; ${boxTag} / ${typeLabel} &middot; ${shots}</option>`;
  }).join("");
  const content = `
    <form class="twbv-roll-adjust-dialog twbv-ammo-picker-dialog">
      <label>Munições e carregadores
        <select name="ammoId">${options}</select>
      </label>
    </form>`;
  new Dialog({
    title: `Escolher munição para ${weapon.name}`,
    content,
    buttons: {
      select: {
        label: "Selecionar",
        callback: async (html) => {
          const root = resolveDialogRoot(html);
          const ammo = actor.items.get(root?.querySelector('select[name="ammoId"]')?.value);
          if (!ammo) return;
          if (twbvIsAmmoBox(ammo)) {
            ui.notifications?.warn("Caixas carregam pentes/carregadores. Para a arma, selecione um pente, carregador, clip, cartucho, projétil, cilindro ou célula.");
            return;
          }
          const loaded = Math.max(0, Number(ammo.system?.currentShots ?? 0));
          if (loaded <= 0) return ui.notifications?.warn(`${ammo.name} está vazio. Carregue-o usando uma caixa de munição.`);
          const capacity = Math.max(0, Number(ammo.system?.shots ?? loaded));
          await weapon.update({
            "system.ammo": ammo.name,
            "system.ammoSourceUuid": ammo.uuid,
            "system.ammoSourceName": ammo.name,
            "system.ammoAp": twbvNumberOrZero(ammo.system?.ap),
            "system.reloadType": ammo.system?.reloadType ?? "magazine",
            "system.shots": capacity,
            "system.currentShots": Math.min(loaded, capacity || loaded)
          });
          await ammo.update({ "system.currentShots": 0 });
          ui.notifications?.info(`${weapon.name} carregada com ${ammo.name}.`);
        }
      },
      cancel: { label: "Cancelar" }
    },
    default: "select"
  }).render(true);
}

async function twbvOpenCarrierLoadPicker(actor, carrier) {
  if (!actor || !carrier?.isEmbedded) return ui.notifications?.warn("Abra o carregador pela ficha para carregar usando uma caixa.");
  const boxes = Array.from(actor.items ?? []).filter((item) => item.type === "municao" && twbvIsAmmoBox(item) && Number(item.system?.currentShots ?? 0) > 0);
  if (!boxes.length) return ui.notifications?.warn("Nenhuma caixa de munição com munição dispon?vel.");
  const options = boxes.map((box) => {
    const shots = `${Number(box.system?.currentShots ?? 0)} / ${Number(box.system?.shots ?? 0)}`;
    return `<option value="${box.id}">${box.name} &middot; Caixa &middot; ${shots}</option>`;
  }).join("");
  const content = `
    <form class="twbv-roll-adjust-dialog twbv-ammo-picker-dialog">
      <label>Caixa de munição
        <select name="boxId">${options}</select>
      </label>
    </form>`;
  new Dialog({
    title: `Carregar ${carrier.name}`,
    content,
    buttons: {
      load: {
        label: "Carregar",
        callback: async (html) => {
          const root = resolveDialogRoot(html);
          const box = actor.items.get(root?.querySelector('select[name="boxId"]')?.value);
          if (!box) return;
          const capacity = Math.max(0, Number(carrier.system?.shots ?? 0));
          if (capacity <= 0) return ui.notifications?.warn(`${carrier.name} não tem capacidade configurada.`);
          const current = Math.max(0, Number(carrier.system?.currentShots ?? 0));
          const available = Math.max(0, Number(box.system?.currentShots ?? 0));
          const load = Math.min(capacity - current, available);
          if (load <= 0) return ui.notifications?.warn(`${carrier.name} j? está cheio ou ${box.name} está vazia.`);
          await carrier.update({ "system.currentShots": current + load });
          await box.update({ "system.currentShots": available - load });
          ui.notifications?.info(`${carrier.name} recebeu ${load} munições de ${box.name}.`);
        }
      },
      cancel: { label: "Cancelar" }
    },
    default: "load"
  }).render(true);
}

function twbvBuildWeaponAttackExtras(weapon, bonusDetails = [], nextShots = 0, maxShots = 0) {
  const max = Math.max(0, twbvNumberOrZero(maxShots));
  const current = Math.max(0, twbvNumberOrZero(nextShots));
  const percent = max > 0 ? Math.max(0, Math.min(100, Math.round((current / max) * 100))) : 0;
  const mods = bonusDetails.length
    ? bonusDetails.map((mod) => `<span>${escapeHtml(mod.name)} ${escapeHtml(twbvFormatSignedNumber(mod.value))}</span>`).join("")
    : `<span>Nenhuma modifica??o de acerto</span>`;
  const ammo = max > 0
    ? `<div class="twbv-chat-ammo">
        <div class="twbv-chat-ammo__head"><span>Munição</span><strong>${current} / ${max}</strong></div>
        <div class="twbv-chat-ammo__bar"><i style="width:${percent}%;"></i></div>
        ${weapon?.system?.ammo ? `<div class="twbv-chat-ammo__name">${escapeHtml(weapon.system.ammo)}</div>` : ""}
      </div>`
    : "";
  return `
    <div class="twbv-attack-details">
      <h4>Modificações de acerto</h4>
      <div class="twbv-attack-mod-list">${mods}</div>
      ${ammo}
      <div class="twbv-chat-damage-actions">
        <button type="button" class="twbv-chat-damage-button" data-damage-mode="normal" data-weapon-uuid="${escapeHtmlAttr(weapon?.uuid ?? "")}">
          <i class="fas fa-bolt"></i> Dano
        </button>
        <button type="button" class="twbv-chat-damage-button twbv-chat-damage-button--amplified" data-damage-mode="amplified" data-weapon-uuid="${escapeHtmlAttr(weapon?.uuid ?? "")}">
          <i class="fas fa-bolt"></i> Dano Ampliado
        </button>
      </div>
    </div>`;
}

async function twbvAppendWeaponDamageToChat(message, weaponUuid, { amplified = false } = {}) {
  const weapon = await fromUuid(String(weaponUuid ?? ""));
  const actor = weapon?.actor;
  if (!weapon || !actor) {
    ui.notifications?.warn("Arma não encontrada para rolar dano.");
    return;
  }
  const damageMods = twbvGetWeaponMods(weapon).filter((mod) => String(mod.damage ?? "").trim());
  const damageContent = await twbvBuildWeaponDamageChatContent(actor, weapon, damageMods, { amplified });
  if (!damageContent) return;
  const current = String(message.content ?? "");
  const wrapper = document.createElement("div");
  wrapper.innerHTML = current;
  const target = wrapper.querySelector(".twbv-chat-damage-result");
  if (target) target.innerHTML = damageContent;
  else wrapper.insertAdjacentHTML("beforeend", `<div class="twbv-chat-damage-result">${damageContent}</div>`);
  const nextContent = wrapper.innerHTML;
  await message.update({ content: nextContent });
}

async function twbvRollWeaponSkill(actor, weapon, extraBonus = 0, attackState = {}) {
  const skillName = String(weapon?.system?.skill ?? weapon?.system?.trait ?? "").trim();
  if (!actor || !skillName) return false;

  const skills = Array.from(actor.system?.pericias ?? []);
  const skillIndex = skills.findIndex((entry) => String(entry?.nome ?? "").trim().toLocaleLowerCase("pt-BR") === skillName.toLocaleLowerCase("pt-BR"));
  const skill = skillIndex >= 0 ? skills[skillIndex] : null;
  if (!skill) {
    ui.notifications?.warn(`Perícia "${skillName}" não encontrada em ${actor.name}.`);
    return false;
  }

  const attrKey = String(skill?.atributo ?? "destreza").toLowerCase();
  const attr = SKILL_ATTRIBUTES.find((entry) => entry.key === attrKey) ?? SKILL_ATTRIBUTES.find((entry) => entry.key === "destreza") ?? SKILL_ATTRIBUTES[0];
  const attrData = actor.system?.atributos?.[attr.key] ?? {};
  const attrBonus = Number(attrData.bonus ?? 0);
  const attrDie = normalizeAttributeStep(attrData.passo ?? 4);
  const awakenedDie = resolveAwakenedDie(attrDie);
  const skillDie = SKILL_DICE.includes(Number(skill.dado)) ? Number(skill.dado) : 4;
  const skillBonus = Number(skill.bonus ?? 0);
  const modBonus = Number.isFinite(Number(extraBonus)) ? Number(extraBonus) : 0;
  const ferimentoPenalty = getGlobalRollPenalty(actor.system);
  const totalBonus = skillBonus + attrBonus + modBonus;
  const currentShots = Number.isFinite(Number(attackState.currentShots)) ? Number(attackState.currentShots) : Number(weapon.system?.currentShots ?? 0);
  const maxShots = Number.isFinite(Number(attackState.maxShots)) ? Number(attackState.maxShots) : Number(weapon.system?.shots ?? 0);
  const bonusDetails = twbvGetWeaponTraitBonusDetails(weapon);
  const skillBonusDetails = twbvGetActorSkillBonusDetails(actor, skillIndex, skillBonus, "Per\u00edcia");
  const attrBonusDetails = twbvGetActorAttributeBonusDetails(actor, attr.key, attrBonus, attr.label);
  const skillIcon = twbvGetSkillIconPath(skill);
  const rollBonusDetails = [
    ...skillBonusDetails,
    ...attrBonusDetails,
    ...bonusDetails.map((mod) => ({ label: mod.name, value: mod.value }))
  ].filter(Boolean);
  const attackExtras = twbvBuildWeaponAttackExtras(weapon, bonusDetails, currentShots, maxShots);

  if (twbvActorUsesAwakenedDie(actor)) {
    await renderDualDieResult({
      title: `${weapon.name} - ${skillName}`,
      subtitle: `<span class="twbv-skill-attr twbv-attr-${attr.key}">${attr.label}</span>${ferimentoPenalty.label ? ` &middot; ${ferimentoPenalty.label}` : ""}`,
      dieA: skillDie,
      labelA: "Perícia",
      dieB: awakenedDie,
      labelB: "Desperto",
      bonusA: totalBonus,
      bonusB: 0,
      finalModifier: ferimentoPenalty.value,
      finalModifierLabel: ferimentoPenalty.label,
      dieDisplayA: buildDieLabel(skillDie, skillBonus),
      dieDisplayB: `d${awakenedDie}`,
      bonusDetailsA: rollBonusDetails,
      actor,
      extraContent: attackExtras,
      extraContentPlacement: "top",
      icon: skillIcon
    });
    return true;
  }

  await renderSingleDieResult({
    title: `${weapon.name} - ${skillName}`,
    subtitle: `<span class="twbv-skill-attr twbv-attr-${attr.key}">${attr.label}</span>${ferimentoPenalty.label ? ` &middot; ${ferimentoPenalty.label}` : ""}`,
    die: skillDie,
    label: "Perícia",
    bonus: totalBonus,
    finalModifier: ferimentoPenalty.value,
    finalModifierLabel: ferimentoPenalty.label,
    dieDisplay: buildDieLabel(skillDie, skillBonus),
    bonusDetails: rollBonusDetails,
    actor,
    extraContent: attackExtras,
    extraContentPlacement: "top",
    icon: skillIcon
  });
  return true;
}

async function twbvRollWeaponAttack(actor, item) {
  if (!actor || !item) return false;
  const c = Number(item.system.currentShots ?? 0);
  const max = Number(item.system.shots ?? 0);
  if (max > 0 && c <= 0) {
    ui.notifications?.warn(`${item.name} está sem munição.`);
    return false;
  }
  const nextShots = max > 0 ? Math.max(c - 1, 0) : c;
  if (max > 0) await item.update({ "system.currentShots": nextShots });
  const bonusDetails = twbvGetWeaponTraitBonusDetails(item);
  const totalBonus = bonusDetails.reduce((sum, mod) => sum + mod.value, 0);
  if (String(item.system?.skill ?? "").trim()) {
    const rolled = await twbvRollWeaponSkill(actor, item, totalBonus, { currentShots: nextShots, maxShots: max });
    if (rolled) return true;
  }
  const bonusText = bonusDetails.length
    ? `<p><strong>Bônus de modificações:</strong> ${bonusDetails.map((mod) => `${escapeHtml(mod.name)} ${twbvFormatSignedNumber(mod.value)}`).join(", ")}. Total ${twbvFormatSignedNumber(totalBonus)} para acertar.</p>`
    : "";
  ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `<p><strong>${escapeHtml(item.name)}</strong> atacou. Munição: ${nextShots}/${max}</p>${bonusText}${twbvBuildWeaponAttackExtras(item, bonusDetails, nextShots, max)}`
  });
  return true;
}

async function twbvRollWeaponDamageByUuid(itemUuid) {
  const item = await fromUuid(String(itemUuid ?? ""));
  if (!item?.actor) return ui.notifications?.warn("Arma não encontrada.");
  const damageMods = twbvGetWeaponMods(item).filter((mod) => String(mod.damage ?? "").trim());
  await twbvRenderWeaponDamageRoll(item.actor, item, damageMods);
}

async function twbvRollWeaponAmplifiedDamageByUuid(itemUuid) {
  const item = await fromUuid(String(itemUuid ?? ""));
  if (!item?.actor) return ui.notifications?.warn("Arma não encontrada.");
  const damageMods = twbvGetWeaponMods(item).filter((mod) => String(mod.damage ?? "").trim());
  await twbvRenderWeaponDamageRoll(item.actor, item, damageMods, { amplified: true });
}

async function twbvRollWeaponAttackByUuid(itemUuid) {
  const item = await fromUuid(String(itemUuid ?? ""));
  if (!item?.actor) return ui.notifications?.warn("Arma não encontrada.");
  await twbvRollWeaponAttack(item.actor, item);
}

async function twbvRollPowerSkill(actor, power, { returnContentOnly = false, skipManaCost = false } = {}) {
  if (!actor || !power) return;
  const skillName = String(power.system?.skill ?? power.system?.pericia ?? "").trim();
  if (!skillName) return ui.notifications?.warn(`${power.name} n\u00e3o tem per\u00edcia atribu\u00edda.`);
  const actorSkills = Array.from(actor.system?.pericias ?? []);
  const skillIndex = actorSkills.findIndex((entry) => String(entry?.nome ?? "").trim().toLocaleLowerCase("pt-BR") === skillName.toLocaleLowerCase("pt-BR"));
  const skill = skillIndex >= 0 ? actorSkills[skillIndex] : null;
  if (!skill) return ui.notifications?.warn(`Per\u00edcia "${skillName}" n\u00e3o encontrada em ${actor.name}.`);
  const manaCost = skipManaCost ? 0 : Math.max(0, twbvNumberOrZero(power.system?.manaCost ?? power.system?.mana ?? power.system?.costMana));
  const currentMana = Math.max(0, twbvNumberOrZero(actor.system?.mana?.value));
  if (manaCost > currentMana) {
    const content = `<section class="twbv-power-chat twbv-power-chat--warning"><strong>${escapeHtml(actor.name)}</strong> tentou usar <strong>${escapeHtml(power.name)}</strong>, mas n\u00e3o tem Mana suficiente. Custo: ${manaCost} | Mana atual: ${currentMana}.</section>`;
    if (returnContentOnly) {
      ui.notifications?.warn(`${actor.name} n\u00e3o tem Mana suficiente para usar ${power.name}.`);
      return { content, contentWithAdjust: content, total: null, reroll: null };
    }
    await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content, type: CONST.CHAT_MESSAGE_TYPES.OTHER });
    return ui.notifications?.warn(`${actor.name} n\u00e3o tem Mana suficiente para usar ${power.name}.`);
  }
  if (manaCost > 0) await actor.update({ "system.mana.value": currentMana - manaCost });
  const manaText = manaCost > 0 ? ` Mana -${manaCost}` : "";
  const attr = getSkillAttributeMeta(String(skill?.atributo ?? "forca").toLowerCase());
  const attrData = actor.system?.atributos?.[attr.key] ?? {};
  const attrBonus = Number(attrData.bonus ?? 0);
  const attrDie = normalizeAttributeStep(attrData.passo ?? 4);
  const awakenedDie = resolveAwakenedDie(attrDie);
  const skillDie = SKILL_DICE.includes(Number(skill.dado)) ? Number(skill.dado) : 4;
  const skillBonus = Number(skill.bonus ?? 0);
  const ferimentoPenalty = getGlobalRollPenalty(actor.system);
  const totalBonus = skillBonus + attrBonus;
  const bonusDetails = [
    ...twbvGetActorSkillBonusDetails(actor, skillIndex, skillBonus, "Per\u00edcia"),
    ...twbvGetActorAttributeBonusDetails(actor, attr.key, attrBonus, attr.label)
  ].filter(Boolean);
  const skillIcon = twbvGetSkillIconPath(skill);
  if (twbvActorUsesAwakenedDie(actor)) {
    return renderDualDieResult({
      title: `${power.name} - ${skillName}`,
      subtitle: `<span class="twbv-skill-attr twbv-attr-${attr.key}">${attr.label}</span>${ferimentoPenalty.label ? ` &middot; ${ferimentoPenalty.label}` : ""}`,
      dieA: skillDie,
      labelA: "Per\u00edcia",
      dieB: awakenedDie,
      labelB: "Desperto",
      bonusA: totalBonus,
      bonusB: 0,
      finalModifier: ferimentoPenalty.value,
      finalModifierLabel: ferimentoPenalty.label,
      dieDisplayA: buildDieLabel(skillDie, skillBonus),
      dieDisplayB: `d${awakenedDie}`,
      bonusDetailsA: bonusDetails,
      actor,
      icon: skillIcon,
      returnContentOnly
    });
  }
  return renderSingleDieResult({
    title: `${power.name} - ${skillName}`,
    subtitle: `<span class="twbv-skill-attr twbv-attr-${attr.key}">${attr.label}</span>${ferimentoPenalty.label ? ` &middot; ${ferimentoPenalty.label}` : ""}`,
    die: skillDie,
    label: "Per\u00edcia",
    bonus: totalBonus,
    finalModifier: ferimentoPenalty.value,
    finalModifierLabel: ferimentoPenalty.label,
    dieDisplay: buildDieLabel(skillDie, skillBonus),
    bonusDetails,
    actor,
    icon: skillIcon,
    returnContentOnly
  });
}

async function twbvAppendPowerRollToChat(message, powerUuid, { skipManaCost = false } = {}) {
  const power = await fromUuid(String(powerUuid ?? ""));
  if (!power?.actor) return ui.notifications?.warn("Poder n\u00e3o encontrado.");
  const rollContent = await twbvRollPowerSkill(power.actor, power, { returnContentOnly: true, skipManaCost });
  if (!rollContent?.content) return;
  const wrapper = document.createElement("div");
  wrapper.innerHTML = String(message.content ?? "");
  const safeUuid = CSS.escape(String(power.uuid));
  const card = wrapper.querySelector(`.twbv-power-chat[data-power-uuid="${safeUuid}"]`) ?? wrapper.querySelector(".twbv-power-chat");
  if (!card) return twbvRollPowerSkill(power.actor, power);
  let target = card.querySelector(".twbv-power-roll-result");
  if (!target) {
    card.insertAdjacentHTML("beforeend", `<div class="twbv-power-roll-result"></div>`);
    target = card.querySelector(".twbv-power-roll-result");
  }
  target.insertAdjacentHTML("beforeend", `<div class="twbv-power-roll-entry">${rollContent.content}</div>`);
  await message.update({ content: wrapper.innerHTML });
}

async function twbvBuildPowerDamageChatContent(power, formula) {
  const safeFormula = String(formula ?? power?.system?.damage ?? power?.system?.dano ?? "").trim();
  if (!safeFormula) return null;
  let detailedRoll;
  try {
    detailedRoll = await twbvEvaluateDamagePartsTogether([
      { label: "Dano", formula: safeFormula },
      ...twbvDamageBonusRollParts(power?.actor ?? null, "power")
    ]);
  } catch (error) {
    console.error("[TWBV] Férmula de dano inválida.", { power: power?.name, formula: safeFormula, error });
    ui.notifications?.error(`Férmula de dano inválida em ${power?.name ?? "poder"}: ${safeFormula}`);
    return null;
  }
  return `
    <section class="twbv-roll-chat twbv-damage-chat twbv-damage-chat--compact twbv-power-cast-roll">
      <details class="twbv-roll-card twbv-roll-card--compact twbv-roll-card--damage-total is-selected">
        <summary>
          <span class="twbv-roll-card__label">Dano escolhido</span>
          <span class="twbv-roll-card__die">${escapeHtml(safeFormula)}</span>
          <span class="twbv-roll-card__value">${Number(detailedRoll.total ?? 0)}</span>
        </summary>
        <div class="twbv-roll-card__value--breakdown">
          <div class="twbv-roll-breakdown">
            ${detailedRoll.rows}
            <div class="twbv-roll-breakdown__row is-total"><span>Dano Total</span><strong>${Number(detailedRoll.total ?? 0)}</strong></div>
          </div>
        </div>
      </details>
    </section>`;
}

async function twbvAppendPowerCastDamageToChat(message, powerUuid) {
  const power = await fromUuid(String(powerUuid ?? ""));
  if (!power?.actor) return ui.notifications?.warn("Poder n\u00e3o encontrado.");
  const cast = message.getFlag("world-behind-the-veil", "powerCast") ?? {};
  const formula = String(cast.damageFormula ?? power.system?.damage ?? power.system?.dano ?? "").trim();
  if (!formula || formula === "-") return ui.notifications?.warn(`${power.name} n\u00e3o tem dano configurado.`);
  const damageContent = await twbvBuildPowerDamageChatContent(power, formula);
  if (!damageContent) return;
  const wrapper = document.createElement("div");
  wrapper.innerHTML = String(message.content ?? "");
  const safeUuid = CSS.escape(String(power.uuid));
  const card = wrapper.querySelector(`.twbv-power-chat[data-power-uuid="${safeUuid}"]`) ?? wrapper.querySelector(".twbv-power-chat");
  if (!card) return;
  let target = card.querySelector(".twbv-power-damage-result");
  if (!target) {
    card.insertAdjacentHTML("beforeend", `<div class="twbv-power-damage-result"></div>`);
    target = card.querySelector(".twbv-power-damage-result");
  }
  target.insertAdjacentHTML("beforeend", damageContent);
  await message.update({ content: wrapper.innerHTML });
}

async function twbvRevealPowerCastArea(message, powerUuid) {
  const power = await fromUuid(String(powerUuid ?? ""));
  if (!power?.actor) return ui.notifications?.warn("Poder n\u00e3o encontrado.");
  const cast = message.getFlag("world-behind-the-veil", "powerCast") ?? {};
  const areaPreset = String(cast.areaPreset ?? power.system?.areaEffect ?? power.system?.area ?? "none").trim();
  const summary = Array.isArray(cast.summary) ? cast.summary : [];
  const template = await twbvPreviewPowerMeasuredTemplate(areaPreset, { actor: power.actor, power, summary, pendingCast: false });
  if (!template) return;
  const wrapper = document.createElement("div");
  wrapper.innerHTML = String(message.content ?? "");
  const safeUuid = CSS.escape(String(power.uuid));
  const card = wrapper.querySelector(`.twbv-power-chat[data-power-uuid="${safeUuid}"]`) ?? wrapper.querySelector(".twbv-power-chat");
  const result = card?.querySelector?.(".twbv-power-area-result");
  if (result) result.textContent = `Pr\u00e9via ativa: clique no grid para posicionar ${cast.areaLabel ?? twbvGetPowerAreaLabel(areaPreset)}.`;
  await message.update({ content: wrapper.innerHTML });
}

async function twbvRollPowerDamageByUuid(powerUuid) {
  const power = await fromUuid(String(powerUuid ?? ""));
  if (!power?.actor) return ui.notifications?.warn("Poder n\u00e3o encontrado.");
  const formula = String(power.system?.damage ?? power.system?.dano ?? "").trim();
  if (!formula) return ui.notifications?.warn(`${power.name} n\u00e3o tem dano configurado.`);
  return twbvCreateFormulaRollChat({
    actor: power.actor,
    formula,
    title: `Dano - ${power.name}`,
    label: "Dano",
    type: CONST.CHAT_MESSAGE_TYPES.ROLL
  });
}

async function twbvRollPowerSkillByUuid(powerUuid) {
  const power = await fromUuid(String(powerUuid ?? ""));
  if (!power?.actor) return ui.notifications?.warn("Poder n\u00e3o encontrado.");
  return twbvRollPowerSkill(power.actor, power);
}

async function twbvOpenPowerCastDialog(actor, power) {
  if (!actor || !power) return;
  const baseCost = Math.max(0, twbvNumberOrZero(power.system?.manaCost ?? power.system?.mana ?? power.system?.costMana));
  const currentMana = Math.max(0, twbvNumberOrZero(actor.system?.mana?.value));
  const areaPreset = twbvGetPowerAreaPreset(power.system?.areaEffect ?? power.system?.area);
  const baseDamage = String(power.system?.damage ?? power.system?.dano ?? "").trim();
  const castPreset = power.system?.castPreset ?? {};
  const initialDamageSteps = Math.max(0, Number(castPreset.damageSteps ?? 0));
  const initialTargetSteps = Math.max(0, Number(castPreset.targetSteps ?? 0));
  const presetAreaValue = String(castPreset.areaPreset ?? "none").trim();
  const initialAreaPreset = twbvGetPowerAreaPreset(presetAreaValue && presetAreaValue !== "none" ? presetAreaValue : areaPreset.value);
  const initialAreaSize = twbvClampPowerAreaSize(initialAreaPreset.value, castPreset.areaSize ?? initialAreaPreset.squares ?? areaPreset.squares ?? 1);
  let previewTemplate = null;
  let acceptedCast = false;
  const areaFamilies = [
    { value: "sphere-1", label: "Explos\u00e3o", icon: "fas fa-dot-circle" },
    { value: "cone-3", label: "Cone", icon: "fas fa-play" },
    { value: "line-6", label: "Linha", icon: "fas fa-minus" },
    { value: "glyph-1", label: "Glifo", icon: "fas fa-draw-polygon" },
    { value: "aura-1", label: "Aura", icon: "fas fa-sun" },
    { value: "touch", label: "Toque", icon: "fas fa-hand-sparkles" },
    { value: "target", label: "Alvo", icon: "fas fa-crosshairs" }
  ];
  const areaOptions = areaFamilies.map((family) => {
    const preset = twbvGetPowerAreaPreset(family.value);
    return `
    <button type="button" class="twbv-power-area-choice" data-area-preset="${escapeHtmlAttr(preset.value)}">
      <i class="${escapeHtmlAttr(family.icon)}"></i>
      <span>${escapeHtml(family.label)}</span>
    </button>`;
  }).join("");
  const content = `
    <form class="twbv-power-cast-dialog">
      <header>
        <span>Moldar magia</span>
        <h2>${escapeHtml(power.name)}</h2>
      </header>
      <section class="twbv-power-mold-grid">
        <article class="twbv-power-mold-card twbv-power-mold-card--damage">
          <header>
            <i class="fas fa-bolt"></i>
            <div>
              <span>Dano escolhido</span>
              <strong data-damage-output>${escapeHtml(twbvFormatPowerDamage(baseDamage, 0))}</strong>
            </div>
          </header>
          <div class="twbv-power-mold-controls">
            <button type="button" class="twbv-mold-step twbv-mold-step--minus" data-damage-step="-1" title="Diminuir dano"><i class="fas fa-minus"></i></button>
            <input type="number" name="damageSteps" value="${initialDamageSteps}" min="0" step="1" />
            <button type="button" class="twbv-mold-step twbv-mold-step--plus" data-damage-step="1" title="Aumentar dano"><i class="fas fa-plus"></i></button>
          </div>
          <footer><span><i class="fas fa-tint"></i> Mana do dano</span><strong data-damage-cost>0</strong></footer>
        </article>
        <article class="twbv-power-mold-card twbv-power-mold-card--area">
          <header>
            <i class="fas fa-ruler-combined"></i>
            <div>
              <span>&Aacute;rea moldada</span>
              <strong data-area-title>${escapeHtml(initialAreaPreset.value === "none" ? "Nenhuma" : initialAreaPreset.label)}</strong>
            </div>
          </header>
          <button type="button" class="twbv-power-area-toggle" data-area-toggle><i class="fas fa-th-large"></i> Escolher &aacute;rea</button>
          <div class="twbv-power-area-picker" data-area-picker hidden>
            <div class="twbv-power-area-options">${areaOptions}</div>
          </div>
          <div class="twbv-power-area-adjust" data-area-adjust hidden>
            <div>
              <span>&Aacute;rea escolhida</span>
              <strong data-selected-area>Nenhuma</strong>
              <p data-area-summary>Escolha uma &aacute;rea para modificar.</p>
            </div>
            <div class="twbv-power-mold-controls">
              <button type="button" class="twbv-mold-step twbv-mold-step--minus" data-area-step="-1" title="Diminuir &aacute;rea"><i class="fas fa-minus"></i></button>
              <input type="number" name="areaSize" value="${initialAreaSize}" min="1" step="1" />
              <button type="button" class="twbv-mold-step twbv-mold-step--plus" data-area-step="1" title="Aumentar &aacute;rea"><i class="fas fa-plus"></i></button>
            </div>
          </div>
          <footer><span><i class="fas fa-tint"></i> Mana da &aacute;rea</span><strong data-area-cost>0</strong></footer>
          <div class="twbv-power-target-inline" data-target-adjust>
            <header>
              <i class="fas fa-crosshairs"></i>
              <div>
                <span>Alvos</span>
                <strong data-target-output>${1 + initialTargetSteps} alvo${initialTargetSteps ? "s" : ""}</strong>
              </div>
            </header>
            <div class="twbv-power-mold-controls" data-target-controls>
              <button type="button" class="twbv-mold-step twbv-mold-step--minus" data-target-step="-1" title="Diminuir alvos"><i class="fas fa-minus"></i></button>
              <input type="number" name="targetSteps" value="${initialTargetSteps}" min="0" step="1" />
              <button type="button" class="twbv-mold-step twbv-mold-step--plus" data-target-step="1" title="Aumentar alvos"><i class="fas fa-plus"></i></button>
            </div>
            <footer><span><i class="fas fa-tint"></i> Mana de alvos</span><strong data-target-cost>0</strong></footer>
          </div>
        </article>
      </section>
      <section class="twbv-power-effect-final">
        <article class="twbv-power-mana-card twbv-power-mana-card--current"><i class="fas fa-gem"></i><span>Mana atual</span><strong>${currentMana}</strong></article>
        <article class="twbv-power-mana-card twbv-power-mana-card--cost"><i class="fas fa-fire"></i><span>Mana gasta</span><strong data-total-cost>${baseCost}</strong></article>
        <button type="button" class="twbv-power-preview-grid" data-preview-area ${areaPreset.value === "none" ? "disabled" : ""}><i class="fas fa-ruler-combined"></i> Pr&eacute;via do grid</button>
      </section>
      <footer data-summary>Nenhum molde adicional selecionado.</footer>
    </form>`;

  const readState = (root) => {
    const damageSteps = Math.max(0, Number(root?.querySelector('input[name="damageSteps"]')?.value ?? 0));
    const selectedArea = root?.dataset?.selectedArea || initialAreaPreset.value;
    const selectedAreaPreset = twbvGetPowerAreaPreset(selectedArea);
    const targetMode = selectedAreaPreset.shape === "target";
    const touchToTarget = areaPreset.shape === "touch" && targetMode;
    let targetSteps = Math.max(0, Number(root?.querySelector('input[name="targetSteps"]')?.value ?? 0));
    if (touchToTarget) targetSteps = 0;
    const areaSize = twbvClampPowerAreaSize(selectedArea, root?.querySelector('input[name="areaSize"]')?.value ?? 1);
    const summary = [];
    if (damageSteps) {
      summary.push({
        label: "Dano",
        type: "damage",
        quantity: damageSteps,
        cost: damageSteps,
        detail: `${twbvFormatPowerDamage(baseDamage, 0)} -> ${twbvFormatPowerDamage(baseDamage, damageSteps)}`,
        description: "Dano aumentado na hora do lancamento."
      });
    }
    if (targetSteps && targetMode) {
      const targetCost = targetSteps * baseCost;
      summary.push({
        label: "Alvos",
        type: "target",
        quantity: targetSteps,
        cost: targetCost,
        detail: `${1 + targetSteps} alvos (${targetSteps} extra${targetSteps === 1 ? "" : "s"})`,
        description: `Cada alvo extra custa ${baseCost} Mana.`
      });
    }
    const areaSummary = twbvBuildAreaCastSummary(areaPreset.value, selectedArea, areaSize, { actor, power });
    if (twbvShouldIncludeAreaCastSummary(areaPreset.value, areaSummary)) summary.push(areaSummary);
    return {
      damageSteps,
      targetSteps,
      areaSize,
      selectedArea,
      damageCost: damageSteps,
      targetCost: touchToTarget ? 0 : targetSteps * baseCost,
      areaCost: areaSummary?.cost ?? 0,
      summary
    };
  };
  const sync = (root) => {
    const state = readState(root);
    const summary = state.summary;
    const total = baseCost + summary.reduce((sum, entry) => sum + entry.cost, 0);
    const selectedAreaPreset = twbvGetPowerAreaPreset(state.selectedArea);
    const totalEl = root?.querySelector?.("[data-total-cost]");
    if (totalEl) totalEl.textContent = String(total);
    const damageOutput = root?.querySelector?.("[data-damage-output]");
    if (damageOutput) damageOutput.textContent = twbvFormatPowerDamage(baseDamage, state.damageSteps);
    const damageCostEl = root?.querySelector?.("[data-damage-cost]");
    if (damageCostEl) damageCostEl.textContent = String(state.damageCost);
    const targetMode = selectedAreaPreset.shape === "target";
    const touchToTarget = areaPreset.shape === "touch" && targetMode;
    const touchRange = touchToTarget ? twbvGetPowerTouchRange(actor, power) : 0;
    const targetInput = root?.querySelector?.('input[name="targetSteps"]');
    if (touchToTarget && targetInput) targetInput.value = "0";
    const targetOutput = root?.querySelector?.("[data-target-output]");
    if (targetOutput) targetOutput.textContent = touchToTarget
      ? (touchRange ? `Alcance ${touchRange}` : "Alcance do atributo")
      : `${1 + state.targetSteps} alvo${state.targetSteps ? "s" : ""}`;
    const targetCostEl = root?.querySelector?.("[data-target-cost]");
    if (targetCostEl) targetCostEl.textContent = String(state.targetCost);
    const areaCostEl = root?.querySelector?.("[data-area-cost]");
    if (areaCostEl) areaCostEl.textContent = String(state.areaCost);
    const areaSummary = twbvBuildAreaCastSummary(areaPreset.value, state.selectedArea, state.areaSize, { actor, power });
    const areaTitle = root?.querySelector?.("[data-area-title]");
    if (areaTitle) areaTitle.textContent = areaSummary?.areaLabel ?? (selectedAreaPreset.value === "none" ? "Nenhuma" : selectedAreaPreset.label);
    const selectedAreaEl = root?.querySelector?.("[data-selected-area]");
    if (selectedAreaEl) selectedAreaEl.textContent = areaSummary?.areaLabel ?? (selectedAreaPreset.value === "none" ? "Nenhuma" : selectedAreaPreset.label);
    const areaSummaryEl = root?.querySelector?.("[data-area-summary]");
    if (areaSummaryEl) areaSummaryEl.textContent = "";
    const areaLabel = root?.querySelector?.("[data-area-label]");
    if (areaLabel) areaLabel.textContent = areaPreset.value === "none" ? "Nenhuma" : areaPreset.label;
    const areaAdjust = root?.querySelector?.("[data-area-adjust]");
    if (areaAdjust) areaAdjust.hidden = targetMode || selectedAreaPreset.value === "none";
    const targetAdjust = root?.querySelector?.("[data-target-adjust]");
    if (targetAdjust) targetAdjust.hidden = !targetMode;
    const targetControls = root?.querySelector?.("[data-target-controls]");
    if (targetControls) targetControls.hidden = touchToTarget;
    root?.querySelectorAll?.(".twbv-power-area-choice").forEach((button) => button.classList.toggle("is-active", button.dataset.areaPreset === selectedAreaPreset.value));
    const preview = root?.querySelector?.("[data-preview-area]");
    if (preview) preview.disabled = targetMode || selectedAreaPreset.value === "none";
    const summaryEl = root?.querySelector?.("[data-summary]");
    if (summaryEl) summaryEl.textContent = summary.length ? summary.map((entry) => `${entry.label}: ${entry.detail} (${entry.cost} Mana)`).join(" | ") : "Nenhum molde adicional selecionado.";
    const areaSizeInput = root?.querySelector?.('input[name="areaSize"]');
    if (areaSizeInput) areaSizeInput.value = twbvPowerAreaInputDisplayValue(state.selectedArea, state.areaSize);
    if (previewTemplate) {
      if (targetMode || selectedAreaPreset.value === "none") {
        return;
      } else {
        previewTemplate = twbvUpdateActivePowerMeasuredPreview(state.selectedArea, { actor, power, summary, pendingCast: true }) ?? previewTemplate;
      }
    }
  };

  return new Dialog({
    title: `Lancar ${power.name}`,
    content,
    classes: ["wbtv-add-skill-dialog", "wbtv-power-cast-window"],
    render: (appOrHtml, renderedHtml) => {
      const root = resolveDialogRoot(renderedHtml) ?? resolveDialogRoot(appOrHtml);
      applyDialogWindowClass(root, "wbtv-power-cast-window");
      if (root) root.dataset.selectedArea = initialAreaPreset.value;
      root?.querySelectorAll?.("[data-damage-step], [data-target-step], [data-area-step]").forEach((button) => {
        button.addEventListener("click", () => {
          const input = button.closest(".twbv-power-mold-controls")?.querySelector?.("input");
          if (!input) return;
          const step = Number(button.dataset.damageStep ?? button.dataset.targetStep ?? button.dataset.areaStep ?? 0);
          const minimum = input.name === "areaSize" ? 1 : 0;
          input.value = input.name === "areaSize"
            ? twbvPowerAreaInputDisplayValue(root?.dataset?.selectedArea || initialAreaPreset.value, twbvStepPowerAreaSize(root?.dataset?.selectedArea || initialAreaPreset.value, input.value, step))
            : String(Math.max(minimum, Number(input.value ?? minimum) + step));
          sync(root);
        });
      });
      root?.querySelectorAll?.('input[name="damageSteps"], input[name="targetSteps"], input[name="areaSize"]').forEach((input) => input.addEventListener("input", () => {
        if (input.name === "areaSize") input.value = twbvPowerAreaInputDisplayValue(root?.dataset?.selectedArea || initialAreaPreset.value, input.value);
        if (input.name === "targetSteps") input.value = String(Math.max(0, Number(input.value ?? 0)));
        sync(root);
      }));
      root?.querySelector?.("[data-area-toggle]")?.addEventListener("click", () => {
        const picker = root.querySelector("[data-area-picker]");
        if (!picker) return;
        picker.hidden = !picker.hidden;
      });
      root?.querySelectorAll?.(".twbv-power-area-choice").forEach((button) => {
        button.addEventListener("click", () => {
          const selected = twbvGetPowerAreaPreset(button.dataset.areaPreset || areaPreset.value);
          root.dataset.selectedArea = selected.value;
          const sizeInput = root.querySelector('input[name="areaSize"]');
          if (sizeInput) {
            const sameShape = selected.shape === areaPreset.shape && areaPreset.value !== "none";
            sizeInput.value = twbvPowerAreaInputDisplayValue(selected.value, sameShape ? areaPreset.squares : selected.squares);
          }
          const picker = root.querySelector("[data-area-picker]");
          if (picker) picker.hidden = true;
          sync(root);
        });
      });
      root?.querySelector?.("[data-preview-area]")?.addEventListener("click", async (event) => {
        event.preventDefault();
        const state = readState(root);
        previewTemplate = await twbvPreviewPowerMeasuredTemplate(state.selectedArea, { actor, power, summary: state.summary, pendingCast: true, previewOriginElement: root });
      });
      sync(root);
    },
    buttons: {
      cast: {
        label: "Aceitar e lan?ar",
        callback: async (html) => {
          const root = resolveDialogRoot(html);
          const state = readState(root);
          const summary = state.summary;
          const total = baseCost + summary.reduce((sum, entry) => sum + entry.cost, 0);
          if (total > currentMana) {
            ui.notifications?.warn(`${actor.name} n\u00e3o tem Mana suficiente. Custo ${total}, Mana atual ${currentMana}.`);
            return false;
          }
          if (total > 0) await actor.update({ "system.mana.value": currentMana - total });
          const selectedAreaPreset = twbvGetPowerAreaPreset(state.selectedArea);
          const areaEntry = summary.find((entry) => entry.label === "Area");
          acceptedCast = true;
          if (previewTemplate) {
            const data = twbvBuildMeasuredTemplateData(state.selectedArea, {
              actor,
              power,
              summary,
              x: previewTemplate.document?.x ?? previewTemplate.x,
              y: previewTemplate.document?.y ?? previewTemplate.y,
              direction: previewTemplate.document?.direction ?? previewTemplate.direction ?? 0,
              pendingCast: false
            });
            previewTemplate.destroy({ children: true });
            previewTemplate = null;
            if (data) await canvas.scene?.createEmbeddedDocuments("MeasuredTemplate", [data]);
          }
          await twbvCreatePowerCastChat(actor, power, {
            baseCost,
            total,
            summary,
            remainingMana: currentMana - total,
            areaPreset: selectedAreaPreset.value,
            areaLabel: areaEntry?.areaLabel ?? selectedAreaPreset.label,
            areaSquares: twbvGetPowerAreaSquares(selectedAreaPreset.value, summary),
            damageFormula: twbvFormatPowerDamage(baseDamage, state.damageSteps),
            description: String(power.system?.description ?? power.system?.descricao ?? "").trim(),
            effectsSummary: String(power.system?.effectsSummary ?? "").trim()
          });
        }
      },
      cancel: { label: "Cancelar" }
    },
    default: "cast",
    close: async () => {
      if (!acceptedCast && previewTemplate) {
        try { previewTemplate.destroy({ children: true }); } catch (error) { console.warn("[TWBV] Falha ao remover preview tempor&aacute;rio da magia.", error); }
      }
    }
  }, { width: 760, height: "auto" }).render(true);
}

async function twbvCreatePowerCastChat(actor, power, cast) {
  const icon = power.img ? `<img src="${escapeHtmlAttr(power.img)}" alt="${escapeHtmlAttr(power.name)}" />` : `<i class="fas fa-wand-magic-sparkles"></i>`;
  const skillName = String(power.system?.skill ?? power.system?.pericia ?? "").trim();
  const damageFormula = String(cast.damageFormula ?? power.system?.damage ?? power.system?.dano ?? "").trim();
  const damageType = String(power.system?.damageType ?? "").trim();
  const description = String(cast.description ?? "").trim();
  const effectsSummary = String(cast.effectsSummary ?? "").trim();
  const fullDescription = [description, effectsSummary].filter(Boolean).join("\n\n") || "Sem descri\u00e7\u00e3o registrada.";
  const details = cast.summary.length
    ? cast.summary.map((entry) => `<li><strong>${escapeHtml(entry.label)}</strong><span>${escapeHtml(entry.detail)} | ${entry.cost} Mana</span></li>`).join("")
    : `<li><strong>Sem moldes adicionais</strong><span>Apenas custo base.</span></li>`;
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `
      <section class="twbv-roll-chat twbv-power-chat twbv-power-cast-chat" data-power-uuid="${escapeHtmlAttr(power.uuid)}">
        <header class="twbv-power-chat__head">
          <div class="twbv-power-chat__icon">${icon}</div>
          <div>
            <span>Magia moldada</span>
            <h3>${escapeHtml(power.name)}</h3>
            <p>Mana base: ${cast.baseCost} &middot; Total gasto: ${cast.total} &middot; Mana restante: ${cast.remainingMana}${cast.areaLabel ? ` &middot; &Aacute;rea: ${escapeHtml(cast.areaLabel)}` : ""}</p>
          </div>
        </header>
        <div class="twbv-power-cast-grid">
          <article>
          <span>Per\u00edcia</span>
            <strong>${escapeHtml(skillName || "Nenhuma")}</strong>
            <button type="button" class="twbv-power-roll-button" data-power-uuid="${escapeHtmlAttr(power.uuid)}" data-skip-mana="true"><i class="fas fa-dice-d20"></i> Rolar</button>
          </article>
          <article>
            <span>Dano escolhido</span>
            <strong>${escapeHtml(damageFormula || "-")}</strong>
            ${damageType ? `<em>${escapeHtml(damageType)}</em>` : ""}
            ${damageFormula && damageFormula !== "-" ? `<button type="button" class="twbv-power-cast-damage-button" data-power-uuid="${escapeHtmlAttr(power.uuid)}"><i class="fas fa-bolt"></i> Rolar dano</button>` : ""}
          </article>
          <article>
            <span>&Aacute;rea</span>
            <strong>${escapeHtml(cast.areaLabel || "Nenhuma")}</strong>
            ${cast.areaPreset && cast.areaPreset !== "none" ? `<button type="button" class="twbv-power-cast-area-button" data-power-uuid="${escapeHtmlAttr(power.uuid)}"><i class="fas fa-ruler-combined"></i> Revelar &aacute;rea</button>` : ""}
            <small class="twbv-power-area-result"></small>
          </article>
        </div>
        <ul>${details}</ul>
        <details class="twbv-power-cast-description">
          <summary>Descri&ccedil;&atilde;o completa</summary>
          <div>${escapeHtml(fullDescription)}</div>
        </details>
        <div class="twbv-power-roll-result"></div>
        <div class="twbv-power-damage-result"></div>
      </section>`,
    type: CONST.CHAT_MESSAGE_TYPES.OTHER,
    flags: {
      "world-behind-the-veil": {
        powerCast: {
          powerUuid: power.uuid,
          actorUuid: actor.uuid,
          baseCost: cast.baseCost,
          total: cast.total,
          remainingMana: cast.remainingMana,
          areaPreset: cast.areaPreset,
          areaLabel: cast.areaLabel,
          areaSquares: cast.areaSquares,
          damageFormula,
          skillName,
          damageType,
          description,
          effectsSummary,
          summary: cast.summary
        }
      }
    }
  });
}

async function twbvCreatePowerChatCard(actor, power) {
  if (!actor || !power) return;
  const skillName = String(power.system?.skill ?? power.system?.pericia ?? "").trim();
  const requirements = String(power.system?.requirements ?? power.system?.requisitos ?? power.system?.tier ?? "").trim();
  const source = String(power.system?.source ?? power.system?.fonte ?? "").trim();
  const manaCost = Math.max(0, twbvNumberOrZero(power.system?.manaCost ?? power.system?.mana ?? power.system?.costMana));
  const damage = String(power.system?.damage ?? power.system?.dano ?? "").trim();
  const damageType = String(power.system?.damageType ?? "").trim();
  const area = twbvNormalizePowerAreaValue(power.system?.areaEffect ?? power.system?.area);
  const areaLabel = twbvGetPowerAreaLabel(area);
  const description = String(power.system?.description ?? power.system?.descricao ?? "").trim();
  const effect = String(power.system?.effectsSummary ?? "").trim() || description || "Sem efeito descrito.";
  const icon = power.img ? `<img src="${escapeHtmlAttr(power.img)}" alt="${escapeHtmlAttr(power.name)}" />` : `<i class="fas fa-wand-magic-sparkles"></i>`;
  const meta = [
    skillName ? `Per&iacute;cia: ${escapeHtml(skillName)}` : "",
    manaCost ? `Mana: ${manaCost}` : "Mana: 0",
    damage ? `Dano: ${escapeHtml(damage)}` : "",
    damageType ? `Tipo de dano: ${escapeHtml(damageType)}` : "",
    areaLabel ? `\u00c1rea: ${escapeHtml(areaLabel)}` : "",
    requirements ? `Requisito/Tier: ${escapeHtml(requirements)}` : "",
    source ? `Fonte: ${escapeHtml(source)}` : ""
  ].filter(Boolean).join(" &middot; ");
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `
      <section class="twbv-roll-chat twbv-power-chat" data-power-uuid="${escapeHtmlAttr(power.uuid)}">
        <header class="twbv-power-chat__head">
          <div class="twbv-power-chat__icon">${icon}</div>
          <div>
            <span>Poder</span>
            <h3>${escapeHtml(power.name)}</h3>
            ${meta ? `<p>${meta}</p>` : ""}
          </div>
        </header>
        <div class="twbv-power-chat__actions">
          <button type="button" class="twbv-power-effect-toggle"><i class="fas fa-eye"></i> Efeito</button>
          <button type="button" class="twbv-power-cast-button" data-power-uuid="${escapeHtmlAttr(power.uuid)}"><i class="fas fa-wand-magic-sparkles"></i> Moldar</button>
          <button type="button" class="twbv-power-roll-button" data-power-uuid="${escapeHtmlAttr(power.uuid)}"><i class="fas fa-dice-d20"></i> Rolar Per\u00edcia</button>
          ${damage ? `<button type="button" class="twbv-power-damage-button" data-power-uuid="${escapeHtmlAttr(power.uuid)}"><i class="fas fa-bolt"></i> Dano</button>` : ""}
        </div>
        <div class="twbv-power-chat__effect" hidden>${escapeHtml(effect)}</div>
        <div class="twbv-power-roll-result"></div>
      </section>`,
    type: CONST.CHAT_MESSAGE_TYPES.OTHER
  });
}

function twbvGetSlotDefinition(slotKey) {
  return TWBV_EQUIPMENT_SLOT_DEFS.find((slot) => slot.key === slotKey) ?? null;
}

function twbvCanSlotAcceptItem(slotDef, itemType) {
  return Boolean(slotDef?.accepts?.includes?.(String(itemType ?? "")));
}

function twbvMergeItemCreationFormData(type, formData = {}) {
  const resolved = twbvResolveSupportedItemType(type);
  const system = twbvGetDefaultItemSystem(resolved);
  const category = String(formData.category ?? "").trim();
  if (category) system.category = category;

  if (resolved === "armadura") {
    const equipSlot = String(formData.armorSlot ?? "").trim();
    if (equipSlot) {
      system.equipSlot = equipSlot;
      system.category = category || `armadura:${equipSlot}`;
    }
    system.protection = String(formData.protection ?? system.protection ?? "").trim();
    system.penalty = String(formData.penalty ?? system.penalty ?? "").trim();
  }

  if (["arma", "weapon"].includes(resolved)) {
    const equipSlot = String(formData.weaponSlot ?? "").trim();
    if (equipSlot) {
      system.equipSlot = equipSlot;
      system.category = category || equipSlot;
    }
    system.damage = String(formData.damage ?? system.damage ?? "").trim();
    system.range = String(formData.range ?? system.range ?? "").trim();
  }

  if (resolved === "consumable") {
    system.subtype = String(formData.subtype ?? system.subtype ?? "regular").trim() || "regular";
  }

  if (resolved === "municao") {
    system.category = "municao";
    system.reloadType = String(formData.reloadType ?? system.reloadType ?? "box").trim() || "box";
    system.ammoType = system.reloadType;
    system.shots = Number(formData.shots ?? system.shots ?? 0) || 0;
    system.currentShots = Number(formData.currentShots ?? system.currentShots ?? system.shots ?? 0) || 0;
  }

  if (resolved === "modificacao") {
    system.category = category || "modificacao";
  }

  return system;
}

async function twbvCreateActorItem(actor, requestedType, system = {}) {
  const requested = String(requestedType ?? "equipamento").trim() || "equipamento";
  const type = twbvResolveSupportedItemType(requested);
  const displayType = requested === "poder" ? "poder" : type;
  const nextSystem = foundry.utils.deepClone(system ?? {});
  if (requested === "poder" && type !== "poder") {
    nextSystem.itemKind = "poder";
    nextSystem.category = nextSystem.category || "poder";
    nextSystem.categoria = nextSystem.categoria || "poder";
    nextSystem.manaCost = Number.isFinite(Number(nextSystem.manaCost)) ? Number(nextSystem.manaCost) : 0;
    nextSystem.damage = String(nextSystem.damage ?? "");
    nextSystem.areaEffect = twbvNormalizePowerAreaValue(nextSystem.areaEffect ?? "none");
  }
  const isWeapon = ["arma", "weapon"].includes(type);
  const isConsumable = type === "consumable";
  const isAmmo = type === "municao";
  const name = isWeapon ? "Nova Arma" : isConsumable ? "Novo Consumível" : isAmmo ? "Nova Munição" : `${TWBV_ITEM_TYPES[displayType] ?? "Item"} ${actor?.items?.size + 1}`;
  console.log("[TWBV] Clique criar item na ficha.", {
    actor: actor?.name,
    requestedType,
    resolvedType: type,
    supportedTypes: Array.from(game?.system?.documentTypes?.Item ?? [])
  });
  return actor.createEmbeddedDocuments("Item", [{ name, type, img: twbvGetItemIcon(displayType), system: nextSystem }]);
}

function twbvIsTraitItemType(type) {
  return ["vantagem", "desvantagem", "habilidadeEspecial", "poder", "pericia"].includes(String(type ?? ""));
}

function twbvBuildTraitItemData(type, source = {}) {
  const requested = String(type ?? "").trim();
  const resolved = twbvResolveSupportedItemType(type);
  const displayType = requested === "poder" ? "poder" : resolved;
  const system = twbvGetDefaultItemSystem(resolved);
  const sourceSystem = source?.system ?? {};
  const name = String(source?.name ?? source?.nome ?? twbvGetItemDefaultName(displayType, system)).trim() || twbvGetItemDefaultName(displayType, system);
  const mergedSystem = foundry.utils.mergeObject(system, {
    source: source?.fonte ?? source?.source ?? sourceSystem.fonte ?? sourceSystem.source ?? system.source,
    fonte: source?.fonte ?? source?.source ?? sourceSystem.fonte ?? sourceSystem.source ?? system.fonte,
    category: source?.categoria ?? source?.category ?? sourceSystem.categoria ?? sourceSystem.category ?? system.category,
    categoria: source?.categoria ?? source?.category ?? sourceSystem.categoria ?? sourceSystem.category ?? system.categoria,
    requirements: source?.requisitos ?? source?.requirements ?? source?.tier ?? sourceSystem.requisitos ?? sourceSystem.requirements ?? sourceSystem.tier ?? system.requirements,
    requisitos: source?.requisitos ?? source?.requirements ?? source?.tier ?? sourceSystem.requisitos ?? sourceSystem.requirements ?? sourceSystem.tier ?? system.requisitos,
    skill: source?.skill ?? source?.pericia ?? sourceSystem.skill ?? sourceSystem.pericia ?? system.skill,
    description: source?.descricao ?? source?.description ?? sourceSystem.descricao ?? sourceSystem.description ?? system.description,
    descricao: source?.descricao ?? source?.description ?? sourceSystem.descricao ?? sourceSystem.description ?? system.descricao,
    effectsSummary: source?.effectsSummary ?? sourceSystem.effectsSummary ?? system.effectsSummary,
    severity: source?.severity ?? sourceSystem.severity ?? system.severity,
    favorite: Boolean(source?.favorite ?? sourceSystem.favorite ?? system.favorite),
    isArcaneBackground: Boolean(source?.isArcaneBackground ?? sourceSystem.isArcaneBackground ?? system.isArcaneBackground),
    hasCharges: Boolean(source?.hasCharges ?? sourceSystem.hasCharges ?? system.hasCharges),
    charges: source?.cargas ?? source?.charges ?? sourceSystem.cargas ?? sourceSystem.charges ?? system.charges,
    activeEffects: Array.isArray(source?.activeEffects) ? source.activeEffects : (Array.isArray(sourceSystem.activeEffects) ? sourceSystem.activeEffects : system.activeEffects)
  }, { inplace: false });
  if (requested === "poder" && resolved !== "poder") {
    mergedSystem.itemKind = "poder";
    mergedSystem.category = mergedSystem.category || "poder";
    mergedSystem.categoria = mergedSystem.categoria || "poder";
    mergedSystem.manaCost = Number.isFinite(Number(mergedSystem.manaCost)) ? Number(mergedSystem.manaCost) : 0;
    mergedSystem.damage = String(mergedSystem.damage ?? "");
    mergedSystem.areaEffect = twbvNormalizePowerAreaValue(mergedSystem.areaEffect ?? "none");
  }
  return { name, type: resolved, img: source?.img ?? source?.icon ?? sourceSystem.icon ?? twbvGetItemIcon(displayType), system: mergedSystem };
}

async function twbvCreateAndOpenActorTraitItem(actor, type, source = null) {
  if (!actor) return null;
  const data = twbvBuildTraitItemData(type, source ?? {});
  const created = await actor.createEmbeddedDocuments("Item", [data]);
  const item = created?.[0] ?? null;
  item?.sheet?.render(true);
  return item;
}

function twbvGetDefaultItemSystem(type) {
  const resolved = twbvResolveSupportedItemType(type);
  if (["arma", "weapon"].includes(resolved)) {
    return {
      active: true,
      description: "",
      effectsSummary: "",
      quantity: 1,
      weight: 0,
      cost: 0,
      equipped: false,
      tags: "",
      damage: "",
      damageRaise: "1d6",
      range: "",
      bonus: "",
      notes: "",
      source: "",
      swid: "arma",
      equippable: true,
      equipStatus: 1,
      favorite: false,
      category: "",
      skill: "",
      rangeType: 1,
      rof: 1,
      ap: 0,
      parry: 0,
      minStr: "",
      shots: 0,
      currentShots: 0,
      ammo: "",
      ammoSourceUuid: "",
      ammoSourceName: "",
      reloadType: "magazine",
      isHeavyWeapon: false,
      mods: 0,
      equipSlot: "",
      handMode: "main",
      equippedHand: "main",
      actions: { trait: "Atirar", traitMod: "", dmgMod: "", additional: {} },
      bonusDamageDie: 6,
      bonusDamageDice: 1,
      templatesData: { cone: false, stream: false, small: false, medium: false, large: false, scone: false }
    };
  }
  if (resolved === "consumable") {
    return {
      active: true,
      description: "",
      effectsSummary: "",
      quantity: 1,
      weight: 0,
      cost: 0,
      equipped: false,
      tags: "",
      notes: "",
      source: "",
      swid: "consumivel",
      equippable: false,
      equipStatus: 1,
      favorite: false,
      category: "",
      subtype: "regular",
      charges: { hasCharges: false, charges: { main: { id: "main", value: 1, max: 1, sort: 0, name: "Cargas", rechargeType: "finite" } } },
      messageOnUse: true,
      destroyOnEmpty: false
    };
  }
  if (resolved === "armadura") {
    return {
      active: true,
      description: "",
      effectsSummary: "",
      quantity: 1,
      weight: 0,
      cost: 0,
      equipped: false,
      tags: "",
      protection: "",
      penalty: "",
      equipSlot: "",
      notes: "",
      source: "",
      swid: "armadura",
      equippable: true,
      equipStatus: 0,
      favorite: false,
      category: "",
      actions: { additional: {} }
    };
  }
  if (resolved === "modificacao") {
    return {
      active: true,
      description: "",
      effectsSummary: "",
      quantity: 1,
      weight: 0,
      cost: 0,
      equipped: false,
      tags: "",
      category: "modificacao",
      modType: "mod",
      modifier: "",
      ap: 0,
      damage: "",
      damageRaise: "1d6",
      range: "",
      rof: 0,
      shots: 0,
      currentShots: 0,
      reloadType: "magazine"
    };
  }
  if (resolved === "municao") {
    return {
      active: true,
      description: "",
      effectsSummary: "",
      quantity: 1,
      weight: 0,
      cost: 0,
      equipped: false,
      tags: "",
      category: "municao",
      ammoType: "box",
      reloadType: "box",
      shots: 0,
      currentShots: 0,
      caliber: "",
      compatibleWeapon: "",
      ap: 0
    };
  }
  if (resolved === "equipamento") {
    return {
      active: true,
      description: "",
      effectsSummary: "",
      quantity: 1,
      weight: 0,
      cost: 0,
      equipped: false,
      tags: "",
      category: ""
    };
  }
  if (resolved === "pericia") {
    return {
      active: true,
      description: "",
      effectsSummary: "",
      atributo: "forca",
      dado: 4,
      bonus: 0,
      descricao: "",
      source: "",
      favorite: false
    };
  }
  if (["vantagem", "desvantagem", "habilidadeEspecial", "poder"].includes(resolved)) {
    return {
      active: true,
      description: "",
      effectsSummary: "",
      skill: "",
      manaCost: 0,
      damage: "",
      areaEffect: "none",
      quantity: 1,
      weight: 0,
      cost: 0,
      equipped: false,
      tags: "",
      source: "",
      fonte: "",
      category: "",
      categoria: "",
      requirements: "",
      requisitos: "",
      severity: "",
      favorite: false,
      isArcaneBackground: false,
      hasCharges: false,
      charges: "",
      activeEffects: []
    };
  }
  return {};
}

async function twbvOpenWorldItemCreateDialog({ folder = null } = {}) {
  const typeOptions = TWBV_ITEM_CREATE_ORDER
    .map((type) => `<option value="${type}">${TWBV_ITEM_TYPES[type] ?? type}</option>`)
    .join("");
  const folderInput = folder ? `<input type="hidden" name="folder" value="${folder.id}" />` : "";
  const content = `
    <form class="twbv-create-item-dialog">
      <label>Nome do item<input type="text" name="name" value="" placeholder="Autom?tico pelo tipo" autofocus /></label>
      <label>Tipo do item<select name="type" autofocus>${typeOptions}</select></label>
      ${folderInput}
    </form>`;

  return new Dialog({
    title: "Criar Item",
    content,
    classes: ["wbtv-add-skill-dialog", "wbtv-create-item-dialog"],
    render: (dialog, html) => {
      applyDialogWindowClass(html ?? dialog, "wbtv-add-skill-dialog");
      applyDialogWindowClass(html ?? dialog, "wbtv-create-item-dialog");
    },
    buttons: {
      create: {
        label: "Criar",
        callback: async (html) => {
          const root = resolveDialogRoot(html);
          const requestedType = String(root?.querySelector('[name="type"]')?.value ?? "arma");
          const type = twbvResolveSupportedItemType(requestedType);
          const system = twbvGetDefaultItemSystem(type);
          const typedName = String(root?.querySelector('[name="name"]')?.value ?? "").trim();
          const name = typedName || twbvGetItemDefaultName(type, system);
          const folderId = String(root?.querySelector('[name="folder"]')?.value ?? "").trim();
          const data = { name, type, img: twbvGetItemIcon(type), system };
          if (folderId) data.folder = folderId;
          console.log("[TWBV] Criando item pela sidebar.", { requestedType, resolvedType: type, name, folderId });
          await Item.create(data);
        }
      },
      cancel: { label: "Cancelar" }
    },
    default: "create"
  }).render(true);
}

function twbvInstallItemDirectoryCreateInterceptor() {
  if (globalThis._twbvItemDirectoryCreateInterceptor) return;
  document.addEventListener("click", (event) => {
    const button = event.target?.closest?.("button, a");
    if (!button) return;
    const inItemsTab = Boolean(button.closest?.("#items, [data-tab='items'], .directory.items"));
    if (!inItemsTab) return;
    const label = `${button.textContent ?? ""} ${button.title ?? ""} ${button.getAttribute?.("aria-label") ?? ""}`.trim();
    const isCreateItem = /criar\s+item|create\s+item/i.test(label);
    const isCreateFolder = /criar\s+pasta|create\s+folder/i.test(label);
    if (!isCreateItem || isCreateFolder) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();

    const folderId = button.closest?.("[data-folder-id], [data-document-id]")?.dataset?.folderId
      ?? button.closest?.("[data-folder-id], [data-document-id]")?.dataset?.documentId
      ?? "";
    const folder = folderId ? game.folders?.get(folderId) : null;
    console.log("[TWBV] Interceptando cria??o de Item da sidebar.", { label, folder: folder?.name ?? null });
    twbvOpenWorldItemCreateDialog({ folder });
  }, true);
  globalThis._twbvItemDirectoryCreateInterceptor = true;
}

function twbvGetItemSheetFromElement(element) {
  const appElement = element?.closest?.(".window-app, .app");
  const appId = appElement?.dataset?.appid ?? appElement?.id?.replace?.(/^app-/, "");
  const app = appId ? ui?.windows?.[appId] : null;
  if (app?.item instanceof Item) return app;
  if (app?.document instanceof Item) return app;
  if (app?.object instanceof Item) return app;
  return null;
}

function twbvGetItemFromSheetApp(app) {
  return app?.item ?? app?.document ?? app?.object ?? null;
}

function twbvReadInputValue(input) {
  if (!input) return undefined;
  if (input.type === "checkbox") return Boolean(input.checked);
  if (input.type === "radio") return input.checked ? input.value : undefined;
  if (input.type === "number") {
    const raw = String(input.value ?? "").trim();
    if (!raw) return null;
    const numeric = Number(raw);
    return Number.isFinite(numeric) ? numeric : raw;
  }
  return input.value;
}

function twbvInstallGlobalItemFieldPersistence() {
  if (globalThis._twbvGlobalItemFieldPersistence) return;
  const handler = (event) => {
    if (event.type === "input") return;
    const input = event.target?.closest?.("input[name], textarea[name], select[name]");
    if (!input) return;
    const path = String(input.name ?? "").trim();
    if (!path || (!path.startsWith("system.") && path !== "name" && path !== "img")) return;
    const app = twbvGetItemSheetFromElement(input);
    const item = twbvGetItemFromSheetApp(app);
    if (!item) return;
    const value = twbvReadInputValue(input);
    if (value === undefined) return;

    const lastKey = `${path}::${JSON.stringify(value)}`;
    if (input._twbvLastPersistedValue === lastKey) return;
    input._twbvLastPersistedValue = lastKey;

    clearTimeout(input._twbvGlobalPersistTimer);
    input._twbvGlobalPersistTimer = setTimeout(async () => {
      try {
        console.log("[TWBV] Persistindo campo global de item.", { item: item.name, path, value });
        await item.update({ [path]: value });
      } catch (error) {
        console.error("[TWBV] Falha ao persistir campo global de item.", { item: item.name, path, value, error });
        ui.notifications?.error(`Falha ao salvar ${path}. Veja o console.`);
      }
    }, 80);
  };
  document.addEventListener("change", handler, true);
  document.addEventListener("blur", handler, true);
  globalThis._twbvGlobalItemFieldPersistence = true;
}

async function twbvSaveItemFieldsFromRoot(item, root) {
  if (!item || !root) return;
  const update = {};
  for (const input of root.querySelectorAll("input[name], textarea[name], select[name]")) {
    const path = String(input.name ?? "").trim();
    if (!path || (!path.startsWith("system.") && path !== "name" && path !== "img")) continue;
    if (input.type === "radio" && !input.checked) continue;
    const value = twbvReadInputValue(input);
    if (value === undefined) continue;
    update[path] = value;
  }
  if (Object.keys(update).some((key) => key.startsWith("system.spellEffects."))) {
    const expanded = foundry.utils.expandObject(update);
    update["system.spellEffects"] = twbvNormalizePowerEffects(expanded.system?.spellEffects);
    for (const key of Object.keys(update)) {
      if (key.startsWith("system.spellEffects.")) delete update[key];
    }
  }
  if (Object.prototype.hasOwnProperty.call(update, "system.areaEffect")) {
    update["system.areaEffect"] = twbvNormalizePowerAreaValue(update["system.areaEffect"]);
  }
  const presetPanel = root.querySelector?.(".twbv-power-sheet-preset");
  if (presetPanel && twbvIsPowerItemDocument(item)) {
    const rawAreaValue = String(presetPanel.querySelector("[data-sheet-area-value]")?.value ?? "none").trim() || "none";
    const resolvedAreaValue = rawAreaValue === "none" ? String(presetPanel.dataset.baseArea ?? "none") : rawAreaValue;
    const baseAreaMeta = twbvGetPowerAreaPreset(presetPanel.dataset.baseArea ?? "none");
    const selectedMeta = twbvGetPowerAreaPreset(resolvedAreaValue);
    const touchToTarget = baseAreaMeta.shape === "touch" && selectedMeta.shape === "target";
    update["system.castPreset.damageSteps"] = Math.max(0, Number(presetPanel.querySelector('input[name="twbvPreset.damageSteps"]')?.value ?? 0));
    update["system.castPreset.targetSteps"] = touchToTarget ? 0 : Math.max(0, Number(presetPanel.querySelector('input[name="twbvPreset.targetSteps"]')?.value ?? 0));
    update["system.castPreset.areaPreset"] = rawAreaValue;
    update["system.castPreset.areaSize"] = twbvClampPowerAreaSize(resolvedAreaValue, presetPanel.querySelector('input[name="twbvPreset.areaSize"]')?.value ?? 1);
  }
  console.log("[TWBV] Salvamento manual de item.", { item: item.name, update });
  if (Object.keys(update).length) await item.update(update);
}

const ATTRIBUTE_DICE = [4, 6, 8, 10, 12];
const SKILL_DICE = [4, 6, 8, 10, 12];
const SKILL_LEVELS = [
  { dado: 4, bonus: 0, rank: "NOVATO", cssClass: "rank-novato" },
  { dado: 4, bonus: 1, rank: "NOVATO", cssClass: "rank-novato" },
  { dado: 6, bonus: 1, rank: "TREINADO", cssClass: "rank-treinado" },
  { dado: 6, bonus: 2, rank: "TREINADO", cssClass: "rank-treinado" },
  { dado: 8, bonus: 2, rank: "EXPERIENTE", cssClass: "rank-experiente" },
  { dado: 8, bonus: 3, rank: "EXPERIENTE", cssClass: "rank-experiente" },
  { dado: 10, bonus: 3, rank: "ESPECIALISTA", cssClass: "rank-especialista" },
  { dado: 10, bonus: 4, rank: "ESPECIALISTA", cssClass: "rank-especialista" },
  { dado: 12, bonus: 4, rank: "MESTRE", cssClass: "rank-mestre" },
  { dado: 12, bonus: 5, rank: "MESTRE", cssClass: "rank-mestre" }
];
const SKILL_ATTRIBUTES = [
  { key: "forca", label: "For\u00e7a", iconPath: "icons/svg/d20-black.svg" },
  { key: "destreza", label: "Destreza", iconPath: "icons/svg/d20-black.svg" },
  { key: "constituicao", label: "Constitui\u00e7\u00e3o", iconPath: "icons/svg/d20-black.svg" },
  { key: "inteligencia", label: "Intelig\u00eancia", iconPath: "icons/svg/d20-black.svg" },
  { key: "intuicao", label: "Intui\u00e7\u00e3o", iconPath: "icons/svg/d20-black.svg" },
  { key: "influencia", label: "Influ\u00eancia", iconPath: "icons/svg/d20-black.svg" }
];

const TWBV_DEFAULT_SKILL_ICON = "icons/svg/book.svg";
const TWBV_SKILL_ICON_BY_NAME = {
  arcanismo: "systems/world-behind-the-veil/assets/skills/arcanismo/arcanismo-icon-1.png",
  arremessar: "systems/world-behind-the-veil/assets/skills/arremessar/arremessar-icon-1.png",
  atletismo: "systems/world-behind-the-veil/assets/skills/atletismo/atletismo-style-3.png",
  botanica: "systems/world-behind-the-veil/assets/skills/botanica/botanica-icon-1.png",
  ciencias: "systems/world-behind-the-veil/assets/skills/ciencias/ciencias-icon-1.png",
  "conhecimento academico": "systems/world-behind-the-veil/assets/skills/conhecimento-academico/conhecimento-academico-icon-1.png",
  "conhecimento comum": "systems/world-behind-the-veil/assets/skills/conhecimento-comum/conhecimento-comum-icon-1.png",
  "conhecimento criminal": "systems/world-behind-the-veil/assets/skills/conhecimento-criminal/conhecimento-criminal-icon-1.png",
  "conhecimento de batalha": "systems/world-behind-the-veil/assets/skills/conhecimento-de-batalha/conhecimento-de-batalha-icon-1.png",
  coragem: "systems/world-behind-the-veil/assets/skills/coragem/coragem-icon-1.png",
  dirigir: "systems/world-behind-the-veil/assets/skills/dirigir/dirigir-icon-1.png",
  eletronica: "systems/world-behind-the-veil/assets/skills/eletronica/eletronica-icon-1.png",
  fe: "systems/world-behind-the-veil/assets/skills/fe/fe-icon-1.png",
  intimidacao: "systems/world-behind-the-veil/assets/skills/intimidacao/intimidacao-icon-1.png",
  investigacao: "systems/world-behind-the-veil/assets/skills/investigacao/investigacao-icon-1.png",
  jutsu: "systems/world-behind-the-veil/assets/skills/jutsu/jutsu-icon-1.png",
  labia: "systems/world-behind-the-veil/assets/skills/labia/labia-icon-1.png",
  ladinagem: "systems/world-behind-the-veil/assets/skills/ladinagem/ladinagem-icon-1.png",
  lutar: "systems/world-behind-the-veil/assets/skills/lutar/lutar-icon-1.png",
  mecanica: "systems/world-behind-the-veil/assets/skills/mecanica/mecanica-icon-1.png",
  medicina: "systems/world-behind-the-veil/assets/skills/medicina/medicina-icon-1.png",
  navegar: "systems/world-behind-the-veil/assets/skills/navegar/navegar-icon-1.png",
  ocultismo: "systems/world-behind-the-veil/assets/skills/ocultismo/ocultismo-icon-1.png",
  percepcao: "systems/world-behind-the-veil/assets/skills/percepcao/percepcao-icon-1.png",
  performance: "systems/world-behind-the-veil/assets/skills/performance/performance-icon-1.png",
  pilotar: "systems/world-behind-the-veil/assets/skills/pilotar/pilotar-icon-1.png",
  "poder inato": "systems/world-behind-the-veil/assets/skills/poder-inato/poder-inato-icon-1.png",
  psionico: "systems/world-behind-the-veil/assets/skills/psionico/psionico-icon-1.png",
  sobrevivencia: "systems/world-behind-the-veil/assets/skills/sobrevivencia/sobrevivencia-icon-1.png",
  tecnologia: "systems/world-behind-the-veil/assets/skills/tecnologia/tecnologia-icon-1.png"
};

function twbvNormalizeSkillNameKey(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function twbvGetSkillIconPath(skill = {}) {
  const rawIcon = String(skill.img ?? skill.icone ?? skill.icon ?? "").trim();
  if (rawIcon && rawIcon !== "icons/svg/d20-black.svg") return rawIcon;
  return TWBV_SKILL_ICON_BY_NAME[twbvNormalizeSkillNameKey(skill.nome ?? skill.name)] ?? TWBV_DEFAULT_SKILL_ICON;
}

function twbvRollChatHeaderHtml({ title = "", subtitle = "", subtitleClass = "", icon = "" } = {}) {
  const safeTitle = escapeHtml(title);
  const safeIcon = String(icon ?? "").trim();
  const subtitleHtml = subtitle ? `<p class="${escapeHtmlAttr(subtitleClass)}">${subtitle}</p>` : "";
  if (!safeIcon) {
    return `<header class="twbv-roll-chat__header"><h3>${safeTitle}</h3>${subtitleHtml}</header>`;
  }
  return `<header class="twbv-roll-chat__header twbv-roll-chat__header--with-icon">
    <img class="twbv-roll-chat__skill-icon" src="${escapeHtmlAttr(safeIcon)}" alt="${safeTitle}" />
    <div class="twbv-roll-chat__title-block">
      <h3>${safeTitle}</h3>
      ${subtitleHtml}
    </div>
  </header>`;
}

function twbvFlattenAuditChanges(value, prefix = "") {
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => twbvFlattenAuditChanges(entry, prefix ? `${prefix}.${index}` : String(index)));
  }
  if (value && typeof value === "object") {
    const entries = [];
    for (const [key, entry] of Object.entries(value)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (entry && typeof entry === "object") entries.push(...twbvFlattenAuditChanges(entry, path));
      else entries.push([path, entry]);
    }
    return entries;
  }
  return prefix ? [[prefix, value]] : [];
}

function twbvIsAuditableSheetPath(path) {
  return path === "name" || path === "img" || String(path ?? "").startsWith("system.");
}

function twbvAuditValuesEqual(previous, next) {
  if (previous === next) return true;
  return JSON.stringify(previous ?? null) === JSON.stringify(next ?? null);
}

function twbvAuditAttributeLabel(key) {
  return SKILL_ATTRIBUTES.find((entry) => entry.key === key)?.label ?? key;
}

function twbvAuditSkillName(actor, index, fallback = "") {
  const skill = actor?.system?.pericias?.[Number(index)] ?? null;
  return String(skill?.nome ?? fallback ?? `Perícia ${Number(index) + 1}`).trim();
}

function twbvAuditFieldLabel(document, path, previous, next) {
  const parts = String(path ?? "").split(".");
  if (path === "name") return "Nome";
  if (path === "img") return "Imagem";
  if (parts[0] !== "system") return path;
  if (parts[1] === "atributos" && parts[2]) {
    const attr = twbvAuditAttributeLabel(parts[2]);
    if (parts[3] === "passo") return `${attr} - Dado`;
    if (parts[3] === "bonus") return `${attr} - Bônus`;
    return `${attr} - ${parts.slice(3).join(".")}`;
  }
  if (parts[1] === "pericias" && Number.isInteger(Number(parts[2]))) {
    const index = Number(parts[2]);
    const previousName = previous && typeof previous === "object" ? previous.nome : "";
    const nextName = next && typeof next === "object" ? next.nome : "";
    const skillName = twbvAuditSkillName(document, index, nextName || previousName);
    const field = parts[3] ?? "";
    if (field === "dado") return `Perícia ${skillName} - Dado`;
    if (field === "bonus") return `Perícia ${skillName} - Bônus`;
    if (field === "atributo") return `Perícia ${skillName} - Atributo`;
    if (field === "nome") return `Perícia ${index + 1} - Nome`;
    if (field === "locked") return `Perícia ${skillName} - Travada`;
    return `Perícia ${skillName} - ${field || "Dados"}`;
  }
  const labels = {
    "system.eco": "Eco",
    "system.ferimentos": "Ferimentos",
    "system.fadiga": "Fadiga",
    "system.damage": "Dano",
    "system.damageRaise": "Ampliação",
    "system.range": "Alcance",
    "system.ap": "PA",
    "system.currentShots": "Munição atual",
    "system.shots": "Capacidade",
    "system.ammo": "Munição",
    "system.skill": "Perícia",
    "system.equipped": "Equipado",
    "system.handMode": "Empunhadura"
  };
  return labels[path] ?? String(path).replace(/^system\./, "");
}

function twbvAuditFormatValue(path, value) {
  if (value === undefined || value === null || value === "") return "vazio";
  if (typeof value === "boolean") return value ? "sim" : "n\u00e3o";
  if (/\.passo$|\.dado$/.test(String(path)) && Number.isFinite(Number(value))) return `d${Number(value)}`;
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function twbvCollectAuditEntries(document, changed = {}) {
  return twbvFlattenAuditChanges(changed)
    .filter(([path]) => twbvIsAuditableSheetPath(path))
    .map(([path, next]) => {
      const previous = foundry.utils.getProperty(document, path);
      if (twbvAuditValuesEqual(previous, next)) return null;
      return {
        path,
        label: twbvAuditFieldLabel(document, path, previous, next),
        previous: twbvAuditFormatValue(path, previous),
        next: twbvAuditFormatValue(path, next)
      };
    })
    .filter(Boolean);
}

async function twbvSendSheetAuditMessage(document, entries = [], userId = game.user?.id) {
  const user = game.users?.get(userId) ?? game.user;
  if (!entries.length || userId !== game.user?.id || user?.isGM) return;
  const actor = document instanceof Actor ? document : document?.parent instanceof Actor ? document.parent : null;
  const sheetName = actor?.name ?? document?.name ?? "Ficha";
  const itemText = document instanceof Item ? `/${document.name}` : "";
  const main = entries[0];
  const extra = entries.length > 1 ? ` +${entries.length - 1}` : "";
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `
      <section class="twbv-sheet-audit">
        <span class="twbv-sheet-audit__tag">Ficha</span>
        <span>${escapeHtml(user?.name ?? "Usu?rio")} mexeu em ${escapeHtml(sheetName)}${escapeHtml(itemText)}:</span>
        <strong>${escapeHtml(main.label)}</strong>
        <span>${escapeHtml(main.previous)} &rarr; ${escapeHtml(main.next)}${extra}</span>
      </section>`,
    type: CONST.CHAT_MESSAGE_TYPES.OTHER
  });
}

function getSkillHalfForDefense(actorSystem, skillName) {
  const target = String(skillName ?? "").trim().toUpperCase();
  const skills = Array.from(actorSystem?.pericias ?? []);
  const skill = skills.find((entry) => String(entry?.nome ?? "").trim().toUpperCase() === target);
  if (!skill) return 0;
  const die = SKILL_DICE.includes(Number(skill?.dado)) ? Number(skill.dado) : 4;
  const bonus = Number.isFinite(Number(skill?.bonus)) ? Number(skill.bonus) : 0;
  return Math.floor((die + bonus) / 2);
}

function getConstituicaoHalfForResistencia(actorSystem) {
  const attr = actorSystem?.atributos?.constituicao ?? {};
  const die = normalizeAttributeStep(attr?.passo ?? 4);
  const bonus = Number.isFinite(Number(attr?.bonus)) ? Number(attr.bonus) : 0;
  return Math.floor((die + bonus) / 2);
}


function getInfluenciaHalfForResistenciaMagica(actorSystem) {
  const attr = actorSystem?.atributos?.influencia ?? {};
  const die = normalizeAttributeStep(attr?.passo ?? 4);
  const bonus = Number.isFinite(Number(attr?.bonus)) ? Number(attr.bonus) : 0;
  return Math.floor((die + bonus) / 2);
}

function getSkillRank(dado, bonus = 0) {
  const die = SKILL_DICE.includes(Number(dado)) ? Number(dado) : 4;
  const mod = Number.isFinite(Number(bonus)) ? Number(bonus) : 0;
  const exact = SKILL_LEVELS.find((level) => level.dado === die && level.bonus === mod);
  if (exact) return { label: exact.rank, cssClass: exact.cssClass };

  const fallbackByDie = SKILL_LEVELS.filter((level) => level.dado === die).at(-1) ?? SKILL_LEVELS[0];
  return { label: fallbackByDie.rank, cssClass: fallbackByDie.cssClass };
}

function getSkillAttributeMeta(attributeKey) {
  const fallback = SKILL_ATTRIBUTES[0];
  return SKILL_ATTRIBUTES.find((attr) => attr.key === attributeKey) ?? fallback;
}

function findSkillByName(actorSystem, skillName) {
  const target = String(skillName ?? "").trim().toUpperCase();
  const skills = Array.from(actorSystem?.pericias ?? []);
  return skills.find((entry) => String(entry?.nome ?? "").trim().toUpperCase() === target) ?? null;
}

function buildDieLabel(die, bonus = 0) {
  return `d${die}${bonus > 0 ? `+${bonus}` : bonus < 0 ? `${bonus}` : ""}`;
}

function normalizeAttributeStep(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 4;
  if (ATTRIBUTE_DICE.includes(parsed)) return parsed;
  return ATTRIBUTE_DICE[Math.max(0, Math.min(parsed, ATTRIBUTE_DICE.length - 1))];
}



var getFerimentosRollPenalty = globalThis.getFerimentosRollPenalty || function getFerimentosRollPenalty(actorSystem) {
  const ferimentos = Math.max(0, Math.min(5, Number(actorSystem?.ferimentos ?? 0)));
  if (ferimentos <= 0) return { value: 0, label: "" };
  const applied = Math.min(ferimentos, 3);
  return { value: -applied, label: `Ferimento -${applied}` };
};

var getFadigaRollPenalty = globalThis.getFadigaRollPenalty || function getFadigaRollPenalty(actorSystem) {
  const fadiga = Math.max(0, Math.min(4, Number(actorSystem?.fadiga ?? 0)));
  if (fadiga <= 0) return { value: 0, label: "" };
  return { value: -fadiga, label: `Fadiga -${fadiga}` };
};

var getGlobalRollPenalty = globalThis.getGlobalRollPenalty || function getGlobalRollPenalty(actorSystem) {
  const ferimentos = getFerimentosRollPenalty(actorSystem);
  const fadiga = getFadigaRollPenalty(actorSystem);
  const value = ferimentos.value + fadiga.value;
  const label = [ferimentos.label, fadiga.label].filter(Boolean).join(" ? ");
  return { value, label };
};


function getConditionVisualStyle(ferimentos, fadiga) {
  const wound = Math.max(0, Math.min(5, Number(ferimentos ?? 0)));
  const fatigue = Math.max(0, Math.min(4, Number(fadiga ?? 0)));
  const woundColors = [
    [70, 190, 110],
    [168, 205, 72],
    [240, 204, 68],
    [238, 126, 58],
    [228, 58, 46],
    [210, 18, 28]
  ];
  const fatigueColors = [
    [70, 190, 110],
    [244, 200, 75],
    [255, 214, 102],
    [255, 210, 73],
    [255, 198, 54]
  ];
  const wc = woundColors[wound];
  const fc = fatigueColors[fatigue];
  const woundWeight = wound / 5;
  const fatigueWeight = fatigue / 4;
  const total = Math.max(0.0001, woundWeight + fatigueWeight);
  const mix = [0,1,2].map((i)=> Math.round((wc[i]*woundWeight + fc[i]*fatigueWeight)/total));
  const edge = `rgba(${mix[0]}, ${mix[1]}, ${mix[2]}, 0.95)`;
  const glow = `rgba(${mix[0]}, ${mix[1]}, ${mix[2]}, 0.62)`;
  const deep = `rgba(${Math.max(8,mix[0]-140)}, ${Math.max(8,mix[1]-140)}, ${Math.max(8,mix[2]-140)}, 0.95)`;
  const mid = `rgba(${Math.max(10,mix[0]-95)}, ${Math.max(10,mix[1]-95)}, ${Math.max(10,mix[2]-95)}, 0.98)`;
  return `--twbv-status-edge:${edge};--twbv-status-glow:${glow};--twbv-status-deep:${deep};--twbv-status-mid:${mid};`;
}
function resolveAwakenedDie(attributeDie) {
  const die = normalizeAttributeStep(attributeDie);
  if (die <= 6) return 4;
  if (die <= 10) return 6;
  return 8;
}


async function rollSingleDie(die) {
  return (new Roll(`1d${Number(die)}`)).evaluate();
}

async function showDice3dRoll(roll) {
  if (!game?.dice3d?.showForRoll) return;
  await game.dice3d.showForRoll(roll, game.user, true);
}

async function rollVeuExtrasFromFirst(die, firstValue) {
  const safeDie = Number(die);
  const rolls = [];
  let current = Number(firstValue ?? 0);
  while (current === safeDie) {
    const extraRoll = await rollSingleDie(safeDie);
    await showDice3dRoll(extraRoll);
    current = Number(extraRoll.total ?? 0);
    rolls.push(current);
  }
  return rolls;
}



function formatVeuChainText(die, rolls = []) {
  const safeDie = Number(die);
  const sequence = Array.isArray(rolls) ? rolls.map((value) => Number(value)) : [];
  if (!sequence.length) return `D${safeDie}(0)`;
  const [first, ...extras] = sequence;
  let text = `D${safeDie}(${first})`;
  for (const value of extras) text += `+V\u00c9U D${safeDie}(${value})`;
  return text;
}

function twbvFormatSignedLabel(value) {
  const number = twbvNumberOrZero(value);
  return number >= 0 ? `+${number}` : `${number}`;
}

function twbvRollBreakdownHtml({ title, die, rolls = [], bonus = 0, bonusLabel = "Bônus", bonusDetails = [] }) {
  const safeDie = Number(die);
  const rollValues = Array.isArray(rolls) ? rolls.map((value) => Number(value ?? 0)) : [];
  const rollTotal = rollValues.reduce((sum, value) => sum + value, 0);
  const bonusValue = twbvNumberOrZero(bonus);
  const total = rollTotal + bonusValue;
  const formulaText = formatVeuChainText(safeDie, rollValues).replaceAll("+V\u00c9U", " + V\u00e9u").replaceAll("+V\u00c9U", " + V\u00e9u");
  const details = Array.isArray(bonusDetails) ? bonusDetails.filter((entry) => twbvNumberOrZero(entry?.value) !== 0) : [];
  const bonusRows = details.length
    ? details.map((entry) => `
      <div class="twbv-roll-breakdown__row">
        <span>${escapeHtml(entry.label ?? bonusLabel)}</span>
        <strong>${twbvFormatSignedLabel(entry.value)}</strong>
      </div>`).join("")
    : `<div class="twbv-roll-breakdown__row">
        <span>${escapeHtml(bonusLabel)}</span>
        <strong>${twbvFormatSignedLabel(bonusValue)}</strong>
      </div>`;
  return `
    <div class="twbv-roll-breakdown">
      <div class="twbv-roll-breakdown__row">
        <span>${escapeHtml(title)}</span>
        <strong>${escapeHtml(formulaText)} = ${rollTotal}</strong>
      </div>
      ${bonusRows}
      <div class="twbv-roll-breakdown__row is-total">
        <span>Total</span>
        <strong>${rollTotal}${bonusValue ? ` ${twbvFormatSignedLabel(bonusValue)}` : ""} = ${total}</strong>
      </div>
    </div>`;
}

function twbvDiceTermBreakdownHtml(roll) {
  const dice = Array.from(roll?.dice ?? []);
  if (!dice.length) return `<div class="twbv-roll-breakdown__row"><span>Dados</span><strong>${escapeHtml(roll?.result ?? "")}</strong></div>`;
  const rows = [];
  for (const die of dice) {
    const faces = Number(die.faces ?? 0);
    const count = Math.max(1, Number(die.number ?? 1));
    const values = Array.from(die.results ?? []).map((result) => Number(result.result ?? result.count ?? 0)).filter((value) => Number.isFinite(value));
    if (!values.length) continue;
    const chunks = values.map((value, index) => `${index >= count ? `Véu D${faces}` : `D${faces}`}(${value})`);
    rows.push(`
      <div class="twbv-roll-breakdown__row">
        <span>Dados</span>
        <strong>${escapeHtml(chunks.join(" + "))} = ${values.reduce((sum, value) => sum + value, 0)}</strong>
      </div>`);
  }
  return rows.join("");
}

async function twbvCreateFormulaRollChat({ actor = null, formula, title = "Rolagem", label = "Resultado", type = CONST.CHAT_MESSAGE_TYPES.OTHER, returnContentOnly = false } = {}) {
  const safeFormula = String(formula ?? "").trim();
  if (!safeFormula) return null;
  const roll = await (new Roll(safeFormula)).evaluate();
  await showDice3dRoll(roll);
  const total = Number(roll.total ?? 0);
  const breakdown = twbvDiceTermBreakdownHtml(roll);
  const content = `
    <section class="twbv-roll-chat" data-roll-total="${total}">
      <header class="twbv-roll-chat__header">
        <h3>${escapeHtml(title)}</h3>
      </header>
      <div class="twbv-roll-chat__grid">
        <details class="twbv-roll-card twbv-roll-card--compact twbv-roll-card--total is-selected">
          <summary>
            <span class="twbv-roll-card__label">${escapeHtml(label)}</span>
            <span class="twbv-roll-card__die">${escapeHtml(safeFormula)}</span>
            <span class="twbv-roll-card__value">${total}</span>
            ${twbvChatRerollButtons()}
          </summary>
          <div class="twbv-roll-card__value--breakdown">
            <div class="twbv-roll-breakdown">
              ${breakdown}
              <div class="twbv-roll-breakdown__row is-total"><span>Total</span><strong>${total}</strong></div>
            </div>
          </div>
        </details>
      </div>
      <div class="twbv-roll-chat__top-adjust"><button type="button" class="twbv-roll-adjust" title="Ajustar resultado"><i class="fas fa-plus"></i></button></div>
    </section>`;
  const contentWithAdjust = `${content}<!--TWBV_ADJUST-->${buildRollAdjustSection(total, [])}`;
  const reroll = { mode: "formula", actorUuid: actor?.uuid ?? "", args: { formula: safeFormula, title, label, type } };
  if (returnContentOnly) return { content, contentWithAdjust, total, reroll };
  return ChatMessage.create({
    speaker: actor ? ChatMessage.getSpeaker({ actor }) : ChatMessage.getSpeaker(),
    content: contentWithAdjust,
    type,
    rolls: [roll],
    flags: {"world-behind-the-veil": {
      rollAdjust: { baseTotal: total, chain: [], baseContent: content },
      reroll
    }}
  });
}

async function twbvEvaluateFormulaDetailed(formula, label = "Dados") {
  const text = String(formula ?? "").replace(/\s+/g, "");
  const tokens = text.match(/[+\-]?(?:\d*d\d+|\d+)/gi) ?? [];
  const rows = [];
  let total = 0;

  for (const rawToken of tokens) {
    const sign = rawToken.startsWith("-") ? -1 : 1;
    const token = rawToken.replace(/^[+\-]/, "");
    const diceMatch = token.match(/^(\d*)d(\d+)$/i);
    if (diceMatch) {
      const count = Math.max(1, Number(diceMatch[1] || 1));
      const faces = Number(diceMatch[2]);
      const baseRoll = await (new Roll(`${count}d${faces}`)).evaluate();
      await showDice3dRoll(baseRoll);
      const baseValues = Array.from(baseRoll.dice?.[0]?.results ?? [])
        .map((result) => Number(result.result ?? result.count ?? 0))
        .filter((value) => Number.isFinite(value));
      while (baseValues.length < count) baseValues.push(await rollSingleDie(faces).then((roll) => Number(roll.total ?? 0)));
      for (let index = 0; index < count; index += 1) {
        const rolls = [Number(baseValues[index] ?? 0)];
        rolls.push(...(await rollVeuExtrasFromFirst(faces, rolls[0])));
        const subtotal = rolls.reduce((sum, value) => sum + Number(value ?? 0), 0) * sign;
        total += subtotal;
        const chain = formatVeuChainText(faces, rolls).replaceAll("+V\u00c9U", " + V\u00e9u").replaceAll("+V\u00c9U", " + V\u00e9u");
        rows.push(`
          <div class="twbv-roll-breakdown__row">
            <span>${escapeHtml(label)}</span>
            <strong>${sign < 0 ? "-" : ""}${escapeHtml(chain)} = ${subtotal}</strong>
          </div>`);
      }
      continue;
    }

    const flat = Number(token) * sign;
    if (Number.isFinite(flat) && flat !== 0) {
      total += flat;
      rows.push(`
        <div class="twbv-roll-breakdown__row">
          <span>${escapeHtml(label === "Dados" ? "Bônus" : label)}</span>
          <strong>${twbvFormatSignedLabel(flat)}</strong>
        </div>`);
    }
  }

  return { total, rows: rows.join("") || `<div class="twbv-roll-breakdown__row"><span>${escapeHtml(label)}</span><strong>0</strong></div>` };
}

async function twbvEvaluateDamagePartsTogether(parts = []) {
  const entries = [];
  const rows = [];
  let total = 0;

  for (const part of parts) {
    const label = String(part?.label ?? "Dano");
    const text = String(part?.formula ?? "").replace(/\s+/g, "");
    const tokens = text.match(/[+\-]?(?:\d*d\d+|\d+)/gi) ?? [];
    for (const rawToken of tokens) {
      const sign = rawToken.startsWith("-") ? -1 : 1;
      const token = rawToken.replace(/^[+\-]/, "");
      const diceMatch = token.match(/^(\d*)d(\d+)$/i);
      if (diceMatch) {
        const count = Math.max(1, Number(diceMatch[1] || 1));
        const faces = Number(diceMatch[2]);
        entries.push({ label, sign, count, faces });
        continue;
      }
      const flat = Number(token) * sign;
      if (Number.isFinite(flat) && flat !== 0) {
        total += flat;
        rows.push(`<div class="twbv-roll-breakdown__row"><span>${escapeHtml(label)}</span><strong>${twbvFormatSignedLabel(flat)}</strong></div>`);
      }
    }
  }

  const baseFormula = entries.map((entry) => `${entry.count}d${entry.faces}`).join("+");
  const baseRoll = baseFormula ? await (new Roll(baseFormula)).evaluate() : null;
  if (baseRoll) await showDice3dRoll(baseRoll);
  const baseDice = Array.from(baseRoll?.dice ?? []);

  const pendingExtras = [];
  entries.forEach((entry, entryIndex) => {
    const values = Array.from(baseDice[entryIndex]?.results ?? [])
      .map((result) => Number(result.result ?? result.count ?? 0))
      .filter((value) => Number.isFinite(value));
    while (values.length < entry.count) values.push(0);
    entry.rolls = values.map((value) => [value]);
    entry.rolls.forEach((chain) => {
      if (chain[0] === entry.faces) pendingExtras.push({ entry, chain });
    });
  });

  while (pendingExtras.length) {
    const wave = pendingExtras.splice(0);
    const extraFormula = wave.map((item) => `1d${item.entry.faces}`).join("+");
    const extraRoll = await (new Roll(extraFormula)).evaluate();
    await showDice3dRoll(extraRoll);
    const extraDice = Array.from(extraRoll?.dice ?? []);
    wave.forEach((item, index) => {
      const value = Number(extraDice[index]?.results?.[0]?.result ?? extraDice[index]?.results?.[0]?.count ?? 0);
      item.chain.push(value);
      if (value === item.entry.faces) pendingExtras.push(item);
    });
  }

  const groupedRows = new Map();
  for (const entry of entries) {
    for (const chain of entry.rolls ?? []) {
      const subtotal = chain.reduce((sum, value) => sum + Number(value ?? 0), 0) * entry.sign;
      total += subtotal;
      const chainText = formatVeuChainText(entry.faces, chain).replaceAll("+V\u00c9U", " + V\u00e9u");
      const group = groupedRows.get(entry.label) ?? [];
      group.push(`${entry.sign < 0 ? "-" : ""}${escapeHtml(chainText)} = ${subtotal}`);
      groupedRows.set(entry.label, group);
    }
  }
  for (const [label, parts] of groupedRows.entries()) {
    rows.push(`<div class="twbv-roll-breakdown__row"><span>${escapeHtml(label)}</span><strong>${parts.join(" | ")}</strong></div>`);
  }

  return { total, rows: rows.join("") || `<div class="twbv-roll-breakdown__row"><span>Dano</span><strong>0</strong></div>` };
}

function escapeHtmlAttr(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeHtml(value) {
  return escapeHtmlAttr(value).replaceAll("'", "&#39;");
}

function applyVeuToFormula(formula) {
  const text = String(formula ?? '').trim();
  if (!text) return '1d4x';
  return text.replace(/(\d*)d(\d+)(?![a-zA-Z])/gi, (match, count, faces) => `${count || 1}d${faces}x`);
}

function twbvNormalizeDamageFormulaPart(value, { base = false } = {}) {
  const text = String(value ?? "").trim().replace(/\s+/g, "");
  if (!text) return base ? "1d4" : "";
  if (base || /^[+\-*/]/.test(text)) return text;
  return `+${text}`;
}

function twbvGetWeaponAmplificationFormula(weapon) {
  const candidates = [
    weapon?.system?.damageRaise,
    weapon?.system?.raiseDamage,
    weapon?.system?.amplificationDamage,
    weapon?.system?.bonusDamage
  ];
  const value = candidates.map((entry) => String(entry ?? "").trim()).find(Boolean) ?? "1d6";
  return twbvNormalizeDamageFormulaPart(value);
}

function twbvBuildWeaponDamageFormula(weapon, damageMods = [], { amplified = false, actor = null } = {}) {
  const base = twbvNormalizeDamageFormulaPart(weapon?.system?.damage, { base: true });
  const extras = damageMods
    .map((mod) => twbvNormalizeDamageFormulaPart(mod?.damage ?? mod?.modifier ?? ""))
    .filter(Boolean);
  if (amplified) extras.push(twbvGetWeaponAmplificationFormula(weapon));
  extras.push(...twbvDamageBonusRollParts(actor ?? weapon?.actor ?? null, "weapon").map((entry) => entry.formula));
  return `${base}${extras.join("")}`;
}

function twbvChatRerollButtons({ damage = false, weaponUuid = "", amplified = false } = {}) {
  const freeTitle = "Rerrolar gratuitamente";
  const ecoTitle = "Gastar 1 Eco para rerrolar o dano";
  if (damage) {
    return `<div class="twbv-chat-reroll-actions">
      <button type="button" class="twbv-chat-reroll twbv-chat-reroll--free" title="${freeTitle}" data-reroll-kind="damage" data-weapon-uuid="${escapeHtmlAttr(weaponUuid)}" data-damage-mode="${amplified ? "amplified" : "normal"}"><i class="fas fa-rotate-right"></i></button>
      <button type="button" class="twbv-chat-reroll twbv-chat-reroll--eco" title="${ecoTitle}" data-reroll-kind="damage-eco" data-weapon-uuid="${escapeHtmlAttr(weaponUuid)}" data-damage-mode="${amplified ? "amplified" : "normal"}">Eco</button>
    </div>`;
  }
  return `<div class="twbv-chat-reroll-actions">
    <button type="button" class="twbv-chat-reroll twbv-chat-reroll--free" title="${freeTitle}" data-reroll-kind="stored"><i class="fas fa-rotate-right"></i></button>
    <button type="button" class="twbv-chat-reroll twbv-chat-reroll--eco" title="Gastar 1 Eco para rerrolar esta rolagem" data-reroll-kind="stored-eco">Eco</button>
  </div>`;
}

async function twbvBuildWeaponDamageChatContent(actor, weapon, damageMods = [], { amplified = false } = {}) {
  const formula = twbvBuildWeaponDamageFormula(weapon, damageMods, { amplified, actor });
  let detailedRoll;
  let amplificationFormula = "";
  try {
    const baseFormula = twbvNormalizeDamageFormulaPart(weapon?.system?.damage, { base: true });
    const rollParts = [{ label: "Dano", formula: baseFormula }];
    for (const mod of damageMods) {
      const modFormula = twbvNormalizeDamageFormulaPart(mod?.damage ?? mod?.modifier ?? "");
      if (modFormula) rollParts.push({ label: mod?.name ?? "Modificação", formula: modFormula });
    }
    amplificationFormula = amplified ? twbvGetWeaponAmplificationFormula(weapon) : "";
    if (amplificationFormula) rollParts.push({ label: "Ampliação", formula: amplificationFormula });
    rollParts.push(...twbvDamageBonusRollParts(actor, "weapon"));
    detailedRoll = await twbvEvaluateDamagePartsTogether(rollParts);
  } catch (error) {
    console.error("[TWBV] Férmula de dano inválida.", { weapon: weapon?.name, formula, error });
    ui.notifications?.error(`Férmula de dano inválida em ${weapon?.name ?? "arma"}: ${formula}`);
    return null;
  }
  const weaponAp = twbvNumberOrZero(weapon?.system?.ap);
  const ammoAp = await twbvGetWeaponAmmoArmorPiercing(weapon);
  const modAp = damageMods.reduce((sum, mod) => sum + twbvNumberOrZero(mod?.ap), 0);
  const totalAp = weaponAp + ammoAp + modAp;
  const ammoName = String(weapon?.system?.ammoSourceName ?? weapon?.system?.ammo ?? "").trim();
  const paTooltip = `Arma ${weaponAp} + Munição ${ammoAp} + Modificações ${modAp} = ${totalAp}`;
  const damageRows = `
    <div class="twbv-roll-breakdown">
      ${ammoName ? `<div class="twbv-roll-breakdown__row"><span>Munição</span><strong>${escapeHtml(ammoName)}</strong></div>` : ""}
      <div class="twbv-roll-breakdown__row"><span title="${escapeHtmlAttr(paTooltip)}">PA</span><strong title="${escapeHtmlAttr(paTooltip)}">${ammoAp}</strong></div>
      ${amplified ? `<div class="twbv-roll-breakdown__row"><span>Ampliação</span><strong>${escapeHtml(amplificationFormula || "+1d6")}</strong></div>` : ""}
      ${detailedRoll.rows}
      <div class="twbv-roll-breakdown__row is-total"><span>Dano Total</span><strong>${Number(detailedRoll.total ?? 0)}</strong></div>
    </div>`;
  const renderedDamageRows = damageRows.replace(/\s*<div class="twbv-roll-breakdown__row"><span>Amplia[\s\S]*?<\/div>/, "");
  return `
    <section class="twbv-roll-chat twbv-damage-chat twbv-damage-chat--compact" data-roll-total="${Number(detailedRoll.total ?? 0)}">
      <details class="twbv-roll-card twbv-roll-card--compact twbv-roll-card--damage-total is-selected">
        <summary>
          <span class="twbv-roll-card__label">Dano Total</span>
          <span class="twbv-roll-card__die">${escapeHtml(amplified ? "Ampliado" : "Normal")}</span>
          <span class="twbv-roll-card__value">${Number(detailedRoll.total ?? 0)}</span>
          ${twbvChatRerollButtons({ damage: true, weaponUuid: weapon?.uuid ?? "", amplified })}
        </summary>
        <div class="twbv-roll-card__value--breakdown">${renderedDamageRows}</div>
      </details>
    </section>`;
}

async function twbvRenderWeaponDamageRoll(actor, weapon, damageMods = [], { amplified = false } = {}) {
  const content = await twbvBuildWeaponDamageChatContent(actor, weapon, damageMods, { amplified });
  if (!content) return null;
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content,
    type: CONST.CHAT_MESSAGE_TYPES.OTHER
  });
}

function renderDualDieResult({
  title,
  dieA,
  labelA,
  dieB,
  labelB,
  bonus = 0,
  bonusA,
  bonusB,
  dieDisplayA,
  dieDisplayB,
  bonusDetailsA = [],
  bonusDetailsB = [],
  actor,
  subtitle = "",
  subtitleClass = "",
  finalModifier = 0,
  finalModifierLabel = "",
  extraContent = "",
  extraContentPlacement = "grid",
  icon = "",
  returnContentOnly = false
}) {
  return (async () => {
    const safeDieA = Number(dieA);
    const safeDieB = Number(dieB);

    const [baseA, baseB] = await Promise.all([rollSingleDie(safeDieA), rollSingleDie(safeDieB)]);
    await Promise.all([showDice3dRoll(baseA), showDice3dRoll(baseB)]);

    const rollAData = { total: Number(baseA.total ?? 0), rolls: [Number(baseA.total ?? 0)] };
    const rollBData = { total: Number(baseB.total ?? 0), rolls: [Number(baseB.total ?? 0)] };
    const isCriticalFailure = rollAData.rolls[0] === 1 && rollBData.rolls[0] === 1;

    const extraA = await rollVeuExtrasFromFirst(safeDieA, rollAData.rolls[0]);
    const extraB = await rollVeuExtrasFromFirst(safeDieB, rollBData.rolls[0]);
    if (extraA.length) {
      rollAData.rolls.push(...extraA);
      rollAData.total += extraA.reduce((sum, value) => sum + value, 0);
    }
    if (extraB.length) {
      rollBData.rolls.push(...extraB);
      rollBData.total += extraB.reduce((sum, value) => sum + value, 0);
    }
    const valueA = Number(rollAData.total ?? 0);
    const valueB = Number(rollBData.total ?? 0);
    const effectiveBonusA = Number.isFinite(Number(bonusA)) ? Number(bonusA) : Number(bonus ?? 0);
    const effectiveBonusB = Number.isFinite(Number(bonusB)) ? Number(bonusB) : Number(bonus ?? 0);

    const skillDieResult = valueA;
    const skillBonus = effectiveBonusA;
    const skillTotal = skillDieResult + skillBonus;

    const awakenedDieResult = valueB;
    const awakenedTotal = awakenedDieResult + effectiveBonusB;

    const baseTotal = Math.max(skillTotal, awakenedTotal);
    const winnerIsSkill = skillTotal >= awakenedTotal;
    const winnerLabel = winnerIsSkill ? "PERÍCIA" : "DESPERTO";
    const winnerRolls = winnerIsSkill ? rollAData.rolls : rollBData.rolls;
    const winnerDie = winnerIsSkill ? safeDieA : safeDieB;
    const winnerBonus = winnerIsSkill ? skillBonus : effectiveBonusB;
    const winnerSegments = [`${winnerLabel} ${formatVeuChainText(winnerDie, winnerRolls)}`];
    if (winnerBonus) winnerSegments.push(`+Bonus(${winnerBonus})`);
    winnerSegments.push(`= ${winnerIsSkill ? skillTotal : awakenedTotal}`);
    const winnerExpr = winnerSegments.join(" | ");
    const appliedModifier = Number.isFinite(Number(finalModifier)) ? Number(finalModifier) : 0;
    const total = baseTotal + appliedModifier;
    const dieCard = (label, dieDisplay, dieFaces, value, effectiveBonus, modified, selected, selectedRolls = [], bonusDetails = []) => {
      const bonusLabel = effectiveBonus === 0 ? "" : ` ${effectiveBonus > 0 ? "+" : ""}${effectiveBonus}`;
      const valueLabel = effectiveBonus === 0 ? `${value}` : `${value}${bonusLabel} = ${modified}`;
      const veuAtivado = Array.isArray(selectedRolls) && selectedRolls.length > 1;
      const rollBreakdown = Array.isArray(selectedRolls) && selectedRolls.length ? selectedRolls.join(' + ') : `${value}`;
      const hoverText = `Rolagens: ${rollBreakdown}${effectiveBonus !== 0 ? ` | Bônus: ${effectiveBonus > 0 ? '+' : ''}${effectiveBonus}` : ''} | Total: ${modified}`;
      const breakdown = twbvRollBreakdownHtml({ title: label, die: dieFaces, rolls: selectedRolls, bonus: effectiveBonus, bonusDetails });
      return `
      <details class="twbv-roll-card twbv-roll-card--compact ${selected ? "is-selected" : ""}" title="${escapeHtmlAttr(hoverText)}">
        <summary>
          <span class="twbv-roll-card__label">${label}</span>
          <span class="twbv-roll-card__die">${dieDisplay}${veuAtivado ? ' ? Véu' : ''}</span>
          <span class="twbv-roll-card__value">${escapeHtml(valueLabel)}</span>
        </summary>
        <div class="twbv-roll-card__value--breakdown">${breakdown}</div>
      </details>`;
    };
    const totalLabel = `${total}`;
    const totalHoverText = `${winnerExpr}${appliedModifier !== 0 ? ` | Modificador(${appliedModifier > 0 ? '+' : ''}${appliedModifier})=${total}` : ''}`;
    const topContent = extraContentPlacement === "top" ? extraContent : "";
    const gridContent = extraContentPlacement === "top" ? "" : extraContent;
    const criticalContent = isCriticalFailure
      ? `<div class="twbv-critical-failure"><strong>Falha crítica</strong><span>Perícia e Desperto tiraram 1. Resultado absoluto. +1 Eco.</span></div>`
      : "";
    const totalChoiceBlock = (label, dieText, bonusValue, resultTotal, selected) => `
      <div class="twbv-roll-choice-breakdown ${selected ? "is-total" : ""}">
        <div class="twbv-roll-choice-breakdown__top">
          <span>${escapeHtml(label)}</span>
          <span>Bônus ${twbvFormatSignedLabel(bonusValue)}</span>
          <strong>Total ${resultTotal}</strong>
        </div>
        <div class="twbv-roll-choice-breakdown__dice">${escapeHtml(dieText)}</div>
      </div>`;
    const totalDetails = `
      <div class="twbv-roll-breakdown twbv-roll-breakdown--choices">
        ${totalChoiceBlock("Perícia", formatVeuChainText(safeDieA, rollAData.rolls), skillBonus, skillTotal, winnerIsSkill)}
        ${totalChoiceBlock("Desperto", formatVeuChainText(safeDieB, rollBData.rolls), effectiveBonusB, awakenedTotal, !winnerIsSkill)}
        ${appliedModifier !== 0 ? `<div class="twbv-roll-breakdown__row"><span>Mod.</span><strong>${baseTotal} ${twbvFormatSignedLabel(appliedModifier)} = ${total}</strong></div>` : ""}
      </div>`;

    const modifierDetails = appliedModifier !== 0
      ? `<span class="twbv-roll-chat__modifier"> Dado ${baseTotal}${finalModifierLabel ? ` &middot; ${finalModifierLabel}` : ` &middot; Mod ${appliedModifier > 0 ? "+" : ""}${appliedModifier}`}</span>`
      : "";

    const content = `
      <section class="twbv-roll-chat ${isCriticalFailure ? "twbv-roll-chat--critical" : ""}" data-roll-total="${isCriticalFailure ? -9999 : total}" data-critical-failure="${isCriticalFailure ? "true" : "false"}">
        ${twbvRollChatHeaderHtml({ title, subtitle, subtitleClass, icon })}
        ${topContent}
        <div class="twbv-roll-chat__grid">
          ${dieCard(labelA, dieDisplayA ?? `d${dieA}`, safeDieA, skillDieResult, skillBonus, skillTotal, winnerIsSkill, rollAData.rolls, bonusDetailsA)}
          ${dieCard(labelB, dieDisplayB ?? `d${dieB}`, safeDieB, awakenedDieResult, effectiveBonusB, awakenedTotal, !winnerIsSkill, rollBData.rolls, bonusDetailsB)}
          <details class="twbv-roll-card twbv-roll-card--compact twbv-roll-card--total is-selected" title="${escapeHtmlAttr(totalHoverText)}">
            <summary>
              <span class="twbv-roll-card__label">Total</span>
              <span class="twbv-roll-card__die">${escapeHtml(winnerLabel)}</span>
              <span class="twbv-roll-card__value">${totalLabel}</span>
              ${isCriticalFailure ? "" : twbvChatRerollButtons()}
            </summary>
            <div class="twbv-roll-card__value--breakdown">${totalDetails}</div>
          </details>
          ${gridContent || ""}
          <div class="twbv-chat-damage-result"></div>
        </div>
        ${criticalContent}
        ${isCriticalFailure ? "" : `<div class="twbv-roll-chat__top-adjust"><button type="button" class="twbv-roll-adjust" title="Ajustar resultado"><i class="fas fa-plus"></i></button></div>`}
      </section>`;
    const contentWithAdjust = isCriticalFailure ? content : `${content}<!--TWBV_ADJUST-->${buildRollAdjustSection(total, [])}`;
    const reroll = {
      mode: "dual",
      actorUuid: actor?.uuid ?? "",
      args: { title, dieA, labelA, dieB, labelB, bonus, bonusA, bonusB, dieDisplayA, dieDisplayB, bonusDetailsA, bonusDetailsB, subtitle, subtitleClass, finalModifier, finalModifierLabel, extraContent, extraContentPlacement, icon }
    };
    if (returnContentOnly) return { content, contentWithAdjust, total, reroll: isCriticalFailure ? null : reroll, criticalFailure: isCriticalFailure };

    if (isCriticalFailure) await twbvAwardEcoForCriticalFailure(actor);

    const persistedMessage = await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content: contentWithAdjust,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
      flags: {"world-behind-the-veil": isCriticalFailure
        ? { criticalFailure: true, criticalEcoAwarded: true }
        : { rollAdjust: { baseTotal: total, chain: [], baseContent: content }, reroll }}
    });
    return persistedMessage;
  })();
}

function renderSingleDieResult({
  title,
  die,
  label = "Dado",
  bonus = 0,
  dieDisplay,
  bonusDetails = [],
  actor,
  subtitle = "",
  subtitleClass = "",
  finalModifier = 0,
  finalModifierLabel = "",
  extraContent = "",
  extraContentPlacement = "grid",
  icon = "",
  returnContentOnly = false
}) {
  return (async () => {
    const safeDie = Number(die);
    const baseRoll = await rollSingleDie(safeDie);
    await showDice3dRoll(baseRoll);

    const rolls = [Number(baseRoll.total ?? 0)];
    const extras = await rollVeuExtrasFromFirst(safeDie, rolls[0]);
    if (extras.length) rolls.push(...extras);

    const value = rolls.reduce((sum, entry) => sum + Number(entry ?? 0), 0);
    const effectiveBonus = Number.isFinite(Number(bonus)) ? Number(bonus) : 0;
    const appliedModifier = Number.isFinite(Number(finalModifier)) ? Number(finalModifier) : 0;
    const modified = value + effectiveBonus;
    const total = modified + appliedModifier;
    const bonusLabel = effectiveBonus === 0 ? "" : ` ${effectiveBonus > 0 ? "+" : ""}${effectiveBonus}`;
    const valueLabel = effectiveBonus === 0 ? `${value}` : `${value}${bonusLabel} = ${modified}`;
    const veuAtivado = rolls.length > 1;
    const modifierDetails = appliedModifier !== 0
      ? `<span class="twbv-roll-chat__modifier"> Dado ${modified}${finalModifierLabel ? ` &middot; ${finalModifierLabel}` : ` &middot; Mod ${appliedModifier > 0 ? "+" : ""}${appliedModifier}`}</span>`
      : "";
    const topContent = extraContentPlacement === "top" ? extraContent : "";
    const gridContent = extraContentPlacement === "top" ? "" : extraContent;
    const content = `
      <section class="twbv-roll-chat" data-roll-total="${total}">
        ${twbvRollChatHeaderHtml({ title, subtitle, subtitleClass, icon })}
        ${topContent}
        <div class="twbv-roll-chat__grid">
          <details class="twbv-roll-card twbv-roll-card--compact is-selected" title="Rolagens: ${rolls.join(' + ')} | Total: ${modified}">
            <summary>
              <span class="twbv-roll-card__label">${label}</span>
              <span class="twbv-roll-card__die">${dieDisplay ?? `d${safeDie}`}${veuAtivado ? ' ? Véu' : ''}</span>
              <span class="twbv-roll-card__value">${escapeHtml(valueLabel)}</span>
            </summary>
            <div class="twbv-roll-card__value--breakdown">
              ${twbvRollBreakdownHtml({ title: label, die: safeDie, rolls, bonus: effectiveBonus, bonusDetails })}
            </div>
          </details>
          <details class="twbv-roll-card twbv-roll-card--compact twbv-roll-card--total is-selected">
            <summary>
              <span class="twbv-roll-card__label">Total</span>
              <span class="twbv-roll-card__die">${label}</span>
              <span class="twbv-roll-card__value">${total}</span>
              ${twbvChatRerollButtons()}
            </summary>
            <div class="twbv-roll-card__value--breakdown">
              <div class="twbv-roll-breakdown">
                <div class="twbv-roll-breakdown__row is-total"><span>${label}</span><strong>${valueLabel}</strong></div>
                ${appliedModifier !== 0 ? `<div class="twbv-roll-breakdown__row"><span>Mod.</span><strong>${modified} ${twbvFormatSignedLabel(appliedModifier)} = ${total}</strong></div>` : ""}
              </div>
            </div>
          </details>
          ${gridContent || ""}
          <div class="twbv-chat-damage-result"></div>
        </div>
        <div class="twbv-roll-chat__top-adjust"><button type="button" class="twbv-roll-adjust" title="Ajustar resultado">+ Ajustar</button></div>
      </section>`;
    const contentWithAdjust = `${content}<!--TWBV_ADJUST-->${buildRollAdjustSection(total, [])}`;
    const reroll = {
      mode: "single",
      actorUuid: actor?.uuid ?? "",
      args: { title, die, label, bonus, dieDisplay, bonusDetails, subtitle, subtitleClass, finalModifier, finalModifierLabel, extraContent, extraContentPlacement, icon }
    };
    if (returnContentOnly) return { content, contentWithAdjust, total, reroll };
    return ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content: contentWithAdjust,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
      flags: {"world-behind-the-veil": { rollAdjust: { baseTotal: total, chain: [], baseContent: content }, reroll }}
    });
  })();
}


function buildRollAdjustSection(baseTotal, chain = []) {
  let running = Number(baseTotal ?? 0);
  const rows = chain.map((entry, index) => {
    const die = Number(entry.die ?? 0);
    const flat = Number(entry.flat ?? 0);
    const delta = Number(entry.delta ?? 0);
    const rollParts = Array.isArray(entry.rollParts) ? entry.rollParts : [Number(entry.roll ?? 0)];
    const dieText = die > 0 ? formatVeuChainText(die, rollParts) : "";
    const detailParts = [`Resultado Anterior ${running}`];
    if (dieText) {
      const [firstDiePart, ...veuParts] = String(dieText).split("+V\u00c9U ");
      if (firstDiePart) detailParts.push(`+ ${firstDiePart}`);
      for (const veuPart of veuParts) detailParts.push(`+ V\u00c9U ${veuPart}`);
    }
    if (flat) detailParts.push(`${flat > 0 ? "+" : ""}${flat}`);
    detailParts.push(`= ${running + delta}`);
    const detail = detailParts.join(" | ");
    running += delta;
    return `<div class="twbv-adjust-row"><span class="twbv-adjust-left">${dieText || "Sem dado"} ${flat ? `${flat > 0 ? "+" : ""}${flat}` : ""}</span><span class="twbv-adjust-right">= ${delta > 0 ? "+" : ""}${delta}</span></div><div class="twbv-adjust-circle-wrap"><div class="twbv-adjust-circle" title="${escapeHtmlAttr(detail)}">${running}</div><button type="button" class="twbv-adjust-remove" data-adjust-index="${index}" title="Remover este ajuste">&times;</button></div>`;
  }).join("");
  return `<section class="twbv-adjust-stack"><div class="twbv-adjust-results">${rows || ""}</div></section>`;
}

async function openRollAdjustDialog(message) {
  const state = foundry.utils.deepClone(message.getFlag("world-behind-the-veil", "rollAdjust") ?? {});
  const chain = Array.isArray(state.chain) ? state.chain : [];
  const baseTotal = Number(state.baseTotal ?? 0);
  const content = `<div class="twbv-roll-adjust-dialog"><label>Dado adicional<select name="die"><option value="">Nenhum</option><option value="4">d4</option><option value="6">d6</option><option value="8">d8</option><option value="10">d10</option><option value="12">d12</option></select></label><label>Bônus manual<input type="number" name="flat" value="0" step="1" /></label></div>`;
  new Dialog({ title: "Ajustar resultado da rolagem", content, buttons:{ apply:{label:"Aplicar", callback: async (html)=>{ const root=resolveDialogRoot(html); const die=Number(root?.querySelector('select[name="die"]')?.value||0); const flat=Number(root?.querySelector('input[name="flat"]')?.value||0); let roll=0; let rollParts=[]; if(die>0){ const baseRoll = await rollSingleDie(die); await showDice3dRoll(baseRoll); roll=Number(baseRoll.total ?? 0); rollParts=[roll, ...(await rollVeuExtrasFromFirst(die, roll))]; roll = rollParts.reduce((sum, value)=> sum + Number(value ?? 0), 0);} const delta=roll+(Number.isFinite(flat)?flat:0); chain.push({die,roll,rollParts,flat,delta}); const all = message.content; const marker='<!--TWBV_ADJUST-->';
      const baseContent = state.baseContent || (all.includes(marker)?all.split(marker)[0]:all);
      const newContent = `${baseContent}${marker}${buildRollAdjustSection(baseTotal, chain)}`;
      await message.update({content:newContent, 'flags.world-behind-the-veil.rollAdjust': {baseTotal, chain, baseContent}});
    }}, cancel:{label:"Cancelar"}}, default:'apply'}).render(true);
}
function resolveDialogRoot(dialog) {
  if (!dialog) return null;
  if (typeof dialog.querySelector === "function") return dialog;
  if (dialog.element?.querySelector) return dialog.element;
  if (dialog.window?.element?.querySelector) return dialog.window.element;
  if (Array.isArray(dialog.element) && dialog.element[0]?.querySelector) return dialog.element[0];
  if (dialog[0]?.querySelector) return dialog[0];
  return null;
}

function applyDialogWindowClass(dialogLike, className) {
  const root = resolveDialogRoot(dialogLike);
  if (!root || !className) return null;
  const windowApp = root.closest?.(".window-app");
  if (windowApp) windowApp.classList.add(className);
  return windowApp ?? null;
}

function twbvGetFavoriteItems(actor) {
  return Array.from(actor?.items ?? [])
    .filter((item) => Boolean(item.system?.favorite))
    .map((item) => ({
      id: item.id,
      uuid: item.uuid,
      name: item.name,
      img: item.img,
      type: twbvIsPowerItemDocument(item) ? "poder" : item.type,
      typeLabel: TWBV_ITEM_TYPES[twbvIsPowerItemDocument(item) ? "poder" : item.type] ?? item.type
    }));
}

function twbvRenderGlobalFavorites(actor, { toggle = false } = {}) {
  if (!actor) return;
  const existing = document.querySelector(".twbv-global-favorites");
  if (toggle && existing?.dataset.actorUuid === actor.uuid) {
    existing.remove();
    return;
  }
  existing?.remove();

  const favorites = twbvGetFavoriteItems(actor);
  const savedPosition = (() => {
    try { return JSON.parse(localStorage.getItem("twbvGlobalFavoritesState") ?? "{}"); }
    catch (_error) { return {}; }
  })();
  const left = Number.isFinite(Number(savedPosition.left)) ? Number(savedPosition.left) : 78;
  const top = Number.isFinite(Number(savedPosition.top)) ? Number(savedPosition.top) : 140;
  const width = Number.isFinite(Number(savedPosition.width)) ? Math.clamp(Number(savedPosition.width), 120, 420) : 190;
  const height = Number.isFinite(Number(savedPosition.height)) ? Math.clamp(Number(savedPosition.height), 92, 520) : 0;
  const locked = Boolean(savedPosition.locked);
  const sizeStyle = `width:${width}px;${height ? ` height:${height}px;` : ""}`;
  const itemsHtml = favorites.length
    ? favorites.map((item) => `
      <article class="twbv-global-favorite" data-item-id="${escapeHtmlAttr(item.id)}" role="button" tabindex="0">
        <img src="${escapeHtmlAttr(item.img)}" alt="${escapeHtmlAttr(item.name)}" />
        <div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.typeLabel)}</span></div>
      </article>`).join("")
    : `<p class="twbv-global-favorites__empty">Nenhum favorito marcado.</p>`;

  document.body.insertAdjacentHTML("beforeend", `
    <aside class="twbv-global-favorites${locked ? " is-size-locked" : ""}" data-actor-uuid="${escapeHtmlAttr(actor.uuid)}" style="left:${left}px; top:${top}px; ${sizeStyle}">
      <header class="twbv-global-favorites__header">
        <div class="twbv-global-favorites__title"><i class="fas fa-star"></i><span>${escapeHtml(actor.name)}</span></div>
        <button type="button" class="twbv-global-favorites__lock" title="${locked ? "Destravar tamanho" : "Travar tamanho"}"><i class="fas ${locked ? "fa-lock" : "fa-lock-open"}"></i></button>
        <button type="button" class="twbv-global-favorites__toggle" title="Recolher favoritos"><i class="fas fa-compress-alt"></i></button>
        <button type="button" class="twbv-global-favorites__close" title="Fechar favoritos"><i class="fas fa-times"></i></button>
      </header>
      <div class="twbv-global-favorites__list">${itemsHtml}</div>
      <div class="twbv-global-favorites__resize" title="Redimensionar favoritos" aria-label="Redimensionar favoritos"></div>
    </aside>`);

  const panel = document.querySelector(".twbv-global-favorites");
  if (!panel) return;
  panel.querySelector(".twbv-global-favorites__toggle")?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    panel.classList.toggle("is-collapsed");
  });
  panel.querySelector(".twbv-global-favorites__close")?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    panel.remove();
  });
  panel.querySelector(".twbv-global-favorites__lock")?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const isLocked = panel.classList.toggle("is-size-locked");
    const icon = event.currentTarget.querySelector("i");
    icon?.classList.toggle("fa-lock", isLocked);
    icon?.classList.toggle("fa-lock-open", !isLocked);
    event.currentTarget.title = isLocked ? "Destravar tamanho" : "Travar tamanho";
    twbvSaveGlobalFavoritesState(panel);
  });
  panel.querySelector(".twbv-global-favorites__title")?.addEventListener("click", (event) => {
    if (!panel.classList.contains("is-collapsed")) return;
    event.preventDefault();
    panel.classList.remove("is-collapsed");
  });
  panel.querySelectorAll(".twbv-global-favorite").forEach((entry) => {
    entry.addEventListener("click", () => actor.items.get(entry.dataset.itemId)?.sheet.render(true));
    entry.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      actor.items.get(entry.dataset.itemId)?.sheet.render(true);
    });
  });
  twbvEnableGlobalFavoritesDrag(panel);
  twbvEnableGlobalFavoritesResize(panel);
}

function twbvEnableGlobalFavoritesDrag(panel) {
  const header = panel?.querySelector(".twbv-global-favorites__header");
  if (!panel || !header) return;
  header.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const rect = panel.getBoundingClientRect();
    const onMove = (moveEvent) => {
      const width = panel.offsetWidth;
      const height = panel.offsetHeight;
      const nextLeft = Math.clamp(rect.left + moveEvent.clientX - startX, 4, window.innerWidth - width - 4);
      const nextTop = Math.clamp(rect.top + moveEvent.clientY - startY, 4, window.innerHeight - height - 4);
      panel.style.left = `${nextLeft}px`;
      panel.style.top = `${nextTop}px`;
    };
    const onUp = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      twbvSaveGlobalFavoritesState(panel);
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp, { once: true });
  });
}

function twbvEnableGlobalFavoritesResize(panel) {
  const handle = panel?.querySelector(".twbv-global-favorites__resize");
  if (!panel || !handle) return;
  handle.addEventListener("pointerdown", (event) => {
    if (panel.classList.contains("is-size-locked")) return;
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = panel.offsetWidth;
    const startHeight = panel.offsetHeight;
    const onMove = (moveEvent) => {
      const nextWidth = Math.clamp(startWidth + moveEvent.clientX - startX, 120, 420);
      const nextHeight = Math.clamp(startHeight + moveEvent.clientY - startY, 92, 520);
      panel.style.width = `${nextWidth}px`;
      panel.style.height = `${nextHeight}px`;
    };
    const onUp = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      twbvSaveGlobalFavoritesState(panel);
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp, { once: true });
  });
}

function twbvSaveGlobalFavoritesState(panel) {
  if (!panel) return;
  localStorage.setItem("twbvGlobalFavoritesState", JSON.stringify({
    left: Number.parseFloat(panel.style.left) || panel.getBoundingClientRect().left,
    top: Number.parseFloat(panel.style.top) || panel.getBoundingClientRect().top,
    width: panel.offsetWidth,
    height: panel.offsetHeight,
    locked: panel.classList.contains("is-size-locked")
  }));
}
class TWBVPersonagemSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["twbv", "sheet", "actor", "personagem"],
      width: 1056,
      height: 880,
      tabs: [{ navSelector: ".twbv-tabs", contentSelector: ".twbv-tab-content", initial: "principal" }]
    });
  }

  get template() {
    return `systems/${game.system.id}/templates/actor/personagem-sheet.hbs`;
  }

  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();
    buttons.unshift({
      label: "Configura\u00e7\u00e3o",
      class: "twbv-sheet-config",
      icon: "fas fa-cog",
      onclick: () => this._openSheetConfiguration()
    });
    return buttons;
  }

  async _openSheetConfiguration() {
    const currentKind = twbvGetActorSheetKind(this.actor);
    const typeOptions = TWBV_ACTOR_CREATE_ORDER
      .map((type) => `<option value="${type}" ${type === currentKind ? "selected" : ""}>${TWBV_ACTOR_TYPES[type] ?? type}</option>`)
      .join("");
    const content = `
      <form class="twbv-sheet-config-dialog">
        <div class="form-group">
          <label>Tipo da ficha</label>
          <select name="actorType">${typeOptions}</select>
        </div>
        <div class="form-group">
          <label><input type="checkbox" name="autoWounds" checked /> Ajustar limite de ferimentos pelo tipo</label>
        </div>
      </form>`;

    new Dialog({
      title: "Configura\u00e7\u00e3o da Ficha",
      content,
      buttons: {
        apply: {
          label: "Aplicar",
          callback: async (html) => {
            const root = resolveDialogRoot(html);
            const actorType = String(root?.querySelector('[name="actorType"]')?.value ?? TWBV_ACTOR_DEFAULT_TYPE);
            const autoWounds = Boolean(root?.querySelector('[name="autoWounds"]')?.checked);
            const update = { "system.twbvSheetKind": actorType };
            if (autoWounds) {
              const maxWounds = twbvGetActorWoundMax(actorType);
              update["system.ferimentos"] = Math.max(0, Math.min(maxWounds, Number(this.actor.system?.ferimentos ?? 0)));
            }
            await this.actor.update(update);
            await this.render(true);
          }
        },
        cancel: { label: "Cancelar" }
      },
      default: "apply"
    }).render(true);
  }

  getData(options = {}) {
    const context = super.getData(options);
    context.system = this.actor?.system ?? context.system ?? {};
    context.actorKind = twbvGetActorSheetKind(this.actor);
    context.actorKindLabel = TWBV_ACTOR_TYPES[context.actorKind] ?? "Desperto";
    context.usesAwakenedDie = twbvActorUsesAwakenedDie(this.actor);
    context.woundMax = twbvGetActorWoundMax(this.actor);
    context.system.mana = context.system.mana ?? {};
    context.system.codinome = String(context.system.codinome ?? "").trim();
    context.system.mana.value = Number(context.system.mana.value ?? 0);
    context.system.mana.max = Number(context.system.mana.max ?? 3);
    context.system.defesa = context.system.defesa ?? {};
    context.system.dinheiro = context.system.dinheiro ?? {};
    context.system.dinheiro.modo = ["moderno", "medieval"].includes(String(context.system.dinheiro.modo ?? "")) ? String(context.system.dinheiro.modo) : "moderno";
    context.system.dinheiro.moeda = String(context.system.dinheiro.moeda ?? "USD") || "USD";
    context.system.dinheiro.valor = Number(context.system.dinheiro.valor ?? 0);
    context.system.dinheiro.conversaoAtiva = Boolean(context.system.dinheiro.conversaoAtiva);
    context.system.dinheiro.taxaBancaria = Number(context.system.dinheiro.taxaBancaria ?? 0);
    context.system.dinheiro.saldos = twbvNormalizeMoneyBalances(context.system.dinheiro.saldos, context.system.dinheiro.valor);
    context.system.dinheiro.valor = context.system.dinheiro.saldos.USD;
    context.system.dinheiro.registros = Array.isArray(context.system.dinheiro.registros) ? context.system.dinheiro.registros : [];
    context.system.dinheiro.cobre = Number(context.system.dinheiro.cobre ?? 0);
    context.system.dinheiro.prata = Number(context.system.dinheiro.prata ?? 0);
    context.system.dinheiro.ouro = Number(context.system.dinheiro.ouro ?? 0);
    context.system.dinheiro.platina = Number(context.system.dinheiro.platina ?? 0);
    context.system.dinheiro.medievalConversao = twbvGetWorldMedievalRates();
    const moneySymbols = Object.fromEntries(TWBV_MONEY_CURRENCIES.map((currency) => [currency.code, currency.symbol]));
    context.moneySymbol = moneySymbols[context.system.dinheiro.moeda] ?? context.system.dinheiro.moeda;
    context.moneyValueDisplay = Number(context.system.dinheiro.valor ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    context.moneyCurrencies = TWBV_MONEY_CURRENCIES.map((currency) => ({
      ...currency,
      balance: twbvRoundMoney(context.system.dinheiro.saldos[currency.code] ?? 0),
      balanceDisplay: twbvFormatMoneyValue(context.system.dinheiro.saldos[currency.code] ?? 0),
      isUsd: currency.code === "USD"
    }));
    context.moneyExchangeCurrencies = context.moneyCurrencies.filter((currency) => currency.code !== "USD");
    context.moneyPixRecipients = Array.from(game.actors ?? [])
      .filter((actor) => actor.id !== this.actor?.id && actor.isOwner)
      .map((actor) => ({ id: actor.id, name: actor.name }))
      .sort((left, right) => left.name.localeCompare(right.name, "pt-BR"));
    const allMoneyRecords = Array.isArray(context.system.dinheiro.registros) ? context.system.dinheiro.registros : [];
    context.moneyRecordsModern = twbvNormalizeMoneyRecords(allMoneyRecords.filter((record) => twbvMoneyRecordRealm(record) !== "medieval"));
    context.moneyRecordsMedieval = twbvNormalizeMoneyRecords(allMoneyRecords.filter((record) => twbvMoneyRecordRealm(record) === "medieval"));
    context.medievalCurrencies = TWBV_MEDIEVAL_CURRENCIES.map((currency) => ({
      ...currency,
      balance: twbvRoundMoney(context.system.dinheiro[currency.code] ?? 0),
      balanceDisplay: twbvFormatMedievalMoneyValue(context.system.dinheiro[currency.code] ?? 0)
    }));
    context.system.historia = context.system.historia ?? {};
    context.system.historia.antecedente = context.system.historia.antecedente ?? {};
    context.system.historia.antecedente.idade = String(context.system.historia.antecedente.idade ?? "");
    context.system.historia.antecedente.genero = String(context.system.historia.antecedente.genero ?? "");
    context.system.historia.antecedente.altura = String(context.system.historia.antecedente.altura ?? "");
    context.system.historia.antecedente.olhos = String(context.system.historia.antecedente.olhos ?? "");
    context.system.historia.antecedente.cabelo = String(context.system.historia.antecedente.cabelo ?? "");
    context.system.historia.antecedente.ocupacao = String(context.system.historia.antecedente.ocupacao ?? "");
    context.system.historia.antecedente.residencia = String(context.system.historia.antecedente.residencia ?? "");
    context.system.historia.antecedente.afiliacao = String(context.system.historia.antecedente.afiliacao ?? "");
    context.system.historia.antecedente.marcas = String(context.system.historia.antecedente.marcas ?? "");
    context.system.historia.antecedente.relacoes = String(context.system.historia.antecedente.relacoes ?? "");
    context.system.historia.antecedente.aparencia = String(context.system.historia.antecedente.aparencia ?? "");
    context.system.historia.antecedente.objetivos = String(context.system.historia.antecedente.objetivos ?? "");
    context.system.historia.antecedente.biografia = String(context.system.historia.antecedente.biografia ?? "");
    context.system.historia.album = twbvNormalizeHistoryAlbum(context.system.historia.album);
    context.system.historia.albumSections = twbvNormalizeHistoryAlbumSections(context.system.historia.albumSections);
    context.albumSections = twbvBuildHistoryAlbumSections(context.system.historia.album, context.system.historia.albumSections);
    const apararLutarHalf = getSkillHalfForDefense(context.system, "LUTAR");
    const resistenciaConHalf = getConstituicaoHalfForResistencia(context.system);
    const apararBase = 2 + apararLutarHalf;
    const resistenciaBase = 2 + resistenciaConHalf;
    const apararTalento = Math.max(0, Number(context.system?.defesa?.apararTalento ?? 0));
    const apararItens = Math.max(0, Number(context.system?.defesa?.apararItens ?? 0));
    const resistenciaTalento = Math.max(0, Number(context.system?.defesa?.resistenciaTalento ?? 0));
    const resistenciaItens = Math.max(0, Number(context.system?.defesa?.resistenciaItens ?? 0));
    const desviarTalento = Math.max(0, Number(context.system?.defesa?.desviarTalento ?? 0));
    const desviarItens = Math.max(0, Number(context.system?.defesa?.desviarItens ?? 0));
    const desviarMagias = Math.max(0, Number(context.system?.defesa?.desviarMagias ?? 0));
    const resistenciaMagicaTalento = Math.max(0, Number(context.system?.defesa?.resistenciaMagicaTalento ?? 0));
    const resistenciaMagicaItens = Math.max(0, Number(context.system?.defesa?.resistenciaMagicaItens ?? 0));
    const resistenciaMagicaMagias = Math.max(0, Number(context.system?.defesa?.resistenciaMagicaMagias ?? 0));
    const resistenciaMagicaInfluHalf = getInfluenciaHalfForResistenciaMagica(context.system);

    const apararTotal = Math.max(0, apararBase + apararTalento + apararItens);
    const resistenciaTotal = Math.max(0, resistenciaBase + resistenciaTalento + resistenciaItens);
    const desviarTotal = Math.max(0, 4 + desviarTalento + desviarItens + desviarMagias);
    const resistenciaMagicaTotal = Math.max(0, 2 + resistenciaMagicaInfluHalf + resistenciaMagicaTalento + resistenciaMagicaItens + resistenciaMagicaMagias);

    context.system.defesa.aparar = apararTotal;
    context.system.defesa.resistencia = resistenciaTotal;
    context.system.defesa.desviar = desviarTotal;
    context.system.defesa.resistenciaMagica = resistenciaMagicaTotal;

    context.defesaApararTooltip = `2 (padrão) + Lutar (${apararLutarHalf}) + Talento (${apararTalento}) + Itens (${apararItens}) = ${apararTotal}`;
    context.defesaResistenciaTooltip = `2 (padrão) + Constituição (${resistenciaConHalf}) + Talento (${resistenciaTalento}) + Itens (${resistenciaItens}) = ${resistenciaTotal}`;
    context.defesaDesviarTooltip = `4 (padrão) + Talento (${desviarTalento}) + Itens (${desviarItens}) + Magias (${desviarMagias}) = ${desviarTotal}`;
    context.defesaResistenciaMagicaTooltip = `2 (padrão) + Influência (${resistenciaMagicaInfluHalf}) + Talento (${resistenciaMagicaTalento}) + Itens (${resistenciaMagicaItens}) + Magias (${resistenciaMagicaMagias}) = ${resistenciaMagicaTotal}`;
    context.system.ferimentos = Math.max(0, Math.min(context.woundMax, Number(context.system.ferimentos ?? 0)));
    context.system.fadiga = Math.max(0, Math.min(4, Number(context.system.fadiga ?? 0)));
    context.system.tamanho = Number.isFinite(Number(context.system.tamanho)) ? Number(context.system.tamanho) : 0;
    const atletismo = findSkillByName(context.system, "ATLETISMO");
    const atletismoBonus = Number.isFinite(Number(atletismo?.bonus)) ? Number(atletismo.bonus) : 0;
    const atletismoDie = SKILL_DICE.includes(Number(atletismo?.dado)) ? Number(atletismo.dado) : 4;
    context.movimentoTotal = 5 + atletismoBonus;
    context.movimentoDie = atletismoDie;
    context.movimentoDieLabel = `d${atletismoDie}`;
    context.movimentoTooltip = "Movimento básico: 5 + bônus de Atletismo (somente o bônus após o +).";
    context.movimentoDieTooltip = `Dado de corrida usa o dado da perícia Atletismo: ${context.movimentoDieLabel}.`;
    const ferimentosNivel = Number(context.system.ferimentos ?? 0);
    if (ferimentosNivel <= 0) {
      context.penaltyFerimentosLabel = "Sem ferimentos (0)";
      context.condicaoFerimentosLabel = "Saud\u00e1vel";
    } else if (ferimentosNivel === 1) {
      context.penaltyFerimentosLabel = "Machucado (-1)";
      context.condicaoFerimentosLabel = "Machucado";
    } else if (ferimentosNivel === 2) {
      context.penaltyFerimentosLabel = "Ferido (-2)";
      context.condicaoFerimentosLabel = "Ferido";
    } else if (ferimentosNivel === 3) {
      context.penaltyFerimentosLabel = "Muito ferido (-3)";
      context.condicaoFerimentosLabel = "Muito ferido";
    } else if (ferimentosNivel === 4) {
      context.penaltyFerimentosLabel = "Gravemente ferido (-3)";
      context.condicaoFerimentosLabel = "Gravemente ferido";
    } else {
      context.penaltyFerimentosLabel = "Morrendo (-3)";
      context.condicaoFerimentosLabel = "Morrendo";
    }
    if (context.system.fadiga <= 0) {
      context.penaltyFadigaLabel = "Sem fadiga (0)";
    } else if (context.system.fadiga === 1) {
      context.penaltyFadigaLabel = "Cansado (-1)";
    } else if (context.system.fadiga === 2) {
      context.penaltyFadigaLabel = "Debilitado (-2)";
    } else if (context.system.fadiga === 3) {
      context.penaltyFadigaLabel = "Exausto (-3)";
    } else {
      context.penaltyFadigaLabel = "Inconsciente (-4)";
    }
    context.inconsciente = context.system.fadiga >= 4 || context.system.ferimentos >= context.woundMax;
    context.condicaoAtual = context.inconsciente ? "Morrendo" : context.condicaoFerimentosLabel;
    context.condicaoFerimentosResumo = context.penaltyFerimentosLabel;
    context.condicaoFadigaResumo = context.penaltyFadigaLabel;
    context.conditionStateStyle = getConditionVisualStyle(context.system.ferimentos, context.system.fadiga);
    context.conditionStateClass = context.system.ferimentos > 0 || context.inconsciente ? "is-active" : "";
    context.advancementOptions = ADVANCEMENT_OPTIONS;

    const advances = Number(context.system.avancosTotais ?? 0);
    const currentStage = STAGES.find((stage) => advances >= stage.min && advances <= stage.max) ?? STAGES[0];
    context.stageName = currentStage.name;
    context.stages = STAGES.map((stage) => ({
      name: stage.name,
      range: Number.isFinite(stage.max) ? `${stage.min}-${stage.max}` : `${stage.min}+`,
      current: stage.name === currentStage.name
    }));

    context.system.avancos = Array.from(context.system.avancos ?? []).map((avanco, index) => twbvNormalizeAdvancementEntry(avanco, index));

    const currentStageIndex = STAGES.findIndex((stage) => stage.name === currentStage.name);
    context.advancementGroups = STAGES.map((stage, stageIndex) => {
      const entries = context.system.avancos.filter((avanco) => {
        const progression = Math.max(0, Number(avanco.numero ?? 1));
        return progression >= stage.min && progression <= stage.max;
      });
      return {
        key: stage.name.toLowerCase(),
        name: stage.name.toUpperCase(),
        current: stage.name === currentStage.name,
        visible: stageIndex <= currentStageIndex || entries.length > 0,
        entries
      };
    }).filter((stage) => stage.visible);

    context.attributeOptions = ATTRIBUTE_DICE.map((die) => ({ value: die, label: `d${die}` }));
    context.attributeKeys = [
      { key: "forca", label: "For\u00e7a" },
      { key: "destreza", label: "Destreza" },
      { key: "constituicao", label: "Constitui\u00e7\u00e3o" },
      { key: "inteligencia", label: "Intelig\u00eancia" },
      { key: "influencia", label: "Influ\u00eancia" },
      { key: "intuicao", label: "Intui\u00e7\u00e3o" }
    ];
    context.skillAttributeOptions = SKILL_ATTRIBUTES;
    context.skillSortActive = Boolean(this.actor.getFlag("world-behind-the-veil", "skillSortActive"));
    context.skillDiceOptions = SKILL_LEVELS.map((level, index) => ({
      value: index,
      label: buildDieLabel(level.dado, level.bonus),
      dado: level.dado,
      bonus: level.bonus
    }));
    context.system.pericias = Array.from(context.system.pericias ?? []).map((pericia) => {
      const dado = SKILL_DICE.includes(Number(pericia?.dado)) ? Number(pericia.dado) : 4;
      let bonus = Number.isFinite(Number(pericia?.bonus)) ? Number(pericia.bonus) : 0;
      const nome = twbvFixCorruptedPortugueseText(pericia?.nome ?? "").trim();
      const descricao = twbvFixCorruptedPortugueseText(pericia?.descricao ?? pericia?.description ?? "").trim();
      const iconPath = twbvGetSkillIconPath({ ...pericia, nome });
      return {
        ...pericia,
        nome,
        img: iconPath,
        iconPath,
        atributo: String(pericia?.atributo ?? "forca").toLowerCase(),
        dado,
        bonus,
        descricao,
        descriptionHtml: descricao ? descricao.split(/\n{2,}/).map((paragraph) => `<p>${twbvEscapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`).join("") : "",
        locked: Boolean(pericia?.locked),
        levelIndex: SKILL_LEVELS.findIndex((level) => level.dado === dado && level.bonus === bonus),
        rollLabel: buildDieLabel(dado, bonus),
        rank: getSkillRank(dado, bonus),
        attributeMeta: getSkillAttributeMeta(String(pericia?.atributo ?? "forca").toLowerCase())
      };
    });

    const actorItems = Array.from(this.actor.items ?? []);
    const parseNumber = (value, fallback = 0) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    };

    const mapItem = (item) => ({
      id: item.id,
      uuid: item.uuid,
      name: item.name,
      icon: item.img,
      img: item.img,
      img: item.img,
      type: twbvIsPowerItemDocument(item) ? "poder" : item.type,
      sourceType: "item",
      listKey: "",
      typeLabel: TWBV_ITEM_TYPES[twbvIsPowerItemDocument(item) ? "poder" : item.type] ?? item.type,
      active: Boolean(item.system?.active),
      equipped: Boolean(item.system?.equipped),
      tier: String(item.system?.tier ?? "").trim(),
      severity: String(item.system?.severity ?? "").trim(),
      description: String(item.system?.description ?? "").trim(),
      descricao: String(item.system?.description ?? item.system?.descricao ?? "").trim(),
      fonte: String(item.system?.source ?? item.system?.fonte ?? "").trim(),
      categoria: String(item.system?.category ?? item.system?.categoria ?? "").trim(),
      requisitos: String(item.system?.requirements ?? item.system?.requisitos ?? item.system?.tier ?? "").trim(),
      skill: String(item.system?.skill ?? item.system?.pericia ?? "").trim(),
      manaCost: parseNumber(item.system?.manaCost ?? item.system?.mana ?? item.system?.costMana),
      areaEffect: twbvNormalizePowerAreaValue(item.system?.areaEffect ?? item.system?.area),
      areaEffectLabel: twbvGetPowerAreaLabel(item.system?.areaEffect ?? item.system?.area),
      effectsSummary: summarizeItemActiveEffects(item),
      quantity: parseNumber(item.system?.quantity, 1),
      weight: parseNumber(item.system?.weight),
      cost: parseNumber(item.system?.cost),
      damage: String(item.system?.damage ?? "").trim(),
      range: String(item.system?.range ?? "").trim(),
      bonus: String(item.system?.bonus ?? "").trim(),
      protection: String(item.system?.protection ?? "").trim(),
      penalty: String(item.system?.penalty ?? "").trim(),
      tags: String(item.system?.tags ?? "").trim(),
      equipSlot: String(item.system?.equipSlot ?? "").trim(),
      handMode: twbvGetWeaponHandMode(item),
      equippedHand: twbvGetWeaponEquippedHand(item),
      equippedHandLabel: TWBV_WEAPON_HAND_LABELS[twbvGetWeaponHandMode(item)] ?? twbvGetWeaponHandLabel(item),
      equipStatus: Number(item.system?.equipStatus ?? 0),
      isEquipped: Boolean(item.system?.equipped ?? Number(item.system?.equipStatus ?? 0) === 1),
      isWeapon: ["arma", "weapon"].includes(item.type)
    });

    const mapEquipmentCardItem = (item) => ({
      _id: item.id,
      id: item.id,
      uuid: item.uuid,
      name: item.name,
      type: item.type,
      img: item.img,
      typeLabel: TWBV_ITEM_TYPES[item.type] ?? item.type,
      system: {
        ...(item.system ?? {}),
        categoryLabel: TWBV_ITEM_TYPES[String(item.system?.category ?? "").trim()] ?? String(item.system?.category ?? "").trim()
      },
      isAmmoBox: twbvIsAmmoBox(item),
      equipSlot: String(item.system?.equipSlot ?? "").trim(),
      handMode: twbvGetWeaponHandMode(item),
      equippedHand: twbvGetWeaponEquippedHand(item),
      equippedHandLabel: TWBV_WEAPON_HAND_LABELS[twbvGetWeaponHandMode(item)] ?? twbvGetWeaponHandLabel(item),
      isEquipped: Boolean(item.system?.equipped ?? Number(item.system?.equipStatus ?? 0) === 1),
      isWeapon: ["arma", "weapon"].includes(item.type)
    });

    const mapSystemEntry = (entry, fallbackType, listKey = "") => ({
      id: String(entry?.id ?? foundry.utils.randomID()),
      name: String(entry?.nome ?? entry?.name ?? "").trim(),
      icon: String(entry?.icon ?? "").trim(),
      type: fallbackType,
      sourceType: "system",
      listKey,
      typeLabel: TWBV_ITEM_TYPES[fallbackType] ?? fallbackType,
      fonte: String(entry?.fonte ?? entry?.source ?? "").trim(),
      categoria: String(entry?.categoria ?? entry?.category ?? "").trim(),
      requisitos: String(entry?.requisitos ?? entry?.requirements ?? "").trim(),
      skill: String(entry?.skill ?? entry?.pericia ?? "").trim(),
      severity: String(entry?.severity ?? "").trim(),
      descricao: String(entry?.descricao ?? entry?.description ?? "").trim()
    });

    const vantagensEmbedded = actorItems.filter((item) => item.type === "vantagem").map(mapItem);
    const habilidadesEmbedded = actorItems.filter((item) => item.type === "habilidadeEspecial" && !twbvIsPowerItemDocument(item)).map(mapItem);
    const poderesEmbedded = actorItems.filter(twbvIsPowerItemDocument).map(mapItem);
    const desvantagensEmbedded = actorItems.filter((item) => item.type === "desvantagem").map(mapItem);

    context.vantagens = vantagensEmbedded.length ? vantagensEmbedded : Array.from(this.actor.system?.vantagens ?? []).map((entry) => mapSystemEntry(entry, "vantagem", "vantagens"));
    context.habilidadesEspeciais = habilidadesEmbedded.length ? habilidadesEmbedded : Array.from(this.actor.system?.habilidadesEspeciais ?? []).map((entry) => mapSystemEntry(entry, "habilidadeEspecial", "habilidadesEspeciais"));
    context.poderes = poderesEmbedded.length ? poderesEmbedded : Array.from(this.actor.system?.poderes ?? []).map((entry) => mapSystemEntry(entry, "poder", "poderes"));
    context.desvantagens = desvantagensEmbedded.length ? desvantagensEmbedded : Array.from(this.actor.system?.desvantagens ?? []).map((entry) => mapSystemEntry(entry, "desvantagem", "desvantagens"));
    const savedVantagemDivisions = Array.from(this.actor.system?.vantagemDivisoes ?? [])
      .map((entry) => ({
        id: String(entry?.id ?? foundry.utils.randomID()).trim() || foundry.utils.randomID(),
        name: String(entry?.name ?? entry?.nome ?? "").trim()
      }))
      .filter((entry) => entry.name);
    const vantagemDivisionByKey = new Map();
    for (const division of savedVantagemDivisions) {
      vantagemDivisionByKey.set(division.name.toLocaleLowerCase("pt-BR"), { ...division, items: [], isManual: true });
    }
    const vantagemItemsSemDivisao = [];
    for (const item of context.vantagens) {
      const category = String(item.categoria ?? "").trim();
      if (!category) {
        vantagemItemsSemDivisao.push(item);
        continue;
      }
      const key = category.toLocaleLowerCase("pt-BR");
      if (!vantagemDivisionByKey.has(key)) {
        vantagemDivisionByKey.set(key, {
          id: `category-${key.replace(/[^a-z0-9_-]+/gi, "-")}`,
          name: category,
          items: [],
          isManual: false
        });
      }
      vantagemDivisionByKey.get(key).items.push(item);
    }
    context.vantagemItemsSemDivisao = vantagemItemsSemDivisao;
    context.vantagemDivisoes = Array.from(vantagemDivisionByKey.values());
    context.vantagemHasContent = context.vantagens.length > 0 || context.vantagemDivisoes.length > 0;
    context.equipamentos = actorItems.filter((item) => twbvIsEquipmentItemType(item.type)).map(mapItem);
    const weapons=actorItems.filter(i=>["arma","weapon"].includes(i.type)); const armors=actorItems.filter(i=>i.type==="armadura"); const consumables=actorItems.filter(i=>i.type==="consumable"); const ammoItems=actorItems.filter(i=>i.type==="municao"); const magazines=ammoItems.filter(i=>!twbvIsAmmoBox(i)); const ammunitions=ammoItems.filter(i=>twbvIsAmmoBox(i));
    for (const item of [...weapons,...armors,...consumables,...ammoItems]) { const sys=item.system; if(["arma","weapon","municao"].includes(item.type)){const c=Number(sys.currentShots??0),m=Number(sys.shots??0); sys.ammoPercent=m>0?Math.clamp((c/m)*100,0,100):0; sys.reloadTypeLabel=TWBV_AMMO_RELOAD_LABELS[sys.reloadType]??sys.reloadType;} if(item.type==="consumable"&&sys.charges?.hasCharges){const charge=Object.values(sys.charges.charges??{})[0]; sys.mainCharge=charge; if(charge){const v=Number(charge.value??0),m=Number(charge.max??0); sys.chargePercent=m>0?Math.clamp((v/m)*100,0,100):0;}} }
    const favoriteItems = actorItems
      .filter((item) => Boolean(item.system?.favorite))
      .map((item) => ({
        ...mapItem(item),
        _id: item.id,
        img: item.img,
        system: item.system ?? {}
      }));
    context.favorites = favoriteItems;
    context.equipment={favorite:favoriteItems,weapons:weapons.map(mapEquipmentCardItem),armors:armors.map(mapEquipmentCardItem),magazines:magazines.map(mapEquipmentCardItem),ammunitions:ammunitions.map(mapEquipmentCardItem),consumables:consumables.map(mapEquipmentCardItem),others:actorItems.filter(i=>["equipamento","modificacao"].includes(i.type)).map(mapEquipmentCardItem)};
    const slotItemByKey = new Map();
    for (const item of actorItems) {
      const equipped = Boolean(item.system?.equipped ?? Number(item.system?.equipStatus ?? 0) === 1);
      if (!equipped) continue;
      const slotKeys = ["arma", "weapon"].includes(item.type) ? twbvGetWeaponBodySlots(item) : [twbvGetBodySlotKey(item)];
      for (const slotKey of slotKeys) {
        if (!slotKey || slotItemByKey.has(slotKey)) continue;
        slotItemByKey.set(slotKey, mapItem(item));
      }
    }
    context.equipmentSlots = TWBV_EQUIPMENT_SLOT_DEFS.map((slot) => ({ ...slot, item: slotItemByKey.get(slot.key) ?? null }));
    context.bodySlots = context.equipmentSlots.map((slot) => ({
      ...slot,
      positionStyle: twbvGetBodySlotPositionStyle(this.actor, slot.key)
    }));
    const savedBodyLines = this.actor.getFlag("world-behind-the-veil", "bodyMapLines");
    context.bodyLines = twbvNormalizeBodyLines(savedBodyLines).map((line) => ({
      id: line.key,
      style: twbvGetBodyLineStyle(line)
    }));
    context.equipmentView = ["inventory", "body", "resources"].includes(this._equipmentView) ? this._equipmentView : "inventory";
    context.activeBonuses = actorItems
      .filter((item) => Boolean(item.system?.active) && summarizeItemActiveEffects(item))
      .map((item) => ({
        name: item.name,
        summary: summarizeItemActiveEffects(item)
      }));
    context.effectTargetOptions = twbvBuildActorEffectTargetOptions(this.actor);
    context.effectModeOptions = twbvEffectModeOptions();
    context.sheetEffects = twbvPrepareActorSheetEffects(this.actor);

    this._ensureSystemDefaults();

    return context;
  }

  _ensureSystemDefaults() {
    const pericias = Array.from(this.actor.system.pericias ?? []);
    for (let i = 0; i < pericias.length; i += 1) {
      if (typeof pericias[i] === "string") pericias[i] = { nome: pericias[i], dado: 4, bonus: 0 };
      pericias[i].nome = String(pericias[i].nome ?? "").trim();
      if (Number.isFinite(Number(pericias[i].passo))) {
        const legacyStep = Math.max(-1, Math.min(Number(pericias[i].passo), 8));
        pericias[i].dado = SKILL_DICE[Math.max(0, Math.floor((legacyStep + 1) / 2))] ?? 4;
      }
      pericias[i].dado = SKILL_DICE.includes(Number(pericias[i].dado)) ? Number(pericias[i].dado) : 4;
      pericias[i].bonus = Number.isFinite(Number(pericias[i].bonus)) ? Number(pericias[i].bonus) : 0;
      pericias[i].locked = Boolean(pericias[i].locked);
      pericias[i].atributo = String(pericias[i].atributo ?? "forca").toLowerCase();
      if (!SKILL_ATTRIBUTES.some((attr) => attr.key === pericias[i].atributo)) pericias[i].atributo = "forca";
      delete pericias[i].passo;
    }

    const mana = this.actor.system.mana ?? {};
    const manaValue = Number(mana.value ?? 0);
    const manaMax = Number(mana.max ?? 3);
    this.actor.system.mana = {
      value: Number.isFinite(manaValue) ? Math.max(0, manaValue) : 0,
      max: Number.isFinite(manaMax) ? Math.max(0, manaMax) : 3
    };

    const woundMax = twbvGetActorWoundMax(this.actor);
    this.actor.system.twbvSheetKind = twbvGetActorSheetKind(this.actor);
    this.actor.system.ferimentos = Math.max(0, Math.min(woundMax, Number(this.actor.system.ferimentos ?? 0)));
    this.actor.system.fadiga = Math.max(0, Math.min(4, Number(this.actor.system.fadiga ?? 0)));
    this.actor.system.tamanho = Number.isFinite(Number(this.actor.system.tamanho)) ? Number(this.actor.system.tamanho) : 0;

    if (!Array.isArray(this.actor.system?.condicoes)) this.actor.system.condicoes = [];
    const shouldBeUnconscious = this.actor.system.fadiga >= 4 || this.actor.system.ferimentos >= woundMax;
    const woundConditionByLevel = ["", "Machucado", "Ferido", "Muito ferido", "Gravemente ferido", "Morrendo"];
    const woundCondition = woundConditionByLevel[Math.max(0, Math.min(5, Number(this.actor.system.ferimentos ?? 0)))];
    const woundStates = new Set(woundConditionByLevel.filter(Boolean));
    this.actor.system.condicoes = this.actor.system.condicoes.filter((c) => !woundStates.has(c));
    if (woundCondition) this.actor.system.condicoes.push(woundCondition);
    if (shouldBeUnconscious && !this.actor.system.condicoes.includes("Morrendo")) this.actor.system.condicoes.push("Morrendo");

    this.actor.system.defesa = this.actor.system.defesa ?? {};
    const apararBase = 2 + getSkillHalfForDefense(this.actor.system, "LUTAR");
    const resistenciaBase = 2 + getConstituicaoHalfForResistencia(this.actor.system);
    const apararRaw = this.actor.system.defesa.aparar;
    const resistenciaRaw = this.actor.system.defesa.resistencia;
    this.actor.system.defesa.aparar = Math.max(0, Number(apararRaw ?? apararBase));
    this.actor.system.defesa.resistencia = Math.max(0, Number(resistenciaRaw ?? resistenciaBase));
    this.actor.system.defesa.desviar = Math.max(0, Number(this.actor.system.defesa.desviar ?? 4));
    const resistenciaMagicaBase = 2 + getInfluenciaHalfForResistenciaMagica(this.actor.system);
    this.actor.system.defesa.resistenciaMagica = Math.max(0, Number(this.actor.system.defesa.resistenciaMagica ?? resistenciaMagicaBase));

    if (!Array.isArray(this.actor.system?.vantagens)) this.actor.system.vantagens = [];
    if (!Array.isArray(this.actor.system?.habilidadesEspeciais)) this.actor.system.habilidadesEspeciais = [];
    if (!Array.isArray(this.actor.system?.poderes)) this.actor.system.poderes = [];
    if (!Array.isArray(this.actor.system?.desvantagens)) this.actor.system.desvantagens = [];
    if (!Array.isArray(this.actor.system?.vantagemDivisoes)) this.actor.system.vantagemDivisoes = [];

    const atributos = foundry.utils.deepClone(this.actor.system.atributos ?? {});
    const keys = ["forca", "destreza", "constituicao", "inteligencia", "influencia", "intuicao"];
    for (const key of keys) {
      atributos[key] = atributos[key] ?? {};
      atributos[key].passo = normalizeAttributeStep(atributos[key].passo);
      atributos[key].bonus = Number.isFinite(Number(atributos[key].bonus)) ? Number(atributos[key].bonus) : 0;
    }
  }

  async _updateObject(event, formData) {
    if (Object.prototype.hasOwnProperty.call(formData, "system.dinheiro.valor")) {
      const rawMoney = String(formData["system.dinheiro.valor"] ?? "").trim();
      const usd = twbvRoundMoney(twbvParseMoneyValue(rawMoney));
      formData["system.dinheiro.valor"] = usd;
      formData["system.dinheiro.saldos.USD"] = usd;
    }
    if (!Object.prototype.hasOwnProperty.call(formData, "system.dinheiro.conversaoAtiva")) formData["system.dinheiro.conversaoAtiva"] = false;
    return super._updateObject(event, formData);
  }

  async _onDrop(event) {
    const data = twbvReadDropData(event);
    if (data?.type !== "Item") return super._onDrop(event);
    const payload = await twbvResolveDroppedItemData(data);
    if (!payload) return super._onDrop(event);

    if (payload.type === "pericia") {
      await twbvAddPericiaItemToActor(this.actor, payload);
      return;
    }

    if (twbvIsEquipmentItemType(payload.type)) {
      payload.system.active = payload.system.active ?? true;
      payload.system.equipped = payload.system.equipped ?? false;
    }

    if (payload.type === "armadura") {
      const equipSlot = String(payload.system.equipSlot ?? "").trim();
      payload.system.category = payload.system.category || `armadura${equipSlot ? `:${equipSlot}` : ""}`;
    }

    console.log("[TWBV] Drop de item na ficha.", { actor: this.actor.name, item: payload.name, type: payload.type });
    if (twbvIsDroppedPurchaseType(payload.type)) {
      await twbvOpenDroppedItemAcquireDialog(this.actor, payload, data);
      return;
    }
    await twbvCreateDroppedItemOnActor(this.actor, payload, data);
    return;
  }

  activateListeners(html) {
    super.activateListeners(html);
    this._cleanupLegacyTraitPlaceholders();

    const defenseConditionView = this._defenseConditionView === "conditions" ? "conditions" : "defense";
    html.find(`input[name="twbv-defense-condition-view"][value="${defenseConditionView}"]`).prop("checked", true);
    html.find('input[name="twbv-defense-condition-view"]').on("change", (event) => {
      this._defenseConditionView = String(event.currentTarget?.value ?? "defense") === "conditions" ? "conditions" : "defense";
    });

    html.find('input[name="twbv-equipment-view"]').on("change", (event) => {
      const next = String(event.currentTarget?.value ?? "inventory").trim();
      this._equipmentView = ["inventory", "body", "resources"].includes(next) ? next : "inventory";
    });

    html.find('select[name="system.dinheiro.moeda"]').on("change", (event) => {
      html.find(".twbv-money-value-control b").text("$");
    });

    html.find(".twbv-money-convert").on("click", async (event) => {
      event.preventDefault();
      await twbvApplyMoneyConversion(this.actor, html);
    });

    html.find(".twbv-money-record-gain, .twbv-money-record-expense").on("click", async (event) => {
      event.preventDefault();
      if (event.currentTarget.closest(".twbv-medieval-ledger-form")) return;
      const type = event.currentTarget.classList.contains("twbv-money-record-gain") ? "gain" : "expense";
      await twbvApplyMoneyLedgerEntry(this.actor, html, type);
    });

    html.find(".twbv-money-pix-send").on("click", async (event) => {
      event.preventDefault();
      await twbvApplyMoneyPixTransfer(this.actor, html);
    });

    html.find(".twbv-medieval-convert").on("click", async (event) => {
      event.preventDefault();
      await twbvApplyMedievalMoneyConversion(this.actor, html);
    });

    html.find(".twbv-medieval-rates-save").on("click", async (event) => {
      event.preventDefault();
      await twbvSaveWorldMedievalRates(html);
    });

    html.find(".twbv-medieval-record-gain, .twbv-medieval-record-expense").on("click", async (event) => {
      event.preventDefault();
      const type = event.currentTarget.classList.contains("twbv-medieval-record-gain") ? "gain" : "expense";
      await twbvApplyMedievalMoneyLedgerEntry(this.actor, html, type);
    });

    html.find('input[name="twbv-history-view"]').on("change", (event) => {
      this._historyView = String(event.currentTarget?.value ?? "antecedente") === "album" ? "album" : "antecedente";
    });
    html.find(`input[name="twbv-history-view"][value="${this._historyView === "album" ? "album" : "antecedente"}"]`).prop("checked", true);

    html.find(".twbv-album-add").on("click", async (event) => {
      event.preventDefault();
      const album = twbvReadAlbumFromSheet(html, this.actor);
      album.push({ image: "", nota: "", sectionId: "" });
      this._historyView = "album";
      await this.actor.update({ "system.historia.album": album });
    });

    html.find(".twbv-album-add-section-photo").on("click", async (event) => {
      event.preventDefault();
      const album = twbvReadAlbumFromSheet(html, this.actor);
      album.push({ image: "", nota: "", sectionId: String(event.currentTarget.dataset.sectionId ?? "") });
      this._historyView = "album";
      await this.actor.update({ "system.historia.album": album });
    });

    html.find(".twbv-album-section-add").on("click", async (event) => {
      event.preventDefault();
      const name = await twbvPromptText("Nova divis\u00f3ria do \u00e1lbum", "Nome da divis\u00f3ria", "Cidade de...");
      if (!name) return;
      const sections = twbvReadAlbumSectionsFromActor(this.actor);
      sections.push({ id: twbvCreateAlbumSectionId(), name });
      const album = twbvReadAlbumFromSheet(html, this.actor);
      this._historyView = "album";
      await this.actor.update({ "system.historia.album": album, "system.historia.albumSections": sections });
    });

    html.find(".twbv-album-section-rename").on("click", async (event) => {
      event.preventDefault();
      const sectionId = String(event.currentTarget.dataset.sectionId ?? "");
      const sections = twbvReadAlbumSectionsFromActor(this.actor);
      const section = sections.find((entry) => entry.id === sectionId);
      if (!section) return;
      const name = await twbvPromptText("Renomear divis\u00f3ria", "Nome da divis\u00f3ria", section.name);
      if (!name) return;
      section.name = name;
      const album = twbvReadAlbumFromSheet(html, this.actor);
      this._historyView = "album";
      await this.actor.update({ "system.historia.album": album, "system.historia.albumSections": sections });
    });

    html.find(".twbv-album-section-remove").on("click", async (event) => {
      event.preventDefault();
      const sectionId = String(event.currentTarget.dataset.sectionId ?? "");
      const sections = twbvReadAlbumSectionsFromActor(this.actor).filter((entry) => entry.id !== sectionId);
      const album = twbvReadAlbumFromSheet(html, this.actor).map((photo) => photo.sectionId === sectionId ? { ...photo, sectionId: "" } : photo);
      this._historyView = "album";
      await this.actor.update({ "system.historia.album": album, "system.historia.albumSections": sections });
    });

    html.find(".twbv-album-remove").on("click", async (event) => {
      event.preventDefault();
      const index = Number(event.currentTarget.dataset.index);
      const album = twbvReadAlbumFromSheet(html, this.actor);
      if (!Number.isInteger(index) || index < 0 || index >= album.length) return;
      album.splice(index, 1);
      this._historyView = "album";
      await this.actor.update({ "system.historia.album": album });
    });

    html.find(".twbv-album-pick").on("click", async (event) => {
      event.preventDefault();
      const index = Number(event.currentTarget.dataset.index);
      const album = twbvReadAlbumFromSheet(html, this.actor);
      if (!Number.isInteger(index) || index < 0 || index >= album.length) return;
      new FilePicker({
        type: "image",
        current: await twbvImagePickerCurrentPath(album[index]?.image ?? "", "albuns"),
        callback: async (path) => {
          album[index] = { ...(album[index] ?? {}), image: path };
          this._historyView = "album";
          await this.actor.update({ "system.historia.album": album });
        }
      }).render(true);
    });

    html.find(".twbv-album-card").on("dragstart", (event) => {
      const card = event.currentTarget;
      card.classList.add("is-dragging");
      event.originalEvent?.dataTransfer?.setData("text/twbv-album-photo", String(card.dataset.index ?? ""));
      event.originalEvent?.dataTransfer?.setData("text/plain", String(card.dataset.index ?? ""));
    });

    html.find(".twbv-album-card").on("dragend", (event) => {
      event.currentTarget.classList.remove("is-dragging");
    });

    html.find(".twbv-album-grid").on("dragover", (event) => {
      if (!Array.from(event.originalEvent?.dataTransfer?.types ?? []).includes("text/twbv-album-photo")) return;
      event.preventDefault();
      event.currentTarget.classList.add("is-drop-target");
    });

    html.find(".twbv-album-grid").on("dragleave", (event) => {
      event.currentTarget.classList.remove("is-drop-target");
    });

    html.find(".twbv-album-grid").on("drop", async (event) => {
      const raw = event.originalEvent?.dataTransfer?.getData("text/twbv-album-photo") ?? "";
      const fromIndex = Number(raw);
      if (!Number.isInteger(fromIndex)) return;
      event.preventDefault();
      event.currentTarget.classList.remove("is-drop-target");
      const sectionId = String(event.currentTarget.dataset.sectionDrop ?? "");
      const targetCard = event.target?.closest?.(".twbv-album-card");
      const beforeIndex = targetCard ? Number(targetCard.dataset.index) : null;
      const album = twbvMoveAlbumPhoto(twbvReadAlbumFromSheet(html, this.actor), fromIndex, sectionId, beforeIndex);
      this._historyView = "album";
      await this.actor.update({ "system.historia.album": album });
    });

    html.find(".twbv-album-card").on("contextmenu", async (event) => {
      event.preventDefault();
      const index = Number(event.currentTarget.dataset.index);
      if (!Number.isInteger(index)) return;
      this._historyView = "album";
      await twbvChooseAlbumSectionForPhoto(this.actor, html, index);
    });

    html.find(".twbv-album-chat").on("click", async (event) => {
      event.preventDefault();
      const index = Number(event.currentTarget.dataset.index);
      const album = twbvReadAlbumFromSheet(html, this.actor);
      if (!Number.isInteger(index) || index < 0 || index >= album.length) return;
      const photo = album[index] ?? {};
      if (!photo.image) {
        ui.notifications?.warn("Escolha uma imagem antes de enviar para o chat.");
        return;
      }
      this._historyView = "album";
      await this.actor.update({ "system.historia.album": album });
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `
          <section class="twbv-album-chat-card">
            <header>${escapeHtml(this.actor.name)} - Álbum</header>
            <img src="${escapeHtmlAttr(photo.image)}" alt="Imagem do Álbum" />
            ${photo.nota ? `<p>${escapeHtml(photo.nota)}</p>` : ""}
          </section>`
      });
    });

    html.find(".twbv-condition-adjust").on("click", async (event) => {
      this._defenseConditionView = "conditions";
      const button = event.currentTarget;
      const path = button.dataset.path;
      const adjust = Number(button.dataset.adjust ?? 0);
      const min = Number(button.dataset.min ?? 0);
      const max = Number(button.dataset.max ?? 99);
      const current = Number(foundry.utils.getProperty(this.actor.system, path.replace(/^system\./, "")) ?? 0);
      const next = Math.max(min, Math.min(max, current + adjust));
      await this.actor.update({ [path]: next });
    });

    html.find(".twbv-effect-quick-add").on("click", async (event) => {
      event.preventDefault();
      const panel = event.currentTarget.closest(".twbv-effects-workbench");
      if (!panel) return;
      const targetSelect = panel.querySelector('[name="twbvEffectTarget"]');
      const customInput = panel.querySelector('[name="twbvEffectCustomPath"]');
      const targetValue = String(targetSelect?.value ?? "").trim();
      const key = targetValue === "__custom" ? String(customInput?.value ?? "").trim() : targetValue;
      if (!key) {
        ui.notifications?.warn("Escolha um campo ou informe um caminho customizado para o efeito.");
        return;
      }
      const name = String(panel.querySelector('[name="twbvEffectName"]')?.value ?? "").trim() || twbvGetActiveEffectTargetLabel(this.actor, key);
      const value = String(panel.querySelector('[name="twbvEffectValue"]')?.value ?? "1").trim() || "1";
      const mode = Number(panel.querySelector('[name="twbvEffectMode"]')?.value ?? CONST?.ACTIVE_EFFECT_MODES?.ADD ?? 2);
      const img = String(panel.querySelector('[name="twbvEffectIcon"]')?.value ?? "").trim() || "icons/svg/aura.svg";
      const durationKind = String(panel.querySelector('[name="twbvEffectDuration"]')?.value ?? "permanent");
      const rounds = Math.max(0, Number(panel.querySelector('[name="twbvEffectRounds"]')?.value ?? 0));
      const effectData = {
        name,
        label: name,
        img,
        disabled: false,
        changes: [{ key, mode, value, priority: 20 }],
        duration: durationKind === "temporary" && rounds > 0 ? { rounds } : {},
        description: String(panel.querySelector('[name="twbvEffectDescription"]')?.value ?? "").trim()
      };
      await this.actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
    });

    html.find('[name="twbvEffectTarget"]').on("change", (event) => {
      const panel = event.currentTarget.closest(".twbv-effects-workbench");
      const customWrap = panel?.querySelector(".twbv-effect-custom-path");
      if (customWrap) customWrap.hidden = String(event.currentTarget.value ?? "") !== "__custom";
    });

    const syncEffectTargetChoices = (panel, group = "Atributos") => {
      const select = panel?.querySelector?.('[name="twbvEffectTarget"]');
      const customWrap = panel?.querySelector?.(".twbv-effect-custom-path");
      if (!select) return;
      const customMode = group === "__custom";
      for (const option of Array.from(select.options ?? [])) {
        const optionGroup = option.dataset.effectOptionGroup ?? "";
        option.hidden = customMode ? option.value !== "__custom" : optionGroup !== group;
      }
      const selected = select.selectedOptions?.[0];
      if (!selected || selected.hidden) {
        const firstVisible = Array.from(select.options ?? []).find((option) => !option.hidden);
        if (firstVisible) select.value = firstVisible.value;
        else {
          const customOption = Array.from(select.options ?? []).find((option) => option.value === "__custom");
          if (customOption) {
            customOption.hidden = false;
            select.value = "__custom";
          }
        }
      }
      if (customWrap) customWrap.hidden = select.value !== "__custom" && !customMode;
    };

    html.find(".twbv-effect-kind").on("click", (event) => {
      event.preventDefault();
      const button = event.currentTarget;
      const panel = button.closest(".twbv-effects-workbench");
      const group = String(button.dataset.effectKind ?? "Atributos");
      panel?.querySelectorAll?.(".twbv-effect-kind").forEach((entry) => entry.classList.toggle("is-active", entry === button));
      syncEffectTargetChoices(panel, group);
    });

    syncEffectTargetChoices(html.find(".twbv-effects-workbench")[0], "Atributos");

    html.find('[name="twbvEffectDuration"]').on("change", (event) => {
      const panel = event.currentTarget.closest(".twbv-effects-workbench");
      const roundsWrap = panel?.querySelector(".twbv-effect-rounds");
      if (roundsWrap) roundsWrap.hidden = String(event.currentTarget.value ?? "") !== "temporary";
    });

    html.find(".twbv-effect-icon-pick").on("click", async (event) => {
      event.preventDefault();
      const panel = event.currentTarget.closest(".twbv-effects-workbench");
      const input = panel?.querySelector('[name="twbvEffectIcon"]');
      const preview = panel?.querySelector("[data-effect-icon-preview]");
      new FilePicker({
        type: "image",
        current: await twbvImagePickerCurrentPath(input?.value ?? "", "efeitos-globais"),
        callback: (path) => {
          if (input) input.value = path;
          if (preview) preview.src = path;
        }
      }).render(true);
    });

    html.find('[name="twbvEffectIcon"]').on("input change", (event) => {
      const panel = event.currentTarget.closest(".twbv-effects-workbench");
      const preview = panel?.querySelector("[data-effect-icon-preview]");
      const next = String(event.currentTarget.value ?? "").trim() || "icons/svg/aura.svg";
      if (preview) preview.src = next;
    });

    html.find(".twbv-effect-action").on("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const action = String(event.currentTarget.dataset.action ?? "").trim();
      const id = event.currentTarget.closest("[data-effect-id]")?.dataset.effectId;
      const effect = id ? this.actor.effects.get(id) : null;
      if (!effect) return;
      if (action === "toggle") {
        await effect.update({ disabled: !effect.disabled });
        return;
      }
      if (action === "edit") {
        effect.sheet?.render(true);
        return;
      }
      if (action === "delete") {
        await this.actor.deleteEmbeddedDocuments("ActiveEffect", [effect.id]);
      }
    });

    html.find(".twbv-add-advancement").on("click", async (event) => {
      event.preventDefault();
      await this._onSubmit(event, { preventClose: true, preventRender: true }).catch(() => {});
      await twbvOpenAdvancementDialog(this.actor);
    });

    html.find(".twbv-edit-advancement").on("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      await this._onSubmit(event, { preventClose: true, preventRender: true }).catch(() => {});
      const index = Number(event.currentTarget.dataset.index);
      if (!Number.isInteger(index) || index < 0) return;
      await twbvOpenAdvancementDialog(this.actor, index);
    });

    html.find(".twbv-remove-advancement").on("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const index = Number(event.currentTarget.dataset.index);
      const advances = Array.from(this.actor.system.avancos ?? []);
      advances.splice(index, 1);
      const normalizedAdvances = advances.map((avanco, position) => ({ ...avanco, numero: position + 1 }));
      await this.actor.update({ "system.avancos": normalizedAdvances, "system.avancosTotais": normalizedAdvances.length });
    });

    const triggerEcoSpendEffect = () => {
      const effectNode = html.find(".twbv-eco-core")[0];
      if (!effectNode) return;
      effectNode.classList.remove("eco-spend-effect");
      void effectNode.offsetWidth;
      effectNode.classList.add("eco-spend-effect");
      const cleanup = () => effectNode.classList.remove("eco-spend-effect");
      effectNode.addEventListener("animationend", cleanup, { once: true });
      window.setTimeout(cleanup, 700);
    };

    const updateEcoValue = async (delta, { triggerEffect = false } = {}) => {
      const ecoInput = html.find('input[name="system.eco"]')[0];
      const ecoAtual = Number(this.actor.system.eco ?? 0);
      const novoEco = Math.max(0, ecoAtual + delta);
      if (novoEco === ecoAtual) return;
      if (ecoInput) ecoInput.value = String(novoEco);
      if (triggerEffect && delta < 0) triggerEcoSpendEffect();
      await this.actor.update({ "system.eco": novoEco });
    };

    html.find(".twbv-eco-adjust").on("click", async (event) => {
      const adjust = Number(event.currentTarget.dataset.adjust ?? 0);
      await updateEcoValue(adjust);
    });

    html.find(".twbv-eco-spend-trigger").on("click", async (event) => {
      event.preventDefault();
      if (event.shiftKey) {
        await updateEcoValue(1);
        return;
      }
      if (event.target?.matches?.('input[name="system.eco"]')) return;
      await updateEcoValue(-1, { triggerEffect: true });
    });

    html.find(".twbv-eco-spend-trigger").on("keydown", async (event) => {
      if (event.shiftKey) return;
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      if (event.shiftKey) {
        await updateEcoValue(1);
        return;
      }
      await updateEcoValue(-1, { triggerEffect: true });
    });

    const updateManaValue = async (delta) => {
      const manaInput = html.find('input[name="system.mana.value"]')[0];
      const manaAtual = Number(this.actor.system?.mana?.value ?? 0);
      const novoMana = Math.max(0, manaAtual + delta);
      if (novoMana === manaAtual) return;
      if (manaInput) manaInput.value = String(novoMana);
      await this.actor.update({ "system.mana.value": novoMana });
    };

    html.find(".mana-control").on("click", async (event) => {
      const adjust = Number(event.currentTarget.dataset.adjust ?? 0);
      await updateManaValue(adjust);
    });

    html.find(".twbv-mana-trigger").on("click", async (event) => {
      event.preventDefault();
      if (event.shiftKey) {
        await updateManaValue(1);
        return;
      }
      await updateManaValue(-1);
    });

    html.find(".twbv-mana-trigger").on("keydown", async (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      if (event.shiftKey) {
        await updateManaValue(1);
        return;
      }
      await updateManaValue(-1);
    });

    const openSkillRollDialog = async (event) => {
      const index = Number(event.currentTarget.dataset.index ?? -1);
      const skill = this.actor.system.pericias?.[index];
      if (!skill) return;

      const attributes = [
        { key: "forca", label: "For\u00e7a" },
        { key: "destreza", label: "Destreza" },
        { key: "constituicao", label: "Constitui\u00e7\u00e3o" },
        { key: "inteligencia", label: "Intelig\u00eancia" },
        { key: "influencia", label: "Influ\u00eancia" },
        { key: "intuicao", label: "Intui\u00e7\u00e3o" }
      ];

      const skillAttrKey = String(skill?.atributo ?? "forca").toLowerCase();
      const options = attributes.map((attr) => `<option value="${attr.key}" ${attr.key === skillAttrKey ? "selected" : ""}>${attr.label}</option>`).join("");
      const bonusDieOptions = ['d4','d6','d8','d10','d12'].map((die) => `<option value="${die}">${die}</option>`).join("");
      new Dialog({
        title: `Rolar perícia: ${skill.nome || `Perícia ${index + 1}`}`,
        content: `<div class="twbv-roll-skill-dialog"><label>Atributo<select name="attr">${options}</select></label><div class="twbv-roll-inline"><label>Dado extra<select name="bonusDie"><option value="">Nenhum</option>${bonusDieOptions}</select></label><label>Bônus flat<input type="number" name="manualBonus" value="0" step="1" /></label></div></div>`,
        buttons: {
          accept: {
            label: "Aceitar",
            callback: async (dialogHtml) => {
              const root = resolveDialogRoot(dialogHtml);
              const attrKey = String(root?.querySelector('select[name="attr"]')?.value ?? "forca");
              const attr = attributes.find((a) => a.key === attrKey) ?? attributes[0];
              const attrData = this.actor.system.atributos?.[attr.key] ?? {};
              const attrBonus = Number(attrData.bonus ?? 0);
              const attrDie = normalizeAttributeStep(attrData.passo ?? 4);
              const awakenedDie = resolveAwakenedDie(attrDie);
              const skillDie = SKILL_DICE.includes(Number(skill.dado)) ? Number(skill.dado) : 4;
              const skillBonus = Number(skill.bonus ?? 0);
              const manualBonus = Number(root?.querySelector('input[name="manualBonus"]')?.value ?? 0);
              const ferimentoPenalty = getGlobalRollPenalty(this.actor.system);
              const totalBonus = skillBonus + attrBonus + (Number.isFinite(manualBonus) ? manualBonus : 0);
              const skillIcon = twbvGetSkillIconPath(skill);
              const bonusDetails = [
                ...twbvGetActorSkillBonusDetails(this.actor, index, skillBonus, "Per\u00edcia"),
                ...twbvGetActorAttributeBonusDetails(this.actor, attr.key, attrBonus, attr.label),
                Number.isFinite(manualBonus) && manualBonus ? { label: "Bônus manual", value: manualBonus } : null
              ].filter(Boolean);
              const bonusDieValue = String(root?.querySelector('select[name="bonusDie"]')?.value ?? '').replace('d','');
              const bonusDie = Number(bonusDieValue);
              if (twbvActorUsesAwakenedDie(this.actor)) {
              await renderDualDieResult({
                title: skill.nome || `Perícia ${index + 1}`,
                subtitle: `<span class="twbv-skill-attr twbv-attr-${attr.key}">${attr.label}</span>${bonusDie ? ` &middot; dado extra d${bonusDie}` : ''}${manualBonus ? ` &middot; flat ${manualBonus > 0 ? '+' : ''}${manualBonus}` : ''}${ferimentoPenalty.label ? ` &middot; ${ferimentoPenalty.label}` : ''}`,
                dieA: skillDie,
                labelA: "Perícia",
                dieB: awakenedDie,
                labelB: "Desperto",
                bonusA: totalBonus,
                bonusB: 0,
                finalModifier: ferimentoPenalty.value,
                finalModifierLabel: ferimentoPenalty.label,
                dieDisplayA: buildDieLabel(skillDie, skillBonus),
                dieDisplayB: `d${awakenedDie}`,
                bonusDetailsA: bonusDetails,
                actor: this.actor,
                icon: skillIcon
              });
              } else {
                await renderSingleDieResult({
                  title: skill.nome || `Perícia ${index + 1}`,
                  subtitle: `<span class="twbv-skill-attr twbv-attr-${attr.key}">${attr.label}</span>${bonusDie ? ` &middot; dado extra d${bonusDie}` : ''}${manualBonus ? ` &middot; flat ${manualBonus > 0 ? '+' : ''}${manualBonus}` : ''}${ferimentoPenalty.label ? ` &middot; ${ferimentoPenalty.label}` : ''}`,
                  die: skillDie,
                  label: "Perícia",
                  bonus: totalBonus,
                  finalModifier: ferimentoPenalty.value,
                  finalModifierLabel: ferimentoPenalty.label,
                  dieDisplay: buildDieLabel(skillDie, skillBonus),
                  bonusDetails,
                  actor: this.actor,
                  icon: skillIcon
                });
              }
              if (Number.isFinite(bonusDie) && bonusDie > 0) {
                await twbvCreateFormulaRollChat({ actor: this.actor, formula: `1d${bonusDie}`, title: "Dado extra", label: "Dado Extra" });
              }
            }
          },
          cancel: { label: "Cancelar" }
        },
        default: "accept"
      }).render(true);
    };

    html.find(".twbv-skill-roll").on("click", openSkillRollDialog);

    html.find(".twbv-move-roll").on("click", async () => {
      const atletismo = findSkillByName(this.actor.system, "ATLETISMO");
      const die = SKILL_DICE.includes(Number(atletismo?.dado)) ? Number(atletismo.dado) : 4;
      await twbvCreateFormulaRollChat({
        actor: this.actor,
        formula: `1d${die}`,
        title: `Corrida (${atletismo?.nome || "Atletismo"})`,
        label: "Movimento"
      });
    });

    html.find(".twbv-attr-config").on("click", async (event) => {
      event.preventDefault();
      const labels = {
        forca: "For\u00e7a",
        destreza: "Destreza",
        constituicao: "Constituição",
        inteligencia: "Intelig\u00eancia",
        influencia: "Influência",
        intuicao: "Intui\u00e7\u00e3o"
      };
      const attributeKey = String(event.currentTarget.dataset.attr ?? "");
      const label = labels[attributeKey] ?? attributeKey;
      if (!attributeKey) return;
      await this._onSubmit(event, { preventClose: true, preventRender: true });
      const currentBonus = Number(this.actor.system.atributos?.[attributeKey]?.bonus ?? 0);
      const dialog = new Dialog({
        title: `${label} Adicional`,
        content: `<form class="twbv-attr-config-dialog">
          <label>${label} adicional
            <input type="number" name="bonus" value="${Number.isFinite(currentBonus) ? currentBonus : 0}" step="1" />
          </label>
        </form>`,
        buttons: {
          apply: {
            label: "Salvar",
            callback: async (dialogHtml) => {
              const root = resolveDialogRoot(dialogHtml);
              const value = Number(root?.querySelector('input[name="bonus"]')?.value ?? 0);
              await this.actor.update({ [`system.atributos.${attributeKey}.bonus`]: Number.isFinite(value) ? value : 0 });
            }
          },
          clear: {
            label: "Zerar",
            callback: async () => {
              await this.actor.update({ [`system.atributos.${attributeKey}.bonus`]: 0 });
            }
          }
        },
        default: "apply",
        render: (html) => applyDialogWindowClass(html ?? dialog, "wbtv-attr-config-dialog")
      });
      dialog.render(true);
    });

    html.find(".twbv-attr-roll").on("click", async (event) => {
      const labels = {
        forca: "For\u00e7a",
        destreza: "Destreza",
        constituicao: "Constituição",
        inteligencia: "Intelig\u00eancia",
        influencia: "Influência",
        intuicao: "Intui\u00e7\u00e3o"
      };
      const attributeKey = String(event.currentTarget.dataset.attr ?? "");
      if (!attributeKey) return;
      const attrData = this.actor.system.atributos?.[attributeKey] ?? {};
      const attrDie = normalizeAttributeStep(attrData.passo ?? 4);
      const awakenedDie = resolveAwakenedDie(attrDie);
      const ferimentoPenalty = getGlobalRollPenalty(this.actor.system);
      const totalBonus = Number(attrData.bonus ?? 0);
      const bonusTerm = totalBonus === 0 ? "" : `${totalBonus > 0 ? "+" : ""}${totalBonus}`;
      const bonusDetails = twbvGetActorAttributeBonusDetails(this.actor, attributeKey, totalBonus, labels[attributeKey] ?? "Bônus");

      if (twbvActorUsesAwakenedDie(this.actor)) {
        await renderDualDieResult({
        title: labels[attributeKey] ?? attributeKey,
        subtitle: `<span class="twbv-skill-attr twbv-attr-${attributeKey}">${labels[attributeKey] ?? attributeKey}</span>${bonusTerm ? ` &middot; b\u00f4nus ${bonusTerm}` : ""}${ferimentoPenalty.label ? ` &middot; ${ferimentoPenalty.label}` : ""}`,
        dieA: attrDie,
        labelA: "Atributo",
        dieB: awakenedDie,
        labelB: "Desperto",
        bonus: totalBonus,
        bonusDetailsA: bonusDetails,
        finalModifier: ferimentoPenalty.value,
        finalModifierLabel: ferimentoPenalty.label,
        actor: this.actor
        });
      } else {
        await renderSingleDieResult({
          title: labels[attributeKey] ?? attributeKey,
          subtitle: `<span class="twbv-skill-attr twbv-attr-${attributeKey}">${labels[attributeKey] ?? attributeKey}</span>${bonusTerm ? ` &middot; b\u00f4nus ${bonusTerm}` : ""}${ferimentoPenalty.label ? ` &middot; ${ferimentoPenalty.label}` : ""}`,
          die: attrDie,
          label: "Atributo",
          bonus: totalBonus,
          bonusDetails,
          finalModifier: ferimentoPenalty.value,
          finalModifierLabel: ferimentoPenalty.label,
          actor: this.actor
        });
      }
    });

    html.find(".twbv-add-skill").on("click", async (event) => {
      event.preventDefault();
      await this._onSubmit(event, { preventClose: true, preventRender: true });
      const pericias = foundry.utils.deepClone(this.actor.system.pericias ?? []);
      const draft = { nome: "", atributo: "forca", dado: 4, bonus: 0, descricao: "", locked: false };
      new Dialog({
        title: "Nova Per\u00edcia",
        content: twbvBuildSkillDialogContent(draft, { editable: true }),
        classes: ["wbtv-add-skill-dialog", "wbtv-skill-config-dialog"],
        render: (dialog, html) => {
          const root = resolveDialogRoot(html ?? dialog);
          applyDialogWindowClass(root ?? dialog, "wbtv-add-skill-dialog");
          applyDialogWindowClass(root ?? dialog, "wbtv-skill-config-dialog");
          twbvActivateSkillDialog(root, this.actor, draft);
        },
        buttons: {
          accept: {
            label: "Adicionar",
            callback: async (dialogHtml) => {
              const root = resolveDialogRoot(dialogHtml);
              const skill = twbvReadSkillDialogForm(root, { ...draft, nome: `Per\u00edcia ${pericias.length + 1}` });
              pericias.push(skill);
              await this.actor.update({ "system.pericias": pericias });
            }
          },
          cancel: { label: "Cancelar" }
        },
        default: "accept"
      }).render(true);
    });

    html.find(".twbv-open-skill-compendium").on("click", async (event) => {
      event.preventDefault();
      await this._onSubmit(event, { preventClose: true, preventRender: true });
      await twbvOpenSkillCompendiumBrowser(this.actor);
    });

    html.find(".twbv-open-disadvantage-compendium").on("click", async (event) => {
      event.preventDefault();
      await this._onSubmit(event, { preventClose: true, preventRender: true });
      await twbvOpenDisadvantageCompendiumBrowser(this.actor);
    });

    html.find(".twbv-sort-skills").on("click", async (event) => {
      event.preventDefault();
      await this._onSubmit(event, { preventClose: true, preventRender: true });

      const flagScope = "world-behind-the-veil";
      const isActive = Boolean(this.actor.getFlag(flagScope, "skillSortActive"));
      const currentSkills = foundry.utils.deepClone(this.actor.system.pericias ?? []);

      if (!isActive) {
        const backup = foundry.utils.deepClone(currentSkills);
        const sorted = foundry.utils.deepClone(currentSkills).sort((a, b) => {
          const nameA = String(a?.nome ?? "").trim().toLocaleLowerCase("pt-BR");
          const nameB = String(b?.nome ?? "").trim().toLocaleLowerCase("pt-BR");
          return nameA.localeCompare(nameB, "pt-BR", { sensitivity: "base" });
        });
        await this.actor.update({ "system.pericias": sorted });
        await this.actor.setFlag(flagScope, "skillSortBackup", backup);
        await this.actor.setFlag(flagScope, "skillSortActive", true);
        ui.notifications?.info("Perícias organizadas em ordem alfabética.");
        return;
      }

      const backup = this.actor.getFlag(flagScope, "skillSortBackup");
      if (Array.isArray(backup)) {
        await this.actor.update({ "system.pericias": foundry.utils.deepClone(backup) });
      }
      await this.actor.unsetFlag(flagScope, "skillSortBackup");
      await this.actor.setFlag(flagScope, "skillSortActive", false);
      ui.notifications?.info("Ordem anterior das perícias restaurada.");
    });

    html.find(".twbv-edit-skill-config").on("click", async (event) => {
      event.preventDefault();
      await this._onSubmit(event, { preventClose: true, preventRender: true });

      const index = Number(event.currentTarget.dataset.index ?? -1);
      if (index < 0) return;
      const pericias = foundry.utils.deepClone(this.actor.system.pericias ?? []);
      const pericia = pericias[index];
      if (!pericia) return;

      new Dialog({
        title: `Configurar Per\u00edcia: ${pericia.nome || `Per\u00edcia ${index + 1}`}`,
        content: twbvBuildSkillDialogContent(pericia, { editable: true }),
        classes: ["wbtv-add-skill-dialog", "wbtv-skill-config-dialog"],
        render: (dialog, html) => {
          const root = resolveDialogRoot(html ?? dialog);
          applyDialogWindowClass(root ?? dialog, "wbtv-add-skill-dialog");
          applyDialogWindowClass(root ?? dialog, "wbtv-skill-config-dialog");
          twbvActivateSkillDialog(root, this.actor, pericia);
        },
        buttons: {
          save: {
            label: "Salvar",
            callback: async (dialogHtml) => {
              const root = resolveDialogRoot(dialogHtml);
              pericias[index] = twbvReadSkillDialogForm(root, { ...pericia, nome: pericia.nome || `Per\u00edcia ${index + 1}` });
              await this.actor.update({ "system.pericias": pericias });
            }
          },
          cancel: { label: "Cancelar" }
        },
        default: "save"
      }).render(true);
    });

    html.find(".twbv-remove-skill").on("click", async (event) => {
      event.preventDefault();
      await this._onSubmit(event, { preventClose: true, preventRender: true });

      const index = Number(event.currentTarget.dataset.index ?? -1);
      if (index < 0) return;
      const pericias = foundry.utils.deepClone(this.actor.system.pericias ?? []);
      if (pericias[index]?.locked) return ui.notifications?.warn("Esta perícia está travada.");
      pericias.splice(index, 1);
      await this.actor.update({ "system.pericias": pericias });
    });


    html.find(".twbv-toggle-skill-lock").on("click", async (event) => {
      event.preventDefault();
      const index = Number(event.currentTarget.dataset.index ?? -1);
      if (index < 0) return;
      const pericias = foundry.utils.deepClone(this.actor.system.pericias ?? []);
      if (!pericias[index]) return;
      pericias[index].locked = !Boolean(pericias[index].locked);
      await this.actor.update({ "system.pericias": pericias });
    });

    html.find(".twbv-skill-row").on("dragstart", (event) => {
      const index = Number(event.currentTarget.dataset.index ?? -1);
      event.originalEvent.dataTransfer?.setData("text/plain", String(index));
      event.currentTarget.classList.add("is-dragging");
    });
    html.find(".twbv-skill-row").on("dragend", (event) => {
      event.currentTarget.classList.remove("is-dragging");
    });
    html.find(".twbv-skill-description-chat").on("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const index = Number(event.currentTarget.dataset.index ?? -1);
      const skill = this.actor.system.pericias?.[index];
      if (!skill) return;
      await twbvSendSkillDescriptionToChat(this.actor, skill);
    });
    html.find(".twbv-skill-row").on("dragover", (event) => event.preventDefault());
    html.find(".twbv-skill-row").on("drop", async (event) => {
      event.preventDefault();
      await this._onSubmit(event, { preventClose: true, preventRender: true });
      const fromIndex = Number(event.originalEvent.dataTransfer?.getData("text/plain") ?? -1);
      const toIndex = Number(event.currentTarget.dataset.index ?? -1);
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;

      const pericias = foundry.utils.deepClone(this.actor.system.pericias ?? []);
      const [moved] = pericias.splice(fromIndex, 1);
      if (!moved) return;
      pericias.splice(toIndex, 0, moved);
      await this.actor.update({ "system.pericias": pericias });
    });

    html.find(".twbv-item-create").on("click", async (event) => {
      event.preventDefault();
      const requestedType = String(event.currentTarget.dataset.type ?? "equipamento");
      const type = twbvResolveSupportedItemType(requestedType);
      if (twbvIsTraitItemType(requestedType) || twbvIsTraitItemType(type)) {
        await twbvCreateAndOpenActorTraitItem(this.actor, requestedType);
        return;
      }
      const system = twbvGetDefaultItemSystem(type);
      const displayType = requestedType === "poder" ? "poder" : type;
      if (requestedType === "poder" && type !== "poder") {
        system.itemKind = "poder";
        system.category = system.category || "poder";
        system.categoria = system.categoria || "poder";
      }
      const name = type === "municao" ? "Nova Munição" : `${TWBV_ITEM_TYPES[displayType] ?? "Item"} ${this.actor.items.size + 1}`;
      try {
        await this.actor.createEmbeddedDocuments("Item", [{ type, name, img: twbvGetItemIcon(displayType), system }]);
      } catch (error) {
        console.error("[TWBV] Falha ao criar item customizado na ficha.", { requestedType, resolvedType: type, error });
        ui.notifications?.error(`Falha ao criar ${TWBV_ITEM_TYPES[requestedType] ?? "item"}. Veja o console.`);
      }
    });

    html.find(".twbv-item-edit").on("click", async (event) => {
      event.preventDefault();
      const itemId = String(event.currentTarget.dataset.itemId ?? "");
      const sourceType = String(event.currentTarget.dataset.sourceType ?? "item");
      if (sourceType === "system") {
        const listKey = String(event.currentTarget.dataset.listKey ?? "");
        const type = String(event.currentTarget.dataset.type ?? "vantagem");
        if (!listKey) return;
        const entry = Array.from(this.actor.system?.[listKey] ?? []).find((v) => String(v?.id ?? "") === itemId);
        if (!entry) return;
        const item = await twbvCreateAndOpenActorTraitItem(this.actor, type, entry);
        if (item) {
          const updated = Array.from(this.actor.system?.[listKey] ?? []).filter((v) => String(v?.id ?? "") !== itemId);
          await this.actor.update({ [`system.${listKey}`]: updated });
        }
        return;
      }
      const item = this.actor.items.get(itemId);
      if (!item) return;
      item.sheet?.render(true);
    });

    html.find(".twbv-item-delete").on("click", async (event) => {
      event.preventDefault();
      await this._deleteItemFromSheetButton(event.currentTarget);
    });

    html.find(".twbv-trait-division-create").on("click", this._onVantagemDivisionCreate.bind(this));
    html.find(".twbv-trait-division-delete").on("click", this._onVantagemDivisionDelete.bind(this));
    html.find(".twbv-trait-division, .twbv-item-card-list--division").on("dragover", (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.classList.add("is-drop-target");
    });
    html.find(".twbv-trait-division, .twbv-item-card-list--division").on("dragleave", (event) => {
      event.stopPropagation();
      event.currentTarget.classList.remove("is-drop-target");
    });
    html.find(".twbv-trait-division, .twbv-item-card-list--division").on("drop", this._onVantagemDivisionDrop.bind(this));
    html.find(".twbv-trait-section .twbv-item-card-icon").on("click", this._onTraitCardIconChat.bind(this));

    html.find(".twbv-item-card-head--toggle").on("click", (event) => {
      if (event.target.closest(".twbv-item-card-actions")) return;
      event.currentTarget.closest(".twbv-item-card--collapsible")?.classList.toggle("is-collapsed");
    });

    html.find(".item-create").off("click.twbv-create").on("click.twbv-create", this._onItemCreate.bind(this));
    html.find(".item[data-item-id], .twbv-item-card[data-item-id]").attr("draggable", "true").off("dragstart.twbv-item").on("dragstart.twbv-item", (event) => {
      const itemId = String(event.currentTarget.dataset.itemId ?? "");
      const item = this.actor.items.get(itemId);
      if (!item) return;
      twbvSetItemDragData(event, item);
      event.currentTarget.classList.add("is-dragging");
    }).off("dragend.twbv-item").on("dragend.twbv-item", (event) => {
      event.currentTarget.classList.remove("is-dragging");
    });
    html.find(".equipment-img").off("click.twbv-img").on("click.twbv-img", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const item = this.actor.items.get(event.currentTarget.closest(".item")?.dataset.itemId);
      if (item) await twbvOpenItemImagePicker(item);
    }).off("dragstart.twbv-img").on("dragstart.twbv-img", (event) => {
      const item = this.actor.items.get(event.currentTarget.closest(".item")?.dataset.itemId);
      twbvSetItemDragData(event, item);
      event.stopPropagation();
      event.stopImmediatePropagation();
    });
    const root = html?.[0] ?? html;
    if (root && !root._twbvTraitDeleteDelegated) {
      root.addEventListener("click", async (event) => {
        const button = event.target?.closest?.(".twbv-item-delete");
        if (!button || !root.contains(button)) return;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
        await this._deleteItemFromSheetButton(button);
      }, true);
      root._twbvTraitDeleteDelegated = true;
    }
    if (root && !root._twbvEquipmentIconDelegated) {
      root.addEventListener("dragstart", (event) => {
        const img = event.target?.closest?.(".equipment-img");
        if (!img || !root.contains(img)) return;
        const item = this.actor.items.get(img.closest(".item")?.dataset.itemId);
        twbvSetItemDragData(event, item);
        event.stopPropagation();
        event.stopImmediatePropagation?.();
      }, true);
      root.addEventListener("click", async (event) => {
        const img = event.target?.closest?.(".equipment-img");
        if (!img || !root.contains(img)) return;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        const item = this.actor.items.get(img.closest(".item")?.dataset.itemId);
        if (item) await twbvOpenItemImagePicker(item);
      }, true);
      root._twbvEquipmentIconDelegated = true;
    }
    if (root && !root._twbvCreateDelegated) {
      root.addEventListener("click", (event) => {
        if (event.defaultPrevented) return;
        const button = event.target?.closest?.(".item-create");
        if (!button || !root.contains(button)) return;
        event.preventDefault();
        this._onItemCreate({ preventDefault: () => {}, currentTarget: button });
      });
      root._twbvCreateDelegated = true;
    }
    html.find(".item-edit").on("click", (e)=>{e.preventDefault(); const i=this.actor.items.get(e.currentTarget.closest(".item")?.dataset.itemId); if(i) i.sheet.render(true);});
    html.find(".item-delete").on("click", async (e)=>{e.preventDefault(); const id=e.currentTarget.closest(".item")?.dataset.itemId; if(id) await this.actor.deleteEmbeddedDocuments("Item",[id]);});
    html.find(".item-donate").on("click", async (event) => {
      event.preventDefault();
      const item = this.actor.items.get(event.currentTarget.closest(".item")?.dataset.itemId);
      if (item) await twbvOpenItemDonationDialog(this.actor, item);
    });
    html.find(".item-sell").on("click", async (event) => {
      event.preventDefault();
      const item = this.actor.items.get(event.currentTarget.closest(".item")?.dataset.itemId);
      if (item) await twbvOpenItemSaleDialog(this.actor, item);
    });
    html.find(".item-toggle-favorite").on("click", this._onToggleFavorite.bind(this));
    html.find(".twbv-open-floating-favorites").on("click", (event) => {
      event.preventDefault();
      twbvRenderGlobalFavorites(this.actor, { toggle: true });
    });
    html.find(".weapon-roll").on("click", this._onWeaponRoll.bind(this));
    html.find(".weapon-damage").on("click", this._onWeaponDamage.bind(this));
    html.find(".weapon-mod").on("click", this._onWeaponMod.bind(this));
    html.find(".weapon-reload").on("click", this._onWeaponReload.bind(this));
    html.find(".ammo-load-carrier").on("click", async (event) => {
      event.preventDefault();
      const item = this.actor.items.get(event.currentTarget.closest(".item")?.dataset.itemId);
      if (item) await twbvOpenCarrierLoadPicker(this.actor, item);
    });
    html.find(".consumable-use").on("click", this._onConsumableUse.bind(this));
    html.find(".item-toggle-equip").on("click", this._onToggleEquip.bind(this));
    html.find(".twbv-body-slot-unequip").on("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const item = this.actor.items.get(String(event.currentTarget.dataset.itemId ?? ""));
      if (item) await item.update({"system.equipped": false, "system.equipStatus": 0});
    });
    html.find(".twbv-body-line-create").on("click", this._onBodyLineCreate.bind(this));
    html.find(".twbv-body-line-reset").on("click", this._onBodyLineReset.bind(this));
    html.find(".twbv-body-custom-line").on("pointerdown", this._onBodyLineMoveStart.bind(this));
    html.find(".twbv-body-line-end").on("pointerdown", this._onBodyLineResizeStart.bind(this));
    html.find(".twbv-body-line-delete").on("click", this._onBodyLineDelete.bind(this));
    html.find(".twbv-body-slot-handle").on("pointerdown", this._onBodySlotMoveStart.bind(this));
    html.find(".twbv-equip-slot, .twbv-body-slot").on("dragover", (event) => event.preventDefault());
    html.find(".twbv-equip-slot, .twbv-body-slot").on("drop", this._onEquipmentSlotDrop.bind(this));

    html.find(".twbv-item-toggle-active, .twbv-item-toggle-equipped").on("change", async (event) => {
      const itemId = String(event.currentTarget.dataset.itemId ?? "");
      const field = String(event.currentTarget.dataset.field ?? "active");
      const value = Boolean(event.currentTarget.checked);
      const item = this.actor.items.get(itemId);
      if (!item) return;

      await item.update({ [`system.${field}`]: value });

      const itemActive = field === "active" ? value : Boolean(item.system?.active);
      const itemEquipped = field === "equipped" ? value : Boolean(item.system?.equipped);
      const needsEquip = ["equipamento", "arma", "armadura"].includes(item.type);
      const enableEffects = itemActive && (!needsEquip || itemEquipped);

      for (const effect of item.effects) {
        if (effect.disabled !== !enableEffects) {
          await effect.update({ disabled: !enableEffects });
        }
      }
    });
  }



  _buildWeaponDefaults() { return {description:"",notes:"",source:"",swid:"arma",quantity:1,weight:0,cost:0,equippable:true,equipStatus:1,favorite:false,category:"",skill:"",damage:"",damageRaise:"1d6",range:"",rangeType:1,rof:1,ap:0,parry:0,minStr:"",shots:0,currentShots:0,ammo:"",reloadType:"magazine",isHeavyWeapon:false,mods:0,equipSlot:"",handMode:"main",equippedHand:"main",actions:{trait:"Atirar",traitMod:"",dmgMod:"",additional:{}},bonusDamageDie:6,bonusDamageDice:1,templates:{cone:false,stream:false,small:false,medium:false,large:false,scone:false}}; }
  _buildConsumableDefaults() { return {description:"",notes:"",source:"",swid:"consumivel",quantity:1,weight:0,cost:0,equippable:false,equipStatus:1,favorite:false,category:"",subtype:"regular",charges:{hasCharges:false,charges:{main:{id:"main",value:1,max:1,sort:0,name:"Cargas",rechargeType:"finite"}}},messageOnUse:true,destroyOnEmpty:false}; }
  async _onToggleFavorite(event){event.preventDefault(); const item=this.actor.items.get(event.currentTarget.closest('.item')?.dataset.itemId); if(item) await item.update({'system.favorite': !item.system.favorite});}
  async _onWeaponDamage(event){event.preventDefault(); const item=this.actor.items.get(event.currentTarget.closest('.item')?.dataset.itemId); if(!item) return; await twbvCreateFormulaRollChat({actor:this.actor, formula:applyVeuToFormula(item.system.damage||'1d4'), title:`Dano - ${item.name}`, label:"Dano"});}
  async _onWeaponRoll(event){event.preventDefault(); const item=this.actor.items.get(event.currentTarget.closest('.item')?.dataset.itemId); if(!item) return; const c=Number(item.system.currentShots??0),max=Number(item.system.shots??0); if(max>0&&c<=0) return ui.notifications.warn(`${item.name} está sem munição.`); if(max>0) await item.update({'system.currentShots':Math.max(c-1,0)}); ChatMessage.create({speaker:ChatMessage.getSpeaker({actor:this.actor}),content:`<p><strong>${item.name}</strong> atacou. Munição: ${Math.max(c-1,0)}/${max}</p>`});}
  async _onWeaponMod(event){event.preventDefault(); const row=event.currentTarget.closest('.item'); const item=this.actor.items.get(row?.dataset.itemId); const key=event.currentTarget.dataset.modKey; const mod=item?.system?.actions?.additional?.[key]; if(!item||!mod) return; const c=Number(item.system.currentShots??0), cost=Number(mod.resourcesUsed??0); if(cost>c) return ui.notifications.warn(`${item.name} não tem munição suficiente para usar ${mod.name}.`); if(cost>0) await item.update({'system.currentShots':Math.max(c-cost,0)}); if(mod.type==='damage'){await twbvCreateFormulaRollChat({actor:this.actor, formula:applyVeuToFormula(`${item.system.damage||'1d4'}${mod.modifier||''}`), title:`Dano - ${item.name} - ${mod.name}`, label:"Dano"});} else ChatMessage.create({speaker:ChatMessage.getSpeaker({actor:this.actor}),content:`<p>${item.name} usou ${mod.name}.</p>`});}
  async _onWeaponReload(event){event.preventDefault(); const weapon=this.actor.items.get(event.currentTarget.closest('.item')?.dataset.itemId); if(!weapon) return; const ammoName=weapon.system.ammo; const max=Number(weapon.system.shots??0), cur=Number(weapon.system.currentShots??0); const mag=this.actor.items.find(i=>i.type==='consumable'&&i.name===ammoName&&i.system.subtype==='magazine'); if(!mag) return ui.notifications.warn(`Nenhum carregador compat?vel encontrado: ${ammoName}`); const k=Object.keys(mag.system.charges?.charges??{})[0]; const ch=mag.system.charges?.charges?.[k]; const avail=Number(ch?.value??0); const load=Math.min(max-cur,avail); if(load<=0) return; await weapon.update({'system.currentShots':cur+load}); await mag.update({[`system.charges.charges.${k}.value`]: avail-load});}
  async _onConsumableUse(event){event.preventDefault(); const item=this.actor.items.get(event.currentTarget.closest('.item')?.dataset.itemId); if(!item) return; const k=Object.keys(item.system.charges?.charges??{})[0]; const ch=item.system.charges?.charges?.[k]; if(item.system.charges?.hasCharges&&(!ch||ch.value<=0)) return ui.notifications.warn(`${item.name} não possui cargas restantes.`); if(item.system.charges?.hasCharges) await item.update({[`system.charges.charges.${k}.value`]: ch.value-1}); ChatMessage.create({speaker:ChatMessage.getSpeaker({actor:this.actor}),content:`<p>${this.actor.name} usou <strong>${item.name}</strong>.</p>`});}

  async _onWeaponDamage(event){
    event.preventDefault();
    const item=this.actor.items.get(event.currentTarget.closest('.item')?.dataset.itemId);
    if(!item) return;
    const damageMods = twbvGetWeaponMods(item).filter((mod)=>String(mod.damage ?? "").trim());
    await twbvRenderWeaponDamageRoll(this.actor, item, damageMods);
  }

  async _onWeaponRoll(event){
    event.preventDefault();
    const item=this.actor.items.get(event.currentTarget.closest('.item')?.dataset.itemId);
    if(!item) return;
    await twbvRollWeaponAttack(this.actor, item);
  }

  async _onWeaponMod(event){
    event.preventDefault();
    const row=event.currentTarget.closest('.item');
    const item=this.actor.items.get(row?.dataset.itemId);
    const key=event.currentTarget.dataset.modKey;
    const mod=item?.system?.actions?.additional?.[key];
    if(!item||!mod) return;
    const c=Number(item.system.currentShots??0), cost=Number(mod.resourcesUsed??0);
    if(cost>c) return ui.notifications.warn(`${item.name} não tem munição suficiente para usar ${mod.name}.`);
    if(cost>0) await item.update({'system.currentShots':Math.max(c-cost,0)});
    if(mod.type==='damage'){
      const damagePart=String(mod.damage ?? mod.modifier ?? "").trim();
      await twbvRenderWeaponDamageRoll(this.actor, item, [{ ...mod, damage: damagePart }]);
      return;
    }
    const modifier=String(mod.modifier ?? "").trim();
    ChatMessage.create({speaker:ChatMessage.getSpeaker({actor:this.actor}),content:`<p>${item.name} usou <strong>${mod.name}</strong>${modifier ? ` (${modifier} para acertar)` : ""}.</p>`});
  }

  async _onWeaponReload(event){
    event.preventDefault();
    const weapon=this.actor.items.get(event.currentTarget.closest('.item')?.dataset.itemId);
    if(!weapon) return;
    await twbvOpenWeaponAmmoPicker(this.actor, weapon);
  }

  async _onItemCreate(event){
    event.preventDefault();
    const requestedType = String(event.currentTarget.dataset.type ?? "equipamento");
    const resolvedType = twbvResolveSupportedItemType(requestedType);
    const nextSystem = ["arma", "weapon"].includes(resolvedType)
      ? this._buildWeaponDefaults()
      : resolvedType === "consumable"
        ? this._buildConsumableDefaults()
        : twbvGetDefaultItemSystem(resolvedType);
    try {
      await twbvCreateActorItem(this.actor, requestedType, nextSystem);
    } catch (error) {
      console.error("[TWBV] Falha ao criar item na ficha.", { requestedType, resolvedType, error });
      ui.notifications?.error(`Falha ao criar ${TWBV_ITEM_TYPES[requestedType] ?? "item"}. Veja o console.`);
    }
    return;
    const type = twbvResolveSupportedItemType(requestedType);
    const isWeapon = ["arma", "weapon"].includes(type);
    const isConsumable = type === "consumable";
    const name = isWeapon ? "Nova Arma" : isConsumable ? "Novo Consumível" : "Novo Equipamento";
    const system = isWeapon ? this._buildWeaponDefaults() : isConsumable ? this._buildConsumableDefaults() : {};
    try {
      await this.actor.createEmbeddedDocuments("Item", [{ name, type, system }]);
    } catch (error) {
      console.error("[TWBV] Falha ao criar item na ficha.", { requestedType, resolvedType: type, error });
      ui.notifications?.error(`Falha ao criar ${TWBV_ITEM_TYPES[requestedType] ?? "item"}. Veja o console.`);
    }
  }
  async _onToggleEquip(event){
    event.preventDefault();
    const item=this.actor.items.get(event.currentTarget.closest('.item')?.dataset.itemId);
    if(!item) return;
    const isEquipped=Boolean(item.system?.equipped ?? Number(item.system?.equipStatus ?? 0)===1);
    const nextEquipped = !isEquipped;
    const update={'system.equipped': nextEquipped,'system.equipStatus': nextEquipped ? 1 : 0};
    if (nextEquipped) {
      if (["arma", "weapon"].includes(item.type)) {
        const hand = await twbvChooseWeaponHand(item);
        if (!hand) return;
        update["system.handMode"] = hand;
        update["system.equippedHand"] = hand;
        await twbvUnequipWeaponOccupants(this.actor, item, hand);
      }
      const bodySlot = twbvGetBodySlotKey(item);
      const targetSlots = ["arma", "weapon"].includes(item.type)
        ? twbvGetWeaponBodySlots({ type: item.type, system: { ...item.system, equippedHand: update["system.equippedHand"] ?? item.system?.equippedHand } })
        : [bodySlot];
      if (item.type === "armadura") update["system.equipSlot"] = bodySlot || "chest";
      for (const bodySlot of targetSlots) {
        if (!bodySlot) continue;
        if (["arma", "weapon"].includes(item.type)) continue;
        const occupying = this.actor.items.find((candidate) =>
          candidate.id !== item.id &&
          Boolean(candidate.system?.equipped ?? Number(candidate.system?.equipStatus ?? 0) === 1) &&
          (["arma", "weapon"].includes(candidate.type) ? twbvGetWeaponBodySlots(candidate).includes(bodySlot) : twbvGetBodySlotKey(candidate) === bodySlot)
        );
        if (occupying) await occupying.update({"system.equipped": false, "system.equipStatus": 0});
      }
    }
    await item.update(update);
  }

  async _chooseWeaponEquipHand(item) {
    return twbvChooseWeaponHand(item);
  }

  _onBodySlotMoveStart(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const slot = event.currentTarget.closest(".twbv-body-slot");
    const map = event.currentTarget.closest(".twbv-body-map");
    const slotKey = String(slot?.dataset.slotKey ?? "").trim();
    if (!slot || !map || !slotKey) return;

    const mapRect = map.getBoundingClientRect();
    const slotRect = slot.getBoundingClientRect();
    const offsetX = event.clientX - slotRect.left;
    const offsetY = event.clientY - slotRect.top;

    const move = (moveEvent) => {
      const left = Math.clamp(((moveEvent.clientX - mapRect.left - offsetX) / mapRect.width) * 100, 0, 92);
      const top = Math.clamp(((moveEvent.clientY - mapRect.top - offsetY) / mapRect.height) * 100, 0, 92);
      slot.style.left = `${left}%`;
      slot.style.top = `${top}%`;
      slot.style.right = "auto";
      slot.dataset.nextLeft = String(Math.round(left * 10) / 10);
      slot.dataset.nextTop = String(Math.round(top * 10) / 10);
    };

    const done = async () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", done);
      const left = Number(slot.dataset.nextLeft);
      const top = Number(slot.dataset.nextTop);
      if (!Number.isFinite(left) || !Number.isFinite(top)) return;
      const current = twbvNormalizeBodySlotPositions(this.actor.getFlag("world-behind-the-veil", "bodySlotPositions"));
      current[slotKey] = { left, top };
      await twbvSetBodySlotPositions(this.actor, current);
    };

    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", done, { once: true });
  }

  async _onBodyLineCreate(event) {
    event.preventDefault();
    const saved = this.actor.getFlag("world-behind-the-veil", "bodyMapLines");
    const lines = twbvNormalizeBodyLines(saved);
    lines.push({ key: foundry.utils.randomID(), left: 42, top: 42, width: 18, angle: 0 });
    await twbvSetBodyLines(this.actor, lines);
  }

  async _onBodyLineReset(event) {
    event.preventDefault();
    await twbvSetBodyLines(this.actor, TWBV_DEFAULT_BODY_LINES);
  }

  async _onBodyLineDelete(event) {
    event.preventDefault();
    event.stopPropagation();
    const id = String(event.currentTarget.closest(".twbv-body-custom-line")?.dataset.lineId ?? "");
    if (!id) return;
    const saved = this.actor.getFlag("world-behind-the-veil", "bodyMapLines");
    const lines = twbvNormalizeBodyLines(saved)
      .filter((line) => String(line?.key ?? "") !== id);
    await twbvSetBodyLines(this.actor, lines);
  }

  _updateBodyLine(lineId, patch) {
    const saved = this.actor.getFlag("world-behind-the-veil", "bodyMapLines");
    const lines = twbvNormalizeBodyLines(saved);
    const index = lines.findIndex((line) => String(line?.key ?? "") === lineId);
    if (index === -1) return null;
    lines[index] = { ...lines[index], ...patch };
    return lines;
  }

  _onBodyLineMoveStart(event) {
    if (event.target?.closest?.(".twbv-body-line-end, .twbv-body-line-delete")) return;
    event.preventDefault();
    event.stopPropagation();
    const line = event.currentTarget.closest(".twbv-body-custom-line");
    const map = event.currentTarget.closest(".twbv-body-map");
    const lineId = String(line?.dataset.lineId ?? "");
    if (!line || !map || !lineId) return;

    const mapRect = map.getBoundingClientRect();
    const lineRect = line.getBoundingClientRect();
    const offsetX = event.clientX - lineRect.left;
    const offsetY = event.clientY - lineRect.top;
    let next = null;

    const move = (moveEvent) => {
      const left = Math.clamp(((moveEvent.clientX - mapRect.left - offsetX) / mapRect.width) * 100, 0, 98);
      const top = Math.clamp(((moveEvent.clientY - mapRect.top - offsetY) / mapRect.height) * 100, 0, 98);
      line.style.left = `${left}%`;
      line.style.top = `${top}%`;
      next = { left: Math.round(left * 10) / 10, top: Math.round(top * 10) / 10 };
    };

    const done = async () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", done);
      if (!next) return;
      const lines = this._updateBodyLine(lineId, next);
      if (lines) await twbvSetBodyLines(this.actor, lines);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", done, { once: true });
  }

  _onBodyLineResizeStart(event) {
    event.preventDefault();
    event.stopPropagation();
    const line = event.currentTarget.closest(".twbv-body-custom-line");
    const map = event.currentTarget.closest(".twbv-body-map");
    const lineId = String(line?.dataset.lineId ?? "");
    if (!line || !map || !lineId) return;

    const mapRect = map.getBoundingClientRect();
    let next = null;

    const move = (moveEvent) => {
      const originX = line.offsetLeft;
      const originY = line.offsetTop;
      const pointerX = moveEvent.clientX - mapRect.left;
      const pointerY = moveEvent.clientY - mapRect.top;
      const dx = pointerX - originX;
      const dy = pointerY - originY;
      const widthPx = Math.max(18, Math.sqrt((dx * dx) + (dy * dy)));
      const width = Math.clamp((widthPx / mapRect.width) * 100, 3, 80);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      line.style.width = `${width}%`;
      line.style.transform = `rotate(${angle}deg)`;
      next = { width: Math.round(width * 10) / 10, angle: Math.round(angle * 10) / 10 };
    };

    const done = async () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", done);
      if (!next) return;
      const lines = this._updateBodyLine(lineId, next);
      if (lines) await twbvSetBodyLines(this.actor, lines);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", done, { once: true });
  }

  async _onEquipmentSlotDrop(event){
    event.preventDefault();
    const slotEl = event.currentTarget;
    const slotKey = String(slotEl?.dataset.slotKey ?? "").trim();
    if (!slotKey) return;
    const slotDef = twbvGetSlotDefinition(slotKey);
    if (!slotDef) return;
    const data = twbvReadDropData(event);
    if (data?.type !== "Item") return;

    const dropped = await Item.implementation.fromDropData(data);
    if (!dropped) return;
    let actorItem = dropped.parent === this.actor ? this.actor.items.get(dropped.id) : null;

    if (!actorItem) {
      const payload = await twbvResolveDroppedItemData(data);
      if (!payload) return;
      if (!twbvCanSlotAcceptItem(slotDef, payload.type)) return ui.notifications?.warn(`Slot ${slotDef.label} não aceita ${TWBV_ITEM_TYPES[payload.type] ?? payload.type}.`);
      if (payload.type === "armadura" || ["arma", "weapon"].includes(payload.type)) payload.system.equipSlot = slotKey;
      if (["arma", "weapon"].includes(payload.type)) {
        payload.system.equipSlot = String(payload.system.equipSlot ?? "").match(/weapon(Main|Off)/) ? "" : payload.system.equipSlot;
        payload.system.handMode = slotKey === "weaponOff" ? "off" : "main";
        payload.system.equippedHand = payload.system.handMode;
      }
      payload.system.equipped = true;
      payload.system.equipStatus = 1;
      const created = await this.actor.createEmbeddedDocuments("Item", [payload]);
      actorItem = created?.[0] ?? null;
      await twbvSendDroppedItemToActorChat(this.actor, actorItem, data);
      console.log("[TWBV] Item dropado e equipado em slot.", { actor: this.actor.name, item: actorItem?.name, slot: slotKey });
      return;
    }

    if (!twbvCanSlotAcceptItem(slotDef, actorItem.type)) return ui.notifications?.warn(`Slot ${slotDef.label} não aceita ${TWBV_ITEM_TYPES[actorItem.type] ?? actorItem.type}.`);
    const occupying = this.actor.items.find((candidate) =>
      candidate.id !== actorItem.id &&
      Boolean(candidate.system?.equipped ?? Number(candidate.system?.equipStatus ?? 0) === 1) &&
      twbvGetBodySlotKey(candidate) === slotKey
    );
    if (occupying) await occupying.update({"system.equipped": false, "system.equipStatus": 0});
    const update = {"system.equipped": true, "system.equipStatus": 1};
    if (actorItem.type === "armadura" || ["arma", "weapon"].includes(actorItem.type)) update["system.equipSlot"] = slotKey;
    if (["arma", "weapon"].includes(actorItem.type)) {
      update["system.equipSlot"] = String(actorItem.system?.equipSlot ?? "").match(/weapon(Main|Off)/) ? "" : String(actorItem.system?.equipSlot ?? "");
      update["system.handMode"] = slotKey === "weaponOff" ? "off" : "main";
      update["system.equippedHand"] = update["system.handMode"];
    }
    await actorItem.update(update);
    console.log("[TWBV] Item equipado em slot.", { actor: this.actor.name, item: actorItem.name, slot: slotKey });
  }

  _buildCustomItemDialogContent(type, itemData = {}, options = {}) {
    const dialogVersion = String(options.dialogVersion ?? "");
    const isV2 = dialogVersion === "2";
    if (["vantagem", "desvantagem", "habilidadeEspecial"].includes(type)) {
      const effects = Array.isArray(itemData.effects) ? itemData.effects : [];
      const effectsMarkup = effects.length
        ? effects.map((effect, index) => `<div class="twbv-effect-row"><input type="text" name="effect-${index}" value="${effect}" /><button type="button" class="twbv-effect-remove" data-index="${index}"><i class="fas fa-trash"></i></button></div>`).join("")
        : `<p class="twbv-tab-empty">Nenhum efeito ativo cadastrado.</p>`;
      return `
      <form class="twbv-custom-item-form twbv-custom-item-form--sheetlike" data-type="${type}">
        <div class="twbv-custom-item-side"></div>
        <div class="twbv-custom-item-main">
          <div class="twbv-custom-item-title-wrap"><input type="text" class="twbv-custom-item-title-input" name="name" value="${itemData.name ?? ""}" placeholder="${type === "desvantagem" ? "Nome da desvantagem" : "Nome da vantagem"}" autofocus /></div>
          <div class="twbv-custom-item-grid2 twbv-custom-item-grid2--header">
            <div class="form-group"><label>Pré Requisito</label><input type="text" name="requirements" value="${itemData.requisitos ?? itemData.requirements ?? ""}" /></div>
            <div class="form-group"><label>Categoria</label><input type="text" name="category" value="${itemData.categoria ?? itemData.category ?? ""}" /></div>
          </div>
          <div class="twbv-custom-item-grid2 twbv-custom-item-grid2--header">
            <div class="form-group"><label>Fonte</label><input type="text" name="source" value="${itemData.fonte ?? itemData.source ?? ""}" /></div>
            <input type="hidden" name="icon" value="" />
          </div>
          <nav class="twbv-custom-tabs twbv-custom-tabs--sheet">
            <button type="button" class="twbv-tab-button is-active" data-tab="destaque">Destaque</button>
            <button type="button" class="twbv-tab-button" data-tab="propriedades">Propriedades</button>
            <button type="button" class="twbv-tab-button" data-tab="efeito">Efeito</button>
          </nav>
          <section class="twbv-custom-tab-pane is-active" data-tab="destaque">
            <div class="form-group"><label>Resumo / Destaque</label><textarea name="description" rows="7" placeholder="Descreva a vantagem/habilidade...">${itemData.descricao ?? itemData.description ?? ""}</textarea></div>
            <div class="twbv-property-checkboxes">
              <label><input type="checkbox" name="favorite" ${itemData.favorite ? "checked" : ""} /> Destacar na ficha</label>
            </div>
          </section>
          <section class="twbv-custom-tab-pane" data-tab="propriedades">
            <div class="twbv-custom-properties-panel">
              <label>Cargas</label>
              <input type="text" name="charges" value="${itemData.cargas ?? itemData.charges ?? ""}" placeholder="Ex.: 3, 10, Ilimitado" />
            </div>
          </section>
          <section class="twbv-custom-tab-pane" data-tab="efeito">
            <button type="button" class="twbv-effect-add"><i class="fas fa-plus"></i> Adicionar Efeitos</button>
            <div class="twbv-effects-list">${effectsMarkup}</div>
          </section>
        </div>
      </form>`;
    }

    const fieldsByType = {
      vantagem: `
        <div class="form-group"><label>Pré Requisito</label><input type="text" name="requirements" value="${itemData.requisitos ?? itemData.requirements ?? ""}" /></div>
        <div class="form-group"><label>Categoria</label><input type="text" name="category" value="${itemData.categoria ?? itemData.category ?? ""}" /></div>`,
      desvantagem: `
        <div class="form-group"><label>Pré Requisito</label><input type="text" name="requirements" value="${itemData.requisitos ?? itemData.requirements ?? ""}" /></div>
        <div class="form-group"><label>Categoria</label><input type="text" name="category" value="${itemData.categoria ?? itemData.category ?? ""}" /></div>`,
      habilidadeEspecial: `
        <div class="form-group"><label>Pré Requisito</label><input type="text" name="requirements" value="${itemData.requisitos ?? itemData.requirements ?? ""}" /></div>
        <div class="form-group"><label>Categoria</label><input type="text" name="category" value="${itemData.categoria ?? itemData.category ?? ""}" /></div>`
    };
    const propertiesField = ["vantagem", "desvantagem"].includes(type) ? `
      <div class="twbv-property-checkboxes">
        <label><input type="checkbox" name="isArcaneBackground" ${itemData.isArcaneBackground ? "checked" : ""} /> Antecedente Arcano</label>
        <label><input type="checkbox" name="hasCharges" ${itemData.hasCharges ? "checked" : ""} /> Possui Cargas</label>
      </div>` : `<p class="twbv-tab-empty">Sem propriedades adicionais para este tipo.</p>`;
    const effects = Array.isArray(itemData.effects) ? itemData.effects : [];
    const effectsMarkup = effects.length
      ? effects.map((effect, index) => `<div class="twbv-effect-row"><input type="text" name="effect-${index}" value="${effect}" /><button type="button" class="twbv-effect-remove" data-index="${index}"><i class="fas fa-trash"></i></button></div>`).join("")
      : `<p class="twbv-tab-empty">Nenhum efeito ativo cadastrado.</p>`;
    return `
      <form class="twbv-custom-item-form" data-type="${type}">
        <nav class="twbv-custom-tabs">
          <button type="button" class="twbv-tab-button is-active" data-tab="descricao">Descri\u00e7\u00e3o</button>
          <button type="button" class="twbv-tab-button" data-tab="propriedades">Propriedades</button>
          <button type="button" class="twbv-tab-button" data-tab="efeitos">Efeitos</button>
        </nav>
        <section class="twbv-custom-tab-pane is-active" data-tab="descricao">
          <div class="form-group"><label>Nome da P?ricia</label><input type="text" name="name" value="${itemData.name ?? ""}" autofocus /></div>
          ${fieldsByType[type] ?? ""}
          <div class="form-group"><label>Descri\u00e7\u00e3o</label><textarea name="description" rows="5">${itemData.descricao ?? itemData.description ?? ""}</textarea></div>
        </section>
        <section class="twbv-custom-tab-pane" data-tab="propriedades">${propertiesField}</section>
        <section class="twbv-custom-tab-pane" data-tab="efeitos">
          <button type="button" class="twbv-effect-add"><i class="fas fa-plus"></i> Adicionar Efeitos</button>
          <div class="twbv-effects-list">${effectsMarkup}</div>
        </section>
      </form>`;
  }

  _bindCustomDialogUi(root) {
    const tabButtons = Array.from(root.querySelectorAll(".twbv-tab-button"));
    const tabPanes = Array.from(root.querySelectorAll(".twbv-custom-tab-pane"));
    const tabsNav = root.querySelector(".twbv-custom-tabs");
    tabsNav?.setAttribute("role", "tablist");
    tabButtons.forEach((btn, index) => {
      const tabId = btn.dataset.tab ?? `tab-${index}`;
      const pane = tabPanes.find((candidate) => candidate.dataset.tab === tabId);
      btn.id = btn.id || `twbv-tab-${tabId}`;
      btn.setAttribute("role", "tab");
      btn.setAttribute("tabindex", btn.classList.contains("is-active") ? "0" : "-1");
      if (pane) {
        pane.id = pane.id || `twbv-panel-${tabId}`;
        pane.setAttribute("role", "tabpanel");
        pane.setAttribute("aria-labelledby", btn.id);
        btn.setAttribute("aria-controls", pane.id);
      }
    });
    const switchTab = (tabId) => {
      tabButtons.forEach((btn) => {
        const isActive = btn.dataset.tab === tabId;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
        btn.setAttribute("tabindex", isActive ? "0" : "-1");
      });
      tabPanes.forEach((pane) => {
        const isActive = pane.dataset.tab === tabId;
        pane.classList.toggle("is-active", isActive);
        pane.hidden = !isActive;
        pane.setAttribute("aria-hidden", isActive ? "false" : "true");
      });
      const formRoot = root.querySelector("form.twbv-custom-item-form");
      formRoot?.setAttribute("data-active-tab", tabId);
    };
    tabsNav?.addEventListener("click", (event) => {
      const button = event.target.closest(".twbv-tab-button");
      if (!button || !tabsNav.contains(button)) return;
      event.preventDefault();
      const targetTab = button.dataset.tab;
      if (!targetTab) return;
      switchTab(targetTab);
      button.focus();
    });
    tabsNav?.addEventListener("keydown", (event) => {
      const currentIndex = tabButtons.findIndex((btn) => btn.classList.contains("is-active"));
      if (currentIndex < 0) return;
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = currentIndex;
      if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabButtons.length;
      if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabButtons.length - 1;
      const nextButton = tabButtons[nextIndex];
      if (!nextButton) return;
      switchTab(nextButton.dataset.tab);
      nextButton.focus();
    });
    const firstActiveButton = root.querySelector(".twbv-tab-button.is-active");
    switchTab(firstActiveButton?.dataset.tab ?? tabButtons[0]?.dataset.tab ?? "descricao");
    const effectsList = root.querySelector(".twbv-effects-list");
    root.querySelector(".twbv-effect-add")?.addEventListener("click", () => {
      const index = effectsList.querySelectorAll(".twbv-effect-row").length;
      effectsList.querySelector(".twbv-tab-empty")?.remove();
      effectsList.insertAdjacentHTML("beforeend", `<div class="twbv-effect-row"><input type="text" name="effect-${index}" placeholder="Descri\u00e7\u00e3o do efeito ativo" /><button type="button" class="twbv-effect-remove" data-index="${index}"><i class="fas fa-trash"></i></button></div>`);
    });
    effectsList?.addEventListener("click", (event) => {
      const btn = event.target.closest(".twbv-effect-remove");
      if (!btn) return;
      btn.closest(".twbv-effect-row")?.remove();
      if (!effectsList.querySelector(".twbv-effect-row")) effectsList.innerHTML = `<p class="twbv-tab-empty">Nenhum efeito ativo cadastrado.</p>`;
    });

    const iconInput = root.querySelector('input[name="icon"]');
    if (iconInput) iconInput.value = "";
  }

  _collectCustomItemDialogData(root, type, defaultSeverity = "Menor") {
    const name = String(root?.querySelector('input[name="name"]')?.value ?? "").trim();
    const fonte = String(root?.querySelector('input[name="source"]')?.value ?? "").trim();
    const icon = String(root?.querySelector('input[name="icon"]')?.value ?? "").trim();
    const categoria = String(root?.querySelector('input[name="category"]')?.value ?? "").trim();
    const requisitos = String(root?.querySelector('input[name="requirements"]')?.value ?? "").trim();
    const descricao = String(root?.querySelector('textarea[name="description"]')?.value ?? "").trim();
    const favorite = Boolean(root?.querySelector('input[name="favorite"]')?.checked);
    const extraNotes = String(root?.querySelector('textarea[name="extraNotes"]')?.value ?? "").trim();
    const severity = String(root?.querySelector('select[name="severity"]')?.value ?? defaultSeverity).trim();
    const isArcaneBackground = Boolean(root?.querySelector('input[name="isArcaneBackground"]')?.checked);
    const hasCharges = Boolean(root?.querySelector('input[name="hasCharges"]')?.checked);
    const charges = String(root?.querySelector('input[name="charges"]')?.value ?? "").trim();
    const effects = Array.from(root?.querySelectorAll('.twbv-effect-row input[type="text"]') ?? []).map((input) => String(input.value ?? "").trim()).filter(Boolean);
    return {
      name,
      system: {
        fonte,
        categoria,
        requisitos,
        descricao,
        source: fonte,
        icon,
        category: categoria,
        requirements: requisitos,
        description: descricao,
        extraNotes,
        severity,
        isArcaneBackground,
        hasCharges,
        charges,
        activeEffects: effects,
        active: true,
        favorite
      }
    };
  }


  _setCustomDialogValidationState(root) {
    const form = root?.querySelector("form.twbv-custom-item-form");
    const nameInput = form?.querySelector('input[name="name"]');
    const saveButton = root?.querySelector('.dialog-buttons .dialog-button[data-button="save"], .twbv-custom-item-submit');
    if (!form || !nameInput || !saveButton) return;
    saveButton.disabled = false;
  }

  _bindCustomDialogFormSubmit(root, onSubmit) {
    const form = root?.querySelector("form.twbv-custom-item-form");
    if (!form || typeof onSubmit !== "function") return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      await onSubmit();
    });
    form.addEventListener("input", () => this._setCustomDialogValidationState(root));
    this._setCustomDialogValidationState(root);
  }

  _bindCustomDialogActionButtons(root, onSubmit, onCancel) {
    if (!root) return;
    root.querySelectorAll(".twbv-custom-item-submit").forEach((button) => {
      button.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (typeof onSubmit === "function") await onSubmit();
      });
    });
    root.querySelectorAll(".twbv-custom-item-cancel").forEach((button) => {
      button.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (typeof onCancel === "function") await onCancel();
      });
    });
    root.addEventListener("click", async (event) => {
      const submitBtn = event.target.closest(".twbv-custom-item-submit");
      if (submitBtn) {
        event.preventDefault();
        event.stopPropagation();
        if (typeof onSubmit === "function") await onSubmit();
        return;
      }
      const cancelBtn = event.target.closest(".twbv-custom-item-cancel");
      if (cancelBtn) {
        event.preventDefault();
        event.stopPropagation();
        if (typeof onCancel === "function") await onCancel();
      }
    }, true);
  }

  async _deleteItemFromSheetButton(button) {
    const itemId = String(button?.dataset?.itemId ?? "").trim();
    if (!itemId) return;
    const sourceType = String(button?.dataset?.sourceType ?? "item");
    if (sourceType === "system") {
      const listKey = String(button?.dataset?.listKey ?? "").trim();
      if (!listKey) return;
      const updated = Array.from(this.actor.system?.[listKey] ?? []).filter((entry) => String(entry?.id ?? "") !== itemId);
      await this.actor.update({ [`system.${listKey}`]: updated });
      await this.render(true);
      return;
    }
    if (!this.actor.items.get(itemId)) return;
    await this.actor.deleteEmbeddedDocuments("Item", [itemId]);
  }

  async _cleanupLegacyTraitPlaceholders() {
    if (this.actor.getFlag("world-behind-the-veil", "cleanedTraitPlaceholders")) return;
    const placeholderNames = new Set(["41", "asda"]);
    const embeddedIds = Array.from(this.actor.items ?? [])
      .filter((item) => twbvIsTraitItemType(item.type))
      .filter((item) => placeholderNames.has(String(item.name ?? "").trim().toLocaleLowerCase("pt-BR")))
      .map((item) => item.id);
    const updateData = {};
    for (const listKey of ["vantagens", "habilidadesEspeciais", "desvantagens"]) {
      const current = Array.from(this.actor.system?.[listKey] ?? []);
      const cleaned = current.filter((entry) => {
        const name = String(entry?.nome ?? entry?.name ?? "").trim().toLocaleLowerCase("pt-BR");
        return !placeholderNames.has(name);
      });
      if (cleaned.length !== current.length) updateData[`system.${listKey}`] = cleaned;
    }
    try {
      if (embeddedIds.length) await this.actor.deleteEmbeddedDocuments("Item", embeddedIds);
      if (Object.keys(updateData).length) await this.actor.update(updateData);
      await this.actor.setFlag("world-behind-the-veil", "cleanedTraitPlaceholders", true);
    } catch (error) {
      console.warn("[TWBV] Falha ao limpar placeholders de vantagens/habilidades.", error);
    }
  }

  async _onVantagemDivisionCreate(event) {
    event.preventDefault();
    let dialogRef = null;
    dialogRef = new Dialog({
      title: "Criar divisao",
      content: `
        <form class="twbv-division-dialog">
          <label>Nome da divisao</label>
          <input type="text" name="name" placeholder="Ex: Linha de combate" autofocus />
          <p>Vantagens com a mesma Categoria aparecem dentro dessa divisao.</p>
        </form>
      `,
      buttons: {
        save: {
          label: "Criar",
          callback: async (html) => {
            const root = resolveDialogRoot(html);
            const name = String(root?.querySelector('input[name="name"]')?.value ?? "").trim();
            if (!name) {
              ui.notifications?.warn("Informe um nome para a divisao.");
              return false;
            }
            const current = Array.from(this.actor.system?.vantagemDivisoes ?? []);
            const exists = current.some((entry) => String(entry?.name ?? entry?.nome ?? "").trim().toLocaleLowerCase("pt-BR") === name.toLocaleLowerCase("pt-BR"));
            if (!exists) current.push({ id: foundry.utils.randomID(), name });
            await this.actor.update({ "system.vantagemDivisoes": current });
            await this.render(true);
            await dialogRef?.close();
          }
        },
        cancel: { label: "Cancelar" }
      },
      default: "save"
    });
    dialogRef.render(true);
  }

  async _onVantagemDivisionDelete(event) {
    event.preventDefault();
    const divisionId = String(event.currentTarget?.dataset?.divisionId ?? "").trim();
    const divisionName = String(event.currentTarget?.dataset?.divisionName ?? "").trim();
    const current = Array.from(this.actor.system?.vantagemDivisoes ?? []);
    const remaining = current.filter((entry) => String(entry?.id ?? "") !== divisionId);
    const updateData = { "system.vantagemDivisoes": remaining };
    if (divisionName) {
      const categoryKey = divisionName.toLocaleLowerCase("pt-BR");
      const itemUpdates = Array.from(this.actor.items ?? [])
        .filter((item) => item.type === "vantagem")
        .filter((item) => String(item.system?.category ?? item.system?.categoria ?? "").trim().toLocaleLowerCase("pt-BR") === categoryKey)
        .map((item) => ({ _id: item.id, "system.category": "", "system.categoria": "" }));
      if (itemUpdates.length) await this.actor.updateEmbeddedDocuments("Item", itemUpdates);
      const legacyVantagens = Array.from(this.actor.system?.vantagens ?? []);
      if (legacyVantagens.length) {
        updateData["system.vantagens"] = legacyVantagens.map((entry) => {
          const category = String(entry?.categoria ?? entry?.category ?? "").trim().toLocaleLowerCase("pt-BR");
          if (category !== categoryKey) return entry;
          return { ...entry, categoria: "", category: "" };
        });
      }
    }
    await this.actor.update(updateData);
    await this.render(true);
  }

  async _onVantagemDivisionDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget?.classList?.remove?.("is-drop-target");
    const dropTarget = event.currentTarget?.closest?.(".twbv-trait-division") ?? event.currentTarget;
    const divisionName = String(dropTarget?.dataset?.divisionName ?? event.currentTarget?.dataset?.divisionName ?? "").trim();
    if (!divisionName) return;

    const card = event.target?.closest?.(".twbv-item-card[data-item-id]");
    let item = null;
    const data = twbvReadDropData(event);
    if (data?.type === "Item") {
      const dropped = await Item.implementation.fromDropData(data);
      if (dropped?.type === "vantagem") {
        item = dropped.parent === this.actor ? this.actor.items.get(dropped.id) : null;
        if (!item) {
          const source = typeof dropped.toObject === "function" ? dropped.toObject() : dropped;
          const created = await this.actor.createEmbeddedDocuments("Item", [{
            ...source,
            system: {
              ...(source.system ?? {}),
              category: divisionName,
              categoria: divisionName
            }
          }]);
          item = created?.[0] ?? null;
          await twbvSendDroppedItemToActorChat(this.actor, item, data);
        }
      }
    }
    if (!item && card) item = this.actor.items.get(String(card.dataset.itemId ?? ""));

    if (item?.type === "vantagem") {
      await item.update({ "system.category": divisionName, "system.categoria": divisionName });
      await this.render(true);
      return;
    }

    const legacyId = String(card?.dataset?.itemId ?? "").trim();
    if (legacyId) {
      const vantagens = Array.from(this.actor.system?.vantagens ?? []);
      const index = vantagens.findIndex((entry) => String(entry?.id ?? "") === legacyId);
      if (index >= 0) {
        vantagens[index] = { ...vantagens[index], category: divisionName, categoria: divisionName };
        await this.actor.update({ "system.vantagens": vantagens });
        await this.render(true);
      }
    }
  }

  async _onTraitCardIconChat(event) {
    event.preventDefault();
    event.stopPropagation();
    const card = event.currentTarget?.closest?.(".twbv-item-card[data-item-id]");
    if (!card) return;
    const itemId = String(card.dataset.itemId ?? "").trim();
    const type = String(card.dataset.itemType ?? "").trim();
    const sourceType = String(card.querySelector(".twbv-item-edit")?.dataset?.sourceType ?? "item");
    const listKey = String(card.querySelector(".twbv-item-edit")?.dataset?.listKey ?? "").trim();
    let data = null;

    if (sourceType === "system" && listKey) {
      const entry = Array.from(this.actor.system?.[listKey] ?? []).find((candidate) => String(candidate?.id ?? "") === itemId);
      if (entry) {
        data = {
          name: String(entry?.nome ?? entry?.name ?? "Item").trim(),
          type,
          icon: String(entry?.icon ?? "").trim(),
          categoria: String(entry?.categoria ?? entry?.category ?? "").trim(),
          requisitos: String(entry?.requisitos ?? entry?.requirements ?? "").trim(),
          fonte: String(entry?.fonte ?? entry?.source ?? "").trim(),
          descricao: String(entry?.descricao ?? entry?.description ?? "").trim()
        };
      }
    } else {
      const item = this.actor.items.get(itemId);
      if (item) {
        if (twbvIsPowerItemDocument(item)) return twbvOpenPowerCastDialog(this.actor, item);
        data = {
          name: item.name,
          type: item.type,
          icon: item.img,
          categoria: String(item.system?.category ?? item.system?.categoria ?? "").trim(),
          requisitos: String(item.system?.requirements ?? item.system?.requisitos ?? item.system?.tier ?? "").trim(),
          fonte: String(item.system?.source ?? item.system?.fonte ?? "").trim(),
          descricao: String(item.system?.description ?? item.system?.descricao ?? "").trim()
        };
      }
    }

    if (!data) return;
    const typeLabel = TWBV_ITEM_TYPES[data.type] ?? data.type ?? "Item";
    const meta = [
      data.categoria ? `Categoria: ${escapeHtml(data.categoria)}` : "",
      data.requisitos ? `Requisito/Tier: ${escapeHtml(data.requisitos)}` : "",
      data.fonte ? `Fonte: ${escapeHtml(data.fonte)}` : ""
    ].filter(Boolean).join(" &middot; ");
    const icon = data.icon ? `<img src="${escapeHtmlAttr(data.icon)}" alt="${escapeHtmlAttr(data.name)}" />` : `<i class="fas fa-gem"></i>`;
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: `
        <details class="twbv-trait-chat-card twbv-trait-chat-card--${escapeHtmlAttr(data.type)}">
          <summary>
            <div class="twbv-trait-chat-card__icon">${icon}</div>
            <div class="twbv-trait-chat-card__heading">
              <span>${escapeHtml(typeLabel)}</span>
              <h3>${escapeHtml(data.name || typeLabel)}</h3>
            </div>
          </summary>
          <div class="twbv-trait-chat-card__body">
            ${meta ? `<p class="twbv-trait-chat-card__meta">${meta}</p>` : ""}
            <div class="twbv-trait-chat-card__text">${escapeHtml(data.descricao || "Sem descri\u00e7\u00e3o.")}</div>
          </div>
        </details>`,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER
    });
  }

  async _openCustomItemDialog(type, item = null, options = {}) {
    const defaultsByType = {
      vantagem: { title: "Nova Vantagem", severity: "", tierLabel: "Requisito/Tier" },
      desvantagem: { title: "Nova Desvantagem", severity: "", tierLabel: "Requisito/Tier" },
      habilidadeEspecial: { title: "Nova Habilidade", severity: "", tierLabel: "" }
    };
    const defaults = defaultsByType[type] ?? defaultsByType.vantagem;
    const itemData = {
      name: item?.name ?? item?.nome ?? "",
      fonte: item?.fonte ?? item?.source ?? item?.system?.fonte ?? item?.system?.source ?? "",
      categoria: item?.categoria ?? item?.category ?? item?.system?.categoria ?? item?.system?.category ?? "",
      requisitos: item?.requisitos ?? item?.requirements ?? item?.tier ?? item?.system?.requisitos ?? item?.system?.requirements ?? item?.system?.tier ?? "",
      descricao: item?.descricao ?? item?.description ?? item?.system?.descricao ?? item?.system?.description ?? "",
      icon: item?.icon ?? item?.system?.icon ?? "",
      severity: item?.severity ?? item?.system?.severity ?? defaults.severity,
      isArcaneBackground: Boolean(item?.isArcaneBackground ?? item?.system?.isArcaneBackground),
      hasCharges: Boolean(item?.hasCharges ?? item?.system?.hasCharges),
      favorite: Boolean(item?.favorite ?? item?.system?.favorite),
      cargas: item?.cargas ?? item?.charges ?? item?.system?.cargas ?? item?.system?.charges ?? "",
      effects: Array.isArray(item?.activeEffects) ? item.activeEffects : (Array.isArray(item?.system?.activeEffects) ? item.system.activeEffects : [])
    };
    const content = this._buildCustomItemDialogContent(type, itemData, options);

    const submitItemForm = async (root, dialogApp) => {
      const form = root?.querySelector("form.twbv-custom-item-form");
      const nameInput = form?.querySelector('input[name="name"]');
      if (!form || !nameInput) return false;

      const typedName = String(nameInput.value ?? "").trim();
      const defaultNameByType = {
        vantagem: "Vantagem",
        desvantagem: "Desvantagem",
        habilidadeEspecial: "Habilidade Especial"
      };
      const nome = typedName || defaultNameByType[type] || "Vantagem";
      if (!typedName) nameInput.value = nome;

      const payload = this._collectCustomItemDialogData(root, type, defaults.severity);
      payload.name = nome;
      const isEmbeddedItem = item && typeof item.update === "function";
      if (isEmbeddedItem) {
        await item.update(payload);
      } else {
        const listKeyByType = {
          vantagem: "vantagens",
          desvantagem: "desvantagens",
          habilidadeEspecial: "habilidadesEspeciais",
          poder: "poderes"
        };
        const listKey = options.listKey ?? listKeyByType[type];
        if (!listKey) return;
        const currentList = Array.from(this.actor.system?.[listKey] ?? []);
        const existingId = String(item?.id ?? "").trim();
        const novoRegistro = {
          id: existingId || foundry.utils.randomID(),
          nome,
          fonte: payload.system.fonte,
          categoria: payload.system.categoria,
          requisitos: payload.system.requisitos,
          descricao: payload.system.descricao,
          icon: payload.system.icon,
          severity: payload.system.severity,
          isArcaneBackground: payload.system.isArcaneBackground,
          hasCharges: payload.system.hasCharges,
          charges: payload.system.charges,
          favorite: payload.system.favorite,
          activeEffects: payload.system.activeEffects
        };
        const existingIndex = currentList.findIndex((entry) => String(entry?.id ?? "") === existingId);
        if (existingIndex >= 0) currentList[existingIndex] = novoRegistro;
        else currentList.push(novoRegistro);
        await this.actor.update({ [`system.${listKey}`]: currentList });
      }
      await dialogApp.close();
      await this.render(true);
      if (!item && type === "vantagem") ui.notifications?.info("Vantagem adicionada.");
      if (!item && type === "desvantagem") ui.notifications?.info("Desvantagem adicionada.");
    };

    let renderedRootRef = null;
    const dialog = new Dialog({
      title: item ? `Editar ${item.name ?? item.nome ?? "Item"}` : defaults.title,
      content,
      buttons: {
        save: {
          label: "Salvar",
          callback: async (html) => {
            const root = renderedRootRef ?? resolveDialogRoot(html);
            if (!root) return;
            await submitItemForm(root, dialog);
          }
        },
        cancel: {
          label: "Cancelar",
          callback: async () => dialog.close()
        }
      },
      default: "save",
      render: (dialogApp, renderedHtml) => {
        const root = resolveDialogRoot(renderedHtml);
        if (!root) return;
        renderedRootRef = root;
        this._bindCustomDialogUi(root);
        this._bindCustomDialogFormSubmit(root, async () => submitItemForm(root, dialogApp));
        this._bindCustomDialogActionButtons(
          root,
          async () => submitItemForm(root, dialogApp),
          async () => dialogApp.close()
        );

        // Fallback explícito: garante que os botões do popup sempre funcionem
        const windowRoot = dialogApp?.element?.[0];
        if (windowRoot && windowRoot !== root) {
          this._bindCustomDialogActionButtons(
            windowRoot,
            async () => submitItemForm(root, dialogApp),
            async () => dialogApp.close()
          );
        }

        if (type === "vantagem" || type === "habilidadeEspecial") {
          // N\u00e3o aplicar classes variantes aqui para evitar ativar overrides de tema
          // no CSS que mudam o visual padrão do Foundry (Salvar/Cancelar etc.).
          const formRoot = root.querySelector("form.twbv-custom-item-form");
          formRoot?.classList?.remove?.("wbtv-vantagem-dialog", "wbtv-habilidade-dialog");
          root.classList.remove("wbtv-vantagem-dialog", "wbtv-habilidade-dialog");
        }
      },
      close: () => {
        const root = dialog.element?.[0];
        root?.__twbvThemeObserver?.disconnect?.();
        if (root) delete root.__twbvThemeObserver;
        const nameInput = root?.querySelector('input[name="name"]');
        if (nameInput) nameInput.setCustomValidity("");
      }
    }, { width: 900, height: "auto" });
    dialog.render(true);
  }
}




function applyCustomItemDialogTheme(dialogWindow) {
  const apply = () => {
    const root = dialogWindow ?? document;
    const appRoot = dialogWindow?.closest?.(".window-app") ?? dialogWindow;
    const footerCandidates = new Set([
      ...(root?.querySelectorAll?.("footer.dialog-buttons, .window-content + footer.dialog-buttons, .window-content + footer, .dialog-buttons") ?? []),
      ...(appRoot?.querySelectorAll?.("footer.dialog-buttons, .window-content + footer.dialog-buttons, .window-content + footer, .dialog-buttons") ?? [])
    ]);

    appRoot?.style?.setProperty?.("background", "radial-gradient(circle at 12% 0%, rgba(122, 84, 188, 0.2), transparent 52%), linear-gradient(165deg, rgba(12, 8, 21, 0.98), rgba(6, 4, 12, 0.99))", "important");

    footerCandidates.forEach((footer) => {
      footer?.classList?.add("twbv-vantagem-footer", "twbv-custom-item-footer");
      if (footer?.style?.setProperty) {
        footer.style.setProperty("background-color", "#090612", "important");
        footer.style.setProperty("background-image", "radial-gradient(circle at 12% 0%, rgba(122, 84, 188, 0.2), transparent 52%), linear-gradient(165deg, rgba(12, 8, 21, 0.98), rgba(6, 4, 12, 0.99))", "important");
        footer.style.setProperty("border-top", "1px solid rgba(217, 183, 117, 0.42)", "important");
        footer.style.setProperty("padding", "10px", "important");
        footer.style.setProperty("margin", "0", "important");
      }
      footer?.querySelectorAll?.("button, .dialog-button, input[type='button'], input[type='submit']")?.forEach((btn) => {
        btn.classList.add("twbv-vantagem-action", "twbv-custom-item-action");
        if (btn?.style?.setProperty) {
          btn.style.setProperty("appearance", "none", "important");
          btn.style.setProperty("-webkit-appearance", "none", "important");
          btn.style.setProperty("background", "linear-gradient(180deg, rgba(84, 53, 126, 0.95), rgba(26, 17, 44, 0.98))", "important");
          btn.style.setProperty("color", "#f8edcc", "important");
          btn.style.setProperty("border", "1px solid rgba(149, 96, 224, 0.9)", "important");
          btn.style.setProperty("border-radius", "10px", "important");
          btn.style.setProperty("min-height", "42px", "important");
        }
      });
    });
  };

  apply();
  requestAnimationFrame(apply);
  setTimeout(apply, 0);
  setTimeout(apply, 60);

  if (!dialogWindow) return;
  const obs = new MutationObserver(() => apply());
  obs.observe(dialogWindow, { childList: true, subtree: true });
  dialogWindow.__twbvThemeObserver?.disconnect?.();
  dialogWindow.__twbvThemeObserver = obs;
}

function twbvApplyRollAdjustments(root) {
  const card = root?.querySelector?.('.twbv-roll-chat');
  if (!card) return;
  const controls = root.querySelector('.twbv-roll-adjust-controls');
  const baseEl = root.querySelector('.twbv-roll-total-base');
  const historyEl = root.querySelector('.twbv-roll-adjust-history');
  const addBtn = root.querySelector('.twbv-roll-add-die');
  if (!controls || !baseEl || !historyEl || !addBtn) return;

  const base = Number(controls.dataset.baseTotal ?? baseEl.textContent ?? 0) || 0;
  let runningTotal = Number(controls.dataset.runningTotal ?? base) || base;

  addBtn.addEventListener('click', () => {
    const dialogContent = `
      <form class="twbv-roll-adjust-dialog">
        <label>Dado adicional
          <select name="extraDie">
            <option value="" selected>Selecione...</option>
            <option value="4">d4</option>
            <option value="6">d6</option>
            <option value="8">d8</option>
            <option value="10">d10</option>
            <option value="12">d12</option>
          </select>
        </label>
        <label>Bônus manual
          <input type="number" name="flatMod" value="" step="1" placeholder="0" />
        </label>
      </form>`;

    new Dialog({
      title: 'Ajustar resultado da rolagem',
      content: dialogContent,
      classes: ['wbtv-roll-adjust-dialog'],
      render: (dialog, html) => {
        applyDialogWindowClass(html ?? dialog, 'wbtv-roll-adjust-dialog');
      },
      buttons: {
        apply: {
          label: 'Aplicar',
          callback: async (dialogHtml) => {
            const modalRoot = resolveDialogRoot(dialogHtml);
            const dieValueRaw = String(modalRoot?.querySelector('select[name="extraDie"]')?.value ?? '').trim();
            const flatRaw = String(modalRoot?.querySelector('input[name="flatMod"]')?.value ?? '').trim();
            const flatMod = flatRaw === '' ? 0 : (Number.isFinite(Number(flatRaw)) ? Number(flatRaw) : 0);

            let extraDie = 0;
            let dieLabel = 'dado';
            if (dieValueRaw) {
              const die = Number(dieValueRaw);
              if (Number.isFinite(die) && [4, 6, 8, 10, 12].includes(die)) {
                const roll = await (new Roll(`1d${die}`)).evaluate();
                extraDie = Number(roll.total ?? 0);
                dieLabel = `d${die}`;
              }
            }

            const previousTotal = runningTotal;
            const final = previousTotal + extraDie + flatMod;
            runningTotal = final;
            controls.dataset.runningTotal = String(runningTotal);
            const modLabel = flatMod > 0 ? ` + ${flatMod}` : flatMod < 0 ? ` - ${Math.abs(flatMod)}` : '';
            const breakdown = `${previousTotal} + ${dieLabel}(${extraDie})${modLabel} = ${final}`;
            const item = document.createElement('div');
            item.className = 'twbv-roll-adjust-result';
            item.innerHTML = `<div class="twbv-roll-adjust-breakdown">${breakdown}</div><div class="twbv-roll-adjust-total">Novo Resultado: <strong class="twbv-roll-total-final">${final}</strong></div>`;
            historyEl.appendChild(item);
          }
        },
        cancel: { label: 'Cancelar' }
      },
      default: 'apply'
    }).render(true);
  });
}

Hooks.once("init", async () => {
  console.log(`[TWBV] Inicializando sistema The World Behind the Veil (${TWBV_LOCAL_BUILD})`);
  globalThis.TWBV = foundry.utils.mergeObject(globalThis.TWBV ?? {}, {
    rollWeaponAttackByUuid: twbvRollWeaponAttackByUuid,
    rollWeaponDamageByUuid: twbvRollWeaponDamageByUuid,
    rollWeaponAmplifiedDamageByUuid: twbvRollWeaponAmplifiedDamageByUuid,
    initiative: {
      suits: TWBV_INITIATIVE_SUITS,
      ranks: TWBV_INITIATIVE_RANKS,
      buildCard: twbvBuildInitiativeCard,
      buildDeckCards: twbvBuildInitiativeDeckCards,
      normalizeCard: twbvNormalizeInitiativeCard,
      resolveCard: twbvResolveInitiativeCardWithModifier,
      getActorModifier: twbvGetActorInitiativeModifier,
      findDeck: twbvFindInitiativeDeck,
      ensureDeck: twbvEnsureInitiativeDeck,
      findDiscard: twbvFindInitiativeDiscardPile,
      ensureDiscard: twbvEnsureInitiativeDiscardPile,
      resetDeck: twbvResetInitiativeDeckAndDiscard,
      drawForCombatant: twbvDrawInitiativeForCombatant,
      animatedDeckStatus: twbvInitiativeAnimatedDeckStatus,
      suitOrder: [...TWBV_INITIATIVE_SUIT_ORDER]
    }
  }, { inplace: false });

  CONFIG.Actor.dataModels = CONFIG.Actor.dataModels || {};

  Handlebars.registerHelper("ifEquals", function (arg1, arg2, options) { return arg1 == arg2 ? options.fn(this) : options.inverse(this); });
  Handlebars.registerHelper("isWeaponType", function (type, options) { return ["arma", "weapon"].includes(String(type ?? "")) ? options.fn(this) : options.inverse(this); });
  await loadTemplates(TWBV_HANDLEBARS_PARTIALS);
  twbvRegisterInitiativeSettings();
  twbvRegisterMoneySettings();
  twbvPatchCardsAudioHooks();
  twbvApplyActorTypeConfig();
  twbvPatchActorCreationDefaults();
  twbvApplyItemTypeOrderConfig();
  twbvPatchItemCreateDialog();
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("world-behind-the-veil", TWBVWeaponSheet, { types:["weapon","arma"], makeDefault:true });
  Items.registerSheet("world-behind-the-veil", TWBVConsumableSheet, { types:["consumable"], makeDefault:true });
  Items.registerSheet("world-behind-the-veil", TWBVAmmoSheet, { types:["municao"], makeDefault:true });
  Items.registerSheet("world-behind-the-veil", TWBVArmorSheet, { types:["armadura"], makeDefault:true });
  Items.registerSheet("world-behind-the-veil", TWBVBasicItemSheet, { types:["vantagem","desvantagem","habilidadeEspecial","poder","equipamento","modificacao","pericia"], makeDefault:true });
  twbvRegisterActorSheets();
});

function twbvNormalizeAnyItemTypeDialog(app, html) {
  const host = html?.[0] ?? html;
  const hasItemTypeSelect = Boolean(host?.querySelector?.('select[name="type"]'));
  if (hasItemTypeSelect) twbvNormalizeItemCreateTypeSelect(html);
}

Hooks.on("renderDialog", twbvNormalizeAnyItemTypeDialog);
Hooks.on("renderDialogV2", twbvNormalizeAnyItemTypeDialog);

Hooks.on("preUpdateActor", (actor, changed, options = {}) => {
  options._twbvSheetAudit = twbvCollectAuditEntries(actor, changed);
});

Hooks.on("updateActor", async (actor, _changed, options, userId) => {
  await twbvSendSheetAuditMessage(actor, options?._twbvSheetAudit ?? [], userId);
});

Hooks.on("preUpdateItem", (item, changed, options = {}) => {
  options._twbvSheetAudit = twbvCollectAuditEntries(item, changed);
});

Hooks.on("updateItem", async (item, _changed, options, userId) => {
  if (!(item?.parent instanceof Actor)) return;
  await twbvSendSheetAuditMessage(item, options?._twbvSheetAudit ?? [], userId);
});

function twbvIsWeaponItem(item) {
  return Boolean(item && ["arma", "weapon"].includes(String(item.type ?? "")));
}

function twbvWeaponAttackCommand(item) {
  return `await globalThis.TWBV.rollWeaponAttackByUuid("${item.uuid}");`;
}

function twbvBuildWeaponAttackMacroData(item) {
  return {
    name: `${item.name} - Atirar`,
    type: "script",
    img: item.img,
    command: twbvWeaponAttackCommand(item),
    flags: { "world-behind-the-veil": { itemUuid: item.uuid, action: "attack" } }
  };
}

function twbvFindWeaponByUuidSync(uuid) {
  const id = String(uuid ?? "").trim();
  if (!id) return null;
  try {
    const direct = typeof fromUuidSync === "function" ? fromUuidSync(id) : null;
    if (twbvIsWeaponItem(direct)) return direct;
  } catch (_) {}
  const itemId = id.match(/(?:^|\.)Item\.([^."']+)/)?.[1] ?? id;
  const worldItem = game.items?.get?.(itemId);
  if (twbvIsWeaponItem(worldItem)) return worldItem;
  for (const actor of game.actors ?? []) {
    const item = actor.items?.get?.(itemId);
    if (twbvIsWeaponItem(item)) return item;
  }
  return null;
}

function twbvFindWeaponByActorAndItemIds(actorId, itemId) {
  const safeActorId = String(actorId ?? "").trim();
  const safeItemId = String(itemId ?? "").trim();
  if (!safeItemId) return null;
  const actor = safeActorId ? game.actors?.get?.(safeActorId) : null;
  const actorItem = actor?.items?.get?.(safeItemId);
  if (twbvIsWeaponItem(actorItem)) return actorItem;
  return twbvFindWeaponByUuidSync(safeItemId);
}

function twbvCandidateActorsForMacroLookup() {
  const actors = [];
  for (const token of canvas?.tokens?.controlled ?? []) {
    if (token.actor && !actors.includes(token.actor)) actors.push(token.actor);
  }
  if (game.user?.character && !actors.includes(game.user.character)) actors.push(game.user.character);
  for (const actor of game.actors ?? []) {
    if (!actors.includes(actor)) actors.push(actor);
  }
  return actors;
}

function twbvGetStageForAdvanceNumber(number) {
  const progression = Math.max(0, Number(number ?? 1));
  return STAGES.find((stage) => progression >= stage.min && progression <= stage.max) ?? STAGES[0];
}

function twbvNormalizeStageName(stageName) {
  const value = String(stageName ?? "").trim();
  if (value.toLocaleLowerCase("pt-BR") === "veterano") return "Experiente";
  return value;
}

function twbvNormalizeHistoryAlbum(rawAlbum) {
  const source = Array.isArray(rawAlbum)
    ? rawAlbum
    : Object.entries(rawAlbum ?? {})
      .filter(([key]) => /^\d+$/.test(key))
      .sort(([left], [right]) => Number(left) - Number(right))
      .map(([, value]) => value);
  return source.map((photo) => ({
    image: String(photo?.image ?? ""),
    nota: String(photo?.nota ?? ""),
    sectionId: String(photo?.sectionId ?? "")
  }));
}

function twbvCreateAlbumSectionId() {
  return `album-${foundry?.utils?.randomID?.(8) ?? Math.random().toString(36).slice(2, 10)}`;
}

function twbvNormalizeHistoryAlbumSections(rawSections) {
  const source = Array.isArray(rawSections)
    ? rawSections
    : Object.entries(rawSections ?? {})
      .filter(([key]) => /^\d+$/.test(key))
      .sort(([left], [right]) => Number(left) - Number(right))
      .map(([, value]) => value);
  const used = new Set();
  return source.map((section) => {
    let id = String(section?.id ?? "").trim() || twbvCreateAlbumSectionId();
    while (used.has(id)) id = twbvCreateAlbumSectionId();
    used.add(id);
    return {
      id,
      name: String(section?.name ?? "").trim() || "Divis\u00f3ria"
    };
  });
}

function twbvReadAlbumSectionsFromActor(actor) {
  return twbvNormalizeHistoryAlbumSections(actor?.system?.historia?.albumSections);
}

function twbvBuildHistoryAlbumSections(album, sections) {
  const normalizedAlbum = twbvNormalizeHistoryAlbum(album);
  const normalizedSections = twbvNormalizeHistoryAlbumSections(sections);
  const buckets = new Map(normalizedSections.map((section) => [section.id, { ...section, kicker: "Divis\u00f3ria", photos: [] }]));
  const unfiled = { id: "", name: "Sem divis\u00f3ria", kicker: "Fotos soltas", unfiled: true, photos: [] };
  normalizedAlbum.forEach((photo, sourceIndex) => {
    const entry = { ...photo, sourceIndex };
    const bucket = buckets.get(photo.sectionId) ?? unfiled;
    bucket.photos.push(entry);
  });
  const ordered = [...buckets.values()];
  if (unfiled.photos.length || !ordered.length) ordered.push(unfiled);
  return ordered;
}

function twbvReadAlbumFromSheet(html, actor) {
  const album = twbvNormalizeHistoryAlbum(actor?.system?.historia?.album);
  const root = html?.[0] ?? html;
  if (!root?.querySelectorAll) return album;
  for (const card of Array.from(root.querySelectorAll(".twbv-album-card"))) {
    const index = Number(card.dataset.index);
    if (!Number.isInteger(index) || index < 0) continue;
    album[index] = {
      image: String(card.querySelector(`input[name="system.historia.album.${index}.image"]`)?.value ?? album[index]?.image ?? ""),
      nota: String(card.querySelector(`textarea[name="system.historia.album.${index}.nota"]`)?.value ?? album[index]?.nota ?? ""),
      sectionId: String(card.querySelector(`input[name="system.historia.album.${index}.sectionId"]`)?.value ?? album[index]?.sectionId ?? "")
    };
  }
  return album.filter(Boolean);
}

function twbvMoveAlbumPhoto(album, fromIndex, sectionId, beforeIndex = null) {
  const normalized = twbvNormalizeHistoryAlbum(album).map((photo, sourceIndex) => ({ ...photo, sourceIndex }));
  if (!Number.isInteger(fromIndex) || fromIndex < 0 || fromIndex >= normalized.length) return normalized.map(({ sourceIndex, ...photo }) => photo);
  if (fromIndex === beforeIndex && String(normalized[fromIndex]?.sectionId ?? "") === String(sectionId ?? "")) {
    return normalized.map(({ sourceIndex, ...photo }) => photo);
  }
  const fromPosition = normalized.findIndex((photo) => photo.sourceIndex === fromIndex);
  if (fromPosition < 0) return normalized.map(({ sourceIndex, ...photo }) => photo);
  const [photo] = normalized.splice(fromPosition, 1);
  photo.sectionId = String(sectionId ?? "");
  let insertAt = normalized.length;
  if (Number.isInteger(beforeIndex)) {
    const targetPosition = normalized.findIndex((entry) => entry.sourceIndex === beforeIndex);
    if (targetPosition >= 0) insertAt = targetPosition;
  }
  normalized.splice(Math.max(0, Math.min(insertAt, normalized.length)), 0, photo);
  return normalized.map(({ sourceIndex, ...entry }) => entry);
}

function twbvPromptText(title, label, initial = "") {
  return new Promise((resolve) => {
    new Dialog({
      title,
      content: `<form class="twbv-dialog-form"><label>${escapeHtml(label)}<input type="text" name="value" value="${escapeHtmlAttr(initial)}" autofocus /></label></form>`,
      buttons: {
        ok: {
          label: "Salvar",
          callback: (html) => {
            const root = html?.[0] ?? html;
            resolve(String(root?.querySelector?.('[name="value"]')?.value ?? "").trim());
          }
        },
        cancel: { label: "Cancelar", callback: () => resolve("") }
      },
      default: "ok",
      close: () => resolve("")
    }).render(true);
  });
}

async function twbvChooseAlbumSectionForPhoto(actor, html, index) {
  const album = twbvReadAlbumFromSheet(html, actor);
  if (!Number.isInteger(index) || index < 0 || index >= album.length) return;
  const sections = twbvReadAlbumSectionsFromActor(actor);
  const currentSection = String(album[index]?.sectionId ?? "");
  const options = [
    `<option value="" ${currentSection ? "" : "selected"}>Sem divis\u00f3ria</option>`,
    ...sections.map((section) => `<option value="${escapeHtmlAttr(section.id)}" ${section.id === currentSection ? "selected" : ""}>${escapeHtml(section.name)}</option>`)
  ].join("");
  return new Promise((resolve) => {
    new Dialog({
      title: "Mover foto",
      content: `<form class="twbv-dialog-form"><label>Enviar para divis\u00f3ria<select name="sectionId">${options}</select></label></form>`,
      buttons: {
        move: {
          label: "Mover",
          callback: async (dialogHtml) => {
            const root = dialogHtml?.[0] ?? dialogHtml;
            album[index] = { ...album[index], sectionId: String(root?.querySelector?.('[name="sectionId"]')?.value ?? "") };
            await actor.update({ "system.historia.album": album });
            resolve(true);
          }
        },
        cancel: { label: "Cancelar", callback: () => resolve(false) }
      },
      default: "move",
      close: () => resolve(false)
    }).render(true);
  });
}

function twbvNormalizeAdvancementChoice(choice, fallbackType = "") {
  if (typeof choice === "string") {
    const label = choice.trim();
    return { tipo: label, label, tier: "" };
  }
  const tipo = String(choice?.tipo ?? choice?.label ?? fallbackType ?? "").trim();
  const tier = twbvNormalizeStageName(choice?.tier);
  const label = String(choice?.label ?? (tier && tipo === TWBV_ATTRIBUTE_ADVANCEMENT ? `Aumentar atributo ${tier}` : tipo)).trim();
  const normalizedLabel = label.toLocaleLowerCase("pt-BR") === "aumentar atributo veterano" ? "Aumentar atributo Experiente" : label;
  return { tipo, label: normalizedLabel || tipo || "Outro", tier };
}

function twbvNormalizeAdvancementEntry(avanco, index) {
  const legacyType = String(avanco?.tipo ?? "").trim();
  const choices = Array.from(avanco?.escolhas ?? avanco?.choices ?? [])
    .map((choice) => twbvNormalizeAdvancementChoice(choice))
    .filter((choice) => choice.tipo || choice.label);
  if (!choices.length) choices.push(twbvNormalizeAdvancementChoice({ tipo: legacyType || "Outro" }));
  const numero = Number(avanco?.numero) || index + 1;
  const stage = twbvGetStageForAdvanceNumber(numero);
  const normalizedChoices = choices.slice(0, 2).map((choice) => ({
    ...choice,
    tier: choice.tipo === TWBV_ATTRIBUTE_ADVANCEMENT ? (choice.tier || stage.name) : choice.tier
  }));
  return {
    ...avanco,
    numero,
    tipo: legacyType,
    escolhas: normalizedChoices,
    resumo: normalizedChoices.map((choice) => choice.label).join(" + "),
    descricao: String(avanco?.descricao ?? "").trim(),
    sourceIndex: index
  };
}

function twbvGetUsedAttributeAdvancementTiers(advances) {
  const used = new Set();
  for (const avanco of advances ?? []) {
    const normalized = twbvNormalizeAdvancementEntry(avanco, Number(avanco?.numero ?? 1) - 1);
    for (const choice of normalized.escolhas ?? []) {
      if (choice.tipo === TWBV_ATTRIBUTE_ADVANCEMENT && choice.tier) used.add(choice.tier);
    }
  }
  return used;
}

function twbvBuildAdvancementChoiceOptions(advances, nextNumber) {
  const currentStage = twbvGetStageForAdvanceNumber(nextNumber);
  const currentStageIndex = STAGES.findIndex((stage) => stage.name === currentStage.name);
  const usedAttributeTiers = twbvGetUsedAttributeAdvancementTiers(advances);
  const options = ADVANCEMENT_OPTIONS.map((option) => ({
    value: option,
    label: option,
    tipo: option,
    tier: option === TWBV_ATTRIBUTE_ADVANCEMENT ? currentStage.name : "",
    disabled: option === TWBV_ATTRIBUTE_ADVANCEMENT && usedAttributeTiers.has(currentStage.name)
  }));

  for (const stage of STAGES.slice(0, Math.max(0, currentStageIndex))) {
    if (usedAttributeTiers.has(stage.name)) continue;
    options.push({
      value: `${TWBV_ATTRIBUTE_ADVANCEMENT}|${stage.name}`,
      label: `Aumentar atributo ${stage.name}`,
      tipo: TWBV_ATTRIBUTE_ADVANCEMENT,
      tier: stage.name,
      disabled: false
    });
  }
  return options;
}

function twbvStyleAdvancementDialogControls(root) {
  const host = resolveDialogRoot(root);
  if (!host) return;

  const paintButton = (button) => {
    button.style.setProperty("color", "#ffedc5", "important");
    button.style.setProperty("-webkit-text-fill-color", "#ffedc5", "important");
    button.style.setProperty("background", "linear-gradient(180deg, rgba(84, 53, 126, 0.95), rgba(26, 17, 44, 0.98))", "important");
    button.style.setProperty("border", "1px solid rgba(217, 183, 117, 0.72)", "important");
    button.style.setProperty("opacity", "1", "important");
    button.style.setProperty("text-shadow", "none", "important");
    button.style.setProperty("font-weight", "800", "important");
    for (const child of Array.from(button.children ?? [])) {
      child.style.setProperty("color", "#ffedc5", "important");
      child.style.setProperty("-webkit-text-fill-color", "#ffedc5", "important");
    }
  };

  for (const button of Array.from(host.querySelectorAll("button, .dialog-button, input[type='button'], input[type='submit']"))) {
    paintButton(button);
  }

  for (const field of Array.from(host.querySelectorAll("select, textarea"))) {
    field.style.setProperty("color", "#f8edcc", "important");
    field.style.setProperty("-webkit-text-fill-color", "#f8edcc", "important");
    field.style.setProperty("background-color", "rgba(9, 6, 18, 0.98)", "important");
    field.style.setProperty("border-color", "rgba(217, 183, 117, 0.78)", "important");
  }

  const observer = new MutationObserver(() => {
    for (const button of Array.from(host.querySelectorAll("button, .dialog-button, input[type='button'], input[type='submit']"))) {
      paintButton(button);
    }
  });
  observer.observe(host, { attributes: true, subtree: true, attributeFilter: ["disabled", "class", "style"] });
  window.setTimeout(() => observer.disconnect(), 30000);
}

async function twbvOpenAdvancementDialog(actor, index = -1) {
  const editing = Number.isInteger(index) && index >= 0;
  const advances = Array.from(actor?.system?.avancos ?? []);
  const existing = editing ? twbvNormalizeAdvancementEntry(advances[index], index) : null;
  const advanceNumber = editing ? existing.numero : advances.length + 1;
  const stage = twbvGetStageForAdvanceNumber(advanceNumber);
  const otherAdvances = editing ? advances.filter((_advance, advanceIndex) => advanceIndex !== index) : advances;
  const choiceOptions = twbvBuildAdvancementChoiceOptions(otherAdvances, advanceNumber);
  const selectedValues = Array.from(existing?.escolhas ?? []).map((choice) => choice.tier && choice.tipo === TWBV_ATTRIBUTE_ADVANCEMENT ? `${choice.tipo}|${choice.tier}` : choice.tipo);
  const buildOptions = (selectedValue) => choiceOptions
    .map((option) => `<option value="${option.value}" data-tipo="${option.tipo}" data-tier="${option.tier}" ${option.disabled ? "disabled" : ""} ${option.value === selectedValue ? "selected" : ""}>${option.label}${option.disabled ? " (usado neste tier)" : ""}</option>`)
    .join("");

  const dialogContent = `
    <form class="twbv-add-adv-dialog-content">
      <header class="twbv-adv-dialog-hero">
        <span>Avan\u00e7o ${advanceNumber}</span>
        <strong>${stage.name}</strong>
      </header>
      <div class="twbv-adv-dialog-grid">
        <label>Escolha 1
          <select name="choice1" required>
            <option value="">Selecione...</option>
            ${buildOptions(selectedValues[0] ?? "")}
          </select>
        </label>
        <label>Escolha 2
          <select name="choice2" required>
            <option value="">Selecione...</option>
            ${buildOptions(selectedValues[1] ?? "")}
          </select>
        </label>
      </div>
      <div class="twbv-adv-dialog-summary" data-summary>Selecione duas op\u00e7\u00f5es diferentes.</div>
      <label class="twbv-adv-description-field">Descri\u00e7\u00e3o / Anota\u00e7\u00f5es
        <textarea name="descricao" rows="5" placeholder="Registre os detalhes das duas escolhas. Essa descrição ficará recolhida na ficha.">${existing?.descricao ?? ""}</textarea>
      </label>
      <div class="twbv-adv-dialog-actions">
        <button type="button" class="twbv-adv-dialog-confirm">${editing ? "Salvar" : "Confirmar"}</button>
        <button type="button" class="twbv-adv-dialog-cancel">Cancelar</button>
      </div>
    </form>`;

  const parseChoice = (select) => {
    const value = String(select?.value ?? "").trim();
    const selected = select?.selectedOptions?.[0];
    return {
      value,
      tipo: String(selected?.dataset?.tipo ?? value).trim(),
      tier: String(selected?.dataset?.tier ?? "").trim(),
      label: String(selected?.textContent ?? value).replace(/\s+\(usado neste tier\)$/i, "").trim()
    };
  };

  const saveAdvancement = async (root, dialog) => {
    const selects = Array.from(root?.querySelectorAll?.('select[name^="choice"]') ?? []);
    const choices = selects.map(parseChoice).filter((choice) => choice.value);
    if (choices.length !== 2) {
      ui.notifications?.warn("Selecione duas op\u00e7\u00f5es para o avan\u00e7o.");
      return;
    }
    if (new Set(choices.map((choice) => choice.value)).size !== choices.length) {
      ui.notifications?.warn("As duas escolhas do avan\u00e7o n\u00e3o podem ser repetidas.");
      return;
    }
    const currentAdvances = Array.from(actor.system.avancos ?? []);
    const usedAttributeTiers = twbvGetUsedAttributeAdvancementTiers(editing ? currentAdvances.filter((_advance, advanceIndex) => advanceIndex !== index) : currentAdvances);
    for (const choice of choices) {
      if (choice.tipo === TWBV_ATTRIBUTE_ADVANCEMENT && usedAttributeTiers.has(choice.tier)) {
        ui.notifications?.warn(`Aumento de atributo de ${choice.tier} j? foi usado.`);
        return;
      }
    }
    const descricao = String(root?.querySelector('textarea[name="descricao"]')?.value ?? "").trim();
    const entry = {
      numero: advanceNumber,
      escolhas: choices.map((choice) => ({ tipo: choice.tipo, label: choice.label, tier: choice.tier })),
      tipo: choices.map((choice) => choice.label).join(" + "),
      descricao
    };
    if (editing) currentAdvances[index] = { ...currentAdvances[index], ...entry };
    else currentAdvances.push(entry);
    await actor.update({ "system.avancos": currentAdvances, "system.avancosTotais": currentAdvances.length });
    dialog.close();
  };

  const dialog = new Dialog(
    {
      title: editing ? "Editar Avan\u00e7o" : "+ Avan\u00e7o",
      content: dialogContent,
      render: (appOrHtml, renderedHtml) => {
        const root = resolveDialogRoot(renderedHtml) ?? resolveDialogRoot(appOrHtml) ?? resolveDialogRoot(dialog);
        const windowApp = applyDialogWindowClass(root, "wbtv-add-adv-dialog");
        twbvStyleAdvancementDialogControls(windowApp ?? root);
        window.setTimeout(() => twbvStyleAdvancementDialogControls(windowApp ?? root), 50);
        window.setTimeout(() => twbvStyleAdvancementDialogControls(windowApp ?? root), 250);
        const selects = Array.from(root?.querySelectorAll?.('select[name^="choice"]') ?? []);
        const summary = root?.querySelector?.("[data-summary]");
        const syncChoices = () => {
          const selected = new Set(selects.map((select) => select.value).filter(Boolean));
          for (const select of selects) {
            for (const option of Array.from(select.options)) {
              if (!option.value) continue;
              const baseDisabled = option.hasAttribute("data-base-disabled");
              option.disabled = baseDisabled || (option.value !== select.value && selected.has(option.value));
            }
          }
          const choices = selects.map(parseChoice).filter((choice) => choice.value);
          if (summary) summary.textContent = choices.length ? choices.map((choice) => choice.label).join(" + ") : "Selecione duas op\u00e7\u00f5es diferentes.";
        };
        for (const select of selects) {
          for (const option of Array.from(select.options)) {
            if (option.disabled) option.setAttribute("data-base-disabled", "1");
          }
          select.addEventListener("change", syncChoices);
        }
        syncChoices();
        root?.querySelector?.(".twbv-adv-dialog-confirm")?.addEventListener("click", async () => saveAdvancement(root, dialog));
        root?.querySelector?.(".twbv-adv-dialog-cancel")?.addEventListener("click", () => dialog.close());
      },
      buttons: {}
    },
    { width: 760, height: "auto" }
  );
  dialog.render(true);
}

function twbvNormalizeWeaponMacroLookupName(name) {
  return String(name ?? "")
    .replace(/\s+-\s+Atirar$/i, "")
    .replace(/^(?:Tela|Ficha|Item)\s+/i, "")
    .trim();
}

function twbvFindWeaponForMacroData(data = {}) {
  const flags = data?.flags ?? {};
  const systemFlag = flags["world-behind-the-veil"] ?? {};
  const candidateUuids = [data?.uuid, data?.documentUuid, data?.itemUuid, systemFlag?.itemUuid, flags?.core?.sourceId];
  const candidateItemIds = [data?.id, data?.itemId, data?._id, data?.data?._id, data?.data?.itemId, systemFlag?.itemId];
  const candidateActorIds = [data?.actorId, data?.data?.actorId, systemFlag?.actorId];
  const command = String(data?.command ?? "");
  for (const match of command.matchAll(/(?:Actor|Scene|Token|Item|Compendium)\.[^"'\s;)]+(?:\.Item\.[^"'\s;)]+)?/g)) {
    candidateUuids.push(match[0]);
  }
  for (const match of command.matchAll(/fromUuid(?:Sync)?\(\s*["']([^"']+)["']\s*\)/g)) {
    candidateUuids.push(match[1]);
  }
  for (const match of command.matchAll(/game\.items\.get\(\s*["']([^"']+)["']\s*\)/g)) {
    candidateItemIds.push(match[1]);
  }
  const candidateNames = [];
  for (const match of command.matchAll(/getName\(\s*["']([^"']+)["']\s*\)/g)) {
    candidateNames.push(twbvNormalizeWeaponMacroLookupName(match[1]));
  }
  for (const match of command.matchAll(/\.items\.get\(\s*["']([^"']+)["']\s*\)/g)) {
    candidateItemIds.push(match[1]);
  }
  for (const match of command.matchAll(/game\.actors\.get\(\s*["']([^"']+)["']\s*\)/g)) {
    candidateActorIds.push(match[1]);
  }
  for (const match of command.matchAll(/game\.actors\.get\(\s*["']([^"']+)["']\s*\)\.items\.get\(\s*["']([^"']+)["']\s*\)/g)) {
    candidateActorIds.push(match[1]);
    candidateItemIds.push(match[2]);
    const item = twbvFindWeaponByActorAndItemIds(match[1], match[2]);
    if (item) return item;
  }
  for (const actorId of candidateActorIds) {
    for (const itemId of candidateItemIds) {
      const item = twbvFindWeaponByActorAndItemIds(actorId, itemId);
      if (item) return item;
    }
  }
  for (const uuid of candidateUuids) {
    const item = twbvFindWeaponByUuidSync(uuid);
    if (item) return item;
  }
  for (const itemId of candidateItemIds) {
    const item = twbvFindWeaponByUuidSync(itemId);
    if (item) return item;
  }

  const macroName = twbvNormalizeWeaponMacroLookupName(data?.name);
  if (macroName) candidateNames.push(macroName);
  const macroImg = String(data?.img ?? "").trim();
  for (const actor of twbvCandidateActorsForMacroLookup()) {
    const weapons = Array.from(actor.items ?? []).filter(twbvIsWeaponItem);
    const exact = weapons.find((item) => candidateNames.includes(item.name) && (!macroImg || item.img === macroImg));
    if (exact) return exact;
    const byName = weapons.find((item) => candidateNames.includes(item.name));
    if (byName) return byName;
    const byImg = macroImg ? weapons.find((item) => item.img === macroImg) : null;
    if (byImg) return byImg;
  }
  return null;
}

async function twbvResolveDroppedWeaponItem(data = {}) {
  const direct = twbvFindWeaponForMacroData(data);
  if (direct) return direct;
  const byIds = twbvFindWeaponByActorAndItemIds(data?.actorId ?? data?.data?.actorId, data?.itemId ?? data?.id ?? data?._id ?? data?.data?._id);
  if (byIds) return byIds;
  const candidateUuids = [data?.uuid, data?.documentUuid, data?.itemUuid, data?.flags?.core?.sourceId];
  for (const uuid of candidateUuids) {
    try {
      const item = uuid ? await fromUuid(String(uuid)) : null;
      if (twbvIsWeaponItem(item)) return item;
    } catch (_) {}
  }
  return null;
}

function twbvMacroLooksLikeItemSheet(data = {}) {
  const command = String(data?.command ?? "");
  const name = String(data?.name ?? "").trim();
  return /^(?:Tela|Ficha|Item)\s+/i.test(name) || /\.sheet(?:\?|\.)?\.?render\s*\(/.test(command) || /render\s*\(\s*true\s*\)/.test(command);
}

async function twbvConvertWeaponMacroToAttack(macro, sourceData = null) {
  if (!macro?.isOwner) return false;
  const data = sourceData ?? macro.toObject?.() ?? macro;
  const item = twbvFindWeaponForMacroData(data);
  if (!item) return false;
  const next = twbvBuildWeaponAttackMacroData(item);
  if (macro.command === next.command && macro.name === next.name && macro.img === next.img) return true;
  await macro.update(next);
  return true;
}

function twbvPatchWeaponSheetMacros() {
  const proto = globalThis.Macro?.prototype;
  if (!proto || proto._twbvWeaponSheetMacroPatched) return;
  const originalExecute = proto.execute;
  proto.execute = async function (...args) {
    const data = this?.toObject?.() ?? this;
    const item = twbvMacroLooksLikeItemSheet(data) ? twbvFindWeaponForMacroData(data) : null;
    if (item?.actor) {
      await twbvConvertWeaponMacroToAttack(this, data);
      return twbvRollWeaponAttack(item.actor, item);
    }
    return originalExecute.apply(this, args);
  };
  proto._twbvWeaponSheetMacroPatched = true;
}

Hooks.on("hotbarDrop", async (_bar, data, slot) => {
  const item = await twbvResolveDroppedWeaponItem(data);
  const requestedAttack = data?.action === "attack" || data?.["world-behind-the-veil"]?.action === "attack";
  if (!item) {
    const macroId = String(data?.id ?? data?.macroId ?? data?._id ?? "").trim();
    const macro = macroId ? game.macros?.get?.(macroId) : null;
    const macroItem = macro ? twbvFindWeaponForMacroData(macro.toObject?.() ?? macro) : null;
    if (!macroItem) return requestedAttack ? false : true;
    const nextMacroData = twbvBuildWeaponAttackMacroData(macroItem);
    const attackMacro = game.macros?.find((entry) => entry.name === nextMacroData.name && entry.command === nextMacroData.command)
      ?? await Macro.create(nextMacroData);
    await game.user.assignHotbarMacro(attackMacro, slot);
    return false;
  }
  const command = twbvWeaponAttackCommand(item);
  let macro = game.macros?.find((entry) => entry.name === `${item.name} - Atirar` && entry.command === command);
  if (!macro) {
    macro = await Macro.create(twbvBuildWeaponAttackMacroData(item));
  }
  await game.user.assignHotbarMacro(macro, slot);
  return false;
});

Hooks.on("preCreateMacro", (macro, data) => {
  const source = data ?? macro?.toObject?.() ?? {};
  const hasWeaponSource = Boolean(source?.uuid || source?.documentUuid || source?.itemUuid || source?.flags?.core?.sourceId || source?.flags?.["world-behind-the-veil"]?.itemUuid || twbvMacroLooksLikeItemSheet(source));
  if (!hasWeaponSource) return;
  const item = twbvFindWeaponForMacroData(source);
  if (!item) return;
  macro.updateSource(twbvBuildWeaponAttackMacroData(item));
});

Hooks.on("createMacro", async (macro) => {
  const data = macro?.toObject?.() ?? macro;
  if (!twbvMacroLooksLikeItemSheet(data) && data?.flags?.["world-behind-the-veil"]?.action !== "attack") return;
  await twbvConvertWeaponMacroToAttack(macro, data);
});

Hooks.once("ready", async () => {
  twbvInstallInitiativeApi();
  game.socket?.on?.("system.world-behind-the-veil", async (data = {}) => {
    if (!twbvIsPrimaryActiveGm() || data?.type !== "executeItemTransfer") return;
    await twbvExecuteItemTransfer(data.payload, data.messageId);
  });
  await twbvConfigureTokenizerImagePath();
  void twbvEnsureInitiativeDeck();
  void twbvEnsureInitiativeDiscardPile();
  twbvPatchCombatCardInitiative();
  twbvPatchMeasuredTemplateShapes();
  twbvPatchWeaponSheetMacros();
  for (const macro of game.macros ?? []) {
    const data = macro?.toObject?.() ?? macro;
    if (twbvMacroLooksLikeItemSheet(data)) await twbvConvertWeaponMacroToAttack(macro, data);
  }
});

Hooks.on("updateCombat", (combat, changed) => {
  void twbvMaybeResetInitiativeDeckOnRound(combat, changed);
});

Hooks.on("renderCombatTracker", (app, html) => {
  twbvEnhanceCombatTrackerInitiative(app, html);
});

async function twbvRerollStoredChatMessage(message, { spendEco = false } = {}) {
  if (message.getFlag("world-behind-the-veil", "criticalFailure")) {
    ui.notifications?.warn("Falha crítica é absoluta e não pode ser rerrolada.");
    return null;
  }
  const reroll = foundry.utils.deepClone(message.getFlag("world-behind-the-veil", "reroll") ?? {});
  const actor = reroll.actorUuid ? await fromUuid(reroll.actorUuid) : null;
  if (reroll.actorUuid && !actor) return ui.notifications?.warn("Ator da rolagem não encontrado para rerrolar.");
  if (spendEco && !(await twbvSpendEcoForActor(actor))) return null;
  const attempts = twbvGetRerollAttemptsFromMessage(message);
  let nextMessage = null;
  if (reroll.mode === "dual") {
    if (!actor) return ui.notifications?.warn("Ator da rolagem não encontrado para rerrolar.");
    nextMessage = await renderDualDieResult({ ...(reroll.args ?? {}), actor, returnContentOnly: true });
  }
  else if (reroll.mode === "single") {
    if (!actor) return ui.notifications?.warn("Ator da rolagem não encontrado para rerrolar.");
    nextMessage = await renderSingleDieResult({ ...(reroll.args ?? {}), actor, returnContentOnly: true });
  }
  else if (reroll.mode === "formula") nextMessage = await twbvCreateFormulaRollChat({ ...(reroll.args ?? {}), actor, returnContentOnly: true });
  else return ui.notifications?.warn("Essa rolagem ainda não tem dados suficientes para rerrolar.");
  const nextContent = twbvGetBaseChatContent(nextMessage?.content ?? "");
  if (nextMessage?.criticalFailure) {
    if (actor) await twbvAwardEcoForCriticalFailure(actor);
    const content = twbvStripRerollStack(nextContent);
    await message.update({
      content,
      "flags.world-behind-the-veil.criticalFailure": true,
      "flags.world-behind-the-veil.criticalEcoAwarded": true,
      "flags.world-behind-the-veil.-=reroll": null,
      "flags.world-behind-the-veil.-=rerollAttempts": null,
      "flags.world-behind-the-veil.-=rollAdjust": null
    });
    return null;
  }
  attempts.push({ content: twbvStripRerollStack(nextContent), total: twbvRollTotalFromContent(nextContent) });
  const selectedIndex = twbvBestRerollAttemptIndex(attempts);
  const content = twbvBuildRerollMessageContent(attempts, selectedIndex);
  await message.update({
    content,
    "flags.world-behind-the-veil.rerollAttempts": attempts,
    "flags.world-behind-the-veil.rollAdjust.baseContent": content
  });
  return null;
}

function twbvGetBaseChatContent(content) {
  const marker = '<!--TWBV_ADJUST-->';
  const text = String(content ?? "");
  return text.includes(marker) ? text.split(marker)[0] : text;
}

function twbvGetSelectedRerollContent(content) {
  const baseContent = twbvGetBaseChatContent(content);
  const wrapper = document.createElement("div");
  wrapper.innerHTML = baseContent;
  const stack = wrapper.querySelector(".twbv-reroll-stack");
  if (stack) {
    const selectedIndex = Number(stack.dataset.selected ?? 0);
    const selectedTemplate = stack.querySelector(`template[data-reroll-content="${selectedIndex}"]`);
    return selectedTemplate?.innerHTML ?? twbvStripRerollStack(baseContent);
  }
  const selected = wrapper.querySelector(".twbv-reroll-option.is-selected");
  return selected?.innerHTML ?? twbvStripRerollStack(baseContent);
}

function twbvStripRerollStack(content) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = String(content ?? "");
  wrapper.querySelector(".twbv-reroll-stack")?.remove();
  return wrapper.innerHTML;
}

function twbvRollTotalFromContent(content) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = String(content ?? "");
  const card = wrapper.querySelector(".twbv-roll-chat, .twbv-damage-chat");
  const explicit = Number(card?.dataset?.rollTotal);
  if (Number.isFinite(explicit)) return explicit;
  const valueText = card?.querySelector(".twbv-roll-card--total .twbv-roll-card__value, .twbv-roll-card--damage-total .twbv-roll-card__value, .twbv-roll-total-final, .twbv-roll-chat__total strong")?.textContent ?? "";
  const parsed = Number(String(valueText).replace(/[^\d+\-.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function twbvRerollAttemptsFromContent(content) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = String(content ?? "");
  const stack = wrapper.querySelector(".twbv-reroll-stack");
  if (stack) {
    return Array.from(stack.querySelectorAll("template[data-reroll-content]")).map((template) => {
      const rollContent = twbvStripRerollStack(template.innerHTML);
      return { content: rollContent, total: twbvRollTotalFromContent(rollContent) };
    });
  }
  const legacyOptions = Array.from(wrapper.querySelectorAll(".twbv-reroll-option"));
  if (legacyOptions.length) {
    return legacyOptions.map((option) => {
      const rollContent = twbvStripRerollStack(option.innerHTML);
      return { content: rollContent, total: twbvRollTotalFromContent(rollContent) };
    });
  }
  const clean = twbvStripRerollStack(content);
  return [{ content: clean, total: twbvRollTotalFromContent(clean) }];
}

function twbvBestRerollAttemptIndex(attempts) {
  return attempts.reduce((bestIndex, attempt, index) => Number(attempt.total ?? 0) > Number(attempts[bestIndex]?.total ?? -Infinity) ? index : bestIndex, 0);
}

function twbvBuildRerollStack(attempts, selectedIndex = 0) {
  const bestIndex = twbvBestRerollAttemptIndex(attempts);
  const buttons = attempts.map((attempt, index) => {
    const isSelected = index === selectedIndex;
    const isBest = index === bestIndex;
    return `<button type="button" class="twbv-reroll-pick ${isSelected ? "is-selected" : ""} ${isBest ? "is-best" : ""}" data-reroll-option="${index}" title="Usar esta rolagem">
      <span>${index + 1}</span>
      <strong>${Number(attempt.total ?? 0)}</strong>
      ${isBest ? `<em>Melhor</em>` : ""}
    </button>`;
  }).join("");
  return `<div class="twbv-reroll-stack" data-selected="${selectedIndex}" data-best="${bestIndex}">
    <div class="twbv-reroll-stack__head"><span>Rerrolagens</span><strong>Escolhida: ${selectedIndex + 1}</strong></div>
    <div class="twbv-reroll-stack__options">${buttons}</div>
  </div>`;
}

function twbvBuildRerollMessageContent(attempts, selectedIndex = 0) {
  const selected = attempts[selectedIndex] ?? attempts[0];
  return `${selected?.content ?? ""}${twbvBuildRerollStack(attempts, selectedIndex)}`;
}

function twbvGetRerollAttemptsFromMessage(message) {
  const flagAttempts = foundry.utils.deepClone(message.getFlag("world-behind-the-veil", "rerollAttempts") ?? null);
  if (Array.isArray(flagAttempts) && flagAttempts.length) {
    return flagAttempts.map((attempt) => ({
      content: String(attempt.content ?? ""),
      total: Number(attempt.total ?? twbvRollTotalFromContent(attempt.content))
    }));
  }
  return twbvRerollAttemptsFromContent(twbvGetBaseChatContent(message.content));
}

function twbvAppendRerollOption(existingContent, nextContent) {
  const attempts = twbvRerollAttemptsFromContent(existingContent);
  const nextClean = twbvStripRerollStack(nextContent);
  attempts.push({ content: nextClean, total: twbvRollTotalFromContent(nextClean) });
  const selectedIndex = twbvBestRerollAttemptIndex(attempts);
  return twbvBuildRerollMessageContent(attempts, selectedIndex);
}

async function twbvSelectRerollOption(message, compareIndex, optionIndex) {
  const attempts = twbvGetRerollAttemptsFromMessage(message);
  if (!attempts[optionIndex]) return;
  const content = twbvBuildRerollMessageContent(attempts, optionIndex);
  await message.update({
    content,
    "flags.world-behind-the-veil.rerollAttempts": attempts,
    "flags.world-behind-the-veil.rollAdjust.baseContent": content
  });
}

function twbvGetCompareAndOptionIndex(root, option) {
  const compare = option?.closest?.(".twbv-reroll-stack");
  if (!compare) return null;
  const compareIndex = Array.from(root.querySelectorAll(".twbv-reroll-stack")).indexOf(compare);
  const optionIndex = Array.from(compare.querySelectorAll(":scope .twbv-reroll-pick")).indexOf(option);
  if (compareIndex < 0 || optionIndex < 0) return null;
  return { compareIndex, optionIndex };
}

async function twbvSpendEcoForActor(actor) {
  if (!actor) {
    ui.notifications?.warn("Essa rolagem não tem ator vinculado para gastar Eco.");
    return false;
  }
  const current = Number(actor.system?.eco ?? 0);
  if (current <= 0) {
    ui.notifications?.warn(`${actor.name} não tem Eco suficiente.`);
    return false;
  }
  await actor.update({ "system.eco": Math.max(0, current - 1) });
  return true;
}

async function twbvAwardEcoForCriticalFailure(actor) {
  if (!actor) return false;
  const current = Number(actor.system?.eco ?? 0);
  await actor.update({ "system.eco": Math.max(0, current + 1) });
  ui.notifications?.info(`${actor.name} ganhou 1 Eco por falha crítica.`);
  return true;
}

async function twbvRerollDamageInChat(message, button, { spendEco = false } = {}) {
  if (message.getFlag("world-behind-the-veil", "criticalFailure")) {
    ui.notifications?.warn("Falha crítica é absoluta e não pode ser rerrolada.");
    return;
  }
  const weapon = await fromUuid(String(button?.dataset?.weaponUuid ?? ""));
  if (!weapon?.actor) return ui.notifications?.warn("Arma não encontrada para rerrolar dano.");
  if (spendEco && !(await twbvSpendEcoForActor(weapon.actor))) return;
  const damageMods = twbvGetWeaponMods(weapon).filter((mod) => String(mod.damage ?? "").trim());
  const damageContent = await twbvBuildWeaponDamageChatContent(weapon.actor, weapon, damageMods, { amplified: button?.dataset?.damageMode === "amplified" });
  if (!damageContent) return;
  const marker = '<!--TWBV_ADJUST-->';
  const all = String(message.content ?? "");
  const baseContent = all.includes(marker) ? all.split(marker)[0] : all;
  const afterMarker = all.includes(marker) ? `${marker}${all.split(marker).slice(1).join(marker)}` : "";
  const wrapper = document.createElement("div");
  wrapper.innerHTML = baseContent;
  const target = wrapper.querySelector(".twbv-chat-damage-result");
  if (target) {
    target.innerHTML = twbvAppendRerollOption(target.innerHTML, damageContent);
  }
  else wrapper.insertAdjacentHTML("beforeend", `<div class="twbv-chat-damage-result">${damageContent}</div>`);
  const nextBaseContent = wrapper.innerHTML;
  const update = { content: `${nextBaseContent}${afterMarker}` };
  const adjust = foundry.utils.deepClone(message.getFlag("world-behind-the-veil", "rollAdjust") ?? {});
  if (adjust && Object.keys(adjust).length) update["flags.world-behind-the-veil.rollAdjust"] = { ...adjust, baseContent: nextBaseContent };
  await message.update(update);
}

function twbvSetItemDragData(event, item) {
  if (!item) return;
  const transfer = event?.originalEvent?.dataTransfer ?? event?.dataTransfer;
  const data = {
    type: "Item",
    action: ["arma", "weapon"].includes(String(item.type ?? "")) ? "attack" : "item",
    uuid: item.uuid,
    documentUuid: item.uuid,
    itemUuid: item.uuid,
    id: item.id,
    itemId: item.id,
    actorId: item.actor?.id ?? null,
    "world-behind-the-veil": {
      action: ["arma", "weapon"].includes(String(item.type ?? "")) ? "attack" : "item",
      itemUuid: item.uuid,
      itemId: item.id,
      actorId: item.actor?.id ?? null
    }
  };
  transfer?.setData("text/plain", JSON.stringify(data));
  transfer?.setData("application/json", JSON.stringify(data));
  transfer?.setData("text/x-foundry-item", JSON.stringify(data));
  transfer?.setData("text/x-foundry-drop", JSON.stringify(data));
  if (transfer) {
    transfer.effectAllowed = "copy";
    try {
      const img = item.img ? document.querySelector(`img[src="${CSS.escape(item.img)}"]`) : null;
      if (img) transfer.setDragImage(img, 24, 24);
    } catch (_) {}
  }
}

async function twbvOpenItemImagePicker(item) {
  if (!item?.isOwner) return;
  new FilePicker({
    type: "image",
    current: await twbvImagePickerCurrentPath(item.img, "itens"),
    callback: async (path) => {
      if (!path) return;
      await item.update({ img: path });
    }
  }).render(true);
}

Hooks.on("renderChatMessage", (message, html) => {
  const root = html?.[0] ?? html;
  if (!root || typeof root.querySelector !== "function") return;
  const hasRollChat = Boolean(root.querySelector(".twbv-roll-chat"));
  const hasTradeChat = Boolean(root.querySelector(".twbv-trade-chat"));
  if (!hasRollChat && !hasTradeChat) return;
  root.classList.add("twbv-chat-message");
  if (!message.getFlag("world-behind-the-veil", "criticalFailure") && message.getFlag("world-behind-the-veil", "reroll") && !root.querySelector(".twbv-chat-reroll")) {
    const target = root.querySelector(".twbv-roll-chat__top-adjust") ?? root.querySelector(".twbv-roll-chat");
    target?.insertAdjacentHTML?.("afterbegin", twbvChatRerollButtons());
  }
  root.querySelectorAll(".twbv-roll-card--compact > summary").forEach((summary) => summary.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const details = summary.closest("details.twbv-roll-card--compact");
    if (details) details.open = !details.open;
  }));
  root.querySelectorAll(".twbv-chat-damage-button").forEach((btn) => btn.addEventListener("click", async () => {
    await twbvAppendWeaponDamageToChat(message, btn.dataset.weaponUuid, { amplified: btn.dataset.damageMode === "amplified" });
  }));
  root.querySelectorAll(".twbv-power-effect-toggle").forEach((btn) => btn.addEventListener("click", (event) => {
    event.preventDefault();
    const effect = btn.closest(".twbv-power-chat")?.querySelector(".twbv-power-chat__effect");
    if (!effect) return;
    effect.hidden = !effect.hidden;
    btn.classList.toggle("is-active", !effect.hidden);
  }));
  root.querySelectorAll(".twbv-power-roll-button").forEach((btn) => btn.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await twbvAppendPowerRollToChat(message, btn.dataset.powerUuid, { skipManaCost: btn.dataset.skipMana === "true" });
  }));
  root.querySelectorAll(".twbv-power-cast-button").forEach((btn) => btn.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const power = await fromUuid(String(btn.dataset.powerUuid ?? ""));
    if (!power?.actor) return ui.notifications?.warn("Poder n\u00e3o encontrado.");
    await twbvOpenPowerCastDialog(power.actor, power);
  }));
  root.querySelectorAll(".twbv-power-damage-button").forEach((btn) => btn.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await twbvRollPowerDamageByUuid(btn.dataset.powerUuid);
  }));
  root.querySelectorAll(".twbv-power-cast-damage-button").forEach((btn) => btn.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await twbvAppendPowerCastDamageToChat(message, btn.dataset.powerUuid);
  }));
  root.querySelectorAll(".twbv-power-cast-area-button").forEach((btn) => btn.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await twbvRevealPowerCastArea(message, btn.dataset.powerUuid);
  }));
  root.querySelectorAll(".twbv-chat-reroll").forEach((btn) => btn.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const kind = btn.dataset.rerollKind;
    if (kind === "stored") return twbvRerollStoredChatMessage(message);
    if (kind === "stored-eco") return twbvRerollStoredChatMessage(message, { spendEco: true });
    if (kind === "damage") return twbvRerollDamageInChat(message, btn);
    if (kind === "damage-eco") return twbvRerollDamageInChat(message, btn, { spendEco: true });
  }));
  root.querySelectorAll(".twbv-reroll-pick, .twbv-reroll-option").forEach((option) => {
    const select = async (event) => {
      if (event.target?.closest?.(".twbv-chat-reroll, .twbv-roll-adjust, .twbv-adjust-remove, .twbv-roll-card--compact")) return;
      const indexes = twbvGetCompareAndOptionIndex(root, option);
      if (!indexes) return;
      await twbvSelectRerollOption(message, indexes.compareIndex, indexes.optionIndex);
    };
    option.addEventListener("click", select);
    option.addEventListener("keydown", async (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      await select(event);
    });
  });
  root.querySelectorAll(".twbv-trade-accept").forEach((btn) => btn.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await twbvAcceptItemTradeMessage(message);
  }));
  root.querySelectorAll(".twbv-trade-decline").forEach((btn) => btn.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await twbvDeclineItemTradeMessage(message);
  }));
  root.querySelectorAll(".twbv-roll-adjust").forEach((btn)=> btn.addEventListener("click", ()=> openRollAdjustDialog(message)));
  root.querySelectorAll(".twbv-adjust-remove").forEach((btn)=> btn.addEventListener("click", async ()=> {
    const idx = Number(btn.dataset.adjustIndex ?? -1);
    if (!Number.isInteger(idx) || idx < 0) return;
    const state = foundry.utils.deepClone(message.getFlag("world-behind-the-veil", "rollAdjust") ?? {});
    const chain = Array.isArray(state.chain) ? state.chain : [];
    if (idx >= chain.length) return;
    chain.splice(idx, 1);
    const baseTotal = Number(state.baseTotal ?? 0);
    if (!chain.length) {
      await message.delete();
      return;
    }
    const marker = '<!--TWBV_ADJUST-->';
    const all = message.content ?? '';
    const baseContent = state.baseContent || (all.includes(marker) ? all.split(marker)[0] : all);
    const newContent = `${baseContent}${marker}${buildRollAdjustSection(baseTotal, chain)}`;
    await message.update({content:newContent, 'flags.world-behind-the-veil.rollAdjust': {baseTotal, chain, baseContent}});
  }));
});

Hooks.on("preCreateItem", (item, createData) => {
  if (item?.pack || item?.compendium) return;
  if (twbvIsSidebarItem(item)) item.updateSource({ ownership: twbvPublicItemOwnership(createData?.ownership ?? item.ownership ?? {}) });
  const currentName = String(createData?.name ?? item?.name ?? "").trim();
  const looksGeneric = !currentName || /^item(?:\s*\(\d+\))?$/i.test(currentName);
  if (!looksGeneric) return;
  const type = String(createData?.type ?? item?.type ?? "").trim();
  const fallbackByType = {
    vantagem: "Vantagem",
    desvantagem: "Desvantagem",
    habilidadeEspecial: "Habilidade Especial",
    arma: "Arma",
    armadura: "Armadura",
    weapon: "Arma",
    consumable: "Consumível",
    municao: "Munição",
    modificacao: "Modificação",
    poder: "Poder",
    equipamento: "Equipamento",
    pericia: "Per\u00edcia"
  };
  const effectiveType = twbvIsPowerItemDocument(item) ? "poder" : type;
  const nextName = fallbackByType[effectiveType] ?? "Item";
  item.updateSource({ name: nextName });
});

Hooks.on("createItem", async (item) => {
  if (item?.pack || item?.compendium) return;
  if (!game.user?.isGM || !twbvIsSidebarItem(item)) return;
  const ownership = twbvPublicItemOwnership(item.ownership ?? {});
  if (JSON.stringify(ownership) === JSON.stringify(item.ownership ?? {})) return;
  await item.update({ ownership });
});

Hooks.on("createItem", async (item) => {
  if (item?.pack || item?.compendium) return;
  if (!game.user?.isGM) return;
  if (item.isEmbedded) return;
  await twbvEnsureMainItemFolders();

  const type = twbvIsPowerItemDocument(item) ? "poder" : String(item.type ?? "").trim();
  const selectedSlot = String(item.system?.equipSlot ?? "").trim();
  if (["arma", "weapon", "armadura"].includes(type) && !selectedSlot) {
    if (item.folder) await item.update({ folder: null });
    return;
  }
  const folderNameByType = {
    vantagem: "Vantagens",
    desvantagem: "Desvantagens",
    habilidadeEspecial: "Habilidade Especial",
    arma: "Armas",
    weapon: "Armas",
    armadura: "Armaduras",
    consumable: "Consumíveis",
    municao: "Munições",
    modificacao: "Modificações",
    poder: "Poderes",
    pericia: "Per\u00edcias",
    equipamento: ""
  };
  const folderName = folderNameByType[type];
  if (!folderName) return;
  const mainFolder = twbvGetMainItemFolderConfig(type);
  if (!mainFolder) return;
  const targetFolderName = mainFolder.name;
  const folderColor = mainFolder?.color ?? "#6f54b8";
  const folderSort = mainFolder ? (TWBV_ITEM_MAIN_FOLDER_ORDER.indexOf(mainFolder) + 1) * 100000 : undefined;

  let folder = game.folders?.find((f) => f.type === "Item" && f.name === targetFolderName);
  if (!folder) {
    folder = await Folder.create({ name: targetFolderName, type: "Item", color: folderColor, sort: folderSort });
  } else if (folder.color !== folderColor || (folderSort && folder.sort !== folderSort)) {
    await folder.update({ color: folderColor, ...(folderSort ? { sort: folderSort } : {}) });
  }
  if (!folder) return;
  if (item.folder?.id === folder.id) return;
  await item.update({ folder: folder.id });
});

async function twbvEnsureItemFolderPath(folderNames = [], color = "#6f54b8") {
  let parent = null;
  for (const rawName of folderNames) {
    const name = String(rawName ?? "").trim();
    if (!name) continue;
    let folder = game.folders?.find((f) =>
      f.type === "Item" &&
      f.name === name &&
      ((parent && f.folder?.id === parent.id) || (!parent && !f.folder))
    );
    if (!folder) {
      folder = await Folder.create({ name, type: "Item", color, folder: parent?.id ?? null });
    } else if (folder.color !== color) {
      await folder.update({ color });
    }
    parent = folder ?? parent;
  }
  return parent;
}

async function twbvRouteArmorToSlotFolder(item) {
  if (!game.user?.isGM) return;
  if (!item || item.isEmbedded) return;
  if (String(item.type ?? "") !== "armadura") return;
  if (await twbvClearUnselectedEquipmentFolder(item)) return;
  const slotKey = String(item.system?.equipSlot ?? "").trim();
  if (!slotKey) return;
  const slotLabelByKey = {
    head: "Cabeça",
    chest: "Peito",
    legs: "Pernas",
    boots: "Botas",
    gloves: "Luva",
    belt: "Cinto",
    ringLeft: "Anel Esq.",
    ringRight: "Anel Dir."
  };
  const slotFolderName = slotLabelByKey[slotKey] ?? slotKey;
  const target = await twbvEnsureItemFolderPath(["Armaduras", slotFolderName], twbvGetMainItemFolderConfig("armadura")?.color);
  if (!target) return;
  if (item.folder?.id === target.id) return;
  await item.update({ folder: target.id });
}

Hooks.on("createItem", async (item) => {
  await twbvRouteArmorToSlotFolder(item);
});

Hooks.on("updateItem", async (item, changes) => {
  const touchedSlot = Object.prototype.hasOwnProperty.call(changes ?? {}, "system") && Object.prototype.hasOwnProperty.call(changes.system ?? {}, "equipSlot");
  if (!touchedSlot) return;
  await twbvRouteArmorToSlotFolder(item);
});

async function twbvRouteWeaponToSlotFolder(item) {
  if (!game.user?.isGM) return;
  if (!item || item.isEmbedded) return;
  if (!["weapon", "arma"].includes(String(item.type ?? ""))) return;
  if (await twbvClearUnselectedEquipmentFolder(item)) return;
  const slotKey = String(item.system?.equipSlot ?? "").trim();
  if (!slotKey) return;
  const slotLabelByKey = {
    shortBlade: "Lâmina curta",
    longBlade: "Lâmina Longa",
    blunt: "Contusivo/Corporal",
    pistol: "Pistolas",
    revolver: "Revólver",
    smg: "Submetralhadoras",
    assault: "Assalto",
    shotgun: "Escopeta",
    sniper: "Sniper"
  };
  const slotFolderName = slotLabelByKey[slotKey] ?? slotKey;
  const target = await twbvEnsureItemFolderPath(["Armas", slotFolderName], twbvGetMainItemFolderConfig("arma")?.color);
  if (!target) return;
  if (item.folder?.id === target.id) return;
  await item.update({ folder: target.id });
}

Hooks.on("createItem", async (item) => {
  await twbvRouteWeaponToSlotFolder(item);
});

Hooks.on("updateItem", async (item, changes) => {
  const touchedSlot = Object.prototype.hasOwnProperty.call(changes ?? {}, "system") && Object.prototype.hasOwnProperty.call(changes.system ?? {}, "equipSlot");
  if (!touchedSlot) return;
  await twbvRouteWeaponToSlotFolder(item);
});


class TWBVItemSheetBase extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      width: 940,
      height: 860,
      resizable: true,
      submitOnChange: false,
      closeOnSubmit: false,
      submitOnClose: false
    });
  }

  async close(options = {}) {
    const preview = globalThis._twbvActiveMeasuredTemplatePreview;
    const previewPowerUuid = String(preview?.document?.getFlag?.("world-behind-the-veil", "powerUuid") ?? "");
    if (preview && (!previewPowerUuid || previewPowerUuid === String(this.item?.uuid ?? ""))) {
      try { preview.destroy({ children: true }); } catch (error) { console.warn("[TWBV] Falha ao remover prévia temporária do poder.", error); }
    }
    twbvRestoreDefaultCanvasLayer({ clearPreview: true });
    return super.close(options);
  }

  getData(options = {}) {
    const context = super.getData(options);
    context.item = this.item;
    context.document = this.item;
    context.system = this.item.system ?? {};
    context.typeLabel = TWBV_ITEM_TYPES[this.item?.type] ?? this.item?.type ?? "Item";
    context.categoryLabel = String(context.system?.category ?? "").trim()
      ? (TWBV_ITEM_TYPES[String(context.system.category).trim()] ?? String(context.system.category).trim())
      : "";
    context.displayCategory = context.categoryLabel || String(context.system?.category ?? "");
    context.owner = this.item.isOwner;
    context.editable = this.isEditable;
    context.isPowerItem = twbvIsPowerItemDocument(this.item);
    context.isSkillItem = String(this.item?.type ?? "") === "pericia";
    context.isTraitItem = twbvIsTraitItemType(this.item?.type) || context.isPowerItem;
    context.hasItemEffectWorkbench = ["vantagem", "desvantagem", "habilidadeEspecial"].includes(String(this.item?.type ?? "")) && !context.isPowerItem;
    context.skillAttributeOptions = SKILL_ATTRIBUTES;
    context.powerEffectTypeOptions = TWBV_POWER_EFFECT_TYPES;
    context.powerAreaOptions = TWBV_POWER_AREA_PRESETS;
    context.effectTargetOptions = twbvBuildActorEffectTargetOptions(this.item?.actor ?? null);
    context.effectModeOptions = twbvEffectModeOptions();
    context.itemSheetEffects = twbvPrepareItemSheetEffects(this.item);
    context.arcaneAbilityOptions = TWBV_ARCANE_ABILITIES.map((ability) => ({
      ...ability,
      available: Boolean(twbvGetActorSkillForArcaneAbility(this.item?.actor ?? null, ability.name))
    }));
    context.actorManaCurrent = Number(this.item?.actor?.system?.mana?.value ?? 0);
    context.powerAreaValue = twbvNormalizePowerAreaValue(context.system?.areaEffect ?? context.system?.area);
    context.powerAreaLabel = twbvGetPowerAreaLabel(context.powerAreaValue);
    const castPresetAreaValue = String(context.system?.castPreset?.areaPreset ?? "none").trim() || "none";
    const resolvedCastPresetAreaValue = castPresetAreaValue === "none" ? context.powerAreaValue : castPresetAreaValue;
    context.system.castPreset = {
      damageSteps: Math.max(0, Number(context.system?.castPreset?.damageSteps ?? 0)),
      targetSteps: Math.max(0, Number(context.system?.castPreset?.targetSteps ?? 0)),
      areaPreset: castPresetAreaValue,
      areaSize: twbvClampPowerAreaSize(resolvedCastPresetAreaValue, context.system?.castPreset?.areaSize ?? 1)
    };
    context.powerEffects = context.isPowerItem ? twbvNormalizePowerEffects(context.system?.spellEffects) : [];
    context.skillOptions = Array.from(this.item?.actor?.system?.pericias ?? [])
      .map((skill) => String(skill?.nome ?? "").trim())
      .filter(Boolean);
    context.traitItemClass = context.isTraitItem ? `twbv-basic-item-sheet--${context.isPowerItem ? "poder" : this.item.type}` : "";
    return context;
  }

  async _updateObject(_event, formData) {
    const permitido = {};
    const rawData = formData?.object ?? formData ?? {};
    const flattened = foundry.utils.flattenObject(rawData);
    for (const [chave, valor] of Object.entries(flattened ?? {})) {
      if (chave === "name" || chave === "img" || chave.startsWith("system.")) {
        permitido[chave] = valor;
      }
    }
    if (Object.keys(permitido).some((key) => key.startsWith("system.spellEffects."))) {
      const expanded = foundry.utils.expandObject(permitido);
      permitido["system.spellEffects"] = twbvNormalizePowerEffects(expanded.system?.spellEffects);
      for (const key of Object.keys(permitido)) {
        if (key.startsWith("system.spellEffects.")) delete permitido[key];
      }
    }
    if (Object.prototype.hasOwnProperty.call(permitido, "system.areaEffect")) {
      permitido["system.areaEffect"] = twbvNormalizePowerAreaValue(permitido["system.areaEffect"]);
    }
    console.log("[TWBV] Salvando item sheet.", { item: this.item?.name, update: permitido });
    if (!Object.keys(permitido).length) return;
    await this.item.update(permitido);
  }

  _getFieldValue(input) {
    if (!input) return undefined;
    if (input.type === "checkbox") return Boolean(input.checked);
    if (input.type === "radio") return input.checked ? input.value : undefined;
    if (input.type === "number") {
      const raw = String(input.value ?? "").trim();
      if (!raw) return null;
      const numeric = Number(raw);
      return Number.isFinite(numeric) ? numeric : raw;
    }
    return input.value;
  }

  _persistNamedField(input, { debounce = 0 } = {}) {
    const path = String(input?.name ?? "").trim();
    if (!path || (!path.startsWith("system.") && path !== "name" && path !== "img")) return;
    let value = this._getFieldValue(input);
    if (value === undefined) return;
    if (path === "system.areaEffect") value = twbvNormalizePowerAreaValue(value);

    clearTimeout(input._twbvPersistTimer);
    input._twbvPersistTimer = setTimeout(async () => {
      try {
        console.log("[TWBV] Persistindo campo de item.", { item: this.item?.name, path, value });
        await this.item.update({ [path]: value });
      } catch (error) {
        console.error("[TWBV] Falha ao persistir campo de item.", { item: this.item?.name, path, value, error });
        ui.notifications?.error(`Falha ao salvar ${path}. Veja o console.`);
      }
    }, debounce);
  }

  _bindDirectFieldPersistence(root) {
    return;
  }

  _fitToViewport() {
    const width = Math.min(Math.max(Number(this.position?.width ?? 940), 820), window.innerWidth - 24);
    const height = Math.min(Math.max(Number(this.position?.height ?? 860), 860), window.innerHeight - 24);
    const left = Math.max(12, Math.floor((window.innerWidth - width) / 2));
    const top = 12;
    this.setPosition({ width, height, left, top });
  }

  async _render(force, options = {}) {
    await super._render(force, options);
    this._fitToViewport();
    const root = this.element?.[0] ?? this.element;
    if (twbvIsPowerItemDocument(this.item)) twbvRestoreDefaultCanvasLayer();
    this._bindDirectFieldPersistence(root);
    this._ensureManualSaveButton(root);
  }

  activateListeners(html) {
    super.activateListeners(html);
    this._bindDirectFieldPersistence(html?.[0] ?? html);
    this._ensureManualSaveButton(html?.[0] ?? html);
    const root = html?.[0] ?? html;
    const syncEffectTargetChoices = (panel, group = "Atributos") => {
      const select = panel?.querySelector?.('[name="twbvEffectTarget"]');
      const customWrap = panel?.querySelector?.(".twbv-effect-custom-path");
      if (!select) return;
      const customMode = group === "__custom";
      for (const option of Array.from(select.options ?? [])) {
        const optionGroup = option.dataset.effectOptionGroup ?? "";
        option.hidden = customMode ? option.value !== "__custom" : optionGroup !== group;
      }
      const selected = select.selectedOptions?.[0];
      if (!selected || selected.hidden) {
        const firstVisible = Array.from(select.options ?? []).find((option) => !option.hidden);
        if (firstVisible) select.value = firstVisible.value;
        else {
          const customOption = Array.from(select.options ?? []).find((option) => option.value === "__custom");
          if (customOption) {
            customOption.hidden = false;
            select.value = "__custom";
          }
        }
      }
      if (customWrap) customWrap.hidden = select.value !== "__custom" && !customMode;
    };

    html.find(".twbv-item-effects-workbench .twbv-effect-quick-add").on("click", async (event) => {
      event.preventDefault();
      await twbvSaveItemFieldsFromRoot(this.item, root);
      const panel = event.currentTarget.closest(".twbv-effects-workbench");
      if (!panel) return;
      const targetSelect = panel.querySelector('[name="twbvEffectTarget"]');
      const customInput = panel.querySelector('[name="twbvEffectCustomPath"]');
      const targetValue = String(targetSelect?.value ?? "").trim();
      const key = targetValue === "__custom" ? String(customInput?.value ?? "").trim() : targetValue;
      if (!key) {
        ui.notifications?.warn("Escolha um campo ou informe um caminho customizado para o efeito.");
        return;
      }
      const name = String(panel.querySelector('[name="twbvEffectName"]')?.value ?? "").trim() || twbvGetActiveEffectTargetLabel(this.item?.actor ?? null, key);
      const value = String(panel.querySelector('[name="twbvEffectValue"]')?.value ?? "1").trim() || "1";
      const mode = Number(panel.querySelector('[name="twbvEffectMode"]')?.value ?? CONST?.ACTIVE_EFFECT_MODES?.ADD ?? 2);
      const img = String(panel.querySelector('[name="twbvEffectIcon"]')?.value ?? "").trim() || "icons/svg/aura.svg";
      const durationKind = String(panel.querySelector('[name="twbvEffectDuration"]')?.value ?? "permanent");
      const rounds = Math.max(0, Number(panel.querySelector('[name="twbvEffectRounds"]')?.value ?? 0));
      const effectData = {
        name,
        label: name,
        img,
        disabled: false,
        transfer: true,
        changes: [{ key, mode, value, priority: 20 }],
        duration: durationKind === "temporary" && rounds > 0 ? { rounds } : {},
        description: String(panel.querySelector('[name="twbvEffectDescription"]')?.value ?? "").trim()
      };
      await this.item.createEmbeddedDocuments("ActiveEffect", [effectData]);
    });

    html.find(".twbv-item-effects-workbench [name='twbvEffectTarget']").on("change", (event) => {
      const panel = event.currentTarget.closest(".twbv-effects-workbench");
      const customWrap = panel?.querySelector(".twbv-effect-custom-path");
      if (customWrap) customWrap.hidden = String(event.currentTarget.value ?? "") !== "__custom";
    });

    html.find(".twbv-item-effects-workbench .twbv-effect-kind").on("click", (event) => {
      event.preventDefault();
      const button = event.currentTarget;
      const panel = button.closest(".twbv-effects-workbench");
      const group = String(button.dataset.effectKind ?? "Atributos");
      panel?.querySelectorAll?.(".twbv-effect-kind").forEach((entry) => entry.classList.toggle("is-active", entry === button));
      syncEffectTargetChoices(panel, group);
    });

    syncEffectTargetChoices(root?.querySelector?.(".twbv-item-effects-workbench"), "Atributos");

    html.find(".twbv-item-effects-workbench [name='twbvEffectDuration']").on("change", (event) => {
      const panel = event.currentTarget.closest(".twbv-effects-workbench");
      const roundsWrap = panel?.querySelector(".twbv-effect-rounds");
      if (roundsWrap) roundsWrap.hidden = String(event.currentTarget.value ?? "") !== "temporary";
    });

    html.find(".twbv-item-effects-workbench .twbv-effect-icon-pick").on("click", async (event) => {
      event.preventDefault();
      const panel = event.currentTarget.closest(".twbv-effects-workbench");
      const input = panel?.querySelector('[name="twbvEffectIcon"]');
      const preview = panel?.querySelector("[data-effect-icon-preview]");
      new FilePicker({
        type: "image",
        current: await twbvImagePickerCurrentPath(input?.value ?? "", "efeitos-itens"),
        callback: (path) => {
          if (input) input.value = path;
          if (preview) preview.src = path;
        }
      }).render(true);
    });

    html.find(".twbv-item-effects-workbench [name='twbvEffectIcon']").on("input change", (event) => {
      const panel = event.currentTarget.closest(".twbv-effects-workbench");
      const preview = panel?.querySelector("[data-effect-icon-preview]");
      const next = String(event.currentTarget.value ?? "").trim() || "icons/svg/aura.svg";
      if (preview) preview.src = next;
    });

    html.find(".twbv-item-effects-workbench .twbv-effect-action").on("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const action = String(event.currentTarget.dataset.action ?? "").trim();
      const id = event.currentTarget.closest("[data-effect-id]")?.dataset.effectId;
      const effect = id ? this.item.effects.get(id) : null;
      if (!effect) return;
      if (action === "toggle") {
        await effect.update({ disabled: !effect.disabled });
        return;
      }
      if (action === "edit") {
        effect.sheet?.render(true);
        return;
      }
      if (action === "delete") {
        await this.item.deleteEmbeddedDocuments("ActiveEffect", [effect.id]);
      }
    });

    html.find(".twbv-power-effect-add").on("click", async (event) => {
      event.preventDefault();
      await twbvSaveItemFieldsFromRoot(this.item, root);
      const type = String(event.currentTarget.dataset.effectType ?? "custom").trim() || "custom";
      const effects = twbvNormalizePowerEffects(this.item.system?.spellEffects);
      effects.push(twbvDefaultPowerEffect(type));
      await this.item.update({ "system.spellEffects": effects });
    });
    html.find(".twbv-power-effect-remove").on("click", async (event) => {
      event.preventDefault();
      await twbvSaveItemFieldsFromRoot(this.item, root);
      const index = Number(event.currentTarget.dataset.index);
      const effects = twbvNormalizePowerEffects(this.item.system?.spellEffects);
      if (!Number.isInteger(index) || index < 0 || index >= effects.length) return;
      effects.splice(index, 1);
      await this.item.update({ "system.spellEffects": effects });
    });
    html.find(".twbv-power-area-preview").on("click", async (event) => {
      event.preventDefault();
      await twbvSaveItemFieldsFromRoot(this.item, root);
      const areaValue = root?.querySelector?.('select[name="system.areaEffect"]')?.value ?? this.item.system?.areaEffect;
      const activePreview = globalThis._twbvActiveMeasuredTemplatePreview;
      const previewPowerUuid = String(activePreview?.document?.getFlag?.("world-behind-the-veil", "powerUuid") ?? "");
      if (activePreview && (!previewPowerUuid || previewPowerUuid === String(this.item.uuid ?? ""))) {
        twbvUpdateActivePowerMeasuredPreview(areaValue, { actor: this.item.actor ?? null, power: this.item, pendingCast: true });
        return;
      }
      await twbvPreviewPowerMeasuredTemplate(areaValue, { actor: this.item.actor ?? null, power: this.item, pendingCast: true, previewOriginElement: root });
    });
    const syncArcanePowerUi = (abilityName = "") => {
      const enabledInput = root?.querySelector?.('input[name="system.arcaneAbility.enabled"]');
      const valueInput = root?.querySelector?.('input[name="system.arcaneAbility.skill"]');
      const skillInput = root?.querySelector?.('select[name="system.skill"], input[name="system.skill"]');
      const enabled = Boolean(abilityName);
      if (enabledInput) enabledInput.value = enabled ? "true" : "false";
      if (valueInput) valueInput.value = abilityName;
      if (skillInput && !abilityName) skillInput.value = "";
      root?.querySelectorAll?.(".twbv-power-arcane-option").forEach((option) => {
        const selected = String(option.dataset.arcaneSkill ?? "") === abilityName;
        option.classList.toggle("is-selected", selected);
        const choice = option.querySelector("input");
        if (choice) choice.checked = selected;
      });
    };
    html.find(".twbv-power-arcane-option").on("click", async (event) => {
      event.preventDefault();
      const option = event.currentTarget;
      const abilityName = String(option.dataset.arcaneSkill ?? "").trim();
      const currentAbility = String(root?.querySelector?.('input[name="system.arcaneAbility.skill"]')?.value ?? "").trim();
      if (!abilityName) return;
      if (currentAbility === abilityName) {
        syncArcanePowerUi("");
        await this.item.update({
          "system.arcaneAbility.enabled": false,
          "system.arcaneAbility.skill": "",
          "system.skill": ""
        });
        return;
      }
      const update = {
        "system.arcaneAbility.enabled": true,
        "system.arcaneAbility.skill": abilityName
      };
      const actorSkill = twbvGetActorSkillForArcaneAbility(this.item.actor ?? null, abilityName);
      if (actorSkill) {
        update["system.skill"] = String(actorSkill.nome ?? abilityName).trim();
      } else if (this.item.actor) {
        update["system.skill"] = "";
        ui.notifications?.warn(`${abilityName} precisa existir na ficha com pelo menos d4 para entrar na Per\u00edcia da Rolagem.`);
      } else {
        update["system.skill"] = abilityName;
      }
      syncArcanePowerUi(abilityName);
      const skillInput = root?.querySelector?.('select[name="system.skill"], input[name="system.skill"]');
      if (skillInput && Object.prototype.hasOwnProperty.call(update, "system.skill")) skillInput.value = update["system.skill"];
      await this.item.update(update);
    });
    const presetPanel = root?.querySelector?.(".twbv-power-sheet-preset");
    if (presetPanel) {
      const syncPresetPanel = () => {
        const baseDamage = presetPanel.dataset.baseDamage ?? "";
        const baseArea = presetPanel.dataset.baseArea ?? "none";
        const baseMana = Math.max(0, twbvNumberOrZero(presetPanel.dataset.baseMana ?? 0));
        const damageSteps = Math.max(0, Number(presetPanel.querySelector('input[name="twbvPreset.damageSteps"]')?.value ?? 0));
        const areaPresetValue = String(presetPanel.querySelector("[data-sheet-area-value]")?.value ?? "none").trim() || "none";
        const resolvedAreaValue = areaPresetValue === "none" ? baseArea : areaPresetValue;
        const areaMeta = twbvGetPowerAreaPreset(resolvedAreaValue);
        const targetMode = areaMeta.shape === "target";
        const baseAreaMeta = twbvGetPowerAreaPreset(baseArea);
        const touchToTarget = baseAreaMeta.shape === "touch" && targetMode;
        const targetInput = presetPanel.querySelector('input[name="twbvPreset.targetSteps"]');
        let targetSteps = Math.max(0, Number(targetInput?.value ?? 0));
        if (touchToTarget) targetSteps = 0;
        if (targetInput) targetInput.value = String(targetSteps);
        const areaInput = presetPanel.querySelector('input[name="twbvPreset.areaSize"]');
        const areaSize = twbvClampPowerAreaSize(resolvedAreaValue, areaInput?.value ?? 1);
        if (areaInput) areaInput.value = twbvPowerAreaInputDisplayValue(resolvedAreaValue, areaSize);
        const areaSummary = twbvBuildAreaCastSummary(baseArea, resolvedAreaValue, areaSize, { actor: this.item.actor ?? null, power: this.item });
        const includedAreaCost = twbvShouldIncludeAreaCastSummary(baseArea, areaSummary) ? Number(areaSummary?.cost ?? 0) : 0;
        const touchRange = touchToTarget ? twbvGetPowerTouchRange(this.item.actor ?? null, this.item) : 0;
        const damageOutput = presetPanel.querySelector("[data-sheet-damage-output]");
        if (damageOutput) damageOutput.textContent = twbvFormatPowerDamage(baseDamage, damageSteps);
        const damageCost = presetPanel.querySelector("[data-sheet-damage-cost]");
        if (damageCost) damageCost.textContent = String(damageSteps);
        const targetOutput = presetPanel.querySelector("[data-sheet-target-output]");
        if (targetOutput) targetOutput.textContent = touchToTarget
          ? (touchRange ? `Alcance ${touchRange}` : "Alcance do atributo")
          : `${1 + targetSteps} alvo${targetSteps ? "s" : ""}`;
        const targetCost = presetPanel.querySelector("[data-sheet-target-cost]");
        if (targetCost) targetCost.textContent = String(touchToTarget ? 0 : targetSteps * baseMana);
        const areaCost = presetPanel.querySelector("[data-sheet-area-cost]");
        if (areaCost) areaCost.textContent = String(areaSummary?.cost ?? 0);
        const totalCost = baseMana + damageSteps + (targetMode && !touchToTarget ? targetSteps * baseMana : 0) + includedAreaCost;
        const totalCostEl = root?.querySelector?.("[data-sheet-total-cost]");
        if (totalCostEl) totalCostEl.textContent = String(totalCost);
        const areaTitle = presetPanel.querySelector("[data-sheet-area-title]");
        if (areaTitle) areaTitle.textContent = areaSummary?.areaLabel ?? (areaMeta.value === "none" ? "Nenhuma" : areaMeta.label);
        const selectedArea = presetPanel.querySelector("[data-sheet-selected-area]");
        if (selectedArea) selectedArea.textContent = areaSummary?.areaLabel ?? (areaMeta.value === "none" ? "\u00c1rea base" : areaMeta.label);
        const areaText = presetPanel.querySelector("[data-sheet-area-summary]");
        if (areaText) areaText.textContent = "";
        const areaAdjust = presetPanel.querySelector("[data-sheet-area-adjust]");
        if (areaAdjust) areaAdjust.hidden = targetMode || areaMeta.value === "none";
        const targetAdjust = presetPanel.querySelector("[data-sheet-target-adjust]");
        if (targetAdjust) targetAdjust.hidden = !targetMode;
        const targetControls = presetPanel.querySelector("[data-sheet-target-controls]");
        if (targetControls) targetControls.hidden = touchToTarget;
        const previewButton = root?.querySelector?.("[data-sheet-preview-grid]");
        if (previewButton) previewButton.disabled = targetMode || areaMeta.value === "none";
        presetPanel.querySelectorAll(".twbv-power-area-choice").forEach((button) => button.classList.toggle("is-active", button.dataset.sheetAreaPreset === resolvedAreaValue));
      };
      const readPresetPreviewState = () => {
        const baseArea = String(presetPanel.dataset.baseArea ?? "none");
        const rawAreaValue = String(presetPanel.querySelector("[data-sheet-area-value]")?.value ?? "none").trim() || "none";
        const selectedArea = rawAreaValue === "none" ? baseArea : rawAreaValue;
        const damageSteps = Math.max(0, Number(presetPanel.querySelector('input[name="twbvPreset.damageSteps"]')?.value ?? 0));
        const baseAreaMeta = twbvGetPowerAreaPreset(baseArea);
        const selectedMeta = twbvGetPowerAreaPreset(selectedArea);
        const touchToTarget = baseAreaMeta.shape === "touch" && selectedMeta.shape === "target";
        const targetSteps = touchToTarget ? 0 : Math.max(0, Number(presetPanel.querySelector('input[name="twbvPreset.targetSteps"]')?.value ?? 0));
        const areaSize = twbvClampPowerAreaSize(selectedArea, presetPanel.querySelector('input[name="twbvPreset.areaSize"]')?.value ?? 1);
        const summary = [];
        if (damageSteps) summary.push({ label: "Dano", type: "damage", quantity: damageSteps, cost: damageSteps, detail: `${twbvFormatPowerDamage(presetPanel.dataset.baseDamage ?? "", 0)} -> ${twbvFormatPowerDamage(presetPanel.dataset.baseDamage ?? "", damageSteps)}` });
        if (targetSteps && selectedMeta.shape === "target") summary.push({ label: "Alvos", type: "target", quantity: targetSteps, cost: targetSteps * Math.max(0, twbvNumberOrZero(presetPanel.dataset.baseMana ?? 0)), detail: `${1 + targetSteps} alvos` });
        const areaSummary = twbvBuildAreaCastSummary(baseArea, selectedArea, areaSize, { actor: this.item.actor ?? null, power: this.item });
        if (twbvShouldIncludeAreaCastSummary(baseArea, areaSummary)) summary.push(areaSummary);
        return { selectedArea, summary };
      };
      const syncActiveSheetPreview = () => {
        const state = readPresetPreviewState();
        const selected = twbvGetPowerAreaPreset(state.selectedArea);
        if (selected.shape === "target" || selected.value === "none") {
          return;
        }
        const updatedPreview = twbvUpdateActivePowerMeasuredPreview(state.selectedArea, { actor: this.item.actor ?? null, power: this.item, summary: state.summary, pendingCast: true });
        if (!updatedPreview && presetPanel.dataset.sheetPreviewArmed === "true") {
          void twbvPreviewPowerMeasuredTemplate(state.selectedArea, { actor: this.item.actor ?? null, power: this.item, summary: state.summary, pendingCast: true, previewOriginElement: root });
        }
      };
      presetPanel.querySelectorAll("[data-sheet-preset-step]").forEach((button) => {
        button.addEventListener("click", async (event) => {
          event.preventDefault();
          const kind = button.dataset.sheetPresetStep;
          const inputName = kind === "area"
            ? 'input[name="twbvPreset.areaSize"]'
            : kind === "target"
              ? 'input[name="twbvPreset.targetSteps"]'
              : 'input[name="twbvPreset.damageSteps"]';
          const input = presetPanel.querySelector(inputName);
          if (!input) return;
          const minimum = kind === "area" ? 1 : 0;
          const rawAreaValue = String(presetPanel.querySelector("[data-sheet-area-value]")?.value ?? "none").trim() || "none";
          const areaValue = rawAreaValue === "none" ? String(presetPanel.dataset.baseArea ?? "none") : rawAreaValue;
          input.value = kind === "area"
            ? twbvPowerAreaInputDisplayValue(areaValue, twbvStepPowerAreaSize(areaValue, input.value, button.dataset.step))
            : String(Math.max(minimum, Number(input.value ?? minimum) + Number(button.dataset.step ?? 0)));
          syncPresetPanel();
          syncActiveSheetPreview();
        });
      });
      presetPanel.querySelector("[data-sheet-area-toggle]")?.addEventListener("click", (event) => {
        event.preventDefault();
        const picker = presetPanel.querySelector("[data-sheet-area-picker]");
        if (picker) picker.hidden = !picker.hidden;
      });
      presetPanel.querySelectorAll("[data-sheet-area-preset]").forEach((button) => {
        button.addEventListener("click", async (event) => {
          event.preventDefault();
          const valueInput = presetPanel.querySelector("[data-sheet-area-value]");
          if (valueInput) valueInput.value = button.dataset.sheetAreaPreset || "none";
          const sizeInput = presetPanel.querySelector('input[name="twbvPreset.areaSize"]');
          const baseArea = twbvGetPowerAreaPreset(presetPanel.dataset.baseArea ?? "none");
          const selected = twbvGetPowerAreaPreset(button.dataset.sheetAreaPreset || "none");
          if (sizeInput) {
            const nextSize = twbvClampPowerAreaSize(selected.value, selected.shape === baseArea.shape && baseArea.value !== "none" ? baseArea.squares : selected.squares);
            sizeInput.value = twbvPowerAreaInputDisplayValue(selected.value, nextSize);
          }
          const picker = presetPanel.querySelector("[data-sheet-area-picker]");
          if (picker) picker.hidden = true;
          syncPresetPanel();
          syncActiveSheetPreview();
        });
      });
      presetPanel.querySelectorAll('input[name^="twbvPreset."]').forEach((input) => input.addEventListener("input", () => {
        if (input.name.endsWith(".areaSize")) {
          const areaValue = String(presetPanel.querySelector("[data-sheet-area-value]")?.value ?? presetPanel.dataset.baseArea ?? "none").trim() || "none";
          const resolvedAreaValue = areaValue === "none" ? String(presetPanel.dataset.baseArea ?? "none") : areaValue;
          input.value = twbvPowerAreaInputDisplayValue(resolvedAreaValue, input.value);
        }
        if (input.name.endsWith(".targetSteps")) input.value = String(Math.max(0, Number(input.value ?? 0)));
        if (input.name.endsWith(".damageSteps")) input.value = String(Math.max(0, Number(input.value ?? 0)));
        syncPresetPanel();
        syncActiveSheetPreview();
      }));
      root?.querySelector?.("[data-sheet-preview-grid]")?.addEventListener("click", async (event) => {
        event.preventDefault();
        presetPanel.dataset.sheetPreviewArmed = "true";
        const state = readPresetPreviewState();
        await twbvPreviewPowerMeasuredTemplate(state.selectedArea, { actor: this.item.actor ?? null, power: this.item, summary: state.summary, pendingCast: true, previewOriginElement: root });
      });
      root?.querySelector?.('select[name="system.areaEffect"]')?.addEventListener("change", (event) => {
        const nextArea = twbvNormalizePowerAreaValue(event.currentTarget?.value ?? "none");
        presetPanel.dataset.baseArea = nextArea;
        const presetAreaInput = presetPanel.querySelector("[data-sheet-area-value]");
        if (presetAreaInput) presetAreaInput.value = "none";
        syncPresetPanel();
        syncActiveSheetPreview();
      });
      syncPresetPanel();
    }
    const isWeapon = twbvIsWeaponItem(this.item);
    if (isWeapon) {
      html.find(".profile-img, .twbv-weapon-img").attr("draggable", "true").off("dragstart.twbv-hotbar-weapon").on("dragstart.twbv-hotbar-weapon", (event) => {
        twbvSetItemDragData(event, this.item);
        event.stopPropagation();
        event.stopImmediatePropagation();
      });
      if (root && !root._twbvWeaponSheetDragDelegated) {
        root.addEventListener("dragstart", (event) => {
          const img = event.target?.closest?.(".profile-img, .twbv-weapon-img");
          if (!img || !root.contains(img)) return;
          twbvSetItemDragData(event, this.item);
          event.stopPropagation();
          event.stopImmediatePropagation?.();
        }, true);
        root._twbvWeaponSheetDragDelegated = true;
      }
    }
  }

  _ensureManualSaveButton(root) {
    if (!root || root.querySelector?.(".twbv-item-force-save")) return;
    const form = root.querySelector?.("form");
    if (!form) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "twbv-item-force-save";
    button.innerHTML = twbvIsPowerItemDocument(this.item) ? '<i class="fas fa-save"></i> Salvar' : '<i class="fas fa-save"></i> Salvar Item';
    button.addEventListener("click", async () => {
      await twbvSaveItemFieldsFromRoot(this.item, root);
      ui.notifications?.info(`${this.item.name} salvo.`);
      await this.close();
    });
    form.appendChild(button);
  }
}

async function twbvClearUnselectedEquipmentFolder(item) {
  if (!game.user?.isGM) return false;
  if (!item || item.isEmbedded) return false;
  const type = String(item.type ?? "").trim();
  if (!["arma", "weapon", "armadura"].includes(type)) return false;
  const selectedSlot = String(item.system?.equipSlot ?? "").trim();
  if (selectedSlot) return false;
  if (item.folder) await item.update({ folder: null });
  return true;
}

async function twbvNormalizeWorldItemFolders() {
  if (!game.user?.isGM) return;
  await twbvEnsureMainItemFolders();
  for (const item of game.items ?? []) {
    if (item.isEmbedded) continue;
    const type = String(item.type ?? "").trim();
    if (type === "armadura") {
      await twbvRouteArmorToSlotFolder(item);
      continue;
    }
    if (["arma", "weapon"].includes(type)) {
      await twbvRouteWeaponToSlotFolder(item);
      continue;
    }
    const main = twbvGetMainItemFolderConfig(type);
    if (!main) continue;
    const target = await twbvEnsureItemFolderPath([main.name], main.color);
    if (target && item.folder?.id !== target.id) await item.update({ folder: target.id });
  }
}

class TWBVWeaponSheet extends TWBVItemSheetBase {
  static get defaultOptions(){
    return foundry.utils.mergeObject(super.defaultOptions,{classes:['twbv','sheet','item','weapon-sheet'],tabs:[{navSelector:'.sheet-tabs',contentSelector:'.sheet-body',initial:'general'}]});
  }
  get template(){ return `systems/${game.system.id}/templates/item/weapon-sheet.hbs`; }
  getData(options = {}) {
    const context = super.getData(options);
    const actor = this.item?.parent instanceof Actor ? this.item.parent : null;
    context.actorSkills = Array.from(actor?.system?.pericias ?? [])
      .map((skill, index) => ({
        index,
        name: String(skill?.nome ?? "").trim(),
        die: SKILL_DICE.includes(Number(skill?.dado)) ? Number(skill.dado) : 4,
        bonus: Number.isFinite(Number(skill?.bonus)) ? Number(skill.bonus) : 0,
        attr: String(skill?.atributo ?? "destreza").toLowerCase()
      }))
      .filter((skill) => skill.name);
    return context;
  }
  activateListeners(html){
    super.activateListeners(html);
    html.find('.mod-create').on('click', async (e)=>{
      e.preventDefault();
      const key=foundry.utils.randomID(8);
      await this.item.update({[`system.actions.additional.${key}`]:{name:'Nova Modificação',type:'trait',dice:null,resourcesUsed:null,modifier:'',override:'',ap:null,uuid:null,macroActor:'default',isHeavyWeapon:false}});
    });
    html.find('.mod-delete').on('click', async (e)=>{
      e.preventDefault();
      const key=e.currentTarget.closest('.mod-row')?.dataset.modKey;
      if(key) await this.item.update({[`system.actions.additional.-=${key}`]:null});
    });
    html.find(".twbv-weapon-slot-option").on("click", async (event)=>{
      event.preventDefault();
      const option=event.currentTarget;
      const input=option?.querySelector?.(".twbv-weapon-slot-check");
      const next=String(input?.value??"").trim();
      if(!next) return;
      const currentSlot=String(this.item.system?.equipSlot??"").trim();
      const currentCategory=String(this.item.system?.category??"").trim();
      const shouldClear=currentSlot===next;
      html.find(".twbv-weapon-slot-check").prop("checked", false);
      if(!shouldClear && input) input.checked=true;
      html.find('input[name="system.equipSlot"]').val(shouldClear ? "" : next);
      const update={"system.equipSlot": shouldClear ? "" : next};
      if(shouldClear && currentCategory===next) update["system.category"]="";
      if(!shouldClear && !currentCategory) update["system.category"]=next;
      await this.item.update(update);
    });
    html.find(".twbv-weapon-hand-option").on("click", async (event)=>{
      event.preventDefault();
      const option=event.currentTarget;
      const input=option?.querySelector?.(".twbv-weapon-hand-check");
      const next=String(input?.value??"main").trim();
      if(!["main","off","two"].includes(next)) return;
      html.find(".twbv-weapon-hand-check").prop("checked", false);
      if(input) input.checked=true;
      html.find('input[name="system.handMode"]').val(next);
      const update={"system.handMode": next, "system.equippedHand": next};
      const actor = this.item?.parent instanceof Actor ? this.item.parent : null;
      if (actor && this.item.system?.equipped) {
        await twbvUnequipWeaponOccupants(actor, this.item, next);
      }
      await this.item.update(update);
    });
    html.find('input[name="system.equipped"]').on("change", async (event)=>{
      const checked=Boolean(event.currentTarget?.checked);
      const actor = this.item?.parent instanceof Actor ? this.item.parent : null;
      const update={"system.equipped": checked, "system.equipStatus": checked ? 1 : 0};
      if (checked) {
        const hand = await twbvChooseWeaponHand(this.item);
        if (!hand) {
          event.currentTarget.checked = false;
          html.find('input[name="system.equipStatus"]').val("0");
          return;
        }
        update["system.handMode"] = hand;
        update["system.equippedHand"] = hand;
        html.find(".twbv-weapon-hand-check").prop("checked", false);
        html.find(`.twbv-weapon-hand-check[value="${hand}"]`).prop("checked", true);
        html.find('input[name="system.handMode"]').val(hand);
        await twbvUnequipWeaponOccupants(actor, this.item, hand);
      }
      html.find('input[name="system.equipStatus"]').val(checked ? "1" : "0");
      await this.item.update(update);
    });
    html.find(".twbv-weapon-mod-drop-zone").on("dragover", (event)=>event.preventDefault());
    html.find(".twbv-weapon-mod-drop-zone").on("drop", this._onWeaponModificationDrop.bind(this));
    html.find(".twbv-weapon-reload-magazine").on("click", this._onReloadWeaponSheet.bind(this));
    html.find(".twbv-weapon-pick-ammo").on("click", this._onReloadWeaponSheet.bind(this));
    html.find(".twbv-weapon-skill-picker-button").on("click", this._openWeaponSkillPicker.bind(this));
  }

  _openWeaponSkillPicker(event) {
    event.preventDefault();
    const actor = this.item?.parent instanceof Actor ? this.item.parent : null;
    const skills = Array.from(actor?.system?.pericias ?? [])
      .map((skill) => ({
        name: String(skill?.nome ?? "").trim(),
        die: SKILL_DICE.includes(Number(skill?.dado)) ? Number(skill.dado) : 4,
        bonus: Number.isFinite(Number(skill?.bonus)) ? Number(skill.bonus) : 0,
        attr: String(skill?.atributo ?? "destreza").toLowerCase()
      }))
      .filter((skill) => skill.name);

    if (!actor || !skills.length) {
      ui.notifications?.warn("Coloque a arma em uma ficha com perícias cadastradas para escolher a perícia padrão.");
      return;
    }

    const current = String(this.item.system?.skill ?? "").trim();
    const content = `<div class="twbv-weapon-skill-picker">${skills.map((skill, index) => {
      const attr = SKILL_ATTRIBUTES.find((entry) => entry.key === skill.attr);
      const attrLabel = attr?.label ?? skill.attr;
      const selected = skill.name === current ? " is-selected" : "";
      return `<button type="button" class="twbv-weapon-skill-choice${selected}" data-skill-index="${index}"><strong>${skill.name}</strong><span>${attrLabel} &middot; ${buildDieLabel(skill.die, skill.bonus)}</span></button>`;
    }).join("")}</div>`;

    const dialog = new Dialog({
      title: `Perícia padrão - ${this.item.name}`,
      content,
      buttons: { close: { label: "Fechar" } },
      render: (html) => {
        const root = resolveDialogRoot(html);
        applyDialogWindowClass(root ?? html, "wbtv-weapon-skill-dialog");
        root?.querySelectorAll?.(".twbv-weapon-skill-choice").forEach((button) => {
          button.addEventListener("click", async () => {
            const skill = skills[Number(button.dataset.skillIndex ?? -1)];
            const skillName = String(skill?.name ?? "").trim();
            if (!skillName) return;
            await this.item.update({ "system.skill": skillName, "system.actions.trait": skillName });
            dialog.close();
            this.render(true);
          });
        });
      }
    });
    dialog.render(true);
  }

  async _onWeaponModificationDrop(event) {
    event.preventDefault();
    const data = twbvReadDropData(event);
    if (data?.type !== "Item") return;
    const dropped = await Item.implementation.fromDropData(data);

    if (dropped && String(dropped.type ?? "") === "municao") {
      if (twbvIsAmmoBox(dropped)) {
        return ui.notifications?.warn("Caixas carregam pentes/carregadores. Para a arma, use um pente, carregador, clip, cartucho, projétil, cilindro ou célula.");
      }
      const currentShots = Math.max(0, twbvNumberOrZero(dropped.system?.currentShots));
      if (currentShots <= 0) return ui.notifications?.warn(`${dropped.name} está vazio. Carregue-o usando uma caixa de munição.`);
      const capacity = Math.max(0, twbvNumberOrZero(dropped.system?.shots || currentShots));
      await this.item.update({
        "system.ammo": dropped.name,
        "system.ammoSourceUuid": dropped.uuid,
        "system.ammoSourceName": dropped.name,
        "system.ammoAp": twbvNumberOrZero(dropped.system?.ap),
        "system.reloadType": dropped.system?.reloadType ?? "magazine",
        "system.shots": capacity,
        "system.currentShots": Math.min(currentShots, capacity || currentShots)
      });
      if (dropped.isEmbedded) await dropped.update({ "system.currentShots": 0 });
      ui.notifications?.info(`${this.item.name} carregada com ${dropped.name}.`);
      return;
    }

    if (!dropped || String(dropped.type ?? "") !== "modificacao") {
      return ui.notifications?.warn("Arraste uma Modificação ou uma Munição/Carregador para a arma.");
    }

    const mode = String(event.currentTarget?.dataset?.dropMode ?? "").trim();
    const isAmmo = mode === "ammo" || twbvIsAmmoModification(dropped);
    if (isAmmo) {
      await this.item.update(twbvBuildWeaponAmmoUpdateFromModification(dropped, this.item));
      ui.notifications?.info(`${dropped.name} carregada como munição de ${this.item.name}.`);
      return;
    }

    const key = foundry.utils.randomID(8);
    await this.item.update({[`system.actions.additional.${key}`]: twbvBuildWeaponModFromModification(dropped)});
    ui.notifications?.info(`${dropped.name} adicionada às modificações de ${this.item.name}.`);
  }

  async _onReloadWeaponSheet(event) {
    event.preventDefault();
    const actor = this.item?.parent instanceof Actor ? this.item.parent : null;
    if (!actor) return ui.notifications?.warn("Coloque a arma em uma ficha para escolher munições do inventário.");
    await twbvOpenWeaponAmmoPicker(actor, this.item);
  }
}
class TWBVConsumableSheet extends TWBVItemSheetBase { static get defaultOptions(){ return foundry.utils.mergeObject(super.defaultOptions,{classes:['twbv','sheet','item','consumable-sheet'],tabs:[{navSelector:'.sheet-tabs',contentSelector:'.sheet-body',initial:'general'}]}); } get template(){ return `systems/${game.system.id}/templates/item/consumable-sheet.hbs`; }}
class TWBVAmmoSheet extends TWBVItemSheetBase {
  static get defaultOptions(){ return foundry.utils.mergeObject(super.defaultOptions,{classes:['twbv','sheet','item','ammo-sheet'],tabs:[{navSelector:'.sheet-tabs',contentSelector:'.sheet-body',initial:'general'}]}); }
  get template(){ return `systems/${game.system.id}/templates/item/ammo-sheet.hbs`; }
  getData(options = {}) {
    const context = super.getData(options);
    context.reloadTypeLabel = TWBV_AMMO_RELOAD_LABELS[String(context.system?.reloadType ?? "box")] ?? "Caixa";
    return context;
  }
  async _updateObject(event, formData) {
    formData["system.category"] = "municao";
    formData["system.ammoType"] = formData["system.reloadType"] ?? "box";
    await super._updateObject(event, formData);
  }
}
class TWBVArmorSheet extends TWBVItemSheetBase {
  static get defaultOptions(){
    return foundry.utils.mergeObject(super.defaultOptions,{classes:['twbv','sheet','item','armor-sheet'],tabs:[{navSelector:'.sheet-tabs',contentSelector:'.sheet-body',initial:'description'}]});
  }
  get template(){ return `systems/${game.system.id}/templates/item/armor-sheet.hbs`; }
  activateListeners(html){
    super.activateListeners(html);
    html.find(".twbv-armor-slot-option").on("click", async (event) => {
      event.preventDefault();
      const input = event.currentTarget?.querySelector?.(".twbv-armor-slot-check");
      const next = String(input?.value ?? "").trim();
      if (!next) return;
      const currentSlot = String(this.item.system?.equipSlot ?? "").trim();
      const currentCategory = String(this.item.system?.category ?? "").trim();
      const autoCategory = `armadura:${next}`;
      const shouldClear = currentSlot === next;
      html.find(".twbv-armor-slot-check").prop("checked", false);
      if (!shouldClear && input) input.checked = true;
      html.find('input[name="system.equipSlot"]').val(shouldClear ? "" : next);
      const update = {"system.equipSlot": shouldClear ? "" : next};
      if (shouldClear && currentCategory === autoCategory) update["system.category"] = "";
      if (!shouldClear && !currentCategory) update["system.category"] = autoCategory;
      await this.item.update(update);
    });
    html.find('input[name="system.equipped"]').on("change", async (event) => {
      const checked = Boolean(event.currentTarget?.checked);
      html.find('input[name="system.equipStatus"]').val(checked ? "1" : "0");
      await this.item.update({"system.equipped": checked, "system.equipStatus": checked ? 1 : 0});
    });
    html.find('.mod-create').on('click', async (e)=>{e.preventDefault(); const key=foundry.utils.randomID(8); await this.item.update({[`system.actions.additional.${key}`]:{name:'Slot de Mod',type:'trait',modifier:'',uuid:''}});});
    html.find('.mod-delete').on('click', async (e)=>{e.preventDefault(); const key=e.currentTarget.closest('.mod-row')?.dataset.modKey; if(key) await this.item.update({[`system.actions.additional.-=${key}`]:null});});
  }
}
class TWBVBasicItemSheet extends TWBVItemSheetBase { static get defaultOptions(){ return foundry.utils.mergeObject(super.defaultOptions,{classes:['twbv','sheet','item','twbv-basic-item-sheet'],tabs:[{navSelector:'.sheet-tabs',contentSelector:'.sheet-body',initial:'general'}]}); } get template(){ return `systems/${game.system.id}/templates/item/basic-item-sheet.hbs`; }}


function twbvEnhanceDiceTray(root) {
  const doc = root?.ownerDocument ?? document;
  const container = (root?.querySelector?.('.dice-tray, .dice-calculator, .dice-tray__stacked, .dice-tray__buttons'))
    ?? doc.querySelector('.dice-tray, .dice-calculator, .dice-tray__stacked, .dice-tray__buttons');
  const chatForm = doc.querySelector("#chat-form, .chat-form");
  if (chatForm) chatForm.classList.add("twbv-dice-tray-root");
  if (!container) return;
  container.classList.add("twbv-dice-tray-themed");
  root?.classList?.add("twbv-chat-themed");
  const wildLabel = Array.from(doc.querySelectorAll('button, span, div')).find((el) => /selvagem/i.test(el.textContent || ''));
  if (wildLabel) wildLabel.textContent = 'Desperto';
  const asLabel = Array.from(doc.querySelectorAll('button, span, div')).find((el) => /^\s*as\s*$/i.test(el.textContent || ''));
  if (asLabel) asLabel.textContent = 'Véu';
}

function twbvInjectCustomDiceTray(root) {
  const doc = root?.ownerDocument ?? document;
  if (doc.querySelector(".twbv-custom-dice-tray")) return;
  const chatWindow = doc.querySelector("#sidebar #chat, #chat");
  const chatMessage = chatWindow?.querySelector?.("#chat-message, textarea[name='message'], textarea") ?? doc.querySelector("#chat-message, textarea[name='message']");
  const chatForm = chatMessage?.closest?.("form, #chat-form, .chat-form") ?? chatWindow?.querySelector?.("form, #chat-form, .chat-form") ?? doc.querySelector("#chat-form, .chat-form");
  if (!chatForm) return;

  const tray = doc.createElement("div");
  tray.className = "twbv-custom-dice-tray";
  tray.innerHTML = `
    <div class="twbv-custom-dice-tray__row twbv-custom-dice-tray__dice">
      ${[4, 6, 8, 10, 12].map((d) => `<button type="button" data-die="${d}" class="twbv-die-btn">d${d}</button>`).join("")}
    </div>
    <div class="twbv-custom-dice-tray__row">
      <button type="button" data-op="minus">?</button>
      <span class="twbv-custom-dice-tray__mod" data-mod>0</span>
      <button type="button" data-op="plus">+</button>
      <button type="button" data-op="desperto" class="twbv-tag-btn">Desperto d6</button>
      <button type="button" data-op="veu" class="twbv-tag-btn">Véu</button>
      <button type="button" data-op="roll" class="twbv-roll-btn">Rolar</button>
    </div>`;
  chatForm.insertAdjacentElement("afterend", tray);

  const state = { dice: {}, mod: 0, desperto: false, despertoDie: 6, veu: false, touched: false, history: [], historyIndex: -1 };
  const resetTrayState = () => {
    state.dice = {};
    state.mod = 0;
    state.desperto = false;
    state.despertoDie = 6;
    state.veu = false;
    state.touched = false;
  };
  const buildFormula = () => {
    const baseTerms = Object.entries(state.dice)
      .filter(([, qty]) => Number(qty) > 0)
      .map(([die, qty]) => `${qty}d${die}${state.veu ? "x" : ""}`);
    if (!baseTerms.length) return "";
    const base = baseTerms.join(" + ");
    const desperto = state.desperto ? ` + 1d${state.despertoDie}${state.veu ? "x" : ""}` : "";
    const mod = state.mod ? ` ${state.mod > 0 ? "+" : "-"} ${Math.abs(state.mod)}` : "";
    return `${base}${desperto}${mod}`;
  };
  const submitTrayRoll = async () => {
    const formula = buildFormula();
    if (!formula) return ui.notifications?.warn("Selecione ao menos um dado.");
    const roll = await (new Roll(formula)).evaluate();
    const total = Number(roll.total ?? 0);
    const commonFormula = Object.entries(state.dice)
      .filter(([, qty]) => Number(qty) > 0)
      .map(([die, qty]) => `${qty}d${die}${state.veu ? "x" : ""}`)
      .join(" + ");
    const despertoFormula = state.desperto ? `1d${state.despertoDie}${state.veu ? "x" : ""}` : "?";
    const trayBreakdown = twbvDiceTermBreakdownHtml(roll);
    const content = `
      <section class="twbv-roll-chat">
        <header class="twbv-roll-chat__header">
          <h3>Rolagem de Bandeja${state.veu ? " ? Véu" : ""}</h3>
        </header>
        <div class="twbv-roll-chat__grid">
          <div class="twbv-roll-card">
            <div class="twbv-roll-card__label">Dados Comuns</div>
            <div class="twbv-roll-card__die">${commonFormula || "?"}</div>
            <div class="twbv-roll-card__value twbv-roll-card__value--breakdown"><div class="twbv-roll-breakdown">${trayBreakdown}</div></div>
          </div>
          <div class="twbv-roll-card">
            <div class="twbv-roll-card__label">Variantes</div>
            <div class="twbv-roll-card__die">${despertoFormula}</div>
            <div class="twbv-roll-card__value twbv-roll-card__value--breakdown">
              <div class="twbv-roll-breakdown">
                <div class="twbv-roll-breakdown__row"><span>Desperto</span><strong>${despertoFormula}</strong></div>
                <div class="twbv-roll-breakdown__row"><span>Bônus</span><strong>${state.mod >= 0 ? "+" : ""}${state.mod}</strong></div>
                <div class="twbv-roll-breakdown__row is-total"><span>Total</span><strong>${total}</strong></div>
              </div>
            </div>
          </div>
        </div>
        <footer class="twbv-roll-chat__total">Resultado: <strong title="Dados comuns: ${commonFormula || "?"} | Desperto: ${despertoFormula} | Modificador: ${state.mod >= 0 ? "+" : ""}${state.mod}">${total}</strong></footer>
        <div class="twbv-roll-chat__top-adjust"><button type="button" class="twbv-roll-adjust" title="Adicionar dado"><i class="fas fa-plus"></i></button></div>
      </section>`;
    const contentWithAdjust = `${content}<!--TWBV_ADJUST-->${buildRollAdjustSection(total, [])}`;
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker(),
      content: contentWithAdjust,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      rolls: [roll],
      flags: {"world-behind-the-veil": { rollAdjust: { baseTotal: total, chain: [], baseContent: content }, reroll: { mode: "formula", actorUuid: "", args: { formula, title: "Rolagem de Bandeja", label: "Resultado", type: CONST.CHAT_MESSAGE_TYPES.ROLL } } }}
    });
    state.history.unshift(chatMessage?.value ?? formula);
    state.history = state.history.slice(0, 50);
    state.historyIndex = -1;
    if (chatMessage) {
      chatMessage.value = "";
      chatMessage.dispatchEvent(new Event("input", { bubbles: true }));
    }
    resetTrayState();
    sync();
  };
  const sync = () => {
    tray.querySelector("[data-mod]").textContent = String(state.mod);
    tray.querySelectorAll(".twbv-die-btn").forEach((btn) => {
      const die = Number(btn.dataset.die);
      const qty = Number(state.dice?.[die] ?? 0);
      btn.classList.toggle("is-active", qty > 0);
      btn.textContent = qty > 0 ? `${qty}d${die}` : `d${die}`;
    });
    const despertoBtn = tray.querySelector('[data-op="desperto"]');
    if (despertoBtn) despertoBtn.textContent = `Desperto d${state.despertoDie}`;
    despertoBtn?.classList.toggle("is-active", state.desperto);
    tray.querySelector('[data-op="veu"]')?.classList.toggle("is-active", state.veu);
    if (chatMessage && state.touched) {
      const diceText = Object.entries(state.dice)
        .filter(([, qty]) => Number(qty) > 0)
        .map(([die, qty]) => `${qty}d${die}`)
        .join(" + ");
      const despertoText = state.desperto ? ` + Desperto(d${state.despertoDie})` : "";
      const veuText = state.veu ? " + Véu" : "";
      const modText = state.mod ? ` ${state.mod > 0 ? "+" : "-"} ${Math.abs(state.mod)}` : "";
      const composed = `${diceText}${despertoText}${veuText}${modText}`.trim();
      chatMessage.value = composed;
      chatMessage.dispatchEvent(new Event("input", { bubbles: true }));
    }
  };
  sync();

  tray.addEventListener("click", async (ev) => {
    const btn = ev.target.closest("button");
    if (!btn) return;
    const die = Number(btn.dataset.die);
    if (die) {
      state.touched = true;
      state.dice[die] = Number(state.dice?.[die] ?? 0) + 1;
      sync();
      return;
    }
    const op = btn.dataset.op;
    if (op === "minus") { state.mod -= 1; state.touched = true; }
    if (op === "plus") { state.mod += 1; state.touched = true; }
    if (op === "desperto") {
      state.touched = true;
      const options = [4, 6, 8, 10, 12].map((d) => `<option value="${d}" ${d === state.despertoDie ? "selected" : ""}>d${d}</option>`).join("");
      new Dialog({
        title: "Configurar Desperto",
        content: `<div class="twbv-roll-adjust-dialog"><label>Dado Desperto<select name="despertoDie">${options}</select></label></div>`,
        buttons: {
          apply: {
            label: "Aplicar",
            callback: (html) => {
              const rootEl = resolveDialogRoot(html);
              const die = Number(rootEl?.querySelector('select[name="despertoDie"]')?.value ?? 6);
              if (Number.isFinite(die) && [4, 6, 8, 10, 12].includes(die)) state.despertoDie = die;
              state.desperto = !state.desperto;
              sync();
            }
          },
          cancel: { label: "Cancelar" }
        },
        default: "apply"
      }).render(true);
      return;
    }
    if (op === "veu") { state.veu = !state.veu; state.touched = true; }
    if (op === "roll") await submitTrayRoll();
    sync();
  });

  chatMessage?.addEventListener("keydown", async (ev) => {
    if (ev.key === "Enter" && !ev.shiftKey) {
      ev.preventDefault();
      await submitTrayRoll();
      return;
    }
    if (ev.key === "ArrowUp") {
      if (!state.history.length) return;
      ev.preventDefault();
      state.historyIndex = Math.min(state.historyIndex + 1, state.history.length - 1);
      chatMessage.value = state.history[state.historyIndex] ?? "";
      chatMessage.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
}

async function twbvApplyDefaultWorldBackground() {
  if (game?.system?.id !== "world-behind-the-veil") return;

  const current = String(game.world?.background ?? "").trim();
  const shouldUseDefault = current === TWBV_DEFAULT_WORLD_BACKGROUND || TWBV_LEGACY_WORLD_BACKGROUNDS.has(current);

  document.body?.style?.setProperty(
    "background",
    `linear-gradient(180deg, rgba(1, 3, 8, 0.12), rgba(1, 3, 8, 0.32)), url("${TWBV_DEFAULT_WORLD_BACKGROUND}") center top / cover no-repeat fixed`,
    "important"
  );

  if (!game.user?.isGM || !shouldUseDefault || current === TWBV_DEFAULT_WORLD_BACKGROUND) return;
  try {
    await game.world.update({ background: TWBV_DEFAULT_WORLD_BACKGROUND });
    console.log(`[TWBV] Background padrão do mundo aplicado: ${TWBV_DEFAULT_WORLD_BACKGROUND}`);
  } catch (error) {
    console.warn("[TWBV] Não foi possível aplicar o background padrão do mundo.", error);
  }
}

function twbvIsCompendiumLocked(pack) {
  return Boolean(pack?.locked ?? pack?.metadata?.locked ?? pack?.config?.locked);
}

async function twbvSetCompendiumLocked(pack, locked) {
  if (!pack) return;
  if (pack.config) pack.config.locked = Boolean(locked);
  if (pack.configure) await pack.configure({ locked: Boolean(locked) });
  if (pack.config) pack.config.locked = Boolean(locked);
}

async function twbvEnsureOfficialSkillsCompendium() {
  if (!game?.user?.isGM) return;
  const pack = game.packs?.get("world-behind-the-veil.pericias");
  if (!pack) {
    console.warn("[TWBV] Compendium oficial de per\u00edcias n\u00e3o encontrado. Verifique system.json -> packs/pericias.");
    return;
  }

  try {
    const response = await fetch(`systems/world-behind-the-veil/packs/pericias.json?v=${encodeURIComponent(TWBV_LOCAL_BUILD)}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const seed = await response.json();
    const docs = Array.isArray(seed) ? seed : [];
    if (!docs.length) {
      console.warn("[TWBV] Seed de per\u00edcias vazio: packs/pericias.json.");
      return;
    }

    const index = await pack.getIndex();
    if (Array.from(index ?? []).length >= docs.length) {
      console.log(`[TWBV] Compendium oficial de per\u00edcias j\u00e1 possui ${Array.from(index ?? []).length} itens.`);
      return;
    }
    const existingIds = new Set(Array.from(index ?? []).map((entry) => entry._id));
    const createData = [];
    for (const entry of docs) {
      const data = foundry.utils.deepClone(entry);
      if (!existingIds.has(data._id)) createData.push(data);
    }
    if (!createData.length) {
      console.log(`[TWBV] Compendium oficial de per\u00edcias j\u00e1 possui ${docs.length} per\u00edcias.`);
      return;
    }

    const wasLocked = twbvIsCompendiumLocked(pack);
    await twbvSetCompendiumLocked(pack, false);
    try {
      await Item.createDocuments(createData, { pack: pack.collection, keepId: true });
    } finally {
      await twbvSetCompendiumLocked(pack, wasLocked);
    }
    console.log(`[TWBV] Compendium oficial de per\u00edcias sincronizado com ${docs.length} per\u00edcias.`);
  } catch (error) {
    console.error("[TWBV] N\u00e3o foi poss\u00edvel popular o compendium oficial de per\u00edcias.", error);
  }
}

async function twbvEnsureOfficialDisadvantagesCompendium() {
  if (!game?.user?.isGM) return;
  const pack = game.packs?.get("world-behind-the-veil.desvantagens");
  if (!pack) {
    console.warn("[TWBV] Compendium oficial de desvantagens n\u00e3o encontrado. Verifique system.json -> packs/desvantagens.");
    return;
  }

  try {
    const response = await fetch(`systems/world-behind-the-veil/packs/desvantagens.json?v=${encodeURIComponent(TWBV_LOCAL_BUILD)}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const seed = await response.json();
    const docs = Array.isArray(seed) ? seed : [];
    if (!docs.length) {
      console.warn("[TWBV] Seed de desvantagens vazio: packs/desvantagens.json.");
      return;
    }

    const index = await pack.getIndex();
    if (Array.from(index ?? []).length >= docs.length) {
      console.log(`[TWBV] Compendium oficial de desvantagens j\u00e1 possui ${Array.from(index ?? []).length} itens.`);
      return;
    }
    const existingIds = new Set(Array.from(index ?? []).map((entry) => entry._id));
    const createData = [];
    for (const entry of docs) {
      const data = foundry.utils.deepClone(entry);
      if (!existingIds.has(data._id)) createData.push(data);
    }
    if (!createData.length) {
      console.log(`[TWBV] Compendium oficial de desvantagens j\u00e1 possui ${docs.length} desvantagens.`);
      return;
    }

    const wasLocked = twbvIsCompendiumLocked(pack);
    await twbvSetCompendiumLocked(pack, false);
    try {
      await Item.createDocuments(createData, { pack: pack.collection, keepId: true });
    } finally {
      await twbvSetCompendiumLocked(pack, wasLocked);
    }
    console.log(`[TWBV] Compendium oficial de desvantagens sincronizado com ${docs.length} desvantagens.`);
  } catch (error) {
    console.error("[TWBV] N\u00e3o foi poss\u00edvel popular o compendium oficial de desvantagens.", error);
  }
}

Hooks.on('renderChatPopout', (app, html) => {
  twbvEnhanceDiceTray(html?.[0] ?? html);
  twbvInjectCustomDiceTray(html?.[0] ?? html);
});
Hooks.on('renderSidebarTab', (app, html) => {
  if (app?.tabName !== "chat") return;
  twbvEnhanceDiceTray(html?.[0] ?? html);
  twbvInjectCustomDiceTray(html?.[0] ?? html);
});

Hooks.on("getSceneControlButtons", (controls) => {
  const presetTools = TWBV_POWER_AREA_PRESETS
    .filter((preset) => preset.value !== "none" && preset.templateType)
    .map((preset) => {
      const activatePreset = () => twbvTriggerPowerAreaPreset(preset.value, { explicit: true });
      return {
        name: `twbv-${preset.value}`,
        title: `TWBV: ${preset.label}`,
        icon: preset.icon,
        visible: true,
        button: true,
        onClick: activatePreset
      };
    });

  const addTools = (control) => {
    if (!control) return false;
    if (Array.isArray(control.tools)) {
      const offset = control.tools.length;
      for (const [index, tool] of presetTools.entries()) {
        if (!control.tools.some((existing) => existing?.name === tool.name)) control.tools.push({ ...tool, order: offset + index });
      }
      return true;
    }
    if (control.tools && typeof control.tools === "object") {
      const offset = Object.keys(control.tools).length;
      for (const [index, tool] of presetTools.entries()) control.tools[tool.name] ??= { ...tool, order: offset + index };
      return true;
    }
    return false;
  };

  if (Array.isArray(controls)) {
    addTools(controls.find((control) => ["measure", "templates"].includes(control?.name)));
    return;
  }
  addTools(controls?.measure ?? controls?.templates);
});

Hooks.on("ready", () => {
  console.log("[TWBV] Tipos de Actor carregados.", Array.from(game?.system?.documentTypes?.Actor ?? []));
  console.log("[TWBV] Tipos de Item carregados.", Array.from(game?.system?.documentTypes?.Item ?? []));
  twbvPatchCardsAudioHooks();
  void twbvApplyDefaultWorldBackground();
  twbvApplyActorTypeConfig();
  twbvPatchActorCreationDefaults();
  twbvRegisterActorSheets();
  void twbvEnsureOfficialSkillsCompendium();
  void twbvEnsureOfficialDisadvantagesCompendium();
  void twbvMakeSidebarItemsVisibleToPlayers();
  void twbvNormalizeWorldItemFolders();
  twbvInstallItemDirectoryCreateInterceptor();
  twbvInstallGlobalItemFieldPersistence();
  twbvApplyItemTypeOrderConfig();
  twbvPatchItemCreateDialog();
  twbvInstallMeasuredTemplateWheelRotation();
  twbvInstallPowerAreaPresetControlClicks();
  twbvInstallPowerAreaPresetCanvasClicks();
  twbvInstallPowerAreaPreviewSafetyGuards();
  setTimeout(() => twbvEnhanceDiceTray(document), 200);
  setTimeout(() => twbvEnhanceDiceTray(document), 1200);
  setTimeout(() => twbvInjectCustomDiceTray(document), 300);
  setTimeout(() => twbvInjectCustomDiceTray(document), 1300);
});
