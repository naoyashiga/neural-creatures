const THREE = require('three')
import Particle from './Particle'

export default class PointCloud {
  constructor(maxParticleCount) {

    this.maxParticleCount = maxParticleCount

    this.positions = new Float32Array(maxParticleCount * 3)
    this.particles = new THREE.BufferGeometry()

    this.material = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 3,
      blending: THREE.AdditiveBlending,
      transparent: true,
      sizeAttenuation: false
    })

    this.cloud = new THREE.Points(this.particles, this.material)

  }

  setup() {
    const particleCount = 300
    this.particles.setDrawRange(0, particleCount)
    this.particles.addAttribute('position', new THREE.BufferAttribute(this.positions, 3).setDynamic(true))
  }

  getParticles(particles) {
    for (let i = 0; i < this.maxParticleCount; i++) {
      const p = new Particle()

      this.positions[i * 3] = p.location.x
      this.positions[i * 3 + 1] = p.location.y
      this.positions[i * 3 + 2] = p.location.z

      particles.push(p)
    }

    return particles

  }


}
