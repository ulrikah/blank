const fn = require('../functions/functions.js')
const Tone = require('tone')

AFRAME.registerComponent('boom', {
	
  init: function () {
  	this.shoot = this.shoot.bind(this);
  	this.maxVel = 5;
  	this.el.addEventListener('click', this.shoot)

		const player = new Tone.Player("../assets/samples/boom/sample1.mp3").toMaster();

  	this.pianoSamples = new Tone.Buffers({
			"C4" : "../assets/samples/boom/sample1.mp3",
			"C#4" : "../assets/samples/boom/sample2.mp3",
			"D4" : "../assets/samples/boom/sample3.mp3",
		}, function(){
			//play one of the samples when they all load
			console.log("All samples loaded");
			// player.buffer = pianoSamples.get('D4');
			player.start()

		});
  },

  update: function() {
  	this.position = this.el.getAttribute('position');
  	this.rotation = this.el.getAttribute('rotation');
  },

  remove: function() {
  	const el = this.el;
  	el.removeEventListener('click', this.shoot);
  },

  shoot: function () {
  	console.log("GO")
    const ammo = this.createAmmo()
    ammo.setAttribute('velocity', [fn.randomInt(-this.maxVel, this.maxVel), fn.randomInt(-this.maxVel, this.maxVel), fn.randomInt(0, this.maxVel)].join(" "));
    AFRAME.scenes[0].appendChild(ammo);
    this.el.components.sound.playSound();
  },

  createAmmo: function () {
  	// TO DO: set random .obj model
  	const ammo = document.createElement('a-entity');
    ammo.setAttribute('class', 'ammo')
    ammo.setAttribute('geometry', { 'primitive': 'sphere', 'radius': 0.2 })
    ammo.setAttribute('dynamic-body', { shape: 'sphere'})
    ammo.setAttribute('material', { 'color': 'pink', 'metalness': 0.9 })
    ammo.setAttribute('mixin', 'ammo')
    ammo.setAttribute('position', this.position);
  	return ammo;
  }

});