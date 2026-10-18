import * as THREE from 'three/webgpu'
import { toonMat, addOutline, rbox } from './wood'
import { createAnomalousMaterial, createFoldedSpace, setDreamMaterialTime } from './atelier'
import { buildPosterWall, buildMikuPoster, type PosterWallHandle } from './posters'
import { createDreamObjects } from './dreamObjects'
import { createDistantSculptures } from './distantSculptures'
import { createMusicShader } from './musicShader'
import { MUSIC_BAR_SECONDS, MUSIC_BEAT_SECONDS } from './music'

export type RoomHandle = {
  scene: THREE.Scene
  lampLight: THREE.PointLight
  sunLight: THREE.DirectionalLight
  posterWall: PosterWallHandle
  /* 常驻 2D 标签锚点：书排（论文）/ 笔记本（设计），投影到屏幕后放置贴纸标签 */
  tagAnchors: Record<string, THREE.Object3D>
  setSpeakerPlaying: (on: boolean) => void
  tick: (t: number) => void
  setNight: (on: boolean) => void
  dispose: () => void
}

const C = { bg: '#A1F7EB' }

/* ── 午后阳光：从左墙窗外斜射入房（中性暖白，避免整体泡黄）── */
function makeSun() {
  const sun = new THREE.DirectionalLight(0xFFE8C8, 2.2)
  sun.position.set(-8, 5, 3.5)
  sun.target.position.set(1.5, 0, -0.5)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.camera.left = -9
  sun.shadow.camera.right = 9
  sun.shadow.camera.top = 9
  sun.shadow.camera.bottom = -9
  sun.shadow.camera.near = 0.5
  sun.shadow.camera.far = 25
  sun.shadow.bias = -0.0004
  return sun
}

export function buildRoom(): RoomHandle {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(C.bg)

  /* ── 光照 ── */
  // 夜色基调：环境光偏冷紫，与暖黄台灯/霓虹形成冷暖对比（旧版全暖光→粉紫雾）
  const ambient = new THREE.AmbientLight(0xEBF1F5, 0.75)
  const hemi = new THREE.HemisphereLight(0xE6F4F8, 0x8DAFC6, 0.48)
  const sun = makeSun()
  sun.intensity = 2.0
  const lampLight = new THREE.PointLight(0xF5FAFF, 5, 13, 2.0)
  lampLight.position.set(0, 5.6, -2.5)
  lampLight.castShadow = true
  lampLight.shadow.mapSize.set(1024, 1024)
  lampLight.shadow.bias = -0.005
  scene.add(ambient, hemi, sun, sun.target, lampLight)

  const foldedSpace = createFoldedSpace()
  scene.add(foldedSpace.group)
  const dreamObjects = createDreamObjects()
  scene.add(dreamObjects.group)
  const distantSculptures = createDistantSculptures()
  scene.add(distantSculptures.group)

  // 哑光墙贴：保留原本的爱心图案，但不发光。
  const heartShape = new THREE.Shape()
  heartShape.moveTo(0, -0.34)
  heartShape.bezierCurveTo(-0.2, -0.1, -0.46, 0.08, -0.42, 0.27)
  heartShape.bezierCurveTo(-0.38, 0.48, -0.12, 0.47, 0, 0.29)
  heartShape.bezierCurveTo(0.12, 0.47, 0.38, 0.48, 0.42, 0.27)
  heartShape.bezierCurveTo(0.46, 0.08, 0.2, -0.1, 0, -0.34)
  const heartStickerGeometry = new THREE.ShapeGeometry(heartShape)
  for (const [x, y, scale, tilt, tint] of [
    [-1.7, 2.8, 0.46, -0.15, '#007CBE'],
    [-2.15, 3.3, 0.28, 0.23, '#00CBB0'],
    [1.48, 3.56, 0.43, 0.17, '#00A9BF'],
  ] as const) {
    const sticker = new THREE.Mesh(heartStickerGeometry, new THREE.MeshBasicNodeMaterial({
      color: tint, side: THREE.DoubleSide,
    }))
    sticker.position.set(x, y, -4.91)
    sticker.scale.setScalar(scale)
    sticker.rotation.z = tilt
    scene.add(sticker)
  }

  /* ── 大像素海报：后墙正中 ── */
  const posterWall = buildPosterWall()
  posterWall.group.position.x = -3.9
  posterWall.frame.scale.setScalar(0.42)
  scene.add(posterWall.group)

  /* ── Miku 像素海报：后墙右侧（动态）── */
  const mikuPoster = buildMikuPoster()
  mikuPoster.group.position.set(-2.9, 1.9, -6.2)
  scene.add(mikuPoster.group)

  /* ── 海报周围保留少量个人物件，让墙面有呼吸空间 ── */
  // 挂架（海报左侧）：白色小隔板 + 三角支架 + 迷你摆件
  const hangShelf = new THREE.Group()
  const hsBoard = new THREE.Mesh(rbox(1.05, 0.06, 0.26, 0.028), toonMat('#FFF9F0'))
  hsBoard.castShadow = true
  addOutline(hsBoard, 0.008)
  const hsBracketGeo = new THREE.BoxGeometry(0.05, 0.05, 0.22)
  for (const bx of [-0.42, 0.42]) {
    const bracket = new THREE.Mesh(hsBracketGeo, toonMat('#75C7C3'))
    bracket.position.set(bx, -0.09, -0.03)
    bracket.rotation.z = 0.5
    hangShelf.add(bracket)
  }
  // 迷你盆栽 + 小相框 + 小星星
  const miniPot = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.065, 0.09, 12), toonMat('#75C7C3'))
  miniPot.position.set(-0.32, 0.075, 0)
  const miniPlant = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), toonMat('#4ED492'))
  miniPlant.scale.set(1, 1.25, 1)
  miniPlant.position.set(-0.32, 0.18, 0)
  miniPlant.castShadow = true
  const miniFrame = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.03), toonMat('#B4CDA2'))
  miniFrame.position.set(-0.02, 0.14, 0.02)
  miniFrame.rotation.z = -0.08
  const miniStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.07), toonMat('#57C1F0'))
  miniStar.position.set(0.32, 0.16, 0)
  miniStar.rotation.y = 0.6
  hangShelf.add(hsBoard, miniPot, miniPlant, miniFrame, miniStar)
  hangShelf.position.set(-3.1, 1.1, -4.87)
  scene.add(hangShelf)

  // 后墙小星星装饰（黄粉蓝，发亮）
  const starGeo = new THREE.OctahedronGeometry(0.05)
  const starColors = ['#B4CDA2', '#FF9ECC', '#57C1F0']
  const starPos: [number, number][] = [[3.75, 3.2], [4.35, 3.3], [4.0, 2.1]]
  starPos.forEach(([sx, sy], i) => {
    const star = new THREE.Mesh(starGeo, new THREE.MeshBasicNodeMaterial({ color: starColors[i] }))
    star.position.set(sx, sy, -4.9)
    star.rotation.z = i * 0.8
    scene.add(star)
  })

  // 拍立得照片串（右墙，床上方）：木夹 + 三张 pastel 拍立得
  const picColors = ['#FFD9EF', '#CFEBF5', '#FFF3A0']
  const clipColors = ['#75C7C3', '#57C1F0', '#B4CDA2']
  const picZ = [-2.65, -3.35, -4.05]
  picZ.forEach((pz, i) => {
    const u = i / 2
    const py = 2.78 - Math.sin(u * Math.PI) * 0.16 - 0.2
    const p = new THREE.Group()
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.24, 0.012), toonMat('#FFFDF8'))
    addOutline(frame, 0.007)
    const pic = new THREE.Mesh(new THREE.PlaneGeometry(0.155, 0.16), toonMat(picColors[i]))
    pic.position.set(0, 0.02, 0.008)
    const picStar = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.022),
      new THREE.MeshBasicNodeMaterial({ color: '#FFFFFF' }),
    )
    picStar.position.set(0, 0.02, 0.016)
    picStar.rotation.z = 0.4
    const clip = new THREE.Mesh(
      new THREE.BoxGeometry(0.028, 0.05, 0.018),
      toonMat(clipColors[i]),
    )
    clip.position.y = 0.135
    p.add(frame, pic, picStar, clip)
    p.position.set(4.94, py, pz)
    p.rotation.y = -Math.PI / 2
    p.rotation.z = (i % 2 === 0 ? 1 : -1) * 0.05
    scene.add(p)
  })

  // 彩灯闪烁 + 向日葵随风摇晃
  let lastScreenT = 0
  let musicPlaying = false
  let danceStartedAt = 0
  const tick = (t: number) => {
    musicShader.tick(t, musicPlaying)
    foldedSpace.tick(t, musicPlaying)
    setDreamMaterialTime(t)
    distantSculptures.tick(t)
    // The paw trail dissolves into open space beyond the foreground island.
    const handPosition = handTarget.set(8.5, 7.6, -20)
    dreamObjects.setDestination(foreground.worldToLocal(handPosition))
    dreamObjects.tick(t)
    // The room never quite settles: familiar objects drift on different cycles.
    const drift = musicPlaying ? 1.45 : 1
    props.position.y = 0.08
    bear.position.set(-0.9 + Math.sin(t * 0.31) * 0.16,
      0.91 + Math.sin(t * 0.67 + 0.8) * 0.025, -3.7 + Math.cos(t * 0.27) * 0.1)
    bear.rotation.y = Math.sin(t * 0.24) * 0.25
    bear.rotation.z = Math.sin(t * 0.43) * 0.07
    slime.position.set(0.35 + Math.sin(t * 0.39 + 2) * 0.19,
      0.98 + Math.sin(t * 0.83 + 2) * 0.018, -3.62 + Math.cos(t * 0.32 + 1) * 0.13)
    slime.rotation.y = -0.25 + Math.sin(t * 0.3 + 1) * 0.3
    slime.rotation.z = Math.sin(t * 0.51 + 1) * 0.09
    clock.position.set(-1.25 + Math.sin(t * 0.23 + 1.5) * 0.1,
      1.045 + Math.sin(t * 0.58 + 2.4) * 0.018, -3.42 + Math.cos(t * 0.29 + 0.7) * 0.065)
    clock.rotation.y = 0.3 + Math.sin(t * 0.26) * 0.18
    clock.rotation.z = Math.sin(t * 0.46 + 1.3) * 0.12
    surfaceRipples.forEach(({ mesh, object, phase }, i) => {
      const expansion = (t * 0.18 + phase) % 1
      mesh.position.set(object.position.x, 1.116 + (i % 2) * 0.001, object.position.z)
      mesh.scale.setScalar(0.8 + expansion * 0.65)
      mesh.material.opacity = Math.sin(expansion * Math.PI) * 0.32
    })
    displayBook.position.y = 1.12 + Math.sin(t * 0.29 + 1.4) * 0.15
    displayBook.rotation.z = 0.04 + Math.sin(t * 0.42 + 0.8) * 0.11
    mug.position.y = 1.03 + Math.sin(t * 0.41 + 2.2) * 0.025
    mug.rotation.z = Math.sin(t * 0.51 + 0.4) * 0.09
    laptop.position.y = 1.2 + Math.sin(t * 0.62 + 2.7) * 0.04
    laptop.rotation.y = 0.15 + Math.sin(t * 0.36) * 0.06
    speaker.position.y = 1.2 + Math.sin(t * 0.92 + 1.8) * 0.04
    chair.position.y = 0.26 + Math.sin(t * 0.29 * drift + 1.1) * 0.12
    chair.position.z = -3.03 + Math.sin(t * 0.21) * 0.15
    chair.rotation.x = Math.sin(t * 0.19) * 0.13
    blanket.position.y = 0.39 + Math.sin(t * 0.22 + 1) * 0.1
    blanket.rotation.z = Math.sin(t * 0.17) * 0.08
    chair.rotation.y = Math.PI - 0.35 + Math.sin(t * 0.42) * 0.085
    posterWall.group.position.y = 1.3 + Math.sin(t * 0.37 + 0.4) * 0.09
    posterWall.frame.position.z = -4.72 + Math.sin(t * 0.41 + 0.6) * 0.14
    posterWall.frame.rotation.y = Math.sin(t * 0.35) * 0.11
    posterWall.frame.rotation.x = Math.sin(t * 0.27 + 1.2) * 0.05
    posterWall.frame.rotation.z = 0.012 + Math.sin(t * 0.29) * 0.035
    mikuPoster.group.position.y = 1.9 + Math.sin(t * 0.49 + 2) * 0.065
    mikuPoster.group.position.z = -6.2 + Math.sin(t * 0.39 + 1.8) * 0.13
    mikuPoster.group.rotation.z = Math.sin(t * 0.32 + 1.7) * 0.035
    sfSway.rotation.z = Math.sin(t * 0.9) * 0.045
    sfSway.rotation.x = Math.cos(t * 0.7) * 0.03
    if (musicPlaying) {
      const elapsed = performance.now() / 1000 - danceStartedAt
      const phase = (elapsed / MUSIC_BEAT_SECONDS) * Math.PI * 2
      const section = Math.floor(elapsed / (MUSIC_BAR_SECONDS * 4)) % 4
      const palette = musicPalettes[section]
      const pulse = Math.pow(Math.max(0, Math.cos(phase)), 6)
      ;(scene.background as THREE.Color).lerp(palette.bg, 0.035)
      ambient.color.lerp(palette.left, 0.035)
      hemi.color.lerp(palette.right, 0.035)
      lampLight.color.lerp(palette.left, 0.035)
      musicGlowLeft.color.lerp(palette.left, 0.045)
      musicGlowRight.color.lerp(palette.right, 0.045)
      musicGlowLeft.intensity = 0.55 + pulse * 0.22
      musicGlowRight.intensity = 0.42 + pulse * 0.18
      neonLight.intensity = 0.12
      neonCyanLight.intensity = 0.1
      neonYellowLight.intensity = 0.06
      musicMotes.forEach(({ mesh, x, y, z, phase: offset }) => {
        mesh.position.set(x + Math.sin(elapsed * 0.6 + offset) * 0.08,
          y + Math.sin(elapsed * 0.9 + offset) * 0.12, z)
        mesh.rotation.y += 0.012
        mesh.scale.setScalar(0.75 + 0.25 * Math.sin(phase + offset))
      })
      const hop = Math.pow(Math.max(0, Math.sin(phase)), 2)
      bear.position.y += hop * 0.025
      bear.rotation.z = Math.sin(phase * 0.5) * 0.17
      head.rotation.z = 0.1 + Math.sin(phase) * 0.16
      bearArms.forEach((arm, i) => { arm.rotation.z = (i === 0 ? 0.5 : -0.5) + Math.sin(phase + i * Math.PI) * 0.38 })
      slime.position.y += Math.pow(Math.max(0, Math.sin(phase + 1)), 2) * 0.02
      slime.scale.set(1 + Math.sin(phase + 1) * 0.08, 1 - Math.sin(phase + 1) * 0.12, 1)
      slime.rotation.z = Math.sin(phase * 0.5 + 1) * 0.2
      duck.position.y = 1.3025 + Math.pow(Math.max(0, Math.sin(phase + 2)), 2) * 0.07
      duck.rotation.z = Math.sin(phase * 0.5 + 2) * 0.17
      sfSway.rotation.z += Math.sin(phase) * 0.18
    }
    mikuPoster.tick(t)
    // 12fps 刷新两块屏幕的像素动画
    if (t - lastScreenT > 0.08) {
      lastScreenT = t
      renderLapScreen(t)
      lapTex.needsUpdate = true
      renderHhScreen(t)
      hhTex.needsUpdate = true
    }
    // 蝴蝶：绕圈飞 + 上下起伏 + 扑翅 + 身体轻摆
    butterflies.forEach((bf) => {
      const a = t * bf.sp + bf.ph
      const px = bf.cx + Math.cos(a) * bf.r
      const pz = bf.cz + Math.sin(a) * bf.r * 0.8
      const py = bf.cy + Math.sin(t * bf.bsp + bf.ph * 2.3) * 0.15
      const a2 = a + 0.15
      bf.g.position.set(px, py, pz)
      bf.g.lookAt(bf.cx + Math.cos(a2) * bf.r, py, bf.cz + Math.sin(a2) * bf.r * 0.8)
      bf.g.rotateZ(Math.sin(t * bf.bsp + bf.ph) * 0.14)
      const flap = Math.sin(t * bf.flap + bf.ph) * 0.95
      bf.pl.rotation.z = -flap
      bf.pr.rotation.z = flap
      // 翅膀微透光呼吸（幅度很小，若有似无）
      bf.wingMat.emissiveIntensity = 0.16 + 0.12 * Math.sin(t * 1.8 + bf.ph)
      // 电子感：霓虹线框信号闪烁（快节奏，像数据流脉冲）
      bf.neonMat.opacity = 0.45 + 0.55 * Math.abs(Math.sin(t * 3.4 + bf.ph * 2))
    })
  }

  /* ── 地毯：双层圆叠出描边感 ── */


  /* ── Y2K 书桌：白桌板 + 粉前裙板 + 四条白圆腿 ── */
  const desk = new THREE.Group()

  const top = new THREE.Mesh(rbox(3.4, 0.1, 1.7, 0.045), new THREE.MeshBasicNodeMaterial({ color: '#EAF3F7' }))
  top.position.y = 1.05
  top.castShadow = true
  top.receiveShadow = true
  addOutline(top, 0.014)

  // 粉色前裙板（镜头方向一面）——灰樱粉，亮粉只留给小物件
  const apron = new THREE.Mesh(rbox(3.2, 0.16, 0.07, 0.03), toonMat('#C8DCE9'))
  apron.position.set(0, 0.94, 0.8)
  apron.castShadow = true
  addOutline(apron, 0.008)

  // 四条白色圆腿
  const legGeo = new THREE.CylinderGeometry(0.055, 0.05, 0.95, 14)
  const legMat = toonMat('#D6E5EB')
  const legs: THREE.Mesh[] = []
  for (const [x, z] of [[-1.55, -0.72], [1.55, -0.72], [-1.55, 0.72], [1.55, 0.72]]) {
    const leg = new THREE.Mesh(legGeo, legMat)
    leg.position.set(x, 0.475, z)
    leg.castShadow = true
    addOutline(leg, 0.01)
    legs.push(leg)
  }

  desk.add(top, apron, ...legs)
  desk.position.set(0, 0, -4.06)
  scene.add(desk)

  /* ── 格子布顶面与三面垂边；顶面随缓慢的波浪变形 ── */
  const drawGingham = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const cell = 32
    ctx.fillStyle = '#F4FFFB'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = 'rgba(0, 181, 175, 0.31)'
    for (let x = 0; x < w; x += cell) ctx.fillRect(x, 0, cell / 2, h)
    for (let y = 0; y < h; y += cell) ctx.fillRect(0, y, w, cell / 2)
    ctx.fillStyle = 'rgba(0, 133, 160, 0.21)'
    for (let y = 0; y < h; y += cell) {
      for (let x = 0; x < w; x += cell) ctx.fillRect(x, y, cell / 2, cell / 2)
    }
  }
  const clothTopCanvas = document.createElement('canvas')
  clothTopCanvas.width = 256; clothTopCanvas.height = 128
  drawGingham(clothTopCanvas.getContext('2d')!, 256, 128)
  const clothTopTexture = new THREE.CanvasTexture(clothTopCanvas)
  clothTopTexture.colorSpace = THREE.SRGBColorSpace
  clothTopTexture.wrapS = THREE.RepeatWrapping
  clothTopTexture.wrapT = THREE.RepeatWrapping
  clothTopTexture.anisotropy = 8
  clothTopTexture.repeat.set(1.5, 1.5)
  const clothTopGeometry = new THREE.PlaneGeometry(3.48, 1.78)
  const clothTopMat = new THREE.MeshBasicNodeMaterial({ map: clothTopTexture, side: THREE.DoubleSide })
  const clothTop = new THREE.Mesh(clothTopGeometry, clothTopMat)
  clothTop.rotation.x = -Math.PI / 2
  clothTop.position.set(0, 1.11, -4.06)
  clothTop.receiveShadow = true
  scene.add(clothTop)
  // 垂边纹理（底部扇贝镂空）
  const clothSkirtCv = document.createElement('canvas')
  clothSkirtCv.width = 128; clothSkirtCv.height = 64
  {
    const c = clothSkirtCv.getContext('2d')!
    drawGingham(c, 128, 64)
    const cell = 32
    // 粉色滚边一条
    c.fillStyle = '#03B9CA'
    c.fillRect(0, 40, 128, 4)
    // 底部扇贝镂空
    c.globalCompositeOperation = 'destination-out'
    for (let x = cell / 2; x <= 128; x += cell) {
      c.beginPath()
      c.arc(x, 64, cell * 0.62, 0, Math.PI * 2)
      c.fill()
    }
    c.globalCompositeOperation = 'source-over'
  }
  const makeSkirtMat = () => {
    const tex = new THREE.CanvasTexture(clothSkirtCv)
    tex.wrapS = THREE.RepeatWrapping
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    const mat = new THREE.MeshBasicNodeMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, toneMapped: false })
    mat.alphaTest = 0.4
    return mat
  }
  // 前垂边（桌前缘）
  const skirtF = new THREE.Mesh(new THREE.PlaneGeometry(3.48, 0.4), makeSkirtMat())
  skirtF.material.map!.repeat.set(7, 1)
  skirtF.position.set(0, 0.906, -3.2)
  // 左右垂边
  const skirtL = new THREE.Mesh(new THREE.PlaneGeometry(1.78, 0.4), makeSkirtMat())
  skirtL.material.map!.repeat.set(3.5, 1)
  skirtL.rotation.y = -Math.PI / 2
  skirtL.position.set(-1.735, 0.906, -4.06)
  const skirtR = skirtL.clone()
  skirtR.rotation.y = Math.PI / 2
  skirtR.position.x = 1.735
  scene.add(skirtF, skirtL, skirtR)

  /* ── Y2K 椅子：奶油白 + 粉坐垫，半拉开 ── */
  const chairMat = createAnomalousMaterial('#E5EFF1')
  const chair = new THREE.Group()
  const seat = new THREE.Mesh(rbox(0.5, 0.05, 0.48, 0.024), chairMat)
  seat.position.y = 0.46
  seat.castShadow = true
  seat.receiveShadow = true
  addOutline(seat, 0.012)
  // 粉色软坐垫
  const cushion = new THREE.Mesh(rbox(0.44, 0.05, 0.42, 0.024), toonMat('#A9D5E4'))
  cushion.position.y = 0.51
  cushion.castShadow = true
  addOutline(cushion, 0.01)
  // 椅背 + 爱心镂空装饰
  const backrest = new THREE.Mesh(rbox(0.5, 0.55, 0.05, 0.024), chairMat)
  backrest.position.set(0, 0.82, -0.22)
  backrest.castShadow = true
  addOutline(backrest, 0.012)
  const heartDeco = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.13, 0.02), toonMat('#A8D7D1'))
  heartDeco.position.set(0, 0.82, -0.185)
  heartDeco.rotation.z = Math.PI / 4
  const cLegGeo = new THREE.CylinderGeometry(0.03, 0.028, 0.46, 10)
  const cLegs = [[-0.2, -0.19], [0.2, -0.19], [-0.2, 0.19], [0.2, 0.19]].map(([x, z]) => {
    const l = new THREE.Mesh(cLegGeo, chairMat)
    l.position.set(x, 0.23, z)
    l.castShadow = true
    addOutline(l, 0.01)
    return l
  })
  chair.add(seat, cushion, backrest, heartDeco, ...cLegs)
  chair.position.set(0.85, 0, -2.45)
  chair.rotation.y = Math.PI - 0.35
  scene.add(chair)

  /* ── Y2K 大床（右后角，靠后墙，2.2×3.0）── */
  const bed = new THREE.Group()
  // 床架 + 床头板
  const bedFrame = new THREE.Mesh(rbox(2.2, 0.24, 3.0, 0.07), createAnomalousMaterial('#E2ECEF'))
  bedFrame.position.set(0, 0.12, 0)
  bedFrame.castShadow = true
  bedFrame.receiveShadow = true
  addOutline(bedFrame, 0.012)
  const headboard = new THREE.Mesh(rbox(2.2, 0.95, 0.1, 0.045), createAnomalousMaterial('#EAF3F0'))
  headboard.position.set(0, 0.64, -1.55)
  headboard.castShadow = true
  addOutline(headboard, 0.012)
  // 床垫
  const mattress = new THREE.Mesh(rbox(2.05, 0.18, 2.82, 0.07), toonMat('#FFEEF5'))
  mattress.position.set(0, 0.33, 0)
  mattress.receiveShadow = true
  // 粉色被子（盖住床尾 2/3）——灰樱粉大色块，避免大面积高饱和
  const blanket = new THREE.Mesh(rbox(2.1, 0.08, 2.1, 0.04), createAnomalousMaterial('#E9FFFB'))
  blanket.position.set(0, 0.45, 0.45)
  blanket.castShadow = true
  addOutline(blanket, 0.01)
  const blanketTrim = new THREE.Mesh(rbox(2.12, 0.035, 0.16, 0.015), toonMat('#8BBFC2'))
  blanketTrim.position.set(0, 0.48, -0.55)
  // 双枕头 + 爱心抱枕
  const pillow = new THREE.Mesh(rbox(0.9, 0.15, 0.5, 0.07), toonMat('#FFFDF8'))
  pillow.position.set(-0.42, 0.48, -1.12)
  pillow.castShadow = true
  addOutline(pillow, 0.01)
  const pillow2 = pillow.clone()
  pillow2.position.set(0.45, 0.48, -1.12)
  const heartCushion = new THREE.Mesh(rbox(0.3, 0.3, 0.12, 0.05), toonMat('#A8D7D1'))
  heartCushion.position.set(0.85, 0.52, -0.85)
  heartCushion.rotation.z = Math.PI / 4
  addOutline(heartCushion, 0.008)
  bed.add(bedFrame, headboard, mattress, blanket, blanketTrim, pillow, pillow2, heartCushion)
  bed.position.set(3.75, 0, -3.35)
  bed.rotation.y = 0.02
  scene.add(bed)

  /* ── 小书架（左墙，窗下方）── */
  const shelf = new THREE.Group()
  const shelfWhite = createAnomalousMaterial('#EBF3F2')
  // 侧板 ×2 + 背板 + 三层隔板
  for (const sx of [-1, 1]) {
    const side = new THREE.Mesh(rbox(0.05, 1.35, 0.36, 0.02), shelfWhite)
    side.position.set(sx * 0.55, 0.675, 0)
    side.castShadow = true
    addOutline(side, 0.008)
    shelf.add(side)
  }
  const shelfBack = new THREE.Mesh(rbox(1.1, 1.35, 0.04, 0.018), toonMat('#DDEAF2'))
  shelfBack.position.set(0, 0.675, -0.17)
  const shelfBoards = [0.08, 0.68, 1.28].map((y) => {
    const b = new THREE.Mesh(rbox(1.02, 0.045, 0.34, 0.02), shelfWhite)
    b.position.set(0, y, 0)
    b.castShadow = true
    b.receiveShadow = true
    addOutline(b, 0.008)
    return b
  })
  shelf.add(shelfBack, ...shelfBoards)

  // 架上的彩色小书（两层，高矮错落 + 一本斜靠）
  const shelfBookColors = ['#75C7C3', '#7EC8E3', '#FFD966', '#B8D9E2', '#A8EBC8', '#B8E0D4']
  const shelfBooks: THREE.Mesh[] = []
  let sbx = -0.42
  shelfBookColors.slice(0, 4).forEach((c, i) => {
    const b = new THREE.Mesh(rbox(0.07, 0.34 - i * 0.03, 0.24, 0.012), toonMat(c))
    b.position.set(sbx, 0.29, 0.02)
    b.castShadow = true
    shelfBooks.push(b)
    sbx += 0.095
  })
  const leaning = new THREE.Mesh(rbox(0.07, 0.3, 0.24, 0.012), toonMat(shelfBookColors[4]))
  leaning.position.set(0.05, 0.28, 0.02)
  leaning.rotation.z = 0.35
  const smallStack = new THREE.Group()
  shelfBookColors.slice(1, 4).forEach((c, i) => {
    const b = new THREE.Mesh(rbox(0.22, 0.05, 0.18, 0.02), toonMat(c))
    b.position.set(0, 0.025 + i * 0.05, 0)
    b.castShadow = true
    smallStack.add(b)
  })
  smallStack.position.set(-0.3, 0.7, 0.02)
  shelf.add(...shelfBooks, leaning, smallStack)

  // 架顶小盆栽：粉盆 + 绿仙人掌
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.095, 0.13, 14), toonMat('#75C7C3'))
  pot.position.set(0.32, 1.37, 0)
  pot.castShadow = true
  addOutline(pot, 0.008)
  const cactus = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 12), toonMat('#6BBF8A'))
  cactus.scale.set(0.75, 1.5, 0.75)
  cactus.position.set(0.32, 1.55, 0)
  cactus.castShadow = true
  addOutline(cactus, 0.008)
  const cactusArm = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), toonMat('#6BBF8A'))
  cactusArm.scale.set(0.8, 1.3, 0.8)
  cactusArm.position.set(0.39, 1.53, 0)
  cactusArm.rotation.z = -0.7
  // 小粉花在仙人掌顶
  const bloom = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 8), toonMat('#75C7C3'))
  bloom.position.set(0.32, 1.68, 0)
  shelf.add(pot, cactus, cactusArm, bloom)

  shelf.position.set(-4.55, 0, -2.1)
  shelf.rotation.y = Math.PI / 2
  scene.add(shelf)

  /* ── 隐藏的低亮度环境光，墙面只由材质本身发色 ── */
  const neonLight = new THREE.PointLight(0xB7A7BD, 0.12, 4, 1.8)
  neonLight.position.set(-1.65, 3.0, -4.55)
  const neonCyanLight = new THREE.PointLight(0xA6B9C3, 0.1, 3, 1.8)
  neonCyanLight.position.set(1.65, 3.3, -4.55)
  const neonYellowLight = new THREE.PointLight(0xC8B9A9, 0.06, 3, 1.8)
  neonYellowLight.position.set(3.3, 3.78, -4.55)
  scene.add(neonLight, neonCyanLight, neonYellowLight)

  // Music mode brings a second, shifting layer of light into the room.
  const musicGlowLeft = new THREE.PointLight(0x9B94B0, 0, 6, 1.5)
  musicGlowLeft.position.set(-2.4, 2.5, -2.9)
  const musicGlowRight = new THREE.PointLight(0x9EAEB8, 0, 6, 1.5)
  musicGlowRight.position.set(2.5, 2.3, -2.8)
  scene.add(musicGlowLeft, musicGlowRight)
  const musicPalettes = [
    { bg: new THREE.Color('#F5F9FA'), left: new THREE.Color('#D4E6F4'), right: new THREE.Color('#D6ECEA') },
    { bg: new THREE.Color('#F1F8FA'), left: new THREE.Color('#BED9EF'), right: new THREE.Color('#D5EBE4') },
    { bg: new THREE.Color('#F6F9F7'), left: new THREE.Color('#CEE4F1'), right: new THREE.Color('#C9E7E9') },
    { bg: new THREE.Color('#F8FAF8'), left: new THREE.Color('#E2EFF7'), right: new THREE.Color('#DBF0E8') },
  ]
  const musicMotes: { mesh: THREE.Mesh; x: number; y: number; z: number; phase: number }[] = []
  for (let i = 0; i < 10; i++) {
    const x = -3.5 + ((i * 17) % 29) / 28 * 7
    const y = 1.55 + ((i * 11) % 23) / 22 * 2.45
    const z = -4.45 + (i % 4) * 0.43
    const mesh = new THREE.Mesh(
      new THREE.OctahedronGeometry(i % 5 === 0 ? 0.055 : 0.032),
      new THREE.MeshBasicNodeMaterial({ color: ['#B8ADBB', '#B7C8CE', '#D2C7B8', '#B6B3C8'][i % 4] }),
    )
    mesh.position.set(x, y, z)
    mesh.visible = false
    scene.add(mesh)
    musicMotes.push({ mesh, x, y, z, phase: i * 1.73 })
  }

  /* ── 桌面物件 ── */
  const props = new THREE.Group()

  /* ── 桌面右前：可点击的迷你音响 ── */
  const speaker = new THREE.Group()
  const speakerBody = new THREE.Mesh(rbox(0.35, 0.46, 0.22, 0.045), toonMat('#4D8DA0'))
  speakerBody.position.y = 0.23
  speakerBody.castShadow = true
  addOutline(speakerBody, 0.012)
  const speakerFace = new THREE.Mesh(rbox(0.29, 0.39, 0.02, 0.025), toonMat('#FFF9F0'))
  speakerFace.position.set(0, 0.23, 0.119)
  const grille = new THREE.Mesh(new THREE.CircleGeometry(0.105, 32), toonMat('#4A3524'))
  grille.position.set(0, 0.27, 0.133)
  const cone = new THREE.Mesh(new THREE.CircleGeometry(0.072, 32), toonMat('#89BECB'))
  cone.position.set(0, 0.27, 0.135)
  const center = new THREE.Mesh(new THREE.CircleGeometry(0.025, 24), toonMat('#FFF9F0'))
  center.position.set(0, 0.27, 0.137)
  const speakerLed = new THREE.Mesh(new THREE.SphereGeometry(0.019, 12, 8), new THREE.MeshBasicNodeMaterial({ color: '#9A93A6' }))
  speakerLed.position.set(0.1, 0.08, 0.135)
  speaker.add(speakerBody, speakerFace, grille, cone, center, speakerLed)
  speaker.position.set(1.48, 1.1, -3.38)
  speaker.rotation.y = -0.22
  speaker.userData = { kind: 'speaker' }
  props.add(speaker)
  const setSpeakerPlaying = (on: boolean) => {
    musicPlaying = on
    if (on) danceStartedAt = performance.now() / 1000
    ;(speakerLed.material as THREE.MeshBasicNodeMaterial).color.set(on ? '#77E5A8' : '#9A93A6')
    ;(cone.material as THREE.MeshToonNodeMaterial).color.set(on ? '#B9E631' : '#18B8D2')
    musicMotes.forEach(({ mesh }) => { mesh.visible = on })
    if (!on) {
      musicGlowLeft.intensity = 0
      musicGlowRight.intensity = 0
      setNight(true)
      bear.rotation.z = 0
      head.rotation.z = 0.1
      bearArms.forEach((arm, i) => { arm.rotation.z = i === 0 ? 0.5 : -0.5 })
      slime.scale.set(1, 1, 1)
      slime.rotation.z = 0
      duck.position.y = 1.3025
      duck.rotation.z = 0
    }
  }

  // 书：三本竖立书排（书脊朝镜头）+ 粉色书立 + 一本封面朝外斜靠墙的展示书
  const bookColors = ['#5D91B2', '#8FD3F4', '#A8EBC8', '#B4CDA2']
  const bookLabels = ['研究', '设计', '游戏', '我']
  const pagesMat = toonMat('#F7F2E6')
  const makeBook = (c: string) => {
    const book = new THREE.Group()
    // 白色书芯
    const pages = new THREE.Mesh(rbox(0.42, 0.6, 0.07, 0.02), pagesMat)
    pages.castShadow = true
    addOutline(pages, 0.012)
    // 前后封面
    const coverMat = toonMat(c)
    const front = new THREE.Mesh(rbox(0.44, 0.62, 0.02, 0.009), coverMat)
    front.position.z = 0.045
    front.castShadow = true
    const back = new THREE.Mesh(rbox(0.44, 0.62, 0.02, 0.009), coverMat)
    back.position.z = -0.045
    book.add(pages, front, back)
    return book
  }
  // 三本竖立：书脊朝镜头，整齐一排（厚 0.11，间距 0.115 紧贴）
  for (let i = 0; i < 3; i++) {
    const book = makeBook(bookColors[i])
    book.rotation.y = Math.PI / 2
    book.position.set(-1.5 + i * 0.115, 1.41, -4.5)
    book.userData = { kind: 'book', label: bookLabels[i], index: i }
    props.add(book)
  }
  // 粉色 L 形书立（白菱形装饰），抵住书排右端
  const bookend = new THREE.Group()
  const bePlate = new THREE.Mesh(rbox(0.03, 0.56, 0.22, 0.012), toonMat('#75C7C3'))
  bePlate.position.y = 0.28
  bePlate.castShadow = true
  addOutline(bePlate, 0.008)
  const beFoot = new THREE.Mesh(rbox(0.17, 0.036, 0.22, 0.016), toonMat('#75C7C3'))
  beFoot.position.set(0.085, 0.018, 0)
  addOutline(beFoot, 0.007)
  const beDiamond = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.02), toonMat('#FFF9F0'))
  beDiamond.rotation.z = Math.PI / 4
  beDiamond.position.set(0, 0.3, 0.115)
  bookend.add(bePlate, beFoot, beDiamond)
  bookend.position.set(-1.209, 1.1, -4.5)
  bookend.userData = { kind: 'bookend' }
  props.add(bookend)
  // 第四本：斜靠后墙展示（右侧空墙区，避开海报与收纳柜）
  const displayBook = makeBook(bookColors[3])
  displayBook.position.set(1.42, 1.41, -4.85)
  displayBook.rotation.x = -0.16
  displayBook.rotation.z = 0.04
  displayBook.userData = { kind: 'book', label: bookLabels[3], index: 3 }
  props.add(displayBook)

  // 论文纸堆
  const paperStack = new THREE.Group()
  const stack = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.055, 0.8), toonMat('#FBF7EE'))
  stack.castShadow = true
  stack.receiveShadow = true
  addOutline(stack, 0.012)
  const looseSheet = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.004, 0.78), toonMat('#FFFFFF'))
  looseSheet.position.y = 0.031
  looseSheet.rotation.y = 0.18
  looseSheet.castShadow = true
  paperStack.add(stack, looseSheet)
  paperStack.position.set(0.15, 1.132, -4.38)
  paperStack.rotation.y = 0.12
  paperStack.userData = { kind: 'papers' }
  props.add(paperStack)

  // 咖啡杯
  const mug = new THREE.Group()
  const mugMat = toonMat('#FFF6EC')
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.08, 0.17, 24), mugMat)
  cup.position.y = 0.085
  cup.castShadow = true
  addOutline(cup, 0.011)
  const coffee = new THREE.Mesh(new THREE.CircleGeometry(0.085, 24), toonMat('#4A2E1A'))
  coffee.rotation.x = -Math.PI / 2
  coffee.position.y = 0.165
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.06, 0.016, 12, 20, Math.PI * 1.5),
    mugMat,
  )
  handle.position.set(0.095, 0.085, 0)
  handle.rotation.y = Math.PI / 2
  handle.castShadow = true
  addOutline(handle, 0.008)
  mug.add(cup, coffee, handle)
  mug.position.set(0.8, 1.1, -4.4)
  mug.userData = { kind: 'mug' }
  props.add(mug)

  // Desktop storage cabinet (white cabinet + double pink drawers) + pen holder
  const organizer = new THREE.Group()
  const orgBody = new THREE.Mesh(rbox(0.44, 0.32, 0.34, 0.035), toonMat('#FFF9F0'))
  orgBody.castShadow = true
  addOutline(orgBody, 0.01)
  const orgDrawers = [0.08, -0.08].flatMap((y) => {
    const face = new THREE.Mesh(rbox(0.38, 0.12, 0.02, 0.012), toonMat('#75C7C3'))
    face.position.set(0, y, 0.17)
    addOutline(face, 0.007)
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 8), toonMat('#75C7C3'))
    knob.position.set(0, y, 0.19)
    return [face, knob]
  })
  const penCup = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.043, 0.11, 14), toonMat('#75C7C3'))
  penCup.position.set(-0.1, 0.215, 0.03)
  penCup.castShadow = true
  addOutline(penCup, 0.007)
  organizer.add(orgBody, ...orgDrawers, penCup)
  organizer.position.set(1.38, 1.26, -4.0)
  organizer.userData = { kind: 'organizer' }
  props.add(organizer)

  // 葱玩偶（miku 应援葱）：白葱身 + 绿叶，斜靠在收纳柜上
  const leek = new THREE.Group()
  const leekShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.036, 0.3, 12), toonMat('#F5F2E8'))
  leekShaft.position.y = 0.15
  leekShaft.castShadow = true
  addOutline(leekShaft, 0.007)
  const leekRoot = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), toonMat('#E4DFCD'))
  leekRoot.position.y = 0.005
  const leekLeafMat = toonMat('#3FBF7F')
  const leekLeafGeo = new THREE.ConeGeometry(0.02, 0.17, 8)
  const leafAngles = [0.5, -0.4, 0.15]
  leafAngles.forEach((a, i) => {
    const leaf = new THREE.Mesh(leekLeafGeo, leekLeafMat)
    leaf.position.set(Math.sin(a) * 0.05, 0.35 + i * 0.012, (i - 1) * 0.02)
    leaf.rotation.z = -a
    leaf.castShadow = true
    leek.add(leaf)
  })
  leek.add(leekShaft, leekRoot)
  // 立在桌面史莱姆旁边，微微歪着
  leek.position.set(0.62, 1.1, -3.62)
  leek.rotation.set(0, -0.4, 0.07)
  leek.userData = { kind: 'leek' }
  props.add(leek)

  /* ── 杂物：笔记本电脑 + 掌机（充电底座）+ 五斗柜 ── */

  // 像素画工具：爱心 & 云朵
  const drawPxHeart = (c: CanvasRenderingContext2D, x: number, y: number, px: number, hex: string) => {
    const map = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...']
    c.fillStyle = hex
    map.forEach((row, r) => {
      for (let i = 0; i < row.length; i++) if (row[i] === 'X') c.fillRect(x + i * px, y + r * px, px, px)
    })
  }
  const drawPxCloud = (c: CanvasRenderingContext2D, x: number, y: number, px: number) => {
    const map = ['..XXX...', '.XXXXX..', 'XXXXXXX.']
    map.forEach((row, r) => {
      for (let i = 0; i < row.length; i++) {
        if (row[i] === 'X') {
          c.fillStyle = r === 2 ? '#FFE1F0' : '#FFFFFF'
          c.fillRect(x + i * px, y + r * px, px, px)
        }
      }
    })
  }

  // ── 笔记本电脑：奶油机身 + 独立键帽 + 粉色空格 + 动态屏保 ──
  const laptop = new THREE.Group()
  const lapBase = new THREE.Mesh(rbox(0.56, 0.026, 0.36, 0.013), toonMat('#FFF9F0'))
  lapBase.castShadow = true
  addOutline(lapBase, 0.009)
  // 键盘底槽
  const kbPlate = new THREE.Mesh(rbox(0.46, 0.005, 0.16, 0.006), toonMat('#EDE5D8'))
  kbPlate.position.set(0, 0.014, 0.01)
  // 键帽 3 行 × 11 + 底行（灰键 + 粉色空格）
  const keyGeo = rbox(0.026, 0.009, 0.022, 0.004)
  const keyMat = toonMat('#F7F2E8')
  const keyMatDark = toonMat('#E3DACB')
  for (let r = 0; r < 3; r++) {
    for (let k = 0; k < 11; k++) {
      const key = new THREE.Mesh(keyGeo, keyMat)
      key.position.set(-0.15 + k * 0.03, 0.021, -0.05 + r * 0.034)
      laptop.add(key)
    }
  }
  const kL = new THREE.Mesh(keyGeo, keyMatDark); kL.position.set(-0.14, 0.021, 0.052)
  const kR = new THREE.Mesh(keyGeo, keyMatDark); kR.position.set(0.14, 0.021, 0.052)
  const spacebar = new THREE.Mesh(rbox(0.16, 0.009, 0.024, 0.004), toonMat('#FF9ECC'))
  spacebar.position.set(0, 0.021, 0.052)
  // 触控板
  const lapPad = new THREE.Mesh(rbox(0.17, 0.005, 0.085, 0.006), toonMat('#F1EBE0'))
  lapPad.position.set(0, 0.0135, 0.125)
  // 铰链（粉色圆轴）
  const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 12), toonMat('#75C7C3'))
  hinge.rotation.z = Math.PI / 2
  hinge.position.set(0, 0.013, -0.174)
  // 屏幕组（绕铰链后仰 16°）
  const lapScreen = new THREE.Group()
  const lapLid = new THREE.Mesh(rbox(0.56, 0.36, 0.014, 0.009), toonMat('#FFF9F0'))
  lapLid.position.y = 0.18
  lapLid.castShadow = true
  addOutline(lapLid, 0.008)
  const lapBezel = new THREE.Mesh(rbox(0.52, 0.32, 0.006, 0.005), toonMat('#3A3644'))
  lapBezel.position.set(0, 0.18, 0.008)
  const lapCam = new THREE.Mesh(new THREE.SphereGeometry(0.005, 8, 6), toonMat('#23202B'))
  lapCam.position.set(0, 0.325, 0.012)
  // 动态屏保纹理（12fps 像素动画）
  const lapCv = document.createElement('canvas')
  lapCv.width = 128; lapCv.height = 76
  const lapCtx = lapCv.getContext('2d')!
  const lapTex = new THREE.CanvasTexture(lapCv)
  lapTex.colorSpace = THREE.SRGBColorSpace
  lapTex.magFilter = THREE.NearestFilter
  const lapDisplay = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.27), new THREE.MeshBasicNodeMaterial({ map: lapTex }))
  lapDisplay.position.set(0, 0.18, 0.012)
  // 机背发光小爱心 logo
  const lapLogo = new THREE.Group()
  const lgMat = new THREE.MeshBasicNodeMaterial({ color: '#75C7C3' })
  const lgL = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 8), lgMat); lgL.position.set(-0.013, 0.007, 0)
  const lgR = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 8), lgMat); lgR.position.set(0.013, 0.007, 0)
  const lgTip = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.038, 4), lgMat)
  lgTip.rotation.x = Math.PI; lgTip.rotation.y = Math.PI / 4; lgTip.position.y = -0.022
  lapLogo.add(lgL, lgR, lgTip)
  lapLogo.position.set(0, 0.18, -0.011)
  lapScreen.add(lapLid, lapBezel, lapCam, lapDisplay, lapLogo)
  lapScreen.position.set(0, 0.013, -0.172)
  lapScreen.rotation.x = -0.28
  laptop.add(lapBase, kbPlate, kL, kR, spacebar, lapPad, hinge, lapScreen)
  laptop.position.set(-0.28, 1.106, -3.6)
  laptop.rotation.y = 0.15
  laptop.userData = { kind: 'laptop' }
  props.add(laptop)

  // ── 掌机：粉色充电底座上立放，屏幕正对镜头，动态小游戏 ──
  const hhDock = new THREE.Group()
  const dockBase = new THREE.Mesh(rbox(0.46, 0.05, 0.17, 0.022), toonMat('#5D91B2'))
  dockBase.position.y = 0.025
  dockBase.castShadow = true
  addOutline(dockBase, 0.009)
  const dockBack = new THREE.Mesh(rbox(0.46, 0.27, 0.045, 0.02), toonMat('#FF9ECC'))
  dockBack.position.set(0, 0.175, -0.06)
  dockBack.castShadow = true
  addOutline(dockBack, 0.009)
  const dockSideGeo = rbox(0.032, 0.27, 0.14, 0.016)
  const dockSideL = new THREE.Mesh(dockSideGeo, toonMat('#DDEAF2')); dockSideL.position.set(-0.214, 0.175, 0.005)
  const dockSideR = new THREE.Mesh(dockSideGeo, toonMat('#DDEAF2')); dockSideR.position.set(0.214, 0.175, 0.005)
  addOutline(dockSideL, 0.007); addOutline(dockSideR, 0.007)
  const dockLip = new THREE.Mesh(rbox(0.46, 0.05, 0.032, 0.014), toonMat('#5D91B2'))
  dockLip.position.set(0, 0.055, 0.075)
  hhDock.add(dockBase, dockBack, dockSideL, dockSideR, dockLip)

  const handheld = new THREE.Group()
  const hhBody = new THREE.Mesh(rbox(0.24, 0.3, 0.034, 0.016), toonMat('#FFF9F0'))
  hhBody.position.y = 0.15
  hhBody.castShadow = true
  addOutline(hhBody, 0.008)
  // 握把（粉 / 天蓝）+ 底部圆头
  const hhGripGeo = rbox(0.05, 0.32, 0.042, 0.02)
  const hhGripL = new THREE.Mesh(hhGripGeo, toonMat('#75C7C3')); hhGripL.position.set(-0.145, 0.155, 0)
  const hhGripR = new THREE.Mesh(hhGripGeo, toonMat('#8FD3F4')); hhGripR.position.set(0.145, 0.155, 0)
  addOutline(hhGripL, 0.008); addOutline(hhGripR, 0.008)
  const hhCapL = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), toonMat('#75C7C3')); hhCapL.position.set(-0.145, 0.02, 0)
  const hhCapR = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), toonMat('#8FD3F4')); hhCapR.position.set(0.145, 0.02, 0)
  // 屏幕：深色边框 + 动态画面
  const hhBezel = new THREE.Mesh(rbox(0.2, 0.175, 0.012, 0.008), toonMat('#3A3644'))
  hhBezel.position.set(0, 0.19, 0.018)
  const hhCv = document.createElement('canvas')
  hhCv.width = 64; hhCv.height = 64
  const hhCtx = hhCv.getContext('2d')!
  const hhTex = new THREE.CanvasTexture(hhCv)
  hhTex.colorSpace = THREE.SRGBColorSpace
  hhTex.magFilter = THREE.NearestFilter
  const hhScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.155, 0.13), new THREE.MeshBasicNodeMaterial({ map: hhTex }))
  hhScreen.position.set(0, 0.19, 0.026)
  // 十字键 + AB 键 + 开始/选择
  const hhDark = toonMat('#3A3F4D')
  const dpadH = new THREE.Mesh(rbox(0.042, 0.014, 0.012, 0.005), hhDark); dpadH.position.set(-0.062, 0.052, 0.019)
  const dpadV = new THREE.Mesh(rbox(0.014, 0.042, 0.012, 0.005), hhDark); dpadV.position.set(-0.062, 0.052, 0.019)
  const hhBtnGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.012, 12)
  const hhBtnA = new THREE.Mesh(hhBtnGeo, toonMat('#75C7C3')); hhBtnA.rotation.x = Math.PI / 2; hhBtnA.position.set(0.052, 0.062, 0.019)
  const hhBtnB = new THREE.Mesh(hhBtnGeo, toonMat('#A8EBC8')); hhBtnB.rotation.x = Math.PI / 2; hhBtnB.position.set(0.088, 0.03, 0.019)
  const pillGeo = rbox(0.026, 0.009, 0.01, 0.004)
  const pillL = new THREE.Mesh(pillGeo, toonMat('#D9D2C4')); pillL.position.set(-0.026, 0.014, 0.019)
  const pillR = new THREE.Mesh(pillGeo, toonMat('#D9D2C4')); pillR.position.set(0.026, 0.014, 0.019)
  handheld.add(hhBody, hhGripL, hhGripR, hhCapL, hhCapR, hhBezel, hhScreen, dpadH, dpadV, hhBtnA, hhBtnB, pillL, pillR)
  handheld.position.set(0, 0.05, 0.012)
  hhDock.add(handheld)
  // 底座正面白色小爱心
  const dockHeart = new THREE.Group()
  const dhMat = toonMat('#FFF9F0')
  const dhL = new THREE.Mesh(new THREE.SphereGeometry(0.016, 10, 8), dhMat); dhL.position.set(-0.011, 0.006, 0)
  const dhR = new THREE.Mesh(new THREE.SphereGeometry(0.016, 10, 8), dhMat); dhR.position.set(0.011, 0.006, 0)
  const dhTip = new THREE.Mesh(new THREE.ConeGeometry(0.023, 0.03, 4), dhMat)
  dhTip.rotation.x = Math.PI; dhTip.rotation.y = Math.PI / 4; dhTip.position.y = -0.018
  dockHeart.add(dhL, dhR, dhTip)
  dockHeart.position.set(0, 0.055, 0.093)
  hhDock.add(dockHeart)
  hhDock.position.set(1.12, 1.105, -3.78)
  hhDock.rotation.y = -0.25
  hhDock.userData = { kind: 'handheld' }
  props.add(hhDock)

  // 屏保：云朵漂移 + 星星 + 上升爱心 + 扒边猫猫（左缘探头）& 史莱姆（底缘探头）
  const renderLapScreen = (t: number) => {
    const c = lapCtx
    const grd = c.createLinearGradient(0, 0, 0, 76)
    grd.addColorStop(0, '#FFDFF0'); grd.addColorStop(1, '#C9E9FF')
    c.fillStyle = grd; c.fillRect(0, 0, 128, 76)
    drawPxCloud(c, Math.round((t * 7) % 160) - 30, 8, 3)
    drawPxCloud(c, Math.round((t * 5 + 55) % 170) - 30, 22, 2)
    drawPxCloud(c, Math.round((t * 6 + 105) % 165) - 30, 5, 2)
    for (let i = 0; i < 5; i++) {
      if (Math.sin(t * 2.4 + i * 1.9) > -0.1) {
        c.fillStyle = i % 2 ? '#FFE9A8' : '#FFFFFF'
        c.fillRect(12 + i * 26, 6 + ((i * 31) % 26), 4, 4)
      }
    }
    for (let i = 0; i < 3; i++) {
      drawPxHeart(c, 22 + i * 40, Math.round(76 - ((t * 10 + i * 30) % 96)), 2, i % 2 ? '#FF9ECC' : '#B8D9E2')
    }
    // 扒边猫猫：慢速上下 + 眨眼
    const catY = 30 + Math.round(Math.sin(t * 0.7) * 4)
    const catBlink = (t % 4.4) > 4.2
    const K = '#8E8798', P = '#FFB7CD'
    c.fillStyle = K
    c.fillRect(4, catY, 3, 3); c.fillRect(12, catY, 3, 3)
    c.fillRect(3, catY + 3, 4, 2); c.fillRect(12, catY + 3, 4, 2)
    c.fillStyle = P
    c.fillRect(4, catY + 1, 2, 2); c.fillRect(13, catY + 1, 2, 2)
    c.fillStyle = K
    c.fillRect(0, catY + 5, 16, 10)
    if (catBlink) {
      c.fillStyle = '#5E5768'
      c.fillRect(5, catY + 8, 3, 1); c.fillRect(11, catY + 8, 3, 1)
    } else {
      c.fillStyle = '#FFFFFF'
      c.fillRect(5, catY + 7, 3, 3); c.fillRect(11, catY + 7, 3, 3)
      c.fillStyle = '#3A2E3A'
      c.fillRect(6, catY + 8, 1, 2); c.fillRect(12, catY + 8, 1, 2)
    }
    c.fillStyle = P
    c.fillRect(8, catY + 12, 2, 2)
    c.fillStyle = '#5E5768'
    c.fillRect(16, catY + 8, 4, 1); c.fillRect(16, catY + 11, 4, 1)
    // 扒边史莱姆：呼吸起伏 + 眨眼
    const bob = Math.round(Math.sin(t * 1.6) * 2)
    const sBlink = (t % 3.6) > 3.4
    const sy = 62 + bob
    c.fillStyle = '#75C7C3'
    c.fillRect(50, sy, 28, 3); c.fillRect(47, sy + 3, 34, 6); c.fillRect(45, sy + 9, 38, 5)
    c.fillStyle = '#FFA5CE'; c.fillRect(50, sy, 6, 2)
    if (sBlink) {
      c.fillStyle = '#D14E8C'
      c.fillRect(53, sy + 6, 4, 1); c.fillRect(71, sy + 6, 4, 1)
    } else {
      c.fillStyle = '#FFFFFF'
      c.fillRect(53, sy + 4, 4, 3); c.fillRect(71, sy + 4, 4, 3)
      c.fillStyle = '#3A2E3A'
      c.fillRect(54, sy + 5, 2, 2); c.fillRect(72, sy + 5, 2, 2)
    }
  }

  // 小游戏：云朵滚动 + 弹跳史莱姆（squash&stretch）+ 金币 + 血条
  const renderHhScreen = (t: number) => {
    const c = hhCtx
    const grd = c.createLinearGradient(0, 0, 0, 64)
    grd.addColorStop(0, '#BFE8FF'); grd.addColorStop(1, '#EAF8FF')
    c.fillStyle = grd; c.fillRect(0, 0, 64, 64)
    drawPxCloud(c, Math.round((t * 9) % 84) - 20, 6, 2)
    drawPxCloud(c, Math.round((t * 6 + 42) % 90) - 20, 16, 2)
    c.fillStyle = '#A8EBC8'; c.fillRect(0, 54, 64, 10)
    c.fillStyle = '#7ADBA8'; c.fillRect(0, 54, 64, 2)
    for (let i = 0; i < 3; i++) drawPxHeart(c, 4 + i * 13, 4, 2, '#FF6F8E')
    const cy = 24 + Math.round(Math.sin(t * 2.2) * 2)
    c.fillStyle = '#B4CDA2'; c.fillRect(52, cy, 6, 6)
    c.fillStyle = '#FFE9A8'; c.fillRect(53, cy + 1, 2, 2)
    if (Math.sin(t * 3) > 0) { c.fillStyle = '#FFE9A8'; c.fillRect(56, 8, 4, 4) }
    const jump = Math.abs(Math.sin(t * 2.8))
    const sq = jump < 0.18
    const bx = 14, baseY = 54
    const bh = sq ? 7 : 10, bw = sq ? 15 : 12
    const by = baseY - Math.round(jump * 22) - bh
    c.fillStyle = '#75C7C3'
    c.fillRect(bx + (sq ? 0 : 2), by, bw, bh)
    c.fillRect(bx + (sq ? 1 : 1), by - 2, bw - (sq ? 2 : 3), 2)
    c.fillStyle = '#FFA5CE'; c.fillRect(bx + 2, by, 3, 2)
    if (sq) {
      c.fillStyle = '#D14E8C'
      c.fillRect(bx + 4, by + 2, 3, 1); c.fillRect(bx + 8, by + 2, 3, 1)
    } else {
      c.fillStyle = '#FFFFFF'
      c.fillRect(bx + 3, by + 2, 3, 3); c.fillRect(bx + 8, by + 2, 3, 3)
      c.fillStyle = '#3A2E3A'
      c.fillRect(bx + 4, by + 3, 1, 2); c.fillRect(bx + 9, by + 3, 1, 2)
    }
  }

  // 五斗柜：左墙窗下，白柜体 + 粉顶板 + 四抽屉 + 顶部小摆件
  const dresser = new THREE.Group()
  const drBody = new THREE.Mesh(rbox(1.3, 1.05, 0.56, 0.05), createAnomalousMaterial('#E4EFF0'))
  drBody.position.y = 0.545
  drBody.castShadow = true
  addOutline(drBody, 0.011)
  const drTop = new THREE.Mesh(rbox(1.38, 0.05, 0.62, 0.022), toonMat('#75C7C3'))
  drTop.position.y = 1.095
  drTop.castShadow = true
  addOutline(drTop, 0.009)
  dresser.add(drBody, drTop)
  // 两列 × 两行抽屉：pastel 粉面 + 白色心形把手（两球+倒锥）
  const drawerMats = ['#FFD6EA', '#FFC7E0', '#C9E3FA', '#D9F3E5']
  for (let dr = 0; dr < 2; dr++) {
    for (let dc = 0; dc < 2; dc++) {
      const dx = -0.3 + dc * 0.6
      const dy = 0.335 + dr * 0.475
      const face = new THREE.Mesh(rbox(0.56, 0.41, 0.035, 0.016), toonMat(drawerMats[dr * 2 + dc]))
      face.position.set(dx, dy, 0.285)
      addOutline(face, 0.008)
      const knobHeart = new THREE.Group()
      const khMat = toonMat('#FFF9F0')
      const khL = new THREE.Mesh(new THREE.SphereGeometry(0.026, 10, 8), khMat)
      khL.position.set(-0.017, 0.008, 0)
      const khR = new THREE.Mesh(new THREE.SphereGeometry(0.026, 10, 8), khMat)
      khR.position.set(0.017, 0.008, 0)
      const khTip = new THREE.Mesh(new THREE.ConeGeometry(0.037, 0.05, 4), khMat)
      khTip.rotation.x = Math.PI
      khTip.rotation.y = Math.PI / 4
      khTip.position.y = -0.028
      knobHeart.add(khL, khR, khTip)
      knobHeart.position.set(dx, dy, 0.312)
      dresser.add(face, knobHeart)
    }
  }
  // 顶部小摆件：黄色宝石星星 + 粉框爱心画
  const drStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.09, 0), toonMat('#B4CDA2'))
  drStar.scale.set(1, 1.4, 0.45)
  drStar.position.set(-0.4, 1.2, 0.1)
  drStar.rotation.z = 0.12
  addOutline(drStar, 0.008)
  const drFrame = new THREE.Group()
  const drFrameOuter = new THREE.Mesh(rbox(0.24, 0.3, 0.025, 0.012), toonMat('#75C7C3'))
  addOutline(drFrameOuter, 0.008)
  const drFrameMat = new THREE.Mesh(rbox(0.18, 0.24, 0.02, 0.008), toonMat('#FFF9F0'))
  drFrameMat.position.z = 0.005
  const drArtHeart = new THREE.Group()
  const ahMat = toonMat('#FF9ECC')
  const ahL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), ahMat)
  ahL.position.set(-0.03, 0.014, 0)
  const ahR = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), ahMat)
  ahR.position.set(0.03, 0.014, 0)
  const ahTip = new THREE.Mesh(new THREE.ConeGeometry(0.064, 0.085, 4), ahMat)
  ahTip.rotation.x = Math.PI
  ahTip.rotation.y = Math.PI / 4
  ahTip.position.y = -0.05
  drArtHeart.add(ahL, ahR, ahTip)
  drArtHeart.position.z = 0.02
  drFrame.add(drFrameOuter, drFrameMat, drArtHeart)
  drFrame.position.set(0.38, 1.26, 0.08)
  drFrame.rotation.y = -0.18
  dresser.add(drStar, drFrame)
  dresser.position.set(-4.8, 0, -4.0)
  dresser.rotation.y = Math.PI / 2
  dresser.userData = { kind: 'dresser' }
  scene.add(dresser)

  /* ── 桌左侧地板：粉色豆袋懒人沙发 + 黄色星星靠枕 ── */
  const beanbag = new THREE.Group()
  const bbMain = new THREE.Mesh(new THREE.SphereGeometry(0.62, 24, 18), toonMat('#A8D7D1'))
  bbMain.scale.set(1, 0.62, 1)
  bbMain.position.y = 0.36
  bbMain.castShadow = true
  bbMain.receiveShadow = true
  addOutline(bbMain, 0.016)
  const bbTop = new THREE.Mesh(new THREE.SphereGeometry(0.45, 20, 16), toonMat('#C8E8DF'))
  bbTop.scale.set(1, 0.55, 1)
  bbTop.position.set(0.06, 0.62, -0.04)
  bbTop.castShadow = true
  addOutline(bbTop, 0.013)
  const bbSeam = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.018, 8, 28), toonMat('#8BBFC2'))
  bbSeam.rotation.x = Math.PI / 2
  bbSeam.scale.set(1, 0.62, 1)
  bbSeam.position.y = 0.37
  beanbag.add(bbMain, bbTop, bbSeam)
  // 星星靠枕（斜靠在沙发上）
  const starShape = new THREE.Shape()
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 0.17 : 0.075
    const a = (Math.PI / 5) * i + Math.PI / 2
    const px = Math.cos(a) * r, py = -Math.sin(a) * r
    if (i === 0) starShape.moveTo(px, py)
    else starShape.lineTo(px, py)
  }
  starShape.closePath()
  const scGeo = new THREE.ExtrudeGeometry(starShape, { depth: 0.06, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2 })
  scGeo.center()
  const starCushion = new THREE.Mesh(scGeo, toonMat('#B4CDA2'))
  starCushion.castShadow = true
  starCushion.position.set(0.42, 0.44, 0.24)
  starCushion.rotation.set(0.2, -0.5, 0.12)
  beanbag.add(starCushion)
  beanbag.position.set(-2.95, 0, -3.3)
  beanbag.rotation.y = 0.5
  beanbag.userData = { kind: 'beanbag' }
  scene.add(beanbag)

  /* ── 桌面左前：双铃小闹钟 + 胶带圈 ── */
  // 闹钟表盘（10:10 + 12 点小爱心）
  const clkCv = document.createElement('canvas')
  clkCv.width = clkCv.height = 64
  {
    const c = clkCv.getContext('2d')!
    c.fillStyle = '#FFF9F0'
    c.beginPath(); c.arc(32, 32, 31, 0, Math.PI * 2); c.fill()
    c.strokeStyle = '#4A3524'; c.lineWidth = 3; c.lineCap = 'round'
    for (let i = 0; i < 12; i++) {
      const a = (Math.PI / 6) * i
      const r1 = i % 3 === 0 ? 22 : 25
      c.beginPath()
      c.moveTo(32 + Math.cos(a) * r1, 32 + Math.sin(a) * r1)
      c.lineTo(32 + Math.cos(a) * 28, 32 + Math.sin(a) * 28)
      c.stroke()
    }
    c.fillStyle = '#75C7C3'
    c.fillRect(30, 6, 3, 3); c.fillRect(34, 6, 3, 3); c.fillRect(29, 9, 9, 3); c.fillRect(31, 12, 5, 3)
    c.strokeStyle = '#4A3524'
    c.lineWidth = 4
    c.beginPath(); c.moveTo(32, 32); c.lineTo(22, 23); c.stroke()
    c.lineWidth = 3
    c.beginPath(); c.moveTo(32, 32); c.lineTo(44, 18); c.stroke()
    c.fillStyle = '#75C7C3'
    c.beginPath(); c.arc(32, 32, 3.5, 0, Math.PI * 2); c.fill()
  }
  const clkTex = new THREE.CanvasTexture(clkCv)
  clkTex.colorSpace = THREE.SRGBColorSpace
  const clock = new THREE.Group()
  const clkBody = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.088, 0.03, 24), toonMat('#75C7C3'))
  clkBody.rotation.x = Math.PI / 2
  clkBody.castShadow = true
  addOutline(clkBody, 0.008)
  const clkFace = new THREE.Mesh(new THREE.CircleGeometry(0.072, 24), new THREE.MeshBasicNodeMaterial({ map: clkTex }))
  clkFace.position.z = 0.017
  const clkRing = new THREE.Mesh(new THREE.TorusGeometry(0.074, 0.01, 8, 24), toonMat('#638FA6'))
  clkRing.position.z = 0.016
  const bellGeo = new THREE.SphereGeometry(0.032, 12, 10)
  const bellMat = toonMat('#B4CDA2')
  const bellL = new THREE.Mesh(bellGeo, bellMat); bellL.position.set(-0.06, 0.082, 0); bellL.scale.set(1, 0.85, 1)
  const bellR = new THREE.Mesh(bellGeo, bellMat); bellR.position.set(0.06, 0.082, 0); bellR.scale.set(1, 0.85, 1)
  addOutline(bellL, 0.006); addOutline(bellR, 0.006)
  const clkBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.018, 10), toonMat('#FFF9F0'))
  clkBtn.position.y = 0.095
  const footGeo = new THREE.SphereGeometry(0.016, 8, 8)
  const footMat = toonMat('#638FA6')
  const footL = new THREE.Mesh(footGeo, footMat); footL.position.set(-0.052, -0.088, 0.01)
  const footR = new THREE.Mesh(footGeo, footMat); footR.position.set(0.052, -0.088, 0.01)
  clock.add(clkBody, clkFace, clkRing, bellL, bellR, clkBtn, footL, footR)
  clock.position.set(-1.25, 1.21, -3.42)
  clock.rotation.y = 0.3
  clock.userData = { kind: 'clock' }
  props.add(clock)

  // 胶带圈 ×3 叠放（顶部一枚微歪）
  const tapeShape = new THREE.Shape()
  tapeShape.absarc(0, 0, 0.046, 0, Math.PI * 2)
  const tapeHole = new THREE.Path()
  tapeHole.absarc(0, 0, 0.02, 0, Math.PI * 2, true)
  tapeShape.holes.push(tapeHole)
  const tapeGeo = new THREE.ExtrudeGeometry(tapeShape, { depth: 0.036, bevelEnabled: false })
  tapeGeo.rotateX(-Math.PI / 2)
  const tapeCols = ['#FF9ECC', '#A8E0FF', '#FFE9A8']
  tapeCols.forEach((tcol, ti) => {
    const roll = new THREE.Mesh(tapeGeo, toonMat(tcol))
    roll.position.set(-1.52, 1.106 + ti * 0.037, -3.74)
    if (ti === 2) roll.rotation.z = 0.16
    roll.castShadow = true
    addOutline(roll, 0.006)
    roll.userData = { kind: 'tape' }
    props.add(roll)
  })

  // Pencil (in the pen holder)
  const pencil = new THREE.Group()
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.32, 10), toonMat('#F5D77F'))
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.04, 10), toonMat('#D8B87A'))
  tip.position.y = 0.18
  const lead = new THREE.Mesh(new THREE.ConeGeometry(0.005, 0.012, 8), toonMat('#2B2218'))
  lead.position.y = 0.205
  pencil.add(body, tip, lead)
  addOutline(body, 0.006)
  pencil.rotation.z = 0.12
  pencil.rotation.x = 0.05
  pencil.position.set(1.28, 1.6, -3.97)
  props.add(pencil)

  // 泰迪熊：坐在桌上，歪头卖萌
  const bear = new THREE.Group()
  const furMat = toonMat('#B98A5E')
  const muzzleMat = toonMat('#F0E3CB')
  const noseMat = toonMat('#4A3524')

  // 身体（坐姿梨形）
  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 16), furMat)
  torso.scale.set(1, 1.15, 0.9)
  torso.position.y = 0.145
  torso.castShadow = true
  addOutline(torso, 0.01)
  // 肚皮
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.095, 16, 12), muzzleMat)
  belly.scale.set(1, 1.15, 0.55)
  belly.position.set(0, 0.145, 0.075)

  // 头（歪一点点）
  const head = new THREE.Group()
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.105, 20, 16), furMat)
  skull.castShadow = true
  addOutline(skull, 0.009)
  // 耳朵 ×2（内耳米色）
  const earGeo = new THREE.SphereGeometry(0.038, 12, 10)
  const innerEarGeo = new THREE.SphereGeometry(0.02, 10, 8)
  for (const sx of [-1, 1]) {
    const ear = new THREE.Mesh(earGeo, furMat)
    ear.position.set(sx * 0.082, 0.082, 0)
    ear.castShadow = true
    addOutline(ear, 0.008)
    const inner = new THREE.Mesh(innerEarGeo, muzzleMat)
    inner.position.set(sx * 0.092, 0.086, 0.012)
    head.add(ear, inner)
  }
  // 口鼻
  const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 12), muzzleMat)
  muzzle.scale.set(1.05, 0.8, 0.7)
  muzzle.position.set(0, -0.02, 0.075)
  // 鼻子 + 嘴
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), noseMat)
  nose.scale.set(1.2, 0.8, 0.6)
  nose.position.set(0, 0.008, 0.115)
  const smileL = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.004, 6, 10, Math.PI), noseMat)
  smileL.position.set(-0.014, -0.02, 0.115)
  smileL.rotation.z = Math.PI
  smileL.rotation.y = 0.3
  const smileR = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.004, 6, 10, Math.PI), noseMat)
  smileR.position.set(0.014, -0.02, 0.115)
  smileR.rotation.z = Math.PI
  smileR.rotation.y = -0.3
  // 眼睛 ×2
  const eyeGeo = new THREE.SphereGeometry(0.014, 10, 8)
  const eyeL = new THREE.Mesh(eyeGeo, noseMat); eyeL.position.set(-0.04, 0.022, 0.09)
  const eyeR = new THREE.Mesh(eyeGeo, noseMat); eyeR.position.set(0.04, 0.022, 0.09)
  const sparkleL = new THREE.Mesh(
    new THREE.SphereGeometry(0.004, 6, 6),
    new THREE.MeshBasicNodeMaterial({ color: '#FFFFFF' }),
  )
  sparkleL.position.set(-0.036, 0.027, 0.1)
  const sparkleR = sparkleL.clone()
  sparkleR.position.set(0.044, 0.027, 0.1)
  head.add(skull, muzzle, nose, smileL, smileR, eyeL, eyeR, sparkleL, sparkleR)

  // 手臂 ×2（摊在身侧，坐着抱的姿势）
  const armGeo = new THREE.SphereGeometry(0.042, 12, 10)
  armGeo.scale(1, 1.6, 1)
  const bearArms: THREE.Mesh[] = []
  for (const sx of [-1, 1]) {
    const arm = new THREE.Mesh(armGeo, furMat)
    arm.position.set(sx * 0.135, 0.15, 0.02)
    arm.rotation.z = sx * -0.5
    arm.castShadow = true
    addOutline(arm, 0.008)
    bear.add(arm)
    bearArms.push(arm)
  }
  // 腿 ×2（向前伸）
  const bearLegGeo = new THREE.SphereGeometry(0.05, 12, 10)
  bearLegGeo.scale(1.15, 1.5, 1.15)
  for (const sx of [-1, 1]) {
    const leg = new THREE.Mesh(bearLegGeo, furMat)
    leg.position.set(sx * 0.078, 0.055, 0.09)
    leg.castShadow = true
    addOutline(leg, 0.008)
    // 脚掌米色
    const paw = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), muzzleMat)
    paw.scale.set(1, 1.1, 0.55)
    paw.position.set(sx * 0.082, 0.05, 0.135)
    bear.add(leg, paw)
  }

  // 脖子上的粉色蝴蝶结
  const bow = new THREE.Group()
  const bowMat = toonMat('#75C7C3')
  const wingL = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), bowMat)
  wingL.scale.set(1.3, 0.8, 0.55)
  wingL.position.set(-0.032, 0, 0)
  wingL.rotation.z = 0.35
  const wingR = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), bowMat)
  wingR.scale.set(1.3, 0.8, 0.55)
  wingR.position.set(0.032, 0, 0)
  wingR.rotation.z = -0.35
  const knot = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), toonMat('#75C7C3'))
  bow.add(wingL, wingR, knot)
  bow.position.set(0, 0.235, 0.07)
  bow.rotation.x = -0.25

  head.position.set(0, 0.29, 0.015)
  head.rotation.z = 0.1 // 歪头
  bear.add(torso, belly, head, bow)
  bear.position.set(-0.9, 1.1, -3.7)
  bear.rotation.y = -0.5 // 面朝桌前偏右
  bear.userData = { kind: 'bear' }
  props.add(bear)

  // 史莱姆玩偶：薄荷绿果冻团子，带滴水尖
  const slime = new THREE.Group()
  const slimeGreen = toonMat('#7AF0B0')
  const slimeBody = new THREE.Mesh(new THREE.SphereGeometry(0.1, 18, 14), slimeGreen)
  slimeBody.scale.set(1, 0.82, 1)
  slimeBody.position.y = 0.082
  slimeBody.castShadow = true
  addOutline(slimeBody, 0.009)
  // 头顶果冻尖
  const slimeTip = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 10), slimeGreen)
  slimeTip.scale.set(1, 1.5, 1)
  slimeTip.position.set(0.02, 0.2, 0)
  slimeTip.rotation.z = -0.4
  // 底部深色渐层
  const slimeBase = new THREE.Mesh(new THREE.SphereGeometry(0.099, 16, 12), toonMat('#4ED492'))
  slimeBase.scale.set(1, 0.32, 1)
  slimeBase.position.y = 0.028
  // 眼睛（圆豆眼 + 高光）
  const sEyeGeo = new THREE.SphereGeometry(0.013, 10, 8)
  const sEyeL = new THREE.Mesh(sEyeGeo, noseMat); sEyeL.position.set(-0.035, 0.1, 0.088)
  const sEyeR = new THREE.Mesh(sEyeGeo, noseMat); sEyeR.position.set(0.035, 0.1, 0.088)
  const sSparkGeo = new THREE.SphereGeometry(0.004, 6, 6)
  const sSparkL = new THREE.Mesh(sSparkGeo, new THREE.MeshBasicNodeMaterial({ color: '#FFFFFF' }))
  sSparkL.position.set(-0.031, 0.105, 0.098)
  const sSparkR = sSparkL.clone(); sSparkR.position.set(0.039, 0.105, 0.098)
  // 腮红 + 微笑
  const blushMat = toonMat('#75C7C3')
  const blushL = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.012, 0.008), blushMat)
  blushL.position.set(-0.058, 0.075, 0.082)
  const blushR = blushL.clone(); blushR.position.set(0.058, 0.075, 0.082)
  const sSmile = new THREE.Mesh(new THREE.TorusGeometry(0.016, 0.004, 6, 10, Math.PI), noseMat)
  sSmile.position.set(0, 0.06, 0.094)
  sSmile.rotation.z = Math.PI
  slime.add(slimeBody, slimeTip, slimeBase, sEyeL, sEyeR, sSparkL, sSparkR, blushL, blushR, sSmile)
  slime.position.set(0.35, 1.1, -3.62)
  slime.rotation.y = -0.25
  slime.userData = { kind: 'slime' }
  props.add(slime)

  // Thin, flat wakes mark the cloth as a waterline; objects pass through it.
  const surfaceRipples = [
    { object: bear, radius: 0.16 }, { object: clock, radius: 0.105 },
    { object: slime, radius: 0.11 },
  ].flatMap(({ object, radius }) => [0, 0.5].map((phase) => {
    const material = new THREE.MeshBasicNodeMaterial({
      color: '#E9FFFF', transparent: true, opacity: 0, depthWrite: false,
      toneMapped: false,
    })
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.0025, 4, 48, Math.PI * 1.65), material)
    mesh.rotation.set(-Math.PI / 2, 0, phase * Math.PI * 2)
    scene.add(mesh)
    return { mesh, object, phase }
  }))


  // 向日葵玩具：粉盆 + 绿茎 + 微笑大花盘（茎+花头单独成组用于摇晃，盆保持直立）
  const sunflower = new THREE.Group()
  const sfSway = new THREE.Group()
  const sfPot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.11, 14), toonMat('#75C7C3'))
  sfPot.position.y = 0.055
  sfPot.castShadow = true
  addOutline(sfPot, 0.008)
  const sfStem = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.26, 10), toonMat('#4ED492'))
  sfStem.position.y = 0.24
  sfStem.castShadow = true
  // 叶子 ×2
  const sfLeafGeo = new THREE.SphereGeometry(0.05, 10, 8)
  const sfLeafL = new THREE.Mesh(sfLeafGeo, toonMat('#4ED492'))
  sfLeafL.scale.set(1.4, 0.35, 0.7)
  sfLeafL.position.set(-0.06, 0.18, 0)
  sfLeafL.rotation.z = 0.4
  const sfLeafR = new THREE.Mesh(sfLeafGeo, toonMat('#4ED492'))
  sfLeafR.scale.set(1.4, 0.35, 0.7)
  sfLeafR.position.set(0.06, 0.24, 0)
  sfLeafR.rotation.z = -0.4
  // 花盘（朝镜头微仰）
  const sfHead = new THREE.Group()
  const petalGeo = new THREE.SphereGeometry(0.034, 10, 8)
  petalGeo.scale(0.55, 1.35, 0.3)
  const petalMat = toonMat('#B4CDA2')
  for (let p = 0; p < 10; p++) {
    const a = (Math.PI * 2 * p) / 10
    const petal = new THREE.Mesh(petalGeo, petalMat)
    petal.position.set(Math.cos(a) * 0.088, Math.sin(a) * 0.088, 0)
    petal.rotation.z = a - Math.PI / 2
    sfHead.add(petal)
  }
  const sfCenter = new THREE.Mesh(new THREE.SphereGeometry(0.062, 16, 12), toonMat('#8A5A2B'))
  sfCenter.scale.z = 0.55
  // 花盘笑脸
  const sfEyeGeo = new THREE.SphereGeometry(0.009, 8, 6)
  const sfEyeL = new THREE.Mesh(sfEyeGeo, noseMat); sfEyeL.position.set(-0.022, 0.014, 0.036)
  const sfEyeR = new THREE.Mesh(sfEyeGeo, noseMat); sfEyeR.position.set(0.022, 0.014, 0.036)
  const sfSmile = new THREE.Mesh(new THREE.TorusGeometry(0.015, 0.0035, 6, 10, Math.PI), noseMat)
  sfSmile.position.set(0, -0.012, 0.037)
  sfSmile.rotation.z = Math.PI
  const sfBlushL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.008, 0.005), blushMat)
  sfBlushL.position.set(-0.038, -0.008, 0.034)
  const sfBlushR = sfBlushL.clone(); sfBlushR.position.set(0.038, -0.008, 0.034)
  sfHead.add(sfCenter, sfEyeL, sfEyeR, sfSmile, sfBlushL, sfBlushR)
  sfHead.position.y = 0.4
  sfHead.rotation.x = -0.3
  // 茎+叶+花头挂到摇晃组（以盆口为轴摆动），盆固定在底座组
  sfSway.add(sfStem, sfLeafL, sfLeafR, sfHead)
  // 摇晃组原点 = 植物根部（茎底与盆口齐平），盆保持直立
  sunflower.add(sfPot, sfSway)
  sunflower.position.set(-0.7, 1.1, -4.42)
  sunflower.userData = { kind: 'sunflower' }
  props.add(sunflower)

  /* ── 房间毛绒玩偶（与小熊同风格）：床上兔子 / 地毯小猫 / 书架小鸭 ── */

  // 通用零件
  const plushEyeGeo = new THREE.SphereGeometry(0.013, 10, 8)
  const plushSparkGeo = new THREE.SphereGeometry(0.004, 6, 6)
  const plushSmileGeo = new THREE.TorusGeometry(0.013, 0.0035, 6, 10, Math.PI)
  const plushBlushGeo = new THREE.BoxGeometry(0.022, 0.009, 0.005)
  const sparkleMat = new THREE.MeshBasicNodeMaterial({ color: '#FFFFFF' })

  // ① 兔子玩偶：坐在床的枕头前，白色长耳 + 淡紫蝴蝶结
  const bunny = new THREE.Group()
  const bunnyFur = toonMat('#FFF9F2')
  const bunnyCream = toonMat('#F5E8D8')
  const bt = new THREE.Mesh(new THREE.SphereGeometry(0.12, 18, 14), bunnyFur)
  bt.scale.set(1, 1.12, 0.88)
  bt.position.y = 0.13
  bt.castShadow = true
  addOutline(bt, 0.01)
  const bb = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 10), bunnyCream)
  bb.scale.set(1, 1.1, 0.5)
  bb.position.set(0, 0.13, 0.07)
  const bh = new THREE.Group()
  const bskull = new THREE.Mesh(new THREE.SphereGeometry(0.095, 18, 14), bunnyFur)
  bskull.castShadow = true
  addOutline(bskull, 0.009)
  // 长耳朵 ×2（带粉色内耳）
  for (const sx of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 10), bunnyFur)
    ear.scale.set(0.55, 2.6, 0.5)
    ear.position.set(sx * 0.045, 0.16, -0.01)
    ear.rotation.z = sx * -0.15
    ear.castShadow = true
    addOutline(ear, 0.007)
    const inner = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), toonMat('#FFC7DC'))
    inner.scale.set(0.5, 2.2, 0.4)
    inner.position.set(sx * 0.047, 0.165, 0.008)
    inner.rotation.z = sx * -0.15
    bh.add(ear, inner)
  }
  // 脸：眼睛 + 白高光 + 粉鼻子 + 微笑 + 腮红
  const bnEyeL = new THREE.Mesh(plushEyeGeo, noseMat); bnEyeL.position.set(-0.035, 0.02, 0.082)
  const bnEyeR = new THREE.Mesh(plushEyeGeo, noseMat); bnEyeR.position.set(0.035, 0.02, 0.082)
  const bnSpkL = new THREE.Mesh(plushSparkGeo, sparkleMat); bnSpkL.position.set(-0.031, 0.025, 0.092)
  const bnSpkR = new THREE.Mesh(plushSparkGeo, sparkleMat); bnSpkR.position.set(0.039, 0.025, 0.092)
  const bnNose = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), toonMat('#5D91B2'))
  bnNose.scale.set(1.2, 0.8, 0.6)
  bnNose.position.set(0, -0.008, 0.088)
  const bnSmile = new THREE.Mesh(plushSmileGeo, noseMat)
  bnSmile.position.set(0, -0.024, 0.086)
  bnSmile.rotation.z = Math.PI
  const bnBlushL = new THREE.Mesh(plushBlushGeo, blushMat); bnBlushL.position.set(-0.055, -0.012, 0.078)
  const bnBlushR = new THREE.Mesh(plushBlushGeo, blushMat); bnBlushR.position.set(0.055, -0.012, 0.078)
  bh.add(bskull, bnEyeL, bnEyeR, bnSpkL, bnSpkR, bnNose, bnSmile, bnBlushL, bnBlushR)
  bh.position.set(0, 0.26, 0.012)
  bh.rotation.z = 0.08 // 歪头
  // 手臂 + 坐姿腿（带米色脚掌）
  const bArmGeo = new THREE.SphereGeometry(0.038, 12, 10)
  bArmGeo.scale(1, 1.55, 1)
  for (const sx of [-1, 1]) {
    const arm = new THREE.Mesh(bArmGeo, bunnyFur)
    arm.position.set(sx * 0.125, 0.13, 0.02)
    arm.rotation.z = sx * -0.55
    arm.castShadow = true
    addOutline(arm, 0.008)
    bunny.add(arm)
  }
  const bLegGeo = new THREE.SphereGeometry(0.045, 12, 10)
  bLegGeo.scale(1.1, 1.45, 1.1)
  for (const sx of [-1, 1]) {
    const leg = new THREE.Mesh(bLegGeo, bunnyFur)
    leg.position.set(sx * 0.07, 0.05, 0.08)
    leg.castShadow = true
    addOutline(leg, 0.008)
    const paw = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 8), bunnyCream)
    paw.scale.set(1, 1.05, 0.55)
    paw.position.set(sx * 0.072, 0.045, 0.12)
    bunny.add(leg, paw)
  }
  // 淡紫蝴蝶结
  const bBow = new THREE.Group()
  const bBowMat = toonMat('#B8D9E2')
  const bWingL = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 8), bBowMat)
  bWingL.scale.set(1.3, 0.8, 0.55); bWingL.position.set(-0.03, 0, 0); bWingL.rotation.z = 0.35
  const bWingR = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 8), bBowMat)
  bWingR.scale.set(1.3, 0.8, 0.55); bWingR.position.set(0.03, 0, 0); bWingR.rotation.z = -0.35
  const bKnot = new THREE.Mesh(new THREE.SphereGeometry(0.016, 10, 8), toonMat('#D8CCF9'))
  bBow.add(bWingL, bWingR, bKnot)
  bBow.position.set(0, 0.21, 0.062)
  bBow.rotation.x = -0.25
  bunny.add(bt, bb, bh, bBow)
  bunny.position.set(3.05, 0.42, -4.32) // 床垫上、枕头前
  bunny.rotation.y = 0.35
  bunny.scale.setScalar(0.92)
  bunny.userData = { kind: 'bunny' }
  scene.add(bunny)

  // ② 小猫玩偶：坐地毯上，橘白配色 + ω 嘴 + 卷尾巴
  const cat = new THREE.Group()
  const catFur = toonMat('#FFC98F')
  const catCream = toonMat('#FFF3E2')
  const ct = new THREE.Mesh(new THREE.SphereGeometry(0.13, 18, 14), catFur)
  ct.scale.set(1, 1.1, 0.9)
  ct.position.y = 0.14
  ct.castShadow = true
  addOutline(ct, 0.01)
  const cb = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 10), catCream)
  cb.scale.set(1, 1.1, 0.5)
  cb.position.set(0, 0.14, 0.075)
  const ch = new THREE.Group()
  const cskull = new THREE.Mesh(new THREE.SphereGeometry(0.1, 18, 14), catFur)
  cskull.castShadow = true
  addOutline(cskull, 0.009)
  // 三角耳朵（带粉内耳）
  for (const sx of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.09, 4), catFur)
    ear.position.set(sx * 0.07, 0.105, 0)
    ear.rotation.z = sx * -0.25
    ear.rotation.y = Math.PI / 4
    ear.castShadow = true
    addOutline(ear, 0.007)
    const inner = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.05, 4), toonMat('#FFB7CD'))
    inner.position.set(sx * 0.073, 0.1, 0.012)
    inner.rotation.z = sx * -0.25
    inner.rotation.y = Math.PI / 4
    ch.add(ear, inner)
  }
  // 脸：眼睛 + 高光 + ω 嘴 + 腮红 + 胡须
  const cEyeL = new THREE.Mesh(plushEyeGeo, noseMat); cEyeL.position.set(-0.037, 0.02, 0.086)
  const cEyeR = new THREE.Mesh(plushEyeGeo, noseMat); cEyeR.position.set(0.037, 0.02, 0.086)
  const cSpkL = new THREE.Mesh(plushSparkGeo, sparkleMat); cSpkL.position.set(-0.033, 0.025, 0.096)
  const cSpkR = new THREE.Mesh(plushSparkGeo, sparkleMat); cSpkR.position.set(0.041, 0.025, 0.096)
  const cNose = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 6), toonMat('#5D91B2'))
  cNose.scale.set(1.3, 0.8, 0.6)
  cNose.position.set(0, 0.0, 0.094)
  const cW1 = new THREE.Mesh(plushSmileGeo, noseMat)
  cW1.position.set(-0.014, -0.017, 0.09); cW1.rotation.z = Math.PI
  const cW2 = new THREE.Mesh(plushSmileGeo, noseMat)
  cW2.position.set(0.014, -0.017, 0.09); cW2.rotation.z = Math.PI
  const cBlushL = new THREE.Mesh(plushBlushGeo, blushMat); cBlushL.position.set(-0.058, -0.008, 0.08)
  const cBlushR = new THREE.Mesh(plushBlushGeo, blushMat); cBlushR.position.set(0.058, -0.008, 0.08)
  ch.add(cskull, cEyeL, cEyeR, cSpkL, cSpkR, cNose, cW1, cW2, cBlushL, cBlushR)
  ch.position.set(0, 0.27, 0.012)
  ch.rotation.z = -0.07 // 歪头（与小熊相反方向）
  // 手臂 + 坐姿腿
  const catArmGeo = new THREE.SphereGeometry(0.04, 12, 10)
  catArmGeo.scale(1, 1.6, 1)
  for (const sx of [-1, 1]) {
    const arm = new THREE.Mesh(catArmGeo, catFur)
    arm.position.set(sx * 0.13, 0.14, 0.02)
    arm.rotation.z = sx * -0.5
    arm.castShadow = true
    addOutline(arm, 0.008)
    cat.add(arm)
  }
  const catLegGeo = new THREE.SphereGeometry(0.047, 12, 10)
  catLegGeo.scale(1.1, 1.4, 1.1)
  for (const sx of [-1, 1]) {
    const leg = new THREE.Mesh(catLegGeo, catFur)
    leg.position.set(sx * 0.075, 0.055, 0.09)
    leg.castShadow = true
    addOutline(leg, 0.008)
    const paw = new THREE.Mesh(new THREE.SphereGeometry(0.033, 10, 8), catCream)
    paw.scale.set(1, 1.05, 0.55)
    paw.position.set(sx * 0.078, 0.05, 0.128)
    cat.add(leg, paw)
  }
  // 卷尾巴（半环）贴在身侧
  const tail = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.018, 8, 14, Math.PI * 1.4), catFur)
  tail.position.set(0.13, 0.09, -0.06)
  tail.rotation.set(0, Math.PI / 2, 0.4)
  tail.castShadow = true
  addOutline(tail, 0.007)
  cat.add(ct, cb, ch, tail)
  cat.position.set(-2.4, 0.012, -2.3) // 地毯左前
  cat.rotation.y = 0.55
  cat.userData = { kind: 'cat' }
  scene.add(cat)

  // ③ 小鸭玩偶：站书架顶层，黄色圆身 + 橙嘴 + 小翅膀
  const duck = new THREE.Group()
  const duckYellow = toonMat('#FFE066')
  const duckOrange = toonMat('#FFA94D')
  const dBody = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), duckYellow)
  dBody.scale.set(1.05, 1, 1.05)
  dBody.position.y = 0.075
  dBody.castShadow = true
  addOutline(dBody, 0.008)
  const dHead = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), duckYellow)
  dHead.position.set(0, 0.175, 0.008)
  dHead.castShadow = true
  addOutline(dHead, 0.008)
  // 呆毛
  const dTuft = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), duckYellow)
  dTuft.scale.set(0.4, 1.5, 0.4)
  dTuft.position.set(0, 0.235, 0)
  dTuft.rotation.z = 0.2
  // 橙色扁嘴（两片）
  const dBeakTop = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), duckOrange)
  dBeakTop.scale.set(1.3, 0.55, 0.9)
  dBeakTop.position.set(0, 0.165, 0.052)
  const dBeakBot = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), toonMat('#F08C33'))
  dBeakBot.scale.set(1.1, 0.45, 0.8)
  dBeakBot.position.set(0, 0.152, 0.052)
  // 眼睛 + 高光 + 腮红
  const dEyeL = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 6), noseMat); dEyeL.position.set(-0.022, 0.19, 0.046)
  const dEyeR = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 6), noseMat); dEyeR.position.set(0.022, 0.19, 0.046)
  const dSpkL = new THREE.Mesh(plushSparkGeo, sparkleMat); dSpkL.position.set(-0.019, 0.194, 0.053)
  const dSpkR = new THREE.Mesh(plushSparkGeo, sparkleMat); dSpkR.position.set(0.025, 0.194, 0.053)
  const dBlushL = new THREE.Mesh(plushBlushGeo, blushMat); dBlushL.position.set(-0.036, 0.168, 0.042)
  const dBlushR = new THREE.Mesh(plushBlushGeo, blushMat); dBlushR.position.set(0.036, 0.168, 0.042)
  // 小翅膀 ×2 + 橙色鸭掌 ×2
  const dWingGeo = new THREE.SphereGeometry(0.028, 10, 8)
  dWingGeo.scale(0.5, 1.3, 0.9)
  for (const sx of [-1, 1]) {
    const wing = new THREE.Mesh(dWingGeo, duckYellow)
    wing.position.set(sx * 0.072, 0.085, 0)
    wing.rotation.z = sx * -0.5
    wing.castShadow = true
    addOutline(wing, 0.006)
    duck.add(wing)
  }
  const dFootGeo = new THREE.SphereGeometry(0.02, 8, 6)
  dFootGeo.scale(1.3, 0.4, 1.6)
  for (const sx of [-1, 1]) {
    const foot = new THREE.Mesh(dFootGeo, duckOrange)
    foot.position.set(sx * 0.032, 0.008, 0.022)
    duck.add(foot)
  }
  duck.add(dBody, dHead, dTuft, dBeakTop, dBeakBot, dEyeL, dEyeR, dSpkL, dSpkR, dBlushL, dBlushR)
  duck.position.set(-0.32, 1.3025, 0.02) // 书架顶层（局部坐标）
  duck.rotation.y = -0.3
  shelf.add(duck)

  /* ── 蝴蝶群：电子感锐角翅 + 淡淡内透光 ── */
  const bfColors = ['#F1FFFC', '#BCEAFF', '#32D6ED', '#E0F5FF', '#A9E8F5', '#F5FFFE', '#69CEFF', '#D5FAFF', '#36BCEB']
  // 单侧翅膀轮廓：直线段硬折角（赛博锐利感）——前翅剑形尖朝前，后翅小锐角朝后
  const wingShapeR = new THREE.Shape()
  wingShapeR.moveTo(0, 0.012)
  wingShapeR.lineTo(0.05, 0.062)    // 前缘直出
  wingShapeR.lineTo(0.168, 0.03)    // 前翅尖（朝前外）
  wingShapeR.lineTo(0.122, -0.026)  // 外缘斜切回
  wingShapeR.lineTo(0.03, -0.006)   // 翅根收窄
  wingShapeR.lineTo(0.062, -0.048)  // 后翅外扩
  wingShapeR.lineTo(0.046, -0.118)  // 后翅尖（朝后外）
  wingShapeR.lineTo(0.004, -0.052)  // 回到翅根
  wingShapeR.closePath()
  const wingShapeL = new THREE.Shape()
  wingShapeL.moveTo(0, 0.012)
  wingShapeL.lineTo(-0.05, 0.062)
  wingShapeL.lineTo(-0.168, 0.03)
  wingShapeL.lineTo(-0.122, -0.026)
  wingShapeL.lineTo(-0.03, -0.006)
  wingShapeL.lineTo(-0.062, -0.048)
  wingShapeL.lineTo(-0.046, -0.118)
  wingShapeL.lineTo(0.004, -0.052)
  wingShapeL.closePath()
  const bfWingR = new THREE.ShapeGeometry(wingShapeR, 4)
  bfWingR.rotateX(Math.PI / 2) // 平放；shape +y → 世界 +z：前翅与头（+z）同侧
  const bfWingL = new THREE.ShapeGeometry(wingShapeL, 4)
  bfWingL.rotateX(Math.PI / 2)
  const bfSpotGeo = new THREE.SphereGeometry(0.011, 8, 6)
  bfSpotGeo.scale(1, 0.35, 1)
  // 电子感几何：翅膀轮廓线框 + 电路翅脉（根部出发的 PCB 走线）
  const bfEdgeL = new THREE.EdgesGeometry(bfWingL, 1)
  const bfEdgeR = new THREE.EdgesGeometry(bfWingR, 1)
  const bfTraceGeo = (() => {
    // 右翅翅脉（x 镜像到左翅）：根→前翅尖 / 根→翅外缘 / 根→后翅尖，各带中继折点
    const segs: number[] = []
    const trace = (pts: [number, number][]) => {
      for (let k = 0; k < pts.length - 1; k++) {
        const [x1, z1] = pts[k], [x2, z2] = pts[k + 1]
        segs.push(x1, 0, z1, x2, 0, z2)
      }
    }
    trace([[0.012, 0.006], [0.06, 0.05], [0.1, 0.045], [0.158, 0.026]])
    trace([[0.012, 0.0], [0.07, 0.02], [0.11, -0.018]])
    trace([[0.012, -0.006], [0.035, -0.045], [0.042, -0.108]])
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(segs, 3))
    return geo
  })()
  const bfBodyGeo = new THREE.CylinderGeometry(0.006, 0.009, 0.075, 8)
  bfBodyGeo.rotateX(Math.PI / 2)
  const bfHeadGeo = new THREE.SphereGeometry(0.009, 8, 6)
  const bfAntGeo = new THREE.CylinderGeometry(0.0013, 0.0013, 0.034, 5)
  const bfBodyMat = toonMat('#257DA4')
  const bfSpotMat = toonMat('#FFFFFF')
  const bfSpots: [number, number, number][] = [
    [-2.8, 2.3, -2.4], [2.4, 2.0, -2.6], [-2.4, 2.7, 1.0], [2.6, 2.4, 1.2],
    [0, 2.6, -1.4], [-1.3, 3.2, 0.4], [1.5, 3.1, -1.6], [-0.5, 1.8, -2.0], [3.0, 1.6, -0.6],
  ]
  const butterflies: {
    g: THREE.Group; pl: THREE.Group; pr: THREE.Group; wingMat: THREE.MeshToonNodeMaterial
    neonMat: THREE.LineBasicNodeMaterial
    cx: number; cy: number; cz: number; r: number; sp: number; ph: number; bsp: number; flap: number
  }[] = []
  bfSpots.forEach((p, i) => {
    const g = new THREE.Group()
    const wingMat = toonMat(bfColors[i % bfColors.length])
    wingMat.side = THREE.DoubleSide
    // 翅膀只是淡淡的内透光（像被夕阳照亮的薄翅），不追求"发光体"效果
    wingMat.emissive = new THREE.Color(bfColors[i % bfColors.length])
    wingMat.emissiveIntensity = 0.22
    // 身体 + 头 + 触角
    const body = new THREE.Mesh(bfBodyGeo, bfBodyMat)
    const head = new THREE.Mesh(bfHeadGeo, bfBodyMat)
    head.position.z = 0.045
    addOutline(body, 0.004)
    addOutline(head, 0.004)
    g.add(body, head)
    for (const sx of [-1, 1]) {
      const ant = new THREE.Mesh(bfAntGeo, bfBodyMat)
      ant.position.set(sx * 0.007, 0.015, 0.062)
      ant.rotation.x = -0.75
      ant.rotation.z = sx * 0.4
      g.add(ant)
    }
    // 双翅（枢轴扑动）+ 翅上白点
    const pl = new THREE.Group()
    const pr = new THREE.Group()
    const wl = new THREE.Mesh(bfWingL, wingMat)
    const wr = new THREE.Mesh(bfWingR, wingMat)
    pl.add(wl)
    pr.add(wr)
    // ── 电子感：霓虹轮廓线框 + 电路翅脉（跟翅膀一起扑动）──
    const neonMat = new THREE.LineBasicNodeMaterial({
      color: bfColors[i % bfColors.length], transparent: true, opacity: 0.9,
    })
    const edgeL = new THREE.LineSegments(bfEdgeL, neonMat)
    const edgeR = new THREE.LineSegments(bfEdgeR, neonMat)
    edgeL.position.y = 0.0015
    edgeR.position.y = 0.0015
    pl.add(edgeL)
    pr.add(edgeR)
    // 电路翅脉：根部出发的折线（PCB 走线感），端点小亮珠
    const nodeGeo = new THREE.SphereGeometry(0.006, 6, 5)
    const nodeMat = new THREE.MeshBasicNodeMaterial({ color: '#FFFFFF' })
    for (const sx of [-1, 1]) {
      const pivot = sx < 0 ? pl : pr
      const trace = new THREE.LineSegments(bfTraceGeo, neonMat)
      trace.scale.x = sx
      trace.position.y = 0.0015
      pivot.add(trace)
      for (const [ex, ez] of [[0.158, 0.026], [0.11, -0.018], [0.042, -0.108]]) {
        const node = new THREE.Mesh(nodeGeo, nodeMat)
        node.position.set(sx * ex, 0.002, ez)
        pivot.add(node)
      }
    }
    for (const sx of [-1, 1]) {
      const pivot = sx < 0 ? pl : pr
      for (const [ox, oz] of [[0.09, 0.015], [0.125, -0.005], [0.045, -0.06]]) {
        const spot = new THREE.Mesh(bfSpotGeo, bfSpotMat)
        spot.position.set(sx * ox, 0.001, oz)
        pivot.add(spot)
      }
    }
    g.add(pl, pr)
    g.scale.setScalar(0.75 + (i % 3) * 0.08)
    g.position.set(p[0], p[1], p[2])
    butterflies.push({
      g, pl, pr, wingMat, neonMat, cx: p[0], cy: p[1], cz: p[2],
      r: 0.55 + (i % 3) * 0.25, sp: 0.32 + (i % 4) * 0.12, ph: i * 1.7,
      bsp: 0.9 + (i % 3) * 0.3, flap: 7 + (i % 5) * 1.6,
    })
    scene.add(g)
  })

  scene.add(props)

  /* ── 夜模式 ── */
  const setNight = (on: boolean) => {
    sun.intensity = on ? 0.02 : 2.0
    // 冷紫环境光打底（夜空反光），暖光源做主角——冷暖对比代替一片粉雾
    ambient.intensity = on ? 0.68 : 0.78
    ambient.color.set(on ? 0xE9F1F5 : 0xF1F8F8)
    hemi.intensity = on ? 0.42 : 0.52
    hemi.color.set(on ? 0xE3F0F6 : 0xF3FAF8)
    hemi.groundColor.set(on ? 0x45DCCD : 0xA5FFED)
    // 吸顶灯与霓虹只做氛围：过强会在设备旁桌布上打出光斑
    lampLight.intensity = on ? 4.5 : 4
    lampLight.color.set(0xF6FBFE)
    neonLight.intensity = on ? 0.12 : 0.08
    neonCyanLight.intensity = on ? 0.1 : 0.06
    neonYellowLight.intensity = on ? 0.06 : 0.04
    // 深紫夜空：比纯深黑稍亮，与房间色调断层更小
    scene.background = new THREE.Color(C.bg)
  }

  // 默认进入夜模式：霓虹与灯光是主角
  setNight(true)

  const dispose = () => {
    distantSculptures.dispose()
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose()
      }
    })
  }

  // Attach each entry to its object, including that object's animated transforms.
  const anchorOn = (object: THREE.Object3D, offset: [number, number, number]) => {
    const anchor = new THREE.Object3D()
    anchor.position.set(...offset)
    object.add(anchor)
    return anchor
  }
  const firstBook = props.children.find(object => object.userData.kind === 'book') ?? displayBook
  const papersAnchor = anchorOn(firstBook, [0, 0.63, 0])
  const projectsAnchor = anchorOn(laptop, [0, 0.48, 0])
  const musicAnchor = anchorOn(speaker, [0, 0.64, 0])

  // Gather the intimate objects into a smaller foreground island. Anchors and
  // animated props keep their local coordinates, so picking and drift stay aligned.
  const foreground = new THREE.Group()
  const horizon = new Set<THREE.Object3D>([foldedSpace.group, distantSculptures.group])
  for (const child of [...scene.children]) {
    if (!horizon.has(child) && !(child instanceof THREE.Light) && child !== sun.target) foreground.add(child)
  }
  foreground.scale.setScalar(0.94)
  foreground.position.set(-1.3, -0.15, 1.5)
  scene.add(foreground)

  const handTarget = new THREE.Vector3()
  const musicShader = createMusicShader(scene)

  return { scene, lampLight, sunLight: sun, posterWall, tagAnchors: { papers: papersAnchor, projects: projectsAnchor, music: musicAnchor }, setSpeakerPlaying, tick, setNight, dispose }
}
