const Tone = require('tone');
const fn = require('../functions/functions.js');

AFRAME.registerSystem('synth', {
  init: function () {
    this.entities = [];

    this.polySynth = new Tone.PolySynth(6, Tone.FMSynth);
    this.filter = new Tone.Filter();
    this.phaser = new Tone.Phaser();
    
    this.polySynth.chain(this.filter, this.phaser, Tone.Master);

    Tone.Transport.scheduleRepeat(() => {
    	for (let i = 0; i < this.entities.length; i ++)
    	{
    		const entity = this.entities[i];
    		const source = entity.getAttribute('synth').source;
	    	const h = this.entities[i].getAttribute('height');
    		
    		if (source === "oscillator") {
		    	const f = Math.round(fn.map(h, 0.5, 1.5, 110, 440, true))
		    	this.polySynth.triggerAttackRelease(f, '32n', Tone.Time('+8n') + Tone.Time('8n') * i)
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