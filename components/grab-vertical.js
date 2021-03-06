// This component was forked from https://github.com/donmccurdy/aframe-extras

/* global AFRAME, THREE */

/**
* Handles events coming from the hand-controls.
* Determines if the entity is grabbed or released.
* Updates its height to move along the controller.
*/
AFRAME.registerComponent('grab-vertical', {
	schema: {
		target: { default: '' },
		heightRange: { 
			type: 'array', 
			default: [0.5, 2],
			parse: function (value) {
      	return value.split(' ').map(v => parseFloat(v));
	    },
	    stringify: function (value) {
	      return value.join(' ');
	    }
		}
	},

  init: function () {
    this.GRABBED_STATE = 'grabbed';
    // Bind event handlers
    this.onHit = this.onHit.bind(this);
    this.onGripOpen = this.onGripOpen.bind(this);
    this.onGripClose = this.onGripClose.bind(this);
    this.currentPosition = new THREE.Vector3();
  },

  play: function () {
    var el = this.el;
    el.addEventListener('hit', this.onHit);
    el.addEventListener('buttondown', this.onGripClose);
    el.addEventListener('buttonup', this.onGripOpen);
  },

  pause: function () {
    var el = this.el;
    el.removeEventListener('hit', this.onHit);
    el.addEventListener('buttondown', this.onGripClose);
    el.addEventListener('buttonup', this.onGripOpen);
  },

  onGripClose: function (evt) {
    if (this.grabbing) { return; }
    this.grabbing = true;
    this.pressedButtonId = evt.detail.id;
    delete this.previousPosition;
  },

  onGripOpen: function (evt) {
    var hitEl = this.hitEl;
    if (this.pressedButtonId !== evt.detail.id) { return; }
    this.grabbing = false;
    if (!hitEl) { return; }
    hitEl.removeState(this.GRABBED_STATE);
    hitEl.emit('grabend');
    this.hitEl = undefined;
  },

  onHit: function (evt) {
    var hitEl = evt.detail.el;
    // If the element is already grabbed (it could be grabbed by another controller).
    // If the hand is not grabbing the element does not stick.
    // If we're already grabbing something you can't grab again.
    if (!hitEl || hitEl.is(this.GRABBED_STATE) || !this.grabbing || this.hitEl) { return; }
    if (!hitEl.classList.contains(this.data.target)) {
    	return; 
    }
    hitEl.addState(this.GRABBED_STATE);
    this.hitEl = hitEl;
  },

  tick: function () {
    var hitEl = this.hitEl;
    var position;
    if (!hitEl) { return; }
    if (hitEl.is(this.GRABBED_STATE)){
    	hitEl.emit('grab')
    }

    this.updateDelta();

    // updates the scale in relation to change in z position
    const n = THREE.Math.mapLinear(this.deltaPosition.y, -0.1, 0.1, 0.85, 1.15)

    // hacky check to see if the new value is within the desired range
    height = hitEl.getAttribute('geometry').height;
    if (!(height * n < this.data.heightRange[0] || height * n > this.data.heightRange[1])){
  		hitEl.setAttribute('height', height*n)
    }
  },

  updateDelta: function () {
    var currentPosition = this.currentPosition;
    this.el.object3D.updateMatrixWorld();
    currentPosition.setFromMatrixPosition(this.el.object3D.matrixWorld);
    if (!this.previousPosition) {
      this.previousPosition = new THREE.Vector3();
      this.previousPosition.copy(currentPosition);
    }
    var previousPosition = this.previousPosition;
    var deltaPosition = {
      x: currentPosition.x - previousPosition.x,
      y: currentPosition.y - previousPosition.y,
      z: currentPosition.z - previousPosition.z
    };
    this.previousPosition.copy(currentPosition);
    this.deltaPosition = deltaPosition;
  }
});
