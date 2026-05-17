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
const SKILL_DICE = [4, 6, 8, 10, 12];

function buildDieLabel(die, bonus = 0) {
  return `d${die}${bonus > 0 ? `+${bonus}` : bonus < 0 ? `${bonus}` : ""}`;
}

function normalizeAttributeStep(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 4;
  if (ATTRIBUTE_DICE.includes(parsed)) return parsed;
  return ATTRIBUTE_DICE[Math.max(0, Math.min(parsed, ATTRIBUTE_DICE.length - 1))];
}


function resolveDialogRoot(dialog) {
  if (!dialog) return null;
  if (typeof dialog.querySelector === "function") return dialog;
  if (dialog.element?.querySelector) return dialog.element;
  if (dialog.window?.element?.querySelector) return dialog.window.element;
  if (Array.isArray(dialog.element) && dialog.element[0]?.querySelector) return dialog.element[0];
  return null;
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
    context.skillDiceOptions = SKILL_DICE.map((die) => ({ value: die, label: `d${die}` }));
    context.system.pericias = Array.from(context.system.pericias ?? []).map((pericia) => {
      const dado = SKILL_DICE.includes(Number(pericia?.dado)) ? Number(pericia.dado) : 4;
      const bonus = Number.isFinite(Number(pericia?.bonus)) ? Number(pericia.bonus) : 0;
      return {
        ...pericia,
        dado,
        bonus,
        rollLabel: buildDieLabel(dado, bonus)
      };
    });

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
      delete pericias[i].passo;
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

    html.find(".twbv-skill-roll").on("click", async (event) => {
      const index = Number(event.currentTarget.dataset.index ?? -1);
      const skill = this.actor.system.pericias?.[index];
      if (!skill) return;

      const skillDie = SKILL_DICE.includes(Number(skill.dado)) ? Number(skill.dado) : 4;
      const totalBonus = Number(skill.bonus ?? 0);
      const bonusTerm = totalBonus === 0 ? "" : `${totalBonus > 0 ? "+" : ""}${totalBonus}`;
      const formula = `1d${skillDie}${bonusTerm}`;

      const roll = await new Roll(formula).evaluate();
      await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: `${skill.nome || `Perícia ${index + 1}`} • ${buildDieLabel(skillDie, totalBonus)}`
      });
    });

    html.find(".twbv-attr-roll").on("click", async (event) => {
      const labels = {
        forca: "Força",
        destreza: "Destreza",
        constituicao: "Constituição",
        inteligencia: "Inteligência",
        intuicao: "Intuição",
        vontade: "Vontade"
      };
      const attributeKey = String(event.currentTarget.dataset.attr ?? "");
      if (!attributeKey) return;
      const attrData = this.actor.system.atributos?.[attributeKey] ?? {};
      const attrDie = normalizeAttributeStep(attrData.passo ?? 4);
      const totalBonus = Number(attrData.bonus ?? 0);
      const bonusTerm = totalBonus === 0 ? "" : `${totalBonus > 0 ? "+" : ""}${totalBonus}`;
      const formula = `1d${attrDie}${bonusTerm}`;

      const roll = await new Roll(formula).evaluate();
      await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: `${labels[attributeKey] ?? attributeKey} • ${buildDieLabel(attrDie, totalBonus)}`
      });
    });

    html.find(".twbv-add-skill").on("click", async (event) => {
      event.preventDefault();
      await this._onSubmit(event, { preventClose: true, preventRender: true });

      const pericias = foundry.utils.deepClone(this.actor.system.pericias ?? []);
      pericias.push({ nome: "", dado: 4, bonus: 0 });
      await this.actor.update({ "system.pericias": pericias });
    });

    html.find(".twbv-edit-skill-roll").on("click", async (event) => {
      event.preventDefault();
      await this._onSubmit(event, { preventClose: true, preventRender: true });

      const index = Number(event.currentTarget.dataset.index ?? -1);
      if (index < 0) return;
      const pericias = foundry.utils.deepClone(this.actor.system.pericias ?? []);
      const pericia = pericias[index];
      if (!pericia) return;

      const diceOptions = SKILL_DICE.map((die) => `<option value="${die}" ${Number(pericia.dado) === die ? "selected" : ""}>d${die}</option>`).join("");
      const content = `
        <div class="twbv-edit-skill-dialog">
          <label>Dado
            <select name="dado">${diceOptions}</select>
          </label>
          <label>Bônus
            <input type="number" name="bonus" value="${Number(pericia.bonus ?? 0)}" />
          </label>
        </div>
      `;

      new Dialog({
        title: `Editar rolagem: ${pericia.nome || `Perícia ${index + 1}`}`,
        content,
        buttons: {
          save: {
            label: "Salvar",
            callback: async (dialogHtml) => {
              const root = resolveDialogRoot(dialogHtml);
              const dado = Number(root?.querySelector('select[name="dado"]')?.value ?? pericia.dado ?? 4);
              const bonus = Number(root?.querySelector('input[name="bonus"]')?.value ?? pericia.bonus ?? 0);
              pericias[index].dado = SKILL_DICE.includes(dado) ? dado : 4;
              pericias[index].bonus = Number.isFinite(bonus) ? bonus : 0;
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
      pericias.splice(index, 1);
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
