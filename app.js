const canvas = document.querySelector("#markupCanvas");
const ctx = canvas.getContext("2d");
const appRoot = document.querySelector(".app");
const content = document.querySelector(".content");
const stage = document.querySelector("#stage");
const emptyState = document.querySelector("#emptyState");

const imageInput = document.querySelector("#imageInput");
const projectInput = document.querySelector("#projectInput");
const importBtn = document.querySelector("#importBtn");
const emptyImportBtn = document.querySelector("#emptyImportBtn");
const saveProjectBtn = document.querySelector("#saveProjectBtn");
const loadProjectBtn = document.querySelector("#loadProjectBtn");
const exportBtn = document.querySelector("#exportBtn");
const undoBtn = document.querySelector("#undoBtn");
const redoBtn = document.querySelector("#redoBtn");
const clearBtn = document.querySelector("#clearBtn");
const compactUndoBtn = document.querySelector("#compactUndoBtn");
const compactRedoBtn = document.querySelector("#compactRedoBtn");
const compactClearBtn = document.querySelector("#compactClearBtn");
const compactFitBtn = document.querySelector("#compactFitBtn");
const compactFinishPolylineBtn = document.querySelector("#compactFinishPolylineBtn");
const zoomOutBtn = document.querySelector("#zoomOutBtn");
const zoomInBtn = document.querySelector("#zoomInBtn");
const fitBtn = document.querySelector("#fitBtn");
const topbarToggle = document.querySelector("#topbarToggle");
const zoomReadout = document.querySelector("#zoomReadout");
const snapToggle = document.querySelector("#snapToggle");
const snapToggles = Array.from(document.querySelectorAll("[data-snap-toggle]"));
const objectSnapToggles = Array.from(document.querySelectorAll("[data-object-snap-toggle]"));
const keepToolToggles = Array.from(document.querySelectorAll("[data-keep-tool-toggle]"));
const finishPolylineBtn = document.querySelector("#finishPolylineBtn");
const lineTypePanel = document.querySelector("#lineTypePanel");
const linePalette = document.querySelector("#linePalette");
const lineKindEditor = document.querySelector("#lineKindEditor");
const objectTypePanel = document.querySelector("#objectTypePanel");
const objectPalette = document.querySelector("#objectPalette");
const addObjectBtn = document.querySelector("#addObjectBtn");
const textToolPanel = document.querySelector("#textToolPanel");
const pipeTypePanel = document.querySelector("#pipeTypePanel");
const pipeKindEditor = document.querySelector("#pipeKindEditor");
const signatureTypePanel = document.querySelector("#signatureTypePanel");
const signatureProfilePanel = document.querySelector("#signatureProfilePanel");
const propertiesPanel = document.querySelector(".properties");
const selectedPanel = document.querySelector("#selectedPanel");
const selectedCard = document.querySelector("#selectedCard");
const mobilePalette = document.querySelector("#mobilePalette");
const mobileEditPanel = document.querySelector("#mobileEditPanel");
const promptDialog = document.querySelector("#promptDialog");
const promptTitle = document.querySelector("#promptTitle");
const promptInput = document.querySelector("#promptInput");
const promptCancelBtn = document.querySelector("#promptCancelBtn");
const promptOkBtn = document.querySelector("#promptOkBtn");
const colorDialog = document.querySelector("#colorDialog");
const colorDialogTitle = document.querySelector("#colorDialogTitle");
const colorPreview = document.querySelector("#colorPreview");
const colorHexInput = document.querySelector("#colorHexInput");
const colorHueInput = document.querySelector("#colorHueInput");
const colorSatInput = document.querySelector("#colorSatInput");
const colorLightInput = document.querySelector("#colorLightInput");
const colorPresetRow = document.querySelector("#colorPresetRow");
const colorCancelBtn = document.querySelector("#colorCancelBtn");
const colorOkBtn = document.querySelector("#colorOkBtn");
const signatureDialog = document.querySelector("#signatureDialog");
const signatureCanvas = document.querySelector("#signatureCanvas");
const signatureCtx = signatureCanvas?.getContext("2d");
const signatureDialogName = document.querySelector("#signatureDialogName");
const signatureClearBtn = document.querySelector("#signatureClearBtn");
const signatureCancelBtn = document.querySelector("#signatureCancelBtn");
const signatureSaveBtn = document.querySelector("#signatureSaveBtn");
const recentDialog = document.querySelector("#recentDialog");
const recentList = document.querySelector("#recentList");
const recentCloseBtn = document.querySelector("#recentCloseBtn");
const recentOpenFileBtn = document.querySelector("#recentOpenFileBtn");
const recentNewBtn = document.querySelector("#recentNewBtn");
const toast = document.querySelector("#toast");

const PROFILE_STORAGE_KEY = "nettmerking-profile-v2";
const DB_NAME = "montorskisse-db";
const DB_VERSION = 1;
const SKETCH_STORE = "sketches";
const LINE_COLOR_PRESETS = ["#16825e", "#c7302b", "#1368aa", "#1c2421", "#a73578", "#6d756f"];
const REMOVED_OBJECT_KINDS = new Set(["meter", "handhole", "anchor", "streetlight", "switch", "splice"]);
const TEXT_ARROW_MIN_THRESHOLD = 20;
const TEXT_ARROW_INFINITY_VALUE = 1000;
const COMPACT_MOBILE_QUERY = "(max-width: 740px)";

const lineKinds = {
  primary: {
    label: "LS Kabel",
    color: "#16825e",
    halo: "rgba(22, 130, 94, 0.2)",
    width: 7,
    dash: []
  },
  secondary: {
    label: "HS Kabel",
    color: "#c7302b",
    halo: "rgba(199, 48, 43, 0.2)",
    width: 7,
    dash: []
  },
  service: {
    label: "LS Luftledning",
    color: "#16825e",
    halo: "rgba(22, 130, 94, 0.18)",
    width: 5,
    dash: [22, 13]
  },
  underground: {
    label: "HS Luftledning",
    color: "#c7302b",
    halo: "rgba(199, 48, 43, 0.18)",
    width: 5,
    dash: [22, 13]
  },
  proposed: {
    label: "Planlagt",
    color: "#6d756f",
    halo: "rgba(109, 117, 111, 0.18)",
    width: 5,
    dash: [12, 10]
  },
  arrowLine: {
    label: "Pil strek",
    color: "#1c2421",
    halo: "rgba(28, 36, 33, 0.18)",
    width: 5,
    dash: [],
    arrowEnd: true
  }
};

const measureLineStyle = {
  label: "Meter",
  color: "#1c2421",
  halo: "rgba(255, 253, 249, 0.72)",
  width: 5,
  dash: []
};

const pipeKinds = {
  power110: {
    label: "110mm Rør",
    shortLabel: "110mm Rør",
    color: "#c7302b",
    fill: "rgba(199, 48, 43, 0.28)",
    width: 22
  },
  fiber: {
    label: "Fiber rør",
    shortLabel: "Fiber rør",
    color: "#d6a500",
    fill: "rgba(255, 218, 57, 0.38)",
    width: 18
  }
};

const objectKinds = {
  pole: { label: "Stolpe", mark: "S", shape: "circle", fill: "#f0c94a", stroke: "#6d5300" },
  transformer: { label: "Fordelingsskap", mark: "FS", shape: "rect", fill: "#ffffff", stroke: "#16825e" },
  lowVoltage: { label: "LS muffe", mark: "LS", shape: "oval", fill: "#d8f4df", stroke: "#126b3f" },
  highVoltage: { label: "HS muffe", mark: "HS", shape: "oval", fill: "#f7d9d6", stroke: "#9f1e1b" },
  fuseBox: { label: "KV bryter", mark: "KV", shape: "fuseBox", fill: "#fff8d8", stroke: "#795800" },
  netstation: { label: "Nettstasjon", mark: "NS", shape: "square", fill: "rgba(255, 255, 255, 0.08)", stroke: "#c7302b" }
};

const fuseAmpOptions = [50, 63, 80, 100, 125, 160, 200, 250, 315, 355];

const state = {
  image: null,
  imageDataUrl: "",
  imageName: "screenshot",
  projectId: "",
  annotations: [],
  history: [],
  redo: [],
  tool: "select",
  lineKind: "primary",
  objectKind: "pole",
  pipeKind: "power110",
  pipeLabel: "",
  pipeColor: "",
  pipeWidth: null,
  pipeCableCount: 1,
  pipeToolAdvancedOpen: true,
  metersPerPixel: null,
  objectSnap: true,
  keepToolActive: false,
  textArrow: true,
  textArrowThreshold: TEXT_ARROW_INFINITY_VALUE,
  selectedId: null,
  drawingLine: null,
  polylineDraft: null,
  pipeDraft: null,
  polylinePointer: null,
  drag: null,
  pan: null,
  zoom: 1,
  fitScale: 1,
  snapAngles: false,
  signatureName: "",
  signatureText: "",
  signatureStrokes: [],
  mobileLineEditorOpen: false,
  mobileAdvancedOpen: false,
  mobileAdvancedTarget: ""
};

const activePointers = new Map();
let pinchState = null;
const signaturePad = {
  strokes: [],
  drawing: null,
  resolve: null
};
let autosaveTimer = null;
let dbPromise = null;
let suppressAutosave = false;
let toastTimer = null;
let colorDialogApply = null;
let colorDialogValue = "#16825e";
let colorDialogSyncing = false;

const id = () => `m${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
const deepCopy = (value) => JSON.parse(JSON.stringify(value));

function colorToRgba(color, alpha = 0.18) {
  const hex = String(color || "").replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(hex)) return `rgba(28, 36, 33, ${alpha})`;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function normalizeHexColor(value, fallback = "#16825e") {
  const raw = String(value || "").trim();
  const hex = raw.startsWith("#") ? raw : `#${raw}`;
  if (/^#[0-9a-f]{3}$/i.test(hex)) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`.toLowerCase();
  }
  if (/^#[0-9a-f]{6}$/i.test(hex)) return hex.toLowerCase();
  return fallback;
}

function hexToRgb(color) {
  const hex = normalizeHexColor(color).slice(1);
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16)
  };
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0")).join("")}`;
}

function hexToHsl(color) {
  const { r, g, b } = hexToRgb(color);
  const nr = r / 255;
  const ng = g / 255;
  const nb = b / 255;
  const max = Math.max(nr, ng, nb);
  const min = Math.min(nr, ng, nb);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === nr) h = (ng - nb) / d + (ng < nb ? 6 : 0);
    else if (max === ng) h = (nb - nr) / d + 2;
    else h = (nr - ng) / d + 4;
    h *= 60;
  }
  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function hslToHex(h, s, l) {
  const hue = ((Number(h) % 360) + 360) % 360;
  const sat = clamp(Number(s), 0, 100) / 100;
  const light = clamp(Number(l), 0, 100) / 100;
  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = light - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (hue < 60) [r, g, b] = [c, x, 0];
  else if (hue < 120) [r, g, b] = [x, c, 0];
  else if (hue < 180) [r, g, b] = [0, c, x];
  else if (hue < 240) [r, g, b] = [0, x, c];
  else if (hue < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

function colorButtonHtml(id, color, label = "Velg farge") {
  const safeColor = normalizeHexColor(color);
  const idAttr = id ? ` id="${id}"` : "";
  return `<button${idAttr} class="color-picker-btn" type="button" style="--picked-color:${escapeAttr(safeColor)}"><span>${escapeAttr(label)}</span><strong>${escapeAttr(safeColor)}</strong></button>`;
}

function setColorDialogValue(color, { syncSliders = true } = {}) {
  colorDialogValue = normalizeHexColor(color, colorDialogValue);
  if (colorPreview) colorPreview.style.background = colorDialogValue;
  if (colorHexInput && colorHexInput.value !== colorDialogValue) colorHexInput.value = colorDialogValue;
  if (syncSliders && colorHueInput && colorSatInput && colorLightInput) {
    colorDialogSyncing = true;
    const hsl = hexToHsl(colorDialogValue);
    colorHueInput.value = hsl.h;
    colorSatInput.value = hsl.s;
    colorLightInput.value = hsl.l;
    colorDialogSyncing = false;
  }
  if (colorPresetRow) {
    colorPresetRow.querySelectorAll("[data-color-preset]").forEach((button) => {
      button.classList.toggle("active", normalizeHexColor(button.dataset.colorPreset) === colorDialogValue);
    });
  }
}

function openColorDialog({ title = "Velg farge", color = "#16825e", onApply } = {}) {
  if (!colorDialog) {
    if (onApply) onApply(normalizeHexColor(color));
    return;
  }
  colorDialogApply = onApply;
  if (colorDialogTitle) colorDialogTitle.textContent = title;
  if (colorPresetRow && !colorPresetRow.children.length) {
    LINE_COLOR_PRESETS.forEach((preset) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "color-swatch-btn";
      button.style.setProperty("--swatch", preset);
      button.dataset.colorPreset = preset;
      button.setAttribute("aria-label", preset);
      colorPresetRow.appendChild(button);
    });
  }
  setColorDialogValue(color);
  colorDialog.classList.remove("hidden");
  requestAnimationFrame(() => colorHexInput?.focus());
}

function closeColorDialog(apply = false) {
  if (apply && colorDialogApply) colorDialogApply(colorDialogValue);
  colorDialogApply = null;
  colorDialog?.classList.add("hidden");
}

function formatSliderValue(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "";
  return Number.isInteger(numeric) ? String(numeric) : numeric.toFixed(1);
}

function normalizeLineKind(value, fallback = lineKinds.primary) {
  const width = Number(value?.width ?? fallback.width);
  return {
    label: String(value?.label || fallback.label || "Linje"),
    color: String(value?.color || fallback.color || "#16825e"),
    halo: value?.halo || colorToRgba(value?.color || fallback.color),
    width: clamp(Number.isFinite(width) ? width : fallback.width || 6, 2, 18),
    dash: Array.isArray(value?.dash) ? value.dash.filter((n) => Number.isFinite(Number(n))).map(Number) : fallback.dash || [],
    arrowEnd: Boolean(value?.arrowEnd ?? fallback.arrowEnd)
  };
}

function normalizeObjectKind(value, fallback = objectKinds.pole) {
  return {
    label: String(value?.label || fallback.label || "Objekt"),
    mark: String(value?.mark || fallback.mark || "O").slice(0, 4).toUpperCase(),
    shape: value?.shape || fallback.shape || "roundRect",
    fill: value?.fill || fallback.fill || "#fffdf9",
    stroke: value?.stroke || fallback.stroke || "#14665d",
    custom: Boolean(value?.custom)
  };
}

function collectProfile() {
  return {
    version: 2,
    lineKinds: deepCopy(lineKinds),
    objectKinds: deepCopy(objectKinds),
    active: {
      lineKind: state.lineKind,
      objectKind: state.objectKind,
      pipeKind: state.pipeKind,
      pipeLabel: state.pipeLabel,
      pipeColor: state.pipeColor,
      pipeWidth: state.pipeWidth,
      pipeCableCount: state.pipeCableCount
    },
    signature: {
      name: state.signatureName,
      text: state.signatureText,
      strokes: deepCopy(state.signatureStrokes)
    }
  };
}

function ensureBuiltInDefinitions() {
  lineKinds.arrowLine = normalizeLineKind(lineKinds.arrowLine, {
    label: "Pil strek",
    color: "#1c2421",
    halo: "rgba(28, 36, 33, 0.18)",
    width: 5,
    dash: [],
    arrowEnd: true
  });
  lineKinds.arrowLine.label = lineKinds.arrowLine.label || "Pil strek";
  lineKinds.arrowLine.arrowEnd = true;

  objectKinds.transformer = {
    ...(objectKinds.transformer || {}),
    label: "Fordelingsskap",
    mark: "FS",
    shape: "rect",
    fill: "#ffffff",
    stroke: "#16825e"
  };
  objectKinds.netstation = {
    ...(objectKinds.netstation || {}),
    label: "Nettstasjon",
    mark: "NS",
    shape: "square",
    fill: "rgba(255, 255, 255, 0.08)",
    stroke: "#c7302b"
  };
}

function applyProfile(profile, { persist = false } = {}) {
  if (!profile || typeof profile !== "object") {
    ensureBuiltInDefinitions();
    return;
  }

  if (profile.lineKinds && typeof profile.lineKinds === "object") {
    Object.entries(profile.lineKinds).forEach(([key, value]) => {
      lineKinds[key] = normalizeLineKind(value, lineKinds[key] || lineKinds.primary);
    });
  }

  if (profile.objectKinds && typeof profile.objectKinds === "object") {
    Object.entries(profile.objectKinds).forEach(([key, value]) => {
      if (REMOVED_OBJECT_KINDS.has(key)) return;
      objectKinds[key] = normalizeObjectKind(value, objectKinds[key] || objectKinds.pole);
    });
  }

  if (profile.signature && typeof profile.signature === "object") {
    state.signatureName = String(profile.signature.name || "");
    state.signatureText = String(profile.signature.text || "");
    state.signatureStrokes = Array.isArray(profile.signature.strokes) ? deepCopy(profile.signature.strokes) : [];
  }

  if (profile.active?.lineKind && lineKinds[profile.active.lineKind]) state.lineKind = profile.active.lineKind;
  if (profile.active?.objectKind && objectKinds[profile.active.objectKind]) state.objectKind = profile.active.objectKind;
  if (profile.active?.pipeKind && pipeKinds[profile.active.pipeKind]) state.pipeKind = profile.active.pipeKind;
  if (Object.prototype.hasOwnProperty.call(profile.active || {}, "pipeLabel")) {
    state.pipeLabel = String(profile.active.pipeLabel || "");
  }
  if (/^#[0-9a-f]{6}$/i.test(String(profile.active?.pipeColor || ""))) {
    state.pipeColor = String(profile.active.pipeColor);
  } else {
    state.pipeColor = "";
  }
  const pipeWidth = Number(profile.active?.pipeWidth);
  state.pipeWidth = Number.isFinite(pipeWidth) ? clamp(pipeWidth, 6, 42) : null;
  state.pipeCableCount = pipeCableCount({ cableCount: profile.active?.pipeCableCount || 1 });

  ensureBuiltInDefinitions();
  if (persist) saveProfile();
}

function loadProfile() {
  try {
    applyProfile(JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || "null"));
  } catch {
    // Ignore broken local profiles and keep the built-in setup.
  }
}

function saveProfile() {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(collectProfile()));
  } catch {
    // Local storage can be unavailable in private or locked-down browsers.
  }
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
  }, 2600);
}

function flashActionButton(button) {
  if (!button || button.disabled) return;
  button.classList.remove("press-flash");
  void button.offsetWidth;
  button.classList.add("press-flash");
  window.setTimeout(() => button.classList.remove("press-flash"), 220);
}

function openSketchDb() {
  if (!("indexedDB" in window)) return Promise.reject(new Error("IndexedDB er ikke tilgjengelig"));
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(SKETCH_STORE)) {
        const store = db.createObjectStore(SKETCH_STORE, { keyPath: "id" });
        store.createIndex("updatedAt", "updatedAt");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}

async function sketchStore(mode, callback) {
  const db = await openSketchDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SKETCH_STORE, mode);
    const store = tx.objectStore(SKETCH_STORE);
    const result = callback(store);
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
  });
}

function createProjectPayload() {
  return {
    app: "Montørskisse",
    version: 2,
    id: state.projectId || id(),
    imageName: state.imageName,
    imageDataUrl: state.imageDataUrl,
    metersPerPixel: state.metersPerPixel,
    annotations: deepCopy(state.annotations),
    profile: collectProfile(),
    updatedAt: new Date().toISOString()
  };
}

function scheduleAutosave() {
  if (suppressAutosave || !state.image || !state.imageDataUrl) return;
  window.clearTimeout(autosaveTimer);
  autosaveTimer = window.setTimeout(() => {
    saveCurrentSketchNow().catch(() => {});
  }, 900);
}

async function saveCurrentSketchNow() {
  if (!state.image || !state.imageDataUrl) return;
  const payload = createProjectPayload();
  state.projectId = payload.id;
  await sketchStore("readwrite", (store) => store.put(payload));
}

async function getRecentSketches() {
  const db = await openSketchDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SKETCH_STORE, "readonly");
    const store = tx.objectStore(SKETCH_STORE);
    const request = store.getAll();
    request.onsuccess = () => {
      resolve(
        request.result
          .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")))
          .slice(0, 12)
      );
    };
    request.onerror = () => reject(request.error);
  });
}

async function getRecentSketch(sketchId) {
  const db = await openSketchDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SKETCH_STORE, "readonly");
    const request = tx.objectStore(SKETCH_STORE).get(sketchId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function deleteRecentSketch(sketchId) {
  await sketchStore("readwrite", (store) => store.delete(sketchId));
  await showRecentDialog();
}

function formatDateTime(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  return `${date.toLocaleDateString("no-NO")} ${date.toLocaleTimeString("no-NO", { hour: "2-digit", minute: "2-digit" })}`;
}

function pushHistory() {
  state.history.push(deepCopy(state.annotations));
  if (state.history.length > 80) state.history.shift();
  state.redo = [];
  updateUi();
}

function undo() {
  if (state.polylineDraft) {
    undoPolylinePoint();
    return;
  }
  if (!state.history.length) return;
  state.redo.push(deepCopy(state.annotations));
  state.annotations = state.history.pop();
  state.selectedId = null;
  render();
  updateUi();
}

function redo() {
  if (!state.redo.length) return;
  state.history.push(deepCopy(state.annotations));
  state.annotations = state.redo.pop();
  state.selectedId = null;
  render();
  updateUi();
}

function undoPolylinePoint() {
  if (!state.polylineDraft) return;
  const draft = state.polylineDraft;
  if (draft.points.length > 1) {
    draft.points.pop();
    draft.previewPoint = draft.points[draft.points.length - 1];
  } else {
    cancelPolyline();
    return;
  }
  render();
  updateUi();
}

function showTextPrompt(title, defaultValue = "", inputMode = "text") {
  return new Promise((resolve) => {
    promptTitle.textContent = title;
    promptInput.value = defaultValue;
    promptInput.inputMode = inputMode;
    promptDialog.classList.remove("hidden");

    const cleanup = (value) => {
      promptDialog.classList.add("hidden");
      promptOkBtn.removeEventListener("click", onOk);
      promptCancelBtn.removeEventListener("click", onCancel);
      promptInput.removeEventListener("keydown", onKeyDown);
      resolve(value);
    };
    const onOk = () => cleanup(promptInput.value);
    const onCancel = () => cleanup(null);
    const onKeyDown = (event) => {
      if (event.key === "Enter") cleanup(promptInput.value);
      if (event.key === "Escape") cleanup(null);
    };

    promptOkBtn.addEventListener("click", onOk);
    promptCancelBtn.addEventListener("click", onCancel);
    promptInput.addEventListener("keydown", onKeyDown);
    requestAnimationFrame(() => {
      promptInput.focus();
      promptInput.select();
    });
  });
}

async function askLineName(defaultName = "") {
  const value = await showTextPrompt("Gi linjen et navn", defaultName);
  return value === null ? defaultName : value.trim();
}

async function calibrateFromLine(annotation, defaultMeters = "") {
  const pixels = linePixelLength(annotation.points);
  if (!pixels) return false;
  const value = await showTextPrompt("Kjent lengde i meter", defaultMeters, "decimal");
  if (value === null || !value.trim()) return false;
  const meters = Number(value.replace(",", "."));
  if (!Number.isFinite(meters) || meters <= 0) return false;
  state.metersPerPixel = meters / pixels;
  annotation.meters = meters;
  return true;
}

async function finishPolyline() {
  if (!state.polylineDraft) return;
  const draft = state.polylineDraft;
  state.polylineDraft = null;
  state.polylinePointer = null;

  if (draft.points.length > 1) {
    pushHistory();
    const annotation = {
      id: draft.id,
      type: "line",
      kind: draft.kind,
      role: "utility",
      label: await askLineName(draft.label || ""),
      points: draft.points
    };
    state.annotations.push(annotation);
    state.selectedId = annotation.id;
  }

  render();
  updateUi();
}

function cancelPolyline() {
  state.polylineDraft = null;
  state.polylinePointer = null;
  render();
  updateUi();
}

async function setTool(tool) {
  if (tool !== "polyline" && state.polylineDraft) {
    await finishPolyline();
  }
  if (!["select", "line", "polyline", "measure"].includes(tool)) {
    state.mobileLineEditorOpen = false;
  }
  state.tool = tool;
  state.drawingLine = null;
  state.pipeDraft = null;
  state.drag = null;
  state.pan = null;
  document.querySelectorAll("[data-tool]").forEach((button) => {
    button.classList.toggle("active", button.dataset.tool === tool);
  });
  updateMobilePalette();
  updateUi(false);
}

function setLineKind(kind) {
  if (!lineKinds[kind]) return;
  state.lineKind = kind;
  if (state.polylineDraft) state.polylineDraft.kind = kind;
  updateLinePalette();
  updateLineKindEditor();
  updateMobilePalette();
  saveProfile();
}

function setObjectKind(kind) {
  if (!objectKinds[kind]) return;
  state.objectKind = kind;
  updateObjectPalette();
  updateMobilePalette();
  saveProfile();
}

function setPipeKind(kind) {
  if (!pipeKinds[kind]) return;
  const previousDefaultLabel = pipeKinds[state.pipeKind]?.label;
  state.pipeKind = kind;
  if (state.pipeLabel === previousDefaultLabel) state.pipeLabel = "";
  document.querySelectorAll("[data-pipe-kind]").forEach((button) => {
    button.classList.toggle("active", button.dataset.pipeKind === kind);
  });
  syncPipeDraftFromTool();
  updatePipeToolEditor();
  updateMobilePalette();
  saveProfile();
}

function setObjectSnap(checked) {
  state.objectSnap = checked;
  objectSnapToggles.forEach((toggle) => {
    toggle.checked = checked;
  });
  if (!checked) {
    state.annotations.forEach((annotation) => {
      if (annotation.type === "object") annotation.snapTarget = null;
      if (annotation.type === "pipe") annotation.lineId = null;
    });
    if (state.pipeDraft) state.pipeDraft.lineId = null;
    render();
    updateUi(false);
  }
}

function setKeepToolActive(checked) {
  state.keepToolActive = checked;
  keepToolToggles.forEach((toggle) => {
    toggle.checked = checked;
  });
}

function setTextArrow(checked) {
  state.textArrow = checked;
  document.querySelectorAll("[data-text-arrow-toggle]").forEach((toggle) => {
    toggle.checked = checked;
  });
}

function normalizeTextArrowThreshold(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return TEXT_ARROW_INFINITY_VALUE;
  return clamp(numeric, TEXT_ARROW_MIN_THRESHOLD, TEXT_ARROW_INFINITY_VALUE);
}

function textArrowThresholdReach(value) {
  const threshold = normalizeTextArrowThreshold(value);
  return threshold >= TEXT_ARROW_INFINITY_VALUE ? Infinity : threshold;
}

function textArrowThresholdLabel(value) {
  const threshold = normalizeTextArrowThreshold(value);
  return threshold >= TEXT_ARROW_INFINITY_VALUE ? "Uendelig" : `${threshold} px`;
}

function syncTextArrowThresholdControls(value = state.textArrowThreshold) {
  const threshold = normalizeTextArrowThreshold(value);
  document.querySelectorAll("[data-text-arrow-threshold]").forEach((input) => {
    input.value = threshold;
  });
  document.querySelectorAll("[data-text-arrow-threshold-readout]").forEach((output) => {
    output.textContent = textArrowThresholdLabel(threshold);
  });
}

function isCompactMobile() {
  return Boolean(appRoot?.classList.contains("compact-top") && window.matchMedia(COMPACT_MOBILE_QUERY).matches);
}

function minimumZoom() {
  return isCompactMobile() ? 0.82 : 0.5;
}

function setTextArrowThreshold(value) {
  const threshold = normalizeTextArrowThreshold(value);
  state.textArrowThreshold = threshold;
  syncTextArrowThresholdControls(threshold);
  render();
}

function setCompactTop(compact) {
  appRoot?.classList.toggle("compact-top", compact);
  if (state.zoom < minimumZoom()) state.zoom = minimumZoom();
  requestAnimationFrame(applyCanvasSize);
  if (!topbarToggle) return;
  topbarToggle.setAttribute("aria-pressed", String(compact));
  topbarToggle.setAttribute("aria-label", compact ? "Vis toppfelt" : "Minimer toppfelt");
  topbarToggle.title = compact ? "Vis toppfelt" : "Minimer toppfelt";
}

function lineSwatchStyle(style) {
  const color = style.color || "#16825e";
  const isDashed = Array.isArray(style.dash) && style.dash.length;
  const height = Math.max(4, Math.min(10, Number(style.width) || 6));
  const background = style.arrowEnd
    ? `linear-gradient(currentColor 0 0) left 50% / 22px ${height}px no-repeat, linear-gradient(45deg, transparent 45%, currentColor 46% 62%, transparent 63%) right 50% / 11px 11px no-repeat, linear-gradient(-45deg, transparent 45%, currentColor 46% 62%, transparent 63%) right 50% / 11px 11px no-repeat`
    : isDashed
    ? "repeating-linear-gradient(to right, currentColor 0 9px, transparent 9px 14px)"
    : "currentColor";
  return `color:${escapeAttr(color)};height:${height}px;background:${background}`;
}

function lineStyleFor(annotation, isMeasure = false) {
  const base = isMeasure ? measureLineStyle : lineKinds[annotation.kind] || lineKinds.primary;
  const color = annotation.color || base.color;
  const width = Number(annotation.width ?? base.width);
  const halo = annotation.halo || (annotation.color ? colorToRgba(color) : base.halo || colorToRgba(color));
  return {
    ...base,
    color,
    halo,
    width: clamp(Number.isFinite(width) ? width : base.width || 6, 2, 18),
    dash: Array.isArray(annotation.dash) ? annotation.dash : base.dash || [],
    arrowEnd: Boolean(annotation.arrowEnd ?? base.arrowEnd)
  };
}

function lineCableCount(annotation) {
  const count = Number(annotation.cableCount || 1);
  return clamp(Number.isFinite(count) ? Math.round(count) : 1, 1, 12);
}

function offsetPolyline(points, offset) {
  if (!offset) return points.map((point) => ({ ...point }));
  const normals = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const start = points[i];
    const end = points[i + 1];
    const length = Math.max(1, distance(start, end));
    normals.push({ x: -(end.y - start.y) / length, y: (end.x - start.x) / length });
  }

  return points.map((point, index) => {
    const previous = normals[index - 1];
    const next = normals[index];
    let normal = next || previous || { x: 0, y: 0 };
    if (previous && next) {
      normal = { x: previous.x + next.x, y: previous.y + next.y };
      const length = Math.hypot(normal.x, normal.y);
      normal = length > 0.2 ? { x: normal.x / length, y: normal.y / length } : next;
    }
    return { x: point.x + normal.x * offset, y: point.y + normal.y * offset };
  });
}

function parallelLinePaths(points, annotation, style, isMeasure = false) {
  const count = isMeasure ? 1 : lineCableCount(annotation);
  const gap = Math.max(style.width + 8, 12);
  return Array.from({ length: count }, (_, index) => {
    const offset = (index - (count - 1) / 2) * gap;
    return offsetPolyline(points, offset);
  });
}

function pipeStyleFor(annotation) {
  const base = pipeKinds[annotation.kind] || pipeKinds.power110;
  const color = annotation.color || base.color;
  const width = Number(annotation.width ?? base.width);
  return {
    ...base,
    color,
    fill: annotation.fill || base.fill || colorToRgba(color, 0.26),
    width: clamp(Number.isFinite(width) ? width : base.width || 18, 6, 42)
  };
}

function pipeCableCount(annotation) {
  const count = Number(annotation.cableCount || 1);
  return clamp(Number.isFinite(count) ? Math.round(count) : 1, 1, 8);
}

function activePipeLabel() {
  return state.pipeLabel.trim() || pipeKinds[state.pipeKind]?.label || "Rør";
}

function activePipeAnnotation() {
  const color = /^#[0-9a-f]{6}$/i.test(state.pipeColor) ? state.pipeColor : "";
  const width = Number(state.pipeWidth);
  return {
    kind: state.pipeKind,
    label: activePipeLabel(),
    color: color || undefined,
    fill: color ? colorToRgba(color, 0.26) : undefined,
    width: Number.isFinite(width) ? clamp(width, 6, 42) : undefined,
    cableCount: pipeCableCount({ cableCount: state.pipeCableCount })
  };
}

function activePipeStyle() {
  return pipeStyleFor(activePipeAnnotation());
}

function syncPipeDraftFromTool() {
  if (!state.pipeDraft) return;
  const active = activePipeAnnotation();
  state.pipeDraft.kind = active.kind;
  state.pipeDraft.label = active.label;
  state.pipeDraft.cableCount = active.cableCount;
  if (active.color) {
    state.pipeDraft.color = active.color;
    state.pipeDraft.fill = active.fill;
  } else {
    delete state.pipeDraft.color;
    delete state.pipeDraft.fill;
  }
  if (active.width) state.pipeDraft.width = active.width;
  else delete state.pipeDraft.width;
  render();
}

function setPipeToolAdvanced(open) {
  state.pipeToolAdvancedOpen = open;
  updatePipeToolEditor();
  updateMobilePalette();
}

function setPipeToolLabel(value) {
  state.pipeLabel = String(value || "").trim();
  syncPipeDraftFromTool();
  saveProfile();
}

function setPipeToolColor(value) {
  state.pipeColor = /^#[0-9a-f]{6}$/i.test(String(value || "")) ? String(value) : "";
  document.querySelectorAll("[data-pipe-tool-color-button]").forEach((button) => {
    button.style.setProperty("--picked-color", state.pipeColor || activePipeStyle().color);
    const label = button.querySelector("strong");
    if (label) label.textContent = state.pipeColor || activePipeStyle().color;
  });
  syncPipeDraftFromTool();
  saveProfile();
}

function setPipeToolWidth(value) {
  const width = Number(value);
  state.pipeWidth = Number.isFinite(width) ? clamp(width, 6, 42) : null;
  const currentWidth = activePipeStyle().width;
  document.querySelectorAll("[data-pipe-tool-width]").forEach((input) => {
    input.value = currentWidth;
  });
  document.querySelectorAll("[data-pipe-tool-width-readout]").forEach((output) => {
    output.textContent = formatSliderValue(currentWidth);
  });
  syncPipeDraftFromTool();
  saveProfile();
}

function setPipeToolCableCount(value) {
  state.pipeCableCount = pipeCableCount({ cableCount: value });
  document.querySelectorAll("[data-pipe-tool-count]").forEach((input) => {
    input.value = state.pipeCableCount;
  });
  syncPipeDraftFromTool();
  saveProfile();
}

function parallelPipePaths(points, annotation, style) {
  const count = pipeCableCount(annotation);
  const gap = Math.max(style.width + 8, 16);
  return Array.from({ length: count }, (_, index) => {
    const offset = (index - (count - 1) / 2) * gap;
    return offsetPolyline(points, offset);
  });
}

function mobileAdvancedKey(selected, area) {
  return `${selected?.id || "none"}:${area}`;
}

function isMobileAdvancedOpen(selected, area) {
  return state.mobileAdvancedOpen && state.mobileAdvancedTarget === mobileAdvancedKey(selected, area);
}

function toggleMobileAdvanced(selected, area) {
  const key = mobileAdvancedKey(selected, area);
  state.mobileAdvancedOpen = state.mobileAdvancedTarget === key ? !state.mobileAdvancedOpen : true;
  state.mobileAdvancedTarget = key;
  if (area.endsWith("-tool")) updateMobilePalette();
  else updateMobileEditPanel();
}

function updateLinePalette() {
  if (!linePalette) return;
  linePalette.innerHTML = Object.entries(lineKinds)
    .map(
      ([key, value]) => `
        <button class="choice ${state.lineKind === key ? "active" : ""}" type="button" data-line-kind="${escapeAttr(key)}">
          <span class="swatch" style="${lineSwatchStyle(value)}"></span>
          <span>${escapeAttr(value.label)}</span>
        </button>`
    )
    .join("");
}

function updateLineKindEditor() {
  if (!lineKindEditor) return;
  const selected = lineKinds[state.lineKind] || lineKinds.primary;
  lineKindEditor.innerHTML = `
    <label class="field">
      <span>Navn</span>
      <input id="lineKindLabelInput" value="${escapeAttr(selected.label)}" />
    </label>
    <label class="field color-field">
      <span>Farge</span>
      ${colorButtonHtml("lineKindColorInput", selected.color)}
    </label>
    <label class="field">
      <span>Størrelse</span>
      <input id="lineKindWidthInput" type="range" min="2" max="18" step="0.25" value="${selected.width}" />
    </label>
    <label class="toggle compact">
      <input id="lineKindDashedInput" type="checkbox" ${selected.dash?.length ? "checked" : ""} />
      <span>Stripet strek</span>
    </label>
    <label class="toggle compact">
      <input id="lineKindArrowInput" type="checkbox" ${selected.arrowEnd ? "checked" : ""} />
      <span>Pil på slutt</span>
    </label>
  `;

  document.querySelector("#lineKindLabelInput").addEventListener("input", (event) => {
    selected.label = event.target.value.trim() || selected.label;
    updateLinePalette();
    updateMobilePalette();
    saveProfile();
    render();
  });
  document.querySelector("#lineKindColorInput").addEventListener("click", () => {
    openColorDialog({
      title: "Farge på linjetype",
      color: selected.color,
      onApply: (color) => {
        selected.color = color;
        selected.halo = colorToRgba(color);
        updateLinePalette();
        updateMobilePalette();
        saveProfile();
        render();
        updateLineKindEditor();
      }
    });
  });
  document.querySelector("#lineKindWidthInput").addEventListener("input", (event) => {
    selected.width = Number(event.target.value);
    updateLinePalette();
    updateMobilePalette();
    saveProfile();
    render();
  });
  document.querySelector("#lineKindDashedInput").addEventListener("change", (event) => {
    selected.dash = event.target.checked ? [22, 13] : [];
    event.target.checked = Boolean(selected.dash.length);
    updateLinePalette();
    updateMobilePalette();
    saveProfile();
    render();
  });
  document.querySelector("#lineKindArrowInput").addEventListener("change", (event) => {
    selected.arrowEnd = event.target.checked;
    event.target.checked = Boolean(selected.arrowEnd);
    saveProfile();
    render();
  });
}

function updatePipeToolEditor() {
  if (!pipeKindEditor) return;
  pipeKindEditor.classList.remove("hidden");
  const active = activePipeAnnotation();
  const style = activePipeStyle();
  pipeKindEditor.innerHTML = `
    <label class="field">
      <span>Rørtype</span>
      <select data-pipe-tool-kind>
        ${Object.entries(pipeKinds)
          .map(([key, value]) => `<option value="${key}" ${state.pipeKind === key ? "selected" : ""}>${escapeAttr(value.label)}</option>`)
          .join("")}
      </select>
    </label>
    <label class="field">
      <span>Etikett</span>
      <input data-pipe-tool-label value="${escapeAttr(active.label)}" />
    </label>
    <label class="field color-field">
      <span>Farge</span>
      ${colorButtonHtml(null, style.color, "Velg farge").replace("<button", "<button data-pipe-tool-color-button")}
    </label>
    <label class="field">
      <span>Størrelse</span>
      <div class="range-with-value">
        <input data-pipe-tool-width type="range" min="6" max="42" step="0.5" value="${style.width}" />
        <output data-pipe-tool-width-readout>${formatSliderValue(style.width)}</output>
      </div>
    </label>
    <label class="field">
      <span>Antall parallelle</span>
      <input data-pipe-tool-count type="number" inputmode="numeric" min="1" max="8" step="1" value="${pipeCableCount(active)}" />
    </label>
  `;
}

function updateObjectPalette() {
  if (!objectPalette) return;
  objectPalette.innerHTML = Object.entries(objectKinds)
    .map(
      ([key, value]) =>
        `<button class="object-choice ${state.objectKind === key ? "active" : ""}" type="button" data-object-kind="${escapeAttr(key)}" title="${escapeAttr(value.label)}">${escapeAttr(value.mark)}</button>`
    )
    .join("");
}

function updateSignatureProfilePanel() {
  if (!signatureProfilePanel) return;
  signatureProfilePanel.innerHTML = `
    <label class="field">
      <span>Navn</span>
      <input id="signatureNameInput" value="${escapeAttr(state.signatureName)}" />
    </label>
    <div class="signature-preview">
      <canvas id="signaturePreviewCanvas" width="320" height="100" aria-label="Lagret underskrift"></canvas>
    </div>
    <button class="btn" id="signatureDrawBtn" type="button">Tegn underskrift</button>
  `;
  document.querySelector("#signatureDrawBtn").addEventListener("click", editSignatureProfile);
  document.querySelector("#signatureNameInput").addEventListener("input", saveSignatureFromPanel);
  drawSignaturePreviewCanvas(document.querySelector("#signaturePreviewCanvas"), state.signatureStrokes);
}

function saveSignatureFromPanel() {
  const nameInput = document.querySelector("#signatureNameInput");
  if (nameInput) state.signatureName = nameInput.value.trim();
  saveProfile();
  updateMobilePalette();
}

async function editSignatureProfile() {
  const saved = await openSignatureDialog();
  if (!saved) return;
  updateSignatureProfilePanel();
  updateMobilePalette();
  render();
}

async function editCurrentLineKindProfile() {
  state.mobileLineEditorOpen = true;
  updateUi(false);
}

function setCurrentLineStyle(updates) {
  const selected = lineKinds[state.lineKind] || lineKinds.primary;
  if (updates.label !== undefined) selected.label = updates.label.trim() || selected.label;
  if (updates.color !== undefined && /^#[0-9a-f]{6}$/i.test(updates.color)) {
    selected.color = updates.color;
    selected.halo = colorToRgba(updates.color);
  }
  if (updates.width !== undefined && Number.isFinite(Number(updates.width))) {
    selected.width = clamp(Number(updates.width), 2, 18);
  }
  if (updates.dashed !== undefined) {
    selected.dash = updates.dashed ? [22, 13] : [];
  }
  saveProfile();
  updateLinePalette();
  updateLineKindEditor();
  updateMobilePalette();
  render();
}

function drawSignaturePreviewCanvas(targetCanvas, strokes) {
  if (!targetCanvas) return;
  const previewCtx = targetCanvas.getContext("2d");
  previewCtx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
  previewCtx.fillStyle = "#ffffff";
  previewCtx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
  previewCtx.strokeStyle = "rgba(28, 36, 33, 0.18)";
  previewCtx.lineWidth = 2;
  previewCtx.beginPath();
  previewCtx.moveTo(16, targetCanvas.height - 22);
  previewCtx.lineTo(targetCanvas.width - 16, targetCanvas.height - 22);
  previewCtx.stroke();
  drawSignatureStrokesOnContext(previewCtx, strokes, 16, 10, targetCanvas.width - 32, targetCanvas.height - 34, 4);
}

function openSignatureDialog() {
  if (!signatureDialog || !signatureCanvas) return Promise.resolve(false);
  signaturePad.strokes = deepCopy(state.signatureStrokes || []);
  signaturePad.drawing = null;
  signatureDialogName.value = state.signatureName || "";
  signatureDialog.classList.remove("hidden");
  renderSignaturePad();
  requestAnimationFrame(() => signatureDialogName.focus());
  return new Promise((resolve) => {
    signaturePad.resolve = resolve;
  });
}

function closeSignatureDialog(saved) {
  if (!signatureDialog) return;
  signatureDialog.classList.add("hidden");
  if (signaturePad.resolve) {
    signaturePad.resolve(saved);
    signaturePad.resolve = null;
  }
}

function saveSignatureDialog() {
  state.signatureName = signatureDialogName.value.trim();
  state.signatureStrokes = deepCopy(signaturePad.strokes);
  state.signatureText = "";
  saveProfile();
  closeSignatureDialog(true);
}

function clearSignatureDialog() {
  signaturePad.strokes = [];
  signaturePad.drawing = null;
  renderSignaturePad();
}

function signatureCanvasPoint(event) {
  const rect = signatureCanvas.getBoundingClientRect();
  return {
    x: clamp((event.clientX - rect.left) / rect.width, 0, 1),
    y: clamp((event.clientY - rect.top) / rect.height, 0, 1)
  };
}

function beginSignatureStroke(event) {
  if (!signatureCanvas) return;
  event.preventDefault();
  signatureCanvas.setPointerCapture(event.pointerId);
  const stroke = [signatureCanvasPoint(event)];
  signaturePad.strokes.push(stroke);
  signaturePad.drawing = { pointerId: event.pointerId, stroke };
  renderSignaturePad();
}

function moveSignatureStroke(event) {
  if (!signaturePad.drawing || signaturePad.drawing.pointerId !== event.pointerId) return;
  event.preventDefault();
  const point = signatureCanvasPoint(event);
  const stroke = signaturePad.drawing.stroke;
  const last = stroke[stroke.length - 1];
  if (!last || Math.hypot(point.x - last.x, point.y - last.y) > 0.004) {
    stroke.push(point);
    renderSignaturePad();
  }
}

function endSignatureStroke(event) {
  if (!signaturePad.drawing || signaturePad.drawing.pointerId !== event.pointerId) return;
  if (signatureCanvas.hasPointerCapture(event.pointerId)) signatureCanvas.releasePointerCapture(event.pointerId);
  signaturePad.drawing = null;
}

function renderSignaturePad() {
  if (!signatureCtx || !signatureCanvas) return;
  signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
  signatureCtx.fillStyle = "#ffffff";
  signatureCtx.fillRect(0, 0, signatureCanvas.width, signatureCanvas.height);
  signatureCtx.strokeStyle = "rgba(28, 36, 33, 0.16)";
  signatureCtx.lineWidth = 2;
  signatureCtx.beginPath();
  signatureCtx.moveTo(26, signatureCanvas.height - 34);
  signatureCtx.lineTo(signatureCanvas.width - 26, signatureCanvas.height - 34);
  signatureCtx.stroke();
  drawSignatureStrokesOnContext(signatureCtx, signaturePad.strokes, 24, 18, signatureCanvas.width - 48, signatureCanvas.height - 58, 5);
}

function drawSignatureStrokesOnContext(context, strokes = [], x, y, width, height, lineWidth = 5) {
  if (!Array.isArray(strokes) || !strokes.length) return;
  context.save();
  context.strokeStyle = "#1c2421";
  context.fillStyle = "#1c2421";
  context.lineWidth = lineWidth;
  context.lineCap = "round";
  context.lineJoin = "round";
  strokes.forEach((stroke) => {
    if (!Array.isArray(stroke) || !stroke.length) return;
    context.beginPath();
    stroke.forEach((point, index) => {
      const px = x + point.x * width;
      const py = y + point.y * height;
      if (index === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    });
    if (stroke.length === 1) {
      const point = stroke[0];
      context.arc(x + point.x * width, y + point.y * height, lineWidth / 2, 0, Math.PI * 2);
      context.fill();
    } else {
      context.stroke();
    }
  });
  context.restore();
}

async function createCustomObjectKind() {
  const label = await showTextPrompt("Objektnavn");
  if (!label || !label.trim()) return;
  const defaultMark = label
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
  const mark = await showTextPrompt("Kort tekst på objekt", defaultMark || "O");
  const key = `custom_${id()}`;
  objectKinds[key] = {
    label: label.trim(),
    mark: (mark || defaultMark || "O").trim().slice(0, 4).toUpperCase(),
    shape: "roundRect",
    fill: "#fffdf9",
    stroke: "#14665d",
    custom: true
  };
  setObjectKind(key);
  saveProfile();
  updateObjectPalette();
  updateMobilePalette();
}

function returnToSelectIfNeeded() {
  if (!state.keepToolActive) {
    setTool("select");
  } else {
    updateUi();
  }
}

function loadImageFromDataUrl(dataUrl, name = "screenshot") {
  const img = new Image();
  img.onload = () => {
    state.image = img;
    state.imageDataUrl = dataUrl;
    state.imageName = name.replace(/\.[^.]+$/, "") || "screenshot";
    state.projectId = id();
    state.annotations = [];
    state.history = [];
    state.redo = [];
    state.selectedId = null;
    state.metersPerPixel = null;
    state.drawingLine = null;
    state.polylineDraft = null;
    state.pipeDraft = null;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.classList.add("ready");
    emptyState.classList.add("hidden");
    state.zoom = 1;
    applyCanvasSize();
    render();
    updateUi();
  };
  img.src = dataUrl;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function applyCanvasSize() {
  if (!canvas.width || !canvas.height) return;
  state.zoom = Math.max(minimumZoom(), state.zoom);
  const rect = stage.getBoundingClientRect();
  const availableW = Math.max(220, rect.width - 36);
  const availableH = Math.max(220, rect.height - 36);
  state.fitScale = Math.min(availableW / canvas.width, availableH / canvas.height, 1);
  const scale = state.fitScale * state.zoom;
  canvas.style.width = `${Math.max(160, canvas.width * scale)}px`;
  canvas.style.height = `${Math.max(160, canvas.height * scale)}px`;
  zoomReadout.value = `${Math.round(state.zoom * 100)}%`;
}

function render(options = {}) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (state.image) {
    ctx.drawImage(state.image, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  state.annotations.forEach((annotation, annotationIndex) => drawAnnotation(annotation, { ...options, annotationIndex }));
  if (state.drawingLine) drawAnnotation(state.drawingLine, { ...options, temporary: true });
  if (state.polylineDraft) drawAnnotation(state.polylineDraft, { ...options, temporary: true });
  if (state.pipeDraft) drawAnnotation(state.pipeDraft, { ...options, temporary: true });
  state.annotations.forEach((annotation) => {
    if (annotation.type === "text" && annotation.autoArrow) drawTextArrow(annotation);
  });

  if (!options.exporting && state.selectedId) {
    const selected = getAnnotation(state.selectedId);
    if (selected) drawSelection(selected);
  }
  if (!options.exporting) scheduleAutosave();
}

function drawAnnotation(annotation, options = {}) {
  if (annotation.type === "line") drawLine(annotation, options);
  if (annotation.type === "pipe") drawPipe(annotation, options);
  if (annotation.type === "object") drawObject(annotation);
  if (annotation.type === "text") drawText(annotation);
  if (annotation.type === "signature") drawSignature(annotation);
}

function drawLine(annotation, options = {}) {
  const isMeasure = annotation.role === "measure";
  const style = lineStyleFor(annotation, isMeasure);
  const points = annotation.previewPoint ? [...annotation.points, annotation.previewPoint] : annotation.points;
  if (!points || points.length < 2) return;
  const paths = parallelLinePaths(points, annotation, style, isMeasure);
  ctx.save();
  paths.forEach((path) => {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.setLineDash([]);
    ctx.strokeStyle = style.halo;
    ctx.lineWidth = style.width + 10;
    traceLineForAnnotation(path, options.annotationIndex, annotation);
    ctx.stroke();

    ctx.setLineDash(style.dash);
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width;
    traceLineForAnnotation(path, options.annotationIndex, annotation);
    ctx.stroke();

    if (options.temporary) {
      ctx.setLineDash([5, 7]);
      ctx.strokeStyle = "rgba(28, 36, 33, 0.45)";
      ctx.lineWidth = 2;
      traceLineForAnnotation(path, options.annotationIndex, annotation);
      ctx.stroke();
    }
    drawLineEndMarkers(path, style, isMeasure);
  });
  ctx.restore();

  const label = isMeasure ? measurementText({ ...annotation, points }) : annotation.label;
  if (label && isMeasure) drawCenteredLineLabel(points, label, style.color);
  if (label && !isMeasure) drawRepeatedLineLabel(points, label, style.color);
}

function traceLine(points) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
}

function traceLineForAnnotation(points, annotationIndex, annotation) {
  if (annotation.role === "measure") traceLine(points);
  else traceLineWithHumps(points, annotationIndex);
}

function traceLineWithHumps(points, annotationIndex) {
  const humps = Number.isInteger(annotationIndex) ? crossingHumps(points, annotationIndex) : [];
  if (!humps.length) {
    traceLine(points);
    return;
  }

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let segmentIndex = 0; segmentIndex < points.length - 1; segmentIndex += 1) {
    const start = points[segmentIndex];
    const end = points[segmentIndex + 1];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const segmentLength = Math.hypot(dx, dy);
    if (!segmentLength) continue;
    const ux = dx / segmentLength;
    const uy = dy / segmentLength;
    const nx = -uy;
    const ny = ux;
    const segmentHumps = humps.filter((hump) => hump.segmentIndex === segmentIndex);

    segmentHumps.forEach((hump) => {
      const half = Math.min(18, segmentLength * 0.2);
      const sx = hump.x - ux * half;
      const sy = hump.y - uy * half;
      const ex = hump.x + ux * half;
      const ey = hump.y + uy * half;
      const cx = hump.x + nx * 24;
      const cy = hump.y + ny * 24;
      ctx.lineTo(sx, sy);
      ctx.quadraticCurveTo(cx, cy, ex, ey);
    });
    ctx.lineTo(end.x, end.y);
  }
}

function crossingHumps(points, annotationIndex) {
  const humps = [];
  for (let previousIndex = 0; previousIndex < annotationIndex; previousIndex += 1) {
    const previous = state.annotations[previousIndex];
    if (!previous || previous.type !== "line" || previous.role !== "utility") continue;
    for (let a = 0; a < points.length - 1; a += 1) {
      for (let b = 0; b < previous.points.length - 1; b += 1) {
        const intersection = segmentIntersection(points[a], points[a + 1], previous.points[b], previous.points[b + 1]);
        if (!intersection) continue;
        if (intersection.t < 0.06 || intersection.t > 0.94 || intersection.u < 0.06 || intersection.u > 0.94) continue;
        humps.push({ segmentIndex: a, t: intersection.t, x: intersection.x, y: intersection.y });
      }
    }
  }
  return humps.sort((a, b) => a.segmentIndex - b.segmentIndex || a.t - b.t);
}

function segmentIntersection(a, b, c, d) {
  const r = { x: b.x - a.x, y: b.y - a.y };
  const s = { x: d.x - c.x, y: d.y - c.y };
  const denominator = r.x * s.y - r.y * s.x;
  if (Math.abs(denominator) < 0.0001) return null;
  const qmp = { x: c.x - a.x, y: c.y - a.y };
  const t = (qmp.x * s.y - qmp.y * s.x) / denominator;
  const u = (qmp.x * r.y - qmp.y * r.x) / denominator;
  if (t <= 0 || t >= 1 || u <= 0 || u >= 1) return null;
  return { t, u, x: a.x + t * r.x, y: a.y + t * r.y };
}

function drawPipe(annotation, options = {}) {
  const style = pipeStyleFor(annotation);
  const points = annotation.previewPoint ? [annotation.points[0], annotation.previewPoint] : annotation.points;
  if (!points || points.length < 2) return;
  const paths = parallelPipePaths(points, annotation, style);
  ctx.save();
  paths.forEach((path) => {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.setLineDash([]);
    ctx.strokeStyle = style.fill;
    ctx.lineWidth = style.width + 10;
    traceLine(path);
    ctx.stroke();
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width;
    traceLine(path);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 253, 249, 0.92)";
    ctx.lineWidth = Math.max(5, style.width * 0.42);
    traceLine(path);
    ctx.stroke();
    if (options.temporary) {
      ctx.strokeStyle = "rgba(28, 36, 33, 0.45)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 7]);
      traceLine(path);
      ctx.stroke();
    }
  });
  ctx.restore();
  drawCenteredLineLabel(points, annotation.label || style.label, style.color);
}

function drawLineEndMarkers(points, style, isMeasure = false) {
  const markerSize = isMeasure ? 17 : 13;
  if (!isMeasure && style.arrowEnd) {
    drawEndMarker(points[0], points[1], markerSize, style.color);
    drawArrowHead(points[points.length - 1], points[points.length - 2], style.color);
    return;
  }
  drawEndMarker(points[0], points[1], markerSize, style.color);
  drawEndMarker(points[points.length - 1], points[points.length - 2], markerSize, style.color);
}

function drawArrowHead(point, neighbor, color) {
  if (!point || !neighbor) return;
  const angle = Math.atan2(point.y - neighbor.y, point.x - neighbor.x);
  const length = 30;
  const spread = 0.52;
  ctx.save();
  ctx.setLineDash([]);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(point.x - Math.cos(angle - spread) * length, point.y - Math.sin(angle - spread) * length);
  ctx.lineTo(point.x - Math.cos(angle + spread) * length, point.y - Math.sin(angle + spread) * length);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawEndMarker(point, neighbor, size, color) {
  if (!point || !neighbor) return;
  const angle = Math.atan2(point.y - neighbor.y, point.x - neighbor.x);
  const normal = angle + Math.PI / 2;
  ctx.save();
  ctx.setLineDash([]);
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(point.x + Math.cos(normal) * size, point.y + Math.sin(normal) * size);
  ctx.lineTo(point.x - Math.cos(normal) * size, point.y - Math.sin(normal) * size);
  ctx.stroke();
  ctx.restore();
}

function drawRepeatedLineLabel(points, text, color) {
  const total = linePixelLength(points);
  if (!total) return;
  const spacing = Math.max(180, Math.min(300, text.length * 15 + 120));
  const first = total < spacing ? total / 2 : Math.min(120, total / 2);
  for (let distanceAlong = first; distanceAlong < total; distanceAlong += spacing) {
    const sample = pointAtLineDistance(points, distanceAlong);
    if (sample) drawRotatedLabel(text, sample.x, sample.y, sample.angle, color);
  }
}

function drawCenteredLineLabel(points, text, color) {
  const total = linePixelLength(points);
  const sample = pointAtLineDistance(points, total / 2);
  if (sample) drawRotatedLabel(text, sample.x, sample.y, sample.angle, color);
}

function drawRotatedLabel(text, x, y, angle, color) {
  let drawAngle = angle;
  if (drawAngle > Math.PI / 2 || drawAngle < -Math.PI / 2) drawAngle += Math.PI;
  const offset = 24;
  const labelX = x + Math.cos(drawAngle - Math.PI / 2) * offset;
  const labelY = y + Math.sin(drawAngle - Math.PI / 2) * offset;
  ctx.save();
  ctx.translate(labelX, labelY);
  ctx.rotate(drawAngle);
  ctx.font = "850 24px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const width = ctx.measureText(text).width + 20;
  const height = 32;
  ctx.fillStyle = "rgba(255, 253, 249, 0.88)";
  roundRect(ctx, -width / 2, -height / 2, width, height, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(28, 36, 33, 0.22)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.fillText(text, 0, 1);
  ctx.restore();
}

function pointAtLineDistance(points, targetDistance) {
  let walked = 0;
  for (let i = 0; i < points.length - 1; i += 1) {
    const start = points[i];
    const end = points[i + 1];
    const segmentLength = distance(start, end);
    if (walked + segmentLength >= targetDistance) {
      const t = segmentLength ? (targetDistance - walked) / segmentLength : 0;
      return {
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t,
        angle: Math.atan2(end.y - start.y, end.x - start.x)
      };
    }
    walked += segmentLength;
  }
  return null;
}

function drawObject(annotation) {
  const kind = objectKinds[annotation.kind] || objectKinds.pole;
  const size = 26 * (annotation.scale || 1);
  ctx.save();
  ctx.translate(annotation.x, annotation.y);
  ctx.rotate(annotation.rotation || 0);
  ctx.lineWidth = Math.max(3, size * 0.11);
  ctx.strokeStyle = kind.stroke;
  ctx.fillStyle = kind.fill;

  if (kind.shape === "circle") {
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  if (kind.shape === "square") {
    roundRect(ctx, -size, -size, size * 2, size * 2, 7);
    ctx.fill();
    ctx.stroke();
  }

  if (kind.shape === "rect") {
    roundRect(ctx, -size * 1.35, -size * 0.82, size * 2.7, size * 1.64, 6);
    ctx.fill();
    ctx.stroke();
  }

  if (kind.shape === "fuseBox") {
    roundRect(ctx, -size * 1.05, -size * 0.9, size * 2.1, size * 1.8, 5);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "rgba(121, 88, 0, 0.62)";
    ctx.lineWidth = Math.max(2, size * 0.08);
    ctx.beginPath();
    ctx.moveTo(-size * 0.62, -size * 0.28);
    ctx.lineTo(size * 0.62, -size * 0.28);
    ctx.moveTo(-size * 0.62, size * 0.28);
    ctx.lineTo(size * 0.62, size * 0.28);
    ctx.stroke();
  }

  if (kind.shape === "roundRect") {
    roundRect(ctx, -size * 1.18, -size * 0.78, size * 2.36, size * 1.56, 12);
    ctx.fill();
    ctx.stroke();
  }

  if (kind.shape === "oval") {
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 1.35, size * 0.78, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  if (kind.shape === "triangle") {
    ctx.beginPath();
    ctx.moveTo(0, -size * 1.12);
    ctx.lineTo(size * 1.05, size * 0.86);
    ctx.lineTo(-size * 1.05, size * 0.86);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  if (kind.shape === "diamond") {
    ctx.beginPath();
    ctx.moveTo(0, -size * 1.18);
    ctx.lineTo(size * 1.18, 0);
    ctx.lineTo(0, size * 1.18);
    ctx.lineTo(-size * 1.18, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  if (kind.shape === "hex") {
    ctx.beginPath();
    for (let i = 0; i < 6; i += 1) {
      const angle = Math.PI / 6 + i * (Math.PI / 3);
      const px = Math.cos(angle) * size * 1.05;
      const py = Math.sin(angle) * size * 1.05;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  if (annotation.kind === "streetlight") {
    ctx.strokeStyle = "rgba(165, 111, 0, 0.62)";
    ctx.lineWidth = 2.4;
    for (let i = 0; i < 8; i += 1) {
      const angle = i * (Math.PI / 4);
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * size * 1.25, Math.sin(angle) * size * 1.25);
      ctx.lineTo(Math.cos(angle) * size * 1.55, Math.sin(angle) * size * 1.55);
      ctx.stroke();
    }
  }

  ctx.fillStyle = "#18201d";
  ctx.font = `900 ${Math.max(14, size * 0.58)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(kind.mark, 0, 1);
  ctx.restore();

  drawBadge(objectDisplayLabel(annotation), annotation.x + size * 1.9, annotation.y, "left");
}

function objectDisplayLabel(annotation) {
  const kind = objectKinds[annotation.kind] || objectKinds.pole;
  if (annotation.kind === "lowVoltage") return annotation.label || `LS muffe ${objectSequenceNumber(annotation, "lowVoltage")}`;
  if (annotation.kind === "highVoltage") return annotation.label || `HS muffe ${objectSequenceNumber(annotation, "highVoltage")}`;
  const base = annotation.label || kind.label;
  if (annotation.kind === "fuseBox") return `${base} ${annotation.fuseAmp || 125}A`;
  return base;
}

function objectSequenceNumber(annotation, kind) {
  let count = 0;
  for (const item of state.annotations) {
    if (item.type === "object" && item.kind === kind) count += 1;
    if (item.id === annotation.id) return count || 1;
  }
  return state.annotations.filter((item) => item.type === "object" && item.kind === kind).length + 1;
}

function nextMuffeLabel(kind) {
  if (kind === "lowVoltage") {
    return `LS muffe ${state.annotations.filter((item) => item.type === "object" && item.kind === "lowVoltage").length + 1}`;
  }
  if (kind === "highVoltage") {
    return `HS muffe ${state.annotations.filter((item) => item.type === "object" && item.kind === "highVoltage").length + 1}`;
  }
  return "";
}

function applyObjectKindDefaults(annotation) {
  if (annotation.kind === "fuseBox" && !annotation.fuseAmp) annotation.fuseAmp = 125;
  if ((annotation.kind === "lowVoltage" || annotation.kind === "highVoltage") && !annotation.label) {
    annotation.label = nextMuffeLabel(annotation.kind);
  }
}

function drawText(annotation) {
  const text = annotation.text || "";
  if (!text) return;
  ctx.save();
  ctx.font = `800 ${annotation.size || 28}px system-ui, sans-serif`;
  ctx.textBaseline = "top";
  const padding = 9;
  const metrics = ctx.measureText(text);
  const width = metrics.width + padding * 2;
  const height = (annotation.size || 28) + padding * 2;
  ctx.fillStyle = "rgba(255, 253, 249, 0.9)";
  roundRect(ctx, annotation.x, annotation.y, width, height, 7);
  ctx.fill();
  ctx.strokeStyle = "rgba(28, 36, 33, 0.22)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = annotation.color || "#1c2421";
  ctx.fillText(text, annotation.x + padding, annotation.y + padding);
  ctx.restore();
}

function drawTextArrow(annotation) {
  const target = nearestArrowTarget(annotation);
  if (!target) return;
  const box = getTextBox(annotation);
  const start = rectEdgePoint(box, target);
  const angle = Math.atan2(target.y - start.y, target.x - start.x);
  ctx.save();
  ctx.strokeStyle = "#1c2421";
  ctx.fillStyle = "#1c2421";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(target.x, target.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(target.x, target.y);
  ctx.lineTo(target.x - Math.cos(angle - 0.45) * 18, target.y - Math.sin(angle - 0.45) * 18);
  ctx.lineTo(target.x - Math.cos(angle + 0.45) * 18, target.y - Math.sin(angle + 0.45) * 18);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawSignature(annotation) {
  const box = getSignatureBox(annotation);
  const dateText = formatDate(annotation.date);
  const signatureArea = {
    x: box.x + 16,
    y: box.y + 10,
    w: box.w - 32,
    h: box.h - 54
  };
  ctx.save();
  ctx.fillStyle = "rgba(255, 253, 249, 0.92)";
  roundRect(ctx, box.x, box.y, box.w, box.h, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(28, 36, 33, 0.28)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.strokeStyle = "rgba(28, 36, 33, 0.18)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(signatureArea.x, signatureArea.y + signatureArea.h - 8);
  ctx.lineTo(signatureArea.x + signatureArea.w, signatureArea.y + signatureArea.h - 8);
  ctx.stroke();
  if (annotation.strokes?.length) {
    drawSignatureStrokesOnContext(ctx, annotation.strokes, signatureArea.x, signatureArea.y, signatureArea.w, signatureArea.h, Math.max(3, box.w * 0.012));
  } else {
    ctx.fillStyle = "#1c2421";
    ctx.textBaseline = "top";
    ctx.font = `800 ${annotation.size || 30}px system-ui, sans-serif`;
    ctx.fillText(annotation.text || "Underskrift", signatureArea.x, signatureArea.y + 4);
  }
  ctx.font = `700 ${Math.max(16, (annotation.size || 30) * 0.55)}px system-ui, sans-serif`;
  ctx.fillStyle = "#68716d";
  ctx.textBaseline = "middle";
  ctx.fillText(`${annotation.name || "Navn"} · ${dateText}`, box.x + 16, box.y + box.h - 22);
  ctx.restore();
}

function drawBadge(text, x, y, align = "center") {
  ctx.save();
  ctx.font = "800 24px system-ui, sans-serif";
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  const width = ctx.measureText(text).width + 20;
  const height = 32;
  const left = align === "left" ? x : x - width / 2;
  ctx.fillStyle = "rgba(255, 253, 249, 0.92)";
  roundRect(ctx, left, y - height / 2, width, height, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(28, 36, 33, 0.22)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#1c2421";
  ctx.fillText(text, align === "left" ? x + 10 : x, y + 1);
  ctx.restore();
}

function drawSelection(annotation) {
  ctx.save();
  ctx.strokeStyle = "#00a88f";
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.setLineDash([7, 6]);

  if (annotation.type === "line") {
    traceLine(annotation.points);
    ctx.stroke();
    ctx.setLineDash([]);
    annotation.points.forEach((point) => drawHandle(point.x, point.y));
  }

  if (annotation.type === "pipe") {
    traceLine(annotation.points);
    ctx.stroke();
    ctx.setLineDash([]);
    annotation.points.forEach((point) => drawHandle(point.x, point.y));
  }

  if (annotation.type === "object") {
    const handles = objectHandles(annotation);
    const size = handles.radius;
    ctx.strokeRect(annotation.x - size, annotation.y - size, size * 2, size * 2);
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(annotation.x, annotation.y - size);
    ctx.lineTo(handles.rotate.x, handles.rotate.y);
    ctx.stroke();
    drawHandle(handles.scale.x, handles.scale.y);
    drawHandle(handles.rotate.x, handles.rotate.y);
  }

  if (annotation.type === "text") {
    const box = getTextBox(annotation);
    ctx.strokeRect(box.x, box.y, box.w, box.h);
    ctx.setLineDash([]);
    drawHandle(box.x + box.w, box.y + box.h);
  }

  if (annotation.type === "signature") {
    const box = getSignatureBox(annotation);
    ctx.strokeRect(box.x, box.y, box.w, box.h);
    ctx.setLineDash([]);
    drawHandle(box.x + box.w, box.y + box.h);
  }

  ctx.restore();
}

function drawHandle(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function objectHandles(annotation) {
  const radius = 34 * (annotation.scale || 1);
  return {
    radius,
    scale: { x: annotation.x + radius, y: annotation.y + radius },
    rotate: { x: annotation.x, y: annotation.y - radius - 34 }
  };
}

function originalScaleHandle(annotation) {
  return objectHandles(annotation).scale;
}

function roundRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, Math.abs(width) / 2, Math.abs(height) / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.lineTo(x + width - r, y);
  context.quadraticCurveTo(x + width, y, x + width, y + r);
  context.lineTo(x + width, y + height - r);
  context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  context.lineTo(x + r, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - r);
  context.lineTo(x, y + r);
  context.quadraticCurveTo(x, y, x + r, y);
}

function clientToCanvasPoint(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * canvas.width,
    y: ((clientY - rect.top) / rect.height) * canvas.height
  };
}

function canvasPoint(event) {
  return clientToCanvasPoint(event.clientX, event.clientY);
}

function snapLinePoint(start, point) {
  if (!state.snapAngles) return point;
  const dx = point.x - start.x;
  const dy = point.y - start.y;
  const distance = Math.hypot(dx, dy);
  if (distance < 1) return point;
  const angle = Math.atan2(dy, dx);
  const step = Math.PI / 4;
  const snapped = Math.round(angle / step) * step;
  return {
    x: start.x + Math.cos(snapped) * distance,
    y: start.y + Math.sin(snapped) * distance
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function pointerDistance(a, b) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

function pointerCenter(a, b) {
  return {
    x: (a.clientX + b.clientX) / 2,
    y: (a.clientY + b.clientY) / 2
  };
}

function beginPinch() {
  const [first, second] = Array.from(activePointers.values());
  if (!first || !second) return;
  const center = pointerCenter(first, second);
  pinchState = {
    distance: Math.max(1, pointerDistance(first, second)),
    zoom: state.zoom,
    anchor: clientToCanvasPoint(center.x, center.y)
  };
  state.drawingLine = null;
  state.drag = null;
  state.pan = null;
  state.polylinePointer = null;
  render();
}

function zoomAroundCanvasPoint(nextZoom, anchor, center) {
  state.zoom = clamp(nextZoom, minimumZoom(), 4);
  applyCanvasSize();

  const rect = canvas.getBoundingClientRect();
  const afterX = rect.left + (anchor.x / canvas.width) * rect.width;
  const afterY = rect.top + (anchor.y / canvas.height) * rect.height;
  stage.scrollLeft += afterX - center.x;
  stage.scrollTop += afterY - center.y;
}

function zoomAroundClientPoint(nextZoom, center) {
  zoomAroundCanvasPoint(nextZoom, clientToCanvasPoint(center.x, center.y), center);
}

function updatePinch() {
  if (!pinchState || activePointers.size < 2) return;
  const [first, second] = Array.from(activePointers.values());
  const scale = pointerDistance(first, second) / pinchState.distance;
  zoomAroundCanvasPoint(pinchState.zoom * scale, pinchState.anchor, pointerCenter(first, second));
}

function releasePointer(event) {
  if (canvas.hasPointerCapture(event.pointerId)) {
    canvas.releasePointerCapture(event.pointerId);
  }
  activePointers.delete(event.pointerId);
  if (activePointers.size < 2) pinchState = null;
}

async function onPointerDown(event) {
  if (!state.image) return;
  event.preventDefault();
  activePointers.set(event.pointerId, { clientX: event.clientX, clientY: event.clientY });
  canvas.setPointerCapture(event.pointerId);

  if (activePointers.size >= 2) {
    beginPinch();
    return;
  }

  const point = canvasPoint(event);

  if (state.tool === "line" || state.tool === "measure") {
    const start = snapPointToObject(point);
    state.drawingLine = {
      id: id(),
      type: "line",
      kind: state.lineKind,
      role: state.tool === "measure" ? "measure" : "utility",
      points: [start, start]
    };
    render();
    return;
  }

  if (state.tool === "polyline") {
    if (!state.polylineDraft) {
      const start = snapPointToObject(point);
      state.polylineDraft = {
        id: id(),
        type: "line",
        kind: state.lineKind,
        points: [start],
        previewPoint: start
      };
    } else {
      const last = state.polylineDraft.points[state.polylineDraft.points.length - 1];
      state.polylineDraft.previewPoint = snapLineEndpoint(last, point);
    }
    state.polylinePointer = event.pointerId;
    render();
    updateUi();
    return;
  }

  if (state.tool === "pipe") {
    const projection = nearestLineProjection(point, 80);
    const start = projection ? { x: projection.x, y: projection.y } : point;
    const active = activePipeAnnotation();
    state.pipeDraft = {
      id: id(),
      type: "pipe",
      kind: active.kind,
      label: active.label,
      lineId: projection?.lineId || null,
      color: active.color,
      fill: active.fill,
      width: active.width,
      cableCount: active.cableCount,
      points: [start, start]
    };
    render();
    return;
  }

  if (state.tool === "object") {
    pushHistory();
    const annotation = {
      id: id(),
      type: "object",
      kind: state.objectKind,
      x: point.x,
      y: point.y,
      scale: 1,
      rotation: 0,
      fuseAmp: state.objectKind === "fuseBox" ? 125 : undefined,
      label: nextMuffeLabel(state.objectKind)
    };
    if (state.objectSnap) snapObject(annotation);
    state.annotations.push(annotation);
    state.selectedId = annotation.id;
    returnToSelectIfNeeded();
    render();
    updateUi();
    return;
  }

  if (state.tool === "label") {
    const text = await showTextPrompt("Tekst");
    if (text && text.trim()) {
      pushHistory();
      const annotation = {
        id: id(),
        type: "text",
        text: text.trim(),
        x: point.x,
        y: point.y,
        size: 30,
        color: "#1c2421",
        autoArrow: state.textArrow,
        arrowThreshold: state.textArrowThreshold
      };
      state.annotations.push(annotation);
      state.selectedId = annotation.id;
      returnToSelectIfNeeded();
      render();
      updateUi();
    }
    return;
  }

  if (state.tool === "signature") {
    if (!state.signatureName && !state.signatureStrokes.length) {
      await editSignatureProfile();
    }
    if (!state.signatureName && !state.signatureStrokes.length) return;
    pushHistory();
    const annotation = {
      id: id(),
      type: "signature",
      x: point.x,
      y: point.y,
      name: state.signatureName,
      text: state.signatureText || "",
      strokes: deepCopy(state.signatureStrokes),
      date: new Date().toISOString(),
      size: 30,
      width: 360,
      height: 150
    };
    state.annotations.push(annotation);
    state.selectedId = annotation.id;
    returnToSelectIfNeeded();
    render();
    updateUi();
    return;
  }

  const hit = hitTest(point);

  if (state.tool === "erase") {
    if (hit) {
      pushHistory();
      state.annotations = state.annotations.filter((item) => item.id !== hit.annotation.id);
      state.selectedId = null;
      render();
      updateUi();
    }
    return;
  }

  state.selectedId = hit ? hit.annotation.id : null;
  if (hit) {
    pushHistory();
    state.drag = {
      id: hit.annotation.id,
      part: hit.part,
      start: point,
      original: deepCopy(hit.annotation)
    };
  } else {
    state.drag = null;
    if (state.tool === "select" && state.zoom > 1) {
      state.pan = {
        pointerId: event.pointerId,
        clientX: event.clientX,
        clientY: event.clientY,
        scrollLeft: stage.scrollLeft,
        scrollTop: stage.scrollTop
      };
    }
  }
  render();
  updateUi();
}

function onPointerMove(event) {
  if (!state.image) return;
  if (activePointers.has(event.pointerId)) {
    activePointers.set(event.pointerId, { clientX: event.clientX, clientY: event.clientY });
  }

  if (pinchState) {
    event.preventDefault();
    updatePinch();
    return;
  }

  const point = canvasPoint(event);

  if (state.drawingLine) {
    const start = state.drawingLine.points[0];
    state.drawingLine.points[1] = snapLineEndpoint(start, point);
    render();
    return;
  }

  if (state.polylineDraft && state.tool === "polyline") {
    const last = state.polylineDraft.points[state.polylineDraft.points.length - 1];
    state.polylineDraft.previewPoint = snapLineEndpoint(last, point);
    render();
    return;
  }

  if (state.pipeDraft && state.tool === "pipe") {
    const projection = state.pipeDraft.lineId
      ? nearestLineProjection(point, 120, { lineId: state.pipeDraft.lineId })
      : nearestLineProjection(point, 46);
    if (projection && (state.pipeDraft.lineId || projection.distance < 46)) {
      state.pipeDraft.lineId = projection.lineId;
      state.pipeDraft.points[1] = { x: projection.x, y: projection.y };
    } else {
      const start = state.pipeDraft.points[0];
      state.pipeDraft.points[1] = snapLinePoint(start, point);
    }
    render();
    return;
  }

  if (state.pan && state.pan.pointerId === event.pointerId) {
    event.preventDefault();
    stage.scrollLeft = state.pan.scrollLeft - (event.clientX - state.pan.clientX);
    stage.scrollTop = state.pan.scrollTop - (event.clientY - state.pan.clientY);
    return;
  }

  if (!state.drag) return;
  event.preventDefault();
  const annotation = getAnnotation(state.drag.id);
  if (!annotation) return;
  const dx = point.x - state.drag.start.x;
  const dy = point.y - state.drag.start.y;
  const original = state.drag.original;

  if (annotation.type === "line") {
    if (state.drag.part.startsWith("point:")) {
      const index = Number(state.drag.part.split(":")[1]);
      const moved = {
        x: original.points[index].x + dx,
        y: original.points[index].y + dy
      };
      if (annotation.points.length === 2) {
        const otherIndex = index === 0 ? 1 : 0;
        annotation.points[index] = snapLineEndpoint(annotation.points[otherIndex], moved);
      } else {
        annotation.points[index] = snapPointToObject(moved);
      }
    } else {
      annotation.points = original.points.map((p) => ({ x: p.x + dx, y: p.y + dy }));
    }
    updateObjectsAttachedToLine(annotation);
  }

  if (annotation.type === "object") {
    if (state.drag.part === "object-scale") {
      const originalDistance = Math.max(8, distance(original, originalScaleHandle(original)));
      const currentDistance = Math.max(8, distance(annotation, point));
      annotation.scale = clamp((original.scale || 1) * (currentDistance / originalDistance), 0.45, 3);
    } else if (state.drag.part === "object-rotate") {
      annotation.rotation = Math.atan2(point.y - original.y, point.x - original.x) + Math.PI / 2;
    } else {
      annotation.x = original.x + dx;
      annotation.y = original.y + dy;
      if (state.objectSnap) snapObject(annotation);
      if (annotation.kind === "pole") updateFuseBoxesAttachedToPole(annotation);
    }
    if (annotation.kind === "pole") updateFuseBoxesAttachedToPole(annotation);
  }

  if (annotation.type === "pipe") {
    if (state.drag.part.startsWith("point:")) {
      const index = Number(state.drag.part.split(":")[1]);
      const otherIndex = index === 0 ? 1 : 0;
      const moved = { x: original.points[index].x + dx, y: original.points[index].y + dy };
      const projection = nearestLineProjection(moved, 58);
      annotation.points[index] = projection ? { x: projection.x, y: projection.y } : snapLinePoint(annotation.points[otherIndex], moved);
      annotation.lineId = projection?.lineId || null;
    } else {
      annotation.points = original.points.map((p) => ({ x: p.x + dx, y: p.y + dy }));
      const middle = pointAtLineDistance(annotation.points, linePixelLength(annotation.points) / 2) || annotation.points[0];
      const projection = nearestLineProjection(middle, 58);
      if (projection) {
        const shiftX = projection.x - middle.x;
        const shiftY = projection.y - middle.y;
        annotation.points = annotation.points.map((p) => ({ x: p.x + shiftX, y: p.y + shiftY }));
        annotation.lineId = projection.lineId;
      } else {
        annotation.lineId = null;
      }
    }
  }

  if (annotation.type === "text") {
    annotation.x = original.x + dx;
    annotation.y = original.y + dy;
  }

  if (annotation.type === "signature") {
    annotation.x = original.x + dx;
    annotation.y = original.y + dy;
  }

  render();
  updateUi(false);
}

async function onPointerUp(event) {
  if (!state.image) return;
  if (pinchState) {
    releasePointer(event);
    return;
  }

  if (state.tool === "polyline" && state.polylineDraft && state.polylinePointer === event.pointerId) {
    const draft = state.polylineDraft;
    const last = draft.points[draft.points.length - 1];
    const snappedNext = snapLineEndpoint(last, canvasPoint(event));
    if (distance(last, snappedNext) > 8) {
      draft.points.push(snappedNext);
      draft.previewPoint = snappedNext;
    }
    state.polylinePointer = null;
    releasePointer(event);
    render();
    updateUi();
    return;
  }

  if (state.drawingLine) {
    const line = state.drawingLine;
    state.drawingLine = null;
    const length = Math.hypot(line.points[1].x - line.points[0].x, line.points[1].y - line.points[0].y);
    if (length > 8) {
      pushHistory();
      if (line.role === "utility") {
        line.label = await askLineName(line.label || "");
      }
      if (line.role === "measure") {
        line.meters = metersForLine(line);
        if (!state.metersPerPixel) await calibrateFromLine(line, "2");
      }
      state.annotations.push(line);
      state.selectedId = line.id;
      returnToSelectIfNeeded();
    }
    render();
    updateUi();
  }

  if (state.pipeDraft) {
    const pipe = state.pipeDraft;
    state.pipeDraft = null;
    if (linePixelLength(pipe.points) > 8) {
      pushHistory();
      state.annotations.push(pipe);
      state.selectedId = pipe.id;
      returnToSelectIfNeeded();
    }
    render();
    updateUi();
  }

  state.drag = null;
  state.pan = null;
  releasePointer(event);
}

function getAnnotation(annotationId) {
  return state.annotations.find((annotation) => annotation.id === annotationId);
}

function hitTest(point) {
  const selected = getAnnotation(state.selectedId);
  if (selected?.type === "object") {
    const handles = objectHandles(selected);
    if (distance(point, handles.scale) <= 22) return { annotation: selected, part: "object-scale" };
    if (distance(point, handles.rotate) <= 22) return { annotation: selected, part: "object-rotate" };
  }

  for (let i = state.annotations.length - 1; i >= 0; i -= 1) {
    const annotation = state.annotations[i];
    if (annotation.type === "line") {
      const isMeasure = annotation.role === "measure";
      const style = lineStyleFor(annotation, isMeasure);
      const paths = parallelLinePaths(annotation.points, annotation, style, isMeasure);
      for (let pointIndex = 0; pointIndex < annotation.points.length; pointIndex += 1) {
        if (distance(point, annotation.points[pointIndex]) <= 24) {
          return { annotation, part: `point:${pointIndex}` };
        }
      }
      for (const path of paths) {
        for (let pointIndex = 0; pointIndex < path.length - 1; pointIndex += 1) {
          const start = path[pointIndex];
          const end = path[pointIndex + 1];
          if (distanceToSegment(point, start, end) <= 18) return { annotation, part: "body" };
        }
      }
    }

    if (annotation.type === "pipe") {
      const style = pipeStyleFor(annotation);
      const paths = parallelPipePaths(annotation.points, annotation, style);
      for (let pointIndex = 0; pointIndex < annotation.points.length; pointIndex += 1) {
        if (distance(point, annotation.points[pointIndex]) <= 24) {
          return { annotation, part: `point:${pointIndex}` };
        }
      }
      for (const path of paths) {
        for (let pointIndex = 0; pointIndex < path.length - 1; pointIndex += 1) {
          const start = path[pointIndex];
          const end = path[pointIndex + 1];
          if (distanceToSegment(point, start, end) <= 22) return { annotation, part: "body" };
        }
      }
    }

    if (annotation.type === "object") {
      const radius = 34 * (annotation.scale || 1);
      if (distance(point, annotation) <= radius) return { annotation, part: "body" };
    }

    if (annotation.type === "text") {
      const box = getTextBox(annotation);
      if (
        point.x >= box.x - 8 &&
        point.x <= box.x + box.w + 8 &&
        point.y >= box.y - 8 &&
        point.y <= box.y + box.h + 8
      ) {
        return { annotation, part: "body" };
      }
    }

    if (annotation.type === "signature") {
      const box = getSignatureBox(annotation);
      if (
        point.x >= box.x - 8 &&
        point.x <= box.x + box.w + 8 &&
        point.y >= box.y - 8 &&
        point.y <= box.y + box.h + 8
      ) {
        return { annotation, part: "body" };
      }
    }
  }
  return null;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function linePixelLength(points) {
  if (!points || points.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < points.length - 1; i += 1) {
    total += distance(points[i], points[i + 1]);
  }
  return total;
}

function formatMeters(value) {
  if (!Number.isFinite(value)) return "";
  if (value < 10) return value.toFixed(2);
  if (value < 100) return value.toFixed(1);
  return value.toFixed(0);
}

function formatDate(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("no-NO");
}

function degreesToRadians(value) {
  return (value * Math.PI) / 180;
}

function radiansToDegrees(value) {
  return Math.round((value * 180) / Math.PI);
}

function metersForLine(annotation) {
  const pixels = linePixelLength(annotation.points);
  if (state.metersPerPixel) return pixels * state.metersPerPixel;
  return Number.isFinite(annotation.meters) ? annotation.meters : null;
}

function measurementText(annotation) {
  const meters = metersForLine(annotation);
  return Number.isFinite(meters) ? `${formatMeters(meters)} m` : "Kalibrer";
}

function distanceToSegment(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (dx === 0 && dy === 0) return distance(point, start);
  const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy)));
  return distance(point, { x: start.x + t * dx, y: start.y + t * dy });
}

function projectPointToSegment(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (dx === 0 && dy === 0) return { x: start.x, y: start.y, t: 0, angle: 0 };
  const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy)));
  return {
    x: start.x + t * dx,
    y: start.y + t * dy,
    t,
    angle: Math.atan2(dy, dx)
  };
}

function objectAnchorPoint(annotation) {
  if (!annotation || annotation.type !== "object") return null;
  return { x: annotation.x, y: annotation.y, annotation };
}

function nearestObjectPoint(point, threshold = 48, options = {}) {
  if (!state.objectSnap && !options.force) return null;
  let best = null;
  state.annotations.forEach((annotation) => {
    if (annotation.type !== "object") return;
    if (options.excludeId && annotation.id === options.excludeId) return;
    const anchor = objectAnchorPoint(annotation);
    const d = distance(point, anchor);
    if (d <= threshold && (!best || d < best.distance)) {
      best = { ...anchor, distance: d, objectId: annotation.id };
    }
  });
  return best;
}

function snapPointToObject(point, threshold = 48, options = {}) {
  if (!state.objectSnap && !options.force) return point;
  const snap = nearestObjectPoint(point, threshold, options);
  return snap ? { x: snap.x, y: snap.y } : point;
}

function snapLineEndpoint(start, point, options = {}) {
  const objectPoint = state.objectSnap || options.force ? snapPointToObject(point, 48, options) : point;
  return snapLinePoint(start, objectPoint);
}

function nearestLineProjection(point, threshold = 46, options = {}) {
  if (!state.objectSnap && !options.force) return null;
  let best = null;
  state.annotations.forEach((annotation) => {
    if (annotation.type !== "line") return;
    if (annotation.role && annotation.role !== "utility") return;
    if (options.excludeId && annotation.id === options.excludeId) return;
    if (options.lineId && annotation.id !== options.lineId) return;
    for (let segmentIndex = 0; segmentIndex < annotation.points.length - 1; segmentIndex += 1) {
      const projected = projectPointToSegment(point, annotation.points[segmentIndex], annotation.points[segmentIndex + 1]);
      const d = distance(point, projected);
      if (d <= threshold && (!best || d < best.distance)) {
        best = { ...projected, distance: d, lineId: annotation.id, segmentIndex };
      }
    }
  });
  return best;
}

function nearestArrowTarget(textAnnotation) {
  const box = getTextBox(textAnnotation);
  const point = { x: box.x + box.w / 2, y: box.y + box.h / 2 };
  const threshold = textArrowThresholdReach(textAnnotation.arrowThreshold ?? state.textArrowThreshold);
  let best = null;

  state.annotations.forEach((annotation) => {
    if (annotation.id === textAnnotation.id) return;
    if (annotation.type === "line") {
      for (let i = 0; i < annotation.points.length - 1; i += 1) {
        const projected = projectPointToSegment(point, annotation.points[i], annotation.points[i + 1]);
        const d = distance(point, projected);
        if (d <= threshold && (!best || d < best.distance)) best = { ...projected, distance: d };
      }
    }
    if (annotation.type === "object") {
      const target = objectArrowTarget(annotation, point);
      const d = distance(point, target);
      if (d <= threshold && (!best || d < best.distance)) best = { ...target, distance: d };
    }
  });

  return best;
}

function snapObjectToLine(annotation) {
  if (!state.objectSnap) {
    annotation.snapTarget = null;
    return false;
  }
  const projection = nearestLineProjection(annotation, 52);
  if (!projection) {
    annotation.snapTarget = null;
    return false;
  }
  annotation.x = projection.x;
  annotation.y = projection.y;
  annotation.snapTarget = {
    lineId: projection.lineId,
    segmentIndex: projection.segmentIndex,
    t: projection.t
  };
  return true;
}

function nearestPole(point, threshold = 70, excludeId = null) {
  let best = null;
  state.annotations.forEach((annotation) => {
    if (annotation.type !== "object" || annotation.kind !== "pole" || annotation.id === excludeId) return;
    const d = distance(point, annotation);
    if (d <= threshold && (!best || d < best.distance)) {
      best = { annotation, distance: d };
    }
  });
  return best;
}

function snapFuseBoxToPole(annotation) {
  if (!state.objectSnap) {
    annotation.snapTarget = null;
    return false;
  }
  const nearest = nearestPole(annotation, 80, annotation.id);
  if (!nearest) {
    annotation.snapTarget = null;
    return false;
  }
  const pole = nearest.annotation;
  const poleSize = 26 * (pole.scale || 1);
  const ownSize = 26 * (annotation.scale || 1);
  const currentAngle = Math.atan2(annotation.y - pole.y, annotation.x - pole.x);
  const angle = Number.isFinite(currentAngle) ? currentAngle : 0;
  const radius = Math.max(poleSize + ownSize * 0.9, distance(annotation, pole));
  annotation.x = pole.x + Math.cos(angle) * radius;
  annotation.y = pole.y + Math.sin(angle) * radius;
  annotation.snapTarget = {
    objectId: pole.id,
    kind: "pole",
    offsetX: annotation.x - pole.x,
    offsetY: annotation.y - pole.y
  };
  return true;
}

function snapObject(annotation) {
  if (!state.objectSnap) {
    annotation.snapTarget = null;
    return false;
  }
  if (annotation.kind === "fuseBox") return snapFuseBoxToPole(annotation);
  return snapObjectToLine(annotation);
}

function updateObjectsAttachedToLine(line) {
  if (!state.objectSnap) return;
  state.annotations.forEach((annotation) => {
    if (annotation.type !== "object" || annotation.snapTarget?.lineId !== line.id) return;
    const start = line.points[annotation.snapTarget.segmentIndex];
    const end = line.points[annotation.snapTarget.segmentIndex + 1];
    if (!start || !end) return;
    const t = clamp(annotation.snapTarget.t, 0, 1);
    annotation.x = start.x + (end.x - start.x) * t;
    annotation.y = start.y + (end.y - start.y) * t;
  });
}

function updateFuseBoxesAttachedToPole(pole) {
  if (!state.objectSnap) return;
  state.annotations.forEach((annotation) => {
    if (annotation.type !== "object" || annotation.kind !== "fuseBox") return;
    if (annotation.snapTarget?.objectId !== pole.id) return;
    annotation.x = pole.x + (annotation.snapTarget.offsetX || 0);
    annotation.y = pole.y + (annotation.snapTarget.offsetY || 0);
  });
}

function getTextBox(annotation) {
  ctx.save();
  ctx.font = `800 ${annotation.size || 28}px system-ui, sans-serif`;
  const padding = 9;
  const width = ctx.measureText(annotation.text || "").width + padding * 2;
  const height = (annotation.size || 28) + padding * 2;
  ctx.restore();
  return { x: annotation.x, y: annotation.y, w: width, h: height };
}

function rectEdgePoint(box, target) {
  const center = { x: box.x + box.w / 2, y: box.y + box.h / 2 };
  const dx = target.x - center.x;
  const dy = target.y - center.y;
  if (!dx && !dy) return center;
  const halfW = box.w / 2;
  const halfH = box.h / 2;
  const scale = 1 / Math.max(Math.abs(dx) / halfW, Math.abs(dy) / halfH);
  return { x: center.x + dx * scale, y: center.y + dy * scale };
}

function objectShapeRadii(annotation) {
  const kind = objectKinds[annotation.kind] || objectKinds.pole;
  const size = 26 * (annotation.scale || 1);
  if (kind.shape === "rect") return { rx: size * 1.35, ry: size * 0.82, mode: "box" };
  if (kind.shape === "fuseBox") return { rx: size * 1.05, ry: size * 0.9, mode: "box" };
  if (kind.shape === "roundRect") return { rx: size * 1.18, ry: size * 0.78, mode: "box" };
  if (kind.shape === "square") return { rx: size, ry: size, mode: "box" };
  if (kind.shape === "oval") return { rx: size * 1.35, ry: size * 0.78, mode: "ellipse" };
  return { rx: size, ry: size, mode: "ellipse" };
}

function objectArrowTarget(annotation, fromPoint) {
  const radii = objectShapeRadii(annotation);
  const angle = -(annotation.rotation || 0);
  const dx = fromPoint.x - annotation.x;
  const dy = fromPoint.y - annotation.y;
  const local = {
    x: dx * Math.cos(angle) - dy * Math.sin(angle),
    y: dx * Math.sin(angle) + dy * Math.cos(angle)
  };
  if (!local.x && !local.y) return { x: annotation.x, y: annotation.y };

  let scale;
  if (radii.mode === "box") {
    scale = 1 / Math.max(Math.abs(local.x) / radii.rx, Math.abs(local.y) / radii.ry);
  } else {
    scale = 1 / Math.sqrt((local.x * local.x) / (radii.rx * radii.rx) + (local.y * local.y) / (radii.ry * radii.ry));
  }

  const edge = { x: local.x * scale, y: local.y * scale };
  const rotation = annotation.rotation || 0;
  return {
    x: annotation.x + edge.x * Math.cos(rotation) - edge.y * Math.sin(rotation),
    y: annotation.y + edge.x * Math.sin(rotation) + edge.y * Math.cos(rotation)
  };
}

function getSignatureBox(annotation) {
  const size = annotation.size || 30;
  const scale = size / 30;
  const baseWidth = annotation.width || 360;
  const baseHeight = annotation.height || 150;
  ctx.save();
  ctx.font = `700 ${Math.max(16, size * 0.55)}px system-ui, sans-serif`;
  const footerWidth = ctx.measureText(`${annotation.name || "Navn"} · ${formatDate(annotation.date)}`).width;
  ctx.restore();
  return {
    x: annotation.x,
    y: annotation.y,
    w: Math.max(baseWidth * scale, footerWidth + 32),
    h: baseHeight * scale
  };
}

function updateUi(updateSelection = true) {
  exportBtn.disabled = !state.image;
  saveProjectBtn.disabled = !state.image;
  const selected = getAnnotation(state.selectedId);
  const undoDisabled = !state.history.length && !state.polylineDraft;
  const redoDisabled = !state.redo.length;
  const clearDisabled = !state.annotations.length;
  [undoBtn, compactUndoBtn].forEach((button) => {
    if (button) button.disabled = undoDisabled;
  });
  [redoBtn, compactRedoBtn].forEach((button) => {
    if (button) button.disabled = redoDisabled;
  });
  [clearBtn, compactClearBtn].forEach((button) => {
    if (button) button.disabled = clearDisabled;
  });
  const lineTypeVisible = state.tool === "line" || state.tool === "polyline";
  const objectTypeVisible = state.tool === "object";
  const selectedVisible = Boolean(selected);
  const propertiesVisible = objectTypeVisible || selectedVisible;
  if (lineTypePanel) lineTypePanel.classList.toggle("hidden", !lineTypeVisible);
  if (objectTypePanel) objectTypePanel.classList.toggle("hidden", !objectTypeVisible);
  if (selectedPanel) selectedPanel.classList.toggle("hidden", !selectedVisible);
  if (propertiesPanel) propertiesPanel.classList.toggle("hidden", !propertiesVisible);
  if (content) content.classList.toggle("properties-collapsed", !propertiesVisible);
  if (textToolPanel) textToolPanel.classList.toggle("hidden", state.tool !== "label");
  if (pipeTypePanel) pipeTypePanel.classList.toggle("hidden", state.tool !== "pipe");
  updatePipeToolEditor();
  if (signatureTypePanel) signatureTypePanel.classList.toggle("hidden", state.tool !== "signature");
  if (finishPolylineBtn) {
    const hasDraft = Boolean(state.polylineDraft);
    finishPolylineBtn.classList.toggle("hidden", !hasDraft);
    finishPolylineBtn.textContent = state.polylineDraft?.points.length > 1 ? "Ferdig" : "Avbryt";
  }
  if (compactFinishPolylineBtn) {
    const hasDraft = Boolean(state.polylineDraft);
    compactFinishPolylineBtn.classList.toggle("hidden", !hasDraft);
    compactFinishPolylineBtn.textContent = state.polylineDraft?.points.length > 1 ? "Ferdig" : "Avbryt";
  }
  if (updateSelection) updateSelectedPanel();
  updateMobileEditPanel();
}

function updateSelectedPanel() {
  const selected = getAnnotation(state.selectedId);
  if (!selected) {
    selectedCard.innerHTML = "<p>Ingen valgt</p>";
    return;
  }

  if (selected.type === "line") {
    if (selected.role === "measure") {
      selectedCard.innerHTML = `
        <label class="field">
          <span>Meter</span>
          <input id="selectedMeasureMeters" inputmode="decimal" value="${escapeAttr(metersForLine(selected) ? formatMeters(metersForLine(selected)) : "")}" />
        </label>
        <p>${state.metersPerPixel ? "Skala er kalibrert" : "Sett kjent lengde for å kalibrere"}</p>
        <button class="btn delete-selected" id="deleteSelectedBtn" type="button">Slett</button>
      `;
      document.querySelector("#selectedMeasureMeters").addEventListener("change", (event) => {
        const meters = Number(event.target.value.replace(",", "."));
        const pixels = linePixelLength(selected.points);
        if (!Number.isFinite(meters) || meters <= 0 || !pixels) return;
        pushHistory();
        state.metersPerPixel = meters / pixels;
        selected.meters = meters;
        render();
        updateUi(false);
      });
    } else {
      const selectedStyle = lineStyleFor(selected);
      selectedCard.innerHTML = `
        <label class="field">
          <span>Navn</span>
          <input id="selectedLineLabel" value="${escapeAttr(selected.label || "")}" />
        </label>
        <label class="field">
          <span>Linjetype</span>
          <select id="selectedLineKind">
            ${Object.entries(lineKinds)
              .map(([key, value]) => `<option value="${key}" ${selected.kind === key ? "selected" : ""}>${value.label}</option>`)
              .join("")}
          </select>
        </label>
        <label class="field color-field">
          <span>Farge</span>
          ${colorButtonHtml("selectedLineColor", selectedStyle.color)}
        </label>
        <label class="field">
          <span>Størrelse</span>
          <input id="selectedLineWidth" type="range" min="2" max="18" step="0.25" value="${selectedStyle.width}" />
        </label>
        <label class="toggle compact">
          <input id="selectedLineDashed" type="checkbox" ${selectedStyle.dash?.length ? "checked" : ""} />
          <span>Stripet strek</span>
        </label>
        <label class="toggle compact">
          <input id="selectedLineArrow" type="checkbox" ${selectedStyle.arrowEnd ? "checked" : ""} />
          <span>Pil på slutt</span>
        </label>
        <label class="field">
          <span>Antall kabler</span>
          <input id="selectedLineCableCount" type="number" inputmode="numeric" min="1" max="12" step="1" value="${lineCableCount(selected)}" />
        </label>
        <button class="btn delete-selected" id="deleteSelectedBtn" type="button">Slett</button>
      `;
      document.querySelector("#selectedLineLabel").addEventListener("change", (event) => {
        pushHistory();
        selected.label = event.target.value.trim();
        render();
        updateUi(false);
      });
      document.querySelector("#selectedLineKind").addEventListener("change", (event) => {
        pushHistory();
        selected.kind = event.target.value;
        delete selected.color;
        delete selected.halo;
        delete selected.width;
        delete selected.dash;
        delete selected.arrowEnd;
        render();
        updateUi(false);
      });
      let lineStyleHistoryPushed = false;
      const pushLineStyleHistory = () => {
        if (lineStyleHistoryPushed) return;
        pushHistory();
        lineStyleHistoryPushed = true;
      };
      document.querySelector("#selectedLineColor").addEventListener("click", () => {
        openColorDialog({
          title: "Farge på linje",
          color: lineStyleFor(selected).color,
          onApply: (color) => {
            pushHistory();
            selected.color = color;
            selected.halo = colorToRgba(color);
            render();
            updateSelectedPanel();
          }
        });
      });
      document.querySelector("#selectedLineWidth").addEventListener("input", (event) => {
        pushLineStyleHistory();
        selected.width = Number(event.target.value);
        render();
      });
      document.querySelector("#selectedLineWidth").addEventListener("change", () => {
        lineStyleHistoryPushed = false;
        updateUi(false);
      });
      document.querySelector("#selectedLineDashed").addEventListener("change", (event) => {
        pushHistory();
        selected.dash = event.target.checked ? [22, 13] : [];
        event.target.checked = Boolean(selected.dash.length);
        render();
        updateSelectedPanel();
      });
      document.querySelector("#selectedLineArrow").addEventListener("change", (event) => {
        pushHistory();
        selected.arrowEnd = event.target.checked;
        event.target.checked = Boolean(selected.arrowEnd);
        render();
        updateSelectedPanel();
      });
      document.querySelector("#selectedLineCableCount").addEventListener("change", (event) => {
        pushHistory();
        selected.cableCount = lineCableCount({ cableCount: event.target.value });
        event.target.value = selected.cableCount;
        render();
        updateUi(false);
      });
    }
  }

  if (selected.type === "object") {
    selectedCard.innerHTML = `
      <label class="field">
        <span>Objekt</span>
        <select id="selectedObjectKind">
          ${Object.entries(objectKinds)
            .map(([key, value]) => `<option value="${key}" ${selected.kind === key ? "selected" : ""}>${value.label}</option>`)
            .join("")}
        </select>
      </label>
      <label class="field">
        <span>Etikett</span>
        <input id="selectedObjectLabel" value="${escapeAttr(selected.label || "")}" />
      </label>
      <label class="field">
        <span>Størrelse</span>
        <input id="selectedObjectScale" type="range" min="0.45" max="3" step="0.05" value="${selected.scale || 1}" />
      </label>
      <label class="field">
        <span>Roter</span>
        <input id="selectedObjectRotation" type="range" min="-180" max="180" step="1" value="${radiansToDegrees(selected.rotation || 0)}" />
      </label>
      ${selected.kind === "fuseBox" ? `
        <label class="field">
          <span>Sikring</span>
          <select id="selectedFuseAmp">
            ${fuseAmpOptions.map((amp) => `<option value="${amp}" ${Number(selected.fuseAmp || 125) === amp ? "selected" : ""}>${amp}A</option>`).join("")}
          </select>
        </label>
      ` : ""}
      <button class="btn delete-selected" id="deleteSelectedBtn" type="button">Slett</button>
    `;
    document.querySelector("#selectedObjectKind").addEventListener("change", (event) => {
      pushHistory();
      selected.kind = event.target.value;
      applyObjectKindDefaults(selected);
      setObjectKind(selected.kind);
      render();
      updateUi(false);
    });
    document.querySelector("#selectedObjectLabel").addEventListener("change", (event) => {
      pushHistory();
      selected.label = event.target.value.trim();
      render();
      updateUi(false);
    });
    const objectScaleInput = document.querySelector("#selectedObjectScale");
    let objectScaleHistoryPushed = false;
    objectScaleInput.addEventListener("input", (event) => {
      if (!objectScaleHistoryPushed) {
        pushHistory();
        objectScaleHistoryPushed = true;
      }
      selected.scale = Number(event.target.value);
      render();
    });
    objectScaleInput.addEventListener("change", () => {
      objectScaleHistoryPushed = false;
      render();
      updateUi(false);
    });
    const objectRotationInput = document.querySelector("#selectedObjectRotation");
    let objectRotationHistoryPushed = false;
    objectRotationInput.addEventListener("input", (event) => {
      if (!objectRotationHistoryPushed) {
        pushHistory();
        objectRotationHistoryPushed = true;
      }
      selected.rotation = degreesToRadians(Number(event.target.value));
      render();
    });
    objectRotationInput.addEventListener("change", () => {
      objectRotationHistoryPushed = false;
      render();
      updateUi(false);
    });
    const selectedFuseAmp = document.querySelector("#selectedFuseAmp");
    if (selectedFuseAmp) {
      selectedFuseAmp.addEventListener("change", (event) => {
        pushHistory();
        selected.fuseAmp = Number(event.target.value);
        render();
        updateUi(false);
      });
    }
  }

  if (selected.type === "pipe") {
    const selectedPipeStyle = pipeStyleFor(selected);
    selectedCard.innerHTML = `
      <label class="field">
        <span>Rørtype</span>
        <select id="selectedPipeKind">
          ${Object.entries(pipeKinds)
            .map(([key, value]) => `<option value="${key}" ${selected.kind === key ? "selected" : ""}>${value.label}</option>`)
            .join("")}
        </select>
      </label>
      <label class="field">
        <span>Etikett</span>
        <input id="selectedPipeLabel" value="${escapeAttr(selected.label || pipeKinds[selected.kind]?.label || "")}" />
      </label>
      <label class="field color-field">
        <span>Farge</span>
        ${colorButtonHtml("selectedPipeColor", selectedPipeStyle.color)}
      </label>
      <label class="field">
        <span>Størrelse</span>
        <input id="selectedPipeWidth" type="range" min="6" max="42" step="0.5" value="${selectedPipeStyle.width}" />
      </label>
      <label class="field">
        <span>Antall parallelle rør</span>
        <input id="selectedPipeCableCount" type="number" inputmode="numeric" min="1" max="8" step="1" value="${pipeCableCount(selected)}" />
      </label>
      <button class="btn delete-selected" id="deleteSelectedBtn" type="button">Slett</button>
    `;
    document.querySelector("#selectedPipeKind").addEventListener("change", (event) => {
      pushHistory();
      const oldDefault = pipeKinds[selected.kind]?.label;
      selected.kind = event.target.value;
      delete selected.color;
      delete selected.fill;
      delete selected.width;
      if (!selected.label || selected.label === oldDefault) selected.label = pipeKinds[selected.kind].label;
      render();
      updateUi(false);
    });
    document.querySelector("#selectedPipeLabel").addEventListener("change", (event) => {
      pushHistory();
      selected.label = event.target.value.trim();
      render();
      updateUi(false);
    });
    let pipeStyleHistoryPushed = false;
    const pushPipeStyleHistory = () => {
      if (pipeStyleHistoryPushed) return;
      pushHistory();
      pipeStyleHistoryPushed = true;
    };
    document.querySelector("#selectedPipeColor").addEventListener("click", () => {
      openColorDialog({
        title: "Farge på rør",
        color: pipeStyleFor(selected).color,
        onApply: (color) => {
          pushHistory();
          selected.color = color;
          selected.fill = colorToRgba(color, 0.26);
          render();
          updateSelectedPanel();
        }
      });
    });
    document.querySelector("#selectedPipeWidth").addEventListener("input", (event) => {
      pushPipeStyleHistory();
      selected.width = Number(event.target.value);
      render();
    });
    document.querySelector("#selectedPipeWidth").addEventListener("change", () => {
      pipeStyleHistoryPushed = false;
      updateUi(false);
    });
    document.querySelector("#selectedPipeCableCount").addEventListener("change", (event) => {
      pushHistory();
      selected.cableCount = pipeCableCount({ cableCount: event.target.value });
      event.target.value = selected.cableCount;
      render();
      updateUi(false);
    });
  }

  if (selected.type === "text") {
    selectedCard.innerHTML = `
      <label class="field">
        <span>Tekst</span>
        <input id="selectedTextValue" value="${escapeAttr(selected.text || "")}" />
      </label>
      <label class="field">
        <span>Størrelse</span>
        <input id="selectedTextSize" type="range" min="18" max="72" step="1" value="${selected.size || 30}" />
      </label>
      <label class="toggle compact">
        <input id="selectedTextArrow" type="checkbox" ${selected.autoArrow ? "checked" : ""} />
        <span>Tekstpil</span>
      </label>
      <label class="field">
        <span>Terskel</span>
        <div class="range-with-value">
          <input id="selectedTextArrowThreshold" type="range" min="${TEXT_ARROW_MIN_THRESHOLD}" max="${TEXT_ARROW_INFINITY_VALUE}" step="5" value="${normalizeTextArrowThreshold(selected.arrowThreshold ?? state.textArrowThreshold)}" />
          <output id="selectedTextArrowThresholdReadout">${textArrowThresholdLabel(selected.arrowThreshold ?? state.textArrowThreshold)}</output>
        </div>
      </label>
      <button class="btn delete-selected" id="deleteSelectedBtn" type="button">Slett</button>
    `;
    document.querySelector("#selectedTextValue").addEventListener("change", (event) => {
      pushHistory();
      selected.text = event.target.value.trim();
      render();
      updateUi(false);
    });
    const textSizeInput = document.querySelector("#selectedTextSize");
    let textSizeHistoryPushed = false;
    textSizeInput.addEventListener("input", (event) => {
      if (!textSizeHistoryPushed) {
        pushHistory();
        textSizeHistoryPushed = true;
      }
      selected.size = Number(event.target.value);
      render();
    });
    textSizeInput.addEventListener("change", () => {
      textSizeHistoryPushed = false;
      render();
      updateUi(false);
    });
    document.querySelector("#selectedTextArrow").addEventListener("change", (event) => {
      pushHistory();
      selected.autoArrow = event.target.checked;
      render();
      updateUi(false);
    });
    document.querySelector("#selectedTextArrowThreshold").addEventListener("input", (event) => {
      selected.arrowThreshold = normalizeTextArrowThreshold(event.target.value);
      document.querySelector("#selectedTextArrowThresholdReadout").textContent = textArrowThresholdLabel(selected.arrowThreshold);
      render();
    });
  }

  if (selected.type === "signature") {
    selectedCard.innerHTML = `
      <label class="field">
        <span>Navn</span>
        <input id="selectedSignatureName" value="${escapeAttr(selected.name || "")}" />
      </label>
      <label class="field">
        <span>Størrelse</span>
        <input id="selectedSignatureSize" type="range" min="18" max="72" step="1" value="${selected.size || 30}" />
      </label>
      <button class="btn" id="selectedSignatureUseSavedBtn" type="button">Bruk lagret underskrift</button>
      <button class="btn delete-selected" id="deleteSelectedBtn" type="button">Slett</button>
    `;
    document.querySelector("#selectedSignatureName").addEventListener("change", (event) => {
      pushHistory();
      selected.name = event.target.value.trim();
      render();
      updateUi(false);
    });
    document.querySelector("#selectedSignatureUseSavedBtn").addEventListener("click", () => {
      pushHistory();
      selected.name = state.signatureName || selected.name;
      selected.strokes = deepCopy(state.signatureStrokes || []);
      render();
      updateUi(false);
    });
    const signatureSizeInput = document.querySelector("#selectedSignatureSize");
    let signatureSizeHistoryPushed = false;
    signatureSizeInput.addEventListener("input", (event) => {
      if (!signatureSizeHistoryPushed) {
        pushHistory();
        signatureSizeHistoryPushed = true;
      }
      selected.size = Number(event.target.value);
      render();
    });
    signatureSizeInput.addEventListener("change", () => {
      signatureSizeHistoryPushed = false;
      render();
      updateUi(false);
    });
  }

  const deleteBtn = document.querySelector("#deleteSelectedBtn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      pushHistory();
      state.annotations = state.annotations.filter((annotation) => annotation.id !== state.selectedId);
      state.selectedId = null;
      render();
      updateUi();
    });
  }
}

function updateMobilePalette() {
  if (!mobilePalette) return;
  mobilePalette.classList.remove("hidden");
  if (state.tool === "object") {
    mobilePalette.innerHTML = Object.entries(objectKinds)
      .map(
        ([key, value]) =>
          `<button class="dock-choice object ${state.objectKind === key ? "active" : ""}" type="button" data-object-kind="${escapeAttr(key)}" title="${escapeAttr(value.label)}">${escapeAttr(value.mark)}</button>`
      )
      .join("") + `<button class="dock-choice object add-object" type="button" data-add-object>+ Ny</button>`;
  } else if (state.tool === "pipe") {
    const active = activePipeAnnotation();
    const style = activePipeStyle();
    mobilePalette.innerHTML = `
      <button class="dock-choice active" type="button" data-pipe-kind="${escapeAttr(state.pipeKind)}">
        <span class="swatch ${state.pipeKind === "power110" ? "pipe-red" : "pipe-yellow"}"></span>
        <span>${escapeAttr(pipeKinds[state.pipeKind]?.shortLabel || active.label)}</span>
      </button>
      <label class="dock-field">
        <span>Type</span>
        <select data-pipe-tool-kind>
          ${Object.entries(pipeKinds)
            .map(([key, value]) => `<option value="${key}" ${state.pipeKind === key ? "selected" : ""}>${escapeAttr(value.label)}</option>`)
            .join("")}
        </select>
      </label>
      <label class="dock-field wide">
        <span>Etikett</span>
        <input data-pipe-tool-label value="${escapeAttr(active.label)}" />
      </label>
      <label class="dock-field compact-color">
        <span>Farge</span>
        ${colorButtonHtml(null, style.color, "Velg").replace("<button", "<button data-pipe-tool-color-button")}
      </label>
      <label class="dock-range">
        <span>Størrelse</span>
        <input data-pipe-tool-width type="range" min="6" max="42" step="0.5" value="${style.width}" />
        <output data-pipe-tool-width-readout>${formatSliderValue(style.width)}</output>
      </label>
      <label class="dock-field compact-number">
        <span>Antall</span>
        <input data-pipe-tool-count type="number" inputmode="numeric" min="1" max="8" step="1" value="${pipeCableCount(active)}" />
      </label>
    `;
  } else if (state.tool === "signature") {
    mobilePalette.innerHTML = `
      <button class="dock-choice" type="button" data-edit-signature>Rediger underskrift</button>
      <span class="dock-hint">${escapeAttr(state.signatureName || "Navn mangler")}</span>
    `;
  } else if (state.tool === "label") {
    mobilePalette.innerHTML = `
      <label class="mobile-toggle dock-toggle">
        <input type="checkbox" data-text-arrow-toggle ${state.textArrow ? "checked" : ""} />
        <span>Tekstpil</span>
      </label>
      <label class="dock-range">
        <span>Terskel</span>
        <input type="range" min="${TEXT_ARROW_MIN_THRESHOLD}" max="${TEXT_ARROW_INFINITY_VALUE}" step="5" value="${normalizeTextArrowThreshold(state.textArrowThreshold)}" data-text-arrow-threshold />
        <output data-text-arrow-threshold-readout>${textArrowThresholdLabel(state.textArrowThreshold)}</output>
      </label>
    `;
  } else if (state.tool === "line" || state.tool === "polyline") {
    mobilePalette.innerHTML = Object.entries(lineKinds)
      .map(
        ([key, value]) =>
          `<button class="dock-choice ${state.lineKind === key ? "active" : ""}" type="button" data-line-kind="${escapeAttr(key)}">
            <span class="swatch" style="${lineSwatchStyle(value)}"></span><span>${escapeAttr(value.label)}</span>
          </button>`
      )
      .join("") + `<button class="dock-choice" type="button" data-edit-line-kind>Rediger</button>`;
  } else {
    mobilePalette.innerHTML = "";
    mobilePalette.classList.add("hidden");
  }
}

function updateMobileEditPanel() {
  if (!mobileEditPanel) return;
  if (state.mobileLineEditorOpen) {
    renderMobileLineKindEditor();
    return;
  }
  const selected = getAnnotation(state.selectedId);
  if (!selected || state.tool !== "select") {
    mobileEditPanel.classList.add("hidden");
    mobileEditPanel.innerHTML = "";
    return;
  }

  if (selected.type === "object") {
    mobileEditPanel.classList.remove("hidden");
    mobileEditPanel.innerHTML = `
      <label class="field full">
        <span>Objekt</span>
        <select id="mobileObjectKind">
          ${Object.entries(objectKinds)
            .map(([key, value]) => `<option value="${key}" ${selected.kind === key ? "selected" : ""}>${value.label}</option>`)
            .join("")}
        </select>
      </label>
      <label class="field">
        <span>Størrelse</span>
        <input id="mobileObjectScale" type="range" min="0.45" max="3" step="0.05" value="${selected.scale || 1}" />
      </label>
      <label class="field">
        <span>Roter</span>
        <input id="mobileObjectRotation" type="range" min="-180" max="180" step="1" value="${radiansToDegrees(selected.rotation || 0)}" />
      </label>
      ${selected.kind === "fuseBox" ? `
        <label class="field full">
          <span>Sikring</span>
          <select id="mobileFuseAmp">
            ${fuseAmpOptions.map((amp) => `<option value="${amp}" ${Number(selected.fuseAmp || 125) === amp ? "selected" : ""}>${amp}A</option>`).join("")}
          </select>
        </label>
      ` : ""}
    `;
    bindMobileObjectEditors(selected);
    return;
  }

  if (selected.type === "line" && selected.role === "measure") {
    mobileEditPanel.classList.remove("hidden");
    mobileEditPanel.innerHTML = `
      <label class="field full">
        <span>Meter</span>
        <input id="mobileMeasureMeters" inputmode="decimal" value="${escapeAttr(metersForLine(selected) ? formatMeters(metersForLine(selected)) : "")}" />
      </label>
    `;
    document.querySelector("#mobileMeasureMeters").addEventListener("change", (event) => {
      const meters = Number(event.target.value.replace(",", "."));
      const pixels = linePixelLength(selected.points);
      if (!Number.isFinite(meters) || meters <= 0 || !pixels) return;
      pushHistory();
      state.metersPerPixel = meters / pixels;
      selected.meters = meters;
      render();
      updateUi(false);
    });
    return;
  }

  if (selected.type === "line" && selected.role !== "measure") {
    const selectedStyle = lineStyleFor(selected);
    const advancedOpen = true;
    mobileEditPanel.classList.remove("hidden");
    mobileEditPanel.innerHTML = `
      <label class="field full">
        <span>Navn</span>
        <input id="mobileLineLabel" value="${escapeAttr(selected.label || "")}" />
      </label>
      ${advancedOpen ? `
        <label class="field full">
          <span>Linjetype</span>
          <select id="mobileLineKind">
            ${Object.entries(lineKinds)
              .map(([key, value]) => `<option value="${key}" ${selected.kind === key ? "selected" : ""}>${value.label}</option>`)
              .join("")}
          </select>
        </label>
        <label class="field">
          <span>Farge</span>
          ${colorButtonHtml("mobileLineColor", selectedStyle.color)}
        </label>
        <label class="field">
          <span>Størrelse</span>
          <input id="mobileLineWidth" type="range" min="2" max="18" step="0.25" value="${selectedStyle.width}" />
        </label>
        <label class="mobile-toggle">
          <input id="mobileLineDashed" type="checkbox" ${selectedStyle.dash?.length ? "checked" : ""} />
          <span>Stripet</span>
        </label>
        <label class="mobile-toggle">
          <input id="mobileLineArrow" type="checkbox" ${selectedStyle.arrowEnd ? "checked" : ""} />
          <span>Pil</span>
        </label>
        <label class="field full">
          <span>Antall kabler</span>
          <input id="mobileLineCableCount" type="number" inputmode="numeric" min="1" max="12" step="1" value="${lineCableCount(selected)}" />
        </label>
      ` : ""}
    `;
    document.querySelector("#mobileLineLabel").addEventListener("change", (event) => {
      pushHistory();
      selected.label = event.target.value.trim();
      render();
      updateUi(false);
    });
    if (!advancedOpen) return;
    document.querySelector("#mobileLineKind").addEventListener("change", (event) => {
      pushHistory();
      selected.kind = event.target.value;
      delete selected.color;
      delete selected.halo;
      delete selected.width;
      delete selected.dash;
      delete selected.arrowEnd;
      render();
      updateUi(false);
    });
    let mobileLineStyleHistoryPushed = false;
    const pushMobileLineStyleHistory = () => {
      if (mobileLineStyleHistoryPushed) return;
      pushHistory();
      mobileLineStyleHistoryPushed = true;
    };
    document.querySelector("#mobileLineColor").addEventListener("click", () => {
      openColorDialog({
        title: "Farge på linje",
        color: lineStyleFor(selected).color,
        onApply: (color) => {
          pushHistory();
          selected.color = color;
          selected.halo = colorToRgba(color);
          render();
          updateUi(false);
        }
      });
    });
    document.querySelector("#mobileLineWidth").addEventListener("input", (event) => {
      pushMobileLineStyleHistory();
      selected.width = Number(event.target.value);
      render();
    });
    document.querySelector("#mobileLineWidth").addEventListener("change", () => {
      mobileLineStyleHistoryPushed = false;
      updateUi(false);
    });
    document.querySelector("#mobileLineDashed").addEventListener("change", (event) => {
      pushHistory();
      selected.dash = event.target.checked ? [22, 13] : [];
      event.target.checked = Boolean(selected.dash.length);
      render();
      updateUi(false);
    });
    document.querySelector("#mobileLineArrow").addEventListener("change", (event) => {
      pushHistory();
      selected.arrowEnd = event.target.checked;
      event.target.checked = Boolean(selected.arrowEnd);
      render();
      updateUi(false);
    });
    document.querySelector("#mobileLineCableCount").addEventListener("change", (event) => {
      pushHistory();
      selected.cableCount = lineCableCount({ cableCount: event.target.value });
      event.target.value = selected.cableCount;
      render();
      updateUi(false);
    });
    return;
  }

  if (selected.type === "text") {
    mobileEditPanel.classList.remove("hidden");
    mobileEditPanel.innerHTML = `
      <label class="field full">
        <span>Tekst</span>
        <input id="mobileTextValue" value="${escapeAttr(selected.text || "")}" />
      </label>
      <label class="mobile-toggle mobile-full">
        <input id="mobileTextArrow" type="checkbox" ${selected.autoArrow ? "checked" : ""} />
        <span>Tekstpil</span>
      </label>
      <label class="field full">
        <span>Terskel</span>
        <div class="range-with-value">
          <input id="mobileTextArrowThreshold" type="range" min="${TEXT_ARROW_MIN_THRESHOLD}" max="${TEXT_ARROW_INFINITY_VALUE}" step="5" value="${normalizeTextArrowThreshold(selected.arrowThreshold ?? state.textArrowThreshold)}" />
          <output id="mobileTextArrowThresholdReadout">${textArrowThresholdLabel(selected.arrowThreshold ?? state.textArrowThreshold)}</output>
        </div>
      </label>
    `;
    document.querySelector("#mobileTextValue").addEventListener("change", (event) => {
      pushHistory();
      selected.text = event.target.value.trim();
      render();
      updateUi(false);
    });
    document.querySelector("#mobileTextArrow").addEventListener("change", (event) => {
      pushHistory();
      selected.autoArrow = event.target.checked;
      render();
      updateUi(false);
    });
    document.querySelector("#mobileTextArrowThreshold").addEventListener("input", (event) => {
      selected.arrowThreshold = normalizeTextArrowThreshold(event.target.value);
      document.querySelector("#mobileTextArrowThresholdReadout").textContent = textArrowThresholdLabel(selected.arrowThreshold);
      render();
    });
    return;
  }

  if (selected.type === "pipe") {
    const selectedPipeStyle = pipeStyleFor(selected);
    const advancedOpen = true;
    mobileEditPanel.classList.remove("hidden");
    mobileEditPanel.innerHTML = `
      <label class="field full">
        <span>Etikett</span>
        <input id="mobilePipeLabel" value="${escapeAttr(selected.label || pipeKinds[selected.kind]?.label || "")}" />
      </label>
      ${advancedOpen ? `
        <label class="field full">
          <span>Rørtype</span>
          <select id="mobilePipeKind">
            ${Object.entries(pipeKinds)
              .map(([key, value]) => `<option value="${key}" ${selected.kind === key ? "selected" : ""}>${value.label}</option>`)
              .join("")}
          </select>
        </label>
        <label class="field">
          <span>Farge</span>
          ${colorButtonHtml("mobilePipeColor", selectedPipeStyle.color)}
        </label>
        <label class="field">
          <span>Størrelse</span>
          <input id="mobilePipeWidth" type="range" min="6" max="42" step="0.5" value="${selectedPipeStyle.width}" />
        </label>
        <label class="field full">
          <span>Antall parallelle rør</span>
          <input id="mobilePipeCableCount" type="number" inputmode="numeric" min="1" max="8" step="1" value="${pipeCableCount(selected)}" />
        </label>
      ` : ""}
    `;
    document.querySelector("#mobilePipeLabel").addEventListener("change", (event) => {
      pushHistory();
      selected.label = event.target.value.trim();
      render();
      updateUi(false);
    });
    if (!advancedOpen) return;
    document.querySelector("#mobilePipeKind").addEventListener("change", (event) => {
      pushHistory();
      const oldDefault = pipeKinds[selected.kind]?.label;
      selected.kind = event.target.value;
      delete selected.color;
      delete selected.fill;
      delete selected.width;
      if (!selected.label || selected.label === oldDefault) selected.label = pipeKinds[selected.kind].label;
      render();
      updateUi(false);
    });
    let mobilePipeStyleHistoryPushed = false;
    const pushMobilePipeStyleHistory = () => {
      if (mobilePipeStyleHistoryPushed) return;
      pushHistory();
      mobilePipeStyleHistoryPushed = true;
    };
    document.querySelector("#mobilePipeColor").addEventListener("click", () => {
      openColorDialog({
        title: "Farge på rør",
        color: pipeStyleFor(selected).color,
        onApply: (color) => {
          pushHistory();
          selected.color = color;
          selected.fill = colorToRgba(color, 0.26);
          render();
          updateUi(false);
        }
      });
    });
    document.querySelector("#mobilePipeWidth").addEventListener("input", (event) => {
      pushMobilePipeStyleHistory();
      selected.width = Number(event.target.value);
      render();
    });
    document.querySelector("#mobilePipeWidth").addEventListener("change", () => {
      mobilePipeStyleHistoryPushed = false;
      updateUi(false);
    });
    document.querySelector("#mobilePipeCableCount").addEventListener("change", (event) => {
      pushHistory();
      selected.cableCount = pipeCableCount({ cableCount: event.target.value });
      event.target.value = selected.cableCount;
      render();
      updateUi(false);
    });
    return;
  }

  if (selected.type === "signature") {
    mobileEditPanel.classList.remove("hidden");
    mobileEditPanel.innerHTML = `
      <label class="field full">
        <span>Navn</span>
        <input id="mobileSignatureName" value="${escapeAttr(selected.name || "")}" />
      </label>
      <div class="mobile-editor-actions">
        <button class="btn" id="mobileSignatureUseSavedBtn" type="button">Bruk lagret</button>
        <button class="btn" data-edit-signature type="button">Tegn ny</button>
      </div>
    `;
    document.querySelector("#mobileSignatureName").addEventListener("change", (event) => {
      pushHistory();
      selected.name = event.target.value.trim();
      render();
      updateUi(false);
    });
    document.querySelector("#mobileSignatureUseSavedBtn").addEventListener("click", () => {
      pushHistory();
      selected.name = state.signatureName || selected.name;
      selected.strokes = deepCopy(state.signatureStrokes || []);
      render();
      updateUi(false);
    });
    return;
  }

  mobileEditPanel.classList.add("hidden");
  mobileEditPanel.innerHTML = "";
}

function renderMobileLineKindEditor() {
  const selected = lineKinds[state.lineKind] || lineKinds.primary;
  mobileEditPanel.classList.remove("hidden");
  mobileEditPanel.innerHTML = `
    <label class="field full">
      <span>Linjetype</span>
      <input id="mobileLineKindLabel" value="${escapeAttr(selected.label)}" />
    </label>
    <div class="color-swatch-row" role="group" aria-label="Farge">
      ${LINE_COLOR_PRESETS.map(
        (color) =>
          `<button class="color-swatch-btn ${selected.color.toLowerCase() === color ? "active" : ""}" style="--swatch:${color}" type="button" data-line-color="${color}" aria-label="${color}"></button>`
      ).join("")}
    </div>
    <label class="field color-field">
      <span>Egen farge</span>
      ${colorButtonHtml("mobileLineKindColor", selected.color)}
    </label>
    <label class="field">
      <span>Størrelse <output id="mobileLineKindWidthValue">${selected.width}</output></span>
      <input id="mobileLineKindWidth" type="range" min="2" max="18" step="1" value="${selected.width}" />
    </label>
    <label class="mobile-toggle mobile-full">
      <input id="mobileLineKindDashed" type="checkbox" ${selected.dash?.length ? "checked" : ""} />
      <span>Stripet</span>
    </label>
    <div class="mobile-editor-actions">
      <button class="btn" data-close-mobile-editor type="button">Lukk</button>
      <button class="btn primary" data-close-mobile-editor type="button">Ferdig</button>
    </div>
  `;

  document.querySelector("#mobileLineKindLabel").addEventListener("input", (event) => {
    setCurrentLineStyle({ label: event.target.value });
  });
  document.querySelector("#mobileLineKindColor").addEventListener("click", () => {
    openColorDialog({
      title: "Farge på linjetype",
      color: selected.color,
      onApply: (color) => {
        setCurrentLineStyle({ color });
        renderMobileLineKindEditor();
      }
    });
  });
  document.querySelector("#mobileLineKindWidth").addEventListener("input", (event) => {
    document.querySelector("#mobileLineKindWidthValue").value = event.target.value;
    setCurrentLineStyle({ width: event.target.value });
  });
  document.querySelector("#mobileLineKindDashed").addEventListener("change", (event) => {
    setCurrentLineStyle({ dashed: event.target.checked });
  });
  mobileEditPanel.querySelectorAll("[data-line-color]").forEach((button) => {
    button.addEventListener("click", () => {
      setCurrentLineStyle({ color: button.dataset.lineColor });
      renderMobileLineKindEditor();
    });
  });
}

function bindMobileObjectEditors(selected) {
  document.querySelector("#mobileObjectKind").addEventListener("change", (event) => {
    pushHistory();
    selected.kind = event.target.value;
    applyObjectKindDefaults(selected);
    setObjectKind(selected.kind);
    render();
    updateUi(false);
  });
  const scaleInput = document.querySelector("#mobileObjectScale");
  let scaleHistoryPushed = false;
  scaleInput.addEventListener("input", (event) => {
    if (!scaleHistoryPushed) {
      pushHistory();
      scaleHistoryPushed = true;
    }
    selected.scale = Number(event.target.value);
    render();
  });
  scaleInput.addEventListener("change", () => {
    scaleHistoryPushed = false;
    updateUi(false);
  });

  const rotationInput = document.querySelector("#mobileObjectRotation");
  let rotationHistoryPushed = false;
  rotationInput.addEventListener("input", (event) => {
    if (!rotationHistoryPushed) {
      pushHistory();
      rotationHistoryPushed = true;
    }
    selected.rotation = degreesToRadians(Number(event.target.value));
    render();
  });
  rotationInput.addEventListener("change", () => {
    rotationHistoryPushed = false;
    updateUi(false);
  });

  const mobileFuseAmp = document.querySelector("#mobileFuseAmp");
  if (mobileFuseAmp) {
    mobileFuseAmp.addEventListener("change", (event) => {
      pushHistory();
      selected.fuseAmp = Number(event.target.value);
      render();
      updateUi(false);
    });
  }
}

function escapeAttr(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function exportImage() {
  if (!state.image) return;
  const previousSelection = state.selectedId;
  render({ exporting: true });
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${state.imageName}-montorskisse.png`;
    link.click();
    URL.revokeObjectURL(url);
    state.selectedId = previousSelection;
    render();
    showToast("Skissen er eksportert som PNG");
  }, "image/png");
}

function saveProject() {
  if (!state.image) return;
  const payload = createProjectPayload();
  saveCurrentSketchNow().catch(() => {});
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${state.imageName}-montorskisse.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Skissen er lagret og filen lastes ned");
}

async function showRecentDialog() {
  if (!recentDialog || !recentList) return;
  recentDialog.classList.remove("hidden");
  recentList.innerHTML = `<p class="recent-meta">Laster...</p>`;
  try {
    const sketches = await getRecentSketches();
    if (!sketches.length) {
      recentList.innerHTML = `<p class="recent-meta">Ingen lagrede skisser på denne enheten ennå.</p>`;
      return;
    }
    recentList.innerHTML = sketches
      .map(
        (sketch) => `
          <div class="recent-item">
            <div>
              <div class="recent-title">${escapeAttr(sketch.imageName || "Skisse")}</div>
              <div class="recent-meta">${formatDateTime(sketch.updatedAt)} · ${(sketch.annotations || []).length} elementer</div>
            </div>
            <div class="recent-item-actions">
              <button class="btn primary" type="button" data-open-recent="${escapeAttr(sketch.id)}">Åpne</button>
              <button class="btn" type="button" data-delete-recent="${escapeAttr(sketch.id)}">Slett</button>
            </div>
          </div>`
      )
      .join("");
  } catch {
    recentList.innerHTML = `<p class="recent-meta">Kunne ikke lese nylige skisser i denne nettleseren.</p>`;
  }
}

function closeRecentDialog() {
  if (recentDialog) recentDialog.classList.add("hidden");
}

function loadProject(payload) {
  if (!payload || !payload.imageDataUrl || !Array.isArray(payload.annotations)) return;
  suppressAutosave = true;
  if (payload.profile) {
    applyProfile(payload.profile, { persist: true });
    updateLinePalette();
    updateLineKindEditor();
    updateObjectPalette();
    updateSignatureProfilePanel();
    updateMobilePalette();
  }
  const img = new Image();
  img.onload = () => {
    state.image = img;
    state.imageDataUrl = payload.imageDataUrl;
    state.imageName = payload.imageName || "screenshot";
    state.projectId = payload.id || id();
    state.annotations = payload.annotations;
    state.metersPerPixel = payload.metersPerPixel || null;
    state.history = [];
    state.redo = [];
    state.selectedId = null;
    state.drawingLine = null;
    state.polylineDraft = null;
    state.pipeDraft = null;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.classList.add("ready");
    emptyState.classList.add("hidden");
    state.zoom = 1;
    applyCanvasSize();
    render();
    updateUi();
    suppressAutosave = false;
    scheduleAutosave();
  };
  img.src = payload.imageDataUrl;
}

function createDemoImage() {
  const demo = document.createElement("canvas");
  demo.width = 1080;
  demo.height = 1600;
  const demoCtx = demo.getContext("2d");
  demoCtx.fillStyle = "#edf1f0";
  demoCtx.fillRect(0, 0, demo.width, demo.height);
  demoCtx.fillStyle = "#d6dedb";
  for (let y = 90; y < demo.height; y += 170) {
    demoCtx.fillRect(0, y, demo.width, 34);
  }
  demoCtx.fillStyle = "#c9d2ce";
  for (let x = 80; x < demo.width; x += 220) {
    demoCtx.fillRect(x, 0, 32, demo.height);
  }
  demoCtx.fillStyle = "#b7c4bf";
  demoCtx.fillRect(130, 220, 270, 360);
  demoCtx.fillRect(610, 740, 320, 420);
  demoCtx.fillStyle = "#ffffff";
  demoCtx.font = "800 42px system-ui, sans-serif";
  demoCtx.fillText("DEMO SKJERMBILDE", 80, 90);
  loadImageFromDataUrl(demo.toDataURL("image/png"), "demo-screenshot");
}

function clearAnnotations() {
  if (!state.annotations.length) return;
  pushHistory();
  state.annotations = [];
  state.polylineDraft = null;
  state.pipeDraft = null;
  state.drawingLine = null;
  state.selectedId = null;
  render();
  updateUi();
}

function fitCanvasToStage() {
  state.zoom = 1;
  applyCanvasSize();
}

document.querySelectorAll("[data-tool]").forEach((button) => {
  button.addEventListener("click", () => setTool(button.dataset.tool));
});

document.addEventListener("click", (event) => {
  const pipeToolAdvancedButton = event.target.closest("[data-pipe-tool-advanced]");
  if (pipeToolAdvancedButton) setPipeToolAdvanced(!state.pipeToolAdvancedOpen);
  const pipeToolColorButton = event.target.closest("[data-pipe-tool-color-button]");
  if (pipeToolColorButton) {
    openColorDialog({
      title: "Farge på rør",
      color: activePipeStyle().color,
      onApply: (color) => {
        setPipeToolColor(color);
        updatePipeToolEditor();
        updateMobilePalette();
      }
    });
  }
  const lineButton = event.target.closest("[data-line-kind]");
  if (lineButton) setLineKind(lineButton.dataset.lineKind);
  const objectButton = event.target.closest("[data-object-kind]");
  if (objectButton) setObjectKind(objectButton.dataset.objectKind);
  const pipeButton = event.target.closest("[data-pipe-kind]");
  if (pipeButton) setPipeKind(pipeButton.dataset.pipeKind);
  if (event.target.closest("[data-add-object]")) createCustomObjectKind();
  if (event.target.closest("[data-edit-signature]")) editSignatureProfile();
  if (event.target.closest("[data-edit-line-kind]")) editCurrentLineKindProfile();
  if (event.target.closest("[data-close-mobile-editor]")) {
    state.mobileLineEditorOpen = false;
    updateUi(false);
  }
  const openRecentButton = event.target.closest("[data-open-recent]");
  if (openRecentButton) {
    getRecentSketch(openRecentButton.dataset.openRecent).then((payload) => {
      if (payload) {
        closeRecentDialog();
        loadProject(payload);
        showToast("Skissen er åpnet");
      }
    });
  }
  const deleteRecentButton = event.target.closest("[data-delete-recent]");
  if (deleteRecentButton) {
    deleteRecentSketch(deleteRecentButton.dataset.deleteRecent);
  }
});

[
  importBtn,
  emptyImportBtn,
  loadProjectBtn,
  saveProjectBtn,
  exportBtn
].forEach((button) => {
  if (button) button.addEventListener("click", () => flashActionButton(button), { capture: true });
});

importBtn.addEventListener("click", () => imageInput.click());
emptyImportBtn.addEventListener("click", () => imageInput.click());
loadProjectBtn.addEventListener("click", showRecentDialog);
saveProjectBtn.addEventListener("click", saveProject);
exportBtn.addEventListener("click", exportImage);
undoBtn.addEventListener("click", undo);
redoBtn.addEventListener("click", redo);
clearBtn.addEventListener("click", clearAnnotations);
if (compactUndoBtn) compactUndoBtn.addEventListener("click", undo);
if (compactRedoBtn) compactRedoBtn.addEventListener("click", redo);
if (compactClearBtn) compactClearBtn.addEventListener("click", clearAnnotations);
if (compactFitBtn) compactFitBtn.addEventListener("click", fitCanvasToStage);
if (compactFinishPolylineBtn) {
  compactFinishPolylineBtn.addEventListener("click", async () => {
    await finishPolyline();
    returnToSelectIfNeeded();
  });
}
if (topbarToggle) {
  topbarToggle.addEventListener("click", () => {
    setCompactTop(!appRoot?.classList.contains("compact-top"));
  });
}
if (addObjectBtn) addObjectBtn.addEventListener("click", createCustomObjectKind);
finishPolylineBtn.addEventListener("click", async () => {
  await finishPolyline();
  returnToSelectIfNeeded();
});

imageInput.addEventListener("change", async (event) => {
  const [file] = event.target.files || [];
  if (!file) return;
  const dataUrl = await readFileAsDataUrl(file);
  loadImageFromDataUrl(dataUrl, file.name);
  imageInput.value = "";
});

projectInput.addEventListener("change", async (event) => {
  const [file] = event.target.files || [];
  if (!file) return;
  const text = await file.text();
  loadProject(JSON.parse(text));
  projectInput.value = "";
});

function setSnapAngles(checked) {
  state.snapAngles = checked;
  snapToggles.forEach((toggle) => {
    toggle.checked = checked;
  });
}

snapToggles.forEach((toggle) => {
  toggle.addEventListener("change", () => setSnapAngles(toggle.checked));
});

objectSnapToggles.forEach((toggle) => {
  toggle.addEventListener("change", () => setObjectSnap(toggle.checked));
});

keepToolToggles.forEach((toggle) => {
  toggle.addEventListener("change", () => setKeepToolActive(toggle.checked));
});

document.addEventListener("change", (event) => {
  const pipeToolKind = event.target.closest("[data-pipe-tool-kind]");
  if (pipeToolKind) setPipeKind(pipeToolKind.value);
  const pipeToolLabel = event.target.closest("[data-pipe-tool-label]");
  if (pipeToolLabel) setPipeToolLabel(pipeToolLabel.value);
  const pipeToolWidth = event.target.closest("[data-pipe-tool-width]");
  if (pipeToolWidth) setPipeToolWidth(pipeToolWidth.value);
  const pipeToolCount = event.target.closest("[data-pipe-tool-count]");
  if (pipeToolCount) setPipeToolCableCount(pipeToolCount.value);
  const toggle = event.target.closest("[data-text-arrow-toggle]");
  if (toggle) setTextArrow(toggle.checked);
});

document.addEventListener("input", (event) => {
  const pipeToolLabel = event.target.closest("[data-pipe-tool-label]");
  if (pipeToolLabel) setPipeToolLabel(pipeToolLabel.value);
  const pipeToolWidth = event.target.closest("[data-pipe-tool-width]");
  if (pipeToolWidth) setPipeToolWidth(pipeToolWidth.value);
  const pipeToolCount = event.target.closest("[data-pipe-tool-count]");
  if (pipeToolCount) setPipeToolCableCount(pipeToolCount.value);
  const input = event.target.closest("[data-text-arrow-threshold]");
  if (input) setTextArrowThreshold(input.value);
});

if (colorHexInput) {
  colorHexInput.addEventListener("input", (event) => {
    const value = String(event.target.value || "").trim();
    if (/^#?[0-9a-f]{3}$/i.test(value) || /^#?[0-9a-f]{6}$/i.test(value)) {
      setColorDialogValue(value);
    }
  });
  colorHexInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") closeColorDialog(true);
    if (event.key === "Escape") closeColorDialog(false);
  });
}

[colorHueInput, colorSatInput, colorLightInput].forEach((input) => {
  if (!input) return;
  input.addEventListener("input", () => {
    if (colorDialogSyncing) return;
    setColorDialogValue(hslToHex(colorHueInput.value, colorSatInput.value, colorLightInput.value), { syncSliders: false });
  });
});

if (colorPresetRow) {
  colorPresetRow.addEventListener("click", (event) => {
    const button = event.target.closest("[data-color-preset]");
    if (button) setColorDialogValue(button.dataset.colorPreset);
  });
}

if (colorCancelBtn) colorCancelBtn.addEventListener("click", () => closeColorDialog(false));
if (colorOkBtn) colorOkBtn.addEventListener("click", () => closeColorDialog(true));
if (colorDialog) {
  colorDialog.addEventListener("click", (event) => {
    if (event.target === colorDialog) closeColorDialog(false);
  });
}

if (signatureCanvas) {
  signatureCanvas.addEventListener("pointerdown", beginSignatureStroke);
  signatureCanvas.addEventListener("pointermove", moveSignatureStroke);
  signatureCanvas.addEventListener("pointerup", endSignatureStroke);
  signatureCanvas.addEventListener("pointercancel", endSignatureStroke);
}
if (signatureClearBtn) signatureClearBtn.addEventListener("click", clearSignatureDialog);
if (signatureCancelBtn) signatureCancelBtn.addEventListener("click", () => closeSignatureDialog(false));
if (signatureSaveBtn) signatureSaveBtn.addEventListener("click", saveSignatureDialog);
if (recentCloseBtn) recentCloseBtn.addEventListener("click", closeRecentDialog);
if (recentOpenFileBtn) recentOpenFileBtn.addEventListener("click", () => projectInput.click());
if (recentNewBtn) recentNewBtn.addEventListener("click", () => {
  closeRecentDialog();
  imageInput.click();
});

zoomOutBtn.addEventListener("click", () => {
  state.zoom = Math.max(minimumZoom(), Number((state.zoom - 0.25).toFixed(2)));
  applyCanvasSize();
});

zoomInBtn.addEventListener("click", () => {
  state.zoom = Math.min(4, Number((state.zoom + 0.25).toFixed(2)));
  applyCanvasSize();
});

fitBtn.addEventListener("click", () => {
  fitCanvasToStage();
});

stage.addEventListener(
  "wheel",
  (event) => {
    if (!state.image) return;
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
    zoomAroundClientPoint(state.zoom * factor, { x: event.clientX, y: event.clientY });
  },
  { passive: false }
);

canvas.addEventListener("pointerdown", onPointerDown);
canvas.addEventListener("pointermove", onPointerMove);
canvas.addEventListener("pointerup", onPointerUp);
canvas.addEventListener("pointercancel", onPointerUp);
canvas.addEventListener("dblclick", async () => {
  if (state.tool === "polyline" && state.polylineDraft) {
    await finishPolyline();
    returnToSelectIfNeeded();
  }
});

window.addEventListener("resize", applyCanvasSize);
window.addEventListener("pagehide", () => {
  saveCurrentSketchNow().catch(() => {});
});
window.addEventListener("beforeunload", () => {
  saveCurrentSketchNow().catch(() => {});
});

window.addEventListener("keydown", (event) => {
  const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName);
  if (!isTyping && event.key === "Enter" && state.tool === "polyline" && state.polylineDraft) {
    event.preventDefault();
    finishPolyline().then(returnToSelectIfNeeded);
    return;
  }
  if (!isTyping && event.key === "Escape" && state.tool === "polyline" && state.polylineDraft) {
    event.preventDefault();
    cancelPolyline();
    return;
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
    event.preventDefault();
    if (event.shiftKey) redo();
    else undo();
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
    event.preventDefault();
    redo();
  }
  if (event.key === "Delete" || event.key === "Backspace") {
    const selected = getAnnotation(state.selectedId);
    if (selected && !isTyping) {
      pushHistory();
      state.annotations = state.annotations.filter((annotation) => annotation.id !== selected.id);
      state.selectedId = null;
      render();
      updateUi();
    }
  }
});

loadProfile();
setTextArrow(state.textArrow);
syncTextArrowThresholdControls();
updateLinePalette();
updateLineKindEditor();
updatePipeToolEditor();
updateObjectPalette();
updateSignatureProfilePanel();
updateMobilePalette();
updateUi();

if (new URLSearchParams(window.location.search).has("demo")) {
  createDemoImage();
}

if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
