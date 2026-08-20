const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const ROOT = path.resolve(__dirname, "../..");
const PUBLIC_DIR = path.join(__dirname, "public");
const FLAGS_DIR = path.join(PUBLIC_DIR, "assets", "flags");
const SITE_DATA_DIR = path.join(ROOT, "assets", "map-data");
const SITE_FLAGS_DIR = path.join(ROOT, "assets", "kingdom-map", "flags");
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "phases.json");
const SITE_DATA_FILE = path.join(SITE_DATA_DIR, "phases.json");
const DEFAULT_FLAG = "/assets/flags/flag-default.svg";
const DEFAULT_WIDTH = 210;
const DEFAULT_HEIGHT = 118;

for (const dir of [FLAGS_DIR, DATA_DIR, SITE_DATA_DIR, SITE_FLAGS_DIR]) {
  fs.mkdirSync(dir, { recursive: true });
}

function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ nextId: 1, phases: [] }, null, 2), "utf8");
  }
}

function readStore() {
  ensureDataFile();
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    if (!parsed || !Array.isArray(parsed.phases)) throw new Error("Formato inválido");
    return { nextId: Number(parsed.nextId) || 1, phases: parsed.phases };
  } catch (error) {
    console.error("[DATA] Não foi possível ler phases.json:", error);
    return { nextId: 1, phases: [] };
  }
}

function writeStore(store) {
  const tempFile = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(store, null, 2), "utf8");
  fs.renameSync(tempFile, DATA_FILE);
}

function normalize(phase) {
  return {
    id: Number(phase.id),
    title: String(phase.title || ""),
    youtube_url: String(phase.youtube_url || ""),
    description: String(phase.description || ""),
    x_percent: Number(phase.x_percent),
    y_percent: Number(phase.y_percent),
    flag_image: phase.flag_image || DEFAULT_FLAG,
    width_px: safeDimension(phase.width_px, DEFAULT_WIDTH, DEFAULT_WIDTH * 2, DEFAULT_WIDTH),
    height_px: safeDimension(phase.height_px, DEFAULT_HEIGHT, DEFAULT_HEIGHT * 2, DEFAULT_HEIGHT),
    created_at: phase.created_at,
    updated_at: phase.updated_at
  };
}

function publicPhase(phase) {
  const normalized = normalize(phase);
  const fileName = path.basename(String(normalized.flag_image || ""));
  return {
    ...normalized,
    flag_image: fileName ? `../../assets/kingdom-map/flags/${fileName}` : "../../assets/kingdom-map/flags/flag-default.svg"
  };
}

function syncPublicSite() {
  const store = readStore();
  const publicStore = {
    nextId: store.nextId,
    phases: store.phases.map(publicPhase)
  };

  fs.mkdirSync(SITE_DATA_DIR, { recursive: true });
  fs.writeFileSync(SITE_DATA_FILE, JSON.stringify(publicStore, null, 2), "utf8");

  fs.mkdirSync(SITE_FLAGS_DIR, { recursive: true });
  for (const name of fs.readdirSync(FLAGS_DIR)) {
    const source = path.join(FLAGS_DIR, name);
    const target = path.join(SITE_FLAGS_DIR, name);
    if (fs.statSync(source).isFile()) fs.copyFileSync(source, target);
  }
}

function normalizeLocalStoreImages() {
  const store = readStore();
  let changed = false;
  store.phases = store.phases.map((phase) => {
    const next = { ...phase };
    const raw = String(next.flag_image || "");
    const base = path.basename(raw);
    if (base) {
      const expected = `/assets/flags/${base}`;
      if (raw !== expected) {
        next.flag_image = expected;
        changed = true;
      }
    } else {
      next.flag_image = DEFAULT_FLAG;
      changed = true;
    }

    const nextWidth = safeDimension(next.width_px, DEFAULT_WIDTH, DEFAULT_WIDTH * 2, DEFAULT_WIDTH);
    const nextHeight = safeDimension(next.height_px, DEFAULT_HEIGHT, DEFAULT_HEIGHT * 2, DEFAULT_HEIGHT);
    if (Number(next.width_px) !== nextWidth) {
      next.width_px = nextWidth;
      changed = true;
    }
    if (Number(next.height_px) !== nextHeight) {
      next.height_px = nextHeight;
      changed = true;
    }
    return next;
  });
  if (changed) writeStore(store);
  syncPublicSite();
}

function isValidYoutube(value) {
  try {
    const u = new URL(value);
    const host = u.hostname.toLowerCase();
    return ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(host);
  } catch {
    return false;
  }
}

function safeFileName(name) {
  const ext = path.extname(name || "").toLowerCase();
  const safeExt = [".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(ext) ? ext : ".png";
  return `flag-${Date.now()}-${crypto.randomBytes(5).toString("hex")}${safeExt}`;
}

function safeDimension(value, min, max, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(Math.max(min, Math.min(max, n))) : fallback;
}

const appClients = new Set();

function broadcast(event, payload) {
  const data = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const res of appClients) {
    try { res.write(data); } catch {}
  }
}

function validatePhase(body) {
  const title = String(body?.title || "").trim();
  const youtubeUrl = String(body?.youtube_url || "").trim();
  const x = Number(body?.x_percent);
  const y = Number(body?.y_percent);
  const width = safeDimension(body?.width_px, DEFAULT_WIDTH, DEFAULT_WIDTH * 2, DEFAULT_WIDTH);
  const height = safeDimension(body?.height_px, DEFAULT_HEIGHT, DEFAULT_HEIGHT * 2, DEFAULT_HEIGHT);
  const rawFlag = String(body?.flag_image || DEFAULT_FLAG).trim() || DEFAULT_FLAG;
  const baseFlag = path.basename(rawFlag);
  const flagImage = baseFlag ? `/assets/flags/${baseFlag}` : DEFAULT_FLAG;

  if (!title) return { error: "Digite o nome da fase." };
  if (!youtubeUrl) return { error: "Cole o link do YouTube." };
  if (!isValidYoutube(youtubeUrl)) return { error: "Use um link válido do YouTube ou youtu.be." };
  if (!Number.isFinite(x) || x < 0 || x > 100 || !Number.isFinite(y) || y < 0 || y > 100) {
    return { error: "A posição X/Y deve ficar entre 0 e 100." };
  }

  return {
    value: {
      title,
      youtube_url: youtubeUrl,
      description: String(body?.description || "").trim().slice(0, 500),
      x_percent: x,
      y_percent: y,
      flag_image: flagImage,
      width_px: width,
      height_px: height
    }
  };
}

app.disable("x-powered-by");
app.use(express.json({ limit: "5mb" }));
app.use(express.static(PUBLIC_DIR, { extensions: ["html"] }));

app.get("/api/health", (_req, res) => {
  try {
    const store = readStore();
    res.json({ ok: true, phases: store.phases.length, storage: "json", publicSynced: fs.existsSync(SITE_DATA_FILE) });
  } catch {
    res.status(503).json({ ok: false });
  }
});

app.get("/api/phases", (_req, res) => {
  try {
    const phases = readStore().phases.map(normalize).sort((a, b) => a.id - b.id);
    res.json(phases);
  } catch (error) {
    console.error("GET /api/phases:", error);
    res.status(500).json({ error: "Erro ao carregar as fases." });
  }
});

app.get("/api/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  res.write(`event: connected\ndata: {}\n\n`);
  appClients.add(res);

  const heartbeat = setInterval(() => {
    try { res.write(": heartbeat\n\n"); } catch {}
  }, 25000);

  req.on("close", () => {
    clearInterval(heartbeat);
    appClients.delete(res);
  });
});

app.post("/api/phases", (req, res) => {
  const validation = validatePhase(req.body);
  if (validation.error) return res.status(400).json({ error: validation.error });

  try {
    const store = readStore();
    const now = new Date().toISOString();
    const phase = {
      id: store.nextId++,
      ...validation.value,
      created_at: now,
      updated_at: now
    };
    store.phases.push(phase);
    writeStore(store);
    syncPublicSite();

    const normalized = normalize(phase);
    broadcast("created", normalized);
    res.status(201).json(normalized);
  } catch (error) {
    console.error("POST /api/phases:", error);
    res.status(500).json({ error: "Erro ao salvar a fase." });
  }
});

app.put("/api/phases/:id", (req, res) => {
  const validation = validatePhase(req.body);
  if (validation.error) return res.status(400).json({ error: validation.error });

  try {
    const store = readStore();
    const id = Number(req.params.id);
    const index = store.phases.findIndex(p => Number(p.id) === id);
    if (index < 0) return res.status(404).json({ error: "Fase não encontrada." });

    const current = store.phases[index];
    const updated = {
      ...current,
      ...validation.value,
      updated_at: new Date().toISOString()
    };
    store.phases[index] = updated;
    writeStore(store);
    syncPublicSite();

    const normalized = normalize(updated);
    broadcast("updated", normalized);
    res.json(normalized);
  } catch (error) {
    console.error("PUT /api/phases/:id:", error);
    res.status(500).json({ error: "Erro ao atualizar a fase." });
  }
});

app.delete("/api/phases/:id", (req, res) => {
  try {
    const store = readStore();
    const id = Number(req.params.id);
    const index = store.phases.findIndex(p => Number(p.id) === id);
    if (index < 0) return res.status(404).json({ error: "Fase não encontrada." });

    store.phases.splice(index, 1);
    writeStore(store);
    syncPublicSite();
    broadcast("deleted", { id });
    res.status(204).end();
  } catch (error) {
    console.error("DELETE /api/phases/:id:", error);
    res.status(500).json({ error: "Erro ao excluir a fase." });
  }
});

app.post("/api/upload-flag", (req, res) => {
  const { data_url = "", original_name = "" } = req.body || {};
  const match = /^data:(image\/(?:png|jpeg|jpg|webp|gif));base64,(.+)$/.exec(data_url);

  if (!match) return res.status(400).json({ error: "Envie uma imagem PNG, JPG, WEBP ou GIF." });

  const buffer = Buffer.from(match[2], "base64");
  if (!buffer.length || buffer.length > 2 * 1024 * 1024) {
    return res.status(400).json({ error: "A bandeira deve ter no máximo 2 MB." });
  }

  try {
    const filename = safeFileName(original_name);
    const publicTarget = path.join(FLAGS_DIR, filename);
    fs.writeFileSync(publicTarget, buffer);
    fs.copyFileSync(publicTarget, path.join(SITE_FLAGS_DIR, filename));
    res.json({ url: `/assets/flags/${filename}` });
  } catch (error) {
    console.error("POST /api/upload-flag:", error);
    res.status(500).json({ error: "Não foi possível salvar a bandeira." });
  }
});

app.use(express.static(ROOT, { extensions: ["html"] }));

// Keep the editor data normalized whenever the server starts.
normalizeLocalStoreImages();

app.get("/editor", (_req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "editor.html"));
});

app.get("/public-map", (_req, res) => {
  res.redirect("/html/Kingdom%20Rush/kingdom.html");
});

app.get("/", (_req, res) => {
  res.redirect("/editor");
});

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

normalizeLocalStoreImages();

app.listen(PORT, () => {
  console.log(`Kingdom Rush Map em http://localhost:${PORT}`);
  console.log(`Editor: http://localhost:${PORT}/editor`);
  console.log(`Mapa público local: http://localhost:${PORT}/public-map`);
  console.log(`Dados locais: ${DATA_FILE}`);
  console.log(`Dados públicos sincronizados: ${SITE_DATA_FILE}`);
});
