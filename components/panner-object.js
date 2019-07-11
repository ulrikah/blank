const Tone = require('tone')

AFRAME.registerComponent('panner-object', {
  init: function () {
		this.camera = document.querySelector('a-camera')
  	this.pos = new THREE.Vector3();
  	this.panner = this.data.panner;
  },

  tick: function () {
  	this.updateDelta()
  	diff = { 
  		x: this.camera.object3D.position.x - this.pos.x,
  		y: this.camera.object3D.position.y - this.pos.y,
  		z: this.camera.object3D.position.z - this.pos.z,
  	}
  	this.panner.setPosition(diff.x, diff.y, diff.z)
  },

  updateDelta: function () {
    this.el.object3D.updateMatrixWorld();
    this.pos.setFromMatrixPosition(this.el.object3D.matrixWorld);
  }

});