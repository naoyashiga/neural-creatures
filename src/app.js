const THREE = require('three')

import synaptic from 'synaptic'

import Stats from 'stats.js'
import dat from 'dat-gui'

import PointCloud from './components/PointCloud'
import Line from './components/Line'

const OrbitControls = require('three-orbit-controls')(THREE)

class Viz {
  constructor() {






    this.w = window.innerWidth
    this.h = window.innerHeight
    this.particleCount = 1
    this.maxParticleCount = 1
    this.particles = []
    this.r = 800

    this.world = {
      width: this.r,
      height: this.r,
      depth: this.r
    }

    this.group = new THREE.Group()

    this.effectController = {
      showDots: true,
      // showLines: true,
      minDistance: 100,
      maxConnections: 20,
      particleCount: 500
    }


    this.camera = new THREE.PerspectiveCamera(45, this.w / this.h, 1, 4000)
    this.camera.position.z = 1750

    this.controls = new OrbitControls(this.camera, document.body)

    this.scene = new THREE.Scene()
    this.scene.add(this.group)

    this.pointCloud = new PointCloud(this.maxParticleCount, this.world)
    this.particles = this.pointCloud.getParticles(this.particles)
    this.pointCloud.setup()

    // this.line = new Line(this.maxParticleCount)

    this.addToGroup()

    this.renderer = new THREE.WebGLRenderer({antialias: true})
    this.addRenderer()

    this.initGUI()

    this.stats = new Stats()
    this.addStats()

    this.addResize()
  }

  initGUI() {

    const gui = new dat.GUI()

    gui.add(this.effectController, "showDots").onChange((value) => { this.pointCloud.cloud.visible = value; })

    // gui.add(this.effectController, "showLines" ).onChange((value) => { this.line.mesh.visible = value; })

    gui.add(this.effectController, "minDistance", 10, 300 )
    gui.add(this.effectController, "maxConnections", 0, 30, 1)

    gui.add(this.effectController, "particleCount", 0, this.maxParticleCount, 1).onChange((value) => {

      this.particleCount = parseInt(value)
      this.pointCloud.particles.setDrawRange(0, this.particleCount)

    })
  }

  onWindowResize() {
    const currentScreen = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    this.camera.aspect = currentScreen.width / currentScreen.height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(currentScreen.width, currentScreen.height)
  }

  createBoxHelper() {
    const helper = new THREE.BoxHelper(new THREE.Mesh(new THREE.BoxGeometry(this.r, this.r, this.r)))
    helper.material.color.setHex(0x080808)
    helper.material.blending = THREE.AdditiveBlending
    helper.material.transparent = true

    return helper
  }

  addToGroup() {
    this.group.add(this.createBoxHelper())
    this.group.add(this.pointCloud.cloud)
    // this.group.add(this.line.mesh)
  }

  addRenderer() {
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.w, this.h)

    this.renderer.gammaInput = true
    this.renderer.gammaOutput = true
    document.body.appendChild(this.renderer.domElement)
  }

  addStats() {
    document.body.appendChild(this.stats.dom)
  }

  addResize() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
  }



  animate() {

    let vertexpos = 0;
    let colorpos = 0;
    let numConnected = 0;

    this.particles.forEach((p) => {
      p.numConnections = 0
    })

    for(let i = 0; i < this.particleCount; i++) {

      const p = this.particles[i]

      let input = []

      this.particles.forEach((q) => {
        input.push(q.location.x)
        input.push(q.location.y)
        input.push(q.velocity.x)
        input.push(q.velocity.y)
      })

      let output = p.network.activate(input)
      p.moveTo(output)
      console.log(output);

      p.update()

      this.pointCloud.positions[i * 3] = p.location.x
      this.pointCloud.positions[i * 3 + 1] = p.location.y
      // this.pointCloud.positions[i * 3 + 2] = 0
      this.pointCloud.positions[i * 3 + 2] = p.location.z
      // this.pointCloud.positions[i * 3 + 2] = p.location.z

      p.borders()

      if (p.numConnections >= this.effectController.maxConnections ) {
        continue
      }

      for (let j = i + 1; j < this.particleCount; j++ ) {

        const q = this.particles[j]

        if (q.numConnections >= this.effectController.maxConnections) {
          continue
        }

        const dist = p.location.distanceTo(q.location)

        if (dist < this.effectController.minDistance) {

          p.numConnections++
          q.numConnections++

          let alpha = 1.0 - dist / this.effectController.minDistance

          // this.line.update(vertexpos, colorpos, alpha, p, q, i, j)

          vertexpos += 6
          colorpos += 6

          numConnected++
        }
      }
    }


    // this.line.mesh.geometry.setDrawRange(0, numConnected * 2)
    // this.line.mesh.geometry.attributes.position.needsUpdate = true
    // this.line.mesh.geometry.attributes.color.needsUpdate = true

    this.pointCloud.cloud.geometry.attributes.position.needsUpdate = true

    requestAnimationFrame(this.animate.bind(this))

    this.stats.update()
    this.render()

  }

  render() {
    const time = Date.now() * 0.001

    // this.group.rotation.y = time * 0.1
    this.renderer.render(this.scene, this.camera)
  }
}

let viz = new Viz()

viz.animate()
