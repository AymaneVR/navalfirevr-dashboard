# NavalFireVR — Project Control Room

A single-page project dashboard for the **NavalFireVR** Unreal Engine VR project. It keeps the
project's recorded state in one place: roadmap progress, environment checks, the four equipment
lockers, VR interaction planning, the graphics/headset investigation, and a reusable Codex task
tracker.

Everything is editable, and every edit is saved in the browser automatically.

## UI/UX standard (installed)

All UI work on this site follows the **UI UX Pro Max** design-intelligence skill
([nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill),
MIT licensed). It is installed at the workspace Agent-Standard location:

```
..\skills\ui-ux-pro-max\        clone of the skill repo (source of truth)
..\.agents\skills\ui-ux-pro-max  installed skill + companions
```

- **Baseline design system:** `design-system/navalfirevr/MASTER.md` (persisted by the skill).
- **Established identity wins:** the site's existing navy/teal/amber control-room look
  (`styles.css` `:root` tokens) takes precedence over anything the generator suggests.
- **Usage:** for any UI/UX task, run the skill's search engine, e.g.
  `python ..\skills\ui-ux-pro-max\src\ui-ux-pro-max\scripts\search.py "<query>" --design-system`
  or `--domain ux`, then honour the pre-delivery checklist before shipping UI.

## Running it

No build step, no dependencies, no server required:

- **Double-click `index.html`**, or
- open it from a terminal:

```powershell
start index.html
```

To serve it over HTTP instead (recommended if your browser restricts `file://` storage):

```powershell
python -m http.server 8000
# then open http://localhost:8000
```

## What is in it

| Section | Purpose |
| --- | --- |
| **Overview** | Roadmap progress, environment status, the four lockers, the interaction board, the headset comparison, and the highest-priority open tasks. |
| **Roadmap** | Six milestones in sequence, each with an editable status, priority, target date, and notes. |
| **Environment** | Checklist of ship and scenario work, separating recorded work from work that still needs verification. |
| **Equipment lockers** | TPB, TIS, TISA, and ARI tracked separately, each with its own inventory and known limitations. |
| **VR interactions** | Planning board grouped by status: Planned, Designing, Ready to implement, In progress, Done. |
| **Graphics & headset** | Desktop checks, standalone checks, future VR evaluation, and the headset/deployment/budget comparison. |
| **Codex tasks** | Reusable task tracker with search, filters, sorting, and a detail editor. |
| **Completion plan** | The 10-phase, 59-task route to finishing the project: 42 role × fire-class scenarios, player-led AI équipes, an interactive 42-cell scenario matrix, and a definition of done. |
| **Project gallery** | Real captures from the Unreal build — main menu, ten ship compartments, fire-equipment room and bow — with captions, tag filters and a lightbox. |
| **Vault notes** | Every note from the `NavalVault` Obsidian vault, searchable, with rendered Markdown, wikilinks, backlinks, and an "Open in Obsidian" link. |

### Deliberate caveats

The dashboard distinguishes **recorded** work from **verified** work, and it does not overstate
progress:

- Headset, deployment mode, and performance budget are **Undecided / Not set** until you change them.
- The interaction board holds **planning cards**, not implemented Unreal features.
- Items marked *Applied but not verified* stay visibly marked that way.
- Locker item names are placeholders — rename them to match the actual actors.

## Saving, exporting, and resetting

- **Automatic:** changes are written to `localStorage` under `navalfirevr.controlroom.v1`.
- **Export:** downloads the current state as JSON.
- **Import:** loads a previously exported JSON file.
- **Reset:** restores the seed state recorded in `data.js`.

If browser storage is unavailable (some `file://` configurations), the dashboard falls back to
in-memory state for the session and says so in the sidebar under **STORAGE**.

## Vault sync (Obsidian)

The **Vault notes** page mirrors the `NavalVault` Obsidian vault. The site is static, so it
cannot read Obsidian at runtime; a script exports the vault to `vault-data.js`, which is
committed and served like any other asset.

```bat
:: Export the vault (finds it automatically via Obsidian's vault registry)
tools\sync-vault.cmd

:: Export, then commit and push so the live site updates
tools\sync-vault.cmd --publish

:: Re-export automatically whenever a note is saved in Obsidian
tools\sync-vault.cmd --watch

:: Point at a different vault
tools\sync-vault.cmd --vault "D:\Notes\NavalVault"
```

`sync-vault.cmd` works regardless of PowerShell's execution policy. If you prefer PowerShell
and local scripts are blocked, run it as:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\sync-vault.ps1 -Publish
```

The export is idempotent: if no note changed, `vault-data.js` is left alone and nothing is
committed.

What gets exported per note: title, folder, tags, `updated` date, excerpt, full Markdown body,
resolved wikilinks, and backlinks. `.obsidian/`, `.git/`, and other dot-folders are skipped.

Notes that are added, edited, or deleted in the vault appear on the site after the next sync —
no code changes needed. Wikilinks (`[[Note]]`) become in-site links, and each note has an
**Open in Obsidian** link that uses the `obsidian://` URI.

`vault-data.js` is generated — do not edit it by hand.

## Editing the seed state

`data.js` holds `SEED`, the recorded project state. It is used on first load and by **Reset**.
Statuses and priorities must come from the allowed lists defined at the top of `app.js`.

## Files

```
index.html      page shell, sidebar, top bar
styles.css      all styling (navy command sidebar, pale workspace, teal/amber accents)
data.js         seed project state
app.js          rendering, editing, persistence, import/export, Markdown renderer
vault-data.js   generated vault export (do not edit by hand)
tools/
  sync-vault.cmd   wrapper: works without execution-policy changes
  sync-vault.ps1   PowerShell wrapper (thin)
  sync-vault.mjs   Obsidian vault → vault-data.js exporter, publisher, watcher
```

## Deploying

The site is static, so GitHub Pages works directly: **Settings → Pages → Deploy from a branch →
`main` / root**.
