const Tone = require('tone');

AFRAME.registerComponent('tone-transport-toggle', {
  init: function () {
  	['click', 'gripdown', 'pointup', 'grabend']
  	.forEach(e => this.el.addEventListener(e, function (evt) {
  		Tone.Transport.toggle("+0.1")
    }));
  },
});