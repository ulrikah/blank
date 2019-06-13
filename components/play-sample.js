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
		const pingPong = new Tone.PingPongDelay(0.1, 0.8).toMaster();
		const wah = new Tone.AutoWah(50, 6, -30).toMaster();
    const sampler = new Tone.Sampler({
			"C1" : "../assets/samples/a.mp3",
			"D1" : "../assets/samples/b.mp3",
			"E1" : "../assets/samples/c.mp3"
		}, function(){
			// sampler will trigger an estimated sample on load
			sampler.triggerAttackRelease("A-1")
		})

		sampler.connect(pingPong)
		sampler.connect(wah)


    sampler.volume.value = -25;

    this.el.addEventListener('click', function (evt) {
    	// TO DO: should look into this.data for conditional rendering
      sampler.triggerAttackRelease(evt.target.getAttribute('play-sample'))
    });
  }
});