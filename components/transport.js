const Tone = require('tone');


// ____TONE START

// TO DO: place the Tone stuff somewhere else

const pingPong = new Tone.PingPongDelay(0.1, 0.2).toMaster();
const wah = new Tone.AutoWah(50, 6, -30).toMaster();
const sampler = new Tone.Sampler({
	"C1" : "../assets/samples/abc/a.mp3",
	"D1" : "../assets/samples/abc/b.mp3",
	"E1" : "../assets/samples/abc/c.mp3",
	"C2" : "../assets/samples/707/bd1.wav",
	"D2" : "../assets/samples/707/snare1.wav",

	// synth folder
	"C3" : "../assets/samples/synth/kick1.wav",
	"D3" : "../assets/samples/synth/kick8.wav",
	"E3" : "../assets/samples/synth/bass1.wav",
	"F3" : "../assets/samples/synth/bass2.wav",
	"G3" : "../assets/samples/synth/organ.wav",
	"A3" : "../assets/samples/synth/pad1.wav",
	"B3" : "../assets/samples/synth/pad2.wav",
	"C4" : "../assets/samples/synth/perc1.wav",
	// "D4" : "../assets/samples/synth/perc2.wav",
	"E4" : "../assets/samples/synth/perc3.wav",
	"F4" : "../assets/samples/synth/stab.wav",
	"G4" : "../assets/samples/synth/synth.wav"
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

  	// redraw steps if number of steps has changed
  	if (isChange(layers)) {
  		console.log("Updating the number of steps")
  		this.createSteps(layers)
  	}
  	// removing scheduled events
  	Tone.Transport.clear()
  	Tone.Transport.bpm.value = data.bpm;

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
	  				sampler.triggerAttackRelease(layer.note, '8n', Tone.Time('+' + nSteps + 'n') + Tone.Time(nSteps + 'n') * j)
		  		}

		  		// we only need one animation schedule
		  		if (i === 0)
		  		{	
			  		let rads = degs * Math.PI / 180; // degrees to radians
			  		const x = (-Math.cos(rads))*r;
			  		const z = (-Math.sin(rads))*r;

			  		// scheduling animation events with Tone.Draw due to performance:
			  		// https://github.com/Tonejs/Tone.js/wiki/Performance#syncing-visuals
						Tone.Draw.schedule(() => {
				  		ind.setAttribute('position', [x, 0.5, z].join(' '))
						}, Tone.Time('+' + nSteps + 'n') + Tone.Time(nSteps + 'n') * j);
		  		}
					degs += inc;
	  		}
	  		// reset indicator pos at the end of each iteration
				degs = 0;
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
  		const ind = document.getElementById('indicator')
  		ind.parentNode.removeChild(ind)
  	}
  	
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

	  		step.setAttribute('position', [x, 1 + (0.2)*i, z].join(' '));
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