const Tone = require('tone')

const synth = new Tone.Synth({
	"oscillator" : {
		"type" : "fmsine4",
		"modulationType" : "square"
	}
}).toMaster();


// how to export??