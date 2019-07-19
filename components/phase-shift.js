// HTC Vive specific comp
// Grabbed from: https://wmurphyrd.github.io/aframe-super-hands-component/examples/physics/

AFRAME.registerComponent('phase-shift', {
  init: function () {
    var el = this.el
    el.addEventListener('gripdown', function () {
      el.setAttribute('collision-filter', {collisionForces: true})
    })
    el.addEventListener('gripup', function () {
      el.setAttribute('collision-filter', {collisionForces: false})
    })
  }
})