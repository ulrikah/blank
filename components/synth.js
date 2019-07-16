const Tone = require('tone')

AFRAME.registerComponent('synth', {
  init: function () {
		var reverb = new Tone.Reverb();
		reverb.generate().then( () => console.log("Reverb generated"))

		var filterHigh = new Tone.Filter({
				type  : "highpass" ,
				frequency  : 20 ,
				rolloff  : -12 ,
				Q  : 1 ,
				gain  : 0
		});

		var filterLow = new Tone.Filter({
				type  : "lowpass" ,
				frequency  : 20 ,
				rolloff  : -12 ,
				Q  : 1 ,
				gain  : 0
		})

		var phaser = new Tone.Phaser({
			"frequency" : 2,
			"octaves" : 2,
			"baseFrequency" : 200
		});

		var delay = new Tone.PingPongDelay({
			"delayTime" : "8n",
			"feedback" : 0.6,
			"wet" : 0.3
		})

		var distortion = new Tone.Distortion();
		distortion.wet.value = 0.2;

		var synth = new Tone.PolySynth(4, Tone.Synth);
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

		synth.chain(reverb, delay, filterHigh, distortion, Tone.Master);

		const notes = ["C3", "E3", "G3"]
		ctrl = new Tone.CtrlPattern(notes, Tone.CtrlPattern.Type.AlternateUp)

		let note = ctrl.next();
		var loop = new Tone.Loop(function(time){
			// synth.triggerAttackRelease(notes[Math.floor(Math.random()*notes.length)], "2n", time)

			if (Math.random() < 0.1)
			{
				note = Tone.Frequency(note).transpose(randomInt(-3, 3))
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

		Tone.Master.volume.value = 0;
		Tone.Transport.bpm = 130
	}
});

function randomInt(min, max) {
	min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}