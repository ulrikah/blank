const Tone = require('tone');
const noiseSynth = new Tone.MembraneSynth().toMaster();

AFRAME.registerComponent('collide-sound', {
	
  init: function () {
  	noiseSynth.volume.value = -10;
		this.maxVel = 1;
		this.minVel = 0;
		this.triggerSound = this.triggerSound.bind(this)
		this.el.addEventListener('collide', this.triggerSound);
  },

  triggerSound: function(e) {
		let vel = e.detail.body.velocity.length() // euc length from origo
		vel = THREE.Math.mapLinear(vel, 1, 5, this.minVel, this.maxVel)
		vel = THREE.Math.clamp(vel, this.minVel, this.maxVel);
		noiseSynth.triggerAttackRelease("C2", "8n", Tone.now(), vel);
  }
});