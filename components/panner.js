const Tone = require('tone');

const panner = new Tone.Panner3D(10, 0, 0).toMaster();
const player = new Tone.Player("../assets/100bpm_luftig.mp3")
player.connect(panner).sync()
player.autostart = true

AFRAME.registerComponent('panner', {
	
  init: function () {
  	player.start(0)
  	this.pos = new THREE.Vector3();
  },

  tick: function () {
  	this.updateDelta()
  	panner.setPosition(-this.pos.x, this.pos.y, this.pos.z) // Tone and THREE operates with inverse x-pos

  },

  updateDelta: function () {
    this.el.object3D.updateMatrixWorld();
    this.pos.setFromMatrixPosition(this.el.object3D.matrixWorld);
  }

});