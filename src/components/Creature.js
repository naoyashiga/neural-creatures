const THREE = require('three')
import synaptic from 'synaptic'


export default class Creature {
  constructor(world) {
    this.network = new synaptic.Architect.Perceptron(4, 3, 3)
    this.world = world


    this.location = new THREE.Vector3(
      Math.random() * this.world.width - this.world.width / 2,
      Math.random() * this.world.height - this.world.height / 2,
      0
    )
    this.velocity = new THREE.Vector3(Math.random() * 10, Math.random() * 10, 0)
    this.acceleration = new THREE.Vector3(0, 0, 0)

    this.numConnections = 0
  }

  update() {
    this.location.add(this.velocity)
  }

  borders() {
    const rHalf = this.world.width / 2
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
