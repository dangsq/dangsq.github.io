import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three/webgpu'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { buildRoom, type RoomHandle } from './scene'
import { EdgeCritters } from './EdgeCritters'
import { publications, projects, profile } from '../data/content'
import './Room.css'

type PanelKind = 'papers' | 'projects' | 'about' | 'contact' | null

export function Room() {
  const mountRef = useRef<HTMLDivElement>(null)
  const papersTagRef = useRef<HTMLDivElement>(null)
  const projectsTagRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [panel, setPanel] = useState<PanelKind>(null)

  /* ESC 关闭面板 */
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') setPanel(null)
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

    // 相机：水平直视后墙（正对桌子与海报）
    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 60)
    camera.position.set(0, 1.85, -1.0)

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
          if (kind === 'book' || kind === 'laptop') return o
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
      const root = pick(ev.clientX, ev.clientY)
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
      const root = pick(ev.clientX, ev.clientY)
      const kind = root ? (root.userData as { kind: string }).kind : null
      if (kind === 'book' || kind === 'laptop') {
        setPanel(kind === 'book' ? 'papers' : 'projects')
      }
    }

    const onResize = () => {
      if (!mount || !renderer) return
      camera.aspect = mount.clientWidth / mount.clientHeight
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

      room = buildRoom()

      // 轨道相机：严格限制在房间内的合理视角
      controls = new OrbitControls(camera, renderer.domElement)
      controls.target.set(0, 1.9, -3.9)
      controls.enableDamping = true
      controls.dampingFactor = 0.06
      controls.minDistance = 2.2
      controls.maxDistance = 4.5
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
      // 常驻 2D 贴纸标签：把 3D 锚点投影到屏幕坐标，标签跟随
      const tagVec = new THREE.Vector3()
      const updateTags = () => {
        if (!room) return
        const w = mount.clientWidth
        const h = mount.clientHeight
        const place = (anchor: THREE.Object3D, el: HTMLDivElement | null) => {
          if (!el) return
          tagVec.setFromMatrixPosition(anchor.matrixWorld)
          tagVec.project(camera)
          el.style.transform = `translate(${(tagVec.x * 0.5 + 0.5) * w}px, ${(-tagVec.y * 0.5 + 0.5) * h}px)`
        }
        place(room.tagAnchors.papers, papersTagRef.current)
        place(room.tagAnchors.projects, projectsTagRef.current)
      }
      renderer.setAnimationLoop(() => {
        if (!renderer || !controls || !room) return
        controls.update()
        room.posterWall.tick(clock.getElapsedTime())
        room.tick(clock.getElapsedTime())
        renderer.render(room.scene, camera)
        updateTags()
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
      if (renderer) {
        renderer.domElement.removeEventListener('pointermove', onPointerMove)
        renderer.domElement.removeEventListener('pointerdown', onPointerDown)
        renderer.domElement.removeEventListener('pointerup', onPointerUp)
      }
      renderer?.setAnimationLoop(null)
      controls?.dispose()
      room?.dispose()
      renderer?.domElement.remove()
      renderer?.dispose()
    }
  }, [])

  const closePanel = () => setPanel(null)

  return (
    <div className="room-root">
      <div ref={mountRef} className="room-mount" />
      <EdgeCritters onCatClick={() => setPanel('about')} onSlimeClick={() => setPanel('contact')} />

      {/* 常驻 2D 贴纸标签：标示可交互的物体（跟随 3D 锚点） */}
      {!loading && (
        <>
          <div ref={papersTagRef} className="scene-tag-wrap">
            <button className="scene-tag tag-papers" onClick={() => setPanel('papers')}>
              <span className="tag-icon">✦</span>论文 Papers
            </button>
          </div>
          <div ref={projectsTagRef} className="scene-tag-wrap">
            <button className="scene-tag tag-projects" onClick={() => setPanel('projects')}>
              <span className="tag-icon">✿</span>设计 Projects
            </button>
          </div>
        </>
      )}

      {/* 3D 场景加载提示：Y2K 波点屏 + 四角闪 */}
      <div className={`room-loading ${loading ? '' : 'done'}`}>
        <div className="loading-sparkle" />
        <div className="loading-title">正在搭建小房间…</div>
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
            <div className="info-list">
              {publications.map(p => (
                <div className="info-item" key={p.title}>
                  <div className="info-item-title">{p.title}</div>
                  <div className="info-item-meta">
                    {p.stamp && <span className="stamp">{p.stamp}</span>}
                    <span className="authors">{p.authors}</span>
                  </div>
                  <div className="info-item-desc">{p.abstract}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 设计项目面板：点击桌上的笔记本 */}
      {panel === 'projects' && (
        <div className="poster-modal" onClick={closePanel}>
          <div className="poster-card info-card" onClick={e => e.stopPropagation()}>
            <button className="info-close" onClick={closePanel} aria-label="关闭">✕</button>
            <div className="poster-card-head">
              <h2>设计项目</h2>
              <span className="poster-venue">Projects ✦ {projects.length} 个</span>
            </div>
            <div className="info-list">
              {projects.map(p => (
                <div className="info-item" key={p.title}>
                  <div className="info-item-title">
                    {p.title}
                    {p.titleEn && p.titleEn !== p.title && <span className="title-en"> · {p.titleEn}</span>}
                  </div>
                  <div className="info-item-meta">
                    <span className="stamp">{p.tags}</span>
                  </div>
                  <div className="info-item-desc">{p.desc}</div>
                  <div className="info-item-foot">
                    <span className="authors">{p.team}</span>
                    {p.link && (
                      <a className="info-link" href={p.link} target="_blank" rel="noreferrer">去看看 ↗</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* About me：点击左缘猫猫 */}
      {panel === 'about' && (
        <div className="poster-modal" onClick={closePanel}>
          <div className="poster-card info-card" onClick={e => e.stopPropagation()}>
            <button className="info-close" onClick={closePanel} aria-label="关闭">✕</button>
            <div className="poster-card-head">
              <h2>关于我</h2>
              <span className="poster-venue">{profile.roleZh} · {profile.role}</span>
            </div>
            <div className="info-list">
              <p className="about-name">{profile.nameZh}<span className="about-name-en">{profile.name}</span></p>
              <p className="about-tagline">{profile.taglineZh}</p>
              <p className="about-bio">{profile.bioZh}</p>
              <div className="about-sec">✦ 兴趣方向</div>
              <div className="about-tags">
                {profile.interests.map(it => <span className="about-tag" key={it}>{it}</span>)}
              </div>
              <div className="about-sec">✦ 教育经历</div>
              <ul className="about-edu">
                {profile.education.map(e => (
                  <li key={e.period}><span className="edu-period">{e.period}</span>{e.text}</li>
                ))}
              </ul>
              <div className="about-sec">✦ 小档案</div>
              <ul className="about-facts">
                <li>{profile.personality}</li>
                {profile.funFacts.map(f => <li key={f}>{f}</li>)}
              </ul>
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
