const Tone = require('tone');

// TO DO: place the Tone stuff somewhere else
const pingPong = new Tone.PingPongDelay(0.1, 0.2).toMaster();
const wah = new Tone.AutoWah(50, 6, -30).toMaster();
const sampler = new Tone.Sampler({
	"C1" : "../assets/samples/a.mp3",
	"D1" : "../assets/samples/b.mp3",
	"E1" : "../assets/samples/c.mp3",
	"C2" : "../assets/samples/707/bd1.wav",
	"D2" : "../assets/samples/707/snare1.wav"
})

sampler.connect(pingPong)
// sampler.connect(wah)
// sampler.sync() // why does this method take so long to execute the next sequence? is this even necessary?
sampler.connect(Tone.Master)
sampler.volume.value = -20;

AFRAME.registerComponent('transport', {
	schema: {
		steps: {
			default: Array(16).fill(false) // this field is bound to state, so it will automatically update
		},
		layers: {
			default: [ 
	    	{ note: 'C2', steps: Array(8).fill(false)},
	    	{ note: 'D2', steps: Array(8).fill(false)}
    	]
		},
    bpm: {
    	type: 'int',
    	default: 120
    }
  },
  init: function () {
  	
  	['click', 'grabend'].forEach(e => this.el.addEventListener(e, function (evt) {
  		evt.target.setAttribute('material', 'color', invertColor(evt.target.getAttribute('material').color))
  		const layer = evt.target.getAttribute('layer')
  		const steps = Array.from(document.querySelectorAll(`#transport > [layer="${layer}"]`)) // convert from nodeList to Array
  		const i = steps.indexOf(evt.target);

			// dispatch state action through an event
  		evt.target.emit('changeStep', 
  			{ id: i, layer: parseInt(layer)}
			)
  	}));
  },

  update: function () {
  	const data = this.data

  	// recreate steps if number of steps has changed
  	if (isChange(data.layers)) {
  		console.log("Updating the number of steps")
  		this.createSteps(data.layers)
  	}
  	Tone.Transport.clear()
  	Tone.Transport.bpm.value = data.bpm;

  	// to make the indicator follow along the arc
  	const layers = data.layers
		let degs = 0;
		const arc = 270.0
  	const r = 0.5; // radius

		const ind = document.getElementById('indicator');

  	Tone.Transport.scheduleRepeat(() => {
  		for (let i = 0; i < layers.length; i ++)
  		{		
		  	const layer = layers[i];
				const steps = layer.steps;
				const nSteps = steps.length;
  			const inc = (arc / (nSteps-1));
	  		for (let j = 0; j < nSteps; j ++ ){
	  			// trigger sample if current step is active
	  			if (steps[j]){
	  				sampler.triggerAttackRelease(layer.note, '16n', Tone.Time('+' + nSteps + 'n') + Tone.Time(nSteps + 'n') * j)
		  		}

		  		/*
		  		let rads = degs * Math.PI / 180; // degrees to radians
		  		const x = (-Math.cos(rads))*r;
		  		const z = (-Math.sin(rads))*r;

		  		// scheduling an animation event with Tone.Draw due to performance:
		  		// https://github.com/Tonejs/Tone.js/wiki/Performance#syncing-visuals
					Tone.Draw.schedule(() => {
			  		ind.setAttribute('position', [x, 0.5, z].join(' '))
					}, Tone.Time('+' + nSteps + 'n') + Tone.Time(nSteps + 'n') * j);
					degs += inc;
					*/
	  		}
	  		// reset at the end of each iteration
				degs = 0;
  		}
  	}, '1m')
  },

  		

  createSteps: function(layers) {
  	const transportEl = document.getElementById('transport');
  	const transportChildren = document.querySelectorAll('#transport > .step');

		// removes all children before creating new ones
  	if (transportChildren.length > 0) {
  		transportChildren.forEach( (ch) => {
  			ch.parentNode.removeChild(ch)
  		});
  		const ind = document.getElementById('indicator')
  		ind.parentNode.removeChild(ind)
  	}

  	let degs = 0;
  	const arc = 270.0
  	const r = 0.5; // radius
  	
  	// create steps for each sequence layer
  	for (let i = 0; i < layers.length; i++)
  	{	
	  	const nSteps = layers[i].steps.length
	  	const inc = arc / (nSteps-1);

	  	for (let j = 0; j < nSteps; j++){
	  		
	  		// create new step
	  		let step = document.createElement('a-entity');
	  		let rads = degs * Math.PI / 180; // degrees to radians
	  		const x = (-Math.cos(rads))*r;
	  		const z = (-Math.sin(rads))*r;

	  		step.setAttribute('position', [x, 1 + (0.3)*i, z].join(' '));
	  		step.setAttribute('mixin', 'step');
	  		step.setAttribute('class', 'step');
	  		step.setAttribute('layer', i);
	  		transportEl.appendChild(step);

	  		degs += inc;
	  	}
	  	degs = 0;
  	}

  	// at last, create the current step indicator
		let ind = document.createElement('a-sphere');
		ind.setAttribute('id', 'indicator');
		ind.setAttribute('position', [-Math.cos(0)*r, 0.5, -Math.sin(0)*r].join(' '));
		ind.setAttribute('transparent', true);
		ind.setAttribute('opacity', 0.5);
		ind.setAttribute('radius', 0.03);
		ind.setAttribute('color', '#FF0000');
		transportEl.appendChild(ind);
  }
});

invertColor = (col) => {
 	return "#" + col.split("").slice(1).reverse().join("")
}

isChange = (layers) => {
	for (let i = 0; i < layers.length; i++)
	{	
		// comparing the length of the state array and the length of the html layer
		const layer = layers[i]
		if (Array.from(document.querySelectorAll(`#transport > [layer="${i}"]`)).length !== layer.steps.length){
			return true;
		}
	}
	return false;
}