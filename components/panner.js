const Tone = require('tone');

AFRAME.registerComponent('panner', {
	
  init: function () {
		this.FOLDER = "../assets/100bpm_luftig/"
		this.TRACKS = ["bass.mp3", "drums1.mp3", "drums2.mp3", "ice1.mp3", "ice2.mp3", "sfx1.mp3", "sfx2.mp3", "sfx3.mp3"]
  	
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
			player.load(this.FOLDER + t, () => {
				Tone.Transport.schedule( () => {
					player.start(0)
				}, '8n');
			});
			player.volume.value = -6;
			player.connect(panner)
			player.sync()

			this.createPanner(panner)
		});
  },

  createPanner: function (panner) {
  	this.animation = document.getElementById('musicAnimation')
	
		const pannerObj = document.createElement('a-entity');
		pannerObj.setAttribute('random-material', '')
		pannerObj.setAttribute('geometry', {
			primitive: 'sphere',
			radius: 1,
		});
		pannerObj.setAttribute('panner-object', { panner : panner	});
		pannerObj.setAttribute('position', [this.randomInt(-50, 50), this.randomInt(-50, 50), this.randomInt(-50, -50)].join(" "))
		this.animation.appendChild(pannerObj);
  },

  randomInt: function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
});