const Tone = require('tone');
const fn = require('../functions/functions.js')

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
	frequency  : 200 ,
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

// wrapper for triggering a sound on collision
function BasicSynthWrapper(synth) {
	this.synth = synth;
	this.collide = (note = "C2", duration = "8n", time = Tone.now(), vel = 0.5, ) => { 
		this.synth.triggerAttackRelease(note, duration, time, vel)
	}
}

function PolySynthWrapper(synth) {
	this.synth = synth;
	this.vel = 0.5;
	this.duration = '8n';

	this.chain = new Tone.CtrlMarkov({
		"beginning" : 
			[	{"value" : "middle", "probability" : 0.6}, 
				{"value" : "end", "probability" : 0.4}],
		"middle" : "end",
		"end" : ["end", "beginning"]
	});
	this.chain.value = "beginning"
	this.parts = 
	{ "beginning": ['C3', 'E3', 'G3'],
		"middle": ['D3', 'F3', 'A3'],
		"end": ['B3', 'D4', 'F4']
	}
	this.ctrl = new Tone.CtrlPattern(
		this.parts["beginning"],
		Tone.CtrlPattern.Type.AlternateDown);

	this.loop = new Tone.Loop( (time) => {
		const note = this.ctrl.next()
		this.synth.triggerAttackRelease(note, this.duration, time, this.vel);
	}, '8n');
	this.loop.humanize = true;

	Tone.Transport.start()

	this.collide = (note = "C2", duration = "8n", time = Tone.now(), vel = 0.5, height = -1) => { 
		this.vel = vel;
		this.ctrl.values = this.parts[this.chain.next()];
		this.loop.start(0)

		// height = THREE.Math.clamp(height, 0, 10); // use height for some filter stuff ?
	}
}

// oscillators
exports.monoSynth = monoSynth;
exports.polySynth = polySynth;

exports.PolySynthWrapper = PolySynthWrapper;
exports.BasicSynthWrapper = BasicSynthWrapper;

// fx
exports.reverb = reverb;
exports.filterHigh = filterHigh;
exports.phaser = phaser;
exports.delay = delay;
exports.pingPong = pingPong;
exports.distortion = distortion;