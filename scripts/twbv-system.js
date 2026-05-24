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
  return (new Roll(`1d${Number(die)}`)).evaluate({ async: true });
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

function escapeHtmlAttr(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function applyVeuToFormula(formula) {
  const text = String(formula ?? '').trim();
  if (!text) return '1d4x';
  return text.replace(/(\d*)d(\d+)(?![a-zA-Z])/gi, (match, count, faces) => `${count || 1}d${faces}x`);
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
  subtitle = "",
  subtitleClass = "",
  finalModifier = 0,
  finalModifierLabel = ""
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
    const dieCard = (label, dieDisplay, value, effectiveBonus, modified, selected, selectedRolls = []) => {
      const bonusLabel = effectiveBonus === 0 ? "" : ` ${effectiveBonus > 0 ? "+" : ""}${effectiveBonus}`;
      const valueLabel = effectiveBonus === 0 ? `${value}` : `${value}${bonusLabel} = ${modified}`;
      const veuAtivado = Array.isArray(selectedRolls) && selectedRolls.length > 1;
      const rollBreakdown = Array.isArray(selectedRolls) && selectedRolls.length ? selectedRolls.join(' + ') : `${value}`;
      const hoverText = `Rolagens: ${rollBreakdown}${effectiveBonus !== 0 ? ` | Bônus: ${effectiveBonus > 0 ? '+' : ''}${effectiveBonus}` : ''} | Total: ${modified}`;
      return `
      <div class="twbv-roll-card ${selected ? "is-selected" : ""}">
        <div class="twbv-roll-card__label">${label}</div>
        <div class="twbv-roll-card__die">${dieDisplay}${veuAtivado ? ' • Véu' : ''}</div>
        <div class="twbv-roll-card__value" title="${hoverText}">${valueLabel}</div>
      </div>`;
    };
    const totalLabel = `${total}`;
    const totalHoverText = `${winnerExpr}${appliedModifier !== 0 ? ` | Modificador(${appliedModifier > 0 ? '+' : ''}${appliedModifier})=${total}` : ''}`;

    const modifierDetails = appliedModifier !== 0
      ? `<span class="twbv-roll-chat__modifier"> Dado ${baseTotal}${finalModifierLabel ? ` • ${finalModifierLabel}` : ` • Mod ${appliedModifier > 0 ? "+" : ""}${appliedModifier}`}</span>`
      : "";

    const content = `
      <section class="twbv-roll-chat">
        <header class="twbv-roll-chat__header">
          <h3>${title}</h3>
          ${subtitle ? `<p class="${subtitleClass}">${subtitle}</p>` : ""}
        </header>
        <div class="twbv-roll-chat__grid">
          ${dieCard(labelA, dieDisplayA ?? `d${dieA}`, skillDieResult, skillBonus, skillTotal, skillTotal === total, rollAData.rolls)}
          ${dieCard(labelB, dieDisplayB ?? `d${dieB}`, awakenedDieResult, effectiveBonusB, awakenedTotal, awakenedTotal === total, rollBData.rolls)}
        </div>
        <footer class="twbv-roll-chat__total">Resultado:${modifierDetails}<strong title="${escapeHtmlAttr(totalHoverText)}">${totalLabel}</strong></footer><div class="twbv-roll-chat__top-adjust"><button type="button" class="twbv-roll-adjust" title="Ajustar resultado">🎲 +</button></div>
      </section>`;
    const contentWithAdjust = `${content}<!--TWBV_ADJUST-->${buildRollAdjustSection(total, [])}`;

    const persistedMessage = await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content: contentWithAdjust,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
      flags: {"world-behind-the-veil": { rollAdjust: { baseTotal: total, chain: [], baseContent: content } }}
    });
    return persistedMessage;
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

  getData(options = {}) {
    const context = super.getData(options);
    context.system = this.actor?.system ?? context.system ?? {};
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
    context.system.ferimentos = Math.max(0, Math.min(5, Number(context.system.ferimentos ?? 0)));
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
    context.inconsciente = context.system.fadiga >= 4 || context.system.ferimentos >= 5;
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

    const mapSystemEntry = (entry, fallbackType) => ({
      id: String(entry?.id ?? foundry.utils.randomID()),
      name: String(entry?.nome ?? entry?.name ?? "").trim(),
      icon: String(entry?.icon ?? "").trim(),
      type: fallbackType,
      typeLabel: TWBV_ITEM_TYPES[fallbackType] ?? fallbackType,
      fonte: String(entry?.fonte ?? entry?.source ?? "").trim(),
      categoria: String(entry?.categoria ?? entry?.category ?? "").trim(),
      requisitos: String(entry?.requisitos ?? entry?.requirements ?? "").trim(),
      severity: String(entry?.severity ?? "").trim(),
      descricao: String(entry?.descricao ?? entry?.description ?? "").trim()
    });

    context.vantagens = Array.from(this.actor.system?.vantagens ?? []).map((entry) => mapSystemEntry(entry, "vantagem"));
    context.habilidadesEspeciais = Array.from(this.actor.system?.habilidadesEspeciais ?? []).map((entry) => mapSystemEntry(entry, "habilidadeEspecial"));
    context.complicacoes = Array.from(this.actor.system?.complicacoes ?? []).map((entry) => mapSystemEntry(entry, "complicacao"));
    context.equipamentos = actorItems.filter((item) => ["equipamento", "arma", "armadura"].includes(item.type)).map(mapItem);
    const weapons=actorItems.filter(i=>i.type==="weapon"); const consumables=actorItems.filter(i=>i.type==="consumable"); const magazines=consumables.filter(i=>i.system?.subtype==="magazine"); const normalConsumables=consumables.filter(i=>i.system?.subtype!=="magazine");
    for (const item of [...weapons,...consumables]) { const sys=item.system; if(item.type==="weapon"){const c=Number(sys.currentShots??0),m=Number(sys.shots??0); sys.ammoPercent=m>0?Math.clamp((c/m)*100,0,100):0;} if(item.type==="consumable"&&sys.charges?.hasCharges){const charge=Object.values(sys.charges.charges??{})[0]; sys.mainCharge=charge; if(charge){const v=Number(charge.value??0),m=Number(charge.max??0); sys.chargePercent=m>0?Math.clamp((v/m)*100,0,100):0;}} }
    context.equipment={favorite:actorItems.filter(i=>i.system?.favorite),weapons,magazines,consumables:normalConsumables,others:actorItems.filter(i=>!["weapon","consumable"].includes(i.type))};
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

    this.actor.system.ferimentos = Math.max(0, Math.min(5, Number(this.actor.system.ferimentos ?? 0)));
    this.actor.system.fadiga = Math.max(0, Math.min(4, Number(this.actor.system.fadiga ?? 0)));
    this.actor.system.tamanho = Number.isFinite(Number(this.actor.system.tamanho)) ? Number(this.actor.system.tamanho) : 0;

    if (!Array.isArray(this.actor.system?.condicoes)) this.actor.system.condicoes = [];
    const shouldBeUnconscious = this.actor.system.fadiga >= 4 || this.actor.system.ferimentos >= 5;
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
    if (!Array.isArray(this.actor.system?.complicacoes)) this.actor.system.complicacoes = [];

    const atributos = foundry.utils.deepClone(this.actor.system.atributos ?? {});
    const keys = ["forca", "destreza", "constituicao", "inteligencia", "influencia", "intuicao"];
    for (const key of keys) {
      atributos[key] = atributos[key] ?? {};
      atributos[key].passo = normalizeAttributeStep(atributos[key].passo);
      atributos[key].bonus = Number.isFinite(Number(atributos[key].bonus)) ? Number(atributos[key].bonus) : 0;
    }
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find(".twbv-condition-adjust").on("click", async (event) => {
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
              if (Number.isFinite(bonusDie) && bonusDie > 0) {
                const bonusRoll = await (new Roll(`1d${bonusDie}`)).evaluate();
                await bonusRoll.toMessage({ speaker: ChatMessage.getSpeaker({ actor: this.actor }), flavor: `Dado extra (${skill.nome || `Perícia ${index + 1}`})` });
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
      const roll = await (new Roll(`1d${die}`)).evaluate({ async: true });
      if (game?.dice3d?.showForRoll) await game.dice3d.showForRoll(roll, game.user, true);
      await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: `Corrida (${atletismo?.nome || "Atletismo"}): d${die}`
      });
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
      const type = String(event.currentTarget.dataset.type ?? "equipamento");
      const dialogVersion = String(event.currentTarget.dataset.dialogVersion ?? "");
      if (["vantagem", "habilidadeEspecial", "complicacao"].includes(type)) {
        await this._openCustomItemDialog(type, null, { dialogVersion });
        return;
      }
      const name = `${TWBV_ITEM_TYPES[type] ?? "Item"} ${this.actor.items.size + 1}`;
      await this.actor.createEmbeddedDocuments("Item", [{ type, name }]);
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
        const dialogVersion = String(event.currentTarget.dataset.dialogVersion ?? "");
        await this._openCustomItemDialog(type, entry, { listKey, dialogVersion });
        return;
      }
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
      const sourceType = String(event.currentTarget.dataset.sourceType ?? "item");
      if (sourceType === "system") {
        const listKey = String(event.currentTarget.dataset.listKey ?? "");
        if (!listKey) return;
        const updated = Array.from(this.actor.system?.[listKey] ?? []).filter((entry) => String(entry?.id ?? "") !== itemId);
        await this.actor.update({ [`system.${listKey}`]: updated });
        await this.render(true);
        return;
      }
      await this.actor.deleteEmbeddedDocuments("Item", [itemId]);
    });

    html.find(".twbv-item-card-head--toggle").on("click", (event) => {
      if (event.target.closest(".twbv-item-card-actions")) return;
      event.currentTarget.closest(".twbv-item-card--collapsible")?.classList.toggle("is-collapsed");
    });

    html.find(".item-create").on("click", this._onItemCreate?.bind(this) ?? (async()=>{}));
    html.find(".item-edit").on("click", (e)=>{e.preventDefault(); const i=this.actor.items.get(e.currentTarget.closest(".item")?.dataset.itemId); if(i) i.sheet.render(true);});
    html.find(".item-delete").on("click", async (e)=>{e.preventDefault(); const id=e.currentTarget.closest(".item")?.dataset.itemId; if(id) await this.actor.deleteEmbeddedDocuments("Item",[id]);});
    html.find(".item-toggle-favorite").on("click", this._onToggleFavorite.bind(this));
    html.find(".weapon-roll").on("click", this._onWeaponRoll.bind(this));
    html.find(".weapon-damage").on("click", this._onWeaponDamage.bind(this));
    html.find(".weapon-mod").on("click", this._onWeaponMod.bind(this));
    html.find(".weapon-reload").on("click", this._onWeaponReload.bind(this));
    html.find(".consumable-use").on("click", this._onConsumableUse.bind(this));

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



  _buildWeaponDefaults() { return {description:"",notes:"",source:"",swid:"arma",quantity:1,weight:0,price:0,equippable:true,equipStatus:1,favorite:false,category:"",damage:"",range:"",rangeType:1,rof:1,ap:0,parry:0,minStr:"",shots:0,currentShots:0,ammo:"",reloadType:"magazine",isHeavyWeapon:false,mods:0,actions:{trait:"Atirar",traitMod:"",dmgMod:"",additional:{}},bonusDamageDie:6,bonusDamageDice:1,templates:{cone:false,stream:false,small:false,medium:false,large:false,scone:false}}; }
  _buildConsumableDefaults() { return {description:"",notes:"",source:"",swid:"consumivel",quantity:1,weight:0,price:0,equippable:false,equipStatus:1,favorite:false,category:"",subtype:"regular",charges:{hasCharges:false,charges:{main:{id:"main",value:1,max:1,sort:0,name:"Cargas",rechargeType:"finite"}}},messageOnUse:true,destroyOnEmpty:false}; }
  async _onToggleFavorite(event){event.preventDefault(); const item=this.actor.items.get(event.currentTarget.closest('.item')?.dataset.itemId); if(item) await item.update({'system.favorite': !item.system.favorite});}
  async _onWeaponDamage(event){event.preventDefault(); const item=this.actor.items.get(event.currentTarget.closest('.item')?.dataset.itemId); if(!item) return; const roll=await (new Roll(applyVeuToFormula(item.system.damage||'1d4'))).evaluate(); await roll.toMessage({speaker:ChatMessage.getSpeaker({actor:this.actor}), flavor:`Dano - ${item.name}`});}
  async _onWeaponRoll(event){event.preventDefault(); const item=this.actor.items.get(event.currentTarget.closest('.item')?.dataset.itemId); if(!item) return; const c=Number(item.system.currentShots??0),max=Number(item.system.shots??0); if(max>0&&c<=0) return ui.notifications.warn(`${item.name} está sem munição.`); if(max>0) await item.update({'system.currentShots':Math.max(c-1,0)}); ChatMessage.create({speaker:ChatMessage.getSpeaker({actor:this.actor}),content:`<p><strong>${item.name}</strong> atacou. Munição: ${Math.max(c-1,0)}/${max}</p>`});}
  async _onWeaponMod(event){event.preventDefault(); const row=event.currentTarget.closest('.item'); const item=this.actor.items.get(row?.dataset.itemId); const key=event.currentTarget.dataset.modKey; const mod=item?.system?.actions?.additional?.[key]; if(!item||!mod) return; const c=Number(item.system.currentShots??0), cost=Number(mod.resourcesUsed??0); if(cost>c) return ui.notifications.warn(`${item.name} não tem munição suficiente para usar ${mod.name}.`); if(cost>0) await item.update({'system.currentShots':Math.max(c-cost,0)}); if(mod.type==='damage'){const roll=await (new Roll(applyVeuToFormula(`${item.system.damage||'1d4'}${mod.modifier||''}`))).evaluate(); await roll.toMessage({speaker:ChatMessage.getSpeaker({actor:this.actor}), flavor:`Dano - ${item.name} - ${mod.name}`});} else ChatMessage.create({speaker:ChatMessage.getSpeaker({actor:this.actor}),content:`<p>${item.name} usou ${mod.name}.</p>`});}
  async _onWeaponReload(event){event.preventDefault(); const weapon=this.actor.items.get(event.currentTarget.closest('.item')?.dataset.itemId); if(!weapon) return; const ammoName=weapon.system.ammo; const max=Number(weapon.system.shots??0), cur=Number(weapon.system.currentShots??0); const mag=this.actor.items.find(i=>i.type==='consumable'&&i.name===ammoName&&i.system.subtype==='magazine'); if(!mag) return ui.notifications.warn(`Nenhum carregador compatível encontrado: ${ammoName}`); const k=Object.keys(mag.system.charges?.charges??{})[0]; const ch=mag.system.charges?.charges?.[k]; const avail=Number(ch?.value??0); const load=Math.min(max-cur,avail); if(load<=0) return; await weapon.update({'system.currentShots':cur+load}); await mag.update({[`system.charges.charges.${k}.value`]: avail-load});}
  async _onConsumableUse(event){event.preventDefault(); const item=this.actor.items.get(event.currentTarget.closest('.item')?.dataset.itemId); if(!item) return; const k=Object.keys(item.system.charges?.charges??{})[0]; const ch=item.system.charges?.charges?.[k]; if(item.system.charges?.hasCharges&&(!ch||ch.value<=0)) return ui.notifications.warn(`${item.name} não possui cargas restantes.`); if(item.system.charges?.hasCharges) await item.update({[`system.charges.charges.${k}.value`]: ch.value-1}); ChatMessage.create({speaker:ChatMessage.getSpeaker({actor:this.actor}),content:`<p>${this.actor.name} usou <strong>${item.name}</strong>.</p>`});}

  async _onItemCreate(event){event.preventDefault(); const type=event.currentTarget.dataset.type; const itemData={name:type==='weapon'?'Nova Arma':'Novo Consumível', type, system:type==='weapon'?this._buildWeaponDefaults():this._buildConsumableDefaults()}; await this.actor.createEmbeddedDocuments('Item',[itemData]);}

  _buildCustomItemDialogContent(type, itemData = {}, options = {}) {
    const dialogVersion = String(options.dialogVersion ?? "");
    const isV2 = dialogVersion === "2";
    if (["vantagem", "habilidadeEspecial"].includes(type)) {
      const effects = Array.isArray(itemData.effects) ? itemData.effects : [];
      const effectsMarkup = effects.length
        ? effects.map((effect, index) => `<div class="twbv-effect-row"><input type="text" name="effect-${index}" value="${effect}" /><button type="button" class="twbv-effect-remove" data-index="${index}"><i class="fas fa-trash"></i></button></div>`).join("")
        : `<p class="twbv-tab-empty">Nenhum efeito ativo cadastrado.</p>`;
      return `
      <form class="twbv-custom-item-form twbv-custom-item-form--sheetlike" data-type="${type}">
        <div class="twbv-custom-item-side">
          <button type="button" class="twbv-custom-item-iconbox twbv-custom-item-iconbox-button" title="Clique para configurar ícone">
            <img class="twbv-custom-item-icon-preview" src="${itemData.icon || "icons/svg/mystery-man.svg"}" alt="Imagem do ícone" />
            <span class="twbv-custom-item-icon-placeholder">Imagem</span>
          </button>
        </div>
        <div class="twbv-custom-item-main">
          <div class="twbv-custom-item-title-wrap"><input type="text" class="twbv-custom-item-title-input" name="name" value="${itemData.name ?? ""}" placeholder="Nome da vantagem" autofocus /></div>
          <div class="twbv-custom-item-grid2 twbv-custom-item-grid2--header">
            <div class="form-group"><label>Pré Requisito</label><input type="text" name="requirements" value="${itemData.requisitos ?? itemData.requirements ?? ""}" /></div>
            <div class="form-group"><label>Categoria</label><input type="text" name="category" value="${itemData.categoria ?? itemData.category ?? ""}" /></div>
          </div>
          <div class="twbv-custom-item-grid2 twbv-custom-item-grid2--header">
            <div class="form-group"><label>Fonte</label><input type="text" name="source" value="${itemData.fonte ?? itemData.source ?? ""}" /></div>
            <input type="hidden" name="icon" value="${itemData.icon ?? ""}" />
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
    const iconPreview = root.querySelector(".twbv-custom-item-icon-preview");
    const iconButton = root.querySelector(".twbv-custom-item-iconbox-button");
    const openIconSourceDialog = async () => {
      try {
        const picker = new FilePicker({
          type: "image",
          current: String(iconInput?.value ?? "").trim() || "icons/",
          callback: (selectedPath) => {
            if (!iconInput) return;
            iconInput.value = String(selectedPath ?? "").trim();
            syncIconPreview();
          }
        });

        // Compatibilidade: algumas versões abrem com render(true), outras exigem browse().
        let opened = false;
        if (typeof picker?.render === "function") {
          picker.render(true);
          opened = Boolean(picker?.rendered ?? picker?.element?.length);
        }
        if (!opened && typeof picker?.browse === "function") {
          await picker.browse();
          opened = true;
        }
      } catch (error) {
        console.error("TWBV | Falha ao abrir FilePicker de ícone", error);
        ui.notifications?.error("Não foi possível abrir o popup de seleção de imagem.");
      }
    };
    const syncIconPreview = () => {
      const iconValue = String(iconInput?.value ?? "").trim();
      if (iconPreview && iconValue) iconPreview.src = iconValue;
      if (iconPreview && !iconValue) iconPreview.src = "icons/svg/mystery-man.svg";
    };
    iconInput?.addEventListener("input", syncIconPreview);
    const triggerIconPicker = async (event) => {
      event?.preventDefault?.();
      event?.stopPropagation?.();
      await openIconSourceDialog();
    };
    iconButton?.addEventListener("click", triggerIconPicker);
    iconPreview?.addEventListener("click", triggerIconPicker);
    root.addEventListener("click", (event) => {
      const target = event.target?.closest?.(".twbv-custom-item-iconbox-button, .twbv-custom-item-icon-preview, .twbv-custom-item-icon-placeholder");
      if (!target) return;
      triggerIconPicker(event);
    });
    iconButton?.addEventListener("keydown", async (event) => {
      if (!["Enter", " "].includes(event.key)) return;
      triggerIconPicker(event);
    });
    syncIconPreview();
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

  async _openCustomItemDialog(type, item = null, options = {}) {
    const defaultsByType = {
      vantagem: { title: "Nova Vantagem", severity: "", tierLabel: "Requisito/Tier" },
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
        habilidadeEspecial: "Habilidade Especial",
        complicacao: "Complicação"
      };
      const nome = typedName || defaultNameByType[type] || "Vantagem";
      if (!typedName) nameInput.value = nome;

      const payload = this._collectCustomItemDialogData(root, type, defaults.severity);
      const isEmbeddedItem = item && typeof item.update === "function";
      if (isEmbeddedItem) {
        await item.update(payload);
      } else {
        const listKeyByType = {
          vantagem: "vantagens",
          habilidadeEspecial: "habilidadesEspeciais",
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

Hooks.once("init", () => {
  console.log("[TWBV] Inicializando sistema The World Behind the Veil");

  CONFIG.Actor.dataModels = CONFIG.Actor.dataModels || {};

  Handlebars.registerHelper("ifEquals", function (arg1, arg2, options) { return arg1 == arg2 ? options.fn(this) : options.inverse(this); });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("world-behind-the-veil", TWBVWeaponSheet, { types:["weapon"], makeDefault:true });
  Items.registerSheet("world-behind-the-veil", TWBVConsumableSheet, { types:["consumable"], makeDefault:true });
  Actors.registerSheet("world-behind-the-veil", TWBVPersonagemSheet, {
    types: ["personagem", "despertos", "semi-despertos", "sombras"],
    makeDefault: true
  });
});

Hooks.on("renderChatMessage", (message, html) => {
  const root = html?.[0] ?? html;
  if (!root || typeof root.querySelector !== "function") return;
  if (!root.querySelector(".twbv-roll-chat")) return;
  root.classList.add("twbv-chat-message");
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


class TWBVWeaponSheet extends ItemSheet { static get defaultOptions(){ return foundry.utils.mergeObject(super.defaultOptions,{classes:['twbv','sheet','item','weapon-sheet'],width:720,height:720,tabs:[{navSelector:'.sheet-tabs',contentSelector:'.sheet-body',initial:'general'}]}); } get template(){ return `systems/${game.system.id}/templates/item/weapon-sheet.hbs`; } activateListeners(html){ super.activateListeners(html); html.find('.mod-create').on('click', async (e)=>{e.preventDefault(); const key=foundry.utils.randomID(8); await this.item.update({[`system.actions.additional.${key}`]:{name:'Nova Modificação',type:'trait',dice:null,resourcesUsed:null,modifier:'',override:'',ap:null,uuid:null,macroActor:'default',isHeavyWeapon:false}});}); html.find('.mod-delete').on('click', async (e)=>{e.preventDefault(); const key=e.currentTarget.closest('.mod-row')?.dataset.modKey; if(key) await this.item.update({[`system.actions.additional.-=${key}`]:null});}); }}
class TWBVConsumableSheet extends ItemSheet { static get defaultOptions(){ return foundry.utils.mergeObject(super.defaultOptions,{classes:['twbv','sheet','item','consumable-sheet'],width:680,height:680,tabs:[{navSelector:'.sheet-tabs',contentSelector:'.sheet-body',initial:'general'}]}); } get template(){ return `systems/${game.system.id}/templates/item/consumable-sheet.hbs`; }}


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
    const content = `
      <section class="twbv-roll-chat">
        <header class="twbv-roll-chat__header">
          <h3>Rolagem de Bandeja${state.veu ? " • Véu" : ""}</h3>
        </header>
        <div class="twbv-roll-chat__grid">
          <div class="twbv-roll-card">
            <div class="twbv-roll-card__label">Dados Comuns</div>
            <div class="twbv-roll-card__die">${commonFormula || "—"}</div>
          </div>
          <div class="twbv-roll-card">
            <div class="twbv-roll-card__label">Desperto</div>
            <div class="twbv-roll-card__die">${despertoFormula}</div>
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
      flags: {"world-behind-the-veil": { rollAdjust: { baseTotal: total, chain: [], baseContent: content } }}
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
  setTimeout(() => twbvEnhanceDiceTray(document), 200);
  setTimeout(() => twbvEnhanceDiceTray(document), 1200);
  setTimeout(() => twbvInjectCustomDiceTray(document), 300);
  setTimeout(() => twbvInjectCustomDiceTray(document), 1300);
});
