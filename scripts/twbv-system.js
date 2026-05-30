const STAGES = [
  { name: "Novato", min: 0, max: 3 },
  { name: "Treinado", min: 4, max: 7 },
  { name: "Veterano", min: 8, max: 11 },
  { name: "Elite", min: 12, max: 15 },
  { name: "Mítico", min: 16, max: 19 },
  { name: "Lendário", min: 20, max: Infinity }
];

const ADVANCEMENT_OPTIONS = [
  "Aumentar um atributo",
  "Aumentar uma perícia",
  "Comprar uma vantagem",
  "Remover uma desvantagem",
  "Novo poder",
  "Melhorar poder existente",
  "Outro"
];

const TWBV_ITEM_TYPES = {
  vantagem: "Vantagem",
  desvantagem: "Desvantagem",
  habilidadeEspecial: "Habilidade Especial",
  poder: "Poder",
  complicacao: "Complicação",
  equipamento: "Equipamento",
  arma: "Arma",
  armadura: "Armadura",
  weapon: "Arma",
  consumable: "Consumível",
  modificacao: "Modificação",
  municao: "Munição"
};

const TWBV_ACTOR_TYPES = {
  personagem: "Personagem",
  despertos: "Desperto",
  "semi-despertos": "Semi-Desperto",
  sombras: "Sombra"
};

const TWBV_ACTOR_CREATE_ORDER = ["despertos", "semi-despertos", "sombras"];
const TWBV_ACTOR_DEFAULT_TYPE = "despertos";

const TWBV_EQUIPMENT_SLOT_DEFS = [
  { key: "head", label: "Cabeça", accepts: ["armadura"] },
  { key: "chest", label: "Peito", accepts: ["armadura"] },
  { key: "legs", label: "Perna", accepts: ["armadura"] },
  { key: "boots", label: "Botas", accepts: ["armadura"] },
  { key: "gloves", label: "Luva", accepts: ["armadura"] },
  { key: "belt", label: "Cinto", accepts: ["armadura"] },
  { key: "ringLeft", label: "Anel Esq.", accepts: ["armadura"] },
  { key: "ringRight", label: "Anel Dir.", accepts: ["armadura"] },
  { key: "weaponMain", label: "Mão Principal", accepts: ["weapon", "arma"] },
  { key: "weaponOff", label: "Mão Inábil", accepts: ["weapon", "arma"] }
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

const TWBV_LOCAL_BUILD = "damage-amplification-ammo-cleanup-2026-05-28-1256";

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
  poder: "icons/svg/upgrade.svg",
  complicacao: "icons/svg/item-bag.svg"
};

const TWBV_ARMOR_SLOT_LABELS = {
  head: "Cabeça",
  chest: "Peito",
  legs: "Pernas",
  boots: "Botas",
  gloves: "Luva",
  belt: "Cinto",
  ringLeft: "Anel Esq.",
  ringRight: "Anel Dir."
};

const TWBV_WEAPON_SLOT_LABELS = {
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

const TWBV_AMMO_RELOAD_LABELS = {
  magazine: "Pente",
  loader: "Carregador",
  clip: "Clip",
  shell: "Cartucho",
  round: "Projétil",
  cylinder: "Cilindro",
  cell: "Célula",
  box: "Caixa"
};

const TWBV_WEAPON_HAND_LABELS = {
  main: "Mão Principal",
  off: "Mão Inábil",
  two: "2 Mãos"
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



const TWBV_ITEM_CREATE_ORDER = ["arma", "armadura", "consumable", "municao", "vantagem", "desvantagem", "habilidadeEspecial", "poder", "modificacao"];

const TWBV_ITEM_MAIN_FOLDER_ORDER = [
  { name: "Armas", types: ["arma", "weapon"], color: "#7c4dff" },
  { name: "Armaduras", types: ["armadura"], color: "#2f8f5b" },
  { name: "Consumíveis", types: ["consumable"], color: "#d6a33d" },
  { name: "Munições", types: ["municao"], color: "#50b1be" },
  { name: "Vantagens", types: ["vantagem"], color: "#2f79c8" },
  { name: "Desvantagens", types: ["desvantagem"], color: "#c95470" },
  { name: "Habilidade Especial", types: ["habilidadeEspecial"], color: "#7aa05a" },
  { name: "Poderes", types: ["poder"], color: "#6f62d8" },
  { name: "Modificação", types: ["modificacao"], color: "#c06f3a" }
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
  return ["weapon", "arma", "armadura", "consumable", "municao", "equipamento", "modificacao", "vantagem", "desvantagem", "habilidadeEspecial", "poder", "complicacao"].includes(String(type ?? ""));
}

function twbvIsPowerItemDocument(itemOrData) {
  const type = String(itemOrData?.type ?? "").trim();
  const system = itemOrData?.system ?? {};
  return type === "poder" || (type === "habilidadeEspecial" && String(system?.itemKind ?? system?.kind ?? "").trim() === "poder");
}

function twbvGetPowerAreaLabel(value) {
  const key = String(value ?? "").trim();
  const labels = {
    none: "",
    "burst-small": "Explosao pequena",
    "burst-medium": "Explosao media",
    "burst-large": "Explosao grande",
    "cone-small": "Cone pequeno",
    "cone-large": "Cone grande"
  };
  return labels[key] ?? key;
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

function twbvNumberOrZero(value) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
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
    return `<option value="${item.id}">${item.name} — ${boxTag} / ${typeLabel} — ${shots}</option>`;
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
  if (!boxes.length) return ui.notifications?.warn("Nenhuma caixa de munição com munição disponível.");
  const options = boxes.map((box) => {
    const shots = `${Number(box.system?.currentShots ?? 0)} / ${Number(box.system?.shots ?? 0)}`;
    return `<option value="${box.id}">${box.name} — Caixa — ${shots}</option>`;
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
          if (load <= 0) return ui.notifications?.warn(`${carrier.name} já está cheio ou ${box.name} está vazia.`);
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
    : `<span>Nenhuma modificação de acerto</span>`;
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
          <i class="fas fa-burst"></i> Dano
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
  const skill = skills.find((entry) => String(entry?.nome ?? "").trim().toLocaleLowerCase("pt-BR") === skillName.toLocaleLowerCase("pt-BR"));
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
  const rollBonusDetails = [
    skillBonus ? { label: "Perícia", value: skillBonus } : null,
    attrBonus ? { label: attr.label, value: attrBonus } : null,
    ...bonusDetails.map((mod) => ({ label: mod.name, value: mod.value }))
  ].filter(Boolean);
  const attackExtras = twbvBuildWeaponAttackExtras(weapon, bonusDetails, currentShots, maxShots);

  if (twbvActorUsesAwakenedDie(actor)) {
    await renderDualDieResult({
      title: `${weapon.name} - ${skillName}`,
      subtitle: `<span class="twbv-skill-attr twbv-attr-${attr.key}">${attr.label}</span>${ferimentoPenalty.label ? ` • ${ferimentoPenalty.label}` : ""}`,
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
      extraContentPlacement: "top"
    });
    return true;
  }

  await renderSingleDieResult({
    title: `${weapon.name} - ${skillName}`,
    subtitle: `<span class="twbv-skill-attr twbv-attr-${attr.key}">${attr.label}</span>${ferimentoPenalty.label ? ` • ${ferimentoPenalty.label}` : ""}`,
    die: skillDie,
    label: "Perícia",
    bonus: totalBonus,
    finalModifier: ferimentoPenalty.value,
    finalModifierLabel: ferimentoPenalty.label,
    dieDisplay: buildDieLabel(skillDie, skillBonus),
    bonusDetails: rollBonusDetails,
    actor,
    extraContent: attackExtras,
    extraContentPlacement: "top"
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

async function twbvRollPowerSkill(actor, power, { returnContentOnly = false } = {}) {
  if (!actor || !power) return;
  const skillName = String(power.system?.skill ?? power.system?.pericia ?? "").trim();
  if (!skillName) return ui.notifications?.warn(`${power.name} nao tem pericia atribuida.`);
  const skill = findSkillByName(actor.system, skillName);
  if (!skill) return ui.notifications?.warn(`Pericia "${skillName}" nao encontrada em ${actor.name}.`);
  const manaCost = Math.max(0, twbvNumberOrZero(power.system?.manaCost ?? power.system?.mana ?? power.system?.costMana));
  const currentMana = Math.max(0, twbvNumberOrZero(actor.system?.mana?.value));
  if (manaCost > currentMana) {
    const content = `<section class="twbv-power-chat twbv-power-chat--warning"><strong>${escapeHtml(actor.name)}</strong> tentou usar <strong>${escapeHtml(power.name)}</strong>, mas nao tem Mana suficiente. Custo: ${manaCost} | Mana atual: ${currentMana}.</section>`;
    if (returnContentOnly) {
      ui.notifications?.warn(`${actor.name} nao tem Mana suficiente para usar ${power.name}.`);
      return { content, contentWithAdjust: content, total: null, reroll: null };
    }
    await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content, type: CONST.CHAT_MESSAGE_TYPES.OTHER });
    return ui.notifications?.warn(`${actor.name} nao tem Mana suficiente para usar ${power.name}.`);
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
    skillBonus ? { label: "Pericia", value: skillBonus } : null,
    attrBonus ? { label: attr.label, value: attrBonus } : null
  ].filter(Boolean);
  if (twbvActorUsesAwakenedDie(actor)) {
    return renderDualDieResult({
      title: `${power.name} - ${skillName}`,
      subtitle: `<span class="twbv-skill-attr twbv-attr-${attr.key}">${attr.label}</span>${ferimentoPenalty.label ? ` • ${ferimentoPenalty.label}` : ""}`,
      dieA: skillDie,
      labelA: "Pericia",
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
      returnContentOnly
    });
  }
  return renderSingleDieResult({
    title: `${power.name} - ${skillName}`,
    subtitle: `<span class="twbv-skill-attr twbv-attr-${attr.key}">${attr.label}</span>${ferimentoPenalty.label ? ` • ${ferimentoPenalty.label}` : ""}`,
    die: skillDie,
    label: "Pericia",
    bonus: totalBonus,
    finalModifier: ferimentoPenalty.value,
    finalModifierLabel: ferimentoPenalty.label,
    dieDisplay: buildDieLabel(skillDie, skillBonus),
    bonusDetails,
    actor,
    returnContentOnly
  });
}

async function twbvAppendPowerRollToChat(message, powerUuid) {
  const power = await fromUuid(String(powerUuid ?? ""));
  if (!power?.actor) return ui.notifications?.warn("Poder nao encontrado.");
  const rollContent = await twbvRollPowerSkill(power.actor, power, { returnContentOnly: true });
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

async function twbvRollPowerDamageByUuid(powerUuid) {
  const power = await fromUuid(String(powerUuid ?? ""));
  if (!power?.actor) return ui.notifications?.warn("Poder nao encontrado.");
  const formula = String(power.system?.damage ?? power.system?.dano ?? "").trim();
  if (!formula) return ui.notifications?.warn(`${power.name} nao tem dano configurado.`);
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
  if (!power?.actor) return ui.notifications?.warn("Poder nao encontrado.");
  return twbvRollPowerSkill(power.actor, power);
}

async function twbvCreatePowerChatCard(actor, power) {
  if (!actor || !power) return;
  const skillName = String(power.system?.skill ?? power.system?.pericia ?? "").trim();
  const category = String(power.system?.category ?? power.system?.categoria ?? "").trim();
  const requirements = String(power.system?.requirements ?? power.system?.requisitos ?? power.system?.tier ?? "").trim();
  const source = String(power.system?.source ?? power.system?.fonte ?? "").trim();
  const manaCost = Math.max(0, twbvNumberOrZero(power.system?.manaCost ?? power.system?.mana ?? power.system?.costMana));
  const damage = String(power.system?.damage ?? power.system?.dano ?? "").trim();
  const area = String(power.system?.areaEffect ?? power.system?.area ?? "").trim();
  const areaLabel = twbvGetPowerAreaLabel(area);
  const description = String(power.system?.description ?? power.system?.descricao ?? "").trim();
  const effect = String(power.system?.effectsSummary ?? "").trim() || description || "Sem efeito descrito.";
  const icon = power.img ? `<img src="${escapeHtmlAttr(power.img)}" alt="${escapeHtmlAttr(power.name)}" />` : `<i class="fas fa-wand-magic-sparkles"></i>`;
  const meta = [
    skillName ? `Pericia: ${escapeHtml(skillName)}` : "",
    manaCost ? `Mana: ${manaCost}` : "Mana: 0",
    damage ? `Dano: ${escapeHtml(damage)}` : "",
    areaLabel ? `Area: ${escapeHtml(areaLabel)}` : "",
    category ? `Categoria: ${escapeHtml(category)}` : "",
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
          <button type="button" class="twbv-power-roll-button" data-power-uuid="${escapeHtmlAttr(power.uuid)}"><i class="fas fa-dice-d20"></i> Rolar Pericia</button>
          ${damage ? `<button type="button" class="twbv-power-damage-button" data-power-uuid="${escapeHtmlAttr(power.uuid)}"><i class="fas fa-burst"></i> Dano</button>` : ""}
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
    nextSystem.areaEffect = String(nextSystem.areaEffect ?? "none");
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
  return ["vantagem", "desvantagem", "habilidadeEspecial", "poder", "complicacao"].includes(String(type ?? ""));
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
    mergedSystem.areaEffect = String(mergedSystem.areaEffect ?? "none");
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
  if (["vantagem", "desvantagem", "habilidadeEspecial", "poder", "complicacao"].includes(resolved)) {
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
      severity: resolved === "complicacao" ? "Menor" : "",
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
      <label>Nome do item<input type="text" name="name" value="" placeholder="Automático pelo tipo" autofocus /></label>
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
    console.log("[TWBV] Interceptando criação de Item da sidebar.", { label, folder: folder?.name ?? null });
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
  { key: "forca", label: "Força", iconPath: "icons/svg/d20-black.svg" },
  { key: "destreza", label: "Destreza", iconPath: "icons/svg/d20-black.svg" },
  { key: "constituicao", label: "Constituição", iconPath: "icons/svg/d20-black.svg" },
  { key: "inteligencia", label: "Inteligência", iconPath: "icons/svg/d20-black.svg" },
  { key: "intuicao", label: "Intuição", iconPath: "icons/svg/d20-black.svg" },
  { key: "influencia", label: "Influência", iconPath: "icons/svg/d20-black.svg" }
];

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
  if (typeof value === "boolean") return value ? "sim" : "não";
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
        <span>${escapeHtml(user?.name ?? "Usuário")} mexeu em ${escapeHtml(sheetName)}${escapeHtml(itemText)}:</span>
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
  const label = [ferimentos.label, fadiga.label].filter(Boolean).join(" • ");
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
  for (const value of extras) text += `+VÉU D${safeDie}(${value})`;
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
  const formulaText = formatVeuChainText(safeDie, rollValues).replaceAll("+VÃ‰U", " + Véu").replaceAll("+VÉU", " + Véu");
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

async function twbvCreateFormulaRollChat({ actor = null, formula, title = "Rolagem", label = "Resultado", type = CONST.CHAT_MESSAGE_TYPES.OTHER } = {}) {
  const safeFormula = String(formula ?? "").trim();
  if (!safeFormula) return null;
  const roll = await (new Roll(safeFormula)).evaluate();
  await showDice3dRoll(roll);
  const total = Number(roll.total ?? 0);
  const breakdown = twbvDiceTermBreakdownHtml(roll);
  const content = `
    <section class="twbv-roll-chat">
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
      <div class="twbv-roll-chat__top-adjust"><button type="button" class="twbv-roll-adjust" title="Ajustar resultado">🎲 +</button></div>
    </section>`;
  const contentWithAdjust = `${content}<!--TWBV_ADJUST-->${buildRollAdjustSection(total, [])}`;
  return ChatMessage.create({
    speaker: actor ? ChatMessage.getSpeaker({ actor }) : ChatMessage.getSpeaker(),
    content: contentWithAdjust,
    type,
    rolls: [roll],
    flags: {"world-behind-the-veil": {
      rollAdjust: { baseTotal: total, chain: [], baseContent: content },
      reroll: { mode: "formula", actorUuid: actor?.uuid ?? "", args: { formula: safeFormula, title, label, type } }
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
        const chain = formatVeuChainText(faces, rolls).replaceAll("+VÃ‰U", " + Véu").replaceAll("+VÉU", " + Véu");
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
      const chainText = formatVeuChainText(entry.faces, chain).replaceAll("+VÃƒâ€°U", " + Véu").replaceAll("+VÃ‰U", " + Véu");
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

function twbvBuildWeaponDamageFormula(weapon, damageMods = [], { amplified = false } = {}) {
  const base = twbvNormalizeDamageFormulaPart(weapon?.system?.damage, { base: true });
  const extras = damageMods
    .map((mod) => twbvNormalizeDamageFormulaPart(mod?.damage ?? mod?.modifier ?? ""))
    .filter(Boolean);
  if (amplified) extras.push(twbvGetWeaponAmplificationFormula(weapon));
  return `${base}${extras.join("")}`;
}

function twbvChatRerollButtons({ damage = false, weaponUuid = "", amplified = false } = {}) {
  const freeTitle = "Rerrolar gratuitamente";
  const ecoTitle = "Gastar 1 Eco para rerrolar o dano";
  if (damage) {
    return `<div class="twbv-chat-reroll-actions">
      <button type="button" class="twbv-chat-reroll twbv-chat-reroll--free" title="${freeTitle}" data-reroll-kind="damage" data-weapon-uuid="${escapeHtmlAttr(weaponUuid)}" data-damage-mode="${amplified ? "amplified" : "normal"}"><i class="fas fa-rotate-right"></i></button>
      <button type="button" class="twbv-chat-reroll twbv-chat-reroll--eco" title="${ecoTitle}" data-reroll-kind="damage-eco" data-weapon-uuid="${escapeHtmlAttr(weaponUuid)}" data-damage-mode="${amplified ? "amplified" : "normal"}">Éco</button>
    </div>`;
  }
  return `<div class="twbv-chat-reroll-actions">
    <button type="button" class="twbv-chat-reroll twbv-chat-reroll--free" title="${freeTitle}" data-reroll-kind="stored"><i class="fas fa-rotate-right"></i></button>
    <button type="button" class="twbv-chat-reroll twbv-chat-reroll--eco" title="Gastar 1 Eco para rerrolar esta rolagem" data-reroll-kind="stored-eco">Éco</button>
  </div>`;
}

async function twbvBuildWeaponDamageChatContent(actor, weapon, damageMods = [], { amplified = false } = {}) {
  const formula = twbvBuildWeaponDamageFormula(weapon, damageMods, { amplified });
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
    detailedRoll = await twbvEvaluateDamagePartsTogether(rollParts);
  } catch (error) {
    console.error("[TWBV] Fórmula de dano inválida.", { weapon: weapon?.name, formula, error });
    ui.notifications?.error(`Fórmula de dano inválida em ${weapon?.name ?? "arma"}: ${formula}`);
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
    <section class="twbv-roll-chat twbv-damage-chat twbv-damage-chat--compact">
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
  returnContentOnly = false
}) {
  return (async () => {
    const safeDieA = Number(dieA);
    const safeDieB = Number(dieB);

    const [baseA, baseB] = await Promise.all([rollSingleDie(safeDieA), rollSingleDie(safeDieB)]);
    await Promise.all([showDice3dRoll(baseA), showDice3dRoll(baseB)]);

    const rollAData = { total: Number(baseA.total ?? 0), rolls: [Number(baseA.total ?? 0)] };
    const rollBData = { total: Number(baseB.total ?? 0), rolls: [Number(baseB.total ?? 0)] };

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
          <span class="twbv-roll-card__die">${dieDisplay}${veuAtivado ? ' • Véu' : ''}</span>
          <span class="twbv-roll-card__value">${escapeHtml(valueLabel)}</span>
        </summary>
        <div class="twbv-roll-card__value--breakdown">${breakdown}</div>
      </details>`;
    };
    const totalLabel = `${total}`;
    const totalHoverText = `${winnerExpr}${appliedModifier !== 0 ? ` | Modificador(${appliedModifier > 0 ? '+' : ''}${appliedModifier})=${total}` : ''}`;
    const topContent = extraContentPlacement === "top" ? extraContent : "";
    const gridContent = extraContentPlacement === "top" ? "" : extraContent;
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
      ? `<span class="twbv-roll-chat__modifier"> Dado ${baseTotal}${finalModifierLabel ? ` • ${finalModifierLabel}` : ` • Mod ${appliedModifier > 0 ? "+" : ""}${appliedModifier}`}</span>`
      : "";

    const content = `
      <section class="twbv-roll-chat">
        <header class="twbv-roll-chat__header">
          <h3>${title}</h3>
          ${subtitle ? `<p class="${subtitleClass}">${subtitle}</p>` : ""}
        </header>
        ${topContent}
        <div class="twbv-roll-chat__grid">
          ${dieCard(labelA, dieDisplayA ?? `d${dieA}`, safeDieA, skillDieResult, skillBonus, skillTotal, winnerIsSkill, rollAData.rolls, bonusDetailsA)}
          ${dieCard(labelB, dieDisplayB ?? `d${dieB}`, safeDieB, awakenedDieResult, effectiveBonusB, awakenedTotal, !winnerIsSkill, rollBData.rolls, bonusDetailsB)}
          <details class="twbv-roll-card twbv-roll-card--compact twbv-roll-card--total is-selected" title="${escapeHtmlAttr(totalHoverText)}">
            <summary>
              <span class="twbv-roll-card__label">Total</span>
              <span class="twbv-roll-card__die">${escapeHtml(winnerLabel)}</span>
              <span class="twbv-roll-card__value">${totalLabel}</span>
              ${twbvChatRerollButtons()}
            </summary>
            <div class="twbv-roll-card__value--breakdown">${totalDetails}</div>
          </details>
          ${gridContent || ""}
          <div class="twbv-chat-damage-result"></div>
        </div>
        <div class="twbv-roll-chat__top-adjust"><button type="button" class="twbv-roll-adjust" title="Ajustar resultado">🎲 +</button></div>
      </section>`;
    const contentWithAdjust = `${content}<!--TWBV_ADJUST-->${buildRollAdjustSection(total, [])}`;
    const reroll = {
      mode: "dual",
      actorUuid: actor?.uuid ?? "",
      args: { title, dieA, labelA, dieB, labelB, bonus, bonusA, bonusB, dieDisplayA, dieDisplayB, bonusDetailsA, bonusDetailsB, subtitle, subtitleClass, finalModifier, finalModifierLabel, extraContent, extraContentPlacement }
    };
    if (returnContentOnly) return { content, contentWithAdjust, total, reroll };

    const persistedMessage = await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content: contentWithAdjust,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
      flags: {"world-behind-the-veil": { rollAdjust: { baseTotal: total, chain: [], baseContent: content }, reroll }}
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
      ? `<span class="twbv-roll-chat__modifier"> Dado ${modified}${finalModifierLabel ? ` • ${finalModifierLabel}` : ` • Mod ${appliedModifier > 0 ? "+" : ""}${appliedModifier}`}</span>`
      : "";
    const topContent = extraContentPlacement === "top" ? extraContent : "";
    const gridContent = extraContentPlacement === "top" ? "" : extraContent;
    const content = `
      <section class="twbv-roll-chat">
        <header class="twbv-roll-chat__header">
          <h3>${title}</h3>
          ${subtitle ? `<p class="${subtitleClass}">${subtitle}</p>` : ""}
        </header>
        ${topContent}
        <div class="twbv-roll-chat__grid">
          <details class="twbv-roll-card twbv-roll-card--compact is-selected" title="Rolagens: ${rolls.join(' + ')} | Total: ${modified}">
            <summary>
              <span class="twbv-roll-card__label">${label}</span>
              <span class="twbv-roll-card__die">${dieDisplay ?? `d${safeDie}`}${veuAtivado ? ' • Véu' : ''}</span>
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
      args: { title, die, label, bonus, dieDisplay, bonusDetails, subtitle, subtitleClass, finalModifier, finalModifierLabel, extraContent, extraContentPlacement }
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
      const [firstDiePart, ...veuParts] = String(dieText).split("+VÉU ");
      if (firstDiePart) detailParts.push(`+ ${firstDiePart}`);
      for (const veuPart of veuParts) detailParts.push(`+ VÉU ${veuPart}`);
    }
    if (flat) detailParts.push(`${flat > 0 ? "+" : ""}${flat}`);
    detailParts.push(`= ${running + delta}`);
    const detail = detailParts.join(" | ");
    running += delta;
    return `<div class="twbv-adjust-row"><span class="twbv-adjust-left">🎲 ${dieText || "Sem dado"} ${flat ? `${flat > 0 ? "+" : ""}${flat}` : ""}</span><span class="twbv-adjust-right">= ${delta > 0 ? "+" : ""}${delta}</span></div><div class="twbv-adjust-circle-wrap"><div class="twbv-adjust-circle" title="${escapeHtmlAttr(detail)}">${running}</div><button type="button" class="twbv-adjust-remove" data-adjust-index="${index}" title="Remover este ajuste">🗑️</button></div>`;
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
      label: "Configuração",
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
      title: "Configuração da Ficha",
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
      context.condicaoFerimentosLabel = "Saudável";
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

    context.system.avancos = Array.from(context.system.avancos ?? []).map((avanco, index) => ({
      ...avanco,
      numero: Number(avanco?.numero) || index + 1,
      tipo: String(avanco?.tipo ?? "").trim(),
      descricao: String(avanco?.descricao ?? "").trim(),
      sourceIndex: index
    }));

    const currentStageIndex = STAGES.findIndex((stage) => stage.name === currentStage.name);
    context.advancementGroups = STAGES.map((stage, stageIndex) => {
      const entries = context.system.avancos.filter((avanco) => {
        const progression = Math.max(0, Number(avanco.numero ?? 1) - 1);
        return progression >= stage.min && progression <= stage.max;
      });
      return {
        key: stage.name.toLowerCase(),
        name: stage.name.toUpperCase(),
        visible: stageIndex <= currentStageIndex || entries.length > 0,
        entries
      };
    }).filter((stage) => stage.visible);

    context.attributeOptions = ATTRIBUTE_DICE.map((die) => ({ value: die, label: `d${die}` }));
    context.attributeKeys = [
      { key: "forca", label: "Força" },
      { key: "destreza", label: "Destreza" },
      { key: "constituicao", label: "Constituição" },
      { key: "inteligencia", label: "Inteligência" },
      { key: "influencia", label: "Influência" },
      { key: "intuicao", label: "Intuição" }
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
      return {
        ...pericia,
        atributo: String(pericia?.atributo ?? "forca").toLowerCase(),
        dado,
        bonus,
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
      areaEffect: String(item.system?.areaEffect ?? item.system?.area ?? "").trim(),
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
    const complicacoesEmbedded = actorItems.filter((item) => item.type === "complicacao").map(mapItem);

    context.vantagens = vantagensEmbedded.length ? vantagensEmbedded : Array.from(this.actor.system?.vantagens ?? []).map((entry) => mapSystemEntry(entry, "vantagem", "vantagens"));
    context.habilidadesEspeciais = habilidadesEmbedded.length ? habilidadesEmbedded : Array.from(this.actor.system?.habilidadesEspeciais ?? []).map((entry) => mapSystemEntry(entry, "habilidadeEspecial", "habilidadesEspeciais"));
    context.poderes = poderesEmbedded.length ? poderesEmbedded : Array.from(this.actor.system?.poderes ?? []).map((entry) => mapSystemEntry(entry, "poder", "poderes"));
    context.desvantagens = desvantagensEmbedded.length ? desvantagensEmbedded : Array.from(this.actor.system?.desvantagens ?? []).map((entry) => mapSystemEntry(entry, "desvantagem", "desvantagens"));
    context.complicacoes = complicacoesEmbedded.length ? complicacoesEmbedded : Array.from(this.actor.system?.complicacoes ?? []).map((entry) => mapSystemEntry(entry, "complicacao", "complicacoes"));
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
    context.equipmentView = this._equipmentView === "body" ? "body" : "inventory";
    context.activeBonuses = actorItems
      .filter((item) => Boolean(item.system?.active) && summarizeItemActiveEffects(item))
      .map((item) => ({
        name: item.name,
        summary: summarizeItemActiveEffects(item)
      }));

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
    if (!Array.isArray(this.actor.system?.complicacoes)) this.actor.system.complicacoes = [];
    if (!Array.isArray(this.actor.system?.vantagemDivisoes)) this.actor.system.vantagemDivisoes = [];

    const atributos = foundry.utils.deepClone(this.actor.system.atributos ?? {});
    const keys = ["forca", "destreza", "constituicao", "inteligencia", "influencia", "intuicao"];
    for (const key of keys) {
      atributos[key] = atributos[key] ?? {};
      atributos[key].passo = normalizeAttributeStep(atributos[key].passo);
      atributos[key].bonus = Number.isFinite(Number(atributos[key].bonus)) ? Number(atributos[key].bonus) : 0;
    }
  }

  async _onDrop(event) {
    const data = twbvReadDropData(event);
    if (data?.type !== "Item") return super._onDrop(event);
    const payload = await twbvResolveDroppedItemData(data);
    if (!payload) return super._onDrop(event);

    if (twbvIsEquipmentItemType(payload.type)) {
      payload.system.active = payload.system.active ?? true;
      payload.system.equipped = payload.system.equipped ?? false;
    }

    if (payload.type === "armadura") {
      const equipSlot = String(payload.system.equipSlot ?? "").trim();
      payload.system.category = payload.system.category || `armadura${equipSlot ? `:${equipSlot}` : ""}`;
    }

    console.log("[TWBV] Drop de item na ficha.", { actor: this.actor.name, item: payload.name, type: payload.type });
    await this.actor.createEmbeddedDocuments("Item", [payload]);
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
      this._equipmentView = next === "body" ? "body" : "inventory";
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

    html.find(".twbv-add-advancement").on("click", async () => {
      const optionMarkup = ADVANCEMENT_OPTIONS.map((option) => `<option value="${option}">${option}</option>`).join("");
      const dialogContent = `
        <form class="twbv-add-adv-dialog-content">
          <div class="form-group">
            <label>Tipo de avanço</label>
            <select name="tipo" required>
              <option value="">Selecione...</option>
              ${optionMarkup}
            </select>
          </div>
          <div class="form-group">
            <label>Descrição / Anotações</label>
            <textarea name="descricao" rows="4" placeholder="Descreva este avanço..."></textarea>
          </div>
        </form>`;

      const dialog = new Dialog(
        {
          title: "Adicionar avanço",
          content: dialogContent,
          buttons: {
            confirm: {
              label: "Confirmar",
              callback: async (dialogHtml) => {
                const root = resolveDialogRoot(dialogHtml);
                const tipo = String(root?.querySelector('select[name="tipo"]')?.value ?? "").trim();
                if (!tipo) {
                  ui.notifications?.warn("Selecione um tipo de avanço.");
                  return;
                }
                const descricao = String(root?.querySelector('textarea[name="descricao"]')?.value ?? "").trim();
                const avanços = Array.from(this.actor.system.avancos ?? []);
                const numero = avanços.length + 1;
                avanços.push({ numero, tipo, descricao });
                await this.actor.update({ "system.avancos": avanços, "system.avancosTotais": avanços.length });
              }
            },
            cancel: {
              label: "Cancelar"
            }
          },
          default: "confirm"
        },
        {
          width: 520,
          height: "auto"
        }
      );
      dialog.render(true);
      Hooks.once("renderDialog", (app, renderedHtml) => {
        if (app === dialog) applyDialogWindowClass(renderedHtml?.[0] ?? renderedHtml, "wbtv-add-adv-dialog");
      });
    });

    html.find(".twbv-remove-advancement").on("click", async (event) => {
      const index = Number(event.currentTarget.dataset.index);
      const avanços = Array.from(this.actor.system.avancos ?? []);
      avanços.splice(index, 1);
      const normalizedAdvances = avanços.map((avanco, position) => ({ ...avanco, numero: position + 1 }));
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
        { key: "forca", label: "Força" },
        { key: "destreza", label: "Destreza" },
        { key: "constituicao", label: "Constituição" },
        { key: "inteligencia", label: "Inteligência" },
        { key: "influencia", label: "Influência" },
        { key: "intuicao", label: "Intuição" }
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
              const bonusDieValue = String(root?.querySelector('select[name="bonusDie"]')?.value ?? '').replace('d','');
              const bonusDie = Number(bonusDieValue);
              if (twbvActorUsesAwakenedDie(this.actor)) {
              await renderDualDieResult({
                title: skill.nome || `Perícia ${index + 1}`,
                subtitle: `<span class="twbv-skill-attr twbv-attr-${attr.key}">${attr.label}</span>${bonusDie ? ` • dado extra d${bonusDie}` : ''}${manualBonus ? ` • flat ${manualBonus > 0 ? '+' : ''}${manualBonus}` : ''}${ferimentoPenalty.label ? ` • ${ferimentoPenalty.label}` : ''}`,
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
                actor: this.actor
              });
              } else {
                await renderSingleDieResult({
                  title: skill.nome || `PerÃ­cia ${index + 1}`,
                  subtitle: `<span class="twbv-skill-attr twbv-attr-${attr.key}">${attr.label}</span>${bonusDie ? ` â€¢ dado extra d${bonusDie}` : ''}${manualBonus ? ` â€¢ flat ${manualBonus > 0 ? '+' : ''}${manualBonus}` : ''}${ferimentoPenalty.label ? ` â€¢ ${ferimentoPenalty.label}` : ''}`,
                  die: skillDie,
                  label: "PerÃ­cia",
                  bonus: totalBonus,
                  finalModifier: ferimentoPenalty.value,
                  finalModifierLabel: ferimentoPenalty.label,
                  dieDisplay: buildDieLabel(skillDie, skillBonus),
                  actor: this.actor
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
        forca: "Força",
        destreza: "Destreza",
        constituicao: "Constituição",
        inteligencia: "Inteligência",
        influencia: "Influência",
        intuicao: "Intuição"
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
        forca: "Força",
        destreza: "Destreza",
        constituicao: "Constituição",
        inteligencia: "Inteligência",
        influencia: "Influência",
        intuicao: "Intuição"
      };
      const attributeKey = String(event.currentTarget.dataset.attr ?? "");
      if (!attributeKey) return;
      const attrData = this.actor.system.atributos?.[attributeKey] ?? {};
      const attrDie = normalizeAttributeStep(attrData.passo ?? 4);
      const awakenedDie = resolveAwakenedDie(attrDie);
      const ferimentoPenalty = getGlobalRollPenalty(this.actor.system);
      const totalBonus = Number(attrData.bonus ?? 0);
      const bonusTerm = totalBonus === 0 ? "" : `${totalBonus > 0 ? "+" : ""}${totalBonus}`;

      if (twbvActorUsesAwakenedDie(this.actor)) {
        await renderDualDieResult({
        title: labels[attributeKey] ?? attributeKey,
        subtitle: `<span class="twbv-skill-attr twbv-attr-${attributeKey}">${labels[attributeKey] ?? attributeKey}</span>${bonusTerm ? ` • bônus ${bonusTerm}` : ""}${ferimentoPenalty.label ? ` • ${ferimentoPenalty.label}` : ""}`,
        dieA: attrDie,
        labelA: "Atributo",
        dieB: awakenedDie,
        labelB: "Desperto",
        bonus: totalBonus,
        finalModifier: ferimentoPenalty.value,
        finalModifierLabel: ferimentoPenalty.label,
        actor: this.actor
        });
      } else {
        await renderSingleDieResult({
          title: labels[attributeKey] ?? attributeKey,
          subtitle: `<span class="twbv-skill-attr twbv-attr-${attributeKey}">${labels[attributeKey] ?? attributeKey}</span>${bonusTerm ? ` - bonus ${bonusTerm}` : ""}${ferimentoPenalty.label ? ` - ${ferimentoPenalty.label}` : ""}`,
          die: attrDie,
          label: "Atributo",
          bonus: totalBonus,
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
      const dieOptions = SKILL_LEVELS.map((level, index) => `<option value="${index}" data-die="${level.dado}" data-bonus="${level.bonus}" ${index === 0 ? "selected" : ""}>${buildDieLabel(level.dado, level.bonus)}</option>`).join("");
      new Dialog({
        title: "NOVA PERÍCIA",
        content: `<form class="twbv-skill-dialog-form">
          <label>Nome da perícia<input type="text" name="nome" placeholder="Ex.: Atletismo" autofocus /></label>
          <label>Atributo associado<select name="atributo">${SKILL_ATTRIBUTES.map((attr) => `<option value="${attr.key}" ${attr.key === "forca" ? "selected" : ""}>${attr.label}</option>`).join("")}</select></label>
          <div class="twbv-add-skill-row">
            <label>Dado base<select name="skillDie">${dieOptions}</select></label>
            <label>Bônus extra<input type="number" name="bonus" value="0" min="0" max="99" step="1" /></label>
          </div>
          <div class="twbv-add-skill-bottom-row">
            <label>Nível de perícia<input type="text" name="skillLevelLabel" class="twbv-skill-level-chip rank-novato" value="NOVATO" readonly /></label>
            <div class="twbv-skill-preview"><span>Pré-visualização</span><strong>d4+0</strong></div>
          </div>
        </form>`,
        classes: ["wbtv-add-skill-dialog"],
        render: (dialog, html) => {
          const root = resolveDialogRoot(html ?? dialog);
          applyDialogWindowClass(root ?? dialog, "wbtv-add-skill-dialog");
          const form = root?.querySelector?.(".twbv-skill-dialog-form") ?? root?.closest?.(".twbv-skill-dialog-form");
          if (!form) return;
          const skillLevelLabelEl = form.querySelector('input[name="skillLevelLabel"]');
          const dieEl = form.querySelector('select[name="skillDie"]');
          const bonusEl = form.querySelector('input[name="bonus"]');
          const previewEl = form.querySelector(".twbv-skill-preview strong");
          const attributeEl = form.querySelector('select[name="atributo"]');

          const syncAttributeTint = () => {
            if (!attributeEl) return;
            const attrKey = String(attributeEl.value ?? 'forca').toLowerCase();
            attributeEl.classList.remove(
              'twbv-attr-forca',
              'twbv-attr-destreza',
              'twbv-attr-constituicao',
              'twbv-attr-inteligencia',
              'twbv-attr-influencia',
              'twbv-attr-intuicao',
              'twbv-attr-vontade'
            );
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
          syncAttributeTint();
          syncAll();
        },
        buttons: {
          accept: {
            label: "Adicionar",
            callback: async (dialogHtml) => {
              const root = resolveDialogRoot(dialogHtml);
              const nome = String(root?.querySelector('input[name="nome"]')?.value ?? "").trim();
              const atributo = String(root?.querySelector('select[name="atributo"]')?.value ?? "forca").toLowerCase();
              const levelIndex = Number(root?.querySelector('select[name="skillDie"]')?.value ?? 0);
              const selectedLevel = SKILL_LEVELS[levelIndex] ?? SKILL_LEVELS[0];
              const bonusInput = Math.max(0, Number(root?.querySelector('input[name="bonus"]')?.value ?? 0));
              const dado = selectedLevel.dado;
              const bonus = selectedLevel.bonus + bonusInput;
              pericias.push({ nome: nome || `Perícia ${pericias.length + 1}`, atributo, dado, bonus, locked: false });
              await this.actor.update({ "system.pericias": pericias });
            }
          },
          cancel: { label: "Cancelar" }
        },
        default: "accept"
      }).render(true);
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

      const skillDie = SKILL_DICE.includes(Number(pericia.dado)) ? Number(pericia.dado) : 4;
      const totalSkillBonus = Number.isFinite(Number(pericia.bonus)) ? Number(pericia.bonus) : 0;
      const sameDieLevels = SKILL_LEVELS.filter((level) => level.dado === skillDie);
      const baseLevel = (sameDieLevels.length ? sameDieLevels : SKILL_LEVELS).reduce((best, level) => {
        const bestDistance = Math.abs(best.bonus - totalSkillBonus);
        const currentDistance = Math.abs(level.bonus - totalSkillBonus);
        return currentDistance < bestDistance ? level : best;
      }, (sameDieLevels[0] ?? SKILL_LEVELS[0]));
      const baseLevelIndex = SKILL_LEVELS.findIndex((level) => level.dado === baseLevel.dado && level.bonus === baseLevel.bonus);
      const initialExtraBonus = Math.max(0, totalSkillBonus - baseLevel.bonus);
      const dieOptions = SKILL_LEVELS.map((level, idx) => `<option value="${idx}" data-die="${level.dado}" data-bonus="${level.bonus}" ${idx === (baseLevelIndex >= 0 ? baseLevelIndex : 0) ? "selected" : ""}>${buildDieLabel(level.dado, level.bonus)}</option>`).join("");

      const content = `<form class="twbv-skill-dialog-form">
          <label>Nome da perícia<input type="text" name="nome" value="${pericia.nome ?? ""}" autofocus /></label>
          <label>Atributo associado<select name="atributo">${SKILL_ATTRIBUTES.map((attr) => `<option value="${attr.key}" ${attr.key === String(pericia.atributo ?? "forca").toLowerCase() ? "selected" : ""}>${attr.label}</option>`).join("")}</select></label>
          <div class="twbv-add-skill-row">
            <label>Dado base<select name="skillDie">${dieOptions}</select></label>
            <label>Bônus extra<input type="number" name="bonus" value="${initialExtraBonus}" min="0" max="99" step="1" /></label>
          </div>
          <div class="twbv-add-skill-bottom-row">
            <label>Nível de perícia<input type="text" name="skillLevelLabel" class="twbv-skill-level-chip rank-novato" value="NOVATO" readonly /></label>
            <div class="twbv-skill-preview"><span>Pré-visualização</span><strong>${buildDieLabel(skillDie, totalSkillBonus)}</strong></div>
          </div>
        </form>`;

      new Dialog({
        title: `Configurar perícia: ${pericia.nome || `Perícia ${index + 1}`}`,
        content,
        classes: ["wbtv-add-skill-dialog", "wbtv-skill-config-dialog"],
        render: (dialog, html) => {
          const root = resolveDialogRoot(html ?? dialog);
          applyDialogWindowClass(root ?? dialog, "wbtv-add-skill-dialog");
          applyDialogWindowClass(root ?? dialog, "wbtv-skill-config-dialog");
          const form = root?.querySelector?.(".twbv-skill-dialog-form") ?? root?.closest?.(".twbv-skill-dialog-form");
          if (!form) return;

          const skillLevelLabelEl = form.querySelector('input[name="skillLevelLabel"]');
          const dieEl = form.querySelector('select[name="skillDie"]');
          const bonusEl = form.querySelector('input[name="bonus"]');
          const previewEl = form.querySelector('.twbv-skill-preview strong');
          const attributeEl = form.querySelector('select[name="atributo"]');

          const syncAttributeTint = () => {
            if (!attributeEl) return;
            const attrKey = String(attributeEl.value ?? 'forca').toLowerCase();
            attributeEl.classList.remove(
              'twbv-attr-forca',
              'twbv-attr-destreza',
              'twbv-attr-constituicao',
              'twbv-attr-inteligencia',
              'twbv-attr-influencia',
              'twbv-attr-intuicao',
              'twbv-attr-vontade'
            );
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
          syncAttributeTint();
          syncAll();
        },
        buttons: {
          save: {
            label: "Salvar",
            callback: async (dialogHtml) => {
              const root = resolveDialogRoot(dialogHtml);
              const nome = String(root?.querySelector('input[name="nome"]')?.value ?? pericia.nome ?? "").trim();
              const atributo = String(root?.querySelector('select[name="atributo"]')?.value ?? pericia.atributo ?? "forca").toLowerCase();
              const levelIndex = Number(root?.querySelector('select[name="skillDie"]')?.value ?? baseLevelIndex ?? 0);
              const selectedLevel = SKILL_LEVELS[levelIndex] ?? SKILL_LEVELS[0];
              const bonusInput = Math.max(0, Number(root?.querySelector('input[name="bonus"]')?.value ?? 0));
              pericias[index].nome = nome || pericia.nome || `Perícia ${index + 1}`;
              pericias[index].atributo = atributo;
              pericias[index].dado = selectedLevel.dado;
              pericias[index].bonus = selectedLevel.bonus + bonusInput;
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
  async _onWeaponReload(event){event.preventDefault(); const weapon=this.actor.items.get(event.currentTarget.closest('.item')?.dataset.itemId); if(!weapon) return; const ammoName=weapon.system.ammo; const max=Number(weapon.system.shots??0), cur=Number(weapon.system.currentShots??0); const mag=this.actor.items.find(i=>i.type==='consumable'&&i.name===ammoName&&i.system.subtype==='magazine'); if(!mag) return ui.notifications.warn(`Nenhum carregador compatível encontrado: ${ammoName}`); const k=Object.keys(mag.system.charges?.charges??{})[0]; const ch=mag.system.charges?.charges?.[k]; const avail=Number(ch?.value??0); const load=Math.min(max-cur,avail); if(load<=0) return; await weapon.update({'system.currentShots':cur+load}); await mag.update({[`system.charges.charges.${k}.value`]: avail-load});}
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
        <div class="form-group"><label>Categoria</label><input type="text" name="category" value="${itemData.categoria ?? itemData.category ?? ""}" /></div>`,
      complicacao: `
        <div class="form-group">
          <label>Severidade</label>
          <select name="severity">
            <option value="Menor" ${itemData.severity === "Menor" ? "selected" : ""}>Menor</option>
            <option value="Maior" ${itemData.severity === "Maior" ? "selected" : ""}>Maior</option>
            <option value="Ambas" ${itemData.severity === "Ambas" ? "selected" : ""}>Ambas</option>
          </select>
        </div>`
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
          <button type="button" class="twbv-tab-button is-active" data-tab="descricao">Descrição</button>
          <button type="button" class="twbv-tab-button" data-tab="propriedades">Propriedades</button>
          <button type="button" class="twbv-tab-button" data-tab="efeitos">Efeitos</button>
        </nav>
        <section class="twbv-custom-tab-pane is-active" data-tab="descricao">
          <div class="form-group"><label>Nome da Péricia</label><input type="text" name="name" value="${itemData.name ?? ""}" autofocus /></div>
          ${fieldsByType[type] ?? ""}
          <div class="form-group"><label>Descrição</label><textarea name="description" rows="5">${itemData.descricao ?? itemData.description ?? ""}</textarea></div>
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
      effectsList.insertAdjacentHTML("beforeend", `<div class="twbv-effect-row"><input type="text" name="effect-${index}" placeholder="Descrição do efeito ativo" /><button type="button" class="twbv-effect-remove" data-index="${index}"><i class="fas fa-trash"></i></button></div>`);
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
    for (const listKey of ["vantagens", "habilidadesEspeciais", "desvantagens", "complicacoes"]) {
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
        if (twbvIsPowerItemDocument(item)) return twbvCreatePowerChatCard(this.actor, item);
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
            <div class="twbv-trait-chat-card__text">${escapeHtml(data.descricao || "Sem descricao.")}</div>
          </div>
        </details>`,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER
    });
  }

  async _openCustomItemDialog(type, item = null, options = {}) {
    const defaultsByType = {
      vantagem: { title: "Nova Vantagem", severity: "", tierLabel: "Requisito/Tier" },
      desvantagem: { title: "Nova Desvantagem", severity: "", tierLabel: "Requisito/Tier" },
      habilidadeEspecial: { title: "Nova Habilidade", severity: "", tierLabel: "" },
      complicacao: { title: "Nova Complicação", severity: "Menor", tierLabel: "" }
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
        habilidadeEspecial: "Habilidade Especial",
        complicacao: "Complicação"
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
          poder: "poderes",
          complicacao: "complicacoes"
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
          // Não aplicar classes variantes aqui para evitar ativar overrides de tema
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
    rollWeaponAmplifiedDamageByUuid: twbvRollWeaponAmplifiedDamageByUuid
  }, { inplace: false });

  CONFIG.Actor.dataModels = CONFIG.Actor.dataModels || {};

  Handlebars.registerHelper("ifEquals", function (arg1, arg2, options) { return arg1 == arg2 ? options.fn(this) : options.inverse(this); });
  Handlebars.registerHelper("isWeaponType", function (type, options) { return ["arma", "weapon"].includes(String(type ?? "")) ? options.fn(this) : options.inverse(this); });
  await loadTemplates(TWBV_HANDLEBARS_PARTIALS);
  twbvApplyActorTypeConfig();
  twbvPatchActorCreationDefaults();
  twbvApplyItemTypeOrderConfig();
  twbvPatchItemCreateDialog();
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("world-behind-the-veil", TWBVWeaponSheet, { types:["weapon","arma"], makeDefault:true });
  Items.registerSheet("world-behind-the-veil", TWBVConsumableSheet, { types:["consumable"], makeDefault:true });
  Items.registerSheet("world-behind-the-veil", TWBVAmmoSheet, { types:["municao"], makeDefault:true });
  Items.registerSheet("world-behind-the-veil", TWBVArmorSheet, { types:["armadura"], makeDefault:true });
  Items.registerSheet("world-behind-the-veil", TWBVBasicItemSheet, { types:["vantagem","desvantagem","habilidadeEspecial","poder","complicacao","equipamento","modificacao"], makeDefault:true });
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
  twbvPatchWeaponSheetMacros();
  for (const macro of game.macros ?? []) {
    const data = macro?.toObject?.() ?? macro;
    if (twbvMacroLooksLikeItemSheet(data)) await twbvConvertWeaponMacroToAttack(macro, data);
  }
});

async function twbvRerollStoredChatMessage(message, { spendEco = false } = {}) {
  const reroll = foundry.utils.deepClone(message.getFlag("world-behind-the-veil", "reroll") ?? {});
  const actor = reroll.actorUuid ? await fromUuid(reroll.actorUuid) : null;
  if (reroll.actorUuid && !actor) return ui.notifications?.warn("Ator da rolagem não encontrado para rerrolar.");
  if (spendEco && !(await twbvSpendEcoForActor(actor))) return null;
  const currentContent = twbvGetBaseChatContent(message.content);
  let nextMessage = null;
  if (reroll.mode === "dual") {
    if (!actor) return ui.notifications?.warn("Ator da rolagem não encontrado para rerrolar.");
    nextMessage = await renderDualDieResult({ ...(reroll.args ?? {}), actor, returnContentOnly: true });
  }
  else if (reroll.mode === "single") {
    if (!actor) return ui.notifications?.warn("Ator da rolagem não encontrado para rerrolar.");
    nextMessage = await renderSingleDieResult({ ...(reroll.args ?? {}), actor, returnContentOnly: true });
  }
  else if (reroll.mode === "formula") nextMessage = await twbvCreateFormulaRollChat({ ...(reroll.args ?? {}), actor });
  else return ui.notifications?.warn("Essa rolagem ainda não tem dados suficientes para rerrolar.");
  const nextContent = twbvGetBaseChatContent(nextMessage?.content ?? "");
  if (nextMessage?.delete) await nextMessage.delete();
  const compareContent = twbvAppendRerollOption(currentContent, nextContent);
  await message.update({ content: compareContent });
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
  const selected = wrapper.querySelector(".twbv-reroll-option.is-selected");
  return selected?.innerHTML ?? baseContent;
}

function twbvBuildRerollCompareContent(previousContent, nextContent) {
  return `<div class="twbv-reroll-compare" data-selected="1">
    <div class="twbv-reroll-option is-muted" data-reroll-option="0" role="button" tabindex="0" title="Usar esta rolagem">
      ${previousContent}
    </div>
    <div class="twbv-reroll-option is-selected" data-reroll-option="1" role="button" tabindex="0" title="Usar esta rolagem">
      ${nextContent}
    </div>
  </div>`;
}

function twbvAppendRerollOption(existingContent, nextContent) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = String(existingContent ?? "");
  const compare = wrapper.querySelector(".twbv-reroll-compare");
  if (!compare) return twbvBuildRerollCompareContent(existingContent, nextContent);
  const options = Array.from(compare.querySelectorAll(":scope > .twbv-reroll-option"));
  options.forEach((option) => {
    option.classList.remove("is-selected");
    option.classList.add("is-muted");
  });
  const nextIndex = options.length;
  compare.dataset.selected = String(nextIndex);
  compare.insertAdjacentHTML("beforeend", `
    <div class="twbv-reroll-option is-selected" data-reroll-option="${nextIndex}" role="button" tabindex="0" title="Usar esta rolagem">
      ${nextContent}
    </div>`);
  return wrapper.innerHTML;
}

async function twbvSelectRerollOption(message, compareIndex, optionIndex) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = String(message.content ?? "");
  const compare = wrapper.querySelectorAll(".twbv-reroll-compare")[compareIndex];
  if (!compare) return;
  compare.dataset.selected = String(optionIndex);
  compare.querySelectorAll(".twbv-reroll-option").forEach((option, index) => {
    option.classList.toggle("is-selected", index === optionIndex);
    option.classList.toggle("is-muted", index !== optionIndex);
  });
  await message.update({ content: wrapper.innerHTML });
}

function twbvGetCompareAndOptionIndex(root, option) {
  const compare = option?.closest?.(".twbv-reroll-compare");
  if (!compare) return null;
  const compareIndex = Array.from(root.querySelectorAll(".twbv-reroll-compare")).indexOf(compare);
  const optionIndex = Array.from(compare.querySelectorAll(":scope > .twbv-reroll-option")).indexOf(option);
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

async function twbvRerollDamageInChat(message, button, { spendEco = false } = {}) {
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
    current: item.img,
    callback: async (path) => {
      if (!path) return;
      await item.update({ img: path });
    }
  }).render(true);
}

Hooks.on("renderChatMessage", (message, html) => {
  const root = html?.[0] ?? html;
  if (!root || typeof root.querySelector !== "function") return;
  if (!root.querySelector(".twbv-roll-chat")) return;
  root.classList.add("twbv-chat-message");
  if (message.getFlag("world-behind-the-veil", "reroll") && !root.querySelector(".twbv-chat-reroll")) {
    const target = root.querySelector(".twbv-roll-chat__top-adjust") ?? root.querySelector(".twbv-roll-chat");
    target?.insertAdjacentHTML?.("afterbegin", twbvChatRerollButtons());
  }
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
    await twbvAppendPowerRollToChat(message, btn.dataset.powerUuid);
  }));
  root.querySelectorAll(".twbv-power-damage-button").forEach((btn) => btn.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await twbvRollPowerDamageByUuid(btn.dataset.powerUuid);
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
  root.querySelectorAll(".twbv-reroll-option").forEach((option) => {
    const select = async (event) => {
      if (event.target?.closest?.(".twbv-chat-reroll, .twbv-roll-adjust, .twbv-adjust-remove")) return;
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
  const currentName = String(createData?.name ?? item?.name ?? "").trim();
  const looksGeneric = !currentName || /^item(?:\s*\(\d+\))?$/i.test(currentName);
  if (!looksGeneric) return;
  const type = String(createData?.type ?? item?.type ?? "").trim();
  const fallbackByType = {
    vantagem: "Vantagem",
    desvantagem: "Desvantagem",
    habilidadeEspecial: "Habilidade Especial",
    complicacao: "Complicação",
    arma: "Arma",
    armadura: "Armadura",
    weapon: "Arma",
    consumable: "Consumível",
    municao: "Munição",
    modificacao: "Modificação",
    poder: "Poder",
    equipamento: "Equipamento"
  };
  const effectiveType = twbvIsPowerItemDocument(item) ? "poder" : type;
  const nextName = fallbackByType[effectiveType] ?? "Item";
  item.updateSource({ name: nextName });
});

Hooks.on("createItem", async (item) => {
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
    complicacao: "Complicações",
    arma: "Armas",
    weapon: "Armas",
    armadura: "Armaduras",
    consumable: "Consumíveis",
    municao: "Munições",
    modificacao: "Modificações",
    poder: "Poderes",
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
      width: 760,
      height: 860,
      resizable: true,
      submitOnChange: false,
      closeOnSubmit: false,
      submitOnClose: false
    });
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
    context.isTraitItem = twbvIsTraitItemType(this.item?.type) || context.isPowerItem;
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
    const value = this._getFieldValue(input);
    if (value === undefined) return;

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
    const width = Math.min(Math.max(Number(this.position?.width ?? 760), 760), window.innerWidth - 24);
    const height = Math.min(Math.max(Number(this.position?.height ?? 860), 860), window.innerHeight - 24);
    const left = Math.max(12, Math.floor((window.innerWidth - width) / 2));
    const top = 12;
    this.setPosition({ width, height, left, top });
  }

  async _render(force, options = {}) {
    await super._render(force, options);
    this._fitToViewport();
    const root = this.element?.[0] ?? this.element;
    this._bindDirectFieldPersistence(root);
    this._ensureManualSaveButton(root);
  }

  activateListeners(html) {
    super.activateListeners(html);
    this._bindDirectFieldPersistence(html?.[0] ?? html);
    this._ensureManualSaveButton(html?.[0] ?? html);
    const root = html?.[0] ?? html;
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
    button.innerHTML = '<i class="fas fa-save"></i> Salvar Item';
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
      return `<button type="button" class="twbv-weapon-skill-choice${selected}" data-skill-index="${index}"><strong>${skill.name}</strong><span>${attrLabel} • ${buildDieLabel(skill.die, skill.bonus)}</span></button>`;
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
      <button type="button" data-op="minus">−</button>
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
    const despertoFormula = state.desperto ? `1d${state.despertoDie}${state.veu ? "x" : ""}` : "—";
    const trayBreakdown = twbvDiceTermBreakdownHtml(roll);
    const content = `
      <section class="twbv-roll-chat">
        <header class="twbv-roll-chat__header">
          <h3>Rolagem de Bandeja${state.veu ? " • Véu" : ""}</h3>
        </header>
        <div class="twbv-roll-chat__grid">
          <div class="twbv-roll-card">
            <div class="twbv-roll-card__label">Dados Comuns</div>
            <div class="twbv-roll-card__die">${commonFormula || "—"}</div>
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
        <footer class="twbv-roll-chat__total">Resultado: <strong title="Dados comuns: ${commonFormula || "—"} | Desperto: ${despertoFormula} | Modificador: ${state.mod >= 0 ? "+" : ""}${state.mod}">${total}</strong></footer>
        <div class="twbv-roll-chat__top-adjust"><button type="button" class="twbv-roll-adjust" title="Adicionar dado">🎲 +</button></div>
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

Hooks.on('renderChatLog', (app, html) => twbvEnhanceDiceTray(html?.[0] ?? html));
Hooks.on('renderChatLog', (app, html) => twbvInjectCustomDiceTray(html?.[0] ?? html));
Hooks.on('renderChatPopout', (app, html) => {
  twbvEnhanceDiceTray(html?.[0] ?? html);
  twbvInjectCustomDiceTray(html?.[0] ?? html);
});
Hooks.on('renderSidebarTab', (app, html) => {
  if (app?.tabName !== "chat") return;
  twbvEnhanceDiceTray(html?.[0] ?? html);
  twbvInjectCustomDiceTray(html?.[0] ?? html);
});
Hooks.on("ready", () => {
  console.log("[TWBV] Tipos de Actor carregados.", Array.from(game?.system?.documentTypes?.Actor ?? []));
  console.log("[TWBV] Tipos de Item carregados.", Array.from(game?.system?.documentTypes?.Item ?? []));
  twbvApplyActorTypeConfig();
  twbvPatchActorCreationDefaults();
  twbvRegisterActorSheets();
  void twbvNormalizeWorldItemFolders();
  twbvInstallItemDirectoryCreateInterceptor();
  twbvInstallGlobalItemFieldPersistence();
  twbvApplyItemTypeOrderConfig();
  twbvPatchItemCreateDialog();
  setTimeout(() => twbvEnhanceDiceTray(document), 200);
  setTimeout(() => twbvEnhanceDiceTray(document), 1200);
  setTimeout(() => twbvInjectCustomDiceTray(document), 300);
  setTimeout(() => twbvInjectCustomDiceTray(document), 1300);
});
