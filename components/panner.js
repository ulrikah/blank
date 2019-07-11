const Tone = require('tone');

AFRAME.registerComponent('panner', {
	
  init: function () {
		this.FOLDER = "../assets/100bpm_luftig/"
		this.TRACKS = [
		{ url:	"bass.mp3", volume: -6},
		{ url:	"drums1.mp3", volume: -6},
		{ url:	"drums2.mp3", volume: -6},
		{ url:	"ice1.mp3", volume: -6},
		{ url:	"ice2.mp3", volume: -6},
		{ url:	"sfx1.mp3", volume: -6},
		{ url:	"sfx2.mp3", volume: -6},
		{ url:	"comet.mp3", volume: -20},
		]
  	
		this.animation = document.getElementById('musicAnimation');

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

			this.animation.appendChild(this.createPanner(panner))
		});
  },

  createPanner: function (panner) {
	
		const pannerObj = document.createElement('a-entity');
		pannerObj.setAttribute('random-material', '')
		pannerObj.setAttribute('geometry', {
			primitive: 'sphere',
			radius: 1,
		});
		pannerObj.setAttribute('panner-object', { panner : panner	});
		pannerObj.setAttribute('position', [this.randomInt(-50, 50), this.randomInt(-50, 50), this.randomInt(-50, -50)].join(" "))
		return pannerObj
  },

  randomInt: function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
});