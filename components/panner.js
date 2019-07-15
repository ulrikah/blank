const Tone = require('tone');

AFRAME.registerComponent('panner-container', {
	
  init: function () {
		this.FOLDER = "../assets/100bpm_luftig/"
		this.TRACKS = [
			{ url:	"bass.mp3", volume: 0},
			{ url:	"drums1.mp3", volume: 0},
			{ url:	"drums2.mp3", volume: 0},
			{ url:	"ice1.mp3", volume: 0},
			{ url:	"ice2.mp3", volume: 0},
			{ url:	"sfx1.mp3", volume: -8},
			{ url:	"sfx2.mp3", volume: -8},
			{ url:	"comet.mp3", volume: -10},
		]
  	
		this.buffers = new Tone.Buffers(this.TRACKS.map( t => this.FOLDER + t.url), () => {
			// callback from onload
			this.createPanner()
			const toggle = document.querySelector('[tone-transport-toggle]')
			toggle.setAttribute('visible', 'true')
		})
  },

  createPanner: function() {
		this.pannerParent = document.getElementById('panner-container');
		const buffers = Object.values(this.buffers._buffers)
		buffers.forEach( b => {
			const panner = new Tone.Panner3D(
				{
					positionX  : 0 ,
					positionY  : 0 ,
					positionZ  : 0 ,
					maxDistance  : 100 ,
					rolloffFactor  : 0.5
				}
			).toMaster()
			const player = new Tone.Player(b._buffer)
			// NB - hacky indexing here will cause problems if not all buffers are loaded for some reason
			player.volume.value = this.TRACKS[buffers.indexOf(b)].volume;
			player.connect(panner)
			player.sync()
			Tone.Transport.schedule( () => { player.start(0) }, '8n');
			this.pannerParent.appendChild(this.createPannerDomEl(panner, true))
		})
  },

  createPannerDomEl: function (panner, animate = true) {
		const pannedEl = document.createElement('a-entity');
		pannedEl.setAttribute('random-material', '');
		pannedEl.setAttribute('mixin', 'torusKnot');
		pannedEl.setAttribute('geometry', 'radius', 1)
		pannedEl.setAttribute('panner-object', { panner : panner	});
		pannedEl.setAttribute('position', [this.randomInt(-20, 20), this.randomInt(-20, 20), this.randomInt(-20, -20)].join(" "))

		if (animate)
		{
			const anim = this.createAnimation();
			anim.appendChild(pannedEl)
			return anim;
		}
		return pannedEl
  },

  createAnimation: function () {
  	const anim = document.createElement('a-entity')
  	anim.setAttribute('animation', {
  		property: 'rotation',
  		to: [Math.random() < 0.5 ? (-1) * 360 : 360,
  				 360,
  				 Math.random() < 0.5 ? (-1) * 360 : 360].join(" "),
  		dur: this.randomInt(10000, 20000),
  		easing: 'linear',
  		dir: Math.random() < 0.5 ? 'reverse' : 'normal',
  		loop: true
  	});
  	return anim;
  },

  randomInt: function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
});