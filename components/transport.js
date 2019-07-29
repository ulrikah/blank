const Tone = require('tone');


// ____TONE START

// TO DO: place the Tone stuff somewhere else

const pingPong = new Tone.PingPongDelay(0.1, 0.2).toMaster();
const wah = new Tone.AutoWah(50, 6, -30).toMaster();
const sampler = new Tone.Sampler({
	// "C1" : "../assets/samples/abc/a.mp3",
	// "D1" : "../assets/samples/abc/b.mp3",
	// "E1" : "../assets/samples/abc/c.mp3",
	// "C2" : "../assets/samples/707/bd1.wav",
	// "D2" : "../assets/samples/707/snare1.wav",

	// synth folder
	"C3" : "../assets/samples/synth/kick1.wav",
	"D3" : "../assets/samples/synth/kick8.wav",
	"E3" : "../assets/samples/synth/bass1.wav",
	// "F3" : "../assets/samples/synth/bass2.wav",
	// "G3" : "../assets/samples/synth/organ.wav",
	// "A3" : "../assets/samples/synth/pad1.wav",
	// "B3" : "../assets/samples/synth/pad2.wav",
	"C4" : "../assets/samples/synth/perc1.wav",
	// "D4" : "../assets/samples/synth/perc2.wav",
	"E4" : "../assets/samples/synth/perc3.wav",
	"F4" : "../assets/samples/synth/stab.wav",
	// "G4" : "../assets/samples/synth/synth.wav"
})


// sampler.connect(pingPong)
// sampler.connect(wah)
// sampler.sync() // why does this method take so long to execute the next sequence? is this even necessary?
sampler.connect(Tone.Master)
sampler.volume.value = -20;

// ____TONE END

let degs = 0;
const arc = 240.0
const r = 1; // radius of the arc

AFRAME.registerComponent('transport', {
	schema: {
		layers: {
			default: [ ]
		},
    bpm: {
    	type: 'int',
    	default: 120
    }
  },
  init: function () {
  	this.createSteps(this.data.layers);
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
  	const data = this.data // props, including bound state
  	const layers = data.layers
  	const stepsEl = Array.from(document.querySelectorAll('#transport > .step'));

  	// redraw steps if number of steps has changed
  	if (isChange(layers)) {
  		console.log("Updating the number of steps")
  		this.createSteps(layers)
  	}
  	// removing scheduled events
  	Tone.Transport.clear()
  	Tone.Transport.bpm.value = data.bpm;

  	Tone.Transport.scheduleRepeat(() => {
  		for (let i = 0; i < layers.length; i ++)
  		{		
		  	const layer = layers[i];
				const steps = layer.steps;
				const velocity = layer.velocity;
				const nSteps = steps.length;
  			const inc = (arc / (nSteps-1));

	  		for (let j = 0; j < nSteps; j ++ ){
	  			// trigger sample if current step is active
	  			if (steps[j]){
	  				sampler.triggerAttackRelease(layer.note, '8n', Tone.Time('+' + nSteps + 'n') + Tone.Time(nSteps + 'n') * j, velocity[j])
		  		}

					const currentSteps = stepsEl.filter( (el) => el.getAttribute('column') == j)
		  		Tone.Draw.schedule(() => {
		  			currentSteps.forEach( (cs) => { 
		  				cs.setAttribute('geometry', 'radius', cs.getAttribute('geometry').radius + 0.002) 
		  			})
		  		}, Tone.Time('+' + 0.1) + Tone.Time(nSteps + 'n') * j);
		  		
		  		Tone.Draw.schedule(() => {
		  			currentSteps.forEach( cs => cs.setAttribute('geometry', 'radius', cs.getAttribute('geometry').radius - 0.002))
		  		}, Tone.Time('+' + 0.1) + Tone.Time(nSteps + 'n') * (j + 1))
	  		}
  		}
  	}, '1m')
  },

  createSteps: function(layers) {
  	const transportEl = document.getElementById('transport');
  	const transportChildren = document.querySelectorAll('#transport > .step');

		// removes all steps before creating new ones
  	if (transportChildren.length > 0) {
  		transportChildren.forEach( (ch) => {
  			ch.parentNode.removeChild(ch)
  		});
  	}
  	
  	// create steps for each sequence layer
  	for (let i = 0; i < layers.length; i++)
  	{	
  		const steps = layers[i].steps;
	  	const nSteps = steps.length
	  	const vels = layers[i].velocity;
	  	const inc = arc / (nSteps-1);
	  	for (let j = 0; j < nSteps; j++){
	  		
	  		// create new step
	  		let step = document.createElement('a-entity');
	  		let rads = degs * Math.PI / 180; // degrees to radians
	  		const x = (-Math.cos(rads))*r;
	  		const z = (-Math.sin(rads))*r;

	  		step.setAttribute('position', [x, 1 + (0.2)*i, z].join(' '));
	  		step.setAttribute('mixin', 'step');
	  		step.setAttribute('class', 'step');
	  		step.setAttribute('geometry', 'radius', map(vels[j], 0.5, 1.5, 0.05, 0.08))
	  		step.setAttribute('layer', i);
	  		step.setAttribute('column', j);
	  		steps[j]
	  		? step.setAttribute('material', 'color', invertColor('#EF2D5E'))
				: step.setAttribute('material', 'color', '#EF2D5E');
	  		transportEl.appendChild(step);

	  		degs += inc;
	  	}
	  	degs = 0;
  	}
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

map = (value, low1, high1, low2, high2) => {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
