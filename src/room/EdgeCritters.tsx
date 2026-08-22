/* 网页边缘 2D 扒边小可爱
   左右：猫猫（About me）/ 史莱姆（Contact me）探头，可点击
   底部：一整排云朵自适应铺满整条底边（按窗口宽度动态计算数量，任意宽度无空隙） */

import { useEffect, useState } from 'react'

type EdgeCrittersProps = {
  onCatClick?: () => void
  onSlimeClick?: () => void
}

function Cloud({ flip = false, sparkle = false }: { flip?: boolean; sparkle?: boolean }) {
  return (
    <svg viewBox="0 0 130 74" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <path
        d="M 22 64 Q 4 64 4 50 Q 4 36 20 34 Q 17 16 37 13 Q 53 10 60 25 Q 67 8 87 11 Q 105 14 104 32 Q 121 34 121 49 Q 121 64 102 64 Z"
        fill="#FFFDF6" stroke="#FFB7CD" strokeWidth="5" strokeLinejoin="round"
      />
      {sparkle && <circle cx="46" cy="30" r="3.2" fill="#FFD84D" />}
      {sparkle && <circle cx="88" cy="26" r="2.2" fill="#FF8FBE" />}
    </svg>
  )
}

/* 每朵云最小宽度：窗口越宽，需要的云越多，才能铺满无空隙 */
const CLOUD_MIN_W = 88
const CLOUD_STYLES: { cls: string; flip: boolean; sparkle: boolean }[] = [
  { cls: 'cb1', flip: false, sparkle: false },
  { cls: 'cb2', flip: true, sparkle: true },
  { cls: 'cb3', flip: false, sparkle: true },
  { cls: 'cb4', flip: true, sparkle: false },
]

function useCloudCount() {
  const [n, setN] = useState(() => Math.max(6, Math.ceil(window.innerWidth / CLOUD_MIN_W)))
  useEffect(() => {
    const update = () => setN(Math.max(6, Math.ceil(window.innerWidth / CLOUD_MIN_W)))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return n
}

export function EdgeCritters({ onCatClick, onSlimeClick }: EdgeCrittersProps) {
  const cloudCount = useCloudCount()
  const clouds = Array.from({ length: cloudCount }, (_, i) => CLOUD_STYLES[i % CLOUD_STYLES.length])

  return (
    <>
      {/* ── 左缘：猫猫探头 → About me ── */}
      <div
        className="edge-critter edge-cat"
        role="button"
        aria-label="About me"
        tabIndex={0}
        onClick={onCatClick}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onCatClick?.() }}
      >
        <div className="critter-bubble">About Me ✦</div>
        <div className="edge-critter-hover">
          <svg viewBox="0 0 230 250" width="230" height="250">
            <ellipse cx="18" cy="160" rx="92" ry="78" fill="#9A93A6" stroke="#4A3524" strokeWidth="7" />
            <path d="M 108 56 L 86 4 L 140 34 Z" fill="#9A93A6" stroke="#4A3524" strokeWidth="7" strokeLinejoin="round" />
            <path d="M 110 46 L 96 18 L 128 34 Z" fill="#FFB7CD" />
            <path d="M 172 40 L 204 6 L 210 66 Z" fill="#9A93A6" stroke="#4A3524" strokeWidth="7" strokeLinejoin="round" />
            <path d="M 178 44 L 196 20 L 200 52 Z" fill="#FFB7CD" />
            <circle cx="150" cy="112" r="72" fill="#9A93A6" stroke="#4A3524" strokeWidth="7" />
            <g className="eyes-open">
              <ellipse cx="130" cy="104" rx="15" ry="17" fill="#FFFFFF" stroke="#4A3524" strokeWidth="3.5" />
              <circle cx="135" cy="109" r="7" fill="#3A2E3A" />
              <circle cx="132.5" cy="105" r="2.6" fill="#FFFFFF" />
              <ellipse cx="176" cy="100" rx="15" ry="17" fill="#FFFFFF" stroke="#4A3524" strokeWidth="3.5" />
              <circle cx="181" cy="105" r="7" fill="#3A2E3A" />
              <circle cx="178.5" cy="101" r="2.6" fill="#FFFFFF" />
            </g>
            <g className="eyes-closed">
              <path d="M 116 108 Q 130 116 144 108" fill="none" stroke="#3A2E3A" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 162 104 Q 176 112 190 104" fill="none" stroke="#3A2E3A" strokeWidth="4.5" strokeLinecap="round" />
            </g>
            <circle cx="145" cy="128" r="5.5" fill="#FF8FBE" stroke="#4A3524" strokeWidth="3" />
            <path d="M 133 141 Q 139 148 145 141 Q 151 148 157 141" fill="none" stroke="#3A2E3A" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="116" cy="134" rx="10" ry="6" fill="#FFB7CD" />
            <ellipse cx="172" cy="130" rx="10" ry="6" fill="#FFB7CD" />
            <path d="M 204 116 L 228 110" stroke="#4A3524" strokeWidth="3" strokeLinecap="round" />
            <path d="M 206 128 L 229 127" stroke="#4A3524" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="88" cy="188" rx="17" ry="13" fill="#9A93A6" stroke="#4A3524" strokeWidth="6" />
            <ellipse cx="96" cy="216" rx="17" ry="13" fill="#9A93A6" stroke="#4A3524" strokeWidth="6" />
            <path d="M 82 180 L 82 196 M 96 179 L 96 196" stroke="#4A3524" strokeWidth="3" strokeLinecap="round" />
            <path d="M 90 208 L 90 224 M 104 207 L 104 224" stroke="#4A3524" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* ── 右缘：史莱姆探头 → Contact me ── */}
      <div
        className="edge-critter edge-slime"
        role="button"
        aria-label="Contact me"
        tabIndex={0}
        onClick={onSlimeClick}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSlimeClick?.() }}
      >
        <div className="critter-bubble">Contact ✦</div>
        <div className="edge-critter-hover">
          <svg viewBox="0 0 230 250" width="230" height="250">
            <path
              d="M 230 250 L 230 110 Q 226 48 172 40 Q 116 34 86 84 Q 60 128 60 250 Z"
              fill="#FF6FB3"
              stroke="#4A3524"
              strokeWidth="7"
              strokeLinejoin="round"
            />
            <ellipse cx="112" cy="72" rx="20" ry="10" fill="#FFA5CE" transform="rotate(-32 112 72)" />
            <ellipse cx="90" cy="100" rx="8" ry="5" fill="#FFA5CE" transform="rotate(-32 90 100)" />
            <g className="eyes-open">
              <ellipse cx="98" cy="138" rx="12" ry="14" fill="#FFFFFF" stroke="#4A3524" strokeWidth="3.5" />
              <circle cx="93" cy="143" r="6" fill="#3A2E3A" />
              <circle cx="91" cy="140" r="2.2" fill="#FFFFFF" />
              <ellipse cx="142" cy="134" rx="12" ry="14" fill="#FFFFFF" stroke="#4A3524" strokeWidth="3.5" />
              <circle cx="137" cy="139" r="6" fill="#3A2E3A" />
              <circle cx="135" cy="136" r="2.2" fill="#FFFFFF" />
            </g>
            <g className="eyes-closed">
              <path d="M 87 140 Q 98 148 109 140" fill="none" stroke="#3A2E3A" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 131 136 Q 142 144 153 136" fill="none" stroke="#3A2E3A" strokeWidth="4.5" strokeLinecap="round" />
            </g>
            <path d="M 106 168 Q 120 180 138 166" fill="none" stroke="#3A2E3A" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="78" cy="162" rx="9" ry="5.5" fill="#FFA5CE" />
            <ellipse cx="154" cy="158" rx="9" ry="5.5" fill="#FFA5CE" />
          </svg>
        </div>
      </div>

      {/* ── 底缘：一整排云朵自适应铺满（数量随窗口宽度变化）── */}
      <div className="edge-bottom" aria-hidden>
        {clouds.map((c, i) => (
          <div key={i} className={`b-cloud ${c.cls}`}>
            <Cloud flip={c.flip} sparkle={c.sparkle} />
          </div>
        ))}
      </div>
    </>
  )
}
