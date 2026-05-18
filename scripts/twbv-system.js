const STAGES = [
  { name: "Novato", min: 0, max: 3 },
  { name: "Treinado", min: 4, max: 7 },
  { name: "Veterano", min: 8, max: 11 },
  { name: "Elíte", min: 12, max: 15 },
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
      descricao: String(avanco?.descricao ?? "").trim()
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
      await this.actor.update({ "system.avancos": avanços, "system.avancosTotais": avanços.length });
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
