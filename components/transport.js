const Tone = require('tone');

AFRAME.registerComponent('transport', {
	schema: {
		steps: {
			default: [false, false, false, false, false, false, false, false,
								false, false, false, false, false, false, false, false]
		},
    bpm: {
    	type: 'int',
    	default: 120
    }
  },
  init: function () {
  	const data = this.data
  	console.log(data)
  	this.createSteps(data.steps.length)

  	Tone.Transport.bpm.value = data.bpm;

  	// TO DO: place somewhere else
  	const pingPong = new Tone.PingPongDelay(0.1, 0.8).toMaster();
		const wah = new Tone.AutoWah(50, 6, -30).toMaster();
    const sampler = new Tone.Sampler({
			"C1" : "../assets/samples/a.mp3",
			"D1" : "../assets/samples/b.mp3",
			"E1" : "../assets/samples/c.mp3",
			"C2" : "../assets/samples/707/bd1.wav",
			"D2" : "../assets/samples/707/snare1.wav"
		})

		// sampler.connect(pingPong)
		sampler.connect(wah)
		// sampler.connect(Tone.Master)
    sampler.volume.value = -20;

  	this.el.addEventListener('click', function (evt) {
  		const steps = Array.from(document.querySelectorAll('.step')) // convert from nodeList to Array
  		evt.target.setAttribute('material', 'color', invertColor(evt.target.getAttribute('material').color))
  		const i = steps.indexOf(evt.target) - 1; // DOM elements are 1-indexed
  		evt.target.emit('changeStep', { id: i}) // dispatch state action
  	});

  	Tone.Transport.scheduleRepeat(() => {
  		const steps = data.steps
  		const nSteps = steps.length
  		for (let i = 0; i < nSteps; i ++ ){
  			if (steps[i]){
	  			sampler.triggerAttackRelease('C2', nSteps + 'n', Tone.Time('+' + nSteps + 'n') + Tone.Time(nSteps + 'n') * i)
	  			// sampler.triggerAttackRelease('D2', nSteps + 'n', Tone.Time('+' + nSteps + 'n') + Tone.Time(nSteps + 'n') * i)
	  		}
  		}
  	}, '1m')
  },

  update: function () {
  	console.log("CHANGE", this.data.steps)
  },

  createSteps: function(nSteps) {
  	const transportEl = document.querySelector('#transport')
  	for (let i = 0; i < nSteps; i++){
  		// create new step
  		let step = document.createElement('a-entity');
  		step.setAttribute('position', (-(nSteps/2) + i) + ' 0 -1');
  		step.setAttribute('mixin', 'step');
  		step.setAttribute('class', 'step');
  		step.setAttribute('radius', 0.2);
  		transportEl.appendChild(step);
  	}

  	// at last, create the current step indicator
		let step = document.createElement('a-sphere');
		step.setAttribute('id', 'indicator');
		step.setAttribute('position', -(nSteps/2) + " -1 -1");
		step.setAttribute('transparent', true);
		step.setAttribute('opacity', 0.5);
		step.setAttribute('radius', 0.1);
		step.setAttribute('color', '#FF0000');
		transportEl.appendChild(step);
  }
});

invertColor = (col) => {
 	return "#" + col.split("").slice(1).reverse().join("")
}