const Tone = require('tone');

const synth = require('../instruments/synth.js').synth;
synth.toMaster();

AFRAME.registerComponent('collide-sound', {
	
  init: function () {
  	const el = this.el
  	this.height = el.getAttribute('geometry').height; // assuming position.y === 0;
		this.maxVel = 1;
		this.minVel = 0;
		this.scale = ['Eb2','F2','G2','Ab2','Bb2','C3','D3','Eb3'] // Eb major scale
		this.triggerSound = this.triggerSound.bind(this)
		el.addEventListener('collide', this.triggerSound);
  },

  triggerSound: function(e) {
  	const y = e.detail.body.position.y;
  	const i = Math.round(THREE.Math.mapLinear(y, 0, this.height, 0, this.scale.length));
  	const note = this.scale[i];

		let vel = e.detail.body.velocity.length() // euc length from origo
		vel = THREE.Math.mapLinear(vel, 1, 5, this.minVel, this.maxVel)
		vel = THREE.Math.clamp(vel, this.minVel, this.maxVel);
		
		synth.triggerAttackRelease(note, "8n", Tone.now(), vel);
  },
});