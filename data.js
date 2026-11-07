/* NavalFireVR — Project Control Room
 * Seed state. This is the recorded project state as it stands today.
 * Everything here is editable in the UI; "Reset to seed" restores these values.
 * Statuses and priorities must be one of the constants listed in app.js.
 */

const SEED = {
  meta: {
    project: "NavalFireVR",
    subtitle: "Project control room",
    seeded: "2026-11-07",
    schema: 1
  },

  /* Open decisions. These stay "Undecided" until the project owner changes them. */
  decisions: {
    headset: {
      label: "Headset",
      value: "Undecided",
      note: "PC VR and standalone headsets both remain candidates. Decide after the readability and comfort pass."
    },
    deployment: {
      label: "Deployment mode",
      value: "Undecided",
      note: "PC VR and standalone deployment both remain open. Profile a standalone build before choosing."
    },
    perfBudget: {
      label: "Performance budget",
      value: "Not set",
      note: "Profile Play and a standalone build before setting a performance budget. This is a constraint, not a target."
    }
  },

  /* 1. Project roadmap ---------------------------------------------------- */
  milestones: [
    {
      id: "ms-menu",
      title: "Menu and scenario routing",
      status: "Done",
      priority: "High",
      target: "",
      notes: "Recorded as implemented. Role and fire scenario menus route into the matching scenario map.",
      constraint: ""
    },
    {
      id: "ms-ship",
      title: "Expanded ship and first drill",
      status: "Done",
      priority: "High",
      target: "",
      notes: "Recorded as the current playable slice: expanded ship environment with the kitchen drill.",
      constraint: ""
    },
    {
      id: "ms-lockers",
      title: "Equipment locker integration",
      status: "In progress",
      priority: "High",
      target: "",
      notes: "Lockers and equipment actors placed and saved, labels updated for readability. Pickup and equip interactions still to plan.",
      constraint: "No Play/VR test of the repaired locker installation is recorded yet."
    },
    {
      id: "ms-vr-pass",
      title: "VR interaction pass",
      status: "Planned",
      priority: "High",
      target: "",
      notes: "Interaction pass over lockers, doors, ventilation controls, thermal camera, protective equipment, and reporting.",
      constraint: "Planning examples on the board are not claims that interactions already exist in Unreal."
    },
    {
      id: "ms-graphics",
      title: "Graphics, performance, and headset evaluation",
      status: "Planned",
      priority: "Normal",
      target: "",
      notes: "Desktop/Play review first, then a standalone build profile. Headset readability remains unverified.",
      constraint: "Do not set a performance budget before profiling both Play and a standalone build."
    },
    {
      id: "ms-deployment",
      title: "Deployment decision",
      status: "Not started",
      priority: "High",
      target: "",
      notes: "Choose between PC VR and standalone deployment once the performance profile exists.",
      constraint: "Deployment mode: Undecided."
    }
  ],

  /* 2. Environment checklist ---------------------------------------------- */
  environment: [
    {
      id: "env-maps",
      title: "Separate scenario maps",
      status: "Done",
      verification: "Applied",
      notes: "Exercises can be loaded individually rather than sharing one map."
    },
    {
      id: "env-menus",
      title: "Role and fire scenario menu routing",
      status: "Done",
      verification: "Applied",
      notes: "Menus route to the matching scenario map."
    },
    {
      id: "env-french",
      title: "French in-game guidance",
      status: "Done",
      verification: "Applied — headset readability unverified",
      notes: "Guidance text is in French. Readability in a headset has not been checked."
    },
    {
      id: "env-signage",
      title: "Ship signage and readable labels",
      status: "Done",
      verification: "Applied",
      notes: "Labels updated for readability during the locker pass."
    },
    {
      id: "env-realism",
      title: "Whole-ship environment realism pass",
      status: "Needs verification",
      verification: "Applied but not verified",
      notes: "Recorded as applied across the ship. Still needs a walkthrough in Play and in VR.",
      flag: "unverified"
    },
    {
      id: "env-drill",
      title: "Existing expanded ship and kitchen drill",
      status: "Done",
      verification: "Applied",
      notes: "The current playable slice."
    },
    {
      id: "env-perf",
      title: "Play, VR, and frame-rate verification",
      status: "Not started",
      verification: "Not run",
      notes: "No Play or VR performance check is recorded. Blocked until a test session is run.",
      flag: "unverified"
    }
  ],

  /* 3. Equipment lockers --------------------------------------------------- */
  lockers: [
    {
      id: "lk-tpb",
      code: "TPB",
      state: "Placed and saved",
      note: "LOCAL INCENDIE, aft starboard, green band. Wardrobe actors placed and saved; 7 equipment items labelled.",
      limitation: "Pickup and equip interactions remain future work. No Play/VR test of the repaired installation is recorded, so readiness stays Unknown.",
      items: [
        { id: "tpb-1", name: "Combinaison SERGE thermostable", qty: "1", readiness: "Unknown", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tpb-2", name: "Ceinture et pochette", qty: "1", readiness: "Unknown", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tpb-3", name: "Gants", qty: "1 paire", readiness: "Unknown", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tpb-4", name: "Cagoule", qty: "1", readiness: "Unknown", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tpb-5", name: "Lunettes de protection", qty: "1", readiness: "Unknown", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tpb-6", name: "Chaussettes ignifugées", qty: "1 paire", readiness: "Unknown", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tpb-7", name: "Brassard de couleur", qty: "1", readiness: "Unknown", interaction: "Pending", priority: "Normal", notes: "" }
      ]
    },
    {
      id: "lk-tis",
      code: "TIS",
      state: "Placed and saved",
      note: "LOCAL INCENDIE, aft starboard, red band. Wardrobe actors placed and saved; 6 equipment items labelled.",
      limitation: "Pickup and equip interactions remain future work. No Play/VR test of the repaired installation is recorded, so readiness stays Unknown.",
      items: [
        { id: "tis-1", name: "Veste de feu", qty: "1", readiness: "Unknown", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tis-2", name: "Pantalon de feu", qty: "1", readiness: "Unknown", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tis-3", name: "Cagoule", qty: "1", readiness: "Unknown", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tis-4", name: "Gants de feu", qty: "1 paire", readiness: "Unknown", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tis-5", name: "Casque F1 à visière", qty: "1", readiness: "Unknown", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tis-6", name: "Bottes de feu", qty: "1 paire", readiness: "Unknown", interaction: "Pending", priority: "Normal", notes: "" }
      ]
    },
    {
      id: "lk-tisa",
      code: "TISA",
      state: "Placed and saved",
      note: "LOCAL INCENDIE, aft starboard, navy blue band. Wardrobe actors placed and saved; 4 equipment items labelled.",
      limitation: "Pickup and equip interactions remain future work. No Play/VR test of the repaired installation is recorded, so readiness stays Unknown.",
      items: [
        { id: "tisa-1", name: "Tenue d'intervention aviation", qty: "1", readiness: "Unknown", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tisa-2", name: "Casque à visière", qty: "1", readiness: "Unknown", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tisa-3", name: "Gants", qty: "1 paire", readiness: "Unknown", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tisa-4", name: "Protection respiratoire", qty: "1", readiness: "Unknown", interaction: "Pending", priority: "Normal", notes: "" }
      ]
    },
    {
      id: "lk-ari",
      code: "ARI",
      state: "Placed and saved",
      note: "LOCAL INCENDIE, aft starboard, petrol blue band. Wardrobe actors placed and saved; 4 equipment items labelled.",
      limitation: "Pickup and equip interactions remain future work. No Play/VR test of the repaired installation is recorded, so readiness stays Unknown.",
      items: [
        { id: "ari-1", name: "Harnais et bouteille (ARICO)", qty: "1", readiness: "Unknown", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "ari-2", name: "Pièce faciale", qty: "1", readiness: "Unknown", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "ari-3", name: "Appareil porté, contrôle croisé", qty: "1", readiness: "Unknown", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "ari-4", name: "ARICF — circuit fermé", qty: "1", readiness: "Unknown", interaction: "Pending", priority: "Normal", notes: "" }
      ]
    }
  ],

  /* 4. VR interaction-planning board --------------------------------------- */
  interactions: [
    {
      id: "ix-cylinder",
      title: "Pick up and stow a cylinder",
      action: "Grip, lift, carry, and stow a cylinder in its rack.",
      role: "Firefighting team",
      scenario: "Locker and stowage",
      status: "Planned",
      priority: "High",
      notes: "Needs a grab pose that works with both controller styles.",
      dependencies: "Locker integration"
    },
    {
      id: "ix-doors",
      title: "Interact with doors and ventilation controls",
      action: "Open, close, and latch doors; operate ventilation dampers.",
      role: "Any",
      scenario: "Whole ship",
      status: "Designing",
      priority: "High",
      notes: "Ventilation state should visibly affect smoke behaviour later.",
      dependencies: "Environment realism pass"
    },
    {
      id: "ix-thermal",
      title: "Use a thermal camera",
      action: "Pick up the camera, raise it, and read a heat overlay.",
      role: "Firefighting team",
      scenario: "Fire scenario",
      status: "Planned",
      priority: "Normal",
      notes: "Overlay must stay readable in a headset without causing discomfort.",
      dependencies: "Graphics pass"
    },
    {
      id: "ix-ppe",
      title: "Equip or remove protective equipment",
      action: "Take gear from a locker and equip it to the player body.",
      role: "Any",
      scenario: "Locker and stowage",
      status: "Designing",
      priority: "High",
      notes: "Decide between snap-on slots and free-form attach.",
      dependencies: "Locker integration"
    },
    {
      id: "ix-tools",
      title: "Select and operate firefighting equipment",
      action: "Choose a nozzle or extinguisher and operate it.",
      role: "Firefighting team",
      scenario: "Fire scenario",
      status: "Planned",
      priority: "High",
      notes: "Selection feedback should be unambiguous in VR.",
      dependencies: "VR interaction pass"
    },
    {
      id: "ix-report",
      title: "Record a report or handoff between roles",
      action: "Log a short report and hand it to the next role.",
      role: "Team leader",
      scenario: "Debrief and handoff",
      status: "Ready to implement",
      priority: "Normal",
      notes: "Keep the report short enough to fill in while wearing a headset.",
      dependencies: "UI text readability"
    }
  ],

  /* 5. Graphics and headset comparison ------------------------------------- */
  graphics: {
    groups: [
      {
        id: "gr-desktop",
        title: "Desktop / Play checks",
        note: "Content, interaction, and visual review outside VR.",
        items: [
          { id: "gr-d1", title: "Content review", status: "In progress", notes: "Walk the ship and confirm scenario content." },
          { id: "gr-d2", title: "Interaction review", status: "Planned", notes: "Confirm lockers and equipment actors behave as saved." },
          { id: "gr-d3", title: "Visual review", status: "Planned", notes: "Check signage, lighting, and readability on a monitor." }
        ]
      },
      {
        id: "gr-standalone",
        title: "Standalone build checks",
        note: "Build verification and performance observation.",
        items: [
          { id: "gr-s1", title: "Build verification", status: "Not started", notes: "Confirm a standalone build packages and launches." },
          { id: "gr-s2", title: "Performance observation", status: "Not started", notes: "Record frame timing before setting any budget." }
        ]
      },
      {
        id: "gr-vr",
        title: "Future VR evaluation",
        note: "Headset readability, comfort, frame rate, and stability.",
        items: [
          { id: "gr-v1", title: "Headset readability", status: "Not started", notes: "French guidance and signage still unverified in a headset." },
          { id: "gr-v2", title: "Interaction comfort", status: "Not started", notes: "Check reach, grab distances, and locomotion." },
          { id: "gr-v3", title: "Frame rate", status: "Not started", notes: "Measure per-scenario frame rate in VR." },
          { id: "gr-v4", title: "Stability", status: "Not started", notes: "Long-run sessions without crashes or drift." }
        ]
      }
    ],
    comparison: {
      headset: "Undecided",
      deployment: "Undecided",
      budget: "Not set",
      targetUse: "",
      visualQuality: "",
      performance: "",
      openQuestions: "Which headset to evaluate first, and whether standalone quality is acceptable for the fire scenarios.",
      constraint: "Profile Play and a standalone build before setting a performance budget."
    }
  },

  /* 6. Codex task tracker --------------------------------------------------- */
  tasks: [
    {
      id: "tk-verify-lockers",
      title: "Verify locker interactions in Play and VR",
      description: "Lockers and equipment actors are placed and saved, but pickup and equip interactions are untested.",
      status: "Ready for review",
      priority: "High",
      area: "Lockers",
      milestone: "Equipment locker integration",
      verification: "Prepared but not run in Unreal",
      owner: "",
      target: "",
      notes: "Test order: open locker, read labels, pick up one item per locker, stow it back."
    },
    {
      id: "tk-perf",
      title: "Run Play and VR performance checks",
      description: "Capture frame rate and stability in Play and in a headset for the kitchen drill slice.",
      status: "Planned",
      priority: "High",
      area: "Performance",
      milestone: "Graphics, performance, and headset evaluation",
      verification: "Not run",
      owner: "",
      target: "",
      notes: "Record numbers before any budget is proposed."
    },
    {
      id: "tk-budget",
      title: "Set performance budget after profiling",
      description: "Only set a frame budget once Play and standalone profiles exist.",
      status: "Backlog",
      priority: "Normal",
      area: "Performance",
      milestone: "Deployment decision",
      verification: "Blocked by profiling",
      owner: "",
      target: "",
      notes: "Depends on the Play and standalone performance checks."
    },
    {
      id: "tk-french",
      title: "Check French guidance readability in headset",
      description: "Guidance text is in French and applied, but headset readability has not been tested.",
      status: "Backlog",
      priority: "Normal",
      area: "Content",
      milestone: "VR interaction pass",
      verification: "Applied but not tested",
      owner: "",
      target: "",
      notes: "Check at the intended viewing distance, not just in the editor."
    },
    {
      id: "tk-pickup",
      title: "Plan pickup and equip interaction for lockers",
      description: "Decide the interaction model for taking gear from a locker and equipping it.",
      status: "In progress",
      priority: "High",
      area: "Interaction",
      milestone: "VR interaction pass",
      verification: "Design only",
      owner: "",
      target: "",
      notes: "Compare snap-on slots against free-form attach, then pick one for the pass."
    },
    {
      id: "tk-headset",
      title: "Confirm headset choice",
      description: "Decide which headset the project targets for evaluation.",
      status: "Backlog",
      priority: "Urgent",
      area: "Decision",
      milestone: "Deployment decision",
      verification: "Undecided",
      owner: "",
      target: "",
      notes: "Keep as Undecided until readability and comfort are measured."
    },
    {
      id: "tk-deploy",
      title: "Confirm deployment mode",
      description: "Choose PC VR or standalone once the performance profile is in.",
      status: "Backlog",
      priority: "Urgent",
      area: "Decision",
      milestone: "Deployment decision",
      verification: "Undecided",
      owner: "",
      target: "",
      notes: "Depends on the standalone performance observation."
    }
  ],

  /* 7. Completion plan ------------------------------------------------------ */
  plan: {
    goal:
      "Ship NavalFireVR with a complete fire-suppression scenario in every one of the 42 role × fire-class routes: " +
      "the player is the leader of a three-person équipe working beside AI teammates, with DDL and DDI as single AI " +
      "directors, and every behaviour traceable to the French safety lectures.",

    definitionOfDone: [
      "All 42 routes play a complete scenario end to end: alarm, attack, confinement, report, suppression, recovery, debrief.",
      "The player leads a three-person équipe; the other équipes are three-person AI squads; DDL and DDI are single AI directors.",
      "Each role's duties match the source decks, cited by lecture and slide.",
      "Correct and incorrect agent choices behave differently, per fire class.",
      "Every scenario ends in a debrief that scores the events that actually happened.",
      "The build holds its frame budget in Play and in a headset, with signage readable."
    ],

    phases: [
      {
        id: "p0",
        title: "Scenario engine",
        summary: "One data-driven backbone so 42 routes share code instead of 42 hand-built levels.",
        tasks: [
          { id: "p0-1", title: "Scenario data asset per route", detail: "Fire class, ignition point, objectives, allowed agents, crew and timings in one asset per route.", status: "Not started", area: "Engine", source: "L2 s17" },
          { id: "p0-2", title: "Objective event bus", detail: "Record alarm, doors/ventilation, power isolation, agent choice, reports, crew accountability, suppression, reignition, recovery.", status: "Not started", area: "Engine", source: "Roles note" },
          { id: "p0-3", title: "Timing gates", detail: "Arrival ≤2 min, attack engaged ≤5 min, hoses under pressure ≤3 min, protection ≤10 min, cube closed ≤20 min.", status: "Not started", area: "Engine", source: "L2 s17, s23–25" },
          { id: "p0-4", title: "Compartment plan model", detail: "Rooms, boundaries, doors, vents and CRIME symbols as data that both the UI and the AI read.", status: "Not started", area: "Engine", source: "L2 s19–20, L3 s25" },
          { id: "p0-5", title: "Debrief event stream", detail: "Persist the recorded events and replay them as a timeline with role-specific scoring.", status: "Not started", area: "Engine", source: "L2 s17" },
          { id: "p0-6", title: "42-route registry", detail: "Drive the routes from MENU_ROUTES.json instead of hand-wired level references.", status: "Not started", area: "Scenarios", source: "MENU_ROUTES.json" }
        ]
      },
      {
        id: "p1",
        title: "Fire behaviour and extinguishing agents",
        summary: "The simulation is only as accurate as its fire classes and its agent rules.",
        tasks: [
          { id: "p1-1", title: "Class behaviours A / B / C / D / F / HC", detail: "Data-driven growth, heat output and smoke per class instead of one generic fire.", status: "Not started", area: "Fire", source: "L1 s7–23; L3 s20" },
          { id: "p1-2", title: "Convert the galley fire to true Class F", detail: "The menu says Classe F but the drill is an electrical appliance fire. Implement cooking-oil behaviour.", status: "Planned", area: "Fire", source: "L3 s20; TODO note" },
          { id: "p1-3", title: "Agent-to-class match matrix", detail: "Water+additive → A, foam → B, CO2 → electrical/C, powder → D, wet chemical → F, and the consequences of choosing wrong.", status: "Not started", area: "Fire", source: "L3 s20" },
          { id: "p1-4", title: "CO2 restrictions", detail: "Prohibited on class D, not recommended on class A, asphyxiation risk below 17 % oxygen.", status: "Not started", area: "Fire", source: "L3 s15–16" },
          { id: "p1-5", title: "Suppression model", detail: "Cooling, smothering, isolation and inhibition as distinct effects, not a single damage number.", status: "Not started", area: "Fire", source: "L3 s4" },
          { id: "p1-6", title: "Reignition and recovery", detail: "Reignition while hot; recovery phase with checks before the scenario can be closed.", status: "Not started", area: "Fire", source: "L2 s16–17" }
        ]
      },
      {
        id: "p2",
        title: "Smoke and compartmentation",
        summary: "Confinement and smoke management drive the whole tactic.",
        tasks: [
          { id: "p2-1", title: "Smoke generation and propagation", detail: "Smoke volume and layer growth driven by fire class and size.", status: "Not started", area: "Ship", source: "L3 s27" },
          { id: "p2-2", title: "Confinement chain", detail: "Closing doors, panels and coupe-fumée curtains visibly slows smoke spread.", status: "Not started", area: "Ship", source: "L2 s16" },
          { id: "p2-3", title: "Désenfumage of access routes", detail: "Balayage technique and extraction outlet, run as its own phase after the attack.", status: "Not started", area: "Ship", source: "L3 s27" },
          { id: "p2-4", title: "Extinguishing water", detail: "Run-off accumulates, affects stability and must be drained by the protection team.", status: "Not started", area: "Ship", source: "L2 s24" }
        ]
      },
      {
        id: "p3",
        title: "Crew structure and AI teammates",
        summary: "Player-led three-person squads, single-person DDL and DDI, and the duties each one owes the others.",
        tasks: [
          { id: "p3-1", title: "Team framework", detail: "Three-person squads; the player is one of the three and the leader; DDL and DDI exist once each.", status: "Not started", area: "AI", source: "User spec + L2 s19–27" },
          { id: "p3-2", title: "Teammate basics", detail: "Follow, hold position, carry equipment, operate a tool, hand over — the verbs every squad needs.", status: "Not started", area: "AI", source: "L2 s23" },
          { id: "p3-3", title: "Orders and radio protocol", detail: "French orders and concise reports up and down the chain, with acknowledgement.", status: "Not started", area: "AI", source: "L2 s19–20" },
          { id: "p3-4", title: "Reliefs and ARI autonomy", detail: "Teams rotate before their breathing apparatus runs out; the ARI manager tracks who is inside.", status: "Not started", area: "AI", source: "L2 s22, s26" },
          { id: "p3-5", title: "AI DDL", detail: "Holds the compartment plan, keeps situation awareness, issues directives, calls reinforcements.", status: "Not started", area: "AI", source: "L2 s19" },
          { id: "p3-6", title: "AI DDI", detail: "Chooses the tactic, positions teams, enforces discipline, reports to the DDL in under 5 minutes.", status: "Not started", area: "AI", source: "L2 s20" },
          { id: "p3-7", title: "AI équipe d'alarme", detail: "Fast muster, first relief for the attack group, equipment supply, tracks the action on a plan.", status: "Not started", area: "AI", source: "L2 s21" },
          { id: "p3-8", title: "AI groupe de protection", detail: "Runs hoses, protects boundaries, closes the cube, drains extinguishing water.", status: "Not started", area: "AI", source: "L2 s24" },
          { id: "p3-9", title: "AI groupe de soutien", detail: "Cuts power and ventilation, verifies confinement, clears smoke from access routes.", status: "Not started", area: "AI", source: "L2 s25" },
          { id: "p3-10", title: "AI équipe médicale", detail: "Triage, extraction and handover; ties into the casualty event from the attack group.", status: "Not started", area: "AI", source: "L2 s23, s27" },
          { id: "p3-11", title: "Ship navigation mesh", detail: "AI pathing through doors, hatches and ladders with the same constraints as the player.", status: "Not started", area: "AI", source: "Ship maps" }
        ]
      },
      {
        id: "p4",
        title: "The seven roles and the 42 scenarios",
        summary: "Each role gets its own objectives inside a scenario, not just a label on a route.",
        tasks: [
          { id: "p4-1", title: "Objectives for the five squad-leader roles", detail: "Attaque, protection, soutien, alarme and médicale each get their own goal set and interaction flow.", status: "Not started", area: "Scenarios", source: "L2 s21–25" },
          { id: "p4-2", title: "DDL objectives", detail: "Read the situation, hold the plan, decide, prioritise, feed vital information to the teams.", status: "Not started", area: "Scenarios", source: "L2 s19" },
          { id: "p4-3", title: "DDI objectives", detail: "Pick the tactic, place the teams, keep the timing, report up the chain.", status: "Not started", area: "Scenarios", source: "L2 s20" },
          { id: "p4-4", title: "Wire the 41 empty routes", detail: "Each empty route map loads a real scenario instead of the shared ship with no fire.", status: "Not started", area: "Scenarios", source: "All 42 Worlds" },
          { id: "p4-5", title: "Per-scenario French briefing", detail: "Role, fire class, compartment, learning objectives and the expected sequence.", status: "Not started", area: "Scenarios", source: "L2 s17" },
          { id: "p4-6", title: "Per-route acceptance test", detail: "One passing check per route: objectives fire, timings record, debrief scores.", status: "Not started", area: "Validation", source: "Definition of done" }
        ]
      },
      {
        id: "p5",
        title: "Ship systems",
        summary: "The environment has to react — doors, vents, power and water are part of the tactic.",
        tasks: [
          { id: "p5-1", title: "Doors, clapets and fire curtains", detail: "Openable and closable, and they actually change smoke and fire spread.", status: "Not started", area: "Ship", source: "L2 s16" },
          { id: "p5-2", title: "Ventilation controls", detail: "Per-zone shutdown, with the support team able to isolate and verify it.", status: "Not started", area: "Ship", source: "L2 s25" },
          { id: "p5-3", title: "Power isolation", detail: "The galley switch already exists; extend it to every compartment and record the event.", status: "Not started", area: "Ship", source: "L2 s25" },
          { id: "p5-4", title: "Boundary and cube definition", detail: "Geometry-driven boundary that the protection team can close and the debrief can score.", status: "Not started", area: "Ship", source: "L2 s24" }
        ]
      },
      {
        id: "p6",
        title: "Equipment and interaction",
        summary: "Everything in the four wardrobes has to become usable, not decorative.",
        tasks: [
          { id: "p6-1", title: "TPB / TIS / TISA wearables", detail: "Equip and remove, with real protection values against heat and smoke.", status: "Not started", area: "Equipment", source: "L3 s22–23" },
          { id: "p6-2", title: "ARI mask and harness", detail: "Wearing it grants air autonomy and puts you on the accountability board.", status: "Not started", area: "Equipment", source: "L3 s24; L2 s26" },
          { id: "p6-3", title: "Thermal camera", detail: "Pick up, raise, read; reveals hot spots the eye cannot see.", status: "Not started", area: "Equipment", source: "L2 s23" },
          { id: "p6-4", title: "Hoses and nozzles", detail: "Deploy, pressurise and aim water or foam, with the protection team's 3-minute target.", status: "Not started", area: "Equipment", source: "L2 s24" },
          { id: "p6-5", title: "Extinguisher agent selection", detail: "Choosing the wrong agent must visibly fail, per the class matrix.", status: "Not started", area: "Equipment", source: "L3 s20" },
          { id: "p6-6", title: "Locker pickup and equip", detail: "Lockers and 21 items are placed and saved; taking an item and equipping it is still future work.", status: "In progress", area: "Equipment", source: "Locker note" },
          { id: "p6-7", title: "Report and handoff", detail: "Record a short report and hand it to the next role, in French, in a headset.", status: "Not started", area: "Equipment", source: "L2 s17" }
        ]
      },
      {
        id: "p7",
        title: "Briefing, guidance and debrief",
        summary: "The three screens that turn a simulation into training.",
        tasks: [
          { id: "p7-1", title: "Briefing and learning objectives screen", detail: "Between menu and level: role, scenario, what will be assessed.", status: "Not started", area: "UX", source: "L2 s17" },
          { id: "p7-2", title: "French guidance per role", detail: "The existing objective guide, extended so each role gets its own next action.", status: "Not started", area: "UX", source: "Objective Guide" },
          { id: "p7-3", title: "Debrief screen", detail: "Event timeline, timings versus the gates, agent choices, role-specific assessment.", status: "Not started", area: "UX", source: "L2 s17–20" },
          { id: "p7-4", title: "DDL / DDI compartment plan UI", detail: "Live plan with CRIME symbology the directors read and update.", status: "Not started", area: "UX", source: "L2 s19–20; L3 s25" }
        ]
      },
      {
        id: "p8",
        title: "Audio and presence",
        summary: "A fire you cannot hear does not feel like a fire.",
        tasks: [
          { id: "p8-1", title: "Core soundscape", detail: "Alarm, orders, radio, fire, water, footsteps — layered by zone.", status: "Not started", area: "Audio", source: "—" },
          { id: "p8-2", title: "Spatial audio in VR", detail: "Directional cues for fire and teammates; occlusion through closed doors.", status: "Not started", area: "Audio", source: "—" }
        ]
      },
      {
        id: "p9",
        title: "Performance and VR",
        summary: "Nothing above counts if it does not hold frame rate in a headset.",
        tasks: [
          { id: "p9-1", title: "Profile Play and a standalone build", detail: "Measure before setting any budget; the stutter is already known.", status: "Planned", area: "Performance", source: "TODO note" },
          { id: "p9-2", title: "Set the performance budget", detail: "Only after profiling both targets.", status: "Not started", area: "Performance", source: "TODO note" },
          { id: "p9-3", title: "Headset readability", detail: "Signage, guidance text and debrief readable in the target headset.", status: "Not started", area: "Performance", source: "Signage note" },
          { id: "p9-4", title: "VR comfort", detail: "Locomotion, grab poses and reach distances validated with a headset on.", status: "Not started", area: "Performance", source: "TODO note" },
          { id: "p9-5", title: "Standalone build and stereo review", detail: "Package, launch, check stereo rendering and stability.", status: "Not started", area: "Performance", source: "TODO note" }
        ]
      },
      {
        id: "p10",
        title: "Validation and accuracy sign-off",
        summary: "Proof that the simulation teaches what the lectures teach.",
        tasks: [
          { id: "p10-1", title: "Curriculum traceability table", detail: "Every scenario behaviour mapped to a lecture deck and slide.", status: "Planned", area: "Validation", source: "L1–L4" },
          { id: "p10-2", title: "Subject-matter review", detail: "Walk the scenarios with someone qualified and record the corrections.", status: "Not started", area: "Validation", source: "—" },
          { id: "p10-3", title: "Playtest matrix", detail: "7 roles × 6 classes actually played, with notes per route.", status: "Not started", area: "Validation", source: "—" },
          { id: "p10-4", title: "Sign-off against the definition of done", detail: "Close the project only when every line above is true.", status: "Not started", area: "Validation", source: "This plan" }
        ]
      }
    ],

    matrix: {
      roles: [
        "groupe d'attaque",
        "DDL",
        "DDI",
        "équipe d'alarme",
        "équipe médicale",
        "groupe soutien",
        "groupe protection"
      ],
      classes: ["A", "B", "C", "D", "F", "HC"],
      roleDuties: {
        "groupe d'attaque": "Equip, take orders, use the thermal camera, attack, rotate reliefs (L2 s23)",
        "DDL": "Hold the compartment plan, issue directives, coordinate reinforcements (L2 s19)",
        "DDI": "Choose the tactic, direct the teams, report to the DDL (L2 s20)",
        "équipe d'alarme": "Muster fast, first relief for the attack group, equipment, plot tracking (L2 s21)",
        "équipe médicale": "Triage, extraction and handover of casualties (L2 s27)",
        "groupe soutien": "Power and ventilation isolation, confinement, access-route smoke (L2 s25)",
        "groupe protection": "Hoses, boundary protection, cube closing, extinguishing water (L2 s24)"
      },
      status: {
        "groupe d'attaque|F": "In progress"
      }
    }
  }
};
