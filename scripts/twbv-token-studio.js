const TWBV_TOKEN_STUDIO_ID = "world-behind-the-veil";
const TWBV_TOKEN_STUDIO_APPS = new Map();
const TWBV_TOKEN_STUDIO_PRESETS = {
  veil: { label: "Véu Arcano", outer: "#9a62e8", inner: "#ead29a", glow: "#783dd1", bg: "#10091d", frame: "assets/token-studio/frames/veil-arcane.png" },
  crimson: { label: "Ritual Carmesim", outer: "#c9485d", inner: "#f1b078", glow: "#7d172c", bg: "#19080d", frame: "assets/token-studio/frames/crimson-ritual.png" },
  obsidian: { label: "Obsidiana Espectral", outer: "#43dff4", inner: "#c9faff", glow: "#168aa1", bg: "#05090d", frame: "assets/token-studio/frames/obsidian-spectral.png" },
  celestial: { label: "Celestial de Prata", outer: "#dbe8ff", inner: "#ffffff", glow: "#8fb8ff", bg: "#101729", frame: "assets/token-studio/frames/celestial-silver.png" },
  infernal: { label: "Latão Infernal", outer: "#bd7138", inner: "#ffb35e", glow: "#9b2e17", bg: "#180905", frame: "assets/token-studio/frames/infernal-brass.png" },
  druidic: { label: "Espinhos Druídicos", outer: "#9a713c", inner: "#f2bb65", glow: "#536e2f", bg: "#11170b", frame: "assets/token-studio/frames/druidic-thorns.png" },
  steampunk: { label: "Engrenagem", outer: "#c0793e", inner: "#84dce1", glow: "#865022", bg: "#101114", frame: "assets/token-studio/frames/steampunk-clockwork.png" },
  cyber: { label: "Cyber Véu", outer: "#34dffc", inner: "#d13cff", glow: "#206bb9", bg: "#050912", frame: "assets/token-studio/frames/cyber-veil.png" },
  ghost: { label: "Ectoplasma", outer: "#b8ecff", inner: "#e6fbff", glow: "#67cce8", bg: "#07141a", frame: "assets/token-studio/frames/ghost-ectoplasm.png" },
  divine: { label: "Santuário Divino", outer: "#e4c16d", inner: "#fffbed", glow: "#d7a63b", bg: "#19150b", frame: "assets/token-studio/frames/divine-sanctum.png" },
  psionic: { label: "Ametista Psiônica", outer: "#a65cf0", inner: "#e0bfff", glow: "#7331be", bg: "#11091d", frame: "assets/token-studio/frames/psionic-amethyst.png" },
  jutsu: { label: "Jutsu Escarlate", outer: "#db3647", inner: "#f2cfb2", glow: "#9b1327", bg: "#15070a", frame: "assets/token-studio/frames/jutsu-scarlet.png" },
  witch: { label: "Lua da Bruxa", outer: "#b4a6dd", inner: "#dfd4ff", glow: "#7955be", bg: "#0d0918", frame: "assets/token-studio/frames/witch-moon.png" },
  frost: { label: "Runa de Gelo", outer: "#8edcff", inner: "#effcff", glow: "#429ed1", bg: "#06121b", frame: "assets/token-studio/frames/frost-rune.png" },
  flame: { label: "Forjado em Chamas", outer: "#d78035", inner: "#ffd176", glow: "#b33718", bg: "#190905", frame: "assets/token-studio/frames/flame-forged.png" },
  royal: { label: "Ônix Real", outer: "#e1b85f", inner: "#ef405c", glow: "#8c1930", bg: "#09070a", frame: "assets/token-studio/frames/royal-onyx.png" },
  noir: { label: "Detetive Noir", outer: "#aeb4bd", inner: "#d9a653", glow: "#785727", bg: "#090a0d", frame: "assets/token-studio/frames/noir-detective.png" },
  fae: { label: "Fada do Crepúsculo", outer: "#8fdfe2", inner: "#d9f4ff", glow: "#5a95c3", bg: "#09131a", frame: "assets/token-studio/frames/fae-twilight.png" },
  necromantic: { label: "Osso Necromântico", outer: "#d6cab1", inner: "#a9e2f2", glow: "#638d9a", bg: "#0b0d0e", frame: "assets/token-studio/frames/necromantic-bone.png" },
  modern: { label: "Moderno Minimalista", outer: "#d6b978", inner: "#ae62e9", glow: "#6d3aa0", bg: "#08070b", frame: "assets/token-studio/frames/minimalist-modern.png" },
  samurai: { label: "Xogum Samurai", outer: "#d2a14c", inner: "#e44a45", glow: "#8e2525", bg: "#0b0808", frame: "assets/token-studio/frames/samurai-shogun.png" },
  egyptian: { label: "Sol Egípcio", outer: "#edc54e", inner: "#347ed1", glow: "#b68525", bg: "#111026", frame: "assets/token-studio/frames/egyptian-sun.png" },
  abyssal: { label: "Vazio Abissal", outer: "#7160cc", inner: "#c18aff", glow: "#402590", bg: "#05040a", frame: "assets/token-studio/frames/abyssal-void.png" },
  ocean: { label: "Maré Oceânica", outer: "#6edee5", inner: "#f0e1bd", glow: "#278bab", bg: "#06151a", frame: "assets/token-studio/frames/ocean-tide.png" },
  vampire: { label: "Lua de Sangue", outer: "#c5344c", inner: "#ddd4d8", glow: "#7c1429", bg: "#100408", frame: "assets/token-studio/frames/vampire-bloodmoon.png" },
  alchemist: { label: "Oficina Alquímica", outer: "#c5984f", inner: "#65d4ef", glow: "#327e91", bg: "#0c1010", frame: "assets/token-studio/frames/alchemist-flask.png" },
  solar: { label: "Leão Solar", outer: "#efc55c", inner: "#fff1ba", glow: "#b77920", bg: "#181106", frame: "assets/token-studio/frames/solar-lion.png" },
  storm: { label: "Senhor da Tempestade", outer: "#56bdf5", inner: "#e3f7ff", glow: "#296cbb", bg: "#070d17", frame: "assets/token-studio/frames/storm-thunder.png" },
  crystal: { label: "Prisma de Cristal", outer: "#bcecff", inner: "#f7dcff", glow: "#729fd7", bg: "#0c101b", frame: "assets/token-studio/frames/crystal-prism.png" },
  baroque: { label: "Rosa Barroca", outer: "#dab877", inner: "#9e3049", glow: "#714238", bg: "#140b0d", frame: "assets/token-studio/frames/baroque-rose.png" },
  tribal: { label: "Osso Tribal", outer: "#c69a62", inner: "#eadaba", glow: "#7f4d28", bg: "#100c08", frame: "assets/token-studio/frames/tribal-bone.png" },
  dieselpunk: { label: "Motor Dieselpunk", outer: "#ad8654", inner: "#ed7538", glow: "#8b3c1e", bg: "#0c0d0f", frame: "assets/token-studio/frames/dieselpunk-engine.png" },
  cosmic: { label: "Galáxia Cósmica", outer: "#685ee9", inner: "#c56ee9", glow: "#3e2fb0", bg: "#050612", frame: "assets/token-studio/frames/cosmic-galaxy.png" },
  serpent: { label: "Serpentes Míticas", outer: "#d1a552", inner: "#f2c070", glow: "#83562d", bg: "#0b0a08", frame: "assets/token-studio/frames/serpent-jade.png" },
  paladin: { label: "Égide do Paladino", outer: "#e5cf8b", inner: "#76bdf2", glow: "#447db7", bg: "#0a1018", frame: "assets/token-studio/frames/paladin-aegis.png" },
  rogue: { label: "Sombra do Ladino", outer: "#8d8d9e", inner: "#a86dde", glow: "#56357e", bg: "#07070a", frame: "assets/token-studio/frames/rogue-shadow.png" },
  scroll: { label: "Pergaminho Ancestral", outer: "#c69a5b", inner: "#eee0b3", glow: "#8a5129", bg: "#120d08", frame: "assets/token-studio/frames/ancient-scroll.png" },
  sakura: { label: "Sonho de Sakura", outer: "#e9d9da", inner: "#a7e6f3", glow: "#708ab9", bg: "#0c0d14", frame: "assets/token-studio/frames/sakura-dream.png" },
  mycelium: { label: "Círculo Micélio", outer: "#8fdce8", inner: "#e9bd6a", glow: "#497f98", bg: "#09110f", frame: "assets/token-studio/frames/mycelium-fae.png" },
  eldritch: { label: "Olho Eldritch", outer: "#7bd2e2", inner: "#ad69df", glow: "#4c5897", bg: "#07070d", frame: "assets/token-studio/frames/eldritch-eye.png" },
  angelic: { label: "Asas Angelicais", outer: "#eee8d5", inner: "#f0c969", glow: "#9fbde8", bg: "#11131a", frame: "assets/token-studio/frames/angelic-wings.png" },
  demonic: { label: "Correntes Demoníacas", outer: "#a92d3a", inner: "#e06a45", glow: "#6f1722", bg: "#100507", frame: "assets/token-studio/frames/demonic-chain.png" },
  nomad: { label: "Nômade do Deserto", outer: "#bd874b", inner: "#586bb1", glow: "#775124", bg: "#130e08", frame: "assets/token-studio/frames/desert-nomad.png" },
  rabbit: { label: "Coelho Lunar", outer: "#dce7f5", inner: "#8ecceb", glow: "#758eb8", bg: "#0b1019", frame: "assets/token-studio/frames/moon-rabbit.png" },
  dragon: { label: "Escamas do Dragão", outer: "#bb3445", inner: "#e0ad51", glow: "#7e1c28", bg: "#100608", frame: "assets/token-studio/frames/dragon-scale.png" },
  phoenix: { label: "Renascimento da Fênix", outer: "#ed9a37", inner: "#ffd26e", glow: "#b43d1d", bg: "#170806", frame: "assets/token-studio/frames/phoenix-rebirth.png" },
  stag: { label: "Cervo da Floresta", outer: "#b5a176", inner: "#e4b059", glow: "#667641", bg: "#0b1009", frame: "assets/token-studio/frames/forest-stag.png" },
  clockmage: { label: "Mago Relojoeiro", outer: "#b88648", inner: "#64d3e8", glow: "#397f91", bg: "#0b0e10", frame: "assets/token-studio/frames/clockwork-mage.png" },
  punk: { label: "Neon Punk", outer: "#ed49c5", inner: "#4de3ef", glow: "#9a36ba", bg: "#080610", frame: "assets/token-studio/frames/punk-neon.png" },
  marble: { label: "Mármore Imperial", outer: "#f0ece3", inner: "#d9b45f", glow: "#9f8d6a", bg: "#141311", frame: "assets/token-studio/frames/white-marble.png" },
  celtic: { label: "Nó Celta", outer: "#c6d0db", inner: "#609bdc", glow: "#4e709c", bg: "#0a0e13", frame: "assets/token-studio/frames/celtic-knot.png" },
  aztec: { label: "Obsidiana Asteca", outer: "#d39c45", inner: "#e7c172", glow: "#805628", bg: "#080808", frame: "assets/token-studio/frames/aztec-obsidian.png" },
  pirate: { label: "Capitão Pirata", outer: "#a87b43", inner: "#c73c48", glow: "#69401f", bg: "#100b07", frame: "assets/token-studio/frames/pirate-captain.png" },
  bard: { label: "Canção do Bardo", outer: "#b56f51", inner: "#bb76e2", glow: "#754695", bg: "#120a11", frame: "assets/token-studio/frames/music-bard.png" },
  scholar: { label: "Biblioteca do Sábio", outer: "#a77b49", inner: "#70b4e4", glow: "#5b4833", bg: "#100c08", frame: "assets/token-studio/frames/scholar-library.png" },
  plague: { label: "Médico da Peste", outer: "#89848c", inner: "#c4dce1", glow: "#55515d", bg: "#08080a", frame: "assets/token-studio/frames/plague-doctor.png" },
  honey: { label: "Colmeia Dourada", outer: "#e3ae38", inner: "#ffd779", glow: "#9b6b18", bg: "#161006", frame: "assets/token-studio/frames/bee-honey.png" },
  lotus: { label: "Templo de Lótus", outer: "#eadfc5", inner: "#8edee8", glow: "#7eabb5", bg: "#101312", frame: "assets/token-studio/frames/lotus-temple.png" },
  retrowave: { label: "Onda Retrô", outer: "#ef6d42", inner: "#bd4ce1", glow: "#8233a5", bg: "#090612", frame: "assets/token-studio/frames/retro-wave.png" },
  wolf: { label: "Lobo Invernal", outer: "#d9edf3", inner: "#74c7ef", glow: "#568db3", bg: "#081019", frame: "assets/token-studio/frames/winter-wolf.png" }
};
const TWBV_TOKEN_STUDIO_FRAME_CACHE = new Map();
const TWBV_TOKEN_STUDIO_FRAME_BOUNDS = new Map();

function twbvTokenStudioFrameBounds(image, path) {
  if (TWBV_TOKEN_STUDIO_FRAME_BOUNDS.has(path)) return TWBV_TOKEN_STUDIO_FRAME_BOUNDS.get(path);
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const columns = new Uint16Array(canvas.width);
  const rows = new Uint16Array(canvas.height);
  for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
    if (pixels[(y * canvas.width + x) * 4 + 3] < 64) continue;
    columns[x]++; rows[y]++;
  }
  const minimumRun = Math.max(4, Math.round(Math.min(canvas.width, canvas.height) * 0.006));
  let minX = 0, minY = 0, maxX = canvas.width - 1, maxY = canvas.height - 1;
  while (minX < maxX && columns[minX] < minimumRun) minX++;
  while (maxX > minX && columns[maxX] < minimumRun) maxX--;
  while (minY < maxY && rows[minY] < minimumRun) minY++;
  while (maxY > minY && rows[maxY] < minimumRun) maxY--;
  if (maxX < minX) return { x: 0, y: 0, size: canvas.width };
  const size = Math.min(Math.max(maxX - minX + 1, maxY - minY + 1), Math.min(canvas.width, canvas.height));
  const bounds = {
    x: Math.max(0, Math.min(canvas.width - size, (minX + maxX + 1 - size) / 2)),
    y: Math.max(0, Math.min(canvas.height - size, (minY + maxY + 1 - size) / 2)), size
  };
  TWBV_TOKEN_STUDIO_FRAME_BOUNDS.set(path, bounds);
  return bounds;
}

function twbvTokenStudioSafeName(value) {
  return String(value || "personagem").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase() || "personagem";
}

async function twbvTokenStudioEnsureDirectory() {
  const world = String(game.world?.id || "world");
  const target = `worlds/${world}/world-behind-the-veil/personagens`;
  if (game.user?.isGM && globalThis.FilePicker?.createDirectory) {
    const parts = target.split("/");
    let current = "";
    for (const part of parts) {
      current = current ? `${current}/${part}` : part;
      try { await FilePicker.createDirectory("data", current); }
      catch (error) { if (!/exist|already/i.test(String(error?.message || error))) console.debug("[TWBV Ateliê] Pasta", current, error); }
    }
  }
  return target;
}

async function twbvTokenStudioUpload(blob, actor, suffix) {
  const directory = await twbvTokenStudioEnsureDirectory();
  const filename = `${twbvTokenStudioSafeName(actor.name)}-${suffix}.webp`;
  const file = new File([blob], filename, { type: "image/webp", lastModified: Date.now() });
  let result;
  try {
    result = await FilePicker.upload("data", directory, file, {}, { notify: false });
  } catch (error) {
    const fallback = `worlds/${String(game.world?.id || "world")}`;
    if (directory === fallback) throw error;
    result = await FilePicker.upload("data", fallback, file, {}, { notify: false });
  }
  const path = String(result?.path || result?.url || "");
  if (!path) throw new Error(`O upload de ${filename} não retornou um caminho.`);
  return path;
}

function twbvTokenStudioLoadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Não foi possível carregar essa imagem. Use um arquivo, Ctrl+V ou um caminho do Foundry."));
    image.src = source;
  });
}

function twbvTokenStudioCanvasBlob(canvas) {
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Falha ao gerar a imagem final.")), "image/webp", 0.92));
}

function twbvTokenStudioDroppedSource(dataTransfer) {
  const file = Array.from(dataTransfer?.files || []).find((entry) => entry.type?.startsWith("image/"));
  if (file) return { file };
  const html = dataTransfer?.getData("text/html") || "";
  if (html) {
    const document = new DOMParser().parseFromString(html, "text/html");
    const source = document.querySelector("img[src]")?.getAttribute("src");
    if (source) return { source };
  }
  const candidates = [dataTransfer?.getData("text/uri-list"), dataTransfer?.getData("URL"), dataTransfer?.getData("text/plain")]
    .map((value) => String(value || "").trim()).filter(Boolean);
  for (const candidate of candidates) {
    if (/^(https?:\/\/|data:image\/|blob:|(?:icons|systems|modules|worlds)\/)/i.test(candidate)) return { source: candidate.split(/\r?\n/)[0] };
    try {
      const data = JSON.parse(candidate);
      const source = data?.src || data?.img || data?.image || data?.texture?.src || data?.document?.img;
      if (source) return { source: String(source) };
      if (data?.uuid) return { uuid: String(data.uuid) };
    } catch (_error) { /* The dropped text was not Foundry JSON. */ }
  }
  return null;
}

class TWBVTokenStudio extends Application {
  constructor(actor, options = {}) {
    super(options);
    this.actor = actor;
    this.sources = { portrait: null, token: null };
    this.sourceUrls = { portrait: "", token: "" };
    this.history = Array.from(this.actor.getFlag?.(TWBV_TOKEN_STUDIO_ID, "tokenStudioHistory") || []).filter(Boolean).slice(0, 16);
    this.activeTarget = "portrait";
    this.states = {
      portrait: { zoom: 1, x: 0, y: 0, rotation: 0, mirror: false, preset: "veil", frame: false, frameScale: 0.98 },
      token: { zoom: 1, x: 0, y: 0, rotation: 0, mirror: false, preset: "veil", frame: true, frameScale: 0.98 }
    };
    this._drag = null;
    this._saving = false;
    this._boundPaste = this._onPaste.bind(this);
    this._boundDragCleanup = this._clearDropTargets.bind(this);
    this._objectUrls = new Set();
    this._ensureFrame(this.states.token.preset);
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "twbv-token-studio",
      title: "Ateliê do Véu",
      classes: ["twbv-token-studio-window"],
      width: 980,
      height: 760,
      resizable: true
    });
  }

  get template() { return `systems/${game.system.id}/templates/apps/token-studio.hbs`; }

  async getData() {
    return {
      actor: this.actor,
      presets: Object.entries(TWBV_TOKEN_STUDIO_PRESETS).map(([id, value]) => ({ id, ...value })),
      canUpload: Boolean(game.user?.can?.("FILES_UPLOAD")),
      tokenImage: this.actor.prototypeToken?.texture?.src || this.actor.img
    };
  }

  async _render(force, options) {
    await super._render(force, options);
    if (!this.sources.portrait || !this.sources.token) {
      const portrait = this.actor.img || CONST.DEFAULT_TOKEN;
      const token = this.actor.prototypeToken?.texture?.src || portrait;
      await Promise.all([
        this.setSource(portrait, { target: "portrait", quiet: true, cascade: false }),
        this.setSource(token, { target: "token", quiet: true, cascade: false })
      ]);
    }
  }

  activateListeners(html) {
    super.activateListeners(html);
    const root = html[0];
    window.removeEventListener("paste", this._boundPaste);
    window.addEventListener("paste", this._boundPaste);
    window.removeEventListener("dragend", this._boundDragCleanup, true);
    window.removeEventListener("drop", this._boundDragCleanup, true);
    window.addEventListener("dragend", this._boundDragCleanup, true);
    window.addEventListener("drop", this._boundDragCleanup, true);

    html.find("[data-studio-target]").on("click", (event) => {
      this._activateTarget(event.currentTarget.dataset.studioTarget);
    });
    html.find("[data-studio-source]").on("click", (event) => this._chooseSource(event.currentTarget.dataset.studioSource));
    html.find("[data-studio-action]").on("click", (event) => this._action(event.currentTarget.dataset.studioAction, root));
    html.on("click", "[data-studio-history-source]", (event) => this.setSource(event.currentTarget.dataset.studioHistorySource));
    html.find("[data-studio-control]").on("input change", (event) => {
      const state = this.states[this.activeTarget];
      const key = event.currentTarget.dataset.studioControl;
      state[key] = event.currentTarget.type === "checkbox" ? event.currentTarget.checked : Number(event.currentTarget.value);
      this.renderPreviews();
    });
    html.find("[data-studio-preset]").on("click", (event) => {
      this.states[this.activeTarget].preset = event.currentTarget.dataset.studioPreset;
      root.querySelectorAll("[data-studio-preset]").forEach((button) => button.classList.toggle("is-active", button.dataset.studioPreset === this.states[this.activeTarget].preset));
      this.renderPreviews();
    });
    html.find("[data-studio-canvas]").each((_index, canvas) => this._bindCanvas(canvas));
    this._syncControls(root);
    this._activateTarget(this.activeTarget);
    this._renderHistory();
    this.renderPreviews();
  }

  async close(options) {
    window.removeEventListener("paste", this._boundPaste);
    window.removeEventListener("dragend", this._boundDragCleanup, true);
    window.removeEventListener("drop", this._boundDragCleanup, true);
    this._objectUrls.forEach((url) => URL.revokeObjectURL(url));
    this._objectUrls.clear();
    if (TWBV_TOKEN_STUDIO_APPS.get(this.actor.uuid) === this) TWBV_TOKEN_STUDIO_APPS.delete(this.actor.uuid);
    return super.close(options);
  }

  async setSource(source, { target = this.activeTarget, quiet = false, cascade = target === "portrait" } = {}) {
    try {
      const image = await twbvTokenStudioLoadImage(source);
      this.sources[target] = image;
      this.sourceUrls[target] = source;
      this._rememberSource(source);
      this._fitState(target);
      if (target === "portrait" && cascade) {
        this.sources.token = image;
        this.sourceUrls.token = source;
        this._fitState("token");
      }
      this.renderPreviews();
      this._renderHistory();
    } catch (error) {
      if (!quiet) ui.notifications?.error(error.message);
    }
  }

  _ensureFrame(presetId) {
    const preset = TWBV_TOKEN_STUDIO_PRESETS[presetId] || TWBV_TOKEN_STUDIO_PRESETS.veil;
    if (!preset.frame || TWBV_TOKEN_STUDIO_FRAME_CACHE.has(preset.frame)) return;
    const image = new Image();
    TWBV_TOKEN_STUDIO_FRAME_CACHE.set(preset.frame, image);
    image.onload = () => this.renderPreviews();
    image.onerror = () => { TWBV_TOKEN_STUDIO_FRAME_CACHE.delete(preset.frame); console.warn("[TWBV Ateliê] Moldura indisponível", preset.frame); };
    image.src = `systems/${game.system.id}/${preset.frame}`;
  }

  _fitState(target) {
    const source = this.sources[target];
    if (!source) return;
    const size = target === "portrait" ? 800 : 512;
    const cover = Math.max(size / source.naturalWidth, size / source.naturalHeight);
    this.states[target] = { ...this.states[target], zoom: cover, x: 0, y: 0, rotation: 0, mirror: false };
  }

  _fitBoth() { this._fitState("portrait"); this._fitState("token"); }

  _bindCanvas(canvas) {
    const target = canvas.dataset.studioCanvas;
    const card = canvas.closest(".twbv-token-studio__canvas-card") || canvas;
    canvas.addEventListener("click", () => this._activateTarget(target));
    canvas.addEventListener("dragenter", (event) => { event.preventDefault(); card.classList.add("is-drop-target"); });
    canvas.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
      card.classList.add("is-drop-target");
    });
    canvas.addEventListener("dragleave", () => card.classList.remove("is-drop-target"));
    canvas.addEventListener("drop", async (event) => {
      event.preventDefault(); event.stopPropagation(); card.classList.remove("is-drop-target");
      this._activateTarget(target);
      const dropped = twbvTokenStudioDroppedSource(event.dataTransfer);
      if (dropped?.file) return this._setObjectFile(dropped.file);
      if (dropped?.source) return this.setSource(dropped.source);
      if (dropped?.uuid && globalThis.fromUuid) {
        const document = await fromUuid(dropped.uuid);
        const source = document?.texture?.src || document?.img || document?.thumbnail || document?.src;
        if (source) return this.setSource(source);
      }
      ui.notifications?.warn("Não encontrei uma imagem nesse item. Tente copiar a imagem e usar Ctrl+V.");
    });
    canvas.addEventListener("wheel", (event) => {
      event.preventDefault();
      const state = this.states[target];
      state.zoom = Math.max(0.05, Math.min(8, state.zoom * (event.deltaY < 0 ? 1.08 : 0.92)));
      if (target === this.activeTarget) this._syncControls(this.element[0]);
      this.renderPreviews();
    }, { passive: false });
    canvas.addEventListener("pointerdown", (event) => {
      canvas.setPointerCapture(event.pointerId);
      this._drag = { target, x: event.clientX, y: event.clientY, startX: this.states[target].x, startY: this.states[target].y };
    });
    canvas.addEventListener("pointermove", (event) => {
      if (!this._drag || this._drag.target !== target) return;
      const scale = canvas.width / canvas.getBoundingClientRect().width;
      this.states[target].x = this._drag.startX + (event.clientX - this._drag.x) * scale;
      this.states[target].y = this._drag.startY + (event.clientY - this._drag.y) * scale;
      this.renderPreviews();
    });
    canvas.addEventListener("pointerup", () => { this._drag = null; });
    canvas.addEventListener("pointercancel", () => { this._drag = null; });
  }

  _activateTarget(target) {
    this.activeTarget = target;
    const root = this.element?.[0];
    if (!root) return;
    root.querySelectorAll("[data-studio-target]").forEach((button) => button.classList.toggle("is-active", button.dataset.studioTarget === target));
    root.querySelectorAll("[data-studio-canvas]").forEach((canvas) => canvas.closest(".twbv-token-studio__canvas-card")?.classList.toggle("is-active-target", canvas.dataset.studioCanvas === target));
    this._syncControls(root);
  }

  _clearDropTargets() {
    this.element?.[0]?.querySelectorAll(".is-drop-target").forEach((element) => element.classList.remove("is-drop-target"));
  }

  _draw(target, canvas, exportSize = null) {
    const size = exportSize || (target === "portrait" ? 800 : 512);
    if (canvas.width !== size) canvas.width = size;
    if (canvas.height !== size) canvas.height = size;
    const context = canvas.getContext("2d");
    const state = this.states[target];
    const preset = TWBV_TOKEN_STUDIO_PRESETS[state.preset] || TWBV_TOKEN_STUDIO_PRESETS.veil;
    context.clearRect(0, 0, size, size);
    const source = this.sources[target];
    if (source) {
      context.save();
      if (target === "token" && state.frame) {
        context.beginPath();
        context.arc(size / 2, size / 2, size * 0.355 * state.frameScale, 0, Math.PI * 2);
        context.clip();
      }
      context.translate(size / 2 + state.x, size / 2 + state.y);
      context.rotate(state.rotation * Math.PI / 180);
      context.scale(state.mirror ? -state.zoom : state.zoom, state.zoom);
      context.drawImage(source, -source.naturalWidth / 2, -source.naturalHeight / 2);
      context.restore();
    }
    if (state.frame) this._drawFrame(context, size, preset, target);
  }

  _drawFrame(context, size, preset, target) {
    if (target === "portrait") {
      const gradient = context.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, preset.outer); gradient.addColorStop(.5, preset.inner); gradient.addColorStop(1, preset.outer);
      context.strokeStyle = gradient; context.lineWidth = size * .025; context.strokeRect(size * .02, size * .02, size * .96, size * .96);
      return;
    }
    const rasterFrame = preset.frame ? TWBV_TOKEN_STUDIO_FRAME_CACHE.get(preset.frame) : null;
    if (rasterFrame?.complete && rasterFrame.naturalWidth) {
      const frameSize = size * (this.states[target]?.frameScale || 0.98);
      const offset = (size - frameSize) / 2;
      const bounds = twbvTokenStudioFrameBounds(rasterFrame, preset.frame);
      context.drawImage(rasterFrame, bounds.x, bounds.y, bounds.size, bounds.size, offset, offset, frameSize, frameSize);
      return;
    }
    context.save();
    context.shadowColor = preset.glow; context.shadowBlur = size * .055;
    const gradient = context.createRadialGradient(size / 2, size / 2, size * .38, size / 2, size / 2, size * .5);
    gradient.addColorStop(0, preset.inner); gradient.addColorStop(.45, preset.outer); gradient.addColorStop(.72, preset.bg); gradient.addColorStop(1, preset.outer);
    context.strokeStyle = gradient; context.lineWidth = size * .075;
    context.beginPath(); context.arc(size / 2, size / 2, size * .46, 0, Math.PI * 2); context.stroke();
    context.shadowBlur = 0; context.strokeStyle = preset.inner; context.lineWidth = size * .009;
    context.beginPath(); context.arc(size / 2, size / 2, size * .415, 0, Math.PI * 2); context.stroke();
    context.restore();
  }

  renderPreviews() {
    const root = this.element?.[0];
    if (!root) return;
    root.querySelectorAll("[data-studio-canvas]").forEach((canvas) => this._draw(canvas.dataset.studioCanvas, canvas));
  }

  _rememberSource(source) {
    const value = String(source || "");
    if (!value || value.startsWith("data:")) return;
    this.history = [value, ...this.history.filter((item) => item !== value)].slice(0, 16);
    const persistentHistory = this.history.filter((item) => !item.startsWith("blob:"));
    this.actor.setFlag?.(TWBV_TOKEN_STUDIO_ID, "tokenStudioHistory", persistentHistory)
      .catch((error) => console.debug("[TWBV Ateliê] Histórico não pôde ser salvo", error));
  }

  _renderHistory() {
    const container = this.element?.[0]?.querySelector("[data-studio-history]");
    if (!container) return;
    container.innerHTML = this.history.length ? this.history.map((source) => {
      const safe = foundry.utils.escapeHTML(source);
      return `<button type="button" data-studio-history-source="${safe}" title="Usar esta imagem"><img src="${safe}" alt=""></button>`;
    }).join("") : '<span class="twbv-token-studio__history-empty">As imagens usadas nesta ficha aparecerão aqui.</span>';
  }

  _syncControls(root) {
    if (!root) return;
    const state = this.states[this.activeTarget];
    root.querySelectorAll("[data-studio-control]").forEach((control) => {
      const value = state[control.dataset.studioControl];
      if (control.type === "checkbox") control.checked = Boolean(value); else control.value = value;
    });
    root.querySelectorAll("[data-studio-preset]").forEach((button) => button.classList.toggle("is-active", button.dataset.studioPreset === state.preset));
  }

  async _chooseSource(type) {
    const target = this.activeTarget;
    if (type === "portrait") return this.setSource(this.actor.img, { target });
    if (type === "token") return this.setSource(this.actor.prototypeToken?.texture?.src || this.actor.img, { target });
    if (type === "file") {
      const input = document.createElement("input"); input.type = "file"; input.accept = "image/*";
      input.addEventListener("change", () => { const file = input.files?.[0]; if (file) this._setObjectFile(file, target); }, { once: true });
      input.click(); return;
    }
    if (type === "foundry") {
      new FilePicker({ type: "image", current: this.actor.img, callback: (path) => this.setSource(path, { target }) }).render(true); return;
    }
    if (type === "album") {
      const source = await twbvTokenStudioChooseAlbumImage(this.actor);
      if (source) await this.setSource(source, { target });
      return;
    }
    if (type === "url") {
      const url = await twbvTokenStudioPromptUrl();
      if (url) await this.setSource(url, { target });
    }
  }

  async _onPaste(event) {
    if (!this.rendered) return;
    const files = Array.from(event.clipboardData?.files || []).filter((file) => file.type.startsWith("image/"));
    if (files[0]) { event.preventDefault(); return this._setObjectFile(files[0]); }
    const html = event.clipboardData?.getData("text/html") || "";
    const doc = html ? new DOMParser().parseFromString(html, "text/html") : null;
    const source = doc?.querySelector("img[src]")?.getAttribute("src") || event.clipboardData?.getData("text/plain") || "";
    if (/^(https?:\/\/|(?:icons|systems|modules|worlds)\/)/i.test(source.trim())) { event.preventDefault(); await this.setSource(source.trim()); }
  }

  async _setObjectFile(file, target = this.activeTarget) {
    const objectUrl = URL.createObjectURL(file);
    this._objectUrls.add(objectUrl);
    return this.setSource(objectUrl, { target });
  }

  async _action(action, root) {
    const state = this.states[this.activeTarget];
    if (action === "fit") { this._fitState(this.activeTarget); this._syncControls(root); return this.renderPreviews(); }
    if (action === "rotate-left") state.rotation -= 90;
    if (action === "rotate-right") state.rotation += 90;
    if (action === "mirror") state.mirror = !state.mirror;
    if (action === "clear-image") {
      this.sources[this.activeTarget] = null;
      this.sourceUrls[this.activeTarget] = "";
      this.renderPreviews();
      return;
    }
    if (action === "gallery") return this._openGallery(root);
    if (action === "save") return this._save(root);
    this._syncControls(root); this.renderPreviews();
  }

  _openGallery(root) {
    const groups = {
      arcano: new Set(["veil","obsidian","psionic","witch","crystal","cosmic","eldritch","clockmage","scholar"]),
      sombrio: new Set(["infernal","vampire","necromantic","abyssal","rogue","demonic","plague"]),
      divino: new Set(["celestial","divine","solar","paladin","angelic","lotus","marble"]),
      elemental: new Set(["ghost","frost","flame","ocean","storm","phoenix","wolf"]),
      oriental: new Set(["jutsu","samurai","sakura","serpent","rabbit"]),
      tecnologico: new Set(["steampunk","cyber","modern","dieselpunk","punk","retrowave"])
    };
    const categoryFor = (id) => Object.entries(groups).find(([, ids]) => ids.has(id))?.[0] || "fantasia";
    const cards = Object.entries(TWBV_TOKEN_STUDIO_PRESETS).map(([id, preset]) => {
      const thumb = preset.frame.replace("/frames/", "/frames/thumbs/");
      const active = id === this.states[this.activeTarget].preset ? " is-active" : "";
      return `<button type="button" class="twbv-token-frame-card${active}" data-frame-id="${id}" data-frame-category="${categoryFor(id)}" title="${preset.label}"><img loading="lazy" src="systems/${game.system.id}/${thumb}" alt=""><span>${preset.label}</span></button>`;
    }).join("");
    const dialog = new Dialog({
      title: "Galeria de Tokens • 60 molduras",
      content: `<div class="twbv-token-frame-filters"><button type="button" data-frame-filter="all" class="is-active">Todos</button><button type="button" data-frame-filter="arcano">Arcano</button><button type="button" data-frame-filter="sombrio">Sombrio</button><button type="button" data-frame-filter="divino">Divino</button><button type="button" data-frame-filter="elemental">Elemental</button><button type="button" data-frame-filter="oriental">Oriental</button><button type="button" data-frame-filter="tecnologico">Tecnológico</button><button type="button" data-frame-filter="fantasia">Fantasia</button></div><div class="twbv-token-frame-gallery">${cards}</div>`,
      buttons: { close: { label: "Fechar" } },
      render: (html) => {
        const galleryRoot = html?.[0] || html;
        galleryRoot.querySelectorAll("[data-frame-filter]").forEach((filter) => filter.addEventListener("click", () => {
          const value = filter.dataset.frameFilter;
          galleryRoot.querySelectorAll("[data-frame-filter]").forEach((item) => item.classList.toggle("is-active", item === filter));
          galleryRoot.querySelectorAll("[data-frame-id]").forEach((card) => { card.hidden = value !== "all" && card.dataset.frameCategory !== value; });
        }));
        galleryRoot.querySelectorAll("[data-frame-id]").forEach((button) => button.addEventListener("click", () => {
        const id = button.dataset.frameId;
        this.states[this.activeTarget].preset = id;
        this.states[this.activeTarget].frame = true;
        this._ensureFrame(id);
        this._syncControls(root);
        this.renderPreviews();
        dialog.close();
        }));
      }
    }, { width: 760, height: 680, resizable: true });
    dialog.render(true);
  }

  async _save(root) {
    if (this._saving) return;
    if (!this.sources.portrait && !this.sources.token) return ui.notifications?.warn("Escolha pelo menos uma imagem primeiro.");
    if (!game.user?.can?.("FILES_UPLOAD")) return ui.notifications?.error("Seu usuário não possui permissão para enviar arquivos.");
    this._saving = true;
    const button = root.querySelector('[data-studio-action="save"]');
    if (button) button.disabled = true;
    try {
      const portraitCanvas = document.createElement("canvas");
      const tokenCanvas = document.createElement("canvas");
      this._draw("portrait", portraitCanvas, 800); this._draw("token", tokenCanvas, 512);
      const [portraitBlob, tokenBlob] = await Promise.all([twbvTokenStudioCanvasBlob(portraitCanvas), twbvTokenStudioCanvasBlob(tokenCanvas)]);
      const [portraitPath, tokenPath] = await Promise.all([
        twbvTokenStudioUpload(portraitBlob, this.actor, "retrato"),
        twbvTokenStudioUpload(tokenBlob, this.actor, "token")
      ]);
      const stamp = Date.now();
      const portrait = `${portraitPath.split("?")[0]}?v=${stamp}`;
      const token = `${tokenPath.split("?")[0]}?v=${stamp}`;
      const updatePortrait = root.querySelector('[name="studioUpdatePortrait"]')?.checked !== false;
      const updatePrototype = root.querySelector('[name="studioUpdatePrototype"]')?.checked !== false;
      const updateScene = Boolean(root.querySelector('[name="studioUpdateScene"]')?.checked);
      const update = {};
      if (updatePortrait) update.img = portrait;
      if (updatePrototype) {
        update["prototypeToken.texture.src"] = token;
        update["prototypeToken.texture.scaleX"] = 1;
        update["prototypeToken.texture.scaleY"] = 1;
        update["prototypeToken.randomImg"] = false;
      }
      if (Object.keys(update).length) await this.actor.update(update, { twbvTokenStudio: true });
      if (updateScene && canvas?.ready) {
        const active = this.actor.getActiveTokens?.(true) || [];
        const tokenUpdates = active.map((placed) => {
          const placedUpdate = {
            _id: placed.document?.id || placed.id,
            "texture.src": token,
            "texture.scaleX": 1,
            "texture.scaleY": 1
          };
          return placedUpdate;
        });
        if (tokenUpdates.length) await canvas.scene.updateEmbeddedDocuments("Token", tokenUpdates, { twbvTokenStudio: true });
      }
      ui.notifications?.info("Retrato e token criados no Ateliê do Véu.");
      await this.close();
    } catch (error) {
      console.error("[TWBV Ateliê] Falha ao salvar", error);
      ui.notifications?.error(`Não foi possível salvar: ${error?.message || error}`);
    } finally {
      this._saving = false;
      if (button?.isConnected) button.disabled = false;
    }
  }
}

function twbvTokenStudioPromptUrl() {
  return new Promise((resolve) => new Dialog({
    title: "Imagem da internet",
    content: '<form><div class="form-group"><label>URL direta</label><input name="url" type="url" placeholder="https://..." autofocus></div></form>',
    buttons: {
      open: { label: "Carregar", callback: (html) => resolve(String((html?.[0] || html).querySelector('[name="url"]')?.value || "").trim()) },
      cancel: { label: "Cancelar", callback: () => resolve("") }
    }, default: "open", close: () => resolve("")
  }).render(true));
}

function twbvTokenStudioChooseAlbumImage(actor) {
  const raw = actor.system?.historia?.album;
  const album = Array.isArray(raw) ? raw : Object.values(raw || {});
  const photos = album.filter((photo) => String(photo?.image || "").trim());
  if (!photos.length) { ui.notifications?.warn("Este personagem ainda não possui imagens no álbum."); return Promise.resolve(""); }
  return new Promise((resolve) => {
    let settled = false;
    const finish = (value) => { if (settled) return; settled = true; resolve(value); };
    const content = `<div class="twbv-token-studio-album-picker">${photos.map((photo, index) => `<button type="button" data-album-index="${index}" title="${String(photo.nota || "Foto").replace(/"/g, "&quot;")}"><img src="${String(photo.image).replace(/"/g, "&quot;")}" alt=""></button>`).join("")}</div>`;
    new Dialog({
      title: "Escolher foto do álbum", content, buttons: { cancel: { label: "Cancelar", callback: () => finish("") } },
      render: (html) => (html?.[0] || html).querySelectorAll("[data-album-index]").forEach((button) => button.addEventListener("click", () => {
        finish(String(photos[Number(button.dataset.albumIndex)]?.image || ""));
        button.closest(".dialog")?.querySelector(".close")?.click();
      })), close: () => finish("")
    }, { width: 560 }).render(true);
  });
}

function twbvOpenTokenStudio(actor) {
  if (!actor?.isOwner && !game.user?.isGM) return ui.notifications?.warn("Você não pode alterar este personagem.");
  const existing = TWBV_TOKEN_STUDIO_APPS.get(actor.uuid);
  if (existing?.rendered) { existing.bringToTop(); return existing; }
  const app = new TWBVTokenStudio(actor);
  TWBV_TOKEN_STUDIO_APPS.set(actor.uuid, app);
  app.render(true);
  return app;
}

globalThis.TWBVTokenStudio = { open: twbvOpenTokenStudio };

Hooks.on("getActorSheetHeaderButtons", (sheet, buttons) => {
  if (!(sheet?.actor?.isOwner || game.user?.isGM)) return;
  buttons.unshift({ label: "Ateliê", class: "twbv-token-studio-open", icon: "fas fa-wand-magic-sparkles", onclick: () => twbvOpenTokenStudio(sheet.actor) });
});

Hooks.on("renderActorSheet", (_sheet, html) => {
  const root = html?.[0] || html;
  root?.closest?.(".window-app")?.querySelectorAll?.(".vtta-tokenizer")?.forEach((element) => element.remove());
});
