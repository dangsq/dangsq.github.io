import * as THREE from 'three/webgpu'
import { color, float, mix, positionLocal, smoothstep, uniform, normalWorld, vec3 } from 'three/tsl'
import { createAnomalousMaterial } from './atelier'

// Heart contour shared by the open sculpture and the deforming membrane.
function heartPoint(angle: number, scale = 1) {
  return new THREE.Vector3(
    Math.pow(Math.sin(angle), 3) * scale,
    (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle)) / 16 * scale,
    0,
  )
}

function heartMembrane() {
  const vertices: number[] = [], indices: number[] = []
  const rings = 28, segments = 96
  for (let ring = 0; ring <= rings; ring++) {
    for (let i = 0; i <= segments; i++) {
      const point = heartPoint(i / segments * Math.PI * 2, 1.1 * ring / rings)
      vertices.push(point.x, point.y, 0)
      if (ring < rings && i < segments) {
        const a = ring * (segments + 1) + i, b = a + segments + 1
        indices.push(a, b, a + 1, a + 1, b, b + 1)
      }
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function pawGeometry() {
  const palm = new THREE.Shape()
  palm.moveTo(0, 0.1)
  palm.bezierCurveTo(-0.11, 0.11, -0.15, -0.02, -0.23, -0.1)
  palm.bezierCurveTo(-0.34, -0.26, -0.16, -0.31, 0, -0.24)
  palm.bezierCurveTo(0.16, -0.31, 0.34, -0.26, 0.23, -0.1)
  palm.bezierCurveTo(0.15, -0.02, 0.11, 0.11, 0, 0.1)
  const pads = [[-0.26, 0.08, -0.38], [-0.1, 0.24, -0.12], [0.1, 0.24, 0.12], [0.26, 0.08, 0.38]].map(([x, y, angle]) => {
    const pad = new THREE.Shape()
    pad.absellipse(x, y, 0.075, 0.1, 0, Math.PI * 2, false, angle)
    return pad
  })
  const geometry = new THREE.ExtrudeGeometry([palm, ...pads], {
    depth: 0.045, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012,
    bevelSegments: 3, steps: 1, curveSegments: 20,
  })
  geometry.rotateX(-Math.PI / 2)
  return geometry
}

/** A few spatial contradictions, composed around the desk rather than over it. */
export function createDreamObjects() {
  const group = new THREE.Group()
  const time = uniform(0)
  const pearl = createAnomalousMaterial('#F3FFFD')

  // An open, asymmetric heart threads through the shelf.
  const heartCurve = new THREE.CatmullRomCurve3(Array.from({ length: 100 }, (_, i) => {
    const point = heartPoint(0.15 + i / 99 * Math.PI * 1.88, 0.94)
    point.z = Math.sin(i / 99 * Math.PI * 2) * 0.14
    return point
  }))
  const orbit = new THREE.Mesh(new THREE.TubeGeometry(heartCurve, 128, 0.035, 10, false), pearl)
  orbit.position.set(-3.85, 1.12, -2.25)
  orbit.rotation.set(0.25, 0.65, -0.28)
  group.add(orbit)

  // The steps ARE paw silhouettes: separate pads, no rectangular backing.
  const ascent = new THREE.CatmullRomCurve3([
    new THREE.Vector3(3.4, 0.55, -2.5),
    new THREE.Vector3(3.05, 1.7, -4.6),
    new THREE.Vector3(4.6, 3.1, -7.8),
    new THREE.Vector3(8.6, 5.2, -13.5),
    new THREE.Vector3(5.9, 12.1, -25.8),
  ])
  const paw = pawGeometry()
  const stairs = Array.from({ length: 32 }, (_, i) => {
    const u = i / 31
    const base = ascent.getPoint(u)
    const tangent = ascent.getTangent(u)
    const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize()
    base.addScaledVector(side, (i % 2 ? 1 : -1) * 0.24 * (1 - u * 0.4))
    const pulse = uniform(0)
    const stepMaterial = new THREE.MeshBasicNodeMaterial({
      color: new THREE.Color('#F5FFFE').lerp(new THREE.Color('#D4F9FF'), u),
      transparent: true, opacity: 1 - Math.pow(u, 3) * 0.97,
      toneMapped: false,
    })
    const lighting = normalWorld.dot(vec3(-0.35, 0.85, 0.4).normalize()).mul(0.5).add(0.5)
    stepMaterial.colorNode = mix(mix(color('#64B8DD'), color('#E3FCFF'), smoothstep(float(0.25), float(0.98), lighting)), color('#39DFC9'), pulse.mul(0.58))
    const step = new THREE.Mesh(paw, stepMaterial)
    step.position.copy(base)
    step.rotation.set(0.32, Math.atan2(-tangent.x, -tangent.z) + (i % 2 ? 0.13 : -0.13), 0)
    const size = 1.4 - u * 0.5
    step.scale.set(size, 1, size)
    group.add(step)
    return { step, base, yaw: step.rotation.y, size, pulse }
  })

  // A soft heart membrane carries a slowly flowing blue coordinate grid.
  const material = new THREE.MeshBasicNodeMaterial({ side: THREE.DoubleSide, toneMapped: false })
  const p = positionLocal
  const flow = p.x.mul(1.8).add(p.y.mul(1.3)).add(time.mul(0.23)).sin()
  const gx = smoothstep(float(0.91), float(0.99), p.x.mul(5).add(time.mul(0.06)).fract())
  const gy = smoothstep(float(0.91), float(0.99), p.y.mul(5).sub(time.mul(0.04)).fract())
  const base = mix(color('#E9FFFC'), color('#1EA7F0'), smoothstep(float(-0.8), float(0.9), flow))
  material.colorNode = mix(base, color('#0065BD'), gx.max(gy).mul(0.48))
  const geometry = heartMembrane()
  const original = Float32Array.from(geometry.attributes.position.array as ArrayLike<number>)
  const sail = new THREE.Mesh(geometry, material)
  sail.position.set(6.8, 2.0, -8.5)
  sail.scale.setScalar(0.68)
  sail.rotation.set(0.15, -0.3, -0.35)
  sail.frustumCulled = false
  group.add(sail)

  return {
    group,
    setDestination(point: THREE.Vector3) {
      ascent.points[ascent.points.length - 1].copy(point)
      stairs.forEach(({ step, base }, i) => {
        const u = i / (stairs.length - 1)
        const tangent = ascent.getTangent(u)
        base.copy(ascent.getPoint(u))
        const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize()
        base.addScaledVector(side, (i % 2 ? 1 : -1) * 0.24 * (1 - u))
        step.position.copy(base)
        stairs[i].yaw = Math.atan2(-tangent.x, -tangent.z) + (i % 2 ? 0.13 : -0.13)
      })
    },
    tick(t: number) {
      time.value = t
      orbit.rotation.z = -0.28 + Math.sin(t * 0.14) * 0.24
      orbit.position.y = 1.12 + Math.sin(t * 0.19) * 0.16
      // A soft travelling footfall climbs the path even with the music off.
      const footfall = (t * 1.5) % (stairs.length + 5)
      stairs.forEach(({ step, base, yaw, size, pulse }, i) => {
        const press = Math.exp(-Math.pow((footfall - i) / 0.8, 2))
        pulse.value = press
        step.position.y = base.y + Math.sin(t * 0.7 + i * 0.42) * 0.055 - press * 0.075
        step.rotation.y = yaw + Math.sin(t * 0.35 + i * 0.3) * 0.055
        step.rotation.z = Math.sin(t * 0.55 + i * 0.5) * 0.035
        step.scale.set(size * (1 + press * 0.055), 1 - press * 0.18, size * (1 + press * 0.055))
      })
      const positions = geometry.attributes.position
      for (let i = 0; i < positions.count; i++) {
        const x = original[i * 3], y = original[i * 3 + 1]
        positions.setZ(i, Math.sin(x * 2.3 + t * 0.3) * 0.26 + Math.cos(y * 2.2 + x + t * 0.2) * 0.16)
      }
      positions.needsUpdate = true
      sail.rotation.y = -0.3 + Math.sin(t * 0.12) * 0.25
    },
  }
}
