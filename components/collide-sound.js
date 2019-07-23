const Tone = require('tone');
const ballroom = require('../instruments/ballroom.js')
const fn = require('../functions/functions.js')

const monoSynth = ballroom.monoSynth;
const polySynth = ballroom.polySynth;

// wrappers around the synth objects
const PolySynthWrapper = ballroom.PolySynthWrapper;
const BasicSynthWrapper = ballroom.BasicSynthWrapper;

const filterHigh = ballroom.filterHigh;
const phaser = ballroom.phaser;
const delay = ballroom.delay;
const pingPong = ballroom.pingPong;
const distortion = ballroom.distortion;
const reverb = ballroom.reverb;

AFRAME.registerComponent('collide-sound', {
	schema: {
		target: { type: 'string', default: 'wall'},
		source: { type: 'string', default: 'polySynth'}
	},

  init: function () {
  	const el = this.el
  	this.synth = this.chooseInstrument();
  	this.synth.synth.chain(reverb, delay, filterHigh, distortion, pingPong, Tone.Master);

		this.collide = this.collide.bind(this)
		this.isValidTarget = this.isValidTarget.bind(this)

		el.addEventListener('collide', this.collide);
  },

  collide: function(e) {
  	if (this.isValidTarget(e.detail.body.el.classList))
		{
			const y = e.detail.target.position.y;

			let vel = e.detail.target.velocity.length() // euc length from origo
			vel = THREE.Math.mapLinear(vel, 1, 5, 0, 1)
			vel = THREE.Math.clamp(vel, 0, 1);

  		this.synth.collide("C2", "8n", Tone.now(), vel, y);
		}
  },

	// check to see if collision target was of the desired class
  isValidTarget: function(targetClass) {
  	return targetClass.contains(this.data.target)
  },

  chooseInstrument: function() {
  	switch(this.data.source) {
		  case "polySynth":
		    return new PolySynthWrapper(polySynth);
		    break;
		  case "monoSynth":
		  	return new BasicSynthWrapper(monoSynth);
		    break;
		  default:
		    return new PolySynthWrapper(polySynth);
		}
  }
});