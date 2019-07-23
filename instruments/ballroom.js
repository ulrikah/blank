const Tone = require('tone');

const monoSynth = new Tone.Synth();

const polySynth = new Tone.PolySynth(4, Tone.Synth);
polySynth.set('detune', -20)

polySynth.set( { 
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

polySynth.volume.value = -12;

const filterHigh = new Tone.Filter({
	type  : "highpass" ,
	frequency  : 20 ,
	rolloff  : -12 ,
	Q  : 1 ,
	gain  : 0
});

const phaser = new Tone.Phaser({
	"frequency" : 2,
	"octaves" : 2,
	"baseFrequency" : 200
});

const delay = new Tone.PingPongDelay({
	"delayTime" : "8n",
	"feedback" : 0.6,
	"wet" : 0.3
})

const pingPong = new Tone.PingPongDelay("16n", 0.1);

const distortion = new Tone.Distortion();
distortion.wet.value = 0.2;

const reverb = new Tone.Reverb();
reverb.generate()

// oscillators
exports.monoSynth = monoSynth;
exports.polySynth = polySynth;

// fx
exports.reverb = reverb;
exports.filterHigh = filterHigh;
exports.phaser = phaser;
exports.delay = delay;
exports.pingPong = pingPong;
exports.distortion = distortion;