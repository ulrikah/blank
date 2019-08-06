const Tone = require('tone');
const fn = require('../functions/functions.js')


const synth = new Tone.PolySynth(3, Tone.Synth, {
	"oscillator" : {
		"type" : "triangle",
		"count" : 3,
		"spread" : 30
	},
	"envelope" : {
		"attack" : 0.01,
		"decay" : 0.1,
		"sustain" : 0.5,
		"release" : 0.4,
		"attackCurve" : "exponential"
	},
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

const feedbackDelay = new Tone.FeedbackDelay("8n", 0.5);
const bitCrusher = new Tone.BitCrusher();

const reverb = new Tone.Reverb();

exports.synth = synth;
exports.phaser = phaser;
exports.reverb = reverb;
exports.pingPong = pingPong;