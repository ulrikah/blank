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
			default: Array(16).fill(false) // this field is bound to state, so it will automatically update
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

  	// reset
  	if (Array.from(document.querySelectorAll('#transport .step')).length !== data.steps.length){
  		console.log("Updating the number of steps")
  		this.createSteps(data.steps.length)
  	}
  	Tone.Transport.clear()

  	Tone.Transport.bpm.value = data.bpm;

		const steps = data.steps
		const nSteps = steps.length
  	Tone.Transport.scheduleRepeat(() => {
  		for (let i = 0; i < nSteps; i ++ ){
  			if (steps[i]){
  				sampler.triggerAttackRelease('C2', '16n', Tone.Time('+' + nSteps + 'n') + Tone.Time(nSteps + 'n') * i)
	  		}
				Tone.Draw.schedule(() => {
		  		const ind = document.getElementById('indicator');
		  		ind.setAttribute('position', (-(nSteps/2) + i) + " -1 -1")
				}, Tone.Time('+' + nSteps + 'n') + Tone.Time(nSteps + 'n') * i);
  		}
  	}, '1m')
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

  	let degs = 0;
  	const inc = 180.0 / (nSteps-1);
  	const r = 3; // radius

  	for (let i = 0; i < nSteps; i++){
  		
  		// create new step
  		let step = document.createElement('a-entity');
  		let rads = degs * Math.PI / 180; // degrees to radians
  		const x = (-Math.cos(rads))*r;
  		const z = (-Math.sin(rads))*r;

  		step.setAttribute('position', [x, 0, z].join(' '));
  		step.setAttribute('mixin', 'step');
  		step.setAttribute('class', 'step');
  		step.setAttribute('radius', 0.01);
  		transportEl.appendChild(step);

  		
  		// for debugging purposes
  		let txt = document.createElement('a-text');
  		txt.setAttribute('value', '' + i);
  		txt.setAttribute('position', [x, 1, z].join(' '));
  		transportEl.appendChild(txt)

  		degs += inc;
  	}

  	// at last, create the current step indicator
		let ind = document.createElement('a-sphere');
		ind.setAttribute('id', 'indicator');
		ind.setAttribute('position', [-Math.cos(0)*r, -1, -Math.sin(0)*r].join(' '));
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