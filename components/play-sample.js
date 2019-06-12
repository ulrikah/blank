const FOLDER = "../assets/samples/"
const SAMPLES = ['a', 'b', 'c'];
const SUFFIX = ".mp3"

const Tone = require('tone')

// Component to change to play an audio sample from Tone.js
AFRAME.registerComponent('play-sample', {
	schema: {
    type: 'string',
    default: 'C1'
  },

  init: function () {
  	const notes = ["C1", "D1", "E1"];
    const sampler = new Tone.Sampler({
			"C1" : "../assets/samples/a.mp3",
			"D1" : "../assets/samples/b.mp3",
			"E1" : "../assets/samples/c.mp3"
		}, function(){
			// sampler will trigger on load
			sampler.triggerAttackRelease("C1")
		}).toMaster()

    this.el.addEventListener('click', function (evt) {
      sampler.triggerAttackRelease(notes[Math.floor(Math.random()*notes.length)])
    });
  }
});