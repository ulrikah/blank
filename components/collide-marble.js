const Tone = require('tone');
const teoria = require('teoria');
const marble = require('../instruments/marble.js')
const fn = require('../functions/functions.js')

const a4 = teoria.note('a4');
const scale = a4.scale('mixolydian').simple();

const MarbleSynth = marble.MarbleSynth;

// wrappers around the synth objects
const MarbleSynthWrapper = marble.MarbleSynthWrapper;


AFRAME.registerComponent('collide-marble', {
	schema: {
		target: { type: 'string', default: 'wall'},
		source: { type: 'string', default: 'polySynth'}
	},

  init: function () {
  	const el = this.el
  	this.synth = this.chooseInstrument();
  	this.synth.synth.chain(Tone.Master)
  	this.note = teoria.note(scale[fn.randomInt(0, scale.length-1)]).fq()
  	console.log(this.note)
		this.collide = this.collide.bind(this)
		this.isValidTarget = this.isValidTarget.bind(this)

		el.addEventListener('collide', this.collide);
  },

  collide: function(e) {
  	if (this.isValidTarget(e.detail.body.el.classList))
		{
  		this.synth.collide(this.note, "8n", Tone.now());
		}
  },

	// check to see if collision target was of the desired class
  isValidTarget: function(targetClass) {
  	return targetClass.contains(this.data.target)
  },

  chooseInstrument: function() {
  	switch(this.data.source) {
		  case "marble":
		    return new MarbleSynthWrapper(MarbleSynth, true);
		    break;
		  default:
		    return new MarbleSynthWrapper(MarbleSynth, true);
		}
  }
});