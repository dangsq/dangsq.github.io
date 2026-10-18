import * as THREE from 'three/webgpu'
import { color, float, mix, mx_fractal_noise_float, normalWorld, positionLocal, positionWorld, smoothstep, uniform, uv, vec3 } from 'three/tsl'

const dreamTime = uniform(0)
export const setDreamMaterialTime = (t: number) => { dreamTime.value = t }

// A moving band reveals an object's coordinate grid, then returns to porcelain.
export function createAnomalousMaterial(baseHex: string) {
  const material = new THREE.MeshBasicNodeMaterial({ toneMapped: false })
  const facing = normalWorld.dot(vec3(-0.34, 0.79, 0.51)).add(1).mul(0.5)
  const p = positionLocal
  const flow = positionWorld.y.mul(1.5).add(positionWorld.x.mul(0.6)).sub(dreamTime.mul(0.3)).sin()
  const shade = mix(color('#20B9DA'), color(baseHex), smoothstep(float(0.1), float(0.8), facing))
  const gx = smoothstep(float(0.9), float(0.99), p.x.mul(8).add(dreamTime.mul(0.04)).fract())
  const gy = smoothstep(float(0.9), float(0.99), p.y.add(p.z).mul(8).fract())
  const reveal = smoothstep(float(0.32), float(0.88), flow)
  const surface = mix(shade, color('#B7F8F0'), reveal.mul(0.32))
  material.colorNode = mix(surface, color('#006DC6'), gx.max(gy).mul(reveal).mul(0.55))
  return material
}

// Chromatic wall field: slow aurora gradients interrupted by short digital tears.
export function createAtelierWalls() {
  const time = uniform(0)
  const glitch = uniform(0.7)
  const makeWall = (bottom: string, top: string, accent: string) => {
    const material = new THREE.MeshBasicNodeMaterial()
    const p = positionLocal
    const noise = mx_fractal_noise_float(p.mul(0.75))
    const height = smoothstep(float(0), float(1), uv().y.add(noise.mul(0.13)))
    const sliceId = p.y.mul(2.6).floor()
    const sliceJump = smoothstep(float(0.87), float(0.96),
      sliceId.mul(12.7).add(time.mul(0.55)).sin()).mul(glitch)
    const warpedX = p.x.add(sliceJump.mul(0.48))
    const wave = warpedX.mul(0.43).add(p.y.mul(0.78)).add(time.mul(0.32)).sin()
    const aurora = smoothstep(float(-0.55), float(0.75), wave.add(noise.mul(0.34)))
    const base = mix(color(bottom), color(top), height)
    const luminous = mix(base, color(accent), aurora.mul(0.42))
    const row = p.y.mul(2.7).add(time.mul(0.43)).fract()
    const scan = smoothstep(float(0.975), float(0.995), row).mul(0.19)
    const tear = smoothstep(float(0.975), float(0.995),
      p.y.mul(6.5).add(time.mul(0.75)).sin())
      .mul(smoothstep(float(0.72), float(0.9), p.x.mul(1.4).add(time.mul(0.85)).sin()))
      .mul(glitch)
    const dropout = smoothstep(float(0.91), float(0.97),
      p.y.mul(3.7).add(time.mul(0.65)).sin())
      .mul(smoothstep(float(0.55), float(0.86),
        warpedX.mul(1.15).sub(time.mul(0.31)).sin()))
      .mul(glitch)
    const shifted = mix(luminous, color('#F4FFFD'), scan.add(sliceJump.mul(0.13)))
    const colored = mix(shifted, color('#2088C9'), tear.mul(0.44))
    material.colorNode = mix(colored, color('#557CA0'), dropout.mul(0.27))
    return material
  }
  return {
    backMat: makeWall('#D9E7F0', '#FCFDF9', '#BED9EB'),
    leftMat: makeWall('#DBE8F0', '#FEFEFA', '#C8DEF0'),
    rightMat: makeWall('#E2EBEF', '#FBFDF9', '#C6E5E2'),
    setTime: (t: number) => { time.value = t },
    setGlitch: (value: number) => { glitch.value = value },
  }
}

export function createInkFloor() {
  const time = uniform(0)
  const material = new THREE.MeshBasicNodeMaterial()
  const noise = mx_fractal_noise_float(positionLocal.mul(0.9))
  const depth = smoothstep(float(0.05), float(0.95), uv().y)
  const flow = positionLocal.x.mul(0.84).add(positionLocal.y.mul(1.17)).add(time.mul(0.82)).sin()
    .mul(positionLocal.x.mul(-0.48).add(positionLocal.y.mul(0.72)).sub(time.mul(0.54)).sin())
  const base = mix(color('#DEE8EC'), color('#FAFCF9'), depth)
  material.colorNode = mix(
    mix(base, color('#B9D7EA'), smoothstep(float(0.12), float(0.76), flow).mul(0.19)),
    color('#A5C3D7'), noise.mul(0.045),
  )
  return { material, setTime: (t: number) => { time.value = t } }
}

// The desktop behaves like a shallow sheet of porcelain-blue liquid.
export function createLiquidDeskSurface() {
  const time = uniform(0)
  const material = new THREE.MeshBasicNodeMaterial({ side: THREE.DoubleSide })
  const p = positionLocal
  const current = p.x.mul(4.4).add(time.mul(0.93))
    .add(p.y.mul(3.1).sub(time.mul(0.5)).sin().mul(0.85)).sin()
  const undertow = p.y.mul(5.8).sub(time.mul(0.74)).add(p.x.mul(1.7)).sin()
  const base = mix(color('#F9FBF8'), color('#C8E3EC'),
    smoothstep(float(-0.75), float(0.85), undertow).mul(0.55))
  const veins = smoothstep(float(0.67), float(0.9), current)
  material.colorNode = mix(base, color('#3389C6'), veins.mul(0.32))
  return { material, setTime: (t: number) => { time.value = t } }
}

// A continuous atmospheric field: no repeated sheets, edges, or room seams.
export function createFoldedSpace() {
  const group = new THREE.Group()
  group.position.set(0, 2, -4)
  const time = uniform(0)
  const energy = uniform(0)
  const field = new THREE.MeshBasicNodeMaterial({ side: THREE.BackSide, toneMapped: false })
  const direction = positionLocal.normalize()
  // Low-frequency volumetric drift gives all camera angles the same quiet depth.
  const drift = vec3(time.mul(0.018), time.mul(-0.011), time.mul(0.014))
  const haze = mx_fractal_noise_float(direction.mul(1.7).add(drift), 3, 2, 0.5)
  const depth = smoothstep(float(-0.4), float(0.55), haze.add(direction.y.mul(0.24)))
  const base = mix(color('#59CADA'), color('#F0FFFC'), depth)
  const glint = direction.x.mul(0.65).add(direction.y.mul(0.8))
    .add(haze.mul(0.38)).add(time.mul(0.055).sin().mul(0.12))
  const veil = smoothstep(float(0.12), float(0.42), glint)
    .mul(float(1).sub(smoothstep(float(0.42), float(0.82), glint)))
  field.colorNode = mix(base, color('#E5F8FF'), veil.mul(float(0.18).add(energy.mul(0.07))))
  group.add(new THREE.Mesh(new THREE.SphereGeometry(42, 64, 40), field))
  return {
    group,
    tick: (t: number, playing: boolean) => {
      time.value = t
      energy.value += ((playing ? 1 : 0) - energy.value) * 0.025
    },
  }
}
