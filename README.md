# NavalFireVR — Project Control Room

A single-page project dashboard for the **NavalFireVR** Unreal Engine VR project. It keeps the
project's recorded state in one place: roadmap progress, environment checks, the four equipment
lockers, VR interaction planning, the graphics/headset investigation, and a reusable Codex task
tracker.

Everything is editable, and every edit is saved in the browser automatically.

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

## Editing the seed state

`data.js` holds `SEED`, the recorded project state. It is used on first load and by **Reset**.
Statuses and priorities must come from the allowed lists defined at the top of `app.js`.

## Files

```
index.html    page shell, sidebar, top bar
styles.css    all styling (navy command sidebar, pale workspace, teal/amber accents)
data.js       seed project state
app.js        rendering, editing, persistence, import/export
```

## Deploying

The site is static, so GitHub Pages works directly: **Settings → Pages → Deploy from a branch →
`main` / root**.
