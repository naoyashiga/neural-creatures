const THREE = require('three')
import synaptic from 'synaptic'


export default class Creature {
  constructor(world) {
    // this.network = new synaptic.Architect.Perceptron(4, 3, 3)
    this.network = new synaptic.Architect.Perceptron(60, 20, 3)
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
      Math.random() * this.world.depth - this.world.depth / 2
    )
    this.velocity = new THREE.Vector3(Math.random(), Math.random(), Math.random())
    this.acceleration = new THREE.Vector3(0, 0, 0)

    this.numConnections = 0
  }

  update() {
    this.velocity.add(this.acceleration)
    this.velocity = this.limit(this.velocity, this.maxspeed)

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
      networkOutput[0] * this.world.width,
      networkOutput[1] * this.world.height,
      0
    )

    let angle = networkOutput[2] * Math.PI * 2 - Math.PI

    let separation = this.separate(this.world.creatures)
    let alignment = this.setAngle(this.align(this.world.creatures), angle)
    let cohesion = this.seek(target)

    force.add(separation)
    force.add(alignment)
    force.add(cohesion)

    this.applyForce(force)
  }

  seek(target) {
    let seek = target.clone().sub(this.location)
    seek.normalize()
    seek.multiplyScalar(this.maxspeed)
    seek.sub(this.velocity)
    return this.limit(seek, 0.3)
  }

  separate(neighbors) {
    let sum = new THREE.Vector3(0, 0, 0)
    let count = 0

    neighbors.forEach((neighbor) => {
      if(neighbor != this) {
        let d = this.location.distanceTo(neighbor.location)

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

  align(neighbors) {
    let sum = new THREE.Vector3(0, 0, 0)
    let count = 0

    neighbors.forEach((neighbor, i) => {
      if(neighbor != this) {
        sum.add(neighbor.velocity)
        count++
      }
    })

    sum.divideScalar(count)
    sum.normalize()
    sum.multiplyScalar(this.maxspeed)

    sum = this.limit(sum.sub(this.velocity), this.maxspeed)

    return this.limit(sum, 0.1)
  }

  cohesion(neighbors) {
    let sum = new THREE.Vector3(0, 0, 0)
    let count = 0

    neighbors.forEach((neighbor, i) => {
      if(neighbor != this) {
        sum.add(neighbor.location)
        count++
      }
    })

    return sum.divideScalar(count)
  }


  limit(v, max) {
    if(v.length() > max) {
      v.setLength(max)
    }

    return v
  }

  borders() {
    const rHalf = this.world.width / 2
    if (this.location.x < -rHalf) {
      this.applyForce(new THREE.Vector3(this.maxforce * 2, 0, 0))
    }

    if (this.location.x > rHalf ) {
      this.applyForce(new THREE.Vector3(-this.maxforce * 2, 0, 0))
    }

    if (this.location.y < -rHalf) {
      this.applyForce(new THREE.Vector3(0, this.maxforce * 2, 0))
    }

    if (this.location.y > rHalf ) {
      this.applyForce(new THREE.Vector3(0, -this.maxforce * 2, 0))
    }

    // if (this.location.y < -rHalf || this.location.y > rHalf ) {
    //   this.velocity.y *= -1
    // }
    //
    // if (this.location.x < -rHalf || this.location.x > rHalf ) {
    //   this.velocity.x *= -1
    // }

    // if (this.location.z < -rHalf || this.location.z > rHalf ) {
    //   this.velocity.z *= -1
    // }
  }
}
