const Tone = require('tone');

AFRAME.registerComponent('panner', {
	
  init: function () {
		this.FOLDER = "../assets/100bpm_luftig/"
		this.TRACKS = [
		{ url:	"bass.mp3", volume: 0},
		{ url:	"drums1.mp3", volume: 0},
		{ url:	"drums2.mp3", volume: 0},
		{ url:	"ice1.mp3", volume: 0},
		{ url:	"ice2.mp3", volume: 0},
		{ url:	"sfx1.mp3", volume: 0},
		{ url:	"sfx2.mp3", volume: 0},
		{ url:	"comet.mp3", volume: -10},
		]
  	
		this.pannerParent = document.getElementById('panner');

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
				Tone.Transport.schedule( () => {
					player.start(0)
				}, '8n');
			});
			player.volume.value = t.volume;
			player.connect(panner)
			player.sync()

			this.pannerParent.appendChild(this.createPannerDomElement(panner))
		});
  },

  createPannerDomElement: function (panner, animate = true) {
		const pannerObj = document.createElement('a-entity');
		pannerObj.setAttribute('random-material', '')
		pannerObj.setAttribute('geometry', {
			primitive: 'sphere',
			radius: 1,
		});
		pannerObj.setAttribute('panner-object', { panner : panner	});
		pannerObj.setAttribute('position', [this.randomInt(-50, 50), this.randomInt(-50, 50), this.randomInt(-50, -50)].join(" "))

		if (animate)
		{
			const anim = this.createAnimation();
			anim.appendChild(pannerObj)
			return anim;
		}
		return pannerObj
  },

  createAnimation: function () {
  	const anim = document.createElement('a-entity')
  	anim.setAttribute('animation', {
  		property: 'rotation',
  		to: [Math.random() < 0.5 ? (-1)*this.randomInt(0, 360) : this.randomInt(0, 360),
  				 360,
  				 this.randomInt(0, 360)].join(" "),
  		dur: this.randomInt(10000, 20000),
  		easing: 'linear',
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