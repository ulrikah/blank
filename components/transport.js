const Tone = require('tone');

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

  	Tone.Transport.loop = true;
  	Tone.Transport.loopEnd = '1m';
  	Tone.Transport.bpm.value = data.bpm;

  	// TO DO: place somewhere else
  	const pingPong = new Tone.PingPongDelay(0.1, 0.8).toMaster();
		const wah = new Tone.AutoWah(50, 6, -30).toMaster();
    const sampler = new Tone.Sampler({
			"C1" : "../assets/samples/a.mp3",
			"D1" : "../assets/samples/b.mp3",
			"E1" : "../assets/samples/c.mp3"
		})

		sampler.connect(pingPong)
		sampler.connect(wah)
    sampler.volume.value = -20;

  	this.el.addEventListener('click', function (evt) {
  		const i = steps.indexOf(evt.target);
  		evt.target.emit('changeStep', { id: i}) // dispatch state action
  	});

  	Tone.Transport.scheduleRepeat(() => { sampler.triggerAttackRelease("A0")}, '2n')
  },

  update: function () {

  },

  createSteps: function(nSteps) {
  	const transportEl = document.querySelector('#transport')
  	for (let i = 0; i < nSteps; i++){
  		// create new step
  		let step = document.createElement('a-entity');
  		step.setAttribute('position', (-Math.floor(nSteps/2) + i) + ' 0 -1');
  		step.setAttribute('mixin', 'step');
  		step.setAttribute('class', 'step');
  		step.setAttribute('radius', 0.2);
  		transportEl.appendChild(step);
  	}

  	// at last, create the current step indicator
		let step = document.createElement('a-sphere');
		step.setAttribute('id', 'indicator');
		step.setAttribute('position', -Math.floor(nSteps/2) + " -1 -1");
		step.setAttribute('transparent', true);
		step.setAttribute('opacity', 0.5);
		step.setAttribute('radius', 0.1);
		step.setAttribute('color', '#FF0000');
		transportEl.appendChild(step);
  }
});