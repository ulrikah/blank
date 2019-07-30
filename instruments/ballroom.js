const Tone = require('tone');
const fn = require('../functions/functions.js')

const monoSynth = new Tone.Synth();

const polySynth = new Tone.PolySynth(4, Tone.Synth);
polySynth.set('detune', -200)


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

const grainPlayer = new Tone.GrainPlayer({
	"url" : "../assets/ballroom/dolph.mp3",
	"loop" : true,
	"grainSize": 0.2,
})

const tremolo = new Tone.Tremolo(15, 0.75);

const filterHigh = new Tone.Filter({
	type  : "highpass" ,
	frequency  : 200 ,
	rolloff  : -12 ,
	Q  : 1 ,
	gain  : 0
});

const filterLow = new Tone.LowpassCombFilter();

var phaser = new Tone.Phaser({
	"frequency" : 15,
	"octaves" : 5,
	"baseFrequency" : 1000
})

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

const feedbackDelay = new Tone.FeedbackDelay("8n", 0.5);
const bitCrusher = new Tone.BitCrusher();

// wrapper for triggering a sound on collision
function BasicSynthWrapper(synth, addFx = false) {
	this.synth = synth;
	this.addFx = addFx;
	this.collide = (note = "C1", duration = "8n", time = Tone.now(), vel = 0.5, height = -1) => { 
		this.synth.triggerAttackRelease(note, duration, time, vel)
	}
}

function GrainPlayerWrapper(grainPlayer, addFx = false) {
	this.synth = grainPlayer;
	this.addFx = addFx;

	this.volMax = -32
	this.synth.volume.value = this.volMax;
	this.synth.detune = 300
	this.synth.loop = false;

	this.collide = (note = "C2", duration = "8n", time = Tone.now(), vel = 0.5, height = -1) => {
		this.synth.start()
		this.synth.volume.value = fn.map(vel, 0.3, 1, -40, this.volMax, true);
		this.synth.detune += fn.map(height, 0, 5, -200, 200, true)
		
		if (this.synth.detune > 400){
			this.synth.detune = 300 + Math.random()*-100;
		}
		else if (this.synth.detune < -400){
			this.synth.detune = 300 + Math.random()*100;	
		}
		else {
			this.synth.detune += Math.random()*(Math.random() > 0.5 ? 100 : -100)
		}
	}
}

function PolySynthWrapper(synth, addFx = false) {
	this.synth = synth;
	this.vel = 0.5;
	this.duration = '16n';
	this.addFx = addFx;

	this.synth.volume.value = -10;

	this.chain = new Tone.CtrlMarkov({
		"beginning" : 
			[	{"value" : "middle", "probability" : 0.6}, 
				{"value" : "end", "probability" : 0.4}],
		"middle" : "end",
		"end" : ["end", "beginning"]
	});
	this.chain.value = "beginning"
	this.parts = 
	{ "beginning": ['C1', 'C1', 'C1', 'C1'],
		"middle": ['D1', 'D1', 'D1', 'D1'],
		"end": ['B0','B0','B0','B0']
	}
	this.ctrl = new Tone.CtrlPattern(
		this.parts["beginning"],
		Tone.CtrlPattern.Type.AlternateUp);

	Tone.Transport.scheduleRepeat( (time) => {
		const note = this.ctrl.next()
		this.synth.triggerAttackRelease(note, this.duration, time, this.vel);
	}, '8n');

	this.collide = (note = "C2", duration = "8n", time = Tone.now(), vel = 0.5, height = -1) => { 
		this.vel = vel;
		this.ctrl.values = this.parts[this.chain.next()];

		// height = THREE.Math.clamp(height, 0, 10); // use height for some filter stuff ?
	}
}

// oscillators
exports.monoSynth = monoSynth;
exports.polySynth = polySynth;
exports.grainPlayer = grainPlayer;

exports.PolySynthWrapper = PolySynthWrapper;
exports.BasicSynthWrapper = BasicSynthWrapper;
exports.GrainPlayerWrapper = GrainPlayerWrapper;

// fx
exports.reverb = reverb;
exports.filterHigh = filterHigh;
exports.filterLow = filterLow;
exports.phaser = phaser;
exports.delay = delay;
exports.pingPong = pingPong;
exports.distortion = distortion;
exports.tremolo = tremolo;
exports.feedbackDelay = feedbackDelay;
exports.bitCrusher = bitCrusher;