import * as THREE from 'three/webgpu'
import { color, float, mix, normalWorld, positionWorld, smoothstep, uniform, vec3 } from 'three/tsl'

/** One shared, slowly changing score keeps the entire scene visually coherent. */
export function createMusicShader(scene: THREE.Scene) {
  const time = uniform(0), amount = uniform(0)
  const tint = uniform(new THREE.Color('#40DDED'))
  const ink = uniform(new THREE.Color('#006CCA'))
  const grid = uniform(0), pearl = uniform(0), negative = uniform(0)
  const scale = uniform(2.2), direction = uniform(0.5)
  const p = positionWorld
  const wave = p.x.mul(direction).add(p.y.mul(0.8)).add(p.z.mul(0.35))
    .add(time.mul(0.33)).sin()
  const wash = smoothstep(float(-0.85), float(0.85), wave)
  const gx = smoothstep(float(0.92), float(0.995), p.x.mul(scale).add(time.mul(0.07)).fract())
  const gy = smoothstep(float(0.92), float(0.995), p.y.add(p.z.mul(0.3)).mul(scale).sub(time.mul(0.05)).fract())
  const facing = normalWorld.y.abs()
  const sheen = p.y.mul(2.1).add(p.x).sub(time.mul(0.4)).sin().mul(0.5).add(0.5)
  const materialSet = new Set<THREE.Material>()
  scene.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      if (materialSet.has(material)) continue
      materialSet.add(material)
      if (!(material instanceof THREE.MeshBasicNodeMaterial || material instanceof THREE.MeshToonNodeMaterial)) continue
      // Keep artwork, faces and the gingham texture legible.
      if (material.map || material.transparent) continue
      const base = material.colorNode
        ? vec3(material.colorNode as ReturnType<typeof vec3>)
        : color(material.color).rgb
      const washed = mix(base, tint, wash.mul(0.5))
      const iridescent = mix(washed, color('#F4FFFC'), sheen.mul(facing.mul(0.5).add(0.2)).mul(pearl))
      const lined = mix(iridescent, ink, gx.max(gy).mul(grid).mul(0.6))
      const inversion = smoothstep(float(0.72), float(0.96), wave)
        .mul(smoothstep(float(0.62), float(0.95), facing)).mul(negative)
      const dream = mix(lined, ink.mul(0.3), inversion.mul(0.65))
      material.colorNode = mix(base, dream, amount)
    }
  })

  const palettes = [
    ['#34E7D0', '#006CCB'], ['#75C5FF', '#2856C7'],
    ['#B2ABFF', '#236CBC'], ['#A2F9EB', '#008AA9'],
  ]
  const modes = [
    { grid: 0.1, pearl: 0.9, negative: 0 },
    { grid: 0.9, pearl: 0.2, negative: 0.1 },
    { grid: 0.3, pearl: 0.65, negative: 0.85 },
    { grid: 0.55, pearl: 0.8, negative: 0.25 },
  ]
  const targetTint = new THREE.Color(), targetInk = new THREE.Color()
  let target = modes[0], targetScale = 2.2, targetDirection = 0.5
  let nextChange = 0, lastTime: number | undefined, wasPlaying = false, previous = -1

  return {
    tick(t: number, playing: boolean) {
      const dt = lastTime === undefined ? 0 : Math.min(t - lastTime, 0.1)
      lastTime = t
      time.value = t
      if (playing && (!wasPlaying || t >= nextChange)) {
        const choice = (previous + 1 + Math.floor(Math.random() * (modes.length - 1))) % modes.length
        previous = choice
        target = modes[choice]
        const palette = palettes[Math.floor(Math.random() * palettes.length)]
        targetTint.set(palette[0]); targetInk.set(palette[1])
        targetScale = 1.5 + Math.random() * 2.5
        targetDirection = 0.25 + Math.random() * 0.8
        nextChange = t + 6 + Math.random() * 4
      }
      wasPlaying = playing
      // No frame-to-frame random noise: every transition takes several seconds.
      const blend = 1 - Math.exp(-dt * 0.8)
      amount.value += ((playing ? 1 : 0) - amount.value) * (1 - Math.exp(-dt * 1.6))
      if (playing) {
        tint.value.lerp(targetTint, blend); ink.value.lerp(targetInk, blend)
        grid.value += (target.grid - grid.value) * blend
        pearl.value += (target.pearl - pearl.value) * blend
        negative.value += (target.negative - negative.value) * blend
        scale.value += (targetScale - scale.value) * blend
        direction.value += (targetDirection - direction.value) * blend
      }
    },
  }
}
