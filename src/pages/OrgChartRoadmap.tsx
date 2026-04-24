import { useEffect, useRef, useState } from 'react'
import './OrgChart.css'
import './OrgChartRoadmap.css'

// ─── Types ───────────────────────────────────────────────────────────────────
type ColorKey = 'white' | 'green' | 'blue' | 'purple' | 'yellow'

type Role = {
  id: string
  title: string
  desc: string
  level: number   // 1-based column (career seniority — L1 = leftmost, L15 = rightmost)
  track: number   // 0-based row  (function — Engineering at top, Marketing at bottom)
  color: ColorKey
  connectsTo?: string[]
}

// ─── Track (row) labels ───────────────────────────────────────────────────────
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
const LEVELS = 15

// ─── Role data ────────────────────────────────────────────────────────────────
const ROLES: Role[] = [
  { id: 'ase',  title: 'Associate Software Engineer',       desc: 'Entry-level role focused on learning and executing assigned tasks under senior guidance.',                                            level: 1,  track: 0, color: 'white',  connectsTo: ['se']   },
  { id: 'se',   title: 'Software Engineer',                 desc: 'Independently develops and maintains features, writes clean code, and participates in code reviews.',                                level: 2,  track: 0, color: 'white',  connectsTo: ['sse1'] },
  { id: 'sse1', title: 'Senior Software Engineer L1',       desc: 'Delivers complex features with minimal guidance, begins mentoring junior engineers.',                                                level: 3,  track: 0, color: 'white',  connectsTo: ['sse2'] },
  { id: 'sse2', title: 'Senior Software Engineer L2',       desc: 'Drives technical design for features, leads peer code reviews, and contributes to architecture discussions.',                        level: 4,  track: 0, color: 'blue',   connectsTo: ['sse3', 'atl'] },
  { id: 'sse3', title: 'Senior Software Engineer L3',       desc: 'Owns end-to-end delivery of full modules, shapes the team-level technical roadmap.',                                                level: 5,  track: 0, color: 'green',  connectsTo: ['pse1'] },
  { id: 'pse1', title: 'Principal Software Engineer L1',    desc: 'Principal engineer with cross-team impact; leads design reviews and establishes engineering best practices.',                        level: 6,  track: 0, color: 'green',  connectsTo: ['pse2', 'tl'] },
  { id: 'pse2', title: 'Principal Software Engineer L2',    desc: 'Drives system-level architecture across multiple teams; key technical advisor for product decisions.',                              level: 7,  track: 0, color: 'green',  connectsTo: ['pse3', 'asa1'] },
  { id: 'pse3', title: 'Principal Software Engineer L3',    desc: 'Organization-wide engineering authority; defines long-term technical strategy.',                                                    level: 8,  track: 0, color: 'purple', connectsTo: ['asa1'] },

  { id: 'atl',  title: 'Associate Technical Lead',          desc: 'Leads a small engineering pod balancing hands-on coding with technical decision-making.',                                            level: 5,  track: 1, color: 'green',  connectsTo: ['tl']   },
  { id: 'tl',   title: 'Technical Lead',                    desc: 'Owns end-to-end technical delivery of a project stream; coordinates across developers and QA.',                                    level: 6,  track: 1, color: 'green',  connectsTo: ['stl']  },
  { id: 'stl',  title: 'Senior Technical Lead',             desc: 'Oversees multiple project workstreams; accountable for technical excellence and team capability.',                                  level: 7,  track: 1, color: 'green',  connectsTo: ['asa1', 'apm1'] },
  { id: 'asa1', title: 'Associate Solution Architect L1',   desc: 'Designs scalable solution blueprints and collaborates on technical feasibility.',                                                    level: 8,  track: 1, color: 'purple', connectsTo: ['asa2'] },
  { id: 'asa2', title: 'Associate Solution Architect L2',   desc: 'Architects complex multi-service solutions and defines integration patterns.',                                                      level: 9,  track: 1, color: 'white',  connectsTo: ['sa1']  },
  { id: 'sa1',  title: 'Solution Architect L1',             desc: 'Senior architect accountable for enterprise-grade solution design and technical governance.',                                        level: 10, track: 1, color: 'purple', connectsTo: ['sa2']  },
  { id: 'sa2',  title: 'Solution Architect L2',             desc: 'Principal solution architect setting cross-org architecture standards and driving the long-term technical vision.',                  level: 11, track: 1, color: 'purple', connectsTo: ['hpd', 'rd'] },
  { id: 'rd',   title: 'R&D',                               desc: 'Leads research and innovation by exploring emerging technologies.',                                                                  level: 15, track: 1, color: 'yellow' },

  { id: 'apm1', title: 'Associate Project Manager L1',      desc: 'Assists in project planning and tracks deliverables to support on-time delivery.',                                                  level: 8,  track: 2, color: 'purple', connectsTo: ['apm2'] },
  { id: 'apm2', title: 'Associate Project Manager L2',      desc: 'Manages small-to-mid size projects end-to-end with growing accountability.',                                                        level: 9,  track: 2, color: 'white',  connectsTo: ['pm1']  },
  { id: 'pm1',  title: 'Project Manager L1',                desc: 'Independently manages full project delivery and owns stakeholder communication.',                                                    level: 10, track: 2, color: 'purple', connectsTo: ['pm2']  },
  { id: 'pm2',  title: 'Project Manager L2',                desc: 'Leads complex multi-team projects and mentors junior project managers.',                                                            level: 11, track: 2, color: 'purple', connectsTo: ['hpd']  },
  { id: 'hpd',  title: 'Head — Project & Delivery',         desc: 'Oversees the full delivery portfolio, sets delivery standards.',                                                                    level: 12, track: 2, color: 'blue',   connectsTo: ['ad']   },
  { id: 'ad',   title: 'Associate Director',                desc: 'Cross-domain leader driving strategic programs and managing senior client relationships.',                                          level: 13, track: 2, color: 'blue',   connectsTo: ['dir']  },
  { id: 'dir',  title: 'Director',                          desc: 'Senior leader responsible for department-level strategy, talent development, and P&L management.',                                  level: 14, track: 2, color: 'blue',   connectsTo: ['vp']   },
  { id: 'vp',   title: 'Vice President',                    desc: 'Executive overseeing the entire business unit; sets company vision and drives revenue growth.',                                     level: 15, track: 2, color: 'blue'  },

  { id: 'te1',  title: 'Testing Engineer L1',               desc: 'Executes manual test cases and builds foundational knowledge of testing tools.',                                                    level: 1,  track: 3, color: 'white',  connectsTo: ['te2']  },
  { id: 'te2',  title: 'Testing Engineer L2',               desc: 'Writes automated test scripts and improves test coverage across modules.',                                                          level: 2,  track: 3, color: 'white',  connectsTo: ['te3']  },
  { id: 'te3',  title: 'Testing Engineer L3',               desc: 'Designs test strategies for product features and leads structured test planning.',                                                  level: 3,  track: 3, color: 'white',  connectsTo: ['te4']  },
  { id: 'te4',  title: 'Testing Engineer L4',               desc: 'Owns quality assurance for a product area and drives defect prevention initiatives.',                                               level: 4,  track: 3, color: 'blue',   connectsTo: ['aql']  },
  { id: 'aql',  title: 'Associate Quality Lead',            desc: 'Leads QA activities for a project and manages test cycles.',                                                                        level: 5,  track: 3, color: 'green',  connectsTo: ['ql']   },
  { id: 'ql',   title: 'Quality Lead',                      desc: 'Manages end-to-end testing with direct ownership of quality KPIs.',                                                                level: 6,  track: 3, color: 'green',  connectsTo: ['sql']  },
  { id: 'sql',  title: 'Senior Quality Lead',               desc: 'Sets QA processes and tooling standards across the org.',                                                                           level: 7,  track: 3, color: 'green',  connectsTo: ['apm1'] },

  { id: 'ba1',  title: 'Business Analyst L1',               desc: 'Gathers and documents business requirements and supports user acceptance testing.',                                                level: 1,  track: 4, color: 'white',  connectsTo: ['ba2']  },
  { id: 'ba2',  title: 'Business Analyst L2',               desc: 'Independently elicits and analyzes requirements and produces Business Requirement Documents.',                                      level: 2,  track: 4, color: 'white',  connectsTo: ['ba3']  },
  { id: 'ba3',  title: 'Business Analyst L3',               desc: 'Bridges business and technology by leading requirement workshops.',                                                                 level: 3,  track: 4, color: 'white',  connectsTo: ['ba4']  },
  { id: 'ba4',  title: 'Business Analyst L4',               desc: 'Manages requirements across large programs ensuring full traceability.',                                                            level: 4,  track: 4, color: 'blue',   connectsTo: ['abal'] },
  { id: 'abal', title: 'Associate Business Analyst Lead',   desc: 'Leads BA activities for a project stream and mentors junior analysts.',                                                            level: 5,  track: 4, color: 'green',  connectsTo: ['bal']  },
  { id: 'bal',  title: 'Business Analyst Lead',             desc: 'Owns end-to-end analysis for complex multi-module projects.',                                                                       level: 6,  track: 4, color: 'green',  connectsTo: ['sbal'] },
  { id: 'sbal', title: 'Senior Business Analyst Lead',      desc: 'Drives analysis excellence across a portfolio; engages stakeholders at senior levels.',                                            level: 7,  track: 4, color: 'green',  connectsTo: ['apm1', 'pman'] },

  { id: 'pman', title: 'Partnership Manager',               desc: 'Manages strategic alliances and partner relationships.',                                                                            level: 8,  track: 5, color: 'purple', connectsTo: ['sam']  },
  { id: 'sam',  title: 'Senior Alliance Manager',           desc: 'Owns a portfolio of key alliances and negotiates partnership agreements.',                                                          level: 9,  track: 5, color: 'white',  connectsTo: ['spm']  },
  { id: 'spm',  title: 'Strategy Partnership Manager',      desc: 'Defines long-term partnership strategy and identifies new alliance opportunities.',                                                level: 10, track: 5, color: 'white',  connectsTo: ['hbd']  },
  { id: 'hbd',  title: 'Head — BD',                         desc: 'Leads the business development function; accountable for pipeline growth and revenue contribution.',                               level: 11, track: 5, color: 'blue',   connectsTo: ['ad']   },

  { id: 'bdr',  title: 'Business Dev Representative',       desc: 'Generates qualified leads through outbound prospecting.',                                                                           level: 1,  track: 6, color: 'white',  connectsTo: ['ae']   },
  { id: 'ae',   title: 'Account Executive',                 desc: 'Manages the full sales cycle for mid-market accounts.',                                                                             level: 2,  track: 6, color: 'white',  connectsTo: ['sae']  },
  { id: 'sae',  title: 'Senior Account Executive',          desc: 'Handles strategic enterprise accounts and consistently exceeds assigned sales targets.',                                            level: 3,  track: 6, color: 'white',  connectsTo: ['sm']   },
  { id: 'sm',   title: 'Sales Manager',                     desc: 'Leads and coaches the sales team, owns revenue forecasting.',                                                                       level: 8,  track: 6, color: 'purple', connectsTo: ['pman'] },

  { id: 'me',   title: 'Marketing Executive',               desc: 'Creates and distributes marketing content to build brand awareness.',                                                               level: 1,  track: 7, color: 'white',  connectsTo: ['sme']  },
  { id: 'sme',  title: 'Senior Marketing Executive',        desc: 'Owns multi-channel campaigns and analyzes performance data.',                                                                       level: 2,  track: 7, color: 'white',  connectsTo: ['ms']   },
  { id: 'ms',   title: 'Marketing Specialist',              desc: 'Deep expertise in a marketing discipline; drives measurable channel-specific growth.',                                             level: 3,  track: 7, color: 'white',  connectsTo: ['mm']   },
  { id: 'mm',   title: 'Marketing Manager',                 desc: 'Manages end-to-end marketing programs and is accountable for campaign ROI.',                                                       level: 8,  track: 7, color: 'purple', connectsTo: ['hm']   },
  { id: 'hm',   title: 'Head — Marketing',                  desc: 'Leads the marketing function; sets brand strategy and demand generation direction.',                                               level: 11, track: 7, color: 'blue',   connectsTo: ['ad']   },
]

const ROLE_MAP = Object.fromEntries(ROLES.map(r => [r.id, r]))

// byTrack: track → roles sorted by level (left→right order)
const byTrack: Record<number, Role[]> = {}
ROLES.forEach(r => {
  if (!byTrack[r.track]) byTrack[r.track] = []
  byTrack[r.track].push(r)
})
Object.values(byTrack).forEach(arr => arr.sort((a, b) => a.level - b.level))

// ─── Pre-compute cross-track incoming per target ────────────────────────────
// Tracks increase downward: track 0 = top row, track 7 = bottom row.
// "From above" = source.track < target.track  → arrowhead enters target TOP edge
// "From below" = source.track > target.track  → arrowhead enters target BOTTOM edge
const incomingFromAbove: Record<string, string[]> = {}
const incomingFromBelow: Record<string, string[]> = {}

ROLES.forEach(role => {
  role.connectsTo?.forEach(toId => {
    const toRole = ROLE_MAP[toId]
    if (!toRole || role.track === toRole.track) return
    if (role.track < toRole.track) {
      if (!incomingFromAbove[toId]) incomingFromAbove[toId] = []
      incomingFromAbove[toId].push(role.id)
    } else {
      if (!incomingFromBelow[toId]) incomingFromBelow[toId] = []
      incomingFromBelow[toId].push(role.id)
    }
  })
})
// Sort by source level so left→right order is consistent for spread
Object.values(incomingFromAbove).forEach(arr => arr.sort((a, b) => ROLE_MAP[a].level - ROLE_MAP[b].level))
Object.values(incomingFromBelow).forEach(arr => arr.sort((a, b) => ROLE_MAP[a].level - ROLE_MAP[b].level))

// ─── DOM helpers ─────────────────────────────────────────────────────────────
const cx  = (el: HTMLElement, ox: number) => el.getBoundingClientRect().left + el.getBoundingClientRect().width  / 2 - ox
const cy  = (el: HTMLElement, oy: number) => el.getBoundingClientRect().top  + el.getBoundingClientRect().height / 2 - oy
const top = (el: HTMLElement, oy: number) => el.getBoundingClientRect().top    - oy
const bot = (el: HTMLElement, oy: number) => el.getBoundingClientRect().bottom - oy
const lft = (el: HTMLElement, ox: number) => el.getBoundingClientRect().left   - ox
const rgt = (el: HTMLElement, ox: number) => el.getBoundingClientRect().right  - ox

// ─── Component ────────────────────────────────────────────────────────────────
export default function OrgChartRoadmap() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const cardRefs     = useRef<Record<string, HTMLDivElement | null>>({})
  const svgRef       = useRef<SVGSVGElement | null>(null)
  const [paths, setPaths] = useState<{ d: string; key: string; cross: boolean }[]>([])
  const [tip, setTip] = useState<{ roleId: string; left: number; caretOffset: number; y: number; above: boolean } | null>(null)

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
      svg.setAttribute('width',  String(wrap.scrollWidth))
      svg.setAttribute('height', String(wrap.scrollHeight))

      const next: { d: string; key: string; cross: boolean }[] = []

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

          if (role.track === toRole.track) {
            // ── Same lane (row): horizontal rightward arrow ───────────────────
            // Source level < target level → source is to the LEFT of target.
            // Exit right edge of source, enter left edge of target.
            cross = (toRole.level - role.level) > 1   // skip-level = lighter style
            const srcX    = rgt(fromEl, cr.left)
            const srcY    = cy(fromEl, cr.top)
            const tgtX    = lft(toEl, cr.left)
            const tgtY    = cy(toEl, cr.top)
            const tension = Math.max(18, (tgtX - srcX) * 0.38)
            d = `M ${srcX} ${srcY} C ${srcX + tension} ${srcY}, ${tgtX - tension} ${tgtY}, ${tgtX} ${tgtY}`

          } else if (role.track < toRole.track) {
            // ── Cross-lane going DOWN (source row is above target row) ────────
            // Source exits from BOTTOM; target entry from TOP.
            // Spread arrowheads across the TOP edge of the target card.
            cross = true
            const sx      = cx(fromEl, cr.left)
            const sy      = bot(fromEl, cr.top)
            const tx      = cx(toEl,   cr.left)
            const ty      = top(toEl,  cr.top)
            const incoming = incomingFromAbove[toId] ?? []
            const idx      = incoming.indexOf(role.id)
            const total    = incoming.length
            const SPREAD   = 16
            const entryX   = total <= 1 ? tx : tx + (idx - (total - 1) / 2) * SPREAD
            const tension  = Math.max(28, (ty - sy) * 0.46)
            d = `M ${sx} ${sy} C ${sx} ${sy + tension}, ${entryX} ${ty - tension}, ${entryX} ${ty}`

          } else {
            // ── Cross-lane going UP (source row is below target row) ──────────
            // Source exits from TOP; target entry from BOTTOM.
            // Spread arrowheads across the BOTTOM edge of the target card.
            cross = true
            const sx      = cx(fromEl, cr.left)
            const sy      = top(fromEl, cr.top)
            const tx      = cx(toEl,   cr.left)
            const ty      = bot(toEl,  cr.top)
            const incoming = incomingFromBelow[toId] ?? []
            const idx      = incoming.indexOf(role.id)
            const total    = incoming.length
            const SPREAD   = 16
            const entryX   = total <= 1 ? tx : tx + (idx - (total - 1) / 2) * SPREAD
            const tension  = Math.max(28, (sy - ty) * 0.46)
            d = `M ${sx} ${sy} C ${sx} ${sy - tension}, ${entryX} ${ty + tension}, ${entryX} ${ty}`
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
        <h1 className="org-page-title">Career Growth Path — Roadmap View</h1>
        <div className="org-legend">
          <span className="leg leg-white">Individual Contributor</span>
          <span className="leg leg-blue">Transitioning Level</span>
          <span className="leg leg-green">Lead / Senior Lead</span>
          <span className="leg leg-purple">Management</span>
          <span className="leg leg-yellow">R&amp;D</span>
        </div>
      </div>

      <div className="rdmap-scroll-area">
        <div className="rdmap-outer">

          {/* ── Level column headers ── */}
          <div className="rdmap-level-header" aria-hidden="true">
            <div className="rdmap-corner-cell">Track / Level</div>
            {Array.from({ length: LEVELS }, (_, i) => i + 1).map(lvl => (
              <div key={lvl} className="rdmap-level-label">L{lvl}</div>
            ))}
          </div>

          {/* ── Track rows + SVG overlay ── */}
          <div className="rdmap-grid" ref={containerRef}>
            <svg ref={svgRef} className="rdmap-svg" aria-hidden="true">
              <defs>
                <marker id="arr-rdmap-main"  markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="10" refX="7" refY="5"   orient="auto" overflow="visible">
                  <path d="M 0 0 L 10 5 L 0 10 Z" fill="#475569" />
                </marker>
                <marker id="arr-rdmap-cross" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="9"  refX="6" refY="4.5" orient="auto" overflow="visible">
                  <path d="M 0 0 L 9 4.5 L 0 9 Z" fill="#94a3b8" />
                </marker>
              </defs>
              {paths.map(p => (
                <path
                  key={p.key}
                  d={p.d}
                  stroke={p.cross ? '#94a3b8' : '#475569'}
                  strokeWidth={2}
                  fill="none"
                  markerEnd={p.cross ? 'url(#arr-rdmap-cross)' : 'url(#arr-rdmap-main)'}
                />
              ))}
            </svg>

            {TRACKS.map((trackName, trackIdx) => (
              <div key={trackIdx} className="rdmap-row">
                {/* Track label */}
                <div className="rdmap-track-label">{trackName}</div>

                {/* One cell per level */}
                {Array.from({ length: LEVELS }, (_, i) => i + 1).map(lvl => {
                  const role = (byTrack[trackIdx] ?? []).find(r => r.level === lvl) ?? null
                  return (
                    <div key={lvl} className="rdmap-cell">
                      {role && (
                        <div
                          ref={el => { cardRefs.current[role.id] = el }}
                          className={`rdmap-card org-${role.color}`}
                          onMouseEnter={e => showTip(e.currentTarget, role.id)}
                          onMouseLeave={() => setTip(null)}
                          onClick={e => {
                            e.stopPropagation()
                            tip?.roleId === role.id ? setTip(null) : showTip(e.currentTarget, role.id)
                          }}
                        >
                          {role.title}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
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
