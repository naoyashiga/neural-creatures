const THREE = require('three')
import synaptic from 'synaptic'


export default class Creature {
  constructor(world) {
    this.network = new synaptic.Architect.Perceptron(4, 3, 3)
    // this.network = new synaptic.Architect.Perceptron(40, 25, 3)
    this.world = world

    this.mass = .3;
    this.maxspeed = 2;
    this.maxforce = .2;
    this.lookRange = this.mass * 200;
    this.length = this.mass * 10;
    this.base = this.length * .5;


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
    this.velocity.add(this.acceleration)
    this.location.add(this.velocity)
    this.acceleration.multiplyScalar(0)
  }

  applyForce(force) {
    this.acceleration.add(force)
  }

  setAngle(v, theta) {
    return new THREE.Vector3(
      v.length() * Math.cos(theta),
      v.length() * Math.sin(theta),
      0)
  }

  moveTo(networkOutput) {
    let force = new THREE.Vector3(0, 0, 0)

    let target = new THREE.Vector3(
      networkOutput[0] * this.world.width - this.world.width / 2,
      networkOutput[1] * this.world.height - this.world.height / 2,
      0
    )

    let angle = networkOutput[2] * Math.PI * 2 - Math.PI

    // force = target
    // console.log(force);
    // console.log(target);

    this.applyForce(force)

  }

  separate(neighbors) {
    let sum = new THREE.Vector3(0, 0, 0)
    let count = 0

    neighbors.forEach((neighbor, i) => {
      if(neighbor != this) {
        let d = this.location.distanceTo(neighbor)

        if(d < 24 && d >0) {
          let diff = this.location.clone().sub(neighbor.location)
          diff.normalize()
          diff.divideScalar(d)
          sum.add(diff)
          count++
        }
      }
    })

    if(!count) {
      return sum
    }

    sum.divideScalar(count)
    sum.normalize()
    sum.multiplyScalar(this.maxspeed)
    sum.sub(this.velocity)
    sum = this.limit(sum, this.maxforce)
    sum.multiplyScalar(2)

    return sum
  }

  limit(v, max) {
    if(v.length() > max) {
      v.setLength(max)
    }

    return v
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
