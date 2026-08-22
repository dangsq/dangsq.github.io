import * as THREE from 'three/webgpu'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import {
  Fn, uv, vec3, float, color, mix, fract, floor, smoothstep, texture,
  mx_cell_noise_float, mx_fractal_noise_float, positionLocal, normalLocal,
} from 'three/tsl'

/* ── 圆角盒子：圆润家具的基础形状 ── */
export function rbox(w: number, h: number, d: number, r = 0.03, seg = 4): RoundedBoxGeometry {
  const radius = Math.max(0.001, Math.min(r, w / 2 - 0.002, h / 2 - 0.002, d / 2 - 0.002))
  return new RoundedBoxGeometry(w, h, d, seg, radius)
}

/* ── toon 色阶贴图：4 档，阴影不死黑（吉卜力式暖阴影）── */
let _gradient: THREE.DataTexture | null = null
export function toonGradient() {
  if (!_gradient) {
    // 暗部沉下去（88 而非 128）：夜色里物件有真正的暗面，立体感代替粉雾
    const steps = new Uint8Array([88, 156, 212, 255])
    _gradient = new THREE.DataTexture(steps, steps.length, 1, THREE.RedFormat)
    _gradient.minFilter = THREE.NearestFilter
    _gradient.magFilter = THREE.NearestFilter
    _gradient.needsUpdate = true
  }
  return _gradient
}

/* ── 平色 toon 材质 ── */
export function toonMat(hex: string, side?: THREE.Side) {
  const m = new THREE.MeshToonNodeMaterial(side ? { color: hex, side } : { color: hex })
  m.gradientMap = toonGradient()
  return m
}

/* ── 描边：反向壳——沿法线膨胀 + 背面渲染，3渲2 的灵魂 ── */
const OUTLINE = '#3A2B4E'
export function addOutline(mesh: THREE.Mesh, thickness = 0.014, hex = OUTLINE) {
  const m = new THREE.MeshBasicNodeMaterial({ color: hex, side: THREE.BackSide })
  m.positionNode = positionLocal.add(normalLocal.mul(thickness))
  const o = new THREE.Mesh(mesh.geometry, m)
  o.raycast = () => {}
  mesh.add(o)
  return o
}

/* ── toon 木纹：平色 + 板缝 + 逐板色差（无高频噪点，保持扁平）── */
export type WoodOptions = {
  base?: string
  dark?: string
  seam?: string
  planks?: number
}

export function createToonWood(opts: WoodOptions = {}) {
  const { base = '#C68B59', dark = '#B0784A', seam = '#96683F', planks = 7 } = opts
  const mat = new THREE.MeshToonNodeMaterial()
  mat.gradientMap = toonGradient()
  mat.colorNode = Fn(() => {
    const t = uv()
    // 逐板色差
    const tint = planks > 0
      ? mx_cell_noise_float(vec3(floor(t.y.mul(planks)), 4, 2)).mul(0.5)
      : float(0.25)
    const wood = mix(color(base), color(dark), tint)
    if (planks > 0) {
      // 板缝
      const row = fract(t.y.mul(planks))
      const edge = smoothstep(0, 0.03, row).mul(smoothstep(1, 0.97, row))
      return mix(color(seam), wood, edge)
    }
    return wood
  })()
  return mat
}

/* ============================================================
   Y2K 贴纸墙纸：奶油底 + 散布可爱贴纸（星星/爱心/闪/蝴蝶结/樱桃/笑脸/雏菊）
   ============================================================ */

const STICKER_PALETTE = ['#FF6FB3', '#FF9ECC', '#8FD3F4', '#A8E0FF', '#FFD84D', '#FFE9A8', '#C9B8F5', '#A8EBC8']

/* 切纸贴纸：先构建轮廓 path，白描边 + 柔影 + 填色，最后补细节 */
function stickerPath(ctx: CanvasRenderingContext2D, kind: number, s: number) {
  ctx.beginPath()
  if (kind === 0) {
    // 五角星
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? s : s * 0.45
      const a = (Math.PI / 5) * i - Math.PI / 2
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
    }
    ctx.closePath()
  } else if (kind === 1) {
    // 爱心
    ctx.moveTo(0, s * 0.9)
    ctx.bezierCurveTo(-s * 1.2, -s * 0.1, -s * 0.55, -s, 0, -s * 0.35)
    ctx.bezierCurveTo(s * 0.55, -s, s * 1.2, -s * 0.1, 0, s * 0.9)
  } else if (kind === 2) {
    // 四角闪
    ctx.moveTo(0, -s); ctx.quadraticCurveTo(0.18 * s, -0.18 * s, s, 0)
    ctx.quadraticCurveTo(0.18 * s, 0.18 * s, 0, s)
    ctx.quadraticCurveTo(-0.18 * s, 0.18 * s, -s, 0)
    ctx.quadraticCurveTo(-0.18 * s, -0.18 * s, 0, -s)
  } else if (kind === 3) {
    // 蝴蝶结两翼
    ctx.moveTo(0, 0); ctx.lineTo(-s, -s * 0.6); ctx.lineTo(-s, s * 0.6); ctx.closePath()
    ctx.moveTo(0, 0); ctx.lineTo(s, -s * 0.6); ctx.lineTo(s, s * 0.6); ctx.closePath()
  } else if (kind === 4) {
    // 樱桃双果
    ctx.moveTo(-s * 0.45 - s * 0.38, s * 0.3)
    ctx.arc(-s * 0.45, s * 0.3, s * 0.38, 0, Math.PI * 2)
    ctx.moveTo(s * 0.45 + s * 0.38 - 0.01, s * 0.35)
    ctx.arc(s * 0.45, s * 0.35, s * 0.38, 0, Math.PI * 2)
  } else if (kind === 5) {
    // 笑脸圆
    ctx.arc(0, 0, s, 0, Math.PI * 2)
  } else if (kind === 7) {
    // 猫猫：双耳 + 圆头（同一轮廓，可整体白描边）
    ctx.moveTo(-s * 0.85, -s * 0.4); ctx.lineTo(-s * 1.15, -s * 1.25); ctx.lineTo(-s * 0.15, -s * 0.85)
    ctx.closePath()
    ctx.moveTo(s * 0.85, -s * 0.4); ctx.lineTo(s * 1.15, -s * 1.25); ctx.lineTo(s * 0.15, -s * 0.85)
    ctx.closePath()
    ctx.moveTo(s, 0)
    ctx.arc(0, 0, s, 0, Math.PI * 2)
  } else if (kind === 8) {
    // 蝴蝶：四片翅 + 身体（多子路径，整体白描边；moveTo 精确落在旋转椭圆起点，避免杂线）
    ctx.moveTo(-0.07 * s, -0.398 * s)
    ctx.ellipse(-s * 0.52, -s * 0.18, s * 0.5, s * 0.38, -0.45, 0, Math.PI * 2)
    ctx.moveTo(0.97 * s, 0.038 * s)
    ctx.ellipse(s * 0.52, -s * 0.18, s * 0.5, s * 0.38, 0.45, 0, Math.PI * 2)
    ctx.moveTo(-0.117 * s, 0.504 * s)
    ctx.ellipse(-s * 0.38, s * 0.36, s * 0.3, s * 0.26, 0.5, 0, Math.PI * 2)
    ctx.moveTo(0.643 * s, 0.216 * s)
    ctx.ellipse(s * 0.38, s * 0.36, s * 0.3, s * 0.26, -0.5, 0, Math.PI * 2)
    ctx.moveTo(s * 0.09, s * 0.05)
    ctx.ellipse(0, s * 0.05, s * 0.09, s * 0.42, 0, 0, Math.PI * 2)
  } else {
    // 雏菊六瓣
    for (let p = 0; p < 6; p++) {
      const a = (Math.PI / 3) * p
      ctx.moveTo(Math.cos(a) * s * 0.55 + Math.cos(a + Math.PI / 2) * s * 0.24, Math.sin(a) * s * 0.55 + Math.sin(a + Math.PI / 2) * s * 0.24)
      ctx.ellipse(Math.cos(a) * s * 0.55, Math.sin(a) * s * 0.55, s * 0.42, s * 0.24, a, 0, Math.PI * 2)
    }
  }
}

function drawSticker(ctx: CanvasRenderingContext2D, kind: number, x: number, y: number, s: number, rot: number, hex: string) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  ctx.lineJoin = 'round'

  // 1) 白色切纸描边（带柔影浮起感）
  ctx.save()
  ctx.shadowColor = 'rgba(196, 110, 160, 0.38)'
  ctx.shadowBlur = s * 0.55
  ctx.shadowOffsetY = s * 0.22
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = s * 0.4
  stickerPath(ctx, kind, s)
  ctx.stroke()
  ctx.restore()
  // 2) 无影白描边再补一圈（边缘干净）
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = s * 0.4
  stickerPath(ctx, kind, s)
  ctx.stroke()
  // 3) 主体填色
  ctx.fillStyle = hex
  stickerPath(ctx, kind, s)
  ctx.fill()

  // 4) 细节
  if (kind === 3) {
    // 蝴蝶结中心结
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath(); ctx.arc(0, 0, s * 0.3, 0, Math.PI * 2); ctx.fill()
  } else if (kind === 4) {
    // 樱桃茎
    ctx.strokeStyle = hex
    ctx.lineWidth = s * 0.16
    ctx.lineCap = 'round'
    ctx.beginPath(); ctx.moveTo(-s * 0.35, -s * 0.35); ctx.quadraticCurveTo(0, -s * 1.05, s * 0.35, -s * 0.3); ctx.stroke()
  } else if (kind === 5) {
    // 笑脸五官
    ctx.fillStyle = '#2B2A33'
    ctx.beginPath(); ctx.arc(-s * 0.35, -s * 0.2, s * 0.11, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(s * 0.35, -s * 0.2, s * 0.11, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = '#2B2A33'
    ctx.lineWidth = s * 0.12
    ctx.lineCap = 'round'
    ctx.beginPath(); ctx.arc(0, s * 0.15, s * 0.4, 0.25, Math.PI - 0.25); ctx.stroke()
  } else if (kind === 6) {
    // 雏菊花心
    ctx.fillStyle = '#FFD966'
    ctx.beginPath(); ctx.arc(0, 0, s * 0.32, 0, Math.PI * 2); ctx.fill()
  } else if (kind === 7) {
    // 猫猫：内耳 + 眯眯眼 + ω 嘴 + 腮红 + 胡须
    const dark = '#2B2A33'
    ctx.fillStyle = '#FF9ECC'
    ctx.beginPath()
    ctx.moveTo(-s * 0.72, -s * 0.5); ctx.lineTo(-s * 0.95, -s * 1.05); ctx.lineTo(-s * 0.35, -s * 0.75)
    ctx.closePath(); ctx.fill()
    ctx.beginPath()
    ctx.moveTo(s * 0.72, -s * 0.5); ctx.lineTo(s * 0.95, -s * 1.05); ctx.lineTo(s * 0.35, -s * 0.75)
    ctx.closePath(); ctx.fill()
    ctx.strokeStyle = dark
    ctx.lineCap = 'round'
    ctx.lineWidth = s * 0.11
    ctx.beginPath(); ctx.arc(-s * 0.38, -s * 0.05, s * 0.18, Math.PI, 0); ctx.stroke()
    ctx.beginPath(); ctx.arc(s * 0.38, -s * 0.05, s * 0.18, Math.PI, 0); ctx.stroke()
    ctx.lineWidth = s * 0.09
    ctx.beginPath(); ctx.arc(-s * 0.14, s * 0.28, s * 0.14, 0, Math.PI); ctx.stroke()
    ctx.beginPath(); ctx.arc(s * 0.14, s * 0.28, s * 0.14, 0, Math.PI); ctx.stroke()
    ctx.fillStyle = '#FF9ECC'
    ctx.beginPath(); ctx.ellipse(-s * 0.68, s * 0.25, s * 0.18, s * 0.1, 0, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.ellipse(s * 0.68, s * 0.25, s * 0.18, s * 0.1, 0, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = dark
    ctx.lineWidth = s * 0.06
    for (const side of [-1, 1]) {
      for (let wk = 0; wk < 2; wk++) {
        const wy = s * 0.05 + wk * s * 0.22
        ctx.beginPath()
        ctx.moveTo(side * s * 0.75, wy)
        ctx.lineTo(side * s * 1.35, wy - s * 0.1)
        ctx.stroke()
      }
    }
  } else if (kind === 8) {
    // 蝴蝶：深色身体 + 白点翅斑 + 触角
    ctx.fillStyle = '#2B2A33'
    ctx.beginPath(); ctx.ellipse(0, s * 0.05, s * 0.07, s * 0.36, 0, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    for (const [wx, wy] of [[-0.55, -0.25], [0.55, -0.25], [-0.4, 0.38], [0.4, 0.38]]) {
      ctx.beginPath(); ctx.arc(wx * s, wy * s, s * 0.1, 0, Math.PI * 2); ctx.fill()
    }
    ctx.strokeStyle = '#2B2A33'
    ctx.lineWidth = s * 0.07
    ctx.lineCap = 'round'
    for (const sx of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(sx * 0.05 * s, -s * 0.28)
      ctx.quadraticCurveTo(sx * 0.22 * s, -s * 0.62, sx * 0.34 * s, -s * 0.6)
      ctx.stroke()
    }
  } else if (kind === 1) {
    // 爱心高光点
    ctx.fillStyle = 'rgba(255,255,255,0.75)'
    ctx.beginPath(); ctx.arc(-s * 0.28, -s * 0.28, s * 0.16, 0, Math.PI * 2); ctx.fill()
  }
  ctx.restore()
}

export function createY2KWallpaper() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!

  // 确定性伪随机：固定种子，每次渲染一致
  let seed = 7
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }

  // 透明底：只画贴纸（底色交给 TSL shader）
  // 5×5 网格 + 抖动散布（一半跳过 → 稀疏点缀；猫猫少量，蝴蝶很多）
  for (let gy = 0; gy < 5; gy++) {
    for (let gx = 0; gx < 5; gx++) {
      if (rand() < 0.5) continue
      const rv = rand()
      const kind = rv < 0.12 ? 7 : rv < 0.44 ? 8 : Math.floor(rand() * 7)
      const x = (gx + 0.25 + rand() * 0.5) * (size / 5)
      const y = (gy + 0.25 + rand() * 0.5) * (size / 5)
      const s = 10 + rand() * 9
      const rot = (rand() - 0.5) * 1.2
      const hex = STICKER_PALETTE[Math.floor(rand() * STICKER_PALETTE.length)]
      drawSticker(ctx, kind, x, y, s, rot, hex)
    }
  }

  const makeTex = () => {
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    return tex
  }
  const backTex = makeTex()
  backTex.repeat.set(6, 3)
  const sideTex = makeTex()
  sideTex.repeat.set(5, 3)

  /* TSL 墙底 shader：垂直渐变（奶油→樱花粉）+ 分形噪声云斑（丁香紫晕染）
     贴纸层按 alpha 合成在最上 */
  const makeWallMat = (tex: THREE.CanvasTexture) => {
    const mat = new THREE.MeshToonNodeMaterial()
    mat.gradientMap = toonGradient()
    const sticker = texture(tex)
    const n = mx_fractal_noise_float(positionLocal.mul(0.55))
    // 渐变：底部奶油 → 顶部灰粉（降饱和：粉只做氛围不做主色，去粉雾）
    const grad = smoothstep(float(-0.15), float(1.1), uv().y.add(n.mul(0.35)))
    const baseGrad = mix(color('#FFF9F3'), color('#F2DDE9'), grad)
    // 云斑：噪声高处染一点丁香紫，梦幻感
    const mottled = mix(baseGrad, color('#E4D6EE'), n.mul(0.2))
    mat.colorNode = mix(mottled, sticker.rgb, sticker.a)
    return mat
  }

  const backMat = makeWallMat(backTex)
  const sideMat = makeWallMat(sideTex)

  return { backMat, sideMat }
}
