const mapImage = document.getElementById("mapImage");
const mapStage = document.getElementById("mapStage");
const markers = document.getElementById("markers");
const form = document.getElementById("phaseForm");
const emptyEditor = document.getElementById("emptyEditor");
const positionBox = document.getElementById("positionBox");
const panelTitle = document.getElementById("panelTitle");
const titleInput = document.getElementById("title");
const youtubeInput = document.getElementById("youtube");
const descriptionInput = document.getElementById("description");
const flagFile = document.getElementById("flagFile");
const flagPreview = document.getElementById("flagPreview");
const statusText = document.getElementById("status");
const cancelButton = document.getElementById("cancel");
const deleteButton = document.getElementById("delete");
const saveButton = document.getElementById("saveButton");
const openPublicButton = document.getElementById("openPublic");
const sizeRange = document.getElementById("sizeRange");
const sizeValue = document.getElementById("sizeValue");

const DEFAULT_FLAG = "/assets/flags/flag-default.svg";
const DEFAULT_WIDTH = 210;
const DEFAULT_HEIGHT = 118;
const MAX_SCALE = 2;

let phases = [];
let selected = null;
let selectedPosition = null;
let flagObjectUrl = null;

function setStatus(text, type = "") {
  statusText.textContent = text;
  statusText.className = `status ${type}`;
}

function clearStatus() {
  setStatus("");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getPosition(event) {
  const rect = mapImage.getBoundingClientRect();
  return {
    x: clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100),
    y: clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100)
  };
}

function movePhaseByPixels(phase, dx, dy) {
  const rect = mapImage.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const nextX = Number(phase.x_percent) + (dx / rect.width) * 100;
  const nextY = Number(phase.y_percent) + (dy / rect.height) * 100;
  phase.x_percent = clamp(nextX, 0, 100);
  phase.y_percent = clamp(nextY, 0, 100);
  selectedPosition = { x: phase.x_percent, y: phase.y_percent };
  updatePositionText();
  renderMarkers();
  setStatus(`Posição ajustada em ${dx || 0}px × ${dy || 0}px. Clique em “Salvar bandeira” para gravar.`, "ok");
}

function bindPixelKeyboard(button, phase) {
  button.addEventListener("keydown", (event) => {
    if (!selected || selected.id !== phase.id) return;
    let dx = 0;
    let dy = 0;
    const step = event.shiftKey ? 10 : 1;
    if (event.key === "ArrowLeft") dx = -step;
    if (event.key === "ArrowRight") dx = step;
    if (event.key === "ArrowUp") dy = -step;
    if (event.key === "ArrowDown") dy = step;
    if (!dx && !dy) return;
    event.preventDefault();
    movePhaseByPixels(phase, dx, dy);
  });
}

function nudgeSelected(dx, dy) {
  if (!selected) {
    setStatus("Selecione uma bandeira antes de ajustar a posição.", "error");
    return;
  }
  movePhaseByPixels(selected, Number(dx) || 0, Number(dy) || 0);
}

document.addEventListener("click", (event) => {
  const button = event.target.closest(".pixel-nudge");
  if (!button) return;
  event.preventDefault();
  nudgeSelected(button.dataset.dx, button.dataset.dy);
});

document.addEventListener("keydown", (event) => {
  if (!selected) return;
  const tag = event.target?.tagName;
  const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || event.target?.isContentEditable;
  if (typing) return;

  let dx = 0;
  let dy = 0;
  const step = event.shiftKey ? 10 : 1;
  if (event.key === "ArrowLeft") dx = -step;
  if (event.key === "ArrowRight") dx = step;
  if (event.key === "ArrowUp") dy = -step;
  if (event.key === "ArrowDown") dy = step;

  if (!dx && !dy) return;
  event.preventDefault();
  nudgeSelected(dx, dy);
});

function fitHitboxToOpaquePixels(image, hitbox) {
  const fallback = () => {
    hitbox.style.left = "35%";
    hitbox.style.top = "18%";
    hitbox.style.width = "30%";
    hitbox.style.height = "68%";
  };
  if (!image.complete || !image.naturalWidth || !image.naturalHeight) {
    image.addEventListener("load", () => fitHitboxToOpaquePixels(image, hitbox), { once: true });
    fallback();
    return;
  }
  try {
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(image, 0, 0);
    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let minX = width, minY = height, maxX = -1, maxY = -1;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (data[(y * width + x) * 4 + 3] > 35) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX < 0) return fallback();
    const insetX = Math.max(2, Math.round((maxX - minX + 1) * 0.08));
    const insetY = Math.max(2, Math.round((maxY - minY + 1) * 0.08));
    minX += insetX; maxX -= insetX; minY += insetY; maxY -= insetY;
    hitbox.style.left = `${(minX / width) * 100}%`;
    hitbox.style.top = `${(minY / height) * 100}%`;
    hitbox.style.width = `${((maxX - minX + 1) / width) * 100}%`;
    hitbox.style.height = `${((maxY - minY + 1) / height) * 100}%`;
  } catch (error) {
    fallback();
  }
}

function phaseSize(phase = null) {
  const width = Number(phase?.width_px);
  const height = Number(phase?.height_px);
  const safeWidth = Number.isFinite(width) ? Math.max(DEFAULT_WIDTH, Math.min(DEFAULT_WIDTH * MAX_SCALE, width)) : DEFAULT_WIDTH;
  const safeHeight = Number.isFinite(height) ? Math.max(DEFAULT_HEIGHT, Math.min(DEFAULT_HEIGHT * MAX_SCALE, height)) : DEFAULT_HEIGHT;
  return { width: Math.round(safeWidth), height: Math.round(safeHeight) };
}

function scaleFromPhase(phase = null) {
  const { width } = phaseSize(phase);
  return Math.round((width / DEFAULT_WIDTH) * 100);
}

function updateSizePreview({ render = true } = {}) {
  if (!sizeRange || !sizeValue) return;
  const scale = clamp(Number(sizeRange.value) || 100, 100, 200);
  const width = Math.round(DEFAULT_WIDTH * (scale / 100));
  const height = Math.round(DEFAULT_HEIGHT * (scale / 100));
  sizeValue.textContent = `${width} × ${height} px`;
  if (selected?.id) {
    selected.width_px = width;
    selected.height_px = height;
  }
  if (render) renderMarkers();
}

function updatePositionText() {
  if (!selectedPosition) {
    positionBox.textContent = "Clique no mapa para escolher onde colocar a bandeira.";
    return;
  }
  const rect = mapImage.getBoundingClientRect();
  const pxX = rect.width ? (selectedPosition.x / 100) * rect.width : 0;
  const pxY = rect.height ? (selectedPosition.y / 100) * rect.height : 0;
  positionBox.textContent = `Posição: ${selectedPosition.x.toFixed(2)}% × ${selectedPosition.y.toFixed(2)}%  •  ${Math.round(pxX)}px × ${Math.round(pxY)}px  •  Setas: 1px | Shift: 10px`;
}

function selectPosition(position, phase = null, { focus = true } = {}) {
  selected = phase;
  selectedPosition = { x: Number(position.x), y: Number(position.y) };

  emptyEditor.hidden = true;
  form.hidden = false;
  panelTitle.textContent = phase ? "Editar bandeira" : "Nova bandeira";

  titleInput.value = phase?.title || "";
  youtubeInput.value = phase?.youtube_url || "";
  if (typeof descriptionInput !== "undefined" && descriptionInput) descriptionInput.value = phase?.description || "";
  flagFile.value = "";
  flagPreview.src = phase?.flag_image || DEFAULT_FLAG;
  if (sizeRange) sizeRange.value = String(scaleFromPhase(phase));
  updateSizePreview();

  updatePositionText();
  deleteButton.hidden = !phase;
  clearStatus();
  renderMarkers();
  if (focus) titleInput.focus();
}

function clearSelection() {
  selected = null;
  selectedPosition = null;
  form.hidden = true;
  emptyEditor.hidden = false;
  deleteButton.hidden = true;
  titleInput.value = "";
  youtubeInput.value = "";
  if (descriptionInput) descriptionInput.value = "";
  flagFile.value = "";
  flagPreview.src = DEFAULT_FLAG;
  if (sizeRange) sizeRange.value = "100";
  updateSizePreview();
  updatePositionText();
  clearStatus();
  renderMarkers();
}

function movePhaseFromEvent(event, phase) {
  const position = getPosition(event);
  phase.x_percent = Number(position.x);
  phase.y_percent = Number(position.y);
  selectedPosition = { x: Number(position.x), y: Number(position.y) };
  updatePositionText();
}

function enableDrag(button, phase, hitbox) {
  let dragging = false;
  let moved = false;
  let pointerId = null;

  hitbox.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 && event.pointerType !== "touch") return;
    event.preventDefault();
    event.stopPropagation();

    selected = phase;
    selectedPosition = { x: Number(phase.x_percent), y: Number(phase.y_percent) };
    emptyEditor.hidden = true;
    form.hidden = false;
    panelTitle.textContent = "Editar bandeira";
    titleInput.value = phase?.title || "";
    youtubeInput.value = phase?.youtube_url || "";
    if (descriptionInput) descriptionInput.value = phase?.description || "";
    flagFile.value = "";
    flagPreview.src = phase?.flag_image || DEFAULT_FLAG;
    if (sizeRange) sizeRange.value = String(scaleFromPhase(phase));
    updateSizePreview({ render: false });
    updatePositionText();
    deleteButton.hidden = false;
    clearStatus();

    dragging = true;
    moved = false;
    pointerId = event.pointerId;
    hitbox.setPointerCapture?.(event.pointerId);
    button.classList.add("dragging");
    button.focus({ preventScroll: true });
  });

  hitbox.addEventListener("pointermove", (event) => {
    if (!dragging || event.pointerId !== pointerId) return;
    moved = true;
    movePhaseFromEvent(event, phase);
    button.style.left = `${phase.x_percent}%`;
    button.style.top = `${phase.y_percent}%`;
  });

  const stop = () => {
    if (!dragging) return;
    dragging = false;
    pointerId = null;
    button.classList.remove("dragging");
    if (moved) {
      selectedPosition = { x: Number(phase.x_percent), y: Number(phase.y_percent) };
      updatePositionText();
      setStatus("Posição alterada. Clique em “Salvar bandeira” para gravar.", "ok");
    }
  };

  hitbox.addEventListener("pointerup", stop);
  hitbox.addEventListener("pointercancel", stop);
  hitbox.addEventListener("lostpointercapture", stop);
}

function renderMarkers() {
  markers.innerHTML = "";

  for (const phase of phases) {
    const size = phaseSize(phase);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "marker";
    button.style.left = `${phase.x_percent}%`;
    button.style.top = `${phase.y_percent}%`;
    button.style.width = `${size.width}px`;
    button.style.height = `${size.height}px`;
    button.title = `${phase.title} — arraste pela bandeira para mover`;
    button.setAttribute("aria-label", `Editar ${phase.title}`);
    button.tabIndex = 0;

    const image = document.createElement("img");
    image.src = phase.flag_image || DEFAULT_FLAG;
    image.alt = phase.title;

    const name = document.createElement("span");
    name.className = "marker-name";
    name.textContent = phase.title;

    const hitbox = document.createElement("span");
    hitbox.className = "marker-hitbox";
    hitbox.setAttribute("aria-hidden", "true");

    button.append(image, name, hitbox);
    enableDrag(button, phase, hitbox);
    bindPixelKeyboard(button, phase);
    image.addEventListener("load", () => fitHitboxToOpaquePixels(image, hitbox), { once: true });

    hitbox.addEventListener("click", event => {
      event.stopPropagation();
      selectPosition({ x: phase.x_percent, y: phase.y_percent }, phase);
    });

    markers.appendChild(button);
  }
}

async function uploadFlag(file) {
  if (!file) return null;
  if (file.size > 2 * 1024 * 1024) throw new Error("A bandeira deve ter no máximo 2 MB.");

  const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) throw new Error("Use PNG, JPG, WEBP ou GIF.");

  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

  const response = await fetch("/api/upload-flag", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data_url: dataUrl, original_name: file.name })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Erro ao enviar a bandeira.");
  return data.url;
}

flagFile.addEventListener("change", () => {
  const file = flagFile.files[0];
  if (!file) return;
  if (flagObjectUrl) URL.revokeObjectURL(flagObjectUrl);
  flagObjectUrl = URL.createObjectURL(file);
  flagPreview.src = flagObjectUrl;
});

if (sizeRange) {
  sizeRange.addEventListener("input", updateSizePreview);
}

mapStage.addEventListener("click", event => {
  if (event.target.closest(".marker")) return;
  selectPosition(getPosition(event));
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  clearStatus();

  if (!selectedPosition) {
    setStatus("Escolha uma posição no mapa.", "error");
    return;
  }

  saveButton.disabled = true;

  try {
    let imagePath = selected?.flag_image || DEFAULT_FLAG;
    const file = flagFile.files[0];
    if (file) {
      setStatus("Enviando bandeira e sincronizando o mapa público...");
      imagePath = await uploadFlag(file);
    }

    const payload = {
      title: titleInput.value.trim(),
      youtube_url: youtubeInput.value.trim(),
      description: descriptionInput ? descriptionInput.value.trim() : "",
      x_percent: selectedPosition.x,
      y_percent: selectedPosition.y,
      flag_image: imagePath,
      width_px: phaseSize(selected).width,
      height_px: phaseSize(selected).height
    };

    if (!payload.title || !payload.youtube_url) throw new Error("Nome e link do YouTube são obrigatórios.");

    const editing = Boolean(selected);
    const response = await fetch(editing ? `/api/phases/${selected.id}` : "/api/phases", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Não foi possível salvar.");

    phases = editing
      ? phases.map(p => p.id === data.id ? data : p)
      : [...phases, data];

    renderMarkers();
    setStatus("Salvo! O mapa público local já foi sincronizado.", "ok");
    setTimeout(clearSelection, 700);
  } catch (error) {
    console.error(error);
    setStatus(error.message || "Erro ao salvar.", "error");
  } finally {
    saveButton.disabled = false;
  }
});

cancelButton.addEventListener("click", clearSelection);

if (openPublicButton) {
  openPublicButton.addEventListener("click", () => {
    window.open("/public-map", "_blank", "noopener,noreferrer");
  });
}

deleteButton.addEventListener("click", async () => {
  if (!selected) return;
  if (!confirm(`Excluir "${selected.title}"?`)) return;

  try {
    const response = await fetch(`/api/phases/${selected.id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Não foi possível excluir.");
    }
    phases = phases.filter(p => p.id !== selected.id);
    clearSelection();
    setStatus("Bandeira excluída e mapa público sincronizado.", "ok");
  } catch (error) {
    setStatus(error.message || "Erro ao excluir.", "error");
  }
});

async function load() {
  const response = await fetch("/api/phases", { cache: "no-store" });
  if (!response.ok) throw new Error("Falha ao carregar fases.");
  phases = await response.json();
  renderMarkers();
}

function connectEvents() {
  const events = new EventSource("/api/events");
  events.addEventListener("created", event => {
    const phase = JSON.parse(event.data);
    phases = [...phases.filter(p => p.id !== phase.id), phase].sort((a, b) => a.id - b.id);
    renderMarkers();
  });
  events.addEventListener("updated", event => {
    const phase = JSON.parse(event.data);
    phases = phases.map(p => p.id === phase.id ? phase : p);
    renderMarkers();
    if (selected?.id === phase.id) {
      selected = phase;
      selectedPosition = { x: phase.x_percent, y: phase.y_percent };
      updatePositionText();
    }
  });
  events.addEventListener("deleted", event => {
    const { id } = JSON.parse(event.data);
    phases = phases.filter(p => p.id !== id);
    renderMarkers();
  });
  events.onerror = () => {
    events.close();
    setTimeout(connectEvents, 2500);
  };
}

load().then(connectEvents).catch(error => {
  console.error(error);
  setStatus("Erro ao carregar as fases. Abra pelo endereço do servidor Node.", "error");
});
