const Tone = require('tone')
const fn = require('../functions/functions.js')

AFRAME.registerComponent('synth', {
  init: function () {

		this.reverb = new Tone.Reverb();
		this.reverb.generate().then( () => console.log("Reverb generated"))

		this.filterHigh = new Tone.Filter({
				type  : "highpass" ,
				frequency  : 20 ,
				rolloff  : -12 ,
				Q  : 1 ,
				gain  : 0
		});

		this.phaser = new Tone.Phaser({
			"frequency" : 2,
			"octaves" : 2,
			"baseFrequency" : 200
		});

		this.delay = new Tone.PingPongDelay({
			"delayTime" : "8n",
			"feedback" : 0.6,
			"wet" : 0.3
		})

		this.distortion = new Tone.Distortion();
		this.distortion.wet.value = 0.2;

		const synth = new Tone.PolySynth(4, Tone.Synth);
		synth.set('detune', -20)

		synth.set( { 
			"oscillator" : {
				"type" : "fattriangle",
				"modulationType": "am",
				"modulationFrequency" : 1,
				"partials": [	0.8, 0.6, 0.4, 0.1, 0.02, 0, 0.01, 0, 
											0, 0.05, 0, 0.2, 0, 0, 0.05, 0,
											0, 0, 0, 0.2, 0, 0, 0.05, 0,
											0, 0.02, 0, 0.2, 0, 0, 0, 0
										]
			},
			"envelope" : {
				"attack" : 0.06,
				"decay" : 0.1,
				"sustain" : 0.2,
				"release" : 0.9,
			}
		})

		synth.chain(this.reverb, this.delay, this.filterHigh, this.distortion, Tone.Master);

		const notes = ["C3", "E3", "G3"]
		ctrl = new Tone.CtrlPattern(notes, Tone.CtrlPattern.Type.AlternateUp)

		let note = ctrl.next();
		var loop = new Tone.Transport.scheduleRepeat(function(time){

			if (Math.random() < 0.1)
			{
				note = Tone.Frequency(note).transpose(fn.randomInt(-3, 3))
			}

			else {
				note = ctrl.next()
			}

			if (Math.random() < 0.2)
			{
				synth.triggerAttackRelease(Tone.Frequency(note).transpose(12), "8n", time)
			}

			if (Math.random() > 0.9)
			{
				synth.triggerAttackRelease(Tone.Frequency(note).transpose(24), "8n", time) 
			}
			synth.triggerAttackRelease(note, "8n", time)	
		}, "8n")

		loop.start(0)

	}
});