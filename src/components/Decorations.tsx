import type { CSSProperties } from 'react'

type SvgProps = {
  size?: number
  color?: string
  style?: CSSProperties
  className?: string
}

const base = (size: number, vb = '0 0 100 100') => ({
  width: size,
  height: size,
  viewBox: vb,
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
})

export function Star({ size = 28, color = '#D64545', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      <path
        d="M50 8 L60 38 L92 40 L66 60 L75 90 L50 72 L25 90 L34 60 L8 40 L40 38 Z"
        fill={color}
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
        transform="rotate(-3 50 50)"
      />
    </svg>
  )
}

export function Sparkle({ size = 24, color = '#E8A93C', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      <path
        d="M50 10 C52 35 65 48 90 50 C65 52 52 65 50 90 C48 65 35 52 10 50 C35 48 48 35 50 10 Z"
        fill={color}
      />
      <circle cx="80" cy="22" r="5" fill={color} opacity="0.7" />
      <circle cx="20" cy="80" r="4" fill={color} opacity="0.6" />
    </svg>
  )
}

export function Heart({ size = 22, color = '#D64545', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      <path
        d="M50 88 C20 65 10 45 22 30 C33 17 48 22 50 35 C52 22 67 17 78 30 C90 45 80 65 50 88 Z"
        fill={color}
        stroke={color}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Arrow({ size = 70, color = '#2B2218', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 120 60')} style={style} className={className}>
      <path
        d="M8 38 C30 12 70 12 100 30"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M88 18 L104 30 L90 42"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function Squiggle({ size = 120, color = '#2B2218', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 200 30')} style={style} className={className}>
      <path
        d="M5 18 C25 4 35 4 55 18 S85 32 105 18 S135 4 155 18 S185 32 195 14"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function Underline({ size = 160, color = '#FFE05E', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 200 24')} style={style} className={className}>
      <path
        d="M6 14 C40 20 90 8 130 14 C160 18 180 10 194 12"
        stroke={color}
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
    </svg>
  )
}

export function Circle({ size = 90, color = '#D64545', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      <path
        d="M50 12 C78 12 90 28 90 50 C90 74 76 90 50 90 C24 90 10 72 12 48 C14 26 26 12 50 12 Z"
        stroke={color}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Asterisk({ size = 26, color = '#2B2218', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      <g stroke={color} strokeWidth="4" strokeLinecap="round">
        <line x1="50" y1="14" x2="50" y2="86" />
        <line x1="18" y1="32" x2="82" y2="68" />
        <line x1="82" y1="32" x2="18" y2="68" />
      </g>
    </svg>
  )
}

export function Flower({ size = 30, color = '#E8869B', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      <g fill={color}>
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse
            key={r}
            cx="50"
            cy="28"
            rx="11"
            ry="18"
            transform={`rotate(${r} 50 50)`}
            opacity="0.92"
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="9" fill="#E8A93C" />
    </svg>
  )
}

export function PushPin({ size = 26, color = '#D64545', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      <path d="M50 55 L50 92" stroke="#888" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <circle cx="50" cy="40" r="20" fill={color} />
      <circle cx="44" cy="34" r="6" fill="#fff" opacity="0.5" />
      <path d="M50 60 L46 72 L54 72 Z" fill={color} />
    </svg>
  )
}

export function PaperClip({ size = 40, color = '#9AA5B1', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 60 100')} style={style} className={className}>
      <path
        d="M42 14 C30 14 22 24 22 38 L22 70 C22 80 28 86 36 86 C44 86 48 80 48 72 L48 40 C48 34 44 30 40 30 C36 30 34 34 34 40 L34 66"
        stroke={color}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function WashiTape({
  width = 130,
  color = '#F5B8C9',
  pattern,
  style,
  className,
}: {
  width?: number
  color?: string
  pattern?: 'dots' | 'stripes' | 'checker' | 'gingham' | 'solid'
  style?: CSSProperties
  className?: string
}) {
  return (
    <div
      className={'washi-tape ' + (pattern ? `wp-${pattern} ` : '') + (className ?? '')}
      style={{
        width,
        backgroundColor: color,
        ...style,
      }}
    />
  )
}

export function Stamp({
  text,
  color = '#B23A48',
  style,
  className,
}: {
  text: string
  color?: string
  style?: CSSProperties
  className?: string
}) {
  return (
    <div
      className={'stamp ' + (className ?? '')}
      style={{ color, borderColor: color, ...style }}
    >
      <span className="stamp-inner" style={{ borderColor: color }}>
        {text}
      </span>
    </div>
  )
}

export function CheckMark({ size = 26, color = '#3B8C5A', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      <path
        d="M18 52 L40 76 L84 24"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function Sun({ size = 40, color = '#E8A93C', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      <circle cx="50" cy="50" r="18" fill={color} />
      <g stroke={color} strokeWidth="5" strokeLinecap="round">
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180
          return (
            <line
              key={i}
              x1={50 + Math.cos(a) * 26}
              y1={50 + Math.sin(a) * 26}
              x2={50 + Math.cos(a) * 36}
              y2={50 + Math.sin(a) * 36}
            />
          )
        })}
      </g>
    </svg>
  )
}

export function Cross({ size = 20, color = '#2B2218', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      <g stroke={color} strokeWidth="6" strokeLinecap="round">
        <line x1="26" y1="26" x2="74" y2="74" />
        <line x1="74" y1="26" x2="26" y2="74" />
      </g>
    </svg>
  )
}

export function TinyStar({ size = 18, color = '#E8A93C', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      <path
        d="M50 8 L54 46 L92 50 L54 54 L50 92 L46 54 L8 50 L46 46 Z"
        fill={color}
      />
    </svg>
  )
}

export function Triangle({ size = 26, color = '#3B8C5A', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      <path
        d="M50 12 L88 82 L12 82 Z"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Spiral({ size = 26, color = '#2C6DA8', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      <path
        d="M50 50 m0 0 a4 4 0 1 1 8 0 a10 10 0 1 1 -20 0 a18 18 0 1 1 36 0 a28 28 0 1 1 -56 0"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Dot({ size = 10, color = '#2B2218', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      <circle cx="50" cy="50" r="40" fill={color} />
    </svg>
  )
}

export function Scribble({ size = 70, color = '#2B2218', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 120 60')} style={style} className={className}>
      <path
        d="M8 30 C20 14 34 46 48 30 S74 14 88 30 S108 46 114 28"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function ZigZag({ size = 80, color = '#D64545', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 160 30')} style={style} className={className}>
      <path
        d="M6 22 L26 8 L46 22 L66 8 L86 22 L106 8 L126 22 L146 8 L156 18"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Diamond({ size = 22, color = '#B23A48', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      <path d="M50 8 L88 50 L50 92 L12 50 Z" fill={color} />
    </svg>
  )
}

/* ============================================================
   scrapbook materials
   ============================================================ */

export function Sprig({ size = 80, color = '#7E9B6E', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 60 120')} style={style} className={className}>
      <path d="M30 116 C30 86 30 54 30 14" stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {[24, 40, 56, 72, 88].map((y, i) => {
        const flip = i % 2 === 0
        return (
          <g key={i} transform={`translate(30 ${y}) rotate(${flip ? -32 : 32})`}>
            <ellipse cx={flip ? -16 : 16} cy="0" rx="14" ry="5.5" fill={color} opacity="0.65" />
            <path d={`M0 0 L ${flip ? -28 : 28} 0`} stroke={color} strokeWidth="1.4" opacity="0.7" />
          </g>
        )
      })}
      <circle cx="30" cy="12" r="4" fill={color} />
      <circle cx="22" cy="20" r="3" fill={color} opacity="0.8" />
      <circle cx="38" cy="22" r="3" fill={color} opacity="0.8" />
    </svg>
  )
}

export function Doily({ size = 90, color = '#FBF7EE', style, className }: SvgProps) {
  const scallops = Array.from({ length: 18 }).map((_, i) => {
    const a = (i / 18) * Math.PI * 2
    return { cx: 50 + Math.cos(a) * 42, cy: 50 + Math.sin(a) * 42 }
  })
  return (
    <svg {...base(size)} style={style} className={className}>
      <g fill={color} stroke="rgba(43,34,24,0.10)" strokeWidth="0.6">
        {scallops.map((s, i) => (
          <circle key={i} cx={s.cx} cy={s.cy} r="9.5" />
        ))}
      </g>
      <circle cx="50" cy="50" r="35" fill={color} stroke="rgba(43,34,24,0.12)" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(43,34,24,0.18)" strokeWidth="0.7" strokeDasharray="1.6 3" />
      <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(43,34,24,0.16)" strokeWidth="0.7" />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2
        return <circle key={i} cx={50 + Math.cos(a) * 24} cy={50 + Math.sin(a) * 24} r="1.3" fill="rgba(43,34,24,0.25)" />
      })}
      <circle cx="50" cy="50" r="3" fill="rgba(43,34,24,0.18)" />
    </svg>
  )
}

export function PostageStamp({
  color = '#B23A48',
  label = '★',
  style,
  className,
}: {
  color?: string
  label?: string
  style?: CSSProperties
  className?: string
}) {
  return (
    <div className={'postage ' + (className ?? '')} style={{ borderColor: color, color, ...style }}>
      <div className="postage-inner" style={{ borderColor: color }}>
        <span className="postage-mark">{label}</span>
      </div>
    </div>
  )
}

export function TicketStub({
  color = '#2C6DA8',
  main = 'ADMIT ONE',
  no = '07',
  style,
  className,
}: {
  color?: string
  main?: string
  no?: string
  style?: CSSProperties
  className?: string
}) {
  return (
    <div className={'ticket ' + (className ?? '')} style={{ ['--tc' as string]: color, ...style } as CSSProperties}>
      <div className="ticket-main">{main}</div>
      <div className="ticket-perf" />
      <div className="ticket-stub">№ {no}</div>
    </div>
  )
}

export function Tag({
  color = '#E8A93C',
  label = 'tag',
  style,
  className,
}: {
  color?: string
  label?: string
  style?: CSSProperties
  className?: string
}) {
  return (
    <div className={'sctag ' + (className ?? '')} style={{ borderColor: color, color, ...style }}>
      <div className="tag-string" style={{ borderColor: color }} />
      <div className="tag-hole" />
      <span className="tag-label">{label}</span>
    </div>
  )
}

export function ConfettiBit({
  color = '#D64545',
  round = false,
  style,
  className,
}: {
  color?: string
  round?: boolean
  style?: CSSProperties
  className?: string
}) {
  return (
    <div
      className={'confetti ' + (round ? 'cb-round ' : '') + (className ?? '')}
      style={{ background: color, ...style }}
    />
  )
}

export function Thread({ size = 100, color = '#9AA5B1', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 120 40')} style={style} className={className}>
      <path
        d="M4 24 C30 4 50 40 76 20 S108 6 116 22"
        stroke={color}
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="0.5 4"
      />
    </svg>
  )
}

/* ============================================================
   kawaii (cute) materials
   ============================================================ */

export function KawaiiStar({ size = 64, color = '#FFD66B', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      <path
        d="M50 6 L61 38 L95 38 L67 58 L78 92 L50 72 L22 92 L33 58 L5 38 L39 38 Z"
        fill={color}
        stroke="#2B2218"
        strokeWidth="2.6"
        strokeLinejoin="round"
        transform="rotate(-3 50 50)"
      />
      <circle cx="40" cy="48" r="3" fill="#2B2218" />
      <circle cx="60" cy="48" r="3" fill="#2B2218" />
      <path d="M42 58 Q50 66 58 58" stroke="#2B2218" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <circle cx="33" cy="56" r="3.6" fill="#FF8FA3" opacity="0.6" />
      <circle cx="67" cy="56" r="3.6" fill="#FF8FA3" opacity="0.6" />
    </svg>
  )
}

export function KawaiiCloud({ size = 78, color = '#D4C5F9', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 100 80')} style={style} className={className}>
      <path
        d="M22 70 C6 70 6 50 22 50 C20 32 44 26 50 42 C56 26 82 30 80 48 C94 46 96 70 80 70 Z"
        fill={color}
        stroke="#2B2218"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <circle cx="38" cy="52" r="2.8" fill="#2B2218" />
      <circle cx="62" cy="52" r="2.8" fill="#2B2218" />
      <path d="M40 60 Q50 66 60 60" stroke="#2B2218" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="31" cy="58" r="3" fill="#FF8FA3" opacity="0.55" />
      <circle cx="69" cy="58" r="3" fill="#FF8FA3" opacity="0.55" />
    </svg>
  )
}

export function KawaiiHeart({ size = 52, color = '#FF8FA3', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      <path
        d="M50 86 C18 62 10 42 22 28 C33 16 47 21 50 33 C53 21 67 16 78 28 C90 42 82 62 50 86 Z"
        fill={color}
        stroke="#2B2218"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <circle cx="40" cy="46" r="2.6" fill="#2B2218" />
      <circle cx="60" cy="46" r="2.6" fill="#2B2218" />
      <path d="M42 54 Q50 61 58 54" stroke="#2B2218" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="34" cy="52" r="3" fill="#fff" opacity="0.5" />
    </svg>
  )
}

export function Daisy({ size = 56, color = '#FFB3C6', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
        <ellipse
          key={r}
          cx="50"
          cy="24"
          rx="9"
          ry="17"
          fill={color}
          stroke="#2B2218"
          strokeWidth="2"
          transform={`rotate(${r} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="13" fill="#FFD66B" stroke="#2B2218" strokeWidth="2.2" />
      <circle cx="46" cy="48" r="1.7" fill="#2B2218" />
      <circle cx="54" cy="48" r="1.7" fill="#2B2218" />
      <path d="M46 53 Q50 57 54 53" stroke="#2B2218" strokeWidth="1.7" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function Mushroom({ size = 50, color = '#FF8FA3', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      <path d="M14 52 C14 30 34 14 50 14 C66 14 86 30 86 52 Z" fill={color} stroke="#2B2218" strokeWidth="2.6" strokeLinejoin="round" />
      <circle cx="34" cy="34" r="5" fill="#FBF7EE" />
      <circle cx="60" cy="30" r="4" fill="#FBF7EE" />
      <circle cx="50" cy="44" r="3.5" fill="#FBF7EE" />
      <path d="M34 52 L34 86 C34 90 66 90 66 86 L66 52 Z" fill="#FBF7EE" stroke="#2B2218" strokeWidth="2.6" strokeLinejoin="round" />
      <circle cx="43" cy="68" r="2" fill="#2B2218" />
      <circle cx="57" cy="68" r="2" fill="#2B2218" />
      <path d="M45 76 Q50 80 55 76" stroke="#2B2218" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="37" cy="74" r="2.4" fill="#FF8FA3" opacity="0.6" />
      <circle cx="63" cy="74" r="2.4" fill="#FF8FA3" opacity="0.6" />
    </svg>
  )
}

export function KawaiiRainbow({ size = 72, style, className }: SvgProps) {
  const arcs = ['#FF8FA3', '#FFCBA0', '#FFE9A0', '#B5E3D0', '#B5D9F2', '#D4C5F9']
  return (
    <svg {...base(size, '0 0 100 80')} style={style} className={className}>
      {arcs.map((c, i) => {
        const R = 32 - i * 5
        return (
          <path
            key={i}
            d={`M${50 - R} 64 A${R} ${R} 0 0 1 ${50 + R} 64`}
            fill="none"
            stroke={c}
            strokeWidth="5"
            strokeLinecap="round"
          />
        )
      })}
      <ellipse cx="18" cy="64" rx="14" ry="9" fill="#FBF7EE" stroke="#2B2218" strokeWidth="2.2" />
      <ellipse cx="82" cy="64" rx="14" ry="9" fill="#FBF7EE" stroke="#2B2218" strokeWidth="2.2" />
      <circle cx="15" cy="63" r="1.3" fill="#2B2218" />
      <circle cx="21" cy="63" r="1.3" fill="#2B2218" />
      <circle cx="79" cy="63" r="1.3" fill="#2B2218" />
      <circle cx="85" cy="63" r="1.3" fill="#2B2218" />
    </svg>
  )
}

export function CrescentMoon({ size = 60, color = '#FFE9A0', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      <path
        d="M66 14 A38 38 0 1 0 66 86 A30 30 0 1 1 66 14 Z"
        fill={color}
        stroke="#2B2218"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <circle cx="42" cy="46" r="2.8" fill="#2B2218" />
      <circle cx="56" cy="46" r="2.8" fill="#2B2218" />
      <path d="M43 56 Q49 62 55 56" stroke="#2B2218" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="37" cy="54" r="3" fill="#FF8FA3" opacity="0.6" />
      <circle cx="61" cy="54" r="3" fill="#FF8FA3" opacity="0.6" />
    </svg>
  )
}

export function CuteSun({ size = 60, color = '#FFD66B', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      <g stroke="#2B2218" strokeWidth="2.4" strokeLinecap="round">
        {Array.from({ length: 12 }).map((_, i) => {
          const a = ((i * 30) * Math.PI) / 180
          return (
            <line
              key={i}
              x1={50 + Math.cos(a) * 30}
              y1={50 + Math.sin(a) * 30}
              x2={50 + Math.cos(a) * 40}
              y2={50 + Math.sin(a) * 40}
            />
          )
        })}
      </g>
      <circle cx="50" cy="50" r="22" fill={color} stroke="#2B2218" strokeWidth="2.6" />
      <circle cx="43" cy="47" r="2.6" fill="#2B2218" />
      <circle cx="57" cy="47" r="2.6" fill="#2B2218" />
      <path d="M44 56 Q50 62 56 56" stroke="#2B2218" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="38" cy="55" r="2.8" fill="#FF8FA3" opacity="0.6" />
      <circle cx="62" cy="55" r="2.8" fill="#FF8FA3" opacity="0.6" />
    </svg>
  )
}

export function Strawberry({ size = 46, color = '#FF8FA3', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      <path
        d="M50 26 C74 26 80 52 50 88 C20 52 26 26 50 26 Z"
        fill={color}
        stroke="#2B2218"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      {[[40, 44], [58, 44], [46, 56], [56, 58], [44, 68], [54, 70]].map((s, i) => (
        <circle key={i} cx={s[0]} cy={s[1]} r="1.5" fill="#FFE9A0" stroke="#C99524" strokeWidth="0.4" />
      ))}
      <circle cx="44" cy="50" r="2" fill="#2B2218" />
      <circle cx="56" cy="50" r="2" fill="#2B2218" />
      <path d="M45 58 Q50 62 55 58" stroke="#2B2218" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M50 26 L36 14 L44 24 L50 10 L56 24 L64 14 Z" fill="#7E9B6E" stroke="#2B2218" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

export function Butterfly({ size = 52, color = '#B5D9F2', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 100 80')} style={style} className={className}>
      <ellipse cx="28" cy="34" rx="20" ry="16" fill={color} stroke="#2B2218" strokeWidth="2.4" />
      <ellipse cx="72" cy="34" rx="20" ry="16" fill={color} stroke="#2B2218" strokeWidth="2.4" />
      <ellipse cx="30" cy="62" rx="14" ry="12" fill={color} stroke="#2B2218" strokeWidth="2.4" />
      <ellipse cx="70" cy="62" rx="14" ry="12" fill={color} stroke="#2B2218" strokeWidth="2.4" />
      <circle cx="26" cy="32" r="3.5" fill="#FBF7EE" />
      <circle cx="74" cy="32" r="3.5" fill="#FBF7EE" />
      <rect x="47" y="24" width="6" height="42" rx="3" fill="#2B2218" />
      <path d="M48 26 L40 14 M52 26 L60 14" stroke="#2B2218" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function Cupcake({ size = 46, color = '#FFB3C6', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 100 100')} style={style} className={className}>
      <path d="M26 56 L34 92 L66 92 L74 56 Z" fill="#FFE9A0" stroke="#2B2218" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M40 56 L43 92 M50 56 L50 92 M60 56 L57 92" stroke="#2B2218" strokeWidth="1.4" opacity="0.4" />
      <path d="M24 56 C18 40 36 38 38 30 C40 18 60 18 62 30 C64 38 82 40 76 56 Z" fill={color} stroke="#2B2218" strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="50" cy="20" r="5" fill="#D64545" stroke="#2B2218" strokeWidth="2" />
      <circle cx="43" cy="44" r="2" fill="#2B2218" />
      <circle cx="57" cy="44" r="2" fill="#2B2218" />
      <path d="M44 50 Q50 54 56 50" stroke="#2B2218" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function Donut({ size = 50, color = '#FFCBA0', style, className }: SvgProps) {
  const sprinkles = [
    [36, 30, 0], [64, 30, 50], [72, 50, 90], [28, 52, 20], [60, 68, 140], [42, 72, 70],
  ]
  return (
    <svg {...base(size)} style={style} className={className}>
      <circle cx="50" cy="50" r="38" fill={color} stroke="#2B2218" strokeWidth="2.4" />
      <path
        d="M50 14 A36 36 0 1 0 50 86 A36 36 0 1 0 50 14 Z M50 36 A14 14 0 1 1 50 64 A14 14 0 1 1 50 36 Z"
        fill="#F5B8C9"
        fillRule="evenodd"
        stroke="#2B2218"
        strokeWidth="2.2"
      />
      {sprinkles.map(([x, y, r], i) => (
        <rect
          key={i}
          x={x - 3}
          y={y - 1.2}
          width="6"
          height="2.4"
          rx="1"
          fill={['#D64545', '#FFD66B', '#3B8C5A', '#2C6DA8'][i % 4]}
          transform={`rotate(${r} ${x} ${y})`}
        />
      ))}
      <circle cx="44" cy="70" r="1.8" fill="#2B2218" />
      <circle cx="56" cy="70" r="1.8" fill="#2B2218" />
      <path d="M45 76 Q50 80 55 76" stroke="#2B2218" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function Ghost({ size = 50, color = '#FBF7EE', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 100 110')} style={style} className={className}>
      <path
        d="M20 44 C20 18 80 18 80 44 L80 96 L70 86 L60 96 L50 86 L40 96 L30 86 L20 96 Z"
        fill={color}
        stroke="#2B2218"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <circle cx="40" cy="50" r="3" fill="#2B2218" />
      <circle cx="60" cy="50" r="3" fill="#2B2218" />
      <path d="M42 60 Q50 66 58 60" stroke="#2B2218" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="33" cy="58" r="3" fill="#B5D9F2" opacity="0.7" />
      <circle cx="67" cy="58" r="3" fill="#B5D9F2" opacity="0.7" />
    </svg>
  )
}

export function Saturn({ size = 58, color = '#FFE9A0', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 100 80')} style={style} className={className}>
      <path d="M8 40 A44 12 0 0 1 92 40" fill="none" stroke="#2B2218" strokeWidth="2.6" />
      <circle cx="50" cy="40" r="22" fill={color} stroke="#2B2218" strokeWidth="2.6" />
      <circle cx="43" cy="38" r="2.4" fill="#2B2218" />
      <circle cx="57" cy="38" r="2.4" fill="#2B2218" />
      <path d="M44 46 Q50 51 56 46" stroke="#2B2218" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M8 40 A44 12 0 0 0 92 40" fill="none" stroke="#E8A93C" strokeWidth="4" opacity="0.55" />
    </svg>
  )
}

export function Balloon({ size = 46, color = '#FF8FA3', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 100 130')} style={style} className={className}>
      <ellipse cx="50" cy="42" rx="30" ry="36" fill={color} stroke="#2B2218" strokeWidth="2.6" />
      <ellipse cx="40" cy="30" rx="6" ry="9" fill="#fff" opacity="0.4" />
      <circle cx="43" cy="44" r="2.2" fill="#2B2218" />
      <circle cx="57" cy="44" r="2.2" fill="#2B2218" />
      <path d="M44 52 Q50 57 56 52" stroke="#2B2218" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M50 78 L46 86 L54 86 Z" fill={color} stroke="#2B2218" strokeWidth="2" />
      <path d="M50 86 C44 96 56 104 50 118" fill="none" stroke="#2B2218" strokeWidth="1.6" />
    </svg>
  )
}

export function Present({ size = 46, color = '#B5E3D0', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 100 100')} style={style} className={className}>
      <rect x="20" y="40" width="60" height="44" fill={color} stroke="#2B2218" strokeWidth="2.6" rx="3" />
      <rect x="20" y="40" width="60" height="11" fill="#2B2218" opacity="0.12" />
      <rect x="44" y="40" width="12" height="44" fill="#FFD66B" stroke="#2B2218" strokeWidth="2" />
      <path d="M50 40 C40 26 22 30 30 42 Z M50 40 C60 26 78 30 70 42 Z" fill="#FFD66B" stroke="#2B2218" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

export function Candy({ size = 50, color = '#FFB3C6', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 120 60')} style={style} className={className}>
      <path d="M14 30 L40 16 A13 13 0 0 1 40 44 Z" fill={color} stroke="#2B2218" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M106 30 L80 16 A13 13 0 0 0 80 44 Z" fill={color} stroke="#2B2218" strokeWidth="2.4" strokeLinejoin="round" />
      <rect x="40" y="19" width="40" height="22" rx="11" fill={color} stroke="#2B2218" strokeWidth="2.4" />
      <g stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
        <line x1="50" y1="30" x2="56" y2="30" />
        <line x1="64" y1="30" x2="70" y2="30" />
      </g>
    </svg>
  )
}

export function Kitten({ size = 46, color = '#FFE9A0', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      <path d="M22 30 L16 8 L36 24 Z" fill={color} stroke="#2B2218" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M78 30 L84 8 L64 24 Z" fill={color} stroke="#2B2218" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M23 26 L20 14 L30 23 Z" fill="#FF8FA3" />
      <path d="M77 26 L80 14 L70 23 Z" fill="#FF8FA3" />
      <circle cx="50" cy="54" r="30" fill={color} stroke="#2B2218" strokeWidth="2.6" />
      <circle cx="40" cy="52" r="3" fill="#2B2218" />
      <circle cx="60" cy="52" r="3" fill="#2B2218" />
      <path d="M47 62 L50 66 L53 62 Z" fill="#FF8FA3" stroke="#2B2218" strokeWidth="1.2" />
      <path d="M50 66 Q46 71 42 67 M50 66 Q54 71 58 67" stroke="#2B2218" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M30 60 L14 56 M30 64 L14 64 M70 60 L86 56 M70 64 L86 64" stroke="#2B2218" strokeWidth="1.2" />
      <circle cx="33" cy="62" r="3" fill="#FF8FA3" opacity="0.5" />
      <circle cx="67" cy="62" r="3" fill="#FF8FA3" opacity="0.5" />
    </svg>
  )
}

export function Bear({ size = 46, color = '#D4A574', style, className }: SvgProps) {
  return (
    <svg {...base(size)} style={style} className={className}>
      <circle cx="28" cy="28" r="13" fill={color} stroke="#2B2218" strokeWidth="2.4" />
      <circle cx="72" cy="28" r="13" fill={color} stroke="#2B2218" strokeWidth="2.4" />
      <circle cx="28" cy="28" r="6.5" fill="#F0D9B0" />
      <circle cx="72" cy="28" r="6.5" fill="#F0D9B0" />
      <circle cx="50" cy="56" r="31" fill={color} stroke="#2B2218" strokeWidth="2.6" />
      <circle cx="41" cy="52" r="3" fill="#2B2218" />
      <circle cx="59" cy="52" r="3" fill="#2B2218" />
      <ellipse cx="50" cy="64" rx="10" ry="8" fill="#F0D9B0" />
      <path d="M50 62 L46 67 L54 67 Z" fill="#2B2218" />
      <path d="M50 67 Q50 71 46 70 M50 67 Q50 71 54 70" stroke="#2B2218" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function Chick({ size = 44, color = '#FFD66B', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 100 100')} style={style} className={className}>
      <path d="M50 24 L48 16 L52 22 L50 12 L55 20" stroke="#2B2218" strokeWidth="2" fill={color} strokeLinejoin="round" />
      <ellipse cx="50" cy="58" rx="30" ry="28" fill={color} stroke="#2B2218" strokeWidth="2.6" />
      <path d="M30 60 C24 52 28 44 38 48 C40 56 36 62 30 60 Z" fill="#FFCB4D" stroke="#2B2218" strokeWidth="2" />
      <path d="M44 56 L50 52 L56 56 L50 61 Z" fill="#FF9B3D" stroke="#2B2218" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="42" cy="48" r="2.8" fill="#2B2218" />
      <circle cx="58" cy="48" r="2.8" fill="#2B2218" />
      <circle cx="35" cy="56" r="3" fill="#FF8FA3" opacity="0.5" />
      <circle cx="65" cy="56" r="3" fill="#FF8FA3" opacity="0.5" />
      <path d="M42 84 L38 92 M42 84 L42 92 M42 84 L46 92 M58 84 L54 92 M58 84 L58 92 M58 84 L62 92" stroke="#FF9B3D" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function Frog({ size = 48, color = '#9BC4B5', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 100 90')} style={style} className={className}>
      <ellipse cx="50" cy="58" rx="35" ry="26" fill={color} stroke="#2B2218" strokeWidth="2.6" />
      <circle cx="34" cy="30" r="13" fill={color} stroke="#2B2218" strokeWidth="2.4" />
      <circle cx="66" cy="30" r="13" fill={color} stroke="#2B2218" strokeWidth="2.4" />
      <circle cx="34" cy="31" r="5" fill="#2B2218" />
      <circle cx="66" cy="31" r="5" fill="#2B2218" />
      <circle cx="35" cy="29" r="1.6" fill="#fff" />
      <circle cx="67" cy="29" r="1.6" fill="#fff" />
      <path d="M34 60 Q50 73 66 60" stroke="#2B2218" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="28" cy="58" r="4" fill="#7BA89A" opacity="0.6" />
      <circle cx="72" cy="58" r="4" fill="#7BA89A" opacity="0.6" />
    </svg>
  )
}

export function Bee({ size = 46, color = '#FFD66B', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 100 80')} style={style} className={className}>
      <ellipse cx="52" cy="44" rx="30" ry="22" fill={color} stroke="#2B2218" strokeWidth="2.6" />
      <path d="M40 26 C36 36 36 52 40 62" stroke="#2B2218" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M58 26 C62 36 62 52 58 62" stroke="#2B2218" strokeWidth="6" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="22" rx="13" ry="8" fill="#B5D9F2" stroke="#2B2218" strokeWidth="2" opacity="0.85" />
      <ellipse cx="64" cy="22" rx="13" ry="8" fill="#B5D9F2" stroke="#2B2218" strokeWidth="2" opacity="0.85" />
      <circle cx="34" cy="42" r="2.4" fill="#2B2218" />
      <path d="M30 48 Q33 52 36 48" stroke="#2B2218" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M40 22 L34 12 M46 20 L44 8" stroke="#2B2218" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M82 44 L90 44 L82 38 Z" fill="#2B2218" />
    </svg>
  )
}

export function Ladybug({ size = 46, color = '#E84545', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 100 90')} style={style} className={className}>
      <path d="M12 58 A38 32 0 0 1 88 58 Z" fill={color} stroke="#2B2218" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M50 26 L50 58" stroke="#2B2218" strokeWidth="2.4" />
      <circle cx="33" cy="42" r="4.5" fill="#2B2218" />
      <circle cx="65" cy="42" r="4.5" fill="#2B2218" />
      <circle cx="40" cy="52" r="3" fill="#2B2218" />
      <circle cx="58" cy="52" r="3" fill="#2B2218" />
      <ellipse cx="50" cy="64" rx="11" ry="8" fill="#2B2218" />
      <circle cx="46" cy="62" r="1.7" fill="#fff" />
      <circle cx="54" cy="62" r="1.7" fill="#fff" />
      <path d="M44 70 L40 76 M56 70 L60 76" stroke="#2B2218" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function Apple({ size = 42, color = '#E84545', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 100 100')} style={style} className={className}>
      <path d="M50 32 C30 32 18 46 22 64 C26 82 40 88 50 82 C60 88 74 82 78 64 C82 46 70 32 50 32 Z" fill={color} stroke="#2B2218" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M50 34 L48 18 C48 14 54 12 56 16" fill="none" stroke="#7E5A3A" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M56 28 C64 22 72 26 70 32 C62 32 58 30 56 28 Z" fill="#7E9B6E" stroke="#2B2218" strokeWidth="2" />
      <ellipse cx="38" cy="48" rx="5" ry="8" fill="#fff" opacity="0.35" />
      <circle cx="42" cy="58" r="2.2" fill="#2B2218" />
      <circle cx="56" cy="58" r="2.2" fill="#2B2218" />
      <path d="M44 66 Q50 70 56 66" stroke="#2B2218" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function Watermelon({ size = 46, color = '#FF6B7A', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 100 90')} style={style} className={className}>
      <path d="M6 80 L50 8 L94 80 Z" fill="#7E9B6E" stroke="#2B2218" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M16 80 L50 22 L84 80 Z" fill="#FBF7EE" stroke="#2B2218" strokeWidth="2" />
      <path d="M23 80 L50 32 L77 80 Z" fill={color} stroke="#2B2218" strokeWidth="2.4" />
      {[[38, 60], [54, 56], [46, 70], [62, 66], [34, 72]].map((s, i) => (
        <circle key={i} cx={s[0]} cy={s[1]} r="2" fill="#2B2218" />
      ))}
    </svg>
  )
}

export function IceCream({ size = 46, color = '#FFB3C6', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 100 120')} style={style} className={className}>
      <path d="M34 58 L50 112 L66 58 Z" fill="#E8B974" stroke="#2B2218" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M40 66 L50 98 M50 66 L50 104 M60 66 L50 98" stroke="#C99524" strokeWidth="1.6" opacity="0.6" />
      <circle cx="50" cy="46" r="18" fill={color} stroke="#2B2218" strokeWidth="2.6" />
      <circle cx="50" cy="30" r="14" fill="#FFD66B" stroke="#2B2218" strokeWidth="2.6" />
      <circle cx="44" cy="46" r="2" fill="#2B2218" />
      <circle cx="56" cy="46" r="2" fill="#2B2218" />
      <path d="M45 52 Q50 56 55 52" stroke="#2B2218" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="12" r="4.5" fill="#E84545" stroke="#2B2218" strokeWidth="2" />
      <path d="M50 8 L54 2" stroke="#7E5A3A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function Popsicle({ size = 40, color = '#FF8FA3', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 100 130')} style={style} className={className}>
      <path d="M26 12 C26 6 74 6 74 12 L74 80 C74 86 26 86 26 80 Z" fill={color} stroke="#2B2218" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M40 14 C40 32 44 54 40 80" stroke="#fff" strokeWidth="3.5" fill="none" opacity="0.45" />
      <rect x="44" y="84" width="12" height="34" rx="3" fill="#E8B974" stroke="#2B2218" strokeWidth="2.4" />
      <circle cx="42" cy="36" r="2.6" fill="#2B2218" />
      <circle cx="56" cy="36" r="2.6" fill="#2B2218" />
      <path d="M44 46 Q50 52 56 46" stroke="#2B2218" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function Crown({ size = 44, color = '#FFD66B', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 100 80')} style={style} className={className}>
      <path d="M12 64 L18 22 L34 44 L50 16 L66 44 L82 22 L88 64 Z" fill={color} stroke="#2B2218" strokeWidth="2.6" strokeLinejoin="round" />
      <rect x="12" y="60" width="76" height="13" fill={color} stroke="#2B2218" strokeWidth="2.6" />
      <circle cx="18" cy="22" r="4.5" fill="#E84545" stroke="#2B2218" strokeWidth="1.6" />
      <circle cx="50" cy="16" r="4.5" fill="#3B8C5A" stroke="#2B2218" strokeWidth="1.6" />
      <circle cx="82" cy="22" r="4.5" fill="#2C6DA8" stroke="#2B2218" strokeWidth="1.6" />
      <circle cx="34" cy="66" r="3" fill="#E84545" />
      <circle cx="66" cy="66" r="3" fill="#2C6DA8" />
    </svg>
  )
}

export function Gem({ size = 42, color = '#B5D9F2', style, className }: SvgProps) {
  return (
    <svg {...base(size, '0 0 100 90')} style={style} className={className}>
      <path d="M20 30 L50 8 L80 30 L50 86 Z" fill={color} stroke="#2B2218" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M20 30 L50 30 L80 30 M50 30 L50 86 M34 18 L50 30 L66 18" stroke="#2B2218" strokeWidth="1.8" fill="none" opacity="0.55" />
      <path d="M28 30 L42 30 L36 52 Z" fill="#fff" opacity="0.45" />
    </svg>
  )
}
