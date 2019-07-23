const fn = require('../functions/functions.js')

AFRAME.registerComponent('shooter', {
	
  init: function () {
  	this.shoot = this.shoot.bind(this);
  	this.maxVel = 10;
  	this.el.addEventListener('click', this.shoot)
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
    const ammo = this.createAmmo()
    ammo.setAttribute('velocity', [fn.randomInt(-this.maxVel, this.maxVel), fn.randomInt(-this.maxVel, this.maxVel), fn.randomInt(0, this.maxVel)].join(" "));
    AFRAME.scenes[0].appendChild(ammo);
    this.el.components.sound.playSound();
  },

  createAmmo: function () {
  	const ammo = document.createElement('a-entity');
    ammo.setAttribute('mixin', 'ammo')
    ammo.setAttribute('class', 'ammo')
    ammo.setAttribute('collide-sound', { source: Math.random() > 0.5 ? "polySynth" : "monoSynth"})
    ammo.setAttribute('position', this.position);
  	return ammo;
  }

});