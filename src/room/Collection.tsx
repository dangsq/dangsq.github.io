import { useId, useState } from 'react'
import { projects, type ProjectCategory } from '../data/content'
import './Collection.css'

/** Editorial illustrations, not screenshots of the projects. */
function Cover({ index }: { index: number }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true" className={`collection-art art-${index}`}>
      <defs>
        <linearGradient id={`${id}-wash`} x1="0" y1="0" x2="800" y2="500" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e6fff6" /><stop offset=".5" stopColor="#82e4ed" /><stop offset="1" stopColor="#2364e7" />
        </linearGradient>
        <radialGradient id={`${id}-pearl`}><stop stopColor="#fff" /><stop offset=".58" stopColor="#cdfff0" /><stop offset="1" stopColor="#3989e5" /></radialGradient>
      </defs>
      <rect width="800" height="500" fill={index === 3 ? '#073ae8' : index === 4 ? '#d9f873' : '#e9f4ef'} />
      {index === 0 && <>
        <rect width="800" height="500" fill={`url(#${id}-wash)`} />
        {Array.from({ length: 18 }, (_, i) => <ellipse key={i} cx="400" cy="250" rx={100 + i * 13} ry={185 - i * 5} transform={`rotate(${i * 7 - 55} 400 250)`} stroke="#f4fff4" strokeOpacity=".6" />)}
        <text x="56" y="344" fill="#073c68" fontFamily="Georgia, serif" fontSize="260" letterSpacing="-24">N+1</text>
        <path d="M660 60v80m-40-40h80" stroke="#d9ff65" strokeWidth="18" />
        <text x="58" y="438" fill="#073c68" fontSize="15" letterSpacing="6">ARTISTS / HUMAN + MACHINE</text>
      </>}
      {index === 1 && <>
        <rect width="800" height="500" fill="#c9f6eb" />
        {Array.from({ length: 5 }, (_, i) => <g key={i} transform={`translate(${90 + i * 155} ${230 + Math.sin(i * 2) * 80}) rotate(${i * 12 - 20})`}>
          <path d="M0 0Q-45 100 5 300M-2 140Q-90 70-70 130Q-40 175-2 140" stroke="#196b58" strokeWidth="3" />
          {Array.from({ length: 7 }, (_, j) => <ellipse key={j} cx="0" cy="-40" rx="20" ry="58" transform={`rotate(${j * 360 / 7})`} fill={i % 2 ? '#1b53ec' : `url(#${id}-pearl)`} stroke="#f6fff6" strokeWidth="1" />)}
          <circle r="18" fill="#e0ff67" />
        </g>)}
        <text x="400" y="50" textAnchor="middle" fill="#12634f" fontFamily="Georgia, serif" fontStyle="italic" fontSize="23">a garden of possible things</text>
      </>}
      {index === 2 && <>
        {Array.from({ length: 15 }, (_, i) => <path key={i} d={`M-30 ${80 + i * 22} C180 ${-180 + i * 35}, 230 ${650 - i * 12}, 430 ${200 + i * 10} S650 ${-90 + i * 30},830 ${180 + i * 20}`} stroke={i % 3 ? '#39a8ad' : '#1253ed'} strokeWidth={i % 3 ? 1 : 3} />)}
        {[180, 400, 620].map((x, i) => <g key={x}><circle cx={x} cy={190 + i * 65} r="46" fill={`url(#${id}-pearl)`} /><text x={x} y={196 + i * 65} textAnchor="middle" fontFamily="monospace" fill="#094258" fontSize="16">0{i + 1}</text></g>)}
        <text x="32" y="460" fill="#175c67" fontFamily="monospace" fontSize="18">remember → retrieve → imagine</text>
      </>}
      {index === 3 && <>
        {Array.from({ length: 9 }, (_, i) => <text key={i} x={-80 + Math.sin(i * .9) * 80} y={30 + i * 66} transform={`rotate(-8 400 250)`} fontFamily="Georgia, serif" fontStyle="italic" fontSize={52 + i * 3} letterSpacing="-3" fill={i === 4 ? '#dcff69' : '#e2fff5'} fillOpacity={.25 + i * .08}>words become waves / 文字洪流</text>)}
      </>}
      {index === 4 && <>
        {['木', '林', '森'].map((text, i) => <text key={text} x={65 + i * 230} y={240 + i * 70} transform={`rotate(${i * 10 - 10} ${160 + i * 230} 250)`} fill="#104e40" fontFamily="serif" fontSize={150 - i * 10}>{text}</text>)}
        <path d="M60 395Q400 510 740 385" stroke="#104e40" strokeWidth="2" strokeDasharray="5 9" />
        <text x="42" y="64" fill="#104e40" fontFamily="monospace" fontSize="18" letterSpacing="4">RUN, RADICAL, RUN.</text>
      </>}
      {index === 5 && <>
        <rect width="800" height="500" fill="#d6eaff" />
        {Array.from({ length: 180 }, (_, i) => <circle key={i} cx={25 + (i * 137.5) % 750} cy={25 + (i * 61.7) % 450} r={1 + i % 4} fill="#1263ed" opacity=".3" />)}
        {[0, 1, 2, 3].map(i => <ellipse key={i} cx={150 + i * 170} cy="250" rx={65} ry={65 + i * 22} fill={`url(#${id}-pearl)`} fillOpacity={.25 + i * .25} stroke="#fff" transform={`rotate(${i * 22} ${150 + i * 170} 250)`} />)}
        <path d="M60 420h680" stroke="#175da2" /><text x="60" y="458" fill="#175da2" fontFamily="monospace" fontSize="17">noise ───────────────────→ image</text>
      </>}
      {index === 6 && <>
        <rect width="800" height="500" fill="#f1e9fc" />
        {[0, 1, 2].map(i => <g key={i} transform={`translate(${170 + i * 230} ${230 + (i % 2) * 40}) rotate(${i * 12 - 12})`}>
          <path d="M-90 190Q-110 70 0 70Q110 70 90 190" fill={['#4285ed', '#18a99a', '#aa8ad9'][i]} />
          <ellipse cy="-15" rx="73" ry="93" fill={`url(#${id}-pearl)`} />
          <path d="M-30-20h3m54 0h3M-25 25Q0 45 25 25" stroke="#154c64" strokeWidth="5" strokeLinecap="round" />
        </g>)}
        <text x="35" y="55" fill="#66518e" fontFamily="Georgia, serif" fontSize="24" fontStyle="italic">a portrait, many selves.</text>
      </>}
    </svg>
  )
}

function ProjectImages({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0)
  const src = `./images/collection/${images[current]}`
  return <div className="collection-gallery">
    <a className="collection-image-link" href={src} target="_blank" rel="noreferrer" aria-label={`查看原图 / Full image: ${title} ${current + 1}`}>
      <img src={src} alt={`${title} · 作品展示 ${current + 1} / ${images.length}`} loading="lazy" decoding="async" />
      <span>查看原图 ↗</span>
    </a>
    {images.length > 1 && <div className="collection-gallery-nav" role="group" aria-label={`${title} 图片切换 / Image navigation`}>
      <button type="button" onClick={() => setCurrent((current + images.length - 1) % images.length)} aria-label={`${title} 上一张 / Previous image`}>←</button>
      <span aria-live="polite">{String(current + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
      <button type="button" onClick={() => setCurrent((current + 1) % images.length)} aria-label={`${title} 下一张 / Next image`}>→</button>
    </div>}
  </div>
}

export function Collection({ onClose }: { onClose: () => void }) {
  const [category, setCategory] = useState<ProjectCategory | 'all'>('all')
  const filters = [{ id: 'all', label: '全部 All' }, { id: 'art', label: '艺术 Art' }, { id: 'design', label: '设计 Design' }, { id: 'technology', label: '技术 Technology' }] as const
  const visible = projects.map((p, i) => ({ p, i })).filter(({ p }) => category === 'all' || p.categories.includes(category))
  return <div className="poster-modal" onClick={onClose}>
    <section className="poster-card info-card collection-card" role="dialog" aria-modal="true" aria-labelledby="collection-heading" onClick={e => e.stopPropagation()}>
      <button className="info-close" onClick={onClose} aria-label="关闭作品集 Close collection">✕</button>
      <header className="collection-heading">
        <div><span className="collection-kicker">SHENGQI DANG / SELECTED WORKS</span><h2 id="collection-heading">Collection<span>作品集</span></h2></div>
        <span className="collection-count">01—{String(projects.length).padStart(2, '0')}<small>Art, interaction & experiments</small></span>
      </header>
      <nav className="collection-filters" aria-label="作品分类 / Collection categories">
        {filters.map(f => <button key={f.id} type="button" aria-pressed={category === f.id} onClick={() => setCategory(f.id)}>{f.label}<span>{f.id === 'all' ? projects.length : projects.filter(p => p.categories.includes(f.id as ProjectCategory)).length}</span></button>)}
        <span className="collection-filter-count" aria-live="polite">{visible.length} 件作品 / works</span>
      </nav>
      <div className="collection-scroll" key={category}>
        <div className="collection-grid">
          {visible.map(({ p, i }) => <article className={`collection-work work-${i}`} key={p.title}>
            <figure className="collection-figure">
              {p.images?.length ? <ProjectImages images={p.images} title={p.title} /> : <Cover index={i} />}
              <figcaption><span>{p.images?.length ? '作品图像 · Project images' : '视觉封面 · Cover study'}</span></figcaption>
            </figure>
            <div className="collection-copy">
              <div className="collection-work-index"><span>{String(i + 1).padStart(2, '0')}</span>{p.tags.split(' · ')[0]}</div>
              <div className="collection-title"><h3>{p.title}</h3>{p.link && <a href={p.link} target="_blank" rel="noreferrer" aria-label={`查看 ${p.title} / View work`}>↗</a>}</div>
              {p.titleEn && <p className="collection-en">{p.titleEn}</p>}
              {p.award && <div className="collection-award">
                <span className="collection-award-mark" aria-hidden="true">✳</span>
                <div><span className="collection-award-event">{p.award.event} · 获奖 / Award</span><strong>{p.award.name}</strong></div>
              </div>}
              <p className="collection-description">{p.desc}</p>
              <div className="collection-meta"><span>{p.tags}</span>{p.team && <span><b>完成人 / Credits</b>{p.team}</span>}</div>
            </div>
          </article>)}
        </div>
        <footer className="collection-footer"><span>继续生长 / An ongoing collection</span><span>Shengqi Dang ↗</span></footer>
      </div>
    </section>
  </div>
}
