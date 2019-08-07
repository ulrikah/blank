const Tone = require('tone');
const teoria = require('teoria');
const fn = require('../functions/functions.js');
const cylinderSynth = require('../instruments/cylinder.js');

AFRAME.registerSystem('synth', {
  init: function () {
    this.entities = [];
    this.scale = teoria.note('a2').scale('phrygian');
    this.phaser = cylinderSynth.phaser;
    this.pingPong = cylinderSynth.pingPong
    this.synth = cylinderSynth.synth;

    this.synth.chain(this.phaser, this.pingPong, Tone.Master)

    Tone.Transport.scheduleRepeat(() => {
    	for (let i = 0; i < this.entities.length; i ++)
    	{
    		const entity = this.entities[i];
    		const source = entity.getAttribute('synth').source;
	    	const h = this.entities[i].getAttribute('height');
    		
    		if (source === "oscillator") {
    			const idx = Math.round(fn.map(h, 0.5, 3, 0, this.scale.scale.length-1, true));
		    	const note = this.scale.get(idx).toString()
		    	this.synth.triggerAttackRelease(note, '32n', Tone.Time('+8n') + Tone.Time('8n') * i)
    		} 

    		else if (source === "phaser") {
    			const f = Math.round(fn.map(h, 0.5, 3, 0.1, 15))
    			const o = Math.round(fn.map(h, 0.5, 3, 1, 5))
    			this.phaser.frequency = f;
    			this.phaser.octaves = o;
    		} 

    		else if (source === "detune") {
    			const amount = Math.round(fn.map(h, 0.5, 3, -400, 400))
    			this.synth.set('detune', amount);
    		}

    		else if (source === "pingPong") {
    			const delayTime = fn.map(h, 0.5, 3, Tone.Time('64n').toSeconds(), Tone.Time('4n').toSeconds(), true)	
    			const feedback = fn.map(h, 0.5, 3, 0, 0.5, true)
    			this.pingPong.delayTime.value = delayTime;
    			this.pingPong.feedback.value = feedback;
    		} 

    		else if (source === "volume") {
    			let volume = -100
    			if (h > 0.5){
    				volume = Math.round(fn.map(h, 0.51, 3, -32, -8, true))
    			}
    			this.synth.volume.value = volume;
    		}
    	}
    }, '1m')
  },

  registerMe: function (el) {
    this.entities.push(el);
  },

  unregisterMe: function (el) {
    var index = this.entities.indexOf(el);
    this.entities.splice(index, 1);
  }
});