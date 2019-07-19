const Tone = require('tone');

AFRAME.registerComponent('tone-transport-toggle', {
  init: function () {
  	['click', 'buttondown']
  	.forEach(e => this.el.addEventListener(e, function (evt) {
  		Tone.Transport.toggle("+0.1")
    }));
  },
});