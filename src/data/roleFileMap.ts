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
  // atl:  will be updated in future
  // tl:   will be updated in future
  // stl:  will be updated in future

  // ── Solution Architecture ───────────────────────────────────────────
  // asa1: will be updated in future
  // asa2: will be updated in future
  // sa1:  will be updated in future
  // sa2:  will be updated in future

  // ── Quality Assurance ───────────────────────────────────────────────
  ate:  `${BASE}/role-profiles/Testing/Testing-Framework-Level-1.html`,
  te:   `${BASE}/role-profiles/Testing/Testing-Framework-Level-2.html`,
  ste1: `${BASE}/role-profiles/Testing/Testing-Framework-Level-3.html`,
  ste2: `${BASE}/role-profiles/Testing/Testing-Framework-Level-4.html`,
  aql:  `${BASE}/role-profiles/Testing/Testing-Leadership-Framework-Level-5.html`,
  ql:   `${BASE}/role-profiles/Testing/Testing-Leadership-Framework-Level-6.html`,
  sql:  `${BASE}/role-profiles/Testing/Testing-Leadership-Framework-Level-7.html`,

  // ── Business Analysis ───────────────────────────────────────────────
  // aba:  will be updated in future
  // ba:   will be updated in future
  // sba1: will be updated in future
  // sba2: will be updated in future
  // abal: will be updated in future
  // bal:  will be updated in future
  // sbal: will be updated in future

  // ── Project / Delivery Management ──────────────────────────────────
  // apm1: will be updated in future
  // apm2: will be updated in future
  // pm1:  will be updated in future
  // pm2:  will be updated in future
  // hpd:  will be updated in future

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
  // ad:  will be updated in future
  // dir: will be updated in future
  // vp:  will be updated in future
  // rd:  will be updated in future

}

