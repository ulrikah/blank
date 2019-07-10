const Tone = require('tone');

AFRAME.registerComponent('panner', {
	
  init: function () {
  	this.camera = document.querySelector('a-camera')
  	this.pos = new THREE.Vector3();

  	// Tone
		this.panner = new Tone.Panner3D(
			{
				positionX  : 0 ,
				positionY  : 0 ,
				positionZ  : 0 ,
				maxDistance  : 100 ,
				rolloffFactor  : 0.5
			}
		).toMaster()

		this.player = new Tone.Player("../assets/100bpm_luftig.mp3")
		this.player.autostart = true;
		this.player.volume.value = -6;
		this.player.connect(this.panner).sync()
  	
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