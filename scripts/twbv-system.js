const STAGES = [
  { name: "Novato", min: 0, max: 3 },
  { name: "Treinado", min: 4, max: 7 },
  { name: "Veterano", min: 8, max: 11 },
  { name: "Elíte", min: 12, max: 15 },
  { name: "Mítico", min: 16, max: 19 },
  { name: "Lendário", min: 20, max: Infinity }
];

const ADVANCEMENT_OPTIONS = [
  "Uma Nova Vantagem e uma Perícia",
  "Três Péricias",
  "Um Atributo e uma perícia",
  "Remover uma Desvantagem",
  "Duas novas mágias e 2 pontos de poder",
  "5 pontos de poder e uma mágia"
];

const ATTRIBUTE_DICE = [4, 6, 8, 10, 12];
const SKILL_STEPS = [
  { die: 4, bonus: -2, label: "Sem perícia (d4-2)" },
  { die: 4, bonus: 0, label: "d4" },
  { die: 4, bonus: 1, label: "d4+1" },
  { die: 6, bonus: 1, label: "d6+1" },
  { die: 6, bonus: 2, label: "d6+2" },
  { die: 8, bonus: 2, label: "d8+2" },
  { die: 8, bonus: 3, label: "d8+3" },
  { die: 10, bonus: 3, label: "d10+3" },
  { die: 10, bonus: 4, label: "d10+4" },
  { die: 12, bonus: 4, label: "d12+4" }
];

function buildDieLabel(die, bonus = 0) {
  return `d${die}${bonus > 0 ? `+${bonus}` : bonus < 0 ? `${bonus}` : ""}`;
}

function normalizeAttributeStep(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 4;
  if (ATTRIBUTE_DICE.includes(parsed)) return parsed;
  return ATTRIBUTE_DICE[Math.max(0, Math.min(parsed, ATTRIBUTE_DICE.length - 1))];
}

class TWBVPersonagemSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["twbv", "sheet", "actor", "personagem"],
      width: 960,
      height: 800,
      tabs: [{ navSelector: ".twbv-tabs", contentSelector: ".twbv-tab-content", initial: "principal" }]
    });
  }

  get template() {
    return `systems/${game.system.id}/templates/actor/personagem-sheet.hbs`;
  }

  getData(options = {}) {
    const context = super.getData(options);
    context.system = this.actor?.system ?? context.system ?? {};
    context.advancementOptions = ADVANCEMENT_OPTIONS;

    const advances = Number(context.system.avancosTotais ?? 0);
    const currentStage = STAGES.find((stage) => advances >= stage.min && advances <= stage.max) ?? STAGES[0];
    context.stageName = currentStage.name;
    context.stages = STAGES.map((stage) => ({
      name: stage.name,
      range: Number.isFinite(stage.max) ? `${stage.min}-${stage.max}` : `${stage.min}+`,
      current: stage.name === currentStage.name
    }));

    context.attributeOptions = ATTRIBUTE_DICE.map((die) => ({ value: die, label: `d${die}` }));
    context.attributeKeys = [
      { key: "forca", label: "Força" },
      { key: "destreza", label: "Destreza" },
      { key: "constituicao", label: "Constituição" },
      { key: "inteligencia", label: "Inteligência" },
      { key: "intuicao", label: "Intuição" },
      { key: "vontade", label: "Vontade" }
    ];
    context.skillOptions = SKILL_STEPS.map((step, idx) => ({ value: idx - 1, label: step.label }));
    context.system.pericias = (context.system.pericias ?? []).map((pericia) => {
      const step = Number(pericia.passo ?? -1);
      const skillIndex = Math.max(0, Math.min(step + 1, SKILL_STEPS.length - 1));
      return { ...pericia, label: SKILL_STEPS[skillIndex].label };
    });

    this._ensureSystemDefaults();

    return context;
  }

  _ensureSystemDefaults() {
    const pericias = Array.from(this.actor.system.pericias ?? []);
    for (let i = 0; i < pericias.length; i += 1) {
      if (typeof pericias[i] === "string") pericias[i] = { nome: pericias[i], passo: -1, bonus: 0 };
      pericias[i].nome = String(pericias[i].nome ?? "").trim() || `Perícia ${i + 1}`;
      pericias[i].passo = Number.isFinite(Number(pericias[i].passo)) ? Number(pericias[i].passo) : -1;
      pericias[i].bonus = Number.isFinite(Number(pericias[i].bonus)) ? Number(pericias[i].bonus) : 0;
    }

    const atributos = foundry.utils.deepClone(this.actor.system.atributos ?? {});
    const keys = ["forca", "destreza", "constituicao", "inteligencia", "intuicao", "vontade"];
    for (const key of keys) {
      atributos[key] = atributos[key] ?? {};
      atributos[key].passo = normalizeAttributeStep(atributos[key].passo);
      atributos[key].bonus = Number.isFinite(Number(atributos[key].bonus)) ? Number(atributos[key].bonus) : 0;
    }
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find(".twbv-add-advancement").on("click", async () => {
      const avanços = Array.from(this.actor.system.avancos ?? []);
      avanços.push({ tipo: "" });
      await this.actor.update({ "system.avancos": avanços, "system.avancosTotais": avanços.length });
    });

    html.find(".twbv-remove-advancement").on("click", async (event) => {
      const index = Number(event.currentTarget.dataset.index);
      const avanços = Array.from(this.actor.system.avancos ?? []);
      avanços.splice(index, 1);
      await this.actor.update({ "system.avancos": avanços, "system.avancosTotais": avanços.length });
    });

    html.find(".twbv-eco-adjust").on("click", async (event) => {
      const adjust = Number(event.currentTarget.dataset.adjust ?? 0);
      const ecoAtual = Number(this.actor.system.eco ?? 0);
      const novoEco = Math.max(0, ecoAtual + adjust);
      await this.actor.update({ "system.eco": novoEco });
    });

    html.find(".twbv-add-skill").on("click", async () => {
      const pericias = Array.from(this.actor.system.pericias ?? []);
      pericias.push({ nome: "", passo: -1, bonus: 0 });
      await this.actor.update({ "system.pericias": pericias });
    });
  }
}

Hooks.once("init", () => {
  console.log("[TWBV] Inicializando sistema The World Behind the Veil");

  CONFIG.Actor.dataModels = CONFIG.Actor.dataModels || {};

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("world-behind-the-veil", TWBVPersonagemSheet, {
    makeDefault: true
  });
});
