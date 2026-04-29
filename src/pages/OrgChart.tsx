import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROLE_FILE_MAP } from '../data/roleFileMap'
import './OrgChart.css'

// ─── Types ──────────────────────────────────────────────────────────────────
type ColorKey = 'white' | 'green' | 'blue' | 'purple' | 'yellow'

type Role = {
  id: string
  title: string
  desc: string
  level: number       // 1-based row
  track: number       // 0-based column
  color: ColorKey
  connectsTo?: string[]
}

// ─── Track column labels ─────────────────────────────────────────────────────
const TRACKS = [
  'Engineering',
  'Tech Lead / Architect',
  'Project Management',
  'Quality Engineering',
  'Business Analysis',
  'Partnership & BD',
  'Sales',
  'Marketing',
]
const TRACK_COUNT = TRACKS.length
const LEVELS = 15   // VP and R&D live at row 15

// ─── Role data ───────────────────────────────────────────────────────────────
const ROLES: Role[] = [
  // ── Engineering ─────────────────────────────────────────────────────
  { id: 'ase',  title: 'Associate Software Engineer',       desc: 'Works on assigned tasks, fixes bugs, learns codebase and tools, supports senior developers, and completes small modules under supervision.', level: 1,  track: 0, color: 'white',  connectsTo: ['se']   },
  { id: 'se',   title: 'Software Engineer',                 desc: 'Develops features independently, writes clean code, participates in testing, fixes defects, and contributes to module-level development and documentation.', level: 2,  track: 0, color: 'white',  connectsTo: ['sse1'] },
  { id: 'sse1', title: 'Senior Software Engineer L1',       desc: 'Owns modules, performs code reviews, supports junior developers, improves performance, and ensures module stability and maintainability.', level: 3,  track: 0, color: 'white',  connectsTo: ['sse2'] },
  { id: 'sse2', title: 'Senior Software Engineer L2',       desc: 'Develops and owns features independently, writes high-quality code, ensures unit testing, fixes defects, and contributes to stable and maintainable module development.', level: 4,  track: 0, color: 'blue',   connectsTo: ['sse3', 'atl'] },
  { id: 'sse3', title: 'Senior Software Engineer L3',       desc: 'Drives technical strategy across multiple systems, ensures architecture aligns with business goals, resolves complex cross-system issues, and leads quality, technical debt, and engineering excellence initiatives across the organization.', level: 5,  track: 0, color: 'green',  connectsTo: ['pse1'] },
  { id: 'pse1', title: 'Principal Software Engineer L1',    desc: 'Defines organization-wide technical vision, drives architecture standardization, leads complex system design decisions, and ensures engineering practices, scalability, and long-term technology direction across multiple systems and teams.', level: 6,  track: 0, color: 'green',  connectsTo: ['pse2', 'tl'] },
  { id: 'pse2', title: 'Principal Software Engineer L2',    desc: 'Drives organization-wide technical direction, defines architecture standards, leads complex system design, and ensures scalable, high-performance solutions while mentoring senior engineers and influencing engineering excellence.', level: 7,  track: 0, color: 'green',  connectsTo: ['pse3', 'asa1'] },
  { id: 'pse3', title: 'Principal Software Engineer L3',    desc: 'Organization-wide engineering authority; defines long-term technical strategy and drives platform-level innovation across the company.', level: 8,  track: 0, color: 'purple', connectsTo: ['asa1', 'sa1'] },

  // ── Tech Lead / Architect ────────────────────────────────────────────
  { id: 'atl',  title: 'Associate Technical Lead',          desc: 'Supports module-level technical execution by guiding developers, ensuring code quality, and assisting in delivery and issue resolution to achieve stable and efficient outcomes.', level: 5,  track: 1, color: 'green',  connectsTo: ['tl']   },
  { id: 'tl',   title: 'Technical Lead',                    desc: 'Owns module-level technical delivery by driving execution, making technical decisions, ensuring code quality, and resolving issues to deliver stable and high-quality outcomes.', level: 6,  track: 1, color: 'green',  connectsTo: ['stl']  },
  { id: 'stl',  title: 'Senior Technical Lead',             desc: 'Drives engineering standards, architecture decisions, technical roadmap, mentoring leads, and improves engineering productivity across multiple teams.', level: 7,  track: 1, color: 'green',  connectsTo: [ 'apm1'] },
  { id: 'asa1', title: 'Associate Solution Architect L1',   desc: 'Supports solution design, feasibility analysis, technical documentation, and assists in architecture decisions and client technical discussions.', level: 8,  track: 1, color: 'purple', connectsTo: ['asa2'] },
  { id: 'asa2', title: 'Associate Solution Architect L2',   desc: 'Supports solution design, feasibility analysis, technical documentation, and assists in architecture decisions and client technical discussions.', level: 9,  track: 1, color: 'purple',  connectsTo: ['sa1']  },
  { id: 'sa1',  title: 'Solution Architect L1',             desc: 'Designs system architecture, selects technology, and ensures scalability, integration, performance, and long-term maintainability of solutions.', level: 10, track: 1, color: 'purple', connectsTo: ['sa2']  },
  { id: 'sa2',  title: 'Solution Architect L2',             desc: 'Designs system architecture, selects technology, and ensures scalability, integration, performance, and long-term maintainability of solutions.', level: 11, track: 1, color: 'purple', connectsTo: ['hpd', 'rd'] },
  { id: 'rd',   title: 'R&D',                               desc: 'Leads research and innovation by exploring emerging technologies and proposing next-generation solutions that shape the organization\'s future direction.', level: 15, track: 1, color: 'yellow' },

  // ── Project Management ───────────────────────────────────────────────
  { id: 'apm1', title: 'Associate Project Manager L1',      desc: 'Tracks daily execution, maintains reports, coordinates team activities, updates project status, and ensures process and documentation compliance.', level: 8,  track: 2, color: 'purple', connectsTo: ['apm2'] },
  { id: 'apm2', title: 'Associate Project Manager L2',      desc: 'Tracks daily execution, maintains reports, coordinates team activities, updates project status, and ensures process and documentation compliance.', level: 9,  track: 2, color: 'purple',  connectsTo: ['pm1']  },
  { id: 'pm1',  title: 'Project Manager L1',                desc: 'Manages project delivery, customer communication, planning, budgeting, risk management, and ensures projects are delivered on time, within scope, and budget.', level: 10, track: 2, color: 'purple', connectsTo: ['pm2']  },
  { id: 'pm2',  title: 'Project Manager L2',                desc: 'Manages project delivery, customer communication, planning, budgeting, risk management, and ensures projects are delivered on time, within scope, and budget.', level: 11, track: 2, color: 'purple', connectsTo: ['hpd']  },
  
  { id: 'hpd',  title: 'Head — Project & Delivery',         desc: 'Owns end-to-end delivery organization, ensures project execution excellence, drives delivery predictability, manages profitability, and builds strong delivery capability aligned with business goals.', level: 12, track: 2, color: 'blue',   connectsTo: ['ad']   },
  { id: 'ad',   title: 'Associate Director',                desc: 'Manages multiple teams or functions, ensures operational performance, supports strategic execution, and bridges execution teams with senior leadership.', level: 13, track: 2, color: 'blue',   connectsTo: ['dir']  },
  { id: 'dir',  title: 'Director',                          desc: 'Owns business unit or major function, responsible for revenue, delivery, and strategy execution while driving leadership development and long-term department growth.', level: 14, track: 2, color: 'blue',   connectsTo: ['vp']   },
  { id: 'vp',   title: 'Vice President',                    desc: 'Drives organizational strategy execution, oversees multiple departments or business units, ensures growth, profitability, leadership alignment, and organizational performance.', level: 15, track: 2, color: 'blue'  },

  // ── Quality Engineering ──────────────────────────────────────────────
  { id: 'ate',  title: 'Associate Testing Engineer',        desc: 'Executes test cases by following defined QA processes, maintains test artifacts, ensures traceability, learns testing tools and practices, and contributes to quality through disciplined and consistent execution.',                  level: 1,  track: 3, color: 'white',  connectsTo: ['te']  },
  { id: 'te',  title: 'Testing Engineer',                   desc: 'Independently executes test cases, contributes to test design, maintains traceability, actively uses testing tools, identifies defects with better accuracy, and ensures quality through consistent process adherence and improved understanding of testing practices.',        level: 2,  track: 3, color: 'white',  connectsTo: ['ste1']  },
  { id: 'ste1',  title: 'Senior Testing Engineer L1',       desc: 'Designs and executes test scenarios, ensures strong traceability, improves test coverage, identifies defects proactively, and contributes to quality by applying solid testing knowledge, collaborating with teams, and maintaining high standards in test artifacts and processes.',  level: 3,  track: 3, color: 'white',  connectsTo: ['ste2']  },
  { id: 'ste2',  title: 'Senior Testing Engineer L2',       desc: 'Leads test design and execution at module level, ensures comprehensive test coverage, strengthens traceability, drives defect prevention, reviews test artifacts, and improves overall quality through process adherence, collaboration, and continuous improvement.',         level: 4,  track: 3, color: 'blue',   connectsTo: ['aql']  },
  { id: 'aql',  title: 'Associate Quality Lead',            desc: 'Leads quality initiatives at module or project level, ensures effective test strategy execution, drives defect prevention, reviews test processes and artifacts, mentors team members, and ensures overall quality delivery through strong collaboration and process governance.',   level: 5,  track: 3, color: 'green',  connectsTo: ['ql']   },
  { id: 'ql',   title: 'Quality Lead',                      desc: 'Defines and drives quality strategy across projects, ensures alignment with business goals, oversees test processes and governance, drives continuous improvement, manages stakeholders, and ensures high-quality delivery through strong leadership and strategic decision-making.',   level: 6,  track: 3, color: 'green',  connectsTo: ['sql']  },
  { id: 'sql',  title: 'Senior Quality Lead',               desc: 'Drives organization-wide quality vision and transformation, defines long-term quality strategy, influences executive stakeholders, establishes governance frameworks, and ensures quality excellence by enabling innovation, scalability, and business impact across all programs.',  level: 7,  track: 3, color: 'green',  connectsTo: ['apm1'] },

  // ── Business Analysis ────────────────────────────────────────────────
  { id: 'aba',  title: 'Associate Business Analyst',               desc: 'Supports business analysis activities by documenting requirements, assisting in stakeholder communication, and ensuring accuracy and completeness of basic BA deliverables under guidance.',                       level: 1,  track: 4, color: 'white',  connectsTo: ['ba']  },
  { id: 'ba',  title: 'Business Analyst',               desc: 'Performs business analysis by validating requirements, ensuring traceability, collaborating with stakeholders, and aligning solutions to business value across the delivery lifecycle.',                          level: 2,  track: 4, color: 'white',  connectsTo: ['sba1']  },
  { id: 'sba1',  title: 'Senior Business Analyst L1',               desc: 'Leads business analysis activities by managing the end-to-end requirement lifecycle, ensuring alignment to business outcomes, driving stakeholder collaboration, and enabling teams to deliver value-driven solutions.',  level: 3,  track: 4, color: 'white',  connectsTo: ['sba2']  },
  { id: 'sba2',  title: 'Senior Business Analyst L2',               desc: 'Drives business analysis by designing value-driven solutions, ensuring alignment between business needs and delivery, managing complex stakeholder interactions, and enabling consistent value realization across initiatives.',  level: 4,  track: 4, color: 'blue',   connectsTo: ['abal'] },
  { id: 'abal', title: 'Associate Business Analyst Lead',   desc: 'Leads business analysis across value streams, ensures alignment to strategic objectives, drives requirement quality and traceability, and bridges delivery teams with business stakeholders to achieve measurable outcomes.',  level: 5,  track: 4, color: 'green',  connectsTo: ['bal']  },
  { id: 'bal',  title: 'Business Analyst Lead',             desc: 'Leads enterprise-level business analysis by driving transformation initiatives, aligning requirements with strategic business goals, enabling cross-functional value delivery, and influencing stakeholder decisions to achieve organizational outcomes.',  level: 6,  track: 4, color: 'green',  connectsTo: ['sbal'] },
  { id: 'sbal', title: 'Senior Business Analyst Lead',      desc: 'Drives enterprise-wide business analysis vision by shaping strategic direction, enabling large-scale transformation, influencing executive decisions, and ensuring business analysis delivers long-term organizational value.',  level: 7,  track: 4, color: 'green',  connectsTo: ['apm1'] },

  // ── Partnership & BD ─────────────────────────────────────────────────
  { id: 'pman', title: 'Partnership Manager',               desc: 'Builds and manages partner relationships, drives partner-led opportunities, coordinates joint activities, and ensures partners contribute to pipeline and revenue growth.',                                                    level: 8,  track: 5, color: 'purple', connectsTo: ['sam']  },
  { id: 'sam',  title: 'Senior Alliance Manager',           desc: 'Drives strategic partner relationships, expands partner-led revenue, aligns joint business plans, and ensures partners contribute significantly to pipeline, growth, and long-term business value.',               level: 9,  track: 5, color: 'purple',  connectsTo: ['spm']  },
  { id: 'spm',  title: 'Strategy Partnership Manager',      desc: 'Defines partnership strategy, builds high-impact alliances, drives ecosystem-led growth, and ensures partnerships contribute to long-term revenue, market expansion, and strategic business outcomes.',          level: 10, track: 5, color: 'purple',  connectsTo: ['hbd']  },
  { id: 'hbd',  title: 'Head — BD',                         desc: 'Drives business growth by identifying new markets, building strategic partnerships, leading high-value deals, and creating long-term revenue opportunities aligned with company strategy.',              level: 11, track: 5, color: 'blue',   connectsTo: ['ad']   },

  // ── Sales ────────────────────────────────────────────────────────────
  { id: 'bdr',  title: 'Business Dev Representative',       desc: 'Generates and qualifies leads through outreach, initiates customer conversations, schedules meetings for sales, and builds a consistent pipeline of opportunities for the sales team.',                level: 1,  track: 6, color: 'white',  connectsTo: ['ae']   },
  { id: 'ae',   title: 'Account Executive',                 desc: 'Manages the full sales cycle by handling qualified leads, conducting discovery, presenting solutions, negotiating deals, and closing revenue while maintaining a consistent and predictable pipeline.', level: 2,  track: 6, color: 'white',  connectsTo: ['sae']  },
  { id: 'sae',  title: 'Senior Account Executive',          desc: 'Handles complex and high-value deals, manages enterprise accounts, drives strategic sales conversations, and ensures consistent revenue growth through strong pipeline management and deal execution.',  level: 3,  track: 6, color: 'white',  connectsTo: ['sm']   },
  { id: 'sm',   title: 'Sales Manager',                     desc: 'Leads the sales team, drives revenue targets, manages pipeline and forecasting, ensures sales process discipline, and coaches team members to achieve consistent and predictable revenue growth.', level: 8,  track: 6, color: 'purple', connectsTo: ['hbd'] },

  // ── Marketing ────────────────────────────────────────────────────────
  { id: 'me',   title: 'Marketing Executive',               desc: 'Executes marketing campaigns, supports content and digital activities, generates leads, and assists in driving brand awareness and demand generation initiatives.',                                      level: 1,  track: 7, color: 'white',  connectsTo: ['sme']  },
  { id: 'sme',  title: 'Senior Marketing Executive',        desc: 'Plans and optimizes marketing campaigns, analyzes performance, improves lead quality, and drives demand generation by aligning execution with marketing strategy.',                             level: 2,  track: 7, color: 'white',  connectsTo: ['ms']   },
  { id: 'ms',   title: 'Marketing Specialist',              desc: 'Executes and optimizes marketing programs across channels, manages campaigns end-to-end, analyzes performance, and ensures consistent lead generation and campaign effectiveness.',             level: 3,  track: 7, color: 'white',  connectsTo: ['mm']   },
  { id: 'mm',   title: 'Marketing Manager',                 desc: 'Leads marketing strategy and execution, manages team and campaigns, aligns marketing with business goals, and drives demand generation, brand growth, and pipeline contribution.',          level: 8,  track: 7, color: 'purple', connectsTo: ['hm']   },
  { id: 'hm',   title: 'Head — Marketing',                  desc: 'Owns marketing strategy, brand positioning, demand generation, and revenue contribution, aligning marketing initiatives with business growth goals and ensuring scalable and predictable pipeline generation.',  level: 11, track: 7, color: 'blue',   connectsTo: ['ad']   },
]

// Index: id → Role
const ROLE_MAP = Object.fromEntries(ROLES.map(r => [r.id, r]))

// Index: level → sorted roles by track
const byLevel: Record<number, Role[]> = {}
ROLES.forEach(r => {
  if (!byLevel[r.level]) byLevel[r.level] = []
  byLevel[r.level].push(r)
})
Object.values(byLevel).forEach(arr => arr.sort((a, b) => a.track - b.track))

// ─── Pre-compute: for each target, sorted list of cross-column source IDs ────
// Used to spread multiple incoming arrows across the target card's top edge
// so they never overlap and each arrowhead has its own distinct landing point.
const crossIncoming: Record<string, string[]> = {}
ROLES.forEach(role => {
  role.connectsTo?.forEach(toId => {
    const toRole = ROLE_MAP[toId]
    if (!toRole) return
    if (role.track !== toRole.track && toRole.level > role.level) {
      if (!crossIncoming[toId]) crossIncoming[toId] = []
      crossIncoming[toId].push(role.id)
    }
  })
})
// Sort each list by source track so left→right order is consistent
Object.values(crossIncoming).forEach(arr => arr.sort((a, b) => ROLE_MAP[a].track - ROLE_MAP[b].track))

// ─── Merge-entry targets ──────────────────────────────────────────────────────
// All connections into these cards converge to a single trunk junction point,
// then ONE shared arrow drops into the card — clean "fan-in" look.
const MERGE_TARGETS = new Set<string>(['apm1', 'ad'])
const TRUNK_LEN = 10   // px: must fit in the ~12px inter-row gap (6px top + 6px bottom padding)

// ─── DOM measurement helpers ─────────────────────────────────────────────────
const cx  = (el: HTMLElement, ox: number) => el.getBoundingClientRect().left + el.getBoundingClientRect().width  / 2 - ox
const cy  = (el: HTMLElement, oy: number) => el.getBoundingClientRect().top  + el.getBoundingClientRect().height / 2 - oy
const top = (el: HTMLElement, oy: number) => el.getBoundingClientRect().top    - oy
const bot = (el: HTMLElement, oy: number) => el.getBoundingClientRect().bottom - oy
const lft = (el: HTMLElement, ox: number) => el.getBoundingClientRect().left   - ox
const rgt = (el: HTMLElement, ox: number) => el.getBoundingClientRect().right  - ox

// ─── Component ───────────────────────────────────────────────────────────────
export default function OrgChart() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const cardRefs     = useRef<Record<string, HTMLDivElement | null>>({})
  const svgRef       = useRef<SVGSVGElement | null>(null)
  const [paths, setPaths] = useState<{ d: string; key: string; cross: boolean; noArrow?: boolean }[]>([])
  const [tip,   setTip]   = useState<{ roleId: string; left: number; caretOffset: number; y: number; above: boolean } | null>(null)
  const [comingSoon, setComingSoon] = useState<{ roleId: string } | null>(null)

  // Close tooltip and coming-soon popup on click outside or scroll
  useEffect(() => {
    const close = () => { setTip(null); setComingSoon(null) }
    document.addEventListener('click', close)
    window.addEventListener('scroll', close, true)   // capture phase catches all scroll containers
    window.addEventListener('touchmove', close, { passive: true })
    return () => {
      document.removeEventListener('click', close)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('touchmove', close)
    }
  }, [])

  // Show tooltip anchored to card element (position:fixed so it escapes overflow containers)
  const showTip = (el: HTMLElement, roleId: string) => {
    const rect = el.getBoundingClientRect()
    const above = rect.top > window.innerHeight * 0.45
    const TIP_W  = 264   // matches max-width in CSS
    const MARGIN = 10    // min gap from viewport edges
    // Ideal: centered on card
    const idealLeft = rect.left + rect.width / 2 - TIP_W / 2
    // Clamp so tooltip never goes off-screen left or right
    const clampedLeft = Math.max(MARGIN, Math.min(idealLeft, window.innerWidth - TIP_W - MARGIN))
    // Caret offset from tooltip left edge → points at card center
    const caretOffset = Math.max(14, Math.min(rect.left + rect.width / 2 - clampedLeft, TIP_W - 14))
    setTip({
      roleId,
      left: clampedLeft,
      caretOffset,
      y: above ? rect.top - 10 : rect.bottom + 10,
      above,
    })
  }

  // Show "coming soon" modal popup (for roles without a profile page)
  const showComingSoon = (_el: HTMLElement, roleId: string) => {
    setComingSoon({ roleId })
  }

  useEffect(() => {
    let rafId: number

    const draw = () => {
      const svg  = svgRef.current
      const wrap = containerRef.current
      if (!svg || !wrap) return

      const cr = wrap.getBoundingClientRect()

      // Match SVG canvas to grid dimensions
      svg.setAttribute('width',  String(wrap.scrollWidth))
      svg.setAttribute('height', String(wrap.scrollHeight))

      const next: { d: string; key: string; cross: boolean; noArrow?: boolean }[] = []
      // Collect merge-target card elements so we can add trunk paths after the loop
      const mergeTargetEls = new Map<string, HTMLElement>()

      ROLES.forEach(role => {
        if (!role.connectsTo?.length) return
        const fromEl = cardRefs.current[role.id]
        if (!fromEl) return

        role.connectsTo.forEach(toId => {
          const toEl   = cardRefs.current[toId]
          const toRole = ROLE_MAP[toId]
          if (!toEl || !toRole) return

          let d: string
          let cross   = false   // cross-column or skip-level → lighter style
          let noArrow = false   // true for feeder lines into a merge-entry target

          if (role.level === toRole.level) {
            // ── Same-row: plain horizontal stub side→side ────────────────────
            cross = true
            const midCy = cy(fromEl, cr.top)
            if (role.track < toRole.track) {
              d = `M ${rgt(fromEl, cr.left)} ${midCy} L ${lft(toEl, cr.left)} ${midCy}`
            } else {
              d = `M ${lft(fromEl, cr.left)} ${midCy} L ${rgt(toEl, cr.left)} ${midCy}`
            }

          } else if (role.track === toRole.track) {
            // ── Same-column vertical ─────────────────────────────────────
            cross = (toRole.level - role.level) > 1
            if (MERGE_TARGETS.has(toId)) {
              // Feeder: end at trunk junction, no arrowhead
              mergeTargetEls.set(toId, toEl)
              noArrow = true
              d = `M ${cx(fromEl, cr.left)} ${bot(fromEl, cr.top)} L ${cx(toEl, cr.left)} ${top(toEl, cr.top) - TRUNK_LEN}`
            } else {
              d = `M ${cx(fromEl, cr.left)} ${bot(fromEl, cr.top)} L ${cx(toEl, cr.left)} ${top(toEl, cr.top)}`
            }

          } else {
            // ── Cross-column: bottom-exit vertical-tension bezier ─────────────
            // Always exits from the BOTTOM of the source card so the path starts
            // below all row-level cards — the curve never sweeps through adjacent
            // cards in the same row. A small horizontal offset (by direction) from
            // bottom-center makes the departure visually distinct from any
            // same-column vertical connection leaving the same card.
            cross = true
            const goingRight = role.track < toRole.track
            const dir    = goingRight ? 1 : -1
            const sx     = cx(fromEl, cr.left)
            const sy     = bot(fromEl, cr.top)
            const tx     = cx(toEl, cr.left)

            if (toRole.level > role.level) {
              const isMerge  = MERGE_TARGETS.has(toId)
              const baseY    = top(toEl, cr.top)
              const ty       = isMerge ? baseY - TRUNK_LEN : baseY
              const incoming = crossIncoming[toId] ?? []
              const idx      = incoming.indexOf(role.id)
              const total    = incoming.length
              const SPREAD   = 22
              const entryX   = (isMerge || total <= 1)
                ? tx
                : tx + (idx - (total - 1) / 2) * SPREAD

              if (toRole.level === role.level + 1 || isMerge) {
                // ── Adjacent row OR merge-target feeder: right-angle elbow ───
                const isAdjacent = toRole.level === role.level + 1
                // For merge feeders: if a card sits in the target track between
                // source and target (e.g. hpd between hbd→ad), the final vertical
                // descent would cross it. Route the horizontal bus BELOW that blocker
                // so the entire path stays clear of intermediate cards.
                let horizY: number
                if (isAdjacent) {
                  horizY = (sy + ty) / 2   // midpoint — safe when only 1 row apart
                } else {
                  const mergeBlockers = ROLES.filter(r =>
                    r.track === toRole.track &&
                    r.level > role.level &&
                    r.level < toRole.level
                  )
                  const lowestMB = mergeBlockers.length > 0
                    ? mergeBlockers.reduce((a, b) => a.level > b.level ? a : b)
                    : null
                  const lowestMBEl = lowestMB ? cardRefs.current[lowestMB.id] : null
                  horizY = lowestMBEl
                    ? bot(lowestMBEl, cr.top) + 4   // just below the blocker card
                    : sy + 8                          // no blocker — just below source
                }
                const R = 5
                d = [
                  `M ${sx} ${sy}`,
                  `L ${sx} ${horizY - R}`,
                  `Q ${sx} ${horizY} ${sx + dir * R} ${horizY}`,
                  `L ${entryX - dir * R} ${horizY}`,
                  `Q ${entryX} ${horizY} ${entryX} ${horizY + R}`,
                  `L ${entryX} ${ty}`,
                ].join(' ')
              } else {
                // ── Multi-row gap ─────────────────────────────────────────────
                // Check for a card in the target track between source and target
                // (e.g. hpd blocking hbd→ad). If found, descend in the source
                // column past that card, then go horizontal below it so the path
                // never crosses the intermediate card.
                const blockerRoles = ROLES.filter(r =>
                  r.track === toRole.track &&
                  r.level > role.level &&
                  r.level < toRole.level
                )
                // Pick the lowest blocker (closest to the target)
                const lowestBlocker = blockerRoles.length > 0
                  ? blockerRoles.reduce((a, b) => a.level > b.level ? a : b)
                  : null
                const blockerEl = lowestBlocker ? cardRefs.current[lowestBlocker.id] : null

                if (blockerEl) {
                  // Route below the blocker: descend in source column, then
                  // horizontal below the blocker, then drop to target top.
                  const busY = bot(blockerEl, cr.top) + 4
                  const R = 5
                  d = [
                    `M ${sx} ${sy}`,
                    `L ${sx} ${busY - R}`,
                    `Q ${sx} ${busY} ${sx + dir * R} ${busY}`,
                    `L ${entryX - dir * R} ${busY}`,
                    `Q ${entryX} ${busY} ${entryX} ${busY + R}`,
                    `L ${entryX} ${ty}`,
                  ].join(' ')
                } else {
                  // No blocker — vertical-tension bezier
                  const halfW  = (rgt(fromEl, cr.left) - lft(fromEl, cr.left)) / 2
                  const offset = Math.min(10, halfW * 0.45)
                  const exitX  = sx + dir * offset
                  const tension = Math.max(32, (ty - sy) * 0.48)
                  d = `M ${exitX} ${sy} C ${exitX} ${sy + tension}, ${entryX} ${ty - tension}, ${entryX} ${ty}`
                }
              }

              if (isMerge) {
                noArrow = true
                mergeTargetEls.set(toId, toEl)
              }
            } else {
              // ── Upward (rare) ────────────────────────────────────────────
              const srcY = cy(fromEl, cr.top)
              const ty   = top(toEl, cr.top)
              if (goingRight) {
                d = [`M ${rgt(fromEl, cr.left)} ${srcY}`, `L ${tx} ${srcY}`, `L ${tx} ${ty}`].join(' ')
              } else {
                d = [`M ${lft(fromEl, cr.left)} ${srcY}`, `L ${tx} ${srcY}`, `L ${tx} ${ty}`].join(' ')
              }
            }
          }

          next.push({ d, key: `${role.id}→${toId}`, cross, noArrow })
        })
      })

      // ── Trunk paths for merge-entry targets ──────────────────────────────
      // One dark arrow drops from the junction point into the card center.
      mergeTargetEls.forEach((toEl, targetId) => {
        const tgtCX  = cx(toEl, cr.left)
        const tgtTop = top(toEl, cr.top)
        next.push({
          d: `M ${tgtCX} ${tgtTop - TRUNK_LEN} L ${tgtCX} ${tgtTop}`,
          key: `trunk→${targetId}`,
          cross: false,
          noArrow: false,
        })
      })

      setPaths(next)
    }

    // Double RAF: ensures browser has completed layout after first paint
    rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(draw)
    })

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(draw)
    })
    if (containerRef.current) ro.observe(containerRef.current)
    window.addEventListener('resize', draw)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      window.removeEventListener('resize', draw)
    }
  }, [])

  return (
    <main className="org-page">
      {/* Page title + legend */}
      <div className="org-page-header">
        <h1 className="org-page-title">Career Growth Path</h1>
        <div className="org-legend">
          <span className="leg leg-white">Individual Contributor</span>
          <span className="leg leg-blue">Transitioning Level</span>
          <span className="leg leg-green">Lead / Senior Lead</span>
          <span className="leg leg-purple">Management</span>
          <span className="leg leg-yellow">R&amp;D</span>
        </div>
      </div>

      {/* Scrollable chart area */}
      <div className="org-scroll-area">
        {/* Sticky track column headers */}
        <div className="org-col-headers">
          <div className="org-row-gutter" />
          {TRACKS.map((label, i) => (
            <div key={i} className="org-col-head">{label}</div>
          ))}
        </div>

        {/* Grid + SVG connector overlay */}
        <div className="org-grid" ref={containerRef}>
          <svg ref={svgRef} className="org-svg" aria-hidden="true">
            <defs>
              <marker id="arr-main"  markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="10" refX="7" refY="5" orient="auto" overflow="visible">
                <path d="M 0 0 L 10 5 L 0 10 Z" fill="#475569" />
              </marker>
              <marker id="arr-cross" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="9" refX="6" refY="4.5" orient="auto" overflow="visible">
                <path d="M 0 0 L 9 4.5 L 0 9 Z" fill="#94a3b8" />
              </marker>
            </defs>
            {paths.map(p => (
              <path
                key={p.key}
                d={p.d}
                stroke="#475569"
                strokeWidth={2}
                fill="none"
                markerEnd={p.noArrow ? undefined : 'url(#arr-main)'}
              />
            ))}
          </svg>

          {Array.from({ length: LEVELS }, (_, i) => i + 1).map(level => {
            const cells: (Role | null)[] = Array(TRACK_COUNT).fill(null)
            ;(byLevel[level] ?? []).forEach(r => { cells[r.track] = r })
            const isEmpty = cells.every(c => c === null)

            return (
              <div
                key={level}
                className={`org-row${isEmpty ? ' org-row-empty' : ''}`}
              >
                <div className="org-row-gutter">
                  {!isEmpty && <span className="org-level-badge">L{level}</span>}
                </div>
                {cells.map((role, colIdx) => (
                  <div key={colIdx} className="org-cell">
                    {role && (
                      <div
                        ref={el => { cardRefs.current[role.id] = el }}
                        className={`org-card org-${role.color}`}
                        onMouseEnter={e => showTip(e.currentTarget, role.id)}
                        onMouseLeave={() => setTip(null)}
                        onClick={e => {
                          e.stopPropagation()
                          const fileUrl = ROLE_FILE_MAP[role.id]
                          if (fileUrl) {
                            navigate('/role/' + role.id)
                          } else {
                            comingSoon?.roleId === role.id
                              ? setComingSoon(null)
                              : showComingSoon(e.currentTarget, role.id)
                          }
                        }}
                      >
                        {role.title}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* Tooltip popup — position:fixed escapes all overflow containers */}
      {tip && (
        <div
          className={`org-tip-popup${tip.above ? ' tip-above' : ' tip-below'}`}
          style={{ left: tip.left, top: tip.y }}
          role="tooltip"
        >
          <strong className="org-tip-title">{ROLE_MAP[tip.roleId]?.title}</strong>
          <p className="org-tip-desc">{ROLE_MAP[tip.roleId]?.desc}</p>
          <span className="org-tip-caret" style={{ left: tip.caretOffset }} />
        </div>
      )}

      {/* Coming-soon modal — shown when no profile page exists yet */}
      {comingSoon && (
        <div
          className="org-coming-soon-overlay"
          onClick={() => setComingSoon(null)}
        >
          <div
            className="org-coming-soon-popup"
            role="dialog"
            aria-modal="true"
            onClick={e => e.stopPropagation()}
          >
            <div className="org-coming-soon-header">
              <p className="org-coming-soon-title">{ROLE_MAP[comingSoon.roleId]?.title}</p>
              <button className="org-coming-soon-close" onClick={() => setComingSoon(null)} aria-label="Close">×</button>
            </div>
            <div className="org-coming-soon-body">
              <div className="org-coming-soon-icon">🕐</div>
              <p className="org-coming-soon-msg">Responsibility will be updated soon.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
