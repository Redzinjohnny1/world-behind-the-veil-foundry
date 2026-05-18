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
  complicacao: "Complicação",
  equipamento: "Equipamento",
  arma: "Arma",
  armadura: "Armadura"
};

function summarizeItemActiveEffects(item) {
  const explicitSummary = String(item.system?.effectsSummary ?? "").trim();
  if (explicitSummary) return explicitSummary;
  const changes = Array.from(item.effects ?? []).flatMap((effect) =>
    Array.from(effect.changes ?? []).map((change) => String(change.key ?? "").trim()).filter(Boolean)
  );
  if (!changes.length) return "";
  return changes.slice(0, 3).join(", ");
}

const ATTRIBUTE_DICE = [4, 6, 8, 10, 12];
const SKILL_DICE = [4, 6, 8, 10, 12];
const SKILL_LEVELS = [
  { dado: 4, bonus: 0 },
  { dado: 4, bonus: 1 },
  { dado: 6, bonus: 1 },
  { dado: 6, bonus: 2 },
  { dado: 8, bonus: 2 },
  { dado: 8, bonus: 3 },
  { dado: 10, bonus: 3 },
  { dado: 10, bonus: 4 },
  { dado: 12, bonus: 5 }
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



function resolveAwakenedDie(attributeDie) {
  const die = normalizeAttributeStep(attributeDie);
  if (die <= 6) return 4;
  if (die <= 10) return 6;
  return 8;
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
  actor,
  subtitle = ""
}) {
  return (async () => {
    const rollA = await new Roll(`1d${dieA}`).evaluate();
    const rollB = await new Roll(`1d${dieB}`).evaluate();
    const valueA = Number(rollA.total ?? 0);
    const valueB = Number(rollB.total ?? 0);
    const effectiveBonusA = Number.isFinite(Number(bonusA)) ? Number(bonusA) : Number(bonus ?? 0);
    const effectiveBonusB = Number.isFinite(Number(bonusB)) ? Number(bonusB) : Number(bonus ?? 0);

    const skillDieResult = valueA;
    const skillBonus = effectiveBonusA;
    const skillTotal = skillDieResult + skillBonus;

    const awakenedDieResult = valueB;
    const awakenedTotal = awakenedDieResult + effectiveBonusB;

    const total = Math.max(skillTotal, awakenedTotal);
    const dieCard = (label, dieDisplay, value, effectiveBonus, modified, selected) => {
      const bonusLabel = effectiveBonus === 0 ? "" : ` ${effectiveBonus > 0 ? "+" : ""}${effectiveBonus}`;
      const valueLabel = effectiveBonus === 0 ? `${value}` : `${value}${bonusLabel} = ${modified}`;
      return `
      <div class="twbv-roll-card ${selected ? "is-selected" : ""}">
        <div class="twbv-roll-card__label">${label}</div>
        <div class="twbv-roll-card__die">${dieDisplay}</div>
        <div class="twbv-roll-card__value">${valueLabel}</div>
      </div>`;
    };
    const totalLabel = `${total}`;

    const content = `
      <section class="twbv-roll-chat">
        <header class="twbv-roll-chat__header">
          <h3>${title}</h3>
          ${subtitle ? `<p>${subtitle}</p>` : ""}
        </header>
        <div class="twbv-roll-chat__grid">
          ${dieCard(labelA, dieDisplayA ?? `d${dieA}`, skillDieResult, skillBonus, skillTotal, skillTotal === total)}
          ${dieCard(labelB, dieDisplayB ?? `d${dieB}`, awakenedDieResult, effectiveBonusB, awakenedTotal, awakenedTotal === total)}
        </div>
        <footer class="twbv-roll-chat__total">Resultado: <strong>${totalLabel}</strong></footer>
      </section>`;

    const inlineRoll = await new Roll(String(total)).toMessage({
      speaker: ChatMessage.getSpeaker({ actor }),
      flavor: content
    });
    return inlineRoll;
  })();
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
  if (!root || !className) return;
  const windowApp = root.closest?.(".window-app");
  if (windowApp) windowApp.classList.add(className);
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
      { key: "intuicao", label: "Intuição" },
      { key: "vontade", label: "Vontade" }
    ];
    context.skillDiceOptions = SKILL_LEVELS.map((level, index) => ({
      value: index,
      label: buildDieLabel(level.dado, level.bonus),
      dado: level.dado,
      bonus: level.bonus
    }));
    context.system.pericias = Array.from(context.system.pericias ?? []).map((pericia) => {
      const dado = SKILL_DICE.includes(Number(pericia?.dado)) ? Number(pericia.dado) : 4;
      let bonus = Number.isFinite(Number(pericia?.bonus)) ? Number(pericia.bonus) : 0;
      const normalizedLevel = SKILL_LEVELS.find((level) => level.dado === dado && level.bonus === bonus);
      if (!normalizedLevel) {
        const closestLevel = SKILL_LEVELS.reduce((best, level) => {
          const bestDistance = Math.abs(best.dado - dado) + Math.abs(best.bonus - bonus);
          const currentDistance = Math.abs(level.dado - dado) + Math.abs(level.bonus - bonus);
          return currentDistance < bestDistance ? level : best;
        }, SKILL_LEVELS[0]);
        bonus = closestLevel.bonus;
      }
      return {
        ...pericia,
        dado,
        bonus,
        locked: Boolean(pericia?.locked),
        levelIndex: SKILL_LEVELS.findIndex((level) => level.dado === dado && level.bonus === bonus),
        rollLabel: buildDieLabel(dado, bonus)
      };
    });

    const actorItems = Array.from(this.actor.items ?? []);
    const parseNumber = (value, fallback = 0) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    };

    const mapItem = (item) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      typeLabel: TWBV_ITEM_TYPES[item.type] ?? item.type,
      active: Boolean(item.system?.active),
      equipped: Boolean(item.system?.equipped),
      tier: String(item.system?.tier ?? "").trim(),
      severity: String(item.system?.severity ?? "").trim(),
      description: String(item.system?.description ?? "").trim(),
      effectsSummary: summarizeItemActiveEffects(item),
      quantity: parseNumber(item.system?.quantity, 1),
      weight: parseNumber(item.system?.weight),
      cost: parseNumber(item.system?.cost),
      damage: String(item.system?.damage ?? "").trim(),
      range: String(item.system?.range ?? "").trim(),
      bonus: String(item.system?.bonus ?? "").trim(),
      protection: String(item.system?.protection ?? "").trim(),
      penalty: String(item.system?.penalty ?? "").trim(),
      tags: String(item.system?.tags ?? "").trim()
    });

    context.vantagens = actorItems.filter((item) => item.type === "vantagem").map(mapItem);
    context.habilidadesEspeciais = actorItems.filter((item) => item.type === "habilidadeEspecial").map(mapItem);
    context.complicacoes = actorItems.filter((item) => ["complicacao", "desvantagem"].includes(item.type)).map(mapItem);
    context.equipamentos = actorItems.filter((item) => ["equipamento", "arma", "armadura"].includes(item.type)).map(mapItem);
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
      const normalizedLevel = SKILL_LEVELS.find((level) => level.dado === pericias[i].dado && level.bonus === pericias[i].bonus);
      if (!normalizedLevel) {
        const closestLevel = SKILL_LEVELS.reduce((best, level) => {
          const bestDistance = Math.abs(best.dado - pericias[i].dado) + Math.abs(best.bonus - pericias[i].bonus);
          const currentDistance = Math.abs(level.dado - pericias[i].dado) + Math.abs(level.bonus - pericias[i].bonus);
          return currentDistance < bestDistance ? level : best;
        }, SKILL_LEVELS[0]);
        pericias[i].dado = closestLevel.dado;
        pericias[i].bonus = closestLevel.bonus;
      }
      pericias[i].locked = Boolean(pericias[i].locked);
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
      if (event.target?.matches?.('input[name="system.eco"]')) return;
      event.preventDefault();
      await updateEcoValue(-1, { triggerEffect: true });
    });

    html.find(".twbv-eco-spend-trigger").on("keydown", async (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      await updateEcoValue(-1, { triggerEffect: true });
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
        { key: "intuicao", label: "Intuição" },
        { key: "vontade", label: "Vontade" }
      ];

      const options = attributes.map((attr) => `<option value="${attr.key}">${attr.label}</option>`).join("");
      new Dialog({
        title: `Rolar perícia: ${skill.nome || `Perícia ${index + 1}`}`,
        content: `<div class="twbv-roll-skill-dialog"><label>Atributo<select name="attr">${options}</select></label><label>Bônus manual<input type="number" name="manualBonus" value="0" step="1" /></label></div>`,
        buttons: {
          roll: {
            label: "Rolar",
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
              const totalBonus = skillBonus + attrBonus + (Number.isFinite(manualBonus) ? manualBonus : 0);
              await renderDualDieResult({
                title: skill.nome || `Perícia ${index + 1}`,
                subtitle: attr.label,
                dieA: skillDie,
                labelA: "Perícia",
                dieB: awakenedDie,
                labelB: "Desperto",
                bonusA: totalBonus,
                bonusB: 0,
                dieDisplayA: buildDieLabel(skillDie, skillBonus),
                dieDisplayB: `d${awakenedDie}`,
                actor: this.actor
              });
            }
          },
          cancel: { label: "Cancelar" }
        },
        default: "roll"
      }).render(true);
    };

    html.find(".twbv-skill-roll").on("click", openSkillRollDialog);
    html.find(".twbv-edit-skill-roll").on("click", openSkillRollDialog);

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
      const awakenedDie = resolveAwakenedDie(attrDie);
      const totalBonus = Number(attrData.bonus ?? 0);
      const bonusTerm = totalBonus === 0 ? "" : `${totalBonus > 0 ? "+" : ""}${totalBonus}`;

      await renderDualDieResult({
        title: labels[attributeKey] ?? attributeKey,
        subtitle: `Atributo vs. Desperto${bonusTerm ? ` • bônus ${bonusTerm}` : ""}`,
        dieA: attrDie,
        labelA: "Atributo",
        dieB: awakenedDie,
        labelB: "Desperto",
        bonus: totalBonus,
        actor: this.actor
      });
    });

    html.find(".twbv-add-skill").on("click", async (event) => {
      event.preventDefault();
      await this._onSubmit(event, { preventClose: true, preventRender: true });

      const pericias = foundry.utils.deepClone(this.actor.system.pericias ?? []);
      new Dialog({
        title: "Adicionar perícia",
        content: `<div><label>Nome da perícia<input type="text" name="nome" placeholder="Ex: Arcanismo" autofocus /></label><label>Dado da perícia<select name="skillLevel">${SKILL_LEVELS.map((level, index) => `<option value="${index}" ${index === 0 ? "selected" : ""}>${buildDieLabel(level.dado, level.bonus)}</option>`).join("")}</select></label></div>`,
        classes: ["wbtv-add-skill-dialog"],
        render: (dialog, html) => {
          applyDialogWindowClass(html ?? dialog, "wbtv-add-skill-dialog");
        },
        buttons: {
          accept: {
            label: "Aceitar",
            callback: async (dialogHtml) => {
              const root = resolveDialogRoot(dialogHtml);
              const nome = String(root?.querySelector('input[name="nome"]')?.value ?? "").trim();
              const skillLevel = Number(root?.querySelector('select[name="skillLevel"]')?.value ?? 0);
              const selectedLevel = SKILL_LEVELS[skillLevel] ?? SKILL_LEVELS[0];
              pericias.push({ nome: nome || `Perícia ${pericias.length + 1}`, dado: selectedLevel.dado, bonus: selectedLevel.bonus, locked: false });
              await this.actor.update({ "system.pericias": pericias });
            }
          },
          cancel: { label: "Cancelar" }
        },
        default: "accept"
      }).render(true);
    });

    html.find(".twbv-edit-skill-config").on("click", async (event) => {
      event.preventDefault();
      await this._onSubmit(event, { preventClose: true, preventRender: true });

      const index = Number(event.currentTarget.dataset.index ?? -1);
      if (index < 0) return;
      const pericias = foundry.utils.deepClone(this.actor.system.pericias ?? []);
      const pericia = pericias[index];
      if (!pericia) return;

      const currentLevelIndex = SKILL_LEVELS.findIndex((level) => level.dado === Number(pericia.dado) && level.bonus === Number(pericia.bonus));
      const levelOptions = SKILL_LEVELS.map((level, index) => `<option value="${index}" ${index === (currentLevelIndex >= 0 ? currentLevelIndex : 0) ? "selected" : ""}>${buildDieLabel(level.dado, level.bonus)}</option>`).join("");
      const content = `
        <div class="twbv-edit-skill-dialog">
          <label>Nome
            <input type="text" name="nome" value="${pericia.nome ?? ""}" />
          </label>
          <label>Nível da perícia
            <select name="skillLevel">${levelOptions}</select>
          </label>
        </div>
      `;

      new Dialog({
        title: `Configurar perícia: ${pericia.nome || `Perícia ${index + 1}`}`,
        content,
        classes: ["wbtv-skill-config-dialog"],
        render: (dialog, html) => {
          applyDialogWindowClass(html ?? dialog, "wbtv-skill-config-dialog");
        },
        buttons: {
          save: {
            label: "Salvar",
            callback: async (dialogHtml) => {
              const root = resolveDialogRoot(dialogHtml);
              const nome = String(root?.querySelector('input[name="nome"]')?.value ?? pericia.nome ?? "").trim();
              const skillLevel = Number(root?.querySelector('select[name="skillLevel"]')?.value ?? currentLevelIndex ?? 0);
              const selectedLevel = SKILL_LEVELS[skillLevel] ?? SKILL_LEVELS[0];
              pericias[index].nome = nome || pericia.nome || `Perícia ${index + 1}`;
              pericias[index].dado = selectedLevel.dado;
              pericias[index].bonus = selectedLevel.bonus;
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
      const type = String(event.currentTarget.dataset.type ?? "equipamento");
      if (["vantagem", "habilidadeEspecial", "complicacao"].includes(type)) {
        await this._openCustomItemDialog(type);
        return;
      }
      const name = `${TWBV_ITEM_TYPES[type] ?? "Item"} ${this.actor.items.size + 1}`;
      await this.actor.createEmbeddedDocuments("Item", [{ type, name }]);
    });

    html.find(".twbv-item-edit").on("click", async (event) => {
      event.preventDefault();
      const itemId = String(event.currentTarget.dataset.itemId ?? "");
      const item = this.actor.items.get(itemId);
      if (!item) return;
      if (["vantagem", "habilidadeEspecial", "complicacao"].includes(item.type)) {
        await this._openCustomItemDialog(item.type, item);
        return;
      }
      item.sheet?.render(true);
    });

    html.find(".twbv-item-delete").on("click", async (event) => {
      event.preventDefault();
      const itemId = String(event.currentTarget.dataset.itemId ?? "");
      if (!itemId) return;
      await this.actor.deleteEmbeddedDocuments("Item", [itemId]);
    });

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

  _buildCustomItemDialogContent(type, itemData = {}) {
    const fieldsByType = {
      vantagem: `
        <div class="form-group"><label>Categoria</label><input type="text" name="category" value="${itemData.categoria ?? itemData.category ?? ""}" /></div>
        <div class="form-group"><label>Requisitos</label><input type="text" name="requirements" value="${itemData.requisitos ?? itemData.requirements ?? ""}" /></div>`,
      habilidadeEspecial: `<div class="form-group"><label>Categoria</label><input type="text" name="category" value="${itemData.categoria ?? itemData.category ?? ""}" /></div>`,
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
    const propertiesField = type === "vantagem" ? `
      <div class="twbv-property-checkboxes">
        <label><input type="checkbox" name="isArcaneBackground" ${itemData.isArcaneBackground ? "checked" : ""} /> Antecedente Arcano</label>
        <label><input type="checkbox" name="hasCharges" ${itemData.hasCharges ? "checked" : ""} /> Possui Cargas</label>
      </div>` : `<p class="twbv-tab-empty">Sem propriedades adicionais para este tipo.</p>`;
    const effects = Array.isArray(itemData.effects) ? itemData.effects : [];
    const effectsMarkup = effects.length
      ? effects.map((effect, index) => `<div class="twbv-effect-row"><input type="text" name="effect-${index}" value="${effect}" /><button type="button" class="twbv-effect-remove" data-index="${index}"><i class="fas fa-trash"></i></button></div>`).join("")
      : `<p class="twbv-tab-empty">Nenhum efeito ativo cadastrado.</p>`;
    return `
      <form class="twbv-custom-item-dialog twbv-custom-item-dialog--tabs" data-type="${type}">
        <nav class="twbv-custom-tabs">
          <button type="button" class="twbv-tab-button is-active" data-tab="descricao">Descrição</button>
          <button type="button" class="twbv-tab-button" data-tab="propriedades">Propriedades</button>
          <button type="button" class="twbv-tab-button" data-tab="efeitos">Efeitos</button>
        </nav>
        <section class="twbv-custom-tab-pane is-active" data-tab="descricao">
          <div class="form-group"><label>Nome</label><input type="text" name="name" value="${itemData.name ?? ""}" required autofocus /></div>
          <div class="form-group"><label>Fonte</label><input type="text" name="source" value="${itemData.fonte ?? itemData.source ?? ""}" /></div>
          ${fieldsByType[type] ?? ""}
          <div class="form-group"><label>Descrição</label><textarea name="description" rows="5">${itemData.descricao ?? itemData.description ?? ""}</textarea></div>
        </section>
        <section class="twbv-custom-tab-pane" data-tab="propriedades">${propertiesField}</section>
        <section class="twbv-custom-tab-pane" data-tab="efeitos">
          <button type="button" class="twbv-effect-add"><i class="fas fa-plus"></i> Adicionar efeito ativo</button>
          <div class="twbv-effects-list">${effectsMarkup}</div>
        </section>
      </form>`;
  }

  _bindCustomDialogUi(root) {
    const tabButtons = root.querySelectorAll(".twbv-tab-button");
    tabButtons.forEach((button) => button.addEventListener("click", () => {
      const tab = button.dataset.tab;
      root.querySelectorAll(".twbv-tab-button").forEach((btn) => btn.classList.toggle("is-active", btn === button));
      root.querySelectorAll(".twbv-custom-tab-pane").forEach((pane) => pane.classList.toggle("is-active", pane.dataset.tab === tab));
    }));
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
  }

  _collectCustomItemDialogData(root, type, defaultSeverity = "Menor") {
    const name = String(root?.querySelector('input[name="name"]')?.value ?? "").trim();
    const fonte = String(root?.querySelector('input[name="source"]')?.value ?? "").trim();
    const categoria = String(root?.querySelector('input[name="category"]')?.value ?? "").trim();
    const requisitos = String(root?.querySelector('input[name="requirements"]')?.value ?? "").trim();
    const descricao = String(root?.querySelector('textarea[name="description"]')?.value ?? "").trim();
    const severity = String(root?.querySelector('select[name="severity"]')?.value ?? defaultSeverity).trim();
    const isArcaneBackground = Boolean(root?.querySelector('input[name="isArcaneBackground"]')?.checked);
    const hasCharges = Boolean(root?.querySelector('input[name="hasCharges"]')?.checked);
    const effects = Array.from(root?.querySelectorAll('.twbv-effect-row input[type="text"]') ?? []).map((input) => String(input.value ?? "").trim()).filter(Boolean);
    return {
      name,
      system: {
        fonte,
        categoria,
        requisitos,
        descricao,
        source: fonte,
        category: categoria,
        requirements: requisitos,
        description: descricao,
        severity,
        isArcaneBackground,
        hasCharges,
        activeEffects: effects,
        active: true
      }
    };
  }


  _setCustomDialogValidationState(root) {
    const form = root?.querySelector("form.twbv-custom-item-dialog");
    const nameInput = form?.querySelector('input[name="name"]');
    const saveButton = root?.querySelector('.dialog-buttons .dialog-button[data-button="save"]');
    if (!form || !nameInput || !saveButton) return;
    const isValid = form.checkValidity() && String(nameInput.value ?? "").trim().length > 0;
    saveButton.disabled = !isValid;
  }

  _bindCustomDialogFormSubmit(root, onSubmit) {
    const form = root?.querySelector("form.twbv-custom-item-dialog");
    if (!form || typeof onSubmit !== "function") return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      await onSubmit();
    });
    form.addEventListener("input", () => this._setCustomDialogValidationState(root));
    this._setCustomDialogValidationState(root);
  }

  async _openCustomItemDialog(type, item = null) {
    const defaultsByType = {
      vantagem: { title: "Nova Vantagem", severity: "", tierLabel: "Requisito/Tier" },
      habilidadeEspecial: { title: "Nova Habilidade Especial", severity: "", tierLabel: "" },
      complicacao: { title: "Nova Complicação", severity: "Menor", tierLabel: "" }
    };
    const defaults = defaultsByType[type] ?? defaultsByType.vantagem;
    const itemData = {
      name: item?.name ?? "",
      fonte: item?.system?.fonte ?? item?.system?.source ?? "",
      categoria: item?.system?.categoria ?? item?.system?.category ?? "",
      requisitos: item?.system?.requisitos ?? item?.system?.requirements ?? item?.system?.tier ?? "",
      descricao: item?.system?.descricao ?? item?.system?.description ?? "",
      severity: item?.system?.severity ?? defaults.severity,
      isArcaneBackground: Boolean(item?.system?.isArcaneBackground),
      hasCharges: Boolean(item?.system?.hasCharges),
      effects: Array.isArray(item?.system?.activeEffects) ? item.system.activeEffects : []
    };
    const content = this._buildCustomItemDialogContent(type, itemData);

    const submitItemForm = async (root, dialogApp) => {
      const form = root?.querySelector("form.twbv-custom-item-dialog");
      const nameInput = form?.querySelector('input[name="name"]');
      if (!form || !nameInput) return;
      if (!form.checkValidity() || !String(nameInput.value ?? "").trim()) {
        nameInput.setCustomValidity("Nome é obrigatório.");
        form.reportValidity();
        nameInput.setCustomValidity("");
        this._setCustomDialogValidationState(root);
        return;
      }

      const payload = this._collectCustomItemDialogData(root, type, defaults.severity);
      if (item) await item.update(payload);
      else await this.actor.createEmbeddedDocuments("Item", [{ type, ...payload }]);
      await dialogApp.close();
    };

    const dialog = new Dialog({
      title: item ? `Editar ${item.name}` : defaults.title,
      content,
      render: (dialogApp, renderedHtml) => {
        const root = resolveDialogRoot(renderedHtml);
        if (!root) return;
        this._bindCustomDialogUi(root);
        this._bindCustomDialogFormSubmit(root, async () => submitItemForm(root, dialogApp));
        applyDialogWindowClass(renderedHtml ?? dialogApp, "wbtv-custom-item-dialog");
      },
      buttons: {
        save: {
          label: "Salvar",
          callback: async (dialogHtml) => {
            const root = resolveDialogRoot(dialogHtml);
            await submitItemForm(root, dialog);
            return false;
          }
        },
        cancel: {
          label: "Cancelar",
          callback: async () => {
            await dialog.close();
          }
        }
      },
      default: "save",
      close: () => {
        const root = dialog.element?.[0];
        const nameInput = root?.querySelector('input[name="name"]');
        if (nameInput) nameInput.setCustomValidity("");
      }
    }, { width: 520, height: "auto" });
    dialog.render(true);
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

Hooks.on("renderChatMessage", (message, html) => {
  const root = html?.[0] ?? html;
  if (!root || typeof root.querySelector !== "function") return;
  if (!root.querySelector(".twbv-roll-chat")) return;
  root.classList.add("twbv-chat-message");
});
