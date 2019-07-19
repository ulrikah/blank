const Tone = require('tone');

const monoSynth = new Tone.Synth();

const polySynth = new Tone.PolySynth(3, Tone.Synth, {
	"oscillator" : {
		"type" : "fatsawtooth",
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

polySynth.volume.value = -12;

const pingPong = new Tone.PingPongDelay("16n", 0.1);

exports.monoSynth = monoSynth;
exports.polySynth = polySynth;
exports.pingPong = pingPong;