AFRAME.registerComponent('ball-shooter', {
	
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
    const ball = this.createBall()
    ball.setAttribute('velocity', '-8 0 -10');
    AFRAME.scenes[0].appendChild(ball);
    this.el.components.sound.playSound();
  },

  createBall: function () {
  	const ball = document.createElement('a-entity');
    ball.setAttribute('class', 'ball');
    ball.setAttribute('dynamic-body', '');
    ball.setAttribute('geometry', { primitive: 'sphere', radius: 0.1})
    ball.setAttribute('position', this.position);
    ball.setAttribute('material', { src: "#orangesrc", roughness: 0.48, color: "#edaa45"});
    ball.setAttribute('shadow', { cast: true, receive: true })
  	return ball;
  }

});