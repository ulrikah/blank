const Tone = require('tone');
const fn = require('../functions/functions.js');

AFRAME.registerSystem('synth', {
  init: function () {
    this.entities = [];
  },

  synthItUp: function () {
  	Tone.Transport.stop()
    this.polySynth = new Tone.PolySynth(6, Tone.FMSynth);
    this.filter = new Tone.Filter();
    this.phaser = new Tone.Phaser();
    
    this.polySynth.chain(this.filter, this.phaser, Tone.Master);

    const loop = new Tone.Loop( (time) => {
    	for (let i = 0; i < this.entities.length; i ++)
    	{
    		const source = this.entities[i].getAttribute('synth').source;
	    	const h = this.entities[i].getAttribute('height');
    		
    		if (source === "oscillator") {
		    	const f = Math.round(fn.map(h, 0.5, 1.5, 110, 440, true))
		    	this.polySynth.triggerAttackRelease(f, '32n')
    
    		} else if (source === "phaser") {
    			const f = Math.round(fn.map(h, 0.5, 1.5, 0.1, 15))
    			const o = Math.round(fn.map(h, 0.5, 1.5, 1, 5))
    			this.phaser.frequency = f;
    			this.phaser.octaves = o;
    		} else if (source === "detune") {
    			const amount = Math.round(fn.map(h, 0.5, 1.5, -400, 400))
    			this.polySynth.set('detune', amount);
    		} else if (source === "volume") {
    			let volume = -100
    			if (h > 0.5){
    				volume = Math.round(fn.map(h, 0.51, 1.5, -32, 0, true))
    			}
    			this.polySynth.volume.value = volume;
    		}
    	}
    }, '8n').start(0);
  },

  registerMe: function (el) {
    this.entities.push(el);
    const source = el.getAttribute('synth').source
    if (source === "oscillator")
    {
    	this.synthItUp();
    }
  },

  unregisterMe: function (el) {
    var index = this.entities.indexOf(el);
    this.entities.splice(index, 1);
  }
});