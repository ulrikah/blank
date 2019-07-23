const Tone = require('tone');
const ballroom = require('../instruments/ballroom.js')
const fn = require('../functions/functions.js')

const monoSynth = ballroom.monoSynth;
const polySynth = ballroom.polySynth;

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
  	this.synth.chain(pingPong, reverb, delay, filterHigh, distortion, Tone.Master);
  	this.notes = ['C3', 'E3', 'G3'];
  	this.vel = 0.5;
  	this.ctrl = new Tone.CtrlPattern(this.notes, Tone.CtrlPattern.Type.AlternateUp);

		this.collide = this.collide.bind(this)
		this.isValidTarget = this.isValidTarget.bind(this)

		el.addEventListener('collide', this.collide);
  },

  collide: function(e) {
  	if (this.isValidTarget(e.detail.body.el.classList))
		{
			let vel = e.detail.target.velocity.length() // euc length from origo
			vel = THREE.Math.mapLinear(vel, 1, 5, 0, 1)
			vel = THREE.Math.clamp(vel, 0, 1);
			this.vel = vel;

			const note = this.ctrl.next()
  		this.synth.triggerAttackRelease(note, "8n", Tone.now(), this.vel);
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
		    return polySynth;
		}
  }
});