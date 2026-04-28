const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')  // e.g. "/org-chart-app"

export const ROLE_FILE_MAP: Record<string, string> = {

  // ── Software Engineering ────────────────────────────────────────────
  ase:  `${BASE}/role-profiles/Developer/Developer-Framework-Level-1.html`,
  se:   `${BASE}/role-profiles/Developer/Developer-Framework-Level-2.html`,
  sse1: `${BASE}/role-profiles/Developer/Developer-Framework-Level-3.html`,
  sse2: `${BASE}/role-profiles/Developer/Developer-Framework-Level-4.html`,
  sse3: `${BASE}/role-profiles/Developer/Developer-Framework-Level-5.html`,
  pse1: `${BASE}/role-profiles/Developer/Developer-Framework-Level-6.html`,
  pse2: `${BASE}/role-profiles/Developer/Developer-Framework-Level-7.html`,
  // pse3: will be updated in future

  // ── Technical Leadership ────────────────────────────────────────────
  atl:  `${BASE}/role-profiles/Techlead/Technical%20Lead%20-%20ATL%20.html`,
  tl:   `${BASE}/role-profiles/Techlead/Technical%20Lead%20-%20TL.html`,
  stl:  `${BASE}/role-profiles/Techlead/Technical%20Lead%20-STL.html`,

  // ── Solution Architecture ───────────────────────────────────────────
  asa1: `${BASE}/role-profiles/Leadership/solution-architect-L1.html`,
  asa2: `${BASE}/role-profiles/solution-architect.html`,
  sa1:  `${BASE}/role-profiles/Leadership/solution-architect-L2.html`,
  sa2:  `${BASE}/role-profiles/Leadership/solution-architect-L3.html`,

  // ── Quality Assurance ───────────────────────────────────────────────
  ate:  `${BASE}/role-profiles/Testing/Testing-Framework-Level-1.html`,
  te:   `${BASE}/role-profiles/Testing/Testing-Framework-Level-2.html`,
  ste1: `${BASE}/role-profiles/Testing/Testing-Framework-Level-3.html`,
  ste2: `${BASE}/role-profiles/Testing/Testing-Framework-Level-4.html`,
  aql:  `${BASE}/role-profiles/Testing/Testing-Leadership-Framework-Level-5.html`,
  ql:   `${BASE}/role-profiles/Testing/Testing-Leadership-Framework-Level-6.html`,
  sql:  `${BASE}/role-profiles/Testing/Testing-Leadership-Framework-Level-7.html`,

  // ── Business Analysis ───────────────────────────────────────────────
  aba:  `${BASE}/role-profiles/BusinessAnalyst/L1%20-%20Foundation-Builder-Framework-Level-1.html`,
  ba:   `${BASE}/role-profiles/BusinessAnalyst/L2%20-%20Value-Stream-Navigator-Framework-Level-2.html`,
  sba1: `${BASE}/role-profiles/BusinessAnalyst/L3%20-%20Strategic-Architect-Framework-Level-3.html`,
  sba2: `${BASE}/role-profiles/BusinessAnalyst/L4%20-%20Enterprise-Value-Architect-Framework-Level-4.html`,
  abal: `${BASE}/role-profiles/BusinessAnalyst/L5%20-%20Enterprise-Value-Orchestrator-Framework-Level-5.html`,
  bal:  `${BASE}/role-profiles/BusinessAnalyst/L6%20-%20Transformation-Catalyst-Framework-Level-6.html`,
  sbal: `${BASE}/role-profiles/BusinessAnalyst/L7%20-%20Enterprise-Architect-Framework-Level-7.html`,

  // ── Project / Delivery Management ──────────────────────────────────
  apm1: `${BASE}/role-profiles/Leadership/project-management%20-%20APM.html`,
  apm2: `${BASE}/role-profiles/Leadership/project-management%20-%20APM.html`,
  pm1:  `${BASE}/role-profiles/Leadership/project-management%20-%20PM.html`,
  pm2:  `${BASE}/role-profiles/Leadership/project-management%20-%20PM.html`,
  hpd:  `${BASE}/role-profiles/Leadership/Head-Projects-Delivery.html`,

  // ── Partnerships / Business Development ────────────────────────────
  pman: `${BASE}/role-profiles/Sales/Partnership%20-%20L1%20-%20Partnership-Manager-Framework-The-Ecosystem-Architect.html`,
  sam:  `${BASE}/role-profiles/Sales/Partnership%20-%20L2%20-%20Senior-Alliance-Manager-Framework-The-Strategic-Growth-Architect.html`,
  spm:  `${BASE}/role-profiles/Sales/Partnership%20-%20L3%20-%20Strategy-Partnership-Manager-Framework-The-Ecosystem-Architect.html`,
  hbd:  `${BASE}/role-profiles/Sales/Head-of-Business-Development-Framework-The-Growth-Architect.html`,

  // ── Sales ───────────────────────────────────────────────────────────
  bdr:  `${BASE}/role-profiles/Sales/Sales%20-%20L1-%20Business-Development-Representative-Framework-Role-Definition.html`,
  ae:   `${BASE}/role-profiles/Sales/Sales%20-%20L2%20-%20Account-Executive-Level-1-Framework-Revenue-Closer.html`,
  sae:  `${BASE}/role-profiles/Sales/Sales%20-%20L4%20-%20Senior-Account-Executive-Framework-The-Enterprise-Growth-Architect.html`,
  sm:   `${BASE}/role-profiles/Sales/Sales%20-%20L5%20-%20Sales-Manager-Framework-The-Revenue-Engine-Architect.html`,

  // ── Marketing ───────────────────────────────────────────────────────
  me:   `${BASE}/role-profiles/Marketing/L1%20-%20Marketing-Executive-Framework-The-Growth-Catalyst.html`,
  sme:  `${BASE}/role-profiles/Marketing/L2%20-%20Senior-Marketing-Executive-Framework-The-Strategic-Catalyst.html`,
  ms:   `${BASE}/role-profiles/Marketing/L3%20-%20Marketing-Specialist-Framework-The-Execution-Engine.html`,
  mm:   `${BASE}/role-profiles/Marketing/L4%20-%20Marketing-Manager-Framework-The-Strategic-Growth-Architect.html`,
  hm:   `${BASE}/role-profiles/Marketing/Head-of-Marketing-Framework-The-Revenue-Visionary.html`,

  // ── Executive Leadership ────────────────────────────────────────────
  ad:   `${BASE}/role-profiles/Leadership/people-leadership%20-%20AD.html`,
  dir:  `${BASE}/role-profiles/Leadership/people-leadership%20-%20D.html`,
  vp:   `${BASE}/role-profiles/Leadership/people-leadership%20-%20VP.html`,
  // rd: will be updated in future

}


