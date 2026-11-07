/* NavalFireVR — Project Control Room
 * Vanilla JS. No dependencies, no build step.
 * State lives in localStorage; SEED (data.js) is the fallback and the reset point.
 */

"use strict";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "navalfirevr.controlroom.v1";
const SCHEMA = 1;

const MILESTONE_STATUSES = ["Not started", "Planned", "In progress", "Blocked", "Done"];
const ENV_STATUSES = ["Not started", "Planned", "In progress", "Needs verification", "Blocked", "Done"];
const INTERACTION_STATUSES = ["Planned", "Designing", "Ready to implement", "In progress", "Done"];
const GRAPHICS_STATUSES = ["Not started", "In progress", "Blocked", "Done"];
const TASK_STATUSES = ["Backlog", "Planned", "In progress", "Blocked", "Ready for review", "Done"];
const PRIORITIES = ["Low", "Normal", "High", "Urgent"];
const READINESS = ["Ready", "Needs inspection", "Unknown"];
const ITEM_INTERACTION = ["Pending", "Designing", "Ready to implement", "Done"];
const DECISION_VALUES = {
  headset: ["Undecided", "PC VR", "Standalone"],
  deployment: ["Undecided", "PC VR", "Standalone", "Both"],
  perfBudget: ["Not set", "60 fps", "72 fps", "90 fps", "Other"]
};

const STATUS_CLASS = {
  "Not started": "notstarted",
  "Backlog": "backlog",
  "Planned": "planned",
  "In progress": "inprogress",
  "Blocked": "blocked",
  "Done": "done",
  "Ready for review": "review",
  "Designing": "designing",
  "Ready to implement": "ready",
  "Needs verification": "needsverification",
  "Undecided": "undecided"
};

const PRIORITY_RANK = { Urgent: 0, High: 1, Normal: 2, Low: 3 };

const ROUTES = {
  overview: {
    title: "Overview",
    eyebrow: "NavalFireVR / Control room",
    sub: "Current state of the project: roadmap progress, environment checks, lockers, interaction planning, and open tasks."
  },
  roadmap: {
    title: "Project roadmap",
    eyebrow: "NavalFireVR / Plan",
    sub: "Milestones in sequence. Change a status and the overview counts follow."
  },
  environment: {
    title: "Environment checklist",
    eyebrow: "NavalFireVR / Ship",
    sub: "Scenario and environment work, with recorded work kept separate from work that still needs verification."
  },
  lockers: {
    title: "Equipment lockers",
    eyebrow: "NavalFireVR / Equipment",
    sub: "Four lockers tracked separately: TPB, TIS, TISA, and ARI."
  },
  interactions: {
    title: "VR interaction planning",
    eyebrow: "NavalFireVR / Design",
    sub: "Future object interactions grouped by status. These are planning cards, not claims that the interactions exist in Unreal yet."
  },
  graphics: {
    title: "Graphics & headset",
    eyebrow: "NavalFireVR / Investigation",
    sub: "Desktop checks, standalone checks, and future VR evaluation. Headset and deployment mode stay undecided until you change them."
  },
  tasks: {
    title: "Codex task tracker",
    eyebrow: "NavalFireVR / Work queue",
    sub: "Reusable task list for work performed with Codex on the Unreal project."
  },
  vault: {
    title: "Vault notes",
    eyebrow: "NavalFireVR / Knowledge base",
    sub: "Every note in the NavalVault Obsidian vault, mirrored here by the vault sync."
  }
};

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

const clone = (value) => JSON.parse(JSON.stringify(value));

function storageAvailable() {
  try {
    const probe = "__nf_probe__";
    localStorage.setItem(probe, "1");
    localStorage.removeItem(probe);
    return true;
  } catch (error) {
    return false;
  }
}

const HAS_STORAGE = storageAvailable();
let storageOk = HAS_STORAGE;

function loadState() {
  if (!HAS_STORAGE) return clone(SEED);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return clone(SEED);
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.meta?.schema !== SCHEMA) return clone(SEED);
    return hydrate(parsed);
  } catch (error) {
    console.warn("Could not read saved state, falling back to seed.", error);
    return clone(SEED);
  }
}

/* Fill in anything a saved state is missing so an older save cannot break the UI. */
function hydrate(saved) {
  const base = clone(SEED);
  const merged = Object.assign(base, saved);
  merged.decisions = Object.assign(clone(SEED.decisions), saved.decisions || {});
  merged.graphics = Object.assign(clone(SEED.graphics), saved.graphics || {});
  merged.meta = Object.assign(clone(SEED.meta), saved.meta || {});
  for (const key of ["milestones", "environment", "lockers", "interactions", "tasks"]) {
    if (!Array.isArray(merged[key])) merged[key] = clone(SEED[key]);
  }
  merged.graphics.groups = Array.isArray(merged.graphics.groups) ? merged.graphics.groups : clone(SEED.graphics.groups);
  return merged;
}

let state = loadState();
let currentRoute = "overview";
let currentSlug = null;
let drawerCtx = null;
let toastTimer = 0;
let saveTimer = 0;
let lastSaved = null;

const taskView = { q: "", status: "all", priority: "all", area: "all", sort: "priority" };

/* ------------------------------------------------------------------ */
/* Persistence                                                         */
/* ------------------------------------------------------------------ */

function persist(immediate) {
  const pill = document.getElementById("saved-pill");
  const text = document.getElementById("saved-text");
  if (pill) pill.classList.add("is-saving");
  if (text) text.textContent = "Saving";

  const write = () => {
    try {
      if (storageOk) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        lastSaved = new Date();
      }
    } catch (error) {
      storageOk = false;
      updateStorageLabel();
      toast("Browser storage is unavailable — changes stay in this tab only.");
    }
    if (pill) pill.classList.remove("is-saving");
    if (text) text.textContent = "Saved";
    updateSavedLabel();
  };

  window.clearTimeout(saveTimer);
  if (immediate) write();
  else saveTimer = window.setTimeout(write, 260);
}

function updateSavedLabel() {
  const node = document.getElementById("foot-saved");
  if (!node) return;
  if (!lastSaved) {
    node.textContent = "not yet";
    return;
  }
  node.textContent = lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function updateStorageLabel() {
  const node = document.getElementById("foot-storage");
  if (!node) return;
  node.textContent = storageOk ? "local" : "memory";
  node.style.color = storageOk ? "" : "#e8b072";
}

function toast(message) {
  const node = document.getElementById("toast");
  if (!node) return;
  node.textContent = message;
  node.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => node.classList.remove("is-visible"), 2600);
}

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

const esc = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]
  ));

const pct = (part, whole) => (whole > 0 ? Math.round((part / whole) * 100) : 0);

function chip(status) {
  const cls = STATUS_CLASS[status] || "notstarted";
  return `<span class="chip chip--${cls}">${esc(status)}</span>`;
}

function priority(value) {
  const cls = String(value || "Normal").toLowerCase();
  return `<span class="prio prio--${cls}">${esc(value || "Normal")}</span>`;
}

function statusSelect(path, options, value, extraClass = "select--status") {
  const opts = options
    .map((option) => `<option value="${esc(option)}"${option === value ? " selected" : ""}>${esc(option)}</option>`)
    .join("");
  return `<select class="select ${extraClass}" data-path="${path}" data-rerender="1" aria-label="Status">${opts}</select>`;
}

function prioritySelect(path, value) {
  const opts = PRIORITIES
    .map((option) => `<option value="${esc(option)}"${option === value ? " selected" : ""}>${esc(option)}</option>`)
    .join("");
  return `<select class="select select--status" data-path="${path}" data-rerender="1" aria-label="Priority">${opts}</select>`;
}

function optionsSelect(path, options, value, label, rerender = true) {
  const opts = options
    .map((option) => `<option value="${esc(option)}"${option === value ? " selected" : ""}>${esc(option)}</option>`)
    .join("");
  return `<select class="select" data-path="${path}"${rerender ? ' data-rerender="1"' : ""} aria-label="${esc(label)}">${opts}</select>`;
}

function notesField(path, value, placeholder, rows = 2) {
  return `<textarea class="notes-input" rows="${rows}" data-path="${path}" data-live="1" placeholder="${esc(placeholder || "Notes")}">${esc(value)}</textarea>`;
}

function textField(path, value, placeholder, rerender = false) {
  return `<input class="input" type="text" value="${esc(value)}" data-path="${path}"${rerender ? ' data-rerender="1"' : ""} data-live="1" placeholder="${esc(placeholder || "")}" />`;
}

function dateField(path, value) {
  return `<input class="input" type="date" value="${esc(value)}" data-path="${path}" data-live="1" aria-label="Target date" />`;
}

function checkIcon() {
  return `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>`;
}

function getPath(path) {
  return path.split(".").reduce((node, key) => (node == null ? undefined : node[key]), state);
}

function setPath(path, value) {
  const keys = path.split(".");
  let node = state;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i];
    if (node[key] == null) node[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
    node = node[key];
  }
  node[keys[keys.length - 1]] = value;
}

function counts() {
  const ms = state.milestones;
  const msDone = ms.filter((m) => m.status === "Done").length;
  const msActive = ms.filter((m) => m.status === "In progress").length;
  const msBlocked = ms.filter((m) => m.status === "Blocked").length;

  const envDone = state.environment.filter((e) => e.status === "Done").length;
  const envVerify = state.environment.filter((e) => e.status === "Needs verification").length;

  const openTasks = state.tasks.filter((t) => t.status !== "Done");
  const hotTasks = openTasks.filter((t) => t.priority === "Urgent" || t.priority === "High");

  const items = state.lockers.flatMap((locker) => locker.items);
  const readyItems = items.filter((item) => item.readiness === "Ready").length;
  const pendingItems = items.filter((item) => item.interaction !== "Done").length;

  return {
    msTotal: ms.length,
    msDone,
    msActive,
    msBlocked,
    msUpcoming: ms.length - msDone - msActive - msBlocked,
    envTotal: state.environment.length,
    envDone,
    envVerify,
    openTasks: openTasks.length,
    hotTasks: hotTasks.length,
    lockerCount: state.lockers.length,
    itemCount: items.length,
    readyItems,
    pendingItems
  };
}

function sortedOpenTasks(limit) {
  const list = state.tasks
    .filter((task) => task.status !== "Done")
    .sort((a, b) => (PRIORITY_RANK[a.priority] ?? 9) - (PRIORITY_RANK[b.priority] ?? 9));
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

/* ------------------------------------------------------------------ */
/* Navigation and page shell                                           */
/* ------------------------------------------------------------------ */

function parseHash() {
  const raw = (window.location.hash || "").replace(/^#\/?/, "").trim();
  if (raw === "vault" || raw.startsWith("vault/")) {
    const slug = raw.startsWith("vault/") ? raw.slice(6) : null;
    return { route: "vault", slug };
  }
  return { route: ROUTES[raw] ? raw : "overview", slug: null };
}

function navigate(route, slug) {
  if (!ROUTES[route]) route = "overview";
  const target = slug ? `#/${route}/${slug}` : `#/${route}`;
  if (window.location.hash !== target) {
    window.location.hash = target;
    return;
  }
  render();
}

function syncNav() {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.route === currentRoute);
    item.setAttribute("aria-current", item.dataset.route === currentRoute ? "page" : "false");
  });

  const c = counts();
  const map = {
    open: c.openTasks,
    milestones: c.msTotal,
    env: c.envTotal,
    lockers: c.lockerCount,
    interactions: state.interactions.length,
    graphics: state.graphics.groups.reduce((n, g) => n + g.items.length, 0),
    tasks: c.openTasks,
    vault: vaultNotes().length
  };

  document.querySelectorAll("[data-count]").forEach((node) => {
    const key = node.dataset.count;
    node.textContent = map[key] ?? 0;
    node.classList.toggle("is-alert", key === "open" && c.hotTasks > 0);
  });
}

let lastRenderedRoute = null;

function render() {
  const routeChanged = lastRenderedRoute !== currentRoute;
  const scrollY = window.scrollY;
  const route = ROUTES[currentRoute];

  document.getElementById("page-title").textContent = route.title;
  document.getElementById("page-eyebrow").textContent = route.eyebrow;
  document.getElementById("page-sub").textContent = route.sub;

  const page = document.getElementById("page");
  page.innerHTML = VIEWS[currentRoute]();
  document.title = `${route.title} — NavalFireVR`;

  syncNav();
  updateSavedLabel();
  updateStorageLabel();
  window.scrollTo(0, routeChanged ? 0 : scrollY);
  lastRenderedRoute = currentRoute;
}

/* ------------------------------------------------------------------ */
/* Overview                                                            */
/* ------------------------------------------------------------------ */

function viewOverview() {
  const c = counts();
  const roadmapPct = pct(c.msDone, c.msTotal);
  const envPct = pct(c.envDone, c.envTotal);
  const tasksPct = state.tasks.length ? pct(state.tasks.length - c.openTasks, state.tasks.length) : 0;

  const decisions = ["headset", "deployment", "perfBudget"]
    .map((key) => {
      const decision = state.decisions[key];
      return `<span class="decision-pill"><b>${esc(decision.label)}</b>${chip(decision.value)}</span>`;
    })
    .join("");

  const msRows = state.milestones
    .map((m, index) => `
      <div class="mini-row">
        <span class="num">${String(index + 1).padStart(2, "0")}</span>
        <span class="title">${esc(m.title)}</span>
        ${priority(m.priority)}
        ${chip(m.status)}
      </div>`)
    .join("");

  const envRows = state.environment
    .map((item) => `
      <div class="mini-row">
        <span class="check-box" data-act="env-toggle" data-id="${esc(item.id)}" data-state="${(STATUS_CLASS[item.status] || "")}"
              role="button" tabindex="0" title="Toggle done">${checkIcon()}</span>
        <span class="title">
          ${esc(item.title)}
          ${item.verification ? `<span style="display:block;font-size:11px;color:var(--muted)">${esc(item.verification)}</span>` : ""}
        </span>
        ${chip(item.status)}
      </div>`)
    .join("");

  const lockerCards = state.lockers
    .map((locker) => {
      const ready = locker.items.filter((item) => item.readiness === "Ready").length;
      const pending = locker.items.filter((item) => item.interaction !== "Done").length;
      return `
        <article class="locker-card" data-act="go" data-route="lockers" tabindex="0" role="button">
          <div class="locker-code">${esc(locker.code)}</div>
          <div class="locker-meta">${esc(locker.state)}</div>
          <div class="locker-stats">
            <div class="locker-stat"><b>${locker.items.length}</b>items</div>
            <div class="locker-stat"><b>${ready}</b>verified</div>
            <div class="locker-stat"><b>${pending}</b>pending</div>
          </div>
        </article>`;
    })
    .join("");

  const boardCols = INTERACTION_STATUSES
    .map((status) => {
      const cards = state.interactions.filter((card) => card.status === status);
      const thumbs = cards.slice(0, 2).map((card) => `<div class="card-thumb">${esc(card.title)}</div>`).join("");
      return `<div class="col"><h4>${esc(status)}</h4><b>${cards.length}</b>${thumbs}</div>`;
    })
    .join("");

  const compare = state.graphics.comparison;

  const taskRows = sortedOpenTasks(6)
    .map((task) => `
      <tr class="clickable" data-act="task-open" data-id="${esc(task.id)}">
        <td>
          <div class="cell-title">${esc(task.title)}</div>
          <div class="cell-sub">${esc(task.area || "Unassigned")}${task.verification ? ` · ${esc(task.verification)}` : ""}</div>
        </td>
        <td>${priority(task.priority)}</td>
        <td>${chip(task.status)}</td>
      </tr>`)
    .join("");

  return `
    <div class="decision-strip">
      <span class="micro">Open decisions</span>
      <div class="decision-items">${decisions}</div>
      <button class="btn btn--sm" data-act="go" data-route="graphics">Review</button>
    </div>

    <div class="kpi-grid">
      <button class="kpi" data-act="go" data-route="roadmap">
        <div class="kpi-top">
          <div class="kpi-num">${c.msDone}<small>/${c.msTotal}</small></div>
          <span class="micro">${roadmapPct}%</span>
        </div>
        <div class="kpi-label">Roadmap progress</div>
        <div class="kpi-sub">${c.msActive} active · ${c.msUpcoming} upcoming${c.msBlocked ? ` · ${c.msBlocked} blocked` : ""}</div>
        <div class="kpi-bar"><i style="width:${roadmapPct}%"></i></div>
      </button>

      <button class="kpi" data-act="go" data-route="environment">
        <div class="kpi-top">
          <div class="kpi-num">${c.envDone}<small>/${c.envTotal}</small></div>
          <span class="micro">${envPct}%</span>
        </div>
        <div class="kpi-label">Environment checks</div>
        <div class="kpi-sub">${c.envVerify ? `${c.envVerify} need verification` : "Nothing waiting on verification"}</div>
        <div class="kpi-bar${c.envVerify ? " is-amber" : ""}"><i style="width:${envPct}%"></i></div>
      </button>

      <button class="kpi" data-act="go" data-route="lockers">
        <div class="kpi-top">
          <div class="kpi-num">${c.lockerCount}</div>
          <span class="micro">Lockers</span>
        </div>
        <div class="kpi-label">Equipment lockers</div>
        <div class="kpi-sub">${c.readyItems} of ${c.itemCount} verified${c.pendingItems ? ` · ${c.pendingItems} pending` : ""}</div>
        <div class="kpi-bar"><i style="width:${pct(c.readyItems, c.itemCount)}%"></i></div>
      </button>

      <button class="kpi" data-act="go" data-route="tasks">
        <div class="kpi-top">
          <div class="kpi-num">${c.openTasks}</div>
          <span class="micro">Open</span>
        </div>
        <div class="kpi-label">Open tasks</div>
        <div class="kpi-sub">${c.hotTasks} high or urgent</div>
        <div class="kpi-bar${c.hotTasks ? " is-amber" : ""}"><i style="width:${Math.max(tasksPct, 3)}%"></i></div>
      </button>
    </div>

    <div class="grid-2">
      <section class="card">
        <div class="card-head">
          <div>
            <h2>Roadmap progress</h2>
            <p>${c.msDone} of ${c.msTotal} milestones recorded as done.</p>
          </div>
          <button class="btn btn--sm" data-act="go" data-route="roadmap">Open roadmap</button>
        </div>
        <div class="card-body tight"><div class="mini-list">${msRows}</div></div>
      </section>

      <section class="card">
        <div class="card-head">
          <div>
            <h2>Environment checks</h2>
            <p>${c.envVerify} item${c.envVerify === 1 ? "" : "s"} recorded but still unverified.</p>
          </div>
          <button class="btn btn--sm" data-act="go" data-route="environment">Open checklist</button>
        </div>
        <div class="card-body tight"><div class="mini-list">${envRows}</div></div>
      </section>
    </div>

    <div class="section-head" style="display:flex;align-items:center;justify-content:space-between;margin:0 0 10px">
      <h2 style="font-size:15px">Equipment lockers</h2>
      <button class="btn btn--sm" data-act="go" data-route="lockers">Open lockers</button>
    </div>
    <div class="locker-grid" style="margin-bottom:18px">${lockerCards}</div>

    <section class="card" style="margin-bottom:18px">
      <div class="card-head">
        <div>
          <h2>VR interaction board</h2>
          <p>${state.interactions.length} planning cards across ${INTERACTION_STATUSES.length} states.</p>
        </div>
        <button class="btn btn--sm" data-act="go" data-route="interactions">Open board</button>
      </div>
      <div class="card-body"><div class="board-mini">${boardCols}</div></div>
    </section>

    <section class="card" style="margin-bottom:18px">
      <div class="card-head">
        <div>
          <h2>Graphics &amp; headset comparison</h2>
          <p>No headset, deployment mode, or performance budget has been chosen.</p>
        </div>
        <button class="btn btn--sm" data-act="go" data-route="graphics">Open investigation</button>
      </div>
      <div class="card-body">
        <div class="compare-grid">
          <div class="compare-cell"><div class="micro">Headset</div>${chip(state.decisions.headset.value)}</div>
          <div class="compare-cell"><div class="micro">Deployment mode</div>${chip(state.decisions.deployment.value)}</div>
          <div class="compare-cell"><div class="micro">Performance budget</div>${chip(state.decisions.perfBudget.value)}</div>
        </div>
        <div class="constraint-box">${esc(compare.constraint)}</div>
      </div>
    </section>

    <section class="card" style="margin-bottom:18px">
      <div class="card-head">
        <div>
          <h2>Latest from the vault</h2>
          <p>${
            vaultData()
              ? `${vaultNotes().length} notes synced from ${esc(vaultData().vaultName)} · ${esc(formatSyncTime(vaultData().generatedAt))}`
              : "Vault not synced yet — run tools\\sync-vault.ps1"
          }</p>
        </div>
        <button class="btn btn--sm" data-act="go" data-route="vault">Open vault notes</button>
      </div>
      <div class="card-body tight">
        <div class="mini-list">
          ${vaultNotes()
            .slice(0, 5)
            .map(
              (note) => `
            <div class="mini-row">
              <span class="title">${esc(note.title)}</span>
              <span class="micro" style="letter-spacing:.06em">${esc(note.folder || "root")}</span>
              <span class="num">${esc(note.updated || "")}</span>
            </div>`
            )
            .join("") || `<div class="empty">No vault notes mirrored yet.</div>`}
        </div>
      </div>
    </section>

    <section class="card">
      <div class="card-head">
        <div>
          <h2>Codex tasks</h2>
          <p>Highest-priority open work first.</p>
        </div>
        <button class="btn btn--sm" data-act="go" data-route="tasks">Open tracker</button>
      </div>
      <div class="table-wrap">
        <table class="data">
          <thead><tr><th>Task</th><th>Priority</th><th>Status</th></tr></thead>
          <tbody>${taskRows || `<tr><td colspan="3" class="empty">No open tasks.</td></tr>`}</tbody>
        </table>
      </div>
    </section>`;
}

/* ------------------------------------------------------------------ */
/* Roadmap                                                             */
/* ------------------------------------------------------------------ */

function viewRoadmap() {
  const c = counts();
  const items = state.milestones
    .map((m, index) => {
      const cls = `ms ms--${(STATUS_CLASS[m.status] || "planned")}`;
      return `
        <article class="${cls}">
          <div class="card ms-card">
            <div class="ms-head">
              <span class="ms-index">M${String(index + 1).padStart(2, "0")}</span>
              <span class="ms-title">${esc(m.title)}</span>
              ${chip(m.status)}
              ${priority(m.priority)}
            </div>
            <div class="ms-controls">
              <div class="field">
                <span class="field-label">Status</span>
                ${statusSelect(`milestones.${index}.status`, MILESTONE_STATUSES, m.status)}
              </div>
              <div class="field">
                <span class="field-label">Priority</span>
                ${prioritySelect(`milestones.${index}.priority`, m.priority)}
              </div>
              <div class="field">
                <span class="field-label">Target date</span>
                ${dateField(`milestones.${index}.target`, m.target)}
              </div>
            </div>
            <div class="ms-notes">
              <span class="field-label">Notes</span>
              ${notesField(`milestones.${index}.notes`, m.notes, "What is recorded, and what is still open", 2)}
            </div>
            ${m.constraint ? `<div class="ms-constraint">${esc(m.constraint)}</div>` : ""}
          </div>
        </article>`;
    })
    .join("");

  return `
    <section class="card" style="margin-bottom:16px">
      <div class="card-body" style="display:flex;flex-wrap:wrap;gap:18px;align-items:center">
        <div style="flex:1;min-width:220px">
          <div class="micro">Sequence progress</div>
          <div style="font-size:22px;font-weight:650;margin-top:4px">${c.msDone} of ${c.msTotal} done</div>
          <div class="kpi-bar" style="margin-top:10px;max-width:420px"><i style="width:${pct(c.msDone, c.msTotal)}%"></i></div>
        </div>
        <div style="display:flex;gap:18px;flex-wrap:wrap">
          <div><div class="micro">Active</div><div style="font-size:18px;font-weight:600">${c.msActive}</div></div>
          <div><div class="micro">Upcoming</div><div style="font-size:18px;font-weight:600">${c.msUpcoming}</div></div>
          <div><div class="micro">Blocked</div><div style="font-size:18px;font-weight:600">${c.msBlocked}</div></div>
        </div>
      </div>
    </section>
    <div class="timeline">${items}</div>`;
}

/* ------------------------------------------------------------------ */
/* Environment                                                         */
/* ------------------------------------------------------------------ */

function viewEnvironment() {
  const c = counts();
  const rows = state.environment
    .map((item, index) => `
      <div class="check-row">
        <span class="check-box" data-act="env-toggle" data-id="${esc(item.id)}" data-state="${(STATUS_CLASS[item.status] || "")}"
              role="button" tabindex="0" title="Toggle done">${checkIcon()}</span>
        <div>
          <div class="check-title">${esc(item.title)}</div>
          <div class="check-verify">${esc(item.verification || "No verification recorded")}</div>
        </div>
        <div>${statusSelect(`environment.${index}.status`, ENV_STATUSES, item.status)}</div>
        <div>${notesField(`environment.${index}.notes`, item.notes, "Notes")}</div>
      </div>`)
    .join("");

  return `
    <section class="card">
      <div class="card-head">
        <div>
          <h2>Environment and experience work</h2>
          <p>${c.envDone} done · ${c.envVerify} recorded but unverified · ${state.environment.length} total</p>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <span class="micro">Verification</span>
          <span class="chip chip--done">Applied</span>
          <span class="chip chip--needsverification">Unverified</span>
        </div>
      </div>
      <div class="card-body">${rows}</div>
    </section>`;
}

/* ------------------------------------------------------------------ */
/* Lockers                                                             */
/* ------------------------------------------------------------------ */

function viewLockers() {
  const panels = state.lockers
    .map((locker, li) => {
      const rows = locker.items
        .map((item, ii) => `
          <div class="item-row">
            ${textField(`lockers.${li}.items.${ii}.name`, item.name, "Item")}
            ${textField(`lockers.${li}.items.${ii}.qty`, item.qty, "Qty")}
            ${optionsSelect(`lockers.${li}.items.${ii}.readiness`, READINESS, item.readiness, "Readiness")}
            ${optionsSelect(`lockers.${li}.items.${ii}.interaction`, ITEM_INTERACTION, item.interaction, "Interaction")}
            ${prioritySelect(`lockers.${li}.items.${ii}.priority`, item.priority)}
            ${notesField(`lockers.${li}.items.${ii}.notes`, item.notes, "Notes")}
            <button class="btn btn--ghost btn--icon" data-act="locker-item-remove" data-locker="${esc(locker.id)}" data-item="${esc(item.id)}" title="Remove item" aria-label="Remove ${esc(item.name)}">✕</button>
          </div>`)
        .join("");

      const ready = locker.items.filter((item) => item.readiness === "Ready").length;
      const pending = locker.items.filter((item) => item.interaction !== "Done").length;

      return `
        <section class="card locker-panel">
          <div class="card-head">
            <div>
              <div class="locker-code-lg">${esc(locker.code)}</div>
              <div class="locker-note">${esc(locker.note)}</div>
            </div>
            <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">
              <div><div class="micro">Items</div><div style="font-weight:600">${locker.items.length}</div></div>
              <div><div class="micro">Verified</div><div style="font-weight:600">${ready}</div></div>
              <div><div class="micro">Pending</div><div style="font-weight:600">${pending}</div></div>
              <span class="chip chip--state">Placed and saved</span>
            </div>
          </div>
          <div class="card-body">
            <div class="item-row is-head">
              <span>Item</span><span>Qty</span><span>Readiness</span><span>Interaction</span><span>Priority</span><span>Notes</span><span></span>
            </div>
            ${rows}
            <div style="margin-top:12px">
              <button class="btn btn--sm" data-act="locker-item-add" data-locker="${esc(locker.id)}">+ Add item</button>
            </div>
            <div class="locker-limit"><strong>Known limitation:</strong> ${esc(locker.limitation)}</div>
          </div>
        </section>`;
    })
    .join("");

  return panels;
}

/* ------------------------------------------------------------------ */
/* Interactions (kanban)                                               */
/* ------------------------------------------------------------------ */

function viewInteractions() {
  const columns = INTERACTION_STATUSES
    .map((status) => {
      const cards = state.interactions.filter((card) => card.status === status);
      const cardHtml = cards
        .map((card) => `
          <button class="kcard kcard--${(STATUS_CLASS[card.status] || "")}" data-act="ix-open" data-id="${esc(card.id)}">
            <div class="kcard-title">${esc(card.title)}</div>
            <div class="kcard-action">${esc(card.action)}</div>
            <div class="kcard-meta">${priority(card.priority)}</div>
            ${card.role || card.scenario ? `<div class="kcard-role">${esc([card.role, card.scenario].filter(Boolean).join(" · "))}</div>` : ""}
          </button>`)
        .join("");

      return `
        <section class="kcol">
          <div class="kcol-head">
            <h3>${esc(status)}</h3>
            <span class="count">${cards.length}</span>
          </div>
          <div class="kcol-body">${cardHtml || `<div class="empty" style="padding:14px 6px">Nothing here</div>`}</div>
          <button class="kcol-add" data-act="ix-new" data-status="${esc(status)}">+ Add interaction</button>
        </section>`;
    })
    .join("");

  return `
    <div class="decision-strip" style="background:linear-gradient(90deg,var(--teal-soft),#fbfefe 70%);border-color:var(--teal-line);border-left-color:var(--teal)">
      <span class="micro" style="color:var(--teal)">Planning only</span>
      <div style="flex:1;font-size:12.5px;color:#12514d">These cards describe future VR interactions. They are not claims that the interactions already exist in Unreal.</div>
    </div>
    <div class="kanban">${columns}</div>`;
}

/* ------------------------------------------------------------------ */
/* Graphics and headset                                                */
/* ------------------------------------------------------------------ */

function viewGraphics() {
  const groups = state.graphics.groups
    .map((group, gi) => {
      const items = group.items
        .map((item, ii) => `
          <div class="grp-item">
            <div class="grp-item-top">
              <span class="grp-item-title">${esc(item.title)}</span>
              ${statusSelect(`graphics.groups.${gi}.items.${ii}.status`, GRAPHICS_STATUSES, item.status, "select--status")}
            </div>
            ${notesField(`graphics.groups.${gi}.items.${ii}.notes`, item.notes, "Notes")}
          </div>`)
        .join("");

      return `
        <section class="card grp">
          <h3>${esc(group.title)}</h3>
          <div class="grp-note">${esc(group.note)}</div>
          <div class="grp-list">${items}</div>
        </section>`;
    })
    .join("");

  const cmp = state.graphics.comparison;

  const headsetOptions = DECISION_VALUES.headset
    .map((v) => `<option value="${esc(v)}"${v === state.decisions.headset.value ? " selected" : ""}>${esc(v)}</option>`)
    .join("");
  const deploymentOptions = DECISION_VALUES.deployment
    .map((v) => `<option value="${esc(v)}"${v === state.decisions.deployment.value ? " selected" : ""}>${esc(v)}</option>`)
    .join("");
  const budgetOptions = DECISION_VALUES.perfBudget
    .map((v) => `<option value="${esc(v)}"${v === state.decisions.perfBudget.value ? " selected" : ""}>${esc(v)}</option>`)
    .join("");

  return `
    <div class="decision-strip">
      <span class="micro">Still open</span>
      <div class="decision-items">
        <span class="decision-pill"><b>Headset</b>${chip(state.decisions.headset.value)}</span>
        <span class="decision-pill"><b>Deployment</b>${chip(state.decisions.deployment.value)}</span>
        <span class="decision-pill"><b>Budget</b>${chip(state.decisions.perfBudget.value)}</span>
      </div>
    </div>

    <div class="compare-grid" style="margin-bottom:16px">${groups}</div>

    <section class="card">
      <div class="card-head">
        <div>
          <h2>Headset and deployment comparison</h2>
          <p>These stay undecided until you deliberately change them. Selecting a value records a decision.</p>
        </div>
      </div>
      <div class="card-body" style="display:flex;flex-direction:column;gap:16px">
        <div class="compare-grid">
          <div class="compare-cell">
            <div class="micro">Headset</div>
            <select class="select" data-path="decisions.headset.value" data-rerender="1" aria-label="Headset">${headsetOptions}</select>
            ${notesField("decisions.headset.note", state.decisions.headset.note, "Why this is still open")}
          </div>
          <div class="compare-cell">
            <div class="micro">Deployment mode</div>
            <select class="select" data-path="decisions.deployment.value" data-rerender="1" aria-label="Deployment mode">${deploymentOptions}</select>
            ${notesField("decisions.deployment.note", state.decisions.deployment.note, "Why this is still open")}
          </div>
          <div class="compare-cell">
            <div class="micro">Performance budget</div>
            <select class="select" data-path="decisions.perfBudget.value" data-rerender="1" aria-label="Performance budget">${budgetOptions}</select>
            ${notesField("decisions.perfBudget.note", state.decisions.perfBudget.note, "Constraint or target")}
          </div>
        </div>

        <div class="form-row">
          <div class="field">
            <span class="field-label">Target use</span>
            ${notesField("graphics.comparison.targetUse", cmp.targetUse, "Who uses it, where, and for how long", 3)}
          </div>
          <div class="field">
            <span class="field-label">Visual quality</span>
            ${notesField("graphics.comparison.visualQuality", cmp.visualQuality, "Recorded observations", 3)}
          </div>
          <div class="field">
            <span class="field-label">Performance observations</span>
            ${notesField("graphics.comparison.performance", cmp.performance, "Frame timing, stability, thermals", 3)}
          </div>
          <div class="field">
            <span class="field-label">Open questions</span>
            ${notesField("graphics.comparison.openQuestions", cmp.openQuestions, "What still needs an answer", 3)}
          </div>
        </div>

        <div class="constraint-box"><strong>Recorded constraint:</strong> ${esc(cmp.constraint)}</div>
      </div>
    </section>`;
}

/* ------------------------------------------------------------------ */
/* Tasks                                                               */
/* ------------------------------------------------------------------ */

function filteredTasks() {
  const query = taskView.q.trim().toLowerCase();
  let list = state.tasks.filter((task) => {
    if (taskView.status !== "all" && task.status !== taskView.status) return false;
    if (taskView.priority !== "all" && task.priority !== taskView.priority) return false;
    if (taskView.area !== "all" && task.area !== taskView.area) return false;
    if (!query) return true;
    return [task.title, task.description, task.notes, task.area, task.milestone, task.owner]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  const byPriority = (a, b) => (PRIORITY_RANK[a.priority] ?? 9) - (PRIORITY_RANK[b.priority] ?? 9);
  const byStatus = (a, b) => TASK_STATUSES.indexOf(a.status) - TASK_STATUSES.indexOf(b.status);

  if (taskView.sort === "priority") list = list.sort((a, b) => byPriority(a, b) || byStatus(a, b));
  else if (taskView.sort === "status") list = list.sort((a, b) => byStatus(a, b) || byPriority(a, b));
  else if (taskView.sort === "title") list = list.sort((a, b) => a.title.localeCompare(b.title));
  else if (taskView.sort === "target") {
    list = list.sort((a, b) => (a.target || "9999").localeCompare(b.target || "9999"));
  }

  return list;
}

function viewTasks() {
  const areas = Array.from(new Set(state.tasks.map((task) => task.area).filter(Boolean))).sort();
  const c = counts();
  const list = filteredTasks();

  const rows = list
    .map((task) => `
      <tr class="clickable" data-act="task-open" data-id="${esc(task.id)}">
        <td>
          <div class="cell-title">${esc(task.title)}</div>
          <div class="cell-sub">${esc(task.description || "No description")}</div>
        </td>
        <td>${chip(task.status)}</td>
        <td>${priority(task.priority)}</td>
        <td>${esc(task.area || "—")}</td>
        <td>${esc(task.milestone || "—")}</td>
        <td><span class="cell-sub" style="margin:0">${esc(task.verification || "—")}</span></td>
        <td class="num">${esc(task.target || "—")}</td>
      </tr>`)
    .join("");

  const statusOptions = ["all", ...TASK_STATUSES]
    .map((s) => `<option value="${esc(s)}"${s === taskView.status ? " selected" : ""}>${s === "all" ? "All statuses" : esc(s)}</option>`)
    .join("");
  const priorityOptions = ["all", ...PRIORITIES]
    .map((p) => `<option value="${esc(p)}"${p === taskView.priority ? " selected" : ""}>${p === "all" ? "All priorities" : esc(p)}</option>`)
    .join("");
  const areaOptions = ["all", ...areas]
    .map((a) => `<option value="${esc(a)}"${a === taskView.area ? " selected" : ""}>${a === "all" ? "All areas" : esc(a)}</option>`)
    .join("");
  const sortOptions = [
    ["priority", "Sort: priority"],
    ["status", "Sort: status"],
    ["title", "Sort: title A–Z"],
    ["target", "Sort: target date"]
  ]
    .map(([value, label]) => `<option value="${value}"${value === taskView.sort ? " selected" : ""}>${label}</option>`)
    .join("");

  return `
    <section class="card">
      <div class="card-head">
        <div>
          <h2>Codex task tracker</h2>
          <p>${c.openTasks} open · ${state.tasks.length - c.openTasks} done · ${c.hotTasks} high or urgent</p>
        </div>
        <button class="btn btn--primary" data-act="task-new">+ New task</button>
      </div>

      <div class="toolbar">
        <input class="input search" type="search" placeholder="Search tasks, notes, milestones…" value="${esc(taskView.q)}" data-filter="q" aria-label="Search tasks" />
        <select class="select" data-filter="status" aria-label="Filter by status">${statusOptions}</select>
        <select class="select" data-filter="priority" aria-label="Filter by priority">${priorityOptions}</select>
        <select class="select" data-filter="area" aria-label="Filter by area">${areaOptions}</select>
        <select class="select" data-filter="sort" aria-label="Sort tasks">${sortOptions}</select>
        <span class="spacer"></span>
        <span class="result-count">${list.length} / ${state.tasks.length}</span>
      </div>

      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr>
              <th>Task</th><th>Status</th><th>Priority</th><th>Area</th><th>Milestone</th><th>Verification</th><th>Target</th>
            </tr>
          </thead>
          <tbody>
            ${rows || `<tr><td colspan="7" class="empty">No tasks match these filters.</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>`;
}

/* ------------------------------------------------------------------ */
/* Vault notes (mirrored from the Obsidian vault)                      */
/* ------------------------------------------------------------------ */

let vaultQuery = "";
let vaultTag = null;
let wikiIndex = null;

function vaultData() {
  const data = window.VAULT_DATA;
  return data && Array.isArray(data.notes) && data.notes.length ? data : null;
}

function vaultNotes() {
  const data = vaultData();
  return data ? data.notes : [];
}

function wikiMaps() {
  if (wikiIndex) return wikiIndex;
  const map = new Map();
  for (const note of vaultNotes()) {
    map.set(note.file.toLowerCase(), note.slug);
    map.set(note.title.toLowerCase(), note.slug);
  }
  wikiIndex = map;
  return map;
}

function resolveWiki(target) {
  return wikiMaps().get(String(target).trim().toLowerCase()) || null;
}

function formatSyncTime(iso) {
  if (!iso) return "never";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "unknown";
  return date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

/* ---------- tiny markdown renderer (headings, lists, tables, links) ---------- */

function inlineMd(text) {
  let value = esc(text);
  const codes = [];
  value = value.replace(/`([^`]+)`/g, (_match, code) => {
    codes.push(code);
    return `\u0001${codes.length - 1}\u0001`;
  });

  value = value.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt) => {
    return `<span class="md-image" title="Attachment not mirrored">${alt || "image"}</span>`;
  });

  value = value.replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (_match, target, alias) => {
    const label = alias || target;
    const slug = resolveWiki(target);
    if (!slug) return `<span class="md-wikilink is-missing" title="Note is not in the vault">${label}</span>`;
    return `<a class="md-wikilink" href="#/vault/${slug}" data-act="vault-note" data-slug="${slug}">${label}</a>`;
  });

  value = value.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  value = value.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  value = value.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  value = value.replace(/~~([^~]+)~~/g, "<del>$1</del>");
  value = value.replace(/\u0001(\d+)\u0001/g, (_match, index) => `<code>${codes[Number(index)]}</code>`);
  return value;
}

function tableRow(line) {
  return line.replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function renderMarkdown(markdown) {
  const lines = String(markdown || "").replace(/\r\n?/g, "\n").split("\n");
  const out = [];
  let paragraph = [];
  let i = 0;

  const flush = () => {
    if (paragraph.length) {
      out.push(`<p>${inlineMd(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flush();
      i += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      flush();
      const lang = trimmed.slice(3).trim();
      const buffer = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buffer.push(lines[i]);
        i += 1;
      }
      i += 1;
      out.push(`<pre><code${lang ? ` class="lang-${esc(lang)}"` : ""}>${esc(buffer.join("\n"))}</code></pre>`);
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flush();
      const level = heading[1].length;
      out.push(`<h${level}>${inlineMd(heading[2].replace(/\s+#+\s*$/, ""))}</h${level}>`);
      i += 1;
      continue;
    }

    if (/^([-*_])\s*(\1\s*){2,}$/.test(trimmed)) {
      flush();
      out.push("<hr />");
      i += 1;
      continue;
    }

    if (
      trimmed.startsWith("|") &&
      lines[i + 1] &&
      /^\|?[\s:|-]+\|?$/.test(lines[i + 1].trim()) &&
      lines[i + 1].includes("-")
    ) {
      flush();
      const header = tableRow(trimmed);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(tableRow(lines[i].trim()));
        i += 1;
      }
      const head = header.map((cell) => `<th>${inlineMd(cell)}</th>`).join("");
      const body = rows
        .map((row) => `<tr>${row.map((cell) => `<td>${inlineMd(cell)}</td>`).join("")}</tr>`)
        .join("");
      out.push(`<div class="md-table"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`);
      continue;
    }

    if (trimmed.startsWith(">")) {
      flush();
      const buffer = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        buffer.push(lines[i].trim().replace(/^>\s?/, ""));
        i += 1;
      }
      const callout = buffer[0] && buffer[0].match(/^\[!(\w+)\]\s*(.*)$/);
      if (callout) {
        const title = callout[2] || callout[1];
        out.push(
          `<blockquote class="md-callout"><div class="md-callout-title">${inlineMd(title)}</div>${renderMarkdown(
            buffer.slice(1).join("\n")
          )}</blockquote>`
        );
      } else {
        out.push(`<blockquote>${renderMarkdown(buffer.join("\n"))}</blockquote>`);
      }
      continue;
    }

    if (/^([-*+]|\d+[.)])\s+/.test(trimmed)) {
      flush();
      const ordered = /^\d/.test(trimmed);
      const items = [];
      while (i < lines.length) {
        const current = lines[i].trim();
        const match = current.match(/^([-*+]|\d+[.)])\s+(.*)$/);
        if (!match) break;
        let content = match[2];
        let className = "";
        const task = content.match(/^\[([ xX])\]\s+(.*)$/);
        if (task) {
          const checked = task[1].toLowerCase() === "x";
          className = "md-task";
          content = `<span class="md-check${checked ? " is-checked" : ""}">${checked ? "✓" : ""}</span>${inlineMd(task[2])}`;
        } else {
          content = inlineMd(content);
        }
        items.push(`<li class="${className}">${content}</li>`);
        i += 1;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*([-*+]|\d+[.)])\s+/.test(lines[i])) {
          items[items.length - 1] = items[items.length - 1].replace("</li>", ` ${inlineMd(lines[i].trim())}</li>`);
          i += 1;
        }
      }
      const tag = ordered ? "ol" : "ul";
      out.push(`<${tag}>${items.join("")}</${tag}>`);
      continue;
    }

    paragraph.push(trimmed);
    i += 1;
  }

  flush();
  return out.join("\n");
}

function stripLeadingTitle(body) {
  const lines = String(body || "").replace(/\r\n?/g, "\n").split("\n");
  let index = 0;
  while (index < lines.length && !lines[index].trim()) index += 1;
  if (index < lines.length && /^#\s+\S/.test(lines[index].trim())) lines.splice(index, 1);
  return lines.join("\n");
}

/* ---------- vault view ---------- */

function viewVault() {
  const data = vaultData();
  const notes = vaultNotes();

  if (!data) {
    return `
      <section class="card">
        <div class="card-body empty">
          <p><strong>No vault data loaded.</strong></p>
          <p style="margin-top:8px">Run <code>tools\\sync-vault.ps1</code> in the project folder to export the Obsidian vault to <code>vault-data.js</code>, then reload this page.</p>
        </div>
      </section>`;
  }

  const query = vaultQuery.trim().toLowerCase();
  const filtered = notes.filter((note) => {
    if (vaultTag && !note.tags.includes(vaultTag)) return false;
    if (!query) return true;
    return `${note.title} ${note.folder} ${note.tags.join(" ")} ${note.excerpt} ${note.body}`
      .toLowerCase()
      .includes(query);
  });

  const homeNote = notes.find((note) => note.slug === "home") || notes[0];
  const selected =
    notes.find((note) => note.slug === currentSlug) ||
    ((query || vaultTag) && filtered.length ? filtered[0] : null) ||
    homeNote;

  const list = filtered
    .map((note) => {
      const active = selected && note.slug === selected.slug ? " is-active" : "";
      return `
        <button class="vnote${active}" data-act="vault-note" data-slug="${note.slug}">
          <span class="vnote-title">${esc(note.title)}</span>
          <span class="vnote-meta">${esc(note.folder || "Vault root")}${note.updated ? ` · ${esc(note.updated)}` : ""}</span>
        </button>`;
    })
    .join("");

  const tags = data.tags
    .slice(0, 14)
    .map(
      (entry) =>
        `<button class="vtag${vaultTag === entry.tag ? " is-active" : ""}" data-act="vault-tag" data-tag="${esc(entry.tag)}">${esc(
          entry.tag
        )}<b>${entry.count}</b></button>`
    )
    .join("");

  const backlinks = (selected.backlinks || [])
    .map((slug) => notes.find((note) => note.slug === slug))
    .filter(Boolean)
    .map((note) => `<button class="vnote-link" data-act="vault-note" data-slug="${note.slug}">${esc(note.title)}</button>`)
    .join("");

  const forward = (selected.links || [])
    .map((slug) => notes.find((note) => note.slug === slug))
    .filter(Boolean)
    .slice(0, 8)
    .map((note) => `<button class="vnote-link" data-act="vault-note" data-slug="${note.slug}">${esc(note.title)}</button>`)
    .join("");

  const obsidianHref = `obsidian://open?vault=${encodeURIComponent(data.vaultName)}&file=${encodeURIComponent(
    selected.folder ? `${selected.folder}/${selected.file}` : selected.file
  )}`;

  return `
    <div class="vault-layout">
      <aside class="vault-list card">
        <div class="vault-search">
          <input class="input" type="search" placeholder="Search all notes…" value="${esc(vaultQuery)}" data-vfilter="q" aria-label="Search vault notes" />
        </div>
        <div class="vault-tags">${tags}</div>
        <div class="vault-notes">${list || `<div class="empty">No notes match.</div>`}</div>
        <div class="vault-sync">
          <span>${notes.length} notes</span>
          <span title="Vault export time">Synced ${esc(formatSyncTime(data.generatedAt))}</span>
        </div>
      </aside>

      <article class="vault-reader card">
        <header class="vault-reader-head">
          <div class="micro">${esc(selected.folder || "Vault root")}</div>
          <h2>${esc(selected.title)}</h2>
          <div class="vault-meta">
            ${selected.updated ? `<span class="chip chip--state">Updated ${esc(selected.updated)}</span>` : ""}
            ${selected.tags.map((tag) => `<span class="vtag-static">${esc(tag)}</span>`).join("")}
            <a class="vault-open" href="${esc(obsidianHref)}" title="Open this note in Obsidian">Open in Obsidian</a>
          </div>
        </header>
        <div class="md-body">${renderMarkdown(stripLeadingTitle(selected.body))}</div>
        ${
          backlinks
            ? `<footer class="vault-links"><div class="micro">Linked from</div><div class="vnote-links">${backlinks}</div></footer>`
            : ""
        }
        ${
          forward
            ? `<footer class="vault-links"><div class="micro">Links to</div><div class="vnote-links">${forward}</div></footer>`
            : ""
        }
      </article>
    </div>`;
}

const VIEWS = {
  overview: viewOverview,
  roadmap: viewRoadmap,
  environment: viewEnvironment,
  lockers: viewLockers,
  interactions: viewInteractions,
  graphics: viewGraphics,
  tasks: viewTasks,
  vault: viewVault
};

/* ------------------------------------------------------------------ */
/* Drawer editors                                                      */
/* ------------------------------------------------------------------ */

function drawerEls() {
  return {
    drawer: document.getElementById("drawer"),
    overlay: document.getElementById("drawer-overlay")
  };
}

function openDrawer() {
  const { drawer, overlay } = drawerEls();
  drawer.classList.add("is-open");
  overlay.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  const first = drawer.querySelector("input, textarea, select");
  if (first) first.focus({ preventScroll: true });
}

function closeDrawer() {
  const { drawer, overlay } = drawerEls();
  drawer.classList.remove("is-open");
  overlay.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  drawerCtx = null;
  drawer.innerHTML = "";
}

function taskIndexById(id) {
  return state.tasks.findIndex((task) => task.id === id);
}

function interactionIndexById(id) {
  return state.interactions.findIndex((card) => card.id === id);
}

function openTask(id) {
  const index = taskIndexById(id);
  if (index < 0) return;
  drawerCtx = { type: "task", index };
  renderDrawer();
  openDrawer();
}

function openInteraction(id) {
  const index = interactionIndexById(id);
  if (index < 0) return;
  drawerCtx = { type: "interaction", index };
  renderDrawer();
  openDrawer();
}

function newTask() {
  const id = `tk-${Date.now().toString(36)}`;
  state.tasks.unshift({
    id,
    title: "",
    description: "",
    status: "Backlog",
    priority: "Normal",
    area: "",
    milestone: "",
    verification: "",
    owner: "",
    target: "",
    notes: ""
  });
  persist();
  drawerCtx = { type: "task", index: 0 };
  render();
  renderDrawer();
  openDrawer();
  window.setTimeout(() => {
    const input = document.querySelector("#drawer input");
    if (input) input.select();
  }, 30);
}

function newInteraction(status) {
  const id = `ix-${Date.now().toString(36)}`;
  state.interactions.push({
    id,
    title: "",
    action: "",
    role: "",
    scenario: "",
    status: status || "Planned",
    priority: "Normal",
    notes: "",
    dependencies: ""
  });
  persist();
  const index = interactionIndexById(id);
  drawerCtx = { type: "interaction", index };
  render();
  renderDrawer();
  openDrawer();
  window.setTimeout(() => {
    const input = document.querySelector("#drawer input");
    if (input) input.select();
  }, 30);
}

function renderDrawer() {
  const { drawer } = drawerEls();
  if (!drawerCtx) return;

  if (drawerCtx.type === "task") {
    const index = drawerCtx.index;
    const task = state.tasks[index];
    if (!task) return closeDrawer();

    const milestoneOptions = ["", ...state.milestones.map((m) => m.title)]
      .map((m) => `<option value="${esc(m)}"${m === task.milestone ? " selected" : ""}>${m || "No milestone"}</option>`)
      .join("");

    drawer.innerHTML = `
      <div class="drawer-head">
        <div>
          <h2>Task</h2>
          <p>Codex task record — edits save automatically.</p>
        </div>
        <button class="btn btn--ghost btn--icon" data-act="drawer-close" aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
      <div class="drawer-body">
        <div class="field">
          <label for="d-task-title">Title</label>
          <input id="d-task-title" class="input" type="text" value="${esc(task.title)}" data-path="tasks.${index}.title" data-live="1" placeholder="What needs doing" />
        </div>
        <div class="field">
          <label for="d-task-desc">Description</label>
          <textarea id="d-task-desc" class="textarea" data-path="tasks.${index}.description" data-live="1" placeholder="What this task covers">${esc(task.description)}</textarea>
        </div>
        <div class="form-row">
          <div class="field">
            <label for="d-task-status">Status</label>
            ${statusSelect(`tasks.${index}.status`, TASK_STATUSES, task.status)}
          </div>
          <div class="field">
            <label for="d-task-priority">Priority</label>
            ${prioritySelect(`tasks.${index}.priority`, task.priority)}
          </div>
        </div>
        <div class="form-row">
          <div class="field">
            <label for="d-task-area">Area</label>
            <input id="d-task-area" class="input" type="text" value="${esc(task.area)}" data-path="tasks.${index}.area" data-live="1" placeholder="Lockers, Performance…" />
          </div>
          <div class="field">
            <label for="d-task-owner">Owner</label>
            <input id="d-task-owner" class="input" type="text" value="${esc(task.owner)}" data-path="tasks.${index}.owner" data-live="1" placeholder="Optional" />
          </div>
        </div>
        <div class="field">
          <label for="d-task-milestone">Related milestone</label>
          <select id="d-task-milestone" class="select" data-path="tasks.${index}.milestone" data-rerender="1">${milestoneOptions}</select>
        </div>
        <div class="form-row">
          <div class="field">
            <label for="d-task-verify">Verification state</label>
            <input id="d-task-verify" class="input" type="text" value="${esc(task.verification)}" data-path="tasks.${index}.verification" data-live="1" placeholder="Applied but not tested" />
          </div>
          <div class="field">
            <label for="d-task-target">Target date</label>
            <input id="d-task-target" class="input" type="date" value="${esc(task.target)}" data-path="tasks.${index}.target" data-live="1" />
          </div>
        </div>
        <div class="field">
          <label for="d-task-notes">Notes and constraints</label>
          <textarea id="d-task-notes" class="textarea" rows="4" data-path="tasks.${index}.notes" data-live="1" placeholder="Caveats, dependencies, test steps">${esc(task.notes)}</textarea>
        </div>
      </div>
      <div class="drawer-foot">
        <button class="btn btn--danger" data-act="task-delete">Delete</button>
        <span class="spacer"></span>
        <button class="btn" data-act="task-duplicate">Duplicate</button>
        <button class="btn btn--primary" data-act="drawer-close">Done</button>
      </div>`;
    return;
  }

  if (drawerCtx.type === "interaction") {
    const index = drawerCtx.index;
    const card = state.interactions[index];
    if (!card) return closeDrawer();

    drawer.innerHTML = `
      <div class="drawer-head">
        <div>
          <h2>VR interaction</h2>
          <p>Planning card. Not an implemented Unreal feature.</p>
        </div>
        <button class="btn btn--ghost btn--icon" data-act="drawer-close" aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
      <div class="drawer-body">
        <div class="field">
          <label for="d-ix-title">Object or interaction</label>
          <input id="d-ix-title" class="input" type="text" value="${esc(card.title)}" data-path="interactions.${index}.title" data-live="1" placeholder="Pick up and stow a cylinder" />
        </div>
        <div class="field">
          <label for="d-ix-action">Intended user action</label>
          <textarea id="d-ix-action" class="textarea" data-path="interactions.${index}.action" data-live="1" placeholder="Grip, lift, carry, stow">${esc(card.action)}</textarea>
        </div>
        <div class="form-row">
          <div class="field">
            <label for="d-ix-status">Status</label>
            ${statusSelect(`interactions.${index}.status`, INTERACTION_STATUSES, card.status)}
          </div>
          <div class="field">
            <label for="d-ix-priority">Priority</label>
            ${prioritySelect(`interactions.${index}.priority`, card.priority)}
          </div>
        </div>
        <div class="form-row">
          <div class="field">
            <label for="d-ix-role">Role</label>
            <input id="d-ix-role" class="input" type="text" value="${esc(card.role)}" data-path="interactions.${index}.role" data-live="1" placeholder="Firefighting team" />
          </div>
          <div class="field">
            <label for="d-ix-scenario">Scenario</label>
            <input id="d-ix-scenario" class="input" type="text" value="${esc(card.scenario)}" data-path="interactions.${index}.scenario" data-live="1" placeholder="Locker and stowage" />
          </div>
        </div>
        <div class="field">
          <label for="d-ix-notes">Feedback, constraints, dependencies</label>
          <textarea id="d-ix-notes" class="textarea" rows="4" data-path="interactions.${index}.notes" data-live="1" placeholder="What the player should feel or see">${esc(card.notes)}</textarea>
        </div>
        <div class="field">
          <label for="d-ix-dep">Dependencies</label>
          <input id="d-ix-dep" class="input" type="text" value="${esc(card.dependencies)}" data-path="interactions.${index}.dependencies" data-live="1" placeholder="Locker integration" />
        </div>
      </div>
      <div class="drawer-foot">
        <button class="btn btn--danger" data-act="ix-delete">Delete</button>
        <span class="spacer"></span>
        <button class="btn btn--primary" data-act="drawer-close">Done</button>
      </div>`;
  }
}

/* ------------------------------------------------------------------ */
/* Mutations                                                           */
/* ------------------------------------------------------------------ */

function toggleEnvironment(id) {
  const item = state.environment.find((entry) => entry.id === id);
  if (!item) return;
  item.status = item.status === "Done" ? "Not started" : "Done";
  persist(true);
  render();
}

function addLockerItem(lockerId) {
  const locker = state.lockers.find((entry) => entry.id === lockerId);
  if (!locker) return;
  locker.items.push({
    id: `${locker.code.toLowerCase()}-${Date.now().toString(36)}`,
    name: "",
    qty: "1",
    readiness: "Unknown",
    interaction: "Pending",
    priority: "Normal",
    notes: ""
  });
  persist(true);
  render();
  const panels = document.querySelectorAll(".locker-panel");
  const index = state.lockers.findIndex((entry) => entry.id === lockerId);
  const panel = panels[index];
  if (panel) panel.scrollIntoView({ behavior: "smooth", block: "center" });
}

function removeLockerItem(lockerId, itemId) {
  const locker = state.lockers.find((entry) => entry.id === lockerId);
  if (!locker) return;
  locker.items = locker.items.filter((item) => item.id !== itemId);
  persist(true);
  render();
  toast("Item removed.");
}

function deleteTask() {
  if (!drawerCtx || drawerCtx.type !== "task") return;
  const task = state.tasks[drawerCtx.index];
  if (!task) return;
  if (!window.confirm(`Delete task "${task.title || "Untitled"}"?`)) return;
  state.tasks.splice(drawerCtx.index, 1);
  persist(true);
  closeDrawer();
  render();
  toast("Task deleted.");
}

function duplicateTask() {
  if (!drawerCtx || drawerCtx.type !== "task") return;
  const task = state.tasks[drawerCtx.index];
  if (!task) return;
  const copy = clone(task);
  copy.id = `tk-${Date.now().toString(36)}`;
  copy.title = `${task.title || "Untitled"} (copy)`;
  state.tasks.splice(drawerCtx.index + 1, 0, copy);
  persist(true);
  drawerCtx = { type: "task", index: drawerCtx.index + 1 };
  render();
  renderDrawer();
  toast("Task duplicated.");
}

function deleteInteraction() {
  if (!drawerCtx || drawerCtx.type !== "interaction") return;
  const card = state.interactions[drawerCtx.index];
  if (!card) return;
  if (!window.confirm(`Delete interaction "${card.title || "Untitled"}"?`)) return;
  state.interactions.splice(drawerCtx.index, 1);
  persist(true);
  closeDrawer();
  render();
  toast("Interaction deleted.");
}

/* ------------------------------------------------------------------ */
/* Import / export / reset                                             */
/* ------------------------------------------------------------------ */

function exportState() {
  const stamp = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `navalfirevr-state-${stamp}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  toast("State exported.");
}

function importState(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      if (!parsed || !Array.isArray(parsed.milestones) || !Array.isArray(parsed.tasks)) {
        throw new Error("Missing expected sections");
      }
      state = hydrate(parsed);
      state.meta.schema = SCHEMA;
      persist(true);
      render();
      toast("State imported.");
    } catch (error) {
      window.alert(`That file could not be imported: ${error.message}`);
    }
  };
  reader.readAsText(file);
}

function resetState() {
  if (!window.confirm("Reset the dashboard to the recorded project state? Local edits will be lost.")) return;
  state = clone(SEED);
  persist(true);
  render();
  toast("Reset to the recorded state.");
}

/* ------------------------------------------------------------------ */
/* Events                                                              */
/* ------------------------------------------------------------------ */

document.addEventListener("click", (event) => {
  const navItem = event.target.closest(".nav-item");
  if (navItem) {
    navigate(navItem.dataset.route);
    return;
  }

  const target = event.target.closest("[data-act]");
  if (!target) {
    if (event.target.closest(".drawer-overlay")) closeDrawer();
    return;
  }

  const act = target.dataset.act;

  if (act === "go") {
    navigate(target.dataset.route);
  } else if (act === "vault-note") {
    navigate("vault", target.dataset.slug);
  } else if (act === "vault-tag") {
    vaultTag = vaultTag === target.dataset.tag ? null : target.dataset.tag;
    render();
  } else if (act === "env-toggle") {
    toggleEnvironment(target.dataset.id);
  } else if (act === "locker-item-add") {
    addLockerItem(target.dataset.locker);
  } else if (act === "locker-item-remove") {
    removeLockerItem(target.dataset.locker, target.dataset.item);
  } else if (act === "task-open") {
    openTask(target.dataset.id);
  } else if (act === "task-new") {
    newTask();
  } else if (act === "task-delete") {
    deleteTask();
  } else if (act === "task-duplicate") {
    duplicateTask();
  } else if (act === "ix-open") {
    openInteraction(target.dataset.id);
  } else if (act === "ix-new") {
    newInteraction(target.dataset.status);
  } else if (act === "ix-delete") {
    deleteInteraction();
  } else if (act === "drawer-close") {
    closeDrawer();
    render();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && drawerCtx) {
    closeDrawer();
    render();
    return;
  }
  if (event.key === "Enter" || event.key === " ") {
    const box = event.target.closest('.check-box[data-act="env-toggle"]');
    if (box) {
      event.preventDefault();
      toggleEnvironment(box.dataset.id);
    }
  }
});

document.addEventListener("change", (event) => {
  const filter = event.target.closest("[data-filter]");
  if (filter) {
    const key = filter.dataset.filter;
    taskView[key] = filter.value;
    if (currentRoute === "tasks") render();
    return;
  }

  const field = event.target.closest("[data-path]");
  if (!field) return;
  setPath(field.dataset.path, field.value);
  persist();
  if (field.dataset.rerender) {
    render();
    if (drawerCtx) renderDrawer();
  }
});

document.addEventListener("input", (event) => {
  const vaultFilter = event.target.closest("[data-vfilter]");
  if (vaultFilter) {
    vaultQuery = vaultFilter.value;
    if (currentRoute === "vault") {
      const scrollY = window.scrollY;
      render();
      const input = document.querySelector("[data-vfilter]");
      if (input) {
        input.focus({ preventScroll: true });
        input.setSelectionRange(input.value.length, input.value.length);
      }
      window.scrollTo(0, scrollY);
    }
    return;
  }

  const filter = event.target.closest('[data-filter="q"]');
  if (filter) {
    taskView.q = filter.value;
    if (currentRoute === "tasks") {
      const scrollY = window.scrollY;
      render();
      const input = document.querySelector('[data-filter="q"]');
      if (input) {
        input.focus({ preventScroll: true });
        input.setSelectionRange(input.value.length, input.value.length);
      }
      window.scrollTo(0, scrollY);
    }
    return;
  }

  const field = event.target.closest('[data-path][data-live="1"]');
  if (!field) return;
  setPath(field.dataset.path, field.value);
  persist();
});

document.getElementById("btn-export").addEventListener("click", exportState);
document.getElementById("btn-reset").addEventListener("click", resetState);
document.getElementById("btn-import").addEventListener("click", () => document.getElementById("file-import").click());
document.getElementById("file-import").addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  if (file) importState(file);
  event.target.value = "";
});

window.addEventListener("hashchange", () => {
  const parsed = parseHash();
  currentRoute = parsed.route;
  currentSlug = parsed.slug;
  render();
});

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */

(function boot() {
  const parsed = parseHash();
  currentRoute = parsed.route;
  currentSlug = parsed.slug;
  const seeded = document.getElementById("foot-seeded");
  if (seeded) seeded.textContent = state.meta.seeded || SEED.meta.seeded;
  if (!window.location.hash) window.location.replace("#/overview");
  render();
})();
