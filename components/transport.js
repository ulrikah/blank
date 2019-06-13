const Tone = require('tone');
const Transport = require('tone').Transport;

AFRAME.registerComponent('transport', {
	schema: {
    nSteps: {
    	type: 'int',
    	default: 8
    },
    bpm: {
    	type: 'int',
    	default: 120
    }
  },
  init: function () {
  	const data = this.data
  	this.createSteps(data.nSteps)
  	const steps = Array.from(document.querySelectorAll('.step')) // convert from nodeList to Array

  	Transport.loop = true;
  	Transport.loopEnd = '1m';
  	Transport.bpm.value = data.bpm;

  	// place somewhere else
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
    sampler.volume.value = -20;

  	console.log("TRANSPORT", Transport)

  	this.el.addEventListener('click', function (evt) {
  		const i = steps.indexOf(evt.target);
  		evt.target.emit('changeStep', { id: i}) // dispatch state action
  	});

  	Transport.start()
  	Transport.scheduleRepeat(() => { sampler.triggerAttackRelease("A-1")}, '4n')
  },

  pause: function () {
  	Transport.stop();
  },

  play: function () {
  	Transport.start();
  },

  createSteps: function(nSteps) {
  	const transportEl = document.querySelector('#transport')
  	for (let i = 0; i < nSteps; i++){
  		// create new step
  		let step = document.createElement('a-dodecahedron');
  		step.setAttribute('position', i + ' 0 -7');
  		step.setAttribute('class', 'step');
  		step.setAttribute('radius', 0.3);
  		step.setAttribute('color', '#AABBCC');
  		step.setAttribute('toggle-color', '');
  		transportEl.appendChild(step);
  	}

  	// at last, create the current step indicator
		let step = document.createElement('a-dodecahedron');
		step.setAttribute('id', 'indicator');
		step.setAttribute('position', "0 -1 -7");
		step.setAttribute('transparent', true);
		step.setAttribute('opacity', 0.5);
		step.setAttribute('radius', 0.1);
		step.setAttribute('color', '#FF0000');
		transportEl.appendChild(step);
  }
});