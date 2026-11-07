#!/usr/bin/env node
/**
 * sync-vault.mjs — export the NavalFireVR Obsidian vault into vault-data.js
 *
 * The site is static, so it cannot read Obsidian directly. This script walks the
 * vault, parses YAML frontmatter, titles, tags and wikilinks, and writes a single
 * JS file the site loads with a <script> tag (so it also works over file://).
 *
 * Usage:
 *   node tools/sync-vault.mjs
 *   node tools/sync-vault.mjs --vault "C:\path\to\NavalVault"
 *   node tools/sync-vault.mjs --watch
 *   node tools/sync-vault.mjs --check        exit 1 if vault-data.js is stale
 *
 * No dependencies. Node 18+.
 */

import { readFileSync, existsSync } from "node:fs";
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const OUT_FILE = path.join(ROOT, "vault-data.js");
const SCHEMA = 1;

/* ------------------------------------------------------------------ */
/* Arguments                                                           */
/* ------------------------------------------------------------------ */

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const value = (name, fallback = null) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

const WATCH = flag("--watch");
const CHECK = flag("--check");
const EXPLICIT_VAULT = value("--vault");

/* ------------------------------------------------------------------ */
/* Vault discovery                                                     */
/* ------------------------------------------------------------------ */

function vaultFromObsidianRegistry() {
  const appData = process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming");
  const registry = path.join(appData, "obsidian", "obsidian.json");
  if (!existsSync(registry)) return null;
  try {
    const parsed = JSON.parse(readFileSync(registry, "utf8"));
    const vaults = Object.values(parsed.vaults || {});
    const match = vaults.find((entry) => /naval/i.test(entry.path || ""));
    return match ? match.path : null;
  } catch {
    return null;
  }
}

function resolveVault() {
  const candidates = [
    EXPLICIT_VAULT,
    process.env.NAVALVAULT,
    vaultFromObsidianRegistry(),
    path.join(os.homedir(), "Documents", "Unreal Projects", "NavalFireVR", "NavalVault")
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (existsSync(candidate) && existsSync(path.join(candidate, ".obsidian"))) return candidate;
  }
  throw new Error(
    "Could not find the vault. Pass --vault \"C:\\...\\NavalVault\" or set NAVALVAULT."
  );
}

/* ------------------------------------------------------------------ */
/* Parsing                                                             */
/* ------------------------------------------------------------------ */

const SKIP_DIRS = new Set([".obsidian", ".git", ".trash", "node_modules"]);

function slugify(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitFrontmatter(text) {
  const normalised = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  if (!normalised.startsWith("---\n")) return { data: {}, body: normalised };

  const end = normalised.indexOf("\n---", 3);
  if (end === -1) return { data: {}, body: normalised };

  const block = normalised.slice(4, end);
  const body = normalised.slice(end + 4).replace(/^\n+/, "");
  const data = {};

  for (const rawLine of block.split("\n")) {
    const line = rawLine.trimEnd();
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    const key = match[1];
    let raw = match[2].trim();

    if (!raw) {
      data[key] = "";
    } else if (raw.startsWith("[") && raw.endsWith("]")) {
      data[key] = raw
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      raw = raw.replace(/^["']|["']$/g, "");
      data[key] = raw;
    }
  }

  return { data, body };
}

function firstHeading(body) {
  const match = body.match(/^#{1,2}\s+(.+)$/m);
  return match ? match[1].replace(/\s+#+\s*$/, "").trim() : null;
}

function excerptOf(body) {
  const lines = body.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^#{1,6}\s/.test(trimmed)) continue;
    if (/^[-*+]\s/.test(trimmed)) continue;
    if (/^\d+[.)]\s/.test(trimmed)) continue;
    if (trimmed.startsWith("|")) continue;
    if (trimmed.startsWith(">")) continue;
    if (trimmed.startsWith("```")) continue;
    if (trimmed.startsWith("---")) continue;
    const plain = trimmed
      .replace(/\[\[([^\]|]+)(\|[^\]]+)?\]\]/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`>#]/g, "")
      .trim();
    if (plain.length < 3) continue;
    return plain.length > 180 ? `${plain.slice(0, 177)}…` : plain;
  }
  return "";
}

function wikiTargets(body) {
  const targets = new Set();
  const pattern = /\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g;
  let match;
  while ((match = pattern.exec(body))) {
    const target = match[1].trim();
    if (target) targets.add(target);
  }
  return [...targets];
}

async function walk(dir, vaultRoot) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name) || entry.name.startsWith(".")) continue;
      files.push(...(await walk(path.join(dir, entry.name), vaultRoot)));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

/* ------------------------------------------------------------------ */
/* Build                                                               */
/* ------------------------------------------------------------------ */

async function build() {
  const vaultRoot = resolveVault();
  const files = (await walk(vaultRoot, vaultRoot)).sort();
  const usedSlugs = new Map();
  const notes = [];

  for (const file of files) {
    const raw = await readFile(file, "utf8");
    const { data, body } = splitFrontmatter(raw);
    const relative = path.relative(vaultRoot, file).replace(/\\/g, "/");
    const basename = path.basename(file, path.extname(file));
    const title = firstHeading(body) || basename;
    const folder = path.dirname(relative) === "." ? "" : path.dirname(relative);

    let slug = slugify(basename);
    if (!slug) slug = "note";
    if (usedSlugs.has(slug)) {
      const count = usedSlugs.get(slug) + 1;
      usedSlugs.set(slug, count);
      slug = `${slug}-${count}`;
    } else {
      usedSlugs.set(slug, 1);
    }

    const tags = Array.isArray(data.tags)
      ? data.tags
      : typeof data.tags === "string" && data.tags
      ? data.tags.split(/[,\s]+/).filter(Boolean)
      : [];

    const updated =
      (typeof data.updated === "string" && data.updated) ||
      (typeof data.date === "string" && data.date) ||
      "";

    notes.push({
      slug,
      file: basename,
      title,
      folder,
      tags,
      updated,
      excerpt: excerptOf(body),
      body,
      wiki: wikiTargets(body),
      links: [],
      backlinks: []
    });
  }

  /* Resolve wikilinks by file name, falling back to the title. */
  const byFile = new Map(notes.map((note) => [note.file.toLowerCase(), note.slug]));
  const byTitle = new Map(notes.map((note) => [note.title.toLowerCase(), note.slug]));

  for (const note of notes) {
    const resolved = new Set();
    for (const target of note.wiki) {
      const key = target.toLowerCase();
      const slug = byFile.get(key) || byTitle.get(key);
      if (slug && slug !== note.slug) resolved.add(slug);
    }
    note.links = [...resolved];
    delete note.wiki;
  }

  const bySlug = new Map(notes.map((note) => [note.slug, note]));
  for (const note of notes) {
    for (const target of note.links) {
      const targetNote = bySlug.get(target);
      if (targetNote && !targetNote.backlinks.includes(note.slug)) targetNote.backlinks.push(note.slug);
    }
  }

  const order = (a, b) =>
    (b.updated || "").localeCompare(a.updated || "") || a.title.localeCompare(b.title);
  notes.sort(order);

  const tagCounts = {};
  for (const note of notes) {
    for (const tag of note.tags) tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  }

  return {
    schema: SCHEMA,
    generatedAt: new Date().toISOString(),
    vaultName: path.basename(vaultRoot),
    noteCount: notes.length,
    tags: Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag, count]) => ({ tag, count })),
    notes
  };
}

/* ------------------------------------------------------------------ */
/* Output                                                              */
/* ------------------------------------------------------------------ */

function render(payload) {
  return `/* Generated by tools/sync-vault.mjs — do not edit by hand.
 * Source: Obsidian vault "${payload.vaultName}" · ${payload.noteCount} notes
 * Regenerate with: tools\\sync-vault.ps1
 */
window.VAULT_DATA = ${JSON.stringify(payload, null, 2)};
`;
}

async function run() {
  const payload = await build();
  const output = render(payload);

  if (CHECK) {
    const current = existsSync(OUT_FILE) ? await readFile(OUT_FILE, "utf8") : "";
    const strip = (text) => text.replace(/"generatedAt": "[^"]*"/, "");
    if (strip(current) !== strip(output)) {
      console.error("vault-data.js is out of date — run tools\\sync-vault.ps1");
      process.exitCode = 1;
      return false;
    }
    console.log("vault-data.js is up to date.");
    return false;
  }

  await writeFile(OUT_FILE, output, "utf8");
  const stamp = new Date(payload.generatedAt).toLocaleTimeString();
  console.log(
    `[${stamp}] ${payload.noteCount} notes exported from "${payload.vaultName}" → vault-data.js (${Math.round(
      output.length / 1024
    )} KB)`
  );
  return true;
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

if (WATCH) {
  const vaultRoot = resolveVault();
  console.log(`Watching "${vaultRoot}" for changes. Ctrl+C to stop.`);
  await run();
  let timer = null;
  let watching = true;
  const { watch } = await import("node:fs");
  watch(vaultRoot, { recursive: true }, (_event, filename) => {
    if (!filename || !String(filename).toLowerCase().endsWith(".md")) return;
    if (String(filename).includes(".obsidian")) return;
    clearTimeout(timer);
    timer = setTimeout(() => run().catch((error) => console.error(error.message)), 400);
  });
  process.on("SIGINT", () => {
    watching = false;
    console.log("\nStopped watching.");
    process.exit(0);
  });
  if (!watching) process.exit(0);
} else {
  try {
    await run();
  } catch (error) {
    console.error(`Sync failed: ${error.message}`);
    process.exitCode = 1;
  }
}
