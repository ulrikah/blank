const Tone = require('tone');

// TO DO: place the Tone stuff somewhere else
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
// sampler.sync() // why does this method take so long to execute the next sequence? is this even necessary?
// sampler.connect(Tone.Master)
sampler.volume.value = -20;

AFRAME.registerComponent('transport', {
	schema: {
		steps: {
			default: Array(16).fill(false)
		},
    bpm: {
    	type: 'int',
    	default: 120
    }
  },
  init: function () {
  	
  	this.el.addEventListener('click', function (evt) {
  		evt.target.setAttribute('material', 'color', invertColor(evt.target.getAttribute('material').color))
  		const steps = Array.from(document.querySelectorAll('#transport > .step')) // convert from nodeList to Array
  		const i = steps.indexOf(evt.target);
  		evt.target.emit('changeStep', { id: i}) // dispatch state action
  	});
  },

  update: function () {
  	const data = this.data

  	if (Array.from(document.querySelectorAll('#transport .step')).length !== data.steps.length){
  		console.log("Updating the number of steps")
  		this.createSteps(data.steps.length)
  	}
  	Tone.Transport.bpm.value = data.bpm;

		const steps = data.steps
		const nSteps = steps.length
  	Tone.Transport.scheduleRepeat(() => {
  		for (let i = 0; i < nSteps; i ++ ){
  			if (steps[i]){
  				// how long should the note be triggered, on a general scale? 
  				sampler.triggerAttackRelease('C2', '8n', Tone.Time('+' + nSteps + 'n') + Tone.Time(nSteps + 'n') * i)
	  		}
  		}
  	}, '1m')
  	
  	/* ATTEMPT AT SYNCING THE VISUAL STEP INDICATOR
  	Tone.Transport.scheduleRepeat(() => {
  		const ind = document.getElementById('indicator');
  		ind.setAttribute('material', 'color', invertColor(ind.getAttribute('material').color))
  	}, '1m');
  	*/
  },

  createSteps: function(nSteps) {
  	const transportEl = document.getElementById('transport');
  	const transportChildren = document.querySelectorAll('#transport > .step');
  	if (transportChildren.length > 0) {
  		// removes all children before creating new ones
  		transportChildren.forEach( (ch) => {
  			ch.parentNode.removeChild(ch)
  		});
  		const ind = document.getElementById('indicator')
  		ind.parentNode.removeChild(ind)

  	}
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
		let ind = document.createElement('a-sphere');
		ind.setAttribute('id', 'indicator');
		ind.setAttribute('position', -(nSteps/2) + " -1 -1");
		ind.setAttribute('transparent', true);
		ind.setAttribute('opacity', 0.5);
		ind.setAttribute('radius', 0.1);
		ind.setAttribute('color', '#FF0000');
		transportEl.appendChild(ind);
  }
});

invertColor = (col) => {
 	return "#" + col.split("").slice(1).reverse().join("")
}