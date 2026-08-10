import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import {
  WashiTape, ConfettiBit, Daisy, KawaiiStar, KawaiiHeart, KawaiiCloud,
  Mushroom, Doily, Sprig, Tag, TicketStub, PostageStamp,
  KawaiiRainbow, CrescentMoon, CuteSun, Strawberry, Butterfly, Cupcake,
  Donut, Ghost, Saturn, Balloon, Present, Candy,
  Kitten, Bear, Chick, Frog, Bee, Ladybug, Apple, Watermelon, IceCream,
  Popsicle, Crown, Gem,
} from './Decorations'

const CELL = 132

const WASHI = ['#F5B8C9', '#FFD3B6', '#FFE9A0', '#B5E3D0', '#B5D9F2', '#D4C5F9', '#FFCBA0', '#F0A8C0']
const FEATURE = ['#FFB3C6', '#FFD66B', '#B5E3D0', '#D4C5F9', '#FF8FA3', '#FFCBA0', '#B5D9F2', '#C8F0DC', '#FFAFB0']
const TAG_COL = ['#E8A93C', '#3B8C5A', '#2C6DA8', '#D64545', '#7E57C4']
const TICK_COL = ['#2C6DA8', '#D64545', '#3B8C5A', '#7E57C4', '#E8A93C']
const PATTERNS = ['dots', 'stripes', 'checker', 'gingham', 'solid', 'dots', 'stripes', 'checker']
const TICK_MAINS = ['ADMIT ONE', '★ GOLD ★', '♡ LOVE ♡', 'no.001', 'KEEP IT', '★ PASS ★', 'CUTE CLUB']
const TAG_LABELS = ['♡', '★', 'hi', 'wow', 'ok', '✿', '!', '?', 'yay']

const TYPES: [string, number][] = [
  ['washi', 18], ['confetti', 10], ['daisy', 4], ['kstar', 3], ['kheart', 3],
  ['kcloud', 2], ['mush', 2], ['doily', 3], ['sprig', 2], ['tag', 2], ['ticket', 2], ['stamp', 2],
  ['rainbow', 2], ['moon', 2], ['csun', 2], ['berry', 2], ['butterfly', 2], ['cupcake', 2],
  ['donut', 2], ['ghost', 2], ['saturn', 2], ['balloon', 2], ['present', 2], ['candy', 2],
  ['kitten', 3], ['bear', 3], ['chick', 3], ['frog', 3], ['bee', 3], ['ladybug', 3],
  ['apple', 2], ['watermelon', 2], ['icecream', 2], ['popsicle', 2], ['crown', 2], ['gem', 2],
]
const TOTAL_W = TYPES.reduce((a, [, w]) => a + w, 0)

function makeRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pickType(rnd: () => number): string {
  let r = rnd() * TOTAL_W
  for (const [name, w] of TYPES) {
    r -= w
    if (r <= 0) return name
  }
  return 'washi'
}

const pick = <T,>(arr: T[], rnd: () => number) => arr[Math.floor(rnd() * arr.length)]

type Item = {
  type: string
  x: number; y: number
  rot: number; op: number; z: number
  color: string
  size: number; width?: number
  pattern?: string
  round?: boolean
  label?: string; label2?: string
  layer: number
}

export function ScrapField() {
  const [dims, setDims] = useState({ w: 0, h: 0, cols: 0, rows: 0 })

  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth
      const h = Math.max(window.innerHeight, document.documentElement.scrollHeight)
      const cols = Math.max(6, Math.ceil(w / CELL))
      const rows = Math.ceil(h / CELL) + 1
      setDims((p) => (p.w === w && p.h === h && p.cols === cols && p.rows === rows ? p : { w, h, cols, rows }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    window.addEventListener('resize', measure)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure)
    const t = setTimeout(measure, 600)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
      clearTimeout(t)
    }
  }, [])

  const items = useMemo<Item[]>(() => {
    if (!dims.cols) return []
    const rnd = makeRng(20260810)
    const cellW = dims.w / dims.cols
    const out: Item[] = []
    const make = (c: number, r: number, layer: number): Item => {
      const type = pickType(rnd)
      const cx = (c + 0.5) * cellW + (rnd() - 0.5) * cellW * 0.85
      const cy = (r + 0.5) * CELL + (rnd() - 0.5) * CELL * 0.85
      const base: Item = {
        type, x: cx, y: cy, layer,
        rot: Math.round((rnd() - 0.5) * 80),
        op: +(0.72 + rnd() * 0.26).toFixed(2),
        z: 1 + Math.floor(rnd() * 40),
        color: '',
        size: 48,
      }
      switch (type) {
        case 'washi':
          base.color = pick(WASHI, rnd)
          base.width = 56 + Math.round(rnd() * 110)
          base.pattern = pick(PATTERNS, rnd)
          base.rot = Math.round((rnd() - 0.5) * 90)
          break
        case 'confetti':
          base.color = pick(FEATURE, rnd)
          base.size = 8 + Math.round(rnd() * 14)
          base.round = rnd() > 0.5
          break
        case 'daisy': base.color = pick(FEATURE, rnd); base.size = 42 + Math.round(rnd() * 30); break
        case 'kstar': base.color = pick(FEATURE, rnd); base.size = 44 + Math.round(rnd() * 34); break
        case 'kheart': base.color = pick(FEATURE, rnd); base.size = 38 + Math.round(rnd() * 28); break
        case 'kcloud': base.color = pick(FEATURE, rnd); base.size = 54 + Math.round(rnd() * 36); break
        case 'mush': base.color = pick(FEATURE, rnd); base.size = 40 + Math.round(rnd() * 28); break
        case 'doily': base.size = 58 + Math.round(rnd() * 50); base.color = '#FBF7EE'; break
        case 'sprig': base.color = pick(['#7E9B6E', '#9BB87E', '#6E9B8E'], rnd); base.size = 54 + Math.round(rnd() * 44); break
        case 'tag': base.color = pick(TAG_COL, rnd); base.label = pick(TAG_LABELS, rnd); base.size = 44 + Math.round(rnd() * 22); break
        case 'ticket':
          base.color = pick(TICK_COL, rnd)
          base.label = pick(TICK_MAINS, rnd)
          base.label2 = String(1 + Math.floor(rnd() * 99)).padStart(2, '0')
          base.width = 86 + Math.round(rnd() * 50)
          break
        case 'stamp': base.color = pick(TAG_COL, rnd); base.label = pick(['★', '✿', '♥', '✦'], rnd); base.size = 44 + Math.round(rnd() * 26); break
        case 'rainbow': base.size = 56 + Math.round(rnd() * 36); break
        case 'moon': base.color = pick(['#FFE9A0', '#FFD66B'], rnd); base.size = 48 + Math.round(rnd() * 30); break
        case 'csun': base.color = pick(['#FFD66B', '#FFCBA0'], rnd); base.size = 48 + Math.round(rnd() * 30); break
        case 'berry': base.color = pick(['#FF8FA3', '#FF6B7A', '#FFAFB0'], rnd); base.size = 38 + Math.round(rnd() * 24); break
        case 'butterfly': base.color = pick(['#B5D9F2', '#D4C5F9', '#FFB3C6', '#B5E3D0'], rnd); base.size = 44 + Math.round(rnd() * 28); break
        case 'cupcake': base.color = pick(['#FFB3C6', '#FFCBA0', '#D4C5F9'], rnd); base.size = 40 + Math.round(rnd() * 24); break
        case 'donut': base.color = pick(['#FFCBA0', '#F0A8C0', '#FFD3B6'], rnd); base.size = 42 + Math.round(rnd() * 28); break
        case 'ghost': base.size = 40 + Math.round(rnd() * 26); break
        case 'saturn': base.color = pick(['#FFE9A0', '#FFCBA0', '#B5D9F2'], rnd); base.size = 46 + Math.round(rnd() * 28); break
        case 'balloon': base.color = pick(FEATURE, rnd); base.size = 38 + Math.round(rnd() * 26); break
        case 'present': base.color = pick(['#B5E3D0', '#FFB3C6', '#B5D9F2', '#D4C5F9'], rnd); base.size = 38 + Math.round(rnd() * 24); break
        case 'candy': base.color = pick(['#FFB3C6', '#B5D9F2', '#FFE9A0'], rnd); base.size = 42 + Math.round(rnd() * 26); break
        case 'kitten': base.color = pick(['#FFE9A0', '#FFD3B6', '#F0E0C0'], rnd); base.size = 40 + Math.round(rnd() * 26); break
        case 'bear': base.color = pick(['#D4A574', '#C68C5E', '#E0BC8F'], rnd); base.size = 40 + Math.round(rnd() * 26); break
        case 'chick': base.size = 38 + Math.round(rnd() * 24); break
        case 'frog': base.color = pick(['#9BC4B5', '#7BAE94', '#A8D0BC'], rnd); base.size = 42 + Math.round(rnd() * 26); break
        case 'bee': base.size = 40 + Math.round(rnd() * 24); break
        case 'ladybug': base.color = pick(['#E84545', '#D63A3A'], rnd); base.size = 40 + Math.round(rnd() * 24); break
        case 'apple': base.color = pick(['#E84545', '#3B8C5A', '#FFD66B'], rnd); base.size = 38 + Math.round(rnd() * 22); break
        case 'watermelon': base.color = pick(['#FF6B7A', '#FF8FA3'], rnd); base.size = 40 + Math.round(rnd() * 26); break
        case 'icecream': base.color = pick(['#FFB3C6', '#B5D9F2', '#D4C5F9'], rnd); base.size = 40 + Math.round(rnd() * 24); break
        case 'popsicle': base.color = pick(['#FF8FA3', '#B5E3D0', '#FFD66B', '#D4C5F9'], rnd); base.size = 36 + Math.round(rnd() * 22); break
        case 'crown': base.size = 38 + Math.round(rnd() * 22); break
        case 'gem': base.color = pick(['#B5D9F2', '#D4C5F9', '#FFB3C6', '#B5E3D0'], rnd); base.size = 36 + Math.round(rnd() * 22); break
      }
      return base
    }
    // denser: place 2 layers per cell so elements stack/overlap fully
    for (let r = 0; r < dims.rows; r++) {
      for (let c = 0; c < dims.cols; c++) {
        out.push(make(c, r, 0))
        if (rnd() < 0.7) out.push(make(c, r, 1))
        if (rnd() < 0.35) out.push(make(c, r, 2))
      }
    }
    return out
  }, [dims])

  return (
    <div className="scrap-field" aria-hidden>
      {items.map((it, i) => {
        const wrap: CSSProperties = {
          position: 'absolute',
          left: it.x,
          top: it.y,
          transform: `translate(-50%, -50%) rotate(${it.rot}deg)`,
          opacity: it.op,
          zIndex: it.z + it.layer * 10,
        }
        let el: React.ReactNode = null
        switch (it.type) {
          case 'washi': el = <WashiTape width={it.width} color={it.color} pattern={it.pattern as 'dots'} />; break
          case 'confetti': el = <ConfettiBit color={it.color} round={it.round} style={{ width: it.size, height: it.size }} />; break
          case 'daisy': el = <Daisy size={it.size} color={it.color} />; break
          case 'kstar': el = <KawaiiStar size={it.size} color={it.color} />; break
          case 'kheart': el = <KawaiiHeart size={it.size} color={it.color} />; break
          case 'kcloud': el = <KawaiiCloud size={it.size} color={it.color} />; break
          case 'mush': el = <Mushroom size={it.size} color={it.color} />; break
          case 'doily': el = <Doily size={it.size} color={it.color} />; break
          case 'sprig': el = <Sprig size={it.size} color={it.color} />; break
          case 'tag': el = <Tag color={it.color} label={it.label} />; break
          case 'ticket': el = <TicketStub color={it.color} main={it.label} no={it.label2} />; break
          case 'stamp': el = <PostageStamp color={it.color} label={it.label} />; break
          case 'rainbow': el = <KawaiiRainbow size={it.size} />; break
          case 'moon': el = <CrescentMoon size={it.size} color={it.color} />; break
          case 'csun': el = <CuteSun size={it.size} color={it.color} />; break
          case 'berry': el = <Strawberry size={it.size} color={it.color} />; break
          case 'butterfly': el = <Butterfly size={it.size} color={it.color} />; break
          case 'cupcake': el = <Cupcake size={it.size} color={it.color} />; break
          case 'donut': el = <Donut size={it.size} color={it.color} />; break
          case 'ghost': el = <Ghost size={it.size} color={it.color} />; break
          case 'saturn': el = <Saturn size={it.size} color={it.color} />; break
          case 'balloon': el = <Balloon size={it.size} color={it.color} />; break
          case 'present': el = <Present size={it.size} color={it.color} />; break
          case 'candy': el = <Candy size={it.size} color={it.color} />; break
          case 'kitten': el = <Kitten size={it.size} color={it.color} />; break
          case 'bear': el = <Bear size={it.size} color={it.color} />; break
          case 'chick': el = <Chick size={it.size} />; break
          case 'frog': el = <Frog size={it.size} color={it.color} />; break
          case 'bee': el = <Bee size={it.size} />; break
          case 'ladybug': el = <Ladybug size={it.size} color={it.color} />; break
          case 'apple': el = <Apple size={it.size} color={it.color} />; break
          case 'watermelon': el = <Watermelon size={it.size} color={it.color} />; break
          case 'icecream': el = <IceCream size={it.size} color={it.color} />; break
          case 'popsicle': el = <Popsicle size={it.size} color={it.color} />; break
          case 'crown': el = <Crown size={it.size} />; break
          case 'gem': el = <Gem size={it.size} color={it.color} />; break
        }
        return (
          <div key={i} style={wrap}>
            {el}
          </div>
        )
      })}
    </div>
  )
}
