const Tone = require('tone');

const monoSynth = require('../instruments/ballroom.js').monoSynth;
const polySynth = require('../instruments/ballroom.js').polySynth;

AFRAME.registerComponent('collide-sound', {
	schema: {
		target: { type: 'string', default: 'wall'},
		source: { type: 'string', default: 'monoSynth'}
	},

  init: function () {
  	const el = this.el
  	this.synth = this.chooseInstrument();
  	this.synth.toMaster();
		this.triggerSound = this.triggerSound.bind(this)
		this.isValidTarget = this.isValidTarget.bind(this)

		el.addEventListener('collide', this.triggerSound);
  },

  triggerSound: function(e) {
  	if (this.isValidTarget(e.detail.body.el.classList))
		{
			let vel = e.detail.target.velocity.length() // euc length from origo
			vel = THREE.Math.mapLinear(vel, 1, 5, 0, 1)
			vel = THREE.Math.clamp(vel, 0, 1);
			this.synth.triggerAttackRelease("C2", "8n", Tone.now(), vel);
		}
  },

	// check to see if collision target was of the desired class
  isValidTarget: function(targetClass) {
  	return targetClass.contains(this.data.target)
  },

  chooseInstrument: function() {
  	switch(this.data.source) {
		  case "polySynth":
		    return polySynth;
		    break;
		  case "monoSynth":
		  	return monoSynth;
		    break;
		  default:
		    return monoSynth;
		}
  }
});