import { useEffect, useRef, useState } from 'react'
import './OrgChart.css'
import './OrgChartPyramid.css'

// ─── Types ───────────────────────────────────────────────────────────────────
type ColorKey = 'white' | 'green' | 'blue' | 'purple' | 'yellow'

type Role = {
  id: string
  title: string
  desc: string
  level: number
  track: number
  color: ColorKey
  connectsTo?: string[]
}

// ─── Role data ────────────────────────────────────────────────────────────────
const LEVELS = 15

const ROLES: Role[] = [
  // ── Engineering ──────────────────────────────────────────────────────
  { id: 'ase',  title: 'Associate Software Engineer',       desc: 'Entry-level role focused on learning and executing assigned tasks under senior guidance. Builds foundational coding skills across assigned technology stacks.',                                    level: 1,  track: 0, color: 'white',  connectsTo: ['se']   },
  { id: 'se',   title: 'Software Engineer',                 desc: 'Independently develops and maintains features, writes clean code, and participates actively in code reviews and sprint delivery.',                                                               level: 2,  track: 0, color: 'white',  connectsTo: ['sse1'] },
  { id: 'sse1', title: 'Senior Software Engineer L1',       desc: 'Delivers complex features with minimal guidance, begins mentoring junior engineers, and ensures consistently high code quality.',                                                                    level: 3,  track: 0, color: 'white',  connectsTo: ['sse2'] },
  { id: 'sse2', title: 'Senior Software Engineer L2',       desc: 'Drives technical design for features, leads peer code reviews, and actively contributes to architecture discussions and decisions.',                                                              level: 4,  track: 0, color: 'blue',   connectsTo: ['sse3', 'atl'] },
  { id: 'sse3', title: 'Senior Software Engineer L3',       desc: 'Owns end-to-end delivery of full modules, shapes the team-level technical roadmap, and mentors a small group of engineers.',                                                                level: 5,  track: 0, color: 'green',  connectsTo: ['pse1'] },
  { id: 'pse1', title: 'Principal Software Engineer L1',    desc: 'Principal engineer with cross-team impact; leads design reviews, establishes engineering best practices, and guides technology choices.',                                                        level: 6,  track: 0, color: 'green',  connectsTo: ['pse2', 'tl'] },
  { id: 'pse2', title: 'Principal Software Engineer L2',    desc: 'Drives system-level architecture across multiple teams; serves as a key technical advisor for product and business decisions.',                                                             level: 7,  track: 0, color: 'green',  connectsTo: ['pse3', 'asa1'] },
  { id: 'pse3', title: 'Principal Software Engineer L3',    desc: 'Organization-wide engineering authority; defines long-term technical strategy and drives platform-level innovation across the company.',                                                       level: 8,  track: 0, color: 'purple', connectsTo: ['asa1'] },

  // ── Tech Lead / Architect ─────────────────────────────────────────────
  { id: 'atl',  title: 'Associate Technical Lead',          desc: 'Leads a small engineering pod balancing hands-on coding with technical decision-making and sprint delivery guidance.',                                                                               level: 5,  track: 1, color: 'green',  connectsTo: ['tl']   },
  { id: 'tl',   title: 'Technical Lead',                    desc: 'Owns end-to-end technical delivery of a project stream; coordinates across developers and QA to maintain engineering quality.',                                                             level: 6,  track: 1, color: 'green',  connectsTo: ['stl']  },
  { id: 'stl',  title: 'Senior Technical Lead',             desc: 'Oversees multiple project workstreams; accountable for technical excellence, architecture quality, and team capability building.',                                                             level: 7,  track: 1, color: 'green',  connectsTo: ['asa1', 'apm1'] },
  { id: 'asa1', title: 'Associate Solution Architect L1',   desc: 'Designs scalable solution blueprints and collaborates with clients and teams on technical feasibility and integration approaches.',                                                          level: 8,  track: 1, color: 'purple', connectsTo: ['asa2'] },
  { id: 'asa2', title: 'Associate Solution Architect L2',   desc: 'Architects complex multi-service solutions, evaluates emerging technologies, and defines integration and data-flow patterns.',                                                                level: 9,  track: 1, color: 'white',  connectsTo: ['sa1']  },
  { id: 'sa1',  title: 'Solution Architect L1',             desc: 'Senior architect accountable for enterprise-grade solution design, non-functional requirements, and technical governance across engagements.',                                              level: 10, track: 1, color: 'purple', connectsTo: ['sa2']  },
  { id: 'sa2',  title: 'Solution Architect L2',             desc: 'Principal solution architect setting cross-org architecture standards; mentors fellow architects and drives the long-term technical vision.',                                               level: 11, track: 1, color: 'purple', connectsTo: ['hpd', 'rd'] },
  { id: 'rd',   title: 'R&D',                               desc: 'Leads research and innovation by exploring emerging technologies and proposing next-generation solutions that shape the organization\'s future direction.',                              level: 15, track: 1, color: 'yellow' },

  // ── Project Management ────────────────────────────────────────────────
  { id: 'apm1', title: 'Associate Project Manager L1',      desc: 'Assists in project planning, tracks deliverables, and coordinates cross-functional communications to support on-time delivery.',                                                                 level: 8,  track: 2, color: 'purple', connectsTo: ['apm2'] },
  { id: 'apm2', title: 'Associate Project Manager L2',      desc: 'Manages small-to-mid size projects end-to-end with growing accountability for scope, timeline, and budget control.',                                                                         level: 9,  track: 2, color: 'white',  connectsTo: ['pm1']  },
  { id: 'pm1',  title: 'Project Manager L1',                desc: 'Independently manages full project delivery, owns stakeholder communication, and develops proactive risk mitigation plans.',                                                                 level: 10, track: 2, color: 'purple', connectsTo: ['pm2']  },
  { id: 'pm2',  title: 'Project Manager L2',                desc: 'Leads complex multi-team projects; mentors junior project managers and champions continuous process improvements.',                                                                            level: 11, track: 2, color: 'purple', connectsTo: ['hpd']  },
  { id: 'hpd',  title: 'Head — Project & Delivery',         desc: 'Oversees the full delivery portfolio, sets delivery standards, and is accountable for on-time, on-budget execution across all accounts.',                                                    level: 12, track: 2, color: 'blue',   connectsTo: ['ad']   },
  { id: 'ad',   title: 'Associate Director',                desc: 'Cross-domain leader driving strategic programs; bridges business objectives with delivery execution and manages senior client relationships.',                                                  level: 13, track: 2, color: 'blue',   connectsTo: ['dir']  },
  { id: 'dir',  title: 'Director',                          desc: 'Senior leader responsible for department-level strategy, talent development, P&L management, and sustained business growth.',                                                               level: 14, track: 2, color: 'blue',   connectsTo: ['vp']   },
  { id: 'vp',   title: 'Vice President',                    desc: 'Executive overseeing the entire business unit; sets company vision, drives revenue growth, and represents the organization externally.',                                                   level: 15, track: 2, color: 'blue'  },

  // ── Quality Engineering ───────────────────────────────────────────────
  { id: 'te1',  title: 'Testing Engineer L1',               desc: 'Executes manual test cases, logs defects, and builds foundational knowledge of testing tools and automation frameworks.',                                                                        level: 1,  track: 3, color: 'white',  connectsTo: ['te2']  },
  { id: 'te2',  title: 'Testing Engineer L2',               desc: 'Writes automated test scripts, improves test coverage across modules, and contributes to CI/CD quality gates.',                                                                             level: 2,  track: 3, color: 'white',  connectsTo: ['te3']  },
  { id: 'te3',  title: 'Testing Engineer L3',               desc: 'Designs test strategies for product features, leads structured test planning, and mentors L1/L2 quality engineers.',                                                                        level: 3,  track: 3, color: 'white',  connectsTo: ['te4']  },
  { id: 'te4',  title: 'Testing Engineer L4',               desc: 'Owns quality assurance for a product area; builds regression suites and drives proactive defect prevention initiatives.',                                                                    level: 4,  track: 3, color: 'blue',   connectsTo: ['aql']  },
  { id: 'aql',  title: 'Associate Quality Lead',            desc: 'Leads QA activities for a project; defines test plans, manages test cycles, and liaises closely with development and PM teams.',                                                         level: 5,  track: 3, color: 'green',  connectsTo: ['ql']   },
  { id: 'ql',   title: 'Quality Lead',                      desc: 'Manages end-to-end testing for complex projects with direct ownership of quality KPIs and release sign-off gates.',                                                                     level: 6,  track: 3, color: 'green',  connectsTo: ['sql']  },
  { id: 'sql',  title: 'Senior Quality Lead',               desc: 'Sets QA processes and tooling standards across the org; actively coaches and develops the quality engineering team.',                                                                       level: 7,  track: 3, color: 'green',  connectsTo: ['apm1'] },

  // ── Business Analysis ─────────────────────────────────────────────────
  { id: 'ba1',  title: 'Business Analyst L1',               desc: 'Gathers and documents business requirements, supports user acceptance testing, and conducts stakeholder walkthroughs.',                                                                         level: 1,  track: 4, color: 'white',  connectsTo: ['ba2']  },
  { id: 'ba2',  title: 'Business Analyst L2',               desc: 'Independently elicits and analyzes requirements; produces Business Requirement Documents and detailed user stories.',                                                                      level: 2,  track: 4, color: 'white',  connectsTo: ['ba3']  },
  { id: 'ba3',  title: 'Business Analyst L3',               desc: 'Bridges business and technology by leading requirement workshops and owning comprehensive functional specifications.',                                                                       level: 3,  track: 4, color: 'white',  connectsTo: ['ba4']  },
  { id: 'ba4',  title: 'Business Analyst L4',               desc: 'Manages requirements across large programs ensuring full traceability from business need through to final delivery.',                                                                         level: 4,  track: 4, color: 'blue',   connectsTo: ['abal'] },
  { id: 'abal', title: 'Associate Business Analyst Lead',   desc: 'Leads BA activities for a project stream, mentors junior analysts, and standardizes documentation and elicitation practices.',                                                             level: 5,  track: 4, color: 'green',  connectsTo: ['bal']  },
  { id: 'bal',  title: 'Business Analyst Lead',             desc: 'Owns end-to-end analysis for complex multi-module projects with strong stakeholder engagement and requirement governance.',                                                                level: 6,  track: 4, color: 'green',  connectsTo: ['sbal'] },
  { id: 'sbal', title: 'Senior Business Analyst Lead',      desc: 'Drives analysis excellence across a portfolio; engages stakeholders at senior levels and shapes BA standards org-wide.',                                                                  level: 7,  track: 4, color: 'green',  connectsTo: ['apm1', 'pman'] },

  // ── Partnership & BD ──────────────────────────────────────────────────
  { id: 'pman', title: 'Partnership Manager',               desc: 'Manages strategic alliances and partner relationships; onboards new partners and drives co-sell revenue generation activities.',                                                               level: 8,  track: 5, color: 'purple', connectsTo: ['sam']  },
  { id: 'sam',  title: 'Senior Alliance Manager',           desc: 'Owns a portfolio of key alliances, negotiates partnership agreements, and aligns partner go-to-market strategies with company goals.',                                                     level: 9,  track: 5, color: 'white',  connectsTo: ['spm']  },
  { id: 'spm',  title: 'Strategy Partnership Manager',      desc: 'Defines long-term partnership strategy, identifies new alliance opportunities, and drives market expansion through strategic partnerships.',                                              level: 10, track: 5, color: 'white',  connectsTo: ['hbd']  },
  { id: 'hbd',  title: 'Head — BD',                         desc: 'Leads the business development function; accountable for pipeline growth, partnership outcomes, and revenue contribution targets.',                                                    level: 11, track: 5, color: 'blue',   connectsTo: ['ad']   },

  // ── Sales ─────────────────────────────────────────────────────────────
  { id: 'bdr',  title: 'Business Dev Representative',       desc: 'Generates qualified leads through outbound prospecting and systematic inbound follow-up to build a healthy sales pipeline.',                                                               level: 1,  track: 6, color: 'white',  connectsTo: ['ae']   },
  { id: 'ae',   title: 'Account Executive',                 desc: 'Manages the full sales cycle for mid-market accounts, builds client relationships, and consistently closes new revenue deals.',                                                        level: 2,  track: 6, color: 'white',  connectsTo: ['sae']  },
  { id: 'sae',  title: 'Senior Account Executive',          desc: 'Handles strategic enterprise accounts, cultivates long-term client partnerships, and consistently exceeds assigned sales targets.',                                                      level: 3,  track: 6, color: 'white',  connectsTo: ['sm']   },
  { id: 'sm',   title: 'Sales Manager',                     desc: 'Leads and coaches the sales team, owns revenue forecasting, and drives the team\'s go-to-market execution and performance.',                                                       level: 8,  track: 6, color: 'purple', connectsTo: ['pman'] },

  // ── Marketing ─────────────────────────────────────────────────────────
  { id: 'me',   title: 'Marketing Executive',               desc: 'Creates and distributes marketing content across digital channels to build brand awareness and support lead generation goals.',                                                             level: 1,  track: 7, color: 'white',  connectsTo: ['sme']  },
  { id: 'sme',  title: 'Senior Marketing Executive',        desc: 'Owns multi-channel campaigns, analyzes performance data, and optimizes programs for engagement and lead generation.',                                                                   level: 2,  track: 7, color: 'white',  connectsTo: ['ms']   },
  { id: 'ms',   title: 'Marketing Specialist',              desc: 'Deep expertise in a marketing discipline (SEO, paid media, or content); drives measurable and sustained channel-specific growth.',                                                    level: 3,  track: 7, color: 'white',  connectsTo: ['mm']   },
  { id: 'mm',   title: 'Marketing Manager',                 desc: 'Manages end-to-end marketing programs, leads a small team, and is accountable for campaign performance and measurable ROI.',                                                       level: 8,  track: 7, color: 'purple', connectsTo: ['hm']   },
  { id: 'hm',   title: 'Head — Marketing',                  desc: 'Leads the marketing function; sets brand strategy, demand generation direction, and aligns marketing outcomes with business objectives.',                                         level: 11, track: 7, color: 'blue',   connectsTo: ['ad']   },
]

const ROLE_MAP = Object.fromEntries(ROLES.map(r => [r.id, r]))

const byLevel: Record<number, Role[]> = {}
ROLES.forEach(r => {
  if (!byLevel[r.level]) byLevel[r.level] = []
  byLevel[r.level].push(r)
})
Object.values(byLevel).forEach(arr => arr.sort((a, b) => a.track - b.track))

// Pre-compute ALL upward incoming connections for each target (used for arrow spread).
// Unlike the grid views, pyramid has no track axis so we spread across all sources.
const allIncoming: Record<string, string[]> = {}
ROLES.forEach(role => {
  role.connectsTo?.forEach(toId => {
    const toRole = ROLE_MAP[toId]
    if (!toRole || toRole.level <= role.level) return
    if (!allIncoming[toId]) allIncoming[toId] = []
    allIncoming[toId].push(role.id)
  })
})
Object.values(allIncoming).forEach(arr => arr.sort((a, b) => ROLE_MAP[a].track - ROLE_MAP[b].track))

// ─── DOM helpers ─────────────────────────────────────────────────────────────
const cx  = (el: HTMLElement, ox: number) => el.getBoundingClientRect().left + el.getBoundingClientRect().width  / 2 - ox
const cy  = (el: HTMLElement, oy: number) => el.getBoundingClientRect().top  + el.getBoundingClientRect().height / 2 - oy
const top = (el: HTMLElement, oy: number) => el.getBoundingClientRect().top    - oy
const bot = (el: HTMLElement, oy: number) => el.getBoundingClientRect().bottom - oy
const lft = (el: HTMLElement, ox: number) => el.getBoundingClientRect().left   - ox
const rgt = (el: HTMLElement, ox: number) => el.getBoundingClientRect().right  - ox

// ─── Path type (includes optional pyramid-outline flag) ──────────────────────
type PathEntry = { d: string; key: string; cross: boolean; isPyrOutline?: boolean }

// ─── Component ────────────────────────────────────────────────────────────────
export default function OrgChartPyramid() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const cardRefs     = useRef<Record<string, HTMLDivElement | null>>({})
  const svgRef       = useRef<SVGSVGElement | null>(null)
  const [paths, setPaths] = useState<PathEntry[]>([])
  const [tip,   setTip]   = useState<{ roleId: string; left: number; caretOffset: number; y: number; above: boolean } | null>(null)

  useEffect(() => {
    const close = () => setTip(null)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  const showTip = (el: HTMLElement, roleId: string) => {
    const rect = el.getBoundingClientRect()
    const above = rect.top > window.innerHeight * 0.45
    const TIP_W  = 264
    const MARGIN = 10
    const idealLeft   = rect.left + rect.width / 2 - TIP_W / 2
    const clampedLeft = Math.max(MARGIN, Math.min(idealLeft, window.innerWidth - TIP_W - MARGIN))
    const caretOffset = Math.max(14, Math.min(rect.left + rect.width / 2 - clampedLeft, TIP_W - 14))
    setTip({ roleId, left: clampedLeft, caretOffset, y: above ? rect.top - 10 : rect.bottom + 10, above })
  }

  useEffect(() => {
    let rafId: number

    const draw = () => {
      const svg  = svgRef.current
      const wrap = containerRef.current
      if (!svg || !wrap) return

      const cr = wrap.getBoundingClientRect()
      const w  = wrap.scrollWidth
      const h  = wrap.scrollHeight

      svg.setAttribute('width',  String(w))
      svg.setAttribute('height', String(h))

      const next: PathEntry[] = []

      // ── Pyramid outline triangle (rendered first = behind connections) ──────
      // Apex at top-center, base spans full container width at the bottom.
      const APEX_MARGIN = 6
      next.push({
        d: `M ${w / 2} ${APEX_MARGIN} L ${w - APEX_MARGIN} ${h - APEX_MARGIN} L ${APEX_MARGIN} ${h - APEX_MARGIN} Z`,
        key: 'pyr-outline',
        cross: false,
        isPyrOutline: true,
      })

      // ── Connection paths ─────────────────────────────────────────────────────
      ROLES.forEach(role => {
        if (!role.connectsTo?.length) return
        const fromEl = cardRefs.current[role.id]
        if (!fromEl) return

        role.connectsTo.forEach(toId => {
          const toEl   = cardRefs.current[toId]
          const toRole = ROLE_MAP[toId]
          if (!toEl || !toRole) return

          let d: string
          let cross = false

          if (role.level === toRole.level) {
            // ── Same row: horizontal stub ────────────────────────────────────
            cross = true
            const midCy = cy(fromEl, cr.top)
            d = role.track < toRole.track
              ? `M ${rgt(fromEl, cr.left)} ${midCy} L ${lft(toEl, cr.left)} ${midCy}`
              : `M ${lft(fromEl, cr.left)} ${midCy} L ${rgt(toEl, cr.left)} ${midCy}`

          } else if (toRole.level > role.level) {
            // ── Upward: exit card TOP, enter card BOTTOM ─────────────────────
            // Level 15 is at screen top, level 1 at bottom.
            // Source (lower level) is lower on screen (larger y).
            // Target (higher level) is higher on screen (smaller y).
            cross = role.track !== toRole.track || (toRole.level - role.level) > 1

            const sx = cx(fromEl, cr.left)
            const sy = top(fromEl, cr.top)   // exit from TOP (upward)
            const tx = cx(toEl, cr.left)
            const ty = bot(toEl, cr.top)     // enter at BOTTOM

            const incoming = allIncoming[toId] ?? []
            const idx      = incoming.indexOf(role.id)
            const total    = incoming.length
            const SPREAD   = 16
            const entryX   = total <= 1 ? tx : tx + (idx - (total - 1) / 2) * SPREAD

            const heightDiff = sy - ty   // positive: source is below target
            const tension    = Math.max(28, heightDiff * 0.44)
            d = `M ${sx} ${sy} C ${sx} ${sy - tension}, ${entryX} ${ty + tension}, ${entryX} ${ty}`

          } else {
            // ── Downward (rare cross-level skip) ─────────────────────────────
            cross = true
            const sx = cx(fromEl, cr.left)
            const sy = bot(fromEl, cr.top)
            const tx = cx(toEl, cr.left)
            const ty = top(toEl, cr.top)
            const tension = Math.max(28, (ty - sy) * 0.44)
            d = `M ${sx} ${sy} C ${sx} ${sy + tension}, ${tx} ${ty - tension}, ${tx} ${ty}`
          }

          next.push({ d, key: `${role.id}→${toId}`, cross })
        })
      })

      setPaths(next)
    }

    rafId = requestAnimationFrame(() => { rafId = requestAnimationFrame(draw) })

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
      <div className="org-page-header">
        <h1 className="org-page-title">Career Growth Path — Pyramid View</h1>
        <div className="org-legend">
          <span className="leg leg-white">Individual Contributor</span>
          <span className="leg leg-blue">Transitioning Level</span>
          <span className="leg leg-green">Lead / Senior Lead</span>
          <span className="leg leg-purple">Management</span>
          <span className="leg leg-yellow">R&amp;D</span>
        </div>
      </div>

      <div className="pyr-scroll-area">
        <div className="pyr-container">
          {/* SVG + rows share the same measured div */}
          <div className="pyr-grid" ref={containerRef}>
            <svg ref={svgRef} className="pyr-svg" aria-hidden="true">
              <defs>
                <marker id="arr-pyr-main"  markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="10" refX="7" refY="5"   orient="auto" overflow="visible">
                  <path d="M 0 0 L 10 5 L 0 10 Z" fill="#475569" />
                </marker>
                <marker id="arr-pyr-cross" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="9"  refX="6" refY="4.5" orient="auto" overflow="visible">
                  <path d="M 0 0 L 9 4.5 L 0 9 Z" fill="#94a3b8" />
                </marker>
              </defs>
              {paths.map(p =>
                p.isPyrOutline ? (
                  <path
                    key={p.key}
                    d={p.d}
                    fill="rgba(219,234,254,0.13)"
                    stroke="rgba(26,52,97,0.22)"
                    strokeWidth="1.5"
                    strokeDasharray="8 5"
                  />
                ) : (
                  <path
                    key={p.key}
                    d={p.d}
                    stroke={p.cross ? '#94a3b8' : '#475569'}
                    strokeWidth={2}
                    fill="none"
                    markerEnd={p.cross ? 'url(#arr-pyr-cross)' : 'url(#arr-pyr-main)'}
                  />
                )
              )}
            </svg>

            {/* Render level 15 at top → level 1 at bottom */}
            {Array.from({ length: LEVELS }, (_, i) => LEVELS - i).map(level => {
              const roles = byLevel[level] ?? []
              if (!roles.length) return null

              return (
                <div key={level} className="pyr-row">
                  <span className="pyr-badge">L{level}</span>
                  <div className="pyr-cards">
                    {roles.map(role => (
                      <div
                        key={role.id}
                        ref={el => { cardRefs.current[role.id] = el }}
                        className={`pyr-card org-${role.color}`}
                        onMouseEnter={e => showTip(e.currentTarget, role.id)}
                        onMouseLeave={() => setTip(null)}
                        onClick={e => {
                          e.stopPropagation()
                          tip?.roleId === role.id ? setTip(null) : showTip(e.currentTarget, role.id)
                        }}
                      >
                        {role.title}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

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
    </main>
  )
}
