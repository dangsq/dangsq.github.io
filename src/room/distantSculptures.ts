import * as THREE from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { color, float, mix, normalWorld, smoothstep, vec3, positionLocal, uniform } from 'three/tsl'

/** CC0 museum casts, suspended at architectural scale. */
export function createDistantSculptures() {
  const group = new THREE.Group()
  const plaster = new THREE.MeshBasicNodeMaterial({ toneMapped: false })
  const light = normalWorld.dot(vec3(-0.8, 0.55, 0.65).normalize()).mul(0.5).add(0.5)
  plaster.colorNode = mix(color('#508AC1'), color('#F4FFFD'),
    smoothstep(float(0.12), float(1.08), light))
  const scanTime = uniform(0)
  const p = positionLocal
  // Restrict erosion to one edge and the neck; keep eyes, nose and mouth legible.
  const edge = smoothstep(float(0.03), float(0.18), p.x)
  const neck = float(1).sub(smoothstep(float(-0.23), float(-0.06), p.y))
  const region = edge.max(neck)
  const band = p.y.mul(35).floor().mul(1.7).add(scanTime.mul(0.6)).sin()
  const erosion = smoothstep(float(-0.8), float(0.35), band.add(p.z.mul(20).sin().mul(0.35)))
  const brokenPlaster = plaster.clone()
  brokenPlaster.opacityNode = float(1).sub(region.mul(erosion))
  brokenPlaster.alphaTest = 0.48
  const scanMaterial = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, toneMapped: false, side: THREE.DoubleSide })
  const gridX = smoothstep(float(0.92), float(0.99), p.x.mul(21).fract())
  const gridY = smoothstep(float(0.92), float(0.99), p.y.mul(21).fract())
  const gridZ = smoothstep(float(0.94), float(0.99), p.z.mul(21).fract())
  scanMaterial.colorNode = mix(color('#007DB7'), color('#20E3D0'), band.mul(0.5).add(0.5))
  scanMaterial.opacityNode = region.mul(gridX.max(gridY).max(gridZ)).mul(0.65)
  scanMaterial.positionNode = p.add(vec3(band.mul(region).mul(0.02), 0, region.mul(0.009)))
  // Register the material before loading, so the music shader includes the scan.
  const david = new THREE.Mesh(new THREE.BufferGeometry(), brokenPlaster)
  david.position.set(-2.5, 5.8, -17)
  david.scale.setScalar(13.5)
  david.rotation.set(0.06, 0.48, 0.65)
  const scan = new THREE.Mesh(new THREE.BufferGeometry(), scanMaterial)
  david.add(scan)
  const dustMaterial = new THREE.PointsMaterial({ color: '#12BECD', size: 0.035, transparent: true, opacity: 0.55, depthWrite: false })
  const dust = new THREE.Points(new THREE.BufferGeometry(), dustMaterial)
  david.add(dust)
  const angel = new THREE.Mesh(new THREE.BufferGeometry(), plaster)
  angel.position.set(13.0, -0.5, -25)
  angel.scale.setScalar(22)
  angel.rotation.set(-0.12, -0.65, 0.25)
  // Surface landmark on the hand holding the dove, in normalized scan space.
  const handAnchor = new THREE.Object3D()
  handAnchor.position.set(-0.1323, 0.151, 0.277)
  angel.add(handAnchor)
  group.add(david, angel)
  let disposed = false
  function load(name: string, sculpture: THREE.Mesh) {
    new GLTFLoader().load(`/models/${name}.glb`, gltf => {
      if (disposed) {
        gltf.scene.traverse(object => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose()
            for (const material of Array.isArray(object.material) ? object.material : [object.material]) material.dispose()
          }
        })
        return
      }
      gltf.scene.updateMatrixWorld(true)
      const parts: THREE.BufferGeometry[] = []
      gltf.scene.traverse(object => {
        if (!(object instanceof THREE.Mesh)) return
        const geometry = object.geometry.clone().applyMatrix4(object.matrixWorld)
        parts.push(geometry)
        object.geometry.dispose()
        for (const material of Array.isArray(object.material) ? object.material : [object.material]) material.dispose()
      })
      const geometry = mergeGeometries(parts)
      parts.forEach(part => part.dispose())
      if (!geometry) return
      sculpture.geometry.dispose()
      sculpture.geometry = geometry
      geometry.computeBoundingSphere()
      if (name === 'david') {
        scan.geometry.dispose()
        scan.geometry = geometry.clone()
        const points: number[] = []
        const vertices = geometry.getAttribute('position')
        for (let i = 0; i < vertices.count; i += 83) {
          const x = vertices.getX(i), y = vertices.getY(i), z = vertices.getZ(i)
          if (x < 0.09 && y > -0.16) continue
          points.push(x + 0.018 + Math.sin(i * 1.73) * 0.055, y + Math.cos(i) * 0.018, z + Math.sin(i * 0.71) * 0.055)
        }
        dust.geometry.dispose()
        dust.geometry = new THREE.BufferGeometry()
        dust.geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
      }
    }, undefined, error => {
      if (!disposed) console.error(`[Sculpture] ${name} could not load`, error)
    })
  }
  load('david', david)
  // Keep the museum asset available for future compositions; omit it here.
  angel.visible = false

  return {
    group,
    handAnchor,
    tick(t: number) {
      scanTime.value = t
      dust.rotation.y = Math.sin(t * 0.22) * 0.025
      dustMaterial.opacity = 0.42 + Math.sin(t * 0.65) * 0.12
      // Almost imperceptible motion gives this enormous object a different timescale.
      david.position.y = 5.8 + Math.sin(t * 0.055) * 0.045
      angel.position.y = -0.5 + Math.sin(t * 0.045 + 2) * 0.06
    },
    dispose() { disposed = true; plaster.dispose(); brokenPlaster.dispose(); scanMaterial.dispose(); dustMaterial.dispose() },
  }
}
