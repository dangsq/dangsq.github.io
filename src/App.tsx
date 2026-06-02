import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import './App.css'

const SECTIONS = [
  {
    key: 'about', label: 'About Me', color: '#FF0055',
    items: [
      {
        title: 'Background',
        content: `PhD candidate at Shanghai Innovation Institute (from 2025.09) & Tongji University (from 2025.03).

Master of AI and Data Design at Tongji University College of Design and Innovation (2023.09 – 2025.01)

Bachelor of Mathematics at Tongji University (2019.09 – 2023.06)`
      },
      {
        title: 'Personality',
        content: `INFP personality type. Passionate about creative technology, design thinking, and building things that matter.
Believes in the power of interdisciplinary research.`,
      },
      {
        title: 'Interests',
        content: `Human-Computer Interaction · Computer Vision · Intelligent Design · Generative Models · Graphics
Love exploring the intersection of technology, art, and human experience.`,
      },
      {
        title: 'Contact',
        content: `Feel free to reach out for research collaboration, project discussions, or just a nice chat about technology and design!
        
        Email: dangsq123@163.com
        `
      },
    ]
  },
  {
    key: 'research', label: 'Research & Publications', color: '#FF0055',
    items: [
      {
        title: 'Human-Centered Generative Models',
        content: `<b>EmotiCrafter: Text-to-Emotional-Image Generation based on Valence-Arousal Model</b>
Shengqi Dang, Yi He, Long Ling, Ziqing Qian, Nanxuan Zhao, Nan Cao
<i>ICCV 2025</i>

<b>CogBlender: Towards Continuous Cognitive Intervention in Text-to-Image Generation</b>
Shengqi Dang, Jiaying Lei, Yi He, Ziqing Qian, Nan Cao
<i>arXiv 2026</i>`,
      },
      {
        title: 'Personalization',
        content: `<b>Personalizing Products with Stylized Head Portraits for Self-Expression</b>
Yang Shi, Yechun Peng, Shengqi Dang, Nanxuan Zhao, Nan Cao
<i>CHI 2024</i>

<b>Bring Clipart to Life</b>
Nanxuan Zhao, Shengqi Dang, Hexun Lin, Yang Shi, Nan Cao
<i>ICCV 2023</i>`,
      },
      {
        title: 'Graphics & Fabrication',
        content: `<b>DensiCrafter: Physically-Constrained Generation and Fabrication of Self-Supporting Hollow Structures</b>
Shengqi Dang, Fu Chai, Jiaxin Li, Chao Yuan, Wei Ye, Nan Cao
<i>AAAI 2026</i> 

<b>FreeShell: A Context-Free 4D Printing Technique for Fabricating Complex 3D Triangle Mesh Shells</b>
Chao Yuan, Shengqi Dang, Xuejiao Ma, Nan Cao
<i>ACM Transactions on Graphics (TOG) 2026</i>`,
      },
      {
        title: 'Visualization',
        content: `<b>MV-Crafter: An Intelligent System for Music-guided Video Generation</b>
Chuer Chen, Shengqi Dang, Yuqi Liu, Nanxuan Zhao, Yang Shi, Nan Cao
<i>ACM Transactions on Interactive Intelligent Systems (TiiS) 2025</i>

<b>ChartBlender: An Interactive System for Authoring and Synchronizing Visualization Charts in Video</b>
Yi He, Yuqi Liu, Chenpu Li, Ruoyan Chen, Chuer Chen, Shengqi Dang, Nan Cao
<i>IEEE TVCG 2026</i>

<b>Funding the Frontier: Visualizing the Broad Impact of Science and Science Funding</b>
Yifang Wang, Yifan Qian, Xiaoyu Qi, Yian Yin, Shengqi Dang, Ziqing Qian, Benjamin F Jones, Nan Cao, Dashun Wang
<i>arXiv 2025</i>`,
      },
    ]
  },
  {
    key: 'experience', label: 'TBD', color: '#FF0055',
    items: [
      {
        title: 'TBD1',
        content: `TBD`,
      },
      {
        title: 'TBD2',
        content: `TBD`,
      },
      {
        title: 'TBD3',
        content: `TBD`,
      },
      {
        title: 'TBD4',
        content: `TBD`,
      },
    ]
  },
  {
     key: 'demos', label: 'Demos', color: '#FF0055',
     items: [
       {
         title: 'Visualization',
         content: `TBD`,
       },
       {
         title: 'Artwork',
         content: `TBD`,
       },
       {
         title: 'AI Applications',
         content: `TBD`,
       },
       {
         title: 'Others',
         content: `TBD`,
       },
     ]
   },
]

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeItem, setActiveItem] = useState({ faceIdx: 0, subIdx: 0 })
  const [displayItem, setDisplayItem] = useState({ faceIdx: 0, subIdx: 0 })
  const [animPhase, setAnimPhase] = useState<'idle' | 'out' | 'in'>('idle')
  const [mouse, setMouse] = useState({ x: -100, y: -100 })
  const [autoPlaying, setAutoPlaying] = useState(true)
  const currentQuat = useRef(new THREE.Quaternion())
  const targetQuat = useRef(new THREE.Quaternion())
  const activeItemRef = useRef(activeItem)
  const isDraggingRef = useRef(false)
  const autoModeRef = useRef(true)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  activeItemRef.current = activeItem

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    if (activeItem.faceIdx === displayItem.faceIdx && activeItem.subIdx === displayItem.subIdx) return
    setAnimPhase('out')
    const t1 = setTimeout(() => {
      setDisplayItem(activeItem)
      setAnimPhase('idle')
    }, 200)
    return () => { clearTimeout(t1) }
  }, [activeItem.faceIdx, activeItem.subIdx])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    
    const canvas2D = document.createElement('canvas')
    canvas2D.width = window.innerWidth
    canvas2D.height = window.innerHeight
    canvas2D.style.position = 'absolute'
    canvas2D.style.top = '0'
    canvas2D.style.left = '0'
    canvas2D.style.pointerEvents = 'none'
    canvas2D.style.zIndex = '10'
    canvas.parentElement?.appendChild(canvas2D)
    const ctx2D = canvas2D.getContext('2d')!

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0, 4.5)
    camera.lookAt(0, 0, 0)

    const mainLight = new THREE.DirectionalLight('#FFFFFF', 3)
    mainLight.position.set(5, 5, 5)
    scene.add(mainLight)
    const fillLight = new THREE.DirectionalLight('#FFFFFF', 0.5)
    fillLight.position.set(-5, 5, -5)
    scene.add(fillLight)
    scene.add(new THREE.AmbientLight('#FFFFFF', 1))
    const hemiLight = new THREE.HemisphereLight('#FFFFFF', '#FFFFFF', 0.5)
    scene.add(hemiLight)

    const tetraGroup = new THREE.Group()
    const scale = 1.4

    const verts = [
      new THREE.Vector3(1, 1, 1).normalize().multiplyScalar(scale),
      new THREE.Vector3(1, -1, -1).normalize().multiplyScalar(scale),
      new THREE.Vector3(-1, 1, -1).normalize().multiplyScalar(scale),
      new THREE.Vector3(-1, -1, 1).normalize().multiplyScalar(scale),
    ]

    const faceIndices: [number, number, number][] = [
      [0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 3, 2],
    ]

    const glassColors = ['#FF0055', '#FF0055', '#FF0055', '#FF0055']

    const faceNormals = faceIndices.map(fi => {
      const p1 = new THREE.Vector3().copy(verts[fi[1]]).sub(verts[fi[0]])
      const p2 = new THREE.Vector3().copy(verts[fi[2]]).sub(verts[fi[0]])
      return new THREE.Vector3().crossVectors(p1, p2).normalize()
    })

    const sequence: { faceIdx: number; subIdx: number }[] = []
    for (let f = 0; f < 4; f++) {
      for (let s = 0; s < 4; s++) {
        sequence.push({ faceIdx: f, subIdx: s })
      }
    }

    const cameraDir = new THREE.Vector3(-2, 0, 4.5).normalize()
    const faceTargetQuats = faceNormals.map(normal => {
      return new THREE.Quaternion().setFromUnitVectors(normal, cameraDir)
    })
    const initQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.3, 0.5, 0))
    currentQuat.current.copy(initQuat)
    targetQuat.current.copy(initQuat)

    const triangleData: { a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, faceIdx: number, subIdx: number }[] = []

    faceIndices.forEach((fi, faceIdx) => {
      const A = verts[fi[0]].clone()
      const B = verts[fi[1]].clone()
      const C = verts[fi[2]].clone()
      const AB = new THREE.Vector3().addVectors(A, B).multiplyScalar(0.5)
      const BC = new THREE.Vector3().addVectors(B, C).multiplyScalar(0.5)
      const CA = new THREE.Vector3().addVectors(C, A).multiplyScalar(0.5)
      triangleData.push({ a: A, b: AB, c: CA, faceIdx, subIdx: 0 })
      triangleData.push({ a: B, b: BC, c: AB, faceIdx, subIdx: 1 })
      triangleData.push({ a: C, b: CA, c: BC, faceIdx, subIdx: 2 })
      triangleData.push({ a: AB, b: BC, c: CA, faceIdx, subIdx: 3 })
    })

    const edgeMap = new Map<string, { a: THREE.Vector3, b: THREE.Vector3 }>()
    const edgeKeyF = (a: THREE.Vector3, b: THREE.Vector3) => {
      const eps = 0.001
      const ax = Math.round(a.x / eps) * eps
      const ay = Math.round(a.y / eps) * eps
      const az = Math.round(a.z / eps) * eps
      const bx = Math.round(b.x / eps) * eps
      const by = Math.round(b.y / eps) * eps
      const bz = Math.round(b.z / eps) * eps
      const k1 = `${ax},${ay},${az}-${bx},${by},${bz}`
      const k2 = `${bx},${by},${bz}-${ax},${ay},${az}`
      return k1 < k2 ? k1 : k2
    }

    triangleData.forEach(tri => {
      const edges: [THREE.Vector3, THREE.Vector3][] = [[tri.a, tri.b], [tri.b, tri.c], [tri.c, tri.a]]
      edges.forEach(([a, b]) => {
        const key = edgeKeyF(a, b)
        if (!edgeMap.has(key)) edgeMap.set(key, { a: a.clone(), b: b.clone() })
      })
    })

    const blocks: THREE.Mesh[] = []
    const labels: THREE.Sprite[] = []
    const labelLines: THREE.Line[] = []

    const makeLabel = (text: string) => {
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 128
      const c = canvas.getContext('2d', { willReadFrequently: false })!
      c.clearRect(0, 0, 512, 128)
      c.fillStyle = 'rgba(255, 255, 255, 0.8)'
      c.beginPath()
      c.roundRect(30, 30, 452, 68, 12)
      c.fill()
      c.fillStyle = '#1a1a2e'
      c.font = '700 32px -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif'
      c.textAlign = 'center'
      c.textBaseline = 'middle'
      c.fillText(text, 256, 64)
      const tex = new THREE.CanvasTexture(canvas)
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      return tex
    }

    const subTitles = [
      ['Background', 'Personality', 'Interests', 'Contact'],
      ['Generative Models', 'Personalization', 'Graphics & Fab', 'Visualization'],
      ['TBD1', 'TBD2', 'TBD3', 'TBD4'],
      ['Visualization', 'Artwork', 'AI Apps', 'Others'],
    ]

    triangleData.forEach(tri => {
      const geo = new THREE.BufferGeometry()
      const positions = new Float32Array([
        tri.a.x, tri.a.y, tri.a.z,
        tri.b.x, tri.b.y, tri.b.z,
        tri.c.x, tri.c.y, tri.c.z,
      ])
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geo.computeVertexNormals()

      const mat = new THREE.MeshStandardMaterial({
        color: glassColors[tri.faceIdx],
        roughness: 0.3,
        metalness: 0,
        transparent: true,
        opacity: 0.8,
        emissive: glassColors[tri.faceIdx],
        emissiveIntensity: 0.1,
        side: THREE.DoubleSide,
      })

      const mesh = new THREE.Mesh(geo, mat)
      mesh.userData = { faceIdx: tri.faceIdx, subIdx: tri.subIdx }
      tetraGroup.add(mesh)
      blocks.push(mesh)

      const cx = (tri.a.x + tri.b.x + tri.c.x) / 3
      const cy = (tri.a.y + tri.b.y + tri.c.y) / 3
      const cz = (tri.a.z + tri.b.z + tri.c.z) / 3
      const center = new THREE.Vector3(cx, cy, cz)
      const normal = new THREE.Vector3()
      const p1 = new THREE.Vector3().copy(tri.b).sub(tri.a)
      const p2 = new THREE.Vector3().copy(tri.c).sub(tri.a)
      normal.crossVectors(p1, p2).normalize()

      const labelPos = center.clone().add(normal.clone().multiplyScalar(0.6))

      const lineGeo = new THREE.BufferGeometry()
      const lineVerts = new Float32Array([
        center.x, center.y, center.z,
        labelPos.x, labelPos.y, labelPos.z,
      ])
      lineGeo.setAttribute('position', new THREE.BufferAttribute(lineVerts, 3))
      const lineMat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 })
      const line = new THREE.Line(lineGeo, lineMat)
      line.userData = { faceIdx: tri.faceIdx, subIdx: tri.subIdx }
      tetraGroup.add(line)
      labelLines.push(line)

      const title = subTitles[tri.faceIdx][tri.subIdx]
      const tex = makeLabel(title)
      const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0, depthWrite: false })
      const sprite = new THREE.Sprite(spriteMat)
      sprite.position.copy(labelPos)
      sprite.scale.set(1.2, 0.3, 1)
      sprite.userData = { faceIdx: tri.faceIdx, subIdx: tri.subIdx }
      tetraGroup.add(sprite)
      labels.push(sprite)
    })

    const borderMat = new THREE.MeshStandardMaterial({ color: 0xccccff, transparent: true, opacity: 0.15, roughness: 0.3, metalness: 0 })
    edgeMap.forEach(edge => {
      const { a, b } = edge
      const dir = new THREE.Vector3().copy(b).sub(a)
      const length = dir.length()
      if (length < 0.001) return
      const mid = new THREE.Vector3().copy(a).add(dir.clone().multiplyScalar(0.5))
      const cylGeo = new THREE.CylinderGeometry(0.025, 0.025, length, 4)
      const cyl = new THREE.Mesh(cylGeo, borderMat)
      cyl.position.copy(mid)
      const up = new THREE.Vector3(0, 1, 0)
      const quat = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize())
      cyl.quaternion.copy(quat)
      tetraGroup.add(cyl)
    })

    tetraGroup.position.x = 2
    scene.add(tetraGroup)

    const shadowCanvas = document.createElement('canvas')
    shadowCanvas.width = 128
    shadowCanvas.height = 128
    const ctx = shadowCanvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(255, 0, 85, 0.12)')
    gradient.addColorStop(0.5, 'rgba(255, 0, 85, 0.05)')
    gradient.addColorStop(1, 'rgba(255, 0, 85, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 128, 128)
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas)
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
    const shadowGeo = new THREE.PlaneGeometry(4, 4)
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat)
    shadowMesh.rotation.x = -Math.PI / 2
    shadowMesh.position.set(2, -1.4, 0)
    scene.add(shadowMesh)

    const particleCount = 50
    const particlePos = new Float32Array(particleCount * 3)
    const particleCol = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 15
      particlePos[i + 1] = (Math.random() - 0.5) * 15
      particlePos[i + 2] = (Math.random() - 0.5) * 12
      particleCol[i] = 0.8 + Math.random() * 0.2
      particleCol[i + 1] = 0.1 + Math.random() * 0.2
      particleCol[i + 2] = 0.3 + Math.random() * 0.2
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3))
    pGeo.setAttribute('color', new THREE.BufferAttribute(particleCol, 3))
    const pMat = new THREE.PointsMaterial({ size: 0.035, vertexColors: true, transparent: true, opacity: 0.18, sizeAttenuation: true, blending: THREE.AdditiveBlending })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    const glowCount = 15
    const glowPos = new Float32Array(glowCount * 3)
    const glowCol = new Float32Array(glowCount * 3)
    for (let i = 0; i < glowCount * 3; i += 3) {
      glowPos[i] = (Math.random() - 0.5) * 8
      glowPos[i + 1] = (Math.random() - 0.5) * 8
      glowPos[i + 2] = (Math.random() - 0.5) * 6
      glowCol[i] = 1
      glowCol[i + 1] = 0.2 + Math.random() * 0.2
      glowCol[i + 2] = 0.3 + Math.random() * 0.2
    }
    const gGeo = new THREE.BufferGeometry()
    gGeo.setAttribute('position', new THREE.BufferAttribute(glowPos, 3))
    gGeo.setAttribute('color', new THREE.BufferAttribute(glowCol, 3))
    const gMat = new THREE.PointsMaterial({ size: 0.3, vertexColors: true, transparent: true, opacity: 0.08, sizeAttenuation: true, blending: THREE.AdditiveBlending })
    const glowParticles = new THREE.Points(gGeo, gMat)
    scene.add(glowParticles)

    let prevMouse = { x: 0, y: 0 }
    const onMouseDown = () => {
      isDraggingRef.current = true
      autoModeRef.current = false
      setAutoPlaying(false)
      if (resumeTimerRef.current) { clearTimeout(resumeTimerRef.current); resumeTimerRef.current = null }
    }
    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        _dq.setFromEuler(new THREE.Euler((e.clientY - prevMouse.y) * 0.008, (e.clientX - prevMouse.x) * 0.008, 0))
        targetQuat.current.premultiply(_dq)
      }
      prevMouse = { x: e.clientX, y: e.clientY }
    }
    const onMouseUp = () => { isDraggingRef.current = false }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    const raycaster = new THREE.Raycaster()
    const mouse2D = new THREE.Vector2()
    const onClick = (e: MouseEvent) => {
      mouse2D.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse2D.y = -(e.clientY / window.innerHeight) * 2 + 1
      raycaster.setFromCamera(mouse2D, camera)
      const intersects = raycaster.intersectObjects(blocks)
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh
        const { faceIdx, subIdx } = hit.userData
        setActiveItem({ faceIdx, subIdx })
        autoModeRef.current = false
        setAutoPlaying(false)
        if (resumeTimerRef.current) { clearTimeout(resumeTimerRef.current); resumeTimerRef.current = null }
      }
    }
    canvas.addEventListener('click', onClick)
    canvas.addEventListener('mouseenter', () => {
      autoModeRef.current = false
      setAutoPlaying(false)
      if (resumeTimerRef.current) { clearTimeout(resumeTimerRef.current); resumeTimerRef.current = null }
    })
    canvas.addEventListener('mouseleave', () => {
      resumeTimerRef.current = setTimeout(() => { autoModeRef.current = true; setAutoPlaying(true) }, 1500)
    })

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      canvas2D.width = window.innerWidth
      canvas2D.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    let autoTimer = 0
    let autoStep = -1
    let isFirstCycle = true
    const _white = new THREE.Color(0xffffff)
    const _blockColors = glassColors.map(c => new THREE.Color(c))
    const _dq = new THREE.Quaternion()
    let _breathT = 0

    const animate = () => {
      requestAnimationFrame(animate)
      _breathT += 0.02
      if (autoModeRef.current) {
        autoTimer++
        const threshold = isFirstCycle ? 1 : 160
        if (autoTimer > threshold) {
          autoTimer = 0
          autoStep = (autoStep + 1) % sequence.length
          const next = sequence[autoStep]
          setActiveItem(next)
          if (isFirstCycle && autoStep >= 0) isFirstCycle = false
        }
        const currentFaceIdx = sequence[autoStep >= 0 ? autoStep : 0].faceIdx
        targetQuat.current.copy(faceTargetQuats[currentFaceIdx])
      }
      currentQuat.current.slerp(targetQuat.current, 0.04)
      tetraGroup.quaternion.copy(currentQuat.current)
      particles.rotation.x += 0.0001
      particles.rotation.y += 0.00015
      glowParticles.rotation.x += 0.00005
      glowParticles.rotation.y -= 0.00008

      blocks.forEach(block => {
        const mat = block.material as THREE.MeshStandardMaterial
        const isSelected = block.userData.faceIdx === activeItemRef.current.faceIdx && block.userData.subIdx === activeItemRef.current.subIdx
        const targetOpacity = isSelected ? 0.95 : 0.8
        const targetEmissive = isSelected ? 0.3 : 0.1
        mat.opacity += (targetOpacity - mat.opacity) * 0.08
        mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * 0.08
        mat.color.copy(isSelected ? _white : _blockColors[block.userData.faceIdx])
      })

      labels.forEach(sprite => {
        const isCurrentFace = sprite.userData.faceIdx === activeItemRef.current.faceIdx
        const isActive = isCurrentFace && sprite.userData.subIdx === activeItemRef.current.subIdx
        let targetOpacity = 0
        if (isCurrentFace) targetOpacity = isActive ? 1 : 0.5
        const mat = sprite.material as THREE.SpriteMaterial
        mat.opacity += (targetOpacity - mat.opacity) * 0.12
      })

      ctx2D.clearRect(0, 0, canvas2D.width, canvas2D.height)
      triangleData.forEach(tri => {
        if (tri.faceIdx !== activeItemRef.current.faceIdx) return
        const cx = (tri.a.x + tri.b.x + tri.c.x) / 3
        const cy = (tri.a.y + tri.b.y + tri.c.y) / 3
        const cz = (tri.a.z + tri.b.z + tri.c.z) / 3
        const center = new THREE.Vector3(cx, cy, cz)
        center.applyQuaternion(tetraGroup.quaternion)
        center.add(tetraGroup.position)
        const centerScreenPos = center.clone()
        centerScreenPos.project(camera)
        const centerX = (centerScreenPos.x * 0.5 + 0.5) * canvas2D.width
        const centerY = (-centerScreenPos.y * 0.5 + 0.5) * canvas2D.height
        const normal = new THREE.Vector3()
        const p1 = new THREE.Vector3().copy(tri.b).sub(tri.a)
        const p2 = new THREE.Vector3().copy(tri.c).sub(tri.a)
        normal.crossVectors(p1, p2).normalize()
        const labelPos = new THREE.Vector3(cx, cy, cz).add(normal.clone().multiplyScalar(0.6))
        labelPos.applyQuaternion(tetraGroup.quaternion)
        labelPos.add(tetraGroup.position)
        const labelScreenPos = labelPos.clone()
        labelScreenPos.project(camera)
        let labelX = (labelScreenPos.x * 0.5 + 0.5) * canvas2D.width
        let labelY = (-labelScreenPos.y * 0.5 + 0.5) * canvas2D.height
        labelX = labelX - 90
        const isActive = tri.subIdx === activeItemRef.current.subIdx
        ctx2D.globalAlpha = isActive ? 0.8 : 0.3
        ctx2D.strokeStyle = '#000000'
        ctx2D.lineWidth = 0.8
        ctx2D.setLineDash([4, 3])
        ctx2D.lineCap = 'round'
        ctx2D.lineJoin = 'round'
        ctx2D.beginPath()
        ctx2D.moveTo(centerX + 20, centerY)
        ctx2D.lineTo(labelX, centerY)
        ctx2D.lineTo(labelX, labelY)
        ctx2D.stroke()
        ctx2D.setLineDash([])
      })
      ctx2D.globalAlpha = 1

      const breathe = Math.sin(_breathT) * 0.02 + 1
      shadowMesh.scale.setScalar(breathe)
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('click', onClick)
      window.removeEventListener('resize', handleResize)
      canvas2D.remove()
      renderer.dispose()
    }
  }, [])

  const displaySection = SECTIONS[displayItem.faceIdx]
  const displaySubItem = displaySection.items[displayItem.subIdx]

  return (
    <main className="main-container">
      <canvas ref={canvasRef} className="canvas" />
      <div className="content-panel">
        <div className="panel-header">
          <div className="section-title" style={{ color: displaySection.color }}>
            {displaySection.label}
          </div>
          {displayItem.faceIdx === 0 && (
            <div className="name-title">
              {"Shengqi Dang".split('').map((char, i) => {
                const colors = ['#FF0055', '#FF0055', '#FF0055', '#FF0055']
                return <span key={i} style={{ color: colors[i % 4], opacity: 0.7 }}>{char === ' ' ? '\u00A0' : char}</span>
              })}
            </div>
          )}
        </div>
        <div className={`panel-content ${animPhase === 'out' ? 'slide-out' : ''}`}>
          {animPhase !== 'out' && (
            <div key={`${displayItem.faceIdx}-${displayItem.subIdx}`} className="content-slide">
              <div className="item-desc" dangerouslySetInnerHTML={{ __html: displaySubItem.content }} />
            </div>
          )}
        </div>
      </div>
      <div className="cursor-dot" style={{ left: mouse.x - 5, top: mouse.y - 5, background: displaySection.color }} />
      {autoPlaying && <div className="auto-badge">AUTO</div>}
    </main>
  )
}

export default App
