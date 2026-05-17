class TWBVPersonagemSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["twbv", "sheet", "actor", "personagem"],
      template: "systems/world-behind-the-veil/templates/actor/personagem-sheet.hbs",
      width: 920,
      height: 780,
      tabs: [
        {
          navSelector: ".twbv-tabs",
          contentSelector: ".twbv-tab-content",
          initial: "resumo"
        }
      ]
    });
  }

  getData(options = {}) {
    const context = super.getData(options);
    context.system = context.actor.system;
    return context;
  }
}

Hooks.once("init", () => {
  console.log("[TWBV] Inicializando sistema The World Behind the Veil");

  CONFIG.Actor.dataModels = CONFIG.Actor.dataModels || {};

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("world-behind-the-veil", TWBVPersonagemSheet, {
    types: ["personagem"],
    makeDefault: true
  });
});
