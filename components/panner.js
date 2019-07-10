const Tone = require('tone');

AFRAME.registerComponent('panner', {
	
  init: function () {
		this.panner = new Tone.Panner3D(0, 0, 0).toMaster()
		this.player = new Tone.Player("../assets/100bpm_luftig.mp3")
		this.player.autostart = true;
		this.player.connect(this.panner).sync().start(0)
  	
  	this.camera = document.querySelector('a-camera')
  	this.i = 0;
  	console.log(this.el);

  	this.pos = new THREE.Vector3();
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