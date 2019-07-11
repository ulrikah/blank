const Tone = require('tone');

AFRAME.registerComponent('panner', {
	
  init: function () {
		this.FOLDER = "../assets/100bpm_luftig/"
		this.TRACKS = ["bass.mp3", "drums1.mp3", "drums2.mp3", "ice1.mp3", "ice2.mp3", "sfx1.mp3", "sfx2.mp3", "sfx3.mp3"]
  	
		this.camera = document.querySelector('a-camera')
  	this.pos = new THREE.Vector3();

		this.panner = new Tone.Panner3D(
			{
				positionX  : 0 ,
				positionY  : 0 ,
				positionZ  : 0 ,
				maxDistance  : 100 ,
				rolloffFactor  : 0.5
			}
		).toMaster()

		this.TRACKS.forEach( (t) => {
			const player = new Tone.Player()
			player.load(this.FOLDER + t, () => {
				Tone.Transport.schedule( () => {
					player.start(0)
				}, '8n');
			});
			player.volume.value = -6;
			player.connect(this.panner)
			player.sync()
		});
  	
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