const THREE = require('three')


export default class Particle {
  constructor() {
    this.radius = 800

    this.location = new THREE.Vector3(
       Math.random() * this.radius - this.radius / 2,
       Math.random() * this.radius - this.radius / 2,
       Math.random() * this.radius - this.radius / 2
    )

    this.velocity = new THREE.Vector3( -1 + Math.random() * 2, -1 + Math.random() * 2,  -1 + Math.random() * 2 )

    this.numConnections = 0

  }

  update() {
    this.location.add(this.velocity)
  }

  borders() {
    const rHalf = this.radius / 2
    if (this.location.y < -rHalf || this.location.y > rHalf ) {
      this.velocity.y *= -1
    }

    if (this.location.x < -rHalf || this.location.x > rHalf ) {
      this.velocity.x *= -1
    }

    if (this.location.z < -rHalf || this.location.z > rHalf ) {
      this.velocity.z *= -1
    }

  }
}
