import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three/webgpu'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { buildRoom, type RoomHandle } from './scene'
import { startBackgroundMusic } from './music'
import { publications, profile, papersMeta } from '../data/content'
import { sceneHotspots } from './hotspots'
import './Room.css'
import { Collection } from './Collection'

type PanelKind = 'papers' | 'projects' | 'about' | 'contact' | null

export function Room() {
  const mountRef = useRef<HTMLDivElement>(null)
  const hotspotRefs = useRef(new Map<string, HTMLDivElement>())
  const roomHandleRef = useRef<RoomHandle | null>(null)
  const musicRef = useRef<{ stop: () => void } | null>(null)
  const musicStartingRef = useRef(false)
  const [loading, setLoading] = useState(true)
  const [paperLang, setPaperLang] = useState<'zh' | 'en'>('en')
  const [labelsVisible, setLabelsVisible] = useState(true)
  const labelsVisibleRef = useRef(true)
  const toggleLabels = () => {
    labelsVisibleRef.current = !labelsVisibleRef.current
    setLabelsVisible(labelsVisibleRef.current)
    setPanel(null)
  }
  const [panel, setPanel] = useState<PanelKind>(null)
  const [musicOn, setMusicOn] = useState(false)
  const [musicError, setMusicError] = useState(false)
  const [aboutLang, setAboutLang] = useState<'zh' | 'en'>('zh')

  const toggleMusic = async () => {
    if (musicStartingRef.current) return
    if (musicRef.current) {
      musicRef.current.stop()
      musicRef.current = null
      roomHandleRef.current?.setSpeakerPlaying(false)
      setMusicOn(false)
      return
    }
    musicStartingRef.current = true
    try {
      const music = await startBackgroundMusic()
      musicRef.current = music
      roomHandleRef.current?.setSpeakerPlaying(true)
      setMusicOn(true)
      setMusicError(false)
    } catch (error) {
      console.error('[Room] 音乐播放失败:', error)
      setMusicError(true)
    } finally {
      musicStartingRef.current = false
    }
  }

  /* ESC 关闭面板 */
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        setPanel(null)
        labelsVisibleRef.current = true
        setLabelsVisible(true)
      }
      const target = ev.target as HTMLElement | null
      if (ev.key.toLowerCase() === 'h' && !ev.repeat && !ev.metaKey && !ev.ctrlKey && !ev.altKey
        && !target?.closest('input, textarea, select, [contenteditable="true"]')) toggleLabels()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let disposed = false
    let renderer: InstanceType<typeof THREE.WebGPURenderer> | null = null
    let controls: OrbitControls | null = null
    let room: RoomHandle | null = null
    let resizeObserver: ResizeObserver | null = null

    // 相机：水平直视后墙（正对桌子与海报）
    const camera = new THREE.PerspectiveCamera(54, mount.clientWidth / mount.clientHeight, 0.1, 60)
    camera.position.set(6.64, 5.30, 6.86)

    /* ── 交互拾取：桌上的书 → 论文，笔记本 → 设计项目 ── */
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    let hoverRoot: THREE.Object3D | null = null
    let downX = 0
    let downY = 0

    const pick = (clientX: number, clientY: number): THREE.Object3D | null => {
      if (!room || !renderer) return null
      const rect = renderer.domElement.getBoundingClientRect()
      ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1
      ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(ndc, camera)
      for (const hit of raycaster.intersectObjects(room.scene.children, true)) {
        let o: THREE.Object3D | null = hit.object
        while (o) {
          const kind = (o.userData as { kind?: string }).kind
          if (kind === 'book' || kind === 'laptop' || kind === 'speaker') return o
          if (kind) return null // 其它带 kind 的物件不响应
          o = o.parent
        }
      }
      return null
    }

    /* hover 提亮：物体所有 toon 材质短暂点亮（记录原值，移开时恢复） */
    const setGlow = (root: THREE.Object3D | null, on: boolean) => {
      if (!root) return
      root.traverse(o => {
        const mesh = o as THREE.Mesh
        const mat = mesh.material as THREE.MeshToonNodeMaterial | undefined
        if (!mat || !(mat as unknown as { isMeshToonNodeMaterial?: boolean }).isMeshToonNodeMaterial) return
        const ud = mesh.userData as { _emis?: [number, number] }
        if (on) {
          if (!ud._emis) ud._emis = [mat.emissive.getHex(), mat.emissiveIntensity]
          mat.emissive.set('#FFB3D9')
          mat.emissiveIntensity = 0.45
        } else if (ud._emis) {
          mat.emissive.setHex(ud._emis[0])
          mat.emissiveIntensity = ud._emis[1]
        }
      })
    }

    const onPointerMove = (ev: PointerEvent) => {
      const root = labelsVisibleRef.current ? pick(ev.clientX, ev.clientY) : null
      if (root !== hoverRoot) {
        setGlow(hoverRoot, false)
        hoverRoot = root
        setGlow(hoverRoot, true)
        if (renderer) renderer.domElement.style.cursor = root ? 'pointer' : 'grab'
      }
    }

    const onPointerDown = (ev: PointerEvent) => {
      downX = ev.clientX
      downY = ev.clientY
    }

    const onPointerUp = (ev: PointerEvent) => {
      // 拖拽视角不算点击
      if (Math.hypot(ev.clientX - downX, ev.clientY - downY) > 6) return
      const root = labelsVisibleRef.current ? pick(ev.clientX, ev.clientY) : null
      const kind = root ? (root.userData as { kind: string }).kind : null
      if (kind === 'book' || kind === 'laptop') {
        setPanel(kind === 'book' ? 'papers' : 'projects')
      } else if (kind === 'speaker') {
        void toggleMusic()
      }
    }

    const onResize = () => {
      if (!mount || !renderer) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.fov = Math.max(54, Math.min(105, THREE.MathUtils.radToDeg(2 * Math.atan(0.7 / camera.aspect))))
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }

    const start = async () => {
      if (disposed) return

      renderer = new THREE.WebGPURenderer({ antialias: true })
      renderer.setSize(mount.clientWidth, mount.clientHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.shadowMap.enabled = true
      await renderer.init()
      if (disposed) return
      mount.appendChild(renderer.domElement)
      onResize()
      resizeObserver = new ResizeObserver(onResize)
      resizeObserver.observe(mount)

      room = buildRoom()
      roomHandleRef.current = room

      // 轨道相机：严格限制在房间内的合理视角
      controls = new OrbitControls(camera, renderer.domElement)
      controls.target.set(0, 2.3, -7)
      controls.enableDamping = true
      controls.dampingFactor = 0.06
      controls.minDistance = 2.2
      controls.maxDistance = 16
      controls.minPolarAngle = 0.9
      controls.maxPolarAngle = 1.78 // 可抬头看屋顶霓虹与吸顶灯
      controls.minAzimuthAngle = -1.3 // 左右限制，不出房间（可看到侧墙的床和爱心）
      controls.maxAzimuthAngle = 1.3
      controls.enablePan = false

      renderer.domElement.addEventListener('pointermove', onPointerMove)
      renderer.domElement.addEventListener('pointerdown', onPointerDown)
      renderer.domElement.addEventListener('pointerup', onPointerUp)
      window.addEventListener('resize', onResize)

      const clock = new THREE.Clock()
      let frames = 0
      const projected = new THREE.Vector3()
      const updateHotspots = () => {
        if (!room) return
        for (const entry of sceneHotspots) {
          const element = hotspotRefs.current.get(entry.id)
          const anchor = room.tagAnchors[entry.id]
          if (!element || !anchor) continue
          anchor.getWorldPosition(projected).project(camera)
          const visible = projected.z > -1 && projected.z < 1 && Math.abs(projected.x) < 0.96 && Math.abs(projected.y) < 0.94
          element.style.visibility = visible ? 'visible' : 'hidden'
          element.style.transform = `translate(${(projected.x * 0.5 + 0.5) * mount.clientWidth}px, ${(-projected.y * 0.5 + 0.5) * mount.clientHeight}px)`
        }
      }
      renderer.setAnimationLoop(() => {
        if (!renderer || !controls || !room) return
        controls.update()
        room.posterWall.tick(clock.getElapsedTime())
        room.tick(clock.getElapsedTime())
        renderer.render(room.scene, camera)
        updateHotspots()
        // 前几帧渲染管线就绪后再揭幕，避免闪黑/半成品画面
        if (++frames === 3) setLoading(false)
      })
    }

    start().catch((err) => {
      console.error('[Room] 初始化失败:', err)
    })

    return () => {
      disposed = true
      window.removeEventListener('resize', onResize)
      resizeObserver?.disconnect()
      if (renderer) {
        renderer.domElement.removeEventListener('pointermove', onPointerMove)
        renderer.domElement.removeEventListener('pointerdown', onPointerDown)
        renderer.domElement.removeEventListener('pointerup', onPointerUp)
      }
      renderer?.setAnimationLoop(null)
      controls?.dispose()
      room?.dispose()
      roomHandleRef.current = null
      musicRef.current?.stop()
      musicRef.current = null
      renderer?.domElement.remove()
      renderer?.dispose()
    }
  }, [])

  const closePanel = () => setPanel(null)

  return (
    <div className="room-root">
      <div ref={mountRef} className="room-mount" />
      {labelsVisible && <div className="scene-signature"><span>Shengqi Dang</span><small>党圣奇 · Visual Affect & Experiments</small></div>}
      {labelsVisible && <nav className="space-navigation" aria-label="Personal navigation">
        <button onClick={() => setPanel('about')}>关于我 About me <span>↗</span></button>
        <button onClick={() => setPanel('contact')}>联系我 Contact <span>↗</span></button>
      </nav>}
      <button className="scene-ui-toggle" onClick={toggleLabels} aria-pressed={!labelsVisible}
        aria-label={labelsVisible ? "隐藏界面 Hide UI" : "显示界面 Show UI"} title="H 切换界面，Esc 恢复">
        {labelsVisible ? "隐藏界面 · Hide UI" : "显示界面 · Show UI"} <kbd>H</kbd>
      </button>

      {!loading && labelsVisible && (
        <nav className="object-hotspots" aria-label="场景入口 Scene objects">
          {sceneHotspots.map(entry => {
            const label = entry.id === 'music' ? `音乐 Music · ${musicError ? '不可用' : musicOn ? 'ON' : 'OFF'}` : entry.label
            return <div key={entry.id} className="object-hotspot" style={{ visibility: 'hidden' }}
              ref={element => { if (element) hotspotRefs.current.set(entry.id, element); else hotspotRefs.current.delete(entry.id) }}>
              <button className={`object-hotspot-button ${entry.id === 'music' && musicOn ? 'is-playing' : ''}`}
                aria-label={label} aria-pressed={entry.id === 'music' ? musicOn : undefined}
                onClick={() => entry.action === 'music' ? void toggleMusic() : setPanel(entry.action)}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d={entry.path} /></svg>
                <span className="object-hotspot-label">{label}</span>
              </button>
            </div>
          })}
        </nav>
      )}

      {/* 3D 场景加载提示：Y2K 波点屏 + 四角闪 */}
      <div className={`room-loading ${loading ? '' : 'done'}`}>
        <div className="loading-sparkle" />
        <div className="loading-title">正在进入房间…</div>
        <div className="loading-dots"><i /><i /><i /></div>
      </div>

      {/* 论文面板：点击桌上的书 */}
      {panel === 'papers' && (
        <div className="poster-modal" onClick={closePanel}>
          <div className="poster-card info-card" onClick={e => e.stopPropagation()}>
            <button className="info-close" onClick={closePanel} aria-label="关闭">✕</button>
            <div className="poster-card-head">
              <h2>研究论文</h2>
              <span className="poster-venue">Publications ✦ {publications.length} 篇</span>
            </div>
            <div className="sync-badge" title={`数据源：${papersMeta.sources.join(' + ')}`}>
              <span className="sync-dot" />自动同步 · {papersMeta.sources.join(' · ')} · 最近成功：{new Date(papersMeta.fetchedAt).toLocaleDateString('zh-CN')}
            </div>
            <div className="paper-summary-toolbar">
              <span>{paperLang === 'zh' ? '论文简介 · TL;DR / 原始摘要' : 'Paper summaries · TL;DR / Abstract'}</span>
              <div role="group" aria-label="论文简介语言 / Summary language">
                <button type="button" aria-pressed={paperLang === 'zh'} onClick={() => setPaperLang('zh')}>中</button>
                <button type="button" aria-pressed={paperLang === 'en'} onClick={() => setPaperLang('en')}>EN</button>
              </div>
            </div>
            <div className="info-list">
              <div className="info-grid">
                {publications.map(p => (
                  <div className="info-item" key={p.title}>
                    <div className="info-item-title">{p.title}</div>
                    <div className="info-item-meta">
                      {p.stamp && <span className="stamp">{p.stamp}</span>}
                      {typeof p.citationCount === 'number' && p.citationCount > 0 && (
                        <span className="cites">被引 {p.citationCount}</span>
                      )}
                      {p.url && (
                        <a className="info-link" href={p.url} target="_blank" rel="noreferrer">PDF ↗</a>
                      )}
                    </div>
                    <span className="paper-summary-kind">{p.summarySource ? (paperLang === 'zh' ? 'TL;DR · 据摘要核对' : 'TL;DR · Reviewed against abstract') : (paperLang === 'zh' ? '自动同步摘要 · 未整理 TL;DR' : 'Synced abstract · TL;DR pending')}</span>
                    <div className="info-item-desc">{(paperLang === 'zh' && p.abstractZh ? p.abstractZh : p.abstract) || (paperLang === 'zh' ? '数据源暂未提供摘要，可查看论文原文。' : 'Abstract not yet available from the data source. Please see the paper.')}</div>
                    {p.summarySource && <a className="paper-summary-source" href={p.summarySource} target="_blank" rel="noreferrer">{paperLang === 'zh' ? '摘要原文' : 'Source abstract'} ↗</a>}
                    <div className="info-item-foot">
                      <span className="authors">{p.authors}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 作品集：点击桌上的笔记本 */}
      {panel === 'projects' && <Collection onClose={closePanel} />}

      {/* About me：点击左缘猫猫 */}
      {panel === 'about' && (
        <div className="poster-modal" onClick={closePanel}>
          <div className="poster-card info-card about-card" onClick={e => e.stopPropagation()}>
            <button className="info-close" onClick={closePanel} aria-label="关闭">✕</button>
            <div className="about-sheet">
              <header className="about-cover">
                <div className="about-topline">
                  <span className="about-eyebrow">ABOUT / 关于</span>
                  <div className="about-language" role="group" aria-label="About Me language">
                    <button type="button" className={aboutLang === 'zh' ? 'active' : ''} onClick={() => setAboutLang('zh')} aria-pressed={aboutLang === 'zh'}>中</button>
                    <span aria-hidden="true">/</span>
                    <button type="button" className={aboutLang === 'en' ? 'active' : ''} onClick={() => setAboutLang('en')} aria-pressed={aboutLang === 'en'}>EN</button>
                  </div>
                </div>
                <div className="about-title-row">
                  <div>
                    <span className="about-hello">{aboutLang === 'zh' ? '关于' : 'About'}</span>
                    <h2>{aboutLang === 'zh' ? profile.nameZh : profile.name}<span>{aboutLang === 'zh' ? profile.name : profile.nameZh}</span></h2>
                    <p className="about-identity">{aboutLang === 'zh' ? profile.roleZh : profile.role}</p>
                  </div>
                  <figure className="about-portrait">
                    <img src="./images/shengqi-dang.jpg" alt={aboutLang === 'zh' ? '党圣奇的照片' : 'Portrait of Shengqi Dang'} width="1279" height="1706" />
                  </figure>
                </div>
              </header>

              <div className="about-columns">
                <main className="about-story">
                  <p className="about-fragment">{aboutLang === 'zh' ? profile.bioZh : profile.bio}</p>
                  <section className="about-journey">
                    <h3>{aboutLang === 'zh' ? '走过的路' : 'The path so far'} <span>{aboutLang === 'zh' ? 'how I got here' : 'education & detours'}</span></h3>
                    <ol>
                      {profile.education.map(e => (
                        <li key={e.period}>
                          <time>{e.period}</time>
                          <span>{e.text}</span>
                        </li>
                      ))}
                    </ol>
                  </section>
                </main>
                <aside className="about-margin">
                  <div className="about-margin-note">
                    <span className="about-note-label">{aboutLang === 'zh' ? '最近着迷 / currently into' : 'CURRENTLY INTO'}</span>
                    <p>{profile.interests.join(' · ')}</p>
                  </div>
                  <div className="about-margin-note about-personal-note">
                    <span className="about-note-label">{aboutLang === 'zh' ? '页边的小字' : 'IN THE MARGINS'}</span>
                    <p>{aboutLang === 'zh' ? profile.personality : profile.personalityEn}</p>
                    <ul>{(aboutLang === 'zh' ? profile.funFacts : profile.funFactsEn).map(f => <li key={f}>{f}</li>)}</ul>
                  </div>
                </aside>
              </div>
              <footer className="about-footer">
                <span aria-hidden="true">✳</span>
                <a href={`mailto:${profile.email}`}>write me a note ↗</a>
              </footer>
            </div>
          </div>
        </div>
      )}

      {/* Contact me：点击右缘史莱姆 */}
      {panel === 'contact' && (
        <div className="poster-modal" onClick={closePanel}>
          <div className="poster-card info-card contact-card" onClick={e => e.stopPropagation()}>
            <button className="info-close" onClick={closePanel} aria-label="关闭">✕</button>
            <div className="poster-card-head">
              <h2>联系我</h2>
              <span className="poster-venue">Contact ✦ Say Hi</span>
            </div>
            <div className="info-list">
              <a className="contact-mail" href={`mailto:${profile.email}`}>
                <span className="mail-icon">✉</span>
                {profile.email}
              </a>
              <div className="about-sec">✦ 在哪儿能找到我</div>
              <ul className="about-edu">
                {profile.affiliations.map(a => <li key={a}>{a}</li>)}
              </ul>
              <p className="contact-note">无论是研究合作、好玩的项目，还是只是想聊聊设计与 AI，都欢迎写信给我，我会尽快回复 ✦</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
