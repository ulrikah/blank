const fn = require('../functions.js');

AFRAME.registerComponent('shooter', {
	
  init: function () {
  	this.shoot = this.shoot.bind(this);
  	window.addEventListener('click', this.shoot)
  },

  update: function() {
  	this.position = this.el.getAttribute('position');
  	this.rotation = this.el.getAttribute('rotation');
  },

  remove: function() {
  	window.removeEventListener('click', this.shoot);
  },

  shoot: function () {
    const ammo = this.createAmmo()
    ammo.setAttribute('velocity', [fn.randomInt(-10, 10), fn.randomInt(-10, 10), fn.randomInt(0, 10)].join(" "));
    AFRAME.scenes[0].appendChild(ammo);
    this.el.components.sound.playSound();
  },

  createAmmo: function () {
  	const ammo = document.createElement('a-entity');
    ammo.setAttribute('dynamic-body', { shape: 'box'});
    ammo.setAttribute('geometry', { primitive: 'box', width: 0.2, depth: 0.2, height: 0.2})
    ammo.setAttribute('position', this.position);
    ammo.setAttribute('material', { roughness: 0.48, color: "#edaa45"});
    ammo.setAttribute('shadow', { cast: true, receive: true })
  	return ammo;
  },

  randomInt: function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

});