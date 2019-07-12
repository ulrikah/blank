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
  	
		this.pannerParent = document.getElementById('panner-container');
		this.buffer = new Tone.Buffers(this.TRACKS.map( t => this.FOLDER + t.url), () => {
			// callback from buffer
			console.log("LOADED ALL TRACKS")
			document.querySelector('[tone-transport-toggle]').setAttribute('visible', 'true')
		})

		this.TRACKS.forEach( (t) => {
			const panner = new Tone.Panner3D(
				{
					positionX  : 0 ,
					positionY  : 0 ,
					positionZ  : 0 ,
					maxDistance  : 100 ,
					rolloffFactor  : 0.5
				}
			).toMaster()
			const player = new Tone.Player()
			player.load(this.FOLDER + t.url, () => {
				// console.log("Successfully loaded sample", t.url)
				Tone.Transport.schedule( () => {
					player.start(0)
				}, '8n');
			});
			player.volume.value = t.volume;
			player.connect(panner)
			player.sync()

			this.pannerParent.appendChild(this.createPannerDomEl(panner, false))
		});
  },

  createPannerDomEl: function (panner, animate = true) {
		const pannedEl = document.createElement('a-entity');
		pannedEl.setAttribute('random-material', '')
		pannedEl.setAttribute('geometry', {
			primitive: 'sphere',
			radius: 1,
		});
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
  		to: [this.randomInt(0, 360),
  				 360,
  				 this.randomInt(0, 360)].join(" "),
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