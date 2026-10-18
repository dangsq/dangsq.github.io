import * as THREE from 'three/webgpu'
import { toonMat } from './wood'

/* ============================================================
   大像素海报：Y2K 史莱姆三人组蹦蹦跳跳（纯装饰，与论文无关）
   ============================================================ */

const W = 88
const H = 80

function px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, hex: string) {
  ctx.fillStyle = hex
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
}

function sparkle(ctx: CanvasRenderingContext2D, cx: number, cy: number, hex: string) {
  px(ctx, cx, cy - 2, 1, 5, hex)
  px(ctx, cx - 2, cy, 5, 1, hex)
}

function heart(ctx: CanvasRenderingContext2D, x: number, y: number, hex: string) {
  px(ctx, x, y, 3, 1, hex)
  px(ctx, x + 4, y, 3, 1, hex)
  px(ctx, x, y + 1, 7, 2, hex)
  px(ctx, x + 1, y + 3, 5, 1, hex)
  px(ctx, x + 2, y + 4, 3, 1, hex)
  px(ctx, x + 3, y + 5, 1, 1, hex)
}

/* A room inside the room: nested doorways drift out of alignment, with a dark sun. */
const STARS: [number, number][] = Array.from({ length: 27 }, (_, i) => [
  4 + ((i * 37 + i * i * 13) % 80),
  5 + ((i * 19 + i * i * 7) % 69),
])

function drawY2KSlimes(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.clearRect(0, 0, w, h)
  ctx.save()
  ctx.beginPath()
  ctx.ellipse(w / 2, h / 2, w * 0.49, h * 0.49, 0, 0, Math.PI * 2)
  ctx.clip()
  const bands = ['#004C7B', '#006B98', '#008BAB', '#00A8B9', '#00C6C5', '#29DFCE', '#71F3D9', '#BBFFE8']
  for (let i = 0; i < bands.length; i++) px(ctx, 0, i * h / bands.length, w, h / bands.length + 1, bands[i])

  // Impossible horizon: its vanishing point slips independently of the architecture.
  const vanishingX = w * 0.5 + Math.sin(t * 0.29) * 9
  const vanishingY = h * 0.51 + Math.sin(t * 0.37) * 6
  for (let i = 0; i < 8; i++) {
    const size = 36 - i * 4
    const offset = Math.sin(t * 0.41 + i * 0.75) * (i + 1) * 0.8
    ctx.strokeStyle = i % 3 === 0 ? '#36FFDB' : i % 3 === 1 ? '#D7FFF2' : '#00D9FF'
    ctx.globalAlpha = 0.18 + i * 0.06
    ctx.lineWidth = i % 3 === 0 ? 1.5 : 1
    ctx.beginPath()
    ctx.ellipse(vanishingX + offset, vanishingY, size, size * 0.8, Math.sin(t * 0.2 + i) * 0.35, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  // A negative sun: bright corona, black center.
  const sunX = vanishingX + Math.sin(t * 0.6) * 4
  const sunY = vanishingY - 7
  ctx.fillStyle = '#E6FBF6'
  ctx.beginPath(); ctx.arc(sunX, sunY, 13, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#03040B'
  ctx.beginPath(); ctx.arc(sunX + 3, sunY - 2, 13, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = '#6DD2C7'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.arc(sunX, sunY, 16, -1.4, 1.7); ctx.stroke()

  STARS.forEach(([sx, sy], i) => {
    if (Math.sin(t * 1.8 + i * 3.7) > 0.17) sparkle(ctx, sx, sy, i % 2 ? '#E8FDFA' : '#4DD2E6')
  })

  // Scanline tears arrive in bursts, not as a constant texture.
  if (Math.sin(t * 2.6) > 0.7) {
    for (let i = 0; i < 5; i++) {
      const y = (i * 19 + Math.floor(t * 8) * 7) % h
      px(ctx, i % 2 ? 0 : 9, y, w - 12, 1, i % 2 ? '#53C1C6' : '#A1CEC2')
    }
  }
  ctx.restore()
}

export type PosterWallHandle = {
  group: THREE.Group
  frame: THREE.Group
  tick: (t: number) => void
}

export function buildPosterWall(): PosterWallHandle {
  const group = new THREE.Group()

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  drawY2KSlimes(ctx, W, H, 0)

  const tex = new THREE.CanvasTexture(canvas)
  tex.magFilter = THREE.NearestFilter
  tex.minFilter = THREE.NearestFilter
  tex.colorSpace = THREE.SRGBColorSpace

  // 大相框：热粉外框 + 白衬边（Y2K 双色描边）
  const w = 2.2
  const h = 2.0
  const frame = new THREE.Group()

  const t2 = 0.05

  // 海报画面
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(w - t2 * 2 + 0.02, h - t2 * 2 + 0.02),
    new THREE.MeshBasicNodeMaterial({ map: tex, transparent: true }),
  )
  screen.position.z = 0.012

  frame.add(screen)
  frame.position.set(0, 2.6, -4.86)
  frame.rotation.z = 0.012 // 手挂微歪
  group.add(frame)

  // 12fps 节流重绘
  let lastDraw = -1
  const tick = (t: number) => {
    if (t - lastDraw < 1 / 12) return
    lastDraw = t
    drawY2KSlimes(ctx, W, H, t)
    tex.needsUpdate = true
  }

  return { group, frame, tick }
}

/* ============================================================
   Miku 像素海报：Q 版双马尾少女半身像（原创像素画，致敬风格）
   动态：双马尾摆动 + 眨眼 + 星星闪烁 + 爱心脉动
   ============================================================ */

export type MikuPosterHandle = {
  group: THREE.Group
  tick: (t: number) => void
}

export function buildMikuPoster(): MikuPosterHandle {
  const W = 56
  const H = 72
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  const TEAL = '#39C5BB'
  const TEAL_D = '#2AA79E'
  const TEAL_L = '#8CE8E0'
  const SKIN = '#FFE3CC'
  const EYE = '#1E5F5A'
  const BLUSH = '#FF9EB5'
  const TOP = '#F4F6F8'
  const DARK = '#2E3440'

  const r = (x: number, y: number, w: number, h: number, c: string) => {
    ctx.fillStyle = c
    ctx.fillRect(x, y, w, h)
  }

  const drawMiku = (t: number) => {
    // 背景：青色系渐变条带
    const bands = ['#E4FBF7', '#CFF5F0', '#BCEFE9', '#ABE9E2', '#9CE3DB', '#8DDED6']
    for (let i = 0; i < 6; i++) r(0, i * 12, W, 12, bands[i])

    // 背景闪星（闪烁）+ 爱心（颜色脉动）
    const starPos: [number, number][] = [[8, 10], [47, 16], [50, 58], [6, 54]]
    starPos.forEach(([sx, sy], i) => {
      if (Math.sin(t * 3 + i * 1.9) > -0.25) sparkle(ctx, sx, sy, '#FFFFFF')
    })
    const beat = Math.floor(t * 2) % 2 === 0
    heart(ctx, 12, 32, beat ? '#FF9EB5' : '#FFC7D5')
    heart(ctx, 41, 46, beat ? '#FFC7D5' : '#FF9EB5')

    // 双马尾（左右垂落，随时间波浪摆动）
    for (let row = 22; row < 70; row++) {
      const wave = Math.round(Math.sin(t * 1.6 + row / 5) * 2)
      r(4 + wave, row, 8, 1, TEAL)
      r(44 - wave, row, 8, 1, TEAL)
    }
    r(6, 24, 2, 44, TEAL_D)
    r(9, 24, 1, 44, TEAL_L)
    r(46, 24, 1, 44, TEAL_L)
    r(49, 24, 2, 44, TEAL_D)
    // 粉色发圈
    r(5, 21, 6, 2, '#FF4F9E')
    r(45, 21, 6, 2, '#FF4F9E')

    // 上衣 + 领带
    r(18, 44, 20, 12, TOP)
    r(16, 46, 2, 10, TOP)
    r(38, 46, 2, 10, TOP)
    r(25, 44, 6, 2, TEAL)
    r(26, 46, 4, 8, DARK)
    r(25, 54, 6, 2, DARK)
    // 手
    r(15, 54, 4, 3, SKIN)
    r(37, 54, 4, 3, SKIN)
    // 腰带 + 百褶裙
    r(18, 56, 20, 2, TEAL_D)
    for (let row = 58; row < 66; row++) {
      const half = 10 + (row - 58)
      r(28 - half, row, half * 2, 1, TEAL)
    }
    for (let x = 18; x <= 38; x += 5) r(x, 59, 1, 6, TEAL_D)

    // 脸 + 下巴
    r(20, 24, 16, 16, SKIN)
    r(21, 40, 14, 2, SKIN)
    // 头发穹顶 + 刘海
    r(17, 10, 22, 10, TEAL)
    r(15, 14, 26, 8, TEAL)
    r(19, 20, 18, 4, TEAL)
    for (let x = 19; x <= 35; x += 4) r(x, 24, 2, 3, TEAL)
    // 两鬓侧发
    r(16, 22, 3, 16, TEAL)
    r(37, 22, 3, 16, TEAL)
    // 头发高光
    r(21, 12, 6, 2, TEAL_L)
    r(31, 13, 4, 2, TEAL_L)
    // 耳机 + 头箍
    r(19, 26, 18, 1, DARK)
    r(14, 25, 2, 5, DARK)
    r(42, 25, 2, 5, DARK)

    // 眼睛：每 3.4 秒眨一次（闭眼 0.2 秒）
    const blinking = t % 3.4 > 3.2
    if (blinking) {
      r(22, 32, 4, 1, EYE)
      r(30, 32, 4, 1, EYE)
    } else {
      r(22, 29, 4, 6, EYE)
      r(30, 29, 4, 6, EYE)
      r(23, 30, 1, 2, '#FFFFFF')
      r(31, 30, 1, 2, '#FFFFFF')
    }
    // 腮红 + 微笑
    r(20, 36, 3, 2, BLUSH)
    r(33, 36, 3, 2, BLUSH)
    r(26, 38, 4, 1, '#C46A5A')
  }

  drawMiku(0)

  const tex = new THREE.CanvasTexture(canvas)
  tex.magFilter = THREE.NearestFilter
  tex.minFilter = THREE.NearestFilter
  tex.colorSpace = THREE.SRGBColorSpace

  // 相框：粉外框 + 白衬边（小号）
  const w = 1.05
  const h = 1.4
  const group = new THREE.Group()
  const frame = new THREE.Group()

  const pink = toonMat('#00BEB9')
  const white = toonMat('#F4FAF5')
  const t1 = 0.07
  const t2 = 0.04

  const pTop = new THREE.Mesh(new THREE.BoxGeometry(w + t1 * 2, t1, t1), pink); pTop.position.set(0, h / 2 + t1 / 2, 0)
  const pBot = new THREE.Mesh(new THREE.BoxGeometry(w + t1 * 2, t1, t1), pink); pBot.position.set(0, -h / 2 - t1 / 2, 0)
  const pL = new THREE.Mesh(new THREE.BoxGeometry(t1, h + t1 * 2, t1), pink); pL.position.set(-w / 2 - t1 / 2, 0, 0)
  const pR = new THREE.Mesh(new THREE.BoxGeometry(t1, h + t1 * 2, t1), pink); pR.position.set(w / 2 + t1 / 2, 0, 0)
  const wTop = new THREE.Mesh(new THREE.BoxGeometry(w + t2 * 2, t2, t2 * 0.7), white); wTop.position.set(0, h / 2 + t2 / 2, 0)
  const wBot = new THREE.Mesh(new THREE.BoxGeometry(w + t2 * 2, t2, t2 * 0.7), white); wBot.position.set(0, -h / 2 - t2 / 2, 0)
  const wL = new THREE.Mesh(new THREE.BoxGeometry(t2, h + t2 * 2, t2 * 0.7), white); wL.position.set(-w / 2 - t2 / 2, 0, 0)
  const wR = new THREE.Mesh(new THREE.BoxGeometry(t2, h + t2 * 2, t2 * 0.7), white); wR.position.set(w / 2 + t2 / 2, 0, 0)
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(w - t2 * 2 + 0.02, h - t2 * 2 + 0.02),
    new THREE.MeshBasicNodeMaterial({ map: tex }),
  )
  screen.position.z = 0.012

  // 顶部两角和纸胶带
  const tapeL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.012), toonMat('#A0BCB7'))
  tapeL.position.set(-w / 2 + 0.05, h / 2 + 0.04, 0.02)
  tapeL.rotation.z = Math.PI / 4
  const tapeR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.012), toonMat('#C9C7AA'))
  tapeR.position.set(w / 2 - 0.05, h / 2 + 0.04, 0.02)
  tapeR.rotation.z = -Math.PI / 4

  frame.add(pTop, pBot, pL, pR, wTop, wBot, wL, wR, screen, tapeL, tapeR)
  frame.rotation.z = 0.015
  group.add(frame)

  // 12fps 节流重绘
  let lastDraw = -1
  const tick = (t: number) => {
    if (t - lastDraw < 1 / 12) return
    lastDraw = t
    drawMiku(t)
    tex.needsUpdate = true
  }

  return { group, tick }
}
