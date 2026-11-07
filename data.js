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
      note: "Locker and equipment actors placed and saved. Item names below are placeholders — rename to match the actual actors.",
      limitation: "Pickup and equip interactions remain future work. No Play/VR test of the repaired installation is recorded.",
      items: [
        { id: "tpb-1", name: "Protective jacket", qty: "1", readiness: "Ready", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tpb-2", name: "Protective trousers", qty: "1", readiness: "Ready", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tpb-3", name: "Helmet", qty: "1", readiness: "Ready", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tpb-4", name: "Gloves", qty: "1 pair", readiness: "Ready", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tpb-5", name: "Boots", qty: "1 pair", readiness: "Needs inspection", interaction: "Pending", priority: "Normal", notes: "" }
      ]
    },
    {
      id: "lk-tis",
      code: "TIS",
      state: "Placed and saved",
      note: "Locker and equipment actors placed and saved. Item names below are placeholders — rename to match the actual actors.",
      limitation: "Pickup and equip interactions remain future work. No Play/VR test of the repaired installation is recorded.",
      items: [
        { id: "tis-1", name: "Protective suit", qty: "1", readiness: "Ready", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tis-2", name: "Flash hood", qty: "1", readiness: "Ready", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tis-3", name: "Gloves", qty: "1 pair", readiness: "Ready", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tis-4", name: "Boots", qty: "1 pair", readiness: "Ready", interaction: "Pending", priority: "Normal", notes: "" }
      ]
    },
    {
      id: "lk-tisa",
      code: "TISA",
      state: "Placed and saved",
      note: "Locker and equipment actors placed and saved. Item names below are placeholders — rename to match the actual actors.",
      limitation: "Pickup and equip interactions remain future work. No Play/VR test of the repaired installation is recorded.",
      items: [
        { id: "tisa-1", name: "Protective suit", qty: "1", readiness: "Ready", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tisa-2", name: "Flash hood", qty: "1", readiness: "Ready", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tisa-3", name: "Gloves", qty: "1 pair", readiness: "Ready", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "tisa-4", name: "Boots", qty: "1 pair", readiness: "Ready", interaction: "Pending", priority: "Normal", notes: "" }
      ]
    },
    {
      id: "lk-ari",
      code: "ARI",
      state: "Placed and saved",
      note: "Locker and equipment actors placed and saved. Item names below are placeholders — rename to match the actual actors.",
      limitation: "Pickup and equip interactions remain future work. No Play/VR test of the repaired installation is recorded.",
      items: [
        { id: "ari-1", name: "Harness", qty: "1", readiness: "Ready", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "ari-2", name: "Air cylinder", qty: "1", readiness: "Needs inspection", interaction: "Pending", priority: "High", notes: "" },
        { id: "ari-3", name: "Face mask", qty: "1", readiness: "Ready", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "ari-4", name: "Regulator", qty: "1", readiness: "Ready", interaction: "Pending", priority: "Normal", notes: "" },
        { id: "ari-5", name: "PASS device", qty: "1", readiness: "Unknown", interaction: "Pending", priority: "Low", notes: "" }
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
  ]
};
