import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { profile, publications, projects, type Publication } from '../data/content'
import { ScrapField } from './ScrapField'
import {
  Arrow, Asterisk, CheckMark, Flower, Heart, PaperClip, PushPin, Sparkle,
  Squiggle, Stamp, Star, Sun, Underline, WashiTape,
} from './Decorations'

const reveal = {
  initial: { opacity: 0, y: 40, rotate: -2 },
  whileInView: { opacity: 1, y: 0, rotate: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { type: 'spring' as const, stiffness: 70, damping: 14 },
}

function Paper({
  children, rotate = 0, className = '', tape,
}: {
  children: ReactNode; rotate?: number; className?: string; tape?: string
}) {
  return (
    <motion.div
      className={`paper ${className}`}
      style={{ rotate }}
      whileHover={{ rotate: 0, y: -8, scale: 1.025 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
    >
      {tape && <div className="paper-tape" style={{ background: tape }} />}
      {children}
    </motion.div>
  )
}

function Authors({ text }: { text: string }) {
  const parts = text.split(/(Shengqi Dang)/g)
  return (
    <>
      {parts.map((p, i) =>
        p === 'Shengqi Dang' ? (
          <span key={i} className="hl-author">Shengqi Dang</span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

export function Scrapbook() {
  return (
    <div className="scrapbook">
      <BackgroundDecor />
      <Cover />
      <About />
      <Publications />
      <Projects />
      <Contact />
      <ScrapFooter />
    </div>
  )
}

/* ── floating background decorations: cute scrap-material collage ── */
function BackgroundDecor() {
  return (
    <div className="bg-decor" aria-hidden>
      <ScrapField />
    </div>
  )
}

/* ── Cover ── */
function Cover() {
  return (
    <section className="spread cover-spread">
      <div className="masthead">
        <span className="mh-left">PERSONAL SCRAPBOOK</span>
        <span className="mh-mid">★ vol. 1 ★</span>
        <span className="mh-right">est. 1999 · still scribbling</span>
      </div>

      <motion.div {...reveal} className="cover-name-wrap">
        <div className="tape-row">
          <WashiTape width={120} color="#F5B8C9" />
          <WashiTape width={90} color="#9BC4B5" />
          <WashiTape width={140} color="#F5D77F" />
        </div>
        <div className="cover-paper">
          <h1 className="cover-name">Shengqi<br />Dang</h1>
          <div className="cover-name-zh">党 圣 奇</div>
          <Underline size={300} style={{ margin: '-8px auto 12px' }} />
          <p className="cover-role">{profile.role} · {profile.roleZh}</p>
          <p className="cover-tag">{profile.tagline}</p>
          <p className="cover-tag-zh">{profile.taglineZh}</p>
        </div>

        <div className="cover-side">
          <div className="sticker-no">no. <b>01</b></div>
          <PushPin size={30} color="#D64545" style={{ margin: '0 auto -6px' }} />
          <div className="cover-note">
            hi! this is my messy corner of the internet — papers, projects & doodles all taped in. scroll on ↓
          </div>
          <Arrow size={90} style={{ transform: 'rotate(35deg)', margin: '4px auto' }} />
          <Stamp text="PhD candidate" color="#B23A48" />
        </div>
      </motion.div>

      <div className="cover-stickers" aria-hidden>
        <Sparkle size={36} style={{ top: '-10px', left: '12%' }} />
        <Star size={30} color="#E8A93C" style={{ top: '10%', right: '6%' }} />
        <Heart size={24} style={{ bottom: '8%', left: '8%' }} />
        <Sun size={40} style={{ bottom: '-10px', right: '20%' }} />
      </div>
    </section>
  )
}

/* ── About ── */
function About() {
  return (
    <section className="spread about-spread">
      <SectionTitle n="02" title="about me" zh="关于我" color="#3B8C5A" />

      <div className="about-grid">
        <motion.div {...reveal}>
          <Paper rotate={-2.5} className="card-index" tape="#F5D77F">
            <div className="card-tape-line" />
            <p className="index-eyebrow">~ a little about me ~</p>
            <p className="bio-en">{profile.bio}</p>
            <p className="bio-zh">{profile.bioZh}</p>
          </Paper>
        </motion.div>

        <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }}>
          <Paper rotate={2} className="card-sticky">
            <div className="sticky-head">{profile.personality}</div>
            <ul className="fun-list">
              {profile.funFacts.map((f, i) => (
                <li key={i}>
                  <CheckMark size={18} style={{ display: 'inline-block', verticalAlign: '-3px', marginRight: 6 }} />
                  {f}
                </li>
              ))}
            </ul>
            <Asterisk size={22} style={{ position: 'absolute', bottom: 10, right: 14 }} />
          </Paper>
        </motion.div>

        <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.15 }}>
          <Paper rotate={-1.5} className="card-notebook">
            <div className="nb-margin" />
            <div className="nb-title">education · 学历</div>
            <ol className="edu-list">
              {profile.education.map((e, i) => (
                <li key={i}>
                  <span className="edu-period">{e.period}</span>
                  <span className="edu-text">{e.text}</span>
                </li>
              ))}
            </ol>
          </Paper>
        </motion.div>

        <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.2 }} className="interests-wrap">
          <Paper rotate={1.8} className="card-interests">
            <PushPin size={26} color="#3B8C5A" style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)' }} />
            <div className="interests-label">things i love ✦</div>
            <div className="interests-chips">
              {profile.interests.map((it, i) => (
                <span key={i} className={`chip chip-${i % 4}`}>{it}</span>
              ))}
            </div>
          </Paper>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Publications ── */
function Publications() {
  return (
    <section className="spread pubs-spread">
      <SectionTitle n="03" title="publications" zh="论文发表" color="#B23A48" />
      <div className="pubs-hint">
        <Arrow size={70} style={{ transform: 'rotate(-12deg)', display: 'inline-block', verticalAlign: '-12px' }} />
        <span>hover a card to lift it · 鼠标移上去会翘起来</span>
      </div>

      <div className="pubs-grid">
        {publications.map((p, i) => (
          <PubCard key={i} pub={p} idx={i} />
        ))}
      </div>
    </section>
  )
}

function PubCard({ pub, idx }: { pub: Publication; idx: number }) {
  const rot = [-2.5, 1.8, -1.2, 2.4, -2, 1.4, -1.8, 2, -1.4][idx % 9]
  const tapeColors = ['#F5B8C9', '#9BC4B5', '#F5D77F', '#B7C7E0', '#E8B974']
  return (
    <motion.div {...reveal} transition={{ ...reveal.transition, delay: (idx % 3) * 0.08 }}>
      <Paper rotate={rot} className="card-pub" tape={tapeColors[idx % tapeColors.length]}>
        <div className="pub-head">
          <Stamp text={pub.stamp ?? `${pub.venue} ${pub.year}`} color="#B23A48" />
          <span className="pub-year">{pub.year}</span>
        </div>
        <h3 className="pub-title">{pub.title}</h3>
        <p className="pub-authors"><Authors text={pub.authors} /></p>
        <p className="pub-abstract">{pub.abstract}</p>
        <div className="pub-doodle">
          <Squiggle size={120} style={{ opacity: 0.5 }} />
        </div>
      </Paper>
    </motion.div>
  )
}

/* ── Projects ── */
function Projects() {
  return (
    <section className="spread proj-spread">
      <SectionTitle n="04" title="projects" zh="项目作品" color="#2C6DA8" />
      <div className="proj-grid">
        {projects.map((p, i) => (
          <Polaroid key={i} proj={p} idx={i} />
        ))}
      </div>
    </section>
  )
}

function Polaroid({ proj, idx }: { proj: typeof projects[number]; idx: number }) {
  const rot = [-3, 2.5, -1.8, 3, -2.4][idx % 5]
  return (
    <motion.div {...reveal} transition={{ ...reveal.transition, delay: (idx % 3) * 0.08 }}>
      <Paper rotate={rot} className="polaroid">
        <PaperClip size={34} style={{ position: 'absolute', top: -10, left: 18 }} />
        <div className="pol-img">
          <ProjectGlyph idx={idx} />
        </div>
        <div className="pol-caption">
          <div className="pol-title">{proj.title}</div>
          {proj.titleEn && <div className="pol-titleen">{proj.titleEn}</div>}
          <div className="pol-tags">{proj.tags}</div>
          <p className="pol-desc">{proj.desc}</p>
          {proj.link && (
            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="pol-link">
              {proj.link.replace(/^https?:\/\//, '')} →
            </a>
          )}
        </div>
      </Paper>
    </motion.div>
  )
}

function ProjectGlyph({ idx }: { idx: number }) {
  const glyphs = [
    <Sparkle key={0} size={56} color="#B7C7E0" />,
    <Squiggle key={1} size={90} color="#2B2218" />,
    <Star key={2} size={48} color="#E8A93C" />,
    <Sun key={3} size={52} />,
    <Flower key={4} size={50} color="#E8869B" />,
  ]
  return <div className="glyph-stage">{glyphs[idx % glyphs.length]}</div>
}

/* ── Contact ── */
function Contact() {
  return (
    <section className="spread contact-spread">
      <SectionTitle n="05" title="say hi" zh="联系我" color="#D64545" />

      <div className="contact-row">
        <motion.div {...reveal}>
          <Paper rotate={-2} className="card-business">
            <div className="biz-corner" />
            <div className="biz-name">{profile.name}</div>
            <div className="biz-name-zh">{profile.nameZh}</div>
            <div className="biz-rule" />
            <div className="biz-role">{profile.role} · {profile.tagline}</div>
            <a href={`mailto:${profile.email}`} className="biz-email">✉ {profile.email}</a>
            <div className="biz-affil">
              {profile.affiliations.map((a, i) => <div key={i}>{a}</div>)}
            </div>
            <Stamp text="let's talk!" color="#3B8C5A" style={{ position: 'absolute', bottom: 14, right: 16, transform: 'rotate(-12deg)' }} />
          </Paper>
        </motion.div>

        <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.12 }}>
          <Paper rotate={3} className="card-sticky card-hi">
            <PushPin size={26} color="#D64545" style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)' }} />
            <div className="hi-big">don't be a stranger!</div>
            <div className="hi-zh">别客气，聊聊呗～</div>
            <p className="hi-text">
              open to research collab, project chats, or just nerding out about tech × design × art.
            </p>
            <Arrow size={80} style={{ transform: 'rotate(180deg)', margin: '8px auto 0' }} />
          </Paper>
        </motion.div>
      </div>
    </section>
  )
}

/* ── shared section title ── */
function SectionTitle({ n, title, zh, color }: { n: string; title: string; zh: string; color: string }) {
  return (
    <motion.div {...reveal} className="section-title">
      <span className="st-num" style={{ color }}>{n}</span>
      <div className="st-text">
        <div className="st-en" style={{ color }}>{title}</div>
        <div className="st-zh">{zh}</div>
      </div>
      <span className="st-sparkle"><Sparkle size={26} color={color} /></span>
    </motion.div>
  )
}

function ScrapFooter() {
  return (
    <footer className="scrap-footer">
      <Squiggle size={180} style={{ opacity: 0.5, margin: '0 auto 14px' }} />
      <div className="footer-line">made with too much tape & coffee · © 2026 {profile.name}</div>
      <div className="footer-zh">用了一堆胶带和咖啡做的 · 党圣奇</div>
      <div className="footer-stickers">
        <Star size={20} color="#D64545" />
        <Flower size={22} />
        <Heart size={18} />
        <Sparkle size={22} />
      </div>
    </footer>
  )
}
