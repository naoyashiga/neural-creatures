const THREE = require('three')

export default class Line {
  constructor(maxParticleCount) {

    const segments = maxParticleCount * maxParticleCount

    this.positions = new Float32Array(segments * 3)
    this.colors = new Float32Array(segments * 3)

    this.material = new THREE.LineBasicMaterial({
      vertexColors: THREE.VertexColors,
      blending: THREE.AdditiveBlending,
      transparent: true
    })

    this.geometry = new THREE.BufferGeometry()

    this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3).setDynamic(true))
    this.geometry.addAttribute('color', new THREE.BufferAttribute(this.colors, 3).setDynamic(true))

    this.geometry.computeBoundingSphere()

    this.geometry.setDrawRange(0, 0)

    this.mesh = new THREE.LineSegments(this.geometry, this.material)


  }

  update(vertexpos, colorpos, alpha, p, q, i, j) {

    this.positions[vertexpos++] = p.location.x
    this.positions[vertexpos++] = p.location.y
    this.positions[vertexpos++] = p.location.y
    // this.positions[vertexpos++] = p.location.z

    this.positions[vertexpos++] = q.location.x
    this.positions[vertexpos++] = q.location.y
    this.positions[vertexpos++] = q.location.y
    // this.positions[vertexpos++] = q.location.z

    this.colors[colorpos++] = alpha
    this.colors[colorpos++] = alpha
    this.colors[colorpos++] = alpha

    this.colors[colorpos++] = alpha
    this.colors[colorpos++] = alpha
    this.colors[colorpos++] = alpha

  }

}
